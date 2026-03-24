---
phase: 15-critical-bug-fixes
verified: 2026-03-24T23:00:00Z
status: human_needed
score: 5/5 must-haves verified
human_verification:
  - test: "Confirm streaming preview is visible through loading overlay"
    expected: "User should be able to see HTML building progressively in the iframe during generation — the backdrop overlay partially obscures this"
    why_human: "The iframe srcDoc IS updated with streaming chunks but the loading overlay (bg-background/70 backdrop-blur-sm) dims and blurs the preview during generation. Cannot determine programmatically whether the visual effect is acceptable or whether it constitutes a blocker for the stated goal of 'user thay the HTML xuat hien tung chu trong preview'"
---

# Phase 15: Critical Bug Fixes Verification Report

**Phase Goal:** Fix 3 critical bugs — edit mode currentHtml, streaming generation, system prompt split
**Verified:** 2026-03-24T23:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | buildEditUserMessage() receives and injects currentHtml parameter | VERIFIED | `context-builder.ts` line 52-80: signature is `(prompt, currentHtml, otherPagesContext?)`, injects `## Current HTML (DO NOT discard — modify in place)\n${currentHtml}` |
| 2 | generateHtml() uses streaming (stream: true + for await loop) | VERIFIED | `generator.ts` lines 10-36: `stream: true` in create call, `for await (const chunk of stream)` loop, `onChunk?.(content)` callback |
| 3 | buildSystemPrompt() has mode parameter for fresh vs edit | VERIFIED | `html-prompts.ts` line 1: `buildSystemPrompt(mode: "fresh" \| "edit" = "fresh")`, returns 7-line compact prompt when `mode === "edit"`, full 120-line prompt otherwise |
| 4 | Pipeline emits streaming events to frontend | VERIFIED | `index.ts` lines 60-64: `generateHtml(userMessage, isEditMode ? "edit" : "fresh", (chunk) => onEvent({ step: "generate", status: "streaming", chunk }))` |
| 5 | Editor client handles streaming events for live preview | VERIFIED | `editor-client.tsx` lines 326-335: accumulates `event.chunk` into `streamBufferRef.current`, throttles `setPages` update to 100ms |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/ai-pipeline/context-builder.ts` | buildEditUserMessage with currentHtml param | VERIFIED | 80 lines, signature matches plan exactly, `## Current HTML` section injected |
| `src/lib/ai-pipeline/generator.ts` | stream: true + for await + onChunk | VERIFIED | 37 lines, complete streaming implementation |
| `src/lib/html-prompts.ts` | buildSystemPrompt(mode) | VERIFIED | 133 lines, mode branching at line 2, edit prompt 7 lines, fresh prompt preserved |
| `src/lib/ai-pipeline/types.ts` | PipelineEvent with status: "streaming" and chunk? field | VERIFIED | Lines 39-40: `status: "start" \| "done" \| "streaming"`, `chunk?: string` |
| `src/lib/ai-pipeline/index.ts` | Pipeline passes currentHtml and emits streaming events | VERIFIED | Line 44: `buildEditUserMessage(prompt, currentHtml!)`, lines 60-64: onChunk callback |
| `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` | streamBufferRef + streamThrottleRef + chunk handler | VERIFIED | Lines 116-117: refs declared, lines 326-346: full streaming + complete event handling |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `context-builder.ts: buildEditUserMessage` | LLM user message | `currentHtml` param (2nd positional, required) | WIRED | Called at `index.ts:44` as `buildEditUserMessage(prompt, currentHtml!)` — non-null assertion confirms always passed in edit mode |
| `generator.ts: generateHtml` | OpenAI API | `stream: true` + `for await` | WIRED | `stream: true` in create options, `for await (const chunk of stream)` at line 28 |
| `html-prompts.ts: buildSystemPrompt` | generator.ts | `mode` param | WIRED | `generator.ts:19` calls `buildSystemPrompt(mode)` — mode flows from `index.ts:62` as `isEditMode ? "edit" : "fresh"` |
| `index.ts: onChunk callback` | SSE route | `onEvent({ step: "generate", status: "streaming", chunk })` | WIRED | `index.ts:63` passes callback, SSE route uses `ReadableStream` + `controller.enqueue()` with no buffering |
| `editor-client.tsx: streaming handler` | iframe srcDoc | `streamBufferRef` + `setPages` via `streamThrottleRef` | WIRED | Lines 326-335: chunk accumulated, `setPages` called every 100ms |
| `editor-client.tsx: complete handler` | iframe srcDoc | `event.html` (validated) replaces buffer | WIRED | Lines 337-346: throttle cleared, `setPages` and `setCodeValue` called with `event.html` |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `editor-client.tsx` (iframe) | `currentPageHtml` | `pages[currentPage]` state, updated via `setPages` in streaming handler | Yes — populated from OpenAI streaming chunks then replaced by validated HTML on `complete` | FLOWING |
| `context-builder.ts: buildEditUserMessage` | `currentHtml` | Passed from `index.ts` which receives it as pipeline param from API route, which reads it from request body (set by editor to `currentPageHtml \|\| undefined`) | Yes — `editor-client.tsx:293` sends `currentHtml: currentPageHtml \|\| undefined` | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| generateHtml exports async function with 3 params | `node -e "const m = require('./src/lib/ai-pipeline/generator.ts')"` | SKIP — TypeScript source, not runnable directly | SKIP |
| buildSystemPrompt returns short edit prompt | Read `html-prompts.ts` lines 1-13 | Edit branch: 7-line compact prompt confirmed in source | PASS (static) |
| buildEditUserMessage injects currentHtml | Read `context-builder.ts` lines 52-80 | `## Current HTML` section at line 59, CRITICAL RULES at lines 66-77 | PASS (static) |
| Commits exist in repo | `git log --oneline 2b43bd9 110fedb 7ab2ffc ce79075 89f39c1 a539bc7 7b1bc1c` | All 7 commits verified present | PASS |

### Requirements Coverage

No requirement IDs were specified for this phase. Phase addressed 3 bugs documented in CONTEXT.md and PLAN files. All 3 bugs have verified fixes:

| Bug | Fix | Status |
|-----|-----|--------|
| Bug #1 — edit mode not sending currentHtml | buildEditUserMessage now requires currentHtml as 2nd param; index.ts passes `currentHtml!` | FIXED |
| Bug #2 — blocking generation (no streaming) | generateHtml uses stream:true + for await; pipeline emits status:streaming events; editor accumulates chunks | FIXED |
| Bug #3 — system prompt too heavy for edit mode | buildSystemPrompt(mode) returns 7-line compact prompt for edit, full 120-line prompt for fresh | FIXED |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `editor-client.tsx` | 638-650 | `isGenerating` loading overlay with `backdrop-blur-sm` sits on top of iframe during entire generation | WARNING | Streaming chunks DO update `pages` state and iframe `srcDoc`, but the `bg-background/70 backdrop-blur-sm` overlay visually obscures the progressive preview. The plan goal states "user thay the HTML xuat hien tung chu trong preview" — this is partially blocked by the overlay. Chunks are streaming correctly at the code level but may not be perceptible to the user during active generation. |

No TODO/FIXME/placeholder comments found in modified files. No empty return stubs. All streaming logic is substantive.

### Human Verification Required

#### 1. Streaming Preview Visibility Through Loading Overlay

**Test:** Open the editor, create a new page or edit an existing one, trigger generation. Watch the iframe during generation.

**Expected:** Either (a) streaming HTML builds up visibly behind/through the overlay giving progressive feedback, OR (b) the overlay is intentional UX and the streaming primarily benefits perceived performance (time-to-first-byte) rather than progressive visual display.

**Why human:** The loading overlay (`absolute inset-0`, `bg-background/70 backdrop-blur-sm`, z-index above iframe) is rendered while `isGenerating=true`. The iframe `srcDoc` IS being updated via `setPages` every 100ms with accumulated chunks. Whether the blurred partial HTML is legible/useful to users, or whether the overlay should be removed/modified to allow clear streaming preview, requires a human judgment call. If the intent is a "streaming preview" (as stated in the plan), the overlay may be undermining the user experience even though the wiring is technically correct.

### Gaps Summary

No hard gaps found. All 5 must-haves are verified at all levels (exists, substantive, wired, data flowing). All 7 documented commits are present in the repo. The one warning — the loading overlay partially obscuring the streaming preview — requires human judgment on whether it constitutes a UX gap versus an intentional design choice.

---

_Verified: 2026-03-24T23:00:00Z_
_Verifier: Claude (gsd-verifier)_
