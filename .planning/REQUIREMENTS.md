# REQUIREMENTS.md — Website Generator v1

## Functional Requirements

### Must Have

| # | Yêu cầu | Mô tả |
|---|---|---|
| F-01 | Auth: email/password | Đăng nhập bằng email/password — dùng chung credentials với mobile app |
| F-02 | Auth: token login | Mobile app tạo link với token → web app tự động đăng nhập user |
| F-03 | Username enforcement | Bắt buộc chọn username khi đăng ký, validate không trùng reserved words |
| F-04 | Website list | Trang danh sách tất cả website của user (`/dashboard/websites`) |
| F-05 | Create website | Tạo mới: chọn note JSON + template + prompt tuỳ chọn |
| F-06 | Website status | Ba trạng thái: Draft / Published / Archived |
| F-07 | Website CRUD | Đổi tên, xóa, duplicate |
| F-08 | Template system | 5 template cố định: blog, portfolio, fitness, cooking, learning |
| F-09 | AI template suggestion | Gợi ý template dựa trên keyword matching từ note content |
| F-10 | AI generation | OpenAI GPT-4o: note JSON + template + prompt → Website AST (JSON) |
| F-11 | Regenerate website | Gen lại toàn bộ website |
| F-12 | Visual editor | Sidebar form: click section → edit fields → lưu |
| F-13 | Image upload | Upload ảnh lên Supabase Storage |
| F-14 | Section reorder | Kéo thả thứ tự section (dnd-kit) |
| F-15 | Responsive preview | Toggle Desktop / Tablet / Mobile (iframe) |
| F-16 | Publish | Website có URL công khai: `/[username]/[slug]` (SSR) |
| F-17 | SEO auto-gen | Meta title, description, OG image (Next.js ImageResponse), slug |
| F-18 | Note sync API | `POST /api/sync/trigger` — nhận note update, cập nhật ai_content, giữ manual_overrides |
| F-19 | Analytics | Umami self-hosted embed trong website được publish |

### Should Have

| # | Yêu cầu | Mô tả |
|---|---|---|
| S-01 | Per-section regenerate | Gen lại 1 section cụ thể |
| S-02 | Prompt refinement | Nhập thêm prompt để AI tinh chỉnh sau khi gen |
| S-03 | Sync notification | Thông báo trong app khi note sync xảy ra |
| S-04 | Slug editing | Chỉnh sửa slug URL trước khi publish |
| S-05 | Color/font customization | Tùy chỉnh màu chủ đạo, font chữ |

### Out of Scope (v1)

- Freemium / plan tiers / payment / Stripe
- Admin panel
- Custom domains
- Version history
- Multi-user collaboration
- Export source code
- Template marketplace
- Push notifications

## Non-Functional Requirements

| # | Yêu cầu |
|---|---|
| NF-01 | AI generation ≤ 30 giây trong điều kiện bình thường |
| NF-02 | Published URL hoạt động ngay sau khi nhấn Publish (không delay) |
| NF-03 | Website được gen phải responsive (mobile / tablet / desktop) |
| NF-04 | SEO meta tags tự động khi publish |

## Business Rules

1. Khi note nguồn bị xóa trong mobile app → website vẫn tồn tại với nội dung cuối cùng
2. Draft website → không thể truy cập qua URL công khai (404)
3. Archived website → URL vẫn tồn tại nhưng hiển thị trang "Website không còn hoạt động"
4. Khi auto-sync: chỉ cập nhật `ai_content`, không bao giờ ghi đè `manual_overrides`
5. Slug do AI tạo tự động nhưng user có thể sửa trước khi publish
6. Reserved usernames: `dashboard`, `editor`, `api`, `login`, `register`, `settings`, `pricing`, `about`, `admin`

## Website AST Schema

```json
{
  "theme": {
    "primaryColor": "#2563eb",
    "backgroundColor": "#ffffff",
    "font": "Inter"
  },
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "ai_content": { "headline": "...", "subtext": "..." },
      "manual_overrides": {}
    }
  ],
  "seo": {
    "title": "...",
    "description": "...",
    "slug": "..."
  }
}
```

**Quy tắc render:** Dùng `manual_overrides[field]` nếu tồn tại, ngược lại dùng `ai_content[field]`.
