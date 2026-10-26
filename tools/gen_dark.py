"""Sinh giao diện tối (css/dark.css) từ css/styles.css.

    python tools/gen_dark.py ktx-website

Mỗi khai báo có màu cố định được viết lại dưới html[data-theme="dark"]:
- nền sáng -> mặt tối ngả xanh navy (giữ sắc độ của nền màu nhạt như hồng, xanh, vàng)
- chữ tối -> chữ sáng; chữ có màu đậm (đỏ, xanh...) giữ sắc, chỉ sáng lên cho dễ đọc
- viền sáng -> viền tối; bóng đổ -> bóng đen sâu hơn
Biến màu trong :root được đặt tay trong css/v7-fx.css. Chạy lại sau mỗi lần sửa styles.css.
"""
import colorsys
import os
import re
import sys

PREFIX = 'html[data-theme="dark"]'
COLOR_RE = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\bwhite\b')
BG_PROPS = ('background', 'background-color', 'background-image')
LINE_PROPS = ('border', 'border-top', 'border-bottom', 'border-left', 'border-right', 'border-color',
              'border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color', 'outline', 'outline-color')
TEXT_PROPS = ('color', 'fill', 'stroke', 'caret-color', 'text-decoration-color')
SHADOW_PROPS = ('box-shadow',)


def parse(c):
    c = c.strip()
    if c == 'white':
        return 255, 255, 255, 1.0
    if c.startswith('#'):
        h = c[1:]
        if len(h) in (3, 4):
            h = ''.join(x * 2 for x in h)
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return r, g, b, a
    nums = re.findall(r'[\d.]+%?', c)
    if len(nums) < 3:
        return None
    v = [float(n[:-1]) * 2.55 if n.endswith('%') else float(n) for n in nums[:3]]
    a = 1.0
    if len(nums) > 3:
        a = float(nums[3][:-1]) / 100 if nums[3].endswith('%') else float(nums[3])
    return v[0], v[1], v[2], a


def fmt(r, g, b, a):
    r, g, b = (max(0, min(255, round(x))) for x in (r, g, b))
    return f'rgba({r},{g},{b},{a:.3g})' if a < 1 else f'#{r:02x}{g:02x}{b:02x}'


def hls(c):
    r, g, b, a = c
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    return h, l, s, a


def rgb(h, l, s, a):
    r, g, b = colorsys.hls_to_rgb(h % 1, max(0, min(1, l)), max(0, min(1, s)))
    return fmt(r * 255, g * 255, b * 255, a)


def map_bg(c):
    h, l, s, a = hls(c)
    if l <= 0.62:
        return None
    if s < 0.18:  # trắng, xám nhạt -> mặt navy
        return rgb(0.625, 0.10 + (1 - l) * 0.55, 0.42, a)
    return rgb(h, 0.11 + (1 - l) * 0.5, min(0.55, s * 0.62), a)


def map_line(c):
    h, l, s, a = hls(c)
    if l <= 0.6:
        return None
    return rgb(0.625 if s < 0.25 else h, 0.2 + (1 - l) * 0.35, 0.3 if s < 0.25 else min(0.5, s * 0.55), a)


def map_text(c):
    h, l, s, a = hls(c)
    if l < 0.3 or (l < 0.56 and s < 0.45):  # chữ trung tính, navy -> sáng
        return rgb(h, 0.95 - l * 0.55, min(s, 0.45) * 0.55, a)
    if s >= 0.45 and l < 0.62:  # chữ màu đậm -> giữ sắc, sáng hơn
        return rgb(h, 0.64, min(1, s * 1.05), a)
    return None


def map_shadow(c):
    r, g, b, a = c
    h, l, s, _ = hls(c)
    if a >= 1 or l >= 0.36:  # bóng màu (quầng đỏ, viền xanh khi focus) giữ nguyên
        return None
    return fmt(0, 0, 0, min(0.6, a * 3 + 0.08))


def transform(prop, val, sel=''):
    if 'var(' in val and not COLOR_RE.search(val):
        return None
    if prop in LINE_PROPS and re.search(r'#fff\b|#ffffff\b|\bwhite\b', val) and ('::' in sel or re.search(r'\b([2-9]|\d\.\d)px', val)):
        return None  # viền trắng dày / dấu tích: là nét vẽ trên nền màu, không phải đường kẻ
    if 'mx-' in sel or 'spark' in sel or (prop == 'background-image' and 'rgba(255' in val.replace(' ', '')):
        return None  # lớp hiệu ứng ánh sáng (vệt sáng, quầng) giữ nguyên
    if prop in BG_PROPS:
        fn = map_bg
    elif prop in LINE_PROPS:
        fn = map_line
    elif prop in TEXT_PROPS:
        fn = map_text
    elif prop in SHADOW_PROPS:
        fn = map_shadow
    else:
        return None
    changed = False

    def sub(m):
        nonlocal changed
        c = parse(m.group(0))
        if not c:
            return m.group(0)
        out = fn(c)
        if out is None:
            return m.group(0)
        changed = True
        return out
    new = COLOR_RE.sub(sub, val)
    return new if changed else None


def split_top(s, ch=','):
    out, depth, cur = [], 0, ''
    for x in s:
        if x in '([':
            depth += 1
        elif x in ')]':
            depth -= 1
        if x == ch and depth == 0:
            out.append(cur); cur = ''
        else:
            cur += x
    out.append(cur)
    return out


def prefix_sel(sel):
    out = []
    for s in split_top(sel):
        s = s.strip()
        if not s or s.startswith(':root'):
            continue
        if s.startswith('html'):
            out.append(PREFIX + s[4:])
            continue
        out.append(PREFIX + ' ' + s)
    return ', '.join(out)


def blocks(css):
    """Lặp (đầu khối, nội dung) ở cấp hiện tại."""
    i, n = 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0:
            return
        head = css[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            if css[k] == '{':
                depth += 1
            elif css[k] == '}':
                depth -= 1
            k += 1
        yield head, css[j + 1:k - 1]
        i = k


def convert(css):
    out = []
    for head, body in blocks(css):
        if head.startswith('@media') or head.startswith('@supports'):
            inner = convert(body)
            if inner.strip():
                out.append(f'{head} {{\n{inner}}}\n')
            continue
        if head.startswith('@'):
            continue
        sel = prefix_sel(head)
        if not sel:
            continue
        decls = []
        for d in split_top(body, ';'):
            if ':' not in d:
                continue
            p, v = d.split(':', 1)
            p = p.strip().lower()
            imp = '!important' in v
            v = v.replace('!important', '').strip()
            nv = transform(p, v, head)
            if nv:
                decls.append(f'{p}: {nv}{" !important" if imp else ""}')
        if decls:
            out.append(f'{sel} {{ {"; ".join(decls)}; }}\n')
    return ''.join(out)


if __name__ == '__main__':
    d = sys.argv[1] if len(sys.argv) > 1 else 'ktx-website'
    src = open(os.path.join(d, 'css', 'styles.css'), encoding='utf8').read()
    src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
    res = '/* Sinh tự động bởi tools/gen_dark.py từ styles.css: không sửa tay */\n' + convert(src)
    open(os.path.join(d, 'css', 'dark.css'), 'w', encoding='utf8').write(res)
    print('dark.css', res.count('\n'), 'lines')
