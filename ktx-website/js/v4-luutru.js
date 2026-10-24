/* v4 – Lưu trú: đăng ký chuyển phòng (ảnh 7), xét duyệt (8), bàn giao (9, 17), tạm vắng (13, 16), trả phòng & đối soát (10, 15), gia hạn (11) */
(function () {
  const K = window.KTX, { esc, ic, im, av, badge, sel } = App;
  const P = App.pages, V4 = App.v4;
  const b2 = K.pad2, money = K.money;
  const DEPOSIT = 500000;
  const ACTIVE_T = ['cho-duyet', 'bo-sung', 'cho-ban-giao'];
  const TST = { 'cho-duyet': ['Chờ duyệt', 'orange', 'clock'], 'bo-sung': ['Cần bổ sung', 'blue', 'file-pen-line'], 'cho-ban-giao': ['Đã duyệt · Chờ bàn giao', 'orange', 'clock'], 'hoan-tat': ['Hoàn tất', 'green', 'circle-check'], 'tu-choi': ['Từ chối', 'red', 'circle-x'], 'da-huy': ['Đã hủy', 'gray', 'circle-x'] };
  const tBadge = (s, big) => `<span class="badge b-${TST[s][1]} ${big ? 'pill-lg' : ''}">${ic(TST[s][2])}${TST[s][0]}</span>`;
  const AST = { 'cho-xac-nhan': ['Chờ xác nhận', 'orange'], 'bo-sung': ['Cần bổ sung', 'blue'], 'dang-vang': ['Đang tạm vắng', 'blue'], 'da-tro-lai': ['Đã trở lại', 'green'], 'tu-choi': ['Từ chối', 'red'], 'qua-han': ['Quá hạn trở lại', 'red'] };
  const COST = { 'nhap': ['Bản nháp', 'gray'], 'cho-kiem-tra': ['Chờ kiểm tra phòng', 'orange'], 'da-kiem-tra': ['Đã kiểm tra phòng', 'blue'], 'da-doi-soat': ['Đã đối soát', 'blue'], 'hoan-tat': ['Hoàn tất', 'green'], 'da-huy': ['Đã hủy', 'gray'] };
  const dotBadge = (map, s) => `<span class="badge b-${map[s][1]}"><i class="dot"></i>${map[s][0]}</span>`;
  const area = (r) => ({ 2: 14, 4: 20, 6: 28, 8: 32 }[r.beds] || 20);
  const facing = (r) => ['Hướng Đông', 'Hướng Nam', 'Hướng Tây', 'Hướng Bắc'][(+r.code.slice(-2)) % 4];
  const held = (code, bed, exceptId) => K.db.transfers.some((t) => t.status === 'cho-ban-giao' && t.id !== exceptId && t.to.room === code && t.to.bed === bed);
  const freeBedsOf = (code, exceptId) => K.bedMap(code).filter((b) => b.free && !held(code, b.bed, exceptId)).map((b) => b.bed);
  const myTransfer = (sid) => K.db.transfers.find((t) => t.student === sid && ACTIVE_T.includes(t.status));
  const unpaid = (sid) => K.db.invoices.filter((i) => i.student === sid && i.status !== 'da-tt');
  const overdue = (sid) => unpaid(sid).filter((i) => i.due && V4.iso(i.due) < V4.todayIso());
  const openCases = (sid) => K.db.violations.filter((v) => v.student === sid && ['cho-xac-minh', 'can-giai-trinh', 'da-giai-trinh'].includes(v.status));
  const roomImg = (code) => (code === 'B204' ? 'room_b204_big' : (K.room(code) || {}).img || 'room_a302');
  const absStatus = (a) => (a.status === 'dang-vang' && a.to < V4.todayIso() ? 'qua-han' : a.status);

  // ---------- dữ liệu mẫu ----------
  (V4.seeders = V4.seeders || []).push(() => {
    // chọn giường thật sự còn trống, ưu tiên tầng & loại phòng mong muốn, không trùng giữa các đơn mẫu
    const used = new Set(['B204/4']);
    const pick = (fl, beds) => {
      const prefs = [(x) => x.khu === fl && x.beds === beds, (x) => x.khu === fl, () => true];
      for (const f of prefs) for (const r of K.db.rooms) {
        if (r.maint || !f(r)) continue;
        const b = K.bedMap(r.code).find((m) => m.free && !used.has(r.code + '/' + m.bed));
        if (b) { used.add(r.code + '/' + b.bed); return { room: r.code, bed: b.bed }; }
      }
      return null;
    };
    const t14 = pick('2', 4), t16 = pick('1', 0), t17 = pick('2', 6);
    const H = (a) => ({ old: { keys: a, check: a, elec: a, water: a }, oldNote: a ? 'Đã kiểm tra hiện trạng, phòng sạch sẽ, thiết bị đầy đủ.' : '', oldPhoto: a ? { name: 'anh-ban-giao-a302.jpg', size: '2,4 MB', img: 'bg_thumb' } : null, new: { check: a, keys: a }, newCond: 'Bình thường', studentConfirm: null });
    K.db.transfers = [
      { id: 'CP-1026-014', student: 'SV260004', from: { room: 'A302', bed: 4 }, to: t14, date: '2026-10-26', reason: 'Ở cùng bạn', desc: 'Chuyển sang ở cùng phòng với bạn cùng lớp.', files: [], at: '20/10/2026 08:40', status: 'cho-ban-giao', decision: { date: '22/10/2026', note: 'Đủ điều kiện chuyển phòng, giường đích còn trống.', by: 'Quản trị viên' }, handover: Object.assign(H(true), { times: { keys: '09:10 25/10/2026', check: '09:20 25/10/2026', elec: '09:30 25/10/2026', water: '09:40 25/10/2026', ncheck: '10:00 25/10/2026', nkeys: '10:10 25/10/2026' } }), history: [{ d: '20/10/2026 08:40', t: 'Sinh viên gửi yêu cầu' }, { d: '22/10/2026 14:00', t: 'Ban quản lý duyệt chuyển phòng' }, { d: '25/10/2026 09:40', t: 'Hoàn tất trả phòng cũ' }] },
      { id: 'CP-1026-015', student: 'SV260002', from: { room: 'A302', bed: 1 }, to: { room: 'B204', bed: 4 }, date: '2026-11-01', reason: 'Điều chỉnh nhu cầu sinh hoạt', desc: 'Muốn ở phòng gần khu tự học tầng 2.', files: [], at: '24/10/2026 10:24', status: 'cho-duyet', history: [{ d: '24/10/2026 10:24', t: 'Sinh viên gửi yêu cầu' }] },
      { id: 'CP-1026-016', student: 'SV260011', from: { room: 'B204', bed: 2 }, to: t16, date: '2026-10-30', reason: 'Gần lớp học hơn', desc: '', files: [], at: '23/10/2026 15:10', status: 'cho-duyet', history: [{ d: '23/10/2026 15:10', t: 'Sinh viên gửi yêu cầu' }] },
      { id: 'CP-1026-017', student: 'SV260018', from: { room: 'C101', bed: 2 }, to: t17, date: '2026-10-31', reason: 'Ở cùng bạn', desc: '', files: [], at: '22/10/2026 09:00', status: 'cho-duyet', history: [{ d: '22/10/2026 09:00', t: 'Sinh viên gửi yêu cầu' }] },
    ];
    K.db.absences = [
      { id: 'TV-001', student: 'SV260001', room: 'A302', reason: 'Về thăm gia đình', from: '2026-10-24', to: '2026-10-27', phone: '0912341234', note: '', status: 'cho-xac-nhan', at: '24/10/2026 08:30' },
      { id: 'TV-002', student: 'SV260010', room: 'B204', reason: 'Về quê có việc gia đình', from: '2026-10-23', to: '2026-10-26', phone: '0912000010', note: '', status: 'dang-vang', at: '23/10/2026 07:45', leftAt: '23/10/2026 17:20' },
      { id: 'TV-003', student: 'SV260018', room: 'C101', reason: 'Tham gia hoạt động tình nguyện', from: '2026-10-20', to: '2026-10-22', phone: '0912000018', note: '', status: 'da-tro-lai', at: '19/10/2026 20:15', leftAt: '20/10/2026 06:30', backAt: '22/10/2026 19:10' },
    ];
    K.db.checkouts = [];
  });

  // ============ Sinh viên: Đăng ký chuyển phòng (ảnh 7) ============
  const REASONS = ['Điều chỉnh nhu cầu sinh hoạt', 'Gần lớp học hơn', 'Ở cùng bạn', 'Lý do sức khỏe', 'Muốn ở phòng ít người hơn', 'Lý do khác'];
  P['sv-chuyen-phong'] = {
    role: 'student', title: 'Đăng ký chuyển phòng',
    render: () => {
      const u = K.me();
      const shell = (b) => V4.svShell({ active: 'sv-chuyen-phong', search: 'Tìm kiếm thông báo, dịch vụ, hướng dẫn...' }, `<div class="phead v4h"><img class="art" src="${K.A('bn_chuyen')}" alt=""><h1>Đăng ký chuyển phòng ${V4.demo}</h1><p class="desc">Chọn phòng phù hợp và gửi yêu cầu xét duyệt.</p></div>${b}`);
      if (!u.room) return shell(`<div class="card pad empty"><p>Bạn cần đang ở ký túc xá để đăng ký chuyển phòng.</p><button class="btn btn-red" data-go="phong-o">Tìm phòng</button></div>`);
      const mine = myTransfer(u.id);
      const st = App.state('cp4', () => ({ step: mine ? 3 : 1, khu: '2', type: '4', avail: 'con', room: App.st.transferPick || 'B204', bed: null, date: '2026-11-01', reason: REASONS[0], desc: '', files: [], more: false, agree: false }));
      if (mine && st.step < 3 && !st.editing) st.step = 3;
      const tabs = `<div class="wz-tabs big">${[['1', 'Chọn phòng'], ['2', 'Thông tin'], ['3', 'Gửi yêu cầu']].map(([n, t], i) => `<button class="wzt ${st.step === i + 1 ? 'on' : ''}" ${i + 1 < st.step && !mine ? `data-step="${i + 1}"` : ''}><span>${n}</span>${t}</button>`).join('')}</div>`;
      if (st.step === 3) return shell(tabs + V4.transferTrack(mine || K.db.transfers.filter((t) => t.student === u.id).slice(-1)[0], u));
      let rooms = K.db.rooms.filter((r) => r.code !== u.room && !r.maint && (!st.khu || r.khu === st.khu) && (!st.type || String(r.beds) === st.type));
      if (st.avail === 'con') rooms = rooms.filter((r) => freeBedsOf(r.code).length);
      const R = K.room(st.room) && rooms.find((r) => r.code === st.room) ? K.room(st.room) : rooms[0];
      if (R) { st.room = R.code; if (!freeBedsOf(R.code).includes(st.bed)) st.bed = freeBedsOf(R.code)[0] || null; }
      const others = rooms.filter((r) => !R || r.code !== R.code).slice(0, st.more ? 20 : 3);
      const cur = K.room(u.room);
      const info = (lbl, val, icn) => `<div class="ro-row">${ic(icn)}<span>${lbl}</span><input class="input ro" readonly value="${esc(val)}"></div>`;
      if (st.step === 2) {
        return shell(tabs + `<div class="grid resp-1" style="grid-template-columns:1fr 1fr;gap:16px;align-items:start">
          <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('clipboard-check')}Kiểm tra lại yêu cầu</h2>
            <div class="cp-compare"><div><small>Phòng hiện tại</small><b>${u.room} · Giường ${b2(u.bed)}</b><span>Tầng ${cur.khu}</span></div>${ic('arrow-right')}<div class="to"><small>Phòng đề xuất</small><b>${st.room} · Giường ${b2(st.bed)}</b><span>Tầng ${K.room(st.room).khu}</span></div></div>
            <dl class="kv" style="grid-template-columns:170px 1fr;margin-top:16px"><dt>Họ tên</dt><dd>${esc(u.name)}</dd><dt>Mã sinh viên</dt><dd>${u.id}</dd><dt>Ngày dự kiến chuyển</dt><dd>${V4.dmy(st.date)}</dd><dt>Lý do</dt><dd>${esc(st.reason)}</dd><dt>Mô tả</dt><dd style="font-weight:400">${esc(st.desc || '—')}</dd><dt>Minh chứng</dt><dd>${st.files.length ? st.files.map((f) => esc(f.name)).join(', ') : '—'}</dd><dt>Tiền phòng mới</dt><dd>${money(K.room(st.room).price)} / tháng</dd></dl></div>
          <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('info')}Lưu ý trước khi gửi</h2><ul class="note-list"><li>Ban quản lý xét duyệt trong 3 – 5 ngày làm việc.</li><li>Khi được duyệt, giường đích được giữ chỗ cho bạn đến hết ngày bàn giao.</li><li>Bạn cần trả phòng cũ (chìa khóa, chốt chỉ số điện nước) và xác nhận nhận phòng mới trên hệ thống.</li><li>Phòng ở chính thức được cập nhật sau khi hoàn tất bàn giao.</li></ul>
            ${openCases(u.id).length ? `<div class="warn-bar">${ic('triangle-alert')}<span><b>Bạn đang có ${openCases(u.id).length} hồ sơ nội quy chưa kết luận</b><small>Yêu cầu vẫn được gửi nhưng có thể bị xem xét lâu hơn.</small></span></div>` : ''}
            <label class="check" style="margin-top:14px"><input type="checkbox" id="cp-agree" ${st.agree ? 'checked' : ''}>Tôi xác nhận thông tin trên là chính xác.</label>
            <div class="grid g2" style="gap:12px;margin-top:16px"><button class="btn btn-outline btn-lg" data-step="1">${ic('arrow-left')}Quay lại</button><button class="btn btn-red btn-lg" id="cp-send">${ic('send')}Gửi yêu cầu</button></div></div></div>`);
      }
      return shell(tabs + `<div class="grid resp-1" style="grid-template-columns:1fr 0.66fr;gap:16px;align-items:start">
        <div class="card pad" style="padding:16px;min-width:0">
          <div class="cur-room">${ic('bed-double')}<span><small>Phòng hiện tại</small><b>${u.room} · Tầng ${cur.khu} · Giường ${b2(u.bed)}</b></span></div>
          <div class="cp-filter"><div class="field"><label for="cp-khu">Tầng</label>${sel('cp-khu', [['', 'Tất cả tầng'], ...App.khuOpts()], st.khu)}</div><div class="field"><label for="cp-type">Loại phòng</label>${sel('cp-type', [['', 'Tất cả'], ['2', 'Phòng 2 người'], ['4', 'Phòng 4 người'], ['6', 'Phòng 6 người'], ['8', 'Phòng 8 người']], st.type)}</div><div class="field"><label for="cp-av">Trạng thái</label>${sel('cp-av', [['con', 'Còn chỗ'], ['', 'Tất cả']], st.avail)}</div></div>
          ${R ? (() => { const map = K.bedMap(R.code); const fb = freeBedsOf(R.code); return `<div class="cp-room"><div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 class="row" style="font-size:24px;gap:12px">${ic('building-2')}${R.code} · Tầng ${R.khu} ${fb.length ? badge('Còn chỗ', 'green', { icon: 'circle-check', sm: true }) : badge('Hết chỗ', 'red', { sm: true })}</h2><span class="muted row" style="gap:14px">${ic('bed-double')}Phòng ${R.beds} người ${ic('layers')}Tầng ${R.khu}</span></div>
            <div class="cp-body"><img src="${K.A(roomImg(R.code))}" alt="Ảnh phòng ${R.code}"><div><b style="color:var(--navy)">Sơ đồ giường</b><div class="bedmap" style="grid-template-columns:repeat(${R.beds > 4 ? 3 : 2},1fr)">${map.map((b) => { const h = b.free && held(R.code, b.bed); const free = b.free && !h; return `<button class="bm ${free ? 'free' : ''} ${st.bed === b.bed && free ? 'on' : ''}" ${free ? `data-bed="${b.bed}"` : 'disabled'}>${ic('bed-double')}<b>${b2(b.bed)}</b><small>${free ? 'Còn trống' : h ? 'Đã giữ chỗ' : 'Đã có người'}</small>${st.bed === b.bed && free ? `<i class="bm-tick">${ic('check')}</i>` : ''}</button>`; }).join('')}</div></div></div>
            <div class="cp-meta"><span>${ic('scan')}<small>Diện tích</small><b>${area(R)} m²</b></span><span>${ic('building')}<small>Hướng</small><b>${facing(R)}</b></span><span>${ic('wifi')}<small>Tiện ích</small><b>Wifi, bàn học, tủ đồ</b></span><button class="btn btn-soft" id="cp-view">${ic('eye')}Xem phòng</button></div></div>`; })() : `<div class="empty">${ic('search')}<p>Không có phòng phù hợp bộ lọc.</p></div>`}
          ${others.map((r) => `<button class="cp-mini" data-room="${r.code}"><img src="${K.A(r.img)}" alt=""><span><b>${r.code} · Tầng ${r.khu}</b> ${freeBedsOf(r.code).length ? badge('Còn ' + freeBedsOf(r.code).length + ' chỗ', 'green', { sm: true }) : badge('Hết chỗ', 'red', { sm: true })}<small>${ic('bed-double')}Phòng ${r.beds} người · ${ic('scan')}${area(r)} m² · ${money(r.price)}/tháng</small></span><span class="btn btn-soft btn-sm">${ic('eye')}Chọn</span></button>`).join('')}
          ${rooms.length > 4 && !st.more ? `<button class="btn btn-outline btn-block" id="cp-more">Xem thêm ${rooms.length - 4} phòng</button>` : ''}</div>
        <div class="card pad"><h2 class="card-t" style="font-size:21px">${ic('file-pen-line')}Thông tin yêu cầu</h2>
          <div class="ro-list">${info('Họ tên sinh viên', u.name, 'user-round')}${info('Mã sinh viên', u.id, 'graduation-cap')}${info('Từ phòng / giường', u.room + ' / ' + b2(u.bed), 'bed-double')}${info('Đến phòng / giường', R && st.bed ? R.code + ' / ' + b2(st.bed) : 'Chọn giường trống', 'bed-double')}</div><hr class="hr">
          <div class="ro-row">${ic('calendar-days')}<span>Ngày dự kiến chuyển phòng</span><input id="cp-date" type="date" class="input" value="${st.date}" min="${V4.todayIso()}"></div>
          <div class="ro-row">${ic('file-text')}<span>Lý do chuyển phòng</span>${sel('cp-reason', REASONS, st.reason)}</div>
          <div class="field" style="margin-top:10px"><label for="cp-desc">${ic('message-square-text')} Mô tả chi tiết (không bắt buộc)</label><div style="position:relative"><textarea id="cp-desc" class="textarea" data-max="300" placeholder="Nhập thêm thông tin nếu có...">${esc(st.desc)}</textarea><span class="counter">0/300</span></div></div>
          <div class="row" style="margin-top:10px;flex-wrap:wrap"><span class="row" style="gap:8px;color:var(--ink)">${ic('paperclip')}Đính kèm minh chứng (nếu có)</span><label class="btn btn-soft btn-sm" style="position:relative">${ic('eye')}Chọn tệp<input type="file" id="cp-file" accept="image/*,.pdf" multiple style="position:absolute;inset:0;opacity:0;cursor:pointer"></label></div><small class="muted">Chấp nhận file ảnh, PDF (tối đa 5MB).</small>${st.files.length ? `<div class="files">${st.files.map((f) => `<span>${ic('paperclip')}${esc(f.name)}</span>`).join('')}</div>` : ''}
          <div class="info-strip">${ic('info')}Phòng đích được xác nhận khi đơn được duyệt.</div>
          <div class="grid" style="grid-template-columns:1.6fr 1fr;gap:12px;margin-top:14px"><button class="btn btn-red btn-lg" id="cp-next" ${R && st.bed ? '' : 'disabled'}>${ic('send')}Xem lại yêu cầu</button><button class="btn btn-outline-red btn-lg" id="cp-cancel">Hủy</button></div></div></div>`);
    },
    mount: (root) => {
      const st = App.st.cp4; if (!st) return; const u = K.me();
      const keep = () => { const g = (id) => root.querySelector(id); if (g('#cp-date')) { st.date = g('#cp-date').value; st.reason = g('#cp-reason').value; st.desc = g('#cp-desc').value; } };
      root.querySelectorAll('[data-step]').forEach((b) => b.onclick = () => { keep(); st.step = +b.dataset.step; App.refresh(); });
      [['#cp-khu', 'khu'], ['#cp-type', 'type'], ['#cp-av', 'avail']].forEach(([id, k]) => { const e = root.querySelector(id); if (e) e.onchange = () => { keep(); st[k] = e.value; st.room = null; App.refresh(); }; });
      root.querySelectorAll('[data-bed]').forEach((b) => b.onclick = () => { keep(); st.bed = +b.dataset.bed; App.refresh(); });
      root.querySelectorAll('[data-room]').forEach((b) => b.onclick = () => { keep(); st.room = b.dataset.room; st.bed = null; App.refresh(); });
      const more = root.querySelector('#cp-more'); if (more) more.onclick = () => { keep(); st.more = true; App.refresh(); };
      const view = root.querySelector('#cp-view'); if (view) view.onclick = () => { const r = K.room(st.room); App.modal({ title: 'Phòng ' + r.code + ' · Tầng ' + r.khu, wide: true, body: `<img src="${K.A(roomImg(r.code))}" style="width:100%;border-radius:12px" alt=""><div class="grid g4" style="gap:10px;margin-top:12px">${['thumb_desk', 'thumb_wardrobe', 'thumb_bath', r.img].map((x) => `<img src="${K.A(x)}" style="width:100%;height:90px;object-fit:cover;border-radius:8px" alt="">`).join('')}</div><dl class="kv" style="grid-template-columns:150px 1fr;margin-top:14px"><dt>Sức chứa</dt><dd>${r.beds} giường · ${K.occCount(r.code)} sinh viên đang ở</dd><dt>Giá phòng</dt><dd>${money(r.price)} / tháng</dd><dt>Diện tích</dt><dd>${area(r)} m² · ${facing(r)}</dd></dl>` }); };
      const fi = root.querySelector('#cp-file'); if (fi) fi.onchange = () => { keep(); [...fi.files].forEach((f) => { if (f.size > 5 * 1024 * 1024) App.toast(f.name + ' vượt quá 5MB', 'err'); else st.files.push({ name: f.name, size: V4.fileSize(f.size) }); }); App.refresh(); };
      const nx = root.querySelector('#cp-next'); if (nx) nx.onclick = () => { keep(); if (!st.date) return App.toast('Chọn ngày dự kiến chuyển phòng', 'err'); if (st.date < V4.todayIso()) return App.toast('Ngày dự kiến phải từ hôm nay trở đi', 'err'); st.step = 2; App.refresh(); };
      const cc = root.querySelector('#cp-cancel'); if (cc) cc.onclick = () => { App.st.cp4 = null; App.st.transferPick = null; App.refresh(); App.toast('Đã xóa thông tin đang nhập'); };
      const sd = root.querySelector('#cp-send'); if (sd) sd.onclick = () => {
        if (!root.querySelector('#cp-agree').checked) return App.toast('Vui lòng tích xác nhận thông tin', 'err');
        if (!freeBedsOf(st.room).includes(st.bed)) return App.toast('Giường đã được giữ chỗ hoặc có người. Hãy chọn giường khác.', 'err');
        const old = K.db.transfers.find((t) => t.student === u.id && t.status === 'bo-sung');
        const t = old || { id: 'CP-1026-' + String(Math.max(...K.db.transfers.map((x) => +x.id.slice(-3))) + 1).padStart(3, '0'), student: u.id, history: [] };
        Object.assign(t, { from: { room: u.room, bed: u.bed }, to: { room: st.room, bed: st.bed }, date: st.date, reason: st.reason, desc: st.desc, files: st.files, at: K.now(), status: 'cho-duyet' });
        t.history.push({ d: K.now(), t: old ? 'Sinh viên bổ sung và gửi lại yêu cầu' : 'Sinh viên gửi yêu cầu' });
        if (!old) K.db.transfers.push(t);
        K.save(); st.step = 3; st.editing = false; App.st.transferPick = null; App.toast('Đã gửi yêu cầu chuyển phòng ' + t.id); App.refresh();
      };
      const tr = K.db.transfers.filter((t) => t.student === u.id).slice(-1)[0];
      const cancel = root.querySelector('#tk-cancel'); if (cancel) cancel.onclick = () => App.confirm('Hủy yêu cầu chuyển phòng', 'Hủy yêu cầu ' + tr.id + '?', 'Hủy yêu cầu', () => { tr.status = 'da-huy'; tr.history.push({ d: K.now(), t: 'Sinh viên hủy yêu cầu' }); K.save(); App.st.cp4 = null; App.refresh(); }, true);
      const again = root.querySelector('#tk-new'); if (again) again.onclick = () => { App.st.cp4 = null; const s2 = App.state('cp4', { step: 1, khu: '2', type: '4', avail: 'con', room: 'B204', bed: null, date: '2026-11-01', reason: REASONS[0], desc: '', files: [], more: false }); s2.editing = true; App.refresh(); };
      const edit = root.querySelector('#tk-edit'); if (edit) edit.onclick = () => { Object.assign(st, { step: 1, editing: true, room: tr.to.room, bed: tr.to.bed, khu: K.room(tr.to.room).khu, type: '', date: tr.date, reason: tr.reason, desc: tr.desc, files: tr.files || [] }); App.refresh(); };
      const conf = root.querySelector('#tk-confirm'); if (conf) conf.onclick = () => App.confirm('Xác nhận nhận phòng', 'Bạn xác nhận đã nhận phòng <b>' + tr.to.room + ' · Giường ' + b2(tr.to.bed) + '</b>, giường tủ và chìa khóa đầy đủ, đúng hiện trạng?', 'Xác nhận', () => { tr.handover.studentConfirm = K.now(); tr.history.push({ d: K.now(), t: 'Sinh viên xác nhận nhận phòng' }); K.save(); App.toast('Đã xác nhận nhận phòng. Ban quản lý sẽ hoàn tất chuyển phòng.'); App.refresh(); });
    },
  };
  V4.transferTrack = (t, u) => {
    if (!t) return `<div class="card pad empty"><p>Chưa có yêu cầu.</p></div>`;
    const h = t.handover || {}; const oldDone = h.old && Object.values(h.old).every(Boolean); const newReady = h.new && h.new.check && h.new.keys;
    const stage = t.status === 'hoan-tat' ? 5 : t.status === 'cho-ban-giao' ? (h.studentConfirm ? 4 : oldDone ? 3 : 2) : 1;
    const items = [
      { t: 'Đã gửi yêu cầu', d: t.at, s: t.from.room + ' / ' + b2(t.from.bed) + ' → ' + t.to.room + ' / ' + b2(t.to.bed), st: 'done' },
      { t: t.status === 'tu-choi' ? 'Yêu cầu bị từ chối' : t.status === 'bo-sung' ? 'Cần bổ sung thông tin' : 'Ban quản lý xét duyệt', d: t.decision ? t.decision.date : '', s: t.decision ? t.decision.note : 'Ban quản lý xem xét trong 3 – 5 ngày làm việc.', st: t.decision && t.status !== 'bo-sung' ? 'done' : 'cur' },
      { t: 'Trả phòng cũ', d: oldDone ? (h.times || {}).water || '' : '', s: 'Trả chìa khóa, kiểm tra giường tủ, chốt chỉ số điện nước.', st: oldDone ? 'done' : stage === 2 ? 'cur' : 'todo' },
      { t: 'Nhận phòng mới', d: h.studentConfirm || '', s: h.studentConfirm ? 'Bạn đã xác nhận nhận phòng.' : 'Nhận chìa khóa mới và xác nhận trên hệ thống.', st: h.studentConfirm ? 'done' : stage === 3 ? 'cur' : 'todo' },
      { t: 'Hoàn tất', d: t.doneAt || '', s: 'Phòng ở được cập nhật sau khi hoàn tất bàn giao.', st: t.status === 'hoan-tat' ? 'done' : stage === 4 ? 'cur' : 'todo' },
    ];
    return `<div class="grid resp-1" style="grid-template-columns:1fr 1fr;gap:16px;align-items:start">
      <div class="card pad"><div class="card-h"><h2 class="card-t" style="font-size:20px">${ic('file-text')}Yêu cầu ${t.id}</h2>${tBadge(t.status)}</div>
        <div class="cp-compare"><div><small>Phòng hiện tại</small><b>${t.from.room} · Giường ${b2(t.from.bed)}</b><span>Tầng ${K.fl(t.from.room)}</span></div>${ic('arrow-right')}<div class="to"><small>Phòng đề xuất</small><b>${t.to.room} · Giường ${b2(t.to.bed)}</b><span>Tầng ${K.fl(t.to.room)}</span></div></div>
        <dl class="kv" style="grid-template-columns:170px 1fr;margin-top:16px"><dt>Ngày gửi</dt><dd>${t.at}</dd><dt>Ngày dự kiến chuyển</dt><dd>${V4.dmy(t.date)}</dd><dt>Lý do</dt><dd>${esc(t.reason)}</dd>${t.desc ? `<dt>Mô tả</dt><dd style="font-weight:400">${esc(t.desc)}</dd>` : ''}${t.decision ? `<dt>Ghi chú Ban quản lý</dt><dd style="font-weight:400">${esc(t.decision.note)}</dd>` : ''}</dl>
        ${t.status === 'cho-ban-giao' ? `<div class="sched">${ic('calendar-days')}<span><small>Lịch bàn giao</small><b>${V4.dmy(t.date)} · Quầy quản lý tầng ${K.fl(t.from.room)}</b></span></div>` : ''}
        <div class="row" style="margin-top:16px;flex-wrap:wrap;gap:10px">${t.status === 'cho-duyet' ? `<button class="btn btn-outline-red" id="tk-cancel">${ic('x')}Hủy yêu cầu</button>` : ''}${t.status === 'bo-sung' ? `<button class="btn btn-red" id="tk-edit">${ic('pencil')}Bổ sung và gửi lại</button>` : ''}${['tu-choi', 'hoan-tat', 'da-huy'].includes(t.status) ? `<button class="btn btn-red" id="tk-new">${ic('plus')}Tạo yêu cầu mới</button>` : ''}
          ${t.status === 'cho-ban-giao' ? `<button class="btn ${newReady && !h.studentConfirm ? 'btn-red' : 'btn-disabled'}" id="tk-confirm" ${newReady && !h.studentConfirm ? '' : 'disabled'}>${ic('pen-line')}${h.studentConfirm ? 'Đã xác nhận nhận phòng' : 'Xác nhận nhận phòng'}</button>${!newReady ? '<small class="muted">Nút xác nhận mở khi Ban quản lý bàn giao giường tủ và chìa khóa mới.</small>' : ''}` : ''}</div></div>
      <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('clock')}Tiến trình chuyển phòng</h2><div style="margin-top:12px">${V4.vline(items, true)}</div></div></div>`;
  };

  // ============ Ban quản lý: Xét duyệt chuyển phòng (ảnh 8) ============
  P['ql-chuyen-phong'] = {
    role: 'admin', title: 'Xét duyệt chuyển phòng',
    render: () => {
      const st = App.state('xd', { f: 'cho-duyet', q: '', sel: null });
      let list = K.db.transfers.slice().sort((a, b) => b.id.localeCompare(a.id));
      if (st.f) list = list.filter((t) => t.status === st.f);
      if (st.q) { const q = st.q.toLowerCase(); list = list.filter((t) => (t.id + ' ' + V4.sname(t.student) + ' ' + t.student + ' ' + t.to.room).toLowerCase().includes(q)); }
      list.sort((a, b) => a.id.localeCompare(b.id));
      const t = list.find((x) => x.id === st.sel) || list[0]; if (t) st.sel = t.id;
      let mid = `<div class="card pad empty" style="grid-column:span 2"><span class="amen-ic blue">${ic('inbox')}</span><p>Không có yêu cầu ở mục này.</p></div>`;
      if (t) {
        const s = K.student(t.student) || {};
        const bedsRow = (code, mark, target) => K.bedMap(code).map((b) => `<span class="bchip ${b.student && b.student.id === mark ? 'me' : ''} ${target && b.bed === t.to.bed ? (b.free && !held(code, b.bed, t.id) ? 'tgt' : 'bad') : ''}">Giường ${b2(b.bed)}<small>${b.student ? b.student.id : b.free ? (target && b.bed === t.to.bed ? 'Còn trống' : held(code, b.bed) ? 'Giữ chỗ' : 'Trống') : 'Có người'}</small></span>`).join('');
        const bedOk = K.bedMap(t.to.room)[t.to.bed - 1] && K.bedMap(t.to.room)[t.to.bed - 1].free && !held(t.to.room, t.to.bed, t.id);
        const cases = openCases(t.student); const od = overdue(t.student); const up = unpaid(t.student);
        const checks = [[bedOk || t.status === 'cho-ban-giao' || t.status === 'hoan-tat', 'Giường đích còn trống', bedOk ? 'Giường ' + b2(t.to.bed) + ' tại ' + t.to.room + ' hiện đang trống.' : t.status === 'cho-ban-giao' ? 'Giường đang được giữ chỗ cho sinh viên.' : 'Giường ' + b2(t.to.bed) + ' tại ' + t.to.room + ' đã có người hoặc được giữ chỗ.'], [!cases.length, 'Thông tin lưu trú hợp lệ', cases.length ? 'Có ' + cases.length + ' hồ sơ nội quy chưa kết luận (' + cases.map((c) => c.id).join(', ') + ').' : 'Sinh viên đang lưu trú hợp lệ, không có hồ sơ vi phạm mở.'], [!od.length, 'Đã đối soát các khoản phí', od.length ? 'Có ' + od.length + ' hóa đơn quá hạn.' : up.length ? 'Không có khoản quá hạn (' + up.length + ' hóa đơn chưa đến hạn).' : 'Đã hoàn thành các khoản phí đến hiện tại.']];
        mid = `<div style="display:flex;flex-direction:column;gap:14px;min-width:0">
          <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('file-text')}Thông tin yêu cầu</h2><div class="xd-info"><div><div class="row" style="gap:14px">${av(s.avatar, 62)}<span><b style="font-size:20px;color:var(--navy);display:block">${esc(s.name || t.student)}</b><span class="muted">${t.student}</span></span></div><div class="mini-kv">${ic('graduation-cap')}Sinh viên</div><div class="mini-kv">${ic('building')}Khoa ${esc(s.faculty || '—')}</div><div class="mini-kv">${ic('phone')}${s.phone ? V4.mask(s.phone) : '---'}</div></div>
            <dl class="kv" style="grid-template-columns:130px 1fr;font-size:14.5px"><dt>Mã đơn</dt><dd>${t.id}</dd><dt>Ngày gửi yêu cầu</dt><dd>${t.at.slice(0, 10)}</dd><dt>Lý do chuyển phòng</dt><dd>${esc(t.reason)}</dd><dt>Ngày dự kiến</dt><dd>${V4.dmy(t.date)}</dd><dt>Trạng thái</dt><dd>${tBadge(t.status)}</dd></dl></div>${t.desc ? `<p class="muted small" style="margin-top:8px">“${esc(t.desc)}”</p>` : ''}</div>
          <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('file-text')}Thông tin chuyển phòng</h2><div class="xd-rooms"><div class="xd-room"><div class="row" style="justify-content:space-between"><span class="row" style="gap:8px;font-weight:600;color:var(--navy)"><span style="color:var(--red)">${ic('house')}</span>Phòng hiện tại</span><span class="badge b-red b-sm">${K.occCount(t.from.room)}/${K.room(t.from.room).beds} sinh viên</span></div><h3>${t.from.room} · Giường ${b2(t.from.bed)}</h3><img src="${K.A(t.from.room === 'A302' ? 'cp_cur' : K.room(t.from.room).img)}" alt=""><div class="bchips">${bedsRow(t.from.room, t.student, false)}</div></div><span class="xd-arrow">${ic('arrow-right')}</span>
            <div class="xd-room"><div class="row" style="justify-content:space-between"><span class="row" style="gap:8px;font-weight:600;color:var(--navy)"><span style="color:var(--blue-700)">${ic('house')}</span>Phòng đề xuất</span><span class="badge b-green b-sm">${K.occCount(t.to.room)}/${K.room(t.to.room).beds} sinh viên</span></div><h3>${t.to.room} · Giường ${b2(t.to.bed)}</h3><img src="${K.A(t.to.room === 'B204' ? 'cp_new' : K.room(t.to.room).img)}" alt=""><div class="bchips">${bedsRow(t.to.room, null, true)}</div></div></div>
            <h3 class="card-t" style="font-size:18px;margin-top:16px">${ic('clipboard-check')}Kiểm tra trước khi duyệt</h3><div class="xd-checks">${checks.map(([ok, a, b]) => `<div class="${ok ? 'ok' : 'warn'}"><span>${ic(ok ? 'circle-check' : 'triangle-alert')}</span><b>${a}</b><small>${b}</small></div>`).join('')}</div></div></div>
          <div class="card pad xd-decide"><h2 class="card-t" style="font-size:21px">${ic('file-check')}Quyết định</h2><div class="row" style="justify-content:space-between;margin-top:12px"><span class="muted">Trạng thái hiện tại</span>${tBadge(t.status)}</div>
            ${['cho-duyet', 'bo-sung'].includes(t.status) ? `<div class="field" style="margin-top:14px"><label for="xd-date">Ngày duyệt <span class="req">*</span></label><input id="xd-date" type="date" class="input" value="${V4.todayIso()}"></div><div class="field" style="margin-top:12px"><label for="xd-note">Ghi chú <span class="req">*</span></label><div style="position:relative"><textarea id="xd-note" class="textarea" data-max="500" style="min-height:110px" placeholder="Nhập ghi chú về việc xét duyệt... (tối thiểu 10 ký tự)"></textarea><span class="counter">0/500</span></div></div>
              <button class="btn btn-red btn-block btn-lg" id="xd-ok" style="margin-top:14px" ${t.status === 'bo-sung' ? 'disabled' : ''}>${ic('circle-check')}Duyệt chuyển phòng</button><button class="btn btn-outline-red btn-block" id="xd-more" style="margin-top:10px" ${t.status === 'bo-sung' ? 'disabled' : ''}>${ic('file-text')}Yêu cầu bổ sung</button><button class="btn btn-soft btn-block" id="xd-no" style="margin-top:10px;color:var(--ink)">${ic('circle-x')}Từ chối</button>${t.status === 'bo-sung' ? '<p class="small muted" style="margin-top:8px">Đang chờ sinh viên bổ sung thông tin.</p>' : ''}`
              : t.status === 'cho-ban-giao' ? `<p style="margin-top:14px;line-height:1.6">Đã duyệt ngày <b>${t.decision.date}</b>. Giường ${b2(t.to.bed)} tại ${t.to.room} đang được giữ chỗ.</p><button class="btn btn-red btn-block btn-lg" data-go="ql-ban-giao-${t.id}" style="margin-top:14px">${ic('arrow-right-left')}Đi tới bàn giao</button>`
              : `<p style="margin-top:14px;line-height:1.6">${t.decision ? esc(t.decision.note) : ''}</p>`}
            <div class="guide-box">${ic('info')}<span><b>Hướng dẫn</b><small>Duyệt đơn sẽ giữ chỗ phòng đích. Cập nhật phòng ở sau khi sinh viên hoàn tất bàn giao với quản lý.</small></span></div></div>`;
      }
      return V4.adminShell({ active: 'ql-chuyen-phong', search: 'Tìm kiếm sinh viên, phòng, đơn chuyển phòng...' }, `
        <div><h1 class="v4-title">Xét duyệt chuyển phòng ${V4.demo}</h1><p class="desc" style="font-size:17px;color:#4a5a7e;margin-top:4px">Xem xét và duyệt các yêu cầu chuyển phòng của sinh viên.</p></div>
        <div class="xd-grid">
          <div class="card pad" style="padding:16px 12px"><h2 style="font-size:20px;padding:0 6px">Danh sách yêu cầu</h2><div class="iwrap" style="margin-top:10px">${ic('filter')}${sel('xd-f', [['cho-duyet', 'Chờ duyệt'], ['bo-sung', 'Cần bổ sung'], ['cho-ban-giao', 'Chờ bàn giao'], ['hoan-tat', 'Hoàn tất'], ['tu-choi', 'Từ chối'], ['', 'Tất cả']], st.f)}</div><div class="iwrap" style="margin-top:8px">${ic('search')}<input id="xd-q" class="input" placeholder="Tìm kiếm đơn..." value="${esc(st.q)}"></div>
            <div style="margin-top:10px">${list.map((x) => `<button class="xd-item ${x.id === st.sel ? 'on' : ''}" data-t="${x.id}"><span class="row" style="justify-content:space-between"><b>${x.id}</b><span class="badge b-${TST[x.status][1]} b-sm">${TST[x.status][0].replace('Đã duyệt · ', '')}</span></span><span class="row" style="justify-content:space-between"><b style="font-weight:600">${esc(V4.sname(x.student))}</b><small class="muted">${x.at.slice(0, 10)}</small></span><small class="muted">${x.student}</small><small class="muted">${esc(x.reason)}</small>${ic('chevron-right')}</button>`).join('') || '<p class="muted" style="text-align:center;padding:20px">Không có yêu cầu.</p>'}</div></div>
          ${mid}</div>
        ${t ? `<div class="card pad xd-hist"><h2 class="card-t" style="font-size:19px">${ic('clock')}Lịch sử xử lý</h2><div class="hist-row">${t.history.map((h) => `<div><i></i><small>${h.d}</small><b>${esc(h.t)}</b></div>`).join('')}${['cho-duyet', 'bo-sung'].includes(t.status) ? '<div class="todo"><i></i><small>Hiện tại</small><b>Đang chờ xử lý</b></div>' : ''}</div></div>` : ''}`);
    },
    mount: (root) => {
      const st = App.st.xd;
      root.querySelector('#xd-f').onchange = (e) => { st.f = e.target.value; st.sel = null; App.refresh(); };
      const q = root.querySelector('#xd-q'); q.onchange = () => { st.q = q.value.trim(); App.refresh(); };
      root.querySelectorAll('[data-t]').forEach((b) => b.onclick = () => { st.sel = b.dataset.t; App.refresh(); });
      const t = K.db.transfers.find((x) => x.id === st.sel); if (!t) return;
      const note = () => (root.querySelector('#xd-note') || {}).value || '';
      const decide = (status, msgTitle, label) => {
        const n = note().trim(); if (n.length < 10) return App.toast('Ghi chú cần tối thiểu 10 ký tự', 'err');
        t.decision = { date: V4.dmy(root.querySelector('#xd-date').value) || K.today(), note: n, by: 'Quản trị viên' }; t.status = status; t.history.push({ d: K.now(), t: label });
        if (status === 'cho-ban-giao') t.handover = { old: { keys: false, check: false, elec: false, water: false }, oldNote: '', oldPhoto: null, new: { check: false, keys: false }, newCond: 'Bình thường', studentConfirm: null, times: {} };
        V4.notify(t.student, msgTitle, n + (status === 'cho-ban-giao' ? '\nLịch bàn giao: ' + V4.dmy(t.date) + '. Giường ' + b2(t.to.bed) + ' phòng ' + t.to.room + ' được giữ chỗ cho bạn.' : ''));
        V4.log(label, label + ' ' + t.id + ' của ' + V4.sname(t.student)); K.save(); App.toast(label + ' ' + t.id); App.refresh();
      };
      const ok = root.querySelector('#xd-ok'); if (ok && !ok.disabled) ok.onclick = () => { if (!freeBedsOf(t.to.room, t.id).includes(t.to.bed)) return App.toast('Giường đích không còn trống. Hãy yêu cầu sinh viên chọn giường khác.', 'err'); decide('cho-ban-giao', 'Yêu cầu chuyển phòng ' + t.id + ' đã được duyệt', 'Duyệt chuyển phòng'); };
      const more = root.querySelector('#xd-more'); if (more && !more.disabled) more.onclick = () => decide('bo-sung', 'Yêu cầu chuyển phòng ' + t.id + ' cần bổ sung', 'Yêu cầu bổ sung');
      const no = root.querySelector('#xd-no'); if (no) no.onclick = () => App.confirm('Từ chối yêu cầu', 'Từ chối yêu cầu chuyển phòng ' + t.id + ' của ' + esc(V4.sname(t.student)) + '?', 'Từ chối', () => decide('tu-choi', 'Yêu cầu chuyển phòng ' + t.id + ' bị từ chối', 'Từ chối chuyển phòng'), true);
    },
  };

  // ============ Ban quản lý: Bàn giao chuyển phòng (ảnh 9, 17) ============
  P['ql-ban-giao'] = {
    role: 'admin', title: 'Bàn giao chuyển phòng',
    render: (id) => {
      const t = K.db.transfers.find((x) => x.id === id) || K.db.transfers.find((x) => x.status === 'cho-ban-giao');
      if (!t || !t.handover) return V4.adminShell({ active: 'ql-chuyen-phong' }, `<div class="card pad empty"><p>Không có yêu cầu đang chờ bàn giao.</p><button class="btn btn-outline" data-go="ql-chuyen-phong">Về xét duyệt chuyển phòng</button></div>`);
      const s = K.student(t.student) || {}; const h = t.handover; h.times = h.times || {};
      const mo = '10/2026'; const mr = (K.db.meters[mo] || {})[t.from.room] || {};
      const oldItems = [['keys', 'Thu chìa khóa phòng cũ'], ['check', 'Kiểm tra giường, bàn, tủ'], ['elec', 'Chốt chỉ số điện: ' + (mr.en != null ? mr.en.toLocaleString('vi-VN').replace(/,/g, '.') + ' kWh' : 'chưa ghi')], ['water', 'Chốt chỉ số nước: ' + (mr.wn != null ? mr.wn + ' m³' : 'chưa ghi')]];
      const newItems = [['ncheck', 'check', 'Kiểm tra giường và tủ'], ['nkeys', 'keys', 'Bàn giao chìa khóa mới']];
      const oldDone = Object.values(h.old).every(Boolean), newDone = h.new.check && h.new.keys, conf = !!h.studentConfirm, done = t.status === 'hoan-tat';
      const missing = [...oldItems.filter(([k]) => !h.old[k]).map(([, l]) => l.split(':')[0]), ...newItems.filter(([, k]) => !h.new[k]).map(([, , l]) => l), ...(conf ? [] : ['Xác nhận nhận phòng của sinh viên'])];
      const stage = done ? 5 : !oldDone ? 2 : !conf || !newDone ? 3 : 4;
      const row = (key, val, label, time, dis) => `<label class="ho-item ${val ? 'ok' : ''}"><input type="checkbox" data-ho="${key}" ${val ? 'checked' : ''} ${dis || done ? 'disabled' : ''}><span class="cbx">${val ? ic('check') : ''}</span><span>${label}</span><small>${val ? time || '' : '--/--/----'}</small></label>`;
      return V4.adminShell({ active: 'ql-chuyen-phong', search: 'Tìm kiếm sinh viên, phòng, yêu cầu...' }, `
        <div class="card bg-head"><img class="art" src="${K.A('bn_bangiao')}" alt=""><div class="row" style="gap:14px;flex-wrap:wrap"><span style="color:var(--red)">${ic('building-2', 'ic-lg')}</span><h1 class="v4-title" style="margin:0">Bàn giao chuyển phòng</h1>${V4.demo}${tBadge(t.status, true)}</div>
          <div class="bg-meta"><span>Mã yêu cầu: <b>${t.id}</b></span><span>Sinh viên: <b>${esc(s.name || t.student)}</b></span><span>MSSV: <b>${t.student}</b></span><span>Ngày duyệt: <b>${t.decision ? t.decision.date : '—'}</b></span></div></div>
        <div class="bg-grid">
          <div class="card pad"><div class="row" style="justify-content:space-between;gap:8px"><h2 class="row" style="font-size:24px;gap:12px"><span style="color:var(--red)">${ic('building-2')}</span>Trả phòng ${t.from.room} · Giường ${b2(t.from.bed)}</h2><span class="badge b-blue">Phòng cũ</span></div>
            <div class="bg-photo"><img src="${K.A(t.from.room === 'A302' ? 'bg_old' : K.room(t.from.room).img)}" alt=""><span class="ph-chip">${ic('bed-double')}Tầng ${K.fl(t.from.room)} · ${t.from.room} · Giường ${b2(t.from.bed)}</span></div>
            <h3 class="ho-t">Danh sách công việc bàn giao</h3>${oldItems.map(([k, l]) => row('old.' + k, h.old[k], l, h.times[k])).join('')}
            <h3 class="ho-t">Tình trạng phòng khi trả</h3><textarea id="ho-note" class="textarea" style="min-height:64px" ${done ? 'disabled' : ''} placeholder="Ghi nhận hiện trạng phòng, thiết bị...">${esc(h.oldNote || '')}</textarea>
            <h3 class="ho-t">Ảnh bàn giao</h3><div class="ho-photo">${h.oldPhoto ? `<img src="${K.A(h.oldPhoto.img)}" alt=""><span><b>${esc(h.oldPhoto.name)}</b><small>${h.oldPhoto.size || ''}</small></span><button class="btn btn-soft" id="ho-view">${ic('eye')}Xem ảnh</button>` : `<span class="muted">Chưa có ảnh bàn giao.</span>`}<label class="btn btn-outline btn-sm" style="position:relative;margin-left:auto">${ic('upload')}${h.oldPhoto ? 'Thay ảnh' : 'Tải ảnh'}<input type="file" accept="image/*" id="ho-up" ${done ? 'disabled' : ''} style="position:absolute;inset:0;opacity:0;cursor:pointer"></label></div></div>
          <span class="bg-arrow">${ic('arrow-right', 'ic-lg')}</span>
          <div class="card pad"><div class="row" style="justify-content:space-between;gap:8px"><h2 class="row" style="font-size:24px;gap:12px"><span style="color:var(--blue-700)">${ic('building-2')}</span>Nhận phòng ${t.to.room} · Giường ${b2(t.to.bed)}</h2><span class="badge b-red">Phòng mới</span></div>
            <div class="bg-photo"><img src="${K.A(t.to.room === 'B204' ? 'bg_new' : K.room(t.to.room).img)}" alt=""><span class="ph-chip">${ic('bed-double')}Tầng ${K.fl(t.to.room)} · ${t.to.room} · Giường ${b2(t.to.bed)}</span></div>
            <h3 class="ho-t">Danh sách công việc bàn giao</h3>${newItems.map(([tk, k, l]) => row('new.' + k, h.new[k], l, h.times[tk], !oldDone)).join('')}${row('confirm', conf, 'Sinh viên xác nhận nhận phòng', h.studentConfirm, true)}
            <h3 class="ho-t">Tình trạng phòng khi nhận</h3>${sel('ho-cond', ['Bình thường', 'Có hư hỏng nhỏ', 'Cần sửa chữa trước khi ở'], h.newCond, '', done ? 'disabled' : '')}
            <h3 class="ho-t">Xác nhận của sinh viên</h3><div class="sign-box ${conf ? 'ok' : ''}">${ic(conf ? 'badge-check' : 'pen-line')}<b>${conf ? 'Đã xác nhận' : 'Chưa xác nhận'}</b><small>${conf ? 'Sinh viên xác nhận nhận phòng lúc ' + h.studentConfirm : 'Sinh viên sẽ ký xác nhận khi hoàn tất nhận phòng.'}</small>${!conf && newDone && !done ? '<button class="btn btn-sm btn-outline" id="ho-onsite">Ghi nhận xác nhận trực tiếp</button>' : ''}</div></div></div>
        <div class="card pad"><h2 style="font-size:19px">Tiến trình bàn giao chuyển phòng</h2>${V4.steps([['Đơn được duyệt', t.decision ? t.decision.date : ''], ['Trả phòng cũ', oldDone ? (h.times.water || '').slice(6) : 'Đang thực hiện'], ['Nhận phòng mới', stage === 3 ? 'Đang thực hiện' : stage > 3 ? 'Đã hoàn tất' : 'Chưa bắt đầu'], ['Hoàn tất', done ? t.doneAt.slice(0, 10) : 'Chưa hoàn tất']], stage, 'bg-steps')}
          ${!done && missing.length ? `<div class="warn-bar">${ic('circle-alert')}<span><b>Còn thiếu ${missing.length === 1 ? missing[0].toLowerCase() : missing.length + ' hạng mục'}</b><small>${missing.length > 1 ? missing.join(', ') + '.' : 'Vui lòng hoàn tất để kết thúc quy trình bàn giao.'}</small></span><span class="sep"></span><small class="row" style="gap:8px;color:var(--orange)">${ic('info')}Phòng ở được cập nhật sau khi hoàn tất bàn giao.</small></div>` : done ? `<div class="warn-bar ok">${ic('circle-check')}<span><b>Đã hoàn tất chuyển phòng lúc ${t.doneAt}</b><small>${esc(s.name || '')} đã được chuyển sang ${t.to.room} · Giường ${b2(t.to.bed)}.</small></span></div>` : ''}
          <div class="row" style="justify-content:flex-end;gap:12px;margin-top:14px;flex-wrap:wrap"><button class="btn btn-red" id="ho-save" ${done ? 'disabled' : ''}>${ic('save')}Lưu bàn giao</button><button class="btn btn-outline-red" id="ho-print">${ic('file-text')}In biên bản</button><button class="btn ${!missing.length && !done ? 'btn-red' : 'btn-disabled'}" id="ho-done" ${!missing.length && !done ? '' : 'disabled'}>${ic('circle-check')}Hoàn tất chuyển phòng</button></div></div>`);
    },
    mount: (root, id) => {
      const t = K.db.transfers.find((x) => x.id === id) || K.db.transfers.find((x) => x.status === 'cho-ban-giao'); if (!t || !t.handover) return;
      const h = t.handover; const tk = { 'old.keys': 'keys', 'old.check': 'check', 'old.elec': 'elec', 'old.water': 'water', 'new.check': 'ncheck', 'new.keys': 'nkeys' };
      const keep = () => { const n = root.querySelector('#ho-note'); if (n) h.oldNote = n.value; const c = root.querySelector('#ho-cond'); if (c) h.newCond = c.value; };
      root.querySelectorAll('[data-ho]').forEach((c) => c.onchange = () => { keep(); const [g, k] = c.dataset.ho.split('.'); h[g][k] = c.checked; const now = new Date(); h.times[tk[c.dataset.ho]] = c.checked ? V4.pad(now.getHours()) + ':' + V4.pad(now.getMinutes()) + ' ' + K.today() : ''; if (g === 'old' && Object.values(h.old).every(Boolean)) t.history.push({ d: K.now(), t: 'Hoàn tất trả phòng cũ' }); K.save(); App.refresh(); });
      const up = root.querySelector('#ho-up'); if (up) up.onchange = async () => { keep(); try { h.oldPhoto = { name: up.files[0].name, size: V4.fileSize(up.files[0].size), img: await V4.readImage(up.files[0], 900) }; K.save(); App.refresh(); } catch (e) { App.toast(e.message, 'err'); } };
      const vw = root.querySelector('#ho-view'); if (vw) vw.onclick = () => App.modal({ title: h.oldPhoto.name, wide: true, body: `<img src="${K.A(h.oldPhoto.img)}" style="width:100%;border-radius:12px" alt="">` });
      const os = root.querySelector('#ho-onsite'); if (os) os.onclick = () => App.confirm('Xác nhận trực tiếp', 'Sinh viên đã ký xác nhận nhận phòng trực tiếp tại quầy?', 'Ghi nhận', () => { keep(); h.studentConfirm = K.now() + ' (tại quầy)'; t.history.push({ d: K.now(), t: 'Sinh viên xác nhận nhận phòng tại quầy' }); K.save(); App.refresh(); });
      const sv = root.querySelector('#ho-save'); if (sv) sv.onclick = () => { keep(); K.save(); App.toast('Đã lưu bàn giao ' + t.id); };
      root.querySelector('#ho-print').onclick = () => { keep(); const s = K.student(t.student) || {}; App.modal({ title: 'Biên bản bàn giao ' + t.id, wide: true, body: `<div class="print-area"><div style="text-align:center"><b style="color:var(--navy)">ĐẠI HỌC NGHỆ AN · BAN QUẢN LÝ KÝ TÚC XÁ</b><h3 style="font-size:22px;margin-top:6px">BIÊN BẢN BÀN GIAO CHUYỂN PHÒNG</h3><p class="muted small">Số ${t.id} · ${K.today()}</p></div><dl class="kv" style="grid-template-columns:180px 1fr;margin-top:14px"><dt>Sinh viên</dt><dd>${esc(s.name || '')} (${t.student})</dd><dt>Trả phòng</dt><dd>${t.from.room} · Giường ${b2(t.from.bed)}</dd><dt>Nhận phòng</dt><dd>${t.to.room} · Giường ${b2(t.to.bed)}</dd><dt>Tình trạng khi trả</dt><dd style="font-weight:400">${esc(h.oldNote || '—')}</dd><dt>Tình trạng khi nhận</dt><dd>${esc(h.newCond)}</dd><dt>Sinh viên xác nhận</dt><dd>${h.studentConfirm || 'Chưa xác nhận'}</dd></dl><table class="tbl compact" style="margin-top:12px">${Object.entries(tk).map(([k, tt]) => `<tr><td>${{ keys: 'Thu chìa khóa phòng cũ', check: 'Kiểm tra giường, bàn, tủ', elec: 'Chốt chỉ số điện', water: 'Chốt chỉ số nước', ncheck: 'Kiểm tra giường và tủ mới', nkeys: 'Bàn giao chìa khóa mới' }[tt]}</td><td class="r">${h.times[tt] || '—'}</td></tr>`).join('')}</table><div class="grid g2" style="margin-top:30px;text-align:center"><div><b>Sinh viên</b><p class="muted small">(ký, ghi rõ họ tên)</p></div><div><b>Cán bộ quản lý</b><p class="muted small">(ký, ghi rõ họ tên)</p></div></div></div>`, foot: `<button class="btn btn-outline" data-print>${ic('printer')}In</button><button class="btn btn-red" data-x>Đóng</button>`, onMount: (el) => el.querySelector('[data-print]').onclick = () => V4.print(el) }); };
      const dn = root.querySelector('#ho-done'); if (dn && !dn.disabled) dn.onclick = () => App.confirm('Hoàn tất chuyển phòng', 'Chuyển <b>' + esc(V4.sname(t.student)) + '</b> từ ' + t.from.room + ' sang <b>' + t.to.room + ' · Giường ' + b2(t.to.bed) + '</b>. Hợp đồng và danh sách phòng sẽ được cập nhật.', 'Hoàn tất', () => {
        keep(); const s = K.student(t.student);
        if (!K.bedMap(t.to.room)[t.to.bed - 1].free) return App.toast('Giường đích đã có người, không thể hoàn tất', 'err');
        App.assignBed(s, t.to.room, t.to.bed); s.since = K.today();
        t.status = 'hoan-tat'; t.doneAt = K.now(); t.history.push({ d: K.now(), t: 'Hoàn tất chuyển phòng' });
        V4.notify(t.student, 'Hoàn tất chuyển phòng ' + t.id, 'Bạn đã được chuyển sang phòng ' + t.to.room + ' · Giường ' + b2(t.to.bed) + '. Chúc bạn sinh hoạt vui vẻ!');
        K.save(); App.toast('Đã hoàn tất chuyển phòng ' + t.id); App.refresh();
      });
    },
  };

  // ============ Ban quản lý: Theo dõi tạm vắng (ảnh 13, 16) ============
  P['ql-cu-tru'] = {
    role: 'admin', title: 'Theo dõi tạm vắng',
    render: () => {
      const st = App.state('tv', { tab: 'all', from: '2026-10-01', to: '2026-10-31', khu: '', sel: 'TV-001', checked: ['TV-001'] });
      const A = K.db.absences;
      let list = A.filter((a) => (!st.from || a.to >= st.from) && (!st.to || a.from <= st.to) && (!st.khu || K.fl(a.room) === st.khu));
      const n = { all: list.length, dang: list.filter((a) => ['dang-vang', 'qua-han'].includes(absStatus(a))).length, back: list.filter((a) => a.status === 'da-tro-lai').length };
      if (st.tab === 'dang') list = list.filter((a) => ['dang-vang', 'qua-han'].includes(absStatus(a))); else if (st.tab === 'back') list = list.filter((a) => a.status === 'da-tro-lai');
      const a = list.find((x) => x.id === st.sel) || list[0]; if (a) st.sel = a.id;
      const pendingCo = (K.db.checkouts || []).filter((c) => ['cho-kiem-tra', 'da-kiem-tra', 'da-doi-soat'].includes(c.status)).length;
      let panel = `<div class="card pad empty"><p>Không có yêu cầu phù hợp.</p></div>`;
      if (a) {
        const s = K.student(a.student) || {}; const sa = absStatus(a);
        const items = [{ t: 'Gửi yêu cầu', d: a.at, s: 'Sinh viên đã gửi yêu cầu tạm vắng.', st: 'done' }, { t: 'Xác nhận rời KTX', d: a.leftAt || '-', s: a.leftAt ? 'Đã xác nhận sinh viên rời ký túc xá.' : 'Chờ xác nhận sinh viên đã rời ký túc xá.', st: a.leftAt ? 'done' : ['cho-xac-nhan', 'bo-sung'].includes(a.status) ? 'cur' : 'todo' }, { t: 'Ghi nhận trở lại', d: a.backAt || '-', s: a.backAt ? 'Sinh viên đã trở lại ký túc xá.' : 'Chỉ có thể ghi nhận khi sinh viên đã rời KTX.', st: a.backAt ? 'done' : a.leftAt ? 'cur' : 'todo' }];
        panel = `<div class="card pad"><div class="row" style="justify-content:space-between;gap:8px"><h2 style="font-size:26px">Yêu cầu ${a.id}</h2>${dotBadge(AST, sa)}</div>
          <div class="row" style="margin:14px 0">${av(s.avatar, 64)}<span><b style="font-size:18px;color:var(--navy);display:block">${esc(s.name || a.student)}</b><small class="muted">${a.student}</small></span></div>
          <div class="kv-ic tv-kv"><div>${ic('building')}<span>Phòng</span><b>${a.room} · Tầng ${K.fl(a.room)}</b></div><div>${ic('file-text')}<span>Lý do tạm vắng</span><b>${esc(a.reason)}</b></div><div>${ic('plane-takeoff')}<span>Ngày rời ký túc xá</span><b>${V4.dmy(a.from)}</b></div><div>${ic('calendar-days')}<span>Ngày dự kiến trở lại</span><b>${V4.dmy(a.to)}</b></div><div>${ic('phone')}<span>Liên hệ khi tạm vắng</span><b class="row" style="gap:8px"><span id="tv-ph">${V4.mask(a.phone)}</span><button class="xbtn" id="tv-eye" style="padding:2px" aria-label="Hiện số">${ic('eye')}</button></b></div></div>
          ${a.returnReport ? `<div class="reply-box" style="background:var(--blue-50)">${ic('info')} Sinh viên báo đã trở lại lúc ${a.returnReport}.</div>` : ''}
          <h3 style="font-size:18px;margin:16px 0 8px">Tiến trình xử lý</h3><div class="tv-steps">${items.map((x) => `<div class="tv-st ${x.st}"><span class="vt-dot">${x.st === 'done' ? ic('check') : ''}</span><span><b>${x.t}</b><small>${x.d}</small></span><small class="muted">${x.s}</small></div>`).join('')}</div>
          <div class="field" style="margin-top:14px"><label for="tv-note">Ghi chú</label><div style="position:relative"><textarea id="tv-note" class="textarea" data-max="500" placeholder="Nhập ghi chú (nếu có)...">${esc(a.note || '')}</textarea><span class="counter">0/500</span></div></div>
          <div class="grid g3 tv-acts" style="gap:8px;margin-top:12px"><button class="btn ${['cho-xac-nhan', 'bo-sung'].includes(a.status) ? 'btn-red' : 'btn-disabled'}" id="tv-ok" ${['cho-xac-nhan', 'bo-sung'].includes(a.status) ? '' : 'disabled'}>${ic('circle-check')}Xác nhận tạm vắng</button><button class="btn ${a.status === 'cho-xac-nhan' ? 'btn-outline-red' : 'btn-disabled'}" id="tv-more" ${a.status === 'cho-xac-nhan' ? '' : 'disabled'}>${ic('file-text')}Yêu cầu bổ sung</button><button class="btn ${a.status === 'dang-vang' ? 'btn-outline' : 'btn-disabled'}" id="tv-back" ${a.status === 'dang-vang' ? '' : 'disabled'}>${ic('arrow-right')}Ghi nhận trở lại</button></div></div>`;
      }
      const letters = ['blue', 'green', 'red', 'amber'];
      return V4.adminShell({ active: 'ql-cu-tru', search: 'Tìm kiếm sinh viên, phòng, yêu cầu...', foot: 'art' }, `
        <div class="phead v4h"><img class="art" src="${K.A('bn_tamvang')}" alt=""><h1>Theo dõi tạm vắng ${V4.demo}</h1><p class="desc">Quản lý và theo dõi sinh viên tạm vắng khỏi ký túc xá.</p></div>
        <div class="grid resp-1" style="grid-template-columns:1fr 470px;gap:14px;align-items:start">
          <div style="display:flex;flex-direction:column;gap:12px;min-width:0">
            <div class="row tv-tabs-row"><div class="folder-tabs">${[['all', 'Tất cả', n.all], ['dang', 'Đang tạm vắng', n.dang], ['back', 'Đã trở lại', n.back]].map(([k, t, c]) => `<button class="ftab ${st.tab === k ? 'on' : ''}" data-tab="${k}">${t}<span>${c}</span></button>`).join('')}</div><button class="btn btn-outline btn-sm" data-go="ql-tra-phong" style="margin-left:auto">${ic('luggage')}Yêu cầu trả phòng${pendingCo ? ` <span class="cnt-dot">${pendingCo}</span>` : ''}</button></div>
            <div class="card pad tv-filter"><div class="field"><label>Khoảng thời gian</label><div class="daterange">${ic('calendar-days')}<input type="date" id="tv-from" value="${st.from}">–<input type="date" id="tv-to" value="${st.to}"></div></div><div class="field"><label for="tv-khu">Tầng</label><div class="iwrap">${ic('building')}${sel('tv-khu', [['', 'Tất cả tầng'], ...App.khuOpts()], st.khu)}</div></div></div>
            <div class="card pad" style="padding:12px;min-height:520px;display:flex;flex-direction:column">
              ${st.checked.length > 1 ? `<div class="bulk-bar">${ic('list-checks')}Đã chọn ${st.checked.length} yêu cầu<button class="btn btn-sm btn-red" id="tv-bulk">Xác nhận các yêu cầu đã chọn</button></div>` : ''}
              <div class="tbl-wrap" style="border:0"><table class="tbl hover tv-tbl"><thead><tr><th style="width:40px"><label class="check blue"><input type="checkbox" id="tv-all"></label></th><th>Mã yêu cầu</th><th>Sinh viên</th><th>Phòng</th><th>Thời gian tạm vắng</th><th>Trạng thái</th><th class="c">Thao tác</th></tr></thead><tbody>
                ${list.map((x, i) => { const s = K.student(x.student) || {}; return `<tr data-a="${x.id}" class="${x.id === st.sel ? 'sel' : ''}"><td><label class="check blue" data-stop><input type="checkbox" data-chk="${x.id}" ${st.checked.includes(x.id) ? 'checked' : ''}></label></td><td><b style="color:var(--navy)">${x.id}</b></td><td><span class="who">${av(s.avatar, 40)}<span><b>${esc(s.name || x.student)}</b><small>${x.student}</small></span></span></td><td>${x.room}</td><td class="num" style="white-space:nowrap">${V4.dmy(x.from)} -<br>${V4.dmy(x.to)}</td><td>${dotBadge(AST, absStatus(x))}</td><td class="c"><button class="xbtn" data-menu="${x.id}" data-stop aria-label="Thao tác">${ic('ellipsis-vertical')}</button></td></tr>`; }).join('') || '<tr><td colspan="7" class="muted" style="text-align:center;padding:28px">Không có yêu cầu trong khoảng thời gian này.</td></tr>'}
              </tbody></table></div>
              <div class="info-strip" style="margin-top:auto">${ic('info')}Ghi nhận thời gian rời và trở lại để theo dõi cư trú.</div></div></div>
          ${panel}</div>`);
    },
    mount: (root) => {
      const st = App.st.tv;
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; st.sel = null; App.refresh(); });
      [['#tv-from', 'from'], ['#tv-to', 'to'], ['#tv-khu', 'khu']].forEach(([id, k]) => root.querySelector(id).onchange = (e) => { st[k] = e.target.value; App.refresh(); });
      root.querySelectorAll('[data-a]').forEach((tr) => tr.onclick = (e) => { if (e.target.closest('[data-stop]')) return; st.sel = tr.dataset.a; App.refresh(); });
      root.querySelectorAll('[data-chk]').forEach((c) => c.onchange = () => { st.checked = c.checked ? [...new Set(st.checked.concat(c.dataset.chk))] : st.checked.filter((x) => x !== c.dataset.chk); App.refresh(); });
      const all = root.querySelector('#tv-all'); if (all) all.onchange = () => { st.checked = all.checked ? [...root.querySelectorAll('[data-chk]')].map((c) => c.dataset.chk) : []; App.refresh(); };
      const A = (id) => K.db.absences.find((x) => x.id === id);
      const confirmAbs = (a) => { a.status = 'dang-vang'; a.leftAt = K.now(); a.note = (root.querySelector('#tv-note') || {}).value || a.note; V4.notify(a.student, 'Đã xác nhận tạm vắng ' + a.id, 'Ban quản lý đã xác nhận bạn tạm vắng từ ' + V4.dmy(a.from) + ' đến ' + V4.dmy(a.to) + '. Khi trở lại, vui lòng báo với bảo vệ hoặc bấm “Báo đã trở lại” trên hệ thống.'); };
      const bulk = root.querySelector('#tv-bulk'); if (bulk) bulk.onclick = () => { const xs = st.checked.map(A).filter((a) => a && ['cho-xac-nhan', 'bo-sung'].includes(a.status)); if (!xs.length) return App.toast('Không có yêu cầu nào đang chờ xác nhận trong danh sách đã chọn', 'err'); xs.forEach(confirmAbs); K.save(); App.toast('Đã xác nhận ' + xs.length + ' yêu cầu'); App.refresh(); };
      root.querySelectorAll('[data-menu]').forEach((b) => b.onclick = (e) => { e.stopPropagation(); st.sel = b.dataset.menu; App.refresh(); });
      const a = A(st.sel); if (!a) return;
      const eye = root.querySelector('#tv-eye'); if (eye) eye.onclick = () => { root.querySelector('#tv-ph').textContent = a.phone; };
      const ok = root.querySelector('#tv-ok'); if (ok && !ok.disabled) ok.onclick = () => { confirmAbs(a); V4.log('Xác nhận tạm vắng', 'Xác nhận tạm vắng ' + a.id + ' của ' + V4.sname(a.student)); K.save(); App.toast('Đã xác nhận tạm vắng ' + a.id); App.refresh(); };
      const more = root.querySelector('#tv-more'); if (more && !more.disabled) more.onclick = () => { const n = root.querySelector('#tv-note').value.trim(); if (n.length < 10) return App.toast('Nhập nội dung cần bổ sung vào ô Ghi chú (tối thiểu 10 ký tự)', 'err'); a.status = 'bo-sung'; a.note = n; V4.notify(a.student, 'Yêu cầu tạm vắng ' + a.id + ' cần bổ sung', n); K.save(); App.toast('Đã yêu cầu sinh viên bổ sung'); App.refresh(); };
      const back = root.querySelector('#tv-back'); if (back && !back.disabled) back.onclick = () => { a.status = 'da-tro-lai'; a.backAt = K.now(); a.note = root.querySelector('#tv-note').value || a.note; V4.log('Ghi nhận trở lại', V4.sname(a.student) + ' trở lại ký túc xá (' + a.id + ')'); K.save(); App.toast('Đã ghi nhận ' + V4.sname(a.student) + ' trở lại'); App.refresh(); };
    },
  };

  // ============ Sinh viên: Tạm vắng ============
  const AREASONS = ['Về thăm gia đình', 'Việc cá nhân', 'Hoạt động của nhà trường', 'Khám, chữa bệnh', 'Thực tập, công tác', 'Lý do khác'];
  P['sv-tam-vang'] = {
    role: 'student', title: 'Đăng ký tạm vắng',
    render: () => {
      const u = K.me(); const mine = K.db.absences.filter((a) => a.student === u.id).slice().reverse();
      const st = App.state('svtv', () => ({ reason: AREASONS[0], from: V4.todayIso(), to: '', phone: u.phone, note: '', editId: null }));
      return V4.svShell({ active: 'sv-ho-so', search: 'Tìm kiếm thông báo, dịch vụ, hướng dẫn...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('bn_tamvang')}" alt=""><h1>Đăng ký tạm vắng ${V4.demo}</h1><p class="desc">Báo vắng mặt qua đêm khỏi ký túc xá để Ban quản lý theo dõi cư trú.</p>${V4.stayNav('sv-tam-vang')}</div>
        <div class="grid resp-1" style="grid-template-columns:1fr 1fr;gap:16px;align-items:start">
          <form class="card pad" id="tv-f" novalidate><h2 class="card-t" style="font-size:20px">${ic('plane-takeoff')}${st.editId ? 'Bổ sung yêu cầu ' + st.editId : 'Tạo yêu cầu tạm vắng'}</h2>
            ${u.room ? '' : '<div class="warn-bar">' + ic('info') + '<span><b>Bạn chưa có phòng</b><small>Chỉ sinh viên đang ở mới cần đăng ký tạm vắng.</small></span></div>'}
            <div class="field" style="margin-top:12px"><label for="sv-tv-r">Lý do tạm vắng <span class="req">*</span></label>${sel('sv-tv-r', AREASONS, st.reason)}</div>
            <div class="grid g2" style="gap:12px;margin-top:12px"><div class="field"><label for="sv-tv-from">Ngày rời ký túc xá <span class="req">*</span></label><input id="sv-tv-from" type="date" class="input" value="${st.from}" min="${V4.todayIso()}"></div><div class="field"><label for="sv-tv-to">Ngày dự kiến trở lại <span class="req">*</span></label><input id="sv-tv-to" type="date" class="input" value="${st.to}" min="${V4.todayIso()}"></div></div>
            <div class="field" style="margin-top:12px"><label for="sv-tv-ph">Số điện thoại liên hệ khi tạm vắng <span class="req">*</span></label><input id="sv-tv-ph" class="input" inputmode="tel" value="${esc(st.phone || '')}"></div>
            <div class="field" style="margin-top:12px"><label for="sv-tv-note">Ghi chú</label><textarea id="sv-tv-note" class="textarea" style="min-height:80px" placeholder="Địa chỉ nơi đến, người thân đi cùng...">${esc(st.note)}</textarea></div>
            <p class="err" id="sv-tv-err" hidden style="margin-top:8px"></p>
            <button class="btn btn-red btn-block btn-lg" style="margin-top:14px" ${u.room ? '' : 'disabled'}>${ic('send')}${st.editId ? 'Gửi lại yêu cầu' : 'Gửi yêu cầu tạm vắng'}</button>
            <p class="muted small" style="margin-top:10px">Vắng mặt qua đêm mà không đăng ký có thể bị ghi nhận vi phạm nội quy (trừ 10 điểm nề nếp).</p></form>
          <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('history')}Yêu cầu của tôi</h2>${mine.length ? mine.map((a) => `<div class="viol-item"><div class="row" style="justify-content:space-between;gap:8px"><b style="color:var(--navy)">${a.id} · ${esc(a.reason)}</b>${dotBadge(AST, absStatus(a))}</div><div class="small muted" style="margin-top:6px">${V4.dmy(a.from)} → ${V4.dmy(a.to)} · Gửi ${a.at}</div>${a.leftAt ? `<div class="small" style="margin-top:4px">Rời KTX: ${a.leftAt}${a.backAt ? ' · Trở lại: ' + a.backAt : ''}</div>` : ''}${a.status === 'bo-sung' ? `<div class="reply-box" style="background:var(--blue-50)"><b style="color:var(--blue-700)">Ban quản lý đề nghị bổ sung</b><p>${esc(a.note)}</p></div><button class="btn btn-sm btn-red" data-edit="${a.id}" style="margin-top:8px">Bổ sung và gửi lại</button>` : ''}${a.status === 'cho-xac-nhan' ? `<button class="btn btn-sm btn-outline-red" data-cancel="${a.id}" style="margin-top:8px">Hủy yêu cầu</button>` : ''}${a.status === 'dang-vang' && !a.returnReport ? `<button class="btn btn-sm btn-outline" data-back="${a.id}" style="margin-top:8px">${ic('log-in')}Báo đã trở lại</button>` : ''}</div>`).join('') : '<p class="muted" style="padding:20px;text-align:center">Chưa có yêu cầu tạm vắng.</p>'}</div></div>`);
    },
    mount: (root) => {
      const st = App.st.svtv; const u = K.me(); const A = (id) => K.db.absences.find((x) => x.id === id);
      root.querySelectorAll('[data-edit]').forEach((b) => b.onclick = () => { const a = A(b.dataset.edit); Object.assign(st, { reason: a.reason, from: a.from, to: a.to, phone: a.phone, note: '', editId: a.id }); App.refresh(); });
      root.querySelectorAll('[data-cancel]').forEach((b) => b.onclick = () => { K.db.absences = K.db.absences.filter((x) => x.id !== b.dataset.cancel); K.save(); App.toast('Đã hủy yêu cầu'); App.refresh(); });
      root.querySelectorAll('[data-back]').forEach((b) => b.onclick = () => { const a = A(b.dataset.back); a.returnReport = K.now(); K.save(); App.toast('Đã báo trở lại. Ban quản lý sẽ ghi nhận.'); App.refresh(); });
      root.querySelector('#tv-f').onsubmit = (e) => {
        e.preventDefault(); const g = (id) => root.querySelector(id).value.trim();
        const err = root.querySelector('#sv-tv-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        const d = { reason: g('#sv-tv-r'), from: g('#sv-tv-from'), to: g('#sv-tv-to'), phone: g('#sv-tv-ph'), note: g('#sv-tv-note') };
        if (!d.from || !d.to) return fail('Chọn ngày rời và ngày dự kiến trở lại.');
        if (d.to < d.from) return fail('Ngày trở lại phải sau hoặc bằng ngày rời.');
        if (!/^0\d{9}$/.test(d.phone.replace(/\s/g, ''))) return fail('Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.');
        if (K.db.absences.some((a) => a.student === u.id && a.id !== st.editId && ['cho-xac-nhan', 'dang-vang'].includes(a.status) && a.from <= d.to && a.to >= d.from)) return fail('Bạn đã có yêu cầu tạm vắng trùng thời gian.');
        const a = st.editId ? A(st.editId) : { id: V4.nextId(K.db.absences, 'TV-'), student: u.id };
        Object.assign(a, d, { room: u.room, status: 'cho-xac-nhan', at: K.now() }); if (!st.editId) K.db.absences.push(a);
        K.save(); App.st.svtv = null; App.toast('Đã gửi yêu cầu tạm vắng ' + a.id); App.refresh();
      };
    },
  };

  // ============ Sinh viên: Trả phòng & đối soát (ảnh 10, 15) ============
  const CO_ITEMS = [['assets', 'Tài sản trong phòng', 'Bàn, ghế, tủ, nệm, thiết bị...', 'box'], ['keys', 'Chìa khóa', 'Bàn giao chìa khóa phòng', 'key-round'], ['meter', 'Điện nước cuối kỳ', 'Kiểm tra chỉ số, đối soát chi phí', 'zap'], ['manager', 'Xác nhận ban quản lý', 'Ban quản lý kiểm tra phòng', 'user-round']];
  const settle = (sid, extra) => {
    const inv = unpaid(sid); let rent = 0, util = 0, other = 0;
    inv.forEach((i) => i.items.forEach((x) => { if (/điện|nước/i.test(x.name)) util += x.amount; else if (/phòng/i.test(x.name) && !i.kind) rent += x.amount; else other += x.amount; }));
    const dmg = (extra && extra.damage) || 0;
    return { deposit: DEPOSIT, rent, util, other, dmg, refund: DEPOSIT - rent - util - other - dmg };
  };
  V4.settle = settle;
  const settleBox = (s, status) => `<div class="settle"><div class="settle-h">${ic('coins', 'ic-lg')}<span><b>Đối soát ${status === 'da-doi-soat' || status === 'hoan-tat' ? 'chính thức' : 'tạm tính'}</b><small>Các khoản phí được tính đến thời điểm hiện tại.</small></span>${status === 'da-doi-soat' || status === 'hoan-tat' ? badge('Đã đối soát', 'green', { icon: 'circle-check', sm: true }) : badge('Chưa đối soát', 'orange', { icon: 'clock', sm: true })}</div>
    <div class="settle-rows"><div>${ic('database')}<span>Tiền cọc mẫu</span><b>${money(s.deposit)}</b></div>${s.rent ? `<div>${ic('house')}<span>Tiền phòng chưa thanh toán</span><b>−${money(s.rent)}</b></div>` : ''}<div>${ic('zap')}<span>Điện nước chưa thanh toán</span><b>${s.util ? '−' : ''}${money(s.util)}</b></div>${s.other ? `<div>${ic('receipt-text')}<span>Khoản phí khác</span><b>−${money(s.other)}</b></div>` : ''}${s.dmg ? `<div>${ic('wrench')}<span>Bồi thường tài sản</span><b>−${money(s.dmg)}</b></div>` : ''}</div>
    <div class="settle-total ${s.refund < 0 ? 'neg' : ''}"><b>${s.refund >= 0 ? 'Dự kiến hoàn' : 'Cần nộp thêm'}</b><strong>${money(Math.abs(s.refund))}</strong></div><p class="small muted row" style="gap:8px">${ic('info')}Giá trị cuối cùng sau kiểm tra phòng và đối soát.</p></div>`;
  P['sv-tra-phong'] = {
    role: 'student', title: 'Trả phòng & đối soát',
    render: () => {
      const u = K.me(); const co = (K.db.checkouts || []).filter((c) => c.student === u.id && c.status !== 'da-huy').slice(-1)[0];
      const shell = (b) => V4.svShell({ active: 'sv-ho-so', search: 'Tìm kiếm thông báo, dịch vụ, hướng dẫn...' }, b);
      const stage = !co || co.status === 'nhap' ? 1 : co.status === 'cho-kiem-tra' ? 2 : co.status === 'da-kiem-tra' ? 3 : 4;
      const head = `<div class="phead v4h tp-head"><img class="art" src="${K.A('bn_traphong')}" alt=""><h1>Trả phòng &amp; đối soát ${V4.demo}</h1><p class="desc">Gửi yêu cầu trả phòng, thực hiện bàn giao và đối soát các khoản chi phí (nếu có).</p>${V4.steps([['Gửi đơn'], ['Kiểm tra phòng'], ['Đối soát'], ['Hoàn tất']], co && co.status === 'hoan-tat' ? 5 : stage, 'tp-steps')}</div>`;
      if (!u.room && !(co && co.status === 'hoan-tat')) return shell(head + `<div class="card pad empty"><p>Bạn không có phòng đang ở để trả.</p></div>`);
      const st = App.state('tp', () => co && co.status === 'nhap' ? JSON.parse(JSON.stringify(co)) : { date: '2026-10-31', reason: 'Kết thúc nhu cầu lưu trú', method: 'Cập nhật sau khi duyệt', photos: [] });
      const ro = co && co.status !== 'nhap';
      const d = ro ? co : st;
      const s = ro && co.settle ? co.settle : settle(u.id, co);
      const r = u.room || (co && co.room);
      const tr = myTransfer(u.id);
      return shell(head + `${tr ? `<div class="warn-bar">${ic('triangle-alert')}<span><b>Bạn đang có yêu cầu chuyển phòng ${tr.id}</b><small>Hãy hủy hoặc hoàn tất yêu cầu chuyển phòng trước khi trả phòng.</small></span></div>` : ''}
        <div class="grid resp-1" style="grid-template-columns:1fr 470px;gap:16px;align-items:start">
          <div style="display:flex;flex-direction:column;gap:16px;min-width:0">
            <div class="card pad"><h2 class="card-t" style="font-size:22px">${ic('file-text')}Thông tin trả phòng ${ro ? dotBadge(COST, co.status) : ''}</h2>
              <div class="tp-info"><div><div class="tp-kv">${ic('user-round')}<span>Họ tên sinh viên</span><b>${esc(u.name)}<small>Mã sinh viên: ${u.id}</small></b></div><div class="tp-kv">${ic('house')}<span>Phòng - Giường</span><b>${r} - Giường ${b2(u.bed || co.bed)}</b></div></div>
                <div><div class="field"><label for="tp-date">${ic('calendar-days')}Ngày dự kiến trả phòng</label><input id="tp-date" type="date" class="input" value="${d.date}" ${ro ? 'disabled' : ''} min="${V4.todayIso()}"></div><div class="field" style="margin-top:10px"><label for="tp-reason">${ic('file-text')}Lý do trả phòng</label>${sel('tp-reason', ['Kết thúc nhu cầu lưu trú', 'Tốt nghiệp', 'Chuyển ra ngoài ở', 'Bảo lưu / tạm nghỉ học', 'Lý do khác'], d.reason, '', ro ? 'disabled' : '')}</div></div></div></div>
            <div class="card pad"><div class="card-h"><h2 class="card-t" style="font-size:22px">${ic('clipboard-check')}Danh sách bàn giao</h2><small style="color:var(--blue-700)">Các hạng mục cần hoàn tất khi bàn giao phòng</small></div>
              <div class="tbl-wrap"><table class="tbl compact"><thead><tr><th>STT</th><th>Hạng mục</th><th>Mô tả</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead><tbody>${CO_ITEMS.map(([k, t, ds, i], n) => { const done = co && co.items && co.items[k]; return `<tr><td>0${n + 1}</td><td><span class="row" style="gap:10px">${ic(i)}${t}</span></td><td class="muted">${ds}</td><td>${done ? `<span class="badge b-green b-sm">${ic('circle-check')}Đã hoàn tất</span>` : `<span class="badge b-orange b-sm">${ic('clock')}Chưa thực hiện</span>`}</td><td>${co && co.notes && co.notes[k] ? esc(co.notes[k]) : '-'}</td></tr>`; }).join('')}</tbody></table></div></div>
            <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('image')}Ảnh hiện trạng khi trả phòng</h2><p class="muted small" style="margin:4px 0 12px 36px">Tải ảnh chụp hiện trạng phòng (tối đa 5 ảnh, mỗi ảnh ≤ 5MB)</p>
              <div class="tp-photos">${!ro && d.photos.length < 5 ? `<label class="tp-ph add">${ic('plus')}<span>Thêm ảnh</span><input type="file" accept="image/*" multiple id="tp-up"></label>` : ''}${d.photos.map((p, i) => `<div class="tp-ph"><img src="${K.A(p)}" alt="">${ro ? '' : `<button class="ev-x" data-pdel="${i}">${ic('x')}</button>`}</div>`).join('')}${Array.from({ length: Math.max(0, (ro ? 5 : 4) - d.photos.length) }, () => `<div class="tp-ph ghost">${ic('image')}</div>`).join('')}</div></div></div>
          <div class="card pad tp-right">${settleBox(s, co && co.status)}
            <h3 style="font-size:19px;margin:16px 0 8px">Phương thức nhận hoàn</h3><div class="iwrap">${ic('credit-card')}${sel('tp-method', ['Cập nhật sau khi duyệt', 'Chuyển khoản ngân hàng', 'Tiền mặt tại quầy'], d.method, '', ro && co.status === 'hoan-tat' ? 'disabled' : '')}</div>
            <div class="info-strip">${ic('info')}Bạn có thể cập nhật phương thức nhận hoàn sau khi Ban quản lý kiểm tra phòng và xác nhận đối soát.</div>
            <img src="${K.A('art_suitcase')}" alt="" class="tp-art">
            ${ro ? (co.status === 'hoan-tat' ? `<div class="warn-bar ok">${ic('circle-check')}<span><b>Đã hoàn tất trả phòng ${co.doneAt}</b><small>Cảm ơn bạn đã đồng hành cùng ký túc xá.</small></span></div>` : `<div class="grid g2" style="gap:10px"><button class="btn btn-outline-red btn-lg" id="tp-cancel" ${co.status === 'cho-kiem-tra' ? '' : 'disabled'}>${ic('x')}Hủy yêu cầu</button><button class="btn btn-red btn-lg" id="tp-method-save">${ic('save')}Cập nhật nhận hoàn</button></div>`)
              : `<div class="grid g2" style="gap:10px"><button class="btn btn-outline-red btn-lg" id="tp-draft">${ic('file-text')}Lưu nháp</button><button class="btn btn-red btn-lg" id="tp-send" ${tr ? 'disabled' : ''}>${ic('send')}Gửi yêu cầu trả phòng</button></div>`}</div></div>`);
    },
    mount: (root) => {
      const u = K.me(); const st = App.st.tp; const co = (K.db.checkouts || []).filter((c) => c.student === u.id && c.status !== 'da-huy').slice(-1)[0];
      const keep = () => { if (!st) return; const g = (id) => root.querySelector(id); if (g('#tp-date') && !g('#tp-date').disabled) { st.date = g('#tp-date').value; st.reason = g('#tp-reason').value; } st.method = g('#tp-method').value; };
      const up = root.querySelector('#tp-up'); if (up) up.onchange = async () => { keep(); for (const f of [...up.files].slice(0, 5 - st.photos.length)) { try { st.photos.push(await V4.readImage(f, 700)); } catch (e) { App.toast(e.message, 'err'); } } App.refresh(); };
      root.querySelectorAll('[data-pdel]').forEach((b) => b.onclick = () => { keep(); st.photos.splice(+b.dataset.pdel, 1); App.refresh(); });
      const save = (status) => {
        keep(); if (!st.date) return App.toast('Chọn ngày dự kiến trả phòng', 'err');
        const rec = co && co.status === 'nhap' ? co : { id: V4.nextId(K.db.checkouts, 'TP-'), student: u.id, room: u.room, bed: u.bed, items: { assets: false, keys: false, meter: false, manager: false }, notes: {} };
        Object.assign(rec, { date: st.date, reason: st.reason, method: st.method, photos: st.photos, status, at: K.now() });
        if (!K.db.checkouts.includes(rec)) K.db.checkouts.push(rec);
        K.save(); App.st.tp = null; App.toast(status === 'nhap' ? 'Đã lưu nháp yêu cầu trả phòng' : 'Đã gửi yêu cầu trả phòng ' + rec.id + '. Ban quản lý sẽ hẹn lịch kiểm tra phòng.'); App.refresh();
      };
      const dr = root.querySelector('#tp-draft'); if (dr) dr.onclick = () => save('nhap');
      const sd = root.querySelector('#tp-send'); if (sd && !sd.disabled) sd.onclick = () => { keep(); App.confirm('Gửi yêu cầu trả phòng', 'Trả phòng <b>' + u.room + '</b> ngày <b>' + V4.dmy(st.date) + '</b> (' + esc(st.reason) + '). Ban quản lý sẽ kiểm tra phòng và đối soát chi phí.', 'Gửi yêu cầu', () => save('cho-kiem-tra')); };
      const cc = root.querySelector('#tp-cancel'); if (cc && !cc.disabled) cc.onclick = () => App.confirm('Hủy yêu cầu trả phòng', 'Hủy yêu cầu ' + co.id + '?', 'Hủy yêu cầu', () => { co.status = 'da-huy'; K.save(); App.st.tp = null; App.refresh(); }, true);
      const ms = root.querySelector('#tp-method-save'); if (ms) ms.onclick = () => { co.method = root.querySelector('#tp-method').value; K.save(); App.toast('Đã cập nhật phương thức nhận hoàn'); };
    },
  };

  // ============ Ban quản lý: Xử lý trả phòng ============
  P['ql-tra-phong'] = {
    role: 'admin', title: 'Yêu cầu trả phòng',
    render: () => {
      const st = App.state('qtp', { sel: null });
      const list = (K.db.checkouts || []).filter((c) => c.status !== 'nhap').slice().reverse();
      const c = list.find((x) => x.id === st.sel) || list[0]; if (c) st.sel = c.id;
      let panel = `<div class="card pad empty"><span class="amen-ic blue">${ic('luggage')}</span><p>Chưa có yêu cầu trả phòng nào.</p><p class="small">Sinh viên gửi yêu cầu tại Lưu trú › Trả phòng.</p></div>`;
      if (c) {
        const s = K.student(c.student) || {}; const live = c.settle || settle(c.student, c); const mr = (K.db.meters['10/2026'] || {})[c.room] || {};
        const fin = c.status === 'hoan-tat';
        panel = `<div class="card pad"><div class="row" style="justify-content:space-between;gap:8px"><h2 style="font-size:24px">Yêu cầu ${c.id}</h2>${dotBadge(COST, c.status)}</div>
          <div class="row" style="margin:12px 0">${av(s.avatar, 56)}<span><b style="font-size:18px;color:var(--navy);display:block">${esc(s.name || c.student)}</b><small class="muted">${c.student} · ${c.room} · Giường ${b2(c.bed)}</small></span></div>
          <dl class="kv" style="grid-template-columns:170px 1fr;font-size:14.5px"><dt>Ngày dự kiến trả</dt><dd>${V4.dmy(c.date)}</dd><dt>Lý do</dt><dd>${esc(c.reason)}</dd><dt>Nhận hoàn</dt><dd>${esc(c.method)}</dd><dt>Gửi lúc</dt><dd>${c.at}</dd></dl>
          ${c.photos.length ? `<div class="tp-photos" style="margin-top:10px">${c.photos.map((p) => `<div class="tp-ph"><img src="${K.A(p)}" alt=""></div>`).join('')}</div>` : ''}
          <h3 style="font-size:17px;margin:14px 0 8px">Kiểm tra phòng</h3>${CO_ITEMS.map(([k, t, ds, i]) => `<label class="ho-item ${c.items[k] ? 'ok' : ''}"><input type="checkbox" data-it="${k}" ${c.items[k] ? 'checked' : ''} ${fin || c.status === 'da-doi-soat' ? 'disabled' : ''}><span class="cbx">${c.items[k] ? ic('check') : ''}</span><span>${t}<small style="display:block" class="muted">${k === 'meter' ? 'Chỉ số tháng 10: ' + (mr.en != null ? mr.en + ' kWh · ' + mr.wn + ' m³' : 'chưa ghi') : ds}</small></span></label>`).join('')}
          <div class="grid g2" style="gap:12px;margin-top:10px"><div class="field"><label for="qtp-dmg">Bồi thường tài sản (đ)</label><input id="qtp-dmg" type="number" min="0" step="10000" class="input" value="${c.damage || 0}" ${fin || c.status === 'da-doi-soat' ? 'disabled' : ''}></div><div class="field"><label for="qtp-note">Ghi chú tài sản</label><input id="qtp-note" class="input" value="${esc((c.notes || {}).assets || '')}" placeholder="Ví dụ: Đầy đủ, không hư hỏng" ${fin ? 'disabled' : ''}></div></div>
          <div style="margin-top:14px">${settleBox(live, c.status)}</div>
          <div class="row" style="justify-content:flex-end;gap:10px;margin-top:14px;flex-wrap:wrap">
            ${c.status === 'cho-kiem-tra' ? `<button class="btn btn-red" id="qtp-check">${ic('clipboard-check')}Hoàn tất kiểm tra phòng</button>` : ''}
            ${c.status === 'da-kiem-tra' ? `<button class="btn btn-red" id="qtp-settle">${ic('coins')}Xác nhận đối soát</button>` : ''}
            ${c.status === 'da-doi-soat' ? `<button class="btn btn-red" id="qtp-done">${ic('circle-check')}Hoàn tất trả phòng</button>` : ''}</div></div>`;
      }
      return V4.adminShell({ active: 'ql-cu-tru', search: 'Tìm kiếm sinh viên, phòng, yêu cầu...' }, `${App.crumb([['Cư trú', 'ql-cu-tru'], 'Yêu cầu trả phòng'])}<h1 class="v4-title">Yêu cầu trả phòng &amp; đối soát ${V4.demo}</h1>
        <div class="grid resp-1" style="grid-template-columns:420px 1fr;gap:14px;align-items:start"><div class="card pad" style="padding:10px">${list.map((x) => `<button class="xd-item ${x.id === st.sel ? 'on' : ''}" data-c="${x.id}"><span class="row" style="justify-content:space-between"><b>${x.id}</b>${dotBadge(COST, x.status)}</span><span class="row" style="justify-content:space-between"><b style="font-weight:600">${esc(V4.sname(x.student))}</b><small class="muted">${V4.dmy(x.date)}</small></span><small class="muted">${x.room} · ${esc(x.reason)}</small>${ic('chevron-right')}</button>`).join('') || '<p class="muted" style="padding:20px;text-align:center">Không có yêu cầu.</p>'}</div>${panel}</div>`);
    },
    mount: (root) => {
      const st = App.st.qtp;
      root.querySelectorAll('[data-c]').forEach((b) => b.onclick = () => { st.sel = b.dataset.c; App.refresh(); });
      const c = (K.db.checkouts || []).find((x) => x.id === st.sel); if (!c) return;
      const keep = () => { const d = root.querySelector('#qtp-dmg'); if (d && !d.disabled) c.damage = Math.max(0, +d.value || 0); const n = root.querySelector('#qtp-note'); if (n && !n.disabled) { c.notes = c.notes || {}; c.notes.assets = n.value; } };
      root.querySelectorAll('[data-it]').forEach((x) => x.onchange = () => { keep(); c.items[x.dataset.it] = x.checked; K.save(); App.refresh(); });
      const ck = root.querySelector('#qtp-check'); if (ck) ck.onclick = () => { keep(); if (!c.items.assets || !c.items.keys || !c.items.meter) return App.toast('Hoàn tất kiểm tra tài sản, chìa khóa và chỉ số điện nước trước', 'err'); c.items.manager = true; c.status = 'da-kiem-tra'; V4.notify(c.student, 'Đã kiểm tra phòng ' + c.room, 'Ban quản lý đã kiểm tra phòng. ' + (c.damage ? 'Bồi thường tài sản: ' + money(c.damage) + '. ' : 'Tài sản đầy đủ. ') + 'Bước tiếp theo: đối soát chi phí.'); K.save(); App.toast('Đã hoàn tất kiểm tra phòng'); App.refresh(); };
      const se = root.querySelector('#qtp-settle'); if (se) se.onclick = () => { keep(); const s = settle(c.student, c); App.confirm('Xác nhận đối soát', `Tiền cọc ${money(s.deposit)}, khấu trừ ${money(s.deposit - s.refund)}. ${s.refund >= 0 ? 'Hoàn cho sinh viên <b>' + money(s.refund) + '</b>' : 'Sinh viên cần nộp thêm <b>' + money(-s.refund) + '</b>'}.`, 'Xác nhận', () => { c.settle = s; c.status = 'da-doi-soat'; V4.notify(c.student, 'Kết quả đối soát trả phòng ' + c.id, (s.refund >= 0 ? 'Số tiền hoàn: ' + money(s.refund) : 'Số tiền cần nộp thêm: ' + money(-s.refund)) + '. Phương thức nhận hoàn: ' + c.method + '.'); K.save(); App.toast('Đã xác nhận đối soát'); App.refresh(); }); };
      const dn = root.querySelector('#qtp-done'); if (dn) dn.onclick = () => App.confirm('Hoàn tất trả phòng', 'Giải phóng giường ' + b2(c.bed) + ' phòng ' + c.room + ' và kết thúc hợp đồng của ' + esc(V4.sname(c.student)) + '?', 'Hoàn tất', () => { const s = K.student(c.student); if (s && s.room) App.checkoutStudent(s); c.status = 'hoan-tat'; c.doneAt = K.now(); V4.notify(c.student, 'Hoàn tất trả phòng', 'Thủ tục trả phòng đã hoàn tất. Cảm ơn bạn đã đồng hành cùng ký túc xá.'); K.save(); App.refresh(); });
    },
  };

  // ============ Sinh viên: Gia hạn lưu trú (ảnh 11) ============
  P['sv-gia-han'] = {
    role: 'student', title: 'Gia hạn lưu trú',
    render: () => {
      const u = K.me(); const st = App.state('gh4', () => Object.assign({ tab: 'req', year: '2027 – 2028', from: '2027-09-01', to: '2028-08-31', keep: true, room: '', note: '', files: [], agree: true }, K.db.drafts.gh4 || {}));
      const c = K.db.contracts.find((x) => x.student === u.id && x.status !== 'ket-thuc');
      const r = u.room && K.room(u.room);
      const reqs = K.db.applications.filter((a) => a.student === u.id && a.kind === 'extend');
      const pending = reqs.find((a) => a.status === 'cho-duyet');
      const head = `<div class="phead v4h"><img class="art" src="${K.A('bn_giahan')}" alt=""><h1>Gia hạn lưu trú ${V4.demo}</h1><p class="desc">Đăng ký gia hạn thời gian lưu trú tại ký túc xá.</p>${V4.stayNav('sv-gia-han')}</div>
        <div class="utabs boxed gh-tabs">${[['cur', 'Hợp đồng hiện tại', 'file-text'], ['req', 'Yêu cầu gia hạn', 'square-pen'], ['hist', 'Lịch sử', 'clock']].map(([k, t, i]) => `<button class="utab ${st.tab === k ? 'on' : ''}" data-tab="${k}">${ic(i)}${t}</button>`).join('')}</div>`;
      const shell = (b) => V4.svShell({ active: 'sv-ho-so', search: 'Tìm kiếm thông báo, dịch vụ, hướng dẫn...' }, head + b);
      if (!r || !c) return shell(`<div class="card pad empty"><p>Bạn chưa có hợp đồng lưu trú đang hiệu lực.</p></div>`);
      const contractCard = `<div class="gh-contract"><img src="${K.A(r.code === 'A302' ? 'gh_room' : r.img)}" alt=""><div><small>Phòng · Tầng</small><b>${r.code} · Tầng ${r.khu}</b><small>Giường</small><b>Giường ${b2(u.bed)}</b></div><div><small>Mã hợp đồng</small><b>${c.id}</b><small>Thời hạn lưu trú</small><b>${c.from || '01/10/2026'} - ${c.to || '31/08/2027'}</b><span class="badge b-red b-sm">Hết hạn ${c.to || '31/08/2027'}</span></div></div>`;
      if (st.tab === 'cur') return shell(`<div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('file-text')}Thông tin hợp đồng hiện tại</h2>${contractCard}<dl class="kv" style="grid-template-columns:200px 1fr;margin-top:16px"><dt>Trạng thái</dt><dd>${App.statusBadge(c.status)}</dd><dt>Phí phòng</dt><dd>${money(c.fee)} / tháng</dd><dt>Năm học</dt><dd>${c.term}</dd><dt>Bàn giao</dt><dd>${c.handover && c.handover.done ? 'Đã bàn giao ' + c.handover.date : 'Chưa bàn giao'}</dd></dl><h3 style="font-size:17px;margin:16px 0 8px">Lịch sử hợp đồng</h3>${V4.vline(c.history.map((h) => ({ t: h.t, d: h.d, st: 'done' })))}<button class="btn btn-outline" data-go="sv-ho-so" style="margin-top:10px">${ic('file-text')}Xem thỏa thuận lưu trú</button></div>`);
      if (st.tab === 'hist') return shell(`<div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('clock')}Lịch sử yêu cầu gia hạn</h2>${reqs.length ? `<div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><thead><tr><th>Mã hồ sơ</th><th>Năm học</th><th>Thời gian</th><th>Ngày gửi</th><th>Trạng thái</th></tr></thead><tbody>${reqs.slice().reverse().map((a) => `<tr><td><b>${a.id}</b></td><td>${esc(a.term)}</td><td>${esc(a.period)}</td><td>${a.date}</td><td>${App.statusBadge(a.status)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted" style="padding:20px;text-align:center">Bạn chưa gửi yêu cầu gia hạn nào.</p>'}</div>`);
      const prof = !!(u.name && u.faculty && u.cls);
      const docs = st.files.length > 0 || !!pending;
      const debt = !overdue(u.id).length;
      const prep = [[prof, 'Thông tin cá nhân', 'Họ tên, mã sinh viên, lớp, khoa đã được cập nhật đầy đủ.', 'user-round', 'sv-tai-khoan'], [docs, 'Giấy tờ còn hiệu lực', 'Giấy xác nhận sinh viên còn hiệu lực trong năm học ' + st.year + '.', 'file-text'], [debt, 'Đối soát phí lưu trú', debt ? 'Không còn công nợ quá hạn. Đủ điều kiện đăng ký gia hạn theo quy định.' : 'Còn hóa đơn quá hạn, vui lòng thanh toán trước.', 'database', 'sv-hoa-don']];
      const roomsAlt = K.db.rooms.filter((x) => x.code !== u.room && !x.maint && freeBedsOf(x.code).length);
      return shell(`<div class="grid resp-1" style="grid-template-columns:1fr 0.7fr;gap:16px;align-items:start">
        <form class="card pad" id="gh-f" novalidate><h2 class="card-t" style="font-size:20px">${ic('file-text')}Thông tin hợp đồng hiện tại</h2>${contractCard}
          ${pending ? `<div class="warn-bar" style="margin-top:14px">${ic('clock')}<span><b>Yêu cầu ${pending.id} đang chờ xét duyệt</b><small>Gửi lúc ${pending.date}. Bạn sẽ nhận thông báo khi có kết quả.</small></span><button type="button" class="btn btn-sm btn-outline-red" id="gh-cancel">Hủy yêu cầu</button></div>` : ''}
          <h2 class="card-t" style="font-size:20px;margin-top:18px">${ic('calendar-days')}Thông tin đăng ký gia hạn</h2>
          <div class="field" style="margin-top:12px;max-width:340px"><label for="gh-year">Năm học đăng ký gia hạn <span class="req">*</span></label>${sel('gh-year', ['2027 – 2028', 'Học kỳ I · 2027 – 2028', 'Học kỳ II · 2026 – 2027'], st.year, '', pending ? 'disabled' : '')}</div>
          <div class="field" style="margin-top:12px"><label>Thời gian lưu trú đề nghị <span class="req">*</span></label><div class="gh-range"><span>Từ ngày</span><div class="iwrap">${ic('calendar-days')}<input id="gh-from" type="date" class="input" value="${st.from}" ${pending ? 'disabled' : ''}></div>${ic('arrow-right')}<span>Đến ngày</span><div class="iwrap">${ic('calendar-days')}<input id="gh-to" type="date" class="input" value="${st.to}" ${pending ? 'disabled' : ''}></div></div></div>
          <div class="field" style="margin-top:12px"><span class="lbl">Lựa chọn phòng <span class="req">*</span></span><div class="opt-cards two"><label class="opt"><input type="radio" name="gh-keep" value="1" ${st.keep ? 'checked' : ''} ${pending ? 'disabled' : ''}><span>${ic('bed-double')}<b>Giữ phòng hiện tại</b><small>${r.code} · Giường ${b2(u.bed)}</small></span></label><label class="opt"><input type="radio" name="gh-keep" value="0" ${!st.keep ? 'checked' : ''} ${pending ? 'disabled' : ''}><span>${ic('building-2')}<b>Đăng ký phòng khác</b><small>Chọn phòng khác (nếu có nhu cầu)</small></span></label></div>${!st.keep ? `<div style="margin-top:10px;max-width:340px">${sel('gh-room', [['', 'Chọn phòng còn chỗ'], ...roomsAlt.map((x) => [x.code, x.code + ' · Tầng ' + x.khu + ' · ' + x.beds + ' người · còn ' + freeBedsOf(x.code).length])], st.room, '', pending ? 'disabled' : '')}</div>` : ''}</div>
          <div class="field" style="margin-top:12px"><label for="gh-note">Ghi chú (nếu có)</label><div style="position:relative"><textarea id="gh-note" class="textarea" data-max="500" style="min-height:70px" placeholder="Nhập nội dung ghi chú, ví dụ: lý do gia hạn, thông tin bổ sung..." ${pending ? 'disabled' : ''}>${esc(st.note)}</textarea><span class="counter">0/500</span></div></div>
          <div class="field" style="margin-top:12px"><span class="lbl">Giấy tờ đính kèm <span class="req">*</span></span><div class="gh-files">${st.files.map((f, i) => `<div class="gh-file"><span class="pdf">${/pdf$/i.test(f.name) ? 'PDF' : 'IMG'}</span><span><b>${esc(f.name)}</b><small>${f.size}</small></span><span style="color:var(--green)">${ic('circle-check')}</span>${pending ? '' : `<button type="button" class="xbtn" data-fdel="${i}">${ic('x')}</button>`}</div>`).join('') || '<span class="muted small">Chưa có tệp. Tải lên giấy xác nhận sinh viên năm học mới.</span>'}<label class="btn btn-soft" style="position:relative;${pending ? 'pointer-events:none;opacity:.5' : ''}">${ic('upload')}Tải lên ${st.files.length ? 'khác' : 'tệp'}<input type="file" id="gh-file" accept=".pdf,.jpg,.jpeg,.png" multiple style="position:absolute;inset:0;opacity:0;cursor:pointer"></label></div><small class="muted">Chấp nhận file PDF, JPG, PNG (tối đa 5MB)</small></div>
          <label class="check" style="margin-top:14px;font-size:14px"><input type="checkbox" id="gh-agree" ${st.agree ? 'checked' : ''} ${pending ? 'disabled' : ''}>Tôi cam kết các thông tin trên là đúng và đề nghị gia hạn lưu trú từ ${V4.dmy(st.from)} đến ${V4.dmy(st.to)}.</label></form>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('clipboard-list')}Chuẩn bị trước khi gửi</h2><p class="muted small" style="margin:4px 0 12px">Vui lòng kiểm tra các mục dưới đây để hồ sơ được xét duyệt nhanh chóng.</p>
            ${prep.map(([ok, t, d, i, go]) => `<div class="prep ${ok ? 'ok' : 'no'}" ${!ok && go ? `data-go="${go}" style="cursor:pointer"` : ''}>${ic(i, 'ic-lg')}<span><b>${t}</b><small>${d}</small></span><span class="prep-st">${ic(ok ? 'circle-check' : 'circle-alert')}${ok ? 'Đã hoàn tất' : 'Chưa hoàn tất'}</span></div>`).join('')}
            <div class="note-y">${ic('info')}<span>Mức phí theo thông báo áp dụng cho năm học ${st.year.replace(/^.*· /, '')}. Thông tin chi tiết được cập nhật trong thông báo của Nhà trường.</span></div></div>
          <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('clock')}Quy trình xử lý yêu cầu</h2>${V4.steps([['Tạo yêu cầu', 'Sau khi gửi yêu cầu, hệ thống ghi nhận thông tin đăng ký của bạn.'], ['Gửi xét duyệt', 'Ban quản lý ký túc xá xem xét thông tin và hồ sơ đính kèm.'], ['Nhận kết quả', 'Kết quả được thông báo qua hệ thống. Bạn có thể theo dõi tại mục Lịch sử.']], pending ? 2 : 1, 'gh-steps')}
            <div class="grid" style="grid-template-columns:1fr 1.5fr;gap:12px;margin-top:16px"><button class="btn btn-outline btn-lg" id="gh-draft" ${pending ? 'disabled' : ''}>${ic('save')}Lưu nháp</button><button class="btn btn-red btn-lg" id="gh-send" ${pending ? 'disabled' : ''}>${ic('send')}Gửi yêu cầu gia hạn</button></div></div></div></div>`);
    },
    mount: (root) => {
      const st = App.st.gh4; const u = K.me(); if (!st) return;
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      const g = (id) => root.querySelector(id);
      const keep = () => { if (!g('#gh-year')) return; st.year = g('#gh-year').value; st.from = g('#gh-from').value; st.to = g('#gh-to').value; st.note = g('#gh-note').value; st.agree = g('#gh-agree').checked; st.keep = g('[name=gh-keep]:checked').value === '1'; if (g('#gh-room')) st.room = g('#gh-room').value; };
      root.querySelectorAll('[name=gh-keep]').forEach((r) => r.onchange = () => { keep(); App.refresh(); });
      const yr = g('#gh-year'); if (yr) yr.onchange = () => { keep(); const y = st.year; if (/^Học kỳ I · 2027/.test(y)) { st.from = '2027-09-01'; st.to = '2028-01-31'; } else if (/^Học kỳ II/.test(y)) { st.from = '2027-02-01'; st.to = '2027-07-31'; } else { st.from = '2027-09-01'; st.to = '2028-08-31'; } App.refresh(); };
      const fi = g('#gh-file'); if (fi) fi.onchange = () => { keep(); [...fi.files].forEach((f) => { if (f.size > 5 * 1024 * 1024) App.toast(f.name + ' vượt quá 5MB', 'err'); else st.files.push({ name: f.name, size: V4.fileSize(f.size) }); }); App.refresh(); };
      root.querySelectorAll('[data-fdel]').forEach((b) => b.onclick = () => { keep(); st.files.splice(+b.dataset.fdel, 1); App.refresh(); });
      const dr = g('#gh-draft'); if (dr && !dr.disabled) dr.onclick = () => { keep(); K.db.drafts.gh4 = Object.assign({}, st, { tab: 'req' }); K.save(); App.toast('Đã lưu nháp yêu cầu gia hạn'); };
      const cc = g('#gh-cancel'); if (cc) cc.onclick = () => { const a = K.db.applications.find((x) => x.student === u.id && x.kind === 'extend' && x.status === 'cho-duyet'); App.confirm('Hủy yêu cầu gia hạn', 'Hủy yêu cầu ' + a.id + '?', 'Hủy yêu cầu', () => { K.db.applications = K.db.applications.filter((x) => x !== a); if (K.db.requests.extend && K.db.requests.extend.student === u.id) K.db.requests.extend = null; K.save(); App.refresh(); }, true); };
      const sd = g('#gh-send'); if (sd && !sd.disabled) sd.onclick = () => {
        keep();
        if (!st.from || !st.to || st.to <= st.from) return App.toast('Thời gian lưu trú đề nghị chưa hợp lệ', 'err');
        if (!st.keep && !st.room) return App.toast('Chọn phòng muốn đăng ký', 'err');
        if (!st.files.length) return App.toast('Tải lên ít nhất một giấy tờ (giấy xác nhận sinh viên)', 'err');
        if (!st.agree) return App.toast('Vui lòng tích cam kết thông tin', 'err');
        if (overdue(u.id).length) return App.toast('Bạn còn hóa đơn quá hạn, vui lòng thanh toán trước khi gia hạn', 'err');
        const id = 'HS2026-' + String(40 + K.db.applications.length).padStart(4, '0');
        K.db.applications.push({ id, student: u.id, type: 'Gia hạn lưu trú năm học ' + st.year.replace(/^.*· /, ''), room: st.keep ? u.room : st.room, bed: st.keep ? u.bed : (freeBedsOf(st.room)[0] || 1), term: st.year, period: V4.dmy(st.from) + ' – ' + V4.dmy(st.to), date: K.now(), status: 'cho-duyet', kind: 'extend', extend: { keep: st.keep, note: st.note }, docs: st.files.map((f) => ({ name: f.name, ok: true })), history: [{ t: 'Sinh viên nộp hồ sơ', d: K.now(), s: 'Yêu cầu gia hạn được gửi lên hệ thống.' }, { t: 'Chờ xét duyệt', d: K.now(), s: 'Hồ sơ đang chờ cán bộ quản lý xem xét.' }] });
        K.db.requests.extend = { student: u.id, term: st.year, note: st.note, date: K.now(), status: 'cho-duyet' };
        delete K.db.drafts.gh4; K.save(); App.toast('Đã gửi yêu cầu gia hạn ' + id + '. Theo dõi kết quả tại tab Lịch sử.'); App.refresh();
      };
    },
  };

  // ---------- hồ sơ lưu trú: thêm thanh điều hướng Lưu trú ----------
  const hs = P['sv-ho-so']; const hsRender = hs.render;
  hs.render = (p) => hsRender(p).replace(/(<div class="card" style="padding:12px 30px 14px;margin-top:-6px">)/, V4.stayNav('sv-ho-so') + '$1');

  // ---------- tổng quan Ban quản lý: việc cần xử lý mới ----------
  const dash = P['ql-tong-quan']; const dashRender = dash.render;
  dash.render = (p) => {
    const html = dashRender(p);
    const items = [['ql-vi-pham', 'file-warning', K.db.violations.filter((v) => ['cho-xac-minh', 'da-giai-trinh'].includes(v.status) || (v.review && !v.review.answer)).length, 'vi phạm'], ['ql-chuyen-phong', 'arrow-left-right', K.db.transfers.filter((t) => ['cho-duyet', 'cho-ban-giao'].includes(t.status)).length, 'chuyển phòng'], ['ql-cu-tru', 'calendar-check', K.db.absences.filter((a) => a.status === 'cho-xac-nhan' || (a.status === 'dang-vang' && a.returnReport)).length, 'tạm vắng'], ['ql-tra-phong', 'luggage', (K.db.checkouts || []).filter((c) => ['cho-kiem-tra', 'da-kiem-tra', 'da-doi-soat'].includes(c.status)).length, 'trả phòng']].filter((x) => x[2]);
    return items.length ? html.replace('<h2 style="font-size:24px">Việc cần xử lý</h2>', `<h2 style="font-size:24px">Việc cần xử lý</h2><span class="dash-chips">${items.map(([g, i, n, t]) => `<a href="#" class="badge b-red" data-go="${g}">${ic(i)}${n} ${t}</a>`).join('')}</span>`) : html;
  };

  // ---------- tìm kiếm nhanh ----------
  const search = App.search;
  App.search = (q) => {
    const out = search(q); const role = K.db.session && K.db.session.role; const has = (s) => String(s).toLowerCase().includes(q);
    const pages = role === 'admin' ? [['Theo dõi nội quy & vi phạm', 'ql-vi-pham', 'file-warning'], ['Lập biên bản ghi nhận', 'ql-bien-ban', 'file-pen-line'], ['Ghi chỉ số điện nước', 'ql-dien-nuoc', 'zap'], ['Phân bổ phí điện nước', 'ql-phan-bo', 'calculator'], ['Xét duyệt chuyển phòng', 'ql-chuyen-phong', 'arrow-left-right'], ['Theo dõi tạm vắng', 'ql-cu-tru', 'calendar-check'], ['Yêu cầu trả phòng', 'ql-tra-phong', 'luggage']]
      : [['Điện nước phòng của tôi', 'sv-dien-nuoc', 'zap'], ['Giải trình của tôi', 'sv-giai-trinh', 'file-text'], ['Đăng ký chuyển phòng', 'sv-chuyen-phong', 'arrow-left-right'], ['Trả phòng & đối soát', 'sv-tra-phong', 'luggage'], ['Gia hạn lưu trú', 'sv-gia-han', 'calendar-plus'], ['Đăng ký tạm vắng', 'sv-tam-vang', 'plane-takeoff'], ['Nội quy & phản hồi', 'sv-noi-quy', 'message-square-text']];
    pages.forEach(([t, g, i]) => { if (has(t)) out.unshift({ icon: i, t, s: 'Trang', go: g }); });
    if (role === 'admin') { K.db.violations.forEach((v) => { if (has(v.id)) out.push({ icon: 'file-warning', t: v.id + ' · ' + V4.sname(v.student), s: 'Vi phạm', go: 'ql-vi-pham' }); }); K.db.transfers.forEach((t) => { if (has(t.id)) out.push({ icon: 'arrow-left-right', t: t.id + ' · ' + V4.sname(t.student), s: 'Chuyển phòng', go: 'ql-chuyen-phong' }); }); K.db.absences.forEach((a) => { if (has(a.id)) out.push({ icon: 'calendar-check', t: a.id + ' · ' + V4.sname(a.student), s: 'Tạm vắng', go: 'ql-cu-tru' }); }); }
    return out;
  };

  // ---------- danh sách màn hình: thêm nhóm bổ sung ----------
  const EXTRA = [[36, 'Theo dõi nội quy & vi phạm', 'ql-vi-pham', 'admin'], [37, 'Lập biên bản ghi nhận', 'ql-bien-ban', 'admin'], [38, 'Ghi chỉ số điện nước', 'ql-dien-nuoc', 'admin'], [39, 'Phân bổ phí điện nước', 'ql-phan-bo', 'admin'], [40, 'Xét duyệt chuyển phòng', 'ql-chuyen-phong', 'admin'], [41, 'Bàn giao chuyển phòng', 'ql-ban-giao-CP-1026-014', 'admin'], [42, 'Theo dõi tạm vắng', 'ql-cu-tru', 'admin'], [43, 'Điện nước phòng của tôi', 'sv-dien-nuoc', 'student'], [44, 'Giải trình của tôi', 'sv-giai-trinh-VP-001', 'student'], [45, 'Đăng ký chuyển phòng', 'sv-chuyen-phong', 'student'], [46, 'Trả phòng & đối soát', 'sv-tra-phong', 'student'], [47, 'Gia hạn lưu trú', 'sv-gia-han', 'student']];
  const sd = P['so-do']; const sdRender = sd.render, sdMount = sd.mount;
  sd.render = () => sdRender().replace('</div>' + App.pubFooter(), `<h2 style="font-size:24px;margin:26px 0 14px">Chức năng bổ sung (17 ảnh)</h2><div class="grid g3">${EXTRA.map((s) => `<button class="card" data-scr2="${s[0]}" style="text-align:left;padding:16px 18px;display:flex;gap:14px;align-items:center;cursor:pointer;border:1px solid #e6eef8"><span class="stepnum ${s[3] === 'admin' ? 'done' : 'on'}">${s[0]}</span><span style="min-width:0"><b style="color:var(--navy);display:block">${s[1]}</b><small class="muted">#${s[2]}</small></span>${ic('arrow-right')}</button>`).join('')}</div></div>${App.pubFooter()}`);
  sd.mount = (root) => { sdMount(root); root.querySelectorAll('[data-scr2]').forEach((b) => b.onclick = () => { const s = EXTRA.find((x) => x[0] === +b.dataset.scr2); K.db.session = s[3] === 'admin' ? { role: 'admin' } : { role: 'student', id: 'SV260001' }; K.save(); App.go(s[2]); }); };

  V4.ensure();
})();
