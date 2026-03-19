---
phase: 7
slug: html-first-ai-generation-and-lovable-style-editor
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
| **Config file** | `vitest.config.ts` (root) |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run test && npm run typecheck` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run test && npm run typecheck`
- **Before `/gsd:verify-work`:** Full suite must be green + `npm run build` succeeds
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 7-01-01 | 01 | 1 | SCHEMA-01 | typecheck | `npm run typecheck` | ✅ | ⬜ pending |
| 7-01-02 | 01 | 1 | HTML-GEN-01 | unit | `npm run test` (generate-html.test.ts) | ❌ W0 | ⬜ pending |
| 7-02-01 | 02 | 2 | ROUTE-01 | manual | curl draft URL → 404 | n/a | ⬜ pending |
| 7-02-02 | 02 | 2 | ROUTE-02 | manual | curl published URL → raw HTML | n/a | ⬜ pending |
| 7-03-01 | 03 | 2 | EDITOR-01 | typecheck | `npm run typecheck` | ✅ | ⬜ pending |
| 7-04-01 | 04 | 3 | LANDING-01 | typecheck | `npm run typecheck` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/app/api/ai/generate-html/generate-html.test.ts` — unit tests for `buildFreshSystemPrompt()`, `buildEditSystemPrompt()`, and markdown fence-stripping regex

*Existing infrastructure covers all other phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Public route returns 404 for draft | ROUTE-01 | Route Handler not testable in Vitest node env | `curl http://localhost:3000/{username}/{slug}` with draft → expect 404 |
| Public route returns raw HTML | ROUTE-02 | Same | curl with published website → expect Content-Type: text/html |
| iframe renders generated HTML | EDITOR-02 | Browser render required | Open editor, generate → iframe shows styled page |
| localStorage persistence | HTML-GEN-04 | Browser storage required | Generated app stores/retrieves data after reload |
| Dark mode toggle visible | UI-01 | Visual check | DarkModeToggle button visible in all 5 layouts |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
