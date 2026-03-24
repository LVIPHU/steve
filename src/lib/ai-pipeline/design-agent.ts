import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { AnalysisResult, DesignResult } from "./types";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

export const DesignResultSchema = z.object({
  preset: z.enum(["bold-dark", "warm-organic", "clean-minimal", "playful-bright", "professional-blue"]),
  palette: z.object({
    primary: z.string().describe("Hex color e.g. #E63946"),
    secondary: z.string().describe("Hex color"),
    accent: z.string().describe("Hex color"),
    bg: z.string().describe("Background hex color"),
  }),
  fonts: z.object({
    heading: z.string().describe("Google Font name e.g. Montserrat"),
    body: z.string().describe("Google Font name e.g. Inter"),
  }),
  borderRadius: z.enum(["sharp", "rounded", "pill"])
    .describe("sharp=rounded-md, rounded=rounded-xl, pill=rounded-full"),
  cardStyle: z.enum(["flat", "bordered", "shadow", "glass"])
    .describe("flat=no decoration, bordered=border only, shadow=shadow-sm, glass=backdrop-blur"),
  heroStyle: z.enum(["centered", "split-left", "split-right", "bg-image"])
    .describe("Layout of the hero section"),
  density: z.enum(["compact", "comfortable", "spacious"])
    .describe("compact=py-12, comfortable=py-20, spacious=py-28"),
});

export const FALLBACK_DESIGN: DesignResult = {
  preset: "clean-minimal",
  palette: { primary: "#374151", secondary: "#6B7280", accent: "#9CA3AF", bg: "#FFFFFF" },
  fonts: { heading: "Inter", body: "Inter" },
  borderRadius: "rounded",
  cardStyle: "bordered",
  heroStyle: "centered",
  density: "comfortable",
};

const DESIGN_SYSTEM_PROMPT = `You are a visual design expert. Given a website type and user prompt, choose the best visual identity.
Return a JSON object with preset, palette (4 hex colors), fonts (2 Google Font names), and layout tokens.

Preset guidelines:
- bold-dark: fitness, gym, sports, gaming — dark backgrounds, strong colors
- warm-organic: food, cooking, recipes, wellness, nature — warm earthy tones
- playful-bright: education, learning, language, kids — bright cheerful colors
- professional-blue: SaaS, startup, tech, business, finance — trustworthy blues/grays
- clean-minimal: everything else — clean neutrals

Layout token guidelines:
- borderRadius: sharp=squared UI (SaaS dashboards), rounded=modern (most sites), pill=friendly (education, wellness)
- cardStyle: flat=ultra minimal, bordered=clean structured, shadow=depth/warmth, glass=modern blurred overlay
- heroStyle: centered=standard, split-left/split-right=with image, bg-image=full bleed photo
- density: compact=data-heavy dashboards, comfortable=most sites, spacious=luxury/editorial`;

export async function runDesignAgent(
  prompt: string,
  analysis: AnalysisResult
): Promise<DesignResult> {
  try {
    const completion = await getOpenAI().chat.completions.parse(
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: DESIGN_SYSTEM_PROMPT },
          { role: "user", content: `Site type: ${analysis.type}\n\n${prompt}` },
        ],
        response_format: zodResponseFormat(DesignResultSchema, "design_result"),
      },
      { signal: AbortSignal.timeout(20000) }
    );
    return completion.choices[0].message.parsed ?? FALLBACK_DESIGN;
  } catch {
    return FALLBACK_DESIGN;
  }
}
