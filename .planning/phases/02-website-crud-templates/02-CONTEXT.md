# Phase 2: Website CRUD + Templates - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Xây dựng lớp quản lý website: trang danh sách `/dashboard/websites`, tạo website mới (từ Note ID hoặc free prompt), chọn template (5 cố định), đổi tên, xóa, đổi trạng thái. Trang chi tiết website `/dashboard/websites/[id]` là destination sau khi tạo và khi click vào card.

**Không bao gồm Phase này:** AI generation thực sự (Phase 3), visual editor (Phase 4), publish route/SEO (Phase 3).

</domain>

<decisions>
## Implementation Decisions

### Danh sách website (/dashboard/websites)
- Layout: **Card grid (2-3 cột)** — dùng lại Card component đã có
- Mỗi website card hiển thị: **Tên + Status badge only** (tối giản)
- Status badge màu: **xanh lá (Published)**, **xám (Draft)**, **cam (Archived)**
- Click vào card → **mở trang chi tiết** `/dashboard/websites/[id]`
- Nút "Tạo website mới": **trong empty state + góc phải trên header** (cả 2 chỗ)
- Empty state: **Illustration + text + nút** ("Bạn chưa có website nào" + nút tạo)

### Flow tạo website (/dashboard/websites/new)
- Tạo website mở **trang riêng** `/dashboard/websites/new` (không phải modal)
- Form bắt buộc nhập **tên website** ngay trong form tạo
- **2 tab**: "Từ Note" và "Tự viết prompt"
  - Tab "Từ Note": chỉ cần nhập **Note ID** (text field duy nhất) — JSON fetch lúc generate (Phase 3)
  - Tab "Tự viết prompt": **textarea + placeholder gợi ý chi tiết** (chủ đề, mục tiêu, đối tượng...)
- Vị trí template selection trong form: **Claude quyết** (miễn là logic)
- Sau khi nhấn "Tạo": **tạo record draft trong DB** → **redirect ngay vào** `/dashboard/websites/[id]`

### Trang chi tiết website (/dashboard/websites/[id])
- Hiển thị: **thông tin website** (tên, template, nguồn, trạng thái draft) + **nút "Generate"** được placeholder sẵn cho Phase 3
- Đây là trang user đến ngay sau khi tạo mới và khi click vào card trong danh sách

### Template selection UX
- 5 template (blog, portfolio, fitness, cooking, learning) hiển thị dạng **grid 3 cột**
- Mỗi template card: **Icon (emoji) + Tên template** — không có mô tả
- AI gợi ý template: **banner nhỏ bên trên grid**, có **nút X để ẩn**
  - Banner text: "Gợi ý dựa trên note của bạn: [Template X]"
  - Timing: hiển thị **sau khi user nhập Note ID và blur** khỏi ô nhập
  - User có thể bỏ qua và chọn template khác trong grid

### CRUD actions (trên website card)
- Actions chỉ hiển thị **khi hover** vào card
- Hover → xuất hiện **icon dropdown (⋮)** — click mở menu
- Menu chứa: **Rename**, **Đổi trạng thái** (sub-menu), **Xóa**
- **Rename**: Inline edit — tên trên card biến thành input, Enter để lưu, Esc để hủy
- **Xóa**: Confirm dialog — "Bạn chắc chắn muốn xóa [Tên]?" + nút Xác nhận / Hủy
- **Đổi trạng thái**: Sub-menu 3 lựa chọn — Draft / Published / Archived

### Claude's Discretion
- Vị trí chính xác của template selection trong form `/new` (sau 2 tab, hay bên cạnh, hay cuối form)
- Exact spacing, typography, card size
- Illustration cho empty state (có thể dùng SVG đơn giản hoặc emoji lớn)
- Loading state khi tạo website
- Toast notification sau khi đổi tên / xóa thành công

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Schema & Data Model
- `src/db/schema.ts` — Bảng `websites` (id, userId, name, slug, status, sourceNoteId, templateId, content, seoMeta). Type exports: `Website`, `NewWebsite`

### Requirements
- `.planning/REQUIREMENTS.md` — F-04 (website list), F-05 (create website), F-06 (status), F-07 (CRUD), F-08 (template system), F-09 (AI template suggestion). Business Rules #2 (draft = không có public URL), #3 (archived = URL hiển thị "không còn hoạt động")

### UI Components hiện có
- `src/components/ui/card.tsx` — Card component có thể dùng cho website grid
- `src/components/ui/button.tsx`, `input.tsx`, `label.tsx` — Form components

### Patterns
- `src/app/(dashboard)/layout.tsx` — Cách enforce session + profile check
- `.planning/codebase/CONVENTIONS.md` — Code conventions, component patterns

No external ADRs or design specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/card.tsx`: Card component có sẵn — dùng cho website grid và template grid
- `src/components/ui/button.tsx`: Button variants — Primary cho "Tạo website mới", Destructive cho Delete
- `src/components/ui/input.tsx` + `label.tsx`: Form fields cho tên website, Note ID
- `src/db/schema.ts`: `websites` table đã đủ cột — không cần schema migration

### Established Patterns
- Server Component default: fetch data trực tiếp với `auth.api.getSession({ headers: await headers() })`
- Client Component: dùng `"use client"` + `useState` cho form, dropdown, inline edit
- `cn()` từ `@/lib/utils` cho conditional classes
- Error display: `useState<string | null>` pattern đã dùng trong login/register/onboarding

### Integration Points
- `(dashboard)/layout.tsx` đã enforce session + profile → các trang mới tự động được bảo vệ
- Cần tạo mới:
  - `src/app/(dashboard)/dashboard/websites/page.tsx` — danh sách
  - `src/app/(dashboard)/dashboard/websites/new/page.tsx` — form tạo mới
  - `src/app/(dashboard)/dashboard/websites/[id]/page.tsx` — trang chi tiết
  - API routes cho CRUD operations (create, rename, delete, status change)
- Dashboard nav (`dashboard-nav.tsx`) có thể cần thêm link "Websites"

</code_context>

<specifics>
## Specific Ideas

- Template icons: dùng emoji (`📝` Blog, `💼` Portfolio, `💪` Fitness, `🍳` Cooking, `🎓` Learning) — không cần icon library
- AI template suggestion hoạt động client-side bằng keyword matching đơn giản: Note ID hoặc nội dung textarea chứa từ khóa → map sang template. Không cần API call ở Phase 2.
- Trang chi tiết `/dashboard/websites/[id]` có nút "Generate" disabled hoặc placeholder cho đến Phase 3

</specifics>

<deferred>
## Deferred Ideas

- Tìm kiếm / filter website trong danh sách — có thể thêm vào backlog
- Duplicate website — F-07 có đề cập nhưng Phase 2 focus rename + delete, duplicate có thể Phase sau
- Preview thumbnail của template — Phase khác hoặc backlog

</deferred>

---

*Phase: 02-website-crud-templates*
*Context gathered: 2026-03-17*
