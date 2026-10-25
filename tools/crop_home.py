"""Cắt hình từ thiết kế trang chủ khách (ảnh 793px, phóng 2x để hiển thị rõ hơn).
Cách dùng: python tools/crop_home.py"""
import os
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'BỔ SUNG CHỨC NĂNG', 'Giao diện khách - trang chủ.webp')
OUT = os.path.join(ROOT, 'ktx-website', 'assets')
C = {
    'h_room4': (32, 443, 267, 565), 'h_room6': (285, 443, 510, 565), 'h_common': (525, 443, 763, 565),
    'h_ready': (585, 668, 793, 842),
    'ev_fair': (25, 890, 271, 1040), 'ev_volley': (284, 890, 511, 1035), 'ev_opening': (524, 890, 770, 1040),
    'h_guitar': (470, 1132, 793, 1316),
    'mo_sport': (31, 1370, 266, 1480), 'mo_booth': (279, 1370, 510, 1480), 'mo_court': (522, 1370, 765, 1480),
    'h_girl': (0, 1521, 285, 1696), 'h_cta': (372, 1703, 793, 1840), 'h_foot': (530, 1843, 793, 1951),
}
im = Image.open(SRC).convert('RGB')
for name, box in C.items():
    c = im.crop(box)
    c = c.resize((c.width * 2, c.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    c.save(os.path.join(OUT, name + '.jpg'), quality=88, optimize=True)
print('done', len(C))
