# Phase 18: observability - Context

**Gathered:** 2026-03-25 (assumptions mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Langfuse tracing to every LLM-calling pipeline step + an eval test suite with 20+ prompts. Both features are opt-in: Langfuse must gracefully no-op when keys are absent; eval suite runs manually via `npm run eval` (not part of `npm run test`).
</domain>

<decisions>
## Implementation Decisions

### Langfuse Client Module
- **D-01:** Create `src/lib/langfuse.ts` exporting a nullable client: `export const langfuse = process.env.LANGFUSE_SECRET_KEY ? new Langfuse({ flushAt: 1, flushInterval: 0 }) : null;`
- **D-02:** SDK reads `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASE_URL` from env vars automatically — no need to pass them explicitly to constructor. Graceful no-op is achieved by checking `LANGFUSE_SECRET_KEY` before instantiating.
- **D-03:** `flushAt: 1, flushInterval: 0` — serverless pattern: flush immediately after each event rather than waiting for a batch timer. Required on Vercel serverless (functions exit after response).
- **D-04:** `.env.example` gets `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASE_URL` entries (commented optional section).

### Pipeline Instrumentation Pattern
- **D-05:** All tracing instrumentation goes in `src/lib/ai-pipeline/index.ts` (orchestrator only) — not inside individual step modules (analyzer.ts, generator.ts, etc.). The orchestrator already owns step lifecycle via `onEvent({step, status: "start/done"})` boundaries — these are the natural timing hooks.
- **D-06:** One parent trace per `runGenerationPipeline()` call: `const trace = langfuse?.trace({ name: "pipeline-run", input: { prompt } })`. End it at function return with `trace?.end()`.
- **D-07:** Each LLM-calling step gets a child generation span: `trace?.generation({ name, model, input, startTime })`. End with `gen?.end({ output, endTime })` after step completes.
- **D-08:** Streaming step (`generateHtml`) uses `gen?.update({ output: fullHtml, endTime: new Date() })` after the stream completes — Langfuse v3 supports post-stream updates via a separate `generation-update` ingestion event.
- **D-09:** Validator step is sync with no LLM call → no generation span needed, optional timing metadata on trace only.
- **D-10:** SSE route (`src/app/api/ai/generate-html/route.ts`) must call `await langfuse?.flushAsync()` before closing the stream, so all events are flushed before the serverless function exits.

### Langfuse Tracing Granularity
- **D-11:** 4 generation spans per fresh mode run:
  1. `analyze-design` (gpt-4o-mini, fresh) / `analyze` (gpt-4o-mini, edit mode)
  2. `generate` (gpt-4o, streaming — update after stream ends)
  3. `review` (gpt-4o-mini, conditional — only when shouldReview=true)
  4. `refine` (gpt-4o, conditional — only when needsRefine=true)
- **D-12:** Each generation span captures: `model`, `input` (messages or prompt length), `output` (result text or length), `startTime`, `endTime` (for latency).

### Eval Suite Structure
- **D-13:** Eval lives in `tests/eval/` — two files: `prompts.ts` (20+ prompt entries with criteria) and `runner.ts` (script that calls `runGenerationPipeline()` directly).
- **D-14:** New script in `package.json`: `"eval": "npx tsx tests/eval/runner.ts"` — completely separate from Vitest; does not run on `npm run test`.
- **D-15:** Eval runner loads `.env` via `dotenv/config` before calling the pipeline (needs `OPENAI_API_KEY`).
- **D-16:** Runner outputs a per-prompt pass/fail summary to stdout + final score (X/20 passed).

### Eval Criteria and Scoring
- **D-17:** Each prompt entry has declarative criteria (not expected HTML snapshots — output is non-deterministic):
  ```typescript
  { prompt: "...", criteria: { minLength: 3000, minScore: 70, mustContain: ["navbar"] } }
  ```
- **D-18:** Runner evaluates criteria programmatically: HTML length check, `reviewHtml()` score check, and string presence checks for `mustContain` terms.
- **D-19:** 20 prompts minimum, covering all 5 types: landing, portfolio, dashboard, blog, generic — 4 prompts each.

### Claude's Discretion
- Exact structure of `LangfusePromptInput` per step (can pass prompt string, message array, or truncated version for large inputs)
- Whether to add `userId` or `sessionId` metadata to traces (nice-to-have for filtering in dashboard)
- Exact console.warn fallback when Langfuse keys are missing and tracing is attempted

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Pipeline Orchestrator
- `src/lib/ai-pipeline/index.ts` — runGenerationPipeline() function, all step boundaries, onEvent calls — PRIMARY instrumentation target

### Existing Step Modules (read to understand model names + input shapes)
- `src/lib/ai-pipeline/analyze-and-design.ts` — merged gpt-4o-mini call (fresh mode)
- `src/lib/ai-pipeline/analyzer.ts` — separate analyze call (edit mode)
- `src/lib/ai-pipeline/generator.ts` — gpt-4o streaming call
- `src/lib/ai-pipeline/reviewer.ts` — gpt-4o-mini review call
- `src/lib/ai-pipeline/context-builder.ts` — refineHtml() (gpt-4o refine call)

### SSE Route (flush point)
- `src/app/api/ai/generate-html/route.ts` — stream close → flushAsync() must happen here

### Env Config
- `.env.example` — add LANGFUSE_* entries

### Research
- `.planning/phases/18-observability/18-RESEARCH.md` — Langfuse v3.38.6 SDK API (constructor, trace, generation, update, flushAsync). **Important:** npm docs show v5; use v3 API from this research file.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/ai-pipeline/index.ts` `onEvent` boundaries — already have `step, status: "start"/"done"` events; `Date.now()` can be captured at start event for latency calculation
- `src/lib/ai-pipeline/types.ts` `ReviewResult` — `score`, `must_fix[]`, dimension sub-scores usable as eval pass/fail signals
- `src/lib/ai-pipeline/validator.ts` `validateAndFix()` — returns `{ html, fixes, warnings }` usable in eval criteria
- Existing Vitest tests in `src/lib/ai-pipeline/*.test.ts` — show test file patterns; eval suite follows similar structure but uses `tsx` runner not Vitest

### Established Patterns
- Lazy OpenAI client init (`getOpenAI()` function wrapper in design-agent.ts) — same pattern for `getLangfuse()` if needed, but nullable export is simpler given no-op requirement
- Env var runtime reads inside functions (not module-level) — see `REVIEW_THRESHOLD` pattern in index.ts; apply to Langfuse keys for test isolation
- `dotenv` already in dependencies — can use `import "dotenv/config"` in eval runner

### Integration Points
- `runGenerationPipeline()` in `index.ts` — primary integration point for tracing
- `src/app/api/ai/generate-html/route.ts` — must call `await langfuse?.flushAsync()` after `controller.close()`
- `package.json` scripts — add `"eval"` script
- `.env.example` — add Langfuse env vars

</code_context>

<specifics>
## Specific Ideas

- Langfuse free tier: 50K observations/month — sufficient for development + low-volume production
- Self-hosted option available (set `LANGFUSE_BASE_URL` to self-hosted instance)
- Dashboard use case: compare latency before/after Phase 16 optimization (analyzeAndDesign merged step)
- Eval suite should cover both fresh mode and edit mode prompts for balanced coverage

</specifics>

<deferred>
## Deferred Ideas

- Automated eval on schedule / CI — runs manually for now (opt-in cost control)
- Langfuse prompt management (storing prompts in Langfuse dashboard) — separate capability
- Cost tracking per user / per website — requires userId in traces; nice-to-have, not required

</deferred>

---

*Phase: 18-observability*
*Context gathered: 2026-03-25*
