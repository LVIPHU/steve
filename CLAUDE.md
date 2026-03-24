# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript type check

npm run test         # Run tests (Vitest)
npm run test:watch   # Run tests in watch mode
npx vitest run src/lib/ai-pipeline/generator.test.ts  # Run a single test file

npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Apply migrations to the database
npm run db:push      # Push schema directly (no migration file, good for dev)
npm run db:studio    # Open Drizzle Studio (DB GUI)
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Supabase Postgres connection string |
| `BETTER_AUTH_SECRET` | ≥32 char secret for better-auth |
| `BETTER_AUTH_URL` | App origin (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `NEXT_PUBLIC_APP_URL` | Used by the client-side auth client |
| `OPENAI_API_KEY` | OpenAI API key for AI generation |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (image uploads) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (image uploads) |
| `ENABLE_REFINE` | Set to `"true"` to enable review+refine steps in pipeline |
| `REVIEW_THRESHOLD` | Score threshold (0–100) below which refine triggers (default: 75) |

## Architecture

**Stack:** Next.js 16 (App Router) + React 19, Tailwind CSS v4, Drizzle ORM + postgres.js, better-auth, OpenAI SDK, motion (Framer Motion successor).

### Route Groups

- `(auth)` — public pages: `/login`, `/register`, `/onboarding` (username setup after sign-up)
- `(dashboard)` — protected pages behind session check in `layout.tsx`
- `(public)` — public website viewer at `/{username}/{slug}`
- `api/auth/[...all]` — better-auth catch-all handler

### Auth Pattern

- **Server-side:** `auth.api.getSession({ headers: await headers() })` from `@/lib/auth` — used in Server Components and layouts for redirects.
- **Client-side:** `authClient` from `@/lib/auth-client` — used in Client Components (`"use client"`) for `signIn`, `signUp`, `signOut`, `useSession`.
- The `(dashboard)/layout.tsx` enforces session at the layout level; individual pages may also check for finer control.
- **Mobile token bridge:** `POST /api/auth/mobile-token` issues a one-time token stored in the `verification` table; `GET /api/auth/token-login?token=...` exchanges it for a signed browser session cookie (single-use, 5-min TTL).

### Database

- Schema defined in `src/db/schema.ts` — single source of truth for all tables and relations.
- **better-auth tables:** `user`, `session`, `account`, `verification` — match better-auth's expected shape, passed via `drizzleAdapter`.
- **App tables:** `profiles` (1:1 with `user`, has `username` and `plan`), `websites` (many per user).
- DB client exported from `src/db/index.ts` as `db`.

**`websites` table key columns:**
- `pages` (JSONB) — primary HTML store: `{ "index": "<html>...", "about": "<html>..." }`. Updated atomically via `jsonb_set`.
- `chatHistory` (JSONB) — per-page message log: `{ "index": [...messages], "about": [...] }`.
- `htmlContent` (TEXT) — legacy fallback only; new code reads `pages` first.
- `sourceNoteId` (TEXT) — optional link to a source note that generated this website.
- `status` — `draft | published | archived`.

### AI Generation Pipeline

`POST /api/ai/generate-html` streams SSE events to the client via `runGenerationPipeline()` in `src/lib/ai-pipeline/index.ts`.

**Fresh generation steps:** analyze → components → design → generate → (review → refine if `ENABLE_REFINE=true`) → validate → complete

**Edit mode** (when `currentHtml` is provided): skips design/review/refine — only analyze, components, generate, validate.

Pipeline modules in `src/lib/ai-pipeline/`:
- `analyzer.ts` — classifies prompt into type (`landing|portfolio|dashboard|blog|generic`), extracts sections/features
- `design-agent.ts` — picks a visual preset + color palette + fonts
- `generator.ts` — calls OpenAI to produce raw HTML using the design + selected component snippets
- `reviewer.ts` — scores HTML 0–100 across visual/content/technical dimensions
- `context-builder.ts` — assembles the user message / edit message / refine prompt
- `validator.ts` — post-processes HTML, applies fixes, returns warnings

After successful generation the API auto-saves `pages[pageName]` to DB via atomic `jsonb_set` before sending the `complete` event.

### Component Library

`src/lib/component-library/` holds reusable HTML snippet templates injected into generation context.

- `selectComponents(analysis)` in `index.ts` scores all snippets by tag-matching against the analyzed type/sections/features, returns top 4.
- Snippets are organized by category under `snippets/` (hero, navbar, features, cards, pricing, blog, etc.).
- Each snippet has `tags`, `domain_hints`, `min_score`, `priority`, `fallback`, `fallback_for` fields that drive selection.

### Editor UI

`(dashboard)/dashboard/websites/[id]/edit/` — split-pane layout:
- **Left 60%:** live `<iframe srcDoc>` preview with page tabs across the top
- **Right 40%:** tabbed panel — "Chat" (SSE-driven pipeline progress + user messages) and "Code" (raw HTML textarea for manual edits)

**Multi-page support:** websites can have multiple named pages (`index`, `about`, `contact`, etc.). Each page has its own HTML in `pages` JSONB and its own chat history in `chatHistory` JSONB. The "index" page cannot be deleted.

**Link interception:** the editor injects a script into the iframe that intercepts `<a>` clicks and posts `{ type: "gsd-page-nav", page: "..." }` to the parent window, switching the active page without a real navigation.

The editor auto-generates on mount when the page has no HTML and `initialPrompt` is set. Chat history is auto-saved (500ms debounce). HTML is auto-saved after generation (500ms debounce). Publishing clears chat history.

### API Routes

Beyond the routes already documented:
- `GET /api/websites/[id]` — fetch a single website (auth + ownership check)
- `PATCH /api/websites/[id]` — update website fields (name, status, pages, chatHistory)
- `GET /api/websites/[id]/export` — download all pages as a ZIP archive of `.html` files

### Image Upload

`POST /api/upload/image` — accepts `multipart/form-data` with a `file` field. Validates auth, image MIME type, and 5MB max size. Uploads to Supabase Storage bucket `website-images` under `{userId}/{timestamp}-{filename}`. Returns `{ url }` of the public URL.

### UI Components

Custom shadcn-style components live in `src/components/ui/`. Use `cn()` from `@/lib/utils` (wraps `clsx` + `tailwind-merge`) for conditional classes.
