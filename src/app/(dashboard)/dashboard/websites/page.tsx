import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardNav from "../dashboard-nav";
import WebsiteCard from "@/components/website-card";
import WebsitesPoller from "./websites-poller";
import { Button } from "@/components/ui/button";

export default async function WebsitesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userWebsites = await db
    .select()
    .from(websites)
    .where(eq(websites.userId, session.user.id))
    .orderBy(desc(websites.createdAt));

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Websites</h1>
          <Link href="/dashboard/websites/new">
            <Button>Tao website moi</Button>
          </Link>
        </div>

        {userWebsites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-6xl mb-6">&#x1f310;</span>
            <h2 className="text-xl font-semibold mb-2">Ban chua co website nao</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tao website dau tien de bat dau chia se noi dung cua ban.
            </p>
            <Link href="/dashboard/websites/new">
              <Button size="lg">Tao website moi</Button>
            </Link>
          </div>
        ) : (
          <WebsitesPoller>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {userWebsites.map((site, index) => (
                <WebsiteCard key={site.id} website={site} index={index} />
              ))}
            </div>
          </WebsitesPoller>
        )}
      </main>
    </div>
  );
}
