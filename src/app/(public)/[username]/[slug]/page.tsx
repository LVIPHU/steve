import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/db";
import { websites, profiles } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TemplateRenderer } from "@/components/layouts";
import type { WebsiteAST, SeoMeta } from "@/types/website-ast";

type PageParams = { username: string; slug: string };

async function getWebsiteData(username: string, slug: string) {
  // Find profile by username
  const profileResults = await db.select().from(profiles)
    .where(eq(profiles.username, username)).limit(1);
  if (profileResults.length === 0) return null;
  const profile = profileResults[0];

  // Find website by userId + slug
  const websiteResults = await db.select().from(websites)
    .where(and(eq(websites.userId, profile.id), eq(websites.slug, slug))).limit(1);
  if (websiteResults.length === 0) return null;

  return { website: websiteResults[0], profile };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { username, slug } = await params;
  const data = await getWebsiteData(username, slug);
  if (!data) return {};

  const { website } = data;
  // Only show metadata for published websites
  if (website.status !== "published") return {};

  const seo = website.seoMeta as SeoMeta | null;
  return {
    title: seo?.title ?? website.name,
    description: seo?.description ?? undefined,
    openGraph: {
      title: seo?.title ?? website.name,
      description: seo?.description ?? undefined,
      url: `/${username}/${slug}`,
      images: [{ url: `/${username}/${slug}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

function ArchivedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Website khong con hoat dong</h1>
        <p className="text-gray-600">This website has been archived by its owner.</p>
      </div>
    </div>
  );
}

export default async function PublicWebsitePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { username, slug } = await params;
  const data = await getWebsiteData(username, slug);
  if (!data) notFound();

  const { website } = data;

  if (website.status === "draft") notFound();
  if (website.status === "archived") return <ArchivedPage />;

  const ast = website.content as WebsiteAST;
  if (!ast) notFound();

  const fontFamily = ast.theme?.font || "Inter";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;600&display=swap`;

  return (
    <>
      <link rel="stylesheet" href={fontUrl} />
      <div
        style={
          {
            "--primary-color": ast.theme?.primaryColor,
            "--font-family": fontFamily,
            fontFamily: `"${fontFamily}", sans-serif`,
          } as React.CSSProperties
        }
      >
        <TemplateRenderer templateId={website.templateId ?? "blog"} ast={ast} />
      </div>
    </>
  );
}
