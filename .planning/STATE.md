---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_plan: 2
status: executing
stopped_at: Phase 7 UI-SPEC approved
last_updated: "2026-03-19T06:31:30.903Z"
progress:
  total_phases: 7
  completed_phases: 6
  total_plans: 24
  completed_plans: 22
---

# STATE.md — Project Memory

## Project

**Name:** Website Generator
**Initialized:** 2026-03-16
**Status:** Executing Phase 07

## Current Phase

**Phase:** 7 — html-first-ai-generation-and-lovable-style-editor (In Progress)
**Current Plan:** 2
**Next action:** Execute 07-02 (srcdoc editor UI)

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
| SectionType union extended to 11 types (+ steps/quiz/flashcard/goals/ingredients) | Done | Plan 06-01 complete |
| 5 new content interfaces (StepsContent, IngredientsContent, GoalsContent, FlashcardContent, QuizContent) | Done | Plan 06-01 complete |
| TEMPLATE_ALLOWED_SECTIONS map (per-template section type filtering) | Done | Plan 06-01 complete |
| shadcn components: progress, accordion, carousel, toggle, switch, checkbox, radio-group | Done | Plan 06-01 complete |
| AI prompts updated with new section schemas + template-specific rules | Done | Plan 06-01 complete |
| GoalsSection (progress bar + localStorage) + QuizSection (radio + score + localStorage) + FlashcardSection (3D flip motion) + StepsSection + IngredientsSection | Done | Plan 06-02 complete |
| SectionRenderer updated to dispatch all 11 section types | Done | Plan 06-02 complete |
| SectionEditForm extended for all 11 section types (steps/ingredients/goals/flashcard/quiz) | Done | Plan 06-03 complete |
| Them section Dialog flow + AI generation + loading skeleton in SectionsTab | Done | Plan 06-03 complete |
| handleAddSection in EditorClient wired to /api/ai/regenerate-section | Done | Plan 06-03 complete |
| Blog layout: Merriweather serif, max-w-3xl editorial, hr section dividers | Done | Plan 06-04 complete |
| Portfolio layout: Inter, full-bleed dark hero bg-slate-900, max-w-7xl, primaryColor CTA band | Done | Plan 06-04 complete |
| Fitness layout: Oswald condensed, border-l-4 accent, dark zinc-900 hero, edge-to-edge | Done | Plan 06-04 complete |
| Cooking layout: Lora, warm #fdf8f3 bg, rounded-xl card containers for ingredients/steps | Done | Plan 06-04 complete |
| Learning layout: Plus Jakarta Sans, bg-slate-50, card-wrapped non-hero sections | Done | Plan 06-04 complete |
| ThemeProvider on public layout (next-themes, storageKey=theme-preference) | Done | Plan 06-05 complete |
| DarkModeToggle component (mounted flag, Sun/Moon, Vietnamese aria-labels) | Done | Plan 06-05 complete |
| Dark mode toggle integrated into all 5 template layouts | Done | Plan 06-05 complete |
| htmlContent TEXT column on websites table | Done | Plan 07-01 complete |
| PATCH /api/websites/[id] accepts html_content field | Done | Plan 07-01 complete |
| html-prompts.ts: buildFreshSystemPrompt, buildEditSystemPrompt, stripMarkdownFences | Done | Plan 07-01 complete |
| POST /api/ai/generate-html (GPT-4o HTML generation, 90s timeout, auto-save) | Done | Plan 07-01 complete |

## What's Left (by phase)

- **Phase 1:** COMPLETE
- **Phase 2:** COMPLETE (3/3 plans done)
- **Phase 3:** COMPLETE
- **Phase 4:** COMPLETE (3/3 plans done) — awaiting human visual verification (Task 3 checkpoint)
- **Phase 5:** COMPLETE — Plan 05-01 (sync API + dashboard polling) + Plan 05-02 (Umami analytics) done
- **Phase 6:** COMPLETE — All 5 plans done (06-01 through 06-05)

## Key Decisions (07-01)

- htmlContent column applied via direct SQL ALTER TABLE — drizzle-kit push has upstream bug with CHECK constraints (same pattern as 05-01)
- stripMarkdownFences regex uses `(?:html?)?` optional group to handle both bare and html-tagged fences
- maxDuration=90 matches AbortSignal.timeout(90000) — HTML generation needs more time than JSON AST generation (30s)
- No response_format on OpenAI call — HTML output is plain text, not JSON
- Fresh vs edit mode selected by `Boolean(currentHtml)` — truthy check on the optional currentHtml field

## Key Decisions (06-05)

- DarkModeToggle uses mounted flag (useState false + useEffect) to prevent SSR hydration mismatch — theme is client-only state unknown at server render time
- Portfolio uses fixed top-right z-50 positioning for toggle — full-bleed sections leave no natural header slot
- Blog/Fitness/Cooking/Learning use inline header bar with justify-end — constrained max-width layouts have natural top space
- Cooking and Learning already had dark:bg-background overrides from Plan 04 — no additional dark mode CSS changes needed

## Key Decisions (06-04)

- All 5 layouts use `--primary-color` CSS variable (not `--primary`) — consistent with UI-SPEC and public page injection
- Cooking warm bg uses Tailwind arbitrary value `bg-[#fdf8f3]` so `dark:bg-background` can override via standard cascade
- Fitness `border-l-4` applied on full-width section wrapper div (not inside content container) for true edge-to-edge left accent
- Portfolio CTA band uses inline style `backgroundColor` for dynamic primaryColor at runtime — cannot use Tailwind arbitrary value for dynamic user values
- All 5 layouts remain Server Components — no "use client" — interactive sections handle own client boundaries via SectionRenderer

## Key Decisions (06-03)

- Edit forms for list-based sections use onUpdateField to append empty items to the array — no separate API call needed for add-item
- handleAddSection reuses /api/ai/regenerate-section endpoint with a synthetic sectionId — server does not use sectionId for new section creation
- onAddSection prop threaded through EditorClient -> EditorSidebar -> SectionsTab to centralize AI fetch logic in EditorClient
- Quiz correctIndex select uses standard HTML select with Tailwind Input class styling — avoids adding a new shadcn component

## Key Decisions (06-02)

- GoalsSection and QuizSection use slug-keyed localStorage (`goals-{slug}-{sectionId}`) — per-website state isolation so visiting multiple websites gets independent progress
- StepsSection and IngredientsSection use ephemeral in-memory state only — transient cooking session data needs no persistence
- FlashcardSection imports from `motion/react` (not `framer-motion`); CardFace and QuizChoice sub-components defined at module scope to prevent re-render animation/focus issues
- mounted flag pattern: `useState(false)` + `useEffect` sets true + reads localStorage — prevents SSR hydration mismatch on server-rendered checkboxes

## Key Decisions (06-01)

- TEMPLATE_ALLOWED_SECTIONS lives in templates.ts — template-specific data belongs with template config, not ast-utils validation
- cooking TEMPLATE_PRESETS changed to [hero, ingredients, steps, cta] — new section types replace generic content sections
- learning TEMPLATE_PRESETS changed to [hero, goals, content, flashcard, quiz] — interactive learning sections replace features/cta
- buildSectionRegenPrompt schema hints added inline as schemaHints Record — avoids duplicating schema docs from buildSystemPrompt

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
| Phase 06 P01 | 6min | 2 tasks | 15 files |
| Phase 06 P02 | 2m 10s | 2 tasks | 6 files |
| Phase 06 P02 | 2m 10s | 2 tasks | 6 files |
| Phase 06 P03 | 3m 34s | 2 tasks | 4 files |
| Phase 06 P04 | 2m | 2 tasks | 5 files |
| Phase 06 P05 | 3m | 2 tasks | 7 files |
| Phase 07 P01 | 3m 34s | 2 tasks | 5 files |
| Phase 07 P02 | 5min | 2 tasks | 5 files |

## Accumulated Context

### Roadmap Evolution

- Phase 6 added: shadcn-ui templates interactive-sections
- Phase 7 added: HTML-first AI generation and Lovable-style editor

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

**Stopped at:** Phase 7 UI-SPEC approved
**Timestamp:** 2026-03-18T04:15:43Z
