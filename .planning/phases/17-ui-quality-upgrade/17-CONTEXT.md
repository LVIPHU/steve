# Phase 17 Context: UI Quality Upgrade

## Why This Phase Exists

Sau khi fix bugs và optimize pipeline (Phases 15-16), chất lượng HTML output vẫn chưa đạt production-ready. Nguyên nhân chính: system prompt chủ yếu nói "KHÔNG làm gì" (anti-patterns) mà thiếu "NÊN làm gì" (design principles). LLM cũng không có reference examples cụ thể để follow.

## Key Insight từ Industry Analysis

Từ `docs/steve-complete-analysis-and-roadmap.md`:

> "Bolt.new bản chất chỉ là 'một prompt được viết rất tốt' — system prompt quality quyết định 80% output quality."

> "LLM follow complete examples TỐT HƠN nhiều so với chỉ đọc rules"

> "v0 dùng shadcn/ui + design system registry cho consistent output. Steve tương đương: component library + design tokens."

## 3 Cải tiến chính

### 1. Rewrite system prompt với Design Principles

Hiện tại `html-prompts.ts` fresh mode có ~114 dòng, phần lớn là anti-patterns và setup instructions. Cần thêm:
- **Design Principles**: whitespace, visual hierarchy, spacing scale, cards, buttons
- **Modern UI Patterns**: hero, navbar, feature cards, testimonials, CTA, footer patterns cụ thể

Cost: $0, impact: rất cao (cải thiện 100% generations ngay lập tức)

### 2. Golden example pages trong component library

Thêm 3-4 complete page examples (200-300 dòng mỗi cái) vào component library. Khi LLM thấy example đẹp và production-ready, output sẽ match quality đó.

### 3. Mở rộng design tokens

Thêm 4 tokens mới: `borderRadius`, `cardStyle`, `heroStyle`, `density`. Inject vào context-builder để control layout cụ thể hơn thay vì để LLM đoán.

## Key Files

- `src/lib/html-prompts.ts`
- Tạo mới: `src/lib/component-library/snippets/examples.ts`
- `src/lib/component-library/index.ts`
- `src/lib/ai-pipeline/design-agent.ts`
- `src/lib/ai-pipeline/context-builder.ts`
- `src/lib/ai-pipeline/types.ts`
