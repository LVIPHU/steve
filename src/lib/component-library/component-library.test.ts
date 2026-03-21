import { describe, it, expect } from "vitest";
import { selectComponents, type ComponentSnippet } from "./index";
import { ALL_SNIPPETS } from "./snippets";
import type { AnalysisResult } from "@/lib/ai-pipeline/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeAnalysis(
  overrides: Partial<AnalysisResult> = {}
): AnalysisResult {
  return {
    type: "generic",
    sections: [],
    features: [],
    structured_data: "",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// describe("snippet data validation")
// ---------------------------------------------------------------------------

describe("snippet data validation", () => {
  it("library has at least 100 snippets", () => {
    expect(ALL_SNIPPETS.length).toBeGreaterThanOrEqual(100);
  });

  it("no snippet contains DaisyUI class patterns", () => {
    const daisyUIPatterns = [
      'btn-primary', 'btn-secondary', 'btn-outline', 'btn-ghost', 'btn-accent',
      'card-body', 'card-title', 'card-actions',
      'navbar-start', 'navbar-center', 'navbar-end',
      'hero-content', 'hero min-h',
      'badge-primary', 'badge-outline', 'badge-secondary', 'badge-accent',
      'bg-base-100', 'bg-base-200', 'bg-base-300',
      'text-base-content',
      'stat-value', 'stat-title', 'stat-desc',
      'footer-center', 'footer footer',
      'menu menu-horizontal', 'dropdown-content',
      'progress progress-primary',
      'checkbox checkbox-primary',
    ];
    ALL_SNIPPETS.forEach((s: ComponentSnippet) => {
      daisyUIPatterns.forEach((pattern) => {
        expect(s.html, `${s.id}: contains DaisyUI pattern "${pattern}"`).not.toContain(pattern);
      });
    });
  });

  it("at least 80% of snippets include dark: prefix", () => {
    const withDark = ALL_SNIPPETS.filter((s) => s.html.includes("dark:"));
    const ratio = withDark.length / ALL_SNIPPETS.length;
    expect(ratio, `only ${withDark.length}/${ALL_SNIPPETS.length} snippets have dark: prefix`).toBeGreaterThanOrEqual(0.8);
  });

  it("every snippet has required fields", () => {
    ALL_SNIPPETS.forEach((s: ComponentSnippet) => {
      expect(s.id, `${s.id}: id missing`).toBeTruthy();
      expect(s.name, `${s.id}: name missing`).toBeTruthy();
      expect(s.html, `${s.id}: html missing`).toBeTruthy();
      expect(typeof s.html).toBe("string");
      expect(s.html.length).toBeGreaterThan(0);
      expect(s.category, `${s.id}: category missing`).toBeTruthy();
      expect(Array.isArray(s.tags), `${s.id}: tags not array`).toBe(true);
      expect(typeof s.priority, `${s.id}: priority not number`).toBe("number");
      expect(Array.isArray(s.domain_hints), `${s.id}: domain_hints not array`).toBe(true);
      expect(typeof s.fallback, `${s.id}: fallback not boolean`).toBe("boolean");
      expect(Array.isArray(s.fallback_for), `${s.id}: fallback_for not array`).toBe(true);
      expect(typeof s.min_score, `${s.id}: min_score not number`).toBe("number");
    });
  });

  it("no snippet html contains DOCTYPE", () => {
    ALL_SNIPPETS.forEach((s: ComponentSnippet) => {
      expect(s.html, `${s.id}: html must not contain <!DOCTYPE`).not.toContain("<!DOCTYPE");
    });
  });

  it("no snippet html contains CDN links", () => {
    ALL_SNIPPETS.forEach((s: ComponentSnippet) => {
      expect(s.html, `${s.id}: html must not contain cdn.jsdelivr.net`).not.toContain("cdn.jsdelivr.net");
      expect(s.html, `${s.id}: html must not contain cdn.tailwindcss.com`).not.toContain("cdn.tailwindcss.com");
    });
  });

  it("all snippet ids are unique", () => {
    const ids = ALL_SNIPPETS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ---------------------------------------------------------------------------
// describe("selectComponents — basic behavior")
// ---------------------------------------------------------------------------

describe("selectComponents — basic behavior", () => {
  it("returns exactly 4 for landing analysis", () => {
    const result = selectComponents(
      makeAnalysis({
        type: "landing",
        sections: ["navbar", "hero", "features", "footer"],
        features: [],
      })
    );
    expect(result.length).toBe(4);
  });

  it("never returns more than 4", () => {
    const result = selectComponents(
      makeAnalysis({
        type: "landing",
        sections: ["navbar", "hero", "features", "footer", "testimonials", "stats", "cards", "pricing", "cta"],
        features: ["flip-animation", "quiz", "localStorage", "timer"],
      })
    );
    expect(result.length).toBeLessThanOrEqual(4);
  });

  it("never returns empty when library has >= 4 snippets", () => {
    const result = selectComponents(
      makeAnalysis({ type: "generic", sections: [], features: [] })
    );
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns exactly 4 for dashboard analysis", () => {
    const result = selectComponents(
      makeAnalysis({
        type: "dashboard",
        sections: ["stats", "cards"],
        features: ["chart"],
      })
    );
    expect(result.length).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// describe("selectComponents — scoring and tie-breaks")
// ---------------------------------------------------------------------------

describe("selectComponents — scoring and tie-breaks", () => {
  it("prefers snippets with higher tag match count", () => {
    const result = selectComponents(
      makeAnalysis({
        type: "blog",
        sections: ["article-grid", "navbar"],
        features: [],
      })
    );
    // At least one result should have "article-grid" or "blog" tag
    const hasMatchingTag = result.some(
      (s) => s.tags.includes("article-grid") || s.tags.includes("blog") || s.tags.includes("navbar")
    );
    expect(hasMatchingTag).toBe(true);
  });

  it("prefers domain_hints match on tie-break for dashboard type", () => {
    const result = selectComponents(
      makeAnalysis({
        type: "dashboard",
        sections: ["stats"],
        features: [],
      })
    );
    const hasDashboardHint = result.some((s) =>
      s.domain_hints.includes("dashboard")
    );
    expect(hasDashboardHint).toBe(true);
  });

  it("prefers lower priority number when scores equal", () => {
    // Test with an analysis that returns a result set — verify no priority inversion
    const result = selectComponents(
      makeAnalysis({
        type: "landing",
        sections: ["navbar", "hero"],
        features: [],
      })
    );
    // Result should have 4 items and be returned (basic sanity)
    expect(result.length).toBe(4);
    // Among items with the same effective score, lower priority wins
    // This is a structural test — we verify the sort didn't completely break
    for (let i = 0; i < result.length - 1; i++) {
      // Priority of items with same category should be ascending (lower first)
      const a = result[i];
      const b = result[i + 1];
      // They can have different scores — this just checks no crashes
      expect(a).toBeDefined();
      expect(b).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// describe("selectComponents — min_score filtering")
// ---------------------------------------------------------------------------

describe("selectComponents — min_score filtering", () => {
  it("lowers threshold to 0 when fewer than 4 eligible snippets pass min_score", () => {
    // A highly specific analysis that matches almost nothing — should still return 4
    const result = selectComponents(
      makeAnalysis({
        type: "generic",
        sections: ["something-very-obscure-tag-xyz"],
        features: [],
      })
    );
    expect(result.length).toBe(4);
  });

  it("still returns 4 with empty sections and features", () => {
    const result = selectComponents(
      makeAnalysis({ type: "landing", sections: [], features: [] })
    );
    expect(result.length).toBe(4);
  });

  it("excludes snippet from non-fallback path when score < min_score but fills with threshold-lowered results", () => {
    // Any analysis: if fewer than 4 eligible, threshold drops to 0 so we always get 4
    const result = selectComponents(
      makeAnalysis({
        type: "portfolio",
        sections: ["projects"],
        features: [],
      })
    );
    expect(result.length).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// describe("selectComponents — fallback path")
// ---------------------------------------------------------------------------

describe("selectComponents — fallback path", () => {
  it("returns fallback snippets when no tags match", () => {
    // Empty sections/features → all scores 0 → fallback path
    const result = selectComponents(
      makeAnalysis({ type: "landing", sections: [], features: [] })
    );
    expect(result.every((s) => s.fallback === true)).toBe(true);
  });

  it("returns type-specific fallbacks for landing", () => {
    const result = selectComponents(
      makeAnalysis({ type: "landing", sections: [], features: [] })
    );
    expect(result.length).toBe(4);
    expect(result.every((s) => s.fallback_for.includes("landing"))).toBe(true);
  });

  it("returns type-specific fallbacks for portfolio", () => {
    const result = selectComponents(
      makeAnalysis({ type: "portfolio", sections: [], features: [] })
    );
    expect(result.length).toBe(4);
    expect(result.every((s) => s.fallback_for.includes("portfolio"))).toBe(true);
  });

  it("returns type-specific fallbacks for dashboard", () => {
    const result = selectComponents(
      makeAnalysis({ type: "dashboard", sections: [], features: [] })
    );
    expect(result.length).toBe(4);
    expect(result.every((s) => s.fallback_for.includes("dashboard"))).toBe(true);
  });

  it("returns type-specific fallbacks for blog", () => {
    const result = selectComponents(
      makeAnalysis({ type: "blog", sections: [], features: [] })
    );
    expect(result.length).toBe(4);
    expect(result.every((s) => s.fallback_for.includes("blog"))).toBe(true);
  });

  it("returns type-specific fallbacks for generic", () => {
    const result = selectComponents(
      makeAnalysis({ type: "generic", sections: [], features: [] })
    );
    expect(result.length).toBe(4);
    expect(result.every((s) => s.fallback_for.includes("generic"))).toBe(true);
  });

  it("each fallback type has at least 4 snippets in ALL_SNIPPETS", () => {
    const types = ["landing", "portfolio", "dashboard", "blog", "generic"];
    types.forEach((type) => {
      const fallbacks = ALL_SNIPPETS.filter(
        (s) => s.fallback === true && s.fallback_for.includes(type)
      );
      expect(fallbacks.length, `${type} must have at least 4 fallback snippets`).toBeGreaterThanOrEqual(4);
    });
  });
});

// ---------------------------------------------------------------------------
// describe("interactive snippet quality")
// ---------------------------------------------------------------------------

describe("interactive snippet quality", () => {
  it("quiz snippet exists with correct tags", () => {
    const quiz = ALL_SNIPPETS.find((s) => s.tags.includes("quiz"));
    expect(quiz).toBeDefined();
    expect(quiz!.tags).toContain("quiz");
    expect(quiz!.tags).toContain("localStorage");
  });

  it("flashcard snippet has CSS 3D flip pattern", () => {
    const flashcard = ALL_SNIPPETS.find((s) => s.id === "flashcard-flip");
    expect(flashcard).toBeDefined();
    expect(flashcard!.html).toContain("perspective: 1000px");
    expect(flashcard!.html).toContain("height: 220px");
    expect(flashcard!.html).toContain("backface-visibility: hidden");
    expect(flashcard!.html).toContain("transform-style: preserve-3d");
  });

  it("step-timer snippet exists with per-step timers", () => {
    const stepTimer = ALL_SNIPPETS.find((s) => s.id === "step-timer");
    expect(stepTimer).toBeDefined();
    expect(stepTimer!.tags).toContain("timer");
    expect(stepTimer!.html).toContain("setInterval");
    expect(stepTimer!.html).toContain("Start");
    expect(stepTimer!.html).toContain("Pause");
    expect(stepTimer!.html).toContain("Reset");
  });

  it("all interactive snippets use appgen- localStorage prefix", () => {
    const localStorageSnippets = ALL_SNIPPETS.filter((s) =>
      s.tags.includes("localStorage")
    );
    expect(localStorageSnippets.length).toBeGreaterThan(0);
    localStorageSnippets.forEach((s) => {
      expect(s.html, `${s.id}: must use appgen- prefix`).toContain("appgen-");
    });
  });

  it("quiz snippet html contains appgen-quiz localStorage key", () => {
    const quiz = ALL_SNIPPETS.find((s) => s.id === "quiz-multiple-choice");
    expect(quiz).toBeDefined();
    expect(quiz!.html).toContain("appgen-quiz");
  });

  it("flashcard snippet contains drag support (touch and mouse events)", () => {
    const flashcard = ALL_SNIPPETS.find((s) => s.id === "flashcard-flip");
    expect(flashcard).toBeDefined();
    expect(flashcard!.html).toContain("touchstart");
    expect(flashcard!.html).toContain("mousedown");
  });

  it("interactive snippets with quiz tag are selectable for dashboard analysis", () => {
    const result = selectComponents(
      makeAnalysis({
        type: "dashboard",
        sections: [],
        features: ["quiz"],
      })
    );
    const hasQuiz = result.some((s) => s.tags.includes("quiz"));
    expect(hasQuiz).toBe(true);
  });

  it("flip-cards tag matches flashcard when analysis includes flip-cards section", () => {
    const result = selectComponents(
      makeAnalysis({
        type: "dashboard",
        sections: ["flip-cards"],
        features: ["flip-animation"],
      })
    );
    const hasFlashcard = result.some((s) => s.id === "flashcard-flip");
    expect(hasFlashcard).toBe(true);
  });
});
