# Phase 3: AI Generation + Publish - Research

**Researched:** 2026-03-18
**Domain:** OpenAI GPT-4o integration, Next.js SSR public routes, Next.js OG Image, React section/layout components
**Confidence:** HIGH

## Summary

Phase 3 builds three interconnected capabilities on an already-complete Next.js 16 / React 19 / Drizzle codebase: (1) an AI generation API that calls GPT-4o to produce a Website AST JSON, (2) a public SSR route that renders the AST as a full page, and (3) SEO metadata + OG image generation using Next.js built-ins.

The stack is already chosen and locked by CONTEXT.md. The main implementation surface is: install `openai` npm package (not yet in `package.json`), create `src/app/api/ai/generate/route.ts`, create `src/app/(public)/[username]/[slug]/page.tsx` + `opengraph-image.tsx`, create shared section and layout components, and update the dashboard detail page to a Client Component with generate/preview/publish UX.

The critical architectural decision is that the dashboard detail page (`/dashboard/websites/[id]`) must become a Client Component (`"use client"`) to handle the interactive generate → preview → publish flow with local state. The current file is a Server Component with a placeholder button.

**Primary recommendation:** Use `openai` v6.32.0 with the structured outputs / `response_format: { type: "json_object" }` pattern. Call from a Next.js Route Handler (not a Server Action) so the 30-second timeout requirement (NF-01) is cleanly handled with `AbortSignal.timeout(30000)`. Keep section and layout components as pure Server Components on the public route, and as Client-rendered (but not `"use client"`) components in the dashboard preview.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Section types (6 total):** `hero`, `about`, `features`, `content`, `gallery`, `cta`

Section object shape:
```
{ id, type, ai_content: {...}, manual_overrides: {} }
```

Fields per type:
- `hero`: headline, subtext, ctaText, ctaUrl
- `about`: title, body
- `features`: title, items[{ icon, label, description }]
- `content`: title, body
- `gallery`: title, images[{ url, caption }]
- `cta`: title, body, buttonText, buttonUrl

**Template section presets (AI gợi ý nhưng có thể điều chỉnh):**
- Blog: hero → content → cta
- Portfolio: hero → about → features → cta
- Fitness: hero → features → content → cta
- Cooking: hero → content → gallery → cta
- Learning: hero → content → features → cta

**Template primary colors:**
- Blog: #2563eb | Portfolio: #7c3aed | Fitness: #16a34a | Cooking: #ea580c | Learning: #0891b2

**Font per template:** Google Fonts via `next/font/google`. Blog=Inter, Portfolio=Playfair Display, Fitness=DM Sans, Cooking=Lora, Learning=Plus Jakarta Sans (Claude's discretion confirmed in UI-SPEC).

**Template layout components:** BlogLayout, PortfolioLayout, FitnessLayout, CookingLayout, LearningLayout — each wraps shared section components, differs only in wrapper/styling.

**Section components (shared):** HeroSection, AboutSection, FeaturesSection, ContentSection, GallerySection, CtaSection — render rule: `manual_overrides[field] ?? ai_content[field]`

**Generation UX flow (trang /dashboard/websites/[id]):**
1. Generate button → loading spinner inline (no redirect)
2. Backend fetches note JSON from mobile API via sourceNoteId (or free prompt only if no sourceNoteId)
3. OpenAI GPT-4o returns `{ sections[], seo: { title, description, slug } }`
4. Save to `websites.content` + `websites.seoMeta`, status stays `draft`
5. Preview renders inline below (Section components directly — NOT iframe, iframe is Phase 4)
6. After gen: slug input (pre-filled, editable) + Publish button appear
7. Publish → status = `published`, public URL live
8. Regenerate: overwrites `ai_content`, preserves `manual_overrides`

**Public route `/[username]/[slug]`:**
- Route group: `src/app/(public)/[username]/[slug]/page.tsx`
- Blank canvas — no dashboard nav
- Server Component (SSR): query DB for website + user profile
- Draft → `notFound()` (404)
- Archived → simple "Website không còn hoạt động" page
- Published → render `{Template}Layout` with Section components

**SEO (F-17):**
- OpenAI generates `seo.title`, `seo.description`, `seo.slug` in same single request
- Stored in `websites.seoMeta` (JSONB)
- `generateMetadata()` exports `<title>`, `<meta name="description">`, `<meta property="og:*">`
- OG Image: `src/app/(public)/[username]/[slug]/opengraph-image.tsx` — 1200×630, title (60px/700) + username/slug (24px/400), background = `theme.primaryColor`

### Claude's Discretion
- Fields detail for each section type (within bounds defined above)
- Font choice per template (confirmed by UI-SPEC: Inter/Playfair Display/DM Sans/Lora/Plus Jakarta Sans)
- Styling detail of each TemplateLayout component
- Error state when OpenAI call fails
- Loading state design on detail page

### Deferred Ideas (OUT OF SCOPE)
- Prompt refinement after gen (S-02) — Phase 4
- Per-section regenerate (S-01) — Phase 4
- Responsive preview toggle Desktop/Tablet/Mobile (F-15) — Phase 4
- Umami analytics embed — Phase 5
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| F-10 | OpenAI GPT-4o: note JSON + template + prompt → Website AST JSON | `openai` v6.32.0 SDK; structured JSON output via `response_format`; AbortSignal.timeout for 30s NF-01 |
| F-11 | Regenerate website — overwrite ai_content, preserve manual_overrides | Same API route with `regenerate: true` flag; DB PATCH sets `content` to new AST (merging manual_overrides on client or server) |
| F-16 | Published website accessible at /[username]/[slug] via SSR; draft=404, archived=special page | `src/app/(public)/[username]/[slug]/page.tsx` Server Component; `notFound()` for draft; conditional render for archived |
| F-17 | SEO: meta title, description, OG image auto-generated on publish | `generateMetadata()` in public page; `opengraph-image.tsx` using `next/og` ImageResponse; seoMeta JSONB from DB |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| openai | 6.32.0 | GPT-4o API calls | Official OpenAI SDK; typed responses; streaming support |
| next/og | bundled with Next.js 16.1.6 | OG image via ImageResponse | Built-in, no extra dependency; verified available in this project |
| next/font/google | bundled with Next.js 16.1.6 | Per-template Google Fonts | Zero-layout-shift font loading; already used for Geist in layout.tsx |
| drizzle-orm | 0.45.1 (already installed) | DB queries for public route | Already in use; eq/and patterns established |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.577.0 (already installed) | Loader2 spinner, icons in FeaturesSection | Already in project; Loader2 for generate loading state |
| clsx + tailwind-merge | already installed (via cn()) | Conditional class composition | All new components use `cn()` |

### Not Needed / Explicitly Out of Scope
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom fetch wrapper | openai SDK | SDK handles retries, types, streaming — don't hand-roll |
| @vercel/og | next/og | `next/og` IS `@vercel/og` repackaged — they are the same, use `next/og` import |
| ai (Vercel AI SDK) | openai directly | Vercel AI SDK is overkill — no streaming UI needed in Phase 3 |
| zod for OpenAI response | Manual parse + type guard | Both work; manual guard acceptable since schema is small and locked |

**Installation:**
```bash
npm install openai
```

**Version verification (confirmed 2026-03-18):**
- `openai`: 6.32.0 (npm registry latest)
- `next/og`: bundled in Next.js 16.1.6 — `ImageResponse` confirmed available via `require('next/og')`
- `next/font/google`: bundled in Next.js 16.1.6 — already used in `src/app/layout.tsx`

---

## Architecture Patterns

### Recommended Project Structure

New files to create in Phase 3:

```
src/
├── app/
│   ├── (public)/
│   │   └── [username]/
│   │       └── [slug]/
│   │           ├── page.tsx              # SSR public route (Server Component)
│   │           └── opengraph-image.tsx   # OG image (ImageResponse)
│   └── api/
│       └── ai/
│           └── generate/
│               └── route.ts              # POST — calls OpenAI GPT-4o
├── components/
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── features-section.tsx
│   │   ├── content-section.tsx
│   │   ├── gallery-section.tsx
│   │   └── cta-section.tsx
│   └── layouts/
│       ├── blog-layout.tsx
│       ├── portfolio-layout.tsx
│       ├── fitness-layout.tsx
│       ├── cooking-layout.tsx
│       └── learning-layout.tsx
```

Update existing:
```
src/app/(dashboard)/dashboard/websites/[id]/page.tsx   # Add "use client", generate/preview/publish UX
```

### Pattern 1: OpenAI Route Handler with Timeout

The generate API route must be a Next.js Route Handler (not Server Action). Route Handlers support full Request/Response control, and `AbortSignal.timeout(30000)` cleanly enforces NF-01.

```typescript
// src/app/api/ai/generate/route.ts
// Source: openai SDK docs + Next.js Route Handler pattern
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { websiteId, noteJson, prompt } = await request.json();

  // Ownership check (same pattern as PATCH route)
  const existing = await db
    .select()
    .from(websites)
    .where(and(eq(websites.id, websiteId), eq(websites.userId, session.user.id)))
    .limit(1);
  if (existing.length === 0) return Response.json({ error: "Not found" }, { status: 404 });

  const website = existing[0];

  try {
    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt(website.templateId) },
          { role: "user", content: buildUserPrompt(noteJson, prompt) },
        ],
      },
      { signal: AbortSignal.timeout(30000) }
    );

    const raw = completion.choices[0].message.content ?? "{}";
    const ast = parseAndValidateAST(raw); // type guard

    await db
      .update(websites)
      .set({ content: ast, seoMeta: ast.seo, updatedAt: new Date() })
      .where(eq(websites.id, websiteId));

    return Response.json({ ok: true, content: ast });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return Response.json({ error: "timeout" }, { status: 504 });
    }
    return Response.json({ error: "generation_failed" }, { status: 500 });
  }
}
```

### Pattern 2: Dashboard Detail Page as Client Component

The current `src/app/(dashboard)/dashboard/websites/[id]/page.tsx` is a Server Component. It must become a Client Component to manage interactive state (loading, generated content, slug editing).

**Approach:** Convert to `"use client"` and use `fetch` to call `/api/ai/generate`. Load initial website data via a parent Server Component or pass as props — however since the page needs auth redirect, the cleanest pattern is:

Option A (recommended): Keep the page as a Server Component that renders a Client Component child, passing the initial `website` record as props. The child (`WebsiteDetailClient`) manages the interactive state.

```typescript
// page.tsx stays as Server Component for auth + initial DB fetch
// Renders: <WebsiteDetailClient website={website} profile={profile} />

// website-detail-client.tsx = "use client"
// Manages: generateState, content (WebsiteAST | null), slug
```

This follows the `server-dedup-props` pattern from the vercel-react-best-practices skill — Server Component does auth + DB, Client Component gets minimal serialized props.

### Pattern 3: Public SSR Route

```typescript
// src/app/(public)/[username]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { db } from "@/db";
// ...

export async function generateMetadata({ params }) {
  const { username, slug } = await params;
  const data = await getWebsiteData(username, slug);
  if (!data) return {};
  const seo = data.website.seoMeta as SeoMeta;
  return {
    title: seo?.title,
    description: seo?.description,
    openGraph: {
      title: seo?.title,
      description: seo?.description,
      images: [`/${username}/${slug}/opengraph-image`],
    },
  };
}

export default async function PublicWebsitePage({ params }) {
  const { username, slug } = await params;
  const data = await getWebsiteData(username, slug);
  if (!data) notFound();

  const { website } = data;

  if (website.status === "draft") notFound();
  if (website.status === "archived") return <ArchivedPage />;

  const ast = website.content as WebsiteAST;
  return <TemplateRenderer templateId={website.templateId} ast={ast} />;
}
```

**CRITICAL:** The `(public)` route group must NOT be inside `(dashboard)` — it's a sibling route group at `src/app/(public)/`. This gives blank-canvas layout (no dashboard nav). The `src/app/(public)/` folder needs its own `layout.tsx` (minimal — just renders children).

### Pattern 4: OG Image with next/og

```typescript
// src/app/(public)/[username]/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { db } from "@/db";

export const runtime = "edge"; // OPTIONAL — edge runtime for faster OG gen, but requires edge-compatible DB access

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }) {
  const { username, slug } = await params;
  // fetch website from DB
  const ast = website.content as WebsiteAST;
  const bgColor = ast?.theme?.primaryColor ?? "#2563eb";
  const title = (website.seoMeta as SeoMeta)?.title ?? website.name;

  return new ImageResponse(
    <div style={{ background: bgColor, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px" }}>
      <p style={{ fontSize: 60, fontWeight: 700, color: "#ffffff", textAlign: "center" }}>{title}</p>
      <p style={{ fontSize: 24, fontWeight: 400, color: "#ffffff", opacity: 0.8 }}>{username}/{slug}</p>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

**IMPORTANT:** `runtime = "edge"` is optional. If edge runtime causes issues with Drizzle/postgres.js (which uses Node.js APIs), omit `runtime = "edge"` and let it run as Node.js. The `next/og` ImageResponse works in both runtimes. Since `postgres.js` requires Node.js, do NOT use edge runtime for OG image in this project.

### Pattern 5: OpenAI System Prompt Structure

The system prompt must instruct GPT-4o to return a JSON matching the Website AST schema exactly. Key points:
- Specify the exact JSON schema with field names
- List section type presets per template (as suggestions, not hard requirements)
- Include `seo.slug` generation instructions (use `generateSlug`-compatible format: lowercase, hyphens, no special chars)
- Constrain output to only valid section types

```
System prompt structure:
1. Role: "You are a website content generator..."
2. Output format: exact JSON schema (WebsiteAST)
3. Template context: templateId + suggested sections + primaryColor
4. Rules: all strings, no markdown, valid section types only
5. SEO: generate title (≤60 chars), description (≤155 chars), slug (lowercase hyphenated)
```

### Anti-Patterns to Avoid

- **Calling OpenAI from a Server Component directly:** Server Components timeout at 60s in Next.js but GPT-4o calls can be slow — put AI calls in Route Handlers where timeout is explicit.
- **Storing note JSON in the DB:** CONTEXT.md and STATE.md both confirm: notes are NOT stored in this DB. Fetch at generation time from mobile API using `sourceNoteId`, pass to OpenAI, discard.
- **Using edge runtime with postgres.js:** `postgres.js` uses Node.js net module — not compatible with edge runtime. OG image and public route both use standard Node.js runtime.
- **Defining section components inside the layout component:** Violates `rerender-no-inline-components` rule from vercel-react-best-practices skill. All 6 section components and 5 layout components are defined at module scope in separate files.
- **Putting the public route inside (dashboard) route group:** The `(dashboard)/layout.tsx` checks for auth session and redirects to login. Public websites must be accessible without auth.
- **Using `&&` for conditional render:** Use ternary per `rendering-conditional-render` rule from vercel-react-best-practices skill.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OpenAI API client | Custom fetch to api.openai.com | `openai` npm package | Handles auth headers, retry, error types, TypeScript types |
| OG image generation | canvas/sharp/puppeteer | `next/og` (ImageResponse) | Built into Next.js 16, zero extra deps, edge-compatible JSX rendering |
| Google Fonts loading | Manual `<link>` tags | `next/font/google` | Zero CLS, automatic self-hosting, already used in project |
| Slug normalization | Custom regex | `generateSlug()` from `@/lib/slugify.ts` | Already exists and tested |
| Template lookup | Switch statement | `TEMPLATES.find()` from `@/lib/templates.ts` | Already exists |

**Key insight:** The heavy lifting for this phase (AI, fonts, OG images) is all handled by well-maintained packages or Next.js built-ins. Custom solutions would reintroduce bugs these tools have already solved.

---

## Common Pitfalls

### Pitfall 1: OpenAI JSON Parsing Failure
**What goes wrong:** GPT-4o with `response_format: { type: "json_object" }` returns valid JSON but with unexpected structure (missing fields, wrong types, extra fields).
**Why it happens:** The model follows instructions approximately, not exactly. Schema enforcement is not 100% guaranteed even with JSON mode.
**How to avoid:** Always run a type guard / manual validation on the parsed JSON before writing to DB. Have a `parseAndValidateAST(raw: string): WebsiteAST` function that either returns valid AST or throws.
**Warning signs:** TypeScript errors when accessing `ast.sections[0].type`, missing sections array, seo object null.

### Pitfall 2: Public Route Group Isolation
**What goes wrong:** Creating `(public)` as a sub-group inside `(dashboard)` accidentally applies dashboard auth middleware/layout to public pages.
**Why it happens:** Route group nesting — `(dashboard)/(public)/` would inherit `(dashboard)/layout.tsx`.
**How to avoid:** `(public)` must be a sibling of `(dashboard)` directly under `src/app/`. Create `src/app/(public)/layout.tsx` as a minimal layout (no auth check, just renders children).
**Warning signs:** Public website pages redirect to `/login`, 404 in test, headers contain auth cookies.

### Pitfall 3: Dashboard Detail Page Needs "use client"
**What goes wrong:** Current `page.tsx` is a Server Component. Adding `useState`/`fetch` for generate flow without `"use client"` causes "hooks only work in client components" build error.
**Why it happens:** The generate → preview → publish flow requires local React state.
**How to avoid:** Extract a `WebsiteDetailClient` Client Component. The page itself stays as Server Component for auth + initial DB fetch, passes `website` as prop to the Client Component.
**Warning signs:** Build error "React hooks can only be called inside a function component or a custom React hook."

### Pitfall 4: seoMeta vs content.seo Duplication
**What goes wrong:** The schema stores `seo` data in two places: `websites.seoMeta` (JSONB column) AND `websites.content.seo` (inside the AST JSON). Must keep both in sync.
**Why it happens:** DB schema has a dedicated `seoMeta` column AND the AST has a `seo` object.
**How to avoid:** When saving generation result, always write BOTH: `content = fullAST` and `seoMeta = ast.seo`. When reading for `generateMetadata()`, read from `seoMeta` column (cleaner). When reading full AST for render, use `content`.
**Warning signs:** OG image shows wrong title, SEO meta empty after publish.

### Pitfall 5: Slug Uniqueness Per User
**What goes wrong:** Two websites of the same user with the same slug → URL collision at `/[username]/[slug]`.
**Why it happens:** AI generates slugs from titles; users with similar titles get same slug.
**How to avoid:** On publish (PATCH to set status = published), check for existing slug collision: `WHERE userId = X AND slug = Y AND id != websiteId`. Return 409 with "This URL is already taken" error.
**Warning signs:** Second publish silently overwrites or breaks first website's public URL.

### Pitfall 6: AbortSignal.timeout Not Available in Older Node
**What goes wrong:** `AbortSignal.timeout()` was introduced in Node.js 17.3. If the deployment target runs Node 16, this throws.
**Why it happens:** Vercel/Next.js 16 typically uses Node 18+ but worth verifying.
**How to avoid:** Node.js 18+ is required for Next.js 16 (confirmed in Next.js docs). `AbortSignal.timeout(30000)` is safe.

---

## Code Examples

### WebsiteAST TypeScript Type

```typescript
// src/types/website-ast.ts (create this file)
export type SectionType = "hero" | "about" | "features" | "content" | "gallery" | "cta";

export interface HeroContent { headline: string; subtext: string; ctaText?: string; ctaUrl?: string; }
export interface AboutContent { title: string; body: string; }
export interface FeaturesContent { title: string; items: Array<{ icon: string; label: string; description: string; }>; }
export interface ContentContent { title: string; body: string; }
export interface GalleryContent { title: string; images: Array<{ url: string; caption: string; }>; }
export interface CtaContent { title: string; body: string; buttonText: string; buttonUrl: string; }

export type SectionContent = HeroContent | AboutContent | FeaturesContent | ContentContent | GalleryContent | CtaContent;

export interface Section {
  id: string;
  type: SectionType;
  ai_content: SectionContent;
  manual_overrides: Partial<SectionContent>;
}

export interface WebsiteTheme {
  primaryColor: string;
  backgroundColor: string;
  font: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  slug: string;
}

export interface WebsiteAST {
  theme: WebsiteTheme;
  sections: Section[];
  seo: SeoMeta;
}
```

### Render Rule Implementation

```typescript
// Used in every section component
function resolveField<T>(section: Section, field: keyof SectionContent): T {
  const overrides = section.manual_overrides as Record<string, unknown>;
  const content = section.ai_content as Record<string, unknown>;
  return (overrides[field as string] ?? content[field as string]) as T;
}

// Example HeroSection
export function HeroSection({ section }: { section: Section }) {
  const headline = resolveField<string>(section, "headline" as keyof SectionContent);
  const subtext = resolveField<string>(section, "subtext" as keyof SectionContent);
  // ...
}
```

### generateMetadata for Public Route

```typescript
// src/app/(public)/[username]/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}): Promise<Metadata> {
  const { username, slug } = await params;
  const website = await getPublishedWebsite(username, slug);
  if (!website) return {};

  const seo = website.seoMeta as SeoMeta | null;
  return {
    title: seo?.title ?? website.name,
    description: seo?.description,
    openGraph: {
      title: seo?.title ?? website.name,
      description: seo?.description ?? undefined,
      url: `/${username}/${slug}`,
      images: [{ url: `/${username}/${slug}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}
```

### Template Font Loading (next/font/google)

```typescript
// Inside each TemplateLayout, load font at module scope (server-hoist-static-io rule)
// src/components/layouts/blog-layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-blog" });

export function BlogLayout({ ast, children }: { ast: WebsiteAST; children?: React.ReactNode }) {
  return (
    <div className={`${inter.variable} font-sans`} style={{ "--primary": ast.theme.primaryColor } as React.CSSProperties}>
      {/* render sections */}
    </div>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@vercel/og` separate package | `next/og` built-in | Next.js 13.3 | No extra install; use `import { ImageResponse } from "next/og"` |
| `opengraph-image.js` with getStaticProps | `opengraph-image.tsx` file convention | Next.js 13+ App Router | File name = route, export default = ImageResponse, no config needed |
| OpenAI `gpt-4` | `gpt-4o` | 2024 | gpt-4o is cheaper, faster, same quality for structured content gen |
| `openai@3.x` (axios-based) | `openai@6.x` (native fetch) | 2024 | v6 uses native fetch, works in edge runtimes, better TypeScript types |
| Server Actions for mutations | Route Handlers for AI calls | — | Server Actions have no explicit timeout control; Route Handlers do |

**Deprecated/outdated:**
- `openai@3.x`: Do not use — completely different API shape
- `@vercel/og`: Do not install — `next/og` is the same thing, already bundled
- `pages/api/` routes: Project uses App Router — all new API routes go in `app/api/`

---

## Open Questions

1. **Mobile API endpoint for note JSON**
   - What we know: `sourceNoteId` is stored in `websites.sourceNoteId`; notes are fetched at generation time from mobile app API
   - What's unclear: The mobile app API base URL, auth mechanism, and response shape are not documented in any file read during this research
   - Recommendation: The generate API route should accept an optional `noteJson` object passed from the client (dashboard page fetches from mobile API) OR the server route calls mobile API with `sourceNoteId`. The safest approach for Phase 3 is to have the client pass `noteJson` directly in the POST body — the dashboard page is responsible for fetching from mobile API first. This avoids server-side credential management for the mobile API in Phase 3.

2. **Slug uniqueness enforcement**
   - What we know: Slug is user-editable before publish (S-04, Business Rule #5); current DB schema has no unique constraint on `(userId, slug)`
   - What's unclear: Whether a DB-level unique constraint exists or if it's enforced at application level only
   - Recommendation: Add application-level check on publish (PATCH status=published). DB migration for unique constraint is deferred — application check is sufficient for Phase 3 scale.

3. **OPENAI_API_KEY environment variable**
   - What we know: Not in `.env.example` (checked CLAUDE.md which lists only DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, GOOGLE_CLIENT_ID/SECRET, NEXT_PUBLIC_APP_URL)
   - What's unclear: Whether it's already defined locally in `.env`
   - Recommendation: Add `OPENAI_API_KEY` to `.env.example` as part of Phase 3 Wave 0.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` (project root) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| F-10 | `parseAndValidateAST()` accepts valid AST JSON | unit | `npx vitest run src/lib/ast-utils.test.ts` | ❌ Wave 0 |
| F-10 | `parseAndValidateAST()` throws on invalid JSON | unit | `npx vitest run src/lib/ast-utils.test.ts` | ❌ Wave 0 |
| F-10 | `buildSystemPrompt(templateId)` returns string containing template sections | unit | `npx vitest run src/lib/ai-prompts.test.ts` | ❌ Wave 0 |
| F-11 | Regenerate: ai_content overwritten, manual_overrides preserved | unit | `npx vitest run src/lib/ast-utils.test.ts` | ❌ Wave 0 |
| F-16 | `generateSlug()` produces lowercase hyphenated string | unit | `npx vitest run src/lib/slugify.test.ts` | ❌ Wave 0 |
| F-17 | `generateMetadata()` returns correct title/description from seoMeta | manual-only | — | N/A — requires DB |

**Manual-only justifications:**
- `generateMetadata()` and public route rendering require a running DB and deployed Next.js — not unit-testable in Vitest without heavy mocking.
- OG image output (1200×630 PNG) requires visual verification.

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/ast-utils.test.ts` — covers F-10, F-11 parse/validate/merge logic
- [ ] `src/lib/ai-prompts.test.ts` — covers F-10 system prompt builder
- [ ] `src/lib/slugify.test.ts` — covers F-16 slug generation (generateSlug already exists, just needs tests)
- [ ] Add `OPENAI_API_KEY` to `.env.example`

---

## Sources

### Primary (HIGH confidence)
- `next/og` module — confirmed available via `require('next/og')` in local Next.js 16.1.6 install
- `D:/STEVE/steve/src/db/schema.ts` — exact DB schema (websites table JSONB columns)
- `D:/STEVE/steve/src/app/api/websites/[id]/route.ts` — auth + ownership check pattern
- `D:/STEVE/steve/src/lib/templates.ts` — TEMPLATES array, TemplateId type
- `D:/STEVE/steve/src/lib/slugify.ts` — generateSlug() implementation
- `D:/STEVE/steve/package.json` — confirmed: openai NOT installed, vitest 4.1.0, next 16.1.6
- `D:/STEVE/steve/vitest.config.ts` — Vitest config (globals: true, environment: node)
- `D:/STEVE/steve/.planning/phases/03-ai-generation-publish/03-CONTEXT.md` — locked decisions
- `D:/STEVE/steve/.planning/phases/03-ai-generation-publish/03-UI-SPEC.md` — visual contract

### Secondary (MEDIUM confidence)
- `npm view openai version` → 6.32.0 (verified against npm registry 2026-03-18)
- vercel-react-best-practices skill SKILL.md — `rerender-no-inline-components`, `server-dedup-props`, `server-hoist-static-io`, `rendering-conditional-render` rules

### Tertiary (LOW confidence)
- OpenAI `response_format: { type: "json_object" }` behavior description — based on training knowledge; verify against OpenAI docs before implementation if behavior is unexpected
- `AbortSignal.timeout()` Node.js 17.3+ availability — standard JS, high confidence but flagged for completeness

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — packages verified against local install + npm registry
- Architecture: HIGH — patterns derived from existing codebase code reading + locked CONTEXT.md decisions
- Pitfalls: MEDIUM — derived from code analysis and Next.js App Router conventions; route group isolation pitfall verified against Next.js routing docs behavior
- OpenAI prompt engineering: MEDIUM — schema is small and locked; exact prompt wording is Claude's discretion

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (openai SDK changes infrequently; Next.js OG image API stable)
