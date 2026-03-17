# Phase 2: Website CRUD + Templates - Research

**Researched:** 2026-03-17
**Domain:** Next.js App Router CRUD, Server Actions, Client-side UX patterns
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Danh sach website (/dashboard/websites)**
- Layout: Card grid (2-3 cot) — dung lai Card component da co
- Moi website card hien thi: Ten + Status badge only (toi gian)
- Status badge mau: xanh la (Published), xam (Draft), cam (Archived)
- Click vao card → mo trang chi tiet `/dashboard/websites/[id]`
- Nut "Tao website moi": trong empty state + goc phai tren header (ca 2 cho)
- Empty state: Illustration + text + nut ("Ban chua co website nao" + nut tao)

**Flow tao website (/dashboard/websites/new)**
- Tao website mo trang rieng `/dashboard/websites/new` (khong phai modal)
- Form bat buoc nhap ten website ngay trong form tao
- 2 tab: "Tu Note" va "Tu viet prompt"
  - Tab "Tu Note": chi can nhap Note ID (text field duy nhat)
  - Tab "Tu viet prompt": textarea + placeholder goi y chi tiet
- Sau khi nhan "Tao": tao record draft trong DB → redirect ngay vao `/dashboard/websites/[id]`

**Trang chi tiet website (/dashboard/websites/[id])**
- Hien thi: thong tin website (ten, template, nguon, trang thai draft) + nut "Generate" placeholder cho Phase 3

**Template selection UX**
- 5 template (blog, portfolio, fitness, cooking, learning) hien thi dang grid 3 cot
- Moi template card: Icon (emoji) + Ten template — khong co mo ta
- AI goi y template: banner nho ben tren grid, co nut X de an
  - Banner text: "Goi y dua tren note cua ban: [Template X]"
  - Timing: hien thi sau khi user nhap Note ID va blur khoi o nhap
  - User co the bo qua va chon template khac trong grid

**CRUD actions (tren website card)**
- Actions chi hien thi khi hover vao card
- Hover → xuat hien icon dropdown (⋮) — click mo menu
- Menu chua: Rename, Doi trang thai (sub-menu), Xoa
- Rename: Inline edit — ten tren card bien thanh input, Enter de luu, Esc de huy
- Xoa: Confirm dialog — "Ban chac chan muon xoa [Ten]?" + nut Xac nhan / Huy
- Doi trang thai: Sub-menu 3 lua chon — Draft / Published / Archived

### Claude's Discretion
- Vi tri chinh xac cua template selection trong form `/new` (sau 2 tab, hay ben canh, hay cuoi form)
- Exact spacing, typography, card size
- Illustration cho empty state (co the dung SVG don gian hoac emoji lon)
- Loading state khi tao website
- Toast notification sau khi doi ten / xoa thanh cong

### Deferred Ideas (OUT OF SCOPE)
- Tim kiem / filter website trong danh sach
- Duplicate website
- Preview thumbnail cua template
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| F-04 | Website list — `/dashboard/websites` showing all user websites with status badges | Server Component fetch with Drizzle `eq(websites.userId, session.user.id)`, Card grid layout, status badge via `cn()` conditional classes |
| F-05 | Create website — choose note JSON source or free prompt, with template selection | `/dashboard/websites/new` page with tab UI (client component), Server Action for DB insert + redirect |
| F-06 | Website status — Draft / Published / Archived management | `status` column on `websites` table already exists; PATCH API route for status update |
| F-07 | Website CRUD — rename, delete (duplicate deferred) | Server Actions or API routes for UPDATE name, DELETE; inline edit pattern with keyboard handlers |
| F-08 | Template system — 5 hardcoded templates: blog, portfolio, fitness, cooking, learning | Client-side constant array, no DB table needed; `templateId` text column on `websites` stores selected ID |
| F-09 | AI template suggestion — keyword matching from note content | Pure client-side keyword map, no API call; triggers on blur of Note ID field |
</phase_requirements>

---

## Summary

Phase 2 is a pure CRUD + UI phase within an established Next.js 15 (App Router) + Drizzle ORM stack. The database schema is complete — the `websites` table already has all required columns (`name`, `slug`, `status`, `sourceNoteId`, `templateId`, `content`, `seoMeta`). No migrations needed.

The phase is primarily about building three pages: a list page (`/dashboard/websites`), a creation form (`/dashboard/websites/new`), and a detail scaffold (`/dashboard/websites/[id]`). CRUD mutations (create, rename, delete, status change) follow two patterns already established in the codebase: Server Actions (co-located `action.ts`) for page-bound mutations, and API routes for mutations triggered from interactive client components.

The most complex UI work is the website card's hover-triggered dropdown with inline rename and confirm-delete dialog. This requires careful client component design. Template suggestion is intentionally simple — a pure client-side keyword lookup, no external calls.

**Primary recommendation:** Use Server Actions for create (called from `/new` form), API routes (`/api/websites/[id]`) for rename/delete/status-change (called from the card dropdown client component), and fetch websites in the list page as a Server Component.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 15 (project-installed) | Pages, routing, Server Components, Server Actions | Project stack |
| Drizzle ORM | project-installed | DB queries, type-safe inserts/updates/deletes | Project stack |
| Tailwind CSS v4 | project-installed | Utility styling, conditional classes via `cn()` | Project stack |
| React 19 | project-installed | useState, event handlers, client interactivity | Project stack |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| motion/react | project-installed | Entrance animations, stagger effects on card grid | Card list page, form page |
| @base-ui/react/button | project-installed | Accessible button primitive (via project's Button component) | All button usage |

### No New Dependencies
This phase requires zero new npm installs. All needed libraries are already in the project.

---

## Architecture Patterns

### Recommended Project Structure

```
src/app/(dashboard)/dashboard/websites/
├── page.tsx                  # Server Component — fetch + render list
├── new/
│   └── page.tsx              # Client Component — tabbed form
│   └── action.ts             # Server Action — create website + redirect
├── [id]/
│   └── page.tsx              # Server Component — fetch + render detail
│   └── actions.ts            # Server Actions — rename, delete (optional alt to API routes)
src/app/api/websites/
└── [id]/
    └── route.ts              # PATCH (rename + status), DELETE
src/lib/
└── templates.ts              # Template definitions constant
```

### Pattern 1: Server Component List Page

The list page (`/dashboard/websites/page.tsx`) is a Server Component. It fetches the user's websites directly using `auth.api.getSession` + Drizzle query. No `useEffect`, no client-side fetching.

**What:** Fetch all websites for authenticated user, render card grid or empty state.
**When to use:** Read-only data display — the standard App Router pattern for dashboard pages.

```typescript
// src/app/(dashboard)/dashboard/websites/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardNav from "../dashboard-nav";
import WebsiteCard from "./website-card"; // Client Component for interactive card

export default async function WebsitesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userWebsites = await db
    .select()
    .from(websites)
    .where(eq(websites.userId, session.user.id))
    .orderBy(websites.createdAt);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* header with "Tao website moi" button */}
        {userWebsites.length === 0 ? (
          // empty state
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {userWebsites.map((site) => (
              <WebsiteCard key={site.id} website={site} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

### Pattern 2: Server Action for Create

The create form calls a Server Action co-located as `action.ts`. The action inserts into DB and uses `redirect()` from `next/navigation` to navigate to the detail page. This matches the `setUsername` pattern already in the codebase.

```typescript
// src/app/(dashboard)/dashboard/websites/new/action.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createWebsite(data: {
  name: string;
  templateId: string;
  sourceNoteId?: string;
  promptText?: string;
}): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const id = crypto.randomUUID();
  const slug = generateSlug(data.name); // simple kebab-case function

  await db.insert(websites).values({
    id,
    userId: session.user.id,
    name: data.name.trim(),
    slug,
    status: "draft",
    sourceNoteId: data.sourceNoteId ?? null,
    templateId: data.templateId,
    content: null,
    seoMeta: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  redirect(`/dashboard/websites/${id}`);
}
```

**IMPORTANT:** `redirect()` in Server Actions throws internally — do NOT wrap it in try/catch. Call `redirect()` outside any catch block.

### Pattern 3: API Routes for Mutation from Client Components

Card hover actions (rename, delete, status change) are triggered from a Client Component (`WebsiteCard`). Because this component cannot directly call Server Actions that use `redirect`, and since these mutations come from interactive dropdown menus, use standard API routes.

```typescript
// src/app/api/websites/[id]/route.ts
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  // body: { name: string } | { status: "draft" | "published" | "archived" }

  // ALWAYS verify the website belongs to session.user.id before mutating
  const [site] = await db.select().from(websites)
    .where(and(eq(websites.id, params.id), eq(websites.userId, session.user.id)))
    .limit(1);
  if (!site) return Response.json({ error: "Not found" }, { status: 404 });

  await db.update(websites)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(websites.id, params.id));

  return Response.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // same ownership check, then db.delete()
}
```

### Pattern 4: Client Component Card with Hover Dropdown

The `WebsiteCard` is a `"use client"` component that manages hover state, dropdown visibility, inline rename mode, and confirm-delete dialog state.

```typescript
"use client";
// Key state pieces:
const [isHovered, setIsHovered] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
const [renaming, setRenaming] = useState(false);
const [renameValue, setRenameValue] = useState(website.name);
const [confirmDelete, setConfirmDelete] = useState(false);

// Inline rename keyboard handlers:
const handleRenameKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") { /* submit */ }
  if (e.key === "Escape") { setRenaming(false); setRenameValue(website.name); }
};
```

Use `router.refresh()` from `useRouter()` after successful mutations to trigger Server Component revalidation without full page reload.

### Pattern 5: Template Constant (No DB Lookup)

Templates are hardcoded in a lib file. No API call, no DB table.

```typescript
// src/lib/templates.ts
export const TEMPLATES = [
  { id: "blog",       name: "Blog",      icon: "📝" },
  { id: "portfolio",  name: "Portfolio", icon: "💼" },
  { id: "fitness",    name: "Fitness",   icon: "💪" },
  { id: "cooking",    name: "Cooking",   icon: "🍳" },
  { id: "learning",   name: "Learning",  icon: "🎓" },
] as const;

export type TemplateId = typeof TEMPLATES[number]["id"];
```

### Pattern 6: Client-Side Template Suggestion (Keyword Map)

Runs entirely in the browser. No API call needed in Phase 2.

```typescript
// Keyword → template mapping
const KEYWORD_MAP: Record<string, TemplateId> = {
  blog: "blog", bai: "blog", viet: "blog", post: "blog",
  portfolio: "portfolio", du: "portfolio", an: "portfolio",
  fitness: "fitness", gym: "fitness", the: "fitness", suc: "fitness",
  cooking: "cooking", nau: "cooking", mon: "cooking", an: "cooking",
  learning: "learning", hoc: "learning", khoa: "learning", bai: "learning",
};

function suggestTemplate(noteId: string): TemplateId | null {
  const lower = noteId.toLowerCase();
  for (const [kw, tmpl] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(kw)) return tmpl;
  }
  return null;
}
```

Trigger on `onBlur` of the Note ID input. Store suggestion in local state, show banner if non-null.

### Pattern 7: Slug Generation (Simple Utility)

```typescript
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60) || "website";
}
```

This runs server-side in the create action. Phase 3 will allow editing slug before publish.

### Pattern 8: Status Badge with cn()

```typescript
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "rounded-full px-2 py-0.5 text-xs font-medium",
      status === "published" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      status === "draft"     && "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
      status === "archived"  && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    )}>
      {status === "published" ? "Published" : status === "draft" ? "Draft" : "Archived"}
    </span>
  );
}
```

### Anti-Patterns to Avoid

- **useEffect for data fetching on list page:** The list page is a Server Component — fetch directly. No `useEffect`, no client state for website list.
- **redirect() inside try/catch:** `redirect()` throws a special Next.js error. Wrapping it in catch will swallow it. Always call `redirect()` outside try/catch blocks.
- **Missing ownership check in API routes:** Always verify `website.userId === session.user.id` before mutation. The schema has `userId` on every website row — always check it.
- **Defining components inside components (rerender-no-inline-components):** `StatusBadge`, dropdown menus, confirm dialogs should be defined at module level, not inside the card render function.
- **No optimistic UI for list mutations:** After calling rename/delete/status-change APIs, call `router.refresh()` to re-run the Server Component and get fresh data. This is the correct App Router pattern — no local state duplication of server data.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible button | Raw `<button>` with custom focus styles | Project's `Button` from `@/components/ui/button.tsx` | Focus ring, disabled states, variants already handled |
| Card layout | Custom div with border/shadow | Project's `Card` from `@/components/ui/card.tsx` | Consistent rounded-xl, border, shadow, bg-card tokens |
| Conditional classes | String concatenation | `cn()` from `@/lib/utils` | Handles merging and conflicts |
| Form inputs | Raw `<input>` | Project's `Input` + `Label` from `@/components/ui/` | Consistent ring, sizing, dark mode |
| Auth check | Re-implementing session logic | `auth.api.getSession({ headers: await headers() })` | Established pattern |
| Slug generation | Complex unicode-aware library | Simple inline function (see above) | Phase 2 slugs are internal only; user edits slug in Phase 3 |

**Key insight:** Every UI primitive exists in the project already. Phase 2 adds zero new dependencies — it composes existing parts.

---

## Common Pitfalls

### Pitfall 1: redirect() swallowed by try/catch
**What goes wrong:** `createWebsite` action wraps everything in try/catch and never redirects.
**Why it happens:** `redirect()` in Next.js throws `NEXT_REDIRECT` — catch blocks intercept it.
**How to avoid:** Insert the record inside try/catch, then call `redirect()` after the catch block completes.
**Warning signs:** Function returns `{}` with no error but page doesn't navigate.

### Pitfall 2: Missing userId filter on website fetch
**What goes wrong:** User A can see or mutate User B's websites.
**Why it happens:** Forgetting `eq(websites.userId, session.user.id)` in Drizzle query.
**How to avoid:** Always add `.where(and(eq(websites.id, id), eq(websites.userId, session.user.id)))` on all single-website lookups; add `.where(eq(websites.userId, session.user.id))` on all list queries.
**Warning signs:** Any query on `websites` table without a userId filter.

### Pitfall 3: Stale list after mutation
**What goes wrong:** User deletes a card and it remains visible.
**Why it happens:** Client component mutated server state but the Server Component cache wasn't invalidated.
**How to avoid:** After every successful PATCH/DELETE API call, call `router.refresh()`. This re-runs the Server Component and returns fresh data.
**Warning signs:** UI doesn't update after successful API call.

### Pitfall 4: Inline rename losing focus on re-render
**What goes wrong:** User starts typing renamed value, component re-renders (from parent state), input loses focus.
**Why it happens:** Parent component passing `website` prop re-renders card; uncontrolled input loses value.
**How to avoid:** Use `autoFocus` on the rename input; keep `renameValue` in local card state (not derived from prop during rename). Only sync from prop when not in rename mode.
**Warning signs:** Input loses cursor position mid-rename.

### Pitfall 5: Drizzle prepare:false missing
**What goes wrong:** Queries fail on Supabase Transaction Pool Mode.
**Why it happens:** Supabase connection pooler doesn't support prepared statements.
**How to avoid:** The existing `db` client from `src/db/index.ts` should already have this set (established pattern per CONVENTIONS.md). Do not create new db instances.
**Warning signs:** Database errors on first query in production/Supabase.

### Pitfall 6: Tab state in form losing template selection
**What goes wrong:** User selects a template, switches tab, template selection resets.
**Why it happens:** Tab-switching re-renders template grid with default state.
**How to avoid:** Store `selectedTemplateId` in the parent form component state, not inside the template grid sub-component. Pass it down as controlled prop.
**Warning signs:** `selectedTemplateId` is `null` after tab switch despite prior selection.

---

## Code Examples

### Drizzle: Fetch user websites (Server Component)
```typescript
// Source: project CONVENTIONS.md + Drizzle established pattern
import { db } from "@/db";
import { websites } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const userWebsites = await db
  .select()
  .from(websites)
  .where(eq(websites.userId, session.user.id))
  .orderBy(desc(websites.createdAt));
```

### Drizzle: Insert new website
```typescript
await db.insert(websites).values({
  id: crypto.randomUUID(),
  userId: session.user.id,
  name: data.name.trim(),
  slug: generateSlug(data.name),
  status: "draft",
  sourceNoteId: data.sourceNoteId ?? null,
  templateId: data.templateId,
  content: null,
  seoMeta: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### Drizzle: Update website name
```typescript
import { and, eq } from "drizzle-orm";

await db.update(websites)
  .set({ name: newName, updatedAt: new Date() })
  .where(and(eq(websites.id, websiteId), eq(websites.userId, session.user.id)));
```

### Drizzle: Delete website
```typescript
await db.delete(websites)
  .where(and(eq(websites.id, websiteId), eq(websites.userId, session.user.id)));
```

### router.refresh() after mutation
```typescript
"use client";
import { useRouter } from "next/navigation";

const router = useRouter();

async function handleDelete() {
  const res = await fetch(`/api/websites/${website.id}`, { method: "DELETE" });
  if (res.ok) {
    setConfirmDelete(false);
    router.refresh(); // re-runs Server Component, list updates
  }
}
```

### Tab UI (no library needed)
```typescript
const [activeTab, setActiveTab] = useState<"note" | "prompt">("note");

// In JSX:
<div className="flex border-b border-border mb-4">
  <button
    type="button"
    onClick={() => setActiveTab("note")}
    className={cn(
      "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
      activeTab === "note"
        ? "border-primary text-foreground"
        : "border-transparent text-muted-foreground hover:text-foreground"
    )}
  >
    Tu Note
  </button>
  <button type="button" onClick={() => setActiveTab("prompt")} ...>
    Tu viet prompt
  </button>
</div>
{activeTab === "note" && <NoteTabContent ... />}
{activeTab === "prompt" && <PromptTabContent ... />}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `pages/` router API routes | App Router Route Handlers (`route.ts`) | Next.js 13+ | Different file conventions, same REST semantics |
| `getServerSideProps` | Server Components with direct `await` | Next.js 13+ | Simpler, no prop drilling |
| `next/router` | `next/navigation` `useRouter` | Next.js 13+ | Must import from correct package |
| `revalidatePath()` | `router.refresh()` (from client) | Next.js 13+ | Client-triggered Server Component re-run |

**Note on revalidatePath vs router.refresh:** `revalidatePath()` is used in Server Actions to invalidate cache server-side. `router.refresh()` is the client-side equivalent — called after API route responses. Both patterns are valid; use `revalidatePath` in Server Actions (create), `router.refresh()` in Client Components after fetch calls (rename/delete/status).

---

## Open Questions

1. **DashboardNav "Websites" link**
   - What we know: `dashboard-nav.tsx` currently only has "Đăng xuất" button; no nav links to sub-pages.
   - What's unclear: Should a "Websites" nav link be added, or is the dashboard homepage sufficient entry point?
   - Recommendation: Add a "Websites" link to `DashboardNav` in Phase 2 — it's the primary page users need to navigate to.

2. **Confirm-delete dialog: native or custom**
   - What we know: No dialog/modal component exists in `src/components/ui/` yet.
   - What's unclear: Build a minimal inline confirm UI vs. a reusable Dialog component.
   - Recommendation: Build a simple inline confirm state (`confirmDelete: boolean`) that shows an inline "Are you sure?" panel within the card or as an absolutely-positioned overlay. Avoid adding a new Dialog component dependency in Phase 2 — keep it simple.

3. **slug uniqueness constraint**
   - What we know: `websites` table has `slug` column but no unique constraint visible in schema.ts.
   - What's unclear: Is slug required to be unique per user or globally? The published URL is `/{username}/{slug}` so it only needs to be unique per user.
   - Recommendation: In Phase 2 (all websites are draft), slug uniqueness is not yet enforced publicly. Generate a slug from name + UUID suffix if needed. Phase 3 will address slug editing before publish.

---

## Validation Architecture

`workflow.nyquist_validation` key is absent from `.planning/config.json` — treating as enabled.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test directories found |
| Config file | None — Wave 0 must establish |
| Quick run command | `npx vitest run --reporter=verbose` (after Wave 0 setup) |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| F-04 | Website list page fetches only user's own websites | unit | `npx vitest run tests/websites.test.ts -t "list"` | Wave 0 |
| F-05 | createWebsite action inserts record with correct userId and status=draft | unit | `npx vitest run tests/websites.test.ts -t "create"` | Wave 0 |
| F-06 | Status PATCH updates status field, rejects invalid values | unit | `npx vitest run tests/websites.test.ts -t "status"` | Wave 0 |
| F-07 | Rename PATCH updates name; DELETE removes record | unit | `npx vitest run tests/websites.test.ts -t "crud"` | Wave 0 |
| F-08 | TEMPLATES constant contains exactly 5 entries with required fields | unit | `npx vitest run tests/templates.test.ts` | Wave 0 |
| F-09 | suggestTemplate returns correct templateId for known keywords, null for unknown | unit | `npx vitest run tests/templates.test.ts -t "suggest"` | Wave 0 |

**Note:** All tests are unit tests against pure functions and DB logic. No E2E tests in Phase 2 scope. Given no test infrastructure exists, Wave 0 of Phase 2 planning should include a task to set up vitest.

### Sampling Rate
- **Per task commit:** `npx vitest run tests/templates.test.ts` (pure function, fast)
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/templates.test.ts` — covers F-08, F-09 (pure functions, no DB needed)
- [ ] `tests/websites.test.ts` — covers F-04, F-05, F-06, F-07 (requires DB mock or test DB)
- [ ] `vitest.config.ts` — configure with next.js environment
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react` — no test runner detected

---

## Sources

### Primary (HIGH confidence)
- `src/db/schema.ts` — websites table confirmed: id (uuid), userId, name, slug, status, sourceNoteId, templateId, content (jsonb), seoMeta (jsonb), createdAt, updatedAt
- `src/app/(auth)/onboarding/action.ts` — Server Action pattern: "use server", auth check, DB insert, return `{ error? }` — confirmed working in Phase 1
- `src/app/api/auth/mobile-token/route.ts` — API route pattern: auth via `getSession({ headers: request.headers })`, JSON response
- `src/components/ui/card.tsx` — Card, CardHeader, CardTitle, CardContent, CardFooter, CardAction — all available
- `src/components/ui/button.tsx` — Button with variants: default, outline, secondary, ghost, destructive, link; sizes: default, sm, lg, icon, icon-sm, icon-lg
- `.planning/codebase/CONVENTIONS.md` — All established patterns confirmed

### Secondary (MEDIUM confidence)
- Next.js App Router docs pattern: `router.refresh()` after mutation from Client Components — widely documented, consistent with project's established patterns

### Tertiary (LOW confidence)
- Vitest setup recommendation — based on ecosystem standard for Next.js projects; not verified against project's specific Next.js version compatibility

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new dependencies, all libraries confirmed in codebase
- Architecture: HIGH — patterns verified from existing working code (onboarding action, mobile-token route)
- DB schema: HIGH — verified directly in schema.ts, no migrations needed
- Pitfalls: HIGH — derived from direct code inspection + established Next.js patterns
- Test setup: MEDIUM — no test framework found; vitest recommendation is ecosystem standard but not project-verified

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable stack, no fast-moving dependencies)
