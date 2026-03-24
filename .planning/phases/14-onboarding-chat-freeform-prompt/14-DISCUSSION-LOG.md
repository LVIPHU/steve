# Phase 14: onboarding-chat-freeform-prompt - Discussion Log (Assumptions Mode)

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the analysis.

**Date:** 2026-03-24
**Phase:** 14-onboarding-chat-freeform-prompt
**Mode:** assumptions
**Areas analyzed:** UX Interaction Pattern, Website Name Extraction, Input Design, Scope of Changes

## Assumptions Presented

### UX Interaction Pattern
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Xóa state machine chat, thay bằng màn hình đơn giản + submit trực tiếp | Confident | onboarding-chat.tsx lines 21–153 |

### Website Name Extraction
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| 50 ký tự đầu prompt làm tên website | Likely | onboarding-chat.tsx line 136, route.ts |

### Input Design
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Textarea lớn, Ctrl+Enter submit | Confident | editor-client.tsx pattern, onboarding-chat.tsx |

### Scope of Changes
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Chỉ sửa onboarding-chat.tsx | Confident | page.tsx là 5 dòng, route.ts không thay đổi, URL pattern đã end-to-end |

## Corrections Made

### Website Name Extraction
- **Original assumption:** Dùng 50 ký tự đầu prompt làm tên website
- **User correction:** AI tự đặt tên — gọi AI (gpt-4o-mini) để extract tên có nghĩa từ freeform prompt
- **Reason:** Tên có nghĩa hơn, không bị cắt thô giữa chừng
