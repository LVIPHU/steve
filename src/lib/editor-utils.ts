import { arrayMove } from "@dnd-kit/sortable";
import type { Section, SectionContent, WebsiteAST, WebsiteTheme } from "@/types/website-ast";

/**
 * Reorders sections array by moving an item from oldIndex to newIndex.
 * Returns a new array (immutable). Uses @dnd-kit/sortable arrayMove.
 */
export function reorderSections(
  sections: Section[],
  oldIndex: number,
  newIndex: number
): Section[] {
  return arrayMove([...sections], oldIndex, newIndex);
}

/**
 * Returns a new AST with manual_overrides[field] = value on the matching section.
 * Does NOT modify ai_content. Returns AST unchanged if sectionId not found.
 */
export function applyManualOverride(
  ast: WebsiteAST,
  sectionId: string,
  field: string,
  value: unknown
): WebsiteAST {
  const found = ast.sections.some((s) => s.id === sectionId);
  if (!found) return ast;

  return {
    ...ast,
    sections: ast.sections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        manual_overrides: {
          ...section.manual_overrides,
          [field]: value,
        },
      };
    }),
  };
}

/**
 * Returns a new AST with theme merged with the partial update.
 * Other AST fields (sections, seo) are unchanged.
 */
export function updateTheme(ast: WebsiteAST, partial: Partial<WebsiteTheme>): WebsiteAST {
  return {
    ...ast,
    theme: {
      ...ast.theme,
      ...partial,
    },
  };
}

/**
 * Returns a new AST with ai_content replaced on the matching section.
 * Preserves manual_overrides. Returns AST unchanged if sectionId not found.
 */
export function updateSectionAiContent(
  ast: WebsiteAST,
  sectionId: string,
  newAiContent: SectionContent
): WebsiteAST {
  const found = ast.sections.some((s) => s.id === sectionId);
  if (!found) return ast;

  return {
    ...ast,
    sections: ast.sections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        ai_content: newAiContent,
      };
    }),
  };
}
