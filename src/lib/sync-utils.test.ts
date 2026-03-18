import { describe, it, expect } from "vitest";
import { mergeAiSectionsIntoAst } from "@/lib/sync-utils";
import type { Section, WebsiteAST } from "@/types/website-ast";

// Helper to access content fields with type safety
const asRecord = (v: unknown) => v as unknown as Record<string, unknown>;

// Test fixtures
const existingAst: WebsiteAST = {
  theme: { primaryColor: "#2563eb", backgroundColor: "#ffffff", font: "Inter" },
  sections: [
    {
      id: "hero-1",
      type: "hero",
      ai_content: { headline: "Old Headline", subtext: "Old Subtext" },
      manual_overrides: { headline: "User Edit" },
    },
    {
      id: "content-1",
      type: "content",
      ai_content: { title: "Old Title", body: "Old Body" },
      manual_overrides: {},
    },
  ],
  seo: { title: "Test", description: "Desc", slug: "test" },
};

const newAst: WebsiteAST = {
  theme: { primaryColor: "#ff0000", backgroundColor: "#000000", font: "Roboto" },
  sections: [
    {
      id: "irrelevant-id-1",
      type: "hero",
      ai_content: { headline: "New Headline", subtext: "New Subtext" },
      manual_overrides: {},
    },
    {
      id: "irrelevant-id-2",
      type: "content",
      ai_content: { title: "New Title", body: "New Body" },
      manual_overrides: {},
    },
  ],
  seo: { title: "New Title", description: "New Desc", slug: "new" },
};

describe("mergeAiSectionsIntoAst", () => {
  it("Test 1: same section count — ai_content replaced, manual_overrides preserved, id/type preserved", () => {
    const result = mergeAiSectionsIntoAst(existingAst, newAst);

    // ai_content is replaced with new values
    expect(asRecord(result.sections[0].ai_content)["headline"]).toBe("New Headline");
    expect(asRecord(result.sections[1].ai_content)["title"]).toBe("New Title");

    // manual_overrides are preserved from existing
    expect(asRecord(result.sections[0].manual_overrides)["headline"]).toBe("User Edit");
    expect(result.sections[1].manual_overrides).toEqual({});

    // id and type are preserved from existing (not from newAst)
    expect(result.sections[0].id).toBe("hero-1");
    expect(result.sections[1].id).toBe("content-1");
    expect(result.sections[0].type).toBe("hero");
    expect(result.sections[1].type).toBe("content");
  });

  it("Test 2: fewer new sections than existing — extra existing sections kept unchanged", () => {
    const shorterNewAst: WebsiteAST = {
      ...newAst,
      sections: [newAst.sections[0]], // only 1 section
    };

    const result = mergeAiSectionsIntoAst(existingAst, shorterNewAst);

    // Should still have 2 sections (same count as existing)
    expect(result.sections).toHaveLength(2);

    // First section is merged (ai_content replaced)
    expect(asRecord(result.sections[0].ai_content)["headline"]).toBe("New Headline");

    // Second section is kept unchanged (no new section at index 1)
    expect(result.sections[1].id).toBe("content-1");
    expect(asRecord(result.sections[1].ai_content)["title"]).toBe("Old Title");
    expect(asRecord(result.sections[1].ai_content)["body"]).toBe("Old Body");
  });

  it("Test 3: more new sections than existing — extra new sections ignored", () => {
    const extraSection: Section = {
      id: "extra-1",
      type: "about",
      ai_content: { title: "Extra About", body: "Extra body" },
      manual_overrides: {},
    };
    const longerNewAst: WebsiteAST = {
      ...newAst,
      sections: [...newAst.sections, extraSection], // 3 sections
    };

    const result = mergeAiSectionsIntoAst(existingAst, longerNewAst);

    // Should only have 2 sections (same count as existing), extras ignored
    expect(result.sections).toHaveLength(2);

    // Both are merged properly
    expect(asRecord(result.sections[0].ai_content)["headline"]).toBe("New Headline");
    expect(asRecord(result.sections[1].ai_content)["title"]).toBe("New Title");
  });

  it("Test 4: empty new sections array — all existing sections kept unchanged", () => {
    const emptyNewAst: WebsiteAST = {
      ...newAst,
      sections: [],
    };

    const result = mergeAiSectionsIntoAst(existingAst, emptyNewAst);

    // Should have 2 sections, all unchanged
    expect(result.sections).toHaveLength(2);
    expect(asRecord(result.sections[0].ai_content)["headline"]).toBe("Old Headline");
    expect(asRecord(result.sections[1].ai_content)["title"]).toBe("Old Title");

    // manual_overrides still preserved
    expect(asRecord(result.sections[0].manual_overrides)["headline"]).toBe("User Edit");
  });

  it("preserves theme and seo from existing AST", () => {
    const result = mergeAiSectionsIntoAst(existingAst, newAst);
    // Theme and seo should come from existing, not new
    expect(result.theme.primaryColor).toBe("#2563eb");
    expect(result.seo.slug).toBe("test");
  });
});
