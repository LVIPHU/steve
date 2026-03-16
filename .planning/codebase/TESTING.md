# Testing

## Current Status

**No testing infrastructure exists.** The project has no test files, no test runner configuration, and no test dependencies in `package.json`.

## Recommended Setup

**Framework:** Vitest + @testing-library/react

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom
```

## Suggested Test File Location

Co-locate with source files:
```
src/
  components/
    ui/
      button.tsx
      button.test.tsx   ← co-located
  lib/
    auth.ts
    auth.test.ts
```

## Mocking Patterns Needed

- `authClient` from `@/lib/auth-client` — mock `useSession`, `signIn`, `signOut`
- `next/navigation` — mock `redirect`, `useRouter`
- `framer-motion` / `motion` — mock animation wrappers
- Drizzle DB — mock `db` client for server action tests

## Priority Test Areas

1. Auth flows (login, register, session handling)
2. Server Actions (website CRUD, status updates)
3. Route protection (middleware/proxy behavior)
4. UI component behavior

## Coverage Target

Not currently enforced. Recommended: >80% for business logic (actions, lib utilities).
