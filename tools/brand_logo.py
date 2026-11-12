"""Tách logo NAU (ảnh nền trắng) thành các file nền trong suốt dùng trên web.

    python tools/brand_logo.py "Logo NAU.png" ktx-website/assets
"""
import os
import sys

import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(out, 'brand'), exist_ok=True)
rgb = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)


def c2a(a_rgb):
    al = np.clip((255.0 - a_rgb.min(axis=2)) / 255.0, 0, 1)
    al[al < 0.02] = 0
    a3 = np.maximum(al, 1e-4)[..., None]
    col = np.clip((a_rgb - (1 - a3) * 255.0) / a3, 0, 255)
    return np.dstack([col, al * 255]).round().astype(np.uint8)


full = c2a(rgb)
ys, xs = np.where(full[..., 3] > 8)
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
# dòng chữ nằm bên phải, phía dưới chữ NAU: x >= 500, y >= 750
mark = full.copy()
mark[750:, 500:, 3] = 0
my = np.where(mark[..., 3] > 8)[0].max() + 1


def save(arr, box, name, pad=6):
    bx0, by0, bx1, by1 = box
    im = Image.fromarray(arr[by0 - pad:by1 + pad, bx0 - pad:bx1 + pad], 'RGBA')
    im.save(os.path.join(out, 'brand', name), optimize=True)
    print(name, im.size)
    return im


save(full, (x0, y0, x1, y1), 'nau-logo.png')
m = save(mark, (x0, y0, x1, my), 'nau-mark.png')

# biểu tượng tab: logo trên nền trắng bo góc
def icon(size, name, pad_ratio=0.1):
    can = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    w = int(size * (1 - 2 * pad_ratio))
    h = round(m.height * w / m.width)
    can.alpha_composite(m.resize((w, h), Image.LANCZOS), ((size - w) // 2, (size - h) // 2))
    can.convert('RGB').save(os.path.join(out, name), optimize=True)
    print(name, can.size)


icon(64, 'favicon.png', 0.04)
icon(180, 'apple-touch-icon.png', 0.1)
icon(512, 'brand/icon-512.png', 0.1)

# bản cho nền tối: làm sáng phần xanh để đủ tương phản
arr = np.asarray(m).astype(np.float32)
r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
blue = (b > r + 30)[..., None]
light = arr.copy()
light[..., :3] = np.where(blue, arr[..., :3] * 0.45 + np.array([150, 190, 255]) * 0.55, np.minimum(arr[..., :3] * 1.12 + 12, 255))
Image.fromarray(light.round().clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(out, 'brand', 'nau-mark-light.png'), optimize=True)
print('nau-mark-light.png', m.size)
