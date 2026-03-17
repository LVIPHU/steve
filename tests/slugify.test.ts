import { describe, it, expect } from "vitest";
import { generateSlug } from "@/lib/slugify";

describe("generateSlug", () => {
  it("converts text to kebab-case", () => {
    expect(generateSlug("My First Website")).toBe("my-first-website");
  });

  it("trims leading and trailing spaces", () => {
    expect(generateSlug("  Hello  World  ")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(generateSlug("Special @#$ Characters!")).toBe("special-characters");
  });

  it("returns 'website' for empty string", () => {
    expect(generateSlug("")).toBe("website");
  });

  it("result is at most 60 characters", () => {
    const longName = "a".repeat(100);
    expect(generateSlug(longName).length).toBeLessThanOrEqual(60);
  });

  it("collapses multiple spaces into single dash", () => {
    expect(generateSlug("hello   world")).toBe("hello-world");
  });
});
