import { db } from "@/db";
import { verification, sessions } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serializeSignedCookie } from "better-call";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    redirect("/login?error=invalid-token");
  }

  // Find valid, non-expired token in verification table
  const [record] = await db
    .select()
    .from(verification)
    .where(
      and(
        eq(verification.value, token),
        gt(verification.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!record) {
    // Could be invalid or expired — check if token exists but expired
    const [expiredRecord] = await db
      .select()
      .from(verification)
      .where(eq(verification.value, token))
      .limit(1);

    if (expiredRecord) {
      // Token existed but expired — clean it up
      await db.delete(verification).where(eq(verification.id, expiredRecord.id));
      redirect("/login?error=expired-token");
    }

    redirect("/login?error=invalid-token");
  }

  // Extract userId from identifier (format: "mobile-token:{userId}")
  const userId = record.identifier.replace("mobile-token:", "");

  // Delete token immediately (single-use)
  await db.delete(verification).where(eq(verification.id, record.id));

  // Create a new web session using direct DB insert
  // The session token is a raw UUID stored in the DB; the cookie stores a signed version of it
  const sessionToken = crypto.randomUUID();
  const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(sessions).values({
    id: crypto.randomUUID(),
    userId,
    token: sessionToken,
    expiresAt: sessionExpiresAt,
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent") || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Sign the session token the same way better-auth does internally
  // better-auth uses serializeSignedCookie from better-call to sign cookies
  const secret = process.env.BETTER_AUTH_SECRET!;
  const isProduction = process.env.NODE_ENV === "production";

  // Cookie name: "__Secure-better-auth.session_token" in production, "better-auth.session_token" in dev
  const cookieName = isProduction
    ? "__Secure-better-auth.session_token"
    : "better-auth.session_token";

  const signedCookieValue = (
    await serializeSignedCookie("", sessionToken, secret)
  ).replace("=", "");

  const cookieStore = await cookies();
  cookieStore.set(cookieName, signedCookieValue, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    expires: sessionExpiresAt,
  });

  redirect("/dashboard");
}
