# Codebase Conventions

## File & Directory Naming

- **React components:** PascalCase (`DashboardNav`, `LoginPage`)
- **Utility files:** camelCase (`auth.ts`, `auth-client.ts`, `utils.ts`)
- **Route directories:** kebab-case per Next.js App Router conventions
- **Route groups:** parenthesized (`(auth)`, `(dashboard)`)

## Code Style

- **Functions:** camelCase; event handlers prefixed with `handle` (e.g., `handleSubmit`)
- **Types/Interfaces:** PascalCase; prefer `typeof` inference from Drizzle schema (`typeof users.$inferSelect`)
- **Linting:** ESLint v9 with Next.js flat config (`eslint.config.mjs`); no Prettier
- **Path alias:** `@/*` maps to `src/*`

## Import Order

1. External packages
2. Internal modules (`@/lib/...`, `@/db/...`)
3. Components (`@/components/...`)

## Component Patterns

- **Server Components** (default): fetch data directly, use `auth.api.getSession({ headers: await headers() })`
- **Client Components** (`"use client"`): use `authClient` from `@/lib/auth-client`, React hooks
- Server/client boundary is explicit and intentional; `"use client"` only when necessary
- Session check + redirect pattern in layouts and pages for route protection

## Error Handling

- State-based error display with `useState<string | null>` for form errors
- Variables renamed to avoid shadowing (e.g., `err` not `error` in catch blocks)
- No global error boundary pattern established yet

## Auth Pattern

```typescript
// Server Component / Layout
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect("/login");

// Client Component
import { authClient } from "@/lib/auth-client";
const { data: session } = authClient.useSession();
```

## Styling

- Tailwind CSS v4 utility classes
- `cn()` from `@/lib/utils` (wraps `clsx` + `tailwind-merge`) for conditional classes
- shadcn-style custom UI components in `src/components/ui/`
- CSS custom properties in `globals.css` for theming

## Database Queries

- Drizzle ORM with type-safe queries
- `db` client imported from `@/db`
- Schema types exported via `$inferSelect` / `$inferInsert`
- `prepare: false` required for Supabase Transaction Pool Mode
