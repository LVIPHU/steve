---
phase: 11
slug: reviewer-pipeline-rewire-ui-update
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | vitest.config.ts (existing) |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~5 seconds |

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
| 11-01-01 | 01 | 1 | PIPE-10 | unit | `npm run test -- reviewer` | ❌ W0 | ⬜ pending |
| 11-01-02 | 01 | 1 | PIPE-16 | unit | `npm run typecheck` | ✅ | ⬜ pending |
| 11-01-03 | 01 | 1 | PIPE-17 | unit | `npm run typecheck` | ✅ | ⬜ pending |
| 11-02-01 | 02 | 2 | PIPE-14, PIPE-15 | unit | `npm run test -- pipeline` | ❌ W0 | ⬜ pending |
| 11-02-02 | 02 | 2 | PIPE-11, PIPE-12, PIPE-13 | unit | `npm run test -- pipeline` | ❌ W0 | ⬜ pending |
| 11-02-03 | 02 | 2 | PIPE-19 | typecheck | `npm run typecheck` | ✅ | ⬜ pending |
| 11-02-04 | 02 | 2 | PIPE-18 | manual | — | ✅ | ⬜ pending |
| 11-02-05 | 02 | 2 | PIPE-20 | manual | — | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/ai-pipeline/reviewer.test.ts` — stubs for PIPE-10 (ReviewResult schema, score range, dimension sum)
- [ ] `src/lib/ai-pipeline/index.test.ts` — stubs for PIPE-14, PIPE-15 (fresh 7-step, edit 4-step, conditional refine)

*Existing `npm run test` infrastructure covers all other requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Vercel plan tier (Hobby vs Pro) | PIPE-18 | Requires Vercel dashboard access | Check vercel.com → Project Settings → Functions tab → Max Duration |
| Calibration pass: ≥10 websites scored | PIPE-20 | Requires live OpenAI calls + .calibration.jsonl review | Run generation 10+ times with diverse prompts, inspect .calibration.jsonl for score distribution |
| refine step visible when score < 75 | PIPE-11 | Requires browser + live generation with low-quality prompt | Generate with a vague prompt that produces low-score HTML, verify refine step appears in chat |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
