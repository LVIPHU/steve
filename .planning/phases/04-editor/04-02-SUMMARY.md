---
phase: 04-editor
plan: 02
subsystem: editor-ui
tags: [editor, dnd-kit, preview, sidebar, react, next.js]
dependency_graph:
  requires:
    - 04-01 (editor-utils, dnd-kit deps, shadcn components)
  provides:
    - /dashboard/websites/[id]/edit full editor page
    - EditorClient state management (ast, selectedSectionId, previewMode, unsaved guard)
    - EditorTopbar with back/save/responsive toggle
    - EditorPreview with click-to-select ring highlight + responsive width
    - EditorSidebar with Sections/Theme tabs
    - SectionsTab with dnd-kit sortable drag-and-drop
    - SectionEditForm per-type dynamic form fields
  affects:
    - 04-03 (theme tab, image upload, regenerate — wires into editor-client and editor-sidebar)
tech_stack:
  added: []
  patterns:
    - Single state owner EditorClient passes props + callbacks to all children
    - Module-scope components (never inline) per rerender-no-inline-components rule
    - dnd-kit handle-only drag (GripVertical listeners, not whole row)
    - resolveField merges manual_overrides over ai_content for controlled inputs
    - CSS variables on preview container for theme (--primary-color, --font-family)
key_files:
  created:
    - src/app/(dashboard)/dashboard/websites/[id]/edit/page.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/editor-topbar.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/editor-preview.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/editor-sidebar.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/sections-tab.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/section-list-item.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/section-edit-form.tsx
  modified:
    - src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx (wired EditorSidebar in Task 2)
decisions:
  - "templateId column is nullable in schema — defaulted to 'blog' when null to satisfy EditorClient prop type"
  - "window.confirm used for unsaved changes guard on back button — shadcn Dialog deferred to 04-03 (out of scope for this plan)"
  - "SortableSectionItem and SectionEditForm defined at module scope per rerender-no-inline-components rule — prevents input focus loss"
  - "handle-only drag: listeners applied only to GripVertical button, not the whole row — prevents accidental drag on click"
metrics:
  duration: "3m 46s"
  completed_date: "2026-03-18"
  tasks_completed: 2
  tasks_total: 2
  files_created: 8
  files_modified: 1
---

# Phase 4 Plan 02: Editor UI Summary

**One-liner:** Two-column editor page at /dashboard/websites/[id]/edit with live section preview (ring-2 ring-primary click-to-select), dnd-kit drag-and-drop section reordering, per-type dynamic edit forms using resolveField, responsive Desktop/Tablet/Mobile preview toggle, and PATCH save button.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Editor page Server Component + EditorClient shell + Topbar + Preview | fff4a67 | page.tsx, editor-client.tsx, editor-topbar.tsx, editor-preview.tsx |
| 2 | Sidebar with Sections tab — dnd-kit sortable list + section edit forms | 7c1779e | editor-sidebar.tsx, sections-tab.tsx, section-list-item.tsx, section-edit-form.tsx, editor-client.tsx |

## What Was Built

### Editor Page (page.tsx)

Server Component following the exact pattern of the existing `[id]/page.tsx`: auth check → DB fetch with ownership check → `notFound()` if missing → redirect to `/dashboard/websites/[id]` if no content → serialize AST via `JSON.parse(JSON.stringify(...))` → render `<EditorClient>`. No DashboardNav — editor uses its own topbar.

### EditorClient (editor-client.tsx)

Single state owner for the entire editor. State: `ast`, `selectedSectionId`, `hasUnsavedChanges`, `activeTab`, `previewMode`, `isSaving`. Callbacks with `useCallback`: `handleUpdateSection` (calls `applyManualOverride`), `handleReorderSections` (replaces ast.sections), `handleSelectSection` (sets id + switches to sections tab), `handleSave` (PATCH `/api/websites/[id]` with full AST), `handleBack` (window.confirm guard if unsaved). `window.onbeforeunload` effect for browser refresh guard.

### EditorTopbar (editor-topbar.tsx)

48px fixed height bar. Left: ghost Button with ArrowLeft + "Quay lai". Center: website name + `*` when unsaved. Right: responsive toggle (Monitor/Tablet/Smartphone buttons with aria-labels, active gets `bg-accent`), Save button (disabled when no changes, shows Loader2 spinner during save, shows "● Luu" when dirty).

### EditorPreview (editor-preview.tsx)

Responsive container with `transition-all duration-200` and `max-w-[768px]` / `max-w-[390px]` for tablet/mobile modes. CSS variables `--primary-color` and `--font-family` set inline. Each section wrapped in a clickable div with `ring-2 ring-primary` when selected and `hover:ring-1 hover:ring-border` when hovered. Renders `SectionRenderer` directly (not `TemplateRenderer`) to allow per-section click targets.

### EditorSidebar (editor-sidebar.tsx)

Wraps shadcn `Tabs` component with "Sections" and "Theme" triggers. SectionsTab rendered for sections, placeholder div for theme (implemented in Plan 03).

### SectionsTab (sections-tab.tsx)

`DndContext` + `SortableContext` with `verticalListSortingStrategy`. `handleDragStart` sets `activeId`. `handleDragEnd` calls `reorderSections` from editor-utils (wraps dnd-kit `arrayMove`). `DragOverlay` renders a ghost with section type label. Selected section's `SectionEditForm` renders below the list after a `Separator`.

### SortableSectionItem (section-list-item.tsx)

`useSortable({ id: section.id })` with CSS.Transform style. Drag handle: `<button {...listeners} {...attributes} aria-label="Keo de sap xep">`. Section type Badge (secondary variant). Click area with `resolveField` to show title/headline/type as display name. `bg-accent text-accent-foreground` on selected row.

### SectionEditForm (section-edit-form.tsx)

Dynamic form by section type. Hero: headline, subtext (textarea), ctaText, ctaUrl. About: title, body (textarea). Features: title + per-item (icon, label, description) in bordered cards. Content: title, body (textarea). Gallery: title + per-image caption. CTA: title, body (textarea), buttonText, buttonUrl. All inputs controlled via `resolveField` (manual_overrides wins over ai_content). Array field updates compute new full array then call `onUpdateField`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Nullable templateId column**
- **Found during:** Task 1 typecheck
- **Issue:** `websites.templateId` is `text("template_id")` without `.notNull()` — inferred type is `string | null`. EditorClient prop expects `string`.
- **Fix:** Added `?? "blog"` fallback in page.tsx: `templateId={website.templateId ?? "blog"}`
- **Files modified:** src/app/(dashboard)/dashboard/websites/[id]/edit/page.tsx
- **Commit:** fff4a67 (fixed before commit)

## Verification Results

- `npm run typecheck` — clean (0 errors)
- `npm run test` — 58 tests pass (5 test files, 429ms)
- All 8 editor files created in correct paths
- EditorClient wires EditorSidebar (no "Sidebar placeholder" in final version)

## Self-Check: PASSED
