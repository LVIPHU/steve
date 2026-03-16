# External Integrations

**Analysis Date:** 2026-03-16

## APIs & External Services

**Authentication:**
- Google OAuth 2.0 - Social sign-in provider
  - SDK/Client: better-auth
  - Config: `src/lib/auth.ts` (lines 27-31)
  - Credentials: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` environment variables

## Data Storage

**Databases:**
- PostgreSQL (managed via Supabase)
  - Connection: `DATABASE_URL` environment variable
  - Client: postgres.js driver (`postgres` package v3.4.8)
  - ORM: Drizzle ORM 0.45.1 with PostgreSQL dialect
  - Schema: `src/db/schema.ts`
  - Database instance: `src/db/index.ts` exports `db` client using drizzle configuration

**File Storage:**
- Not currently integrated (local-only or not implemented)

**Caching:**
- In-memory session cache only: better-auth cookie cache enabled with 5-minute max age (see `src/lib/auth.ts` lines 33-37)

## Authentication & Identity

**Auth Provider:**
- better-auth v1.5.5 - Open-source authentication framework

**Implementation:**
- Server-side auth: `src/lib/auth.ts` - betterAuth instance with Drizzle adapter
  - Configuration: Drizzle adapter using PostgreSQL provider
  - Tables: user, session, account, verification, profiles, websites
  - Methods: Email/password authentication + Google OAuth
  - Session management: Token-based with cookie caching

- Client-side auth: `src/lib/auth-client.ts` - createAuthClient wrapper
  - Base URL: `NEXT_PUBLIC_APP_URL` environment variable
  - Exported methods: `signIn`, `signUp`, `signOut`, `useSession` hook
  - Usage: Client Components (marked with `"use client"`)

- API route handler: `src/app/api/auth/[...all]/route.ts`
  - Catch-all route for all better-auth endpoints
  - Converts better-auth handler to Next.js GET/POST handlers

**Session Retrieval:**
- Server Components: `auth.api.getSession({ headers: await headers() })` from `src/lib/auth`
- Used in `src/app/(dashboard)/layout.tsx` for enforcing protected routes

## Monitoring & Observability

**Error Tracking:**
- Not detected - no integration configured

**Logs:**
- Console-based only (no centralized logging service detected)

## CI/CD & Deployment

**Hosting:**
- Not explicitly configured; default target: Vercel (Next.js native) or self-hosted Node.js

**CI Pipeline:**
- Not detected - no GitHub Actions, GitLab CI, or CI configuration found

## Environment Configuration

**Required env vars:**
- `DATABASE_URL` - Supabase PostgreSQL connection string (critical)
- `BETTER_AUTH_SECRET` - Authentication secret, minimum 32 characters (critical)
- `BETTER_AUTH_URL` - Application origin for auth callbacks (e.g., `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` - Google OAuth application ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth application secret
- `NEXT_PUBLIC_APP_URL` - Public-facing app URL (exposed to client)

**Secrets location:**
- `.env` file (not committed; `.env.example` provided as template)
- Environment variables passed at deployment time

## Webhooks & Callbacks

**Incoming:**
- Better-auth endpoints: `POST /api/auth/*` for sign-in, sign-up, sign-out, session refresh
- Route handler: `src/app/api/auth/[...all]/route.ts`

**Outgoing:**
- None detected

## Data Flow

**Authentication Flow:**
1. User submits credentials via `(auth)` route group pages (`/login`, `/register`)
2. Client-side `authClient.signIn()` or `authClient.signUp()` called
3. Request routed to `POST /api/auth/[...all]` handler
4. better-auth validates credentials against PostgreSQL `user`, `account` tables
5. Session created in `session` table, token cached via cookie
6. Server-side pages check session via `auth.api.getSession()` in layout
7. Unauthenticated users redirected to `/login` by `(dashboard)/layout.tsx`

**Database Access:**
1. Drizzle ORM client initialized in `src/db/index.ts`
2. Postgres connection via `postgres` driver with `DATABASE_URL`
3. better-auth adapter uses Drizzle client for all table operations
4. Schema defined once in `src/db/schema.ts`, used by ORM and migrations

---

*Integration audit: 2026-03-16*
