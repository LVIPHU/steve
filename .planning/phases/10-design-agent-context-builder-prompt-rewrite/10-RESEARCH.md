# Phase 10: Design Agent + Context Builder + Prompt Rewrite - Research

**Researched:** 2026-03-20 (updated)
**Domain:** OpenAI Structured Outputs (Zod), Prompt Engineering, CSS Variables, Google Fonts
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- DesignResult: 3 fields `{ preset, palette, fonts }` — no hero layout field
- `preset`: enum `'bold-dark' | 'warm-organic' | 'clean-minimal' | 'playful-bright' | 'professional-blue'`
- `palette`: 4 hex fields — `{ primary, secondary, accent, bg }` — AI decides exact values
- `fonts`: 2 Google Fonts — `{ heading, body }` — AI returns font name (e.g. "Montserrat", "Inter")
- Design Agent uses `gpt-4o-mini` + `zodResponseFormat` (NOT `json_object`)
- Zod v3 (`^3.24.x`) must be added as direct dep — NOT Zod v4 (per CONTEXT.md mandate)
- Domain mapping: Design Agent detects fitness/food/learning/SaaS sub-domains from full prompt + `AnalysisResult.type` — no hardcoded lookup table
- Fallback on Design Agent failure: `clean-minimal` preset + neutral colors
- System prompt: rules-only + CSS rules (~1000-1100 tokens), static/cacheable — invariant
- Template structure hints (LANDING PAGE, PORTFOLIO...) move to user message
- `buildUserMessage()`: Markdown sections (Design Brief, Component References, Page Structure, User Request)
- Edit mode: no Design Brief / Components; add preserve instruction at top
- Component snippets: raw HTML wrapped in `<!-- {id}: {description} -->` ... `<!-- end {id} -->` comments
- Google Fonts @import: built by `context-builder.ts` from font name; placed in Design Brief
- CSS variables: injected by AI via Design Brief (no post-processing)
- `refineHtml()`: export full signature + `throw new Error('Not implemented — Phase 11')`
- Design SSE detail: `"bold-dark · #E63946 · Montserrat"`
- Phase 10 creates: `design-agent.ts`, `context-builder.ts`, rewrites `html-prompts.ts`
- Phase 10 does NOT rewire orchestrator (index.ts) — that is Phase 11
- `researcher.ts` is NOT deleted in Phase 10 — Phase 11 deletes it

### Claude's Discretion
- Exact system prompt wording (must include all rules + CSS)
- Zod schema structure for DesignAgent (field ordering, descriptions)
- Google Fonts URL parameter format (weights, italic variants)
- Timeout value for Design Agent call

### Deferred Ideas (OUT OF SCOPE)
- User-visible style selector (allow user to override preset)
- Design Agent in edit mode (extract colors from existing HTML)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PIPE-04 | Design Agent (gpt-4o-mini + Zod Structured Output) returns palette hex, typography Google Fonts, style preset | `zodResponseFormat` + `chat.completions.parse()` API verified in `node_modules/openai/helpers/zod.js` |
| PIPE-05 | Design Agent maps domain → style preset (SaaS → bold-dark, food → warm-organic, etc.) | AI-driven detection using full prompt + `AnalysisResult.type`; no hardcoded table |
| PIPE-06 | CSS variables `--color-primary`, `--color-secondary`, `--color-accent`, `--color-bg` in HTML; Google Fonts `@import` first in `<style>` | Design Brief in user message gives AI explicit CSS var names; context-builder builds `@import` URL |
| PIPE-07 | System prompt lean ~800 tokens (invariant rules only), per-request context in user message | OpenAI prompt caching requires 1024+ token prefix — ~1000-1100 token system prompt is cache-eligible |
| PIPE-08 | `buildUserMessage()` assembles design brief + component references + analysis + user prompt as structured user message | Markdown sections pattern; `ComponentSnippet.html` field available from Phase 9 |
| PIPE-09 | Edit mode receives "preserve existing colors and typography" instruction when no DesignResult | Edit mode `buildUserMessage()` omits Design Brief + Components sections, prepends preserve instruction |
</phase_requirements>

---

## Summary

Phase 10 adds a Design Agent (a second `gpt-4o-mini` call using Zod Structured Outputs) that runs after analysis to produce a `DesignResult` containing a style preset, 4-color palette, and 2 Google Fonts. A new `context-builder.ts` assembles these outputs plus the component snippets from Phase 9 into a structured Markdown user message for the GPT-4o generator. The current system prompt in `html-prompts.ts` is rewritten to be truly invariant (no per-request data), targeting ~1000-1100 tokens to be cache-eligible under OpenAI's 1024-token caching threshold.

**Zod situation (verified 2026-03-20):** `zod@4.3.6` is currently installed at the TOP LEVEL of `node_modules/` (not just as a nested transitive dep). It was pulled in directly by `openai@6.32.0` and `better-auth@1.5.5`. The `openai/helpers/zod.js` source confirms it imports `from 'zod/v4'` and handles both Zod v3 and v4 via `isZodV4()` detection. Running `npm install zod@^3` will replace the top-level `zod@4.3.6` with `zod@3.x`, and npm will move `zod@4` into nested `node_modules/` for packages that require it. The `zod/v3` subpath already exists at `node_modules/zod/v3/` (part of Zod v4's backward compat exports), so `import { z } from 'zod/v3'` works today without any install.

The system prompt rewrite splits the current `buildFreshSystemPrompt()` (which embeds template structure hints and per-request analysis data) into: (1) a lean static system message with only invariant rules + CSS patterns, and (2) a per-request user message containing Design Brief + Component References + Page Structure + User Request. The existing `buildEditSystemPrompt(currentHtml)` is also removed — edit mode no longer embeds the full current HTML in the system prompt.

**Primary recommendation:** Install `zod@^3` as direct dep, implement Design Agent with `zodResponseFormat` + `chat.completions.parse()`, implement `context-builder.ts` with `buildUserMessage()` for both fresh and edit modes, rewrite `html-prompts.ts` to be static/invariant, update existing `html-prompts.test.ts` to remove broken template-content assertions.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `zod` | `^3.24.x` (direct dep, replaces v4 at top level) | DesignResult + ReviewResult Zod schemas | Mandated by CONTEXT.md; `openai/helpers/zod` handles both v3 and v4 |
| `openai` | `^6.32.0` (already installed) | `zodResponseFormat`, `chat.completions.parse()` | Already in project; v6 supports both Zod v3 and v4 via `isZodV4` check |

### Existing Project Deps Used
| Library | Purpose | Phase 10 Use |
|---------|---------|--------------|
| `openai` (already) | OpenAI API client | Design Agent `chat.completions.parse()` call |
| Phase 9 `selectComponents()` | Component selection | Returns `ComponentSnippet[]` for injection into user message |

### Actual Zod Dep Tree (verified via node_modules inspection)
- **`zod@4.3.6`** — currently at TOP LEVEL (`node_modules/zod/`)
- **`zod/v3`** subpath — available at `node_modules/zod/v3/` (frozen Zod v3 compat layer shipped in Zod v4)
- **`zod@^3` (to add)** — will be installed at top level, pushing `zod@4` to nested locations
- **`zodResponseFormat`** — verified working with Zod v4 objects today; will work with Zod v3 after install

**Installation:**
```bash
npm install zod@^3
```

This replaces the top-level `zod@4.3.6` with `zod@3.x`. The `openai` and `better-auth` packages that need v4 will get their own copies in their nested `node_modules/`. No TypeScript conflicts because `zodResponseFormat` accepts both v3 and v4 schemas.

---

## Architecture Patterns

### New Files for Phase 10

```
src/lib/ai-pipeline/
├── analyzer.ts          # Unchanged
├── design-agent.ts      # NEW — runDesignAgent(prompt, analysis) → DesignResult
├── generator.ts         # Modified — accept DesignResult, call buildUserMessage()
├── context-builder.ts   # NEW — buildUserMessage() and buildEditUserMessage()
├── types.ts             # Extended — add DesignResult, ReviewResult types; add "design" to PipelineEvent.step
├── index.ts             # Unchanged in Phase 10 (Phase 11 rewires)
├── researcher.ts        # Unchanged in Phase 10 (Phase 11 deletes)
└── validator.ts         # Unchanged

src/lib/
└── html-prompts.ts      # REWRITTEN — lean invariant buildSystemPrompt(); remove buildEditSystemPrompt();
                         # stripMarkdownFences() stays (still needed by generator.ts)
```

### Pattern 1: Design Agent with Zod Structured Output

**What:** Use `chat.completions.parse()` + `zodResponseFormat()` instead of `json_object` + manual JSON.parse.
**When to use:** When the output schema is well-defined and you want type-safe parsing with automatic validation.

```typescript
// Source: node_modules/openai/helpers/zod.js (verified) + analyzer.ts pattern
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod"; // zod@3.x direct dep

const openai = new OpenAI();

const DesignResultSchema = z.object({
  preset: z.enum(["bold-dark", "warm-organic", "clean-minimal", "playful-bright", "professional-blue"]),
  palette: z.object({
    primary: z.string().describe("Hex color, e.g. #E63946"),
    secondary: z.string().describe("Hex color"),
    accent: z.string().describe("Hex color"),
    bg: z.string().describe("Hex background color"),
  }),
  fonts: z.object({
    heading: z.string().describe("Google Font name, e.g. Montserrat"),
    body: z.string().describe("Google Font name, e.g. Inter"),
  }),
});

const FALLBACK_DESIGN: DesignResult = {
  preset: "clean-minimal",
  palette: { primary: "#374151", secondary: "#6B7280", accent: "#9CA3AF", bg: "#FFFFFF" },
  fonts: { heading: "Inter", body: "Inter" },
};

export async function runDesignAgent(
  prompt: string,
  analysis: AnalysisResult
): Promise<DesignResult> {
  try {
    const completion = await openai.chat.completions.parse(
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: DESIGN_SYSTEM_PROMPT },
          { role: "user", content: `Site type: ${analysis.type}\n\n${prompt}` },
        ],
        response_format: zodResponseFormat(DesignResultSchema, "design_result"),
      },
      { signal: AbortSignal.timeout(20000) }
    );
    return completion.choices[0].message.parsed ?? FALLBACK_DESIGN;
  } catch {
    return FALLBACK_DESIGN;
  }
}
```

**Key difference from analyzer.ts:** `chat.completions.parse()` instead of `chat.completions.create()`, and `.message.parsed` (typed) instead of `JSON.parse(.message.content)`.

### Pattern 2: types.ts Changes

Phase 10 adds `DesignResult` and `ReviewResult` to `types.ts`, removes `ResearchResult` (deprecated but Phase 11 deletes the file that uses it), and extends `PipelineEvent.step`:

```typescript
// New types to add to src/lib/ai-pipeline/types.ts

export interface DesignResult {
  preset: "bold-dark" | "warm-organic" | "clean-minimal" | "playful-bright" | "professional-blue";
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface ReviewResult {
  score: number;           // 0-100
  visual: number;          // 0-40
  content: number;         // 0-30
  technical: number;       // 0-30
  must_fix: string[];      // issues that trigger refine
  suggestions: string[];   // nice-to-have
}

// PipelineEvent.step — add "design" (used by Phase 10 SSE skeleton; Phase 11 adds more)
export interface PipelineEvent {
  step: "analyze" | "research" | "design" | "generate" | "validate" | "complete" | "error";
  status: "start" | "done";
  detail?: string;
  html?: string;
  fix_count?: number;
  error?: string;
}
```

NOTE: `ResearchResult` stays in `types.ts` for Phase 10 — `researcher.ts` and `generator.ts` still import it. Phase 11 cleans up. Do NOT remove it.

### Pattern 3: buildUserMessage() — Fresh Mode

```typescript
// Source: CONTEXT.md decisions
export function buildUserMessage(
  prompt: string,
  analysis: AnalysisResult,
  design: DesignResult,
  snippets: ComponentSnippet[]
): string {
  const googleFontsImport = buildGoogleFontsImport(design.fonts);
  const sections = analysis.sections.join(" → ") || "auto";

  const snippetBlock = snippets
    .map((s) => `<!-- ${s.id}: ${s.description} -->\n${s.html}\n<!-- end ${s.id} -->`)
    .join("\n\n");

  return `## Design Brief
Preset: ${design.preset}
Primary: ${design.palette.primary} | Secondary: ${design.palette.secondary} | Accent: ${design.palette.accent} | BG: ${design.palette.bg}
Heading: ${design.fonts.heading} | Body: ${design.fonts.body}
Google Fonts: ${googleFontsImport}

## Component References
${snippetBlock}

## Page Structure
${sections}

## User Request
${prompt}`;
}
```

### Pattern 4: buildEditUserMessage() — Edit Mode

```typescript
// Source: CONTEXT.md decisions
export function buildEditUserMessage(prompt: string): string {
  return `Preserve existing colors and typography. Do not reset to DaisyUI defaults.

## User Request
${prompt}`;
}
```

### Pattern 5: Google Fonts @import URL Builder

```typescript
// Source: developers.google.com/fonts/docs/css2 (CSS2 API)
function buildGoogleFontsImport(fonts: { heading: string; body: string }): string {
  const families = [fonts.heading, fonts.body]
    .filter((f, i, arr) => arr.indexOf(f) === i) // deduplicate if same font
    .map((name) => `family=${name.replace(/ /g, "+")}:wght@400;600;700`)
    .join("&");
  return `@import url('https://fonts.googleapis.com/css2?${families}&display=swap');`;
}
```

**Google Fonts CSS2 API format:** `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Inter:wght@400;600&display=swap`
- Space → `+` in family name
- Weights via `:wght@` with semicolons
- `&display=swap` recommended for performance

### Pattern 6: Lean System Prompt Structure

The rewritten `buildSystemPrompt()` replaces both `buildFreshSystemPrompt()` and `buildEditSystemPrompt()`:
- **Invariant** — zero per-request data injected
- **~1000-1100 tokens** — to exceed OpenAI's 1024-token caching minimum
- **Keep:** CDN links (DaisyUI + Tailwind), localStorage `appgen-` prefix rule, anti-patterns (no `alert()`, no `x-for`, no global Alpine functions), CSS rules (flip card pattern, aspect-ratio ban, Tailwind pitfalls), `<!DOCTYPE html>` output instruction
- **Remove:** Template structure hints (LANDING PAGE, PORTFOLIO...) — move to `buildUserMessage()` Page Structure section; per-request analysis data

The current `buildEditSystemPrompt(currentHtml)` embeds the full HTML in the system prompt — this is eliminated entirely. Edit mode will call `buildSystemPrompt()` (same static prompt) + `buildEditUserMessage(prompt)`.

### Pattern 7: refineHtml() Skeleton

```typescript
// Source: CONTEXT.md — Phase 11 fills implementation
// File: src/lib/ai-pipeline/context-builder.ts or a new refiner.ts
export async function refineHtml(html: string, reviewResult: ReviewResult): Promise<string> {
  throw new Error("Not implemented — Phase 11");
}
```

### Anti-Patterns to Avoid

- **Using `json_object` for Design Agent:** The locked decision is `zodResponseFormat`. Do not fall back to `json_object` + manual parse even as an "alternative."
- **Injecting per-request data into system prompt:** The whole point of the rewrite is invariance. Analysis data, design brief, and component snippets ALL go in the user message.
- **Using `chat.completions.create()` for Design Agent:** Must use `chat.completions.parse()` to get `.message.parsed` with type safety.
- **Putting the @import URL inside the system prompt:** It is per-request (depends on Design Agent output), so it belongs in the user message's Design Brief section.
- **Touching `index.ts` (orchestrator):** Phase 10 only creates building blocks. Phase 11 wires them up.
- **Deleting `researcher.ts`:** Phase 10 must not touch it. Phase 11 deletes it.
- **Removing `ResearchResult` from types.ts:** Still needed by `researcher.ts` and `generator.ts` in Phase 10.
- **Removing `stripMarkdownFences` from html-prompts.ts:** `generator.ts` imports it — must remain exported.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Structured JSON output from LLM | Custom JSON.parse + try/catch + manual validation | `zodResponseFormat` + `chat.completions.parse()` | Auto-parsed, typed `.message.parsed`, retries on parse failure |
| Zod → JSON Schema conversion | Manual schema description strings | `zodResponseFormat` from `openai/helpers/zod` | Handles required fields, enum mapping, nested objects automatically |
| Google Fonts URL construction | Hardcoded URLs per font | `buildGoogleFontsImport()` from font names | Consistent format, handles spaces, deduplicates same heading+body font |
| Fallback on Design Agent timeout | Complex retry logic | `?? FALLBACK_DESIGN` in try/catch | Simple, fast, matches CONTEXT.md spec |

**Key insight:** `chat.completions.parse()` with `zodResponseFormat` eliminates the entire class of "AI returned malformed JSON" runtime errors that currently exist in `analyzePrompt()` via manual `JSON.parse`.

---

## Common Pitfalls

### Pitfall 1: Zod Top-Level Version Conflict After Install

**What goes wrong:** `zod@4.3.6` is currently at the TOP LEVEL of `node_modules/`. After `npm install zod@^3`, npm replaces the top-level zod with v3. If any package tries to use `import { z } from 'zod'` and expects v4 behavior, it gets v3 instead.
**Why it happens:** npm resolves the top-level package first; dependents requiring a different range get nested copies.
**How to avoid:** `npm install zod@^3` is safe — `openai` imports `from 'zod/v4'` and `from 'zod/v3'` using specific subpath imports (not bare `'zod'`). `better-auth` uses Zod v4 via its own nested copy. Running `npm install zod@^3` and then `npm run typecheck` is the verification step.
**Warning signs:** TypeScript errors about incompatible ZodType after the install — run `npm run typecheck` immediately after to catch these.

### Pitfall 2: System Prompt Under 1024 Tokens = No Caching

**What goes wrong:** Trimming the system prompt too aggressively (below 1024 tokens) disables prompt caching entirely.
**Why it happens:** OpenAI's prompt caching minimum threshold is **1024 tokens** (not 800). The CONTEXT.md target of ~1000-1100 tokens is correct — it exceeds 1024.
**How to avoid:** Target 1000-1100 tokens. Keep all CSS rules (flip card, aspect-ratio ban, Tailwind pitfalls) — these add substance and bring the prompt above the 1024-token floor.
**Warning signs:** Costs not decreasing despite "static" system prompt; check token count with OpenAI Playground tokenizer.

### Pitfall 3: Edit Mode Accidentally Triggering Design Style Reset

**What goes wrong:** If edit mode uses `buildUserMessage()` (fresh mode variant) instead of `buildEditUserMessage()`, the AI gets a Design Brief and may reset colors.
**Why it happens:** Both modes call the generator — the distinction must be enforced in `generator.ts`.
**How to avoid:** `buildEditUserMessage()` is a separate exported function. `generator.ts` passes `currentHtml` to detect edit mode and calls the correct builder. Per CONTEXT.md: edit mode skips Design Agent entirely (Phase 11 wires this — Phase 10 just ensures the function exists and is correct).
**Warning signs:** Edit mode outputs show different fonts/colors than what was in the HTML before editing.

### Pitfall 4: `message.parsed` Can Be null

**What goes wrong:** `completion.choices[0].message.parsed` is `null` if the model returned content that couldn't be parsed into the Zod schema.
**Why it happens:** Even with `zodResponseFormat`, the model could return a refusal or empty content on rare occasions.
**How to avoid:** Always use `?? FALLBACK_DESIGN` after `.message.parsed`. Wrap the whole call in try/catch and return `FALLBACK_DESIGN` on any error.
**Warning signs:** TypeScript will flag `.parsed` as `DesignResult | null`, so the nullish coalesce is required for compilation anyway.

### Pitfall 5: Existing Tests Break on html-prompts.ts Rewrite

**What goes wrong:** `src/lib/html-prompts.test.ts` has tests that assert `buildFreshSystemPrompt()` contains "LANDING PAGE", "PORTFOLIO / CV", etc., and `buildEditSystemPrompt()` exists. After rewrite these break.
**Why it happens:** Template structure hints move to user message; `buildEditSystemPrompt` is removed.
**How to avoid:** In the same plan that rewrites `html-prompts.ts`, update `html-prompts.test.ts`. Replace old assertions with new ones matching the lean prompt content. The `stripMarkdownFences` tests (3 tests) are unaffected and must still pass.
**Warning signs:** `npm run test` fails after plan 10-02 if tests are not updated in the same wave.

### Pitfall 6: generator.ts Still Needs ResearchResult Import

**What goes wrong:** If `ResearchResult` is removed from `types.ts` in Phase 10, `generator.ts` (which still calls `researchContext()`) will have TypeScript errors.
**Why it happens:** Phase 10 creates new files but does not rewire the orchestrator — the old `researcher.ts → generator.ts` flow still exists and compiles.
**How to avoid:** Keep `ResearchResult` in `types.ts`. Keep `generator.ts` working with its existing signature. Only the new `buildUserMessage()` integration is added as an addition to generator.ts (or as a separate new function path that Phase 11 will call).
**Warning signs:** `npm run typecheck` errors about `ResearchResult` or `researchContext` after Phase 10 changes.

---

## Code Examples

### Design Agent Full Pattern

```typescript
// src/lib/ai-pipeline/design-agent.ts
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod"; // zod@3 direct dep
import type { AnalysisResult } from "./types";

const openai = new OpenAI();

const DesignResultSchema = z.object({
  preset: z.enum(["bold-dark", "warm-organic", "clean-minimal", "playful-bright", "professional-blue"]),
  palette: z.object({
    primary: z.string().describe("Hex color e.g. #E63946"),
    secondary: z.string().describe("Hex color"),
    accent: z.string().describe("Hex color"),
    bg: z.string().describe("Background hex color"),
  }),
  fonts: z.object({
    heading: z.string().describe("Google Font name e.g. Montserrat"),
    body: z.string().describe("Google Font name e.g. Inter"),
  }),
});

export type DesignResult = z.infer<typeof DesignResultSchema>;

export const FALLBACK_DESIGN: DesignResult = {
  preset: "clean-minimal",
  palette: { primary: "#374151", secondary: "#6B7280", accent: "#9CA3AF", bg: "#FFFFFF" },
  fonts: { heading: "Inter", body: "Inter" },
};

const DESIGN_SYSTEM_PROMPT = `You are a visual design expert. Given a website type and user prompt, choose the best visual identity.
Return a JSON object with preset, palette (4 hex colors), and fonts (2 Google Font names).

Preset guidelines:
- bold-dark: fitness, gym, sports, gaming — dark backgrounds, strong colors
- warm-organic: food, cooking, recipes, wellness, nature — warm earthy tones
- playful-bright: education, learning, language, kids — bright cheerful colors
- professional-blue: SaaS, startup, tech, business, finance — trustworthy blues/grays
- clean-minimal: everything else — clean neutrals`;

export async function runDesignAgent(
  prompt: string,
  analysis: AnalysisResult
): Promise<DesignResult> {
  try {
    const completion = await openai.chat.completions.parse(
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: DESIGN_SYSTEM_PROMPT },
          { role: "user", content: `Site type: ${analysis.type}\n\n${prompt}` },
        ],
        response_format: zodResponseFormat(DesignResultSchema, "design_result"),
      },
      { signal: AbortSignal.timeout(20000) }
    );
    return completion.choices[0].message.parsed ?? FALLBACK_DESIGN;
  } catch {
    return FALLBACK_DESIGN;
  }
}
```

### context-builder.ts Full Pattern

```typescript
// src/lib/ai-pipeline/context-builder.ts
import type { AnalysisResult, DesignResult } from "./types";
import type { ComponentSnippet } from "@/lib/component-library/types";

export function buildUserMessage(
  prompt: string,
  analysis: AnalysisResult,
  design: DesignResult,
  snippets: ComponentSnippet[]
): string {
  const googleFontsImport = buildGoogleFontsImport(design.fonts);
  const sections = analysis.sections.join(" → ") || "auto";
  const snippetBlock = snippets
    .map((s) => `<!-- ${s.id}: ${s.description} -->\n${s.html}\n<!-- end ${s.id} -->`)
    .join("\n\n");

  return `## Design Brief
Preset: ${design.preset}
Primary: ${design.palette.primary} | Secondary: ${design.palette.secondary} | Accent: ${design.palette.accent} | BG: ${design.palette.bg}
Heading: ${design.fonts.heading} | Body: ${design.fonts.body}
Google Fonts: ${googleFontsImport}

## Component References
${snippetBlock}

## Page Structure
${sections}

## User Request
${prompt}`;
}

export function buildEditUserMessage(prompt: string): string {
  return `Preserve existing colors and typography. Do not reset to DaisyUI defaults.

## User Request
${prompt}`;
}

export function buildGoogleFontsImport(fonts: { heading: string; body: string }): string {
  const families = [fonts.heading, fonts.body]
    .filter((f, i, arr) => arr.indexOf(f) === i)
    .map((name) => `family=${name.replace(/ /g, "+")}:wght@400;600;700`)
    .join("&");
  return `@import url('https://fonts.googleapis.com/css2?${families}&display=swap');`;
}

export async function refineHtml(html: string, reviewResult: import("./types").ReviewResult): Promise<string> {
  throw new Error("Not implemented — Phase 11");
}
```

### html-prompts.ts After Rewrite

```typescript
// src/lib/html-prompts.ts — lean, invariant, ~1000-1100 tokens
export function buildSystemPrompt(): string {
  return `You are an expert web developer. Generate a complete, self-contained website as a single HTML file with ALL CSS in <style> tags and ALL JavaScript in <script> tags.

Rules:
- Mobile-first responsive design
- Approved CDNs only: cdn.tailwindcss.com, cdn.jsdelivr.net/npm/daisyui, chart.js, alpinejs
- ALWAYS include DaisyUI and Tailwind CDN in <head>:
    <link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.min.css" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
- For persistent state, use localStorage with "appgen-" prefix for all keys
- Do NOT use external images or fonts requiring authentication
- Output ONLY the raw HTML — no explanation, no markdown, no commentary
- Start your response with <!DOCTYPE html>

[... CDN rules, CSS rules, anti-patterns ...]`;
}

// stripMarkdownFences stays — generator.ts needs it
export function stripMarkdownFences(raw: string): string {
  return raw.replace(/^```(?:html?)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

// REMOVED: buildFreshSystemPrompt, buildEditSystemPrompt
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `json_object` + `JSON.parse()` | `zodResponseFormat` + `chat.completions.parse()` | OpenAI SDK v4+ | Type-safe, auto-validated, no manual parse |
| Zod v3 only | Zod v4 with `zod/v3` subpath for backward compat | Zod v4.0 (May 2025) | Can use v3 schemas via subpath import |
| Static `response_format: { type: "json_object" }` | Structured Outputs via JSON Schema | GPT-4o-2024-08-06+ | Guaranteed valid JSON matching exact schema |
| System prompt contains all context | System prompt invariant + user message has per-request context | Prompt caching best practice | 75% cost reduction on cached token hits |
| `buildEditSystemPrompt(currentHtml)` injects full HTML into system | Edit mode uses static system + `buildEditUserMessage()` | Phase 10 | System prompt can now be cached; HTML no longer passed as system context |

---

## Open Questions

1. **System prompt token count**
   - What we know: Target is 1000-1100 tokens for caching. Current prompt is ~900-1100 tokens (estimated from character count).
   - What's unclear: Exact count of the rewritten lean prompt without template hints.
   - Recommendation: After writing the lean prompt in Plan 10-02, count tokens in OpenAI Playground. Adjust CSS rules section to stay above 1024.

2. **PipelineEvent.step union with unused "design" value**
   - What we know: Adding `"design"` to the union in Phase 10 is safe — `index.ts` is not modified, so the value is declared but never emitted until Phase 11.
   - What's unclear: Whether TypeScript exhaustiveness checks elsewhere will warn about the new unused case.
   - Recommendation: Add `"design"` to the union in Phase 10. Run `npm run typecheck` to confirm no issues.

3. **Font weights in Google Fonts URL**
   - What we know: CSS2 API uses `family=Montserrat:wght@400;600;700&display=swap`. CONTEXT.md says this is Claude's discretion.
   - What's unclear: Whether heading and body fonts need different weight sets.
   - Recommendation: Use `wght@400;600;700` for all fonts uniformly. No italic variants in v1. Keep URL short.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` (root) — has `@` alias pointing to `./src` |
| Quick run command | `npm run test` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PIPE-04 | `DesignResultSchema` Zod schema validates correct output shapes | unit | `npm run test -- design-agent` | ❌ Wave 0 |
| PIPE-04 | `FALLBACK_DESIGN` matches `DesignResult` type | unit | `npm run test -- design-agent` | ❌ Wave 0 |
| PIPE-05 | Domain-to-preset mapping | manual-only | n/a — requires live API call | n/a |
| PIPE-06 | `buildGoogleFontsImport()` produces correct `@import url(...)` for given font names | unit | `npm run test -- context-builder` | ❌ Wave 0 |
| PIPE-06 | `buildGoogleFontsImport()` deduplicates when heading === body font | unit | `npm run test -- context-builder` | ❌ Wave 0 |
| PIPE-07 | `buildSystemPrompt()` does NOT contain "LANDING PAGE" or "PORTFOLIO / CV" strings | unit | `npm run test -- html-prompts` | ✅ (update existing — currently FAILS post-rewrite) |
| PIPE-07 | `buildSystemPrompt()` DOES contain CDN links, anti-pattern rules, CSS rules | unit | `npm run test -- html-prompts` | ✅ (update existing) |
| PIPE-08 | `buildUserMessage()` in fresh mode contains all 4 sections | unit | `npm run test -- context-builder` | ❌ Wave 0 |
| PIPE-08 | `buildUserMessage()` includes snippet HTML wrapped in comment markers | unit | `npm run test -- context-builder` | ❌ Wave 0 |
| PIPE-09 | `buildEditUserMessage()` contains preserve instruction | unit | `npm run test -- context-builder` | ❌ Wave 0 |
| PIPE-09 | `buildEditUserMessage()` does NOT contain "## Design Brief" | unit | `npm run test -- context-builder` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test`
- **Phase gate:** All tests green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/ai-pipeline/design-agent.test.ts` — covers PIPE-04 schema shape tests (static unit tests, no API call)
- [ ] `src/lib/ai-pipeline/context-builder.test.ts` — covers PIPE-06, PIPE-08, PIPE-09
- [ ] `src/lib/html-prompts.test.ts` — UPDATE existing: remove 4 template-content assertions (`LANDING PAGE`, `PORTFOLIO / CV`, `DASHBOARD / TOOL`, `BLOG / DOCS`), remove `buildEditSystemPrompt` tests (function removed), add `buildSystemPrompt` assertions for CDN links + anti-patterns

**Current test file inventory (confirmed):**
- `src/lib/html-prompts.test.ts` — 11 tests; 4 in "includes all 4 template types" + 3 buildEditSystemPrompt tests will BREAK after rewrite
- `src/lib/component-library/component-library.test.ts` — unaffected by Phase 10

---

## Sources

### Primary (HIGH confidence)
- `node_modules/openai/helpers/zod.js` — verified `zodResponseFormat` signature; confirmed `isZodV4` dual-version support; confirmed `chat.completions.parse()` usage pattern
- `node_modules/zod/package.json` — confirmed `zod@4.3.6` at top level; `node_modules/zod/v3/` subpath exists
- `src/lib/ai-pipeline/analyzer.ts` — establishes `gpt-4o-mini` + 20s timeout + `openai.chat.completions.create()` pattern to replicate
- `src/lib/html-prompts.ts` — current prompt content identified for rewrite; exact function signatures confirmed
- `src/lib/html-prompts.test.ts` — 11 tests identified; 7 will need updating after rewrite
- `src/lib/component-library/types.ts` — `ComponentSnippet.html` field confirmed for snippet injection

### Secondary (MEDIUM confidence)
- OpenAI Structured Outputs docs — `zodResponseFormat` usage pattern confirmed
- OpenAI Prompt Caching docs — 1024-token minimum threshold confirmed
- Google Fonts CSS2 API — `family=Name:wght@400;700&display=swap` format confirmed

### Tertiary (LOW confidence)
- None — all critical claims verified from primary sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Zod situation verified via direct `node_modules` inspection; OpenAI helpers source code read
- Architecture: HIGH — patterns derived from existing `analyzer.ts` code + CONTEXT.md locked decisions; no speculation
- Pitfalls: HIGH — Zod top-level status confirmed; test breakage identified from reading actual test file; caching threshold from official docs

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (30 days — Zod and OpenAI SDK stable)
