---
phase: 05-note-sync-analytics
plan: "01"
subsystem: sync-api
tags: [api, sync, background-ai, polling, tdd]
dependency_graph:
  requires: []
  provides: [sync-trigger-api, sync-badge-ui, websites-poller]
  affects: [src/db/schema.ts, src/components/website-card.tsx, src/app/(dashboard)/dashboard/websites/page.tsx]
tech_stack:
  added: [after() from next/server]
  patterns: [background-after-response, index-based-merge, tdd-red-green]
key_files:
  created:
    - src/lib/sync-utils.ts
    - src/lib/sync-utils.test.ts
    - src/app/api/sync/trigger/route.ts
    - src/app/(dashboard)/dashboard/websites/websites-poller.tsx
  modified:
    - src/db/schema.ts
    - src/components/website-card.tsx
    - src/app/(dashboard)/dashboard/websites/page.tsx
    - drizzle/0000_jittery_strong_guy.sql
decisions:
  - mergeAiSectionsIntoAst uses index-based merge (not id-based) — AI does not know existing section IDs
  - after() from next/server for background AI — not @vercel/functions waitUntil
  - syncStatus='syncing' set before after() returns — client sees immediate state transition
  - each website in after() wrapped in individual try/catch — one failure does not block others
  - db:push has upstream bug with CHECK constraints; columns applied via direct SQL ALTER TABLE
  - SyncBadge returns null for 'idle' syncStatus — no badge shown for websites never synced
  - WebsitesPoller wraps only the grid, not empty state — no point polling with no websites
metrics:
  duration: "6m 13s"
  completed: "2026-03-18"
  tasks_completed: 3
  files_modified: 7
---

# Phase 5 Plan 01: Note Sync API + Dashboard Polling Summary

**One-liner:** POST /api/sync/trigger with background AI regeneration via after(), index-based section merge preserving manual_overrides, and 30s dashboard polling via WebsitesPoller.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Schema migration + sync merge utility (TDD) | a4e8124 | schema.ts, sync-utils.ts, sync-utils.test.ts, drizzle/ |
| 2 | POST /api/sync/trigger with background AI via after() | 668f8d8 | src/app/api/sync/trigger/route.ts |
| 3 | SyncBadge on WebsiteCard + WebsitesPoller 30s polling | 3867863 | website-card.tsx, websites-poller.tsx, page.tsx |

## What Was Built

### Schema Changes (Task 1)
- `syncStatus` (text, default 'idle') and `lastSyncedAt` (timestamp, nullable) columns added to `websites` table
- Applied via direct SQL `ALTER TABLE` (drizzle-kit push has upstream bug with CHECK constraints in existing schema)
- Drizzle migration file generated and committed for reference

### Merge Utility (Task 1 - TDD)
- `mergeAiSectionsIntoAst(existing, newAst)` in `src/lib/sync-utils.ts` — pure function, index-based merge
- AI sections replace `ai_content` at each index; `id`, `type`, `manual_overrides` always preserved from existing
- Handles edge cases: fewer AI sections (keep extras), more AI sections (ignore extras), empty sections (keep all)
- 5 unit tests, all passing

### Sync Trigger API (Task 2)
- `POST /api/sync/trigger` accepts `{ noteId, noteContent }` body
- Auth via `auth.api.getSession` — returns 401 if no session
- Queries all websites where `sourceNoteId = noteId AND userId = session.user.id`
- Marks all targets `syncStatus = 'syncing'` immediately, then returns `{ ok: true, updatedCount }`
- `after()` callback runs AI regeneration per website: generates new AST, merges by index, saves with `syncStatus = 'synced'` and `lastSyncedAt`
- On error per website: sets `syncStatus = 'sync_failed'` — isolated failure handling

### Dashboard UI (Task 3)
- `SyncBadge` component at module scope in `website-card.tsx` — shows blue (syncing, animate-pulse), red (sync_failed), green with timestamp (synced)
- Returns null for 'idle' or null syncStatus — no visual noise for unsynced websites
- `WebsitesPoller` client component in `websites-poller.tsx` — `setInterval(30_000)` calling `router.refresh()`
- Grid wrapped in `WebsitesPoller` in `page.tsx`; empty state is not wrapped

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TypeScript cast error in test file**
- **Found during:** Task 1 typecheck
- **Issue:** `as Record<string, unknown>` on `SectionContent` union type caused TS2352 error — `CtaContent` has no index signature
- **Fix:** Changed to helper function `asRecord(v: unknown)` using double-cast `as unknown as Record<string, unknown>` (same pattern as editor-utils.test.ts)
- **Files modified:** src/lib/sync-utils.test.ts
- **Commit:** a4e8124

### Out-of-scope issues noted

- `npm run build` fails with `supabaseKey is required` in `/api/upload/image` route — pre-existing issue requiring `SUPABASE_SERVICE_ROLE_KEY` env var in build environment. Not caused by this plan.

## Verification Results

- `npm run test -- src/lib/sync-utils.test.ts` — 5/5 tests pass
- `npm run typecheck` — clean (0 errors)
- `npm run build` — fails on pre-existing `/api/upload/image` env var issue (not introduced by this plan)

## Self-Check: PASSED

Files verified:
- src/lib/sync-utils.ts — FOUND
- src/lib/sync-utils.test.ts — FOUND
- src/app/api/sync/trigger/route.ts — FOUND
- src/app/(dashboard)/dashboard/websites/websites-poller.tsx — FOUND
- src/components/website-card.tsx — MODIFIED (SyncBadge added)
- src/db/schema.ts — MODIFIED (syncStatus + lastSyncedAt)

Commits verified:
- c66522e test(05-01) — FOUND
- a4e8124 feat(05-01) schema + sync-utils — FOUND
- 668f8d8 feat(05-01) trigger route — FOUND
- 3867863 feat(05-01) SyncBadge + WebsitesPoller — FOUND
