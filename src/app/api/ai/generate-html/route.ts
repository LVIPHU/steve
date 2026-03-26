import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { runGenerationPipeline } from "@/lib/ai-pipeline";
import { runMultiPageExpansion } from "@/lib/ai-pipeline/multi-page-orchestrator";
import type { PipelineEvent } from "@/lib/ai-pipeline";

export const maxDuration = 300; // 5 min for multi-page generation with 100+ vocab

function sseData(event: PipelineEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: Request) {
  // 1. Auth check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Parse body
  const { websiteId, prompt, currentHtml, pageName = "index" } = await request.json() as {
    websiteId: string;
    prompt: string;
    currentHtml?: string;
    pageName?: string;
  };
  if (!websiteId || !prompt) {
    return Response.json({ error: "websiteId and prompt are required" }, { status: 400 });
  }

  // 3. Ownership check
  const existing = await db.select().from(websites)
    .where(and(eq(websites.id, websiteId), eq(websites.userId, session.user.id)))
    .limit(1);
  if (existing.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // 4. Extract design context from existing pages for cross-page consistency
  const existingPages = (existing[0].pages as Record<string, string>) ?? {};

  const otherPagesContext = Object.entries(existingPages)
    .filter(([name, html]) => name !== pageName && typeof html === "string" && html.length > 100)
    .slice(0, 3)
    .map(([name, html]) => {
      const palette = (html.match(/--color-[a-z]+:\s*#[0-9a-f]{3,6}/gi) || []).join("; ");
      const fonts = (html.match(/family=([A-Za-z+]+)/g) || [])
        .map(f => f.replace("family=", "").replace(/\+/g, " "))
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(", ");
      const navLinks = (html.match(/<a[^>]*href="([a-z][a-z0-9-]*)"[^>]*>/gi) || [])
        .map(a => a.match(/href="([^"]+)"/)?.[1])
        .filter(Boolean)
        .join(", ");
      return `Page "${name}": palette=[${palette}] fonts=[${fonts}] nav-links=[${navLinks}]`;
    })
    .filter(Boolean)
    .join("\n");

  // 5. SSE streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: PipelineEvent) => {
        controller.enqueue(new TextEncoder().encode(sseData(event)));
      };

      try {
        const result = await runGenerationPipeline({
          prompt,
          currentHtml: currentHtml || undefined,
          onEvent: send,
          otherPagesContext: otherPagesContext || undefined,
        });

        // Auto-save to DB — atomic jsonb_set into pages[pageName]
        await db.execute(
          sql`UPDATE websites
              SET pages = jsonb_set(COALESCE(pages, '{}'), ARRAY[${pageName}], to_jsonb(${result.html}::text)),
                  updated_at = NOW()
              WHERE id = ${websiteId}`
        );

        send({ step: "complete", status: "done", html: result.html });

        // 6. Multi-page expansion (only for fresh index generation with ENABLE_MULTI_PAGE)
        const enableMultiPage = process.env.ENABLE_MULTI_PAGE === "true";
        if (
          enableMultiPage &&
          !currentHtml &&
          pageName === "index" &&
          result.analysis &&
          result.design
        ) {
          await runMultiPageExpansion({
            prompt,
            indexHtml: result.html,
            analysis: result.analysis,
            design: result.design,
            websiteId,
            onEvent: send,
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Generation failed";
        send({ step: "error", status: "done", error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
