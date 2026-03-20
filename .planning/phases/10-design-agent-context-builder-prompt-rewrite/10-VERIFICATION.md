---
phase: 10-design-agent-context-builder-prompt-rewrite
verified: 2026-03-20T12:30:00Z
status: passed
score: 15/15 must-haves verified
re_verification: false
---

# Phase 10: Design Agent, Context Builder, Lean System Prompt Verification Report

**Phase Goal:** Design Agent, Context Builder, and lean System Prompt rewrite that cleanly separates concerns in the AI pipeline
**Verified:** 2026-03-20T12:30:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths — Plan 10-01 (PIPE-04, PIPE-05)

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | DesignResult type exists with preset, palette, and fonts fields | VERIFIED | `src/lib/ai-pipeline/types.ts` lines 20-32: all three fields present with correct shapes |
| 2  | ReviewResult type exists with score, visual, content, technical, must_fix, suggestions fields | VERIFIED | `types.ts` lines 34-41: all 6 fields present with correct types |
| 3  | PipelineEvent.step union includes "design" value | VERIFIED | `types.ts` line 44: `"analyze" \| "research" \| "design" \| "generate" \| "validate" \| "complete" \| "error"` |
| 4  | runDesignAgent() returns a DesignResult using gpt-4o-mini + zodResponseFormat | VERIFIED | `design-agent.ts` lines 42-62: model "gpt-4o-mini", `zodResponseFormat(DesignResultSchema, "design_result")`, `chat.completions.parse()` |
| 5  | Design Agent failure returns clean-minimal fallback instead of throwing | VERIFIED | `design-agent.ts` lines 58-60: `?? FALLBACK_DESIGN` on null parsed + try/catch returns FALLBACK_DESIGN |
| 6  | DesignResultSchema validates correct shapes and rejects invalid ones | VERIFIED | `design-agent.test.ts`: 9 tests covering all 5 presets, invalid preset rejection, missing palette/fonts rejection |

### Observable Truths — Plan 10-02 (PIPE-06, PIPE-07, PIPE-08, PIPE-09)

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 7  | buildUserMessage() produces Markdown with Design Brief, Component References, Page Structure, and User Request sections | VERIFIED | `context-builder.ts` lines 25-38: all 4 sections present; `context-builder.test.ts` 6 tests confirm content |
| 8  | buildEditUserMessage() starts with preserve instruction and has NO Design Brief or Component References | VERIFIED | `context-builder.ts` lines 41-46: starts with "Preserve existing colors and typography"; test confirms absence of both sections |
| 9  | buildSystemPrompt() is invariant — contains zero per-request data | VERIFIED | `html-prompts.ts` line 1: `export function buildSystemPrompt(): string` — zero parameters |
| 10 | buildSystemPrompt() contains CDN links, anti-patterns, CSS rules, and appgen- prefix | VERIFIED | `html-prompts.ts`: `cdn.tailwindcss.com`, `daisyui`, `appgen-`, `perspective: 1000px`, Anti-patterns section all present |
| 11 | buildSystemPrompt() does NOT contain LANDING PAGE or PORTFOLIO template hints | VERIFIED | grep confirmed absence of "LANDING PAGE", "PORTFOLIO / CV", "DASHBOARD / TOOL", "BLOG / DOCS" |
| 12 | buildGoogleFontsImport() produces correct @import url(...) with display=swap | VERIFIED | `context-builder.ts` lines 4-10: deduplication via indexOf, space-to-+ replacement, display=swap; 3 tests pass |
| 13 | refineHtml() exports full signature but throws "Not implemented" | VERIFIED | `context-builder.ts` lines 48-50: correct async signature, throws `Error("Not implemented — Phase 11")` |
| 14 | stripMarkdownFences() still works unchanged | VERIFIED | `html-prompts.ts` lines 73-75: function present and unchanged; 3 tests pass |
| 15 | Existing html-prompts tests updated to match new function signatures | VERIFIED | `html-prompts.test.ts`: 18 tests covering buildSystemPrompt, backward-compat aliases, stripMarkdownFences |

**Score:** 15/15 truths verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/ai-pipeline/types.ts` | DesignResult, ReviewResult interfaces; extended PipelineEvent.step | VERIFIED | All 3 additions present; ResearchResult preserved |
| `src/lib/ai-pipeline/design-agent.ts` | runDesignAgent, FALLBACK_DESIGN, DesignResultSchema | VERIFIED | All 3 exports present, lazy OpenAI init pattern, 63 lines |
| `src/lib/ai-pipeline/design-agent.test.ts` | Unit tests for schema validation and fallback | VERIFIED | 9 tests (5 schema + 4 fallback) |
| `src/lib/ai-pipeline/context-builder.ts` | buildUserMessage, buildEditUserMessage, buildGoogleFontsImport, refineHtml | VERIFIED | All 4 exports present, 51 lines, substantive implementations |
| `src/lib/ai-pipeline/context-builder.test.ts` | Unit tests for context builder functions | VERIFIED | 14 tests across 4 describe blocks |
| `src/lib/html-prompts.ts` | Lean invariant buildSystemPrompt() + stripMarkdownFences() + compat aliases | VERIFIED | 76 lines; buildSystemPrompt, buildFreshSystemPrompt alias, buildEditSystemPrompt wrapper, stripMarkdownFences |
| `src/lib/html-prompts.test.ts` | Updated tests for lean prompt | VERIFIED | 18 tests including no-template-hints assertion |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `design-agent.ts` | `types.ts` | `import type { AnalysisResult, DesignResult }` | WIRED | Line 4: `import type { AnalysisResult, DesignResult } from "./types"` |
| `design-agent.ts` | `openai/helpers/zod` | `zodResponseFormat` | WIRED | Line 2: `import { zodResponseFormat } from "openai/helpers/zod"`; used at line 54 |
| `context-builder.ts` | `types.ts` | `import DesignResult` | WIRED | Line 1: `import type { AnalysisResult, DesignResult, ReviewResult } from "./types"` |
| `context-builder.ts` | `component-library/types.ts` | `import ComponentSnippet` | WIRED | Line 2: `import type { ComponentSnippet } from "@/lib/component-library/types"`; used in function signature line 16 |
| `html-prompts.ts` | `generator.ts` | backward-compat aliases | WIRED | `generator.ts` imports `buildFreshSystemPrompt`, `buildEditSystemPrompt`, `stripMarkdownFences`; all three present in `html-prompts.ts` as exports |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| PIPE-04 | 10-01 | Design Agent (gpt-4o-mini + Zod Structured Output) trả về palette hex, typography Google Fonts, style preset, hero layout | SATISFIED | `design-agent.ts`: model gpt-4o-mini, DesignResultSchema with Zod, zodResponseFormat, palette+fonts in DesignResult |
| PIPE-05 | 10-01 | Design Agent map đúng domain → style preset | SATISFIED | `DESIGN_SYSTEM_PROMPT` in design-agent.ts lines 36-40: explicit domain→preset mapping (fitness→bold-dark, food→warm-organic, education→playful-bright, SaaS→professional-blue, else→clean-minimal) |
| PIPE-06 | 10-02 | CSS variables inject vào HTML output; Google Fonts @import đặt đầu tiên | SATISFIED | `buildSystemPrompt()` instructs AI to set `--color-primary, --color-secondary, --color-accent, --color-bg` and place Google Fonts @import at top of style block; `buildGoogleFontsImport()` builds the correct URL |
| PIPE-07 | 10-02 | System prompt lean ~800 tokens (invariant rules only) | SATISFIED | `buildSystemPrompt()` takes zero params, no per-request data; template hints removed; `html-prompts.test.ts` asserts absence of all 4 template hint blocks |
| PIPE-08 | 10-02 | buildUserMessage() synthesizes design brief + component references + analysis + user prompt | SATISFIED | `context-builder.ts` buildUserMessage() with all 4 sections; 14 tests verify structure |
| PIPE-09 | 10-02 | Edit mode receives "preserve existing colors and typography" instruction | SATISFIED | `buildEditUserMessage()` starts with preserve instruction; `buildEditSystemPrompt()` backward-compat wrapper also contains it |

All 6 requirement IDs satisfied. No orphaned requirements.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `context-builder.ts` | 49 | `throw new Error("Not implemented — Phase 11")` | INFO | Intentional placeholder per plan — refineHtml is a Phase 11 stub, correctly documented |

No blockers. The only "placeholder" is `refineHtml()` which is explicitly scoped to Phase 11 and exported with correct signature as required by the plan.

---

## Commit Verification

All 5 commits documented in SUMMARYs verified to exist in git history:
- `76ac5db` — feat: Zod v3 + types.ts extensions
- `c378d3f` — test: TDD RED design-agent tests
- `65c5680` — feat: TDD GREEN design-agent.ts implementation
- `5df1dd9` — feat: context-builder.ts + tests (TDD green)
- `7ad0651` — feat: html-prompts.ts lean rewrite + updated tests

---

## Human Verification Required

None — all phase 10 outputs are pure logic/string-building functions with no UI, no external service calls at test time, and no real-time behavior. The Design Agent's actual AI output quality (PIPE-05: does it correctly pick bold-dark for a fitness prompt in production?) would require a live OpenAI call to confirm, but that is an integration concern outside the scope of this phase's code deliverables.

---

## Summary

Phase 10 goal is fully achieved. The AI pipeline's concerns are cleanly separated:

- **Design Agent** (`design-agent.ts`): isolated gpt-4o-mini call with Zod Structured Output, FALLBACK_DESIGN safety net, domain-to-preset mapping in system prompt
- **Context Builder** (`context-builder.ts`): assembles per-request user message (Design Brief + Component References + Page Structure + User Request) and edit-mode preserve-first message
- **Lean System Prompt** (`html-prompts.ts`): zero-parameter invariant function stripped of all template hints, enabling OpenAI prompt caching
- **Backward compatibility**: `buildFreshSystemPrompt` alias and `buildEditSystemPrompt` wrapper keep `generator.ts` compiling without modification (Phase 11 migration deferred by design)

All 41 tests across 3 test files are substantive and map directly to the must-have truths. No regressions introduced.

---

_Verified: 2026-03-20T12:30:00Z_
_Verifier: Claude (gsd-verifier)_
