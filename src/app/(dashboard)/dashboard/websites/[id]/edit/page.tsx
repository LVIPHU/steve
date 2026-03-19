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

  return (
    <HtmlEditorClient
      websiteId={website.id}
      websiteName={website.name}
      initialHtml={(website.htmlContent as string | null) ?? null}
      initialPrompt={prompt ?? ""}
      websiteStatus={website.status}
    />
  );
}
