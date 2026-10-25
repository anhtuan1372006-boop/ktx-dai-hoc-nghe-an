"""Build: (1) mo-tren-may.html for local viewing, (2) dist/ with ASCII-escaped JS/CSS so text decodes
correctly even when a server omits the charset header."""
import sys, os, shutil, re

d = os.path.abspath(sys.argv[1])
body = open(os.path.join(d, 'index.html'), encoding='utf8').read()
html = ('<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + body.replace('<div id="app"></div>', '</head>\n<body>\n<div id="app"></div>', 1) + '</body>\n</html>\n')
open(os.path.join(d, 'mo-tren-may.html'), 'w', encoding='utf8').write(html)

def esc_js(s):
    return ''.join(c if ord(c) < 128 else ('\\u%04x' % ord(c) if ord(c) < 0x10000 else ''.join('\\u%04x' % u for u in c.encode('utf-16-be') and [int.from_bytes(c.encode('utf-16-be')[i:i+2], 'big') for i in (0, 2)])) for c in s)

def strip_css_comments_nonascii(s):
    return re.sub(r'/\*.*?\*/', lambda m: m.group(0).encode('ascii', 'ignore').decode(), s, flags=re.S)

dist = os.path.join(os.path.dirname(d), 'ktx-dist')
os.makedirs(dist, exist_ok=True)
for name in os.listdir(dist):
    full = os.path.join(dist, name)
    shutil.rmtree(full) if os.path.isdir(full) else os.remove(full)
os.makedirs(os.path.join(dist, 'js'))
os.makedirs(os.path.join(dist, 'css'))
shutil.copytree(os.path.join(d, 'assets'), os.path.join(dist, 'assets'))
for f in os.listdir(os.path.join(d, 'js')):
    src = open(os.path.join(d, 'js', f), encoding='utf8').read()
    open(os.path.join(dist, 'js', f), 'w', encoding='ascii').write(esc_js(src))
css = strip_css_comments_nonascii(open(os.path.join(d, 'css', 'styles.css'), encoding='utf8').read())
open(os.path.join(dist, 'css', 'styles.css'), 'w', encoding='ascii').write(css)
open(os.path.join(dist, 'index.html'), 'w', encoding='utf8').write(body.replace(' charset="utf-8"></script>', '></script>'))
open(os.path.join(dist, 'mo-tren-may.html'), 'w', encoding='utf8').write(html.replace(' charset="utf-8"></script>', '></script>'))
print('built')
