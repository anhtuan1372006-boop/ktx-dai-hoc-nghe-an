"""Làm nét 6 ảnh chụp thật (nguồn: website Trường Đại học Nghệ An) cắt từ ảnh thiết kế trang chủ khách.

Chạy sau tools/crop_home.py (đọc ảnh đã cắt, ghi đè bản nét hơn với kích thước gấp đôi):
    python tools/sharpen_nau.py ktx-website/assets [--model real_esrgan_general_x4v3.onnx]

- Có --model (Real-ESRGAN General x4v3, bản ONNX của Qualcomm AI Hub, cần `pip install onnxruntime`):
  phóng 4x bằng mô hình theo từng ô 128x128 chồng lấn, thu về 2x, rồi trộn 45% với bản làm nét thường
  (ảnh gốc đã nhòe mặt nên dùng 100% AI sẽ làm méo khuôn mặt).
- Không có --model: khử nhiễu khối JPEG -> phóng 2x (Lanczos) -> làm sắc biên trên kênh độ sáng.
Màu sắc và bố cục ảnh giữ nguyên.
"""
import os
import sys

import cv2
import numpy as np

PHOTOS = ['ev_fair', 'ev_volley', 'ev_opening', 'mo_sport', 'mo_booth', 'mo_court']
TILE, PAD = 128, 16
MIX = 0.45  # tỉ lệ bản AI khi trộn


def sharpen_classic(img):
    img = cv2.fastNlMeansDenoisingColored(img, None, 3, 3, 7, 21)
    up = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_LANCZOS4)
    lab = cv2.cvtColor(up, cv2.COLOR_BGR2LAB)
    L, a, b = cv2.split(lab)
    Lf = L.astype(np.float32)
    coarse = cv2.GaussianBlur(Lf, (0, 0), 2.0)
    Lf = cv2.addWeighted(Lf, 1.45, coarse, -0.45, 0)
    fine = cv2.GaussianBlur(Lf, (0, 0), 0.8)
    Lf = cv2.addWeighted(Lf, 1.4, fine, -0.4, 0)
    L2 = np.clip(Lf, 0, 255).astype(np.uint8)
    clahe = cv2.createCLAHE(clipLimit=1.6, tileGridSize=(8, 8)).apply(L2)
    L3 = cv2.addWeighted(L2, 0.7, clahe, 0.3, 0)
    return cv2.cvtColor(cv2.merge([L3, a, b]), cv2.COLOR_LAB2BGR)


def sharpen_esrgan(img, sess):
    """Phóng 4x theo ô: mỗi ô lấy thêm viền PAD px để tránh đường nối, chỉ giữ phần lõi."""
    h, w = img.shape[:2]
    core = TILE - 2 * PAD
    ny, nx = -(-h // core), -(-w // core)
    src = cv2.copyMakeBorder(img, PAD, ny * core - h + PAD, PAD, nx * core - w + PAD, cv2.BORDER_REFLECT_101)
    rgb = cv2.cvtColor(src, cv2.COLOR_BGR2RGB).astype(np.float32) / 255
    out = np.zeros((ny * core * 4, nx * core * 4, 3), np.float32)
    name = sess.get_inputs()[0].name
    for ty in range(ny):
        for tx in range(nx):
            y, x = ty * core, tx * core
            t = rgb[y:y + TILE, x:x + TILE].transpose(2, 0, 1)[None]
            r = sess.run(None, {name: t})[0][0].transpose(1, 2, 0)
            out[y * 4:(y + core) * 4, x * 4:(x + core) * 4] = r[PAD * 4:(PAD + core) * 4, PAD * 4:(PAD + core) * 4]
    out = np.clip(out[:h * 4, :w * 4] * 255, 0, 255).astype(np.uint8)
    big = cv2.cvtColor(out, cv2.COLOR_RGB2BGR)
    return cv2.resize(big, (w * 2, h * 2), interpolation=cv2.INTER_AREA)


if __name__ == '__main__':
    args = sys.argv[1:]
    model = None
    if '--model' in args:
        i = args.index('--model'); model = args[i + 1]; del args[i:i + 2]
    d = args[0] if args else 'ktx-website/assets'
    sess = None
    if model:
        import onnxruntime as ort
        sess = ort.InferenceSession(model)
    for n in PHOTOS:
        p = os.path.join(d, n + '.jpg')
        img = cv2.imdecode(np.fromfile(p, np.uint8), cv2.IMREAD_COLOR)
        out = sharpen_classic(img)
        if sess:  # trộn với bản AI: biên chữ, tòa nhà nét hơn nhưng không làm méo khuôn mặt vốn đã nhòe
            out = cv2.addWeighted(sharpen_esrgan(img, sess), MIX, out, 1 - MIX, 0)
        ok, buf = cv2.imencode('.jpg', out, [cv2.IMWRITE_JPEG_QUALITY, 93])
        buf.tofile(p)
        print(n, img.shape[1::-1], '->', out.shape[1::-1])
