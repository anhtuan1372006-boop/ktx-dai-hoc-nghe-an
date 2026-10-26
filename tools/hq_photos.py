"""Đưa bộ ảnh chất lượng cao (anh-ky-tuc-xa-chat-luong-cao.zip) vào trang chủ khách, thay các ảnh cắt từ ảnh thiết kế.

    python tools/hq_photos.py anh-ky-tuc-xa-chat-luong-cao.zip ktx-website/assets

- Ảnh sự kiện gốc (01–04, nguồn website NAU): chép nguyên byte cho thẻ sự kiện; cắt khung 2:1 cho mục "Khoảnh khắc sinh viên".
- Minh họa dựng lại (05–06): lưu JPEG cho mục "Học tập, nghỉ ngơi và kết nối" và "Sẵn sàng ngày nhập học".
Chạy sau tools/crop_home.py (script đó tạo bản cắt mờ từ ảnh thiết kế).
"""
import io
import os
import sys
import zipfile

from PIL import Image

# tên tệp đích: (tệp nguồn trong zip, khung cắt (x0, y0, x1, y1) hoặc None = giữ nguyên byte, chiều rộng tối đa)
PLAN = {
    'ev_fair': ('01-hoi-cho-sinh-vien-goc.jpg', None, None),
    'ev_volley': ('02-tran-bong-chuyen-goc.jpg', None, None),
    'ev_opening': ('04-le-khai-giang-goc.jpg', None, None),
    'mo_booth': ('01-hoi-cho-sinh-vien-goc.jpg', (0, 110, 1280, 750), None),
    'mo_court': ('02-tran-bong-chuyen-goc.jpg', (0, 120, 1430, 835), None),
    'mo_sport': ('03-doi-bong-chuyen-goc.jpg', (0, 40, 1429, 755), None),
    'h_guitar': ('05-nhom-sinh-vien-minh-hoa-dung-lai.png', None, 1400),
    'h_ready': ('06-nam-sinh-vien-minh-hoa-dung-lai.png', (0, 180, 941, 1000), None),
}

if __name__ == '__main__':
    zpath, out = sys.argv[1], sys.argv[2]
    z = zipfile.ZipFile(zpath)
    for name, (src, box, maxw) in PLAN.items():
        raw = z.read(src)
        dst = os.path.join(out, name + '.jpg')
        if box is None and maxw is None and src.endswith('.jpg'):
            open(dst, 'wb').write(raw)
        else:
            im = Image.open(io.BytesIO(raw)).convert('RGB')
            if box:
                im = im.crop(box)
            if maxw and im.width > maxw:
                im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
            im.save(dst, quality=90, optimize=True, progressive=True)
        w, h = Image.open(dst).size
        print(f'{name}.jpg  {w}x{h}  {os.path.getsize(dst) // 1024} KB  <- {src}')
