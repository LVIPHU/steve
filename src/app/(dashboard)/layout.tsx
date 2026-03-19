import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // Check if user has completed onboarding (has profiles record with username)
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile) redirect("/onboarding");

  return (
    <DashboardSidebar
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      username={profile.username}
    >
      {children}
    </DashboardSidebar>
  );
}
