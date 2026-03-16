# Phase 1: Foundation Completion - Research

**Researched:** 2026-03-16
**Domain:** better-auth, Next.js 16 proxy.ts, Drizzle ORM, username enforcement, mobile token login
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Username Capture**
- Username is added directly to the register form (same step as name, email, password) — 1 step, no separate onboarding for email/password users
- Validate on form submit (no real-time check while typing)
- Username is permanent after registration (used in public URLs)
- Google OAuth users: after OAuth completes, check for existing `profiles` record; if none, redirect to `/onboarding` to set username

**Token Login Flow (Mobile to Web)**
- Web app provides endpoint `POST /api/auth/mobile-token`
  - Mobile sends its own better-auth session token for authentication (not email/password)
  - Web app validates that session token against better-auth, identifies user ID
  - Web app creates a one-time token (random UUID or crypto token), stores in DB with expiry
  - Returns token to mobile app
- Mobile app embeds token in URL: `https://webapp.com/api/auth/token-login?token=xxx`
- Mobile app opens that URL in browser (deep link or in-app browser)
- Web endpoint `GET /api/auth/token-login` validates token, creates better-auth session, deletes token from DB
- Redirect to `/dashboard` after successful login
- Token valid for 5 minutes after creation
- Token is single-use (deleted after use)

**Route Protection**
- Two-layer pattern per technical spec:
  - Layer 1 — `proxy.ts` (replaces middleware.ts in Next.js 16): fast cookie check, early redirect
  - Layer 2 — layout/page: validate actual session against DB
- `proxy.ts` protects: `/dashboard/:path*`, `/editor/:path*`, `/onboarding`

### Claude's Discretion
- Token storage: can reuse better-auth's `verification` table (already has `identifier`, `value`, `expiresAt`) instead of creating a new table
- Error pages: design for invalid/expired token links
- Username format rules: lowercase, letters, numbers, hyphens — regex `/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/`

### Deferred Ideas (OUT OF SCOPE)
- Changing username after registration
- Avatar upload during onboarding
- Email verification flow
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| F-01 | Auth: email/password — register and login with email/password, shared credentials with mobile app | better-auth `emailAndPassword` already enabled; need to extend `signUp.email()` call to include username via `user.additionalFields`; `databaseHooks.user.create.after` creates profiles record |
| F-02 | Auth: token login — mobile app generates link with token, web app auto-logs in user | better-auth bearer plugin lets web validate mobile's session token; `verification` table stores one-time tokens; `GET /api/auth/token-login` validates and creates session via `auth.api.signInWithSession` or direct session insertion |
| F-03 | Username enforcement — required at registration, reserved words rejected | `user.additionalFields.username` in better-auth config; reserved list validation server-side before profile insert; regex format enforcement |
</phase_requirements>

---

## Summary

Phase 1 completes the auth foundation for a Next.js 16 + better-auth + Drizzle ORM stack. Three areas need work: (1) username capture during registration and via an onboarding page for Google OAuth users, (2) a mobile-to-web token login flow where the mobile app's better-auth session is exchanged for a one-time URL token, and (3) route protection using the new `proxy.ts` convention.

The existing codebase already has: `proxy.ts` at root (partially configured — missing `/onboarding`), `(dashboard)/layout.tsx` with session guard, `profiles` and `verification` tables in schema, `better-auth` configured with `emailAndPassword` and `googleOAuth`, and UI components ready to reuse. The register form needs a `username` field added. The mobile token endpoints and onboarding page need to be created.

The critical architectural decision (from CONTEXT.md) is to use better-auth's `verification` table for one-time token storage — avoiding a new DB table. For mobile-app session validation, the web endpoint receives the mobile app's better-auth session token as an `Authorization: Bearer` header and calls `auth.api.getSession()` which works with bearer tokens when the `bearer` plugin is enabled server-side.

**Primary recommendation:** Use better-auth's `user.additionalFields` + `databaseHooks.user.create.after` for the registration flow, the `bearer` plugin for mobile session validation, the `verification` table for one-time token storage, and extend `proxy.ts` to cover `/onboarding`.

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| better-auth | ^1.5.5 | Auth framework | Already configured, handles sessions/OAuth |
| drizzle-orm | ^0.45.1 | ORM + query builder | Already in use, schema already defined |
| next | 16.1.6 | App framework | App Router, proxy.ts (middleware replacement) |
| postgres | ^3.4.8 | DB driver | Already configured in `src/db/index.ts` |

### Supporting (already installed, need to be used)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| better-auth/plugins/bearer | (bundled) | Validate bearer token in server API routes | `POST /api/auth/mobile-token` to authenticate mobile's session |
| crypto (Node.js built-in) | N/A | Generate secure one-time tokens | `crypto.randomUUID()` or `crypto.getRandomValues()` |

### No new dependencies needed
All required libraries are already installed. No new `npm install` required for this phase.

## Architecture Patterns

### File Structure — New Files to Create
```
src/app/
├── (auth)/
│   └── onboarding/
│       └── page.tsx          # Username setup for Google OAuth users
└── api/
    └── auth/
        ├── mobile-token/
        │   └── route.ts      # POST: mobile sends bearer token, gets one-time URL token
        └── token-login/
            └── route.ts      # GET: validates one-time token, creates web session

proxy.ts                      # ALREADY EXISTS — needs /onboarding added to matcher
```

### Files to Modify
```
src/app/(auth)/register/page.tsx        # Add username field + client-side validation
src/app/(dashboard)/layout.tsx          # Add profiles check → redirect /onboarding
src/lib/auth.ts                         # Add user.additionalFields + databaseHooks + bearer plugin
src/lib/auth-client.ts                  # No change needed for core flow
proxy.ts                                # Add /onboarding to matcher
```

### Pattern 1: Username via better-auth additionalFields

**What:** Define `username` as an additional field on the user model in `auth.ts`. This makes `signUp.email()` accept `username` and TypeScript-safe.

**When to use:** Email/password registration — username goes directly in the form.

**Server config (`src/lib/auth.ts`):**
```typescript
// Source: https://better-auth.com/docs/authentication/email-password
export const auth = betterAuth({
  // ...existing config...
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,   // required=false here; enforce in databaseHooks
        input: true,       // allow client to send it
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // user.username is available here if passed
          // Validate + insert into profiles table
        },
      },
    },
  },
  plugins: [bearer(), nextCookies()],
});
```

**Client call (register form):**
```typescript
// Source: https://better-auth.com/docs/authentication/email-password
const { error } = await authClient.signUp.email({
  name,
  email,
  password,
  username,          // additional field — TypeScript inferred from server config
  callbackURL: "/dashboard",
});
```

**Important:** `user.additionalFields` fields are stored on the `user` table in better-auth's model. Since username lives in the `profiles` table (separate from `user`), the cleanest approach is:
- Pass `username` as an additional field so it's available in `databaseHooks.user.create.after(user)`
- In the `after` hook, insert into `profiles` table using the username value
- Do NOT rely on better-auth to store username on the `user` table itself

### Pattern 2: Mobile Token Flow — Bearer Validation

**What:** Mobile app authenticates to web endpoint by sending its own better-auth session token as `Authorization: Bearer <token>`. Web validates it with `auth.api.getSession()`, then creates a one-time token stored in `verification` table.

**When to use:** `POST /api/auth/mobile-token` endpoint.

**Server config — add bearer plugin:**
```typescript
// Source: https://better-auth.com/docs/plugins/bearer
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
  // ...
  plugins: [bearer(), nextCookies()],
});
```

**Route handler:**
```typescript
// src/app/api/auth/mobile-token/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { verification } from "@/db/schema";

export async function POST(request: Request) {
  // Validate mobile's session token via bearer
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Reuse verification table (CONTEXT decision)
  await db.insert(verification).values({
    id: crypto.randomUUID(),
    identifier: session.user.id,  // userId as identifier
    value: token,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return Response.json({ token });
}
```

### Pattern 3: Token Login — Consume One-Time Token

**What:** Browser opens link with one-time token. Web endpoint validates token, looks up userId, creates a better-auth web session, sets session cookie, deletes token.

**When to use:** `GET /api/auth/token-login?token=xxx`

```typescript
// src/app/api/auth/token-login/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { verification, sessions } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    redirect("/login?error=invalid-token");
  }

  // Find token in verification table
  const [record] = await db
    .select()
    .from(verification)
    .where(
      and(
        eq(verification.value, token),
        gt(verification.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!record) {
    redirect("/login?error=expired-token");
  }

  // Delete token immediately (single-use)
  await db.delete(verification).where(eq(verification.id, record.id));

  // Create better-auth session for the user
  const newSession = await auth.api.signInWithSession({
    userId: record.identifier,
    // ... redirect handled by better-auth
  });

  // If signInWithSession doesn't exist, use createSession:
  // await auth.api.createSession({ userId: record.identifier })
  // Then set cookie and redirect

  redirect("/dashboard");
}
```

**Note:** The exact better-auth API for programmatically creating a session server-side needs verification against the installed version (1.5.5). Common options: `auth.api.createSession({ userId })` or direct DB insert matching `sessions` table schema. The `nextCookies()` plugin must be active.

### Pattern 4: Google OAuth Onboarding Redirect

**What:** After Google sign-in, dashboard layout checks if `profiles` record exists for the user. If not, redirect to `/onboarding`.

**Layout modification:**
```typescript
// src/app/(dashboard)/layout.tsx
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // Check profiles record exists
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile) redirect("/onboarding");

  return <>{children}</>;
}
```

### Pattern 5: proxy.ts Extension

**What:** Add `/onboarding` to the protected matcher so unauthenticated users cannot access it.

**Current proxy.ts already exists** at `D:/STEVE/steve/proxy.ts`. Only need to add `/onboarding` to matcher and the cookie check branch.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (!sessionCookie && (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/editor") ||
    pathname.startsWith("/onboarding")
  )) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/onboarding"],
};
```

### Pattern 6: Username Validation (Server-Side in databaseHooks)

**What:** The `databaseHooks.user.create.after` callback validates username before inserting into profiles.

```typescript
// Validation logic to embed in databaseHooks
const RESERVED_USERNAMES = [
  "dashboard", "editor", "api", "login", "register",
  "settings", "pricing", "about", "admin",
];
const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

function validateUsername(username: string): string | null {
  if (!username) return "Username is required";
  if (!USERNAME_REGEX.test(username)) return "Invalid username format";
  if (RESERVED_USERNAMES.includes(username)) return "Username is reserved";
  return null; // valid
}
```

**Note:** If the `databaseHooks.user.create.after` hook throws, behavior depends on better-auth version — the user record may already be committed. Prefer pre-validation in a `before` hook or in a server action before calling `signUp.email()`.

### Anti-Patterns to Avoid
- **Real-time username availability check:** CONTEXT explicitly disallows it — validate only on submit.
- **Storing username on `user` table:** It belongs in `profiles` table per existing schema.
- **Using middleware.ts:** Next.js 16 deprecated it — `proxy.ts` is the correct convention (file already exists).
- **Edge runtime in proxy.ts:** Next.js 16 `proxy.ts` runs on Node.js runtime only — no edge runtime config.
- **Trusting one-time tokens without expiry check:** Always use `gt(verification.expiresAt, new Date())` in query.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session validation in API routes | Custom cookie parsing | `auth.api.getSession({ headers })` | better-auth handles signing, verification, expiry |
| Bearer token support | Custom Authorization header parser | `bearer()` plugin in better-auth | Plugin wires bearer into `getSession()` automatically |
| Secure random tokens | Math.random() or weak entropy | `crypto.randomUUID()` (Node.js built-in) | Cryptographically secure, 128-bit entropy |
| Session cookie creation | Manual Set-Cookie headers | `nextCookies()` plugin + better-auth session API | Plugin handles SameSite, Secure, HttpOnly correctly |
| Password hashing | bcrypt manual setup | better-auth handles it internally | Already abstracted in `emailAndPassword` config |

**Key insight:** better-auth's `auth.api.*` methods are the safe surface. Direct DB manipulation of sessions is a last resort — only needed if `auth.api.createSession()` doesn't exist in v1.5.5.

## Common Pitfalls

### Pitfall 1: additionalFields Not Reflected in Client Types
**What goes wrong:** After adding `user.additionalFields.username` to `auth.ts`, `authClient.signUp.email()` still shows TypeScript error for `username` parameter.
**Why it happens:** The auth client infers types from the server config at build time. If `auth.ts` and `auth-client.ts` are not co-located or the client isn't re-imported, types don't propagate.
**How to avoid:** After updating `auth.ts`, restart the dev server. TypeScript should pick up the inferred types from `betterAuth()` return type automatically in a monorepo setup.
**Warning signs:** TypeScript error on `authClient.signUp.email({ username })` after config change.

### Pitfall 2: databaseHooks.user.create.after Already Committed User
**What goes wrong:** If the `after` hook throws (e.g., duplicate username), the user record is already in DB but the profile insert fails — leaving an orphaned user.
**Why it happens:** `after` hooks run post-commit.
**How to avoid:** Add a `before` hook on `user.create` to validate the username uniqueness check BEFORE the user record is inserted. Or: do the uniqueness check in a dedicated server action before calling `signUp.email()`, and return a form error to the user.
**Warning signs:** Users can sign up but dashboard layout redirects them to `/onboarding` because no profile exists and they can't get past it.

### Pitfall 3: verification Table Collision with better-auth Internal Use
**What goes wrong:** better-auth uses the `verification` table for email verification tokens. Using the same table for mobile one-time tokens could cause collisions or unexpected cleanup.
**Why it happens:** better-auth may run queries on this table (e.g., cleanup expired records) keyed by `identifier`.
**How to avoid:** Use a distinct `identifier` pattern for mobile tokens — e.g., prefix with `mobile-token:${userId}` or use the token UUID as the `identifier` and userId in `value`. Alternatively, if this causes issues during testing, create a dedicated `mobile_tokens` table.
**Warning signs:** Token lookups return unexpected results, or better-auth's own verification flows break.

### Pitfall 4: proxy.ts Matcher Missing /onboarding
**What goes wrong:** Google OAuth user without a profile can navigate directly to `/onboarding` without authentication.
**Why it happens:** The current `proxy.ts` only matches `/dashboard/:path*` and `/editor/:path*`.
**How to avoid:** Add `/onboarding` to the matcher array in `proxy.ts`. Already identified — just needs to be done.
**Warning signs:** Unauthenticated GET to `/onboarding` returns 200 instead of redirecting to `/login`.

### Pitfall 5: Token-Login Creates Session but Cookie Not Set
**What goes wrong:** `GET /api/auth/token-login` creates a session in DB but the browser doesn't receive a session cookie, so the redirect to `/dashboard` immediately redirects back to `/login`.
**Why it happens:** In Next.js App Router Route Handlers, cookies must be set via `cookies().set()` or the `nextCookies()` plugin must be active. Creating a session via direct DB insert won't set the cookie.
**How to avoid:** Use `auth.api.createSession()` (or equivalent) which respects the `nextCookies()` plugin and sets the appropriate cookie. If that API doesn't exist in v1.5.5, use `cookies().set()` from `next/headers` to manually set the session cookie matching better-auth's cookie name.
**Warning signs:** After token-login redirect, the user is immediately bounced back to `/login`.

### Pitfall 6: Reserved Username List Differs Between CONTEXT and REQUIREMENTS
**What goes wrong:** CONTEXT.md lists 7 reserved words; REQUIREMENTS.md Business Rules list 9 (includes `pricing` and `about`).
**Why it happens:** The lists were written at different times.
**How to avoid:** Use the REQUIREMENTS.md list as authoritative (it's the business rules document): `dashboard`, `editor`, `api`, `login`, `register`, `settings`, `pricing`, `about`, `admin`.
**Warning signs:** Users can register with `pricing` or `about` as username.

## Code Examples

### Drizzle Insert into verification Table
```typescript
// Source: https://orm.drizzle.team/docs/insert
import { db } from "@/db";
import { verification } from "@/db/schema";

await db.insert(verification).values({
  id: crypto.randomUUID(),
  identifier: userId,           // userId
  value: crypto.randomUUID(),   // the one-time token
  expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### Drizzle Select + Delete for Token Validation
```typescript
// Source: https://orm.drizzle.team/docs/select
import { eq, and, gt } from "drizzle-orm";

const [record] = await db
  .select()
  .from(verification)
  .where(
    and(
      eq(verification.value, token),
      gt(verification.expiresAt, new Date())
    )
  )
  .limit(1);

if (record) {
  await db.delete(verification).where(eq(verification.id, record.id));
}
```

### Drizzle Insert profiles
```typescript
// Source: https://orm.drizzle.team/docs/insert
import { db } from "@/db";
import { profiles } from "@/db/schema";

await db.insert(profiles).values({
  id: user.id,
  username: username.toLowerCase(),
  plan: "free",
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### better-auth Session Validation in Route Handler
```typescript
// Source: https://better-auth.com/docs/plugins/bearer
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // session.user.id is available
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` | Next.js v16.0.0 | Rename + Node.js runtime only (no edge runtime) |
| `export function middleware()` | `export function proxy()` or `export default function proxy()` | Next.js v16.0.0 | Function name changes |
| Edge runtime in middleware | Node.js runtime only in proxy.ts | v15.5.0 stable | Can use Node.js APIs in proxy |

**Deprecated/outdated:**
- `middleware.ts`: Deprecated in Next.js 16 — this project already uses `proxy.ts` at root.
- Edge runtime config in proxy: Not supported — do not add `export const runtime = "edge"`.

## Open Questions

1. **`auth.api.createSession()` availability in better-auth v1.5.5**
   - What we know: `auth.api.getSession()` is confirmed. Session creation via API is referenced in docs but exact method name varies by version.
   - What's unclear: Whether `auth.api.signInWithSession({ userId })` or `auth.api.createSession({ userId })` or another method name exists in v1.5.5.
   - Recommendation: At implementation time, inspect `auth.api` object keys in the route handler with `console.log(Object.keys(auth.api))` during dev to confirm available methods. Fallback: direct DB insert into `sessions` table + `cookies().set()` from `next/headers`.

2. **databaseHooks username value availability**
   - What we know: `user.additionalFields.username` with `input: true` should pass the value through to the user object in hooks.
   - What's unclear: Whether the `user` object in `databaseHooks.user.create.after(user)` includes `additionalFields` values or only core user fields.
   - Recommendation: During implementation, log the `user` object in the hook to confirm `user.username` is present. If not, the username must be passed via a different mechanism (e.g., server action pattern that separates signup from profile creation).

3. **verification table conflict with better-auth internals**
   - What we know: better-auth uses `verification` table for email/OTP verification.
   - What's unclear: Whether better-auth runs periodic cleanup on this table that could delete mobile tokens.
   - Recommendation: Use CONTEXT.md's discretion to proceed with `verification` table. If conflicts surface during testing, create a dedicated `mobile_tokens` table with `npm run db:generate && npm run db:push`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no jest/vitest/playwright config found |
| Config file | None — see Wave 0 |
| Quick run command | `npm run build` (type-check + build validation) |
| Full suite command | `npm run lint && npm run build` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| F-01 | Email/password register + login works | manual smoke | `npm run build` (type safety) | N/A |
| F-01 | Username captured and stored in profiles table | manual smoke | DB verification via `npm run db:studio` | N/A |
| F-02 | `POST /api/auth/mobile-token` returns token for valid bearer | manual smoke | curl test during dev | N/A |
| F-02 | `GET /api/auth/token-login?token=xxx` sets session cookie and redirects | manual smoke | Browser manual test | N/A |
| F-02 | Expired token returns error page | manual smoke | Browser manual test | N/A |
| F-03 | Reserved username rejected on form submit | manual smoke | Browser manual test | N/A |
| F-03 | Invalid username format rejected | manual smoke | Browser manual test | N/A |
| F-03 | Duplicate username rejected | manual smoke | Browser manual test | N/A |

### Sampling Rate
- **Per task commit:** `npm run lint` — catch type and lint errors
- **Per wave merge:** `npm run build` — full type-check and build
- **Phase gate:** Manual smoke test of all 6 success criteria before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] No test framework configured — this project has no jest/vitest/playwright setup
- [ ] Manual testing is the primary validation strategy for this phase
- [ ] Recommend adding `npm run typecheck` script: `"typecheck": "tsc --noEmit"` to `package.json` for automated type validation

*(Note: No automated test infrastructure exists. All behavioral verification is manual. Type safety via TypeScript is the primary automated safety net.)*

## Sources

### Primary (HIGH confidence)
- [https://nextjs.org/docs/app/api-reference/file-conventions/proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) — Full proxy.ts API, matcher config, Node.js runtime, migration from middleware.ts
- [https://better-auth.com/docs/authentication/email-password](https://better-auth.com/docs/authentication/email-password) — additionalFields config and signUp.email() client call
- [https://better-auth.com/docs/concepts/database](https://better-auth.com/docs/concepts/database) — databaseHooks user.create.after API
- [https://better-auth.com/docs/plugins/bearer](https://better-auth.com/docs/plugins/bearer) — Bearer plugin setup and getSession with Authorization header
- [https://better-auth.com/docs/plugins/one-time-token](https://better-auth.com/docs/plugins/one-time-token) — Built-in one-time token plugin (noted as alternative)
- [https://orm.drizzle.team/docs/select](https://orm.drizzle.team/docs/select) — Drizzle select with eq, and, gt operators
- Existing codebase: `src/db/schema.ts`, `src/lib/auth.ts`, `proxy.ts`, `src/app/(auth)/register/page.tsx`, `src/app/(dashboard)/layout.tsx`

### Secondary (MEDIUM confidence)
- [https://better-auth.com/docs/plugins/username](https://better-auth.com/docs/plugins/username) — Built-in username plugin exists but targets user table not profiles table
- [https://better-auth.com/docs/concepts/session-management](https://better-auth.com/docs/concepts/session-management) — Session token format (compact base64url + HMAC-SHA256 by default)

### Tertiary (LOW confidence)
- `auth.api.createSession()` exact method signature — inferred from pattern, not verified against v1.5.5 source
- `databaseHooks.user.create.after` receiving additionalFields values — inferred from docs, not confirmed by code inspection

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and configured
- Architecture: HIGH — patterns verified against official docs (Next.js 16 proxy.ts, better-auth databaseHooks, Drizzle ORM)
- Token flow implementation: MEDIUM — `auth.api.createSession()` method name unverified for v1.5.5; `verification` table reuse is CONTEXT discretion
- Pitfalls: HIGH — identified from schema inspection and known better-auth/Next.js behaviors

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable libraries, 30-day window)
