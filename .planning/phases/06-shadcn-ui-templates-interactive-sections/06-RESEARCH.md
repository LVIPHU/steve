# Phase 6: shadcn-ui Templates Interactive Sections — Research

**Researched:** 2026-03-18
**Domain:** React interactive components, shadcn/ui, Framer Motion, Next.js SSR hydration, dark mode, AI prompt extension
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**New Section Types**
- Add to `SectionType`: `"steps"` | `"quiz"` | `"flashcard"` | `"goals"` | `"ingredients"`
- Each type has its own schema in `WebsiteAST` (extend `website-ast.ts`)
- Section types are locked per template:
  - `cooking` template: `ingredients` + `steps` sections
  - `learning` template: `goals` + `flashcard` + `quiz` sections
  - Other templates cannot generate these section types
- AI prompts updated to know which section types to generate per template
- Default section order per template:
  - `cooking`: Hero → Ingredients → Steps → CTA
  - `learning`: Hero → Goals → Content → Flashcard → Quiz

**Interactive Section Behavior**
- Goals: Checkbox checklist, progress bar showing % complete
- Quiz: Multiple choice (4 options, 1 correct). After completion: score X/Y + correct/wrong answer review + retry button
- Flashcard: Flip card animation — click to flip (front: term/concept, back: definition/answer). Prev/Next buttons
- Steps: Numbered checklist, each step has description + optional image upload
- Ingredients: Ingredient list + quantity, checkable when preparing

**Progress Persistence**
- Use `localStorage` to save progress (goals ticks, quiz answers)
- Key by website slug to avoid conflicts between pages
- No server-side storage — reset if browser data cleared

**SSR + Hydration**
- Interactive sections use lazy hydration: SSR renders static version, client-side React hydrates to add interactivity
- Good for SEO — content still indexed
- Do NOT use `dynamic import` with `ssr: false` for interactive sections

**Animation**
- Use Framer Motion (`motion` package — already installed) for:
  - Flip card animation (flashcard)
  - Step transition
  - Quiz answer reveal
  - Goals progress bar fill

**Editor Extensions**
- Editor sidebar has edit forms for all new interactive section types
- Add "Thêm section" button in editor — user picks section type, AI generates content for that section
- New section types appear in add-section picker (only shows types compatible with current template)

**Template Visual Identity**
- Each template has distinct visual identity (not just different fonts — different layout, spacing, color treatment)
- Claude decides style appropriate to each template's domain
- Each template has its own default section order (see above)
- Templates support dark mode (system preference + user toggle)
- Light mode is default, dark mode opt-in

**shadcn/ui Components**
- Install all needed shadcn/ui components:
  - `progress` — goals checklist progress bar
  - `accordion` — expandable content/FAQ
  - `carousel` — flashcard navigation fallback
  - `toggle` / `switch` — dark mode toggle
  - `checkbox` — goals ticks, ingredients ticks, steps ticks
  - `radio-group` — quiz answer selection (4 choices)
- shadcn components used on both public page and dashboard/editor

### Claude's Discretion
- Specific style of each template (colors, typography, spacing)
- Carousel vs custom Framer Motion for flashcard navigation
- Number of additional shadcn components if needed
- Dark mode implementation approach (CSS variables vs class toggle)

### Deferred Ideas (OUT OF SCOPE)
- No deferred items — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

Derived from CONTEXT.md and UI-SPEC.md (no explicit IDs yet in REQUIREMENTS.md — these are Phase 6 additions):

| ID | Description | Research Support |
|----|-------------|-----------------|
| P6-01 | Extend `SectionType` union with 5 new types: steps, quiz, flashcard, goals, ingredients | TypeScript discriminated union pattern already established in codebase |
| P6-02 | Add content interfaces for each new section type in `website-ast.ts` | Existing interface pattern (HeroContent etc.) is the model |
| P6-03 | Update `VALID_SECTION_TYPES` and `parseAndValidateAST` to accept new types | Current validation loop checks against array — update array and add per-type content shape checks |
| P6-04 | Create 5 new section components (GoalsSection, QuizSection, FlashcardSection, StepsSection, IngredientsSection) | Hero section component is the established pattern |
| P6-05 | Update `SectionRenderer` to dispatch new section types | Switch statement already handles all existing types |
| P6-06 | Update `SectionEditForm` to render edit fields for all 5 new section types | Existing per-type if-block pattern is the model |
| P6-07 | Update AI prompts (TEMPLATE_PRESETS, buildSystemPrompt) for new default section orderings and new type schemas | TEMPLATE_PRESETS and section schema docs already in ai-prompts.ts |
| P6-08 | Add "Thêm section" flow in SectionsTab: Dialog picker + POST /api/ai/regenerate-section + Skeleton loading | regenerate-section API already exists; needs new API route or reuse |
| P6-09 | Dark mode toggle in public template pages: script in head + localStorage + `dark` class on `<html>` | SSR anti-flicker inline script pattern is well-established |
| P6-10 | Redesign all 5 template layouts with distinct visual identities per UI-SPEC | Layouts currently thin wrappers — need full redesign |
| P6-11 | Install new shadcn components: progress, accordion, carousel, toggle, switch, checkbox, radio-group | shadcn CLI install, components.json already configured |
| P6-12 | Interactive state persistence via localStorage keyed by slug | Standard browser API, no library needed |
| P6-13 | Add `TEMPLATE_SECTION_TYPES` map (template → allowed section types) for add-section picker filter | New constant in templates.ts or ai-prompts.ts |
| P6-14 | Update `section-list-item.tsx` SECTION_TYPE_LABELS for 5 new types | Simple object extension |
</phase_requirements>

---

## Summary

Phase 6 is the largest visual and functionality upgrade in the project. It has three distinct work streams that must be sequenced carefully: (1) schema + validation extension, (2) interactive section component creation with client-side state, and (3) template visual redesign.

The existing codebase provides strong scaffolding. The AST/section/layout system is well-structured with clear extension points. The section component pattern (receive `section` + `theme` props, use `resolveField`) is established and consistent. The editor's `SectionEditForm` already handles 6 types via if-blocks — extending to 11 types follows the same pattern.

The main new complexity is interactive state management on public pages. The decision to use SSR + client hydration (rather than `ssr: false` dynamic imports) means interactive components render static markup on the server and hydrate on the client. This requires careful use of `useEffect` to read `localStorage` after mount — never during render — to avoid hydration mismatches.

**Primary recommendation:** Sequence as three waves: Wave A = schema/types/AI prompts + shadcn installs; Wave B = interactive section components + SectionRenderer + editor forms; Wave C = template visual redesigns + dark mode + add-section editor flow.

---

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App Router SSR/hydration | Project stack |
| React | 19.2.3 | UI components | Project stack |
| Tailwind CSS | v4 | Utility styling | Project stack |
| `motion` (Framer Motion) | 12.36.0 | Animations (flashcard flip, progress reveals) | Already in stack, locked decision |
| shadcn/ui | new-york/neutral/cssVariables | Component library | Already initialized, components.json present |
| lucide-react | 0.577.0 | Icons | Already in stack via shadcn |

### New shadcn Components to Install
| Component | Purpose | Install Command |
|-----------|---------|----------------|
| `progress` | Goals checklist progress bar (shadcn wraps Radix) | `npx shadcn@latest add progress` |
| `accordion` | Expandable content/FAQ sections | `npx shadcn@latest add accordion` |
| `carousel` | Flashcard navigation fallback | `npx shadcn@latest add carousel` |
| `toggle` | Dark mode toggle button | `npx shadcn@latest add toggle` |
| `switch` | Dark mode preference switch (alt to toggle) | `npx shadcn@latest add switch` |
| `checkbox` | Goals/ingredients/steps tick boxes | `npx shadcn@latest add checkbox` |
| `radio-group` | Quiz answer selection | `npx shadcn@latest add radio-group` |

**Installation (all at once):**
```bash
npx shadcn@latest add progress accordion carousel toggle switch checkbox radio-group
```

### What Is Already Present (Do Not Reinstall)
`button`, `input`, `card`, `label`, `tabs`, `separator`, `badge`, `dialog`, `skeleton`, `sonner`

### Supporting Libraries (No New Installs Needed)
| Library | Version | Purpose |
|---------|---------|---------|
| `next-themes` | 0.4.6 | Already in package.json — can be used for dark mode OR use manual class-toggle approach |
| `dnd-kit` | 6.3.1 | Already used for section reorder — no changes needed |

**Note on `next-themes`:** The package is already installed (`next-themes: ^0.4.6` in package.json). However, the UI-SPEC requires the `dark` class approach on `<html>` with an anti-flicker inline script in `<head>`. `next-themes` provides this exact pattern (it adds the `dark` class to `html` element and runs a blocking script to prevent FOUC). Using `next-themes` `ThemeProvider` is the recommended approach and avoids hand-rolling the anti-flicker script.

---

## Architecture Patterns

### Recommended File Structure for New Work

```
src/
├── types/
│   └── website-ast.ts           # Add 5 new content interfaces + expand SectionType union
├── lib/
│   ├── ast-utils.ts             # Update VALID_SECTION_TYPES, parseAndValidateAST
│   ├── ast-utils.test.ts        # Add tests for new types
│   ├── ai-prompts.ts            # Update TEMPLATE_PRESETS, buildSystemPrompt schema docs
│   ├── ai-prompts.test.ts       # Add tests for new template presets
│   └── templates.ts             # Add TEMPLATE_ALLOWED_SECTIONS map
├── components/
│   ├── sections/
│   │   ├── goals-section.tsx      # New: "use client" for interactivity
│   │   ├── quiz-section.tsx       # New: "use client"
│   │   ├── flashcard-section.tsx  # New: "use client" + Framer Motion
│   │   ├── steps-section.tsx      # New: "use client" (checkbox state)
│   │   ├── ingredients-section.tsx # New: "use client" (checkbox state)
│   │   └── index.tsx              # Update SectionRenderer switch
│   ├── layouts/
│   │   ├── blog-layout.tsx        # Redesign: single col, serif, editorial
│   │   ├── portfolio-layout.tsx   # Redesign: full-bleed, dark hero, 3-col features
│   │   ├── fitness-layout.tsx     # Redesign: Oswald, red accent, edge-to-edge
│   │   ├── cooking-layout.tsx     # Redesign: warm off-white, recipe card aesthetic
│   │   ├── learning-layout.tsx    # Redesign: app-like, card-based, violet accent
│   │   └── index.tsx              # No change needed (TemplateRenderer switch unchanged)
│   └── ui/
│       ├── progress.tsx           # New shadcn install
│       ├── accordion.tsx          # New shadcn install
│       ├── carousel.tsx           # New shadcn install
│       ├── toggle.tsx             # New shadcn install
│       ├── switch.tsx             # New shadcn install
│       ├── checkbox.tsx           # New shadcn install
│       └── radio-group.tsx        # New shadcn install
├── app/
│   ├── (public)/[username]/[slug]/page.tsx  # Add dark mode anti-flicker script
│   └── (dashboard)/dashboard/websites/[id]/edit/
│       └── components/
│           ├── section-edit-form.tsx  # Add 5 new section type forms
│           ├── section-list-item.tsx  # Add 5 new labels to SECTION_TYPE_LABELS
│           └── sections-tab.tsx       # Add "Thêm section" button + Dialog picker
```

### Pattern 1: Interactive Section Component with SSR + Hydration

**What:** Server renders static markup (counts, labels), client hydrates to enable interactivity + restore `localStorage` state.

**When to use:** All 5 new interactive section types.

**Critical rule:** Never read `localStorage` during render. Only read in `useEffect` after mount. Otherwise React 19 SSR will throw hydration mismatch errors.

**Example (GoalsSection):**
```typescript
// src/components/sections/goals-section.tsx
"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { resolveField } from "@/lib/ast-utils";
import type { Section, WebsiteTheme, GoalsContent } from "@/types/website-ast";

interface GoalsSectionProps {
  section: Section;
  theme: WebsiteTheme;
}

export function GoalsSection({ section, theme }: GoalsSectionProps) {
  const title = resolveField<string>(section, "title");
  const items = resolveField<GoalsContent["items"]>(section, "items") ?? [];
  const storageKey = `goals-${section.id}`;

  // SSR: start unchecked (matches server render)
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const [mounted, setMounted] = useState(false);

  // After mount: restore localStorage state
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [storageKey]);

  function handleToggle(idx: number) {
    const next = checked.map((v, i) => (i === idx ? !v : v));
    setChecked(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const completedCount = checked.filter(Boolean).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <section className="py-12 px-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Progress value={progress} className="mb-4 h-2" />
      <p className="text-sm text-muted-foreground mb-4">
        Hoàn thành {completedCount} / {items.length} mục tiêu
      </p>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 py-2">
          <Checkbox
            checked={mounted ? checked[idx] : false}
            onCheckedChange={() => handleToggle(idx)}
          />
          <span className={checked[idx] ? "line-through opacity-60" : ""}>{item.label}</span>
        </div>
      ))}
    </section>
  );
}
```
Source: Pattern derived from Next.js 15/16 RSC hydration documentation + React 19 `useEffect` after-mount pattern.

### Pattern 2: Flashcard Flip with Framer Motion 3D

**What:** `rotateY` 0→180 animation with `backfaceVisibility: "hidden"` on both faces.

**Example:**
```typescript
// src/components/sections/flashcard-section.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Card face with backface hidden
function CardFace({ children, flipped }: { children: React.ReactNode; flipped: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-6 rounded-xl"
      style={{ backfaceVisibility: "hidden" }}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
```
Source: Framer Motion `motion` package docs — `rotateY`, `backfaceVisibility`, `AnimatePresence`.

**IMPORTANT:** The package is `motion` (not `framer-motion`). Import from `"motion/react"`, not `"framer-motion"`.

### Pattern 3: Dark Mode Anti-Flicker Script

**What:** Inline blocking script in `<head>` reads `localStorage` before React hydration to set `dark` class on `<html>` without flash of unstyled content (FOUC).

**When to use:** Public template pages — the `(public)/[username]/[slug]/page.tsx`.

**Option A — `next-themes` (recommended, already installed):**
```typescript
// src/app/(public)/layout.tsx (already exists as a thin layout)
import { ThemeProvider } from "next-themes";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```
`next-themes` handles: inline script injection, localStorage key `"theme"`, system preference detection, `dark` class on `<html>`.

**Option B — Manual inline script (if not using next-themes ThemeProvider):**
```html
<!-- Blocking inline script placed in <head>, before CSS loads -->
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){try{var t=localStorage.getItem('theme-preference');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
  }}
/>
```
Source: `rendering-hydration-no-flicker` rule from vercel-react-best-practices skill.

**Decision for implementer:** The UI-SPEC uses key `"theme-preference"`, while `next-themes` defaults to key `"theme"`. If using `next-themes`, pass `storageKey="theme-preference"` to `ThemeProvider` to match the UI-SPEC contract.

### Pattern 4: Add-Section API Route (New Endpoint)

**What:** The add-section flow needs to call AI to generate content for a chosen section type. The existing `POST /api/ai/regenerate-section` can be reused, but it requires a `websiteId` for ownership check. The add-section flow calls the same endpoint.

**Flow:**
1. User clicks "Thêm section" → Dialog opens showing allowed types for current `templateId`
2. User picks a type → POST to `/api/ai/regenerate-section` with the new `sectionType`
3. While pending: insert a placeholder section with `Skeleton` in the list
4. On success: prepend/append real section with `ai_content` from response
5. New section gets a generated `id` (e.g., `"goals-${Date.now()}"`)

**Template-to-allowed-types map (new constant in `templates.ts`):**
```typescript
export const TEMPLATE_ALLOWED_SECTIONS: Record<TemplateId, SectionType[]> = {
  blog:       ["hero", "about", "content", "features", "gallery", "cta"],
  portfolio:  ["hero", "about", "content", "features", "gallery", "cta"],
  fitness:    ["hero", "about", "content", "features", "gallery", "cta"],
  cooking:    ["hero", "content", "gallery", "cta", "ingredients", "steps"],
  learning:   ["hero", "about", "content", "features", "cta", "goals", "flashcard", "quiz"],
};
```

### Pattern 5: Section Type Union Extension

**What:** TypeScript discriminated union via type union expansion + per-type content interfaces.

**Concrete changes needed in `website-ast.ts`:**

```typescript
// Extend SectionType union
export type SectionType =
  | "hero" | "about" | "features" | "content" | "gallery" | "cta"
  | "steps" | "quiz" | "flashcard" | "goals" | "ingredients";

// New interfaces
export interface StepsContent {
  title: string;
  items: Array<{ label: string; description: string; imageUrl?: string }>;
}

export interface IngredientsContent {
  title: string;
  items: Array<{ name: string; quantity: string }>;
}

export interface GoalsContent {
  title: string;
  items: Array<{ label: string }>;
}

export interface FlashcardContent {
  title: string;
  cards: Array<{ front: string; back: string }>;
}

export interface QuizContent {
  title: string;
  questions: Array<{
    question: string;
    choices: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
  }>;
}

// Extend SectionContent union
export type SectionContent =
  | HeroContent | AboutContent | FeaturesContent | ContentContent
  | GalleryContent | CtaContent
  | StepsContent | IngredientsContent | GoalsContent | FlashcardContent | QuizContent;
```

### Anti-Patterns to Avoid

- **Reading `localStorage` during render:** Always use `useEffect` after mount. Server and client will render different values, causing React 19 hydration error.
- **`dynamic import` with `ssr: false` for interactive sections:** Locked decision — use lazy hydration pattern instead (SSR renders static, client hydrates).
- **Inline components defined inside parent components:** The `rerender-no-inline-components` rule is repeatedly enforced in this codebase. All sub-components (e.g., `QuizChoice`, `FlashcardCard`) must be defined at module scope.
- **Using `framer-motion` import path:** The installed package is `motion` v12. Import as `import { motion } from "motion/react"` — not `"framer-motion"`.
- **Importing directly from barrel `@/components/sections` in interactive components:** Use direct imports for new interactive sections to avoid bundle bloat (bundle-barrel-imports rule).
- **Using `window.confirm` for destructive actions:** The codebase already migrated to shadcn Dialog — keep that pattern.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Progress bar | Custom div with % width | shadcn `Progress` (Radix UI) | Accessibility (ARIA progressbar role), animatable via CSS |
| Checkbox input | `<input type="checkbox">` with custom styles | shadcn `Checkbox` (Radix UI) | Keyboard nav, screen readers, consistent shadcn style |
| Radio group | `<input type="radio">` with custom layout | shadcn `RadioGroup` (Radix UI) | Proper ARIA roles, keyboard navigation across choices |
| Dark mode class toggle + FOUC prevention | Hand-written inline script + event listener | `next-themes` (already installed) | FOUC prevention, SSR-safe, localStorage key management |
| Accordion expand/collapse | useState show/hide with `<details>` | shadcn `Accordion` (Radix UI) | Animation, keyboard nav, ARIA expand/collapse semantics |
| Carousel navigation | Custom index state + button layout | shadcn `Carousel` or Framer Motion custom (Claude's discretion) | shadcn Carousel wraps Embla and handles touch/keyboard |
| 3D card flip animation | CSS `transform: rotateY` with manual timing | `motion` package `rotateY` + `backfaceVisibility` | GPU-accelerated, spring easing, safe in React 19 |

**Key insight:** This project already uses Radix UI via shadcn. The shadcn components are thin wrappers — their real value is accessibility (ARIA) and keyboard interaction that is hard to get right from scratch.

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch on Interactive Sections
**What goes wrong:** Component reads `localStorage` during render. Server renders `false` (no localStorage), client renders `true` (has saved state). React 19 throws hydration error or shows flicker.
**Why it happens:** Developers assume `localStorage` is always available, forgetting SSR context.
**How to avoid:** Always use `useEffect` + `setMounted(true)` pattern. Render the "unchecked/unflipped/default" state on both server and initial client render, apply saved state only after `useEffect` fires.
**Warning signs:** React console error "Hydration failed because the initial UI does not match what was rendered on the server".

### Pitfall 2: Dark Mode Flash of Unstyled Content (FOUC)
**What goes wrong:** Page renders in light mode for ~100ms, then jumps to dark mode after React hydrates and reads `localStorage`.
**Why it happens:** JavaScript runs after CSS — the `dark` class is applied too late.
**How to avoid:** Use `next-themes` `ThemeProvider` (which injects a blocking inline script) OR manually add a `<script dangerouslySetInnerHTML>` in `<head>` that runs synchronously before any CSS paints.
**Warning signs:** Visible flash/flicker on page load for users with dark mode preference.

### Pitfall 3: `motion` vs `framer-motion` Import Path
**What goes wrong:** Importing from `"framer-motion"` when the package installed is `motion` v12.
**Why it happens:** Framer Motion rebranded as `motion`. The npm package name changed.
**How to avoid:** Always import as `import { motion, AnimatePresence } from "motion/react"`. Confirmed from `package.json`: `"motion": "^12.36.0"`.
**Warning signs:** Module not found error for `"framer-motion"`.

### Pitfall 4: TypeScript Error on Exhaustive `SectionType` Switch
**What goes wrong:** Adding new section types to the union but forgetting to add cases in `SectionRenderer`, `SectionEditForm`, or `SECTION_TYPE_LABELS` — TypeScript will complain about missing cases if exhaustive checking is used, or silently render `null` if not.
**Why it happens:** Multiple files dispatch on `SectionType` and they are not co-located.
**How to avoid:** After updating `SectionType` in `website-ast.ts`, do a global search for all switch/if statements dispatching on section type. File list: `sections/index.tsx`, `section-edit-form.tsx`, `section-list-item.tsx`, `ast-utils.ts` (VALID_SECTION_TYPES array).

### Pitfall 5: AI Prompt Rejects New Section Types in `parseAndValidateAST`
**What goes wrong:** AI generates a section with type `"goals"` but `VALID_SECTION_TYPES` in `ast-utils.ts` doesn't include it yet. Generation works, but `parseAndValidateAST` throws and the website never saves.
**Why it happens:** `VALID_SECTION_TYPES` is a static array that must be kept in sync with the TypeScript union.
**How to avoid:** Update `VALID_SECTION_TYPES` in the same commit that extends `SectionType`. Add a test that each type in `SectionType` is present in `VALID_SECTION_TYPES`.

### Pitfall 6: Quiz `correctIndex` Exposed in Public HTML
**What goes wrong:** The `correctIndex` field in `QuizContent` is rendered directly in the page HTML, making it trivial for users to cheat by reading the source.
**Why it happens:** The entire `ai_content` is rendered — including fields only needed post-submit.
**How to avoid:** This is an acceptable trade-off given the use case (personal learning notes, not exam security). Document it as a known limitation. Do not add complex server-side answer validation — it's out of scope.

### Pitfall 7: Tailwind v4 `@custom-variant dark` Already Defined
**What goes wrong:** Attempting to define dark mode via `darkMode: "class"` in a Tailwind config — but this project uses Tailwind v4, which has no config file.
**Why it happens:** Tailwind v4 moves configuration into CSS. Dark mode is already configured in `globals.css` via `@custom-variant dark (&:is(.dark *))`.
**How to avoid:** Do not create a `tailwind.config.js`. The `.dark` class must be on the `<html>` element for dark mode to apply — this is already the pattern configured.

### Pitfall 8: shadcn Component Adds Its Own CSS Variables
**What goes wrong:** Installing new shadcn components (`accordion`, `carousel`) that require additional CSS custom properties not yet in `globals.css`.
**Why it happens:** Some shadcn components (particularly carousel via Embla) inject their own CSS. The `npx shadcn add` command typically handles this automatically.
**How to avoid:** After running `npx shadcn@latest add ...`, check `globals.css` to confirm any additions were applied correctly. Run `npm run build` to catch CSS issues.

---

## Code Examples

### New Section Type Interfaces Pattern
```typescript
// Source: extending existing pattern in src/types/website-ast.ts

export interface GoalsContent {
  title: string;
  items: Array<{ label: string }>;
}

export interface QuizContent {
  title: string;
  questions: Array<{
    question: string;
    choices: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
  }>;
}

export interface FlashcardContent {
  title: string;
  cards: Array<{ front: string; back: string }>;
}

export interface StepsContent {
  title: string;
  items: Array<{ label: string; description: string; imageUrl?: string }>;
}

export interface IngredientsContent {
  title: string;
  items: Array<{ name: string; quantity: string }>;
}
```

### Updating VALID_SECTION_TYPES and parseAndValidateAST
```typescript
// Source: extending src/lib/ast-utils.ts
export const VALID_SECTION_TYPES: SectionType[] = [
  "hero", "about", "features", "content", "gallery", "cta",
  "steps", "quiz", "flashcard", "goals", "ingredients",
];
// The validation loop in parseAndValidateAST already uses this array
// No structural change needed — adding to the array is sufficient
```

### AI Prompt Extension Pattern
```typescript
// Source: extending src/lib/ai-prompts.ts

export const TEMPLATE_PRESETS: Record<string, string[]> = {
  blog: ["hero", "content", "cta"],
  portfolio: ["hero", "about", "features", "cta"],
  fitness: ["hero", "features", "content", "cta"],
  cooking: ["hero", "ingredients", "steps", "cta"],   // UPDATED
  learning: ["hero", "goals", "content", "flashcard", "quiz"],  // UPDATED
};

// buildSystemPrompt must also document new section schemas in the prompt
// Add to the ## Section Types list:
// - "goals": { "title": string, "items": [{ "label": string }] }
// - "quiz": { "title": string, "questions": [{ "question": string, "choices": [string,string,string,string], "correctIndex": 0|1|2|3 }] }
// - "flashcard": { "title": string, "cards": [{ "front": string, "back": string }] }
// - "steps": { "title": string, "items": [{ "label": string, "description": string }] }
// - "ingredients": { "title": string, "items": [{ "name": string, "quantity": string }] }
```

### Framer Motion Flashcard 3D Flip
```typescript
// Source: motion v12 docs (motion/react)
"use client";
import { useState } from "react";
import { motion } from "motion/react";

// perspective must be set on parent for 3D effect
// Both front and back absolutely positioned, one rotated 180deg baseline
<div style={{ perspective: "1000px" }} className="relative h-[280px]">
  {/* Front face */}
  <motion.div
    className="absolute inset-0 rounded-xl bg-card border flex items-center justify-center"
    style={{ backfaceVisibility: "hidden" }}
    animate={{ rotateY: isFlipped ? 180 : 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    <p>{cards[index].front}</p>
  </motion.div>
  {/* Back face — starts at 180deg, flips to 0deg when activated */}
  <motion.div
    className="absolute inset-0 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
    style={{ backfaceVisibility: "hidden" }}
    animate={{ rotateY: isFlipped ? 0 : -180 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    <p>{cards[index].back}</p>
  </motion.div>
</div>
```

### Dark Mode Toggle with next-themes
```typescript
// Source: next-themes 0.4.x docs
"use client";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Toggle
      pressed={theme === "dark"}
      onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
      aria-label="Chế độ tối"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Toggle>
  );
}
```

### Add-Section Dialog in SectionsTab
```typescript
// Source: extending existing Dialog pattern in editor-client.tsx
"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TEMPLATE_ALLOWED_SECTIONS } from "@/lib/templates";
import type { SectionType } from "@/types/website-ast";

// In SectionsTab: button at bottom triggers Dialog
// On type selection: call regenerate-section API, show Skeleton, insert result
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package (v12) | 2024 rebranding | Import path is `"motion/react"` not `"framer-motion"` |
| Tailwind `darkMode: "class"` config | `@custom-variant dark` in CSS | Tailwind v4 | No config file, CSS-driven |
| `ThemeProvider` from `@/providers` | `next-themes` ThemeProvider (if used) | Phase 6 addition | Must wrap public layout |
| Static section components (Server Components) | Interactive sections need `"use client"` | Phase 6 | Hydration pattern required |

**Deprecated/outdated:**
- `tailwind.config.js` for dark mode config: not used — project is Tailwind v4.
- `ssr: false` dynamic imports for interactive sections: locked decision — do not use.

---

## Open Questions

1. **`next-themes` ThemeProvider placement for public pages**
   - What we know: `next-themes` ThemeProvider must wrap the component tree. The `(public)/layout.tsx` is the right place. But it currently just returns `{children}` with no wrapper.
   - What's unclear: Adding `ThemeProvider` to the public layout will add `"use client"` to that layout file. This is fine in Next.js (layouts can be Client Components), but it prevents RSC optimizations in children that don't need it. However, the interactive sections are already `"use client"` anyway.
   - Recommendation: Add `ThemeProvider` to `(public)/layout.tsx` with `storageKey="theme-preference"` to match UI-SPEC. Alternative: hand-roll the inline script if bundle concern arises — but `next-themes` is already installed so use it.

2. **Flashcard navigation: shadcn Carousel vs custom Framer Motion**
   - What we know: This is explicitly Claude's discretion. UI-SPEC documents "Trước / Tiếp theo" button navigation with index display "3 / 8".
   - What's unclear: shadcn Carousel (Embla-based) handles touch swipe natively; custom Framer Motion gives tighter control over the flip animation integration.
   - Recommendation: Use custom Framer Motion + simple `useState` index navigation. The flip animation already uses Framer Motion — keeping navigation logic in the same component reduces complexity. shadcn Carousel adds an `embla-carousel-react` dependency and is designed for image carousels, not cards with flip animations.

3. **`SectionRenderer` remains a Server Component but new sections need `"use client"`**
   - What we know: `SectionRenderer` is currently not `"use client"` (confirmed in source). It dispatches to individual section components.
   - What's unclear: Can `SectionRenderer` (Server Component) render Client Components like the new interactive sections?
   - Recommendation: YES — this is standard Next.js App Router behavior. Server Components can import and render Client Components. The `"use client"` directive in the individual section files creates the client boundary at the component level, not at the renderer level. `SectionRenderer` itself does not need `"use client"`. This is the correct pattern.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` (root level — exists) |
| Quick run command | `npm run test` |
| Full suite command | `npm run test` |
| Current test files | `src/lib/ast-utils.test.ts`, `src/lib/ai-prompts.test.ts`, `src/lib/editor-utils.test.ts`, `src/lib/sync-utils.test.ts` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| P6-01/02 | `SectionType` union includes all 5 new types | unit | `npm run test -- ast-utils` | ✅ (extend ast-utils.test.ts) |
| P6-03 | `parseAndValidateAST` accepts new section types | unit | `npm run test -- ast-utils` | ✅ (extend ast-utils.test.ts) |
| P6-03 | `parseAndValidateAST` rejects unknown types | unit | `npm run test -- ast-utils` | ✅ (extend existing "invalid type" test) |
| P6-07 | `TEMPLATE_PRESETS` for cooking/learning use new section types | unit | `npm run test -- ai-prompts` | ✅ (extend ai-prompts.test.ts) |
| P6-07 | `buildSystemPrompt` includes new section schemas in output | unit | `npm run test -- ai-prompts` | ✅ (extend ai-prompts.test.ts) |
| P6-13 | `TEMPLATE_ALLOWED_SECTIONS` maps correct types per template | unit | `npm run test -- templates` | ❌ Wave 0: create `src/lib/templates.test.ts` |
| P6-04/05 | Section components render without crashing (smoke) | unit/smoke | manual-only (no DOM test infra) | N/A — visual |
| P6-08 | Add-section flow (editor) | manual-only | UI interaction — not unit testable | N/A |
| P6-09 | Dark mode toggle + localStorage persistence | manual-only | Browser interaction | N/A |
| P6-10 | Template visual redesigns | manual-only | Visual review | N/A |

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test && npm run typecheck`
- **Phase gate:** Full suite green + `npm run typecheck` before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/templates.test.ts` — covers P6-13 (TEMPLATE_ALLOWED_SECTIONS correctness)

*(Other test files already exist and will be extended in-place)*

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection (`src/types/website-ast.ts`, `src/lib/ast-utils.ts`, `src/lib/ai-prompts.ts`, `src/lib/templates.ts`, `src/components/sections/`, `src/components/layouts/`, editor components) — full picture of integration points
- `package.json` — confirmed `motion: ^12.36.0`, `next-themes: ^0.4.6`, all dependency versions
- `components.json` — confirmed shadcn new-york/neutral/cssVariables preset
- `src/app/globals.css` — confirmed `@custom-variant dark (&:is(.dark *))` already defined, dark mode CSS variables present
- `.planning/phases/06-shadcn-ui-templates-interactive-sections/06-CONTEXT.md` — locked decisions
- `.planning/phases/06-shadcn-ui-templates-interactive-sections/06-UI-SPEC.md` — interaction contracts, visual identity, animation specs

### Secondary (MEDIUM confidence)
- `next-themes` package (0.4.6 installed) — behavior inferred from known API (`ThemeProvider`, `useTheme`, `storageKey` prop)
- Framer Motion / `motion` v12 — `rotateY` + `backfaceVisibility` pattern inferred from motion v12 API (package confirmed installed)
- shadcn new-york preset pattern — shadcn components follow consistent props API; Radix UI accessibility guarantees apply

### Tertiary (LOW confidence)
- None — all critical claims verified from codebase or installed packages

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages confirmed in package.json
- Architecture: HIGH — all integration points confirmed by reading source files
- Pitfalls: HIGH — most derived from actual codebase patterns and Next.js 19 hydration rules
- Interactive behavior specs: HIGH — fully documented in UI-SPEC.md

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable stack — Next.js, shadcn, motion — unlikely to break in 30 days)
