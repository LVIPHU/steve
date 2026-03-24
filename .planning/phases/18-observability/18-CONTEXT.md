# Phase 18 Context: Observability & Testing

## Why This Phase Exists

Sau 3 phases cải tiến (15-17), cần visibility để đánh giá hiệu quả và tiếp tục optimize data-driven:
- Không biết mỗi generation tốn bao nhiêu tiền, bao nhiêu thời gian
- Không có cách test tự động xem output quality có improve không
- Không thể biết step nào chậm nhất để optimize tiếp

## Hai components chính

### 1. Langfuse Tracing

Langfuse là open-source LLM observability platform. Free tier: 50K observations/tháng.

Mỗi pipeline step sẽ được trace với: model, input length, output length, latency ms, step name.

Dashboard Langfuse cho phép:
- Xem cost per generation theo thời gian
- So sánh latency trước/sau tối ưu
- Tìm slow steps để focus

### 2. Eval Test Suite

Tập hợp 20+ prompts đại diện cho các use cases, với expected criteria (không phải expected output cụ thể — output AI không deterministic).

Runner chạy pipeline cho từng prompt, đánh giá kết quả theo criteria.

**Không phải** unit test thường xuyên — eval suite tốn tiền OpenAI. Chạy thủ công hoặc theo schedule.

## Key Files

- Tạo mới: `src/lib/langfuse.ts`
- `src/lib/ai-pipeline/index.ts`
- `.env.example`
- Tạo mới: `tests/eval/prompts.ts`
- Tạo mới: `tests/eval/runner.ts`
- `package.json`

## Important: Graceful No-op

Langfuse integration phải không crash nếu keys không set. Dùng pattern:

```typescript
export const langfuse = process.env.LANGFUSE_SECRET_KEY
  ? new Langfuse({ ... })
  : null;
```
