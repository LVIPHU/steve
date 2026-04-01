import OpenAI from "openai";
import { buildSystemPrompt, stripMarkdownFences } from "@/lib/html-prompts";
import { logPipelineStep } from "@/lib/pipeline-logger";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

export async function generateHtml(
  userMessage: string,
  mode: "fresh" | "edit" = "fresh",
  onChunk?: (chunk: string) => void
): Promise<string> {
  const systemPrompt = buildSystemPrompt(mode);
  const t0 = Date.now();
  const stream = await getOpenAI().chat.completions.create(
    {
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      stream: true,
    },
    { signal: AbortSignal.timeout(60000) }
  );

  let full = "";
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content ?? "";
    if (content) {
      full += content;
      onChunk?.(content);
    }
  }
  const result = stripMarkdownFences(full);

  logPipelineStep({
    timestamp: new Date().toISOString(),
    step: "generate",
    model: "gpt-4o",
    systemPrompt,
    userMessage,
    response: result,
    latencyMs: Date.now() - t0,
    metadata: { mode },
  });

  return result;
}
