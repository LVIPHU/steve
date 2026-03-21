# Phase 12: Migrate Snippet Library from DaisyUI to Preline UI - Research

**Researched:** 2026-03-21
**Domain:** HTML snippet authoring — Preline UI + Tailwind CDN, DaisyUI removal, dark mode, interactive JS patterns
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Rewrite all 47 existing snippets (DaisyUI → Preline/Tailwind)
- All 11 existing categories expanded: add 2-3 new Preline-specific snippets per category
- 4 new categories added: `forms`, `ui-elements`, `cta`, `media` — each with 8-10 snippets
- Additional categories from Preline docs that fit generated websites — researcher identifies and adds
- Priority order: hero → navbar → features → cards → then the rest
- All snippets support dark mode via Tailwind `dark:` prefix
- Dark mode mechanism: `class="dark"` on `<html>` element
- Dark background palette: `dark:bg-gray-900` (page), `dark:bg-gray-800` (cards), `dark:bg-gray-700` (hover/nested)
- Dark text: `dark:text-white` / `dark:text-gray-300` / `dark:text-gray-400`
- LocalStorage persistence for dark mode preference in generated sites
- Default: light mode on first load
- Existing 6 interactive snippets: rewrite CSS classes only, add Preline `data-hs-*` where applicable, preserve ALL JS functionality
- New interactive snippets: Before/After image slider, Typing animation hero, Multi-step stepper/wizard, Count-up animation on scroll, plus other Preline interactive patterns
- External CDN libraries allowed: Chart.js CDN, GSAP, etc.
- Hero-dashboard chart: Claude decides (Chart.js CDN recommended)
- Preline plugins to use: HSStaticMethods, HSAccordion, HSDropdown, HSOverlay/HSModal
- `buildSystemPrompt()`: full rewrite, delete all DaisyUI references
- CDN setup replacing DaisyUI:
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/preline/dist/preline.js"></script>
  ```
- System prompt language: English
- Preline guidance depth: full — explain `data-hs-*` attributes, `hs-*` state classes, CDN setup, dark mode toggle pattern
- Explicit instruction: "Use Tailwind utility classes for styling, Preline `data-hs-*` for interactive behaviors, `dark:` prefix for dark mode"
- Add accessibility hints: aria-label, role attributes, semantic HTML5 tags
- Colors: always follow DesignResult palette; FALLBACK_DESIGN handles missing DesignResult
- Typography: follow DesignResult font via `buildGoogleFontsImport()` — no hardcoded font in snippets
- Snippets use `font-sans` as default class
- Snippets use placeholder Tailwind colors (blue-600/indigo-600 as primary, gray-900 for text, white for background)
- No semantic token colors (bg-primary, bg-layer, etc.) — these require npm build step, not CDN-compatible
- No HTML comments in snippets — all AI guidance lives in `buildSystemPrompt()` and `buildUserMessage()`
- `component-library.test.ts`: remove DaisyUI class assertions, behavior-level tests unchanged, no new Preline class assertions
- Build pass + typecheck must pass after migration

### Claude's Discretion

- Exact choice of chart library for hero-dashboard (Chart.js recommended)
- Which specific Preline patterns to use for accordion/modal/tabs within snippets
- Exact count of snippets per category (target 8-10 for new, 2-3 expansion for old)
- Which additional categories from Preline docs to add (beyond the 4 specified)
- Dark mode toggle button exact implementation in navbar snippets

### Deferred Ideas (OUT OF SCOPE)

- Export as ZIP feature
- Preline skill/plugin for Claude agents
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SNIP-01 | All current snippet HTML rewritten from DaisyUI to Tailwind utilities + Preline data-hs-* patterns | DaisyUI class audit documented; Preline CDN-compatible patterns catalogued below |
| SNIP-02 | 11 existing categories expanded with 2-3 new snippets each | Preline component inventory maps directly to expansion opportunities per category |
| SNIP-03 | 6 new categories (forms, ui-elements, cta, media, pricing, notifications) with 6-9 snippets each | Preline's full component library covers all 6 categories; patterns documented |
| SNIP-04 | `buildSystemPrompt()` rewritten with Tailwind CDN + Preline JS CDN, zero DaisyUI references | Current prompt structure audited; new structure specified |
| SNIP-05 | All snippets support dark mode via Tailwind `dark:` prefix | Dark mode strategy documented: plain Tailwind dark: with class="dark" toggle |
| SNIP-06 | Zero DaisyUI class names remaining in snippet library | Full audit of DaisyUI class patterns to eliminate listed |
| SNIP-07 | ALL_SNIPPETS contains 100+ snippets across 17 categories | Snippet math validated: 47 rewrites + 22-33 expansions + 36-54 new = 105-134 total |
| SNIP-08 | Tests updated (threshold 100+, DaisyUI remnant detector) and pass clean | Existing test structure fully audited; required changes specified |
</phase_requirements>

---

## Summary

Phase 12 is a bulk content migration phase — rewriting 47 existing HTML snippets from DaisyUI to pure Tailwind utilities + Preline `data-hs-*` patterns, then massively expanding the library from 47 to 100+ snippets across 17 categories. The technical challenge is not architectural: the `ComponentSnippet` type, `selectComponents()` logic, and test infrastructure all stay unchanged. The challenge is volume and correctness — every snippet must use CDN-compatible Tailwind (no semantic tokens from Preline's npm-only theming system), include dark mode via `dark:` prefix, and be syntactically clean HTML.

The critical constraint is CDN compatibility. Preline's `bg-primary`, `text-foreground`, `bg-card`, `border-layer-line`, etc. semantic tokens require `variants.css` from npm — they do NOT work with Tailwind CDN. Snippets must use raw Tailwind palette classes (`bg-white`, `bg-gray-900`, `text-gray-700`, etc.) for all color decisions, while Preline's `data-hs-*` attributes work fine via the CDN preline.js script. Similarly, `hs-*` state variant classes (`hs-accordion-active:`, `hs-collapse-open:`) require `variants.css` and must NOT be used in snippets.

The `buildSystemPrompt()` rewrite is substantial — the entire DaisyUI guidance section (component class list, Alpine.js rules, anti-patterns) must be replaced with Preline guidance, dark mode toggle pattern, and updated CDN setup.

**Primary recommendation:** Author snippets in two passes: (1) rewrite 11 existing categories using CDN-safe Tailwind + Preline data-hs-* patterns, (2) write 6 new categories from scratch. Keep all snippets free of semantic Preline tokens and `hs-*` variant classes. Dark mode via `dark:` prefix only. Interactive snippets preserve vanilla JS, replacing only class names.

---

## Standard Stack

### Core (for generated website output — CDN delivery)

| Library | Version | Purpose | CDN URL |
|---------|---------|---------|---------|
| Tailwind CSS | Latest CDN | Utility-first CSS for all layout and style | `https://cdn.tailwindcss.com` |
| Preline JS | Latest via jsdelivr | `data-hs-*` interactive behaviors (accordion, modal, dropdown, tabs, stepper, collapse) | `https://cdn.jsdelivr.net/npm/preline/dist/preline.js` |

### Optional (for specific interactive snippets)

| Library | Version | Purpose | CDN URL |
|---------|---------|---------|---------|
| Chart.js | 4.x | Charts in hero-dashboard snippet | `https://cdn.jsdelivr.net/npm/chart.js` |
| GSAP | 3.x | Count-up animation on scroll | `https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js` |
| GSAP ScrollTrigger | 3.x | Scroll-triggered count-up | `https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js` |

### NOT available via CDN (do not use in snippets)

| Token Group | Examples | Reason |
|-------------|----------|--------|
| Preline semantic tokens | `bg-primary`, `text-foreground`, `bg-card`, `border-layer-line`, `bg-layer`, `text-muted-foreground-1` | Require `variants.css` + npm build step |
| Preline `hs-*` state variant classes | `hs-accordion-active:text-blue-600`, `hs-collapse-open:rotate-180` | Require `variants.css` from npm |

**Installation note:** No npm install required for generated websites — snippets are pure HTML delivered via CDN links injected by `buildSystemPrompt()`.

---

## Architecture Patterns

### Existing File Structure (unchanged except snippets/ additions)

```
src/lib/component-library/
├── types.ts                    # ComponentSnippet interface — NO CHANGES
├── index.ts                    # selectComponents() — NO CHANGES
├── component-library.test.ts   # 57 tests — MINIMAL CHANGES (threshold + new DaisyUI detector)
└── snippets/
    ├── index.ts                # ALL_SNIPPETS array — add 6 new imports
    ├── hero.ts                 # 4 snippets → rewrite + expand to 6-7
    ├── navbar.ts               # 3 snippets → rewrite + expand to 5-6
    ├── features.ts             # 4 snippets → rewrite + expand to 6-7
    ├── cards.ts                # 4 snippets → rewrite + expand to 6-7
    ├── footer.ts               # 3 snippets → rewrite + expand to 5-6
    ├── stats.ts                # 3 snippets → rewrite + expand to 5-6
    ├── testimonials.ts         # 3 snippets → rewrite + expand to 5-6
    ├── interactive.ts          # 5 snippets → rewrite + expand to 8-9
    ├── blog.ts                 # 4 snippets → rewrite + expand to 6-7
    ├── portfolio.ts            # 4 snippets → rewrite + expand to 6-7
    ├── ecommerce.ts            # 4 snippets → rewrite + expand to 6-7
    ├── forms.ts                # NEW — 8-10 snippets
    ├── ui-elements.ts          # NEW — 8-10 snippets
    ├── cta.ts                  # NEW — 8-10 snippets
    ├── media.ts                # NEW — 8-10 snippets
    ├── pricing.ts              # NEW — 6-9 snippets
    └── notifications.ts        # NEW — 6-9 snippets
```

### Snippet Count Math

| Group | Current | After Rewrite + Expand |
|-------|---------|------------------------|
| 11 existing categories (2-3 new each) | 47 | ~69-80 |
| forms (new) | 0 | 8-10 |
| ui-elements (new) | 0 | 8-10 |
| cta (new) | 0 | 8-10 |
| media (new) | 0 | 8-10 |
| pricing (new) | 0 | 6-9 |
| notifications (new) | 0 | 6-9 |
| **Total** | **47** | **~113-138** |

Target of 100+ is achieved with minimal per-category expansion (2 new per existing, 7 per new category).

### Pattern 1: CDN-Compatible Tailwind Snippet (base pattern for all snippets)

**What:** Pure Tailwind utility classes for all styling — raw palette colors, layout, typography. No DaisyUI, no Preline semantic tokens.
**When to use:** Universal — every snippet follows this base pattern.

```html
<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto text-center">
    <span class="inline-flex items-center py-1 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 mb-4">
      New Feature
    </span>
    <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-6">
      Welcome to Your Site
    </h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
      Build something amazing.
    </p>
    <div class="flex gap-4 justify-center flex-wrap">
      <a href="#" class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-colors">
        Get Started
      </a>
      <a href="#" class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
        Learn More
      </a>
    </div>
  </div>
</section>
```

### Pattern 2: Preline data-hs-* Interactive Behaviors (CDN-safe)

**What:** Preline JS behaviors via `data-hs-*` attributes. The CDN preline.js handles all state — adds/removes `hidden` class, manages `transition-[height]` for accordions. CSS states use JavaScript-driven class changes; `hs-*` variant classes are NOT used.
**When to use:** Accordion, dropdown, modal, tabs, stepper, collapse, dismiss.

**Collapse (mobile nav, FAQ):**
```html
<button type="button"
  class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
  aria-expanded="false" aria-controls="hs-collapse-content"
  data-hs-collapse="#hs-collapse-content">
  Toggle
</button>
<div id="hs-collapse-content" class="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300">
  <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <p class="text-gray-700 dark:text-gray-300">Expandable content.</p>
  </div>
</div>
```

**Dropdown:**
```html
<div class="hs-dropdown relative inline-flex">
  <button type="button"
    class="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
    aria-haspopup="menu" aria-expanded="false">
    Actions
    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
  </button>
  <div class="hs-dropdown-menu transition-[opacity,margin] duration-200 opacity-0 hidden min-w-48 bg-white border border-gray-200 shadow-lg rounded-lg mt-2 p-1 dark:bg-gray-800 dark:border-gray-700"
    role="menu" aria-orientation="vertical">
    <a class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" href="#">Item 1</a>
    <a class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" href="#">Item 2</a>
  </div>
</div>
```

**Modal:**
```html
<button type="button" data-hs-overlay="#hs-modal"
  class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700">
  Open Modal
</button>
<div id="hs-modal" class="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none"
  role="dialog" tabindex="-1">
  <div class="hs-overlay-animation-target scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-lg sm:w-full m-3 sm:mx-auto pointer-events-auto">
    <div class="flex flex-col bg-white border border-gray-200 shadow-xl rounded-xl dark:bg-gray-800 dark:border-gray-700">
      <div class="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-bold text-gray-900 dark:text-white">Modal title</h3>
        <button type="button" class="size-8 inline-flex justify-center items-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" data-hs-overlay="#hs-modal" aria-label="Close">
          <svg class="shrink-0 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="p-4"><p class="text-gray-600 dark:text-gray-400">Modal body content.</p></div>
      <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" class="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" data-hs-overlay="#hs-modal">Close</button>
        <button type="button" class="py-2 px-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
      </div>
    </div>
  </div>
</div>
```

**Accordion:**
```html
<div class="hs-accordion-group space-y-2">
  <div class="hs-accordion active bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700" id="hs-acc-1">
    <button class="hs-accordion-toggle py-4 px-5 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 focus:outline-none"
      aria-expanded="true" aria-controls="hs-acc-collapse-1">
      Accordion Item 1
      <svg class="shrink-0 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div id="hs-acc-collapse-1" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" role="region">
      <div class="pb-4 px-5"><p class="text-gray-600 dark:text-gray-400">Content for item 1.</p></div>
    </div>
  </div>
</div>
```

**Tabs:**
```html
<div class="border-b border-gray-200 dark:border-gray-700">
  <nav class="-mb-px flex gap-x-6" role="tablist">
    <button type="button"
      class="py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-blue-600 text-sm font-medium text-blue-600 dark:border-blue-500 dark:text-blue-400"
      id="tab-item-1" aria-selected="true" data-hs-tab="#tab-panel-1" role="tab">Tab 1</button>
    <button type="button"
      class="py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      id="tab-item-2" aria-selected="false" data-hs-tab="#tab-panel-2" role="tab">Tab 2</button>
  </nav>
</div>
<div class="mt-4">
  <div id="tab-panel-1" role="tabpanel"><p class="text-gray-600 dark:text-gray-400">Content 1.</p></div>
  <div id="tab-panel-2" class="hidden" role="tabpanel"><p class="text-gray-600 dark:text-gray-400">Content 2.</p></div>
</div>
```

### Pattern 3: Dark Mode Toggle with localStorage

**What:** Anti-flash script in `<head>` + toggle button in navbar. Uses `hs_theme` localStorage key (Preline standard, avoids conflict with app `appgen-` prefix).
**When to use:** All navbar snippets that include a dark mode toggle.

```html
<!-- Anti-flash script — goes in <head>, included in buildSystemPrompt() instructions -->
<script>
  (function() {
    var t = localStorage.getItem('hs_theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>

<!-- Toggle button in navbar -->
<button id="theme-toggle" type="button"
  class="size-9 flex justify-center items-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
  aria-label="Toggle dark mode">
  <svg class="hidden dark:block shrink-0 size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
  </svg>
  <svg class="block dark:hidden shrink-0 size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>
<script>
  (function() {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function() {
        var isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('hs_theme', isDark ? 'dark' : 'light');
      });
    }
  })();
</script>
```

### Pattern 4: DaisyUI Class Replacement Table

For the rewrite of existing snippets, replace DaisyUI classes with these Tailwind equivalents:

| DaisyUI | Tailwind CDN equivalent |
|---------|------------------------|
| `card bg-base-100 shadow-lg` | `bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700` |
| `card-body` | `p-6` |
| `card-title` | `text-xl font-bold text-gray-900 dark:text-white` |
| `card-actions justify-end` | `flex justify-end mt-4` |
| `btn btn-primary` | `py-2.5 px-5 inline-flex items-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors` |
| `btn btn-secondary` | `py-2.5 px-5 inline-flex items-center text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors` |
| `btn btn-outline` | `py-2.5 px-5 inline-flex items-center text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700` |
| `btn btn-ghost` | `py-2.5 px-5 inline-flex items-center text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700` |
| `btn btn-ghost btn-sm` | `py-1.5 px-3 inline-flex items-center text-xs font-medium rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700` |
| `btn btn-primary btn-sm` | `py-1.5 px-3 inline-flex items-center text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700` |
| `btn btn-circle btn-outline btn-sm` | `size-8 inline-flex justify-center items-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700` |
| `badge badge-primary` | `inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400` |
| `badge badge-outline` | `inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400` |
| `badge badge-secondary` | `inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400` |
| `badge badge-accent` | `inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-400` |
| `bg-base-100` | `bg-white dark:bg-gray-800` |
| `bg-base-200` | `bg-gray-100 dark:bg-gray-900` |
| `bg-base-300` | `bg-gray-200 dark:bg-gray-700` |
| `text-base-content` | `text-gray-900 dark:text-white` |
| `text-base-content/60` | `text-gray-500 dark:text-gray-400` |
| `text-base-content/40` | `text-gray-400 dark:text-gray-500` |
| `text-primary` | `text-blue-600 dark:text-blue-400` |
| `text-secondary` | `text-indigo-600 dark:text-indigo-400` |
| `text-accent` | `text-violet-600 dark:text-violet-400` |
| `text-success` | `text-teal-600 dark:text-teal-400` |
| `text-error` | `text-red-600 dark:text-red-400` |
| `progress progress-primary w-full` | `<div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-blue-600 rounded-full transition-all duration-300"></div></div>` |
| `checkbox checkbox-primary` | `size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700` |
| `stat bg-base-100 rounded-box p-4` | `bg-white border border-gray-200 rounded-xl p-4 dark:bg-gray-800 dark:border-gray-700` |
| `stat-title` | `text-sm text-gray-500 dark:text-gray-400` |
| `stat-value` | `text-2xl font-bold text-gray-900 dark:text-white mt-1` |
| `stat-desc` | `text-xs text-gray-400 dark:text-gray-500 mt-1` |
| `footer footer-center p-10 bg-base-200` | `bg-gray-100 dark:bg-gray-900 py-10 px-6` |
| `link link-hover` | `text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-gray-200` |

**JS class names inside `<script>` tags** (quiz feedback, timer states):

| DaisyUI JS class | Tailwind JS class replacement |
|-----------------|-------------------------------|
| `btn-success` | `bg-teal-100 border-teal-300 text-teal-800 dark:bg-teal-500/20 dark:border-teal-900 dark:text-teal-300` |
| `btn-error` | `bg-red-100 border-red-300 text-red-800 dark:bg-red-500/20 dark:border-red-900 dark:text-red-300` |

### Pattern 5: Chart.js in hero-dashboard

```html
<!-- Chart.js CDN — only included in the hero-dashboard snippet -->
<!-- Note: CDN link goes in the snippet HTML since it's a specific component need -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

The test `"no snippet html contains CDN links"` checks for `cdn.jsdelivr.net` and `cdn.tailwindcss.com`. The Tailwind and Preline CDN links must NOT appear in snippet HTML. However, Chart.js CDN is a specific dependency for the chart snippet — the test currently only blocks `cdn.jsdelivr.net`. This means Chart.js CDN in snippets will fail the existing CDN test.

**Resolution options:**
1. Move Chart.js CDN to `buildSystemPrompt()` as an always-included CDN (simplest)
2. Update the test to allow `chart.js` specifically
3. Use inline Chart.js equivalent with SVG (avoids CDN dependency)

**Recommendation:** Option 1 — add Chart.js CDN to `buildSystemPrompt()` alongside Tailwind and Preline. This way the snippet HTML only has `<canvas id="...">` and the init script, no CDN link. The test stays unmodified.

### Pattern 6: Stepper (data-hs-stepper)

```html
<!-- Source: PRELINE-UI.md section 5.20 -->
<div data-hs-stepper>
  <ul class="relative flex flex-row gap-x-2 mb-8">
    <li class="flex items-center gap-x-2 shrink basis-0 flex-1 group" data-hs-stepper-nav-item='{"index": 1}'>
      <div class="min-w-7 min-h-7 inline-flex justify-center items-center text-xs">
        <span class="size-7 flex justify-center items-center shrink-0 bg-gray-100 text-gray-700 font-medium rounded-full dark:bg-gray-700 dark:text-gray-300">1</span>
        <span class="ms-2 text-sm font-medium text-gray-700 dark:text-gray-300">Details</span>
      </div>
      <div class="w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-gray-700"></div>
    </li>
    <li class="flex items-center gap-x-2 shrink basis-0 flex-1 group" data-hs-stepper-nav-item='{"index": 2}'>
      <div class="min-w-7 min-h-7 inline-flex justify-center items-center text-xs">
        <span class="size-7 flex justify-center items-center shrink-0 bg-gray-100 text-gray-700 font-medium rounded-full dark:bg-gray-700 dark:text-gray-300">2</span>
        <span class="ms-2 text-sm font-medium text-gray-700 dark:text-gray-300">Review</span>
      </div>
      <div class="w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-gray-700"></div>
    </li>
    <li class="flex items-center gap-x-2 shrink basis-0 flex-1 group" data-hs-stepper-nav-item='{"index": 3}'>
      <div class="min-w-7 min-h-7 inline-flex justify-center items-center text-xs">
        <span class="size-7 flex justify-center items-center shrink-0 bg-gray-100 text-gray-700 font-medium rounded-full dark:bg-gray-700 dark:text-gray-300">3</span>
        <span class="ms-2 text-sm font-medium text-gray-700 dark:text-gray-300">Confirm</span>
      </div>
    </li>
  </ul>
  <div class="mt-5">
    <div data-hs-stepper-content-item='{"index": 1}'>
      <div class="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700">
        <p class="text-gray-700 dark:text-gray-300">Step 1 content.</p>
      </div>
    </div>
    <div class="hidden" data-hs-stepper-content-item='{"index": 2}'>
      <div class="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700">
        <p class="text-gray-700 dark:text-gray-300">Step 2 content.</p>
      </div>
    </div>
    <div class="hidden" data-hs-stepper-content-item='{"isFinal": true}'>
      <div class="p-6 text-center">
        <p class="text-lg font-semibold text-gray-900 dark:text-white">All done!</p>
      </div>
    </div>
  </div>
  <div class="mt-5 flex justify-between items-center gap-x-2">
    <button type="button"
      class="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
      data-hs-stepper-back-btn>Back</button>
    <button type="button"
      class="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      data-hs-stepper-next-btn>Next</button>
    <button type="button"
      class="hidden py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700"
      data-hs-stepper-finish-btn>Finish</button>
  </div>
</div>
```

### Anti-Patterns to Avoid

- **Preline semantic tokens in snippets:** `bg-primary`, `text-foreground`, `bg-card`, `border-layer-line`, `bg-layer` — npm-only, no effect via CDN
- **`hs-*` state variant classes:** `hs-accordion-active:text-blue-600`, `hs-collapse-open:rotate-180` — require `variants.css`, not CDN-compatible
- **DaisyUI classes remaining:** `btn`, `card`, `navbar`, `hero`, `badge`, `modal`, `stats`, `footer`, `menu`, `badge-primary`, `bg-base-100` — must all be eliminated
- **Hardcoding Google Fonts CDN links in snippets** — `buildGoogleFontsImport()` already injects the font
- **CDN links in snippet HTML** — tests check for `cdn.jsdelivr.net` and `cdn.tailwindcss.com`; CDN links belong in `buildSystemPrompt()` only (exception: if Chart.js CDN is moved to system prompt, no CDN links in any snippet)
- **DOCTYPE in snippet HTML** — tests explicitly check
- **DaisyUI `<dialog class="modal">` + `dialog.showModal()` pattern** — replace with Preline `data-hs-overlay`
- **Alpine.js** — system prompt should not reference it; Preline handles all show/hide needs

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mobile nav toggle | Custom hamburger JS | Preline `data-hs-collapse` | Handles aria-expanded automatically |
| Dropdown menus | Custom positioning JS | Preline `hs-dropdown` | Handles viewport overflow, keyboard navigation |
| Modal/dialog | Custom backdrop and focus trap | Preline `data-hs-overlay` | Focus trap, scroll lock, keyboard dismiss built in |
| Accordion expand/collapse | Custom height animation | Preline `hs-accordion-group` | `transition-[height]` pattern handles unknown content heights |
| Tab panel switching | Custom active-class JS | Preline `data-hs-tab` | Handles ARIA tabpanel pattern and keyboard arrows |
| Multi-step wizard | Custom stepper state machine | Preline `data-hs-stepper` | Back/Next/Finish state + aria fully managed |
| Dismiss alerts/toasts | Custom removeEventListener | Preline `data-hs-remove-element` | One attribute, handles element removal |
| Dark mode toggle | Custom CSS variable swap | Tailwind `dark:` + `class="dark"` on html | Standard pattern, `hs_theme` localStorage key |
| Charts | Custom SVG charts | Chart.js CDN | Canvas rendering, responsive, tooltips built in |
| Count-up on scroll | Custom IntersectionObserver + RAF | GSAP + ScrollTrigger | Easing, replay, and cross-browser handling |

**Key insight:** Preline JS (CDN) handles all interactive state management declaratively via `data-hs-*`. Vanilla JS in snippets should be limited to: dark mode toggle, custom application logic in quiz/flashcard/timer/calculator/progress-tracker, and Chart.js canvas initialization.

---

## Category Expansion Plan

### Existing 11 Categories — Rewrite + Expand

| Category | Current | Target | Preline-specific additions |
|----------|---------|--------|---------------------------|
| hero | 4 | 6-7 | Hero with Preline carousel slideshow, hero with animated badge |
| navbar | 3 | 5-6 | Navbar with Preline dropdown menus, navbar with dark mode toggle |
| features | 4 | 6-7 | Features with Preline tabs (category filter), features accordion FAQ |
| cards | 4 | 6-7 | Card with Preline collapse (expandable), horizontal card with badge dismiss |
| footer | 3 | 5-6 | Footer with newsletter form, mega footer with columns |
| stats | 3 | 5-6 | Stats with progress bars, stats with Chart.js sparklines |
| testimonials | 3 | 5-6 | Testimonials with Preline carousel, testimonials with avatar group |
| interactive | 5 | 8-9 | Multi-step stepper wizard, count-up on scroll, typing animation hero |
| blog | 4 | 6-7 | Blog with Preline tabs (category filter), blog with accordion TOC |
| portfolio | 4 | 6-7 | Portfolio with Preline tabs (filter by type), portfolio modal lightbox |
| ecommerce | 4 | 6-7 | Product card with badge + dismiss, cart summary with quantity stepper |

### 6 New Categories

**forms (8-10 snippets)**
- Contact form (basic fields)
- Newsletter signup form
- Multi-step registration form (Preline stepper)
- Login/auth form
- Feedback/rating form with star input
- Subscribe with inline email validation hint
- File upload zone (drag-and-drop styled)
- Search form with icon and filter dropdown

**ui-elements (8-10 snippets)**
- Alert banners (success/warning/error/info) with Preline dismiss
- Badge collection showcase
- Breadcrumb navigation
- Pagination bar
- Progress indicators (linear + step variants)
- Spinner and loading states
- Switch/toggle collection
- Tooltip examples (Preline data-hs-tooltip)

**cta (8-10 snippets)**
- CTA banner centered (gradient background)
- CTA with email input inline
- CTA with app store badges
- CTA with social proof numbers
- CTA with countdown timer
- Sticky CTA bar (fixed bottom)
- CTA with background image overlay
- CTA split (text left, form right)

**media (8-10 snippets)**
- Image grid (responsive masonry-like)
- Image with caption card
- Before/After image slider (vanilla JS range input)
- Video embed placeholder
- Gallery lightbox (Preline modal)
- Image carousel (Preline data-hs-carousel)
- Audio player (styled HTML5 audio element)
- Map placeholder with overlay CTA

**pricing (6-9 snippets)**
- Three-tier pricing table
- Pricing with monthly/annual toggle (vanilla JS)
- Single highlighted plan card
- Pricing comparison table (features matrix)
- Pricing with FAQ accordion (Preline)
- Enterprise contact CTA pricing
- Freemium vs Pro two-column

**notifications (6-9 snippets)**
- Toast notification (top-right corner, Preline dismiss)
- Alert strip (dismissible, color variants)
- Notification dropdown (Preline dropdown)
- Cookie consent banner
- Announcement bar (top of page)
- In-app notification feed list
- Empty state placeholder

---

## buildSystemPrompt() Rewrite Specification

### Current state (DELETE entirely)

The current function in `src/lib/html-prompts.ts` references:
- DaisyUI CDN: `cdn.jsdelivr.net/npm/daisyui@4`
- DaisyUI component classes: `navbar bg-base-100`, `hero min-h-[60vh]`, `card bg-base-100`, `btn btn-primary`, etc.
- Alpine.js CDN and x-for prohibition
- DaisyUI modal: `<dialog class="modal">` + `dialog.showModal()`
- DaisyUI anti-patterns

### New function contract

- Zero parameters (invariant preserved for OpenAI prompt caching)
- Language: English
- CDN block: Tailwind CDN + Preline CDN (+ Chart.js CDN added here to avoid snippet CDN test failure)
- Dark mode: anti-flash script, `hs_theme` localStorage key, `class="dark"` on html
- Preline patterns: collapse, dropdown, modal, accordion, tabs — brief code examples
- Accessibility: semantic HTML5, aria attributes, keyboard navigation
- localStorage: `appgen-` prefix for all app keys, `hs_theme` exception
- Color system: placeholder blue-600 replaced with DesignResult palette
- Anti-patterns: explicit DaisyUI prohibition, Preline semantic token prohibition, `hs-*` variant class prohibition

---

## Common Pitfalls

### Pitfall 1: Using Preline semantic color tokens in CDN snippets

**What goes wrong:** Writing `class="bg-primary text-foreground"` — renders with no visual effect because Preline's CSS custom property definitions are in `variants.css` (npm package only).
**Why it happens:** PRELINE-UI.md documents semantic tokens as the standard npm experience. CDN delivery is a subset.
**How to avoid:** Use only raw Tailwind palette classes: `bg-blue-600`, `text-gray-900`, `bg-white`. No `bg-primary`, `text-foreground`, `bg-card`, `bg-layer`, `border-layer-line`.
**Warning signs:** Class names containing `bg-primary`, `text-muted-foreground`, `bg-surface`, `bg-card`, `border-layer-line`, `bg-navbar`.

### Pitfall 2: Using hs-* variant state classes

**What goes wrong:** Writing `hs-accordion-active:text-blue-600` or `hs-collapse-open:rotate-180` — Tailwind CDN does not generate CSS for these variants.
**Why it happens:** PRELINE-UI.md examples assume `variants.css` is loaded from npm.
**How to avoid:** Do not use any `hs-*:` variant prefix in class strings. Preline's core show/hide behaviors (accordion height, dropdown visibility, modal overlay) work via built-in class toggling in preline.js, no variant CSS needed.
**Warning signs:** Class strings containing `hs-accordion-active:`, `hs-collapse-open:`, `hs-dropdown-open:`, `hs-tab-active:`, `hs-overlay-open:`, `hs-stepper-active:`, `hs-stepper-completed:`.

### Pitfall 3: DaisyUI class names surviving in JS strings inside interactive snippets

**What goes wrong:** The JS in quiz/flashcard/timer snippets has DaisyUI class names baked in — e.g., feedback buttons set class `btn-success` or `btn-error`.
**Why it happens:** Interactive snippet JS logic manipulates class strings directly.
**How to avoid:** Audit all `<script>` blocks in interactive snippets for DaisyUI class references. Replace: `btn-success` → `bg-teal-100 border-teal-300 text-teal-800`, `btn-error` → `bg-red-100 border-red-300 text-red-800`.
**Warning signs:** Strings in `<script>` blocks containing `btn-`, `badge-`, `text-success`, `text-error`, `bg-base-`, `card-`, `progress-`.

### Pitfall 4: CDN links appearing in snippet HTML

**What goes wrong:** Adding `<script src="https://cdn.jsdelivr.net/npm/chart.js">` directly inside a snippet's HTML — the test `"no snippet html contains CDN links"` will fail because it checks for `cdn.jsdelivr.net`.
**Why it happens:** Chart.js is needed per-snippet but the CDN belongs in the system prompt.
**How to avoid:** Move Chart.js CDN to `buildSystemPrompt()` as a universally included CDN. Snippets only contain `<canvas id="...">` and Chart.js initialization script.
**Warning signs:** Test failure `"html must not contain cdn.jsdelivr.net"` for any snippet.

### Pitfall 5: Test regression — count threshold not updated

**What goes wrong:** Test `"library has at least 40 snippets"` passes but `"library has at least 100 snippets"` doesn't exist yet — SNIP-07 requirement is silently unverified.
**Why it happens:** The threshold was written for the original 47-snippet library.
**How to avoid:** Change `toBeGreaterThanOrEqual(40)` to `toBeGreaterThanOrEqual(100)` in the test file in Wave 0, before any snippet work.
**Warning signs:** Forgetting this step means no automated check that the 100-snippet goal was reached.

### Pitfall 6: Fallback coverage gaps during rewrite

**What goes wrong:** Rewriting existing snippets accidentally changes `fallback: true` → `false` or clears `fallback_for` values, causing test `"each fallback type has at least 4 snippets"` to fail.
**Why it happens:** Copy-paste errors during class replacement work.
**How to avoid:** Preserve all `fallback`, `fallback_for`, `id`, `name`, `description`, `category`, `tags`, `priority`, `domain_hints`, `min_score` fields verbatim during class rewrites. Only modify the `html` field.
**Warning signs:** Test `"returns type-specific fallbacks for landing"` or similar failing.

### Pitfall 7: Duplicate snippet IDs across 17 files

**What goes wrong:** Two snippets share an ID — test `"all snippet ids are unique"` fails.
**Why it happens:** Large volume of new snippets written across 6 new files.
**How to avoid:** Use strict category-prefixed naming: `forms-contact`, `forms-newsletter`, `ui-elements-alerts`, `cta-banner-centered`, `media-image-grid`, `pricing-three-tier`, `notifications-toast`.
**Warning signs:** Test `"all snippet ids are unique"` failing.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| DaisyUI component classes (`btn`, `card`, `navbar`) | Raw Tailwind utilities + Preline `data-hs-*` | No semantic class magic; all styling explicit and predictable |
| DaisyUI `<dialog class="modal">` + JS `showModal()` | Preline `data-hs-overlay` + declarative trigger | More accessible, no JS required for open/close |
| Alpine.js for show/hide | Preline `data-hs-collapse` | One less CDN dependency; better ARIA handling |
| DaisyUI `stats` component | Manual Tailwind stat cards | More layout flexibility, easier dark mode |
| DaisyUI auto-theme colors (`badge-primary`) | Explicit palette (`bg-blue-100 text-blue-800 dark:bg-blue-500/20`) | Verbose but predictable, CDN-compatible |

**Deprecated/outdated in new system:**
- `btn`, `card-body`, `navbar-start`, `hero-content`, `badge-primary`: DaisyUI components — not available outside DaisyUI
- `bg-base-100`, `bg-base-200`, `text-base-content`: DaisyUI CSS variables — undefined without DaisyUI
- Alpine.js `x-data`, `x-show`, `x-on:click`: replaced by Preline `data-hs-*` for UI behaviors, vanilla JS for application logic

---

## Open Questions

1. **Preline CDN version pinning**
   - What we know: `https://cdn.jsdelivr.net/npm/preline/dist/preline.js` resolves to latest
   - What's unclear: Whether to pin to a specific version for stability in generated sites
   - Recommendation: Use unpinned during development; consider pinning after confirming behaviors work. If a specific version is needed, use e.g. `preline@2.7.0/dist/preline.js`.

2. **hs-* state variant classes on Tailwind CDN — actual behavior**
   - What we know: PRELINE-UI.md section 8 explicitly states `variants.css` from npm is required for `hs-*` variants
   - What's unclear: Whether Tailwind CDN's JIT can process these if no `variants.css` is loaded
   - Recommendation: Treat `hs-*` variant classes as npm-only. Do not use them in snippets. This is the confirmed safe approach from PRELINE-UI.md conventions.

3. **Chart.js CDN placement — snippet vs system prompt**
   - What we know: Existing test blocks `cdn.jsdelivr.net` in snippet HTML
   - Recommendation: Move Chart.js CDN to `buildSystemPrompt()` as an always-included script tag. No test changes needed.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest |
| Config file | `package.json` (scripts.test) |
| Quick run command | `npm run test -- component-library` |
| Full suite command | `npm run test && npm run typecheck` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SNIP-01 | All snippets use Tailwind/Preline, no DaisyUI classes | unit (new DaisyUI detector) | `npm run test -- component-library` | ❌ Wave 0 |
| SNIP-02 | 11 existing categories each expanded | unit (implicit in SNIP-07 count) | `npm run test -- component-library` | ✅ |
| SNIP-03 | 6 new category files export and are imported | unit (implicit in SNIP-07 count) | `npm run test -- component-library` | ✅ |
| SNIP-04 | buildSystemPrompt() contains no DaisyUI references | unit (new assertion) | `npm run test -- html-prompts` | ❌ Wave 0 |
| SNIP-05 | Majority of snippets include dark: prefix | unit (new assertion) | `npm run test -- component-library` | ❌ Wave 0 |
| SNIP-06 | Zero DaisyUI class names in snippet library | unit (new DaisyUI detector) | `npm run test -- component-library` | ❌ Wave 0 |
| SNIP-07 | ALL_SNIPPETS.length >= 100 | unit | `npm run test -- component-library` | ✅ exists (threshold=40, update to 100) |
| SNIP-08 | All tests pass clean after migration | all | `npm run test && npm run typecheck` | ✅ |

### Required Test Changes (Wave 0 — before snippet rewrite work begins)

Changes to `src/lib/component-library/component-library.test.ts`:

```typescript
// CHANGE: update count threshold
it("library has at least 100 snippets", () => {
  expect(ALL_SNIPPETS.length).toBeGreaterThanOrEqual(100);
});

// NEW: DaisyUI remnant detector (SNIP-01, SNIP-06)
it("no snippet html contains DaisyUI class names", () => {
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
  ALL_SNIPPETS.forEach((s) => {
    daisyUIPatterns.forEach((pattern) => {
      expect(s.html, `${s.id}: contains DaisyUI pattern "${pattern}"`).not.toContain(pattern);
    });
  });
});

// NEW: dark mode coverage (SNIP-05)
it("at least 80% of snippets include dark mode classes", () => {
  const withDark = ALL_SNIPPETS.filter((s) => s.html.includes('dark:'));
  expect(withDark.length).toBeGreaterThanOrEqual(Math.floor(ALL_SNIPPETS.length * 0.8));
});
```

### Sampling Rate

- **Per task commit:** `npm run test -- component-library`
- **Per wave merge:** `npm run test && npm run typecheck`
- **Phase gate:** Full suite green + typecheck clean before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] Update: `"library has at least 40 snippets"` → `toBeGreaterThanOrEqual(100)` in `component-library.test.ts`
- [ ] New test: DaisyUI remnant detector in `component-library.test.ts`
- [ ] New test: dark mode coverage assertion in `component-library.test.ts`
- [ ] Create: `src/lib/component-library/snippets/forms.ts`
- [ ] Create: `src/lib/component-library/snippets/ui-elements.ts`
- [ ] Create: `src/lib/component-library/snippets/cta.ts`
- [ ] Create: `src/lib/component-library/snippets/media.ts`
- [ ] Create: `src/lib/component-library/snippets/pricing.ts`
- [ ] Create: `src/lib/component-library/snippets/notifications.ts`
- [ ] Update: `src/lib/component-library/snippets/index.ts` — add 6 new imports + spread into ALL_SNIPPETS

---

## Sources

### Primary (HIGH confidence)

- `D:/STEVE/steve/.planning/research/PRELINE-UI.md` — Full Preline reference: 26 components, CDN setup, data-hs-* patterns, dark mode, key conventions. Section 8 explicitly documents CDN vs npm incompatibilities.
- `src/lib/component-library/snippets/*.ts` — All 11 existing files audited (4+3+4+4+3+3+3+5+4+4+4 = 41 snippets counted by grep)
- `src/lib/component-library/component-library.test.ts` — All 57 tests reviewed; exact change surface identified
- `src/lib/html-prompts.ts` — Current buildSystemPrompt() fully audited; all DaisyUI references documented
- `src/lib/ai-pipeline/analyzer.ts` — Tag vocabulary confirmed; sections and features are free-form strings, no strict enum

### Secondary (MEDIUM confidence)

- CDN compatibility analysis derived from PRELINE-UI.md section 8: "variants.css from npm provides the hs-* variant definitions Tailwind must resolve" — confirms hs-* variants are npm-only

### Tertiary (LOW confidence)

- Assumption that all Preline data-hs-* attribute behaviors (collapse, dropdown, modal, accordion, tabs, stepper) work correctly via CDN preline.js without any additional CSS. Recommend verifying accordion height animation and dropdown open/close with CDN-only setup before writing all accordion/dropdown snippets.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Preline CDN URL verified in PRELINE-UI.md; Tailwind CDN confirmed in current codebase
- Architecture: HIGH — all existing files fully read; types, index, test interface completely understood
- DaisyUI replacement table: HIGH — derived from direct code audit of all 11 snippet files
- Pitfalls: HIGH — CDN vs npm incompatibility explicitly stated in PRELINE-UI.md section 8; other pitfalls from direct test file audit
- Category expansion content: MEDIUM — content choices are Claude's discretion; exact snippet HTML is implementation work

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (Preline CDN URL stable; snippet content choices are stable)
