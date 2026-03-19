# Stack Research

**Domain:** Enhanced AI Pipeline — Component Library, Design Agent, Review Agent
**Researched:** 2026-03-19
**Confidence:** HIGH (existing stack verified from source, new additions verified via official sources)

---

## Existing Stack (Do Not Change)

These are already installed and working. Do not upgrade or swap.

| Technology | Version (installed) | Notes |
|------------|--------------------|-|
| Next.js | 16.1.6 | App Router, SSE via ReadableStream confirmed working |
| OpenAI SDK | ^6.32.0 (latest stable ~6.27.0) | gpt-4o + gpt-4o-mini already in use |
| Tailwind CSS | v4 | CDN version in generated HTML |
| DaisyUI | 4.x (CDN in generated HTML) | Used in generated output, not host app |
| Drizzle ORM | ^0.45.1 | No schema changes needed for v1.1 |
| TypeScript | ^5 | Already configured |
| Vitest | ^4.1.0 | For testing component library tag matching |

---

## New Additions for v1.1

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Zod | ^3.24.x | Schema validation for Design Agent + Review Agent JSON output | Already depended on by better-auth transitively. v3 (not v4) is stable npm default and avoids the v4/subpath export complexity. zodResponseFormat in openai SDK targets zod v3. |
| (none new) | — | No new framework needed | All pipeline steps stay in existing `src/lib/ai-pipeline/` pattern |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | ^3.24.x | Runtime validation of Design Agent and Review Agent JSON responses | Use with `zodResponseFormat` from `openai/helpers/zod` to enforce typed output shapes. Replace manual `JSON.parse` + cast in new agents. |

**Nothing else.** The component library (HTML snippets + tag arrays) is pure TypeScript data — no library needed. The Review Agent scoring is a simple gpt-4o-mini call — no new library needed.

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vitest (existing) | Unit tests for component library tag matching | Tag-match logic is pure function — easy to unit test without mocking OpenAI |

---

## Installation

```bash
# Only new install needed:
npm install zod
```

The openai SDK already has `openai/helpers/zod` available at v6.x — no additional install.

---

## OpenAI API Feature Usage

### Prompt Caching (Automatic — No Code Changes)

**Status:** Already active on all API calls. No code changes required.

**How it works for v1.1:**
- Prompt caching is automatic for prompts >= 1024 tokens on gpt-4o and gpt-4o-mini.
- Cache hits on exact prefix matches, caching from the start of the message array.
- The ~800-token cacheable system prompt design goal for the generator is correct in principle, but the 1024-token minimum means the system prompt alone won't hit the cache threshold.
- **Practical approach:** Keep system prompt as the first `{ role: "system" }` message. The full request (system + user) will exceed 1024 tokens and the system prefix will be cached across repeated calls.
- Cache duration: 5-10 minutes of inactivity, max 1 hour. Effective for burst usage sessions.
- **Cost benefit:** Up to 50% reduction on cached input tokens for gpt-4o-mini, up to 75% for gpt-4o (as of 2025 pricing).

### Structured Outputs with Zod

**Status:** Supported by current openai SDK (v6.x), gpt-4o-mini, and gpt-4o.

**Use for:** Design Agent output (palette + typography schema), Review Agent output (score + reasons schema).

```typescript
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const DesignBriefSchema = z.object({
  palette: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    text: z.string(),
  }),
  typography: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  daisyTheme: z.string(),
});

// Pass to openai.chat.completions.create:
response_format: zodResponseFormat(DesignBriefSchema, "design_brief")
```

**Constraint:** All fields must be `required` in the schema (no `.optional()`). OpenAI Structured Outputs enforces this. Use `.nullable()` instead if a field can be absent.

**Do not use** `response_format: { type: "json_object" }` for new agents — it lacks type safety. The existing analyzer and researcher use `json_object` and that's fine to leave as-is, but new Design Agent and Review Agent should use Structured Outputs.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Zod v3 | Zod v4 | Only if zodResponseFormat is updated to target v4 subpath explicitly. Currently, `openai/helpers/zod` imports from `"zod"` which resolves to v3 on npm. Using v4 adds subpath complexity (`zod/v4`) with no benefit. |
| Pure TS data files for component library | A headless CMS or DB table | Only if snippets exceed ~50 entries and need non-developer editing. For 25 static snippets, a `.ts` file with `Record<string, Snippet>` is faster, type-safe, and git-trackable. |
| gpt-4o-mini for Design Agent | gpt-4o | Design palette selection is low-complexity. gpt-4o-mini is sufficient, cheaper, and faster. Reserve gpt-4o for the HTML generation step only. |
| gpt-4o-mini for Review Agent | Rule-based scoring | LLM scoring catches visual/UX issues that regex cannot (e.g., poor color contrast in theme, off-brand tone). Rule-based validator (existing) stays for structural fixes; LLM review adds semantic scoring layer. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Vercel AI SDK (`ai` package) | Adds abstraction on top of openai SDK with different streaming conventions. Existing SSE pipeline uses raw ReadableStream + EventSource — introducing AI SDK would require rewriting the SSE layer for no gain. | Direct `openai` SDK (already in use) |
| LangChain | Heavy abstraction, slow updates, adds ~500KB bundle. All three pipeline agents are simple single-turn calls, not multi-step chains requiring orchestration. | Direct OpenAI SDK calls, same pattern as existing `analyzer.ts` |
| Zod v4 at subpath (`zod/v4`) | `zodResponseFormat` from `openai/helpers/zod` imports from `"zod"` resolving to v3. Mixed versions cause type errors. | Zod v3 (`^3.24.x`) until openai SDK explicitly targets v4 |
| `response_format: { type: "json_object" }` for new agents | No runtime type guarantee — requires manual `JSON.parse` + cast, which is error-prone for structured Design/Review data. | `zodResponseFormat` with Structured Outputs |
| External color palette libraries (e.g. chroma.js, color2k) | Not needed — palette selection is done by the Design Agent LLM call. The output is DaisyUI theme names + hex values, not computed color transforms. | No library needed; Design Agent returns ready-to-use values |

---

## Stack Patterns by Variant

**Fresh mode (new website):**
- Run: Analyze → Design Agent (new) → Generate (with design brief + component snippets) → Review Agent (new) → conditional Refine → Validate
- Use: `zodResponseFormat` for Design Agent and Review Agent
- Keep: existing `analyzer.ts`, `generator.ts`, `validateAndFix()` patterns

**Edit mode (existing HTML):**
- Run: Generate (with current HTML + user edit instruction) → Validate only
- Skip: Analyze, Design Agent, Research, Review/Refine
- Why: Design is already established; review/refine cycle is expensive and not needed for targeted edits

**Component library lookup (tag matching):**
- Pure TypeScript: `snippets.filter(s => s.tags.some(t => tags.includes(t)))`
- No async, no LLM, no library
- Input: section tags from Analyze step output (`analysis.sections` + `analysis.features`)
- Output: 3-5 HTML string snippets passed into generator user message

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| openai ^6.x | zod ^3.24.x | `openai/helpers/zod` imports from `"zod"` — resolves to v3. Confirmed working. |
| openai ^6.x | Next.js 16 / Node.js 20 | SDK v6+ uses built-in fetch (migrated from node-fetch). Works natively in Node.js 20+ |
| zod ^3.24.x | TypeScript ^5 | Full compatibility |
| DaisyUI 4.x (CDN) | Tailwind CSS v4 (CDN) | These are loaded in generated HTML output, not in the host app. CDN versions are independent of host app's Tailwind v4 PostCSS setup. No conflict. |

---

## Sources

- [OpenAI Prompt Caching guide](https://developers.openai.com/api/docs/guides/prompt-caching) — automatic caching behavior, 1024-token minimum, prefix match rules (HIGH confidence)
- [OpenAI Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs) — `response_format: json_schema`, `zodResponseFormat`, `strict: true` behavior (HIGH confidence)
- [OpenAI npm page](https://www.npmjs.com/package/openai) — confirmed latest stable v6.27.0, Node.js 20+ requirement (HIGH confidence)
- [Zod npm page](https://www.npmjs.com/package/zod) — v4.3.x is current but v3 is default npm resolution; v4 uses subpath exports (HIGH confidence)
- `D:/STEVE/steve/package.json` — existing openai ^6.32.0, no zod direct dependency confirmed (HIGH confidence — source code)
- `D:/STEVE/steve/src/lib/ai-pipeline/*.ts` — existing pipeline pattern confirmed: separate modules per step, OpenAI client instantiated per module, gpt-4o-mini for analysis/research, gpt-4o for generation (HIGH confidence — source code)

---
*Stack research for: Enhanced AI Pipeline v1.1 — Website Generator*
*Researched: 2026-03-19*
