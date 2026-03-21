---
phase: 12-migrate-snippet-library-from-daisyui-to-preline-ui
plan: 03
subsystem: ui
tags: [preline, tailwind, snippets, component-library, vanilla-js, accordion, stepper]

# Dependency graph
requires:
  - phase: 12-02
    provides: DaisyUI-to-Preline migration of all snippet files

provides:
  - Zero hs-accordion-active: variants in blog.ts and pricing.ts (chevron rotation via vanilla JS)
  - Zero hs-stepper-active:/hs-stepper-completed: variants in forms.ts and interactive.ts (steppers via vanilla JS)
  - Banned hs-* variant detector test in component-library.test.ts
affects: [component-library, html-prompts, ai-pipeline]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Vanilla JS onclick pattern for accordion chevron rotation: classList.toggle('rotate-180') on .hs-accordion-toggle click"
    - "Self-contained vanilla JS stepper: data-step/data-panel attributes + inline script managing step state"
    - "Active-by-default accordion/stepper: initial rotate-180 or step-active class set in HTML, JS toggles from there"

key-files:
  created: []
  modified:
    - src/lib/component-library/snippets/blog.ts
    - src/lib/component-library/snippets/pricing.ts
    - src/lib/component-library/snippets/forms.ts
    - src/lib/component-library/snippets/interactive.ts
    - src/lib/component-library/component-library.test.ts

key-decisions:
  - "hs-stepper-active:/hs-stepper-completed: variants fixed in forms.ts and interactive.ts as auto-Rule-2 (test NOTE explicitly called for it)"
  - "Stepper replaced with full vanilla JS implementation — data-hs-stepper attributes removed, step state driven by classList via data-step/data-panel selectors"
  - "Two pre-existing html-prompts.test.ts failures (DaisyUI CDN check, flip card CSS) are out-of-scope and unchanged by this plan"

patterns-established:
  - "Snippet inline scripts use IIFE wrapper (function(){...})() for scope isolation"
  - "Stepper IDs are unique per-snippet (stepper-reg, stepper-wizard) to avoid collision if multiple snippets appear on one page"

requirements-completed: [SNIP-01, SNIP-02, SNIP-03, SNIP-04, SNIP-05, SNIP-06, SNIP-07, SNIP-08]

# Metrics
duration: 15min
completed: 2026-03-21
---

# Phase 12 Plan 03: Gap Closure — hs-accordion-active + hs-stepper Variants Summary

**Replaced 5 banned `hs-accordion-active:rotate-180` occurrences with vanilla JS classList.toggle, rebuilt stepper snippets (forms + interactive) without any hs-stepper-active:/hs-stepper-completed: variants, and added bannedHsVariants detector to test suite — all 32 component-library tests pass**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-21T14:30:00Z
- **Completed:** 2026-03-21T14:45:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Eliminated all `hs-accordion-active:rotate-180` occurrences from blog.ts (1) and pricing.ts (4); chevron rotation now works via click listener on `.hs-accordion-toggle` buttons using `classList.toggle('rotate-180')`
- Replaced Preline-dependent stepper snippets in forms.ts and interactive.ts with self-contained vanilla JS implementations — no `data-hs-stepper`, no `hs-stepper-active:`, no `hs-stepper-completed:` variant classes anywhere
- Added `bannedHsVariants` array to component-library.test.ts covering 7 CDN-incompatible Preline variant prefixes; test description updated to reflect expanded scope; all 32 tests pass

## Task Commits

1. **Task 1: Replace hs-accordion-active:rotate-180 in blog.ts and pricing.ts** - `ad8ce7a` (fix)
2. **Task 2: Add banned hs-* variant detector test + fix stepper snippets** - `55eaae7` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/lib/component-library/snippets/blog.ts` - Removed hs-accordion-active:rotate-180 from SVG, added rotate-180 initial class (accordion starts open), added inline JS script
- `src/lib/component-library/snippets/pricing.ts` - Removed hs-accordion-active:rotate-180 from all 4 FAQ SVGs, faq-1 SVG starts with rotate-180 (active by default), added inline JS script
- `src/lib/component-library/snippets/forms.ts` - Full stepper replacement: vanilla JS stepper (id=stepper-reg) with data-step/data-panel attributes, all hs-stepper-* variants removed
- `src/lib/component-library/snippets/interactive.ts` - Full stepper replacement: vanilla JS stepper (id=stepper-wizard) with same pattern
- `src/lib/component-library/component-library.test.ts` - Test renamed to "no snippet contains banned class patterns (DaisyUI + hs-* variants)", bannedHsVariants array added with 7 patterns

## Decisions Made

- Stepper snippets required full replacement (not just class removal) because `data-hs-stepper` attribute on the wrapper div drives all panel show/hide via Preline JS — without the build step it would be entirely non-functional. Self-contained vanilla JS steppers are simpler and don't depend on any external library.
- IIFE wrapper used for all stepper scripts to prevent variable leakage to global scope.
- Stepper IDs are unique per snippet (`stepper-reg` vs `stepper-wizard`) to avoid getElementById collision if both snippets appear on the same generated page.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Fixed hs-stepper-active:/hs-stepper-completed: in forms.ts and interactive.ts**

- **Found during:** Task 2 (adding bannedHsVariants detector test)
- **Issue:** The test NOTE in Task 2 explicitly stated these patterns in forms.ts and interactive.ts would cause test failures once the bannedHsVariants check was added. These are CDN-incompatible Preline variant classes — stepper state indicators would be silently broken.
- **Fix:** Replaced both stepper snippets with fully self-contained vanilla JS implementations that drive all step state (circle colors, number/check visibility, connector colors, panel visibility, button text) via classList manipulation.
- **Files modified:** src/lib/component-library/snippets/forms.ts, src/lib/component-library/snippets/interactive.ts
- **Verification:** grep confirms zero hs-stepper-active:/hs-stepper-completed: in all snippet files; all 32 component-library tests pass
- **Committed in:** 55eaae7 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 2 - missing critical: stepper variants in forms/interactive also needed fixing)
**Impact on plan:** The plan's own NOTE in Task 2 anticipated this. Both stepper files fixed in the same commit as the test update. No scope creep — same pattern as accordion fix, same root cause.

## Issues Encountered

Two pre-existing failures in `html-prompts.test.ts` (tests checking for `daisyui` CDN and `perspective: 1000px` CSS in the system prompt) were already failing before this plan — confirmed by `git stash` verification. These are out-of-scope (system prompt was migrated to Preline in Phase 12 Plan 01) and documented in deferred-items per scope boundary rules.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 12 is now complete: all snippet files migrated from DaisyUI to Preline, zero banned variant classes in any snippet
- The bannedHsVariants detector will catch any future regressions during development
- Pre-existing html-prompts.test.ts failures should be addressed in a future cleanup plan (out-of-scope here)

---
*Phase: 12-migrate-snippet-library-from-daisyui-to-preline-ui*
*Completed: 2026-03-21*

## Self-Check: PASSED

- FOUND: src/lib/component-library/snippets/blog.ts
- FOUND: src/lib/component-library/snippets/pricing.ts
- FOUND: src/lib/component-library/snippets/forms.ts
- FOUND: src/lib/component-library/snippets/interactive.ts
- FOUND: src/lib/component-library/component-library.test.ts
- FOUND: .planning/phases/12-migrate-snippet-library-from-daisyui-to-preline-ui/12-03-SUMMARY.md
- FOUND commit: ad8ce7a (Task 1)
- FOUND commit: 55eaae7 (Task 2)
