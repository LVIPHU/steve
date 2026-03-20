import OpenAI from "openai";
import { buildSystemPrompt, stripMarkdownFences } from "@/lib/html-prompts";
import type { AnalysisResult, DesignResult, ReviewResult } from "./types";
import type { ComponentSnippet } from "@/lib/component-library/types";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

export function buildGoogleFontsImport(fonts: { heading: string; body: string }): string {
  const families = [fonts.heading, fonts.body]
    .filter((f, i, arr) => arr.indexOf(f) === i)
    .map((name) => `family=${name.replace(/ /g, "+")}:wght@400;600;700`)
    .join("&");
  return `@import url('https://fonts.googleapis.com/css2?${families}&display=swap');`;
}

export function buildUserMessage(
  prompt: string,
  analysis: AnalysisResult,
  design: DesignResult,
  snippets: ComponentSnippet[]
): string {
  const googleFontsImport = buildGoogleFontsImport(design.fonts);
  const sections = analysis.sections.join(" \u2192 ") || "auto";

  const snippetBlock = snippets
    .map((s) => `<!-- ${s.id}: ${s.description} -->\n${s.html}\n<!-- end ${s.id} -->`)
    .join("\n\n");

  return `## Design Brief
Preset: ${design.preset}
Primary: ${design.palette.primary} | Secondary: ${design.palette.secondary} | Accent: ${design.palette.accent} | BG: ${design.palette.bg}
Heading: ${design.fonts.heading} | Body: ${design.fonts.body}
Google Fonts: ${googleFontsImport}

## Component References
${snippetBlock}

## Page Structure
${sections}

## User Request
${prompt}`;
}

export function buildEditUserMessage(prompt: string): string {
  return `Preserve existing colors and typography. Do not reset to DaisyUI defaults.

## User Request
${prompt}`;
}

export async function refineHtml(html: string, reviewResult: ReviewResult): Promise<string> {
  const mustFixList = reviewResult.must_fix
    .map((issue, i) => `${i + 1}. ${issue}`)
    .join("\n");
  const userMessage = `Fix the following issues in the HTML:\n\n${mustFixList}\n\nCurrent HTML:\n${html}`;

  const completion = await getOpenAI().chat.completions.create(
    {
      model: "gpt-4o",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: userMessage },
      ],
    },
    { signal: AbortSignal.timeout(60000) }
  );
  return stripMarkdownFences(completion.choices[0].message.content ?? html);
}
