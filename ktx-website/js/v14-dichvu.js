/* v14 – Dịch vụ & an ninh ký túc xá: khách thăm, đăng ký về muộn, gửi xe, giấy xác nhận cư trú.
   Sinh viên gửi yêu cầu (sv-dich-vu), Ban quản lý duyệt, ghi nhận ra vào, cấp thẻ xe, cấp giấy (ql-dich-vu). */
(function () {
  const K = window.KTX, { esc, ic, sel } = App;
  const P = App.pages, V4 = App.v4;
  const b2 = K.pad2, money = K.money;

  // ---------- quy định ----------
  const RULES = {
    visitFrom: '07:00', visitTo: '22:00', visitMaxGuests: 3, visitAhead: 14,
    lateFrom: '23:00', lateTo: '01:00', lateAhead: 7, latePerMonth: 4,
    certMaxCopies: 5,
  };
  const VEH = { 'xe-dap': ['Xe đạp', 30000, false, 'bike'], 'xe-dap-dien': ['Xe đạp điện', 50000, false, 'bike'], 'xe-may': ['Xe máy', 70000, true, 'motorbike'], 'xe-may-dien': ['Xe máy điện', 60000, true, 'motorbike'] };
  const RELS = ['Bố / mẹ', 'Anh / chị / em ruột', 'Họ hàng', 'Bạn bè', 'Giảng viên, cán bộ trường', 'Khác'];
  const PURPOSES = ['Đăng ký tạm trú với công an phường', 'Bổ sung hồ sơ vay vốn tín dụng sinh viên', 'Hồ sơ miễn, giảm học phí', 'Hồ sơ xét học bổng', 'Xác nhận nơi ở cho gia đình', 'Mục đích khác'];
  const ST = {
    'cho-duyet': ['Chờ duyệt', 'orange', 'clock'], 'da-duyet': ['Đã duyệt', 'blue', 'circle-check'], 'da-vao': ['Đang trong KTX', 'green', 'log-in'],
    'da-ra': ['Đã ra về', 'gray', 'log-out'], 'tu-choi': ['Từ chối', 'red', 'circle-x'], 'da-huy': ['Đã hủy', 'gray', 'ban'], 'qua-han': ['Hết hiệu lực', 'gray', 'clock-alert'],
    'da-ve': ['Đã về KTX', 'green', 'circle-check'], 've-tre': ['Về quá giờ đăng ký', 'red', 'triangle-alert'], 'dang-gui': ['Đang gửi xe', 'green', 'circle-check'],
    'da-cap': ['Đã cấp giấy', 'green', 'stamp'],
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
  const lateMin = (t) => { const m = toMin(t); return m < 12 * 60 ? m + 24 * 60 : m; }; // 00:30 → sau 23:00
  const lateAt = (l) => { const d = new Date(l.date + 'T' + l.time + ':00'); if (toMin(l.time) < 12 * 60) d.setDate(d.getDate() + 1); return d; };

  // ---------- dữ liệu mẫu ----------
  const seed = () => {
    const t = today();
    const live = K.db.students.filter((s) => s.status === 'dang-o');
    const S = (i) => live[i % live.length].id;
    K.db.visitors = [
      { id: 'KT-0001', student: 'SV260001', guests: [{ name: 'Nguyễn Văn Bình', rel: 'Bố / mẹ', phone: '0912345678', idno: '4521' }], date: t, from: '15:00', to: '17:00', purpose: 'Thăm con, gửi đồ dùng cá nhân', status: 'da-duyet', at: K.now(), by: 'Quản trị viên' },
      { id: 'KT-0002', student: S(20), guests: [{ name: 'Trần Thu Hà', rel: 'Anh / chị / em ruột', phone: '0987654321', idno: '1188' }], date: t, from: '09:00', to: '10:30', purpose: 'Thăm em gái', status: 'da-vao', inAt: t.split('-').reverse().join('/') + ' 09:05', at: K.now(), by: 'Quản trị viên' },
      { id: 'KT-0003', student: S(57), guests: [{ name: 'Lê Minh Tú', rel: 'Bạn bè', phone: '0905111222', idno: '7720' }, { name: 'Phạm Anh Khoa', rel: 'Bạn bè', phone: '0905333444', idno: '6612' }], date: addDays(t, 1), from: '18:30', to: '20:30', purpose: 'Học nhóm môn Kinh tế vi mô', status: 'cho-duyet', at: K.now() },
      { id: 'KT-0004', student: S(140), guests: [{ name: 'Hoàng Thị Lan', rel: 'Bố / mẹ', phone: '0977222333', idno: '3045' }], date: addDays(t, -3), from: '08:00', to: '11:00', purpose: 'Đưa đồ ăn, thăm hỏi', status: 'da-ra', inAt: '', outAt: '', at: K.now(), by: 'Quản trị viên' },
    ];
    K.db.lateReturns = [
      { id: 'VM-0001', student: S(33), date: t, time: '23:30', reason: 'Làm thêm ca tối tại cửa hàng, tan ca 23:00', phone: '0912777888', status: 'da-duyet', at: K.now(), by: 'Quản trị viên' },
      { id: 'VM-0002', student: 'SV260001', date: addDays(t, -6), time: '23:15', reason: 'Tham gia chương trình văn nghệ của Đoàn trường', phone: '0912341234', status: 'da-ve', backAt: '', at: K.now(), by: 'Quản trị viên' },
      { id: 'VM-0003', student: S(91), date: addDays(t, 2), time: '00:30', reason: 'Đón người thân ở ga Vinh, tàu đến lúc 23:50', phone: '0903555666', status: 'cho-duyet', at: K.now() },
    ];
    K.db.vehicles = [
      { id: 'GX-0001', student: 'SV260001', type: 'xe-may', plate: '37B1-123.45', brand: 'Honda Wave Alpha', color: 'Đen', status: 'dang-gui', card: 'THẺ 0001', from: '01/09/2026', fee: 70000, at: '28/08/2026 09:00' },
      { id: 'GX-0002', student: S(12), type: 'xe-dap', plate: '', brand: 'Thống Nhất', color: 'Xanh', status: 'dang-gui', card: 'THẺ 0002', from: '05/09/2026', fee: 30000, at: '03/09/2026 15:20' },
      { id: 'GX-0003', student: S(76), type: 'xe-may-dien', plate: '37MĐ1-456.78', brand: 'VinFast Evo200', color: 'Trắng', status: 'cho-duyet', fee: 60000, at: K.now() },
    ];
    K.db.certs = [
      { id: 'XN-0001', student: 'SV260001', purpose: 'Bổ sung hồ sơ vay vốn tín dụng sinh viên', copies: 2, note: '', status: 'da-cap', no: '0001/XN-KTX', issuedAt: '20/10/2026', at: '18/10/2026 10:15', by: 'Quản trị viên' },
      { id: 'XN-0002', student: S(48), purpose: 'Đăng ký tạm trú với công an phường', copies: 1, note: 'Cần nộp trước ngày 20 tháng này', status: 'cho-duyet', at: K.now() },
    ];
    K.db.v14 = 1;
  };
  const ensure = () => { if (!K.db.v14 || !K.db.visitors) { seed(); K.save(); } };
  ensure();
  const origReset = K.reset; K.reset = () => { origReset(); delete K.db.v14; ensure(); };

  // nhãn "Dữ liệu minh họa" không còn cần thiết: mọi số liệu đều lấy từ cơ sở dữ liệu
  V4.demo = '';

  // ---------- menu ----------
  const addNav = (nav, after, item) => { if (!nav || nav.some((x) => x[0] === item[0])) return; const i = nav.findIndex((x) => x[0] === after); nav.splice(i < 0 ? nav.length - 1 : i + 1, 0, item); };
  addNav(App.SV_NAV, 'sv-ho-tro', ['sv-dich-vu', 'Dịch vụ', 'concierge-bell']);
  addNav(App.QL_NAV, 'ql-cu-tru', ['ql-dich-vu', 'An ninh & dịch vụ', 'shield-check']);

  // ---------- giấy xác nhận cư trú (dùng chung cho SV và BQL) ----------
  const certHtml = (c) => {
    const s = K.student(c.student) || {}; const r = K.room(s.room) || {}; const g = K.db.general;
    const d = (c.issuedAt || K.today()).split('/');
    return `<div class="cert14" id="cert-${c.id}">
      <div class="cert14-h"><div><b>TRƯỜNG ĐẠI HỌC NGHỆ AN</b><small>BAN QUẢN LÝ KÝ TÚC XÁ</small><small>Số: ${esc(c.no || '…/XN-KTX')}</small></div><div><b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><small><u>Độc lập – Tự do – Hạnh phúc</u></small></div></div>
      <h2>GIẤY XÁC NHẬN CƯ TRÚ</h2>
      <p>Ban quản lý Ký túc xá Trường Đại học Nghệ An xác nhận:</p>
      <div class="cert14-grid"><span>Họ và tên sinh viên:</span><b>${esc(s.name || '')}</b><span>Mã sinh viên:</span><b>${esc(s.id || '')}</b><span>Lớp – Khoa:</span><b>${esc((s.cls || '') + ' – ' + (s.faculty || ''))}</b><span>Khóa học:</span><b>${esc(s.course || '')}</b><span>Nơi ở hiện tại:</span><b>Phòng ${esc(s.room || '…')}, giường ${s.bed ? b2(s.bed) : '…'}, tầng ${esc(r.khu || '…')} – ${esc(g.name)}, ${esc(g.address)}</b><span>Thời gian lưu trú:</span><b>Từ ngày ${esc(s.since || '01/09/2026')} đến nay</b></div>
      <p>Sinh viên hiện đang lưu trú tại Ký túc xá và chấp hành nội quy của nhà trường.</p>
      <p>Giấy xác nhận được cấp để: <b>${esc(c.purpose)}</b>${c.note ? ' (' + esc(c.note) + ')' : ''}. Giấy có giá trị trong 30 ngày kể từ ngày ký.</p>
      <div class="cert14-sign"><i>Nghệ An, ngày ${d[0]} tháng ${d[1]} năm ${d[2]}</i><b>TRƯỞNG BAN QUẢN LÝ KÝ TÚC XÁ</b><small>(Đã ký và đóng dấu)</small></div>
    </div>`;
  };
  const showCert = (c) => App.modal({ title: 'Giấy xác nhận cư trú ' + (c.no || ''), wide: true, body: certHtml(c), foot: `<button class="btn btn-outline" data-x>Đóng</button><button class="btn btn-red" data-ok>${ic('printer')}In / Lưu PDF</button>`,
    onMount: (el) => { el.querySelector('[data-ok]').onclick = () => App.printEl(el.querySelector('.cert14'), 'Giấy xác nhận cư trú ' + c.id); } });

  // ======================================================== Sinh viên
  const TABS = [['khach', 'Khách thăm', 'users'], ['ve-muon', 'Đăng ký về muộn', 'moon'], ['gui-xe', 'Gửi xe', 'bike'], ['xac-nhan', 'Xác nhận cư trú', 'stamp']];
  const empty = (t) => `<div class="empty14">${ic('inbox')}<p>${t}</p></div>`;

  P['sv-dich-vu'] = {
    role: 'student', title: 'Dịch vụ ký túc xá',
    render: () => {
      const u = K.me(); const st = App.state('svdv', { tab: 'khach', guests: 1 });
      const live = u.status === 'dang-o' && u.room;
      const lock = live ? '' : `<div class="warn-bar">${ic('info')}<span><b>Bạn chưa có phòng ở ký túc xá</b><small>Các dịch vụ này chỉ dành cho sinh viên đang lưu trú.</small></span></div>`;
      const dis = live ? '' : 'disabled';
      let form = '', list = '';
      if (st.tab === 'khach') {
        const mine = K.db.visitors.filter((v) => v.student === u.id).slice().reverse();
        form = `<form class="card pad" id="dv-f" novalidate><h2 class="card-t" style="font-size:20px">${ic('user-plus')}Đăng ký khách đến thăm</h2>${lock}
          <p class="muted small" style="margin-top:6px">Giờ thăm ${RULES.visitFrom} – ${RULES.visitTo} hằng ngày. Khách xuất trình CCCD tại quầy bảo vệ, không ở lại qua đêm. Tối đa ${RULES.visitMaxGuests} khách mỗi lượt.</p>
          <div class="grid g3" style="gap:12px;margin-top:12px"><div class="field"><label for="v-date">Ngày thăm <span class="req">*</span></label><input id="v-date" type="date" class="input" min="${today()}" max="${addDays(today(), RULES.visitAhead)}" value="${today()}"></div>
            <div class="field"><label for="v-from">Từ giờ <span class="req">*</span></label><input id="v-from" type="time" class="input" min="${RULES.visitFrom}" max="${RULES.visitTo}" value="17:00"></div>
            <div class="field"><label for="v-to">Đến giờ <span class="req">*</span></label><input id="v-to" type="time" class="input" min="${RULES.visitFrom}" max="${RULES.visitTo}" value="19:00"></div></div>
          ${Array.from({ length: st.guests }, (_, i) => `<fieldset class="guest14"><legend>Khách ${i + 1}</legend><div class="grid g2" style="gap:10px"><div class="field"><label for="g-n${i}">Họ và tên <span class="req">*</span></label><input id="g-n${i}" class="input" autocomplete="off"></div><div class="field"><label for="g-r${i}">Quan hệ <span class="req">*</span></label>${sel('g-r' + i, RELS, RELS[0])}</div><div class="field"><label for="g-p${i}">Số điện thoại <span class="req">*</span></label><input id="g-p${i}" class="input" inputmode="tel" placeholder="0912 345 678"></div><div class="field"><label for="g-i${i}">4 số cuối CCCD <span class="req">*</span></label><input id="g-i${i}" class="input" inputmode="numeric" maxlength="4" placeholder="1234"></div></div></fieldset>`).join('')}
          <div class="row" style="gap:8px;margin-top:8px">${st.guests < RULES.visitMaxGuests ? `<button type="button" class="btn btn-outline btn-sm" id="g-add">${ic('plus')}Thêm khách</button>` : ''}${st.guests > 1 ? `<button type="button" class="btn btn-outline btn-sm" id="g-rm">${ic('minus')}Bớt khách</button>` : ''}</div>
          <div class="field" style="margin-top:12px"><label for="v-pur">Mục đích thăm <span class="req">*</span></label><input id="v-pur" class="input" maxlength="120" placeholder="Ví dụ: thăm con, gửi đồ dùng cá nhân"></div>
          <p class="err" id="dv-err" hidden style="margin-top:8px"></p>
          <button class="btn btn-red btn-block btn-lg" style="margin-top:14px" ${dis}>${ic('send')}Gửi đăng ký khách thăm</button></form>`;
        list = mine.length ? mine.map((v) => `<div class="req14"><div class="row" style="justify-content:space-between;gap:8px"><b>${v.id} · ${V4.dmy(v.date)} · ${v.from} – ${v.to}</b>${badge(visitState(v))}</div>
          <p>${v.guests.map((g) => esc(g.name) + ' (' + esc(g.rel) + ')').join(', ')}</p><small>${esc(v.purpose)}${v.reason ? ' · Lý do: ' + esc(v.reason) : ''}${v.inAt ? ' · Vào lúc ' + v.inAt : ''}${v.outAt ? ' · Ra lúc ' + v.outAt : ''}</small>
          ${v.status === 'cho-duyet' || (v.status === 'da-duyet' && v.date >= today()) ? `<button class="link link-red small" data-cancel="visitors:${v.id}">${ic('x')}Hủy đăng ký</button>` : ''}</div>`).join('') : empty('Bạn chưa đăng ký khách thăm nào.');
      } else if (st.tab === 've-muon') {
        const mine = K.db.lateReturns.filter((l) => l.student === u.id).slice().reverse();
        const month = today().slice(0, 7); const used = mine.filter((l) => l.date.slice(0, 7) === month && !['tu-choi', 'da-huy'].includes(l.status)).length;
        form = `<form class="card pad" id="dv-f" novalidate><h2 class="card-t" style="font-size:20px">${ic('moon')}Đăng ký về muộn</h2>${lock}
          <p class="muted small" style="margin-top:6px">Cổng ký túc xá đóng lúc ${RULES.lateFrom}. Sinh viên về sau giờ này phải đăng ký trước, giờ về muộn nhất ${RULES.lateTo}. Mỗi tháng tối đa ${RULES.latePerMonth} lần (tháng này đã dùng <b>${used}</b>).</p>
          <div class="grid g2" style="gap:12px;margin-top:12px"><div class="field"><label for="l-date">Ngày về muộn <span class="req">*</span></label><input id="l-date" type="date" class="input" min="${today()}" max="${addDays(today(), RULES.lateAhead)}" value="${today()}"></div>
            <div class="field"><label for="l-time">Giờ dự kiến về <span class="req">*</span></label><input id="l-time" type="time" class="input" value="23:30"></div></div>
          <div class="field" style="margin-top:12px"><label for="l-why">Lý do <span class="req">*</span></label><textarea id="l-why" class="textarea" style="min-height:80px" maxlength="300" placeholder="Ví dụ: làm thêm ca tối, tham gia hoạt động của trường..."></textarea></div>
          <div class="field" style="margin-top:12px"><label for="l-ph">Số điện thoại liên hệ <span class="req">*</span></label><input id="l-ph" class="input" inputmode="tel" value="${esc(u.phone || '')}"></div>
          <p class="err" id="dv-err" hidden style="margin-top:8px"></p>
          <button class="btn btn-red btn-block btn-lg" style="margin-top:14px" ${dis}>${ic('send')}Gửi đăng ký về muộn</button></form>`;
        list = mine.length ? mine.map((l) => `<div class="req14"><div class="row" style="justify-content:space-between;gap:8px"><b>${l.id} · ${V4.dmy(l.date)} · về lúc ${l.time}</b>${badge(lateState(l))}</div><small>${esc(l.reason)}${l.backAt ? ' · Ghi nhận về lúc ' + l.backAt : ''}${l.why ? ' · Lý do từ chối: ' + esc(l.why) : ''}</small>
          ${l.status === 'cho-duyet' ? `<button class="link link-red small" data-cancel="lateReturns:${l.id}">${ic('x')}Hủy đăng ký</button>` : ''}</div>`).join('') : empty('Bạn chưa có đăng ký về muộn nào.');
      } else if (st.tab === 'gui-xe') {
        const mine = K.db.vehicles.filter((v) => v.student === u.id).slice().reverse();
        const active = mine.find((v) => ['cho-duyet', 'dang-gui'].includes(v.status));
        form = `<form class="card pad" id="dv-f" novalidate><h2 class="card-t" style="font-size:20px">${ic('bike')}Đăng ký gửi xe tại nhà xe KTX</h2>${lock}
          <div class="fee14">${Object.values(VEH).map(([t, f]) => `<span>${t}<b>${money(f)}/tháng</b></span>`).join('')}</div>
          <p class="muted small" style="margin-top:6px">Mỗi sinh viên gửi 1 xe. Sau khi được duyệt, bạn nhận thẻ xe tại quầy bảo vệ; phí gửi xe tháng đầu được lập hóa đơn ngay để thanh toán trực tuyến.</p>
          ${active ? `<div class="warn-bar" style="margin-top:10px">${ic('info')}<span><b>Bạn đang có xe ${active.status === 'dang-gui' ? 'gửi tại KTX' : 'chờ duyệt'} (${esc(VEH[active.type][0])}${active.plate ? ' ' + esc(active.plate) : ''})</b><small>Hủy đăng ký cũ trước khi đăng ký xe khác.</small></span></div>` : ''}
          <div class="grid g2" style="gap:12px;margin-top:12px"><div class="field"><label for="x-type">Loại xe <span class="req">*</span></label>${sel('x-type', Object.entries(VEH).map(([k, v]) => [k, v[0]]), 'xe-may')}</div>
            <div class="field"><label for="x-plate">Biển số <span class="req" id="x-req">*</span></label><input id="x-plate" class="input" placeholder="37B1-123.45" autocomplete="off"></div>
            <div class="field"><label for="x-brand">Hãng, dòng xe <span class="req">*</span></label><input id="x-brand" class="input" maxlength="60" placeholder="Honda Wave Alpha"></div>
            <div class="field"><label for="x-color">Màu xe <span class="req">*</span></label><input id="x-color" class="input" maxlength="30" placeholder="Đen"></div></div>
          <p class="err" id="dv-err" hidden style="margin-top:8px"></p>
          <button class="btn btn-red btn-block btn-lg" style="margin-top:14px" ${dis || (active ? 'disabled' : '')}>${ic('send')}Gửi đăng ký gửi xe</button></form>`;
        list = mine.length ? mine.map((v) => { const inv = K.db.invoices.find((i) => i.vehicle === v.id && i.status !== 'da-tt'); return `<div class="req14"><div class="row" style="justify-content:space-between;gap:8px"><b>${v.id} · ${esc(VEH[v.type][0])}${v.plate ? ' · ' + esc(v.plate) : ''}</b>${badge(v.status)}</div><small>${esc(v.brand)} · ${esc(v.color)} · ${money(v.fee)}/tháng${v.card ? ' · ' + esc(v.card) + ' từ ' + v.from : ''}${v.why ? ' · Lý do: ' + esc(v.why) : ''}</small>
          <div class="row" style="gap:12px">${inv ? `<a href="#" class="link link-red small" data-go="sv-thanh-toan-${inv.id}">${ic('credit-card')}Thanh toán ${money(inv.total)}</a>` : ''}${['cho-duyet', 'dang-gui'].includes(v.status) ? `<button class="link link-red small" data-cancel="vehicles:${v.id}">${ic('x')}${v.status === 'dang-gui' ? 'Ngừng gửi xe' : 'Hủy đăng ký'}</button>` : ''}</div></div>`; }).join('') : empty('Bạn chưa đăng ký gửi xe.');
      } else {
        const mine = K.db.certs.filter((c) => c.student === u.id).slice().reverse();
        form = `<form class="card pad" id="dv-f" novalidate><h2 class="card-t" style="font-size:20px">${ic('stamp')}Xin giấy xác nhận cư trú</h2>${lock}
          <p class="muted small" style="margin-top:6px">Ban quản lý xử lý trong 1 – 2 ngày làm việc. Giấy đã cấp xem và in trực tiếp tại đây, bản có dấu nhận tại văn phòng tầng 1.</p>
          <div class="field" style="margin-top:12px"><label for="c-pur">Mục đích sử dụng <span class="req">*</span></label>${sel('c-pur', PURPOSES, PURPOSES[0])}</div>
          <div class="grid g2" style="gap:12px;margin-top:12px"><div class="field"><label for="c-n">Số bản <span class="req">*</span></label><input id="c-n" type="number" class="input" min="1" max="${RULES.certMaxCopies}" value="1"></div><div class="field"><label for="c-note">Ghi chú</label><input id="c-note" class="input" maxlength="120" placeholder="Nơi nộp, thời hạn..."></div></div>
          <p class="err" id="dv-err" hidden style="margin-top:8px"></p>
          <button class="btn btn-red btn-block btn-lg" style="margin-top:14px" ${dis}>${ic('send')}Gửi yêu cầu</button></form>`;
        list = mine.length ? mine.map((c) => `<div class="req14"><div class="row" style="justify-content:space-between;gap:8px"><b>${c.id} · ${c.copies} bản</b>${badge(c.status)}</div><small>${esc(c.purpose)}${c.no ? ' · Số ' + esc(c.no) + ' ngày ' + c.issuedAt : ''}${c.why ? ' · Lý do: ' + esc(c.why) : ''}</small>
          <div class="row" style="gap:12px">${c.status === 'da-cap' ? `<button class="link link-red small" data-cert="${c.id}">${ic('file-text')}Xem / in giấy xác nhận</button>` : ''}${c.status === 'cho-duyet' ? `<button class="link link-red small" data-cancel="certs:${c.id}">${ic('x')}Hủy yêu cầu</button>` : ''}</div></div>`).join('') : empty('Bạn chưa gửi yêu cầu nào.');
      }
      return V4.svShell({ active: 'sv-dich-vu', search: 'Tìm kiếm thông báo, dịch vụ, hướng dẫn...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('banner_support')}" alt=""><h1>Dịch vụ ký túc xá</h1><p class="desc">Đăng ký khách thăm, về muộn, gửi xe và xin giấy xác nhận cư trú trực tuyến.</p>
          <div class="seg">${TABS.map(([k, t, i]) => `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}">${ic(i)}${t}</button>`).join('')}</div></div>
        <div class="grid resp-1" style="grid-template-columns:1.1fr .9fr;gap:16px;align-items:start">${form}
          <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('history')}Yêu cầu của tôi</h2>${list}</div></div>`);
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
        App.confirm(stop ? 'Ngừng gửi xe' : 'Hủy yêu cầu', stop ? 'Ngừng gửi xe ' + esc(x.plate || VEH[x.type][0]) + '? Vui lòng trả thẻ xe tại quầy bảo vệ.' : 'Hủy yêu cầu <b>' + id + '</b>?', stop ? 'Ngừng gửi xe' : 'Hủy yêu cầu', () => {
          x.status = 'da-huy'; x.cancelAt = K.now();
          K.save(); App.toast('Đã hủy ' + id); App.refresh();
        }, true);
      });
      const xt = root.querySelector('#x-type'); if (xt) { const upd = () => { root.querySelector('#x-req').hidden = !VEH[xt.value][2]; }; xt.onchange = upd; upd(); }
      const f = root.querySelector('#dv-f'); if (!f) return;
      f.onsubmit = (e) => {
        e.preventDefault();
        const g = (id) => (root.querySelector(id) || { value: '' }).value.trim();
        const err = root.querySelector('#dv-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        if (u.status !== 'dang-o' || !u.room) return fail('Chỉ sinh viên đang lưu trú mới dùng được dịch vụ này.');
        if (st.tab === 'khach') {
          const d = { date: g('#v-date'), from: g('#v-from'), to: g('#v-to'), purpose: g('#v-pur') };
          if (!d.date || d.date < today() || d.date > addDays(today(), RULES.visitAhead)) return fail('Ngày thăm phải từ hôm nay đến ' + RULES.visitAhead + ' ngày tới.');
          if (!d.from || !d.to || d.from < RULES.visitFrom || d.to > RULES.visitTo) return fail('Giờ thăm nằm trong khung ' + RULES.visitFrom + ' – ' + RULES.visitTo + '.');
          if (toMin(d.to) - toMin(d.from) < 15) return fail('Giờ ra phải sau giờ vào ít nhất 15 phút.');
          if (d.date === today()) { const n = new Date(); if (toMin(d.to) <= n.getHours() * 60 + n.getMinutes()) return fail('Khung giờ thăm hôm nay đã qua, chọn giờ khác.'); }
          if (d.purpose.length < 5) return fail('Nhập mục đích thăm (tối thiểu 5 ký tự).');
          const guests = [];
          for (let i = 0; i < st.guests; i++) {
            const x = { name: g('#g-n' + i), rel: g('#g-r' + i), phone: g('#g-p' + i).replace(/[\s.]/g, ''), idno: g('#g-i' + i) };
            if (x.name.split(/\s+/).length < 2) return fail('Nhập đầy đủ họ và tên của khách ' + (i + 1) + '.');
            if (!phoneOk(x.phone)) return fail('Số điện thoại của khách ' + (i + 1) + ' gồm 10 chữ số, bắt đầu bằng 0.');
            if (!/^\d{4}$/.test(x.idno)) return fail('Nhập 4 số cuối CCCD của khách ' + (i + 1) + '.');
            guests.push(x);
          }
          if (K.db.visitors.some((v) => v.student === u.id && v.date === d.date && ['cho-duyet', 'da-duyet', 'da-vao'].includes(v.status) && d.from < v.to && d.to > v.from)) return fail('Bạn đã có lượt khách trùng khung giờ này.');
          const v = Object.assign({ id: nextId(K.db.visitors, 'KT-'), student: u.id, guests, status: 'cho-duyet', at: K.now() }, d);
          K.db.visitors.push(v); K.save(); App.st.svdv = { tab: 'khach', guests: 1 }; App.toast('Đã gửi đăng ký khách thăm ' + v.id); App.refresh();
        } else if (st.tab === 've-muon') {
          const d = { date: g('#l-date'), time: g('#l-time'), reason: g('#l-why'), phone: g('#l-ph').replace(/[\s.]/g, '') };
          if (!d.date || d.date < today() || d.date > addDays(today(), RULES.lateAhead)) return fail('Ngày về muộn phải từ hôm nay đến ' + RULES.lateAhead + ' ngày tới.');
          const m = lateMin(d.time);
          if (!d.time || m < toMin(RULES.lateFrom) || m > lateMin(RULES.lateTo)) return fail('Giờ về phải trong khoảng ' + RULES.lateFrom + ' – ' + RULES.lateTo + '. Về trước ' + RULES.lateFrom + ' không cần đăng ký.');
          if (d.reason.length < 10) return fail('Nêu rõ lý do (tối thiểu 10 ký tự).');
          if (!phoneOk(d.phone)) return fail('Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.');
          const month = d.date.slice(0, 7);
          if (K.db.lateReturns.filter((l) => l.student === u.id && l.date.slice(0, 7) === month && !['tu-choi', 'da-huy'].includes(l.status)).length >= RULES.latePerMonth) return fail('Bạn đã đăng ký đủ ' + RULES.latePerMonth + ' lần trong tháng này.');
          if (K.db.lateReturns.some((l) => l.student === u.id && l.date === d.date && ['cho-duyet', 'da-duyet'].includes(l.status))) return fail('Bạn đã đăng ký về muộn cho ngày này.');
          const l = Object.assign({ id: nextId(K.db.lateReturns, 'VM-'), student: u.id, status: 'cho-duyet', at: K.now() }, d);
          K.db.lateReturns.push(l); K.save(); App.toast('Đã gửi đăng ký về muộn ' + l.id); App.refresh();
        } else if (st.tab === 'gui-xe') {
          const d = { type: g('#x-type'), plate: plateNorm(g('#x-plate')), brand: g('#x-brand'), color: g('#x-color') };
          if (K.db.vehicles.some((v) => v.student === u.id && ['cho-duyet', 'dang-gui'].includes(v.status))) return fail('Bạn đang có một xe gửi hoặc chờ duyệt.');
          if (VEH[d.type][2] && !plateOk(d.plate)) return fail('Biển số chưa đúng định dạng, ví dụ 37B1-123.45.');
          if (d.plate && K.db.vehicles.some((v) => v.plate === d.plate && ['cho-duyet', 'dang-gui'].includes(v.status))) return fail('Biển số này đã được đăng ký tại nhà xe.');
          if (d.brand.length < 2 || d.color.length < 2) return fail('Nhập hãng, dòng xe và màu xe.');
          const v = Object.assign({ id: nextId(K.db.vehicles, 'GX-'), student: u.id, status: 'cho-duyet', fee: VEH[d.type][1], at: K.now() }, d);
          K.db.vehicles.push(v); K.save(); App.toast('Đã gửi đăng ký gửi xe ' + v.id); App.refresh();
        } else {
          const n = +g('#c-n');
          if (!Number.isInteger(n) || n < 1 || n > RULES.certMaxCopies) return fail('Số bản từ 1 đến ' + RULES.certMaxCopies + '.');
          if (K.db.certs.some((c) => c.student === u.id && c.status === 'cho-duyet')) return fail('Bạn đang có một yêu cầu chờ xử lý.');
          const c = { id: nextId(K.db.certs, 'XN-'), student: u.id, purpose: g('#c-pur'), copies: n, note: g('#c-note'), status: 'cho-duyet', at: K.now() };
          K.db.certs.push(c); K.save(); App.toast('Đã gửi yêu cầu ' + c.id); App.refresh();
        }
      };
    },
  };

  // ======================================================== Ban quản lý
  const COLL = { khach: 'visitors', 've-muon': 'lateReturns', 'gui-xe': 'vehicles', 'xac-nhan': 'certs' };
  const stateOf = { visitors: visitState, lateReturns: lateState, vehicles: (x) => x.status, certs: (x) => x.status };
  const FILTERS = {
    khach: [['', 'Tất cả'], ['cho-duyet', 'Chờ duyệt'], ['hom-nay', 'Hôm nay'], ['da-vao', 'Đang trong KTX'], ['da-ra', 'Đã ra về'], ['tu-choi', 'Từ chối']],
    've-muon': [['', 'Tất cả'], ['cho-duyet', 'Chờ duyệt'], ['dem-nay', 'Đêm nay'], ['da-ve', 'Đã về'], ['ve-tre', 'Về quá giờ'], ['tu-choi', 'Từ chối']],
    'gui-xe': [['', 'Tất cả'], ['cho-duyet', 'Chờ duyệt'], ['dang-gui', 'Đang gửi'], ['da-huy', 'Đã hủy'], ['tu-choi', 'Từ chối']],
    'xac-nhan': [['', 'Tất cả'], ['cho-duyet', 'Chờ duyệt'], ['da-cap', 'Đã cấp'], ['tu-choi', 'Từ chối']],
  };
  const pending = (k) => K.db[COLL[k]].filter((x) => x.status === 'cho-duyet').length;

  P['ql-dich-vu'] = {
    role: 'admin', title: 'An ninh & dịch vụ',
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
      const room = (sid) => { const s = K.student(sid); return s && s.room ? s.room + ' · G' + b2(s.bed) : '—'; };
      const who = (sid) => `<b>${esc(sname(sid))}</b><small class="muted" style="display:block">${sid} · ${room(sid)}</small>`;
      const act = (x) => {
        const s = stateOf[coll](x); const a = [];
        if (s === 'cho-duyet') a.push(`<button class="btn btn-sm btn-red" data-do="ok:${x.id}">${st.tab === 'xac-nhan' ? 'Cấp giấy' : 'Duyệt'}</button>`, `<button class="btn btn-sm btn-outline" data-do="no:${x.id}">Từ chối</button>`);
        if (coll === 'visitors' && s === 'da-duyet' && x.date === t) a.push(`<button class="btn btn-sm btn-red" data-do="in:${x.id}">${ic('log-in')}Cho vào</button>`);
        if (coll === 'visitors' && s === 'da-vao') a.push(`<button class="btn btn-sm btn-outline" data-do="out:${x.id}">${ic('log-out')}Ghi nhận ra</button>`);
        if (coll === 'lateReturns' && s === 'da-duyet' && x.date <= t && x.date >= addDays(t, -1)) a.push(`<button class="btn btn-sm btn-red" data-do="back:${x.id}">${ic('log-in')}Đã về</button>`);
        if (coll === 'vehicles' && s === 'dang-gui') a.push(`<button class="btn btn-sm btn-outline" data-do="revoke:${x.id}">Thu hồi thẻ</button>`);
        if (coll === 'certs' && s === 'da-cap') a.push(`<button class="btn btn-sm btn-outline" data-do="view:${x.id}">${ic('printer')}Xem / in</button>`);
        return `<div class="row" style="gap:6px;flex-wrap:wrap">${a.join('') || '<span class="muted small">—</span>'}</div>`;
      };
      let head, body;
      if (coll === 'visitors') { head = '<th>Mã</th><th>Sinh viên</th><th>Khách</th><th>Thời gian</th><th>Trạng thái</th><th>Thao tác</th>'; body = cur.map((x) => `<tr><td>${x.id}</td><td>${who(x.student)}</td><td>${x.guests.map((g) => `<div>${esc(g.name)} <small class="muted">(${esc(g.rel)} · ${esc(g.phone)} · CCCD *${esc(g.idno)})</small></div>`).join('')}<small class="muted">${esc(x.purpose)}</small></td><td>${V4.dmy(x.date)}<br><small class="muted">${x.from} – ${x.to}${x.inAt ? '<br>Vào ' + x.inAt.slice(-5) : ''}${x.outAt ? ' · Ra ' + x.outAt.slice(-5) : ''}</small></td><td>${badge(stateOf[coll](x))}</td><td>${act(x)}</td></tr>`).join(''); }
      else if (coll === 'lateReturns') { head = '<th>Mã</th><th>Sinh viên</th><th>Ngày</th><th>Giờ về</th><th>Lý do</th><th>Trạng thái</th><th>Thao tác</th>'; body = cur.map((x) => `<tr><td>${x.id}</td><td>${who(x.student)}</td><td>${V4.dmy(x.date)}</td><td>${x.time}${x.backAt ? `<br><small class="muted">Về ${x.backAt.slice(-5)}</small>` : ''}</td><td style="max-width:280px">${esc(x.reason)}<br><small class="muted">${esc(x.phone)}</small></td><td>${badge(stateOf[coll](x))}</td><td>${act(x)}</td></tr>`).join(''); }
      else if (coll === 'vehicles') { head = '<th>Mã</th><th>Sinh viên</th><th>Xe</th><th>Thẻ</th><th>Phí / tháng</th><th>Trạng thái</th><th>Thao tác</th>'; body = cur.map((x) => `<tr><td>${x.id}</td><td>${who(x.student)}</td><td>${esc(VEH[x.type][0])}${x.plate ? ' · <b>' + esc(x.plate) + '</b>' : ''}<br><small class="muted">${esc(x.brand)} · ${esc(x.color)}</small></td><td>${x.card ? esc(x.card) + '<br><small class="muted">từ ' + x.from + '</small>' : '—'}</td><td>${money(x.fee)}</td><td>${badge(x.status)}</td><td>${act(x)}</td></tr>`).join(''); }
      else { head = '<th>Mã</th><th>Sinh viên</th><th>Mục đích</th><th>Số bản</th><th>Ngày gửi</th><th>Trạng thái</th><th>Thao tác</th>'; body = cur.map((x) => `<tr><td>${x.id}</td><td>${who(x.student)}</td><td style="max-width:300px">${esc(x.purpose)}${x.note ? `<br><small class="muted">${esc(x.note)}</small>` : ''}${x.no ? `<br><small class="muted">Số ${esc(x.no)} · ${x.issuedAt}</small>` : ''}</td><td>${x.copies}</td><td>${x.at.slice(0, 10)}</td><td>${badge(x.status)}</td><td>${act(x)}</td></tr>`).join(''); }
      const kpi = [
        ['users', 'Khách thăm hôm nay', K.db.visitors.filter((v) => v.date === t && ['da-duyet', 'da-vao', 'da-ra'].includes(v.status)).length, 'Đang trong KTX: ' + K.db.visitors.filter((v) => v.status === 'da-vao').length],
        ['moon', 'Về muộn đêm nay', K.db.lateReturns.filter((l) => l.date === t && l.status === 'da-duyet').length, 'Chờ duyệt: ' + pending('ve-muon')],
        ['bike', 'Xe đang gửi', K.db.vehicles.filter((v) => v.status === 'dang-gui').length, 'Chờ duyệt: ' + pending('gui-xe')],
        ['stamp', 'Giấy xác nhận chờ cấp', pending('xac-nhan'), 'Đã cấp: ' + K.db.certs.filter((c) => c.status === 'da-cap').length],
      ];
      return V4.adminShell({ active: 'ql-dich-vu', search: 'Tìm sinh viên, phòng, biển số...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('sec_art')}" alt=""><h1>An ninh & dịch vụ</h1><p class="desc">Duyệt khách thăm, về muộn, gửi xe, cấp giấy xác nhận cư trú và ghi nhận ra vào tại cổng.</p></div>
        <div class="grid g4" style="gap:12px">${kpi.map(([i, l, v, s]) => `<div class="card kpi14"><span>${ic(i)}</span><div><small>${l}</small><b>${v}</b><em>${s}</em></div></div>`).join('')}</div>
        <div class="card pad" style="margin-top:14px">
          <div class="row" style="justify-content:space-between;gap:12px;flex-wrap:wrap"><div class="seg">${TABS.map(([k, tt, i]) => { const n = pending(k); return `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}">${ic(i)}${tt}${n ? ` <span class="cnt14">${n}</span>` : ''}</button>`; }).join('')}</div>
            <div class="row" style="gap:8px;flex-wrap:wrap">${sel('dv-f', FILTERS[st.tab], st.f, '', 'style="width:170px" aria-label="Lọc trạng thái"')}<div class="iwrap" style="width:240px">${ic('search')}<input id="dv-q" class="input" placeholder="Tìm mã, sinh viên, biển số" value="${esc(st.q)}"></div></div></div>
          <div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><thead><tr>${head}</tr></thead><tbody>${body || `<tr><td colspan="7" style="text-align:center;padding:28px" class="muted">Không có yêu cầu nào phù hợp.</td></tr>`}</tbody></table></div>
          <div class="row" style="justify-content:space-between;margin-top:10px"><span class="muted small">${rows.length} yêu cầu</span>${pages > 1 ? `<div class="row" style="gap:6px"><button class="btn btn-sm btn-outline" data-pg="-1" ${st.page <= 1 ? 'disabled' : ''}>${ic('chevron-left')}</button><span class="small">Trang ${st.page}/${pages}</span><button class="btn btn-sm btn-outline" data-pg="1" ${st.page >= pages ? 'disabled' : ''}>${ic('chevron-right')}</button></div>` : ''}</div></div>`);
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
        if (op === 'no') return App.modal({ title: 'Từ chối ' + id, body: `<div class="field"><label for="dv-why">Lý do từ chối <span class="req">*</span></label><textarea id="dv-why" class="textarea" placeholder="Lý do sẽ được gửi tới sinh viên"></textarea></div><p class="err" id="dv-e" hidden></p>`, foot: `<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-outline-red" data-ok>Từ chối</button>`,
          onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const w = el.querySelector('#dv-why').value.trim(); if (w.length < 5) { const e = el.querySelector('#dv-e'); e.textContent = 'Nhập lý do (tối thiểu 5 ký tự).'; e.hidden = false; return; } x.status = 'tu-choi'; x.why = w; x.by = 'Quản trị viên'; V4.notify(x.student, 'Yêu cầu ' + id + ' bị từ chối', 'Ban quản lý từ chối yêu cầu ' + id + '. Lý do: ' + w); V4.log('Từ chối yêu cầu', 'Từ chối ' + id + ' của ' + nm); close(); done('Đã từ chối ' + id); } });
        if (op === 'ok') {
          if (coll === 'visitors') { x.status = 'da-duyet'; x.by = 'Quản trị viên'; V4.notify(x.student, 'Đã duyệt khách thăm ' + id, 'Khách của bạn được vào thăm ngày ' + V4.dmy(x.date) + ' từ ' + x.from + ' đến ' + x.to + '. Khách xuất trình CCCD tại quầy bảo vệ.'); V4.log('Duyệt khách thăm', 'Duyệt ' + id + ' của ' + nm); return done('Đã duyệt ' + id); }
          if (coll === 'lateReturns') { x.status = 'da-duyet'; x.by = 'Quản trị viên'; V4.notify(x.student, 'Đã duyệt về muộn ' + id, 'Bạn được về muộn ngày ' + V4.dmy(x.date) + ', chậm nhất lúc ' + x.time + '. Liên hệ bảo vệ khi đến cổng.'); V4.log('Duyệt về muộn', 'Duyệt ' + id + ' của ' + nm); return done('Đã duyệt ' + id); }
          if (coll === 'vehicles') {
            if (x.plate && K.db.vehicles.some((v) => v.id !== x.id && v.plate === x.plate && v.status === 'dang-gui')) return App.toast('Biển số này đang gửi tại nhà xe', 'err');
            const n = K.db.vehicles.filter((v) => v.card).length + 1; const s = K.student(x.student) || {};
            Object.assign(x, { status: 'dang-gui', card: 'THẺ ' + String(n).padStart(4, '0'), from: K.today(), by: 'Quản trị viên' });
            const d = new Date(); const period = b2(d.getMonth() + 1) + '/' + d.getFullYear(); const due = new Date(d.getTime() + 10 * 864e5);
            K.db.invoices.unshift({ id: 'GX' + period.replace('/', '').slice(0, 2) + period.slice(-2) + '-' + x.id.slice(-4), kind: 'gui-xe', vehicle: x.id, student: x.student, period, room: s.room, khu: s.room ? K.fl(s.room) : '', items: [{ name: 'Phí gửi ' + VEH[x.type][0].toLowerCase() + ' tháng ' + period + (x.plate ? ' (' + x.plate + ')' : ''), amount: x.fee }], total: x.fee, status: 'chua-tt', due: b2(due.getDate()) + '/' + b2(due.getMonth() + 1) + '/' + due.getFullYear() });
            V4.notify(x.student, 'Đã duyệt gửi xe ' + id, 'Xe của bạn được gửi tại nhà xe KTX, số thẻ ' + x.card + '. Nhận thẻ tại quầy bảo vệ và thanh toán phí gửi xe tháng ' + period + ' trên mục Hóa đơn.');
            V4.log('Duyệt gửi xe', 'Cấp ' + x.card + ' cho ' + nm + (x.plate ? ' – ' + x.plate : '')); return done('Đã duyệt và cấp ' + x.card);
          }
          const yr = new Date().getFullYear(); const n = K.db.certs.filter((c) => c.no).length + 1;
          Object.assign(x, { status: 'da-cap', no: String(n).padStart(4, '0') + '/XN-KTX', issuedAt: K.today(), by: 'Quản trị viên', year: yr });
          V4.notify(x.student, 'Đã cấp giấy xác nhận cư trú', 'Giấy xác nhận cư trú số ' + x.no + ' đã được cấp. Xem và in tại mục Dịch vụ, bản có dấu nhận tại văn phòng tầng 1.');
          V4.log('Cấp giấy xác nhận', 'Cấp giấy xác nhận cư trú ' + x.no + ' cho ' + nm); K.save(); App.refresh(); return showCert(x);
        }
        if (op === 'in') { x.status = 'da-vao'; x.inAt = K.now(); V4.log('Khách vào KTX', 'Khách của ' + nm + ' vào lúc ' + x.inAt.slice(-5) + ' (' + id + ')'); return done('Đã ghi nhận khách vào'); }
        if (op === 'out') { x.status = 'da-ra'; x.outAt = K.now(); V4.log('Khách ra về', 'Khách của ' + nm + ' ra lúc ' + x.outAt.slice(-5) + ' (' + id + ')'); return done('Đã ghi nhận khách ra về'); }
        if (op === 'back') {
          const late = Date.now() > lateAt(x).getTime() + 5 * 60000;
          x.status = late ? 've-tre' : 'da-ve'; x.backAt = K.now(); V4.log('Ghi nhận về muộn', nm + ' về KTX lúc ' + x.backAt.slice(-5) + ' (' + id + ')');
          return done(late ? 'Đã ghi nhận – sinh viên về quá giờ đăng ký' : 'Đã ghi nhận sinh viên về KTX');
        }
        if (op === 'revoke') return App.confirm('Thu hồi thẻ xe', 'Thu hồi ' + esc(x.card) + ' của <b>' + esc(nm) + '</b>?', 'Thu hồi', () => { x.status = 'da-huy'; x.cancelAt = K.now(); V4.notify(x.student, 'Đã ngừng gửi xe ' + id, 'Thẻ ' + x.card + ' đã được thu hồi.'); V4.log('Thu hồi thẻ xe', 'Thu hồi ' + x.card + ' của ' + nm); done('Đã thu hồi ' + x.card); }, true);
      });
    },
  };

  // ======================================================== Tài chính: phát hành hóa đơn tiền phòng hằng tháng
  const nowPeriod = () => { const d = new Date(); return b2(d.getMonth() + 1) + '/' + d.getFullYear(); };
  const roomBills = (period) => K.db.invoices.filter((i) => i.period === period && !i.kind);
  App.issueRoomBills = (period) => {
    const [mm, yy] = period.split('/');
    const have = new Set(roomBills(period).map((i) => i.student));
    const list = K.db.students.filter((s) => s.status === 'dang-o' && s.room && !have.has(s.id));
    let n = Math.max(0, ...K.db.invoices.filter((i) => i.id.startsWith('HĐ' + mm + yy.slice(-2) + '-')).map((i) => +i.id.split('-').pop() || 0));
    list.forEach((s) => {
      const r = K.room(s.room); if (!r) return;
      K.db.invoices.unshift({ id: 'HĐ' + mm + yy.slice(-2) + '-' + String(++n).padStart(4, '0'), student: s.id, period, room: s.room, khu: K.fl(s.room), items: [{ name: 'Tiền phòng (tháng ' + period + ')', amount: r.price }, { name: 'Tiền điện (theo định mức)', amount: 30000 }, { name: 'Tiền nước (theo định mức)', amount: 20000 }], total: r.price + 50000, status: 'chua-tt', due: '25/' + period, issuedAt: K.today() });
    });
    if (list.length) {
      K.db.notifications.unshift({ id: 'N' + Date.now(), target: 'Sinh viên đang lưu trú', title: 'Thông báo thu tiền phòng tháng ' + period, summary: 'Hóa đơn tháng ' + period + ' đã được phát hành, hạn thanh toán 25/' + period + '.', cat: 'Lưu trú', icon: 'ni_invoice', time: 'Vừa xong', author: 'Ban quản lý ký túc xá', month: 'Tháng ' + period, important: true, read: false, body: ['Hóa đơn tiền phòng tháng ' + period + ' đã được phát hành trên cổng sinh viên.', 'Vui lòng thanh toán trước ngày 25/' + period + '. Tiền điện nước vượt định mức (nếu có) được tính sau khi chốt chỉ số cuối tháng.'] });
      V4.log('Phát hành hóa đơn', 'Phát hành ' + list.length + ' hóa đơn tiền phòng tháng ' + period, 'doc');
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
      box.innerHTML = left ? `<button class="btn btn-red" id="bill14">${ic('receipt-text')}Phát hành hóa đơn tiền phòng tháng ${per}</button><small>${left}/${residents} sinh viên đang ở chưa có hóa đơn tháng ${per}</small>` : `<span class="badge b-green">${ic('circle-check')}Đã phát hành đủ hóa đơn tháng ${per} (${residents} sinh viên)</span>`;
      h.appendChild(box); App.icons(box);
      const b = box.querySelector('#bill14'); if (b) b.onclick = () => App.confirm('Phát hành hóa đơn tháng ' + per, 'Lập hóa đơn tiền phòng tháng <b>' + per + '</b> cho <b>' + left + '</b> sinh viên đang ở (tiền phòng theo loại phòng + điện nước định mức), hạn thanh toán 25/' + per + '. Sinh viên nhận thông báo trên cổng sinh viên.', 'Phát hành', () => {
        const n = App.issueRoomBills(per); if (App.st.fin) App.st.fin.period = per;
        App.toast('Đã phát hành ' + n + ' hóa đơn tháng ' + per); App.refresh();
      });
    };
  }
})();
