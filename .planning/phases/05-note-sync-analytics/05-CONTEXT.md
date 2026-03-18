# Phase 5: Note Sync + Analytics - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Hai tính năng độc lập:
1. **Note Sync API** — Mobile app gọi `POST /api/sync/trigger` khi note thay đổi → server chạy AI generation lại → cập nhật ai_content, giữ nguyên manual_overrides → dashboard hiện badge trạng thái sync.
2. **Umami Analytics** — Nhúng Umami tracking script vào public website pages.

Không bao gồm: version history, diff view, manual "re-sync" button từ dashboard, per-user Umami dashboard.

</domain>

<decisions>
## Implementation Decisions

### Sync authentication
- Mobile app gửi session token của user trong `Authorization: Bearer <token>` header
- better-auth verify token này — không cần thêm infrastructure mới
- Payload: `{ noteId: string, noteContent: {...} }` — noteContent là note JSON đầy đủ
- Tìm website theo `websites.sourceNoteId = noteId` (field đã có trong schema)
- Nếu nhiều website có cùng sourceNoteId → cập nhật **tất cả**
- Response: `{ ok: boolean, updatedCount: number }`

### Sync AI behavior
- Khi sync: **chạy lại GPT-4o** với noteContent mới — giống flow generate ban đầu (`buildUserPrompt`)
- Dùng **Vercel `waitUntil`** — API trả về `{ ok, updatedCount }` ngay lập tức, AI chạy background
- **Merge strategy**: Giữ cấu trúc section cũ (id, type, thứ tự). Chỉ cập nhật `ai_content` của từng section tương ứng. Section mới từ AI bị bỏ qua nếu không có section id khớp.
- `manual_overrides` không bao giờ bị ghi đè (đúng business rule hiện tại)
- **Khi AI thất bại**: Lưu `syncStatus = 'sync_failed'` vào DB, DB không thay đổi content
- **DB fields mới cần thêm vào `websites` table:**
  - `syncStatus: text — 'idle' | 'syncing' | 'synced' | 'sync_failed'` (default: 'idle')
  - `lastSyncedAt: timestamp` (nullable)

### Sync notification (S-03)
- Badge trên mỗi website card trong `/dashboard/websites`
- Khi `lastSyncedAt` có giá trị: hiện `✔ Sync lúc HH:MM` (luôn hiện, không tự ẩn)
- Khi `syncStatus = 'sync_failed'`: hiện badge đỏ `⚠ Sync thất bại` trên card
- **Polling**: Dashboard list tự động poll mỗi **30 giây** bằng `router.refresh()` từ Next.js
- Polling chỉ chạy ở trang `/dashboard/websites` — không chạy ở trang khác

### Umami analytics (F-19)
- Config qua env var: `NEXT_PUBLIC_UMAMI_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- Nhúng script **chỉ trong public page** `(public)/[username]/[slug]/page.tsx` — không track dashboard
- Nếu `NEXT_PUBLIC_UMAMI_URL` không có (local dev) → skip, không render script tag
- Script tag: `<script defer src="{UMAMI_URL}/script.js" data-website-id="{WEBSITE_ID}" />`

### Claude's Discretion
- Chi tiết implementation của Vercel `waitUntil` (dùng `context.waitUntil` hay `after()` từ next/server)
- Cách poll 30s: `setInterval` + `router.refresh()` trong Client Component wrapper
- Exact design của badge sync trên card (màu sắc, vị trí, format timestamp)
- Migration strategy cho 2 field DB mới (syncStatus, lastSyncedAt)

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured in decisions above.

### Schema & types
- `src/db/schema.ts` — cần thêm `syncStatus` và `lastSyncedAt` vào `websites` table
- `src/types/website-ast.ts` — WebsiteAST type, sections structure

### Existing reusable code
- `src/lib/editor-utils.ts` — `updateSectionAiContent()` để merge ai_content giữ manual_overrides
- `src/lib/ai-prompts.ts` — `buildUserPrompt()` và `buildSystemPrompt()` cho AI generation
- `src/lib/ast-utils.ts` — `parseAndValidateAST()` để validate AI output trước khi save
- `src/app/api/ai/generate/route.ts` — tham khảo flow generate hiện tại để replicate trong sync

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `updateSectionAiContent(ast, sectionId, newAiContent)` trong `editor-utils.ts` — update 1 section
- `parseAndValidateAST()` trong `ast-utils.ts` — validate AI JSON output
- `buildUserPrompt(noteJson, prompt)` và `buildSystemPrompt(templateId)` — AI prompts sẵn có
- `better-auth` session verify — `auth.api.getSession({ headers })` đã dùng ở mọi route
- `sonner` toast — đã setup từ Phase 4, có thể dùng thêm cho sync error nếu cần

### Established Patterns
- API route auth: `auth.api.getSession()` → 401 nếu không có session
- AI generation: `openai.chat.completions.create()` với `response_format: json_object`, timeout 30s
- DB update: Drizzle `db.update(websites).set({...}).where(eq(websites.id, id))`
- `websites.sourceNoteId` field đã có — dùng để lookup website theo noteId

### Integration Points
- Sync API mới: `src/app/api/sync/trigger/route.ts` (POST)
- Dashboard websites list: `src/app/(dashboard)/dashboard/websites/page.tsx` — thêm polling + badge
- Public page: `src/app/(public)/[username]/[slug]/page.tsx` — thêm Umami script tag
- Schema: `src/db/schema.ts` — thêm 2 field mới, cần migration

</code_context>

<specifics>
## Specific Ideas

- Merge strategy cho sections: khớp theo index (section[0] → section[0]) không phải theo id, vì AI không biết id cũ. Researcher cần xác nhận approach này.
- `NEXT_PUBLIC_` prefix cho Umami env vars vì cần access từ client-side script injection.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-note-sync-analytics*
*Context gathered: 2026-03-18*
