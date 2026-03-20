---
phase: 10-design-agent-context-builder-prompt-rewrite
plan: 01
subsystem: api
tags: [openai, zod, gpt-4o-mini, structured-output, ai-pipeline]

# Dependency graph
requires:
  - phase: 09-component-library
    provides: ComponentSnippet type consumed by Phase 10 pipeline context
provides:
  - DesignResult and ReviewResult interfaces in types.ts
  - PipelineEvent.step union extended with "design" value
  - Design Agent module with runDesignAgent(), FALLBACK_DESIGN, DesignResultSchema
  - Unit tests proving schema validation and fallback behavior
affects:
  - phase-11-reviewer-pipeline-rewire-ui-update

# Tech tracking
tech-stack:
  added: [zod@^3.25.76]
  patterns:
    - Lazy OpenAI client init (avoid module-level new OpenAI() to allow test imports without API key)
    - zodResponseFormat + chat.completions.parse() for typed structured output
    - FALLBACK_DESIGN pattern - return safe default on any error instead of throwing
    - TDD red-green cycle for schema validation and constant shape testing

key-files:
  created:
    - src/lib/ai-pipeline/design-agent.ts
    - src/lib/ai-pipeline/design-agent.test.ts
  modified:
    - src/lib/ai-pipeline/types.ts
    - package.json

key-decisions:
  - "Lazy OpenAI init (function wrapper) instead of module-level const to allow tests without API key"
  - "zod@^3.25.76 pinned to v3 — v4 breaks openai/helpers/zod zodResponseFormat helper"
  - "FALLBACK_DESIGN returns clean-minimal preset on any error — never throws"

patterns-established:
  - "Lazy client pattern: let _client = null; function getClient() { if (!_client) _client = new Client(); return _client; }"
  - "Structured output pattern: zodResponseFormat(Schema, 'name') + chat.completions.parse() + .parsed ?? FALLBACK"
  - "Test-first schema validation: write schema tests before implementation to lock in contract"

requirements-completed: [PIPE-04, PIPE-05]

# Metrics
duration: 4min
completed: 2026-03-20
---

# Phase 10 Plan 01: Design Agent Summary

**Design Agent module with gpt-4o-mini + Zod v3 zodResponseFormat structured output, mapping prompts to visual identities (5 presets, palette, fonts) with clean-minimal fallback**

## Performance

- **Duration:** 4 min 17s
- **Started:** 2026-03-20T11:39:31Z
- **Completed:** 2026-03-20T11:43:48Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Zod v3 installed as direct dep (pinned to ^3 to avoid v4 incompatibility with openai/helpers/zod)
- types.ts extended with DesignResult, ReviewResult interfaces and "design" added to PipelineEvent.step union
- design-agent.ts with runDesignAgent() using gpt-4o-mini + zodResponseFormat structured output
- FALLBACK_DESIGN (clean-minimal preset, Inter fonts) returned on any error — never throws
- 9 unit tests covering schema validation (5 presets, invalid preset, missing fields) and FALLBACK_DESIGN shape

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Zod v3 + extend types.ts** - `76ac5db` (feat)
2. **Task 2: TDD RED - failing tests** - `c378d3f` (test)
3. **Task 2: TDD GREEN - design-agent.ts implementation** - `65c5680` (feat)

**Plan metadata:** (docs commit — see below)

_Note: TDD tasks have multiple commits (test RED → feat GREEN)_

## Files Created/Modified
- `src/lib/ai-pipeline/types.ts` - Added DesignResult, ReviewResult interfaces; extended PipelineEvent.step with "design"
- `src/lib/ai-pipeline/design-agent.ts` - Design Agent: DesignResultSchema (Zod), FALLBACK_DESIGN, runDesignAgent()
- `src/lib/ai-pipeline/design-agent.test.ts` - 9 unit tests for schema validation and fallback shape
- `package.json` - Added zod@^3.25.76 as direct dependency

## Decisions Made
- Used lazy OpenAI client initialization (function wrapper) instead of module-level `new OpenAI()` — module-level init throws without OPENAI_API_KEY env var, preventing test imports
- Pinned Zod to v3 (`^3`) as stated in STATE.md blockers — Zod v4 breaks `openai/helpers/zod` zodResponseFormat
- FALLBACK_DESIGN uses clean-minimal preset (neutral, safe for any domain) with Inter/Inter fonts

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Lazy OpenAI client initialization to fix test import failure**
- **Found during:** Task 2 (design-agent.ts GREEN phase)
- **Issue:** Module-level `const openai = new OpenAI()` throws `Missing credentials` error during test file import (no OPENAI_API_KEY in test environment), preventing all test cases from running
- **Fix:** Replaced with lazy getter `function getOpenAI()` that creates client on first actual API call, not on module import
- **Files modified:** src/lib/ai-pipeline/design-agent.ts
- **Verification:** `npm run test -- design-agent` passes all 9 tests
- **Committed in:** 65c5680 (Task 2 GREEN commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Essential fix for testability. The pattern (lazy client init) is the correct approach for testable OpenAI modules and should be used in future agents.

## Issues Encountered
- Pre-existing typecheck error in `src/app/api/auth/token-login/route.ts` (Cannot find module 'better-call') — confirmed pre-existing by git stash test, unrelated to this plan's changes

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- DesignResult type available for import throughout pipeline
- runDesignAgent() ready for Phase 11 orchestrator integration
- PipelineEvent.step "design" ready for SSE streaming in editor-client.tsx
- Concern: edit mode must inject "preserve existing colors and typography" when no DesignResult — otherwise colors reset on edit (noted in STATE.md blockers)

---
*Phase: 10-design-agent-context-builder-prompt-rewrite*
*Completed: 2026-03-20*
