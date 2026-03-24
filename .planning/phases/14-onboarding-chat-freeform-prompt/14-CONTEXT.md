# Phase 14: onboarding-chat-freeform-prompt - Context

**Gathered:** 2026-03-24 (assumptions mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Đổi onboarding chat từ 2 câu hỏi cố định sang 1 text input tự do — user gõ prompt thoải mái như Lovable, AI tạo website ngay từ đó. Chỉ thay đổi luồng tạo website từ dashboard; editor, API, và public routes không nằm trong scope.

</domain>

<decisions>
## Implementation Decisions

### UX Interaction Pattern
- **D-01:** Xóa toàn bộ state machine chat (phases: greeting, waiting_q1, waiting_q2, confirm, creating) và thay bằng màn hình đơn giản: heading + textarea lớn + nút submit
- **D-02:** Không có bước confirm trung gian — submit là tạo website và redirect thẳng vào editor
- **D-03:** Trong khi đang tạo (loading state), hiển thị spinner/skeleton thay vì chat bubbles

### Website Name Extraction
- **D-04:** Dùng AI (gpt-4o-mini) để extract tên website có nghĩa từ freeform prompt — không cắt 50 ký tự đầu thô
- **D-05:** AI name extraction phải nhanh (~1s), chạy song song hoặc trước khi gọi `POST /api/websites`
- **D-06:** Fallback nếu AI extraction thất bại: lấy 50 ký tự đầu prompt (hoặc "Website mới")

### Input Design
- **D-07:** `<Textarea>` lớn (rows 4–6), placeholder gợi ý ví dụ prompt cụ thể (ví dụ: "Tạo landing page cho khóa học tiếng Anh online, có phần giới thiệu, bảng giá và form đăng ký")
- **D-08:** Ctrl+Enter để submit; Enter thường xuống dòng trong textarea
- **D-09:** Submit button disabled khi input trống hoặc đang loading

### Scope of Changes
- **D-10:** Chỉ sửa `src/app/(dashboard)/dashboard/onboarding-chat.tsx` — `page.tsx`, `route.ts`, `editor-client.tsx` không thay đổi
- **D-11:** URL pattern `?prompt=encodeURIComponent(userPrompt)` giữ nguyên — editor-client.tsx đã nhận và auto-generate từ `initialPrompt`

### Claude's Discretion
- Cách implement AI name extraction (server action, inline fetch, hay gọi OpenAI trực tiếp trong component) — chọn pattern đơn giản nhất, không cần SSE hay streaming
- Exact wording của heading, subheading, và placeholder text

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured in decisions above.

### Existing implementation to replace
- `src/app/(dashboard)/dashboard/onboarding-chat.tsx` — file duy nhất cần sửa; toàn bộ state machine cần xóa
- `src/app/(dashboard)/dashboard/page.tsx` — chỉ render `<OnboardingChat />`, không thay đổi
- `src/app/api/websites/route.ts` — `POST /api/websites` nhận `{ name }`, trả `{ id, slug }` — giữ nguyên

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Button`, `Textarea`, `Skeleton` từ `@/components/ui/` — đã dùng trong component hiện tại
- `toast` từ `sonner` — đã import, dùng cho error handling
- `motion`, `AnimatePresence` từ `motion/react` — đã import nếu cần animate
- Pattern Ctrl+Enter submit: đã có trong `editor-client.tsx` (line ~431)

### Established Patterns
- Loading state: dùng `Skeleton` hoặc `Loader2` spinner (cả hai đã có trong codebase)
- Error handling: `toast.error(...)` sau failed fetch
- Router redirect: `useRouter()` + `router.push(...)` — pattern hiện tại ở handleCreate()

### Integration Points
- `POST /api/websites` — nhận `{ name: string }`, trả `{ id, slug }` — name từ AI extraction
- `router.push(\`/dashboard/websites/${id}/edit?prompt=${encodeURIComponent(prompt)}\`)` — URL pattern đã hoạt động end-to-end
- `editor-client.tsx` auto-generates khi `initialPrompt` không rỗng và không có HTML hiện tại

</code_context>

<specifics>
## Specific Ideas

- UX target: giống Lovable — user thấy 1 ô nhập lớn, gõ xong nhấn nút, vào thẳng editor đang generate
- AI name extraction nên ngắn gọn: 1 OpenAI call với instruction đơn giản, không cần streaming

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

### Reviewed Todos (not folded)
- "Dashboard sidebar và AI onboarding chat" — đã hoàn thành ở Phase 8; phase 14 là iteration tiếp theo
- "Resources gallery và RAG-powered generation" — out of scope, backlog

</deferred>

---

*Phase: 14-onboarding-chat-freeform-prompt*
*Context gathered: 2026-03-24*
