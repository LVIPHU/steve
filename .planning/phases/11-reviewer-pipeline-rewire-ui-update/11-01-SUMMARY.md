---
phase: 11-reviewer-pipeline-rewire-ui-update
plan: 01
subsystem: ai-pipeline
tags: [openai, zod, gpt-4o-mini, sse, typescript, reviewer, scoring, calibration]

# Dependency graph
requires:
  - phase: 10-design-agent-context-builder-prompt-rewrite
    provides: design-agent.ts lazy OpenAI pattern, ReviewResult interface in types.ts
provides:
  - reviewHtml() function scoring HTML quality 0-100 via gpt-4o-mini + zodResponseFormat
  - ReviewResultSchema (Zod) with dimension sub-scores visual/content/technical
  - FALLBACK_REVIEW with score=100 and empty must_fix (error = assume OK, skip refine)
  - appendCalibrationLog() writing .calibration.jsonl after every review call
  - PipelineEvent.step extended to 9 values (research removed, components/review/refine added)
  - STEP_LABELS updated to 7-key Vietnamese map matching UI-SPEC
affects:
  - 11-02 (orchestrator rewire will import reviewHtml from reviewer.ts)
  - editor-client.tsx consumers watching SSE step events

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Lazy OpenAI init (let _openai = null; function getOpenAI()) in reviewer.ts"
    - "zodResponseFormat(Schema, 'name') for structured AI output from gpt-4o-mini"
    - "FALLBACK constant (score=100) means error = assume OK, skip refine"
    - "appendFileSync calibration log in try/catch (non-fatal)"

key-files:
  created:
    - src/lib/ai-pipeline/reviewer.ts
    - src/lib/ai-pipeline/reviewer.test.ts
  modified:
    - src/lib/ai-pipeline/types.ts
    - src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx
    - src/lib/ai-pipeline/index.ts
    - .gitignore

key-decisions:
  - "FALLBACK_REVIEW score=100 (not 0) — error during review means assume OK, skip refine to prevent silent quality gate blocking"
  - "index.ts 'research' step events bridged to 'components' to fix type break — full orchestrator rewire deferred to Plan 02"
  - "pre-existing better-call TS2307 error confirmed pre-existing before our changes, out of scope per deviation rules"

patterns-established:
  - "Reviewer pattern: same lazy OpenAI init + zodResponseFormat + AbortSignal.timeout(20000) + FALLBACK as design-agent.ts"
  - "Calibration log: non-fatal try/catch appendFileSync — log failure never blocks generation pipeline"

requirements-completed: [PIPE-10, PIPE-16, PIPE-17]

# Metrics
duration: 3min
completed: 2026-03-20
---

# Phase 11 Plan 01: Reviewer Module + Pipeline Types + STEP_LABELS Summary

**gpt-4o-mini quality scorer (reviewer.ts) with 0-100 Zod-validated scoring, calibration log, and 7-step Vietnamese pipeline labels replacing 4-step research-based labels**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-20T08:40:37Z
- **Completed:** 2026-03-20T08:43:34Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Created `reviewer.ts` mirroring design-agent.ts lazy OpenAI pattern with `reviewHtml()` using gpt-4o-mini + zodResponseFormat, FALLBACK_REVIEW (score=100, must_fix=[]), and `appendCalibrationLog()` writing .calibration.jsonl after every review call
- 8 unit tests passing in `reviewer.test.ts` covering schema validation (score/visual/content/technical bounds) and FALLBACK_REVIEW structure
- Extended `PipelineEvent.step` union from 7 to 9 values: removed `"research"`, added `"components"`, `"review"`, `"refine"`
- Updated `STEP_LABELS` in `editor-client.tsx` to 7-key map with exact Vietnamese diacritics from UI-SPEC
- Added `.calibration.jsonl` to `.gitignore`

## Task Commits

1. **Task 1: Create reviewer.ts and reviewer.test.ts** - `d68d28e` (feat)
2. **Task 2: Extend PipelineEvent types and update STEP_LABELS** - `82c2e55` (feat)

## Files Created/Modified

- `src/lib/ai-pipeline/reviewer.ts` - Quality scorer: reviewHtml(), ReviewResultSchema, FALLBACK_REVIEW, appendCalibrationLog()
- `src/lib/ai-pipeline/reviewer.test.ts` - 8 unit tests for schema validation and fallback structure
- `src/lib/ai-pipeline/types.ts` - PipelineEvent.step extended with components/review/refine, research removed
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` - STEP_LABELS updated to 7-key Vietnamese map
- `src/lib/ai-pipeline/index.ts` - Bridge fix: "research" step events updated to "components" to fix type break
- `.gitignore` - Added .calibration.jsonl entry

## Decisions Made

- FALLBACK_REVIEW score=100 (not 0) — error during review means "assume OK, skip refine" to prevent a broken API key from silently blocking all generation
- `index.ts` research step events bridged to "components" to fix the type error caused by our type change — full orchestrator rewire is Plan 02's job
- Pre-existing `better-call` TS2307 error confirmed pre-existing (git stash verified), treated as out-of-scope per deviation rules

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed type error in index.ts caused by PipelineEvent.step type change**
- **Found during:** Task 2 (Extend PipelineEvent types and update STEP_LABELS)
- **Issue:** index.ts emitted `{ step: "research" }` events, which became invalid after removing "research" from the PipelineEvent.step union. TypeScript reported TS2322 errors on lines 24 and 27.
- **Fix:** Changed step value from "research" to "components" in both start/done events. Added comment noting this is a bridge until Plan 02 orchestrator rewire.
- **Files modified:** src/lib/ai-pipeline/index.ts
- **Verification:** `npm run typecheck` passes (only pre-existing better-call error remains); `npm run test` 85/85 passing
- **Committed in:** 82c2e55 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - type bug caused by our own type change)
**Impact on plan:** Necessary fix for type correctness. index.ts bridge is explicitly temporary — Plan 02 rewire will replace it entirely.

## Issues Encountered

None beyond the auto-fixed type break documented above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `reviewer.ts` is ready for Plan 02 to import `reviewHtml` and wire into the orchestrator
- `FALLBACK_REVIEW` and `ReviewResultSchema` are exported and test-verified
- `PipelineEvent.step` type contract is complete with all 9 values Plan 02 will emit
- `STEP_LABELS` is already updated — no UI changes needed in Plan 02
- Calibration log infrastructure in place; threshold calibration (10+ runs at score 75) is a Phase 11 post-ship concern

---
*Phase: 11-reviewer-pipeline-rewire-ui-update*
*Completed: 2026-03-20*
