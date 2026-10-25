/* Ph\u1ea7n b\u1ed5 sung: trang ch\u1ee7 \u0111\u1ea7y \u0111\u1ee7, ch\u00e2n trang, h\u1ed9p th\u01b0 Ban qu\u1ea3n l\u00fd, qu\u1ea3n l\u00fd th\u00f4ng b\u00e1o, bi\u1ec3u \u0111\u1ed3 b\u00e1o c\u00e1o, ch\u1ecdn ph\u00f2ng, \u0111\u00e1nh gi\u00e1 s\u1eeda ch\u1eefa */
(function () {
  const K = window.KTX, { esc, ic, im, av, spark, badge, sel } = App;
  const P = App.pages;
  const b2 = K.pad2, money = K.money;

  // ============ Ch\u00e2n trang c\u00f4ng khai ============
  App.pubFooter = () => {
    const g = K.db.general;
    return `<footer class="pub-foot2"><div class="pf-in">
      <div class="pf-brand">${App.brand(false)}<p>N\u01a1i \u1edf an to\u00e0n, ti\u1ec7n nghi cho ${K.db.rooms.reduce((s, r) => s + r.beds, 0)} sinh vi\u00ean trong t\u00f2a nh\u00e0 ${K.khus().length} t\u1ea7ng. Ban qu\u1ea3n l\u00fd tr\u1ef1c 24/7 v\u00e0 h\u1ed7 tr\u1ee3 sinh vi\u00ean trong su\u1ed1t n\u0103m h\u1ecdc.</p>
        <div class="pf-badges"><span>${ic('shield-check')}An ninh 24/7</span><span>${ic('wifi')}Wi-Fi mi\u1ec5n ph\u00ed</span><span>${ic('leaf')}M\u00f4i tr\u01b0\u1eddng xanh</span></div></div>
      <div><h4>K\u00fd t\u00fac x\u00e1</h4><a href="#" data-nav="gioi-thieu">Gi\u1edbi thi\u1ec7u</a><a href="#" data-go="phong-o">Ph\u00f2ng \u1edf &amp; gi\u00e1</a><a href="#" data-nav="tien-ich">Ti\u1ec7n \u00edch</a><a href="#" data-nav="huong-dan">H\u01b0\u1edbng d\u1eabn \u0111\u0103ng k\u00fd</a></div>
      <div><h4>Sinh vi\u00ean</h4><a href="#" data-go="dang-ky">T\u1ea1o t\u00e0i kho\u1ea3n</a><a href="#" data-go="dang-nhap">\u0110\u0103ng nh\u1eadp c\u1ed5ng sinh vi\u00ean</a><a href="#" data-go="quen-mat-khau">Qu\u00ean m\u1eadt kh\u1ea9u</a><a href="#" data-go="so-do">Danh s\u00e1ch 35 m\u00e0n h\u00ecnh</a></div>
      <div><h4>Li\u00ean h\u1ec7</h4><p>${ic('phone')}${esc(g.hotline)}</p><p>${ic('mail')}${esc(g.email)}</p><p>${ic('map-pin')}${esc(g.address)}</p><p>${ic('clock')}7:30 \u2013 17:00, Th\u1ee9 Hai \u2013 Th\u1ee9 B\u1ea3y</p></div>
    </div><div class="pf-bottom"><span>\u00a9 2026 K\u00fd t\u00fac x\u00e1 \u0110\u1ea1i h\u1ecdc Ngh\u1ec7 An</span><span>H\u1ecdc t\u1eadp \u00b7 S\u1ed1ng \u0111\u1eb9p \u00b7 C\u00f9ng nhau</span></div></footer>`;
  };

  // ============ C\u00e1c m\u1ee5c trang ch\u1ee7 ============
  const FAQ_HOME = [
    ['Ai \u0111\u01b0\u1ee3c \u0111\u0103ng k\u00fd \u1edf k\u00fd t\u00fac x\u00e1?', 'Sinh vi\u00ean ch\u00ednh quy \u0111ang h\u1ecdc t\u1ea1i \u0110\u1ea1i h\u1ecdc Ngh\u1ec7 An. \u01afu ti\u00ean t\u00e2n sinh vi\u00ean, sinh vi\u00ean \u1edf xa, thu\u1ed9c di\u1ec7n ch\u00ednh s\u00e1ch v\u00e0 c\u00f3 ho\u00e0n c\u1ea3nh kh\u00f3 kh\u0103n.'],
    ['H\u1ed3 s\u01a1 \u0111\u0103ng k\u00fd g\u1ed3m nh\u1eefng g\u00ec?', 'Gi\u1ea5y x\u00e1c nh\u1eadn sinh vi\u00ean, b\u1ea3n sao CCCD, \u1ea3nh th\u1ebb 3x4 v\u00e0 \u0111\u01a1n \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa. B\u1ea1n c\u00f3 th\u1ec3 t\u1ea3i \u1ea3nh ch\u1ee5p gi\u1ea5y t\u1edd l\u00ean ngay khi \u0111\u0103ng k\u00fd tr\u1ef1c tuy\u1ebfn.'],
    ['Bao l\u00e2u th\u00ec h\u1ed3 s\u01a1 \u0111\u01b0\u1ee3c duy\u1ec7t?', 'Ban qu\u1ea3n l\u00fd x\u00e9t duy\u1ec7t trong 3 \u2013 5 ng\u00e0y l\u00e0m vi\u1ec7c. K\u1ebft qu\u1ea3 \u0111\u01b0\u1ee3c g\u1eedi qua m\u1ee5c Th\u00f4ng b\u00e1o tr\u00ean c\u1ed5ng sinh vi\u00ean.'],
    ['Ti\u1ec1n \u0111i\u1ec7n, n\u01b0\u1edbc t\u00ednh th\u1ebf n\u00e0o?', 'Ghi ch\u1ec9 s\u1ed1 theo ph\u00f2ng m\u1ed7i th\u00e1ng, chi ph\u00ed \u0111\u01b0\u1ee3c chia \u0111\u1ec1u cho s\u1ed1 sinh vi\u00ean \u0111ang \u1edf. \u0110\u01a1n gi\u00e1 hi\u1ec7n h\u00e0nh: \u0111i\u1ec7n ' + money(K.db.prices.e) + '/kWh, n\u01b0\u1edbc ' + money(K.db.prices.w) + '/m\u00b3.'],
    ['C\u00f3 th\u1ec3 chuy\u1ec3n ph\u00f2ng gi\u1eefa n\u0103m kh\u00f4ng?', 'C\u00f3. G\u1eedi y\u00eau c\u1ea7u t\u1ea1i m\u1ee5c L\u01b0u tr\u00fa \u203a Chuy\u1ec3n ph\u00f2ng khi ph\u00f2ng mu\u1ed1n chuy\u1ec3n c\u00f2n gi\u01b0\u1eddng tr\u1ed1ng. Ban qu\u1ea3n l\u00fd duy\u1ec7t trong 3 \u2013 5 ng\u00e0y l\u00e0m vi\u1ec7c.'],
    ['Thanh to\u00e1n b\u1eb1ng c\u00e1ch n\u00e0o?', 'Chuy\u1ec3n kho\u1ea3n qua m\u00e3 QR, v\u00ed \u0111i\u1ec7n t\u1eed (MoMo, ZaloPay, VNPay) ho\u1eb7c n\u1ed9p ti\u1ec1n m\u1eb7t t\u1ea1i qu\u1ea7y ti\u1ebfp nh\u1eadn t\u1ea7ng 1.'],
  ];
  // b\u1ea3ng gi\u00e1 + c\u00e1c b\u01b0\u1edbc + h\u1ecfi \u0111\u00e1p, v\u00e0 m\u1ee5c li\u00ean h\u1ec7: d\u00f9ng chung cho trang ch\u1ee7
  App.homeGuide = (types) => { types = types || [2, 4, 6, 8].map((b) => { const rs = K.db.rooms.filter((r) => r.beds === b && !r.maint); return rs.length ? { b, n: rs.length, price: Math.min(...rs.map((r) => r.price)), free: rs.reduce((s, r) => s + K.freeBeds(r.code), 0) } : null; }).filter(Boolean);
    return `    <section class="psec" id="sec-huong-dan"><div class="psec-in guide">
      <div><span class="eyebrow">H\u01b0\u1edbng d\u1eabn</span><h2 class="psec-t">B\u1ea3ng gi\u00e1 ph\u00f2ng n\u0103m h\u1ecdc 2026 \u2013 2027</h2>
        <div class="tbl-wrap" style="margin-top:18px"><table class="tbl"><thead><tr><th>Lo\u1ea1i ph\u00f2ng</th><th class="c">S\u1ed1 ph\u00f2ng</th><th class="c">Gi\u01b0\u1eddng tr\u1ed1ng</th><th class="r">Gi\u00e1 / th\u00e1ng</th></tr></thead><tbody>${types.map((t) => `<tr><td><span class="row" style="gap:10px"><span class="amen-ic blue sm">${ic('bed-double')}</span>Ph\u00f2ng ${t.b} ng\u01b0\u1eddi</span></td><td class="c num">${t.n}</td><td class="c num">${t.free ? t.free : '<span class="muted">H\u1ebft</span>'}</td><td class="r num"><b style="color:var(--red)">${money(t.price)}</b></td></tr>`).join('')}</tbody></table></div>
        <p class="muted small" style="margin-top:10px">Gi\u00e1 ch\u01b0a g\u1ed3m \u0111i\u1ec7n, n\u01b0\u1edbc t\u00ednh theo th\u1ef1c t\u1ebf s\u1eed d\u1ee5ng (b\u00ecnh qu\u00e2n 50.000\u0111/ng\u01b0\u1eddi/th\u00e1ng).</p>
        <div class="steps-mini">${[['search', 'Ch\u1ecdn ph\u00f2ng c\u00f2n ch\u1ed7'], ['file-pen-line', 'G\u1eedi h\u1ed3 s\u01a1 tr\u1ef1c tuy\u1ebfn'], ['badge-check', 'Nh\u1eadn k\u1ebft qu\u1ea3 sau 3 \u2013 5 ng\u00e0y'], ['key-round', 'X\u00e1c nh\u1eadn th\u1ecfa thu\u1eadn, nh\u1eadn ph\u00f2ng']].map(([i, t], k) => `<div><span>${k + 1}</span>${ic(i)}<b>${t}</b></div>`).join('')}</div></div>
      <div><span class="eyebrow">C\u00e2u h\u1ecfi th\u01b0\u1eddng g\u1eb7p</span><h2 class="psec-t">B\u1ea1n h\u1ecfi, ch\u00fang t\u00f4i tr\u1ea3 l\u1eddi</h2>
        <div class="faq">${FAQ_HOME.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}${ic('chevron-down')}</summary><p>${a}</p></details>`).join('')}</div></div>
    </div></section>`;
  };
  App.homeContact = () => `    <section class="psec tint" id="sec-lien-he"><div class="psec-in contact">
      <div><span class="eyebrow">Li\u00ean h\u1ec7</span><h2 class="psec-t">C\u1ea7n t\u01b0 v\u1ea5n? Nh\u1eafn cho ch\u00fang t\u00f4i</h2><p class="psec-d">Ban qu\u1ea3n l\u00fd ph\u1ea3n h\u1ed3i trong gi\u1edd h\u00e0nh ch\u00ednh. Tr\u01b0\u1eddng h\u1ee3p kh\u1ea9n c\u1ea5p ngo\u00e0i gi\u1edd, g\u1ecdi hotline tr\u1ef1c 24/7.</p>
        <div class="contact-list">${[['phone', 'Hotline', K.db.general.hotline], ['mail', 'Email', K.db.general.email], ['map-pin', '\u0110\u1ecba ch\u1ec9', K.db.general.address], ['clock', 'Gi\u1edd l\u00e0m vi\u1ec7c', '7:30 \u2013 17:00, Th\u1ee9 Hai \u2013 Th\u1ee9 B\u1ea3y']].map(([i, t, v]) => `<div><span class="amen-ic blue">${ic(i)}</span><span><small>${t}</small><b>${esc(v)}</b></span></div>`).join('')}</div></div>
      <form class="card pad contact-form" id="hc-form" novalidate><h3 style="font-size:21px">G\u1eedi l\u1eddi nh\u1eafn</h3>
        <div class="grid g2" style="gap:14px;margin-top:14px"><div class="field"><label for="hc-name">H\u1ecd v\u00e0 t\u00ean <span class="req">*</span></label><input id="hc-name" class="input" placeholder="Nguy\u1ec5n V\u0103n A" autocomplete="name"></div><div class="field"><label for="hc-contact">Email ho\u1eb7c s\u1ed1 \u0111i\u1ec7n tho\u1ea1i <span class="req">*</span></label><input id="hc-contact" class="input" placeholder="\u0110\u1ec3 ch\u00fang t\u00f4i li\u00ean h\u1ec7 l\u1ea1i"></div></div>
        <div class="field" style="margin-top:14px"><label for="hc-topic">Ch\u1ee7 \u0111\u1ec1</label>${sel('hc-topic', ['T\u01b0 v\u1ea5n ch\u1ecdn ph\u00f2ng', 'Th\u1ee7 t\u1ee5c \u0111\u0103ng k\u00fd', 'H\u1ecdc ph\u00ed, chi ph\u00ed', 'Kh\u00e1c'], 'T\u01b0 v\u1ea5n ch\u1ecdn ph\u00f2ng')}</div>
        <div class="field" style="margin-top:14px"><label for="hc-msg">N\u1ed9i dung <span class="req">*</span></label><textarea id="hc-msg" class="textarea" placeholder="B\u1ea1n c\u1ea7n h\u1ed7 tr\u1ee3 \u0111i\u1ec1u g\u00ec?"></textarea></div>
        <p class="err" id="hc-err" hidden style="margin-top:8px"></p><button class="btn btn-red btn-block" style="margin-top:16px">${ic('send')}G\u1eedi l\u1eddi nh\u1eafn</button></form>
    </div></section>`;
  App.bindHomeContact = (root) => {
    const f = root.querySelector('#hc-form');
    if (f) f.onsubmit = (e) => {
      e.preventDefault();
      const name = f.querySelector('#hc-name').value.trim(), contact = f.querySelector('#hc-contact').value.trim(), msg = f.querySelector('#hc-msg').value.trim();
      const err = f.querySelector('#hc-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
      if (!name) return fail('Vui l\u00f2ng nh\u1eadp h\u1ecd v\u00e0 t\u00ean.');
      if (!/^\S+@\S+\.\S+$/.test(contact) && !/^0\d{9}$/.test(contact.replace(/\s/g, ''))) return fail('Nh\u1eadp email h\u1ee3p l\u1ec7 ho\u1eb7c s\u1ed1 \u0111i\u1ec7n tho\u1ea1i 10 ch\u1eef s\u1ed1.');
      if (msg.length < 10) return fail('N\u1ed9i dung c\u1ea7n t\u1ed1i thi\u1ec3u 10 k\u00fd t\u1ef1.');
      K.db.contacts.unshift({ id: 'LH-' + Date.now(), name, contact, topic: f.querySelector('#hc-topic').value, msg, at: K.now(), done: false });
      K.save(); f.reset(); err.hidden = true; App.toast('\u0110\u00e3 g\u1eedi l\u1eddi nh\u1eafn. Ban qu\u1ea3n l\u00fd s\u1ebd li\u00ean h\u1ec7 l\u1ea1i v\u1edbi b\u1ea1n s\u1edbm.');
    };
  };
  App.homeSections = () => {
    const ks = K.khuStats();
    const beds = ks.reduce((s, k) => s + k.beds, 0), free = ks.reduce((s, k) => s + k.free, 0);
    const types = [2, 4, 6, 8].map((b) => { const rs = K.db.rooms.filter((r) => r.beds === b && !r.maint); return rs.length ? { b, n: rs.length, price: Math.min(...rs.map((r) => r.price)), free: rs.reduce((s, r) => s + K.freeBeds(r.code), 0) } : null; }).filter(Boolean);
    const amen = [['wifi', 'Wi-Fi t\u1ed1c \u0111\u1ed9 cao', 'Ph\u1ee7 s\u00f3ng to\u00e0n b\u1ed9 ph\u00f2ng \u1edf v\u00e0 khu sinh ho\u1ea1t chung.', 'blue'], ['book-open', 'Ph\u00f2ng t\u1ef1 h\u1ecdc', 'M\u1edf c\u1eeda 6:00 \u2013 23:00, y\u00ean t\u0129nh, \u0111\u1ee7 \u00e1nh s\u00e1ng.', 'red'], ['shirt', 'Gi\u1eb7t s\u1ea5y', 'M\u00e1y gi\u1eb7t, m\u00e1y s\u1ea5y t\u1ef1 ph\u1ee5c v\u1ee5 t\u1ea1i m\u1ed7i khu.', 'green'], ['utensils', 'Nh\u00e0 \u0103n \u2013 c\u0103ng tin', 'Su\u1ea5t \u0103n sinh vi\u00ean gi\u00e1 h\u1ee3p l\u00fd, m\u1edf c\u1ea3 ng\u00e0y.', 'amber'], ['shield-check', 'An ninh 24/7', 'B\u1ea3o v\u1ec7 tr\u1ef1c, camera v\u00e0 th\u1ebb ra v\u00e0o.', 'blue'], ['dumbbell', 'S\u00e2n th\u1ec3 thao', 'S\u00e2n b\u00f3ng chuy\u1ec1n, c\u1ea7u l\u00f4ng v\u00e0 ph\u00f2ng gym mini.', 'red'], ['zap', '\u0110i\u1ec7n n\u01b0\u1edbc \u1ed5n \u0111\u1ecbnh', 'Ghi ch\u1ec9 s\u1ed1 minh b\u1ea1ch, t\u00ednh \u0111\u00fang theo s\u1eed d\u1ee5ng.', 'green'], ['heart-pulse', 'Y t\u1ebf', 'Ph\u00f2ng y t\u1ebf c\u01a1 b\u1ea3n, li\u00ean k\u1ebft tr\u1ea1m y t\u1ebf ph\u01b0\u1eddng.', 'amber']];
    return `
    <section class="psec" id="sec-gioi-thieu"><div class="psec-in about">
      <div class="about-img"><img src="${K.A('community_big')}" alt="Sinh vi\u00ean sinh ho\u1ea1t t\u1ea1i s\u00e2n k\u00fd t\u00fac x\u00e1"><span class="about-tag">${ic('sparkles')}H\u01a1n 10 n\u0103m \u0111\u1ed3ng h\u00e0nh c\u00f9ng sinh vi\u00ean</span></div>
      <div><span class="eyebrow">Gi\u1edbi thi\u1ec7u</span><h2 class="psec-t">M\u1ed9t m\u00e1i nh\u00e0 th\u1ee9 hai gi\u1eefa gi\u1ea3ng \u0111\u01b0\u1eddng</h2>
        <p class="psec-d">K\u00fd t\u00fac x\u00e1 \u0110\u1ea1i h\u1ecdc Ngh\u1ec7 An n\u1eb1m ngay trong khu\u00f4n vi\u00ean tr\u01b0\u1eddng, \u0111i b\u1ed9 5 ph\u00fat t\u1edbi gi\u1ea3ng \u0111\u01b0\u1eddng. T\u00f2a nh\u00e0 ${K.khus().length} t\u1ea7ng v\u1edbi ph\u00f2ng 2 \u2013 8 ng\u01b0\u1eddi, m\u1ed7i gi\u01b0\u1eddng c\u00f3 b\u00e0n h\u1ecdc, t\u1ee7 c\u00e1 nh\u00e2n c\u00f3 kh\u00f3a v\u00e0 Wi-Fi mi\u1ec5n ph\u00ed.</p>
        <div class="kpis">${[[beds, 'gi\u01b0\u1eddng l\u01b0u tr\u00fa'], [K.db.rooms.length, 'ph\u00f2ng \u1edf'], [K.khus().length, 't\u1ea7ng'], [free, 'gi\u01b0\u1eddng c\u00f2n tr\u1ed1ng']].map(([v, t]) => `<div><b class="num">${v}</b><span>${t}</span></div>`).join('')}</div>
        <div class="row" style="margin-top:22px;flex-wrap:wrap"><a href="#" class="btn btn-red" data-go="phong-o">Xem ph\u00f2ng c\u00f2n tr\u1ed1ng ${ic('arrow-right')}</a><a href="#" class="btn btn-outline" data-nav="huong-dan">C\u00e1ch \u0111\u0103ng k\u00fd</a></div></div>
    </div></section>
    <section class="psec tint" id="sec-tien-ich"><div class="psec-in">
      <div class="psec-head"><span class="eyebrow">Ti\u1ec7n \u00edch</span><h2 class="psec-t">\u0110\u1ea7y \u0111\u1ee7 cho h\u1ecdc t\u1eadp v\u00e0 sinh ho\u1ea1t</h2><p class="psec-d">M\u1ecdi th\u1ee9 b\u1ea1n c\u1ea7n cho m\u1ed9t n\u0103m h\u1ecdc tr\u1ecdn v\u1eb9n \u0111\u1ec1u c\u00f3 trong khu\u00f4n vi\u00ean k\u00fd t\u00fac x\u00e1.</p></div>
      <div class="amen-grid">${amen.map(([i, t, d, c]) => `<div class="amen-card"><span class="amen-ic ${c}">${ic(i)}</span><b>${t}</b><p>${d}</p></div>`).join('')}</div>
    </div></section>
    ${App.homeGuide(types)}
    ${App.homeContact()}`;
  };
  const homeMount = P['trang-chu'].mount;
  P['trang-chu'].mount = (root) => { homeMount(root); App.bindHomeContact(root); };

  // ============ Ph\u00f2ng t\u01b0\u01a1ng t\u1ef1 (chi ti\u1ebft ph\u00f2ng) ============
  App.similarRooms = (r) => {
    const list = K.db.rooms.filter((x) => x.code !== r.code && !x.maint && K.freeBeds(x.code) > 0).sort((a, b) => (a.beds === r.beds ? 0 : 1) - (b.beds === r.beds ? 0 : 1) || (a.khu === r.khu ? 0 : 1) - (b.khu === r.khu ? 0 : 1)).slice(0, 4);
    if (!list.length) return '';
    return `<div style="margin-top:22px"><div class="card-h"><h2 style="font-size:24px">Ph\u00f2ng t\u01b0\u01a1ng t\u1ef1 c\u00f2n ch\u1ed7</h2><a href="#" class="link" data-go="phong-o">Xem t\u1ea5t c\u1ea3 ${ic('arrow-right')}</a></div>
      <div class="sim-grid">${list.map((x) => `<a href="#" class="card sim" data-go="phong-${x.code}"><div class="ph"><img src="${K.A(x.img)}" alt="\u1ea2nh ph\u00f2ng ${x.code}" loading="lazy"><span class="khu-tag">T\u1ea6NG ${x.khu}</span></div><div style="padding:12px 14px"><b style="color:var(--navy);font-size:18px">Ph\u00f2ng ${x.code}</b><div class="muted small">Ph\u00f2ng ${x.beds} ng\u01b0\u1eddi \u00b7 T\u1ea7ng ${x.floor}</div><div class="row" style="justify-content:space-between;margin-top:8px">${App.freeBadge(x.code)}<b style="color:var(--red)">${money(x.price)}</b></div></div></a>`).join('')}</div></div>`;
  };

  // ============ \u0110\u0103ng k\u00fd l\u01b0u tr\u00fa khi \u0111\u00e3 c\u00f3 ph\u00f2ng ============
  const regPage = P['sv-dang-ky-luu-tru'];
  P['sv-dang-ky-luu-tru'] = {
    role: 'student', title: regPage.title,
    render: (p) => {
      const u = K.me();
      if (!u.room) return regPage.render(p);
      const r = K.room(u.room);
      return App.shell({ role: 'student', active: 'sv-ho-so', logo: 'inline', notif: 'dot', search: 'T\u00ecm d\u1ecbch v\u1ee5, th\u00f4ng b\u00e1o, h\u01b0\u1edbng d\u1eabn...', foot: 'illus', sbw: 262, icons: { 'sv-hoa-don': 'receipt-text' } }, `${App.phead({ cls: 'compact', crumb: [['Trang ch\u1ee7', 'sv-tong-quan'], ['L\u01b0u tr\u00fa', 'sv-ho-so'], '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa'], title: '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa', desc: 'B\u1ea1n \u0111ang c\u00f3 ch\u1ed7 \u1edf t\u1ea1i k\u00fd t\u00fac x\u00e1, kh\u00f4ng c\u1ea7n \u0111\u0103ng k\u00fd m\u1edbi.' })}
        <div class="card pad resp-1" style="display:grid;grid-template-columns:300px 1fr;gap:24px;align-items:center"><img src="${K.A(r.code === 'A302' ? 'room_a302_wide' : r.img)}" style="width:100%;height:190px;object-fit:cover;border-radius:12px" alt="">
          <div><span class="badge b-green">${ic('circle-check')}\u0110ang l\u01b0u tr\u00fa</span><h2 style="font-size:30px;margin-top:10px">Ph\u00f2ng ${r.code} \u00b7 T\u1ea7ng ${r.khu} \u00b7 Gi\u01b0\u1eddng ${b2(u.bed)}</h2><p class="muted" style="margin-top:6px">N\u0103m h\u1ecdc 2026 \u2013 2027 \u00b7 ${K.occCount(r.code)}/${r.beds} sinh vi\u00ean \u00b7 ${money(r.price)}/th\u00e1ng</p>
            <div class="row" style="margin-top:16px;flex-wrap:wrap"><button class="btn btn-red" data-go="sv-phong">${ic('door-open')}Xem ph\u00f2ng c\u1ee7a t\u00f4i</button><button class="btn btn-outline" data-go="sv-ho-so">${ic('file-text')}H\u1ed3 s\u01a1 &amp; th\u1ecfa thu\u1eadn</button></div></div></div>
        <h2 style="font-size:22px;margin-top:6px">B\u1ea1n mu\u1ed1n thay \u0111\u1ed5i ch\u1ed7 \u1edf?</h2>
        <div class="grid g3">${[['sv-gia-han', 'calendar-clock', 'Gia h\u1ea1n l\u01b0u tr\u00fa', 'Ti\u1ebfp t\u1ee5c \u1edf ph\u00f2ng hi\u1ec7n t\u1ea1i cho h\u1ecdc k\u1ef3 sau.'], ['sv-chuyen-phong', 'arrow-left-right', 'Chuy\u1ec3n ph\u00f2ng', '\u0110\u1ed5i sang ph\u00f2ng kh\u00e1c c\u00f2n gi\u01b0\u1eddng tr\u1ed1ng.'], ['sv-tra-phong', 'log-out', 'Tr\u1ea3 ph\u00f2ng', 'K\u1ebft th\u00fac l\u01b0u tr\u00fa v\u00e0 b\u00e0n giao t\u00e0i s\u1ea3n.']].map(([g, i, t, d]) => `<a href="#" class="card pad hover-lift" data-go="${g}" style="display:flex;gap:16px;align-items:center;color:var(--ink)"><span class="amen-ic blue">${ic(i)}</span><span style="flex:1"><b style="color:var(--navy);font-size:17px;display:block">${t}</b><small class="muted">${d}</small></span>${ic('chevron-right')}</a>`).join('')}</div>`);
    },
    mount: (root, p) => { if (!K.me().room && regPage.mount) regPage.mount(root, p); },
  };

  // ============ \u0110\u00e1nh gi\u00e1 k\u1ebft qu\u1ea3 s\u1eeda ch\u1eefa ============
  App.repairRating = (rq) => {
    if (rq.status === 'moi') return `<div class="card pad" style="padding:16px 22px"><h2 class="card-t" style="font-size:18px">${ic('circle-x')}Kh\u00f4ng c\u1ea7n s\u1eeda n\u1eefa?</h2><p class="muted small" style="margin:6px 0 12px">B\u1ea1n c\u00f3 th\u1ec3 h\u1ee7y y\u00eau c\u1ea7u khi ch\u01b0a \u0111\u01b0\u1ee3c ph\u00e2n c\u00f4ng.</p><button class="btn btn-outline-red btn-sm" id="rq-cancel">H\u1ee7y y\u00eau c\u1ea7u</button></div>`;
    if (rq.status !== 'hoan-tat') return '';
    if (rq.rating) return `<div class="card pad" style="padding:16px 22px"><h2 class="card-t" style="font-size:18px">${ic('star')}\u0110\u00e1nh gi\u00e1 c\u1ee7a b\u1ea1n</h2><div class="stars ro" style="margin-top:8px">${[1, 2, 3, 4, 5].map((n) => `<span class="${n <= rq.rating ? 'on' : ''}">${ic('star')}</span>`).join('')}</div>${rq.ratingNote ? `<p style="margin-top:8px;color:var(--text)">\u201c${esc(rq.ratingNote)}\u201d</p>` : ''}</div>`;
    return `<div class="card pad" style="padding:16px 22px"><h2 class="card-t" style="font-size:18px">${ic('star')}\u0110\u00e1nh gi\u00e1 k\u1ebft qu\u1ea3 s\u1eeda ch\u1eefa</h2><p class="muted small" style="margin-top:4px">S\u1ef1 c\u1ed1 \u0111\u00e3 \u0111\u01b0\u1ee3c x\u1eed l\u00fd xong ch\u01b0a? \u0110\u00e1nh gi\u00e1 gi\u00fap Ban qu\u1ea3n l\u00fd n\u00e2ng cao ch\u1ea5t l\u01b0\u1ee3ng.</p>
      <div class="stars" id="rt-stars" style="margin-top:10px">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}" aria-label="${n} sao">${ic('star')}</button>`).join('')}</div>
      <textarea id="rt-note" class="textarea" placeholder="Nh\u1eadn x\u00e9t th\u00eam (kh\u00f4ng b\u1eaft bu\u1ed9c)" style="min-height:70px;margin-top:10px"></textarea>
      <div class="row" style="margin-top:10px"><button class="btn btn-red btn-sm" id="rt-send">G\u1eedi \u0111\u00e1nh gi\u00e1</button><button class="btn btn-outline btn-sm" id="rt-reopen">Ch\u01b0a s\u1eeda xong</button></div></div>`;
  };
  App.bindRepairRating = (root, rq) => {
    let val = 0;
    const paint = () => root.querySelectorAll('[data-star]').forEach((b) => b.classList.toggle('on', +b.dataset.star <= val));
    root.querySelectorAll('[data-star]').forEach((b) => b.onclick = () => { val = +b.dataset.star; paint(); });
    const s = root.querySelector('#rt-send'); if (s) s.onclick = () => { if (!val) return App.toast('Ch\u1ecdn s\u1ed1 sao \u0111\u00e1nh gi\u00e1', 'err'); rq.rating = val; rq.ratingNote = root.querySelector('#rt-note').value.trim(); K.save(); App.toast('C\u1ea3m \u01a1n b\u1ea1n \u0111\u00e3 \u0111\u00e1nh gi\u00e1!'); App.refresh(); };
    const ro = root.querySelector('#rt-reopen'); if (ro) ro.onclick = () => App.confirm('B\u00e1o ch\u01b0a s\u1eeda xong', 'Y\u00eau c\u1ea7u s\u1ebd \u0111\u01b0\u1ee3c m\u1edf l\u1ea1i v\u00e0 chuy\u1ec3n v\u1ec1 tr\u1ea1ng th\u00e1i \u201c\u0110ang x\u1eed l\u00fd\u201d.', 'M\u1edf l\u1ea1i y\u00eau c\u1ea7u', () => { rq.status = 'dang-xu-ly'; rq.msgs = rq.msgs || []; const u = K.me(); rq.msgs.push({ who: u.name, av: u.avatar, d: K.now(), m: 'S\u1ef1 c\u1ed1 v\u1eabn ch\u01b0a \u0111\u01b0\u1ee3c kh\u1eafc ph\u1ee5c, nh\u1edd b\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt ki\u1ec3m tra l\u1ea1i.' }); K.save(); App.toast('\u0110\u00e3 m\u1edf l\u1ea1i y\u00eau c\u1ea7u ' + rq.id); App.refresh(); });
    const c = root.querySelector('#rq-cancel'); if (c) c.onclick = () => App.confirm('H\u1ee7y y\u00eau c\u1ea7u', 'H\u1ee7y y\u00eau c\u1ea7u <b>' + esc(rq.title) + '</b>?', 'H\u1ee7y y\u00eau c\u1ea7u', () => { K.db.repairs = K.db.repairs.filter((x) => x.id !== rq.id); K.save(); App.toast('\u0110\u00e3 h\u1ee7y y\u00eau c\u1ea7u ' + rq.id); App.go('sv-sua-chua'); }, true);
  };

  // ============ Ch\u1ecdn ph\u00f2ng c\u00f2n tr\u1ed1ng ============
  App.pickRoom = (o, cb) => {
    const rooms = () => K.db.rooms.filter((r) => r.code !== o.exclude && !r.maint && K.freeBeds(r.code) > 0);
    App.modal({ title: o.title || 'Ch\u1ecdn ph\u00f2ng', wide: true, body: `<div class="row" style="margin-bottom:12px;flex-wrap:wrap"><div style="width:180px">${sel('pk-khu', [['', 'T\u1ea5t c\u1ea3 t\u1ea7ng'], ...App.khuOpts()], o.khu || '')}</div><div style="width:180px">${sel('pk-type', [['', 'M\u1ecdi lo\u1ea1i ph\u00f2ng'], ['2', '2 ng\u01b0\u1eddi'], ['4', '4 ng\u01b0\u1eddi'], ['6', '6 ng\u01b0\u1eddi'], ['8', '8 ng\u01b0\u1eddi']], '')}</div></div><div class="tbl-wrap" style="max-height:52vh;overflow:auto"><table class="tbl hover"><thead><tr><th>Ph\u00f2ng</th><th>Lo\u1ea1i</th><th>C\u00f2n tr\u1ed1ng</th><th>Gi\u01b0\u1eddng</th><th></th></tr></thead><tbody id="pk-body"></tbody></table></div>`,
      onMount: (el, close) => {
        const draw = () => {
          const k = el.querySelector('#pk-khu').value, t = el.querySelector('#pk-type').value;
          const list = rooms().filter((r) => (!k || r.khu === k) && (!t || String(r.beds) === t));
          el.querySelector('#pk-body').innerHTML = list.map((r) => { const freeB = K.bedMap(r.code).filter((b) => b.free).map((b) => b.bed); return `<tr><td><b>${r.code}</b> <small class="muted">T\u1ea7ng ${r.floor}</small></td><td>${r.beds} ng\u01b0\u1eddi</td><td>${freeB.length} gi\u01b0\u1eddng</td><td><select class="select" data-bedsel="${r.code}" style="height:38px;width:120px">${freeB.map((b) => `<option value="${b}">Gi\u01b0\u1eddng ${b2(b)}</option>`).join('')}</select></td><td><button class="btn btn-sm btn-red" data-pk="${r.code}">Ch\u1ecdn</button></td></tr>`; }).join('') || '<tr><td colspan="5" class="muted" style="text-align:center;padding:20px">Kh\u00f4ng c\u00f2n ph\u00f2ng tr\u1ed1ng ph\u00f9 h\u1ee3p.</td></tr>';
          el.querySelectorAll('[data-pk]').forEach((b) => b.onclick = () => { const code = b.dataset.pk; const bed = +el.querySelector(`[data-bedsel="${code}"]`).value; close(); cb(code, bed); });
        };
        el.querySelector('#pk-khu').onchange = draw; el.querySelector('#pk-type').onchange = draw; draw();
      } });
  };

  // ============ Th\u00f4ng b\u00e1o: thanh \u0111i\u1ec1u h\u01b0\u1edbng ============
  const inboxCount = () => K.db.feedback.filter((f) => f.status !== 'da-phan-hoi').length + Object.values(K.db.chats || {}).filter((m) => m.some((x) => x.me && x.unread)).length + (K.db.contacts || []).filter((c) => !c.done).length;
  App.inboxCount = inboxCount;
  App.noteTabs = (active) => `<div class="seg note-tabs">${[['ql-thong-bao', 'So\u1ea1n th\u00f4ng b\u00e1o', 'pen-line'], ['ql-thong-bao-ds', '\u0110\u00e3 \u0111\u0103ng (' + K.db.notifications.filter((n) => !n.to).length + ')', 'list'], ['ql-phan-anh', 'Ph\u1ea3n \u00e1nh &amp; li\u00ean h\u1ec7' + (inboxCount() ? ' (' + inboxCount() + ')' : ''), 'inbox']].map(([g, t, i]) => `<button class="pill ${g === active ? 'on' : ''}" ${g === active ? '' : `data-go="${g}"`} data-newnote="${g === 'ql-thong-bao' ? 1 : ''}">${ic(i)}${t}</button>`).join('')}</div>`;
  const adminShell = (body, extra) => App.shell(Object.assign({ role: 'admin', logo: 'inline', active: 'ql-thong-bao', search: 'T\u00ecm sinh vi\u00ean, ph\u00f2ng, th\u00f4ng b\u00e1o...', sbw: 282, icons: { 'ql-thong-bao': 'megaphone', 'ql-hop-dong': 'file-pen-line' } }, extra || {}), body);
  const CAT_BACK = { 'Ho\u1ea1t \u0111\u1ed9ng': 'Ho\u1ea1t \u0111\u1ed9ng sinh vi\u00ean', 'L\u01b0u tr\u00fa': 'L\u01b0u tr\u00fa' };

  P['ql-thong-bao-ds'] = {
    role: 'admin', title: 'Th\u00f4ng b\u00e1o \u0111\u00e3 \u0111\u0103ng',
    render: () => {
      const st = App.state('notes', { q: '', cat: '' });
      let list = K.db.notifications.filter((n) => !n.to);
      if (st.q) list = list.filter((n) => (n.title + n.summary).toLowerCase().includes(st.q.toLowerCase()));
      if (st.cat) list = list.filter((n) => n.cat === st.cat);
      const sched = K.db.notifications.filter((n) => String(n.time).startsWith('H\u1eb9n')).length;
      return adminShell(`<div><h1 style="font-size:38px;font-weight:800">Th\u00f4ng b\u00e1o</h1>${App.crumb([['Th\u00f4ng b\u00e1o', 'ql-thong-bao'], '\u0110\u00e3 \u0111\u0103ng'])}</div>${App.noteTabs('ql-thong-bao-ds')}
        <div class="grid g3" style="gap:12px">${[['megaphone', 'T\u1ed5ng th\u00f4ng b\u00e1o', K.db.notifications.filter((n) => !n.to).length, 'blue'], ['star', '\u0110\u00e1nh d\u1ea5u quan tr\u1ecdng', K.db.notifications.filter((n) => !n.to && n.important).length, 'red'], ['calendar-clock', '\u0110ang h\u1eb9n gi\u1edd \u0111\u0103ng', sched, 'amber']].map(([i, t, v, c]) => `<div class="stat"><span class="amen-ic ${c}">${ic(i)}</span><div><div class="lbl2">${t}</div><div class="val">${v}</div></div></div>`).join('')}</div>
        <div class="card pad"><div class="row" style="flex-wrap:wrap;margin-bottom:14px"><div class="iwrap" style="flex:1;min-width:220px">${ic('search')}<input id="nl-q" class="input" placeholder="T\u00ecm theo ti\u00eau \u0111\u1ec1, n\u1ed9i dung..." value="${esc(st.q)}"></div><div style="width:200px">${sel('nl-cat', [['', 'T\u1ea5t c\u1ea3 danh m\u1ee5c'], 'L\u01b0u tr\u00fa', 'Ho\u1ea1t \u0111\u1ed9ng'], st.cat)}</div><button class="btn btn-red" data-go="ql-thong-bao" data-newnote="1">${ic('plus')}So\u1ea1n th\u00f4ng b\u00e1o m\u1edbi</button></div>
          <div class="tbl-wrap"><table class="tbl hover"><thead><tr><th>Th\u00f4ng b\u00e1o</th><th>Danh m\u1ee5c</th><th>Th\u1eddi gian</th><th>Tr\u1ea1ng th\u00e1i</th><th class="r">Thao t\u00e1c</th></tr></thead><tbody>${list.map((n) => `<tr><td><span class="who">${im(n.icon, 'blend', '').replace('<img', '<img style="width:44px;height:44px;border-radius:10px"')}<span><b style="white-space:normal">${esc(n.title)}</b><small style="display:block;max-width:420px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(n.summary)}</small></span></span></td><td>${badge(n.cat, n.cat === 'L\u01b0u tr\u00fa' ? 'blue' : 'red', { sm: true })}</td><td class="num">${esc(n.time)}</td><td>${String(n.time).startsWith('H\u1eb9n') ? badge('H\u1eb9n gi\u1edd', 'orange', { icon: 'clock', sm: true }) : badge('\u0110\u00e3 \u0111\u0103ng', 'green', { dot: true, sm: true })}${n.important ? ' ' + badge('Quan tr\u1ecdng', 'red', { sm: true }) : ''}</td><td class="r" style="white-space:nowrap"><span style="display:inline-flex;gap:2px"><button class="xbtn" data-view="${n.id}" title="Xem">${ic('eye')}</button><button class="xbtn" data-edit="${n.id}" title="S\u1eeda">${ic('pencil')}</button><button class="xbtn" data-pin="${n.id}" title="${n.important ? 'B\u1ecf quan tr\u1ecdng' : '\u0110\u00e1nh d\u1ea5u quan tr\u1ecdng'}">${ic(n.important ? 'star-off' : 'star')}</button><button class="xbtn" data-del="${n.id}" title="X\u00f3a" style="color:var(--red)">${ic('trash-2')}</button></span></td></tr>`).join('') || '<tr><td colspan="5" class="muted" style="text-align:center;padding:26px">Kh\u00f4ng c\u00f3 th\u00f4ng b\u00e1o ph\u00f9 h\u1ee3p.</td></tr>'}</tbody></table></div></div>`);
    },
    mount: (root) => {
      const st = App.st.notes;
      const q = root.querySelector('#nl-q'); q.onchange = () => { st.q = q.value.trim(); App.refresh(); };
      root.querySelector('#nl-cat').onchange = (e) => { st.cat = e.target.value; App.refresh(); };
      const N = (id) => K.db.notifications.find((n) => n.id === id);
      root.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => { const n = N(b.dataset.view); App.modal({ title: n.title, wide: true, body: `<div class="row muted">${ic('users')}${esc(n.author)} \u00b7 ${esc(n.time)}</div>${n.img ? `<img src="${K.A(n.img)}" style="width:100%;height:220px;object-fit:cover;border-radius:10px;margin-top:12px" alt="">` : ''}<div style="margin-top:12px;line-height:1.7">${n.body.map((p) => `<p style="margin-bottom:8px">${esc(p)}</p>`).join('')}</div>` }); });
      root.querySelectorAll('[data-edit]').forEach((b) => b.onclick = () => { const n = N(b.dataset.edit); App.st.compose = { title: n.title, cat: CAT_BACK[n.cat] || 'L\u01b0u tr\u00fa', cover: n.img || 'cover_comm', target: 'To\u00e0n b\u1ed9 sinh vi\u00ean', khu: [], when: 'now', at: '2026-10-18T18:00', portal: true, html: n.body.map((p) => `<div>${esc(p)}</div>`).join(''), editId: n.id }; App.go('ql-thong-bao'); });
      root.querySelectorAll('[data-pin]').forEach((b) => b.onclick = () => { const n = N(b.dataset.pin); n.important = !n.important; K.save(); App.toast(n.important ? '\u0110\u00e3 \u0111\u00e1nh d\u1ea5u quan tr\u1ecdng (hi\u1ec7n tr\u00ean t\u1ed5ng quan sinh vi\u00ean)' : '\u0110\u00e3 b\u1ecf \u0111\u00e1nh d\u1ea5u quan tr\u1ecdng'); App.refresh(); });
      root.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => { const n = N(b.dataset.del); App.confirm('X\u00f3a th\u00f4ng b\u00e1o', 'X\u00f3a th\u00f4ng b\u00e1o \u201c<b>' + esc(n.title) + '</b>\u201d? Sinh vi\u00ean s\u1ebd kh\u00f4ng c\u00f2n th\u1ea5y th\u00f4ng b\u00e1o n\u00e0y.', 'X\u00f3a th\u00f4ng b\u00e1o', () => { K.db.notifications = K.db.notifications.filter((x) => x.id !== n.id); K.db.activity.unshift({ at: K.now(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', av: 'av_admin', act: 'X\u00f3a th\u00f4ng b\u00e1o', icon: 'doc', text: 'X\u00f3a th\u00f4ng b\u00e1o \u201c' + n.title + '\u201d' }); K.save(); App.toast('\u0110\u00e3 x\u00f3a th\u00f4ng b\u00e1o'); App.refresh(); }, true); });
    },
  };

  // ============ H\u1ed9p th\u01b0: ph\u1ea3n \u00e1nh, tin nh\u1eafn, li\u00ean h\u1ec7 ============
  const notifyStudent = (sid, title, body) => K.db.notifications.unshift({ id: 'N' + Date.now() + Math.random().toString(36).slice(2, 5), title, summary: body.slice(0, 90), cat: 'L\u01b0u tr\u00fa', icon: 'ni_doc', time: 'V\u1eeba xong', author: 'Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', month: 'Th\u00e1ng 10/2026', read: false, to: sid, body: [body] });
  P['ql-phan-anh'] = {
    role: 'admin', title: 'Ph\u1ea3n \u00e1nh & li\u00ean h\u1ec7',
    render: () => {
      const st = App.state('inbox', { kind: 'fb', sel: null });
      const chats = Object.entries(K.db.chats || {}).filter(([, m]) => m.some((x) => x.me));
      const tabs = [['fb', 'Ph\u1ea3n \u00e1nh', K.db.feedback.filter((f) => f.status !== 'da-phan-hoi').length], ['chat', 'Tin nh\u1eafn', chats.filter(([, m]) => m.some((x) => x.me && x.unread)).length], ['ct', 'Li\u00ean h\u1ec7 t\u1eeb trang ch\u1ee7', (K.db.contacts || []).filter((c) => !c.done).length]];
      let items = [];
      if (st.kind === 'fb') items = K.db.feedback.map((f) => ({ id: f.id, av: (K.student(f.student) || {}).avatar, t: f.title, s: (K.student(f.student) || { name: f.student }).name + ' \u00b7 ' + f.type, d: f.date, open: f.status !== 'da-phan-hoi' }));
      else if (st.kind === 'chat') items = chats.map(([sid, m]) => ({ id: sid, av: (K.student(sid) || {}).avatar, t: (K.student(sid) || { name: sid }).name, s: m[m.length - 1].t, d: m[m.length - 1].d, open: m.some((x) => x.me && x.unread) }));
      else items = (K.db.contacts || []).map((c) => ({ id: c.id, av: null, t: c.name, s: c.msg, d: c.at, open: !c.done }));
      const cur = items.find((x) => x.id === st.sel) || items[0]; if (cur) st.sel = cur.id;
      let detail = '<div class="card pad empty"><span class="amen-ic blue">' + ic('inbox') + '</span><p>Ch\u01b0a c\u00f3 m\u1ee5c n\u00e0o.</p></div>';
      if (cur && st.kind === 'fb') {
        const f = K.db.feedback.find((x) => x.id === cur.id); const s = K.student(f.student);
        detail = `<div class="card pad"><div class="row" style="justify-content:space-between;flex-wrap:wrap"><span class="row">${s ? av(s.avatar, 52) : ''}<span><b style="color:var(--navy);font-size:17px;display:block">${esc(s ? s.name : f.student)}</b><small class="muted">${f.student}${s && s.room ? ' \u00b7 Ph\u00f2ng ' + s.room : ''} \u00b7 G\u1eedi ${f.date}</small></span></span>${f.status === 'da-phan-hoi' ? badge('\u0110\u00e3 ph\u1ea3n h\u1ed3i', 'green', { icon: 'circle-check' }) : badge('\u0110ang ti\u1ebfp nh\u1eadn', 'orange', { icon: 'clock' })}</div>
          <span class="badge b-blue b-sm" style="margin-top:16px">${f.type}</span><h2 style="font-size:24px;margin-top:8px">${esc(f.title)}</h2><p style="white-space:pre-line;line-height:1.7;margin-top:10px;color:var(--ink)">${esc(f.body)}</p>
          ${f.reply ? `<div class="reply-box"><b>${ic('reply')}Ph\u1ea3n h\u1ed3i c\u1ee7a Ban qu\u1ea3n l\u00fd</b><p>${esc(f.reply)}</p></div>` : ''}
          <div class="field" style="margin-top:16px"><label for="ib-reply">${f.reply ? 'C\u1eadp nh\u1eadt ph\u1ea3n h\u1ed3i' : 'Ph\u1ea3n h\u1ed3i sinh vi\u00ean'}</label><textarea id="ib-reply" class="textarea" placeholder="N\u1ed9i dung ph\u1ea3n h\u1ed3i s\u1ebd g\u1eedi t\u1edbi sinh vi\u00ean qua m\u1ee5c Th\u00f4ng b\u00e1o...">${esc(f.reply || '')}</textarea></div>
          <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn btn-outline" id="ib-task">${ic('wrench')}T\u1ea1o phi\u1ebfu b\u1ea3o tr\u00ec</button><button class="btn btn-red" id="ib-send">${ic('send')}G\u1eedi ph\u1ea3n h\u1ed3i</button></div></div>`;
      } else if (cur && st.kind === 'chat') {
        const m = K.db.chats[cur.id]; const s = K.student(cur.id);
        detail = `<div class="card pad"><div class="row">${s ? av(s.avatar, 48) : ''}<span><b style="color:var(--navy);font-size:17px;display:block">${esc(s ? s.name : cur.id)}</b><small class="muted">${cur.id}${s && s.room ? ' \u00b7 Ph\u00f2ng ' + s.room : ''}</small></span></div>
          <div class="chat-box" id="ib-chat">${m.map((x) => `<div class="msg ${x.me ? 'them' : 'mine'}"><div>${esc(x.t)}</div><small>${x.me ? esc(s ? s.name : '') : 'Ban qu\u1ea3n l\u00fd'} \u00b7 ${esc(x.d || '')}</small></div>`).join('')}</div>
          <form class="row" id="ib-chat-f" style="margin-top:12px"><input id="ib-chat-in" class="input" placeholder="Nh\u1eadp c\u00e2u tr\u1ea3 l\u1eddi..." style="flex:1"><button class="btn btn-red">${ic('send')}G\u1eedi</button></form></div>`;
      } else if (cur) {
        const c = K.db.contacts.find((x) => x.id === cur.id);
        detail = `<div class="card pad"><div class="row" style="justify-content:space-between"><span><b style="color:var(--navy);font-size:20px;display:block">${esc(c.name)}</b><small class="muted">${esc(c.contact)} \u00b7 ${c.at}${c.topic ? ' \u00b7 ' + esc(c.topic) : ''}</small></span>${c.done ? badge('\u0110\u00e3 li\u00ean h\u1ec7', 'green', { icon: 'circle-check' }) : badge('Ch\u01b0a x\u1eed l\u00fd', 'orange', { icon: 'clock' })}</div><p style="line-height:1.7;margin-top:16px;color:var(--ink);white-space:pre-line">${esc(c.msg)}</p>
          <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-outline" id="ib-copy">${ic('copy')}Sao ch\u00e9p li\u00ean h\u1ec7</button><button class="btn ${c.done ? 'btn-outline' : 'btn-red'}" id="ib-done">${ic(c.done ? 'rotate-ccw' : 'check')}${c.done ? '\u0110\u00e1nh d\u1ea5u ch\u01b0a x\u1eed l\u00fd' : '\u0110\u00e1nh d\u1ea5u \u0111\u00e3 li\u00ean h\u1ec7'}</button></div></div>`;
      }
      return adminShell(`<div><h1 style="font-size:38px;font-weight:800">Ph\u1ea3n \u00e1nh &amp; li\u00ean h\u1ec7</h1>${App.crumb([['Th\u00f4ng b\u00e1o', 'ql-thong-bao'], 'Ph\u1ea3n \u00e1nh & li\u00ean h\u1ec7'])}</div>${App.noteTabs('ql-phan-anh')}
        <div class="grid resp-1" style="grid-template-columns:400px 1fr;gap:14px;align-items:start">
          <div class="card" style="padding:10px"><div class="seg" style="width:100%;border:0;background:#f1f6fd;margin-bottom:8px">${tabs.map(([k, t, n]) => `<button class="pill ${st.kind === k ? 'on' : ''}" data-kind="${k}" style="flex:1;justify-content:center;padding:0 8px;font-size:14px;${st.kind === k ? '' : 'background:transparent'}">${t}${n ? ` <span class="cnt-dot">${n}</span>` : ''}</button>`).join('')}</div>
            <div style="max-height:620px;overflow:auto">${items.map((x) => `<button class="inbox-item ${x.id === st.sel ? 'on' : ''}" data-item="${x.id}">${x.av ? av(x.av, 42) : `<span class="amen-ic blue sm">${ic('user-round')}</span>`}<span style="flex:1;min-width:0"><b>${esc(x.t)}</b><small>${esc(x.s)}</small></span><span style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><small class="muted">${esc(String(x.d).slice(0, 10))}</small>${x.open ? '<i class="unread-dot"></i>' : ''}</span></button>`).join('') || '<p class="muted" style="text-align:center;padding:30px">Kh\u00f4ng c\u00f3 m\u1ee5c n\u00e0o.</p>'}</div></div>
          ${detail}</div>`);
    },
    mount: (root) => {
      const st = App.st.inbox;
      root.querySelectorAll('[data-kind]').forEach((b) => b.onclick = () => { st.kind = b.dataset.kind; st.sel = null; App.refresh(); });
      root.querySelectorAll('[data-item]').forEach((b) => b.onclick = () => { st.sel = b.dataset.item; App.refresh(); });
      const chat = root.querySelector('#ib-chat'); if (chat) { chat.scrollTop = 1e6; const m = K.db.chats[st.sel]; if (m.some((x) => x.unread)) { m.forEach((x) => delete x.unread); K.save(); } }
      const send = root.querySelector('#ib-send'); if (send) send.onclick = () => {
        const f = K.db.feedback.find((x) => x.id === st.sel); const v = root.querySelector('#ib-reply').value.trim();
        if (v.length < 5) return App.toast('N\u1ed9i dung ph\u1ea3n h\u1ed3i c\u1ea7n t\u1ed1i thi\u1ec3u 5 k\u00fd t\u1ef1', 'err');
        f.reply = v; f.status = 'da-phan-hoi'; f.repliedAt = K.now();
        notifyStudent(f.student, 'Ph\u1ea3n h\u1ed3i: ' + f.title, v);
        K.db.activity.unshift({ at: K.now(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', av: 'av_admin', act: 'Ph\u1ea3n h\u1ed3i ph\u1ea3n \u00e1nh', icon: 'ok', text: 'Ph\u1ea3n h\u1ed3i \u201c' + f.title + '\u201d c\u1ee7a ' + ((K.student(f.student) || {}).name || f.student) });
        K.save(); App.toast('\u0110\u00e3 g\u1eedi ph\u1ea3n h\u1ed3i t\u1edbi sinh vi\u00ean'); App.refresh();
      };
      const task = root.querySelector('#ib-task'); if (task) task.onclick = () => { const f = K.db.feedback.find((x) => x.id === st.sel); const s = K.student(f.student); App.newWorkOrder({ room: s && s.room ? s.room : 'A302' }); setTimeout(() => { const t = document.querySelector('#w-title'); if (t) t.value = f.title; const d = document.querySelector('#w-desc'); if (d) d.value = f.body; }, 50); };
      const cf = root.querySelector('#ib-chat-f'); if (cf) cf.onsubmit = (e) => { e.preventDefault(); const v = root.querySelector('#ib-chat-in').value.trim(); if (!v) return; K.db.chats[st.sel].push({ me: false, t: v, d: K.now() }); notifyStudent(st.sel, 'Ban qu\u1ea3n l\u00fd \u0111\u00e3 tr\u1ea3 l\u1eddi tin nh\u1eafn c\u1ee7a b\u1ea1n', v); K.save(); App.refresh(); };
      const done = root.querySelector('#ib-done'); if (done) done.onclick = () => { const c = K.db.contacts.find((x) => x.id === st.sel); c.done = !c.done; K.save(); App.toast(c.done ? '\u0110\u00e3 \u0111\u00e1nh d\u1ea5u \u0111\u00e3 li\u00ean h\u1ec7' : '\u0110\u00e3 chuy\u1ec3n v\u1ec1 ch\u01b0a x\u1eed l\u00fd'); App.refresh(); };
      const cp = root.querySelector('#ib-copy'); if (cp) cp.onclick = () => { const c = K.db.contacts.find((x) => x.id === st.sel); const t = c.name + ' \u2013 ' + c.contact; try { navigator.clipboard.writeText(t).then(() => App.toast('\u0110\u00e3 sao ch\u00e9p: ' + t)).catch(() => App.toast(t)); } catch (e2) { App.toast(t); } };
    },
  };
  // "So\u1ea1n th\u00f4ng b\u00e1o m\u1edbi" t\u1eeb c\u00e1c trang kh\u00e1c: x\u00f3a tr\u1ea1ng th\u00e1i s\u1eeda
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-newnote="1"]'); if (b && App.st.compose && App.st.compose.editId) App.st.compose = null; }, true);

  // ============ Bi\u1ec3u \u0111\u1ed3 c\u1ed9t (SVG) ============
  App.colChart = ({ labels, series, stacked, fmt, h }) => {
    const W = 760, H = h || 240, L = 52, R = 12, T = 16, B = 34;
    fmt = fmt || ((v) => v.toLocaleString('vi-VN'));
    const totals = labels.map((_, i) => (stacked ? series.reduce((s, x) => s + x.values[i], 0) : Math.max(...series.map((x) => x.values[i]))));
    const rawMax = Math.max(1, ...totals);
    const mag = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => rawMax / s <= 4) || mag * 10;
    const max = step * Math.ceil(rawMax / step);
    const y = (v) => T + (H - T - B) * (1 - v / max);
    const band = (W - L - R) / labels.length;
    const groupW = Math.min(band * 0.62, stacked ? 56 : 30 * series.length + 4);
    const ticks = []; for (let v = 0; v <= max + 1e-9; v += step) ticks.push(v);
    let marks = '';
    labels.forEach((lab, i) => {
      const cx = L + band * i + band / 2;
      const tip = esc(lab) + '|' + series.map((s) => esc(s.name) + ': ' + esc(fmt(s.values[i]))).join('|');
      if (stacked) {
        let acc = 0;
        const segs = series.map((s, k) => { const v = s.values[i]; const y0 = y(acc), y1 = y(acc + v); acc += v; const hh = Math.max(0, y0 - y1 - (k < series.length - 1 && v ? 2 : 0)); return v ? `<rect x="${cx - groupW / 2}" y="${y1}" width="${groupW}" height="${hh}" rx="${k === series.length - 1 || series.slice(k + 1).every((z) => !z.values[i]) ? 4 : 0}" fill="${s.color}"/>` : ''; }).join('');
        marks += `<g class="cbar" data-tip="${tip}">${segs}<rect x="${cx - band / 2}" y="${T}" width="${band}" height="${H - T - B}" fill="transparent"/></g>`;
      } else {
        const bw = (groupW - 2 * (series.length - 1)) / series.length;
        marks += `<g class="cbar" data-tip="${tip}">${series.map((s, k) => { const v = s.values[i]; const x0 = cx - groupW / 2 + k * (bw + 2); return `<rect x="${x0}" y="${y(v)}" width="${bw}" height="${Math.max(0, y(0) - y(v))}" rx="${Math.min(4, bw / 2)}" fill="${s.color}"/>`; }).join('')}<rect x="${cx - band / 2}" y="${T}" width="${band}" height="${H - T - B}" fill="transparent"/></g>`;
      }
      marks += `<text x="${cx}" y="${H - 12}" text-anchor="middle" class="ctick">${esc(lab)}</text>`;
      if (labels.length <= 8) marks += `<text x="${cx}" y="${y(totals[i]) - 6}" text-anchor="middle" class="cval">${esc(fmt(totals[i]))}</text>`;
    });
    const grid = ticks.map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="cgrid"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" class="ctick">${esc(fmt(v))}</text>`).join('');
    const legend = series.length > 1 ? `<div class="clegend">${series.map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>` : '';
    return `<div class="chart">${legend}<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bi\u1ec3u \u0111\u1ed3 c\u1ed9t">${grid}${marks}</svg><div class="ctip" hidden></div></div>`;
  };
  App.bindCharts = (root) => root.querySelectorAll('.chart').forEach((c) => {
    const tip = c.querySelector('.ctip');
    c.querySelectorAll('.cbar').forEach((g) => {
      g.addEventListener('mousemove', (e) => { const [h, ...rows] = g.dataset.tip.split('|'); tip.innerHTML = `<b>${h}</b>${rows.map((r) => `<div>${r}</div>`).join('')}`; tip.hidden = false; const rc = c.getBoundingClientRect(); let x = e.clientX - rc.left + 14; if (x + 190 > rc.width) x -= 210; tip.style.left = x + 'px'; tip.style.top = (e.clientY - rc.top - 10) + 'px'; g.classList.add('hot'); });
      g.addEventListener('mouseleave', () => { tip.hidden = true; g.classList.remove('hot'); });
    });
  });
  const BLUE = '#2563eb', AMBER = '#e8a33a', NEUTRAL = '#cdd7e6';
  App.reportChart = (tab, khu) => {
    let title, chart, note;
    if (tab === 'stay') {
      const ks = K.khuStats().filter((k) => !khu || k.khu === khu);
      title = 'Gi\u01b0\u1eddng \u0111ang \u1edf v\u00e0 c\u00f2n tr\u1ed1ng theo t\u1ea7ng'; note = 'C\u1ed9t ch\u1ed3ng: ph\u1ea7n xanh l\u00e0 gi\u01b0\u1eddng \u0111ang c\u00f3 sinh vi\u00ean, ph\u1ea7n x\u00e1m l\u00e0 gi\u01b0\u1eddng tr\u1ed1ng.';
      chart = App.colChart({ labels: ks.map((k) => 'T\u1ea7ng ' + k.khu), series: [{ name: '\u0110ang \u1edf', color: BLUE, values: ks.map((k) => k.used) }, { name: 'C\u00f2n tr\u1ed1ng', color: NEUTRAL, values: ks.map((k) => k.free) }], stacked: true });
    } else if (tab === 'fee') {
      const I = K.db.invoices.filter((i) => !khu || i.khu === khu);
      const per = [...new Set(I.map((i) => i.period))].sort((a, b) => a.split('/').reverse().join('').localeCompare(b.split('/').reverse().join('')));
      const sum = (p, paid) => I.filter((i) => i.period === p && (paid ? i.status === 'da-tt' : i.status !== 'da-tt')).reduce((s, i) => s + i.total, 0);
      title = 'S\u1ed1 ti\u1ec1n \u0111\u00e3 thu v\u00e0 c\u00f2n ph\u1ea3i thu theo k\u1ef3'; note = 'T\u1ed5ng chi\u1ec1u cao c\u1ed9t l\u00e0 s\u1ed1 ti\u1ec1n ph\u1ea3i thu c\u1ee7a k\u1ef3.';
      chart = App.colChart({ labels: per, series: [{ name: '\u0110\u00e3 thu', color: BLUE, values: per.map((p) => sum(p, true)) }, { name: 'C\u00f2n ph\u1ea3i thu', color: AMBER, values: per.map((p) => sum(p, false)) }], stacked: true, fmt: (v) => (v >= 1e6 ? (v / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + 'tr' : Math.round(v / 1000) + 'k') });
    } else if (tab === 'util') {
      const months = Object.keys(K.db.meters).sort((a, b) => a.split('/').reverse().join('').localeCompare(b.split('/').reverse().join('')));
      const sumE = (mo, k) => Object.entries(K.db.meters[mo]).filter(([r, x]) => K.fl(r) === k && x.en != null && x.eo != null).reduce((a, [, x]) => a + x.en - x.eo, 0);
      const ks = K.khus().filter((k) => !khu || k === khu);
      title = '\u0110i\u1ec7n ti\u00eau th\u1ee5 theo t\u1ea7ng (kWh)'; note = 'M\u1ed7i c\u1ed9t l\u00e0 m\u1ed9t k\u1ef3; c\u1ed9t ch\u1ed3ng theo t\u1ea7ng.';
      const cols = ['#2563eb', '#e8a33a', '#16a34a', '#9333ea', '#64748b'];
      chart = months.length ? App.colChart({ labels: months, series: ks.map((k, i) => ({ name: 'T\u1ea7ng ' + k, color: cols[i % cols.length], values: months.map((mo) => sumE(mo, k)) })), stacked: true, fmt: (v) => v.toLocaleString('vi-VN').replace(/,/g, '.') }) : '<p class="muted" style="padding:20px;text-align:center">Ch\u01b0a c\u00f3 ch\u1ec9 s\u1ed1.</p>';
    } else if (tab === 'rule') {
      const RA = App.rulesApi; const VS = K.db.violations.filter((v) => v.status !== 'da-huy' && (!khu || K.fl((K.student(v.student) || {}).room) === khu));
      const cats = RA.CATS.filter((c) => VS.some((v) => RA.rule(v.rule).cat === c));
      title = 'S\u1ed1 vi ph\u1ea1m theo nh\u00f3m n\u1ed9i quy'; note = 'C\u1ed9t ch\u1ed3ng: ph\u1ea7n xanh \u0111\u00e3 x\u1eed l\u00fd, ph\u1ea7n cam \u0111ang ch\u1edd x\u1eed l\u00fd ho\u1eb7c khi\u1ebfu n\u1ea1i.';
      chart = cats.length ? App.colChart({ labels: cats, series: [{ name: '\u0110\u00e3 x\u1eed l\u00fd', color: BLUE, values: cats.map((c) => VS.filter((v) => RA.rule(v.rule).cat === c && v.status === 'da-xu-ly').length) }, { name: '\u0110ang m\u1edf', color: AMBER, values: cats.map((c) => VS.filter((v) => RA.rule(v.rule).cat === c && v.status !== 'da-xu-ly').length) }], stacked: true, fmt: (v) => v + '' }) : '<p class="muted" style="padding:20px;text-align:center">Ch\u01b0a c\u00f3 vi ph\u1ea1m.</p>';
    } else {
      const R = K.db.repairs.filter((r) => !khu || (r.room && K.fl(r.room) === khu));
      const kinds = [...new Set(R.map((r) => r.kind || r.category))];
      title = 'S\u1ed1 phi\u1ebfu b\u1ea3o tr\u00ec theo lo\u1ea1i s\u1ef1 c\u1ed1'; note = 'G\u1ed3m c\u1ea3 phi\u1ebfu \u0111ang m\u1edf v\u00e0 \u0111\u00e3 ho\u00e0n t\u1ea5t.';
      chart = App.colChart({ labels: kinds, series: [{ name: 'S\u1ed1 phi\u1ebfu', color: BLUE, values: kinds.map((k) => R.filter((r) => (r.kind || r.category) === k).length) }], fmt: (v) => v + '' });
    }
    return `<div class="card pad" style="padding:18px 18px"><h2 class="card-t" style="font-size:20px;margin-bottom:4px">${ic('chart-column')}${title}</h2>${note ? `<p class="muted small" style="margin-bottom:10px">${note}</p>` : ''}${chart}</div>`;
  };
  App.copyTable = (tbl) => {
    if (!tbl) return;
    const csv = [...tbl.querySelectorAll('tr')].map((tr) => [...tr.children].map((td) => '"' + td.textContent.trim().replace(/\s+/g, ' ').replace(/"/g, '""') + '"').join(',')).join('\n');
    const fallback = () => App.modal({ title: 'Sao ch\u00e9p d\u1eef li\u1ec7u', body: `<textarea class="textarea" style="min-height:220px" readonly>${esc(csv)}</textarea><p class="muted small" style="margin-top:8px">Ch\u1ecdn to\u00e0n b\u1ed9 (Ctrl+A) r\u1ed3i sao ch\u00e9p (Ctrl+C), sau \u0111\u00f3 d\u00e1n v\u00e0o Excel.</p>` });
    try { navigator.clipboard.writeText(csv).then(() => App.toast('\u0110\u00e3 sao ch\u00e9p b\u1ea3ng s\u1ed1 li\u1ec7u. D\u00e1n (Ctrl+V) v\u00e0o Excel ho\u1eb7c Google Sheets.')).catch(fallback); } catch (e) { fallback(); }
  };

  // ============ N\u00fat l\u00ean \u0111\u1ea7u trang ============
  const top = document.createElement('button');
  top.className = 'totop'; top.setAttribute('aria-label', 'L\u00ean \u0111\u1ea7u trang'); top.hidden = true;
  top.innerHTML = ic('arrow-up');
  top.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(top);
  window.addEventListener('scroll', () => { top.hidden = window.scrollY < 600; }, { passive: true });
  App.icons(top);
})();
