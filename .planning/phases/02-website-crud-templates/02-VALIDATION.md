---
phase: 2
slug: website-crud-templates
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (recommended — no test framework currently in project) |
| **Config file** | vitest.config.ts — Wave 0 installs |
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

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | F-04 | integration | `npx vitest run src/__tests__/websites-list.test.ts` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01 | 1 | F-05 | integration | `npx vitest run src/__tests__/website-create.test.ts` | ❌ W0 | ⬜ pending |
| 2-01-03 | 01 | 2 | F-06 | unit | `npx vitest run src/__tests__/template-system.test.ts` | ❌ W0 | ⬜ pending |
| 2-01-04 | 01 | 2 | F-07 | unit | `npx vitest run src/__tests__/template-suggestion.test.ts` | ❌ W0 | ⬜ pending |
| 2-02-01 | 02 | 1 | F-08 | integration | `npx vitest run src/__tests__/website-mutations.test.ts` | ❌ W0 | ⬜ pending |
| 2-02-02 | 02 | 2 | F-09 | integration | `npx vitest run src/__tests__/website-status.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/websites-list.test.ts` — stubs for F-04 (list websites)
- [ ] `src/__tests__/website-create.test.ts` — stubs for F-05 (create website)
- [ ] `src/__tests__/template-system.test.ts` — stubs for F-06 (template display)
- [ ] `src/__tests__/template-suggestion.test.ts` — stubs for F-07 (keyword suggestion)
- [ ] `src/__tests__/website-mutations.test.ts` — stubs for F-08 (rename/delete)
- [ ] `src/__tests__/website-status.test.ts` — stubs for F-09 (status changes)
- [ ] `vitest.config.ts` — install vitest if no test framework detected

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Template grid renders correctly in browser | F-06 | UI rendering requires browser | Navigate to /dashboard/websites/new, verify 5 template cards display |
| Keyword suggestion highlights correct template | F-07 | Requires real user interaction flow | Enter note ID with keywords, blur field, verify suggestion appears |
| Status badge colors correct | F-04 | Visual assertion | Load /dashboard/websites, verify draft=gray, published=green, archived=muted |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
