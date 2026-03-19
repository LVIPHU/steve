# Pitfalls Research

**Domain:** Enhanced AI Pipeline — multi-step LLM orchestration with SSE streaming, added to existing Next.js website generator
**Researched:** 2026-03-19
**Confidence:** HIGH (verified against official docs, existing codebase, and community issue reports)

---

## Critical Pitfalls

### Pitfall 1: Prompt Caching Threshold Miss — System Prompt Too Short to Cache

**What goes wrong:**
The plan calls for a "lean" system prompt of ~800 tokens to enable OpenAI Prompt Caching. This will never get a cache hit. OpenAI requires the **total prompt** (system + messages array combined) to reach 1,024 tokens minimum before any caching occurs. Cache hits then occur in 128-token increments above that floor. An 800-token system prompt, even with a 200-token user message, lands at ~1,000 total — just below the threshold. The feature will appear to "work" (no errors) but `cached_tokens` will always be 0 in usage metrics.

**Why it happens:**
The design doc conflates "system prompt length" with "what gets cached." Caching is a property of the full prompt prefix, not just the system message. The 1,024-token minimum applies to the cumulative total of all content before the variable part.

**How to avoid:**
Log `completion.usage.prompt_tokens_details.cached_tokens` on every generation call during testing. If it stays at 0 after multiple identical requests, the total prompt is below threshold. Two options: (a) pad the system prompt with additional DaisyUI component reference documentation until total reaches ~1,100+ tokens, or (b) accept that caching applies only when component snippets are included, bringing the user message to ~1,750 tokens and the total to ~2,550+ tokens — well above threshold.

**Warning signs:**
`cached_tokens: 0` in every OpenAI API response even after making identical requests back-to-back.

**Phase to address:**
Phase 09-02 (Design Agent + Context Builder) — the `buildFreshSystemPrompt()` rewrite must verify cache hit rate in integration tests.

---

### Pitfall 2: Vercel Hobby Plan Hard Wall at 60 Seconds

**What goes wrong:**
The current route already has `export const maxDuration = 90`, which silently exceeds the Vercel Hobby plan's 60-second maximum. The plan to bump this to 120 seconds for refine mode will cause a build-time or runtime error on Hobby. If the project is deployed on Hobby, worst-case generation (48s + 25s refine = ~73s) will timeout at 60 seconds — after the user has already waited 60 seconds, the SSE stream drops with no cleanup event, leaving the UI in "generating" state permanently.

**Why it happens:**
The plan was written assuming Pro-tier limits. Hobby max is 60 seconds (configurable), Pro max is 300 seconds. The existing `maxDuration = 90` would also be silently ignored or cause an error on Hobby builds.

**How to avoid:**
Verify the deployment plan before implementation. If on Hobby: the worst-case with refine (73s) is impossible on Hobby — the refine step must be disabled or the timeout approach redesigned (e.g., return partial results at 55s). If on Pro: `maxDuration = 120` is safe. Add a clear comment in the route file noting the plan tier dependency. The route should also handle `AbortSignal` from `request.signal` so that client disconnect during a long generation properly cancels in-flight OpenAI calls.

**Warning signs:**
Function timeout errors on Vercel dashboard. UI stuck in "generating" spinner after exactly 60 or 90 seconds.

**Phase to address:**
Phase 09-03 (Wire + Route Update) — must confirm Vercel plan tier before setting maxDuration and add client-disconnect abort handling.

---

### Pitfall 3: Review Agent Score Inflation — Refine Never Triggers or Always Triggers

**What goes wrong:**
gpt-4o-mini, asked to score its own pipeline's output, tends toward grade inflation. Research confirms LLMs evaluating LLM output exhibit self-preference bias and verbosity bias, awarding higher scores than the content deserves. If the reviewer consistently scores 80+ even for mediocre output, the refine step never fires — the feature exists but provides no value. The inverse also occurs: poorly calibrated rubric wording causes the reviewer to score too strictly (always < 75), triggering refine on every generation and adding 25 seconds to every request.

**Why it happens:**
The reviewer is a different model (gpt-4o-mini) but in the same model family. The rubric deductions are defined in English; the model can "understand" them creatively to avoid large deductions. Without a calibration dataset of known-good and known-bad HTML examples, there is no empirical baseline for what score the model actually assigns.

**How to avoid:**
Before shipping Phase 09-03, run a calibration pass: generate 10 websites with the current v1 pipeline (known to produce generic output), have the reviewer score them, and log the scores. If median is > 75, tighten deduction values or lower threshold to 65. Also: set `response_format: { type: "json_object" }` on the reviewer call (not just instruct "output JSON") to guarantee schema compliance. Add a hard safety valve: if `must_fix` array is non-empty but `score >= 75`, override the no-refine decision and still refine (trust the issues list, not the number).

**Warning signs:**
100% of generations show `refine: skipped` in logs, or 100% show `refine: triggered`. Either extreme means the threshold or rubric is miscalibrated.

**Phase to address:**
Phase 09-03 (Review + Wire) — calibration test required before enabling refine in production.

---

### Pitfall 4: SSE Step Event Mismatch — Client-Side STEP_LABELS Out of Sync

**What goes wrong:**
`editor-client.tsx` has a hardcoded `STEP_LABELS` record with the current 4 steps: `analyze`, `research`, `generate`, `validate`. The new pipeline emits 7 steps: `analyze`, `components`, `design`, `generate`, `review`, `refine`, `validate`. Steps without a matching key in `STEP_LABELS` are silently ignored by this code path:

```typescript
} else if (event.status === "start" && STEP_LABELS[event.step]) {
  // Only fires if STEP_LABELS[event.step] exists
```

The result: `components`, `design`, `review`, and `refine` steps produce no visible feedback in the UI. The user sees the spinner jump from "Phân tích yêu cầu..." to "Đang tạo HTML..." with no indication of the 10+ seconds of design agent work happening in between. Additionally, the existing `research` step will be removed from the pipeline but `STEP_LABELS` still has it — it becomes a dead entry but causes no error.

**Why it happens:**
The client-side label map is maintained separately from the server-side pipeline and there is no TypeScript type enforcement linking them. The `PipelineEvent.step` type union must also be extended from `"analyze" | "research" | "generate" | "validate" | "complete" | "error"` to include the new steps, but if that change is missed the client just casts to `string` and swallows the new events silently.

**How to avoid:**
In `types.ts`, extend the `PipelineEvent.step` union type to include all 7 new steps. In `editor-client.tsx`, replace the partial `STEP_LABELS` with the complete map from the design doc (section 5). Add a TypeScript exhaustive check or at minimum a runtime `console.warn` when an SSE step arrives that has no label. The edit-mode branching (4 steps vs 7 steps) also means `design`, `review`, `refine` steps may never arrive in edit mode — the client must handle missing steps gracefully without leaving phantom "in-progress" messages.

**Warning signs:**
During development, UI shows only 3-4 step messages despite 7 steps being emitted in server logs. TypeScript does not error because the type is cast to `string` on the client.

**Phase to address:**
Phase 09-03 (Editor Update) — `types.ts` must be updated first, then `editor-client.tsx`.

---

### Pitfall 5: Design Agent Adds ~5s But Is Skipped in Edit Mode — Color Context Lost

**What goes wrong:**
Edit mode skips the Design Agent (intentionally, per design doc). However, the main Generate step in edit mode will still receive a `buildUserMessage()` call that is supposed to include a `=== DESIGN BRIEF ===` block with palette and font decisions. Without a Design Agent result, `context-builder.ts` has no design data to inject. If the context builder handles this case with an empty string or a hardcoded fallback, the generator receives no color brief — and will default to DaisyUI blue again (defeating the whole purpose of v1.1 for edit requests).

**Why it happens:**
The design doc says edit mode uses "edit system prompt" and skips design/review/refine, but `buildUserMessage()` was designed assuming a `DesignResult` is always available. The edit mode path either needs to: (a) extract current colors from the existing HTML and pass them as a design brief, or (b) use a different message builder that omits the design brief section.

**How to avoid:**
`buildUserMessage()` must have an optional `design?: DesignResult` parameter. When called without design data (edit mode), substitute a "preserve existing style" instruction block: `=== STYLE: Preserve existing colors and typography. Do not redesign. ===`. Alternatively, implement a lightweight color extraction function that reads hex values from `--color-primary`, `--color-secondary` etc. out of the existing HTML's `:root {}` block and converts them to a DesignResult-shaped object.

**Warning signs:**
Edit mode generations produce websites with different color palettes than the original. Blue DaisyUI default reappearing after an edit is the clearest sign.

**Phase to address:**
Phase 09-02 (Context Builder) — `buildUserMessage()` signature must handle the `design: undefined` case explicitly.

---

### Pitfall 6: Component Snippet Injection Breaks Refine Step — HTML Grows Out of Context Window Budget

**What goes wrong:**
The refine step is a second `gpt-4o` call where the full generated HTML (typically 500-1,000+ lines, ~8,000-15,000 tokens) is passed as the current document with a fix-list instruction. If the component snippets from step 2 were injected into the user message of the generate call (~1,200 tokens), they do NOT need to be re-injected into the refine call. But if `buildUserMessage()` is reused naively for both generate and refine, the snippets inflate the refine prompt significantly with no benefit — the model already has the HTML output and doesn't need reference snippets to fix specific issues.

**Why it happens:**
The context builder is a shared utility. If the refine step calls the same `buildUserMessage()` path as generate, snippets are accidentally included. This pushes the refine total token count higher, increasing latency and cost.

**How to avoid:**
Create separate context builders: `buildGenerateMessage()` (includes design brief + snippets + prompt) and `buildRefineMessage()` (includes only the current HTML + must_fix list). The refine call should use a simple, minimal message with no component references.

**Warning signs:**
Refine step costs more tokens than generate step in OpenAI usage logs. Refine takes longer than the estimated 25 seconds.

**Phase to address:**
Phase 09-03 (Generator + Refine function) — `refineHtml()` must use its own message builder.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using `response_format: json_object` without a Zod schema for DesignResult | Faster to implement | Silent field addition/removal causes runtime errors downstream; no type safety on API boundary | Never for DesignResult and ReviewResult — add schema validation |
| Reusing the single `openai` client instance across all pipeline steps | Simpler code | AbortSignal from one step can leak into another if shared controller is used; no per-step timeout isolation | Acceptable only if each call gets its own `AbortSignal.timeout()` — confirm this is the case |
| Hardcoding `score < 75` threshold without config | Works for MVP | Requires code deploy to tune threshold; optimal value unknown before production data | Acceptable for first deploy, but make threshold an env var before launch |
| Snippets as static TypeScript files | Zero runtime cost for lookup | Snippet updates require redeploy; no way to A/B test snippet quality | Acceptable for v1.1 — document that expansion means redeploy |
| `selectComponents()` using naive string contains matching for tags | Simple to implement | Mismatch rate increases as snippet library grows; "fitness" matches "fitnesscenter" | Acceptable at 25 snippets; add word-boundary matching before library exceeds 50 snippets |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| OpenAI Prompt Caching | Assuming system prompt length alone determines cache hits | Total prompt (system + messages + tools) must exceed 1,024 tokens; verify with `usage.prompt_tokens_details.cached_tokens` |
| OpenAI `response_format: json_object` | Forgetting this only guarantees valid JSON syntax, not schema compliance | Also use `response_format: { type: "json_schema", json_schema: ... }` for structural guarantees, or validate with Zod after parsing |
| AbortSignal per-call | Passing `AbortSignal.timeout(60000)` to the generate call but not to review or refine calls | Every OpenAI call in the pipeline must have its own `AbortSignal.timeout()` with appropriate per-step budgets |
| SSE ReadableStream cleanup | Not checking `request.signal` for client disconnect | Long-running pipelines (73s) will continue consuming OpenAI credits after the user navigates away; add `request.signal.addEventListener('abort', cleanup)` |
| DaisyUI v4 CSS variable format | Injecting hex values into DaisyUI's `--p`, `--s` oklch variables | DaisyUI v4 oklch variables expect space-separated L C H values, not hex; the chosen "Approach B" (injecting `--color-primary` hex vars and overriding component classes with `!important`) avoids this — do not mix approaches |
| Google Fonts in SSE-generated HTML | `@import` inside `<style>` after other rules | `@import` must be the first rule in a `<style>` block; AI commonly generates it after `:root {}` which breaks font loading silently in some browsers |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Review + Refine on every edit | Every edit takes 73s instead of 35s | Edit mode must unconditionally skip review and refine — branching must happen in `index.ts` before calling reviewer | First user who does an edit and waits 73s instead of expected ~35s |
| All pipeline steps share one OpenAI client without connection pooling | High concurrency causes connection queue buildup | Instantiate the `openai` client module-level (already done), but verify `maxRetries: 0` is set — default retries will cause latency spikes under load | Concurrent users > ~5 |
| Component snippet HTML injected into every refine call | Token cost doubles for refine; latency increases 10-15s | Separate generate vs refine message builders | Every refine call |
| No short-circuit on validate when HTML is empty string | `validateAndFix("")` runs regex on empty string; downstream DB write saves empty HTML | Add guard at top of `validateAndFix` and in `index.ts`: if rawHtml is empty or < 500 chars, throw rather than save | When gpt-4o returns empty response due to content filter or timeout |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Injecting DesignResult hex values directly into HTML `<style>` blocks without sanitization | Prompt injection via Design Agent: if the design agent is manipulated into outputting `</style><script>alert(1)</script>` as a hex value, it is inserted into the HTML | Validate all DesignResult hex values against `/^#[0-9a-fA-F]{6}$/` before injection; reject non-hex values and fall back to safe defaults |
| Exposing full reviewer `must_fix` array to users in SSE detail field | Internal quality scores expose model reasoning; low scores could undermine user confidence unnecessarily | Send only the step status ("Tinh chỉnh thiết kế...") to the client; keep score and must_fix in server-side logs only |
| Component library snippets containing JS event handlers | If snippets include `onclick="..."` inline handlers referencing undefined functions, they silently fail in the iframe | Strip `onclick`, `onload`, and other inline event handlers from snippet HTML before injection into prompts |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No indication that refine is conditional | User sees "Tinh chỉnh thiết kế..." spinner on some requests but not others; perceived as inconsistent | Add a detail message on review done: "Chất lượng tốt — bỏ qua tinh chỉnh" when score >= 75; show score optionally in dev mode |
| 73-second worst-case with no intermediate preview | User sees nothing new in iframe for 73 seconds while both generate and refine complete | Emit the HTML to the client after generate step completes (score < 75 case), update iframe, then emit again after refine — two preview updates instead of one |
| "Tìm component phù hợp..." appears and disappears instantly (~0s) | Components step is local/instant; a zero-duration step message flickers | Skip emitting start/done for zero-latency steps, or add a minimum display time of 300ms to the step label before overwriting it |
| Edit mode shows fewer steps than fresh mode with no explanation | User is confused why their edit only shows 4 steps when fresh generation shows 7 | Add a session-level flag or UI note: "Chế độ chỉnh sửa — nhanh hơn vì bỏ qua thiết kế lại" |

---

## "Looks Done But Isn't" Checklist

- [ ] **Prompt Caching:** Verified `cached_tokens > 0` in OpenAI response usage after two identical requests in succession — not just assumed to work at 800 tokens
- [ ] **Refine Branching:** Confirmed `refine` step is never called in edit mode by checking server logs for an edit-mode generation — not just reading the code path
- [ ] **Design Brief in Edit Mode:** Confirmed that editing an existing website with a dark palette produces output that preserves the dark palette — not a generic blue DaisyUI page
- [ ] **Client Disconnect Cleanup:** Verified that navigating away mid-generation causes the server-side pipeline to abort (OpenAI call terminated) — confirmed by checking Vercel function logs showing early termination
- [ ] **Empty HTML Guard:** Confirmed that a generation failure (network timeout to OpenAI) emits `step: "error"` to the client and does NOT overwrite `htmlContent` in the database with an empty string
- [ ] **Reviewer JSON Schema:** `ReviewResult.score` is always a number (not a string `"85"`) — verified by parsing 10+ actual reviewer responses
- [ ] **DesignResult Hex Validation:** Hex values from Design Agent are validated against `/^#[0-9a-fA-F]{6}$/` before CSS injection — invalid values have a safe fallback
- [ ] **SSE Type Coverage:** `PipelineEvent.step` union in `types.ts` includes all 7 new steps — TypeScript compilation confirms no `any` cast needed in editor-client

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Prompt caching never fires | LOW | Measure first, then pad system prompt or accept caching only triggers on larger prompts; no structural change needed |
| Vercel timeout wall on Hobby | HIGH | Either upgrade to Pro ($20/mo), or cap generation at 55s by disabling refine on Hobby (detect via env var `VERCEL_ENV`), or restructure as a background job with polling |
| Reviewer always scores > 75 (refine never fires) | MEDIUM | Lower threshold to 65, tighten deduction amounts, or add a "force refine for first generation" flag during calibration period |
| Design Brief missing in edit mode (blue palette regression) | MEDIUM | Add `preserveStyle` mode to `buildUserMessage()` — extracts and re-injects existing colors from current HTML before generate call |
| SSE step labels missing from client | LOW | Add new step labels to `STEP_LABELS` map in `editor-client.tsx`; deploy; no data migration needed |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Prompt caching threshold miss (800 < 1024 tokens) | 09-02: Context Builder | Log `cached_tokens` from OpenAI response; confirm > 0 after second identical request |
| Vercel 60s Hobby hard wall | 09-03: Route Update | Confirm deployment tier before setting maxDuration; test 73s worst-case in staging |
| Review score inflation / always skip or always trigger | 09-03: Review + Wire | Calibration run: score 10 known-good and 10 known-bad HTML outputs; verify distribution |
| SSE STEP_LABELS client mismatch | 09-03: Editor Update | Inspect chat panel during full 7-step generation; confirm all 7 steps show labeled messages |
| Design Brief absent in edit mode | 09-02: Context Builder | Run an edit on a dark-themed website; confirm output preserves dark palette |
| Component snippets leaking into refine message | 09-03: Generator + Refine | Check token usage of refine call in OpenAI logs; confirm < 20,000 tokens (no snippets) |
| Google Fonts `@import` position bug | 09-02: System Prompt rewrite | Validate generated HTML with an HTML linter; check font renders in Firefox (strictest `@import` handling) |
| Hex value injection without sanitization | 09-02: Design Agent | Unit test `buildUserMessage()` with a malformed DesignResult hex value; confirm fallback fires |

---

## Sources

- OpenAI Prompt Caching official docs: minimum 1,024 token threshold, 128-token increment granularity — https://platform.openai.com/docs/guides/prompt-caching
- OpenAI community: why 1,024 token minimum exists — https://community.openai.com/t/why-does-prompt-caching-requires-at-least-1024-tokens/1363167
- Vercel Hobby vs Pro plan limits (60s vs 300s max duration) — https://vercel.com/docs/plans/hobby
- Vercel function duration configuration — https://vercel.com/docs/functions/configuring-functions/duration
- LLM self-evaluation score inflation bias (2025 research) — https://www.goodeyelabs.com/insights/llm-evaluation-2025-review
- LLM structured output reliability — https://openai.com/index/introducing-structured-outputs-in-the-api/
- Next.js App Router SSE client disconnect issues (GitHub Discussion #48682) — https://github.com/vercel/next.js/discussions/48682
- DaisyUI v4 OKLCH color format and override limitations — https://github.com/saadeghi/daisyui/discussions/2507
- Existing codebase: `src/app/api/ai/generate-html/route.ts`, `src/lib/ai-pipeline/`, `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx`
- Design doc: `docs/phase-09-enhanced-ai-pipeline.md`

---
*Pitfalls research for: Enhanced AI Pipeline v1.1 (phase-09)*
*Researched: 2026-03-19*
