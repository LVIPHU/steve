---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: Enhanced AI Pipeline
status: executing
stopped_at: Phase 14 context gathered (assumptions mode)
last_updated: "2026-03-24T07:48:37.277Z"
progress:
  total_phases: 6
  completed_phases: 5
  total_plans: 10
  completed_plans: 10
---

# STATE.md — Project Memory

## Project

**Name:** Website Generator
**Initialized:** 2026-03-16
**Status:** Ready to execute

## Current Position

Phase: 13 (multi-page-website-support) — EXECUTING
Plan: 2 of 2

## What's Left (v1.1)

- **Phase 9:** COMPLETE — Component Library (PIPE-01, PIPE-02, PIPE-03) → 1/1 plans done
- **Phase 10:** COMPLETE — Design Agent + Context Builder + Prompt Rewrite (PIPE-04 through PIPE-09) → 2/2 plans done
- **Phase 11:** COMPLETE — Reviewer + Pipeline Rewire + UI Update (PIPE-10 through PIPE-20) → 2/2 plans done, calibration pass approved

## Blockers/Concerns

- ~~**[Phase 11]** Vercel plan tier must be confirmed before setting `maxDuration: 120`~~ — RESOLVED in 11-02 (maxDuration = 60, Hobby-safe)
- ~~**[Phase 11]** Review score calibration (threshold 75 is provisional)~~ — RESOLVED: calibration pass approved, REVIEW_THRESHOLD=75 confirmed
- ~~**[Phase 10]** Zod v3 (`^3.24.x`) must be added as direct dep~~ — RESOLVED in 10-01 (zod@^3.25.76 installed)
- ~~**[Phase 10]** Edit mode must inject "preserve existing colors and typography" when no DesignResult~~ — RESOLVED in 10-02 (buildEditUserMessage() starts with preserve instruction)

## Key Decisions (v1.1 Roadmap)

- Phase 9 first: Component Library has zero dependencies, produces `ComponentSnippet` type consumed by Phase 10
- Phase 10 grouped: DesignResult type + Design Agent + context-builder + prompt rewrite are tightly coupled — splitting creates broken intermediate states
- Phase 11 last: Integration phase — rewires orchestrator, runs calibration, updates SSE client; requires all Phase 10 outputs
- `researcher.ts` removed in Phase 11 — superseded by Component Library (~0ms) + Design Agent (~5s)
- Edit mode skips Design/Review/Refine — 4-step flow (~35s) vs 7-step fresh (~48-73s)
- [09-01] Tags use only sections/features vocabulary so type with empty sections triggers fallback
- [09-01] ComponentSnippet in types.ts breaks circular dependency with snippets/
- [10-01] Lazy OpenAI client init (function wrapper) used in design-agent.ts — prevents test import failures without API key
- [10-01] Zod v3 pinned to ^3 — v4 breaks openai/helpers/zod zodResponseFormat helper
- [10-02] buildSystemPrompt() is zero-parameter invariant — enables OpenAI prompt caching (75% cost reduction on cached tokens)
- [10-02] Template structure hints removed from system prompt; Page Structure section in buildUserMessage() carries that info
- [10-02] Backward-compat aliases (buildFreshSystemPrompt, buildEditSystemPrompt) retained in html-prompts.ts — generator.ts migration deferred to Phase 11
- [11-01] FALLBACK_REVIEW score=100 — error during review means assume OK to prevent broken API key blocking all generation
- [11-01] Lazy OpenAI init pattern in reviewer.ts mirrors design-agent.ts — prevents test import failures without API key
- [11-01] index.ts "research" step events bridged to "components" to fix type break — full orchestrator rewire deferred to Plan 02
- [11-02] refineHtml sends only must_fix list + current HTML — no component snippets/design brief re-injected (PIPE-12 contract)
- [11-02] ENABLE_REFINE=false default — Hobby plan users get 5-step pipeline; quality gate opt-in via env var
- [11-02] maxDuration = 60 to match Vercel Hobby plan hard limit (was 90, silently exceeded)
- [11-02] REVIEW_THRESHOLD read inside function body (not module level) — enables per-request test isolation
- [11-02] REVIEW_THRESHOLD=75 calibration-approved; calibration observation: component feature detection depth could be richer to reduce unnecessary refine triggers
- [12-01] Wave 0 test guardrails set before snippets rewritten — DaisyUI detector and 80% dark: threshold intentionally fail until Plan 02 completes remaining files
- [12-01] buildSystemPrompt() rewritten for Preline/Tailwind CDN — zero-parameter signature preserved for OpenAI prompt caching
- [12-02] DaisyUI JS class strings replaced with multiple classList.add() calls using Tailwind color classes (btn-success → bg-teal-100, border-teal-300, text-teal-800 pattern)
- [12-02] <progress> DaisyUI elements replaced with div-based bars; JS updated to use style.width instead of .value property
- [12-02] hsl(var(--p)) CSS vars replaced with hardcoded #2563eb for reading-progress bar — Preline has no DaisyUI design token equivalents
- [12-03] hs-accordion-active: variant replaced with vanilla JS classList.toggle('rotate-180') on click — CDN-incompatible variant silently broken chevron rotation
- [12-03] Stepper snippets replaced with full vanilla JS implementation (data-step/data-panel selectors) — data-hs-stepper requires Preline JS build step, entirely non-functional via CDN
- [12-03] bannedHsVariants detector test added covering 7 CDN-incompatible hs-* variant prefixes — prevents future regressions
- [13-01] drizzle-kit generate non-functional due to schema drift — used tsx migration script directly via postgres.js for ADD COLUMN + data migration
- [13-01] jsonb_set with ARRAY[pageName] + to_jsonb(html::text) for atomic HTML page write — prevents race conditions and SQL injection (Pitfall 1)
- [13-01] pages.index fallback to htmlContent in public slug route for zero-downtime backward compat during multi-page transition
- [13-01] chat_history validation changed from !Array.isArray to typeof !== 'object' to accept per-page { [pageName]: ChatMessage[] } format

## Accumulated Context

### Roadmap Evolution

- Phase 12 added: Migrate snippet library from DaisyUI to Preline UI
- Phase 13 added: Multi-page Website Support
- Phase 14 added: Onboarding Chat Free-form Prompt (Lovable-style single text input)

## What's Built (v1.0 — all complete)

All Phases 1-8 complete. See ROADMAP.md Phase Details for full inventory.
Key foundation for v1.1: `src/lib/ai-pipeline/` (Analyze → Research → Generate → Validate), SSE streaming, `editor-client.tsx` with `STEP_LABELS`, `html-prompts.ts` (system/user prompt builders).

## Performance Metrics (v1.0)

| Phase | Plans | Avg/Plan |
|-------|-------|----------|
| 1-8 (28 plans total) | 28 | ~4 min |

*v1.1 metrics will accumulate from Phase 9 onwards*
| Phase 09 P01 | 1252 | 2 tasks | 15 files |
| Phase 10 P01 | 257 | 2 tasks | 4 files |
| Phase 10 P02 | 7 | 2 tasks | 4 files |
| Phase 11 P01 | 3 | 2 tasks | 6 files |
| Phase 11 P02 | 15 | 2 tasks | 9 files |
| Phase 12 P01 | 9 | 3 tasks | 13 files |
| Phase 12 P02 | 10 | 2 tasks | 12 files |
| Phase 12 P03 (gap) | 15 | 2 tasks | 5 files |
| Phase 13 P01 | 310 | 3 tasks | 9 files |

## Session Continuity

Last session: 2026-03-24T07:48:37.272Z
Stopped at: Phase 14 context gathered (assumptions mode)
Resume file: .planning/phases/14-onboarding-chat-freeform-prompt/14-CONTEXT.md
