---
phase: 4
slug: editor
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
| **Config file** | `vitest.config.ts` (exists) |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-W0-01 | 01 | 0 | F-14, S-01, S-05 | unit | `npm run test -- src/lib/editor-utils.test.ts` | ❌ W0 | ⬜ pending |
| 4-F12-01 | TBD | 1 | F-12 | unit | `npm run test -- src/lib/ast-utils.test.ts` | ✅ | ⬜ pending |
| 4-F12-02 | TBD | 1 | F-12 | unit | `npm run test -- src/lib/ast-utils.test.ts` | ✅ | ⬜ pending |
| 4-F14-01 | TBD | 2 | F-14 | unit | `npm run test -- src/lib/editor-utils.test.ts` | ❌ W0 | ⬜ pending |
| 4-S01-01 | TBD | 2 | S-01 | unit | `npm run test -- src/lib/editor-utils.test.ts` | ❌ W0 | ⬜ pending |
| 4-S05-01 | TBD | 2 | S-05 | unit | `npm run test -- src/lib/editor-utils.test.ts` | ❌ W0 | ⬜ pending |
| 4-F13-01 | TBD | 2 | F-13 | manual | manual-only | manual-only | ⬜ pending |
| 4-F15-01 | TBD | 2 | F-15 | manual | visual check in browser | manual-only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/editor-utils.ts` — pure utility functions: `applyManualOverride`, `reorderSections`, `updateTheme` (testable, extracted from EditorClient)
- [ ] `src/lib/editor-utils.test.ts` — unit tests for: `arrayMove` produces correct order (F-14), per-section regen preserves `manual_overrides` (S-01), theme color/font update writes to `ast.theme` (S-05)

*(Existing `src/lib/ast-utils.test.ts` covers F-12 / `resolveField` — no new stubs needed)*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Image upload API returns 401 for unauthenticated request | F-13 | Requires Supabase Storage mock — not worth mocking for one test | `curl -X POST /api/upload/image` without auth cookie; expect `{ "error": "Unauthorized" }` |
| Responsive preview classes applied correctly per mode | F-15 | Visual verification — CSS max-width container | Open editor, toggle Desktop/Tablet/Mobile, verify preview narrows to full/768px/390px |
| Unsaved changes dialog appears on back navigation | F-12 | Requires browser interaction / navigation event | Make an edit, click Back button; verify dialog "Bạn có thay đổi chưa lưu" appears |
| Toast "Đã lưu" appears and disappears after 2s | F-12 | Requires timed browser interaction | Click Save; verify toast appears then auto-dismisses |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
