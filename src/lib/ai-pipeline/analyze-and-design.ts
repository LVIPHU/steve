import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import type { AnalysisResult, DesignResult } from "./types";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

const AnalyzeAndDesignSchema = z.object({
  // Analysis
  type: z.enum(["landing", "portfolio", "dashboard", "blog", "generic"]),
  sections: z.array(z.string()),
  features: z.array(z.string()),
  structured_data: z.string(),
  // Design
  preset: z.enum(["bold-dark", "warm-organic", "clean-minimal", "playful-bright", "professional-blue"]),
  palette: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    bg: z.string(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
});

const SYSTEM_PROMPT = `You are a web design expert. Given a user's website prompt, analyze it and choose the best visual identity.

Return a JSON object with:
- type: landing | portfolio | dashboard | blog | generic
- sections: array of UI sections needed (navbar, hero, features, pricing, testimonials, faq, footer, etc.)
- features: array of JS/CSS features needed (dark-mode, animations, flip-cards, chart, localStorage, timer, etc.)
- structured_data: extracted tabular/structured data from prompt as JSON string, or ""
- preset: bold-dark | warm-organic | clean-minimal | playful-bright | professional-blue
- palette: { primary, secondary, accent, bg } — hex colors matching the preset
- fonts: { heading, body } — Google Font names matching the style

Preset guidelines:
- bold-dark: fitness, gaming, sports, night clubs — dark backgrounds, neon/vivid colors
- warm-organic: food, cooking, wellness, nature — warm earthy tones (amber, orange, green)
- playful-bright: education, learning, kids, creativity — bright cheerful colors
- professional-blue: SaaS, tech, business, finance — trustworthy blues and grays
- clean-minimal: personal, portfolio, wedding, most others — neutral/white with subtle accent`;

export async function analyzeAndDesign(prompt: string): Promise<{
  analysis: AnalysisResult;
  design: DesignResult;
}> {
  const completion = await getOpenAI().beta.chat.completions.parse(
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(AnalyzeAndDesignSchema, "analyze_and_design"),
    },
    { signal: AbortSignal.timeout(20000) }
  );

  const parsed = completion.choices[0].message.parsed!;

  const analysis: AnalysisResult = {
    type: parsed.type,
    sections: parsed.sections,
    features: parsed.features,
    structured_data: parsed.structured_data,
  };

  const design: DesignResult = {
    preset: parsed.preset,
    palette: parsed.palette,
    fonts: parsed.fonts,
  };

  return { analysis, design };
}
