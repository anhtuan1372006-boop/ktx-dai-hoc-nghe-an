/* v14 \u2013 D\u1ecbch v\u1ee5 & an ninh k\u00fd t\u00fac x\u00e1: kh\u00e1ch th\u0103m, \u0111\u0103ng k\u00fd v\u1ec1 mu\u1ed9n, g\u1eedi xe, gi\u1ea5y x\u00e1c nh\u1eadn c\u01b0 tr\u00fa.
   Sinh vi\u00ean g\u1eedi y\u00eau c\u1ea7u (sv-dich-vu), Ban qu\u1ea3n l\u00fd duy\u1ec7t, ghi nh\u1eadn ra v\u00e0o, c\u1ea5p th\u1ebb xe, c\u1ea5p gi\u1ea5y (ql-dich-vu). */
(function () {
  const K = window.KTX, { esc, ic, sel } = App;
  const P = App.pages, V4 = App.v4;
  const b2 = K.pad2, money = K.money;

  // ---------- quy \u0111\u1ecbnh ----------
  const RULES = {
    visitFrom: '07:00', visitTo: '22:00', visitMaxGuests: 3, visitAhead: 14,
    lateFrom: '23:00', lateTo: '01:00', lateAhead: 7, latePerMonth: 4,
    certMaxCopies: 5,
  };
  const VEH = { 'xe-dap': ['Xe \u0111\u1ea1p', 30000, false, 'bike'], 'xe-dap-dien': ['Xe \u0111\u1ea1p \u0111i\u1ec7n', 50000, false, 'bike'], 'xe-may': ['Xe m\u00e1y', 70000, true, 'motorbike'], 'xe-may-dien': ['Xe m\u00e1y \u0111i\u1ec7n', 60000, true, 'motorbike'] };
  const RELS = ['B\u1ed1 / m\u1eb9', 'Anh / ch\u1ecb / em ru\u1ed9t', 'H\u1ecd h\u00e0ng', 'B\u1ea1n b\u00e8', 'Gi\u1ea3ng vi\u00ean, c\u00e1n b\u1ed9 tr\u01b0\u1eddng', 'Kh\u00e1c'];
  const PURPOSES = ['\u0110\u0103ng k\u00fd t\u1ea1m tr\u00fa v\u1edbi c\u00f4ng an ph\u01b0\u1eddng', 'B\u1ed5 sung h\u1ed3 s\u01a1 vay v\u1ed1n t\u00edn d\u1ee5ng sinh vi\u00ean', 'H\u1ed3 s\u01a1 mi\u1ec5n, gi\u1ea3m h\u1ecdc ph\u00ed', 'H\u1ed3 s\u01a1 x\u00e9t h\u1ecdc b\u1ed5ng', 'X\u00e1c nh\u1eadn n\u01a1i \u1edf cho gia \u0111\u00ecnh', 'M\u1ee5c \u0111\u00edch kh\u00e1c'];
  const ST = {
    'cho-duyet': ['Ch\u1edd duy\u1ec7t', 'orange', 'clock'], 'da-duyet': ['\u0110\u00e3 duy\u1ec7t', 'blue', 'circle-check'], 'da-vao': ['\u0110ang trong KTX', 'green', 'log-in'],
    'da-ra': ['\u0110\u00e3 ra v\u1ec1', 'gray', 'log-out'], 'tu-choi': ['T\u1eeb ch\u1ed1i', 'red', 'circle-x'], 'da-huy': ['\u0110\u00e3 h\u1ee7y', 'gray', 'ban'], 'qua-han': ['H\u1ebft hi\u1ec7u l\u1ef1c', 'gray', 'clock-alert'],
    'da-ve': ['\u0110\u00e3 v\u1ec1 KTX', 'green', 'circle-check'], 've-tre': ['V\u1ec1 qu\u00e1 gi\u1edd \u0111\u0103ng k\u00fd', 'red', 'triangle-alert'], 'dang-gui': ['\u0110ang g\u1eedi xe', 'green', 'circle-check'],
    'da-cap': ['\u0110\u00e3 c\u1ea5p gi\u1ea5y', 'green', 'stamp'],
  };
  const badge = (s) => { const x = ST[s] || [s, 'gray', 'info']; return `<span class="badge b-${x[1]}">${ic(x[2])}${x[0]}</span>`; };
  const today = () => V4.todayIso();
  const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + b2(d.getMonth() + 1) + '-' + b2(d.getDate()); };
  const sname = (sid) => (K.student(sid) || { name: sid }).name;
  const nextId = (arr, pre) => pre + String(Math.max(0, ...arr.map((x) => +String(x.id).replace(/\D/g, '').slice(-4) || 0)) + 1).padStart(4, '0');
  const phoneOk = (p) => /^0\d{9}$/.test(String(p).replace(/[\s.]/g, ''));
  const plateNorm = (p) => String(p || '').toUpperCase().replace(/\s+/g, ' ').trim();
  const plateOk = (p) => /^\d{2}-?[A-Z]{1,2}\d{0,2}[-\s]?\d{3}\.?\d{2}$/.test(plateNorm(p));
  const visitState = (v) => (v.status === 'da-duyet' && v.date < today() ? 'qua-han' : v.status);
  const lateState = (l) => (l.status === 'da-duyet' && Date.now() > lateAt(l).getTime() + 12 * 3600e3 ? 'qua-han' : l.status);
  const toMin = (t) => { const [h, m] = String(t || '0:0').split(':').map(Number); return h * 60 + m; };
  const lateMin = (t) => { const m = toMin(t); return m < 12 * 60 ? m + 24 * 60 : m; }; // 00:30 \u2192 sau 23:00
  const lateAt = (l) => { const d = new Date(l.date + 'T' + l.time + ':00'); if (toMin(l.time) < 12 * 60) d.setDate(d.getDate() + 1); return d; };

  // ---------- d\u1eef li\u1ec7u m\u1eabu ----------
  const seed = () => {
    const t = today();
    const live = K.db.students.filter((s) => s.status === 'dang-o');
    const S = (i) => live[i % live.length].id;
    K.db.visitors = [
      { id: 'KT-0001', student: 'SV260001', guests: [{ name: 'Nguy\u1ec5n V\u0103n B\u00ecnh', rel: 'B\u1ed1 / m\u1eb9', phone: '0912345678', idno: '4521' }], date: t, from: '15:00', to: '17:00', purpose: 'Th\u0103m con, g\u1eedi \u0111\u1ed3 d\u00f9ng c\u00e1 nh\u00e2n', status: 'da-duyet', at: K.now(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean' },
      { id: 'KT-0002', student: S(20), guests: [{ name: 'Tr\u1ea7n Thu H\u00e0', rel: 'Anh / ch\u1ecb / em ru\u1ed9t', phone: '0987654321', idno: '1188' }], date: t, from: '09:00', to: '10:30', purpose: 'Th\u0103m em g\u00e1i', status: 'da-vao', inAt: t.split('-').reverse().join('/') + ' 09:05', at: K.now(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean' },
      { id: 'KT-0003', student: S(57), guests: [{ name: 'L\u00ea Minh T\u00fa', rel: 'B\u1ea1n b\u00e8', phone: '0905111222', idno: '7720' }, { name: 'Ph\u1ea1m Anh Khoa', rel: 'B\u1ea1n b\u00e8', phone: '0905333444', idno: '6612' }], date: addDays(t, 1), from: '18:30', to: '20:30', purpose: 'H\u1ecdc nh\u00f3m m\u00f4n Kinh t\u1ebf vi m\u00f4', status: 'cho-duyet', at: K.now() },
      { id: 'KT-0004', student: S(140), guests: [{ name: 'Ho\u00e0ng Th\u1ecb Lan', rel: 'B\u1ed1 / m\u1eb9', phone: '0977222333', idno: '3045' }], date: addDays(t, -3), from: '08:00', to: '11:00', purpose: '\u0110\u01b0a \u0111\u1ed3 \u0103n, th\u0103m h\u1ecfi', status: 'da-ra', inAt: '', outAt: '', at: K.now(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean' },
    ];
    K.db.lateReturns = [
      { id: 'VM-0001', student: S(33), date: t, time: '23:30', reason: 'L\u00e0m th\u00eam ca t\u1ed1i t\u1ea1i c\u1eeda h\u00e0ng, tan ca 23:00', phone: '0912777888', status: 'da-duyet', at: K.now(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean' },
      { id: 'VM-0002', student: 'SV260001', date: addDays(t, -6), time: '23:15', reason: 'Tham gia ch\u01b0\u01a1ng tr\u00ecnh v\u0103n ngh\u1ec7 c\u1ee7a \u0110o\u00e0n tr\u01b0\u1eddng', phone: '0912341234', status: 'da-ve', backAt: '', at: K.now(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean' },
      { id: 'VM-0003', student: S(91), date: addDays(t, 2), time: '00:30', reason: '\u0110\u00f3n ng\u01b0\u1eddi th\u00e2n \u1edf ga Vinh, t\u00e0u \u0111\u1ebfn l\u00fac 23:50', phone: '0903555666', status: 'cho-duyet', at: K.now() },
    ];
    K.db.vehicles = [
      { id: 'GX-0001', student: 'SV260001', type: 'xe-may', plate: '37B1-123.45', brand: 'Honda Wave Alpha', color: '\u0110en', status: 'dang-gui', card: 'TH\u1eba 0001', from: '01/09/2026', fee: 70000, at: '28/08/2026 09:00' },
      { id: 'GX-0002', student: S(12), type: 'xe-dap', plate: '', brand: 'Th\u1ed1ng Nh\u1ea5t', color: 'Xanh', status: 'dang-gui', card: 'TH\u1eba 0002', from: '05/09/2026', fee: 30000, at: '03/09/2026 15:20' },
      { id: 'GX-0003', student: S(76), type: 'xe-may-dien', plate: '37M\u01101-456.78', brand: 'VinFast Evo200', color: 'Tr\u1eafng', status: 'cho-duyet', fee: 60000, at: K.now() },
    ];
    K.db.certs = [
      { id: 'XN-0001', student: 'SV260001', purpose: 'B\u1ed5 sung h\u1ed3 s\u01a1 vay v\u1ed1n t\u00edn d\u1ee5ng sinh vi\u00ean', copies: 2, note: '', status: 'da-cap', no: '0001/XN-KTX', issuedAt: '20/10/2026', at: '18/10/2026 10:15', by: 'Qu\u1ea3n tr\u1ecb vi\u00ean' },
      { id: 'XN-0002', student: S(48), purpose: '\u0110\u0103ng k\u00fd t\u1ea1m tr\u00fa v\u1edbi c\u00f4ng an ph\u01b0\u1eddng', copies: 1, note: 'C\u1ea7n n\u1ed9p tr\u01b0\u1edbc ng\u00e0y 20 th\u00e1ng n\u00e0y', status: 'cho-duyet', at: K.now() },
    ];
    K.db.v14 = 1;
  };
  const ensure = () => { if (!K.db.v14 || !K.db.visitors) { seed(); K.save(); } };
  ensure();
  const origReset = K.reset; K.reset = () => { origReset(); delete K.db.v14; ensure(); };

  // nh\u00e3n "D\u1eef li\u1ec7u minh h\u1ecda" kh\u00f4ng c\u00f2n c\u1ea7n thi\u1ebft: m\u1ecdi s\u1ed1 li\u1ec7u \u0111\u1ec1u l\u1ea5y t\u1eeb c\u01a1 s\u1edf d\u1eef li\u1ec7u
  V4.demo = '';

  // ---------- menu ----------
  const addNav = (nav, after, item) => { if (!nav || nav.some((x) => x[0] === item[0])) return; const i = nav.findIndex((x) => x[0] === after); nav.splice(i < 0 ? nav.length - 1 : i + 1, 0, item); };
  addNav(App.SV_NAV, 'sv-ho-tro', ['sv-dich-vu', 'D\u1ecbch v\u1ee5', 'concierge-bell']);
  addNav(App.QL_NAV, 'ql-cu-tru', ['ql-dich-vu', 'An ninh & d\u1ecbch v\u1ee5', 'shield-check']);

  // ---------- gi\u1ea5y x\u00e1c nh\u1eadn c\u01b0 tr\u00fa (d\u00f9ng chung cho SV v\u00e0 BQL) ----------
  const certHtml = (c) => {
    const s = K.student(c.student) || {}; const r = K.room(s.room) || {}; const g = K.db.general;
    const d = (c.issuedAt || K.today()).split('/');
    return `<div class="cert14" id="cert-${c.id}">
      <div class="cert14-h"><div><b>TR\u01af\u1edcNG \u0110\u1ea0I H\u1eccC NGH\u1ec6 AN</b><small>BAN QU\u1ea2N L\u00dd K\u00dd T\u00daC X\u00c1</small><small>S\u1ed1: ${esc(c.no || '\u2026/XN-KTX')}</small></div><div><b>C\u1ed8NG H\u00d2A X\u00c3 H\u1ed8I CH\u1ee6 NGH\u0128A VI\u1ec6T NAM</b><small><u>\u0110\u1ed9c l\u1eadp \u2013 T\u1ef1 do \u2013 H\u1ea1nh ph\u00fac</u></small></div></div>
      <h2>GI\u1ea4Y X\u00c1C NH\u1eacN C\u01af TR\u00da</h2>
      <p>Ban qu\u1ea3n l\u00fd K\u00fd t\u00fac x\u00e1 Tr\u01b0\u1eddng \u0110\u1ea1i h\u1ecdc Ngh\u1ec7 An x\u00e1c nh\u1eadn:</p>
      <div class="cert14-grid"><span>H\u1ecd v\u00e0 t\u00ean sinh vi\u00ean:</span><b>${esc(s.name || '')}</b><span>M\u00e3 sinh vi\u00ean:</span><b>${esc(s.id || '')}</b><span>L\u1edbp \u2013 Khoa:</span><b>${esc((s.cls || '') + ' \u2013 ' + (s.faculty || ''))}</b><span>Kh\u00f3a h\u1ecdc:</span><b>${esc(s.course || '')}</b><span>N\u01a1i \u1edf hi\u1ec7n t\u1ea1i:</span><b>Ph\u00f2ng ${esc(s.room || '\u2026')}, gi\u01b0\u1eddng ${s.bed ? b2(s.bed) : '\u2026'}, t\u1ea7ng ${esc(r.khu || '\u2026')} \u2013 ${esc(g.name)}, ${esc(g.address)}</b><span>Th\u1eddi gian l\u01b0u tr\u00fa:</span><b>T\u1eeb ng\u00e0y ${esc(s.since || '01/09/2026')} \u0111\u1ebfn nay</b></div>
      <p>Sinh vi\u00ean hi\u1ec7n \u0111ang l\u01b0u tr\u00fa t\u1ea1i K\u00fd t\u00fac x\u00e1 v\u00e0 ch\u1ea5p h\u00e0nh n\u1ed9i quy c\u1ee7a nh\u00e0 tr\u01b0\u1eddng.</p>
      <p>Gi\u1ea5y x\u00e1c nh\u1eadn \u0111\u01b0\u1ee3c c\u1ea5p \u0111\u1ec3: <b>${esc(c.purpose)}</b>${c.note ? ' (' + esc(c.note) + ')' : ''}. Gi\u1ea5y c\u00f3 gi\u00e1 tr\u1ecb trong 30 ng\u00e0y k\u1ec3 t\u1eeb ng\u00e0y k\u00fd.</p>
      <div class="cert14-sign"><i>Ngh\u1ec7 An, ng\u00e0y ${d[0]} th\u00e1ng ${d[1]} n\u0103m ${d[2]}</i><b>TR\u01af\u1edeNG BAN QU\u1ea2N L\u00dd K\u00dd T\u00daC X\u00c1</b><small>(\u0110\u00e3 k\u00fd v\u00e0 \u0111\u00f3ng d\u1ea5u)</small></div>
    </div>`;
  };
  const showCert = (c) => App.modal({ title: 'Gi\u1ea5y x\u00e1c nh\u1eadn c\u01b0 tr\u00fa ' + (c.no || ''), wide: true, body: certHtml(c), foot: `<button class="btn btn-outline" data-x>\u0110\u00f3ng</button><button class="btn btn-red" data-ok>${ic('printer')}In / L\u01b0u PDF</button>`,
    onMount: (el) => { el.querySelector('[data-ok]').onclick = () => App.printEl(el.querySelector('.cert14'), 'Gi\u1ea5y x\u00e1c nh\u1eadn c\u01b0 tr\u00fa ' + c.id); } });

  // ======================================================== Sinh vi\u00ean
  const TABS = [['khach', 'Kh\u00e1ch th\u0103m', 'users'], ['ve-muon', '\u0110\u0103ng k\u00fd v\u1ec1 mu\u1ed9n', 'moon'], ['gui-xe', 'G\u1eedi xe', 'bike'], ['xac-nhan', 'X\u00e1c nh\u1eadn c\u01b0 tr\u00fa', 'stamp']];
  const empty = (t) => `<div class="empty14">${ic('inbox')}<p>${t}</p></div>`;

  P['sv-dich-vu'] = {
    role: 'student', title: 'D\u1ecbch v\u1ee5 k\u00fd t\u00fac x\u00e1',
    render: () => {
      const u = K.me(); const st = App.state('svdv', { tab: 'khach', guests: 1 });
      const live = u.status === 'dang-o' && u.room;
      const lock = live ? '' : `<div class="warn-bar">${ic('info')}<span><b>B\u1ea1n ch\u01b0a c\u00f3 ph\u00f2ng \u1edf k\u00fd t\u00fac x\u00e1</b><small>C\u00e1c d\u1ecbch v\u1ee5 n\u00e0y ch\u1ec9 d\u00e0nh cho sinh vi\u00ean \u0111ang l\u01b0u tr\u00fa.</small></span></div>`;
      const dis = live ? '' : 'disabled';
      let form = '', list = '';
      if (st.tab === 'khach') {
        const mine = K.db.visitors.filter((v) => v.student === u.id).slice().reverse();
        form = `<form class="card pad" id="dv-f" novalidate><h2 class="card-t" style="font-size:20px">${ic('user-plus')}\u0110\u0103ng k\u00fd kh\u00e1ch \u0111\u1ebfn th\u0103m</h2>${lock}
          <p class="muted small" style="margin-top:6px">Gi\u1edd th\u0103m ${RULES.visitFrom} \u2013 ${RULES.visitTo} h\u1eb1ng ng\u00e0y. Kh\u00e1ch xu\u1ea5t tr\u00ecnh CCCD t\u1ea1i qu\u1ea7y b\u1ea3o v\u1ec7, kh\u00f4ng \u1edf l\u1ea1i qua \u0111\u00eam. T\u1ed1i \u0111a ${RULES.visitMaxGuests} kh\u00e1ch m\u1ed7i l\u01b0\u1ee3t.</p>
          <div class="grid g3" style="gap:12px;margin-top:12px"><div class="field"><label for="v-date">Ng\u00e0y th\u0103m <span class="req">*</span></label><input id="v-date" type="date" class="input" min="${today()}" max="${addDays(today(), RULES.visitAhead)}" value="${today()}"></div>
            <div class="field"><label for="v-from">T\u1eeb gi\u1edd <span class="req">*</span></label><input id="v-from" type="time" class="input" min="${RULES.visitFrom}" max="${RULES.visitTo}" value="17:00"></div>
            <div class="field"><label for="v-to">\u0110\u1ebfn gi\u1edd <span class="req">*</span></label><input id="v-to" type="time" class="input" min="${RULES.visitFrom}" max="${RULES.visitTo}" value="19:00"></div></div>
          ${Array.from({ length: st.guests }, (_, i) => `<fieldset class="guest14"><legend>Kh\u00e1ch ${i + 1}</legend><div class="grid g2" style="gap:10px"><div class="field"><label for="g-n${i}">H\u1ecd v\u00e0 t\u00ean <span class="req">*</span></label><input id="g-n${i}" class="input" autocomplete="off"></div><div class="field"><label for="g-r${i}">Quan h\u1ec7 <span class="req">*</span></label>${sel('g-r' + i, RELS, RELS[0])}</div><div class="field"><label for="g-p${i}">S\u1ed1 \u0111i\u1ec7n tho\u1ea1i <span class="req">*</span></label><input id="g-p${i}" class="input" inputmode="tel" placeholder="0912 345 678"></div><div class="field"><label for="g-i${i}">4 s\u1ed1 cu\u1ed1i CCCD <span class="req">*</span></label><input id="g-i${i}" class="input" inputmode="numeric" maxlength="4" placeholder="1234"></div></div></fieldset>`).join('')}
          <div class="row" style="gap:8px;margin-top:8px">${st.guests < RULES.visitMaxGuests ? `<button type="button" class="btn btn-outline btn-sm" id="g-add">${ic('plus')}Th\u00eam kh\u00e1ch</button>` : ''}${st.guests > 1 ? `<button type="button" class="btn btn-outline btn-sm" id="g-rm">${ic('minus')}B\u1edbt kh\u00e1ch</button>` : ''}</div>
          <div class="field" style="margin-top:12px"><label for="v-pur">M\u1ee5c \u0111\u00edch th\u0103m <span class="req">*</span></label><input id="v-pur" class="input" maxlength="120" placeholder="V\u00ed d\u1ee5: th\u0103m con, g\u1eedi \u0111\u1ed3 d\u00f9ng c\u00e1 nh\u00e2n"></div>
          <p class="err" id="dv-err" hidden style="margin-top:8px"></p>
          <button class="btn btn-red btn-block btn-lg" style="margin-top:14px" ${dis}>${ic('send')}G\u1eedi \u0111\u0103ng k\u00fd kh\u00e1ch th\u0103m</button></form>`;
        list = mine.length ? mine.map((v) => `<div class="req14"><div class="row" style="justify-content:space-between;gap:8px"><b>${v.id} \u00b7 ${V4.dmy(v.date)} \u00b7 ${v.from} \u2013 ${v.to}</b>${badge(visitState(v))}</div>
          <p>${v.guests.map((g) => esc(g.name) + ' (' + esc(g.rel) + ')').join(', ')}</p><small>${esc(v.purpose)}${v.reason ? ' \u00b7 L\u00fd do: ' + esc(v.reason) : ''}${v.inAt ? ' \u00b7 V\u00e0o l\u00fac ' + v.inAt : ''}${v.outAt ? ' \u00b7 Ra l\u00fac ' + v.outAt : ''}</small>
          ${v.status === 'cho-duyet' || (v.status === 'da-duyet' && v.date >= today()) ? `<button class="link link-red small" data-cancel="visitors:${v.id}">${ic('x')}H\u1ee7y \u0111\u0103ng k\u00fd</button>` : ''}</div>`).join('') : empty('B\u1ea1n ch\u01b0a \u0111\u0103ng k\u00fd kh\u00e1ch th\u0103m n\u00e0o.');
      } else if (st.tab === 've-muon') {
        const mine = K.db.lateReturns.filter((l) => l.student === u.id).slice().reverse();
        const month = today().slice(0, 7); const used = mine.filter((l) => l.date.slice(0, 7) === month && !['tu-choi', 'da-huy'].includes(l.status)).length;
        form = `<form class="card pad" id="dv-f" novalidate><h2 class="card-t" style="font-size:20px">${ic('moon')}\u0110\u0103ng k\u00fd v\u1ec1 mu\u1ed9n</h2>${lock}
          <p class="muted small" style="margin-top:6px">C\u1ed5ng k\u00fd t\u00fac x\u00e1 \u0111\u00f3ng l\u00fac ${RULES.lateFrom}. Sinh vi\u00ean v\u1ec1 sau gi\u1edd n\u00e0y ph\u1ea3i \u0111\u0103ng k\u00fd tr\u01b0\u1edbc, gi\u1edd v\u1ec1 mu\u1ed9n nh\u1ea5t ${RULES.lateTo}. M\u1ed7i th\u00e1ng t\u1ed1i \u0111a ${RULES.latePerMonth} l\u1ea7n (th\u00e1ng n\u00e0y \u0111\u00e3 d\u00f9ng <b>${used}</b>).</p>
          <div class="grid g2" style="gap:12px;margin-top:12px"><div class="field"><label for="l-date">Ng\u00e0y v\u1ec1 mu\u1ed9n <span class="req">*</span></label><input id="l-date" type="date" class="input" min="${today()}" max="${addDays(today(), RULES.lateAhead)}" value="${today()}"></div>
            <div class="field"><label for="l-time">Gi\u1edd d\u1ef1 ki\u1ebfn v\u1ec1 <span class="req">*</span></label><input id="l-time" type="time" class="input" value="23:30"></div></div>
          <div class="field" style="margin-top:12px"><label for="l-why">L\u00fd do <span class="req">*</span></label><textarea id="l-why" class="textarea" style="min-height:80px" maxlength="300" placeholder="V\u00ed d\u1ee5: l\u00e0m th\u00eam ca t\u1ed1i, tham gia ho\u1ea1t \u0111\u1ed9ng c\u1ee7a tr\u01b0\u1eddng..."></textarea></div>
          <div class="field" style="margin-top:12px"><label for="l-ph">S\u1ed1 \u0111i\u1ec7n tho\u1ea1i li\u00ean h\u1ec7 <span class="req">*</span></label><input id="l-ph" class="input" inputmode="tel" value="${esc(u.phone || '')}"></div>
          <p class="err" id="dv-err" hidden style="margin-top:8px"></p>
          <button class="btn btn-red btn-block btn-lg" style="margin-top:14px" ${dis}>${ic('send')}G\u1eedi \u0111\u0103ng k\u00fd v\u1ec1 mu\u1ed9n</button></form>`;
        list = mine.length ? mine.map((l) => `<div class="req14"><div class="row" style="justify-content:space-between;gap:8px"><b>${l.id} \u00b7 ${V4.dmy(l.date)} \u00b7 v\u1ec1 l\u00fac ${l.time}</b>${badge(lateState(l))}</div><small>${esc(l.reason)}${l.backAt ? ' \u00b7 Ghi nh\u1eadn v\u1ec1 l\u00fac ' + l.backAt : ''}${l.why ? ' \u00b7 L\u00fd do t\u1eeb ch\u1ed1i: ' + esc(l.why) : ''}</small>
          ${l.status === 'cho-duyet' ? `<button class="link link-red small" data-cancel="lateReturns:${l.id}">${ic('x')}H\u1ee7y \u0111\u0103ng k\u00fd</button>` : ''}</div>`).join('') : empty('B\u1ea1n ch\u01b0a c\u00f3 \u0111\u0103ng k\u00fd v\u1ec1 mu\u1ed9n n\u00e0o.');
      } else if (st.tab === 'gui-xe') {
        const mine = K.db.vehicles.filter((v) => v.student === u.id).slice().reverse();
        const active = mine.find((v) => ['cho-duyet', 'dang-gui'].includes(v.status));
        form = `<form class="card pad" id="dv-f" novalidate><h2 class="card-t" style="font-size:20px">${ic('bike')}\u0110\u0103ng k\u00fd g\u1eedi xe t\u1ea1i nh\u00e0 xe KTX</h2>${lock}
          <div class="fee14">${Object.values(VEH).map(([t, f]) => `<span>${t}<b>${money(f)}/th\u00e1ng</b></span>`).join('')}</div>
          <p class="muted small" style="margin-top:6px">M\u1ed7i sinh vi\u00ean g\u1eedi 1 xe. Sau khi \u0111\u01b0\u1ee3c duy\u1ec7t, b\u1ea1n nh\u1eadn th\u1ebb xe t\u1ea1i qu\u1ea7y b\u1ea3o v\u1ec7; ph\u00ed g\u1eedi xe th\u00e1ng \u0111\u1ea7u \u0111\u01b0\u1ee3c l\u1eadp h\u00f3a \u0111\u01a1n ngay \u0111\u1ec3 thanh to\u00e1n tr\u1ef1c tuy\u1ebfn.</p>
          ${active ? `<div class="warn-bar" style="margin-top:10px">${ic('info')}<span><b>B\u1ea1n \u0111ang c\u00f3 xe ${active.status === 'dang-gui' ? 'g\u1eedi t\u1ea1i KTX' : 'ch\u1edd duy\u1ec7t'} (${esc(VEH[active.type][0])}${active.plate ? ' ' + esc(active.plate) : ''})</b><small>H\u1ee7y \u0111\u0103ng k\u00fd c\u0169 tr\u01b0\u1edbc khi \u0111\u0103ng k\u00fd xe kh\u00e1c.</small></span></div>` : ''}
          <div class="grid g2" style="gap:12px;margin-top:12px"><div class="field"><label for="x-type">Lo\u1ea1i xe <span class="req">*</span></label>${sel('x-type', Object.entries(VEH).map(([k, v]) => [k, v[0]]), 'xe-may')}</div>
            <div class="field"><label for="x-plate">Bi\u1ec3n s\u1ed1 <span class="req" id="x-req">*</span></label><input id="x-plate" class="input" placeholder="37B1-123.45" autocomplete="off"></div>
            <div class="field"><label for="x-brand">H\u00e3ng, d\u00f2ng xe <span class="req">*</span></label><input id="x-brand" class="input" maxlength="60" placeholder="Honda Wave Alpha"></div>
            <div class="field"><label for="x-color">M\u00e0u xe <span class="req">*</span></label><input id="x-color" class="input" maxlength="30" placeholder="\u0110en"></div></div>
          <p class="err" id="dv-err" hidden style="margin-top:8px"></p>
          <button class="btn btn-red btn-block btn-lg" style="margin-top:14px" ${dis || (active ? 'disabled' : '')}>${ic('send')}G\u1eedi \u0111\u0103ng k\u00fd g\u1eedi xe</button></form>`;
        list = mine.length ? mine.map((v) => { const inv = K.db.invoices.find((i) => i.vehicle === v.id && i.status !== 'da-tt'); return `<div class="req14"><div class="row" style="justify-content:space-between;gap:8px"><b>${v.id} \u00b7 ${esc(VEH[v.type][0])}${v.plate ? ' \u00b7 ' + esc(v.plate) : ''}</b>${badge(v.status)}</div><small>${esc(v.brand)} \u00b7 ${esc(v.color)} \u00b7 ${money(v.fee)}/th\u00e1ng${v.card ? ' \u00b7 ' + esc(v.card) + ' t\u1eeb ' + v.from : ''}${v.why ? ' \u00b7 L\u00fd do: ' + esc(v.why) : ''}</small>
          <div class="row" style="gap:12px">${inv ? `<a href="#" class="link link-red small" data-go="sv-thanh-toan-${inv.id}">${ic('credit-card')}Thanh to\u00e1n ${money(inv.total)}</a>` : ''}${['cho-duyet', 'dang-gui'].includes(v.status) ? `<button class="link link-red small" data-cancel="vehicles:${v.id}">${ic('x')}${v.status === 'dang-gui' ? 'Ng\u1eebng g\u1eedi xe' : 'H\u1ee7y \u0111\u0103ng k\u00fd'}</button>` : ''}</div></div>`; }).join('') : empty('B\u1ea1n ch\u01b0a \u0111\u0103ng k\u00fd g\u1eedi xe.');
      } else {
        const mine = K.db.certs.filter((c) => c.student === u.id).slice().reverse();
        form = `<form class="card pad" id="dv-f" novalidate><h2 class="card-t" style="font-size:20px">${ic('stamp')}Xin gi\u1ea5y x\u00e1c nh\u1eadn c\u01b0 tr\u00fa</h2>${lock}
          <p class="muted small" style="margin-top:6px">Ban qu\u1ea3n l\u00fd x\u1eed l\u00fd trong 1 \u2013 2 ng\u00e0y l\u00e0m vi\u1ec7c. Gi\u1ea5y \u0111\u00e3 c\u1ea5p xem v\u00e0 in tr\u1ef1c ti\u1ebfp t\u1ea1i \u0111\u00e2y, b\u1ea3n c\u00f3 d\u1ea5u nh\u1eadn t\u1ea1i v\u0103n ph\u00f2ng t\u1ea7ng 1.</p>
          <div class="field" style="margin-top:12px"><label for="c-pur">M\u1ee5c \u0111\u00edch s\u1eed d\u1ee5ng <span class="req">*</span></label>${sel('c-pur', PURPOSES, PURPOSES[0])}</div>
          <div class="grid g2" style="gap:12px;margin-top:12px"><div class="field"><label for="c-n">S\u1ed1 b\u1ea3n <span class="req">*</span></label><input id="c-n" type="number" class="input" min="1" max="${RULES.certMaxCopies}" value="1"></div><div class="field"><label for="c-note">Ghi ch\u00fa</label><input id="c-note" class="input" maxlength="120" placeholder="N\u01a1i n\u1ed9p, th\u1eddi h\u1ea1n..."></div></div>
          <p class="err" id="dv-err" hidden style="margin-top:8px"></p>
          <button class="btn btn-red btn-block btn-lg" style="margin-top:14px" ${dis}>${ic('send')}G\u1eedi y\u00eau c\u1ea7u</button></form>`;
        list = mine.length ? mine.map((c) => `<div class="req14"><div class="row" style="justify-content:space-between;gap:8px"><b>${c.id} \u00b7 ${c.copies} b\u1ea3n</b>${badge(c.status)}</div><small>${esc(c.purpose)}${c.no ? ' \u00b7 S\u1ed1 ' + esc(c.no) + ' ng\u00e0y ' + c.issuedAt : ''}${c.why ? ' \u00b7 L\u00fd do: ' + esc(c.why) : ''}</small>
          <div class="row" style="gap:12px">${c.status === 'da-cap' ? `<button class="link link-red small" data-cert="${c.id}">${ic('file-text')}Xem / in gi\u1ea5y x\u00e1c nh\u1eadn</button>` : ''}${c.status === 'cho-duyet' ? `<button class="link link-red small" data-cancel="certs:${c.id}">${ic('x')}H\u1ee7y y\u00eau c\u1ea7u</button>` : ''}</div></div>`).join('') : empty('B\u1ea1n ch\u01b0a g\u1eedi y\u00eau c\u1ea7u n\u00e0o.');
      }
      return V4.svShell({ active: 'sv-dich-vu', search: 'T\u00ecm ki\u1ebfm th\u00f4ng b\u00e1o, d\u1ecbch v\u1ee5, h\u01b0\u1edbng d\u1eabn...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('banner_support')}" alt=""><h1>D\u1ecbch v\u1ee5 k\u00fd t\u00fac x\u00e1</h1><p class="desc">\u0110\u0103ng k\u00fd kh\u00e1ch th\u0103m, v\u1ec1 mu\u1ed9n, g\u1eedi xe v\u00e0 xin gi\u1ea5y x\u00e1c nh\u1eadn c\u01b0 tr\u00fa tr\u1ef1c tuy\u1ebfn.</p>
          <div class="seg">${TABS.map(([k, t, i]) => `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}">${ic(i)}${t}</button>`).join('')}</div></div>
        <div class="grid resp-1" style="grid-template-columns:1.1fr .9fr;gap:16px;align-items:start">${form}
          <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('history')}Y\u00eau c\u1ea7u c\u1ee7a t\u00f4i</h2>${list}</div></div>`);
    },
    mount: (root) => {
      const st = App.st.svdv; const u = K.me();
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      const add = root.querySelector('#g-add'); if (add) add.onclick = () => { st.guests++; App.refresh(); };
      const rm = root.querySelector('#g-rm'); if (rm) rm.onclick = () => { st.guests--; App.refresh(); };
      root.querySelectorAll('[data-cert]').forEach((b) => b.onclick = () => showCert(K.db.certs.find((c) => c.id === b.dataset.cert)));
      root.querySelectorAll('[data-cancel]').forEach((b) => b.onclick = () => {
        const [coll, id] = b.dataset.cancel.split(':'); const x = K.db[coll].find((y) => y.id === id); if (!x) return;
        const stop = coll === 'vehicles' && x.status === 'dang-gui';
        App.confirm(stop ? 'Ng\u1eebng g\u1eedi xe' : 'H\u1ee7y y\u00eau c\u1ea7u', stop ? 'Ng\u1eebng g\u1eedi xe ' + esc(x.plate || VEH[x.type][0]) + '? Vui l\u00f2ng tr\u1ea3 th\u1ebb xe t\u1ea1i qu\u1ea7y b\u1ea3o v\u1ec7.' : 'H\u1ee7y y\u00eau c\u1ea7u <b>' + id + '</b>?', stop ? 'Ng\u1eebng g\u1eedi xe' : 'H\u1ee7y y\u00eau c\u1ea7u', () => {
          x.status = 'da-huy'; x.cancelAt = K.now();
          K.save(); App.toast('\u0110\u00e3 h\u1ee7y ' + id); App.refresh();
        }, true);
      });
      const xt = root.querySelector('#x-type'); if (xt) { const upd = () => { root.querySelector('#x-req').hidden = !VEH[xt.value][2]; }; xt.onchange = upd; upd(); }
      const f = root.querySelector('#dv-f'); if (!f) return;
      f.onsubmit = (e) => {
        e.preventDefault();
        const g = (id) => (root.querySelector(id) || { value: '' }).value.trim();
        const err = root.querySelector('#dv-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        if (u.status !== 'dang-o' || !u.room) return fail('Ch\u1ec9 sinh vi\u00ean \u0111ang l\u01b0u tr\u00fa m\u1edbi d\u00f9ng \u0111\u01b0\u1ee3c d\u1ecbch v\u1ee5 n\u00e0y.');
        if (st.tab === 'khach') {
          const d = { date: g('#v-date'), from: g('#v-from'), to: g('#v-to'), purpose: g('#v-pur') };
          if (!d.date || d.date < today() || d.date > addDays(today(), RULES.visitAhead)) return fail('Ng\u00e0y th\u0103m ph\u1ea3i t\u1eeb h\u00f4m nay \u0111\u1ebfn ' + RULES.visitAhead + ' ng\u00e0y t\u1edbi.');
          if (!d.from || !d.to || d.from < RULES.visitFrom || d.to > RULES.visitTo) return fail('Gi\u1edd th\u0103m n\u1eb1m trong khung ' + RULES.visitFrom + ' \u2013 ' + RULES.visitTo + '.');
          if (toMin(d.to) - toMin(d.from) < 15) return fail('Gi\u1edd ra ph\u1ea3i sau gi\u1edd v\u00e0o \u00edt nh\u1ea5t 15 ph\u00fat.');
          if (d.date === today()) { const n = new Date(); if (toMin(d.to) <= n.getHours() * 60 + n.getMinutes()) return fail('Khung gi\u1edd th\u0103m h\u00f4m nay \u0111\u00e3 qua, ch\u1ecdn gi\u1edd kh\u00e1c.'); }
          if (d.purpose.length < 5) return fail('Nh\u1eadp m\u1ee5c \u0111\u00edch th\u0103m (t\u1ed1i thi\u1ec3u 5 k\u00fd t\u1ef1).');
          const guests = [];
          for (let i = 0; i < st.guests; i++) {
            const x = { name: g('#g-n' + i), rel: g('#g-r' + i), phone: g('#g-p' + i).replace(/[\s.]/g, ''), idno: g('#g-i' + i) };
            if (x.name.split(/\s+/).length < 2) return fail('Nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 h\u1ecd v\u00e0 t\u00ean c\u1ee7a kh\u00e1ch ' + (i + 1) + '.');
            if (!phoneOk(x.phone)) return fail('S\u1ed1 \u0111i\u1ec7n tho\u1ea1i c\u1ee7a kh\u00e1ch ' + (i + 1) + ' g\u1ed3m 10 ch\u1eef s\u1ed1, b\u1eaft \u0111\u1ea7u b\u1eb1ng 0.');
            if (!/^\d{4}$/.test(x.idno)) return fail('Nh\u1eadp 4 s\u1ed1 cu\u1ed1i CCCD c\u1ee7a kh\u00e1ch ' + (i + 1) + '.');
            guests.push(x);
          }
          if (K.db.visitors.some((v) => v.student === u.id && v.date === d.date && ['cho-duyet', 'da-duyet', 'da-vao'].includes(v.status) && d.from < v.to && d.to > v.from)) return fail('B\u1ea1n \u0111\u00e3 c\u00f3 l\u01b0\u1ee3t kh\u00e1ch tr\u00f9ng khung gi\u1edd n\u00e0y.');
          const v = Object.assign({ id: nextId(K.db.visitors, 'KT-'), student: u.id, guests, status: 'cho-duyet', at: K.now() }, d);
          K.db.visitors.push(v); K.save(); App.st.svdv = { tab: 'khach', guests: 1 }; App.toast('\u0110\u00e3 g\u1eedi \u0111\u0103ng k\u00fd kh\u00e1ch th\u0103m ' + v.id); App.refresh();
        } else if (st.tab === 've-muon') {
          const d = { date: g('#l-date'), time: g('#l-time'), reason: g('#l-why'), phone: g('#l-ph').replace(/[\s.]/g, '') };
          if (!d.date || d.date < today() || d.date > addDays(today(), RULES.lateAhead)) return fail('Ng\u00e0y v\u1ec1 mu\u1ed9n ph\u1ea3i t\u1eeb h\u00f4m nay \u0111\u1ebfn ' + RULES.lateAhead + ' ng\u00e0y t\u1edbi.');
          const m = lateMin(d.time);
          if (!d.time || m < toMin(RULES.lateFrom) || m > lateMin(RULES.lateTo)) return fail('Gi\u1edd v\u1ec1 ph\u1ea3i trong kho\u1ea3ng ' + RULES.lateFrom + ' \u2013 ' + RULES.lateTo + '. V\u1ec1 tr\u01b0\u1edbc ' + RULES.lateFrom + ' kh\u00f4ng c\u1ea7n \u0111\u0103ng k\u00fd.');
          if (d.reason.length < 10) return fail('N\u00eau r\u00f5 l\u00fd do (t\u1ed1i thi\u1ec3u 10 k\u00fd t\u1ef1).');
          if (!phoneOk(d.phone)) return fail('S\u1ed1 \u0111i\u1ec7n tho\u1ea1i g\u1ed3m 10 ch\u1eef s\u1ed1, b\u1eaft \u0111\u1ea7u b\u1eb1ng 0.');
          const month = d.date.slice(0, 7);
          if (K.db.lateReturns.filter((l) => l.student === u.id && l.date.slice(0, 7) === month && !['tu-choi', 'da-huy'].includes(l.status)).length >= RULES.latePerMonth) return fail('B\u1ea1n \u0111\u00e3 \u0111\u0103ng k\u00fd \u0111\u1ee7 ' + RULES.latePerMonth + ' l\u1ea7n trong th\u00e1ng n\u00e0y.');
          if (K.db.lateReturns.some((l) => l.student === u.id && l.date === d.date && ['cho-duyet', 'da-duyet'].includes(l.status))) return fail('B\u1ea1n \u0111\u00e3 \u0111\u0103ng k\u00fd v\u1ec1 mu\u1ed9n cho ng\u00e0y n\u00e0y.');
          const l = Object.assign({ id: nextId(K.db.lateReturns, 'VM-'), student: u.id, status: 'cho-duyet', at: K.now() }, d);
          K.db.lateReturns.push(l); K.save(); App.toast('\u0110\u00e3 g\u1eedi \u0111\u0103ng k\u00fd v\u1ec1 mu\u1ed9n ' + l.id); App.refresh();
        } else if (st.tab === 'gui-xe') {
          const d = { type: g('#x-type'), plate: plateNorm(g('#x-plate')), brand: g('#x-brand'), color: g('#x-color') };
          if (K.db.vehicles.some((v) => v.student === u.id && ['cho-duyet', 'dang-gui'].includes(v.status))) return fail('B\u1ea1n \u0111ang c\u00f3 m\u1ed9t xe g\u1eedi ho\u1eb7c ch\u1edd duy\u1ec7t.');
          if (VEH[d.type][2] && !plateOk(d.plate)) return fail('Bi\u1ec3n s\u1ed1 ch\u01b0a \u0111\u00fang \u0111\u1ecbnh d\u1ea1ng, v\u00ed d\u1ee5 37B1-123.45.');
          if (d.plate && K.db.vehicles.some((v) => v.plate === d.plate && ['cho-duyet', 'dang-gui'].includes(v.status))) return fail('Bi\u1ec3n s\u1ed1 n\u00e0y \u0111\u00e3 \u0111\u01b0\u1ee3c \u0111\u0103ng k\u00fd t\u1ea1i nh\u00e0 xe.');
          if (d.brand.length < 2 || d.color.length < 2) return fail('Nh\u1eadp h\u00e3ng, d\u00f2ng xe v\u00e0 m\u00e0u xe.');
          const v = Object.assign({ id: nextId(K.db.vehicles, 'GX-'), student: u.id, status: 'cho-duyet', fee: VEH[d.type][1], at: K.now() }, d);
          K.db.vehicles.push(v); K.save(); App.toast('\u0110\u00e3 g\u1eedi \u0111\u0103ng k\u00fd g\u1eedi xe ' + v.id); App.refresh();
        } else {
          const n = +g('#c-n');
          if (!Number.isInteger(n) || n < 1 || n > RULES.certMaxCopies) return fail('S\u1ed1 b\u1ea3n t\u1eeb 1 \u0111\u1ebfn ' + RULES.certMaxCopies + '.');
          if (K.db.certs.some((c) => c.student === u.id && c.status === 'cho-duyet')) return fail('B\u1ea1n \u0111ang c\u00f3 m\u1ed9t y\u00eau c\u1ea7u ch\u1edd x\u1eed l\u00fd.');
          const c = { id: nextId(K.db.certs, 'XN-'), student: u.id, purpose: g('#c-pur'), copies: n, note: g('#c-note'), status: 'cho-duyet', at: K.now() };
          K.db.certs.push(c); K.save(); App.toast('\u0110\u00e3 g\u1eedi y\u00eau c\u1ea7u ' + c.id); App.refresh();
        }
      };
    },
  };

  // ======================================================== Ban qu\u1ea3n l\u00fd
  const COLL = { khach: 'visitors', 've-muon': 'lateReturns', 'gui-xe': 'vehicles', 'xac-nhan': 'certs' };
  const stateOf = { visitors: visitState, lateReturns: lateState, vehicles: (x) => x.status, certs: (x) => x.status };
  const FILTERS = {
    khach: [['', 'T\u1ea5t c\u1ea3'], ['cho-duyet', 'Ch\u1edd duy\u1ec7t'], ['hom-nay', 'H\u00f4m nay'], ['da-vao', '\u0110ang trong KTX'], ['da-ra', '\u0110\u00e3 ra v\u1ec1'], ['tu-choi', 'T\u1eeb ch\u1ed1i']],
    've-muon': [['', 'T\u1ea5t c\u1ea3'], ['cho-duyet', 'Ch\u1edd duy\u1ec7t'], ['dem-nay', '\u0110\u00eam nay'], ['da-ve', '\u0110\u00e3 v\u1ec1'], ['ve-tre', 'V\u1ec1 qu\u00e1 gi\u1edd'], ['tu-choi', 'T\u1eeb ch\u1ed1i']],
    'gui-xe': [['', 'T\u1ea5t c\u1ea3'], ['cho-duyet', 'Ch\u1edd duy\u1ec7t'], ['dang-gui', '\u0110ang g\u1eedi'], ['da-huy', '\u0110\u00e3 h\u1ee7y'], ['tu-choi', 'T\u1eeb ch\u1ed1i']],
    'xac-nhan': [['', 'T\u1ea5t c\u1ea3'], ['cho-duyet', 'Ch\u1edd duy\u1ec7t'], ['da-cap', '\u0110\u00e3 c\u1ea5p'], ['tu-choi', 'T\u1eeb ch\u1ed1i']],
  };
  const pending = (k) => K.db[COLL[k]].filter((x) => x.status === 'cho-duyet').length;

  P['ql-dich-vu'] = {
    role: 'admin', title: 'An ninh & d\u1ecbch v\u1ee5',
    render: () => {
      const st = App.state('qldv', { tab: 'khach', f: 'cho-duyet', q: '', page: 1 });
      const coll = COLL[st.tab]; const t = today();
      let rows = K.db[coll].slice().reverse();
      if (st.f === 'hom-nay') rows = rows.filter((x) => x.date === t && ['da-duyet', 'da-vao', 'da-ra'].includes(x.status));
      else if (st.f === 'dem-nay') rows = rows.filter((x) => x.date === t && ['da-duyet', 'da-ve', 've-tre'].includes(x.status));
      else if (st.f) rows = rows.filter((x) => stateOf[coll](x) === st.f);
      if (st.q) { const q = st.q.toLowerCase(); rows = rows.filter((x) => (x.id + ' ' + x.student + ' ' + sname(x.student) + ' ' + (x.plate || '') + ' ' + (x.guests || []).map((g) => g.name).join(' ')).toLowerCase().includes(q)); }
      const per = 10, pages = Math.max(1, Math.ceil(rows.length / per)); if (st.page > pages) st.page = pages;
      const cur = rows.slice((st.page - 1) * per, st.page * per);
      const room = (sid) => { const s = K.student(sid); return s && s.room ? s.room + ' \u00b7 G' + b2(s.bed) : '\u2014'; };
      const who = (sid) => `<b>${esc(sname(sid))}</b><small class="muted" style="display:block">${sid} \u00b7 ${room(sid)}</small>`;
      const act = (x) => {
        const s = stateOf[coll](x); const a = [];
        if (s === 'cho-duyet') a.push(`<button class="btn btn-sm btn-red" data-do="ok:${x.id}">${st.tab === 'xac-nhan' ? 'C\u1ea5p gi\u1ea5y' : 'Duy\u1ec7t'}</button>`, `<button class="btn btn-sm btn-outline" data-do="no:${x.id}">T\u1eeb ch\u1ed1i</button>`);
        if (coll === 'visitors' && s === 'da-duyet' && x.date === t) a.push(`<button class="btn btn-sm btn-red" data-do="in:${x.id}">${ic('log-in')}Cho v\u00e0o</button>`);
        if (coll === 'visitors' && s === 'da-vao') a.push(`<button class="btn btn-sm btn-outline" data-do="out:${x.id}">${ic('log-out')}Ghi nh\u1eadn ra</button>`);
        if (coll === 'lateReturns' && s === 'da-duyet' && x.date <= t && x.date >= addDays(t, -1)) a.push(`<button class="btn btn-sm btn-red" data-do="back:${x.id}">${ic('log-in')}\u0110\u00e3 v\u1ec1</button>`);
        if (coll === 'vehicles' && s === 'dang-gui') a.push(`<button class="btn btn-sm btn-outline" data-do="revoke:${x.id}">Thu h\u1ed3i th\u1ebb</button>`);
        if (coll === 'certs' && s === 'da-cap') a.push(`<button class="btn btn-sm btn-outline" data-do="view:${x.id}">${ic('printer')}Xem / in</button>`);
        return `<div class="row" style="gap:6px;flex-wrap:wrap">${a.join('') || '<span class="muted small">\u2014</span>'}</div>`;
      };
      let head, body;
      if (coll === 'visitors') { head = '<th>M\u00e3</th><th>Sinh vi\u00ean</th><th>Kh\u00e1ch</th><th>Th\u1eddi gian</th><th>Tr\u1ea1ng th\u00e1i</th><th>Thao t\u00e1c</th>'; body = cur.map((x) => `<tr><td>${x.id}</td><td>${who(x.student)}</td><td>${x.guests.map((g) => `<div>${esc(g.name)} <small class="muted">(${esc(g.rel)} \u00b7 ${esc(g.phone)} \u00b7 CCCD *${esc(g.idno)})</small></div>`).join('')}<small class="muted">${esc(x.purpose)}</small></td><td>${V4.dmy(x.date)}<br><small class="muted">${x.from} \u2013 ${x.to}${x.inAt ? '<br>V\u00e0o ' + x.inAt.slice(-5) : ''}${x.outAt ? ' \u00b7 Ra ' + x.outAt.slice(-5) : ''}</small></td><td>${badge(stateOf[coll](x))}</td><td>${act(x)}</td></tr>`).join(''); }
      else if (coll === 'lateReturns') { head = '<th>M\u00e3</th><th>Sinh vi\u00ean</th><th>Ng\u00e0y</th><th>Gi\u1edd v\u1ec1</th><th>L\u00fd do</th><th>Tr\u1ea1ng th\u00e1i</th><th>Thao t\u00e1c</th>'; body = cur.map((x) => `<tr><td>${x.id}</td><td>${who(x.student)}</td><td>${V4.dmy(x.date)}</td><td>${x.time}${x.backAt ? `<br><small class="muted">V\u1ec1 ${x.backAt.slice(-5)}</small>` : ''}</td><td style="max-width:280px">${esc(x.reason)}<br><small class="muted">${esc(x.phone)}</small></td><td>${badge(stateOf[coll](x))}</td><td>${act(x)}</td></tr>`).join(''); }
      else if (coll === 'vehicles') { head = '<th>M\u00e3</th><th>Sinh vi\u00ean</th><th>Xe</th><th>Th\u1ebb</th><th>Ph\u00ed / th\u00e1ng</th><th>Tr\u1ea1ng th\u00e1i</th><th>Thao t\u00e1c</th>'; body = cur.map((x) => `<tr><td>${x.id}</td><td>${who(x.student)}</td><td>${esc(VEH[x.type][0])}${x.plate ? ' \u00b7 <b>' + esc(x.plate) + '</b>' : ''}<br><small class="muted">${esc(x.brand)} \u00b7 ${esc(x.color)}</small></td><td>${x.card ? esc(x.card) + '<br><small class="muted">t\u1eeb ' + x.from + '</small>' : '\u2014'}</td><td>${money(x.fee)}</td><td>${badge(x.status)}</td><td>${act(x)}</td></tr>`).join(''); }
      else { head = '<th>M\u00e3</th><th>Sinh vi\u00ean</th><th>M\u1ee5c \u0111\u00edch</th><th>S\u1ed1 b\u1ea3n</th><th>Ng\u00e0y g\u1eedi</th><th>Tr\u1ea1ng th\u00e1i</th><th>Thao t\u00e1c</th>'; body = cur.map((x) => `<tr><td>${x.id}</td><td>${who(x.student)}</td><td style="max-width:300px">${esc(x.purpose)}${x.note ? `<br><small class="muted">${esc(x.note)}</small>` : ''}${x.no ? `<br><small class="muted">S\u1ed1 ${esc(x.no)} \u00b7 ${x.issuedAt}</small>` : ''}</td><td>${x.copies}</td><td>${x.at.slice(0, 10)}</td><td>${badge(x.status)}</td><td>${act(x)}</td></tr>`).join(''); }
      const kpi = [
        ['users', 'Kh\u00e1ch th\u0103m h\u00f4m nay', K.db.visitors.filter((v) => v.date === t && ['da-duyet', 'da-vao', 'da-ra'].includes(v.status)).length, '\u0110ang trong KTX: ' + K.db.visitors.filter((v) => v.status === 'da-vao').length],
        ['moon', 'V\u1ec1 mu\u1ed9n \u0111\u00eam nay', K.db.lateReturns.filter((l) => l.date === t && l.status === 'da-duyet').length, 'Ch\u1edd duy\u1ec7t: ' + pending('ve-muon')],
        ['bike', 'Xe \u0111ang g\u1eedi', K.db.vehicles.filter((v) => v.status === 'dang-gui').length, 'Ch\u1edd duy\u1ec7t: ' + pending('gui-xe')],
        ['stamp', 'Gi\u1ea5y x\u00e1c nh\u1eadn ch\u1edd c\u1ea5p', pending('xac-nhan'), '\u0110\u00e3 c\u1ea5p: ' + K.db.certs.filter((c) => c.status === 'da-cap').length],
      ];
      return V4.adminShell({ active: 'ql-dich-vu', search: 'T\u00ecm sinh vi\u00ean, ph\u00f2ng, bi\u1ec3n s\u1ed1...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('sec_art')}" alt=""><h1>An ninh & d\u1ecbch v\u1ee5</h1><p class="desc">Duy\u1ec7t kh\u00e1ch th\u0103m, v\u1ec1 mu\u1ed9n, g\u1eedi xe, c\u1ea5p gi\u1ea5y x\u00e1c nh\u1eadn c\u01b0 tr\u00fa v\u00e0 ghi nh\u1eadn ra v\u00e0o t\u1ea1i c\u1ed5ng.</p></div>
        <div class="grid g4" style="gap:12px">${kpi.map(([i, l, v, s]) => `<div class="card kpi14"><span>${ic(i)}</span><div><small>${l}</small><b>${v}</b><em>${s}</em></div></div>`).join('')}</div>
        <div class="card pad" style="margin-top:14px">
          <div class="row" style="justify-content:space-between;gap:12px;flex-wrap:wrap"><div class="seg">${TABS.map(([k, tt, i]) => { const n = pending(k); return `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}">${ic(i)}${tt}${n ? ` <span class="cnt14">${n}</span>` : ''}</button>`; }).join('')}</div>
            <div class="row" style="gap:8px;flex-wrap:wrap">${sel('dv-f', FILTERS[st.tab], st.f, '', 'style="width:170px" aria-label="L\u1ecdc tr\u1ea1ng th\u00e1i"')}<div class="iwrap" style="width:240px">${ic('search')}<input id="dv-q" class="input" placeholder="T\u00ecm m\u00e3, sinh vi\u00ean, bi\u1ec3n s\u1ed1" value="${esc(st.q)}"></div></div></div>
          <div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><thead><tr>${head}</tr></thead><tbody>${body || `<tr><td colspan="7" style="text-align:center;padding:28px" class="muted">Kh\u00f4ng c\u00f3 y\u00eau c\u1ea7u n\u00e0o ph\u00f9 h\u1ee3p.</td></tr>`}</tbody></table></div>
          <div class="row" style="justify-content:space-between;margin-top:10px"><span class="muted small">${rows.length} y\u00eau c\u1ea7u</span>${pages > 1 ? `<div class="row" style="gap:6px"><button class="btn btn-sm btn-outline" data-pg="-1" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left')}</button><span class="small">Trang ${st.page}/${pages}</span><button class="btn btn-sm btn-outline" data-pg="1" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right')}</button></div>` : ''}</div></div>`);
    },
    mount: (root) => {
      const st = App.st.qldv; const coll = COLL[st.tab];
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { Object.assign(st, { tab: b.dataset.tab, f: 'cho-duyet', q: '', page: 1 }); App.refresh(); });
      root.querySelector('#dv-f').onchange = (e) => { st.f = e.target.value; st.page = 1; App.refresh(); };
      const q = root.querySelector('#dv-q'); q.onchange = () => { st.q = q.value.trim(); st.page = 1; App.refresh(); };
      root.querySelectorAll('[data-pg]').forEach((b) => b.onclick = () => { st.page += +b.dataset.pg; App.refresh(); });
      const done = (msg) => { K.save(); App.toast(msg); App.refresh(); };
      root.querySelectorAll('[data-do]').forEach((b) => b.onclick = () => {
        const [op, id] = b.dataset.do.split(':'); const x = K.db[coll].find((y) => y.id === id); if (!x) return;
        const nm = sname(x.student);
        if (op === 'view') return showCert(x);
        if (op === 'no') return App.modal({ title: 'T\u1eeb ch\u1ed1i ' + id, body: `<div class="field"><label for="dv-why">L\u00fd do t\u1eeb ch\u1ed1i <span class="req">*</span></label><textarea id="dv-why" class="textarea" placeholder="L\u00fd do s\u1ebd \u0111\u01b0\u1ee3c g\u1eedi t\u1edbi sinh vi\u00ean"></textarea></div><p class="err" id="dv-e" hidden></p>`, foot: `<button class="btn btn-outline" data-x>H\u1ee7y</button><button class="btn btn-outline-red" data-ok>T\u1eeb ch\u1ed1i</button>`,
          onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const w = el.querySelector('#dv-why').value.trim(); if (w.length < 5) { const e = el.querySelector('#dv-e'); e.textContent = 'Nh\u1eadp l\u00fd do (t\u1ed1i thi\u1ec3u 5 k\u00fd t\u1ef1).'; e.hidden = false; return; } x.status = 'tu-choi'; x.why = w; x.by = 'Qu\u1ea3n tr\u1ecb vi\u00ean'; V4.notify(x.student, 'Y\u00eau c\u1ea7u ' + id + ' b\u1ecb t\u1eeb ch\u1ed1i', 'Ban qu\u1ea3n l\u00fd t\u1eeb ch\u1ed1i y\u00eau c\u1ea7u ' + id + '. L\u00fd do: ' + w); V4.log('T\u1eeb ch\u1ed1i y\u00eau c\u1ea7u', 'T\u1eeb ch\u1ed1i ' + id + ' c\u1ee7a ' + nm); close(); done('\u0110\u00e3 t\u1eeb ch\u1ed1i ' + id); } });
        if (op === 'ok') {
          if (coll === 'visitors') { x.status = 'da-duyet'; x.by = 'Qu\u1ea3n tr\u1ecb vi\u00ean'; V4.notify(x.student, '\u0110\u00e3 duy\u1ec7t kh\u00e1ch th\u0103m ' + id, 'Kh\u00e1ch c\u1ee7a b\u1ea1n \u0111\u01b0\u1ee3c v\u00e0o th\u0103m ng\u00e0y ' + V4.dmy(x.date) + ' t\u1eeb ' + x.from + ' \u0111\u1ebfn ' + x.to + '. Kh\u00e1ch xu\u1ea5t tr\u00ecnh CCCD t\u1ea1i qu\u1ea7y b\u1ea3o v\u1ec7.'); V4.log('Duy\u1ec7t kh\u00e1ch th\u0103m', 'Duy\u1ec7t ' + id + ' c\u1ee7a ' + nm); return done('\u0110\u00e3 duy\u1ec7t ' + id); }
          if (coll === 'lateReturns') { x.status = 'da-duyet'; x.by = 'Qu\u1ea3n tr\u1ecb vi\u00ean'; V4.notify(x.student, '\u0110\u00e3 duy\u1ec7t v\u1ec1 mu\u1ed9n ' + id, 'B\u1ea1n \u0111\u01b0\u1ee3c v\u1ec1 mu\u1ed9n ng\u00e0y ' + V4.dmy(x.date) + ', ch\u1eadm nh\u1ea5t l\u00fac ' + x.time + '. Li\u00ean h\u1ec7 b\u1ea3o v\u1ec7 khi \u0111\u1ebfn c\u1ed5ng.'); V4.log('Duy\u1ec7t v\u1ec1 mu\u1ed9n', 'Duy\u1ec7t ' + id + ' c\u1ee7a ' + nm); return done('\u0110\u00e3 duy\u1ec7t ' + id); }
          if (coll === 'vehicles') {
            if (x.plate && K.db.vehicles.some((v) => v.id !== x.id && v.plate === x.plate && v.status === 'dang-gui')) return App.toast('Bi\u1ec3n s\u1ed1 n\u00e0y \u0111ang g\u1eedi t\u1ea1i nh\u00e0 xe', 'err');
            const n = K.db.vehicles.filter((v) => v.card).length + 1; const s = K.student(x.student) || {};
            Object.assign(x, { status: 'dang-gui', card: 'TH\u1eba ' + String(n).padStart(4, '0'), from: K.today(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean' });
            const d = new Date(); const period = b2(d.getMonth() + 1) + '/' + d.getFullYear(); const due = new Date(d.getTime() + 10 * 864e5);
            K.db.invoices.unshift({ id: 'GX' + period.replace('/', '').slice(0, 2) + period.slice(-2) + '-' + x.id.slice(-4), kind: 'gui-xe', vehicle: x.id, student: x.student, period, room: s.room, khu: s.room ? K.fl(s.room) : '', items: [{ name: 'Ph\u00ed g\u1eedi ' + VEH[x.type][0].toLowerCase() + ' th\u00e1ng ' + period + (x.plate ? ' (' + x.plate + ')' : ''), amount: x.fee }], total: x.fee, status: 'chua-tt', due: b2(due.getDate()) + '/' + b2(due.getMonth() + 1) + '/' + due.getFullYear() });
            V4.notify(x.student, '\u0110\u00e3 duy\u1ec7t g\u1eedi xe ' + id, 'Xe c\u1ee7a b\u1ea1n \u0111\u01b0\u1ee3c g\u1eedi t\u1ea1i nh\u00e0 xe KTX, s\u1ed1 th\u1ebb ' + x.card + '. Nh\u1eadn th\u1ebb t\u1ea1i qu\u1ea7y b\u1ea3o v\u1ec7 v\u00e0 thanh to\u00e1n ph\u00ed g\u1eedi xe th\u00e1ng ' + period + ' tr\u00ean m\u1ee5c H\u00f3a \u0111\u01a1n.');
            V4.log('Duy\u1ec7t g\u1eedi xe', 'C\u1ea5p ' + x.card + ' cho ' + nm + (x.plate ? ' \u2013 ' + x.plate : '')); return done('\u0110\u00e3 duy\u1ec7t v\u00e0 c\u1ea5p ' + x.card);
          }
          const yr = new Date().getFullYear(); const n = K.db.certs.filter((c) => c.no).length + 1;
          Object.assign(x, { status: 'da-cap', no: String(n).padStart(4, '0') + '/XN-KTX', issuedAt: K.today(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', year: yr });
          V4.notify(x.student, '\u0110\u00e3 c\u1ea5p gi\u1ea5y x\u00e1c nh\u1eadn c\u01b0 tr\u00fa', 'Gi\u1ea5y x\u00e1c nh\u1eadn c\u01b0 tr\u00fa s\u1ed1 ' + x.no + ' \u0111\u00e3 \u0111\u01b0\u1ee3c c\u1ea5p. Xem v\u00e0 in t\u1ea1i m\u1ee5c D\u1ecbch v\u1ee5, b\u1ea3n c\u00f3 d\u1ea5u nh\u1eadn t\u1ea1i v\u0103n ph\u00f2ng t\u1ea7ng 1.');
          V4.log('C\u1ea5p gi\u1ea5y x\u00e1c nh\u1eadn', 'C\u1ea5p gi\u1ea5y x\u00e1c nh\u1eadn c\u01b0 tr\u00fa ' + x.no + ' cho ' + nm); K.save(); App.refresh(); return showCert(x);
        }
        if (op === 'in') { x.status = 'da-vao'; x.inAt = K.now(); V4.log('Kh\u00e1ch v\u00e0o KTX', 'Kh\u00e1ch c\u1ee7a ' + nm + ' v\u00e0o l\u00fac ' + x.inAt.slice(-5) + ' (' + id + ')'); return done('\u0110\u00e3 ghi nh\u1eadn kh\u00e1ch v\u00e0o'); }
        if (op === 'out') { x.status = 'da-ra'; x.outAt = K.now(); V4.log('Kh\u00e1ch ra v\u1ec1', 'Kh\u00e1ch c\u1ee7a ' + nm + ' ra l\u00fac ' + x.outAt.slice(-5) + ' (' + id + ')'); return done('\u0110\u00e3 ghi nh\u1eadn kh\u00e1ch ra v\u1ec1'); }
        if (op === 'back') {
          const late = Date.now() > lateAt(x).getTime() + 5 * 60000;
          x.status = late ? 've-tre' : 'da-ve'; x.backAt = K.now(); V4.log('Ghi nh\u1eadn v\u1ec1 mu\u1ed9n', nm + ' v\u1ec1 KTX l\u00fac ' + x.backAt.slice(-5) + ' (' + id + ')');
          return done(late ? '\u0110\u00e3 ghi nh\u1eadn \u2013 sinh vi\u00ean v\u1ec1 qu\u00e1 gi\u1edd \u0111\u0103ng k\u00fd' : '\u0110\u00e3 ghi nh\u1eadn sinh vi\u00ean v\u1ec1 KTX');
        }
        if (op === 'revoke') return App.confirm('Thu h\u1ed3i th\u1ebb xe', 'Thu h\u1ed3i ' + esc(x.card) + ' c\u1ee7a <b>' + esc(nm) + '</b>?', 'Thu h\u1ed3i', () => { x.status = 'da-huy'; x.cancelAt = K.now(); V4.notify(x.student, '\u0110\u00e3 ng\u1eebng g\u1eedi xe ' + id, 'Th\u1ebb ' + x.card + ' \u0111\u00e3 \u0111\u01b0\u1ee3c thu h\u1ed3i.'); V4.log('Thu h\u1ed3i th\u1ebb xe', 'Thu h\u1ed3i ' + x.card + ' c\u1ee7a ' + nm); done('\u0110\u00e3 thu h\u1ed3i ' + x.card); }, true);
      });
    },
  };

  // ======================================================== T\u00e0i ch\u00ednh: ph\u00e1t h\u00e0nh h\u00f3a \u0111\u01a1n ti\u1ec1n ph\u00f2ng h\u1eb1ng th\u00e1ng
  const nowPeriod = () => { const d = new Date(); return b2(d.getMonth() + 1) + '/' + d.getFullYear(); };
  const roomBills = (period) => K.db.invoices.filter((i) => i.period === period && !i.kind);
  App.issueRoomBills = (period) => {
    const [mm, yy] = period.split('/');
    const have = new Set(roomBills(period).map((i) => i.student));
    const list = K.db.students.filter((s) => s.status === 'dang-o' && s.room && !have.has(s.id));
    let n = Math.max(0, ...K.db.invoices.filter((i) => i.id.startsWith('H\u0110' + mm + yy.slice(-2) + '-')).map((i) => +i.id.split('-').pop() || 0));
    list.forEach((s) => {
      const r = K.room(s.room); if (!r) return;
      K.db.invoices.unshift({ id: 'H\u0110' + mm + yy.slice(-2) + '-' + String(++n).padStart(4, '0'), student: s.id, period, room: s.room, khu: K.fl(s.room), items: [{ name: 'Ti\u1ec1n ph\u00f2ng (th\u00e1ng ' + period + ')', amount: r.price }, { name: 'Ti\u1ec1n \u0111i\u1ec7n (theo \u0111\u1ecbnh m\u1ee9c)', amount: 30000 }, { name: 'Ti\u1ec1n n\u01b0\u1edbc (theo \u0111\u1ecbnh m\u1ee9c)', amount: 20000 }], total: r.price + 50000, status: 'chua-tt', due: '25/' + period, issuedAt: K.today() });
    });
    if (list.length) {
      K.db.notifications.unshift({ id: 'N' + Date.now(), target: 'Sinh vi\u00ean \u0111ang l\u01b0u tr\u00fa', title: 'Th\u00f4ng b\u00e1o thu ti\u1ec1n ph\u00f2ng th\u00e1ng ' + period, summary: 'H\u00f3a \u0111\u01a1n th\u00e1ng ' + period + ' \u0111\u00e3 \u0111\u01b0\u1ee3c ph\u00e1t h\u00e0nh, h\u1ea1n thanh to\u00e1n 25/' + period + '.', cat: 'L\u01b0u tr\u00fa', icon: 'ni_invoice', time: 'V\u1eeba xong', author: 'Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', month: 'Th\u00e1ng ' + period, important: true, read: false, body: ['H\u00f3a \u0111\u01a1n ti\u1ec1n ph\u00f2ng th\u00e1ng ' + period + ' \u0111\u00e3 \u0111\u01b0\u1ee3c ph\u00e1t h\u00e0nh tr\u00ean c\u1ed5ng sinh vi\u00ean.', 'Vui l\u00f2ng thanh to\u00e1n tr\u01b0\u1edbc ng\u00e0y 25/' + period + '. Ti\u1ec1n \u0111i\u1ec7n n\u01b0\u1edbc v\u01b0\u1ee3t \u0111\u1ecbnh m\u1ee9c (n\u1ebfu c\u00f3) \u0111\u01b0\u1ee3c t\u00ednh sau khi ch\u1ed1t ch\u1ec9 s\u1ed1 cu\u1ed1i th\u00e1ng.'] });
      V4.log('Ph\u00e1t h\u00e0nh h\u00f3a \u0111\u01a1n', 'Ph\u00e1t h\u00e0nh ' + list.length + ' h\u00f3a \u0111\u01a1n ti\u1ec1n ph\u00f2ng th\u00e1ng ' + period, 'doc');
    }
    K.save();
    return list.length;
  };
  const finPage = P['ql-doi-soat'];
  if (finPage) {
    const m0 = finPage.mount;
    finPage.mount = (root, param) => {
      if (m0) m0(root, param);
      const per = nowPeriod(); const residents = K.db.students.filter((s) => s.status === 'dang-o').length;
      const done = new Set(roomBills(per).map((i) => i.student)); const left = K.db.students.filter((s) => s.status === 'dang-o' && !done.has(s.id)).length;
      const h = root.querySelector('.phead'); if (!h) return;
      const box = document.createElement('div'); box.className = 'bill14';
      box.innerHTML = left ? `<button class="btn btn-red" id="bill14">${ic('receipt-text')}Ph\u00e1t h\u00e0nh h\u00f3a \u0111\u01a1n ti\u1ec1n ph\u00f2ng th\u00e1ng ${per}</button><small>${left}/${residents} sinh vi\u00ean \u0111ang \u1edf ch\u01b0a c\u00f3 h\u00f3a \u0111\u01a1n th\u00e1ng ${per}</small>` : `<span class="badge b-green">${ic('circle-check')}\u0110\u00e3 ph\u00e1t h\u00e0nh \u0111\u1ee7 h\u00f3a \u0111\u01a1n th\u00e1ng ${per} (${residents} sinh vi\u00ean)</span>`;
      h.appendChild(box); App.icons(box);
      const b = box.querySelector('#bill14'); if (b) b.onclick = () => App.confirm('Ph\u00e1t h\u00e0nh h\u00f3a \u0111\u01a1n th\u00e1ng ' + per, 'L\u1eadp h\u00f3a \u0111\u01a1n ti\u1ec1n ph\u00f2ng th\u00e1ng <b>' + per + '</b> cho <b>' + left + '</b> sinh vi\u00ean \u0111ang \u1edf (ti\u1ec1n ph\u00f2ng theo lo\u1ea1i ph\u00f2ng + \u0111i\u1ec7n n\u01b0\u1edbc \u0111\u1ecbnh m\u1ee9c), h\u1ea1n thanh to\u00e1n 25/' + per + '. Sinh vi\u00ean nh\u1eadn th\u00f4ng b\u00e1o tr\u00ean c\u1ed5ng sinh vi\u00ean.', 'Ph\u00e1t h\u00e0nh', () => {
        const n = App.issueRoomBills(per); if (App.st.fin) App.st.fin.period = per;
        App.toast('\u0110\u00e3 ph\u00e1t h\u00e0nh ' + n + ' h\u00f3a \u0111\u01a1n th\u00e1ng ' + per); App.refresh();
      });
    };
  }
})();
