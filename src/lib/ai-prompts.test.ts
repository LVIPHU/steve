import { describe, it, expect } from "vitest";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai-prompts";

describe("buildSystemPrompt", () => {
  it('blog template contains "hero", "content", "cta" section suggestions', () => {
    const prompt = buildSystemPrompt("blog");
    expect(prompt).toContain("hero");
    expect(prompt).toContain("content");
    expect(prompt).toContain("cta");
  });

  it('portfolio template contains "hero", "about", "features", "cta"', () => {
    const prompt = buildSystemPrompt("portfolio");
    expect(prompt).toContain("hero");
    expect(prompt).toContain("about");
    expect(prompt).toContain("features");
    expect(prompt).toContain("cta");
  });

  it("blog template uses correct primary color", () => {
    const prompt = buildSystemPrompt("blog");
    expect(prompt).toContain("#2563eb");
  });

  it("portfolio template uses correct primary color", () => {
    const prompt = buildSystemPrompt("portfolio");
    expect(prompt).toContain("#7c3aed");
  });

  it("blog template uses Inter font", () => {
    const prompt = buildSystemPrompt("blog");
    expect(prompt).toContain("Inter");
  });

  it("returns a non-empty string", () => {
    const prompt = buildSystemPrompt("fitness");
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("falls back to blog preset for unknown template", () => {
    const prompt = buildSystemPrompt("unknown-template");
    expect(prompt).toContain("hero");
    expect(prompt).toContain("#2563eb");
  });
});

describe("buildUserPrompt", () => {
  it("includes note content when noteJson is provided", () => {
    const noteJson = '{"title": "My Note", "body": "Note body content"}';
    const prompt = buildUserPrompt(noteJson);
    expect(prompt).toContain("My Note");
    expect(prompt).toContain("Note body content");
  });

  it("includes additional instructions when prompt is provided", () => {
    const prompt = buildUserPrompt(null, "make it modern");
    expect(prompt).toContain("make it modern");
  });

  it("includes both note and additional instructions when both provided", () => {
    const noteJson = '{"title": "My Blog"}';
    const prompt = buildUserPrompt(noteJson, "use dark theme");
    expect(prompt).toContain("My Blog");
    expect(prompt).toContain("use dark theme");
  });

  it('returns placeholder message when neither noteJson nor prompt provided', () => {
    const prompt = buildUserPrompt(null, null);
    expect(prompt).toContain("placeholder");
  });

  it('returns placeholder when called with no arguments', () => {
    const prompt = buildUserPrompt();
    expect(prompt).toContain("placeholder");
  });
});
