import { describe, it, expect } from "vitest";
import { parseAndValidateAST, resolveField } from "@/lib/ast-utils";
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
