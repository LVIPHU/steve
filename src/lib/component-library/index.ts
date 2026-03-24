import type { AnalysisResult } from "@/lib/ai-pipeline/types";
import { ALL_SNIPPETS } from "./snippets";
export type { ComponentSnippet } from "./types";
import type { ComponentSnippet } from "./types";

/** Regular component snippets (non-example) — used for tag-based scoring */
const REGULAR_SNIPPETS = ALL_SNIPPETS.filter((s) => s.category !== "example");

/** Golden example snippets — injected as reference separately from scoring */
const EXAMPLE_SNIPPETS = ALL_SNIPPETS.filter((s) => s.category === "example");

/**
 * Select up to 4 component snippets best matching the given analysis result.
 *
 * Algorithm:
 * 1. Build candidate tag set from analysis type, sections, and features
 * 2. Score each snippet by counting tag matches against the candidate set
 * 3. If ALL snippets score 0, use the data-driven fallback path
 * 4. Otherwise: filter by min_score, lower threshold to 0 if fewer than 4 eligible
 * 5. Sort by: score DESC, domainBoost DESC, priority ASC
 * 6. Return top 4
 *
 * Note: example snippets are excluded from scoring — use selectExamples() for those.
 */
export function selectComponents(analysis: AnalysisResult): ComponentSnippet[] {
  // Build candidate set from type, sections, and features
  const candidateSet = new Set([
    analysis.type,
    ...analysis.sections,
    ...analysis.features,
  ]);

  // Score every regular snippet (examples excluded from tag scoring)
  const scored = REGULAR_SNIPPETS.map((snippet) => {
    const score = snippet.tags.filter((tag) => candidateSet.has(tag)).length;
    const domainBoost = snippet.domain_hints.includes(analysis.type) ? 1 : 0;
    return { snippet, score, domainBoost };
  });

  // Check if all scores are 0 → use fallback path
  const allZero = scored.every((s) => s.score === 0);
  if (allZero) {
    return getFallbacks(analysis.type);
  }

  // Filter by min_score
  let eligible = scored.filter((s) => s.score >= s.snippet.min_score);

  // If fewer than 4 eligible, lower threshold to 0
  if (eligible.length < 4) {
    eligible = scored.filter((s) => s.score >= 0);
  }

  // Sort: score DESC, domainBoost DESC, priority ASC
  eligible.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.domainBoost !== a.domainBoost) return b.domainBoost - a.domainBoost;
    return a.snippet.priority - b.snippet.priority;
  });

  return eligible.slice(0, 4).map((s) => s.snippet);
}

/**
 * Select the best matching golden example snippet for the given analysis type.
 * Returns at most 1 example (the best match for the site type).
 */
export function selectExamples(analysis: AnalysisResult): ComponentSnippet[] {
  // Try to find a type-specific example first
  const typeMatch = EXAMPLE_SNIPPETS.filter((s) =>
    s.domain_hints.includes(analysis.type)
  );
  if (typeMatch.length > 0) {
    return [typeMatch[0]];
  }
  // Fall back to any example tagged with the type
  const tagMatch = EXAMPLE_SNIPPETS.filter((s) =>
    s.tags.includes(analysis.type)
  );
  if (tagMatch.length > 0) {
    return [tagMatch[0]];
  }
  return [];
}

/**
 * Collect fallback snippets for a given type from REGULAR_SNIPPETS data.
 * Falls back to "generic" if no type-specific fallbacks found.
 */
function getFallbacks(type: string): ComponentSnippet[] {
  const typeSpecific = REGULAR_SNIPPETS.filter(
    (s) => s.fallback === true && s.fallback_for.includes(type)
  );

  if (typeSpecific.length >= 4) {
    return typeSpecific.slice(0, 4);
  }

  // Supplement with generic fallbacks if not enough type-specific ones
  const generic = REGULAR_SNIPPETS.filter(
    (s) => s.fallback === true && s.fallback_for.includes("generic")
  );

  const combined = [...typeSpecific];
  for (const g of generic) {
    if (!combined.find((s) => s.id === g.id)) {
      combined.push(g);
    }
    if (combined.length >= 4) break;
  }

  return combined.slice(0, 4);
}
