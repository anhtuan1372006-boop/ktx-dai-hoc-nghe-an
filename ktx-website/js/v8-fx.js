/* v8 — đồ họa "Lụa ánh sáng & Kính lỏng" (kiểu dáng: css/v8-fx.css, giao diện tối: css/dark.css).
   - Nền: shader WebGL dạng lụa chảy (biến dạng nhiễu nhiều tầng, dải bóng satin, hạt phim), theo chuột và tốc độ cuộn;
     gợn sóng lan ra khi đổi giao diện / bật nâng cấp; nhịp năng lượng khi chuyển trang.
   - Chuyển trang: View Transitions — trang cũ lùi sâu và mờ, trang mới tràn lên theo làn sóng mềm; đầu trang, thanh bên đứng yên.
   - Cuộn: tiêu đề trồi theo từng từ, khối nổi lên so le, ảnh mở màn + thu zoom, thị sai ảnh và ảnh nền.
   - Thẻ kính có viền và vệt sáng theo đèn chiếu con trỏ. Tự hạ tải khi máy yếu. */
(function () {
  const root = document.documentElement;
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* chế độ riêng tư */ } } };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 760px)').matches;
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ultra = () => root.dataset.ultra === 'on';
  const dark = () => root.dataset.theme === 'dark';
  const REAL = /\/(ev_fair|ev_volley|ev_opening|mo_sport|mo_booth|mo_court)\.jpg/;

  root.dataset.theme = store.get('ktx-theme') === 'dark' ? 'dark' : 'light';
  // giao diện sáng giữ nguyên giao diện gốc; kính và nền động chỉ có ở giao diện tối hoặc chế độ Nâng cấp
  const setFx = () => root.classList.toggle('fx', dark() || ultra());
  setFx(); new MutationObserver(setFx).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-ultra'] });
  root.dataset.ultra = store.get('ktx-ultra') === 'on' ? 'on' : 'off';

  // ================= nền lụa WebGL =================
  const bg = document.createElement('div'); bg.id = 'v8-bg'; bg.setAttribute('aria-hidden', 'true');
  bg.innerHTML = '<div class="v8-fb"></div><canvas></canvas>';
  const cv = bg.querySelector('canvas');
  const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R; uniform float T, S, E, D, U; uniform vec2 M; uniform vec3 RP;
float h(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++) { v += a * n(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p; a *= .5; } return v; }
void main(){
  float k = min(R.x, R.y);
  vec2 p = (gl_FragCoord.xy - .5 * R) / k;
  float t = T * .045 + S * .00018;
  float ring = 0.;
  if (RP.z >= 0.) { vec2 dv = p - RP.xy; float d = length(dv); ring = exp(-pow((d - RP.z * 1.3) * 6.5, 2.)) * (1. - smoothstep(0., 1.9, RP.z)); p += dv / (d + .001) * ring * .07; }
  float md = length(p - M);
  vec2 q = vec2(fbm(p * .7 + vec2(0., t)), fbm(p * .7 + vec2(5.2, 1.3) - t * .8));
  vec2 w = vec2(fbm(p * .8 + 2.2 * q + vec2(1.7, 9.2) + t * 1.2), fbm(p * .8 + 2.2 * q + vec2(8.3, 2.8) - t));
  w += (M - p) * .22 * exp(-md * md * 2.5);
  float f = fbm(p * .65 + 2.6 * w + E * .25);
  float rib = .5 + .5 * sin((p.x * .9 - p.y * .5 + f * 3.2 + t * 5.) * 3.14159);
  float sheen = pow(rib, 10.), soft = pow(rib, 2.5);
  vec3 a0 = mix(vec3(.945, .962, 1.), vec3(.018, .035, .10), D);
  vec3 a1 = mix(vec3(.70, .81, 1.), vec3(.07, .17, .50), D);
  vec3 a2 = mix(vec3(.985, .80, .87), vec3(.42, .06, .24), D);
  vec3 a3 = mix(vec3(.80, .77, 1.), vec3(.24, .12, .58), D);
  vec3 a4 = mix(vec3(.995, .90, .80), vec3(.02, .42, .66), D);
  vec3 col = mix(a0, a1, smoothstep(.28, .8, f) * (.9 + .1 * D));
  col = mix(col, a3, smoothstep(.38, .9, w.y) * (.85 - .1 * D));
  col = mix(col, a2, smoothstep(.5, .95, w.x) * (.8 - .1 * D));
  col = mix(col, a4, smoothstep(.5, .9, q.y) * (.55 - .1 * D));
  col = mix(col, col + .07, soft * .5 * (1. - D));
  col *= 1. - (1. - D) * .03 * (1. - soft);
  vec3 hl = mix(vec3(1.), vec3(.55, .72, 1.), D);
  col += hl * sheen * (.22 + .3 * D) * smoothstep(.2, .8, f);
  vec3 cw = cos(6.2832 * (f * 1.3 + rib * .35 + vec3(0., .33, .67) + t * .6));
  vec3 iri = mix(.74 + .26 * cw, .5 + .5 * cw, D);
  col = mix(col, mix(col, iri, .5 + .25 * D), U * (.22 + .5 * soft));
  col += U * hl * sheen * .3;
  col += mix(vec3(.05, .07, .12), vec3(.18, .26, .6), D) * exp(-md * md * 7.) * (1. + U);
  col += ring * mix(vec3(.45, .55, 1.), vec3(.6, .75, 1.), D) * (.6 + .5 * U);
  col += E * .06 * sheen;
  col *= 1. - D * .35 * smoothstep(.5, 1.5, length(p));
  col += (h(gl_FragCoord.xy + fract(T) * 317.) - .5) * (.014 + .04 * D);
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}`;
  let gl = null, prog = null, U_ = {}, scale = mobile ? 0.45 : 0.6, W = 0, H = 0;
  const st = { d: dark() ? 1 : 0, u: ultra() ? 1 : 0, mx: 0, my: 0, tmx: 0, tmy: 0, e: 0, rp: [0, 0, -1], rt0: 0, sy: scrollY, lastSy: scrollY, cap: 60 };
  const initGL = () => {
    try { gl = cv.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' }); } catch (e) { gl = null; }
    if (!gl) return false;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
    const vs = sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['R', 'T', 'S', 'E', 'D', 'U', 'M', 'RP'].forEach((k) => { U_[k] = gl.getUniformLocation(prog, k); });
    cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); gl = null; bg.classList.remove('gl'); });
    return true;
  };
  const size = () => { W = innerWidth; H = innerHeight; cv.width = Math.max(2, Math.round(W * scale)); cv.height = Math.max(2, Math.round(H * scale)); if (gl) gl.viewport(0, 0, cv.width, cv.height); };
  const toP = (x, y) => { const k = Math.min(W, H); return [(x - W / 2) / k, (H / 2 - y) / k]; };
  const ripple = (x, y) => { const [px, py] = toP(x, y); st.rp = [px, py, 0]; st.rt0 = performance.now(); };
  const pulse = (v) => { st.e = Math.min(1.6, st.e + v); };

  // đo khung hình thật và hạ tải từng bước
  let mLast = 0, mSum = 0, mN = 0, lite = 0, low = 0, calm = performance.now() + 4000;
  const meter = (t) => {
    if (t < calm || document.hidden) { mLast = 0; return; }
    if (mLast) { mSum += t - mLast; mN++; }
    mLast = t;
    if (mN < 120) return;
    const fps = 1000 / (mSum / mN); mSum = mN = 0;
    low = fps < 45 ? low + 1 : 0;
    if (low >= 2 && lite < 3) {
      low = 0; lite++;
      if (lite === 1) { scale = mobile ? 0.34 : 0.42; size(); }
      else if (lite === 2) root.classList.add('v8-lite');
      else st.cap = 30;
    }
  };
  let tPrev = 0, last = 0;
  const frame = (t) => {
    requestAnimationFrame(frame);
    meter(t);
    if (!gl || document.hidden) return;
    if (st.cap < 60 && t - last < 1000 / st.cap - 2) return;
    const dt = Math.min(0.05, (t - (tPrev || t)) / 1000); tPrev = t; last = t;
    st.d += ((dark() ? 1 : 0) - st.d) * Math.min(1, dt * 3.2);
    st.u += ((ultra() ? 1 : 0) - st.u) * Math.min(1, dt * 2.4);
    if (window.__v9 || window.__v10 || st.d < 0.01) return; // giao diện tối: nền Đêm sao phủ kín; giao diện sáng: không có nền động
    st.mx += (st.tmx - st.mx) * Math.min(1, dt * 2.5); st.my += (st.tmy - st.my) * Math.min(1, dt * 2.5);
    const v = Math.abs(scrollY - st.lastSy); st.lastSy = scrollY; st.e += (Math.min(1, v / 60) - st.e) * Math.min(1, dt * 2);
    st.sy += (scrollY - st.sy) * Math.min(1, dt * 4);
    const rt = st.rp[2] >= 0 ? (t - st.rt0) / 1000 : -1; if (rt > 2.2) st.rp[2] = -1;
    gl.uniform2f(U_.R, cv.width, cv.height); gl.uniform1f(U_.T, reduce ? 20 : t / 1000 * (1 + st.u * 0.6)); gl.uniform1f(U_.S, st.sy);
    gl.uniform1f(U_.E, st.e); gl.uniform1f(U_.D, st.d); gl.uniform1f(U_.U, st.u); gl.uniform2f(U_.M, st.mx, st.my);
    gl.uniform3f(U_.RP, st.rp[0], st.rp[1], rt);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // ================= chuyển trang =================
  let navBusy = false;
  const wrapGo = () => {
    if (!window.App || App.__v8) return; App.__v8 = 1;
    const go0 = App.go;
    App.go = (tok, opts) => {
      if (!document.startViewTransition || reduce || navBusy || (opts && opts.keepScroll) || tok === App.route) return go0(tok, opts);
      navBusy = true; root.classList.add('v8-nav'); pulse(1.2); freshNav = true;
      let vt;
      try { vt = document.startViewTransition(() => go0(tok, opts)); } catch (e) { navBusy = false; root.classList.remove('v8-nav'); return go0(tok, opts); }
      vt.finished.finally(() => { root.classList.remove('v8-nav'); navBusy = false; });
    };
  };

  // ================= cuộn: chữ, khối, ảnh =================
  const SPLIT = '.hero h1, .pbanner h1, .phead h1, .welcome h1, .hs-head h2, .psec-t, .content > h1, .v4-title, .hcta h2, .auth-art h1, .auth-form h1, .gpage h2';
  const UP = ['.content > *', '.grid > *', '.hcards > *', '.amen-grid > *', '.rtiles > *', '.ups > *', '.spaces > *', '.faq > details', '.hfaq > details', '.psec-in > *', '.ready-art', '.life-ic > *', '.steps-band > .stepc', '.nfoot-in > *', '.kpis > *', '.contact-list > *', '.steps-mini > *', '.sim-grid > *', '.hero-cta > *', '.hs-head > p', '.card'];
  const GLASS = '.card, .stat:not(.pink):not(.blue):not(.cream), .hcard, .momcard, .amen-card, .rtile, .up, .space, .faq details, .hfaq details, .contact-form, .steps-band';
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('v8-in'); io.unobserve(el); countUp(el);
    if (el.classList.contains('v8-img')) setTimeout(() => el.classList.add('v8-done'), 2400);
  }), { rootMargin: '0px 0px 10% 0px', threshold: 0 });
  // ảnh đang bị clip-path che kín không được IntersectionObserver báo là hiện ra -> theo dõi khung chứa của ảnh
  const imgMap = new WeakMap();
  const imgIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    (imgMap.get(e.target) || []).forEach((im) => { im.classList.add('v8-in'); setTimeout(() => im.classList.add('v8-done'), 2400); });
    imgIO.unobserve(e.target);
  }), { rootMargin: '0px 0px 10% 0px', threshold: 0 });
  const seen = new IntersectionObserver((es) => es.forEach((e) => { e.isIntersecting ? vis.add(e.target) : vis.delete(e.target); }), { rootMargin: '200px' });
  const vis = new Set();

  const split = (hd) => {
    if (hd.dataset.v8s) return; hd.dataset.v8s = 1;
    let wi = 0;
    [...hd.childNodes].forEach((nd) => {
      if (nd.nodeType !== 3 || !nd.textContent.trim()) return;
      const box = document.createElement('span'); box.className = 'v8-ws';
      nd.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { box.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span'); w.className = 'v8-w'; w.innerHTML = '<i></i>'; w.firstChild.textContent = part; w.style.setProperty('--wi', wi++); box.appendChild(w);
      });
      nd.replaceWith(box);
    });
    hd.classList.add('v8-split');
  };
  const countUp = (el) => {
    if (reduce) return;
    el.querySelectorAll('.stat .val, .kpis .num').forEach((nm) => {
      if (nm.dataset.v8c) return; nm.dataset.v8c = 1;
      const txt = nm.textContent.trim(), m = txt.match(/^(\d[\d.]*)(\s*\/\s*\d[\d.]*)?(.*)$/);
      if (!m || m[3].length > 3) return;
      const end = +m[1].replace(/\./g, ''); if (!end || end > 1e7) return;
      const dots = m[1].includes('.'), t0 = performance.now(), dur = 1400;
      const step = (t) => { const u = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - u, 4))); nm.textContent = (dots ? v.toLocaleString('vi-VN') : v) + (m[2] || '') + m[3]; if (u < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  };
  const clipped = (el) => { for (let p = el.parentElement, i = 0; p && i < 2; p = p.parentElement, i++) { const o = getComputedStyle(p).overflow; if (/hidden|clip/.test(o)) return true; } return false; };

  let route = null, freshNav = false;
  const scan = () => {
    const app = document.getElementById('app'); if (!app) return;
    const r = (location.hash || '#').split('?')[0], fresh = r !== route;
    const viaVT = fresh && freshNav; freshNav = false;
    if (fresh && route !== null && !viaVT && !reduce) { app.classList.remove('v8-enter'); void app.offsetWidth; app.classList.add('v8-enter'); setTimeout(() => app.classList.remove('v8-enter'), 1000); pulse(0.8); }
    if (fresh) calm = performance.now() + 2500;
    route = r;
    const base = viaVT ? 0.32 : 0.08;
    let k = 0;
    const delayFor = (el) => { const b = el.getBoundingClientRect(); if (b.top < innerHeight) return base + Math.min(k++, 7) * 0.06; const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0; return (sib % 4) * 0.08; };
    // tiêu đề
    app.querySelectorAll(SPLIT).forEach((hd) => {
      if (hd.dataset.v8s) return;
      if (!fresh || reduce) { hd.dataset.v8s = 1; return; }
      split(hd); hd.style.setProperty('--rd', delayFor(hd) + 's'); io.observe(hd);
    });
    // khối
    const cands = new Set(); UP.forEach((s) => app.querySelectorAll(s).forEach((el) => { if (!el.dataset.v8u) cands.add(el); }));
    cands.forEach((el) => {
      el.dataset.v8u = 1;
      if (!fresh || reduce || el.closest('.modal-bg') || el.offsetHeight > innerHeight * 1.5 || el.matches(SPLIT)) return;
      for (let p = el.parentElement; p && p !== app; p = p.parentElement) if (p.classList.contains('v8-up')) return;
      el.classList.add('v8-up'); el.style.setProperty('--rd', delayFor(el) + 's'); io.observe(el);
    });
    // ảnh
    app.querySelectorAll('img:not([data-v8i])').forEach((im) => {
      im.dataset.v8i = 1;
      const src = im.getAttribute('src') || '', w = im.offsetWidth, h = im.offsetHeight;
      if (REAL.test(src) || w < 150 || h < 90 || im.closest('.side, .pub-h, .top, .brand, .modal-bg, .lb')) return;
      if (parseFloat(getComputedStyle(im).borderTopLeftRadius) >= Math.min(w, h) / 2 - 1) return;
      const cl = clipped(im);
      if (cl && im.closest('.hcard, .momcard, .space, .hcard-ph, .room-card, .rcard')) { im.classList.add('v8-par'); seen.observe(im); }
      if (!fresh || reduce) return;
      im.classList.add('v8-img'); if (cl) im.classList.add('v8-sc');
      const pb = im.getBoundingClientRect(); im.style.setProperty('--rd', (pb.top < innerHeight ? base + 0.12 : 0.05) + 's');
      const host = im.parentElement; imgMap.set(host, (imgMap.get(host) || []).concat(im)); imgIO.observe(host);
    });
    // kính + đèn chiếu
    app.querySelectorAll(GLASS).forEach((el) => {
      if (el.dataset.v8g) return; el.dataset.v8g = 1;
      if (el.closest('.modal-bg')) return;
      if (getComputedStyle(el).backgroundImage !== 'none') return;
      el.classList.add('v8-glass'); seen.observe(el);
    });
    // ảnh nền banner (v6 tạo .mx-bg), chữ hero
    hero = app.querySelector('.hero, .auth-art'); heroBg = hero && hero.querySelector('.mx-bg'); heroTxt = hero && hero.querySelector('.hero-in, .txt');
    onScroll();
  };
  let queued = false, hero = null, heroBg = null, heroTxt = null;
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; scan(); }); } };

  // cuộn: thị sai + tiến độ
  const progress = document.createElement('div'); progress.id = 'v8-progress';
  let sQueued = false;
  const onScroll = () => {
    if (sQueued) return; sQueued = true;
    requestAnimationFrame(() => {
      sQueued = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
      if (reduce) return;
      vis.forEach((el) => {
        if (!el.classList.contains('v8-par')) return;
        const b = el.getBoundingClientRect(); const c = (b.top + b.height / 2 - innerHeight / 2) / innerHeight;
        el.style.setProperty('--py', (Math.max(-1, Math.min(1, c)) * -22).toFixed(1) + 'px');
      });
      if (hero && heroBg) { const y = Math.min(scrollY, innerHeight); heroBg.style.setProperty('--hy', (y * 0.32).toFixed(1) + 'px'); if (heroTxt) { heroTxt.style.setProperty('--ty', (y * 0.16).toFixed(1) + 'px'); heroTxt.style.setProperty('--to', Math.max(0, 1 - y / 520).toFixed(3)); } }
    });
  };
  addEventListener('scroll', onScroll, { passive: true });

  // đèn chiếu con trỏ trên kính + nút hút nhẹ (nâng cấp)
  let px = -9999, py = -9999, pQueued = false; const lit = new Set();
  addEventListener('pointermove', (e) => {
    px = e.clientX; py = e.clientY;
    const k = Math.min(W, H) || 1; st.tmx = (px - W / 2) / k; st.tmy = (H / 2 - py) / k;
    if (pQueued || !hover) return; pQueued = true;
    requestAnimationFrame(() => {
      pQueued = false;
      const R2 = ultra() ? 420 : 340;
      lit.forEach((el) => { if (!vis.has(el)) { el.style.removeProperty('--lx'); el.style.removeProperty('--ly'); lit.delete(el); } });
      vis.forEach((el) => {
        if (!el.classList.contains('v8-glass')) return;
        const b = el.getBoundingClientRect();
        if (px < b.left - R2 || px > b.right + R2 || py < b.top - R2 || py > b.bottom + R2) { if (lit.has(el)) { el.style.removeProperty('--lx'); el.style.removeProperty('--ly'); lit.delete(el); } return; }
        el.style.setProperty('--lx', (px - b.left).toFixed(0) + 'px'); el.style.setProperty('--ly', (py - b.top).toFixed(0) + 'px'); lit.add(el);
      });
      document.querySelectorAll('.v8-mag').forEach((b) => { b.style.translate = ''; b.classList.remove('v8-mag'); });
      if (ultra()) {
        const b = document.elementFromPoint(px, py); const btn = b && b.closest && b.closest('#app .btn');
        if (btn) { const r = btn.getBoundingClientRect(); btn.classList.add('v8-mag'); btn.style.translate = `${((px - r.left) / r.width - 0.5) * 7}px ${((py - r.top) / r.height - 0.5) * 5}px`; }
      }
    });
  }, { passive: true });

  // ================= nút: giao diện tối + nâng cấp tối đa =================
  const ICON = {
    sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>',
    ultra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"/></svg>',
  };
  const dock = document.createElement('div'); dock.id = 'v8-dock';
  dock.innerHTML = `<button type="button" class="v8-theme">${ICON.sun}${ICON.moon}</button><button type="button" class="v8-ultra">${ICON.ultra}<span></span></button>`;
  const tb = dock.querySelector('.v8-theme'), ub = dock.querySelector('.v8-ultra');
  const label = () => {
    tb.title = dark() ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'; tb.setAttribute('aria-label', tb.title); tb.setAttribute('aria-pressed', dark());
    ub.title = ultra() ? 'Tắt Nâng cấp tối đa' : 'Bật Nâng cấp tối đa'; ub.setAttribute('aria-label', ub.title); ub.setAttribute('aria-pressed', ultra());
    ub.querySelector('span').textContent = ultra() ? 'Ultra' : 'Nâng cấp';
  };
  const swap = (btn, apply) => {
    const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    root.style.setProperty('--vx', x + 'px'); root.style.setProperty('--vy', y + 'px');
    root.style.setProperty('--vmax-r', Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))) + 'px');
    ripple(x, y); pulse(0.6);
    if (!document.startViewTransition || reduce) { apply(); return; }
    root.classList.add('v8-swap');
    try { document.startViewTransition(apply).finished.finally(() => root.classList.remove('v8-swap')); } catch (e) { root.classList.remove('v8-swap'); apply(); }
  };
  tb.addEventListener('click', () => swap(tb, () => { root.dataset.theme = dark() ? 'light' : 'dark'; store.set('ktx-theme', root.dataset.theme); label(); }));
  ub.addEventListener('click', () => swap(ub, () => { root.dataset.ultra = ultra() ? 'off' : 'on'; store.set('ktx-ultra', root.dataset.ultra); label(); }));
  label();

  const start = () => {
    document.body.prepend(bg); document.body.appendChild(progress); document.body.appendChild(dock);
    if (initGL()) bg.classList.add('gl');
    size(); addEventListener('resize', size);
    requestAnimationFrame(frame);
    wrapGo();
    root.classList.add('v8-rv');
    const app = document.getElementById('app');
    if (app) new MutationObserver(queue).observe(app, { childList: true, subtree: true });
    queue();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
