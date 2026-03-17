---
phase: 3
slug: ai-generation-publish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest (via Next.js built-in) |
| **Config file** | `jest.config.js` (Wave 0 creates if missing) |
| **Quick run command** | `npm test -- --testPathPattern=phase-03` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --testPathPattern=phase-03`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 0 | F-10 | install | `node -e "require('openai')"` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 1 | F-10 | integration | `npm test -- --testPathPattern=api/ai/generate` | ❌ W0 | ⬜ pending |
| 3-02-01 | 02 | 1 | F-11 | e2e-manual | Browser: generate → preview renders sections | n/a | ⬜ pending |
| 3-03-01 | 03 | 2 | F-16 | e2e-manual | `curl http://localhost:3000/[username]/[slug]` → 200 | n/a | ⬜ pending |
| 3-03-02 | 03 | 2 | F-16 | e2e-manual | Draft URL → 404 | n/a | ⬜ pending |
| 3-03-03 | 03 | 2 | F-16 | e2e-manual | Archived URL → "Website không còn hoạt động" | n/a | ⬜ pending |
| 3-04-01 | 04 | 2 | F-17 | e2e-manual | Published page has `<title>`, `<meta name="description">`, `<meta property="og:image">` | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install openai` — openai package not in package.json
- [ ] Add `OPENAI_API_KEY=` to `.env.example`
- [ ] `src/app/api/ai/generate/__tests__/route.test.ts` — stubs for F-10 API contract

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| AI generates valid AST preview | F-10, F-11 | Requires real OpenAI API key + browser state | Trigger generate, observe preview sections render |
| Public URL shows correct website | F-16 | Requires published DB record | Navigate to /[username]/[slug] after publish |
| Draft 404 | F-16 | Requires DB status check | Navigate to draft URL, expect 404 |
| Archived page shows message | F-16 | Requires DB status check | Navigate to archived URL, expect "Website không còn hoạt động" |
| OG image renders | F-17 | Requires browser/social preview | Open Graph debugger or curl opengraph-image endpoint |
| Slug editable before publish | F-17 | UI interaction | Edit slug input, publish, verify URL reflects edited slug |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
