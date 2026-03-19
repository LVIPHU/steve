---
created: 2026-03-19T08:30:49.196Z
title: Resources gallery và RAG-powered generation
area: api
files:
  - src/db/schema.ts
  - src/lib/html-prompts.ts
  - src/app/api/ai/generate-html/route.ts
---

## Problem

AI generate HTML không có reference thực tế — chỉ dựa vào mô tả text trong system prompt. Không có cách để community đóng góp templates tốt, và AI không học được từ các websites đã được tạo trước đó.

## Solution

**Phase 9 — Resources gallery + RAG-powered generation:**

### Phase A: Resources gallery
- DB table `resources`: `id`, `title`, `description`, `html`, `author_id`, `usage_count`, `is_featured`, `created_at`
- Trang `/resources` public — browse, preview template trong iframe, nút "Dùng template này"
- Nút "Publish as template" trong editor → user đặt title + description → publish lên resources

### Phase B: Vector embeddings + semantic search
- Khi publish template → call OpenAI `text-embedding-3-small` API trên (title + description) → lưu `embedding vector(1536)` vào DB
- Enable pgvector extension trên Supabase: `CREATE EXTENSION vector`
- Index: `CREATE INDEX ON resources USING ivfflat (embedding vector_cosine_ops)`
- Khi generate HTML → embed user prompt → `SELECT * FROM resources ORDER BY embedding <=> $1 LIMIT 3` → inject top 3 templates làm few-shot examples

### Phase C: Quality filter
- `usage_count` tăng mỗi khi template được dùng làm reference
- AI ưu tiên templates có `usage_count` cao hoặc `is_featured = true`
- Mod/admin có thể mark `is_featured`

### Stack
- pgvector: đã có sẵn trên Supabase, chỉ cần enable extension
- Embeddings: OpenAI `text-embedding-3-small` (~$0.00002/1K tokens, rất rẻ)
- Không cần infrastructure mới
