# ROADMAP.md — Website Generator v1

## Tổng quan

5 phases, xây dựng từ foundation có sẵn (auth + schema đã implement).

---

## Phase 1 — Foundation Completion

**Mục tiêu:** Hoàn thiện foundation, thêm token login từ mobile app.

**Tasks:**
- Verify + complete DB schema (websites, profiles, relations)
- Enforce username required khi register
- Reserved username validation
- Token-based login endpoint (mobile app → web app)
- `proxy.ts` route protection (dashboard, editor)
- Smoke test: register → login → dashboard

**Deliverable:** User có thể đăng ký, đăng nhập (email/password + token), thấy dashboard trống.

---

## Phase 2 — Website CRUD + Templates

**Mục tiêu:** Quản lý website đầy đủ, chọn template.

**Tasks:**
- `/dashboard/websites` — danh sách website
- `/dashboard/websites/new` — tạo mới (wizard: chọn note/prompt → template → tạo)
- Template system (`src/templates/index.ts`) — 5 templates
- Keyword-based template suggestion
- Status management: draft / published / archived
- Rename, delete website
- Website limit placeholder UI (không enforce, không Freemium)

**Deliverable:** User có thể tạo, xem danh sách, đổi tên, xóa website.

---

## Phase 3 — AI Generation + Publish

**Mục tiêu:** AI tạo website thực sự và publish lên URL công khai.

**Tasks:**
- `/api/ai/generate` route (OpenAI GPT-4o → Website AST JSON)
- Integrate AI vào create flow (Phase 2)
- `app/[username]/[slug]/page.tsx` — SSR public route
- `generateMetadata` + OG Image (`opengraph-image.tsx`)
- Slug auto-gen + validation
- Archived website "inactive" page
- Copy link button

**Deliverable:** AI tạo website từ note JSON + prompt, publish được, link hoạt động ngay.

---

## Phase 4 — Editor

**Mục tiêu:** User chỉnh sửa website trực quan.

**Tasks:**
- `app/(dashboard)/editor/[websiteId]/page.tsx`
- Responsive preview toggle (iframe `/preview/[websiteId]`)
- Sidebar editor: click section → form fields
- `manual_overrides` merge logic
- Section drag-and-drop (dnd-kit)
- Image upload → Supabase Storage
- Per-section AI regenerate
- Prompt-based refinement
- Color picker + font selector (CSS variables)
- Save to DB via Server Action

**Deliverable:** User có thể edit từng section, kéo thả, upload ảnh, save.

---

## Phase 5 — Note Sync + Analytics

**Mục tiêu:** Tích hợp auto-sync với mobile app, analytics.

**Tasks:**
- `POST /api/sync/trigger` endpoint + auth token validation
- Sync merge logic: update `ai_content`, preserve `manual_overrides`
- In-app notification khi sync xảy ra
- Umami script embed trong published website layout
- Debounce handling recommendation (5 phút — xử lý ở mobile app)

**Deliverable:** Note thay đổi → website tự cập nhật content; analytics tracking.

---

## Dependency Map

```
Phase 1 (Foundation)
  └─► Phase 2 (CRUD + Templates)
        └─► Phase 3 (AI + Publish)
              └─► Phase 4 (Editor)
                    └─► Phase 5 (Sync + Analytics)
```

---

## Current State

- **Foundation code:** ✓ Auth pages, dashboard, DB schema, Tailwind setup
- **Codebase map:** ✓ `.planning/codebase/`
- **Next action:** `/gsd:plan-phase 1`
