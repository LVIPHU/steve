---
phase: 2
slug: website-crud-templates
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-17
updated: 2026-03-17
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (installed in Plan 02-01 Task 1) |
| **Config file** | vitest.config.ts — created in Plan 02-01 Task 1 |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 2-01-T1 | 02-01 | 1 | F-08, F-09 | unit (TDD) | `npx vitest run tests/templates.test.ts tests/slugify.test.ts` | pending |
| 2-01-T2 | 02-01 | 1 | F-06, F-07 | typecheck | `npx tsc --noEmit 2>&1 \| head -20` | pending |
| 2-02-T1 | 02-02 | 2 | F-05, F-09 | typecheck | `npx tsc --noEmit 2>&1 \| head -20` | pending |
| 2-02-T2 | 02-02 | 2 | F-05 | typecheck | `npx tsc --noEmit 2>&1 \| head -20` | pending |
| 2-03-T1 | 02-03 | 2 | F-04 | typecheck | `npx tsc --noEmit 2>&1 \| head -20` | pending |
| 2-03-T2 | 02-03 | 2 | F-04, F-06, F-07 | typecheck | `npx tsc --noEmit 2>&1 \| head -20` | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — install vitest, configure path aliases (Plan 02-01 Task 1)
- [ ] `tests/templates.test.ts` — unit tests for TEMPLATES constant, suggestTemplate (Plan 02-01 Task 1)
- [ ] `tests/slugify.test.ts` — unit tests for generateSlug (Plan 02-01 Task 1)

### Test Coverage Notes

**Unit-tested (vitest):** Template system (F-08) and slug generation are pure functions with deterministic I/O — ideal TDD candidates. Template suggestion (F-09) keyword matching is tested via suggestTemplate.

**Type-checked only (tsc):** PATCH/DELETE API route (F-06, F-07), create form/action (F-05), list page (F-04), WebsiteCard (F-04, F-06, F-07). These are Next.js route handlers and React components that require a running server and database for integration testing. Type checking validates correct imports, function signatures, and Drizzle query shapes. Behavioral correctness is verified via manual testing (see Manual-Only Verifications below).

**Rationale for no DB integration tests in Phase 2:** The API routes are thin Drizzle CRUD wrappers with auth checks — the logic surface is small (select/update/delete with ownership filter). Adding integration tests would require test database setup, auth mocking, and HTTP request simulation — disproportionate infrastructure for 2 simple route handlers. The ownership check pattern (`eq(websites.userId, session.user.id)`) is enforced by TypeScript types and verified manually.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Template grid renders 5 cards in 3-col layout | F-08 | UI rendering requires browser | Navigate to /dashboard/websites/new, verify 5 template cards display in grid |
| Keyword suggestion banner appears on Note ID blur | F-09 | Requires real user interaction flow | Enter note ID containing "blog", blur field, verify suggestion banner appears |
| Status badge colors correct (green/gray/orange) | F-04 | Visual color assertion | Load /dashboard/websites, verify draft=gray, published=green, archived=orange |
| PATCH /api/websites/[id] renames website | F-07 | Requires running server + DB | Use card rename flow, verify name updates on page refresh |
| DELETE /api/websites/[id] removes website | F-07 | Requires running server + DB | Use card delete flow, verify card disappears on page refresh |
| PATCH /api/websites/[id] changes status | F-06 | Requires running server + DB | Use card status sub-menu, verify badge updates on page refresh |
| Create form submits and redirects to detail | F-05 | Full-stack flow | Fill form at /dashboard/websites/new, submit, verify redirect to /dashboard/websites/[id] |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify commands (vitest or tsc)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all test file dependencies
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending execution
