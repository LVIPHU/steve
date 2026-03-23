import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import HtmlEditorClient from "./editor-client";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ prompt?: string }>;

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { id } = await params;
  const { prompt } = await searchParams;

  const result = await db
    .select()
    .from(websites)
    .where(and(eq(websites.id, id), eq(websites.userId, session.user.id)))
    .limit(1);

  if (result.length === 0) notFound();

  const website = result[0];

  // Build initialPages: use pages column if available, fallback to htmlContent for legacy websites
  const initialPages = (website.pages as Record<string, string> | null) ??
    (website.htmlContent ? { index: website.htmlContent as string } : {});

  // Normalize chat history: if array (old format), wrap as { index: [...] }
  const rawChatHistory = website.chatHistory;
  type ChatMsg = { role: "user" | "assistant" | "error"; content: string; timestamp: string };
  const initialChatHistory = !rawChatHistory
    ? {}
    : Array.isArray(rawChatHistory)
    ? { index: rawChatHistory as ChatMsg[] }
    : (rawChatHistory as Record<string, ChatMsg[]>);

  return (
    <HtmlEditorClient
      websiteId={website.id}
      websiteName={website.name}
      websiteSlug={website.slug}
      initialPages={initialPages}
      initialPrompt={prompt ?? ""}
      websiteStatus={website.status}
      initialChatHistory={initialChatHistory}
    />
  );
}
