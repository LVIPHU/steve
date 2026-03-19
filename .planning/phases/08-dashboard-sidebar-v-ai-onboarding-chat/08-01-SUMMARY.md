---
phase: 08-dashboard-sidebar-v-ai-onboarding-chat
plan: 01
subsystem: database
tags: [drizzle, postgres, schema, cleanup, typescript]

# Dependency graph
requires:
  - phase: 07-html-first-ai-generation-and-lovable-style-editor
    provides: htmlContent column, HtmlEditorClient, html-prompts.ts — the HTML-first system this plan builds on top of
provides:
  - Clean websites table with chatHistory JSONB column, no legacy AST columns
  - PATCH /api/websites/[id] with chat_history field support
  - Codebase purged of all old AST/template/sync system files
affects:
  - 08-02-dashboard-sidebar (uses clean schema)
  - 08-03-dashboard-ai-onboarding-chat (uses chatHistory column)
  - 08-04-onboarding-chat-streaming (uses chatHistory column)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Direct SQL ALTER TABLE via db.execute(sql`...`) — avoids drizzle-kit push bug with CHECK constraints (same as Plans 05-01 and 07-01)

key-files:
  created:
    - scripts/migrate-08.ts
  modified:
    - src/db/schema.ts
    - src/app/api/websites/[id]/route.ts
    - src/app/(dashboard)/dashboard/page.tsx
    - src/app/(dashboard)/dashboard/websites/page.tsx

key-decisions:
  - "chatHistory JSONB column accepts null for clearing on publish (PATCH validates array or null)"
  - "Old AST editor components deleted entirely — HtmlEditorClient in editor-client.tsx is the replacement (from Plan 07-04)"
  - "websites/[id]/page.tsx deleted — old detail page referenced TEMPLATES and WebsiteAST; Phase 8 will provide new implementation"
  - "editor-utils.ts and sync-utils.ts deleted — both only served the old WebsiteAST type system"
  - "All 5 test files for deleted modules deleted — slugify.test.ts and html-prompts.test.ts remain (20 tests pass)"
  - "Link /websites/new changed to /dashboard — creation now via dashboard AI chat per Phase 8 design"

patterns-established:
  - "Migration script pattern: scripts/migrate-NN.ts runs direct SQL via db.execute(sql`...`)"

requirements-completed: [P8-10, P8-11, P8-12, P8-07]

# Metrics
duration: 7min
completed: 2026-03-19
---

# Phase 8 Plan 01: Schema Cleanup + Codebase Deletion Summary

**DB schema purged of 5 legacy AST columns, chatHistory JSONB added, 48+ old AST/template/sync files deleted, typecheck and 20 tests pass clean.**

## Performance

- **Duration:** 6m 53s
- **Started:** 2026-03-19T11:31:45Z
- **Completed:** 2026-03-19T11:38:38Z
- **Tasks:** 2/2
- **Files modified:** 50+ (48 deletions + 4 modifications)

## Accomplishments

- websites table cleaned: removed templateId, content, seoMeta, syncStatus, lastSyncedAt; added chatHistory JSONB
- PATCH /api/websites/[id] updated: removed old content/seoMeta handler, added chat_history handler (accepts array or null)
- 48 old AST/template/sync files deleted including 12 section components, 6 layout components, 7 old editor sidebar components, templates.ts, ast-utils.ts, ai-prompts.ts, sync-utils.ts, editor-utils.ts, website-ast.ts
- TypeScript typecheck passes with zero errors; all 20 remaining tests pass (slugify + html-prompts)

## Task Commits

Each task was committed atomically:

1. **Task 1: Schema cleanup + PATCH API update + chat_history support** - `e9bd29e` (feat)
2. **Task 2: Delete old AST/template files + fix all references + typecheck** - `5c8d727` (feat)

## Files Created/Modified

- `src/db/schema.ts` - Removed 5 legacy columns, added chatHistory JSONB
- `src/app/api/websites/[id]/route.ts` - Removed content/seoMeta handler, added chat_history handler
- `src/app/(dashboard)/dashboard/page.tsx` - Removed DashboardNav import and usage
- `src/app/(dashboard)/dashboard/websites/page.tsx` - Removed DashboardNav, changed /websites/new links to /dashboard
- `scripts/migrate-08.ts` - One-time SQL migration script

**Deleted (key deletions):**
- `src/types/website-ast.ts`
- `src/lib/templates.ts`, `ast-utils.ts`, `ai-prompts.ts`, `editor-utils.ts`, `sync-utils.ts`
- `src/components/sections/` (12 files)
- `src/components/layouts/` (6 files)
- `src/app/(dashboard)/dashboard/websites/new/` (action.ts + page.tsx)
- `src/app/(dashboard)/dashboard/dashboard-nav.tsx`
- `src/app/(dashboard)/dashboard/websites/[id]/edit/components/` (7 old AST editor components)
- `src/app/(dashboard)/dashboard/websites/[id]/page.tsx` + `website-detail-client.tsx`
- `src/app/api/ai/generate/route.ts`, `api/ai/regenerate-section/route.ts`, `api/sync/trigger/route.ts`
- 5 test files for deleted modules

## Decisions Made

- chatHistory accepts null (not just array) — needed for clearing history on publish
- Old AST editor `components/` subdirectory deleted rather than fixed — all 7 components only served the WebsiteAST system, HtmlEditorClient is the Phase 7 replacement
- `editor-utils.ts` and `sync-utils.ts` deleted — both entirely typed around WebsiteAST; no Phase 8 consumer
- `websites/[id]/page.tsx` deleted — referenced TEMPLATES and WebsiteDetailClient; new detail page will be built in Phase 8
- `tests/templates.test.ts` (in project root tests/) also deleted — separate file from `src/lib/templates.test.ts`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Deleted additional files not in plan's explicit delete list**
- **Found during:** Task 2 (typecheck after deletions)
- **Issue:** Plan listed specific files but did not mention `website-detail-client.tsx`, `websites/[id]/page.tsx`, `edit/components/` (7 files), `editor-utils.ts`, `sync-utils.ts`, and test files `ai-prompts.test.ts`, `ast-utils.test.ts`, `editor-utils.test.ts`, `sync-utils.test.ts` which all imported from deleted modules
- **Fix:** Deleted all 14 additional files that imported deleted modules; these were all legacy AST-system files with no Phase 8 consumers
- **Files modified:** 14 additional file deletions
- **Verification:** npm run typecheck exits 0 after all deletions
- **Committed in:** 5c8d727 (Task 2 commit)

**2. [Rule 3 - Blocking] Found tests/templates.test.ts at project root (separate from src/lib/)**
- **Found during:** Task 2 (typecheck after src/lib/templates.test.ts deletion)
- **Issue:** Project has two test directories: `tests/` (root) and `src/lib/` — templates.test.ts existed in both
- **Fix:** Deleted `tests/templates.test.ts`
- **Files modified:** tests/templates.test.ts
- **Verification:** npm run typecheck exits 0
- **Committed in:** 5c8d727 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking)
**Impact on plan:** Both auto-fixes necessary for typecheck to pass. All deleted files were confirmed legacy-AST-only with no Phase 8 consumers. No scope creep.

## Issues Encountered

None beyond the blocking deviations documented above.

## User Setup Required

None - no external service configuration required. The DB migration script (`scripts/migrate-08.ts`) runs automatically and is tracked in the commit.

## Next Phase Readiness

- Clean schema ready for Phase 8 sidebar (Plan 08-02)
- chatHistory column ready for AI onboarding chat (Plans 08-03, 08-04)
- No old AST/template references remain in codebase — clean foundation
- Note: websites/[id] detail page is currently deleted; Phase 8 will provide new implementation

---
*Phase: 08-dashboard-sidebar-v-ai-onboarding-chat*
*Completed: 2026-03-19*
