import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai-prompts";
import { parseAndValidateAST } from "@/lib/ast-utils";
import { generateSlug } from "@/lib/slugify";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  // Auth check (same pattern as PATCH /api/websites/[id])
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { websiteId: string; noteJson?: string; prompt?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { websiteId, noteJson, prompt } = body;
  if (!websiteId) {
    return Response.json({ error: "websiteId is required" }, { status: 400 });
  }

  // Ownership check
  const existing = await db
    .select()
    .from(websites)
    .where(and(eq(websites.id, websiteId), eq(websites.userId, session.user.id)))
    .limit(1);

  if (existing.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const website = existing[0];

  try {
    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt(website.templateId ?? "blog") },
          { role: "user", content: buildUserPrompt(noteJson, prompt) },
        ],
      },
      { signal: AbortSignal.timeout(30000) }
    );

    const raw = completion.choices[0].message.content ?? "{}";
    const ast = parseAndValidateAST(raw);

    // Save content + seoMeta to DB, keep status unchanged
    // IMPORTANT: Normalize slug via generateSlug() per RESEARCH.md Pitfall 5
    await db
      .update(websites)
      .set({
        content: ast,
        seoMeta: ast.seo,
        slug: generateSlug(ast.seo.slug),
        updatedAt: new Date(),
      })
      .where(eq(websites.id, websiteId));

    return Response.json({ ok: true, content: ast });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return Response.json({ error: "timeout" }, { status: 504 });
    }
    console.error("AI generation failed:", err);
    return Response.json({ error: "generation_failed" }, { status: 500 });
  }
}
