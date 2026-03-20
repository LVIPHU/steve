# Phase 10: Design Agent + Context Builder + Prompt Rewrite - Research

**Researched:** 2026-03-20
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
- Zod v3 (`^3.24.x`) must be added as direct dep — NOT Zod v4 (breaks `openai/helpers/zod`)
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
| PIPE-04 | Design Agent (gpt-4o-mini + Zod Structured Output) returns palette hex, typography Google Fonts, style preset | `zodResponseFormat` + `chat.completions.parse()` API; Zod v3 compat path via `zod/v3` subpath |
| PIPE-05 | Design Agent maps domain → style preset (SaaS → bold-dark, food → warm-organic, etc.) | AI-driven detection using full prompt + `AnalysisResult.type`; no hardcoded table |
| PIPE-06 | CSS variables `--color-primary`, `--color-secondary`, `--color-accent`, `--color-bg` in HTML; Google Fonts `@import` first in `<style>` | Design Brief in user message gives AI explicit CSS var names; context-builder builds `@import` URL |
| PIPE-07 | System prompt lean ~800 tokens (invariant rules only), per-request context in user message | OpenAI prompt caching requires 1024+ token prefix — ~1000-1100 token system prompt is cache-eligible |
| PIPE-08 | `buildUserMessage()` assembles design brief + component references + analysis + user prompt as structured user message | Markdown sections pattern; `ComponentSnippet.html` field available from Phase 9 |
| PIPE-09 | Edit mode receives "preserve existing colors and typography" instruction when no DesignResult | Edit mode `buildUserMessage()` omits Design Brief + Components sections, prepends preserve instruction |
</phase_requirements>

---

## Summary

Phase 10 adds a Design Agent (a second `gpt-4o-mini` call using Zod Structured Outputs) that runs after analysis to produce a `DesignResult` containing a style preset, 4-color palette, and 2 Google Fonts. A new `context-builder.ts` assembles these outputs plus the component snippets from Phase 9 into a structured Markdown user message for the GPT-4o generator. The current system prompt in `html-prompts.ts` is rewritten to be truly invariant (no per-request data), targeting ~1000-1100 tokens to be cache-eligible under OpenAI's 1024-token caching threshold.

The key constraint is Zod: the project currently has Zod v4.3.6 only as a transitive dep (via `better-auth` and `openai`). The OpenAI SDK v6 already imports `from 'zod/v3'` internally (verified in `node_modules/openai/helpers/zod.d.ts`), and Zod v4 ships a frozen `zod/v3` subpath — so `import { z } from 'zod/v3'` already works without installing anything. However, CONTEXT.md mandates adding Zod v3 as a direct dep (`^3.24.x`), which means `npm install zod@^3.24.x` must be run. This will pin zod@3.x at the top level and co-exist alongside the transitive zod@4 (deduplicated in deeper node_modules).

The system prompt rewrite splits the current `buildFreshSystemPrompt()` (which embeds template structure hints) into: (1) a lean static system message with only rules + CSS patterns, and (2) a per-request user message containing Design Brief + Component References + Page Structure + User Request.

**Primary recommendation:** Install `zod@^3.24.x` as direct dep, implement Design Agent with `zodResponseFormat` + `chat.completions.parse()`, implement `context-builder.ts` with `buildUserMessage()` for both fresh and edit modes, rewrite `html-prompts.ts` to remove template hints from system prompt.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `zod` | `^3.24.x` (direct dep) | DesignResult + ReviewResult Zod schemas | `openai/helpers/zod` already imports `from 'zod/v3'`; v3 is frozen stable |
| `openai` | `^6.32.0` (already installed) | `zodResponseFormat`, `chat.completions.parse()` | Already in project; v6 supports both Zod v3 and v4 |

### Existing Project Deps Used
| Library | Purpose | Phase 10 Use |
|---------|---------|--------------|
| `openai` (already) | OpenAI API client | Design Agent `chat.completions.parse()` call |
| Phase 9 `selectComponents()` | Component selection | Returns `ComponentSnippet[]` for injection into user message |

### Version Notes
- **Zod v4.3.6** is already present as transitive dep via `better-auth@1.5.5`
- **Zod v4 ships `zod/v3` subpath** — `import { z } from 'zod/v3'` works today without installing anything
- **Direct dep `zod@^3` is still required** per CONTEXT.md to avoid accidental Zod v4 being used in Design Agent schemas and to make the intent explicit
- **openai v6 `helpers/zod.d.ts` confirms**: `zodResponseFormat` accepts both `z3.ZodType` and `z4.ZodType`

**Installation:**
```bash
npm install zod@^3
```

This co-exists with the transitive `zod@4` (which better-auth and openai internally use). No conflicts.

---

## Architecture Patterns

### New Files for Phase 10

```
src/lib/ai-pipeline/
├── analyzer.ts          # Unchanged
├── design-agent.ts      # NEW — runDesignAgent(prompt, analysis) → DesignResult
├── generator.ts         # Modified — accept DesignResult, call buildUserMessage()
├── context-builder.ts   # NEW — buildUserMessage(prompt, analysis, design, snippets)
├── types.ts             # Extended — add DesignResult, ReviewResult types; extend PipelineEvent.step
├── index.ts             # Unchanged in Phase 10 (Phase 11 rewires)
├── researcher.ts        # Unchanged in Phase 10 (Phase 11 deletes)
└── validator.ts         # Unchanged

src/lib/
└── html-prompts.ts      # REWRITTEN — lean system prompt, buildUserMessage() moved to context-builder.ts
```

### Pattern 1: Design Agent with Zod Structured Output

**What:** Use `chat.completions.parse()` + `zodResponseFormat()` instead of `json_object` + manual JSON.parse.
**When to use:** When the output schema is well-defined and you want type-safe parsing with automatic validation.

```typescript
// Source: node_modules/openai/helpers/zod.d.ts (verified)
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod"; // zod@3.x direct dep

const DesignResultSchema = z.object({
  preset: z.enum(["bold-dark", "warm-organic", "clean-minimal", "playful-bright", "professional-blue"]),
  palette: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    bg: z.string(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
});

export type DesignResult = z.infer<typeof DesignResultSchema>;

export async function runDesignAgent(
  prompt: string,
  analysis: AnalysisResult
): Promise<DesignResult> {
  const completion = await openai.chat.completions.parse(
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: DESIGN_SYSTEM_PROMPT },
        { role: "user", content: `Type: ${analysis.type}\nPrompt: ${prompt}` },
      ],
      response_format: zodResponseFormat(DesignResultSchema, "design_result"),
    },
    { signal: AbortSignal.timeout(20000) }
  );

  return completion.choices[0].message.parsed ?? FALLBACK_DESIGN;
}
```

**Key difference from analyzer.ts:** `chat.completions.parse()` instead of `chat.completions.create()`, and `.message.parsed` (typed) instead of `JSON.parse(.message.content)`.

### Pattern 2: ReviewResult Type (Skeleton for Phase 11)

Phase 10 must also add `ReviewResult` to `types.ts` so `refineHtml()` has the correct signature:

```typescript
// types.ts addition
export interface ReviewResult {
  score: number;           // 0-100
  visual: number;          // 0-40
  content: number;         // 0-30
  technical: number;       // 0-30
  must_fix: string[];      // issues that trigger refine
  suggestions: string[];   // nice-to-have
}
```

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

### Pattern 4: buildUserMessage() — Edit Mode

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

The rewritten `buildSystemPrompt()` (replaces `buildFreshSystemPrompt` and `buildEditSystemPrompt`) must be:
- **Invariant** — no per-request data injected
- **~1000-1100 tokens** — to exceed OpenAI's 1024-token caching minimum
- Keep: CDN rules, anti-patterns (no alert(), no x-for, localStorage prefix), CSS rules (flip card, aspect-ratio ban, Tailwind pitfalls)
- Remove: template structure hints (LANDING PAGE, PORTFOLIO...) — these move to user message

### Anti-Patterns to Avoid

- **Using `json_object` for Design Agent:** The locked decision is `zodResponseFormat`. Do not fall back to `json_object` + manual parse even as an "alternative."
- **Injecting per-request data into system prompt:** The whole point of the rewrite is invariance. Analysis data, design brief, and component snippets ALL go in the user message.
- **Using `chat.completions.create()` for Design Agent:** Must use `chat.completions.parse()` to get `.message.parsed` with type safety.
- **Putting the @import URL inside the system prompt:** It is per-request (depends on Design Agent output), so it belongs in the user message's Design Brief section.
- **Touching `index.ts` (orchestrator):** Phase 10 only creates building blocks. Phase 11 wires them up.
- **Deleting `researcher.ts`:** Phase 10 must not touch it. Phase 11 deletes it.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Structured JSON output from LLM | Custom JSON.parse + try/catch + manual validation | `zodResponseFormat` + `chat.completions.parse()` | Auto-parsed, typed `.message.parsed`, retries on parse failure |
| Zod → JSON Schema conversion | Manual schema description strings | `zodResponseFormat` from `openai/helpers/zod` | Handles required fields, enum mapping, nested objects |
| Google Fonts URL construction | Hardcoded URLs per font | `buildGoogleFontsImport()` from font names | Consistent format, handles spaces, deduplicated families |
| Fallback on Design Agent timeout | Complex retry logic | `?? FALLBACK_DESIGN` — `clean-minimal` + neutral colors | Simple, fast, matches CONTEXT.md spec |

**Key insight:** `chat.completions.parse()` with `zodResponseFormat` eliminates the entire class of "AI returned malformed JSON" runtime errors that currently exist in `analyzePrompt()` via manual `JSON.parse`.

---

## Common Pitfalls

### Pitfall 1: Zod Direct Dep vs Transitive Dep Conflict

**What goes wrong:** Installing `zod@^3` as a direct dep while `better-auth` and `openai` use `zod@4` transiently could cause two incompatible Zod instances in the module graph.
**Why it happens:** npm resolves conflicting semver ranges by duplicating packages in `node_modules`.
**How to avoid:** Install `zod@^3` — it installs as `zod@3.x` at top level. The transitive `zod@4` stays deep in `node_modules/better-auth/node_modules/zod`. Import `from 'zod'` gets v3. The OpenAI helpers internally import `from 'zod/v3'` and `from 'zod/v4'` (both subpaths now available on v4), so no conflict.
**Warning signs:** TypeScript errors about incompatible ZodType versions between `design-agent.ts` and `openai/helpers/zod`.

### Pitfall 2: System Prompt Under 1024 Tokens = No Caching

**What goes wrong:** Trimming the system prompt too aggressively (below 1024 tokens) disables prompt caching entirely.
**Why it happens:** OpenAI's prompt caching minimum threshold is **1024 tokens** (not 800). The CONTEXT.md target of ~1000-1100 tokens is correct — it exceeds 1024.
**How to avoid:** Target 1000-1100 tokens. Keep all CSS rules (flip card, aspect-ratio ban, Tailwind pitfalls) — these add substance and bring the prompt above the 1024-token floor.
**Warning signs:** Costs not decreasing despite "static" system prompt; check token count with `tiktoken` or OpenAI playground.

### Pitfall 3: Edit Mode Accidentally Triggering Design Agent Style

**What goes wrong:** Edit mode calls Design Agent → AI gets a fresh Design Brief → CSS variables reset to new colors → user's existing design is overwritten.
**Why it happens:** If `buildUserMessage()` is called identically for both fresh and edit modes.
**How to avoid:** `buildEditUserMessage()` is a separate function (or branch). It omits `## Design Brief` and `## Component References` entirely. It prepends the preserve instruction. Per CONTEXT.md: edit mode skips Design Agent entirely (Phase 11 wires this — Phase 10 just ensures the function exists and is correct).
**Warning signs:** Edit mode outputs show different fonts/colors than what was in the HTML before editing.

### Pitfall 4: `message.parsed` Can Be null

**What goes wrong:** `completion.choices[0].message.parsed` is `null` if the model returned content that couldn't be parsed into the Zod schema.
**Why it happens:** Even with `zodResponseFormat`, the model could return a refusal or empty content.
**How to avoid:** Always use `?? FALLBACK_DESIGN` after `.message.parsed`. Define `FALLBACK_DESIGN` as a const with `clean-minimal` preset.
**Warning signs:** TypeScript will flag `.parsed` as `DesignResult | null`, so the nullish coalesce is required for compilation anyway.

### Pitfall 5: Existing Tests Break on html-prompts.ts Rewrite

**What goes wrong:** `src/lib/html-prompts.test.ts` has 11 tests asserting specific content in `buildFreshSystemPrompt()` and `buildEditSystemPrompt()` — e.g., "contains LANDING PAGE", "contains PORTFOLIO / CV". After rewrite, these assertions fail.
**Why it happens:** Template structure hints move to user message, so system prompt no longer contains them.
**How to avoid:** Update `html-prompts.test.ts` in the same plan that rewrites `html-prompts.ts`. Replace old assertions with new assertions matching the lean system prompt content. Add tests for `buildUserMessage()` and `buildEditUserMessage()` in the new `context-builder.test.ts`.
**Warning signs:** `npm run test` fails after plan 10-02 if tests are not updated.

---

## Code Examples

### Design Agent Full Pattern

```typescript
// Source: node_modules/openai/helpers/zod.d.ts + analyzer.ts pattern
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod"; // zod@3 direct dep
import type { AnalysisResult, DesignResult } from "./types";

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

### types.ts Additions

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
  score: number;
  visual: number;
  content: number;
  technical: number;
  must_fix: string[];
  suggestions: string[];
}

// PipelineEvent.step extension (Phase 11 adds more, but design step needed for Phase 10 SSE)
// NOTE: index.ts is NOT touched in Phase 10 — this type change is forward-compatible
export interface PipelineEvent {
  step: "analyze" | "research" | "design" | "generate" | "validate" | "complete" | "error";
  // ... rest unchanged
}
```

### refineHtml() Skeleton

```typescript
// Source: CONTEXT.md — Phase 11 fills implementation
export async function refineHtml(html: string, reviewResult: ReviewResult): Promise<string> {
  throw new Error("Not implemented — Phase 11");
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `json_object` + `JSON.parse()` | `zodResponseFormat` + `chat.completions.parse()` | OpenAI SDK v4+ | Type-safe, auto-validated, no manual parse |
| Zod v3 only | Zod v4 with `zod/v3` subpath for backward compat | Zod v4.0 (May 2025) | Can use `import { z } from 'zod/v3'` without installing separately |
| Static `response_format: { type: "json_object" }` | Structured Outputs via JSON Schema | GPT-4o-2024-08-06+ | Guaranteed valid JSON matching exact schema |
| System prompt contains all context | System prompt invariant + user message has per-request context | Prompt caching best practice | 75% cost reduction on cached token hits |

**Current Zod situation (confirmed via `npm list zod`):**
- `zod@4.3.6` — transitive dep via `better-auth@1.5.5` and `openai@6.32.0`
- `zod/v3` subpath — available because Zod v4 ships it as frozen Zod v3 compat layer
- Direct dep `zod@^3` — NOT yet installed; must be added in Plan 10-01

---

## Open Questions

1. **System prompt token count**
   - What we know: Current `buildFreshSystemPrompt()` content is ~900-1100 tokens (estimated). Target is 1000-1100 tokens for caching.
   - What's unclear: Exact token count of the rewritten lean prompt.
   - Recommendation: After writing the lean prompt in Plan 10-02, count tokens in OpenAI Playground or via `tiktoken`. Adjust CSS rules section if needed to stay above 1024.

2. **`PipelineEvent.step` union type and edit mode safety**
   - What we know: `types.ts` currently has `"analyze" | "research" | "generate" | "validate" | "complete" | "error"`. Design Agent SSE event needs `"design"`.
   - What's unclear: Whether adding `"design"` to the union in Phase 10 (before Phase 11 rewires the orchestrator) causes any TypeScript exhaustiveness errors.
   - Recommendation: Add `"design"` to the union type in Plan 10-01. Since `index.ts` is not touched in Phase 10, the new type value is unused but valid. Phase 11 then uses it.

3. **Font weights in Google Fonts URL**
   - What we know: CSS2 API uses `family=Montserrat:wght@400;600;700&display=swap`. CONTEXT.md says this is Claude's discretion.
   - What's unclear: Whether including italic variants (`ital,wght@0,400;0,700;1,400`) is needed.
   - Recommendation: Start with `wght@400;600;700` for heading fonts, `wght@400;600` for body fonts. No italic variants in v1 — keep URLs short and consistent.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `npm run test` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PIPE-04 | `DesignResultSchema` Zod schema validates correct output shapes | unit | `npm run test -- design-agent` | ❌ Wave 0 |
| PIPE-04 | `FALLBACK_DESIGN` matches `DesignResult` type | unit | `npm run test -- design-agent` | ❌ Wave 0 |
| PIPE-05 | Domain-to-preset logic tested via prompt string input | manual-only | n/a — requires live API call | n/a |
| PIPE-06 | `buildGoogleFontsImport()` produces correct `@import url(...)` for given font names | unit | `npm run test -- context-builder` | ❌ Wave 0 |
| PIPE-07 | `buildSystemPrompt()` does NOT contain "LANDING PAGE" or "PORTFOLIO" strings | unit | `npm run test -- html-prompts` | ✅ (update existing) |
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
- [ ] `src/lib/ai-pipeline/design-agent.test.ts` — covers PIPE-04 schema shape tests
- [ ] `src/lib/ai-pipeline/context-builder.test.ts` — covers PIPE-06, PIPE-08, PIPE-09
- [ ] `src/lib/html-prompts.test.ts` — UPDATE existing tests: remove 4 template-content assertions, add lean-prompt assertions

*(Note: `src/lib/html-prompts.test.ts` exists — 11 tests currently passing; 4 of them will break after rewrite and need updating)*

---

## Sources

### Primary (HIGH confidence)
- `node_modules/openai/helpers/zod.d.ts` — confirmed `zodResponseFormat` signature accepts `z3.ZodType | z4.ZodType`; confirmed `chat.completions.parse()` usage
- `npm list zod` output — confirmed `zod@4.3.6` as transitive; `zod/v3` subpath available
- `src/lib/ai-pipeline/analyzer.ts` — establishes `gpt-4o-mini` + 20s timeout pattern to replicate
- `src/lib/html-prompts.ts` — current prompt content to be replaced; existing tests identified

### Secondary (MEDIUM confidence)
- [OpenAI Structured Outputs docs](https://developers.openai.com/api/docs/guides/structured-outputs) — `zodResponseFormat` usage pattern
- [OpenAI Prompt Caching docs](https://developers.openai.com/api/docs/guides/prompt-caching) — 1024-token minimum threshold confirmed
- [Google Fonts CSS2 API docs](https://developers.google.com/fonts/docs/css2) — `family=Name:wght@400;700&display=swap` format confirmed
- [Zod versioning docs](https://zod.dev/v4/versioning) — `zod/v3` subpath ships with Zod v4 as frozen compat layer

### Tertiary (LOW confidence)
- None — all critical claims verified from primary sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Zod situation verified via `npm list` + `node_modules` inspection; OpenAI helpers API verified from source
- Architecture: HIGH — pattern directly derived from existing `analyzer.ts` code + CONTEXT.md locked decisions
- Pitfalls: HIGH — Zod conflict verified from actual dep tree; caching threshold from official docs; test breakage identified from reading existing test file

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (30 days — Zod and OpenAI SDK stable)
