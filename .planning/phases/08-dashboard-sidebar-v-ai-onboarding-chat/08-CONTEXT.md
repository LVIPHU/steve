# Phase 8: Dashboard Sidebar và AI Onboarding Chat - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Nâng cấp dashboard với 3 việc chính:
1. **Sidebar navigation** — Thay top nav bằng left sidebar cố định cho tất cả dashboard pages
2. **AI Chat homepage** — `/dashboard/` trở thành AI chat để tạo website mới (luôn luôn, không phân biệt user mới/cũ)
3. **Codebase + DB cleanup** — Xóa toàn bộ old AST/template system, tối ưu lại schema

Không thêm tính năng mới nào khác ngoài 3 việc này.

</domain>

<decisions>
## Implementation Decisions

### Sidebar Layout
- Left sidebar cố định, 240px width, `bg-card border-r`
- Wrap `(dashboard)/layout.tsx` — tất cả dashboard pages tự động có sidebar, không cần sửa từng page
- Editor page (`/dashboard/websites/[id]/edit`) giữ nguyên full-screen, không có sidebar
- Mobile: sidebar ẩn, mở bằng hamburger button

### Sidebar Navigation Items
- Brand area (top): text "AppGen" bold + tagline nhỏ "Tạo web từ note"
- Nav items: **Dashboard** và **Websites** (chỉ 2 items)
- Active state: `bg-accent rounded-md text-foreground font-medium`
- Hover state: `bg-accent/50`
- User area (bottom): Avatar (initials fallback) + username + Sign out button
- Dark mode: tự động qua CSS variables (`bg-card`, `border-border`, `text-foreground`)

### AI Chat trên /dashboard/
- `/dashboard/` luôn luôn là AI chat — không phân biệt user mới/cũ, không có conditional logic
- Mỗi lần vào `/dashboard/` là chat mới (reset, không lưu DB)
- UI: centered card với chat bubbles (AI bên trái, user bên phải) — consistent với editor chat Phase 7
- Bot flow: hỏi 2 câu → summarize → show CTA button
  1. "Website của bạn về chủ đề gì?"
  2. "Mục tiêu website này là gì?"
  → Bot tóm tắt → hiển thị [Tạo website này!]
- Click [Tạo website này!]: POST `/api/websites` tạo DB record → redirect `/dashboard/websites/{id}/edit?prompt=...`
- Auto-generate trong editor (hành vi hiện tại từ Phase 7 giữ nguyên)
- AI model: GPT-4o (cùng với HTML generation)
- Endpoint mới: `POST /api/ai/onboarding-chat` hoặc reuse pattern từ generate-html

### Editor Chat History (Persistent)
- Thêm column `chat_history JSONB` vào bảng `websites`
- Editor load `chat_history` từ DB khi mở (persistent across sessions)
- Auto-save sau mỗi message thành công
- **Publish → set `chat_history = []` trong DB + reset chat UI trong editor**
- Chat history format: `[{ role: "user" | "assistant", content: string, timestamp: string }]`

### Xóa /websites/new
- Remove hoàn toàn `src/app/(dashboard)/dashboard/websites/new/` directory
- Thay thế bằng dashboard AI chat flow (user tạo website qua chat)
- Update sidebar "Websites" link → `/dashboard/websites` (list)

### DB Schema Cleanup
**Xóa các cột khỏi `websites` table:**
- `content JSONB` — WebsiteAST cũ
- `templateId text` — template system đã bỏ từ Phase 7
- `seoMeta JSONB` — SEO meta từ AST system
- `syncStatus text` — note sync feature (Phase 5)
- `lastSyncedAt timestamp` — note sync feature (Phase 5)

**Thêm cột mới:**
- `chat_history JSONB` — lịch sử chat per-website

**Giữ lại:**
- `id`, `userId`, `name`, `slug`, `status`, `htmlContent`, `sourceNoteId`, `createdAt`, `updatedAt`

**Sau khi schema thay đổi:** Review và cập nhật tất cả API routes/server actions còn reference các cột đã xóa.

### Codebase Cleanup (xóa old AST/template system)
Các file/directory cần xóa:
- `src/app/(dashboard)/dashboard/websites/new/` — creation form cũ
- `src/components/sections/` — 11 section components
- `src/components/layouts/` — 5 template layouts
- `src/types/website-ast.ts` — WebsiteAST type definitions
- `src/lib/ast-utils.ts` — parseAndValidateAST, resolveField, editor-utils
- `src/lib/ai-prompts.ts` — old JSON AST prompts
- `src/app/api/ai/generate/route.ts` — old JSON AST generation endpoint
- `src/app/api/ai/regenerate-section/route.ts` — per-section regenerate (không còn sections)
- `src/app/api/sync/trigger/route.ts` — note sync endpoint (syncStatus removed)
- `src/components/website-card.tsx` — kiểm tra nếu còn reference syncStatus/templateId
- `src/lib/templates.ts` — template system (TEMPLATE_ALLOWED_SECTIONS, suggestTemplate, etc.)

**Kiểm tra sau cleanup:**
- Tất cả TypeScript errors phải resolve
- `npm run typecheck` phải pass
- Các API còn lại không được reference các cột đã xóa

### Claude's Discretion
- Exact avatar initials generation logic (first letter of name/email)
- Sidebar animation khi mở/đóng trên mobile
- Bot greeting message wording
- Loading state trong chat khi bot đang trả lời
- Auto-save debounce timing cho chat_history

</decisions>

<specifics>
## Specific Ideas

- Dashboard AI chat giống creation wizard, không phải general assistant — focus vào tạo website
- Sau khi tạo website, user xem lại danh sách tại `/dashboard/websites` (sidebar nav)
- Schema cleanup thoải mái vì data production hiện tại ít — không cần migration backward-compatible phức tạp

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured in decisions above.

### Key files to read before planning
- `src/db/schema.ts` — Schema hiện tại, cần xóa columns + thêm chat_history
- `src/app/(dashboard)/layout.tsx` — Thay bằng sidebar layout
- `src/app/(dashboard)/dashboard/dashboard-nav.tsx` — Component cần replace bằng sidebar
- `src/app/(dashboard)/dashboard/page.tsx` — Thay bằng AI chat component
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` — Cần thêm chat_history load/save/clear on publish
- `src/app/api/websites/[id]/route.ts` — PATCH handler cần accept chat_history + xóa references đến removed columns
- `src/app/(dashboard)/dashboard/websites/page.tsx` — Website list (giữ lại, nhưng remove SyncBadge/syncStatus)
- `src/components/website-card.tsx` — Remove syncStatus references

### Files to delete
- `src/app/(dashboard)/dashboard/websites/new/` (entire directory)
- `src/components/sections/` (entire directory)
- `src/components/layouts/` (entire directory)
- `src/types/website-ast.ts`
- `src/lib/ast-utils.ts`
- `src/lib/ai-prompts.ts`
- `src/app/api/ai/generate/route.ts`
- `src/app/api/ai/regenerate-section/route.ts`
- `src/app/api/sync/trigger/route.ts`
- `src/lib/templates.ts`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/` (shadcn) — Button, Textarea, Avatar đã có; có thể cần thêm shadcn Sheet cho mobile sidebar
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` — Chat bubble UI (MessageBubble pattern) có thể reuse cho dashboard chat
- `import { toast } from "sonner"` — Đã setup cho error/success notifications
- `src/lib/auth-client.ts` — `authClient.signOut()` pattern cho sidebar sign out button

### Established Patterns
- Auth check: `auth.api.getSession({ headers: await headers() })` in Server Components
- Chat pattern: `{ role, content, timestamp }[]` từ Phase 7 editor — reuse cho dashboard chat
- PATCH API: `/api/websites/${id}` với JSON body — extend cho `chat_history`
- Direct SQL ALTER TABLE cho schema changes (drizzle-kit push có upstream bug với CHECK constraints)

### Integration Points
- `(dashboard)/layout.tsx` — Thêm sidebar wrapper ở đây, truyền `user` prop từ session
- `websites` DB table — Thêm `chat_history` column, xóa 5 columns cũ
- Editor publish flow — Sau khi PATCH status=published, thêm PATCH chat_history=[]
- `(dashboard)/dashboard/websites/[id]/edit/page.tsx` — Load `chat_history` từ DB, pass vào HtmlEditorClient

</code_context>

<deferred>
## Deferred Ideas

- Note sync feature (syncStatus/lastSyncedAt) — đã xóa khỏi schema; có thể reimplemented trong milestone 2 nếu cần
- OG image regeneration cho published HTML pages — future phase
- Dashboard chat có thể query/discuss existing websites — future phase
- Settings page trong sidebar — future phase

</deferred>

---

*Phase: 08-dashboard-sidebar-v-ai-onboarding-chat*
*Context gathered: 2026-03-19*
