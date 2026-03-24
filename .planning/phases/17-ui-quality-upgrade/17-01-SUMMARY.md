---
phase: 17
plan: "01"
subsystem: ai-pipeline
tags: [system-prompt, ui-quality, design-principles, tailwind]
dependency_graph:
  requires: []
  provides: [enriched-system-prompt]
  affects: [html-prompts.ts, ai-pipeline/generator.ts]
tech_stack:
  added: []
  patterns: [design-principles-prompt, modern-ui-patterns-reference]
key_files:
  created: []
  modified:
    - src/lib/html-prompts.ts
decisions:
  - buildSystemPrompt zero-parameter invariant preserved (default mode='fresh') — OpenAI prompt caching unaffected
  - Design Principles and Modern UI Patterns injected into fresh mode system prompt only — edit mode remains compact
metrics:
  duration_seconds: 180
  completed_date: "2026-03-24"
  completed_tasks: 3
  total_tasks: 3
  files_changed: 1
---

# Phase 17 Plan 01: Rewrite System Prompt with Design Principles Summary

**One-liner:** Injected Design Principles and Modern UI Patterns sections into fresh-mode system prompt, enforcing py-20+ whitespace, text-5xl heroes, rounded-xl cards with hover shadows on every generation.

## Tasks Completed

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Add Design Principles section to `buildSystemPrompt()` | 29fa27e |
| 2 | Add Modern UI Patterns section to `buildSystemPrompt()` | 29fa27e |
| 3 | Verify zero-parameter invariant not broken | 29fa27e |

## What Was Built

Added two major sections to the fresh mode system prompt in `src/lib/html-prompts.ts`:

**Design Principles section** covers:
- Spacing & Layout: py-20/py-24 section padding, max-w-7xl gutters, consistent spacing scale, section rhythm
- Visual Hierarchy: text-5xl/6xl hero headlines, text-3xl section headings, text-lg body text
- Components: rounded-xl cards with hover shadows, rounded-lg buttons with transition-colors, Unsplash image patterns, inline SVG icons
- Color Application: primary/secondary/accent usage rules, dark mode variants required
- Grid & Responsive: feature card grid patterns, split layout patterns

**Modern UI Patterns section** provides concrete HTML reference patterns for:
- Hero Section with badge, headline with highlight span, two-button CTA row
- Navbar with sticky/backdrop-blur/bg-white/90 pattern
- Feature Card with icon container, group hover, border patterns
- CTA Section with full-color-bg, white button pattern

**Zero-parameter invariant** (`buildSystemPrompt()`) preserved — default parameter `mode = "fresh"` ensures OpenAI prompt caching continues to work.

## Verification

- `npm run test`: 93/93 tests pass
- `npm run typecheck`: Pre-existing `better-call` type error in `token-login/route.ts` (out of scope, unrelated to this plan)
- Signature `buildSystemPrompt(mode: "fresh" | "edit" = "fresh")` unchanged

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — no data stubs or placeholders introduced.

## Self-Check: PASSED

- `src/lib/html-prompts.ts` — FOUND (modified)
- Commit `29fa27e` — FOUND
- All 93 tests pass
