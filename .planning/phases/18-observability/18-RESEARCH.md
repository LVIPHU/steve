# Phase 18: Observability - Research

**Researched:** 2026-03-25
**Domain:** Langfuse Node.js SDK v3 API, Next.js App Router serverless compatibility
**Confidence:** HIGH (sourced directly from package type definitions)

---

## Summary

This research resolves concrete API uncertainty for the `langfuse` npm package (v3.38.6, the current `latest` tag as of March 2026). The v3 API uses the classic `Langfuse` class with `trace()` / `generation()` / `update()` methods — **not** the v4/v5 OTel-based `@langfuse/tracing` API shown in current docs. The `langfuse` npm package has NOT been updated to v4/v5; it remains at 3.x. All PLAN.md files should use this v3 API shape.

For Next.js App Router (Node.js runtime), the package works without modification. The only serverless concern is flushing: `flushAsync()` must be awaited before the response ends to avoid lost events.

**Primary recommendation:** Import `Langfuse` from `langfuse`, use `langfuse.trace()` → `trace.generation()` → `generation.update()` → `generation.end()` → `await langfuse.flushAsync()`. The update-after-streaming pattern is fully supported.

---

## Topic 1: Langfuse Node.js SDK v3 API Shape

### Finding: Package name and version

**Finding:** The npm package name is `langfuse` (not `@langfuse/tracing` or `@langfuse/client`). The current `latest` tag is **3.38.6**, published 2025-10-16. The v4/v5 packages (`@langfuse/tracing` etc.) are separate packages in a new monorepo structure. The `langfuse` 3.x package is still the correct choice for direct, non-OTel tracing.

**Source:** `npm view langfuse dist-tags` — verified live against npm registry 2026-03-25
**Confidence impact:** HIGH — eliminates package name ambiguity entirely.

---

### Finding: Constructor signature

The exported class is `Langfuse` (default export and named export). Constructor:

```typescript
import Langfuse from "langfuse"; // or: import { Langfuse } from "langfuse";

const langfuse = new Langfuse({
  publicKey: "pk-lf-...",   // falls back to LANGFUSE_PUBLIC_KEY env var
  secretKey: "sk-lf-...",   // falls back to LANGFUSE_SECRET_KEY env var
  baseUrl: "https://cloud.langfuse.com", // falls back to LANGFUSE_BASE_URL env var
  // Optional:
  flushAt: 1,               // flush after every event (good for serverless)
  flushInterval: 0,         // disable timer-based flush in serverless
  enabled: true,            // set false to disable entirely
  environment: "production",
});
```

All three credential fields (`publicKey`, `secretKey`, `baseUrl`) are **optional in the type** — they fall back to env vars `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASE_URL`. So `new Langfuse()` with no args works if env vars are set.

The graceful no-op pattern from CONTEXT.md is correct:
```typescript
export const langfuse = process.env.LANGFUSE_SECRET_KEY
  ? new Langfuse({ publicKey: process.env.LANGFUSE_PUBLIC_KEY, secretKey: process.env.LANGFUSE_SECRET_KEY, baseUrl: process.env.LANGFUSE_BASE_URL })
  : null;
```

**Source:** `/tmp/lf38/package/lib/index.d.ts` — extracted directly from `langfuse@3.38.6` npm tarball
**Confidence impact:** HIGH — exact constructor shape confirmed from package types.

---

### Finding: Creating a parent trace

```typescript
// Returns LangfuseTraceClient
const trace = langfuse.trace({
  name: "pipeline-run",          // string, optional
  userId: "user-123",            // string, optional
  sessionId: "session-abc",      // string, optional
  input: { prompt: "..." },      // any JSON, optional
  output: { html: "..." },       // any JSON, optional — can update later
  metadata: { websiteId: "..." },// any JSON, optional
  tags: ["generate", "prod"],    // string[], optional
  environment: "production",     // string, optional
  public: false,                 // boolean, optional
});

// LangfuseTraceClient has:
// trace.update(body) — update trace fields
// trace.generation(body) — create child generation
// trace.span(body) — create child span
// trace.getTraceUrl() — returns URL to trace in Langfuse UI
```

**Source:** `langfuse-core@3.38.6` type definitions — `LangfuseCore.trace()` and `LangfuseTraceClient` class
**Confidence impact:** HIGH — exact method shape confirmed.

---

### Finding: Creating a child generation span

```typescript
// Called on a LangfuseTraceClient (or directly on langfuse for a standalone generation)
// Returns LangfuseGenerationClient
const generation = trace.generation({
  name: "generate",              // string, identifies step name
  model: "gpt-4o-mini",         // string, model name for cost calculation
  input: [...messages],          // any JSON — the messages array sent to OpenAI
  // startTime is auto-set to now if omitted
  startTime: new Date(),         // Date, optional
  endTime: new Date(),           // Date, optional — or set via .end()
  metadata: { stepName: "..." }, // any JSON, optional
  environment: "production",     // optional
  // DO NOT pass output here if streaming — set via .update() after stream ends
});
```

Full `CreateGenerationBody` (extends `CreateSpanBody` which extends `CreateEventBody`):
- Inherits: `id`, `name`, `traceId`, `parentObservationId`, `startTime`, `endTime`, `input`, `output`, `metadata`, `level`, `statusMessage`, `version`, `environment`
- Generation-specific: `model`, `modelParameters`, `usage`, `usageDetails`, `costDetails`, `completionStartTime`

**Source:** `langfuse-core@3.38.6` `CreateGenerationBody` schema in type definitions
**Confidence impact:** HIGH — exact parameter shapes extracted from package.

---

### Finding: Updating a generation AFTER streaming completes

**YES, fully supported.** `LangfuseGenerationClient.update()` can be called at any time after creation. This is the standard pattern for streaming:

```typescript
// 1. Create generation BEFORE streaming starts (captures startTime)
const generation = trace.generation({
  name: "generate",
  model: "gpt-4o-mini",
  input: messages,
  startTime: new Date(),
});

// 2. ... perform streaming call ...
// stream tokens to client SSE ...

// 3. AFTER streaming ends, update with output and token usage
generation.update({
  output: finalHtml,             // the complete generated output
  endTime: new Date(),           // or use .end() which auto-sets endTime
  usage: {
    promptTokens: inputTokens,
    completionTokens: outputTokens,
    totalTokens: totalTokens,
  },
  // OR use usageDetails for more detail:
  usageDetails: {
    input: inputTokens,
    output: outputTokens,
  },
  metadata: { latencyMs: elapsed },
});

// 4. End the generation (sets endTime if not already set)
generation.end();
```

`UpdateLangfuseGenerationBody` has the same fields as `CreateGenerationBody` — model, output, usage, usageDetails, endTime, metadata, etc. — all optional. The update is sent as a separate ingestion event that is merged server-side.

**Source:** `LangfuseGenerationClient.update()` and `LangfuseGenerationClient.end()` type signatures; confirmed by Discussion #2801 where maintainer confirmed update works, the issue was only serverless flush timing.
**Confidence impact:** HIGH — resolves the streaming update question definitively.

---

### Finding: flushAsync / shutdown

```typescript
// For serverless / API routes — await before response ends:
await langfuse.flushAsync();   // flushes all queued events, returns Promise<void>

// Alternatively (sync fire-and-forget):
langfuse.flush();              // non-blocking callback-based flush

// Full shutdown (long-lived processes):
await langfuse.shutdownAsync(); // flush + cleanup
langfuse.shutdown();            // sync version
```

Both `flushAsync()` and `shutdownAsync()` exist. For Next.js API routes, `flushAsync()` is sufficient and is what the official Langfuse serverless FAQ recommends.

**Source:** `LangfuseCoreStateless` class in `langfuse-core@3.38.6` type definitions — methods at lines 7433, 7449, 7451
**Confidence impact:** HIGH — exact method names confirmed from package types.

---

## Topic 2: Next.js App Router Runtime Compatibility

### Finding: Node.js runtime compatibility

**Finding:** The `langfuse` v3 package works without issues in Next.js App Router API routes running on the Node.js runtime (the default for `route.ts` files). It uses standard Node.js `fetch` and does not require any special configuration.

There is NO compatibility issue with Node.js runtime. The package is NOT compatible with the Edge runtime (no `export const runtime = 'edge'` — Edge lacks Node.js crypto, Buffer, etc.). Our pipeline routes already run on Node.js runtime by default.

**Source:** Langfuse docs state Edge runtime is not supported for the v3 SDK; Node.js is the default and correct runtime. Confirmed by community usage patterns.
**Confidence impact:** HIGH — no action needed, default runtime works.

---

### Finding: Vercel serverless flush pattern

**Finding:** The critical pattern for Vercel/serverless is calling `flushAsync()` BEFORE returning the response. In long-lived SSE streaming routes (`/api/ai/generate-html`), this means calling `flushAsync()` after the stream `controller.close()` but before the Response is fully resolved.

Recommended patterns:

```typescript
// Pattern A: Await flush at end of route handler (simplest, blocks response slightly)
export async function POST(req: Request) {
  // ... run pipeline with tracing ...
  await langfuse?.flushAsync();
  return response;
}

// Pattern B: For SSE streaming routes — flush after stream closes
const stream = new ReadableStream({
  async start(controller) {
    // ... generate and stream events ...
    controller.close();
    // Flush AFTER closing stream, before handler returns
    await langfuse?.flushAsync();
  }
});
return new Response(stream, { headers: sseHeaders });
```

**Important:** The `langfuse.flushAsync()` call adds ~50-200ms latency after the stream closes but before the function terminates. This is acceptable since the client has already received all SSE events before `controller.close()`.

For constructor in serverless, consider:
```typescript
new Langfuse({
  flushAt: 1,        // send each event immediately
  flushInterval: 0,  // disable the interval timer
})
```
This makes each observation send immediately, reducing the need to rely on `flushAsync()`.

**Source:** Langfuse serverless FAQ (https://langfuse.com/faq/all/aws-lambda-and-serverless-functions); Discussion #2801 confirmed same pattern; Community pattern from search results showing `waitUntil(langfuse.flushAsync())`.
**Confidence impact:** HIGH for the pattern; MEDIUM for the latency estimate (not benchmarked).

---

## Summary Table

| Question | Answer | Confidence |
|----------|--------|------------|
| npm package name | `langfuse` (not `@langfuse/tracing`) | HIGH |
| Current version | 3.38.6 (latest tag, Oct 2025) | HIGH |
| Constructor args | `{ publicKey?, secretKey?, baseUrl? }` + LangfuseCoreOptions | HIGH |
| Create trace | `langfuse.trace({ name, userId, input, ... })` → `LangfuseTraceClient` | HIGH |
| Create generation | `trace.generation({ name, model, input, startTime, ... })` → `LangfuseGenerationClient` | HIGH |
| Update after streaming | YES — `generation.update({ output, usage, endTime })` then `generation.end()` | HIGH |
| Flush method | `await langfuse.flushAsync()` | HIGH |
| Shutdown method | `await langfuse.shutdownAsync()` or `langfuse.shutdown()` | HIGH |
| Next.js Node.js runtime | Fully compatible, no special config | HIGH |
| Edge runtime | NOT compatible | HIGH |
| Serverless flush pattern | Await `flushAsync()` after stream closes, before handler returns | HIGH |

---

## SDK Version Warning

The official Langfuse docs website now shows v5 content (`@langfuse/tracing`, OTel-based API). The `langfuse` npm package remains at 3.x and has a completely different API. **Do not use the current docs website as reference for the `langfuse` npm package.** Use these type definitions as ground truth.

If upgrading to v4/v5 is desired in the future, that requires switching to `@langfuse/tracing` + `@langfuse/otel` + `@opentelemetry/sdk-node` — a significant rework. Out of scope for Phase 18.

---

## Sources

### Primary (HIGH confidence)
- `langfuse@3.38.6` npm tarball — `package/lib/index.d.ts` — Langfuse/LangfuseWeb class definitions, LangfuseOptions
- `langfuse-core@3.38.6` npm tarball — `package/lib/index.d.ts` — LangfuseCoreOptions, LangfuseCore, LangfuseTraceClient, LangfuseGenerationClient, CreateGenerationBody, UpdateGenerationBody, flushAsync/shutdown
- `npm view langfuse dist-tags` — version 3.38.6 is current `latest`

### Secondary (MEDIUM confidence)
- [Langfuse serverless FAQ](https://langfuse.com/faq/all/aws-lambda-and-serverless-functions) — flush pattern guidance
- [Langfuse GitHub Discussion #2801](https://github.com/orgs/langfuse/discussions/2801) — confirmed update-after-streaming works; issue was only flush timing in Lambda
- [Langfuse SDK upgrade path](https://langfuse.com/docs/observability/sdk/upgrade-path/js-v3-to-v4) — confirmed v3 `trace()`/`generation()`/`span()` methods replaced in v4

### Tertiary (LOW confidence — informational only)
- WebSearch results confirming `flushAsync` community usage patterns

---

**Research date:** 2026-03-25
**Valid until:** 2026-06-25 (stable API, 90-day validity unless langfuse publishes 4.x to `latest` tag)
