import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import type { AnalysisResult, DesignResult } from "./types";
import { logPipelineStep } from "@/lib/pipeline-logger";

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
  borderRadius: z.enum(["sharp", "rounded", "pill"])
    .describe("sharp=rounded-md, rounded=rounded-xl, pill=rounded-full"),
  cardStyle: z.enum(["flat", "bordered", "shadow", "glass"])
    .describe("flat=no decoration, bordered=border only, shadow=shadow-sm, glass=backdrop-blur"),
  heroStyle: z.enum(["centered", "split-left", "split-right", "bg-image"])
    .describe("Layout of the hero section"),
  density: z.enum(["compact", "comfortable", "spacious"])
    .describe("compact=py-12, comfortable=py-20, spacious=py-28"),
});

const SYSTEM_PROMPT = `You are a web design expert. Given a user's website prompt, analyze it and choose the best visual identity.

Return a JSON object with:
- type: landing | portfolio | dashboard | blog | generic
  Type classification rules (STRICT):
  - landing: product/service/startup/company page — purpose is MARKETING (hero+CTA+features+pricing+testimonials)
  - dashboard: interactive tool/app — purpose is FUNCTIONALITY (quiz, flashcard, vocabulary, calculator, tracker, todo, form, game)
  - IMPORTANT: flashcard / vocabulary / quiz / learning / language apps are ALWAYS "dashboard", NEVER "landing"
  - portfolio: personal site, CV, freelance showcase
  - blog: content reading site, articles, recipes, tutorials, docs
  - generic: anything else that doesn't fit above
- sections: array of UI sections needed
  For dashboard apps use specific section names:
  - Flashcard/vocabulary: ["navbar", "flip-cards", "progress-bar", "add-vocab-form", "footer"]
  - Quiz/test: ["navbar", "quiz-panel", "score-board", "footer"]
  - Calculator/tracker: ["navbar", "calculator", "history-panel", "footer"]
  For landing pages: navbar, hero, features, pricing, testimonials, faq, footer, etc.
- features: array of JS/CSS features needed
  For flashcard/vocabulary apps always include: ["flip-animation", "prev-next-nav", "localStorage"]
  For quiz apps always include: ["quiz", "timer", "localStorage"]
  Other features: dark-mode, animations, chart, search, drag
- structured_data: extracted tabular/structured data from prompt as JSON string, or ""
- preset: bold-dark | warm-organic | clean-minimal | playful-bright | professional-blue
- palette: { primary, secondary, accent, bg } — hex colors matching the preset
- fonts: { heading, body } — Google Font names matching the style
- borderRadius: sharp | rounded | pill
- cardStyle: flat | bordered | shadow | glass
- heroStyle: centered | split-left | split-right | bg-image
- density: compact | comfortable | spacious

Preset guidelines:
- bold-dark: fitness, gaming, sports, night clubs — dark backgrounds, neon/vivid colors
- warm-organic: food, cooking, wellness, nature — warm earthy tones (amber, orange, green)
- playful-bright: education, learning, vocabulary, flashcard, quiz, language learning, kids, creativity — bright cheerful colors
- professional-blue: SaaS, tech, business, finance — trustworthy blues and grays
- clean-minimal: personal, portfolio, wedding, most others — neutral/white with subtle accent

Layout token guidelines:
- borderRadius: sharp=squared UI (dashboards), rounded=modern (most sites), pill=friendly (education, wellness)
- cardStyle: flat=ultra minimal, bordered=clean structured, shadow=depth/warmth, glass=modern overlay
- heroStyle: centered=standard, split-left/split-right=with image, bg-image=full bleed photo
- density: compact=data-heavy dashboards, comfortable=most sites, spacious=luxury/editorial`;

export async function analyzeAndDesign(prompt: string): Promise<{
  analysis: AnalysisResult;
  design: DesignResult;
}> {
  const t0 = Date.now();
  const completion = await getOpenAI().chat.completions.parse(
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
    borderRadius: parsed.borderRadius,
    cardStyle: parsed.cardStyle,
    heroStyle: parsed.heroStyle,
    density: parsed.density,
  };

  logPipelineStep({
    timestamp: new Date().toISOString(),
    step: "analyze_and_design",
    model: "gpt-4o-mini",
    systemPrompt: SYSTEM_PROMPT,
    userMessage: prompt,
    response: JSON.stringify({ analysis, design }),
    latencyMs: Date.now() - t0,
  });

  return { analysis, design };
}
