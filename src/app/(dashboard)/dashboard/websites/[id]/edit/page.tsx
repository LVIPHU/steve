import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites, profiles } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import type { WebsiteAST } from "@/types/website-ast";
import { EditorClient } from "./editor-client";

type Params = Promise<{ id: string }>;

export default async function EditPage({ params }: { params: Params }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { id } = await params;

  const results = await db
    .select()
    .from(websites)
    .where(and(eq(websites.id, id), eq(websites.userId, session.user.id)))
    .limit(1);

  if (results.length === 0) notFound();

  const website = results[0];

  // Can't edit what hasn't been generated yet
  if (!website.content) {
    redirect(`/dashboard/websites/${id}`);
  }

  const profileResults = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);
  const _username = profileResults[0]?.username ?? "";

  const initialAst = JSON.parse(JSON.stringify(website.content)) as WebsiteAST;

  return (
    <EditorClient
      websiteId={id}
      initialAst={initialAst}
      websiteName={website.name}
      templateId={website.templateId ?? "blog"}
    />
  );
}
