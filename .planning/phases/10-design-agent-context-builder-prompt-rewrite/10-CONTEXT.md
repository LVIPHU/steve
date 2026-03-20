# Phase 10: Design Agent + Context Builder + Prompt Rewrite - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Nâng cấp AI pipeline internals: Design Agent quyết định visual identity per-domain (preset + palette + fonts), context-builder tổng hợp user message có cấu trúc, system prompt được tách thành lean cacheable system message + rich user message. Edit mode không reset màu về DaisyUI blue default.

Không bao gồm: Reviewer, Refine, Pipeline rewire, SSE label update — đó là Phase 11.

</domain>

<decisions>
## Implementation Decisions

### DesignResult Schema
- 3 fields: `{ preset, palette, fonts }` — không có hero layout field
- `preset`: enum cố định 5 values: `'bold-dark' | 'warm-organic' | 'clean-minimal' | 'playful-bright' | 'professional-blue'`
- `palette`: 4 exact hex do Design Agent tự quyết định: `{ primary, secondary, accent, bg }`
- `fonts`: 2 Google Fonts: `{ heading, body }` — Design Agent trả về font name (ví dụ: "Montserrat", "Inter")
- Không có field `style_notes` hay free-form text

### Domain Preset Mapping
- Design Agent (gpt-4o-mini) tự quyết định mapping — không hard-code lookup table
- Design Agent nhận **full user prompt + AnalysisResult.type** để detect sub-domain
- 4 sub-domains cần detect: fitness/gym/sports → bold-dark, food/cooking/recipe → warm-organic, learning/education/language → playful-bright, SaaS/startup/tech/business → professional-blue hoặc bold-dark
- 5 base types từ AnalysisResult: landing/portfolio/dashboard/blog/generic
- Fallback khi Design Agent fail (timeout/error): `clean-minimal` preset với neutral colors

### System Prompt Split
- System prompt giữ: output format rules, CDN links bắt buộc, anti-patterns (no alert(), no Alpine x-for, localStorage prefix), **toàn bộ CSS rules** (flip card, aspect-ratio ban, Tailwind syntax pitfalls)
- System prompt bỏ: template structure hints (LANDING PAGE, PORTFOLIO...) → chuyển sang user message
- Target: ~1000-1100 tokens (hơi vượt 800 nhưng vẫn cache-eligible vì static)
- System prompt là **invariant** — không có per-request data → prompt caching hiệu quả

### buildUserMessage() Format
- Format: **Markdown sections** (không phải JSON) — GPT-4o xử lý Markdown tự nhiên hơn khi generate HTML
- Fresh mode structure:
  ```
  ## Design Brief
  Preset: bold-dark
  Primary: #E63946 | Secondary: #1D3557 | Accent: #457B9D | BG: #F1FAEE
  Heading: Montserrat | Body: Inter

  ## Component References
  <!-- hero-dark: Bold hero for fitness/sports -->
  [raw HTML snippet]
  <!-- end hero-dark -->

  ## Page Structure
  navbar → hero → features → cta → footer

  ## User Request
  [user prompt]
  ```
- Edit mode structure: bỏ `## Design Brief` và `## Component References`, thay bằng preserve instruction ở đầu: `"Preserve existing colors and typography. Do not reset to DaisyUI defaults."` + `## Page Structure` + `## User Request`

### Component Snippets Injection
- Inject **raw HTML** của snippet vào `## Component References` — AI có reference cụ thể để adapt
- Mỗi snippet được wrap bằng comment: `<!-- {id}: {description} -->` ... `<!-- end {id} -->`
- Tối đa 4 snippets (từ `selectComponents()` Phase 9)

### Google Fonts @import
- `context-builder.ts` build URL: convert font name → `@import url('https://fonts.googleapis.com/css2?family=...')`
- URL được đặt trực tiếp trong `## Design Brief` section để AI biết dán vào đầu `<style>` block
- Không để AI tự viết URL (dễ sai weights/format)

### CSS Variable Injection
- Generator nhận DesignResult qua Design Brief trong user message — GPT-4o tự generate HTML có `--color-primary: #E63946` trong `<style>`
- Không có post-processing step riêng — trust AI to follow Design Brief

### refineHtml() Skeleton
- Export đầy đủ signature: `export async function refineHtml(html: string, reviewResult: ReviewResult): Promise<string>`
- Body: `throw new Error('Not implemented — Phase 11')`
- Phase 11 điền implementation mà không cần đổi signature

### Design Step SSE Event
- `detail`: `"bold-dark · #E63946 · Montserrat"` — hiển thị preset + primary color + heading font
- User thấy Design Agent đã chọn gì cụ thể, không chỉ tên preset chung chung

### Claude's Discretion
- Exact system prompt wording (miễn đủ rules + CSS)
- Zod schema structure cho DesignAgent (field ordering, descriptions)
- Google Fonts URL parameter format (weights, italic variants)
- Timeout value cho Design Agent call

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Pipeline types & existing code
- `src/lib/ai-pipeline/types.ts` — AnalysisResult, PipelineEvent types hiện tại cần extend
- `src/lib/ai-pipeline/index.ts` — Orchestrator hiện tại (4-step: analyze → research → generate → validate)
- `src/lib/ai-pipeline/analyzer.ts` — analyzePrompt() dùng gpt-4o-mini, trả về AnalysisResult
- `src/lib/html-prompts.ts` — buildFreshSystemPrompt() và buildEditSystemPrompt() cần rewrite

### Component Library (Phase 9 output)
- `src/lib/component-library/index.ts` — selectComponents(analysis) API
- `src/lib/component-library/types.ts` — ComponentSnippet interface

### Requirements
- `.planning/REQUIREMENTS.md` §PIPE-04 đến PIPE-09 — spec đầy đủ cho Phase 10

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `analyzePrompt()` (analyzer.ts): đã dùng gpt-4o-mini + json_object format — Design Agent dùng cùng pattern nhưng với Zod zodResponseFormat thay vì json_object
- `selectComponents()` (component-library/index.ts): trả về `ComponentSnippet[]`, mỗi snippet có `.html` field — ready để inject vào user message
- `buildFreshSystemPrompt()` / `buildEditSystemPrompt()` (html-prompts.ts): sẽ bị rewrite thành lean system prompt + `buildUserMessage()`

### Established Patterns
- gpt-4o-mini với `AbortSignal.timeout(20000)` — pattern cho fast agents (analyzer dùng 20s, Design Agent dùng tương tự)
- Zod v3 phải là direct dep (^3.24.x) — không dùng Zod v4 vì breaks `openai/helpers/zod`
- `ResearchResult` type hiện tại trong types.ts sẽ bị replace bởi `DesignResult`

### Integration Points
- `index.ts` (orchestrator): step "research" sẽ thành step "components" + step "design" — Phase 11 rewire, Phase 10 chỉ tạo building blocks
- `editor-client.tsx`: có `STEP_LABELS` map — Phase 11 update labels, Phase 10 không touch
- `researcher.ts`: vẫn còn trong codebase — Phase 11 xóa, Phase 10 không xóa

</code_context>

<specifics>
## Specific Ideas

- System prompt cached → rẻ hơn 75% per token so với uncached. Mục tiêu giữ system prompt static hoàn toàn.
- Design Agent nhận cả user prompt gốc (không chỉ AnalysisResult.type) để detect fitness/food/SaaS nuance trong cùng "landing" type
- Edit mode: buildUserMessage() không inject component snippets — tránh AI thay đổi style không mong muốn khi user chỉ muốn edit nội dung

</specifics>

<deferred>
## Deferred Ideas

- User-visible style selector (cho phép user override preset) — defer đến sau khi Design Agent quality validated (đã ghi trong REQUIREMENTS.md Out of Scope)
- Design Agent trong edit mode (extract colors từ existing HTML) — chỉ làm nếu users report style drift sau v1.1

</deferred>

---

*Phase: 10-design-agent-context-builder-prompt-rewrite*
*Context gathered: 2026-03-20*
