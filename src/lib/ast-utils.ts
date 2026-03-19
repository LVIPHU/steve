import type { Section, SectionType, WebsiteAST } from "@/types/website-ast";

export const VALID_SECTION_TYPES: SectionType[] = [
  "hero",
  "about",
  "features",
  "content",
  "gallery",
  "cta",
  "steps",
  "quiz",
  "flashcard",
  "goals",
  "ingredients",
];

export function parseAndValidateAST(raw: string): WebsiteAST {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON: could not parse input string");
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("AST must be a non-null object");
  }

  const obj = parsed as Record<string, unknown>;

  // Validate theme
  if (typeof obj.theme !== "object" || obj.theme === null || Array.isArray(obj.theme)) {
    throw new Error("AST missing required field: theme (must be an object)");
  }
  const theme = obj.theme as Record<string, unknown>;
  if (typeof theme.primaryColor !== "string") {
    throw new Error("theme.primaryColor must be a string");
  }
  if (typeof theme.backgroundColor !== "string") {
    throw new Error("theme.backgroundColor must be a string");
  }
  if (typeof theme.font !== "string") {
    throw new Error("theme.font must be a string");
  }

  // Validate sections
  if (!Array.isArray(obj.sections) || obj.sections.length === 0) {
    throw new Error("AST missing required field: sections (must be a non-empty array)");
  }

  for (let i = 0; i < obj.sections.length; i++) {
    const section = obj.sections[i] as Record<string, unknown>;
    if (typeof section !== "object" || section === null) {
      throw new Error(`sections[${i}] must be an object`);
    }
    if (typeof section.id !== "string") {
      throw new Error(`sections[${i}].id must be a string`);
    }
    if (!VALID_SECTION_TYPES.includes(section.type as SectionType)) {
      throw new Error(
        `sections[${i}].type "${section.type}" is not a valid section type. Valid types: ${VALID_SECTION_TYPES.join(", ")}`
      );
    }
    if (typeof section.ai_content !== "object" || section.ai_content === null) {
      throw new Error(`sections[${i}].ai_content must be an object`);
    }
    if (section.manual_overrides === undefined) {
      // Default to empty object if missing
      (obj.sections[i] as Record<string, unknown>).manual_overrides = {};
    } else if (typeof section.manual_overrides !== "object" || section.manual_overrides === null) {
      throw new Error(`sections[${i}].manual_overrides must be an object or undefined`);
    }
  }

  // Validate seo
  if (typeof obj.seo !== "object" || obj.seo === null || Array.isArray(obj.seo)) {
    throw new Error("AST missing required field: seo (must be an object)");
  }
  const seo = obj.seo as Record<string, unknown>;
  if (typeof seo.title !== "string" || seo.title.trim() === "") {
    throw new Error("seo.title must be a non-empty string");
  }
  if (typeof seo.description !== "string") {
    throw new Error("seo.description must be a string");
  }
  if (typeof seo.slug !== "string" || seo.slug.trim() === "") {
    throw new Error("seo.slug must be a non-empty string");
  }

  return obj as unknown as WebsiteAST;
}

export function resolveField<T>(section: Section, field: string): T {
  const overrides = section.manual_overrides as Record<string, unknown>;
  const content = section.ai_content as unknown as Record<string, unknown>;
  return (overrides[field] ?? content[field]) as T;
}
