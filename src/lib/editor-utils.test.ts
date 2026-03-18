import { describe, it, expect } from "vitest";
import {
  reorderSections,
  applyManualOverride,
  updateTheme,
  updateSectionAiContent,
} from "@/lib/editor-utils";
import type { Section, WebsiteAST } from "@/types/website-ast";

// Test fixtures
const heroSection: Section = {
  id: "hero-1",
  type: "hero",
  ai_content: { headline: "AI Headline", subtext: "AI Subtext", ctaText: "Get Started" },
  manual_overrides: { headline: "Manual Headline" },
};

const aboutSection: Section = {
  id: "about-1",
  type: "about",
  ai_content: { title: "About Us", body: "We are a team." },
  manual_overrides: {},
};

const ctaSection: Section = {
  id: "cta-1",
  type: "cta",
  ai_content: {
    title: "CTA Title",
    body: "CTA body text",
    buttonText: "Click here",
    buttonUrl: "https://example.com",
  },
  manual_overrides: { title: "Custom CTA Title" },
};

const sampleAST: WebsiteAST = {
  theme: {
    primaryColor: "#2563eb",
    backgroundColor: "#ffffff",
    font: "Inter",
  },
  sections: [heroSection, aboutSection, ctaSection],
  seo: {
    title: "Test Website",
    description: "A test website",
    slug: "test-website",
  },
};

describe("reorderSections", () => {
  it("moves item from oldIndex to newIndex", () => {
    const result = reorderSections(sampleAST.sections, 0, 2);
    expect(result[0].id).toBe("about-1");
    expect(result[1].id).toBe("cta-1");
    expect(result[2].id).toBe("hero-1");
  });

  it("returns identical array when oldIndex equals newIndex", () => {
    const result = reorderSections(sampleAST.sections, 1, 1);
    expect(result[0].id).toBe("hero-1");
    expect(result[1].id).toBe("about-1");
    expect(result[2].id).toBe("cta-1");
  });

  it("moves first item to last position correctly", () => {
    const result = reorderSections(sampleAST.sections, 0, 2);
    expect(result[2].id).toBe("hero-1");
    expect(result).toHaveLength(3);
  });

  it("does not mutate original array", () => {
    const original = [...sampleAST.sections];
    reorderSections(sampleAST.sections, 0, 2);
    expect(sampleAST.sections[0].id).toBe(original[0].id);
  });
});

describe("applyManualOverride", () => {
  it("sets manual_overrides field on matching section", () => {
    const result = applyManualOverride(sampleAST, "hero-1", "subtext", "New Subtext");
    const heroResult = result.sections.find((s) => s.id === "hero-1");
    expect((heroResult?.manual_overrides as Record<string, unknown>)["subtext"]).toBe("New Subtext");
  });

  it("preserves existing manual_overrides when adding a new field", () => {
    const result = applyManualOverride(sampleAST, "hero-1", "subtext", "New Subtext");
    const heroResult = result.sections.find((s) => s.id === "hero-1");
    // Existing override should still be there
    expect((heroResult?.manual_overrides as Record<string, unknown>)["headline"]).toBe(
      "Manual Headline"
    );
  });

  it("does NOT modify ai_content on any section", () => {
    const result = applyManualOverride(sampleAST, "hero-1", "headline", "Override Value");
    const heroResult = result.sections.find((s) => s.id === "hero-1");
    expect((heroResult?.ai_content as unknown as Record<string, unknown>)["headline"]).toBe("AI Headline");
  });

  it("leaves other sections unchanged", () => {
    const result = applyManualOverride(sampleAST, "hero-1", "headline", "New");
    const aboutResult = result.sections.find((s) => s.id === "about-1");
    expect(aboutResult?.manual_overrides).toEqual({});
  });

  it("returns AST unchanged when sectionId does not exist", () => {
    const result = applyManualOverride(sampleAST, "nonexistent-id", "headline", "New");
    expect(result.sections).toHaveLength(3);
    result.sections.forEach((s, i) => {
      expect(s.manual_overrides).toEqual(sampleAST.sections[i].manual_overrides);
    });
  });

  it("does not mutate original AST", () => {
    applyManualOverride(sampleAST, "hero-1", "headline", "Changed");
    expect((heroSection.manual_overrides as Record<string, unknown>)["headline"]).toBe(
      "Manual Headline"
    );
  });
});

describe("updateTheme", () => {
  it("merges partial theme — only changes specified field", () => {
    const result = updateTheme(sampleAST, { primaryColor: "#ff0000" });
    expect(result.theme.primaryColor).toBe("#ff0000");
    expect(result.theme.backgroundColor).toBe("#ffffff");
    expect(result.theme.font).toBe("Inter");
  });

  it("can update all theme fields at once", () => {
    const result = updateTheme(sampleAST, {
      primaryColor: "#000000",
      backgroundColor: "#f5f5f5",
      font: "Roboto",
    });
    expect(result.theme.primaryColor).toBe("#000000");
    expect(result.theme.backgroundColor).toBe("#f5f5f5");
    expect(result.theme.font).toBe("Roboto");
  });

  it("returns new AST with sections and seo unchanged", () => {
    const result = updateTheme(sampleAST, { font: "Lora" });
    expect(result.sections).toHaveLength(3);
    expect(result.seo.slug).toBe("test-website");
  });

  it("does not mutate original AST", () => {
    updateTheme(sampleAST, { primaryColor: "#ff0000" });
    expect(sampleAST.theme.primaryColor).toBe("#2563eb");
  });
});

describe("updateSectionAiContent", () => {
  it("replaces ai_content on matching section", () => {
    const newAiContent = { headline: "New AI Headline", subtext: "New AI Subtext" };
    const result = updateSectionAiContent(sampleAST, "hero-1", newAiContent);
    const heroResult = result.sections.find((s) => s.id === "hero-1");
    expect((heroResult?.ai_content as unknown as Record<string, unknown>)["headline"]).toBe(
      "New AI Headline"
    );
  });

  it("preserves manual_overrides when replacing ai_content", () => {
    const newAiContent = { headline: "New AI Headline", subtext: "New AI Subtext" };
    const result = updateSectionAiContent(sampleAST, "hero-1", newAiContent);
    const heroResult = result.sections.find((s) => s.id === "hero-1");
    expect((heroResult?.manual_overrides as Record<string, unknown>)["headline"]).toBe(
      "Manual Headline"
    );
  });

  it("returns AST unchanged when sectionId does not exist", () => {
    const newAiContent = { headline: "New AI Headline", subtext: "New" };
    const result = updateSectionAiContent(sampleAST, "nonexistent-id", newAiContent);
    expect(result.sections).toHaveLength(3);
    const heroResult = result.sections.find((s) => s.id === "hero-1");
    expect((heroResult?.ai_content as unknown as Record<string, unknown>)["headline"]).toBe("AI Headline");
  });

  it("does not affect other sections", () => {
    const newAiContent = { headline: "New", subtext: "New" };
    const result = updateSectionAiContent(sampleAST, "hero-1", newAiContent);
    const aboutResult = result.sections.find((s) => s.id === "about-1");
    expect((aboutResult?.ai_content as unknown as Record<string, unknown>)["title"]).toBe("About Us");
  });
});
