# Phase 11: Reviewer + Pipeline Rewire + UI Update - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Hoàn thành toàn bộ v1.1 pipeline: tạo `reviewer.ts` (quality gate 0-100), implement `refineHtml()` (đã có stub từ Phase 10), rewire `index.ts` orchestrator thành 7 bước fresh / 4 bước edit, xóa `researcher.ts` + cleanup imports, cập nhật `STEP_LABELS` trong editor-client.tsx, xử lý Vercel timeout constraint, và hoàn thành calibration pass trước khi ship.

Không bao gồm: user-visible style selector, Design Agent trong edit mode — đã defer.

</domain>

<decisions>
## Implementation Decisions

### Reviewer — Scoring Rubrics
- **Visual (40 điểm):** Claude tự quyết design rubric. Nên tập trung vào những gì user thực sự thấy ngay: color contrast, palette nhất quán, font hierarchy, layout không broken (overflow, misalignment). Gợi ý: check CSS custom properties present, Google Fonts @import đúng format, không dùng màu hardcode mâu thuẫn với palette.
- **Content (30 điểm):** Reviewer nhận **cả prompt gốc lẫn HTML** để biết intent và kiểm tra compliance. Ví dụ: user yêu cầu quiz/flashcard nhưng HTML không có → phát hiện được. Tốn thêm ~500 tokens nhưng cần thiết.
- **Technical (30 điểm):** Claude tự quyết rubric dựa trên anti-patterns đã có trong system prompt. Gợi ý: không dùng `alert()`, không dùng Alpine `x-for`, localStorage dùng đúng prefix `appgen-`, CDN links đủ, JavaScript không bị broken (null reference, syntax error).
- **must_fix[] — scope:** Reviewer tự judge **any quality issue** (không chỉ critical). Reviewer prompt: `"must_fix = issues that materially break functionality or clearly violate user intent"`. Claude có thể mở rộng thêm: layout issues, color issues, content gaps đều có thể vào must_fix nếu reviewer đánh giá là material.
- **Refine loop:** 1 refine pass duy nhất — không re-review sau refine. Review → refine (nếu cần) → validate. Predictable latency, phù hợp Vercel timeout constraint.

### refineHtml() Implementation
- **Model:** `gpt-4o` (cùng generator, đủ mạnh xử lý complex HTML/JS)
- **System prompt:** Same lean invariant `buildSystemPrompt()` từ `html-prompts.ts` — không cần refine-specific system prompt
- **User message format:**
  ```
  Fix the following issues in the HTML:

  [must_fix items as numbered list]

  Current HTML:
  [full HTML]
  ```
  Không re-inject component snippets (PIPE-12). Không gửi lại design brief hay original user prompt.
- **Output:** Full HTML (không phải diff) — dễ parse, GPT-4o trả về complete document
- **Timeout:** 60s (same as generator — HTML refine tương đương độ phức tạp)
- **Trigger logic:** Fire khi `score < REVIEW_THRESHOLD` OR `must_fix.length > 0` (từ PIPE-11)

### Calibration Approach
- **Log format:** Append-only `.calibration.jsonl` ở root directory (thêm vào `.gitignore`)
- **Mỗi entry:** `{timestamp, prompt, score, visual, content, technical, must_fix_count, triggered_refine}`
- **Khi nào log:** `reviewer.ts` luôn append sau mỗi review call (dev + production)
- **Calibration task:** Planner include task trong Phase 11 plan (PIPE-20 là requirement). Task: test ≥10 prompts đa dạng, check score distribution, verify threshold 75 hợp lý, điều chỉnh REVIEW_THRESHOLD env var nếu cần trước khi ship.
- **Threshold adjustment:** Chỉ cần sửa `REVIEW_THRESHOLD` env var — không cần code change.

### Hobby Plan + Vercel Timeout
- **Hiện trạng:** User đang dùng Vercel **Hobby plan** (max 60s function timeout)
- **ENABLE_REFINE=false (default trên Hobby):** UI ẩn hoàn toàn review + refine steps. Pipeline chạy 5 bước: analyze → components → design → generate → validate. Không hiển thị "disabled" state.
- **STEP_LABELS:** Chỉ hiển thị steps tương ứng mode + ENABLE_REFINE setting. Nếu refine enabled: 7 bước (fresh) hoặc 4 bước (edit). Nếu disabled: 5 bước (fresh) hoặc 4 bước (edit).
- **maxDuration:** PIPE-18 yêu cầu verify plan tier TRƯỚC khi tăng. Với Hobby: max 60s → giữ nguyên hoặc set 60s. Không set 120s (Hobby không support).
- **ENABLE_REFINE env var:** Default `false` (Hobby-safe). User có thể set `true` khi upgrade lên Pro.

### generator.ts Migration
- `generator.ts` hiện dùng `ResearchResult` từ `researcher.ts` — phải migrate sang pattern mới
- `buildEnrichedSystemPrompt()` trong generator.ts sẽ bị xóa — thay bằng `buildSystemPrompt()` (system) + `buildUserMessage()` / `buildEditUserMessage()` (user) từ context-builder
- Generator signature mới: `generateHtml(userMessage: string, currentHtml?: string): Promise<string>` — nhận pre-built user message thay vì raw prompt + analysis + research
- Orchestrator chịu trách nhiệm gọi `buildUserMessage()` / `buildEditUserMessage()` và truyền kết quả vào generator

### researcher.ts Cleanup
- Xóa `src/lib/ai-pipeline/researcher.ts` hoàn toàn
- Xóa tất cả imports của `researchContext` và `ResearchResult`
- `ResearchResult` interface trong `types.ts` được giữ lại hay xóa: **xóa** — không còn dùng ở đâu sau migration
- `npm run typecheck` phải pass clean sau khi xóa (PIPE-19)

### Claude's Discretion
- Chi tiết rubric wording trong reviewer prompt
- Exact format của `.calibration.jsonl` entries
- Cấu trúc internal của reviewer Zod schema (field ordering, descriptions)
- Cách extract và score từng dimension từ HTML (regex, parsing strategy)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Pipeline hiện tại (cần rewire)
- `src/lib/ai-pipeline/index.ts` — Orchestrator 4-step hiện tại (analyze → research → generate → validate), cần rewire thành 7/4 bước
- `src/lib/ai-pipeline/types.ts` — `PipelineEvent.step` union type cần extend với `"components"`, `"review"`, `"refine"`; `ResearchResult` cần xóa
- `src/lib/ai-pipeline/generator.ts` — `generateHtml()` signature cần update, `buildEnrichedSystemPrompt()` cần xóa

### Phase 10 outputs (building blocks)
- `src/lib/ai-pipeline/design-agent.ts` — `runDesignAgent()`, `FALLBACK_DESIGN`, `DesignResultSchema`
- `src/lib/ai-pipeline/context-builder.ts` — `buildUserMessage()`, `buildEditUserMessage()`, `buildGoogleFontsImport()`, `refineHtml()` stub
- `src/lib/html-prompts.ts` — `buildSystemPrompt()` lean invariant (reuse cho refine)

### Phase 9 outputs
- `src/lib/component-library/index.ts` — `selectComponents(analysis)` API

### UI
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` — `STEP_LABELS` map cần update với Vietnamese labels cho 7 bước

### Requirements
- `.planning/REQUIREMENTS.md` §PIPE-10 đến PIPE-20 — spec đầy đủ cho Phase 11

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `runDesignAgent()` (design-agent.ts): gpt-4o-mini + Zod pattern — `reviewer.ts` dùng cùng pattern (gpt-4o-mini + zodResponseFormat)
- `buildSystemPrompt()` (html-prompts.ts): lean invariant — reuse làm system prompt cho cả generator (mới) và refineHtml()
- `AbortSignal.timeout()` pattern: đã dùng trong design-agent, analyzer — reuse cho reviewer và refine

### Established Patterns
- Lazy OpenAI client init (`getOpenAI()` wrapper) — bắt buộc cho tất cả AI modules để tránh lỗi test import
- Zod v3 + `zodResponseFormat` — pattern của design-agent.ts, reuse cho reviewer.ts
- `PipelineEvent` SSE: `{step, status: "start"|"done", detail?}` — extend step union type, không thay đổi interface shape

### Integration Points
- `index.ts` orchestrator: pipeline wiring điểm trung tâm — tất cả changes hội tụ ở đây
- `editor-client.tsx`: STEP_LABELS map + SSE event handler — cần update labels, không cần thay đổi handler logic
- `.calibration.jsonl` → gitignore entry cần thêm

</code_context>

<specifics>
## Specific Ideas

- `.calibration.jsonl` ở root, gitignored — append-only, không cần cleanup logic
- ENABLE_REFINE=false (Hobby) → ẩn hoàn toàn review+refine steps, không show disabled state
- refineHtml() reuse buildSystemPrompt() — nhất quán với generator, không cần maintain 2 system prompts
- Reviewer nhận user prompt để có thể detect "user muốn quiz nhưng HTML không có quiz" — đây là value chính của content dimension

</specifics>

<deferred>
## Deferred Ideas

- User-visible style selector (override preset) — đã defer từ Phase 10, sau khi Design Agent quality validated
- Design Agent trong edit mode (extract colors từ existing HTML) — chỉ làm nếu users report style drift
- Re-review sau refine (2-pass loop) — rejected vì latency/cost, 1 pass đủ cho v1.1
- Reviewer score hiển thị trong UI — không cần trong v1.1

</deferred>

---

*Phase: 11-reviewer-pipeline-rewire-ui-update*
*Context gathered: 2026-03-20*
