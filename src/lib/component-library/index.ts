import type { AnalysisResult } from "@/lib/ai-pipeline/types";
import { ALL_SNIPPETS } from "./snippets";
export type { ComponentSnippet } from "./types";
import type { ComponentSnippet } from "./types";

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
 */
export function selectComponents(analysis: AnalysisResult): ComponentSnippet[] {
  // Build candidate set from type, sections, and features
  const candidateSet = new Set([
    analysis.type,
    ...analysis.sections,
    ...analysis.features,
  ]);

  // Score every snippet
  const scored = ALL_SNIPPETS.map((snippet) => {
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
 * Collect fallback snippets for a given type from ALL_SNIPPETS data.
 * Falls back to "generic" if no type-specific fallbacks found.
 */
function getFallbacks(type: string): ComponentSnippet[] {
  const typeSpecific = ALL_SNIPPETS.filter(
    (s) => s.fallback === true && s.fallback_for.includes(type)
  );

  if (typeSpecific.length >= 4) {
    return typeSpecific.slice(0, 4);
  }

  // Supplement with generic fallbacks if not enough type-specific ones
  const generic = ALL_SNIPPETS.filter(
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
