# Codebase Structure

**Analysis Date:** 2026-03-16

## Directory Layout

```
steve/
├── src/
│   ├── app/                           # Next.js App Router pages and layouts
│   │   ├── (auth)/                    # Public route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Login form page
│   │   │   └── register/
│   │   │       └── page.tsx           # Registration form page
│   │   ├── (dashboard)/               # Protected route group
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx           # Dashboard home page
│   │   │   │   └── dashboard-nav.tsx  # Navigation component
│   │   │   └── layout.tsx             # Session enforcement layout
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── route.ts       # better-auth route handler
│   │   ├── layout.tsx                 # Root layout (HTML structure)
│   │   ├── page.tsx                   # Home/landing page
│   │   └── globals.css                # Global styles
│   ├── components/
│   │   └── ui/                        # shadcn-style UI components
│   │       ├── button.tsx             # Button with variants
│   │       ├── card.tsx               # Card container and sections
│   │       ├── input.tsx              # Text input field
│   │       └── label.tsx              # Form label element
│   ├── db/
│   │   ├── schema.ts                  # Drizzle table definitions and relations
│   │   └── index.ts                   # Database client export
│   └── lib/
│       ├── auth.ts                    # Server-side better-auth instance
│       ├── auth-client.ts             # Client-side auth client
│       └── utils.ts                   # Utility functions (cn)
├── .env                               # Environment variables (not in repo)
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── next.config.ts                     # Next.js configuration
├── drizzle.config.ts                  # Drizzle ORM configuration
├── eslint.config.mjs                  # ESLint configuration
├── postcss.config.mjs                 # PostCSS configuration
└── .planning/                         # Planning and documentation
    └── codebase/                      # Architecture documentation
        ├── ARCHITECTURE.md
        └── STRUCTURE.md
```

## Directory Purposes

**`src/app`:**
- Purpose: Next.js 16 App Router pages, layouts, and API routes
- Contains: Server Components (pages/layouts), Client Components (forms), route handlers
- Key files: `layout.tsx` (root structure), `(auth)/*` (public), `(dashboard)/*` (protected), `api/auth/*` (handler)

**`src/app/(auth)`:**
- Purpose: Public authentication pages accessible without session
- Contains: Login and registration pages as Client Components
- Key files: `login/page.tsx`, `register/page.tsx`

**`src/app/(dashboard)`:**
- Purpose: Protected pages behind session check
- Contains: Dashboard layout enforcing authentication, page implementations
- Key files: `layout.tsx` (session validation), `dashboard/page.tsx` (home page)

**`src/components/ui`:**
- Purpose: Reusable UI component library
- Contains: Styled form controls and container components following shadcn pattern
- Key files: `button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`

**`src/db`:**
- Purpose: Database access and schema definition
- Contains: Drizzle ORM schema (tables, relations), database client
- Key files: `schema.ts` (source of truth for tables), `index.ts` (db export)

**`src/lib`:**
- Purpose: Core application logic and utilities
- Contains: Authentication configuration, client setup, helper functions
- Key files: `auth.ts` (server auth), `auth-client.ts` (client auth), `utils.ts` (cn function)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML layout, applies global styles and fonts
- `src/app/page.tsx`: Home/landing page at `/` route
- `src/app/(auth)/login/page.tsx`: Public login form
- `src/app/(auth)/register/page.tsx`: Public registration form
- `src/app/(dashboard)/layout.tsx`: Protected route enforcement
- `src/app/(dashboard)/dashboard/page.tsx`: Authenticated user dashboard home
- `src/app/api/auth/[...all]/route.ts`: All better-auth requests

**Configuration:**
- `tsconfig.json`: Path alias `@/*` → `src/*`, TypeScript strict mode
- `drizzle.config.ts`: Database schema path, PostgreSQL dialect, credentials
- `next.config.ts`: Next.js configuration (currently empty)
- `.env`: Database URL, auth secrets, OAuth credentials (not committed)

**Core Logic:**
- `src/db/schema.ts`: Table definitions, relations, type exports
- `src/db/index.ts`: Drizzle database instance
- `src/lib/auth.ts`: better-auth server configuration
- `src/lib/auth-client.ts`: better-auth client for Client Components
- `src/lib/utils.ts`: `cn()` utility for className merging

**Testing:**
- No test files present; testing framework not configured

## Naming Conventions

**Files:**
- Pages: `page.tsx` in directories matching route paths
- Components: PascalCase (e.g., `DashboardNav`, `LoginPage`)
- Utilities: camelCase with descriptive names (e.g., `auth-client.ts`, `schema.ts`)
- Routes: Route groups in parentheses `(auth)`, `(dashboard)` for logical grouping
- Catch-all routes: `[...all]` for dynamic segments

**Directories:**
- Route groups: `(groupName)` in App Router
- Feature areas: Plural or descriptive (e.g., `components/ui`, `db`, `lib`)
- Semantic grouping: `auth` for auth pages, `dashboard` for dashboard pages

**Components:**
- Function components: PascalCase (e.g., `LoginPage`, `DashboardNav`, `Card`)
- Primitive wrappers: Named after element + semantic suffix (e.g., `Button`, `Input`, `Label`)
- Props interfaces: Inline or named with `Props` suffix

**Database:**
- Tables: Plural lowercase (e.g., `users`, `sessions`, `websites`, `profiles`)
- Columns: camelCase in TypeScript, snake_case in SQL (e.g., `emailVerified` → `email_verified`)
- Foreign keys: `userId`, `postId` (camelCase in TS)
- Timestamps: `createdAt`, `updatedAt` (consistent snake_case in DB)

## Where to Add New Code

**New Feature (e.g., Website Editor):**
- Primary code: `src/app/(dashboard)/[feature]/page.tsx` for page, create component in `src/components/` if reusable
- Tests: Not configured; would go in `src/app/(dashboard)/[feature]/*.test.tsx` or `__tests__/`
- Database schema: Add table to `src/db/schema.ts`, run `npm run db:generate` and `npm run db:push`
- API endpoints: Add to `src/app/api/[feature]/route.ts`

**New Component/Module:**
- Implementation: `src/components/[FeatureName]/[ComponentName].tsx` for feature-specific, `src/components/ui/` for shared UI
- Type definitions: Inline or `src/types/` if reused across many files (not present yet)
- Styling: Tailwind classes with `cn()` utility, use CVA (class-variance-authority) for variants

**Utilities/Helpers:**
- Shared helpers: `src/lib/[utility-name].ts`
- Export from barrel file if multiple related utilities: `src/lib/index.ts`
- Database helpers: Add as functions in `src/db/` or in a `src/db/queries.ts` file (not present)

## Special Directories

**`.next`:**
- Purpose: Next.js build output and dev types
- Generated: Yes (automatic)
- Committed: No (in .gitignore)

**`.planning`:**
- Purpose: Project planning and architecture documentation
- Generated: Yes (manually created for GSD)
- Committed: Yes (tracked in git)

**`node_modules`:**
- Purpose: Installed npm dependencies
- Generated: Yes (by npm install)
- Committed: No (in .gitignore)

**`drizzle`:**
- Purpose: Drizzle migration files (when generated via `npm run db:generate`)
- Generated: Yes (by Drizzle Kit)
- Committed: Yes (migrations tracked in git)

---

*Structure analysis: 2026-03-16*
