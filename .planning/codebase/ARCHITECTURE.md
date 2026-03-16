# Architecture

**Analysis Date:** 2026-03-16

## Pattern Overview

**Overall:** Next.js 16 App Router with server-side session enforcement and layered component architecture

**Key Characteristics:**
- Route groups separate public (`(auth)`) and protected (`(dashboard)`) flows at routing level
- Server Components enforce authentication via layout-level session checks
- Client Components handle user interactions and real-time state
- Drizzle ORM with PostgreSQL provides type-safe database access
- better-auth provides authentication abstraction with server/client split
- Tailwind CSS v4 + custom shadcn-style UI components for styling

## Layers

**Presentation Layer:**
- Purpose: User-facing UI components and pages
- Location: `src/app/`, `src/components/ui/`
- Contains: React Server/Client Components, layout templates, page routes
- Depends on: Authentication lib, UI component library, styling utilities
- Used by: End users via HTTP

**API/Handler Layer:**
- Purpose: Process HTTP requests and delegate to auth/business logic
- Location: `src/app/api/auth/[...all]/route.ts`
- Contains: Next.js route handlers that wrap better-auth handlers
- Depends on: better-auth instance, Drizzle ORM
- Used by: Client-side auth calls, session validation

**Authentication Layer:**
- Purpose: User authentication, session management, OAuth handling
- Location: `src/lib/auth.ts` (server), `src/lib/auth-client.ts` (client)
- Contains: better-auth configuration with drizzle adapter, email/password + Google OAuth
- Depends on: Drizzle database, better-auth framework
- Used by: All protected pages, client-side auth operations

**Data Access Layer:**
- Purpose: Database interaction and schema definition
- Location: `src/db/schema.ts` (schema), `src/db/index.ts` (client)
- Contains: Drizzle ORM table definitions, relations, type exports
- Depends on: postgres.js driver, Drizzle ORM
- Used by: better-auth adapter, future business logic

**Utility Layer:**
- Purpose: Shared helpers and configuration
- Location: `src/lib/utils.ts`
- Contains: `cn()` function for className merging (clsx + tailwind-merge)
- Depends on: clsx, tailwind-merge
- Used by: All UI components

## Data Flow

**Authentication/Login Flow:**

1. User visits `/login` → Client Component renders login form
2. Form submission calls `authClient.signIn.email()` from `@/lib/auth-client`
3. HTTP POST to `api/auth/[...all]` route handler
4. Route handler delegates to `auth` instance from `@/lib/auth`
5. better-auth uses `drizzleAdapter` to query/write `user`, `session`, `account` tables
6. Session cookie set in response
7. `router.push("/dashboard")` navigates to protected route
8. Dashboard layout checks session via `auth.api.getSession()` server-side; redirects if invalid

**Protected Page Access:**

1. User requests `/dashboard/*`
2. `(dashboard)/layout.tsx` runs as Server Component
3. Calls `auth.api.getSession({ headers: await headers() })` to validate
4. Returns session object or null based on cookies
5. If no session → `redirect("/login")`
6. If valid → renders children with session data available

**Social Auth (Google) Flow:**

1. User clicks "Sign in with Google" button
2. Client calls `authClient.signIn.social({ provider: "google" })`
3. User redirected to Google OAuth consent screen
4. Google redirects back to `api/auth/[...all]` callback
5. better-auth creates/links account via `accounts` table
6. Session established and user redirected to `/dashboard`

**State Management:**

- Client-side form state: React `useState()` hooks in Client Components
- Session state: HTTP cookies (HttpOnly, managed by better-auth)
- Page-level auth state: Server Component session checks (no JS required)
- UI state (animations): motion/react for transitions

## Key Abstractions

**auth Instance:**
- Purpose: Central authentication configuration and logic
- Examples: `src/lib/auth.ts`
- Pattern: Singleton instance created once, exported for server-side use
- Provides: Session retrieval, user management, database adapter configuration

**authClient Instance:**
- Purpose: Client-safe authentication operations
- Examples: `src/lib/auth-client.ts`
- Pattern: Export helper functions from instantiated better-auth client
- Provides: `signIn`, `signUp`, `signOut`, `useSession` for use in Client Components

**Database Schema Definitions:**
- Purpose: Single source of truth for all tables and relations
- Examples: `src/db/schema.ts`
- Pattern: Drizzle `pgTable()` + `relations()` for ORM mapping
- Contains: better-auth required tables (users, sessions, accounts, verification), app tables (profiles, websites)

**UI Components:**
- Purpose: Reusable styled elements following shadcn pattern
- Examples: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/input.tsx`, `src/components/ui/label.tsx`
- Pattern: Wrapper components around @base-ui/react and radix-ui primitives with Tailwind + CVA (class-variance-authority) styling
- Design: `cn()` utility for conditional class merging, data-slot attributes for granular styling

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Render HTML structure, apply global fonts (Geist), include globals.css

**Public Pages:**
- Location: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- Triggers: Unauthenticated users visiting `/login` or `/register`
- Responsibilities: Render auth forms, handle client-side validation, call `authClient` methods

**Dashboard Layout (Protected):**
- Location: `src/app/(dashboard)/layout.tsx`
- Triggers: Any request to `/dashboard/*`
- Responsibilities: Enforce session check, redirect to login if unauthorized, render navigation wrapper

**Dashboard Page:**
- Location: `src/app/(dashboard)/dashboard/page.tsx`
- Triggers: Authenticated user visits `/dashboard`
- Responsibilities: Display welcome card with user info, serve as home page for logged-in users

**Auth API Route:**
- Location: `src/app/api/auth/[...all]/route.ts`
- Triggers: POST/GET to `/api/auth/*` (all better-auth endpoints)
- Responsibilities: Wrap better-auth handlers, process login/logout/OAuth callbacks

**Home (Landing):**
- Location: `src/app/page.tsx`
- Triggers: GET `/` (root path)
- Responsibilities: Render marketing landing page with Next.js template content

## Error Handling

**Strategy:** Client-side form validation + error state display

**Patterns:**
- Form errors captured in `useState()` and displayed inline (see `/login`, `/register`)
- Authentication errors from `authClient` show user-friendly messages
- Server-side redirects enforce authentication boundaries (layout-level, no error UI needed)
- Network errors bubble up to Client Components for handling

## Cross-Cutting Concerns

**Logging:** Not implemented; console methods available but not systematically used

**Validation:**
- Client-side: HTML5 `required`, `type="email"`, `minLength` attributes
- Server-side: better-auth handles validation, Drizzle schema enforces constraints

**Authentication:**
- Server-side: `auth.api.getSession()` in layouts and pages
- Client-side: `authClient.signIn/signUp/signOut` for user actions
- Session persistence: HttpOnly cookies managed by better-auth

---

*Architecture analysis: 2026-03-16*
