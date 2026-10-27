/* v11 \u2014 ho\u00e0n thi\u1ec7n cho ch\u1ea1y th\u1eadt: trang 404, in / l\u01b0u PDF t\u00e0i li\u1ec7u, b\u00e1o m\u1ea5t m\u1ea1ng, ph\u00edm t\u1eaft t\u00ecm ki\u1ebfm, li\u00ean k\u1ebft b\u1ecf qua t\u1edbi n\u1ed9i dung,
   \u0111\u00e1nh d\u1ea5u m\u1ee5c \u0111ang ch\u1ecdn cho tr\u00ecnh \u0111\u1ecdc m\u00e0n h\u00ecnh; c\u00f9ng c\u00e1c hi\u1ec7u \u1ee9ng 3D gi\u1eef \u0111\u00fang phong c\u00e1ch giao di\u1ec7n:
   th\u1ebb nghi\u00eang theo con tr\u1ecf c\u00f3 v\u1ec7t s\u00e1ng, g\u1ee3n s\u00f3ng khi b\u1ea5m n\u00fat, s\u1ed1 m\u1ee5c l\u1eadt nh\u01b0 \u0111\u1ed3ng xu, minh h\u1ecda n\u1ed5i kh\u1ed1i khi r\u00ea chu\u1ed9t,
   ch\u1eef \u0111\u1ea7u trang nghi\u00eang nh\u1eb9 theo chu\u1ed9t, h\u1ed9p tho\u1ea1i / menu / th\u00f4ng b\u00e1o m\u1edf ra theo chi\u1ec1u s\u00e2u (ki\u1ec3u d\u00e1ng: css/v11.css). */
(function () {
  const K = window.KTX, { esc, ic } = App;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ================= trang 404 =================
  App.pages['khong-tim-thay'] = {
    title: 'Kh\u00f4ng t\u00ecm th\u1ea5y trang',
    render: (bad) => `${App.pubHeader('')}
      <section class="nf404"><div class="nf404-in">
        <div class="nf404-txt">
          <span class="eyebrow">L\u1ed7i 404</span>
          <h1>Kh\u00f4ng t\u00ecm th\u1ea5y trang<br>b\u1ea1n \u0111ang t\u00ecm.</h1>
          <p>\u0110\u01b0\u1eddng d\u1eabn <code>#${esc(String(bad || '').slice(0, 60))}</code> kh\u00f4ng t\u1ed3n t\u1ea1i ho\u1eb7c \u0111\u00e3 \u0111\u01b0\u1ee3c \u0111\u1ed5i t\u00ean. B\u1ea1n c\u00f3 th\u1ec3 quay l\u1ea1i trang ch\u1ee7 ho\u1eb7c ch\u1ecdn m\u1ed9t m\u1ee5c b\u00ean d\u01b0\u1edbi.</p>
          <div class="hero-cta"><a href="#" class="btn btn-red" data-go="trang-chu">${ic('house')}V\u1ec1 trang ch\u1ee7</a><a href="#" class="btn btn-outline" data-v11-back>${ic('arrow-left')}Quay l\u1ea1i trang tr\u01b0\u1edbc</a></div>
          <div class="nf404-links">${[['phong-o', 'bed-double', 'T\u00ecm ph\u00f2ng \u1edf'], ['tien-ich', 'sparkles', 'Ti\u1ec7n \u00edch'], ['su-kien', 'calendar-days', 'S\u1ef1 ki\u1ec7n'], ['huong-dan', 'book-open-check', 'H\u01b0\u1edbng d\u1eabn & h\u1ecfi \u0111\u00e1p'], ['tra-cuu', 'file-search', 'Tra c\u1ee9u h\u1ed3 s\u01a1'], ['dang-nhap', 'log-in', '\u0110\u0103ng nh\u1eadp']].map(([g, i, t]) => `<a href="#" data-go="${g}"><span class="amen-ic blue">${ic(i)}</span>${t}</a>`).join('')}</div>
        </div>
        <div class="nf404-art" aria-hidden="true"><b>4</b><img src="${K.A('logo')}" alt=""><b>4</b></div>
      </div></section>
      ${App.pubFooter()}`,
    mount: (root) => {
      App.bindPubNav && App.bindPubNav(root); App.bindFooter && App.bindFooter(root);
      const b = root.querySelector('[data-v11-back]'); if (b) b.onclick = (e) => { e.preventDefault(); history.length > 1 ? history.back() : App.go('trang-chu'); };
    },
  };

  // ================= in / l\u01b0u PDF =================
  App.printEl = (el, title) => {
    const sheet = document.createElement('div'); sheet.className = 'v11-print';
    sheet.innerHTML = `<header><img src="${K.A('logo')}" alt=""><div><b>K\u00dd T\u00daC X\u00c1 \u0110\u1ea0I H\u1eccC NGH\u1ec6 AN</b><small>${esc(K.db.general.address)} \u00b7 ${esc(K.db.general.hotline)}</small></div><span>${esc(title || document.title)}<br><small>In ng\u00e0y ${new Date().toLocaleDateString('vi-VN')}</small></span></header>`;
    const clone = el.cloneNode(true); clone.querySelectorAll('button, .btn, [data-print]').forEach((b) => b.remove());
    sheet.appendChild(clone); document.body.appendChild(sheet);
    const prevTitle = document.title; document.title = title || prevTitle;
    document.body.classList.add('v11-printing');
    const done = () => { document.body.classList.remove('v11-printing'); sheet.remove(); document.title = prevTitle; removeEventListener('afterprint', done); };
    addEventListener('afterprint', done);
    setTimeout(() => { try { window.print(); } catch (e) { done(); } setTimeout(() => { if (sheet.isConnected) done(); }, 1500); }, 60);
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-print]'); if (!b) return;
    e.preventDefault(); const card = b.closest('.card') || document.querySelector('#app .content') || document.getElementById('app');
    App.toast('\u0110ang m\u1edf h\u1ed9p tho\u1ea1i in. Ch\u1ecdn \u201cL\u01b0u d\u01b0\u1edbi d\u1ea1ng PDF\u201d \u0111\u1ec3 t\u1ea3i t\u1ec7p v\u1ec1 m\u00e1y.'); App.printEl(card, b.dataset.print);
  });

  // ================= ti\u1ec7n \u00edch ch\u1ea1y th\u1eadt =================
  addEventListener('offline', () => App.toast('M\u1ea5t k\u1ebft n\u1ed1i m\u1ea1ng. D\u1eef li\u1ec7u v\u1eabn \u0111\u01b0\u1ee3c l\u01b0u tr\u00ean m\u00e1y v\u00e0 s\u1ebd d\u00f9ng ti\u1ebfp khi c\u00f3 m\u1ea1ng.', 'err'));
  addEventListener('online', () => App.toast('\u0110\u00e3 k\u1ebft n\u1ed1i m\u1ea1ng tr\u1edf l\u1ea1i.'));
  // ph\u00edm "/" \u0111\u1ec3 t\u00ecm ki\u1ebfm (khi kh\u00f4ng \u0111ang g\u00f5)
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    const s = document.querySelector('.tsearch input, #nl-q, #tc-id'); if (s) { e.preventDefault(); s.focus(); }
  });
  // li\u00ean k\u1ebft b\u1ecf qua t\u1edbi n\u1ed9i dung ch\u00ednh (b\u00e0n ph\u00edm / tr\u00ecnh \u0111\u1ecdc m\u00e0n h\u00ecnh)
  const skip = document.createElement('a'); skip.href = '#'; skip.className = 'v11-skip'; skip.textContent = 'B\u1ecf qua t\u1edbi n\u1ed9i dung ch\u00ednh';
  skip.onclick = (e) => { e.preventDefault(); const m = document.querySelector('#app .content, #app main, #app .home-flow, #app .gpage, #app section'); if (m) { m.setAttribute('tabindex', '-1'); m.focus({ preventScroll: false }); } };
  // sau m\u1ed7i l\u1ea7n v\u1ebd trang: \u0111\u00e1nh d\u1ea5u m\u1ee5c \u0111ang ch\u1ecdn, b\u01b0\u1edbc ch\u01b0a t\u1edbi kh\u00f4ng b\u1ea5m \u0111\u01b0\u1ee3c
  const a11y = (app) => {
    app.querySelectorAll('.pub-nav a, .side a, .seg .pill, .folder-tabs .ftab').forEach((a) => { if (a.classList.contains('on')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    app.querySelectorAll('.wzt:not([data-step]):not(.on)').forEach((b) => b.setAttribute('aria-disabled', 'true'));
    app.querySelectorAll('img:not([alt])').forEach((i) => i.setAttribute('alt', ''));
  };

  // ================= hi\u1ec7u \u1ee9ng 3D =================
  // 1. th\u1ebb nghi\u00eang theo con tr\u1ecf + v\u1ec7t s\u00e1ng ph\u1ea3n chi\u1ebfu
  const TILT = '.hcard, .momcard, .rtile, .amen-card, .space, .up, .stat, .rcard, .stepc, .ucard, .life-ic > a, .nf404-links > a, .qa-card, .stat-card';
  const bindTilt = (app) => {
    if (!hover || reduce) return;
    app.querySelectorAll(TILT).forEach((el) => {
      if (el.dataset.t3d) return; el.dataset.t3d = 1;
      const r0 = el.getBoundingClientRect(); if (r0.height > 460 || r0.width > 760 || el.querySelector('input, textarea, select, table')) return;
      el.classList.add('t3d');
      if (getComputedStyle(el).position === 'static') el.classList.add('t3d-rel');
      let raf = 0, px = 0.5, py = 0.5;
      const apply = () => { raf = 0; const max = el.classList.contains('stat') ? 4 : 7; el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg) translate3d(0,-4px,10px)`; el.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); el.style.setProperty('--gy', (py * 100).toFixed(1) + '%'); };
      el.addEventListener('pointerenter', () => { el.classList.add('t3d-on'); el.style.transition = 'transform .18s ease-out, box-shadow .3s'; });
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); px = (e.clientX - r.left) / r.width; py = (e.clientY - r.top) / r.height; if (!raf) raf = requestAnimationFrame(apply); });
      el.addEventListener('pointerleave', () => { el.classList.remove('t3d-on'); el.style.transition = 'transform .7s cubic-bezier(.2,.8,.2,1), box-shadow .4s'; el.style.transform = ''; });
    });
  };
  // 2. g\u1ee3n s\u00f3ng khi b\u1ea5m n\u00fat
  document.addEventListener('pointerdown', (e) => {
    if (reduce || e.button !== 0) return;
    const b = e.target.closest && e.target.closest('.btn, .pill, .ftab, .pub-nav a, .side a, .rtile, .wzt, .burger, .mburger');
    if (!b || b.disabled) return;
    if (getComputedStyle(b).position === 'static') b.classList.add('t3d-rel');
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2;
    const wrap = document.createElement('span'); wrap.className = 'v11-rp';
    const dot = document.createElement('i'); dot.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    wrap.appendChild(dot); b.appendChild(wrap); setTimeout(() => wrap.remove(), 700);
  }, { passive: true });
  // 3. xu\u1ea5t hi\u1ec7n theo chi\u1ec1u s\u00e2u khi cu\u1ed9n t\u1edbi: s\u1ed1 m\u1ee5c l\u1eadt \u0111\u1ed3ng xu, bi\u1ec3u t\u01b0\u1ee3ng l\u1eadt, minh h\u1ecda c\u00e1c b\u01b0\u1edbc n\u1ed5i l\u00ean
  const pop = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('v11-in'); pop.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  const bindPop = (app) => {
    if (reduce) return;
    app.querySelectorAll('.hs-num, .num-c, .stepnum, .amen-ic, .rt-ic, .life-ic > a > span, .stepc img, .nf404-art b, .kpis b').forEach((el, i) => {
      if (el.dataset.v11p) return; el.dataset.v11p = 1; el.classList.add('v11-pop'); el.style.setProperty('--pd', (i % 6) * 0.07 + 's'); pop.observe(el);
    });
  };
  // 4. ch\u1eef \u0111\u1ea7u trang ch\u1ee7 / \u0111\u0103ng nh\u1eadp nghi\u00eang nh\u1eb9 theo chu\u1ed9t (chi\u1ec1u s\u00e2u c\u00f9ng \u1ea3nh n\u1ec1n)
  let heroTxt = null, hx = 0, hy = 0, hraf = 0;
  if (hover && !reduce) addEventListener('pointermove', (e) => {
    if (!heroTxt || !heroTxt.isConnected) return;
    hx = e.clientX / innerWidth - 0.5; hy = e.clientY / innerHeight - 0.5;
    if (!hraf) hraf = requestAnimationFrame(() => { hraf = 0; heroTxt.style.setProperty('--hrx', (-hy * 4).toFixed(2) + 'deg'); heroTxt.style.setProperty('--hry', (hx * 6).toFixed(2) + 'deg'); });
  }, { passive: true });

  // ================= sau m\u1ed7i l\u1ea7n v\u1ebd trang =================
  let q = false;
  const after = () => {
    q = false; const app = document.getElementById('app'); if (!app) return;
    a11y(app); bindTilt(app); bindPop(app);
    heroTxt = app.querySelector('.hero-in, .auth-art .txt, .nf404-txt'); if (heroTxt) heroTxt.classList.add('v11-depth');
  };
  const queue = () => { if (!q) { q = true; requestAnimationFrame(after); } };
  const start = () => {
    document.body.prepend(skip);
    const app = document.getElementById('app'); if (app) new MutationObserver(queue).observe(app, { childList: true, subtree: true });
    queue();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
