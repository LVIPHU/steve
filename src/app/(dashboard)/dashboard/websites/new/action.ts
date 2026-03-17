"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { generateSlug } from "@/lib/slugify";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createWebsite(data: {
  name: string;
  templateId: string;
  sourceNoteId?: string;
  promptText?: string;
}): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Phien lam viec het han. Vui long dang nhap lai." };

  const trimmedName = data.name.trim();
  if (!trimmedName) return { error: "Vui long nhap ten website" };
  if (!data.templateId) return { error: "Vui long chon mot template" };

  const id = crypto.randomUUID();
  const slug = generateSlug(trimmedName);

  try {
    await db.insert(websites).values({
      id,
      userId: session.user.id,
      name: trimmedName,
      slug,
      status: "draft",
      sourceNoteId: data.sourceNoteId?.trim() || null,
      templateId: data.templateId,
      content: null,
      seoMeta: null,
    });
  } catch {
    return { error: "Co loi xay ra. Vui long thu lai." };
  }

  redirect(`/dashboard/websites/${id}`);
}
