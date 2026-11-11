"""Tách ảnh đầu trang chủ (v13) từ ảnh thiết kế đã phóng to 4x bằng Real-ESRGAN.

Cách dùng:
    python tools/upscale_esrgan.py real_esrgan_x4plus.onnx "Đầu trang chủ mới.webp" ref_x4.png
    python tools/hero_home.py ref_x4.png ktx-website/assets/home

Toạ độ trong file này tính theo ảnh thiết kế gốc 1774 x 887 px (nhân 4 khi cắt).
Mọi lớp được tách khỏi nền trắng bằng "color to alpha" (ghép lại trên nền trắng cho
đúng từng điểm ảnh gốc) cộng với mặt nạ hình học cho khung ảnh và ảnh tòa nhà, nên
cũng hiển thị đúng trên nền tối.
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

Image.MAX_IMAGE_PIXELS = None
S = 4                       # hệ số phóng to của ảnh nguồn
HERO_TOP, HERO_BOT = 96, 782  # dải ảnh đầu trang (dưới thanh tiêu đề, trên dải số liệu)

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
big = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
assert big.shape[1] == 1774 * S, big.shape


def c2a(rgb):
    """Alpha nhỏ nhất để ghép trên nền trắng ra đúng màu gốc."""
    return np.clip((255.0 - rgb.min(axis=2)) / 255.0, 0, 1)


def uncomposite(rgb, a):
    a3 = np.maximum(a, 1e-4)[..., None]
    return np.clip((rgb - (1 - a3) * 255.0) / a3, 0, 255)


def save_rgba(rgb, a, path, widths, quality=92):
    im = Image.fromarray(np.dstack([rgb, a * 255.0]).round().clip(0, 255).astype(np.uint8), 'RGBA')
    for w, suffix in widths:
        h = round(im.height * w / im.width)
        r = im if w == im.width else im.resize((w, h), Image.LANCZOS)
        p = path.format(suffix)
        r.save(p, 'WEBP', quality=quality, alpha_quality=100, method=6, exact=False)
        print(os.path.basename(p), r.size, os.path.getsize(p) // 1024, 'KB')


def crop_c2a(box, pad=2):
    x0, y0, x1, y1 = box
    sub = big[(y0 - pad) * S:(y1 + pad) * S, (x0 - pad) * S:(x1 + pad) * S]
    a = c2a(sub)
    a[a < 0.03] = 0
    return uncomposite(sub, a), a


# ---------------------------------------------------------------- ảnh đầu trang
hero = big[HERO_TOP * S:HERO_BOT * S].copy()
H, W = hero.shape[:2]
Y = (np.arange(H, dtype=np.float32) + 0.5) / S + HERO_TOP   # toạ độ y theo ảnh gốc
X = (np.arange(W, dtype=np.float32) + 0.5) / S


def rect(x0, y0, x1, y1):
    m = np.zeros((H, W), bool)
    m[max(0, int((y0 - HERO_TOP) * S)):int((y1 - HERO_TOP) * S), int(x0 * S):int(x1 * S)] = True
    return m


# 1) Xoá chữ, nét vàng và nút ở cột trái (dựng lại bằng HTML/CSS)
white = rect(38, 150, 500, 200) | rect(30, 204, 545, 330) | rect(26, 318, 650, 440) | rect(276, 410, 614, 474)
hero[white] = 255.0
# hai nút đè lên mép trời của ảnh tòa nhà: nội suy theo cột giữa hàng trên và hàng dưới
for bx0, bx1 in ((31, 353), (362, 606)):
    r0, r1 = int((487 - HERO_TOP) * S), int((550 - HERO_TOP) * S)
    c0, c1 = int(bx0 * S), int(bx1 * S)
    top, bot = hero[r0 - 1, c0:c1], hero[r1, c0:c1]
    t = ((np.arange(r1 - r0) + 0.5) / (r1 - r0))[:, None, None]
    hero[r0:r1, c0:c1] = top[None] * (1 - t) + bot[None] * t

# 2) Mặt nạ khung ảnh lớn: hình bình hành bo góc (đo trên ảnh 4x)
SLOPE = 0.375                      # mép trái: x = XL - SLOPE * y
XL = 818.875
TOPY, BOTY = 137.0, 746.5
R_TL, R_BL = 82.0, 20.5
ang = math.atan2(1, -SLOPE)        # hướng mép trái đi xuống


def corner(vx, vy, d1, d2, r, n=48):
    """Cung bo góc tại đỉnh (vx,vy) giữa hai cạnh có hướng d1 (đi vào) và d2 (đi ra)."""
    d1 = np.array(d1, float) / np.hypot(*d1)
    d2 = np.array(d2, float) / np.hypot(*d2)
    theta = math.acos(np.clip(np.dot(-d1, d2), -1, 1))
    tl = r / math.tan(theta / 2)
    p1 = np.array([vx, vy]) - d1 * tl
    p2 = np.array([vx, vy]) + d2 * tl
    bis = (-d1 + d2) / np.linalg.norm(-d1 + d2)
    c = np.array([vx, vy]) + bis * (r / math.sin(theta / 2))
    a1 = math.atan2(*(p1 - c)[::-1])
    a2 = math.atan2(*(p2 - c)[::-1])
    da = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
    return [tuple(c + r * np.array([math.cos(a1 + da * k / n), math.sin(a1 + da * k / n)])) for k in range(n + 1)]


down = (-SLOPE, 1.0)
pts = [(1800, TOPY)]
pts += corner(XL - SLOPE * TOPY, TOPY, (-1, 0), down, R_TL)
pts += corner(XL - SLOPE * BOTY, BOTY, down, (1, 0), R_BL)
pts += [(1800, BOTY)]
SS = 2
mimg = Image.new('L', (W * SS, H * SS), 0)
ImageDraw.Draw(mimg).polygon([(x * S * SS, (y - HERO_TOP) * S * SS) for x, y in pts], fill=255)
M = np.asarray(mimg.resize((W, H), Image.BOX), np.float32) / 255.0

# 3) Ảnh tòa nhà góc dưới trái: hiện dần từ mép trời xuống
tb = np.clip((Y - 505.0) / 85.0, 0, 1)
MB = (tb * tb * (3 - 2 * tb))[:, None] * np.ones((1, W), np.float32)

a = np.maximum(np.maximum(M, MB), c2a(hero))
a[(a < 0.04) & (M == 0) & (MB == 0)] = 0
rgb = uncomposite(hero, a)
save_rgba(rgb, a, os.path.join(out, 'hero{}.webp'), [(W, '-4x'), (W // 2, '-2x'), (W // 4, '-1x')])

# ảnh khung bên phải cho màn hình hẹp (bỏ cột chữ và tòa nhà)
xm = 548
save_rgba(rgb[:, xm * S:], a[:, xm * S:], os.path.join(out, 'hero-art{}.webp'),
          [((W - xm * S) // 2, '-2x'), ((W - xm * S) // 4, '-1x')])

# ---------------------------------------------------------------- chi tiết đồ hoạ
for name, box in {
    'gold-line': (46, 175, 105, 181),
    'swoosh': (286, 419, 604, 462),
    'logo': (44, 12, 175, 92),
}.items():
    c, al = crop_c2a(box)
    im = Image.fromarray(np.dstack([c, al * 255]).round().clip(0, 255).astype(np.uint8), 'RGBA')
    im.save(os.path.join(out, name + '.png'), optimize=True)
    print(name, im.size)

# biểu tượng dải số liệu: chỉ giữ alpha (tô màu bằng CSS mask)
for name, box in {
    'ic-building': (71, 806, 129, 857),
    'ic-bed': (421, 817, 478, 853),
    'ic-users': (762, 811, 821, 850),
    'ic-bed-check': (1123, 806, 1186, 856),
    'ic-database': (1498, 809, 1541, 859),
    'ic-user': (395, 504, 421, 531),
}.items():
    _, al = crop_c2a(box)
    al = np.clip((al - 0.06) / 0.8, 0, 1)
    im = Image.fromarray(np.dstack([np.zeros_like(al)] * 3 + [al * 255]).round().astype(np.uint8), 'RGBA')
    im.save(os.path.join(out, name + '.png'), optimize=True)
    print(name, im.size)

# biểu tượng trắng trên nút đỏ: alpha theo kênh xanh lá (nền đỏ G≈1, nét trắng G≈255)
for name, box in {'ic-btn-bed': (58, 509, 90, 529), 'ic-btn-arrow': (310, 512, 327, 525)}.items():
    x0, y0, x1, y1 = box
    sub = big[(y0 - 2) * S:(y1 + 2) * S, (x0 - 2) * S:(x1 + 2) * S]
    al = np.clip((sub[..., 1] - 12) / 225.0, 0, 1)
    im = Image.fromarray(np.dstack([np.zeros_like(al)] * 3 + [al * 255]).round().astype(np.uint8), 'RGBA')
    im.save(os.path.join(out, name + '.png'), optimize=True)
    print(name, im.size)
