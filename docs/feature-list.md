# Danh Sách Tính Năng theo Độ Ưu Tiên (MoSCoW)
# Tính năng: Website Generator

**Phiên bản:** 1.0  
**Ngày:** 13/03/2026

---

## Giải thích MoSCoW

| Ký hiệu | Nghĩa | Mô tả |
|---|---|---|
| **M** | Must Have | Bắt buộc phải có — sản phẩm không hoạt động nếu thiếu |
| **S** | Should Have | Nên có — quan trọng nhưng có thể ra mắt thiếu |
| **C** | Could Have | Có thể có — tốt nếu có, không ảnh hưởng lớn nếu thiếu |
| **W** | Won't Have (v1) | Không làm trong v1 — để lại cho phiên bản sau |

---

## Nhóm 1: Tạo Website (Core)

| # | Tính năng | Ưu tiên | Ghi chú |
|---|---|---|---|
| 1.1 | Gen website từ note có sẵn | **M** | Tính năng cốt lõi |
| 1.2 | AI gợi ý template dựa theo nội dung note | **M** | Không có thì UX rất kém |
| 1.3 | Gen website từ prompt tự nhập | **M** | Luồng thay thế quan trọng |
| 1.4 | Gen kết hợp: template + note + prompt | **S** | Tăng chất lượng kết quả |
| 1.5 | Gen lại toàn bộ website | **M** | Cần thiết khi kết quả chưa như ý |
| 1.6 | Gen lại từng section riêng lẻ | **S** | Tiết kiệm thời gian chỉnh sửa |
| 1.7 | Tinh chỉnh bằng prompt sau khi gen | **S** | Trải nghiệm AI chat-like |

---

## Nhóm 2: Đồng bộ Note ↔ Website

| # | Tính năng | Ưu tiên | Ghi chú |
|---|---|---|---|
| 2.1 | Lưu liên kết giữa website và note nguồn | **M** | Nền tảng cho đồng bộ |
| 2.2 | Tự động đồng bộ khi note thay đổi | **M** | Điểm khác biệt của sản phẩm |
| 2.3 | Bảo toàn tùy chỉnh thủ công khi đồng bộ | **M** | Nếu thiếu, đồng bộ sẽ gây hại |
| 2.4 | Thông báo trong app khi đồng bộ xảy ra | **S** | Giúp người dùng biết website đã cập nhật |

---

## Nhóm 3: Editor & Tùy chỉnh

| # | Tính năng | Ưu tiên | Ghi chú |
|---|---|---|---|
| 3.1 | Sửa nội dung text trực tiếp trên preview | **M** | Cần thiết cơ bản |
| 3.2 | Thay ảnh trực tiếp | **M** | Cần thiết cơ bản |
| 3.3 | Kéo thả thay đổi thứ tự section | **S** | Nâng cao trải nghiệm |
| 3.4 | Thêm / Xóa section | **S** | Linh hoạt hóa bố cục |
| 3.5 | Tùy chỉnh màu sắc chủ đạo | **S** | Cá nhân hóa thương hiệu |
| 3.6 | Tùy chỉnh font chữ | **S** | Cá nhân hóa thương hiệu |
| 3.7 | Preview Desktop / Tablet / Mobile | **M** | Website phải responsive |
| 3.8 | Regenerate một section cụ thể | **S** | Liên quan đến 1.6 |

---

## Nhóm 4: Quản lý Website

| # | Tính năng | Ưu tiên | Ghi chú |
|---|---|---|---|
| 4.1 | Danh sách tất cả website đã tạo | **M** | Điểm vào quản lý |
| 4.2 | Trạng thái Draft / Published / Archived | **M** | Kiểm soát hiển thị công khai |
| 4.3 | Đổi tên website | **M** | Quản lý cơ bản |
| 4.4 | Xóa website | **M** | Đặc biệt quan trọng với gói Free (giải phóng slot) |
| 4.5 | Duplicate website | **C** | Tiện lợi nhưng không cần thiết |

---

## Nhóm 5: Publish & Chia sẻ

| # | Tính năng | Ưu tiên | Ghi chú |
|---|---|---|---|
| 5.1 | Publish lên link công khai | **M** | Mục tiêu chính của tính năng |
| 5.2 | URL dạng `appnote.com/username/ten-website` | **M** | Thể hiện danh tính người dùng |
| 5.3 | Chỉnh sửa slug URL trước khi publish | **S** | Tùy chỉnh link theo ý muốn |
| 5.4 | SEO tự động (meta title, description, OG image, slug) | **M** | Ảnh hưởng đến khả năng chia sẻ và tìm kiếm |
| 5.5 | Copy link một click | **M** | UX cơ bản |

---

## Nhóm 6: Analytics

| # | Tính năng | Ưu tiên | Ghi chú |
|---|---|---|---|
| 6.1 | Tổng lượt xem | **M** | Thông tin cơ bản nhất |
| 6.2 | Biểu đồ lượt xem theo thời gian | **S** | Trực quan hóa xu hướng |
| 6.3 | Nguồn traffic (trực tiếp / mạng xã hội / tìm kiếm) | **S** | Hiểu người xem đến từ đâu |
| 6.4 | Thời gian ở trang trung bình | **S** | Đánh giá chất lượng nội dung |
| 6.5 | Phân bổ loại thiết bị | **C** | Tối ưu hóa hiển thị |
| 6.6 | Vị trí địa lý người xem | **C** | Hiểu đối tượng |

---

## Nhóm 7: Freemium

| # | Tính năng | Ưu tiên | Ghi chú |
|---|---|---|---|
| 7.1 | Giới hạn 3 website với tài khoản Free | **M** | Cơ chế tạo doanh thu |
| 7.2 | Gói Premium: không giới hạn số website | **M** | Cơ chế tạo doanh thu |
| 7.3 | Thông báo nâng cấp khi đạt giới hạn | **M** | Chuyển đổi Free → Premium |
| 7.4 | Trang thanh toán / nâng cấp gói | **M** | Hoàn thiện luồng monetization |

---

## Ngoài phạm vi v1 (Won't Have)

| # | Tính năng | Lý do lùi lại |
|---|---|---|
| W1 | Version history (lịch sử phiên bản) | Phức tạp, chưa cần thiết giai đoạn đầu |
| W2 | Thông báo push | Chưa ưu tiên |
| W3 | Cộng tác đa người dùng | Tăng độ phức tạp kỹ thuật đáng kể |
| W4 | Custom domain (tên miền riêng) | Hạ tầng phức tạp, để sau |
| W5 | Export mã nguồn Next.js | Để sau khi có nhu cầu rõ ràng |
| W6 | Marketplace / cộng đồng template | Tính năng xã hội, để sau |
| W7 | Admin panel | Quản lý nội bộ, triển khai sau |
