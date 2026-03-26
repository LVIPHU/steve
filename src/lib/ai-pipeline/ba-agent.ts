/**
 * Agent 2: BA Agent (Business Analyst) — LLM (gpt-4o-mini)
 * Analyze domain, plan all pages needed for a complete website.
 */
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import type { AnalysisResult, PagePlan } from "./types";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

const PlannedPageSchema = z.object({
  name: z.string().describe("Slug: lowercase, alphanumeric + hyphens only, e.g. 'quiz', 'scores'"),
  purpose: z.string().describe("Brief description of what this page does"),
  sections: z.array(z.string()).describe("UI sections needed: navbar, hero, data-table, form, footer, etc."),
  features: z.array(z.string()).describe("JS/CSS features: localStorage, timer, flip-animation, chart, etc."),
  dataRequirements: z.string().describe("Data this page reads/writes, e.g. 'reads scores from localStorage key appgen-scores'"),
  connectsTo: z.array(z.string()).describe("Other page slugs this page links to"),
  priority: z.number().describe("1=critical path, 2=important, 3=nice-to-have"),
});

const PagePlanSchema = z.object({
  pages: z.array(PlannedPageSchema).describe("All additional pages needed (NOT including index)"),
  sharedComponents: z.array(z.string()).describe("Components shared across pages: navbar, footer, dark-mode-toggle, etc."),
});

const SYSTEM_PROMPT = `You are a senior Business Analyst for a web application builder. Given the user's original request, the generated index page HTML, and analysis results, plan ALL additional pages needed for a COMPLETE, FUNCTIONAL website.

Your tasks:
1. Review the extracted internal links from the index page
2. Understand the domain and purpose deeply
3. Think BEYOND the links found — plan pages that make the app FULLY FUNCTIONAL

## Domain-specific page planning:

**Education/Learning apps** (flashcard, quiz, vocabulary, language learning):
- quiz: Interactive quiz with multiple-choice questions, progress bar, score at end
- scores: Personal score history (chart + table), best scores, accuracy stats, day streak
- flashcards: Flip-card study interface with word/meaning, mark as learned, next/prev navigation
- add-vocab: Form to add new vocabulary (word, meaning, example sentence), save to localStorage
- vocabulary: Full vocabulary list with search, filter by learned/unlearned, delete

**SaaS/Product landing pages:**
- features: Detailed feature showcase with icons, descriptions, comparison table
- pricing: Pricing tiers with feature comparison, FAQ section
- about: Company story, team members, mission/vision, stats
- contact: Contact form, address, social links, map placeholder

**Portfolio/Personal sites:**
- projects: Project gallery grid with filter by category, detail cards
- about: Bio, skills, experience timeline, education
- contact: Contact form, social links, availability status
- resume: Downloadable CV, skills chart, work history

**Blog/Content sites:**
- posts: Article listing with search, category filter, pagination
- post: Single article template with reading time, author, share buttons
- about: Author bio, expertise, social links
- categories: Category listing with article count

**E-commerce/Product sites:**
- products: Product grid with filter, sort, search
- product-detail: Single product with gallery, description, add-to-cart
- cart: Shopping cart with quantity, total, checkout button
- contact: Support form, FAQ, return policy

## Data flow planning for interactive apps:
For apps with user data (quiz, flashcard, tracker, todo, etc.), specify localStorage contracts:
- Key naming: 'appgen-{feature}-{type}' (e.g. 'appgen-quiz-scores', 'appgen-vocab-list')
- Data schema: describe the JSON structure for each key
- Which pages READ and which WRITE each key
- This enables pages to share data seamlessly

## Rules:
- Page names: lowercase, only letters, numbers, and hyphens (e.g. "quiz", "scores", "add-vocab")
- Do NOT include "index" — it's already generated
- Maximum 6 additional pages (prioritize critical path first)
- For static sites with < 2 meaningful links: return pages: [] (empty array)
- EVERY page must have a navbar and footer for consistent navigation
- Prioritize: 1=core functionality, 2=supporting pages, 3=nice-to-have`;

export async function analyzePagesNeeded(
  originalPrompt: string,
  extractedLinks: string[],
  analysis: AnalysisResult,
  indexHtmlTruncated: string
): Promise<PagePlan> {
  const userMessage = `## Original User Request
${originalPrompt}

## Website Type
${analysis.type}

## Detected Sections
${analysis.sections.join(", ")}

## Detected Features
${analysis.features.join(", ")}

## Internal Links Found in Index Page
${extractedLinks.length > 0 ? extractedLinks.join(", ") : "(none found)"}

## Index Page HTML (first 8K chars)
${indexHtmlTruncated.slice(0, 8000)}`;

  const completion = await getOpenAI().chat.completions.parse(
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: zodResponseFormat(PagePlanSchema, "page_plan"),
    },
    { signal: AbortSignal.timeout(25000) }
  );

  const parsed = completion.choices[0].message.parsed!;
  const maxPages = parseInt(process.env.MAX_MULTI_PAGES ?? "6", 10);

  return {
    pages: parsed.pages.slice(0, maxPages),
    sharedComponents: parsed.sharedComponents,
  };
}
