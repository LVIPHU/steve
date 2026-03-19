"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { generateSlug } from "@/lib/slugify";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createWebsite(formData: FormData): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  const name = (formData.get("name") as string)?.trim();
  const promptText = (formData.get("promptText") as string)?.trim() ?? "";

  if (!name) return;

  const id = crypto.randomUUID();
  const slug = generateSlug(name);

  await db.insert(websites).values({
    id,
    userId: session.user.id,
    name,
    slug,
    status: "draft",
    templateId: null,
    content: null,
    seoMeta: null,
    htmlContent: null,
  });

  // redirect outside try/catch — Next.js redirect throws NEXT_REDIRECT
  redirect(`/dashboard/websites/${id}/edit?prompt=${encodeURIComponent(promptText.slice(0, 500))}`);
}
