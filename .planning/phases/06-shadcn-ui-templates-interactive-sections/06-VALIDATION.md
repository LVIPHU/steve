---
phase: 6
slug: shadcn-ui-templates-interactive-sections
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm run test -- --run` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --run`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 01 | 1 | Interactive sections | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 6-01-02 | 01 | 1 | Flashcard flip | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 6-01-03 | 01 | 1 | Checklist persist | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 6-02-01 | 02 | 2 | Theme toggle | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |
| 6-02-02 | 02 | 2 | Add section flow | unit | `npm run test -- --run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/sections/interactive.test.tsx` — stubs for interactive section components
- [ ] `src/__tests__/sections/flashcard.test.tsx` — flashcard flip animation tests
- [ ] `src/__tests__/sections/checklist.test.tsx` — checklist localStorage persistence tests
- [ ] `src/__tests__/theme/theme-toggle.test.tsx` — dark mode toggle tests

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 3D flashcard flip animation | UI-SPEC interactive | Animation timing hard to automate | Flip card, verify smooth 3D rotation with perspective |
| Dark mode SSR no-flash | UI-SPEC theme | Requires real browser | Hard refresh page, verify no flash of wrong theme |
| Drag-and-drop reorder | UI-SPEC sections | Pointer events hard to unit test | Drag section handle, verify reorder updates DB |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
