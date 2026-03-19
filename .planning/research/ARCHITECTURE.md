# Architecture Research

**Domain:** AI Pipeline — Enhanced Website Generation (v1.1)
**Researched:** 2026-03-19
**Confidence:** HIGH (based on direct source reading — all existing files and full phase-09 spec)

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         HTTP Layer                                   │
│  POST /api/ai/generate-html  (SSE streaming, maxDuration: 120)       │
│  Auth check → Ownership check → Start ReadableStream                 │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ onEvent(PipelineEvent)
┌──────────────────────────▼───────────────────────────────────────────┐
│                    Pipeline Orchestrator                              │
│   src/lib/ai-pipeline/index.ts — runGenerationPipeline()             │
│                                                                      │
│  FRESH MODE (7 steps):                                               │
│  Analyze → Components → Design → Generate → Review → Refine? → Validate
│                                                                      │
│  EDIT MODE (4 steps):                                                │
│  Analyze → Components → Generate → Validate                          │
└──┬──────────┬──────────┬──────────┬──────────┬──────────┬────────────┘
   │          │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼          ▼
analyzer  component-  design-   generator  reviewer  validator
  .ts      library/    agent.ts   .ts        .ts       .ts
           index.ts
(gpt-4o-  (local     (gpt-4o-  (gpt-4o)  (gpt-4o-  (local
  mini)   tag match)   mini)               mini)    regex)
```

---

## Existing Architecture (v1 — Current State)

### Pipeline: 4 Steps

```
analyze (gpt-4o-mini)
  → researchContext (gpt-4o-mini)        [will be REMOVED in v1.1]
  → generateHtml (gpt-4o)
  → validateAndFix (local)
```

### Existing Files (all confirmed present)

| File | Role | Status in v1.1 |
|------|------|----------------|
| `src/lib/ai-pipeline/index.ts` | Orchestrator, 4-step flow | MODIFIED — rewired to 7/4 steps |
| `src/lib/ai-pipeline/analyzer.ts` | gpt-4o-mini intent analysis | UNCHANGED |
| `src/lib/ai-pipeline/researcher.ts` | gpt-4o-mini CSS/DaisyUI lookup | REMOVED or BYPASSED |
| `src/lib/ai-pipeline/generator.ts` | gpt-4o HTML generation | MODIFIED — split system/user, add refineHtml() |
| `src/lib/ai-pipeline/validator.ts` | Local regex fixes | UNCHANGED |
| `src/lib/ai-pipeline/types.ts` | Shared interfaces | MODIFIED — new types added |
| `src/lib/html-prompts.ts` | buildFreshSystemPrompt / buildEditSystemPrompt | MODIFIED — lean rewrite |
| `src/app/api/ai/generate-html/route.ts` | SSE route | MODIFIED — maxDuration 90 → 120 |

### PipelineEvent Type (current)

```typescript
step: "analyze" | "research" | "generate" | "validate" | "complete" | "error"
```

---

## Target Architecture (v1.1 — What Gets Built)

### New Files

| File | Exports | Dependencies |
|------|---------|--------------|
| `src/lib/component-library/types.ts` | `ComponentSnippet` interface | none |
| `src/lib/component-library/index.ts` | `selectComponents(analysis)` | types.ts, all snippets |
| `src/lib/component-library/snippets/heroes.ts` | `HERO_SNIPPETS` array | types.ts |
| `src/lib/component-library/snippets/navbars.ts` | `NAVBAR_SNIPPETS` array | types.ts |
| `src/lib/component-library/snippets/features.ts` | `FEATURES_SNIPPETS` array | types.ts |
| `src/lib/component-library/snippets/cards.ts` | `CARD_SNIPPETS` array | types.ts |
| `src/lib/component-library/snippets/footers.ts` | `FOOTER_SNIPPETS` array | types.ts |
| `src/lib/component-library/snippets/stats.ts` | `STATS_SNIPPETS` array | types.ts |
| `src/lib/component-library/snippets/testimonials.ts` | `TESTIMONIAL_SNIPPETS` array | types.ts |
| `src/lib/ai-pipeline/design-agent.ts` | `designWebsite(analysis, prompt)` | openai, types.ts |
| `src/lib/ai-pipeline/context-builder.ts` | `buildUserMessage(prompt, analysis, design, components)` | types.ts, component-library |
| `src/lib/ai-pipeline/reviewer.ts` | `reviewHtml(html)` | openai, types.ts |

### Modified Files

| File | What Changes |
|------|-------------|
| `src/lib/ai-pipeline/types.ts` | Add `DesignResult`, `ReviewResult`; expand `PipelineEvent.step` |
| `src/lib/html-prompts.ts` | Rewrite `buildFreshSystemPrompt()` lean (~800 tokens); keep `buildEditSystemPrompt()` |
| `src/lib/ai-pipeline/generator.ts` | Replace `buildEnrichedSystemPrompt()` with split messages; add `refineHtml()` |
| `src/lib/ai-pipeline/index.ts` | Rewire to 7-step fresh / 4-step edit; import all new modules |
| `src/app/api/ai/generate-html/route.ts` | `maxDuration: 90` → `120` |
| `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` | Update `STEP_LABELS` map |

### Removed / Bypassed

| File | Disposition |
|------|------------|
| `src/lib/ai-pipeline/researcher.ts` | Step removed from pipeline; file can be deleted or kept as dead code. The `ResearchResult` type in types.ts should also be removed or it will cause confusion. |

---

## Component Responsibilities

| Component | Responsibility | Model | Latency |
|-----------|----------------|-------|---------|
| `analyzer.ts` | Parse prompt → type, sections, features, structured_data | gpt-4o-mini | ~5s |
| `component-library/index.ts` | Tag-match analysis → up to 4 ComponentSnippets | local | ~0s |
| `design-agent.ts` | Decide palette + typography + style preset → DesignResult | gpt-4o-mini | ~5s |
| `context-builder.ts` | Assemble user message: design brief + snippets + CSS patterns + original prompt | local | ~0s |
| `generator.ts` (generateHtml) | Generate full HTML using lean system prompt + rich user message | gpt-4o | ~30s |
| `reviewer.ts` | Score 0-100; identify must_fix[] items | gpt-4o-mini | ~8s |
| `generator.ts` (refineHtml) | Targeted fixes for must_fix items; conditional (score < 75 only) | gpt-4o | ~25s |
| `validator.ts` | Regex-based CSS/JS anti-pattern detection and auto-fix | local | ~0s |

---

## Data Flow

### Fresh Generation Flow (7 Steps)

```
User prompt (string)
    │
    ▼
[1] analyzer.ts — analyzePrompt(prompt)
    → AnalysisResult { type, sections, features, structured_data }
    │
    ▼
[2] component-library/index.ts — selectComponents(analysis)
    → ComponentSnippet[] (max 4, tag-ranked)
    │
    ▼
[3] design-agent.ts — designWebsite(analysis, prompt)
    → DesignResult { primary, secondary, accent, base_bg, heading_font, body_font,
                     style, border_radius, hero_layout }
    │
    ▼
[4] context-builder.ts — buildUserMessage(prompt, analysis, design, components)
    → string (design brief + required sections + CSS patterns + ref snippets + user prompt)
    │
    + html-prompts.ts — buildFreshSystemPrompt()  [~800 tokens, cacheable]
    │
    ▼
[5] generator.ts — generateHtml(userMessage, systemPrompt)
    → rawHtml (string)
    │
    ▼
[6] reviewer.ts — reviewHtml(rawHtml)
    → ReviewResult { score, visual_score, content_score, technical_score,
                     must_fix[], suggestions[] }
    │
    ├── score >= 75 → skip step 6b
    │
    ▼ score < 75
[6b] generator.ts — refineHtml(rawHtml, must_fix[])
    → refinedHtml (string)
    │
    ▼
[7] validator.ts — validateAndFix(html)
    → ValidationResult { html, fixes[], warnings[] }
    │
    ▼
SSE: { step: "complete", html: finalHtml }
    │
    ▼
DB: UPDATE websites SET htmlContent = finalHtml
```

### Edit Mode Flow (4 Steps)

```
User prompt + currentHtml
    │
    ▼
[1] analyzer.ts — analyzePrompt(prompt)
    → AnalysisResult
    │
    ▼
[2] component-library/index.ts — selectComponents(analysis)
    → ComponentSnippet[] (used only for CSS pattern lookup, not design)
    │
    ▼
[3] generator.ts — generateHtml(userMessage, editSystemPrompt, currentHtml)
    where editSystemPrompt = buildEditSystemPrompt(currentHtml)
    → updatedHtml
    │
    ▼
[4] validator.ts — validateAndFix(updatedHtml)
    → ValidationResult
```

### SSE Event Flow

```
route.ts
    │ onEvent(PipelineEvent)
    ▼
ReadableStream.controller.enqueue(TextEncoder("data: {...}\n\n"))
    │
    ▼
client EventSource
    │
    ▼
editor-client.tsx — STEP_LABELS lookup → UI progress display
```

### PipelineEvent Step Values (v1.1)

```typescript
step: "analyze"     // step 1
    | "components"  // step 2 (NEW)
    | "design"      // step 3 (NEW, fresh only)
    | "generate"    // step 4/3
    | "review"      // step 5 (NEW, fresh only)
    | "refine"      // step 6 (NEW, conditional)
    | "validate"    // step 7/4
    | "complete"
    | "error"
```

---

## Recommended Project Structure

```
src/
├── lib/
│   ├── ai-pipeline/
│   │   ├── types.ts              AnalysisResult, DesignResult, ReviewResult,
│   │   │                         ResearchResult (to remove), PipelineEvent
│   │   ├── index.ts              runGenerationPipeline() — orchestrator
│   │   ├── analyzer.ts           analyzePrompt() [UNCHANGED]
│   │   ├── design-agent.ts       designWebsite()  [NEW]
│   │   ├── context-builder.ts    buildUserMessage() [NEW]
│   │   ├── generator.ts          generateHtml() + refineHtml() [MODIFIED]
│   │   ├── reviewer.ts           reviewHtml() [NEW]
│   │   ├── validator.ts          validateAndFix() [UNCHANGED]
│   │   └── researcher.ts         [REMOVE — superseded by component-library + design-agent]
│   ├── component-library/
│   │   ├── types.ts              ComponentSnippet interface
│   │   ├── index.ts              selectComponents()
│   │   └── snippets/
│   │       ├── heroes.ts         6 snippets
│   │       ├── navbars.ts        3 snippets
│   │       ├── features.ts       3 snippets
│   │       ├── cards.ts          4 snippets
│   │       ├── footers.ts        3 snippets
│   │       ├── stats.ts          2 snippets
│   │       └── testimonials.ts   2 snippets
│   └── html-prompts.ts           buildFreshSystemPrompt() lean + buildEditSystemPrompt()
└── app/
    └── api/
        └── ai/
            └── generate-html/
                └── route.ts      maxDuration: 120
```

---

## Architectural Patterns

### Pattern 1: Split System/User Message for OpenAI Prompt Caching

**What:** The invariant rules (CDN allowlist, DaisyUI component reference, CSS anti-patterns, JS rules) go into `system` role. Per-request context (design brief, component snippets, user prompt) goes into `user` role.

**When to use:** Any OpenAI call where part of the context is constant across requests.

**Trade-offs:** Slightly more complex message assembly; gains ~50% latency reduction on the system prompt portion via OpenAI automatic prefix caching.

**Example:**
```typescript
// generator.ts — v1.1 structure
messages: [
  { role: "system", content: buildFreshSystemPrompt() }, // ~800 tokens, cached
  { role: "user",   content: buildUserMessage(...) }     // ~1750 tokens, varies
]
```

### Pattern 2: Conditional Step (Review + Refine)

**What:** Run a cheap reviewer (gpt-4o-mini, ~8s) after generation. Only invoke the expensive refiner (gpt-4o, ~25s) when score < 75. This keeps best-case latency at ~48s while ensuring minimum quality floor.

**When to use:** Any pipeline where generation quality is variable and a fast scoring step can predict when rework is needed.

**Trade-offs:** Adds ~8s to every request (reviewer always runs). Worst case adds ~33s (reviewer + refiner). Threshold 75 is a tunable parameter.

**Example:**
```typescript
const review = await reviewHtml(rawHtml);
const html = review.score < 75
  ? await refineHtml(rawHtml, review.must_fix)
  : rawHtml;
```

### Pattern 3: Local Tag-Match Component Selection

**What:** Component library selection uses zero-LLM tag matching: score each snippet by the count of its tags that overlap with `analysis.sections` and `analysis.features`, return top 4.

**When to use:** When the selection signal is already structured (analyzer already extracted section names and feature names that map directly to component tags).

**Trade-offs:** No semantic understanding — "flashcard" in features won't match a snippet tagged "flip-card" unless tags are carefully maintained. Tag vocabulary must be kept in sync between analyzer prompts and snippet tag arrays.

### Pattern 4: Fresh vs Edit Mode Branching in Orchestrator

**What:** `index.ts` reads `currentHtml` to branch between 7-step (fresh) and 4-step (edit) flows. Design, Review, and Refine steps are skipped for edits — user is satisfied with existing style.

**When to use:** Any pipeline with two fundamentally different cost/quality trade-offs depending on whether prior state exists.

---

## Integration Points

### New Components → Existing Pipeline (Critical Connections)

| New Component | Consumes | Produces | Consumed By |
|---------------|----------|----------|-------------|
| `component-library/index.ts` | `AnalysisResult` (from analyzer) | `ComponentSnippet[]` | `context-builder.ts` |
| `design-agent.ts` | `AnalysisResult`, original prompt | `DesignResult` | `context-builder.ts` |
| `context-builder.ts` | prompt + `AnalysisResult` + `DesignResult` + `ComponentSnippet[]` | user message string | `generator.ts` |
| `reviewer.ts` | generated HTML string | `ReviewResult` | `index.ts` (branching logic) |
| `generator.ts` refineHtml | HTML + `must_fix[]` from ReviewResult | refined HTML string | `index.ts` |

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| OpenAI gpt-4o-mini | Direct SDK call, AbortSignal.timeout(20000) | Used by: analyzer, design-agent, reviewer |
| OpenAI gpt-4o | Direct SDK call, AbortSignal.timeout(60000) | Used by: generator (generate + refine); consider 60s per call — two calls in sequence = 120s possible |
| Google Fonts | `<link>` tag injected in generated HTML `<head>` | Font names come from DesignResult; no server-side call |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `index.ts` ↔ all pipeline modules | Direct function calls, async/await | All modules export pure async functions |
| `context-builder.ts` ↔ `component-library` | Direct import of `selectComponents` | context-builder may call it internally OR index.ts calls both and passes results |
| `route.ts` ↔ `index.ts` | `runGenerationPipeline(prompt, currentHtml, onEvent)` | Signature unchanged; SSE emission via onEvent callback |
| `editor-client.tsx` ↔ SSE | EventSource / fetch streaming | STEP_LABELS map must be extended with new step names |

---

## Build Order (Suggested)

Dependencies determine order. Each plan can be a separate milestone task.

### Plan 09-01: Component Library (no LLM, no blockers)

Build first — it has zero dependencies on new types and produces the `ComponentSnippet` type that design-agent and context-builder will consume.

```
1. src/lib/component-library/types.ts         ComponentSnippet interface
2. src/lib/component-library/snippets/*.ts     All 7 snippet files (~25 snippets)
3. src/lib/component-library/index.ts          selectComponents() + CATEGORY_PRIORITY
```

Verification: unit test selectComponents() with mock AnalysisResult objects. No API calls needed.

### Plan 09-02: Types + Design Agent + Context Builder

Depends on 09-01 (needs ComponentSnippet). Extends types.ts with new interfaces before wiring.

```
4. src/lib/ai-pipeline/types.ts               Add DesignResult, ReviewResult; extend PipelineEvent.step
5. src/lib/ai-pipeline/design-agent.ts         designWebsite()
6. src/lib/ai-pipeline/context-builder.ts      buildUserMessage()
7. src/lib/html-prompts.ts                     Rewrite buildFreshSystemPrompt() lean (~800 tokens)
8. src/lib/ai-pipeline/generator.ts            Split system/user message; add refineHtml()
```

Verification: call designWebsite() in isolation with a test prompt. Inspect user message output from buildUserMessage(). Generator still callable standalone.

### Plan 09-03: Reviewer + Pipeline Rewire + UI Update

Depends on 09-02. This is the final wiring step.

```
9.  src/lib/ai-pipeline/reviewer.ts            reviewHtml()
10. src/lib/ai-pipeline/index.ts               7-step fresh / 4-step edit orchestrator
11. src/app/api/ai/generate-html/route.ts       maxDuration: 90 → 120
12. editor-client.tsx                           New STEP_LABELS entries
```

Verification: end-to-end SSE test. Confirm 7 steps appear for fresh, 4 steps for edit. Check review score in logs and confirm refine fires only when score < 75.

---

## Anti-Patterns

### Anti-Pattern 1: Injecting ResearchResult Into the New Pipeline

**What people do:** Keep `researcher.ts` in the pipeline alongside the new design-agent and context-builder, thinking the CSS patterns it produces are still useful.

**Why it's wrong:** The context-builder now handles CSS patterns (from analysis.features), design brief, and component snippets directly. Adding ResearchResult back creates duplicate context in the user message (+400 tokens), confuses model attention, and wastes ~5s for a gpt-4o-mini call that is no longer the right abstraction.

**Do this instead:** Remove `researcher.ts` from the pipeline in `index.ts`. If CSS pattern lookups are still needed, handle them in context-builder as a local lookup (no LLM), keyed on `analysis.features`.

### Anti-Pattern 2: Embedding DesignResult as CSS in System Prompt

**What people do:** Inject the design brief (palette, fonts) into `buildFreshSystemPrompt()` so it appears in the `system` role message.

**Why it's wrong:** The system prompt must be invariant across requests for OpenAI prefix caching to work. Any per-request data in system prompt defeats caching entirely.

**Do this instead:** Always put DesignResult-derived content in the `user` role message via `buildUserMessage()`. System prompt contains only rules that never change.

### Anti-Pattern 3: Running refineHtml Unconditionally

**What people do:** Always run refine after generate to "ensure quality", skipping the reviewer step.

**Why it's wrong:** Unconditional refine adds ~25s to every request (gpt-4o at ~25s). Most outputs score >= 75 and don't need refinement. Blind refinement also risks introducing regressions when the original output was already correct.

**Do this instead:** Always run reviewer first (8s). Only invoke refineHtml() when `review.score < 75`. The reviewer's `must_fix[]` array also makes the refine prompt more targeted than a generic "improve this" instruction.

### Anti-Pattern 4: Misaligned Tag Vocabulary Between Analyzer and Snippets

**What people do:** Add new snippet files with tags like `"flip-card"` but the analyzer prompt produces features like `"flip-animation"`. The tag matcher finds no overlap and injects no relevant snippets.

**Why it's wrong:** selectComponents() uses string overlap matching (`f.includes(t) || t.includes(f)`). If analyzer and snippet tags use different terms for the same concept, matching silently fails and the model gets no relevant reference.

**Do this instead:** Maintain a shared vocabulary. When adding a new snippet, check what terms the analyzer currently emits for that feature. When updating the analyzer system prompt, audit snippet tags for breakage.

---

## Scaling Considerations

This is a per-user, per-request AI pipeline. The bottleneck is OpenAI API call latency and Vercel function duration, not database or compute scale.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Current approach is fine. Single Vercel function, 120s maxDuration. |
| 1k-10k users | OpenAI rate limits become relevant. Add retry logic with exponential backoff. Consider request queuing for burst traffic. |
| 10k+ users | Vercel maxDuration may cause cold-start issues. Consider splitting pipeline into smaller functions with intermediate state. Streaming can be handed off to a persistent compute layer (e.g., Railway or Fly.io worker). |

### Current Timeout Budget

| Mode | Best case | Worst case | maxDuration |
|------|-----------|------------|-------------|
| Fresh (no refine) | ~48s | — | 120s |
| Fresh (with refine) | — | ~73s | 120s |
| Edit | ~35s | — | 120s |

The 120s maxDuration gives ~47s headroom in worst case. This is adequate but not generous. If OpenAI latency spikes (common during peak hours), a refine call could push the total over 90s — which is exactly why the bump from 90 to 120 is necessary.

---

## Sources

- Direct reading: `src/lib/ai-pipeline/*.ts` (all files, current codebase)
- Direct reading: `src/lib/html-prompts.ts`
- Direct reading: `src/app/api/ai/generate-html/route.ts`
- Direct reading: `docs/phase-09-enhanced-ai-pipeline.md` (full spec, HIGH confidence)
- Direct reading: `.planning/PROJECT.md`

---

*Architecture research for: Enhanced AI Pipeline v1.1 — Website Generator*
*Researched: 2026-03-19*
