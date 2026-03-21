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
| **Config file** | `package.json` (scripts.test) |
| **Quick run command** | `npm run test -- component-library` |
| **Full suite command** | `npm run test && npm run typecheck` |
| **Estimated runtime** | ~5 seconds (component-library suite) |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- component-library`
- **After every plan wave:** Run `npm run test && npm run typecheck`
- **Before `/gsd:verify-work`:** Full suite must be green + `npm run typecheck` pass
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| W0-threshold | 01 | 0 | SNIP-07 | unit | `npm run test -- component-library` | ❌ W0 | ⬜ pending |
| W0-daisy-guard | 01 | 0 | SNIP-01,06 | unit | `npm run test -- component-library` | ❌ W0 | ⬜ pending |
| W0-dark-coverage | 01 | 0 | SNIP-05 | unit | `npm run test -- component-library` | ❌ W0 | ⬜ pending |
| W0-new-files | 01 | 0 | SNIP-03 | unit | `npm run test -- component-library` | ❌ W0 | ⬜ pending |
| 12-01-task1 | 01 | 1 | SNIP-04 | grep | `grep -r "daisyui\|btn-primary\|card-body\|navbar-start" src/lib/html-prompts.ts` | ✅ | ⬜ pending |
| 12-01-task2 | 01 | 1 | SNIP-01,02 | unit | `npm run test -- component-library` | ✅ | ⬜ pending |
| 12-02-task1 | 02 | 2 | SNIP-01,02 | unit | `npm run test -- component-library` | ✅ | ⬜ pending |
| 12-02-task2 | 02 | 2 | SNIP-03,07 | unit | `npm run test -- component-library` | ✅ | ⬜ pending |
| 12-phase-gate | 02 | final | SNIP-08 | full suite | `npm run test && npm run typecheck` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Changes to `src/lib/component-library/component-library.test.ts`:

- [ ] Update: `"library has at least 40 snippets"` → `toBeGreaterThanOrEqual(100)` (SNIP-07)
- [ ] New test: DaisyUI remnant detector — iterate ALL_SNIPPETS, assert none contain DaisyUI patterns:
  ```typescript
  const daisyUIPatterns = [
    'btn-primary', 'btn-secondary', 'btn-outline', 'btn-ghost', 'btn-accent',
    'card-body', 'card-title', 'card-actions',
    'navbar-start', 'navbar-center', 'navbar-end',
    'hero-content', 'hero min-h',
    'badge-primary', 'badge-outline', 'badge-secondary', 'badge-accent',
    'bg-base-100', 'bg-base-200', 'bg-base-300',
    'text-base-content',
    'stat-value', 'stat-title', 'stat-desc',
    'footer-center', 'footer footer',
    'menu menu-horizontal', 'dropdown-content',
    'progress progress-primary',
    'checkbox checkbox-primary',
  ];
  ```
- [ ] New test: dark mode coverage — at least 80% of snippets include `dark:` prefix
- [ ] Create stubs: `src/lib/component-library/snippets/forms.ts`, `ui-elements.ts`, `cta.ts`, `media.ts`, `pricing.ts`, `notifications.ts`
- [ ] Update: `src/lib/component-library/snippets/index.ts` — add 6 new imports + spread into ALL_SNIPPETS

*These must pass before Wave 1 snippet rewrites begin.*

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
