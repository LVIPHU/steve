# Phase 15 Context: Critical Bug Fixes

## Why This Phase Exists

Phân tích source code phát hiện 3 bug nghiêm trọng ảnh hưởng trực tiếp đến chất lượng output AI:

### Bug #1 — Edit mode KHÔNG gửi currentHtml cho LLM (CRITICAL)

`buildEditUserMessage()` trong `context-builder.ts` không nhận `currentHtml` parameter. LLM nhận instruction "Preserve existing colors and typography" nhưng không có HTML nào để preserve → sinh HTML mới hoàn toàn, mất content cũ.

File: `src/lib/ai-pipeline/context-builder.ts` (hàm `buildEditUserMessage`)
File: `src/lib/ai-pipeline/index.ts` (chỗ gọi `buildEditUserMessage(prompt)` thiếu currentHtml)

### Bug #2 — Generation KHÔNG streaming (HIGH)

`generator.ts` dùng `await create()` — chờ TOÀN BỘ response (10-30s) mới return. User thấy màn hình trống, nghĩ app bị treo.

SSE hiện tại:
```
t=3s  → "generate: start"
t=3-30s → IM LẶNG
t=30s → "generate: done" + toàn bộ HTML xuất hiện 1 cục
```

File: `src/lib/ai-pipeline/generator.ts`

### Bug #3 — System prompt quá nặng cho Edit mode (HIGH)

Khi edit "đổi màu nút", LLM nhận 114 dòng system prompt bao gồm CDN setup, dark mode script, 20+ Preline patterns, CSS rules... — 80% không liên quan, lãng phí tokens và có thể confuse model.

File: `src/lib/html-prompts.ts`

## Scope

- **Không** thêm tính năng mới
- **Không** thay đổi pipeline structure
- **Chỉ** fix các bugs trên

## Key Files

- `src/lib/ai-pipeline/context-builder.ts` — buildEditUserMessage()
- `src/lib/ai-pipeline/index.ts` — pipeline orchestrator
- `src/lib/html-prompts.ts` — buildSystemPrompt()
- `src/lib/ai-pipeline/generator.ts` — generateHtml()
- `src/lib/ai-pipeline/types.ts` — PipelineEvent type
- `src/app/api/ai/generate-html/route.ts` — SSE route
- `src/app/(dashboard)/dashboard/websites/[id]/edit/editor-client.tsx` — SSE consumer

## Dependencies

- Phase 14 (complete) — freeform onboarding chat đã ship
- Không có dependencies ngoài
