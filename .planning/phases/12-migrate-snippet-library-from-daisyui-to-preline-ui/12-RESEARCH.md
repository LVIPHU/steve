# Phase 12: Migrate Snippet Library from DaisyUI to Preline UI — Research

**Researched:** 2026-03-21
**Domain:** Component snippet library rewrite — DaisyUI → Preline UI + Tailwind utilities
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Rewrite all 47 existing HTML snippets (11 files) — replace DaisyUI classes with Tailwind utilities + Preline `data-hs-*` behaviors
- Expand all 11 existing categories: add 2-3 new Preline-specific snippets per category
- 4 new categories added: `forms`, `ui-elements`, `cta`, `media` — each with 8-10 snippets
- Additional categories from Preline docs that fit generated websites — researcher identifies
- Priority order for rewriting: hero, navbar, features, cards first → then the rest
- All snippets support dark mode via Tailwind `dark:` prefix
- Dark mode mechanism: `class="dark"` on `<html>` element
- Toggle placement: GPT-4o decides based on layout (hint in system prompt)
- Dark background palette: `dark:bg-gray-900` (page), `dark:bg-gray-800` (cards), `dark:bg-gray-700` (hover/nested)
- Text in dark: `dark:text-white` / `dark:text-gray-300` / `dark:text-gray-400`
- LocalStorage persistence for dark mode; default light mode on first load; localStorage key: `hs_theme`
- Existing 6 interactive snippets: rewrite CSS (DaisyUI → Tailwind), add Preline `data-hs-*` where applicable, preserve ALL JS functionality
- New interactive snippets: Before/After image slider, Typing animation hero, Multi-step stepper/wizard, Count-up animation on scroll
- External CDN libraries: allowed (Chart.js, GSAP, etc.)
- `buildSystemPrompt()`: full rewrite — delete all DaisyUI references, zero-parameter invariant preserved
- CDN setup: `<script src="https://cdn.tailwindcss.com"></script>` + `<script src="https://cdn.jsdelivr.net/npm/preline/dist/preline.js"></script>`
- System prompt language: English
- Preline guidance depth: full — explain `data-hs-*` attributes, `hs-*` state classes, CDN setup, dark mode toggle pattern
- Colors: snippets use placeholder Tailwind colors (blue-600/indigo-600 as primary); GPT-4o replaces with DesignResult palette
- No semantic token colors (bg-primary, bg-layer, etc.) in snippets — not CDN-compatible
- Typography: snippets use `font-sans`; font injected via `buildGoogleFontsImport()` from DesignResult
- No HTML comments in snippets; all AI guidance in `buildSystemPrompt()` and `buildUserMessage()`
- `component-library.test.ts` (57 tests): remove DaisyUI class name assertions; behavior-level tests unchanged
- Dashboard app (Tailwind v4 custom) is NOT touched
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

## Summary

Phase 12 rewrites the component snippet library from DaisyUI (41 current snippets, 11 files) to Preline UI + vanilla Tailwind utilities. The migration has three layers: (1) CSS class replacement — every DaisyUI utility class (`btn`, `card`, `badge`, `navbar`, `hero`, `stats`, `progress`, `modal`, `form-control`, `input-bordered`, etc.) must be replaced with Tailwind utility equivalents and optionally Preline `data-hs-*` wired behaviors; (2) library expansion — each of the 11 existing categories gains 2-3 new snippets, and 4+ new categories are added for a 100+ snippet target; (3) `html-prompts.ts` system prompt rewrite replacing all DaisyUI CDN/guidance with Preline CDN/guidance.

The critical constraint is CDN compatibility: Preline's semantic token system (bg-primary, bg-layer, text-foreground, etc.) requires the npm build pipeline and is NOT available via CDN. Snippets must use raw Tailwind palette classes (blue-600, gray-900, white) with `dark:` prefixed counterparts. Preline's JavaScript behaviors (accordions, modals, dropdowns, tabs, carousels, stepper) ARE available via CDN and should be used freely.

The `selectComponents()` function and test suite are not structurally changed. Snippets must continue conforming to the `ComponentSnippet` type (id, name, description, category, tags, priority, domain_hints, min_score, fallback, fallback_for, html). Tag vocabulary must stay within the existing `sections`/`features` vocabulary from `analyzer.ts` — no new tag words without updating the analyzer.

**Primary recommendation:** Rewrite snippets as pure Tailwind-utility HTML with Preline `data-hs-*` for interactive components. Do NOT use Preline semantic tokens in any snippet HTML. Use placeholder color pattern: blue-600 for primary, gray-900 for dark text, white for backgrounds.

---

## Current Snippet Inventory (41 snippets to rewrite)

| File | Count | Snippets |
|------|-------|---------|
| hero.ts | 4 | hero-centered, hero-split, hero-minimal, hero-dashboard |
| navbar.ts | 3 | navbar-simple, navbar-dropdown, navbar-mobile |
| features.ts | 4 | features-3col, features-icon-list, features-alternating, features-comparison |
| cards.ts | 4 | card-basic, card-stat, card-profile, card-pricing |
| footer.ts | 3 | footer-simple, footer-multicolumn, footer-minimal |
| stats.ts | 3 | stats-bar, stats-counter, stats-progress |
| testimonials.ts | 3 | testimonial-quotes, testimonial-avatar-grid, testimonial-featured |
| interactive.ts | 5 | quiz-multiple-choice, flashcard-flip, step-timer, calculator-basic, progress-tracker |
| blog.ts | 4 | article-grid, timeline, table-of-contents, reading-progress |
| portfolio.ts | 4 | skills-grid, projects-showcase, career-timeline, contact-form |
| ecommerce.ts | 4 | pricing-table, feature-comparison, product-showcase, cta-banner |
| **Total** | **41** | |

Note: CONTEXT.md says 47 but actual count is 41. The 47 target in the decision text appears to be an estimate. Planner should plan for 41 rewrites.

---

## DaisyUI → Tailwind/Preline Class Mapping

This is the core lookup table for the rewrite. Every DaisyUI class that appears in snippets maps to a Tailwind equivalent.

### Layout / Container

| DaisyUI | Preline/Tailwind Equivalent |
|---------|----------------------------|
| `hero`, `hero-content` | `min-h-screen flex items-center justify-center` |
| `navbar bg-base-100` | `flex items-center justify-between py-3 px-6 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700` |
| `navbar-start`, `navbar-center`, `navbar-end` | `flex items-center` / `flex items-center justify-center` / `flex items-center justify-end` |
| `footer footer-center` | `py-10 px-6 bg-gray-900 text-white text-center` |
| `footer` | `py-10 px-6 bg-gray-900 text-white` |
| `footer-title` | `text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3` |
| `card bg-base-100` | `bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700` |
| `card bg-base-200` | `bg-gray-50 border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700` |
| `card-body` | `p-4 md:p-5` |
| `card-title` | `text-lg font-semibold text-gray-900 dark:text-white` |
| `card-actions` | `flex items-center gap-x-2 mt-4` |
| `card-side` (lg) | `sm:flex` |

### Colors / Background

| DaisyUI | Tailwind CDN equivalent |
|---------|------------------------|
| `bg-base-100` | `bg-white dark:bg-gray-900` |
| `bg-base-200` | `bg-gray-50 dark:bg-gray-800` |
| `bg-base-300` | `bg-gray-100 dark:bg-gray-700` |
| `bg-neutral` | `bg-gray-900` |
| `bg-primary` | `bg-blue-600` |
| `bg-secondary` | `bg-indigo-500` |
| `bg-accent` | `bg-teal-500` |
| `text-base-content` | `text-gray-900 dark:text-white` |
| `text-base-content/60` | `text-gray-500 dark:text-gray-400` |
| `text-base-content/70` | `text-gray-600 dark:text-gray-300` |
| `text-neutral-content` | `text-gray-100` |
| `text-primary` | `text-blue-600 dark:text-blue-400` |
| `text-secondary` | `text-indigo-500 dark:text-indigo-400` |
| `text-accent` | `text-teal-500 dark:text-teal-400` |
| `text-success` | `text-teal-600 dark:text-teal-400` |
| `text-error` | `text-red-600 dark:text-red-400` |
| `text-warning` | `text-yellow-500 dark:text-yellow-400` |
| `text-primary-content` | `text-white` |
| `border-base-200` | `border-gray-200 dark:border-gray-700` |

### Buttons

| DaisyUI | Tailwind CDN equivalent |
|---------|------------------------|
| `btn btn-primary` | `py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50` |
| `btn btn-secondary` | `py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-indigo-500 text-white hover:bg-indigo-600` |
| `btn btn-outline` | `py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300` |
| `btn btn-ghost` | `py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/20` |
| `btn btn-sm` | add `text-xs py-1.5 px-3` |
| `btn btn-lg` | add `text-base py-3 px-6` |
| `btn btn-xs` | add `text-xs py-1 px-2` |
| `btn btn-block` | add `w-full justify-center` |
| `btn btn-circle` | add `size-9 rounded-full p-0 justify-center` |

### Badges

| DaisyUI | Tailwind CDN equivalent |
|---------|------------------------|
| `badge badge-primary` | `inline-flex items-center gap-x-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400` |
| `badge badge-secondary` | `inline-flex items-center gap-x-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400` |
| `badge badge-outline` | `inline-flex items-center gap-x-1.5 py-1 px-2.5 rounded-full text-xs font-medium border border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400` |
| `badge badge-success` | `inline-flex items-center gap-x-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400` |
| `badge badge-ghost` | `inline-flex items-center gap-x-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300` |
| `badge badge-sm` | keep `text-xs` size |
| `badge badge-lg` | use `text-sm py-1.5 px-3` |

### Form Elements

| DaisyUI | Tailwind CDN equivalent |
|---------|------------------------|
| `input input-bordered` | `py-2.5 px-4 rounded-lg block w-full border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white` |
| `textarea textarea-bordered` | same pattern as input, `rows="3"` |
| `form-control` | `space-y-1.5` |
| `label` | `block` |
| `label-text` | `text-sm font-medium text-gray-700 dark:text-gray-300` |
| `checkbox checkbox-primary` | `shrink-0 size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600` |
| `progress progress-primary` | replace with div-based: `<div class="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-2 bg-blue-600 rounded-full" style="width: X%"></div></div>` |
| `toggle toggle-primary` | replace with Preline Switch pattern |
| `select` (DaisyUI) | `py-2.5 px-4 pe-9 block w-full border border-gray-300 rounded-lg text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white` |

### Stats / Specific Patterns

| DaisyUI | Tailwind CDN equivalent |
|---------|------------------------|
| `stats shadow` | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:divide-gray-700 dark:border-gray-700` |
| `stat` | `p-5` |
| `stat-title` | `text-sm text-gray-500 dark:text-gray-400` |
| `stat-value` | `text-3xl font-bold text-gray-900 dark:text-white mt-1` |
| `stat-desc` | `text-xs text-gray-500 dark:text-gray-400 mt-1` |
| `stat-figure` | `text-2xl` (keep emoji/icon) |
| `avatar placeholder` | `inline-flex items-center justify-center size-10 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-semibold` |
| `timeline timeline-vertical` | replace with vertical flex/line pattern (DaisyUI timeline not available in CDN Tailwind) |
| `mockup-code` | `bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm` |

### Colors Used in Snippet HTML at Semantic Level
DaisyUI uses CSS variables (`hsl(var(--p))`, `hsl(var(--b1))`) in inline styles in some interactive snippets. These must be changed to hard Tailwind utility classes. For example the flashcard snippet uses `.fc-front { background-color: hsl(var(--b1)) }` — this must become `bg-white dark:bg-gray-800` applied as a class.

---

## Preline Interactive Components Available via CDN

These Preline behaviors work with the CDN script and should be used in snippets:

| Component | `data-hs-*` Pattern | Use In |
|-----------|-------------------|--------|
| Accordion | `data-hs-accordion-group`, `.hs-accordion`, `.hs-accordion-toggle`, `.hs-accordion-content` | features (FAQ), blog (TOC), ui-elements |
| Collapse | `data-hs-collapse="#id"` on trigger, `.hs-collapse` on target | navbar mobile menu (replaces vanilla JS), ui-elements |
| Dropdown | `.hs-dropdown`, `.hs-dropdown-toggle`, `.hs-dropdown-menu` | navbar dropdown, ui-elements |
| Modal | `data-hs-overlay="#id"`, `.hs-overlay` | contact form confirmation, ui-elements |
| Tabs | `data-hs-tab="#panel-id"`, `.hs-tab-active:*` state classes | features, portfolio, ui-elements |
| Carousel | `data-hs-carousel`, `.hs-carousel-body`, `.hs-carousel-slide` | media, testimonials |
| Stepper | `data-hs-stepper`, `data-hs-stepper-nav-item`, `data-hs-stepper-next-btn` | interactive (multi-step wizard) |
| Tooltip | `.hs-tooltip`, `.hs-tooltip-toggle`, `.hs-tooltip-content` | ui-elements, features |
| Remove Element | `data-hs-remove-element="#id"` | alerts (ui-elements), dismissible badges |
| Theme Switch | `data-hs-theme-click-value="dark"` / `"light"` | navbar dark mode toggle |

**NOT available via CDN (require npm build with variants.css):**
- All Preline semantic tokens: `bg-primary`, `bg-layer`, `text-foreground`, `border-layer-line`, etc.
- These appear extensively in PRELINE-UI.md code examples but CANNOT be used in snippets

---

## Architecture Patterns

### Recommended Snippet File Structure

```
src/lib/component-library/snippets/
├── hero.ts          # existing — rewrite + expand
├── navbar.ts        # existing — rewrite + expand (add dark mode toggle)
├── features.ts      # existing — rewrite + expand (add accordion, tabs)
├── cards.ts         # existing — rewrite + expand (add Preline card patterns)
├── footer.ts        # existing — rewrite + expand
├── stats.ts         # existing — rewrite + expand
├── testimonials.ts  # existing — rewrite + expand (add carousel)
├── interactive.ts   # existing — rewrite + expand (add stepper, before/after)
├── blog.ts          # existing — rewrite + expand (remove DaisyUI timeline/mockup-code)
├── portfolio.ts     # existing — rewrite + expand
├── ecommerce.ts     # existing — rewrite + expand
├── forms.ts         # NEW — 8-10 snippets
├── ui-elements.ts   # NEW — 8-10 snippets
├── cta.ts           # NEW — 8-10 snippets
├── media.ts         # NEW — 8-10 snippets
├── pricing.ts       # NEW (recommended additional) — 6-8 snippets
├── notifications.ts # NEW (recommended additional) — 6-8 snippets
└── index.ts         # ADD new file imports to ALL_SNIPPETS
```

### Pattern 1: Standard Section Snippet (No Preline JS)
```html
<!-- Pure Tailwind — no data-hs-* needed -->
<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold text-gray-900 dark:text-white">Title</h2>
    <p class="mt-4 text-gray-500 dark:text-gray-400">Description</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      <!-- cards here -->
    </div>
  </div>
</section>
```

### Pattern 2: Preline Navbar with Collapse + Dark Mode Toggle
```html
<header class="flex flex-wrap sm:justify-start sm:flex-nowrap w-full py-3 px-6
               bg-white border-b border-gray-200
               dark:bg-gray-900 dark:border-gray-700">
  <nav class="max-w-7xl w-full mx-auto flex items-center justify-between">
    <a class="flex-none text-xl font-bold text-blue-600" href="#">Brand</a>
    <!-- Desktop links -->
    <div class="hidden sm:flex items-center gap-6">
      <a class="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300" href="#">Home</a>
    </div>
    <!-- Dark mode toggle -->
    <button data-hs-theme-click-value="dark" class="...">Toggle Dark</button>
    <!-- Mobile hamburger -->
    <button class="hs-collapse-toggle sm:hidden ..."
      aria-expanded="false" aria-controls="hs-navbar-collapse"
      data-hs-collapse="#hs-navbar-collapse">
      <svg class="hs-collapse-open:hidden size-4"><!-- hamburger --></svg>
      <svg class="hs-collapse-open:block hidden size-4"><!-- X --></svg>
    </button>
  </nav>
  <!-- Mobile menu -->
  <div id="hs-navbar-collapse"
       class="hs-collapse hidden overflow-hidden transition-all duration-300 w-full">
    <!-- mobile links -->
  </div>
</header>
```

### Pattern 3: Preline Accordion (FAQ / Features)
```html
<div class="hs-accordion-group space-y-2">
  <div class="hs-accordion bg-white border border-gray-200 rounded-xl
              dark:bg-gray-800 dark:border-gray-700" id="faq-1">
    <button class="hs-accordion-toggle hs-accordion-active:text-blue-600
                   flex items-center justify-between w-full py-4 px-5
                   text-sm font-semibold text-gray-900 dark:text-white"
      aria-expanded="false" aria-controls="faq-1-body">
      Question text
      <svg class="hs-accordion-active:rotate-180 size-4 flex-shrink-0 transition-transform">
        <!-- chevron down -->
      </svg>
    </button>
    <div id="faq-1-body" class="hs-accordion-content hidden w-full overflow-hidden
                                transition-[height] duration-300">
      <p class="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400">Answer text</p>
    </div>
  </div>
</div>
```

### Pattern 4: Preline Tabs
```html
<div class="border-b border-gray-200 dark:border-gray-700">
  <nav class="-mb-px flex gap-x-1" role="tablist">
    <button class="hs-tab-active:border-blue-600 hs-tab-active:text-blue-600
                   py-3 px-4 text-sm font-medium border-b-2 border-transparent
                   text-gray-500 hover:text-blue-600 dark:text-gray-400"
      id="tab-1" data-hs-tab="#panel-1" role="tab" aria-selected="true">Tab 1</button>
    <button class="hs-tab-active:border-blue-600 hs-tab-active:text-blue-600
                   py-3 px-4 text-sm font-medium border-b-2 border-transparent
                   text-gray-500 hover:text-blue-600 dark:text-gray-400"
      id="tab-2" data-hs-tab="#panel-2" role="tab" aria-selected="false">Tab 2</button>
  </nav>
</div>
<div class="mt-4">
  <div id="panel-1" role="tabpanel">Panel 1 content</div>
  <div id="panel-2" class="hidden" role="tabpanel">Panel 2 content</div>
</div>
```

### Pattern 5: Interactive Snippet with Preserved Vanilla JS
```html
<section class="py-10 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-xl mx-auto">
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm
                dark:bg-gray-800 dark:border-gray-700 p-6" id="quiz-app">
      <!-- structure using pure Tailwind -->
      <!-- progress bar: div-based, not DaisyUI <progress> -->
      <div class="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-4">
        <div id="quiz-progress-fill" class="h-2 bg-blue-600 rounded-full transition-all duration-300" style="width: 0%"></div>
      </div>
      <div id="quiz-container"></div>
    </div>
  </div>
  <script>
    (function() {
      /* ALL EXISTING JS LOGIC PRESERVED UNCHANGED */
      /* Only class name strings in DOM manipulation updated */
      /* e.g., btn btn-outline → border border-gray-300 rounded-lg px-4 py-2 */
    })();
  </script>
</section>
```

### Pattern 6: Dark Mode Anti-Flash Script (for navbar snippets)
```html
<!-- In navbar snippet, add this as the first element of the HTML output -->
<script>
  if (localStorage.getItem('hs_theme') === 'dark' ||
      (localStorage.getItem('hs_theme') === 'auto' &&
       window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

Note: This belongs in the system prompt instruction to GPT-4o, not in snippet HTML itself. Snippets are partial sections, not full HTML documents.

---

## New Category Design (4 mandatory + 2 recommended)

### `forms` — 8-10 snippets
Forms with Preline styling. No `@tailwindcss/forms` plugin available via CDN, so use Tailwind utility classes directly.

| Snippet ID | Description | Preline Pattern |
|-----------|-------------|----------------|
| form-contact | Contact form with name/email/message | Tailwind inputs, button |
| form-newsletter | Email subscription with inline CTA | Tailwind input + button |
| form-login | Login form with email/password | Tailwind inputs, floating labels style |
| form-register | Registration with confirm password | Tailwind inputs, validation states |
| form-search | Search bar with icon + suggestions | Tailwind input + icon |
| form-filter | Filter/search with checkboxes and dropdowns | Preline HSDropdown for filter panel |
| form-feedback | Star rating + textarea | Vanilla JS star rating |
| form-subscribe | Newsletter with social proof | Tailwind + badge |
| form-wizard | Multi-step form with Preline Stepper | `data-hs-stepper` |

### `ui-elements` — 8-10 snippets
Reusable UI building blocks using Preline components.

| Snippet ID | Description | Preline Pattern |
|-----------|-------------|----------------|
| ui-accordion-faq | FAQ accordion | `data-hs-accordion-group` |
| ui-tabs | Content tabs with panels | `data-hs-tab` |
| ui-modal-confirm | Confirmation modal | `data-hs-overlay` |
| ui-dropdown-menu | Action dropdown menu | `hs-dropdown` |
| ui-alerts | Alert variants (success/error/warning/info) | `data-hs-remove-element` |
| ui-badge-collection | Badge showcase with all variants | Tailwind utility badges |
| ui-tooltip-demo | Tooltip usage examples | `hs-tooltip` |
| ui-skeleton-loader | Loading skeleton placeholders | Tailwind `animate-pulse` |
| ui-pagination | Page navigation | Tailwind utility pagination |

### `cta` — 8-10 snippets
Call-to-action sections in various layouts.

| Snippet ID | Description | Preline Pattern |
|-----------|-------------|----------------|
| cta-banner-gradient | Full-width gradient CTA | Pure Tailwind |
| cta-split | Two-column text + form CTA | Tailwind + Preline input |
| cta-minimal | Centered minimal text + buttons | Pure Tailwind |
| cta-dark | Dark background CTA section | `dark:` prefix pattern |
| cta-social-proof | CTA with avatars + count | Avatar group pattern |
| cta-app-download | App store download buttons | Pure Tailwind |
| cta-newsletter | Inline newsletter CTA | Preline input pattern |
| cta-countdown | CTA with countdown timer | Vanilla JS countdown |

### `media` — 8-10 snippets
Image, video, and media display patterns.

| Snippet ID | Description | Preline Pattern |
|-----------|-------------|----------------|
| media-gallery-grid | Masonry-style image grid | CSS grid + hover overlay |
| media-carousel | Image carousel | `data-hs-carousel` |
| media-video-embed | Responsive video embed | aspect-ratio pure CSS |
| media-lightbox | Click to enlarge image | Modal + `data-hs-overlay` |
| media-before-after | Before/After image slider | Vanilla JS slider |
| media-feature-image | Large feature image with caption | Pure Tailwind |
| media-logo-cloud | Partner/client logo grid | Flex wrap grid |
| media-image-text | Image + text side-by-side block | Responsive flex |

### `pricing` (additional — recommended) — 6-8 snippets

| Snippet ID | Description |
|-----------|-------------|
| pricing-simple | 3-tier cards monthly/annual toggle |
| pricing-comparison | Feature comparison table |
| pricing-saas | SaaS pricing with highlighted tier |
| pricing-usage | Usage-based pricing display |
| pricing-enterprise | Enterprise contact us pattern |
| pricing-one-time | One-time purchase pricing |

### `notifications` (additional — recommended) — 6-8 snippets

| Snippet ID | Description | Preline Pattern |
|-----------|-------------|----------------|
| notification-toast-stack | Stack of dismissible toasts | `data-hs-remove-element` |
| notification-banner | Top-of-page announcement banner | `data-hs-remove-element` |
| notification-alert-variants | Alert component variants | Tailwind utilities |
| notification-badge-counter | Icon with notification count badge | Animated ping badge |
| notification-inline | Inline success/error messages | Tailwind |
| notification-cookie | GDPR cookie consent bar | Vanilla JS + localStorage |

---

## Expansion Plan for Existing Categories

### hero (4 → 6-7 snippets, +2-3)
- **hero-video-bg**: Dark overlay hero with video background placeholder, headline + CTA
- **hero-gradient**: Animated gradient background, large headline, typing animation (uses GSAP or vanilla JS)
- **hero-saas**: Typical SaaS hero with product screenshot mockup and social proof row

### navbar (3 → 5-6 snippets, +2-3)
- **navbar-mega-menu**: Desktop navbar with Preline Dropdown containing mega menu grid
- **navbar-with-search**: Navbar + search input (Preline input pattern)
- **navbar-sticky-dark**: Fixed sticky navbar with dark mode toggle using `data-hs-theme-click-value`

### features (4 → 6-7 snippets, +2-3)
- **features-tabs**: Features section with Preline Tabs switching between feature details
- **features-accordion**: Collapsible features using `data-hs-accordion-group`
- **features-numbered**: Numbered feature steps in a grid

### cards (4 → 6-7 snippets, +2-3)
- **card-horizontal**: Horizontal image + text card (Preline horizontal card pattern)
- **card-hover-lift**: Cards with hover scale and shadow transition
- **card-top-accent**: Cards with colored top border (Preline top-accent pattern)

### footer (3 → 5-6 snippets, +2-3)
- **footer-newsletter**: Footer with newsletter subscription form
- **footer-dark-expanded**: Dark footer with logo, tagline, social links, legal

### stats (3 → 5-6 snippets, +2-3)
- **stats-icon-cards**: Stats with icon badges and trend indicators
- **stats-horizontal-progress**: Stat metric rows with inline progress bars

### testimonials (3 → 5-6 snippets, +2-3)
- **testimonial-carousel**: Testimonials in Preline Carousel
- **testimonial-single-large**: Single large quote with company logo

### interactive (5 → 8-9 snippets, +3-4)
- **before-after-slider**: Before/After image comparison slider (vanilla JS)
- **multi-step-wizard**: Multi-step form/wizard using Preline Stepper (`data-hs-stepper`)
- **count-up-scroll**: Count-up animation on scroll (IntersectionObserver — similar to existing stats-counter but as interactive category)

### blog (4 → 6-7 snippets, +2-3)
- **blog-featured**: Featured article hero with large image
- **blog-sidebar**: Article layout with sidebar TOC (refinement of table-of-contents)

Note: The existing `timeline` snippet uses `timeline timeline-vertical` DaisyUI classes — must be rewritten as a vertical flex/line pattern since DaisyUI timeline is not in CDN Tailwind. The `mockup-code` class in `table-of-contents` must be replaced with `bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm`.

### portfolio (4 → 6-7 snippets, +2-3)
- **portfolio-filter**: Portfolio with filter tabs by category (Preline Tabs)
- **portfolio-masonry**: Masonry CSS grid for project images

### ecommerce (4 → 6-7 snippets, +2-3)
- **product-card-grid**: Product cards with image, price, add-to-cart
- **cart-summary**: Order summary sidebar card
- **checkout-steps**: Checkout progress using Preline Stepper

---

## html-prompts.ts Rewrite Plan

The `buildSystemPrompt()` function needs complete replacement. Key structural changes:

### CDN Block (replaces DaisyUI CDNs)
```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/preline/dist/preline.js"></script>
```

### Dark Mode Section (new — DaisyUI had no equivalent)
```
DARK MODE:
- Add class="dark" to <html> to activate dark mode
- Anti-flash script (put in <head>, before <body>): if (localStorage.getItem('hs_theme') === 'dark' || ...) { document.documentElement.classList.add('dark'); }
- localStorage key: hs_theme — values: "light" | "dark" | "auto"
- Toggle button: <button data-hs-theme-click-value="dark"> for dark, <button data-hs-theme-click-value="light"> for light
- Dark backgrounds: dark:bg-gray-900 (page), dark:bg-gray-800 (cards), dark:bg-gray-700 (hover)
- Dark text: dark:text-white (headings), dark:text-gray-300 (body), dark:text-gray-400 (muted)
```

### Preline Interactive Components Section (replaces DaisyUI component list)
```
PRELINE INTERACTIVE COMPONENTS (use data-hs-* attributes):
- Accordion/FAQ: .hs-accordion-group > .hs-accordion > .hs-accordion-toggle + .hs-accordion-content
- Mobile nav collapse: button[data-hs-collapse="#menu-id"] + div.hs-collapse
- Dropdown menu: .hs-dropdown > .hs-dropdown-toggle + .hs-dropdown-menu
- Modal: button[data-hs-overlay="#modal-id"] + div.hs-overlay
- Tabs: buttons[data-hs-tab="#panel-id"] + panel divs
- Carousel: [data-hs-carousel] wrapper
- Stepper wizard: [data-hs-stepper] with data-hs-stepper-nav-item/content-item
- Dismiss: button[data-hs-remove-element="#el-id"]
- State classes: hs-accordion-active:* | hs-collapse-open:* | hs-dropdown-open:* | hs-tab-active:*
```

### Color/Token Clarification (CRITICAL)
```
IMPORTANT: Do NOT use Preline semantic tokens (bg-primary, bg-layer, text-foreground, etc.)
These require npm build pipeline and will not render via CDN.
Use raw Tailwind palette classes: bg-blue-600, bg-gray-900, text-white, etc.
Replace Design Brief colors by overriding bg-blue-600 → your primary hex color.
```

### Anti-Patterns Section (replaces DaisyUI anti-patterns)
Keep existing CSS mistakes section (flip card, aspect-ratio), update button/component examples from DaisyUI to Preline patterns, remove Alpine.js references (not needed with Preline).

---

## ComponentSnippet Compliance

### Tag Vocabulary Constraint
`selectComponents()` matches snippet `tags[]` against `analysis.sections` and `analysis.features` from `analyzer.ts`. New snippets must use only existing tag vocabulary. Do not invent new tag words.

Existing tag vocabulary found in snippets:
```
sections: hero, cta, navbar, features, cards, footer, stats, testimonials,
          article-grid, timeline, table-of-contents, reading-progress, skills,
          projects, contact, pricing

features: flip-cards, flip-animation, localStorage, drag, prev-next-nav,
          steps, timer, countdown, recipe, calculator, progress, checklist,
          quiz
```

For new category snippets, assign tags from existing vocabulary that are semantically appropriate. If a new snippet has no vocabulary match, use the closest existing tag or mark it with `fallback: false` and `min_score: 1` so it only appears when explicitly matched.

### Fallback Coverage
Must maintain fallback snippets for all domain types. Current fallback coverage:
- `landing` fallback: hero-centered, navbar-simple, features-3col, footer-simple
- `portfolio` fallback: hero-split, card-basic, navbar-simple
- `blog` fallback: article-grid, step-timer, footer-simple
- `dashboard` fallback: hero-dashboard, stats-bar, card-stat
- `generic` fallback: hero-centered, navbar-simple, features-3col, footer-simple

New snippets added to these categories should preserve or extend fallback coverage.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mobile nav toggle | Vanilla JS show/hide | Preline `data-hs-collapse` | Handles accessibility, ARIA, keyboard |
| Dropdown positioning | Manual absolute CSS | Preline `hs-dropdown` | Floating UI handles viewport edge detection |
| Modal focus trap | Custom JS focus management | Preline `data-hs-overlay` | Built-in accessibility, backdrop, escape key |
| Tab state | Manual `active` class toggle | Preline `data-hs-tab` | Handles aria-selected, panel show/hide |
| Accordion expand/collapse | Manual JS height animation | Preline `hs-accordion` | CSS height transition, ARIA |
| Dark mode persistence | Custom localStorage logic | `hs_theme` key + `data-hs-theme-click-value` | Standard key name used by system prompt |
| Progress bars | `<progress>` element | `div`-based with style width | `<progress>` is DaisyUI-specific, div pattern is universal |

---

## Common Pitfalls

### Pitfall 1: Using Preline Semantic Tokens in Snippets
**What goes wrong:** Snippet uses `bg-primary`, `text-foreground`, `bg-layer`, `border-layer-line` — renders as unstyled since these CSS variables are not defined by CDN Tailwind.
**Why it happens:** PRELINE-UI.md examples use semantic tokens extensively (they assume npm build). CDN Tailwind has no access to Preline's theme variables.
**How to avoid:** Only use raw Tailwind palette classes in snippets. Blue-600 family for primary, gray-X for neutrals.
**Warning signs:** Any class from Section 2 of PRELINE-UI.md (Theming System) used in snippet HTML.

### Pitfall 2: DaisyUI Semantic Remnants
**What goes wrong:** `bg-base-100`, `text-base-content`, `btn btn-primary`, `card`, `badge` classes remain — render as unknown/no-op with just Tailwind CDN.
**How to avoid:** Use the class mapping table above for every conversion. Grep for `btn `, `card`, `badge`, `navbar-`, `hero-`, `footer-`, `stat-`, `alert-`, `progress progress-`, `mockup-`, `timeline-` patterns after writing each snippet.
**Warning signs:** Any hyphenated class starting with these DaisyUI prefixes.

### Pitfall 3: `hs-*` State Classes Without Preline JS
**What goes wrong:** Classes like `hs-accordion-active:text-blue-600` are added but Preline JS not included in snippet HTML (correct — CDN is in buildSystemPrompt), however if snippets are tested in isolation they appear broken.
**Why it happens:** Preline state classes require `preline.js` to be loaded. Snippets are HTML fragments, not full pages.
**How to avoid:** This is expected — snippets are injected into GPT-4o context which generates full pages with CDN. Don't add CDN links to snippet HTML (test `no snippet html contains CDN links` will fail).

### Pitfall 4: JavaScript DOM Class References
**What goes wrong:** Existing interactive snippet JS uses strings like `'btn-success'`, `'btn-error'`, `'btn-outline'` in `classList.add()` calls — these become no-ops after migration.
**How to avoid:** Audit every `classList.add/remove/toggle` call in interactive snippets and update the string values to Tailwind equivalents. For example `classList.add('btn-success')` → `classList.add('bg-teal-600', 'text-white', 'border-transparent')`.

### Pitfall 5: DaisyUI Timeline / Mockup-Code Components
**What goes wrong:** `timeline timeline-vertical`, `timeline-start`, `timeline-middle`, `timeline-end`, `timeline-box`, `mockup-code` — none exist in CDN Tailwind. They render as unstyled `div`/`ul`.
**How to avoid:** Blog `timeline` snippet must be rewritten as a vertical flex pattern with manual `border-l` connector line. `mockup-code` must become `bg-gray-900 rounded-lg p-4 font-mono text-sm`.

### Pitfall 6: Test Assertion Breakage
**What goes wrong:** `component-library.test.ts` has behavior tests that check specific DaisyUI class strings. These must be removed.
**How to avoid:** The test file does NOT have DaisyUI class assertions per the CONTEXT.md — confirmed by reading the test file. The 57 tests cover: field validation, CDN link absence, unique IDs, selectComponents behavior, fallback logic. No hardcoded class name tests visible in the first 160 lines. The CDN link test (`not.toContain("cdn.jsdelivr.net")`) will pass because snippets must not include CDN links. Planner should verify no DaisyUI class assertions exist in the remainder of the test file.

### Pitfall 7: Flashcard CSS Variables
**What goes wrong:** The flashcard snippet uses `hsl(var(--b1))` and `hsl(var(--p))` in an inline `<style>` block — these are DaisyUI CSS variables that won't resolve.
**How to avoid:** Replace the `<style>` block with inline Tailwind classes directly on the elements. Remove `.fc-front` and `.fc-back` CSS rule block.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (via `npm run test`) |
| Config file | Detected from package.json scripts |
| Quick run command | `npm run test -- component-library` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SNIP-01 | All snippets have required fields | unit | `npm run test -- component-library` | Yes |
| SNIP-02 | No snippet HTML contains DOCTYPE | unit | `npm run test -- component-library` | Yes |
| SNIP-03 | No snippet HTML contains CDN links | unit | `npm run test -- component-library` | Yes |
| SNIP-04 | All snippet IDs are unique | unit | `npm run test -- component-library` | Yes |
| SNIP-05 | Library has >= 100 snippets after migration | unit | Update threshold in test file | Needs update |
| SNIP-06 | No DaisyUI class remnants in snippet HTML | unit | New grep-style test or manual audit | Wave 0 gap |
| SNIP-07 | selectComponents returns 4 for landing | unit | `npm run test -- component-library` | Yes |
| SNIP-08 | Fallback paths still work | unit | `npm run test -- component-library` | Yes |
| SNIP-09 | TypeScript build passes | type check | `npm run typecheck` | N/A (build) |
| SNIP-10 | html-prompts.ts no DaisyUI CDN | manual/grep | `grep "daisyui" src/lib/html-prompts.ts` | N/A |

### Sampling Rate
- **Per task commit:** `npm run test -- component-library`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green + typecheck pass before verify-work

### Wave 0 Gaps
- [ ] Update `component-library.test.ts` line 27: change `toBeGreaterThanOrEqual(40)` to `toBeGreaterThanOrEqual(100)` for new target
- [ ] Optional: Add DaisyUI class remnant detector test that greps snippet HTML for known DaisyUI class prefixes (`btn `, `badge `, `card `, `navbar-`, `hero `, `footer `, `stat-`, etc.)

---

## Recommended Additional Categories

Beyond the 4 mandatory new categories, these 2 additional categories from Preline's component inventory are well-suited for generated websites:

**`pricing`** — Dedicated pricing section category (currently mixed into `cards` and `ecommerce`). Separating it gives `selectComponents()` a precise tag match for pricing-heavy websites. 6-8 snippets covering tiers, comparison, toggle, enterprise.

**`notifications`** — Alerts, banners, toast patterns. These appear in nearly every application and business website. Preline has first-class support via `data-hs-remove-element`. 6-8 snippets covering info/success/error alerts, dismissible banners, notification badges.

**Not recommended adding:**
- `sidebar` — Only relevant for app-style sites, not typical generated landing pages/portfolios
- `datepicker` — Requires Floating UI CDN as extra dependency; too specialized
- `datatables` — Third-party dependency, excessive for generated sites

---

## Sources

### Primary (HIGH confidence)
- `.planning/research/PRELINE-UI.md` — Full Preline component inventory, CDN setup, `data-hs-*` patterns, semantic tokens, dark mode, all 26+ components with code examples
- `src/lib/component-library/snippets/*.ts` — Actual DaisyUI class inventory across all 41 snippets
- `src/lib/html-prompts.ts` — Current DaisyUI system prompt requiring full rewrite
- `src/lib/component-library/types.ts` — ComponentSnippet type contract
- `src/lib/component-library/index.ts` — selectComponents() tag-matching algorithm
- `src/lib/component-library/component-library.test.ts` — 57 existing tests that must continue passing

### Secondary (MEDIUM confidence)
- `.planning/phases/12-migrate-snippet-library-from-daisyui-to-preline-ui/12-CONTEXT.md` — User decisions, locked and discretion areas

---

## Metadata

**Confidence breakdown:**
- DaisyUI → Tailwind mapping: HIGH — derived directly from reading actual snippet HTML
- Preline CDN-compatible patterns: HIGH — verified against PRELINE-UI.md section 1 (CDN setup confirms JS behavior available, semantic tokens require npm)
- New category design: MEDIUM — based on Preline component inventory and common web patterns; exact snippets are Claude's discretion
- Tag vocabulary constraint: HIGH — verified by reading analyzer.ts and selectComponents() directly
- Test impact: HIGH — verified by reading full test file

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (Preline stable; snippets are static HTML)
