---
phase: 13-multi-page-website-support
plan: "01"
subsystem: backend
tags: [database, api, routing, ai-pipeline]
dependency_graph:
  requires: []
  provides: [pages-jsonb-column, patch-pages-api, generate-pages-api, public-page-routing, relative-link-instruction]
  affects: [src/db/schema.ts, src/app/api/websites, src/app/(public), src/lib/ai-pipeline/context-builder.ts]
tech_stack:
  added: []
  patterns: [jsonb-set-atomic-update, drizzle-raw-sql, nested-nextjs-route-handlers]
key_files:
  created:
    - src/app/(public)/[username]/[slug]/[page]/route.ts
    - drizzle/0001_add_pages_column.sql
    - scripts/run-pages-migration.ts
  modified:
    - src/db/schema.ts
    - src/app/api/websites/[id]/route.ts
    - src/app/api/ai/generate-html/route.ts
    - src/lib/ai-pipeline/context-builder.ts
    - src/lib/ai-pipeline/context-builder.test.ts
    - src/app/(public)/[username]/[slug]/route.ts
decisions:
  - "Used scripts/run-pages-migration.ts (tsx) instead of drizzle-kit generate — drizzle-kit confused by schema drift between snapshot and actual DB (old columns in 0000 migration, new columns added via db:push never recorded). Manual migration SQL is simpler and correct."
  - "ADD COLUMN IF NOT EXISTS used in migration SQL for idempotency — safe to re-run without error"
  - "jsonb_set with ARRAY[pageName] + to_jsonb(html::text) avoids SQL injection and handles HTML with quotes correctly (Pitfall 1)"
  - "pages.index fallback to htmlContent in slug route provides zero-downtime backward compat during transition"
  - "chat_history validation changed from !Array.isArray to typeof !== 'object' to accept per-page format { [pageName]: ChatMessage[] }"
metrics:
  duration_seconds: 310
  completed_date: "2026-03-23"
  tasks_completed: 3
  files_modified: 9
---

# Phase 13 Plan 01: Backend Foundation for Multi-page Website Support Summary

**One-liner:** pages JSONB column with atomic jsonb_set writes, public nested routing for /{username}/{slug}/{page}, and relative link instruction in AI context builder.

## What Was Built

### Task 1 — Schema + Migration
Added `pages: t.jsonb("pages")` to the `websites` table alongside the existing `htmlContent TEXT` column (backward compat per D-02). Drizzle-kit generate was non-interactive due to schema drift, so a manual migration script (`scripts/run-pages-migration.ts`) was created using `postgres.js` directly. The script ran `ADD COLUMN IF NOT EXISTS` then `UPDATE websites SET pages = jsonb_build_object('index', html_content) WHERE html_content IS NOT NULL` — 1 existing row migrated.

### Task 2 — PATCH API + Generate API + Link Convention
- **PATCH `/api/websites/[id]`**: Added `pages` field validation (must be object or null). Updated `chat_history` validation to accept both arrays and objects (per-page format `{ [pageName]: ChatMessage[] }`).
- **POST `/api/ai/generate-html`**: Added `pageName` param (default `"index"`), atomic `jsonb_set(COALESCE(pages, '{}'), ARRAY[pageName], to_jsonb(html::text))` replaces the previous `htmlContent: html` update.
- **`buildUserMessage()`**: Added `## Link Convention` section with relative link instruction (`about.html`, `contact.html`, `index.html`). `buildEditUserMessage()` unchanged.
- **Tests**: 2 new tests added and passing: Link Convention present in buildUserMessage, absent in buildEditUserMessage.

### Task 3 — Public Routing
- **`/{username}/{slug}`**: Updated to read `pages["index"]` with fallback to `htmlContent` for pre-migration websites.
- **`/{username}/{slug}/{page}`**: New route handler at `src/app/(public)/[username]/[slug]/[page]/route.ts`. Returns 404 if page not found in pages object. Draft/archived handling identical to slug route.

## Verification

- `npm run typecheck`: passes (1 pre-existing error in `token-login/route.ts` about `better-call` — unrelated, pre-existing)
- `npx vitest run src/lib/ai-pipeline/context-builder.test.ts`: 16/16 tests pass
- `npm run test`: 84/86 pass — 2 pre-existing failures in `html-prompts.test.ts` (DaisyUI CDN tests from Phase 12 gap) — unrelated to this plan

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] drizzle-kit generate non-functional due to schema drift**
- **Found during:** Task 1
- **Issue:** `npm run db:generate` launched an interactive prompt asking to classify existing columns. The drizzle meta snapshot (0000) predates many schema changes made via `db:push` — it listed old columns (`template_id`, `content`, `seo_meta`, etc.) that no longer exist in schema.ts. `db:push --force` crashed with `TypeError: Cannot read properties of undefined (reading 'replace')` in drizzle-kit.
- **Fix:** Created `scripts/run-pages-migration.ts` to run the migration directly via `postgres.js`. Also created `drizzle/0001_add_pages_column.sql` as documentation artifact. Migration ran successfully: 1 row updated.
- **Files modified:** `drizzle/0001_add_pages_column.sql` (new), `scripts/run-pages-migration.ts` (new)
- **Commits:** 9df8db3

## Known Stubs

None — all code paths are fully wired. The `pages` column exists in DB, the PATCH API writes to it, the generate API writes atomically to `pages[pageName]`, and both public routes read from it.

## Self-Check: PASSED

All created/modified files exist on disk. All task commits verified in git log (9df8db3, 82cf3da, 870feaf).
