---
phase: 06-shadcn-ui-templates-interactive-sections
plan: "04"
subsystem: layouts
tags: [layouts, templates, visual-design, typography, dark-mode]
dependency_graph:
  requires: ["06-02"]
  provides: ["distinct-template-layouts"]
  affects: ["public-website-viewer", "editor-preview"]
tech_stack:
  added: ["Merriweather", "Oswald"]
  patterns: ["Server Component layouts", "CSS variable --primary-color", "next/font/google", "dark mode Tailwind variants"]
key_files:
  modified:
    - src/components/layouts/blog-layout.tsx
    - src/components/layouts/portfolio-layout.tsx
    - src/components/layouts/fitness-layout.tsx
    - src/components/layouts/cooking-layout.tsx
    - src/components/layouts/learning-layout.tsx
decisions:
  - "All layouts use --primary-color CSS variable (not --primary) for consistency with UI-SPEC"
  - "Cooking layout uses bg-[#fdf8f3] Tailwind arbitrary value for warm off-white so dark:bg-background can override it"
  - "Fitness edge-to-edge sections: border-l-4 applied at full-width wrapper, content inside max-w-5xl"
  - "Portfolio CTA band uses inline style backgroundColor for primaryColor — Tailwind arbitrary value would require unsafe-eval CSP"
metrics:
  duration: "~2 minutes"
  completed: "2026-03-19"
  tasks: 2
  files_modified: 5
---

# Phase 6 Plan 04: Template Layout Redesigns Summary

**One-liner:** All 5 template layouts redesigned with domain-specific fonts, spacing, and visual identities — from generic max-w-4xl containers to editorial serif blog, full-bleed portfolio, athletic fitness, warm recipe, and app-like learning layouts.

## What Was Built

Five layout components fully redesigned per UI-SPEC, each with a distinct visual identity:

| Template | Font | Width | Visual Identity |
|---|---|---|---|
| Blog | Merriweather (serif) | max-w-3xl | Editorial single column, hr dividers, py-12 whitespace |
| Portfolio | Inter (sans) | max-w-7xl | Full-bleed dark hero bg-slate-900, wide content, primaryColor CTA band |
| Fitness | Oswald (condensed) | max-w-5xl | border-l-4 accent on every section, dark zinc hero, edge-to-edge |
| Cooking | Lora (serif) | max-w-3xl | Warm #fdf8f3 background, card containers for ingredients/steps |
| Learning | Plus Jakarta Sans | max-w-4xl | bg-slate-50, card-wrapped non-hero sections, app-like spacing |

## Tasks Completed

| Task | Name | Commit | Files |
|---|---|---|---|
| 1 | Redesign blog-layout and portfolio-layout | 053ed94 | blog-layout.tsx, portfolio-layout.tsx |
| 2 | Redesign fitness-layout, cooking-layout, learning-layout | ee52900 | fitness-layout.tsx, cooking-layout.tsx, learning-layout.tsx |

## Key Decisions

1. **--primary-color CSS variable** — All layouts use `--primary-color` (not `--primary`) for CSS variable naming, matching the UI-SPEC convention. Public page already injects this variable at the wrapper level.

2. **Cooking dark mode** — The warm off-white `#fdf8f3` uses Tailwind's arbitrary value syntax (`bg-[#fdf8f3]`) rather than an inline style, so `dark:bg-background` can override it with a standard CSS specificity cascade.

3. **Fitness left border accent** — `border-l-4` is applied on the full-width section wrapper `div` (not inside the content container), producing a true edge-to-edge left accent per UI-SPEC.

4. **Portfolio CTA band** — The CTA section background uses `style={{ backgroundColor: ast.theme.primaryColor }}` inline style rather than Tailwind arbitrary value, since the color is dynamic and must match the user's chosen primary color at runtime.

5. **No "use client" on any layout** — All 5 layouts remain pure Server Components. Interactive sections (quiz, flashcard, goals) handle their own client boundaries through SectionRenderer.

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npm run typecheck` — exits 0, no errors
- `npm run test` — 80/80 tests pass
- All 5 layouts contain expected font imports, class names, and structural elements
- No layout contains `"use client"`

## Self-Check

- [x] blog-layout.tsx exists with Merriweather, max-w-3xl, border-t border-border
- [x] portfolio-layout.tsx exists with Inter, max-w-7xl, bg-slate-900, py-24
- [x] fitness-layout.tsx exists with Oswald, border-l-4, bg-zinc-900
- [x] cooking-layout.tsx exists with #fdf8f3, rounded-xl shadow-sm, max-w-3xl
- [x] learning-layout.tsx exists with Plus_Jakarta_Sans, bg-slate-50, rounded-xl shadow-sm border
- [x] Commit 053ed94 exists (blog + portfolio)
- [x] Commit ee52900 exists (fitness + cooking + learning)

## Self-Check: PASSED
