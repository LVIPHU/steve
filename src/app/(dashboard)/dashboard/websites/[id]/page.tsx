import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function WebsiteDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  redirect(`/dashboard/websites/${id}/edit`);
}
