import { describe, it, expect } from "vitest";
import {
  buildFreshSystemPrompt,
  buildEditSystemPrompt,
  stripMarkdownFences,
} from "./html-prompts";

describe("buildFreshSystemPrompt", () => {
  it("contains cdn.tailwindcss.com", () => {
    expect(buildFreshSystemPrompt()).toContain("cdn.tailwindcss.com");
  });

  it("contains appgen- prefix instruction", () => {
    expect(buildFreshSystemPrompt()).toContain("appgen-");
  });

  it("instructs to start with <!DOCTYPE html>", () => {
    expect(buildFreshSystemPrompt()).toContain("<!DOCTYPE html>");
  });

  it("contains vanilla JavaScript instruction", () => {
    expect(buildFreshSystemPrompt()).toContain("vanilla JavaScript");
  });

  it("bans Alpine.js x-for", () => {
    expect(buildFreshSystemPrompt()).toContain("x-for");
  });

  it("bans alert()", () => {
    expect(buildFreshSystemPrompt()).toContain("alert()");
  });

  it("includes DaisyUI CDN", () => {
    expect(buildFreshSystemPrompt()).toContain("daisyui");
  });

  it("includes all 4 template types", () => {
    const prompt = buildFreshSystemPrompt();
    expect(prompt).toContain("LANDING PAGE");
    expect(prompt).toContain("PORTFOLIO / CV");
    expect(prompt).toContain("DASHBOARD / TOOL");
    expect(prompt).toContain("BLOG / DOCS");
  });
});

describe("buildEditSystemPrompt", () => {
  it("contains the provided currentHtml verbatim", () => {
    const html = "<div>test</div>";
    expect(buildEditSystemPrompt(html)).toContain("<div>test</div>");
  });

  it("contains appgen- prefix preservation instruction", () => {
    expect(buildEditSystemPrompt("<p>x</p>")).toContain("appgen-");
  });

  it("bans alert() in edit mode", () => {
    expect(buildEditSystemPrompt("<p>x</p>")).toContain("alert()");
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
