---
phase: 10
slug: design-agent-context-builder-prompt-rewrite
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
| **Config file** | `vitest.config.ts` (root) |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | PIPE-04 | unit | `npm run test -- design-agent` | ❌ W0 | ⬜ pending |
| 10-01-02 | 01 | 1 | PIPE-04 | unit | `npm run test -- design-agent` | ❌ W0 | ⬜ pending |
| 10-01-03 | 01 | 1 | PIPE-04 | unit | `npm run test -- design-agent` | ❌ W0 | ⬜ pending |
| 10-02-01 | 02 | 2 | PIPE-06, PIPE-08, PIPE-09 | unit | `npm run test -- context-builder` | ❌ W0 | ⬜ pending |
| 10-02-02 | 02 | 2 | PIPE-07 | unit | `npm run test -- html-prompts` | ✅ (update) | ⬜ pending |
| 10-02-03 | 02 | 2 | PIPE-08, PIPE-09 | unit | `npm run test -- context-builder` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/ai-pipeline/design-agent.test.ts` — stubs for PIPE-04 (schema shape, FALLBACK_DESIGN type)
- [ ] `src/lib/ai-pipeline/context-builder.test.ts` — stubs for PIPE-06, PIPE-08, PIPE-09

*`src/lib/html-prompts.test.ts` EXISTS — 11 tests currently passing. 4 assertions about template hints (LANDING PAGE, PORTFOLIO, DASHBOARD, BLOG) will break after rewrite and must be updated in Plan 10-02.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fitness prompt produces bold-dark preset with non-blue primary | PIPE-05 | Requires live GPT-4o-mini API call | Generate a website with "fitness tracking app" prompt, inspect DesignResult in logs |
| Food prompt produces warm-organic preset | PIPE-05 | Requires live GPT-4o-mini API call | Generate with "cooking recipe website" prompt, inspect DesignResult |
| Generated HTML has CSS variables in style block | PIPE-06 | Requires live GPT-4o generation | Inspect generated HTML source for `--color-primary`, `--color-secondary` in `<style>` tag |
| Google Fonts @import appears first in style block | PIPE-06 | Requires live generation | Inspect HTML: `<style>` block must start with `@import url('https://fonts.googleapis.com/css2?...` |
| Edit mode preserves existing colors | PIPE-09 | Requires editor interaction | Open existing colored website in editor, submit an edit prompt, verify colors unchanged |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
