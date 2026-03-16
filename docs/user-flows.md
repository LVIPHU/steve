# Luồng Người Dùng (User Flows)
# Tính năng: Website Generator

**Phiên bản:** 1.0  
**Ngày:** 13/03/2026

---

## Flow 1: Tạo website từ Note có sẵn

Đây là luồng chính và phổ biến nhất.

```
[Người dùng đang xem Note]
        |
        v
[Nhấn "Tạo Website từ Note này"]
        |
        v
[AI phân tích nội dung note]
        |
        v
[Hiển thị danh sách template gợi ý (phù hợp với chủ đề note)]
        |
        +---> [Chọn một template]
        |           |
        |           v
        |     [Tùy chọn: Nhập thêm prompt để tinh chỉnh]
        |           |
        +---> [Bỏ qua template, nhập prompt riêng]
        |
        v
[Nhấn "Tạo Website"]
        |
        v
[AI sinh website (~30 giây)]
        |
        v
[Hiển thị Preview trong Editor]
        |
        +---> [Hài lòng] ---> [Nhấn "Publish"] ---> [Lấy link chia sẻ]
        |
        +---> [Chưa hài lòng] ---> [Chỉnh sửa thủ công trong Editor]
        |                                   |
        |                                   v
        |                           [Nhấn "Publish"] ---> [Lấy link chia sẻ]
        |
        +---> [Muốn thay đổi hoàn toàn] ---> [Gen lại toàn bộ]
```

---

## Flow 2: Tạo website từ Prompt (không dùng note)

Luồng dành cho người dùng muốn tạo website hoàn toàn từ mô tả tự do.

```
[Trang danh sách Website]
        |
        v
[Nhấn "Tạo Website Mới"]
        |
        v
[Chọn phương thức: "Nhập mô tả (Prompt)"]
        |
        v
[Nhập prompt mô tả website mong muốn]
(ví dụ: "Tạo landing page giới thiệu khóa học nấu ăn của tôi,
        phong cách ấm áp, màu cam, có phần menu và liên hệ")
        |
        v
[Tùy chọn: Chọn thêm template để định hình bố cục]
        |
        v
[Nhấn "Tạo Website"]
        |
        v
[AI sinh website]
        |
        v
[Hiển thị Preview trong Editor]
        |
        v
[Chỉnh sửa nếu cần → Publish → Lấy link]
```

---

## Flow 3: Chỉnh sửa trong Editor

Luồng sau khi website đã được gen, người dùng muốn tùy chỉnh.

```
[Mở Editor của một website]
        |
        v
[Chọn chế độ xem: Desktop / Tablet / Mobile]
        |
        v
[Chỉnh sửa nội dung trực tiếp]
        |
        +---> [Click vào text] ---> [Sửa nội dung văn bản]
        |
        +---> [Click vào ảnh] ---> [Thay ảnh mới]
        |
        +---> [Kéo thả section] ---> [Thay đổi thứ tự bố cục]
        |
        +---> [Mở bảng Style] ---> [Đổi màu / font / khoảng cách]
        |
        +---> [Chọn một section] ---> [Nhấn "Gen lại section này"]
        |                                       |
        |                                       v
        |                           [Tùy chọn: nhập thêm prompt]
        |                                       |
        |                                       v
        |                           [AI gen nội dung mới cho section đó]
        |
        v
[Nhấn "Lưu"] ---> [Cập nhật website]
```

---

## Flow 4: Publish & Quản lý trạng thái

```
[Website ở trạng thái Draft]
        |
        v
[Nhấn "Publish"]
        |
        v
[AI tự động tạo: meta title, description, slug, ảnh OG]
        |
        v
[Tùy chọn: Xem lại và chỉnh sửa slug URL trước khi publish]
        |
        v
[Xác nhận Publish]
        |
        v
[Website chuyển sang trạng thái Published]
        |
        v
[Hiển thị link công khai: appnote.com/username/ten-website]
        |
        +---> [Copy link] ---> [Chia sẻ]
        |
        +---> [Muốn tạm ẩn] ---> [Chuyển về Draft]
        |
        +---> [Muốn lưu trữ] ---> [Chuyển sang Archived]
```

---

## Flow 5: Xem Analytics

```
[Trang danh sách Website]
        |
        v
[Chọn website đã Published]
        |
        v
[Nhấn tab "Analytics"]
        |
        v
[Xem báo cáo:]
- Tổng lượt xem
- Lượt xem theo thời gian (biểu đồ)
- Nguồn traffic (trực tiếp / mạng xã hội / tìm kiếm)
- Thời gian ở trang trung bình
- Phân bổ thiết bị (Desktop / Mobile / Tablet)
- Vị trí địa lý người xem
```

---

## Flow 6: Đồng bộ tự động khi Note thay đổi

```
[Người dùng chỉnh sửa Note]
        |
        v
[Hệ thống phát hiện Note có website liên kết]
        |
        v
[AI tự động cập nhật nội dung website theo nội dung note mới]
(Giữ nguyên bố cục và tùy chỉnh giao diện đã có)
        |
        v
[Hiển thị thông báo nhỏ: "Website '[tên]' đã được cập nhật"]
        |
        v
[Người dùng có thể vào Editor kiểm tra lại nếu muốn]
```

---

## Flow 7: Nâng cấp lên Premium (khi đạt giới hạn Free)

```
[Người dùng Free đang có 3 website]
        |
        v
[Nhấn "Tạo Website Mới"]
        |
        v
[Hiển thị thông báo: "Bạn đã đạt giới hạn 3 website của gói Free"]
        |
        +---> [Nâng cấp lên Premium] ---> [Trang thanh toán] ---> [Mở khóa không giới hạn]
        |
        +---> [Xóa website cũ để lấy slot] ---> [Quay lại tạo mới]
        |
        +---> [Hủy]
```
