/* M\u00e0n h\u00ecnh c\u00f4ng khai: trang ch\u1ee7, t\u00ecm ph\u00f2ng, chi ti\u1ebft ph\u00f2ng, \u0111\u0103ng nh\u1eadp, \u0111\u0103ng k\u00fd, qu\u00ean m\u1eadt kh\u1ea9u, s\u01a1 \u0111\u1ed3 m\u00e0n h\u00ecnh */
(function () {
  const K = window.KTX, { esc, ic, im, av, spark, badge, sel } = App;
  const P = App.pages;

  const RULES = ['Ch\u1ea5p h\u00e0nh n\u1ed9i quy, quy \u0111\u1ecbnh c\u1ee7a k\u00fd t\u00fac x\u00e1 v\u00e0 \u0110\u1ea1i h\u1ecdc Ngh\u1ec7 An.', 'Gi\u1eef g\u00ecn v\u1ec7 sinh, t\u00e0i s\u1ea3n chung; s\u1eed d\u1ee5ng \u0111i\u1ec7n, n\u01b0\u1edbc ti\u1ebft ki\u1ec7m, \u0111\u00fang quy \u0111\u1ecbnh.', 'Kh\u00f4ng t\u1ef1 \u00fd thay \u0111\u1ed5i ph\u00f2ng, gi\u01b0\u1eddng khi ch\u01b0a \u0111\u01b0\u1ee3c ph\u00e9p.', '\u0110\u1ea3m b\u1ea3o an ninh, tr\u1eadt t\u1ef1, ph\u00f2ng ch\u00e1y ch\u1eefa ch\u00e1y trong khu k\u00fd t\u00fac x\u00e1.', 'C\u00f3 tr\u00e1ch nhi\u1ec7m thanh to\u00e1n \u0111\u1ea7y \u0111\u1ee7 c\u00e1c kho\u1ea3n ph\u00ed l\u01b0u tr\u00fa theo quy \u0111\u1ecbnh.', 'Gi\u1edd \u0111\u00f3ng c\u1eeda k\u00fd t\u00fac x\u00e1: 23:00 h\u1eb1ng ng\u00e0y. Kh\u00e1ch \u0111\u1ebfn th\u0103m \u0111\u0103ng k\u00fd t\u1ea1i qu\u1ea7y ti\u1ebfp nh\u1eadn.'];
  App.RULES = RULES;
  App.showRules = () => App.modal({ title: 'N\u1ed9i quy l\u01b0u tr\u00fa', body: `<ol style="padding-left:20px;line-height:1.8;margin:0;color:var(--ink)">${RULES.map((r) => `<li>${r}</li>`).join('')}</ol>`, foot: `<button class="btn btn-red" data-x>T\u00f4i \u0111\u00e3 hi\u1ec3u</button>` });
  App.contact = () => App.modal({ title: 'Li\u00ean h\u1ec7 Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', body: `<div class="info-list lined">
      <div>${ic('phone')}<span>Hotline</span><b>${K.db.general.hotline}</b></div>
      <div>${ic('mail')}<span>Email</span><b>${K.db.general.email}</b></div>
      <div>${ic('map-pin')}<span>\u0110\u1ecba ch\u1ec9</span><b style="text-align:right">${K.db.general.address}</b></div>
      <div>${ic('clock')}<span>Gi\u1edd l\u00e0m vi\u1ec7c</span><b>7:30 \u2013 17:00, Th\u1ee9 Hai \u2013 Th\u1ee9 B\u1ea3y</b></div></div>
      <div class="field" style="margin-top:16px"><label for="ct-msg">\u0110\u1ec3 l\u1ea1i l\u1eddi nh\u1eafn</label><textarea id="ct-msg" class="textarea" placeholder="B\u1ea1n c\u1ea7n t\u01b0 v\u1ea5n v\u1ec1 ph\u00f2ng n\u00e0o, th\u1eddi gian n\u00e0o..."></textarea></div>`,
    foot: `<button class="btn btn-outline" data-x>\u0110\u00f3ng</button><button class="btn btn-red" data-send>${ic('send')}G\u1eedi l\u1eddi nh\u1eafn</button>`,
    onMount: (el, close) => el.querySelector('[data-send]').onclick = () => { const m = el.querySelector('#ct-msg').value.trim(); if (!m) return App.toast('Vui l\u00f2ng nh\u1eadp n\u1ed9i dung l\u1eddi nh\u1eafn', 'err'); const me = K.me(); K.db.contacts.unshift({ id: 'LH-' + Date.now(), name: me ? me.name + ' (' + me.id + ')' : 'Kh\u00e1ch truy c\u1eadp', contact: me ? me.email : 'Kh\u00f4ng \u0111\u1ec3 l\u1ea1i', msg: m, at: K.now(), done: false }); K.save(); close(); App.toast('\u0110\u00e3 g\u1eedi l\u1eddi nh\u1eafn. Ban qu\u1ea3n l\u00fd s\u1ebd li\u00ean h\u1ec7 l\u1ea1i v\u1edbi b\u1ea1n.'); } });

  // ============ 1. Trang ch\u1ee7 ============
  P['trang-chu'] = {
    title: 'Trang ch\u1ee7',
    render: () => `${App.pubHeader('trang-chu')}
    <section class="hero" id="sec-trang-chu"><div class="hero-in">
      <h1>Kh\u1edfi \u0111\u1ea7u h\u00e0nh tr\u00ecnh,<br>t\u1eeb m\u1ed9t n\u01a1i \u1edf t\u1ed1t.${spark}</h1>
      <h2>K\u00fd t\u00fac x\u00e1 \u0110\u1ea1i h\u1ecdc Ngh\u1ec7 An</h2>
      <p>Kh\u00f4ng ch\u1ec9 l\u00e0 n\u01a1i \u1edf, m\u00e0 l\u00e0 kh\u00f4ng gian h\u1ecdc t\u1eadp, k\u1ebft n\u1ed1i v\u00e0 tr\u01b0\u1edfng th\u00e0nh c\u00f9ng nh\u1eefng ng\u01b0\u1eddi b\u1ea1n \u0111\u1ed3ng h\u00e0nh.</p>
      <div class="hero-cta"><a href="#" class="btn btn-red" data-go="phong-o">Kh\u00e1m ph\u00e1 ph\u00f2ng \u1edf ${ic('arrow-right')}</a><a href="#" class="btn btn-outline" data-go="dang-nhap">${ic('user-round')}\u0110\u0103ng nh\u1eadp c\u1ed5ng sinh vi\u00ean</a></div>
    </div></section>
    <section class="steps-band">
      <div class="stepc"><img src="${K.A('step1')}" alt=""><div><h3><span class="num-c">1</span>Ch\u1ecdn ph\u00f2ng</h3><p>Xem th\u00f4ng tin c\u00e1c t\u1ea7ng k\u00fd t\u00fac x\u00e1, ph\u00f2ng \u1edf v\u00e0 ti\u1ec7n \u00edch \u0111i k\u00e8m.</p></div></div>
      ${ic('chevron-right')}
      <div class="stepc"><img src="${K.A('step2')}" alt=""><div><h3><span class="num-c">2</span>\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa</h3><p>\u0110i\u1ec1n th\u00f4ng tin v\u00e0 g\u1eedi h\u1ed3 s\u01a1 tr\u1ef1c tuy\u1ebfn nhanh ch\u00f3ng.</p></div></div>
      ${ic('chevron-right')}
      <div class="stepc"><img src="${K.A('step3')}" alt="" style="width:194px"><div><h3><span class="num-c">3</span>Nh\u1eadn ph\u00f2ng</h3><p>Ho\u00e0n t\u1ea5t th\u1ee7 t\u1ee5c v\u00e0 b\u1eaft \u0111\u1ea7u h\u00e0nh tr\u00ecnh h\u1ecdc t\u1eadp t\u1ea1i KTX.</p></div></div>
    </section>
    <section class="feat2">
      <div class="featc"><div class="tx"><h3><img src="${K.A('ic_cap')}" class="blend" alt="">Kh\u00f4ng gian h\u1ecdc t\u1eadp</h3><p>Ph\u00f2ng h\u1ecdc chung, th\u01b0 vi\u1ec7n mini, kh\u00f4ng gian y\u00ean t\u0129nh gi\u00fap b\u1ea1n t\u1eadp trung v\u00e0 ph\u00e1t tri\u1ec3n b\u1ea3n th\u00e2n m\u1ed7i ng\u00e0y.</p><button class="link" data-feat="study">Xem ti\u1ec7n \u00edch ${ic('arrow-right')}</button></div><img src="${K.A('study')}" alt="Sinh vi\u00ean h\u1ecdc t\u1eadp t\u1ea1i th\u01b0 vi\u1ec7n k\u00fd t\u00fac x\u00e1"></div>
      <div class="featc"><div class="tx"><h3><img src="${K.A('ic_people')}" class="blend" alt="">Cu\u1ed9c s\u1ed1ng sinh vi\u00ean</h3><p>Giao l\u01b0u, k\u1ebft b\u1ea1n, tham gia nhi\u1ec1u ho\u1ea1t \u0111\u1ed9ng v\u0103n h\u00f3a \u2013 th\u1ec3 thao \u2013 t\u00ecnh nguy\u1ec7n s\u00f4i n\u1ed5i.</p><button class="link" data-feat="life">Xem ti\u1ec7n \u00edch ${ic('arrow-right')}</button></div><img src="${K.A('community')}" alt="Sinh vi\u00ean sinh ho\u1ea1t c\u1ed9ng \u0111\u1ed3ng"></div>
    </section>
    ${App.homeSections()}
    ${App.pubFooter()}`,
    mount: (root) => {
      App.bindPubNav(root);
      root.querySelectorAll('[data-feat]').forEach((b) => b.onclick = () => {
        const study = b.dataset.feat === 'study';
        App.modal({ title: study ? 'Ti\u1ec7n \u00edch h\u1ecdc t\u1eadp' : 'Ti\u1ec7n \u00edch sinh ho\u1ea1t', body: `<img src="${K.A(study ? 'study' : 'community')}" style="border-radius:12px;margin-bottom:14px" alt=""><ul style="line-height:1.9;padding-left:20px;margin:0;color:var(--ink)">${(study ? ['Ph\u00f2ng h\u1ecdc chung m\u1edf c\u1eeda 6:00 \u2013 23:00', 'Th\u01b0 vi\u1ec7n mini v\u1edbi h\u01a1n 2.000 \u0111\u1ea7u s\u00e1ch', 'Wi-Fi t\u1ed1c \u0111\u1ed9 cao ph\u1ee7 s\u00f3ng to\u00e0n khu', 'M\u1ed7i gi\u01b0\u1eddng c\u00f3 b\u00e0n h\u1ecdc ri\u00eang, \u0111\u00e8n v\u00e0 \u1ed5 c\u1eafm \u0111i\u1ec7n'] : ['S\u00e2n sinh ho\u1ea1t chung t\u1ea1i m\u1ed7i khu nh\u00e0', 'C\u00e2u l\u1ea1c b\u1ed9 v\u0103n ngh\u1ec7, th\u1ec3 thao, t\u00ecnh nguy\u1ec7n', 'Nh\u00e0 \u0103n, c\u0103ng tin, khu gi\u1eb7t s\u1ea5y', 'B\u1ea3o v\u1ec7 24/7, camera an ninh']).map((x) => `<li>${x}</li>`).join('')}</ul>`, foot: `<a href="#" class="btn btn-red" data-x data-go2="phong-o">Xem ph\u00f2ng \u1edf</a>`, onMount: (el, close) => el.querySelector('[data-go2]').onclick = (e) => { e.preventDefault(); close(); App.go('phong-o'); } });
      });
    },
  };

  // ============ 2 / 33. T\u00ecm ph\u00f2ng ============
  const ORDER = ['A302', 'B204', 'C101', 'B201'];
  const amenIcons = (r) => `<div class="amen4"><div><i class="ab">${ic('bed-single')}</i>${r.beds} gi\u01b0\u1eddng</div><div><i class="ab">${ic('lamp-desk')}</i>B\u00e0n h\u1ecdc</div><div><i class="ab">${ic('wifi')}</i>Wifi</div><div><i class="ab">${ic('sprout')}</i>Ban c\u00f4ng</div></div>`;
  App.freeBadge = (code) => { const f = K.freeBeds(code); const r = K.room(code); if (r.maint) return badge('\u0110ang b\u1ea3o tr\u00ec', 'orange', { icon: 'wrench' }); return f > 0 ? badge('C\u00f2n ' + f + ' ch\u1ed7', 'green', { icon: 'users' }) : badge('\u0110\u00e3 \u0111\u1ee7 ch\u1ed7', 'red', { icon: 'users' }); };
  P['phong-o'] = {
    title: 'T\u00ecm ph\u00f2ng',
    render: () => {
      const st = App.state('rooms', { khu: '', cap: 0, avail: false, desk: false, balcony: false, q: '', sort: 'default', page: 1 });
      let list = K.db.rooms.slice();
      if (st.khu) list = list.filter((r) => r.khu === st.khu);
      if (st.cap) list = list.filter((r) => r.beds === st.cap);
      if (st.avail) list = list.filter((r) => K.freeBeds(r.code) > 0 && !r.maint);
      if (st.desk) list = list.filter((r) => r.amen.includes('desk'));
      if (st.balcony) list = list.filter((r) => r.amen.includes('balcony'));
      if (st.q) { const q = st.q.toLowerCase(); list = list.filter((r) => ('ph\u00f2ng ' + r.code + ' t\u1ea7ng ' + r.khu + ' ' + r.beds + ' ng\u01b0\u1eddi wifi b\u00e0n h\u1ecdc ban c\u00f4ng').toLowerCase().includes(q)); }
      const rank = (c) => { const i = ORDER.indexOf(c); return i < 0 ? 99 : i; };
      const sorts = { default: (a, b) => rank(a.code) - rank(b.code) || a.code.localeCompare(b.code), free: (a, b) => K.freeBeds(b.code) - K.freeBeds(a.code) || rank(a.code) - rank(b.code), asc: (a, b) => a.price - b.price, desc: (a, b) => b.price - a.price, code: (a, b) => a.code.localeCompare(b.code) };
      list.sort(sorts[st.sort]);
      const per = 4, pages = Math.max(1, Math.ceil(list.length / per));
      if (st.page > pages) st.page = pages;
      const cur = list.slice((st.page - 1) * per, st.page * per);
      const startP = Math.max(1, Math.min(st.page - 1, pages - 2));
      const nums = []; for (let i = startP; i <= Math.min(pages, startP + 2); i++) nums.push(i);
      return `${App.pubHeader('phong-o')}
      <section class="pbanner"><img class="art" src="${K.A('banner_rooms')}" alt=""><div class="pbanner-in">${App.crumb([['Trang ch\u1ee7', 'trang-chu'], 'Ph\u00f2ng \u1edf'])}<h1>T\u00ecm ph\u00f2ng ph\u00f9 h\u1ee3p v\u1edbi b\u1ea1n${spark}</h1><p>Kh\u00f4ng gian h\u1ecdc t\u1eadp v\u00e0 sinh ho\u1ea1t ti\u1ec7n nghi, an to\u00e0n, th\u00e2n thi\u1ec7n c\u00f9ng c\u1ed9ng \u0111\u1ed3ng sinh vi\u00ean \u0110\u1ea1i h\u1ecdc Ngh\u1ec7 An.</p></div></section>
      <div class="rooms-wrap">
        <aside class="filter"><div class="filter-h">${ic('list-filter')}B\u1ed9 l\u1ecdc t\u00ecm ph\u00f2ng</div><div class="filter-b">
          <div class="field"><label class="lbl" for="f-khu">T\u1ea7ng</label>${sel('f-khu', [['', 'T\u1ea5t c\u1ea3 t\u1ea7ng'], ...App.khuOpts()], st.khu)}</div>
          <div class="field"><span class="lbl">S\u1ee9c ch\u1ee9a ph\u00f2ng</span><div class="cap-btns">${[2, 4, 6].map((c) => `<button type="button" data-cap="${c}" class="${st.cap === c ? 'on' : ''}">${c} ng\u01b0\u1eddi</button>`).join('')}</div></div>
          <div class="field"><span class="lbl">Ti\u1ec7n \u00edch</span><div class="amen-list">
            <label class="check"><input type="checkbox" id="f-avail" ${st.avail ? 'checked' : ''}>${ic('bed-double')}C\u00f2n ch\u1ed7</label>
            <label class="check"><input type="checkbox" id="f-desk" ${st.desk ? 'checked' : ''}>${ic('lamp-desk')}B\u00e0n h\u1ecdc</label>
            <label class="check"><input type="checkbox" id="f-bal" ${st.balcony ? 'checked' : ''}>${ic('sprout')}Ban c\u00f4ng</label></div></div>
          <button class="btn btn-red btn-block" id="f-apply" style="margin-top:14px;height:48px;font-size:16px">\u00c1p d\u1ee5ng</button>
          <button class="btn btn-outline btn-block" id="f-clear" style="height:48px;font-weight:500">X\u00f3a b\u1ed9 l\u1ecdc</button>
        </div></aside>
        <section style="min-width:0">
          <div class="rl-top"><form class="searchbar" id="f-search">${ic('search')}<input id="f-q" placeholder="T\u00ecm theo m\u00e3 ph\u00f2ng, t\u1ea7ng, ti\u1ec7n \u00edch..." value="${esc(st.q)}"><button class="go" aria-label="T\u00ecm ki\u1ebfm">${ic('search')}</button></form>
            <div class="sortbox">${ic('arrow-down-up')}<span>S\u1eafp x\u1ebfp</span>${sel('f-sort', [['default', 'M\u1eb7c \u0111\u1ecbnh'], ['free', 'C\u00f2n ch\u1ed7 tr\u01b0\u1edbc'], ['asc', 'Gi\u00e1 th\u1ea5p \u2192 cao'], ['desc', 'Gi\u00e1 cao \u2192 th\u1ea5p'], ['code', 'M\u00e3 ph\u00f2ng A \u2192 Z']], st.sort)}</div></div>
          ${cur.length ? `<div class="room-grid">${cur.map((r) => {
            const full = K.freeBeds(r.code) <= 0 || r.maint;
            return `<article class="rcard"><div class="ph"><img src="${K.A(r.img)}" alt="\u1ea2nh ph\u00f2ng ${r.code}"><span class="khu-tag">T\u1ea6NG ${r.khu}</span></div><div class="bd"><h3>Ph\u00f2ng ${r.code}</h3><div class="sub">Ph\u00f2ng ${r.beds} ng\u01b0\u1eddi \u00b7 T\u1ea7ng ${r.khu}</div>${App.freeBadge(r.code)}${amenIcons(r)}
              ${full ? `<button class="btn btn-disabled btn-block" data-go="phong-${r.code}" style="cursor:pointer">${r.maint ? '\u0110ang b\u1ea3o tr\u00ec' : '\u0110\u00e3 \u0111\u1ee7 ch\u1ed7'}</button>` : `<button class="btn btn-red btn-block" data-go="phong-${r.code}">Xem ph\u00f2ng ${ic('arrow-right')}</button>`}</div></article>`;
          }).join('')}</div>` : `<div class="card pad" style="text-align:center;padding:50px"><h3>Kh\u00f4ng t\u00ecm th\u1ea5y ph\u00f2ng ph\u00f9 h\u1ee3p</h3><p class="muted" style="margin-top:8px">Th\u1eed b\u1ecf b\u1edbt \u0111i\u1ec1u ki\u1ec7n l\u1ecdc ho\u1eb7c t\u00ecm theo m\u00e3 ph\u00f2ng kh\u00e1c.</p></div>`}
          <div class="pager"><button data-pg="${st.page - 1}" ${st.page <= 1 ? 'disabled' : ''} aria-label="Trang tr\u01b0\u1edbc">${ic('chevron-left')}</button>${nums.map((n) => `<button data-pg="${n}" class="${n === st.page ? 'on' : ''}">${n}</button>`).join('')}<button data-pg="${st.page + 1}" ${st.page >= pages ? 'disabled' : ''} aria-label="Trang sau">${ic('chevron-right')}</button></div>
          <p class="muted small" style="text-align:center;margin-top:10px">T\u00ecm th\u1ea5y ${list.length} ph\u00f2ng ph\u00f9 h\u1ee3p</p>
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

  // ============ 4. Chi ti\u1ebft ph\u00f2ng ============
  P['phong-detail'] = {
    title: 'Chi ti\u1ebft ph\u00f2ng',
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
        <div class="crumb">${ic('house', 'home')}${ic('chevron-right')}<a href="#" data-go="trang-chu" style="color:var(--ink)">Trang ch\u1ee7</a><span>/</span><a href="#" data-go="phong-o" style="color:var(--ink)">Ph\u00f2ng \u1edf</a><span>/</span><b>${r.code}</b></div>
        <div class="rd-grid">
          <div class="card gallery"><img class="main" id="rd-main" src="${K.A(imgs[st.img])}" alt="\u1ea2nh ph\u00f2ng ${r.code}"><div class="thumbs">${thumbs.map((t, i) => `<img src="${K.A(t)}" data-img="${i}" class="${i === st.img ? 'on' : ''}" alt="">`).join('')}</div></div>
          <div class="card rd-info">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><h1>Ph\u00f2ng ${r.code}</h1>${r.maint ? badge('B\u1ea3o tr\u00ec', 'orange') : free > 0 ? `<span class="badge b-green" style="font-size:16px;padding:9px 18px"><i class="dot" style="width:12px;height:12px;background:#22b24c"></i>C\u00f2n ${free} ch\u1ed7</span>` : badge('\u0110\u00e3 \u0111\u1ee7 ch\u1ed7', 'red')}</div>
            <div class="rd-meta"><span>${ic('building')}<b style="color:var(--navy)">T\u1ea7ng ${r.khu}</b></span><span>${ic('users')}${r.beds} gi\u01b0\u1eddng</span><span>${ic('scan')}Di\u1ec7n t\u00edch ~ ${area} m\u00b2</span></div>
            <div class="price">${ic('coins')}<div><b>Gi\u00e1 ph\u00f2ng</b><div class="amt">${K.money(r.price)} <small>/ th\u00e1ng</small></div><div style="color:var(--text);font-size:16px">\u0110i\u1ec7n, n\u01b0\u1edbc t\u00ednh theo s\u1eed d\u1ee5ng</div></div></div>
            <h3 style="font-size:21px;margin-top:16px">Ch\u1ecdn gi\u01b0\u1eddng</h3>
            <div class="beds" style="grid-template-columns:repeat(${Math.min(4, r.beds)},1fr)">${map.map((b) => `<div class="bed"><button type="button" ${b.free ? `class="free ${st.bed === b.bed ? 'sel' : ''}" data-bed="${b.bed}"` : 'disabled'}>${ic('bed-single')}${b2(b.bed)}</button><small>${b.free ? '\u0110ang tr\u1ed1ng' : '\u0110\u00e3 c\u00f3 ng\u01b0\u1eddi'}</small></div>`).join('')}</div>
            <div class="legend"><span><i class="d" style="background:#8d94a3"></i>\u0110\u00e3 c\u00f3 ng\u01b0\u1eddi \u1edf</span><span style="color:var(--red)"><i class="d" style="background:var(--red)"></i>${free > 0 ? (st.bed ? 'Gi\u01b0\u1eddng ' + b2(st.bed) + ' \u0111ang tr\u1ed1ng' : 'Gi\u01b0\u1eddng tr\u1ed1ng') : 'Kh\u00f4ng c\u00f2n gi\u01b0\u1eddng tr\u1ed1ng'}</span></div>
            ${free > 0 && !r.maint ? `<button class="btn btn-red btn-block btn-lg" id="rd-reg" style="font-size:19px;height:52px">\u0110\u0103ng k\u00fd gi\u01b0\u1eddng ${st.bed ? b2(st.bed) : ''} ${ic('arrow-right')}</button>` : `<button class="btn btn-disabled btn-block btn-lg" disabled>Ph\u00f2ng \u0111\u00e3 \u0111\u1ee7 ch\u1ed7</button>`}
            <div style="text-align:center;margin-top:16px"><button class="link" id="rd-rules" style="color:var(--navy);font-weight:500">${ic('file-text')}<u>Xem n\u1ed9i quy l\u01b0u tr\u00fa</u> ${ic('arrow-right')}</button></div>
          </div>
        </div>
        <div class="rd-low">
          <div class="card" style="padding:14px 24px 16px"><h3 style="font-size:17px">Ti\u1ec7n \u00edch ph\u00f2ng</h3><div class="amen-row">
            <div>${im('am_wifi', 'blend')}<b>Wi-Fi</b><small>T\u1ed1c \u0111\u1ed9 cao,<br>ph\u1ee7 s\u00f3ng to\u00e0n ph\u00f2ng</small></div>
            <div>${im('am_desk', 'blend')}<b>B\u00e0n h\u1ecdc</b><small>C\u00f3 \u0111\u00e8n, \u1ed5 c\u1eafm \u0111i\u1ec7n</small></div>
            <div>${im('am_wardrobe', 'blend')}<b>T\u1ee7 c\u00e1 nh\u00e2n</b><small>M\u1ed7i sinh vi\u00ean 1 t\u1ee7,<br>kh\u00f3a an to\u00e0n</small></div>
            <div>${im('am_wc', 'blend')}<b>Khu v\u1ec7 sinh</b><small>Trong ph\u00f2ng,<br>\u0111\u1ea7y \u0111\u1ee7 ti\u1ec7n nghi</small></div></div></div>
          <div class="card advisor"><img src="${K.A('advisor')}" alt="Nh\u00e2n vi\u00ean t\u01b0 v\u1ea5n"><div><h3>C\u1ea7n t\u01b0 v\u1ea5n ch\u1ecdn ph\u00f2ng?</h3><p>\u0110\u1ed9i ng\u0169 h\u1ed7 tr\u1ee3 KTX lu\u00f4n s\u1eb5n s\u00e0ng gi\u1ea3i \u0111\u00e1p th\u1eafc m\u1eafc v\u00e0 gi\u00fap b\u1ea1n ch\u1ecdn ph\u00f2ng ph\u00f9 h\u1ee3p.</p><button class="btn btn-outline-red" id="rd-contact" style="height:42px">${ic('message-circle-more')}Li\u00ean h\u1ec7 t\u01b0 v\u1ea5n ${ic('arrow-right')}</button></div></div>
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
        if (!st.bed) return App.toast('Vui l\u00f2ng ch\u1ecdn m\u1ed9t gi\u01b0\u1eddng tr\u1ed1ng', 'err');
        App.st.booking = { room: r.code, bed: st.bed };
        const s = K.db.session;
        if (s && s.role === 'admin') return App.toast('T\u00e0i kho\u1ea3n qu\u1ea3n l\u00fd kh\u00f4ng th\u1ec3 \u0111\u0103ng k\u00fd gi\u01b0\u1eddng. Vui l\u00f2ng d\u00f9ng t\u00e0i kho\u1ea3n sinh vi\u00ean.', 'err');
        if (!s) { App.pendingRoute = 'sv-dang-ky-luu-tru'; App.st.login = { role: 'student', msg: '\u0110\u0103ng nh\u1eadp \u0111\u1ec3 \u0111\u0103ng k\u00fd gi\u01b0\u1eddng ' + K.pad2(st.bed) + ' ph\u00f2ng ' + r.code + '.' }; return App.go('dang-nhap'); }
        const me = K.me();
        if (me && me.room) { if (me.room === r.code) return App.toast('B\u1ea1n \u0111ang \u1edf ph\u00f2ng ' + r.code + ' r\u1ed3i.'); App.st.transfer = null; App.st.transferPick = r.code; App.toast('B\u1ea1n \u0111ang \u1edf ph\u00f2ng ' + me.room + '. Chuy\u1ec3n sang y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng t\u1edbi ' + r.code + '.'); return App.go('sv-chuyen-phong'); }
        App.st.reg = null; App.go('sv-dang-ky-luu-tru');
      };
    },
  };

  // ============ 3. \u0110\u0103ng nh\u1eadp ============
  P['dang-nhap'] = {
    title: '\u0110\u0103ng nh\u1eadp',
    render: () => {
      const st = App.state('login', { role: 'student' });
      const adm = st.role === 'admin';
      return `<div class="auth auth-login">
        <div class="auth-art">${App.brand(false)}<div class="txt"><h1>Ch\u00e0o m\u1eebng<br>b\u1ea1n tr\u1edf l\u1ea1i!${spark}</h1><p>C\u00f9ng ti\u1ebfp t\u1ee5c h\u00e0nh tr\u00ecnh h\u1ecdc t\u1eadp v\u00e0 tr\u1ea3i nghi\u1ec7m t\u1ea1i K\u00fd t\u00fac x\u00e1 \u0110\u1ea1i h\u1ecdc Ngh\u1ec7 An.</p></div></div>
        <div class="auth-side"><a href="#" class="back-link" data-go="trang-chu">${ic('arrow-left')}V\u1ec1 trang gi\u1edbi thi\u1ec7u</a>
          <form class="auth-card" id="lg-form" novalidate><h2>\u0110\u0103ng nh\u1eadp</h2><p class="sub">Truy c\u1eadp h\u1ec7 th\u1ed1ng k\u00fd t\u00fac x\u00e1</p>
            <div class="role-sw"><button type="button" data-role="student" class="${adm ? '' : 'on'}">Sinh vi\u00ean</button><button type="button" data-role="admin" class="${adm ? 'on' : ''}">Ban qu\u1ea3n l\u00fd</button></div>
            ${st.msg ? `<p class="err" style="margin:-10px 0 14px">${esc(st.msg)}</p>` : ''}
            <div class="field"><label for="lg-id">${adm ? 'T\u00ean \u0111\u0103ng nh\u1eadp ho\u1eb7c email' : 'M\u00e3 sinh vi\u00ean ho\u1eb7c email'}</label><div class="iwrap">${ic('user-round')}<input id="lg-id" class="input" autocomplete="username" placeholder="${adm ? 'Nh\u1eadp t\u00ean \u0111\u0103ng nh\u1eadp ho\u1eb7c email' : 'Nh\u1eadp m\u00e3 sinh vi\u00ean ho\u1eb7c email'}" value="${esc(st.id || '')}"></div></div>
            <div class="field" style="margin-top:20px"><label for="lg-pw">M\u1eadt kh\u1ea9u</label><div class="iwrap">${ic('lock-keyhole')}<input id="lg-pw" type="password" class="input" autocomplete="current-password" placeholder="Nh\u1eadp m\u1eadt kh\u1ea9u"><button type="button" class="eye" data-closed="eye-off" data-open="eye" aria-label="Hi\u1ec7n m\u1eadt kh\u1ea9u">${ic('eye-off')}</button></div></div>
            <p class="err" id="lg-err" style="margin-top:8px" hidden></p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px"><label class="check"><input type="checkbox" id="lg-rem" checked>Ghi nh\u1edb \u0111\u0103ng nh\u1eadp</label><a href="#" data-go="quen-mat-khau" style="color:var(--blue-700);text-decoration:underline;font-weight:500">Qu\u00ean m\u1eadt kh\u1ea9u?</a></div>
            <button class="btn btn-red btn-block btn-lg" style="margin-top:28px;height:58px;font-size:20px">\u0110\u0103ng nh\u1eadp ${ic('arrow-right')}</button>
            <div class="or">ho\u1eb7c</div>
            <p style="text-align:center;font-size:17px;color:var(--navy)">Ch\u01b0a c\u00f3 t\u00e0i kho\u1ea3n? <a href="#" data-go="dang-ky" style="color:var(--red);font-weight:700;margin-left:8px">\u0110\u0103ng k\u00fd ${ic('arrow-right')}</a></p>
            <button type="button" class="help-box" id="lg-help">${ic('circle-help')}<span><b>C\u1ea7n h\u1ed7 tr\u1ee3 \u0111\u0103ng nh\u1eadp?</b><small>Li\u00ean h\u1ec7 Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1 \u0111\u1ec3 \u0111\u01b0\u1ee3c h\u1ed7 tr\u1ee3.</small></span>${ic('arrow-right')}</button>
          </form></div></div>`;
    },
    mount: (root) => {
      const st = App.st.login;
      root.querySelectorAll('[data-role]').forEach((b) => b.onclick = () => { st.role = b.dataset.role; st.msg = ''; App.refresh(); });
      root.querySelector('#lg-help').onclick = () => App.modal({ title: 'H\u1ed7 tr\u1ee3 \u0111\u0103ng nh\u1eadp', body: `<p style="line-height:1.6">Li\u00ean h\u1ec7 Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1 qua hotline <b>${K.db.general.hotline}</b> ho\u1eb7c email <b>${K.db.general.email}</b>.</p>
        <div class="card" style="box-shadow:none;background:var(--blue-50);padding:16px 18px;margin-top:16px"><b style="color:var(--navy)">T\u00e0i kho\u1ea3n d\u00f9ng th\u1eed</b>
        <div class="info-list" style="margin-top:8px"><div>${ic('graduation-cap')}<span>Sinh vi\u00ean: <b>SV260001</b> / <b>12345678</b></span><button class="btn btn-sm btn-red" data-fill="student">D\u00f9ng</button></div>
        <div>${ic('shield-check')}<span>Ban qu\u1ea3n l\u00fd: <b>admin</b> / <b>admin123</b></span><button class="btn btn-sm btn-red" data-fill="admin">D\u00f9ng</button></div></div></div>`,
        onMount: (el, close) => el.querySelectorAll('[data-fill]').forEach((b) => b.onclick = () => { close(); doLogin(b.dataset.fill, b.dataset.fill === 'admin' ? 'admin' : 'SV260001', b.dataset.fill === 'admin' ? 'admin123' : '12345678'); }) });
      function doLogin(role, id, pw) {
        const err = root.querySelector('#lg-err');
        const fail = (m) => { if (err) { err.textContent = m; err.hidden = false; } };
        if (!id || !pw) return fail('Vui l\u00f2ng nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 t\u00e0i kho\u1ea3n v\u00e0 m\u1eadt kh\u1ea9u.');
        if (role === 'admin') {
          if (!((id === 'admin' || id === 'quanly@dhna.edu.vn') && pw === (K.db.adminPw || 'admin123'))) return fail('T\u00ean \u0111\u0103ng nh\u1eadp ho\u1eb7c m\u1eadt kh\u1ea9u kh\u00f4ng \u0111\u00fang.');
          K.db.session = { role: 'admin', temp: !root.querySelector('#lg-rem').checked };
        } else {
          const s = K.db.students.find((x) => x.id.toLowerCase() === id.toLowerCase() || x.email.toLowerCase() === id.toLowerCase());
          if (!s || s.password !== pw) return fail('M\u00e3 sinh vi\u00ean/email ho\u1eb7c m\u1eadt kh\u1ea9u kh\u00f4ng \u0111\u00fang.');
          K.db.session = { role: 'student', id: s.id, temp: !root.querySelector('#lg-rem').checked };
        }
        try { sessionStorage.setItem('ktx-alive', '1'); } catch (e) { /* ignore */ }
        K.save(); App.st.login = null;
        const next = App.pendingRoute; App.pendingRoute = null;
        App.toast('\u0110\u0103ng nh\u1eadp th\u00e0nh c\u00f4ng');
        const ok = next && ((role === 'admin' && next.startsWith('ql-')) || (role === 'student' && next.startsWith('sv-')));
        App.go(ok ? next : (role === 'admin' ? 'ql-tong-quan' : 'sv-tong-quan'));
      }
      root.querySelector('#lg-form').onsubmit = (e) => { e.preventDefault(); st.id = root.querySelector('#lg-id').value.trim(); doLogin(st.role, st.id, root.querySelector('#lg-pw').value); };
    },
  };

  // ============ 5. \u0110\u0103ng k\u00fd t\u00e0i kho\u1ea3n ============
  P['dang-ky'] = {
    title: '\u0110\u0103ng k\u00fd t\u00e0i kho\u1ea3n',
    render: () => `<div class="auth auth-reg"><div class="left">${App.brand(false)}
      <form class="reg-card" id="rg-form" novalidate>
        <div class="reg-steps"><span class="stepnum on" style="width:40px;height:40px">1</span><b style="color:var(--red);font-weight:600">T\u00e0i kho\u1ea3n</b><span class="ln"></span><span class="stepnum" style="background:#fff">2</span><span style="color:var(--text)">Th\u00f4ng tin l\u01b0u tr\u00fa</span></div>
        <h2>T\u1ea1o t\u00e0i kho\u1ea3n sinh vi\u00ean${spark}</h2><p class="sub">Th\u00f4ng tin c\u1ee7a b\u1ea1n \u0111\u1ec3 b\u1eaft \u0111\u1ea7u \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa.</p>
        <div class="reg-form">
          <div class="field"><label for="rg-name">H\u1ecd v\u00e0 t\u00ean</label><div class="iwrap">${ic('user-round')}<input id="rg-name" class="input" placeholder="Nh\u1eadp h\u1ecd v\u00e0 t\u00ean c\u1ee7a b\u1ea1n" autocomplete="name"></div></div>
          <div class="field"><label for="rg-id">M\u00e3 sinh vi\u00ean</label><div class="iwrap">${ic('graduation-cap')}<input id="rg-id" class="input" placeholder="Nh\u1eadp m\u00e3 sinh vi\u00ean"></div></div>
          <div class="field"><label for="rg-mail">Email</label><div class="iwrap">${ic('mail')}<input id="rg-mail" type="email" class="input" placeholder="Nh\u1eadp email c\u1ee7a b\u1ea1n" autocomplete="email"></div></div>
          <div class="field"><label for="rg-phone">S\u1ed1 \u0111i\u1ec7n tho\u1ea1i</label><div class="iwrap">${ic('phone')}<input id="rg-phone" class="input" placeholder="Nh\u1eadp s\u1ed1 \u0111i\u1ec7n tho\u1ea1i" inputmode="tel"></div></div>
          <div class="field"><label for="rg-pw">M\u1eadt kh\u1ea9u</label><div class="iwrap">${ic('lock-keyhole')}<input id="rg-pw" type="password" class="input" placeholder="Nh\u1eadp m\u1eadt kh\u1ea9u" autocomplete="new-password"><button type="button" class="eye" aria-label="Hi\u1ec7n m\u1eadt kh\u1ea9u">${ic('eye')}</button></div><small class="muted" style="font-size:14.5px">T\u1ed1i thi\u1ec3u 8 k\u00fd t\u1ef1</small></div>
          <div class="field"><label for="rg-pw2">X\u00e1c nh\u1eadn m\u1eadt kh\u1ea9u</label><div class="iwrap">${ic('lock-keyhole')}<input id="rg-pw2" type="password" class="input" placeholder="Nh\u1eadp l\u1ea1i m\u1eadt kh\u1ea9u" autocomplete="new-password"><button type="button" class="eye" aria-label="Hi\u1ec7n m\u1eadt kh\u1ea9u">${ic('eye')}</button></div></div>
        </div>
        <label class="check" style="margin-top:22px;font-size:16.5px"><input type="checkbox" id="rg-agree" style="width:26px;height:26px;border-radius:7px;border-color:#1c3a8e">T\u00f4i \u0111\u1ed3ng \u00fd v\u1edbi <a href="#" id="rg-terms" style="text-decoration:underline">\u0111i\u1ec1u kho\u1ea3n s\u1eed d\u1ee5ng</a></label>
        <p class="err" id="rg-err" style="margin-top:10px" hidden></p>
        <button class="btn btn-red btn-block btn-lg" style="margin-top:22px;height:54px;font-size:20px">T\u1ea1o t\u00e0i kho\u1ea3n ${ic('arrow-right')}</button>
        <div class="or" style="margin:24px 0 0;font-size:15px;color:var(--ink)"><span>\u0110\u00e3 c\u00f3 t\u00e0i kho\u1ea3n? <a href="#" data-go="dang-nhap" style="text-decoration:underline">\u0110\u0103ng nh\u1eadp</a></span></div>
      </form></div>
      <div class="right"><a href="#" class="back-link" data-go="trang-chu">V\u1ec1 trang gi\u1edbi thi\u1ec7u ${ic('arrow-right')}</a></div></div>`,
    mount: (root) => {
      root.querySelector('#rg-terms').onclick = (e) => { e.preventDefault(); App.modal({ title: '\u0110i\u1ec1u kho\u1ea3n s\u1eed d\u1ee5ng', body: `<ol style="line-height:1.8;padding-left:20px;margin:0">${['Th\u00f4ng tin \u0111\u0103ng k\u00fd ph\u1ea3i ch\u00ednh x\u00e1c, tr\u00f9ng kh\u1edbp v\u1edbi h\u1ed3 s\u01a1 sinh vi\u00ean c\u1ee7a nh\u00e0 tr\u01b0\u1eddng.', 'M\u1ed7i sinh vi\u00ean ch\u1ec9 \u0111\u01b0\u1ee3c t\u1ea1o m\u1ed9t t\u00e0i kho\u1ea3n tr\u00ean c\u1ed5ng k\u00fd t\u00fac x\u00e1.', 'B\u1ea1n ch\u1ecbu tr\u00e1ch nhi\u1ec7m b\u1ea3o m\u1eadt m\u1eadt kh\u1ea9u v\u00e0 m\u1ecdi thao t\u00e1c tr\u00ean t\u00e0i kho\u1ea3n c\u1ee7a m\u00ecnh.', ...App.RULES.slice(0, 3)].map((x) => `<li>${x}</li>`).join('')}</ol>`, foot: `<button class="btn btn-red" data-ok>T\u00f4i \u0111\u1ed3ng \u00fd</button>`, onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { root.querySelector('#rg-agree').checked = true; close(); } }); };
      root.querySelector('#rg-form').onsubmit = (e) => {
        e.preventDefault();
        const v = (id) => root.querySelector(id).value.trim();
        const err = root.querySelector('#rg-err');
        const fail = (m) => { err.textContent = m; err.hidden = false; };
        const name = v('#rg-name'), id = v('#rg-id').toUpperCase(), mail = v('#rg-mail'), phone = v('#rg-phone'), pw = root.querySelector('#rg-pw').value, pw2 = root.querySelector('#rg-pw2').value;
        if (!name || !id || !mail || !phone || !pw) return fail('Vui l\u00f2ng \u0111i\u1ec1n \u0111\u1ea7y \u0111\u1ee7 c\u00e1c tr\u01b0\u1eddng th\u00f4ng tin.');
        if (!/^SV\d{6}$/.test(id)) return fail('M\u00e3 sinh vi\u00ean g\u1ed3m \u201cSV\u201d v\u00e0 6 ch\u1eef s\u1ed1, v\u00ed d\u1ee5 SV260099.');
        if (!/^\S+@\S+\.\S+$/.test(mail)) return fail('Email ch\u01b0a \u0111\u00fang \u0111\u1ecbnh d\u1ea1ng.');
        if (!/^0\d{9}$/.test(phone.replace(/\s/g, ''))) return fail('S\u1ed1 \u0111i\u1ec7n tho\u1ea1i g\u1ed3m 10 ch\u1eef s\u1ed1, b\u1eaft \u0111\u1ea7u b\u1eb1ng 0.');
        if (pw.length < 8) return fail('M\u1eadt kh\u1ea9u c\u1ea7n t\u1ed1i thi\u1ec3u 8 k\u00fd t\u1ef1.');
        if (pw !== pw2) return fail('M\u1eadt kh\u1ea9u x\u00e1c nh\u1eadn kh\u00f4ng kh\u1edbp.');
        if (!root.querySelector('#rg-agree').checked) return fail('B\u1ea1n c\u1ea7n \u0111\u1ed3ng \u00fd v\u1edbi \u0111i\u1ec1u kho\u1ea3n s\u1eed d\u1ee5ng.');
        if (K.db.students.some((s) => s.id === id || s.email.toLowerCase() === mail.toLowerCase())) return fail('M\u00e3 sinh vi\u00ean ho\u1eb7c email \u0111\u00e3 \u0111\u01b0\u1ee3c \u0111\u0103ng k\u00fd. H\u00e3y \u0111\u0103ng nh\u1eadp.');
        K.db.students.push({ id, name, email: mail, phone: phone.replace(/\s/g, ''), password: pw, faculty: '', cls: '', course: '2026 \u2013 2030', room: null, bed: null, status: 'moi', avatar: 'av_hoanganh', emergency: { name: '', relation: '', phone: '' } });
        K.db.session = { role: 'student', id };
        K.save();
        App.toast('T\u1ea1o t\u00e0i kho\u1ea3n th\u00e0nh c\u00f4ng. Ti\u1ebfp t\u1ee5c b\u01b0\u1edbc th\u00f4ng tin l\u01b0u tr\u00fa.');
        App.go('sv-dang-ky-luu-tru');
      };
    },
  };

  // ============ 6. Qu\u00ean m\u1eadt kh\u1ea9u ============
  P['quen-mat-khau'] = {
    title: 'Kh\u00f4i ph\u1ee5c m\u1eadt kh\u1ea9u',
    render: () => {
      const st = App.state('forgot', { step: 1 });
      const steps = ['Nh\u1eadp email', 'Ki\u1ec3m tra h\u1ed9p th\u01b0', '\u0110\u1eb7t m\u1eadt kh\u1ea9u m\u1edbi'];
      let form;
      if (st.step === 1) form = `<div class="field"><label for="fg-mail" style="font-size:18px">Email</label><div class="iwrap">${ic('mail')}<input id="fg-mail" type="email" class="input" placeholder="Nh\u1eadp email c\u1ee7a b\u1ea1n" value="${esc(st.mail || '')}"></div></div><p class="err" id="fg-err" hidden></p><button class="btn btn-red btn-block">G\u1eedi li\u00ean k\u1ebft kh\u00f4i ph\u1ee5c ${ic('arrow-right')}</button>`;
      else if (st.step === 2) form = `<div class="card" style="box-shadow:none;background:var(--blue-50);padding:16px 18px;text-align:left"><b style="color:var(--navy)">\u0110\u00e3 g\u1eedi m\u00e3 x\u00e1c nh\u1eadn \u0111\u1ebfn ${esc(st.mail)}</b><p class="small muted" style="margin-top:6px">M\u00f4i tr\u01b0\u1eddng d\u00f9ng th\u1eed kh\u00f4ng g\u1eedi email th\u1eadt. M\u00e3 x\u00e1c nh\u1eadn c\u1ee7a b\u1ea1n l\u00e0 <b style="color:var(--red);font-size:16px">${st.code}</b>.</p></div><div class="field"><label for="fg-code" style="font-size:18px">M\u00e3 x\u00e1c nh\u1eadn</label><div class="iwrap">${ic('key-round')}<input id="fg-code" class="input" placeholder="Nh\u1eadp m\u00e3 g\u1ed3m 6 ch\u1eef s\u1ed1" inputmode="numeric"></div></div><p class="err" id="fg-err" hidden></p><button class="btn btn-red btn-block">X\u00e1c nh\u1eadn m\u00e3 ${ic('arrow-right')}</button>`;
      else form = `<div class="field"><label for="fg-pw" style="font-size:18px">M\u1eadt kh\u1ea9u m\u1edbi</label><div class="iwrap">${ic('lock-keyhole')}<input id="fg-pw" type="password" class="input" placeholder="T\u1ed1i thi\u1ec3u 8 k\u00fd t\u1ef1"><button type="button" class="eye">${ic('eye')}</button></div></div><div class="field"><label for="fg-pw2" style="font-size:18px">Nh\u1eadp l\u1ea1i m\u1eadt kh\u1ea9u</label><div class="iwrap">${ic('lock-keyhole')}<input id="fg-pw2" type="password" class="input" placeholder="Nh\u1eadp l\u1ea1i m\u1eadt kh\u1ea9u m\u1edbi"></div></div><p class="err" id="fg-err" hidden></p><button class="btn btn-red btn-block">\u0110\u1eb7t m\u1eadt kh\u1ea9u m\u1edbi ${ic('arrow-right')}</button>`;
      return `<div class="auth-forgot"><div class="art"></div>${App.brand(false)}<a href="#" class="back-link" data-go="trang-chu" style="top:36px;right:56px">${ic('arrow-left')}V\u1ec1 trang gi\u1edbi thi\u1ec7u</a>
        <div class="forgot-card"><img src="${K.A('ic_shieldmail')}" class="blend" alt=""><h2>Qu\u00ean m\u1eadt kh\u1ea9u?</h2><p class="sub">${st.step === 1 ? 'Nh\u1eadp email \u0111\u00e3 \u0111\u0103ng k\u00fd \u0111\u1ec3 nh\u1eadn li\u00ean k\u1ebft \u0111\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u.' : st.step === 2 ? 'Nh\u1eadp m\u00e3 x\u00e1c nh\u1eadn \u0111\u00e3 g\u1eedi t\u1edbi h\u1ed9p th\u01b0 c\u1ee7a b\u1ea1n.' : 'T\u1ea1o m\u1eadt kh\u1ea9u m\u1edbi cho t\u00e0i kho\u1ea3n c\u1ee7a b\u1ea1n.'}</p>
          <form id="fg-form" novalidate>${form}<button type="button" class="btn btn-soft btn-block" data-go="dang-nhap" style="height:58px;font-weight:600;color:var(--blue-700)">Quay l\u1ea1i \u0111\u0103ng nh\u1eadp</button></form>
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
          if (!/^\S+@\S+\.\S+$/.test(m)) return fail('Vui l\u00f2ng nh\u1eadp email h\u1ee3p l\u1ec7.');
          const s = K.db.students.find((x) => x.email.toLowerCase() === m.toLowerCase());
          if (!s) return fail('Email n\u00e0y ch\u01b0a \u0111\u01b0\u1ee3c \u0111\u0103ng k\u00fd tr\u00ean h\u1ec7 th\u1ed1ng.');
          st.mail = m; st.sid = s.id; st.code = String(Math.floor(100000 + Math.random() * 900000)); st.step = 2; App.refresh();
        } else if (st.step === 2) {
          if (root.querySelector('#fg-code').value.trim() !== st.code) return fail('M\u00e3 x\u00e1c nh\u1eadn kh\u00f4ng \u0111\u00fang.');
          st.step = 3; App.refresh();
        } else {
          const p1 = root.querySelector('#fg-pw').value, p2 = root.querySelector('#fg-pw2').value;
          if (p1.length < 8) return fail('M\u1eadt kh\u1ea9u c\u1ea7n t\u1ed1i thi\u1ec3u 8 k\u00fd t\u1ef1.');
          if (p1 !== p2) return fail('M\u1eadt kh\u1ea9u nh\u1eadp l\u1ea1i kh\u00f4ng kh\u1edbp.');
          K.student(st.sid).password = p1; K.save(); App.st.forgot = null;
          App.toast('\u0110\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u th\u00e0nh c\u00f4ng. H\u00e3y \u0111\u0103ng nh\u1eadp.');
          App.go('dang-nhap');
        }
      };
    },
  };

  // ============ S\u01a1 \u0111\u1ed3 35 m\u00e0n h\u00ecnh ============
  const SCREENS = [
    [1, 'Ch\u00e0o \u0111\u00f3n b\u1ea1n t\u1ea1i k\u00fd t\u00fac x\u00e1', 'trang-chu', null], [2, 'T\u00ecm ph\u00f2ng k\u00fd t\u00fac x\u00e1 ph\u00f9 h\u1ee3p', 'phong-o', null], [3, '\u0110\u0103ng nh\u1eadp k\u00fd t\u00fac x\u00e1', 'dang-nhap', null], [4, 'Ph\u00f2ng B204 \u00b7 Ch\u1ecdn gi\u01b0\u1eddng tr\u1ed1ng', 'phong-B204', null], [5, '\u0110\u0103ng k\u00fd t\u00e0i kho\u1ea3n sinh vi\u00ean', 'dang-ky', null], [6, 'Kh\u00f4i ph\u1ee5c m\u1eadt kh\u1ea9u', 'quen-mat-khau', null],
    [7, 'T\u1ed5ng quan sinh vi\u00ean k\u00fd t\u00fac x\u00e1', 'sv-tong-quan', 'student'], [8, '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa k\u00fd t\u00fac x\u00e1', 'sv-dang-ky-luu-tru', 'student'], [9, 'Ph\u00f2ng A302 \u00b7 B\u1ea1n c\u00f9ng ph\u00f2ng', 'sv-phong', 'student'], [10, 'H\u1ed3 s\u01a1 l\u01b0u tr\u00fa v\u00e0 th\u1ecfa thu\u1eadn', 'sv-ho-so', 'student'], [11, 'H\u00f3a \u0111\u01a1n v\u00e0 c\u00f4ng n\u1ee3 c\u1ee7a t\u00f4i', 'sv-hoa-don', 'student'], [12, 'Thanh to\u00e1n h\u00f3a \u0111\u01a1n ph\u00f2ng A302', 'sv-thanh-toan-H\u01101026-001', 'student'], [13, 'Theo d\u00f5i s\u1eeda ch\u1eefa \u0111\u00e8n b\u00e0n', 'sv-yeu-cau-SC-026', 'student'], [14, 'Trung t\u00e2m y\u00eau c\u1ea7u s\u1eeda ch\u1eefa', 'sv-sua-chua', 'student'], [15, '\u0110\u0103ng k\u00fd gia h\u1ea1n l\u01b0u tr\u00fa', 'sv-gia-han', 'student'], [16, 'Y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng sang B204', 'sv-chuyen-phong', 'student'], [17, 'Tr\u1ea3 ph\u00f2ng v\u00e0 b\u00e0n giao', 'sv-tra-phong', 'student'], [18, 'H\u1ed7 tr\u1ee3 v\u00e0 g\u1eedi ph\u1ea3n \u00e1nh', 'sv-ho-tro', 'student'], [19, 'Sinh ho\u1ea1t c\u1ed9ng \u0111\u1ed3ng k\u00fd t\u00fac x\u00e1', 'sv-thong-bao', 'student'], [20, 'T\u00e0i kho\u1ea3n c\u00e1 nh\u00e2n v\u00e0 b\u1ea3o m\u1eadt', 'sv-tai-khoan', 'student'],
    [21, 'T\u1ed5ng quan k\u00fd t\u00fac x\u00e1', 'ql-tong-quan', 'admin'], [22, 'Qu\u1ea3n l\u00fd t\u1ea7ng v\u00e0 ph\u00f2ng A302', 'ql-khu-nha', 'admin'], [23, 'Ph\u00e2n gi\u01b0\u1eddng ph\u00f2ng B204', 'ql-phan-giuong-B204', 'admin'], [24, 'Qu\u1ea3n l\u00fd sinh vi\u00ean l\u01b0u tr\u00fa', 'ql-sinh-vien', 'admin'], [25, 'Duy\u1ec7t h\u1ed3 s\u01a1 l\u01b0u tr\u00fa', 'ql-ho-so', 'admin'], [26, 'Ghi \u0111i\u1ec7n n\u01b0\u1edbc, l\u1eadp h\u00f3a \u0111\u01a1n', 'ql-dien-nuoc', 'admin'], [27, 'Qu\u1ea3n l\u00fd h\u1ee3p \u0111\u1ed3ng & b\u00e0n giao', 'ql-hop-dong', 'admin'], [28, '\u0110\u1ed1i so\u00e1t thu ph\u00ed k\u00fd t\u00fac x\u00e1', 'ql-doi-soat', 'admin'], [29, 'B\u1ea3ng \u0111i\u1ec1u ph\u1ed1i b\u1ea3o tr\u00ec k\u00fd t\u00fac x\u00e1', 'ql-bao-tri', 'admin'], [30, 'So\u1ea1n th\u00f4ng b\u00e1o k\u00fd t\u00fac x\u00e1', 'ql-thong-bao', 'admin'], [31, 'C\u00e0i \u0111\u1eb7t h\u1ec7 th\u1ed1ng v\u00e0 ph\u00e2n quy\u1ec1n', 'ql-cai-dat', 'admin'], [32, 'B\u00e1o c\u00e1o l\u01b0u tr\u00fa, xu\u1ea5t file', 'ql-bao-cao', 'admin'],
    [33, 'Giao di\u1ec7n \u0111\u1eb7t ph\u00f2ng ho\u00e0n thi\u1ec7n', 'phong-o', null], [34, 'C\u1eadp nh\u1eadt s\u1ed1 sinh vi\u00ean ph\u00f2ng B204', 'sv-dang-ky-luu-tru', 'student'], [35, 'C\u1eadp nh\u1eadt t\u00ean h\u1ed3 s\u01a1 l\u01b0u tr\u00fa', 'sv-tong-quan', 'student'],
  ];
  P['so-do'] = {
    title: 'Danh s\u00e1ch m\u00e0n h\u00ecnh',
    render: () => {
      const grp = (t, a, b) => `<h2 style="font-size:24px;margin:26px 0 14px">${t}</h2><div class="grid g3">${SCREENS.filter((s) => s[0] >= a && s[0] <= b).map((s) => `<button class="card" data-scr="${s[0]}" style="text-align:left;padding:16px 18px;display:flex;gap:14px;align-items:center;cursor:pointer;border:1px solid #e6eef8"><span class="stepnum ${s[3] === 'admin' ? 'done' : s[3] ? 'on' : ''}">${s[0]}</span><span style="min-width:0"><b style="color:var(--navy);display:block">${s[1]}</b><small class="muted">#${s[2]}</small></span>${ic('arrow-right')}</button>`).join('')}</div>`;
      return `${App.pubHeader('so-do')}<div style="padding:30px max(16px,4vw) 50px"><h1 style="font-size:40px;font-weight:800">Danh s\u00e1ch 35 m\u00e0n h\u00ecnh</h1><p class="muted" style="margin-top:8px;max-width:760px;line-height:1.6">B\u1ea5m v\u00e0o m\u1ed9t m\u00e0n h\u00ecnh \u0111\u1ec3 m\u1edf. M\u00e0n h\u00ecnh sinh vi\u00ean t\u1ef1 \u0111\u0103ng nh\u1eadp b\u1eb1ng t\u00e0i kho\u1ea3n <b>SV260001</b>, m\u00e0n h\u00ecnh qu\u1ea3n l\u00fd t\u1ef1 \u0111\u0103ng nh\u1eadp b\u1eb1ng t\u00e0i kho\u1ea3n <b>admin</b>. \u1ea2nh 33, 34, 35 l\u00e0 b\u1ea3n c\u1eadp nh\u1eadt c\u1ee7a \u1ea3nh 2, 8, 7 n\u00ean d\u00f9ng chung m\u00e0n h\u00ecnh \u0111\u00e3 ch\u1ec9nh.</p>
        ${grp('Trang c\u00f4ng khai', 1, 6)}${grp('C\u1ed5ng sinh vi\u00ean', 7, 20)}${grp('Ban qu\u1ea3n l\u00fd', 21, 32)}${grp('B\u1ea3n c\u1eadp nh\u1eadt', 33, 35)}</div>${App.pubFooter()}`;
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
