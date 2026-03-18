---
phase: 04-editor
plan: "03"
subsystem: ui
tags: [react, nextjs, google-fonts, image-upload, sonner, tailwind]

# Dependency graph
requires:
  - phase: 04-01
    provides: editor-utils, upload API, regenerate-section API, shadcn components
  - phase: 04-02
    provides: EditorClient, EditorSidebar, SectionsTab, SectionEditForm components
provides:
  - ThemeTab with native color picker and Google Fonts selector
  - Image upload integration in SectionEditForm (gallery + hero)
  - Per-section regenerate UI with optional prompt refinement
  - Unsaved changes dialog (shadcn Dialog replacing window.confirm)
  - Toast notifications (sonner) for save success/failure
  - Edit Website button on detail page
  - Google Font loading + CSS variables on public page
affects: [05-sync]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - injectGoogleFont: dynamic <link> injection into document.head for preview font loading
    - CSS variable injection on public page for theme propagation to layout components

key-files:
  created:
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/theme-tab.tsx
  modified:
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/section-edit-form.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/editor-sidebar.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/sections-tab.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/website-detail-client.tsx
    - src/app/(public)/[username]/[slug]/page.tsx
    - src/app/layout.tsx

key-decisions:
  - "injectGoogleFont creates a <link> in document.head during editor preview — no SSR needed for editor font preview"
  - "ImageUploadField is a module-scope sub-component to avoid focus loss and re-render instability"
  - "RegenerateSection sub-component manages its own regenPrompt and isRegenerating state — decoupled from parent form"
  - "Public page uses inline <link rel=stylesheet> for Google Font instead of Next.js metadata API — simpler for dynamic per-website fonts"
  - "CSS variables --primary-color and --font-family injected at public page wrapper div level"

patterns-established:
  - "Sub-components at module scope (ImageUploadField, RegenerateSection) to prevent focus loss on re-render"
  - "Props threaded through EditorClient -> EditorSidebar -> SectionsTab -> SectionEditForm"

requirements-completed: [F-13, S-01, S-02, S-05]

# Metrics
duration: 4min
completed: 2026-03-18
---

# Phase 4 Plan 03: Editor Theme, Image Upload, Regenerate, Polish Summary

**Full editor completion: ThemeTab with Google Fonts, image upload in section forms, per-section regenerate with prompt, toast/dialog notifications, and public page font injection**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-18T11:17:50Z
- **Completed:** 2026-03-18T11:22:30Z
- **Tasks:** 2/2 auto tasks complete (Task 3 is human-verify checkpoint)
- **Files modified:** 8

## Accomplishments

- ThemeTab component with native color picker and searchable Google Fonts list (20 fonts, client-side injection)
- SectionEditForm updated with ImageUploadField (calls /api/upload/image) and RegenerateSection (calls /api/ai/regenerate-section) on all 6 section types
- EditorClient upgraded: handleUpdateTheme, handleRegenerateSection callbacks added; window.confirm replaced with shadcn Dialog; alert() replaced with sonner toast
- Toaster added to root layout.tsx; public page loads Google Font and injects CSS variables

## Task Commits

Each task was committed atomically:

1. **Task 1: Theme tab + image upload + per-section regenerate UI** - `dc1c990` (feat)
2. **Task 2: Toast + unsaved dialog + edit button + public font loading** - `0aae20d` (feat)

**Plan metadata:** pending final docs commit

## Files Created/Modified

- `src/app/(dashboard)/dashboard/websites/[id]/edit/components/theme-tab.tsx` - Created: color picker + searchable Google Fonts selector with injectGoogleFont helper
- `src/app/(dashboard)/dashboard/websites/[id]/edit/components/section-edit-form.tsx` - Added ImageUploadField, RegenerateSection sub-components; new props onRegenerateSection, websiteId, templateId
- `src/app/(dashboard)/dashboard/websites/[id]/edit/components/editor-sidebar.tsx` - Wired ThemeTab into theme TabsContent; added onUpdateTheme, onRegenerateSection, websiteId, templateId to props
- `src/app/(dashboard)/dashboard/websites/[id]/edit/components/sections-tab.tsx` - Added onRegenerateSection, websiteId, templateId props; passed to SectionEditForm
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` - Added handleUpdateTheme, handleRegenerateSection; replaced window.confirm with Dialog; replaced alert() with toast
- `src/app/(dashboard)/dashboard/websites/[id]/website-detail-client.tsx` - Added Chinh sua website Link button (visible when content exists)
- `src/app/(public)/[username]/[slug]/page.tsx` - Added Google Fonts link + CSS variable div wrapper
- `src/app/layout.tsx` - Added Toaster from @/components/ui/sonner

## Decisions Made

- `injectGoogleFont` creates a `<link>` in `document.head` during editor — avoids SSR for editor preview fonts
- `ImageUploadField` and `RegenerateSection` defined at module scope to prevent focus loss on re-render (same pattern as SortableSectionItem in 04-02)
- Public page uses inline `<link rel="stylesheet">` instead of metadata API — dynamic per-website URLs work naturally in JSX
- CSS variables set at wrapper `<div>` level; layout components can consume them via CSS

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added sections-tab.tsx to prop threading chain**
- **Found during:** Task 1
- **Issue:** Plan specified props should go EditorSidebar -> SectionEditForm but SectionsTab is an intermediate component not mentioned in prop threading
- **Fix:** Updated SectionsTab interface to accept and pass onRegenerateSection, websiteId, templateId
- **Files modified:** sections-tab.tsx
- **Committed in:** dc1c990 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary intermediate prop threading. No scope creep.

## Issues Encountered

None — all tasks executed cleanly. TypeScript typecheck and 58 tests pass.

## Next Phase Readiness

- Phase 4 editor fully complete — all 7 requirements (F-12, F-13, F-14, F-15, S-01, S-02, S-05) implemented
- Phase 5 (Note sync API + Umami analytics) can begin
- Human visual verification checkpoint (Task 3) pending user review

---
*Phase: 04-editor*
*Completed: 2026-03-18*
