# Phase 11: Reviewer + Pipeline Rewire + UI Update - Research

**Researched:** 2026-03-20
**Domain:** AI pipeline orchestration, quality gate pattern, SSE streaming, TypeScript cleanup
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Reviewer — Scoring Rubrics**
- Visual (40 pts): CSS custom properties present, Google Fonts @import correct format, no hardcoded conflicting colors. Focus on what user sees immediately: color contrast, consistent palette, font hierarchy, no broken layout.
- Content (30 pts): Reviewer receives BOTH original prompt AND HTML to detect intent-vs-output gaps (e.g. user asked for quiz but HTML has no quiz).
- Technical (30 pts): No `alert()`, no Alpine `x-for`, localStorage uses `appgen-` prefix, CDN links present, no broken JS (null refs, syntax errors).
- `must_fix[]` scope: any quality issue that materially breaks functionality or clearly violates user intent. Layout issues, color issues, content gaps all eligible if reviewer judges them material.
- Refine loop: 1 pass only — no re-review after refine. Predictable latency, Vercel-safe.

**refineHtml() Implementation**
- Model: `gpt-4o` (same as generator)
- System prompt: reuse `buildSystemPrompt()` from `html-prompts.ts` — no refine-specific system prompt
- User message format: numbered must_fix list + full current HTML. No component snippets re-injected. No design brief. No original user prompt.
- Output: full HTML (not diff)
- Timeout: 60s
- Trigger: `score < REVIEW_THRESHOLD` OR `must_fix.length > 0`

**Calibration**
- Log file: `.calibration.jsonl` at repo root, gitignored, append-only
- Entry fields: `{timestamp, prompt, score, visual, content, technical, must_fix_count, triggered_refine}`
- Always log: every review call in dev + production
- Task in plan: test ≥10 prompts, verify threshold 75 is sane, adjust `REVIEW_THRESHOLD` env var if needed

**Hobby Plan + Vercel Timeout**
- Hobby plan: 60s hard limit
- `ENABLE_REFINE=false` (default): UI shows only steps for the active pipeline; no "disabled" state shown, review+refine steps completely hidden
- `maxDuration`: verify plan tier BEFORE increasing. Hobby → keep at 60 (or remove — default is 10s but SSE needs explicit value). Do NOT set 120s on Hobby.
- `ENABLE_REFINE=true`: 7-step fresh / 4-step edit. `false`: 5-step fresh / 4-step edit.

**generator.ts Migration**
- `buildEnrichedSystemPrompt()` deleted
- New signature: `generateHtml(userMessage: string, currentHtml?: string): Promise<string>`
- Orchestrator calls `buildUserMessage()` / `buildEditUserMessage()` and passes result to generator
- Backward-compat aliases (`buildFreshSystemPrompt`, `buildEditSystemPrompt`) in html-prompts.ts can be removed once generator.ts is updated

**researcher.ts Cleanup**
- Delete `src/lib/ai-pipeline/researcher.ts` entirely
- Remove all `researchContext` imports
- Delete `ResearchResult` interface from `types.ts`
- `npm run typecheck` must pass clean after deletion

### Claude's Discretion
- Exact wording of reviewer prompt rubrics
- Exact format of `.calibration.jsonl` entries
- Internal structure of reviewer Zod schema (field ordering, descriptions)
- HTML scoring strategy (regex, parsing approach per dimension)

### Deferred Ideas (OUT OF SCOPE)
- User-visible style selector
- Design Agent in edit mode (extract colors from existing HTML)
- Re-review after refine (2-pass loop)
- Reviewer score display in UI
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PIPE-10 | Reviewer (gpt-4o-mini + Zod) scores HTML 0-100 across visual/content/technical | Pattern: mirror design-agent.ts with zodResponseFormat; scoring via heuristic + LLM |
| PIPE-11 | Refine pass fires when score < threshold OR must_fix[] non-empty | Trigger logic in orchestrator; refineHtml() stub in context-builder.ts already exists |
| PIPE-12 | Refine uses separate message builder — no component snippets re-injected | refineHtml() builds its own prompt: must_fix list + current HTML only |
| PIPE-13 | REVIEW_THRESHOLD env var, default 75 | `process.env.REVIEW_THRESHOLD ?? "75"` pattern; parseInt with fallback |
| PIPE-14 | Fresh mode: 7 steps: analyze → components → design → generate → review → refine (cond.) → validate | index.ts orchestrator rewire; ENABLE_REFINE gates review+refine steps |
| PIPE-15 | Edit mode: 4 steps: analyze → components → generate → validate | currentHtml truthy = edit mode; skip design/review/refine |
| PIPE-16 | PipelineEvent.step union extended with "components", "design", "review", "refine" | types.ts union type — additive, no shape change |
| PIPE-17 | STEP_LABELS updated with Vietnamese for all 7 steps; "research" key removed | editor-client.tsx line 149-154; UI-SPEC defines exact labels |
| PIPE-18 | Verify Vercel plan tier before maxDuration change; Hobby → ENABLE_REFINE gate | route.ts maxDuration currently 90 (exceeds Hobby 60s); must be corrected |
| PIPE-19 | researcher.ts deleted; all imports removed; typecheck passes clean | Deletion + import audit across ai-pipeline/ and anywhere importing researcher |
| PIPE-20 | Calibration pass: ≥10 prompts, score distribution verified, threshold validated | Manual task; requires reviewer.ts deployed; calibration.jsonl appended |
</phase_requirements>

---

## Summary

Phase 11 completes the v1.1 AI pipeline by wiring together all components built in Phases 9-10 into a coherent 7-step (fresh) / 4-step (edit) orchestration. The core new module is `reviewer.ts` — a gpt-4o-mini quality gate that scores generated HTML and populates `must_fix[]` items that trigger `refineHtml()` in `context-builder.ts` (currently a stub). The orchestrator `index.ts` needs a full rewrite from its current 4-step flow to the new conditional flow. Generator migration removes the old research-coupling from `generator.ts`. Cleanup deletes `researcher.ts` entirely.

The critical constraint is Vercel Hobby plan (60s hard timeout). The `maxDuration` in `route.ts` is currently set to 90 — which silently exceeds Hobby limits and will cause cold-start failures. Phase 11 must correct this: either gate refine behind `ENABLE_REFINE` env var (so the default Hobby flow stays within budget) or upgrade to Pro. Per user decision: `ENABLE_REFINE=false` default is the safe path.

The UI surface change is minimal: only `STEP_LABELS` in `editor-client.tsx` changes. The SSE handler logic is already generic and will display new step keys automatically once they're in the union type and the STEP_LABELS map.

**Primary recommendation:** Implement in order — types.ts first (union extend + ResearchResult delete), then reviewer.ts (new module), then refineHtml() (complete stub), then generator.ts (new signature), then index.ts (orchestrator rewire), then route.ts (maxDuration fix + ENABLE_REFINE), then editor-client.tsx (STEP_LABELS), then researcher.ts deletion + typecheck, then calibration.

---

## Standard Stack

### Core (already installed — no new deps needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `openai` | installed | gpt-4o-mini reviewer, gpt-4o refiner | Already used throughout pipeline |
| `zod` | ^3.25.76 | ReviewResultSchema with zodResponseFormat | Pinned to v3; v4 breaks openai/helpers/zod |
| `openai/helpers/zod` | (part of openai pkg) | zodResponseFormat for structured output | Same pattern as design-agent.ts |

### No New Packages Required

All dependencies are already installed. Phase 11 is purely code reorganization + new modules using existing stack.

**Verification:** `npm view zod version` → 3.25.76 (confirmed from STATE.md: zod@^3.25.76 installed in Phase 10).

---

## Architecture Patterns

### Recommended File Structure (delta from current)

```
src/lib/ai-pipeline/
├── index.ts           # REWRITE — 7-step/4-step orchestrator
├── types.ts           # UPDATE — extend step union, delete ResearchResult
├── generator.ts       # UPDATE — new signature, delete buildEnrichedSystemPrompt
├── context-builder.ts # UPDATE — implement refineHtml() (currently stub)
├── reviewer.ts        # NEW — quality gate module
├── design-agent.ts    # UNCHANGED
├── analyzer.ts        # UNCHANGED
├── validator.ts       # UNCHANGED
└── researcher.ts      # DELETE

.calibration.jsonl     # NEW — gitignored, append-only
```

### Pattern 1: Reviewer Module (mirrors design-agent.ts)

**What:** gpt-4o-mini with Zod structured output, lazy OpenAI init, AbortSignal.timeout, schema exported for tests.

**When to use:** Any LLM call that returns structured data and needs to be testable in isolation.

```typescript
// Pattern from design-agent.ts — apply verbatim to reviewer.ts
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

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

export async function reviewHtml(
  html: string,
  originalPrompt: string
): Promise<ReviewResult> {
  try {
    const completion = await getOpenAI().chat.completions.parse(
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: REVIEWER_SYSTEM_PROMPT },
          { role: "user", content: buildReviewerUserMessage(html, originalPrompt) },
        ],
        response_format: zodResponseFormat(ReviewResultSchema, "review_result"),
      },
      { signal: AbortSignal.timeout(30000) }
    );
    return completion.choices[0].message.parsed ?? FALLBACK_REVIEW;
  } catch {
    return FALLBACK_REVIEW;
  }
}
```

Note: `ReviewResult` interface already exists in `types.ts` (has score, visual, content, technical, must_fix, suggestions fields) — `ReviewResultSchema` must match this interface exactly.

### Pattern 2: Orchestrator Rewire (index.ts)

**What:** Conditional branching based on `currentHtml` (edit vs fresh) and `ENABLE_REFINE` env var.

```typescript
const ENABLE_REFINE = process.env.ENABLE_REFINE === "true";
const REVIEW_THRESHOLD = parseInt(process.env.REVIEW_THRESHOLD ?? "75", 10);

export async function runGenerationPipeline(
  prompt: string,
  currentHtml: string | undefined,
  onEvent: (event: PipelineEvent) => void
): Promise<string> {
  const isEdit = !!currentHtml;

  // Step 1: Analyze (always)
  onEvent({ step: "analyze", status: "start" });
  const analysis = await analyzePrompt(prompt);
  onEvent({ step: "analyze", status: "done", detail: `...` });

  // Step 2: Components (always)
  onEvent({ step: "components", status: "start" });
  const snippets = selectComponents(analysis);
  onEvent({ step: "components", status: "done", detail: `${snippets.length} components` });

  // Step 3: Design (fresh only)
  let design: DesignResult | undefined;
  if (!isEdit) {
    onEvent({ step: "design", status: "start" });
    design = await runDesignAgent(prompt, analysis);
    onEvent({ step: "design", status: "done", detail: design.preset });
  }

  // Step 4: Generate
  onEvent({ step: "generate", status: "start" });
  const userMessage = isEdit
    ? buildEditUserMessage(prompt)
    : buildUserMessage(prompt, analysis, design!, snippets);
  let html = await generateHtml(userMessage, currentHtml);
  onEvent({ step: "generate", status: "done" });

  // Step 5-6: Review + Refine (fresh + ENABLE_REFINE only)
  if (!isEdit && ENABLE_REFINE) {
    onEvent({ step: "review", status: "start" });
    const reviewResult = await reviewHtml(html, prompt);
    const shouldRefine = reviewResult.score < REVIEW_THRESHOLD || reviewResult.must_fix.length > 0;
    onEvent({ step: "review", status: "done", detail: `Score: ${reviewResult.score}` });

    if (shouldRefine) {
      onEvent({ step: "refine", status: "start" });
      html = await refineHtml(html, reviewResult);
      onEvent({ step: "refine", status: "done" });
    }
    // log calibration regardless
    appendCalibrationLog({ prompt, reviewResult, triggered_refine: shouldRefine });
  }

  // Step 7: Validate (always)
  onEvent({ step: "validate", status: "start" });
  const { html: finalHtml, fixes, warnings } = validateAndFix(html);
  onEvent({ step: "validate", status: "done", detail: fixes.length > 0 ? `${fixes.length} fix(es)` : "OK", fix_count: fixes.length });

  return finalHtml;
}
```

### Pattern 3: refineHtml() Implementation

**What:** Replace stub in context-builder.ts with full gpt-4o call. Reuses `buildSystemPrompt()`.

```typescript
// Source: 11-CONTEXT.md decisions
export async function refineHtml(html: string, reviewResult: ReviewResult): Promise<string> {
  const mustFixList = reviewResult.must_fix
    .map((item, i) => `${i + 1}. ${item}`)
    .join("\n");

  const userMessage = `Fix the following issues in the HTML:\n\n${mustFixList}\n\nCurrent HTML:\n${html}`;

  // lazy openai init needed — context-builder.ts must add getOpenAI() pattern
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

  const raw = completion.choices[0].message.content ?? html;
  return stripMarkdownFences(raw);
}
```

Note: `context-builder.ts` currently imports `ReviewResult` from types but does NOT have a lazy OpenAI init — this must be added. `stripMarkdownFences` from `html-prompts.ts` should be imported.

### Pattern 4: generator.ts New Signature

**What:** Remove `buildEnrichedSystemPrompt()` and `ResearchResult` coupling. Accept pre-built userMessage.

```typescript
// New signature — orchestrator builds userMessage via buildUserMessage()/buildEditUserMessage()
export async function generateHtml(
  userMessage: string,
  currentHtml?: string
): Promise<string> {
  // For edit mode: currentHtml is passed in, must be included in user message
  // But per CONTEXT.md: buildEditUserMessage() already handles preservation instruction
  // currentHtml for edit mode is now passed via the messages array if needed
  // OR: system prompt stays lean, user message contains preserve instruction
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
  const raw = completion.choices[0].message.content ?? "";
  return stripMarkdownFences(raw);
}
```

**Critical note on edit mode:** The current `buildEditSystemPrompt()` embeds `currentHtml` in the system prompt. With the new signature, `buildEditUserMessage()` only includes a preservation instruction — it does NOT include the current HTML. The orchestrator must pass `currentHtml` to the generator so it can be included somewhere. Two options:
- Option A: `buildEditUserMessage(prompt, currentHtml)` adds currentHtml to the user message
- Option B: generator adds currentHtml as a third message or appends to user message

Per CONTEXT.md: "buildEditUserMessage(prompt)" only produces the preservation instruction + request. The generator receives `currentHtml?` as a parameter — likely used to build a complete user message. Planner should decide exact approach for how currentHtml flows in edit mode with the new pattern.

### Pattern 5: STEP_LABELS Update (editor-client.tsx)

**What:** Replace the 4-key map at line 149-154 with the mode-aware map from UI-SPEC.

```typescript
// New STEP_LABELS — always include all possible steps
// The SSE handler already handles missing keys gracefully (no bubble shown)
const STEP_LABELS: Record<string, string> = {
  analyze:    "Phân tích yêu cầu...",
  components: "Chọn components phù hợp...",
  design:     "Thiết kế visual identity...",
  generate:   "Đang tạo HTML...",
  review:     "Kiểm tra chất lượng...",
  refine:     "Tinh chỉnh kết quả...",
  validate:   "Kiểm tra kết quả...",
  // "research" key removed
};
```

This single map works for all modes: steps not emitted by the pipeline simply never trigger a bubble. No conditional logic needed in editor-client.tsx — the SSE handler already guards with `STEP_LABELS[event.step]` check (line 238).

### Pattern 6: Calibration Logging

**What:** Append-only JSONL file in Node.js using `fs.appendFileSync`.

```typescript
import { appendFileSync } from "fs";
import { join } from "path";

function appendCalibrationLog(entry: {
  prompt: string;
  reviewResult: ReviewResult;
  triggered_refine: boolean;
}): void {
  const record = {
    timestamp: new Date().toISOString(),
    prompt: entry.prompt,
    score: entry.reviewResult.score,
    visual: entry.reviewResult.visual,
    content: entry.reviewResult.content,
    technical: entry.reviewResult.technical,
    must_fix_count: entry.reviewResult.must_fix.length,
    triggered_refine: entry.triggered_refine,
  };
  try {
    appendFileSync(
      join(process.cwd(), ".calibration.jsonl"),
      JSON.stringify(record) + "\n",
      "utf8"
    );
  } catch {
    // Silent fail — calibration logging is non-critical
  }
}
```

Note: `fs.appendFileSync` is Node.js built-in, no import needed beyond `"fs"`. Works in Next.js API routes (server-side only). Does NOT work in Edge runtime — route.ts must remain Node.js runtime (no `export const runtime = "edge"`).

### Anti-Patterns to Avoid

- **Non-lazy OpenAI init at module scope:** `const openai = new OpenAI()` at top of file breaks test imports when `OPENAI_API_KEY` is absent. Use `getOpenAI()` lazy init pattern (established in design-agent.ts — must apply to context-builder.ts and generator.ts too).
- **generator.ts still importing from researcher.ts:** After deletion of researcher.ts, any stale import causes typecheck failure. Run `npm run typecheck` after each deletion step.
- **Setting maxDuration: 120 on Hobby plan:** Silent failure — Hobby hard wall is 60s. Current `maxDuration: 90` already exceeds it. Fix: set to 60 or lower.
- **Re-injecting component snippets in refine prompt:** Adds ~2000 tokens with zero benefit — refiner only needs must_fix list and current HTML.
- **Deleting ResearchResult before removing all usages:** types.ts deletion must happen last among type changes, after generator.ts and researcher.ts are already cleaned.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Structured LLM output validation | Custom JSON parser + manual field checks | `zodResponseFormat` + Zod schema | Handles refusals, partial outputs, type coercion — already proven in design-agent.ts |
| Timeout handling | `setTimeout` + Promise.race | `AbortSignal.timeout(ms)` | Built-in, clean abort propagation — established pattern |
| Append-only log file | DB table, external logging service | `fs.appendFileSync` + `.calibration.jsonl` | Zero infra, zero cost, adequate for calibration task |
| LLM fallback on reviewer failure | Complex retry logic | `try/catch` returning `FALLBACK_REVIEW` | Reviewer failure should not block pipeline — degrade gracefully |

**Key insight:** The reviewer is non-blocking. If it fails (network error, model refusal), the pipeline continues without review/refine. Quality gates should never crash the primary flow.

---

## Common Pitfalls

### Pitfall 1: currentHtml in Edit Mode After Generator Signature Change

**What goes wrong:** `buildEditUserMessage(prompt)` only returns a preservation instruction + user request. It does NOT embed the current HTML. With the old `buildEditSystemPrompt(currentHtml)`, the HTML was in the system prompt. With the new signature, if currentHtml is not passed to the LLM somewhere, the model has no HTML to edit — it generates fresh.

**Why it happens:** The migration from old enriched-system-prompt pattern to new lean-system-prompt + structured-user-message pattern changes where currentHtml lives.

**How to avoid:** Pass `currentHtml` through the generator and include it in the user message for edit mode. One concrete approach: `buildEditUserMessage(prompt, currentHtml)` adds a "Current HTML to edit:" section.

**Warning signs:** Edit mode generates completely fresh HTML instead of modifying the existing one.

### Pitfall 2: PipelineEvent.step Union Not Extended

**What goes wrong:** TypeScript accepts string literals at compile time but `STEP_LABELS[event.step]` check in editor-client uses the string union — if `"components"`, `"design"`, `"review"`, `"refine"` are not in the union, TypeScript will complain when orchestrator emits those step values.

**Why it happens:** `types.ts` line 44 union is exhaustive — orchestrator `onEvent({ step: "components", ... })` will be a type error.

**How to avoid:** Update `PipelineEvent.step` union BEFORE updating the orchestrator. Also remove `"research"` from the union since researcher.ts is deleted.

### Pitfall 3: maxDuration on Hobby Plan

**What goes wrong:** `route.ts` currently has `export const maxDuration = 90`. Vercel Hobby plan caps at 60s. The function may appear to work locally but silently times out at 60s in production.

**Why it happens:** Vercel silently applies the plan cap — no build error, no warning.

**How to avoid:** For Hobby + `ENABLE_REFINE=false` (default), budget is: analyze (~3s) + components (~0ms) + design (~5s) + generate (~30s) + validate (~0ms) = ~38s. Set `maxDuration = 60` to stay within Hobby. When `ENABLE_REFINE=true`, budget adds: review (~10s) + refine (~30s) = ~78s total — exceeds Hobby. Gate is: only enable refine on Pro plan.

### Pitfall 4: Calibration Log in Edge Runtime

**What goes wrong:** `fs.appendFileSync` is not available in Edge runtime. If route.ts ever has `export const runtime = "edge"`, calibration logging will throw.

**Why it happens:** Edge runtime has a restricted Node.js API surface.

**How to avoid:** Do not add `export const runtime = "edge"` to route.ts. Leave it as default Node.js runtime (implicit). If logging fails, catch silently — it's non-critical.

### Pitfall 5: Reviewer Scoring Summing to != 100

**What goes wrong:** If reviewer scores visual=30, content=25, technical=20, `score` might not equal their sum. Zod allows any number 0-100 for `score` independently.

**Why it happens:** The LLM might compute a weighted sum differently than expected, or `score` might not be the arithmetic sum of dimensions.

**How to avoid:** In the reviewer system prompt, instruct: "score = visual + content + technical (must sum to 100 max)". Alternatively, compute `score` in code: `score = result.visual + result.content + result.technical`. Planner should decide which approach — the CONTEXT.md does not lock this.

---

## Code Examples

### Existing ReviewResult Interface (types.ts lines 34-41)

```typescript
// Already defined — ReviewResultSchema MUST match this shape exactly
export interface ReviewResult {
  score: number;
  visual: number;
  content: number;
  technical: number;
  must_fix: string[];
  suggestions: string[];
}
```

### Existing PipelineEvent (types.ts lines 43-50) — needs update

```typescript
// Current — "research" must be removed, new steps added
export interface PipelineEvent {
  step: "analyze" | "research" | "design" | "generate" | "validate" | "complete" | "error";
  // ...
}

// Target
export interface PipelineEvent {
  step: "analyze" | "components" | "design" | "generate" | "review" | "refine" | "validate" | "complete" | "error";
  // ...
}
```

### Existing STEP_LABELS (editor-client.tsx lines 149-154) — needs update

```typescript
// Current (4 keys including obsolete "research")
const STEP_LABELS: Record<string, string> = {
  analyze: "Phân tích yêu cầu...",
  research: "Tìm CSS patterns & components...",  // REMOVE
  generate: "Đang tạo HTML...",
  validate: "Kiểm tra kết quả...",
};

// Target (7 keys, "research" removed)
const STEP_LABELS: Record<string, string> = {
  analyze:    "Phân tích yêu cầu...",
  components: "Chọn components phù hợp...",
  design:     "Thiết kế visual identity...",
  generate:   "Đang tạo HTML...",
  review:     "Kiểm tra chất lượng...",
  refine:     "Tinh chỉnh kết quả...",
  validate:   "Kiểm tra kết quả...",
};
```

### .gitignore Entry (to add)

```
# Calibration log
.calibration.jsonl
```

### route.ts maxDuration (needs correction)

```typescript
// Current — exceeds Hobby limit
export const maxDuration = 90;

// Fix for Hobby plan
export const maxDuration = 60;
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| researcher.ts (gpt-4o-mini CSS patterns) | Component Library (~0ms tag match) | Phase 9 | Eliminated ~5s LLM call |
| Enriched system prompt (analysis + research) | Lean system prompt + structured user message | Phase 10 | Enables prompt caching; cleaner separation |
| buildEnrichedSystemPrompt() in generator.ts | buildUserMessage()/buildEditUserMessage() in context-builder.ts | Phase 11 | Orchestrator controls message construction |

**Deprecated/outdated:**
- `researcher.ts`: Superseded by Phase 9 component library + Phase 10 design agent. Delete in Phase 11.
- `buildEnrichedSystemPrompt()`: Moved concerns to orchestrator + context-builder. Delete in Phase 11.
- `buildFreshSystemPrompt` alias: Only existed for backward compat with generator.ts. Remove once generator.ts updated.
- `buildEditSystemPrompt()`: Same situation — remove after generator.ts updated.
- `ResearchResult` interface: No consumers after researcher.ts deletion + generator.ts update.

---

## Open Questions

1. **Edit mode currentHtml flow with new generator signature**
   - What we know: `buildEditUserMessage(prompt)` returns preservation instruction + request only. Generator new signature receives `currentHtml?`.
   - What's unclear: Where exactly does currentHtml go in the messages array for edit mode — user message append, separate message, or system prompt?
   - Recommendation: `buildEditUserMessage(prompt, currentHtml)` adds a `"Current HTML:\n{currentHtml}"` block. Planner should define this explicitly in the plan.

2. **reviewer.ts: compute score in code vs trust LLM sum**
   - What we know: CONTEXT.md does not lock this. Zod validates ranges but not the sum constraint.
   - What's unclear: Whether LLM reliably sums visual + content + technical correctly.
   - Recommendation: Compute `score` from dimension sum in code as post-processing step: `result.score = result.visual + result.content + result.technical`. Simpler and deterministic.

3. **ENABLE_REFINE header/response indicator to client**
   - What we know: UI hides review+refine steps when ENABLE_REFINE=false.
   - What's unclear: Does editor-client.tsx need to know ENABLE_REFINE value to conditionally adjust STEP_LABELS, or is it sufficient to just include all labels and let missing SSE events silence the steps?
   - Recommendation: Include all 7 labels in STEP_LABELS always. Steps not emitted by pipeline produce no bubbles. No client-side ENABLE_REFINE awareness needed. This matches the UI-SPEC intent.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (globals: true, environment: node) |
| Config file | `vitest.config.ts` at repo root |
| Quick run command | `npm run test -- --run src/lib/ai-pipeline/reviewer.test.ts` |
| Full suite command | `npm run test -- --run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PIPE-10 | ReviewResultSchema validates correct shape | unit | `npm run test -- --run src/lib/ai-pipeline/reviewer.test.ts` | Wave 0 |
| PIPE-10 | ReviewResultSchema rejects invalid shapes | unit | `npm run test -- --run src/lib/ai-pipeline/reviewer.test.ts` | Wave 0 |
| PIPE-10 | FALLBACK_REVIEW passes schema validation | unit | `npm run test -- --run src/lib/ai-pipeline/reviewer.test.ts` | Wave 0 |
| PIPE-11 | Trigger logic: score < threshold fires refine | unit | `npm run test -- --run src/lib/ai-pipeline/reviewer.test.ts` | Wave 0 |
| PIPE-11 | Trigger logic: must_fix non-empty fires refine | unit | `npm run test -- --run src/lib/ai-pipeline/reviewer.test.ts` | Wave 0 |
| PIPE-12 | refineHtml() prompt does NOT include component snippets | unit | `npm run test -- --run src/lib/ai-pipeline/context-builder.test.ts` | ✅ (extend) |
| PIPE-13 | REVIEW_THRESHOLD env var parsed correctly | unit | `npm run test -- --run src/lib/ai-pipeline/reviewer.test.ts` | Wave 0 |
| PIPE-16 | PipelineEvent step union includes new values | unit (type-level) | `npm run typecheck` | ✅ (types.ts) |
| PIPE-19 | researcher.ts deleted, typecheck clean | typecheck | `npm run typecheck` | ✅ |
| PIPE-20 | Calibration pass | manual | Run 10 prompts, inspect `.calibration.jsonl` | N/A |

### Sampling Rate

- **Per task commit:** `npm run test -- --run && npm run typecheck`
- **Per wave merge:** `npm run test -- --run && npm run typecheck`
- **Phase gate:** Full suite green + `npm run typecheck` clean before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/lib/ai-pipeline/reviewer.test.ts` — covers PIPE-10, PIPE-11, PIPE-13 schema/logic tests
- [ ] Extend `src/lib/ai-pipeline/context-builder.test.ts` — add refineHtml() prompt format test (PIPE-12)

*(Existing test files: component-library.test.ts, design-agent.test.ts, context-builder.test.ts, html-prompts.test.ts — all remain valid)*

---

## Sources

### Primary (HIGH confidence)

- Direct code read: `src/lib/ai-pipeline/index.ts` — current 4-step orchestrator structure
- Direct code read: `src/lib/ai-pipeline/types.ts` — existing interfaces including ReviewResult (already defined)
- Direct code read: `src/lib/ai-pipeline/generator.ts` — current signature + buildEnrichedSystemPrompt
- Direct code read: `src/lib/ai-pipeline/design-agent.ts` — pattern to mirror for reviewer.ts
- Direct code read: `src/lib/ai-pipeline/context-builder.ts` — refineHtml() stub + buildUserMessage/buildEditUserMessage
- Direct code read: `src/lib/html-prompts.ts` — buildSystemPrompt() zero-param invariant
- Direct code read: `src/app/api/ai/generate-html/route.ts` — maxDuration=90, SSE pattern
- Direct code read: `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` — STEP_LABELS at line 149-154
- Direct code read: `11-CONTEXT.md` — all user decisions
- Direct code read: `11-UI-SPEC.md` — exact STEP_LABELS target values
- Direct code read: `vitest.config.ts` — test framework config

### Secondary (MEDIUM confidence)

- STATE.md: Vercel Hobby 60s limit confirmed as known blocker; maxDuration=90 exceeding it confirmed
- STATE.md: Lazy OpenAI init pattern established decision from Phase 10
- STATE.md: Zod v3 pinned (v4 breaks zodResponseFormat) — established constraint

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed, versions verified in STATE.md
- Architecture: HIGH — direct code reads establish exact integration points; no speculation
- Pitfalls: HIGH — maxDuration/Hobby confirmed in STATE.md; currentHtml edit-mode gap is structural analysis

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable domain — no fast-moving external deps)
