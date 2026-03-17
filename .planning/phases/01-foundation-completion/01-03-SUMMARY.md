---
phase: 01-foundation-completion
plan: 03
subsystem: auth
tags: [better-auth, next-js, api-routes, cookies, drizzle]

# Dependency graph
requires:
  - phase: 01-foundation-completion/plan-01
    provides: bearer plugin active, auth.api.getSession() works with Authorization header

provides:
  - POST /api/auth/mobile-token: one-time token generation for mobile-to-web login
  - GET /api/auth/token-login: token consumption, web session creation, redirect to dashboard
  - Login page: Vietnamese error messages for invalid-token and expired-token query params

affects: [mobile-app integration, web auth flow, user onboarding]

# Tech tracking
tech-stack:
  added: [better-call (serializeSignedCookie for cookie signing)]
  patterns:
    - verification table used as generic one-time token store with identifier prefixes
    - signed cookies created manually using serializeSignedCookie from better-call
    - useSearchParams wrapped in Suspense boundary for Next.js App Router compatibility

key-files:
  created:
    - src/app/api/auth/mobile-token/route.ts
    - src/app/api/auth/token-login/route.ts
  modified:
    - src/app/(auth)/login/page.tsx

key-decisions:
  - "Used Path B (direct DB insert + serializeSignedCookie) for session creation — auth.api has no createSession method; the signed cookie format from better-call matches what better-auth's getSignedCookie expects"
  - "mobile-token: prefix on verification.identifier avoids collision with better-auth's own verification records"
  - "Dual expired-token detection: first query with gt(expiresAt, now) for valid tokens; second query without time filter to distinguish expired from never-existed"
  - "Cookie name is environment-aware: __Secure-better-auth.session_token in production, better-auth.session_token in development"

patterns-established:
  - "Pattern: verification table as generic short-lived token store — use identifier prefix to namespace usage (mobile-token:, email-verify:, etc.)"
  - "Pattern: delete verification record before creating session to ensure single-use even on concurrent requests"

requirements-completed: [F-02]

# Metrics
duration: 15min
completed: 2026-03-17
---

# Phase 1 Plan 3: Mobile Token Login Summary

**Mobile-to-web token login flow using verification table one-time tokens and serializeSignedCookie from better-call for HMAC-signed session cookies**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-17T07:30:00Z
- **Completed:** 2026-03-17T07:45:00Z
- **Tasks:** 2/2
- **Files modified:** 3

## Accomplishments

- POST /api/auth/mobile-token validates Bearer session token and creates 5-minute one-time token in verification table
- GET /api/auth/token-login consumes token, distinguishes expired vs never-existed, creates web session with properly signed cookie, redirects to /dashboard
- Login page displays Vietnamese error messages for invalid-token and expired-token query params with Suspense wrapper

## Task Commits

1. **Task 1: Create mobile-token and token-login API routes** - `bdcd09c` (feat)
2. **Task 2: Add token error display to login page** - `85acacd` (feat)

**Plan metadata:** (pending — created after tasks)

## Files Created/Modified

- `src/app/api/auth/mobile-token/route.ts` - POST endpoint: validates Bearer session, inserts one-time token with 5min expiry into verification table
- `src/app/api/auth/token-login/route.ts` - GET endpoint: validates token (expired vs invalid), creates DB session, signs cookie with serializeSignedCookie, redirects to /dashboard
- `src/app/(auth)/login/page.tsx` - Added useSearchParams for error query param, TOKEN_ERROR_MESSAGES map, Suspense boundary wrapper

## Decisions Made

- **auth.api has no createSession method**: Checked `auth.api` route exports — only `getSession`, `revokeSession`, `listSessions`, `signIn*`, `signOut`, `signUp*`, `updateUser`, etc. No session creation endpoint exists. Used Path B (direct DB insert).
- **Cookie signing with serializeSignedCookie**: better-auth uses `serializeSignedCookie` from `better-call` to sign cookies with HMAC. The raw session token (UUID) is stored in the DB; the signed version is stored in the cookie. I replicate this to avoid infinite redirect loops.
- **mobile-token: prefix**: Namespaces the verification record so better-auth's own email verification logic can't accidentally match our records.

## Deviations from Plan

None - plan executed exactly as written. Path B was anticipated by the plan and explicitly documented. The `serializeSignedCookie` approach was discovered via better-auth source code inspection as specified in the plan's "CRITICAL" note.

## Issues Encountered

- `auth.api.createSession` does not exist — anticipated by the plan. Resolved by using Path B (direct DB insert + `serializeSignedCookie` from `better-call`).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 1 complete: auth config, bearer plugin, username registration, mobile token login all implemented
- Ready for Phase 2: Website CRUD, template system, create flow

---
*Phase: 01-foundation-completion*
*Completed: 2026-03-17*
