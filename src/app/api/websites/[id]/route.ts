import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";

const VALID_STATUSES = ["draft", "published", "archived"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate fields
  const updateSet: Record<string, unknown> = {};

  if ("name" in body) {
    const name = body.name;
    if (typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "name must be a non-empty string" }, { status: 400 });
    }
    updateSet.name = name.trim();
  }

  if ("status" in body) {
    const status = body.status;
    if (!VALID_STATUSES.includes(status as ValidStatus)) {
      return Response.json(
        { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    updateSet.status = status;
  }

  if ("slug" in body) {
    const slug = body.slug;
    if (typeof slug !== "string" || slug.trim().length === 0) {
      return Response.json({ error: "slug must be a non-empty string" }, { status: 400 });
    }
    // Check slug uniqueness for this user
    const conflict = await db
      .select()
      .from(websites)
      .where(and(eq(websites.userId, session.user.id), eq(websites.slug, slug as string)))
      .limit(1);
    if (conflict.length > 0 && conflict[0].id !== id) {
      return Response.json({ error: "slug_conflict" }, { status: 409 });
    }
    updateSet.slug = (slug as string).trim();
  }

  if ("html_content" in body) {
    const htmlContent = body.html_content;
    if (typeof htmlContent !== "string") {
      return Response.json({ error: "html_content must be a string" }, { status: 400 });
    }
    updateSet.htmlContent = htmlContent;
  }

  if ("chat_history" in body) {
    const chatHistory = body.chat_history;
    if (chatHistory !== null && typeof chatHistory !== "object") {
      return Response.json({ error: "chat_history must be an array, object, or null" }, { status: 400 });
    }
    updateSet.chatHistory = chatHistory;
  }

  if ("pages" in body) {
    const pages = body.pages;
    if (pages !== null && (typeof pages !== "object" || Array.isArray(pages))) {
      return Response.json({ error: "pages must be an object or null" }, { status: 400 });
    }
    updateSet.pages = pages;
  }

  if (Object.keys(updateSet).length === 0) {
    return Response.json({ error: "No valid fields to update" }, { status: 400 });
  }

  // Ownership check
  const existing = await db
    .select()
    .from(websites)
    .where(and(eq(websites.id, id), eq(websites.userId, session.user.id)))
    .limit(1);

  if (existing.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await db
    .update(websites)
    .set({ ...updateSet, updatedAt: new Date() })
    .where(eq(websites.id, id));

  return Response.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Ownership check
  const existing = await db
    .select()
    .from(websites)
    .where(and(eq(websites.id, id), eq(websites.userId, session.user.id)))
    .limit(1);

  if (existing.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(websites).where(eq(websites.id, id));

  return Response.json({ ok: true });
}
