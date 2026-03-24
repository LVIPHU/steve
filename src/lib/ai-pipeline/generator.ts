import OpenAI from "openai";
import { buildSystemPrompt, stripMarkdownFences } from "@/lib/html-prompts";

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
  const stream = await getOpenAI().chat.completions.create(
    {
      model: "gpt-4o",
      messages: [
        { role: "system", content: buildSystemPrompt() },
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
  return stripMarkdownFences(full);
}
