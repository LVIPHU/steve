# Codebase Concerns

## Tech Debt

- **Placeholder content:** Default Next.js metadata and homepage (`src/app/page.tsx`) not yet replaced
- **Prepared statements disabled:** `prepare: false` in DB client (required for Supabase Transaction Pool, but limits query optimization)
- **Missing input validation:** No schema validation library (Zod/Valibot) on form inputs or Server Actions
- **Experimental auth features:** `experimental.joins: true` in better-auth config — may change in future releases
- **Hardcoded env example:** `.env.example` shows real variable names — ensure no real secrets leaked

## Security Issues

- **Non-HTTPS references:** `BETTER_AUTH_URL=http://localhost:3000` in examples — must be HTTPS in production
- **Missing CSRF validation:** Server Actions rely on Next.js built-in CSRF protection; custom API routes need explicit validation
- **OAuth without scope restriction:** Google OAuth configured without explicit scope list — defaults may be too broad
- **User email in client session:** `authClient.useSession()` exposes email to client-side — acceptable but should be documented

## Performance Concerns

- **Unindexed JSONB columns:** `content` and `seoMeta` on `websites` table stored as JSONB with no indexes — queries against these will be slow at scale
- **No connection pooling config:** Supabase Transaction Pool mode is set, but pool size not tuned
- **Short session cache TTL:** 5-minute `cookieCache` means frequent DB hits for active users

## Fragile Areas

- **Auth layout without error boundary:** `(auth)` route group has no error handling — auth failures will show raw Next.js error page
- **No CSS fallback:** Tailwind v4 uses modern CSS features; no fallback for older browsers defined
- **No retry logic in auth forms:** Network failures during login/register show generic errors with no recovery path
- **Single-layer proxy protection:** `proxy.ts` cookie check is fast but not authoritative — relies on page-level session validation being present everywhere

## Missing Critical Features

- **No logging/monitoring:** No structured logging, no error tracking (Sentry etc.), no observability
- **No rate limiting:** Auth endpoints (`/api/auth/*`) have no rate limiting — vulnerable to brute force
- **No form validation framework:** Forms use manual `useState` validation — inconsistent, error-prone at scale
- **No password reset flow:** better-auth supports it but not yet wired up in the UI
- **No email verification:** `emailVerified` column exists in schema but verification flow not implemented

## Test Gaps (All High Priority)

- No auth flow tests (login, register, session persistence)
- No database integration tests
- No API route tests
- No component tests
- No E2E tests

## Dependency Risks

| Package | Risk | Notes |
|---------|------|-------|
| `@base-ui/react` | Medium | New/untested library, limited community |
| `better-auth` | Low-Medium | `experimental.joins` flag in use |
| `motion` | Low | Framer Motion successor — API mostly stable |
