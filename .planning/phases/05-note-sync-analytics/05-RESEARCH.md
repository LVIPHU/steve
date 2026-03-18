# Phase 5: Note Sync + Analytics - Research

**Researched:** 2026-03-18
**Domain:** Next.js Route Handlers, Drizzle ORM schema migration, background tasks via `after()`, polling with `router.refresh()`, Umami analytics embed
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Sync authentication:**
- Mobile app gửi session token trong `Authorization: Bearer <token>` header
- better-auth verify token — không cần thêm infrastructure mới
- Payload: `{ noteId: string, noteContent: {...} }`
- Tìm website theo `websites.sourceNoteId = noteId`
- Nếu nhiều website có cùng sourceNoteId → cập nhật **tất cả**
- Response: `{ ok: boolean, updatedCount: number }`

**Sync AI behavior:**
- Chạy lại GPT-4o với noteContent mới, giống flow generate ban đầu (`buildUserPrompt`)
- Dùng `after()` từ `next/server` — API trả về `{ ok, updatedCount }` ngay lập tức, AI chạy background
- Merge strategy: giữ cấu trúc section cũ (id, type, thứ tự). Chỉ cập nhật `ai_content` theo index. Section mới từ AI bị bỏ qua nếu không có section id khớp.
- `manual_overrides` không bao giờ bị ghi đè
- Khi AI thất bại: lưu `syncStatus = 'sync_failed'` vào DB, content không thay đổi
- **DB fields mới cần thêm vào `websites` table:**
  - `syncStatus: text — 'idle' | 'syncing' | 'synced' | 'sync_failed'` (default: 'idle')
  - `lastSyncedAt: timestamp` (nullable)

**Sync notification (S-03):**
- Badge trên mỗi website card trong `/dashboard/websites`
- Khi `lastSyncedAt` có giá trị: hiện `✔ Sync lúc HH:MM` (luôn hiện, không tự ẩn)
- Khi `syncStatus = 'sync_failed'`: hiện badge đỏ `⚠ Sync thất bại`
- Polling: Dashboard list tự động poll mỗi **30 giây** bằng `router.refresh()` từ Next.js
- Polling chỉ chạy ở trang `/dashboard/websites`

**Umami analytics (F-19):**
- Config qua env var: `NEXT_PUBLIC_UMAMI_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- Nhúng script **chỉ trong public page** `(public)/[username]/[slug]/page.tsx`
- Nếu `NEXT_PUBLIC_UMAMI_URL` không có → skip, không render script tag
- Script tag: `<script defer src="{UMAMI_URL}/script.js" data-website-id="{WEBSITE_ID}" />`

### Claude's Discretion
- Chi tiết implementation của `after()` (đã xác nhận dùng `after` từ `next/server`)
- Cách poll 30s: `setInterval` + `router.refresh()` trong Client Component wrapper
- Exact design của badge sync trên card (màu sắc, vị trí, format timestamp)
- Migration strategy cho 2 field DB mới (syncStatus, lastSyncedAt)

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| F-18 | `POST /api/sync/trigger` — nhận note update, cập nhật ai_content, giữ manual_overrides | `after()` from `next/server` for background AI; `updateSectionAiContent()` for merge; `auth.api.getSession()` for bearer auth verification |
| F-19 | Umami self-hosted embed trong website được publish | Script tag via `NEXT_PUBLIC_UMAMI_URL` env var; conditional render in public page Server Component |
| S-03 | Thông báo trong app khi note sync xảy ra | `syncStatus`/`lastSyncedAt` DB fields; Client Component wrapper with `setInterval` + `router.refresh()` for 30s polling |
</phase_requirements>

---

## Summary

Phase 5 covers two independent features: a note sync API (`POST /api/sync/trigger`) and Umami analytics embedding. Both are self-contained and can be planned as separate tasks within a single wave.

The sync API extends the existing AI generation flow. The key technical decision (locked) is using `after()` from `next/server` to return immediately while AI runs in the background. This is the **project-skill-documented pattern** (`server-after-nonblocking` in `vercel-react-best-practices`) and is already confirmed available in Next.js 16. The AI merge logic uses `updateSectionAiContent()` from `editor-utils.ts` (already tested), applied per-section matched by index against the existing AST.

The dashboard polling uses a lightweight Client Component wrapper that runs `setInterval(() => router.refresh(), 30_000)` only on the `/dashboard/websites` page. The existing `WebsiteCard` component needs two new props (`syncStatus`, `lastSyncedAt`) to render the badge. The `Website` type from `@/db/schema` is auto-inferred by Drizzle — once schema fields are added, `WebsiteCard` props type is satisfied automatically.

**Primary recommendation:** Implement in two plans: (1) DB schema + sync API + polling + badge, (2) Umami embed. The schema migration is the critical path dependency for everything else in Plan 1.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next/server` (`after`) | Next.js 16.1.6 (built-in) | Non-blocking background AI execution | Project skill `server-after-nonblocking` confirms this pattern; avoids Vercel `waitUntil` complexity |
| `drizzle-orm` | 0.45.1 (existing) | Add 2 columns to `websites` table via `db:push` | Already project ORM, no migration file needed in dev |
| `openai` | 6.32.0 (existing) | GPT-4o re-run for sync | Same client used in generate/regenerate routes |
| `vitest` | 4.1.0 (existing) | Unit tests for merge logic | Already configured with `@` alias |

### No New Packages Required
All Phase 5 features are implementable with the existing dependency set. No `npm install` needed.

---

## Architecture Patterns

### Recommended File Structure (new files only)
```
src/app/api/sync/
└── trigger/
    └── route.ts              # POST handler — auth, lookup, after(), response

src/components/
└── websites-poller.tsx       # "use client" wrapper — setInterval + router.refresh()
```

### Modified Files
```
src/db/schema.ts              # Add syncStatus + lastSyncedAt to websites table
src/components/website-card.tsx  # Add SyncBadge using new Website fields
src/app/(dashboard)/dashboard/websites/page.tsx  # Wrap with WebsitesPoller
src/app/(public)/[username]/[slug]/page.tsx  # Add Umami script tag
```

---

### Pattern 1: `after()` for Background AI in Route Handler

**What:** Call `after()` before returning the response. The callback runs after the response is flushed — no streaming, no blocking the client.

**When to use:** Any time AI work should not delay the HTTP response. This is the locked decision for sync.

```typescript
// Source: .claude/skills/vercel-react-best-practices/rules/server-after-nonblocking.md
// + Next.js docs https://nextjs.org/docs/app/api-reference/functions/after
import { after } from 'next/server'

export async function POST(request: Request) {
  // 1. Auth + lookup (synchronous part)
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Mark as syncing (synchronous DB write)
  await db.update(websites).set({ syncStatus: 'syncing' }).where(...)

  // 3. Schedule AI work — runs AFTER response is sent
  after(async () => {
    try {
      // run GPT-4o, merge ai_content, update DB
      await db.update(websites).set({ syncStatus: 'synced', lastSyncedAt: new Date(), content: mergedAst })
    } catch {
      await db.update(websites).set({ syncStatus: 'sync_failed' })
    }
  })

  // 4. Return immediately
  return Response.json({ ok: true, updatedCount: N })
}
```

**Important:** `after()` runs even if the response fails. Keep `try/catch` inside the callback and write `sync_failed` on error.

---

### Pattern 2: Section Merge by Index (Locked Strategy)

**What:** AI returns new sections; merge into existing AST by position (index 0 → index 0), not by id. Existing section `id`, `type`, `manual_overrides` are preserved. Only `ai_content` is replaced.

**Why index not id:** GPT-4o does not know the existing section IDs. Matching by index is the only reliable strategy. CONTEXT.md locked this decision.

```typescript
// Merge new AI sections into existing AST
function mergeAiSectionsIntoAst(existing: WebsiteAST, newAst: WebsiteAST): WebsiteAST {
  const merged = existing.sections.map((section, i) => {
    const newSection = newAst.sections[i]
    if (!newSection) return section  // AI returned fewer sections — keep original
    return {
      ...section,                      // preserve id, type, manual_overrides
      ai_content: newSection.ai_content, // only replace ai_content
    }
  })
  return { ...existing, sections: merged }
}
```

This uses the same immutable-merge principle as `updateSectionAiContent()` in `editor-utils.ts`.

**Note on `updateSectionAiContent()`:** That function takes a single `sectionId`. For bulk index-based merge, write the merge loop inline in the route handler — do not try to call `updateSectionAiContent()` N times (it does ID matching, not index matching).

---

### Pattern 3: 30-Second Polling Client Component

**What:** A `"use client"` wrapper that calls `router.refresh()` every 30 seconds. The Server Component page becomes a child — it re-fetches on each refresh automatically.

```typescript
// src/components/websites-poller.tsx
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WebsitesPoller({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 30_000)
    return () => clearInterval(id)
  }, [router])

  return <>{children}</>
}
```

Usage in `websites/page.tsx`:
```tsx
// Wrap the grid only — not the full page layout
<WebsitesPoller>
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
    {userWebsites.map(...)}
  </div>
</WebsitesPoller>
```

**Why `router.refresh()` not SWR/polling fetch:** The website list is a Server Component. `router.refresh()` re-runs the server component and re-fetches from DB — exactly what's needed. No additional API endpoint required.

---

### Pattern 4: Sync Badge on WebsiteCard

`WebsiteCard` already receives `website: Website` (Drizzle inferred type). After schema migration, `website.syncStatus` and `website.lastSyncedAt` are available on the same type — no new prop interface changes needed.

```typescript
// Inside WebsiteCard, at module scope (per rerender-no-inline-components rule)
function SyncBadge({ syncStatus, lastSyncedAt }: { syncStatus: string | null, lastSyncedAt: Date | null }) {
  if (syncStatus === 'sync_failed') {
    return <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Sync that bai</span>
  }
  if (lastSyncedAt) {
    const time = lastSyncedAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    return <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Synced {time}</span>
  }
  return null
}
```

Place `<SyncBadge>` in `<CardContent>` next to the existing `<StatusBadge>`.

---

### Pattern 5: Umami Script in Public Page Server Component

The public page is already a Server Component. `NEXT_PUBLIC_` env vars are accessible in server components (and client components). Conditional render is straightforward:

```tsx
// In PublicWebsitePage, after the existing font link tag
{process.env.NEXT_PUBLIC_UMAMI_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
  <script
    defer
    src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
    data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
  />
)}
```

**Placement:** Inside the outermost `<>` fragment, alongside the existing `<link rel="stylesheet">` tag for Google Fonts — before the theme wrapper `<div>`.

---

### Pattern 6: Schema Migration with `db:push`

Two new columns on `websites` table. Because this is development (no production data to protect), `npm run db:push` is safe and avoids generating a migration file.

```typescript
// src/db/schema.ts — additions to websites table
syncStatus: t.text("sync_status").default("idle"),
lastSyncedAt: t.timestamp("last_synced_at"),
```

Both are nullable by default in Drizzle (no `.notNull()`). `syncStatus` gets a default of `'idle'`. Run `npm run db:push` after modifying schema.

---

### Anti-Patterns to Avoid

- **Do not use `waitUntil` from Vercel SDK.** The project skill `server-after-nonblocking` and CONTEXT.md both point to `after()` from `next/server`. Using Vercel's `waitUntil` adds a dependency and requires `import { waitUntil } from '@vercel/functions'` — unnecessary.
- **Do not define SyncBadge or SyncStatusComponent inside WebsiteCard's render function.** Project skill `rerender-no-inline-components` requires module-scope component definitions. WebsiteCard already has `StatusBadge` at module scope — follow the same pattern.
- **Do not import `after` from `@vercel/functions`.** Import from `next/server` — that is the stable, framework-integrated API.
- **Do not pass `website.lastSyncedAt` raw to the badge display without null check.** Drizzle returns `Date | null` for nullable timestamps — always check for null before calling `.toLocaleTimeString()`.
- **Do not poll on other pages.** `WebsitesPoller` should only be used in `websites/page.tsx`. Putting it in the dashboard layout would poll all dashboard pages unnecessarily.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Background AI execution | Custom queue, webhook, or deferred response hack | `after()` from `next/server` | Framework-native, tested, no extra infra |
| Data refresh on sync | SSE, WebSocket, polling API endpoint | `router.refresh()` in `useEffect` | Server Components re-render naturally; no new API needed |
| Session token verification | Custom JWT decode | `auth.api.getSession({ headers })` | Already used in every API route in the project |
| Section merge with override preservation | Custom deep-merge logic | Index-based loop + spread (as documented above) | `updateSectionAiContent` doesn't do index-based — write it inline |

---

## Common Pitfalls

### Pitfall 1: `after()` callback swallowing DB errors silently
**What goes wrong:** If the `after()` callback throws and there is no `try/catch`, the error is swallowed — `syncStatus` stays `'syncing'` forever.
**Why it happens:** `after()` runs outside the request/response lifecycle; uncaught exceptions do not surface to the caller.
**How to avoid:** Always wrap the full `after()` callback body in `try/catch`. In the `catch` block, write `syncStatus: 'sync_failed'` to DB.
**Warning signs:** Card badge shows "syncing" indefinitely.

### Pitfall 2: AI returns different section count than existing AST
**What goes wrong:** GPT-4o may return 3 sections when the existing AST has 4. Index-based merge must handle `newAst.sections[i]` being `undefined`.
**Why it happens:** AI does not know how many sections exist; it generates based on template preset.
**How to avoid:** In the merge loop, if `newSection` is `undefined` at index `i`, keep the existing section unchanged (`return section`).
**Warning signs:** TypeScript error on `newSection.ai_content` — `undefined` access.

### Pitfall 3: `Website` type from Drizzle not updated after schema change
**What goes wrong:** `WebsiteCard` uses `Website` from `@/db/schema` — if schema is modified but `db:push` not run, the TypeScript type is updated but the DB column doesn't exist yet, causing runtime errors.
**Why it happens:** Drizzle infers types from the schema definition, not from the actual DB.
**How to avoid:** Always run `npm run db:push` immediately after modifying `schema.ts`, before implementing routes that use the new fields.

### Pitfall 4: `syncStatus` type is `string | null` but treated as `SyncStatus` union
**What goes wrong:** `websites.syncStatus` in Drizzle schema is `text` — TypeScript type is `string | null`, not `'idle' | 'syncing' | 'synced' | 'sync_failed'`. Badge logic that does `=== 'sync_failed'` works correctly at runtime but TypeScript won't enforce the union.
**How to avoid:** Acceptable for this phase — the badge null-checks are sufficient. No need to add a custom type cast unless explicitly desired.

### Pitfall 5: Polling `useEffect` depends on `router` reference
**What goes wrong:** Including `router` in the `useEffect` dependency array causes the interval to reset on every render if `router` changes identity.
**Why it happens:** `useRouter()` in Next.js App Router returns a stable reference, so this is typically fine. But wrapping in an empty dependency array `[]` would also work since `router.refresh()` is stable.
**How to avoid:** Use `[router]` as dependency array — this is correct. Alternatively, apply the `rerender-use-ref-transient-values` skill rule and store `router` in a ref.

### Pitfall 6: Umami script tag React warning
**What goes wrong:** React may warn about unknown DOM attribute `data-website-id` if using JSX attribute name directly. Actually — `data-*` attributes are valid in JSX. No issue.
**How to avoid:** Use `data-website-id` exactly as shown — it is a valid HTML data attribute and React passes it through without issue.

---

## Code Examples

### Full Sync Route Handler Structure
```typescript
// Source: CONTEXT.md locked decisions + server-after-nonblocking skill rule
// src/app/api/sync/trigger/route.ts
import { after } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { websites } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/ai-prompts'
import { parseAndValidateAST } from '@/lib/ast-utils'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { noteId, noteContent } = body
  if (!noteId) return Response.json({ error: 'noteId required' }, { status: 400 })

  // Find all websites for this user with sourceNoteId = noteId
  const targets = await db.select().from(websites)
    .where(eq(websites.sourceNoteId, noteId))
    .then(rows => rows.filter(r => r.userId === session.user.id))

  if (targets.length === 0) return Response.json({ ok: true, updatedCount: 0 })

  // Mark all as syncing
  await Promise.all(targets.map(w =>
    db.update(websites).set({ syncStatus: 'syncing' }).where(eq(websites.id, w.id))
  ))

  after(async () => {
    for (const website of targets) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: buildSystemPrompt(website.templateId ?? 'blog') },
            { role: 'user', content: buildUserPrompt(JSON.stringify(noteContent)) },
          ],
        }, { signal: AbortSignal.timeout(30000) })

        const raw = completion.choices[0].message.content ?? '{}'
        const newAst = parseAndValidateAST(raw)
        const existingAst = website.content as WebsiteAST

        // Merge by index — preserve id, type, manual_overrides
        const mergedSections = existingAst.sections.map((section, i) => {
          const newSection = newAst.sections[i]
          if (!newSection) return section
          return { ...section, ai_content: newSection.ai_content }
        })
        const mergedAst = { ...existingAst, sections: mergedSections }

        await db.update(websites).set({
          content: mergedAst,
          syncStatus: 'synced',
          lastSyncedAt: new Date(),
          updatedAt: new Date(),
        }).where(eq(websites.id, website.id))
      } catch {
        await db.update(websites)
          .set({ syncStatus: 'sync_failed', updatedAt: new Date() })
          .where(eq(websites.id, website.id))
      }
    }
  })

  return Response.json({ ok: true, updatedCount: targets.length })
}
```

### Drizzle Schema Additions
```typescript
// src/db/schema.ts — inside websites table definition
syncStatus: t.text("sync_status").default("idle"),
lastSyncedAt: t.timestamp("last_synced_at"),
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `waitUntil` from `@vercel/functions` | `after()` from `next/server` | Next.js 15+ | No extra package; works in any Node.js deployment, not just Vercel |
| Polling with custom `/api/websites` endpoint | `router.refresh()` in Server Component architecture | Next.js App Router | No extra API needed; Server Components re-render with fresh DB data |

---

## Open Questions

1. **Multiple websites with same `sourceNoteId` — authorization scope**
   - What we know: CONTEXT.md says "update ALL websites with matching sourceNoteId"
   - What's unclear: Should the filter be `sourceNoteId = noteId` globally, or scoped to `userId = session.user.id`?
   - Recommendation: Scope to `userId = session.user.id` — prevents a user from accidentally syncing another user's website if IDs collide. This is the safe default.

2. **`syncStatus` display for `'syncing'` state**
   - What we know: CONTEXT.md specifies badge for `sync_failed` and `lastSyncedAt`. No badge specified for `'syncing'` in-progress state.
   - What's unclear: Should a loading/spinner badge show while `syncStatus = 'syncing'`?
   - Recommendation: Since `after()` is fast (typically < 30s) and polling is every 30s, the syncing state may be missed entirely. No badge for `'syncing'` — only show `synced` and `sync_failed`. Matches CONTEXT.md spec exactly.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` (exists) |
| Quick run command | `npm run test` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| F-18 | Section merge by index preserves manual_overrides | unit | `npm run test -- src/lib/sync-utils.test.ts` | Wave 0 |
| F-18 | Section merge handles AI returning fewer sections | unit | `npm run test -- src/lib/sync-utils.test.ts` | Wave 0 |
| F-19 | Umami script renders when env vars present | manual-only | n/a — env-dependent server render | n/a |
| S-03 | SyncBadge renders correct state per syncStatus value | unit | `npm run test -- src/components/sync-badge.test.ts` | Wave 0 (optional) |

**Note on F-19 testing:** The Umami script embed is a 3-line conditional in a Server Component. It depends on `NEXT_PUBLIC_UMAMI_URL` env var presence. Manual verification in dev with env var set is sufficient; automated test has low ROI.

**Note on S-03 badge testing:** The badge logic is simple enough (null checks + string comparison) that a unit test is optional but not required. The merge logic test for F-18 is the priority.

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/sync-utils.test.ts` — covers F-18 merge by index, fewer-sections edge case
  - Alternative: add merge tests directly to `src/lib/editor-utils.test.ts` since the merge function lives there conceptually

*(If merge function is inlined in the route handler rather than extracted to a utility, add a dedicated `sync-utils.ts` + test. This is a discretion choice for the planner.)*

---

## Sources

### Primary (HIGH confidence)
- `.claude/skills/vercel-react-best-practices/rules/server-after-nonblocking.md` — confirms `after()` from `next/server` pattern, import path, usage in Route Handlers
- `src/app/api/ai/generate/route.ts` — full generate flow reference for sync route
- `src/lib/editor-utils.ts` — `updateSectionAiContent()` function signature + immutable merge pattern
- `src/lib/ai-prompts.ts` — `buildUserPrompt()`, `buildSystemPrompt()` signatures
- `src/db/schema.ts` — current `websites` table shape, confirmed `sourceNoteId` field exists
- `src/components/website-card.tsx` — existing `StatusBadge` at module scope (pattern to follow for `SyncBadge`)
- `src/app/(dashboard)/dashboard/websites/page.tsx` — existing Server Component structure to wrap with poller
- `src/app/(public)/[username]/[slug]/page.tsx` — Umami script insertion point
- `vitest.config.ts` — test framework config, `@` alias, `environment: node`
- `package.json` — Next.js 16.1.6, vitest 4.1.0, no new packages needed
- Next.js `after()` reference: https://nextjs.org/docs/app/api-reference/functions/after

### Secondary (MEDIUM confidence)
- CONTEXT.md section `<specifics>` — index-based merge approach for sections (project decision)
- CONTEXT.md section `<decisions>` — all locked implementation choices

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages are existing project dependencies; no new installs
- Architecture: HIGH — `after()` confirmed via project skill rule; polling via `router.refresh()` is established Next.js App Router pattern; all integration points read directly from source
- Pitfalls: HIGH — derived from actual code inspection (Drizzle type inference, `after()` error swallowing, index mismatch)

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable stack — Next.js 16, Drizzle 0.45, no fast-moving dependencies in scope)
