# Phase 12: Migrate Snippet Library from DaisyUI to Preline UI - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate the component snippet library from DaisyUI to Preline UI. Scope:
1. Rewrite all 47 existing HTML snippets (11 files) — replace DaisyUI classes with Tailwind utilities + Preline `data-hs-*` behaviors
2. Expand all 11 existing categories with 2-3 new Preline-specific snippets each
3. Add 4 new categories (forms, ui-elements, cta, media) with 8-10 snippets each
4. Add additional categories from Preline docs that are relevant for generated websites (researcher decides)
5. Rewrite `html-prompts.ts` — update CDN links + full system prompt rewrite for Preline guidance

Dashboard app (Tailwind v4 custom) is NOT touched. Only generated website output is affected.

**Target:** ~100+ snippets total (was 47), 15+ categories (was 11).

</domain>

<decisions>
## Implementation Decisions

### Snippet count & expansion
- Rewrite all 47 existing snippets (DaisyUI → Preline/Tailwind)
- All 11 existing categories expanded: add 2-3 new Preline-specific snippets per category
- 4 new categories added: `forms`, `ui-elements`, `cta`, `media` — each with 8-10 snippets
- Additional categories from Preline docs that fit generated websites (e.g., pricing, notifications, sidebars) — researcher identifies and adds
- Priority order for rewriting: high-impact first → hero, navbar, features, cards → then the rest

### Dark mode
- All snippets support dark mode via Tailwind `dark:` prefix
- Dark mode mechanism: `class="dark"` on `<html>` element (Tailwind standard)
- Toggle placement: GPT-4o decides based on layout (hint in system prompt)
- Dark background palette: `dark:bg-gray-900` (page), `dark:bg-gray-800` (cards), `dark:bg-gray-700` (hover/nested)
- Text in dark: `dark:text-white` / `dark:text-gray-300` / `dark:text-gray-400`
- LocalStorage persistence: save user's dark mode preference in generated sites
- Default: light mode on first load

### Interactive JS strategy
- Existing 6 interactive snippets (quiz, flashcard, timer, calculator, progress tracker, hero-dashboard):
  - Rewrite CSS classes (DaisyUI → Tailwind utilities)
  - Add Preline `data-hs-*` patterns where applicable
  - Preserve ALL existing JS functionality — no feature loss
  - Can add new functionality on top if Preline enables it
- New interactive snippets to add: Before/After image slider, Typing animation hero, Multi-step stepper/wizard, Count-up animation on scroll, plus any other Preline interactive patterns
- External CDN libraries: allowed as needed (Chart.js CDN for charts, GSAP for animations, etc.)
- Chart in hero-dashboard: Claude decides which is optimal/beautiful (recommendation: Chart.js via CDN for rich interactivity)
- Preline plugins to use: HSStaticMethods (core), HSAccordion, HSDropdown, HSOverlay/HSModal — researcher confirms full list from PRELINE-UI.md

### html-prompts.ts system prompt
- `buildSystemPrompt()`: full rewrite — delete all DaisyUI references
- CDN setup (replacing DaisyUI CDN):
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/preline/dist/preline.js"></script>
  ```
- System prompt language: English (better GPT-4o performance for technical tasks)
- Preline guidance depth: full — explain `data-hs-*` attributes, `hs-*` state classes, CDN setup, dark mode toggle pattern
- Explicit instruction: "Use Tailwind utility classes for styling, Preline `data-hs-*` for interactive behaviors, `dark:` prefix for dark mode"
- Add accessibility hints: aria-label, role attributes, semantic HTML5 tags (Preline uses these natively)
- Colors: always follow DesignResult palette (FALLBACK_DESIGN handles missing DesignResult case)
- Typography: follow DesignResult font via `buildGoogleFontsImport()` — no hardcoded font in snippets
- Researcher to check Context7 for Preline documentation (`mcp__context7__resolve-library-id` with "preline")

### Color system
- Snippets use placeholder Tailwind colors (blue-600/indigo-600 as primary, gray-900 for text, white for backgrounds)
- System prompt instructs GPT-4o to replace placeholder colors with DesignResult palette during generation
- No semantic token colors (bg-primary, bg-layer, etc.) — these require npm build step, not CDN-compatible

### Typography
- Snippets do NOT hardcode Google Fonts CDN links
- Font is injected via `buildGoogleFontsImport()` from DesignResult (already built in Phase 10)
- Snippets use `font-sans` as default class (resolved to actual font by parent HTML)

### Snippet HTML comments / AI hints
- No HTML comments in snippets guiding GPT-4o
- All AI guidance lives in `buildSystemPrompt()` and `buildUserMessage()`
- Keeps snippets clean and token-efficient

### Testing
- `component-library.test.ts` (57 tests): remove any assertions that hardcode DaisyUI class names
- Behavior-level tests (selectComponents, fallback logic, tag scoring) remain unchanged
- No new Preline class assertions added — snippets can change without breaking tests
- Build pass + typecheck must pass after migration

### Claude's Discretion
- Exact choice of chart library for hero-dashboard (Chart.js recommended)
- Which specific Preline patterns to use for accordion/modal/tabs within snippets
- Exact count of snippets per category (target 8-10 for new, 2-3 expansion for old)
- Which additional categories from Preline docs to add (beyond the 4 specified)
- Dark mode toggle button exact implementation in navbar snippets

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Preline UI documentation
- `.planning/research/PRELINE-UI.md` — Comprehensive Preline reference: 26+ components, CDN setup, `data-hs-*` attribute patterns, `hs-*` state classes, dark mode, theming. PRIMARY reference for all snippet rewrites.

### Existing snippet library
- `src/lib/component-library/snippets/` — All 11 snippet files to be rewritten
- `src/lib/component-library/types.ts` — `ComponentSnippet` type definition
- `src/lib/component-library/index.ts` — `selectComponents()` function (must not break)
- `src/lib/component-library/component-library.test.ts` — 57 tests to preserve

### AI pipeline integration
- `src/lib/html-prompts.ts` — `buildSystemPrompt()`, `buildUserMessage()`, `buildGoogleFontsImport()` — full rewrite of buildSystemPrompt needed
- `src/lib/ai-pipeline/analyzer.ts` — Tag vocabulary used by selectComponents (do not change tags)

### Prior phase context
- `.planning/phases/10-design-agent-context-builder-prompt-rewrite/` — DesignResult schema, buildGoogleFontsImport, FALLBACK_DESIGN decisions
- `.planning/phases/11-reviewer-pipeline-rewire-ui-update/` — Pipeline rewire, buildSystemPrompt zero-param invariant decision

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ComponentSnippet` type in `types.ts`: fields `id`, `name`, `description`, `category`, `tags`, `priority`, `domain_hints`, `min_score`, `fallback`, `fallback_for`, `html` — all snippets must conform
- `selectComponents()` in `index.ts`: tag-based scoring + fallback logic — no changes needed to selector
- `buildGoogleFontsImport()` already handles font injection from DesignResult — snippets don't need font CDN
- `FALLBACK_DESIGN` in design-agent.ts ensures DesignResult always available

### Established Patterns
- `buildSystemPrompt()` is zero-parameter invariant (enables OpenAI prompt caching) — MUST remain zero-parameter after rewrite
- Snippets are pure HTML strings — no JS imports, no TypeScript logic, just HTML/CSS/JS inline
- Interactive snippets have inline `<script>` tags with vanilla JS
- Tag vocabulary (`sections`/`features` only) is used by analyzer → selectComponents chain — do not add new tag vocabulary without updating analyzer

### Integration Points
- `selectComponents(tags: string[])` → returns `ComponentSnippet[]` → injected into `buildUserMessage()` as snippet HTML
- `buildSystemPrompt()` → injected as OpenAI system message (cached after first call)
- html-prompts.ts CDN links appear in `buildSystemPrompt()` as the HTML document setup instructions

</code_context>

<specifics>
## Specific Ideas

- Preline patterns researcher found: export compatibility — HTML files with CDN links work standalone, so any future "export as ZIP" feature will work automatically with Preline CDN approach
- Dark mode toggle: GPT-4o should place it in navbar for most layouts, but system prompt gives it discretion
- "Lấy tất cả" philosophy for snippets: include every relevant Preline pattern that could appear in a portfolio/blog/landing page/business site. Better to have too many than too few — selectComponents handles filtering.

</specifics>

<deferred>
## Deferred Ideas

- **Export as ZIP** — User asked if Preline plugins work with export. Answer: yes (CDN links work standalone). Export feature itself is a separate future phase.
- **Preline skill/plugin for agents** — User mentioned possibility of a Preline skill for Claude agents. Researcher should check Context7 (`mcp__context7__resolve-library-id` with "preline") — if available, use in research phase. Not a blocker for this phase.

</deferred>

---

*Phase: 12-migrate-snippet-library-from-daisyui-to-preline-ui*
*Context gathered: 2026-03-21*
