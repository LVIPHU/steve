---
phase: 13
slug: multi-page-website-support
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.1.0 |
| **Config file** | `package.json` — `"test": "vitest run"` |
| **Quick run command** | `npm run typecheck && npx vitest run src/lib/ai-pipeline/` |
| **Full suite command** | `npm run typecheck && npm run test && npm run lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run typecheck && npm run test`
- **After every plan wave:** Run `npm run typecheck && npm run test && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 1 | MP-01 | type check | `npm run typecheck` | ✅ | ⬜ pending |
| 13-01-02 | 01 | 1 | MP-01 | type check | `npm run typecheck` | ✅ | ⬜ pending |
| 13-02-01 | 02 | 1 | MP-02 | type check | `npm run typecheck` | ✅ | ⬜ pending |
| 13-02-02 | 02 | 1 | MP-03 | type check | `npm run typecheck` | ✅ | ⬜ pending |
| 13-02-03 | 02 | 1 | MP-04 | unit | `npx vitest run src/lib/ai-pipeline/context-builder.test.ts` | ✅ extend | ⬜ pending |
| 13-03-01 | 03 | 2 | MP-05 | manual | N/A | N/A | ⬜ pending |
| 13-03-02 | 03 | 2 | MP-06 | unit | `npx vitest run src/lib/ai-pipeline/context-builder.test.ts` | ✅ extend | ⬜ pending |
| 13-04-01 | 04 | 2 | MP-07 | unit | `npx vitest run src/app/api/websites` | ❌ Wave 0 | ⬜ pending |
| 13-04-02 | 04 | 2 | MP-08 | manual | N/A | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/app/api/websites/[id]/export/route.test.ts` — stubs for MP-07 (fflate zipSync output contains index.html + other page .html files)
- [ ] `src/lib/ai-pipeline/context-builder.test.ts` — extend existing file: add test for relative link instruction in `buildUserMessage()` (MP-06)

*Existing test infrastructure: `context-builder.test.ts`, `design-agent.test.ts`, `reviewer.test.ts`, `html-prompts.test.ts` — can be extended without new setup.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Page Manager UI renders tabs, add/delete works | MP-05 | Browser UI component | Open editor, verify tab strip above iframe, click [+], enter name, confirm blank page loads |
| `/{username}/{slug}` serves `pages.index` | MP-08 | Requires live DB + published website | Publish website, visit URL without page segment, verify index page HTML serves |
| Public route `/{username}/{slug}/{page}` 404 on missing page | MP-03 | Requires live DB | Visit non-existent page path, verify 404 response |
| ZIP download produces valid files | MP-07 | Requires browser download | Click "Tải ZIP", verify .zip opens with correct .html files |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
