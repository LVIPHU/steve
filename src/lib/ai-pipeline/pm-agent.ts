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
      ? `## Data for This Page
${pageDataStores.map((s) => {
  const actions = [];
  if (s.writtenBy.includes(page.name)) actions.push("WRITE");
  if (s.readBy.includes(page.name)) actions.push("READ");
  return `- ${actions.join("+")} localStorage["${s.key}"]: ${s.schema}`;
}).join("\n")}`
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
