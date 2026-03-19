---
phase: 06-shadcn-ui-templates-interactive-sections
plan: "05"
subsystem: public-templates
tags: [dark-mode, next-themes, theme-provider, ux]
dependency_graph:
  requires: [06-04]
  provides: [dark-mode-public-pages]
  affects: [public-website-viewer, template-layouts]
tech_stack:
  added: []
  patterns: [next-themes ThemeProvider, mounted flag hydration safety, fixed positioning for full-bleed layouts]
key_files:
  created:
    - src/components/dark-mode-toggle.tsx
  modified:
    - src/app/(public)/layout.tsx
    - src/components/layouts/blog-layout.tsx
    - src/components/layouts/portfolio-layout.tsx
    - src/components/layouts/fitness-layout.tsx
    - src/components/layouts/cooking-layout.tsx
    - src/components/layouts/learning-layout.tsx
decisions:
  - DarkModeToggle uses mounted flag (useState false + useEffect) to prevent SSR hydration mismatch — theme is client-only state
  - Portfolio uses fixed top-right positioning for toggle — full-bleed sections leave no natural header slot
  - Blog/Fitness/Cooking/Learning use inline header bar with justify-end — constrained max-width layouts have natural top space
  - Cooking and Learning already had dark:bg-background from Plan 04 — no additional dark mode overrides needed
metrics:
  duration: "~3m"
  completed: "2026-03-19"
  tasks: 2
  files: 7
---

# Phase 6 Plan 05: Dark Mode Toggle Summary

Dark mode added to all 5 public template pages via next-themes ThemeProvider on the public layout, with a DarkModeToggle component integrated into every template.

## What Was Built

**ThemeProvider on public layout** (`src/app/(public)/layout.tsx`): Wraps all public pages in `ThemeProvider` with `attribute="class"` (injects `.dark` on `<html>`), `defaultTheme="light"`, `enableSystem`, and `storageKey="theme-preference"`. next-themes automatically injects an inline blocking script to prevent FOUC.

**DarkModeToggle component** (`src/components/dark-mode-toggle.tsx`): Client component with `useTheme` hook. Uses `mounted` flag (`useState(false)` + `useEffect`) to prevent SSR hydration mismatch. Renders Sun icon in dark mode (switch to light) and Moon icon in light mode (switch to dark). Ghost button variant, h-9 w-9 touch target, Vietnamese aria-labels (`Che do sang` / `Che do toi`).

**5 template layout integrations:**
- Blog: Header bar `max-w-3xl mx-auto px-4 py-4 flex justify-end` above sections
- Portfolio: `fixed top-4 right-4 z-50` — necessary for full-bleed layout with no natural header
- Fitness: Header bar `max-w-5xl mx-auto px-6 py-4 flex justify-end` above sections
- Cooking: Header bar `max-w-3xl mx-auto px-4 pt-4 flex justify-end` above sections container
- Learning: Header bar `max-w-4xl mx-auto px-4 pt-4 flex justify-end` above sections container

## Deviations from Plan

None — plan executed exactly as written. Cooking and Learning layouts already had `dark:bg-background` overrides from Plan 04, so no additional dark mode CSS changes were needed.

## Verification

- `npm run typecheck` — passed (0 errors)
- `npm run test` — 80/80 tests pass
- All 5 layouts confirmed to import and render `<DarkModeToggle />`
- Public layout confirmed to wrap children in ThemeProvider with correct config

## Self-Check

- `src/app/(public)/layout.tsx` — exists with ThemeProvider
- `src/components/dark-mode-toggle.tsx` — exists with useTheme + mounted flag
- All 5 layout files contain DarkModeToggle import and usage
- Commits 9902b94, ce9fc17 verified in git log
