# Phase 9: Component Library - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Xây dựng thư viện snippet tĩnh `src/lib/component-library/` với 40+ HTML/DaisyUI snippets. `selectComponents(analysis)` trả về tối đa 4 snippets phù hợp nhất trong ~0ms (không LLM). Có Vitest unit tests xác nhận tag-match logic. Phase này không thay đổi pipeline wiring — chỉ tạo dữ liệu và hàm selection. Phase 10 sẽ kết nối vào pipeline.

</domain>

<decisions>
## Implementation Decisions

### ComponentSnippet Interface
- Full interface với các fields: `id`, `tags`, `html`, `category`, `name`, `description`, `priority`, `domain_hints`, `min_score`, `fallback`, `fallback_for`
- `html` là **section fragment** (không phải full HTML document) — mỗi snippet là `<section>` hoặc `<div>` thuần, có thể chứa inline `<style>` và `<script>` riêng
- Interactive snippets (Quiz, Flashcard, Step+timer) chứa `<script>` inline bên trong fragment — không tách JS ra field riêng

### Tag Matching Strategy
- `selectComponents(analysis)` match `snippet.tags[]` với **tất cả fields** của `AnalysisResult`: `sections[]`, `features[]`, và `type`
- Score = số tags của snippet match với union của tất cả analysis values
- Tie-break: **domain_hints match trước** (snippet có `domain_hints` khớp `analysis.type` được +ưu tiên), sau đó `priority` (số nhỏ hơn = ưu tiên cao hơn, ví dụ priority 1 > priority 2)
- Không enforce phủ category — pure score-based, top 4 theo score
- `min_score`: snippet chỉ được xét khi số tags match ≥ `min_score`. Nếu không đủ 4 snippet pass threshold → hạ threshold xuống 0 để fill đủ 4 (không bao giờ trả về ít hơn 4 trừ khi thư viện có ít hơn 4 snippet)
- `domain_hints`: dùng để **boost score** khi tie-break, không dùng để hard-filter loại trừ snippet

### Fallback Set Design
- Khi không có snippet nào match (score = 0 cho tất cả) → fallback **theo `analysis.type`**
- Fallback được **đánh dấu trong dữ liệu snippet** qua fields `fallback: true` và `fallback_for: string[]`
- `selectComponents()` collect fallbacks từ data (không hardcode map trong code)
- Fallback presets theo type:
  - `landing` → navbar + hero + features + footer
  - `portfolio` → navbar + hero + cards + footer
  - `dashboard` → topbar + cards + stats + footer
  - `blog` → navbar + hero + article-grid + footer
  - `generic` → navbar + hero + features + footer

### Snippet Distribution (40+ snippets)
- Phủ rộng tất cả 7 categories + domain-specific variants
- **Tập trung đặc biệt** vào interactive patterns (AI hay tạo sai) — Quiz, Flashcard, Step+timer là must-have

**7 categories cơ bản:**
- `hero` — centered, split-layout, minimal, dashboard-hero
- `navbar` — simple, with-dropdown, mobile-friendly
- `features` — 3-col cards, icon-list, alternating, comparison
- `cards` — basic card, stat card, profile card, pricing card
- `footer` — simple, multi-column, minimal
- `stats` — stats bar, counter animation, progress bars
- `testimonials` — quote cards, avatar grid, single featured

**Domain-specific variants:**
- **Interactive/Dashboard**: Quiz (multiple choice + score cuối + localStorage), Flashcard (swipe drag + CSS 3D flip + localStorage), Step+timer (step list với countdown timer riêng mỗi bước, Start/Pause/Reset), Calculator, Progress tracker
- **Blog/Content**: Article grid, Timeline, Table of contents, Reading progress bar
- **Portfolio/CV**: Skills grid, Projects showcase, Career timeline, Contact form
- **E-commerce/Product**: Pricing table, Feature comparison, Product showcase, CTA banner

**Quiz snippet spec:**
- Multiple choice, 1 câu hiển thị 1 lượt
- Chọn đáp án → hiển thị đúng/sai ngay
- Cuối bài hiển thị tổng điểm
- Lưu progress vào localStorage (`appgen-quiz-*` prefix)

**Flashcard snippet spec:**
- CSS 3D flip animation (transform-style: preserve-3d, backface-visibility: hidden)
- Swipe drag (touch + mouse) sang trái/phải để navigate
- Click để flip xem answer
- Lưu trạng thái đã xem vào localStorage

**Step+timer snippet spec:**
- Hiển thị toàn bộ step list cùng lúc
- Mỗi step có countdown timer riêng với nút Start/Pause/Reset
- Timer đếm ngược, hiển thị MM:SS
- Phù hợp cho recipe với nhiều bước nấu song song

### Claude's Discretion
- Thứ tự sắp xếp snippets trong file data
- Số lượng chính xác mỗi category (miễn tổng ≥ 40)
- Chi tiết CSS của từng snippet (DaisyUI components + Tailwind utilities)
- Tên biến và structure của file data (array export, named export, v.v.)
- Test case structure trong Vitest

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Pipeline types và hiện trạng
- `src/lib/ai-pipeline/types.ts` — `AnalysisResult` interface (input của `selectComponents()`), `PipelineEvent` step union type cần extend
- `src/lib/ai-pipeline/analyzer.ts` — Cách analyzer trả về `sections[]`, `features[]`, `type` — tags cần match với những values này
- `src/lib/ai-pipeline/researcher.ts` — File này sẽ bị thay thế ở Phase 11; Phase 9 KHÔNG xóa nó

### Prompt patterns hiện có
- `src/lib/html-prompts.ts` — DaisyUI component patterns, CSS rules, anti-patterns hiện tại; snippet HTML phải consistent với style này

### Requirements
- `.planning/REQUIREMENTS.md` — PIPE-01, PIPE-02, PIPE-03 (Phase 9 requirements)

No external specs beyond the above — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AnalysisResult` (types.ts): Interface đã có `type`, `sections[]`, `features[]`, `structured_data` — đây là exact input signature cho `selectComponents()`
- `html-prompts.ts`: DaisyUI component patterns, CSS rules, flip card implementation — dùng làm reference cho snippet HTML content
- Vitest đã setup (xem `src/lib/html-prompts.test.ts` làm mẫu test structure)

### Established Patterns
- DaisyUI v4 CDN + Tailwind CDN: tất cả snippets phải dùng pattern này (consistent với `buildFreshSystemPrompt()`)
- localStorage prefix `appgen-`: interactive snippets dùng prefix này (đã defined trong system prompt)
- `npm run test` chạy Vitest — unit tests trong cùng `src/lib/` directory

### Integration Points
- Phase 10 sẽ import `selectComponents` và `ComponentSnippet` từ `src/lib/component-library/index.ts`
- `selectComponents(analysis: AnalysisResult): ComponentSnippet[]` — function signature phải match để Phase 10 có thể wire vào `buildUserMessage()`
- File structure: `src/lib/component-library/index.ts` (selectComponents + ComponentSnippet type), `src/lib/component-library/snippets/` (data files by category)

</code_context>

<specifics>
## Specific Ideas

- Snippets phải cover đủ để fallback set hoạt động tốt cho mọi `analysis.type` — đặc biệt `dashboard` type cần topbar + cards + stats
- Flashcard dùng swipe drag (không chỉ click Previous/Next) — pattern mới, chưa có trong html-prompts.ts
- Step+timer cho recipe: mỗi step có timer riêng (không phải 1 global timer) — cho phép nấu nhiều món song song
- Interactive snippets là "AI hay làm sai" → đây là value chính của library; snippet phải đủ chi tiết để AI có reference tốt

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 09-component-library*
*Context gathered: 2026-03-19*
