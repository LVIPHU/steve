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
  snippets: ComponentSnippet[],
  otherPagesContext?: string
): string {
  const googleFontsImport = buildGoogleFontsImport(design.fonts);
  const sections = analysis.sections.join(" \u2192 ") || "auto";

  const radiusMap: Record<string, string> = { sharp: "rounded-md", rounded: "rounded-xl", pill: "rounded-full" };
  const densityMap: Record<string, string> = { compact: "py-12", comfortable: "py-20", spacious: "py-28" };
  const cardStyleMap: Record<string, string> = {
    shadow: "shadow-sm hover:shadow-md",
    bordered: "border border-gray-200 dark:border-gray-700",
    glass: "backdrop-blur-sm bg-white/80",
    flat: "no border/shadow",
  };

  const layoutGuide = `## Layout Guide (from Design System)
- Border radius: ${radiusMap[design.borderRadius] ?? "rounded-xl"}
- Card style: ${cardStyleMap[design.cardStyle] ?? "border border-gray-200 dark:border-gray-700"}
- Section padding: ${densityMap[design.density] ?? "py-20"}
- Hero layout: ${design.heroStyle} (${design.heroStyle === "centered" ? "text-center, content centered" : "split layout with image on one side"})`;

  const snippetBlock = snippets
    .map((s) => {
      const prefix = s.category === "example"
        ? `<!-- REFERENCE EXAMPLE: ${s.id}: ${s.description} — adapt this structure and quality level -->`
        : `<!-- ${s.id}: ${s.description} -->`;
      return `${prefix}\n${s.html}\n<!-- end ${s.id} -->`;
    })
    .join("\n\n");

  const parts = [`## Design Brief
Preset: ${design.preset}
Primary: ${design.palette.primary} | Secondary: ${design.palette.secondary} | Accent: ${design.palette.accent} | BG: ${design.palette.bg}
Heading: ${design.fonts.heading} | Body: ${design.fonts.body}
Google Fonts: ${googleFontsImport}

${layoutGuide}

## Component References
${snippetBlock}

## Page Structure
${sections}

## User Request
${prompt}

## Navigation Convention — CRITICAL
This is a MULTI-PAGE website. Navigation buttons and links in the navbar, hero, feature cards, and footer MUST link to OTHER PAGES using relative hrefs WITHOUT .html extension.

CORRECT examples:
  <a href="vocabulary">Browse Vocabulary</a>
  <a href="quiz">Take Quiz</a>
  <a href="scores">View Scores</a>
  <a href="about">About Us</a>

WRONG — do NOT use anchor links for features that deserve their own page:
  <a href="#vocabulary">Browse Vocabulary</a>  ← WRONG, this just scrolls
  <a href="#quiz">Take Quiz</a>                ← WRONG, this just scrolls

Only use anchor links (#section) for scrolling within the SAME page (e.g. a "scroll to features" button on the same page).
For distinct features (flashcards, quiz, scores, vocabulary list, add content, about, contact) → ALWAYS create a separate page link.`];

  if (otherPagesContext) {
    parts.push(`## Design Context From Existing Pages\nMatch the visual design from these pages for consistency:\n${otherPagesContext}`);
  }

  return parts.join("\n\n");
}

export function buildEditUserMessage(
  prompt: string,
  currentHtml: string,
  otherPagesContext?: string
): string {
  const parts: string[] = [];

  const MAX_HTML_CHARS = 80_000;
  const htmlToInject = currentHtml.length > MAX_HTML_CHARS
    ? currentHtml.slice(0, MAX_HTML_CHARS) + "\n<!-- [HTML truncated due to size] -->"
    : currentHtml;

  parts.push(`## Current HTML (DO NOT discard — modify in place)\n${htmlToInject}`);

  if (otherPagesContext) {
    parts.push(`## Design Context From Other Pages\n${otherPagesContext}`);
  }

  parts.push(`## Edit Instructions
Modify the HTML above according to the user's request below.
CRITICAL RULES:
- Keep ALL existing content, structure, and styling INTACT
- ONLY change what the user specifically requests
- Preserve CSS custom properties (--color-primary, --color-secondary, etc.)
- Preserve Google Fonts @import
- Preserve dark mode classes (dark:...)
- Preserve all CDN script tags already in the HTML
- Output the COMPLETE modified HTML file (not a diff, not a partial)
- Start your response with <!DOCTYPE html>

## User Request\n${prompt}`);

  return parts.join('\n\n');
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
