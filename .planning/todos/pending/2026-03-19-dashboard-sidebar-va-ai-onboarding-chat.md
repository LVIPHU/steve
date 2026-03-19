---
created: 2026-03-19T07:00:31.285Z
title: Dashboard sidebar và AI onboarding chat
area: ui
files: []
---

## Problem

Dashboard hiện tại không có sidebar — các website chỉ hiển thị dạng list trên trang dashboard. Trang tạo website mới dùng form đơn giản (name + prompt textarea) nhưng không có bước AI hỏi để làm rõ ý định trước khi generate.

## Solution

**Phase 8 — Dashboard Sidebar + AI Onboarding Chat:**

1. **Sidebar layout** — Thêm sidebar vào dashboard layout hiển thị danh sách các website đã tạo (tên + status). Click vào website → vào editor của website đó. Nút "Tạo mới" ở trên sidebar.

2. **Default dashboard page = AI chat** — Khi vào /dashboard (chưa chọn website), hiển thị chat interface với AI. AI chủ động hỏi về:
   - Loại website muốn tạo (portfolio, landing page, blog, tool...)
   - Business context và mục tiêu
   - Tính năng chính cần có
   - Đối tượng người dùng

3. **Sau khi chat đủ context** → AI tạo website và redirect sang editor (giữ nguyên Option A flow: auto-generate trong editor).

Thay thế flow hiện tại: form đơn giản (name + prompt) → redirect editor.
