---
phase: 07-html-first-ai-generation-and-lovable-style-editor
plan: 03
subsystem: ui
tags: [nextjs, server-actions, forms, shadcn, typescript]

# Dependency graph
requires:
  - phase: 07-01
    provides: htmlContent column on websites table
provides:
  - Simplified website creation form (name + prompt textarea, no template picker)
  - Server action using FormData with null templateId and htmlContent, redirect to /edit?prompt=...
  - Edit page reading searchParams.prompt and passing initialHtml + initialPrompt to editor client
  - HtmlEditorClient stub with new props interface for Plan 04
affects: [07-04]

# Tech tracking
tech-stack:
  added: [shadcn/textarea, shadcn/scroll-area]
  patterns: [Server Component form with action attribute pattern, FormData server action, searchParams await pattern]

key-files:
  created:
    - src/components/ui/textarea.tsx
    - src/components/ui/scroll-area.tsx
  modified:
    - src/app/(dashboard)/dashboard/websites/new/action.ts
    - src/app/(dashboard)/dashboard/websites/new/page.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/page.tsx
    - src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx

key-decisions:
  - "Server action changed from object param to FormData — required for form action attribute on Server Component"
  - "Action return type changed to Promise<void> — form action attribute requires void, not { error? }"
  - "editor-client.tsx replaced with HtmlEditorClient stub — old AST-based EditorClient incompatible with new prop interface"
  - "scroll-area installed in this plan — needed by Plan 04 editor, cheaper to install now than as a blocking issue later"

patterns-established:
  - "Server Component form uses action={serverAction} attribute — no useRouter or useState needed for creation forms"
  - "searchParams typed as Promise<{ key?: string }> and awaited — required in Next.js 16 App Router"

requirements-completed: [P7-05]

# Metrics
duration: 3m 11s
completed: 2026-03-19
---

# Phase 7 Plan 03: Simplified Creation Form + Edit Page Props Summary

**Creation form simplified to name + prompt textarea (no template picker); server action redirects to /edit?prompt=...; edit page passes htmlContent and initialPrompt to HtmlEditorClient stub**

## Performance

- **Duration:** 3m 11s
- **Started:** 2026-03-19T06:33:35Z
- **Completed:** 2026-03-19T06:36:46Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Removed template picker, note ID tab, and all template-selection logic from creation form
- Rewrote server action to use FormData, set templateId/htmlContent to null, redirect to `/dashboard/websites/{id}/edit?prompt=...`
- Rewrote edit page to await searchParams.prompt and pass htmlContent + initialPrompt to editor
- Replaced old AST-based EditorClient with HtmlEditorClient stub using new props interface

## Task Commits

Each task was committed atomically:

1. **Task 1: Simplified creation form + server action** - `5f8c994` (feat)
2. **Task 2: Edit page — pass htmlContent and initialPrompt to editor** - `7f1dd74` (feat)
3. **Bonus: Install scroll-area component** - `cc5f303` (chore)

## Files Created/Modified

- `src/app/(dashboard)/dashboard/websites/new/action.ts` - Rewritten: FormData param, templateId null, htmlContent null, redirect to /edit?prompt=...
- `src/app/(dashboard)/dashboard/websites/new/page.tsx` - Rewritten: Server Component with name input + promptText textarea, no template picker
- `src/app/(dashboard)/dashboard/websites/[id]/edit/page.tsx` - Rewritten: reads searchParams.prompt, passes initialHtml + initialPrompt to HtmlEditorClient
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` - Replaced with HtmlEditorClient stub for Plan 04 compatibility
- `src/components/ui/textarea.tsx` - New shadcn textarea component
- `src/components/ui/scroll-area.tsx` - New shadcn scroll-area component (for Plan 04)

## Decisions Made

- Server action changed from object param signature `{ name, templateId, ... }` to `FormData` — required because the Server Component form uses the `action` attribute pattern which passes FormData directly
- Return type changed from `Promise<{ error?: string }>` to `Promise<void>` — TypeScript's form action attribute type requires void, not a plain object
- Old `EditorClient` (AST-based, named export) replaced with `HtmlEditorClient` stub (default export) — interface mismatch would block typecheck; stub lets Plan 04 implement the full editor cleanly
- `scroll-area` installed proactively — Plan 04 needs it and installing now avoids a blocking issue mid-execution

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed FormData action return type mismatch**
- **Found during:** Task 1 (typecheck)
- **Issue:** Action returning `Promise<{ error?: string }>` not assignable to form `action` attribute type `(formData: FormData) => void | Promise<void>`
- **Fix:** Changed return type to `Promise<void>`, simplified error handling (return early without error object since redirect on success handles the happy path)
- **Files modified:** src/app/(dashboard)/dashboard/websites/new/action.ts
- **Verification:** npm run typecheck exits 0
- **Committed in:** 5f8c994

---

**Total deviations:** 1 auto-fixed (1 type bug)
**Impact on plan:** Required for typecheck to pass. No scope creep.

## Issues Encountered

- edit page.tsx used named import `{ EditorClient }` but Plan 04's new interface requires a default export `HtmlEditorClient` — both issues resolved by the stub replacement in Task 2

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Creation form and edit page are ready for Plan 04 (full HTML editor implementation)
- HtmlEditorClient stub accepts `websiteId`, `websiteName`, `initialHtml`, `initialPrompt`, `websiteStatus` — Plan 04 implements the real editor with these props
- scroll-area component pre-installed for Plan 04

---
*Phase: 07-html-first-ai-generation-and-lovable-style-editor*
*Completed: 2026-03-19*
