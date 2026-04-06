/**
 * Agent 5: PM Agent (Deterministic)
 * Combine all artifacts from previous agents into generation-ready prompts for each page.
 */
import type {
  PagePlan,
  DesignSystem,
  DataContracts,
  PageSpec,
  AnalysisResult,
} from "./types";
import { selectComponents, selectExamples } from "@/lib/component-library";
import type { ComponentSnippet } from "@/lib/component-library/types";

interface PMInput {
  pagePlan: PagePlan;
  designSystem: DesignSystem;
  dataContracts: DataContracts;
  sharedNavHtml: string;
  sharedFooterHtml: string;
  allPageNames: string[]; // ["index", "quiz", "scores", ...]
  originalPrompt: string;
}

export function buildPageSpecs(input: PMInput): PageSpec[] {
  const {
    pagePlan,
    designSystem,
    dataContracts,
    sharedNavHtml,
    sharedFooterHtml,
    allPageNames,
    originalPrompt,
  } = input;

  const { globalTokens, sharedComponents } = designSystem;

  // Detect N-item requirement from original prompt
  const nItemMatches = originalPrompt.match(
    /(\d+)\s*(words?|vocabulary|vocabularies|questions?|flashcards?|items?|từ|câu hỏi|thẻ)/gi
  );
  const nItemReminder = nItemMatches && nItemMatches.length > 0
    ? `## DATA COMPLETENESS — CRITICAL REQUIREMENT
The user's original request specifies: "${nItemMatches.join(", ")}"
You MUST include ALL of them in this page. Do NOT truncate with "...", do NOT use placeholder comments like "// add more items here". Define all items as a JavaScript array and render from that array.`
    : "";

  // Build the global design brief (shared across all pages)
  const googleFontsImport = buildGoogleFontsImport(globalTokens.fonts);

  const radiusMap: Record<string, string> = {
    sharp: "rounded-md",
    rounded: "rounded-xl",
    pill: "rounded-full",
  };
  const cardStyleMap: Record<string, string> = {
    shadow: "shadow-sm hover:shadow-md",
    bordered: "border border-gray-200 dark:border-gray-700",
    glass: "backdrop-blur-sm bg-white/80",
    flat: "no border/shadow",
  };

  const globalDesignBrief = `## Design System (MUST follow exactly)
Palette: primary=${globalTokens.palette.primary} | secondary=${globalTokens.palette.secondary} | accent=${globalTokens.palette.accent} | bg=${globalTokens.palette.bg} | text=${globalTokens.palette.text} | muted=${globalTokens.palette.muted}
Fonts: heading=${globalTokens.fonts.heading} | body=${globalTokens.fonts.body}
Google Fonts: ${googleFontsImport}
Border radius: ${radiusMap[globalTokens.borderRadius] ?? "rounded-xl"}
Card pattern: ${sharedComponents.cardPattern}
Section padding: ${globalTokens.spacing.sectionPadding}
Container max: ${globalTokens.spacing.containerMax}
Button primary: ${sharedComponents.buttonPrimary}
Button secondary: ${sharedComponents.buttonSecondary}
Heading style: ${sharedComponents.headingStyle}
Nav style: ${sharedComponents.navStyle}
Footer style: ${sharedComponents.footerStyle}`;

  // Build link convention
  const linkConvention = `## Link Convention
All pages in this site: ${allPageNames.join(", ")}
Use relative links WITHOUT .html extension: <a href="pageName"> — NOT absolute URLs, NOT .html extensions.
The navigation should include links to all main pages.`;

  // Data contracts section
  const dataSection = dataContracts.stores.length > 0
    ? `## Data Contracts (localStorage)
${dataContracts.stores.map((s) => `- Key: "${s.key}" — ${s.schema}\n  Read by: ${s.readBy.join(", ")} | Written by: ${s.writtenBy.join(", ")}`).join("\n")}`
    : "";

  return pagePlan.pages.map((page): PageSpec => {
    // Find page-specific design
    const pageDesign = designSystem.pageDesigns.find((d) => d.name === page.name);

    // Build page-specific analysis for component selection
    const pageAnalysis: AnalysisResult = {
      type: "generic", // sub-pages don't need type classification
      sections: page.sections,
      features: page.features,
      structured_data: "",
    };

    // Select components for this page
    const snippets = selectComponents(pageAnalysis);
    const examples = selectExamples(pageAnalysis);
    const allSnippets = [...snippets, ...examples];

    const snippetBlock = allSnippets
      .map((s: ComponentSnippet) => {
        const prefix = s.category === "example"
          ? `<!-- REFERENCE EXAMPLE: ${s.id}: ${s.description} -->`
          : `<!-- ${s.id}: ${s.description} -->`;
        return `${prefix}\n${s.html}\n<!-- end ${s.id} -->`;
      })
      .join("\n\n");

    // Page-specific design section
    const pageDesignSection = pageDesign
      ? `## Page-Specific Design
Layout: ${pageDesign.layout}
Hero style: ${pageDesign.heroStyle}
Accent color: ${pageDesign.accentColor}
Mood: ${pageDesign.mood}
Key components: ${pageDesign.keyComponents.join(", ")}`
      : "";

    // Page-specific data needs
    const pageDataStores = dataContracts.stores.filter(
      (s) => s.readBy.includes(page.name) || s.writtenBy.includes(page.name)
    );
    const pageDataSection = pageDataStores.length > 0
      ? `## Data for This Page — MANDATORY IMPLEMENTATION
${pageDataStores.map((s) => {
  const actions = [];
  if (s.writtenBy.includes(page.name)) actions.push("WRITE");
  if (s.readBy.includes(page.name)) actions.push("READ");
  return `- ${actions.join("+")} localStorage["${s.key}"]: ${s.schema}`;
}).join("\n")}

⚠️ LOCALSTORAGE INTEGRATION — CRITICAL (DO NOT IGNORE):
- You MUST load ALL data from localStorage on DOMContentLoaded — NEVER define vocabulary words, quiz questions, scores, or any user data as hardcoded static arrays
- If localStorage is empty on first visit, seed with 5–10 sensible default entries, save them back to localStorage, then render
- Required pattern:
  document.addEventListener('DOMContentLoaded', function() {
    var data = JSON.parse(localStorage.getItem('KEY') || '[]');
    if (!data.length) { data = [/* 5-10 defaults */]; localStorage.setItem('KEY', JSON.stringify(data)); }
    render(data);
  });
- Every READ store listed above MUST be populated from localStorage — NOT from a const/let array defined above the function`
      : "";

    // Page-specific critical instructions
    const isQuizPage = page.name === "quiz" || page.features.some(f => f.toLowerCase().includes("quiz"));
    const isReviewPage = page.name === "review" || page.features.some(f => f.toLowerCase().includes("spaced") || f.toLowerCase().includes("review"));
    const isFlashcardsPage = page.name === "flashcards" || page.features.some(f => f.toLowerCase().includes("flip") || f.toLowerCase().includes("flashcard"));

    const pageTypeHint = isQuizPage
      ? `## Quiz Page — CRITICAL IMPLEMENTATION RULES
- Score counter: declare \`var score = 0, total = 0\` at top, update both vars + DOM on every answer click
- When user clicks an answer button: (1) evaluate correct/wrong immediately, (2) score += 1 if correct, (3) update #score-display or equivalent DOM element RIGHT AWAY, (4) disable ALL answer buttons for this question, (5) after 1s delay show next question
- NEVER leave score at 0 — it must visually increment when correct answers are clicked
- After last question: show results screen with final score (e.g. "You scored 8/10!")
- Save result to localStorage when quiz ends: localStorage.setItem('appgen-quiz-scores', JSON.stringify([...existing, {score, total, timestamp: new Date().toISOString()}]))`
      : isReviewPage
      ? `## Review Page — CRITICAL IMPLEMENTATION RULES
- Load vocabulary from localStorage['appgen-vocab'] on DOMContentLoaded
- If no vocab in localStorage, seed with 5–10 default A1-A2 English words and save them
- Show one card at a time with word on front, meaning/pronunciation on back
- Flip animation on click: card rotates 180deg to show back
- Track seen cards in localStorage['appgen-flashcard-seen'] (array of word strings already reviewed)
- "Next" button advances to next card; prioritize unseen cards first
- Card front MUST show the actual word text — never leave it blank`
      : isFlashcardsPage
      ? `## Flashcard Page — CRITICAL IMPLEMENTATION RULES
- Load vocabulary from localStorage['appgen-vocab'] on DOMContentLoaded
- If no vocab in localStorage, seed with 5–10 default A1-A2 English words and save them
- Flip card on click: word on front, meaning + example on back (CSS 3D transform)
- Card front MUST show actual word text — never leave it blank
- "Mark as Learned" button: toggle learned flag, save back to localStorage['appgen-vocab']
- Progress counter: "X / total learned" updated in real time`
      : "";

    // Shared nav with active state
    const navWithActive = sharedNavHtml
      ? `## Shared Navigation (copy exactly, set active state for "${page.name}")
${sharedNavHtml}`
      : "";

    const footerSection = sharedFooterHtml
      ? `## Shared Footer (copy exactly)
${sharedFooterHtml}`
      : "";

    // Assemble the full prompt with clear generation instructions
    const generationPrompt = [
      `## IMPORTANT: You are generating page "${page.name}" for a multi-page website.
This is NOT the homepage — it is a sub-page. Generate a COMPLETE standalone HTML file with <!DOCTYPE html>, <head>, and <body>.
The page MUST include the same navbar and footer as the index page for navigation consistency.
The page should be FULLY FUNCTIONAL with real content, interactive elements, and proper JavaScript.`,
      globalDesignBrief,
      pageDesignSection,
      snippetBlock ? `## Component References (adapt these patterns to match the design system)\n${snippetBlock}` : "",
      `## Page Specification: "${page.name}"
Purpose: ${page.purpose}
Page sections (in order): ${page.sections.join(" → ")}
Required features: ${page.features.join(", ")}

Generate ALL sections listed above with REAL, meaningful content. Do not use placeholder text like "Lorem ipsum".
For interactive features (quiz, flashcard, form): include full working JavaScript.`,
      nItemReminder,
      pageTypeHint,
      navWithActive,
      footerSection,
      pageDataSection,
      dataSection,
      linkConvention,
      `## Original User Request\n${originalPrompt}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    return {
      name: page.name,
      generationPrompt,
      sections: page.sections,
      features: page.features,
    };
  });
}

function buildGoogleFontsImport(fonts: { heading: string; body: string }): string {
  const families = [fonts.heading, fonts.body]
    .filter((f, i, arr) => arr.indexOf(f) === i)
    .map((name) => `family=${name.replace(/ /g, "+")}:wght@400;600;700`)
    .join("&");
  return `@import url('https://fonts.googleapis.com/css2?${families}&display=swap');`;
}
