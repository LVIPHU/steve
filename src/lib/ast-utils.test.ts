import { describe, it, expect } from "vitest";
import { parseAndValidateAST, resolveField, VALID_SECTION_TYPES } from "@/lib/ast-utils";
import type { Section } from "@/types/website-ast";

const validASTFixture = {
  theme: { primaryColor: "#2563eb", backgroundColor: "#ffffff", font: "Inter" },
  sections: [
    {
      id: "hero-1",
      type: "hero",
      ai_content: { headline: "Test", subtext: "Sub" },
      manual_overrides: {},
    },
  ],
  seo: { title: "Test Site", description: "A test", slug: "test-site" },
};

const validASTString = JSON.stringify(validASTFixture);

describe("parseAndValidateAST", () => {
  it("throws on empty object (missing theme, sections, seo)", () => {
    expect(() => parseAndValidateAST("{}")).toThrow();
  });

  it("returns WebsiteAST object for valid input", () => {
    const result = parseAndValidateAST(validASTString);
    expect(result.theme.primaryColor).toBe("#2563eb");
    expect(result.sections).toHaveLength(1);
    expect(result.seo.title).toBe("Test Site");
  });

  it("throws on invalid section type", () => {
    const bad = {
      ...validASTFixture,
      sections: [
        {
          id: "s1",
          type: "invalid-type",
          ai_content: {},
          manual_overrides: {},
        },
      ],
    };
    expect(() => parseAndValidateAST(JSON.stringify(bad))).toThrow(/not a valid section type/);
  });

  it("throws when seo.title is missing", () => {
    const bad = {
      ...validASTFixture,
      seo: { title: "", description: "desc", slug: "my-site" },
    };
    expect(() => parseAndValidateAST(JSON.stringify(bad))).toThrow(/seo\.title/);
  });

  it("throws when sections array is empty", () => {
    const bad = { ...validASTFixture, sections: [] };
    expect(() => parseAndValidateAST(JSON.stringify(bad))).toThrow(/sections/);
  });

  it("throws when theme is missing", () => {
    const bad = { sections: validASTFixture.sections, seo: validASTFixture.seo };
    expect(() => parseAndValidateAST(JSON.stringify(bad))).toThrow(/theme/);
  });

  it("throws on invalid JSON string", () => {
    expect(() => parseAndValidateAST("{not valid json")).toThrow(/Invalid JSON/);
  });

  it("defaults manual_overrides to {} when undefined", () => {
    const ast = {
      ...validASTFixture,
      sections: [
        {
          id: "hero-1",
          type: "hero",
          ai_content: { headline: "Test", subtext: "Sub" },
        },
      ],
    };
    const result = parseAndValidateAST(JSON.stringify(ast));
    expect(result.sections[0].manual_overrides).toEqual({});
  });

  it("accepts section with type 'goals'", () => {
    const ast = {
      ...validASTFixture,
      sections: [
        {
          id: "goals-1",
          type: "goals",
          ai_content: { title: "Goals", items: [{ label: "Goal 1" }] },
          manual_overrides: {},
        },
      ],
    };
    const result = parseAndValidateAST(JSON.stringify(ast));
    expect(result.sections[0].type).toBe("goals");
  });

  it("accepts section with type 'quiz'", () => {
    const ast = {
      ...validASTFixture,
      sections: [
        {
          id: "quiz-1",
          type: "quiz",
          ai_content: {
            title: "Quiz",
            questions: [{ question: "Q1", choices: ["A", "B", "C", "D"], correctIndex: 0 }],
          },
          manual_overrides: {},
        },
      ],
    };
    const result = parseAndValidateAST(JSON.stringify(ast));
    expect(result.sections[0].type).toBe("quiz");
  });

  it("accepts section with type 'flashcard'", () => {
    const ast = {
      ...validASTFixture,
      sections: [
        {
          id: "flashcard-1",
          type: "flashcard",
          ai_content: { title: "Cards", cards: [{ front: "F", back: "B" }] },
          manual_overrides: {},
        },
      ],
    };
    const result = parseAndValidateAST(JSON.stringify(ast));
    expect(result.sections[0].type).toBe("flashcard");
  });

  it("accepts section with type 'steps'", () => {
    const ast = {
      ...validASTFixture,
      sections: [
        {
          id: "steps-1",
          type: "steps",
          ai_content: { title: "Steps", items: [{ label: "S1", description: "D1" }] },
          manual_overrides: {},
        },
      ],
    };
    const result = parseAndValidateAST(JSON.stringify(ast));
    expect(result.sections[0].type).toBe("steps");
  });

  it("accepts section with type 'ingredients'", () => {
    const ast = {
      ...validASTFixture,
      sections: [
        {
          id: "ingredients-1",
          type: "ingredients",
          ai_content: { title: "Ingredients", items: [{ name: "Salt", quantity: "1 tsp" }] },
          manual_overrides: {},
        },
      ],
    };
    const result = parseAndValidateAST(JSON.stringify(ast));
    expect(result.sections[0].type).toBe("ingredients");
  });
});

describe("resolveField", () => {
  it("returns manual_overrides value when present", () => {
    const section: Section = {
      id: "hero-1",
      type: "hero",
      ai_content: { headline: "AI Headline", subtext: "AI Sub" },
      manual_overrides: { headline: "Manual Headline" },
    };
    expect(resolveField<string>(section, "headline")).toBe("Manual Headline");
  });

  it("returns ai_content value when no override", () => {
    const section: Section = {
      id: "hero-1",
      type: "hero",
      ai_content: { headline: "AI Headline", subtext: "AI Sub" },
      manual_overrides: {},
    };
    expect(resolveField<string>(section, "headline")).toBe("AI Headline");
  });

  it("returns ai_content value when override is not set for that field", () => {
    const section: Section = {
      id: "hero-1",
      type: "hero",
      ai_content: { headline: "AI Headline", subtext: "AI Subtext" },
      manual_overrides: { headline: "Manual Headline" },
    };
    // subtext not overridden — should come from ai_content
    expect(resolveField<string>(section, "subtext")).toBe("AI Subtext");
  });
});

describe("VALID_SECTION_TYPES", () => {
  it("has exactly 11 entries", () => {
    expect(VALID_SECTION_TYPES).toHaveLength(11);
  });
});
