# Steve — Tổng Kết Phân Tích AI Pipeline & Hướng Phát Triển Sản Phẩm

> Tài liệu này tổng hợp toàn bộ kết quả phân tích source code, so sánh với Lovable/Bolt.new/v0, đề xuất sửa lỗi, tối ưu pipeline, và lộ trình phát triển sản phẩm.
>
> **Repo:** github.com/LVIPHU/steve  
> **Stack:** Next.js 16 + React 19 + Tailwind CSS v4 + Drizzle ORM + OpenAI SDK  
> **AI Pipeline:** 930 dòng code chính + 5,830 dòng component snippets  
> **Ngày phân tích:** 24/03/2026

---

## MỤC LỤC

1. [Tình trạng hiện tại](#1-tình-trạng-hiện-tại)
2. [Bugs nghiêm trọng cần sửa ngay](#2-bugs-nghiêm-trọng-cần-sửa-ngay)
3. [Tối ưu pipeline — giảm cost & latency](#3-tối-ưu-pipeline--giảm-cost--latency)
4. [Nâng cấp chất lượng UI/UX output](#4-nâng-cấp-chất-lượng-uiux-output)
5. [Quyết định công nghệ: LangChain, Vercel AI SDK, và các framework](#5-quyết-định-công-nghệ)
6. [Lộ trình phát triển sản phẩm](#6-lộ-trình-phát-triển-sản-phẩm)
7. [Phụ lục: So sánh chi tiết với các nền tảng lớn](#7-phụ-lục)

---

## 1. TÌNH TRẠNG HIỆN TẠI

### 1.1. Pipeline Flow

```
POST /api/ai/generate-html
  │
  ▼
runGenerationPipeline(prompt, currentHtml?, onEvent)
  │
  ├── FRESH MODE (tạo mới):
  │     analyze → components → design → generate → (review → refine) → validate
  │
  └── EDIT MODE (có currentHtml):
        analyze → components → generate → validate
```

### 1.2. Model Usage Hiện Tại

| Step | File | Model | Loại output | Timeout |
|------|------|-------|-------------|---------|
| analyze | `analyzer.ts` | `gpt-4o-mini` | JSON (response_format) | 20s |
| design | `design-agent.ts` | `gpt-4o-mini` | Zod structured (zodResponseFormat) | 20s |
| generate | `generator.ts` | `gpt-4o` | Raw text (HTML) | 60s |
| review | `reviewer.ts` | `gpt-4o-mini` | Zod structured | 20s |
| refine | `context-builder.ts` | `gpt-4o` | Raw text (HTML) | 60s |
| validate | `validator.ts` | **Không dùng LLM** | Regex-based fixes | 0ms |

**LLM calls per request:**
- Fresh mode (không refine): 3 calls (analyze + design + generate)
- Fresh mode (có refine): 5 calls (+ review + refine)
- Edit mode: 2 calls (analyze + generate)

### 1.3. Điểm mạnh hiện có ✅

1. **Multi-model routing đã đúng** — gpt-4o-mini cho tasks nhẹ, gpt-4o cho generation
2. **Zod structured output** — design + review output luôn đúng schema
3. **Fallback ở mọi nơi** — pipeline không crash nếu 1 step fail
4. **Timeout controls** — 20s cho mini, 60s cho generation
5. **Calibration logging** — reviewer ghi `.calibration.jsonl` (foundation cho eval)
6. **Validator không dùng LLM** — nhanh, rẻ, reliable
7. **Component library phong phú** — 18 snippet files, 5,830 dòng, tag-based selection
8. **Multi-page support** — JSONB `pages` + `chatHistory` per page
9. **Atomic DB updates** — `jsonb_set` an toàn
10. **Configurable thresholds** — `ENABLE_REFINE`, `REVIEW_THRESHOLD` qua env vars

### 1.4. Kiến trúc so sánh tổng quan

```
                Steve (hiện tại)    Lovable              Bolt.new           v0 (Vercel)
─────────────── ─────────────────── ──────────────────── ────────────────── ──────────────────
Output          Raw HTML string     React + TypeScript   Đa framework      React + Tailwind
LLM calls/gen   3-5                 2-3                  1                  1-2
Models          OpenAI only         GPT-4-mini + Claude  Claude Sonnet      Proprietary
Streaming       Step-level SSE      Real-time stream     Character-level    Character-level
Edit strategy   Full regen (BUG)    AST-based diffs      File rewrites      Component edits
Context         Snippets only       LLM file selection   Full codebase      Design system
Review          Auto score+fix      Generate→verify      Không có           AutoFix post-proc
Sandbox         Không (server gen)  Sandboxed env        WebContainer       Cloud build
```

---

## 2. BUGS NGHIÊM TRỌNG CẦN SỬA NGAY

### 🔴 BUG #1: Edit mode KHÔNG gửi currentHtml cho LLM

**Mức độ:** CRITICAL — edit có thể mất toàn bộ content hiện có

**File:** `src/lib/ai-pipeline/context-builder.ts` dòng 52-57

**Vấn đề:**
```typescript
// HIỆN TẠI — context-builder.ts
export function buildEditUserMessage(prompt: string): string {
  return `Preserve existing colors and typography. Do not reset to DaisyUI defaults.

## User Request
${prompt}`;
}
```

Hàm này KHÔNG nhận `currentHtml` parameter. Khi pipeline gọi:
```typescript
// index.ts dòng 44
userMessage = buildEditUserMessage(prompt);  // ← Không truyền currentHtml!
```

LLM nhận instruction "Preserve existing colors" nhưng **không có HTML nào để preserve**. Nó sẽ sinh HTML mới hoàn toàn, mất content cũ.

**Đối chiếu:** Bolt.new gửi TOÀN BỘ codebase + diffs vào context. Lovable dùng AST-based targeted updates.

**Fix chi tiết:**

```typescript
// context-builder.ts — SỬA
export function buildEditUserMessage(
  prompt: string,
  currentHtml: string,
  otherPagesContext?: string
): string {
  const parts: string[] = [];

  parts.push(`## Current HTML (DO NOT discard — modify in place)
${currentHtml}`);

  if (otherPagesContext) {
    parts.push(`## Design Context From Other Pages
${otherPagesContext}`);
  }

  parts.push(`## Edit Instructions
Modify the HTML above according to the user's request below.
CRITICAL RULES:
- Keep ALL existing content, structure, and styling INTACT
- ONLY change what the user specifically asks for
- Preserve CSS custom properties (--color-primary, etc.)
- Preserve Google Fonts @import
- Preserve dark mode classes
- Output the COMPLETE modified HTML file

## User Request
${prompt}`);

  return parts.join('\n\n');
}
```

```typescript
// index.ts — SỬA
if (isEditMode) {
  userMessage = buildEditUserMessage(prompt, currentHtml!);
  //                                        ^^^^^^^^^^^^^ truyền currentHtml
}
```

---

### 🔴 BUG #2: Generation KHÔNG streaming — user chờ 10-30s trống

**Mức độ:** HIGH — UX tệ, user nghĩ app bị treo

**File:** `src/lib/ai-pipeline/generator.ts`

**Vấn đề:**
```typescript
// HIỆN TẠI — generator.ts
const completion = await getOpenAI().chat.completions.create({
  model: "gpt-4o",
  messages: [...],
});  // ← Chờ TOÀN BỘ response xong mới return
```

SSE timeline hiện tại:
```
t=0s    → "analyze: start"
t=1s    → "analyze: done"
t=1.5s  → "components: done"
t=2.5s  → "design: done"
t=3s    → "generate: start"
t=3-30s → .................. IM LẶNG — USER KHÔNG THẤY GÌ
t=30s   → "generate: done" + toàn bộ HTML xuất hiện 1 cục
```

**Đối chiếu:** Bolt.new stream từng ký tự — user thấy code "được viết" real-time. v0 cũng stream character-level.

**Fix chi tiết:**

```typescript
// generator.ts — SỬA
export async function generateHtml(
  userMessage: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const stream = await getOpenAI().chat.completions.create(
    {
      model: "gpt-4o",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: userMessage },
      ],
      stream: true,  // ← KEY CHANGE
    },
    { signal: AbortSignal.timeout(60000) }
  );

  let full = "";
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content ?? "";
    if (content) {
      full += content;
      onChunk?.(content);  // → Real-time SSE
    }
  }
  return stripMarkdownFences(full);
}
```

```typescript
// index.ts — SỬA (thêm onChunk callback)
onEvent({ step: "generate", status: "start" });
let html = await generateHtml(userMessage, (chunk) => {
  onEvent({ step: "generate", status: "start", detail: chunk });
  // Hoặc thêm event type mới:
  // onEvent({ step: "generating", status: "streaming", chunk });
});
onEvent({ step: "generate", status: "done" });
```

```typescript
// types.ts — THÊM streaming event
export interface PipelineEvent {
  step: "analyze" | "components" | "design" | "generate" | "generating"
      | "review" | "refine" | "validate" | "complete" | "error";
  status: "start" | "done" | "streaming";
  detail?: string;
  chunk?: string;      // ← MỚI: cho streaming content
  html?: string;
  fix_count?: number;
  error?: string;
}
```

---

### 🔴 BUG #3: System prompt quá nặng cho Edit mode

**Mức độ:** HIGH — lãng phí tokens + confuse model khi edit nhỏ

**File:** `src/lib/html-prompts.ts` — 114 dòng system prompt

**Vấn đề:** Khi edit "đổi màu nút thành xanh", LLM nhận 114 dòng system prompt bao gồm CDN setup, dark mode script, Preline collapse/dropdown/modal/accordion/tabs/stepper patterns, CSS rules, anti-patterns... 80% không liên quan.

**Fix chi tiết:**

```typescript
// html-prompts.ts — SỬA
export function buildSystemPrompt(mode: "fresh" | "edit" = "fresh"): string {
  const BASE = `You are an expert web developer. Generate a complete, self-contained website as a single HTML file with ALL CSS embedded in <style> tags and ALL JavaScript in <script> tags.`;

  if (mode === "edit") {
    return `${BASE}

You are EDITING an existing HTML file. The user will provide the current HTML and their change request.

Rules for editing:
- Output the COMPLETE modified HTML file (not a diff, not a partial)
- ONLY modify what the user specifically requests
- Preserve ALL existing content that is not being changed
- Preserve all CSS custom properties, Google Fonts imports, and dark mode support
- Preserve all CDN script tags already in the HTML
- Do NOT add explanations or markdown — output ONLY the raw HTML
- Start your response with <!DOCTYPE html>`;
  }

  // Fresh mode — full system prompt
  return `${BASE}

${CDN_SETUP}
${DARK_MODE_SETUP}
${STYLING_RULES}
${PRELINE_PATTERNS}
${JS_RULES}
${CSS_RULES}
${ANTI_PATTERNS}`;
}
```

```typescript
// generator.ts — SỬA (pass mode)
export async function generateHtml(
  userMessage: string,
  onChunk?: (chunk: string) => void,
  mode: "fresh" | "edit" = "fresh"
): Promise<string> {
  const stream = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: buildSystemPrompt(mode) },  // ← pass mode
      { role: "user", content: userMessage },
    ],
    stream: true,
  }, { signal: AbortSignal.timeout(60000) });
  // ...
}
```

---

## 3. TỐI ƯU PIPELINE — GIẢM COST & LATENCY

### 3.1. Merge analyze + design thành 1 LLM call

**Impact:** Giảm 1 LLM call = ~0.5-1s latency + ~$0.001/request

**Hiện tại:** 2 calls riêng biệt cùng dùng gpt-4o-mini:
```
Call 1: analyzePrompt(prompt)           → { type, sections, features, structured_data }
Call 2: runDesignAgent(prompt, analysis) → { preset, palette, fonts }
```

**Đề xuất:** Merge thành 1 call với combined schema:

```typescript
// analyze-and-design.ts — MỚI
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const AnalyzeAndDesignSchema = z.object({
  // Analysis fields
  type: z.enum(["landing", "portfolio", "dashboard", "blog", "generic"]),
  sections: z.array(z.string()),
  features: z.array(z.string()),
  structured_data: z.string(),
  // Design fields
  design: z.object({
    preset: z.enum(["bold-dark", "warm-organic", "clean-minimal", "playful-bright", "professional-blue"]),
    palette: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      bg: z.string(),
    }),
    fonts: z.object({
      heading: z.string(),
      body: z.string(),
    }),
  }),
});

const SYSTEM_PROMPT = `You are a web design expert. Given a user's prompt, analyze it and choose the best visual identity.

Return a JSON object with:
- type: "landing" | "portfolio" | "dashboard" | "blog" | "generic"
- sections: array of UI sections needed
- features: array of JS/CSS features needed
- structured_data: extracted tabular data as JSON string, or ""
- design: { preset, palette (4 hex colors), fonts (2 Google Font names) }

Preset guidelines:
- bold-dark: fitness, gaming, sports — dark backgrounds, strong colors
- warm-organic: food, cooking, wellness — warm earthy tones
- playful-bright: education, learning, kids — bright cheerful colors
- professional-blue: SaaS, tech, business — trustworthy blues/grays
- clean-minimal: everything else`;

export async function analyzeAndDesign(prompt: string) {
  const completion = await getOpenAI().chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(AnalyzeAndDesignSchema, "analyze_and_design"),
  }, { signal: AbortSignal.timeout(20000) });
  
  return completion.choices[0].message.parsed!;
}
```

### 3.2. Conditional review — skip khi validator clean

**Impact:** Skip review cho ~60-70% clean generations → tiết kiệm 1 LLM call + 2-5s

**Hiện tại:**
```typescript
// index.ts dòng 64
if (!isEditMode && enableRefine) {
  const review = await reviewHtml(prompt, html);  // LUÔN review
```

**Đề xuất:**
```typescript
// index.ts — SỬA
// Validate TRƯỚC review
onEvent({ step: "validate", status: "start" });
const { html: validatedHtml, fixes, warnings } = validateAndFix(html);
onEvent({ step: "validate", status: "done", detail: `${fixes.length} fix(es)`, fix_count: fixes.length });

// Chỉ review nếu có warnings HOẶC validator phát hiện vấn đề
const shouldReview = !isEditMode && enableRefine && (
  warnings.length > 0 || 
  fixes.length > 2 ||          // Nhiều auto-fix = chất lượng đáng ngờ
  validatedHtml.length < 2000   // HTML quá ngắn = có thể incomplete
);

if (shouldReview) {
  onEvent({ step: "review", status: "start" });
  const review = await reviewHtml(prompt, validatedHtml);
  onEvent({ step: "review", status: "done", detail: `Score: ${review.score}/100` });

  if (review.score < reviewThreshold || review.must_fix.length > 0) {
    onEvent({ step: "refine", status: "start" });
    const refined = await refineHtml(validatedHtml, review);
    // Re-validate after refine
    const { html: finalHtml } = validateAndFix(refined);
    html = finalHtml;
    onEvent({ step: "refine", status: "done" });
  } else {
    html = validatedHtml;
  }
} else {
  html = validatedHtml;
}
```

### 3.3. Strengthen validator — thêm checks cơ bản

**Impact:** Bắt thêm nhiều lỗi mà KHÔNG cần LLM call ($0, 0ms)

**Hiện tại:** 5 regex patterns (Tailwind-as-CSS, card height, alert, Alpine, aspect-ratio)

**Thêm vào `validator.ts`:**

```typescript
// validator.ts — THÊM checks

// Check 1: DOCTYPE present
if (!result.match(/^<!DOCTYPE html>/i)) {
  result = "<!DOCTYPE html>\n" + result;
  fixes.push("Added missing DOCTYPE");
}

// Check 2: Essential tags
if (!/<html/i.test(result)) warnings.push("Missing <html> tag");
if (!/<head/i.test(result)) warnings.push("Missing <head> tag");
if (!/<body/i.test(result)) warnings.push("Missing <body> tag");

// Check 3: Viewport meta
if (!/<meta[^>]*viewport/i.test(result)) {
  warnings.push("Missing viewport meta tag — mobile rendering will break");
}

// Check 4: Tailwind CDN present
if (!/cdn\.tailwindcss\.com/i.test(result)) {
  warnings.push("Missing Tailwind CDN — styles may not render");
}

// Check 5: Empty body
if (/<body[^>]*>\s*<\/body>/i.test(result)) {
  warnings.push("Empty <body> — generation likely failed");
}

// Check 6: Suspiciously short HTML
if (result.length < 500) {
  warnings.push("HTML very short (<500 chars) — likely incomplete");
}

// Check 7: Broken script tags
const scriptOpens = (result.match(/<script/g) || []).length;
const scriptCloses = (result.match(/<\/script>/g) || []).length;
if (scriptOpens !== scriptCloses) {
  warnings.push(`Mismatched <script> tags: ${scriptOpens} opens vs ${scriptCloses} closes`);
}

// Check 8: CSS custom properties present (if design was applied)
if (/--color-primary/.test(result) && !/--color-primary\s*:\s*#/.test(result)) {
  warnings.push("CSS variable --color-primary referenced but not defined");
}
```

### 3.4. Cross-page design consistency

**Impact:** Pages "about" và "contact" sẽ match design của "index"

**Hiện tại:** Mỗi page được generate độc lập — không biết pages khác trông thế nào.

**Thêm vào API route (`route.ts`):**

```typescript
// route.ts — THÊM cross-page context
const existingPages = (existing[0].pages as Record<string, string>) ?? {};

// Extract design summary từ pages khác
const otherPagesContext = Object.entries(existingPages)
  .filter(([name]) => name !== pageName && typeof name === 'string')
  .slice(0, 3)  // Max 3 pages để giữ context nhỏ
  .map(([name, html]) => {
    if (typeof html !== 'string') return '';
    const palette = (html.match(/--color-\w+:\s*#[0-9a-f]+/gi) || []).join(', ');
    const fonts = (html.match(/family=([^&:]+)/g) || []).join(', ');
    const navItems = (html.match(/<a[^>]*href="(\w+)"[^>]*>/gi) || [])
      .map(a => a.match(/href="(\w+)"/)?.[1]).filter(Boolean).join(', ');
    return `Page "${name}": palette=[${palette}] fonts=[${fonts}] nav=[${navItems}]`;
  })
  .filter(Boolean)
  .join('\n');

// Pass to pipeline
const html = await runGenerationPipeline(
  prompt, 
  currentHtml || undefined, 
  send,
  otherPagesContext || undefined  // ← THÊM parameter
);
```

---

## 4. NÂNG CẤP CHẤT LƯỢNG UI/UX OUTPUT

### 4.1. Viết lại system prompt — impact LỚN NHẤT, cost $0

**File:** `src/lib/html-prompts.ts`

Hiện tại prompt chủ yếu nói "KHÔNG làm gì" (anti-patterns: 15 dòng). Cần thêm "NÊN làm gì" (design principles).

**Thêm vào system prompt (fresh mode):**

```
Design Principles — FOLLOW THESE:
- Generous whitespace: section padding min py-20 (80px), prefer py-24 (96px)
- Visual hierarchy: hero headline text-5xl/text-6xl, section headings text-3xl, body text-lg
- Consistent spacing scale: space-y-4, gap-6, gap-8 — never random pixel values
- Max content width: max-w-7xl mx-auto with px-4 sm:px-6 lg:px-8 gutters
- Section rhythm: alternate backgrounds (white → gray-50 → white → colored accent)
- Card design: rounded-xl, shadow-sm hover:shadow-md transition-shadow duration-300
- Buttons: rounded-lg px-6 py-3 font-medium, hover state with brightness or darker shade
- Images: use https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop for placeholders
- Color application: primary for CTA buttons + key links, secondary for borders + badges, accent sparingly for highlights
- Typography: heading font for h1-h3 only, body font for everything else
- Transitions: add transition-colors or transition-all duration-200 on interactive elements
- Icons: use inline SVG from Heroicons (24x24 outline style) — do NOT use icon libraries
- Grid layouts: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 for cards, grid-cols-1 lg:grid-cols-2 for split layouts

Modern UI Patterns — USE THESE:
- Hero: min-h-[80vh] flex items-center, gradient overlay on background images
- Navbar: sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80
- Feature cards: group hover effect, subtle border, icon + title + description
- Testimonials: avatar circle + quote + name/role, grid or carousel
- CTA: contrasting background (primary color), large text, prominent button
- Footer: 4-column grid on desktop, social icons, newsletter form
```

### 4.2. Thêm golden example pages vào component library

**Impact:** LLM follow complete examples TỐT HƠN nhiều so với chỉ đọc rules

Tạo file `src/lib/component-library/snippets/examples.ts` chứa 1-2 complete page examples cho mỗi type. Mỗi example khoảng 200-300 dòng HTML hoàn chỉnh, đẹp, production-ready.

```typescript
// snippets/examples.ts
import type { ComponentSnippet } from "../types";

export const exampleSnippets: ComponentSnippet[] = [
  {
    id: "example-landing-complete",
    name: "Complete Landing Page Example",
    description: "Full production-ready landing page with hero, features, testimonials, CTA, footer",
    category: "example",
    tags: ["landing", "hero", "features", "testimonials", "cta", "footer"],
    priority: 0,  // Highest priority
    domain_hints: ["landing"],
    min_score: 0,
    fallback: true,
    fallback_for: ["landing"],
    html: `<!-- EXAMPLE: Production-ready landing page -->
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- ... complete 250-line landing page ... -->
</html>`
  },
  // Thêm: example-portfolio-complete, example-dashboard-complete, example-blog-complete
];
```

**Cách inject:** Khi analysis type match, gửi golden example dưới dạng "Reference — adapt this structure and quality level".

### 4.3. Mở rộng design tokens schema

**Hiện tại `design-agent.ts`:**
```typescript
{ preset, palette: { primary, secondary, accent, bg }, fonts: { heading, body } }
```

**Thêm tokens để control layout quality:**

```typescript
const DesignTokensSchema = z.object({
  // Hiện có
  preset: z.enum([...]),
  palette: z.object({ primary: z.string(), secondary: z.string(), accent: z.string(), bg: z.string() }),
  fonts: z.object({ heading: z.string(), body: z.string() }),
  
  // THÊM MỚI — control visual style
  borderRadius: z.enum(["sharp", "rounded", "pill"]).describe("sharp=rounded-md, rounded=rounded-xl, pill=rounded-full"),
  cardStyle: z.enum(["flat", "bordered", "shadow", "glass"]).describe("flat=no border/shadow, bordered=border only, shadow=shadow-sm, glass=backdrop-blur"),
  heroStyle: z.enum(["centered", "split-left", "split-right", "bg-image"]).describe("Layout of hero section"),
  density: z.enum(["compact", "comfortable", "spacious"]).describe("compact=py-12, comfortable=py-20, spacious=py-28"),
});
```

Rồi inject vào context-builder:
```typescript
// context-builder.ts
const layoutGuide = `
Border radius: ${design.borderRadius === 'sharp' ? 'rounded-md' : design.borderRadius === 'rounded' ? 'rounded-xl' : 'rounded-full'}
Card style: ${design.cardStyle === 'shadow' ? 'shadow-sm hover:shadow-md' : design.cardStyle === 'bordered' ? 'border border-gray-200 dark:border-gray-700' : '...'}
Section padding: ${design.density === 'compact' ? 'py-12' : design.density === 'comfortable' ? 'py-20' : 'py-28'}
Hero layout: ${design.heroStyle}
`;
```

### 4.4. Image-to-Code (Vision) — Cho phép upload ảnh reference

**Thêm option cho user upload screenshot → AI match visual đó.**

```typescript
// route.ts — THÊM vision support
const { websiteId, prompt, currentHtml, pageName, referenceImage } = await request.json();

if (referenceImage) {
  // Phân tích ảnh reference bằng GPT-4o Vision
  const visionAnalysis = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: [
        { type: "image_url", image_url: { url: referenceImage } },
        { type: "text", text: `Analyze this website screenshot. Return JSON:
{
  "layout": "description of layout structure",
  "color_palette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "typography": "font style description",
  "sections": ["section1", "section2", ...],
  "style": "overall design style description",
  "notable_elements": ["element1", "element2", ...]
}` }
      ]
    }],
    response_format: { type: "json_object" },
  });
  
  // Inject vào generation context
  const refContext = JSON.parse(visionAnalysis.choices[0].message.content ?? "{}");
  // Merge with design agent output or override
}
```

### 4.5. Nâng cấp component snippets từ Preline templates

Bạn đã import Preline JS CDN. Preline cung cấp templates đẹp miễn phí tại `preline.co/examples.html`.

**Hành động:** Cập nhật snippets trong `src/lib/component-library/snippets/` bằng code thực tế từ Preline, thay thế các snippets generic hiện tại bằng Preline-based snippets chất lượng cao hơn.

---

## 5. QUYẾT ĐỊNH CÔNG NGHỆ

### 5.1. LangChain — KHÔNG NÊN dùng cho Steve

**Lý do từ chối:**

| LangChain mang lại | Steve cần? | Đánh giá |
|---------------------|-----------|----------|
| 50+ LLM providers | Không — chỉ dùng OpenAI | Overkill |
| RAG / vector stores | Chưa — không có codebase lớn | Chưa cần |
| Agent orchestration | Không — pipeline tuần tự | Quá nặng |
| Memory management | Không — dùng DB chat history | Không phù hợp |
| +101KB bundle | | Không cần thiết |
| +200-500ms latency | | Phản tác dụng |

**Bằng chứng:** Lovable — nền tảng $6.6B valuation — cũng KHÔNG dùng LangChain. Họ dùng direct SDK calls. Team Lovable đã loại bỏ kiến trúc agent phức tạp vì: accuracy thấp hơn, user confused khi failures xảy ra, chậm hơn.

**Triết lý đúng:** "Nhanh nhất và đơn giản nhất có thể" — Lovable CTO

### 5.2. Vercel AI SDK — CÓ THỂ dùng (optional upgrade)

**Khi nào nên migrate:**
- Khi muốn thêm Anthropic Claude cho generation (multi-provider)
- Khi cần useChat hook cho frontend chat UI
- Khi cần structured output + tool calling trong 1 API

**Lợi ích:**
```typescript
// Hiện tại — OpenAI SDK trực tiếp (đang hoạt động tốt)
const completion = await openai.chat.completions.create({...});

// Với Vercel AI SDK — thêm multi-provider
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const result = await streamText({
  model: anthropic('claude-sonnet-4-20250514'),  // Đổi provider = đổi 1 dòng
  system: buildSystemPrompt(),
  prompt: userMessage,
});
```

**Quyết định:** Giữ OpenAI SDK hiện tại. Chỉ migrate khi thực sự cần multi-provider hoặc Claude.

### 5.3. Nên thêm — Dependencies nhẹ

| Package | Size | Mục đích | Priority |
|---------|------|----------|----------|
| `gpt-tokenizer` | ~3KB | Đếm tokens cho context budgeting | HIGH |
| `langfuse` | ~15KB | Tracing + eval + cost monitoring | HIGH |
| `diff` | ~5KB | Tính diff HTML cho edit mode | MEDIUM |

### 5.4. Langfuse — Hệ thống observability đề xuất

```typescript
// lib/langfuse.ts
import { Langfuse } from 'langfuse';

export const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
});

// Sử dụng trong pipeline
export function tracePipelineStep(
  traceId: string,
  step: string,
  input: string,
  output: string,
  model: string,
  latencyMs: number
) {
  langfuse.generation({
    traceId,
    name: step,
    model,
    input: { prompt: input.slice(0, 500) },  // Truncate cho storage
    output: { result: output.slice(0, 500) },
    usage: { /* token counts */ },
    metadata: { latencyMs },
  });
}
```

**Free tier:** 50K observations/tháng — đủ cho hàng nghìn generations.

---

## 6. LỘ TRÌNH PHÁT TRIỂN SẢN PHẨM

### Phase 1: Fix Critical Bugs (Tuần 1)

| Task | File | Effort | Impact |
|------|------|--------|--------|
| Fix edit mode — truyền currentHtml | `context-builder.ts`, `index.ts` | 1h | 🔴 Critical |
| Add streaming generation | `generator.ts`, `index.ts`, `types.ts` | 2h | 🔴 Critical |
| Tách system prompt fresh/edit | `html-prompts.ts` | 1h | 🔴 High |
| Update frontend SSE handler cho streaming | Editor component | 2h | 🔴 High |

### Phase 2: Pipeline Optimization (Tuần 2)

| Task | File | Effort | Impact |
|------|------|--------|--------|
| Merge analyze + design | New `analyze-and-design.ts` | 3h | 🟡 Medium |
| Conditional review (skip khi clean) | `index.ts` | 1h | 🟡 Medium |
| Strengthen validator (+8 checks) | `validator.ts` | 2h | 🟡 Medium |
| Cross-page design context | `route.ts`, `context-builder.ts` | 2h | 🟡 Medium |

### Phase 3: UI Quality Upgrade (Tuần 3-4)

| Task | File | Effort | Impact |
|------|------|--------|--------|
| Rewrite system prompt (design principles) | `html-prompts.ts` | 4h | 🔴 Highest |
| Create 3-5 golden example pages | `snippets/examples.ts` | 6h | 🔴 High |
| Expand design tokens schema | `design-agent.ts` | 2h | 🟡 Medium |
| Upgrade snippets from Preline templates | `snippets/*.ts` | 4h | 🟡 Medium |

### Phase 4: Observability & Testing (Tuần 5-6)

| Task | File | Effort | Impact |
|------|------|--------|--------|
| Integrate Langfuse tracing | New `lib/langfuse.ts` + pipeline | 3h | 🟡 High |
| Build eval test suite (50+ prompts) | New `tests/eval/` | 8h | 🟡 High |
| Add token counting + budgeting | `context-builder.ts` | 2h | 🟡 Medium |
| Cost dashboard (track $/generation) | Langfuse dashboard | 1h | 🟡 Medium |

### Phase 5: Feature Expansion (Tháng 2-3)

| Task | Effort | Impact |
|------|--------|--------|
| Image-to-code (Vision input) | 8h | 🟢 High |
| Diff-based editing (SEARCH/REPLACE) | 12h | 🟢 High |
| Prompt enhancement (auto-expand vague prompts) | 4h | 🟢 Medium |
| Plan mode (AI lên kế hoạch trước khi code) | 8h | 🟢 Medium |
| Error auto-fix từ iframe preview | 6h | 🟢 Medium |
| Multi-provider support (add Claude) | 4h | 🟢 Low |

### Phase 6: Hướng Tới Cạnh Tranh (Tháng 4+)

| Direction | Description |
|-----------|-------------|
| **Component-based output** | Chuyển từ monolithic HTML sang section-based HTML với `data-component` attributes, cho phép edit từng section |
| **Live collaboration** | Real-time multi-user editing via WebSocket |
| **Template marketplace** | User share/sell templates |
| **Custom domain** | One-click deploy lên custom domain |
| **Analytics** | Track website performance sau khi publish |

---

## 7. PHỤ LỤC

### 7.1. Chi tiết cost per generation (ước tính)

```
Fresh mode (không refine):
  analyze   (gpt-4o-mini): ~200 input + 100 output tokens = ~$0.00005
  design    (gpt-4o-mini): ~300 input + 150 output tokens = ~$0.00008
  generate  (gpt-4o):      ~3000 input + 4000 output tokens = ~$0.035
  ─────────────────────────────────────────────────────────
  TOTAL: ~$0.035/generation

Fresh mode (có refine):
  + review  (gpt-4o-mini): ~5000 input + 200 output = ~$0.0008
  + refine  (gpt-4o):      ~8000 input + 4000 output = ~$0.060
  ─────────────────────────────────────────────────────────
  TOTAL: ~$0.096/generation (gần 3x đắt hơn)

Edit mode:
  analyze   (gpt-4o-mini): ~$0.00005
  generate  (gpt-4o):      ~$0.045 (input lớn hơn vì có currentHtml)
  ─────────────────────────────────────────────────────────
  TOTAL: ~$0.045/edit

SAU KHI TỐI ƯU (merge analyze+design, conditional review):
  Fresh (clean): ~$0.035  (giảm $0.00008 — nhỏ nhưng bớt latency)
  Fresh (cần fix): ~$0.096 (chỉ ~30% cases)
  Average: ~$0.035 × 0.7 + $0.096 × 0.3 = ~$0.053 (giảm từ ~$0.096 nếu refine luôn on)
```

### 7.2. Latency breakdown (ước tính)

```
HIỆN TẠI:
  analyze:   1-2s
  design:    1-2s
  components: <10ms
  generate:  8-25s (BLOCKING — user chờ)
  review:    2-4s
  refine:    8-20s
  validate:  <10ms
  DB save:   50-200ms
  ─────────────────────
  TOTAL: 12-50s (trung bình ~20-25s)

SAU TỐI ƯU:
  analyze+design: 1.5-3s (merge → 1 call)
  components:     <10ms
  generate:       8-25s (STREAMING — user thấy ngay)
  validate:       <10ms
  review+refine:  0-25s (chỉ khi cần)
  DB save:        50-200ms
  ─────────────────────
  TOTAL: 10-28s nhưng time-to-first-content: 3-5s (stream bắt đầu)
```

### 7.3. Danh sách files cần thay đổi

```
SỬA:
  src/lib/ai-pipeline/index.ts          — pipeline orchestration
  src/lib/ai-pipeline/generator.ts      — add streaming
  src/lib/ai-pipeline/context-builder.ts — fix edit mode, add cross-page
  src/lib/ai-pipeline/types.ts          — add streaming event type
  src/lib/ai-pipeline/validator.ts      — add 8 checks
  src/lib/html-prompts.ts               — rewrite with design principles
  src/app/api/ai/generate-html/route.ts — cross-page context, streaming

THÊM MỚI:
  src/lib/ai-pipeline/analyze-and-design.ts  — merged step (optional)
  src/lib/component-library/snippets/examples.ts — golden examples
  src/lib/langfuse.ts                        — observability (Phase 4)
  tests/eval/                                — prompt eval suite (Phase 4)

DEPENDENCIES MỚI:
  gpt-tokenizer                              — token counting
  langfuse                                   — tracing/eval (Phase 4)
```

### 7.4. Key Insights Từ Phân Tích Industry

1. **Lovable** dùng pattern "hydration" — model nhỏ chuẩn bị context, model lớn generate. Steve đã làm đúng điều này.

2. **Lovable** phát hiện feed toàn bộ project files vào LLM GIẢM hiệu năng — LLM "ngu hơn" khi context quá lớn. Giải pháp: selective file inclusion.

3. **Lovable** loại bỏ multi-agent architecture sau thử nghiệm — accuracy thấp hơn, user confused, chậm hơn. Pipeline tuần tự đơn giản tốt hơn.

4. **v0** dùng shadcn/ui + design system registry cho consistent output. Steve tương đương: component library + design tokens.

5. **Bolt.new** bản chất chỉ là "một prompt được viết rất tốt" — system prompt quality quyết định 80% output quality.

6. **Lovable** nhấn mạnh: bắt đầu CỰC KỲ ĐƠN GIẢN, chỉ thêm complexity khi cần. Mỗi thay đổi prompt → back-test against previous queries.

---

*Tài liệu này nên được cập nhật sau mỗi phase hoàn thành.*
