import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { ReviewResult } from "./types";
import fs from "fs";
import path from "path";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

export const ReviewResultSchema = z.object({
  score: z.number().min(0).max(100).describe("Overall quality score 0-100"),
  visual: z.number().min(0).max(40).describe("Visual quality: color contrast, palette consistency, font hierarchy, layout integrity"),
  content: z.number().min(0).max(30).describe("Content compliance: does HTML fulfill user prompt intent"),
  technical: z.number().min(0).max(30).describe("Technical quality: no anti-patterns, CDN links present, JS not broken"),
  must_fix: z.array(z.string()).describe("Issues that materially break functionality or clearly violate user intent"),
  suggestions: z.array(z.string()).describe("Non-critical improvements"),
});

export const FALLBACK_REVIEW: ReviewResult = {
  score: 100, visual: 40, content: 30, technical: 30,
  must_fix: [], suggestions: [],
};

const REVIEWER_SYSTEM_PROMPT = `You are a website quality reviewer. Score the provided HTML website on three dimensions:

Visual (0-40): Color contrast and palette consistency (CSS custom properties --color-primary/secondary/accent/bg present and used), Google Fonts @import correct format at top of <style>, font hierarchy (heading vs body distinct), layout not broken (no overflow, no misalignment), no hardcoded colors conflicting with palette.

Content (0-30): Does the HTML fulfill the user's prompt intent? Check that requested sections/features exist (e.g., if user asked for quiz, HTML must contain quiz). Content is meaningful and relevant, not placeholder lorem ipsum.

Technical (0-30): No alert()/confirm()/prompt(). No Alpine.js x-for. localStorage uses "appgen-" prefix. CDN links for DaisyUI and Tailwind present. JavaScript has no obvious broken references. No Tailwind class names used as CSS properties.

must_fix: List issues that materially break functionality or clearly violate user intent. Layout breaks, missing requested features, broken JS, color issues are all eligible.
suggestions: Non-critical improvements.
score = visual + content + technical.`;

function appendCalibrationLog(prompt: string, result: ReviewResult): void {
  try {
    const entry = {
      timestamp: new Date().toISOString(),
      prompt: prompt.slice(0, 200),
      score: result.score,
      visual: result.visual,
      content: result.content,
      technical: result.technical,
      must_fix_count: result.must_fix.length,
      triggered_refine: false,
    };
    fs.appendFileSync(
      path.join(process.cwd(), ".calibration.jsonl"),
      JSON.stringify(entry) + "\n"
    );
  } catch {
    console.warn("Failed to append calibration log — non-fatal");
  }
}

export async function reviewHtml(prompt: string, html: string): Promise<ReviewResult> {
  try {
    const completion = await getOpenAI().chat.completions.parse(
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: REVIEWER_SYSTEM_PROMPT },
          { role: "user", content: `User prompt:\n${prompt}\n\nHTML to review:\n${html}` },
        ],
        response_format: zodResponseFormat(ReviewResultSchema, "review_result"),
      },
      { signal: AbortSignal.timeout(20000) }
    );
    const result = completion.choices[0].message.parsed ?? FALLBACK_REVIEW;
    appendCalibrationLog(prompt, result);
    return result;
  } catch {
    return FALLBACK_REVIEW;
  }
}
