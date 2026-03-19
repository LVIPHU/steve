import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import OpenAI from "openai";
import { buildFreshSystemPrompt, buildEditSystemPrompt, stripMarkdownFences } from "@/lib/html-prompts";

export const maxDuration = 90;

const openai = new OpenAI();

export async function POST(request: Request) {
  // 1. Auth check (same pattern as generate/route.ts)
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Parse body
  const { websiteId, prompt, currentHtml } = await request.json();
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

  // 4. Build system prompt (fresh vs edit mode)
  const isEdit = Boolean(currentHtml);
  const systemPrompt = isEdit
    ? buildEditSystemPrompt(currentHtml)
    : buildFreshSystemPrompt();

  try {
    // 5. OpenAI call — NO response_format (text output)
    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      },
      { signal: AbortSignal.timeout(90000) }
    );

    const raw = completion.choices[0].message.content ?? "";
    const html = stripMarkdownFences(raw);

    // 6. Auto-save to DB
    await db.update(websites)
      .set({ htmlContent: html, updatedAt: new Date() })
      .where(eq(websites.id, websiteId));

    return Response.json({ ok: true, html });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return Response.json({ error: "Generation timed out" }, { status: 504 });
    }
    console.error("generate-html error:", error);
    return Response.json({ error: "Generation failed" }, { status: 500 });
  }
}
