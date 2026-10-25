/* Khung giao diện chung: router, layout, icon, toast, modal */
(function () {
  const K = window.KTX;
  const App = { pages: {}, st: {}, route: '', params: null };
  window.App = App;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ic = (n, c) => `<i data-lucide="${n}" class="lc ${c || ''}"></i>`;
  const im = (n, c, alt) => `<img src="${K.A(n)}" class="${c || ''}" alt="${esc(alt || '')}" loading="lazy">`;
  const av = (n, size, c) => `<img src="${K.A(n || 'av_tuananh')}" class="av ${c || ''}" style="width:${size}px;height:${size}px" alt="">`;
  const spark = `<svg class="spark" viewBox="0 0 50 50" fill="none" stroke="#dc1f2e" stroke-width="4.5" stroke-linecap="round"><path d="M10 26 L4 6"/><path d="M20 30 L36 12"/><path d="M24 44 L46 38"/></svg>`;
  const badge = (txt, color, opt) => `<span class="badge b-${color} ${opt && opt.sm ? 'b-sm' : ''}">${opt && opt.icon ? ic(opt.icon) : (opt && opt.dot ? '<i class="dot"></i>' : '')}${txt}</span>`;
  const sel = (id, opts, val, cls, attrs) => `<select id="${id}" class="select ${cls || ''}" ${attrs || ''}>${opts.map((o) => { const v = Array.isArray(o) ? o[0] : o, t = Array.isArray(o) ? o[1] : o; return `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(t)}</option>`; }).join('')}</select>`;
  Object.assign(App, { esc, ic, im, av, spark, badge, sel });
  App.khuOpts = () => K.khus().map((k) => [k, 'Tầng ' + k]);
  App.myNotes = () => K.db.notifications.filter((n) => !n.to || (K.db.session && n.to === K.db.session.id));

  // ---------- toast & modal ----------
  App.toast = (msg, type) => {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast ' + (type || 'ok');
    t.setAttribute('role', 'status');
    t.innerHTML = ic(type === 'err' ? 'circle-alert' : 'circle-check') + '<span>' + esc(msg) + '</span>';
    box.appendChild(t); App.icons(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 320); }, 2800);
  };
  App.modal = ({ title, body, foot, wide, onMount }) => {
    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true" style="${wide ? 'width:min(820px,100%)' : ''}"><div class="modal-h"><h3>${title}</h3><button class="xbtn" data-x aria-label="Đóng">${ic('x')}</button></div><div class="modal-b">${body}</div>${foot ? `<div class="modal-f">${foot}</div>` : ''}</div>`;
    document.body.appendChild(bg);
    const onKey = (e) => { if (e.key === 'Escape' && document.querySelectorAll('.modal-bg').length && bg === [...document.querySelectorAll('.modal-bg')].pop()) close(); };
    const close = () => { bg.remove(); document.removeEventListener('keydown', onKey); };
    document.addEventListener('keydown', onKey);
    bg.addEventListener('click', (e) => { if (e.target === bg || e.target.closest('[data-x]')) close(); });
    App.icons(bg);
    if (onMount) onMount(bg, close);
    const first = bg.querySelector('.modal-b input:not([type=checkbox]):not([type=radio]), .modal-b textarea, .modal-b select'); if (first) setTimeout(() => first.focus(), 30);
    return close;
  };
  App.confirm = (title, text, okText, onOk, danger) => App.modal({
    title, body: `<p style="font-size:15.5px;line-height:1.6">${text}</p>`,
    foot: `<button class="btn btn-outline" data-x>Hủy</button><button class="btn ${danger ? 'btn-outline-red' : 'btn-red'}" data-ok>${okText}</button>`,
    onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { close(); onOk(); },
  });

  App.icons = (root) => { if (window.lucide) window.lucide.createIcons({ attrs: {}, root: root || document }); };

  // ---------- router ----------
  const prefixes = App.prefixes = [['phong-', 'phong-detail'], ['sv-thanh-toan-', 'sv-thanh-toan'], ['sv-yeu-cau-', 'sv-yeu-cau'], ['ql-phan-giuong-', 'ql-phan-giuong']];
  function resolve(tok) {
    if (App.pages[tok]) return { key: tok, param: null };
    for (const [p, k] of prefixes) if (tok.startsWith(p) && App.pages[k]) return { key: k, param: tok.slice(p.length) };
    return { key: 'trang-chu', param: null };
  }
  App.go = (tok, opts) => {
    if (!opts || !opts.keepScroll) window.scrollTo(0, 0);
    App.render(tok);
    try { if (decodeURIComponent(location.hash.slice(1)) !== tok) history.replaceState(null, '', '#' + tok); } catch (e) { /* sandbox */ }
  };
  App.render = (tok) => {
    tok = tok || 'trang-chu';
    const { key, param } = resolve(tok);
    const page = App.pages[key];
    if (page.role && (!K.db.session || K.db.session.role !== page.role)) {
      App.after = null;
      App.pendingRoute = tok;
      App.st.login = { role: page.role === 'admin' ? 'admin' : 'student', msg: 'Vui lòng đăng nhập để tiếp tục.' };
      return App.go('dang-nhap');
    }
    const changed = App.route !== tok;
    App.route = tok; App.key = key; App.params = param;
    const root = document.getElementById('app');
    if (changed) { root.classList.remove('enter'); void root.offsetWidth; root.classList.add('enter'); }
    App.cleanup && App.cleanup(); App.cleanup = null;
    root.innerHTML = page.render(param);
    document.title = (page.title ? page.title + ' · ' : '') + 'Ký túc xá ĐH Nghệ An';
    App.icons(root);
    App.bindCommon(root);
    if (page.mount) page.mount(root, param);
  };
  App.refresh = () => { const y = window.scrollY; App.render(App.route); window.scrollTo(0, y); };
  App.state = (k, init) => (App.st[k] = App.st[k] || (typeof init === 'function' ? init() : Object.assign({}, init || {})));

  App.bindCommon = (root) => {
    root.querySelectorAll('[data-go]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); App.go(el.dataset.go); }));
    root.querySelectorAll('[data-toast]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); App.toast(el.dataset.toast); }));
    root.querySelectorAll('.drop input[type=file]').forEach((inp) => inp.addEventListener('change', () => {
      const out = inp.closest('.drop').parentElement.querySelector('.files') || (() => { const d = document.createElement('div'); d.className = 'files'; inp.closest('.drop').after(d); return d; })();
      out.innerHTML = [...inp.files].map((f) => `<span>${ic('paperclip')}${esc(f.name)}</span>`).join('');
      App.icons(out);
    }));
    root.querySelectorAll('textarea[data-max]').forEach((ta) => {
      const c = ta.parentElement.querySelector('.counter');
      const upd = () => { if (ta.value.length > +ta.dataset.max) ta.value = ta.value.slice(0, +ta.dataset.max); if (c) c.textContent = ta.value.length + '/' + ta.dataset.max; };
      ta.addEventListener('input', upd); upd();
    });
    root.querySelectorAll('.eye').forEach((b) => b.addEventListener('click', () => {
      const inp = b.parentElement.querySelector('input');
      inp.type = inp.type === 'password' ? 'text' : 'password';
      b.innerHTML = ic(inp.type === 'password' ? (b.dataset.closed || 'eye') : (b.dataset.open || 'eye-off')); App.icons(b);
    }));
    const burger = root.querySelector('.burger');
    if (burger) burger.onclick = () => root.querySelector('.pub-h').classList.toggle('open');
    const mb = root.querySelector('.mburger');
    if (mb) mb.onclick = () => { const a = root.querySelector('.app'); a.classList.add('open'); const s = document.createElement('div'); s.className = 'scrim'; s.onclick = () => { a.classList.remove('open'); s.remove(); }; a.appendChild(s); };
    // top search
    const ts = root.querySelector('.tsearch input');
    if (ts) {
      const box = root.querySelector('.tsearch');
      ts.addEventListener('input', () => {
        let r = box.querySelector('.sres'); const q = ts.value.trim().toLowerCase();
        if (!q) { r && r.remove(); return; }
        if (!r) { r = document.createElement('div'); r.className = 'sres'; box.appendChild(r); }
        const res = App.search(q).slice(0, 7);
        r.innerHTML = res.length ? res.map((x) => `<a href="#" data-go="${x.go}">${ic(x.icon)}<span>${esc(x.t)}</span><small>${esc(x.s)}</small></a>`).join('') : `<div class="muted small" style="padding:10px 12px">Không tìm thấy kết quả cho “${esc(ts.value)}”.</div>`;
        App.icons(r); r.querySelectorAll('[data-go]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); App.go(el.dataset.go); }));
      });
      ts.addEventListener('blur', () => setTimeout(() => { const r = box.querySelector('.sres'); r && r.remove(); }, 200));
    }
    const bell = root.querySelector('.bell');
    if (bell) bell.onclick = (e) => { e.stopPropagation(); App.dropdown(root, 'n'); };
    const meb = root.querySelector('.me');
    if (meb) meb.onclick = (e) => { e.stopPropagation(); App.dropdown(root, 'm'); };
    root.querySelectorAll('[data-logout]').forEach((b) => b.onclick = () => App.logout());
  };

  App.dropdown = (root, kind) => {
    const host = root.querySelector('.top-r');
    const old = host.querySelector('.menu');
    if (old) { const same = old.dataset.k === kind; old.remove(); if (same) return; }
    const m = document.createElement('div');
    m.className = 'menu' + (kind === 'n' ? ' npanel' : ''); m.dataset.k = kind;
    const role = K.db.session && K.db.session.role;
    if (kind === 'n') {
      const list = role === 'student' ? App.myNotes().slice(0, 5) : [
        ...(App.inboxCount && App.inboxCount() ? [{ title: 'Phản ánh, tin nhắn mới', summary: App.inboxCount() + ' mục đang chờ phản hồi.', go: 'ql-phan-anh', time: 'Mới' }] : []),
        { title: 'Hồ sơ mới cần duyệt', summary: 'Có ' + K.db.applications.filter((a) => a.status === 'cho-duyet').length + ' hồ sơ đang chờ duyệt.', go: 'ql-ho-so', time: 'Hôm nay' },
        { title: 'Giao dịch chờ đối soát', summary: 'Kiểm tra các giao dịch thanh toán mới.', go: 'ql-doi-soat', time: 'Hôm nay' },
        { title: 'Yêu cầu bảo trì mới', summary: 'Có phiếu công việc mới tiếp nhận.', go: 'ql-bao-tri', time: 'Hôm qua' }];
      m.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px"><b style="color:var(--navy)">Thông báo</b>${role === 'student' ? `<button class="link" style="width:auto;padding:0" data-allread>Đánh dấu đã đọc</button>` : ''}</div>` +
        list.map((n) => `<a href="#" class="ni" data-go="${n.go || 'sv-thong-bao'}" data-nid="${n.id || ''}">${ic(n.read === false ? 'circle-dot' : 'bell')}<span><b>${esc(n.title)}</b><small>${esc(n.summary)}</small></span><small style="margin-left:auto;white-space:nowrap">${esc(n.time)}</small></a>`).join('') +
        `<a href="#" data-go="${role === 'student' ? 'sv-thong-bao' : 'ql-thong-bao'}" style="justify-content:center;color:var(--blue);font-weight:600">Xem tất cả</a>`;
    } else {
      m.innerHTML = role === 'student'
        ? `<a href="#" data-go="sv-tai-khoan">${ic('user-round')}Tài khoản của tôi</a><a href="#" data-go="sv-ho-so">${ic('file-text')}Hồ sơ lưu trú</a><a href="#" data-go="so-do">${ic('layout-grid')}Danh sách màn hình</a><button data-logout>${ic('log-out')}Đăng xuất</button>`
        : `<a href="#" data-go="ql-cai-dat">${ic('settings')}Cài đặt hệ thống</a><a href="#" data-go="so-do">${ic('layout-grid')}Danh sách màn hình</a><button data-reset>${ic('rotate-ccw')}Khôi phục dữ liệu mẫu</button><button data-logout>${ic('log-out')}Đăng xuất</button>`;
    }
    host.appendChild(m); App.icons(m);
    m.querySelectorAll('[data-go]').forEach((el) => el.addEventListener('click', (e) => {
      e.preventDefault();
      if (el.dataset.nid) { const n = K.db.notifications.find((x) => x.id === el.dataset.nid); if (n) { n.read = true; App.st['sv-thong-bao'] = { tab: 'all', sel: n.id }; K.save(); } }
      App.go(el.dataset.go);
    }));
    m.querySelectorAll('[data-logout]').forEach((b) => b.onclick = () => App.logout());
    const ar = m.querySelector('[data-allread]'); if (ar) ar.onclick = () => { App.myNotes().forEach((n) => n.read = true); K.save(); App.refresh(); App.toast('Đã đánh dấu tất cả là đã đọc'); };
    const rs = m.querySelector('[data-reset]'); if (rs) rs.onclick = () => App.confirm('Khôi phục dữ liệu mẫu', 'Mọi thay đổi bạn đã thực hiện trên trình duyệt này sẽ bị xóa và hệ thống trở về dữ liệu mẫu ban đầu.', 'Khôi phục', () => { const s = K.db.session; K.reset(); K.db.session = s; K.save(); App.refresh(); App.toast('Đã khôi phục dữ liệu mẫu'); }, true);
    const off = (e) => { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('click', off); } };
    setTimeout(() => document.addEventListener('click', off), 0);
  };

  App.logout = () => { K.db.session = null; K.save(); App.toast('Đã đăng xuất'); App.go('dang-nhap'); };

  App.search = (q) => {
    const role = K.db.session && K.db.session.role;
    const out = [];
    const has = (s) => String(s).toLowerCase().includes(q);
    if (role === 'admin') {
      K.db.students.forEach((s) => { if (has(s.name) || has(s.id)) out.push({ icon: 'user-round', t: s.name + ' · ' + s.id, s: s.room ? 'Phòng ' + s.room : 'Chưa có phòng', go: 'ql-sinh-vien' }); });
      K.db.rooms.forEach((r) => { if (has(r.code)) out.push({ icon: 'door-closed', t: 'Phòng ' + r.code, s: 'Tầng ' + r.khu + ' · ' + K.occCount(r.code) + '/' + r.beds, go: 'ql-phan-giuong-' + r.code }); });
      K.db.invoices.forEach((i) => { if (has(i.id)) out.push({ icon: 'receipt-text', t: i.id, s: K.money(i.total), go: 'ql-doi-soat' }); });
      K.db.contracts.forEach((c) => { if (has(c.id)) out.push({ icon: 'file-signature', t: c.id, s: 'Hợp đồng', go: 'ql-hop-dong' }); });
    } else {
      const svc = [['Hóa đơn của tôi', 'sv-hoa-don', 'receipt-text'], ['Thanh toán hóa đơn', 'sv-thanh-toan-HĐ1026-001', 'credit-card'], ['Báo sửa chữa', 'sv-sua-chua', 'wrench'], ['Gia hạn lưu trú', 'sv-gia-han', 'calendar-clock'], ['Chuyển phòng', 'sv-chuyen-phong', 'arrow-left-right'], ['Trả phòng', 'sv-tra-phong', 'log-out'], ['Gửi phản ánh', 'sv-ho-tro', 'message-square-warning'], ['Phòng của tôi', 'sv-phong', 'door-closed'], ['Hồ sơ lưu trú', 'sv-ho-so', 'file-text'], ['Đăng ký lưu trú', 'sv-dang-ky-luu-tru', 'bed-double'], ['Tài khoản', 'sv-tai-khoan', 'user-round'], ['Tìm phòng ký túc xá', 'phong-o', 'search']];
      svc.forEach(([t, g, i]) => { if (has(t)) out.push({ icon: i, t, s: 'Dịch vụ', go: g }); });
      App.myNotes().forEach((n) => { if (has(n.title)) out.push({ icon: 'bell', t: n.title, s: 'Thông báo', go: 'sv-thong-bao' }); });
      K.db.invoices.filter((i) => i.student === K.db.session.id).forEach((i) => { if (has(i.id) || has(i.period)) out.push({ icon: 'receipt-text', t: i.id + ' · ' + i.period, s: K.money(i.total), go: 'sv-hoa-don' }); });
    }
    return out;
  };

  // ---------- layouts ----------
  const brand = (stack, role, cls) => `<a href="#" class="brand ${stack ? 'stack' : ''} ${cls || ''}" data-go="${role === 'admin' ? 'ql-tong-quan' : role === 'student' ? 'sv-tong-quan' : 'trang-chu'}"><img src="${K.A('logo')}" class="blend" alt="Logo Đại học Nghệ An"><span><b>ĐẠI HỌC NGHỆ AN</b><small>${role === 'admin' ? 'BAN QUẢN LÝ' : 'KÝ TÚC XÁ SINH VIÊN'}</small></span></a>`;
  App.brand = brand;

  App.pubHeader = (active, style) => {
    const items = active === 'trang-chu'
      ? [['trang-chu', 'Trang chủ'], ['gioi-thieu', 'Giới thiệu'], ['phong-o', 'Phòng ở'], ['tien-ich', 'Tiện ích'], ['huong-dan', 'Hướng dẫn'], ['lien-he', 'Liên hệ']]
      : [['gioi-thieu', 'Giới thiệu'], ['phong-o', 'Phòng ở'], ['tien-ich', 'Tiện ích'], ['huong-dan', 'Hướng dẫn'], ['lien-he', 'Liên hệ']];
    const s = K.db.session;
    const acts = s
      ? `<a href="#" class="btn btn-outline" data-go="${s.role === 'admin' ? 'ql-tong-quan' : 'sv-tong-quan'}">${s.role === 'admin' ? 'Trang quản lý' : 'Cổng sinh viên'}</a><button class="btn btn-red" data-logout>Đăng xuất</button>`
      : `<a href="#" class="btn btn-outline" data-go="dang-nhap">Đăng nhập</a><a href="#" class="btn btn-red" data-go="${'dang-ky'}">Đăng ký lưu trú</a>`;
    return `<header class="pub-h">${brand(false)}<nav class="pub-nav ${style === 'under' ? 'under' : ''}">${items.map(([k, t]) => `<a href="#" class="${k === active ? 'on' : ''}" data-nav="${k}">${t}</a>`).join('')}</nav><div class="pub-act">${acts}</div><button class="burger" aria-label="Mở menu">${ic('menu')}</button></header>`;
  };
  App.bindPubNav = (root) => root.querySelectorAll('[data-nav]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const k = a.dataset.nav;
    if (k === 'phong-o') return App.go('phong-o');
    if (App.route !== 'trang-chu') { App.go('trang-chu'); }
    const el = document.getElementById('sec-' + k);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); else window.scrollTo({ top: 0, behavior: 'smooth' });
  }));

  const SV_NAV = [['sv-tong-quan', 'Tổng quan', 'house'], ['sv-ho-so', 'Lưu trú', 'bed-double'], ['sv-phong', 'Phòng của tôi', 'door-closed'], ['sv-hoa-don', 'Hóa đơn', 'receipt-text'], ['sv-ho-tro', 'Hỗ trợ', 'wrench'], ['sv-noi-quy', 'Nội quy', 'shield-check'], ['sv-thong-bao', 'Thông báo', 'bell'], ['sv-tai-khoan', 'Tài khoản', 'user-round']];
  const QL_NAV = [['ql-tong-quan', 'Tổng quan', 'house'], ['ql-khu-nha', 'Tầng & phòng', 'building-2'], ['ql-sinh-vien', 'Sinh viên', 'users'], ['ql-ho-so', 'Hồ sơ lưu trú', 'file-text'], ['ql-hop-dong', 'Hợp đồng', 'clipboard-list'], ['ql-doi-soat', 'Tài chính', 'circle-dollar-sign'], ['ql-bao-tri', 'Bảo trì', 'wrench'], ['ql-vi-pham', 'Nội quy & vi phạm', 'shield-alert'], ['ql-thong-bao', 'Thông báo', 'bell'], ['ql-bao-cao', 'Báo cáo', 'chart-column'], ['ql-cai-dat', 'Cài đặt', 'settings']];

  /* o: { role, active, search, logo:'stack'|'inline', notif:'count'|'dot', foot:'card'|'card-email'|'illus'|'none'|'art'|'art2', icons:{key:icon} } */
  App.shell = (o, body) => {
    const isSv = o.role === 'student';
    const nav = isSv ? (App.SV_NAV || SV_NAV) : (App.QL_NAV || QL_NAV);
    const u = isSv ? K.me() : null;
    const unread = isSv ? App.myNotes().filter((n) => !n.read).length : 0;
    const items = nav.map(([k, t, i]) => {
      const icon = (o.icons && o.icons[k]) || i;
      const extra = (isSv && k === 'sv-thong-bao' && unread && o.notif !== 'none') ? (o.notif === 'count' ? `<span class="cnt">${unread}</span>` : (o.notif === 'after' ? `<i class="dot" style="width:9px;height:9px;border-radius:50%;background:var(--red);margin-left:6px"></i>` : '<i class="rdot"></i>')) : '';
      return `<a href="#" data-go="${k}" class="${k === o.active ? 'on' : ''}">${ic(icon)}<span>${t}</span>${extra}</a>`;
    }).join('');
    let foot = '';
    const uc = (email) => `<button class="ucard" data-go="sv-tai-khoan">${av(u.avatar, 52)}<span><b>${esc(u.name)}</b><small>${u.id}</small>${email ? `<small style="font-size:12.5px">${esc(u.email)}</small>` : ''}</span>${ic('chevron-right')}</button>`;
    if (isSv && u) {
      if (o.foot === 'illus') foot = `<div class="side-illus">${im('side_boy')}</div><div style="display:flex;gap:10px;align-items:center;padding:10px 6px 0">${av(u.avatar, 44)}<div><b style="color:var(--navy);font-size:17px">${esc(u.name)}</b><div class="muted small" style="color:var(--ink)">${u.id}</div><div class="small muted">${esc(u.email)}</div></div></div><button class="btn btn-soft btn-block" style="margin-top:14px;color:var(--ink)" data-logout>${ic('log-out')}Đăng xuất</button>`;
      else if (o.foot === 'card-email') foot = uc(true);
      else if (o.foot === 'card-only') foot = uc(false);
      else if (o.foot === 'card-down') foot = `<button class="ucard" data-go="sv-tai-khoan" style="background:#fff;border:0">${av(u.avatar, 60)}<span><b style="font-size:17px">${esc(u.name)}</b><small>${u.id}</small></span>${ic('chevron-down')}</button>`;
      else if (o.foot === 'plain') foot = `<div style="display:flex;align-items:center;gap:12px;padding:8px 6px">${av(u.avatar, 56)}<div><b style="color:var(--navy);font-size:16px;display:block">${esc(u.name)}</b><small class="muted">${u.id}</small></div><button class="xbtn" data-logout style="margin-left:auto" aria-label="Đăng xuất">${ic('log-out')}</button></div>`;
      else foot = uc(false) + `<button class="logout" data-logout>${ic('log-out')}Đăng xuất</button>`;
    } else if (!isSv) {
      if (o.foot === 'art') foot = `<div class="side-art">${im('side_admin_art')}</div>`;
      else if (o.foot === 'art2') foot = `<div class="side-art">${im('side_admin_art2')}</div>`;
    }
    const name = isSv ? (u ? u.name : '') : 'Quản trị viên';
    const avatar = isSv ? (u ? u.avatar : 'av_tuananh') : 'av_admin';
    const brandHtml = isSv ? brand(o.logo === 'stack', 'student') : (o.logo === 'settings'
      ? `<a href="#" class="brand stack" data-go="ql-tong-quan" style="gap:2px"><span style="display:flex;align-items:center;gap:10px"><img src="${K.A('logo')}" class="blend" style="width:64px" alt=""><span style="text-align:left"><b style="font-size:18px">ĐẠI HỌC NGHỆ AN</b><small style="font-size:11px">KÝ TÚC XÁ SINH VIÊN</small></span></span><span class="role" style="margin-top:8px;color:var(--navy)">BAN QUẢN LÝ</span></a>`
      : brand(o.logo === 'stack', 'admin'));
    return `<div class="app" style="--sbw:${Math.max(o.sbw || 250, isSv ? 0 : 246)}px"><aside class="side">${brandHtml}<nav class="snav ${nav.length > 11 ? 'dense' : ''}">${items}</nav><div class="side-foot">${foot}</div></aside>
      <div class="main"><div class="top"><button class="mburger" aria-label="Mở menu">${ic('menu')}</button><label class="tsearch">${ic('search')}<input id="topq" type="search" placeholder="${esc(o.search || 'Tìm kiếm...')}" autocomplete="off"></label>
      <div class="top-r"><button class="bell" aria-label="Thông báo">${ic('bell')}</button><button class="me">${av(avatar, 48)}<span>${esc(name)}</span>${ic('chevron-down')}</button></div></div>
      <div class="content">${body}</div></div></div>`;
  };

  App.phead = (o) => `<div class="phead ${o.cls || ''}" style="${o.h ? 'min-height:' + o.h + 'px' : ''}">${o.art ? `<img class="art" src="${K.A(o.art)}" alt="" style="${o.artStyle || ''}">` : ''}${o.crumb ? App.crumb(o.crumb) : ''}<h1>${o.title}${o.badge || ''}</h1>${o.desc ? `<p class="desc">${o.desc}</p>` : ''}${o.extra || ''}</div>`;
  App.crumb = (arr) => `<div class="crumb">${arr.map((c, i) => {
    const last = i === arr.length - 1;
    if (c === 'home') return `<a href="#" data-go="${K.db.session && K.db.session.role === 'admin' ? 'ql-tong-quan' : 'sv-tong-quan'}">${ic('house', 'home')}</a>`;
    const [t, g] = Array.isArray(c) ? c : [c];
    return (i ? ic('chevron-right') : '') + (last ? `<b>${t}</b>` : `<a href="#" ${g ? `data-go="${g}"` : ''}>${t}</a>`);
  }).join('')}</div>`;

  App.statusBadge = (s) => ({
    'dang-o': badge('Đang ở', 'green', { dot: true }), 'cho-phan-phong': badge('Chờ phân phòng', 'orange', { dot: true }), 'da-tra': badge('Đã trả phòng', 'gray', { dot: true }),
    'chua-tt': badge('Chưa thanh toán', 'red', { dot: true }), 'da-tt': badge('Đã thanh toán', 'green', { dot: true }), 'cho-doi-soat': badge('Chờ đối soát', 'orange', { icon: 'clock' }), 'can-kiem-tra': badge('Cần kiểm tra', 'red', { icon: 'triangle-alert' }),
    'cho-duyet': badge('Chờ duyệt', 'orange'), 'can-bo-sung': badge('Cần bổ sung', 'blue'), 'da-duyet': badge('Đã duyệt', 'green', { icon: 'circle-check' }), 'tu-choi': badge('Từ chối', 'red'),
    'moi': badge('Đã tiếp nhận', 'blue', { icon: 'hourglass' }), 'phan-cong': badge('Đã phân công', 'blue', { icon: 'user-check' }), 'dang-xu-ly': badge('Đang xử lý', 'orange', { icon: 'clock' }), 'hoan-tat': badge('Hoàn tất', 'green', { icon: 'circle-check' }),
    'hieu-luc': badge('Đang hiệu lực', 'green', { dot: true }), 'cho-ban-giao': badge('Chờ bàn giao', 'orange', { dot: true }), 'ket-thuc': badge('Đã kết thúc', 'gray', { dot: true }), 'gia-han': badge('Gia hạn', 'blue', { dot: true }),
  }[s] || badge(s, 'gray'));

  App.boot = () => {
    const tok = () => { try { return decodeURIComponent(location.hash.slice(1)); } catch (e) { return location.hash.slice(1); } };
    try { const as = new URLSearchParams(location.search).get('as'); if (as === 'student') { K.db.session = { role: 'student', id: 'SV260001' }; } else if (as === 'admin') { K.db.session = { role: 'admin' }; } } catch (e) { /* no query */ }
    const start = () => App.render(tok() || 'trang-chu');
    window.addEventListener('hashchange', () => { const t = tok(); if (t && t !== App.route) App.render(t); });
    start();
  };
})();
