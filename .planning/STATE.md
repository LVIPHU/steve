---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_plan: 05-01 complete, 05-02 next
status: planning
stopped_at: Phase 6 UI-SPEC approved
last_updated: "2026-03-18T14:38:37.016Z"
progress:
  total_phases: 6
  completed_phases: 5
  total_plans: 15
  completed_plans: 15
---

# STATE.md — Project Memory

## Project

**Name:** Website Generator
**Initialized:** 2026-03-16
**Status:** Ready to plan

## Current Phase

**Phase:** 5 — note-sync-analytics (In Progress)
**Current Plan:** 05-01 complete, 05-02 next
**Next action:** Phase 5 Plan 02 — Umami analytics integration

## What's Built

| Layer | Status | Notes |
|---|---|---|
| Auth UI (login/register) | Done | better-auth, email/password, Google OAuth |
| Dashboard layout | Done | nav, layout shell |
| DB Schema | Done | users, profiles, websites, sessions |
| Global CSS / Tailwind | Done | dark mode vars, base styles |
| Codebase map | Done | `.planning/codebase/` |
| Auth config (additionalFields, bearer, hooks) | Done | Plan 01-01 complete |
| Username registration + onboarding | Done | Plan 01-02 complete |
| Mobile token login flow | Done | Plan 01-03 complete |
| Template system (5 templates, suggestTemplate) | Done | Plan 02-01 complete |
| Slug utility (generateSlug) | Done | Plan 02-01 complete |
| Website mutation API (PATCH + DELETE /api/websites/[id]) | Done | Plan 02-01 complete |
| Vitest test infrastructure | Done | Plan 02-01 complete |
| Website create form (/dashboard/websites/new) | Done | Plan 02-02 complete |
| Website list page (/dashboard/websites) | Done | Plan 02-03 complete |
| WebsiteCard with hover menu + inline CRUD | Done | Plan 02-03 complete |
| Section components (6) + SectionRenderer | Done | Plan 03-02 complete |
| Template layouts (5) + TemplateRenderer | Done | Plan 03-02 complete |
| Website detail generate/preview/publish flow | Done | Plan 03-03 complete |
| Public SSR route /[username]/[slug] | Done | Plan 03-04 complete |
| OG image endpoint 1200x630 | Done | Plan 03-04 complete |
| editor-utils pure functions (4 functions, 18 tests) | Done | Plan 04-01 complete |
| PATCH /api/websites/[id] content field support | Done | Plan 04-01 complete |
| POST /api/upload/image (Supabase Storage) | Done | Plan 04-01 complete |
| POST /api/ai/regenerate-section (GPT-4o per-section) | Done | Plan 04-01 complete |
| shadcn components: tabs, separator, badge, dialog, skeleton, sonner | Done | Plan 04-01 complete |
| Editor page /dashboard/websites/[id]/edit | Done | Plan 04-02 complete |
| EditorClient (ast state, unsaved guard, save PATCH) | Done | Plan 04-02 complete |
| EditorTopbar (back, name indicator, responsive toggle, save) | Done | Plan 04-02 complete |
| EditorPreview (click-to-select, ring-2, responsive width) | Done | Plan 04-02 complete |
| EditorSidebar (Sections/Theme tabs) | Done | Plan 04-02 complete |
| SectionsTab (dnd-kit DnD reorder) | Done | Plan 04-02 complete |
| SectionEditForm (per-type dynamic fields, resolveField) | Done | Plan 04-02 complete |
| ThemeTab (color picker + Google Fonts selector) | Done | Plan 04-03 complete |
| Image upload integration in section forms (gallery + hero) | Done | Plan 04-03 complete |
| Per-section regenerate UI with optional prompt | Done | Plan 04-03 complete |
| Unsaved changes dialog (shadcn Dialog) + toast (sonner) | Done | Plan 04-03 complete |
| Edit Website button on detail page | Done | Plan 04-03 complete |
| Public page Google Font + CSS variable injection | Done | Plan 04-03 complete |
| syncStatus + lastSyncedAt columns on websites table | Done | Plan 05-01 complete |
| mergeAiSectionsIntoAst (index-based merge, 5 unit tests) | Done | Plan 05-01 complete |
| POST /api/sync/trigger (background AI via after()) | Done | Plan 05-01 complete |
| SyncBadge on WebsiteCard (syncing/synced/sync_failed states) | Done | Plan 05-01 complete |
| WebsitesPoller — 30s auto-refresh via router.refresh() | Done | Plan 05-01 complete |
| Umami analytics conditional script in public page | Done | Plan 05-02 complete |

## What's Left (by phase)

- **Phase 1:** COMPLETE
- **Phase 2:** COMPLETE (3/3 plans done)
- **Phase 3:** COMPLETE
- **Phase 4:** COMPLETE (3/3 plans done) — awaiting human visual verification (Task 3 checkpoint)
- **Phase 5:** COMPLETE — Plan 05-01 (sync API + dashboard polling) + Plan 05-02 (Umami analytics) done

## Key Decisions (05-02)

- Both NEXT_PUBLIC_UMAMI_URL AND NEXT_PUBLIC_UMAMI_WEBSITE_ID required for Umami script — partial config renders nothing (safe default)
- .env.example is gitignored by .env* pattern — Umami vars documented on disk only, consistent with all prior plans

## Key Decisions

- AI provider: OpenAI GPT-4o
- Notes: NOT stored in this DB — passed via JSON at generation time
- Auth: email/password + token from mobile app
- No Freemium / no plan tiers in v1
- Website AST (JSON, not HTML) — enables editor field-level manipulation
- `manual_overrides` pattern: AI content and user edits tracked separately
- Used `inferAdditionalFields` client plugin instead of `bearerClient` (not exported in better-auth v1.5.5)
- RESERVED_USERNAMES (9 entries) and USERNAME_REGEX defined at module scope in auth.ts
- Server action co-located with onboarding page (action.ts) rather than standalone API route
- Dashboard layout does profiles check on every request (acceptable for Phase 1 scale)
- auth.api has no createSession method — used direct DB insert + serializeSignedCookie from better-call for token-login
- mobile-token: prefix on verification.identifier namespaces one-time tokens from better-auth's own verification records
- Cookie signing replicates better-auth's internal approach: serializeSignedCookie(name, rawToken, secret) from better-call
- KEYWORD_MAP ordering: more specific fitness keywords before "work" to avoid false portfolio match on inputs containing "workout"
- Route Handler (not Server Action) for /api/ai/generate — explicit AbortSignal.timeout(30000), returns 504 on timeout
- Manual parseAndValidateAST (validate-or-throw) instead of Zod — WebsiteAST schema is small and locked
- Slug normalized via generateSlug() on AI output before DB write — prevents invalid chars from GPT-4o reaching DB
- Both content (full AST) and seoMeta columns written together on every generation — keeps them in sync

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|---|---|---|---|---|
| 01 | 01 | 4m 11s | 2/2 | 4 |
| 01 | 02 | 4min | 2/2 | 4 |
| 01 | 03 | 15min | 2/2 | 3 |
| 02 | 01 | 3m 21s | 2/2 | 7 |
| 02 | 02 | 3min | 2/2 | 4 |
| 02 | 03 | 2m 34s | 2/2 | 2 |
| Phase 03 P01 | 3min | 2 tasks | 7 files |
| Phase 03 P02 | 2m 20s | 2 tasks | 13 files |
| Phase 03 P04 | 3min | 2 tasks | 3 files |
| Phase 03 P03 | 2m 13s | 1 tasks | 4 files |
| Phase 04 P01 | 6m 15s | 2 tasks | 13 files |
| Phase 04 P02 | 3m 46s | 2 tasks | 9 files |
| Phase 04 P03 | 4min | 2 tasks | 8 files |
| Phase 05 P01 | 6m 13s | 3 tasks | 7 files |
| Phase 05 P02 | 1min | 1 tasks | 2 files |

## Accumulated Context

### Roadmap Evolution
- Phase 6 added: shadcn-ui templates interactive-sections

## Milestone History

| Date | Event |
|---|---|
| 2026-03-16 | Project initialized, codebase mapped, planning complete |
| 2026-03-17 | Phase 1 started — Plan 01-01 complete (auth config, bearer plugin, proxy) |
| 2026-03-17 | Plan 01-02 complete — username registration, onboarding page, dashboard profiles gate |
| 2026-03-17 | Plan 01-03 complete — mobile token login flow (POST /api/auth/mobile-token, GET /api/auth/token-login, login page error display) |
| 2026-03-17 | Phase 1 COMPLETE — all 3 plans done |
| 2026-03-17 | Phase 2 started — Plan 02-01 complete (Vitest, template system, slug utility, website PATCH/DELETE API) |
| 2026-03-17 | Plan 02-03 complete — website list page + WebsiteCard CRUD component |
| 2026-03-17 | Phase 2 COMPLETE — all 3 plans done |

## Key Decisions (05-01)

- mergeAiSectionsIntoAst uses index-based merge (not id-based) — AI does not know existing section IDs
- after() from next/server for background AI regeneration — response not blocked
- syncStatus='syncing' set synchronously before after() — client sees immediate state transition
- Each website in after() wrapped in individual try/catch — one failure does not block others
- drizzle-kit push has upstream bug with CHECK constraints; columns applied via direct SQL ALTER TABLE
- SyncBadge returns null for 'idle' syncStatus — no visual noise for websites never synced
- WebsitesPoller wraps only the grid, not empty state — no point polling with no websites

## Key Decisions (04-03)

- injectGoogleFont creates a `<link>` in `document.head` during editor preview — no SSR needed, client-side only
- Public page uses inline JSX `<link rel="stylesheet">` instead of metadata API — dynamic per-website font URLs work naturally
- CSS variables --primary-color and --font-family injected at wrapper div level on public page
- ImageUploadField and RegenerateSection defined at module scope to prevent focus loss on re-render (same pattern as 04-02)
- window.confirm replaced with shadcn Dialog in EditorClient; alert() replaced with sonner toast
- fontFamily inline style required on EditorPreview wrapper — section components never consume var(--font-family), CSS var alone is not enough for font inheritance
- Public page fontFamily inline style overrides next/font hardcoded className from layout components — inline style has higher specificity than className-applied font-family
- ThemeTab useEffect injects Google Font on mount so existing saved font renders in editor preview on first load

## Key Decisions (04-02)

- templateId column is nullable in schema — defaulted to 'blog' when null to satisfy EditorClient prop type
- window.confirm used for unsaved changes guard on back button — shadcn Dialog deferred to 04-03
- SortableSectionItem and SectionEditForm defined at module scope — prevents input focus loss on re-render
- handle-only drag: listeners applied only to GripVertical button, not the whole row — prevents accidental drag on click

## Key Decisions (04-01)

- editor-utils functions are pure (no side effects) — simplifies testing and makes state mutations predictable in React
- regenerate-section does NOT save to DB — client receives ai_content, merges into local editor state, and persists via PATCH Save button
- PATCH content field syncs seoMeta automatically if ast.seo present — keeps columns in sync same as generate endpoint
- Supabase client in upload route uses service role key (server-side only) — bypasses RLS for reliable storage writes

## Key Decisions (03-04)

- (public) route group is sibling to (dashboard), not nested — no dashboard auth middleware applies to public pages
- No edge runtime on OG image — postgres.js uses Node.js net module, not edge-compatible
- ArchivedPage defined at module scope per rerender-no-inline-components rule
- getWebsiteData shared between generateMetadata and default page export — avoids duplicate DB queries

## Key Decisions (02-02)

- redirect() called outside try/catch in server action — Next.js redirect throws NEXT_REDIRECT internally, catching it swallows the navigation
- Sub-components (TemplateCard, SuggestionBanner, StatusBadge) defined at module scope per rerender-no-inline-components rule
- Tab UI implemented with native button elements + ARIA roles (tablist/tab/aria-selected/aria-controls) rather than third-party library

## Key Decisions (03-02)

- sections/index.tsx and layouts/index.tsx use .tsx extension (not .ts) because SectionRenderer and TemplateRenderer contain JSX — TypeScript requires .tsx for JSX syntax
- All section and layout components have no "use client" — server-compatible, works in both server and client contexts

## Key Decisions (02-03)

- Custom dropdown (no library) — simple enough for 3 menu items
- Status sub-menu uses onMouseEnter/Leave for flicker-free hover behavior
- Card body wrapped in Link; interactive elements use e.stopPropagation() + e.preventDefault()

## Key Decisions (03-03)

- StatusBadge defined at module scope in client component (not inline) to avoid re-render instability
- Slug conflict returns 409 from PATCH; client shows "URL already taken" message without exposing internal error code
- Note fetch failure degrades gracefully — generation continues without note content rather than blocking the user
- After successful generation, setSlug called with data.content.seo.slug to pre-fill slug from AI output
- Website detail page now fully interactive: generate -> inline SectionRenderer preview -> slug edit -> publish flow

## Last Session

**Stopped at:** Phase 6 UI-SPEC approved
**Timestamp:** 2026-03-18T04:15:43Z
