import OpenAI from "openai";
import type { AnalysisResult, ResearchResult } from "./types";

const openai = new OpenAI();

const SYSTEM_PROMPT = `You are a frontend research agent. Given a structured analysis of a web app request, produce a JSON object with:
- css_patterns: specific CSS rules the generator MUST include for the detected features. Be explicit with pixel values.
  Examples:
    - flip-animation: ".card { perspective: 1000px; height: 220px; } .card-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.6s; } .card-front, .card-back { position: absolute; inset: 0; backface-visibility: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; }"
    - chart: "canvas element needs explicit width/height"
- daisyui_components: specific DaisyUI class combinations for each section. Be explicit.
  Examples:
    - navbar: "class=\"navbar bg-base-100 shadow-sm\""
    - hero: "class=\"hero min-h-[60vh] bg-base-200\""
    - cards: "class=\"card bg-base-100 shadow-md\" + card-body, card-title"
    - buttons: "btn btn-primary" for main CTA, "btn btn-ghost" for secondary
    - table: "class=\"table table-zebra w-full\""
    - footer: "class=\"footer bg-neutral text-neutral-content p-10\""
- layout_rules: explicit layout constraints for the generator.
  Examples: "use CSS Grid grid-cols-3 gap-6 for features section", "card container height must be 220px", "single card visible at a time with prev/next buttons"

Respond with ONLY valid JSON. No markdown, no explanation.`;

export async function researchContext(analysis: AnalysisResult): Promise<ResearchResult> {
  const input = JSON.stringify(analysis);

  const completion = await openai.chat.completions.create(
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
      response_format: { type: "json_object" },
    },
    { signal: AbortSignal.timeout(20000) }
  );

  const raw = completion.choices[0].message.content ?? "{}";
  const parsed = JSON.parse(raw) as Partial<ResearchResult>;

  return {
    css_patterns: parsed.css_patterns ?? "",
    daisyui_components: parsed.daisyui_components ?? "",
    layout_rules: parsed.layout_rules ?? "",
  };
}
