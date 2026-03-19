import { describe, it, expect } from "vitest";
import { TEMPLATE_ALLOWED_SECTIONS } from "@/lib/templates";
import { VALID_SECTION_TYPES } from "@/lib/ast-utils";
import type { SectionType } from "@/types/website-ast";

describe("TEMPLATE_ALLOWED_SECTIONS", () => {
  it("has entries for all 5 template IDs", () => {
    expect(TEMPLATE_ALLOWED_SECTIONS).toHaveProperty("blog");
    expect(TEMPLATE_ALLOWED_SECTIONS).toHaveProperty("portfolio");
    expect(TEMPLATE_ALLOWED_SECTIONS).toHaveProperty("fitness");
    expect(TEMPLATE_ALLOWED_SECTIONS).toHaveProperty("cooking");
    expect(TEMPLATE_ALLOWED_SECTIONS).toHaveProperty("learning");
  });

  it('cooking template includes "ingredients" and "steps"', () => {
    expect(TEMPLATE_ALLOWED_SECTIONS.cooking).toContain("ingredients");
    expect(TEMPLATE_ALLOWED_SECTIONS.cooking).toContain("steps");
  });

  it('cooking template does NOT include "quiz", "flashcard", or "goals"', () => {
    expect(TEMPLATE_ALLOWED_SECTIONS.cooking).not.toContain("quiz");
    expect(TEMPLATE_ALLOWED_SECTIONS.cooking).not.toContain("flashcard");
    expect(TEMPLATE_ALLOWED_SECTIONS.cooking).not.toContain("goals");
  });

  it('learning template includes "goals", "flashcard", and "quiz"', () => {
    expect(TEMPLATE_ALLOWED_SECTIONS.learning).toContain("goals");
    expect(TEMPLATE_ALLOWED_SECTIONS.learning).toContain("flashcard");
    expect(TEMPLATE_ALLOWED_SECTIONS.learning).toContain("quiz");
  });

  it('learning template does NOT include "ingredients" or "steps"', () => {
    expect(TEMPLATE_ALLOWED_SECTIONS.learning).not.toContain("ingredients");
    expect(TEMPLATE_ALLOWED_SECTIONS.learning).not.toContain("steps");
  });

  it("every allowed section type is a valid SectionType", () => {
    for (const [templateId, sectionTypes] of Object.entries(TEMPLATE_ALLOWED_SECTIONS)) {
      for (const sectionType of sectionTypes) {
        expect(
          VALID_SECTION_TYPES,
          `${templateId} has unknown section type: ${sectionType}`
        ).toContain(sectionType as SectionType);
      }
    }
  });
});
