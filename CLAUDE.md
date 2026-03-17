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
| `OPENAI_API_KEY` | OpenAI API key for website content generation |

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
- **better-auth tables:** `user`, `session`, `account`, `verification` — these match better-auth's expected shape and are passed via `drizzleAdapter`.
- **App tables:** `profiles` (1:1 with `user`, has `username` and `plan`), `websites` (many per user, has `slug`, `status`, `content` as JSONB, `seoMeta` as JSONB).
- DB client exported from `src/db/index.ts` as `db`.

### Website Content Model (WebsiteAST)

Defined in `src/types/website-ast.ts`. The `websites.content` JSONB column stores:

```ts
{
  theme: { primaryColor, backgroundColor, font },
  sections: [{ id, type, ai_content, manual_overrides }],
  seo: { title, description, slug }
}
```

- `ai_content` holds AI-generated field values; `manual_overrides` holds user edits.
- `resolveField(section, field)` in `src/lib/ast-utils.ts` merges them — overrides win.
- Section types: `hero | about | features | content | gallery | cta`.
- `parseAndValidateAST()` in `src/lib/ast-utils.ts` validates raw OpenAI JSON before saving.

### AI Generation Flow

`POST /api/ai/generate` → OpenAI `gpt-4o` with `response_format: json_object` → parse/validate → save to DB.

- Prompts in `src/lib/ai-prompts.ts` (`buildSystemPrompt(templateId)`, `buildUserPrompt(noteJson, prompt)`).
- 30s timeout via `AbortSignal.timeout(30000)`.
- Slug is normalized through `generateSlug()` from `src/lib/slugify.ts` before saving.

### Templates & Layouts

- 5 templates: `blog | portfolio | fitness | cooking | learning` — defined in `src/lib/templates.ts`.
- `suggestTemplate(input)` maps keywords to template IDs (supports Vietnamese keywords).
- Layout components in `src/components/layouts/` render the full public page for each template.
- Section components in `src/components/sections/` are shared across templates for preview.
- `TemplateRenderer` (from `src/components/layouts/index.tsx`) picks the right layout by `templateId`.

### Public Website Viewer

`(public)/[username]/[slug]/page.tsx` — no auth required. Shows `notFound()` for drafts, archived page for archived, renders `TemplateRenderer` for published. Includes OG image at `opengraph-image.tsx`.

### UI Components

Custom shadcn-style components live in `src/components/ui/`. Use `cn()` from `@/lib/utils` (wraps `clsx` + `tailwind-merge`) for conditional classes.
