---
phase: 03-ai-generation-publish
plan: 04
subsystem: ui
tags: [next.js, ssr, og-image, seo, drizzle, postgres]

# Dependency graph
requires:
  - phase: 03-01
    provides: WebsiteAST types, AI generation, DB write pattern
  - phase: 03-02
    provides: TemplateRenderer, section components for rendering
provides:
  - Public SSR route at /[username]/[slug] for published websites
  - SEO metadata via generateMetadata (title, description, og:*)
  - Dynamic OG image 1200x630 PNG with primaryColor background
  - Archived site page with localized copy
  - Draft returns 404 (no public access)
affects: [04-visual-editor, 05-note-sync, any phase referencing public URLs]

# Tech tracking
tech-stack:
  added: [next/og ImageResponse]
  patterns: [Public route group isolation (no auth), SSR page with generateMetadata, OG image endpoint with no edge runtime]

key-files:
  created:
    - src/app/(public)/layout.tsx
    - src/app/(public)/[username]/[slug]/page.tsx
    - src/app/(public)/[username]/[slug]/opengraph-image.tsx
  modified: []

key-decisions:
  - "(public) route group is sibling to (dashboard), not nested — no dashboard auth middleware applies to public pages"
  - "No edge runtime on OG image — postgres.js uses Node.js net module, not edge-compatible"
  - "ArchivedPage defined at module scope (not inline) per rerender-no-inline-components rule"
  - "getWebsiteData plain async function (not exported, not Server Action) — reused by both page and generateMetadata"
  - "Draft websites return 404 (not archived page) — no public access at any state except published/archived"

patterns-established:
  - "Pattern: (public) route group for unauthenticated SSR pages, no auth imports"
  - "Pattern: generateMetadata + default page export in same file, sharing getWebsiteData helper"
  - "Pattern: OG image in opengraph-image.tsx file with size/contentType named exports"

requirements-completed: [F-16, F-17]

# Metrics
duration: 3min
completed: 2026-03-18
---

# Phase 3 Plan 04: Public SSR Route + OG Image Summary

**Next.js SSR public route at /[username]/[slug] with SEO metadata, dynamic 1200x630 OG image, and status-aware rendering (draft=404, archived=localized page, published=TemplateRenderer)**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-17T19:43:11Z
- **Completed:** 2026-03-17T19:46:00Z
- **Tasks:** 2/2
- **Files modified:** 3 created

## Accomplishments
- Public layout at `(public)/layout.tsx` — blank canvas, no auth, no dashboard nav
- SSR page at `/[username]/[slug]` with draft=404, archived=localized message, published=TemplateRenderer
- `generateMetadata` exports `title`, `description`, and `openGraph` (including OG image URL) from `seoMeta`
- OG image endpoint generates 1200x630 PNG with `theme.primaryColor` background, white title (60px/700), username/slug (24px/400/80% opacity)
- All 40 existing Vitest tests pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Public layout + SSR page with generateMetadata** - `29136b7` (feat)
2. **Task 2: OG image endpoint with ImageResponse** - `98662cc` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/app/(public)/layout.tsx` - Minimal public layout, no auth, no dashboard nav
- `src/app/(public)/[username]/[slug]/page.tsx` - SSR page with generateMetadata, status routing, TemplateRenderer
- `src/app/(public)/[username]/[slug]/opengraph-image.tsx` - Dynamic OG image 1200x630 via ImageResponse

## Decisions Made
- No edge runtime on OG image — postgres.js requires Node.js, not edge-compatible
- `(public)` route group is a sibling to `(dashboard)`, not nested inside it — prevents dashboard auth middleware from applying
- `ArchivedPage` defined at module scope to avoid component recreation on re-render
- `getWebsiteData` shared between `generateMetadata` and default page export — avoids double DB queries at module level

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Pre-existing TypeScript errors in `(dashboard)/websites/[id]/page.tsx` and `src/lib/ast-utils.ts` are out of scope for this plan.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Public website URLs are live: `/[username]/[slug]` renders any published website
- SEO metadata and OG images generated automatically from `seoMeta` in DB
- Phase 4 (visual editor) can link directly to these public URLs for preview

---
*Phase: 03-ai-generation-publish*
*Completed: 2026-03-18*

## Self-Check: PASSED
- FOUND: src/app/(public)/layout.tsx
- FOUND: src/app/(public)/[username]/[slug]/page.tsx
- FOUND: src/app/(public)/[username]/[slug]/opengraph-image.tsx
- FOUND commit: 29136b7
- FOUND commit: 98662cc
