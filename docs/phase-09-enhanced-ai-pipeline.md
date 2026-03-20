# Phase 9: Enhanced AI Pipeline v2

> **Trạng thái:** Đang bàn luận / chưa bắt đầu implement
> **Mục tiêu:** Nâng cấp pipeline AI để tạo website đẹp hơn, đúng ý user hơn, consistent hơn

---

## 0. Quyết định kiến trúc nền tảng

### UI Framework: Giữ DaisyUI + Tailwind, bắt buộc override design

**Ba hướng đã cân nhắc:**

| Hướng | Mô tả | Kết luận |
|-------|--------|----------|
| Pure CSS generation | Model tự viết CSS từ đầu, không lib | ❌ Quá nhiều CSS bugs, token phình to, không thể predict quality |
| Tailwind-only (không DaisyUI) | Utility classes thuần, bỏ DaisyUI components | ⚠️ Mất interactive components, model vẫn tạo pattern quen thuộc |
| **DaisyUI + Tailwind + Force Override** | Giữ lib nhưng bắt buộc override toàn bộ design tokens | ✅ **Chọn hướng này** |

**Root cause thực sự của "website trông generic":**
Không phải DaisyUI xấu — mà là model luôn dùng DaisyUI **default palette** (màu blue mặc định) mà không customize. Kết quả mọi website cùng màu, cùng feel.

**Giải pháp:**
Design Agent sinh ra palette → inject vào DaisyUI CSS variable override → mỗi website có visual identity riêng trong khi vẫn dùng DaisyUI components (navbar, cards, modal, table...) cho structure ổn định.

### DaisyUI Theme Override — Kỹ thuật

DaisyUI v4 dùng **oklch color format** cho CSS variables. Generator PHẢI inject block này đầu `<style>`:

```html
<style>
  /* === DESIGN SYSTEM OVERRIDE === */
  :root {
    /* DaisyUI v4 color tokens (oklch format) */
    --p:  var(--dsy-primary-l) var(--dsy-primary-c) var(--dsy-primary-h);
    --s:  var(--dsy-secondary-l) var(--dsy-secondary-c) var(--dsy-secondary-h);
    --a:  var(--dsy-accent-l) var(--dsy-accent-c) var(--dsy-accent-h);
    --b1: var(--dsy-base1-l)  var(--dsy-base1-c)  var(--dsy-base1-h);
    --b2: var(--dsy-base2-l)  var(--dsy-base2-c)  var(--dsy-base2-h);
    --b3: var(--dsy-base3-l)  var(--dsy-base3-c)  var(--dsy-base3-h);

    /* App-level color vars (hex, dùng cho custom CSS) */
    --color-primary:   #6366f1;
    --color-secondary: #1e293b;
    --color-accent:    #ec4899;
    --color-bg:        #0f172a;
  }

  /* Typography */
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');
  body   { font-family: 'Inter', sans-serif; background: var(--color-bg); }
  h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; }
</style>
```

> **Lưu ý kỹ thuật:** DaisyUI v4 dùng oklch, không phải hex trực tiếp. Design Agent sẽ output hex → context-builder convert sang oklch trước khi inject. Hoặc đơn giản hơn: dùng `data-theme` attribute với custom theme definition.

**Cách đơn giản hơn — dùng `data-theme` inline:**
```html
<html data-theme="custom">
<style>
  [data-theme="custom"] {
    --p: 239 68 68;          /* oklch values cho primary */
    --pf: 220 38 38;         /* primary focus */
    --pc: 255 255 255;       /* primary content (text on primary) */
    --b1: 15 23 42;          /* base-100 background */
    --b2: 30 41 59;          /* base-200 */
    --b3: 51 65 85;          /* base-300 */
    --bc: 248 250 252;       /* base-content (text color) */
  }
</style>
```

**Quyết định: Cách B** — Inject hex vars riêng, bypass DaisyUI color tokens hoàn toàn.

```html
<style>
  /* Design System — injected by context-builder */
  :root {
    --color-primary:    #6366f1;
    --color-secondary:  #1e293b;
    --color-accent:     #ec4899;
    --color-bg:         #0f172a;
    --color-text:       #f8fafc;
    --color-text-muted: #94a3b8;
    --color-surface:    #1e293b;   /* card backgrounds, alt sections */
    --color-border:     #334155;
  }

  /* Override DaisyUI component colors */
  .btn-primary  { background-color: var(--color-primary)   !important; border-color: var(--color-primary)   !important; }
  .btn-secondary{ background-color: var(--color-secondary) !important; border-color: var(--color-secondary) !important; }
  .badge-primary{ background-color: var(--color-primary)   !important; }
  .badge-accent { background-color: var(--color-accent)    !important; }

  /* Base layout */
  body    { background-color: var(--color-bg); color: var(--color-text); }
  .navbar { background-color: var(--color-surface); border-bottom: 1px solid var(--color-border); }
  .card   { background-color: var(--color-surface); border: 1px solid var(--color-border); }
  .footer { background-color: var(--color-surface); }
  .hero   { background-color: var(--color-bg); }

  /* Typography */
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');
  body        { font-family: 'Inter', sans-serif; }
  h1,h2,h3,h4 { font-family: 'Space Grotesk', sans-serif; }
</style>
```

**Lý do chọn Cách B:**
- Không cần convert hex → oklch (tránh dependency, tránh bug)
- Dễ debug: thấy hex value trực tiếp trong CSS
- DaisyUI vẫn xử lý structure/layout/interactive behavior
- Generator chỉ cần dùng `var(--color-primary)` thay vì hardcode hex → consistent

---

## 0.2 Quyết định: Multi-page = Progressive Generation

**Vấn đề:** Website phức tạp (4 trang + nhiều tính năng) trong 1 HTML file → AI quality giảm mạnh sau ~800 dòng.

**Data layer:** Tất cả client-side. localStorage cho state đơn giản, **IndexedDB** cho dữ liệu phức tạp/lớn. Không cần backend.

**Multi-page architecture:** Vẫn là **1 HTML file duy nhất** với JS hash router. DB schema không thay đổi.

**Chiến lược generate:** Progressive generation — mỗi trang được generate riêng, AI focus 100% vào 1 trang → chất lượng cao. User thấy kết quả xuất hiện từng trang qua iframe.

```
User: "Website 4 trang bán khóa học..."

[Pipeline phát hiện is_multipage=true]
→ Design 1 lần (shared palette cho toàn site)
→ Scaffold: <head> + navbar + footer + JS router + empty placeholders
  [iframe hiển thị khung ngay]
→ Generate Home    [iframe update: trang Home xuất hiện]
→ Generate Courses [iframe update: + trang Courses]
→ Generate Pricing [iframe update: + trang Pricing]
→ Generate Contact [iframe update: + trang Contact]
→ Review + Validate
```

---

## 1. Vấn đề hiện tại

Pipeline v1 (hiện tại) gồm 4 bước:
```
Analyze (gpt-4o-mini) → Research (gpt-4o-mini) → Generate (gpt-4o) → Validate (local)
```

**Các điểm yếu:**

| # | Vấn đề | Hệ quả |
|---|--------|--------|
| 1 | Không có visual design decisions | Model tự đoán màu sắc, font — output generic |
| 2 | Không có component reference | Mỗi lần generate HTML từ đầu, không nhất quán |
| 3 | Context synthesis kém | Tất cả context nhồi vào system prompt một chuỗi, model attention bị loãng |
| 4 | Không có feedback loop | Output kém vẫn được chấp nhận và trả về user |
| 5 | System prompt quá dài (~3000 tokens) | Không được OpenAI cache, tăng latency + cost |

---

## 2. Kiến trúc Pipeline Mới (7 bước)

### Flow diagram

```
FRESH MODE (tạo website mới):
┌─────────────────────────────────────────────────────────────────┐
│  1. Analyze        │ gpt-4o-mini │ ~5s  │ Intent, sections, data │
│  2. Components     │ local       │ ~0s  │ Chọn snippets từ thư viện│
│  3. Design         │ gpt-4o-mini │ ~5s  │ Palette, typography, style│
│  4. Generate       │ gpt-4o      │ ~30s │ HTML đầy đủ             │
│  5. Review         │ gpt-4o-mini │ ~8s  │ Chấm điểm 0-100         │
│  6. Refine         │ gpt-4o      │ ~25s │ CHỈ khi score < 75      │
│  7. Validate       │ local       │ ~0s  │ Regex fixes             │
└─────────────────────────────────────────────────────────────────┘
  Best case (không refine): ~48s
  Worst case (có refine):   ~73s  ← trong ngưỡng 90s timeout

EDIT MODE (sửa website có sẵn):
┌─────────────────────────────────────────────────────────────────┐
│  1. Analyze        │ gpt-4o-mini │ ~5s                          │
│  2. Components     │ local       │ ~0s                          │
│  3. Generate       │ gpt-4o      │ ~30s │ edit system prompt    │
│  4. Validate       │ local       │ ~0s                          │
└─────────────────────────────────────────────────────────────────┘
  Total: ~35s  (skip Design/Review/Refine — user hài lòng style hiện tại)
```

**Lý do bỏ Design/Review/Refine ở Edit mode:**
- User đã có HTML, đã hài lòng với style → không cần thiết kế lại
- Edit mode chỉ apply thay đổi theo yêu cầu, không redesign
- Giảm latency đáng kể từ ~73s xuống ~35s

---

## 3. Chi tiết kỹ thuật từng bước

### 3A. Context Optimization — Tách System vs User Message

**Vấn đề hiện tại** (`src/lib/ai-pipeline/generator.ts`):
```typescript
// HIỆN TẠI: Nhồi tất cả vào system prompt — ~3000 tokens, không được cache
function buildEnrichedSystemPrompt(analysis, research, currentHtml) {
  const base = buildFreshSystemPrompt();  // ~1500 tokens
  const enrichment = `...analysis...research...`;  // ~1500 tokens thêm
  return base + enrichment;  // OpenAI phải xử lý toàn bộ mỗi lần
}

messages: [
  { role: "system", content: systemPrompt },  // ~3000 tokens
  { role: "user", content: prompt }           // ~50 tokens
]
```

**Cải thiện — Split system / user message:**
```typescript
// MỚI: System prompt = invariant rules (được OpenAI cache tự động)
//      User message = design brief + references + request (varies per request)
messages: [
  { role: "system", content: buildFreshSystemPrompt() },
  // ↑ ~800 tokens, không đổi giữa các request → OpenAI cache prefix

  { role: "user", content: buildUserMessage(prompt, analysis, research, design, components) }
  // ↑ varies per request: design brief + component references + user prompt
]
```

**Lợi ích:**
- OpenAI Prompt Caching: system prompt được cache → ~50% giảm latency cho phần cached
- Cấu trúc rõ ràng hơn: "đây là luật" (system) vs "đây là yêu cầu lần này" (user)
- Model attention tập trung vào user message — nơi có design brief và prompt thực tế
- Dễ debug: tách rõ invariant rules vs per-request context

**Format của `buildUserMessage()`:**
```
=== DESIGN BRIEF ===
Website type: landing
Visual style: bold-dark
Colors: primary=#6366f1  secondary=#1e293b  accent=#ec4899  bg=#0f172a
Fonts: headings=Space Grotesk  body=Inter
Hero layout: split-right | Card border-radius: large | Shadow: soft

=== REQUIRED SECTIONS (theo thứ tự) ===
navbar → hero → features (3-col grid) → stats → testimonials → cta-section → footer

=== CSS PATTERNS (chỉ khi có special features) ===
[flip-card CSS nếu analysis.features có "flip-animation"]
[chart canvas setup nếu có "chart"]

=== REFERENCE COMPONENTS (adapt style, KHÔNG copy content) ===
<!-- REF: Hero bold-dark split-right -->
<section class="hero min-h-screen" style="background:#0f172a">
  ... HTML snippet ...
</section>
<!-- END REF -->

<!-- REF: Features 3-col -->
... HTML snippet ...
<!-- END REF -->

=== USER REQUEST ===
[user's original prompt text]
```

---

### 3B. Component Library

**Mục đích:** Cung cấp reference HTML/DaisyUI snippets chất lượng cao để model "học" style, không phải tạo từ đầu.

**Cấu trúc thư mục:**
```
src/lib/component-library/
├── types.ts              ComponentSnippet interface
├── index.ts              selectComponents() — tag matching, không dùng LLM
└── snippets/
    ├── heroes.ts         6 hero variations (bold-dark, minimal, warm, split-*, overlay)
    ├── navbars.ts        3 navbar styles (minimal, with-logo, with-cta)
    ├── features.ts       3 feature layouts (icon-grid, alternating, numbered-steps)
    ├── cards.ts          4 card types (product, team, blog, pricing)
    ├── footers.ts        3 footer styles (minimal, full, with-newsletter)
    ├── stats.ts          2 stats sections (horizontal-4col, grid-dark)
    └── testimonials.ts   2 testimonial layouts (cards-grid, single-featured)
```

**Type:**
```typescript
// src/lib/component-library/types.ts
export interface ComponentSnippet {
  id: string;
  // ví dụ: "hero-bold-dark", "hero-minimal-centered", "features-icon-grid"

  name: string;
  // ví dụ: "Bold Dark Hero with App Preview"

  category: "hero" | "navbar" | "features" | "cards" | "footer" | "stats" | "testimonials";

  tags: string[];
  // ví dụ: ["dark", "split-right", "saas", "app-preview", "gradient-text"]
  // Tags được dùng để match với analysis.sections và analysis.features

  websiteTypes: Array<"landing" | "portfolio" | "dashboard" | "blog" | "generic">;
  // Website type nào snippet này phù hợp

  html: string;
  // HTML snippet thực tế, compressed, ~200-400 chars
  // Dùng DaisyUI classes + Tailwind utilities
  // KHÔNG chứa real content — chỉ structure + style
}
```

**Selector logic** (`src/lib/component-library/index.ts`):
```typescript
const CATEGORY_PRIORITY: Record<string, string[]> = {
  landing:   ["hero", "features", "stats", "testimonials"],
  portfolio: ["hero", "cards"],
  dashboard: ["stats", "cards"],
  blog:      ["hero", "cards"],
  generic:   ["hero", "features"],
};

export function selectComponents(analysis: AnalysisResult): ComponentSnippet[] {
  const priorities = CATEGORY_PRIORITY[analysis.type] ?? ["hero"];

  return ALL_SNIPPETS
    .filter(s => s.websiteTypes.includes(analysis.type as WebsiteType))
    .filter(s => priorities.includes(s.category))
    .sort((a, b) => {
      // Score theo số tag matches với analysis.sections + analysis.features
      const score = (snippet: ComponentSnippet) =>
        [...analysis.sections, ...analysis.features]
          .filter(f => snippet.tags.some(t => f.includes(t) || t.includes(f)))
          .length;
      return score(b) - score(a);
    })
    .slice(0, 4); // Tối đa 4 snippets → ~1200-1600 tokens injected
}
```

**Ví dụ snippet hoàn chỉnh:**
```typescript
// src/lib/component-library/snippets/heroes.ts
export const HERO_SNIPPETS: ComponentSnippet[] = [
  {
    id: "hero-bold-dark-split",
    name: "Bold Dark Hero — App Preview Split Right",
    category: "hero",
    tags: ["dark", "split-right", "saas", "app-preview", "badge", "cta-dual"],
    websiteTypes: ["landing"],
    html: `<section class="hero min-h-screen" style="background:#0f172a">
<div class="hero-content flex-col-reverse lg:flex-row-reverse gap-12 max-w-6xl w-full px-6 py-20">
  <div class="mockup-window border border-slate-700 w-full max-w-md bg-slate-800 flex-shrink-0">
    <div class="bg-slate-900 p-4 h-48 flex items-center justify-center text-slate-500 text-sm">App Preview</div>
  </div>
  <div class="max-w-lg">
    <span class="badge badge-primary badge-outline mb-6 text-xs font-medium">New Release</span>
    <h1 class="text-5xl font-bold text-white leading-tight mb-4">Main headline<br><span style="color:var(--color-primary)">with accent</span></h1>
    <p class="text-slate-400 text-lg mb-8 leading-relaxed">Value proposition subheadline goes here. Two lines max.</p>
    <div class="flex gap-3 flex-wrap">
      <button class="btn btn-primary btn-lg">Primary CTA</button>
      <button class="btn btn-ghost btn-lg text-white border-slate-600">Secondary →</button>
    </div>
    <p class="text-slate-500 text-sm mt-4">Social proof: "X users", "No credit card", etc.</p>
  </div>
</div>
</section>`,
  },

  {
    id: "hero-minimal-centered",
    name: "Minimal Light Hero — Centered with Tag",
    category: "hero",
    tags: ["light", "centered", "minimal", "tag", "simple"],
    websiteTypes: ["landing", "portfolio", "generic"],
    html: `<section class="hero min-h-[70vh] bg-base-100">
<div class="hero-content text-center max-w-2xl px-6 py-24">
  <div>
    <span class="badge badge-outline mb-6">Category Tag</span>
    <h1 class="text-6xl font-bold text-base-content mb-6 leading-tight">Clean centered headline</h1>
    <p class="text-base-content/60 text-xl mb-10 leading-relaxed">Supporting subheadline. Explain what you do in one or two sentences.</p>
    <div class="flex gap-4 justify-center flex-wrap">
      <button class="btn btn-primary btn-lg px-8">Get Started</button>
      <button class="btn btn-outline btn-lg px-8">Learn More</button>
    </div>
  </div>
</div>
</section>`,
  },

  {
    id: "hero-warm-split",
    name: "Warm Organic Hero — Text Left, Image Right",
    category: "hero",
    tags: ["warm", "split-left", "organic", "image", "personal", "blog"],
    websiteTypes: ["landing", "portfolio", "blog"],
    html: `<section class="hero min-h-[80vh]" style="background:#fef3c7">
<div class="hero-content flex-col lg:flex-row gap-16 max-w-6xl w-full px-6 py-20">
  <div class="max-w-lg">
    <p class="text-amber-600 font-semibold mb-3 text-sm uppercase tracking-wide">Welcome</p>
    <h1 class="text-5xl font-bold leading-tight mb-6" style="font-family:'Playfair Display',serif">Warm and personal headline here</h1>
    <p class="text-amber-900/70 text-lg mb-8 leading-relaxed">Friendly, approachable subheadline. Works great for food, lifestyle, personal blogs.</p>
    <button class="btn bg-amber-600 hover:bg-amber-700 text-white border-none btn-lg rounded-full px-8">Explore Now</button>
  </div>
  <div class="w-full max-w-sm aspect-square rounded-3xl bg-amber-200 flex items-center justify-center text-amber-400 flex-shrink-0">
    <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  </div>
</div>
</section>`,
  },
];
```

---

### 3C. Design Agent

**File:** `src/lib/ai-pipeline/design-agent.ts`

**TypeScript interface:**
```typescript
export interface DesignResult {
  primary: string;      // hex — brand color: buttons, links, accents
  secondary: string;    // hex — supporting: card bg, alternate sections
  accent: string;       // hex — highlight: badges, hover states
  base_bg: string;      // hex — page background
  heading_font: string; // Google Fonts name: "Space Grotesk", "Poppins", etc.
  body_font: string;    // Google Fonts name: "Inter", "Lora", etc.
  style: "bold-dark" | "minimal-light" | "warm-organic" | "corporate-clean" | "playful-colorful";
  border_radius: "none" | "small" | "medium" | "large" | "pill";
  hero_layout: "centered" | "split-left" | "split-right" | "full-bg-overlay";
}
```

**System prompt cho Design Agent:**
```
You are a web design decision engine. Given a website type and user prompt, choose the optimal visual design system.
Output ONLY valid JSON with exactly these keys: primary, secondary, accent, base_bg, heading_font, body_font, style, border_radius, hero_layout.

STYLE PRESETS (match to user's domain):
┌─────────────────┬────────────────────────────────────────────────────────────┐
│ bold-dark       │ bg=#0f172a/#1e293b, bright primary (indigo/violet/pink)    │
│                 │ white text, high contrast, modern tech look                │
│                 │ fonts: Space Grotesk + Inter, radius: large/pill           │
│                 │ → SaaS, tech products, apps, developer tools               │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ minimal-light   │ bg=white/#f8fafc, muted primary (slate-600/teal-600)       │
│                 │ lots of whitespace, clean typography                       │
│                 │ fonts: Poppins + Inter, radius: small/medium               │
│                 │ → Agency, freelance portfolio, minimal product             │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ warm-organic    │ bg=#fef3c7/#fffbeb, amber/orange primary                   │
│                 │ rounded corners, friendly, natural feel                    │
│                 │ fonts: Playfair Display + Lora, radius: large              │
│                 │ → Food, lifestyle, personal blog, wellness                 │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ corporate-clean │ bg=white, blue primary (#2563eb), gray-800 text            │
│                 │ professional, data-forward, sharp edges                    │
│                 │ fonts: IBM Plex Sans + IBM Plex Mono, radius: small        │
│                 │ → Business, consulting, finance, B2B                       │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ playful-colorful│ bg=white, vibrant primary (rose/violet/cyan)               │
│                 │ pill buttons, rounded everything, energetic                │
│                 │ fonts: Nunito + Nunito, radius: pill                       │
│                 │ → Education, kids, creative, fun products                  │
└─────────────────┴────────────────────────────────────────────────────────────┘

HERO LAYOUT RULES:
- centered: default, works for all types
- split-right: has visual element (app screenshot, image) → better for product landing
- split-left: text right, image left → alternative split for variety
- full-bg-overlay: full-width background image with text overlay → photography, lifestyle

BORDER RADIUS:
- none: sharp, corporate, serious
- small: slightly rounded, professional
- medium: friendly-professional balance
- large: modern, approachable
- pill: very rounded, playful, friendly

Respond with ONLY valid JSON, no explanation.
```

**Cách inject design vào HTML:**
```typescript
// generator.ts — sau khi nhận DesignResult từ design-agent
// Inject CSS variables vào <style> block của output HTML
const cssVars = `
  :root {
    --color-primary: ${design.primary};
    --color-secondary: ${design.secondary};
    --color-accent: ${design.accent};
    --color-bg: ${design.base_bg};
  }
`;
// Generator được instructed trong system prompt để dùng var(--color-primary) thay vì hardcode
```

---

### 3D. Multi-pass Review + Conditional Refine

**File:** `src/lib/ai-pipeline/reviewer.ts`

**TypeScript interface:**
```typescript
export interface ReviewResult {
  score: number;           // tổng 0-100
  visual_score: number;    // 0-40: section variety, hierarchy, color, spacing
  content_score: number;   // 0-30: sections present, real content, CTA
  technical_score: number; // 0-30: JS correctness, responsive, DaisyUI usage
  must_fix: string[];      // danh sách lỗi cần fix — [] nếu score >= 75
  suggestions: string[];   // cải thiện tùy chọn (không trigger refine)
}
```

**Reviewer system prompt:**
```
You are a web quality inspector. Evaluate this HTML and return ONLY valid JSON with keys:
score, visual_score, content_score, technical_score, must_fix[], suggestions[]

SCORING RUBRIC:

Visual Quality (max 40 points):
  Start at 40, deduct:
  -15: All sections look identical (same background color, no visual differentiation)
  -10: No visual hierarchy (all text approximately same size, no clear headings)
  -8:  Poor color usage (gray-on-gray, low contrast, random colors not from a palette)
  -5:  Generic/ugly spacing (elements cramped or floating randomly)
  -3:  Missing professional details (no subtle shadows, borders where needed)

Content Completeness (max 30 points):
  Start at 30, deduct:
  -10: Generic placeholder text detected ("lorem ipsum", "Content here", "Your title", "Sample text")
  -8:  Hero section has no value proposition (just a headline, no explanation)
  -7:  Missing call-to-action button in hero
  -5:  Missing footer

Technical Quality (max 30 points):
  Start at 30, deduct:
  -10: Uses alert(), confirm(), or prompt()
  -8:  Alpine.js x-for directive used
  -8:  CSS uses Tailwind class names as CSS properties (justify-center: center, etc.)
  -5:  Obvious JavaScript errors (undeclared variables, syntax issues)
  -3:  Non-responsive (fixed pixel widths on main containers)

must_fix rules:
  - Only include issues that significantly degrade the user experience
  - Be specific and actionable: "Hero CTA button is missing — add a prominent button after the subheadline"
  - NOT vague: never write "improve design" or "add more content"
  - If score >= 75: must_fix MUST be empty []
  - Maximum 3 items in must_fix (focus on biggest issues only)

suggestions: optional improvements that would be nice but aren't critical
```

**Refine prompt** (chỉ trigger khi `must_fix.length > 0`):
```
The following HTML has these specific issues that need fixing:
{must_fix.map((f, i) => `${i+1}. ${f}`).join('\n')}

Fix ONLY these issues. Constraints:
- Keep the overall structure, layout, and color scheme exactly the same
- Do NOT rewrite or redesign sections that don't have issues
- Do NOT add new sections not already present
- Do NOT change the visual style or palette
- Return the complete updated HTML starting with <!DOCTYPE html>
```

**Quyết định threshold 75:**
- < 75 (dưới 3/4 điểm) = có vấn đề nghiêm trọng cần fix
- >= 75 = đủ tốt, không cần refine thêm
- Dựa trên: website có CTA, không có placeholder text, có visual hierarchy cơ bản = ~78+ điểm
- Threshold có thể điều chỉnh sau khi test thực tế

---

### 3E. Rewrite System Prompt (Lean Version)

**Mục tiêu:** Giảm từ ~1500 xuống ~800 tokens, focus vào rules không đổi.

**Những gì GIỮ lại trong system prompt:**
- CDN approvals (Tailwind, DaisyUI, Chart.js, Alpine.js)
- DaisyUI component reference (navbar, hero, cards, buttons, etc.)
- CSS anti-patterns (no Tailwind class as CSS property)
- JavaScript rules (vanilla JS for lists, Alpine only for toggle)
- localStorage prefix "appgen-"
- Output format (raw HTML, start with `<!DOCTYPE html>`)

**Những gì CHUYỂN sang user message:**
- Template selection logic (landing/portfolio/dashboard/blog) → move to `buildUserMessage()`
- Specific structure per template → comes from Design Brief in user message

**Thêm vào system prompt:**
```
Color System:
- Apply CSS variables at root: --color-primary, --color-secondary, --color-accent, --color-bg
- Use var(--color-primary) for buttons, links, key accents (not hardcoded hex)
- This allows consistent color application from the Design Brief

Typography:
- Include Google Fonts <link> in <head> for the fonts specified in Design Brief
- Apply heading font to h1-h3, body font to p and general text
- Font sizes: h1=4xl-6xl, h2=3xl-4xl, h3=xl-2xl, body=base-lg

Visual Design Principles:
- Every section must have DISTINCT visual treatment (alternate bg colors, borders, padding)
- Minimum 3 different background colors/treatments across full page
- Each section needs: clear heading → body copy → optional CTA
```

---

## 4. File Changes Summary

### Plan 09-01: Component Library (không LLM)

```
NEW  src/lib/component-library/types.ts
NEW  src/lib/component-library/index.ts          selectComponents()
NEW  src/lib/component-library/snippets/heroes.ts         6 snippets
NEW  src/lib/component-library/snippets/navbars.ts        3 snippets
NEW  src/lib/component-library/snippets/features.ts       3 snippets
NEW  src/lib/component-library/snippets/cards.ts          4 snippets
NEW  src/lib/component-library/snippets/footers.ts        3 snippets
NEW  src/lib/component-library/snippets/stats.ts          2 snippets
NEW  src/lib/component-library/snippets/testimonials.ts   2 snippets
```

Total: ~25 snippets, ~4000 tokens trong file (chỉ 4 được inject vào prompt = ~1200 tokens)

### Plan 09-02: Design Agent + Context Builder + New Prompts

```
NEW  src/lib/ai-pipeline/design-agent.ts         designWebsite() + DesignResult type
NEW  src/lib/ai-pipeline/context-builder.ts      buildUserMessage() function
EDIT src/lib/ai-pipeline/types.ts                + DesignResult, + new steps in PipelineEvent
EDIT src/lib/html-prompts.ts                     rewrite buildFreshSystemPrompt() (lean)
EDIT src/lib/ai-pipeline/generator.ts            split system/user, new params
```

### Plan 09-03: Review + Wire + Editor Update

```
NEW  src/lib/ai-pipeline/reviewer.ts             reviewHtml() + ReviewResult type
EDIT src/lib/ai-pipeline/generator.ts            + refineHtml() function
EDIT src/lib/ai-pipeline/index.ts                wire 7-step pipeline, fresh/edit branching
EDIT src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx
                                                 new step label map (Vietnamese)
EDIT src/app/api/ai/generate-html/route.ts       maxDuration: 90 → 120
```

---

## 5. Step Label Map (editor-client.tsx)

```typescript
const STEP_LABELS: Record<string, string> = {
  "analyze":    "Phân tích yêu cầu...",
  "components": "Tìm component phù hợp...",
  "design":     "Thiết kế palette & typography...",
  "generate":   "Đang tạo website...",
  "review":     "Đánh giá chất lượng...",
  "refine":     "Tinh chỉnh thiết kế...",
  "validate":   "Kiểm tra lỗi cuối...",
};
```

---

## 6. Token Budget Analysis

| Phần | Tokens (cũ) | Tokens (mới) | Ghi chú |
|------|-------------|--------------|---------|
| System prompt | ~1500 | ~800 | Lean, cacheable |
| Analysis enrichment | ~300 | 0 | → User message |
| Research enrichment | ~400 | ~300 | → User message |
| Design brief | 0 | ~200 | Mới, trong user message |
| Component references | 0 | ~1200 | 4 snippets × ~300 tokens |
| User prompt | ~50 | ~50 | Không đổi |
| **Tổng system** | **~1500** | **~800** | **-47%, được cache** |
| **Tổng user** | **~750** | **~1750** | Varies per request |
| **Grand total** | **~2250** | **~2550** | +300 tokens, nhưng cấu trúc tốt hơn |

---

## 7. Custom Skill (skill.sh / npx skills)

**Có thể tạo custom skill cho pipeline này:**

```bash
npx skills init appgen-prompt-engineer
```

**SKILL.md structure:**
```yaml
---
name: appgen-prompt-engineer
description: >
  Guide for writing and improving AI prompts for AppGen's website generation pipeline.
  Triggers when: improving html-prompts.ts, writing analyzer/designer/reviewer prompts,
  adding component snippets, or optimizing AI context for web generation.
license: MIT
metadata:
  author: Steve
  version: "1.0.0"
---

# AppGen Prompt Engineer

## When to Use
- Khi viết/sửa system prompt cho Analyzer, Designer, Reviewer, Generator
- Khi thêm component snippets vào thư viện
- Khi tối ưu context synthesis cho pipeline
- Khi muốn đánh giá chất lượng prompt hiện tại

## Pipeline Architecture
[Reference pipeline 7 bước ở trên]

## Prompt Writing Rules
[Checklist: specificity, format, examples, edge cases]

## Component Snippet Guidelines
[Format, size limits, DaisyUI usage]
```

**Skill được Claude tự động kích hoạt** dựa trên description triggers — khi user đề cập đến topics match với description.

---

## 7b. Multi-page Pipeline Chi tiết

### Analyzer output (mở rộng)

```typescript
interface AnalysisResult {
  // ... existing fields ...
  is_multipage: boolean;
  pages: Array<{
    id: string;        // "home", "about", "pricing" — lowercase, no spaces
    label: string;     // "Trang chủ", "Giới thiệu"
    sections: string[]; // sections riêng của page
    features: string[]; // features riêng (quiz chỉ ở page "learn")
  }>;
}
```

### Scaffold HTML structure

```html
<body>
  <nav class="navbar sticky top-0 z-50">
    <!-- Links dùng data-page="home" onclick="navigate('home')" -->
  </nav>

  <!-- Placeholders — code inject content vào đây -->
  <div id="page-home"    class="page"></div>
  <div id="page-about"   class="page"></div>
  <div id="page-pricing" class="page"></div>

  <footer>...</footer>

  <script>
    // JS Router (hash-based)
    function navigate(pageId) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('page-' + pageId)?.classList.add('active');
      window.location.hash = pageId;
      window.scrollTo(0, 0);
    }
    navigate(window.location.hash.slice(1) || 'home');
    window.addEventListener('hashchange', () => navigate(window.location.hash.slice(1)));
  </script>

  <!-- IndexedDB setup (chỉ nếu features yêu cầu) -->
  <script>
    const db = await new Promise(resolve => {
      const req = indexedDB.open('appgen-db', 1);
      req.onupgradeneeded = e => { /* object stores */ };
      req.onsuccess = e => resolve(e.target.result);
    });
  </script>
</body>
```

### Combine logic

```typescript
// Sau mỗi page được generate:
function injectPage(scaffold: string, pageId: string, html: string): string {
  return scaffold.replace(
    `<div id="page-${pageId}" class="page"></div>`,
    `<div id="page-${pageId}" class="page">${html}</div>`
  );
}
// currentHtml update → emit SSE với html field → editor-client update iframe
```

### SSE events cho multi-page

```
{step:"scaffold", status:"done",  html:"<skeleton>"}
{step:"page", status:"start", detail:"Tạo trang Home (1/4)...", page_index:1, page_total:4}
{step:"page", status:"done",  detail:"Trang Home xong ✓",      html:"<home injected>", page_index:1}
{step:"page", status:"start", detail:"Tạo trang About (2/4)...", page_index:2, page_total:4}
{step:"page", status:"done",  detail:"Trang About xong ✓",     html:"<+about>", page_index:2}
... etc ...
```

### Timeout

| Mode | Thời gian ước tính | maxDuration |
|------|-------------------|-------------|
| Single-page (no refine) | ~48s | 90s |
| Single-page (with refine) | ~73s | 90s |
| Multi-page 2 trang | ~68s | 180s |
| Multi-page 4 trang | ~128s | 180s |
| Edit mode | ~35s | 90s |

Route detect `is_multipage` từ analysis để dùng AbortSignal timeout phù hợp.

---

## 8. Những điểm cần bàn thêm

- [ ] **Timeout khi có refine:** 73s worst case có đủ margin không? Nên bump lên 120s?
- [ ] **Review threshold:** 75 có phù hợp? Hay nên 70 hoặc 80?
- [ ] **Số snippets per inject:** 4 snippets (~1200 tokens) có quá nhiều không?
- [ ] **Design Agent cho Edit mode:** Có nên extract current colors từ HTML và pass vào Edit prompt không?
- [ ] **Snippet content:** Có nên viết snippets bằng Vietnamese content mẫu không?
- [ ] **Caching strategy:** OpenAI Prompt Caching có tự động không hay cần config?
- [ ] **Component Library expansion:** Ai maintain và thêm snippets sau này?

---

## 9. Verification Plan

1. **Fresh generation test:** Prompt đơn giản ("website bán cà phê") → quan sát 7 SSE steps trong chat
2. **Edit mode test:** Sửa một website → xác nhận chỉ 4 bước (không có design/review/refine)
3. **Visual quality test:** So sánh output trước/sau — hero phải có palette rõ, không generic
4. **Review trigger test:** Xem logs để confirm review score được tính và refine chỉ fire khi score < 75
5. **Context structure test:** Log OpenAI request payload → system prompt ~800 tokens, user message có design brief
6. **Component injection test:** Verify reference snippets trong user message
7. **Typecheck:** `npm run typecheck` phải pass
8. **Timeout test:** Generation với refine phải < 120s
