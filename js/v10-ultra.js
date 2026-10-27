/* v10 \u2014 n\u1ec1n \u0111\u1ed9ng "Ho\u00e0ng h\u00f4n bi\u1ec3n m\u00e2y" cho ch\u1ebf \u0111\u1ed9 N\u00e2ng c\u1ea5p (Ultra), c\u1ea3nh nguy\u00ean b\u1ea3n theo phong c\u00e1ch anime phong c\u1ea3nh:
   b\u1ea7u tr\u1eddi gi\u1edd v\u00e0ng c\u00f3 m\u00e2y ti v\u00e0 qu\u1ea7ng c\u1ea7u v\u1ed3ng, m\u1eb7t tr\u1eddi l\u00f3e s\u00e1ng tr\u00ean bi\u1ec3n m\u00e2y, sao ch\u1ed5i k\u00e9o v\u1ec7t d\u00e0i, n\u00fai xa nh\u00f4 kh\u1ecfi m\u00e2y,
   \u0111\u1ed3i c\u00f3 c\u1ed5ng torii v\u00e0 r\u1eebng th\u00f4ng, c\u00e2y phong \u0111\u1ecf, l\u00e1 phong bay, \u0111\u00e0n chim, b\u1ee5i s\u00e1ng l\u01a1 l\u1eedng.
   L\u1edbp t\u0129nh (tr\u1eddi, \u0111\u1ed3i, c\u00e2y) v\u1ebd m\u1ed9t l\u1ea7n theo \u0111\u1ed9 ph\u00e2n gi\u1ea3i m\u00e0n h\u00ecnh (s\u1eafc n\u00e9t t\u1edbi 4K); hai d\u1ea3i m\u00e2y tr\u00f4i b\u1eb1ng CSS transform;
   l\u1edbp \u0111\u1ed9ng v\u1ebd l\u1ea1i m\u1ed7i khung. Ch\u1ec9 ch\u1ea1y khi html[data-ultra="on"] v\u00e0 tab \u0111ang m\u1edf. */
(function () {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 760px)').matches;
  const ultra = () => root.dataset.ultra === 'on';
  const TAU = Math.PI * 2;
  let R = Math.random;
  const rnd = (a, b) => a + R() * (b - a);
  const seeded = (s) => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pick = (a) => a[(R() * a.length) | 0];

  const box = document.createElement('div'); box.id = 'v10-ultra'; box.setAttribute('aria-hidden', 'true');
  box.innerHTML = '<canvas class="u-sky"></canvas><div class="u-band u-far"><canvas></canvas></div><div class="u-band u-near"><canvas></canvas></div><canvas class="u-glow"></canvas><canvas class="u-land"></canvas><canvas class="u-fx"></canvas>';
  const cSky = box.querySelector('.u-sky'), cFar = box.querySelector('.u-far canvas'), cNear = box.querySelector('.u-near canvas');
  const cGlow = box.querySelector('.u-glow'), cLand = box.querySelector('.u-land'), cFx = box.querySelector('.u-fx');
  const bFar = box.querySelector('.u-far'), bNear = box.querySelector('.u-near');
  const gGlow = cGlow.getContext('2d'), gFx = cFx.getContext('2d');
  let W = 0, H = 0, DPR = 1, dprCap = 2, built = false, portrait = false;
  let HZ = 0, SX = 0, SY = 0, BT = 0; // ch\u00e2n tr\u1eddi, m\u1eb7t tr\u1eddi, \u0111\u1ec9nh d\u1ea3i m\u00e2y

  // ---------- ti\u1ec7n \u00edch ----------
  const sprite = (size, draw) => { const s = document.createElement('canvas'); s.width = s.height = size; draw(s.getContext('2d'), size); return s; };
  const glowSpr = new Map();
  const glow = (c) => { if (glowSpr.has(c)) return glowSpr.get(c); const s = sprite(64, (g) => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, 'rgba(255,255,255,1)'); q.addColorStop(0.25, `rgba(${c},.85)`); q.addColorStop(1, `rgba(${c},0)`); g.fillStyle = q; g.fillRect(0, 0, 64, 64); }); glowSpr.set(c, s); return s; };
  const mapleLeaf = (g, x, y, r, rot) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.beginPath();
    const pts = [[0, -1], [0.22, -0.45], [0.62, -0.62], [0.45, -0.18], [0.95, -0.05], [0.42, 0.18], [0.5, 0.55], [0.08, 0.32], [0, 0.95], [-0.08, 0.32], [-0.5, 0.55], [-0.42, 0.18], [-0.95, -0.05], [-0.45, -0.18], [-0.62, -0.62], [-0.22, -0.45]];
    pts.forEach(([a, b], i) => (i ? g.lineTo(a * r, b * r) : g.moveTo(a * r, b * r))); g.closePath(); g.fill(); g.restore();
  };
  const LEAF_COLORS = ['#e8361c', '#f2541e', '#ff7a1f', '#ffa424', '#d82a2a', '#ffbe3b'];
  const leafSpr = LEAF_COLORS.map((c) => sprite(64, (g) => { g.fillStyle = c; mapleLeaf(g, 32, 32, 28, 0); g.strokeStyle = 'rgba(120,20,10,.45)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(32, 32); g.lineTo(32, 60); g.moveTo(32, 32); g.lineTo(14, 18); g.moveTo(32, 32); g.lineTo(50, 18); g.stroke(); }));

  // ---------- b\u1ea7u tr\u1eddi (t\u0129nh) ----------
  const buildSky = () => {
    const g = cSky.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
    const gr = g.createLinearGradient(0, 0, 0, H);
    const h = HZ / H;
    gr.addColorStop(0, '#0a2470'); gr.addColorStop(h * 0.3, '#1846b4'); gr.addColorStop(h * 0.6, '#3a7ee0'); gr.addColorStop(h * 0.82, '#8fbdf2');
    gr.addColorStop(h * 0.93, '#f6c9b2'); gr.addColorStop(h, '#ffd08e'); gr.addColorStop(1, '#f2a46e');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    R = seeded(21);
    // sao m\u1edd tr\u00ean cao
    for (let i = 0; i < W * H / 9000; i++) { const y = Math.pow(R(), 2) * HZ * 0.45; g.globalAlpha = rnd(0.15, 0.6) * (1 - y / (HZ * 0.45)); g.fillStyle = '#fff'; const s = rnd(0.6, 1.5); g.fillRect(R() * W, y, s, s); }
    g.globalAlpha = 1;
    // qu\u1ea7ng c\u1ea7u v\u1ed3ng quanh m\u1eb7t tr\u1eddi
    const hr = Math.min(W, H) * (portrait ? 0.42 : 0.5);
    ['255,90,90', '255,190,80', '255,250,140', '120,230,170', '110,170,255', '170,120,255'].forEach((c, i) => {
      g.strokeStyle = `rgba(${c},0.16)`; g.lineWidth = hr * 0.018; g.beginPath(); g.arc(SX, SY, hr + i * hr * 0.016, Math.PI * 1.02, Math.PI * 1.98); g.stroke();
    });
    // m\u00e2y ti: v\u1ec7t d\u00e0i m\u1ea3nh cong
    g.lineCap = 'round';
    for (let i = 0; i < (mobile ? 28 : 60); i++) {
      const y = rnd(0.12, 0.85) * HZ, x = rnd(-0.2, 1) * W, len = rnd(0.15, 0.5) * W, bend = rnd(-0.05, 0.05) * H, warm = y / HZ;
      g.strokeStyle = `rgba(255,${Math.round(255 - warm * 50)},${Math.round(255 - warm * 90)},${rnd(0.08, 0.26)})`;
      g.lineWidth = rnd(0.8, 3.5) * (1 + warm);
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + len / 2, y + bend, x + len, y + bend * 0.4 - len * 0.06); g.stroke();
      if (R() < 0.5) { g.lineWidth *= 0.5; g.beginPath(); g.moveTo(x + 6, y + 4); g.quadraticCurveTo(x + len / 2, y + bend + 5, x + len * 0.8, y + bend * 0.4 - len * 0.05 + 4); g.stroke(); }
    }
    // d\u1ea3i m\u00e2y cao m\u00e0u h\u1ed3ng g\u1ea7n ch\u00e2n tr\u1eddi
    for (let i = 0; i < 18; i++) { const y = HZ - rnd(0.04, 0.22) * HZ, x = R() * W, rw = rnd(0.12, 0.35) * W, rh = rnd(4, 14) * (W / 1440 + 0.5); const q = g.createRadialGradient(x, y, 0, x, y, rw); q.addColorStop(0, 'rgba(255,214,200,.35)'); q.addColorStop(1, 'rgba(255,214,200,0)'); g.fillStyle = q; g.beginPath(); g.ellipse(x, y, rw, rh, 0, 0, TAU); g.fill(); }
    // n\u00fai xa nh\u00f4 kh\u1ecfi bi\u1ec3n m\u00e2y
    const ridge = (base, amp, seed, col, rim) => {
      const r = seeded(seed), p = [r() * 9, r() * 9, r() * 9]; g.beginPath(); g.moveTo(0, HZ + 30);
      const pts = [];
      for (let x = 0; x <= W + 8; x += 6) { const u = x / Math.max(W, 900); const y = base - amp * Math.max(0, 0.6 * Math.sin(u * 2.6 + p[0]) + 0.3 * Math.sin(u * 6.1 + p[1]) + 0.12 * Math.sin(u * 15 + p[2])); pts.push([x, y]); g.lineTo(x, y); }
      g.lineTo(W, HZ + 30); g.closePath(); g.fillStyle = col; g.fill();
      g.strokeStyle = rim; g.lineWidth = 1.5; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
    };
    ridge(HZ + 6, H * 0.1, 4, '#6a6cb0', 'rgba(255,200,150,.7)');
    ridge(HZ + 10, H * 0.055, 8, '#8f86c2', 'rgba(255,215,170,.7)');
    R = Math.random;
  };

  // ---------- d\u1ea3i m\u00e2y (t\u0129nh, l\u1eb7p ngang, tr\u00f4i b\u1eb1ng CSS) ----------
  const buildBand = (cv, band, top, depth, scale, seed, near, dpr) => {
    const P = W, bh = H - top + 4; band.style.top = top + 'px'; band.style.height = bh + 'px'; band.style.width = (P * 2) + 'px';
    cv.width = Math.round(P * 2 * dpr); cv.height = Math.round(bh * dpr); cv.style.width = (P * 2) + 'px'; cv.style.height = bh + 'px';
    const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = seeded(seed);
    // c\u00e1c c\u1ee5m m\u00e2y t\u00edch x\u1ebfp theo h\u00e0ng, c\u00e0ng g\u1ea7n (c\u00e0ng th\u1ea5p) c\u00e0ng to \u2014 ph\u1ed1i c\u1ea3nh bi\u1ec3n m\u00e2y.
    // M\u1ed7i c\u1ee5m t\u00f4 li\u1ec1n m\u1ed9t kh\u1ed1i (h\u1ee3p c\u00e1c v\u00f2ng tr\u00f2n) b\u1eb1ng m\u1ed9t d\u1ea3i m\u00e0u t\u1eeb \u0111\u1ec9nh s\u00e1ng xu\u1ed1ng \u0111\u00e1y t\u00edm, r\u1ed3i th\u00eam v\u1ec7t s\u00e1ng m\u1ec1m \u1edf m\u00e9p tr\u00ean.
    const lit = near ? ['#fff4e2', '#ffd3a4', '#eea28a', '#8a73ad', '#4a4683'] : ['#fff7ec', '#ffdfba', '#f2b29a', '#9d8dc4', '#6c68a6'];
    const rows = near ? 6 : 5;
    for (let rw = 0; rw < rows; rw++) {
      const v = rw / (rows - 1), py0 = v * depth * 0.85, sc = (near ? 0.3 + 0.9 * v : 0.35 + 0.65 * v) * scale;
      const n = Math.round((near ? 7 : 9) * Math.max(1, P / 1440) / (0.5 + v * 0.6));
      const clusters = [];
      for (let i = 0; i < n; i++) {
        const cx = (i + R() * 0.7) * P / n, w = rnd(0.16, 0.3) * P * sc, hgt = w * rnd(0.35, 0.6), cy = py0 + rnd(-0.04, 0.04) * depth;
        const k = 12 + Math.round(w / 14), puffs = [];
        let top = 1e9, bot = -1e9;
        for (let j = 0; j < k; j++) {
          const u = rnd(-0.5, 0.5), d = Math.abs(u), px = cx + u * w, py = cy - hgt * (1 - d * d * 3.2) * rnd(0.55, 1) + hgt, r = w * rnd(0.09, 0.17) * (1.1 - d);
          if (r > 2) { puffs.push([px, py, r]); top = Math.min(top, py - r); bot = Math.max(bot, py + r); }
        }
        clusters.push({ puffs, top, bot: Math.max(bot, top + hgt * 1.4) });
      }
      clusters.forEach(({ puffs, top, bot }) => {
        [0, P, -P].forEach((off) => {
          if (off < 0 && !puffs.some(([x, , r]) => x + r > P)) return;
          const q = g.createLinearGradient(0, top, 0, bot);
          q.addColorStop(0, lit[0]); q.addColorStop(0.2, lit[1]); q.addColorStop(0.42, lit[2]); q.addColorStop(0.72, lit[3]); q.addColorStop(1, lit[4]);
          g.fillStyle = q; g.beginPath(); puffs.forEach(([x, y, r]) => { g.moveTo(x + off + r, y); g.arc(x + off, y, r, 0, TAU); }); g.fill();
          g.globalCompositeOperation = 'lighter';
          puffs.forEach(([x, y, r]) => { if (y - r > top + (bot - top) * 0.35) return; const hx = x + off - r * 0.2, hy = y - r * 0.5, h = g.createRadialGradient(hx, hy, 0, hx, hy, r * 0.75); h.addColorStop(0, 'rgba(255,236,205,.22)'); h.addColorStop(1, 'rgba(255,236,205,0)'); g.fillStyle = h; g.beginPath(); g.arc(hx, hy, r * 0.75, 0, TAU); g.fill(); });
          g.globalCompositeOperation = 'source-over';
        });
      });
    }
    // ph\u1ea7n \u0111\u00e1y li\u1ec1n kh\u1ed1i
    const q = g.createLinearGradient(0, depth * 0.8, 0, bh);
    q.addColorStop(0, 'rgba(110,100,170,0)'); q.addColorStop(0.35, near ? '#5a568f' : '#8c84bd'); q.addColorStop(1, near ? '#3a3a72' : '#6c69a6');
    g.fillStyle = q; g.fillRect(0, depth * 0.8, P * 2, bh);
    R = Math.random;
  };

  // ---------- ti\u1ec1n c\u1ea3nh: \u0111\u1ed3i, torii, r\u1eebng th\u00f4ng, c\u00e2y phong (t\u0129nh) ----------
  let leafSources = [];
  const buildLand = () => {
    const g = cLand.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
    R = seeded(33); leafSources = [];
    const S = Math.min(W, H) / 900 * (portrait ? 0.9 : 1);
    // \u0111\u1ed3i tr\u00e1i
    const hx = portrait ? 0.62 : 0.36;
    g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * (portrait ? 0.78 : 0.66));
    g.bezierCurveTo(W * hx * 0.35, H * (portrait ? 0.74 : 0.6), W * hx * 0.7, H * (portrait ? 0.8 : 0.7), W * hx, H); g.closePath();
    let gr = g.createLinearGradient(0, H * 0.6, 0, H); gr.addColorStop(0, '#3b3f7a'); gr.addColorStop(0.5, '#262a58'); gr.addColorStop(1, '#14173a'); g.fillStyle = gr; g.fill();
    g.strokeStyle = 'rgba(255,170,110,.55)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(0, H * (portrait ? 0.78 : 0.66)); g.bezierCurveTo(W * hx * 0.35, H * (portrait ? 0.74 : 0.6), W * hx * 0.7, H * (portrait ? 0.8 : 0.7), W * hx, H); g.stroke();
    const hillY = (x) => { // x\u1ea5p x\u1ec9 \u0111\u1ec9nh \u0111\u1ed3i
      const t = Math.min(1, Math.max(0, x / (W * hx))); const y0 = H * (portrait ? 0.78 : 0.66), c1 = H * (portrait ? 0.74 : 0.6), c2 = H * (portrait ? 0.8 : 0.7);
      return (1 - t) ** 3 * y0 + 3 * (1 - t) ** 2 * t * c1 + 3 * (1 - t) * t * t * c2 + t ** 3 * H;
    };
    // r\u1eebng th\u00f4ng
    const pine = (x, y, h) => {
      g.fillStyle = '#171c40'; g.fillRect(x - h * 0.025, y - h * 0.25, h * 0.05, h * 0.25);
      for (let k = 0; k < 5; k++) { const yy = y - h * (0.18 + k * 0.17), ww = h * (0.34 - k * 0.055); g.beginPath(); g.moveTo(x - ww, yy); g.lineTo(x, yy - h * 0.3); g.lineTo(x + ww, yy); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,160,100,.35)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, yy - h * 0.3); g.lineTo(x + ww, yy); g.stroke(); }
    };
    for (let i = 0; i < (portrait ? 6 : 11); i++) { const x = rnd(0.0, 0.28) * W * (portrait ? 1.6 : 1); if (Math.abs(x - W * (portrait ? 0.3 : 0.16)) < 70 * S) continue; pine(x, hillY(x) + 8, rnd(120, 230) * S); }
    // c\u1ed5ng torii
    const tx = W * (portrait ? 0.3 : 0.16), ty = hillY(tx) + 6, th = 190 * S, tw = 150 * S;
    const red = '#7a1d1e', redL = '#c23a2a';
    g.fillStyle = red;
    [-1, 1].forEach((d) => { g.beginPath(); g.moveTo(tx + d * tw * 0.36 - th * 0.035, ty); g.lineTo(tx + d * tw * 0.33 - th * 0.03, ty - th * 0.86); g.lineTo(tx + d * tw * 0.33 + th * 0.03, ty - th * 0.86); g.lineTo(tx + d * tw * 0.36 + th * 0.035, ty); g.closePath(); g.fill(); });
    g.fillRect(tx - tw * 0.48, ty - th * 0.7, tw * 0.96, th * 0.055); // nuki
    g.fillRect(tx - th * 0.025, ty - th * 0.86, th * 0.05, th * 0.17); // gakuzuka
    g.beginPath(); g.moveTo(tx - tw * 0.62, ty - th * 0.92); g.quadraticCurveTo(tx, ty - th * 0.86, tx + tw * 0.62, ty - th * 0.92); g.lineTo(tx + tw * 0.58, ty - th * 0.84); g.quadraticCurveTo(tx, ty - th * 0.78, tx - tw * 0.58, ty - th * 0.84); g.closePath(); g.fill(); // kasagi
    g.fillStyle = '#2a0f12'; g.beginPath(); g.moveTo(tx - tw * 0.66, ty - th * 0.97); g.quadraticCurveTo(tx, ty - th * 0.9, tx + tw * 0.66, ty - th * 0.97); g.lineTo(tx + tw * 0.62, ty - th * 0.92); g.quadraticCurveTo(tx, ty - th * 0.86, tx - tw * 0.62, ty - th * 0.92); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,150,90,.75)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(tx + tw * 0.33 + th * 0.03, ty - th * 0.84); g.lineTo(tx + tw * 0.36 + th * 0.035, ty); g.moveTo(tx - tw * 0.33 + th * 0.03, ty - th * 0.84); g.lineTo(tx - tw * 0.36 + th * 0.035, ty); g.stroke();
    g.fillStyle = redL; g.globalAlpha = 0.5; g.fillRect(tx - tw * 0.48, ty - th * 0.7, tw * 0.96, th * 0.012); g.globalAlpha = 1;
    // \u0111\u00e8n l\u1ed3ng \u0111\u00e1
    g.fillStyle = '#1c2047'; [-1, 1].forEach((d) => { const lx = tx + d * tw * 0.75, ly = hillY(lx) + 4; g.fillRect(lx - 5 * S, ly - 40 * S, 10 * S, 40 * S); g.fillRect(lx - 12 * S, ly - 52 * S, 24 * S, 14 * S); g.beginPath(); g.moveTo(lx - 16 * S, ly - 52 * S); g.lineTo(lx, ly - 64 * S); g.lineTo(lx + 16 * S, ly - 52 * S); g.fill(); });
    // c\u00e2y phong \u0111\u1ecf g\u00f3c ph\u1ea3i d\u01b0\u1edbi
    const maple = (cx, cy, rad, n) => {
      g.strokeStyle = '#2a1a22'; g.lineCap = 'round';
      for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + rnd(-1.1, 1.1); g.lineWidth = rad * 0.05; g.beginPath(); g.moveTo(cx, cy + rad * 0.9); g.quadraticCurveTo(cx + Math.cos(a) * rad * 0.3, cy + Math.sin(a) * rad * 0.3, cx + Math.cos(a) * rad * 0.8, cy + Math.sin(a) * rad * 0.8); g.stroke(); }
      for (let i = 0; i < n; i++) {
        const a = rnd(0, TAU), d = Math.sqrt(R()) * rad, x = cx + Math.cos(a) * d * 1.15, y = cy + Math.sin(a) * d * 0.8, top = (cy - y) / rad;
        const col = top > 0.3 ? pick(['#ff8a24', '#ffb02e', '#ff6a1f', '#ffc94a']) : top > -0.3 ? pick(['#f04a1c', '#ff6a1f', '#e8361c', '#ff8a24']) : pick(['#b8201e', '#d42e22', '#8e1a1e']);
        g.fillStyle = col; mapleLeaf(g, x, y, rnd(7, 14) * S, rnd(0, TAU));
        if (R() < 0.04) leafSources.push([x, y]);
      }
      g.globalCompositeOperation = 'lighter'; const q = g.createRadialGradient(cx - rad * 0.3, cy - rad * 0.5, 0, cx - rad * 0.3, cy - rad * 0.5, rad); q.addColorStop(0, 'rgba(255,190,90,.25)'); q.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = q; g.beginPath(); g.arc(cx, cy, rad * 1.2, 0, TAU); g.fill(); g.globalCompositeOperation = 'source-over';
    };
    if (portrait) { maple(W * 0.92, H * 0.9, 150 * S, 900); }
    else { maple(W * 0.93, H * 0.86, 210 * S, 1500); maple(W * 0.8, H * 0.97, 150 * S, 900); }
    // c\u00e0nh phong v\u1eaft ngang g\u00f3c tr\u00ean ph\u1ea3i
    const bx = W * 1.02, by = H * 0.02;
    g.strokeStyle = '#24161d'; g.lineCap = 'round';
    const branch = (x, y, a, len, w, depth) => {
      const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
      g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo((x + x2) / 2, (y + y2) / 2 + len * 0.08, x2, y2); g.stroke();
      if (depth <= 0) { for (let i = 0; i < 26; i++) { const lx = x2 + rnd(-1, 1) * len * 0.45, ly = y2 + rnd(-0.6, 1) * len * 0.35; g.fillStyle = pick(['#e8361c', '#ff5a1f', '#ff7a1f', '#c72424', '#ffa424']); mapleLeaf(g, lx, ly, rnd(8, 15) * S, rnd(0, TAU)); if (R() < 0.08) leafSources.push([lx, ly]); } return; }
      branch(x2, y2, a + rnd(-0.5, -0.15), len * 0.7, w * 0.65, depth - 1); branch(x2, y2, a + rnd(0.15, 0.6), len * 0.65, w * 0.6, depth - 1);
    };
    branch(bx, by, Math.PI * 0.84, (portrait ? 160 : 230) * S, 14 * S, 3);
    R = Math.random;
  };

  // ---------- l\u1edbp \u0111\u1ed9ng ----------
  let flareSpr = null, raysSpr = null;
  const buildSprites = () => {
    flareSpr = sprite(512, (g) => {
      g.globalCompositeOperation = 'lighter';
      let q = g.createRadialGradient(256, 256, 0, 256, 256, 256); q.addColorStop(0, 'rgba(255,255,255,1)'); q.addColorStop(0.06, 'rgba(255,250,225,1)'); q.addColorStop(0.18, 'rgba(255,214,140,.55)'); q.addColorStop(0.5, 'rgba(255,170,90,.15)'); q.addColorStop(1, 'rgba(255,150,80,0)');
      g.fillStyle = q; g.fillRect(0, 0, 512, 512);
      const spike = (a, len, wd, al) => { g.save(); g.translate(256, 256); g.rotate(a); const s = g.createLinearGradient(0, 0, len, 0); s.addColorStop(0, `rgba(255,250,230,${al})`); s.addColorStop(1, 'rgba(255,230,180,0)'); g.fillStyle = s; g.beginPath(); g.moveTo(0, -wd); g.lineTo(len, 0); g.lineTo(0, wd); g.fill(); g.restore(); };
      for (let i = 0; i < 8; i++) spike(i * Math.PI / 4 + 0.2, i % 2 ? 150 : 230, i % 2 ? 2.5 : 4, 0.9);
      for (let i = 0; i < 16; i++) spike(i * Math.PI / 8 + 0.05, 110, 1.2, 0.5);
    });
    raysSpr = sprite(512, (g) => {
      g.translate(256, 256);
      for (let i = 0; i < 26; i++) { const a = (i / 26) * TAU + Math.random() * 0.1, wd = 0.02 + Math.random() * 0.05; const q = g.createRadialGradient(0, 0, 0, 0, 0, 256); q.addColorStop(0, 'rgba(255,220,160,.5)'); q.addColorStop(1, 'rgba(255,200,140,0)'); g.fillStyle = q; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 256, a - wd, a + wd); g.closePath(); g.fill(); }
    });
  };
  let leaves = [], motes = [], comets = [], birds = null, T = 0, nextComet = 2.5, nextBird = 6, nextMeteor = 3;
  const newLeaf = (init) => {
    const src = leafSources.length && R() < 0.85 ? pick(leafSources) : [rnd(0.4, 1.1) * W, -20];
    return { x: init ? R() * W : src[0], y: init ? R() * H : src[1], vx: rnd(-55, -15), vy: rnd(28, 65), r: rnd(9, 18) * Math.max(0.8, Math.min(W, H) / 900), rot: rnd(0, TAU), vr: rnd(-1.6, 1.6), flip: rnd(0, TAU), vf: rnd(1.5, 3.5), sw: rnd(0, TAU), s: pick(leafSpr) };
  };
  const seedFx = () => {
    leaves = []; const nL = Math.round((mobile ? 16 : 34) * Math.min(1.6, W * H / 1.3e6)); for (let i = 0; i < nL; i++) leaves.push(newLeaf(true));
    motes = []; const nM = mobile ? 26 : 60; for (let i = 0; i < nM; i++) motes.push({ x: R() * W, y: rnd(BT * 0.8, H), vy: rnd(-14, -4), ph: rnd(0, TAU), r: rnd(1.5, 4) });
  };
  const comet = () => {
    const x0 = W * rnd(0.75, 1.05), y0 = -H * 0.05, x1 = W * rnd(0.35, 0.6), y1 = HZ * rnd(0.55, 0.85);
    comets.push({ x0, y0, x1, y1, t: 0, dur: rnd(2.2, 3), big: true, split: R() < 0.7 });
  };
  const meteor = () => { const x0 = W * rnd(0.2, 1), y0 = HZ * rnd(0, 0.3), a = Math.PI * rnd(0.62, 0.72), L = rnd(0.12, 0.25) * W; comets.push({ x0, y0, x1: x0 + Math.cos(a) * L, y1: y0 + Math.sin(a) * L, t: 0, dur: rnd(0.6, 0.9), big: false }); };

  const drawGlow = (t) => {
    const g = gGlow, s = 0.5; g.setTransform(s, 0, 0, s, 0, 0); g.clearRect(0, 0, W, H); g.globalCompositeOperation = 'lighter';
    const pulse = 1 + 0.06 * Math.sin(t * 1.3);
    let q = g.createRadialGradient(SX, SY, 0, SX, SY, Math.max(W, H) * 0.55 * pulse); q.addColorStop(0, 'rgba(255,215,150,.42)'); q.addColorStop(0.18, 'rgba(255,170,110,.14)'); q.addColorStop(1, 'rgba(255,140,90,0)');
    g.fillStyle = q; g.fillRect(0, 0, W, H);
    const rr = Math.max(W, H) * 0.9; g.save(); g.translate(SX, SY); g.rotate(t * 0.02); g.globalAlpha = 0.16 + 0.05 * Math.sin(t * 0.7); g.drawImage(raysSpr, -rr, -rr, rr * 2, rr * 2); g.rotate(-t * 0.035); g.globalAlpha = 0.09; g.drawImage(raysSpr, -rr * 0.8, -rr * 0.8, rr * 1.6, rr * 1.6); g.restore();
    // v\u1ec7t l\u00f3e ngang tr\u00ean m\u1eb7t bi\u1ec3n m\u00e2y
    q = g.createLinearGradient(0, SY, W, SY); q.addColorStop(0, 'rgba(255,200,140,0)'); q.addColorStop(SX / W, 'rgba(255,235,190,.6)'); q.addColorStop(1, 'rgba(255,200,140,0)');
    g.globalAlpha = 1; g.fillStyle = q; g.fillRect(0, SY - H * 0.012, W, H * 0.024);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  };
  const drawFx = (dt) => {
    const g = gFx; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    // m\u1eb7t tr\u1eddi + l\u00f3e s\u00e1ng
    const fs = Math.min(W, H) * 0.5 * (1 + 0.05 * Math.sin(T * 1.7));
    g.globalAlpha = 1; g.drawImage(flareSpr, SX - fs, SY - fs, fs * 2, fs * 2);
    const ls = W * 0.55; let q = g.createLinearGradient(SX - ls, 0, SX + ls, 0); q.addColorStop(0, 'rgba(160,200,255,0)'); q.addColorStop(0.5, 'rgba(255,250,235,.85)'); q.addColorStop(1, 'rgba(160,200,255,0)');
    g.fillStyle = q; g.fillRect(SX - ls, SY - 1.5, ls * 2, 3);
    q = g.createLinearGradient(0, SY - H * 0.5, 0, SY); q.addColorStop(0, 'rgba(255,240,210,0)'); q.addColorStop(1, 'rgba(255,245,225,.55)'); g.fillStyle = q; g.fillRect(SX - 2, SY - H * 0.5, 4, H * 0.5);
    // b\u00f3ng l\u00f3e \u1ed1ng k\u00ednh (ghost) theo \u0111\u01b0\u1eddng ch\u00e9o qua t\u00e2m
    const gx = W - SX, gy = H - SY;
    [[0.35, 26, '120,200,255', 0.18], [0.6, 14, '255,160,220', 0.22], [0.85, 40, '160,255,200', 0.1], [1.25, 60, '255,200,120', 0.08]].forEach(([k, r, c, a]) => {
      const x = SX + (gx - SX) * k, y = SY + (gy - SY) * k; g.globalAlpha = a; g.drawImage(glow(c), x - r * 2, y - r * 2, r * 4, r * 4);
    });
    g.globalAlpha = 1;
    // sao ch\u1ed5i, sao b\u0103ng
    comets = comets.filter((c) => {
      c.t += dt; const p = Math.min(1, c.t / c.dur), e = p < 1 ? 1 - Math.pow(1 - p, 1.6) : 1;
      const x = c.x0 + (c.x1 - c.x0) * e, y = c.y0 + (c.y1 - c.y0) * e, fade = c.t > c.dur ? Math.max(0, 1 - (c.t - c.dur) / (c.big ? 1.6 : 0.4)) : Math.min(1, c.t / 0.2);
      const dx = c.x1 - c.x0, dy = c.y1 - c.y0, dl = Math.hypot(dx, dy), L = (c.big ? Math.min(dl * 0.9, W * 0.7) : dl * 0.6) * Math.min(1, p * 2.5 + 0.1);
      const trail = (ox, oy, wmul, al) => {
        const tx = x - dx / dl * L + ox, ty = y - dy / dl * L + oy;
        (c.big ? [[30, 0.08], [12, 0.25], [4.5, 0.75], [1.8, 1]] : [[5, 0.2], [1.4, 0.9]]).forEach(([lw, a]) => {
          const s = g.createLinearGradient(tx, ty, x, y); s.addColorStop(0, 'rgba(180,220,255,0)'); s.addColorStop(0.75, `rgba(210,235,255,${a * 0.5 * al})`); s.addColorStop(1, `rgba(255,255,255,${a * al})`);
          g.globalAlpha = fade; g.strokeStyle = s; g.lineWidth = lw * wmul; g.lineCap = 'round'; g.beginPath(); g.moveTo(tx, ty); g.lineTo(x, y); g.stroke();
        });
      };
      trail(0, 0, 1, 1);
      if (c.split && p > 0.35) { const k = (p - 0.35) / 0.65; trail(-dy / dl * 18 * k, dx / dl * 18 * k, 0.55, 0.7 * k); }
      if (c.big && p < 1) { g.globalAlpha = fade; g.drawImage(glow('200,230,255'), x - 40, y - 40, 80, 80); g.drawImage(glow('255,255,255'), x - 12, y - 12, 24, 24); }
      if (c.big && p >= 1 && c.t - c.dur < 0.5) { const k = (c.t - c.dur) / 0.5; g.globalAlpha = (1 - k) * 0.9; const r = 60 + k * 220; g.drawImage(glow('255,240,210'), x - r, y - r, r * 2, r * 2); }
      return fade > 0;
    });
    // b\u1ee5i s\u00e1ng
    motes.forEach((m) => { m.y += m.vy * dt; m.x += Math.sin(T * 0.6 + m.ph) * 8 * dt; if (m.y < BT * 0.7) { m.y = H + 10; m.x = R() * W; } const a = 0.35 + 0.35 * Math.sin(T * 2 + m.ph); g.globalAlpha = a; g.drawImage(glow('255,220,160'), m.x - m.r * 3, m.y - m.r * 3, m.r * 6, m.r * 6); });
    g.globalCompositeOperation = 'source-over';
    // \u0111\u00e0n chim
    if (birds) {
      birds.t += dt; const bxBase = birds.x0 + birds.vx * birds.t;
      g.strokeStyle = 'rgba(40,30,70,.85)'; g.lineCap = 'round';
      birds.list.forEach((b) => { const x = bxBase + b.dx, y = birds.y0 + b.dy + Math.sin(birds.t * 1.5 + b.ph) * 4, f = Math.sin(birds.t * 9 + b.ph), s = b.s; g.globalAlpha = 1; g.lineWidth = Math.max(1.2, s * 0.18); g.beginPath(); g.moveTo(x - s, y - f * s * 0.5); g.quadraticCurveTo(x - s * 0.4, y - s * 0.2, x, y); g.quadraticCurveTo(x + s * 0.4, y - s * 0.2, x + s, y - f * s * 0.5); g.stroke(); });
      if (bxBase < -W * 0.3 || bxBase > W * 1.3) birds = null;
    }
    // l\u00e1 phong bay
    leaves.forEach((l, i) => {
      l.sw += dt; l.x += (l.vx + Math.sin(l.sw * 1.3) * 30) * dt; l.y += l.vy * dt; l.rot += l.vr * dt; l.flip += l.vf * dt;
      if (l.y > H + 30 || l.x < -40) leaves[i] = newLeaf(false);
      g.save(); g.translate(l.x, l.y); g.rotate(l.rot); g.scale(Math.cos(l.flip), 1); g.globalAlpha = 0.95; g.drawImage(l.s, -l.r, -l.r, l.r * 2, l.r * 2); g.restore();
    });
    g.globalAlpha = 1;
  };

  // ---------- v\u00f2ng l\u1eb7p ----------
  let running = false, last = 0, mLast = 0, mSum = 0, mN = 0, low = 0, lvl = 0, calm = 0, gl = 0;
  const loop = (now) => {
    if (!running) return;
    requestAnimationFrame(loop);
    if (document.hidden) { last = 0; return; }
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now; T += dt;
    if (now > calm) { if (mLast) { mSum += now - mLast; mN++; } mLast = now; if (mN >= 120) { const fps = 1000 / (mSum / mN); mSum = mN = 0; low = fps < 36 ? low + 1 : 0; if (low >= 3 && lvl < 2) { low = 0; lvl++; dprCap = lvl === 1 ? 1.5 : 1; resize(true); } } }
    if ((nextComet -= dt) <= 0) { comet(); nextComet = rnd(9, 14); }
    if ((nextMeteor -= dt) <= 0) { meteor(); nextMeteor = rnd(2.5, 6); }
    if ((nextBird -= dt) <= 0 && !birds) { const dir = R() < 0.5 ? 1 : -1, n = 5 + ((R() * 5) | 0), s = rnd(7, 12) * Math.max(0.8, W / 1440); birds = { t: 0, x0: dir > 0 ? -W * 0.1 : W * 1.1, y0: HZ * rnd(0.35, 0.7), vx: dir * W * rnd(0.05, 0.08), list: Array.from({ length: n }, (_, i) => ({ dx: -dir * (i * s * 3.2) + rnd(-8, 8), dy: Math.abs(i - n / 2) * s * 1.2 + rnd(-6, 6), ph: rnd(0, TAU), s })) }; nextBird = rnd(16, 26); }
    if ((gl = (gl + 1) % 2) === 0) drawGlow(T); // qu\u1ea7ng s\u00e1ng m\u1ec1m: 30 l\u1ea7n/gi\u00e2y l\u00e0 \u0111\u1ee7
    drawFx(dt);
  };

  const resize = (force) => {
    const nw = innerWidth, nh = innerHeight, nd = Math.min(devicePixelRatio || 1, dprCap);
    if (!force && built && nw === W && Math.abs(nh - H) < 120 && nd === DPR) return;
    W = nw; H = nh; DPR = nd; portrait = H > W * 1.1;
    HZ = H * (portrait ? 0.5 : 0.56); SX = W * (portrait ? 0.55 : 0.6); SY = HZ + H * 0.005; BT = HZ - H * 0.01;
    [cSky, cLand, cFx].forEach((c) => { c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); });
    cGlow.width = Math.round(W * 0.5); cGlow.height = Math.round(H * 0.5);
    buildSky();
    buildBand(cFar, bFar, BT, H * 0.16, 0.8, 41, false, Math.min(DPR, 1));
    buildBand(cNear, bNear, HZ + H * (portrait ? 0.05 : 0.06), H * 0.5, 1.3, 57, true, Math.min(DPR, 1.5));
    buildLand(); if (!flareSpr) buildSprites(); seedFx(); built = true; calm = performance.now() + 2500;
    if (reduce || !running) { drawGlow(T); drawFx(0); }
  };
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (ultra()) resize(); else built = false; }, 200); });

  const sync = () => {
    const on = ultra();
    root.classList.toggle('v10', on);
    window.__v10 = on;
    if (!on) { running = false; return; }
    if (!built) resize(true);
    const go = !document.hidden && !reduce;
    if (go && !running) { running = true; last = 0; requestAnimationFrame(loop); }
    else if (!go) running = false;
  };
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-ultra'] });
  document.addEventListener('visibilitychange', sync);

  const start = () => { const host = document.getElementById('v8-bg') || document.body; host.appendChild(box); sync(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 0);
})();
