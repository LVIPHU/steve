---
phase: 06
plan: 03
subsystem: editor
tags: [editor, sections, interactive, ai-generation]
dependency_graph:
  requires: [06-01]
  provides: [section-edit-forms-all-11-types, add-section-flow]
  affects: [editor-client, editor-sidebar, sections-tab, section-edit-form]
tech_stack:
  added: []
  patterns: [dialog-picker, motion-skeleton-loading, prop-threading]
key_files:
  created: []
  modified:
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/section-edit-form.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/sections-tab.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/editor-sidebar.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx
decisions:
  - Edit forms for list-based sections (steps/ingredients/goals/flashcard/quiz) use inline add-item buttons that append empty items to the array via onUpdateField — no separate API call needed
  - handleAddSection reuses /api/ai/regenerate-section endpoint (passes a synthetic sectionId, server does not use it for new section creation)
  - onAddSection prop threaded through EditorClient -> EditorSidebar -> SectionsTab to keep handleAddSection logic centralized in EditorClient
  - Quiz correctIndex select uses standard HTML select element with tailwind styling matching Input class — avoids introducing a new shadcn component
metrics:
  duration: 3m 34s
  completed: "2026-03-19"
  tasks: 2/2
  files: 4
---

# Phase 6 Plan 03: Editor Section Forms + Add Section Flow Summary

Extended the editor sidebar to support all 11 section types with type-specific edit forms and added the "Them section" Dialog flow with AI generation for adding new sections per-template.

## Tasks Completed

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Add edit forms for 5 new section types in SectionEditForm | 9485c10 |
| 2 | Add "Them section" flow to SectionsTab + wire in EditorClient | ce94933 |

## What Was Built

### Task 1: SectionEditForm — 5 new section type forms

Added `if` blocks for `steps`, `ingredients`, `goals`, `flashcard`, and `quiz` section types following the exact pattern of existing types (FieldGroup + Input/textarea + per-item card + add-item button + RegenerateSection at bottom).

- **steps**: title Input + mapped items with label/description/ImageUploadField, "Them buoc" add button
- **ingredients**: title Input + mapped items with name/quantity Inputs, "Them nguyen lieu" add button
- **goals**: title Input + mapped items with label Inputs using FieldGroup label, "Them muc tieu" add button
- **flashcard**: title Input + mapped cards with front/back Inputs in bordered cards, "Them the" add button
- **quiz**: title Input + mapped questions with question/4 choices/correctIndex (HTML select), "Them cau hoi" add button

Imported `StepsContent`, `IngredientsContent`, `GoalsContent`, `FlashcardContent`, `QuizContent` from `@/types/website-ast`.

### Task 2: SectionsTab + EditorSidebar + EditorClient wiring

**SectionsTab** additions:
- `onAddSection: (sectionType: SectionType) => Promise<void>` prop
- `showAddDialog` / `addingType` state
- `handleAddSection()` — sets `addingType`, closes dialog, calls `onAddSection`, clears `addingType` in finally
- motion skeleton row showing "Dang tao noi dung..." during AI generation
- "Them section" button (disabled when `addingType !== null`)
- Dialog with `DialogTitle` "Them section moi", grid of buttons for each `TEMPLATE_ALLOWED_SECTIONS[templateId]` type

**EditorSidebar**: Added `onAddSection` to interface and threaded through to `SectionsTab`.

**EditorClient**: Added `handleAddSection` callback:
1. POST to `/api/ai/regenerate-section` with `websiteId`, synthetic `sectionId`, `sectionType`, `templateId`
2. On success: create `Section` object with `id: ${sectionType}-${Date.now()}`, `ai_content` from response
3. Append to `ast.sections`, set `hasUnsavedChanges = true`
4. On error: `toast.error("Khong the tao section. Hay thu lai.")`

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

All key files exist. Both task commits verified (9485c10, ce94933). TypeScript typecheck clean. All 80 tests pass.
