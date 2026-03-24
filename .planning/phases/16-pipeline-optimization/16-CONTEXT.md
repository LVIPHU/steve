# Phase 16 Context: Pipeline Optimization

## Why This Phase Exists

Sau khi sửa bugs nghiêm trọng (Phase 15), phase này tối ưu cấu trúc pipeline để giảm latency và cost mà không ảnh hưởng chất lượng output.

## 4 Cải tiến chính

### 1. Merge analyze + design thành 1 LLM call

**Impact:** Giảm 1 LLM call = ~0.5-1s latency + ~$0.00008/request

Hiện tại: 2 calls riêng dùng gpt-4o-mini:
- `analyzePrompt(prompt)` → type, sections, features
- `runDesignAgent(prompt, analysis)` → preset, palette, fonts

Cả 2 đều nhận cùng `prompt`, cùng model, cùng timeout. Merge thành 1 call với combined Zod schema.

### 2. Conditional review — skip khi validator clean

**Impact:** Skip review cho ~60-70% cases → tiết kiệm 1-2 LLM calls + 10-25s mỗi generation

Hiện tại: review LUÔN chạy khi `ENABLE_REFINE=true`. Nhiều generations chất lượng tốt vẫn bị review không cần thiết.

Logic mới: validate trước → chỉ review nếu `warnings.length > 0 || fixes.length > 2 || html.length < 2000`.

### 3. Strengthen validator (+8 checks)

**Impact:** Bắt thêm lỗi phổ biến mà KHÔNG cần LLM ($0, <1ms)

Thêm: DOCTYPE check, essential tags (html/head/body), viewport meta, Tailwind CDN, empty body, HTML too short, mismatched script tags, CSS var referenced but not defined.

### 4. Cross-page design consistency

**Impact:** Pages "about", "contact" sẽ match màu sắc và fonts của "index"

Hiện tại: mỗi page generate độc lập — không biết pages khác trông thế nào.

Fix: extract design summary từ pages hiện có → inject vào context khi generate page mới.

## Key Files

- `src/lib/ai-pipeline/index.ts`
- `src/lib/ai-pipeline/validator.ts`
- `src/app/api/ai/generate-html/route.ts`
- `src/lib/ai-pipeline/context-builder.ts`
- Tạo mới: `src/lib/ai-pipeline/analyze-and-design.ts`

## Cost/Latency Impact

```
Hiện tại (fresh, no refine): 3 calls, ~$0.035, ~12-20s
Sau tối ưu (fresh, no refine): 2 calls, ~$0.035, ~10-17s (merge saves 1 round trip)

Hiện tại (fresh, ENABLE_REFINE=true): 5 calls, ~$0.096, ~20-50s
Sau tối ưu (conditional): ~2-4 calls, ~$0.035-$0.096, ~10-50s
Average: ~$0.053 (giảm từ ~$0.096 nếu refine luôn on)
```
