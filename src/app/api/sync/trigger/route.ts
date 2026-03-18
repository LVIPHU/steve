import { after } from "next/server";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai-prompts";
import { parseAndValidateAST } from "@/lib/ast-utils";
import { mergeAiSectionsIntoAst } from "@/lib/sync-utils";
import type { WebsiteAST } from "@/types/website-ast";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  // Auth check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Request body validation
  let body: { noteId?: string; noteContent?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { noteId, noteContent } = body;
  if (!noteId) {
    return Response.json({ error: "noteId required" }, { status: 400 });
  }

  // Find all websites scoped to this user matching the note ID
  const targets = await db
    .select()
    .from(websites)
    .where(
      and(eq(websites.sourceNoteId, noteId), eq(websites.userId, session.user.id))
    );

  if (targets.length === 0) {
    return Response.json({ ok: true, updatedCount: 0 });
  }

  // Mark all targets as syncing immediately
  await Promise.all(
    targets.map((w) =>
      db.update(websites).set({ syncStatus: "syncing" }).where(eq(websites.id, w.id))
    )
  );

  // Run AI regeneration in background — response is not blocked
  after(async () => {
    for (const website of targets) {
      try {
        const completion = await openai.chat.completions.create(
          {
            model: "gpt-4o",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: buildSystemPrompt(website.templateId ?? "blog") },
              {
                role: "user",
                content: buildUserPrompt(JSON.stringify(noteContent)),
              },
            ],
          },
          { signal: AbortSignal.timeout(30000) }
        );

        const raw = completion.choices[0].message.content ?? "{}";
        const newAst = parseAndValidateAST(raw);
        const existingAst = website.content as WebsiteAST;
        const mergedAst = mergeAiSectionsIntoAst(existingAst, newAst);

        await db
          .update(websites)
          .set({
            content: mergedAst,
            seoMeta: mergedAst.seo,
            syncStatus: "synced",
            lastSyncedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(websites.id, website.id));
      } catch {
        await db
          .update(websites)
          .set({ syncStatus: "sync_failed", updatedAt: new Date() })
          .where(eq(websites.id, website.id));
      }
    }
  });

  return Response.json({ ok: true, updatedCount: targets.length });
}
