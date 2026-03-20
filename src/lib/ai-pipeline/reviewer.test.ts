import { describe, it, expect } from "vitest";
import { ReviewResultSchema, FALLBACK_REVIEW } from "./reviewer";

describe("ReviewResultSchema", () => {
  it("validates a correct review result", () => {
    const valid = { score: 85, visual: 35, content: 25, technical: 25, must_fix: [], suggestions: ["improve contrast"] };
    expect(ReviewResultSchema.parse(valid)).toEqual(valid);
  });

  it("rejects score above 100", () => {
    const invalid = { score: 150, visual: 40, content: 30, technical: 30, must_fix: [], suggestions: [] };
    expect(() => ReviewResultSchema.parse(invalid)).toThrow();
  });

  it("rejects visual above 40", () => {
    const invalid = { score: 85, visual: 50, content: 25, technical: 25, must_fix: [], suggestions: [] };
    expect(() => ReviewResultSchema.parse(invalid)).toThrow();
  });

  it("rejects content above 30", () => {
    const invalid = { score: 85, visual: 35, content: 40, technical: 25, must_fix: [], suggestions: [] };
    expect(() => ReviewResultSchema.parse(invalid)).toThrow();
  });

  it("rejects technical above 30", () => {
    const invalid = { score: 85, visual: 35, content: 25, technical: 40, must_fix: [], suggestions: [] };
    expect(() => ReviewResultSchema.parse(invalid)).toThrow();
  });
});

describe("FALLBACK_REVIEW", () => {
  it("has score 100 (error = assume OK, skip refine)", () => {
    expect(FALLBACK_REVIEW.score).toBe(100);
  });

  it("has empty must_fix array", () => {
    expect(FALLBACK_REVIEW.must_fix).toEqual([]);
  });

  it("has dimension sub-scores summing to 100", () => {
    expect(FALLBACK_REVIEW.visual + FALLBACK_REVIEW.content + FALLBACK_REVIEW.technical).toBe(100);
  });
});
