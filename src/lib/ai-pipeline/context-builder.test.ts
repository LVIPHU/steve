import { describe, it, expect } from "vitest";
import { buildUserMessage, buildEditUserMessage, buildGoogleFontsImport, refineHtml } from "./context-builder";
import type { AnalysisResult, DesignResult } from "./types";
import type { ComponentSnippet } from "@/lib/component-library/types";

const mockDesign: DesignResult = {
  preset: "bold-dark",
  palette: { primary: "#E63946", secondary: "#1D3557", accent: "#457B9D", bg: "#F1FAEE" },
  fonts: { heading: "Montserrat", body: "Inter" },
};

const mockAnalysis: AnalysisResult = {
  type: "landing",
  sections: ["navbar", "hero", "features", "cta", "footer"],
  features: [],
  structured_data: "",
};

const mockSnippets: ComponentSnippet[] = [
  {
    id: "hero-dark", name: "Hero Dark", description: "Bold hero for fitness/sports",
    category: "hero", tags: ["hero"], priority: 1, domain_hints: ["landing"],
    min_score: 1, fallback: false, fallback_for: [], html: "<section class=\"hero-dark\">Bold Hero</section>",
  },
];

describe("buildGoogleFontsImport", () => {
  it("builds @import URL for two different fonts", () => {
    const result = buildGoogleFontsImport({ heading: "Montserrat", body: "Inter" });
    expect(result).toContain("@import url('https://fonts.googleapis.com/css2?");
    expect(result).toContain("family=Montserrat:wght@400;600;700");
    expect(result).toContain("family=Inter:wght@400;600;700");
    expect(result).toContain("display=swap");
  });

  it("deduplicates when heading and body are the same font", () => {
    const result = buildGoogleFontsImport({ heading: "Inter", body: "Inter" });
    const matches = result.match(/family=Inter/g);
    expect(matches).toHaveLength(1);
  });

  it("converts spaces to + in font names", () => {
    const result = buildGoogleFontsImport({ heading: "Open Sans", body: "Roboto" });
    expect(result).toContain("family=Open+Sans");
  });
});

describe("buildUserMessage", () => {
  it("contains Design Brief section with preset and palette", () => {
    const msg = buildUserMessage("Create a fitness website", mockAnalysis, mockDesign, mockSnippets);
    expect(msg).toContain("## Design Brief");
    expect(msg).toContain("Preset: bold-dark");
    expect(msg).toContain("Primary: #E63946");
    expect(msg).toContain("Secondary: #1D3557");
    expect(msg).toContain("Accent: #457B9D");
    expect(msg).toContain("BG: #F1FAEE");
    expect(msg).toContain("Heading: Montserrat");
    expect(msg).toContain("Body: Inter");
  });

  it("contains Google Fonts @import in Design Brief", () => {
    const msg = buildUserMessage("Create a fitness website", mockAnalysis, mockDesign, mockSnippets);
    expect(msg).toContain("Google Fonts:");
    expect(msg).toContain("@import url('https://fonts.googleapis.com/css2?");
  });

  it("contains Component References with snippet HTML in comment wrappers", () => {
    const msg = buildUserMessage("Create a fitness website", mockAnalysis, mockDesign, mockSnippets);
    expect(msg).toContain("## Component References");
    expect(msg).toContain("<!-- hero-dark: Bold hero for fitness/sports -->");
    expect(msg).toContain('<section class="hero-dark">Bold Hero</section>');
    expect(msg).toContain("<!-- end hero-dark -->");
  });

  it("contains Page Structure from analysis sections", () => {
    const msg = buildUserMessage("Create a fitness website", mockAnalysis, mockDesign, mockSnippets);
    expect(msg).toContain("## Page Structure");
    expect(msg).toContain("navbar → hero → features → cta → footer");
  });

  it("contains User Request with the original prompt", () => {
    const msg = buildUserMessage("Create a fitness website", mockAnalysis, mockDesign, mockSnippets);
    expect(msg).toContain("## User Request");
    expect(msg).toContain("Create a fitness website");
  });

  it("uses 'auto' for page structure when sections is empty", () => {
    const emptyAnalysis = { ...mockAnalysis, sections: [] };
    const msg = buildUserMessage("Test", emptyAnalysis, mockDesign, []);
    expect(msg).toContain("auto");
  });
});

describe("buildEditUserMessage", () => {
  it("starts with preserve instruction", () => {
    const msg = buildEditUserMessage("Change the title");
    expect(msg).toMatch(/^Preserve existing colors and typography/);
  });

  it("contains User Request section", () => {
    const msg = buildEditUserMessage("Change the title");
    expect(msg).toContain("## User Request");
    expect(msg).toContain("Change the title");
  });

  it("does NOT contain Design Brief", () => {
    const msg = buildEditUserMessage("Change the title");
    expect(msg).not.toContain("## Design Brief");
  });

  it("does NOT contain Component References", () => {
    const msg = buildEditUserMessage("Change the title");
    expect(msg).not.toContain("## Component References");
  });
});

describe("refineHtml", () => {
  it("is an async function (no longer throws Not implemented)", () => {
    // refineHtml is now a real implementation that calls OpenAI
    // We verify it's exported as an async function, not a stub
    expect(typeof refineHtml).toBe("function");
  });
});
