---
phase: 03-ai-generation-publish
plan: "03"
subsystem: ui
tags: [react, nextjs, fetch, website-generation, publish-flow]

# Dependency graph
requires:
  - phase: 03-01
    provides: /api/ai/generate endpoint + WebsiteAST types
  - phase: 03-02
    provides: SectionRenderer + section components for inline preview

provides:
  - Website detail page with full generate -> preview -> publish interactive flow
  - Server Component page wrapper (auth, DB fetch, profile lookup, prop passing)
  - Client Component (WebsiteDetailClient) with all interactive state management
  - PATCH /api/websites/[id] now supports slug field with uniqueness check (409 on conflict)

affects: [phase-04-visual-editor, phase-05-note-sync]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server Component wrapper passes serialized DB data to Client Component via JSON.parse(JSON.stringify())
    - Client Component manages all interactive state (content, status, slug, generating, publishing, error)
    - Note JSON fetched client-side via /api/notes/[id] before calling /api/ai/generate
    - Graceful degradation on note fetch failure (proceed without note content)
    - Slug uniqueness check in PATCH route via 409 response; client maps to user-facing error

key-files:
  created:
    - src/app/(dashboard)/dashboard/websites/[id]/website-detail-client.tsx
  modified:
    - src/app/(dashboard)/dashboard/websites/[id]/page.tsx
    - src/app/api/websites/[id]/route.ts
    - src/lib/ast-utils.ts

key-decisions:
  - "StatusBadge defined at module scope in client component (not inline) to avoid re-render instability"
  - "Slug conflict returns 409 from PATCH; client shows 'URL already taken' message without exposing internal code"
  - "Note fetch failure degrades gracefully — generation continues without note content rather than blocking"
  - "setSlug called with data.content.seo.slug after successful generation to pre-fill from AI output"

patterns-established:
  - "Server Component wrapper: auth + DB + serialized props -> Client Component"
  - "Client Component: all state (content/status/slug/generating/publishing/error) in useState"

requirements-completed: [F-10, F-11]

# Metrics
duration: 2m 13s
completed: 2026-03-18
---

# Phase 3 Plan 03: Website Detail Generate/Preview/Publish Summary

**Interactive website detail page: Server Component auth wrapper + Client Component with generate -> spinner -> inline SectionRenderer preview -> slug edit -> publish flow, with PATCH route slug uniqueness enforcement**

## Performance

- **Duration:** 2m 13s
- **Started:** 2026-03-18T08:43:07Z
- **Completed:** 2026-03-18T08:45:20Z
- **Tasks:** 1/1
- **Files modified:** 4

## Accomplishments

- Refactored page.tsx to pure Server Component: auth check, DB fetch for website + profile (username), props to WebsiteDetailClient
- Created website-detail-client.tsx (250+ lines) with full interactive state: generate/regenerate, inline preview, slug input, publish/update
- PATCH route updated with slug field support, slug uniqueness check (409 conflict response), slug sanitization
- Fixed pre-existing TypeScript cast error in ast-utils.ts resolveField function

## Task Commits

Each task was committed atomically:

1. **Task 1: Refactor page.tsx + create WebsiteDetailClient + update PATCH route for slug** - `0481fd4` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/app/(dashboard)/dashboard/websites/[id]/page.tsx` - Refactored to Server Component; imports WebsiteDetailClient, fetches profile for username
- `src/app/(dashboard)/dashboard/websites/[id]/website-detail-client.tsx` - New Client Component with generate/preview/publish interactive flow
- `src/app/api/websites/[id]/route.ts` - PATCH handler extended with slug field support and uniqueness check
- `src/lib/ast-utils.ts` - Fixed pre-existing TypeScript cast error in resolveField (SectionContent -> unknown -> Record)

## Decisions Made

- StatusBadge defined at module scope in client component (not inline) to avoid re-render instability and match UI-SPEC requirement
- Slug conflict returns 409 from PATCH; client maps to "URL already taken" message without exposing error code to user
- Note fetch failure degrades gracefully — generation proceeds without note content rather than blocking the user
- After successful generation, setSlug is called with `data.content.seo.slug` to pre-fill slug from AI output

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing TypeScript cast error in ast-utils.ts**
- **Found during:** Task 1 (TypeScript compilation check)
- **Issue:** `section.ai_content as Record<string, unknown>` produced TS2352 error — SectionContent union type doesn't sufficiently overlap with Record<string, unknown>
- **Fix:** Added `unknown` intermediary: `section.ai_content as unknown as Record<string, unknown>`
- **Files modified:** src/lib/ast-utils.ts
- **Verification:** `npx tsc --noEmit` exits with no errors
- **Committed in:** 0481fd4 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Pre-existing TypeScript error in unrelated file; fixed to satisfy acceptance criteria "TypeScript compiles without errors". No scope creep.

## Issues Encountered

None — plan executed as specified. The TypeScript error in ast-utils.ts was pre-existing and minimal to fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Website detail page now supports the full generate -> preview -> publish flow
- Phase 4 (visual editor) can build on top of the content/manual_overrides pattern already in WebsiteAST
- Phase 5 (note sync) can extend the sourceNoteId handling already wired in handleGenerate

---
*Phase: 03-ai-generation-publish*
*Completed: 2026-03-18*
