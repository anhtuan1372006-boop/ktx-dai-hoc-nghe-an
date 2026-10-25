/* Hiệu ứng động: chỉ phủ chuyển động lên giao diện sẵn có, không đổi ảnh, màu hay bố cục.
   - Ảnh 3D/minh họa: zoom-trôi chậm (ảnh lớn), bồng bềnh (biểu tượng), "thở" (ảnh đại diện), vệt sáng quét qua.
   - Ảnh chụp người thật (nguồn NAU) giữ nguyên, không gắn hiệu ứng.
   - Banner, ảnh nền lớn: lớp hạt sáng lấp lánh, tia sáng xoay, vệt sáng, vòng năng lượng, sao băng (canvas).
   Hiệu ứng chỉ chạy khi phần tử nằm trong màn hình và tab đang mở. */
(function () {
  const REAL = /\/(ev_fair|ev_volley|ev_opening|mo_sport|mo_booth|mo_court)\.jpg/;
  const SKIP = /\/qr\.jpg/;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 760px)').matches;
  const rnd = (a, b) => a + Math.random() * (b - a);

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    e.target.classList.toggle('mx-vis', e.isIntersecting);
    if (e.target.__mxfx) e.target.__mxfx.vis = e.isIntersecting;
  }), { rootMargin: '120px' });

  // ---------- ảnh ----------
  const classify = (img) => {
    if (img.dataset.mx || img.closest('.modal-bg')) return;
    const src = img.getAttribute('src') || '';
    if (REAL.test(src) || SKIP.test(src)) { img.dataset.mx = 'real'; return; }
    const w = img.offsetWidth, h = img.offsetHeight;
    if (!w || !h) { if (!img.complete) img.addEventListener('load', () => classify(img), { once: true }); return; }
    const cs = getComputedStyle(img);
    const masked = (cs.maskImage && cs.maskImage !== 'none') || (cs.webkitMaskImage && cs.webkitMaskImage !== 'none');
    const round = parseFloat(cs.borderTopLeftRadius) >= Math.min(w, h) / 2 - 1;
    let k = /\/logo\.jpg/.test(src) ? 'logo' : (/\/(av_|photo_)/.test(src) || round) ? 'av' : (Math.max(w, h) < 170 || (Math.max(w, h) < 280 && !img.closest('.hcard, .pbanner, .phead, .hcta, .ready-art, .rooms-grid, .room-card, .gallery'))) ? 'ico' : 'scene';
    img.dataset.mx = k;
    img.classList.add('mx', 'mx-' + k);
    if (!masked && !img.closest('.nfoot')) img.classList.add('mx-glint');
    img.style.setProperty('--mx-d', (-Math.random() * 9).toFixed(2) + 's');
    io.observe(img);
  };

  // ---------- lớp hạt sáng (canvas) ----------
  const PAL_LIGHT = [[255, 196, 64], [255, 214, 120], [96, 170, 255], [255, 255, 255], [255, 120, 120]];
  const PAL_DARK = [[255, 214, 120], [150, 205, 255], [255, 255, 255]];
  const sprites = new Map();
  const sprite = (c, dark) => {
    const key = c.join() + dark;
    if (sprites.has(key)) return sprites.get(key);
    const s = document.createElement('canvas'); s.width = s.height = 64;
    const g = s.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.18, `rgba(${c},${dark ? 0.95 : 0.9})`);
    gr.addColorStop(0.45, `rgba(${c},${dark ? 0.35 : 0.28})`);
    gr.addColorStop(1, `rgba(${c},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    sprites.set(key, s); return s;
  };
  const fxs = [];
  class FX {
    constructor(layer, o) {
      this.o = o; this.layer = layer; this.vis = true;
      this.cv = layer.querySelector('canvas'); this.g = this.cv.getContext('2d');
      this.pal = o.dark ? PAL_DARK : PAL_LIGHT; this.p = []; this.t = 0;
      this.nextStreak = rnd(1.5, 4); this.nextRing = rnd(2, 5);
      this.ro = new ResizeObserver(() => this.size()); this.ro.observe(layer); this.size();
    }
    size() {
      const r = this.layer.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, mobile ? 1 : 1.5);
      this.w = r.width; this.h = r.height; this.cv.width = Math.max(1, r.width * dpr); this.cv.height = Math.max(1, r.height * dpr);
      this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.max = Math.round(Math.min(mobile ? 50 : 120, Math.max(16, (r.width * r.height) / 5200)) * (this.o.density || 1));
    }
    rx() { const [a, b] = this.o.region || [0, 1]; return rnd(a, b) * this.w; }
    spawn() {
      const c = this.pal[(Math.random() * this.pal.length) | 0];
      const r = Math.random();
      if (r < 0.5) this.p.push({ k: 'e', x: this.rx(), y: this.h + 10, vy: rnd(18, 60), sway: rnd(8, 30), ph: rnd(0, 6.3), s: rnd(6, 18), life: rnd(3, 7), a: 0, c });
      else if (r < 0.84) this.p.push({ k: 's', x: this.rx(), y: rnd(0.04, 0.96) * this.h, s: rnd(7, 17), rot: rnd(0, 1.6), life: rnd(0.8, 1.9), a: 0, c: Math.random() < 0.45 ? [255, 255, 255] : c });
      else this.p.push({ k: 'b', x: this.rx(), y: rnd(0.1, 0.9) * this.h, vx: rnd(-12, 12), vy: rnd(-10, 6), s: rnd(26, 70), life: rnd(4, 8), a: 0, c });
    }
    step(dt) {
      this.t += dt;
      while (this.p.length < this.max && Math.random() < 0.35) this.spawn();
      if (this.o.streaks && (this.nextStreak -= dt) <= 0) {
        this.nextStreak = rnd(1.8, 4.2);
        const x = this.rx() - this.w * 0.15, y = rnd(0, 0.35) * this.h, ang = rnd(0.35, 0.7);
        this.p.push({ k: 'l', x, y, vx: Math.cos(ang) * rnd(520, 760), vy: Math.sin(ang) * rnd(520, 760), life: rnd(0.55, 0.85), a: 0, c: [255, 222, 140] });
      }
      if (this.o.rings && (this.nextRing -= dt) <= 0) {
        this.nextRing = rnd(3.8, 6.5);
        const f = this.o.focus || [((this.o.region || [0, 1])[0] + 1) / 2, 0.5];
        this.p.push({ k: 'r', x: f[0] * this.w, y: f[1] * this.h, R: Math.min(this.w, this.h) * rnd(0.45, 0.7), life: 1.9, a: 0, c: [255, 210, 110] });
        this.p.push({ k: 'r', x: f[0] * this.w, y: f[1] * this.h, R: Math.min(this.w, this.h) * rnd(0.3, 0.45), life: 1.5, a: -0.25, c: [130, 190, 255] });
      }
      for (const q of this.p) {
        q.a += dt;
        if (q.k === 'e') { q.y -= q.vy * dt; q.x += Math.sin(q.ph + q.a * 1.3) * q.sway * dt; }
        if (q.k === 'l' || q.k === 'b') { q.x += q.vx * dt; q.y += q.vy * dt; }
      }
      this.p = this.p.filter((q) => q.a < q.life && q.y > -30);
    }
    draw() {
      const g = this.g; g.clearRect(0, 0, this.w, this.h);
      g.globalCompositeOperation = this.o.dark ? 'lighter' : 'source-over';
      for (const q of this.p) {
        if (q.a < 0) continue;
        const u = q.a / q.life, env = Math.sin(Math.PI * Math.min(1, u));
        if (q.k === 'e') {
          g.globalAlpha = env * 0.9; const s = q.s * (0.8 + 0.2 * Math.sin(q.a * 6 + q.ph));
          g.drawImage(sprite(q.c, this.o.dark), q.x - s, q.y - s, s * 2, s * 2);
        } else if (q.k === 's') {
          const s = q.s * env; g.globalAlpha = env;
          g.drawImage(sprite(q.c, this.o.dark), q.x - s * 0.9, q.y - s * 0.9, s * 1.8, s * 1.8);
          g.save(); g.translate(q.x, q.y); g.rotate(q.rot + q.a * 0.8);
          g.strokeStyle = `rgba(${q.c},${0.95 * env})`; g.lineWidth = 1.5; g.beginPath();
          g.moveTo(-s * 2.4, 0); g.lineTo(s * 2.4, 0); g.moveTo(0, -s * 2.4); g.lineTo(0, s * 2.4); g.stroke();
          g.lineWidth = 0.9; g.globalAlpha = env * 0.6; g.beginPath(); g.moveTo(-s, -s); g.lineTo(s, s); g.moveTo(s, -s); g.lineTo(-s, s); g.stroke(); g.restore();
        } else if (q.k === 'b') {
          g.globalAlpha = env * (this.o.dark ? 0.32 : 0.42);
          g.drawImage(sprite(q.c, this.o.dark), q.x - q.s, q.y - q.s, q.s * 2, q.s * 2);
        } else if (q.k === 'l') {
          const len = 210, d = Math.hypot(q.vx, q.vy), tx = q.x - (q.vx / d) * len, ty = q.y - (q.vy / d) * len;
          const gr = g.createLinearGradient(tx, ty, q.x, q.y);
          gr.addColorStop(0, `rgba(${q.c},0)`); gr.addColorStop(1, `rgba(${q.c},${0.95 * env})`);
          g.globalAlpha = 1; g.strokeStyle = gr; g.lineWidth = 2.8; g.lineCap = 'round';
          g.beginPath(); g.moveTo(tx, ty); g.lineTo(q.x, q.y); g.stroke();
          g.drawImage(sprite([255, 236, 180], this.o.dark), q.x - 16, q.y - 16, 32, 32);
        } else if (q.k === 'r') {
          const e = 1 - Math.pow(1 - u, 3);
          g.strokeStyle = `rgb(${q.c})`;
          for (const [w, al] of [[10, 0.16], [5, 0.3], [2, 0.95]]) { g.globalAlpha = (1 - u) * al; g.lineWidth = w * (1 - u) + 0.6; g.beginPath(); g.ellipse(q.x, q.y, q.R * e, q.R * e * 0.42, 0, 0, Math.PI * 2); g.stroke(); }
        }
      }
      g.globalAlpha = 1;
    }
  }
  let last = 0;
  const loop = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    for (let i = fxs.length - 1; i >= 0; i--) {
      const f = fxs[i];
      if (!f.layer.isConnected) { f.ro.disconnect(); fxs.splice(i, 1); continue; }
      if (!f.vis || document.hidden) continue;
      f.step(dt); f.draw();
    }
    requestAnimationFrame(loop);
  };

  // ---------- gắn lớp hiệu ứng vào các khung ảnh lớn ----------
  const HOSTS = [
    ['.hero', { mode: 'bg', rays: 1, sweep: 1, density: 1.25, region: [0.45, 1], focus: [0.74, 0.55], rings: 1, streaks: 1, parallax: 1 }],
    ['.auth-art', { mode: 'bg', rays: 1, sweep: 1, density: 1, region: [0, 1], focus: [0.5, 0.62], rings: 1, streaks: 1, parallax: 1 }],
    ['.auth-reg .right', { mode: 'bg', rays: 1, sweep: 1, density: 1, region: [0, 1], focus: [0.5, 0.6], rings: 1, streaks: 1, parallax: 1 }],
    ['.auth-forgot .art', { mode: 'bg', sweep: 1, density: 0.8, region: [0, 1], streaks: 1 }],
    ['.welcome', { mode: 'bg', sweep: 1, density: 0.8, region: [0.35, 1], streaks: 1 }],
    ['.pbanner', { mode: 'art', art: '.art', rays: 1, sweep: 1, density: 0.75, region: [0.45, 1], focus: [0.78, 0.5], rings: 1 }],
    ['.phead', { mode: 'art', art: '.art', sweep: 1, density: 0.6, region: [0.5, 1] }],
    ['.hcta', { mode: 'art', art: ':scope > img', rays: 1, sweep: 1, density: 0.9, region: [0.4, 1], focus: [0.72, 0.5], rings: 1, streaks: 1 }],
    ['.ready-art', { mode: 'art', art: 'img', sweep: 1, density: 0.7, region: [0.3, 1] }],
    ['.hcard', { mode: 'card', art: ':scope > img', sweep: 1, density: 0.5 }],
    ['.nfoot', { mode: 'top', dark: 1, density: 0.55, streaks: 1 }],
  ];
  const layerHTML = (o) => `${o.rays ? '<i class="mx-rays"></i>' : ''}${o.sweep ? '<i class="mx-sweep"></i>' : ''}<canvas></canvas>`;
  const attach = (el, o) => {
    if (el.__mxDone) return;
    let art = null;
    if (o.mode === 'art' || o.mode === 'card') {
      art = el.querySelector(o.art);
      if (!art || (art.tagName === 'IMG' && REAL.test(art.getAttribute('src') || ''))) return;
    }
    el.__mxDone = 1;
    const layer = document.createElement('div');
    layer.className = 'mx-fx mx-fx-' + o.mode; layer.setAttribute('aria-hidden', 'true'); layer.innerHTML = layerHTML(o);
    if (o.mode === 'bg') {
      el.classList.add('mx-host-bg');
      const bg = document.createElement('div'); bg.className = 'mx-bg'; bg.setAttribute('aria-hidden', 'true');
      el.prepend(bg, layer);
      if (o.parallax && matchMedia('(hover: hover)').matches) {
        el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); bg.style.setProperty('--mx-tx', ((e.clientX - r.left) / r.width - 0.5) * -16 + 'px'); bg.style.setProperty('--mx-ty', ((e.clientY - r.top) / r.height - 0.5) * -10 + 'px'); });
        el.addEventListener('pointerleave', () => { bg.style.setProperty('--mx-tx', '0px'); bg.style.setProperty('--mx-ty', '0px'); });
      }
    } else if (o.mode === 'top') {
      el.classList.add('mx-host-top'); el.prepend(layer);
    } else {
      if (getComputedStyle(el).position === 'static') el.classList.add('mx-host-rel');
      art.after(layer);
    }
    if (reduce) return;
    const f = new FX(layer, o); el.__mxfx = f; fxs.push(f); io.observe(el);
  };

  let queued = false;
  const scan = () => {
    queued = false;
    const app = document.getElementById('app'); if (!app) return;
    app.querySelectorAll('img:not([data-mx])').forEach(classify);
    for (const [sel, o] of HOSTS) app.querySelectorAll(sel).forEach((el) => attach(el, o));
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(scan); } };
  const start = () => {
    const app = document.getElementById('app'); if (!app) return;
    new MutationObserver(queue).observe(app, { childList: true, subtree: true });
    queue(); requestAnimationFrame(loop);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
