# Ký túc xá Đại học Nghệ An

Website quản lý ký túc xá cho một tòa nhà 4 tầng, gồm 35 màn hình dựng theo bộ ảnh thiết kế trong thư mục gốc.

- **Trang công khai:** trang chủ, tìm phòng, chi tiết phòng và chọn giường, đăng nhập, đăng ký, quên mật khẩu.
- **Cổng sinh viên:** tổng quan, đăng ký lưu trú, phòng của tôi, hồ sơ và thỏa thuận, hóa đơn, thanh toán, báo sửa chữa, gia hạn, chuyển phòng, trả phòng, hỗ trợ, thông báo, tài khoản.
- **Ban quản lý:** tổng quan, tầng và phòng, phân giường, sinh viên, duyệt hồ sơ, điện nước và lập hóa đơn, hợp đồng, đối soát thu phí, điều phối bảo trì, nội quy và vi phạm, thông báo, phản ánh và liên hệ, phân quyền, báo cáo.
- **Nội quy & vi phạm:** danh mục nội quy có mức độ, điểm trừ và tiền phạt; ghi nhận và xử lý vi phạm (tự tạo hóa đơn phạt); sinh viên khiếu nại; điểm nề nếp 100 điểm/năm học với 4 mức xếp loại; đăng ký khách thăm, về muộn, vắng qua đêm và ghi nhận khách ra vào; báo cáo nề nếp.

## Tài khoản dùng thử

| Vai trò | Tài khoản | Mật khẩu |
|---|---|---|
| Sinh viên | `SV260001` | `12345678` |
| Ban quản lý | `admin` | `admin123` |

## Cấu trúc thư mục

| Thư mục | Nội dung |
|---|---|
| `ktx-website/` | Mã nguồn để chỉnh sửa: `index.html`, `css/styles.css`, `js/*.js` (`rules.js` là module nội quy & vi phạm), `assets/` (hình minh họa cắt từ ảnh thiết kế) |
| `ktx-dist/` | Bản đóng gói để đăng web, chữ tiếng Việt trong JS được mã hóa `\uXXXX` nên hiển thị đúng trên mọi máy chủ |
| `tools/build.py` | Tạo lại `ktx-website/mo-tren-may.html` và thư mục `ktx-dist/` từ mã nguồn |
| `tools/crop.py` | Script đã dùng để cắt hình minh họa từ 35 ảnh thiết kế |
| `*.png` (thư mục gốc) | 35 ảnh thiết kế gốc |

## Chạy trên máy

Mở `ktx-website/mo-tren-may.html` bằng Chrome, hoặc chạy máy chủ tĩnh:

```bash
python -m http.server 8765 --directory ktx-dist
```

rồi vào `http://localhost:8765`.

Sau khi sửa mã nguồn, đóng gói lại:

```bash
python tools/build.py ktx-website
```

## Lưu ý

Dữ liệu là dữ liệu mẫu, lưu trong `localStorage` của từng trình duyệt; chưa có máy chủ hay cơ sở dữ liệu dùng chung. Mục "Khôi phục dữ liệu mẫu" trong menu của Ban quản lý đưa hệ thống về trạng thái ban đầu.
