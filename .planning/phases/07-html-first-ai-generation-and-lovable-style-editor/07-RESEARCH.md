# Phase 7: HTML-first AI Generation and Lovable-style Editor — Research

**Researched:** 2026-03-19
**Domain:** Next.js App Router — AI route handlers, iframe srcdoc, Drizzle schema migration, landing page
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Creation Flow**
- Remove template picker entirely — single `name` input + `promptText` textarea ("Mô tả app/website của bạn")
- Server action creates DB record with no `templateId`, redirects to `/dashboard/websites/${id}/edit?prompt=${encodeURIComponent(promptText)}`
- Prompt passed via URL (max 500 chars) so editor can auto-trigger generation on first load
- No template selection step — template concept is gone

**Editor Layout (Lovable-style)**
- Full-screen layout: fixed topbar + 2-column content area
- Left 60%: iframe preview with `srcdoc` attribute
- Right 40%: panel with 2 tabs — "Chat" (default) and "Code"
- Auto-generate on mount if `!initialHtml && initialPrompt` from URL

**Chat Panel (AI interaction)**
- Conversation-style message history: `{ role: "user" | "assistant", content: string, timestamp: Date }[]`
- User types prompt ("add dark mode", "change button to blue") → POST `/api/ai/generate-html` with `currentHtml`
- Assistant message shows "Đã cập nhật!" — does NOT display raw HTML
- Loading state shown in iframe area while generating (overlay spinner)
- Auto-save after each successful generation

**Code Editor Tab**
- Plain `<textarea>` with monospace font showing raw HTML
- "Apply" button: updates iframe srcdoc + auto-saves to DB
- No syntax highlighting required for MVP

**AI HTML Generation**
- New endpoint: `POST /api/ai/generate-html` — `{ websiteId, prompt, currentHtml? }`
- Uses `gpt-4o`, no `response_format` (text output, not JSON)
- Strip markdown fences post-processing: `html.replace(/^```html?\s*/i, "").replace(/\s*```$/i, "").trim()`
- Timeout: `AbortSignal.timeout(90000)` + `export const maxDuration = 90`
- Fresh generation: system prompt instructs full HTML with embedded CSS/JS
- Edit mode (when `currentHtml` provided): system prompt includes existing HTML, instructs modify-only
- Approved CDNs: Tailwind CDN, Chart.js, Alpine.js — no other external deps
- `localStorage` with namespace prefix for data persistence in generated apps
- Mobile-first responsive design required in every generation

**Public Route**
- Replace `src/app/(public)/[username]/[slug]/page.tsx` with `route.ts`
- Delete `opengraph-image.tsx` (can re-add later)
- GET: draft → 404, archived → plain HTML "Trang đã bị lưu trữ", published → `new Response(htmlContent, { 'Content-Type': 'text/html; charset=utf-8' })`

**Home Page (Landing Page)**
- Rewrite `src/app/page.tsx` as Server Component landing page
- Sections: Hero (headline + 2 CTAs), Features (3 cards), How it works (3 steps), Footer
- CTAs: "Bắt đầu miễn phí" → /register, "Đăng nhập" → /login
- Use Tailwind + existing shadcn Button component
- Vietnamese language throughout

**Database**
- Add `html_content TEXT` column to `websites` table in `src/db/schema.ts`
- Keep existing columns (`content`, `templateId`) for Phase 08 cleanup
- PATCH API (`/api/websites/[id]`) extended to accept `html_content`

**Dashboard Nav**
- Rename brand from "Website Generator" → "AppGen"

### Claude's Discretion
- Exact system prompt wording for HTML generation quality
- iframe loading overlay design
- Message bubble styling in chat panel
- Auto-save debounce timing
- Error state handling in editor

### Deferred Ideas (OUT OF SCOPE)
- Streaming HTML generation (real-time token streaming to iframe)
- Multiple HTML pages / multi-page apps
- Version history / undo for generated HTML
- OG image regeneration for published HTML pages
- Note-to-app flow (mobile sourceNoteId → AI generates HTML from note)
</user_constraints>

---

## Summary

Phase 7 replaces the WebsiteAST/template/section architecture with a simpler HTML-first model. Instead of structured JSON that feeds React components, GPT-4o generates a single self-contained HTML file (inline CSS + JS) stored in a new `html_content TEXT` column. The public route switches from a Next.js page to a raw HTTP route handler that streams the HTML bytes directly to the browser.

The editor becomes a Lovable.dev-style split-pane interface: iframe on the left showing live `srcdoc`, chat panel on the right for natural language edits. The creation form drops the 5-template picker to a single name + prompt form. The home page is rewritten from the placeholder Next.js default into a real Vietnamese landing page.

All building blocks already exist in the codebase. The OpenAI client, auth pattern, PATCH handler pattern, shadcn Tabs/Button/Textarea components, motion animations, and sonner toasts are installed and working. This phase is primarily new composition of existing primitives — the only net-new infrastructure is the `generate-html` API route, the schema column, and the srcdoc editor component.

**Primary recommendation:** Clone `src/app/api/ai/generate/route.ts` as the scaffold for the new `/api/ai/generate-html` route, extend the PATCH handler to whitelist `html_content`, add the Drizzle TEXT column, and replace the editor-client entirely with a new HTML-first version.

---

## Standard Stack

### Core (all already installed — no new npm packages needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `openai` | 6.32.0 | GPT-4o calls for HTML generation | Already in use for generate + regenerate-section |
| `next` | 16.1.6 | Route handlers (route.ts) for raw HTML response | App Router route.ts pattern is the right primitive here |
| `drizzle-orm` | 0.45.1 | Schema change (add TEXT column) | Project ORM — use `db:push` for dev |
| `motion` | 12.36.0 | Chat bubble entry + overlay animations | Already installed (motion/react) |
| `sonner` | 2.0.7 | Toast notifications for save/error | Already wired in editor via `import { toast } from "sonner"` |
| `lucide-react` | 0.577.0 | Loader2 spinner in overlay, ArrowLeft in topbar | Already installed |

### shadcn Components

| Component | Status | Purpose |
|-----------|--------|---------|
| `tabs` | Already installed | Chat / Code tab panel |
| `button` | Already installed | All actions |
| `textarea` | **NEW — must install** | Chat input + code editor textarea |
| `scroll-area` | **NEW — must install** | Scrollable chat message list |
| `dialog` | Already installed | Unsaved changes guard |
| `badge` | Already installed | Website status display in topbar |

**Installation (two new components only):**
```bash
npx shadcn@latest add textarea scroll-area
```

No other npm installs required.

---

## Architecture Patterns

### Recommended File Structure for Phase 7

```
src/
├── app/
│   ├── page.tsx                          # REWRITE — landing page (Server Component)
│   ├── api/
│   │   └── ai/
│   │       └── generate-html/
│   │           └── route.ts             # NEW — HTML generation endpoint
│   ├── (dashboard)/dashboard/
│   │   ├── dashboard-nav.tsx            # EDIT — rename brand to "AppGen"
│   │   └── websites/
│   │       ├── new/
│   │       │   ├── page.tsx             # REWRITE — simplified form (name + prompt)
│   │       │   └── action.ts            # EDIT — remove templateId, add prompt redirect
│   │       └── [id]/
│   │           └── edit/
│   │               ├── page.tsx         # EDIT — pass htmlContent + searchParams.prompt
│   │               └── editor-client.tsx  # REWRITE — HTML-first Lovable layout
│   └── (public)/
│       └── [username]/
│           └── [slug]/
│               ├── page.tsx             # DELETE (replaced by route.ts)
│               ├── opengraph-image.tsx  # DELETE
│               └── route.ts             # NEW — raw HTML route handler
└── db/
    └── schema.ts                        # EDIT — add htmlContent TEXT column
```

### Pattern 1: Raw HTML Route Handler (replaces page.tsx)

Next.js App Router `route.ts` can coexist with `page.tsx` — but NOT in the same segment. The decision to delete `page.tsx` and `opengraph-image.tsx` before creating `route.ts` is mandatory.

```typescript
// src/app/(public)/[username]/[slug]/route.ts
import { db } from "@/db";
import { websites, profiles } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string; slug: string }> }
) {
  const { username, slug } = await params;

  const profileResults = await db.select().from(profiles)
    .where(eq(profiles.username, username)).limit(1);
  if (profileResults.length === 0) {
    return new Response(null, { status: 404 });
  }

  const websiteResults = await db.select().from(websites)
    .where(and(eq(websites.userId, profileResults[0].id), eq(websites.slug, slug)))
    .limit(1);
  if (websiteResults.length === 0) {
    return new Response(null, { status: 404 });
  }

  const website = websiteResults[0];

  if (website.status === "draft") {
    return new Response(null, { status: 404 });
  }

  if (website.status === "archived") {
    return new Response(
      `<!DOCTYPE html><html><body><p>Trang đã bị lưu trữ</p></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const htmlContent = website.htmlContent as string | null;
  if (!htmlContent) {
    return new Response(null, { status: 404 });
  }

  return new Response(htmlContent, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
```

**Confidence:** HIGH — verified against Next.js App Router docs. Route handlers return `Response` directly.

### Pattern 2: Generate-HTML API Route

Clone structure from `/api/ai/generate/route.ts`. Key differences: no `response_format`, 90s timeout via `maxDuration`, text output, strip markdown fences.

```typescript
// src/app/api/ai/generate-html/route.ts
export const maxDuration = 90; // Vercel/Next.js: extend serverless timeout

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { websiteId, prompt, currentHtml } = await request.json();

  // Ownership check (same as generate/route.ts)
  const existing = await db.select().from(websites)
    .where(and(eq(websites.id, websiteId), eq(websites.userId, session.user.id)))
    .limit(1);
  if (existing.length === 0) return Response.json({ error: "Not found" }, { status: 404 });

  const isEdit = Boolean(currentHtml);
  const systemPrompt = isEdit ? buildEditSystemPrompt(currentHtml) : buildFreshSystemPrompt();

  const completion = await openai.chat.completions.create(
    {
      model: "gpt-4o",
      // NO response_format — plain text output
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    },
    { signal: AbortSignal.timeout(90000) }
  );

  const raw = completion.choices[0].message.content ?? "";
  // Strip markdown fences if GPT-4o wraps output
  const html = raw
    .replace(/^```html?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Auto-save to DB
  await db.update(websites)
    .set({ htmlContent: html, updatedAt: new Date() })
    .where(eq(websites.id, websiteId));

  return Response.json({ ok: true, html });
}
```

### Pattern 3: iframe srcdoc — Client-side Live Preview

The `srcdoc` attribute renders an HTML string directly inside the iframe without any network request. This is the key mechanism for the instant preview.

```typescript
// In EditorClient (use client)
const [htmlContent, setHtmlContent] = useState<string>(initialHtml ?? "");

// Update preview instantly — no page reload
function handleHtmlUpdate(newHtml: string) {
  setHtmlContent(newHtml);
  // Note: sandbox attribute omitted per CONTEXT.md (generated apps use localStorage)
}

// In JSX:
<iframe
  srcdoc={htmlContent || undefined}
  className="w-full h-full border border-border rounded"
  title="Website preview"
/>
```

**Critical:** Do NOT set `sandbox` attribute — sandboxed iframes cannot access `localStorage`, which the generated apps depend on for data persistence. The CONTEXT.md decision to use `localStorage` with namespace prefixes makes sandboxing incompatible.

### Pattern 4: Auto-save with Debounce

```typescript
// 500ms debounce after AI generation — not on every keystroke
const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

function scheduleAutoSave(html: string) {
  if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
  saveTimeoutRef.current = setTimeout(() => {
    void saveHtml(html);
  }, 500);
}
```

### Pattern 5: Drizzle Schema — Adding htmlContent Column

```typescript
// src/db/schema.ts — add to websites table
export const websites = pgTable("websites", (t) => ({
  // ... existing columns ...
  htmlContent: t.text("html_content"),  // nullable TEXT, Phase 08 will add NOT NULL
}));
```

After schema change: `npm run db:push` (dev) or `npm run db:generate && npm run db:migrate` (migration file).

### Pattern 6: URL Prompt Pass-Through

The creation server action redirects to the editor with the prompt encoded in the URL query string. The edit page (Server Component) reads `searchParams.prompt` and passes it as a prop.

```typescript
// action.ts
redirect(`/dashboard/websites/${id}/edit?prompt=${encodeURIComponent(promptText)}`);

// edit/page.tsx — read searchParams
type SearchParams = Promise<{ prompt?: string }>;
export default async function EditPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { prompt } = await searchParams;
  // pass initialPrompt to EditorClient
  return <HtmlEditorClient ... initialPrompt={prompt ?? ""} />;
}
```

The EditorClient `useEffect` triggers generation on mount when `!initialHtml && initialPrompt`.

### Anti-Patterns to Avoid

- **Keeping `sandbox` on iframe when using localStorage:** Generated apps use `localStorage` — sandbox blocks storage access. Do not add `sandbox`.
- **Using `page.tsx` AND `route.ts` in the same segment:** Next.js throws a build error. Delete `page.tsx` + `opengraph-image.tsx` first, then create `route.ts`.
- **Using `response_format: json_object` for HTML generation:** The generate-html endpoint produces raw HTML text, not JSON. Omit `response_format` entirely.
- **Storing message history server-side:** Chat messages are ephemeral per-session UI state — store in `useState`, not DB.
- **Blocking the submit on auto-save completion:** Auto-save runs fire-and-forget after successful generation. Don't await it inline.
- **Importing `motion` from `framer-motion`:** Project uses `motion/react` (the successor package already installed).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tab switching | Custom tab state machine | shadcn `Tabs` + `TabsContent` | Already installed; handles ARIA, keyboard nav |
| Scrollable chat history | Custom overflow div | shadcn `ScrollArea` | Handles cross-browser scrollbar styling |
| Toast notifications | Custom alert div | `toast` from `sonner` | Already integrated; consistent with Phase 4 UX |
| Spinner during generation | Custom CSS animation | `Loader2` from `lucide-react` with `animate-spin` | Already used in existing topbar |
| Fade animations | CSS transitions | `motion` from `motion/react` | Already installed; AnimatePresence handles unmount |
| Markdown fence stripping | Complex parser | Single `.replace()` chain | The fence pattern is deterministic — one regex each direction |

**Key insight:** Every UI primitive needed for this phase is already installed. The work is composition, not new dependencies.

---

## Common Pitfalls

### Pitfall 1: `route.ts` + `page.tsx` in Same Segment

**What goes wrong:** Next.js build fails with "You cannot have both a page and a route in the same directory."
**Why it happens:** App Router treats `page.tsx` as the UI handler and `route.ts` as the API handler for the same URL segment — they conflict.
**How to avoid:** Delete `page.tsx` and `opengraph-image.tsx` in `(public)/[username]/[slug]/` before creating `route.ts`. Do this in a single plan task.
**Warning signs:** Build error referencing the segment path during `npm run build`.

### Pitfall 2: GPT-4o Wrapping HTML in Markdown Fences

**What goes wrong:** AI response is `\`\`\`html\n<!DOCTYPE html>...\`\`\`` — setting this as `srcdoc` renders the literal backtick text.
**Why it happens:** GPT-4o defaults to markdown formatting even when instructed not to; temperature and system prompt alone don't guarantee clean output.
**How to avoid:** Always post-process: `html.replace(/^```html?\s*/i, "").replace(/\s*```$/i, "").trim()`. Apply this even if system prompt says "do not use markdown".
**Warning signs:** iframe shows raw text starting with triple backticks.

### Pitfall 3: `maxDuration` vs `AbortSignal.timeout` Mismatch

**What goes wrong:** Vercel serverless function cuts the connection at 60s while the code waits 90s — or the reverse: code aborts at 30s but `maxDuration = 90` lets it run longer than needed.
**Why it happens:** `maxDuration` is the Vercel/Next.js server timeout; `AbortSignal.timeout` is the OpenAI client timeout. They must be set consistently.
**How to avoid:** Set `export const maxDuration = 90` at module level AND `AbortSignal.timeout(90000)` in the OpenAI call. Both values must match.
**Warning signs:** 504 errors earlier than expected, or requests hanging past 90s.

### Pitfall 4: iframe srcdoc and Empty String

**What goes wrong:** Setting `srcdoc=""` renders a blank white iframe even when you want to show an empty state placeholder.
**Why it happens:** An empty string is a valid `srcdoc` value — it renders an empty HTML document.
**How to avoid:** Conditionally pass `srcdoc` — use `srcdoc={htmlContent || undefined}` so the attribute is absent when empty, allowing CSS empty state styling to show.
**Warning signs:** Empty state placeholder div is never visible.

### Pitfall 5: Auto-generate on Mount Race Condition

**What goes wrong:** Component mounts, `useEffect` fires, generation starts — but if the user navigates away and back, a second generation triggers on top of the first.
**Why it happens:** `useEffect` with `initialPrompt` dependency reruns on prop changes.
**How to avoid:** Use a `useRef` flag that tracks whether auto-generation has already been triggered. Set it to `true` on first trigger and gate behind it.

```typescript
const autoGenTriggered = useRef(false);
useEffect(() => {
  if (!initialHtml && initialPrompt && !autoGenTriggered.current) {
    autoGenTriggered.current = true;
    void handleGenerate(initialPrompt);
  }
}, []); // Empty deps — only run on mount
```

### Pitfall 6: Drizzle `db:push` with Existing Data

**What goes wrong:** `db:push` on a table with millions of rows can lock the table. Adding a nullable column to `websites` is safe (it's a simple `ALTER TABLE ADD COLUMN`).
**Why it happens:** Non-nullable columns with no default would fail if rows exist.
**How to avoid:** Add `htmlContent` as nullable (no `.notNull()`) — Drizzle generates a safe `ALTER TABLE ADD COLUMN html_content TEXT` with no default. Safe for dev + production.

### Pitfall 7: `searchParams` in Next.js 16 is a Promise

**What goes wrong:** `searchParams.prompt` is `undefined` because the developer forgets to `await searchParams`.
**Why it happens:** Next.js 15+ made `searchParams` a Promise (same as `params`).
**How to avoid:** Type and `await` searchParams in the Server Component: `const { prompt } = await searchParams;`

---

## Code Examples

### System Prompt (Fresh Generation)

```typescript
function buildFreshSystemPrompt(): string {
  return `You are an expert web developer. Generate a complete, self-contained HTML file.

REQUIREMENTS:
- Single HTML file with ALL CSS embedded in <style> tags and ALL JavaScript in <script> tags
- Mobile-first responsive design using CSS media queries or Tailwind CDN
- You MAY use these CDNs only: Tailwind CSS (cdn.tailwindcss.com), Chart.js (cdn.jsdelivr.net/npm/chart.js), Alpine.js (cdn.jsdelivr.net/npm/alpinejs)
- Use localStorage for any data persistence — prefix all keys with "appgen-" to avoid conflicts
- No external API calls from the generated HTML
- Vietnamese or multilingual content as requested
- Output ONLY the raw HTML — no markdown fences, no explanation

Start your response with <!DOCTYPE html>`;
}
```

### System Prompt (Edit Mode)

```typescript
function buildEditSystemPrompt(currentHtml: string): string {
  return `You are an expert web developer editing an existing website.

CURRENT HTML:
${currentHtml}

TASK: Modify the HTML above based on the user's request. Keep all existing functionality intact.
Apply only the requested changes.

REQUIREMENTS:
- Output the complete updated HTML file — not just the changed parts
- Keep all existing CDN imports (Tailwind, Chart.js, Alpine.js are approved)
- Preserve all localStorage key prefixes (must start with "appgen-")
- Output ONLY the raw HTML — no markdown fences, no explanation

Start your response with <!DOCTYPE html>`;
}
```

### EditorClient Props Interface

```typescript
interface HtmlEditorClientProps {
  websiteId: string;
  websiteName: string;
  initialHtml: string | null;      // from website.htmlContent
  initialPrompt: string;            // from searchParams.prompt (may be empty string)
  websiteStatus: string;            // for publish button state
}
```

### PATCH Handler Extension for html_content

```typescript
// In /api/websites/[id]/route.ts — add after existing "content" field check
if ("html_content" in body) {
  const htmlContent = body.html_content;
  if (typeof htmlContent !== "string") {
    return Response.json({ error: "html_content must be a string" }, { status: 400 });
  }
  updateSet.htmlContent = htmlContent;
}
```

### Creation Action (Simplified)

```typescript
// src/app/(dashboard)/dashboard/websites/new/action.ts
export async function createWebsite(data: {
  name: string;
  promptText: string;
}): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Phiên làm việc hết hạn. Vui lòng đăng nhập lại." };

  const trimmedName = data.name.trim();
  if (!trimmedName) return { error: "Vui lòng nhập tên website" };

  const id = crypto.randomUUID();
  const slug = generateSlug(trimmedName);

  await db.insert(websites).values({
    id,
    userId: session.user.id,
    name: trimmedName,
    slug,
    status: "draft",
    templateId: null,     // no longer used
    content: null,
    seoMeta: null,
    htmlContent: null,
  });

  // Pass prompt via URL — editor auto-generates on mount
  redirect(
    `/dashboard/websites/${id}/edit?prompt=${encodeURIComponent(data.promptText.slice(0, 500))}`
  );
}
```

---

## Existing Code — What to Reuse vs Replace

### Reuse Unchanged
| File | What to Reuse |
|------|--------------|
| `src/lib/auth.ts` / `auth-client.ts` | Auth pattern identical — copy session check verbatim |
| `src/lib/slugify.ts` | `generateSlug()` for slug from website name |
| `src/components/ui/button.tsx` | All buttons |
| `src/components/ui/tabs.tsx` | Chat/Code tab panel |
| `src/components/ui/dialog.tsx` | Unsaved changes guard |
| `import { toast } from "sonner"` | Save/error toasts |
| `motion/react` + `AnimatePresence` | Chat bubble entry, overlay fade |
| `Loader2` from `lucide-react` | Spinner in overlay |
| `ArrowLeft` from `lucide-react` | Topbar back button |

### Replace Entirely
| File | Action |
|------|--------|
| `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` | Full rewrite — new `HtmlEditorClient` |
| `src/app/(dashboard)/dashboard/websites/new/page.tsx` | Full rewrite — drop template picker |
| `src/app/(dashboard)/dashboard/websites/new/action.ts` | Rewrite — remove `templateId`, add prompt redirect |
| `src/app/(dashboard)/dashboard/websites/[id]/edit/page.tsx` | Edit — pass `htmlContent` + `searchParams.prompt` |
| `src/app/page.tsx` | Full rewrite — landing page |
| `src/app/(public)/[username]/[slug]/page.tsx` | Delete |
| `src/app/(public)/[username]/[slug]/opengraph-image.tsx` | Delete |

### Keep Existing Editor Sub-components
The components in `src/app/(dashboard)/dashboard/websites/[id]/edit/components/` are AST-editor specific and will not be used by the new HTML editor. Do NOT delete them in Phase 7 (Phase 08 cleanup). The new editor-client is self-contained.

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Website content as JSON AST | Self-contained HTML blob | HTML-first model — no parsing needed to render |
| Template-based generation | Open-ended HTML generation | No template constraint on output structure |
| page.tsx for public routes | route.ts returning `new Response()` | Direct HTTP response bypasses Next.js rendering overhead |
| `response_format: json_object` | Plain text output + fence stripping | Text mode is faster and appropriate for HTML |
| Editor sidebar with section forms | iframe + chat panel | Natural language replaces field-level UI |

---

## Open Questions

1. **Publish button — should it update `status` only or also verify `htmlContent` is not empty?**
   - What we know: CONTEXT.md says publish button is disabled with tooltip when `html_content` is empty
   - What's unclear: Client-side check vs server-side validation in PATCH handler
   - Recommendation: Client-side disable is sufficient for UX; server can accept the publish status change without HTML content validation (edge case: API direct calls)

2. **`websites` table — does `htmlContent` need a column alias in TypeScript?**
   - What we know: Drizzle uses camelCase in TypeScript (`htmlContent`) for snake_case DB columns (`html_content`)
   - What's unclear: Whether existing `.select()` queries that destructure `website` will need updating
   - Recommendation: After schema change, run `typecheck` to catch any type errors from the new optional column on the `Website` type

3. **What happens to existing websites with `content` (AST) but no `htmlContent`?**
   - What we know: Phase 08 handles cleanup; Phase 07 keeps old columns
   - What's unclear: The website detail page (`/dashboard/websites/${id}`) — does it need a fallback for old AST content?
   - Recommendation: Out of scope for Phase 07. The edit page redirect to `/edit` already handles this case (the new editor will simply show empty state).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `npm run test` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map

| Req | Behavior | Test Type | Automated Command | File Exists? |
|-----|----------|-----------|-------------------|-------------|
| HTML-GEN-01 | Markdown fence stripping removes ` ```html ` wrapper | unit | `npm run test -- --reporter=verbose` (via generate-html.test.ts) | ❌ Wave 0 |
| HTML-GEN-02 | Fresh system prompt contains required CDN list | unit | same | ❌ Wave 0 |
| HTML-GEN-03 | Edit system prompt includes `currentHtml` verbatim | unit | same | ❌ Wave 0 |
| SCHEMA-01 | `htmlContent` column accepted in PATCH handler | integration (manual) | `npm run build` type check | n/a — covered by typecheck |
| ROUTE-01 | Public route returns 404 for draft | manual | curl test | n/a — Route Handler, not testable with Vitest node env |
| ROUTE-02 | Public route returns raw HTML for published | manual | curl test | n/a |

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test && npm run typecheck`
- **Phase gate:** Full suite green + `npm run build` succeeds before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/app/api/ai/generate-html/generate-html.test.ts` — pure function tests for `buildFreshSystemPrompt()`, `buildEditSystemPrompt()`, and the fence-stripping regex. Extract these functions to a testable module.
- [ ] No new test framework install needed — Vitest already configured.

*(Existing tests: `editor-utils.test.ts`, `sync-utils.test.ts`, `ast-utils.test.ts`, `ai-prompts.test.ts`, `templates.test.ts` — all unaffected by Phase 7.)*

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)
- `src/app/api/ai/generate/route.ts` — existing AI route pattern (auth, ownership, OpenAI call, DB write)
- `src/app/api/websites/[id]/route.ts` — PATCH handler extension point
- `src/db/schema.ts` — confirmed `websites` table shape and nullable column pattern
- `src/app/(public)/[username]/[slug]/page.tsx` — file to replace; confirmed `opengraph-image.tsx` sibling exists
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` — full existing editor to replace
- `src/app/(dashboard)/dashboard/websites/new/page.tsx` + `action.ts` — creation flow to simplify
- `src/app/(dashboard)/dashboard/dashboard-nav.tsx` — confirmed "Website Generator" brand text
- `src/app/page.tsx` — confirmed default Next.js placeholder (needs full rewrite)
- `package.json` — confirmed all required packages already installed; only `textarea` + `scroll-area` shadcn components are missing
- `vitest.config.ts` — confirmed test framework and environment

### Secondary (MEDIUM confidence)
- Next.js App Router docs: `route.ts` and `page.tsx` cannot coexist in same segment — confirmed by project's existing use of route handlers in `(api)` group
- `export const maxDuration` — Next.js convention for extending serverless timeout, consistent with how Vercel function limits work

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified against package.json; only 2 shadcn components need install
- Architecture: HIGH — patterns traced directly from working codebase; no speculative APIs
- Pitfalls: HIGH — most derived from concrete code reading (searchParams Promise, srcdoc empty string, route.ts conflict)
- System prompt content: MEDIUM — Claude's Discretion; exact wording tuned at implementation time

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable stack — Next.js 16, OpenAI SDK 6.x, Drizzle 0.45)
