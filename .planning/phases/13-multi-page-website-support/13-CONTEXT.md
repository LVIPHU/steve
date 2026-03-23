# Phase 13: Multi-page Website Support - Context

**Gathered:** 2026-03-23 (discuss mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

User có thể tạo website nhiều trang — mỗi trang là HTML riêng lưu trong `pages` JSONB column, có URL thật `/{username}/{slug}/{page}`, quản lý pages trong editor qua Page Manager, và export ZIP để dùng offline. Existing single-page websites vẫn hoạt động bình thường (backward compat).

</domain>

<decisions>
## Implementation Decisions

### Database Schema
- **D-01:** Thêm `pages` JSONB column vào `websites` table: `{ [pageName: string]: string }` (pageName → HTML string)
- **D-02:** Giữ `htmlContent TEXT` column trong transition để backward compat; sau khi migration hoàn tất có thể deprecate
- **D-03:** Migration dùng Drizzle migration script (1 lần): `UPDATE websites SET pages = jsonb_build_object('index', html_content) WHERE html_content IS NOT NULL` — atomic, không cần application-level lazy convert

### Routing
- **D-04:** Public route `/{username}/{slug}` (no page) → serve `pages.index` — backward compat với tất cả existing published websites
- **D-05:** Public route `/{username}/{slug}/{page}` → serve `pages[page]`; nếu page không tồn tại → 404 (không redirect về index)
- **D-06:** Draft → 404, Archived → archived message (giữ nguyên behavior hiện tại)

### Editor — Page Manager UI
- **D-07:** Page Manager là tab strip nhỏ phía trên iframe preview — `[ Index ] [ About ] [ + ]`
- **D-08:** Click tab → switch sang page đó (load HTML của page đó vào iframe và chat)
- **D-09:** Nút `[+]` → prompt nhập tên page mới → tạo blank page, switch sang đó
- **D-10:** Right-click hoặc `×` trên tab → delete page (không xóa tab cuối/index)

### Editor — New Page Behavior
- **D-11:** Page mới tạo ra là **blank HTML** — user dùng Chat để AI generate nội dung
- **D-12:** Chat history là **per-page** — switch page thì chat history switch theo. `websites.chatHistory` đổi thành `{ [pageName: string]: ChatMessage[] }`

### Editor — Generate API
- **D-13:** `POST /api/ai/generate-html` nhận thêm optional `pageName` param (default `"index"`); sau generate lưu HTML vào `pages[pageName]` thay vì `htmlContent`
- **D-14:** AI instruction trong fresh generation mode: dùng relative links (`about.html`, `index.html`) thay vì absolute URL

### Export
- **D-15:** Nút export ZIP nằm trong **editor toolbar** (cạnh nút Publish)
- **D-16:** `GET /api/websites/[id]/export` trả ZIP với `{pageName}.html` files cho tất cả pages

### Claude's Discretion
- Exact tab strip styling (color, active state, hover)
- ZIP file naming convention (e.g., `website-{slug}.zip`)
- Error handling khi generate page mới thất bại

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §v1.2 — MP-01 through MP-08 (full spec cho multi-page support)

### Existing code to modify
- `src/db/schema.ts` — Current schema: `htmlContent TEXT`, `chatHistory JSONB`
- `src/app/(public)/[username]/[slug]/route.ts` — Public route handler (cần extend để handle `/page`)
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` — Editor (cần thêm Page Manager UI)
- `src/app/api/ai/generate-html/route.ts` — Generate API (cần `pageName` param + save to `pages[pageName]`)
- `src/app/api/websites/[id]/route.ts` — PATCH endpoint (cần accept `pages` field)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `editor-client.tsx`: `htmlContent` state + `srcDoc={htmlContent}` pattern — sẽ đổi thành `currentPageHtml` state mapped từ `pages[currentPage]`
- `editor-client.tsx`: debounce save pattern (500ms) — reuse cho save `pages` JSONB
- `editor-client.tsx`: Chat/Code tab UI — tab strip pattern có sẵn để tham khảo cho Page Manager tabs

### Established Patterns
- Route Handlers (không phải `page.tsx`) cho public viewer — giữ nguyên, chỉ extend path
- `db` client từ `src/db/index.ts` + Drizzle ORM — dùng cho migration script
- SSE streaming pattern trong generate API — không thay đổi

### Integration Points
- `websites.htmlContent TEXT` → `websites.pages JSONB` (schema change + migration)
- `websites.chatHistory JSONB` → từ `ChatMessage[]` sang `{ [pageName: string]: ChatMessage[] }`
- Public route `[slug]/route.ts` → thêm dynamic segment `[page]` hoặc handle trong cùng route
- Editor: thêm `currentPage` state, Page Manager component trên iframe

</code_context>

<specifics>
## Specific Ideas

- Page Manager: tab strip trên iframe, tabs nhỏ — `[ Index ] [ About ] [ + ]`
- Relative links giữa pages: `href="about.html"` không phải `href="/username/slug/about"`
- Export ZIP: button trong editor toolbar cạnh Publish

</specifics>

<deferred>
## Deferred Ideas

- Auto-detect broken links giữa các pages — future phase
- Page order management (drag to reorder) — future phase
- Per-page SEO meta editing — future phase

### Reviewed Todos (not folded)
- "Dashboard sidebar và AI onboarding chat" — đã done ở Phase 8, false positive
- "Resources gallery và RAG-powered generation" — deferred v2, out of scope

</deferred>

---

*Phase: 13-multi-page-website-support*
*Context gathered: 2026-03-23*
