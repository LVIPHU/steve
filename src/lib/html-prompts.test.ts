import { describe, it, expect } from "vitest";
import {
  buildSystemPrompt,
  stripMarkdownFences,
} from "./html-prompts";

describe("buildSystemPrompt", () => {
  it("contains cdn.tailwindcss.com", () => {
    expect(buildSystemPrompt()).toContain("cdn.tailwindcss.com");
  });

  it("contains appgen- prefix instruction", () => {
    expect(buildSystemPrompt()).toContain("appgen-");
  });

  it("instructs to start with <!DOCTYPE html>", () => {
    expect(buildSystemPrompt()).toContain("<!DOCTYPE html>");
  });

  it("contains vanilla JavaScript instruction", () => {
    expect(buildSystemPrompt()).toContain("vanilla JavaScript");
  });

  it("bans Alpine.js x-for", () => {
    expect(buildSystemPrompt()).toContain("x-for");
  });

  it("bans alert()", () => {
    expect(buildSystemPrompt()).toContain("alert()");
  });

  it("bans DaisyUI classes", () => {
    expect(buildSystemPrompt()).toContain("DaisyUI");
  });

  it("does NOT contain template structure hints", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).not.toContain("LANDING PAGE");
    expect(prompt).not.toContain("PORTFOLIO / CV");
    expect(prompt).not.toContain("DASHBOARD / TOOL");
    expect(prompt).not.toContain("BLOG / DOCS");
  });

  it("contains CSS custom property instruction", () => {
    expect(buildSystemPrompt()).toContain("--color-primary");
  });

  it("contains Component References instruction", () => {
    expect(buildSystemPrompt()).toContain("Component References");
  });

  it("contains flip card CSS rules", () => {
    expect(buildSystemPrompt()).toContain("transform-style: preserve-3d");
  });

  it("does NOT contain backward-compat alias references in source", () => {
    // buildFreshSystemPrompt and buildEditSystemPrompt were removed in Phase 11
    // This test verifies buildSystemPrompt is the canonical export
    const result = buildSystemPrompt();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(100);
  });
});

describe("buildSystemPrompt edit mode", () => {
  it("returns short edit prompt when mode is 'edit'", () => {
    const prompt = buildSystemPrompt("edit");
    expect(prompt).toContain("editing an existing HTML file");
    expect(prompt).toContain("ONLY modify what the user specifically requests");
    expect(prompt).toContain("<!DOCTYPE html>");
  });

  it("edit prompt does NOT contain CDN setup section", () => {
    const prompt = buildSystemPrompt("edit");
    expect(prompt).not.toContain("cdn.tailwindcss.com");
    expect(prompt).not.toContain("preline.js");
  });

  it("edit prompt does NOT contain Component References instruction", () => {
    const prompt = buildSystemPrompt("edit");
    expect(prompt).not.toContain("Component References");
  });

  it("default mode is fresh (zero-param call still works)", () => {
    const fresh = buildSystemPrompt();
    expect(fresh).toContain("cdn.tailwindcss.com");
  });
});

describe("stripMarkdownFences", () => {
  it("strips opening ```html fence and closing ```", () => {
    const input = "```html\n<div>hi</div>\n```";
    expect(stripMarkdownFences(input)).toBe("<div>hi</div>");
  });

  it("returns clean HTML unchanged", () => {
    const html = "<!DOCTYPE html><html></html>";
    expect(stripMarkdownFences(html)).toBe(html);
  });

  it("strips fence without language tag", () => {
    const input = "```\n<p>x</p>\n```";
    expect(stripMarkdownFences(input)).toBe("<p>x</p>");
  });
});
