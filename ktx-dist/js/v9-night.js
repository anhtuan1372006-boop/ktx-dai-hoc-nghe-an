/* v9 \u2014 n\u1ec1n \u0111\u1ed9ng "\u0110\u00eam sao" (theo video m\u1eabu) cho c\u1ea3 giao di\u1ec7n s\u00e1ng v\u00e0 t\u1ed1i: b\u1ea7u tr\u1eddi sao + Ng\u00e2n H\u00e0, m\u01b0a sao b\u0103ng, sao ch\u1ed5i, ph\u00e1o hoa tr\u00e1i tim,
   thi\u00ean h\u00e0 xo\u1eafn \u1ed1c, tr\u0103ng l\u01b0\u1ee1i li\u1ec1m treo tim, nh\u00e2n v\u1eadt neon; ph\u00eda d\u01b0\u1edbi l\u00e0 phong c\u1ea3nh \u0111\u00eam (n\u00fai, v\u00e1ch \u0111\u00e1, \u0111\u00ecnh c\u00f3 \u0111\u00e8n l\u1ed3ng,
   c\u1ed1i xay n\u01b0\u1edbc, h\u1ed3 sen ph\u00e1t s\u00e1ng, \u0111\u1ed3ng hoa, c\u00e2y hoa xanh, h\u01b0\u01a1u neon, \u0111om \u0111\u00f3m).
   V\u1ebd b\u1eb1ng canvas theo \u0111\u00fang \u0111\u1ed9 ph\u00e2n gi\u1ea3i m\u00e0n h\u00ecnh (s\u1eafc n\u00e9t t\u1edbi 4K). B\u1ed1n l\u1edbp canvas: tr\u1eddi t\u0129nh, tr\u1eddi \u0111\u1ed9ng, \u0111\u1ea5t t\u0129nh, \u0111\u1ea5t \u0111\u1ed9ng \u2014
   l\u1edbp t\u0129nh ch\u1ec9 v\u1ebd l\u1ea1i khi \u0111\u1ed5i k\u00edch th\u01b0\u1edbc. Ch\u1ec9 ch\u1ea1y khi tab \u0111ang m\u1edf. */
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
  const C = { cyan: [90, 240, 255], teal: [60, 255, 220], blue: [90, 150, 255], pink: [255, 110, 200], rose: [255, 80, 120], red: [255, 70, 40], orange: [255, 150, 50], gold: [255, 215, 110], white: [255, 255, 255], violet: [180, 120, 255], green: [140, 255, 150], lilac: [210, 170, 255] };
  const K = { sky: ['#02030b', '#050c27', '#0b1d52', '#1a3a86', '#0a1640'], neb: ['110,60,200', '40,90,220', '70,120,255'], nebA: 1, deer: [235, 225, 255], line: '#9fc2ff', cloud: '60,90,170', cloudA: 0.16, pav: '#04081a', far: ['#1d2f66', '#0e1a40'], rim: '#8fb3ff', mid: ['#0b1636', '#070f26'], tree: '#060d22', rock: '#0a1330', rockL: '#7f9fe0', house: '#050a1c', lake: ['#12285e', '#060f2a'], refl: '#2a3f80', ground: ['#0a1b24', '#06120f', '#030806'], grass: '#030a0a', big: '#050b18', wheel: '#0a1430', wheelR: '#8fb0ff', shim: '#9fc4ff', moonR: '#ffe6a8', dustA: 1 };
  const ADD = 'lighter';

  // ---------- khung ----------
  const box = document.createElement('div'); box.id = 'v9-night'; box.setAttribute('aria-hidden', 'true');
  box.innerHTML = '<canvas class="n-sky"></canvas><canvas class="n-stars"></canvas><canvas class="n-skyfx"></canvas><canvas class="n-land"></canvas><canvas class="n-landfx"></canvas>';
  const [cSky, cStars, cSkyFx, cLand, cLandFx] = box.querySelectorAll('canvas');
  const gSky = cSky.getContext('2d'), gSt = cStars.getContext('2d'), gFx = cSkyFx.getContext('2d'), gLand = cLand.getContext('2d'), gLfx = cLandFx.getContext('2d');
  let W = 0, H = 0, HZ = 0, LT = 0, LW = 0, PAD = 24, DPR = 1, built = false, dprCap = 2;

  // ---------- sprite ph\u00e1t s\u00e1ng ----------
  const sprites = new Map();
  const glow = (c, hard) => {
    const k = c.join() + (hard ? 'h' : '');
    if (sprites.has(k)) return sprites.get(k);
    const s = document.createElement('canvas'); s.width = s.height = 64;
    const x = s.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    if (hard) { gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, `rgba(${c},1)`); gr.addColorStop(0.4, `rgba(${c},.35)`); gr.addColorStop(1, `rgba(${c},0)`); }
    else { gr.addColorStop(0, `rgba(${c},.9)`); gr.addColorStop(0.35, `rgba(${c},.35)`); gr.addColorStop(1, `rgba(${c},0)`); }
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64); sprites.set(k, s); return s;
  };
  const dot = (g, c, x, y, r, a, hard) => { if (a <= 0.01 || r <= 0) return; g.globalAlpha = Math.min(1, a); g.drawImage(glow(c, hard), x - r, y - r, r * 2, r * 2); };
  const sparkle = (g, c, x, y, r, a) => {
    dot(g, c, x, y, r * 1.2, a, true);
    g.globalAlpha = Math.min(1, a); g.strokeStyle = `rgba(${c},1)`; g.lineWidth = Math.max(0.8, r * 0.09);
    g.beginPath(); g.moveTo(x - r * 2.2, y); g.lineTo(x + r * 2.2, y); g.moveTo(x, y - r * 2.2); g.lineTo(x, y + r * 2.2); g.stroke();
  };
  const heartPt = (t) => [16 * Math.pow(Math.sin(t), 3), -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))];
  // n\u00e9t neon: 3 l\u01b0\u1ee3t (qu\u1ea7ng r\u1ed9ng, qu\u1ea7ng v\u1eeba, l\u00f5i s\u00e1ng)
  const neon = (g, c, w, a, path) => {
    g.lineCap = 'round'; g.lineJoin = 'round';
    [[w * 5, 0.13], [w * 2.2, 0.38], [w, 1]].forEach(([lw, al], i) => { g.globalAlpha = a * al; g.strokeStyle = i === 2 ? `rgba(${c.map((v) => Math.min(255, v + 90))},1)` : `rgba(${c},1)`; g.lineWidth = lw; g.beginPath(); path(g); g.stroke(); });
  };

  // ---------- d\u1ef1ng l\u1edbp t\u0129nh ----------
  const ridge = (x0, x1, base, amp, seed, rough) => {
    const r = seeded(seed), ph = [r() * 9, r() * 9, r() * 9, r() * 9], pts = [];
    for (let x = x0; x <= x1 + 4; x += 4) {
      const u = x / Math.max(W, 900);
      const y = base - amp * (0.55 * Math.sin(u * 3.1 + ph[0]) + 0.3 * Math.sin(u * 7.3 + ph[1]) + 0.15 * Math.sin(u * 17 + ph[2]) + (rough || 0) * Math.sin(u * 41 + ph[3]));
      pts.push([x, y]);
    }
    return pts;
  };
  const fillRidge = (g, pts, bottom, fill) => { g.beginPath(); g.moveTo(pts[0][0], bottom); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(pts[pts.length - 1][0], bottom); g.closePath(); g.fillStyle = fill; g.fill(); };
  const yAt = (pts, x) => { const i = Math.max(0, Math.min(pts.length - 1, Math.round((x - pts[0][0]) / 4))); return pts[i][1]; };

  let starsT = [], lanterns = [], mill = null, lotus = [], flowersT = [], deer = null, lakeTop = 0, lakeBot = 0, groundPts = null;
  const buildSky = () => {
    const g = gSky; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
    const gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, K.sky[0]); gr.addColorStop(0.32, K.sky[1]); gr.addColorStop(0.6, K.sky[2]); gr.addColorStop(HZ / H, K.sky[3]); gr.addColorStop(1, K.sky[4]);
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = ADD;
    const neb = (x, y, r, c, a) => { const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, `rgba(${c},${a})`); q.addColorStop(1, `rgba(${c},0)`); g.fillStyle = q; g.fillRect(x - r, y - r, r * 2, r * 2); };
    neb(W * 0.15, H * 0.12, Math.max(W, H) * 0.45, K.neb[0], 0.16 * K.nebA);
    neb(W * 0.85, H * 0.28, Math.max(W, H) * 0.4, K.neb[1], 0.16 * K.nebA);
    neb(W * 0.5, HZ, W * 0.6, K.neb[2], 0.14 * K.nebA);
    // Ng\u00e2n H\u00e0: d\u1ea3i ch\u00e9o b\u1ee5i s\u00e1ng + sao d\u00e0y
    R = seeded(7);
    const ax = W * -0.05, ay = H * 0.05, bx = W * 1.05, by = HZ * 0.62, len = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / len, ny = (bx - ax) / len, band = Math.max(W, H) * 0.09;
    for (let i = 0; i < 260; i++) { const u = R(), off = (R() + R() + R() - 1.5) * band * 1.2; const x = ax + (bx - ax) * u + nx * off, y = ay + (by - ay) * u + ny * off; neb(x, y, rnd(30, 110) * (W / 1440 + 0.4), pick(['120,90,230', '80,130,255', '200,110,220', '150,170,255']), rnd(0.015, 0.045)); }
    g.fillStyle = '#fff';
    const nDust = Math.round(W * H / 500);
    for (let i = 0; i < nDust; i++) { const u = R(), off = (R() + R() + R() + R() - 2) * band; const x = ax + (bx - ax) * u + nx * off, y = ay + (by - ay) * u + ny * off; if (y > HZ) continue; g.globalAlpha = rnd(0.15, 0.7) * (1 - Math.abs(off) / (band * 2)) * K.dustA; const s = rnd(0.5, 1.3); g.fillRect(x, y, s, s); }
    // sao n\u1ec1n t\u0129nh
    const nBg = Math.round(W * H / 1500);
    for (let i = 0; i < nBg; i++) { const y = Math.pow(R(), 1.3) * HZ; g.globalAlpha = rnd(0.2, 0.85) * (1 - y / HZ * 0.6); const s = R() < 0.92 ? rnd(0.5, 1.2) : rnd(1.3, 2); g.fillStyle = pick(['#fff', '#fff', '#cfe0ff', '#ffe9c9', '#e6d4ff']); g.fillRect(R() * W, y, s, s); }
    // ch\u00f2m sao
    g.globalAlpha = 0.22; g.strokeStyle = K.line; g.lineWidth = 0.8;
    [[0.62, 0.12], [0.08, 0.38]].forEach(([cx, cy]) => { let px = cx * W, py = cy * HZ; g.beginPath(); g.moveTo(px, py); for (let k = 0; k < 6; k++) { px += rnd(-50, 60); py += rnd(-25, 30); g.lineTo(px, py); dot(g, C.white, px, py, 3, 0.7, true); g.globalAlpha = 0.22; } g.stroke(); });
    // m\u00e2y m\u1ecfng g\u1ea7n ch\u00e2n tr\u1eddi
    g.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 14; i++) { const x = R() * W, y = HZ - rnd(0.05, 0.3) * HZ, r = rnd(80, 220) * (W / 1440 + 0.5); const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, `rgba(${K.cloud},${K.cloudA})`); q.addColorStop(1, `rgba(${K.cloud},0)`); g.globalAlpha = 1; g.fillStyle = q; g.beginPath(); g.ellipse(x, y, r * 1.8, r * 0.5, 0, 0, TAU); g.fill(); }
    g.globalAlpha = 1;
    // sao l\u1ea5p l\u00e1nh \u0111\u1ed9ng
    const nT = Math.round((mobile ? 110 : 240) * Math.min(1.6, W * H / 1.3e6));
    starsT = []; for (let i = 0; i < nT; i++) starsT.push({ x: R() * W, y: Math.pow(R(), 1.2) * HZ * 0.95, r: rnd(1, 2.6), ph: rnd(0, TAU), sp: rnd(0.8, 2.6), c: pick([C.white, C.white, C.lilac, C.blue, C.gold]), x4: R() < 0.12 });
    R = Math.random;
  };

  const tree = (g, x, y, s, col, blossom, glowList) => {
    g.fillStyle = col; g.strokeStyle = col; g.lineWidth = s * 0.12;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + s * 0.05, y - s * 0.7); g.stroke();
    for (let i = 0; i < 9; i++) { const a = rnd(0, TAU), d = rnd(0, s * 0.42), cx = x + Math.cos(a) * d, cy = y - s * 0.95 + Math.sin(a) * d * 0.7, r = rnd(s * 0.22, s * 0.38); g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); if (blossom) for (let k = 0; k < 26; k++) { const aa = rnd(0, TAU), dd = Math.sqrt(R()) * r; glowList.push([cx + Math.cos(aa) * dd, cy + Math.sin(aa) * dd, rnd(1.5, 4.5) * (s / 90), blossom]); } }
  };
  const pavilion = (g, x, y, s) => {
    g.fillStyle = K.pav;
    g.fillRect(x - s * 1.1, y - s * 0.12, s * 2.2, s * 0.12);
    for (let i = -2; i <= 2; i++) g.fillRect(x + i * s * 0.42 - s * 0.04, y - s * 0.6, s * 0.08, s * 0.5);
    const roof = (cy, wd, ht) => { g.beginPath(); g.moveTo(x - wd, cy); g.quadraticCurveTo(x - wd * 0.6, cy - ht * 0.15, x - wd * 0.35, cy - ht * 0.75); g.lineTo(x + wd * 0.35, cy - ht * 0.75); g.quadraticCurveTo(x + wd * 0.6, cy - ht * 0.15, x + wd, cy); g.quadraticCurveTo(x + wd * 1.08, cy - ht * 0.32, x + wd * 1.14, cy - ht * 0.38); g.lineTo(x + wd * 0.9, cy + ht * 0.12); g.lineTo(x - wd * 0.9, cy + ht * 0.12); g.lineTo(x - wd * 1.14, cy - ht * 0.38); g.quadraticCurveTo(x - wd * 1.08, cy - ht * 0.32, x - wd, cy); g.fill(); };
    roof(y - s * 0.6, s * 1.25, s * 0.5); g.fillRect(x - s * 0.55, y - s * 1.25, s * 1.1, s * 0.35); roof(y - s * 1.22, s * 0.8, s * 0.45);
    g.globalCompositeOperation = ADD;
    for (let i = -2; i <= 1; i++) { const wx = x + (i + 0.5) * s * 0.42; dot(g, C.orange, wx, y - s * 0.32, s * 0.22, 0.55); g.fillStyle = 'rgba(255,190,110,.75)'; g.fillRect(wx - s * 0.1, y - s * 0.45, s * 0.2, s * 0.26); g.fillStyle = K.pav; }
    g.globalCompositeOperation = 'source-over';
    [[-1.2, -0.62], [1.2, -0.62], [-0.85, -1.24], [0.85, -1.24]].forEach(([dx, dy]) => lanterns.push([x + dx * s, y + dy * s + s * 0.1, s * 0.07]));
  };
  const buildLand = () => {
    const g = gLand; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, LW, H - LT);
    g.translate(PAD, -LT);
    R = seeded(11); lanterns = []; lotus = []; flowersT = [];
    const glowPts = [];
    const S = (Math.min(W, 2200) / 1440) * 1.35 + (mobile ? 0.35 : 0);
    // n\u00fai xa
    const far = ridge(-PAD, W + PAD, HZ - H * 0.11, H * 0.11, 3, 0.08);
    let gr = g.createLinearGradient(0, HZ - H * 0.2, 0, HZ); gr.addColorStop(0, K.far[0]); gr.addColorStop(1, K.far[1]);
    fillRidge(g, far, HZ + 2, gr);
    g.globalAlpha = 0.35; g.strokeStyle = K.rim; g.lineWidth = 1.2; g.beginPath(); far.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.globalAlpha = 1;
    // \u0111\u1ed3i gi\u1eefa + c\u00e2y
    const mid = ridge(-PAD, W + PAD, HZ - H * 0.025, H * 0.035, 5, 0.12);
    gr = g.createLinearGradient(0, HZ - H * 0.08, 0, HZ); gr.addColorStop(0, K.mid[0]); gr.addColorStop(1, K.mid[1]);
    fillRidge(g, mid, HZ + 2, gr);
    for (let i = 0; i < (mobile ? 18 : 40); i++) { const x = R() * W; tree(g, x, yAt(mid, x) + 4, rnd(30, 70) * S, K.tree, R() < 0.3 ? pick([C.blue, C.lilac, C.violet, C.pink]) : null, glowPts); }
    // v\u00e1ch \u0111\u00e1 ph\u1ea3i
    const cx0 = W * 0.84;
    g.fillStyle = K.rock; g.beginPath(); g.moveTo(cx0 - W * 0.05, HZ + 4);
    const rock = [[0, 0], [0.02, -0.1], [0.05, -0.16], [0.07, -0.24], [0.1, -0.21], [0.12, -0.3], [0.15, -0.27], [0.17, -0.2], [0.2, -0.22], [0.24, -0.12], [0.26, 0]];
    rock.forEach(([u, v]) => g.lineTo(cx0 + u * W * 0.75, HZ + v * H * 1.35)); g.closePath(); g.fill();
    g.globalAlpha = 0.25; g.strokeStyle = K.rockL; g.lineWidth = 1;
    for (let k = 0; k < 12; k++) { const u = rnd(0.03, 0.2), v = rnd(-0.22, -0.04); g.beginPath(); g.moveTo(cx0 + u * W * 0.75, HZ + v * H * 0.9); g.lineTo(cx0 + (u + rnd(-0.02, 0.02)) * W * 0.75, HZ + (v + rnd(0.03, 0.08)) * H * 0.9); g.stroke(); }
    g.globalAlpha = 1;
    // \u0111\u00ecnh
    const px = W * (mobile ? 0.66 : 0.68); pavilion(g, px, yAt(mid, px) + 6, 52 * S);
    // nh\u00e0 c\u1ed1i xay n\u01b0\u1edbc
    const mx = W * (mobile ? 0.2 : 0.17), my = HZ + 4;
    g.fillStyle = K.house; g.fillRect(mx - 10 * S, my - 64 * S, 96 * S, 64 * S);
    g.beginPath(); g.moveTo(mx - 22 * S, my - 60 * S); g.lineTo(mx + 38 * S, my - 98 * S); g.lineTo(mx + 98 * S, my - 60 * S); g.fill();
    g.globalCompositeOperation = ADD; g.fillStyle = 'rgba(255,180,100,.7)'; g.fillRect(mx + 40 * S, my - 46 * S, 16 * S, 14 * S); dot(g, C.orange, mx + 48 * S, my - 39 * S, 16 * S, 0.5); g.globalCompositeOperation = 'source-over';
    mill = { x: mx - 14 * S, y: my - 22 * S, r: 52 * S };
    // h\u1ed3
    lakeTop = HZ; lakeBot = HZ + H * (mobile ? 0.07 : 0.09);
    gr = g.createLinearGradient(0, lakeTop, 0, lakeBot); gr.addColorStop(0, K.lake[0]); gr.addColorStop(1, K.lake[1]);
    g.fillStyle = gr; g.fillRect(-PAD, lakeTop, W + PAD * 2, lakeBot - lakeTop + 4);
    g.save(); g.globalAlpha = 0.18; g.translate(0, HZ * 2); g.scale(1, -1); fillRidge(g, far, HZ, K.refl); g.restore();
    for (let i = 0; i < (mobile ? 8 : 14); i++) lotus.push([rnd(0.05, 0.6) * W, rnd(lakeTop + 8, lakeBot - 6), rnd(0, TAU)]);
    // \u0111\u1ea5t tr\u01b0\u1edbc + \u0111\u1ed3ng hoa
    groundPts = ridge(-PAD, W + PAD, lakeBot + H * 0.01, H * 0.018, 9, 0.2);
    gr = g.createLinearGradient(0, lakeBot, 0, H); gr.addColorStop(0, K.ground[0]); gr.addColorStop(0.4, K.ground[1]); gr.addColorStop(1, K.ground[2]);
    fillRidge(g, groundPts, H + 2, gr);
    g.strokeStyle = K.grass; g.lineWidth = 1.2;
    for (let x = -PAD; x < W + PAD; x += 3) { const y = yAt(groundPts, x); g.globalAlpha = 0.9; g.beginPath(); g.moveTo(x, y + 2); g.lineTo(x + rnd(-3, 3), y - rnd(2, 9) * S); g.stroke(); }
    g.globalAlpha = 1;
    // c\u00e2y hoa xanh ph\u00e1t s\u00e1ng l\u1edbn \u1edf hai b\u00ean
    tree(g, W * (mobile ? 0.02 : 0.05), H * 0.995, 190 * S, K.big, C.blue, glowPts);
    tree(g, W * (mobile ? 0.98 : 0.94), H * 0.99, 170 * S, K.big, C.lilac, glowPts);
    if (!mobile) tree(g, W * 0.3, lakeBot + H * 0.05, 70 * S, K.big, C.violet, glowPts);
    // \u0111i\u1ec3m s\u00e1ng t\u0129nh (hoa tr\u00ean c\u00e2y, \u0111\u1ed3ng hoa)
    g.globalCompositeOperation = ADD;
    glowPts.forEach(([x, y, r, c]) => { dot(g, c, x, y, r * 2.2, 0.32); if (R() < 0.08) dot(g, C.white, x, y, r * 1.1, 0.7, true); });
    const nF = Math.round((mobile ? 2600 : 7000) * Math.min(2.2, W * H / 1.3e6));
    for (let i = 0; i < nF; i++) {
      const x = R() * (W + PAD * 2) - PAD, top = yAt(groundPts, x), u = Math.pow(R(), 0.8), y = top + 4 + u * (H - top - 4);
      const persp = 0.4 + u * 1.6, c = pick([C.pink, C.pink, C.violet, C.lilac, C.white, C.rose]);
      dot(g, c, x, y, rnd(1.4, 3.4) * persp * S, rnd(0.45, 0.95));
      if (R() < 0.025) flowersT.push([x, y, rnd(2, 4) * persp * S, c, rnd(0, TAU)]);
    }
    g.globalCompositeOperation = 'source-over';
    deer = { x: W * (mobile ? 0.52 : 0.56), y: lakeBot - 2, s: 1.1 * S };
    g.setTransform(1, 0, 0, 1, 0, 0);
    R = Math.random;
  };

  // ---------- \u0111\u1ed1i t\u01b0\u1ee3ng \u0111\u1ed9ng tr\u00ean tr\u1eddi ----------
  let objs = [], parts = [], storm = 0, T = 0, moonState = null;
  const meteor = (big) => {
    const ang = (storm > 0 ? 2.45 : pick([2.45, 2.55, 0.62])) + rnd(-0.08, 0.08);
    const sp = rnd(700, 1300) * (big ? 1.2 : 1), x = rnd(-0.1, 1.2) * W, y = rnd(-0.15, 0.35) * HZ;
    objs.push({ k: 'm', x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, len: rnd(80, 260) * (big ? 1.7 : 1), w: rnd(1.2, 2.8) * (big ? 1.6 : 1), c: pick([C.white, C.white, C.cyan, C.pink, C.gold, C.green, C.lilac]), age: 0, life: rnd(0.6, 1.3) });
  };
  const comet = (x0, y0, x1, y1, dur, c, w) => objs.push({ k: 'c', x0: x0 * W, y0: y0 * HZ, x1: x1 * W, y1: y1 * HZ, dur, c, w: w || 1, age: 0, life: dur + 0.6 });
  const rainbow = (x0, y0, x1, y1, dur) => [C.pink, C.gold, C.cyan, C.violet, C.white].forEach((c, i) => objs.push({ k: 'c', x0: x0 * W, y0: y0 * HZ + (i - 2) * 16, x1: x1 * W, y1: y1 * HZ + (i - 2) * 16, dur: dur + i * 0.05, c, w: 1.5, soft: 1, age: 0, life: dur + 0.8 }));
  const heart = (fx, fy, s, c, c2) => {
    const cx = fx * W, cy = fy * HZ, n = Math.round((mobile ? 170 : 320) * (ultra() ? 1.3 : 1));
    for (let i = 0; i < n; i++) {
      const t = rnd(0, TAU), [hx, hy] = heartPt(t), fill = R() < 0.3 ? Math.sqrt(R()) : 1;
      parts.push({ k: 'h', sx: cx, sy: cy, tx: cx + hx * s * fill + rnd(-2, 2), ty: cy + hy * s * fill + rnd(-2, 2), c: R() < 0.22 ? (c2 || C.white) : c, r: rnd(2.6, 5.5), age: rnd(-0.05, 0), hold: rnd(1.6, 2.4), ph: rnd(0, TAU) });
    }
    parts.push({ k: 'flash', x: cx, y: cy, c, age: 0, life: 0.6, r: s * 14 });
    for (let i = 0; i < (mobile ? 30 : 60); i++) { const a = rnd(0, TAU), sp = rnd(160, 320) * s / 5; parts.push({ k: 'b', x: cx, y: cy, px: cx, py: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, c: R() < 0.5 ? C.white : c, age: 0, life: rnd(0.9, 1.5), r: rnd(1.2, 2.2) }); }
  };
  const burst = (fx, fy, c, n) => {
    const cx = fx * W, cy = fy * HZ; n = n || (mobile ? 110 : 200);
    for (let i = 0; i < n; i++) { const a = rnd(0, TAU), sp = rnd(120, 260) * (W / 1440 * 0.5 + 0.6); parts.push({ k: 'b', x: cx, y: cy, px: cx, py: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, c: R() < 0.25 ? C.white : c, age: 0, life: rnd(1.5, 2.4), r: rnd(2, 3.6) }); }
    parts.push({ k: 'flash', x: cx, y: cy, c, age: 0, life: 0.5, r: 200 });
  };
  const galaxy = (fx, fy, dur) => objs.push({ k: 'g', x: fx * W, y: fy * HZ, age: 0, life: dur, s: (mobile ? 0.55 : 0.8) * Math.max(0.7, W / 1440) });
  const moon = (fx, fy, dur) => { const o = { k: 'moon', x: fx * W, y: fy * HZ, age: 0, life: dur, s: (mobile ? 0.7 : 1) * Math.max(0.8, W / 1440) }; objs.push(o); moonState = o; };
  const chara = (fx, fy, dur) => objs.push({ k: 'chr', x: fx * W, y: fy * HZ, age: 0, life: dur, s: (mobile ? 1.1 : 1.6) * Math.max(0.8, W / 1440) });

  let galSprite = null, moonSprite = null;
  const makeGalaxy = () => {
    const s = document.createElement('canvas'); s.width = s.height = 512; const g = s.getContext('2d'); g.globalCompositeOperation = 'lighter';
    const q = g.createRadialGradient(256, 256, 0, 256, 256, 120); q.addColorStop(0, 'rgba(230,240,255,.9)'); q.addColorStop(0.3, 'rgba(120,170,255,.35)'); q.addColorStop(1, 'rgba(60,100,255,0)'); g.fillStyle = q; g.fillRect(0, 0, 512, 512);
    const r0 = seeded(5);
    for (let i = 0; i < 5200; i++) { const arm = i % 2, t = Math.pow(r0(), 0.75), rr = t * 240, th = arm * Math.PI + t * 4.4 + (r0() - 0.5) * 0.7 * (1 - t * 0.4), sp = (r0() - 0.5) * 26 * t; const x = 256 + Math.cos(th) * rr + Math.cos(th + 1.57) * sp, y = 256 + Math.sin(th) * rr + Math.sin(th + 1.57) * sp; const c = t < 0.2 ? [235, 240, 255] : t < 0.6 ? [140, 185, 255] : [100, 120, 255]; g.globalAlpha = 0.35 + 0.6 * (1 - t); g.drawImage(glow(c), x - 3.5, y - 3.5, 7, 7); }
    galSprite = s;
  };
  const makeMoon = () => {
    const s = document.createElement('canvas'); s.width = s.height = 256; const g = s.getContext('2d');
    const q = g.createRadialGradient(128, 128, 30, 128, 128, 128); q.addColorStop(0, 'rgba(255,230,170,.45)'); q.addColorStop(1, 'rgba(255,230,170,0)'); g.fillStyle = q; g.fillRect(0, 0, 256, 256);
    const m = document.createElement('canvas'); m.width = m.height = 256; const h = m.getContext('2d');
    const mg = h.createRadialGradient(110, 110, 4, 128, 128, 52); mg.addColorStop(0, '#fffbe8'); mg.addColorStop(1, '#ffd98a');
    h.fillStyle = mg; h.beginPath(); h.arc(128, 128, 50, 0, TAU); h.fill(); h.globalCompositeOperation = 'destination-out'; h.beginPath(); h.arc(150, 112, 46, 0, TAU); h.fill();
    g.drawImage(m, 0, 0); moonSprite = s;
  };

  const drawObj = (g, o, dt) => {
    o.age += dt; const u = o.age / o.life;
    if (o.k === 'm') {
      o.x += o.vx * dt; o.y += o.vy * dt;
      const env = Math.sin(Math.PI * Math.min(1, u)), d = Math.hypot(o.vx, o.vy), tx = o.x - o.vx / d * o.len, ty = o.y - o.vy / d * o.len;
      const gr = g.createLinearGradient(tx, ty, o.x, o.y); gr.addColorStop(0, `rgba(${o.c},0)`); gr.addColorStop(1, `rgba(${o.c},${env})`);
      g.globalAlpha = 1; g.strokeStyle = gr; g.lineWidth = o.w; g.lineCap = 'round'; g.beginPath(); g.moveTo(tx, ty); g.lineTo(o.x, o.y); g.stroke();
      dot(g, o.c, o.x, o.y, o.w * 6, env, true);
    } else if (o.k === 'c') {
      const p = Math.min(1, o.age / o.dur), e = 1 - Math.pow(1 - p, 2), x = o.x0 + (o.x1 - o.x0) * e, y = o.y0 + (o.y1 - o.y0) * e;
      const fade = o.age > o.dur ? Math.max(0, 1 - (o.age - o.dur) / 0.6) : Math.min(1, o.age / 0.15);
      const dx = o.x1 - o.x0, dy = o.y1 - o.y0, dl = Math.hypot(dx, dy), L = Math.min(dl * 0.55, 620 * Math.max(0.7, W / 1440)) * Math.min(1, p * 3 + 0.2);
      const tx = x - dx / dl * L, ty = y - dy / dl * L;
      [[44, 0.12], [18, 0.3], [7, 0.8], [2.6, 1]].forEach(([lw, al], i) => {
        const gr = g.createLinearGradient(tx, ty, x, y); const cc = i === 3 ? C.white : o.c;
        gr.addColorStop(0, `rgba(${cc},0)`); gr.addColorStop(0.7, `rgba(${cc},${al * 0.5})`); gr.addColorStop(1, `rgba(${cc},${al})`);
        g.globalAlpha = fade * (o.soft ? 0.7 : 1); g.strokeStyle = gr; g.lineWidth = lw * o.w * (o.soft ? 1.4 : 1); g.lineCap = 'round'; g.beginPath(); g.moveTo(tx, ty); g.lineTo(x, y); g.stroke();
      });
      if (p < 1) { dot(g, o.c, x, y, 60 * o.w, fade, true); dot(g, C.white, x, y, 18 * o.w, fade, true); for (let i = 0; i < (mobile ? 3 : 7); i++) parts.push({ k: 's', x: x + rnd(-6, 6), y: y + rnd(-6, 6), vx: -dx / dl * rnd(20, 90) + rnd(-25, 25), vy: -dy / dl * rnd(20, 90) + rnd(-25, 25), c: R() < 0.5 ? C.white : o.c, age: 0, life: rnd(0.6, 1.5), r: rnd(1.5, 3.5) }); }
    } else if (o.k === 'g') {
      const env = Math.min(1, o.age / 1.2, (o.life - o.age) / 1.2);
      g.save(); g.translate(o.x, o.y); g.scale(1, 0.55); g.rotate(o.age * 0.25 - 0.4); g.globalAlpha = env * 0.95; const s = 300 * o.s; g.drawImage(galSprite, -s, -s, s * 2, s * 2); g.restore();
      if (R() < 0.4 * env) parts.push({ k: 's', x: o.x + rnd(-160, 160) * o.s, y: o.y + rnd(-60, 60) * o.s, vx: 0, vy: 0, c: C.white, age: 0, life: rnd(0.4, 1), r: rnd(1, 2.5) });
    } else if (o.k === 'moon') {
      const env = Math.min(1, o.age / 1.4, (o.life - o.age) / 1.4), s = 150 * o.s, by = Math.sin(o.age * 0.8) * 4;
      g.globalAlpha = env; g.drawImage(moonSprite, o.x - s, o.y - s + by, s * 2, s * 2);
      const sx = o.x - s * 0.1, sy = o.y + s * 0.32 + by, hl = s * 0.55, sw = Math.sin(o.age * 1.6) * 0.15;
      const hx = sx + Math.sin(sw) * hl, hy = sy + Math.cos(sw) * hl;
      neon(g, C.white, 1.2, env * 0.8, (q) => { q.moveTo(sx, sy); q.lineTo(hx, hy); });
      neon(g, C.pink, 1.6, env, (q) => { for (let t = 0; t <= TAU + 0.01; t += 0.2) { const [a, b] = heartPt(t); const X = hx + a * 1.3 * o.s, Y = hy + 16 * o.s + b * 1.3 * o.s; t ? q.lineTo(X, Y) : q.moveTo(X, Y); } });
    } else if (o.k === 'chr') {
      const env = Math.min(1, o.age / 1, (o.life - o.age) / 1), s = o.s, x = o.x, y = o.y + Math.sin(o.age * 1.4) * 5, wv = Math.sin(o.age * 4) * 0.35;
      // tr\u00e1i tim b\u1eb1ng sao quanh nh\u00e2n v\u1eadt
      g.globalAlpha = 1;
      for (let i = 0; i < 70; i++) { const t = i / 70 * TAU, [a, b] = heartPt(t); const tw = 0.5 + 0.5 * Math.sin(o.age * 3 + i * 1.7); dot(g, C.white, x + a * 7.5 * s, y - 6 * s + b * 7.5 * s, (1.5 + tw * 2) * s * 0.8, env * (0.4 + tw * 0.6), true); }
      neon(g, C.blue, 2.4 * s, env, (q) => {
        q.moveTo(x - 26 * s, y - 4 * s); q.arc(x, y - 30 * s, 30 * s, Math.PI * 0.86, Math.PI * 2.14); q.quadraticCurveTo(x + 24 * s, y + 10 * s, x + 20 * s, y + 34 * s); q.lineTo(x - 20 * s, y + 34 * s); q.quadraticCurveTo(x - 24 * s, y + 10 * s, x - 26 * s, y - 4 * s);
        q.moveTo(x - 12 * s, y + 34 * s); q.lineTo(x - 13 * s, y + 46 * s); q.moveTo(x + 12 * s, y + 34 * s); q.lineTo(x + 13 * s, y + 46 * s);
        q.moveTo(x - 26 * s, y + 2 * s); q.quadraticCurveTo(x - 38 * s, y + 10 * s, x - 34 * s, y + 22 * s);
        q.moveTo(x + 26 * s, y); q.lineTo(x + 26 * s + Math.cos(-0.9 + wv) * 24 * s, y + Math.sin(-0.9 + wv) * 24 * s);
        q.moveTo(x - 9 * s, y - 24 * s); q.quadraticCurveTo(x, y - 17 * s, x + 9 * s, y - 24 * s);
      });
      neon(g, C.blue, 1.6 * s, env, (q) => { q.moveTo(x - 10 * s, y - 36 * s); q.arc(x - 10 * s, y - 36 * s, 2.5 * s, 0, TAU); q.moveTo(x + 10 * s, y - 36 * s); q.arc(x + 10 * s, y - 36 * s, 2.5 * s, 0, TAU); });
      dot(g, C.pink, x - 17 * s, y - 28 * s, 7 * s, env * 0.9); dot(g, C.pink, x + 17 * s, y - 28 * s, 7 * s, env * 0.9);
      const hx = x + 26 * s + Math.cos(-0.9 + wv) * 30 * s, hy = y + Math.sin(-0.9 + wv) * 30 * s;
      neon(g, C.pink, 1.6 * s, env, (q) => { for (let t = 0; t <= TAU + 0.01; t += 0.25) { const [a, b] = heartPt(t); const X = hx + a * 0.55 * s, Y = hy + b * 0.55 * s; t ? q.lineTo(X, Y) : q.moveTo(X, Y); } });
    }
    return o.age < o.life;
  };
  const drawPart = (g, p, dt) => {
    p.age += dt;
    if (p.k === 'h') {
      if (p.age < 0) return true;
      const e = 1 - Math.pow(1 - Math.min(1, p.age / 0.9), 3);
      let x = p.sx + (p.tx - p.sx) * e, y = p.sy + (p.ty - p.sy) * e, a = 1;
      const fall = p.age - 0.9 - p.hold;
      if (fall > 0) { y += 30 * fall * fall + 10 * fall; a = Math.max(0, 1 - fall / 1.3); }
      const tw = 0.6 + 0.4 * Math.sin(p.age * 9 + p.ph);
      dot(g, p.c, x, y, p.r * 3.4 * tw, a, true);
      return a > 0;
    }
    if (p.k === 'b') {
      const u = p.age / p.life, drag = Math.exp(-2.2 * dt); p.vx *= drag; p.vy = p.vy * drag + 70 * dt; p.px = p.x; p.py = p.y; p.x += p.vx * dt; p.y += p.vy * dt;
      const a = Math.max(0, 1 - u * u);
      g.globalAlpha = a * 0.6; g.strokeStyle = `rgba(${p.c},1)`; g.lineWidth = p.r * 0.8; g.beginPath(); g.moveTo(p.px - p.vx * 0.05, p.py - p.vy * 0.05); g.lineTo(p.x, p.y); g.stroke();
      dot(g, p.c, p.x, p.y, p.r * 3 * (0.6 + 0.4 * Math.sin(p.age * 20)), a, true);
      return u < 1;
    }
    if (p.k === 's') { p.x += p.vx * dt; p.y += p.vy * dt; const u = p.age / p.life; sparkle(g, p.c, p.x, p.y, p.r * (1 - u * 0.5), Math.sin(Math.PI * Math.min(1, u))); return u < 1; }
    if (p.k === 'flash') { const u = p.age / p.life; dot(g, p.c, p.x, p.y, p.r * (0.5 + u), (1 - u) * 0.6); return u < 1; }
    return false;
  };

  // k\u1ecbch b\u1ea3n l\u1eb7p 36 gi\u00e2y, c\u00e1c s\u1ef1 ki\u1ec7n ch\u1ed3ng nhau nh\u01b0 video
  const SCRIPT = [
    [0.2, () => { heart(0.34, 0.36, 5.2 * sc(), C.pink, C.white); heart(0.43, 0.36, 5.2 * sc(), C.cyan, C.white); comet(1.05, 0.02, 0.32, 0.44, 1.5, C.cyan, 1.2); }],
    [3, () => burst(0.18, 0.3, C.gold)],
    [5.5, () => { galaxy(0.2, 0.3, 8); heart(0.6, 0.28, 6 * sc(), C.rose, C.white); }],
    [7, () => comet(1.05, 0.05, 0.55, 0.5, 1.3, C.blue, 1)],
    [9.5, () => { burst(0.8, 0.22, C.pink); burst(0.7, 0.34, C.cyan); }],
    [12, () => { storm = 6.5; comet(0.95, -0.05, 0.25, 0.9, 1.8, C.teal, 1.5); }],
    [14.5, () => comet(1.1, 0.15, 0.6, 0.85, 1.4, C.cyan, 1.1)],
    [18.5, () => { moon(0.8, 0.2, 13); chara(0.42, 0.42, 8); }],
    [24, () => rainbow(-0.05, 0.05, 0.62, 0.6, 1.7)],
    [27, () => { heart(0.28, 0.32, 5.6 * sc(), C.red, C.orange); heart(0.36, 0.32, 5.6 * sc(), C.white, C.lilac); }],
    [30, () => { burst(0.55, 0.22, C.violet); setTimeout(() => burst(0.7, 0.3, C.gold), 400); setTimeout(() => burst(0.4, 0.26, C.green), 800); }],
    [32, () => { heart(0.62, 0.3, 6 * sc(), C.lilac, C.white); comet(1.05, 0.0, 0.4, 0.5, 1.4, C.cyan, 1.2); }],
  ];
  const sc = () => (mobile ? 3.4 : 4.2) * Math.max(0.8, Math.min(1.8, W / 1440)) / 4.2;
  let scriptT = 0, si = 0;

  // ---------- v\u1ebd l\u1edbp \u0111\u1ea5t \u0111\u1ed9ng ----------
  const drawLandFx = (t, dt) => {
    const g = gLfx; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, LW, H - LT);
    g.translate(PAD, -LT); g.globalCompositeOperation = ADD;
    // h\u1ed3: g\u1ee3n s\u00e1ng + b\u00f3ng tr\u0103ng
    for (let i = 0; i < (mobile ? 18 : 40); i++) { const k = (i * 97.13) % 1, x = ((k * W + t * 18 * (0.5 + k)) % (W + 60)) - 30, y = lakeTop + 4 + ((i * 0.618) % 1) * (lakeBot - lakeTop - 8), a = 0.15 + 0.15 * Math.sin(t * 2 + i); g.globalAlpha = a; g.fillStyle = K.shim; g.fillRect(x, y, 14 + (i % 5) * 6, 1); }
    if (moonState && moonState.age < moonState.life) { const env = Math.min(1, moonState.age / 1.4, (moonState.life - moonState.age) / 1.4); for (let y = lakeTop + 2; y < lakeBot; y += 3) { g.globalAlpha = env * 0.35 * (1 - (y - lakeTop) / (lakeBot - lakeTop)); g.fillStyle = K.moonR; const wv = Math.sin(y * 0.5 + t * 3) * 6; g.fillRect(moonState.x - 18 + wv, y, 36, 1.4); } }
    // sen ph\u00e1t s\u00e1ng
    lotus.forEach(([x, y, ph]) => { const a = 0.6 + 0.4 * Math.sin(t * 1.6 + ph); dot(g, C.cyan, x, y, 18, a * 0.7); dot(g, C.white, x, y - 2, 5, a, true); g.globalAlpha = a * 0.3; g.fillStyle = '#7ff'; g.fillRect(x - 10, y + 3, 20, 1); });
    // \u0111\u00e8n l\u1ed3ng
    lanterns.forEach(([x, y, r], i) => { const f = 0.75 + 0.25 * Math.sin(t * 7 + i * 2.1) * Math.sin(t * 3.3 + i); dot(g, C.orange, x, y, r * 7, f * 0.8); dot(g, [255, 90, 60], x, y, r * 2, 1, true); });
    // hoa l\u1ea5p l\u00e1nh
    flowersT.forEach(([x, y, r, c, ph]) => { const a = Math.max(0, Math.sin(t * 1.3 + ph)); if (a > 0.05) dot(g, c, x, y, r * 2.4 * a, a, true); });
    // h\u01b0\u01a1u neon
    if (deer) { const { x, y, s } = deer, a = 0.75 + 0.25 * Math.sin(t * 1.2); dot(g, C.lilac, x, y - 30 * s, 60 * s, 0.25 * a);
      neon(g, K.deer, 1.3 * s, a, (q) => { q.moveTo(x - 18 * s, y - 26 * s); q.quadraticCurveTo(x, y - 34 * s, x + 16 * s, y - 28 * s); q.lineTo(x + 22 * s, y - 44 * s); q.lineTo(x + 30 * s, y - 42 * s); q.moveTo(x + 16 * s, y - 28 * s); q.lineTo(x + 18 * s, y - 20 * s); q.lineTo(x - 16 * s, y - 18 * s); q.lineTo(x - 18 * s, y - 26 * s);
        q.moveTo(x - 14 * s, y - 18 * s); q.lineTo(x - 16 * s, y); q.moveTo(x - 8 * s, y - 18 * s); q.lineTo(x - 7 * s, y); q.moveTo(x + 10 * s, y - 20 * s); q.lineTo(x + 9 * s, y); q.moveTo(x + 16 * s, y - 20 * s); q.lineTo(x + 18 * s, y);
        q.moveTo(x + 24 * s, y - 44 * s); q.lineTo(x + 20 * s, y - 60 * s); q.lineTo(x + 14 * s, y - 68 * s); q.moveTo(x + 20 * s, y - 60 * s); q.lineTo(x + 28 * s, y - 66 * s); q.moveTo(x + 26 * s, y - 45 * s); q.lineTo(x + 34 * s, y - 58 * s); q.lineTo(x + 42 * s, y - 62 * s); q.moveTo(x + 34 * s, y - 58 * s); q.lineTo(x + 34 * s, y - 68 * s); }); }
    // \u0111om \u0111\u00f3m
    for (let i = 0; i < (mobile ? 18 : 42); i++) { const k = i * 0.618 % 1, x = (k * W + Math.sin(t * 0.4 + i) * 40), y = lakeBot - 10 + ((i * 0.37) % 1) * (H - lakeBot) * 0.8 + Math.cos(t * 0.5 + i * 2) * 14, a = Math.max(0, Math.sin(t * 1.5 + i * 3)); if (a > 0.05) dot(g, [210, 255, 140], x, y, 7 * a, a, true); }
    // c\u1ed1i xay n\u01b0\u1edbc quay
    if (mill) { g.globalCompositeOperation = 'source-over'; const { x, y, r } = mill, rot = t * 0.6; g.strokeStyle = K.wheel; g.lineWidth = Math.max(2, r * 0.06);
      g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke(); g.beginPath(); g.arc(x, y, r * 0.72, 0, TAU); g.stroke();
      for (let i = 0; i < 12; i++) { const a = rot + i * TAU / 12; g.beginPath(); g.moveTo(x + Math.cos(a) * r * 0.15, y + Math.sin(a) * r * 0.15); g.lineTo(x + Math.cos(a) * r * 1.08, y + Math.sin(a) * r * 1.08); g.stroke(); g.save(); g.translate(x + Math.cos(a) * r, y + Math.sin(a) * r); g.rotate(a); g.fillStyle = K.wheel; g.fillRect(-r * 0.12, -r * 0.05, r * 0.24, r * 0.1); g.restore(); }
      g.globalCompositeOperation = ADD; g.globalAlpha = 0.25; g.strokeStyle = K.wheelR; g.lineWidth = 1; g.beginPath(); g.arc(x, y, r * 1.02, -2.4, -0.6); g.stroke();
      for (let i = 0; i < 3; i++) dot(g, C.white, x + rnd(-r * 0.8, r * 0.8), y + r * rnd(0.9, 1.05), rnd(1, 3), 0.5, true); }
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  };

  // ---------- v\u00f2ng l\u1eb7p ----------
  let frameN = 0;
  const drawStars = () => {
    const g = gSt; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, HZ + 4); g.globalCompositeOperation = ADD;
    for (const s of starsT) { const tw = 0.45 + 0.55 * Math.sin(T * s.sp + s.ph); if (s.x4 && tw > 0.7) sparkle(g, s.c, s.x, s.y, s.r * 1.6 * tw, tw); else dot(g, s.c, s.x, s.y, s.r * 2.4, tw * 0.9, true); }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  };
  let last = 0, running = false, mLast = 0, mSum = 0, mN = 0, low = 0, calm = 0, lvl = 0, mxp = 0, myp = 0;
  const loop = (now) => {
    if (!running) return;
    requestAnimationFrame(loop);
    if (document.hidden) { last = 0; return; }
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now; T += dt;
    // \u0111o khung h\u00ecnh, h\u1ea1 t\u1ea3i t\u1eebng b\u01b0\u1edbc
    if (now > calm) { if (mLast) { mSum += now - mLast; mN++; } mLast = now; if (mN >= 120) { const fps = 1000 / (mSum / mN); mSum = mN = 0; low = fps < 36 ? low + 1 : 0; if (low >= 3 && lvl < 2) { low = 0; lvl++; dprCap = lvl === 1 ? 1.5 : 1; resize(true); } /* \u01b0u ti\u00ean gi\u1eef \u0111\u1ed9 n\u00e9t, ch\u1ec9 h\u1ea1 khi gi\u1eadt r\u00f5 */ } }
    // k\u1ecbch b\u1ea3n
    scriptT += dt; if (scriptT > 36) { scriptT -= 36; si = 0; }
    while (si < SCRIPT.length && SCRIPT[si][0] <= scriptT) { SCRIPT[si][1](); si++; }
    if (storm > 0) storm -= dt;
    const rate = (storm > 0 ? 55 : 3) * (ultra() ? 1.5 : 1) * (mobile ? 0.6 : 1) * (lvl ? 0.7 : 1);
    if (R() < rate * dt) meteor(R() < 0.15);
    if (R() < rate * dt * 0.5) meteor(false);
    // tr\u1eddi
    const g = gFx; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H); g.globalCompositeOperation = ADD;
    objs = objs.filter((o) => drawObj(g, o, dt));
    parts = parts.filter((p) => drawPart(g, p, dt));
    if (parts.length > 2600) parts.splice(0, parts.length - 2600);
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    // sao l\u1ea5p l\u00e1nh: 20 l\u1ea7n/gi\u00e2y; phong c\u1ea3nh \u0111\u1ed9ng: 30 l\u1ea7n/gi\u00e2y (chuy\u1ec3n \u0111\u1ed9ng ch\u1eadm, \u0111\u1ee7 m\u01b0\u1ee3t)
    frameN++;
    if (frameN % 3 === 0) drawStars();
    if (frameN % 2 === 0) drawLandFx(T, dt);
    // th\u1ecb sai theo chu\u1ed9t
    mxp += (tmx - mxp) * Math.min(1, dt * 2); myp += (tmy - myp) * Math.min(1, dt * 2);
    const lx = (-mxp * PAD * 0.8).toFixed(2), ly = (-myp * 6).toFixed(2);
    cLand.style.transform = cLandFx.style.transform = `translate3d(${lx}px,${ly}px,0)`;
    cStars.style.transform = cSky.style.transform = `translate3d(${(-mxp * 4).toFixed(2)}px,${(-myp * 3).toFixed(2)}px,0)`;
  };
  let tmx = 0, tmy = 0;
  addEventListener('pointermove', (e) => { tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; }, { passive: true });

  const resize = (force) => {
    const nw = innerWidth, nh = innerHeight, nd = Math.min(devicePixelRatio || 1, dprCap);
    if (!force && built && nw === W && Math.abs(nh - H) < 120 && nd === DPR) return; // b\u1ecf qua thanh \u0111\u1ecba ch\u1ec9 \u0111i\u1ec7n tho\u1ea1i co gi\u00e3n
    W = nw; H = nh; DPR = nd; HZ = H * (mobile ? 0.74 : 0.68); LT = Math.floor(H * 0.2); LW = W + PAD * 2;
    cSky.width = cSkyFx.width = cStars.width = Math.round(W * DPR); cSky.height = cSkyFx.height = cStars.height = Math.round(H * DPR);
    cLand.width = cLandFx.width = Math.round(LW * DPR); cLand.height = cLandFx.height = Math.round((H - LT) * DPR);
    [cLand, cLandFx].forEach((c) => { c.style.top = LT + 'px'; c.style.left = -PAD + 'px'; c.style.width = LW + 'px'; c.style.height = (H - LT) + 'px'; });
    buildSky(); buildLand(); built = true; calm = performance.now() + 2500;
  };
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (running || built) resize(); }, 200); });

  const still = () => { // gi\u1ea3m chuy\u1ec3n \u0111\u1ed9ng: m\u1ed9t khung t\u0129nh c\u00f3 tr\u0103ng, nh\u00e2n v\u1eadt v\u00e0 tim
    objs = []; parts = [];
    moon(0.8, 0.2, 99); chara(0.42, 0.42, 99); heart(0.3, 0.34, 5 * sc(), C.pink, C.white);
    parts.forEach((p) => { p.age = 1.5; }); objs.forEach((o) => { o.age = 2; });
    const g = gFx; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H); g.globalCompositeOperation = ADD;
    drawStars(); objs.forEach((o) => drawObj(g, o, 0)); parts.forEach((p) => drawPart(g, p, 0)); drawLandFx(1, 0);
  };
  const sync = () => {
    if (!galSprite) { makeGalaxy(); makeMoon(); }
    if (!built) { resize(true); if (reduce) still(); }
    window.__v9 = true;
    const on = !document.hidden && !reduce;
    if (on && !running) { running = true; last = 0; requestAnimationFrame(loop); }
    else if (!on && running) running = false;
  };
  document.addEventListener('visibilitychange', sync);

  const start = () => { const host = document.getElementById('v8-bg') || document.body; host.appendChild(box); sync(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 0);
})();
