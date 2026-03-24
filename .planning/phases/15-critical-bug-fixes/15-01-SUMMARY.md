---
phase: 15-critical-bug-fixes
plan: "01"
subsystem: ai-pipeline
tags: [openai, context-builder, html-prompts, edit-mode, system-prompt]

# Dependency graph
requires:
  - phase: 13-multi-page-website-support
    provides: currentHtml available in pipeline index.ts as edit mode input
  - phase: 11-reviewer-pipeline-rewire-ui-update
    provides: buildSystemPrompt() zero-param invariant, context-builder.ts
provides:
  - Edit mode now sends currentHtml to LLM via buildEditUserMessage()
  - buildSystemPrompt() supports mode param (fresh | edit) for compact edit prompt
  - generateHtml() accepts and passes mode to buildSystemPrompt
affects: [ai-pipeline, edit-mode, context-builder, html-prompts, generator]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "buildSystemPrompt(mode) — mode-aware prompt selection with 'fresh' default preserving zero-param call"
    - "buildEditUserMessage(prompt, currentHtml, otherPagesContext?) — currentHtml always injected in edit mode"

key-files:
  created: []
  modified:
    - src/lib/ai-pipeline/context-builder.ts
    - src/lib/ai-pipeline/index.ts
    - src/lib/html-prompts.ts
    - src/lib/ai-pipeline/generator.ts
    - src/lib/ai-pipeline/context-builder.test.ts
    - src/lib/html-prompts.test.ts

key-decisions:
  - "buildEditUserMessage requires currentHtml as 2nd param — LLM must see full current HTML to edit in place"
  - "otherPagesContext is optional 3rd param — multi-page design consistency without breaking single-page flow"
  - "buildSystemPrompt(mode='fresh') default preserves zero-param call for OpenAI prompt caching (75% cost reduction on cached tokens)"
  - "Edit mode system prompt is 7 lines only (vs ~120 lines for fresh) — no CDN setup, no dark mode template, no Preline patterns"

patterns-established:
  - "Mode param with default: function accepts 'fresh' | 'edit' with default 'fresh' to preserve backward compat"

requirements-completed: []

# Metrics
duration: 15min
completed: 2026-03-24
---

# Phase 15 Plan 01: Fix Edit Mode + Split System Prompt Summary

**Edit mode now sends currentHtml to LLM + buildSystemPrompt() returns a compact 7-line edit prompt instead of 120-line fresh generation prompt**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-24T15:05:25Z
- **Completed:** 2026-03-24T15:20:00Z
- **Tasks:** 5
- **Files modified:** 6 (4 source, 2 test)

## Accomplishments

- `buildEditUserMessage()` now requires `currentHtml` as 2nd param and injects `## Current HTML` section with CRITICAL RULES so LLM receives full existing HTML to edit in place
- `buildSystemPrompt(mode)` returns compact 7-line edit prompt when `mode='edit'`, full 120-line fresh prompt when `mode='fresh'` (default), backward-compat zero-param call unchanged
- `generateHtml(userMessage, mode)` accepts mode and passes to `buildSystemPrompt` — `index.ts` passes `isEditMode ? 'edit' : 'fresh'`

## Task Commits

1. **Tasks 1+2: Fix buildEditUserMessage + wire currentHtml** - `2b43bd9` (fix)
2. **Tasks 3+4+5: Split buildSystemPrompt + wire mode** - `110fedb` (feat)
3. **Test updates + pre-existing test fixes** - `7ab2ffc` (test)

## Files Created/Modified

- `src/lib/ai-pipeline/context-builder.ts` - buildEditUserMessage now (prompt, currentHtml, otherPagesContext?) with ## Current HTML section
- `src/lib/ai-pipeline/index.ts` - passes currentHtml! and mode flag to respective functions
- `src/lib/html-prompts.ts` - buildSystemPrompt accepts mode param, edit mode returns compact prompt
- `src/lib/ai-pipeline/generator.ts` - generateHtml accepts mode param, passes to buildSystemPrompt
- `src/lib/ai-pipeline/context-builder.test.ts` - tests updated for new signature
- `src/lib/html-prompts.test.ts` - new tests for edit mode + 3 pre-existing failures fixed

## Decisions Made

- `buildEditUserMessage` requires `currentHtml` as 2nd param (not optional) because it is always required in edit mode — making it optional would allow calling without it which is the bug being fixed
- `otherPagesContext` is optional to support both single-page edits and multi-page design consistency without breaking existing callers
- System prompt default `mode='fresh'` ensures zero-param `buildSystemPrompt()` still works for OpenAI prompt caching

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed 3 pre-existing test failures**
- **Found during:** Test run after implementing plan tasks
- **Issue:** 3 tests were already failing before changes: (a) `includes DaisyUI CDN` used lowercase "daisyui" but prompt says "DaisyUI", (b) `flip card CSS rules` checked for "perspective: 1000px" which was never in the Preline-based prompt, (c) `Link Convention` checked for "about.html" but actual text is `href="about"` (no .html)
- **Fix:** Updated test assertions to match actual prompt content: "DaisyUI", "transform-style: preserve-3d", `href="about"` + "WITHOUT .html extension"
- **Files modified:** `src/lib/ai-pipeline/context-builder.test.ts`, `src/lib/html-prompts.test.ts`
- **Verification:** `npm run test` — 93/93 tests passing (was 90/93 before)
- **Committed in:** `7ab2ffc` (test commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — pre-existing test bugs)
**Impact on plan:** Test fixes necessary for clean test suite. No scope creep.

## Issues Encountered

- `npm run typecheck` has a pre-existing error in `src/app/api/auth/token-login/route.ts` (Cannot find module 'better-call') — unrelated to this plan's changes, not introduced by this work.

## Known Stubs

None — all changes are complete implementations.

## Next Phase Readiness

- Edit mode bug fixed: LLM now receives full current HTML and uses compact system prompt
- Ready for Phase 15 Plan 02 if additional bug fixes are planned
- Pre-existing typecheck error in token-login/route.ts should be addressed separately

---
*Phase: 15-critical-bug-fixes*
*Completed: 2026-03-24*
