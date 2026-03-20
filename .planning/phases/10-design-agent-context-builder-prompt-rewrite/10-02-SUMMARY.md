---
phase: 10-design-agent-context-builder-prompt-rewrite
plan: "02"
subsystem: ai-pipeline
tags: [openai, prompt-engineering, context-builder, html-prompts, prompt-caching, tdd]

# Dependency graph
requires:
  - phase: 10-01
    provides: DesignResult, ReviewResult types in ai-pipeline/types.ts
  - phase: 09-01
    provides: ComponentSnippet type in component-library/types.ts

provides:
  - buildUserMessage() — Markdown user message with Design Brief, Component References, Page Structure, User Request
  - buildEditUserMessage() — Preserve-first edit message with no design context
  - buildGoogleFontsImport() — Google Fonts @import URL builder with deduplication
  - refineHtml() — Placeholder stub throwing "Not implemented — Phase 11"
  - buildSystemPrompt() — Lean invariant system prompt (~1000-1100 tokens, no per-request data)
  - buildFreshSystemPrompt alias — backward-compat for generator.ts
  - buildEditSystemPrompt wrapper — backward-compat thin wrapper for generator.ts

affects:
  - phase-11 (pipeline rewire will consume buildUserMessage/buildEditUserMessage/buildSystemPrompt directly)
  - src/lib/ai-pipeline/generator.ts (Phase 11 will update imports)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Separation of invariant system prompt from per-request user message for OpenAI prompt caching"
    - "TDD red-green cycle for new modules"
    - "Backward-compat alias pattern: export { newName as oldName } for non-breaking rename"
    - "Google Fonts URL deduplication via Array.filter with indexOf"
    - "Edit mode uses preserve-first user message instead of separate system prompt"

key-files:
  created:
    - src/lib/ai-pipeline/context-builder.ts
    - src/lib/ai-pipeline/context-builder.test.ts
  modified:
    - src/lib/html-prompts.ts
    - src/lib/html-prompts.test.ts

key-decisions:
  - "buildSystemPrompt() is zero-parameter invariant — enables OpenAI prompt caching (75% cost reduction on cached tokens)"
  - "Template structure hints (LANDING PAGE, PORTFOLIO, DASHBOARD, BLOG) removed from system prompt — moved to user message via Page Structure section"
  - "backward-compat aliases (buildFreshSystemPrompt, buildEditSystemPrompt) kept in html-prompts.ts — Phase 11 cleans up generator.ts imports"
  - "refineHtml() stub exported with correct signature but throws 'Not implemented' — Phase 11 implements it"
  - "buildEditUserMessage() has no DesignResult or snippets — edit mode must preserve existing colors, not reset them"

patterns-established:
  - "User message = per-request dynamic data (Design Brief, snippets, analysis, prompt)"
  - "System prompt = static invariant rules only (CDN links, CSS rules, anti-patterns)"
  - "Google Fonts @import built at user-message time, not system-prompt time"

requirements-completed: [PIPE-06, PIPE-07, PIPE-08, PIPE-09]

# Metrics
duration: 7min
completed: 2026-03-20
---

# Phase 10 Plan 02: Context Builder + Lean System Prompt Summary

**context-builder.ts with 4 exports (buildUserMessage, buildEditUserMessage, buildGoogleFontsImport, refineHtml stub) and html-prompts.ts rewritten as lean invariant system prompt with backward-compat aliases for generator.ts**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-20T04:48:04Z
- **Completed:** 2026-03-20T04:55:00Z
- **Tasks:** 2
- **Files modified:** 4 (2 created, 2 rewritten)

## Accomplishments

- Created `context-builder.ts` with all 4 exports; 14 TDD tests all green
- Rewrote `html-prompts.ts`: removed 4 template structure hint blocks, added CSS custom properties instruction, added Component References instruction; 18 tests all green
- Full test suite 77/77 passing — zero regressions in any of 5 test files
- generator.ts remains unmodified and compiles correctly via backward-compat aliases

## Task Commits

Each task was committed atomically:

1. **Task 1: Create context-builder.ts + context-builder.test.ts** - `5df1dd9` (feat — TDD green)
2. **Task 2: Rewrite html-prompts.ts + update html-prompts.test.ts** - `7ad0651` (feat)

**Plan metadata:** (docs commit below)

_Note: Task 1 was TDD — test file written first (red), then implementation (green), single commit for full green phase_

## Files Created/Modified

- `src/lib/ai-pipeline/context-builder.ts` — 4 exports: buildUserMessage, buildEditUserMessage, buildGoogleFontsImport, refineHtml
- `src/lib/ai-pipeline/context-builder.test.ts` — 14 unit tests covering all behavior branches
- `src/lib/html-prompts.ts` — Lean invariant buildSystemPrompt() + backward-compat aliases; stripMarkdownFences unchanged
- `src/lib/html-prompts.test.ts` — 18 tests including no-template-hints assertion, compat alias tests, CSS variable tests

## Decisions Made

- buildSystemPrompt() takes zero parameters — all per-request data moves to user message, enabling OpenAI prompt caching
- Template structure hints removed from system prompt; Page Structure section in buildUserMessage() carries that info instead
- Backward-compat aliases (buildFreshSystemPrompt, buildEditSystemPrompt) retained in html-prompts.ts — generator.ts Phase 11 migration deferred
- refineHtml() stub throws "Not implemented — Phase 11" rather than being omitted — ensures Phase 11 integration point is wired correctly from the start

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Pre-existing TypeScript error in `src/app/api/auth/token-login/route.ts` (Cannot find module 'better-call') — unrelated to this plan, not fixed. `npm run typecheck` exits non-zero but all our files compile correctly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- context-builder.ts ready for Phase 11 orchestrator to import buildUserMessage/buildEditUserMessage
- buildSystemPrompt() ready for Phase 11 to replace buildFreshSystemPrompt call in generator.ts
- refineHtml() stub ready for Phase 11 to implement with OpenAI call
- All Phase 10 requirements complete: PIPE-04 through PIPE-09 done across plans 01 and 02

---
*Phase: 10-design-agent-context-builder-prompt-rewrite*
*Completed: 2026-03-20*
