# Deferred Items

## Phase 01-foundation-completion

### From Plan 01-01

**Pre-existing ESLint failures in non-src files**

`npm run lint` fails with 74 errors + 20 warnings across files not touched by plan 01-01:

1. `.claude/get-shit-done/bin/*.cjs` — `@typescript-eslint/no-require-imports` errors. ESLint config appears to be picking up the `.claude/` directory (CommonJS tooling files with `require()` calls). Fix: add `.claude/` to ESLint ignore patterns.

2. `src/db/schema.ts` — `uuid` and `jsonb` are imported from `drizzle-orm/pg-core` but not used directly (they were likely used in older schema version). Fix: remove unused imports.

These were pre-existing before plan 01-01 changes and are out of scope for that plan. A future plan addressing ESLint config or schema cleanup should resolve them.
