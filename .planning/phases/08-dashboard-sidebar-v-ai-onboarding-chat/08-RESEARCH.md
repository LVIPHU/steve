# Phase 8: Dashboard Sidebar và AI Onboarding Chat - Research

**Researched:** 2026-03-19
**Domain:** Next.js App Router layout refactor, React client components, DB schema migration, codebase cleanup
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Sidebar Layout:**
- Left sidebar cố định, 240px width, `bg-card border-r`
- Wrap `(dashboard)/layout.tsx` — tất cả dashboard pages tự động có sidebar, không cần sửa từng page
- Editor page (`/dashboard/websites/[id]/edit`) giữ nguyên full-screen, không có sidebar
- Mobile: sidebar ẩn, mở bằng hamburger button

**Sidebar Navigation Items:**
- Brand area (top): text "AppGen" bold + tagline nhỏ "Tạo web từ note"
- Nav items: **Dashboard** và **Websites** (chỉ 2 items)
- Active state: `bg-accent rounded-md text-foreground font-medium`
- Hover state: `bg-accent/50`
- User area (bottom): Avatar (initials fallback) + username + Sign out button
- Dark mode: tự động qua CSS variables (`bg-card`, `border-border`, `text-foreground`)

**AI Chat trên /dashboard/:**
- `/dashboard/` luôn luôn là AI chat — không phân biệt user mới/cũ, không có conditional logic
- Mỗi lần vào `/dashboard/` là chat mới (reset, không lưu DB)
- UI: centered card với chat bubbles (AI bên trái, user bên phải) — consistent với editor chat Phase 7
- Bot flow: hỏi 2 câu → summarize → show CTA button
  1. "Website của bạn về chủ đề gì?"
  2. "Mục tiêu website này là gì?"
  → Bot tóm tắt → hiển thị [Tạo website này!]
- Click [Tạo website này!]: POST `/api/websites` tạo DB record → redirect `/dashboard/websites/{id}/edit?prompt=...`
- Auto-generate trong editor (hành vi hiện tại từ Phase 7 giữ nguyên)
- AI model: GPT-4o (cùng với HTML generation)
- Endpoint mới: `POST /api/ai/onboarding-chat` hoặc reuse pattern từ generate-html

**Editor Chat History (Persistent):**
- Thêm column `chat_history JSONB` vào bảng `websites`
- Editor load `chat_history` từ DB khi mở (persistent across sessions)
- Auto-save sau mỗi message thành công
- Publish → set `chat_history = []` trong DB + reset chat UI trong editor
- Chat history format: `[{ role: "user" | "assistant", content: string, timestamp: string }]`

**Xóa /websites/new:**
- Remove hoàn toàn `src/app/(dashboard)/dashboard/websites/new/` directory
- Update sidebar "Websites" link → `/dashboard/websites` (list)

**DB Schema Cleanup — Xóa các cột:**
- `content JSONB` — WebsiteAST cũ
- `templateId text` — template system đã bỏ từ Phase 7
- `seoMeta JSONB` — SEO meta từ AST system
- `syncStatus text` — note sync feature (Phase 5)
- `lastSyncedAt timestamp` — note sync feature (Phase 5)

**DB Schema Cleanup — Thêm cột mới:**
- `chat_history JSONB` — lịch sử chat per-website

**Codebase Cleanup — Files/directories to delete:**
- `src/app/(dashboard)/dashboard/websites/new/`
- `src/components/sections/`
- `src/components/layouts/`
- `src/types/website-ast.ts`
- `src/lib/ast-utils.ts`
- `src/lib/ai-prompts.ts`
- `src/app/api/ai/generate/route.ts`
- `src/app/api/ai/regenerate-section/route.ts`
- `src/app/api/sync/trigger/route.ts`
- `src/lib/templates.ts`

### Claude's Discretion
- Exact avatar initials generation logic (first letter of name/email)
- Sidebar animation khi mở/đóng trên mobile
- Bot greeting message wording
- Loading state trong chat khi bot đang trả lời
- Auto-save debounce timing cho chat_history

### Deferred Ideas (OUT OF SCOPE)
- Note sync feature (syncStatus/lastSyncedAt) — đã xóa khỏi schema; có thể reimplemented trong milestone 2 nếu cần
- OG image regeneration cho published HTML pages — future phase
- Dashboard chat có thể query/discuss existing websites — future phase
- Settings page trong sidebar — future phase
</user_constraints>

---

## Summary

Phase 8 là một refactor phase thuần túy: không thêm tính năng mới mà tái cấu trúc lại dashboard UX theo 3 hướng. Thứ nhất, thay top navbar bằng left sidebar cố định 240px bao quanh toàn bộ `(dashboard)` layout — ngoại trừ editor page vốn đã là full-screen standalone. Thứ hai, biến `/dashboard/` thành AI onboarding chat wizard (2 câu hỏi → summary → tạo website), thay thế trang welcome tĩnh hiện tại và đồng thời xóa form `/websites/new`. Thứ ba, dọn dẹp toàn bộ codebase AST cũ (sections, layouts, templates, ai-prompts, ast-utils) và schema DB (5 columns bị xóa, 1 column mới `chat_history` được thêm).

Tất cả thành phần cần thiết đã có sẵn trong codebase: `MessageBubble` pattern từ `editor-client.tsx` có thể reuse nguyên vẹn cho onboarding chat, `authClient.signOut()` đã dùng trong `dashboard-nav.tsx`, Drizzle schema đã rõ ràng. Hai shadcn components cần install thêm: `avatar` và `sheet` (chưa có trong `src/components/ui/`). Schema migration thực hiện bằng direct SQL ALTER TABLE (pattern đã thiết lập từ Phase 5 và 7 do drizzle-kit push bug với CHECK constraints).

**Primary recommendation:** Chia phase thành 4 plans: (1) sidebar layout + shadcn installs, (2) dashboard AI chat + xóa /websites/new, (3) editor chat history persistence, (4) DB schema cleanup + codebase deletion + typecheck.

---

## Standard Stack

### Core (đã có trong project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 16 | Layout nesting, route groups | Project foundation |
| React 19 | 19 | UI components | Project foundation |
| `motion/react` | installed | Sidebar/message animations | Đã dùng ở dashboard-nav + editor |
| `usePathname` (next/navigation) | built-in | Active nav item detection | Next.js standard pattern |
| `authClient` from `@/lib/auth-client` | installed | signOut() trong sidebar | Đã dùng trong dashboard-nav |
| `auth.api.getSession` from `@/lib/auth` | installed | Server-side session check | Đã dùng trong tất cả layout |
| Drizzle ORM + postgres.js | installed | DB queries + schema update | Project foundation |
| Tailwind CSS v4 | installed | All styling via CSS vars | Project foundation |

### shadcn Components cần install
| Component | Status | Install Command | Phase 8 Usage |
|-----------|--------|----------------|---------------|
| `avatar` | **Missing** | `npx shadcn add avatar` | Sidebar user area — initials fallback |
| `sheet` | **Missing** | `npx shadcn add sheet` | Mobile sidebar drawer |

### shadcn Components đã có
| Component | Status | Phase 8 Usage |
|-----------|--------|---------------|
| `button` | Installed | Sidebar sign out, chat send, CTA |
| `textarea` | Installed | Chat input |
| `scroll-area` | Installed | Chat message list |
| `separator` | Installed | Sidebar divider |
| `skeleton` | Installed | Bot thinking state |

**Installation:**
```bash
npx shadcn add avatar sheet
```

---

## Architecture Patterns

### Recommended Project Structure After Phase 8

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx              # ADD: sidebar wrapper + pass user prop
│   │   └── dashboard/
│   │       ├── dashboard-nav.tsx   # DELETE: replaced by sidebar in layout
│   │       ├── page.tsx            # REPLACE: AI onboarding chat component
│   │       └── websites/
│   │           ├── [id]/edit/      # UNCHANGED: full-screen, no sidebar
│   │           │   ├── editor-client.tsx  # UPDATE: add chat_history load/save/clear
│   │           │   └── page.tsx    # UPDATE: pass chatHistory prop
│   │           ├── new/            # DELETE entire directory
│   │           ├── page.tsx        # UPDATE: remove DashboardNav, remove /new link
│   │           └── websites-poller.tsx  # KEEP unchanged
│   └── api/
│       ├── ai/
│       │   ├── generate/           # DELETE route.ts
│       │   ├── regenerate-section/ # DELETE route.ts
│       │   └── generate-html/      # KEEP
│       │   └── onboarding-chat/    # NEW: POST endpoint for 2-question chat
│       ├── sync/trigger/           # DELETE route.ts
│       └── websites/[id]/          # UPDATE: add chat_history field, remove content/seoMeta
├── components/
│   ├── layouts/                    # DELETE entire directory
│   ├── sections/                   # DELETE entire directory
│   ├── sidebar.tsx                 # NEW: DashboardSidebar client component
│   └── ui/                         # ADD avatar.tsx, sheet.tsx
├── db/
│   └── schema.ts                   # UPDATE: remove 5 cols, add chat_history
├── lib/
│   ├── ast-utils.ts                # DELETE
│   ├── ai-prompts.ts               # DELETE
│   └── templates.ts                # DELETE
└── types/
    └── website-ast.ts              # DELETE
```

### Pattern 1: Layout-level Sidebar (Server Component + Client Component split)

**What:** `(dashboard)/layout.tsx` là Server Component — fetch session + profile, render `<DashboardSidebar user={...}>{children}</DashboardSidebar>`. Sidebar component là Client Component vì cần `usePathname()` và mobile Sheet state.

**When to use:** Khi sidebar cần session data từ server nhưng cần interactivity (active state, mobile toggle) từ client.

**Example pattern:**
```typescript
// (dashboard)/layout.tsx — Server Component
export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  // ... profile check ...
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar user={session.user} />
      <main className="flex-1 md:ml-[240px]">{children}</main>
    </div>
  );
}

// components/sidebar.tsx — "use client"
export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // ...
}
```

**CRITICAL:** Editor page (`/dashboard/websites/[id]/edit`) hiện tại render `<HtmlEditorClient>` là full-screen `h-screen`. Khi layout thêm `md:ml-[240px]` vào `<main>`, editor sẽ bị offset. Cần override: editor page có thể dùng `className="fixed inset-0 z-50"` hoặc layout dùng `className={isEditorPage ? "w-full" : "md:ml-[240px]"}`. Cách đơn giản nhất: `(dashboard)/layout.tsx` không wrap `<main>` với ml — thay vào đó mỗi non-editor page tự có `ml-[240px]` padding. Hoặc dùng nested layout trong `(dashboard)/dashboard/` riêng.

### Pattern 2: Editor Page Sidebar Exclusion

**Options (best first):**

**Option A — Nested layout (recommended):** Tạo `(dashboard)/dashboard/layout.tsx` để wrap sidebar chỉ trong `/dashboard/**` routes. Editor page nằm ở `(dashboard)/dashboard/websites/[id]/edit/` cũng nằm trong route group này. Để exclude editor, cần tạo một nested route group `(editor)` chứa editor hoặc editor page override layout.

**Option B — CSS override trong editor:** Editor's `HtmlEditorClient` đã có `className="flex flex-col h-screen"` và `fixed top-0 left-0 right-0` topbar. Thêm `fixed inset-0 z-40 bg-background` wrapper trong editor để phủ lên sidebar. Approach này đơn giản, không đổi routing.

**Option C — Layout check via pathname:** Layout server component check URL để quyết định render sidebar hay không. Không khuyến khích vì layout không có access `usePathname`.

**Recommendation:** Option B — editor wrap `<div className="fixed inset-0 z-40 bg-background">`. Zero routing changes, zero risk to editor page.

### Pattern 3: AI Onboarding Chat Flow (Stateful, no DB)

**What:** Client component pure state machine — `chatPhase: "q1" | "q2" | "confirm" | "creating"`. Bot messages hardcoded, user input xử lý local. API call chỉ khi click CTA.

```typescript
// Chat phase state machine
type ChatPhase = "q1" | "q2" | "summarizing" | "confirm" | "creating";

// Onboarding chat không cần /api/ai/onboarding-chat cho flow chính
// Bot messages là static strings — không cần OpenAI cho 2-question flow
// OpenAI chỉ cần nếu muốn dynamic summary — nhưng có thể dùng template string
// "Tuyệt! Mình sẽ tạo website về [topic], mục tiêu [goal]."

// CTA click: POST /api/websites (tạo record) → redirect to /edit?prompt=...
```

**Simplification insight:** Flow 2-câu-hỏi không cần AI endpoint cho conversation — bot responses là hardcoded strings theo phase. Chỉ cần AI cho việc generate HTML trong editor (đã có từ Phase 7). `POST /api/ai/onboarding-chat` endpoint có thể là optional (dùng nếu muốn AI tạo dynamic summary), hoặc skip hoàn toàn nếu dùng template string.

### Pattern 4: Editor Chat History Persistence

**What:** Load `chat_history` từ DB khi editor mount → populate `messages` state. Auto-save sau mỗi successful exchange với 500ms debounce. Publish → PATCH `chat_history=[]` + reset state.

**DB format:**
```typescript
type ChatHistoryItem = {
  role: "user" | "assistant" | "error";
  content: string;
  timestamp: string; // ISO string (Date serializes to string in JSON)
};
```

**Note on current `ChatMessage` type:** `timestamp` là `Date` trong runtime state nhưng phải serialize thành `string` khi lưu DB (JSON). Khi load từ DB, cần `new Date(item.timestamp)` để convert lại. Hoặc thay type để `timestamp: string` luôn.

### Pattern 5: DB Schema Cleanup via Direct SQL

**Established pattern (từ Phase 5 + 7):** drizzle-kit push có upstream bug với CHECK constraints. Dùng direct SQL:

```sql
-- Xóa columns
ALTER TABLE websites
  DROP COLUMN content,
  DROP COLUMN template_id,
  DROP COLUMN seo_meta,
  DROP COLUMN sync_status,
  DROP COLUMN last_synced_at;

-- Thêm column mới
ALTER TABLE websites
  ADD COLUMN chat_history JSONB;
```

**AFTER SQL:** Cập nhật `src/db/schema.ts` để sync với DB thực. Sau đó `npm run typecheck` để catch tất cả references đến deleted columns.

### Anti-Patterns to Avoid

- **Dùng `usePathname()` trong Server Component:** `usePathname` chỉ dùng được trong Client Components. Sidebar phải là `"use client"`.
- **Render sidebar trong editor page layout:** Editor đã có fixed topbar — sidebar gây z-index conflict và layout break.
- **Lưu `timestamp: Date` object vào JSONB:** JSON.stringify converts Date to ISO string, nhưng JSON.parse không tự convert lại. Cần explicit handling.
- **Delete files trước khi fix TypeScript errors:** Xóa file mà không update references gây cascade TS errors khó debug. Delete theo thứ tự: fix references → delete file.
- **`drizzle-kit push` cho ALTER TABLE:** Dùng direct SQL, không dùng drizzle-kit push cho schema changes trên Supabase (established pattern).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mobile sidebar drawer | Custom slide-in div | shadcn `Sheet` | Built-in accessibility, animation, backdrop, close-on-outside-click |
| User avatar với initials | Custom div với letter | shadcn `Avatar` | Built-in fallback logic, accessible |
| Active route detection | URL string comparison | `usePathname()` from `next/navigation` | Handles query strings, hash, dynamic segments correctly |
| Chat message scroll | Manual scroll logic | `ScrollArea` (đã có) | Already used in editor-client.tsx |

**Key insight:** Phase 8 reuses all patterns from Phase 7. Zero new libraries needed except avatar + sheet.

---

## Common Pitfalls

### Pitfall 1: Editor Page Layout Conflict
**What goes wrong:** `(dashboard)/layout.tsx` thêm `<DashboardSidebar>` wrapper → editor page bị offset 240px từ left, `h-screen` layout bị break.
**Why it happens:** Editor dùng `fixed` topbar và `flex flex-col h-screen` — nếu parent có `ml-[240px]`, editor content bị shift.
**How to avoid:** Wrap `<HtmlEditorClient>` root div với `fixed inset-0 z-40 bg-background` — phủ hoàn toàn lên sidebar, giống full-screen modal.
**Warning signs:** Editor page có horizontal scrollbar hoặc layout break sau khi thêm sidebar.

### Pitfall 2: `DashboardNav` còn được import sau khi bị xóa
**What goes wrong:** `websites/page.tsx` và `dashboard/page.tsx` đều import `DashboardNav`. Sau khi xóa `dashboard-nav.tsx`, TypeScript error sẽ block build.
**Why it happens:** Có ít nhất 2 pages import `DashboardNav`: `dashboard/page.tsx` (line 11) và `dashboard/websites/page.tsx` (line 8).
**How to avoid:** Remove `DashboardNav` import và usage từ cả 2 files TRƯỚC KHI delete `dashboard-nav.tsx`.

### Pitfall 3: `action.ts` trong `/websites/new/` reference `templateId`, `content`, `seoMeta`
**What goes wrong:** `new/action.ts` line 28-30 set `templateId: null, content: null, seoMeta: null` — sau khi xóa DB columns, Drizzle type sẽ error.
**Why it happens:** Action được viết cho schema cũ.
**How to avoid:** Delete `new/` directory trước khi schema cleanup, hoặc cleanup schema cuối cùng sau khi đã xóa tất cả references.

### Pitfall 4: `website-card.tsx` và `SyncBadge` reference `syncStatus`/`lastSyncedAt`
**What goes wrong:** `WebsiteCard` prop type `Website` sẽ thiếu `syncStatus` và `lastSyncedAt` sau khi xóa DB columns → TypeScript error.
**Why it happens:** `SyncBadge` component trong `website-card.tsx` dùng cả 2 fields (lines 313-314).
**How to avoid:** Xóa `SyncBadge` component và usage tại line 313 từ `website-card.tsx` trong cùng plan với schema cleanup.

### Pitfall 5: `WebsitesPoller` và polling logic
**What goes wrong:** `WebsitesPoller` có thể refresh để show sync status — sau khi xóa syncStatus, polling vẫn hoạt động nhưng vô nghĩa.
**Why it happens:** Poller design cho sync feature từ Phase 5.
**How to avoid:** `websites-poller.tsx` có thể giữ nguyên (router.refresh() vẫn valid) hoặc remove nếu không cần. Research thực tế: giữ nguyên để không break websites page — polling không gây harm.

### Pitfall 6: Chat `timestamp` serialization
**What goes wrong:** `ChatMessage.timestamp` là `Date` trong runtime. Khi PATCH `chat_history` to DB, JSON.stringify converts Date → ISO string. Khi load lại, giá trị là string không phải Date → `toLocaleTimeString()` throws.
**Why it happens:** JS Date objects serialize to strings in JSON automatically.
**How to avoid:** Khi load `chat_history` từ DB trong editor, map each item: `{ ...item, timestamp: new Date(item.timestamp) }`. Hoặc thay type `timestamp: string` trong chat history type và dùng `new Date(msg.timestamp).toLocaleTimeString(...)`.

### Pitfall 7: `(dashboard)/layout.tsx` hiện tại chỉ return `<>{children}</>`
**What goes wrong:** Hiện tại layout không render UI, chỉ check auth. Khi thêm sidebar wrapper, phải đảm bảo layout giờ cũng pass `user` data xuống sidebar.
**Why it happens:** Layout trước chỉ guard, không render nav.
**How to avoid:** Sidebar nhận `user` prop từ layout server component — layout đã có `session.user` từ `auth.api.getSession()`.

---

## Code Examples

Verified patterns from existing codebase:

### MessageBubble (từ editor-client.tsx — reuse nguyên vẹn)
```typescript
// Source: src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx lines 33-65
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isError = message.role === "error";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div className="max-w-[80%]">
        <div className={`rounded-lg px-3 py-2 text-sm ${
          isUser ? "bg-primary text-primary-foreground"
            : isError ? "bg-destructive/10 text-destructive"
            : "bg-muted text-foreground"
        }`}>
          {message.content}
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}
```

### Auto-save debounce (từ editor-client.tsx — same pattern cho chat_history)
```typescript
// Source: src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx lines 89-94
const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

function scheduleAutoSave(html: string) {
  if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
  saveTimeoutRef.current = setTimeout(() => {
    void handleSave(html);
  }, 500);
}
// Same pattern for chat_history: scheduleAutoSaveChatHistory(messages)
```

### PATCH API pattern (từ /api/websites/[id]/route.ts — extend cho chat_history)
```typescript
// Source: src/app/api/websites/[id]/route.ts
// Thêm vào sau "html_content" block:
if ("chat_history" in body) {
  const chatHistory = body.chat_history;
  if (!Array.isArray(chatHistory)) {
    return Response.json({ error: "chat_history must be an array" }, { status: 400 });
  }
  updateSet.chatHistory = chatHistory;
}
```

### Sidebar active state với usePathname
```typescript
// Standard Next.js pattern
"use client";
import { usePathname } from "next/navigation";

const pathname = usePathname();
const isActive = (href: string) =>
  href === "/dashboard" ? pathname === href : pathname.startsWith(href);

// Apply: className={cn("px-3 py-2 rounded-md text-sm",
//   isActive(href) && "bg-accent text-foreground font-medium"
// )}
```

### signOut pattern (từ dashboard-nav.tsx — copy vào sidebar)
```typescript
// Source: src/app/(dashboard)/dashboard/dashboard-nav.tsx lines 33-45
authClient.signOut({
  fetchOptions: {
    onSuccess: () => { window.location.href = "/"; },
  },
})
```

### Direct SQL schema migration (established pattern)
```sql
-- Pattern từ Phase 5 + 7 (drizzle-kit push có bug)
-- Run via Supabase SQL editor hoặc psql:
ALTER TABLE websites
  DROP COLUMN IF EXISTS content,
  DROP COLUMN IF EXISTS template_id,
  DROP COLUMN IF EXISTS seo_meta,
  DROP COLUMN IF EXISTS sync_status,
  DROP COLUMN IF EXISTS last_synced_at,
  ADD COLUMN IF NOT EXISTS chat_history JSONB;
```

### POST /api/websites tạo website từ chat (thay thế action.ts)
```typescript
// New API Route Handler (không dùng Server Action để có error handling tốt hơn)
// POST /api/websites — body: { name, prompt }
const res = await fetch("/api/websites", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: derived_name, prompt: full_context }),
});
const { id } = await res.json();
router.push(`/dashboard/websites/${id}/edit?prompt=${encodeURIComponent(prompt)}`);
```

**Note:** Hiện tại `POST /api/websites` chưa tồn tại — chỉ có `/api/websites/[id]` PATCH/DELETE. Cần tạo mới `src/app/api/websites/route.ts` với POST handler, hoặc dùng Server Action pattern tương tự `new/action.ts`.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Top navbar (`DashboardNav`) | Left sidebar fixed 240px | Phase 8 | Persistent nav, more space for content |
| Website creation via form (`/websites/new`) | AI chat wizard at `/dashboard/` | Phase 8 | Conversational onboarding, no form |
| Chat history ephemeral (session only) | `chat_history JSONB` in DB | Phase 8 | Editor chat survives page refresh |
| WebsiteAST JSON content model | Raw HTML (`htmlContent TEXT`) | Phase 7 | HTML-first, Lovable-style editing |
| 5-template system | No templates (direct HTML gen) | Phase 7 | Simpler, more flexible output |

**Deprecated/outdated (to delete in Phase 8):**
- `src/components/sections/`: 11 section components — replaced by HTML-first approach
- `src/components/layouts/`: 5 template layouts — replaced by raw HTML serving
- `src/types/website-ast.ts`: WebsiteAST type — replaced by `htmlContent` column
- `src/lib/ast-utils.ts`: parseAndValidateAST, resolveField — no AST to parse
- `src/lib/ai-prompts.ts`: JSON AST prompts — replaced by `html-prompts.ts`
- `src/lib/templates.ts`: template system — no templates in Phase 7+
- `src/app/api/ai/generate/route.ts`: JSON AST generation endpoint — replaced by `generate-html`
- `src/app/api/ai/regenerate-section/route.ts`: per-section regen — no sections in Phase 7+
- `src/app/api/sync/trigger/route.ts`: note sync endpoint — `syncStatus` column removed

---

## Critical Implementation Details

### Editor Page Sidebar Exclusion — Exact Approach

Editor page hiện tại: `HtmlEditorClient` root là `<div className="flex flex-col h-screen bg-background overflow-hidden">`. Topbar là `<header className="fixed top-0 left-0 right-0 h-12 z-10 ...">`.

Khi layout thêm sidebar, `<main className="flex-1 md:ml-[240px]">` sẽ push content → editor's fixed topbar vẫn `left-0 right-0` nhưng main content bị offset.

**Recommended fix (minimal change):** Đổi editor `root div` thành `fixed inset-0 z-40 bg-background` → editor phủ toàn màn hình, sidebar nằm dưới (z-index thấp hơn). Editor topbar vẫn `fixed top-0 left-0 right-0 z-50` (z-index cao hơn z-40 wrapper). Không cần thay đổi routing.

### Creating Website từ Onboarding Chat — API Decision

**Option A:** Dùng `fetch("POST /api/websites/route.ts")` — cần tạo mới route handler.
**Option B:** Dùng `router.push` về Server Action trong một hidden form — phức tạp cho Client Component.
**Option C:** Reuse pattern của `new/action.ts` nhưng expose as regular API route.

**Recommendation:** Tạo `src/app/api/websites/route.ts` với POST handler (tương tự `new/action.ts` nhưng là JSON API). Dashboard chat là Client Component nên cần fetch API, không dùng được Server Action trực tiếp.

### Onboarding Chat — AI Endpoint Decision

CONTEXT.md nói "Endpoint mới: `POST /api/ai/onboarding-chat` hoặc reuse pattern từ generate-html". Phân tích flow:

- Question 1, 2: **không cần AI** — hardcoded bot strings theo phase
- Summary message: **có thể template string** — "Tuyệt! Mình sẽ tạo website về [topic], mục tiêu [goal]." với user inputs interpolated
- CTA click: `POST /api/websites` tạo record → redirect với prompt = `topic + goal` concatenated

**Conclusion:** Không cần `POST /api/ai/onboarding-chat` endpoint nào cả. Bot là pure client-side state machine với hardcoded messages. OpenAI chỉ được gọi sau khi user redirect sang editor (Phase 7 flow). This simplifies Phase 8 significantly.

---

## Open Questions

1. **`POST /api/websites` route hay Server Action?**
   - What we know: Dashboard chat là "use client" → cần fetch API, không dùng Server Action trực tiếp
   - What's unclear: Liệu có thể dùng `router.push` với embedded Server Action trong onboarding page không
   - Recommendation: Tạo `POST /api/websites/route.ts` (route handler) — sạch hơn, consistent với REST pattern

2. **`chat_history` timestamp type trong DB**
   - What we know: `ChatMessage.timestamp` là `Date` object trong runtime; JSON.stringify → ISO string
   - What's unclear: Nên change type ở layer nào — DB type vs UI type
   - Recommendation: Định nghĩa `ChatHistoryItem` với `timestamp: string` cho DB storage. Trong UI, khi render dùng `new Date(item.timestamp).toLocaleTimeString(...)`.

3. **Thứ tự cleanup để minimize TypeScript cascading errors**
   - What we know: Nhiều files import từ files sẽ bị xóa
   - Recommendation: Thứ tự: (1) Remove references in kept files first, (2) Delete files without dependents first, (3) Delete files with dependents last, (4) Run typecheck.

---

## Validation Architecture

`workflow.nyquist_validation` key không có trong `.planning/config.json` → treat as enabled.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `npm run test` |
| Full suite command | `npm run test` |

### Current Test Files
- `src/tests/slugify.test.ts` — tests for `generateSlug()`
- `src/tests/templates.test.ts` — tests for template system (sẽ BREAK sau khi xóa `templates.ts`)

### Phase Requirements → Test Map
| Req | Behavior | Test Type | Command | Note |
|-----|----------|-----------|---------|------|
| Sidebar renders | Sidebar visible với nav items | manual | Visual check | UI component |
| Active state | usePathname active detection | manual | Visual check | Client-side nav |
| AI chat flow | 2-question → summary → CTA | manual | Visual check | UI interaction |
| Chat history persist | Reload editor → messages remain | manual | Visual check | DB integration |
| Publish clears history | After publish, chat_history=[] | manual | Visual check | DB integration |
| TypeScript clean | No TS errors after cleanup | automated | `npm run typecheck` | Critical gate |
| `generateSlug` still works | Slug utility unaffected | automated | `npm run test src/tests/slugify.test.ts` | Keep test |

### Wave 0 Gaps
- [ ] `src/tests/templates.test.ts` — covers deleted `templates.ts` → **must delete this test file** when deleting `templates.ts`
- [ ] No new test files needed — Phase 8 changes are UI + cleanup, not pure business logic functions

**TypeCheck as primary gate:** `npm run typecheck` phải pass sau tất cả deletions. Đây là verification quan trọng nhất cho phase này.

---

## Sources

### Primary (HIGH confidence)
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` — MessageBubble pattern, chat flow, auto-save debounce, signOut pattern
- `src/app/api/websites/[id]/route.ts` — PATCH handler pattern
- `src/db/schema.ts` — current schema columns (confirmed which columns exist)
- `src/app/(dashboard)/layout.tsx` — current layout (returns `<>{children}</>`, no sidebar)
- `src/app/(dashboard)/dashboard/dashboard-nav.tsx` — current nav, signOut pattern
- `src/app/(dashboard)/dashboard/websites/page.tsx` — DashboardNav import, /websites/new link
- `src/components/website-card.tsx` — SyncBadge usage of syncStatus/lastSyncedAt
- `src/components/ui/` — confirmed avatar.tsx and sheet.tsx are NOT installed

### Secondary (MEDIUM confidence)
- `.planning/phases/08-dashboard-sidebar-v-ai-onboarding-chat/08-CONTEXT.md` — all implementation decisions
- `.planning/phases/08-dashboard-sidebar-v-ai-onboarding-chat/08-UI-SPEC.md` — UI design contract
- `.planning/STATE.md` — key decisions từ Phase 5, 7 về direct SQL ALTER TABLE

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries confirmed from codebase scan
- Architecture: HIGH — patterns verified in existing source files
- Pitfalls: HIGH — identified from direct source code reading (specific line numbers)
- Cleanup scope: HIGH — all files to delete confirmed by reading directory structure

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable — no fast-moving dependencies)
