import OpenAI from "openai";
import type { AnalysisResult, ResearchResult } from "./types";
import { buildFreshSystemPrompt, buildEditSystemPrompt, stripMarkdownFences } from "@/lib/html-prompts";

const openai = new OpenAI();

function buildEnrichedSystemPrompt(
  analysis: AnalysisResult,
  research: ResearchResult,
  currentHtml?: string
): string {
  const base = currentHtml ? buildEditSystemPrompt(currentHtml) : buildFreshSystemPrompt();

  const enrichment = `

=== CONTEXT FROM ANALYSIS ===
App type: ${analysis.type}
Required sections: ${analysis.sections.join(", ") || "none specified"}
Required features: ${analysis.features.join(", ") || "none specified"}
${analysis.structured_data ? `Structured data to embed:\n${analysis.structured_data}` : ""}

=== CSS PATTERNS TO USE ===
${research.css_patterns || "Use standard patterns."}

=== DAISYUI COMPONENTS TO USE ===
${research.daisyui_components || "Use DaisyUI defaults."}

=== LAYOUT RULES ===
${research.layout_rules || "Use sensible defaults."}

Follow ALL of the above exactly. The CSS patterns and layout rules override any defaults you would normally use.`;

  return base + enrichment;
}

export async function generateHtml(
  prompt: string,
  analysis: AnalysisResult,
  research: ResearchResult,
  currentHtml?: string
): Promise<string> {
  const systemPrompt = buildEnrichedSystemPrompt(analysis, research, currentHtml);

  const completion = await openai.chat.completions.create(
    {
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    },
    { signal: AbortSignal.timeout(60000) }
  );

  const raw = completion.choices[0].message.content ?? "";
  return stripMarkdownFences(raw);
}
