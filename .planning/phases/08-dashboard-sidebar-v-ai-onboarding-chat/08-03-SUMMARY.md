---
phase: 08-dashboard-sidebar-v-ai-onboarding-chat
plan: 03
subsystem: ui
tags: [react, nextjs, state-machine, chat, onboarding]

# Dependency graph
requires:
  - phase: 08-01
    provides: websites table with chatHistory JSONB, DB schema cleanup

provides:
  - POST /api/websites endpoint (auth-guarded, slug generation, 201 response)
  - Dashboard AI onboarding chat (2-question flow, state machine, no AI endpoint needed)
  - OnboardingChat client component with bot greeting, topic/goal questions, summary + CTA

affects: [08-04, editor, dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - State machine chat using ChatPhase union type (greeting/waiting_q1/waiting_q2/confirm/creating)
    - MessageBubble at module scope to prevent re-render animation issues (same as editor-client.tsx)
    - Thin Server Component page.tsx wrapping "use client" OnboardingChat component

key-files:
  created:
    - src/app/api/websites/route.ts
    - src/app/(dashboard)/dashboard/onboarding-chat.tsx
  modified:
    - src/app/(dashboard)/dashboard/page.tsx

key-decisions:
  - "OnboardingChat defined as separate file (onboarding-chat.tsx) not inline in page.tsx — keeps server/client boundary clean"
  - "Bot messages hardcoded Vietnamese text (no AI call) — conversation is a simple state machine"
  - "goal captured via text variable in waiting_q2 handler to avoid closure issues with setState + setTimeout"
  - "Dashboard page.tsx stripped of session check — auth enforced by (dashboard)/layout.tsx at layout level"

patterns-established:
  - "ChatPhase state machine: greeting -> waiting_q1 -> waiting_q2 -> confirm -> creating"
  - "POST /api/websites pattern: auth check, JSON body parse, name validation, generateSlug, db.insert, return { id, slug } 201"

requirements-completed: [P8-05, P8-06]

# Metrics
duration: 2m 13s
completed: 2026-03-19
---

# Phase 08 Plan 03: AI Onboarding Chat Summary

**Client-side 2-question chat wizard at /dashboard/ that creates a website via POST /api/websites and redirects to the HTML editor with an encoded prompt**

## Performance

- **Duration:** 2m 13s
- **Started:** 2026-03-19T10:42:25Z
- **Completed:** 2026-03-19T10:44:38Z
- **Tasks:** 2/2
- **Files modified:** 3

## Accomplishments

- POST /api/websites endpoint creates website records with auth check, slug generation, returns { id, slug } with 201
- Dashboard page replaced with conversational onboarding chat (2-question state machine, no AI endpoint needed)
- CTA button creates website in DB and redirects to /dashboard/websites/{id}/edit?prompt=... with encoded topic+goal prompt

## Task Commits

Each task was committed atomically:

1. **Task 1: Create POST /api/websites endpoint** - `fd0b582` (feat)
2. **Task 2: Replace dashboard page with AI onboarding chat** - `f3dcda4` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/app/api/websites/route.ts` - POST handler: auth guard, name validation, generateSlug, db.insert, 201 response
- `src/app/(dashboard)/dashboard/onboarding-chat.tsx` - "use client" chat state machine with MessageBubble, 2-question flow, CTA
- `src/app/(dashboard)/dashboard/page.tsx` - Thin server wrapper rendering OnboardingChat

## Decisions Made

- Dashboard page.tsx stripped of its own session check — auth is enforced by `(dashboard)/layout.tsx` at layout level, redundant check removed
- Bot messages use hardcoded Vietnamese text (no AI call) — conversation is a pure state machine
- `goal` captured via local `text` variable in `waiting_q2` handler to avoid React closure issues with `setGoal` + `setTimeout`
- `OnboardingChat` extracted to `onboarding-chat.tsx` (not inline in `page.tsx`) to keep server/client boundary clean

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- POST /api/websites endpoint ready for any other client needing website creation
- Dashboard onboarding flow complete — users are guided from /dashboard to /edit with a pre-filled prompt
- Phase 08-04 can build the websites list page and sidebar navigation on top of this foundation

---
*Phase: 08-dashboard-sidebar-v-ai-onboarding-chat*
*Completed: 2026-03-19*
