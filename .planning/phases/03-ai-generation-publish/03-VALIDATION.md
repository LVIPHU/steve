---
phase: 3
slug: ai-generation-publish
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-18
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` (existing project config) |
| **Quick run command** | `npx vitest run src/lib/ast-utils.test.ts src/lib/ai-prompts.test.ts` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/lib/ast-utils.test.ts src/lib/ai-prompts.test.ts`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | F-10 | unit | `npx vitest run src/lib/ast-utils.test.ts src/lib/ai-prompts.test.ts` | Created in task | pending |
| 3-01-02 | 01 | 1 | F-10 | typecheck+install | `npx tsc --noEmit && npx tsx -e "import OpenAI from 'openai'; console.log('ok')"` | Created in task | pending |
| 3-02-01 | 02 | 2 | F-16 | typecheck | `npx tsc --noEmit` | Created in task | pending |
| 3-02-02 | 02 | 2 | F-16 | typecheck | `npx tsc --noEmit` | Created in task | pending |
| 3-03-01 | 03 | 3 | F-10, F-11 | typecheck | `npx tsc --noEmit` | Created in task | pending |
| 3-04-01 | 04 | 3 | F-16, F-17 | typecheck | `npx tsc --noEmit` | Created in task | pending |
| 3-04-02 | 04 | 3 | F-17 | typecheck | `npx tsc --noEmit` | Created in task | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `npm install openai` — openai package not in package.json (handled in Plan 01, Task 2)
- [ ] Add `OPENAI_API_KEY=` to `.env.example` (handled in Plan 01, Task 2)

*No separate Wave 0 plan needed — these are embedded in Plan 01 Task 2.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| AI generates valid AST preview | F-10, F-11 | Requires real OpenAI API key + browser state | Trigger generate, observe preview sections render |
| Note JSON passed when sourceNoteId exists | F-10 | Requires note API availability | Create website from note, generate, verify note content in output |
| Public URL shows correct website | F-16 | Requires published DB record | Navigate to /[username]/[slug] after publish |
| Draft 404 | F-16 | Requires DB status check | Navigate to draft URL, expect 404 |
| Archived page shows message | F-16 | Requires DB status check | Navigate to archived URL, expect "Website khong con hoat dong" |
| OG image renders | F-17 | Requires browser/social preview | Open Graph debugger or curl opengraph-image endpoint |
| Slug editable before publish | F-17 | UI interaction | Edit slug input, publish, verify URL reflects edited slug |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify commands
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 items covered by Plan 01 Task 2
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** ready
