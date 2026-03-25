# Phase 18: observability - Discussion Log (Assumptions Mode)

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the analysis.

**Date:** 2026-03-25
**Phase:** 18-observability
**Mode:** assumptions
**Areas analyzed:** Langfuse Integration Approach, Pipeline Instrumentation Pattern, Langfuse Tracing Granularity, Eval Suite Structure, Eval Criteria and Scoring

## Assumptions Presented

### Langfuse Integration Approach
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Nullable client in src/lib/langfuse.ts, guard on LANGFUSE_SECRET_KEY, flushAt:1 serverless pattern | Confident | 18-CONTEXT.md pattern + ROADMAP.md success criterion 2 + langfuse package absent (MODULE_NOT_FOUND) |

### Pipeline Instrumentation Pattern
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Tracing centralized in index.ts orchestrator, not in individual step modules | Confident | index.ts already owns all step lifecycle events (onEvent start/done) at each step boundary |

### Langfuse Tracing Granularity
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| 4 generation spans per run (analyze-design, generate, review, refine); validator not traced | Likely | ROADMAP.md success criterion 1; index.ts lines 33,52,81,112,123 LLM calls identified |

### Eval Suite Structure
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| tests/eval/ directory, tsx runner, npm run eval script, separate from Vitest | Confident | 18-CONTEXT.md file names; CONTEXT.md explicit "chạy thủ công" note; no eval script in package.json |

### Eval Criteria and Scoring
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Declarative criteria (minLength, minScore, mustContain) — not HTML snapshots | Likely | CONTEXT.md "không phải expected output cụ thể"; ReviewResult score available as structured signal |

## Corrections Made

No corrections — all assumptions confirmed by user.

## External Research

Research performed via gsd-phase-researcher agent. Research file: `.planning/phases/18-observability/18-RESEARCH.md`

- **Langfuse SDK API (v3.38.6):** constructor args, trace(), generation(), update() post-stream, flushAsync() — all confirmed from npm tarball type definitions (HIGH confidence)
- **Next.js compatibility:** Node.js runtime fully compatible; `await langfuse?.flushAsync()` must be called before closing SSE stream in route.ts
- **Important warning:** Langfuse docs website now shows v5 (OpenTelemetry-based); npm package remains at v3.38.6 — use v3 API from research file
