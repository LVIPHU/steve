---
phase: 06-shadcn-ui-templates-interactive-sections
plan: 01
subsystem: ui
tags: [shadcn, typescript, types, ai-prompts, templates, vitest]

# Dependency graph
requires:
  - phase: 04-website-editor
    provides: SectionType union, ast-utils validation, ai-prompts, section-list-item component
  - phase: 03-public-website-viewer
    provides: template system (5 templates), layouts, section components
provides:
  - Extended SectionType union with 11 types (6 existing + 5 new)
  - 5 new content interfaces (StepsContent, IngredientsContent, GoalsContent, FlashcardContent, QuizContent)
  - VALID_SECTION_TYPES updated to 11 entries
  - TEMPLATE_PRESETS updated: cooking uses ingredients/steps, learning uses goals/flashcard/quiz
  - TEMPLATE_ALLOWED_SECTIONS map (per-template allowed section types)
  - SECTION_TYPE_LABELS updated with all 11 entries (Vietnamese labels)
  - 7 shadcn components installed: progress, accordion, carousel, toggle, switch, checkbox, radio-group
  - buildSystemPrompt includes 5 new section schemas + template-specific rules
  - buildSectionRegenPrompt includes schema hints for new section types
affects: [06-02-cooking-layout, 06-03-learning-layout, 06-04-editor-new-sections, 06-05-dark-mode]

# Tech tracking
tech-stack:
  added: [shadcn/ui progress, accordion, carousel, toggle, switch, checkbox, radio-group]
  patterns:
    - TEMPLATE_ALLOWED_SECTIONS maps each TemplateId to allowed SectionType[] — used by editor to filter section add UI
    - Schema hints in buildSectionRegenPrompt give AI correct shape when regenerating individual new section types

key-files:
  created:
    - src/lib/templates.test.ts
    - src/components/ui/progress.tsx
    - src/components/ui/accordion.tsx
    - src/components/ui/carousel.tsx
    - src/components/ui/toggle.tsx
    - src/components/ui/switch.tsx
    - src/components/ui/checkbox.tsx
    - src/components/ui/radio-group.tsx
  modified:
    - src/types/website-ast.ts
    - src/lib/ast-utils.ts
    - src/lib/ast-utils.test.ts
    - src/lib/ai-prompts.ts
    - src/lib/ai-prompts.test.ts
    - src/lib/templates.ts
    - src/app/(dashboard)/dashboard/websites/[id]/edit/components/section-list-item.tsx

key-decisions:
  - "TEMPLATE_ALLOWED_SECTIONS lives in templates.ts (not ast-utils) — template-specific data belongs with template config, not validation"
  - "buildSectionRegenPrompt schema hints added inline as schemaHints Record — avoids duplicating schema docs from buildSystemPrompt"
  - "cooking template TEMPLATE_PRESETS changed from [hero, content, gallery, cta] to [hero, ingredients, steps, cta] — new section types replace generic content for cooking use case"
  - "learning template TEMPLATE_PRESETS changed from [hero, content, features, cta] to [hero, goals, content, flashcard, quiz] — interactive learning sections added"

patterns-established:
  - "SectionType union is the single source of truth — extended in website-ast.ts, array mirrored in VALID_SECTION_TYPES, labels in SECTION_TYPE_LABELS"
  - "Template-specific constraints expressed in both AI prompts (generation) and TEMPLATE_ALLOWED_SECTIONS (editor UI filtering)"

requirements-completed: [P6-01, P6-02, P6-03, P6-07, P6-11, P6-13, P6-14]

# Metrics
duration: 6min
completed: 2026-03-19
---

# Phase 6 Plan 01: Type System + shadcn Foundation Summary

**Extended SectionType union to 11 types (steps/quiz/flashcard/goals/ingredients), installed 7 shadcn components, updated AI prompts with new section schemas and template-specific rules, added TEMPLATE_ALLOWED_SECTIONS map**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-19T03:05:41Z
- **Completed:** 2026-03-19T03:12:32Z
- **Tasks:** 2/2
- **Files modified:** 15

## Accomplishments

- 5 new section type interfaces exported from website-ast.ts (StepsContent, IngredientsContent, GoalsContent, FlashcardContent, QuizContent)
- 7 shadcn components installed: progress, accordion, carousel, toggle, switch, checkbox, radio-group
- AI prompts updated: new section schemas in buildSystemPrompt, template-specific rules for cooking/learning, schema hints in buildSectionRegenPrompt
- TEMPLATE_ALLOWED_SECTIONS export added to templates.ts for editor UI filtering
- All 80 tests passing, typecheck clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Install shadcn components + extend types and validation** - `85dd980` (feat)
2. **Task 2: Update AI prompts + template config + SECTION_TYPE_LABELS** - `5d33737` (feat)

## Files Created/Modified

- `src/types/website-ast.ts` - Extended SectionType union (11 types), added 5 new content interfaces, updated SectionContent union
- `src/lib/ast-utils.ts` - VALID_SECTION_TYPES updated to 11 entries
- `src/lib/ast-utils.test.ts` - Added 6 new type acceptance tests + VALID_SECTION_TYPES length test (17 tests total)
- `src/lib/ai-prompts.ts` - Updated TEMPLATE_PRESETS, added 5 new section schemas to buildSystemPrompt, added template-specific rules, added schema hints to buildSectionRegenPrompt
- `src/lib/ai-prompts.test.ts` - Added TEMPLATE_PRESETS tests and buildSystemPrompt new-type tests
- `src/lib/templates.ts` - Added SectionType import and TEMPLATE_ALLOWED_SECTIONS export
- `src/lib/templates.test.ts` - Created with 6 tests for TEMPLATE_ALLOWED_SECTIONS
- `src/app/(dashboard)/dashboard/websites/[id]/edit/components/section-list-item.tsx` - Added 5 new SECTION_TYPE_LABELS entries (Vietnamese)
- `src/components/ui/progress.tsx` - New shadcn component
- `src/components/ui/accordion.tsx` - New shadcn component
- `src/components/ui/carousel.tsx` - New shadcn component
- `src/components/ui/toggle.tsx` - New shadcn component
- `src/components/ui/switch.tsx` - New shadcn component
- `src/components/ui/checkbox.tsx` - New shadcn component
- `src/components/ui/radio-group.tsx` - New shadcn component

## Decisions Made

- TEMPLATE_ALLOWED_SECTIONS lives in templates.ts (not ast-utils) — template-specific data belongs with template config, not validation
- buildSectionRegenPrompt schema hints added inline as schemaHints Record — avoids duplicating schema docs from buildSystemPrompt
- cooking template TEMPLATE_PRESETS changed from [hero, content, gallery, cta] to [hero, ingredients, steps, cta] — new section types replace generic content for cooking use case
- learning template TEMPLATE_PRESETS changed from [hero, content, features, cta] to [hero, goals, content, flashcard, quiz] — interactive learning sections added

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

The first `npx shadcn@latest add` command prompted interactively about overwriting button.tsx. Resolved by using `--overwrite` flag. All 7 target components installed successfully.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Type system foundation complete: all 5 new section types defined, validated, labeled
- AI prompts configured: cooking/learning templates will generate correct section types
- shadcn components available: accordion (steps/ingredients), carousel, checkbox (goals), radio-group (quiz), switch, toggle, progress
- Plans 06-02 (cooking layout) and 06-03 (learning layout) can proceed immediately
- TEMPLATE_ALLOWED_SECTIONS ready for editor UI section filtering in 06-04

---
*Phase: 06-shadcn-ui-templates-interactive-sections*
*Completed: 2026-03-19*
