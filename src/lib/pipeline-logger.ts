import fs from "fs";
import path from "path";

export interface PipelineLogEntry {
  timestamp: string;
  traceId?: string;
  step: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  response: string;
  latencyMs: number;
  metadata?: Record<string, unknown>;
}

const MAX_RESPONSE_CHARS = 50_000;
const LOG_PATH = path.join(process.cwd(), ".pipeline-logs.jsonl");

export function logPipelineStep(entry: PipelineLogEntry): void {
  try {
    const response =
      entry.response.length > MAX_RESPONSE_CHARS
        ? entry.response.slice(0, MAX_RESPONSE_CHARS) + "…[truncated]"
        : entry.response;
    fs.appendFileSync(LOG_PATH, JSON.stringify({ ...entry, response }) + "\n");
  } catch {
    // non-fatal — never block pipeline on logging failure
  }
}
