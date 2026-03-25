import { Langfuse } from "langfuse";

// Graceful no-op if keys not set
export const langfuse = process.env.LANGFUSE_SECRET_KEY
  ? new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY ?? "",
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      baseUrl: process.env.LANGFUSE_HOST ?? "https://cloud.langfuse.com",
      flushAt: 1, // Flush immediately (serverless environment)
      flushInterval: 0,
    })
  : null;

export interface StepTrace {
  traceId: string;
  step: string;
  model: string;
  inputLength: number;
  outputLength: number;
  latencyMs: number;
  metadata?: Record<string, unknown>;
}

export function traceStep(trace: StepTrace): void {
  if (!langfuse) return; // no-op when keys not set

  langfuse.generation({
    traceId: trace.traceId,
    name: `pipeline/${trace.step}`,
    model: trace.model,
    input: { length: trace.inputLength },
    output: { length: trace.outputLength },
    metadata: {
      latencyMs: trace.latencyMs,
      estimatedInputTokens: Math.round(trace.inputLength / 4),
      estimatedOutputTokens: Math.round(trace.outputLength / 4),
      ...trace.metadata,
    },
  });
}

export function createTraceId(): string {
  return `gen_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
