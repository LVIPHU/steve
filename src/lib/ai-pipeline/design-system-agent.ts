/**
 * Agent 3: Design System Agent (LLM — gpt-4o-mini)
 * Create a comprehensive style guide + per-page design specs from the index page design.
 */
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import type { DesignResult, DesignSystem, PagePlan } from "./types";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

const DesignSystemSchema = z.object({
  globalTokens: z.object({
    palette: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      bg: z.string(),
      text: z.string().describe("Main text color"),
      muted: z.string().describe("Muted/secondary text color"),
    }),
    fonts: z.object({
      heading: z.string(),
      body: z.string(),
    }),
    borderRadius: z.enum(["sharp", "rounded", "pill"]),
    cardStyle: z.enum(["flat", "bordered", "shadow", "glass"]),
    density: z.enum(["compact", "comfortable", "spacious"]),
    spacing: z.object({
      sectionPadding: z.string().describe("Tailwind class e.g. 'py-20'"),
      containerMax: z.string().describe("Tailwind class e.g. 'max-w-6xl'"),
    }),
  }),
  sharedComponents: z.object({
    navStyle: z.string().describe("Tailwind classes for nav e.g. 'sticky top-0 bg-white/80 backdrop-blur shadow-sm'"),
    footerStyle: z.string().describe("Tailwind classes for footer e.g. 'bg-gray-900 text-white py-12'"),
    buttonPrimary: z.string().describe("Tailwind classes for primary button"),
    buttonSecondary: z.string().describe("Tailwind classes for secondary/outline button"),
    cardPattern: z.string().describe("Tailwind classes for card component"),
    headingStyle: z.string().describe("Tailwind classes for section headings"),
  }),
  pageDesigns: z.array(z.object({
    name: z.string(),
    heroStyle: z.enum(["centered", "split-left", "split-right", "bg-image", "none"]),
    layout: z.enum(["single-column", "sidebar", "grid", "dashboard"]),
    accentColor: z.string().describe("Page-specific accent color (hex) — can be same as global accent"),
    mood: z.string().describe("Page mood: 'focused', 'celebratory', 'informational', 'interactive', 'calm'"),
    keyComponents: z.array(z.string()).describe("Key UI components for this page: progress-bar, flip-card, data-table, form, etc."),
  })),
});

const SYSTEM_PROMPT = `You are a Design System Architect. Given the index page design tokens and a page plan, create a comprehensive design system that ensures visual consistency across ALL pages.

Your tasks:
1. Inherit and refine the index page's design tokens (palette, fonts, layout)
2. Extract the actual Tailwind patterns used in the index (from the HTML provided)
3. Define shared component styles that MUST be identical across all pages (nav, footer, buttons, cards, headings)
4. For each planned page, choose appropriate layout and mood while maintaining the global design language

Rules:
- Global tokens should closely match the index page — do NOT reinvent the design
- Shared component styles should use EXACT Tailwind classes (not descriptions)
- Each page can have a slightly different mood/layout but MUST use the same palette and fonts
- accentColor for pages should be from the existing palette (primary, secondary, or accent) — not random new colors
- Use the actual CSS from the index HTML to determine existing patterns
- sectionPadding and containerMax should match what the index uses`;

export async function buildDesignSystem(
  indexDesign: DesignResult,
  pagePlan: PagePlan,
  extractedPalette: string[],
  extractedFonts: string[],
  indexHtmlSnippet: string
): Promise<DesignSystem> {
  const pageList = pagePlan.pages
    .map((p) => `- ${p.name}: ${p.purpose} (sections: ${p.sections.join(", ")})`)
    .join("\n");

  const userMessage = `## Index Page Design Tokens
Preset: ${indexDesign.preset}
Palette: primary=${indexDesign.palette.primary}, secondary=${indexDesign.palette.secondary}, accent=${indexDesign.palette.accent}, bg=${indexDesign.palette.bg}
Fonts: heading=${indexDesign.fonts.heading}, body=${indexDesign.fonts.body}
Border radius: ${indexDesign.borderRadius}
Card style: ${indexDesign.cardStyle}
Hero style: ${indexDesign.heroStyle}
Density: ${indexDesign.density}

## Extracted CSS from Index HTML
Palette vars: ${extractedPalette.join("; ") || "(none)"}
Fonts used: ${extractedFonts.join(", ") || "(from design tokens)"}

## Index HTML (first 4K for pattern analysis)
${indexHtmlSnippet.slice(0, 4000)}

## Pages to Design
${pageList}`;

  const completion = await getOpenAI().chat.completions.parse(
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: zodResponseFormat(DesignSystemSchema, "design_system"),
    },
    { signal: AbortSignal.timeout(25000) }
  );

  return completion.choices[0].message.parsed! as DesignSystem;
}
