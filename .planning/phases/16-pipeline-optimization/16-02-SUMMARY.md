---
phase: 16-pipeline-optimization
plan: "02"
subsystem: api
tags: [validator, html-pipeline, cross-page-context, tailwind, sse]

requires:
  - phase: 13-multi-page-website-support
    provides: pages JSONB column, multi-page website structure
  - phase: 11-reviewer-pipeline-rewire-ui-update
    provides: runGenerationPipeline, buildUserMessage, buildEditUserMessage

provides:
  - 8 additional rule-based HTML validation checks in validateAndFix()
  - Cross-page design context extraction from existing pages
  - otherPagesContext passed through pipeline to context-builder

affects: [ai-pipeline, generate-html-route, context-builder]

tech-stack:
  added: []
  patterns:
    - "Validator checks ordered: fixes first, then warnings — ensures auto-fixes apply before length checks"
    - "runGenerationPipeline uses object params signature for extensibility"
    - "Cross-page context extracted inline in route.ts before SSE stream opens"

key-files:
  created: []
  modified:
    - src/lib/ai-pipeline/validator.ts
    - src/lib/ai-pipeline/context-builder.ts
    - src/lib/ai-pipeline/index.ts
    - src/app/api/ai/generate-html/route.ts

key-decisions:
  - "runGenerationPipeline refactored from positional params to object params — supports optional otherPagesContext without breaking existing callers"
  - "Cross-page context extraction capped at 3 pages to keep context small"
  - "otherPagesContext appended to both buildUserMessage and buildEditUserMessage — edit mode also benefits from design consistency"

patterns-established:
  - "Validator append-only pattern: new checks added after existing ones, never interleave"

requirements-completed: []

duration: 3min
completed: 2026-03-24
---

# Phase 16 Plan 02: Strengthen Validator + Cross-page Context Summary

**8 rule-based HTML validator checks (DOCTYPE, tags, viewport, CDN, empty body, short HTML, script mismatch, undefined CSS vars) + cross-page palette/font context injected into AI generation prompt for visual consistency across pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-24T15:58:48Z
- **Completed:** 2026-03-24T16:01:14Z
- **Tasks:** 4
- **Files modified:** 4

## Accomplishments

- Added 8 validator checks to `validateAndFix()` — catches DOCTYPE, essential HTML tags, viewport meta, Tailwind CDN, empty body, suspiciously short HTML, mismatched script tags, and undefined CSS custom properties
- Implemented cross-page design context extraction in `route.ts` — reads palette CSS vars, Google Fonts families, and nav links from existing pages (up to 3) before pipeline runs
- Updated `runGenerationPipeline` to object parameter signature with optional `otherPagesContext`
- Propagated `otherPagesContext` through `buildUserMessage()` and `buildEditUserMessage()` in context-builder

## Task Commits

Each task was committed atomically:

1. **Task 1: Add 8 validator checks** - `419ce7a` (feat)
2. **Tasks 2-4: Cross-page context pipeline** - `77cf2e2` (feat)

## Files Created/Modified

- `src/lib/ai-pipeline/validator.ts` - Added 8 new checks (1 auto-fix + 7 warnings)
- `src/lib/ai-pipeline/context-builder.ts` - buildUserMessage + buildEditUserMessage accept optional otherPagesContext
- `src/lib/ai-pipeline/index.ts` - runGenerationPipeline refactored to object params, passes otherPagesContext down
- `src/app/api/ai/generate-html/route.ts` - Extracts cross-page design context from existing pages before pipeline

## Decisions Made

- `runGenerationPipeline` changed from 3 positional params to object params — avoids positional confusion when adding optional params and is more idiomatic for functions with many optional args
- Cross-page context extraction capped at 3 pages to keep context token count manageable
- `otherPagesContext` appended to both fresh and edit mode messages — ensures new pages and edits both respect established design

## Deviations from Plan

None - plan executed exactly as written. Tasks 2, 3, and 4 committed together as one logical unit (tightly coupled cross-page context feature).

## Issues Encountered

Pre-existing test failures (3 tests) in `html-prompts.test.ts` and `context-builder.test.ts` were present before this plan and are out of scope. No new failures introduced.

Pre-existing TypeScript error in `src/app/api/auth/token-login/route.ts` (missing `better-call` types) — pre-existing, out of scope.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Validator now catches most common AI generation failures at zero LLM cost
- Cross-page context wired end-to-end — new pages will receive design hints from existing pages
- Ready for Phase 17 (UI quality upgrade) or Phase 18 (observability)

---
*Phase: 16-pipeline-optimization*
*Completed: 2026-03-24*
