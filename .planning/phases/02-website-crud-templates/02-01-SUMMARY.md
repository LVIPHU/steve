---
phase: 02-website-crud-templates
plan: 01
subsystem: templates-api
tags: [vitest, templates, slug, api, drizzle, tdd]
dependency_graph:
  requires: []
  provides: [template-system, slug-utility, website-mutation-api]
  affects: [02-02, 02-03]
tech_stack:
  added: [vitest]
  patterns: [TDD red-green, keyword-map template suggestion, ownership-checked mutations]
key_files:
  created:
    - vitest.config.ts
    - src/lib/templates.ts
    - src/lib/slugify.ts
    - src/app/api/websites/[id]/route.ts
    - tests/templates.test.ts
    - tests/slugify.test.ts
  modified:
    - package.json
decisions:
  - Moved "work" keyword to end of KEYWORD_MAP so more specific fitness keywords ("gym", "workout", "exercise") are matched first — avoids false portfolio match on "gym-workout"
  - PATCH validates both name and status fields independently, returns 400 for invalid values before ownership check
  - Used Next.js 15+ async params pattern: `{ params }: { params: Promise<{ id: string }> }`
metrics:
  duration: 3m 21s
  completed_date: "2026-03-17"
  tasks_completed: 2
  files_created: 6
  files_modified: 1
---

# Phase 02 Plan 01: Foundation Layer (Templates, Slug, API) Summary

**One-liner:** Vitest TDD setup with 5-template keyword-suggestion system, kebab-case slug utility, and ownership-checked PATCH/DELETE website API.

## Tasks Completed

| # | Task | Commit | Files |
|---|---|---|---|
| 1 | Vitest setup + template system + slug utility (TDD) | dea5ae8, 7295b47 | vitest.config.ts, src/lib/templates.ts, src/lib/slugify.ts, tests/*.test.ts, package.json |
| 2 | Website mutation API route (PATCH + DELETE) | 0eb2a27 | src/app/api/websites/[id]/route.ts |

## Verification Results

- `npx vitest run` — 17 tests, 2 test files, all pass
- `npx tsc --noEmit` — 0 TypeScript errors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed KEYWORD_MAP ordering causing false portfolio match**
- **Found during:** Task 1 GREEN phase (test run)
- **Issue:** `suggestTemplate("gym-workout")` returned `"portfolio"` instead of `"fitness"` because "work" (mapped to portfolio) appeared before "gym" and "workout" in KEYWORD_MAP iteration, and "workout" contains "work"
- **Fix:** Moved "work" keyword to end of KEYWORD_MAP so specific fitness keywords ("gym", "workout", "exercise") are matched first
- **Files modified:** src/lib/templates.ts
- **Commit:** 7295b47

## Key Decisions

1. **KEYWORD_MAP ordering** — more specific multi-character keywords placed before shorter ambiguous ones ("workout" before "work"). JavaScript object iteration order follows insertion order, making this deterministic.
2. **PATCH accepts partial updates** — either `name` or `status` can be updated independently; both fields validated before the DB ownership check.
3. **Async params** — used `Promise<{ id: string }>` signature for Next.js 15+ App Router route handlers as specified in plan.

## Self-Check: PASSED

All 6 created files confirmed present on disk. All 3 task commits (dea5ae8, 7295b47, 0eb2a27) confirmed in git log.
