import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { runGenerationPipeline } from "@/lib/ai-pipeline";
import type { PipelineEvent } from "@/lib/ai-pipeline";

export const maxDuration = 60; // Hobby plan limit; set to 120 when upgrading to Pro

function sseData(event: PipelineEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: Request) {
  // 1. Auth check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Parse body
  const { websiteId, prompt, currentHtml } = await request.json() as {
    websiteId: string;
    prompt: string;
    currentHtml?: string;
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

  // 4. SSE streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: PipelineEvent) => {
        controller.enqueue(new TextEncoder().encode(sseData(event)));
      };

      try {
        const html = await runGenerationPipeline(prompt, currentHtml || undefined, send);

        // Auto-save to DB
        await db.update(websites)
          .set({ htmlContent: html, updatedAt: new Date() })
          .where(eq(websites.id, websiteId));

        send({ step: "complete", status: "done", html });
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
