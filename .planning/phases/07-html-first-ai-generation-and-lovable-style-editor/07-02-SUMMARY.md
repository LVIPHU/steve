---
phase: 07-html-first-ai-generation-and-lovable-style-editor
plan: 02
subsystem: ui
tags: [nextjs, route-handler, landing-page, vietnamese, rebrand]

# Dependency graph
requires:
  - phase: 07-html-first-ai-generation-and-lovable-style-editor plan 01
    provides: htmlContent column on websites table (needed by route.ts)
provides:
  - Raw HTML route handler at /{username}/{slug} serving htmlContent column directly
  - Vietnamese landing page with hero/features/how-it-works/footer
  - Dashboard nav rebranded to AppGen
affects:
  - 07-03 (srcdoc editor — public URL now serves raw HTML, no more TemplateRenderer)
  - 07-04 (deploy/publish flow will reference AppGen branding)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Route handler (route.ts) replaces page.tsx for raw HTML serving — no React rendering on public route
    - CSS @keyframes in page.tsx Server Component for stagger animation without "use client"

key-files:
  created:
    - src/app/(public)/[username]/[slug]/route.ts
  modified:
    - src/app/page.tsx
    - src/app/(dashboard)/dashboard/dashboard-nav.tsx
  deleted:
    - src/app/(public)/[username]/[slug]/page.tsx
    - src/app/(public)/[username]/[slug]/opengraph-image.tsx

key-decisions:
  - "route.ts replaces page.tsx in the same segment — Next.js cannot have both; page.tsx and opengraph-image.tsx were deleted first"
  - "Archived websites return inline HTML string (not React component) — route handler must return Response, not JSX"
  - "CSS keyframe animation used in Server Component instead of motion/react — keeps page.tsx a Server Component for SEO"
  - "Landing page uses new.getFullYear() in footer — static Server Component, year computed at build time"
  - ".next cache directory cleaned before typecheck — stale validator.ts still referenced deleted page.tsx"

patterns-established:
  - "Route handler for public HTML serving: GET handler returns new Response(htmlContent, { headers: {'Content-Type': 'text/html'} })"
  - "Status checks in route handler: draft → 404, archived → inline HTML string, published → serve htmlContent"

requirements-completed: [P7-04, P7-07, P7-08]

# Metrics
duration: 5min
completed: 2026-03-19
---

# Phase 7 Plan 02: Public Route Handler, Landing Page, Nav Rebrand Summary

**Raw HTML route handler replaces TemplateRenderer for public websites; Vietnamese landing page and AppGen nav brand ship for HTML-first model.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-19T06:26:34Z
- **Completed:** 2026-03-19T06:31:30Z
- **Tasks:** 2/2
- **Files modified:** 5 (3 modified, 2 deleted, 1 created)

## Accomplishments
- Public route `/{username}/{slug}` now serves raw `htmlContent` via GET route handler (no React rendering)
- Draft websites return 404, archived return Vietnamese "Trang da bi luu tru" HTML message
- Vietnamese landing page: hero with CTAs, 3-card features, 3-step how-it-works, footer
- Dashboard nav brand changed from "Website Generator" to "AppGen"

## Task Commits

Each task was committed atomically:

1. **Task 1: Public route handler — replace page.tsx with route.ts** - `c9e522b` (feat)
2. **Task 2: Landing page rewrite + dashboard nav rebrand** - `aa90bdc` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `src/app/(public)/[username]/[slug]/route.ts` - Raw HTML GET route handler for public websites
- `src/app/(public)/[username]/[slug]/page.tsx` - DELETED (replaced by route.ts)
- `src/app/(public)/[username]/[slug]/opengraph-image.tsx` - DELETED (no longer needed with raw HTML model)
- `src/app/page.tsx` - Full Vietnamese landing page: hero, features, how-it-works, footer
- `src/app/(dashboard)/dashboard/dashboard-nav.tsx` - Brand text changed to AppGen

## Decisions Made
- Route handler (route.ts) replaces page.tsx — Next.js prohibits both in same segment; delete first, create second
- Archived websites return inline HTML string from the route handler (Response, not JSX)
- CSS @keyframes used in Server Component page.tsx instead of motion/react — keeps page a Server Component for SEO
- Landing page year in footer uses `new Date().getFullYear()` — computed at build/request time
- Cleaned `.next` cache before typecheck — stale `validator.ts` still referenced deleted `page.tsx`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Cleaned .next cache before typecheck**
- **Found during:** Task 1 verification
- **Issue:** `.next/types/validator.ts` still referenced deleted `page.tsx`, causing TS error
- **Fix:** Deleted `.next` directory before running `npm run typecheck`
- **Files modified:** None (cache cleanup only)
- **Verification:** typecheck passed after cleanup
- **Committed in:** c9e522b (part of Task 1 commit flow)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Cache cleanup required due to stale Next.js type generation. No scope creep.

## Issues Encountered
- Stale `.next/types/validator.ts` referenced deleted `page.tsx` after deletion — resolved by cleaning the `.next` directory before typecheck.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Public route now serves raw HTML — ready for srcdoc editor in plan 07-03
- Landing page complete with AppGen brand
- No blockers for 07-03 or 07-04

## Self-Check: PASSED

- FOUND: src/app/(public)/[username]/[slug]/route.ts
- DELETED: src/app/(public)/[username]/[slug]/page.tsx
- DELETED: src/app/(public)/[username]/[slug]/opengraph-image.tsx
- FOUND: src/app/page.tsx (landing page)
- FOUND: commit c9e522b (Task 1)
- FOUND: commit aa90bdc (Task 2)

---
*Phase: 07-html-first-ai-generation-and-lovable-style-editor*
*Completed: 2026-03-19*
