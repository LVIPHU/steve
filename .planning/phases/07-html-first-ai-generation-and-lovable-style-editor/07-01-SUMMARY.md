---
phase: 07-html-first-ai-generation-and-lovable-style-editor
plan: 01
subsystem: backend
tags: [database, api, ai, html-generation, testing]
dependency_graph:
  requires: []
  provides: [htmlContent-db-column, generate-html-api, html-prompt-utilities]
  affects: [src/db/schema.ts, src/app/api/websites/[id]/route.ts]
tech_stack:
  added: []
  patterns: [text-output-openai-no-response-format, fresh-vs-edit-prompt-switching]
key_files:
  created:
    - src/lib/html-prompts.ts
    - src/lib/html-prompts.test.ts
    - src/app/api/ai/generate-html/route.ts
  modified:
    - src/db/schema.ts
    - src/app/api/websites/[id]/route.ts
decisions:
  - htmlContent column applied via direct SQL ALTER TABLE due to drizzle-kit push upstream bug with CHECK constraints (same as Plan 05-01)
  - stripMarkdownFences regex uses (?:html?)? optional non-capturing group to handle both bare and html-tagged fences
  - maxDuration=90 matches AbortSignal.timeout(90000) — HTML generation needs more time than JSON AST generation (30s)
  - No response_format on OpenAI call — HTML output is plain text, not JSON
metrics:
  duration: "3m 34s"
  completed: "2026-03-19"
  tasks: 2
  files: 5
---

# Phase 7 Plan 01: HTML-First Foundation Summary

HTML generation foundation with DB column, extended PATCH handler, and GPT-4o route backed by unit-tested prompt utilities.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | DB schema + PATCH extension + prompt utilities with tests | 925585a | schema.ts, route.ts, html-prompts.ts, html-prompts.test.ts |
| 2 | POST /api/ai/generate-html route | e5deb05 | src/app/api/ai/generate-html/route.ts |

## What Was Built

**DB column:** `htmlContent TEXT` (nullable) added to `websites` table as `html_content` column. Applied via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` due to drizzle-kit upstream bug.

**PATCH extension:** `/api/websites/[id]` now accepts `html_content` string field. Validates type, sets `updateSet.htmlContent`.

**Prompt utilities (`src/lib/html-prompts.ts`):**
- `buildFreshSystemPrompt()` — system prompt for fresh HTML generation: Tailwind CDN, localStorage `appgen-` prefix, mobile-first, output-only-HTML rule
- `buildEditSystemPrompt(currentHtml)` — edit mode prompt embedding current HTML verbatim
- `stripMarkdownFences(raw)` — regex strip of opening/closing fences (handles `html`, bare, and no-lang variants)

**Generate-HTML route (`POST /api/ai/generate-html`):**
- Auth + ownership check pattern from existing `/api/ai/generate`
- Fresh vs edit mode selection via `Boolean(currentHtml)`
- GPT-4o call with `maxDuration=90` and `AbortSignal.timeout(90000)`
- No `response_format` — HTML is plain text output
- `stripMarkdownFences` applied before DB save
- Auto-saves to `websites.htmlContent` and returns `{ ok: true, html }`

## Test Results

8/8 unit tests pass covering:
- `buildFreshSystemPrompt` contains CDN reference, appgen- prefix, DOCTYPE instruction
- `buildEditSystemPrompt` embeds currentHtml verbatim, preserves appgen- reference
- `stripMarkdownFences` handles html-tagged fences, bare fences, and clean HTML passthrough

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed stripMarkdownFences regex for bare fences**
- **Found during:** Task 1 test execution
- **Issue:** Plan-specified regex `/^```html?\s*/i` only matches ` ```h ` or ` ```html ` — it does not match bare ` ``` ` (the `l?` makes `l` optional in `html` but `h` is still required)
- **Fix:** Changed to `/^```(?:html?)?\s*/i` — the entire `html?` group is now optional via `(?:html?)?`
- **Files modified:** src/lib/html-prompts.ts
- **Commit:** 925585a

## Self-Check: PASSED

- src/lib/html-prompts.ts: FOUND
- src/lib/html-prompts.test.ts: FOUND
- src/app/api/ai/generate-html/route.ts: FOUND
- Commit 925585a: FOUND
- Commit e5deb05: FOUND

---

**2. [Rule 1 - Bug] DB schema push via direct SQL**
- **Found during:** Task 1 db:push
- **Issue:** drizzle-kit push upstream bug with CHECK constraints (pre-existing, documented in STATE.md 05-01)
- **Fix:** Applied `ALTER TABLE websites ADD COLUMN IF NOT EXISTS html_content TEXT` via postgres.js directly
- **Files modified:** None (DB change only)
- **Commit:** N/A (applied before Task 1 commit)
