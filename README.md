# Ký túc xá Đại học Nghệ An

Website quản lý ký túc xá cho một tòa nhà 4 tầng, gồm 35 màn hình dựng theo bộ ảnh thiết kế trong thư mục gốc.

**Xem trực tuyến:** https://anhtuan1372006-boop.github.io/ktx-dai-hoc-nghe-an/

Trang được phục vụ từ nhánh `gh-pages`, chứa nội dung thư mục `ktx-dist/` (với `mo-tren-may.html` đổi tên thành `index.html` và thêm file `.nojekyll`).

- **Trang công khai:** trang chủ, tìm phòng, chi tiết phòng và chọn giường, đăng nhập, đăng ký, quên mật khẩu.
- **Cổng sinh viên:** tổng quan, đăng ký lưu trú, phòng của tôi, hồ sơ và thỏa thuận, hóa đơn, thanh toán, báo sửa chữa, gia hạn, chuyển phòng, trả phòng, hỗ trợ, thông báo, tài khoản.
- **Ban quản lý:** tổng quan, tầng và phòng, phân giường, sinh viên, duyệt hồ sơ, điện nước và lập hóa đơn, hợp đồng, đối soát thu phí, điều phối bảo trì, nội quy và vi phạm, thông báo, phản ánh và liên hệ, phân quyền, báo cáo.
- **Chức năng bổ sung (17 ảnh trong `BỔ SUNG CHỨC NĂNG/`):**
  - Nội quy & vi phạm: lập biên bản ghi nhận, xác minh, yêu cầu giải trình, kết luận (trừ điểm nề nếp, tự tạo hóa đơn phạt), sinh viên gửi giải trình và đề nghị xem lại.
  - Điện nước: ghi chỉ số theo tầng kèm ảnh đồng hồ, kiểm tra bất thường, chốt chỉ số, phân bổ phí (chia đều / theo ngày ở), phát hành hóa đơn; sinh viên xem điện nước phòng và yêu cầu kiểm tra chỉ số.
  - Chuyển phòng: sinh viên chọn giường trên sơ đồ, Ban quản lý xét duyệt (giữ chỗ giường đích), bàn giao hai phía, sinh viên xác nhận nhận phòng.
  - Cư trú: đăng ký và theo dõi tạm vắng; trả phòng & đối soát tiền cọc; gia hạn lưu trú.

## Tài khoản dùng thử

| Vai trò | Tài khoản | Mật khẩu |
|---|---|---|
| Sinh viên | `SV260001` | `12345678` |
| Ban quản lý | `admin` | `admin123` |

## Cấu trúc thư mục

| Thư mục | Nội dung |
|---|---|
| `ktx-website/` | Mã nguồn để chỉnh sửa: `index.html`, `css/styles.css`, `js/*.js` (`v4-core.js`, `v4-dien.js`, `v4-luutru.js` là các chức năng bổ sung), `assets/` (hình minh họa cắt từ ảnh thiết kế) |
| `ktx-dist/` | Bản đóng gói để đăng web, chữ tiếng Việt trong JS được mã hóa `\uXXXX` nên hiển thị đúng trên mọi máy chủ |
| `tools/build.py` | Tạo lại `ktx-website/mo-tren-may.html` và thư mục `ktx-dist/` từ mã nguồn |
| `tools/crop.py`, `tools/crop_v4.py` | Script cắt hình minh họa từ 35 ảnh thiết kế và 17 ảnh bổ sung |
| `*.png` (thư mục gốc), `BỔ SUNG CHỨC NĂNG/` | 35 ảnh thiết kế gốc và 17 ảnh chức năng bổ sung |

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
