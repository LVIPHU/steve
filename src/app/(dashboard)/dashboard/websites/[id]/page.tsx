import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";
import DashboardNav from "../../dashboard-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      aria-label={`Trang thai: ${status}`}
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        status === "published" &&
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        status === "draft" &&
          "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        status === "archived" &&
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      )}
    >
      {status === "published"
        ? "Published"
        : status === "draft"
          ? "Draft"
          : "Archived"}
    </span>
  );
}

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

  const sourceLabel = website.sourceNoteId
    ? website.sourceNoteId
    : "Chua co";

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-semibold">{website.name}</h1>
          <StatusBadge status={website.status} />
        </div>

        <Card className="mb-6">
          <CardContent className="px-6 py-4">
            <dl className="space-y-3 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground w-24 shrink-0">Template:</dt>
                <dd>
                  {template ? (
                    <span>
                      {template.icon} {template.name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Chua chon</span>
                  )}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground w-24 shrink-0">Nguon:</dt>
                <dd>{sourceLabel}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground w-24 shrink-0">Trang thai:</dt>
                <dd>{website.status}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6 py-6 flex flex-col items-center gap-2">
            <Button
              variant="default"
              size="lg"
              disabled
              title="Tinh nang nay se kha dung trong Phase 3"
            >
              Generate
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              AI generation kha dung trong Phase 3
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
