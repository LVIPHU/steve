---
phase: 11-reviewer-pipeline-rewire-ui-update
plan: 02
subsystem: api
tags: [openai, sse, pipeline, reviewer, refine, orchestrator]

# Dependency graph
requires:
  - phase: 11-01
    provides: reviewer.ts with reviewHtml() and FALLBACK_REVIEW
  - phase: 10-02
    provides: context-builder.ts with buildUserMessage/buildEditUserMessage, design-agent.ts
  - phase: 09-01
    provides: component-library with selectComponents()
provides:
  - 7-step fresh pipeline (analyze/components/design/generate/review/refine/validate) when ENABLE_REFINE=true
  - 5-step fresh pipeline (analyze/components/design/generate/validate) when ENABLE_REFINE=false
  - 4-step edit pipeline (analyze/components/generate/validate)
  - refineHtml() implemented in context-builder.ts using must_fix-only user message
  - generateHtml(userMessage) simplified signature in generator.ts
  - researcher.ts deleted; ResearchResult type deleted from types.ts
  - maxDuration = 60 in generate-html route (Hobby plan safe)
affects:
  - editor-client.tsx (UI step labels for all 7 steps)
  - calibration pass (PIPE-20 pending human verification)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "refineHtml sends only must_fix list + current HTML — no component re-injection (PIPE-12)"
    - "ENABLE_REFINE env var gates review+refine steps — default false for Hobby plan safety"
    - "REVIEW_THRESHOLD defaults to 75 — read inside function body, not module level"
    - "isEditMode = !!currentHtml — both undefined and empty string treated as fresh mode"
    - "Lazy OpenAI init (getOpenAI()) in context-builder.ts mirrors design-agent.ts pattern"

key-files:
  created: []
  modified:
    - src/lib/ai-pipeline/index.ts
    - src/lib/ai-pipeline/context-builder.ts
    - src/lib/ai-pipeline/context-builder.test.ts
    - src/lib/ai-pipeline/generator.ts
    - src/lib/ai-pipeline/types.ts
    - src/lib/html-prompts.ts
    - src/lib/html-prompts.test.ts
    - src/app/api/ai/generate-html/route.ts
  deleted:
    - src/lib/ai-pipeline/researcher.ts

key-decisions:
  - "refineHtml sends only must_fix list + current HTML (no component snippets/design brief) — PIPE-12 contract"
  - "ENABLE_REFINE=false default keeps Hobby plan safe — 5-step fresh avoids 2 extra LLM calls"
  - "maxDuration = 60 to match Vercel Hobby plan hard limit (was 90, silently exceeded)"
  - "html-prompts.test.ts backward-compat alias tests removed — deleted functions can't be tested"

patterns-established:
  - "Pipeline env vars (ENABLE_REFINE, REVIEW_THRESHOLD) read inside function body for test isolation"
  - "Orchestrator pattern: isEditMode branches pipeline into 4-step vs 5/7-step flow"

requirements-completed: [PIPE-11, PIPE-12, PIPE-13, PIPE-14, PIPE-15, PIPE-18, PIPE-19]

# Metrics
duration: 15min
completed: 2026-03-20
---

# Phase 11 Plan 02: Pipeline Rewire Summary

**7/5/4-step orchestrator with conditional review+refine quality gate, refineHtml() implemented, researcher.ts deleted, maxDuration fixed to 60**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-20T08:45:00Z
- **Completed:** 2026-03-20T08:50:49Z
- **Tasks:** 2 of 3 automated (Task 3 is checkpoint:human-verify pending)
- **Files modified:** 8 (1 deleted)

## Accomplishments

- Rewired orchestrator (index.ts) to 7-step fresh (ENABLE_REFINE=true), 5-step fresh (ENABLE_REFINE=false), and 4-step edit pipelines
- Implemented refineHtml() in context-builder.ts with correct PIPE-12 contract: only must_fix list + current HTML sent to gpt-4o
- Migrated generator.ts to new generateHtml(userMessage) signature with lazy OpenAI init; removed legacy buildEnrichedSystemPrompt and ResearchResult dependency
- Deleted researcher.ts and ResearchResult type — both superseded by Component Library + Design Agent
- Fixed maxDuration from 90 to 60 to stay within Vercel Hobby plan hard limit
- All 82 tests pass, typecheck clean (pre-existing better-call error in token-login/route.ts unrelated to this plan)

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement refineHtml(), migrate generator.ts, clean html-prompts.ts** - `ec54fce` (feat)
2. **Task 2: Rewire orchestrator, delete researcher.ts, fix maxDuration** - `0f5afeb` (feat)

**Plan metadata:** (final commit below)

## Files Created/Modified

- `src/lib/ai-pipeline/index.ts` - Full 7/5/4-step orchestrator; no more researcher import
- `src/lib/ai-pipeline/context-builder.ts` - refineHtml() implemented with lazy OpenAI init; imports html-prompts
- `src/lib/ai-pipeline/context-builder.test.ts` - refineHtml test updated from "throws stub" to "is async function"
- `src/lib/ai-pipeline/generator.ts` - Simplified to generateHtml(userMessage) with lazy init
- `src/lib/ai-pipeline/types.ts` - ResearchResult interface deleted
- `src/lib/html-prompts.ts` - buildFreshSystemPrompt and buildEditSystemPrompt aliases removed
- `src/lib/html-prompts.test.ts` - Backward-compat alias tests removed (auto-fix: tests tested deleted functions)
- `src/app/api/ai/generate-html/route.ts` - maxDuration = 60
- `src/lib/ai-pipeline/researcher.ts` - DELETED

## Decisions Made

- refineHtml sends only must_fix list + current HTML — no design brief, no component snippets re-injected. This matches PIPE-12 and keeps the refine call focused and cheap.
- ENABLE_REFINE defaults to false — Hobby plan users get 5-step pipeline; quality gate enabled only when ENABLE_REFINE=true is set.
- REVIEW_THRESHOLD=75 default read inside function body (not module level) — allows per-request override in tests without mocking process.env at module load time.
- maxDuration fixed from 90 to 60 — Vercel Hobby plan hard cap is 60s; 90 was silently ignored and would cause timeout errors on Pro upgrade confusion.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed backward-compat alias tests from html-prompts.test.ts**
- **Found during:** Task 2 (npm run test after deleting buildFreshSystemPrompt/buildEditSystemPrompt)
- **Issue:** html-prompts.test.ts had 4 tests importing and calling buildFreshSystemPrompt and buildEditSystemPrompt — both deleted in Task 1. Tests were failing with "TypeError: not a function".
- **Fix:** Removed the two obsolete describe blocks; replaced with a canonical test that buildSystemPrompt is the only export and returns a string.
- **Files modified:** src/lib/html-prompts.test.ts
- **Verification:** `npm run test` — all 82 tests pass
- **Committed in:** 0f5afeb (part of Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug: tests for deleted functions)
**Impact on plan:** Auto-fix necessary for test suite to pass. No scope creep.

## Issues Encountered

- Pre-existing typecheck error in `src/app/api/auth/token-login/route.ts` (missing `better-call` type declarations) — confirmed present before this plan's changes, out of scope per deviation rules. Logged to deferred items.

## User Setup Required

**PIPE-20 calibration pass requires user action:**
1. Set `ENABLE_REFINE=true` in `.env`
2. Start dev server: `npm run dev`
3. Generate 10+ websites with diverse prompts
4. Inspect `.calibration.jsonl` — verify score distribution (expected 60-95 range)
5. Verify threshold 75 is appropriate; adjust `REVIEW_THRESHOLD` in `.env` if needed
6. Confirm edit mode shows exactly 4 steps (no design/review/refine)
7. Confirm fresh + ENABLE_REFINE=false shows exactly 5 steps
8. Confirm fresh + ENABLE_REFINE=true shows 7 steps (refine step appears when score < 75 or must_fix non-empty)

## Next Phase Readiness

- Pipeline fully wired: all 11 PIPE requirements met in code (PIPE-20 pending calibration human-verify)
- PIPE-20 calibration pass is the only remaining blocker before Phase 11 is complete
- After calibration approval: Phase 11 is done and v1.1 milestone is complete

---
*Phase: 11-reviewer-pipeline-rewire-ui-update*
*Completed: 2026-03-20*
