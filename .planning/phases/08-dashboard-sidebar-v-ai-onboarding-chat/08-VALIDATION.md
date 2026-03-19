---
phase: 8
slug: dashboard-sidebar-v-ai-onboarding-chat
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run test && npm run typecheck` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run test && npm run typecheck`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 8-01-01 | 01 | 1 | SIDEBAR | unit | `npm run test` | ✅ | ⬜ pending |
| 8-01-02 | 01 | 1 | SIDEBAR | build | `npm run typecheck` | ✅ | ⬜ pending |
| 8-02-01 | 02 | 2 | ONBOARDING | unit | `npm run test` | ✅ | ⬜ pending |
| 8-02-02 | 02 | 2 | ONBOARDING | build | `npm run typecheck` | ✅ | ⬜ pending |
| 8-03-01 | 03 | 3 | CLEANUP | unit | `npm run test` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sidebar renders correctly on desktop/mobile | SIDEBAR | Visual UI test | Open dashboard, verify sidebar visible on desktop, hidden (Sheet) on mobile |
| AI Onboarding chat flow completes | ONBOARDING | Interactive bot flow | Sign up fresh, verify bot greeting shows, answer 2 questions, confirm redirect to editor |
| Editor page covers sidebar | SIDEBAR | Layout z-index | Open editor, verify sidebar is hidden behind editor full-screen |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
