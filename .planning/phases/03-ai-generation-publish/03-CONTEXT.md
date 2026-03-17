# Phase 3: AI Generation + Publish - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

AI tạo Website AST JSON từ note JSON (lấy qua mobile API bằng sourceNoteId) hoặc free prompt → lưu vào `websites.content` + `websites.seoMeta` → render công khai tại `/[username]/[slug]` (SSR) → SEO auto-gen (meta + OG image).

**Không bao gồm Phase này:** Visual editor (Phase 4), prompt refinement/per-section regenerate (Phase 4), note auto-sync (Phase 5), Umami analytics (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Section types
- **5 core section types:** `hero`, `about`, `features`, `content`, `gallery`, `cta`
- Claude quyết định fields cho từng type (planner sẽ define trong system prompt):
  - `hero`: headline, subtext, ctaText, ctaUrl
  - `about`: title, body
  - `features`: title, items[{ icon, label, description }]
  - `content`: title, body (long-form text)
  - `gallery`: title, images[{ url, caption }]
  - `cta`: title, body, buttonText, buttonUrl
- Mỗi section object: `{ id, type, ai_content: {...}, manual_overrides: {} }`

### Template section presets
Mỗi template có bộ sections riêng (gợi ý trong OpenAI system prompt, AI vẫn có thể điều chỉnh):
- **Blog:** hero → content → cta
- **Portfolio:** hero → about → features (projects) → cta
- **Fitness:** hero → features (workouts/routines) → content → cta
- **Cooking:** hero → content → gallery → cta
- **Learning:** hero → content → features (topics/modules) → cta

### Template styling (primaryColor per template)
Mỗi template có màu mặc định trong `theme.primaryColor`:
- Blog: `#2563eb` (blue)
- Portfolio: `#7c3aed` (violet)
- Fitness: `#16a34a` (green)
- Cooking: `#ea580c` (orange)
- Learning: `#0891b2` (cyan)

Font: Google Fonts qua `next/font/google`. Mỗi template dùng font riêng (Claude quyết định font phù hợp).

### Template layout components
Mỗi template có layout component riêng (spacing, typography, background style khác nhau):
- `BlogLayout`, `PortfolioLayout`, `FitnessLayout`, `CookingLayout`, `LearningLayout`
- Mỗi layout wrap các Section components chung, chỉ khác wrapper/styling.

### Section components (shared, dùng cả public + dashboard)
- Cùng 1 bộ React components: `HeroSection`, `AboutSection`, `FeaturesSection`, `ContentSection`, `GallerySection`, `CtaSection`
- Dùng cả trong public route `/[username]/[slug]` VÀ trong dashboard preview (render inline)
- Quy tắc render: `manual_overrides[field] ?? ai_content[field]`

### Generation UX flow (trang /dashboard/websites/[id])
1. User nhấn **"Generate"** → loading spinner trên trang chi tiết (inline, không redirect)
2. Backend gọi mobile app API lấy note JSON (dùng `sourceNoteId`); nếu website tạo từ free prompt thì không có note
3. OpenAI GPT-4o trả về: `{ sections[], seo: { title, description, slug } }`
4. Lưu vào `websites.content` + `websites.seoMeta`, cập nhật status vẫn là `draft`
5. Preview render inline bên dưới (Section components trực tiếp — **không phải iframe**, iframe là Phase 4)
6. Sau gen: **slug input** (pre-filled từ AI, editable) + **nút "Publish"** hiện ra ngay trang chi tiết
7. Publish → đổi status → `published`, URL công khai live
8. **Regenerate (F-11):** Nút "Tạo lại" thay/bổ sung nút Generate sau lần đầu → overwrite `ai_content`, giữ `manual_overrides`

### Prompt refinement
- Deferred sang Phase 4 (S-02 là should-have)

### Public route `/[username]/[slug]`
- Route group: `src/app/(public)/[username]/[slug]/page.tsx`
- **Blank canvas** — không có dashboard nav, không có app header/footer
- Server Component (SSR): query DB lấy website, user profile
- Draft → `notFound()` (404)
- Archived → render trang "Website không còn hoạt động" đơn giản
- Published → render `{Template}Layout` với các Section components

### SEO auto-gen (F-17)
- OpenAI generate `seo.title`, `seo.description`, `seo.slug` cùng lúc với content (1 request)
- Lưu vào `websites.seoMeta` (JSONB)
- Next.js `generateMetadata()` trong public page dùng `seoMeta` để export `<title>`, `<meta name="description">`, `<meta property="og:*">`
- **OG Image:** `src/app/(public)/[username]/[slug]/opengraph-image.tsx` (Next.js ImageResponse convention)
  - Nội dung: title lớn + username/slug nhỏ
  - Background color: `theme.primaryColor` từ website AST
  - Kích thước chuẩn: 1200×630

### Claude's Discretion
- Fields chi tiết của từng section type (trong giới hạn đã định ở trên)
- Font choice per template (Inter cho Blog, Playfair cho Portfolio, etc.)
- Styling chi tiết của từng TemplateLayout component
- Error state khi OpenAI call thất bại
- Loading state design trên trang chi tiết

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Schema & Data Model
- `src/db/schema.ts` — Bảng `websites` (content JSONB, seoMeta JSONB, status, slug, sourceNoteId, templateId, userId)
- `.planning/REQUIREMENTS.md` §"Website AST Schema" — JSON structure chuẩn: `{ theme, sections[], seo }` và quy tắc render `manual_overrides ?? ai_content`

### Requirements
- `.planning/REQUIREMENTS.md` — F-10 (AI generation GPT-4o), F-11 (regenerate), F-16 (publish public URL), F-17 (SEO + OG image)
- `.planning/REQUIREMENTS.md` §"Business Rules" — Rule #2 (draft → 404), Rule #3 (archived → "không còn hoạt động"), Rule #5 (slug editable trước publish)

### Existing Code
- `src/lib/templates.ts` — TEMPLATES array (5 templates với id, name, emoji), TemplateId type
- `src/lib/slugify.ts` — generateSlug() dùng cho slug từ AI title
- `src/app/api/websites/[id]/route.ts` — PATCH/DELETE patterns để tham khảo auth + ownership check

No external ADRs or design specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/templates.ts`: TEMPLATES array + suggestTemplate() — dùng để lookup template info khi render
- `src/lib/slugify.ts`: generateSlug() — dùng để normalize AI-generated slug
- `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`: Form/UI primitives cho dashboard detail page
- `src/app/api/websites/[id]/route.ts`: Auth + ownership pattern (copy cho generate API route)

### Established Patterns
- Server Components default: `auth.api.getSession({ headers: await headers() })`
- API routes: auth check + ownership check + DB mutation
- `cn()` từ `@/lib/utils` cho conditional classes
- `notFound()` từ `next/navigation` cho 404

### Integration Points
- `src/app/(dashboard)/dashboard/websites/[id]/page.tsx` — Trang chi tiết (đã có placeholder Generate button) cần update: thêm generate logic, preview, slug input, publish button
- Cần tạo mới:
  - `src/app/api/ai/generate/route.ts` — POST endpoint gọi OpenAI
  - `src/app/(public)/[username]/[slug]/page.tsx` — Public SSR route
  - `src/app/(public)/[username]/[slug]/opengraph-image.tsx` — OG image
  - `src/components/sections/` — HeroSection, AboutSection, FeaturesSection, ContentSection, GallerySection, CtaSection
  - `src/components/layouts/` — BlogLayout, PortfolioLayout, FitnessLayout, CookingLayout, LearningLayout

</code_context>

<specifics>
## Specific Ideas

- Note JSON được fetch tại runtime từ mobile app API bằng `sourceNoteId` — không lưu trong DB của web app (theo PROJECT.md)
- Websites tạo từ tab "Tự viết prompt" (không có `sourceNoteId`) sẽ gen chỉ với prompt text, không có note JSON
- OG image background dùng `theme.primaryColor` từ website AST để mỗi website có OG image riêng theo màu template
- Preview trong dashboard là inline render (Section components trực tiếp), iframe responsive preview sẽ là Phase 4

</specifics>

<deferred>
## Deferred Ideas

- Prompt refinement sau khi gen (S-02) — Phase 4
- Per-section regenerate (S-01) — Phase 4
- Responsive preview toggle Desktop/Tablet/Mobile (F-15) — Phase 4
- Umami analytics embed — Phase 5

</deferred>

---

*Phase: 03-ai-generation-publish*
*Context gathered: 2026-03-18*
