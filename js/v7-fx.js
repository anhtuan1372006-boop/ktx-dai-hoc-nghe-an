/* v7 \u2014 n\u00e2ng c\u1ea5p \u0111\u1ed3 h\u1ecda to\u00e0n trang (ki\u1ec3u d\u00e1ng: css/v7-fx.css, giao di\u1ec7n t\u1ed1i: css/dark.css).
   - N\u1ec1n nhi\u1ec1u l\u1edbp: c\u1ef1c quang, l\u01b0\u1edbi 3D, tr\u01b0\u1eddng sao 3D c\u00f3 \u0111\u01b0\u1eddng n\u1ed1i (canvas), kh\u1ed1i k\u00ednh 3D, h\u1ea1t nhi\u1ec5u.
   - Th\u1ebb k\u00ednh trong su\u1ed1t; xu\u1ea5t hi\u1ec7n 3D khi cu\u1ed9n; chuy\u1ec3n trang c\u00f3 v\u1ec7t s\u00e1ng; nghi\u00eang th\u1ebb + \u00e1nh ph\u1ea3n chi\u1ebfu theo chu\u1ed9t; \u0111\u1ebfm s\u1ed1.
   - N\u00fat Giao di\u1ec7n t\u1ed1i v\u00e0 N\u00e2ng c\u1ea5p t\u1ed1i \u0111a (c\u00f3 m\u00e0n bi\u1ebfn h\u00ecnh), l\u01b0u l\u1ef1a ch\u1ecdn trong tr\u00ecnh duy\u1ec7t. */
(function () {
  const root = document.documentElement;
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ch\u1ebf \u0111\u1ed9 ri\u00eang t\u01b0 */ } } };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 760px)').matches;
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ultra = () => root.dataset.ultra === 'on';
  const dark = () => root.dataset.theme === 'dark';

  root.classList.add('v7');
  root.dataset.theme = store.get('ktx-theme') === 'dark' ? 'dark' : 'light';
  root.dataset.ultra = store.get('ktx-ultra') === 'on' ? 'on' : 'off';

  // ---------- l\u1edbp n\u1ec1n ----------
  const bg = document.createElement('div');
  bg.id = 'v7-bg'; bg.setAttribute('aria-hidden', 'true');
  const shape = (cls, x, y, s, t, k, faces, extra) => `<div class="v7-shape ${cls} ${extra || ''}" style="--x:${x};--y:${y};--s:${s}px;--t:${t}s;--k:${k}"><b>${'<i></i>'.repeat(faces)}</b></div>`;
  bg.innerHTML = '<div class="v7-base"></div><div class="v7-aurora"><i></i><i></i><i></i><i></i><i></i></div><div class="v7-grid"></div><canvas class="v7-stars"></canvas>'
    + '<div class="v7-shapes">'
    + shape('v7-cube', '4%', '24%', 92, 26, 0.18, 6)
    + shape('v7-ring', '90%', '30%', 120, 22, 0.32, 3)
    + shape('v7-pyr', '86%', '74%', 84, 30, 0.12, 4)
    + shape('v7-orb', '8%', '78%', 110, 1, 0.26, 0)
    + shape('v7-cube', '46%', '8%', 60, 20, 0.4, 6, 'ux')
    + shape('v7-ring', '24%', '52%', 150, 34, 0.08, 3, 'ux')
    + shape('v7-pyr', '64%', '44%', 70, 24, 0.22, 4, 'ux')
    + shape('v7-orb', '72%', '14%', 80, 1, 0.5, 0, 'ux')
    + '</div><div class="v7-noise"></div><div class="v7-vignette"></div>';
  const progress = document.createElement('div'); progress.id = 'v7-progress';

  // ---------- tr\u01b0\u1eddng sao 3D ----------
  const cv = bg.querySelector('.v7-stars'), g = cv.getContext('2d');
  let W = 0, H = 0, DPR = 1, pts = [], mx = 0, my = 0, tmx = 0, tmy = 0, rotY = 0, warp = 0, lastScroll = scrollY, quality = 1;
  const PAL = { light: [[29, 91, 216], [220, 31, 46], [34, 195, 238], [124, 77, 255], [255, 176, 32]], dark: [[93, 141, 255], [255, 77, 120], [34, 211, 238], [167, 139, 250], [255, 196, 64]] };
  const count = () => Math.round((mobile ? 50 : 100) * (ultra() ? 1.6 : 1) * quality);
  const sprites = {};
  const sprite = (c) => { const k = c.join(); if (sprites[k]) return sprites[k]; const s = document.createElement('canvas'); s.width = s.height = 48; const x = s.getContext('2d'), gr = x.createRadialGradient(24, 24, 0, 24, 24, 24); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.28, `rgba(${c},.85)`); gr.addColorStop(1, `rgba(${c},0)`); x.fillStyle = gr; x.fillRect(0, 0, 48, 48); return (sprites[k] = s); };
  const seed = () => { const n = count(); pts = []; for (let i = 0; i < n; i++) pts.push({ x: rnd(-1, 1), y: rnd(-1, 1), z: rnd(-1, 1), c: (Math.random() * 5) | 0, s: rnd(0.6, 1.8), tw: rnd(0, 6.3) }); };
  const size = () => { DPR = Math.min(devicePixelRatio || 1, mobile ? 1 : 1.5); W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; g.setTransform(DPR, 0, 0, DPR, 0, 0); };
  let t0 = performance.now(), odd = false;
  // \u0111o t\u1ed1c \u0111\u1ed9 khung h\u00ecnh th\u1eadt; n\u1ebfu d\u01b0\u1edbi ~40 khung/gi\u00e2y th\u00ec h\u1ea1 t\u1ea3i t\u1eebng b\u01b0\u1edbc
  let mLast = 0, mSum = 0, mN = 0, lite = 0, low = 0, calm = performance.now() + 4000;
  const meter = (t) => {
    if (t < calm) { mLast = 0; return; } // b\u1ecf qua l\u00fac t\u1ea3i trang / chuy\u1ec3n trang
    if (mLast) { mSum += t - mLast; mN++; }
    mLast = t;
    if (mN < 120) return;
    const fps = 1000 / (mSum / mN); mSum = mN = 0;
    low = fps < 40 ? low + 1 : 0;
    if (low >= 2 && lite < 2) { low = 0; lite++; if (lite === 1) root.classList.add('v7-lite'); else { root.classList.add('v7-lite2'); quality = 0.6; seed(); } }
  };
  App.v7Calm = () => { calm = performance.now() + 2500; };
  document.addEventListener('visibilitychange', () => { mLast = 0; mSum = mN = 0; });
  const draw = (t) => {
    requestAnimationFrame(draw);
    if (document.hidden || reduce) return;
    meter(t);
    if ((odd = !odd)) return; // 30 khung/gi\u00e2y l\u00e0 \u0111\u1ee7 m\u01b0\u1ee3t cho tr\u01b0\u1eddng sao tr\u00f4i ch\u1eadm
    const dt = Math.min(0.08, (t - t0) / 1000); t0 = t;
    // t\u1ef1 h\u1ea1 ch\u1ea5t l\u01b0\u1ee3ng khi m\u00e1y y\u1ebfu
    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    const sv = scrollY - lastScroll; lastScroll = scrollY; warp += (Math.min(40, Math.abs(sv)) / 40 - warp) * 0.08;
    rotY += dt * (ultra() ? 0.09 : 0.045);
    const cy = Math.cos(rotY + mx * 0.4), sy = Math.sin(rotY + mx * 0.4), cx = Math.cos(my * 0.3), sx = Math.sin(my * 0.3);
    const pal = dark() ? PAL.dark : PAL.light, fov = Math.min(W, H) * 0.9;
    g.clearRect(0, 0, W, H);
    const proj = [];
    for (const p of pts) {
      p.z -= dt * (0.04 + warp * 0.9 + (ultra() ? 0.05 : 0)); if (p.z < -1) { p.z += 2; p.x = rnd(-1, 1); p.y = rnd(-1, 1); }
      let x = p.x * cy - p.z * sy, z = p.x * sy + p.z * cy; let y = p.y * cx - z * sx; z = p.y * sx + z * cx;
      const d = 1 / (z + 2.2), X = W / 2 + x * fov * d, Y = H / 2 + y * fov * d;
      proj.push([X, Y, d, p]);
    }
    const link = (ultra() ? 0.2 : 0.16) * Math.min(W, H) * (mobile ? 1.1 : 1);
    if (quality > 0.5) {
      g.lineWidth = 0.7;
      for (let i = 0; i < proj.length; i++) for (let j = i + 1; j < proj.length; j++) {
        const a = proj[i], b = proj[j], dx = a[0] - b[0], dy = a[1] - b[1], dd = dx * dx + dy * dy;
        if (dd < link * link) { const c = pal[a[3].c]; g.strokeStyle = `rgba(${c},${(1 - Math.sqrt(dd) / link) * (dark() ? 0.32 : 0.2) * Math.min(a[2], b[2]) * 2})`; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
      }
    }
    g.globalCompositeOperation = dark() ? 'lighter' : 'source-over';
    for (const [X, Y, d, p] of proj) {
      const c = pal[p.c], r = p.s * d * (ultra() ? 5 : 3.6), tw = 0.6 + 0.4 * Math.sin(t / 500 + p.tw);
      const al = Math.min(1, d * 1.4) * tw * (dark() ? 1 : 0.75);
      if (warp > 0.15) { g.strokeStyle = `rgba(${c},${al * warp})`; g.lineWidth = r * 0.8; g.beginPath(); g.moveTo(X, Y); g.lineTo(X + (X - W / 2) * warp * 0.08, Y + (Y - H / 2) * warp * 0.08); g.stroke(); }
      g.globalAlpha = al; g.drawImage(sprite(c), X - r * 3, Y - r * 3, r * 6, r * 6); g.globalAlpha = 1;
    }
    g.globalCompositeOperation = 'source-over';
  };

  // ---------- con tr\u1ecf ph\u00e1t s\u00e1ng (ch\u1ebf \u0111\u1ed9 n\u00e2ng c\u1ea5p) ----------
  let cur = null, cg = null, trail = [], halo = { x: -100, y: -100 };
  const cursorLayer = () => {
    if (cur || !hover || reduce) return;
    cur = document.createElement('canvas'); cur.id = 'v7-cursor'; document.body.appendChild(cur); cg = cur.getContext('2d');
    const rs = () => { cur.width = innerWidth * DPR; cur.height = innerHeight * DPR; cg.setTransform(DPR, 0, 0, DPR, 0, 0); }; rs(); addEventListener('resize', rs);
    const loop = (t) => {
      requestAnimationFrame(loop);
      cg.clearRect(0, 0, innerWidth, innerHeight);
      if (!ultra() || document.hidden) { trail.length = 0; return; }
      halo.x += (lastX - halo.x) * 0.18; halo.y += (lastY - halo.y) * 0.18;
      cg.globalCompositeOperation = 'lighter';
      for (const q of trail) { q.a += 0.016; q.x += q.vx; q.y += q.vy; q.vy += 0.02; }
      trail = trail.filter((q) => q.a < q.l);
      for (const q of trail) { const k = 1 - q.a / q.l; const gr = cg.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.r * 3); gr.addColorStop(0, `hsla(${q.h},100%,75%,${k})`); gr.addColorStop(1, `hsla(${q.h},100%,60%,0)`); cg.fillStyle = gr; cg.beginPath(); cg.arc(q.x, q.y, q.r * 3, 0, 7); cg.fill(); }
      const h = (t / 12) % 360;
      cg.strokeStyle = `hsla(${h},100%,65%,.85)`; cg.lineWidth = 2; cg.beginPath(); cg.arc(halo.x, halo.y, 18 + Math.sin(t / 200) * 2, 0, 7); cg.stroke();
      const gr = cg.createRadialGradient(halo.x, halo.y, 0, halo.x, halo.y, 46); gr.addColorStop(0, `hsla(${h + 60},100%,70%,.28)`); gr.addColorStop(1, 'hsla(0,0%,100%,0)'); cg.fillStyle = gr; cg.beginPath(); cg.arc(halo.x, halo.y, 46, 0, 7); cg.fill();
      cg.globalCompositeOperation = 'source-over';
    };
    requestAnimationFrame(loop);
  };
  let lastX = -100, lastY = -100;
  addEventListener('pointermove', (e) => {
    tmx = (e.clientX / innerWidth - 0.5) * 2; tmy = (e.clientY / innerHeight - 0.5) * 2;
    if (ultra() && cur && e.pointerType === 'mouse') { const sp = Math.hypot(e.clientX - lastX, e.clientY - lastY); for (let i = 0; i < Math.min(4, 1 + sp / 12); i++) trail.push({ x: e.clientX, y: e.clientY, vx: rnd(-0.8, 0.8), vy: rnd(-1.2, 0.4), r: rnd(1.5, 3.6), h: (performance.now() / 12 + rnd(0, 90)) % 360, a: 0, l: rnd(0.5, 1) }); }
    lastX = e.clientX; lastY = e.clientY;
  }, { passive: true });

  // ---------- cu\u1ed9n: ti\u1ebfn \u0111\u1ed9 + th\u1ecb sai kh\u1ed1i 3D ----------
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
    bg.style.setProperty('--sy', scrollY.toFixed(0));
  };
  addEventListener('scroll', onScroll, { passive: true });
  bg.querySelectorAll('.v7-shape').forEach((s) => { s.style.translate = '0 calc(var(--sy, 0) * var(--k) * -1px)'; });

  // ---------- xu\u1ea5t hi\u1ec7n 3D khi cu\u1ed9n ----------
  const RV = ['.content > *', '.grid > *', '.hcards > *', '.amen-grid > *', '.rtiles > *', '.ups > *', '.spaces > *', '.faq > details', '.hfaq > details', '.psec-in > *', '.hs-head', '.ready-art', '.life-ic > *', '.steps-band > .stepc', '.nfoot-in > *', '.kpis > *', '.contact-list > *', '.steps-mini > *', '.sim-grid > *', '.room-grid > *', '.rooms-list > *', '.card'];
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('v7-in'); io.unobserve(e.target); countUp(e.target); } }), { rootMargin: '0px 0px 12% 0px', threshold: 0 });
  const vis = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('v7-on', e.isIntersecting)));
  let route = null;
  const reveal = (fresh) => {
    const app = document.getElementById('app');
    const cands = new Set(); RV.forEach((s) => app.querySelectorAll(s).forEach((el) => { if (!el.classList.contains('v7-seen')) cands.add(el); }));
    let k = 0;
    cands.forEach((el) => {
      el.classList.add('v7-seen');
      if (el.closest('.modal-bg') || el.offsetHeight > innerHeight * 1.6) return;
      let p = el.parentElement, nested = false;
      while (p && p !== app) { if (cands.has(p) && p.classList.contains('v7-rv')) { nested = true; break; } p = p.parentElement; }
      if (nested && !el.parentElement.matches('.grid, .hcards, .amen-grid, .rtiles, .ups, .spaces, .faq, .hfaq, .kpis, .steps-mini, .sim-grid, .life-ic, .contact-list')) return;
      if (!fresh) return;
      el.classList.add('v7-rv'); const r = el.getBoundingClientRect();
      el.style.setProperty('--rd', (r.top < innerHeight ? Math.min(k++, 10) * 0.06 : (el.parentElement.children.length > 1 ? Array.prototype.indexOf.call(el.parentElement.children, el) % 6 * 0.07 : 0)) + 's');
      io.observe(el);
    });
  };
  // \u0111\u1ebfm s\u1ed1 (th\u1ebb th\u1ed1ng k\u00ea)
  const countUp = (el) => {
    if (reduce) return;
    el.querySelectorAll('.stat .val, .kpis .num, .stat-v, .big-num').forEach((n) => {
      if (n.dataset.v7c) return; n.dataset.v7c = 1;
      const txt = n.textContent.trim(), m = txt.match(/^(\d[\d.]*)(\s*\/\s*\d[\d.]*)?(.*)$/);
      if (!m || m[3].length > 3) return;
      const end = +m[1].replace(/\./g, ''); if (!end || end > 1e7) return;
      const dots = m[1].includes('.'), st = performance.now(), dur = 1200;
      const step = (t) => { const u = Math.min(1, (t - st) / dur), v = Math.round(end * (1 - Math.pow(1 - u, 3))); n.textContent = (dots ? v.toLocaleString('vi-VN') : v) + (m[2] || '') + m[3]; if (u < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  };

  // ---------- nghi\u00eang th\u1ebb + \u00e1nh ph\u1ea3n chi\u1ebfu ----------
  const TILT = '.card, .stat, .hcard, .momcard, .amen-card, .rtile, .up, .stepc, .space, .room-card, .rcard';
  const bindTilt = () => {
    document.querySelectorAll('#app ' + TILT.split(', ').join(', #app ')).forEach((el) => {
      if (el.dataset.v7t) return; el.dataset.v7t = 1;
      const big = el.offsetHeight > 380 || el.querySelector('input, textarea, select, table, canvas');
      if (getComputedStyle(el).backgroundImage === 'none') el.classList.add('v7-glare');
      if (getComputedStyle(el).position === 'static') el.classList.add('v7-pos');
      if (el.matches('.card, .stat:not(.pink):not(.blue):not(.cream), .hcard, .momcard, .amen-card, .rtile, .up')) el.classList.add('v7-ringed');
      vis.observe(el);
      if (!hover) return;
      if (!big) el.classList.add('v7-tilt');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); el.style.setProperty('--gy', (py * 100).toFixed(1) + '%'); el.style.setProperty('--ga', ultra() ? 0.38 : 0.22);
        if (big || reduce) return;
        const tl = parseFloat(getComputedStyle(root).getPropertyValue('--v7-tilt')) || 5;
        el.classList.add('v7-hot');
        el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * tl).toFixed(2)}deg) rotateY(${((px - 0.5) * tl).toFixed(2)}deg) translateZ(${ultra() ? 14 : 6}px)`;
      });
      el.addEventListener('pointerleave', () => { el.classList.remove('v7-hot'); el.style.transform = ''; el.style.setProperty('--ga', 0); });
    });
  };
  // n\u00fat h\u00fat theo con tr\u1ecf (ch\u1ebf \u0111\u1ed9 n\u00e2ng c\u1ea5p)
  document.addEventListener('pointermove', (e) => {
    if (!ultra() || !hover) return;
    const b = e.target.closest && e.target.closest('#app .btn');
    document.querySelectorAll('.v7-mag').forEach((x) => { if (x !== b) { x.style.translate = ''; x.classList.remove('v7-mag'); } });
    if (!b) return;
    const r = b.getBoundingClientRect(); b.classList.add('v7-mag');
    b.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 8}px ${((e.clientY - r.top) / r.height - 0.5) * 6}px`;
  }, { passive: true });

  // ---------- chuy\u1ec3n trang ----------
  const wipe = () => {
    if (reduce) return;
    const w = document.createElement('div'); w.id = 'v7-wipe'; w.innerHTML = '<i></i><i></i>'; document.body.appendChild(w);
    setTimeout(() => w.remove(), 1100);
  };
  let queued = false;
  const onRender = () => {
    queued = false;
    const app = document.getElementById('app'); if (!app) return;
    const r = (location.hash || '#').split('?')[0];
    const fresh = r !== route;
    if (fresh && route !== null) { app.classList.remove('v7-enter'); void app.offsetWidth; app.classList.add('v7-enter'); setTimeout(() => app.classList.remove('v7-enter'), 1000); wipe(); }
    route = r; if (fresh) App.v7Calm();
    reveal(fresh); bindTilt(); onScroll();
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(onRender); } };

  // ---------- m\u00e0n bi\u1ebfn h\u00ecnh ----------
  const morph = (on, done) => {
    if (reduce) { done(); return; }
    const m = document.createElement('div'); m.id = 'v7-morph';
    m.innerHTML = `<canvas></canvas><div class="v7-title">${on ? 'N\u00c2NG C\u1ea4P T\u1ed0I \u0110A' : 'GIAO DI\u1ec6N TI\u00caU CHU\u1ea8N'}<small>${on ? 'ULTRA MODE \u00b7 \u0110\u00c3 K\u00cdCH HO\u1ea0T' : '\u0110\u00c3 TR\u1ede V\u1ec0'}</small></div>`;
    document.body.appendChild(m);
    const c = m.querySelector('canvas'), x = c.getContext('2d'), w = innerWidth, h = innerHeight, d = Math.min(devicePixelRatio || 1, 1.5);
    c.width = w * d; c.height = h * d; x.setTransform(d, 0, 0, d, 0, 0);
    const cx = w / 2, cy = h / 2, R = Math.hypot(w, h) / 2, N = mobile ? 160 : 340, T = on ? 2300 : 1400;
    const ps = []; for (let i = 0; i < N; i++) { const a = rnd(0, 6.283), r = rnd(R * 0.5, R * 1.1); ps.push({ a, r, h: rnd(0, 360), s: rnd(1, 3), sp: rnd(0.6, 1.4) }); }
    let swapped = false; const st = performance.now(); m.classList.add('go');
    const frame = (t) => {
      const u = Math.min(1, (t - st) / T);
      x.clearRect(0, 0, w, h);
      const dim = u < 0.12 ? u / 0.12 : u > 0.62 ? Math.max(0, 1 - (u - 0.62) / 0.38) : 1;
      x.fillStyle = `rgba(4,8,26,${0.82 * dim})`; x.fillRect(0, 0, w, h);
      x.globalCompositeOperation = 'lighter';
      const conv = Math.min(1, u / 0.42), boom = Math.max(0, (u - 0.42) / 0.58);
      // v\u00f2ng con quay h\u1ed3i chuy\u1ec3n \u1edf t\u00e2m
      for (let k = 0; k < 3; k++) {
        x.save(); x.translate(cx, cy); x.rotate(t / (300 + k * 120) * (k % 2 ? -1 : 1)); x.scale(1, 0.35 + k * 0.2);
        x.strokeStyle = `hsla(${(t / 8 + k * 120) % 360},100%,65%,${0.8 * (1 - boom)})`; x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 40 + conv * 70 + k * 26, 0, 6.283); x.stroke(); x.restore();
      }
      const core = x.createRadialGradient(cx, cy, 0, cx, cy, 30 + conv * 120);
      core.addColorStop(0, `rgba(255,255,255,${0.9 * (1 - boom)})`); core.addColorStop(0.4, `rgba(124,77,255,${0.5 * (1 - boom)})`); core.addColorStop(1, 'rgba(34,211,238,0)');
      x.fillStyle = core; x.beginPath(); x.arc(cx, cy, 30 + conv * 120, 0, 6.283); x.fill();
      for (const p of ps) {
        const rr = boom > 0 ? p.r * (1 - conv) * 0 + boom * R * 1.3 * p.sp : p.r * (1 - conv * 0.96);
        const a = p.a + (boom > 0 ? 0 : conv * 2.4 * p.sp);
        const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr, al = boom > 0 ? 1 - boom : 0.4 + conv * 0.6;
        x.strokeStyle = `hsla(${p.h},100%,70%,${al})`; x.lineWidth = p.s;
        x.beginPath(); x.moveTo(px, py); x.lineTo(px - Math.cos(a) * (boom > 0 ? 26 : 10) * p.sp, py - Math.sin(a) * (boom > 0 ? 26 : 10) * p.sp); x.stroke();
      }
      if (boom > 0) {
        for (let k = 0; k < 3; k++) { const br = boom * R * (1.1 - k * 0.22); x.strokeStyle = `hsla(${(k * 110 + 190) % 360},100%,70%,${(1 - boom) * 0.9})`; x.lineWidth = 6 * (1 - boom) + 1; x.beginPath(); x.arc(cx, cy, br, 0, 6.283); x.stroke(); }
        x.fillStyle = `rgba(255,255,255,${Math.max(0, 0.85 - boom * 3)})`; x.fillRect(0, 0, w, h);
        if (!swapped) { swapped = true; done(); }
      }
      x.globalCompositeOperation = 'source-over';
      if (u < 1) requestAnimationFrame(frame); else m.remove();
    };
    requestAnimationFrame(frame);
  };

  // ---------- thanh \u0111i\u1ec1u khi\u1ec3n ----------
  const ICON = {
    sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/><path d="M17 3.5l.6 1.6 1.6.6-1.6.6L17 7.9l-.6-1.6-1.6-.6 1.6-.6z"/></svg>',
    ultra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l2.2 5.6 5.8.5-4.4 3.8 1.4 5.8L12 15.1l-5 3.1 1.4-5.8L4 8.6l5.8-.5z"/><path d="M19 17.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8zM4.5 2.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4L2.5 4.5l1.4-.6z"/></svg>',
  };
  const dock = document.createElement('div'); dock.id = 'v7-dock';
  dock.innerHTML = `<button type="button" class="v7-theme">${ICON.sun}${ICON.moon}</button><button type="button" class="v7-ultra">${ICON.ultra}</button>`;
  const tb = dock.querySelector('.v7-theme'), ub = dock.querySelector('.v7-ultra');
  const label = () => {
    tb.dataset.tip = dark() ? 'Giao di\u1ec7n s\u00e1ng' : 'Giao di\u1ec7n t\u1ed1i'; tb.setAttribute('aria-label', tb.dataset.tip); tb.setAttribute('aria-pressed', dark());
    ub.dataset.tip = ultra() ? 'T\u1eaft n\u00e2ng c\u1ea5p t\u1ed1i \u0111a' : 'N\u00e2ng c\u1ea5p t\u1ed1i \u0111a'; ub.setAttribute('aria-label', ub.dataset.tip); ub.setAttribute('aria-pressed', ultra());
  };
  tb.addEventListener('click', (e) => {
    const apply = () => { root.dataset.theme = dark() ? 'light' : 'dark'; store.set('ktx-theme', root.dataset.theme); label(); };
    if (!document.startViewTransition || reduce) return apply();
    const r = tb.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] }, { duration: 750, easing: 'cubic-bezier(.6,.05,.25,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
  });
  ub.addEventListener('click', () => {
    const on = !ultra();
    morph(on, () => {
      root.dataset.ultra = on ? 'on' : 'off'; store.set('ktx-ultra', root.dataset.ultra); label(); seed();
      if (on) cursorLayer();
      document.querySelectorAll('#app .v7-rv').forEach((el, i) => { el.classList.remove('v7-in'); el.style.setProperty('--rd', (Math.min(i, 14) * 0.05) + 's'); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('v7-in')); });
    });
  });
  label();

  const start = () => {
    document.body.prepend(bg); document.body.appendChild(progress); document.body.appendChild(dock);
    size(); seed(); addEventListener('resize', () => { size(); });
    requestAnimationFrame(draw);
    if (ultra()) cursorLayer();
    root.classList.add('v7-rv-on');
    const app = document.getElementById('app');
    if (app) new MutationObserver(queue).observe(app, { childList: true, subtree: true });
    queue();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
