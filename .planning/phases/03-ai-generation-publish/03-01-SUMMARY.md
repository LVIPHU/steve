---
phase: 03-ai-generation-publish
plan: 01
subsystem: api
tags: [openai, gpt-4o, typescript, vitest, drizzle, ast, json-validation]

# Dependency graph
requires:
  - phase: 02-website-crud-templates
    provides: websites table, generateSlug utility, auth pattern, Vitest test infrastructure

provides:
  - WebsiteAST type system (SectionType, all content interfaces, WebsiteAST interface)
  - parseAndValidateAST — validates and throws on malformed input
  - resolveField — manual_overrides ?? ai_content render rule
  - buildSystemPrompt / buildUserPrompt — template-aware GPT-4o prompt builders
  - POST /api/ai/generate — authenticates, calls GPT-4o, validates, saves to DB

affects:
  - 03-02 (dashboard detail page uses /api/ai/generate)
  - 03-03 (public route renders WebsiteAST via section components)
  - 04 (editor reads/writes manual_overrides using resolveField pattern)

# Tech tracking
tech-stack:
  added: [openai@6.32.0]
  patterns:
    - parseAndValidateAST pattern (validate-or-throw for AI JSON output)
    - resolveField pattern (manual_overrides ?? ai_content for section rendering)
    - Route Handler with AbortSignal.timeout(30000) for OpenAI calls
    - template-aware prompt building with TEMPLATE_PRESETS / TEMPLATE_COLORS / TEMPLATE_FONTS

key-files:
  created:
    - src/types/website-ast.ts
    - src/lib/ast-utils.ts
    - src/lib/ast-utils.test.ts
    - src/lib/ai-prompts.ts
    - src/lib/ai-prompts.test.ts
    - src/app/api/ai/generate/route.ts
  modified:
    - .env.example (OPENAI_API_KEY added — file exists on disk, gitignored by .env* pattern)
    - package.json (openai dependency added)

key-decisions:
  - "Route Handler (not Server Action) for /api/ai/generate — explicit timeout control via AbortSignal.timeout(30000)"
  - "Manual validate-or-throw (parseAndValidateAST) instead of Zod — schema is small and locked, simpler code"
  - "Slug normalized via generateSlug() on AI output — prevents invalid chars from GPT-4o reaching DB"
  - "Both content (full AST) and seoMeta columns written on every generation — keeps them in sync per Pitfall 4"
  - ".env.example is gitignored by .env* pattern — OPENAI_API_KEY documented on disk but not tracked in git"

patterns-established:
  - "Pattern: parseAndValidateAST validates structure then casts — use this for all AI JSON output"
  - "Pattern: resolveField<T>(section, field) — all section components use this render rule"
  - "Pattern: TEMPLATE_PRESETS/COLORS/FONTS maps — add new templates here first"

requirements-completed: [F-10, F-11]

# Metrics
duration: 3min
completed: 2026-03-18
---

# Phase 3 Plan 01: AI Foundation Summary

**WebsiteAST type system, GPT-4o generate API route, and prompt builders with 23 passing unit tests using openai@6.32.0**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-17T19:33:12Z
- **Completed:** 2026-03-17T19:36:12Z
- **Tasks:** 2/2
- **Files modified:** 7

## Accomplishments

- Full WebsiteAST type system with 6 section content interfaces and a discriminated union
- parseAndValidateAST validates structure and throws descriptive errors on all invalid inputs (tested)
- resolveField implements manual_overrides ?? ai_content render rule (tested)
- buildSystemPrompt generates template-aware GPT-4o system prompts with correct colors/fonts/section presets (tested)
- POST /api/ai/generate route: auth, ownership check, GPT-4o call, validation, slug normalization, DB write, timeout handling

## Task Commits

Each task was committed atomically:

1. **Task 1: WebsiteAST types + AST utilities + AI prompt builders** - `6e711d8` (feat)
2. **Task 2: POST /api/ai/generate route + .env.example update** - `1095cf6` (feat)

**Plan metadata:** (created after this summary)

## Files Created/Modified

- `src/types/website-ast.ts` — SectionType, HeroContent, AboutContent, FeaturesContent, ContentContent, GalleryContent, CtaContent, SectionContent, Section, WebsiteTheme, SeoMeta, WebsiteAST
- `src/lib/ast-utils.ts` — VALID_SECTION_TYPES, parseAndValidateAST, resolveField
- `src/lib/ast-utils.test.ts` — 14 unit tests covering all validation paths and resolveField
- `src/lib/ai-prompts.ts` — TEMPLATE_PRESETS, TEMPLATE_COLORS, TEMPLATE_FONTS, buildSystemPrompt, buildUserPrompt
- `src/lib/ai-prompts.test.ts` — 9 unit tests covering all template cases and prompt variants
- `src/app/api/ai/generate/route.ts` — POST handler: auth, ownership, GPT-4o, parse+validate, generateSlug, DB write, timeout (504)
- `package.json` — openai@6.32.0 added

## Decisions Made

- Route Handler (not Server Action) for `/api/ai/generate` — gives explicit timeout control via `AbortSignal.timeout(30000)`, returns 504 on timeout
- Manual validate-or-throw (`parseAndValidateAST`) instead of Zod — schema is small and locked, manual guard is simpler and lighter
- Slug normalized via `generateSlug()` on AI output before DB write — prevents invalid characters from GPT-4o reaching the database
- Both `content` (full AST) and `seoMeta` JSONB columns written together on every generation — keeps them in sync (avoids Pitfall 4 from RESEARCH.md)
- `.env.example` is gitignored by `.env*` pattern — `OPENAI_API_KEY` was added to the file on disk but git does not track it

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- `.env.example` is captured by `.gitignore`'s `.env*` glob pattern and cannot be committed. The file was updated on disk with `OPENAI_API_KEY` but git does not track it. This is a pre-existing gitignore configuration — no change made.

## User Setup Required

Add `OPENAI_API_KEY` to your local `.env` file:

```
OPENAI_API_KEY=your-openai-api-key
```

Get the key from [platform.openai.com](https://platform.openai.com/api-keys).

## Next Phase Readiness

- All types and utilities are ready — Plans 03-02 and 03-03 can import from `@/types/website-ast`, `@/lib/ast-utils`, `@/lib/ai-prompts`
- `/api/ai/generate` is live — dashboard detail page (03-02) can call it immediately
- 40 tests passing (including pre-existing 17 from Phase 2)

---
*Phase: 03-ai-generation-publish*
*Completed: 2026-03-18*
