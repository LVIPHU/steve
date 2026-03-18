import type { WebsiteAST } from "@/types/website-ast";

/**
 * Merges AI-generated sections into an existing AST by index.
 * - Only replaces ai_content; preserves id, type, and manual_overrides from existing.
 * - If AI returns fewer sections, extra existing sections are kept unchanged.
 * - If AI returns more sections, extras are ignored.
 * - Theme and seo come from existing AST (not replaced by AI output).
 */
export function mergeAiSectionsIntoAst(existing: WebsiteAST, newAst: WebsiteAST): WebsiteAST {
  const merged = existing.sections.map((section, i) => {
    const newSection = newAst.sections[i];
    if (!newSection) return section; // AI returned fewer — keep original
    return {
      ...section, // preserve id, type, manual_overrides
      ai_content: newSection.ai_content, // only replace ai_content
    };
  });
  return { ...existing, sections: merged };
}
