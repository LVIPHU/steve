# Business Requirements Document (BRD)
# Tính năng: Website Generator

**Phiên bản:** 1.0  
**Ngày:** 13/03/2026  
**Trạng thái:** Draft

---

## 1. Tổng quan sản phẩm

### 1.1 Mô tả

Website Generator là một tính năng tích hợp trực tiếp vào app note hiện có. Tính năng cho phép người dùng tự động tạo ra một website hoàn chỉnh từ nội dung các note của họ hoặc từ mô tả (prompt) tự nhập. Website được tạo ra có thể được chỉnh sửa, publish lên internet và chia sẻ với mọi người.

### 1.2 Đối tượng người dùng

Người dùng hiện tại của app note, bao gồm những người có note về các chủ đề:
- Học ngôn ngữ
- Fitness / Sức khỏe
- Nấu ăn / Công thức
- Lập trình / Kỹ thuật
- Kỹ năng cá nhân và phát triển bản thân

### 1.3 Mục tiêu kinh doanh

- Tăng giá trị của app note: note không chỉ để lưu trữ mà còn có thể trở thành sản phẩm có thể chia sẻ
- Tạo nguồn doanh thu mới thông qua mô hình Freemium
- Tăng tỷ lệ giữ chân người dùng (retention) nhờ tính năng có giá trị cao

### 1.4 Phạm vi

Tài liệu này mô tả phiên bản 1 (v1) của tính năng. Các tính năng ngoài phạm vi v1 được liệt kê ở mục 7.

---

## 2. Luồng tạo website (Core Flow)

Luồng chính khi người dùng muốn tạo một website mới:

1. **Chọn note nguồn** — Người dùng chọn một hoặc nhiều note có sẵn trong app. AI phân tích nội dung và gợi ý các template phù hợp với chủ đề của note.
2. **Chọn template hoặc nhập prompt** — Người dùng chọn một template từ danh sách gợi ý, hoặc bỏ qua và nhập prompt mô tả website mong muốn theo cách tự do.
3. **AI sinh website** — Hệ thống AI tự động tạo website dựa trên note nguồn + template đã chọn + prompt (nếu có).
4. **Preview & Chỉnh sửa** — Người dùng xem kết quả trực tiếp trong app, chỉnh sửa nếu cần.
5. **Publish** — Người dùng publish website để lấy link công khai.

---

## 3. Yêu cầu tính năng chi tiết

### 3.1 Tạo Website

| Tính năng | Mô tả |
|---|---|
| Gen từ note | Chọn note có sẵn, AI gợi ý template phù hợp với nội dung |
| Gen từ prompt | Nhập mô tả tự do, AI tạo website từ đầu |
| Gen kết hợp | Chọn template + chọn note + nhập thêm prompt để tinh chỉnh |
| Gen lại toàn bộ | Người dùng có thể yêu cầu AI tạo lại toàn bộ website |
| Gen lại từng section | Chọn một phần cụ thể trên website và yêu cầu AI gen lại chỉ phần đó |
| Tinh chỉnh bằng prompt | Nhập thêm yêu cầu để AI chỉnh sửa website theo hướng mong muốn |

### 3.2 Đồng bộ Note ↔ Website

| Tính năng | Mô tả |
|---|---|
| Liên kết nguồn | Hệ thống ghi nhớ website được tạo từ note nào |
| Tự động đồng bộ | Khi note nguồn được chỉnh sửa, website tự động được cập nhật theo |

> **Lưu ý nghiệp vụ:** Khi note thay đổi, AI sẽ cập nhật nội dung website nhưng giữ nguyên bố cục và thiết kế mà người dùng đã chỉnh sửa thủ công. Người dùng cần được thông báo khi đồng bộ xảy ra.

### 3.3 Editor & Tùy chỉnh

| Tính năng | Mô tả |
|---|---|
| Visual editor | Kéo thả các thành phần, thêm/xóa section trực tiếp trên giao diện |
| Sửa nội dung | Click trực tiếp vào text, ảnh để chỉnh sửa |
| Tùy chỉnh giao diện | Thay đổi màu sắc chủ đạo, font chữ, khoảng cách |
| Preview responsive | Xem trước giao diện ở 3 chế độ: Desktop / Tablet / Mobile |
| Regenerate section | Chọn section bất kỳ và nhấn "Gen lại" để AI tạo nội dung mới cho section đó |

### 3.4 Publish & Chia sẻ

| Tính năng | Mô tả |
|---|---|
| Link công khai | Mỗi website có URL riêng dạng `appnote.com/username/ten-website` |
| Quản lý trạng thái | Website có 3 trạng thái: **Draft** (đang soạn), **Published** (công khai), **Archived** (lưu trữ) |
| SEO tự động | AI tự động tạo: meta title, meta description, slug URL, ảnh OG từ nội dung website |
| Analytics nâng cao | Thống kê chi tiết: lượt xem, nguồn traffic, thời gian ở trang, loại thiết bị, vị trí địa lý |

### 3.5 Freemium

| Gói | Số website tối đa | Tính năng |
|---|---|---|
| Free | 3 website | Tất cả tính năng cơ bản |
| Premium | Không giới hạn | Tất cả tính năng, bao gồm analytics nâng cao |

---

## 4. Yêu cầu phi chức năng

- Website được gen ra phải **responsive** trên tất cả thiết bị (mobile, tablet, desktop)
- Thời gian gen website không quá **30 giây** trong điều kiện bình thường
- Link publish phải hoạt động ngay sau khi người dùng nhấn Publish (không có độ trễ)
- SEO meta tags được tạo tự động ngay khi website được publish

---

## 5. Quy tắc nghiệp vụ

1. Người dùng Free chỉ được tạo tối đa 3 website. Khi đạt giới hạn, hệ thống hiển thị thông báo nâng cấp lên Premium.
2. Người dùng có thể xóa website để giải phóng slot (áp dụng cho gói Free).
3. Khi note nguồn bị xóa, website vẫn tồn tại và giữ nguyên nội dung cuối cùng (không tự xóa theo).
4. Website ở trạng thái Draft không thể truy cập qua link công khai.
5. Website ở trạng thái Archived vẫn giữ link nhưng hiển thị trang "Website không còn hoạt động".
6. Slug URL được AI tạo tự động nhưng người dùng có thể chỉnh sửa lại trước khi publish.
7. Khi đồng bộ tự động từ note, lịch sử chỉnh sửa thủ công của người dùng trong Editor được bảo toàn.

---

## 6. Giao diện người dùng — Điểm tiếp xúc chính

- **Nút "Tạo Website"** xuất hiện trong giao diện note (khi đang xem một note bất kỳ)
- **Trang danh sách Website** — quản lý tất cả website đã tạo
- **Trang Editor** — kết hợp preview và công cụ chỉnh sửa
- **Trang Analytics** — xem thống kê từng website
- **Trang Template** — chọn template khi tạo mới

---

## 7. Ngoài phạm vi (v1)

Các tính năng sau **không** được triển khai trong v1 và sẽ xem xét ở phiên bản sau:

- Version history (lịch sử phiên bản website)
- Thông báo push
- Cộng tác đa người dùng trên một website
- Tên miền riêng (custom domain)
- Export mã nguồn
- Marketplace / cộng đồng template
- Admin panel
