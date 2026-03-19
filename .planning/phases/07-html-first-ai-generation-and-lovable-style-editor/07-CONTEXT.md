# Phase 7: HTML-first AI generation and Lovable-style editor - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the existing WebsiteAST/template/section system with a new flow: user describes their app → GPT-4o generates a complete self-contained HTML file (CSS + JS embedded) → saved to `websites.html_content` → served as raw HTML at `/{username}/{slug}`.

The editor becomes Lovable-style: iframe preview on the left, AI chat prompt + code editor tabs on the right. Home page becomes a landing page. Phase 08 will clean up the old code.

</domain>

<decisions>
## Implementation Decisions

### Creation Flow
- Remove template picker entirely — single `name` input + `promptText` textarea ("Mô tả app/website của bạn")
- Server action creates DB record with no `templateId`, redirects to `/dashboard/websites/${id}/edit?prompt=${encodeURIComponent(promptText)}`
- Prompt passed via URL (max 500 chars) so editor can auto-trigger generation on first load
- No template selection step — template concept is gone

### Editor Layout (Lovable-style)
- Full-screen layout: fixed topbar + 2-column content area
- Left 60%: iframe preview with `srcdoc` attribute
- Right 40%: panel with 2 tabs — "Chat" (default) and "Code"
- Auto-generate on mount if `!initialHtml && initialPrompt` from URL

### Chat Panel (AI interaction)
- Conversation-style message history: `{ role: "user" | "assistant", content: string, timestamp: Date }[]`
- User types prompt ("add dark mode", "change button to blue") → POST `/api/ai/generate-html` with `currentHtml`
- Assistant message shows "Đã cập nhật!" — does NOT display raw HTML
- Loading state shown in iframe area while generating (overlay spinner)
- Auto-save after each successful generation

### Code Editor Tab
- Plain `<textarea>` with monospace font showing raw HTML
- "Apply" button: updates iframe srcdoc + auto-saves to DB
- No syntax highlighting required for MVP (can be added later)

### AI HTML Generation
- New endpoint: `POST /api/ai/generate-html` — `{ websiteId, prompt, currentHtml? }`
- Uses `gpt-4o`, no `response_format` (text output, not JSON)
- Strip markdown fences post-processing: `html.replace(/^```html?\s*/i, "").replace(/\s*```$/i, "").trim()`
- Timeout: `AbortSignal.timeout(90000)` + `export const maxDuration = 90`
- Fresh generation: system prompt instructs full HTML with embedded CSS/JS
- Edit mode (when `currentHtml` provided): system prompt includes existing HTML, instructs modify-only
- Approved CDNs: Tailwind CDN, Chart.js, Alpine.js — no other external deps
- `localStorage` with namespace prefix for data persistence in generated apps
- Mobile-first responsive design required in every generation

### Public Route
- Replace `src/app/(public)/[username]/[slug]/page.tsx` with `route.ts`
- Delete `opengraph-image.tsx` (can re-add later)
- GET: draft → 404, archived → plain HTML "Trang đã bị lưu trữ", published → `new Response(htmlContent, { 'Content-Type': 'text/html; charset=utf-8' })`

### Home Page (Landing Page)
- Rewrite `src/app/page.tsx` as Server Component landing page
- Sections: Hero (headline + 2 CTAs), Features (3 cards), How it works (3 steps), Footer
- CTAs: "Bắt đầu miễn phí" → /register, "Đăng nhập" → /login
- Use Tailwind + existing shadcn Button component
- Vietnamese language throughout

### Database
- Add `html_content TEXT` column to `websites` table in `src/db/schema.ts`
- Keep existing columns (`content`, `templateId`) for Phase 08 cleanup
- PATCH API (`/api/websites/[id]`) extended to accept `html_content`

### Dashboard Nav
- Rename brand from "Website Generator" → "AppGen"
- Keep existing nav links and sign-out button

### Claude's Discretion
- Exact system prompt wording for HTML generation quality
- iframe loading overlay design
- Message bubble styling in chat panel
- Auto-save debounce timing
- Error state handling in editor

</decisions>

<specifics>
## Specific Ideas

- "Giống Lovable.dev" — iframe preview left, chat right, users describe changes in natural language
- Generated apps should work fully offline in the browser using localStorage (no backend calls from the HTML)
- Editor should feel instant: iframe updates as soon as generation completes, no page reload
- The "Code" tab gives power users direct HTML access — like Lovable's code view

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured in decisions above.

### Key files to read before planning
- `src/app/api/ai/generate/route.ts` — Pattern for auth check + OpenAI call + DB save (clone for generate-html)
- `src/app/api/websites/[id]/route.ts` — PATCH handler pattern to extend for html_content
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` — Current editor to replace
- `src/app/(public)/[username]/[slug]/page.tsx` — File to replace with route.ts
- `src/db/schema.ts` — Schema to extend with html_content column
- `src/app/(dashboard)/dashboard/websites/new/page.tsx` — Creation form to simplify

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/tabs.tsx` (shadcn) — Tabs component for Chat/Code panel
- `src/components/ui/button.tsx` — All buttons in editor
- `src/components/ui/textarea.tsx` — Chat input + code editor textarea
- `src/app/(dashboard)/dashboard/websites/[id]/edit/components/editor-topbar.tsx` — Refactor and reuse topbar
- `import { toast } from "sonner"` — Already set up for error/success notifications
- `src/lib/slugify.ts` → `generateSlug()` — Reuse for slug generation

### Established Patterns
- Auth check: `auth.api.getSession({ headers: await headers() })` in API routes
- Ownership check: `db.select().from(websites).where(and(eq(websites.id, id), eq(websites.userId, session.user.id)))`
- Client-side save: PATCH `/api/websites/${id}` with JSON body
- `"use client"` for interactive components, Server Components for data loading pages

### Integration Points
- `src/db/schema.ts` — Add `htmlContent` column
- `src/app/(dashboard)/dashboard/websites/[id]/edit/page.tsx` — Load `htmlContent`, pass to new EditorClient
- `src/app/(dashboard)/dashboard/websites/[id]/website-detail-client.tsx` — Replace AST preview with iframe
- `src/app/(public)/layout.tsx` — Keep ThemeProvider (from Phase 06), but public pages will be raw HTML (no React)

</code_context>

<deferred>
## Deferred Ideas

- Streaming HTML generation (real-time token streaming to iframe) — future phase
- Multiple HTML pages / multi-page apps — future phase
- Version history / undo for generated HTML — future phase
- OG image regeneration for published HTML pages — Phase 08 or later
- Note-to-app flow (mobile sourceNoteId → AI generates HTML from note) — future phase

</deferred>

---

*Phase: 07-html-first-ai-generation-and-lovable-style-editor*
*Context gathered: 2026-03-19*
