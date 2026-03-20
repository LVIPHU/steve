import { describe, it, expect } from "vitest";
import {
  buildSystemPrompt,
  buildFreshSystemPrompt,
  buildEditSystemPrompt,
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

  it("includes DaisyUI CDN", () => {
    expect(buildSystemPrompt()).toContain("daisyui");
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
    expect(buildSystemPrompt()).toContain("perspective: 1000px");
  });
});

describe("buildFreshSystemPrompt (backward-compat alias)", () => {
  it("returns the same result as buildSystemPrompt", () => {
    expect(buildFreshSystemPrompt()).toBe(buildSystemPrompt());
  });
});

describe("buildEditSystemPrompt (backward-compat wrapper)", () => {
  it("contains the provided currentHtml", () => {
    const html = "<div>test</div>";
    expect(buildEditSystemPrompt(html)).toContain("<div>test</div>");
  });

  it("contains preserve instruction", () => {
    expect(buildEditSystemPrompt("<p>x</p>")).toContain("Preserve existing colors and typography");
  });

  it("contains the base system prompt content", () => {
    expect(buildEditSystemPrompt("<p>x</p>")).toContain("cdn.tailwindcss.com");
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
