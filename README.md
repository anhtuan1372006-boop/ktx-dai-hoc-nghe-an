# Ký túc xá Đại học Nghệ An

Website quản lý ký túc xá cho một tòa nhà 4 tầng, gồm 35 màn hình dựng theo bộ ảnh thiết kế trong thư mục gốc.

**Xem trực tuyến:** https://anhtuan1372006-boop.github.io/ktx-dai-hoc-nghe-an/

Trang được phục vụ từ nhánh `gh-pages`, chứa nội dung thư mục `ktx-dist/` (với `mo-tren-may.html` đổi tên thành `index.html` và thêm file `.nojekyll`).

- **Trang công khai (giao diện khách):** trang chủ mới theo ảnh `BỔ SUNG CHỨC NĂNG/Giao diện khách - trang chủ.webp` (loại phòng, phòng sẵn sàng, đời sống KTX, album khoảnh khắc, câu hỏi thường gặp), tiện ích, sự kiện (sinh viên đăng ký tham gia), hướng dẫn & hỏi đáp (gửi câu hỏi cho Ban quản lý), tra cứu hồ sơ không cần đăng nhập, tìm phòng, chi tiết phòng và chọn giường, đăng nhập, đăng ký, quên mật khẩu.
- **Hiển thị trên điện thoại:** toàn bộ trang khách, sinh viên và Ban quản lý đã được soát ở khổ 390px (bảng cuộn ngang, thanh tab cuộn, bố cục nhiều cột chuyển thành một cột).
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
| `ktx-website/` | Mã nguồn để chỉnh sửa: `index.html`, `css/styles.css`, `js/*.js` (`v4-core.js`, `v4-dien.js`, `v4-luutru.js` là các chức năng bổ sung, `v5-khach.js` là giao diện khách), `assets/` (hình minh họa cắt từ ảnh thiết kế) |
| `ktx-dist/` | Bản đóng gói để đăng web, chữ tiếng Việt trong JS được mã hóa `\uXXXX` nên hiển thị đúng trên mọi máy chủ |
| `tools/build.py` | Tạo lại `ktx-website/mo-tren-may.html` và thư mục `ktx-dist/` từ mã nguồn |
| `tools/crop.py`, `tools/crop_v4.py`, `tools/crop_home.py` | Script cắt hình minh họa từ 35 ảnh thiết kế, 17 ảnh bổ sung và ảnh trang chủ khách |
| `*.png` (thư mục gốc), `BỔ SUNG CHỨC NĂNG/` | 35 ảnh thiết kế gốc và 17 ảnh chức năng bổ sung |

## Minh họa động và độ sắc nét

Giao diện có 156 minh họa SVG động do mã nguồn tạo: tòa nhà, phòng ở, vật dụng, biểu tượng và nhân vật minh họa. Các nhóm đồ họa chuyển động độc lập với ánh sáng, quỹ đạo và hạt sáng; ảnh vector giữ nét khi phóng lớn. Đây là minh họa, không phải ảnh hiện trạng phòng ở. Ảnh chụp, logo và mã QR vẫn dùng tệp gốc.

Nút **Hiệu ứng** ở góc dưới cho phép tạm dừng/bật chuyển động. Trang tự giảm chuyển động theo cài đặt `prefers-reduced-motion`; canvas dừng khi ra ngoài màn hình hoặc tab bị ẩn. Không cần thêm thư viện đồ họa để chạy website.

Tạo lại bộ minh họa trước khi đóng gói nếu sửa trình tạo:

```bash
python tools/generate_motion_assets.py
python tools/build.py ktx-website
```

Danh sách tài nguyên và SHA-256 của các ảnh gốc được giữ trong `ktx-website/assets/motion/manifest.json`.

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
