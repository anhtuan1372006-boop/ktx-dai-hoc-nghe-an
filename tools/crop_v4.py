"""Cắt hình minh họa từ 17 ảnh thiết kế bổ sung (thư mục 'BỔ SUNG CHỨC NĂNG').
Cách dùng: python tools/crop_v4.py"""
import os, glob, re
import cv2, numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'BỔ SUNG CHỨC NĂNG')
OUT = os.path.join(ROOT, 'ktx-website', 'assets')

files = {}
for f in glob.glob(os.path.join(SRC, '*.png')):
    m = re.search(r'-(\d+)\.png$', f)
    if m:
        files[int(m.group(1))] = f

# tên: (ảnh số, (x0, y0, x1, y1), [vùng xóa chữ x0,y0,x1,y1])
C = {
    'bn_vipham': (1, (958, 72, 1536, 192), []),
    'bn_dien': (2, (880, 72, 1536, 202), []),
    'meter_e': (3, (982, 652, 1215, 770), []),
    'meter_w': (3, (1243, 652, 1490, 770), []),
    'group4': (3, (266, 628, 580, 848), []),
    'ev_bike': (4, (271, 791, 461, 914), [(432, 794, 458, 820)]),
    'bn_phanbo': (5, (895, 72, 1536, 190), []),
    'bn_giaitrinh': (6, (760, 72, 1536, 205), []),
    'art_writing': (6, (1290, 664, 1518, 980), []),
    'bn_chuyen': (7, (880, 72, 1536, 198), []),
    'room_b204_big': (7, (273, 532, 655, 780), []),
    'cp_cur': (8, (562, 552, 822, 678), []),
    'cp_new': (8, (885, 552, 1153, 678), []),
    'bn_bangiao': (9, (1000, 72, 1536, 184), []),
    'bg_old': (9, (258, 258, 824, 404), [(268, 356, 484, 394)]),
    'bg_new': (9, (912, 258, 1501, 407), [(920, 361, 1140, 399)]),
    'bg_thumb': (9, (259, 722, 427, 803), []),
    'bn_traphong': (10, (880, 72, 1536, 190), []),
    'art_suitcase': (10, (1062, 780, 1502, 915), []),
    'bn_giahan': (11, (900, 72, 1536, 212), []),
    'gh_room': (11, (263, 315, 495, 455), []),
    'bn_tamvang': (13, (800, 72, 1528, 212), []),
    'side_art5': (13, (0, 690, 222, 880), []),
}


def wipe(img, boxes, ox, oy):
    a = np.array(img)[:, :, ::-1].copy()
    mask = np.zeros(a.shape[:2], np.uint8)
    for x0, y0, x1, y1 in boxes:
        mask[max(0, y0 - oy):y1 - oy, max(0, x0 - ox):x1 - ox] = 255
    return Image.fromarray(cv2.inpaint(a, mask, 9, cv2.INPAINT_TELEA)[:, :, ::-1])


for name, (n, box, boxes) in C.items():
    im = Image.open(files[n]).convert('RGB').crop(box)
    if boxes:
        im = wipe(im, boxes, box[0], box[1])
    im.save(os.path.join(OUT, name + '.jpg'), quality=86, optimize=True)
print('done', len(C))
