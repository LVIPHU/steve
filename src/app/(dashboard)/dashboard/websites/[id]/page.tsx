import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites, profiles } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";
import DashboardNav from "../../dashboard-nav";
import { WebsiteDetailClient } from "./website-detail-client";

type Params = Promise<{ id: string }>;

export default async function WebsiteDetailPage({
  params,
}: {
  params: Params;
}) {
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
  const template = TEMPLATES.find((t) => t.id === website.templateId);

  // Get username for public URL display
  const profileResults = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);
  const username = profileResults[0]?.username ?? "";

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <WebsiteDetailClient
          website={JSON.parse(JSON.stringify(website))}
          templateName={template?.name ?? "Unknown"}
          templateEmoji={template?.icon ?? ""}
          username={username}
        />
      </main>
    </div>
  );
}
