import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { generateSlug } from "@/lib/slugify";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name;
  if (typeof name !== "string" || name.trim().length === 0) {
    return Response.json({ error: "name must be a non-empty string" }, { status: 400 });
  }

  const slug = generateSlug(name.trim());

  const [created] = await db
    .insert(websites)
    .values({
      userId: session.user.id,
      name: name.trim(),
      slug,
      status: "draft",
    })
    .returning({ id: websites.id });

  return Response.json({ id: created.id, slug }, { status: 201 });
}
