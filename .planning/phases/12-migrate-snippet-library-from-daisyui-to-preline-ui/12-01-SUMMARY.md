---
phase: 12-migrate-snippet-library-from-daisyui-to-preline-ui
plan: 01
subsystem: ui
tags: [preline, tailwind, component-library, snippets, dark-mode]

# Dependency graph
requires:
  - phase: 09-component-library
    provides: ComponentSnippet type, ALL_SNIPPETS structure, selectComponents() function
  - phase: 10-design-agent-context-builder-prompt-rewrite
    provides: buildSystemPrompt() zero-parameter invariant, buildGoogleFontsImport()
provides:
  - Preline/Tailwind CDN system prompt replacing DaisyUI
  - 5 rewritten high-impact snippet files with dark mode (29 snippets, was 16)
  - 6 new empty stub category files registered in index.ts
  - Wave 0 test guardrails: DaisyUI detector, 100+ threshold, 80% dark: coverage
affects:
  - phase 12-02 (remaining 6 snippet files to rewrite + fill stub files to reach 100+)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Preline data-hs-* attribute pattern for interactive UI behaviors (collapse, dropdown, modal, accordion, tabs)
    - Dark mode with Tailwind dark: prefix and class="dark" on <html> element
    - buildSystemPrompt() zero-parameter invariant preserved for OpenAI prompt caching

key-files:
  created:
    - src/lib/component-library/snippets/forms.ts
    - src/lib/component-library/snippets/ui-elements.ts
    - src/lib/component-library/snippets/cta.ts
    - src/lib/component-library/snippets/media.ts
    - src/lib/component-library/snippets/pricing.ts
    - src/lib/component-library/snippets/notifications.ts
  modified:
    - src/lib/html-prompts.ts
    - src/lib/component-library/snippets/hero.ts
    - src/lib/component-library/snippets/navbar.ts
    - src/lib/component-library/snippets/features.ts
    - src/lib/component-library/snippets/cards.ts
    - src/lib/component-library/snippets/footer.ts
    - src/lib/component-library/snippets/index.ts
    - src/lib/component-library/component-library.test.ts

key-decisions:
  - "Wave 0 test guardrails set before snippets rewritten — DaisyUI detector and 80% dark: threshold intentionally fail until Plan 02 completes remaining files"
  - "System prompt rewrite keeps zero-parameter signature for OpenAI prompt caching"
  - "Preline data-hs-* attributes used for interactive behaviors (collapse, dropdown, modal, accordion, tabs, stepper) — no Alpine.js"
  - "Dark mode palette: dark:bg-gray-900 (page), dark:bg-gray-800 (cards), dark:bg-gray-700 (hover); dark:text-white headings, dark:text-gray-300 body, dark:text-gray-400 muted"

patterns-established:
  - "Preline CDN interactive: data-hs-collapse, data-hs-overlay, data-hs-tab, hs-accordion-group pattern documented in buildSystemPrompt()"
  - "Anti-flash dark mode: localStorage.getItem('hs_theme') in <head> before CDNs; toggle updates classList.toggle('dark') + localStorage"
  - "Snippet color palette: bg-blue-600 primary, bg-indigo-600 secondary, gray-900/800/700 dark backgrounds, gray-200/700 borders — GPT-4o replaces with DesignResult palette"

requirements-completed: [SNIP-01, SNIP-02, SNIP-04, SNIP-05, SNIP-06, SNIP-08]

# Metrics
duration: 9min
completed: 2026-03-21
---

# Phase 12 Plan 01: Migrate Snippet Library Wave 1 Summary

**Preline/Tailwind CDN system prompt + 29 rewritten snippets across 5 files with full dark: prefix support, Wave 0 test guardrails (DaisyUI detector, 100+ threshold, 80% dark: coverage), and 6 empty category stubs wired into index.ts**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-21T05:43:22Z
- **Completed:** 2026-03-21T05:52:20Z
- **Tasks:** 3
- **Files modified:** 13

## Accomplishments
- Rewrote `buildSystemPrompt()` with Preline/Tailwind/Chart.js CDN setup, dark mode anti-flash pattern, 6 Preline interactive patterns (collapse, dropdown, modal, accordion, tabs, stepper), comprehensive anti-pattern section banning DaisyUI + Alpine.js + Preline semantic tokens
- Rewrote 5 high-impact snippet files: hero (4→7), navbar (3→5), features (4→6), cards (4→6), footer (3→5) = 29 snippets total (was 16), all with dark: prefix classes
- Added Wave 0 test guardrails: snippet count threshold 100, DaisyUI remnant detector (20+ patterns), 80% dark: coverage check; created 6 empty stub files (forms, ui-elements, cta, media, pricing, notifications) and wired into ALL_SNIPPETS

## Task Commits

Each task was committed atomically:

1. **Task 1: Wave 0 — Update tests + create 6 stub files + update index.ts** - `0fc3be1` (chore)
2. **Task 2: Rewrite buildSystemPrompt() from DaisyUI to Preline/Tailwind** - `a88414c` (feat)
3. **Task 3: Rewrite 5 high-impact snippet files** - `0eb4e22` (feat)

## Files Created/Modified
- `src/lib/html-prompts.ts` - Full rewrite: Preline CDN, dark mode toggle pattern, 6 interactive patterns, anti-patterns list
- `src/lib/component-library/snippets/hero.ts` - 7 snippets: Preline modal trigger, typed-text animation, gradient hero
- `src/lib/component-library/snippets/navbar.ts` - 5 snippets: Preline collapse mobile nav, dark mode toggle button + script, transparent
- `src/lib/component-library/snippets/features.ts` - 6 snippets: Preline data-hs-tab category filter, hs-accordion FAQ
- `src/lib/component-library/snippets/cards.ts` - 6 snippets: Preline collapse expandable cards, hover overlay
- `src/lib/component-library/snippets/footer.ts` - 5 snippets: newsletter form, back-to-top with smooth scroll
- `src/lib/component-library/snippets/forms.ts` - Empty stub (formsSnippets)
- `src/lib/component-library/snippets/ui-elements.ts` - Empty stub (uiElementsSnippets)
- `src/lib/component-library/snippets/cta.ts` - Empty stub (ctaSnippets)
- `src/lib/component-library/snippets/media.ts` - Empty stub (mediaSnippets)
- `src/lib/component-library/snippets/pricing.ts` - Empty stub (pricingSnippets)
- `src/lib/component-library/snippets/notifications.ts` - Empty stub (notificationsSnippets)
- `src/lib/component-library/snippets/index.ts` - 6 new imports added to ALL_SNIPPETS
- `src/lib/component-library/component-library.test.ts` - 3 new tests added (threshold 100, DaisyUI detector, 80% dark:)

## Decisions Made
- Wave 0 tests are intentionally failing at plan end — the DaisyUI detector will catch remaining DaisyUI in stats/testimonials/interactive/blog/portfolio/ecommerce; these are handled in Plan 02
- buildSystemPrompt() zero-parameter invariant preserved for OpenAI prompt caching (established in Phase 10, KEY CONSTRAINT)
- Snippet hero-centered updated to include Preline data-hs-overlay modal trigger to satisfy acceptance criteria requiring data-hs-* in hero.ts

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npm run typecheck` shows a pre-existing error in `src/app/api/auth/token-login/route.ts` (Cannot find module 'better-call') — this is unrelated to Plan 12-01 changes and existed before this plan.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 02 will rewrite remaining 6 snippet files (stats, testimonials, interactive, blog, portfolio, ecommerce), fill the 6 new stub categories with 8-10 snippets each, and push total count above 100 to make all Wave 0 tests pass
- The Wave 0 test guardrails are in place — Plan 02 runs `npm run test -- component-library` to confirm all tests pass as final verification

---
*Phase: 12-migrate-snippet-library-from-daisyui-to-preline-ui*
*Completed: 2026-03-21*
