# Project Research Summary

**Project:** Enhanced AI Pipeline v1.1 — Website Generator
**Domain:** Multi-step LLM orchestration pipeline with SSE streaming (Next.js / OpenAI)
**Researched:** 2026-03-19
**Confidence:** HIGH

## Executive Summary

This project is a milestone upgrade (v1.1) to an existing AI-powered HTML website generator. The current pipeline runs 4 sequential steps (Analyze → Research → Generate → Validate) and produces visually generic output because it lacks domain-aware design decisions and a quality gate before delivery. The v1.1 upgrade introduces 3 new pipeline agents — a Component Library (static snippet injection), a Design Agent (domain-to-visual-identity mapping), and a Review+Refine Agent (quality gate) — while removing the existing Research step that is superseded. The target architecture is a 7-step fresh-generation flow and a 4-step edit flow, all within the same SSE streaming infrastructure already in production.

The recommended approach is to build in three sequential plans driven by hard dependency order: Component Library first (no dependencies, enables other components), then Design Agent + Context Builder + Prompt Restructuring (enables prompt caching and CSS variable injection), then Reviewer + Pipeline Rewire + UI update (the final integration). The only new library dependency is Zod v3, which enables typed Structured Outputs for the Design Agent and Review Agent — all other pieces use the existing stack. The core quality improvement is a domain-to-style-preset mapping (Design Agent) that eliminates the "generic blue DaisyUI website" problem, combined with a generate-then-critique loop that avoids surfacing low-quality output to users.

The primary risks are: (1) Vercel plan tier — the 73-second worst-case pipeline requires Pro plan (300s max) and the existing 90s `maxDuration` already silently exceeds Hobby plan limits; (2) Review score calibration — LLMs exhibit self-preference bias and the 75-point refine threshold must be empirically calibrated before shipping, not assumed; (3) Edit mode design context loss — the Context Builder must explicitly handle the case where no Design Agent result is available and inject a "preserve existing style" instruction, or edits will regress to DaisyUI blue defaults.

## Key Findings

### Recommended Stack

The existing stack (Next.js 16, OpenAI SDK v6.x, Tailwind v4, DaisyUI 4, Drizzle ORM, Vitest) requires no changes except one new direct dependency: Zod v3 (`^3.24.x`). Zod v3 is already a transitive dependency (via better-auth) and enables `zodResponseFormat` from `openai/helpers/zod` for typed Structured Outputs. Zod v4 must be avoided — the openai SDK's `zodResponseFormat` resolves from `"zod"` which maps to v3; mixing versions causes type errors. The Vercel AI SDK and LangChain are explicitly ruled out — both add abstraction over the existing raw OpenAI SDK + ReadableStream SSE pattern that is already working in production.

OpenAI Prompt Caching is automatic for prompts over 1,024 tokens total (system + user combined). The 800-token system prompt design goal alone will not trigger caching — the total must cross 1,024 tokens, which happens naturally when the user message (design brief + snippets + prompt, ~1,750 tokens) is included. The practical action is to keep the system prompt fully static (no per-request data) and move all variable content to the user message, enabling prefix caching on the system role automatically.

**Core technologies:**
- OpenAI SDK v6.x (existing): gpt-4o for generation/refine, gpt-4o-mini for analyze/design/review — cost and speed tiering is intentional
- Zod v3 (`^3.24.x`): Runtime schema validation for Design Agent and Review Agent JSON outputs via `zodResponseFormat`
- Vitest (existing): Unit tests for component library tag-matching logic, which is pure TypeScript and requires no mocking

**Do not add:**
- Vercel AI SDK — incompatible streaming conventions with existing ReadableStream SSE
- LangChain — heavy abstraction, no benefit for single-turn pipeline calls
- Zod v4 — breaks `openai/helpers/zod` compatibility
- External color palette libraries — Design Agent LLM handles palette selection, no color math needed

### Expected Features

All 5 features ship together as v1.1 — they are tightly interdependent and partial deployment produces a broken pipeline.

**Must have (table stakes for v1.1):**
- Visible progress for all 7 steps during fresh generation — users already expect step-level visibility from competitors; current 4-step labels are now stale and must be updated
- Output that does not look like the DaisyUI default (blue, generic) — the root complaint that motivates this entire upgrade; Design Agent is the fix
- Edit requests that feel faster than fresh generation — edit mode 4-step flow (~35s) vs fresh 7-step (~48-73s) validates this expectation

**Should have (differentiators):**
- Design Agent with domain-aware style presets — maps content domain (fitness, cooking, portfolio) to visual identity (bold-dark, warm-organic, etc.); this is the key "intelligence" users perceive
- Component Library with tag-matched snippet injection — up to 4 curated HTML snippets injected as reference context; reduces output variance, limits to ~1,200 tokens (not all 25 snippets)
- Review + Conditional Refine gate — gpt-4o-mini scores output 0-100; triggers gpt-4o refine only when score < 75; uses different model to avoid self-preference bias
- CSS variable injection for consistent theming — Design Agent hex values injected as `--color-primary` CSS custom properties, bypassing DaisyUI's oklch token system
- Prompt caching via system/user message split — lean static system prompt (~800 tokens) + variable user message; caching applies automatically to the static prefix

**Defer (v2+):**
- Multi-page progressive generation — fundamentally different pipeline (scaffold + per-page + hash router), explicitly deferred per PROJECT.md
- User-visible style selector (let users pick design presets manually) — adds UI surface, defer until Design Agent quality is validated in production
- Design Agent extraction in edit mode (reading current colors from HTML) — only if users report style drift; v1.1 handles this with "preserve existing style" instruction

### Architecture Approach

The pipeline is a sequential async module chain orchestrated by `src/lib/ai-pipeline/index.ts`, which calls each step as a pure async function and emits SSE events via an `onEvent` callback after each step completes. Fresh mode runs 7 steps; edit mode runs 4 steps. The branch point is whether `currentHtml` is provided. The existing `researcher.ts` step is removed entirely — its role is superseded by the Component Library (local, ~0ms) and Design Agent (LLM, ~5s). All new agents follow the same module pattern as existing ones: one file, one exported function, one OpenAI call with its own `AbortSignal.timeout()`.

**Major components:**
1. `component-library/` (new) — static TypeScript snippet files with tag arrays; `selectComponents(analysis)` returns top 4 by tag overlap; runs locally in ~0ms
2. `design-agent.ts` (new) — gpt-4o-mini call with Zod Structured Output; returns `DesignResult` with palette, typography, style preset, and hero layout
3. `context-builder.ts` (new) — assembles the user message from DesignResult + ComponentSnippets + analysis + original prompt; keeps system prompt invariant for caching
4. `reviewer.ts` (new) — gpt-4o-mini scores generated HTML 0-100 across visual/content/technical dimensions; returns `ReviewResult` with `must_fix[]`
5. `generator.ts` (modified) — `refineHtml()` added alongside existing `generateHtml()`; uses separate minimal message builder (no snippets re-injected)
6. `index.ts` (modified) — rewired to 7-step fresh / 4-step edit; removes researcher step; enforces refine-never-in-edit-mode

**Build order (hard dependency-driven):**
- 09-01: Component Library (no dependencies)
- 09-02: Types + Design Agent + Context Builder + Prompt Rewrite (depends on 09-01)
- 09-03: Reviewer + Pipeline Rewire + UI labels (depends on 09-02)

### Critical Pitfalls

1. **Vercel Hobby plan 60s hard wall** — current `maxDuration = 90` already silently exceeds Hobby limits. The 73s worst-case (generate + refine) is impossible on Hobby. Must confirm Pro plan before setting `maxDuration = 120`. If Hobby: disable refine or cap at 55s via env var detection. This is a deployment blocker, not a code issue.

2. **Review score inflation making refine useless (or always triggering)** — gpt-4o-mini exhibits self-preference bias; median scores may cluster above 75, causing refine to never fire. Must run a calibration pass (score 10 known-good and 10 known-bad outputs) before shipping Phase 09-03. Add a safety override: if `must_fix[]` is non-empty but score >= 75, still trigger refine. Threshold 75 should be exposed as an env var for post-launch tuning.

3. **Design Brief missing in edit mode causes blue palette regression** — `buildUserMessage()` was designed assuming `DesignResult` is always available. Edit mode skips the Design Agent. Without explicit handling, the generator receives no color brief and defaults to DaisyUI blue. Fix: make `design` parameter optional; when absent, inject "preserve existing colors and typography" instruction block. Implement and test in 09-02.

4. **SSE STEP_LABELS out of sync with new pipeline steps** — `editor-client.tsx` has hardcoded labels for 4 steps. The new pipeline emits up to 7 steps. New steps (`components`, `design`, `review`, `refine`) will be silently ignored by the existing conditional guard. Must extend `PipelineEvent.step` union type in `types.ts` first, then update `STEP_LABELS` map in `editor-client.tsx`. TypeScript will not catch this if steps are cast to `string`.

5. **Component snippets re-injected into refine call bloating token count** — `refineHtml()` must use a separate minimal message builder. If it reuses `buildUserMessage()`, the ~1,200 token snippet context is re-injected with no benefit, pushing refine token cost above the generate step and adding 10-15s latency. Keep `buildGenerateMessage()` and `buildRefineMessage()` as separate functions.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 09-01: Component Library

**Rationale:** Zero dependencies on new types or LLM calls. Produces the `ComponentSnippet` type that every subsequent phase consumes. Pure TypeScript data — testable without mocking OpenAI. Building this first unblocks 09-02 immediately.

**Delivers:** `src/lib/component-library/` with 7 snippet files (~25 snippets), `ComponentSnippet` interface, and `selectComponents(analysis)` tag-matching function.

**Addresses features:** Component library snippet injection (P1), foundation for context builder.

**Avoids pitfall:** Tag vocabulary mismatch — snippet tags must be authored in sync with the terms the analyzer already emits. Establish the vocabulary in this phase.

**Research flag:** None — pure TypeScript data files with simple tag-match logic. Standard pattern, no additional research needed.

### Phase 09-02: Types + Design Agent + Context Builder + Prompt Rewrite

**Rationale:** Depends on 09-01 (`ComponentSnippet` type). All four items in this plan are tightly coupled: `DesignResult` type must exist before `design-agent.ts` can be written; `context-builder.ts` consumes both `DesignResult` and `ComponentSnippet[]`; `buildFreshSystemPrompt()` must be lean and static before CSS variable injection is wired in. These cannot be split without creating broken intermediate states.

**Delivers:** `DesignResult` and `ReviewResult` types; `design-agent.ts`; `context-builder.ts`; rewritten lean system prompt; generator split to system/user messages; `refineHtml()` skeleton.

**Addresses features:** Design Agent (P1), CSS variable injection (P1), prompt caching via message split (P1), edit mode design brief handling.

**Avoids pitfalls:** Design Brief absent in edit mode (handle `design?: DesignResult` in context builder); prompt caching threshold (verify `cached_tokens > 0` in integration test); DesignResult hex sanitization (validate `/^#[0-9a-fA-F]{6}$/` before injection).

**Uses stack:** Zod v3 + `zodResponseFormat` for Design Agent typed output; gpt-4o-mini with `AbortSignal.timeout(20000)`.

**Research flag:** None — patterns are well-documented. Verify caching behavior empirically during implementation.

### Phase 09-03: Reviewer + Pipeline Rewire + UI Update

**Rationale:** Depends on 09-02 (needs `ReviewResult` type, working generator, context builder). This is the integration phase — it wires all components into the orchestrator, updates the SSE route timeout, and extends the client UI. Must be done last because it validates the full end-to-end pipeline.

**Delivers:** `reviewer.ts`; rewritten `index.ts` orchestrator (7-step fresh / 4-step edit); `maxDuration: 120`; updated `STEP_LABELS` in `editor-client.tsx`.

**Addresses features:** Review + Conditional Refine (P1), edit mode branching (P1), user-visible progress for all 7 steps.

**Avoids pitfalls:** Review score inflation (run calibration pass before enabling in production); Vercel plan confirmation (check tier before setting maxDuration); SSE step label sync (extend `PipelineEvent.step` type first, then update client); refine-never-in-edit-mode (enforce in orchestrator branching); component snippets not re-injected in refine (separate `buildRefineMessage()`).

**Research flag:** Calibration testing required — generate 10+ websites, log reviewer scores, verify refine triggers at expected frequency before shipping. This is not standard and cannot be skipped.

### Phase Ordering Rationale

- Dependency chain from research is strict: Component Library produces types consumed by Design Agent; Design Agent produces output consumed by Context Builder; Context Builder feeds Generator; Generator output feeds Reviewer; Reviewer result gates Refiner. Out-of-order implementation creates broken intermediate states with no way to test each piece.
- The 09-02 grouping (4 items together) is intentional — prompt caching only works when system prompt is static, which requires the context builder to exist so variable content can move to user message. Splitting this phase would temporarily break the generator's message assembly.
- 09-03 is the only phase that requires end-to-end SSE testing. Placing it last means 09-01 and 09-02 can be verified independently with unit tests and isolated function calls.

### Research Flags

Phases needing deeper research during planning:
- **Phase 09-03 (Reviewer calibration):** The review score threshold (75) and rubric weights are empirical, not theoretical. Calibration run against 10+ known-good and known-bad outputs is mandatory before shipping. This cannot be skipped — miscalibration in either direction (always skip refine / always trigger refine) makes the feature non-functional.

Phases with standard patterns (skip research-phase):
- **Phase 09-01:** Pure TypeScript data files, zero LLM interaction, well-understood tag-match algorithm. No research needed.
- **Phase 09-02:** Zod Structured Outputs pattern is documented and verified in stack research. Design Agent is a standard gpt-4o-mini call with a constrained output schema.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Existing codebase read directly; Zod v3 + `zodResponseFormat` pattern verified against OpenAI SDK source; version compatibility confirmed |
| Features | HIGH | Feature set derived from official OpenAI docs, NeurIPS 2024 research on LLM self-preference bias, and Blueprint2Code production patterns |
| Architecture | HIGH | All existing files read directly from source; build order derived from hard dependency chain, not opinion |
| Pitfalls | HIGH | Vercel plan limits and OpenAI caching thresholds verified against official docs; score inflation verified against 2025 LLM evaluation research |

**Overall confidence:** HIGH

### Gaps to Address

- **Review threshold calibration value:** The 75 threshold is a reasonable starting point, but the actual optimal value is unknown before production data. Treat 75 as provisional; make it an env var (`REVIEW_THRESHOLD`, default 75) and tune post-launch. If median score of real outputs is > 80, lower to 65.
- **Vercel plan tier confirmation:** Research identified the 60s Hobby hard wall but cannot confirm the deployment environment. Must verify before Phase 09-03 implementation. If Hobby, the entire Review+Refine feature must be gated on plan tier (env var `VERCEL_ENV` can detect this).
- **Component snippet quality:** The 25 planned snippets are specified by category (heroes, navbars, etc.) but their actual HTML content is not yet authored. The tag vocabulary must be established in 09-01 and audited against the analyzer prompt's output terms before proceeding to 09-02.
- **Google Fonts `@import` position in generated HTML:** AI commonly places `@import` after `:root {}` which silently fails in Firefox. The system prompt rewrite in 09-02 must explicitly instruct the model to place `@import` as the first rule in the `<style>` block. Validate with an HTML linter during 09-02.

## Sources

### Primary (HIGH confidence)
- `src/lib/ai-pipeline/*.ts` (existing codebase) — confirmed pipeline pattern, module structure, existing types
- `docs/phase-09-enhanced-ai-pipeline.md` — full v1.1 spec
- OpenAI Prompt Caching official docs — 1,024-token threshold, prefix-match caching, automatic behavior
- OpenAI Structured Outputs guide — `zodResponseFormat`, `strict: true` enforcement
- Vercel function duration docs — 60s Hobby limit, 300s Pro limit
- `package.json` (existing codebase) — confirmed openai ^6.32.0, no zod direct dependency

### Secondary (MEDIUM confidence)
- NeurIPS 2024 LLM self-preference bias paper — ~10% self-preference confirmed; use different model for review
- SELF-REFINE research (learnprompting.org) — quality gains plateau after 1-2 refinement iterations
- Blueprint2Code multi-agent pipeline (PMC) — Previewing Agent + Coding Agent + Debugging Agent is established production pattern
- v0 vs Bolt.new comparison 2026 — user expectations for step visibility, instant preview

### Tertiary (LOW confidence — needs validation)
- Optimal review threshold (75) — derived from research patterns, not empirical data from this specific pipeline
- 25 snippet count — sufficient for v1.1 but optimal number unvalidated until tag-match hit rate measured in production

---
*Research completed: 2026-03-19*
*Ready for roadmap: yes*
