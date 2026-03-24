import { describe, it, expect } from "vitest";
import { DesignResultSchema, FALLBACK_DESIGN } from "./design-agent";

describe("DesignResultSchema", () => {
  it("accepts valid bold-dark preset", () => {
    const valid = {
      preset: "bold-dark",
      palette: { primary: "#E63946", secondary: "#1D3557", accent: "#457B9D", bg: "#F1FAEE" },
      fonts: { heading: "Montserrat", body: "Inter" },
      borderRadius: "rounded",
      cardStyle: "shadow",
      heroStyle: "centered",
      density: "comfortable",
    };
    expect(DesignResultSchema.parse(valid)).toEqual(valid);
  });

  it("accepts all 5 preset values", () => {
    const presets = ["bold-dark", "warm-organic", "clean-minimal", "playful-bright", "professional-blue"];
    for (const preset of presets) {
      const obj = {
        preset,
        palette: { primary: "#000", secondary: "#111", accent: "#222", bg: "#FFF" },
        fonts: { heading: "Roboto", body: "Open Sans" },
        borderRadius: "rounded",
        cardStyle: "bordered",
        heroStyle: "centered",
        density: "comfortable",
      };
      expect(() => DesignResultSchema.parse(obj)).not.toThrow();
    }
  });

  it("rejects invalid preset value", () => {
    const invalid = {
      preset: "neon-glow",
      palette: { primary: "#000", secondary: "#111", accent: "#222", bg: "#FFF" },
      fonts: { heading: "Roboto", body: "Open Sans" },
    };
    expect(() => DesignResultSchema.parse(invalid)).toThrow();
  });

  it("rejects missing palette", () => {
    const invalid = { preset: "bold-dark", fonts: { heading: "Roboto", body: "Open Sans" } };
    expect(() => DesignResultSchema.parse(invalid)).toThrow();
  });

  it("rejects missing fonts", () => {
    const invalid = { preset: "bold-dark", palette: { primary: "#000", secondary: "#111", accent: "#222", bg: "#FFF" } };
    expect(() => DesignResultSchema.parse(invalid)).toThrow();
  });
});

describe("FALLBACK_DESIGN", () => {
  it("has preset clean-minimal", () => {
    expect(FALLBACK_DESIGN.preset).toBe("clean-minimal");
  });

  it("has all 4 palette keys", () => {
    expect(FALLBACK_DESIGN.palette).toHaveProperty("primary");
    expect(FALLBACK_DESIGN.palette).toHaveProperty("secondary");
    expect(FALLBACK_DESIGN.palette).toHaveProperty("accent");
    expect(FALLBACK_DESIGN.palette).toHaveProperty("bg");
  });

  it("has Inter for both heading and body fonts", () => {
    expect(FALLBACK_DESIGN.fonts).toEqual({ heading: "Inter", body: "Inter" });
  });

  it("validates against DesignResultSchema", () => {
    expect(() => DesignResultSchema.parse(FALLBACK_DESIGN)).not.toThrow();
  });
});
