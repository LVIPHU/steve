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
});

export const FALLBACK_DESIGN: DesignResult = {
  preset: "clean-minimal",
  palette: { primary: "#374151", secondary: "#6B7280", accent: "#9CA3AF", bg: "#FFFFFF" },
  fonts: { heading: "Inter", body: "Inter" },
};

const DESIGN_SYSTEM_PROMPT = `You are a visual design expert. Given a website type and user prompt, choose the best visual identity.
Return a JSON object with preset, palette (4 hex colors), and fonts (2 Google Font names).

Preset guidelines:
- bold-dark: fitness, gym, sports, gaming — dark backgrounds, strong colors
- warm-organic: food, cooking, recipes, wellness, nature — warm earthy tones
- playful-bright: education, learning, language, kids — bright cheerful colors
- professional-blue: SaaS, startup, tech, business, finance — trustworthy blues/grays
- clean-minimal: everything else — clean neutrals`;

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
