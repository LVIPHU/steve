---
phase: 02-website-crud-templates
plan: 03
subsystem: website-list-ui
tags: [server-component, client-component, crud, card-grid, inline-edit]
dependency_graph:
  requires: [02-01]
  provides: [website-list-page, website-card-crud]
  affects: [dashboard-navigation]
tech_stack:
  added: []
  patterns: [server-component-data-fetch, client-component-mutations, router-refresh-revalidation, click-outside-detection, stagger-animation]
key_files:
  created:
    - src/app/(dashboard)/dashboard/websites/page.tsx
    - src/components/website-card.tsx
  modified: []
decisions:
  - Used custom dropdown (no library) per plan spec — simple enough for 3 menu items
  - Status sub-menu uses onMouseEnter/Leave on both trigger and sub-menu div to prevent flicker
  - Placed menuRef on wrapper div containing both trigger button and dropdown for correct click-outside detection
  - Card body wrapped in Link, interactive elements use e.stopPropagation() + e.preventDefault()
metrics:
  duration: 2m 34s
  completed_date: "2026-03-17"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 0
---

# Phase 02 Plan 03: Website List Page + WebsiteCard CRUD Summary

**One-liner:** Card grid list page (Server Component) with interactive WebsiteCard (Client Component) featuring hover dropdown, inline rename, confirm delete, and status change via PATCH API.

## What Was Built

### Task 1: Website list page (Server Component)
- `src/app/(dashboard)/dashboard/websites/page.tsx` — fetches user websites via Drizzle `db.select().from(websites).where(eq(websites.userId, session.user.id)).orderBy(desc(websites.createdAt))`
- Responsive 2-col / 3-col card grid (`grid-cols-2 md:grid-cols-3`)
- Empty state with globe emoji, Vietnamese copy, and "Tao website moi" CTA button in both header and empty state
- Passes `index` to each WebsiteCard for stagger animation timing

### Task 2: WebsiteCard Client Component
- `src/components/website-card.tsx` — `"use client"` component with full CRUD interactions
- `StatusBadge` defined at module level (not inside WebsiteCard) — green Published, gray Draft, orange Archived
- Hover-reveal three-dot menu button (`opacity-0 group-hover:opacity-100`)
- Custom dropdown (`role="menu"`) with three items: Doi ten, Doi trang thai (with status sub-menu), Xoa
- Click-outside detection via `useRef` + `useEffect` on `mousedown`
- Inline rename: CardTitle replaced by Input with `autoFocus`, Enter saves, Esc cancels
- Delete confirm panel with `bg-destructive/5 border-destructive/20` styling, Huy / Xoa buttons
- Status sub-menu on hover with Draft, Published, Archived options
- All mutations (`PATCH` rename, `PATCH` status, `DELETE`) call `router.refresh()` for Server Component revalidation
- Stagger entrance animation with `delay: index * 0.04`

## Verification

- `npx tsc --noEmit` — 0 errors
- `npx vitest run` — 17/17 tests pass (no regressions)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- [x] `src/app/(dashboard)/dashboard/websites/page.tsx` — exists
- [x] `src/components/website-card.tsx` — exists
- [x] Commit `e8926e8` (Task 1) — exists
- [x] Commit `7df5c72` (Task 2) — exists
