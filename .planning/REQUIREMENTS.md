# Requirements: Website Generator

**Defined:** 2026-03-16
**Core Value:** Người dùng có thể tạo website đẹp, publish được, từ note hoặc prompt — không cần biết code.

---

## v1.0 Requirements (Validated — Phases 1-8)

Tất cả đã ship và verified.

### Auth
- ✓ **F-01**: User có thể đăng nhập bằng email/password — Phase 1
- ✓ **F-02**: Mobile app tạo token link → web app auto đăng nhập — Phase 1
- ✓ **F-03**: Bắt buộc chọn username khi đăng ký, validate reserved words — Phase 1

### Website CRUD
- ✓ **F-04**: Dashboard hiển thị danh sách websites với status badges — Phase 2
- ✓ **F-05**: Tạo website với name + prompt (no template picker) — Phase 7/8
- ✓ **F-06**: Ba trạng thái: Draft / Published / Archived — Phase 2
- ✓ **F-07**: Đổi tên, xóa website — Phase 2

### AI Generation
- ✓ **F-10**: GPT-4o tạo complete HTML từ prompt — Phase 7
- ✓ **F-11**: Public route serve raw HTML cho published websites — Phase 7
- ✓ **F-16**: SEO meta auto-generated — Phase 3

### Editor
- ✓ **F-12**: Lovable-style editor: iframe preview + chat + code tabs — Phase 7
- ✓ **F-13**: Chat gửi prompt → AI update HTML → iframe live — Phase 7
- ✓ **F-14**: Code tab cho phép edit HTML trực tiếp — Phase 7

### Dashboard
- ✓ **P8-01**: Left sidebar 240px với brand, nav items, user area — Phase 8
- ✓ **P8-03**: Dashboard AI onboarding chat (2-question → tạo website) — Phase 8
- ✓ **P8-04**: Editor load/save chat history từ DB — Phase 8

---

## v1.1 Requirements (Active — Phases 9-12)

### Pipeline — Component Library
- [x] **PIPE-01**: Component Library có >=25 HTML/DaisyUI snippets phân loại theo hero, navbar, features, cards, footer, stats, testimonials
- [x] **PIPE-02**: `selectComponents(analysis)` chọn tối đa 4 snippets phù hợp nhất bằng tag matching (không LLM, ~0ms)
- [x] **PIPE-03**: Component Library có unit tests cho tag-match logic (Vitest)

### Pipeline — Design Agent
- [x] **PIPE-04**: Design Agent (gpt-4o-mini + Zod Structured Output) trả về palette hex, typography Google Fonts, style preset, hero layout
- [x] **PIPE-05**: Design Agent map đúng domain → style preset (SaaS → bold-dark, food → warm-organic, v.v.)
- [x] **PIPE-06**: CSS variables (`--color-primary`, `--color-secondary`, `--color-accent`, `--color-bg`) được inject vào HTML output; Google Fonts `@import` đặt đầu tiên trong `<style>` block

### Pipeline — Context Optimization
- [x] **PIPE-07**: System prompt lean ~800 tokens (invariant rules only), mọi per-request context chuyển sang user message
- [x] **PIPE-08**: `buildUserMessage()` tổng hợp design brief + component references + analysis + user prompt thành structured user message
- [x] **PIPE-09**: Edit mode nhận instruction "preserve existing colors and typography" khi không có DesignResult

### Pipeline — Review + Refine
- [x] **PIPE-10**: Reviewer (gpt-4o-mini) chấm điểm HTML 0-100 theo 3 dimensions: visual (40), content (30), technical (30)
- [x] **PIPE-11**: Refine pass (gpt-4o) chỉ fire khi score < threshold hoặc `must_fix[]` non-empty
- [x] **PIPE-12**: Refine sử dụng separate message builder (không re-inject component snippets)
- [x] **PIPE-13**: Review threshold exposed qua env var `REVIEW_THRESHOLD` (default 75)

### Pipeline — Orchestration
- [x] **PIPE-14**: Fresh mode chạy đúng 7 bước: analyze → components → design → generate → review → refine (conditional) → validate
- [x] **PIPE-15**: Edit mode chạy đúng 4 bước: analyze → components → generate → validate (skip design/review/refine)
- [x] **PIPE-16**: `PipelineEvent.step` union type extended với `"components"`, `"design"`, `"review"`, `"refine"`
- [x] **PIPE-17**: `STEP_LABELS` trong editor-client.tsx updated với labels tiếng Việt cho tất cả 7 bước
- [x] **PIPE-18**: Verify Vercel plan tier trước khi tăng maxDuration — nếu Pro: set 120s; nếu Hobby: disable refine hoặc gate bằng env var `ENABLE_REFINE`
- [x] **PIPE-19**: `researcher.ts` (step cũ) bị xóa khỏi pipeline và imports
- [x] **PIPE-20**: Calibration pass (>=10 websites) verify review score distribution trước khi ship — threshold 75 là provisional, điều chỉnh nếu cần

### Snippet Library Migration (Phase 12)
- [x] **SNIP-01**: Tất cả snippet HTML hiện tại rewrite từ DaisyUI sang Tailwind utilities + Preline data-hs-* patterns
- [x] **SNIP-02**: 11 category hiện tại mở rộng thêm 2-3 snippets mỗi category
- [ ] **SNIP-03**: 6 category mới (forms, ui-elements, cta, media, pricing, notifications) với 6-9 snippets mỗi category
- [x] **SNIP-04**: `buildSystemPrompt()` rewrite với Tailwind CDN + Preline JS CDN, zero DaisyUI references
- [x] **SNIP-05**: Tất cả snippets hỗ trợ dark mode qua Tailwind `dark:` prefix
- [x] **SNIP-06**: Zero DaisyUI class names còn lại trong toàn bộ snippet library
- [ ] **SNIP-07**: ALL_SNIPPETS chứa 100+ snippets across 17 categories
- [x] **SNIP-08**: Tests updated (threshold 100+, DaisyUI remnant detector) và pass clean

---

## v2 Requirements (Deferred)

### Multi-page Generation
- **MULTI-01**: Progressive generation cho website nhiều trang — scaffold + per-page + JS hash router
- **MULTI-02**: SSE events riêng cho từng trang (page_index, page_total)
- **MULTI-03**: maxDuration 180s cho multi-page mode

### Resources Gallery
- **RES-01**: DB table `resources` cho community templates
- **RES-02**: Trang `/resources` public — browse + preview trong iframe
- **RES-03**: Nút "Publish as template" trong editor
- **RES-04**: Vector embeddings (pgvector) cho semantic search khi generate

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Freemium / plan tiers | Không trong scope v1 |
| Admin panel | Không trong scope v1 |
| Custom domains | Không trong scope v1 |
| Version history | Defer indefinitely |
| Multi-user collaboration | Không trong scope v1 |
| User-visible style selector | Defer đến sau khi Design Agent quality validated |
| Design Agent trong edit mode (extract colors từ HTML) | Chỉ làm nếu users report style drift sau v1.1 |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PIPE-01 | Phase 9 | Complete |
| PIPE-02 | Phase 9 | Complete |
| PIPE-03 | Phase 9 | Complete |
| PIPE-04 | Phase 10 | Complete |
| PIPE-05 | Phase 10 | Complete |
| PIPE-06 | Phase 10 | Complete |
| PIPE-07 | Phase 10 | Complete |
| PIPE-08 | Phase 10 | Complete |
| PIPE-09 | Phase 10 | Complete |
| PIPE-10 | Phase 11 | Complete |
| PIPE-11 | Phase 11 | Complete |
| PIPE-12 | Phase 11 | Complete |
| PIPE-13 | Phase 11 | Complete |
| PIPE-14 | Phase 11 | Complete |
| PIPE-15 | Phase 11 | Complete |
| PIPE-16 | Phase 11 | Complete |
| PIPE-17 | Phase 11 | Complete |
| PIPE-18 | Phase 11 | Complete |
| PIPE-19 | Phase 11 | Complete |
| PIPE-20 | Phase 11 | Complete |
| SNIP-01 | Phase 12 | Planned |
| SNIP-02 | Phase 12 | Planned |
| SNIP-03 | Phase 12 | Planned |
| SNIP-04 | Phase 12 | Planned |
| SNIP-05 | Phase 12 | Planned |
| SNIP-06 | Phase 12 | Planned |
| SNIP-07 | Phase 12 | Planned |
| SNIP-08 | Phase 12 | Planned |

**Coverage:**
- v1.1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-21 — Phase 12 requirements added (SNIP-01 through SNIP-08)*
