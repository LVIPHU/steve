---
phase: 05-note-sync-analytics
verified: 2026-03-18T16:52:00Z
status: human_needed
score: 9/9 must-haves verified
re_verification: false
human_verification:
  - test: "S-03 in-app notification adequacy — is SyncBadge + polling sufficient?"
    expected: "User sees sync state change on dashboard within 30s of a note sync being triggered"
    why_human: "S-03 says 'thong bao trong app' (in-app notification). Implementation uses passive SyncBadge + 30s polling. Whether this meets the S-03 intent (passive badge vs active toast) requires product judgment."
---

# Phase 05: Note Sync + Analytics Verification Report

**Phase Goal:** Note thay doi trong mobile app → website tu cap nhat content; analytics tracking hoat dong.
**Verified:** 2026-03-18T16:52:00Z
**Status:** HUMAN_NEEDED (all automated checks pass; one requirement interpretation needs product review)
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths — Plan 05-01

| #  | Truth                                                                               | Status     | Evidence                                                                     |
|----|-------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------|
| 1  | POST /api/sync/trigger accepts noteId + noteContent, returns { ok, updatedCount }   | VERIFIED   | route.ts line 96: `Response.json({ ok: true, updatedCount: targets.length })`|
| 2  | AI runs in background via after() — response is not blocked                         | VERIFIED   | route.ts line 1: `import { after } from "next/server"`, line 54: `after(async () => {` |
| 3  | ai_content updated per section by index, manual_overrides never touched             | VERIFIED   | sync-utils.ts: `...section, ai_content: newSection.ai_content` — spreads existing then overwrites only ai_content |
| 4  | syncStatus transitions: idle -> syncing -> synced (or sync_failed)                  | VERIFIED   | route.ts lines 49, 83, 91: sets "syncing" before after(), "synced" on success, "sync_failed" on error |
| 5  | Dashboard website cards show sync badge with timestamp or error                     | VERIFIED   | website-card.tsx lines 14–61: SyncBadge at module scope, all 3 states rendered |
| 6  | Dashboard website list polls every 30 seconds via router.refresh()                  | VERIFIED   | websites-poller.tsx line 10: `setInterval(() => router.refresh(), 30_000)` |

### Observable Truths — Plan 05-02

| #  | Truth                                                                               | Status     | Evidence                                                                     |
|----|-------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------|
| 7  | Published websites include Umami tracking script when env vars are configured       | VERIFIED   | public page.tsx lines 86–92: conditional script tag with defer + data-website-id |
| 8  | Umami script is NOT rendered when NEXT_PUBLIC_UMAMI_URL is missing                  | VERIFIED   | page.tsx line 86: `process.env.NEXT_PUBLIC_UMAMI_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID` — both required |
| 9  | Dashboard pages do NOT include Umami script                                         | VERIFIED   | Script is only in `src/app/(public)/[username]/[slug]/page.tsx` — dashboard pages untouched |

**Score: 9/9 truths verified**

---

## Required Artifacts

### Plan 05-01 Artifacts

| Artifact                                                              | Expected                                     | Status     | Details                                                                 |
|-----------------------------------------------------------------------|----------------------------------------------|------------|-------------------------------------------------------------------------|
| `src/db/schema.ts`                                                    | syncStatus + lastSyncedAt columns            | VERIFIED   | Line 86: `syncStatus: t.text("sync_status").default("idle")`, line 87: `lastSyncedAt: t.timestamp("last_synced_at")` |
| `src/lib/sync-utils.ts`                                               | Exports mergeAiSectionsIntoAst               | VERIFIED   | Line 10: `export function mergeAiSectionsIntoAst(` — pure index-based merge |
| `src/lib/sync-utils.test.ts`                                          | Unit tests for merge logic                   | VERIFIED   | 5 tests, all passing (5/5 confirmed via `npm run test`) |
| `src/app/api/sync/trigger/route.ts`                                   | POST handler for note sync                   | VERIFIED   | Exports POST, full implementation with auth, lookup, mark-syncing, after(), return |
| `src/components/website-card.tsx`                                     | SyncBadge at module scope                    | VERIFIED   | Lines 14–61: `function SyncBadge(` defined before StatusBadge, not inside WebsiteCard |
| `src/app/(dashboard)/dashboard/websites/websites-poller.tsx`          | Client Component with 30s polling            | VERIFIED   | "use client", setInterval with 30_000, router.refresh(), clearInterval on cleanup |

### Plan 05-02 Artifacts

| Artifact                                          | Expected                             | Status     | Details                                                               |
|---------------------------------------------------|--------------------------------------|------------|-----------------------------------------------------------------------|
| `src/app/(public)/[username]/[slug]/page.tsx`     | Conditional Umami script tag         | VERIFIED   | Lines 86–92: both env var guard + script with defer + data-website-id |
| `.env.example`                                    | Umami env var documentation          | VERIFIED   | Lines 23–24: NEXT_PUBLIC_UMAMI_URL and NEXT_PUBLIC_UMAMI_WEBSITE_ID   |

---

## Key Link Verification

### Plan 05-01 Key Links

| From                                     | To                       | Via                              | Status     | Details                                                                  |
|------------------------------------------|--------------------------|----------------------------------|------------|--------------------------------------------------------------------------|
| `src/app/api/sync/trigger/route.ts`      | `src/lib/sync-utils.ts`  | import mergeAiSectionsIntoAst    | WIRED      | Line 9: `import { mergeAiSectionsIntoAst } from "@/lib/sync-utils"`, used line 75 |
| `src/app/api/sync/trigger/route.ts`      | `src/lib/ai-prompts.ts`  | import buildSystemPrompt/UserPrompt | WIRED   | Line 7: `import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai-prompts"`, used lines 63, 65 |
| `src/app/(dashboard)/dashboard/websites/page.tsx` | `websites-poller.tsx` | WebsitesPoller wrapping grid | WIRED  | Line 10: import, lines 46–52: wraps grid div only (not empty state) |
| `src/components/website-card.tsx`        | `src/db/schema.ts`       | Website type includes syncStatus | WIRED      | Line 12: `import type { Website } from "@/db/schema"`, SyncBadge receives website.syncStatus + website.lastSyncedAt |

### Plan 05-02 Key Links

| From                                              | To                              | Via                              | Status     | Details                                                    |
|---------------------------------------------------|---------------------------------|----------------------------------|------------|------------------------------------------------------------|
| `src/app/(public)/[username]/[slug]/page.tsx`     | `process.env.NEXT_PUBLIC_UMAMI_URL` | Conditional script render   | WIRED      | Line 86: env var check gates script tag render              |

---

## Requirements Coverage

| Requirement | Source Plan | Description                                                                 | Status          | Evidence                                                                      |
|-------------|-------------|-----------------------------------------------------------------------------|-----------------|-------------------------------------------------------------------------------|
| F-18        | 05-01       | POST /api/sync/trigger — note update, update ai_content, keep manual_overrides | SATISFIED    | Route exists, mergeAiSectionsIntoAst preserves manual_overrides (verified by 5 tests) |
| F-19        | 05-02       | Umami self-hosted embed in published websites                               | SATISFIED       | Conditional script in public page, guarded by both env vars                   |
| S-03        | 05-01       | In-app notification when note sync occurs ("thong bao trong app")           | NEEDS HUMAN     | SyncBadge + 30s polling provides passive visual feedback. Whether this satisfies "thong bao" (notification) vs active toast requires product judgment. |

### Requirement Orphan Check

REQUIREMENTS.md S-03 maps to Phase 5 and appears in plan 05-01 `requirements` field. No orphaned requirements found for this phase.

---

## Anti-Patterns Found

No anti-patterns detected in modified files:

- No TODO/FIXME/PLACEHOLDER comments in any implementation file
- No stub return values (`return null`, `return {}`, `return []`) outside of intended conditional returns in SyncBadge
- No empty handlers — all wired to real logic
- SyncBadge `return null` on idle/unmatched state is intentional behavior, not a stub

---

## Human Verification Required

### 1. S-03 Notification Adequacy

**Test:** Trigger a note sync from mobile app (or via `POST /api/sync/trigger` with valid session). Wait up to 30 seconds on `/dashboard/websites`.
**Expected:** The SyncBadge on the affected website card updates from idle → "Dang dong bo..." (blue, pulsing) → "Dong bo luc HH:MM" (green) within one 30-second poll cycle.
**Why human:** S-03 requirement says "thong bao trong app khi note sync xay ra" — this could mean an active toast/push notification OR passive status badge. The current implementation uses SyncBadge + 30s polling. A product decision is needed: is this sufficient for S-03, or does it require a toast notification? Automated checks cannot assess product intent.

---

## Commits Verified

All documented commit hashes confirmed in git log:

| Commit    | Message                                                  | Status     |
|-----------|----------------------------------------------------------|------------|
| `c66522e` | test(05-01): add failing tests for mergeAiSectionsIntoAst | FOUND    |
| `a4e8124` | feat(05-01): add syncStatus/lastSyncedAt + mergeAiSectionsIntoAst | FOUND |
| `668f8d8` | feat(05-01): POST /api/sync/trigger with background AI via after() | FOUND |
| `3867863` | feat(05-01): SyncBadge on WebsiteCard + WebsitesPoller 30s auto-refresh | FOUND |
| `f15a1af` | feat(05-02): embed Umami analytics script in public page | FOUND     |

---

## Overall Assessment

Phase 05 goal is **effectively achieved** at the code level:

1. **Note sync path is complete and wired end-to-end:** POST /api/sync/trigger → auth check → find websites by sourceNoteId → mark syncing → background AI via after() → mergeAiSectionsIntoAst (preserves manual_overrides) → update syncStatus. Tests confirm merge logic correctness.

2. **Dashboard feedback loop is complete:** SyncBadge shows 3 sync states with correct colors/copy. WebsitesPoller refreshes grid every 30s. Only the grid is wrapped (not empty state).

3. **Analytics tracking is complete:** Umami script conditionally rendered in public pages only. Requires both env vars to render — safe default when unconfigured.

4. **The only open item is a product interpretation question on S-03:** the implementation provides passive sync status visibility (badge + polling), which is a valid reading of "thong bao." An active toast notification would be a stricter reading. This does not block the phase goal.

---

_Verified: 2026-03-18T16:52:00Z_
_Verifier: Claude (gsd-verifier)_
