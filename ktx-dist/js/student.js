/* C\u1ed5ng sinh vi\u00ean: \u1ea3nh 7\u201320 (v\u00e0 b\u1ea3n c\u1eadp nh\u1eadt 34, 35) */
(function () {
  const K = window.KTX, { esc, ic, im, av, spark, badge, sel } = App;
  const P = App.pages;
  const b2 = K.pad2;
  const money = K.money;
  const shell = (o, body) => App.shell(Object.assign({ role: 'student' }, o), body);
  const myInvoices = () => K.db.invoices.filter((i) => i.student === K.db.session.id);
  const myApp = () => K.db.applications.filter((a) => a.student === K.db.session.id).slice(-1)[0];
  const myRepairs = () => K.db.repairs.filter((r) => r.student === K.db.session.id);
  const noRoom = (o) => shell(o, `<div class="card pad" style="text-align:center;padding:60px 30px;margin-top:20px">${im('side_boy', '', '')}<h2 style="font-size:28px;margin-top:10px">B\u1ea1n ch\u01b0a c\u00f3 ph\u00f2ng \u1edf k\u00fd t\u00fac x\u00e1</h2><p class="muted" style="margin:10px auto 22px;max-width:520px;line-height:1.6">Ch\u1ecdn ph\u00f2ng c\u00f2n ch\u1ed7 v\u00e0 g\u1eedi h\u1ed3 s\u01a1 \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa. Sau khi Ban qu\u1ea3n l\u00fd duy\u1ec7t, th\u00f4ng tin ph\u00f2ng s\u1ebd hi\u1ec3n th\u1ecb t\u1ea1i \u0111\u00e2y.</p><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><button class="btn btn-red" data-go="phong-o">${ic('search')}T\u00ecm ph\u00f2ng</button><button class="btn btn-outline" data-go="sv-dang-ky-luu-tru">\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa</button></div></div>`);
  const semMonths = { 'H\u1ecdc k\u1ef3 I \u00b7 2026 \u2013 2027': ['01/09/2026', '31/01/2027'], 'H\u1ecdc k\u1ef3 II \u00b7 2026 \u2013 2027': ['01/02/2027', '31/07/2027'], 'H\u1ecdc k\u1ef3 I \u00b7 2027 \u2013 2028': ['01/09/2027', '31/01/2028'] };
  const stayTabs = (active, kind) => {
    const t = kind === 'v2'
      ? [['sv-ho-so', 'Th\u00f4ng tin l\u01b0u tr\u00fa'], ['sv-dang-ky-luu-tru', '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa'], ['sv-chuyen-phong', '\u0110\u1ed5i ph\u00f2ng'], ['sv-tra-phong', 'Tr\u1ea3 ph\u00f2ng']]
      : [['sv-ho-so', 'H\u1ed3 s\u01a1', 'file-text'], ['sv-gia-han', 'Gia h\u1ea1n', 'calendar-days'], ['sv-chuyen-phong', 'Chuy\u1ec3n ph\u00f2ng', 'arrow-left-right'], ['sv-tra-phong', 'Tr\u1ea3 ph\u00f2ng', 'log-out']];
    return `<div class="utabs boxed" style="${kind === 'icons' ? '' : ''}">${t.map(([g, l, i]) => `<button class="utab ${g === active ? 'on' : ''}" data-go="${g}" style="${kind === 'icons' ? '' : 'flex:1;justify-content:center'}">${kind === 'icons' ? ic(i) : ''}${l}</button>`).join('')}</div>`;
  };

  // ============ 7 / 35. T\u1ed5ng quan ============
  P['sv-tong-quan'] = {
    role: 'student', title: 'T\u1ed5ng quan',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-tong-quan', logo: 'stack', notif: 'count', search: 'T\u00ecm ki\u1ebfm th\u00f4ng b\u00e1o, d\u1ecbch v\u1ee5, h\u01b0\u1edbng d\u1eabn...', sbw: 228, icons: { 'sv-ho-so': 'building-2', 'sv-hoa-don': 'file-text' } };
      const r = u.room ? K.room(u.room) : null;
      const inv = myInvoices()[0];
      const app = myApp();
      const notes = App.myNotes().filter((n) => n.important || n.to).slice(0, 3);
      const roomCard = r ? `<div class="card pad" style="padding:14px 20px 16px">
          <div class="row" style="margin-bottom:10px"><img src="${K.A('ic_room_red')}" class="blend" style="width:38px" alt=""><h2 style="font-size:24px">Ph\u00f2ng ${r.code} \u00b7 T\u1ea7ng ${r.khu}</h2>${badge('\u0110ang l\u01b0u tr\u00fa', 'green', { icon: 'circle-plus' })}</div>
          <div style="display:grid;grid-template-columns:360px 1fr;gap:24px" class="resp-1"><img src="${K.A(r.code === 'A302' ? 'room_a302_wide' : r.img)}" style="width:100%;height:234px;object-fit:cover;border-radius:12px" alt="\u1ea2nh ph\u00f2ng ${r.code}">
          <div><div class="info-list">
            <div>${ic('layers')}<span>T\u1ea7ng</span><b>T\u1ea7ng ${r.khu}</b></div><div>${ic('door-closed')}<span>Ph\u00f2ng</span><b>${r.code}</b></div><div>${ic('bed-double')}<span>Gi\u01b0\u1eddng c\u1ee7a b\u1ea1n</span><b>Gi\u01b0\u1eddng ${b2(u.bed)}</b></div><div>${ic('users')}<span>S\u1ed1 ng\u01b0\u1eddi trong ph\u00f2ng</span><b>${K.occCount(r.code)} sinh vi\u00ean</b></div><div>${ic('bed-single')}<span>T\u1ed5ng s\u1ed1 gi\u01b0\u1eddng</span><b>${r.beds} gi\u01b0\u1eddng</b></div></div>
            <button class="btn btn-soft btn-block" data-go="sv-phong" style="margin-top:20px;font-size:16px">${ic('eye')}Xem ph\u00f2ng</button></div></div></div>`
        : `<div class="card pad" style="text-align:center;padding:40px 20px"><h2 style="font-size:22px">B\u1ea1n ch\u01b0a c\u00f3 ph\u00f2ng</h2><p class="muted" style="margin:10px 0 18px">Ch\u1ecdn ph\u00f2ng v\u00e0 g\u1eedi h\u1ed3 s\u01a1 \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa \u0111\u1ec3 b\u1eaft \u0111\u1ea7u.</p><button class="btn btn-red" data-go="phong-o">${ic('search')}T\u00ecm ph\u00f2ng</button></div>`;
      const invCard = inv ? `<div class="card pad" style="padding:14px 22px 16px">
          <div class="row" style="margin-bottom:8px"><img src="${K.A('ic_invoice')}" class="blend" style="width:38px" alt=""><h2 style="font-size:24px">H\u00f3a \u0111\u01a1n th\u00e1ng ${inv.period.slice(0, 2)}</h2>${inv.status === 'da-tt' ? badge('\u0110\u00e3 thanh to\u00e1n', 'green', { icon: 'circle-check' }) : inv.status === 'cho-doi-soat' ? badge('Ch\u1edd \u0111\u1ed1i so\u00e1t', 'orange', { icon: 'clock' }) : badge('Ch\u01b0a thanh to\u00e1n', 'orange', { icon: 'circle-plus' })}</div>
          <div style="display:flex;justify-content:space-between;color:var(--text);font-size:15px;margin-bottom:6px"><span>M\u00e3 h\u00f3a \u0111\u01a1n: <b style="color:var(--navy)">${inv.id}</b></span><span>K\u1ef3 thanh to\u00e1n: <b style="color:var(--navy)">${inv.period}</b></span></div>
          <div class="amt-row"><span>${ic('house')}Ti\u1ec1n ph\u00f2ng</span><b>${money(inv.items[0].amount)}</b></div><div class="amt-row"><span>${ic('zap')}Ti\u1ec1n \u0111i\u1ec7n (\u0111\u1ecbnh m\u1ee9c)</span><b>${money(inv.items[1].amount)}</b></div><div class="amt-row"><span>${ic('droplet')}Ti\u1ec1n n\u01b0\u1edbc (\u0111\u1ecbnh m\u1ee9c)</span><b>${money(inv.items[2].amount)}</b></div>
          <div class="total-row" style="border:0;padding:6px 0 8px"><span>T\u1ed5ng c\u1ed9ng</span><b>${money(inv.total)}</b></div>
          <div class="grid g2" style="gap:16px"><button class="btn btn-red" data-go="sv-hoa-don">${ic('credit-card')}Xem h\u00f3a \u0111\u01a1n</button><button class="btn btn-outline-red" data-go="sv-thanh-toan-${inv.id}">${ic('credit-card')}${inv.status === 'chua-tt' ? 'Thanh to\u00e1n ngay' : 'Xem chi ti\u1ebft'}</button></div></div>`
        : `<div class="card pad"><h2 style="font-size:22px">H\u00f3a \u0111\u01a1n</h2><p class="muted" style="margin-top:10px">Ch\u01b0a c\u00f3 h\u00f3a \u0111\u01a1n n\u00e0o.</p></div>`;
      return shell(o, `
        <div class="welcome"><h1>Ch\u00e0o ${esc(u.name)}!${spark}</h1><p>M\u1ecdi vi\u1ec7c \u1edf k\u00fd t\u00fac x\u00e1, g\u1ecdn trong m\u1ed9t n\u01a1i.</p></div>
        <div class="grid resp-1" style="grid-template-columns:1.25fr 1fr;gap:18px;margin-top:2px">${roomCard}${invCard}</div>
        <div class="card qa">
          <a href="#" data-go="sv-sua-chua">${im('qa_repair', 'blend')}<span><b>B\u00e1o s\u1eeda ch\u1eefa</b><small>G\u1eedi y\u00eau c\u1ea7u s\u1eeda ch\u1eefa thi\u1ebft b\u1ecb, c\u01a1 s\u1edf v\u1eadt ch\u1ea5t.</small></span><i class="go">${ic('chevron-right')}</i></a>
          <a href="#" data-go="sv-gia-han">${im('qa_extend', 'blend')}<span><b>Gia h\u1ea1n</b><small>\u0110\u0103ng k\u00fd gia h\u1ea1n l\u01b0u tr\u00fa k\u00fd t\u00fac x\u00e1.</small></span><i class="go">${ic('chevron-right')}</i></a>
          <a href="#" data-go="sv-chuyen-phong">${im('qa_transfer', 'blend')}<span><b>Chuy\u1ec3n ph\u00f2ng</b><small>\u0110\u0103ng k\u00fd nhu c\u1ea7u chuy\u1ec3n ph\u00f2ng.</small></span><i class="go">${ic('chevron-right')}</i></a>
          <a href="#" data-go="sv-ho-tro">${im('qa_feedback', 'blend')}<span><b>G\u1eedi ph\u1ea3n \u00e1nh</b><small>G\u00f3p \u00fd, ph\u1ea3n \u00e1nh v\u1ea5n \u0111\u1ec1 t\u1ea1i k\u00fd t\u00fac x\u00e1.</small></span><i class="go">${ic('chevron-right')}</i></a>
        </div>
        <div class="grid resp-1" style="grid-template-columns:1.03fr 1fr;gap:18px">
          <div class="card pad" style="padding:16px 22px 8px"><div class="card-h" style="margin-bottom:8px"><h2 class="card-t">${im('ic_megaphone', 'blend', '')}Th\u00f4ng b\u00e1o m\u1edbi</h2><a href="#" class="link link-red" data-go="sv-thong-bao" style="font-size:15px">Xem t\u1ea5t c\u1ea3 ${ic('arrow-right')}</a></div>
            ${notes.map((n) => `<a href="#" class="list-row" data-note="${n.id}"><i class="dot" style="background:${n.read ? 'var(--blue)' : 'var(--red)'}"></i><span><b>${esc(n.title)}</b><small>${esc(n.summary)}</small></span><time>${esc(n.dash || n.time)}</time></a>`).join('')}</div>
          <div class="card pad" style="padding:16px 22px"><div class="card-h" style="margin-bottom:6px"><h2 class="card-t">${ic('file-text')}H\u1ed3 s\u01a1 l\u01b0u tr\u00fa</h2>${app ? App.statusBadge(app.status) : ''}</div>
            ${app ? `<div style="display:grid;grid-template-columns:1fr 210px;gap:10px;align-items:center" class="resp-1"><div class="info-list" style="font-size:15px">
              <div style="grid-template-columns:28px 130px 1fr">${ic('user-round')}<span>H\u1ecd t\u00ean</span><b>${esc(u.name)}</b></div>
              <div style="grid-template-columns:28px 130px 1fr">${ic('graduation-cap')}<span>M\u00e3 sinh vi\u00ean</span><b>${u.id}</b></div>
              <div style="grid-template-columns:28px 130px 1fr">${ic('building')}<span>Ph\u00f2ng</span><b>${app.room} \u00b7 T\u1ea7ng ${K.fl(app.room)} \u00b7 Gi\u01b0\u1eddng ${b2(app.bed)}</b></div>
              <div style="grid-template-columns:28px 130px 1fr">${ic('calendar-days')}<span>Th\u1eddi gian l\u01b0u tr\u00fa</span><b>N\u0103m h\u1ecdc ${app.term}</b></div>
              <div style="grid-template-columns:28px 130px 1fr">${ic('file-check')}<span>Tr\u1ea1ng th\u00e1i h\u1ed3 s\u01a1</span><span>${App.statusBadge(app.status)}</span></div></div>
              <div style="text-align:center">${im('ic_clipboard', 'blend', '')}<button class="btn btn-soft btn-block" data-contract style="margin-top:6px">${ic('file-text')}Xem h\u1ee3p \u0111\u1ed3ng</button></div></div>`
            : `<p class="muted">B\u1ea1n ch\u01b0a g\u1eedi h\u1ed3 s\u01a1 l\u01b0u tr\u00fa.</p><button class="btn btn-red" style="margin-top:14px" data-go="sv-dang-ky-luu-tru">\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa</button>`}</div>
        </div>`);
    },
    mount: (root) => {
      root.querySelectorAll('[data-note]').forEach((a) => a.onclick = (e) => { e.preventDefault(); const n = K.db.notifications.find((x) => x.id === a.dataset.note); n.read = true; K.save(); App.st['sv-thong-bao'] = { tab: 'all', sel: n.id }; App.go('sv-thong-bao'); });
      const c = root.querySelector('[data-contract]'); if (c) c.onclick = () => App.showContract();
    },
  };

  App.showContract = (sid) => {
    const u = sid ? K.student(sid) : K.me();
    const c = K.db.contracts.find((x) => x.student === u.id);
    const app = K.db.applications.find((a) => a.student === u.id && a.status === 'da-duyet');
    App.modal({ title: 'Th\u1ecfa thu\u1eadn l\u01b0u tr\u00fa', wide: true, body: `<div style="border:1px solid var(--line);border-radius:12px;padding:20px 24px">
      <h3 style="font-size:20px">TH\u1eceA THU\u1eacN L\u01afU TR\u00da T\u1ea0I K\u00dd T\u00daC X\u00c1 \u0110\u1ea0I H\u1eccC NGH\u1ec6 AN</h3><p class="muted small" style="margin-top:4px">S\u1ed1: ${c ? c.id : (app ? app.id : '\u2014')}</p>
      <dl class="kv" style="margin-top:16px"><dt>Sinh vi\u00ean</dt><dd>${esc(u.name)} (${u.id})</dd><dt>Ph\u00f2ng</dt><dd>${u.room || (app && app.room) || '\u2014'} \u00b7 Gi\u01b0\u1eddng ${b2(u.bed || (app && app.bed) || 0)}</dd><dt>N\u0103m h\u1ecdc</dt><dd>2026 \u2013 2027</dd><dt>Th\u1eddi h\u1ea1n</dt><dd>01/10/2026 \u2013 31/08/2027</dd><dt>Ph\u00ed ph\u00f2ng</dt><dd>${money(K.room(u.room || 'A302').price)} / th\u00e1ng</dd></dl>
      <ol style="margin:16px 0 0;padding-left:20px;line-height:1.8">${App.RULES.slice(0, 5).map((r) => `<li>${r}</li>`).join('')}</ol></div>`,
      foot: `<button class="btn btn-outline" data-dl>${ic('download')}T\u1ea3i xu\u1ed1ng</button><button class="btn btn-red" data-x>\u0110\u00f3ng</button>`,
      onMount: (el) => el.querySelector('[data-dl]').onclick = () => App.toast('B\u1ea3n PDF th\u1ecfa thu\u1eadn \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi t\u1edbi email ' + u.email) });
  };

  // ============ 8 / 34. \u0110\u0103ng k\u00fd l\u01b0u tr\u00fa ============
  P['sv-dang-ky-luu-tru'] = {
    role: 'student', title: '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-so', logo: 'inline', notif: 'dot', search: 'T\u00ecm d\u1ecbch v\u1ee5, th\u00f4ng b\u00e1o, h\u01b0\u1edbng d\u1eabn...', foot: 'illus', sbw: 262, icons: { 'sv-hoa-don': 'receipt-text' } };
      const bk = App.st.booking || { room: 'B204', bed: (K.bedMap('B204').find((b) => b.free) || {}).bed || 4 };
      App.st.booking = bk;
      const r = K.room(bk.room);
      const st = App.state('reg', () => ({ step: 2, faculty: '', phone: '', emer: u.emergency.name || '', term: 'H\u1ecdc k\u1ef3 I \u00b7 2026 \u2013 2027', date: '', agree: false, files: [] }));
      const pending = K.db.applications.find((a) => a.student === u.id && a.status === 'cho-duyet');
      const s1 = `<span class="stepnum done">${ic('check')}</span>`;
      const stepper = `<div class="card" style="display:grid;grid-template-columns:auto 1fr auto 1fr auto;align-items:center;gap:22px;padding:14px 32px">
        <div class="row">${s1}<div><b style="color:var(--navy);font-weight:500">1. Ch\u1ecdn ph\u00f2ng</b><div class="small muted">\u0110\u00e3 ch\u1ecdn ph\u00f2ng ph\u00f9 h\u1ee3p</div></div></div><i style="height:1.5px;background:#c9d6ea"></i>
        <div class="row"><span class="stepnum ${st.step === 2 ? 'on' : 'done'}">${st.step === 2 ? '2' : ic('check')}</span><div><b style="color:${st.step === 2 ? 'var(--red)' : 'var(--navy)'};font-weight:600">2. Th\u00f4ng tin \u0111\u0103ng k\u00fd</b><div class="small" style="color:${st.step === 2 ? 'var(--red)' : 'var(--muted)'}">Nh\u1eadp th\u00f4ng tin c\u00e1 nh\u00e2n v\u00e0 gi\u1ea5y t\u1edd</div></div></div><i style="height:1.5px;background:#c9d6ea"></i>
        <div class="row"><span class="stepnum ${st.step === 3 ? 'on' : ''}" style="${st.step === 3 ? '' : 'background:#eef2f7;color:#5d6b88;border-color:#e2e8f0'}">3</span><div><b style="color:${st.step === 3 ? 'var(--red)' : 'var(--text)'};font-weight:500">3. Ki\u1ec3m tra & g\u1eedi</b><div class="small muted">X\u00e1c nh\u1eadn v\u00e0 ho\u00e0n t\u1ea5t</div></div></div></div>`;
      const facs = [['', 'Ch\u1ecdn khoa'], 'C\u00f4ng ngh\u1ec7 th\u00f4ng tin', 'Kinh t\u1ebf', 'Ngo\u1ea1i ng\u1eef', 'S\u01b0 ph\u1ea1m', '\u0110i\u1ec7n \u2013 \u0110i\u1ec7n t\u1eed', 'X\u00e2y d\u1ef1ng'];
      const left = st.step === 2 ? `<form class="card pad" id="rg2" novalidate style="padding:20px 18px 18px">
          <h3 class="sec-t">${ic('user-round')}Th\u00f4ng tin sinh vi\u00ean</h3>
          <div class="grid g2" style="gap:14px 18px;margin-top:14px">
            <div class="field"><label>H\u1ecd v\u00e0 t\u00ean <span class="req">*</span></label><input class="input ro" readonly value="${esc(u.name)}" style="background:#eef1f5;border-color:#eef1f5"></div>
            <div class="field"><label>M\u00e3 sinh vi\u00ean <span class="req">*</span></label><input class="input ro" readonly value="${u.id}" style="background:#eef1f5;border-color:#eef1f5"></div>
            <div class="field"><label for="r-fac">Khoa / L\u1edbp <span class="req">*</span></label>${sel('r-fac', facs, st.faculty)}</div>
            <div class="field"><label>Email li\u00ean h\u1ec7 <span class="req">*</span></label><input class="input ro" readonly value="${esc(u.email)}" style="background:#eef1f5;border-color:#eef1f5"></div>
            <div class="field"><label for="r-phone">S\u1ed1 \u0111i\u1ec7n tho\u1ea1i li\u00ean h\u1ec7 <span class="req">*</span></label><div class="iwrap">${ic('phone')}<input id="r-phone" class="input" placeholder="090 *** ****" value="${esc(st.phone)}" inputmode="tel"></div></div>
            <div class="field"><label for="r-emer">Ng\u01b0\u1eddi li\u00ean h\u1ec7 kh\u1ea9n c\u1ea5p <span class="req">*</span></label><div class="iwrap">${ic('user-round')}<input id="r-emer" class="input" placeholder="H\u1ecd t\u00ean ng\u01b0\u1eddi li\u00ean h\u1ec7" value="${esc(st.emer)}"></div></div>
          </div><hr class="hr">
          <h3 class="sec-t">${ic('calendar-days')}Th\u1eddi gian l\u01b0u tr\u00fa</h3>
          <div class="grid g2" style="gap:14px 18px;margin-top:14px">
            <div class="field"><label for="r-term">H\u1ecdc k\u1ef3 / N\u0103m h\u1ecdc <span class="req">*</span></label>${sel('r-term', Object.keys(semMonths), st.term)}</div>
            <div class="field"><label for="r-date">Ng\u00e0y d\u1ef1 ki\u1ebfn nh\u1eadn ph\u00f2ng <span class="req">*</span></label><div class="iwrap">${ic('calendar-days')}<input id="r-date" type="date" class="input" value="${st.date}" min="2026-09-01" max="2027-08-31"></div></div>
          </div>
          <h3 class="sec-t" style="margin:18px 0 12px">${ic('paperclip')}Th\u00eam gi\u1ea5y t\u1edd c\u1ea7n thi\u1ebft</h3>
          <div><label class="drop">${ic('file-text')}<span><b>Ch\u1ecdn t\u1ec7p</b> ho\u1eb7c k\u00e9o th\u1ea3 v\u00e0o \u0111\u00e2y<br><small style="font-size:11px">H\u1ed7 tr\u1ee3 \u0111\u1ecbnh d\u1ea1ng PDF, JPG, PNG (t\u1ed1i \u0111a 5MB)</small></span><input type="file" id="r-files" multiple accept=".pdf,.jpg,.jpeg,.png"></label></div>
          <p class="err" id="r-err" style="margin-top:10px" hidden></p>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:18px;flex-wrap:wrap"><label class="check" style="font-size:14px"><input type="checkbox" id="r-agree" ${st.agree ? 'checked' : ''}>T\u00f4i \u0111\u00e3 \u0111\u1ecdc v\u00e0 \u0111\u1ed3ng \u00fd v\u1edbi <a href="#" id="r-rules" style="text-decoration:underline">n\u1ed9i quy k\u00fd t\u00fac x\u00e1</a> <span class="req">*</span></label>
          <div class="row"><button type="button" class="btn btn-outline" style="border-color:var(--line);font-size:16px" data-go="phong-${r.code}">Quay l\u1ea1i</button><button class="btn btn-red" style="font-size:16px">Ki\u1ec3m tra h\u1ed3 s\u01a1 ${ic('arrow-right')}</button></div></div>
        </form>`
        : `<div class="card pad" style="padding:22px 24px"><h3 class="sec-t">${ic('clipboard-check')}Ki\u1ec3m tra th\u00f4ng tin tr\u01b0\u1edbc khi g\u1eedi</h3>
          <dl class="kv" style="margin-top:18px"><dt>H\u1ecd v\u00e0 t\u00ean</dt><dd>${esc(u.name)}</dd><dt>M\u00e3 sinh vi\u00ean</dt><dd>${u.id}</dd><dt>Khoa</dt><dd>${esc(st.faculty)}</dd><dt>Email</dt><dd>${esc(u.email)}</dd><dt>S\u1ed1 \u0111i\u1ec7n tho\u1ea1i</dt><dd>${esc(st.phone)}</dd><dt>Li\u00ean h\u1ec7 kh\u1ea9n c\u1ea5p</dt><dd>${esc(st.emer)}</dd><dt>H\u1ecdc k\u1ef3</dt><dd>${esc(st.term)}</dd><dt>Ng\u00e0y nh\u1eadn ph\u00f2ng</dt><dd>${st.date.split('-').reverse().join('/')}</dd><dt>Gi\u1ea5y t\u1edd</dt><dd>${st.files.length ? st.files.map(esc).join(', ') : 'N\u1ed9p b\u1ea3n gi\u1ea5y khi nh\u1eadn ph\u00f2ng'}</dd><dt>Ph\u00f2ng / gi\u01b0\u1eddng</dt><dd>${r.code} \u00b7 T\u1ea7ng ${r.khu} \u00b7 Gi\u01b0\u1eddng ${b2(bk.bed)}</dd></dl>
          <div class="card" style="box-shadow:none;background:var(--blue-50);padding:14px 16px;margin-top:20px;display:flex;gap:12px">${ic('info')}<span class="small" style="color:var(--ink)">Sau khi g\u1eedi, h\u1ed3 s\u01a1 chuy\u1ec3n sang tr\u1ea1ng th\u00e1i <b>Ch\u1edd duy\u1ec7t</b>. Ban qu\u1ea3n l\u00fd x\u00e9t duy\u1ec7t trong 3 \u2013 5 ng\u00e0y l\u00e0m vi\u1ec7c v\u00e0 th\u00f4ng b\u00e1o k\u1ebft qu\u1ea3 qua h\u1ec7 th\u1ed1ng.</span></div>
          <div class="row" style="justify-content:flex-end;margin-top:22px"><button class="btn btn-outline" id="r-back">S\u1eeda th\u00f4ng tin</button><button class="btn btn-red" id="r-send">${ic('send')}G\u1eedi h\u1ed3 s\u01a1</button></div></div>`;
      const right = `<div class="card pad" style="padding:18px 18px">
          <h3 class="sec-t">${ic('bed-double')}Th\u00f4ng tin ph\u00f2ng \u0111\u00e3 ch\u1ecdn</h3>
          <img src="${K.A(r.code === 'B204' ? 'room_b204_wide' : r.img)}" style="width:100%;height:199px;object-fit:cover;border-radius:10px;margin-top:14px" alt="\u1ea2nh ph\u00f2ng ${r.code}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0 4px"><h3 style="font-size:20px">Ph\u00f2ng ${r.code} \u2022 T\u1ea7ng ${r.khu}</h3>${badge('\u0110\u00e3 ch\u1ecdn', 'green', { icon: 'circle-check', sm: true })}</div>
          <div class="info-list lined" style="font-size:14px">
            <div>${ic('layers')}<span>T\u1ea7ng</span><span>T\u1ea7ng ${r.khu}</span></div><div>${ic('users')}<span>Lo\u1ea1i ph\u00f2ng</span><span>Ph\u00f2ng ${r.beds} ng\u01b0\u1eddi</span></div><div>${ic('bed-double')}<span>Gi\u01b0\u1eddng c\u1ee7a b\u1ea1n</span><span>Gi\u01b0\u1eddng ${b2(bk.bed)}</span></div><div>${ic('users-round')}<span>T\u1ed5ng s\u1ed1 gi\u01b0\u1eddng</span><span>${r.beds} gi\u01b0\u1eddng</span></div><div>${ic('user-round')}<span>S\u1ed1 sinh vi\u00ean hi\u1ec7n t\u1ea1i</span><span>${K.occCount(r.code)} sinh vi\u00ean</span></div></div>
          <hr class="hr" style="margin:10px 0">
          <h4 class="row" style="font-size:16px;gap:10px"><span style="width:22px;height:22px;border-radius:50%;background:var(--red);color:#fff;display:grid;place-items:center;font-size:13px">$</span>Chi ph\u00ed d\u1ef1 ki\u1ebfn</h4>
          <div class="info-list lined" style="font-size:14px;margin-top:6px">
            <div>${ic('bed-double')}<span>Ti\u1ec1n ph\u00f2ng</span><b style="font-weight:600">${money(r.price)} / th\u00e1ng</b></div><div>${ic('zap')}<span>\u0110i\u1ec7n <small class="muted">(t\u00ednh theo s\u1eed d\u1ee5ng)</small></span><b style="font-weight:600">30.000\u0111 / th\u00e1ng</b></div><div>${ic('droplet')}<span>N\u01b0\u1edbc <small class="muted">(t\u00ednh theo s\u1eed d\u1ee5ng)</small></span><b style="font-weight:600">20.000\u0111 / th\u00e1ng</b></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;background:#fdeef0;border-radius:8px;padding:12px 14px;margin-top:6px"><span class="row" style="gap:12px;color:var(--navy);font-weight:700">${ic('receipt-text')}T\u1ed5ng c\u1ed9ng d\u1ef1 ki\u1ebfn</span><b style="color:var(--red);font-size:20px">${money(r.price + 50000)} / th\u00e1ng</b></div>
        </div>`;
      return shell(o, `${App.phead({ cls: 'compact', crumb: [['Trang ch\u1ee7', 'sv-tong-quan'], ['L\u01b0u tr\u00fa', 'sv-ho-so'], '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa'], title: '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa', desc: '\u0110\u0103ng k\u00fd ph\u00f2ng k\u00fd t\u00fac x\u00e1 \u0111\u1ec3 b\u1eaft \u0111\u1ea7u h\u00e0nh tr\u00ecnh h\u1ecdc t\u1eadp thu\u1eadn ti\u1ec7n v\u00e0 an to\u00e0n t\u1ea1i \u0110\u1ea1i h\u1ecdc Ngh\u1ec7 An.' })}
        ${pending ? `<div class="card" style="padding:14px 20px;display:flex;gap:12px;align-items:center;background:#fff8ea;border-color:#fbeccd">${ic('clock')}<span>B\u1ea1n \u0111ang c\u00f3 h\u1ed3 s\u01a1 <b>${pending.id}</b> (${pending.room} \u00b7 Gi\u01b0\u1eddng ${b2(pending.bed)}) ch\u1edd duy\u1ec7t. G\u1eedi h\u1ed3 s\u01a1 m\u1edbi s\u1ebd thay th\u1ebf h\u1ed3 s\u01a1 n\u00e0y.</span></div>` : ''}
        ${stepper}<div class="grid resp-1" style="grid-template-columns:1.52fr 1fr;gap:16px;align-items:start">${left}${right}</div>`);
    },
    mount: (root) => {
      const st = App.st.reg; const u = K.me(); const bk = App.st.booking;
      const f = root.querySelector('#rg2');
      if (f) {
        root.querySelector('#r-rules').onclick = (e) => { e.preventDefault(); App.showRules(); };
        const keep = () => { st.faculty = f.querySelector('#r-fac').value; st.phone = f.querySelector('#r-phone').value.trim(); st.emer = f.querySelector('#r-emer').value.trim(); st.term = f.querySelector('#r-term').value; st.date = f.querySelector('#r-date').value; st.agree = f.querySelector('#r-agree').checked; const fl = f.querySelector('#r-files').files; if (fl.length) st.files = [...fl].map((x) => x.name); };
        f.onsubmit = (e) => {
          e.preventDefault(); keep();
          const err = f.querySelector('#r-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
          if (!st.faculty) return fail('Vui l\u00f2ng ch\u1ecdn khoa.');
          if (!/^0\d{9}$/.test(st.phone.replace(/\s/g, ''))) return fail('S\u1ed1 \u0111i\u1ec7n tho\u1ea1i li\u00ean h\u1ec7 g\u1ed3m 10 ch\u1eef s\u1ed1, b\u1eaft \u0111\u1ea7u b\u1eb1ng 0.');
          if (!st.emer) return fail('Vui l\u00f2ng nh\u1eadp h\u1ecd t\u00ean ng\u01b0\u1eddi li\u00ean h\u1ec7 kh\u1ea9n c\u1ea5p.');
          if (!st.date) return fail('Vui l\u00f2ng ch\u1ecdn ng\u00e0y d\u1ef1 ki\u1ebfn nh\u1eadn ph\u00f2ng.');
          if (!st.agree) return fail('B\u1ea1n c\u1ea7n \u0111\u1ed3ng \u00fd v\u1edbi n\u1ed9i quy k\u00fd t\u00fac x\u00e1.');
          if (K.freeBeds(bk.room) <= 0) return fail('Ph\u00f2ng \u0111\u00e3 h\u1ebft gi\u01b0\u1eddng tr\u1ed1ng. Vui l\u00f2ng ch\u1ecdn ph\u00f2ng kh\u00e1c.');
          st.step = 3; App.refresh();
        };
      } else {
        root.querySelector('#r-back').onclick = () => { st.step = 2; App.refresh(); };
        root.querySelector('#r-send').onclick = () => {
          K.db.applications = K.db.applications.filter((a) => !(a.student === u.id && a.status === 'cho-duyet'));
          const id = 'HS2026-' + String(40 + K.db.applications.length).padStart(4, '0');
          K.db.applications.push({ id, student: u.id, type: '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa m\u1edbi', room: bk.room, bed: bk.bed, term: '2026 \u2013 2027', period: 'T\u1eeb ' + st.date.split('-').reverse().slice(1).join('/') + ' \u0111\u1ebfn 06/2027', date: K.now(), status: 'cho-duyet', docs: [{ name: 'Gi\u1ea5y x\u00e1c nh\u1eadn sinh vi\u00ean', ok: st.files.length > 0 }, { name: 'CCCD (b\u1ea3n sao)', ok: st.files.length > 1 }, { name: '\u1ea2nh th\u1ebb 3x4', ok: st.files.length > 2 }, { name: '\u0110\u01a1n \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa', ok: true }], history: [{ t: 'Sinh vi\u00ean n\u1ed9p h\u1ed3 s\u01a1', d: K.now(), s: 'H\u1ed3 s\u01a1 \u0111\u01b0\u1ee3c g\u1eedi l\u00ean h\u1ec7 th\u1ed1ng.' }, { t: 'Ch\u1edd x\u00e9t duy\u1ec7t', d: K.now(), s: 'H\u1ed3 s\u01a1 \u0111ang ch\u1edd c\u00e1n b\u1ed9 qu\u1ea3n l\u00fd xem x\u00e9t.' }] });
          u.faculty = st.faculty; u.phone = st.phone; u.emergency.name = st.emer; if (u.status === 'moi') u.status = 'cho-phan-phong';
          K.save(); App.st.reg = null;
          App.toast('\u0110\u00e3 g\u1eedi h\u1ed3 s\u01a1 ' + id + '. H\u1ed3 s\u01a1 \u0111ang ch\u1edd Ban qu\u1ea3n l\u00fd duy\u1ec7t.');
          App.go('sv-ho-so');
        };
      }
    },
  };

  // ============ 9. Ph\u00f2ng c\u1ee7a t\u00f4i ============
  P['sv-phong'] = {
    role: 'student', title: 'Ph\u00f2ng c\u1ee7a t\u00f4i',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-phong', logo: 'stack', notif: 'dot', search: 'T\u00ecm d\u1ecbch v\u1ee5, th\u00f4ng b\u00e1o, h\u01b0\u1edbng d\u1eabn...', foot: 'plain', sbw: 226 };
      if (!u.room) return noRoom(o);
      const r = K.room(u.room);
      const mates = K.occupants(r.code);
      const duty = [['Th\u1ee9 Hai', '13/10/2026', 'V\u1ec7 sinh chung'], ['Th\u1ee9 Ba', '14/10/2026', '\u0110\u1ed5 r\u00e1c, lau s\u00e0n'], ['Th\u1ee9 T\u01b0', '15/10/2026', 'S\u1eafp x\u1ebfp b\u00e0n h\u1ecdc'], ['Th\u1ee9 N\u0103m', '16/10/2026', 'V\u1ec7 sinh nh\u00e0 t\u1eafm']];
      const dutyPeople = [mates[0], mates[1], mates.find((m) => m.id === u.id) || mates[2], mates[3] || mates[0]].map((m) => m || u);
      return shell(o, `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
          <div>${App.crumb(['home', ['Ph\u00f2ng c\u1ee7a t\u00f4i', 'sv-phong'], 'Th\u00f4ng tin ph\u00f2ng \u1edf'])}<h1 style="font-size:46px;font-weight:800;letter-spacing:-.02em;margin-top:8px;display:flex;align-items:center;gap:18px;flex-wrap:wrap">Ph\u00f2ng ${r.code} \u00b7 T\u1ea7ng ${r.khu} <span class="badge b-green" style="font-size:15px;padding:7px 14px;border:1px solid #bfe6cb"><i class="dot" style="width:12px;height:12px;background:#22b24c"></i>\u0110ang l\u01b0u tr\u00fa</span></h1>
          <p style="font-size:17px;color:var(--text);margin-top:4px">Gi\u01b0\u1eddng c\u1ee7a b\u1ea1n: <b style="color:var(--navy)">${b2(u.bed)}</b> <span style="color:#c5cfdf;margin:0 12px">|</span> Ph\u00f2ng c\u00f3 ${r.beds} gi\u01b0\u1eddng <span style="color:#c5cfdf;margin:0 12px">|</span> ${K.occCount(r.code)} sinh vi\u00ean</p></div>
          <button class="btn btn-outline-red" data-go="sv-chuyen-phong" style="height:48px;font-size:16px;margin-top:30px">${ic('arrow-left-right')}Y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng</button></div>
        <div class="grid resp-1" style="grid-template-columns:1.3fr 1fr;gap:16px">
          <div class="card pad" style="padding:16px 14px"><h2 class="card-t" style="margin:0 0 12px 6px">${ic('megaphone')}Kh\u00f4ng gian ph\u00f2ng</h2>
            <img src="${K.A(r.code === 'A302' ? 'room_a302_big' : r.img)}" style="width:100%;height:270px;object-fit:cover;border-radius:12px" alt="\u1ea2nh ph\u00f2ng ${r.code}">
            <div class="chips4" style="margin-top:12px">
              <div class="chip4"><span class="ic-box">${ic('bed-double')}</span><span><b>${r.beds} gi\u01b0\u1eddng</b><small>Ph\u00f2ng \u1edf ti\u00eau chu\u1ea9n</small></span></div>
              <div class="chip4"><span class="ic-box">${ic('lamp-desk')}</span><span><b>B\u00e0n h\u1ecdc</b><small>M\u1ed7i gi\u01b0\u1eddng 1 b\u00e0n</small></span></div>
              <div class="chip4"><span class="ic-box">${ic('columns-2')}</span><span><b>T\u1ee7 c\u00e1 nh\u00e2n</b><small>C\u00f3 kh\u00f3a ri\u00eang</small></span></div>
              <div class="chip4"><span class="ic-box">${ic('wifi')}</span><span><b>Wi-Fi</b><small>Mi\u1ec5n ph\u00ed</small></span></div></div>
            <div class="grid g2" style="gap:12px;margin-top:12px">
              <a href="#" data-go="sv-sua-chua" style="display:flex;align-items:center;gap:16px;background:#fdecee;border-radius:12px;padding:12px 18px;color:var(--ink)"><span style="color:var(--red)">${ic('triangle-alert', 'ic-lg')}</span><span style="flex:1"><b style="color:var(--red);display:block">B\u00e1o s\u1ef1 c\u1ed1</b><small class="muted">H\u1ecfng h\u00f3c, m\u1ea5t \u0111i\u1ec7n, m\u1ea5t n\u01b0\u1edbc...</small></span>${ic('chevron-right')}</a>
              <a href="#" id="rules" style="display:flex;align-items:center;gap:16px;background:#eaf2fd;border-radius:12px;padding:12px 18px;color:var(--ink)">${ic('file-text')}<span style="flex:1"><b style="color:var(--navy);display:block">Xem n\u1ed9i quy</b><small class="muted">N\u1ed9i quy k\u00fd t\u00fac x\u00e1</small></span>${ic('chevron-right')}</a></div></div>
          <div class="card pad" style="padding:16px 14px"><div class="card-h" style="padding:0 6px"><h2 class="card-t">${ic('notebook-text')}B\u1ea1n c\u00f9ng ph\u00f2ng</h2><span class="badge b-gray" style="background:#eef3fa;color:var(--ink);font-weight:500">${K.occCount(r.code)} / ${r.beds} sinh vi\u00ean</span></div>
            <div style="display:flex;flex-direction:column;gap:10px">${mates.map((m) => `<div class="mate ${m.id === u.id ? 'me' : ''}">${av(m.avatar, 76)}<span><b>${esc(m.name)}</b><small>Gi\u01b0\u1eddng ${b2(m.bed)}</small></span>${m.id === u.id ? `<span class="badge b-navy" style="margin-left:auto;border-radius:8px;padding:8px 16px;font-size:15px">B\u1ea1n</span>` : `<button class="badge b-blue" data-mate="${m.id}" style="border:0;cursor:pointer;margin-left:auto">${ic('graduation-cap')}C\u00f9ng kh\u00f3a</button>`}</div>`).join('')}</div></div>
        </div>
        <div class="grid resp-1" style="grid-template-columns:1.3fr 1fr;gap:16px">
          <div class="card pad" style="padding:16px 14px"><div class="card-h" style="padding:0 6px"><h2 class="card-t">${ic('calendar-days')}L\u1ecbch tr\u1ef1c v\u1ec7 sinh ph\u00f2ng</h2><span class="badge b-blue" style="font-weight:500;color:var(--ink)">Tu\u1ea7n 13 - 19/10/2026</span></div>
            <div class="tbl-wrap"><table class="tbl compact"><thead><tr><th>Th\u1ee9</th><th>Ng\u00e0y</th><th>Sinh vi\u00ean tr\u1ef1c</th><th>Ghi ch\u00fa</th></tr></thead><tbody>${duty.map((d, i) => `<tr><td class="muted">${d[0]}</td><td>${d[1]}</td><td><span class="who">${av(dutyPeople[i].avatar, 30)}${esc(dutyPeople[i].name)}</span></td><td>${d[2]}</td></tr>`).join('')}</tbody></table></div></div>
          <div class="card pad" style="padding:16px 20px"><h2 class="card-t" style="margin-bottom:10px">${ic('file-text')}Th\u00f4ng tin l\u01b0u tr\u00fa</h2>
            <div class="info-list lined" style="font-size:14px">${[['N\u0103m h\u1ecdc', '2026 \u2013 2027'], ['T\u1ea7ng', 'T\u1ea7ng ' + r.khu], ['Ph\u00f2ng', r.code], ['Gi\u01b0\u1eddng c\u1ee7a b\u1ea1n', b2(u.bed)], ['S\u1ed1 l\u01b0\u1ee3ng gi\u01b0\u1eddng', r.beds + ' gi\u01b0\u1eddng'], ['S\u1ed1 sinh vi\u00ean hi\u1ec7n t\u1ea1i', K.occCount(r.code) + ' sinh vi\u00ean'], ['Th\u1eddi gian l\u01b0u tr\u00fa', '01/09/2026 \u2013 31/05/2027']].map(([a, b]) => `<div style="grid-template-columns:200px 1fr;padding:3px 0"><span>${a}</span><span style="color:var(--ink)">${b}</span></div>`).join('')}
            <div style="grid-template-columns:200px 1fr;padding:6px 0"><span>H\u1ee3p \u0111\u1ed3ng l\u01b0u tr\u00fa</span><button class="btn btn-soft btn-sm" data-contract style="justify-content:space-between;font-weight:500">${ic('file-text')}Xem h\u1ee3p \u0111\u1ed3ng l\u01b0u tr\u00fa ${ic('chevron-right')}</button></div></div></div>
        </div>`);
    },
    mount: (root) => {
      const r = root.querySelector('#rules'); if (r) r.onclick = (e) => { e.preventDefault(); App.showRules(); };
      const c = root.querySelector('[data-contract]'); if (c) c.onclick = () => App.showContract();
      root.querySelectorAll('[data-mate]').forEach((b) => b.onclick = () => { const m = K.student(b.dataset.mate); App.modal({ title: m.name, body: `<div class="row" style="gap:18px">${av(m.avatar, 90)}<dl class="kv" style="grid-template-columns:120px 1fr"><dt>M\u00e3 sinh vi\u00ean</dt><dd>${m.id}</dd><dt>Khoa</dt><dd>${esc(m.faculty)}</dd><dt>L\u1edbp</dt><dd>${esc(m.cls)}</dd><dt>Gi\u01b0\u1eddng</dt><dd>${b2(m.bed)}</dd></dl></div>`, foot: '<button class="btn btn-red" data-x>\u0110\u00f3ng</button>' }); });
    },
  };

  // ============ 10. H\u1ed3 s\u01a1 l\u01b0u tr\u00fa ============
  P['sv-ho-so'] = {
    role: 'student', title: 'H\u1ed3 s\u01a1 l\u01b0u tr\u00fa',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-so', logo: 'stack', notif: 'dot', search: 'T\u00ecm d\u1ecbch v\u1ee5, th\u00f4ng b\u00e1o, h\u01b0\u1edbng d\u1eabn...', foot: 'card-down', sbw: 238, icons: { 'sv-phong': 'house', 'sv-hoa-don': 'badge-dollar-sign' } };
      const app = myApp();
      if (!app) return noRoom(o);
      const r = K.room(app.room);
      const conf = !!app.confirmed;
      const steps = [
        { t: '\u0110\u00e3 g\u1eedi h\u1ed3 s\u01a1', d: app.date.slice(0, 10), st: 'done' },
        { t: app.status === 'da-duyet' ? '\u0110\u00e3 duy\u1ec7t' : app.status === 'tu-choi' ? 'T\u1eeb ch\u1ed1i' : app.status === 'can-bo-sung' ? 'C\u1ea7n b\u1ed5 sung' : 'Ch\u1edd duy\u1ec7t', d: app.status === 'da-duyet' ? (app.history[1] ? app.history[1].d.slice(0, 10) : '') : '\u0110ang x\u00e9t duy\u1ec7t', st: app.status === 'da-duyet' ? 'done' : 'cur' },
        { t: 'X\u00e1c nh\u1eadn th\u1ecfa thu\u1eadn', d: conf ? '\u0110\u00e3 x\u00e1c nh\u1eadn' : 'Ch\u1edd x\u00e1c nh\u1eadn c\u1ee7a b\u1ea1n', st: app.status !== 'da-duyet' ? 'todo' : conf ? 'done' : 'cur' },
        { t: 'Nh\u1eadn ph\u00f2ng', d: 'D\u1ef1 ki\u1ebfn 01/10/2026', st: conf ? 'cur' : 'todo' },
      ];
      const mates = K.occupants(r.code);
      const roster = (u.room === r.code ? mates : mates.concat([u])).slice(0, r.beds);
      const ordered = roster.sort((a, b) => (a.id === u.id ? -1 : b.id === u.id ? 1 : a.bed - b.bed));
      const curIdx = steps.findIndex((s) => s.st === 'cur');
      return shell(o, `${App.phead({ art: 'banner_profile', h: 150, crumb: [['Trang ch\u1ee7', 'sv-tong-quan'], ['L\u01b0u tr\u00fa', 'sv-ho-so'], 'H\u1ed3 s\u01a1 l\u01b0u tr\u00fa c\u1ee7a t\u00f4i'], title: 'H\u1ed3 s\u01a1 l\u01b0u tr\u00fa c\u1ee7a t\u00f4i', extra: `<div class="row" style="margin-top:8px;font-size:17px;color:var(--text)">M\u00e3 h\u1ed3 s\u01a1: <b style="color:var(--navy);font-weight:600">${app.id}</b><span style="margin-left:14px">${App.statusBadge(app.status).replace('class="badge', 'style="font-size:15px;padding:6px 16px" class="badge')}</span></div>` })}
        <div class="card" style="padding:12px 30px 14px;margin-top:-6px"><div style="display:grid;grid-template-columns:repeat(4,1fr);position:relative">
          <div style="position:absolute;left:12.5%;right:12.5%;top:19px;height:4px;background:#d6deea;border-radius:4px"></div>
          <div style="position:absolute;left:12.5%;width:${curIdx < 0 ? 75 : Math.max(0, (curIdx - 1) * 25 + 15)}%;top:19px;height:4px;background:var(--blue);border-radius:4px"></div>
          ${curIdx > 0 ? `<div style="position:absolute;left:${12.5 + (curIdx - 1) * 25 + 15}%;width:10%;top:19px;height:4px;background:var(--red);border-radius:4px"></div>` : ''}
          ${steps.map((s, i) => `<div style="text-align:center;position:relative"><span class="stepnum ${s.st === 'done' ? 'done' : s.st === 'cur' ? '' : ''}" style="margin:0 auto;${s.st === 'cur' ? 'background:var(--red);color:#fff;border:3px solid #fff;box-shadow:0 0 0 2px var(--red)' : s.st === 'todo' ? 'background:#fff;color:var(--blue-700)' : ''}">${s.st === 'done' ? ic('check') : i + 1}</span><b style="display:block;margin-top:6px;color:${s.st === 'cur' ? 'var(--red)' : 'var(--navy)'};font-weight:600">${s.t}</b><small class="muted">${s.d}</small></div>`).join('')}</div></div>
        <div class="grid resp-1" style="grid-template-columns:1fr 0.79fr;gap:12px;align-items:start">
          <div class="card pad" style="padding:22px 18px">
            <div style="display:flex;justify-content:space-between;gap:12px;padding:0 8px"><div><h2 style="font-size:30px;font-weight:800">TH\u1eceA THU\u1eacN L\u01afU TR\u00da</h2><p style="font-size:19px;font-weight:600;color:var(--navy);margin-top:6px">T\u1ea0I K\u00dd T\u00daC X\u00c1 \u0110\u1ea0I H\u1eccC NGH\u1ec6 AN</p></div><div class="row" style="align-items:flex-start"><button class="btn btn-soft" data-print="Th\u1ecfa thu\u1eadn l\u01b0u tr\u00fa" title="L\u01b0u th\u1ecfa thu\u1eadn th\u00e0nh t\u1ec7p PDF" style="color:var(--navy);font-weight:500">${ic('download')}T\u1ea3i xu\u1ed1ng</button><button class="btn btn-soft" data-print="Th\u1ecfa thu\u1eadn l\u01b0u tr\u00fa" title="In th\u1ecfa thu\u1eadn" style="color:var(--navy);font-weight:500">${ic('printer')}In</button></div></div>
            ${[['1. Th\u00f4ng tin sinh vi\u00ean', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;font-size:14px" class="resp-1"><dl class="kv" style="grid-template-columns:114px 1fr;font-size:14px;gap:8px 10px"><dt>H\u1ecd v\u00e0 t\u00ean:</dt><dd>${esc(u.name)}</dd><dt>M\u00e3 sinh vi\u00ean:</dt><dd>${u.id}</dd><dt>Email:</dt><dd>${esc(u.email)}</dd></dl><dl class="kv" style="grid-template-columns:120px 1fr;font-size:14px;gap:8px 10px;border-left:1px solid var(--line);padding-left:22px"><dt>Ph\u00f2ng l\u01b0u tr\u00fa:</dt><dd>${app.room}</dd><dt>Gi\u01b0\u1eddng s\u1ed1:</dt><dd>${b2(app.bed)}</dd><dt>T\u1ea7ng:</dt><dd>T\u1ea7ng ${r.khu}</dd><dt>N\u0103m h\u1ecdc:</dt><dd>${app.term}</dd></dl></div>`],
              ['2. Th\u1eddi h\u1ea1n l\u01b0u tr\u00fa', `<dl class="kv" style="grid-template-columns:140px 1fr;font-size:14px;gap:8px 10px"><dt>Th\u1eddi gian b\u1eaft \u0111\u1ea7u:</dt><dd>01/10/2026</dd><dt>Th\u1eddi gian k\u1ebft th\u00fac:</dt><dd>31/08/2027 (theo n\u0103m h\u1ecdc 2026 \u2013 2027)</dd></dl>`],
              ['3. N\u1ed9i quy v\u00e0 tr\u00e1ch nhi\u1ec7m', `<ol style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:9px">${App.RULES.slice(0, 5).map((x, i) => `<li class="row" style="font-size:14px;color:var(--ink)"><span style="width:26px;height:26px;border-radius:50%;background:#fdecee;color:var(--red);display:grid;place-items:center;font-size:13px;flex:none">${i + 1}</span>${x}</li>`).join('')}</ol>`]].map(([t, b]) => `<div style="border:1px solid var(--line-2);border-radius:10px;margin-top:16px;overflow:hidden"><div style="background:#eaf2fd;padding:8px 16px;font-weight:700;color:var(--navy);font-size:16px">${t}</div><div style="padding:14px 22px">${b}</div></div>`).join('')}
          </div>
          <div class="card" style="padding:16px 16px 0;overflow:hidden">
            <h3 style="font-size:17px">Th\u00f4ng tin ph\u00f2ng l\u01b0u tr\u00fa</h3>
            <div class="row" style="margin-top:10px"><img src="${K.A('ic_building_sm')}" style="width:76px;border-radius:6px" alt=""><div style="flex:1"><b style="font-size:18px;color:var(--navy)">Ph\u00f2ng ${r.code}</b><div class="muted">T\u1ea7ng ${r.khu} - K\u00fd t\u00fac x\u00e1 sinh vi\u00ean</div></div>${u.room === r.code ? badge('\u0110ang \u1edf', 'green', { sm: true }) : badge('Ch\u1edd nh\u1eadn ph\u00f2ng', 'orange', { sm: true })}</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);margin:12px 0;font-size:13px" class="muted">
              <div class="row" style="gap:10px">${ic('graduation-cap')}<span>S\u1ee9c ch\u1ee9a<b style="display:block;color:var(--navy);font-size:15px">${r.beds} sinh vi\u00ean</b></span></div>
              <div class="row" style="gap:10px;border-left:1px solid var(--line);padding-left:14px">${ic('bed-double')}<span>S\u1ed1 gi\u01b0\u1eddng<b style="display:block;color:var(--navy);font-size:15px">${r.beds} gi\u01b0\u1eddng</b></span></div>
              <div class="row" style="gap:10px;border-left:1px solid var(--line);padding-left:14px">${ic('users')}<span>S\u1ed1 sinh vi\u00ean hi\u1ec7n t\u1ea1i<b style="display:block;color:var(--navy);font-size:15px">${K.occCount(r.code)}/${r.beds}</b></span></div></div>
            <div style="display:flex;justify-content:space-between;align-items:center"><b style="color:var(--navy)">Danh s\u00e1ch sinh vi\u00ean trong ph\u00f2ng</b><a href="#" class="link link-red small" data-go="sv-phong">Xem chi ti\u1ebft ${ic('arrow-right')}</a></div>
            <div class="tbl-wrap" style="margin-top:8px"><table class="tbl compact" style="font-size:13.5px"><thead><tr><th class="c">STT</th><th>H\u1ecd v\u00e0 t\u00ean</th><th>M\u00e3 sinh vi\u00ean</th><th class="c">Gi\u01b0\u1eddng</th><th class="c">Tr\u1ea1ng th\u00e1i</th></tr></thead><tbody>${ordered.map((m, i) => `<tr class="${m.id === u.id ? 'sel' : ''}"><td class="c">${i + 1}</td><td>${esc(m.name)}</td><td>${m.id}</td><td class="c">${b2(m.id === u.id ? app.bed : m.bed)}</td><td class="c">${m.id === u.id && u.room !== r.code ? badge('Ch\u1edd nh\u1eadn', 'orange', { sm: true }) : badge('\u0110ang \u1edf', 'green', { sm: true })}</td></tr>`).join('')}</tbody></table></div>
            <h3 style="font-size:17px;margin-top:16px">L\u1ecbch s\u1eed x\u1eed l\u00fd h\u1ed3 s\u01a1</h3>
            <div class="tl" style="margin-top:10px;font-size:13px">${app.history.map((h) => `<div class="tl-i" style="grid-template-columns:28px 150px 104px 1fr;gap:10px;padding-bottom:12px"><span class="tl-dot">${ic('check')}</span><b style="color:var(--navy)">${h.t}</b><small class="muted">${h.d}</small><small class="muted">${h.s}</small></div>`).join('')}
              ${app.status === 'da-duyet' ? `<div class="tl-i" style="grid-template-columns:28px 150px 104px 1fr;gap:10px;padding-bottom:12px"><span class="tl-dot ${conf ? '' : 'red'}">${conf ? ic('check') : '3'}</span><b style="color:${conf ? 'var(--navy)' : 'var(--red)'}">${conf ? '\u0110\u00e3 x\u00e1c nh\u1eadn th\u1ecfa thu\u1eadn' : 'Ch\u1edd x\u00e1c nh\u1eadn th\u1ecfa thu\u1eadn'}</b><small class="muted">${conf ? app.confirmedAt : 'H\u00f4m nay'}</small><small class="muted">${conf ? 'B\u1ea1n \u0111\u00e3 x\u00e1c nh\u1eadn n\u1ed9i dung th\u1ecfa thu\u1eadn l\u01b0u tr\u00fa.' : 'Vui l\u00f2ng \u0111\u1ecdc n\u1ed9i dung th\u1ecfa thu\u1eadn v\u00e0 x\u00e1c nh\u1eadn \u0111\u1ec3 ho\u00e0n t\u1ea5t th\u1ee7 t\u1ee5c.'}</small></div>
              <div class="tl-i" style="grid-template-columns:28px 150px 104px 1fr;gap:10px;padding-bottom:12px"><span class="tl-dot todo" style="box-shadow:none;background:#fff;color:var(--muted);font-weight:600;display:grid;place-items:center">4</span><b style="color:var(--navy)">Nh\u1eadn ph\u00f2ng</b><small class="muted">D\u1ef1 ki\u1ebfn t\u1eeb 01/10/2026</small><small class="muted">Sau khi x\u00e1c nh\u1eadn, b\u1ea1n s\u1ebd nh\u1eadn ph\u00f2ng theo l\u1ecbch.</small></div>` : ''}</div>
            ${app.status === 'da-duyet' ? `<div style="display:flex;align-items:center;gap:10px;border-top:1px solid var(--line);margin:4px -16px 0;padding:12px 16px;flex-wrap:wrap">
              <label class="check" style="font-size:11.5px;flex:1;min-width:150px;line-height:1.35"><input type="checkbox" id="cf-ok" ${conf ? 'checked disabled' : 'checked'}>T\u00f4i \u0111\u00e3 \u0111\u1ecdc n\u1ed9i dung th\u1ecfa thu\u1eadn v\u00e0 \u0111\u1ed3ng \u00fd tu\u00e2n th\u1ee7 c\u00e1c quy \u0111\u1ecbnh tr\u00ean.</label>
              <button class="btn btn-red" id="cf-go" ${conf ? 'disabled' : ''}>${conf ? '\u0110\u00e3 x\u00e1c nh\u1eadn' : 'X\u00e1c nh\u1eadn l\u01b0u tr\u00fa'} ${conf ? '' : ic('arrow-right')}</button><button class="btn btn-outline" id="cf-help">${ic('headphones')}Li\u00ean h\u1ec7 h\u1ed7 tr\u1ee3</button></div>` : '<div style="height:14px"></div>'}
          </div></div>`);
    },
    mount: (root) => {
      const go = root.querySelector('#cf-go');
      if (go) go.onclick = () => {
        if (!root.querySelector('#cf-ok').checked) return App.toast('Vui l\u00f2ng t\u00edch x\u00e1c nh\u1eadn \u0111\u00e3 \u0111\u1ecdc th\u1ecfa thu\u1eadn', 'err');
        const app = myApp(); app.confirmed = true; app.confirmedAt = K.now(); K.save(); App.toast('\u0110\u00e3 x\u00e1c nh\u1eadn th\u1ecfa thu\u1eadn l\u01b0u tr\u00fa'); App.refresh();
      };
      const h = root.querySelector('#cf-help'); if (h) h.onclick = App.contact;
    },
  };

  // ============ 11. H\u00f3a \u0111\u01a1n ============
  P['sv-hoa-don'] = {
    role: 'student', title: 'H\u00f3a \u0111\u01a1n c\u1ee7a t\u00f4i',
    render: () => {
      const o = { active: 'sv-hoa-don', logo: 'inline', notif: 'count', search: 'T\u00ecm ki\u1ebfm h\u00f3a \u0111\u01a1n, k\u1ef3 thanh to\u00e1n...', sbw: 285, icons: { 'sv-phong': 'users', 'sv-ho-tro': 'headphones', 'sv-tai-khoan': 'settings' } };
      const st = App.state('inv', { tab: 'all', period: '', q: '', sort: 'period', dir: -1 });
      const all = myInvoices();
      const unpaid = all.filter((i) => i.status === 'chua-tt');
      const paid = all.filter((i) => i.status === 'da-tt');
      const waiting = all.filter((i) => i.status !== 'da-tt');
      let list = st.tab === 'unpaid' ? all.filter((i) => i.status !== 'da-tt') : st.tab === 'paid' ? paid : all.slice();
      if (st.period) list = list.filter((i) => i.period === st.period);
      if (st.q) { const q = st.q.toLowerCase(); list = list.filter((i) => (i.id + ' ti\u1ec1n ph\u00f2ng k\u00fd t\u00fac x\u00e1 ' + i.period + ' ' + i.room).toLowerCase().includes(q)); }
      const key = { period: (i) => i.period.split('/').reverse().join(''), id: (i) => i.id, total: (i) => i.total, status: (i) => i.status };
      list.sort((a, b) => (key[st.sort](a) > key[st.sort](b) ? 1 : -1) * st.dir);
      const th = (k, t) => `<th data-sort="${k}" style="cursor:pointer">${t} <span style="color:#8fa0bd">${ic('chevrons-up-down')}</span></th>`;
      return shell(o, `${App.phead({ art: 'banner_invoice', h: 168, crumb: [['Trang ch\u1ee7', 'sv-tong-quan'], ['H\u00f3a \u0111\u01a1n', 'sv-hoa-don'], 'H\u00f3a \u0111\u01a1n c\u1ee7a t\u00f4i'], title: 'H\u00f3a \u0111\u01a1n c\u1ee7a t\u00f4i', desc: 'Xem danh s\u00e1ch h\u00f3a \u0111\u01a1n, t\u00ecnh tr\u1ea1ng thanh to\u00e1n v\u00e0 c\u00f4ng n\u1ee3 k\u00fd t\u00fac x\u00e1.' })}
        <div class="card grid g3" style="padding:14px 16px;gap:16px;margin-top:-6px">
          <div class="stat pink">${im('st_due', 'blend')}<div><div class="lbl2">C\u1ea7n thanh to\u00e1n</div><div class="val" style="color:var(--red)">${money(unpaid.reduce((s, i) => s + i.total, 0))}</div></div></div>
          <div class="stat blue">${im('st_paid', 'blend')}<div><div class="lbl2">\u0110\u00e3 thanh to\u00e1n</div><div class="val">${money(paid.reduce((s, i) => s + i.total, 0))}</div></div></div>
          <div class="stat cream">${im('st_wait', 'blend')}<div><div class="lbl2">H\u00f3a \u0111\u01a1n ch\u1edd</div><div class="val">${waiting.length}</div></div></div></div>
        <div class="card" style="padding:14px 0 0;overflow:hidden">
          <div style="display:flex;gap:14px;align-items:center;padding:0 14px 12px;flex-wrap:wrap">
            <div class="seg" style="padding:3px">${[['all', 'T\u1ea5t c\u1ea3 (' + all.length + ')'], ['unpaid', 'Ch\u01b0a thanh to\u00e1n (' + waiting.length + ')'], ['paid', '\u0110\u00e3 thanh to\u00e1n (' + paid.length + ')']].map(([k, t]) => `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}" style="height:44px">${t}</button>`).join('')}</div>
            <div class="iwrap" style="width:164px">${ic('calendar-days')}${sel('i-period', [['', 'T\u1ea5t c\u1ea3 k\u1ef3'], ...[...new Set(all.map((i) => i.period))]], st.period)}</div>
            <div class="iwrap" style="flex:1;min-width:200px">${ic('search')}<input id="i-q" class="input" placeholder="T\u00ecm theo m\u00e3 h\u00f3a \u0111\u01a1n, n\u1ed9i dung..." value="${esc(st.q)}"></div>
            <button class="btn btn-outline" id="i-dl" style="color:var(--blue-700)">${ic('download')}T\u1ea3i danh s\u00e1ch</button></div>
          <div style="overflow-x:auto;padding:0 14px"><table class="tbl" style="border:1px solid var(--line-2);border-radius:10px;overflow:hidden"><thead><tr>${th('period', 'K\u1ef3')}${th('id', 'M\u00e3 h\u00f3a \u0111\u01a1n')}<th>N\u1ed9i dung</th>${th('total', 'S\u1ed1 ti\u1ec1n')}${th('status', 'Tr\u1ea1ng th\u00e1i')}<th>Thao t\u00e1c</th></tr></thead><tbody>
            ${list.map((i) => `<tr><td><b style="color:var(--navy);font-size:16px">${i.period}</b></td><td>${i.id}</td><td>${esc(i.label || 'Ti\u1ec1n ph\u00f2ng k\u00fd t\u00fac x\u00e1 (' + i.period + ')')}<div class="muted small">Ph\u00f2ng ${i.room} - T\u1ea7ng ${i.khu}</div></td><td><b style="color:var(--navy);font-size:16px">${money(i.total)}</b></td><td>${App.statusBadge(i.status)}</td><td>${i.status === 'chua-tt' ? `<button class="btn btn-red btn-sm btn-block" data-go="sv-thanh-toan-${i.id}">Thanh to\u00e1n</button>` : i.status === 'cho-doi-soat' ? `<button class="btn btn-soft btn-sm btn-block" data-go="sv-thanh-toan-${i.id}">Xem giao d\u1ecbch</button>` : `<button class="btn btn-outline btn-sm btn-block" data-receipt="${i.id}" style="color:var(--blue-700)">Xem bi\u00ean nh\u1eadn</button>`}</td></tr>`).join('') || `<tr><td colspan="6" class="muted" style="text-align:center;padding:26px">Kh\u00f4ng c\u00f3 h\u00f3a \u0111\u01a1n ph\u00f9 h\u1ee3p.</td></tr>`}</tbody></table></div>
          <div style="height:14px"></div></div>
        <div class="card resp-1" style="display:grid;grid-template-columns:400px 1fr;align-items:center;background:#eaf3fd;padding:4px 26px;border-color:#dbe8f9">${im('invoice_promo', 'blend')}<div style="border-left:2px solid #c9dbf3;padding-left:26px"><h3 style="font-size:23px">Xem chi ti\u1ebft \u0111\u1ec3 ki\u1ec3m tra t\u1eebng kho\u1ea3n thu.</h3><p style="margin-top:10px;font-size:15.5px;line-height:1.6;color:var(--text)">M\u1ed7i h\u00f3a \u0111\u01a1n bao g\u1ed3m ti\u1ec1n ph\u00f2ng v\u00e0 c\u00e1c kho\u1ea3n d\u1ecbch v\u1ee5 \u0111i k\u00e8m (\u0111i\u1ec7n, n\u01b0\u1edbc...).<br>B\u1ea1n c\u00f3 th\u1ec3 xem chi ti\u1ebft n\u1ed9i dung, t\u1ea3i bi\u00ean nh\u1eadn v\u00e0 thanh to\u00e1n tr\u1ef1c tuy\u1ebfn.</p></div></div>`);
    },
    mount: (root) => {
      const st = App.st.inv;
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      root.querySelectorAll('[data-sort]').forEach((b) => b.onclick = () => { if (st.sort === b.dataset.sort) st.dir *= -1; else { st.sort = b.dataset.sort; st.dir = -1; } App.refresh(); });
      root.querySelector('#i-period').onchange = (e) => { st.period = e.target.value; App.refresh(); };
      const q = root.querySelector('#i-q'); q.onchange = () => { st.q = q.value.trim(); App.refresh(); };
      root.querySelector('#i-dl').onclick = () => App.toast('Danh s\u00e1ch h\u00f3a \u0111\u01a1n \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi t\u1edbi email ' + K.me().email);
      root.querySelectorAll('[data-receipt]').forEach((b) => b.onclick = () => App.receipt(b.dataset.receipt));
    },
  };
  App.receipt = (id) => {
    const i = K.db.invoices.find((x) => x.id === id); const s = K.student(i.student);
    App.modal({ title: 'Bi\u00ean nh\u1eadn thanh to\u00e1n', body: `<div style="border:1px dashed #b6cbe8;border-radius:12px;padding:18px 20px"><div style="display:flex;justify-content:space-between"><b style="color:var(--navy)">K\u00fd t\u00fac x\u00e1 \u0110H Ngh\u1ec7 An</b>${badge('\u0110\u00e3 thanh to\u00e1n', 'green', { dot: true, sm: true })}</div>
      <dl class="kv" style="margin-top:14px;grid-template-columns:150px 1fr"><dt>M\u00e3 h\u00f3a \u0111\u01a1n</dt><dd>${i.id}</dd><dt>Sinh vi\u00ean</dt><dd>${esc(s.name)} (${s.id})</dd><dt>Ph\u00f2ng</dt><dd>${i.room} \u00b7 T\u1ea7ng ${i.khu}</dd><dt>K\u1ef3</dt><dd>${i.period}</dd><dt>M\u00e3 giao d\u1ecbch</dt><dd>${i.txn || '\u2014'}</dd><dt>Th\u1eddi gian</dt><dd>${i.paidAt || '\u2014'}</dd></dl>
      <table class="tbl compact" style="margin-top:12px">${i.items.map((x) => `<tr><td>${x.name}</td><td class="r">${money(x.amount)}</td></tr>`).join('')}<tr><td><b>T\u1ed5ng c\u1ed9ng</b></td><td class="r"><b style="color:var(--red)">${money(i.total)}</b></td></tr></table></div>`,
      foot: `<button class="btn btn-outline" data-toast2>${ic('download')}T\u1ea3i bi\u00ean nh\u1eadn</button><button class="btn btn-red" data-x>\u0110\u00f3ng</button>`, onMount: (el) => el.querySelector('[data-toast2]').onclick = () => App.toast('Bi\u00ean nh\u1eadn \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi t\u1edbi email ' + s.email) });
  };

  // ============ 12. Thanh to\u00e1n ============
  P['sv-thanh-toan'] = {
    role: 'student', title: 'Thanh to\u00e1n h\u00f3a \u0111\u01a1n',
    render: (id) => {
      const u = K.me();
      const o = { active: 'sv-hoa-don', logo: 'stack', notif: 'after', search: 'T\u00ecm ki\u1ebfm ph\u00f2ng, h\u00f3a \u0111\u01a1n, th\u00f4ng b\u00e1o...', sbw: 252, icons: { 'sv-phong': 'house', 'sv-hoa-don': 'receipt-text' } };
      const inv = K.db.invoices.find((x) => x.id === id && x.student === u.id) || myInvoices()[0];
      if (!inv) return shell(o, '<div class="card pad">Kh\u00f4ng t\u00ecm th\u1ea5y h\u00f3a \u0111\u01a1n.</div>');
      const st = App.state('pay-' + inv.id, { method: 'bank', wallet: 'MoMo' });
      const r = K.room(inv.room);
      const head = inv.status === 'chua-tt' ? `<span class="badge" style="background:#ffeec9;color:#d97a00;font-size:20px;padding:9px 20px;gap:12px;font-weight:600"><span style="width:28px;height:28px;border-radius:50%;background:#f39a0b;color:#fff;display:grid;place-items:center;font-weight:800">!</span>Ch\u01b0a thanh to\u00e1n</span>` : inv.status === 'cho-doi-soat' ? badge('Ch\u1edd \u0111\u1ed1i so\u00e1t', 'orange', { icon: 'clock' }) : badge('\u0110\u00e3 thanh to\u00e1n', 'green', { icon: 'circle-check' });
      const methods = [['bank', 'Chuy\u1ec3n kho\u1ea3n', 'pm_bank'], ['wallet', 'V\u00ed \u0111i\u1ec7n t\u1eed', 'pm_wallet'], ['counter', 'T\u1ea1i qu\u1ea7y', 'pm_counter']];
      let panel;
      if (inv.status !== 'chua-tt') panel = `<div class="card" style="box-shadow:none;padding:22px;text-align:center">${inv.status === 'da-tt' ? `<span style="color:var(--green)">${ic('circle-check')}</span><h3 style="margin-top:6px">H\u00f3a \u0111\u01a1n \u0111\u00e3 \u0111\u01b0\u1ee3c thanh to\u00e1n</h3><p class="muted" style="margin-top:6px">M\u00e3 giao d\u1ecbch ${inv.txn || '\u2014'} \u00b7 ${inv.paidAt || ''}</p><button class="btn btn-outline" style="margin-top:16px" data-rcpt>Xem bi\u00ean nh\u1eadn</button>` : `<span style="color:var(--orange)">${ic('clock')}</span><h3 style="margin-top:6px">\u0110\u00e3 ghi nh\u1eadn giao d\u1ecbch, \u0111ang ch\u1edd \u0111\u1ed1i so\u00e1t</h3><p class="muted" style="margin-top:6px;line-height:1.6">M\u00e3 giao d\u1ecbch <b>${inv.txn}</b> l\u00fac ${inv.paidAt}. Tr\u1ea1ng th\u00e1i s\u1ebd chuy\u1ec3n sang \u201c\u0110\u00e3 thanh to\u00e1n\u201d sau khi nh\u00e0 tr\u01b0\u1eddng \u0111\u1ed1i so\u00e1t.</p>`}</div>`;
      else if (st.method === 'bank') panel = `<div class="card" style="box-shadow:none;padding:14px 18px 18px"><h3 style="font-size:18px">Thanh to\u00e1n b\u1eb1ng chuy\u1ec3n kho\u1ea3n</h3>
          <div style="display:grid;grid-template-columns:186px 1fr;gap:14px;margin-top:14px" class="resp-1"><div style="border:1px solid var(--line);border-radius:12px;padding:0;overflow:hidden">${im('qr', '', 'M\u00e3 QR m\u1eabu')}</div>
          <div style="display:flex;flex-direction:column;gap:10px"><div style="background:#eaf2fd;border-radius:10px;padding:12px 16px;display:flex;gap:12px;font-size:13.5px;color:var(--ink)"><span style="color:var(--blue)">${ic('info')}</span>Tr\u1ea1ng th\u00e1i s\u1ebd \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt sau khi \u0111\u1ed1i so\u00e1t thanh to\u00e1n c\u1ee7a nh\u00e0 tr\u01b0\u1eddng.</div>
          <div style="border:1px solid var(--line);border-radius:10px">
            <div class="row" style="justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--line-2)"><span class="small muted">S\u1ed1 ti\u1ec1n thanh to\u00e1n</span><b style="color:var(--red);font-size:21px">${money(inv.total)}</b><button class="xbtn" data-copy="${inv.total}" aria-label="Sao ch\u00e9p s\u1ed1 ti\u1ec1n" style="color:var(--blue)">${ic('copy')}</button></div>
            <div class="row" style="justify-content:space-between;padding:12px 14px"><span class="small muted">N\u1ed9i dung chuy\u1ec3n kho\u1ea3n</span><b style="color:var(--navy)">${inv.id}</b><button class="xbtn" data-copy="${inv.id}" aria-label="Sao ch\u00e9p n\u1ed9i dung" style="color:var(--blue)">${ic('copy')}</button></div></div>
          <small class="muted">Ng\u00e2n h\u00e0ng: Vietcombank \u00b7 STK 0101 0000 2026 \u00b7 Ch\u1ee7 TK: K\u00fd t\u00fac x\u00e1 \u0110H Ngh\u1ec7 An</small></div></div></div>`;
      else if (st.method === 'wallet') panel = `<div class="card" style="box-shadow:none;padding:16px 18px"><h3 style="font-size:18px">Thanh to\u00e1n b\u1eb1ng v\u00ed \u0111i\u1ec7n t\u1eed</h3><p class="muted small" style="margin-top:6px">Ch\u1ecdn v\u00ed \u0111\u1ec3 thanh to\u00e1n ${money(inv.total)} cho h\u00f3a \u0111\u01a1n ${inv.id}.</p><div class="pills" style="margin-top:14px">${['MoMo', 'ZaloPay', 'VNPay', 'ShopeePay'].map((w) => `<button class="pill ${st.wallet === w ? 'on' : ''}" data-wallet="${w}">${ic('wallet')}${w}</button>`).join('')}</div><div style="background:#eaf2fd;border-radius:10px;padding:12px 16px;margin-top:16px;font-size:13.5px;color:var(--ink)">Sau khi b\u1ea5m \u201cKi\u1ec3m tra thanh to\u00e1n\u201d, h\u1ec7 th\u1ed1ng ghi nh\u1eadn giao d\u1ecbch qua ${st.wallet} v\u00e0 chuy\u1ec3n sang ch\u1edd \u0111\u1ed1i so\u00e1t.</div></div>`;
      else panel = `<div class="card" style="box-shadow:none;padding:16px 18px"><h3 style="font-size:18px">Thanh to\u00e1n t\u1ea1i qu\u1ea7y</h3><div class="info-list lined" style="margin-top:10px"><div>${ic('map-pin')}<span>\u0110\u1ecba \u0111i\u1ec3m</span><b>Qu\u1ea7y ti\u1ebfp nh\u1eadn, t\u1ea7ng 1</b></div><div>${ic('clock')}<span>Th\u1eddi gian</span><b>7:30 \u2013 17:00, Th\u1ee9 Hai \u2013 Th\u1ee9 B\u1ea3y</b></div><div>${ic('file-text')}<span>Mang theo</span><b>Th\u1ebb sinh vi\u00ean, m\u00e3 ${inv.id}</b></div></div><p class="muted small" style="margin-top:10px">B\u1ea5m \u201cKi\u1ec3m tra thanh to\u00e1n\u201d \u0111\u1ec3 \u0111\u1eb7t l\u1ecbch n\u1ed9p ti\u1ec1n t\u1ea1i qu\u1ea7y.</p></div>`;
      return shell(o, `${App.phead({ art: 'banner_pay', h: 186, crumb: ['home', ['H\u00f3a \u0111\u01a1n', 'sv-hoa-don'], inv.id], title: 'Thanh to\u00e1n h\u00f3a \u0111\u01a1n' + ' ' + head, desc: inv.status === 'chua-tt' ? 'Vui l\u00f2ng thanh to\u00e1n <b style="color:var(--navy)">\u0111\u00fang h\u1ea1n</b> \u0111\u1ec3 \u0111\u1ea3m b\u1ea3o quy\u1ec1n l\u1ee3i l\u01b0u tr\u00fa c\u1ee7a b\u1ea1n.' : 'Th\u00f4ng tin thanh to\u00e1n c\u1ee7a h\u00f3a \u0111\u01a1n ' + inv.id + '.' })}
        <div class="grid resp-1" style="grid-template-columns:1fr 1.15fr;gap:12px;align-items:start;margin-top:-10px">
          <div class="card pad" style="padding:20px 22px">
            <div class="card-h"><h2 class="card-t" style="font-size:20px"><span class="ic-box" style="width:52px;height:52px;background:#eef3fa">${ic('file-text')}</span>Th\u00f4ng tin h\u00f3a \u0111\u01a1n</h2><button class="btn btn-soft" data-print="H\u00f3a \u0111\u01a1n ${inv.id}" title="L\u01b0u h\u00f3a \u0111\u01a1n th\u00e0nh t\u1ec7p PDF" style="color:var(--navy)">${ic('download')}T\u1ea3i h\u00f3a \u0111\u01a1n</button></div>
            <div style="background:#f2f6fc;border-radius:12px;padding:16px 22px;display:grid;grid-template-columns:repeat(4,auto);gap:14px 22px;font-size:14px" class="muted">
              <div style="grid-column:span 2">M\u00e3 h\u00f3a \u0111\u01a1n<b style="display:block;color:var(--navy);font-size:17px;margin-top:4px">${inv.id}</b></div><div style="grid-column:span 2">Th\u00e1ng thanh to\u00e1n<b style="display:block;color:var(--navy);font-size:17px;margin-top:4px">${inv.period}</b></div>
              <div>Sinh vi\u00ean<b style="display:block;color:var(--navy);font-size:16px;margin-top:4px">${esc(u.name)} (${u.id})</b></div><div>Ph\u00f2ng<b style="display:block;color:var(--navy);font-size:16px;margin-top:4px">${inv.room}</b></div><div>T\u00f2a<b style="display:block;color:var(--navy);font-size:16px;margin-top:4px">T\u1ea7ng ${inv.khu}</b></div><div>S\u1ed1 ng\u01b0\u1eddi trong ph\u00f2ng<b style="display:block;color:var(--navy);font-size:16px;margin-top:4px">${K.occCount(inv.room)} ng\u01b0\u1eddi (${r.beds} gi\u01b0\u1eddng)</b></div></div>
            <hr class="hr" style="margin:20px 0"><h3 style="font-size:18px;margin-bottom:12px">Chi ti\u1ebft kho\u1ea3n thu</h3>
            <div class="tbl-wrap"><table class="tbl" style="font-size:14px"><thead><tr><th>STT</th><th>N\u1ed9i dung</th><th class="r">S\u1ed1 ti\u1ec1n</th></tr></thead><tbody>${inv.items.map((x, i) => `<tr><td class="c" style="width:60px">${i + 1}</td><td>${x.name}</td><td class="r"><b>${money(x.amount)}</b></td></tr>`).join('')}</tbody></table></div>
            <div style="display:flex;justify-content:space-between;align-items:center;background:#eaf2fd;border-radius:10px;padding:18px 18px;margin-top:14px"><b style="color:var(--navy);font-size:18px">T\u1ed5ng thanh to\u00e1n</b><b style="color:var(--red);font-size:28px">${money(inv.total)}</b></div></div>
          <div class="card pad" style="padding:20px 22px">
            <h2 class="card-t" style="font-size:20px;margin-bottom:16px"><span class="ic-box" style="width:52px;height:52px;background:#eef3fa">${ic('credit-card')}</span>Ch\u1ecdn ph\u01b0\u01a1ng th\u1ee9c thanh to\u00e1n</h2>
            <div class="grid g3" style="gap:10px">${methods.map(([k, t, img]) => `<button class="card" data-method="${k}" ${inv.status !== 'chua-tt' ? 'disabled' : ''} style="position:relative;box-shadow:none;padding:14px 8px 12px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;border:${st.method === k ? '2px solid var(--red);background:#fdf3f4' : '1.5px solid var(--line)'}">${im(img, 'blend', '')}<b style="color:${st.method === k ? 'var(--red)' : 'var(--navy)'};font-size:17px">${t}</b><span style="position:absolute;right:10px;top:10px;width:24px;height:24px;border-radius:50%;${st.method === k ? 'background:var(--red);color:#fff;display:grid;place-items:center' : 'border:1.5px solid #c0cbdc'}">${st.method === k ? ic('check') : ''}</span></button>`).join('')}</div>
            <div style="margin-top:16px">${panel}</div>
            ${inv.status === 'chua-tt' ? `<button class="btn btn-red btn-block btn-lg" id="pay-check" style="margin-top:20px">${ic('credit-card')}Ki\u1ec3m tra thanh to\u00e1n ${ic('arrow-right')}</button>` : ''}
            <button class="btn btn-outline btn-block btn-lg" data-go="sv-hoa-don" style="margin-top:12px;font-size:17px">${ic('arrow-left')}Quay l\u1ea1i h\u00f3a \u0111\u01a1n</button></div></div>`);
    },
    mount: (root, id) => {
      const inv = K.db.invoices.find((x) => x.id === id) || myInvoices()[0];
      if (!inv) return;
      const st = App.st['pay-' + inv.id];
      root.querySelectorAll('[data-method]').forEach((b) => b.onclick = () => { st.method = b.dataset.method; App.refresh(); });
      root.querySelectorAll('[data-wallet]').forEach((b) => b.onclick = () => { st.wallet = b.dataset.wallet; App.refresh(); });
      root.querySelectorAll('[data-copy]').forEach((b) => b.onclick = () => { const t = b.dataset.copy; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => App.toast('\u0110\u00e3 sao ch\u00e9p: ' + t)).catch(() => App.toast('N\u1ed9i dung: ' + t)); });
      const rc = root.querySelector('[data-rcpt]'); if (rc) rc.onclick = () => App.receipt(inv.id);
      const pc = root.querySelector('#pay-check');
      if (pc) pc.onclick = () => {
        const label = st.method === 'bank' ? 'T\u00f4i \u0111\u00e3 chuy\u1ec3n kho\u1ea3n ' + money(inv.total) + ' v\u1edbi n\u1ed9i dung ' + inv.id + '.' : st.method === 'wallet' ? 'X\u00e1c nh\u1eadn thanh to\u00e1n ' + money(inv.total) + ' qua ' + st.wallet + '.' : '\u0110\u1eb7t l\u1ecbch n\u1ed9p ' + money(inv.total) + ' t\u1ea1i qu\u1ea7y ti\u1ebfp nh\u1eadn.';
        App.confirm('X\u00e1c nh\u1eadn thanh to\u00e1n', label + '<br><span class="muted small">Giao d\u1ecbch s\u1ebd chuy\u1ec3n sang tr\u1ea1ng th\u00e1i ch\u1edd \u0111\u1ed1i so\u00e1t.</span>', 'X\u00e1c nh\u1eadn', () => {
          inv.status = 'cho-doi-soat'; inv.txn = 'GD-0' + (30 + K.db.invoices.filter((i) => i.txn).length); inv.paidAt = K.now(); inv.method = st.method; inv.note = 'Thanh to\u00e1n ph\u00ed KTX th\u00e1ng ' + inv.period;
          K.save(); App.toast('\u0110\u00e3 ghi nh\u1eadn giao d\u1ecbch ' + inv.txn + '. \u0110ang ch\u1edd \u0111\u1ed1i so\u00e1t.'); App.refresh();
        });
      };
    },
  };

  // ============ 13. Chi ti\u1ebft y\u00eau c\u1ea7u s\u1eeda ch\u1eefa ============
  P['sv-yeu-cau'] = {
    role: 'student', title: 'Chi ti\u1ebft y\u00eau c\u1ea7u',
    render: (id) => {
      const u = K.me();
      const o = { active: 'sv-ho-tro', logo: 'stack', notif: 'none', search: 'T\u00ecm d\u1ecbch v\u1ee5, h\u00f3a \u0111\u01a1n, th\u00f4ng b\u00e1o...', foot: 'card-email', sbw: 232, icons: { 'sv-ho-tro': 'headphones', 'sv-phong': 'door-closed' } };
      const rq = K.db.repairs.find((x) => x.id === id && x.student === u.id) || myRepairs()[0];
      if (!rq) return shell(o, '<div class="card pad">Kh\u00f4ng t\u00ecm th\u1ea5y y\u00eau c\u1ea7u.</div>');
      const order = ['moi', 'phan-cong', 'dang-xu-ly', 'hoan-tat'];
      const idx = order.indexOf(rq.status);
      const steps = rq.steps || [{ t: '\u0110\u00e3 ti\u1ebfp nh\u1eadn', d: rq.date, s: 'Y\u00eau c\u1ea7u c\u1ee7a b\u1ea1n \u0111\u00e3 \u0111\u01b0\u1ee3c ghi nh\u1eadn.' }, { t: '\u0110\u00e3 ph\u00e2n c\u00f4ng', d: '', s: 'Chuy\u1ec3n \u0111\u1ebfn b\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt.' }, { t: '\u0110ang s\u1eeda ch\u1eefa', d: '', s: 'K\u1ef9 thu\u1eadt vi\u00ean \u0111ang x\u1eed l\u00fd.' }, { t: 'Ho\u00e0n t\u1ea5t', d: '', s: 'S\u1ebd th\u00f4ng b\u00e1o khi ho\u00e0n th\u00e0nh.' }];
      const msgs = rq.msgs && rq.msgs.length ? rq.msgs : [{ who: u.name, av: u.avatar, d: rq.date, m: rq.desc }];
      return shell(o, `${App.crumb([['Trang ch\u1ee7', 'sv-tong-quan'], ['H\u1ed7 tr\u1ee3', 'sv-sua-chua'], 'Chi ti\u1ebft y\u00eau c\u1ea7u'])}
        <div class="grid resp-1" style="grid-template-columns:1fr 480px;gap:14px;align-items:start;margin-top:-4px">
          <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
            <div class="card pad" style="padding:18px 20px"><h1 style="font-size:38px;font-weight:800;display:flex;align-items:center;gap:14px">${ic('file-text', 'ic-lg')}${esc(rq.title)}</h1>
              <div class="row" style="margin-top:14px;flex-wrap:wrap"><span class="badge b-red" style="font-size:17px;padding:8px 20px;border-radius:10px">${rq.id}</span><span class="badge" style="font-size:17px;padding:8px 18px;border-radius:10px;background:#e2eefd;color:var(--blue-700)">${ic(rq.status === 'hoan-tat' ? 'circle-check' : 'clock')}${{ moi: '\u0110\u00e3 ti\u1ebfp nh\u1eadn', 'phan-cong': '\u0110\u00e3 ph\u00e2n c\u00f4ng', 'dang-xu-ly': '\u0110ang x\u1eed l\u00fd', 'hoan-tat': 'Ho\u00e0n t\u1ea5t' }[rq.status]}</span><span class="badge" style="font-size:17px;padding:8px 18px;border-radius:10px;background:#eef3fa;color:var(--navy)">${ic('map-pin')}${esc(rq.loc)}</span></div></div>
            <div class="card pad" style="padding:18px 20px"><h2 class="card-t" style="font-size:20px">${ic('file-text')}Th\u00f4ng tin y\u00eau c\u1ea7u</h2>
              <div style="display:grid;grid-template-columns:1fr 222px;gap:16px;margin-top:12px" class="resp-1"><dl class="kv" style="grid-template-columns:134px 1fr;font-size:15px;gap:10px"><dt style="color:var(--ink)">M\u00e3 y\u00eau c\u1ea7u</dt><dd style="font-weight:400">${rq.id}</dd><dt style="color:var(--ink)">Danh m\u1ee5c</dt><dd style="font-weight:400">${esc(rq.category)}</dd><dt style="color:var(--ink)">V\u1ecb tr\u00ed</dt><dd style="font-weight:400">${esc(rq.loc)} \u00b7 T\u1ea7ng ${K.fl(rq.room)}</dd><dt style="color:var(--ink)">Th\u1eddi gian g\u1eedi</dt><dd style="font-weight:400">${rq.date}</dd><dt style="color:var(--ink)">M\u00f4 t\u1ea3 s\u1ef1 c\u1ed1</dt><dd style="font-weight:400;line-height:1.5">${esc(rq.desc)}</dd></dl>
              ${rq.photo ? `<img src="${K.A(rq.photo)}" style="width:100%;height:210px;object-fit:cover;border-radius:10px" alt="\u1ea2nh s\u1ef1 c\u1ed1">` : `<div class="drop" style="height:210px;flex-direction:column">${ic('image')}<span>Ch\u01b0a c\u00f3 \u1ea3nh minh h\u1ecda</span></div>`}</div></div>
            <div class="card pad" style="padding:18px 20px"><h2 class="card-t" style="font-size:20px">${ic('message-square-more')}Trao \u0111\u1ed5i x\u1eed l\u00fd</h2>
              <div style="display:flex;flex-direction:column;gap:14px;margin-top:16px" id="chat">${msgs.map((m) => `<div style="display:grid;grid-template-columns:68px 172px 1fr;gap:10px;align-items:start" class="resp-1">${av(m.av, 64)}<div style="padding-top:6px"><b style="color:var(--navy);font-size:15.5px">${esc(m.who)}</b><div class="muted small">${m.d}</div></div><div style="background:#eef3f9;border-radius:10px;padding:12px 16px;font-size:14.5px;line-height:1.55;color:var(--ink);white-space:pre-line">${esc(m.m)}</div></div>`).join('')}</div>
              <form class="row" id="chat-f" style="margin-top:18px"><label class="xbtn" style="border:1px solid var(--line);width:50px;height:50px;border-radius:12px;justify-content:center;align-items:center;cursor:pointer;position:relative">${ic('paperclip')}<input type="file" id="chat-file" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label><input id="chat-in" class="input" placeholder="Nh\u1eadp n\u1ed9i dung trao \u0111\u1ed5i..." style="height:52px;flex:1"><button class="btn btn-red" style="width:64px;height:52px;padding:0" aria-label="G\u1eedi">${ic('send')}</button></form></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="card pad" style="padding:20px 24px"><h2 class="card-t" style="font-size:20px;margin-bottom:16px">${ic('clock')}Ti\u1ebfn \u0111\u1ed9 x\u1eed l\u00fd</h2>
              <div class="tl">${steps.map((s, i) => `<div class="tl-i" style="grid-template-columns:30px 1fr;gap:16px"><span class="tl-dot ${i < idx || (i === idx && rq.status === 'hoan-tat') ? '' : i === idx ? 'cur' : 'todo'}">${i < idx || (i === idx && rq.status === 'hoan-tat') ? ic('check') : ''}</span><div><div class="tl-t" style="font-size:17px;color:${i > idx ? 'var(--muted)' : 'var(--navy)'}">${s.t}</div>${s.d && i <= idx ? `<div class="tl-s">${s.d}</div>` : ''}<div class="tl-s">${i === 3 && rq.status === 'hoan-tat' ? '\u0110\u00e3 ho\u00e0n th\u00e0nh s\u1eeda ch\u1eefa.' : s.s}</div></div></div>`).join('')}</div></div>
            ${App.repairRating(rq)}<div class="card" style="padding:18px 24px 0;overflow:hidden"><h2 class="card-t" style="font-size:20px">${ic('wrench')}B\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt</h2>
              <div class="row" style="gap:20px;margin-top:12px">${av('av_tech_team', 96)}<div><b style="color:var(--navy)">${rq.staff ? '\u0110\u1ed9i k\u1ef9 thu\u1eadt KTX \u00b7 ' + esc(rq.staff) : '\u0110\u1ed9i k\u1ef9 thu\u1eadt KTX'}</b><p class="muted" style="margin-top:6px;font-size:14.5px;line-height:1.5">Ph\u1ee5 tr\u00e1ch s\u1eeda ch\u1eefa thi\u1ebft b\u1ecb \u0111i\u1ec7n, n\u01b0\u1edbc t\u1ea1i khu l\u01b0u tr\u00fa sinh vi\u00ean.</p></div></div>
              <div style="background:#eef4fc;border-radius:12px;padding:14px 18px;margin-top:12px;display:flex;gap:18px;align-items:center">${ic('calendar-days', 'ic-lg')}<div><b style="color:var(--navy)">L\u1ecbch x\u1eed l\u00fd d\u1ef1 ki\u1ebfn</b><div class="row" style="gap:8px;margin-top:6px;color:var(--ink)">${ic('calendar')}${rq.schedule || '\u0110ang s\u1eafp x\u1ebfp l\u1ecbch'}</div></div></div>
              <button class="btn btn-outline btn-block" id="add-info" style="margin-top:12px;border-radius:999px;color:var(--blue-700)">${ic('file-pen-line')}B\u1ed5 sung th\u00f4ng tin</button>
              <img src="${K.A('tech_art')}" style="margin:14px -24px 0;width:calc(100% + 48px);max-width:none;height:166px;object-fit:cover" alt=""></div>
          </div></div>`);
    },
    mount: (root, id) => {
      const u = K.me();
      const rq = K.db.repairs.find((x) => x.id === id && x.student === u.id) || myRepairs()[0];
      if (!rq) return;
      const send = (text) => { rq.msgs = rq.msgs && rq.msgs.length ? rq.msgs : [{ who: u.name, av: u.avatar, d: rq.date, m: rq.desc }]; rq.msgs.push({ who: u.name, av: u.avatar, d: K.now(), m: text }); K.save(); App.refresh(); };
      root.querySelector('#chat-f').onsubmit = (e) => { e.preventDefault(); const v = root.querySelector('#chat-in').value.trim(); const f = root.querySelector('#chat-file').files[0]; if (!v && !f) return; send((v || '') + (f ? (v ? '\n' : '') + '\ud83d\udcce ' + f.name : '')); };
      App.bindRepairRating(root, rq);
      root.querySelector('#add-info').onclick = () => App.modal({ title: 'B\u1ed5 sung th\u00f4ng tin', body: `<div class="field"><label for="ai-t">N\u1ed9i dung b\u1ed5 sung</label><textarea id="ai-t" class="textarea" placeholder="V\u00ed d\u1ee5: th\u1eddi gian b\u1ea1n c\u00f3 m\u1eb7t t\u1ea1i ph\u00f2ng, t\u00ecnh tr\u1ea1ng m\u1edbi c\u1ee7a s\u1ef1 c\u1ed1..."></textarea></div>`, foot: `<button class="btn btn-outline" data-x>H\u1ee7y</button><button class="btn btn-red" data-ok>G\u1eedi b\u1ed5 sung</button>`, onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const v = el.querySelector('#ai-t').value.trim(); if (!v) return App.toast('Vui l\u00f2ng nh\u1eadp n\u1ed9i dung', 'err'); close(); send('[B\u1ed5 sung] ' + v); App.toast('\u0110\u00e3 g\u1eedi th\u00f4ng tin b\u1ed5 sung'); } });
    },
  };

  // ============ 14. Trung t\u00e2m y\u00eau c\u1ea7u s\u1eeda ch\u1eefa ============
  P['sv-sua-chua'] = {
    role: 'student', title: 'Y\u00eau c\u1ea7u s\u1eeda ch\u1eefa',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-tro', logo: 'inline', notif: 'after', search: 'T\u00ecm d\u1ecbch v\u1ee5, th\u00f4ng b\u00e1o, h\u01b0\u1edbng d\u1eabn...', foot: 'card-email', sbw: 270 };
      const st = App.state('repairs', { tab: 'all', prio: 'normal', title: '', desc: '', loc: u.room ? 'Ph\u00f2ng ' + u.room : '', kind: '' });
      const all = myRepairs();
      const doing = all.filter((r) => r.status === 'dang-xu-ly' || r.status === 'phan-cong');
      const done = all.filter((r) => r.status === 'hoan-tat');
      const list = st.tab === 'doing' ? doing : st.tab === 'done' ? done : all;
      const icon = { bulb: 'ri_bulb', faucet: 'ri_faucet', socket: 'ri_socket' };
      const kinds = [['', 'Ch\u1ecdn lo\u1ea1i s\u1ef1 c\u1ed1'], ['Thi\u1ebft b\u1ecb \u0111i\u1ec7n|bulb', 'Thi\u1ebft b\u1ecb \u0111i\u1ec7n'], ['H\u1ec7 th\u1ed1ng n\u01b0\u1edbc|faucet', 'H\u1ec7 th\u1ed1ng n\u01b0\u1edbc'], ['\u1ed4 c\u1eafm, c\u00f4ng t\u1eafc|socket', '\u1ed4 c\u1eafm, c\u00f4ng t\u1eafc'], ['\u0110i\u1ec1u h\u00f2a, qu\u1ea1t|bulb', '\u0110i\u1ec1u h\u00f2a, qu\u1ea1t'], ['\u0110\u1ed3 d\u00f9ng ph\u00f2ng|socket', '\u0110\u1ed3 d\u00f9ng ph\u00f2ng'], ['Kh\u00f3a c\u1eeda|socket', 'Kh\u00f3a c\u1eeda']];
      const locs = u.room ? ['Ph\u00f2ng ' + u.room, 'Ph\u00f2ng t\u1eafm ' + u.room, 'H\u00e0nh lang t\u1ea7ng ' + K.room(u.room).floor, 'Khu v\u1ef1c chung t\u1ea7ng ' + K.room(u.room).floor] : ['Khu v\u1ef1c chung'];
      return shell(o, `<div class="phead" style="min-height:182px;margin-top:-10px"><img class="art" src="${K.A('banner_repair')}" alt="" style="max-width:48%;right:-30px;top:0;height:100%;border-radius:0 0 0 12px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%);mask-image:linear-gradient(90deg,transparent,#000 8%)">${App.crumb([['Trang ch\u1ee7', 'sv-tong-quan'], ['H\u1ed7 tr\u1ee3', 'sv-ho-tro'], 'Y\u00eau c\u1ea7u s\u1eeda ch\u1eefa'])}
          <div class="row" style="gap:22px;margin-top:10px">${im('ic_wrench_big', 'blend', '')}<div><h1 style="font-size:46px">Y\u00eau c\u1ea7u s\u1eeda ch\u1eefa</h1><p class="desc" style="margin-top:2px">T\u1ea1o v\u00e0 theo d\u00f5i c\u00e1c y\u00eau c\u1ea7u s\u1eeda ch\u1eefa, b\u1ea3o tr\u00ec trong khu k\u00fd t\u00fac x\u00e1.</p></div></div></div>
        <div class="grid resp-1" style="grid-template-columns:1.07fr 1fr;gap:18px;align-items:start">
          <div class="card pad" style="padding:22px 14px 14px"><h2 style="font-size:25px;padding:0 10px">Danh s\u00e1ch y\u00eau c\u1ea7u c\u1ee7a t\u00f4i</h2>
            <div class="pills" style="margin:14px 0 16px;padding:0 4px">${[['all', 'T\u1ea5t c\u1ea3 (' + all.length + ')'], ['doing', '\u0110ang x\u1eed l\u00fd (' + doing.length + ')'], ['done', 'Ho\u00e0n t\u1ea5t (' + done.length + ')']].map(([k, t]) => `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}" style="min-width:150px;justify-content:center;border-radius:12px;${st.tab === k ? '' : 'background:#eaf2fd;border-color:#eaf2fd'}">${t}</button>`).join('')}</div>
            <div style="display:flex;flex-direction:column;gap:14px">${list.map((r) => `<div class="card" style="box-shadow:none;padding:14px 18px 12px;border:1px solid var(--line)"><div style="display:grid;grid-template-columns:92px 1fr auto;gap:16px">${im(icon[r.icon] || 'ri_socket', 'blend', '')}<div><b style="color:var(--navy);font-size:18px">${esc(r.title)}</b><p class="muted" style="font-size:14.5px;margin-top:6px;line-height:1.5">${esc(r.summary || (r.desc.length > 90 ? r.desc.slice(0, 90) + '\u2026' : r.desc))}</p></div><div>${r.status === 'dang-xu-ly' || r.status === 'phan-cong' ? `<span class="badge b-orange" style="border:1px solid #f7d899;border-radius:8px">${ic('clock')}\u0110ang x\u1eed l\u00fd</span>` : r.status === 'hoan-tat' ? `<span class="badge b-green" style="border-radius:8px">${ic('circle-check')}Ho\u00e0n t\u1ea5t</span>` : `<span class="badge b-blue" style="border-radius:8px">${ic('hourglass')}\u0110\u00e3 ti\u1ebfp nh\u1eadn</span>`}</div></div>
              <div class="row" style="margin-top:12px;font-size:14px;color:var(--text);gap:10px;flex-wrap:wrap">${ic('map-pin')}Ph\u00f2ng ${r.room}<span style="color:#c5cfdf">|</span>${ic('calendar-days')}${r.date.slice(0, 10)}<span style="color:#c5cfdf">|</span><span>${r.code}</span><a href="#" class="link" style="margin-left:auto;font-size:15px" data-go="sv-yeu-cau-${r.id}">Xem chi ti\u1ebft ${ic('arrow-right')}</a></div></div>`).join('') || '<p class="muted" style="padding:20px;text-align:center">Ch\u01b0a c\u00f3 y\u00eau c\u1ea7u n\u00e0o.</p>'}</div></div>
          <form class="card pad" id="rq-f" novalidate style="padding:22px 22px">
            <div class="row" style="gap:18px;align-items:flex-start">${im('ic_doc_red', 'blend', '')}<div><h2 style="font-size:25px">T\u1ea1o y\u00eau c\u1ea7u m\u1edbi</h2><p class="muted" style="font-size:15px;margin-top:4px;color:var(--text)">\u0110i\u1ec1n th\u00f4ng tin chi ti\u1ebft \u0111\u1ec3 b\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt h\u1ed7 tr\u1ee3 b\u1ea1n nhanh ch\u00f3ng.</p></div></div>
            <div style="display:grid;grid-template-columns:160px 1fr;gap:14px 10px;align-items:center;margin-top:16px">
              <label class="lbl" for="rq-loc">V\u1ecb tr\u00ed <span class="req">*</span></label><div class="iwrap">${ic('map-pin')}${sel('rq-loc', locs, st.loc)}</div>
              <label class="lbl" for="rq-kind">Lo\u1ea1i s\u1ef1 c\u1ed1 <span class="req">*</span></label><div class="iwrap">${ic('wrench')}${sel('rq-kind', kinds, st.kind)}</div></div>
            <div class="field" style="margin-top:14px"><label for="rq-title">Ti\u00eau \u0111\u1ec1 <span class="req">*</span></label><input id="rq-title" class="input" placeholder="Nh\u1eadp ti\u00eau \u0111\u1ec1 ng\u1eafn g\u1ecdn cho y\u00eau c\u1ea7u..." value="${esc(st.title)}" maxlength="80"></div>
            <div class="field" style="margin-top:14px"><label for="rq-desc">M\u00f4 t\u1ea3 s\u1ef1 c\u1ed1 <span class="req">*</span></label><div style="position:relative"><textarea id="rq-desc" class="textarea" data-max="500" placeholder="M\u00f4 t\u1ea3 chi ti\u1ebft t\u00ecnh tr\u1ea1ng, th\u1eddi \u0111i\u1ec3m x\u1ea3y ra v\u00e0 c\u00e1c th\u00f4ng tin li\u00ean quan..." style="min-height:104px">${esc(st.desc)}</textarea><span class="counter">0/500</span></div></div>
            <div class="grid g2" style="gap:24px;margin-top:16px"><div class="field"><span class="lbl">Th\u00eam \u1ea3nh minh h\u1ecda <span class="muted" style="font-weight:400">(t\u00f9y ch\u1ecdn)</span></span><div><label class="drop" style="flex-direction:column;padding:14px;gap:6px"><span class="row" style="gap:14px"><span class="dz-ic">${ic('image')}</span><span style="color:var(--ink)">Nh\u1ea5p \u0111\u1ec3 t\u1ea3i \u1ea3nh l\u00ean<br>ho\u1eb7c k\u00e9o th\u1ea3 v\u00e0o \u0111\u00e2y</span></span><small style="font-size:12.5px">JPG, PNG (t\u1ed1i \u0111a 5 \u1ea3nh, m\u1ed7i \u1ea3nh 5MB)</small><input type="file" id="rq-img" accept="image/*" multiple></label></div></div>
              <div class="field"><span class="lbl">M\u1ee9c \u0111\u1ed9 \u01b0u ti\u00ean <span class="req">*</span></span><label class="radio"><input type="radio" name="prio" value="normal" ${st.prio === 'normal' ? 'checked' : ''}><span><b style="font-weight:500">B\u00ecnh th\u01b0\u1eddng</b><small class="muted" style="display:block">x\u1eed l\u00fd theo k\u1ebf ho\u1ea1ch</small></span></label><label class="radio"><input type="radio" name="prio" value="urgent" ${st.prio === 'urgent' ? 'checked' : ''}><span><b style="font-weight:500">C\u1ea7n x\u1eed l\u00fd s\u1edbm</b><small class="muted" style="display:block">\u1ea3nh h\u01b0\u1edfng \u0111\u1ebfn sinh ho\u1ea1t</small></span></label></div></div>
            <p class="err" id="rq-err" style="margin-top:10px" hidden></p>
            <button class="btn btn-red btn-block btn-lg" style="margin-top:18px;font-size:19px">${ic('send')}G\u1eedi y\u00eau c\u1ea7u</button></form></div>`);
    },
    mount: (root) => {
      const st = App.st.repairs; const u = K.me();
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      root.querySelector('#rq-f').onsubmit = (e) => {
        e.preventDefault();
        const f = e.target; const err = f.querySelector('#rq-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        const loc = f.querySelector('#rq-loc').value, kind = f.querySelector('#rq-kind').value, title = f.querySelector('#rq-title').value.trim(), desc = f.querySelector('#rq-desc').value.trim(), prio = f.querySelector('[name=prio]:checked').value;
        if (!kind) return fail('Vui l\u00f2ng ch\u1ecdn lo\u1ea1i s\u1ef1 c\u1ed1.');
        if (!title) return fail('Vui l\u00f2ng nh\u1eadp ti\u00eau \u0111\u1ec1.');
        if (desc.length < 10) return fail('M\u00f4 t\u1ea3 s\u1ef1 c\u1ed1 c\u1ea7n t\u1ed1i thi\u1ec3u 10 k\u00fd t\u1ef1.');
        const [cat, icon] = kind.split('|');
        const n = Math.max(...K.db.repairs.map((r) => +r.id.slice(3))) + 1;
        const d = new Date(); const code = '#PX' + d.getFullYear() + b2(d.getMonth() + 1) + b2(d.getDate()) + '-' + String(n).padStart(3, '0');
        const room = u.room || 'A302';
        K.db.repairs.unshift({ id: 'SC-0' + n, code, title, short: title, desc, student: u.id, room, loc: loc.replace('Ph\u00f2ng t\u1eafm ', '').replace('Ph\u00f2ng ', '') + (loc.startsWith('Ph\u00f2ng t\u1eafm') ? ' \u00b7 Ph\u00f2ng t\u1eafm' : u.bed ? ' \u00b7 Gi\u01b0\u1eddng ' + b2(u.bed) : ''), place: 'T\u1ea7ng ' + K.room(room).floor, category: cat, kind: cat.split(',')[0], icon, prio: prio === 'urgent' ? 'Cao' : 'Trung b\u00ecnh', status: 'moi', date: K.now(), kdate: K.today(), staff: '', dept: 'B\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt', schedule: '', msgs: [], steps: null });
        K.save(); App.st.repairs = null;
        App.toast('\u0110\u00e3 g\u1eedi y\u00eau c\u1ea7u SC-0' + n + '. B\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt s\u1ebd ti\u1ebfp nh\u1eadn s\u1edbm.');
        App.refresh();
      };
    },
  };

  // ============ 15. Gia h\u1ea1n ============
  P['sv-gia-han'] = {
    role: 'student', title: 'Gia h\u1ea1n l\u01b0u tr\u00fa',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-so', logo: 'inline', notif: 'dot', search: 'T\u00ecm ph\u00f2ng, h\u00f3a \u0111\u01a1n, th\u00f4ng b\u00e1o...', sbw: 286, icons: { 'sv-hoa-don': 'receipt-text' } };
      if (!u.room) return noRoom(o);
      const r = K.room(u.room);
      const req = K.db.requests.extend;
      const st = App.state('extend', () => (K.db.drafts.extend ? Object.assign({}, K.db.drafts.extend) : { term: 'H\u1ecdc k\u1ef3 II \u00b7 2026 \u2013 2027', note: '', agree: true }));
      const [from, to] = semMonths[st.term];
      const months = (() => { const [d1, m1, y1] = from.split('/').map(Number); const [d2, m2, y2] = to.split('/').map(Number); return (y2 - y1) * 12 + (m2 - m1) + 1; })();
      const sent = req && req.student === u.id;
      const step = sent ? (req.status === 'da-duyet' ? 3 : 2) : 1;
      return shell(o, `<div style="display:grid;grid-template-columns:1fr 540px;gap:16px;align-items:end" class="resp-1"><div>${App.crumb([['Trang ch\u1ee7', 'sv-tong-quan'], ['L\u01b0u tr\u00fa', 'sv-ho-so'], 'Gia h\u1ea1n l\u01b0u tr\u00fa'])}<h1 style="font-size:46px;font-weight:800;margin-top:10px">Gia h\u1ea1n l\u01b0u tr\u00fa</h1><p class="desc" style="font-size:18px;color:#4a5a7e;margin:4px 0 14px">\u0110\u0103ng k\u00fd gia h\u1ea1n th\u1eddi gian l\u01b0u tr\u00fa t\u1ea1i k\u00fd t\u00fac x\u00e1 \u0111\u1ec3 ti\u1ebfp t\u1ee5c \u1edf ph\u00f2ng hi\u1ec7n t\u1ea1i.</p>${stayTabs('sv-gia-han')}</div><img src="${K.A('banner_extend')}" alt="" style="margin:-10px -30px -60px 0;width:calc(100% + 30px);max-width:none;height:250px;object-fit:cover;object-position:left;-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%);mask-image:linear-gradient(90deg,transparent,#000 10%)" class="hide-sm"></div>
        ${sent ? `<div class="card" style="padding:14px 20px;display:flex;gap:12px;align-items:center;background:${req.status === 'da-duyet' ? '#e9f8ee' : '#fff8ea'};border-color:${req.status === 'da-duyet' ? '#c7ecd3' : '#fbeccd'}">${ic(req.status === 'da-duyet' ? 'circle-check' : 'clock')}<span>Y\u00eau c\u1ea7u gia h\u1ea1n <b>${esc(req.term)}</b> g\u1eedi l\u00fac ${req.date} \u2013 <b>${req.status === 'da-duyet' ? '\u0111\u00e3 \u0111\u01b0\u1ee3c duy\u1ec7t' : '\u0111ang ch\u1edd Ban qu\u1ea3n l\u00fd x\u00e9t duy\u1ec7t'}</b>.</span></div>` : ''}
        <div class="grid resp-1" style="grid-template-columns:1fr 1fr;gap:14px;align-items:start;position:relative;z-index:1">
          <form class="card pad" id="ex-f" novalidate style="padding:16px 20px 18px">
            <h2 class="card-t" style="font-size:22px"><span class="ic-box" style="width:40px;height:40px">${ic('calendar-days')}</span>Th\u00f4ng tin gia h\u1ea1n</h2>
            <div style="background:#f0f5fc;border-radius:12px;padding:16px 18px;margin-top:14px;display:grid;grid-template-columns:auto 1fr 1.2fr;gap:20px;align-items:center" class="resp-1"><span class="ic-box" style="width:70px;height:70px;background:#dfeafb">${ic('bed-double', 'ic-lg')}</span><div style="border-right:1px solid var(--line);padding-right:14px"><small class="muted" style="font-size:14.5px">Ph\u00f2ng hi\u1ec7n t\u1ea1i</small><b style="display:block;color:var(--navy);font-size:19px;white-space:nowrap">${r.code} &nbsp;\u00b7&nbsp; Gi\u01b0\u1eddng ${b2(u.bed)}</b></div><div><small class="muted" style="font-size:14.5px">H\u1ee3p \u0111\u1ed3ng hi\u1ec7n t\u1ea1i</small> ${badge('\u0110ang hi\u1ec7u l\u1ef1c', 'green', { sm: true })}<b style="display:block;color:var(--navy);font-size:16px;margin-top:4px">H\u1ecdc k\u1ef3 I \u00b7 2026 \u2013 2027</b><small class="muted">01/09/2026 \u2013 31/01/2027</small></div></div>
            <div class="field" style="margin-top:16px"><label for="ex-term" style="font-weight:500">H\u1ecdc k\u1ef3 \u0111\u0103ng k\u00fd gia h\u1ea1n <span class="req">*</span></label><div class="iwrap">${ic('calendar-days')}${sel('ex-term', ['H\u1ecdc k\u1ef3 II \u00b7 2026 \u2013 2027', 'H\u1ecdc k\u1ef3 I \u00b7 2027 \u2013 2028'], st.term, '', sent ? 'disabled' : '')}</div></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:14px"><div class="field"><label style="font-weight:500">Th\u1eddi gian l\u01b0u tr\u00fa d\u1ef1 ki\u1ebfn <span class="req">*</span></label><div class="iwrap">${ic('calendar-days')}<input class="input" readonly value="${from} \u2013 ${to}"></div></div><div class="field"><label style="font-weight:500">S\u1ed1 th\u00e1ng</label><input class="input ro" readonly value="${months} th\u00e1ng" style="background:#eef1f5;color:var(--muted)"></div></div>
            <div class="field" style="margin-top:14px"><label for="ex-note" style="font-weight:500">Ghi ch\u00fa <span class="muted" style="font-weight:400">(kh\u00f4ng b\u1eaft bu\u1ed9c)</span></label><div style="position:relative"><textarea id="ex-note" class="textarea" data-max="300" placeholder="Nh\u1eadp ghi ch\u00fa n\u1ebfu c\u00f3 (v\u00ed d\u1ee5: nguy\u1ec7n v\u1ecdng, th\u1eddi gian d\u1ef1 ki\u1ebfn...)" ${sent ? 'disabled' : ''}>${esc(st.note)}</textarea><span class="counter">0/300</span></div></div>
            <div class="row" style="margin-top:16px;align-items:flex-start"><span class="ic-box" style="width:38px;height:38px;background:#eef3fa">${ic('paperclip')}</span><div><b style="color:var(--navy)">Gi\u1ea5y t\u1edd b\u1ed5 sung</b><div class="small muted">T\u1ea3i l\u00ean c\u00e1c gi\u1ea5y t\u1edd theo y\u00eau c\u1ea7u (n\u1ebfu c\u00f3). H\u1ed7 tr\u1ee3 \u0111\u1ecbnh d\u1ea1ng PDF, JPG, PNG (t\u1ed1i \u0111a 5MB/t\u1ec7p).</div></div></div>
            <div style="margin-top:10px"><label class="drop">${ic('upload')}<span><b>Ch\u1ecdn t\u1ec7p</b> ho\u1eb7c k\u00e9o th\u1ea3 t\u1ec7p v\u00e0o \u0111\u00e2y<br><small style="font-size:12px">C\u00f3 th\u1ec3 ch\u1ecdn nhi\u1ec1u t\u1ec7p c\u00f9ng l\u00fac</small></span><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png"></label></div>
            <label class="check" style="margin-top:14px;font-size:14px"><input type="checkbox" id="ex-agree" ${st.agree ? 'checked' : ''}>T\u00f4i ti\u1ebfp t\u1ee5c tu\u00e2n th\u1ee7 n\u1ed9i quy k\u00fd t\u00fac x\u00e1 v\u00e0 cam k\u1ebft cung c\u1ea5p th\u00f4ng tin ch\u00ednh x\u00e1c.</label>
          </form>
          <div class="card pad" style="padding:18px 20px">
            <div class="row" style="align-items:flex-start;gap:16px"><span class="ic-box" style="width:42px;height:42px;background:#eef3fa">${ic('clipboard-list')}</span><div><h2 style="font-size:23px">Gi\u1eef nguy\u00ean ph\u00f2ng hi\u1ec7n t\u1ea1i</h2><p class="muted" style="margin-top:4px;color:var(--text)">B\u1ea1n s\u1ebd ti\u1ebfp t\u1ee5c l\u01b0u tr\u00fa t\u1ea1i ph\u00f2ng hi\u1ec7n t\u1ea1i n\u1ebfu \u0111\u01b0\u1ee3c ph\u00ea duy\u1ec7t.</p></div></div>
            <div style="background:#eef4fc;border-radius:12px;padding:14px 16px;margin-top:16px;display:grid;grid-template-columns:auto repeat(4,1fr);gap:0;align-items:center;text-align:center">${'<span class="ic-box" style="width:52px;height:52px;background:#fff">' + ic('bed-double') + '</span>'}${[['Ph\u00f2ng', r.code], ['T\u1ea7ng', 'T\u1ea7ng ' + r.khu], ['Gi\u01b0\u1eddng', b2(u.bed)], ['S\u1ed1 ng\u01b0\u1eddi \u1edf', K.occCount(r.code) + '/' + r.beds]].map(([a, b], i) => `<div style="${i ? 'border-left:1px solid var(--line)' : ''}"><small class="muted" style="font-size:14px">${a}</small><b style="display:block;color:var(--navy);font-size:18px">${b}</b></div>`).join('')}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px"><span class="row" style="gap:14px;font-size:18px;font-weight:700;color:var(--navy)"><span style="color:var(--red)">${ic('coins', 'ic-lg')}</span>Ti\u1ec1n ph\u00f2ng tham kh\u1ea3o</span><b style="color:var(--red);font-size:22px">${money(r.price)} <small style="font-size:17px">/ th\u00e1ng</small></b></div>
            <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px"><div style="background:#f6f9fd;border-radius:8px;padding:10px 14px;display:flex;justify-content:space-between;font-size:14.5px"><span class="row" style="gap:12px"><span style="color:var(--red)">${ic('zap')}</span>Ti\u1ec1n \u0111i\u1ec7n (thu theo th\u1ef1c t\u1ebf)</span><span>30.000\u0111 / th\u00e1ng</span></div><div style="background:#f6f9fd;border-radius:8px;padding:10px 14px;display:flex;justify-content:space-between;font-size:14.5px"><span class="row" style="gap:12px"><span style="color:var(--blue)">${ic('droplet')}</span>Ti\u1ec1n n\u01b0\u1edbc (thu theo th\u1ef1c t\u1ebf)</span><span>20.000\u0111 / th\u00e1ng</span></div></div>
            <div style="background:#e3eefc;border-radius:10px;padding:14px 18px;display:flex;justify-content:space-between;margin-top:8px"><b style="color:var(--navy);font-size:17px;font-weight:600">T\u1ed5ng tham kh\u1ea3o</b><b style="color:var(--navy);font-size:20px">${money(r.price + 50000)} / th\u00e1ng</b></div>
            <h3 class="row" style="font-size:18px;margin-top:18px;gap:12px"><span style="color:var(--red)">${ic('settings')}</span>Quy tr\u00ecnh x\u1eed l\u00fd y\u00eau c\u1ea7u</h3>
            <div style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:6px;align-items:start;margin-top:12px;text-align:center">${[['G\u1eedi y\u00eau c\u1ea7u', 'B\u1ea1n g\u1eedi th\u00f4ng tin gia h\u1ea1n l\u01b0u tr\u00fa'], ['Ban qu\u1ea3n l\u00fd x\u00e9t duy\u1ec7t', 'Ki\u1ec3m tra th\u00f4ng tin v\u00e0 ph\u00ea duy\u1ec7t'], ['C\u1eadp nh\u1eadt l\u01b0u tr\u00fa', 'K\u1ebft qu\u1ea3 \u0111\u01b0\u1ee3c th\u00f4ng b\u00e1o qua h\u1ec7 th\u1ed1ng']].map(([a, b], i) => `<div><span class="stepnum ${i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}" style="margin:0 auto;${i + 1 === step ? 'background:#fff;color:var(--red);border:2px solid var(--red);box-shadow:none' : ''}">${i + 1 < step ? ic('check') : i + 1}</span><b style="display:block;font-size:13.5px;color:${i + 1 === step ? 'var(--red)' : 'var(--navy)'};margin-top:6px">${a}</b><small class="muted" style="font-size:12.5px">${b}</small></div>${i < 2 ? `<span style="color:#9fb0c9;margin-top:10px">${ic('chevron-right')}</span>` : ''}`).join('')}</div>
            <div class="grid g2" style="gap:12px;margin-top:18px"><button class="btn btn-outline btn-lg" id="ex-draft" ${sent ? 'disabled' : ''} style="font-size:16px">${ic('file-text')}L\u01b0u nh\u00e1p</button><button class="btn btn-red btn-lg" id="ex-send" ${sent ? 'disabled' : ''} style="font-size:16px">${ic('send')}${sent ? '\u0110\u00e3 g\u1eedi y\u00eau c\u1ea7u' : 'G\u1eedi y\u00eau c\u1ea7u gia h\u1ea1n'}</button></div>
          </div></div>`);
    },
    mount: (root) => {
      const st = App.st.extend; const u = K.me();
      if (!u.room) return;
      const keep = () => { st.term = root.querySelector('#ex-term').value; st.note = root.querySelector('#ex-note').value; st.agree = root.querySelector('#ex-agree').checked; };
      const t = root.querySelector('#ex-term'); if (t) t.onchange = () => { keep(); App.refresh(); };
      const d = root.querySelector('#ex-draft'); if (d) d.onclick = () => { keep(); K.db.drafts.extend = Object.assign({}, st); K.save(); App.toast('\u0110\u00e3 l\u01b0u nh\u00e1p y\u00eau c\u1ea7u gia h\u1ea1n'); };
      const s = root.querySelector('#ex-send'); if (s) s.onclick = () => {
        keep(); if (!st.agree) return App.toast('Vui l\u00f2ng t\u00edch cam k\u1ebft tu\u00e2n th\u1ee7 n\u1ed9i quy', 'err');
        K.db.requests.extend = { student: u.id, term: st.term, note: st.note, date: K.now(), status: 'cho-duyet' };
        K.db.applications.push({ id: 'HS2026-' + String(40 + K.db.applications.length).padStart(4, '0'), student: u.id, type: 'Gia h\u1ea1n l\u01b0u tr\u00fa ' + st.term.replace('\u00b7', '\u2013'), room: u.room, bed: u.bed, term: st.term.split('\u00b7 ')[1], period: semMonths[st.term].join(' \u2013 '), date: K.now(), status: 'cho-duyet', kind: 'extend', docs: [{ name: '\u0110\u01a1n gia h\u1ea1n l\u01b0u tr\u00fa', ok: true }], history: [{ t: 'Sinh vi\u00ean n\u1ed9p h\u1ed3 s\u01a1', d: K.now(), s: 'Y\u00eau c\u1ea7u gia h\u1ea1n \u0111\u01b0\u1ee3c g\u1eedi l\u00ean h\u1ec7 th\u1ed1ng.' }, { t: 'Ch\u1edd x\u00e9t duy\u1ec7t', d: K.now(), s: 'H\u1ed3 s\u01a1 \u0111ang ch\u1edd c\u00e1n b\u1ed9 qu\u1ea3n l\u00fd xem x\u00e9t.' }] });
        delete K.db.drafts.extend; K.save(); App.toast('\u0110\u00e3 g\u1eedi y\u00eau c\u1ea7u gia h\u1ea1n. Ban qu\u1ea3n l\u00fd s\u1ebd x\u00e9t duy\u1ec7t trong 3 \u2013 5 ng\u00e0y.'); App.refresh();
      };
    },
  };

  // ============ 16. Chuy\u1ec3n ph\u00f2ng ============
  P['sv-chuyen-phong'] = {
    role: 'student', title: 'Y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-so', logo: 'inline', notif: 'dot', search: 'T\u00ecm ph\u00f2ng, h\u00f3a \u0111\u01a1n, th\u00f4ng b\u00e1o...', foot: 'card-only', sbw: 284, icons: { 'sv-phong': 'house', 'sv-hoa-don': 'badge-dollar-sign' } };
      if (!u.room) return noRoom(o);
      const cur = K.room(u.room);
      const st = App.state('transfer', () => { const tgt = App.st.transferPick && App.st.transferPick !== u.room && K.freeBeds(App.st.transferPick) > 0 ? App.st.transferPick : K.freeBeds('B204') > 0 && u.room !== 'B204' ? 'B204' : (K.db.rooms.find((r) => r.code !== u.room && K.freeBeds(r.code) > 0 && !r.maint) || {}).code; return { room: tgt, reason: 'Ph\u00f9 h\u1ee3p v\u1edbi b\u1ea1n h\u1ecdc', text: 'Em mong mu\u1ed1n chuy\u1ec3n sang ph\u00f2ng ' + tgt + ' \u0111\u1ec3 thu\u1eadn ti\u1ec7n sinh ho\u1ea1t v\u00ec c\u00f3 b\u1ea1n h\u1ecdc c\u00f9ng ng\u00e0nh. K\u00ednh mong nh\u00e0 tr\u01b0\u1eddng xem x\u00e9t h\u1ed7 tr\u1ee3. Em xin c\u1ea3m \u01a1n!', date: '2026-10-20' }; });
      const tg = K.room(st.room);
      const freeBed = (K.bedMap(tg.code).find((b) => b.free) || {}).bed;
      const req = K.db.requests.transfer;
      const sent = req && req.student === u.id && req.status === 'cho-duyet';
      const roomCard = (r, label, bed, extra) => `<div class="card resp-1" style="padding:14px;display:grid;grid-template-columns:232px 1fr;gap:16px;align-items:center"><img src="${K.A(r.code === u.room ? 'room_cur' : r.code === 'B204' ? 'room_new' : r.img)}" style="width:100%;height:166px;object-fit:cover;border-radius:10px" alt=""><div><div style="display:flex;justify-content:space-between;align-items:center"><span class="badge b-blue" style="border-radius:8px;color:var(--navy)">${label}</span>${extra || ''}</div><h3 style="font-size:22px;margin:10px 0 8px">${r.code} \u00b7 T\u1ea7ng ${r.khu} \u00b7 Gi\u01b0\u1eddng ${b2(bed)}</h3><div class="info-list" style="font-size:15px"><div style="grid-template-columns:24px 1fr">${ic('building')}<span>T\u1ea7ng ${r.khu} - T\u00f2a nh\u00e0 ${r.khu}</span></div><div style="grid-template-columns:24px 1fr">${ic('users')}<span>${K.occCount(r.code)} sinh vi\u00ean / ${r.beds} gi\u01b0\u1eddng (${K.freeBeds(r.code) > 0 ? 'C\u00f2n ' + K.freeBeds(r.code) + ' ch\u1ed7' : '\u0110\u00e3 \u0111\u1ee7'})</span></div><div style="grid-template-columns:24px 1fr">${ic('bed-double')}<span>${r.code === u.room ? 'Gi\u01b0\u1eddng c\u1ee7a b\u1ea1n' : 'Gi\u01b0\u1eddng \u0111\u1ec1 ngh\u1ecb'}: <b>${b2(bed)}</b></span></div></div></div></div>`;
      return shell(o, `<div style="position:relative">${App.phead({ art: 'banner_transfer', h: 150, crumb: [['Trang ch\u1ee7', 'sv-tong-quan'], ['L\u01b0u tr\u00fa', 'sv-ho-so'], 'Y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng'], title: 'Y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng', desc: 'G\u1eedi y\u00eau c\u1ea7u chuy\u1ec3n sang ph\u00f2ng ph\u00f9 h\u1ee3p h\u01a1n v\u1edbi nhu c\u1ea7u c\u1ee7a b\u1ea1n.' })}<div style="max-width:660px;margin-top:6px">${stayTabs('sv-chuyen-phong', 'icons')}</div></div>
        ${sent ? `<div class="card" style="padding:14px 20px;display:flex;gap:12px;align-items:center;background:#fff8ea;border-color:#fbeccd">${ic('clock')}<span>B\u1ea1n \u0111\u00e3 g\u1eedi y\u00eau c\u1ea7u chuy\u1ec3n sang <b>${req.room} \u00b7 Gi\u01b0\u1eddng ${b2(req.bed)}</b> l\u00fac ${req.date}. Tr\u1ea1ng th\u00e1i: <b>Ch\u1edd x\u00e9t duy\u1ec7t</b>.</span><button class="btn btn-sm btn-outline-red" id="tf-cancel" style="margin-left:auto">H\u1ee7y y\u00eau c\u1ea7u</button></div>` : ''}
        <div style="display:grid;grid-template-columns:1fr 40px 1fr;align-items:center;gap:6px" class="resp-1">${roomCard(cur, 'Ph\u00f2ng hi\u1ec7n t\u1ea1i', u.bed)}<span style="color:var(--red);text-align:center">${ic('arrow-right', 'ic-lg')}</span>${roomCard(tg, 'Ph\u00f2ng \u0111\u1ec1 ngh\u1ecb', freeBed, K.freeBeds(tg.code) > 0 ? badge('C\u00f2n ch\u1ed7', 'green', { dot: true }) : badge('H\u1ebft ch\u1ed7', 'red', { dot: true }))}</div>
        <div class="grid resp-1" style="grid-template-columns:1.43fr 1fr;gap:16px;align-items:start">
          <form class="card pad" id="tf-f" novalidate style="padding:20px 24px"><h2 style="font-size:20px">Th\u00f4ng tin y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng</h2>
            <div style="display:grid;grid-template-columns:180px 1fr;gap:16px 10px;margin-top:16px;align-items:start" class="resp-1">
              <label class="lbl" for="tf-reason" style="padding-top:10px;font-weight:500">L\u00fd do chuy\u1ec3n ph\u00f2ng <span class="req">*</span></label>${sel('tf-reason', ['Ph\u00f9 h\u1ee3p v\u1edbi b\u1ea1n h\u1ecdc', 'G\u1ea7n l\u1edbp h\u1ecdc / khoa', 'L\u00fd do s\u1ee9c kh\u1ecfe', 'Mu\u1ed1n \u1edf ph\u00f2ng \u00edt ng\u01b0\u1eddi h\u01a1n', 'L\u00fd do kh\u00e1c'], st.reason, '', sent ? 'disabled' : '')}
              <label class="lbl" for="tf-text" style="padding-top:10px;font-weight:500">N\u1ed9i dung \u0111\u1ec1 ngh\u1ecb <span class="req">*</span></label><div style="position:relative"><textarea id="tf-text" class="textarea" data-max="500" style="min-height:124px" ${sent ? 'disabled' : ''}>${esc(st.text)}</textarea><span class="counter">0/500</span></div>
              <label class="lbl" for="tf-date" style="padding-top:10px;font-weight:500">Ng\u00e0y chuy\u1ec3n d\u1ef1 ki\u1ebfn <span class="req">*</span></label><div class="iwrap" style="max-width:238px">${ic('calendar-days')}<input id="tf-date" type="date" class="input" value="${st.date}" min="2026-10-16" ${sent ? 'disabled' : ''}></div>
              <label class="lbl" style="padding-top:10px;font-weight:500">Gi\u1ea5y t\u1edd b\u1ed5 sung</label><div class="row" style="flex-wrap:wrap"><label class="btn btn-outline" style="position:relative;color:var(--blue-700);font-weight:500">${ic('paperclip')}Ch\u1ecdn t\u1ec7p \u0111\u00ednh k\u00e8m<input type="file" id="tf-file" accept=".pdf,.jpg,.jpeg,.png" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label><small class="muted" id="tf-fname">PDF, JPG, PNG (t\u1ed1i \u0111a 5MB)</small></div></div>
            <p class="err" id="tf-err" style="margin-top:10px" hidden></p>
            <div class="row" style="margin-top:20px"><button class="btn btn-red btn-lg" style="min-width:350px;font-size:16px" ${sent ? 'disabled' : ''}>${ic('send')}G\u1eedi y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng</button><button type="button" class="btn btn-outline-red btn-lg" data-go="sv-phong" style="min-width:138px">H\u1ee7y</button></div></form>
          <div class="card pad" style="padding:20px 18px"><h2 class="card-t" style="font-size:20px"><span style="color:var(--blue)">${ic('info', 'ic-lg')}</span>Th\u00f4ng tin c\u1ea7n bi\u1ebft</h2>
            <div style="background:#f2f6fc;border-radius:12px;padding:14px 16px;margin-top:12px"><div class="info-list" style="font-size:14.5px">${[['Ph\u00f2ng \u0111\u1ec1 ngh\u1ecb', tg.code], ['T\u1ea7ng', 'T\u1ea7ng ' + tg.khu], ['S\u1ee9c ch\u1ee9a', tg.beds + ' gi\u01b0\u1eddng'], ['S\u1ed1 sinh vi\u00ean hi\u1ec7n t\u1ea1i', K.occCount(tg.code) + ' sinh vi\u00ean'], ['Gi\u01b0\u1eddng c\u00f2n tr\u1ed1ng', b2(K.freeBeds(tg.code)) + ' gi\u01b0\u1eddng' + (freeBed ? ' (Gi\u01b0\u1eddng ' + b2(freeBed) + ')' : '')]].map(([a, b]) => `<div style="grid-template-columns:190px 1fr"><span>${a}</span><span style="color:var(--ink)">${b}</span></div>`).join('')}<div style="grid-template-columns:190px 1fr"><span>Tr\u1ea1ng th\u00e1i sau khi g\u1eedi</span><span style="color:var(--orange);display:flex;gap:8px;align-items:center">${ic('clock')}Ch\u1edd x\u00e9t duy\u1ec7t</span></div></div>
              <div class="row small muted" style="margin-top:10px;align-items:flex-start">${ic('info')}<span>Nh\u00e0 tr\u01b0\u1eddng s\u1ebd xem x\u00e9t y\u00eau c\u1ea7u trong 3 - 5 ng\u00e0y l\u00e0m vi\u1ec7c v\u00e0 th\u00f4ng b\u00e1o k\u1ebft qu\u1ea3 qua h\u1ec7 th\u1ed1ng.</span></div></div>
            <div style="background:#eaf2fd;border-radius:12px;padding:14px 16px;margin-top:12px;display:grid;grid-template-columns:1fr 150px;align-items:center;gap:10px"><div><b class="row" style="color:var(--navy);gap:10px">${ic('search')}T\u00ecm ph\u00f2ng kh\u00e1c</b><p class="small muted" style="margin:6px 0 10px 28px">Xem danh s\u00e1ch c\u00e1c ph\u00f2ng c\u00f2n tr\u1ed1ng \u0111\u1ec3 l\u1ef1a ch\u1ecdn ph\u00f9 h\u1ee3p v\u1edbi nhu c\u1ea7u c\u1ee7a b\u1ea1n.</p><button class="link" id="tf-other" style="margin-left:0;color:var(--blue-700)">${ic('arrow-right')}Xem ph\u00f2ng kh\u00e1c</button></div>${im('find_other', 'blend', '')}</div></div></div>`);
    },
    mount: (root) => {
      const st = App.st.transfer; const u = K.me();
      if (!u.room) return;
      const keep = () => { st.reason = root.querySelector('#tf-reason').value; st.text = root.querySelector('#tf-text').value; st.date = root.querySelector('#tf-date').value; };
      const fi = root.querySelector('#tf-file'); if (fi) fi.onchange = () => { root.querySelector('#tf-fname').textContent = fi.files[0] ? fi.files[0].name : 'PDF, JPG, PNG (t\u1ed1i \u0111a 5MB)'; };
      const c = root.querySelector('#tf-cancel'); if (c) c.onclick = () => App.confirm('H\u1ee7y y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng', 'B\u1ea1n ch\u1eafc ch\u1eafn mu\u1ed1n h\u1ee7y y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng \u0111\u00e3 g\u1eedi?', 'H\u1ee7y y\u00eau c\u1ea7u', () => { K.db.requests.transfer = null; K.db.applications = K.db.applications.filter((a) => !(a.student === u.id && a.kind === 'transfer' && a.status === 'cho-duyet')); K.save(); App.toast('\u0110\u00e3 h\u1ee7y y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng'); App.refresh(); }, true);
      root.querySelector('#tf-other').onclick = () => {
        keep();
        const rooms = K.db.rooms.filter((r) => r.code !== u.room && K.freeBeds(r.code) > 0 && !r.maint);
        App.modal({ title: 'Ch\u1ecdn ph\u00f2ng \u0111\u1ec1 ngh\u1ecb', wide: true, body: `<div class="row" style="margin-bottom:12px">${sel('pick-khu', [['', 'T\u1ea5t c\u1ea3 t\u1ea7ng'], ...App.khuOpts()], '')}</div><div class="tbl-wrap" style="max-height:52vh;overflow:auto"><table class="tbl hover"><thead><tr><th>Ph\u00f2ng</th><th>T\u1ea7ng</th><th>Lo\u1ea1i</th><th>C\u00f2n tr\u1ed1ng</th><th>Gi\u00e1</th><th></th></tr></thead><tbody id="pick-body">${rooms.map((r) => `<tr data-khu="${r.khu}"><td><b>${r.code}</b></td><td>T\u1ea7ng ${r.khu}</td><td>${r.beds} ng\u01b0\u1eddi</td><td>${K.freeBeds(r.code)} gi\u01b0\u1eddng</td><td>${money(r.price)}</td><td><button class="btn btn-sm btn-red" data-pick="${r.code}">Ch\u1ecdn</button></td></tr>`).join('')}</tbody></table></div>`,
          onMount: (el, close) => { el.querySelector('#pick-khu').onchange = (e) => el.querySelectorAll('#pick-body tr').forEach((tr) => tr.hidden = e.target.value && tr.dataset.khu !== e.target.value); el.querySelectorAll('[data-pick]').forEach((b) => b.onclick = () => { st.room = b.dataset.pick; st.text = st.text.replace(/ph\u00f2ng [A-C]\d{3}/, 'ph\u00f2ng ' + st.room); close(); App.refresh(); }); } });
      };
      root.querySelector('#tf-f').onsubmit = (e) => {
        e.preventDefault(); keep();
        const err = root.querySelector('#tf-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        if (st.text.trim().length < 20) return fail('N\u1ed9i dung \u0111\u1ec1 ngh\u1ecb c\u1ea7n t\u1ed1i thi\u1ec3u 20 k\u00fd t\u1ef1.');
        if (!st.date) return fail('Vui l\u00f2ng ch\u1ecdn ng\u00e0y chuy\u1ec3n d\u1ef1 ki\u1ebfn.');
        const bed = (K.bedMap(st.room).find((b) => b.free) || {}).bed;
        if (!bed) return fail('Ph\u00f2ng \u0111\u1ec1 ngh\u1ecb \u0111\u00e3 h\u1ebft gi\u01b0\u1eddng tr\u1ed1ng. H\u00e3y ch\u1ecdn ph\u00f2ng kh\u00e1c.');
        K.db.requests.transfer = { student: u.id, room: st.room, bed, reason: st.reason, text: st.text, date: K.now(), status: 'cho-duyet' };
        K.db.applications.push({ id: 'HS2026-' + String(40 + K.db.applications.length).padStart(4, '0'), student: u.id, type: 'Chuy\u1ec3n ph\u00f2ng (sang ' + st.room + ')', room: st.room, bed, term: '2026 \u2013 2027', period: 'T\u1eeb ' + st.date.split('-').reverse().join('/'), date: K.now(), status: 'cho-duyet', kind: 'transfer', docs: [{ name: '\u0110\u01a1n \u0111\u1ec1 ngh\u1ecb chuy\u1ec3n ph\u00f2ng', ok: true }], history: [{ t: 'Sinh vi\u00ean n\u1ed9p h\u1ed3 s\u01a1', d: K.now(), s: st.reason + '. ' + st.text }, { t: 'Ch\u1edd x\u00e9t duy\u1ec7t', d: K.now(), s: 'H\u1ed3 s\u01a1 \u0111ang ch\u1edd c\u00e1n b\u1ed9 qu\u1ea3n l\u00fd xem x\u00e9t.' }] });
        K.save(); App.toast('\u0110\u00e3 g\u1eedi y\u00eau c\u1ea7u chuy\u1ec3n ph\u00f2ng sang ' + st.room + '.'); App.refresh();
      };
    },
  };

  // ============ 17. Tr\u1ea3 ph\u00f2ng ============
  P['sv-tra-phong'] = {
    role: 'student', title: 'Y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-so', logo: 'inline', notif: 'dot', search: 'T\u00ecm d\u1ecbch v\u1ee5, th\u00f4ng b\u00e1o, h\u01b0\u1edbng d\u1eabn...', foot: 'card-email', sbw: 276, icons: { 'sv-phong': 'building', 'sv-hoa-don': 'badge-dollar-sign' } };
      if (!u.room) return noRoom(o);
      const r = K.room(u.room);
      const req = K.db.requests.checkout;
      const sent = req && req.student === u.id;
      const st = App.state('checkout', () => (K.db.drafts.checkout ? Object.assign({}, K.db.drafts.checkout) : { date: '2026-10-25', reason: 'K\u1ebft th\u00fac n\u0103m h\u1ecdc', note: '', agree: true }));
      const mates = K.occupants(r.code).sort((a, b) => (a.id === u.id ? -1 : b.id === u.id ? 1 : a.bed - b.bed));
      const assets = [['bed-double', 'Gi\u01b0\u1eddng'], ['columns-2', 'T\u1ee7 \u0111\u1ed3'], ['lamp-desk', 'B\u00e0n h\u1ecdc'], ['key-round', 'Ch\u00eca kh\u00f3a ph\u00f2ng']];
      const step = sent ? 2 : 1;
      const debt = myInvoices().filter((i) => i.status !== 'da-tt');
      return shell(o, `<div style="position:relative">${App.phead({ art: 'banner_checkout', h: 146, crumb: ['home', ['L\u01b0u tr\u00fa', 'sv-ho-so'], 'Tr\u1ea3 ph\u00f2ng'], title: 'Y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng', desc: 'G\u1eedi y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng \u0111\u1ec3 \u0111\u01b0\u1ee3c ki\u1ec3m tra ph\u00f2ng, \u0111\u1ed1i chi\u1ebfu c\u00f4ng n\u1ee3 v\u00e0 ho\u00e0n t\u1ea5t th\u1ee7 t\u1ee5c b\u00e0n giao.' })}<div style="max-width:690px;margin-top:6px">${stayTabs('sv-tra-phong', 'v2')}</div></div>
        <div class="card" style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;gap:12px;align-items:center;padding:12px 24px">${[['G\u1eedi y\u00eau c\u1ea7u', 'Sinh vi\u00ean g\u1eedi y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng'], ['Ki\u1ec3m tra ph\u00f2ng', 'C\u00e1n b\u1ed9 ki\u1ec3m tra hi\u1ec7n tr\u1ea1ng'], ['\u0110\u1ed1i chi\u1ebfu c\u00f4ng n\u1ee3', 'X\u00e1c nh\u1eadn c\u00e1c kho\u1ea3n ph\u00ed'], ['B\u00e0n giao', 'Ho\u00e0n t\u1ea5t v\u00e0 x\u00e1c nh\u1eadn tr\u1ea3 ph\u00f2ng']].map(([a, b], i) => `<div class="row"><span class="stepnum ${i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}" style="${i + 1 > step ? 'background:#fff' : ''}">${i + 1 < step ? ic('check') : i + 1}</span><div><b style="color:${i + 1 === step ? 'var(--red)' : 'var(--navy)'};font-size:15px;font-weight:600">${a}</b><div class="small muted">${b}</div></div></div>${i < 3 ? `<span style="color:#9fb0c9">${ic('arrow-right')}</span>` : ''}`).join('')}</div>
        <div class="grid resp-1" style="grid-template-columns:1.43fr 1fr;gap:16px;align-items:start">
          <div class="card pad" style="padding:16px 18px"><h2 style="font-size:20px">Th\u00f4ng tin y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng</h2>
            <div style="background:#eef4fc;border-radius:12px;padding:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px" class="resp-1">${[['user-round', 'Sinh vi\u00ean', u.name, u.id], ['building', 'Ph\u00f2ng hi\u1ec7n t\u1ea1i', r.code, 'T\u1ea7ng ' + r.khu], ['bed-double', 'Gi\u01b0\u1eddng', b2(u.bed), '(ph\u00f2ng ' + r.beds + ' ng\u01b0\u1eddi)']].map(([i, a, b, c]) => `<div class="row" style="gap:14px"><span class="ic-box" style="background:#fff;width:58px;height:58px">${ic(i)}</span><div><small class="muted">${a}</small><b style="display:block;color:var(--navy);font-size:19px">${esc(b)}</b><small class="muted">${c}</small></div></div>`).join('')}</div>
            <div class="grid g2" style="gap:16px;margin-top:14px"><div class="field"><label for="co-date" style="font-size:14px">Ng\u00e0y tr\u1ea3 ph\u00f2ng d\u1ef1 ki\u1ebfn <span class="req">*</span></label><div class="iwrap">${ic('calendar-days')}<input id="co-date" type="date" class="input" value="${st.date}" min="2026-10-16" ${sent ? 'disabled' : ''}></div></div><div class="field"><label for="co-reason" style="font-size:14px">L\u00fd do tr\u1ea3 ph\u00f2ng <span class="req">*</span></label>${sel('co-reason', ['K\u1ebft th\u00fac n\u0103m h\u1ecdc', 'T\u1ed1t nghi\u1ec7p', 'Chuy\u1ec3n ra ngo\u00e0i \u1edf', 'B\u1ea3o l\u01b0u / t\u1ea1m ngh\u1ec9 h\u1ecdc', 'L\u00fd do kh\u00e1c'], st.reason, '', sent ? 'disabled' : '')}</div></div>
            <div class="field" style="margin-top:12px"><label for="co-note" style="font-size:14px">Ghi ch\u00fa <span class="muted" style="font-weight:400">(kh\u00f4ng b\u1eaft bu\u1ed9c)</span></label><div style="position:relative"><textarea id="co-note" class="textarea" data-max="300" placeholder="Nh\u1eadp th\u00eam th\u00f4ng tin n\u1ebfu c\u00f3..." style="min-height:86px" ${sent ? 'disabled' : ''}>${esc(st.note)}</textarea><span class="counter">0/300</span></div></div>
            <h3 style="font-size:18px;margin:14px 0 8px">Danh s\u00e1ch t\u00e0i s\u1ea3n b\u00e0n giao</h3>
            <div class="tbl-wrap"><table class="tbl compact" style="font-size:13.5px"><thead><tr><th>T\u00e0i s\u1ea3n</th><th class="c">S\u1ed1 l\u01b0\u1ee3ng</th><th class="c">T\u00ecnh tr\u1ea1ng ki\u1ec3m tra</th><th class="c">Ghi ch\u00fa</th></tr></thead><tbody>${assets.map(([i, t]) => `<tr><td><span class="row" style="gap:14px"><span style="color:var(--blue-700)">${ic(i)}</span>${t}</span></td><td class="c">1</td><td class="c"><span class="badge b-orange b-sm">${ic('clock')}Ch\u1edd ki\u1ec3m tra</span></td><td class="c">-</td></tr>`).join('')}</tbody></table></div></div>
          <div class="card pad" style="padding:16px 18px"><h2 style="font-size:20px">T\u00f3m t\u1eaft b\u00e0n giao</h2>
            <div class="row" style="background:#eef4fc;border-radius:10px;padding:8px 10px;margin-top:10px">${im('ic_building_sm', '', '')}<div style="flex:1"><b style="color:var(--navy);font-size:17px">Ph\u00f2ng ${r.code}</b><div class="small muted">T\u1ea7ng ${r.khu}</div></div>${badge('\u0110ang \u1edf', 'green', { sm: true })}</div>
            <div class="grid g2" style="gap:8px;margin-top:8px"><div style="background:#eef4fc;border-radius:10px;padding:10px 14px"><small class="muted">S\u1ed1 ng\u01b0\u1eddi \u1edf</small><b style="display:block;font-size:20px;color:var(--navy)">${K.occCount(r.code)}</b><small class="muted">/ ${r.beds} ng\u01b0\u1eddi</small></div><div style="background:#eef4fc;border-radius:10px;padding:10px 14px"><small class="muted">S\u1ed1 gi\u01b0\u1eddng</small><b style="display:block;font-size:20px;color:var(--navy)">${r.beds}</b><small class="muted">/ ${r.beds} gi\u01b0\u1eddng</small></div></div>
            <b style="display:block;color:var(--navy);margin:12px 0 6px;font-size:15px">Danh s\u00e1ch ng\u01b0\u1eddi \u1edf ph\u00f2ng</b>
            <div>${mates.map((m) => `<div class="row" style="padding:6px 8px;border-radius:8px;${m.id === u.id ? 'background:#eaf2fd' : 'border-bottom:1px solid var(--line-2)'}">${av(m.avatar, 40)}<div style="flex:1"><b style="color:var(--navy);font-size:14px">${esc(m.name)}</b><div class="small muted">${m.id}</div></div><span class="badge b-blue b-sm">Gi\u01b0\u1eddng ${b2(m.bed)}</span><small style="width:70px;text-align:right;color:var(--ink)">${m.id === u.id ? 'C\u1ee7a b\u1ea1n' : ''}</small></div>`).join('')}</div>
            <b style="display:block;color:var(--navy);margin:12px 0 6px;font-size:15px">C\u00f4ng n\u1ee3 v\u00e0 chi ph\u00ed</b>
            <div class="row" style="align-items:flex-start;padding:4px 0"><span class="ic-box" style="width:38px;height:38px">${ic('file-text')}</span><div style="flex:1"><div class="row"><span style="width:90px">C\u00f4ng n\u1ee3</span>${badge('Ch\u1edd \u0111\u1ed1i chi\u1ebfu', 'orange', { icon: 'clock', sm: true })}</div><small class="muted">S\u1ebd \u0111\u01b0\u1ee3c ki\u1ec3m tra sau khi ki\u1ec3m tra ph\u00f2ng.${debt.length ? ' Hi\u1ec7n c\u00f2n ' + debt.length + ' h\u00f3a \u0111\u01a1n ch\u01b0a thanh to\u00e1n (' + money(debt.reduce((s, i) => s + i.total, 0)) + ').' : ''}</small></div></div>
            <div class="row" style="align-items:flex-start;padding:4px 0"><span class="ic-box" style="width:38px;height:38px">${ic('circle-dollar-sign')}</span><div style="flex:1"><div class="row"><span style="width:90px">Ti\u1ec1n c\u1ecdc ${ic('info')}</span><span class="badge b-gray b-sm">Theo th\u1ecfa thu\u1eadn</span></div><small class="muted">S\u1ed1 ti\u1ec1n ho\u00e0n c\u1ecdc (n\u1ebfu c\u00f3) s\u1ebd \u0111\u01b0\u1ee3c th\u00f4ng b\u00e1o sau khi ho\u00e0n t\u1ea5t b\u00e0n giao.</small></div></div></div></div>
        <div class="card" style="display:flex;align-items:center;gap:16px;padding:10px 12px 10px 22px;flex-wrap:wrap">${sent ? `<span class="row" style="flex:1;color:var(--ink)">${ic('clock')}\u0110\u00e3 g\u1eedi y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng l\u00fac ${req.date}. C\u00e1n b\u1ed9 s\u1ebd li\u00ean h\u1ec7 l\u1ecbch ki\u1ec3m tra ph\u00f2ng.</span><button class="btn btn-outline-red" id="co-cancel">H\u1ee7y y\u00eau c\u1ea7u</button>` : `<label class="check" style="flex:1;font-size:14px"><input type="checkbox" id="co-agree" ${st.agree ? 'checked' : ''}>T\u00f4i s\u1ebd ho\u00e0n t\u1ea5t v\u1ec7 sinh v\u00e0 b\u00e0n giao t\u00e0i s\u1ea3n tr\u01b0\u1edbc khi r\u1eddi kh\u1ecfi ph\u00f2ng.</label><button class="btn btn-outline" id="co-draft" style="min-width:180px;border-color:var(--line)">${ic('save')}L\u01b0u nh\u00e1p</button><button class="btn btn-red" id="co-send" style="min-width:280px">${ic('send')}G\u1eedi y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng</button>`}</div>`);
    },
    mount: (root) => {
      const st = App.st.checkout; const u = K.me();
      if (!u.room) return;
      const keep = () => { st.date = root.querySelector('#co-date').value; st.reason = root.querySelector('#co-reason').value; st.note = root.querySelector('#co-note').value; const a = root.querySelector('#co-agree'); if (a) st.agree = a.checked; };
      const d = root.querySelector('#co-draft'); if (d) d.onclick = () => { keep(); K.db.drafts.checkout = Object.assign({}, st); K.save(); App.toast('\u0110\u00e3 l\u01b0u nh\u00e1p y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng'); };
      const s = root.querySelector('#co-send'); if (s) s.onclick = () => {
        keep(); if (!st.date) return App.toast('Vui l\u00f2ng ch\u1ecdn ng\u00e0y tr\u1ea3 ph\u00f2ng', 'err'); if (!st.agree) return App.toast('Vui l\u00f2ng t\u00edch cam k\u1ebft b\u00e0n giao', 'err');
        App.confirm('G\u1eedi y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng', 'B\u1ea1n s\u1ebd tr\u1ea3 ph\u00f2ng <b>' + u.room + '</b> v\u00e0o ng\u00e0y <b>' + st.date.split('-').reverse().join('/') + '</b> v\u1edbi l\u00fd do \u201c' + esc(st.reason) + '\u201d.', 'G\u1eedi y\u00eau c\u1ea7u', () => {
          K.db.requests.checkout = { student: u.id, room: u.room, date: K.now(), on: st.date, reason: st.reason, note: st.note, status: 'cho-duyet' };
          K.db.applications.push({ id: 'HS2026-' + String(40 + K.db.applications.length).padStart(4, '0'), student: u.id, type: 'Tr\u1ea3 ph\u00f2ng (' + st.reason + ')', room: u.room, bed: u.bed, term: '2026 \u2013 2027', period: 'Ng\u00e0y ' + st.date.split('-').reverse().join('/'), date: K.now(), status: 'cho-duyet', kind: 'checkout', docs: [{ name: '\u0110\u01a1n tr\u1ea3 ph\u00f2ng', ok: true }], history: [{ t: 'Sinh vi\u00ean n\u1ed9p h\u1ed3 s\u01a1', d: K.now(), s: 'Y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng \u0111\u01b0\u1ee3c g\u1eedi l\u00ean h\u1ec7 th\u1ed1ng.' }, { t: 'Ch\u1edd x\u00e9t duy\u1ec7t', d: K.now(), s: 'Ch\u1edd ki\u1ec3m tra ph\u00f2ng.' }] });
          delete K.db.drafts.checkout; K.save(); App.toast('\u0110\u00e3 g\u1eedi y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng'); App.refresh();
        });
      };
      const c = root.querySelector('#co-cancel'); if (c) c.onclick = () => App.confirm('H\u1ee7y y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng', 'B\u1ea1n mu\u1ed1n h\u1ee7y y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng \u0111\u00e3 g\u1eedi?', 'H\u1ee7y y\u00eau c\u1ea7u', () => { K.db.requests.checkout = null; K.db.applications = K.db.applications.filter((a) => !(a.student === u.id && a.kind === 'checkout' && a.status === 'cho-duyet')); K.save(); App.toast('\u0110\u00e3 h\u1ee7y y\u00eau c\u1ea7u tr\u1ea3 ph\u00f2ng'); App.refresh(); }, true);
    },
  };

  // ============ 18. H\u1ed7 tr\u1ee3 & ph\u1ea3n \u00e1nh ============
  const FAQ = [
    ['file-text', 'Th\u1ee7 t\u1ee5c \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa', 'H\u01b0\u1edbng d\u1eabn h\u1ed3 s\u01a1, quy tr\u00ecnh \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa t\u1ea1i k\u00fd t\u00fac x\u00e1.', 'B\u01b0\u1edbc 1: Ch\u1ecdn ph\u00f2ng c\u00f2n ch\u1ed7 t\u1ea1i m\u1ee5c Ph\u00f2ng \u1edf.<br>B\u01b0\u1edbc 2: \u0110i\u1ec1n th\u00f4ng tin \u0111\u0103ng k\u00fd, t\u1ea3i gi\u1ea5y t\u1edd (gi\u1ea5y x\u00e1c nh\u1eadn sinh vi\u00ean, CCCD, \u1ea3nh 3x4).<br>B\u01b0\u1edbc 3: Ki\u1ec3m tra v\u00e0 g\u1eedi h\u1ed3 s\u01a1. Ban qu\u1ea3n l\u00fd duy\u1ec7t trong 3 \u2013 5 ng\u00e0y l\u00e0m vi\u1ec7c.<br>B\u01b0\u1edbc 4: X\u00e1c nh\u1eadn th\u1ecfa thu\u1eadn l\u01b0u tr\u00fa v\u00e0 nh\u1eadn ph\u00f2ng theo l\u1ecbch.', 'sv-dang-ky-luu-tru'],
    ['receipt-text', 'C\u00e1ch xem h\u00f3a \u0111\u01a1n', 'H\u01b0\u1edbng d\u1eabn tra c\u1ee9u v\u00e0 xem chi ti\u1ebft h\u00f3a \u0111\u01a1n ti\u1ec1n ph\u00f2ng.', 'V\u00e0o m\u1ee5c <b>H\u00f3a \u0111\u01a1n</b> \u1edf thanh b\u00ean tr\u00e1i \u0111\u1ec3 xem to\u00e0n b\u1ed9 h\u00f3a \u0111\u01a1n theo k\u1ef3. B\u1ea5m <b>Thanh to\u00e1n</b> \u0111\u1ec3 tr\u1ea3 b\u1eb1ng chuy\u1ec3n kho\u1ea3n, v\u00ed \u0111i\u1ec7n t\u1eed ho\u1eb7c t\u1ea1i qu\u1ea7y; b\u1ea5m <b>Xem bi\u00ean nh\u1eadn</b> v\u1edbi h\u00f3a \u0111\u01a1n \u0111\u00e3 thanh to\u00e1n.', 'sv-hoa-don'],
    ['arrow-left-right', 'Quy tr\u00ecnh chuy\u1ec3n ph\u00f2ng', 'C\u00e1c b\u01b0\u1edbc \u0111\u0103ng k\u00fd v\u00e0 x\u00e9t duy\u1ec7t chuy\u1ec3n ph\u00f2ng.', 'V\u00e0o <b>L\u01b0u tr\u00fa \u203a Chuy\u1ec3n ph\u00f2ng</b>, ch\u1ecdn ph\u00f2ng \u0111\u1ec1 ngh\u1ecb c\u00f2n ch\u1ed7, n\u00eau l\u00fd do v\u00e0 ng\u00e0y chuy\u1ec3n d\u1ef1 ki\u1ebfn. Ban qu\u1ea3n l\u00fd x\u00e9t duy\u1ec7t trong 3 \u2013 5 ng\u00e0y l\u00e0m vi\u1ec7c; khi \u0111\u01b0\u1ee3c duy\u1ec7t, gi\u01b0\u1eddng m\u1edbi s\u1ebd \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt t\u1ef1 \u0111\u1ed9ng.', 'sv-chuyen-phong'],
  ];
  P['sv-ho-tro'] = {
    role: 'student', title: 'H\u1ed7 tr\u1ee3 & ph\u1ea3n \u00e1nh',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-tro', logo: 'stack', notif: 'after', search: 'T\u00ecm d\u1ecbch v\u1ee5, th\u00f4ng b\u00e1o, h\u01b0\u1edbng d\u1eabn...', foot: 'card-only', sbw: 234, icons: { 'sv-ho-tro': 'message-square-warning', 'sv-phong': 'building', 'sv-hoa-don': 'file-text' } };
      const st = App.state('support', () => K.db.drafts.support ? Object.assign({}, K.db.drafts.support) : { type: 'Ph\u1ea3n \u00e1nh', title: 'Ph\u1ea3n \u00e1nh t\u00ecnh tr\u1ea1ng v\u1ec7 sinh khu v\u1ef1c t\u1ea7ng 3', body: 'K\u00ednh g\u1eedi Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1,\n\nEm xin ph\u1ea3n \u00e1nh v\u1ec1 t\u00ecnh tr\u1ea1ng v\u1ec7 sinh khu v\u1ef1c h\u00e0nh lang t\u1ea7ng 3 hi\u1ec7n ch\u01b0a \u0111\u1ea3m b\u1ea3o, c\u00f3 r\u00e1c t\u1ed3n \u0111\u1ecdng \u1edf g\u00f3c c\u1ea7u thang. Mong Ban qu\u1ea3n l\u00fd s\u1edbm ki\u1ec3m tra v\u00e0 c\u00f3 bi\u1ec7n ph\u00e1p x\u1eed l\u00fd \u0111\u1ec3 \u0111\u1ea3m b\u1ea3o m\u00f4i tr\u01b0\u1eddng sinh ho\u1ea1t s\u1ea1ch s\u1ebd cho sinh vi\u00ean.\n\nEm xin c\u1ea3m \u01a1n!', notify: true });
      const types = [['\u0110\u1ec1 ngh\u1ecb h\u1ed7 tr\u1ee3', 'life-buoy'], ['Ph\u1ea3n \u00e1nh', 'message-square-more'], ['G\u00f3p \u00fd', 'lightbulb']];
      const fb = K.db.feedback.filter((f) => f.student === K.db.session.id).slice(0, 4);
      return shell(o, `${App.phead({ art: 'banner_support', h: 192, crumb: ['home', ['Trang ch\u1ee7', 'sv-tong-quan'], 'H\u1ed7 tr\u1ee3'], title: 'H\u1ed7 tr\u1ee3 &amp; ph\u1ea3n \u00e1nh', desc: 'G\u1eedi ph\u1ea3n \u00e1nh, \u0111\u1ec1 ngh\u1ecb h\u1ed7 tr\u1ee3 ho\u1eb7c g\u00f3p \u00fd \u0111\u1ebfn Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1.<br>Ch\u00fang t\u00f4i lu\u00f4n l\u1eafng nghe v\u00e0 \u0111\u1ed3ng h\u00e0nh c\u00f9ng sinh vi\u00ean.' })}
        <div class="grid resp-1" style="grid-template-columns:1fr 0.93fr;gap:14px;align-items:start;margin-top:-12px">
          <form class="card pad" id="sp-f" novalidate style="padding:16px 20px 18px">
            <div class="row" style="gap:14px;align-items:flex-start"><span style="width:54px;height:54px;border-radius:50%;background:#fdecee;color:var(--red);display:grid;place-items:center;flex:none">${ic('pencil')}</span><div><h2 style="font-size:23px">G\u1eedi n\u1ed9i dung \u0111\u1ebfn ban qu\u1ea3n l\u00fd</h2><p style="margin-top:4px;color:var(--text);font-size:15px">Ch\u1ecdn lo\u1ea1i n\u1ed9i dung v\u00e0 cung c\u1ea5p th\u00f4ng tin chi ti\u1ebft \u0111\u1ec3 ch\u00fang t\u00f4i h\u1ed7 tr\u1ee3 b\u1ea1n t\u1ed1t nh\u1ea5t.</p></div></div>
            <div class="grid g3" style="gap:10px;margin-top:16px">${types.map(([t, i]) => `<button type="button" data-type="${t}" class="btn" style="height:58px;font-weight:500;font-size:16px;border:1.5px solid ${st.type === t ? 'var(--red)' : 'var(--line)'};background:${st.type === t ? '#fdecee' : '#fff'};color:${st.type === t ? 'var(--red)' : 'var(--ink)'}"><span style="color:${st.type === t ? 'var(--red)' : 'var(--blue)'}">${ic(i)}</span>${t}</button>`).join('')}</div>
            <div class="field" style="margin-top:14px"><label for="sp-title">Ch\u1ee7 \u0111\u1ec1 <span class="req">*</span></label><input id="sp-title" class="input" value="${esc(st.title)}" placeholder="Nh\u1eadp ch\u1ee7 \u0111\u1ec1 ng\u1eafn g\u1ecdn" maxlength="120"></div>
            <div class="field" style="margin-top:12px"><label for="sp-body">N\u1ed9i dung <span class="req">*</span></label><div style="position:relative"><textarea id="sp-body" class="textarea" data-max="1000" style="min-height:172px;font-size:14.5px" placeholder="M\u00f4 t\u1ea3 chi ti\u1ebft n\u1ed9i dung c\u1ea7n h\u1ed7 tr\u1ee3, ph\u1ea3n \u00e1nh ho\u1eb7c g\u00f3p \u00fd...">${esc(st.body)}</textarea><span class="counter">0/1000</span></div></div>
            <div class="field" style="margin-top:12px"><span class="lbl">\u0110\u00ednh k\u00e8m \u1ea3nh ho\u1eb7c t\u00e0i li\u1ec7u <small class="muted" style="font-weight:400">(kh\u00f4ng b\u1eaft bu\u1ed9c)</small></span><div><label class="drop" style="padding:18px"><span class="dz-ic" style="width:54px;height:54px">${ic('cloud-upload')}</span><span style="color:var(--ink)">Nh\u1ea5n \u0111\u1ec3 ch\u1ecdn \u1ea3nh ho\u1eb7c k\u00e9o th\u1ea3 v\u00e0o \u0111\u00e2y<br><small class="muted" style="font-size:11.5px">H\u1ed7 tr\u1ee3 \u0111\u1ecbnh d\u1ea1ng: JPG, PNG, PDF. Dung l\u01b0\u1ee3ng t\u1ed1i \u0111a 5MB.</small></span><input type="file" multiple accept=".jpg,.jpeg,.png,.pdf"></label></div></div>
            <label class="check" style="margin-top:14px;font-size:14.5px"><input type="checkbox" id="sp-notify" ${st.notify ? 'checked' : ''}>Nh\u1eadn ph\u1ea3n h\u1ed3i tr\u00ean c\u1ed5ng sinh vi\u00ean</label><small class="muted" style="display:block;margin:2px 0 0 30px">Khi c\u00f3 ph\u1ea3n h\u1ed3i m\u1edbi, b\u1ea1n s\u1ebd nh\u1eadn th\u00f4ng b\u00e1o trong h\u1ec7 th\u1ed1ng.</small>
            <p class="err" id="sp-err" hidden style="margin-top:8px"></p>
            <button class="btn btn-red" style="margin-top:12px;min-width:234px">${ic('send')}G\u1eedi ${st.type.toLowerCase()}</button></form>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="card pad" style="padding:16px 18px"><div class="row" style="gap:14px;align-items:flex-start"><span style="width:62px;height:62px;border-radius:50%;background:#eaf2fd;color:var(--blue-700);display:grid;place-items:center;flex:none">${ic('headphones', 'ic-lg')}</span><div><h2 style="font-size:23px">Ch\u00fang t\u00f4i c\u00f3 th\u1ec3 gi\u00fap g\u00ec?</h2><p class="muted" style="margin-top:4px;color:var(--text);line-height:1.5">D\u01b0\u1edbi \u0111\u00e2y l\u00e0 m\u1ed9t s\u1ed1 c\u00e2u h\u1ecfi th\u01b0\u1eddng g\u1eb7p. B\u1ea1n c\u0169ng c\u00f3 th\u1ec3 trao \u0111\u1ed5i tr\u1ef1c ti\u1ebfp v\u1edbi ban qu\u1ea3n l\u00fd khi c\u1ea7n h\u1ed7 tr\u1ee3 th\u00eam.</p></div></div>
              <div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">${FAQ.map(([i, t, s], k) => `<button class="card" data-faq="${k}" style="box-shadow:none;border:1px solid var(--line);padding:12px 16px;display:flex;gap:16px;align-items:center;text-align:left;cursor:pointer"><span style="width:48px;height:48px;border-radius:50%;background:${k === 1 ? '#fdecee' : '#eaf2fd'};color:${k === 1 ? 'var(--red)' : 'var(--blue-700)'};display:grid;place-items:center;flex:none">${ic(i)}</span><span style="flex:1"><b style="color:var(--navy);display:block">${t}</b><small class="muted">${s}</small></span>${ic('chevron-right')}</button>`).join('')}</div>
              <button class="btn btn-outline btn-block btn-lg" id="sp-chat" style="margin-top:12px;color:var(--blue-700);border-width:2px">${ic('message-circle-more')}Trao \u0111\u1ed5i v\u1edbi ban qu\u1ea3n l\u00fd</button></div>
            <div class="card pad" style="padding:16px 18px"><div class="card-h" style="margin-bottom:10px"><h2 class="card-t" style="font-size:22px"><span style="color:var(--red)">${ic('history', 'ic-lg')}</span>L\u1ecbch s\u1eed ph\u1ea3n \u00e1nh</h2><button class="link" id="sp-all" style="font-size:15px">Xem t\u1ea5t c\u1ea3 ${ic('arrow-right')}</button></div>
              <div class="tbl-wrap" style="border:0"><table class="tbl compact" style="font-size:13.5px"><thead><tr><th>Ng\u00e0y g\u1eedi</th><th>Ch\u1ee7 \u0111\u1ec1</th><th>Tr\u1ea1ng th\u00e1i</th><th>Thao t\u00e1c</th></tr></thead><tbody>${fb.slice(0, 2).map((f) => `<tr><td>${f.date}</td><td style="max-width:180px">${esc(f.title)}</td><td>${f.status === 'da-phan-hoi' ? badge('\u0110\u00e3 ph\u1ea3n h\u1ed3i', 'green', { icon: 'circle-check', sm: true }) : badge('\u0110ang ti\u1ebfp nh\u1eadn', 'orange', { icon: 'clock', sm: true })}</td><td><button class="link" data-fb="${f.id}" style="font-size:13.5px">Xem chi ti\u1ebft ${ic('arrow-right')}</button></td></tr>`).join('')}</tbody></table></div></div>
          </div></div>`);
    },
    mount: (root) => {
      const st = App.st.support;
      const keep = () => { st.title = root.querySelector('#sp-title').value; st.body = root.querySelector('#sp-body').value; st.notify = root.querySelector('#sp-notify').checked; };
      root.querySelectorAll('[data-type]').forEach((b) => b.onclick = () => { keep(); st.type = b.dataset.type; App.refresh(); });
      root.querySelectorAll('[data-faq]').forEach((b) => b.onclick = () => { const f = FAQ[+b.dataset.faq]; App.modal({ title: f[1], body: `<p style="line-height:1.8">${f[3]}</p>`, foot: `<button class="btn btn-outline" data-x>\u0110\u00f3ng</button><button class="btn btn-red" data-goto>\u0110i t\u1edbi trang</button>`, onMount: (el, close) => el.querySelector('[data-goto]').onclick = () => { close(); App.go(f[4]); } }); });
      const showFb = (f) => App.modal({ title: f.title, body: `<div class="row" style="margin-bottom:12px"><span class="badge b-blue b-sm">${f.type}</span><small class="muted">G\u1eedi ng\u00e0y ${f.date}</small></div><p style="line-height:1.7;white-space:pre-line">${esc(f.body)}</p>${f.reply ? `<div style="background:var(--green-50);border-radius:10px;padding:12px 14px;margin-top:14px"><b style="color:var(--green)">Ph\u1ea3n h\u1ed3i c\u1ee7a Ban qu\u1ea3n l\u00fd</b><p style="margin-top:6px">${esc(f.reply)}</p></div>` : `<p class="muted" style="margin-top:14px">Ban qu\u1ea3n l\u00fd \u0111ang ti\u1ebfp nh\u1eadn v\u00e0 s\u1ebd ph\u1ea3n h\u1ed3i s\u1edbm.</p>`}`, foot: '<button class="btn btn-red" data-x>\u0110\u00f3ng</button>' });
      root.querySelectorAll('[data-fb]').forEach((b) => b.onclick = () => showFb(K.db.feedback.find((f) => f.id === b.dataset.fb)));
      root.querySelector('#sp-all').onclick = () => App.modal({ title: 'L\u1ecbch s\u1eed ph\u1ea3n \u00e1nh', wide: true, body: `<div class="tbl-wrap"><table class="tbl hover"><thead><tr><th>Ng\u00e0y g\u1eedi</th><th>Lo\u1ea1i</th><th>Ch\u1ee7 \u0111\u1ec1</th><th>Tr\u1ea1ng th\u00e1i</th></tr></thead><tbody>${K.db.feedback.filter((f) => f.student === K.db.session.id).map((f) => `<tr data-fb2="${f.id}"><td>${f.date}</td><td>${f.type}</td><td>${esc(f.title)}</td><td>${f.status === 'da-phan-hoi' ? badge('\u0110\u00e3 ph\u1ea3n h\u1ed3i', 'green', { sm: true }) : badge('\u0110ang ti\u1ebfp nh\u1eadn', 'orange', { sm: true })}</td></tr>`).join('')}</tbody></table></div>`, onMount: (el, close) => el.querySelectorAll('[data-fb2]').forEach((tr) => tr.onclick = () => { close(); showFb(K.db.feedback.find((f) => f.id === tr.dataset.fb2)); }) });
      root.querySelector('#sp-chat').onclick = () => {
        const sid = K.db.session.id; K.db.chats = K.db.chats || {}; const msgs = K.db.chats[sid] = K.db.chats[sid] || [{ me: false, t: 'Xin ch\u00e0o! Ban qu\u1ea3n l\u00fd KTX c\u00f3 th\u1ec3 h\u1ed7 tr\u1ee3 g\u00ec cho b\u1ea1n?', d: K.now() }];
        const render = (el) => { const box = el.querySelector('#cbox'); box.innerHTML = msgs.map((m) => `<div style="display:flex;justify-content:${m.me ? 'flex-end' : 'flex-start'}"><div style="max-width:78%;background:${m.me ? 'var(--red)' : '#eef3f9'};color:${m.me ? '#fff' : 'var(--ink)'};padding:10px 14px;border-radius:14px;font-size:14.5px">${esc(m.t)}</div></div>`).join(''); box.scrollTop = 1e6; };
        App.modal({ title: 'Trao \u0111\u1ed5i v\u1edbi ban qu\u1ea3n l\u00fd', body: `<div id="cbox" style="height:300px;overflow:auto;display:flex;flex-direction:column;gap:8px;padding:4px"></div><p class="muted small" style="margin-top:8px">C\u00e1n b\u1ed9 tr\u1ef1c ph\u1ea3n h\u1ed3i trong gi\u1edd h\u00e0nh ch\u00ednh (7:30 \u2013 17:00). C\u00e2u tr\u1ea3 l\u1eddi s\u1ebd hi\u1ec7n t\u1ea1i \u0111\u00e2y.</p><form id="cf" class="row" style="margin-top:8px"><input id="ci" class="input" placeholder="Nh\u1eadp tin nh\u1eafn..." style="flex:1"><button class="btn btn-red">${ic('send')}</button></form>`,
          onMount: (el) => { render(el); el.querySelector('#cf').onsubmit = (e) => { e.preventDefault(); const v = el.querySelector('#ci').value.trim(); if (!v) return; msgs.push({ me: true, t: v, d: K.now(), unread: true }); el.querySelector('#ci').value = ''; render(el); K.save(); }; } });
      };
      root.querySelector('#sp-f').onsubmit = (e) => {
        e.preventDefault(); keep();
        const err = root.querySelector('#sp-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        if (!st.title.trim()) return fail('Vui l\u00f2ng nh\u1eadp ch\u1ee7 \u0111\u1ec1.');
        if (st.body.trim().length < 20) return fail('N\u1ed9i dung c\u1ea7n t\u1ed1i thi\u1ec3u 20 k\u00fd t\u1ef1.');
        const n = K.db.feedback.length + 13;
        K.db.feedback.unshift({ id: 'PA-' + n, date: K.today(), title: st.title.trim(), type: st.type, status: 'dang-tiep-nhan', body: st.body.trim(), student: K.db.session.id });
        delete K.db.drafts.support; App.st.support = { type: 'Ph\u1ea3n \u00e1nh', title: '', body: '', notify: true }; K.save();
        App.toast('\u0110\u00e3 g\u1eedi ' + st.type.toLowerCase() + ' \u0111\u1ebfn Ban qu\u1ea3n l\u00fd.'); App.refresh();
      };
    },
  };

  // ============ 19. Th\u00f4ng b\u00e1o ============
  P['sv-thong-bao'] = {
    role: 'student', title: 'Th\u00f4ng b\u00e1o',
    render: () => {
      const o = { active: 'sv-thong-bao', logo: 'inline', notif: 'none', search: 'T\u00ecm th\u00f4ng b\u00e1o, s\u1ef1 ki\u1ec7n...', foot: 'card-down', sbw: 286, icons: { 'sv-phong': 'building', 'sv-hoa-don': 'receipt-text' } };
      const st = App.state('sv-thong-bao', { tab: 'all', q: '', sel: null });
      const all = App.myNotes();
      let list = st.tab === 'unread' ? all.filter((n) => !n.read) : st.tab === 'stay' ? all.filter((n) => n.cat === 'L\u01b0u tr\u00fa') : st.tab === 'act' ? all.filter((n) => n.cat === 'Ho\u1ea1t \u0111\u1ed9ng') : all;
      if (st.q) list = list.filter((n) => (n.title + ' ' + n.summary).toLowerCase().includes(st.q.toLowerCase()));
      const cur = all.find((n) => n.id === st.sel) || list[0] || all[0];
      st.cur = cur && cur.id;
      const saved = cur && cur.saved;
      return shell(o, `<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap"><div>${App.crumb([['Trang ch\u1ee7', 'sv-tong-quan'], 'Th\u00f4ng b\u00e1o'])}<h1 style="font-size:44px;font-weight:800;margin-top:10px">Th\u00f4ng b\u00e1o</h1><p class="desc" style="font-size:18px;color:#4a5a7e;margin-top:4px">C\u1eadp nh\u1eadt nhanh c\u00e1c th\u00f4ng tin, s\u1ef1 ki\u1ec7n t\u1eeb Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1.</p></div><button class="btn btn-outline" id="nt-all" style="height:50px;border-color:var(--line);font-size:16px">${ic('mail')}\u0110\u00e1nh d\u1ea5u t\u1ea5t c\u1ea3 \u0111\u00e3 \u0111\u1ecdc</button></div>
        <div class="pills">${[['all', 'T\u1ea5t c\u1ea3 (' + all.length + ')'], ['unread', 'Ch\u01b0a \u0111\u1ecdc (' + all.filter((n) => !n.read).length + ')'], ['stay', 'L\u01b0u tr\u00fa (' + all.filter((n) => n.cat === 'L\u01b0u tr\u00fa').length + ')'], ['act', 'Ho\u1ea1t \u0111\u1ed9ng (' + all.filter((n) => n.cat === 'Ho\u1ea1t \u0111\u1ed9ng').length + ')']].map(([k, t]) => `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}" style="border-radius:999px;height:46px;padding:0 26px;font-size:16px">${t}</button>`).join('')}</div>
        <div class="grid resp-1" style="grid-template-columns:494px 1fr;gap:6px;align-items:start">
          <div class="card" style="padding:18px 10px;border-radius:16px 0 0 16px"><div class="iwrap" style="margin:0 8px 18px">${ic('search')}<input id="nt-q" class="input" placeholder="T\u00ecm trong danh s\u00e1ch th\u00f4ng b\u00e1o..." value="${esc(st.q)}" style="height:50px"></div>
            <div style="display:flex;flex-direction:column;max-height:560px;overflow:auto">${list.map((n) => `<button data-n="${n.id}" style="display:grid;grid-template-columns:64px 1fr auto;gap:14px;text-align:left;padding:14px 12px;border-radius:12px;border:${cur && cur.id === n.id ? '1.5px solid #bcd3f5;background:#eaf2fd' : '1.5px solid transparent;border-bottom-color:var(--line-2);background:#fff'};cursor:pointer;margin-bottom:6px">${im(n.icon, 'blend', '')}<span><b style="color:var(--navy);font-size:17px;display:flex;align-items:center;gap:10px">${esc(n.title)}${n.read ? '' : '<i style="width:10px;height:10px;border-radius:50%;background:var(--red);display:inline-block"></i>'}</b><small style="display:block;color:var(--text);font-size:14.5px;margin-top:6px;line-height:1.55">${esc(n.summary)}</small></span><span style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between"><small class="muted" style="white-space:nowrap">${esc(n.time)}</small>${ic('chevron-right')}</span></button>`).join('') || '<p class="muted" style="padding:20px;text-align:center">Kh\u00f4ng c\u00f3 th\u00f4ng b\u00e1o ph\u00f9 h\u1ee3p.</p>'}</div></div>
          ${cur ? `<article class="card" style="padding:20px 26px;border-radius:0 16px 16px 0"><span class="badge b-red" style="border-radius:6px;font-weight:500">${cur.cat}</span><h2 style="font-size:31px;margin-top:12px">${esc(cur.title)}</h2><div class="row" style="margin-top:10px;color:var(--text)">${ic('users')}${esc(cur.author)} <span style="margin:0 6px">\u00b7</span> ${esc(cur.month)}</div>
            ${cur.img ? `<img src="${K.A(cur.img)}" style="width:100%;height:284px;object-fit:cover;border-radius:8px;margin-top:14px" alt="">` : ''}
            <div style="margin-top:16px;display:flex;flex-direction:column;gap:10px;color:var(--text);font-size:16px;line-height:1.6">${cur.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
            <hr class="hr"><div class="row"><button class="btn btn-red btn-lg" id="nt-read" style="min-width:226px;font-size:16px" ${cur.read && st.justRead !== cur.id ? '' : ''}>${ic('circle-check')}${cur.read ? '\u0110\u00e3 \u0111\u1ecdc' : '\u0110\u00e1nh d\u1ea5u \u0111\u00e3 \u0111\u1ecdc'}</button><button class="btn btn-outline btn-lg" id="nt-save" style="border-color:var(--line);font-size:16px">${ic(saved ? 'bookmark-check' : 'bookmark')}${saved ? '\u0110\u00e3 l\u01b0u' : 'L\u01b0u th\u00f4ng b\u00e1o'}</button></div></article>` : ''}</div>`);
    },
    mount: (root) => {
      const st = App.st['sv-thong-bao'];
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; st.sel = null; App.refresh(); });
      root.querySelectorAll('[data-n]').forEach((b) => b.onclick = () => { st.sel = b.dataset.n; const n = K.db.notifications.find((x) => x.id === st.sel); if (n && !n.read) { n.read = true; K.save(); } App.refresh(); });
      const q = root.querySelector('#nt-q'); q.oninput = () => { clearTimeout(st.t); st.t = setTimeout(() => { st.q = q.value; App.refresh(); const n = document.getElementById('nt-q'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); };
      root.querySelector('#nt-all').onclick = () => { App.myNotes().forEach((n) => n.read = true); K.save(); App.toast('\u0110\u00e3 \u0111\u00e1nh d\u1ea5u t\u1ea5t c\u1ea3 l\u00e0 \u0111\u00e3 \u0111\u1ecdc'); App.refresh(); };
      const cur = K.db.notifications.find((n) => n.id === st.cur);
      const rd = root.querySelector('#nt-read'); if (rd) rd.onclick = () => { cur.read = !cur.read ? true : cur.read; K.save(); App.toast('\u0110\u00e3 \u0111\u00e1nh d\u1ea5u \u0111\u00e3 \u0111\u1ecdc'); st.sel = cur.id; App.refresh(); };
      const sv = root.querySelector('#nt-save'); if (sv) sv.onclick = () => { cur.saved = !cur.saved; K.save(); App.toast(cur.saved ? '\u0110\u00e3 l\u01b0u th\u00f4ng b\u00e1o' : '\u0110\u00e3 b\u1ecf l\u01b0u th\u00f4ng b\u00e1o'); st.sel = cur.id; App.refresh(); };
    },
  };

  // ============ 20. T\u00e0i kho\u1ea3n ============
  P['sv-tai-khoan'] = {
    role: 'student', title: 'T\u00e0i kho\u1ea3n c\u1ee7a t\u00f4i',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-tai-khoan', logo: 'inline', notif: 'dot', search: 'T\u00ecm ki\u1ebfm d\u1ecbch v\u1ee5, th\u00f4ng b\u00e1o...', foot: 'card-only', sbw: 270 };
      const st = App.state('account', { tab: 'profile' });
      const r = u.room ? K.room(u.room) : null;
      const mask = (p) => p ? p.slice(0, 2) + '\u2022\u2022 \u2022\u2022\u2022 ' + p.slice(-3) : '';
      let main;
      if (st.tab === 'profile') main = `<form class="card pad" id="ac-f" novalidate style="padding:22px 20px">
          <div class="card-h"><h2 style="font-size:22px;display:flex;align-items:center;gap:14px"><i style="width:5px;height:28px;border-radius:3px;background:var(--red);display:inline-block"></i>Th\u00f4ng tin c\u00e1 nh\u00e2n</h2><small class="muted">C\u1eadp nh\u1eadt th\u00f4ng tin \u0111\u1ec3 h\u1ed3 s\u01a1 lu\u00f4n ch\u00ednh x\u00e1c.</small></div>
          <div style="display:grid;grid-template-columns:190px 1fr;gap:20px" class="resp-1"><div style="text-align:center"><div style="position:relative;width:165px;margin:0 auto">${im(u.big || 'av_tuananh_big', 'av', '')}<label style="position:absolute;right:4px;bottom:4px;width:44px;height:44px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;border:3px solid #fff;cursor:pointer">${ic('camera')}<input type="file" accept="image/*" id="ac-photo" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label></div><label class="btn btn-soft" style="margin-top:14px;width:162px;position:relative;color:var(--navy)">${ic('camera')}\u0110\u1ed5i \u1ea3nh<input type="file" accept="image/*" id="ac-photo2" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label></div>
            <div class="grid" style="grid-template-columns:1fr 1fr;gap:16px 22px">
              <div class="field"><label>M\u00e3 sinh vi\u00ean</label><input class="input ro" readonly value="${u.id}" style="background:#eef1f5;color:var(--muted)"></div>
              <div class="field"><label for="ac-name">H\u1ecd v\u00e0 t\u00ean <span class="req">*</span></label><input id="ac-name" class="input" value="${esc(u.name)}"></div>
              <div class="field"><label for="ac-fac">Khoa <span class="req">*</span></label>${sel('ac-fac', ['C\u00f4ng ngh\u1ec7 th\u00f4ng tin', 'Kinh t\u1ebf', 'Ngo\u1ea1i ng\u1eef', 'S\u01b0 ph\u1ea1m', '\u0110i\u1ec7n \u2013 \u0110i\u1ec7n t\u1eed', 'X\u00e2y d\u1ef1ng'], u.faculty)}</div>
              <div class="field"><label for="ac-cls">L\u1edbp <span class="req">*</span></label>${sel('ac-cls', ['CNTT K26', 'CNTT K25', 'KT K26', 'NN K26', 'SP K25', '\u0110\u0110T K26', 'XD K26'], u.cls)}</div>
              <div class="field"><label>Email <span class="req">*</span></label><input class="input ro" readonly value="${esc(u.email)}" style="background:#eef1f5"></div>
              <div class="field"><label>S\u1ed1 \u0111i\u1ec7n tho\u1ea1i <span class="req">*</span></label><input class="input ro" readonly value="${mask(u.phone)}" style="background:#eef1f5"></div></div></div>
          <hr class="hr" style="margin:22px 0 16px">
          <h2 style="font-size:21px;display:flex;align-items:center;gap:14px"><i style="width:5px;height:28px;border-radius:3px;background:var(--blue);display:inline-block"></i>Li\u00ean h\u1ec7 kh\u1ea9n c\u1ea5p</h2><p class="muted small" style="margin:4px 0 14px 20px">Th\u00f4ng tin n\u00e0y s\u1ebd \u0111\u01b0\u1ee3c s\u1eed d\u1ee5ng khi c\u1ea7n li\u00ean h\u1ec7 trong c\u00e1c tr\u01b0\u1eddng h\u1ee3p kh\u1ea9n c\u1ea5p.</p>
          <div class="grid g3" style="gap:20px"><div class="field"><label for="ac-en">H\u1ecd v\u00e0 t\u00ean <span class="req">*</span></label><input id="ac-en" class="input" placeholder="Nh\u1eadp h\u1ecd v\u00e0 t\u00ean ng\u01b0\u1eddi li\u00ean h\u1ec7" value="${esc(u.emergency.name)}"></div><div class="field"><label for="ac-er">M\u1ed1i quan h\u1ec7 <span class="req">*</span></label>${sel('ac-er', [['', 'Ch\u1ecdn m\u1ed1i quan h\u1ec7'], 'B\u1ed1', 'M\u1eb9', 'Anh/Ch\u1ecb/Em', 'Ng\u01b0\u1eddi gi\u00e1m h\u1ed9', 'Kh\u00e1c'], u.emergency.relation)}</div><div class="field"><label for="ac-ep">S\u1ed1 \u0111i\u1ec7n tho\u1ea1i <span class="req">*</span></label><input id="ac-ep" class="input" placeholder="Nh\u1eadp s\u1ed1 \u0111i\u1ec7n tho\u1ea1i" value="${esc(u.emergency.phone)}" inputmode="tel"></div></div>
          <p class="err" id="ac-err" hidden style="margin-top:10px"></p>
          <div class="row" style="justify-content:flex-end;margin-top:20px"><button type="button" class="btn btn-soft btn-lg" id="ac-cancel" style="min-width:170px;color:var(--navy)">H\u1ee7y</button><button class="btn btn-red btn-lg" style="min-width:170px">L\u01b0u thay \u0111\u1ed5i</button></div></form>`;
      else if (st.tab === 'security') main = `<div class="card pad" style="padding:22px 24px"><h2 style="font-size:22px">\u0110\u1ed5i m\u1eadt kh\u1ea9u</h2><form id="pw-f" novalidate class="grid" style="grid-template-columns:1fr;gap:14px;max-width:480px;margin-top:16px">
          <div class="field"><label for="pw-o">M\u1eadt kh\u1ea9u hi\u1ec7n t\u1ea1i</label><div class="iwrap">${ic('lock-keyhole')}<input id="pw-o" type="password" class="input"></div></div>
          <div class="field"><label for="pw-n">M\u1eadt kh\u1ea9u m\u1edbi</label><div class="iwrap">${ic('lock-keyhole')}<input id="pw-n" type="password" class="input" placeholder="T\u1ed1i thi\u1ec3u 8 k\u00fd t\u1ef1"></div></div>
          <div class="field"><label for="pw-n2">Nh\u1eadp l\u1ea1i m\u1eadt kh\u1ea9u m\u1edbi</label><div class="iwrap">${ic('lock-keyhole')}<input id="pw-n2" type="password" class="input"></div></div><p class="err" id="pw-err" hidden></p><button class="btn btn-red" style="justify-self:start">C\u1eadp nh\u1eadt m\u1eadt kh\u1ea9u</button></form>
          <hr class="hr" style="margin:24px 0"><h2 style="font-size:22px">Phi\u00ean \u0111\u0103ng nh\u1eadp</h2><div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><thead><tr><th>Thi\u1ebft b\u1ecb</th><th>V\u1ecb tr\u00ed</th><th>L\u1ea7n cu\u1ed1i</th><th></th></tr></thead><tbody>${(K.db.sessions || [{ id: 1, d: 'Tr\u00ecnh duy\u1ec7t hi\u1ec7n t\u1ea1i', loc: 'Vinh, Ngh\u1ec7 An', t: '\u0110ang ho\u1ea1t \u0111\u1ed9ng', cur: true }, { id: 2, d: 'iPhone 13 \u00b7 Safari', loc: 'Vinh, Ngh\u1ec7 An', t: '14/10/2026 21:10' }, { id: 3, d: 'Laptop \u00b7 Chrome', loc: 'H\u00e0 N\u1ed9i', t: '02/10/2026 08:45' }]).map((s) => `<tr><td><span class="row">${ic(s.d.includes('iPhone') ? 'smartphone' : 'monitor')}${s.d}</span></td><td>${s.loc}</td><td>${s.cur ? badge('\u0110ang ho\u1ea1t \u0111\u1ed9ng', 'green', { dot: true, sm: true }) : s.t}</td><td>${s.cur ? '' : `<button class="btn btn-sm btn-outline-red" data-sess="${s.id}">\u0110\u0103ng xu\u1ea5t</button>`}</td></tr>`).join('')}</tbody></table></div></div>`;
      else main = `<div class="card pad" style="padding:22px 24px"><div class="card-h"><h2 style="font-size:22px">Gi\u1ea5y t\u1edd c\u1ee7a t\u00f4i</h2><label class="btn btn-red" style="position:relative">${ic('upload')}T\u1ea3i l\u00ean gi\u1ea5y t\u1edd<input type="file" id="doc-up" accept=".pdf,.jpg,.jpeg,.png" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label></div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Lo\u1ea1i gi\u1ea5y t\u1edd</th><th>T\u1ec7p</th><th>Ng\u00e0y c\u1eadp nh\u1eadt</th><th>Tr\u1ea1ng th\u00e1i</th></tr></thead><tbody>${(u.docs || [{ n: 'Gi\u1ea5y x\u00e1c nh\u1eadn sinh vi\u00ean', f: 'xac_nhan_sv.pdf', d: '12/09/2026', ok: true }, { n: 'CCCD (b\u1ea3n sao)', f: 'cccd.jpg', d: '12/09/2026', ok: true }, { n: '\u1ea2nh th\u1ebb 3x4', f: 'anh_the.png', d: '12/09/2026', ok: true }, { n: '\u0110\u01a1n \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa', f: 'don_dang_ky.pdf', d: '12/09/2026', ok: true }]).map((d) => `<tr><td>${esc(d.n)}</td><td><span class="row" style="color:var(--red)">${ic('file-text')}<span style="color:var(--blue)">${esc(d.f)}</span></span></td><td>${d.d}</td><td>${d.ok ? badge('\u0110\u00e3 duy\u1ec7t', 'green', { icon: 'circle-check', sm: true }) : badge('Ch\u1edd duy\u1ec7t', 'orange', { sm: true })}</td></tr>`).join('')}</tbody></table></div></div>`;
      return shell(o, `${App.phead({ art: 'banner_account', h: 170, crumb: [['Trang ch\u1ee7', 'sv-tong-quan'], 'T\u00e0i kho\u1ea3n'], title: 'T\u00e0i kho\u1ea3n c\u1ee7a t\u00f4i', desc: 'Qu\u1ea3n l\u00fd th\u00f4ng tin c\u00e1 nh\u00e2n, b\u1ea3o m\u1eadt v\u00e0 gi\u1ea5y t\u1edd c\u1ee7a b\u1ea1n.' })}
        <div class="card" style="display:inline-flex;gap:4px;padding:10px 12px;align-self:flex-start;margin-top:-10px">${[['profile', 'H\u1ed3 s\u01a1 c\u00e1 nh\u00e2n', 'user-round'], ['security', 'B\u1ea3o m\u1eadt', 'shield'], ['docs', 'Gi\u1ea5y t\u1edd', 'file-text']].map(([k, t, i]) => `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}" style="border:0;height:42px;font-size:16px;${st.tab === k ? '' : 'background:transparent'}">${ic(i)}${t}</button>`).join('')}</div>
        <div class="grid resp-1" style="grid-template-columns:1fr 470px;gap:18px;align-items:start">${main}
          <div style="display:flex;flex-direction:column;gap:18px">
            <div class="card pad" style="padding:20px 20px"><div class="card-h"><h2 class="card-t" style="font-size:21px"><span style="color:var(--red)">${ic('bed-double', 'ic-lg')}</span>Th\u00f4ng tin l\u01b0u tr\u00fa</h2><a href="#" class="link" data-go="sv-ho-so" style="font-size:14.5px">Xem th\u1ecfa thu\u1eadn ${ic('arrow-right')}</a></div>
              ${r ? `<div style="background:#eef4fc;border-radius:12px;padding:12px;"><div style="display:grid;grid-template-columns:154px 1fr;gap:20px;align-items:center">${im('stay_thumb', '', '')}<div>${badge('\u0110ang l\u01b0u tr\u00fa', 'green', { dot: true })}<b style="display:block;color:var(--navy);font-size:30px;margin-top:10px">${r.code}</b></div></div>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);margin-top:12px;font-size:14px" class="muted">${[['layers', 'T\u1ea7ng', 'T\u1ea7ng ' + r.khu], ['bed-double', 'Gi\u01b0\u1eddng', b2(u.bed)], ['users', 'S\u1ed1 ng\u01b0\u1eddi', K.occCount(r.code) + '/' + r.beds]].map(([i, a, b], k) => `<div class="row" style="${k ? 'border-left:1px solid var(--line);padding-left:12px' : ''}">${ic(i)}<span>${a}<b style="display:block;color:var(--navy);font-size:17px">${b}</b></span></div>`).join('')}</div></div>
              <div class="row" style="margin-top:12px;padding:0 12px">${ic('calendar-days')}<span class="muted">N\u0103m h\u1ecdc<b style="display:block;color:var(--navy);font-size:17px">2026 \u2013 2027</b></span></div>` : `<p class="muted">B\u1ea1n ch\u01b0a c\u00f3 ph\u00f2ng.</p>`}</div>
            <div class="card pad" style="padding:18px 20px;overflow:hidden"><div style="display:grid;grid-template-columns:1fr 180px;gap:6px"><div><h2 class="card-t" style="font-size:20px"><span style="color:var(--red)">${ic('shield-half', 'ic-lg')}</span>B\u1ea3o m\u1eadt t\u00e0i kho\u1ea3n</h2><p class="muted" style="font-size:14px;margin-top:8px;color:var(--text)">B\u1ea3o v\u1ec7 t\u00e0i kho\u1ea3n \u0111\u1ec3 \u0111\u1ea3m b\u1ea3o an to\u00e0n th\u00f4ng tin c\u00e1 nh\u00e2n.</p></div>${im('sec_art', 'blend', '')}</div>
              <button class="card" data-tab="security" style="box-shadow:none;border:1px solid var(--line);padding:12px 16px;display:flex;gap:16px;align-items:center;text-align:left;width:100%;cursor:pointer;margin-top:4px">${ic('lock-keyhole')}<span style="flex:1"><b style="color:var(--navy);display:block">\u0110\u1ed5i m\u1eadt kh\u1ea9u</b><small class="muted">C\u1eadp nh\u1eadt m\u1eadt kh\u1ea9u \u0111\u1ecbnh k\u1ef3 \u0111\u1ec3 t\u0103ng b\u1ea3o m\u1eadt.</small></span>${ic('chevron-right')}</button>
              <button class="card" data-tab="security" style="box-shadow:none;border:1px solid var(--line);padding:12px 16px;display:flex;gap:16px;align-items:center;text-align:left;width:100%;cursor:pointer;margin-top:10px">${ic('monitor-smartphone')}<span style="flex:1"><b style="color:var(--navy);display:block">Qu\u1ea3n l\u00fd phi\u00ean \u0111\u0103ng nh\u1eadp</b><small class="muted">Xem v\u00e0 \u0111\u0103ng xu\u1ea5t c\u00e1c thi\u1ebft b\u1ecb kh\u00e1c.</small></span>${ic('chevron-right')}</button></div>
          </div></div>`);
    },
    mount: (root) => {
      const st = App.st.account; const u = K.me();
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      root.querySelectorAll('#ac-photo, #ac-photo2').forEach((inp) => inp.onchange = () => {
        const f = inp.files[0]; if (!f) return; if (!/^image\//.test(f.type)) return App.toast('Vui l\u00f2ng ch\u1ecdn t\u1ec7p \u1ea3nh', 'err'); if (f.size > 5 * 1024 * 1024) return App.toast('\u1ea2nh c\u1ea7n nh\u1ecf h\u01a1n 5MB', 'err');
        const rd = new FileReader(); rd.onload = () => { const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); const z = 240; c.width = z; c.height = z; const sq = Math.min(img.width, img.height); c.getContext('2d').drawImage(img, (img.width - sq) / 2, (img.height - sq) / 2, sq, sq, 0, 0, z, z); const data = c.toDataURL('image/jpeg', 0.82); u.avatar = data; u.big = data; K.save(); App.toast('\u0110\u00e3 c\u1eadp nh\u1eadt \u1ea3nh \u0111\u1ea1i di\u1ec7n'); App.refresh(); }; img.onerror = () => App.toast('Kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c \u1ea3nh n\u00e0y', 'err'); img.src = rd.result; }; rd.readAsDataURL(f);
      });
      const f = root.querySelector('#ac-f');
      if (f) {
        root.querySelector('#ac-cancel').onclick = () => { App.refresh(); App.toast('\u0110\u00e3 h\u1ee7y c\u00e1c thay \u0111\u1ed5i ch\u01b0a l\u01b0u'); };
        f.onsubmit = (e) => {
          e.preventDefault();
          const err = f.querySelector('#ac-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
          const name = f.querySelector('#ac-name').value.trim(); const en = f.querySelector('#ac-en').value.trim(); const er = f.querySelector('#ac-er').value; const ep = f.querySelector('#ac-ep').value.trim();
          if (!name) return fail('H\u1ecd v\u00e0 t\u00ean kh\u00f4ng \u0111\u01b0\u1ee3c \u0111\u1ec3 tr\u1ed1ng.');
          if (!en || !er || !ep) return fail('Vui l\u00f2ng \u0111i\u1ec1n \u0111\u1ee7 th\u00f4ng tin li\u00ean h\u1ec7 kh\u1ea9n c\u1ea5p.');
          if (!/^0\d{9}$/.test(ep.replace(/\s/g, ''))) return fail('S\u1ed1 \u0111i\u1ec7n tho\u1ea1i li\u00ean h\u1ec7 kh\u1ea9n c\u1ea5p g\u1ed3m 10 ch\u1eef s\u1ed1.');
          u.name = name; u.faculty = f.querySelector('#ac-fac').value; u.cls = f.querySelector('#ac-cls').value; u.emergency = { name: en, relation: er, phone: ep };
          K.save(); App.toast('\u0110\u00e3 l\u01b0u thay \u0111\u1ed5i'); App.refresh();
        };
      }
      const pf = root.querySelector('#pw-f');
      if (pf) pf.onsubmit = (e) => {
        e.preventDefault(); const err = pf.querySelector('#pw-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        const o = pf.querySelector('#pw-o').value, n = pf.querySelector('#pw-n').value, n2 = pf.querySelector('#pw-n2').value;
        if (o !== u.password) return fail('M\u1eadt kh\u1ea9u hi\u1ec7n t\u1ea1i kh\u00f4ng \u0111\u00fang.');
        if (n.length < 8) return fail('M\u1eadt kh\u1ea9u m\u1edbi c\u1ea7n t\u1ed1i thi\u1ec3u 8 k\u00fd t\u1ef1.');
        if (n !== n2) return fail('M\u1eadt kh\u1ea9u nh\u1eadp l\u1ea1i kh\u00f4ng kh\u1edbp.');
        u.password = n; K.save(); App.toast('\u0110\u00e3 c\u1eadp nh\u1eadt m\u1eadt kh\u1ea9u'); App.refresh();
      };
      root.querySelectorAll('[data-sess]').forEach((b) => b.onclick = () => { K.db.sessions = (K.db.sessions || [{ id: 1, d: 'Tr\u00ecnh duy\u1ec7t hi\u1ec7n t\u1ea1i', loc: 'Vinh, Ngh\u1ec7 An', t: '\u0110ang ho\u1ea1t \u0111\u1ed9ng', cur: true }, { id: 2, d: 'iPhone 13 \u00b7 Safari', loc: 'Vinh, Ngh\u1ec7 An', t: '14/10/2026 21:10' }, { id: 3, d: 'Laptop \u00b7 Chrome', loc: 'H\u00e0 N\u1ed9i', t: '02/10/2026 08:45' }]).filter((s) => String(s.id) !== b.dataset.sess); K.save(); App.toast('\u0110\u00e3 \u0111\u0103ng xu\u1ea5t thi\u1ebft b\u1ecb'); App.refresh(); });
      const up = root.querySelector('#doc-up');
      if (up) up.onchange = () => { const fl = up.files[0]; if (!fl) return; u.docs = u.docs || [{ n: 'Gi\u1ea5y x\u00e1c nh\u1eadn sinh vi\u00ean', f: 'xac_nhan_sv.pdf', d: '12/09/2026', ok: true }, { n: 'CCCD (b\u1ea3n sao)', f: 'cccd.jpg', d: '12/09/2026', ok: true }, { n: '\u1ea2nh th\u1ebb 3x4', f: 'anh_the.png', d: '12/09/2026', ok: true }, { n: '\u0110\u01a1n \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa', f: 'don_dang_ky.pdf', d: '12/09/2026', ok: true }]; u.docs.push({ n: 'Gi\u1ea5y t\u1edd b\u1ed5 sung', f: fl.name, d: K.today(), ok: false }); K.save(); App.toast('\u0110\u00e3 t\u1ea3i l\u00ean ' + fl.name); App.refresh(); };
    },
  };
})();
