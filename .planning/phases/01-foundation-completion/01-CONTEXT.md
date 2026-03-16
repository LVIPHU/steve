# Phase 1: Foundation Completion - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Hoàn thiện auth foundation — username enforcement khi đăng ký, token login từ mobile app, và route protection. Không bao gồm bất kỳ tính năng website nào.

Deliverable: User có thể đăng ký (email/password + username), đăng nhập, và mobile app có thể tạo link để auto-login user vào web app.

</domain>

<decisions>
## Implementation Decisions

### Username Capture
- Username được thêm **trực tiếp vào form đăng ký** (cùng với name, email, password) — 1 bước, không có onboarding riêng cho email/password
- Validate **khi submit form** (không real-time check khi gõ)
- Username **cố định sau khi đăng ký** — không thể thay đổi sau này (vì dùng trong public URL)
- Google OAuth users → sau khi OAuth xong, check xem đã có `profiles` record chưa, nếu chưa → **redirect đến `/onboarding`** để đặt username

### Token Login Flow (Mobile → Web)
- Web app cung cấp endpoint **`POST /api/auth/mobile-token`**
  - Mobile app gửi kèm **better-auth session token** của mình để xác thực (không gửi email/password)
  - Web app validate session token đó với better-auth, xác định user ID
  - Web app tạo một **one-time token** (random UUID hoặc crypto token), lưu vào DB với expiry
  - Trả về token cho mobile app
- Mobile app nhúng token vào URL: `https://webapp.com/api/auth/token-login?token=xxx`
- Mobile app mở URL đó trong browser (deep link hoặc in-app browser)
- Web app endpoint **`GET /api/auth/token-login`** validate token, tạo better-auth session, xóa token khỏi DB
- Redirect về **`/dashboard`** sau khi login thành công
- Token có hiệu lực **5 phút** sau khi được tạo
- Token chỉ dùng được **1 lần** (xóa sau khi dùng)

### Route Protection
- Dùng pattern 2 lớp theo technical spec:
  - **Lớp 1 — `proxy.ts`** (thay middleware.ts trong Next.js 16): fast cookie check, redirect sớm
  - **Lớp 2 — layout/page**: validate session thật với DB
- `proxy.ts` protect: `/dashboard/:path*`, `/editor/:path*`, `/onboarding`

### Claude's Discretion
- Token storage: có thể dùng `verification` table của better-auth (đã có `identifier`, `value`, `expiresAt`) thay vì tạo bảng mới
- Error pages: design cho invalid/expired token link
- Username format rules: lowercase, numbers, hyphens — regex `/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/`

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/(auth)/register/page.tsx`: Existing register form (Client Component) — cần thêm username field vào đây
- `src/components/ui/input.tsx`, `label.tsx`, `button.tsx`: UI components đã có, dùng cho username field và onboarding page
- `src/lib/auth.ts`: better-auth config — cần thêm logic tạo `profiles` record sau signup
- `authClient.signUp.email()`: Signup method hiện tại — sẽ cần pass thêm username data

### Established Patterns
- Client Component với `useState` error: Pattern đã có trong login/register — dùng tương tự cho onboarding
- Session check in layout: `auth.api.getSession({ headers: await headers() })` → pattern này cần thêm check `profiles` record tồn tại
- Route handlers: `src/app/api/auth/[...all]/route.ts` — template cho 2 route mới mobile-token và token-login

### Integration Points
- `src/db/schema.ts`: `profiles.username` đã defined — cần được populate trong signup flow và onboarding
- Schema `verification` table: Có thể tái dùng để lưu one-time tokens (identifier = userId, value = token, expiresAt = 5 phút)
- `(dashboard)/layout.tsx`: Cần thêm check ngoài session — user phải có `profiles` record (username set), nếu chưa redirect `/onboarding`
- New files cần tạo:
  - `src/app/(auth)/onboarding/page.tsx` — username setup page cho Google OAuth users
  - `src/app/api/auth/mobile-token/route.ts` — endpoint cho mobile app lấy token
  - `src/app/api/auth/token-login/route.ts` — endpoint validate token và tạo session
  - `proxy.ts` (root) — Next.js 16 middleware replacement

</code_context>

<specifics>
## Specific Ideas

- Token flow: mobile gọi POST /api/auth/mobile-token với better-auth session → nhận token → mở link trong browser
- Onboarding page chỉ dành cho Google OAuth users (email/password users đặt username trong form đăng ký luôn)
- `/onboarding` bị protect bởi proxy.ts (phải có session mới vào được)

</specifics>

<deferred>
## Deferred Ideas

- Thay đổi username sau khi đăng ký — out of scope v1
- Avatar upload khi onboarding — Phase khác
- Email verification flow — out of scope v1

</deferred>

---

*Phase: 01-foundation-completion*
*Context gathered: 2026-03-16*
