# Phase 13: Multi-page Website Support — Research

**Researched:** 2026-03-23
**Domain:** Next.js App Router routing, Drizzle JSONB, ZIP generation, React state management
**Confidence:** HIGH

---

## Summary

Phase 13 adds multi-page support to an existing single-page website generator. Every decision has already been locked in CONTEXT.md — this research confirms each decision is implementable with zero new external dependencies (except one ZIP library) and documents the exact patterns to use.

The phase has six distinct implementation areas: (1) DB schema migration — add `pages JSONB` column and migrate existing `htmlContent` data, (2) PATCH API update — accept `pages` field, (3) public routing extension — handle `/{username}/{slug}/{page}` dynamic segment, (4) generate-html API extension — accept `pageName` param and write to `pages[pageName]`, (5) editor UI — add Page Manager tab strip + per-page chat history, (6) export endpoint — new `GET /api/websites/[id]/export` returning ZIP. All six areas are straightforward extensions of existing code with no architecture changes required.

The only new dependency required is a ZIP library. `fflate` (already available as `npm view fflate version` → `0.8.2`) is the recommended choice: zero dependencies, works in both Node and browser, 8KB gzip. No new shadcn components are needed — the UI-SPEC confirms all required components (`Tabs`, `Dialog`, `Button`, `Input`) are already installed.

**Primary recommendation:** Implement in waves: Wave 0 (schema + migration), Wave 1 (API layer — PATCH + generate), Wave 2 (routing), Wave 3 (editor UI + export). This sequencing prevents broken intermediate states.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Thêm `pages` JSONB column vào `websites` table: `{ [pageName: string]: string }` (pageName → HTML string)
- **D-02:** Giữ `htmlContent TEXT` column trong transition để backward compat; sau khi migration hoàn tất có thể deprecate
- **D-03:** Migration dùng Drizzle migration script (1 lần): `UPDATE websites SET pages = jsonb_build_object('index', html_content) WHERE html_content IS NOT NULL` — atomic, không cần application-level lazy convert
- **D-04:** Public route `/{username}/{slug}` (no page) → serve `pages.index` — backward compat với tất cả existing published websites
- **D-05:** Public route `/{username}/{slug}/{page}` → serve `pages[page]`; nếu page không tồn tại → 404 (không redirect về index)
- **D-06:** Draft → 404, Archived → archived message (giữ nguyên behavior hiện tại)
- **D-07:** Page Manager là tab strip nhỏ phía trên iframe preview — `[ Index ] [ About ] [ + ]`
- **D-08:** Click tab → switch sang page đó (load HTML của page đó vào iframe và chat)
- **D-09:** Nút `[+]` → prompt nhập tên page mới → tạo blank page, switch sang đó
- **D-10:** Right-click hoặc `×` trên tab → delete page (không xóa tab cuối/index)
- **D-11:** Page mới tạo ra là **blank HTML** — user dùng Chat để AI generate nội dung
- **D-12:** Chat history là **per-page** — switch page thì chat history switch theo. `websites.chatHistory` đổi thành `{ [pageName: string]: ChatMessage[] }`
- **D-13:** `POST /api/ai/generate-html` nhận thêm optional `pageName` param (default `"index"`); sau generate lưu HTML vào `pages[pageName]` thay vì `htmlContent`
- **D-14:** AI instruction trong fresh generation mode: dùng relative links (`about.html`, `index.html`) thay vì absolute URL
- **D-15:** Nút export ZIP nằm trong **editor toolbar** (cạnh nút Publish)
- **D-16:** `GET /api/websites/[id]/export` trả ZIP với `{pageName}.html` files cho tất cả pages

### Claude's Discretion

- Exact tab strip styling (color, active state, hover)
- ZIP file naming convention (e.g., `website-{slug}.zip`)
- Error handling khi generate page mới thất bại

### Deferred Ideas (OUT OF SCOPE)

- Auto-detect broken links giữa các pages — future phase
- Page order management (drag to reorder) — future phase
- Per-page SEO meta editing — future phase
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MP-01 | DB schema — `websites.pages` JSONB column, schema `{ [pageName: string]: string }`. Existing rows migrated: `{ index: htmlContent }` | Drizzle `.jsonb()` column type confirmed in existing schema (`chatHistory`). Migration SQL confirmed via D-03. |
| MP-02 | `PATCH /api/websites/[id]` accept `pages` field (JSONB object), backward compat with `html_content` | Existing PATCH handler already handles multiple field types — add `pages` field with object validation. |
| MP-03 | Public route `/{username}/{slug}` and `/{username}/{slug}/{page}` dynamic routing | Next.js App Router catch-all or nested `[page]` dynamic segment. See routing section. |
| MP-04 | `POST /api/ai/generate-html` accept optional `pageName`, write to `pages[pageName]` | Current handler writes to `htmlContent`; extend to use Postgres `jsonb_set()` for atomic page write. |
| MP-05 | Editor UI — Page Manager: list pages, add page, switch page, delete page (not last page) | shadcn `Tabs` + `Dialog` components already installed. UI-SPEC fully specified. |
| MP-06 | AI instruction to use relative links (`about.html`, `index.html`) in fresh generation | Add one sentence to `buildUserMessage()` or system prompt in `html-prompts.ts`. |
| MP-07 | `GET /api/websites/[id]/export` returns ZIP with `{pageName}.html` files | Use `fflate` library (0.8.2 available). New route file at `src/app/api/websites/[id]/export/route.ts`. |
| MP-08 | Backward compat — existing published websites still accessible at `/{username}/{slug}` | Covered by D-04. `pages.index` fallback logic. |
</phase_requirements>

---

## Standard Stack

### Core (no new installs)

| Library | Current Version | Purpose | Status |
|---------|-----------------|---------|--------|
| Drizzle ORM | `^0.45.1` | JSONB column, `jsonb_set()` operator, migration script | Already installed |
| Next.js App Router | `16.1.6` | Dynamic route segments `[page]` | Already installed |
| React | `19.2.3` | Page Manager UI state (`currentPage`, `pages` map) | Already installed |
| shadcn `Tabs` | installed | Page Manager tab strip | Already in `src/components/ui/tabs.tsx` |
| shadcn `Dialog` | installed | Add/delete page dialogs | Already in `src/components/ui/dialog.tsx` |
| lucide-react | `^0.577.0` | `Plus`, `X`, `Download` icons for tab strip + export button | Already installed |

### New Dependency (ZIP export)

| Library | Version | Purpose | Why This One |
|---------|---------|---------|--------------|
| `fflate` | `0.8.2` (npm registry confirmed) | ZIP file generation for export endpoint | Zero dependencies, works in Node.js server context, 8KB gzip, pure JS — no native bindings needed on Vercel. `jszip` (3.10.1) is also available but `fflate` is 3-5x faster and smaller. |

**Installation:**
```bash
npm install fflate
```

**Alternative considered:** `jszip` — larger, Promise-based API is fine, but `fflate` is preferred for serverless edge compatibility and speed. Either works in a Next.js Route Handler.

**Version verification:** `npm view fflate version` → `0.8.2` (confirmed 2026-03-23).

---

## Architecture Patterns

### DB Schema Changes

**Add `pages` JSONB column to `websites` table in `schema.ts`:**

```typescript
// src/db/schema.ts — websites table
pages: t.jsonb("pages"),  // { [pageName: string]: string }
// Keep existing:
htmlContent: t.text("html_content"),  // D-02: keep during transition
chatHistory: t.jsonb("chat_history"), // will change shape to { [pageName: string]: ChatMessage[] }
```

After adding the column, run `npm run db:generate` to create the migration file, then `npm run db:migrate` to apply.

**Migration SQL** (D-03 — run as a separate migration or in a custom script):
```sql
UPDATE websites
SET pages = jsonb_build_object('index', html_content)
WHERE html_content IS NOT NULL;
```

This is safe to run after the column exists. Rows with NULL `html_content` get NULL `pages` (handled in app code as empty object `{}`).

### Public Route: Next.js Dynamic Segments

**Problem:** Current structure is `src/app/(public)/[username]/[slug]/route.ts`. Need to also handle `/{username}/{slug}/{page}`.

**Solution:** Add a nested dynamic segment. Two viable approaches:

**Approach A (recommended): New nested route file**
```
src/app/(public)/[username]/[slug]/route.ts          ← existing (handles no page → serves index)
src/app/(public)/[username]/[slug]/[page]/route.ts   ← new (handles /{username}/{slug}/{page})
```

Both route handlers share the same DB lookup logic. The `[slug]/route.ts` serves `pages.index`, the `[slug]/[page]/route.ts` serves `pages[page]`.

Confidence: HIGH — This is standard Next.js App Router behavior. Each nested folder with `route.ts` handles requests to that path depth independently.

**Approach B (not recommended):** Use `[[...slug]]` optional catch-all. More complex parsing, harder to typecheck.

**Route handler shared logic (pattern for both files):**
```typescript
// Shared lookup pattern
const pages = website.pages as Record<string, string> | null ?? {};
const html = pages[pageName] ?? null;
if (!html) return new Response(null, { status: 404 });
return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
```

### PATCH API — Accept `pages` field

In `src/app/api/websites/[id]/route.ts`, add handling alongside the existing `html_content` field:

```typescript
if ("pages" in body) {
  const pages = body.pages;
  if (pages !== null && (typeof pages !== "object" || Array.isArray(pages))) {
    return Response.json({ error: "pages must be an object or null" }, { status: 400 });
  }
  updateSet.pages = pages;
}
```

Backward compat: existing `html_content` field handler stays unchanged (D-02).

### Generate API — Write to `pages[pageName]`

**Current code** writes `htmlContent: html` after generation. New behavior: write into `pages` JSONB using Postgres `jsonb_set()`:

```typescript
// src/app/api/ai/generate-html/route.ts
const { websiteId, prompt, currentHtml, pageName = "index" } = await request.json() as {
  websiteId: string;
  prompt: string;
  currentHtml?: string;
  pageName?: string;
};

// After generation, use SQL to atomically set pages[pageName]:
await db.execute(
  sql`UPDATE websites
      SET pages = jsonb_set(COALESCE(pages, '{}'), ${`{${pageName}}`}, ${JSON.stringify(html)}::jsonb),
          updated_at = now()
      WHERE id = ${websiteId}`
);
```

**Alternative:** Fetch current pages, merge in JS, then write back. Simpler but has a race condition if two pages generate simultaneously. The `jsonb_set` approach is atomic and preferred.

**Drizzle `sql` tagged template:** Available via `import { sql } from "drizzle-orm"`.

### Editor State Refactor

The editor currently has:
```typescript
const [htmlContent, setHtmlContent] = useState<string>(props.initialHtml ?? "");
const [messages, setMessages] = useState<ChatMessage[]>(...);
```

After refactor:
```typescript
// Page data
const [pages, setPages] = useState<Record<string, string>>(props.initialPages ?? {});
const [currentPage, setCurrentPage] = useState<string>("index");

// Derived — current page HTML
const currentPageHtml = pages[currentPage] ?? "";

// Per-page chat history
const [allChatHistory, setAllChatHistory] = useState<Record<string, ChatMessage[]>>(
  props.initialChatHistory ?? {}
);
const messages = allChatHistory[currentPage] ?? [];
```

Page switch:
```typescript
function switchPage(pageName: string) {
  setCurrentPage(pageName);
  // messages derived from allChatHistory[pageName] automatically
}
```

**Props change in `HtmlEditorClientProps`:**
- Remove: `initialHtml: string | null`, `initialChatHistory: Array<...> | null`
- Add: `initialPages: Record<string, string> | null`, `initialChatHistory: Record<string, Array<...>> | null`

**Server component `page.tsx` needs to pass `pages` from DB** instead of `htmlContent`.

### Export Endpoint

New file: `src/app/api/websites/[id]/export/route.ts`

```typescript
import { strToU8, zipSync } from "fflate";

export async function GET(request: Request, { params }) {
  // auth + ownership check (same pattern as PATCH)
  const website = ...;
  const pages = (website.pages as Record<string, string> | null) ?? {};

  const files: Record<string, Uint8Array> = {};
  for (const [pageName, html] of Object.entries(pages)) {
    files[`${pageName}.html`] = strToU8(html);
  }

  const zipBuffer = zipSync(files);

  return new Response(zipBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="website-${website.slug}.zip"`,
    },
  });
}
```

`zipSync` is synchronous (non-blocking for small websites). For very large HTML, `zip` async variant exists but is unnecessary here.

### Page Manager UI Structure

Built entirely from existing shadcn primitives — no new components. The Page Manager is a custom tab strip (NOT using shadcn `Tabs` component internally, because shadcn Tabs manages active state globally and conflicts with the existing Chat/Code Tabs). Use a plain `div` with button elements:

```tsx
{/* Page Manager Tab Strip — above iframe */}
<div className="flex items-center h-9 border-b border-border bg-background overflow-x-auto [scrollbar-width:none]">
  {Object.keys(pages).map((pageName) => (
    <div key={pageName} className="relative flex items-center">
      <button
        className={cn(
          "px-2 py-2 text-sm whitespace-nowrap",
          currentPage === pageName
            ? "text-foreground font-semibold border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
        onClick={() => switchPage(pageName)}
      >
        {pageName === "index" ? "Index" : pageName}
      </button>
      {/* × delete button — non-index pages only, show on hover */}
      {pageName !== "index" && (
        <button
          className="..."
          aria-label={`Xóa trang ${pageName}`}
          onClick={() => setDeleteTarget(pageName)}
        >
          <X size={12} />
        </button>
      )}
    </div>
  ))}
  {/* Add page button */}
  <Button variant="ghost" size="sm" aria-label="Thêm trang mới"
    onClick={() => setShowAddDialog(true)}>
    <Plus size={14} />
  </Button>
</div>
```

**Add Page Dialog uses shadcn `Dialog` + `Input`:**
- Validation: `/^[a-z0-9-]+$/` regex on page name
- Prevent duplicate: check `pageName in pages`
- On confirm: `setPages(prev => ({ ...prev, [newName]: "" }))`, then `switchPage(newName)`
- Immediately save to DB via PATCH with updated `pages` object

### Relative Links in AI Generation (MP-06)

Add one instruction to `buildUserMessage()` in `src/lib/context-builder.ts`:

```typescript
// In buildUserMessage(), after "## User Request" section:
// OR add a new "## Multi-page Links" section:
`## Link Convention
When referencing other pages, use relative HTML links: about.html, contact.html, index.html (NOT absolute URLs like /username/slug/about).`
```

This only fires in fresh generation mode (edit mode uses `buildEditUserMessage()` which doesn't include this section, which is correct since edit mode operates on the current page only).

### chatHistory Schema Migration

`chatHistory` changes from `ChatMessage[]` to `{ [pageName: string]: ChatMessage[] }`.

**Backward compat approach:** In the editor, when loading `initialChatHistory`, detect if it's an array (old format) and migrate:

```typescript
function normalizeChatHistory(raw: unknown): Record<string, ChatMessage[]> {
  if (!raw) return {};
  if (Array.isArray(raw)) {
    // old format: migrate to per-page under "index"
    return { index: raw as ChatMessage[] };
  }
  return raw as Record<string, ChatMessage[]>;
}
```

This avoids a DB migration for `chatHistory` — the client silently upgrades on first load.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| ZIP file creation | Custom base64 + binary encoding | `fflate` `zipSync` | ZIP format has CRC32, deflate compression, directory entries — many edge cases |
| JSONB atomic update | Fetch + merge + write (race condition) | Postgres `jsonb_set()` via `sql` tagged template | Two simultaneous generates to different pages would corrupt data with fetch-merge-write |
| Page name validation regex | Custom char-by-char validation | `/^[a-z0-9-]+$/` one-liner | Already specified in UI-SPEC |
| Dialog focus trap | Custom focus management | shadcn `Dialog` (Radix UI) | Already installed, handles focus trap, `aria-modal`, `Escape` key |

---

## Common Pitfalls

### Pitfall 1: `jsonb_set` path format in Drizzle `sql`

**What goes wrong:** `jsonb_set(pages, '{about}', '"<html>..."'::jsonb)` — the path must be a Postgres text array `'{about}'`, not a JS string. If HTML contains single quotes, the literal string approach breaks.

**Why it happens:** String interpolation in SQL doesn't escape JSON values.

**How to avoid:** Use Drizzle's `sql` tagged template with proper parameterization:
```typescript
await db.execute(
  sql`UPDATE websites
      SET pages = jsonb_set(COALESCE(pages, '{}'), ARRAY[${pageName}], to_jsonb(${html}::text)),
          updated_at = now()
      WHERE id = ${websiteId}`
);
```
`to_jsonb(${html}::text)` correctly escapes any HTML content. The `ARRAY[${pageName}]` creates the path array with proper escaping.

**Warning signs:** Page HTML contains `"` or `'` characters and saved content is corrupted/truncated.

### Pitfall 2: TypeScript cast for `pages` JSONB field

**What goes wrong:** Drizzle infers `pages` as `unknown` (JSONB has no static type). Accessing `pages["index"]` without casting throws a TypeScript error.

**Why it happens:** Drizzle JSONB columns are typed `unknown` by default.

**How to avoid:** Cast at the point of use:
```typescript
const pages = (website.pages as Record<string, string> | null) ?? {};
```
Or add a typed helper in schema.ts. Do NOT use `any`.

**Warning signs:** `npm run typecheck` fails with "Object is of type 'unknown'" on pages access.

### Pitfall 3: Page Manager conflicting with existing Chat/Code Tabs

**What goes wrong:** Wrapping the iframe + Page Manager in a shadcn `Tabs` component and also having Chat/Code in a `Tabs` component — the `onValueChange` from the outer tabs triggers when inner tabs change.

**Why it happens:** shadcn Tabs uses Radix `TabsRoot` which manages its own context — nested `Tabs` components are actually independent, but both fire their `onValueChange`.

**How to avoid:** Page Manager is a plain `div` with button elements (not shadcn `Tabs`). This is already the approach recommended in the UI-SPEC. Only the right panel (Chat/Code) uses shadcn `Tabs`.

**Warning signs:** Switching a Chat/Code tab changes the active page, or vice versa.

### Pitfall 4: Export with empty pages object

**What goes wrong:** `zipSync({})` with an empty object produces an empty ZIP that some unzip tools reject (valid per spec but surprising to users).

**Why it happens:** Website was created but no HTML has been generated yet.

**How to avoid:** Disable the export button when `Object.keys(pages).length === 0`. Already specified in UI-SPEC: "Disabled state: disabled when website has no pages content yet."

**Warning signs:** User downloads a 0-byte or minimal-byte ZIP.

### Pitfall 5: `codeValue` state in Code tab

**What goes wrong:** Current editor has `const [codeValue, setCodeValue] = useState(initialHtml)` — when switching pages, `codeValue` still shows the previous page's HTML.

**Why it happens:** `codeValue` is initialized once and synced only when entering Code tab (`handleTabChange`).

**How to avoid:** In `handleTabChange("code")`, sync from `currentPageHtml` (not `htmlContent`). Also reset `codeValue` when `currentPage` changes:
```typescript
useEffect(() => {
  setCodeValue(currentPageHtml);
}, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps
```

**Warning signs:** Code tab shows stale HTML from previous page after switching.

### Pitfall 6: `autoGenTriggered` ref scope

**What goes wrong:** Current auto-gen on mount triggers once using `autoGenTriggered.current` ref. After adding pages, if the user navigates back to a page with no HTML, auto-gen should NOT fire again automatically.

**Why it happens:** Auto-gen on mount is specifically for the initial website creation flow (launched from dashboard with `?prompt=...`).

**How to avoid:** Keep the existing auto-gen logic unchanged — it only fires when `!props.initialHtml && props.initialPrompt`. New pages start blank (D-11) and generate via user-initiated chat message only. No change needed here.

### Pitfall 7: `handleSave` still uses `html_content` field

**What goes wrong:** After the schema migration, `handleSave()` still calls `PATCH` with `{ html_content: ... }`. This writes to the deprecated column, not `pages`.

**Why it happens:** The editor's manual save and auto-save paths both use `html_content`.

**How to avoid:** Change `handleSave()` to call `PATCH` with `{ pages: { ...currentPages, [currentPage]: html } }`. The full pages object must be sent (not just the changed page) unless using a more granular API. Alternatively, add a dedicated endpoint or use the `jsonb_set` approach in the PATCH handler itself.

**Recommended:** Send the full `pages` object on save — it's a JSONB blob and unlikely to be multi-MB. Simpler than building partial-update logic.

---

## Code Examples

### fflate ZIP generation (server-side)

```typescript
// Source: fflate npm README + Node.js usage
import { strToU8, zipSync } from "fflate";

const files: Record<string, Uint8Array> = {
  "index.html": strToU8("<html>...</html>"),
  "about.html": strToU8("<html>...</html>"),
};

const zipped = zipSync(files, { level: 6 }); // Uint8Array
// Return as Response:
return new Response(zipped, {
  headers: {
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="website.zip"',
  },
});
```

Confidence: HIGH — fflate `zipSync` is its primary server-side API, confirmed by npm README.

### Drizzle JSONB column definition

```typescript
// Source: existing codebase pattern (chatHistory)
chatHistory: t.jsonb("chat_history"),
pages: t.jsonb("pages"),
```

Confidence: HIGH — identical to existing `chatHistory` JSONB column in schema.ts.

### Drizzle raw SQL for jsonb_set

```typescript
// Source: Drizzle ORM docs — sql tagged template
import { sql } from "drizzle-orm";

await db.execute(
  sql`UPDATE websites
      SET pages = jsonb_set(COALESCE(pages, '{}'), ARRAY[${pageName}], to_jsonb(${html}::text)),
          updated_at = NOW()
      WHERE id = ${websiteId}`
);
```

Confidence: MEDIUM — `sql` tagged template is documented. `ARRAY[${pageName}]` syntax for jsonb_set path is confirmed Postgres behavior (HIGH), but Drizzle parameter binding in raw SQL verified from codebase pattern (db.execute used in `drizzle-kit`-generated scripts).

### Next.js nested dynamic route

```
// File structure:
src/app/(public)/[username]/[slug]/route.ts        → GET /{username}/{slug}
src/app/(public)/[username]/[slug]/[page]/route.ts → GET /{username}/{slug}/{page}

// Each is an independent Route Handler with its own params:
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string; slug: string; page: string }> }
) { ... }
```

Confidence: HIGH — standard Next.js App Router pattern, verified by existing route structure in codebase.

### Client-side ZIP download trigger

```typescript
// In editor-client.tsx handleExport():
async function handleExport() {
  setIsExporting(true);
  try {
    const res = await fetch(`/api/websites/${props.websiteId}/export`);
    if (!res.ok) throw new Error();
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `website-${props.websiteId}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    toast.error("Không thể tải ZIP. Vui lòng thử lại.");
  } finally {
    setIsExporting(false);
  }
}
```

Confidence: HIGH — standard browser Blob download pattern.

---

## Runtime State Inventory

This is a schema migration phase. The following categories must be answered:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data (DB) | `websites.htmlContent TEXT` — existing single-page HTML. `websites.chatHistory JSONB` — existing `ChatMessage[]` arrays | DB migration: run `UPDATE websites SET pages = jsonb_build_object('index', html_content) WHERE html_content IS NOT NULL` once. `chatHistory` migration: handled client-side via `normalizeChatHistory()` — no DB migration needed. |
| Live service config | None — no external services store website content | None |
| OS-registered state | None | None |
| Secrets/env vars | None — no new env vars introduced | None |
| Build artifacts | None — no compiled binaries or cached artifacts affected | None |

**Key data migration detail:** After the Drizzle schema migration adds the `pages` column and the data migration script runs, `htmlContent` is still populated (D-02: keep for transition). The app code reads from `pages` first; `htmlContent` remains as a safety fallback until manually deprecated.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `fflate` (npm) | MP-07 ZIP export | Not installed (in node_modules) | 0.8.2 (npm registry) | `jszip` 3.10.1 (npm registry) |
| Postgres `jsonb_set` function | MP-04 atomic page write | ✓ | Built-in Postgres (Supabase) | Fetch-merge-write in JS (has race condition) |
| Drizzle `sql` tagged template | MP-04 raw SQL | ✓ | drizzle-orm ^0.45.1 | N/A |
| `lucide-react` `Plus`, `X`, `Download` icons | MP-05, MP-07 UI | ✓ | ^0.577.0 | N/A |
| shadcn `Dialog`, `Input` | MP-05 Page Manager | ✓ | Already installed | N/A |

**Missing dependencies with no fallback:** None — all critical dependencies either installed or installable via `npm install fflate`.

**Missing dependencies with fallback:**
- `fflate` not in node_modules — install via `npm install fflate`. If unavailable, `jszip` works as alternative.

---

## Validation Architecture

`workflow.nyquist_validation` is not present in `.planning/config.json` — treat as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest ^4.1.0 |
| Config file | No explicit `vitest.config.*` found — uses `package.json` `"test": "vitest run"` |
| Quick run command | `npx vitest run src/lib/ai-pipeline/` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MP-01 | Drizzle schema has `pages` JSONB column | manual (schema inspection) | `npm run typecheck` (type errors if column missing) | N/A — typecheck covers |
| MP-02 | PATCH accepts `pages` field | integration (API route) | manual-only (requires DB) | ❌ Wave 0 |
| MP-03 | Public route serves correct page HTML | integration (route handler) | manual-only (requires DB + published website) | ❌ Wave 0 |
| MP-04 | generate-html writes to `pages[pageName]` | unit (generate route logic) | `npm run typecheck` + manual | ❌ Wave 0 |
| MP-05 | Page Manager renders tabs, add/delete works | manual (browser UI test) | N/A — UI component, manual-only | N/A |
| MP-06 | buildUserMessage() includes relative link instruction | unit | `npx vitest run src/lib/ai-pipeline/context-builder.test.ts` | ✅ (extend existing) |
| MP-07 | Export returns valid ZIP with correct files | unit (fflate) + manual (download) | `npx vitest run src/app/api/websites` | ❌ Wave 0 |
| MP-08 | `/{username}/{slug}` serves `pages.index` backward compat | integration | manual-only | N/A |

### Sampling Rate
- **Per task commit:** `npm run typecheck && npm run test`
- **Per wave merge:** `npm run typecheck && npm run test && npm run lint`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/app/api/websites/[id]/export/route.test.ts` — covers MP-07 (fflate zipSync output has index.html + about.html)
- [ ] `src/lib/ai-pipeline/context-builder.test.ts` — extend to cover relative link instruction in `buildUserMessage()` (MP-06)

*(Existing test files: `context-builder.test.ts`, `design-agent.test.ts`, `reviewer.test.ts`, `html-prompts.test.ts` — all can be extended)*

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single HTML string in `htmlContent TEXT` | `pages JSONB { [name]: html }` | Phase 13 | Multiple pages per website; backward compat via index page |
| `chatHistory` as flat `ChatMessage[]` | `chatHistory` as `{ [pageName]: ChatMessage[] }` | Phase 13 | Per-page chat context maintained |
| Public route only at `/{username}/{slug}` | Route also at `/{username}/{slug}/{page}` | Phase 13 | Real URLs for multi-page websites |

---

## Open Questions

1. **`handleSave` sends full `pages` object or delta?**
   - What we know: Current `handleSave` sends `{ html_content: html }`. Need to change to `{ pages: {...} }`.
   - What's unclear: Should PATCH receive the full pages object (simple) or support partial page update (complex)?
   - Recommendation: Send full pages object. Sizes are small (HTML strings), no multi-user conflict possible (websites are per-user). Simpler code.

2. **Publish clears chat history for all pages or current page only?**
   - What we know: Current `handlePublish` sends `{ chat_history: [] }`. With per-page chat, clearing `{}` (empty object) clears all pages.
   - What's unclear: User expectation — clear all page histories on publish, or just the current page?
   - Recommendation: Clear all page histories on publish (send `{ chat_history: {} }`). Publishing is a "ship it" action that implies a clean slate for all pages. Use `{}` not `[]` since the new shape is an object.

3. **Export button disabled state — what counts as "has content"?**
   - What we know: UI-SPEC says "disabled when website has no pages content yet."
   - What's unclear: Disabled if `pages` is null/empty OR if all pages have empty HTML strings?
   - Recommendation: Disabled if `Object.values(pages).every(html => !html.trim())`. This handles both null pages and pages with blank HTML.

---

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/db/schema.ts`, `src/app/api/websites/[id]/route.ts`, `src/app/api/ai/generate-html/route.ts`, `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx`, `src/app/(public)/[username]/[slug]/route.ts`
- `.planning/phases/13-multi-page-website-support/13-CONTEXT.md` — all locked decisions
- `.planning/phases/13-multi-page-website-support/13-UI-SPEC.md` — UI contract
- `package.json` — confirmed installed dependencies and versions
- npm registry: `npm view fflate version` → `0.8.2`, `npm view jszip version` → `3.10.1`

### Secondary (MEDIUM confidence)
- Postgres `jsonb_set` with `ARRAY[param]` path syntax — standard Postgres JSONB documentation behavior
- `fflate` API: `zipSync`, `strToU8` — from npm package README

### Tertiary (LOW confidence)
- None — all findings verified against codebase or npm registry

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified in codebase or npm registry
- Architecture: HIGH — patterns derived from existing code; Next.js nested routes are standard
- Pitfalls: HIGH — identified from direct code reading of files that will be modified
- DB migration: HIGH — SQL confirmed against existing JSONB usage pattern in schema.ts

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (30 days — stable stack)
