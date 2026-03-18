# Phase 4: Editor - Research

**Researched:** 2026-03-18
**Domain:** React visual editor — dnd-kit drag-and-drop, Supabase Storage, Next.js client state management, Google Fonts dynamic injection
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Editor route & layout**
- Route mới: `/dashboard/websites/[id]/edit` — tách biệt khỏi generate/publish flow ở `/dashboard/websites/[id]`
- Detail page (`[id]/page.tsx`) thêm nút "Edit Website" → navigate sang editor
- Layout 2 cột: preview chiếm ~65% bên trái, sidebar ~35% bên phải
- Topbar riêng (không dùng DashboardNav): `← Back | Website name* | [Save ●]` — dấu `*` hoặc `●` khi có unsaved changes

**Sidebar structure**
- Sidebar có 2 tab: **[Sections]** và **[Theme]**
- Tab Sections: danh sách tất cả sections với icon ☰ drag handle + form edit section đang active bên dưới
- Default state: chỉ hiện section list, không có section nào được chọn
- Click section → expand edit form bên dưới list
- DnD handle ☰ nằm trong section list của sidebar (không phải trong preview)

**Preview mechanism**
- **Render trực tiếp trong React** (không dùng iframe) — dùng `SectionRenderer` + `TemplateRenderer` đã có sẵn
- Click section trong preview → outline/border màu primary highlight + sidebar scroll đến section đó + expand form
- Real-time preview: khi user gõ text trong sidebar, preview cập nhật ngay lập tức (controlled state, chưa save vào DB)
- Responsive toggle ở topbar: Desktop (full width) / Tablet (`max-w-[768px]` centered) / Mobile (`max-w-[390px]` centered)

**Save behavior**
- **Explicit Save button** trong topbar — không auto-save
- Unsaved indicator: dấu `●` hoặc `*` trên Save button khi có thay đổi chưa lưu
- Save thành công → Toast notification ngắn "Đã lưu" xuất hiện rồi biến mất sau 2s
- Gọi `PATCH /api/websites/[id]` với toàn bộ content AST (API đã có sẵn từ Phase 2)
- Khi navigate rời trang mà có unsaved changes → hiện confirm dialog "Bạn có thay đổi chưa lưu. Rời trang?"
- Color/font changes cũng được save cùng Save button (không auto-save riêng)

**Per-section regenerate (S-01)**
- Sidebar edit form của mỗi section có field prompt optional + nút "Regenerate section"
- Regenerate CHỈ cập nhật `ai_content` của section đó — `manual_overrides` không bị xóa
- Prompt field hiển thị trong sidebar: `[Prompt: ________] (optional)` phía trên nút Regenerate
- Cần API mới: `POST /api/ai/regenerate-section` với sectionId + prompt + context

**Image upload (F-13)**
- Upload ảnh → Supabase Storage → URL được set vào field trong `manual_overrides`
- Preview cập nhật ngay sau khi upload thành công (không cần Save)
- Upload flow: sidebar field "Upload image" → loading indicator → preview ảnh hiện ra

**Color & font customization (S-05)**
- **Primary color**: HTML `input[type=color]` free color picker (không dùng preset palette)
- **Font**: Search Google Fonts API → khi chọn font → inject `<link>` tag vào head để load dynamic
- Áp dụng qua CSS variables inline trên preview container: `style={{ '--primary-color': theme.primaryColor, '--font-family': theme.font }}`
- Lưu vào `WebsiteAST.theme.primaryColor` và `WebsiteAST.theme.font`
- Public page (`/[username]/[slug]`) cũng phải load font và apply CSS variables

### Claude's Discretion
- dnd-kit SortableContext implementation chi tiết (vertical list, drag overlay)
- Toast component implementation (tự viết hay dùng sonner/react-hot-toast)
- Exact breakpoints và animation cho sidebar transition
- Supabase Storage bucket name và path convention cho uploaded images
- Google Fonts API key strategy (có thể dùng `https://fonts.googleapis.com/css2?family=...` không cần key)
- Error state khi per-section regenerate thất bại
- Loading skeleton trong preview khi đang regenerate section

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| F-12 | Visual editor — sidebar form: click section → edit fields → lưu | EditorClient state management, SectionRenderer reuse, manual_overrides write pattern |
| F-13 | Image upload lên Supabase Storage | @supabase/supabase-js v2, new upload API, signed URL vs public URL pattern |
| F-14 | Section reorder — kéo thả (dnd-kit) | @dnd-kit/core + @dnd-kit/sortable v10, SortableContext with arrayMove |
| F-15 | Responsive preview — Desktop / Tablet / Mobile toggle | CSS max-width container approach, no iframe needed |
| S-01 | Per-section regenerate — gen lại 1 section cụ thể | New POST /api/ai/regenerate-section, OpenAI completion with section context, partial AST update |
| S-02 | Prompt refinement — nhập thêm prompt để AI tinh chỉnh | Optional prompt field in per-section regenerate form |
| S-05 | Color/font customization — màu chủ đạo, font chữ | input[type=color], Google Fonts CSS2 API (no key), CSS variables injection |
</phase_requirements>

---

## Summary

Phase 4 builds a visual website editor on top of the already-complete rendering infrastructure from Phase 3. All section components, template layouts, and the PATCH API exist — the editor is primarily a state management and UI layer that writes into `manual_overrides` without touching `ai_content`.

The most technically non-trivial pieces are: (1) dnd-kit sortable list in the sidebar — version 10 of `@dnd-kit/sortable` is current and compatible with `@dnd-kit/core` 6.3.1; (2) Supabase Storage upload via `@supabase/supabase-js` — the project uses `postgres.js` directly for DB and does not yet have `@supabase/supabase-js` installed, so upload will need either the Supabase client or a direct REST call to the Storage API; (3) the existing PATCH endpoint does not accept a `content` field — this must be extended before the Save button can work.

**Primary recommendation:** Build the editor as a single large `EditorClient` Client Component holding all mutable state, pass it initial data from the Server Component page, and keep all sub-components defined at module scope (not inline) per the `rerender-no-inline-components` rule that is already established in this codebase.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @dnd-kit/core | 6.3.1 | DnD sensor management, drag context | Required by dnd-kit/sortable |
| @dnd-kit/sortable | 10.0.0 | SortableContext, useSortable, arrayMove | Official sortable preset for vertical lists |
| @dnd-kit/utilities | 3.2.2 | CSS.Transform helpers | Used in transform style application |
| @supabase/supabase-js | 2.99.2 | Supabase Storage upload client | Official Supabase SDK — only needed for Storage in this phase |
| sonner | 2.0.7 | Toast notifications | shadcn-recommended toast solution (replaces shadcn's own radix toast) |

### Supporting (shadcn via `npx shadcn add`)
| Component | Purpose | When to Use |
|-----------|---------|-------------|
| tabs | Sections / Theme tab bar | Sidebar tab switching |
| separator | Visual dividers in sidebar | Between section list and edit form |
| badge | Section type labels | Section list item type indicator |
| dialog | Unsaved changes confirm | Navigate-away guard |
| sonner | Toast wrapper | Save success / error feedback |
| skeleton | Loading states | Image upload, section regenerate |

**Installation:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @supabase/supabase-js sonner
npx shadcn add tabs separator badge dialog skeleton
```

**Version verification (confirmed 2026-03-18):**
- `@dnd-kit/core` → 6.3.1 (npm registry)
- `@dnd-kit/sortable` → 10.0.0 (npm registry)
- `@dnd-kit/utilities` → 3.2.2 (npm registry)
- `@supabase/supabase-js` → 2.99.2 (npm registry)
- `sonner` → 2.0.7 (npm registry)

---

## Architecture Patterns

### Recommended Project Structure
```
src/app/(dashboard)/dashboard/websites/[id]/
├── edit/
│   ├── page.tsx                    # Server Component — fetch website, pass to EditorClient
│   └── editor-client.tsx           # "use client" — all editor state lives here
│   └── components/
│       ├── editor-topbar.tsx       # Back, title, save button
│       ├── editor-sidebar.tsx      # Tab bar wrapper
│       ├── sections-tab.tsx        # Section list + drag handles + active form
│       ├── theme-tab.tsx           # Color picker + font search
│       ├── section-edit-form.tsx   # Field editor per section type
│       └── section-list-item.tsx   # Single draggable row in section list
src/app/api/
├── ai/
│   └── regenerate-section/
│       └── route.ts                # POST — per-section AI regen
└── upload/
    └── image/
        └── route.ts                # POST — Supabase Storage upload
```

### Pattern 1: EditorClient as Single State Owner

**What:** One top-level Client Component holds `ast` (the mutable WebsiteAST), `selectedSectionId`, `hasUnsavedChanges`, `activeTab`, and `previewMode`. All child components receive props and callbacks — no context or Zustand needed at this scale.

**When to use:** Editor has a bounded, single-user interaction model. Prop drilling is 2-3 levels max — acceptable without a state library.

**Example:**
```typescript
// editor-client.tsx
"use client";

import { useState, useCallback } from "react";
import type { WebsiteAST } from "@/types/website-ast";

interface EditorClientProps {
  websiteId: string;
  initialAst: WebsiteAST;
  websiteName: string;
}

export function EditorClient({ websiteId, initialAst, websiteName }: EditorClientProps) {
  const [ast, setAst] = useState<WebsiteAST>(initialAst);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<"sections" | "theme">("sections");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const updateSection = useCallback((sectionId: string, overrides: Record<string, unknown>) => {
    setAst(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, manual_overrides: { ...s.manual_overrides, ...overrides } }
          : s
      ),
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ... rest of editor
}
```

### Pattern 2: dnd-kit Vertical Sortable List

**What:** Wrap the section list in `DndContext` + `SortableContext`. Each list item uses `useSortable`. `DragOverlay` renders a ghost clone during drag. After drop, use `arrayMove` to reorder.

**When to use:** Any vertical drag-to-reorder list where only the handle (GripVertical icon) should initiate drag.

**Example:**
```typescript
// sections-tab.tsx (module scope — do NOT define inside EditorClient)
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";

// Inside the component:
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
);

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    const oldIndex = sections.findIndex(s => s.id === active.id);
    const newIndex = sections.findIndex(s => s.id === over.id);
    onReorder(arrayMove(sections, oldIndex, newIndex));
  }
}

// JSX:
<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
    {sections.map(section => (
      <SortableSectionItem key={section.id} section={section} ... />
    ))}
  </SortableContext>
  <DragOverlay>
    {activeId ? <SectionItemDragClone section={sections.find(s => s.id === activeId)!} /> : null}
  </DragOverlay>
</DndContext>
```

**Handle-only drag:** Pass `activationConstraint` to PointerSensor or use `useSortable`'s `listeners` on only the handle element:
```typescript
// section-list-item.tsx
const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

// Apply listeners ONLY to the grip handle, not the whole row:
<button {...listeners} aria-label="Drag to reorder" className="cursor-grab text-muted-foreground">
  <GripVertical className="h-4 w-4" />
</button>
```

### Pattern 3: PATCH /api/websites/[id] — Content Extension Required

**CRITICAL GAP:** The existing PATCH handler only accepts `name`, `status`, and `slug`. The editor needs to save the full `content` (WebsiteAST JSONB). The endpoint must be extended to accept `content`.

```typescript
// Add to existing PATCH handler in src/app/api/websites/[id]/route.ts
if ("content" in body) {
  const content = body.content;
  if (typeof content !== "object" || content === null || Array.isArray(content)) {
    return Response.json({ error: "content must be an object" }, { status: 400 });
  }
  updateSet.content = content;
  // Also sync seoMeta if seo field present in content
  const ast = content as { seo?: unknown };
  if (ast.seo) {
    updateSet.seoMeta = ast.seo;
  }
}
```

### Pattern 4: Supabase Storage Upload via API Route

**What:** Client calls `POST /api/upload/image` with `multipart/form-data`. Server route reads the file, uploads to Supabase Storage using `@supabase/supabase-js`, returns public URL. Client sets URL into `manual_overrides`.

**Why use an API route instead of direct client upload:** Avoids exposing Supabase service-role key to the browser. The server route authenticates the user first, then uploads with service credentials.

```typescript
// src/app/api/upload/image/route.ts
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // service role — server only
);

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return Response.json({ error: "No file" }, { status: 400 });

  const fileName = `${session.user.id}/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("website-images")  // bucket name — must be created in Supabase dashboard
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("website-images").getPublicUrl(fileName);
  return Response.json({ url: data.publicUrl });
}
```

**Bucket convention:** `website-images` bucket, path `{userId}/{timestamp}-{originalName}`. Bucket must be set to public in Supabase dashboard so `getPublicUrl` works without signed URL expiry.

### Pattern 5: Google Fonts Dynamic Injection (No API Key)

**What:** The Google Fonts CSS2 API works without an API key. Pass the font name as a query param. Inject a `<link>` into `document.head`. Apply via CSS variable on the preview container.

```typescript
// theme-tab.tsx
function injectGoogleFont(fontFamily: string) {
  const id = `gfont-${fontFamily.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return; // already loaded
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;600&display=swap`;
  document.head.appendChild(link);
}
```

**Font search:** Use the Google Fonts web API endpoint (requires API key) OR maintain a hardcoded list of 20-30 popular Google Fonts to avoid the API key requirement. The hardcoded approach is simpler and avoids network overhead.

```typescript
// Recommended: curated list (no API key needed)
const POPULAR_FONTS = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
  "Source Sans Pro", "Raleway", "Ubuntu", "Nunito", "Merriweather",
  "Playfair Display", "PT Serif", "Lora", "Crimson Text",
  "Space Grotesk", "DM Sans", "Plus Jakarta Sans", "Sora", "Outfit"
];
```

Filter client-side on the 300ms debounced input value. On select: call `injectGoogleFont()`, then update `ast.theme.font`.

### Pattern 6: Per-section AI Regenerate

**What:** New `POST /api/ai/regenerate-section` route. Takes `websiteId`, `sectionId`, `sectionType`, and optional `prompt`. Calls OpenAI with a targeted prompt for just that section type. Returns the new `ai_content` for that section only. Client merges it into the section (does NOT touch `manual_overrides`).

```typescript
// Pattern in EditorClient
async function regenerateSection(sectionId: string, prompt: string) {
  const section = ast.sections.find(s => s.id === sectionId);
  if (!section) return;

  const res = await fetch("/api/ai/regenerate-section", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      websiteId,
      sectionId,
      sectionType: section.type,
      prompt,
      // Pass existing content as context
      currentContent: section.ai_content,
    }),
  });

  if (!res.ok) { /* show error */ return; }
  const { ai_content } = await res.json();

  setAst(prev => ({
    ...prev,
    sections: prev.sections.map(s =>
      s.id === sectionId ? { ...s, ai_content } : s
    ),
  }));
  setHasUnsavedChanges(true);
}
```

### Pattern 7: Unsaved Changes Guard in Next.js App Router

**What:** App Router does not expose a `router.beforeRouteChange` event. The guard needs two mechanisms: (1) `window.onbeforeunload` for browser refresh/close, (2) intercept the Back button click in the Topbar component.

**When to use:** Any editor with explicit save. Do NOT rely on `useRouter` events — they are not reliable in App Router for this use case.

```typescript
// In EditorClient
useEffect(() => {
  if (!hasUnsavedChanges) return;
  const handler = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; // Required for Chrome
  };
  window.addEventListener("beforeunload", handler);
  return () => window.removeEventListener("beforeunload", handler);
}, [hasUnsavedChanges]);
```

For the Back button: do NOT use Next.js router navigation. Instead, make the Back button call a handler that checks `hasUnsavedChanges` first and shows the shadcn `Dialog` if true. Only navigate (`router.push`) after confirmation.

### Anti-Patterns to Avoid

- **Defining section components inline inside EditorClient:** Causes re-mount on every render. All sub-components (SortableSectionItem, SectionEditForm, ThemeTab, etc.) MUST be defined at module scope — this rule is already established in this codebase (see STATE.md key decisions).
- **Auto-saving on every keystroke:** Adds network noise. Explicit Save button is the locked decision.
- **Writing to `ai_content` from the editor:** The editor ONLY writes to `manual_overrides`. Writing to `ai_content` would break the note-sync contract in Phase 5.
- **iframe for preview:** Decision is locked as direct React render. iframes create cross-origin complexity and prevent click-through to sidebar.
- **Using `router.beforeRouteChange`:** Does not exist in Next.js App Router. Use `window.onbeforeunload` + Dialog on the Back button.
- **Calling `arrayMove` before DnD confirms drop:** Always call `arrayMove` in `onDragEnd`, not `onDragOver` — `onDragOver` fires repeatedly.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag-to-reorder list | Custom mouse event tracker | @dnd-kit/core + @dnd-kit/sortable | Touch support, keyboard accessibility, scroll during drag, all handled |
| Toast notifications | Custom toast component + portal | sonner (via shadcn) | Animation, stacking, auto-dismiss, aria-live — complex to get right |
| Sortable array manipulation | Custom splice logic | `arrayMove` from @dnd-kit/sortable | Handles edge cases including same-index drops |
| File upload to Supabase | Manual fetch to Supabase REST | `@supabase/supabase-js` storage client | Handles multipart, resumable uploads, error normalization |

**Key insight:** dnd-kit's accessibility story (keyboard navigation, screen reader announcements) alone justifies not hand-rolling. The `arrayMove` utility specifically prevents off-by-one bugs when dragging to the end of the list.

---

## Common Pitfalls

### Pitfall 1: PATCH Endpoint Missing `content` Field
**What goes wrong:** Save button sends `{ content: ast }` to PATCH endpoint; endpoint ignores unknown fields and returns `{ error: "No valid fields to update" }` (400) — save silently fails.
**Why it happens:** The existing PATCH handler was built in Phase 2 for name/status/slug only — content saving was not needed yet.
**How to avoid:** Extend PATCH handler to accept `content` (WebsiteAST object) before implementing the Save button.
**Warning signs:** Save button click gets a 400 response in the network tab.

### Pitfall 2: Supabase Storage Bucket Not Created
**What goes wrong:** Upload API route calls `supabase.storage.from("website-images").upload(...)` and gets "Bucket not found" error.
**Why it happens:** Supabase Storage buckets must be created manually in the Supabase dashboard (or via migration) before they can be used. The SDK does not auto-create buckets.
**How to avoid:** Document bucket setup as a Wave 0 task. Bucket name: `website-images`, access: public.
**Warning signs:** `StorageApiError: Bucket not found` in server logs.

### Pitfall 3: Missing Supabase Environment Variables
**What goes wrong:** Upload route fails because `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` are not in `.env`.
**Why it happens:** This project uses `postgres.js` directly (not the Supabase client) for DB — so Supabase URL/keys were never needed before Phase 4.
**How to avoid:** Add both env vars to `.env.example` as part of setup. `NEXT_PUBLIC_SUPABASE_URL` is the project URL from Supabase dashboard Settings → API. `SUPABASE_SERVICE_ROLE_KEY` is the `service_role` key (secret — server only).
**Warning signs:** `process.env.NEXT_PUBLIC_SUPABASE_URL` is `undefined` at runtime.

### Pitfall 4: dnd-kit Unique IDs Must Be Strings
**What goes wrong:** DndContext throws type errors or incorrect drag behavior if section IDs are not strings or are not unique.
**Why it happens:** dnd-kit's `id` prop for `SortableContext` items and `useSortable` must be `UniqueIdentifier` (string | number). Section IDs from the AST are already strings — but they must also be unique across the list.
**How to avoid:** Always pass `sections.map(s => s.id)` to `SortableContext items` prop. Never use array indices as IDs.
**Warning signs:** Two sections swap incorrectly on drag; `useSortable` returns wrong transform.

### Pitfall 5: Google Fonts Injection Race Condition
**What goes wrong:** `injectGoogleFont()` is called but the `<link>` hasn't loaded yet when the CSS variable is applied, causing a brief FOUT (flash of unstyled text).
**Why it happens:** `document.head.appendChild(link)` is async — the font loads after the variable is applied.
**How to avoid:** This is acceptable for an editor UX (user just selected the font). No need to await font load. The public page (`/[username]/[slug]`) should load the font in the `<head>` via Next.js `<link>` tag in the layout or page metadata, not via dynamic injection.
**Warning signs:** Preview flickers to default font briefly after selection.

### Pitfall 6: Inline Component Definitions Causing Re-mount
**What goes wrong:** Section edit form input loses focus on every keypress because the component re-mounts.
**Why it happens:** Defining `function SectionEditForm()` inside `EditorClient` creates a new function reference on every render — React treats it as a new component type and unmounts/remounts.
**How to avoid:** All sub-components must be defined at module scope (top level of the file), not inside another component. This pattern is already enforced in this codebase per `rerender-no-inline-components` rule.
**Warning signs:** Text input loses focus after each character typed.

### Pitfall 7: Per-section Regenerate Must Not Clear `manual_overrides`
**What goes wrong:** Regenerate replaces the entire section object with just `{ id, type, ai_content: newContent }`, losing user's manual edits.
**Why it happens:** Naive implementation spreads the API response over the section.
**How to avoid:** Only update `ai_content` on the matching section; leave `manual_overrides` untouched.

```typescript
// CORRECT
sections: prev.sections.map(s =>
  s.id === sectionId ? { ...s, ai_content: newAiContent } : s
)

// WRONG — destroys manual_overrides
sections: prev.sections.map(s =>
  s.id === sectionId ? { id: s.id, type: s.type, ai_content: newAiContent, manual_overrides: {} } : s
)
```

---

## Code Examples

### Complete dnd-kit Section List (Verified Pattern)

```typescript
// sections-tab.tsx — defined at MODULE SCOPE, not inside EditorClient
"use client";

import { useState } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Section } from "@/types/website-ast";

// SortableSectionItem — MUST be at module scope
function SortableSectionItem({ section, isSelected, onClick }: {
  section: Section;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 px-3 h-11 ...">
      <button
        {...listeners}
        {...attributes}
        aria-label="Kéo để sắp xếp"
        className="cursor-grab text-muted-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <button onClick={onClick} className="flex-1 text-left text-sm">
        {section.type}
      </button>
    </div>
  );
}

export function SectionsTab({ sections, selectedId, onSelect, onReorder }: {
  sections: Section[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (sections: Section[]) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      onReorder(arrayMove(sections, oldIndex, newIndex));
    }
  }

  const activeSection = activeId ? sections.find(s => s.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
        {sections.map(section => (
          <SortableSectionItem
            key={section.id}
            section={section}
            isSelected={section.id === selectedId}
            onClick={() => onSelect(section.id)}
          />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeSection ? (
          <div className="opacity-80 bg-background border border-border rounded shadow-lg px-3 h-11 flex items-center text-sm">
            {activeSection.type}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

### Supabase Storage Upload Client-side Call

```typescript
// In sidebar image field handler
async function handleImageUpload(file: File, sectionId: string, field: string) {
  setUploadState("uploading");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload/image", { method: "POST", body: formData });
  if (!res.ok) {
    setUploadState("error");
    return;
  }
  const { url } = await res.json();
  // Write URL into manual_overrides — preview updates immediately via state
  updateSection(sectionId, { [field]: url });
  setUploadState("success");
}
```

### CSS Variable Application on Preview Container

```typescript
// Preview container in EditorClient
<div
  className={cn(
    "transition-all duration-200 ease-in-out mx-auto",
    previewMode === "desktop" && "w-full",
    previewMode === "tablet" && "max-w-[768px]",
    previewMode === "mobile" && "max-w-[390px]"
  )}
  style={{
    "--primary-color": ast.theme.primaryColor,
    "--font-family": ast.theme.font,
  } as React.CSSProperties}
>
  <TemplateRenderer templateId={templateId} ast={ast} />
</div>
```

**Public page must also apply CSS variables** — update `TemplateRenderer` or the public page wrapper to read `ast.theme` and apply same inline style.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-beautiful-dnd | @dnd-kit | 2022 | dnd-kit is maintained, rbd is deprecated |
| react-hot-toast | sonner | 2023 | sonner is shadcn default toast; better API |
| iframe-based preview | Direct React render | Project decision | Enables click-through, real CSS variable inheritance |

**Deprecated/outdated:**
- `react-beautiful-dnd`: No longer maintained, does not support React 18 concurrent mode properly. Use `@dnd-kit` instead.
- `shadcn/ui toast` (Radix): The shadcn team now recommends `sonner` as the preferred toast solution. Install via `npx shadcn add sonner`.

---

## Open Questions

1. **Supabase Storage bucket creation**
   - What we know: Bucket `website-images` needs to be created before upload works
   - What's unclear: Whether to document this as a manual step or add a bucket-creation migration
   - Recommendation: Document as a manual Wave 0 setup step with a note in `.env.example`. Creating buckets via migration adds complexity not warranted for this phase.

2. **Font search strategy — curated list vs Google Fonts API**
   - What we know: Google Fonts Developer API requires an API key; the CSS2 `?family=` param does not
   - What's unclear: Whether 20-30 curated fonts is sufficient for user needs
   - Recommendation: Use curated list of 20 popular fonts (no API key needed, zero network requests for search). This is the simplest path and avoids adding another env var. Can be expanded in a future phase.

3. **`section_type` fields for per-section regen prompt**
   - What we know: Each section type (hero, about, features, etc.) has different fields
   - What's unclear: Whether the regenerate API should use a per-type system prompt or a generic one
   - Recommendation: Reuse `buildSystemPrompt(templateId)` from Phase 3 and add a targeted user prompt that specifies the section type and current content as context. Keep the API simple — one endpoint, type-aware prompt construction.

---

## Validation Architecture

> `workflow.nyquist_validation` is absent from config.json — treating as enabled.

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
| F-12 | `updateSection()` writes only to `manual_overrides`, not `ai_content` | unit | `npm run test -- src/lib/ast-utils.test.ts` | ✅ (resolveField tests exist) |
| F-12 | Section field merge: `manual_overrides[field]` wins over `ai_content[field]` | unit | `npm run test -- src/lib/ast-utils.test.ts` | ✅ |
| F-14 | `arrayMove` produces correct section order after drag | unit | `npm run test -- src/lib/editor-utils.test.ts` | ❌ Wave 0 |
| S-01 | Per-section regenerate preserves `manual_overrides` when updating `ai_content` | unit | `npm run test -- src/lib/editor-utils.test.ts` | ❌ Wave 0 |
| S-05 | Theme color/font saved into `ast.theme` correctly | unit | `npm run test -- src/lib/editor-utils.test.ts` | ❌ Wave 0 |
| F-13 | Image upload API route: unauthenticated request returns 401 | integration (manual) | manual-only — requires Supabase Storage mock | manual-only |
| F-15 | Responsive preview classes applied correctly per mode | manual | visual verification in browser | manual-only |

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/lib/editor-utils.test.ts` — unit tests for arrayMove order, manual_overrides merge, theme update logic (REQ F-14, S-01, S-05)
- [ ] `src/lib/editor-utils.ts` — pure utility functions extracted from EditorClient so they are unit-testable (e.g., `applyManualOverride`, `reorderSections`, `updateTheme`)

*(Existing `ast-utils.test.ts` covers F-12 / resolveField behavior — no gap there)*

---

## Sources

### Primary (HIGH confidence)
- npm registry — `@dnd-kit/core@6.3.1`, `@dnd-kit/sortable@10.0.0`, `@dnd-kit/utilities@3.2.2` — versions confirmed 2026-03-18
- npm registry — `sonner@2.0.7`, `@supabase/supabase-js@2.99.2` — versions confirmed 2026-03-18
- `src/app/api/websites/[id]/route.ts` — confirmed PATCH only handles name/status/slug (content gap identified)
- `src/types/website-ast.ts` — full AST and Section interface confirmed
- `src/components/sections/index.tsx` — SectionRenderer API confirmed (section + theme props)
- `src/lib/ast-utils.ts` — resolveField pattern confirmed
- `package.json` — confirmed @supabase/supabase-js NOT yet installed; dnd-kit NOT yet installed
- `vitest.config.ts` — test framework confirmed (Vitest, node environment)

### Secondary (MEDIUM confidence)
- shadcn/ui docs (sonner): shadcn recommends sonner as toast solution — consistent with UI-SPEC note in 04-UI-SPEC.md
- Google Fonts CSS2 API (`fonts.googleapis.com/css2?family=...`) — no API key required, confirmed pattern in widespread use

### Tertiary (LOW confidence)
- dnd-kit v10 sortable API — assumed stable from v6 patterns; peerDependencies confirmed via npm view but no detailed v10 changelog review performed

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm versions confirmed live, package.json scanned for existing installs
- Architecture: HIGH — patterns derived from existing codebase conventions + confirmed API gap
- Pitfalls: HIGH — PATCH gap is code-verified; others are well-established React/dnd-kit failure modes

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable libraries; dnd-kit and sonner are not fast-moving)
