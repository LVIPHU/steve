---
phase: 12
slug: migrate-snippet-library-from-daisyui-to-preline-ui
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm run test -- component-library` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~5 seconds (component-library suite) |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- component-library`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green + `npm run typecheck` pass
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| W0-threshold | 01 | 0 | SNIP-05 | unit | `npm run test -- component-library` | ❌ W0 | ⬜ pending |
| W0-daisy-guard | 01 | 0 | SNIP-06 | unit | `npm run test -- component-library` | ❌ W0 | ⬜ pending |
| 12-01-01 | 01 | 1 | SNIP-10 | grep | `grep -r "daisyui" src/lib/html-prompts.ts` | ✅ | ⬜ pending |
| 12-01-02 | 01 | 1 | SNIP-09 | typecheck | `npm run typecheck` | ✅ | ⬜ pending |
| 12-02-01 | 01 | 1 | SNIP-01,04 | unit | `npm run test -- component-library` | ✅ | ⬜ pending |
| 12-02-02 | 01 | 1 | SNIP-06 | unit | `npm run test -- component-library` | ✅ | ⬜ pending |
| 12-03-01 | 01 | 1 | SNIP-01,04 | unit | `npm run test -- component-library` | ✅ | ⬜ pending |
| 12-04-01 | 01 | 2 | SNIP-05 | unit | `npm run test -- component-library` | ✅ | ⬜ pending |
| 12-phase-gate | 01 | final | all | full suite | `npm run test && npm run typecheck` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/component-library/component-library.test.ts` line 27 — update `toBeGreaterThanOrEqual(40)` → `toBeGreaterThanOrEqual(100)` for 100+ snippet target
- [ ] `src/lib/component-library/component-library.test.ts` — add DaisyUI class remnant detector test: grep snippet HTML for known DaisyUI prefixes (`btn `, `badge `, `card `, `navbar-`, `hero `, `footer `, `stat-`, `mockup`, `daisy`, `daisyui`, `[class*="btn-"]`, `[class*="badge-"]`) and assert none found

*Note: Existing infrastructure covers structural and behavior tests. Only threshold update and DaisyUI guard are new requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark mode toggle works in generated HTML | Dark mode UX | Requires browser render | Open generated HTML in browser, click dark mode toggle, verify `class="dark"` on `<html>` and localStorage key set |
| Preline interactive behaviors work | Interactive JS | Requires browser + Preline JS CDN | Open generated HTML, test accordion expand/collapse, dropdown open/close, modal open/close |
| Generated website uses no DaisyUI visual patterns | Visual audit | Requires visual inspection | Generate a new website, open preview, confirm no DaisyUI-styled components visible |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
