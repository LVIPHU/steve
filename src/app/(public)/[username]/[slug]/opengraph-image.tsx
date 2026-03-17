import { ImageResponse } from "next/og";
import { db } from "@/db";
import { websites, profiles } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { WebsiteAST, SeoMeta } from "@/types/website-ast";

// DO NOT add `export const runtime = "edge"` — postgres.js is not edge-compatible

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;

  // Find profile + website (same pattern as page.tsx)
  const profileResults = await db.select().from(profiles)
    .where(eq(profiles.username, username)).limit(1);
  if (profileResults.length === 0) {
    return new ImageResponse(
      <div style={{ background: "#2563eb", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 40, color: "#ffffff" }}>Not Found</p>
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const websiteResults = await db.select().from(websites)
    .where(and(eq(websites.userId, profileResults[0].id), eq(websites.slug, slug))).limit(1);

  const website = websiteResults[0];
  const ast = website?.content as WebsiteAST | null;
  const seo = website?.seoMeta as SeoMeta | null;
  const bgColor = ast?.theme?.primaryColor ?? "#2563eb";
  const title = seo?.title ?? website?.name ?? "Website";

  return new ImageResponse(
    <div
      style={{
        background: bgColor,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px",
      }}
    >
      <p
        style={{
          fontSize: 60,
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: "#ffffff",
          opacity: 0.8,
          marginTop: 24,
        }}
      >
        {username}/{slug}
      </p>
    </div>,
    { width: 1200, height: 630 }
  );
}
