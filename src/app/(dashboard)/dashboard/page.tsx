import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Xin chào, {session.user.name}</CardTitle>
            <CardDescription>
              Đây là dashboard. Phase 1 (Foundation) đã sẵn sàng: auth, DB
              schema, proxy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Bạn có thể bắt đầu xây dựng tính năng tiếp theo.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
