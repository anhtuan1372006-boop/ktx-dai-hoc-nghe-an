/* v4 – Lõi: dữ liệu bổ sung, menu mới, tiện ích chung, nội quy – vi phạm – giải trình (ảnh bổ sung 1, 4, 6, 14) */
(function () {
  const K = window.KTX, { esc, ic, im, av, badge, sel } = App;
  const P = App.pages;
  const b2 = K.pad2, money = K.money;
  const V4 = (App.v4 = {});

  // ---------- tiện ích ----------
  const pad = (n) => String(n).padStart(2, '0');
  const dmy = (iso) => (iso ? iso.split('-').reverse().join('/') : '');
  const iso = (d) => (d ? d.slice(0, 10).split('/').reverse().join('-') : '');
  const todayIso = () => { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const demo = `<span class="badge b-blue demo-tag">${ic('info')}Dữ liệu minh họa</span>`;
  const sname = (sid) => (K.student(sid) || { name: sid }).name;
  const notify = (sid, title, body) => K.db.notifications.unshift({ id: 'N' + Date.now() + Math.random().toString(36).slice(2, 5), to: sid, title, summary: body.slice(0, 90), cat: 'Lưu trú', icon: 'ni_doc', time: 'Vừa xong', author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', read: false, body: body.split('\n') });
  const log = (act, text, icon) => { K.db.activity.unshift({ at: K.now(), by: 'Quản trị viên', av: 'av_admin', act, icon: icon || 'doc', text }); K.db.sysLog.unshift({ at: K.now(), by: 'Quản trị viên', t: text }); };
  const nextId = (arr, pre, w) => pre + String(Math.max(0, ...arr.map((x) => +String(x.id).replace(/\D/g, '').slice(-(w || 3)) || 0)) + 1).padStart(w || 3, '0');
  const mask = (p) => '*** *** **' + String(p || '').replace(/\D/g, '').slice(-2);
  const readImage = (file, max) => new Promise((res, rej) => {
    if (!file || !/^image\//.test(file.type)) return rej(new Error('Tệp không phải ảnh'));
    if (file.size > 5 * 1024 * 1024) return rej(new Error('Ảnh cần nhỏ hơn 5MB'));
    const rd = new FileReader();
    rd.onload = () => { const img = new Image(); img.onload = () => { const s = Math.min(1, (max || 900) / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.8)); }; img.onerror = () => rej(new Error('Không đọc được ảnh')); img.src = rd.result; };
    rd.readAsDataURL(file);
  });
  const fileSize = (n) => (n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');
  // thanh bước ngang: steps [[tiêu đề, phụ đề]], cur (1-based), done < cur
  const steps = (list, cur, cls) => `<div class="wz ${cls || ''}">${list.map(([t, s], i) => { const n = i + 1; const stt = n < cur ? 'done' : n === cur ? 'cur' : ''; return `<div class="wz-i ${stt}"><span class="wz-n">${n < cur ? ic('check') : n}</span><span class="wz-t"><b>${t}</b>${s ? `<small>${s}</small>` : ''}</span></div>${i < list.length - 1 ? '<i class="wz-ln"></i>' : ''}`; }).join('')}</div>`;
  // dòng thời gian dọc: [{t, d, s, st:'done'|'cur'|'todo'}]
  const vline = (items, wide) => `<div class="vt ${wide ? 'wide' : ''}">${items.map((x) => `<div class="vt-i ${x.st}"><span class="vt-dot">${x.st === 'done' ? ic('check') : ''}</span><div class="vt-b"><div class="vt-h"><b>${x.t}</b>${x.d ? `<small>${x.d}</small>` : ''}</div>${x.s ? `<p>${x.s}</p>` : ''}</div></div>`).join('')}</div>`;
  const stayNav = (active) => `<div class="seg stay-nav">${[['sv-ho-so', 'Hồ sơ', 'file-text'], ['sv-gia-han', 'Gia hạn', 'calendar-plus'], ['sv-tra-phong', 'Trả phòng', 'luggage'], ['sv-tam-vang', 'Tạm vắng', 'plane-takeoff']].map(([g, t, i]) => `<button class="pill ${g === active ? 'on' : ''}" ${g === active ? '' : `data-go="${g}"`}>${ic(i)}${t}</button>`).join('')}</div>`;
  Object.assign(V4, { pad, dmy, iso, todayIso, demo, sname, notify, log, nextId, mask, readImage, fileSize, steps, vline, stayNav });

  // ---------- menu mới ----------
  App.SV_NAV = [['sv-tong-quan', 'Tổng quan', 'house'], ['sv-phong', 'Phòng của tôi', 'bed-double'], ['sv-dien-nuoc', 'Điện nước', 'zap'], ['sv-hoa-don', 'Hóa đơn', 'receipt-text'], ['sv-chuyen-phong', 'Chuyển phòng', 'arrow-left-right'], ['sv-ho-so', 'Lưu trú', 'calendar-days'], ['sv-noi-quy', 'Nội quy & phản hồi', 'message-square-text'], ['sv-ho-tro', 'Hỗ trợ', 'headphones'], ['sv-thong-bao', 'Thông báo', 'bell'], ['sv-tai-khoan', 'Tài khoản', 'user-round']];
  App.QL_NAV = [['ql-tong-quan', 'Tổng quan', 'house'], ['ql-khu-nha', 'Tầng & phòng', 'building-2'], ['ql-sinh-vien', 'Sinh viên', 'users'], ['ql-ho-so', 'Hồ sơ lưu trú', 'file-text'], ['ql-hop-dong', 'Hợp đồng', 'clipboard-list'], ['ql-dien-nuoc', 'Điện nước', 'zap'], ['ql-doi-soat', 'Tài chính', 'circle-dollar-sign'], ['ql-chuyen-phong', 'Chuyển phòng', 'arrow-left-right'], ['ql-cu-tru', 'Cư trú', 'calendar-check'], ['ql-vi-pham', 'Nội quy & vi phạm', 'file-warning'], ['ql-bao-tri', 'Bảo trì', 'wrench'], ['ql-thong-bao', 'Thông báo', 'bell'], ['ql-bao-cao', 'Báo cáo', 'chart-column'], ['ql-cai-dat', 'Cài đặt', 'settings']];
  App.prefixes.push(['sv-giai-trinh-', 'sv-giai-trinh'], ['ql-bien-ban-', 'ql-bien-ban'], ['ql-ban-giao-', 'ql-ban-giao']);
  V4.adminShell = (o, body) => App.shell(Object.assign({ role: 'admin', logo: 'stack', foot: 'art', sbw: 236 }, o), body);
  V4.svShell = (o, body) => App.shell(Object.assign({ role: 'student', logo: 'stack', notif: 'dot', foot: 'card', sbw: 236 }, o), body);

  // ---------- nội quy ----------
  const LEVELS = { 'nhac-nho': ['Nhắc nhở', 'blue'], 'canh-cao': ['Cảnh cáo', 'orange'], 'nghiem-trong': ['Nghiêm trọng', 'red'] };
  const CATS = ['Giờ giấc', 'An toàn – PCCC', 'Trật tự', 'Khách thăm', 'Vệ sinh', 'Tài sản', 'Tệ nạn'];
  const seedRules = () => [
    { id: 'R01', cat: 'Giờ giấc', name: 'Về ký túc xá sau 23:00 không đăng ký', level: 'nhac-nho', points: 5, fine: 0 },
    { id: 'R02', cat: 'Giờ giấc', name: 'Vắng mặt qua đêm không đăng ký tạm vắng', level: 'canh-cao', points: 10, fine: 0 },
    { id: 'R03', cat: 'An toàn – PCCC', name: 'Sử dụng bếp điện, thiết bị công suất lớn trong phòng', level: 'canh-cao', points: 15, fine: 200000 },
    { id: 'R04', cat: 'An toàn – PCCC', name: 'Hút thuốc trong khu ký túc xá', level: 'nghiem-trong', points: 20, fine: 300000 },
    { id: 'R05', cat: 'Trật tự', name: 'Gây ồn ào, mất trật tự trong giờ nghỉ', level: 'nhac-nho', points: 5, fine: 0 },
    { id: 'R06', cat: 'Khách thăm', name: 'Đưa khách ở lại qua đêm khi chưa được phép', level: 'nghiem-trong', points: 20, fine: 0 },
    { id: 'R07', cat: 'Vệ sinh', name: 'Không thực hiện lịch trực vệ sinh phòng', level: 'nhac-nho', points: 3, fine: 0 },
    { id: 'R08', cat: 'Vệ sinh', name: 'Không giữ vệ sinh khu vực chung', level: 'nhac-nho', points: 3, fine: 0 },
    { id: 'R09', cat: 'Tài sản', name: 'Làm hư hỏng tài sản chung', level: 'canh-cao', points: 10, fine: 0, note: 'Bồi thường theo giá trị thực tế' },
    { id: 'R10', cat: 'Tệ nạn', name: 'Uống rượu bia, đánh bạc trong ký túc xá', level: 'nghiem-trong', points: 25, fine: 0 },
    { id: 'R11', cat: 'Trật tự', name: 'Để xe sai khu vực quy định', level: 'nhac-nho', points: 3, fine: 0 },
  ];
  const seedViolations = () => [
    { id: 'VP-001', student: 'SV260001', room: 'A302', rule: 'R11', title: 'Để xe sai khu vực', date: '20/10/2026', time: '21:15', place: 'Khu để xe tầng 1', desc: 'Ghi nhận xe được để ngoài khu vực quy định (lối thoát hiểm cạnh khu để xe). Nội dung đang chờ xác minh.', evidence: [{ name: 'anh_hien_trang.jpg', size: '1,2 MB', img: 'ev_bike' }], note: 'Đang đối chiếu thông tin phản ánh.', by: 'Cán bộ quản lý', dept: 'Bộ phận quản lý tầng 1', deadline: '25/10/2026', status: 'can-giai-trinh', created: '20/10/2026 21:15', verifiedAt: '21/10/2026 09:00',
      request: { text: 'Ban quản lý đã xem hình ảnh và đề nghị bạn cung cấp thêm thông tin về thời gian, địa điểm cụ thể và lý do để xe tại khu vực nêu trên.\nVui lòng gửi giải trình trong thời gian sớm nhất để hồ sơ được xem xét.', at: '21/10/2026 09:15', due: '27/10/2026' } },
    { id: 'VP-002', student: 'SV260010', room: 'B204', rule: 'R05', title: 'Gây ồn giờ nghỉ', date: '22/10/2026', time: '23:10', place: 'Hành lang tầng 2', desc: 'Các phòng lân cận phản ánh tiếng ồn lớn từ phòng B204 sau 23:00.', evidence: [{ name: 'phan_anh_tieng_on.pdf', size: '0,3 MB', doc: true }], note: 'Chờ đối chiếu camera hành lang.', by: 'Bảo vệ ca tối', dept: 'Bộ phận quản lý tầng 2', deadline: '26/10/2026', status: 'cho-xac-minh', created: '22/10/2026 23:20' },
    { id: 'VP-003', student: 'SV260018', room: 'C101', rule: 'R08', title: 'Vệ sinh khu vực chung', date: '15/10/2026', time: '08:30', place: 'Khu vực chung tầng 1', desc: 'Để rác sinh hoạt tại hành lang chung, không đúng nơi quy định.', evidence: [], note: '', by: 'Cán bộ quản lý', dept: 'Bộ phận quản lý tầng 1', deadline: '18/10/2026', status: 'da-xu-ly', created: '15/10/2026 08:40', verifiedAt: '15/10/2026 14:00',
      conclusion: { result: 'khac-phuc', text: 'Sinh viên đã dọn dẹp khu vực và cam kết không tái phạm.', points: 0, at: '16/10/2026 10:00' } },
  ];
  const rule = (id) => K.db.rules.find((r) => r.id === id) || { name: 'Nội quy khác', points: 0, level: 'nhac-nho', cat: 'Trật tự', fine: 0 };
  const vTitle = (v) => v.title || rule(v.rule).name;
  const counted = (v) => v.status === 'da-xu-ly' && v.conclusion && v.conclusion.result === 'vi-pham';
  const points = (sid) => Math.max(0, 100 - K.db.violations.filter((v) => v.student === sid && counted(v)).reduce((s, v) => s + (v.points || 0), 0));
  const tier = (p) => (p >= 90 ? ['Tốt', 'green', 'Không có vi phạm đáng kể.'] : p >= 80 ? ['Khá', 'blue', 'Có vi phạm nhẹ, cần lưu ý.'] : p >= 60 ? ['Cảnh cáo', 'orange', 'Cần ký cam kết, ưu tiên thấp khi xét gia hạn.'] : ['Xem xét chấm dứt', 'red', 'Hội đồng KTX xem xét chấm dứt lưu trú.']);
  const VST = { nhap: ['Bản nháp', 'gray', 'file-pen-line'], 'cho-xac-minh': ['Chờ xác minh', 'orange', 'clock'], 'can-giai-trinh': ['Cần giải trình', 'blue', 'file-text'], 'da-giai-trinh': ['Đã giải trình', 'blue', 'message-square-text'], 'da-xu-ly': ['Đã xử lý', 'green', 'circle-check'], 'da-huy': ['Không vi phạm', 'gray', 'circle-x'] };
  const vLabel = (v) => (v.status === 'da-xu-ly' && v.conclusion && v.conclusion.result === 'khac-phuc' ? ['Đã khắc phục', 'green', 'circle-check'] : v.status === 'da-xu-ly' && v.review && !v.review.answer ? ['Đề nghị xem lại', 'orange', 'rotate-ccw'] : VST[v.status]);
  const vBadge = (v, big) => { const l = vLabel(v); return `<span class="badge b-${l[1]} ${big ? 'pill-lg' : ''}">${ic(l[2])}${l[0]}</span>`; };
  const ensure = () => {
    if (K.db.v4 === 1) return;
    K.db.rules = K.db.rules || seedRules();
    seedRules().forEach((r) => { if (!K.db.rules.find((x) => x.id === r.id)) K.db.rules.push(r); });
    K.db.violations = seedViolations();
    delete K.db.passes;
    K.db.ruleAck = K.db.ruleAck || {};
    K.db.applications = K.db.applications.filter((a) => a.id !== 'HS2026-0029' && a.kind !== 'transfer' && a.kind !== 'checkout');
    K.db.requests.transfer = null; K.db.requests.checkout = null;
    const c1 = K.db.contracts.find((c) => c.id === 'HD1026-001'); if (c1) { c1.from = '01/10/2026'; c1.to = '31/08/2027'; }
    (V4.seeders || []).forEach((f) => f());
    K.db.v4 = 1; K.save();
  };
  V4.ensure = ensure;
  App.rulesApi = { points, tier, rule, CATS, LEVELS };
  Object.assign(V4, { rule, vTitle, points, tier, VST, vBadge, vLabel, LEVELS, CATS });
  const origReset = K.reset;
  K.reset = () => { origReset(); delete K.db.v4; ensure(); };

  const scoreRing = (p) => { const t = tier(p); const col = { green: '#1f9a4b', blue: '#1d5bd8', orange: '#df8600', red: '#dc1f2e' }[t[1]]; const c = 2 * Math.PI * 52; return `<div class="ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" stroke="${col}" stroke-dasharray="${(c * p / 100).toFixed(1)} ${c.toFixed(1)}" class="ring-fg"/></svg><div><b>${p}</b><small>/100 điểm</small></div></div>`; };
  V4.scoreRing = scoreRing;

  // tiến trình 4 bước của một hồ sơ vi phạm
  const vSteps = (v, forStudent) => {
    const st = v.status;
    const verified = !!v.verifiedAt, explained = !!(v.explanation && v.explanation.at), done = st === 'da-xu-ly' || st === 'da-huy';
    const items = [
      { t: forStudent ? 'Đã ghi nhận' : 'Ghi nhận', d: v.created, s: forStudent ? 'Phản ánh của bạn đã được tiếp nhận.' : 'Tiếp nhận thông tin phản ánh.', st: 'done' },
      { t: forStudent ? 'Đã xác minh ban đầu' : 'Xác minh', d: v.verifiedAt || '', s: forStudent ? 'Ban quản lý đã kiểm tra thông tin và hình ảnh.' : 'Xác minh thông tin, thu thập bằng chứng.', st: verified ? 'done' : st === 'cho-xac-minh' ? 'cur' : 'todo' },
      { t: forStudent ? (explained ? 'Đã gửi giải trình' : 'Chờ bạn giải trình') : 'Giải trình', d: explained ? v.explanation.at : (v.request ? v.request.at : ''), s: forStudent ? (explained ? 'Ban quản lý đã nhận giải trình của bạn.' : v.request ? 'Vui lòng gửi giải trình và minh chứng (nếu có).' : 'Không yêu cầu giải trình.') : (v.request ? (explained ? 'Sinh viên đã gửi giải trình.' : 'Làm việc với sinh viên để nghe giải trình.') : 'Làm việc với sinh viên để nghe giải trình.'), st: explained || (done && !v.request) ? 'done' : st === 'can-giai-trinh' ? 'cur' : 'todo' },
      { t: forStudent ? (done ? 'Đã có kết luận' : 'Chờ kết luận') : 'Kết luận', d: v.conclusion ? v.conclusion.at : '', s: done ? (v.conclusion ? v.conclusion.text : '') : forStudent ? 'Sau khi nhận giải trình, Ban quản lý sẽ xem xét và thông báo kết quả.' : 'Cập nhật kết luận sau khi xác minh.', st: done ? 'done' : st === 'da-giai-trinh' ? 'cur' : 'todo' },
    ];
    return items;
  };

  // ============ Ban quản lý: Theo dõi nội quy & vi phạm (ảnh 1) ============
  P['ql-vi-pham'] = {
    role: 'admin', title: 'Theo dõi nội quy & vi phạm',
    render: () => {
      const st = App.state('vp4', { khu: '', from: '', to: '', status: '', q: '', sel: null, grp: '' });
      const VS = K.db.violations;
      const grp = { xm: ['cho-xac-minh'], gt: ['can-giai-trinh', 'da-giai-trinh'], xl: ['da-xu-ly', 'da-huy'] };
      let list = VS.slice();
      if (st.grp) list = list.filter((v) => grp[st.grp].includes(v.status));
      if (st.status) list = list.filter((v) => v.status === st.status);
      if (st.khu) list = list.filter((v) => K.fl(v.room) === st.khu);
      if (st.from) list = list.filter((v) => iso(v.date) >= st.from);
      if (st.to) list = list.filter((v) => iso(v.date) <= st.to);
      if (st.q) { const q = st.q.toLowerCase(); list = list.filter((v) => (v.id + ' ' + sname(v.student) + ' ' + v.student + ' ' + vTitle(v) + ' ' + v.room).toLowerCase().includes(q)); }
      const cur = list.find((v) => v.id === st.sel) || list[0];
      if (cur) st.sel = cur.id;
      const n = (k) => VS.filter((v) => grp[k].includes(v.status)).length;
      let panel = `<div class="card pad empty"><span class="amen-ic blue">${ic('shield-check')}</span><p>Không có hồ sơ phù hợp bộ lọc.</p></div>`;
      if (cur) {
        const s = K.student(cur.student) || {};
        const ev = cur.evidence && cur.evidence[0];
        const act = cur.status === 'nhap' ? `<button class="btn btn-red" data-go="ql-bien-ban-${cur.id}">${ic('pencil')}Tiếp tục soạn</button>`
          : cur.status === 'cho-xac-minh' ? `<button class="btn btn-red" id="vp-verify">${ic('search')}Tiếp nhận xác minh</button>`
          : cur.status === 'can-giai-trinh' || cur.status === 'da-giai-trinh' ? `<button class="btn btn-red" id="vp-conclude">${ic('gavel')}Kết luận</button>`
          : cur.review && !cur.review.answer ? `<button class="btn btn-red" id="vp-review">${ic('rotate-ccw')}Xem xét lại</button>` : '';
        panel = `<div class="card pad vp-panel">
          <div class="row" style="justify-content:space-between;gap:8px"><h2 style="font-size:23px">Hồ sơ ${cur.id}</h2>${cur.status === 'cho-xac-minh' ? `<span class="badge b-orange pill-lg">${ic('clock')}Thông tin đang xác minh</span>` : vBadge(cur, true)}</div>
          <div class="row" style="margin:12px 0 6px">${av(s.avatar, 60)}<div><b style="color:var(--navy);font-size:18px;display:block">${esc(s.name || cur.student)}</b><small class="muted">${cur.student}</small></div></div>
          <div class="kv-ic">
            <div>${ic('calendar-days')}<span>Ngày ghi nhận</span><b>${cur.date} ${cur.time || ''}</b></div>
            <div>${ic('layers')}<span>Tầng</span><b>Tầng ${K.fl(cur.room)}</b></div>
            <div>${ic('door-closed')}<span>Phòng</span><b>${cur.room}</b></div>
            <div>${ic('map-pin')}<span>Địa điểm</span><b>${esc(cur.place || '—')}</b></div>
            <div>${ic('file-text')}<span>Nội dung vi phạm</span><b>${esc(vTitle(cur))}</b></div></div>
          <div class="kv-ic" style="border-top:1px solid var(--line-2);padding-top:10px;margin-top:8px">
            <div>${ic('paperclip')}<span>Bằng chứng đính kèm</span>${ev ? `<span class="ev-chip">${ev.img ? `<img src="${K.A(ev.img)}" alt="">` : `<span class="amen-ic red sm">${ic('file-text')}</span>`}<span><b>${esc(ev.name)}</b><small>${ev.size || ''}</small></span><button class="xbtn" id="vp-ev" aria-label="Xem bằng chứng">${ic('download')}</button></span>` : '<b class="muted" style="font-weight:400">Chưa có</b>'}</div>
            <div>${ic('notebook-pen')}<span>Ghi chú</span><span class="note-box">${esc(cur.note || 'Không có ghi chú.')}</span></div></div>
          ${cur.explanation ? `<div class="reply-box" style="background:var(--blue-50)"><b style="color:var(--blue-700)">${ic('message-square-text')}Giải trình của sinh viên · ${cur.explanation.at}</b><p style="white-space:pre-line">${esc(cur.explanation.text)}</p>${(cur.explanation.files || []).length ? `<p class="small muted">Đính kèm: ${cur.explanation.files.map((f) => esc(f.name)).join(', ')}</p>` : ''}</div>` : ''}
          ${cur.review ? `<div class="reply-box" style="background:var(--orange-50)"><b style="color:var(--orange)">${ic('rotate-ccw')}Đề nghị xem lại · ${cur.review.at}</b><p>${esc(cur.review.text)}</p>${cur.review.answer ? `<p class="small muted">Trả lời: ${esc(cur.review.answer)}</p>` : ''}</div>` : ''}
          <h3 style="font-size:17px;margin:14px 0 8px">Tiến trình xử lý</h3>${vline(vSteps(cur, false))}
          <div class="grid g2" style="gap:10px;margin-top:12px"><button class="btn btn-outline" id="vp-detail">${ic('file-text')}Xem chi tiết</button>${act || `<button class="btn btn-disabled" disabled>${ic('check')}Đã hoàn tất</button>`}</div>
          <div class="info-strip">${ic('info')}${cur.status === 'da-xu-ly' || cur.status === 'da-huy' ? 'Kết luận: ' + esc(cur.conclusion ? cur.conclusion.text : '') : 'Kết luận được cập nhật sau khi xác minh.'}</div></div>`;
      }
      const stat = (k, t, c, icon) => `<button class="vstat ${c} ${st.grp === k ? 'on' : ''}" data-grp="${k}"><span class="vstat-ic">${ic(icon)}</span><span><b>${t}</b><strong>${n(k)}</strong></span>${ic('chevron-right')}</button>`;
      return V4.adminShell({ active: 'ql-vi-pham', search: 'Tìm kiếm sinh viên, phòng, nội dung vi phạm...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('bn_vipham')}" alt=""><h1>Theo dõi nội quy &amp; vi phạm ${demo}</h1><p class="desc">Quản lý, theo dõi và xử lý các trường hợp vi phạm nội quy ký túc xá.</p></div>
        <div class="vstats">${stat('xm', 'Chờ xác minh', 'orange', 'clock')}${stat('gt', 'Cần giải trình', 'blue', 'file-text')}${stat('xl', 'Đã xử lý', 'green', 'circle-check')}
          <div class="vstat-act"><button class="btn btn-red btn-lg" data-go="ql-bien-ban">${ic('circle-plus')}Tạo biên bản</button><button class="btn btn-outline btn-sm" data-go="ql-noi-quy">${ic('book-open')}Danh mục nội quy &amp; điểm nề nếp</button></div></div>
        <div class="grid resp-1" style="grid-template-columns:1fr 420px;gap:14px;align-items:start">
          <div class="card pad" style="padding:14px;min-width:0">
            <div class="vfilter">
              <div class="iwrap">${ic('building')}${sel('vf-khu', [['', 'Tất cả tầng'], ...App.khuOpts()], st.khu)}</div>
              <div class="daterange">${ic('calendar-days')}<input type="date" id="vf-from" value="${st.from}" aria-label="Từ ngày">${ic('arrow-right')}<input type="date" id="vf-to" value="${st.to}" aria-label="Đến ngày"></div>
              ${sel('vf-st', [['', 'Tất cả trạng thái'], ...Object.entries(VST).map(([k, v]) => [k, v[0]])], st.status)}
              <div class="iwrap">${ic('search')}<input id="vf-q" class="input" placeholder="Tìm kiếm theo mã, sinh viên, nội dung..." value="${esc(st.q)}"></div></div>
            <div class="tbl-wrap" style="margin-top:14px;border:0"><table class="tbl hover vtbl"><thead><tr><th>Mã vụ việc</th><th>Sinh viên</th><th>Phòng</th><th>Nội dung vi phạm</th><th>Trạng thái</th><th class="c">Thao tác</th></tr></thead><tbody>
              ${list.map((v) => `<tr data-v="${v.id}" class="${v.id === st.sel ? 'sel' : ''}"><td><b style="color:var(--navy)">${v.id}</b></td><td><b style="color:var(--navy);font-weight:600;display:block">${esc(sname(v.student))}</b><small class="muted">${v.student}</small></td><td>${v.room}</td><td>${esc(vTitle(v))}</td><td>${vBadge(v)}</td><td class="c"><button class="btn btn-sm btn-outline" data-view="${v.id}">${ic('eye')}Xem</button></td></tr>`).join('') || '<tr><td colspan="6" class="muted" style="text-align:center;padding:28px">Không có hồ sơ vi phạm phù hợp.</td></tr>'}
            </tbody></table></div></div>
          ${panel}</div>`);
    },
    mount: (root) => {
      const st = App.st.vp4;
      root.querySelectorAll('[data-grp]').forEach((b) => b.onclick = () => { st.grp = st.grp === b.dataset.grp ? '' : b.dataset.grp; st.status = ''; st.sel = null; App.refresh(); });
      [['#vf-khu', 'khu'], ['#vf-from', 'from'], ['#vf-to', 'to'], ['#vf-st', 'status']].forEach(([id, k]) => root.querySelector(id).onchange = (e) => { st[k] = e.target.value; if (k === 'status') st.grp = ''; st.sel = null; App.refresh(); });
      const q = root.querySelector('#vf-q'); q.onchange = () => { st.q = q.value.trim(); App.refresh(); };
      root.querySelectorAll('[data-v]').forEach((tr) => tr.onclick = (e) => { st.sel = tr.dataset.v; App.refresh(); });
      const v = K.db.violations.find((x) => x.id === st.sel); if (!v) return;
      root.querySelectorAll('[data-view]').forEach((b) => b.onclick = (e) => { e.stopPropagation(); st.sel = b.dataset.view; const x = K.db.violations.find((y) => y.id === st.sel); if (x.status === 'nhap') App.go('ql-bien-ban-' + x.id); else App.refresh(); });
      const evb = root.querySelector('#vp-ev'); if (evb) evb.onclick = () => V4.showEvidence(v.evidence[0]);
      root.querySelector('#vp-detail').onclick = () => V4.showRecord(v);
      const vb = root.querySelector('#vp-verify'); if (vb) vb.onclick = () => V4.verifyModal(v);
      const cb = root.querySelector('#vp-conclude'); if (cb) cb.onclick = () => V4.concludeModal(v);
      const rb = root.querySelector('#vp-review'); if (rb) rb.onclick = () => V4.reviewModal(v);
    },
  };

  V4.showEvidence = (e) => { if (!e) return; App.modal({ title: e.name, wide: true, body: e.img ? `<img src="${K.A(e.img)}" style="width:100%;border-radius:12px" alt="">` : `<div class="empty"><span class="amen-ic red">${ic('file-text')}</span><p>${esc(e.name)} · ${e.size || ''}</p><p class="small">Tài liệu đính kèm của hồ sơ.</p></div>` }); };
  V4.showRecord = (v) => {
    const s = K.student(v.student) || {}; const r = rule(v.rule);
    App.modal({ title: 'Biên bản ghi nhận ' + v.id, wide: true, body: `<div class="print-area"><div style="text-align:center"><b style="color:var(--navy)">ĐẠI HỌC NGHỆ AN · BAN QUẢN LÝ KÝ TÚC XÁ</b><h3 style="font-size:22px;margin-top:8px">BIÊN BẢN GHI NHẬN</h3><p class="muted small">Số: ${v.id} · Lập ngày ${v.created.slice(0, 10)}</p></div>
      <dl class="kv" style="grid-template-columns:170px 1fr;margin-top:16px"><dt>Sinh viên</dt><dd>${esc(s.name || v.student)} (${v.student})</dd><dt>Phòng</dt><dd>${v.room} · Tầng ${K.fl(v.room)}</dd><dt>Thời điểm</dt><dd>${v.date} ${v.time || ''}</dd><dt>Địa điểm</dt><dd>${esc(v.place || '—')}</dd><dt>Hành vi (dự kiến)</dt><dd>${esc(vTitle(v))} <span class="muted small">(${r.id} · ${LEVELS[r.level][0]} · trừ ${r.points} điểm${r.fine ? ' · phạt ' + money(r.fine) : ''})</span></dd><dt>Mô tả</dt><dd style="font-weight:400">${esc(v.desc)}</dd><dt>Người lập</dt><dd>${esc(v.by)}</dd><dt>Bộ phận xử lý</dt><dd>${esc(v.dept || '—')}</dd><dt>Hạn xác minh</dt><dd>${v.deadline || '—'}</dd>
      ${v.request ? `<dt>Đề nghị giải trình</dt><dd style="font-weight:400;white-space:pre-line">${esc(v.request.text)} <span class="muted small">(${v.request.at})</span></dd>` : ''}${v.explanation ? `<dt>Giải trình</dt><dd style="font-weight:400;white-space:pre-line">${esc(v.explanation.text)}</dd>` : ''}${v.conclusion ? `<dt>Kết luận</dt><dd>${esc(v.conclusion.text)} ${v.conclusion.points ? `<span class="badge b-red b-sm">−${v.conclusion.points} điểm</span>` : ''}</dd>` : ''}</dl>
      ${(v.evidence || []).filter((e) => e.img).length ? `<div class="ev-grid">${v.evidence.filter((e) => e.img).map((e) => `<img src="${K.A(e.img)}" alt="">`).join('')}</div>` : ''}</div>`,
      foot: `<button class="btn btn-outline" data-print>${ic('printer')}In biên bản</button><button class="btn btn-red" data-x>Đóng</button>`, onMount: (el) => el.querySelector('[data-print]').onclick = () => V4.print(el) });
  };
  V4.print = (el) => { document.body.classList.add('printing'); el.classList.add('print-me'); try { window.print(); } catch (e) { /* bị chặn */ } setTimeout(() => { document.body.classList.remove('printing'); el.classList.remove('print-me'); }, 500); };

  const ruleOpts = () => K.db.rules.map((r) => [r.id, r.name + ' (−' + r.points + ' điểm)']);
  const conclusionForm = (v) => `<div class="field"><span class="lbl">Kết quả</span><div class="opt-cards">${[['vi-pham', 'Vi phạm', 'Trừ điểm nề nếp theo nội quy'], ['khac-phuc', 'Nhắc nhở – đã khắc phục', 'Không trừ điểm'], ['khong-vi-pham', 'Không vi phạm', 'Hủy hồ sơ']].map(([k, t, d], i) => `<label class="opt"><input type="radio" name="cl-res" value="${k}" ${i === 0 ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span></label>`).join('')}</div></div>
    <div class="grid g2" style="gap:12px;margin-top:12px"><div class="field"><label for="cl-rule">Nội quy áp dụng</label>${sel('cl-rule', ruleOpts(), v.rule)}</div><div class="field"><label for="cl-pts">Điểm trừ</label><input id="cl-pts" type="number" class="input" min="0" max="50" value="${rule(v.rule).points}"></div></div>
    <div class="field" style="margin-top:12px"><label for="cl-text">Nội dung kết luận <span class="req">*</span></label><textarea id="cl-text" class="textarea" placeholder="Căn cứ xác minh, hình thức xử lý..."></textarea></div>`;
  const applyConclusion = (v, el) => {
    const res = el.querySelector('[name=cl-res]:checked').value; const text = el.querySelector('#cl-text').value.trim(); const rid = el.querySelector('#cl-rule').value; const pts = +el.querySelector('#cl-pts').value;
    if (text.length < 10) { App.toast('Nội dung kết luận cần tối thiểu 10 ký tự', 'err'); return false; }
    const r = rule(rid); v.rule = rid;
    v.conclusion = { result: res, text, points: res === 'vi-pham' ? pts : 0, at: K.now() };
    v.points = v.conclusion.points; v.verifiedAt = v.verifiedAt || K.now();
    v.status = res === 'khong-vi-pham' ? 'da-huy' : 'da-xu-ly';
    if (res === 'vi-pham' && r.fine && !K.db.invoices.find((i) => i.id === 'PV' + v.id.slice(3))) { const s = K.student(v.student) || {}; const room = K.room(s.room) || {}; K.db.invoices.push({ id: 'PV' + v.id.slice(3), kind: 'fine', label: 'Tiền phạt vi phạm nội quy (' + v.id + ')', student: v.student, period: '10/2026', room: s.room || v.room, khu: room.khu || '', items: [{ name: 'Phạt vi phạm: ' + r.name, amount: r.fine }], total: r.fine, status: 'chua-tt', due: '10/11/2026' }); }
    notify(v.student, 'Kết luận hồ sơ ' + v.id + ': ' + (res === 'vi-pham' ? 'Vi phạm' : res === 'khac-phuc' ? 'Đã khắc phục' : 'Không vi phạm'), text + (res === 'vi-pham' ? '\nTrừ ' + pts + ' điểm nề nếp' + (r.fine ? ', phạt ' + money(r.fine) + ' (xem mục Hóa đơn).' : '.') + ' Nếu chưa đồng ý, bạn có thể gửi đề nghị xem lại.' : ''));
    log('Kết luận vi phạm', 'Kết luận hồ sơ ' + v.id + ' của ' + sname(v.student)); K.save(); return true;
  };
  V4.verifyModal = (v) => App.modal({ title: 'Tiếp nhận xác minh ' + v.id, wide: true, body: `<p class="muted" style="margin-bottom:12px">${esc(sname(v.student))} · ${v.room} · ${esc(vTitle(v))}</p>
      <div class="opt-cards two"><label class="opt"><input type="radio" name="vf-mode" value="req" checked><span><b>Yêu cầu sinh viên giải trình</b><small>Gửi đề nghị bổ sung thông tin, sinh viên trả lời trên cổng sinh viên.</small></span></label><label class="opt"><input type="radio" name="vf-mode" value="now"><span><b>Kết luận ngay</b><small>Đã đủ căn cứ, không cần giải trình.</small></span></label></div>
      <div id="vf-req" style="margin-top:14px"><div class="field"><label for="rq-text">Nội dung đề nghị <span class="req">*</span></label><textarea id="rq-text" class="textarea" style="min-height:100px">Ban quản lý đã xem hình ảnh và đề nghị bạn cung cấp thêm thông tin về thời gian, địa điểm cụ thể và lý do liên quan đến sự việc nêu trên.\nVui lòng gửi giải trình trong thời gian sớm nhất để hồ sơ được xem xét.</textarea></div><div class="field" style="margin-top:12px;max-width:260px"><label for="rq-due">Hạn gửi giải trình</label><input id="rq-due" type="date" class="input" value="2026-10-28"></div></div>
      <div id="vf-now" hidden style="margin-top:14px">${conclusionForm(v)}</div>`,
    foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Xác nhận</button>',
    onMount: (el, close) => {
      el.querySelectorAll('[name=vf-mode]').forEach((r) => r.onchange = () => { const now = el.querySelector('[name=vf-mode]:checked').value === 'now'; el.querySelector('#vf-req').hidden = now; el.querySelector('#vf-now').hidden = !now; });
      const ruleSel = el.querySelector('#cl-rule'); ruleSel.onchange = () => { el.querySelector('#cl-pts').value = rule(ruleSel.value).points; };
      el.querySelector('[data-ok]').onclick = () => {
        if (el.querySelector('[name=vf-mode]:checked').value === 'now') { if (applyConclusion(v, el)) { close(); App.toast('Đã kết luận hồ sơ ' + v.id); App.refresh(); } return; }
        const text = el.querySelector('#rq-text').value.trim(); if (text.length < 20) return App.toast('Nội dung đề nghị cần tối thiểu 20 ký tự', 'err');
        v.verifiedAt = K.now(); v.request = { text, at: K.now(), due: dmy(el.querySelector('#rq-due').value) }; v.status = 'can-giai-trinh';
        notify(v.student, 'Đề nghị giải trình hồ sơ ' + v.id, text + '\nHạn gửi giải trình: ' + v.request.due + '. Vào mục Nội quy & phản hồi để gửi giải trình.');
        log('Yêu cầu giải trình', 'Yêu cầu ' + sname(v.student) + ' giải trình hồ sơ ' + v.id); K.save(); close(); App.toast('Đã gửi đề nghị giải trình tới sinh viên'); App.refresh();
      };
    } });
  V4.concludeModal = (v) => App.modal({ title: 'Kết luận hồ sơ ' + v.id, wide: true, body: `${v.explanation ? `<div class="reply-box" style="background:var(--blue-50);margin:0 0 14px"><b style="color:var(--blue-700)">Giải trình của sinh viên</b><p style="white-space:pre-line">${esc(v.explanation.text)}</p></div>` : `<div class="reply-box" style="background:var(--orange-50);margin:0 0 14px"><b style="color:var(--orange)">${ic('clock')}Sinh viên chưa gửi giải trình</b><p>Hạn giải trình: ${v.request ? v.request.due : '—'}. Bạn vẫn có thể kết luận nếu đã đủ căn cứ.</p></div>`}${conclusionForm(v)}`,
    foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Lưu kết luận</button>',
    onMount: (el, close) => { const ruleSel = el.querySelector('#cl-rule'); ruleSel.onchange = () => { el.querySelector('#cl-pts').value = rule(ruleSel.value).points; }; el.querySelector('[data-ok]').onclick = () => { if (applyConclusion(v, el)) { close(); App.toast('Đã kết luận hồ sơ ' + v.id); App.refresh(); } }; } });
  V4.reviewModal = (v) => App.modal({ title: 'Xem xét lại hồ sơ ' + v.id, body: `<div class="reply-box" style="background:var(--orange-50);margin:0 0 14px"><b style="color:var(--orange)">Đề nghị của sinh viên</b><p>${esc(v.review.text)}</p></div><div class="field"><label for="rv-ans">Trả lời <span class="req">*</span></label><textarea id="rv-ans" class="textarea" placeholder="Kết quả xem xét lại..."></textarea></div>`,
    foot: '<button class="btn btn-outline" data-keep>Giữ nguyên kết luận</button><button class="btn btn-red" data-cancel>Hủy kết luận vi phạm</button>',
    onMount: (el, close) => {
      const go = (keep) => { const a = el.querySelector('#rv-ans').value.trim(); if (a.length < 10) return App.toast('Nội dung trả lời cần tối thiểu 10 ký tự', 'err'); v.review.answer = a; v.review.answerAt = K.now(); if (!keep) { v.conclusion = Object.assign({}, v.conclusion, { result: 'khong-vi-pham', points: 0, text: 'Sau xem xét lại: ' + a }); v.points = 0; v.status = 'da-huy'; } notify(v.student, 'Kết quả xem xét lại hồ sơ ' + v.id, a + (keep ? '\nKết luận được giữ nguyên.' : '\nKết luận vi phạm đã được hủy, điểm nề nếp được hoàn lại.')); K.save(); close(); App.toast('Đã trả lời đề nghị xem lại'); App.refresh(); };
      el.querySelector('[data-keep]').onclick = () => go(true); el.querySelector('[data-cancel]').onclick = () => go(false);
    } });

  // ============ Ban quản lý: Lập biên bản ghi nhận (ảnh 4) ============
  const PLACES = ['Khu để xe tầng 1', 'Phòng ở', 'Hành lang tầng 1', 'Hành lang tầng 2', 'Hành lang tầng 3', 'Hành lang tầng 4', 'Cầu thang thoát hiểm', 'Sân sinh hoạt chung', 'Khu giặt sấy', 'Khác'];
  const DEPTS = ['Bộ phận quản lý tầng 1', 'Bộ phận quản lý tầng 2', 'Bộ phận quản lý tầng 3', 'Bộ phận quản lý tầng 4', 'Tổ bảo vệ', 'Bộ phận kỹ thuật'];
  P['ql-bien-ban'] = {
    role: 'admin', title: 'Lập biên bản ghi nhận',
    render: (id) => {
      const living = K.db.students.filter((s) => s.room);
      const existing = id && K.db.violations.find((v) => v.id === id);
      const key = 'bb-' + (id || 'new');
      const st = App.state(key, () => existing ? JSON.parse(JSON.stringify(existing)) : { student: '', room: '', date: todayIso(), time: '21:15', place: '', rule: 'R11', desc: '', evidence: [], by: 'Cán bộ quản lý', dept: 'Bộ phận quản lý tầng 1', deadline: '', status: 'nhap' });
      if (existing && !st.date.includes('-')) { st.date = iso(st.date); st.deadline = iso(st.deadline); }
      const s = K.student(st.student);
      const chk = [st.student && st.room, st.date && st.time && st.place, st.evidence.length > 0];
      return V4.adminShell({ active: 'ql-vi-pham', search: 'Tìm kiếm sinh viên, phòng, hóa đơn, nội quy...' }, `
        <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:10px"><h1 class="v4-title">Lập biên bản ghi nhận <span class="badge b-gray pill-lg">${ic('clock')}${existing ? 'Bản nháp ' + existing.id : 'Bản nháp'}</span></h1>${demo}</div>
        <div class="grid resp-1" style="grid-template-columns:1fr 470px;gap:16px;align-items:start">
          <div class="card pad" style="padding:20px 22px">
            <h2 class="numh"><span>1</span>Thông tin liên quan</h2>
            <div class="grid g2" style="gap:14px 18px;margin-top:12px">
              <div class="field"><label for="bb-s">Sinh viên</label><div class="iwrap">${ic('user-round')}${sel('bb-s', [['', 'Chọn sinh viên'], ...living.map((x) => [x.id, x.name + ' · ' + x.id])], st.student)}</div></div>
              <div class="field"><label for="bb-room">Phòng</label><div class="iwrap">${ic('bed-double')}${sel('bb-room', [['', 'Chọn phòng'], ...K.db.rooms.map((r) => [r.code, r.code + ' · Tầng ' + r.khu])], st.room)}</div></div>
              <div class="field"><label>Thời điểm</label><div class="bb-when"><div class="iwrap">${ic('calendar-days')}<input id="bb-date" type="date" class="input" value="${st.date}"></div><div class="iwrap">${ic('clock')}<input id="bb-time" type="time" class="input" value="${st.time}"></div></div></div>
              <div class="field"><label for="bb-place">Địa điểm</label><div class="iwrap">${ic('map-pin')}${sel('bb-place', [['', 'Chọn địa điểm'], ...PLACES], st.place)}</div></div></div>
            <hr class="hr">
            <h2 class="numh"><span>2</span>Nội dung ghi nhận</h2>
            <div class="field" style="margin-top:12px"><label for="bb-rule">Hành vi vi phạm (dự kiến)</label><div class="iwrap">${ic('file-text')}${sel('bb-rule', ruleOpts(), st.rule)}</div></div>
            <div class="field" style="margin-top:12px"><label for="bb-desc">Mô tả chi tiết</label><div style="position:relative"><textarea id="bb-desc" class="textarea" data-max="500" style="min-height:110px" placeholder="Mô tả sự việc, người phát hiện, tình trạng cụ thể...">${esc(st.desc)}</textarea><span class="counter">0/500</span></div></div>
            <hr class="hr">
            <h2 class="numh"><span>3</span>Minh chứng</h2><p class="lbl" style="margin:10px 0 8px;font-weight:500">Hình ảnh, tài liệu liên quan</p>
            <div class="ev-tiles">${st.evidence.map((e, i) => `<div class="ev-tile has">${e.img ? `<img src="${K.A(e.img)}" alt="">` : `<span class="amen-ic red">${ic('file-text')}</span><small>${esc(e.name)}</small>`}<button class="ev-x" data-evdel="${i}" aria-label="Xóa">${ic('x')}</button></div>`).join('')}
              <label class="ev-tile">${ic('image')}<b>Ảnh hiện trạng</b><small>JPG, PNG (tối đa 5MB)</small><input type="file" accept="image/*" data-up="img"></label>
              <label class="ev-tile">${ic('file-text')}<b>Tài liệu liên quan</b><small>PDF, DOC, DOCX (tối đa 10MB)</small><input type="file" accept=".pdf,.doc,.docx" data-up="doc"></label>
              <label class="ev-tile add">${ic('circle-plus')}<b>Thêm tệp</b><small>Chọn hoặc kéo thả tệp</small><input type="file" multiple data-up="any"></label></div>
          </div>
          <div class="card pad" style="padding:20px 22px">
            <h2 class="card-t" style="font-size:21px">${ic('settings')}Thông tin xử lý</h2>
            <div class="field" style="margin-top:12px"><label for="bb-by">Người lập biên bản</label><div class="iwrap">${ic('user-round')}${sel('bb-by', ['Cán bộ quản lý', 'Phạm Văn Hùng', 'Lê Thị Thu', 'Bảo vệ ca tối', 'Bảo vệ ca ngày'], st.by)}</div></div>
            <div class="field" style="margin-top:12px"><span class="lbl">Trạng thái</span><div class="status-box"><i></i>${existing && existing.status !== 'nhap' ? VST[existing.status][0] : 'Chưa xác minh'}</div></div>
            <div class="field" style="margin-top:12px"><label for="bb-dept">Giao cho bộ phận</label><div class="iwrap">${ic('users')}${sel('bb-dept', DEPTS, st.dept)}</div></div>
            <div class="field" style="margin-top:12px"><label for="bb-dl">Hạn xử lý xác minh</label><div class="iwrap">${ic('calendar-days')}<input id="bb-dl" type="date" class="input" value="${st.deadline}"></div></div>
            <hr class="hr">
            <h3 class="card-t" style="font-size:18px">${ic('clipboard-check')}Danh sách kiểm tra thông tin</h3>
            <div class="chk-list">${[['Thông tin sinh viên', 'Đã có thông tin sinh viên và phòng ở'], ['Thời gian, địa điểm', 'Đã ghi nhận thời điểm và địa điểm xảy ra'], ['Minh chứng', 'Đã đính kèm hình ảnh, tài liệu liên quan']].map(([t, d], i) => `<div class="${chk[i] ? 'ok' : ''}"><span class="cbx">${chk[i] ? ic('check') : ''}</span><span><b>${t}</b><small>${d}</small></span></div>`).join('')}</div>
            <div class="note-card">${ic('info')}<span><b>Chưa có kết luận xử lý</b><small>Biên bản đang ở trạng thái bản nháp. Vui lòng chuyển xác minh để bộ phận liên quan xem xét và xử lý theo quy định.</small></span></div>
          </div></div>
        <div class="card actbar"><button class="btn btn-outline" data-go="ql-vi-pham">${ic('x')}Hủy</button><span style="flex:1"></span><button class="btn btn-outline" id="bb-draft">${ic('file-text')}Lưu nháp</button><button class="btn btn-red" id="bb-send">${ic('send')}Chuyển xác minh</button></div>`);
    },
    mount: (root, id) => {
      const st = App.st['bb-' + (id || 'new')];
      const keep = () => { ['s:student', 'room:room', 'date:date', 'time:time', 'place:place', 'rule:rule', 'desc:desc', 'by:by', 'dept:dept', 'dl:deadline'].forEach((p) => { const [a, b] = p.split(':'); const e = root.querySelector('#bb-' + a); if (e) st[b] = e.value; }); };
      root.querySelector('#bb-s').onchange = (e) => { keep(); const s = K.student(e.target.value); if (s && s.room) { st.room = s.room; st.dept = DEPTS[Math.min(3, +K.fl(s.room) - 1)] || st.dept; } App.refresh(); };
      ['#bb-room', '#bb-date', '#bb-time', '#bb-place'].forEach((q) => root.querySelector(q).addEventListener('change', () => { keep(); App.refresh(); }));
      root.querySelectorAll('[data-evdel]').forEach((b) => b.onclick = () => { keep(); st.evidence.splice(+b.dataset.evdel, 1); App.refresh(); });
      root.querySelectorAll('[data-up]').forEach((inp) => inp.onchange = async () => {
        keep();
        for (const f of [...inp.files]) {
          if (/^image\//.test(f.type)) { try { st.evidence.push({ name: f.name, size: fileSize(f.size), img: await readImage(f, 900) }); } catch (e) { App.toast(e.message, 'err'); } }
          else if (f.size > 10 * 1024 * 1024) App.toast(f.name + ' vượt quá 10MB', 'err');
          else st.evidence.push({ name: f.name, size: fileSize(f.size), doc: true });
        }
        App.refresh();
      });
      const save = (status) => {
        keep();
        if (!st.student) return App.toast('Chọn sinh viên', 'err');
        if (!st.room) return App.toast('Chọn phòng', 'err');
        if (status !== 'nhap' && (!st.date || !st.time || !st.place)) return App.toast('Nhập đủ thời điểm và địa điểm trước khi chuyển xác minh', 'err');
        if (status !== 'nhap' && st.desc.trim().length < 10) return App.toast('Mô tả chi tiết cần tối thiểu 10 ký tự', 'err');
        const existing = id && K.db.violations.find((v) => v.id === id);
        const rec = existing || { id: nextId(K.db.violations, 'VP-'), created: K.now() };
        Object.assign(rec, { student: st.student, room: st.room, rule: st.rule, title: rule(st.rule).name.replace(/ quy định$/, ''), date: dmy(st.date), time: st.time, place: st.place, desc: st.desc.trim(), evidence: st.evidence, by: st.by, dept: st.dept, deadline: dmy(st.deadline), note: rec.note || '', status });
        if (!existing) K.db.violations.unshift(rec);
        if (status === 'cho-xac-minh') { notify(rec.student, 'Bạn có một biên bản ghi nhận ' + rec.id, 'Biên bản “' + vTitle(rec) + '” lúc ' + rec.date + ' ' + rec.time + ' đã được lập và đang chờ xác minh. Ban quản lý có thể đề nghị bạn giải trình.'); log('Lập biên bản', 'Lập biên bản ' + rec.id + ' cho ' + sname(rec.student)); }
        K.save(); App.st['bb-' + (id || 'new')] = null; App.st.vp4 = Object.assign(App.st.vp4 || {}, { sel: rec.id, grp: '', status: '' });
        App.toast(status === 'nhap' ? 'Đã lưu nháp biên bản ' + rec.id : 'Đã chuyển xác minh biên bản ' + rec.id); App.go('ql-vi-pham');
      };
      root.querySelector('#bb-draft').onclick = () => save('nhap');
      root.querySelector('#bb-send').onclick = () => { keep(); if (!st.evidence.length) return App.confirm('Chưa có minh chứng', 'Biên bản chưa đính kèm hình ảnh hoặc tài liệu. Vẫn chuyển xác minh?', 'Vẫn chuyển', () => save('cho-xac-minh')); save('cho-xac-minh'); };
    },
  };

  // ============ Ban quản lý: Danh mục nội quy & điểm nề nếp ============
  P['ql-noi-quy'] = {
    role: 'admin', title: 'Danh mục nội quy',
    render: () => {
      const st = App.state('nq4', { tab: 'rules' });
      const living = K.db.students.filter((s) => s.room);
      let body;
      if (st.tab === 'rules') body = `<div class="card pad"><div class="card-h"><div><h2 style="font-size:21px">Danh mục nội quy</h2><p class="muted small" style="margin-top:4px">Mỗi sinh viên có 100 điểm nề nếp/năm học. Hồ sơ kết luận “Vi phạm” trừ điểm theo bảng dưới.</p></div><button class="btn btn-red" id="rl-new">${ic('plus')}Thêm nội quy</button></div>
        <div class="tbl-wrap"><table class="tbl" style="font-size:14.5px"><thead><tr><th>Mã</th><th>Nhóm</th><th>Nội dung</th><th>Mức độ</th><th class="c">Trừ điểm</th><th class="r">Phạt tiền</th><th class="c">Hồ sơ</th><th></th></tr></thead><tbody>${K.db.rules.map((r) => `<tr><td>${r.id}</td><td><span class="badge b-gray b-sm">${r.cat}</span></td><td style="white-space:normal">${esc(r.name)}${r.note ? `<div class="small muted">${esc(r.note)}</div>` : ''}</td><td>${badge(LEVELS[r.level][0], LEVELS[r.level][1], { sm: true })}</td><td class="c"><b style="color:var(--red)">−${r.points}</b></td><td class="r num">${r.fine ? money(r.fine) : '—'}</td><td class="c num">${K.db.violations.filter((v) => v.rule === r.id && v.status !== 'nhap').length}</td><td class="r" style="white-space:nowrap"><button class="xbtn" data-rl="${r.id}" title="Sửa">${ic('pencil')}</button><button class="xbtn" data-rldel="${r.id}" title="Xóa" style="color:var(--red)">${ic('trash-2')}</button></td></tr>`).join('')}</tbody></table></div></div>`;
      else { const rows = living.map((s) => ({ s, p: points(s.id), n: K.db.violations.filter((v) => v.student === s.id && v.status !== 'nhap' && v.status !== 'da-huy').length })).sort((a, b) => a.p - b.p || b.n - a.n);
        body = `<div class="card pad"><div class="card-h"><h2 style="font-size:21px">Điểm nề nếp sinh viên đang ở</h2><span class="muted small">Sắp xếp từ điểm thấp nhất</span></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Sinh viên</th><th>Phòng</th><th class="c">Hồ sơ</th><th>Điểm</th><th>Xếp loại</th></tr></thead><tbody>${rows.map(({ s, p, n }) => { const t = tier(p); return `<tr><td><span class="who">${av(s.avatar, 36)}<span><b>${esc(s.name)}</b><small>${s.id}</small></span></span></td><td>${s.room} · Tầng ${K.fl(s.room)}</td><td class="c num">${n}</td><td style="min-width:200px"><span class="row" style="gap:12px"><b class="num" style="width:34px;color:var(--navy)">${p}</b><span class="bar" style="flex:1"><i style="width:${p}%;background:${{ green: '#1f9a4b', blue: '#1d5bd8', orange: '#df8600', red: '#dc1f2e' }[t[1]]}"></i></span></span></td><td>${badge(t[0], t[1], { sm: true })}</td></tr>`; }).join('')}</tbody></table></div></div>`; }
      return V4.adminShell({ active: 'ql-vi-pham', search: 'Tìm kiếm sinh viên, phòng, nội quy...' }, `${App.crumb([['Nội quy & vi phạm', 'ql-vi-pham'], 'Danh mục nội quy'])}<h1 class="v4-title">Danh mục nội quy &amp; điểm nề nếp</h1>
        <div class="utabs boxed">${[['rules', 'Nội quy', 'book-open'], ['score', 'Điểm nề nếp', 'award']].map(([k, t, i]) => `<button class="utab ${st.tab === k ? 'on' : ''}" data-tab="${k}">${ic(i)}${t}</button>`).join('')}</div>${body}`);
    },
    mount: (root) => {
      const st = App.st.nq4;
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      const form = (r) => `<div class="field"><label for="rf-name">Nội dung nội quy</label><input id="rf-name" class="input" value="${r ? esc(r.name) : ''}"></div><div class="grid g2" style="gap:14px;margin-top:12px"><div class="field"><label for="rf-cat">Nhóm</label>${sel('rf-cat', CATS, r ? r.cat : CATS[0])}</div><div class="field"><label for="rf-level">Mức độ</label>${sel('rf-level', Object.entries(LEVELS).map(([k, v]) => [k, v[0]]), r ? r.level : 'nhac-nho')}</div><div class="field"><label for="rf-points">Trừ điểm</label><input id="rf-points" type="number" min="0" max="50" class="input" value="${r ? r.points : 5}"></div><div class="field"><label for="rf-fine">Phạt tiền (đ)</label><input id="rf-fine" type="number" min="0" step="50000" class="input" value="${r ? r.fine : 0}"></div></div>`;
      const read = (el) => ({ name: el.querySelector('#rf-name').value.trim(), cat: el.querySelector('#rf-cat').value, level: el.querySelector('#rf-level').value, points: +el.querySelector('#rf-points').value, fine: +el.querySelector('#rf-fine').value });
      const nb = root.querySelector('#rl-new'); if (nb) nb.onclick = () => App.modal({ title: 'Thêm nội quy', body: form(null), foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Thêm</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const f = read(el); if (f.name.length < 8) return App.toast('Nội dung cần tối thiểu 8 ký tự', 'err'); const id = 'R' + String(Math.max(...K.db.rules.map((r) => +r.id.slice(1))) + 1).padStart(2, '0'); K.db.rules.push(Object.assign({ id }, f)); K.save(); close(); App.toast('Đã thêm nội quy ' + id); App.refresh(); } });
      root.querySelectorAll('[data-rl]').forEach((b) => b.onclick = () => { const r = K.db.rules.find((x) => x.id === b.dataset.rl); App.modal({ title: 'Sửa nội quy ' + r.id, body: form(r), foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Lưu</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const f = read(el); if (f.name.length < 8) return App.toast('Nội dung cần tối thiểu 8 ký tự', 'err'); Object.assign(r, f); K.save(); close(); App.toast('Đã lưu nội quy'); App.refresh(); } }); });
      root.querySelectorAll('[data-rldel]').forEach((b) => b.onclick = () => { const r = K.db.rules.find((x) => x.id === b.dataset.rldel); if (K.db.violations.some((v) => v.rule === r.id)) return App.toast('Nội quy đã có hồ sơ liên quan, không thể xóa', 'err'); App.confirm('Xóa nội quy', 'Xóa <b>' + esc(r.name) + '</b>?', 'Xóa', () => { K.db.rules = K.db.rules.filter((x) => x.id !== r.id); K.save(); App.refresh(); }, true); });
    },
  };

  // ============ Sinh viên: Nội quy & phản hồi ============
  P['sv-noi-quy'] = {
    role: 'student', title: 'Nội quy & phản hồi',
    render: () => {
      const u = K.me(); const p = points(u.id), t = tier(p);
      const mine = K.db.violations.filter((v) => v.student === u.id && v.status !== 'nhap');
      const need = mine.find((v) => v.status === 'can-giai-trinh');
      const acked = K.db.ruleAck[u.id];
      const byCat = CATS.map((c) => [c, K.db.rules.filter((r) => r.cat === c)]).filter(([, rs]) => rs.length);
      return V4.svShell({ active: 'sv-noi-quy', search: 'Tìm kiếm thông báo, dịch vụ, hướng dẫn...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('bn_giaitrinh')}" alt=""><h1>Nội quy &amp; phản hồi ${demo}</h1><p class="desc">Theo dõi điểm nề nếp, hồ sơ ghi nhận và gửi giải trình cho Ban quản lý ký túc xá.</p></div>
        ${need ? `<a href="#" class="card alert-card" data-go="sv-giai-trinh-${need.id}">${ic('file-warning')}<span><b>Hồ sơ ${need.id} cần bạn giải trình</b><small>${esc(vTitle(need))} · Hạn gửi ${need.request ? need.request.due : ''}</small></span><span class="btn btn-red btn-sm">Gửi giải trình ${ic('arrow-right')}</span></a>` : ''}
        <div class="grid resp-1" style="grid-template-columns:330px 1fr;gap:16px;align-items:start">
          <div class="card pad" style="text-align:center"><h2 class="card-t" style="justify-content:center;font-size:19px">${ic('award')}Điểm nề nếp năm học</h2>${scoreRing(p)}<div>${badge(t[0], t[1])}</div><p class="muted small" style="margin-top:10px;line-height:1.55">${t[2]}</p></div>
          <div class="card pad"><div class="card-h"><h2 class="card-t" style="font-size:19px">${ic('file-text')}Hồ sơ của tôi</h2><span class="muted small">${mine.length} hồ sơ</span></div>
            ${mine.length ? mine.map((v) => `<a href="#" class="case-row" data-go="sv-giai-trinh-${v.id}"><span class="amen-ic ${v.status === 'can-giai-trinh' ? 'blue' : v.status === 'da-xu-ly' ? 'green' : 'amber'}">${ic('file-text')}</span><span style="flex:1;min-width:0"><b>${v.id} · ${esc(vTitle(v))}</b><small>${v.date} · Phòng ${v.room}${v.points ? ' · −' + v.points + ' điểm' : ''}</small></span>${vBadge(v)}${ic('chevron-right')}</a>`).join('') : `<div class="empty" style="padding:30px"><span class="amen-ic green">${ic('badge-check')}</span><p>Bạn chưa có hồ sơ ghi nhận nào. Tiếp tục giữ vững nhé!</p></div>`}</div></div>
        <div class="card pad">${acked ? `<div class="reply-box" style="margin:0 0 14px">${ic('badge-check')}<b style="display:inline;margin-left:6px">Bạn đã xác nhận đọc nội quy lúc ${acked}.</b></div>` : `<div class="reply-box" style="background:var(--orange-50);margin:0 0 14px;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span style="flex:1;color:var(--ink)">${ic('info')} Vui lòng đọc kỹ nội quy và xác nhận. Đây là căn cứ để xét gia hạn lưu trú.</span><button class="btn btn-red btn-sm" id="ack">Tôi đã đọc và cam kết tuân thủ</button></div>`}
          <h2 class="card-t" style="font-size:19px">${ic('book-open')}Nội quy ký túc xá</h2>${byCat.map(([c, rs]) => `<h3 style="font-size:16px;margin:14px 0 8px">${c}</h3><div class="tbl-wrap"><table class="tbl compact"><tbody>${rs.map((r) => `<tr><td style="white-space:normal">${esc(r.name)}</td><td style="width:130px">${badge(LEVELS[r.level][0], LEVELS[r.level][1], { sm: true })}</td><td style="width:110px" class="r"><b style="color:var(--red)">−${r.points} điểm</b></td><td style="width:120px" class="r">${r.fine ? money(r.fine) : ''}</td></tr>`).join('')}</tbody></table></div>`).join('')}</div>`);
    },
    mount: (root) => { const a = root.querySelector('#ack'); if (a) a.onclick = () => { K.db.ruleAck[K.me().id] = K.now(); K.save(); App.toast('Cảm ơn bạn đã xác nhận nội quy'); App.refresh(); }; },
  };

  // ============ Sinh viên: Giải trình của tôi (ảnh 6, 14) ============
  P['sv-giai-trinh'] = {
    role: 'student', title: 'Giải trình của tôi',
    render: (id) => {
      const u = K.me();
      const mine = K.db.violations.filter((v) => v.student === u.id && v.status !== 'nhap');
      const v = mine.find((x) => x.id === id) || mine.find((x) => x.status === 'can-giai-trinh') || mine[0];
      const sh = (b) => V4.svShell({ active: 'sv-noi-quy', search: 'Tìm kiếm thông báo, dịch vụ, hướng dẫn...' }, `<div class="phead v4h"><img class="art" src="${K.A('bn_giaitrinh')}" alt=""><h1>Giải trình của tôi ${demo}</h1><p class="desc">Xem chi tiết phản ánh và gửi giải trình cho Ban quản lý ký túc xá.</p></div>${b}`);
      if (!v) return sh(`<div class="card pad empty"><span class="amen-ic green">${ic('badge-check')}</span><p>Bạn không có hồ sơ nào cần giải trình.</p><button class="btn btn-outline" data-go="sv-noi-quy">Về Nội quy &amp; phản hồi</button></div>`);
      const st = App.state('gt-' + v.id, () => Object.assign({ text: '', files: [] }, (K.db.drafts.gt || {})[v.id] || {}));
      const sent = !!v.explanation; const done = v.status === 'da-xu-ly' || v.status === 'da-huy';
      const c = v.conclusion;
      const result = done && c ? `<div class="result-card ${c.result === 'vi-pham' ? 'bad' : 'good'}"><span class="amen-ic ${c.result === 'vi-pham' ? 'red' : 'green'}">${ic(c.result === 'vi-pham' ? 'shield-alert' : 'badge-check')}</span><b>${c.result === 'vi-pham' ? 'Kết luận: Vi phạm' : c.result === 'khac-phuc' ? 'Kết luận: Đã khắc phục' : 'Kết luận: Không vi phạm'}</b><p>${esc(c.text)}</p>${c.points ? `<span class="badge b-red">−${c.points} điểm nề nếp</span>` : ''}<small class="muted">${c.at}</small></div>`
        : `<div class="result-empty">${ic('file-text')}<b>Chưa có kết luận</b><small>${sent ? 'Ban quản lý đang xem xét giải trình của bạn.' : 'Hồ sơ đang chờ bạn gửi giải trình.'}<br>Sau khi có kết luận, kết quả sẽ hiển thị tại đây.</small></div>`;
      const canReview = done && c && c.result === 'vi-pham' && !v.review;
      return sh(`
        <div class="card case-head">${ic('file-text')}<b>${v.id} · ${v.request ? 'Phản ánh ' : ''}${esc(vTitle(v).toLowerCase().replace(/^./, (m) => m))}</b>${vBadge(v, true)}<i class="sep"></i><span class="row" style="gap:10px">${ic('bed-double')}Phòng ${v.room}</span><span class="muted" style="margin-left:auto">Ngày ghi nhận: ${v.date}</span></div>
        <div class="grid resp-1" style="grid-template-columns:1fr 0.88fr;gap:16px;align-items:start">
          <div style="display:flex;flex-direction:column;gap:16px;min-width:0">
            <div class="card pad"><div class="card-h" style="margin-bottom:10px"><h2 class="card-t" style="font-size:19px">${ic('mail')}${v.request ? 'Ban quản lý đề nghị bổ sung thông tin' : 'Nội dung ghi nhận'}</h2><small class="muted">${v.request ? v.request.at : v.created}</small></div>
              <div class="msg-card"><p style="white-space:pre-line">${esc(v.request ? v.request.text : v.desc)}</p>${v.request && v.request.due ? `<small class="muted">Hạn gửi giải trình: <b>${v.request.due}</b></small>` : ''}<button class="btn btn-soft btn-sm" id="gt-record">${ic('file-text')}Xem biên bản</button></div></div>
            <div class="card pad"><h2 class="card-t" style="font-size:19px">${ic('file-text')}Nội dung giải trình</h2>
              ${sent ? `<div class="msg-card" style="margin-top:12px;background:var(--green-50)"><p style="white-space:pre-line">${esc(v.explanation.text)}</p>${(v.explanation.files || []).length ? `<div class="files">${v.explanation.files.map((f) => `<span>${ic('paperclip')}${esc(f.name)}</span>`).join('')}</div>` : ''}<small class="muted">Đã gửi lúc ${v.explanation.at}</small></div>`
                : v.status === 'can-giai-trinh' ? `<div style="position:relative;margin-top:12px"><textarea id="gt-text" class="textarea" data-max="1000" style="min-height:130px" placeholder="Trình bày thông tin và tình huống liên quan...">${esc(st.text)}</textarea><span class="counter">0/1000</span></div>
                <h3 class="card-t" style="font-size:16px;margin-top:16px">${ic('paperclip')}Đính kèm minh chứng</h3><label class="drop" style="margin-top:10px">${ic('cloud-upload')}<span>Kéo thả tệp vào đây hoặc <b>chọn tệp</b><br><small>Hỗ trợ ảnh, PDF, tối đa 10MB mỗi tệp.</small></span><input type="file" id="gt-files" multiple accept="image/*,.pdf"></label>${st.files.length ? `<div class="files">${st.files.map((f, i) => `<span>${ic('paperclip')}${esc(f.name)} <button class="xbtn" data-fdel="${i}" style="padding:0">${ic('x')}</button></span>`).join('')}</div>` : ''}
                <p class="muted small row" style="margin-top:10px;gap:8px">${ic('info')}Chỉ bạn và người xử lý hồ sơ xem nội dung này.</p>
                <div class="grid g2" style="gap:12px;margin-top:14px"><button class="btn btn-outline btn-lg" id="gt-draft">${ic('file-text')}Lưu nháp</button><button class="btn btn-red btn-lg" id="gt-send">${ic('send')}Gửi giải trình</button></div>`
                : `<p class="muted" style="margin-top:12px">${v.status === 'cho-xac-minh' ? 'Hồ sơ đang được xác minh. Nếu cần, Ban quản lý sẽ đề nghị bạn giải trình.' : 'Hồ sơ không yêu cầu giải trình.'}</p>`}</div></div>
          <div style="display:flex;flex-direction:column;gap:16px">
            <div class="card pad"><h2 class="card-t" style="font-size:19px">${ic('clock')}Tiến trình xử lý</h2><div style="margin-top:12px">${vline(vSteps(v, true), true)}</div></div>
            <div class="card pad result-wrap"><div><h2 class="card-t" style="font-size:19px">${ic('file-check')}Kết quả xử lý</h2>${result}
              ${v.review ? `<div class="reply-box" style="background:var(--orange-50)"><b style="color:var(--orange)">Đề nghị xem lại của bạn</b><p>${esc(v.review.text)}</p>${v.review.answer ? `<p class="small">Trả lời: ${esc(v.review.answer)}</p>` : '<p class="small muted">Đang chờ Ban quản lý trả lời.</p>'}</div>` : ''}
              <button class="btn btn-block ${canReview ? 'btn-outline-red' : 'btn-disabled'}" id="gt-review" ${canReview ? '' : 'disabled'} style="margin-top:12px">${ic('clock')}Gửi đề nghị xem lại</button></div><img src="${K.A('art_writing')}" alt="" class="result-art"></div>
          </div></div>`);
    },
    mount: (root, id) => {
      const u = K.me(); const mine = K.db.violations.filter((v) => v.student === u.id && v.status !== 'nhap');
      const v = mine.find((x) => x.id === id) || mine.find((x) => x.status === 'can-giai-trinh') || mine[0]; if (!v) return;
      const st = App.st['gt-' + v.id];
      root.querySelector('#gt-record').onclick = () => V4.showRecord(v);
      const ta = root.querySelector('#gt-text'); if (ta) ta.addEventListener('input', () => { st.text = ta.value; });
      const fi = root.querySelector('#gt-files'); if (fi) fi.onchange = () => { [...fi.files].forEach((f) => { if (f.size > 10 * 1024 * 1024) App.toast(f.name + ' vượt quá 10MB', 'err'); else st.files.push({ name: f.name, size: fileSize(f.size) }); }); App.refresh(); };
      root.querySelectorAll('[data-fdel]').forEach((b) => b.onclick = () => { st.files.splice(+b.dataset.fdel, 1); App.refresh(); });
      const dr = root.querySelector('#gt-draft'); if (dr) dr.onclick = () => { K.db.drafts.gt = K.db.drafts.gt || {}; K.db.drafts.gt[v.id] = { text: st.text, files: st.files }; K.save(); App.toast('Đã lưu nháp giải trình'); };
      const sd = root.querySelector('#gt-send'); if (sd) sd.onclick = () => {
        if (st.text.trim().length < 20) return App.toast('Nội dung giải trình cần tối thiểu 20 ký tự', 'err');
        App.confirm('Gửi giải trình', 'Sau khi gửi, bạn không thể sửa nội dung giải trình. Gửi cho Ban quản lý?', 'Gửi giải trình', () => {
          v.explanation = { text: st.text.trim(), files: st.files, at: K.now() }; v.status = 'da-giai-trinh';
          if (K.db.drafts.gt) delete K.db.drafts.gt[v.id];
          K.db.activity.unshift({ at: K.now(), by: u.name, av: u.avatar, act: 'Gửi giải trình', icon: 'doc', text: u.name + ' gửi giải trình hồ sơ ' + v.id });
          K.save(); App.toast('Đã gửi giải trình. Ban quản lý sẽ xem xét và thông báo kết quả.'); App.refresh();
        });
      };
      const rv = root.querySelector('#gt-review'); if (rv && !rv.disabled) rv.onclick = () => App.modal({ title: 'Gửi đề nghị xem lại ' + v.id, body: `<div class="field"><label for="rv-text">Lý do đề nghị xem lại</label><textarea id="rv-text" class="textarea" style="min-height:120px" placeholder="Trình bày căn cứ (nhân chứng, thời gian, hình ảnh...)"></textarea></div>`, foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Gửi đề nghị</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const t = el.querySelector('#rv-text').value.trim(); if (t.length < 20) return App.toast('Nội dung cần tối thiểu 20 ký tự', 'err'); v.review = { text: t, at: K.now() }; K.save(); close(); App.toast('Đã gửi đề nghị xem lại'); App.refresh(); } });
    },
  };

  // ---------- tài khoản sinh viên: điểm nề nếp ----------
  const acc = P['sv-tai-khoan']; const accRender = acc.render;
  acc.render = (p) => { const u = K.me(); const pts = points(u.id), t = tier(pts); return accRender(p).replace('<div class="card pad" style="padding:18px 20px;overflow:hidden">', `<a href="#" class="card pad hover-lift" data-go="sv-noi-quy" style="display:flex;align-items:center;gap:16px;color:var(--ink)"><span class="amen-ic ${t[1] === 'orange' ? 'amber' : t[1]}">${ic('award')}</span><span style="flex:1"><small class="muted">Điểm nề nếp</small><b style="display:block;color:var(--navy);font-size:22px">${pts}/100 · ${t[0]}</b></span>${ic('chevron-right')}</a><div class="card pad" style="padding:18px 20px;overflow:hidden">`); };
})();
