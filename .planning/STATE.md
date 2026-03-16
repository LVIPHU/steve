# STATE.md — Project Memory

## Project

**Name:** Website Generator
**Initialized:** 2026-03-16
**Status:** Planning complete — ready to execute

## Current Phase

**Phase:** 0 (not started)
**Next action:** `/gsd:plan-phase 1`

## What's Built

| Layer | Status | Notes |
|---|---|---|
| Auth UI (login/register) | ✓ Done | better-auth, email/password, Google OAuth |
| Dashboard layout | ✓ Done | nav, layout shell |
| DB Schema | ✓ Done | users, profiles, websites, sessions |
| Global CSS / Tailwind | ✓ Done | dark mode vars, base styles |
| Codebase map | ✓ Done | `.planning/codebase/` |

## What's Left (by phase)

- **Phase 1:** Token login, username enforcement, reserved word validation
- **Phase 2:** Website CRUD, template system, create flow
- **Phase 3:** AI generation, publish route, SEO
- **Phase 4:** Visual editor, dnd-kit, image upload
- **Phase 5:** Note sync API, Umami analytics

## Key Decisions

- AI provider: OpenAI GPT-4o
- Notes: NOT stored in this DB — passed via JSON at generation time
- Auth: email/password + token from mobile app
- No Freemium / no plan tiers in v1
- Website AST (JSON, not HTML) — enables editor field-level manipulation
- `manual_overrides` pattern: AI content and user edits tracked separately

## Milestone History

| Date | Event |
|---|---|
| 2026-03-16 | Project initialized, codebase mapped, planning complete |
