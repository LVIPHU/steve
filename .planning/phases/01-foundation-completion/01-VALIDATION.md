---
phase: 1
slug: foundation-completion
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no jest/vitest/playwright configured |
| **Config file** | none — Wave 0 adds typecheck script |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run lint && npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run lint && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green + manual smoke tests complete
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | F-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | F-01 | manual | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 1 | F-03 | manual | `npm run build` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 2 | F-02 | manual | `npm run build` | ❌ W0 | ⬜ pending |
| 1-02-02 | 02 | 2 | F-02 | manual | `npm run build` | ❌ W0 | ⬜ pending |
| 1-03-01 | 03 | 3 | F-01/F-03 | build | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Add `"typecheck": "tsc --noEmit"` to `package.json` scripts for automated type validation
- [ ] Verify `npm run lint` passes on baseline codebase before any changes

*No test framework will be installed for this phase — TypeScript type-checking and lint are the primary automated safety nets.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Email/password register with username | F-01 | No E2E framework | 1. Navigate to /register 2. Fill name/email/password/username 3. Submit 4. Verify redirect to /onboarding or /dashboard |
| Reserved username rejected | F-03 | No E2E framework | 1. Go to /register 2. Enter reserved username (e.g. "dashboard") 3. Verify error message displayed |
| Email/password login | F-01 | No E2E framework | 1. Navigate to /login 2. Enter valid credentials 3. Verify redirect to /dashboard |
| Mobile token generation | F-02 | No E2E framework | 1. Call POST /api/auth/mobile-token with valid Bearer session 2. Verify token returned |
| Token auto-login | F-02 | No E2E framework | 1. GET /api/auth/token-login?token=xxx 2. Verify session cookie set + redirect to /dashboard |
| Expired token error | F-02 | No E2E framework | 1. Use expired token 2. Verify error page shown |
| Dashboard protected | F-01 | No E2E framework | 1. Open incognito 2. Navigate to /dashboard 3. Verify redirect to /login |
| DB schema complete | F-01 | No E2E framework | 1. Run `npm run db:studio` 2. Verify websites + profiles tables exist with correct columns |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
