# Phase 9: Component Library - Research

**Researched:** 2026-03-19
**Domain:** Static snippet library + pure tag-match selection algorithm
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**ComponentSnippet Interface**
- Full interface with fields: `id`, `tags`, `html`, `category`, `name`, `description`, `priority`, `domain_hints`, `min_score`, `fallback`, `fallback_for`
- `html` is a **section fragment** (not a full HTML document) — each snippet is a `<section>` or `<div>`, may contain inline `<style>` and `<script>`
- Interactive snippets (Quiz, Flashcard, Step+timer) contain `<script>` inline inside the fragment — no separate JS field

**Tag Matching Strategy**
- `selectComponents(analysis)` matches `snippet.tags[]` against ALL fields of `AnalysisResult`: `sections[]`, `features[]`, and `type`
- Score = number of snippet tags that match the union of all analysis values
- Tie-break: domain_hints match first (snippet with `domain_hints` matching `analysis.type` gets priority boost), then `priority` (lower number = higher priority, e.g., 1 > 2)
- No category coverage enforcement — pure score-based, top 4 by score
- `min_score`: snippet only considered when tag matches >= `min_score`. If fewer than 4 snippets pass threshold, lower threshold to 0 to fill to 4 (never return fewer than 4 unless library has fewer than 4 snippets total)
- `domain_hints`: used to **boost score** on tie-break, NOT for hard-filtering/exclusion

**Fallback Set Design**
- When no snippet matches (score = 0 for all) → fallback **by `analysis.type`**
- Fallback is **marked in snippet data** via `fallback: true` and `fallback_for: string[]`
- `selectComponents()` collects fallbacks from data (no hardcoded map in code)
- Fallback presets by type:
  - `landing` → navbar + hero + features + footer
  - `portfolio` → navbar + hero + cards + footer
  - `dashboard` → topbar + cards + stats + footer
  - `blog` → navbar + hero + article-grid + footer
  - `generic` → navbar + hero + features + footer

**Snippet Distribution (40+ snippets)**
- Cover all 7 categories + domain-specific variants
- **Special focus** on interactive patterns (Quiz, Flashcard, Step+timer are must-have)

**7 base categories:**
- `hero` — centered, split-layout, minimal, dashboard-hero
- `navbar` — simple, with-dropdown, mobile-friendly
- `features` — 3-col cards, icon-list, alternating, comparison
- `cards` — basic card, stat card, profile card, pricing card
- `footer` — simple, multi-column, minimal
- `stats` — stats bar, counter animation, progress bars
- `testimonials` — quote cards, avatar grid, single featured

**Domain-specific variants:**
- Interactive/Dashboard: Quiz, Flashcard, Step+timer, Calculator, Progress tracker
- Blog/Content: Article grid, Timeline, Table of contents, Reading progress bar
- Portfolio/CV: Skills grid, Projects showcase, Career timeline, Contact form
- E-commerce/Product: Pricing table, Feature comparison, Product showcase, CTA banner

**Detailed specs for interactive snippets** (locked in CONTEXT.md decisions section)

**File structure:**
- `src/lib/component-library/index.ts` — exports `selectComponents` + `ComponentSnippet` type
- `src/lib/component-library/snippets/` — data files by category

### Claude's Discretion
- Order of snippets within data files
- Exact count per category (total >= 40)
- Detailed CSS of each snippet (DaisyUI components + Tailwind utilities)
- Variable names and data file structure (array export, named export, etc.)
- Test case structure in Vitest

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PIPE-01 | Component Library has ≥25 HTML/DaisyUI snippets categorized by hero, navbar, features, cards, footer, stats, testimonials | Snippet data files with DaisyUI v4 CDN pattern; CONTEXT.md specifies 40+ snippets across 7 categories + domain variants |
| PIPE-02 | `selectComponents(analysis)` selects at most 4 best-matching snippets via tag matching (no LLM, ~0ms) | Pure TypeScript score algorithm — no async, no LLM, O(n) scan of in-memory array |
| PIPE-03 | Component Library has unit tests for tag-match logic (Vitest) | Vitest already configured; test pattern from `html-prompts.test.ts`; test file in `src/lib/component-library/` |
</phase_requirements>

---

## Summary

Phase 9 builds a static snippet library and a synchronous tag-match selection function. The domain is purely TypeScript data structuring and algorithm design — no network calls, no LLM, no database. The library provides HTML section fragments (DaisyUI v4 + Tailwind CDN patterns) that will be injected as reference context in Phase 10's user message builder.

The core function `selectComponents(analysis: AnalysisResult): ComponentSnippet[]` is a scored linear scan: build a candidate tag set from `analysis.type + analysis.sections + analysis.features`, score each snippet by tag-intersection count, apply domain_hints boost on tie-break, then return top 4. The fallback path reads `snippet.fallback` and `snippet.fallback_for` from data — no hardcoded type→snippet maps in code.

The main implementation risk is HTML snippet quality for interactive patterns. Quiz, Flashcard, and Step+timer are described as "patterns AI gets wrong" — these snippets must be written carefully using the CSS rules from `html-prompts.ts` (flip card pattern with explicit heights, vanilla JS DOM manipulation, `appgen-` localStorage prefix).

**Primary recommendation:** Implement data files first (snippets by category), then the selection algorithm, then Vitest tests. Keep algorithm in `index.ts` simple and data-driven.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | ^5 (project) | Type-safe snippet interface and selection function | Already in project |
| Vitest | ^4.1.0 (project) | Unit tests for tag-match logic | Already configured, `npm run test` runs `vitest run` |

### No New Dependencies
This phase requires zero new npm packages. The snippet library is pure TypeScript data + a synchronous scoring function.

**DaisyUI CDN used inside snippet HTML strings (not installed as npm package):**
```html
<link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.min.css" rel="stylesheet" />
<script src="https://cdn.tailwindcss.com"></script>
```
This pattern is already established in `buildFreshSystemPrompt()` and must be consistent in all snippet HTML fragments.

---

## Architecture Patterns

### Recommended Project Structure
```
src/lib/component-library/
├── index.ts              # ComponentSnippet interface, selectComponents(), all exports
└── snippets/
    ├── hero.ts           # hero category snippets
    ├── navbar.ts         # navbar category snippets
    ├── features.ts       # features category snippets
    ├── cards.ts          # cards + domain-specific card variants
    ├── footer.ts         # footer category snippets
    ├── stats.ts          # stats category snippets
    ├── testimonials.ts   # testimonials category snippets
    ├── interactive.ts    # Quiz, Flashcard, Step+timer, Calculator, Progress tracker
    ├── blog.ts           # Article grid, Timeline, ToC, Reading progress bar
    ├── portfolio.ts      # Skills grid, Projects showcase, Career timeline, Contact form
    └── ecommerce.ts      # Pricing table, Feature comparison, Product showcase, CTA banner
```

### Pattern 1: ComponentSnippet Interface

**What:** Typed record describing one reusable HTML section fragment.
**When to use:** Every entry in every data file must conform to this interface.

```typescript
// src/lib/component-library/index.ts
export interface ComponentSnippet {
  id: string;            // e.g. "hero-centered", "quiz-multiple-choice"
  name: string;          // human label for debugging
  description: string;   // one-line purpose description
  category: string;      // "hero" | "navbar" | "features" | "cards" | "footer" | "stats" | "testimonials" | "interactive" | "blog" | "portfolio" | "ecommerce"
  tags: string[];        // values that match against AnalysisResult fields
  priority: number;      // lower = higher priority in tie-breaks (1 is highest)
  domain_hints: string[];// analysis.type values that boost this snippet in tie-breaks
  min_score: number;     // minimum tags-matched before this snippet is considered
  fallback: boolean;     // true = this snippet is part of a fallback set
  fallback_for: string[];// analysis.type values this snippet serves as fallback for
  html: string;          // section fragment — <section> or <div>, may include <style>/<script>
}
```

### Pattern 2: selectComponents Algorithm

**What:** Synchronous O(n) scan returning top-4 scored snippets, with fallback.
**When to use:** Called with an `AnalysisResult`; returns `ComponentSnippet[]`.

```typescript
// src/lib/component-library/index.ts
import type { AnalysisResult } from "@/lib/ai-pipeline/types";
import { ALL_SNIPPETS } from "./snippets/index"; // barrel re-export of all data files

export function selectComponents(analysis: AnalysisResult): ComponentSnippet[] {
  // 1. Build candidate set from ALL analysis fields
  const candidateTags = new Set<string>([
    analysis.type,
    ...analysis.sections,
    ...analysis.features,
  ]);

  // 2. Score every snippet
  type Scored = { snippet: ComponentSnippet; score: number; domainBoost: boolean };
  const scored: Scored[] = ALL_SNIPPETS.map((s) => {
    const matchCount = s.tags.filter((t) => candidateTags.has(t)).length;
    const domainBoost = s.domain_hints.includes(analysis.type);
    return { snippet: s, score: matchCount, domainBoost };
  });

  // 3. Filter by min_score
  let eligible = scored.filter((s) => s.score >= s.snippet.min_score);

  // 4. If fewer than 4 eligible, lower threshold to 0
  if (eligible.length < 4) {
    eligible = scored.filter((s) => s.score >= 0);
  }

  // 5. Sort: score desc → domain_boost desc → priority asc
  eligible.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.domainBoost !== a.domainBoost) return (b.domainBoost ? 1 : 0) - (a.domainBoost ? 1 : 0);
    return a.snippet.priority - b.snippet.priority;
  });

  // 6. Top 4
  const top4 = eligible.slice(0, 4).map((s) => s.snippet);

  // 7. Fallback: if all scores are 0, use fallback snippets for analysis.type
  const allZero = eligible.every((s) => s.score === 0);
  if (allZero) {
    const fallbacks = ALL_SNIPPETS.filter(
      (s) => s.fallback && s.fallback_for.includes(analysis.type)
    );
    if (fallbacks.length > 0) return fallbacks.slice(0, 4);
    // Last resort: fallback for "generic"
    return ALL_SNIPPETS.filter((s) => s.fallback && s.fallback_for.includes("generic")).slice(0, 4);
  }

  return top4;
}
```

### Pattern 3: Snippet Data File Structure

**What:** Each category file exports an array of `ComponentSnippet` objects.
**When to use:** All 11+ data files follow this same export pattern.

```typescript
// src/lib/component-library/snippets/hero.ts
import type { ComponentSnippet } from "../index";

export const heroSnippets: ComponentSnippet[] = [
  {
    id: "hero-centered",
    name: "Hero — Centered",
    description: "Full-width hero with centered headline, subtext, and CTA button",
    category: "hero",
    tags: ["hero", "landing", "cta", "headline"],
    priority: 1,
    domain_hints: ["landing"],
    min_score: 1,
    fallback: true,
    fallback_for: ["landing", "generic"],
    html: `<section class="hero min-h-[60vh] bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Your Headline Here</h1>
      <p class="py-6">Subtext describing your value proposition in one or two sentences.</p>
      <button class="btn btn-primary">Get Started</button>
    </div>
  </div>
</section>`,
  },
  // ... more hero variants
];
```

### Pattern 4: Barrel Re-export

**What:** Single `snippets/index.ts` that merges all category arrays.
**When to use:** `selectComponents()` imports from this single point, not individual files.

```typescript
// src/lib/component-library/snippets/index.ts
import { heroSnippets } from "./hero";
import { navbarSnippets } from "./navbar";
// ... all imports
export const ALL_SNIPPETS = [
  ...heroSnippets,
  ...navbarSnippets,
  // ...
];
```

### Pattern 5: Interactive Snippet HTML Rules (CRITICAL)

These patterns come directly from `html-prompts.ts` and MUST be followed:

**Flip card CSS (for Flashcard snippet):**
```css
.card { perspective: 1000px; height: 220px; }
.card-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.6s; }
.card-front, .card-back { position: absolute; inset: 0; backface-visibility: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; }
```

**localStorage prefix:** All interactive snippets use `appgen-` prefix for all keys.
```js
localStorage.setItem("appgen-quiz-progress", JSON.stringify(state));
localStorage.setItem("appgen-flashcard-seen", JSON.stringify(seenIds));
```

**JS rules inside snippets:**
- Vanilla JS DOM manipulation (no Alpine.js inside snippets)
- No `alert()`, `confirm()`, `prompt()` — use DaisyUI `<dialog class="modal">` instead
- No Tailwind aspect-ratio utilities (`aspect-w-*`, `aspect-h-*`)
- Never mix Tailwind utility names with CSS property syntax in `<style>` blocks

### Anti-Patterns to Avoid

- **Hardcoded fallback map in code:** Fallback mapping must come from `snippet.fallback_for` data — no `if (type === "landing") return [...]` in `selectComponents()`
- **Returning fewer than 4 snippets:** When library has ≥4 snippets, always return exactly 4
- **Full HTML documents in snippets:** `html` field is a fragment (`<section>` or `<div>`), never `<!DOCTYPE html>`
- **Including CDN links inside snippet HTML:** The snippet fragment does NOT include `<link>` or `<script src>` CDN tags — those are injected at the document level by the generation pipeline
- **Category enforcement in selection:** No round-robin or "one per category" logic — pure score-based top-4

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tag scoring | Custom weighted scoring with floats | Integer count + tie-break fields in data | Simpler, testable, no magic weights |
| Fallback routing | if/switch on `analysis.type` in code | `fallback_for` field in snippet data | Data-driven, extensible without code changes |
| CSS 3D flip card | Custom implementation guessed from memory | Pattern already in `html-prompts.ts` | Known-correct pattern; deviations cause height:0 bug |
| Snippet validation | Runtime schema validation | TypeScript interface + compile-time types | Zero-cost, catches errors at build time |

**Key insight:** The selection algorithm is intentionally trivial (a scored array scan). Complexity lives in snippet data quality, not algorithm sophistication.

---

## Common Pitfalls

### Pitfall 1: Flip Card Height Bug
**What goes wrong:** `.card-front` and `.card-back` render with height 0, cards invisible.
**Why it happens:** Children use `height: 100%` but parent has no fixed height.
**How to avoid:** Always set explicit px height on `.card` wrapper (e.g., `height: 220px`). This is documented in `html-prompts.ts` and MUST be followed in the Flashcard snippet.
**Warning signs:** Flip card snippet appears to render but shows nothing.

### Pitfall 2: CDN Links Inside Fragments
**What goes wrong:** Snippet HTML includes `<link rel="stylesheet" href="...daisyui...">` inside the fragment, causing duplicate CDN loads when multiple snippets are injected.
**Why it happens:** Treating the snippet as a complete document rather than a fragment.
**How to avoid:** Fragment HTML starts directly with `<section>` or `<div>`. CDN setup is the pipeline's responsibility (already in `buildFreshSystemPrompt()`).

### Pitfall 3: Tag Mismatch with Analyzer Output
**What goes wrong:** `selectComponents()` consistently returns score=0, always falls back.
**Why it happens:** Snippet tags use different vocabulary than what `analyzer.ts` emits.
**How to avoid:** Read `analyzer.ts` SYSTEM_PROMPT carefully — tags must match strings the analyzer emits. E.g., analyzer emits `"flip-cards"`, not `"flashcard"`. Verify tag vocabulary matches sections/features examples in analyzer prompt.

**Analyzer vocabulary (from `analyzer.ts` examples):**
- sections: `"navbar"`, `"hero"`, `"flip-cards"`, `"vocab-table"`, `"footer"`, etc.
- features: `"flip-animation"`, `"prev-next-nav"`, `"localStorage"`, `"chart"`, etc.
- type: `"landing"`, `"portfolio"`, `"dashboard"`, `"blog"`, `"generic"`

### Pitfall 4: min_score Set Too High on Fallback Snippets
**What goes wrong:** Fallback snippets (marked `fallback: true`) have `min_score: 2`, but score=0 in the zero-match path, so they never get collected.
**Why it happens:** The fallback collection path runs `snippet.fallback && snippet.fallback_for.includes(type)` — it bypasses scoring entirely. But if min_score filtering runs before fallback detection, fallbacks are excluded.
**How to avoid:** The fallback collection path must bypass the `min_score` filter (collect directly from `ALL_SNIPPETS` by `fallback` flag, not from the `eligible` array).

### Pitfall 5: Snippet Count Below PIPE-01 Minimum
**What goes wrong:** Final snippet count is below 25 (PIPE-01 threshold) or 40 (CONTEXT.md target).
**Why it happens:** Underestimating how many snippets each category needs for meaningful differentiation.
**How to avoid:** Plan snippet count per file before writing. Target distribution below.

---

## Snippet Count Planning

Target: 40+ snippets. Confirmed minimum by PIPE-01: 25. CONTEXT.md target: 40+.

| Category / File | Planned Count | Notes |
|----------------|---------------|-------|
| hero.ts | 4 | centered, split, minimal, dashboard-hero |
| navbar.ts | 3 | simple, with-dropdown, mobile-friendly |
| features.ts | 4 | 3-col cards, icon-list, alternating, comparison |
| cards.ts | 4 | basic, stat, profile, pricing |
| footer.ts | 3 | simple, multi-column, minimal |
| stats.ts | 3 | stats bar, counter, progress bars |
| testimonials.ts | 3 | quote cards, avatar grid, single featured |
| interactive.ts | 5 | Quiz, Flashcard, Step+timer, Calculator, Progress tracker |
| blog.ts | 4 | Article grid, Timeline, ToC, Reading progress |
| portfolio.ts | 4 | Skills grid, Projects showcase, Career timeline, Contact form |
| ecommerce.ts | 4 | Pricing table, Feature comparison, Product showcase, CTA banner |
| **Total** | **41** | Meets 40+ target, well above 25 minimum |

---

## Code Examples

### selectComponents — Test Usage Pattern
```typescript
// src/lib/component-library/component-library.test.ts
import { describe, it, expect } from "vitest";
import { selectComponents } from "./index";
import type { AnalysisResult } from "@/lib/ai-pipeline/types";

describe("selectComponents", () => {
  it("returns at most 4 snippets", () => {
    const analysis: AnalysisResult = {
      type: "landing",
      sections: ["navbar", "hero", "features", "footer"],
      features: [],
      structured_data: "",
    };
    const result = selectComponents(analysis);
    expect(result.length).toBeLessThanOrEqual(4);
  });

  it("never returns empty array when library has >= 4 snippets", () => {
    const analysis: AnalysisResult = {
      type: "generic",
      sections: [],
      features: [],
      structured_data: "",
    };
    const result = selectComponents(analysis);
    expect(result.length).toBeGreaterThan(0);
  });

  it("prefers snippets with matching domain_hints in tie-breaks", () => {
    const analysis: AnalysisResult = {
      type: "dashboard",
      sections: ["stats"],
      features: [],
      structured_data: "",
    };
    const result = selectComponents(analysis);
    const hasDashboardHint = result.some((s) =>
      s.domain_hints.includes("dashboard")
    );
    expect(hasDashboardHint).toBe(true);
  });

  it("uses fallback set when no tags match", () => {
    const analysis: AnalysisResult = {
      type: "landing",
      sections: [],
      features: [],
      structured_data: "",
    };
    const result = selectComponents(analysis);
    expect(result.length).toBe(4);
    result.forEach((s) => {
      expect(s.fallback).toBe(true);
    });
  });
});
```

### Flashcard Snippet Fragment Pattern
```html
<!-- Swipe drag + CSS 3D flip + localStorage — key pattern from html-prompts.ts -->
<section class="p-8 bg-base-200 min-h-screen">
  <style>
    .fc-card { perspective: 1000px; height: 220px; cursor: pointer; }
    .fc-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.6s; }
    .fc-inner.flipped { transform: rotateY(180deg); }
    .fc-front, .fc-back { position: absolute; inset: 0; backface-visibility: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 1rem; }
    .fc-back { transform: rotateY(180deg); }
  </style>
  <div class="max-w-md mx-auto">
    <div id="fc-card" class="fc-card" onclick="flipCard()">
      <div id="fc-inner" class="fc-inner">
        <div class="fc-front bg-base-100 shadow-md p-6">
          <p id="fc-front-text" class="text-xl font-semibold text-center"></p>
        </div>
        <div class="fc-back bg-primary text-primary-content p-6">
          <p id="fc-back-text" class="text-xl text-center"></p>
        </div>
      </div>
    </div>
    <!-- navigation and script omitted for brevity -->
  </div>
</section>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `researcher.ts` — LLM call for CSS/component advice | Static snippet library — ~0ms, no LLM | Phase 9 (this phase) | Eliminates ~8s research LLM step |
| Hardcoded template prompts | Injected snippet HTML references | Phase 10 (next phase) | AI has concrete examples, not abstract instructions |

**Not deprecated in this phase:** `researcher.ts` stays untouched — Phase 11 removes it from the pipeline.

---

## Open Questions

1. **Analyzer tag vocabulary completeness**
   - What we know: `analyzer.ts` SYSTEM_PROMPT lists examples like `"flip-cards"`, `"prev-next-nav"`, `"localStorage"` for features; `"navbar"`, `"hero"` for sections
   - What's unclear: The full exhaustive vocabulary the analyzer can emit — it's open-ended based on prompt content
   - Recommendation: Cover the obvious terms in tags AND add common synonyms (e.g., `"flashcard"` alongside `"flip-cards"`) to maximize match rate

2. **Snippet HTML fragment boundaries**
   - What we know: Snippets are fragments, not full documents; no CDN links inside
   - What's unclear: Whether inline `<style>` blocks inside fragments cause CSS conflicts when multiple snippets are injected into the same AI context window
   - Recommendation: This is not a runtime concern — snippets are text references for AI context, not literally merged into one HTML. No action needed.

3. **Interactive snippet complexity vs. context size**
   - What we know: Quiz, Flashcard, Step+timer with full specs can be 100-200 lines of HTML+JS each
   - What's unclear: Whether including full interactive snippets in AI context (Phase 10) bloats token count
   - Recommendation: Write complete, correct snippets now. Context optimization is Phase 10's concern. Phase 9 only creates data.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.1.0 |
| Config file | `vitest.config.ts` (project root) |
| Quick run command | `npm run test -- component-library` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PIPE-01 | Library exports ≥25 snippets | unit | `npm run test -- component-library` | ❌ Wave 0 |
| PIPE-02 | `selectComponents()` returns ≤4 snippets; no LLM; fallback on zero match | unit | `npm run test -- component-library` | ❌ Wave 0 |
| PIPE-03 | Tag-match logic verified by Vitest | unit | `npm run test -- component-library` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test -- component-library`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/component-library/component-library.test.ts` — covers PIPE-01, PIPE-02, PIPE-03
- [ ] `src/lib/component-library/index.ts` — module under test (must exist before tests run)

*(No additional fixtures needed — Vitest globals are already enabled in `vitest.config.ts`)*

---

## Sources

### Primary (HIGH confidence)
- `src/lib/ai-pipeline/types.ts` — Exact `AnalysisResult` interface (confirmed field names: `type`, `sections`, `features`, `structured_data`)
- `src/lib/ai-pipeline/analyzer.ts` — Confirmed analyzer SYSTEM_PROMPT vocabulary and return shape
- `src/lib/html-prompts.ts` — Confirmed DaisyUI CDN pattern, flip card CSS, localStorage prefix, anti-patterns
- `src/lib/html-prompts.test.ts` — Confirmed Vitest test structure pattern
- `vitest.config.ts` — Confirmed test environment: node, globals: true, `@` alias to `src/`
- `package.json` — Confirmed `npm run test` = `vitest run`, Vitest version ^4.1.0
- `.planning/phases/09-component-library/09-CONTEXT.md` — All implementation decisions

### Secondary (MEDIUM confidence)
- `.planning/REQUIREMENTS.md` — PIPE-01 minimum threshold of 25 snippets
- `.planning/STATE.md` — Phase ordering context and v1.1 architecture decisions

### Tertiary (LOW confidence)
- None — all findings verified from project source files

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, existing Vitest setup confirmed from config files
- Architecture: HIGH — `AnalysisResult` interface read directly from types.ts; algorithm designed from locked CONTEXT.md decisions
- Pitfalls: HIGH — flip card bug documented in html-prompts.ts; CDN/fragment boundary issue derived from established project patterns
- Snippet HTML patterns: HIGH — DaisyUI/Tailwind CDN pattern confirmed from buildFreshSystemPrompt()

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable domain — pure TypeScript data + algorithm, no external dependencies)
