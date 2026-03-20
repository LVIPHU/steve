# Phase 11: Reviewer + Pipeline Rewire + UI Update - Research

**Researched:** 2026-03-20
**Domain:** AI pipeline orchestration, OpenAI structured outputs, SSE streaming, TypeScript cleanup
**Confidence:** HIGH

## Summary

Phase 11 is an integration phase that completes the v1.1 pipeline. All building blocks are already implemented in Phases 9-10; this phase wires them together into a working 7-step (fresh) / 4-step (edit) orchestrator. The two new modules to create are `reviewer.ts` (gpt-4o-mini + Zod scoring) and the implementation of the `refineHtml()` stub in `context-builder.ts`. The orchestrator in `index.ts` then gets rewired to call all steps in the correct order with proper SSE events.

Every pattern needed already exists in the codebase. `design-agent.ts` is the canonical template for `reviewer.ts` — lazy OpenAI init, `zodResponseFormat`, `AbortSignal.timeout()`, graceful fallback on error. The `refineHtml()` implementation follows the same pattern as `generateHtml()` in `generator.ts` (gpt-4o, 60s timeout, full HTML output). The generator migration (removing `buildEnrichedSystemPrompt`, changing signature) is the riskiest change because it touches the live API route.

A critical constraint is Vercel Hobby plan (60s max per function). The `maxDuration = 90` currently set in the API route already exceeds this limit. The decision is to default `ENABLE_REFINE=false` on Hobby, keeping pipeline at 5 steps (fresh) or 4 steps (edit) — well within 60s. Calibration (PIPE-20) is a manual task: run 10+ prompts, inspect `.calibration.jsonl`, validate threshold 75.

**Primary recommendation:** Implement in dependency order — reviewer.ts (isolated), then refineHtml() (uses buildSystemPrompt), then generator.ts migration (signature change), then index.ts rewire (uses all new modules), then STEP_LABELS update, then researcher.ts deletion and typecheck.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Reviewer — Scoring Rubrics**
- Visual (40 points): Focus on color contrast, palette consistency, font hierarchy, layout not broken. Check CSS custom properties present, Google Fonts @import correct format, no hardcoded colors conflicting with palette.
- Content (30 points): Reviewer receives both original prompt AND HTML to detect intent compliance. Example: user requested quiz/flashcard but HTML lacks it.
- Technical (30 points): Based on anti-patterns in system prompt. No `alert()`, no Alpine `x-for`, localStorage uses `appgen-` prefix, CDN links present, JavaScript not broken.
- must_fix[] scope: Reviewer judges any quality issue that materially breaks functionality or clearly violates user intent. Layout issues, color issues, content gaps all eligible.
- Refine loop: 1 pass only — no re-review after refine. Predictable latency.

**refineHtml() Implementation**
- Model: `gpt-4o`
- System prompt: Same lean invariant `buildSystemPrompt()` from `html-prompts.ts`
- User message format: `Fix the following issues in the HTML:\n\n[must_fix as numbered list]\n\nCurrent HTML:\n[full HTML]`
- No re-inject of component snippets, design brief, or original user prompt
- Output: Full HTML (not diff)
- Timeout: 60s
- Trigger logic: Fire when `score < REVIEW_THRESHOLD` OR `must_fix.length > 0`

**Calibration Approach**
- Log format: Append-only `.calibration.jsonl` at root, gitignored
- Entry fields: `{timestamp, prompt, score, visual, content, technical, must_fix_count, triggered_refine}`
- When to log: reviewer.ts always appends after every review call (dev + prod)
- Calibration task included in Phase 11 plan: test 10+ prompts, check distribution, verify threshold 75, adjust REVIEW_THRESHOLD env var if needed

**Hobby Plan + Vercel Timeout**
- Hobby plan max: 60s function timeout
- ENABLE_REFINE=false (default on Hobby): UI hides review + refine steps entirely. Pipeline runs 5 steps: analyze → components → design → generate → validate
- STEP_LABELS: only show steps for current mode + ENABLE_REFINE setting
- maxDuration: verify plan tier BEFORE increasing. Hobby: keep at 60s or lower. Do NOT set 120s (Hobby does not support)
- ENABLE_REFINE default: false (Hobby-safe). User can set true when upgrading to Pro

**generator.ts Migration**
- `buildEnrichedSystemPrompt()` deleted, replaced by `buildSystemPrompt()` (system) + `buildUserMessage()` / `buildEditUserMessage()` (user) from context-builder
- Generator new signature: `generateHtml(userMessage: string, currentHtml?: string): Promise<string>`
- Orchestrator is responsible for calling `buildUserMessage()` / `buildEditUserMessage()` and passing the result into generator

**researcher.ts Cleanup**
- Delete `src/lib/ai-pipeline/researcher.ts` completely
- Remove all imports of `researchContext` and `ResearchResult`
- Delete `ResearchResult` interface from `types.ts`
- `npm run typecheck` must pass clean after deletion (PIPE-19)

### Claude's Discretion
- Exact wording of rubric in reviewer prompt
- Exact format of `.calibration.jsonl` entries
- Internal structure of reviewer Zod schema (field ordering, descriptions)
- How to extract and score each dimension from HTML (regex, parsing strategy)

### Deferred Ideas (OUT OF SCOPE)
- User-visible style selector (override preset)
- Design Agent in edit mode (extract colors from existing HTML)
- Re-review after refine (2-pass loop)
- Reviewer score displayed in UI
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PIPE-10 | Reviewer (gpt-4o-mini) scores HTML 0-100 across 3 dimensions: visual (40), content (30), technical (30) | `design-agent.ts` is the exact template. `ReviewResult` interface already defined in `types.ts` lines 34-41. |
| PIPE-11 | Refine pass (gpt-4o) fires only when score < threshold OR must_fix[] non-empty | `refineHtml()` stub exists in `context-builder.ts` with correct signature. Trigger condition is an `if` check in orchestrator. |
| PIPE-12 | Refine uses separate message builder (no component snippet re-injection) | `refineHtml()` builds its own user message inline — does NOT call `buildUserMessage()`. Simple template with must_fix list + current HTML. |
| PIPE-13 | `REVIEW_THRESHOLD` env var controls threshold (default 75) | `parseInt(process.env.REVIEW_THRESHOLD ?? "75", 10)` — read inside function, not at module level. |
| PIPE-14 | Fresh mode runs exactly 7 steps: analyze → components → design → generate → review → refine (conditional) → validate | All step functions exist. Orchestrator `index.ts` needs full rewire. |
| PIPE-15 | Edit mode runs exactly 4 steps: analyze → components → generate → validate | Determined by `currentHtml` presence. Branch in orchestrator. `selectComponents()` from Phase 9 is already callable. |
| PIPE-16 | `PipelineEvent.step` union type extended with `"components"`, `"design"`, `"review"`, `"refine"` | `types.ts` line 44: current union includes `"research"` (to remove) and `"design"` (already present). Add `"components"`, `"review"`, `"refine"`. |
| PIPE-17 | `STEP_LABELS` in editor-client.tsx updated with Vietnamese labels for all 7 steps | UI-SPEC.md has exact label text. Remove `research` key, add `components`, `design`, `review`, `refine` keys. STEP_LABELS is at line 149 in editor-client.tsx. |
| PIPE-18 | Verify Vercel plan tier before increasing maxDuration — Hobby: disable refine or gate with ENABLE_REFINE | `maxDuration = 90` in route.ts already exceeds Hobby 60s limit. Must be corrected to 60. |
| PIPE-19 | `researcher.ts` deleted from pipeline, all imports removed | `index.ts` imports `researchContext` from `./researcher`. `generator.ts` imports `ResearchResult` from `./types`. Both must be cleaned before deletion. |
| PIPE-20 | Calibration pass: 10+ websites, verify score distribution, validate threshold 75 before shipping | Manual task. reviewer.ts appends to `.calibration.jsonl` after every call. `.gitignore` entry needed. |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| openai | ^6.32.0 | AI completions + structured output | Already installed, used across all pipeline modules |
| zod | ^3.25.76 | Schema definition for structured output | Pinned to ^3 — v4 breaks `zodResponseFormat` helper (STATE.md [10-01]) |
| zodResponseFormat | from openai/helpers/zod | Enforce JSON schema on gpt-4o-mini response | Established pattern from design-agent.ts |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| AbortSignal.timeout() | Node built-in | Per-call timeout enforcement | All AI calls — established pattern across all pipeline modules |
| fs (Node built-in) | Node built-in | Append-only calibration log write | reviewer.ts only, dev + prod |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| zodResponseFormat | Manual JSON.parse + validate | zodResponseFormat gives type-safe `parsed` field and handles refusals; manual parse requires extra error handling |
| Full HTML output for refine | Diff/patch | GPT-4o reliably returns complete documents; diff parsing adds fragility |
| gpt-4o for reviewer | gpt-4o-mini | gpt-4o-mini is sufficient for scoring; faster and cheaper |

**Installation:** No new packages needed. All dependencies already present.

---

## Architecture Patterns

### Module Responsibilities After Phase 11

```
src/lib/ai-pipeline/
├── index.ts           # Orchestrator — 7-step fresh / 5-step hobby / 4-step edit
├── analyzer.ts        # Step 1: analyze (unchanged)
├── design-agent.ts    # Step 3: design (unchanged)
├── generator.ts       # Step 4: generate (signature migrated, buildEnrichedSystemPrompt removed)
├── reviewer.ts        # Step 5: review (NEW — mirrors design-agent.ts)
├── context-builder.ts # buildUserMessage, buildEditUserMessage, refineHtml (implemented)
├── validator.ts       # Final step: validate (unchanged)
└── types.ts           # PipelineEvent extended, ResearchResult deleted
# researcher.ts        # DELETED
```

### Pattern 1: reviewer.ts (mirrors design-agent.ts exactly)

**What:** gpt-4o-mini + zodResponseFormat returns structured ReviewResult; appends to calibration log
**When to use:** Always in fresh 7-step mode (ENABLE_REFINE=true)
**Source template:** `src/lib/ai-pipeline/design-agent.ts`

```typescript
// Lazy OpenAI init — critical: do NOT use module-level new OpenAI()
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

export const ReviewResultSchema = z.object({
  score: z.number().min(0).max(100),
  visual: z.number().min(0).max(40),
  content: z.number().min(0).max(30),
  technical: z.number().min(0).max(30),
  must_fix: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export const FALLBACK_REVIEW: ReviewResult = {
  score: 100, visual: 40, content: 30, technical: 30,
  must_fix: [], suggestions: [],
};

export async function reviewHtml(prompt: string, html: string): Promise<ReviewResult> {
  try {
    const completion = await getOpenAI().chat.completions.parse(
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: REVIEWER_SYSTEM_PROMPT },
          { role: "user", content: `User prompt:\n${prompt}\n\nHTML to review:\n${html}` },
        ],
        response_format: zodResponseFormat(ReviewResultSchema, "review_result"),
      },
      { signal: AbortSignal.timeout(20000) }
    );
    const result = completion.choices[0].message.parsed ?? FALLBACK_REVIEW;
    appendCalibrationLog(prompt, result);
    return result;
  } catch {
    return FALLBACK_REVIEW;
  }
}
```

### Pattern 2: Orchestrator Branch Logic in index.ts

**What:** Detects fresh vs edit mode, reads env vars, routes to correct step sequence
**When to use:** Replace current 4-step body of runGenerationPipeline()

```typescript
const isEditMode = !!currentHtml;  // empty string = fresh mode
const enableRefine = process.env.ENABLE_REFINE === "true";
const reviewThreshold = parseInt(process.env.REVIEW_THRESHOLD ?? "75", 10);

if (isEditMode) {
  // 4 steps: analyze → components → generate → validate
} else if (!enableRefine) {
  // 5 steps: analyze → components → design → generate → validate
} else {
  // 7 steps: analyze → components → design → generate → review → refine (conditional) → validate
}
```

### Pattern 3: refineHtml() Implementation

**What:** gpt-4o with must_fix list user message; no component re-injection
**Location:** Implement the existing stub in `context-builder.ts`
**Requires:** Add lazy OpenAI init to context-builder.ts (currently has no OpenAI dependency)

```typescript
export async function refineHtml(html: string, reviewResult: ReviewResult): Promise<string> {
  const mustFixList = reviewResult.must_fix
    .map((issue, i) => `${i + 1}. ${issue}`)
    .join("\n");
  const userMessage = `Fix the following issues in the HTML:\n\n${mustFixList}\n\nCurrent HTML:\n${html}`;

  const completion = await getOpenAI().chat.completions.create(
    {
      model: "gpt-4o",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: userMessage },
      ],
    },
    { signal: AbortSignal.timeout(60000) }
  );
  return stripMarkdownFences(completion.choices[0].message.content ?? html);
}
```

### Pattern 4: generator.ts Migration

**What:** Remove ResearchResult and buildEnrichedSystemPrompt; new signature accepts pre-built user message
**Current signature:** `generateHtml(prompt, analysis, research, currentHtml?)`
**New signature:** `generateHtml(userMessage: string): Promise<string>`

In the new architecture the orchestrator builds the user message via `buildUserMessage()` (fresh) or `buildEditUserMessage()` (edit) and passes it to generateHtml. The generator only needs `buildSystemPrompt()` as the system prompt for both modes. Remove imports of `buildFreshSystemPrompt`, `buildEditSystemPrompt`, `AnalysisResult`, `ResearchResult`.

Also fix the module-level `const openai = new OpenAI()` — migrate to lazy `getOpenAI()` pattern.

### Anti-Patterns to Avoid

- **Module-level `new OpenAI()`:** `generator.ts` currently has `const openai = new OpenAI()` at module level — this must be replaced with lazy `getOpenAI()` during the migration. Tests that import generator.ts will fail otherwise.
- **Reading env vars at module level:** `process.env.ENABLE_REFINE` and `process.env.REVIEW_THRESHOLD` must be read inside the orchestrator function body, not at import time, to allow test isolation.
- **Re-injecting snippets in refineHtml:** PIPE-12 explicitly forbids this. Only must_fix list + current HTML in the refine user message.
- **Setting maxDuration above 60 on Hobby:** Current `maxDuration = 90` is incorrect for Hobby plan. Correction is required.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Structured JSON from gpt-4o-mini | Custom JSON.parse + schema check | `zodResponseFormat` from openai/helpers/zod | Type-safe, handles refusals, consistent with design-agent.ts pattern |
| HTTP timeout | Promise.race with setTimeout | `AbortSignal.timeout(ms)` | Established pattern in all 3 existing AI modules |
| Calibration log serialization | Custom binary or CSV format | `JSON.stringify(entry) + "\n"` appended to `.jsonl` | Standard newline-delimited JSON, easy to grep and parse |

**Key insight:** reviewer.ts is design-agent.ts with a different system prompt and schema. Do not invent new patterns — copy the template.

---

## Common Pitfalls

### Pitfall 1: maxDuration Exceeds Hobby Plan Limit
**What goes wrong:** `maxDuration = 90` in `route.ts` exceeds Hobby's 60s hard limit. Vercel silently truncates at 60s — pipeline appears to hang or fail with no clear client error.
**Why it happens:** Developer set 90 hoping it would work; Hobby plan ignores values above 60.
**How to avoid:** Set `maxDuration = 60`. With `ENABLE_REFINE=false` (Hobby default), the 5-step pipeline runs well within 60s.
**Warning signs:** Generation stops at the ~60s mark, `complete` SSE event never received by client.

### Pitfall 2: Missing Lazy OpenAI Init in context-builder.ts
**What goes wrong:** `context-builder.ts` currently has no OpenAI dependency. If `refineHtml()` is implemented with `new OpenAI()` at module level, all tests importing `buildUserMessage` or `buildEditUserMessage` will fail with "OPENAI_API_KEY required" even when they don't call refineHtml.
**Why it happens:** Module-level side effects execute at import time.
**How to avoid:** Use lazy `getOpenAI()` pattern (same as design-agent.ts). STATE.md decision [10-01] documents this requirement.
**Warning signs:** `npm run test` fails with API key errors on context-builder.test.ts after refineHtml is implemented.

### Pitfall 3: TypeScript Errors After researcher.ts Deletion
**What goes wrong:** Deleting `researcher.ts` and `ResearchResult` from `types.ts` without updating consumers causes `npm run typecheck` to fail.
**Why it happens:** `index.ts` imports `researchContext`; `generator.ts` imports `ResearchResult` — both must be updated before deletion.
**How to avoid:** Migrate generator.ts signature first, update index.ts, then delete researcher.ts and ResearchResult, then run typecheck.
**Warning signs:** TypeScript errors about missing `researchContext` or `ResearchResult`.

### Pitfall 4: Edit Mode Emitting Review/Refine SSE Steps
**What goes wrong:** If branch logic is wrong, edit mode emits "review" or "refine" SSE events that have STEP_LABELS keys but should not appear. Or fresh hobby mode emits them.
**Why it happens:** Incorrect condition for isEditMode (falsy check on empty string vs undefined).
**How to avoid:** Use `!!currentHtml` (both undefined and empty string treated as fresh mode). The SSE handler in editor-client.tsx silently ignores steps not in STEP_LABELS, but emitting them wastes tokens.
**Warning signs:** Chat panel shows unexpected step bubbles for edit operations.

### Pitfall 5: FALLBACK_REVIEW With Low Score Triggers Infinite Refine
**What goes wrong:** If FALLBACK_REVIEW has score=0, then on any reviewer error the orchestrator would trigger refine (score < 75).
**Why it happens:** Fallback object designed for error recovery, not for triggering refine.
**How to avoid:** Set `FALLBACK_REVIEW.score = 100` and `must_fix = []` — reviewer failure means "assume OK, skip refine." This is the correct conservative behavior on error (same philosophy as design-agent's FALLBACK_DESIGN).
**Warning signs:** Refine step always triggers even on valid HTML, adding latency every generation.

### Pitfall 6: context-builder.test.ts Expects refineHtml to Throw
**What goes wrong:** The existing test at line 117-121 of `context-builder.test.ts` asserts `refineHtml()` throws "Not implemented". Once the real implementation replaces the stub, this test breaks.
**Why it happens:** The test was written for the stub behavior.
**How to avoid:** Update the existing test — replace the "throws Not implemented" assertion with a format test (verify user message does not contain "## Component References", verify it contains "Fix the following issues").
**Warning signs:** `npm run test` fails on context-builder.test.ts after implementing refineHtml.

---

## Code Examples

Verified patterns from existing codebase:

### Lazy OpenAI Init Pattern (design-agent.ts lines 6-9)
```typescript
// Source: src/lib/ai-pipeline/design-agent.ts
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}
```

### zodResponseFormat Pattern (design-agent.ts lines 47-58)
```typescript
// Source: src/lib/ai-pipeline/design-agent.ts
const completion = await getOpenAI().chat.completions.parse(
  {
    model: "gpt-4o-mini",
    messages: [...],
    response_format: zodResponseFormat(DesignResultSchema, "design_result"),
  },
  { signal: AbortSignal.timeout(20000) }
);
return completion.choices[0].message.parsed ?? FALLBACK_DESIGN;
```

### PipelineEvent SSE Emission Pattern (index.ts)
```typescript
// Source: src/lib/ai-pipeline/index.ts
onEvent({ step: "analyze", status: "start" });
const analysis = await analyzePrompt(prompt);
onEvent({ step: "analyze", status: "done", detail: `...` });
```

### Current STEP_LABELS (editor-client.tsx line 149 — target for update)
```typescript
// Source: src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx
const STEP_LABELS: Record<string, string> = {
  analyze: "Phân tích yêu cầu...",
  research: "Tìm CSS patterns & components...",  // REMOVE
  generate: "Đang tạo HTML...",
  validate: "Kiểm tra kết quả...",
};
```

### Target STEP_LABELS (from 11-UI-SPEC.md — authoritative)
```typescript
// Source: .planning/phases/11-reviewer-pipeline-rewire-ui-update/11-UI-SPEC.md
const STEP_LABELS: Record<string, string> = {
  analyze:    "Phân tích yêu cầu...",
  components: "Chọn components phù hợp...",
  design:     "Thiết kế visual identity...",
  generate:   "Đang tạo HTML...",
  review:     "Kiểm tra chất lượng...",
  refine:     "Tinh chỉnh kết quả...",
  validate:   "Kiểm tra kết quả...",
};
// With ENABLE_REFINE=false, the pipeline never emits "review" or "refine" events
// so those keys in STEP_LABELS are harmlessly inert — no conditional needed
```

### ReviewResult Interface (already in types.ts — do not recreate)
```typescript
// Source: src/lib/ai-pipeline/types.ts lines 34-41
export interface ReviewResult {
  score: number;
  visual: number;
  content: number;
  technical: number;
  must_fix: string[];
  suggestions: string[];
}
```

### PipelineEvent Union (types.ts line 44 — current, needs update)
```typescript
// Current:
step: "analyze" | "research" | "design" | "generate" | "validate" | "complete" | "error"
// Target:
step: "analyze" | "components" | "design" | "generate" | "review" | "refine" | "validate" | "complete" | "error"
// (removed "research", added "components", "review", "refine")
```

### maxDuration Correction (route.ts line 8)
```typescript
// Current (WRONG for Hobby):
export const maxDuration = 90;
// Corrected:
export const maxDuration = 60; // Hobby plan limit; set to 120 when upgrading to Pro
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| researcher.ts LLM call (~5-10s) | selectComponents() tag-matching (~0ms) | Phase 9 | 1 fewer LLM call per pipeline run |
| buildEnrichedSystemPrompt() merges all context into system | buildSystemPrompt() lean invariant + buildUserMessage() for context | Phase 10 | Enables OpenAI prompt caching (75% cost reduction on cached tokens per STATE.md [10-02]) |
| Module-level `new OpenAI()` in generator.ts | Lazy `getOpenAI()` wrapper (target for Phase 11 migration) | Phase 10 (design-agent.ts introduced the pattern) | Tests work without OPENAI_API_KEY |
| 4-step pipeline | 7-step fresh / 5-step hobby / 4-step edit | Phase 11 | Adds design consistency + quality gate |

**Deprecated/outdated — will be removed in Phase 11:**
- `buildFreshSystemPrompt` alias in html-prompts.ts: backward-compat for generator.ts, remove after migration
- `buildEditSystemPrompt()` in html-prompts.ts: backward-compat wrapper, remove after migration
- `ResearchResult` interface in types.ts: delete after researcher.ts cleanup
- `researcher.ts` file: delete entirely (PIPE-19)

---

## Open Questions

1. **Should STEP_LABELS conditionally omit review/refine keys when ENABLE_REFINE=false?**
   - What we know: STEP_LABELS is a plain object in the component body. The SSE handler renders a bubble only when `STEP_LABELS[event.step]` exists AND the step is emitted.
   - What's unclear: Whether to build the map conditionally (requires surfacing a server env var to the client) or always include all 7 keys.
   - Recommendation: Always include all 7 keys. With ENABLE_REFINE=false, the pipeline never emits "review" or "refine" SSE events — so those STEP_LABELS keys are inert. No client-side env var plumbing needed. Simpler.

2. **Is the `currentHtml` parameter needed on the new generateHtml() signature?**
   - What we know: CONTEXT.md defines new signature as `generateHtml(userMessage: string, currentHtml?: string): Promise<string>`. The orchestrator builds the user message (edit message already encodes "preserve colors"). In the new architecture, currentHtml in the system prompt is no longer used.
   - Recommendation: Drop `currentHtml` from the new signature entirely — it's not used in the new pattern. The signature becomes `generateHtml(userMessage: string): Promise<string>`. If future needs arise, it can be added back.

3. **maxDuration: set to 60 explicitly or remove the export?**
   - What we know: Next.js default without the export is also 60s on Hobby. Current export is 90 (wrong).
   - Recommendation: Explicitly set `export const maxDuration = 60` with a comment noting "Pro plan: change to 120". Visible intent, easy to update later.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (in devDependencies) |
| Config file | `vitest.config.ts` at root |
| Quick run command | `npm run test` |
| Full suite command | `npm run test && npm run typecheck` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PIPE-10 | ReviewResultSchema validates correct score object | unit | `npm run test` | No — Wave 0 |
| PIPE-10 | FALLBACK_REVIEW has score=100 and empty must_fix | unit | `npm run test` | No — Wave 0 |
| PIPE-11 | refineHtml() resolves to string (not throws) | unit | `npm run test` | Partial — existing test asserts throw; update needed |
| PIPE-12 | refineHtml() user message does NOT contain "## Component References" | unit | `npm run test` | No — Wave 0 addition to context-builder.test.ts |
| PIPE-13 | REVIEW_THRESHOLD defaults to 75 when env var absent | unit | `npm run test` | No — Wave 0 |
| PIPE-16 | PipelineEvent type compiles with new step values | typecheck | `npm run typecheck` | Manual |
| PIPE-19 | npm run typecheck passes after researcher.ts deletion | typecheck | `npm run typecheck` | Manual |

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test && npm run typecheck`
- **Phase gate:** Full suite green + typecheck clean before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/ai-pipeline/reviewer.test.ts` — covers PIPE-10: ReviewResultSchema validation (valid object, invalid score range), FALLBACK_REVIEW structure (score=100, must_fix=[]), REVIEW_THRESHOLD default behavior
- [ ] Update `src/lib/ai-pipeline/context-builder.test.ts` — replace "throws Not implemented" test with: refineHtml resolves to string; user message contains "Fix the following issues"; does not contain "## Component References" (covers PIPE-11, PIPE-12)

*(PIPE-13/14/15/18/19/20 are covered by typecheck, manual calibration, or implicit integration behavior — no dedicated unit tests needed.)*

---

## Sources

### Primary (HIGH confidence)
- `src/lib/ai-pipeline/index.ts` — current 4-step orchestrator; target for full rewire
- `src/lib/ai-pipeline/types.ts` — PipelineEvent union (line 44), ReviewResult (lines 34-41), ResearchResult (lines 8-12, to delete)
- `src/lib/ai-pipeline/design-agent.ts` — canonical template for reviewer.ts
- `src/lib/ai-pipeline/context-builder.ts` — refineHtml stub (line 48-50), buildUserMessage/buildEditUserMessage
- `src/lib/ai-pipeline/generator.ts` — current signature and module-level OpenAI init (both to migrate)
- `src/lib/ai-pipeline/researcher.ts` — confirmed exists, confirmed to delete in PIPE-19
- `src/lib/html-prompts.ts` — buildSystemPrompt() lean invariant (line 1), backward-compat aliases (lines 55-71)
- `src/app/api/ai/generate-html/route.ts` — maxDuration = 90 (line 8, must correct to 60)
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` — STEP_LABELS at line 149, SSE handler at lines 238-244
- `.planning/phases/11-reviewer-pipeline-rewire-ui-update/11-CONTEXT.md` — all locked decisions
- `.planning/phases/11-reviewer-pipeline-rewire-ui-update/11-UI-SPEC.md` — exact Vietnamese label text per step

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — key decisions [10-01] lazy init requirement, [10-02] zero-param buildSystemPrompt
- `src/lib/component-library/index.ts` — selectComponents() API for orchestrator Step 2 (components)
- `src/lib/ai-pipeline/context-builder.test.ts` — existing test for refineHtml stub (needs update in Wave 0)

### Tertiary (LOW confidence)
- Vercel Hobby plan 60s timeout limit — stated in STATE.md and CONTEXT.md; not independently verified against Vercel docs in this session but consistent across all project documents

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries installed and in active use
- Architecture: HIGH — all patterns sourced directly from codebase inspection
- Pitfalls: HIGH — sourced from actual code (module-level `const openai = new OpenAI()` in generator.ts is a confirmed current issue; existing test for refineHtml will break on implementation is a confirmed current test state)
- UI labels: HIGH — exact copy from 11-UI-SPEC.md which has been approved

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable internal project — no external dependency changes expected)
