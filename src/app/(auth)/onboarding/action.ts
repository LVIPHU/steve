"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const RESERVED_USERNAMES = [
  "dashboard", "editor", "api", "login", "register",
  "settings", "pricing", "about", "admin",
];
const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

export async function setUsername(username: string): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const trimmed = username.trim().toLowerCase();

  if (!USERNAME_REGEX.test(trimmed)) {
    return { error: "Tên người dùng không hợp lệ. Chỉ dùng chữ thường, số và dấu gạch ngang." };
  }
  if (RESERVED_USERNAMES.includes(trimmed)) {
    return { error: "Tên người dùng này không khả dụng." };
  }

  // Check if profile already exists
  const existing = await db.select().from(profiles).where(eq(profiles.id, session.user.id)).limit(1);
  if (existing.length > 0) {
    return { error: "Profile already exists" };
  }

  try {
    await db.insert(profiles).values({
      id: session.user.id,
      username: trimmed,
      plan: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (err: unknown) {
    // Unique constraint violation = duplicate username
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "Tên người dùng đã được sử dụng. Vui lòng chọn tên khác." };
    }
    return { error: "Đăng ký thất bại. Vui lòng thử lại." };
  }

  return {};
}
