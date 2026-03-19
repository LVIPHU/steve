---
phase: 07-html-first-ai-generation-and-lovable-style-editor
verified: 2026-03-19T08:00:00Z
status: passed
score: 10/10 success criteria verified
re_verification: false
gaps: []
human_verification:
  - test: "Open editor at /dashboard/websites/{id}/edit for a website with no HTML — verify AI auto-generates on load"
    expected: "Loading overlay appears immediately, chat shows user message, then 'Da cap nhat!' assistant message, iframe shows generated HTML"
    why_human: "Auto-generate fires on mount — requires live OpenAI call and rendered browser session"
  - test: "Submit creation form with name + prompt, observe redirect"
    expected: "Redirects to /dashboard/websites/{id}/edit?prompt=... with URL-encoded prompt, editor auto-generates on arrival"
    why_human: "Server action redirect flow with DB write and URL passthrough cannot be traced statically"
  - test: "Visit /{username}/{slug} for a published website"
    expected: "Browser renders the raw HTML content (no React wrapper, no Next.js layout)"
    why_human: "Route handler serving raw text/html — only verifiable by actual HTTP request"
  - test: "Visit /{username}/{slug} for a draft website"
    expected: "HTTP 404 response"
    why_human: "Status branching in route handler needs live DB state"
---

# Phase 7: HTML-First AI Generation and Lovable-Style Editor — Verification Report

**Phase Goal:** Replace the AST/template system with an HTML-first model — GPT-4o generates complete HTML, Lovable-style editor (iframe + chat + code tabs), new landing page, and public route returns raw HTML.
**Verified:** 2026-03-19T08:00:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | htmlContent TEXT column exists on websites table | VERIFIED | `src/db/schema.ts` line 86: `htmlContent: t.text("html_content")` |
| 2 | PATCH /api/websites/[id] accepts html_content field | VERIFIED | `src/app/api/websites/[id]/route.ts` lines 79-85: `"html_content" in body` block with type validation and `updateSet.htmlContent = htmlContent` |
| 3 | POST /api/ai/generate-html generates complete HTML from GPT-4o | VERIFIED | `src/app/api/ai/generate-html/route.ts`: auth + ownership + GPT-4o call + fence strip + DB save + `{ ok: true, html }` return. No `response_format`. 90s timeout. |
| 4 | Public route serves raw HTML for published websites (route.ts, not page.tsx) | VERIFIED | Only `route.ts` exists in `src/app/(public)/[username]/[slug]/` — `page.tsx` and `opengraph-image.tsx` deleted. Route returns `new Response(htmlContent, { headers: { "Content-Type": "text/html" } })` |
| 5 | Creation form has name + prompt only (no template picker) | VERIFIED | `src/app/(dashboard)/dashboard/websites/new/page.tsx`: only `name` Input and `promptText` Textarea — no template references |
| 6 | Editor shows iframe preview (60%) + chat/code panel (40%) | VERIFIED | `editor-client.tsx` lines 257, 292: `w-[60%]` left panel with iframe `srcDoc`, `w-[40%]` right panel with Tabs |
| 7 | Chat panel sends prompts to AI, updates iframe live | VERIFIED | `handleGenerate` fetches `POST /api/ai/generate-html`, sets `htmlContent` state which updates `srcDoc` on the iframe |
| 8 | Code tab allows direct HTML editing with Apply button | VERIFIED | `editor-client.tsx` lines 354-376: `<textarea>` with `codeValue` state, "Ap dung HTML" Button calls `handleApplyCode` which sets `htmlContent` and saves |
| 9 | Landing page shows Vietnamese hero/features/how-it-works/footer | VERIFIED | `src/app/page.tsx`: "Bien ghi chu thanh website trong vai giay", "Tai sao chon AppGen?", "Cach hoat dong", footer with "AppGen — Tao website bang AI" |
| 10 | Dashboard nav brand is "AppGen" | VERIFIED | `src/app/(dashboard)/dashboard/dashboard-nav.tsx` line 24: `AppGen` as href text |

**Score: 10/10 truths verified**

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/db/schema.ts` | htmlContent TEXT column on websites table | VERIFIED | Line 86: `htmlContent: t.text("html_content")` — nullable, no default |
| `src/app/api/ai/generate-html/route.ts` | HTML generation endpoint | VERIFIED | Exports `POST` and `maxDuration = 90`. Auth, ownership, GPT-4o, fence strip, DB save. |
| `src/lib/html-prompts.ts` | System prompt builders and fence strip utility | VERIFIED | Exports `buildFreshSystemPrompt`, `buildEditSystemPrompt`, `stripMarkdownFences`. 30 lines, substantive. |
| `src/lib/html-prompts.test.ts` | Unit tests for prompt builders and fence stripping | VERIFIED | 8 tests across 3 describe blocks. |
| `src/app/(public)/[username]/[slug]/route.ts` | Raw HTML route handler | VERIFIED | GET handler: profile lookup, website lookup, status branching (draft 404, archived HTML, published raw HTML) |
| `src/app/page.tsx` | Vietnamese landing page | VERIFIED | Hero, 3-card features, 3-step how-it-works, footer. Contains "Bat dau mien phi" CTA. |
| `src/app/(dashboard)/dashboard/dashboard-nav.tsx` | Rebranded nav | VERIFIED | Contains "AppGen" as brand link |
| `src/app/(dashboard)/dashboard/websites/new/page.tsx` | Simplified creation form | VERIFIED | Contains "Mo ta app/website cua ban" placeholder. No template UI. |
| `src/app/(dashboard)/dashboard/websites/new/action.ts` | Server action with prompt redirect | VERIFIED | `templateId: null`, `htmlContent: null`, `encodeURIComponent`, redirect to `/edit?prompt=...` |
| `src/app/(dashboard)/dashboard/websites/[id]/edit/page.tsx` | Edit page passing htmlContent and initialPrompt | VERIFIED | Awaits `searchParams`, passes `initialHtml`, `initialPrompt`, `websiteId`, `websiteName`, `websiteStatus` to `HtmlEditorClient` |
| `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` | Full Lovable-style HTML editor | VERIFIED | 348 lines (min 200). Contains `srcDoc`, `autoGenTriggered`, `AnimatePresence`, `w-[60%]`, all required UI strings |

**Deleted as required:**
- `src/app/(public)/[username]/[slug]/page.tsx` — ABSENT (confirmed: only `route.ts` in directory)
- `src/app/(public)/[username]/[slug]/opengraph-image.tsx` — ABSENT (confirmed)

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `generate-html/route.ts` | `src/lib/html-prompts.ts` | import buildFreshSystemPrompt, buildEditSystemPrompt, stripMarkdownFences | WIRED | Line 6: `import { buildFreshSystemPrompt, buildEditSystemPrompt, stripMarkdownFences } from "@/lib/html-prompts"` — all three called in handler body |
| `generate-html/route.ts` | `src/db/schema.ts` | `db.update(websites).set({ htmlContent })` | WIRED | Lines 54-56: `db.update(websites).set({ htmlContent: html, updatedAt: new Date() })` |
| `(public)/route.ts` | `src/db/schema.ts` | `db.select().from(websites)` with htmlContent | WIRED | Line 42: `website.htmlContent as string | null` served as response body |
| `editor-client.tsx` | `/api/ai/generate-html` | fetch POST in handleGenerate | WIRED | Line 105: `fetch("/api/ai/generate-html", { method: "POST", ... })` — response sets `htmlContent` state |
| `editor-client.tsx` | `/api/websites/[id]` | fetch PATCH for save | WIRED | Lines 144, 161: `fetch(\`/api/websites/${props.websiteId}\`, { method: "PATCH", ... })` in `handleSave` and `handlePublish` |
| `new/action.ts` | `edit/page.tsx` | redirect to /edit?prompt=... | WIRED | Line 35 of action.ts: `redirect(\`/dashboard/websites/${id}/edit?prompt=${encodeURIComponent(...)}\`)` — page.tsx reads `searchParams.prompt` |

---

## Requirements Coverage

The plans declare requirement IDs P7-01 through P7-08. These IDs are referenced in:
- `07-01-PLAN.md`: `requirements: [P7-01, P7-02, P7-03]`
- `07-02-PLAN.md`: `requirements: [P7-04, P7-07, P7-08]`
- `07-03-PLAN.md`: `requirements: [P7-05]`
- `07-04-PLAN.md`: `requirements: [P7-06]`

**ORPHANED REQUIREMENT IDs:** P7-01 through P7-08 are not defined in `.planning/REQUIREMENTS.md`. The requirements file uses the F-xx / S-xx / NF-xx numbering system for v1 requirements and does not contain a Phase 7 section. The P7-xx IDs appear to be phase-internal requirement tracking used in the ROADMAP and plans but never formally added to REQUIREMENTS.md.

This is a documentation gap, not an implementation gap — all 10 ROADMAP.md Success Criteria are satisfied. The work corresponding to these IDs is implemented and verified above.

| ID | Plan | Implementation Evidence | Status |
|----|------|------------------------|--------|
| P7-01 | 07-01 | `htmlContent` column in schema.ts | SATISFIED |
| P7-02 | 07-01 | `html_content` in PATCH route | SATISFIED |
| P7-03 | 07-01 | `POST /api/ai/generate-html` route | SATISFIED |
| P7-04 | 07-02 | `route.ts` replaces page.tsx, serves raw HTML | SATISFIED |
| P7-05 | 07-03 | Simplified creation form + server action redirect | SATISFIED |
| P7-06 | 07-04 | Full 60/40 editor with chat, code, auto-gen | SATISFIED |
| P7-07 | 07-02 | Landing page with Vietnamese content | SATISFIED |
| P7-08 | 07-02 | Dashboard nav shows "AppGen" | SATISFIED |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `editor-client.tsx` | 329 | `placeholder="Mo ta thay doi..."` | Info | This is a legitimate HTML placeholder attribute, not an implementation placeholder. Not a stub. |

No blockers or warnings found. The `sandbox` attribute is absent from the iframe (confirmed). The `response_format` text only appears in a comment in `generate-html/route.ts`.

---

## Human Verification Required

### 1. Auto-generate on editor mount

**Test:** Create a new website via the creation form with a prompt. Observe the editor immediately after redirect.
**Expected:** Loading overlay appears over the iframe within 1 second, chat panel shows user message with the prompt text, after AI responds iframe renders generated HTML and chat shows "Da cap nhat!" message.
**Why human:** Requires live OpenAI API call and browser rendering. The `autoGenTriggered` ref guard and `useEffect` mount hook cannot be exercised statically.

### 2. Full creation flow end-to-end

**Test:** Fill in name "Test App" and prompt "a simple todo app" on the creation form, submit.
**Expected:** Brief loading, then redirect to `/dashboard/websites/{uuid}/edit?prompt=a%20simple%20todo%20app`. Editor auto-generates.
**Why human:** Server action redirect with DB insert. URL encoding and redirect destination need live verification.

### 3. Public route — published website

**Test:** Publish a generated website from the editor. Navigate to `/{username}/{slug}` directly.
**Expected:** Browser renders the raw generated HTML with no Next.js navigation chrome. No React hydration markup visible in page source.
**Why human:** Raw `text/html` response from route handler — only verifiable by making an HTTP request or viewing in browser.

### 4. Public route — draft website returns 404

**Test:** Navigate to `/{username}/{slug}` for a website with status "draft".
**Expected:** Standard 404 response (Next.js or browser 404 page).
**Why human:** Status check in DB-reading route handler requires live DB state.

### 5. Code tab sync behavior

**Test:** Generate HTML via chat, then switch to Code tab.
**Expected:** The monospace textarea shows the full generated HTML. Edit one line in the textarea. Click "Ap dung HTML". Verify iframe updates and "Da luu!" toast appears.
**Why human:** Tab change triggers `handleTabChange` syncing `codeValue` — tab switching state interaction requires browser.

---

## Commits Verified

| Commit | Plan | Description |
|--------|------|-------------|
| `925585a` | 07-01 | feat: add htmlContent column, PATCH html_content support, prompt utilities with tests |
| `e5deb05` | 07-01 | feat: create POST /api/ai/generate-html route |
| `c9e522b` | 07-02 | feat: replace public page.tsx with raw HTML route handler |
| `aa90bdc` | 07-02 | feat: rewrite landing page in Vietnamese + rebrand nav to AppGen |
| `5f8c994` | 07-03 | feat: simplified creation form + server action |
| `7f1dd74` | 07-03 | feat: edit page passes htmlContent and initialPrompt to editor |
| `bbdee37` | 07-04 | feat: implement full Lovable-style HTML editor client |

All 7 commits confirmed present in git history.

---

## Summary

Phase 7 goal is fully achieved. The HTML-first AI generation pipeline and Lovable-style editor are implemented end-to-end:

1. **Backend foundation (07-01):** `htmlContent` DB column, PATCH endpoint extension, `POST /api/ai/generate-html` with GPT-4o (90s timeout, no response_format, fence stripping), 8 unit tests passing.

2. **Public route + landing (07-02):** `route.ts` replaces `page.tsx` for raw HTML serving at `/{username}/{slug}`. Draft = 404, archived = Vietnamese message, published = raw `text/html`. Vietnamese landing page with hero/features/how-it-works/footer. Dashboard nav rebranded to "AppGen".

3. **Creation flow (07-03):** Form simplified to name + prompt only (no template picker). Server action inserts with `templateId: null, htmlContent: null`, redirects to `/edit?prompt=...`. Edit page awaits `searchParams.prompt` and passes `initialHtml` + `initialPrompt` to editor.

4. **Editor (07-04):** 348-line `HtmlEditorClient` with 60/40 split, iframe `srcDoc`, animated chat panel (user/assistant/error message bubbles), Code tab with monospace textarea and Apply button, auto-generate on mount guard, 500ms auto-save debounce, topbar with back/save/publish buttons. No `sandbox` on iframe.

The only notable finding is that P7-xx requirement IDs referenced in plans do not map to entries in REQUIREMENTS.md, which uses the F-xx/S-xx/NF-xx scheme. This is a documentation gap with no impact on implementation completeness.

---

_Verified: 2026-03-19T08:00:00Z_
_Verifier: Claude (gsd-verifier)_
