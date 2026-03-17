import { describe, it, expect } from "vitest";
import { TEMPLATES, TemplateId, suggestTemplate, KEYWORD_MAP } from "@/lib/templates";

describe("TEMPLATES constant", () => {
  it("has exactly 5 entries", () => {
    expect(TEMPLATES).toHaveLength(5);
  });

  it("contains the 5 required template ids", () => {
    const ids = TEMPLATES.map((t) => t.id);
    expect(ids).toContain("blog");
    expect(ids).toContain("portfolio");
    expect(ids).toContain("fitness");
    expect(ids).toContain("cooking");
    expect(ids).toContain("learning");
  });

  it("each entry has id, name, icon fields", () => {
    for (const template of TEMPLATES) {
      expect(typeof template.id).toBe("string");
      expect(typeof template.name).toBe("string");
      expect(typeof template.icon).toBe("string");
    }
  });
});

describe("KEYWORD_MAP", () => {
  it("is an object with string keys mapping to TemplateId values", () => {
    expect(typeof KEYWORD_MAP).toBe("object");
    const validIds: TemplateId[] = ["blog", "portfolio", "fitness", "cooking", "learning"];
    for (const value of Object.values(KEYWORD_MAP)) {
      expect(validIds).toContain(value);
    }
  });
});

describe("suggestTemplate", () => {
  it("returns 'blog' for input containing 'blog'", () => {
    expect(suggestTemplate("my-blog-post")).toBe("blog");
  });

  it("returns 'portfolio' for input containing 'portfolio'", () => {
    expect(suggestTemplate("portfolio-project")).toBe("portfolio");
  });

  it("returns 'fitness' for input containing 'gym'", () => {
    expect(suggestTemplate("gym-workout")).toBe("fitness");
  });

  it("returns 'cooking' for input containing 'cooking'", () => {
    expect(suggestTemplate("cooking-recipe")).toBe("cooking");
  });

  it("returns 'learning' for input containing 'hoc'", () => {
    expect(suggestTemplate("hoc-tap-notes")).toBe("learning");
  });

  it("returns null for unknown keywords", () => {
    expect(suggestTemplate("random-xyz-123")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(suggestTemplate("")).toBeNull();
  });
});
