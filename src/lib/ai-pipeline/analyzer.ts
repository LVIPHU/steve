import OpenAI from "openai";
import type { AnalysisResult } from "./types";

const openai = new OpenAI();

const SYSTEM_PROMPT = `You are a web app intent analyzer. Given a user's prompt, return a JSON object with:
- type: one of "landing" | "portfolio" | "dashboard" | "blog" | "generic"
  landing = product/service/startup page with hero+CTA
  portfolio = personal site, CV, freelance showcase
  dashboard = interactive tool/app: quiz, flashcard, calculator, tracker, data table
  blog = content reading site, articles, recipes, tutorials, docs
  generic = anything else
- sections: array of UI sections needed (e.g. ["navbar", "hero", "flip-cards", "vocab-table", "footer"])
  Recipe/cooking/tutorial content: always include "steps" in sections.
- features: array of JS/CSS features needed (e.g. ["flip-animation", "prev-next-nav", "localStorage", "chart"])
  Recipe/cooking content with timed steps: include "timer" and "countdown".
  Content with checklist or ingredient lists: include "progress" and "localStorage".

Respond with ONLY valid JSON. No markdown, no explanation.`;

export async function analyzePrompt(prompt: string): Promise<AnalysisResult> {
  const completion = await openai.chat.completions.create(
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    },
    { signal: AbortSignal.timeout(30000) }
  );

  const raw = completion.choices[0].message.content ?? "{}";
  const parsed = JSON.parse(raw) as Partial<AnalysisResult>;

  return {
    type: parsed.type ?? "generic",
    sections: parsed.sections ?? [],
    features: parsed.features ?? [],
    structured_data: parsed.structured_data ?? "",
  };
}
