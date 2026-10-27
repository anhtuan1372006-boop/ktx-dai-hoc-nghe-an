# Ký túc xá Đại học Nghệ An

Website quản lý ký túc xá cho một tòa nhà 4 tầng, gồm 35 màn hình dựng theo bộ ảnh thiết kế trong thư mục gốc.

**Xem trực tuyến:** https://anhtuan1372006-boop.github.io/ktx-dai-hoc-nghe-an/

Trang được phục vụ từ nhánh `gh-pages`, chứa nội dung thư mục `ktx-dist/` (với `mo-tren-may.html` đổi tên thành `index.html` và thêm file `.nojekyll`).

- **Trang công khai (giao diện khách):** trang chủ mới theo ảnh `BỔ SUNG CHỨC NĂNG/Giao diện khách - trang chủ.webp` (loại phòng, phòng sẵn sàng, đời sống KTX, album khoảnh khắc, câu hỏi thường gặp), tiện ích, sự kiện (sinh viên đăng ký tham gia), hướng dẫn & hỏi đáp (gửi câu hỏi cho Ban quản lý), tra cứu hồ sơ không cần đăng nhập, tìm phòng, chi tiết phòng và chọn giường, đăng nhập, đăng ký, quên mật khẩu.
- **Hiệu ứng động (`js/v6-motion.js`):** giữ nguyên ảnh, màu và bố cục; ảnh 3D/minh họa zoom chậm, bồng bềnh, có vệt sáng quét; banner và ảnh nền lớn có lớp hạt sáng lấp lánh, tia sáng xoay, vòng năng lượng, sao băng. Ảnh chụp người thật (nguồn website NAU) giữ nguyên, không gắn hiệu ứng. Hiệu ứng tạm dừng khi nằm ngoài màn hình.
- **Đồ họa v8 "Lụa ánh sáng & Kính lỏng" (`js/v8-fx.js`, `css/v8-fx.css`):** nền shader WebGL dạng lụa chảy, uốn theo chuột và tốc độ cuộn, có gợn sóng khi đổi giao diện; thẻ kính có viền sáng theo đèn chiếu con trỏ; chuyển trang bằng View Transitions (trang cũ lùi sâu, trang mới tràn lên theo làn sóng, đầu trang và thanh bên đứng yên); khi cuộn, tiêu đề trồi theo từng từ, khối nổi lên so le, ảnh mở màn và thị sai. Chạy 60 khung/giây, tự hạ tải khi máy yếu.
- **Giao diện tối có nền động "Đêm sao" theo video mẫu (`js/v9-night.js`)**: mọi khung, thẻ, bảng trong suốt để thấy nền; khung ảnh đầu trang chủ, khung "Sẵn sàng cho hành trình mới?", ảnh chào mừng và ảnh đăng nhập giữ nguyên. **Giao diện sáng giữ nguyên giao diện gốc** (không nền động, không kính trong suốt). bầu trời sao và Ngân Hà, mưa sao băng, sao chổi, pháo hoa trái tim, thiên hà xoắn ốc, trăng lưỡi liềm treo tim, nhân vật neon, sao chổi cầu vồng; phong cảnh đêm có núi, vách đá, đình đèn lồng, cối xay nước, hồ sen, đồng hoa, cây hoa phát sáng, hươu neon, đom đóm. Vẽ bằng canvas theo độ phân giải màn hình (tới 3840×2160), kịch bản lặp 36 giây.
- **Chế độ Nâng cấp (Ultra) dùng đúng video tham chiếu (`js/v10-ultra.js`, `css/ultra-video.css`)**: video nền lặp, tắt tiếng, chỉ tải và phát khi bật Ultra; dừng khi ẩn tab, giải phóng bộ giải mã khi tắt Ultra. Giữ nguyên cảnh và thời gian chuyển cảnh, không vẽ lại bằng canvas. Các khung kính trung tính có độ trong cao, làm mờ nhẹ 3px để nhìn rõ chi tiết video; banner trang chủ cũng để lộ video nền. Giao diện sáng/tối ngoài Ultra giữ nguyên. Tôn trọng thiết lập giảm chuyển động bằng ảnh tĩnh từ chính video.
  - Video gốc: **576×1024, 30 fps, khoảng 11,13 giây**, khổ dọc; lưu nguyên bản tại `assets/ultra/reference.mp4`.
  - Bản phát: **2160×3840 (UHD dọc)**, H.264, nâng độ phân giải Lanczos từ video gốc; đây **không phải nguồn quay 4K**, không tạo thêm chi tiết gốc. `object-fit: cover` giữ tỷ lệ, cắt phần dư trên màn hình ngang, không kéo méo cảnh.
  - Tạo lại video và poster: `python tools/prepare_ultra_video.py "đường-dẫn-video.mp4"` (cần FFmpeg hoặc `python -m pip install imageio-ffmpeg`), sau đó `python tools/build.py ktx-website`.
- **Nút ở góc dưới bên phải:** *Giao diện tối* và *Nâng cấp* (Ultra: video nền tham chiếu và kính trong suốt), chuyển bằng vòng sáng lan từ nút. Lựa chọn được lưu trong trình duyệt.
- **Giao diện tối (`css/dark.css`):** sinh tự động từ `styles.css` bằng `python tools/gen_dark.py ktx-website` (chạy lại sau khi sửa `styles.css`).
- **Hoàn thiện cho chạy thật (`js/v11-polish.js`, `css/v11.css`):** nút Quay lại / Tiến tới của trình duyệt hoạt động và nhớ vị trí cuộn; trang 404 cho đường dẫn sai; nút In / Tải thỏa thuận và hóa đơn mở hộp thoại in (lưu PDF) với tiêu đề ký túc xá; biểu tượng tab, thẻ mô tả khi chia sẻ liên kết; báo mất mạng; phím `/` để tìm kiếm; liên kết bỏ qua tới nội dung và viền tiêu điểm cho bàn phím; bố cục khổ máy tính bảng / laptop nhỏ (768–1400px) không còn tràn.
- **Hiệu ứng 3D theo phong cách giao diện:** thẻ nghiêng theo con trỏ có vệt sáng và các lớp nổi khối, ảnh trong thẻ phóng nhẹ, gợn sóng khi bấm, số mục lật như đồng xu, biểu tượng lật khi cuộn tới, khối nội dung nổi lên kèm nghiêng, chữ đầu trang nghiêng theo chuột, hộp thoại / menu / thông báo mở theo chiều sâu. Tắt khi máy bật giảm chuyển động.
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
| `tools/gen_dark.py` | Sinh `css/dark.css` (giao diện tối) từ `css/styles.css` |
| `tools/crop.py`, `tools/crop_v4.py`, `tools/crop_home.py` | Script cắt hình minh họa từ 35 ảnh thiết kế, 17 ảnh bổ sung và ảnh trang chủ khách |
| `tools/hq_photos.py`, `anh-ky-tuc-xa-chat-luong-cao.zip` | Thay ảnh sự kiện, khoảnh khắc sinh viên và 2 minh họa trên trang chủ bằng bộ ảnh chất lượng cao (ảnh gốc NAU giữ nguyên byte) |
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
