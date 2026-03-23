import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { strToU8, zipSync } from "fflate";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Ownership check
  const result = await db
    .select()
    .from(websites)
    .where(and(eq(websites.id, id), eq(websites.userId, session.user.id)))
    .limit(1);

  if (result.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const website = result[0];
  const pages = (website.pages as Record<string, string> | null) ?? {};

  // Check if there are any pages with content
  const hasContent = Object.values(pages).some((html) => html && html.trim());
  if (!hasContent) {
    return Response.json({ error: "No pages to export" }, { status: 400 });
  }

  // Build ZIP
  const files: Record<string, Uint8Array> = {};
  for (const [pageName, html] of Object.entries(pages)) {
    if (html && html.trim()) {
      files[`${pageName}.html`] = strToU8(html);
    }
  }

  const zipBuffer = zipSync(files, { level: 6 });
  const slug = website.slug || "website";

  return new Response(zipBuffer.buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="website-${slug}.zip"`,
    },
  });
}
