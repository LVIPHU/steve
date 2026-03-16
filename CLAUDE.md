# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # ESLint

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

## Architecture

**Stack:** Next.js 16 (App Router) + React 19, Tailwind CSS v4, Drizzle ORM + postgres.js, better-auth, motion (Framer Motion successor).

### Route Groups

- `(auth)` — public pages: `/login`, `/register`
- `(dashboard)` — protected pages behind session check in `layout.tsx`
- `api/auth/[...all]` — better-auth catch-all handler

### Auth Pattern

- **Server-side:** `auth.api.getSession({ headers: await headers() })` from `@/lib/auth` — used in Server Components and layouts for redirects.
- **Client-side:** `authClient` from `@/lib/auth-client` — used in Client Components (`"use client"`) for `signIn`, `signUp`, `signOut`, `useSession`.
- The `(dashboard)/layout.tsx` enforces session at the layout level; individual pages may also check for finer control.

### Database

- Schema defined in `src/db/schema.ts` — single source of truth for all tables and relations.
- **better-auth tables:** `user`, `session`, `account`, `verification` — these match better-auth's expected shape and are passed via `drizzleAdapter`.
- **App tables:** `profiles` (1:1 with `user`, has `username` and `plan`), `websites` (many per user, has `slug`, `status`, `content` as JSONB, `seoMeta` as JSONB).
- DB client exported from `src/db/index.ts` as `db`.

### UI Components

Custom shadcn-style components live in `src/components/ui/`. Use `cn()` from `@/lib/utils` (wraps `clsx` + `tailwind-merge`) for conditional classes.
