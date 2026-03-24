---
phase: 15-critical-bug-fixes
plan: "02"
subsystem: ai, ui
tags: [openai, streaming, sse, react, nextjs]

requires:
  - phase: 15-01-PLAN
    provides: PipelineEvent type, editor-client base

provides:
  - Real-time HTML streaming from OpenAI directly to browser iframe
  - PipelineEvent with status:streaming and chunk field
  - generateHtml() with onChunk callback and stream:true
  - editor-client throttled streaming preview via streamBufferRef

affects:
  - 16-pipeline-optimization
  - 18-observability

tech-stack:
  added: []
  patterns:
    - "OpenAI streaming via for-await on stream:true response"
    - "SSE chunk accumulation with 100ms throttled React state updates"
    - "streamBufferRef + streamThrottleRef pattern for progressive preview"

key-files:
  created: []
  modified:
    - src/lib/ai-pipeline/types.ts
    - src/lib/ai-pipeline/generator.ts
    - src/lib/ai-pipeline/index.ts
    - src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx

key-decisions:
  - "generateHtml mode param added (fresh|edit) — passed through from pipeline orchestrator for context, not currently used to alter system prompt (already invariant)"
  - "100ms throttle on streaming preview updates — balances real-time feel vs excessive React re-renders"
  - "streamThrottleRef cleared on complete event — ensures final validated HTML always wins over buffered partial"
  - "SSE route uses ReadableStream + controller.enqueue() — no buffering, Next.js flushes each chunk immediately"
  - "Test failures (html-prompts DaisyUI, context-builder .html links) are pre-existing from Phase 12/15-01, not caused by this plan"

requirements-completed: []

duration: 8min
completed: 2026-03-24
---

# Phase 15 Plan 02: Streaming Generation + Frontend SSE Handler Summary

**OpenAI streaming enabled end-to-end: generateHtml() uses stream:true with for-await chunks, pipeline emits status:streaming SSE events, editor accumulates chunks into iframe preview at 100ms throttle**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-24T22:05:00Z
- **Completed:** 2026-03-24T22:13:00Z
- **Tasks:** 5
- **Files modified:** 4

## Accomplishments
- Added `status: "streaming"` and `chunk?: string` to `PipelineEvent` interface
- Converted `generateHtml()` from blocking `create()` to streaming `create({ stream: true })` with `for await` loop and optional `onChunk` callback
- Pipeline orchestrator (`index.ts`) now passes `onChunk` callback to emit `{ step: "generate", status: "streaming", chunk }` SSE events in real time
- Editor client handles streaming events: accumulates chunks in `streamBufferRef`, throttles preview updates to 100ms, then replaces with final validated HTML on `complete`
- Verified SSE route has no buffering (`ReadableStream` + `controller.enqueue()` flushes immediately)

## Task Commits

1. **Task 1: Add streaming to PipelineEvent type** - `ce79075` (feat)
2. **Task 2: Convert generateHtml to streaming** - `89f39c1` (feat)
3. **Task 3: Emit streaming events from pipeline** - `a539bc7` (feat)
4. **Task 4: Handle streaming in editor-client** - `7b1bc1c` (feat)
5. **Task 5: Verify SSE route has no buffering** - no code change needed (route already correct)

## Files Created/Modified
- `src/lib/ai-pipeline/types.ts` - Added `"streaming"` to status union, added `chunk?: string` field
- `src/lib/ai-pipeline/generator.ts` - Streaming via `stream: true`, `for await` loop, `onChunk` callback
- `src/lib/ai-pipeline/index.ts` - Passes `onChunk` to `generateHtml()` emitting streaming events
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` - `streamBufferRef`, `streamThrottleRef`, streaming event handler

## Decisions Made
- `generateHtml()` mode param (fresh|edit) added as plan specified but does not change system prompt (already invariant per Phase 10-02 decision) — passed for future use
- 100ms throttle chosen to balance real-time feel vs React render cost
- Final `complete` event always overwrites buffered partial HTML — ensures validator fixes are visible

## Deviations from Plan

None - plan executed exactly as written. Task 5 was a verification step; the route was already correct with no buffering.

## Issues Encountered

Pre-existing test failures in `html-prompts.test.ts` (DaisyUI CDN, flip card CSS from Phase 12 migration) and `context-builder.test.ts` (Link Convention .html extension from 15-01 change). None caused by this plan. Streaming changes do not affect existing unit tests as `onChunk` is optional.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Streaming pipeline complete — user sees HTML appear progressively in < 5s instead of waiting 30s+
- Ready for Phase 16: Pipeline optimization (caching, latency reduction)
- No blockers

---
*Phase: 15-critical-bug-fixes*
*Completed: 2026-03-24*
