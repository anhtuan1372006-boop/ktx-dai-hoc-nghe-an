/* v11 — hoàn thiện cho chạy thật: trang 404, in / lưu PDF tài liệu, báo mất mạng, phím tắt tìm kiếm, liên kết bỏ qua tới nội dung,
   đánh dấu mục đang chọn cho trình đọc màn hình; cùng các hiệu ứng 3D giữ đúng phong cách giao diện:
   thẻ nghiêng theo con trỏ có vệt sáng, gợn sóng khi bấm nút, số mục lật như đồng xu, minh họa nổi khối khi rê chuột,
   chữ đầu trang nghiêng nhẹ theo chuột, hộp thoại / menu / thông báo mở ra theo chiều sâu (kiểu dáng: css/v11.css). */
(function () {
  const K = window.KTX, { esc, ic } = App;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ================= trang 404 =================
  App.pages['khong-tim-thay'] = {
    title: 'Không tìm thấy trang',
    render: (bad) => `${App.pubHeader('')}
      <section class="nf404"><div class="nf404-in">
        <div class="nf404-txt">
          <span class="eyebrow">Lỗi 404</span>
          <h1>Không tìm thấy trang<br>bạn đang tìm.</h1>
          <p>Đường dẫn <code>#${esc(String(bad || '').slice(0, 60))}</code> không tồn tại hoặc đã được đổi tên. Bạn có thể quay lại trang chủ hoặc chọn một mục bên dưới.</p>
          <div class="hero-cta"><a href="#" class="btn btn-red" data-go="trang-chu">${ic('house')}Về trang chủ</a><a href="#" class="btn btn-outline" data-v11-back>${ic('arrow-left')}Quay lại trang trước</a></div>
          <div class="nf404-links">${[['phong-o', 'bed-double', 'Tìm phòng ở'], ['tien-ich', 'sparkles', 'Tiện ích'], ['su-kien', 'calendar-days', 'Sự kiện'], ['huong-dan', 'book-open-check', 'Hướng dẫn & hỏi đáp'], ['tra-cuu', 'file-search', 'Tra cứu hồ sơ'], ['dang-nhap', 'log-in', 'Đăng nhập']].map(([g, i, t]) => `<a href="#" data-go="${g}"><span class="amen-ic blue">${ic(i)}</span>${t}</a>`).join('')}</div>
        </div>
        <div class="nf404-art" aria-hidden="true"><b>4</b><img src="${K.A('logo')}" alt=""><b>4</b></div>
      </div></section>
      ${App.pubFooter()}`,
    mount: (root) => {
      App.bindPubNav && App.bindPubNav(root); App.bindFooter && App.bindFooter(root);
      const b = root.querySelector('[data-v11-back]'); if (b) b.onclick = (e) => { e.preventDefault(); history.length > 1 ? history.back() : App.go('trang-chu'); };
    },
  };

  // ================= in / lưu PDF =================
  App.printEl = (el, title) => {
    const sheet = document.createElement('div'); sheet.className = 'v11-print';
    sheet.innerHTML = `<header><img src="${K.A('logo')}" alt=""><div><b>KÝ TÚC XÁ ĐẠI HỌC NGHỆ AN</b><small>${esc(K.db.general.address)} · ${esc(K.db.general.hotline)}</small></div><span>${esc(title || document.title)}<br><small>In ngày ${new Date().toLocaleDateString('vi-VN')}</small></span></header>`;
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
    App.toast('Đang mở hộp thoại in. Chọn “Lưu dưới dạng PDF” để tải tệp về máy.'); App.printEl(card, b.dataset.print);
  });

  // ================= tiện ích chạy thật =================
  addEventListener('offline', () => App.toast('Mất kết nối mạng. Dữ liệu vẫn được lưu trên máy và sẽ dùng tiếp khi có mạng.', 'err'));
  addEventListener('online', () => App.toast('Đã kết nối mạng trở lại.'));
  // phím "/" để tìm kiếm (khi không đang gõ)
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    const s = document.querySelector('.tsearch input, #nl-q, #tc-id'); if (s) { e.preventDefault(); s.focus(); }
  });
  // liên kết bỏ qua tới nội dung chính (bàn phím / trình đọc màn hình)
  const skip = document.createElement('a'); skip.href = '#'; skip.className = 'v11-skip'; skip.textContent = 'Bỏ qua tới nội dung chính';
  skip.onclick = (e) => { e.preventDefault(); const m = document.querySelector('#app .content, #app main, #app .home-flow, #app .gpage, #app section'); if (m) { m.setAttribute('tabindex', '-1'); m.focus({ preventScroll: false }); } };
  // sau mỗi lần vẽ trang: đánh dấu mục đang chọn, bước chưa tới không bấm được
  const a11y = (app) => {
    app.querySelectorAll('.pub-nav a, .side a, .seg .pill, .folder-tabs .ftab').forEach((a) => { if (a.classList.contains('on')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    app.querySelectorAll('.wzt:not([data-step]):not(.on)').forEach((b) => b.setAttribute('aria-disabled', 'true'));
    app.querySelectorAll('img:not([alt])').forEach((i) => i.setAttribute('alt', ''));
  };

  // ================= hiệu ứng 3D =================
  // 1. thẻ nghiêng theo con trỏ + vệt sáng phản chiếu
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
  // 2. gợn sóng khi bấm nút
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
  // 3. xuất hiện theo chiều sâu khi cuộn tới: số mục lật đồng xu, biểu tượng lật, minh họa các bước nổi lên
  const pop = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('v11-in'); pop.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  const bindPop = (app) => {
    if (reduce) return;
    app.querySelectorAll('.hs-num, .num-c, .stepnum, .amen-ic, .rt-ic, .life-ic > a > span, .stepc img, .nf404-art b, .kpis b').forEach((el, i) => {
      if (el.dataset.v11p) return; el.dataset.v11p = 1; el.classList.add('v11-pop'); el.style.setProperty('--pd', (i % 6) * 0.07 + 's'); pop.observe(el);
    });
  };
  // 4. chữ đầu trang chủ / đăng nhập nghiêng nhẹ theo chuột (chiều sâu cùng ảnh nền)
  let heroTxt = null, hx = 0, hy = 0, hraf = 0;
  if (hover && !reduce) addEventListener('pointermove', (e) => {
    if (!heroTxt || !heroTxt.isConnected) return;
    hx = e.clientX / innerWidth - 0.5; hy = e.clientY / innerHeight - 0.5;
    if (!hraf) hraf = requestAnimationFrame(() => { hraf = 0; heroTxt.style.setProperty('--hrx', (-hy * 4).toFixed(2) + 'deg'); heroTxt.style.setProperty('--hry', (hx * 6).toFixed(2) + 'deg'); });
  }, { passive: true });

  // ================= sau mỗi lần vẽ trang =================
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
