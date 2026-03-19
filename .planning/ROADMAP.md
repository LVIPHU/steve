# Roadmap: Website Generator v1

## Overview

Building a companion web app for a mobile note-taking app. Users turn their notes (received via JSON API) into publishable websites using AI. The foundation (auth, dashboard, DB schema) is already in place. We build CRUD + templates → AI generation + publish → visual editor → note sync + analytics.

## Phases

- [x] **Phase 1: Foundation Completion** - Verify/complete DB schema, enforce username, add token login from mobile app (1/3 plans done) (completed 2026-03-17)
- [x] **Phase 2: Website CRUD + Templates** - Website list, create flow, 5 templates, status management (completed 2026-03-17)
- [x] **Phase 3: AI Generation + Publish** - OpenAI GPT-4o generation, public SSR routes, SEO auto-gen (completed 2026-03-17)
- [x] **Phase 4: Editor** - Sidebar editor, dnd-kit reorder, image upload, color/font customization (completed 2026-03-18)
- [x] **Phase 5: Note Sync + Analytics** - Auto-sync API endpoint, merge logic, Umami analytics (completed 2026-03-18)
- [x] **Phase 6: shadcn-ui Templates Interactive Sections** - 5 new interactive section types, template visual redesign, dark mode, editor extensions (completed 2026-03-19)

## Phase Details

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
- [ ] 01-02-PLAN.md — Registration + onboarding UI: register form username field, /onboarding page, dashboard layout profiles check
- [ ] 01-03-PLAN.md — Mobile token endpoints: POST /api/auth/mobile-token, GET /api/auth/token-login

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
- [ ] 02-01-PLAN.md — Vitest setup, template system, slug utility, website mutation API route
- [ ] 02-02-PLAN.md — Create website form page, server action, detail page, nav update
- [ ] 02-03-PLAN.md — Website list page, WebsiteCard component with CRUD interactions

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
- [ ] 03-01-PLAN.md — WebsiteAST types, AST validation utils, AI prompt builders, POST /api/ai/generate route
- [ ] 03-02-PLAN.md — 6 section components (Hero/About/Features/Content/Gallery/CTA) + 5 template layouts + renderers
- [ ] 03-03-PLAN.md — Dashboard detail page: generate/preview/publish interactive flow (Client Component)
- [ ] 03-04-PLAN.md — Public SSR route /[username]/[slug], generateMetadata SEO, OG image endpoint

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
- [ ] 04-01-PLAN.md — Install deps, extend PATCH API, editor-utils + tests, upload API, regenerate-section API
- [ ] 04-02-PLAN.md — Editor page, EditorClient, topbar, preview, sidebar sections tab with dnd-kit, section edit forms
- [ ] 04-03-PLAN.md — Theme tab, image upload UI, per-section regenerate UI, toast, unsaved guard, detail page edit button, public page font

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
- [ ] 05-01-PLAN.md — DB schema + sync API route (after() background AI) + merge logic + SyncBadge + 30s polling
- [ ] 05-02-PLAN.md — Umami analytics script embed in public page + env vars

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
- [ ] 06-01-PLAN.md — Extend types/validation/AI prompts, install 7 shadcn components, add TEMPLATE_ALLOWED_SECTIONS
- [ ] 06-02-PLAN.md — Create 5 interactive section components (goals, quiz, flashcard, steps, ingredients) + update SectionRenderer
- [ ] 06-03-PLAN.md — Editor extensions: edit forms for 5 new types + add-section Dialog flow
- [ ] 06-04-PLAN.md — Redesign all 5 template layouts with distinct visual identities
- [ ] 06-05-PLAN.md — Dark mode: next-themes ThemeProvider + DarkModeToggle in all layouts

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
- [ ] 07-01-PLAN.md — DB schema (htmlContent), PATCH extension, generate-html API, prompt utils + tests
- [ ] 07-02-PLAN.md — Public route handler (raw HTML), landing page, dashboard nav rebrand
- [ ] 07-03-PLAN.md — Simplified creation form (name + prompt), edit page searchParams
- [ ] 07-04-PLAN.md — Lovable-style editor: iframe + chat + code tabs + auto-generate + save/publish

### Phase 8: Dashboard Sidebar và AI Onboarding Chat

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 7
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 8 to break down)
