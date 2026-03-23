import { db } from "@/db";
import { websites, profiles } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string; slug: string; page: string }> }
) {
  const { username, slug, page } = await params;

  // Look up profile by username
  const profileResults = await db.select().from(profiles)
    .where(eq(profiles.username, username)).limit(1);
  if (profileResults.length === 0) {
    return new Response(null, { status: 404 });
  }

  // Look up website by userId + slug
  const websiteResults = await db.select().from(websites)
    .where(and(eq(websites.userId, profileResults[0].id), eq(websites.slug, slug)))
    .limit(1);
  if (websiteResults.length === 0) {
    return new Response(null, { status: 404 });
  }

  const website = websiteResults[0];

  // Draft → 404
  if (website.status === "draft") {
    return new Response(null, { status: 404 });
  }

  // Archived → plain HTML message
  if (website.status === "archived") {
    return new Response(
      `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>Trang da bi luu tru</title></head><body style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;"><p>Trang da bi luu tru</p></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // Published — serve pages[page]
  const pages = (website.pages as Record<string, string> | null) ?? {};
  const html = pages[page] ?? null;
  if (!html) {
    return new Response(null, { status: 404 });
  }

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
