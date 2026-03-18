import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { buildSystemPrompt, buildSectionRegenPrompt } from "@/lib/ai-prompts";
import type { SectionType } from "@/types/website-ast";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    websiteId: string;
    sectionId: string;
    sectionType: SectionType;
    prompt?: string;
    currentContent?: Record<string, unknown>;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { websiteId, sectionId, sectionType, prompt, currentContent } = body;

  if (!websiteId || !sectionId || !sectionType) {
    return Response.json(
      { error: "websiteId, sectionId, and sectionType are required" },
      { status: 400 }
    );
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
          {
            role: "user",
            content: buildSectionRegenPrompt(sectionType, prompt, currentContent),
          },
        ],
      },
      { signal: AbortSignal.timeout(30000) }
    );

    const raw = completion.choices[0].message.content ?? "{}";
    let parsedContent: unknown;
    try {
      parsedContent = JSON.parse(raw);
    } catch {
      return Response.json({ error: "regeneration_failed" }, { status: 500 });
    }

    if (typeof parsedContent !== "object" || parsedContent === null) {
      return Response.json({ error: "regeneration_failed" }, { status: 500 });
    }

    // Do NOT save to DB — client merges into local state and saves via Save button
    return Response.json({ ai_content: parsedContent });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return Response.json({ error: "timeout" }, { status: 504 });
    }
    console.error("Section regeneration failed:", err);
    return Response.json({ error: "regeneration_failed" }, { status: 500 });
  }
}
