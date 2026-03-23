---
phase: 11-reviewer-pipeline-rewire-ui-update
verified: 2026-03-20T09:30:00Z
status: human_needed
score: 13/13 automated must-haves verified
human_verification:
  - test: "Tạo website mới với ENABLE_REFINE=true và kiểm tra chat panel hiển thị đủ 7 step labels theo thứ tự"
    expected: "Chat panel hiển thị: Phân tích yêu cầu... → Chọn components phù hợp... → Thiết kế visual identity... → Đang tạo HTML... → Kiểm tra chất lượng... → Tinh chỉnh kết quả... (chỉ khi triggered) → Kiểm tra kết quả..."
    why_human: "SSE step rendering phụ thuộc vào browser runtime và live OpenAI calls"
  - test: "Chỉnh sửa website đã có HTML và kiểm tra chỉ 4 bước xuất hiện"
    expected: "Chat panel chỉ hiển thị 4 bước: analyze, components, generate, validate — không có design/review/refine"
    why_human: "Edit mode branching requires live generation with currentHtml populated"
  - test: "Xác nhận calibration pass PIPE-20 đã hoàn tất"
    expected: ".calibration.jsonl tồn tại với >= 10 entries sau 10+ lượt generate; threshold 75 được xác nhận"
    why_human: "Requires live OpenAI calls; human already approved per SUMMARY but .calibration.jsonl is gitignored so cannot verify file contents"
  - test: "Xác nhận Vercel Hobby plan maxDuration=60 phù hợp (PIPE-18)"
    expected: "Vercel dashboard shows Hobby tier; maxDuration=60 is within limit"
    why_human: "Requires Vercel dashboard access to confirm plan tier"
---

# Phase 11: Reviewer Pipeline Rewire UI Update — Verification Report

**Phase Goal:** Pipeline chạy đúng 7 bước (fresh) / 4 bước (edit); Reviewer chấm điểm và gate Refine; UI hiển thị progress cho tất cả 7 bước; researcher.ts cũ bị xóa; Vercel timeout được xác nhận.
**Verified:** 2026-03-20T09:30:00Z
**Status:** human_needed (13/13 automated checks passed; 4 items require human/live verification)
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | reviewHtml() trả về ReviewResult với score 0-100 và 3 dimension sub-scores | VERIFIED | reviewer.ts line 61: `export async function reviewHtml(prompt, html): Promise<ReviewResult>` với zodResponseFormat(ReviewResultSchema, "review_result") |
| 2 | FALLBACK_REVIEW có score=100 và empty must_fix | VERIFIED | reviewer.ts lines 23-26: `score: 100, visual: 40, content: 30, technical: 30, must_fix: [], suggestions: []` |
| 3 | PipelineEvent.step union bao gồm components/review/refine và không có research | VERIFIED | types.ts line 38: `step: "analyze" \| "components" \| "design" \| "generate" \| "review" \| "refine" \| "validate" \| "complete" \| "error"` — 9 giá trị, không có "research" |
| 4 | STEP_LABELS trong editor-client.tsx có đúng 7 keys với Vietnamese labels, không có research | VERIFIED | editor-client.tsx lines 149-157: 7 keys (analyze, components, design, generate, review, refine, validate), không có research key |
| 5 | Calibration log ghi vào .calibration.jsonl sau mỗi review call | VERIFIED | reviewer.ts lines 40-59: `appendCalibrationLog()` với `fs.appendFileSync(path.join(process.cwd(), ".calibration.jsonl"), ...)` trong try/catch |
| 6 | Orchestrator fresh mode emit đúng 5 SSE steps khi ENABLE_REFINE=false | VERIFIED | index.ts: analyze→components→design→generate→validate; review/refine block gated by `if (!isEditMode && enableRefine)` |
| 7 | Orchestrator fresh mode emit đúng 7 SSE steps khi ENABLE_REFINE=true | VERIFIED | index.ts lines 64-81: review step + conditional refine step trong `if (!isEditMode && enableRefine)` block |
| 8 | Edit mode emit đúng 4 SSE steps: analyze, components, generate, validate | VERIFIED | index.ts lines 41-44: `if (isEditMode)` skips design; review/refine gated by `!isEditMode`; emits 4 events |
| 9 | Refine trigger khi score < REVIEW_THRESHOLD hoặc must_fix.length > 0 | VERIFIED | index.ts line 75: `const needsRefine = review.score < reviewThreshold \|\| review.must_fix.length > 0` |
| 10 | REVIEW_THRESHOLD mặc định 75 khi env var không có | VERIFIED | index.ts line 19: `parseInt(process.env.REVIEW_THRESHOLD ?? "75", 10)` — read inside function body |
| 11 | researcher.ts không tồn tại và typecheck sạch | VERIFIED | `ls src/lib/ai-pipeline/` xác nhận researcher.ts vắng mặt; git log xác nhận xóa trong commit 0f5afeb; typecheck chỉ có 1 pre-existing error không liên quan |
| 12 | maxDuration = 60 (Hobby plan safe) | VERIFIED | route.ts line 8: `export const maxDuration = 60; // Hobby plan limit` |
| 13 | refineHtml() gửi chỉ must_fix list + current HTML (không có component snippets) | VERIFIED | context-builder.ts lines 56-73: user message chỉ chứa `Fix the following issues` + must_fix list + `Current HTML` — không có Design Brief hay Component References |

**Score:** 13/13 truths verified (automated)

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/ai-pipeline/reviewer.ts` | reviewHtml() với gpt-4o-mini + zodResponseFormat scoring | VERIFIED | 81 dòng; exports reviewHtml, ReviewResultSchema, FALLBACK_REVIEW; lazy init, AbortSignal.timeout(20000), appendFileSync |
| `src/lib/ai-pipeline/reviewer.test.ts` | Unit tests cho schema validation và FALLBACK_REVIEW | VERIFIED | 8 tests; 5 schema bounds tests + 3 FALLBACK_REVIEW tests; all passing |
| `src/lib/ai-pipeline/types.ts` | PipelineEvent.step với 9 values bao gồm components/review/refine | VERIFIED | 44 dòng; ResearchResult đã xóa; PipelineEvent.step có 9 values |
| `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` | STEP_LABELS với 7 Vietnamese keys | VERIFIED | Lines 149-157; 7 keys với diacritics đúng theo UI-SPEC |
| `src/lib/ai-pipeline/index.ts` | 7-step fresh / 5-step hobby / 4-step edit orchestrator | VERIFIED | 99 dòng; đầy đủ logic phân nhánh; tất cả imports được wire |
| `src/lib/ai-pipeline/generator.ts` | generateHtml(userMessage) signature mới | VERIFIED | 24 dòng; signature `generateHtml(userMessage: string): Promise<string>`; lazy init; không còn buildEnrichedSystemPrompt |
| `src/lib/ai-pipeline/context-builder.ts` | refineHtml() được implement (không còn throw) | VERIFIED | Lines 56-73; gọi gpt-4o với must_fix-only user message; AbortSignal.timeout(60000) |
| `src/app/api/ai/generate-html/route.ts` | maxDuration = 60 | VERIFIED | Line 8: `export const maxDuration = 60` |
| `src/lib/html-prompts.ts` | buildFreshSystemPrompt và buildEditSystemPrompt đã xóa | VERIFIED | 57 dòng; chỉ exports buildSystemPrompt() và stripMarkdownFences() |
| `src/lib/ai-pipeline/researcher.ts` | DELETED | VERIFIED | File không tồn tại; xóa trong commit 0f5afeb |
| `.gitignore` | .calibration.jsonl entry | VERIFIED | Lines 43-44: `# calibration log (AI reviewer output, developer-only)` + `.calibration.jsonl` |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `index.ts` | `reviewer.ts` | import reviewHtml | WIRED | index.ts line 5: `import { reviewHtml } from "./reviewer"` |
| `index.ts` | `context-builder.ts` | import buildUserMessage, buildEditUserMessage, refineHtml | WIRED | index.ts line 6: `import { buildUserMessage, buildEditUserMessage, refineHtml } from "./context-builder"` |
| `index.ts` | `component-library` | import selectComponents | WIRED | index.ts line 7: `import { selectComponents } from "@/lib/component-library"` |
| `index.ts` | `design-agent.ts` | import runDesignAgent | WIRED | index.ts line 4: `import { runDesignAgent } from "./design-agent"` |
| `generator.ts` | `html-prompts.ts` | import buildSystemPrompt, stripMarkdownFences | WIRED | generator.ts line 2: `import { buildSystemPrompt, stripMarkdownFences } from "@/lib/html-prompts"` |
| `reviewer.ts` | `types.ts` | import ReviewResult | WIRED | reviewer.ts line 4: `import type { ReviewResult } from "./types"` |
| `reviewer.ts` | `.calibration.jsonl` | fs.appendFileSync | WIRED | reviewer.ts lines 52-55: `fs.appendFileSync(path.join(process.cwd(), ".calibration.jsonl"), ...)` |
| `context-builder.ts` | `html-prompts.ts` | import buildSystemPrompt, stripMarkdownFences | WIRED | context-builder.ts line 2: `import { buildSystemPrompt, stripMarkdownFences } from "@/lib/html-prompts"` |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| PIPE-10 | 11-01 | Reviewer chấm điểm HTML 0-100 theo 3 dimensions: visual(40), content(30), technical(30) | SATISFIED | ReviewResultSchema với bounds validation; reviewHtml() dùng gpt-4o-mini + zodResponseFormat |
| PIPE-11 | 11-02 | Refine pass chỉ fire khi score < threshold hoặc must_fix[] non-empty | SATISFIED | index.ts line 75: `needsRefine = review.score < reviewThreshold \|\| review.must_fix.length > 0` |
| PIPE-12 | 11-02 | Refine dùng separate message builder (không re-inject component snippets) | SATISFIED | context-builder.ts refineHtml(): userMessage chỉ chứa must_fix list + current HTML |
| PIPE-13 | 11-02 | Review threshold exposed qua env var REVIEW_THRESHOLD (default 75) | SATISFIED | index.ts line 19: `parseInt(process.env.REVIEW_THRESHOLD ?? "75", 10)` inside function |
| PIPE-14 | 11-02 | Fresh mode chạy 7 bước: analyze → components → design → generate → review → refine → validate | SATISFIED | index.ts: đủ 7 step events khi ENABLE_REFINE=true (refine conditional); 5 bước khi false |
| PIPE-15 | 11-02 | Edit mode chạy 4 bước: analyze → components → generate → validate | SATISFIED | index.ts: isEditMode skips design block; `!isEditMode` gates review/refine |
| PIPE-16 | 11-01 | PipelineEvent.step union extended với "components", "design", "review", "refine" | SATISFIED | types.ts line 38: tất cả 4 values có mặt, "research" đã xóa |
| PIPE-17 | 11-01 | STEP_LABELS updated với labels tiếng Việt cho 7 bước | SATISFIED | editor-client.tsx lines 149-157: 7 keys với diacritics đúng |
| PIPE-18 | 11-02 | Verify Vercel plan tier; Hobby → disable refine hoặc gate bằng ENABLE_REFINE | SATISFIED (partial) | maxDuration=60; ENABLE_REFINE default false; plan tier verification cần human (xem Human Verification) |
| PIPE-19 | 11-02 | researcher.ts bị xóa khỏi pipeline và imports | SATISFIED | File không tồn tại; không có import nào đến researcher trong codebase |
| PIPE-20 | 11-02 | Calibration pass (≥10 websites) verify review score distribution | SATISFIED (human-approved) | SUMMARY 11-02 ghi nhận human-approved checkpoint; threshold 75 confirmed; .calibration.jsonl gitignored |

**Orphaned requirements check:** Tất cả 11 requirement IDs từ PLAN frontmatter (PIPE-10 đến PIPE-20) đều được REQUIREMENTS.md map về Phase 11. Không có orphaned requirements.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/api/auth/token-login/route.ts` | 6 | Pre-existing TS2307 error: missing `better-call` type declarations | Info | Pre-existing lỗi xác nhận từ trước Phase 11 (git stash verified trong SUMMARY 11-01). Không liên quan đến phase này. |

Không phát hiện anti-pattern nào trong các file được tạo/sửa trong Phase 11:
- Không có stub implementations (return null, throw "Not implemented")
- Không có console.log-only handlers
- Không có empty return objects/arrays trong production paths
- Không có TODO/FIXME trong code mới
- refineHtml() là real implementation, không phải placeholder

---

## Human Verification Required

### 1. 7-step UI progress trong fresh mode

**Test:** Đặt `ENABLE_REFINE=true` trong `.env`, chạy `npm run dev`, tạo website mới với prompt đủ phức tạp (ví dụ: "Create a fitness website with workout tracker").
**Expected:** Chat panel hiển thị lần lượt: "Phân tích yêu cầu..." → "Chọn components phù hợp..." → "Thiết kế visual identity..." → "Đang tạo HTML..." → "Kiểm tra chất lượng..." → "Tinh chỉnh kết quả..." (nếu score < 75 hoặc must_fix non-empty) → "Kiểm tra kết quả..."
**Why human:** SSE step rendering và live OpenAI calls không thể verify bằng static code analysis.

### 2. 4-step UI progress trong edit mode

**Test:** Mở website đã có HTML trong editor, gửi edit prompt (ví dụ: "Change the title color to red").
**Expected:** Chat panel chỉ hiển thị 4 bước: analyze → components → generate → validate. Không có design, review, refine steps.
**Why human:** Edit mode branching (`isEditMode = !!currentHtml`) requires live currentHtml được populated.

### 3. Calibration pass PIPE-20

**Test:** Chạy `wc -l .calibration.jsonl` (nếu tồn tại) và kiểm tra format entries.
**Expected:** >= 10 lines với format `{"timestamp":"...","prompt":"...","score":N,...}`. Score distribution hợp lý (không phải tất cả = 100 from FALLBACK).
**Why human:** .calibration.jsonl là gitignored nên không thể verify trong codebase. Human-approved checkpoint đã được ghi trong SUMMARY 11-02 nhưng file contents không thể đọc từ git.

### 4. Vercel Hobby plan confirmation (PIPE-18)

**Test:** Truy cập vercel.com → Project Settings → Functions → kiểm tra Max Duration limit.
**Expected:** Hobby plan limit là 60s; `maxDuration = 60` trong route.ts là compliant.
**Why human:** Requires Vercel dashboard access.

---

## Gaps Summary

Không có gaps. Tất cả 13 automated truths được verified. 4 items được flag cho human verification là behavioral/operational (không phải code gaps) — tất cả có code foundations đúng trong codebase.

**Lưu ý về typecheck:** `npm run typecheck` có 1 error tại `src/app/api/auth/token-login/route.ts` (TS2307: missing `better-call` types). Đây là lỗi pre-existing trước Phase 11, được xác nhận bởi cả hai SUMMARY files và không liên quan đến các thay đổi của phase này.

---

_Verified: 2026-03-20T09:30:00Z_
_Verifier: Claude (gsd-verifier)_
