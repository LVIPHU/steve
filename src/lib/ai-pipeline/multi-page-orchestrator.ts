/**
 * Multi-Page Orchestrator
 * Coordinates all 7 agents: Link Extractor → BA → Design System → Data Architect → PM → Generator(xN) → Consistency Checker
 */
import { sql } from "drizzle-orm";
import { db } from "@/db";
import type {
  PipelineEvent,
  AnalysisResult,
  DesignResult,
  PagePlan,
  DesignSystem,
  DataContracts,
} from "./types";
import { extractLinks } from "./link-extractor";
import { analyzePagesNeeded } from "./ba-agent";
import { buildDesignSystem } from "./design-system-agent";
import { designDataContracts } from "./data-architect";
import { buildPageSpecs } from "./pm-agent";
import { generateHtml } from "./generator";
import { validateAndFix } from "./validator";
import { checkConsistency } from "./consistency-checker";

interface MultiPageInput {
  prompt: string;
  indexHtml: string;
  analysis: AnalysisResult;
  design: DesignResult;
  websiteId: string;
  onEvent: (event: PipelineEvent) => void;
}

export async function runMultiPageExpansion({
  prompt,
  indexHtml,
  analysis,
  design,
  websiteId,
  onEvent,
}: MultiPageInput): Promise<Record<string, string>> {
  const generatedPages: Record<string, string> = { index: indexHtml };

  try {
    // ─── Agent 1: Link Extractor (deterministic) ──────────────────────
    onEvent({ step: "link-extract", status: "start" });
    const extracted = extractLinks(indexHtml);
    onEvent({
      step: "link-extract",
      status: "done",
      detail: extracted.links.length > 0
        ? `${extracted.links.length} links: ${extracted.links.join(", ")}`
        : "No internal links found",
    });

    // Skip if no meaningful links and simple landing
    if (extracted.links.length === 0 && analysis.type === "landing") {
      onEvent({
        step: "all-complete",
        status: "done",
        detail: "Single-page website — no additional pages needed",
        pageNames: [],
      });
      return generatedPages;
    }

    // ─── Agent 2: BA Agent (LLM) ─────────────────────────────────────
    onEvent({ step: "ba-analysis", status: "start" });
    let pagePlan: PagePlan;
    try {
      pagePlan = await analyzePagesNeeded(prompt, extracted.links, analysis, indexHtml);
    } catch (err) {
      onEvent({
        step: "ba-analysis",
        status: "done",
        detail: "BA analysis failed — skipping multi-page expansion",
      });
      return generatedPages;
    }

    if (pagePlan.pages.length === 0) {
      onEvent({
        step: "ba-analysis",
        status: "done",
        detail: "No additional pages needed",
      });
      onEvent({ step: "all-complete", status: "done", pageNames: [] });
      return generatedPages;
    }

    onEvent({
      step: "ba-analysis",
      status: "done",
      detail: `${pagePlan.pages.length} pages: ${pagePlan.pages.map((p) => p.name).join(", ")}`,
      pagePlan,
    });

    // ─── Agent 3 & 4: Design System + Data Architect (PARALLEL) ─────
    // These two agents are INDEPENDENT — both need pagePlan from BA
    // but do NOT depend on each other. Run in parallel to save ~3-5s.
    onEvent({ step: "design-system", status: "start" });
    onEvent({ step: "data-architect", status: "start" });

    const [designSystemResult, dataContractsResult] = await Promise.allSettled([
      buildDesignSystem(design, pagePlan, extracted.palette, extracted.fonts, indexHtml),
      designDataContracts(pagePlan, prompt, analysis.type),
    ]);

    // Resolve Design System (with fallback)
    let designSystem: DesignSystem;
    if (designSystemResult.status === "fulfilled") {
      designSystem = designSystemResult.value;
    } else {
      designSystem = buildFallbackDesignSystem(design, pagePlan);
    }
    onEvent({
      step: "design-system",
      status: "done",
      detail: `Style guide: ${design.preset}, ${pagePlan.pages.length} page designs`,
    });

    // Resolve Data Contracts (with fallback)
    let dataContracts: DataContracts;
    if (dataContractsResult.status === "fulfilled") {
      dataContracts = dataContractsResult.value;
    } else {
      dataContracts = { stores: [], flows: [] };
    }
    onEvent({
      step: "data-architect",
      status: "done",
      detail: dataContracts.stores.length > 0
        ? `${dataContracts.stores.length} data stores: ${dataContracts.stores.map((s) => s.key).join(", ")}`
        : "No data contracts needed (static site)",
    });

    // ─── Agent 5: PM Agent (deterministic) ───────────────────────────
    onEvent({ step: "pm-planning", status: "start" });
    const allPageNames = ["index", ...pagePlan.pages.map((p) => p.name)];
    const pageSpecs = buildPageSpecs({
      pagePlan,
      designSystem,
      dataContracts,
      sharedNavHtml: extracted.navHtml,
      sharedFooterHtml: extracted.footerHtml,
      allPageNames,
      originalPrompt: prompt,
    });
    onEvent({
      step: "pm-planning",
      status: "done",
      detail: `Specs ready for ${pageSpecs.length} pages`,
    });

    // ─── Agent 6: Page Generator (LLM x N, sequential) ──────────────
    for (const spec of pageSpecs) {
      onEvent({ step: "page-generate", status: "start", pageName: spec.name });

      try {
        // Build otherPagesContext from already-generated pages
        const otherPagesContext = Object.entries(generatedPages)
          .slice(0, 3)
          .map(([name, html]) => {
            const palette = (html.match(/--color-[a-z]+:\s*#[0-9a-f]{3,6}/gi) || []).join("; ");
            const fonts = (html.match(/family=([A-Za-z+]+)/g) || [])
              .map((f: string) => f.replace("family=", "").replace(/\+/g, " "))
              .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
              .join(", ");
            return `Page "${name}": palette=[${palette}] fonts=[${fonts}]`;
          })
          .join("\n");

        // Generate HTML using existing generator
        const fullPrompt = spec.generationPrompt + (otherPagesContext ? `\n\n## Design Context From Existing Pages\n${otherPagesContext}` : "");
        const html = await generateHtml(
          fullPrompt,
          "fresh",
          (chunk) => {
            onEvent({ step: "page-generate", status: "streaming", pageName: spec.name, chunk });
          }
        );

        // Validate
        const validated = validateAndFix(html);

        // Save to DB immediately
        await db.execute(
          sql`UPDATE websites
              SET pages = jsonb_set(COALESCE(pages, '{}'), ARRAY[${spec.name}], to_jsonb(${validated.html}::text)),
                  updated_at = NOW()
              WHERE id = ${websiteId}`
        );

        generatedPages[spec.name] = validated.html;

        onEvent({
          step: "page-complete",
          status: "done",
          pageName: spec.name,
          html: validated.html,
          detail: validated.fixes.length > 0 ? `${validated.fixes.length} fixes applied` : undefined,
        });
      } catch (err) {
        onEvent({
          step: "page-complete",
          status: "done",
          pageName: spec.name,
          error: `Failed to generate "${spec.name}": ${err instanceof Error ? err.message : "Unknown error"}`,
        });
        // Continue with next page — don't break the whole pipeline
      }
    }

    // ─── Agent 7: Consistency Checker (deterministic) ────────────────
    onEvent({ step: "consistency-check", status: "start" });
    const consistency = checkConsistency(generatedPages, pagePlan);
    const issues = [
      ...consistency.brokenLinks,
      ...consistency.missingPages.map((p) => `Missing: ${p}`),
      ...consistency.navInconsistencies,
      ...consistency.warnings,
    ];
    onEvent({
      step: "consistency-check",
      status: "done",
      detail: issues.length === 0
        ? "All links valid, design consistent"
        : `${issues.length} issues: ${issues.slice(0, 3).join("; ")}`,
    });

    // ─── Patch index navbar with sub-page links (deterministic) ─────
    const generatedPageNames = Object.keys(generatedPages).filter((n) => n !== "index");
    if (generatedPageNames.length > 0 && generatedPages.index) {
      const patchedIndex = patchIndexNavLinks(generatedPages.index, generatedPageNames);
      if (patchedIndex !== generatedPages.index) {
        generatedPages.index = patchedIndex;
        await db.execute(
          sql`UPDATE websites
              SET pages = jsonb_set(COALESCE(pages, '{}'), ARRAY['index'], to_jsonb(${patchedIndex}::text)),
                  updated_at = NOW()
              WHERE id = ${websiteId}`
        );
      }
    }

    // ─── All Complete ────────────────────────────────────────────────
    onEvent({
      step: "all-complete",
      status: "done",
      pageNames: generatedPageNames,
      detail: `${generatedPageNames.length} pages generated`,
    });

    return generatedPages;
  } catch (err) {
    onEvent({
      step: "error",
      status: "done",
      error: `Multi-page expansion failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    });
    return generatedPages;
  }
}

/**
 * Patch index page navbar to include links to generated sub-pages.
 * 1. Replace href="#pageName" anchor links with href="pageName" relative links.
 * 2. Inject any still-missing sub-page links before closing </nav>.
 */
function patchIndexNavLinks(indexHtml: string, subPageNames: string[]): string {
  let patched = indexHtml;

  // Step 1: Replace anchor links that look like page names
  for (const name of subPageNames) {
    // href="#quiz" → href="quiz"
    patched = patched.replace(
      new RegExp(`href=["']#${name}["']`, "gi"),
      `href="${name}"`
    );
    // href="#quiz-section" or "#quiz-tab" → href="quiz"
    patched = patched.replace(
      new RegExp(`href=["']#${name}-[a-z-]+["']`, "gi"),
      `href="${name}"`
    );
  }

  // Step 2: Find nav block and detect which sub-pages are already linked
  const navMatch = patched.match(/<nav[\s\S]*?<\/nav>/i);
  if (!navMatch) return patched;

  const navContent = navMatch[0];
  const existingHrefs = [...navContent.matchAll(/href=["']([^"']+)["']/g)].map((m) => m[1]);

  const missingPages = subPageNames.filter(
    (name) => !existingHrefs.some((h) => h === name || h.endsWith(`/${name}`))
  );

  if (missingPages.length === 0) return patched;

  // Step 3: Inject missing page links before closing </nav>
  const injectedLinks = missingPages
    .map((name) => {
      const label = name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return `<a href="${name}" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors px-3 py-2">${label}</a>`;
    })
    .join("\n");

  patched = patched.replace("</nav>", `\n${injectedLinks}\n</nav>`);
  return patched;
}

/** Fallback design system when LLM call fails */
function buildFallbackDesignSystem(design: DesignResult, pagePlan: PagePlan): DesignSystem {
  return {
    globalTokens: {
      palette: { ...design.palette, text: "#111827", muted: "#6B7280" },
      fonts: design.fonts,
      borderRadius: design.borderRadius,
      cardStyle: design.cardStyle,
      density: design.density,
      spacing: { sectionPadding: "py-20", containerMax: "max-w-6xl" },
    },
    sharedComponents: {
      navStyle: "sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-50",
      footerStyle: "bg-gray-900 text-white py-12",
      buttonPrimary: `bg-[${design.palette.primary}] hover:opacity-90 text-white font-semibold rounded-lg px-6 py-3`,
      buttonSecondary: `border border-gray-300 hover:bg-gray-50 rounded-lg px-6 py-3`,
      cardPattern: "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
      headingStyle: "text-3xl font-bold text-gray-900",
    },
    pageDesigns: pagePlan.pages.map((p) => ({
      name: p.name,
      heroStyle: "none" as const,
      layout: "single-column" as const,
      accentColor: design.palette.accent,
      mood: "informational",
      keyComponents: p.sections.filter((s) => s !== "navbar" && s !== "footer"),
    })),
  };
}
