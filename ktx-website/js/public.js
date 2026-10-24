/* Màn hình công khai: trang chủ, tìm phòng, chi tiết phòng, đăng nhập, đăng ký, quên mật khẩu, sơ đồ màn hình */
(function () {
  const K = window.KTX, { esc, ic, im, av, spark, badge, sel } = App;
  const P = App.pages;

  const RULES = ['Chấp hành nội quy, quy định của ký túc xá và Đại học Nghệ An.', 'Giữ gìn vệ sinh, tài sản chung; sử dụng điện, nước tiết kiệm, đúng quy định.', 'Không tự ý thay đổi phòng, giường khi chưa được phép.', 'Đảm bảo an ninh, trật tự, phòng cháy chữa cháy trong khu ký túc xá.', 'Có trách nhiệm thanh toán đầy đủ các khoản phí lưu trú theo quy định.', 'Giờ đóng cửa ký túc xá: 23:00 hằng ngày. Khách đến thăm đăng ký tại quầy tiếp nhận.'];
  App.RULES = RULES;
  App.showRules = () => App.modal({ title: 'Nội quy lưu trú', body: `<ol style="padding-left:20px;line-height:1.8;margin:0;color:var(--ink)">${RULES.map((r) => `<li>${r}</li>`).join('')}</ol>`, foot: `<button class="btn btn-red" data-x>Tôi đã hiểu</button>` });
  App.contact = () => App.modal({ title: 'Liên hệ Ban quản lý ký túc xá', body: `<div class="info-list lined">
      <div>${ic('phone')}<span>Hotline</span><b>${K.db.general.hotline}</b></div>
      <div>${ic('mail')}<span>Email</span><b>${K.db.general.email}</b></div>
      <div>${ic('map-pin')}<span>Địa chỉ</span><b style="text-align:right">${K.db.general.address}</b></div>
      <div>${ic('clock')}<span>Giờ làm việc</span><b>7:30 – 17:00, Thứ Hai – Thứ Bảy</b></div></div>
      <div class="field" style="margin-top:16px"><label for="ct-msg">Để lại lời nhắn</label><textarea id="ct-msg" class="textarea" placeholder="Bạn cần tư vấn về phòng nào, thời gian nào..."></textarea></div>`,
    foot: `<button class="btn btn-outline" data-x>Đóng</button><button class="btn btn-red" data-send>${ic('send')}Gửi lời nhắn</button>`,
    onMount: (el, close) => el.querySelector('[data-send]').onclick = () => { const m = el.querySelector('#ct-msg').value.trim(); if (!m) return App.toast('Vui lòng nhập nội dung lời nhắn', 'err'); const me = K.me(); K.db.contacts.unshift({ id: 'LH-' + Date.now(), name: me ? me.name + ' (' + me.id + ')' : 'Khách truy cập', contact: me ? me.email : 'Không để lại', msg: m, at: K.now(), done: false }); K.save(); close(); App.toast('Đã gửi lời nhắn. Ban quản lý sẽ liên hệ lại với bạn.'); } });

  // ============ 1. Trang chủ ============
  P['trang-chu'] = {
    title: 'Trang chủ',
    render: () => `${App.pubHeader('trang-chu')}
    <section class="hero" id="sec-trang-chu"><div class="hero-in">
      <h1>Khởi đầu hành trình,<br>từ một nơi ở tốt.${spark}</h1>
      <h2>Ký túc xá Đại học Nghệ An</h2>
      <p>Không chỉ là nơi ở, mà là không gian học tập, kết nối và trưởng thành cùng những người bạn đồng hành.</p>
      <div class="hero-cta"><a href="#" class="btn btn-red" data-go="phong-o">Khám phá phòng ở ${ic('arrow-right')}</a><a href="#" class="btn btn-outline" data-go="dang-nhap">${ic('user-round')}Đăng nhập cổng sinh viên</a></div>
    </div></section>
    <section class="steps-band">
      <div class="stepc"><img src="${K.A('step1')}" alt=""><div><h3><span class="num-c">1</span>Chọn phòng</h3><p>Xem thông tin các tầng ký túc xá, phòng ở và tiện ích đi kèm.</p></div></div>
      ${ic('chevron-right')}
      <div class="stepc"><img src="${K.A('step2')}" alt=""><div><h3><span class="num-c">2</span>Đăng ký lưu trú</h3><p>Điền thông tin và gửi hồ sơ trực tuyến nhanh chóng.</p></div></div>
      ${ic('chevron-right')}
      <div class="stepc"><img src="${K.A('step3')}" alt="" style="width:194px"><div><h3><span class="num-c">3</span>Nhận phòng</h3><p>Hoàn tất thủ tục và bắt đầu hành trình học tập tại KTX.</p></div></div>
    </section>
    <section class="feat2">
      <div class="featc"><div class="tx"><h3><img src="${K.A('ic_cap')}" class="blend" alt="">Không gian học tập</h3><p>Phòng học chung, thư viện mini, không gian yên tĩnh giúp bạn tập trung và phát triển bản thân mỗi ngày.</p><button class="link" data-feat="study">Xem tiện ích ${ic('arrow-right')}</button></div><img src="${K.A('study')}" alt="Sinh viên học tập tại thư viện ký túc xá"></div>
      <div class="featc"><div class="tx"><h3><img src="${K.A('ic_people')}" class="blend" alt="">Cuộc sống sinh viên</h3><p>Giao lưu, kết bạn, tham gia nhiều hoạt động văn hóa – thể thao – tình nguyện sôi nổi.</p><button class="link" data-feat="life">Xem tiện ích ${ic('arrow-right')}</button></div><img src="${K.A('community')}" alt="Sinh viên sinh hoạt cộng đồng"></div>
    </section>
    ${App.homeSections()}
    ${App.pubFooter()}`,
    mount: (root) => {
      App.bindPubNav(root);
      root.querySelectorAll('[data-feat]').forEach((b) => b.onclick = () => {
        const study = b.dataset.feat === 'study';
        App.modal({ title: study ? 'Tiện ích học tập' : 'Tiện ích sinh hoạt', body: `<img src="${K.A(study ? 'study' : 'community')}" style="border-radius:12px;margin-bottom:14px" alt=""><ul style="line-height:1.9;padding-left:20px;margin:0;color:var(--ink)">${(study ? ['Phòng học chung mở cửa 6:00 – 23:00', 'Thư viện mini với hơn 2.000 đầu sách', 'Wi-Fi tốc độ cao phủ sóng toàn khu', 'Mỗi giường có bàn học riêng, đèn và ổ cắm điện'] : ['Sân sinh hoạt chung tại mỗi khu nhà', 'Câu lạc bộ văn nghệ, thể thao, tình nguyện', 'Nhà ăn, căng tin, khu giặt sấy', 'Bảo vệ 24/7, camera an ninh']).map((x) => `<li>${x}</li>`).join('')}</ul>`, foot: `<a href="#" class="btn btn-red" data-x data-go2="phong-o">Xem phòng ở</a>`, onMount: (el, close) => el.querySelector('[data-go2]').onclick = (e) => { e.preventDefault(); close(); App.go('phong-o'); } });
      });
    },
  };

  // ============ 2 / 33. Tìm phòng ============
  const ORDER = ['A302', 'B204', 'C101', 'B201'];
  const amenIcons = (r) => `<div class="amen4"><div><i class="ab">${ic('bed-single')}</i>${r.beds} giường</div><div><i class="ab">${ic('lamp-desk')}</i>Bàn học</div><div><i class="ab">${ic('wifi')}</i>Wifi</div><div><i class="ab">${ic('sprout')}</i>Ban công</div></div>`;
  App.freeBadge = (code) => { const f = K.freeBeds(code); const r = K.room(code); if (r.maint) return badge('Đang bảo trì', 'orange', { icon: 'wrench' }); return f > 0 ? badge('Còn ' + f + ' chỗ', 'green', { icon: 'users' }) : badge('Đã đủ chỗ', 'red', { icon: 'users' }); };
  P['phong-o'] = {
    title: 'Tìm phòng',
    render: () => {
      const st = App.state('rooms', { khu: '', cap: 0, avail: false, desk: false, balcony: false, q: '', sort: 'default', page: 1 });
      let list = K.db.rooms.slice();
      if (st.khu) list = list.filter((r) => r.khu === st.khu);
      if (st.cap) list = list.filter((r) => r.beds === st.cap);
      if (st.avail) list = list.filter((r) => K.freeBeds(r.code) > 0 && !r.maint);
      if (st.desk) list = list.filter((r) => r.amen.includes('desk'));
      if (st.balcony) list = list.filter((r) => r.amen.includes('balcony'));
      if (st.q) { const q = st.q.toLowerCase(); list = list.filter((r) => ('phòng ' + r.code + ' tầng ' + r.khu + ' ' + r.beds + ' người wifi bàn học ban công').toLowerCase().includes(q)); }
      const rank = (c) => { const i = ORDER.indexOf(c); return i < 0 ? 99 : i; };
      const sorts = { default: (a, b) => rank(a.code) - rank(b.code) || a.code.localeCompare(b.code), free: (a, b) => K.freeBeds(b.code) - K.freeBeds(a.code) || rank(a.code) - rank(b.code), asc: (a, b) => a.price - b.price, desc: (a, b) => b.price - a.price, code: (a, b) => a.code.localeCompare(b.code) };
      list.sort(sorts[st.sort]);
      const per = 4, pages = Math.max(1, Math.ceil(list.length / per));
      if (st.page > pages) st.page = pages;
      const cur = list.slice((st.page - 1) * per, st.page * per);
      const startP = Math.max(1, Math.min(st.page - 1, pages - 2));
      const nums = []; for (let i = startP; i <= Math.min(pages, startP + 2); i++) nums.push(i);
      return `${App.pubHeader('phong-o')}
      <section class="pbanner"><img class="art" src="${K.A('banner_rooms')}" alt=""><div class="pbanner-in">${App.crumb([['Trang chủ', 'trang-chu'], 'Phòng ở'])}<h1>Tìm phòng phù hợp với bạn${spark}</h1><p>Không gian học tập và sinh hoạt tiện nghi, an toàn, thân thiện cùng cộng đồng sinh viên Đại học Nghệ An.</p></div></section>
      <div class="rooms-wrap">
        <aside class="filter"><div class="filter-h">${ic('list-filter')}Bộ lọc tìm phòng</div><div class="filter-b">
          <div class="field"><label class="lbl" for="f-khu">Tầng</label>${sel('f-khu', [['', 'Tất cả tầng'], ...App.khuOpts()], st.khu)}</div>
          <div class="field"><span class="lbl">Sức chứa phòng</span><div class="cap-btns">${[2, 4, 6].map((c) => `<button type="button" data-cap="${c}" class="${st.cap === c ? 'on' : ''}">${c} người</button>`).join('')}</div></div>
          <div class="field"><span class="lbl">Tiện ích</span><div class="amen-list">
            <label class="check"><input type="checkbox" id="f-avail" ${st.avail ? 'checked' : ''}>${ic('bed-double')}Còn chỗ</label>
            <label class="check"><input type="checkbox" id="f-desk" ${st.desk ? 'checked' : ''}>${ic('lamp-desk')}Bàn học</label>
            <label class="check"><input type="checkbox" id="f-bal" ${st.balcony ? 'checked' : ''}>${ic('sprout')}Ban công</label></div></div>
          <button class="btn btn-red btn-block" id="f-apply" style="margin-top:14px;height:48px;font-size:16px">Áp dụng</button>
          <button class="btn btn-outline btn-block" id="f-clear" style="height:48px;font-weight:500">Xóa bộ lọc</button>
        </div></aside>
        <section style="min-width:0">
          <div class="rl-top"><form class="searchbar" id="f-search">${ic('search')}<input id="f-q" placeholder="Tìm theo mã phòng, tầng, tiện ích..." value="${esc(st.q)}"><button class="go" aria-label="Tìm kiếm">${ic('search')}</button></form>
            <div class="sortbox">${ic('arrow-down-up')}<span>Sắp xếp</span>${sel('f-sort', [['default', 'Mặc định'], ['free', 'Còn chỗ trước'], ['asc', 'Giá thấp → cao'], ['desc', 'Giá cao → thấp'], ['code', 'Mã phòng A → Z']], st.sort)}</div></div>
          ${cur.length ? `<div class="room-grid">${cur.map((r) => {
            const full = K.freeBeds(r.code) <= 0 || r.maint;
            return `<article class="rcard"><div class="ph"><img src="${K.A(r.img)}" alt="Ảnh phòng ${r.code}"><span class="khu-tag">TẦNG ${r.khu}</span></div><div class="bd"><h3>Phòng ${r.code}</h3><div class="sub">Phòng ${r.beds} người · Tầng ${r.khu}</div>${App.freeBadge(r.code)}${amenIcons(r)}
              ${full ? `<button class="btn btn-disabled btn-block" data-go="phong-${r.code}" style="cursor:pointer">${r.maint ? 'Đang bảo trì' : 'Đã đủ chỗ'}</button>` : `<button class="btn btn-red btn-block" data-go="phong-${r.code}">Xem phòng ${ic('arrow-right')}</button>`}</div></article>`;
          }).join('')}</div>` : `<div class="card pad" style="text-align:center;padding:50px"><h3>Không tìm thấy phòng phù hợp</h3><p class="muted" style="margin-top:8px">Thử bỏ bớt điều kiện lọc hoặc tìm theo mã phòng khác.</p></div>`}
          <div class="pager"><button data-pg="${st.page - 1}" ${st.page <= 1 ? 'disabled' : ''} aria-label="Trang trước">${ic('chevron-left')}</button>${nums.map((n) => `<button data-pg="${n}" class="${n === st.page ? 'on' : ''}">${n}</button>`).join('')}<button data-pg="${st.page + 1}" ${st.page >= pages ? 'disabled' : ''} aria-label="Trang sau">${ic('chevron-right')}</button></div>
          <p class="muted small" style="text-align:center;margin-top:10px">Tìm thấy ${list.length} phòng phù hợp</p>
        </section>
      </div>${App.pubFooter()}`;
    },
    mount: (root) => {
      App.bindPubNav(root);
      const st = App.st.rooms;
      root.querySelectorAll('[data-cap]').forEach((b) => b.onclick = () => { const c = +b.dataset.cap; root.querySelectorAll('[data-cap]').forEach((x) => x.classList.toggle('on', x === b && st._cap !== c)); st._cap = st._cap === c ? 0 : c; });
      st._cap = st.cap;
      root.querySelector('#f-apply').onclick = () => { st.khu = root.querySelector('#f-khu').value; st.cap = st._cap || 0; st.avail = root.querySelector('#f-avail').checked; st.desk = root.querySelector('#f-desk').checked; st.balcony = root.querySelector('#f-bal').checked; st.page = 1; App.refresh(); };
      root.querySelector('#f-clear').onclick = () => { App.st.rooms = null; App.refresh(); };
      root.querySelector('#f-search').onsubmit = (e) => { e.preventDefault(); st.q = root.querySelector('#f-q').value.trim(); st.page = 1; App.refresh(); };
      root.querySelector('#f-sort').onchange = (e) => { st.sort = e.target.value; st.page = 1; App.refresh(); };
      root.querySelectorAll('[data-pg]').forEach((b) => b.onclick = () => { st.page = +b.dataset.pg; App.refresh(); });
    },
  };

  // ============ 4. Chi tiết phòng ============
  P['phong-detail'] = {
    title: 'Chi tiết phòng',
    render: (code) => {
      const r = K.room(code) || K.room('B204');
      code = r.code;
      const map = K.bedMap(code);
      const st = App.state('detail-' + code, () => ({ bed: (map.filter((b) => b.free).pop() || {}).bed || null, img: 0 }));
      const free = K.freeBeds(code);
      const imgs = [r.code === 'B204' ? 'detail_main' : r.img, 'thumb_desk', 'thumb_wardrobe', 'thumb_bath'];
      const thumbs = [r.img, 'thumb_desk', 'thumb_wardrobe', 'thumb_bath'];
      const area = { 2: 14, 4: 20, 6: 28, 8: 32 }[r.beds] || 20;
      const b2 = (n) => K.pad2(n);
      return `${App.pubHeader('phong-o', 'under')}
      <div class="rd-wrap">
        <div class="crumb">${ic('house', 'home')}${ic('chevron-right')}<a href="#" data-go="trang-chu" style="color:var(--ink)">Trang chủ</a><span>/</span><a href="#" data-go="phong-o" style="color:var(--ink)">Phòng ở</a><span>/</span><b>${r.code}</b></div>
        <div class="rd-grid">
          <div class="card gallery"><img class="main" id="rd-main" src="${K.A(imgs[st.img])}" alt="Ảnh phòng ${r.code}"><div class="thumbs">${thumbs.map((t, i) => `<img src="${K.A(t)}" data-img="${i}" class="${i === st.img ? 'on' : ''}" alt="">`).join('')}</div></div>
          <div class="card rd-info">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><h1>Phòng ${r.code}</h1>${r.maint ? badge('Bảo trì', 'orange') : free > 0 ? `<span class="badge b-green" style="font-size:16px;padding:9px 18px"><i class="dot" style="width:12px;height:12px;background:#22b24c"></i>Còn ${free} chỗ</span>` : badge('Đã đủ chỗ', 'red')}</div>
            <div class="rd-meta"><span>${ic('building')}<b style="color:var(--navy)">Tầng ${r.khu}</b></span><span>${ic('users')}${r.beds} giường</span><span>${ic('scan')}Diện tích ~ ${area} m²</span></div>
            <div class="price">${ic('coins')}<div><b>Giá phòng</b><div class="amt">${K.money(r.price)} <small>/ tháng</small></div><div style="color:var(--text);font-size:16px">Điện, nước tính theo sử dụng</div></div></div>
            <h3 style="font-size:21px;margin-top:16px">Chọn giường</h3>
            <div class="beds" style="grid-template-columns:repeat(${Math.min(4, r.beds)},1fr)">${map.map((b) => `<div class="bed"><button type="button" ${b.free ? `class="free ${st.bed === b.bed ? 'sel' : ''}" data-bed="${b.bed}"` : 'disabled'}>${ic('bed-single')}${b2(b.bed)}</button><small>${b.free ? 'Đang trống' : 'Đã có người'}</small></div>`).join('')}</div>
            <div class="legend"><span><i class="d" style="background:#8d94a3"></i>Đã có người ở</span><span style="color:var(--red)"><i class="d" style="background:var(--red)"></i>${free > 0 ? (st.bed ? 'Giường ' + b2(st.bed) + ' đang trống' : 'Giường trống') : 'Không còn giường trống'}</span></div>
            ${free > 0 && !r.maint ? `<button class="btn btn-red btn-block btn-lg" id="rd-reg" style="font-size:19px;height:52px">Đăng ký giường ${st.bed ? b2(st.bed) : ''} ${ic('arrow-right')}</button>` : `<button class="btn btn-disabled btn-block btn-lg" disabled>Phòng đã đủ chỗ</button>`}
            <div style="text-align:center;margin-top:16px"><button class="link" id="rd-rules" style="color:var(--navy);font-weight:500">${ic('file-text')}<u>Xem nội quy lưu trú</u> ${ic('arrow-right')}</button></div>
          </div>
        </div>
        <div class="rd-low">
          <div class="card" style="padding:14px 24px 16px"><h3 style="font-size:17px">Tiện ích phòng</h3><div class="amen-row">
            <div>${im('am_wifi', 'blend')}<b>Wi-Fi</b><small>Tốc độ cao,<br>phủ sóng toàn phòng</small></div>
            <div>${im('am_desk', 'blend')}<b>Bàn học</b><small>Có đèn, ổ cắm điện</small></div>
            <div>${im('am_wardrobe', 'blend')}<b>Tủ cá nhân</b><small>Mỗi sinh viên 1 tủ,<br>khóa an toàn</small></div>
            <div>${im('am_wc', 'blend')}<b>Khu vệ sinh</b><small>Trong phòng,<br>đầy đủ tiện nghi</small></div></div></div>
          <div class="card advisor"><img src="${K.A('advisor')}" alt="Nhân viên tư vấn"><div><h3>Cần tư vấn chọn phòng?</h3><p>Đội ngũ hỗ trợ KTX luôn sẵn sàng giải đáp thắc mắc và giúp bạn chọn phòng phù hợp.</p><button class="btn btn-outline-red" id="rd-contact" style="height:42px">${ic('message-circle-more')}Liên hệ tư vấn ${ic('arrow-right')}</button></div></div>
        </div>
        ${App.similarRooms(r)}
      </div>${App.pubFooter()}`;
    },
    mount: (root, code) => {
      App.bindPubNav(root);
      const r = K.room(code) || K.room('B204');
      const st = App.st['detail-' + r.code];
      root.querySelectorAll('[data-img]').forEach((t) => t.onclick = () => { st.img = +t.dataset.img; App.refresh(); });
      root.querySelectorAll('[data-bed]').forEach((b) => b.onclick = () => { st.bed = +b.dataset.bed; App.refresh(); });
      root.querySelector('#rd-rules').onclick = App.showRules;
      root.querySelector('#rd-contact').onclick = App.contact;
      const reg = root.querySelector('#rd-reg');
      if (reg) reg.onclick = () => {
        if (!st.bed) return App.toast('Vui lòng chọn một giường trống', 'err');
        App.st.booking = { room: r.code, bed: st.bed };
        const s = K.db.session;
        if (s && s.role === 'admin') return App.toast('Tài khoản quản lý không thể đăng ký giường. Vui lòng dùng tài khoản sinh viên.', 'err');
        if (!s) { App.pendingRoute = 'sv-dang-ky-luu-tru'; App.st.login = { role: 'student', msg: 'Đăng nhập để đăng ký giường ' + K.pad2(st.bed) + ' phòng ' + r.code + '.' }; return App.go('dang-nhap'); }
        const me = K.me();
        if (me && me.room) { if (me.room === r.code) return App.toast('Bạn đang ở phòng ' + r.code + ' rồi.'); App.st.transfer = null; App.st.transferPick = r.code; App.toast('Bạn đang ở phòng ' + me.room + '. Chuyển sang yêu cầu chuyển phòng tới ' + r.code + '.'); return App.go('sv-chuyen-phong'); }
        App.st.reg = null; App.go('sv-dang-ky-luu-tru');
      };
    },
  };

  // ============ 3. Đăng nhập ============
  P['dang-nhap'] = {
    title: 'Đăng nhập',
    render: () => {
      const st = App.state('login', { role: 'student' });
      const adm = st.role === 'admin';
      return `<div class="auth auth-login">
        <div class="auth-art">${App.brand(false)}<div class="txt"><h1>Chào mừng<br>bạn trở lại!${spark}</h1><p>Cùng tiếp tục hành trình học tập và trải nghiệm tại Ký túc xá Đại học Nghệ An.</p></div></div>
        <div class="auth-side"><a href="#" class="back-link" data-go="trang-chu">${ic('arrow-left')}Về trang giới thiệu</a>
          <form class="auth-card" id="lg-form" novalidate><h2>Đăng nhập</h2><p class="sub">Truy cập hệ thống ký túc xá</p>
            <div class="role-sw"><button type="button" data-role="student" class="${adm ? '' : 'on'}">Sinh viên</button><button type="button" data-role="admin" class="${adm ? 'on' : ''}">Ban quản lý</button></div>
            ${st.msg ? `<p class="err" style="margin:-10px 0 14px">${esc(st.msg)}</p>` : ''}
            <div class="field"><label for="lg-id">${adm ? 'Tên đăng nhập hoặc email' : 'Mã sinh viên hoặc email'}</label><div class="iwrap">${ic('user-round')}<input id="lg-id" class="input" autocomplete="username" placeholder="${adm ? 'Nhập tên đăng nhập hoặc email' : 'Nhập mã sinh viên hoặc email'}" value="${esc(st.id || '')}"></div></div>
            <div class="field" style="margin-top:20px"><label for="lg-pw">Mật khẩu</label><div class="iwrap">${ic('lock-keyhole')}<input id="lg-pw" type="password" class="input" autocomplete="current-password" placeholder="Nhập mật khẩu"><button type="button" class="eye" data-closed="eye-off" data-open="eye" aria-label="Hiện mật khẩu">${ic('eye-off')}</button></div></div>
            <p class="err" id="lg-err" style="margin-top:8px" hidden></p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px"><label class="check"><input type="checkbox" id="lg-rem" checked>Ghi nhớ đăng nhập</label><a href="#" data-go="quen-mat-khau" style="color:var(--blue-700);text-decoration:underline;font-weight:500">Quên mật khẩu?</a></div>
            <button class="btn btn-red btn-block btn-lg" style="margin-top:28px;height:58px;font-size:20px">Đăng nhập ${ic('arrow-right')}</button>
            <div class="or">hoặc</div>
            <p style="text-align:center;font-size:17px;color:var(--navy)">Chưa có tài khoản? <a href="#" data-go="dang-ky" style="color:var(--red);font-weight:700;margin-left:8px">Đăng ký ${ic('arrow-right')}</a></p>
            <button type="button" class="help-box" id="lg-help">${ic('circle-help')}<span><b>Cần hỗ trợ đăng nhập?</b><small>Liên hệ Ban quản lý ký túc xá để được hỗ trợ.</small></span>${ic('arrow-right')}</button>
          </form></div></div>`;
    },
    mount: (root) => {
      const st = App.st.login;
      root.querySelectorAll('[data-role]').forEach((b) => b.onclick = () => { st.role = b.dataset.role; st.msg = ''; App.refresh(); });
      root.querySelector('#lg-help').onclick = () => App.modal({ title: 'Hỗ trợ đăng nhập', body: `<p style="line-height:1.6">Liên hệ Ban quản lý ký túc xá qua hotline <b>${K.db.general.hotline}</b> hoặc email <b>${K.db.general.email}</b>.</p>
        <div class="card" style="box-shadow:none;background:var(--blue-50);padding:16px 18px;margin-top:16px"><b style="color:var(--navy)">Tài khoản dùng thử</b>
        <div class="info-list" style="margin-top:8px"><div>${ic('graduation-cap')}<span>Sinh viên: <b>SV260001</b> / <b>12345678</b></span><button class="btn btn-sm btn-red" data-fill="student">Dùng</button></div>
        <div>${ic('shield-check')}<span>Ban quản lý: <b>admin</b> / <b>admin123</b></span><button class="btn btn-sm btn-red" data-fill="admin">Dùng</button></div></div></div>`,
        onMount: (el, close) => el.querySelectorAll('[data-fill]').forEach((b) => b.onclick = () => { close(); doLogin(b.dataset.fill, b.dataset.fill === 'admin' ? 'admin' : 'SV260001', b.dataset.fill === 'admin' ? 'admin123' : '12345678'); }) });
      function doLogin(role, id, pw) {
        const err = root.querySelector('#lg-err');
        const fail = (m) => { if (err) { err.textContent = m; err.hidden = false; } };
        if (!id || !pw) return fail('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
        if (role === 'admin') {
          if (!((id === 'admin' || id === 'quanly@dhna.edu.vn') && pw === (K.db.adminPw || 'admin123'))) return fail('Tên đăng nhập hoặc mật khẩu không đúng.');
          K.db.session = { role: 'admin', temp: !root.querySelector('#lg-rem').checked };
        } else {
          const s = K.db.students.find((x) => x.id.toLowerCase() === id.toLowerCase() || x.email.toLowerCase() === id.toLowerCase());
          if (!s || s.password !== pw) return fail('Mã sinh viên/email hoặc mật khẩu không đúng.');
          K.db.session = { role: 'student', id: s.id, temp: !root.querySelector('#lg-rem').checked };
        }
        try { sessionStorage.setItem('ktx-alive', '1'); } catch (e) { /* ignore */ }
        K.save(); App.st.login = null;
        const next = App.pendingRoute; App.pendingRoute = null;
        App.toast('Đăng nhập thành công');
        const ok = next && ((role === 'admin' && next.startsWith('ql-')) || (role === 'student' && next.startsWith('sv-')));
        App.go(ok ? next : (role === 'admin' ? 'ql-tong-quan' : 'sv-tong-quan'));
      }
      root.querySelector('#lg-form').onsubmit = (e) => { e.preventDefault(); st.id = root.querySelector('#lg-id').value.trim(); doLogin(st.role, st.id, root.querySelector('#lg-pw').value); };
    },
  };

  // ============ 5. Đăng ký tài khoản ============
  P['dang-ky'] = {
    title: 'Đăng ký tài khoản',
    render: () => `<div class="auth auth-reg"><div class="left">${App.brand(false)}
      <form class="reg-card" id="rg-form" novalidate>
        <div class="reg-steps"><span class="stepnum on" style="width:40px;height:40px">1</span><b style="color:var(--red);font-weight:600">Tài khoản</b><span class="ln"></span><span class="stepnum" style="background:#fff">2</span><span style="color:var(--text)">Thông tin lưu trú</span></div>
        <h2>Tạo tài khoản sinh viên${spark}</h2><p class="sub">Thông tin của bạn để bắt đầu đăng ký lưu trú.</p>
        <div class="reg-form">
          <div class="field"><label for="rg-name">Họ và tên</label><div class="iwrap">${ic('user-round')}<input id="rg-name" class="input" placeholder="Nhập họ và tên của bạn" autocomplete="name"></div></div>
          <div class="field"><label for="rg-id">Mã sinh viên</label><div class="iwrap">${ic('graduation-cap')}<input id="rg-id" class="input" placeholder="Nhập mã sinh viên"></div></div>
          <div class="field"><label for="rg-mail">Email</label><div class="iwrap">${ic('mail')}<input id="rg-mail" type="email" class="input" placeholder="Nhập email của bạn" autocomplete="email"></div></div>
          <div class="field"><label for="rg-phone">Số điện thoại</label><div class="iwrap">${ic('phone')}<input id="rg-phone" class="input" placeholder="Nhập số điện thoại" inputmode="tel"></div></div>
          <div class="field"><label for="rg-pw">Mật khẩu</label><div class="iwrap">${ic('lock-keyhole')}<input id="rg-pw" type="password" class="input" placeholder="Nhập mật khẩu" autocomplete="new-password"><button type="button" class="eye" aria-label="Hiện mật khẩu">${ic('eye')}</button></div><small class="muted" style="font-size:14.5px">Tối thiểu 8 ký tự</small></div>
          <div class="field"><label for="rg-pw2">Xác nhận mật khẩu</label><div class="iwrap">${ic('lock-keyhole')}<input id="rg-pw2" type="password" class="input" placeholder="Nhập lại mật khẩu" autocomplete="new-password"><button type="button" class="eye" aria-label="Hiện mật khẩu">${ic('eye')}</button></div></div>
        </div>
        <label class="check" style="margin-top:22px;font-size:16.5px"><input type="checkbox" id="rg-agree" style="width:26px;height:26px;border-radius:7px;border-color:#1c3a8e">Tôi đồng ý với <a href="#" id="rg-terms" style="text-decoration:underline">điều khoản sử dụng</a></label>
        <p class="err" id="rg-err" style="margin-top:10px" hidden></p>
        <button class="btn btn-red btn-block btn-lg" style="margin-top:22px;height:54px;font-size:20px">Tạo tài khoản ${ic('arrow-right')}</button>
        <div class="or" style="margin:24px 0 0;font-size:15px;color:var(--ink)"><span>Đã có tài khoản? <a href="#" data-go="dang-nhap" style="text-decoration:underline">Đăng nhập</a></span></div>
      </form></div>
      <div class="right"><a href="#" class="back-link" data-go="trang-chu">Về trang giới thiệu ${ic('arrow-right')}</a></div></div>`,
    mount: (root) => {
      root.querySelector('#rg-terms').onclick = (e) => { e.preventDefault(); App.modal({ title: 'Điều khoản sử dụng', body: `<ol style="line-height:1.8;padding-left:20px;margin:0">${['Thông tin đăng ký phải chính xác, trùng khớp với hồ sơ sinh viên của nhà trường.', 'Mỗi sinh viên chỉ được tạo một tài khoản trên cổng ký túc xá.', 'Bạn chịu trách nhiệm bảo mật mật khẩu và mọi thao tác trên tài khoản của mình.', ...App.RULES.slice(0, 3)].map((x) => `<li>${x}</li>`).join('')}</ol>`, foot: `<button class="btn btn-red" data-ok>Tôi đồng ý</button>`, onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { root.querySelector('#rg-agree').checked = true; close(); } }); };
      root.querySelector('#rg-form').onsubmit = (e) => {
        e.preventDefault();
        const v = (id) => root.querySelector(id).value.trim();
        const err = root.querySelector('#rg-err');
        const fail = (m) => { err.textContent = m; err.hidden = false; };
        const name = v('#rg-name'), id = v('#rg-id').toUpperCase(), mail = v('#rg-mail'), phone = v('#rg-phone'), pw = root.querySelector('#rg-pw').value, pw2 = root.querySelector('#rg-pw2').value;
        if (!name || !id || !mail || !phone || !pw) return fail('Vui lòng điền đầy đủ các trường thông tin.');
        if (!/^SV\d{6}$/.test(id)) return fail('Mã sinh viên gồm “SV” và 6 chữ số, ví dụ SV260099.');
        if (!/^\S+@\S+\.\S+$/.test(mail)) return fail('Email chưa đúng định dạng.');
        if (!/^0\d{9}$/.test(phone.replace(/\s/g, ''))) return fail('Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.');
        if (pw.length < 8) return fail('Mật khẩu cần tối thiểu 8 ký tự.');
        if (pw !== pw2) return fail('Mật khẩu xác nhận không khớp.');
        if (!root.querySelector('#rg-agree').checked) return fail('Bạn cần đồng ý với điều khoản sử dụng.');
        if (K.db.students.some((s) => s.id === id || s.email.toLowerCase() === mail.toLowerCase())) return fail('Mã sinh viên hoặc email đã được đăng ký. Hãy đăng nhập.');
        K.db.students.push({ id, name, email: mail, phone: phone.replace(/\s/g, ''), password: pw, faculty: '', cls: '', course: '2026 – 2030', room: null, bed: null, status: 'moi', avatar: 'av_hoanganh', emergency: { name: '', relation: '', phone: '' } });
        K.db.session = { role: 'student', id };
        K.save();
        App.toast('Tạo tài khoản thành công. Tiếp tục bước thông tin lưu trú.');
        App.go('sv-dang-ky-luu-tru');
      };
    },
  };

  // ============ 6. Quên mật khẩu ============
  P['quen-mat-khau'] = {
    title: 'Khôi phục mật khẩu',
    render: () => {
      const st = App.state('forgot', { step: 1 });
      const steps = ['Nhập email', 'Kiểm tra hộp thư', 'Đặt mật khẩu mới'];
      let form;
      if (st.step === 1) form = `<div class="field"><label for="fg-mail" style="font-size:18px">Email</label><div class="iwrap">${ic('mail')}<input id="fg-mail" type="email" class="input" placeholder="Nhập email của bạn" value="${esc(st.mail || '')}"></div></div><p class="err" id="fg-err" hidden></p><button class="btn btn-red btn-block">Gửi liên kết khôi phục ${ic('arrow-right')}</button>`;
      else if (st.step === 2) form = `<div class="card" style="box-shadow:none;background:var(--blue-50);padding:16px 18px;text-align:left"><b style="color:var(--navy)">Đã gửi mã xác nhận đến ${esc(st.mail)}</b><p class="small muted" style="margin-top:6px">Môi trường dùng thử không gửi email thật. Mã xác nhận của bạn là <b style="color:var(--red);font-size:16px">${st.code}</b>.</p></div><div class="field"><label for="fg-code" style="font-size:18px">Mã xác nhận</label><div class="iwrap">${ic('key-round')}<input id="fg-code" class="input" placeholder="Nhập mã gồm 6 chữ số" inputmode="numeric"></div></div><p class="err" id="fg-err" hidden></p><button class="btn btn-red btn-block">Xác nhận mã ${ic('arrow-right')}</button>`;
      else form = `<div class="field"><label for="fg-pw" style="font-size:18px">Mật khẩu mới</label><div class="iwrap">${ic('lock-keyhole')}<input id="fg-pw" type="password" class="input" placeholder="Tối thiểu 8 ký tự"><button type="button" class="eye">${ic('eye')}</button></div></div><div class="field"><label for="fg-pw2" style="font-size:18px">Nhập lại mật khẩu</label><div class="iwrap">${ic('lock-keyhole')}<input id="fg-pw2" type="password" class="input" placeholder="Nhập lại mật khẩu mới"></div></div><p class="err" id="fg-err" hidden></p><button class="btn btn-red btn-block">Đặt mật khẩu mới ${ic('arrow-right')}</button>`;
      return `<div class="auth-forgot"><div class="art"></div>${App.brand(false)}<a href="#" class="back-link" data-go="trang-chu" style="top:36px;right:56px">${ic('arrow-left')}Về trang giới thiệu</a>
        <div class="forgot-card"><img src="${K.A('ic_shieldmail')}" class="blend" alt=""><h2>Quên mật khẩu?</h2><p class="sub">${st.step === 1 ? 'Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.' : st.step === 2 ? 'Nhập mã xác nhận đã gửi tới hộp thư của bạn.' : 'Tạo mật khẩu mới cho tài khoản của bạn.'}</p>
          <form id="fg-form" novalidate>${form}<button type="button" class="btn btn-soft btn-block" data-go="dang-nhap" style="height:58px;font-weight:600;color:var(--blue-700)">Quay lại đăng nhập</button></form>
          <div class="fsteps">${steps.map((s, i) => `<div class="${i + 1 === st.step ? 'on' : ''}"><span class="stepnum ${i + 1 === st.step ? 'on' : i + 1 < st.step ? 'done' : ''}" style="width:42px;height:42px">${i + 1 < st.step ? ic('check') : i + 1}</span>${s}</div>`).join('')}</div>
        </div></div>`;
    },
    mount: (root) => {
      const st = App.st.forgot;
      root.querySelector('#fg-form').onsubmit = (e) => {
        e.preventDefault();
        const err = root.querySelector('#fg-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        if (st.step === 1) {
          const m = root.querySelector('#fg-mail').value.trim();
          if (!/^\S+@\S+\.\S+$/.test(m)) return fail('Vui lòng nhập email hợp lệ.');
          const s = K.db.students.find((x) => x.email.toLowerCase() === m.toLowerCase());
          if (!s) return fail('Email này chưa được đăng ký trên hệ thống.');
          st.mail = m; st.sid = s.id; st.code = String(Math.floor(100000 + Math.random() * 900000)); st.step = 2; App.refresh();
        } else if (st.step === 2) {
          if (root.querySelector('#fg-code').value.trim() !== st.code) return fail('Mã xác nhận không đúng.');
          st.step = 3; App.refresh();
        } else {
          const p1 = root.querySelector('#fg-pw').value, p2 = root.querySelector('#fg-pw2').value;
          if (p1.length < 8) return fail('Mật khẩu cần tối thiểu 8 ký tự.');
          if (p1 !== p2) return fail('Mật khẩu nhập lại không khớp.');
          K.student(st.sid).password = p1; K.save(); App.st.forgot = null;
          App.toast('Đặt lại mật khẩu thành công. Hãy đăng nhập.');
          App.go('dang-nhap');
        }
      };
    },
  };

  // ============ Sơ đồ 35 màn hình ============
  const SCREENS = [
    [1, 'Chào đón bạn tại ký túc xá', 'trang-chu', null], [2, 'Tìm phòng ký túc xá phù hợp', 'phong-o', null], [3, 'Đăng nhập ký túc xá', 'dang-nhap', null], [4, 'Phòng B204 · Chọn giường trống', 'phong-B204', null], [5, 'Đăng ký tài khoản sinh viên', 'dang-ky', null], [6, 'Khôi phục mật khẩu', 'quen-mat-khau', null],
    [7, 'Tổng quan sinh viên ký túc xá', 'sv-tong-quan', 'student'], [8, 'Đăng ký lưu trú ký túc xá', 'sv-dang-ky-luu-tru', 'student'], [9, 'Phòng A302 · Bạn cùng phòng', 'sv-phong', 'student'], [10, 'Hồ sơ lưu trú và thỏa thuận', 'sv-ho-so', 'student'], [11, 'Hóa đơn và công nợ của tôi', 'sv-hoa-don', 'student'], [12, 'Thanh toán hóa đơn phòng A302', 'sv-thanh-toan-HĐ1026-001', 'student'], [13, 'Theo dõi sửa chữa đèn bàn', 'sv-yeu-cau-SC-026', 'student'], [14, 'Trung tâm yêu cầu sửa chữa', 'sv-sua-chua', 'student'], [15, 'Đăng ký gia hạn lưu trú', 'sv-gia-han', 'student'], [16, 'Yêu cầu chuyển phòng sang B204', 'sv-chuyen-phong', 'student'], [17, 'Trả phòng và bàn giao', 'sv-tra-phong', 'student'], [18, 'Hỗ trợ và gửi phản ánh', 'sv-ho-tro', 'student'], [19, 'Sinh hoạt cộng đồng ký túc xá', 'sv-thong-bao', 'student'], [20, 'Tài khoản cá nhân và bảo mật', 'sv-tai-khoan', 'student'],
    [21, 'Tổng quan ký túc xá', 'ql-tong-quan', 'admin'], [22, 'Quản lý tầng và phòng A302', 'ql-khu-nha', 'admin'], [23, 'Phân giường phòng B204', 'ql-phan-giuong-B204', 'admin'], [24, 'Quản lý sinh viên lưu trú', 'ql-sinh-vien', 'admin'], [25, 'Duyệt hồ sơ lưu trú', 'ql-ho-so', 'admin'], [26, 'Ghi điện nước, lập hóa đơn', 'ql-dien-nuoc', 'admin'], [27, 'Quản lý hợp đồng & bàn giao', 'ql-hop-dong', 'admin'], [28, 'Đối soát thu phí ký túc xá', 'ql-doi-soat', 'admin'], [29, 'Bảng điều phối bảo trì ký túc xá', 'ql-bao-tri', 'admin'], [30, 'Soạn thông báo ký túc xá', 'ql-thong-bao', 'admin'], [31, 'Cài đặt hệ thống và phân quyền', 'ql-cai-dat', 'admin'], [32, 'Báo cáo lưu trú, xuất file', 'ql-bao-cao', 'admin'],
    [33, 'Giao diện đặt phòng hoàn thiện', 'phong-o', null], [34, 'Cập nhật số sinh viên phòng B204', 'sv-dang-ky-luu-tru', 'student'], [35, 'Cập nhật tên hồ sơ lưu trú', 'sv-tong-quan', 'student'],
  ];
  P['so-do'] = {
    title: 'Danh sách màn hình',
    render: () => {
      const grp = (t, a, b) => `<h2 style="font-size:24px;margin:26px 0 14px">${t}</h2><div class="grid g3">${SCREENS.filter((s) => s[0] >= a && s[0] <= b).map((s) => `<button class="card" data-scr="${s[0]}" style="text-align:left;padding:16px 18px;display:flex;gap:14px;align-items:center;cursor:pointer;border:1px solid #e6eef8"><span class="stepnum ${s[3] === 'admin' ? 'done' : s[3] ? 'on' : ''}">${s[0]}</span><span style="min-width:0"><b style="color:var(--navy);display:block">${s[1]}</b><small class="muted">#${s[2]}</small></span>${ic('arrow-right')}</button>`).join('')}</div>`;
      return `${App.pubHeader('so-do')}<div style="padding:30px max(16px,4vw) 50px"><h1 style="font-size:40px;font-weight:800">Danh sách 35 màn hình</h1><p class="muted" style="margin-top:8px;max-width:760px;line-height:1.6">Bấm vào một màn hình để mở. Màn hình sinh viên tự đăng nhập bằng tài khoản <b>SV260001</b>, màn hình quản lý tự đăng nhập bằng tài khoản <b>admin</b>. Ảnh 33, 34, 35 là bản cập nhật của ảnh 2, 8, 7 nên dùng chung màn hình đã chỉnh.</p>
        ${grp('Trang công khai', 1, 6)}${grp('Cổng sinh viên', 7, 20)}${grp('Ban quản lý', 21, 32)}${grp('Bản cập nhật', 33, 35)}</div>${App.pubFooter()}`;
    },
    mount: (root) => {
      App.bindPubNav(root);
      root.querySelectorAll('[data-scr]').forEach((b) => b.onclick = () => {
        const s = SCREENS.find((x) => x[0] === +b.dataset.scr);
        if (s[3] === 'student') K.db.session = { role: 'student', id: 'SV260001' };
        if (s[3] === 'admin') K.db.session = { role: 'admin' };
        if (s[0] === 4) App.st['detail-B204'] = null;
        K.save(); App.go(s[2]);
      });
    },
  };
})();
