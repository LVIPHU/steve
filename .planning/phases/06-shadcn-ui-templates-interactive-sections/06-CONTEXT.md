# Phase 6: shadcn-ui templates interactive-sections - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Nâng cấp visual quality toàn bộ 5 templates bằng shadcn/ui + thêm interactive section types mới phục vụ cooking (steps, ingredients) và learning (goals checklist, quiz, flashcard) use cases. Editor sidebar được mở rộng để hỗ trợ edit + thêm các section types mới.

New capabilities trong phase này: interactive section types, template visual redesign, shadcn full install, dark mode, editor add-section flow.

</domain>

<decisions>
## Implementation Decisions

### New Section Types
- Thêm vào `SectionType`: `"steps"` | `"quiz"` | `"flashcard"` | `"goals"` | `"ingredients"`
- Mỗi type có schema riêng trong `WebsiteAST` (extend `website-ast.ts`)
- Section types bị lock theo template:
  - `cooking` template → có `ingredients` + `steps` sections
  - `learning` template → có `goals` + `flashcard` + `quiz` sections
  - Các templates khác không gen các section types này
- AI prompts được cập nhật để biết gen đúng section types cho từng template
- Default section order per template:
  - `cooking`: Hero → Ingredients → Steps → CTA
  - `learning`: Hero → Goals → Content → Flashcard → Quiz

### Interactive Section Behavior
- **Goals section**: Checklist có thể tick, progress bar hiển thị % hoàn thành
- **Quiz section**: Multiple choice (4 đáp án, 1 đúng). Sau khi hoàn thành: hiển thị score X/Y + review đáp án đúng/sai + nút làm lại
- **Flashcard section**: Flip card animation — click để lật (front: term/khái niệm, back: định nghĩa/đáp án). Có nút Next/Prev để đi qua các card
- **Steps section**: Numbered list có thể tick, mỗi step có mô tả + optional image upload
- **Ingredients section**: Danh sách nguyên liệu + lượng, có thể tick khi chuẩn bị

### Progress Persistence
- Dùng `localStorage` để lưu progress (goals ticks, quiz answers)
- Key theo website slug để tránh conflict giữa các trang
- Reset nếu xóa browser data — không cần server-side storage

### SSR + Hydration
- Interactive sections dùng lazy hydration: SSR render static version (số bước, số câu hỏi), client-side React hydrate để thêm interactivity
- Tốt cho SEO — content vẫn được index
- Không dùng `dynamic import` với `ssr: false` cho interactive sections

### Animation
- Dùng Framer Motion (đã có trong stack) cho:
  - Flip card animation (flashcard)
  - Step transition
  - Quiz answer reveal
  - Goals progress bar fill

### Editor Extensions
- Editor sidebar có form edit cho tất cả interactive section types mới
- Thêm nút "Thêm section" trong editor — user chọn section type, AI gen content cho section đó
- New section types xuất hiện trong add-section picker (chỉ hiện types phù hợp với template)

### Template Visual Identity
- Mỗi template có visual identity riêng (không dùng chung 1 style)
- Claude tự quyết định style phù hợp với domain của từng template
- Mỗi template có default section order riêng (xem trên)
- Templates hỗ trợ dark mode (system preference + user toggle)
- Light mode là default, dark mode opt-in

### shadcn/ui Components
- Cài đầy đủ tất cả shadcn/ui components cần thiết, bao gồm:
  - `progress` — cho goals checklist progress bar
  - `accordion` — cho content expandable, FAQ
  - `carousel` — cho flashcard navigation (hoặc tự build với Framer Motion)
  - `toggle` / `switch` — cho dark mode toggle
  - Và các components khác theo nhu cầu implementation
- shadcn components được dùng trên cả public page lẫn dashboard/editor

### Claude's Discretion
- Style cụ thể của từng template (colors, typography, spacing)
- Carousel vs custom Framer Motion cho flashcard navigation
- Số lượng shadcn components cài thêm nếu cần
- Dark mode implementation approach (CSS variables vs class toggle)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing AST & Section system
- `src/types/website-ast.ts` — WebsiteAST schema, SectionType union, all content interfaces
- `src/lib/ast-utils.ts` — resolveField, parseAndValidateAST — validation logic cần update cho new types
- `src/components/sections/` — 6 section components hiện tại — pattern để follow khi tạo mới
- `src/components/layouts/` — 5 template layouts hiện tại — cần redesign

### AI Generation
- `src/lib/ai-prompts.ts` — buildSystemPrompt, buildUserPrompt — cần update để biết gen interactive sections
- `src/lib/templates.ts` — suggestTemplate, template definitions — cần update default sections per template

### Editor
- `src/app/(dashboard)/websites/[id]/edit/` — EditorClient, SectionEditForm, SectionsTab — cần extend cho new section types + add-section flow

### Project context
- `.planning/PROJECT.md` — Target users: non-technical note-takers
- `.planning/REQUIREMENTS.md` — AST schema, render rules, NF requirements

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/` — badge, button, card, dialog, input, label, separator, skeleton, sonner, tabs — đã có, dùng trong redesign
- `src/components/sections/hero-section.tsx` — pattern: resolveField + theme.primaryColor + Tailwind classes
- `src/lib/ast-utils.ts#resolveField` — dùng lại cho tất cả new section components
- Framer Motion (`motion` package) — đã trong stack, dùng cho animations
- `dnd-kit` — đã dùng cho section reorder trong editor

### Established Patterns
- Section components: nhận `{ section: Section, theme: WebsiteTheme }` props, dùng `resolveField` để merge ai_content + manual_overrides
- Template layouts: thin wrapper với font + max-width, iterate sections qua `SectionRenderer`
- `SectionRenderer` dispatch theo `section.type` — cần thêm cases cho new types
- `SectionEditForm` trong editor dispatch theo type để render đúng form fields

### Integration Points
- `SectionType` union trong `website-ast.ts` — thêm 5 type mới
- `SectionRenderer` `index.tsx` — thêm cases cho new types
- `SectionEditForm` trong editor — thêm form fields cho new types
- AI prompts — thêm instructions cho interactive section gen
- `parseAndValidateAST` — validate new section content shapes
- Template layouts — redesign + thêm template-specific section ordering logic

</code_context>

<specifics>
## Specific Ideas

- Templates nên có visual identity mạnh — không chỉ khác nhau về font, mà khác về layout, spacing, color treatment
- Interactive sections phải feel "native" với template — cooking steps trông như recipe card, flashcard trông như study app
- Goals checklist + progress bar là killer feature cho learning template
- Dark mode là must-have, không phải nice-to-have (user chọn)

</specifics>

<deferred>
## Deferred Ideas

- Không có deferred — discussion stayed within phase scope

</deferred>

---

*Phase: 06-shadcn-ui-templates-interactive-sections*
*Context gathered: 2026-03-18*
