---
phase: 02-website-crud-templates
verified: 2026-03-17T19:38:00Z
status: passed
score: 18/18 must-haves verified
re_verification: false
human_verification:
  - test: "Create website form — tab switching and template selection UX"
    expected: "Note/Prompt tabs switch correctly; selected template shows ring-2 ring-primary highlight; suggestion banner animates in on Note ID blur with matching keyword"
    why_human: "Visual/interactive behavior requiring browser rendering to confirm"
  - test: "WebsiteCard hover interactions"
    expected: "Three-dot menu appears on hover; dropdown opens; rename input focuses in place; delete confirm panel renders inline below card"
    why_human: "Hover states and animation require manual browser testing"
  - test: "Rename flow end-to-end"
    expected: "Pressing Enter saves new name and card refreshes showing updated name; pressing Esc restores original name"
    why_human: "Requires running app with real DB to confirm router.refresh() triggers Server Component re-fetch"
  - test: "Status change sub-menu UX"
    expected: "Hovering 'Doi trang thai' reveals sub-menu with Draft/Published/Archived options; selecting one calls PATCH and updates status badge"
    why_human: "onMouseEnter/Leave interaction requires manual testing"
---

# Phase 02: Website CRUD + Templates Verification Report

**Phase Goal:** User co the tao, xem danh sach, doi ten, xoa website. Template system hoat dong.
**Verified:** 2026-03-17T19:38:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths — All Plans Combined

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | TEMPLATES constant contains exactly 5 entries: blog, portfolio, fitness, cooking, learning | VERIFIED | `src/lib/templates.ts` lines 1-7: `as const` array with exactly 5 entries; test confirms `toHaveLength(5)` |
| 2 | suggestTemplate returns correct templateId for known keywords, null for unknown | VERIFIED | `src/lib/templates.ts` lines 34-41; 7 tests covering all template IDs + null cases; all 17 tests pass |
| 3 | generateSlug produces valid kebab-case slugs from Vietnamese and English input | VERIFIED | `src/lib/slugify.ts` lines 1-11; 6 tests pass including empty string fallback and 60-char limit |
| 4 | PATCH /api/websites/[id] updates name or status with ownership check | VERIFIED | `src/app/api/websites/[id]/route.ts` lines 9-70; auth check, field validation, ownership query, `db.update(websites)` |
| 5 | DELETE /api/websites/[id] removes website with ownership check | VERIFIED | `src/app/api/websites/[id]/route.ts` lines 72-97; auth check, ownership query, `db.delete(websites)` |
| 6 | All vitest tests pass | VERIFIED | `npx vitest run` — 17 tests, 2 files, all green |
| 7 | User can navigate to /dashboard/websites/new from dashboard nav | VERIFIED | `dashboard-nav.tsx` line 27: `href="/dashboard/websites"` Websites link present |
| 8 | User can enter website name, select template, and submit form | VERIFIED | `new/page.tsx` lines 83-303: name Input, template radiogroup, handleSubmit calls createWebsite |
| 9 | After Note ID blur, template suggestion banner may appear | VERIFIED | `new/page.tsx` lines 96-103: `handleNoteIdBlur` calls `suggestTemplate(noteId)`, shows SuggestionBanner via AnimatePresence |
| 10 | Submitting form creates draft website in DB and redirects to /dashboard/websites/[id] | VERIFIED | `new/action.ts` lines 27-43: `db.insert(websites).values(...)`, `redirect()` outside try/catch |
| 11 | Detail page at /dashboard/websites/[id] shows website info + disabled Generate button | VERIFIED | `websites/[id]/page.tsx` lines 38-117: Server Component, ownership check, template lookup, StatusBadge, `disabled` Button |
| 12 | /dashboard/websites shows all user websites in a card grid (2 cols mobile, 3 cols md+) | VERIFIED | `websites/page.tsx` line 45: `grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6` |
| 13 | Empty state shows emoji, message, and create button when user has no websites | VERIFIED | `websites/page.tsx` lines 33-43: `Ban chua co website nao`, globe emoji, CTA Button |
| 14 | Hover on card reveals three-dot menu button | VERIFIED | `website-card.tsx` line 125: `opacity-0 group-hover:opacity-100 transition-opacity` |
| 15 | Menu contains Rename, Status change (sub-menu), and Delete options | VERIFIED | `website-card.tsx` lines 146-232: `Doi ten`, `Doi trang thai` with sub-menu, `Xoa` |
| 16 | Rename uses inline edit: card title becomes Input, Enter saves, Esc cancels | VERIFIED | `website-card.tsx` lines 84-91: `handleRenameKeyDown` with Enter/Escape; autoFocus Input in card header |
| 17 | Delete shows inline confirm panel with Xac nhan / Huy buttons | VERIFIED | `website-card.tsx` lines 266-301: `bg-destructive/5`, "Xoa website nay?", Huy + Xoa buttons |
| 18 | Status change calls PATCH API and refreshes list | VERIFIED | `website-card.tsx` lines 102-111: `handleStatusChange` fetches PATCH then `router.refresh()` |

**Score:** 18/18 truths verified

---

## Required Artifacts

| Artifact | Plan | Status | Details |
|----------|------|--------|---------|
| `src/lib/templates.ts` | 02-01 | VERIFIED | 42 lines; exports TEMPLATES (5 entries), TemplateId, KEYWORD_MAP, suggestTemplate |
| `src/lib/slugify.ts` | 02-01 | VERIFIED | 11 lines; exports generateSlug |
| `src/app/api/websites/[id]/route.ts` | 02-01 | VERIFIED | 97 lines; exports PATCH and DELETE handlers |
| `vitest.config.ts` | 02-01 | VERIFIED | 14 lines; globals, node env, `@` path alias |
| `tests/templates.test.ts` | 02-01 | VERIFIED | 65 lines; 10 test cases covering TEMPLATES, KEYWORD_MAP, suggestTemplate |
| `tests/slugify.test.ts` | 02-01 | VERIFIED | 29 lines; 6 test cases |
| `src/app/(dashboard)/dashboard/websites/new/page.tsx` | 02-02 | VERIFIED | 303 lines; "use client", tabs, radiogroup, suggestion banner, loading state |
| `src/app/(dashboard)/dashboard/websites/new/action.ts` | 02-02 | VERIFIED | 43 lines; "use server", db.insert, redirect outside try/catch |
| `src/app/(dashboard)/dashboard/websites/[id]/page.tsx` | 02-02 | VERIFIED | 117 lines; Server Component, auth + ownership, TEMPLATES.find, StatusBadge, disabled Generate |
| `src/app/(dashboard)/dashboard/dashboard-nav.tsx` | 02-02 | VERIFIED | Websites link at href="/dashboard/websites" present |
| `src/app/(dashboard)/dashboard/websites/page.tsx` | 02-03 | VERIFIED | 54 lines; Server Component, auth, db.select, grid, empty state |
| `src/components/website-card.tsx` | 02-03 | VERIFIED | 305 lines; "use client", StatusBadge at module level, dropdown, inline rename, confirm delete, stagger animation |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `api/websites/[id]/route.ts` | `src/db/schema.ts` | `db.update(websites)` / `db.delete(websites)` | WIRED | Lines 64-67, 94: actual Drizzle mutations against `websites` table |
| `src/lib/templates.ts` | `src/db/schema.ts` | `TemplateId` type matches `template_id` column | WIRED | `TemplateId` exported and imported in action.ts, page.tsx |
| `new/page.tsx` | `src/lib/templates.ts` | `import TEMPLATES, suggestTemplate` | WIRED | Line 7: `import { TEMPLATES, suggestTemplate, type TemplateId } from "@/lib/templates"` |
| `new/action.ts` | `src/db/schema.ts` | `db.insert(websites)` | WIRED | Lines 27-37: full insert with all columns |
| `new/action.ts` | `src/lib/slugify.ts` | `import generateSlug` | WIRED | Line 6: `import { generateSlug } from "@/lib/slugify"`, used line 24 |
| `websites/[id]/page.tsx` | `src/db/schema.ts` | `db.select().from(websites)` | WIRED | Lines 48-52: select with ownership filter |
| `websites/page.tsx` | `src/db/schema.ts` | `db.select().from(websites).where(eq(websites.userId, ...))` | WIRED | Lines 16-20 |
| `website-card.tsx` | `api/websites/[id]/route.ts` | `fetch('/api/websites/${id}', { method: 'PATCH'/'DELETE' })` | WIRED | Lines 75, 96, 105: three fetch calls; router.refresh() at lines 81, 99, 110 |
| `website-card.tsx` | `next/navigation` | `router.refresh()` after mutations | WIRED | Lines 81, 99, 110 |

---

## Requirements Coverage

| Requirement | Plans | Description | Status | Evidence |
|-------------|-------|-------------|--------|----------|
| F-04 | 02-03 | Trang danh sach tat ca website cua user (`/dashboard/websites`) | SATISFIED | `websites/page.tsx`: Server Component, full DB fetch, 2/3-col grid, empty state |
| F-05 | 02-02 | Tao moi: chon note JSON + template + prompt tuy chon | SATISFIED | `new/page.tsx` + `new/action.ts`: tabbed form (Note/Prompt), 5-template grid, server action creates DB record |
| F-06 | 02-01, 02-03 | Ba trang thai: Draft / Published / Archived | SATISFIED | API route validates `["draft", "published", "archived"]`; StatusBadge shows all 3 with distinct colors; status sub-menu in WebsiteCard |
| F-07 | 02-01, 02-03 | Doi ten, xoa, duplicate | PARTIAL — ACCEPTABLE | Rename: inline edit with Enter/Esc + PATCH API. Delete: confirm panel + DELETE API. **Duplicate deferred** per `02-CONTEXT.md` line 126 and `02-RESEARCH.md` — explicitly noted as out of Phase 2 scope |
| F-08 | 02-01 | 5 template co dinh: blog, portfolio, fitness, cooking, learning | SATISFIED | `src/lib/templates.ts`: TEMPLATES array with exactly 5 entries, `as const`, exported |
| F-09 | 02-01, 02-02 | Goi y template dua tren keyword matching tu note content | SATISFIED | `suggestTemplate` with KEYWORD_MAP; wired to `handleNoteIdBlur` in create form; SuggestionBanner displayed with AnimatePresence |

**Note on F-07 (duplicate):** The REQUIREMENTS.md lists "duplicate" as part of F-07. The phase planning documents (`02-CONTEXT.md`, `02-RESEARCH.md`) explicitly acknowledge this and scope it out of Phase 2. Both plans claiming F-07 (02-01, 02-03) deliver rename and delete. Duplicate is a known deferred item, not a gap introduced by execution error.

---

## Anti-Patterns Scan

No blockers or stub patterns found across all 8 phase files:

- No `TODO`/`FIXME`/`HACK`/`PLACEHOLDER` comments
- No empty implementations (`return null`, `return {}`, `return []`)
- No console-only handlers
- `placeholder=` attributes in form inputs are legitimate HTML — not stub markers
- `return null` in `suggestTemplate` is valid business logic (no match found)
- `redirect()` in action.ts is correctly placed outside the try/catch block

---

## Human Verification Required

### 1. Create website form — tab and template UX

**Test:** Navigate to /dashboard/websites/new. Switch between "Tu Note" and "Tu viet prompt" tabs. Select each template card. Enter a Note ID keyword like "blog" and blur the field.
**Expected:** Tabs toggle correctly. Selected template card shows `ring-2 ring-primary` highlight. After blurring Note ID with keyword "blog", the suggestion banner animates in showing "Goi y dua tren note cua ban: Blog".
**Why human:** Visual CSS states, motion animation, and conditional banner cannot be confirmed without browser rendering.

### 2. WebsiteCard hover interactions

**Test:** On /dashboard/websites (with at least one card), hover over a website card.
**Expected:** Three-dot `MoreVertical` button fades in at top-right. Clicking opens a dropdown menu with "Doi ten", "Doi trang thai", "Xoa" items.
**Why human:** CSS `opacity-0 group-hover:opacity-100` and custom dropdown require real browser to test.

### 3. Rename flow end-to-end

**Test:** Click "Doi ten" in card menu. Edit the name. Press Enter.
**Expected:** Card title becomes an `autoFocus` Input. Pressing Enter calls PATCH `/api/websites/[id]` and the card refreshes showing the new name. Pressing Escape restores original name without saving.
**Why human:** Requires running Next.js server with live database. `router.refresh()` triggers Server Component re-fetch — needs real environment.

### 4. Delete confirm flow

**Test:** Click "Xoa" in card menu. Click "Xoa" in confirm panel.
**Expected:** Confirm panel appears with "Xoa website nay?" text. Clicking "Xoa" calls DELETE API and card disappears. Clicking "Huy" dismisses panel without deleting.
**Why human:** Requires live server and DB to confirm card removal after `router.refresh()`.

### 5. Status sub-menu

**Test:** Hover over "Doi trang thai" in card dropdown.
**Expected:** Sub-menu appears with Draft, Published, Archived buttons. Clicking one updates status badge color (green = Published, gray = Draft, orange = Archived).
**Why human:** `onMouseEnter`/`onMouseLeave` hover sub-menu and badge color update require browser testing.

---

## Summary

Phase 02 goal is fully achieved in code. All 18 observable truths are verified by direct file inspection:

- **Foundation (Plan 01):** Template system, slug utility, and mutation API are substantive and correctly implemented. All 17 unit tests pass. TypeScript compiles clean.
- **Create flow (Plan 02):** Create form has all required UX elements (tabs, ARIA roles, template radio grid, suggestion banner, loading state). Server action correctly inserts to DB and redirects. Detail page performs ownership check and renders all required info.
- **List + CRUD (Plan 03):** List page fetches user websites with correct query. WebsiteCard has hover menu, inline rename, delete confirm, and status sub-menu. All three mutation paths (rename, delete, status) call `router.refresh()` for revalidation.

The only partial item (F-07 duplicate) was explicitly deferred by the planning documents and is not a gap introduced during execution.

Five items require human verification in a running browser with live database — all are interactive/visual behaviors that cannot be confirmed programmatically.

---

_Verified: 2026-03-17T19:38:00Z_
_Verifier: Claude (gsd-verifier)_
