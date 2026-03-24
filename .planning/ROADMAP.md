# Roadmap: Website Generator v1

## Overview

Building a companion web app for a mobile note-taking app. Users turn their notes (received via JSON API) into publishable websites using AI. The foundation (auth, dashboard, DB schema) is already in place. We build CRUD + templates → AI generation + publish → visual editor → note sync + analytics.

## Milestones

- ✅ **v1.0 MVP** - Phases 1-8 (shipped 2026-03-19)
- 🚧 **v1.1 Enhanced AI Pipeline** - Phases 9-11 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-8) - SHIPPED 2026-03-19</summary>

- [x] **Phase 1: Foundation Completion** - Verify/complete DB schema, enforce username, add token login from mobile app (1/3 plans done) (completed 2026-03-17)
- [x] **Phase 2: Website CRUD + Templates** - Website list, create flow, 5 templates, status management (completed 2026-03-17)
- [x] **Phase 3: AI Generation + Publish** - OpenAI GPT-4o generation, public SSR routes, SEO auto-gen (completed 2026-03-17)
- [x] **Phase 4: Editor** - Sidebar editor, dnd-kit reorder, image upload, color/font customization (completed 2026-03-18)
- [x] **Phase 5: Note Sync + Analytics** - Auto-sync API endpoint, merge logic, Umami analytics (completed 2026-03-18)
- [x] **Phase 6: shadcn-ui Templates Interactive Sections** - 5 new interactive section types, template visual redesign, dark mode, editor extensions (completed 2026-03-19)
- [x] **Phase 7: HTML-first AI Generation + Lovable-style Editor** - GPT-4o full HTML output, iframe editor, raw HTML public route (completed 2026-03-19)
- [x] **Phase 8: Dashboard Sidebar + AI Onboarding Chat** - Fixed left sidebar, dashboard AI wizard, editor chat history persistence (completed 2026-03-19)

### Phase 1: Foundation Completion
**Goal**: Foundation hoàn chỉnh — user có thể đăng ký, đăng nhập (email/password + token từ mobile), thấy dashboard trống.
**Depends on**: Nothing (first phase)
**Requirements**: F-01, F-02, F-03
**Success Criteria** (what must be TRUE):
  1. User can register with email/password and is required to set a username
  2. Reserved usernames (dashboard, editor, api, login, register, settings, admin) are rejected
  3. User can log in via email/password
  4. Mobile app can generate a token link that auto-logs-in the user on the web app
  5. Dashboard route is protected — unauthenticated users are redirected to /login
  6. DB schema is complete and migrated (websites + profiles tables verified)
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Auth server config: additionalFields, databaseHooks, bearer plugin, proxy.ts, typecheck script
- [x] 01-02-PLAN.md — Registration + onboarding UI: register form username field, /onboarding page, dashboard layout profiles check
- [x] 01-03-PLAN.md — Mobile token endpoints: POST /api/auth/mobile-token, GET /api/auth/token-login

### Phase 2: Website CRUD + Templates
**Goal**: User có thể tạo, xem danh sách, đổi tên, xóa website. Template system hoạt động.
**Depends on**: Phase 1
**Requirements**: F-04, F-05, F-06, F-07, F-08, F-09
**Success Criteria** (what must be TRUE):
  1. /dashboard/websites shows all user websites with status badges
  2. User can create a new website (choose note JSON source or free prompt)
  3. 5 hardcoded templates are displayed and selectable
  4. Keyword-based template suggestion works from note content
  5. User can rename and delete websites
  6. Website status changes (draft/published/archived) work correctly
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Vitest setup, template system, slug utility, website mutation API route
- [x] 02-02-PLAN.md — Create website form page, server action, detail page, nav update
- [x] 02-03-PLAN.md — Website list page, WebsiteCard component with CRUD interactions

### Phase 3: AI Generation + Publish
**Goal**: AI tạo website từ note JSON + prompt, publish được lên URL công khai, SEO hoạt động.
**Depends on**: Phase 2
**Requirements**: F-10, F-11, F-16, F-17
**Success Criteria** (what must be TRUE):
  1. /api/ai/generate calls OpenAI GPT-4o and returns a valid Website AST JSON
  2. Generated website is displayed in preview after creation
  3. Published website is accessible at /[username]/[slug] via SSR
  4. Draft websites return 404 on public URL
  5. Archived websites show "Website không còn hoạt động" page
  6. SEO meta title, description, and OG image are auto-generated on publish
  7. Slug is auto-generated but editable before publish
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md — WebsiteAST types, AST validation utils, AI prompt builders, POST /api/ai/generate route
- [x] 03-02-PLAN.md — 6 section components (Hero/About/Features/Content/Gallery/CTA) + 5 template layouts + renderers
- [x] 03-03-PLAN.md — Dashboard detail page: generate/preview/publish interactive flow (Client Component)
- [x] 03-04-PLAN.md — Public SSR route /[username]/[slug], generateMetadata SEO, OG image endpoint

### Phase 4: Editor
**Goal**: User chỉnh sửa website trực quan qua sidebar, kéo thả section, upload ảnh, tùy chỉnh màu và font.
**Depends on**: Phase 3
**Requirements**: F-12, F-13, F-14, F-15, S-01, S-02, S-05
**Success Criteria** (what must be TRUE):
  1. Editor page shows responsive preview (direct React render) with Desktop/Tablet/Mobile toggle
  2. Clicking a section opens sidebar with editable fields
  3. Edits are saved as manual_overrides — AI content is not overwritten
  4. Sections can be reordered via drag-and-drop (dnd-kit)
  5. Images can be uploaded to Supabase Storage and used in sections
  6. Primary color and font can be customized (CSS variables)
  7. Per-section AI regenerate button works
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — Install deps, extend PATCH API, editor-utils + tests, upload API, regenerate-section API
- [x] 04-02-PLAN.md — Editor page, EditorClient, topbar, preview, sidebar sections tab with dnd-kit, section edit forms
- [x] 04-03-PLAN.md — Theme tab, image upload UI, per-section regenerate UI, toast, unsaved guard, detail page edit button, public page font

### Phase 5: Note Sync + Analytics
**Goal**: Note thay đổi trong mobile app → website tự cập nhật content; analytics tracking hoạt động.
**Depends on**: Phase 4
**Requirements**: F-18, F-19, S-03
**Success Criteria** (what must be TRUE):
  1. POST /api/sync/trigger accepts note JSON from mobile app (with auth token)
  2. Website ai_content is updated without touching manual_overrides
  3. In-app notification appears when sync occurs
  4. Umami analytics script is embedded in published website layout
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — DB schema + sync API route (after() background AI) + merge logic + SyncBadge + 30s polling
- [x] 05-02-PLAN.md — Umami analytics script embed in public page + env vars

### Phase 6: shadcn-ui Templates Interactive Sections

**Goal:** Nang cap visual quality toan bo 5 templates bang shadcn/ui + them 5 interactive section types moi (steps, ingredients, goals, flashcard, quiz) + dark mode + editor add-section flow.
**Requirements**: P6-01, P6-02, P6-03, P6-04, P6-05, P6-06, P6-07, P6-08, P6-09, P6-10, P6-11, P6-12, P6-13, P6-14
**Depends on:** Phase 5
**Success Criteria** (what must be TRUE):
  1. SectionType union includes 11 types (6 existing + 5 new interactive)
  2. AI generates correct section types per template (cooking: ingredients+steps, learning: goals+flashcard+quiz)
  3. All 5 interactive sections work on public pages with correct behavior (check, flip, score, etc.)
  4. Progress persists to localStorage where specified (goals, quiz)
  5. No hydration mismatches on interactive sections (SSR renders static, client hydrates)
  6. Editor has edit forms for all 11 section types
  7. "Them section" flow works: Dialog picker filtered by template, AI generates content
  8. All 5 templates have distinct visual identities (not just different fonts)
  9. Dark mode toggle works on all public template pages, preference persists
  10. No FOUC on dark mode page load
**Plans:** 5/5 plans complete

Plans:
- [x] 06-01-PLAN.md — Extend types/validation/AI prompts, install 7 shadcn components, add TEMPLATE_ALLOWED_SECTIONS
- [x] 06-02-PLAN.md — Create 5 interactive section components (goals, quiz, flashcard, steps, ingredients) + update SectionRenderer
- [x] 06-03-PLAN.md — Editor extensions: edit forms for 5 new types + add-section Dialog flow
- [x] 06-04-PLAN.md — Redesign all 5 template layouts with distinct visual identities
- [x] 06-05-PLAN.md — Dark mode: next-themes ThemeProvider + DarkModeToggle in all layouts

### Phase 7: HTML-first AI generation and Lovable-style editor

**Goal:** Thay the he thong AST/template bang HTML-first model — GPT-4o tao HTML hoan chinh, editor kieu Lovable (iframe + chat + code), landing page moi, public route tra raw HTML.
**Requirements**: P7-01, P7-02, P7-03, P7-04, P7-05, P7-06, P7-07, P7-08
**Depends on:** Phase 6
**Success Criteria** (what must be TRUE):
  1. htmlContent TEXT column exists on websites table
  2. PATCH /api/websites/[id] accepts html_content field
  3. POST /api/ai/generate-html generates complete HTML from GPT-4o
  4. Public route serves raw HTML for published websites (route.ts, not page.tsx)
  5. Creation form has name + prompt only (no template picker)
  6. Editor shows iframe preview (60%) + chat/code panel (40%)
  7. Chat panel sends prompts to AI, updates iframe live
  8. Code tab allows direct HTML editing with Apply button
  9. Landing page shows Vietnamese hero/features/how-it-works/footer
  10. Dashboard nav brand is "AppGen"
**Plans:** 4/4 plans complete

Plans:
- [x] 07-01-PLAN.md — DB schema (htmlContent), PATCH extension, generate-html API, prompt utils + tests
- [x] 07-02-PLAN.md — Public route handler (raw HTML), landing page, dashboard nav rebrand
- [x] 07-03-PLAN.md — Simplified creation form (name + prompt), edit page searchParams
- [x] 07-04-PLAN.md — Lovable-style editor: iframe + chat + code tabs + auto-generate + save/publish

### Phase 8: Dashboard Sidebar và AI Onboarding Chat

**Goal:** Thay top nav bang left sidebar co dinh, bien /dashboard/ thanh AI chat wizard tao website, them chat history persistence cho editor, doc dep codebase AST/template cu va schema DB.
**Requirements**: P8-01, P8-02, P8-03, P8-04, P8-05, P8-06, P8-07, P8-08, P8-09, P8-10, P8-11, P8-12
**Depends on:** Phase 7
**Success Criteria** (what must be TRUE):
  1. Left sidebar (240px) visible on all dashboard pages with brand, 2 nav items, user area
  2. Editor page remains full-screen with no sidebar
  3. Mobile sidebar hidden, opens via hamburger + Sheet drawer
  4. /dashboard/ shows AI onboarding chat (2 questions -> summary -> CTA)
  5. CTA creates website via POST /api/websites and redirects to editor
  6. Editor loads chat_history from DB on open
  7. Editor auto-saves chat_history after each message (500ms debounce)
  8. Publish clears chat_history in DB and resets chat UI
  9. Old AST/template files deleted (sections, layouts, ast-utils, ai-prompts, templates)
  10. DB schema cleaned: 5 old columns removed, chatHistory added
  11. npm run typecheck passes after all changes
  12. /websites/new directory deleted, creation via dashboard chat only
**Plans:** 4/4 plans complete

Plans:
- [x] 08-01-PLAN.md — DB schema cleanup (drop 5 columns, add chatHistory), PATCH API update, delete old AST/template files + fix references
- [x] 08-02-PLAN.md — Install shadcn avatar+sheet, create DashboardSidebar component, wire into layout, editor full-screen overlay
- [x] 08-03-PLAN.md — POST /api/websites endpoint, AI onboarding chat on /dashboard/ (2-question state machine + CTA)
- [x] 08-04-PLAN.md — Editor chat history persistence (load/auto-save/clear on publish) + human verification checkpoint

</details>

### v1.1 Enhanced AI Pipeline (In Progress)

**Milestone Goal:** Nâng cấp pipeline AI để tạo website có visual identity riêng — domain-aware design, quality gate, no more generic blue DaisyUI output.

- [x] **Phase 9: Component Library** - Static HTML/DaisyUI snippet library with tag-match selection (~0ms, no LLM) (completed 2026-03-19)
- [x] **Phase 10: Design Agent + Context Builder + Prompt Rewrite** - Domain-to-visual-identity mapping, CSS variable injection, lean cacheable system prompt (completed 2026-03-20)
- [x] **Phase 11: Reviewer + Pipeline Rewire + UI Update** - Quality gate (score 0-100), 7-step fresh / 4-step edit orchestrator, updated SSE labels (completed 2026-03-20)

## Phase Details

### Phase 9: Component Library
**Goal**: Component Library siêu tĩnh sẵn sàng — `selectComponents()` trả về tối đa 4 snippets phù hợp nhất trong ~0ms, có unit tests xác nhận logic.
**Depends on**: Phase 8
**Requirements**: PIPE-01, PIPE-02, PIPE-03
**Success Criteria** (what must be TRUE):
  1. `src/lib/component-library/` exists with at least 25 HTML/DaisyUI snippets spread across hero, navbar, features, cards, footer, stats, testimonials categories
  2. `selectComponents(analysis)` returns at most 4 snippets matching the analysis tags, runs without any LLM call
  3. When no tags match, `selectComponents()` returns a sensible fallback set (not empty)
  4. Vitest unit tests for tag-match logic pass with `npm run test`
**Plans**: 1 plan

Plans:
- [ ] 09-01-PLAN.md — ComponentSnippet interface, selectComponents() algorithm, 40+ snippet data files across 11 categories, Vitest unit tests

### Phase 10: Design Agent + Context Builder + Prompt Rewrite
**Goal**: Design Agent quyết định visual identity per-domain; context builder tổng hợp user message; system prompt lean và cacheable; edit mode không bị reset về DaisyUI blue.
**Depends on**: Phase 9
**Requirements**: PIPE-04, PIPE-05, PIPE-06, PIPE-07, PIPE-08, PIPE-09
**Success Criteria** (what must be TRUE):
  1. Generating a fitness website produces a bold-dark style preset with non-blue primary color; generating a food website produces a warm-organic style preset — Design Agent domain mapping is working
  2. Generated HTML contains `--color-primary`, `--color-secondary`, `--color-accent`, `--color-bg` CSS custom properties from the Design Agent palette, and Google Fonts `@import` appears first in the `<style>` block
  3. System prompt is static (no per-request data) and fits within ~800 tokens
  4. Editing an existing website does not reset its colors to DaisyUI blue defaults — the "preserve existing colors and typography" instruction is active in edit mode
  5. `buildUserMessage()` assembles design brief + component references + analysis + user prompt into a single structured message
**Plans**: 2 plans

Plans:
- [ ] 10-01-PLAN.md — Zod v3 install, DesignResult + ReviewResult types, design-agent.ts (gpt-4o-mini + zodResponseFormat), domain-to-preset mapping
- [ ] 10-02-PLAN.md — context-builder.ts (buildUserMessage, edit-mode fallback), rewrite lean system prompt, split generator to system/user messages, refineHtml() skeleton

### Phase 11: Reviewer + Pipeline Rewire + UI Update
**Goal**: Pipeline chạy đúng 7 bước (fresh) / 4 bước (edit); Reviewer chấm điểm và gate Refine; UI hiển thị progress cho tất cả 7 bước; researcher.ts cũ bị xóa; Vercel timeout được xác nhận.
**Depends on**: Phase 10
**Requirements**: PIPE-10, PIPE-11, PIPE-12, PIPE-13, PIPE-14, PIPE-15, PIPE-16, PIPE-17, PIPE-18, PIPE-19, PIPE-20
**Success Criteria** (what must be TRUE):
  1. Fresh generation shows 7 distinct progress steps in the editor UI: analyze, components, design, generate, review, refine (conditional), validate — all with Vietnamese labels
  2. Edit mode shows exactly 4 steps (analyze, components, generate, validate) — design, review, and refine steps never appear in edit mode
  3. A generated website with score below threshold triggers a visible refine step; a website scoring above threshold skips refine — the quality gate is functional
  4. `REVIEW_THRESHOLD` env var controls the refine trigger point (default 75); `ENABLE_REFINE` env var can disable refine entirely (Hobby plan safety)
  5. `researcher.ts` no longer exists in the codebase and all its imports are removed — `npm run typecheck` passes clean
  6. Calibration pass completed: review scores logged for 10+ generated websites, threshold 75 validated or adjusted before shipping
**Plans**: 2 plans

Plans:
- [ ] 11-01-PLAN.md — reviewer.ts (gpt-4o-mini, Zod schema, 3-dimension scoring), extend PipelineEvent.step union type, update STEP_LABELS in editor-client.tsx
- [ ] 11-02-PLAN.md — Rewire index.ts orchestrator (7-step fresh / 4-step edit, conditional refine, remove researcher.ts), Vercel plan verification + maxDuration, calibration pass

### Phase 12: Migrate snippet library from DaisyUI to Preline UI

**Goal:** Migrate all snippet HTML from DaisyUI to Tailwind utilities + Preline data-hs-* patterns. Expand all 11 existing categories, add 6 new categories. Rewrite buildSystemPrompt() with Preline CDN + guidance. End state: 100+ snippets, 17 categories, zero DaisyUI remnants.
**Requirements**: SNIP-01, SNIP-02, SNIP-03, SNIP-04, SNIP-05, SNIP-06, SNIP-07, SNIP-08
**Depends on:** Phase 11
**Success Criteria** (what must be TRUE):
  1. All 17 snippet files contain zero DaisyUI class names
  2. buildSystemPrompt() references Tailwind CDN + Preline JS CDN, zero DaisyUI mentions
  3. ALL_SNIPPETS contains 100+ snippets across 17 categories
  4. Every snippet includes dark: prefix classes for dark mode
  5. Preline data-hs-* patterns used for interactive components (accordion, tabs, modal, dropdown, collapse)
  6. All existing tests pass including new DaisyUI remnant detector
  7. npm run typecheck passes clean
**Plans:** 3/3 plans complete

Plans:
- [x] 12-01-PLAN.md — Test updates + buildSystemPrompt() rewrite + rewrite 5 high-impact snippet files (hero, navbar, features, cards, footer)
- [x] 12-02-PLAN.md — Rewrite 6 remaining snippet files + create 6 new categories (forms, ui-elements, cta, media, pricing, notifications) + register in index.ts
- [x] 12-03-PLAN.md (gap closure) — Replace hs-accordion-active: and hs-stepper-active:/hs-stepper-completed: variants with vanilla JS, add bannedHsVariants detector test

### Phase 13: Multi-page Website Support

**Goal:** User có thể tạo website nhiều trang — mỗi trang là HTML riêng lưu trong `pages` JSONB, có URL thật `/{username}/{slug}/{page}`, quản lý pages trong editor, và export ZIP offline.
**Requirements**: MP-01, MP-02, MP-03, MP-04, MP-05, MP-06, MP-07, MP-08
**Depends on:** Phase 12
**Success Criteria** (what must be TRUE):
  1. `websites.pages` JSONB column tồn tại; existing `htmlContent` migrated sang `pages.index`
  2. `/{username}/{slug}/about` serve đúng `pages.about` HTML cho published website
  3. `/{username}/{slug}` (no page) vẫn serve `pages.index` — backward compatible
  4. Editor hiển thị Page Manager với list pages, add/switch/delete
  5. Generating trang mới sinh HTML có relative links (e.g. `href="about.html"`)
  6. `GET /api/websites/[id]/export` trả về ZIP với `index.html`, `about.html`, v.v.
  7. `npm run typecheck` passes clean sau migration
**Plans:** 2/2 plans complete

Plans:
- [x] 13-01-PLAN.md — DB schema (pages JSONB), migration, PATCH API + generate API update, public routing, relative link instruction
- [x] 13-02-PLAN.md — Export ZIP endpoint (fflate), editor Page Manager UI, per-page state, export button + human verify

## Progress

**Execution Order:**
Phases execute in numeric order: 9 → 10 → 11 → 12 → 13

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation Completion | v1.0 | 3/3 | Complete | 2026-03-17 |
| 2. Website CRUD + Templates | v1.0 | 3/3 | Complete | 2026-03-17 |
| 3. AI Generation + Publish | v1.0 | 4/4 | Complete | 2026-03-17 |
| 4. Editor | v1.0 | 3/3 | Complete | 2026-03-18 |
| 5. Note Sync + Analytics | v1.0 | 2/2 | Complete | 2026-03-18 |
| 6. shadcn-ui Templates Interactive Sections | v1.0 | 5/5 | Complete | 2026-03-19 |
| 7. HTML-first AI Generation + Lovable-style Editor | v1.0 | 4/4 | Complete | 2026-03-19 |
| 8. Dashboard Sidebar + AI Onboarding Chat | v1.0 | 4/4 | Complete | 2026-03-19 |
| 9. Component Library | v1.1 | 1/1 | Complete | 2026-03-19 |
| 10. Design Agent + Context Builder + Prompt Rewrite | v1.1 | 2/2 | Complete | 2026-03-20 |
| 11. Reviewer + Pipeline Rewire + UI Update | v1.1 | 2/2 | Complete | 2026-03-20 |
| 12. Migrate snippet library from DaisyUI to Preline UI | v1.1 | 3/3 | Complete | 2026-03-21 |
| 13. Multi-page Website Support | v1.1 | 2/2 | Complete   | 2026-03-23 |
| 14. Onboarding Chat Free-form Prompt | v1.1 | 1/1 | Complete | 2026-03-24 |
| 15. Critical Bug Fixes | v1.2 | 1/2 | In Progress|  |
| 16. Pipeline Optimization | v1.2 | 2/2 | Complete   | 2026-03-24 |
| 17. UI Quality Upgrade | v1.2 | 2/2 | Planned | - |
| 18. Observability & Testing | v1.2 | 2/2 | Planned | - |

### Phase 14: Onboarding Chat Free-form Prompt

**Goal:** Đổi onboarding chat từ 2 câu hỏi cố định sang 1 text input tự do — user gõ prompt thoải mái như Lovable, AI tạo website ngay từ đó.
**Requirements**: TBD
**Depends on:** Phase 13
**Plans:** 1/1 plans complete

Plans:
- [x] 14-01-PLAN.md — Freeform textarea input, AI name extraction (gpt-4o-mini), redirect to editor with prompt param

---

## Milestone v1.2 — Pipeline Quality & Observability

### Phase 15: Critical Bug Fixes

**Goal:** Sửa 3 bug nghiêm trọng ảnh hưởng trực tiếp đến chất lượng output: edit mode không gửi HTML hiện tại cho LLM, generation không streaming (user chờ 10-30s trống), system prompt quá nặng cho edit mode.
**Depends on:** Phase 14
**Success Criteria** (what must be TRUE):
  1. Edit mode: LLM nhận `currentHtml` đầy đủ trong user message — content cũ được preserve khi edit
  2. Streaming: user thấy HTML xuất hiện từng chữ trong preview ngay khi generate bắt đầu (time-to-first-content < 5s)
  3. Edit mode dùng system prompt riêng ngắn hơn (~50 dòng) — không bị confused bởi CDN/component patterns của fresh mode
  4. `npm run typecheck` và `npm run test` pass clean sau thay đổi
**Plans:** 1/2 plans executed

Plans:
- [ ] 15-01-PLAN.md — Fix edit mode (truyền currentHtml vào context-builder) + tách system prompt fresh/edit
- [x] 15-02-PLAN.md — Streaming generation (generator.ts + types.ts + index.ts + editor-client.tsx + route.ts)

### Phase 16: Pipeline Optimization

**Goal:** Giảm latency và cost bằng tối ưu cấu trúc pipeline: gộp 2 LLM calls analyze+design thành 1, skip review/refine khi không cần thiết, tăng cường validator, thêm cross-page design context.
**Depends on:** Phase 15
**Success Criteria** (what must be TRUE):
  1. Fresh mode giảm từ 3 LLM calls → 2 LLM calls (analyze+design merged)
  2. Review/refine chỉ chạy khi: validator phát hiện warnings > 0, hoặc fixes > 2, hoặc HTML < 2000 chars (~30% cases)
  3. Validator có thêm 8 checks: DOCTYPE, html/head/body tags, viewport meta, Tailwind CDN, empty body, HTML length, mismatched script tags, CSS var consistency
  4. Pages mới (about, contact...) nhận design summary từ index page (màu, fonts, nav links) → visual consistency
  5. `npm run test` pass clean
**Plans:** 2/2 plans complete

Plans:
- [x] 16-01-PLAN.md — Tạo analyze-and-design.ts (merged step) + update index.ts + conditional review logic
- [x] 16-02-PLAN.md — Strengthen validator (+8 checks) + cross-page context (route.ts + context-builder.ts)

### Phase 17: UI Quality Upgrade

**Goal:** Nâng chất lượng HTML output lên gần production-ready: viết lại system prompt với design principles rõ ràng, thêm golden example pages làm reference, mở rộng design tokens với layout controls.
**Depends on:** Phase 16
**Success Criteria** (what must be TRUE):
  1. System prompt fresh mode có section Design Principles (whitespace, hierarchy, spacing, cards, buttons) và Modern UI Patterns (hero, navbar, CTA, footer patterns)
  2. 3-4 golden example pages tồn tại trong component library, được inject vào context khi type match
  3. Design tokens có thêm 4 fields: borderRadius, cardStyle, heroStyle, density — được inject vào context-builder
  4. buildSystemPrompt(mode) vẫn zero-parameter-compatible cho caching (fresh mode)
  5. `npm run test` pass clean
**Plans:** 2/2 plans

Plans:
- [ ] 17-01-PLAN.md — Rewrite system prompt fresh mode với Design Principles + Modern UI Patterns sections
- [ ] 17-02-PLAN.md — Golden examples (snippets/examples.ts) + expand design tokens schema (design-agent.ts + context-builder.ts)

### Phase 18: Observability & Testing

**Goal:** Có visibility đầy đủ vào cost, latency, và output quality để data-driven optimize: Langfuse tracing cho mỗi pipeline step, eval test suite với 20+ prompts.
**Depends on:** Phase 17
**Success Criteria** (what must be TRUE):
  1. Mỗi pipeline step được trace trong Langfuse với: model, input length, output length, latency ms
  2. Langfuse integration không crash nếu keys không set (graceful no-op)
  3. `npm run eval` chạy được 20+ prompts qua pipeline, output pass/fail + score
  4. `.env.example` có LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY entries
  5. Unit tests và typecheck pass clean
**Plans:** 2/2 plans

Plans:
- [ ] 18-01-PLAN.md — Langfuse client (lib/langfuse.ts) + pipeline instrumentation (index.ts) + .env.example update
- [ ] 18-02-PLAN.md — Eval test suite (tests/eval/prompts.ts + runner.ts) + npm run eval script
