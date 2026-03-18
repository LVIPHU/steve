---
phase: 04-editor
plan: 01
subsystem: editor-foundation
tags: [dependencies, api, testing, tdd, supabase, dnd-kit]
dependency_graph:
  requires: []
  provides:
    - editor-utils pure functions (reorderSections, applyManualOverride, updateTheme, updateSectionAiContent)
    - PATCH /api/websites/[id] with content field support
    - POST /api/upload/image (Supabase Storage)
    - POST /api/ai/regenerate-section (GPT-4o per-section)
    - shadcn UI components (tabs, separator, badge, dialog, skeleton, sonner)
    - npm packages (@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, @supabase/supabase-js, sonner)
  affects:
    - Phase 4 editor UI plans (04-02, 04-03) wire to these APIs
tech_stack:
  added:
    - "@dnd-kit/core ^6.3.1"
    - "@dnd-kit/sortable ^10.0.0"
    - "@dnd-kit/utilities"
    - "@supabase/supabase-js ^2.99.2"
    - "sonner ^2.0.7"
  patterns:
    - TDD with Vitest (RED-GREEN-REFACTOR cycle)
    - Pure functional immutable updates for editor state mutations
    - Supabase Storage for image uploads (service role key, no expiry)
    - GPT-4o per-section regeneration (no DB save — client merges)
key_files:
  created:
    - src/lib/editor-utils.ts
    - src/lib/editor-utils.test.ts
    - src/app/api/upload/image/route.ts
    - src/app/api/ai/regenerate-section/route.ts
    - src/components/ui/tabs.tsx
    - src/components/ui/separator.tsx
    - src/components/ui/badge.tsx
    - src/components/ui/dialog.tsx
    - src/components/ui/skeleton.tsx
    - src/components/ui/sonner.tsx
  modified:
    - src/app/api/websites/[id]/route.ts (added content field to PATCH)
    - src/lib/ai-prompts.ts (added buildSectionRegenPrompt)
    - package.json (5 new deps)
decisions:
  - "editor-utils functions are pure (no side effects) — simplifies testing and makes state mutations predictable in React"
  - "regenerate-section does NOT save to DB — client receives ai_content, merges into local editor state, and persists via PATCH Save button"
  - "PATCH content field syncs seoMeta automatically if ast.seo present — keeps columns in sync same as generate endpoint"
  - "Supabase client in upload route uses service role key (server-side only) — bypasses RLS for reliable storage writes"
metrics:
  duration: "6m 15s"
  completed_date: "2026-03-18"
  tasks_completed: 2
  tasks_total: 2
  files_created: 10
  files_modified: 3
---

# Phase 4 Plan 01: Editor Foundation Summary

**One-liner:** Install dnd-kit + Supabase deps, add 6 shadcn components, create 4 pure editor-utils functions with 18 TDD tests, extend PATCH API for content saves, and build image upload + per-section AI regeneration routes.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Install dependencies + create editor-utils with tests | 189e120 | package.json, editor-utils.ts, editor-utils.test.ts, 6x ui/*.tsx |
| 2 | Extend PATCH API + create upload and regenerate-section API routes | f39de9d | websites/[id]/route.ts, upload/image/route.ts, regenerate-section/route.ts, ai-prompts.ts |

## What Was Built

### editor-utils.ts (pure functions)

Four immutable state mutation functions for the editor:
- `reorderSections(sections, oldIndex, newIndex)` — uses `arrayMove` from @dnd-kit/sortable
- `applyManualOverride(ast, sectionId, field, value)` — sets `manual_overrides[field]`, does not touch `ai_content`
- `updateTheme(ast, partial)` — merges partial theme, preserves sections and seo
- `updateSectionAiContent(ast, sectionId, newAiContent)` — replaces `ai_content`, preserves `manual_overrides`

All tested with 18 Vitest unit tests covering both happy paths and edge cases (non-existent sectionId, same-index reorder, immutability checks).

### PATCH /api/websites/[id] — content field

Added `"content" in body` handler block. Validates content is a non-null, non-array object. Sets `updateSet.content = content` and also syncs `updateSet.seoMeta = ast.seo` when the seo field is present — keeping both columns in sync (same behavior as the generate endpoint).

### POST /api/upload/image

Authenticated endpoint (401 if no session). Parses FormData, validates `file` is an image MIME type and under 5MB. Uploads via `supabase.storage.from("website-images").upload(...)` using the service role client. Returns `{ url: publicUrl }`.

Requires: Supabase Storage bucket `website-images` with public access, `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` env vars.

### POST /api/ai/regenerate-section

Authenticated + ownership-checked endpoint. Accepts `{ websiteId, sectionId, sectionType, prompt?, currentContent? }`. Calls GPT-4o with `buildSystemPrompt` (full template system prompt) and `buildSectionRegenPrompt` (targeted section instruction). Returns `{ ai_content: parsedContent }` — does NOT save to DB. Client is responsible for merging into local editor state and persisting via PATCH.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TypeScript cast error in editor-utils.test.ts**
- **Found during:** Task 2 typecheck verification
- **Issue:** `SectionContent` is a union of interfaces without index signatures; direct `as Record<string, unknown>` cast fails TS strict check
- **Fix:** Changed affected casts to `as unknown as Record<string, unknown>` (double-cast through unknown)
- **Files modified:** src/lib/editor-utils.test.ts
- **Commit:** f39de9d

**2. [Rule 2 - Pre-existing] .env.example typo `SUPABASE_SERVICE_ROL`**
- **Found during:** Task 2 while updating .env.example
- **Issue:** Pre-existing typo in the key name; plan required adding `SUPABASE_SERVICE_ROLE_KEY`
- **Fix:** Replaced the typo entry with the correct `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`
- **Files modified:** .env.example (gitignored, not committed)
- **Note:** .env.example is gitignored in this project; file updated on disk only

## Verification Results

- `npm run test` — 58 tests pass (5 test files)
- `npm run typecheck` — clean
- All 6 shadcn components exist in src/components/ui/
- package.json has all 5 new npm packages
- .env.example has correct Supabase Storage vars (on disk)

## Self-Check: PASSED
