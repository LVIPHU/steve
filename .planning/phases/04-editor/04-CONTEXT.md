# Phase 4: Editor - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

User chỉnh sửa website đã được generate qua sidebar editor trực quan: click section → sửa fields, kéo thả để reorder, upload ảnh, tùy chỉnh màu và font. Generate website và publish đã được xử lý ở Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Editor route & layout
- Route mới: `/dashboard/websites/[id]/edit` — tách biệt khỏi generate/publish flow ở `/dashboard/websites/[id]`
- Detail page (`[id]/page.tsx`) thêm nút "Edit Website" → navigate sang editor
- Layout 2 cột: preview chiếm ~65% bên trái, sidebar ~35% bên phải
- Topbar riêng (không dùng DashboardNav): `← Back | Website name* | [Save ●]` — dấu `*` hoặc `●` khi có unsaved changes

### Sidebar structure
- Sidebar có 2 tab: **[Sections]** và **[Theme]**
- Tab Sections: danh sách tất cả sections với icon ☰ drag handle + form edit section đang active bên dưới
- Default state: chỉ hiện section list, không có section nào được chọn
- Click section → expand edit form bên dưới list
- DnD handle ☰ nằm trong section list của sidebar (không phải trong preview)

### Preview mechanism
- **Render trực tiếp trong React** (không dùng iframe) — dùng `SectionRenderer` + `TemplateRenderer` đã có sẵn
- Click section trong preview → outline/border màu primary highlight + sidebar scroll đến section đó + expand form
- Real-time preview: khi user gõ text trong sidebar, preview cập nhật ngay lập tức (controlled state, chưa save vào DB)
- Responsive toggle ở topbar: Desktop (full width) / Tablet (`max-w-[768px]` centered) / Mobile (`max-w-[390px]` centered)

### Save behavior
- **Explicit Save button** trong topbar — không auto-save
- Unsaved indicator: dấu `●` hoặc `*` trên Save button khi có thay đổi chưa lưu
- Save thành công → Toast notification ngắn "Đã lưu" xuất hiện rồi biến mất sau 2s
- Gọi `PATCH /api/websites/[id]` với toàn bộ content AST (API đã có sẵn từ Phase 2)
- Khi navigate rời trang mà có unsaved changes → hiện confirm dialog "Bạn có thay đổi chưa lưu. Rời trang?"
- Color/font changes cũng được save cùng Save button (không auto-save riêng)

### Per-section regenerate (S-01)
- Sidebar edit form của mỗi section có field prompt optional + nút "Regenerate section"
- Regenerate CHỈ cập nhật `ai_content` của section đó — `manual_overrides` không bị xóa
- Prompt field hiển thị trong sidebar: `[Prompt: ________] (optional)` phía trên nút Regenerate
- Cần API mới: `POST /api/ai/regenerate-section` với sectionId + prompt + context

### Image upload (F-13)
- Upload ảnh → Supabase Storage → URL được set vào field trong `manual_overrides`
- Preview cập nhật ngay sau khi upload thành công (không cần Save)
- Upload flow: sidebar field "Upload image" → loading indicator → preview ảnh hiện ra

### Color & font customization (S-05)
- **Primary color**: HTML `input[type=color]` free color picker (không dùng preset palette)
- **Font**: Search Google Fonts API → khi chọn font → inject `<link>` tag vào head để load dynamic
- Áp dụng qua CSS variables inline trên preview container: `style={{ '--primary-color': theme.primaryColor, '--font-family': theme.font }}`
- Lưu vào `WebsiteAST.theme.primaryColor` và `WebsiteAST.theme.font`
- Public page (`/[username]/[slug]`) cũng phải load font và apply CSS variables

### Claude's Discretion
- dnd-kit SortableContext implementation chi tiết (vertical list, drag overlay)
- Toast component implementation (tự viết hay dùng sonner/react-hot-toast)
- Exact breakpoints và animation cho sidebar transition
- Supabase Storage bucket name và path convention cho uploaded images
- Google Fonts API key strategy (có thể dùng `https://fonts.googleapis.com/css2?family=...` không cần key)
- Error state khi per-section regenerate thất bại
- Loading skeleton trong preview khi đang regenerate section

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Website AST schema
- `src/types/website-ast.ts` — WebsiteAST, Section, WebsiteTheme interfaces; `manual_overrides` pattern; all 6 section content types

### Existing rendering
- `src/components/sections/index.tsx` — SectionRenderer component (supports all 6 section types)
- `src/components/layouts/index.tsx` — TemplateRenderer (5 template layouts)

### Existing API
- `src/app/api/websites/[id]/route.ts` — PATCH endpoint đã có, sẽ reuse cho Save

### Requirements
- `REQUIREMENTS.md` F-12 (visual editor), F-13 (image upload), F-14 (section reorder), F-15 (responsive preview), S-01 (per-section regen), S-02 (prompt refinement), S-05 (color/font)

No external ADRs for this phase — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/sections/index.tsx` — SectionRenderer: renders một section từ `{type, ai_content, manual_overrides}`. Dùng trực tiếp trong editor preview
- `src/components/layouts/index.tsx` — TemplateRenderer: wraps sections với template layout. Dùng trong preview container
- `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `label.tsx` — UI primitives
- `src/app/api/websites/[id]/route.ts` — PATCH đã có, nhận `content` JSON, save vào DB
- `motion` (Framer Motion successor) — đã cài, dùng được cho sidebar animation
- `src/app/(dashboard)/dashboard/websites/[id]/website-detail-client.tsx` — có thể tham khảo state management pattern

### Established Patterns
- `manual_overrides` rule: render dùng `manual_overrides[field] ?? ai_content[field]` — editor phải tuân thủ, chỉ ghi vào manual_overrides
- Server Components + Client Components split: page.tsx là Server Component fetch DB, truyền data xuống Client Component
- Sub-components định nghĩa ở module scope (không inline) — tránh re-render instability
- `cn()` từ `@/lib/utils` cho conditional classes
- Route Handler (not Server Action) cho AI calls

### Integration Points
- EditorPage là route mới `/dashboard/websites/[id]/edit/page.tsx` — Server Component fetch website từ DB, pass xuống EditorClient
- Detail page `/dashboard/websites/[id]/page.tsx` — thêm nút "Edit Website" → link đến /edit
- PATCH /api/websites/[id] — Save button gọi với full content AST
- Cần API mới: `/api/ai/regenerate-section` cho per-section regen
- Cần API mới: `/api/upload/image` cho Supabase Storage upload
- Public page `/app/(public)/[username]/[slug]/page.tsx` — phải load font từ theme khi render

</code_context>

<specifics>
## Specific Ideas

- Layout tham khảo Webflow / Framer editor: preview bên trái, sidebar controls bên phải
- Topbar compact thay DashboardNav để maximize preview space
- Sidebar section list + drag handles giống Notion block sorter hoặc Linear section reorder

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-editor*
*Context gathered: 2026-03-18*
