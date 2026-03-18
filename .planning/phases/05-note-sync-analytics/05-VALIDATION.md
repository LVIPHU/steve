---
phase: 5
slug: note-sync-analytics
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm run test -- --run` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --run`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 0 | F-18 | unit | `npm run test -- --run src/db` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | F-18 | integration | `npm run test -- --run src/app/api/sync` | ❌ W0 | ⬜ pending |
| 05-01-03 | 01 | 1 | F-18 | unit | `npm run test -- --run src/lib/sync` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 2 | F-19 | unit | `npm run test -- --run src/components/websites` | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 3 | S-03 | manual | see Manual-Only | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/db/__tests__/schema-sync.test.ts` — stubs for schema migration (syncStatus, lastSyncedAt)
- [ ] `src/app/api/sync/__tests__/trigger.test.ts` — stubs for POST /api/sync/trigger
- [ ] `src/lib/__tests__/sync-merge.test.ts` — stubs for section merge logic
- [ ] `src/components/websites/__tests__/poller.test.ts` — stubs for WebsitesPoller

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Umami analytics script embedded in published pages | S-03 | Requires browser inspection of rendered HTML | Open a published website, view page source, confirm `<script>` tag with Umami URL is present |
| In-app sync badge appears after sync | F-19 | Requires end-to-end mobile → API → UI flow | Trigger sync via API, refresh dashboard, verify badge shows on synced website card |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
