# PROJECT.md — Website Generator

## Product

**Tên:** Website Generator
**Loại:** Companion web app cho mobile note-taking app
**Mô tả:** Cho phép người dùng tự động tạo website hoàn chỉnh từ nội dung note (qua JSON API) hoặc từ prompt tự nhập. Website có thể chỉnh sửa, publish và chia sẻ công khai.

## Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | Next.js 16 App Router |
| Styling | Tailwind CSS v4 |
| ORM | Drizzle ORM v1.x |
| Database | Supabase Postgres |
| Storage | Supabase Storage (ảnh) |
| Auth | better-auth (Drizzle adapter) |
| AI | OpenAI GPT-4o |
| Analytics | Umami (self-hosted Railway) |
| Hosting | Vercel |

## Auth Model

- **Email/password:** Dùng chung credentials với mobile app
- **Token login:** Mobile app tạo token → mở web app với link đặc biệt → auto đăng nhập

## Notes Integration

- Notes **không** lưu trong DB của web app
- Note content được truyền vào tại thời điểm generate (JSON API từ mobile app)
- `websites.sourceNoteId` lưu ID note nguồn để dùng cho auto-sync

## Users

Người dùng app note mobile, muốn chia sẻ kiến thức dưới dạng website:
- Học ngôn ngữ, fitness, nấu ăn, lập trình, kỹ năng cá nhân

## Current Milestone: v1.1 Enhanced AI Pipeline

**Goal:** Nâng cấp pipeline AI để tạo website có visual identity riêng — không còn generic blue DaisyUI default.

**Target features:**
- Component Library: ~25 HTML/DaisyUI snippets tĩnh, chọn bằng tag matching
- Design Agent: gpt-4o-mini quyết định palette + typography phù hợp domain
- Context optimization: tách system prompt (cacheable ~800 tokens) vs user message (design brief + snippets)
- Review + Conditional Refine: chấm điểm 0-100, refine khi score < 75
- Edit mode streamlined: 4 bước (bỏ design/review/refine)

**Out of scope (v1.1):** Multi-page progressive generation → defer v1.2

**Progress:**
- Phase 10 complete (2026-03-20): Design Agent (`runDesignAgent`, `DesignResultSchema`, `FALLBACK_DESIGN`), Context Builder (`buildUserMessage`, `buildEditUserMessage`, `buildGoogleFontsImport`, `refineHtml` stub), lean invariant `buildSystemPrompt()` — PIPE-04 through PIPE-09 validated
- Next: Phase 11 — Reviewer + Pipeline Rewire + UI Update

## Out of Scope (v1)

- Freemium / plan tiers / payment processing
- Admin panel
- Custom domains
- Version history
- Multi-user collaboration
- Export source code
- Template marketplace
