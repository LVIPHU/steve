import { auth } from "@/lib/auth";
import { db } from "@/db";
import { verification } from "@/db/schema";

export async function POST(request: Request) {
  // Validate mobile app's session via Bearer token (bearer plugin handles this)
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Store one-time token in verification table
  // Use "mobile-token:" prefix on identifier to avoid collision with better-auth internal verification uses
  await db.insert(verification).values({
    id: crypto.randomUUID(),
    identifier: `mobile-token:${session.user.id}`,
    value: token,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return Response.json({ token, expiresAt: expiresAt.toISOString() });
}
