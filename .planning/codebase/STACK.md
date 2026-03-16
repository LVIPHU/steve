# Technology Stack

**Analysis Date:** 2026-03-16

## Languages

**Primary:**
- TypeScript 5.x - Full codebase (frontend, backend, database configuration)

**Secondary:**
- JavaScript (ESM) - Build and configuration files (`eslint.config.mjs`, `postcss.config.mjs`)

## Runtime

**Environment:**
- Node.js 22.x (verified in development)

**Package Manager:**
- npm - primary dependency manager
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework with App Router
- React 19.2.3 - UI component library
- React DOM 19.2.3 - DOM rendering

**Styling:**
- Tailwind CSS 4.x - Utility-first CSS framework (using PostCSS integration)
- @tailwindcss/postcss 4.x - Tailwind PostCSS plugin

**UI Components:**
- @base-ui/react 1.3.0 - Headless UI component library
- Radix UI 1.4.3 - Unstyled, accessible component system
- Lucide React 0.577.0 - Icon library

**Animation:**
- motion 12.36.0 - Successor to Framer Motion for animations
- tw-animate-css 1.4.0 - Tailwind animation utilities

**Build/Dev Tools:**
- TypeScript 5.x - Type checking and transpilation
- ESLint 9.x - Code linting
- eslint-config-next 16.1.6 - Next.js ESLint configuration preset

## Key Dependencies

**Critical:**
- better-auth 1.5.5 - Authentication framework supporting multi-provider auth and email/password
- drizzle-orm 0.45.1 - Type-safe ORM for database operations
- postgres 3.4.8 - Native PostgreSQL client (used by Drizzle)

**Infrastructure:**
- drizzle-kit 0.31.4 - Database schema management and migration tooling
- dotenv 17.3.1 - Environment variable management
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.5.0 - Merge Tailwind classes without conflicts
- class-variance-authority 0.7.1 - Component variant management system

## Configuration

**Environment:**
- Environment variables defined in `.env.example`:
  - `DATABASE_URL` - Supabase PostgreSQL connection string
  - `BETTER_AUTH_SECRET` - Auth session signing secret (≥32 characters)
  - `BETTER_AUTH_URL` - App origin for auth callbacks
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
  - `NEXT_PUBLIC_APP_URL` - Public app URL for client-side auth configuration

**Build:**
- `tsconfig.json` - TypeScript compilation targets ES2017, strict mode enabled
- `next.config.ts` - Next.js configuration (minimal, using defaults)
- `postcss.config.mjs` - PostCSS with Tailwind plugin
- `drizzle.config.ts` - Drizzle Kit configuration pointing to `src/db/schema.ts` for PostgreSQL
- `eslint.config.mjs` - ESLint with Next.js core-web-vitals and TypeScript presets

## Database

**Provider:** Supabase (managed PostgreSQL)

**Connection:**
- Client: postgres.js (native PostgreSQL driver)
- ORM: Drizzle ORM with PostgreSQL dialect
- Connection pooling: Managed via Supabase connection string

**Schema Location:** `src/db/schema.ts`

**Better-auth Tables:**
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth provider linkage
- `verification` - Email verification tokens

**Application Tables:**
- `profiles` - User profiles (1:1 with user, includes username and plan)
- `websites` - User websites (many per user, includes slug, status, content as JSONB, seoMeta as JSONB)

## Platform Requirements

**Development:**
- Node.js 22.x
- PostgreSQL 12+ (via Supabase)
- npm for dependency management

**Production:**
- Deployment target: Vercel (Next.js framework assumption) or self-hosted Node.js environment
- PostgreSQL database (Supabase compatible)
- Environment variables required for auth providers and database

## Build Output

**Client-side:** Next.js static/dynamic routes compiled to `.next/`
**Server-side:** Node.js API routes and Server Components in `.next/`

---

*Stack analysis: 2026-03-16*
