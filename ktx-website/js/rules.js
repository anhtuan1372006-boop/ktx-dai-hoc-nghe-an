/* Nội quy, vi phạm, điểm nề nếp và đăng ký ra vào (khách thăm, về muộn, vắng qua đêm) */
(function () {
  const K = window.KTX, { esc, ic, im, av, badge, sel } = App;
  const P = App.pages;
  const b2 = K.pad2, money = K.money;

  // ---------- dữ liệu ----------
  const LEVELS = { 'nhac-nho': ['Nhắc nhở', 'blue'], 'canh-cao': ['Cảnh cáo', 'orange'], 'nghiem-trong': ['Nghiêm trọng', 'red'] };
  const CATS = ['Giờ giấc', 'An toàn – PCCC', 'Trật tự', 'Khách thăm', 'Vệ sinh', 'Tài sản', 'Tệ nạn'];
  const seedRules = () => [
    { id: 'R01', cat: 'Giờ giấc', name: 'Về ký túc xá sau 23:00 không đăng ký', level: 'nhac-nho', points: 5, fine: 0 },
    { id: 'R02', cat: 'Giờ giấc', name: 'Vắng mặt qua đêm không báo trước', level: 'canh-cao', points: 10, fine: 0 },
    { id: 'R03', cat: 'An toàn – PCCC', name: 'Sử dụng bếp điện, thiết bị công suất lớn trong phòng', level: 'canh-cao', points: 15, fine: 200000 },
    { id: 'R04', cat: 'An toàn – PCCC', name: 'Hút thuốc trong khu ký túc xá', level: 'nghiem-trong', points: 20, fine: 300000 },
    { id: 'R05', cat: 'Trật tự', name: 'Gây ồn ào, mất trật tự sau 22:30', level: 'nhac-nho', points: 5, fine: 0 },
    { id: 'R06', cat: 'Khách thăm', name: 'Đưa khách ở lại qua đêm khi chưa được phép', level: 'nghiem-trong', points: 20, fine: 0 },
    { id: 'R07', cat: 'Vệ sinh', name: 'Không thực hiện lịch trực vệ sinh phòng', level: 'nhac-nho', points: 3, fine: 0 },
    { id: 'R08', cat: 'Vệ sinh', name: 'Phơi đồ, để rác sai nơi quy định', level: 'nhac-nho', points: 2, fine: 0 },
    { id: 'R09', cat: 'Tài sản', name: 'Làm hư hỏng tài sản chung', level: 'canh-cao', points: 10, fine: 0, note: 'Bồi thường theo giá trị thực tế' },
    { id: 'R10', cat: 'Tệ nạn', name: 'Uống rượu bia, đánh bạc trong ký túc xá', level: 'nghiem-trong', points: 25, fine: 0 },
  ];
  const V = (id, student, rule, date, status, extra) => Object.assign({ id, student, rule, date, status, by: 'Phạm Văn Hùng', desc: '', history: [{ d: date, t: 'Ghi nhận vi phạm', by: 'Phạm Văn Hùng' }] }, extra || {});
  const seedViolations = () => [
    V('VP-012', 'SV260033', 'R04', '23/10/2026 21:40', 'cho-xu-ly', { desc: 'Bảo vệ phát hiện hút thuốc tại cầu thang thoát hiểm tầng 3.', by: 'Bảo vệ ca tối' }),
    V('VP-011', 'SV260002', 'R03', '22/10/2026 19:15', 'cho-xu-ly', { desc: 'Kiểm tra phòng phát hiện nồi lẩu điện đang sử dụng. Đã tạm giữ thiết bị.' }),
    V('VP-010', 'SV260010', 'R05', '20/10/2026 23:05', 'khieu-nai', { desc: 'Phòng B204 mở nhạc to sau 23:00, các phòng bên cạnh phản ánh.', appeal: { text: 'Hôm đó em đã ngủ từ 22:00, tiếng ồn là từ phòng B205 bên cạnh. Em mong Ban quản lý kiểm tra lại camera hành lang.', at: '21/10/2026 08:10' } }),
    V('VP-009', 'SV260001', 'R01', '16/10/2026 23:25', 'da-xu-ly', { desc: 'Về ký túc xá lúc 23:25, chưa đăng ký về muộn.', result: 'Đã nhắc nhở trực tiếp, sinh viên ký cam kết.' }),
    V('VP-008', 'SV260018', 'R06', '12/10/2026 22:50', 'da-xu-ly', { desc: 'Có khách nữ ở lại phòng C101 qua đêm khi chưa đăng ký.', result: 'Lập biên bản, thông báo về khoa.' }),
    V('VP-007', 'SV260011', 'R07', '09/10/2026 08:00', 'da-xu-ly', { desc: 'Không trực vệ sinh theo lịch tuần 06 – 12/10.', result: 'Đã nhắc nhở.' }),
    V('VP-006', 'SV260014', 'R08', '05/10/2026 17:30', 'da-huy', { desc: 'Phơi quần áo tại lan can hành lang tầng 2.', result: 'Hủy do ghi nhầm phòng.' }),
  ];
  const seedPasses = () => [
    { id: 'DK-021', student: 'SV260001', type: 'khach', date: '2026-10-26', from: '09:00', to: '11:00', reason: 'Bố lên thăm và gửi đồ dùng.', guest: { name: 'Nguyễn Văn Bình', relation: 'Bố', phone: '0912 888 111' }, status: 'cho-duyet', at: '24/10/2026 20:05' },
    { id: 'DK-020', student: 'SV260004', type: 'vang-dem', date: '2026-10-25', to: '2026-10-26', reason: 'Về quê dự đám cưới chị gái.', status: 'da-duyet', at: '23/10/2026 10:12', note: 'Nhớ báo bảo vệ khi về.' },
    { id: 'DK-019', student: 'SV260003', type: 've-muon', date: '2026-10-24', to: '23:45', reason: 'Làm thêm ca tối tại cửa hàng tiện lợi.', status: 'da-duyet', at: '24/10/2026 09:00' },
    { id: 'DK-018', student: 'SV260011', type: 'khach', date: '2026-10-22', from: '19:00', to: '22:30', reason: 'Bạn cùng lớp đến làm bài tập nhóm.', guest: { name: 'Lê Thanh Tùng', relation: 'Bạn học', phone: '0977 222 456' }, status: 'tu-choi', at: '22/10/2026 15:30', note: 'Khách được ở đến 22:00, vui lòng đăng ký lại khung giờ phù hợp.' },
  ];
  const ensure = () => {
    let changed = false;
    if (!K.db.rules) { K.db.rules = seedRules(); changed = true; }
    if (!K.db.violations) { K.db.violations = seedViolations(); changed = true; }
    if (!K.db.passes) { K.db.passes = seedPasses(); changed = true; }
    if (!K.db.ruleAck) { K.db.ruleAck = {}; changed = true; }
    if (changed) K.save();
  };
  ensure();
  const origReset = K.reset;
  K.reset = () => { origReset(); ensure(); };

  // ---------- tính toán ----------
  const rule = (id) => K.db.rules.find((r) => r.id === id) || { name: 'Nội quy đã xóa', points: 0, level: 'nhac-nho', cat: '' };
  const counted = (v) => v.status === 'da-xu-ly';
  const points = (sid) => Math.max(0, 100 - K.db.violations.filter((v) => v.student === sid && counted(v)).reduce((s, v) => s + (v.points != null ? v.points : rule(v.rule).points), 0));
  const tier = (p) => (p >= 90 ? ['Tốt', 'green', 'Không có vi phạm đáng kể.'] : p >= 80 ? ['Khá', 'blue', 'Có vi phạm nhẹ, cần lưu ý.'] : p >= 60 ? ['Cảnh cáo', 'orange', 'Cần ký cam kết, ưu tiên thấp khi xét gia hạn.'] : ['Xem xét chấm dứt', 'red', 'Hội đồng KTX xem xét chấm dứt lưu trú.']);
  const vStatus = { 'cho-xu-ly': ['Chờ xử lý', 'orange', 'clock'], 'khieu-nai': ['Đang khiếu nại', 'blue', 'message-square-warning'], 'da-xu-ly': ['Đã xử lý', 'green', 'circle-check'], 'da-huy': ['Đã hủy', 'gray', 'circle-x'] };
  const vBadge = (s) => badge(vStatus[s][0], vStatus[s][1], { icon: vStatus[s][2], sm: true });
  const lvBadge = (l) => badge(LEVELS[l][0], LEVELS[l][1], { sm: true });
  const pStatus = { 'cho-duyet': ['Chờ duyệt', 'orange', 'clock'], 'da-duyet': ['Đã duyệt', 'green', 'circle-check'], 'tu-choi': ['Từ chối', 'red', 'circle-x'], 'da-den': ['Khách đã đến', 'blue', 'log-in'], 'da-ve': ['Đã hoàn tất', 'gray', 'check'] };
  const pBadge = (s) => badge(pStatus[s][0], pStatus[s][1], { icon: pStatus[s][2], sm: true });
  const PTYPE = { khach: ['Khách thăm', 'users'], 've-muon': ['Về muộn', 'moon'], 'vang-dem': ['Vắng qua đêm', 'luggage'] };
  const dmy = (iso) => (iso ? iso.split('-').reverse().join('/') : '');
  const passWhen = (p) => p.type === 'khach' ? dmy(p.date) + ' · ' + p.from + ' – ' + p.to : p.type === 've-muon' ? dmy(p.date) + ' · về trước ' + p.to : dmy(p.date) + ' → ' + dmy(p.to);
  const sname = (sid) => (K.student(sid) || { name: sid }).name;
  const notify = (sid, title, body) => K.db.notifications.unshift({ id: 'N' + Date.now() + Math.random().toString(36).slice(2, 5), to: sid, title, summary: body.slice(0, 90), cat: 'Lưu trú', icon: 'ni_doc', time: 'Vừa xong', author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', read: false, body: [body] });
  const log = (act, text) => K.db.activity.unshift({ at: K.now(), by: 'Quản trị viên', av: 'av_admin', act, icon: 'doc', text });
  const nextId = (arr, pre) => pre + String(Math.max(0, ...arr.map((x) => +String(x.id).split('-')[1] || 0)) + 1).padStart(3, '0');
  App.rulesApi = { points, tier, rule, CATS };

  const scoreRing = (p) => { const t = tier(p); const col = { green: '#1f9a4b', blue: '#1d5bd8', orange: '#df8600', red: '#dc1f2e' }[t[1]]; const c = 2 * Math.PI * 52; return `<div class="ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" stroke="${col}" stroke-dasharray="${(c * p / 100).toFixed(1)} ${c.toFixed(1)}" class="ring-fg"/></svg><div><b>${p}</b><small>/100 điểm</small></div></div>`; };

  // ============ Ban quản lý: Nội quy & vi phạm ============
  const adminShell = (body) => App.shell({ role: 'admin', logo: 'inline', active: 'ql-vi-pham', search: 'Tìm sinh viên, phòng, vi phạm...', sbw: 250 }, body);
  P['ql-vi-pham'] = {
    role: 'admin', title: 'Nội quy & vi phạm',
    render: () => {
      const st = App.state('viol', { tab: 'list', status: '', level: '', q: '', sel: null, ptab: 'cho-duyet' });
      const VS = K.db.violations;
      const month = VS.filter((v) => v.date.slice(3, 10) === '10/2026' && v.status !== 'da-huy').length;
      const waiting = VS.filter((v) => v.status === 'cho-xu-ly' || v.status === 'khieu-nai').length;
      const living = K.db.students.filter((s) => s.room);
      const warned = living.filter((s) => points(s.id) < 80).length;
      const passWait = K.db.passes.filter((p) => p.status === 'cho-duyet').length;
      const tabs = [['list', 'Vi phạm', waiting], ['rules', 'Nội quy', 0], ['score', 'Điểm nề nếp', warned], ['pass', 'Đăng ký ra vào', passWait]];
      let body = '';
      if (st.tab === 'list') {
        let list = VS.slice();
        if (st.status) list = list.filter((v) => v.status === st.status);
        if (st.level) list = list.filter((v) => (v.level || rule(v.rule).level) === st.level);
        if (st.q) { const q = st.q.toLowerCase(); list = list.filter((v) => (v.id + ' ' + sname(v.student) + ' ' + v.student + ' ' + rule(v.rule).name).toLowerCase().includes(q)); }
        const cur = list.find((v) => v.id === st.sel) || list[0]; if (cur) st.sel = cur.id;
        let detail = `<div class="card pad empty"><span class="amen-ic blue">${ic('shield-check')}</span><p>Không có vi phạm phù hợp bộ lọc.</p></div>`;
        if (cur) {
          const r = rule(cur.rule), s = K.student(cur.student) || {}, pts = cur.points != null ? cur.points : r.points, fine = cur.fine != null ? cur.fine : r.fine;
          detail = `<div class="card pad"><div class="row" style="justify-content:space-between;flex-wrap:wrap"><b style="color:var(--navy)">${cur.id}</b>${vBadge(cur.status)}</div>
            <div class="row" style="margin-top:14px">${av(s.avatar, 56)}<div><b style="color:var(--navy);font-size:18px;display:block">${esc(s.name || cur.student)}</b><small class="muted">${cur.student}${s.room ? ' · Phòng ' + s.room + ' · Tầng ' + K.fl(s.room) : ''}</small></div><span style="margin-left:auto;text-align:right"><small class="muted" style="display:block">Điểm nề nếp</small><b style="font-size:22px;color:var(--navy)">${points(cur.student)}</b></span></div>
            <div class="viol-rule"><span class="amen-ic red sm">${ic('shield-alert')}</span><div><b>${esc(r.name)}</b><div class="row" style="gap:8px;margin-top:6px;flex-wrap:wrap">${lvBadge(cur.level || r.level)}<span class="badge b-gray b-sm">${r.cat}</span><span class="badge b-red b-sm">−${pts} điểm</span>${fine ? `<span class="badge b-orange b-sm">Phạt ${money(fine)}</span>` : ''}</div></div></div>
            <dl class="kv" style="grid-template-columns:130px 1fr;margin-top:14px;font-size:14.5px"><dt>Thời điểm</dt><dd>${cur.date}</dd><dt>Người ghi nhận</dt><dd>${esc(cur.by)}</dd><dt>Mô tả</dt><dd style="font-weight:400;line-height:1.55">${esc(cur.desc || '—')}</dd>${cur.result ? `<dt>Kết quả xử lý</dt><dd style="font-weight:400">${esc(cur.result)}</dd>` : ''}</dl>
            ${cur.appeal ? `<div class="reply-box" style="background:var(--blue-50)"><b style="color:var(--blue-700)">${ic('message-square-warning')}Khiếu nại của sinh viên · ${cur.appeal.at}</b><p>${esc(cur.appeal.text)}</p>${cur.appeal.answer ? `<p class="small muted" style="margin-top:6px">Trả lời: ${esc(cur.appeal.answer)}</p>` : ''}</div>` : ''}
            <h3 style="font-size:15px;margin:16px 0 8px">Lịch sử xử lý</h3><div class="tl">${cur.history.map((h) => `<div class="tl-i" style="padding-bottom:10px"><span class="tl-dot">${ic('check')}</span><div><div class="tl-t" style="font-size:14px">${esc(h.t)}</div><div class="tl-s">${h.d} · ${esc(h.by)}</div></div></div>`).join('')}</div>
            ${cur.status === 'cho-xu-ly' ? `<div class="field" style="margin-top:8px"><label for="vp-result">Hình thức xử lý</label><textarea id="vp-result" class="textarea" style="min-height:70px" placeholder="Ví dụ: Nhắc nhở trực tiếp, sinh viên ký cam kết không tái phạm."></textarea></div>
              <div class="row" style="justify-content:flex-end;margin-top:12px;flex-wrap:wrap"><button class="btn btn-ghost" id="vp-cancel">${ic('circle-x')}Hủy vi phạm</button><button class="btn btn-red" id="vp-ok">${ic('check')}Xác nhận xử lý${pts ? ' (−' + pts + ' điểm)' : ''}</button></div>` : ''}
            ${cur.status === 'khieu-nai' ? `<div class="field" style="margin-top:8px"><label for="vp-answer">Trả lời khiếu nại</label><textarea id="vp-answer" class="textarea" style="min-height:70px" placeholder="Kết quả xác minh..."></textarea></div>
              <div class="row" style="justify-content:flex-end;margin-top:12px;flex-wrap:wrap"><button class="btn btn-outline" id="vp-accept">${ic('undo-2')}Chấp nhận, hủy vi phạm</button><button class="btn btn-red" id="vp-reject">${ic('gavel')}Giữ nguyên vi phạm</button></div>` : ''}
          </div>`;
        }
        body = `<div class="card resp-1" style="padding:12px 14px;display:grid;grid-template-columns:1fr 180px 180px auto;gap:12px;align-items:center"><div class="iwrap">${ic('search')}<input id="vf-q" class="input" placeholder="Tìm theo tên, mã sinh viên, nội dung vi phạm..." value="${esc(st.q)}"></div>${sel('vf-status', [['', 'Mọi trạng thái'], ...Object.entries(vStatus).map(([k, v]) => [k, v[0]])], st.status)}${sel('vf-level', [['', 'Mọi mức độ'], ...Object.entries(LEVELS).map(([k, v]) => [k, v[0]])], st.level)}<button class="btn btn-red" id="vp-new">${ic('plus')}Ghi nhận vi phạm</button></div>
          <div class="grid resp-1" style="grid-template-columns:1.45fr 1fr;gap:14px;align-items:start">
            <div class="card pad" style="padding:14px"><div class="tbl-wrap"><table class="tbl hover" style="font-size:14px"><thead><tr><th>Mã</th><th>Sinh viên</th><th>Vi phạm</th><th>Mức độ</th><th>Trạng thái</th></tr></thead><tbody>${list.map((v) => { const r = rule(v.rule); return `<tr data-v="${v.id}" class="${v.id === st.sel ? 'sel' : ''}"><td><b style="color:var(--navy)">${v.id}</b><div class="small muted">${v.date.slice(0, 10)}</div></td><td><span class="who">${av((K.student(v.student) || {}).avatar, 36)}<span><b>${esc(sname(v.student))}</b><small>${(K.student(v.student) || {}).room || v.student}</small></span></span></td><td style="min-width:210px;white-space:normal">${esc(r.name)}</td><td>${lvBadge(v.level || r.level)}</td><td>${vBadge(v.status)}</td></tr>`; }).join('') || '<tr><td colspan="5" class="muted" style="text-align:center;padding:24px">Không có vi phạm.</td></tr>'}</tbody></table></div></div>
            ${detail}</div>`;
      } else if (st.tab === 'rules') {
        body = `<div class="card pad"><div class="card-h"><div><h2 style="font-size:22px">Danh mục nội quy</h2><p class="muted small" style="margin-top:4px">Mỗi sinh viên bắt đầu năm học với 100 điểm nề nếp. Vi phạm đã xử lý sẽ bị trừ điểm theo bảng dưới.</p></div><button class="btn btn-red" id="rl-new">${ic('plus')}Thêm nội quy</button></div>
          <div class="tbl-wrap"><table class="tbl" style="font-size:14.5px"><thead><tr><th>Mã</th><th>Nhóm</th><th>Nội dung</th><th>Mức độ</th><th class="c">Trừ điểm</th><th class="r">Phạt tiền</th><th class="c">Đã ghi nhận</th><th></th></tr></thead><tbody>${K.db.rules.map((r) => `<tr><td>${r.id}</td><td><span class="badge b-gray b-sm">${r.cat}</span></td><td style="white-space:normal">${esc(r.name)}${r.note ? `<div class="small muted">${esc(r.note)}</div>` : ''}</td><td>${lvBadge(r.level)}</td><td class="c"><b style="color:var(--red)">−${r.points}</b></td><td class="r num">${r.fine ? money(r.fine) : '—'}</td><td class="c num">${K.db.violations.filter((v) => v.rule === r.id && v.status !== 'da-huy').length}</td><td class="r" style="white-space:nowrap"><button class="xbtn" data-rl="${r.id}" title="Sửa">${ic('pencil')}</button><button class="xbtn" data-rldel="${r.id}" title="Xóa" style="color:var(--red)">${ic('trash-2')}</button></td></tr>`).join('')}</tbody></table></div></div>
          <div class="grid g4">${[['Tốt', '90 – 100 điểm', 'green', 'Ưu tiên khi xét gia hạn và chọn phòng.'], ['Khá', '80 – 89 điểm', 'blue', 'Có vi phạm nhẹ, cần lưu ý.'], ['Cảnh cáo', '60 – 79 điểm', 'amber', 'Ký cam kết, ưu tiên thấp khi xét gia hạn.'], ['Xem xét chấm dứt', 'Dưới 60 điểm', 'red', 'Hội đồng KTX xem xét chấm dứt lưu trú.']].map(([t, r, c, d]) => `<div class="amen-card"><span class="amen-ic ${c}">${ic(c === 'green' ? 'award' : c === 'blue' ? 'thumbs-up' : c === 'amber' ? 'triangle-alert' : 'octagon-alert')}</span><b>${t}</b><p><b style="display:inline;margin:0;font-size:14.5px">${r}</b> · ${d}</p></div>`).join('')}</div>`;
      } else if (st.tab === 'score') {
        const rows = living.map((s) => ({ s, p: points(s.id), n: VS.filter((v) => v.student === s.id && v.status !== 'da-huy').length })).sort((a, b) => a.p - b.p || b.n - a.n);
        body = `<div class="card pad"><div class="card-h"><h2 style="font-size:22px">Điểm nề nếp sinh viên đang ở</h2><span class="muted small">${rows.length} sinh viên có tài khoản · sắp xếp từ điểm thấp nhất</span></div>
          <div class="tbl-wrap"><table class="tbl hover"><thead><tr><th>Sinh viên</th><th>Phòng</th><th class="c">Số vi phạm</th><th>Điểm</th><th>Xếp loại</th><th></th></tr></thead><tbody>${rows.map(({ s, p, n }) => { const t = tier(p); return `<tr><td><span class="who">${av(s.avatar, 38)}<span><b>${esc(s.name)}</b><small>${s.id}</small></span></span></td><td>${s.room} · Tầng ${K.fl(s.room)}</td><td class="c num">${n}</td><td style="min-width:200px"><span class="row" style="gap:12px"><b class="num" style="width:34px;color:var(--navy)">${p}</b><span class="bar" style="flex:1"><i style="width:${p}%;background:${{ green: '#1f9a4b', blue: '#1d5bd8', orange: '#df8600', red: '#dc1f2e' }[t[1]]}"></i></span></span></td><td>${badge(t[0], t[1], { sm: true })}</td><td class="r"><button class="btn btn-sm btn-outline" data-sv="${s.id}">Xem vi phạm</button></td></tr>`; }).join('')}</tbody></table></div></div>`;
      } else {
        let list = K.db.passes.slice();
        if (st.ptab !== 'all') list = list.filter((p) => (st.ptab === 'cho-duyet' ? p.status === 'cho-duyet' : p.status !== 'cho-duyet'));
        body = `<div class="card pad"><div class="card-h"><div class="seg">${[['cho-duyet', 'Chờ duyệt (' + passWait + ')'], ['done', 'Đã xử lý'], ['all', 'Tất cả']].map(([k, t]) => `<button class="pill ${st.ptab === k ? 'on' : ''}" data-ptab="${k}">${t}</button>`).join('')}</div><span class="muted small">Khách thăm được ở đến 22:00 · Cổng đóng lúc 23:00</span></div>
          <div class="tbl-wrap"><table class="tbl" style="font-size:14.5px"><thead><tr><th>Mã</th><th>Sinh viên</th><th>Loại</th><th>Thời gian</th><th>Chi tiết</th><th>Trạng thái</th><th class="r">Thao tác</th></tr></thead><tbody>${list.map((p) => `<tr><td><b style="color:var(--navy)">${p.id}</b><div class="small muted">${p.at.slice(0, 10)}</div></td><td><span class="who">${av((K.student(p.student) || {}).avatar, 34)}<span><b>${esc(sname(p.student))}</b><small>${(K.student(p.student) || {}).room || ''}</small></span></span></td><td><span class="row" style="gap:8px;white-space:nowrap">${ic(PTYPE[p.type][1])}${PTYPE[p.type][0]}</span></td><td class="num" style="white-space:nowrap">${passWhen(p)}</td><td style="white-space:normal;max-width:260px">${p.guest ? `<b>${esc(p.guest.name)}</b> (${esc(p.guest.relation)}) · ${esc(p.guest.phone)}<br>` : ''}<span class="muted small">${esc(p.reason)}</span>${p.note ? `<div class="small" style="color:var(--blue-700);margin-top:2px">${esc(p.note)}</div>` : ''}</td><td>${pBadge(p.status)}</td><td class="r" style="white-space:nowrap">${p.status === 'cho-duyet' ? `<button class="btn btn-sm btn-red" data-pok="${p.id}">Duyệt</button> <button class="btn btn-sm btn-outline-red" data-pno="${p.id}">Từ chối</button>` : p.status === 'da-duyet' && p.type === 'khach' ? `<button class="btn btn-sm btn-outline" data-pin="${p.id}">${ic('log-in')}Khách đến</button>` : p.status === 'da-den' ? `<button class="btn btn-sm btn-outline" data-pout="${p.id}">${ic('log-out')}Khách về</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="7" class="muted" style="text-align:center;padding:24px">Không có đăng ký nào.</td></tr>'}</tbody></table></div></div>`;
      }
      return adminShell(`<div class="phead" style="min-height:120px"><h1>Nội quy &amp; vi phạm</h1><p class="desc">Ghi nhận, xử lý vi phạm nội quy, theo dõi điểm nề nếp và duyệt đăng ký ra vào ký túc xá.</p></div>
        <div class="grid g4" style="gap:12px">${[['shield-alert', 'Vi phạm tháng 10', month, 'red', 'list'], ['clock', 'Chờ xử lý / khiếu nại', waiting, 'amber', 'list'], ['triangle-alert', 'Sinh viên dưới 80 điểm', warned, 'blue', 'score'], ['door-open', 'Đăng ký ra vào chờ duyệt', passWait, 'green', 'pass']].map(([i, t, v, c, tab]) => `<button class="stat hover-lift" data-tab="${tab}" style="cursor:pointer;text-align:left"><span class="amen-ic ${c}">${ic(i)}</span><div><div class="lbl2" style="font-size:15px">${t}</div><div class="val">${v}</div></div></button>`).join('')}</div>
        <div class="utabs boxed">${tabs.map(([k, t, n]) => `<button class="utab ${st.tab === k ? 'on' : ''}" data-tab="${k}">${t}${n ? ` <span class="cnt-dot">${n}</span>` : ''}</button>`).join('')}</div>
        ${body}`);
    },
    mount: (root) => {
      const st = App.st.viol;
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      const q = root.querySelector('#vf-q'); if (q) q.onchange = () => { st.q = q.value.trim(); App.refresh(); };
      [['#vf-status', 'status'], ['#vf-level', 'level']].forEach(([id, k]) => { const e = root.querySelector(id); if (e) e.onchange = () => { st[k] = e.value; App.refresh(); }; });
      root.querySelectorAll('[data-v]').forEach((tr) => tr.onclick = () => { st.sel = tr.dataset.v; App.refresh(); });
      root.querySelectorAll('[data-sv]').forEach((b) => b.onclick = () => { st.tab = 'list'; st.q = b.dataset.sv; st.status = ''; st.level = ''; st.sel = null; App.refresh(); });
      root.querySelectorAll('[data-ptab]').forEach((b) => b.onclick = () => { st.ptab = b.dataset.ptab; App.refresh(); });
      const nv = root.querySelector('#vp-new'); if (nv) nv.onclick = () => App.newViolation();
      const cur = K.db.violations.find((v) => v.id === st.sel);
      const finish = (v, status, text, hist) => { v.status = status; v.history.push({ d: K.now(), t: hist, by: 'Quản trị viên' }); K.save(); };
      const ok = root.querySelector('#vp-ok'); if (ok) ok.onclick = () => {
        const r = rule(cur.rule); const res = root.querySelector('#vp-result').value.trim() || 'Đã xử lý theo nội quy.'; const pts = cur.points != null ? cur.points : r.points; const fine = cur.fine != null ? cur.fine : r.fine;
        App.confirm('Xác nhận xử lý vi phạm', `Sinh viên <b>${esc(sname(cur.student))}</b> bị trừ <b>${pts} điểm</b> nề nếp${fine ? ` và phạt <b>${money(fine)}</b> (tạo hóa đơn phạt)` : ''}. Sinh viên sẽ nhận thông báo.`, 'Xác nhận', () => {
          cur.result = res; finish(cur, 'da-xu-ly', res, 'Xác nhận xử lý: ' + res);
          if (fine) { const s = K.student(cur.student) || {}; const room = K.room(s.room) || {}; K.db.invoices.push({ id: 'PV' + cur.id.slice(3), kind: 'fine', label: 'Tiền phạt vi phạm nội quy (' + cur.id + ')', student: cur.student, period: '10/2026', room: s.room || '—', khu: room.khu || '', items: [{ name: 'Phạt vi phạm: ' + r.name, amount: fine }], total: fine, status: 'chua-tt', due: '31/10/2026' }); }
          notify(cur.student, 'Kết quả xử lý vi phạm ' + cur.id, 'Vi phạm “' + r.name + '” lúc ' + cur.date + ' đã được xử lý: ' + res + ' Trừ ' + pts + ' điểm nề nếp' + (fine ? ', phạt ' + money(fine) + ' (xem mục Hóa đơn)' : '') + '. Nếu không đồng ý, bạn có thể khiếu nại trong 3 ngày tại mục Nội quy.');
          log('Xử lý vi phạm', 'Xử lý vi phạm ' + cur.id + ' của ' + sname(cur.student)); K.save(); App.toast('Đã xử lý vi phạm ' + cur.id); App.refresh();
        });
      };
      const cancel = root.querySelector('#vp-cancel'); if (cancel) cancel.onclick = () => { const why = root.querySelector('#vp-result').value.trim(); if (!why) return App.toast('Nhập lý do hủy vào ô Hình thức xử lý', 'err'); cur.result = why; finish(cur, 'da-huy', why, 'Hủy vi phạm: ' + why); log('Hủy vi phạm', 'Hủy vi phạm ' + cur.id); App.toast('Đã hủy vi phạm ' + cur.id); App.refresh(); };
      const acc = root.querySelector('#vp-accept'); if (acc) acc.onclick = () => { const a = root.querySelector('#vp-answer').value.trim(); if (!a) return App.toast('Nhập nội dung trả lời khiếu nại', 'err'); cur.appeal.answer = a; cur.result = 'Khiếu nại được chấp nhận: ' + a; finish(cur, 'da-huy', a, 'Chấp nhận khiếu nại, hủy vi phạm'); notify(cur.student, 'Khiếu nại vi phạm ' + cur.id + ' được chấp nhận', a + ' Vi phạm đã được hủy, điểm nề nếp không bị trừ.'); K.save(); App.toast('Đã chấp nhận khiếu nại'); App.refresh(); };
      const rej = root.querySelector('#vp-reject'); if (rej) rej.onclick = () => { const a = root.querySelector('#vp-answer').value.trim(); if (!a) return App.toast('Nhập nội dung trả lời khiếu nại', 'err'); cur.appeal.answer = a; const r = rule(cur.rule); cur.result = 'Giữ nguyên sau xác minh: ' + a; finish(cur, 'da-xu-ly', a, 'Giữ nguyên vi phạm sau khiếu nại'); notify(cur.student, 'Kết quả khiếu nại vi phạm ' + cur.id, a + ' Vi phạm được giữ nguyên, trừ ' + (cur.points != null ? cur.points : r.points) + ' điểm nề nếp.'); K.save(); App.toast('Đã trả lời khiếu nại'); App.refresh(); };
      // nội quy
      const ruleForm = (r) => `<div class="field"><label for="rf-name">Nội dung nội quy</label><input id="rf-name" class="input" value="${r ? esc(r.name) : ''}" placeholder="Ví dụ: Tự ý thay đổi giường khi chưa được phép"></div>
        <div class="grid g2" style="gap:14px;margin-top:12px"><div class="field"><label for="rf-cat">Nhóm</label>${sel('rf-cat', CATS, r ? r.cat : CATS[0])}</div><div class="field"><label for="rf-level">Mức độ</label>${sel('rf-level', Object.entries(LEVELS).map(([k, v]) => [k, v[0]]), r ? r.level : 'nhac-nho')}</div>
        <div class="field"><label for="rf-points">Trừ điểm nề nếp</label><input id="rf-points" type="number" min="0" max="50" class="input" value="${r ? r.points : 5}"></div><div class="field"><label for="rf-fine">Phạt tiền (đ)</label><input id="rf-fine" type="number" min="0" step="50000" class="input" value="${r ? r.fine : 0}"></div></div>`;
      const readRule = (el) => ({ name: el.querySelector('#rf-name').value.trim(), cat: el.querySelector('#rf-cat').value, level: el.querySelector('#rf-level').value, points: +el.querySelector('#rf-points').value, fine: +el.querySelector('#rf-fine').value });
      const rn = root.querySelector('#rl-new'); if (rn) rn.onclick = () => App.modal({ title: 'Thêm nội quy', body: ruleForm(null), foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Thêm nội quy</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const f = readRule(el); if (f.name.length < 8) return App.toast('Nội dung nội quy cần tối thiểu 8 ký tự', 'err'); if (!(f.points >= 0 && f.points <= 50)) return App.toast('Trừ điểm từ 0 đến 50', 'err'); const id = 'R' + String(Math.max(...K.db.rules.map((r) => +r.id.slice(1))) + 1).padStart(2, '0'); K.db.rules.push(Object.assign({ id }, f)); log('Thêm nội quy', 'Thêm nội quy ' + id + ': ' + f.name); K.save(); close(); App.toast('Đã thêm nội quy ' + id); App.refresh(); } });
      root.querySelectorAll('[data-rl]').forEach((b) => b.onclick = () => { const r = K.db.rules.find((x) => x.id === b.dataset.rl); App.modal({ title: 'Sửa nội quy ' + r.id, body: ruleForm(r) + '<p class="muted small" style="margin-top:10px">Thay đổi chỉ áp dụng cho vi phạm ghi nhận sau này; vi phạm cũ giữ nguyên số điểm đã trừ.</p>', foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Lưu</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const f = readRule(el); if (f.name.length < 8) return App.toast('Nội dung nội quy cần tối thiểu 8 ký tự', 'err'); K.db.violations.filter((v) => v.rule === r.id && v.points == null).forEach((v) => { v.points = r.points; v.fine = r.fine; v.level = r.level; }); Object.assign(r, f); K.save(); close(); App.toast('Đã lưu nội quy ' + r.id); App.refresh(); } }); });
      root.querySelectorAll('[data-rldel]').forEach((b) => b.onclick = () => { const r = K.db.rules.find((x) => x.id === b.dataset.rldel); if (K.db.violations.some((v) => v.rule === r.id && v.status !== 'da-huy')) return App.toast('Nội quy đã có vi phạm ghi nhận, không thể xóa. Hãy sửa nội dung thay vì xóa.', 'err'); App.confirm('Xóa nội quy', 'Xóa nội quy <b>' + esc(r.name) + '</b>?', 'Xóa', () => { K.db.rules = K.db.rules.filter((x) => x.id !== r.id); K.save(); App.toast('Đã xóa nội quy'); App.refresh(); }, true); });
      // ra vào
      const P2 = (id) => K.db.passes.find((p) => p.id === id);
      root.querySelectorAll('[data-pok]').forEach((b) => b.onclick = () => { const p = P2(b.dataset.pok); p.status = 'da-duyet'; notify(p.student, 'Đăng ký ' + PTYPE[p.type][0].toLowerCase() + ' ' + p.id + ' đã được duyệt', PTYPE[p.type][0] + ' ' + passWhen(p) + ' đã được duyệt.' + (p.type === 'khach' ? ' Khách xuất trình giấy tờ tùy thân tại quầy bảo vệ khi đến.' : '')); log('Duyệt đăng ký ra vào', 'Duyệt ' + p.id + ' của ' + sname(p.student)); K.save(); App.toast('Đã duyệt ' + p.id); App.refresh(); });
      root.querySelectorAll('[data-pno]').forEach((b) => b.onclick = () => { const p = P2(b.dataset.pno); App.modal({ title: 'Từ chối ' + p.id, body: '<div class="field"><label for="pn-why">Lý do</label><textarea id="pn-why" class="textarea" placeholder="Ví dụ: Khách chỉ được ở đến 22:00."></textarea></div>', foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-outline-red" data-ok>Từ chối</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const w = el.querySelector('#pn-why').value.trim(); if (!w) return App.toast('Nhập lý do từ chối', 'err'); p.status = 'tu-choi'; p.note = w; notify(p.student, 'Đăng ký ' + p.id + ' bị từ chối', w); K.save(); close(); App.toast('Đã từ chối ' + p.id); App.refresh(); } }); });
      root.querySelectorAll('[data-pin]').forEach((b) => b.onclick = () => { const p = P2(b.dataset.pin); p.status = 'da-den'; p.inAt = K.now(); K.save(); App.toast('Đã ghi nhận khách ' + p.guest.name + ' vào lúc ' + p.inAt.slice(11)); App.refresh(); });
      root.querySelectorAll('[data-pout]').forEach((b) => b.onclick = () => { const p = P2(b.dataset.pout); p.status = 'da-ve'; p.outAt = K.now(); K.save(); App.toast('Đã ghi nhận khách ra về lúc ' + p.outAt.slice(11)); App.refresh(); });
    },
  };

  App.newViolation = (pre) => {
    const living = K.db.students.filter((s) => s.room);
    App.modal({ title: 'Ghi nhận vi phạm', body: `<div class="field"><label for="nv-s">Sinh viên <span class="req">*</span></label>${sel('nv-s', [['', 'Chọn sinh viên'], ...living.map((s) => [s.id, s.name + ' · ' + s.id + ' · ' + s.room])], (pre && pre.student) || '')}</div>
      <div class="field" style="margin-top:12px"><label for="nv-r">Nội quy vi phạm <span class="req">*</span></label>${sel('nv-r', [['', 'Chọn nội quy'], ...K.db.rules.map((r) => [r.id, r.id + ' · ' + r.name])], '')}</div>
      <div id="nv-info" class="muted small" style="margin-top:8px"></div>
      <div class="grid g2" style="gap:14px;margin-top:12px"><div class="field"><label for="nv-d">Ngày</label><input id="nv-d" type="date" class="input" value="2026-10-25"></div><div class="field"><label for="nv-t">Giờ</label><input id="nv-t" type="time" class="input" value="22:30"></div></div>
      <div class="field" style="margin-top:12px"><label for="nv-desc">Mô tả sự việc <span class="req">*</span></label><textarea id="nv-desc" class="textarea" placeholder="Địa điểm, người phát hiện, tình trạng cụ thể..."></textarea></div>
      <div class="field" style="margin-top:12px"><label for="nv-by">Người ghi nhận</label>${sel('nv-by', ['Quản trị viên', 'Phạm Văn Hùng', 'Lê Thị Thu', 'Bảo vệ ca tối', 'Bảo vệ ca ngày'], 'Quản trị viên')}</div>`,
      foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Ghi nhận</button>',
      onMount: (el, close) => {
        const info = () => { const r = K.db.rules.find((x) => x.id === el.querySelector('#nv-r').value); el.querySelector('#nv-info').innerHTML = r ? `${LEVELS[r.level][0]} · trừ ${r.points} điểm${r.fine ? ' · phạt ' + money(r.fine) : ''}` : ''; };
        el.querySelector('#nv-r').onchange = info;
        el.querySelector('[data-ok]').onclick = () => {
          const sid = el.querySelector('#nv-s').value, rid = el.querySelector('#nv-r').value, desc = el.querySelector('#nv-desc').value.trim(), d = el.querySelector('#nv-d').value, t = el.querySelector('#nv-t').value;
          if (!sid) return App.toast('Chọn sinh viên', 'err'); if (!rid) return App.toast('Chọn nội quy vi phạm', 'err'); if (desc.length < 10) return App.toast('Mô tả cần tối thiểu 10 ký tự', 'err'); if (!d) return App.toast('Chọn ngày vi phạm', 'err');
          const r = rule(rid); const id = nextId(K.db.violations, 'VP-'); const when = dmy(d) + ' ' + (t || '00:00'); const by = el.querySelector('#nv-by').value;
          K.db.violations.unshift({ id, student: sid, rule: rid, points: r.points, fine: r.fine, level: r.level, date: when, status: 'cho-xu-ly', by, desc, history: [{ d: K.now(), t: 'Ghi nhận vi phạm', by }] });
          notify(sid, 'Bạn có một ghi nhận vi phạm nội quy', 'Vi phạm “' + r.name + '” lúc ' + when + ' đã được ghi nhận và đang chờ Ban quản lý xử lý. Nếu có ý kiến, bạn có thể khiếu nại tại mục Nội quy.');
          log('Ghi nhận vi phạm', 'Ghi nhận ' + id + ' cho ' + sname(sid)); K.save(); close();
          App.st.viol = Object.assign(App.st.viol || {}, { tab: 'list', sel: id, status: '', level: '', q: '' }); App.toast('Đã ghi nhận vi phạm ' + id); App.go('ql-vi-pham');
        };
      } });
  };

  // ============ Sinh viên: Nội quy & ra vào ============
  P['sv-noi-quy'] = {
    role: 'student', title: 'Nội quy & ra vào',
    render: () => {
      const u = K.me();
      const st = App.state('svrule', { tab: 'score' });
      const p = points(u.id), t = tier(p);
      const mine = K.db.violations.filter((v) => v.student === u.id);
      const myPass = K.db.passes.filter((x) => x.student === u.id);
      const acked = K.db.ruleAck[u.id];
      let body;
      if (st.tab === 'score') {
        body = `<div class="grid resp-1" style="grid-template-columns:340px 1fr;gap:16px;align-items:start">
          <div class="card pad" style="text-align:center"><h2 class="card-t" style="justify-content:center;font-size:19px">${ic('award')}Điểm nề nếp năm học</h2>${scoreRing(p)}<div style="margin-top:6px">${badge(t[0], t[1])}</div><p class="muted small" style="margin-top:10px;line-height:1.55">${t[2]}</p>
            <div class="tier-scale">${[['≥ 90', 'Tốt', 'green'], ['80–89', 'Khá', 'blue'], ['60–79', 'Cảnh cáo', 'amber'], ['< 60', 'Chấm dứt', 'red']].map(([r, n, c]) => `<div class="${t[0].startsWith(n.slice(0, 4)) || (n === 'Chấm dứt' && t[1] === 'red') ? 'on' : ''}"><i class="amen-ic ${c} sm"></i><b>${r}</b><small>${n}</small></div>`).join('')}</div></div>
          <div class="card pad"><div class="card-h"><h2 class="card-t" style="font-size:19px">${ic('shield-alert')}Vi phạm của tôi</h2><span class="muted small">${mine.filter((v) => v.status !== 'da-huy').length} ghi nhận</span></div>
            ${mine.length ? mine.map((v) => { const r = rule(v.rule); const pts = v.points != null ? v.points : r.points; return `<div class="viol-item"><div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px"><b style="color:var(--navy)">${esc(r.name)}</b>${vBadge(v.status)}</div><div class="row small muted" style="gap:10px;margin-top:6px;flex-wrap:wrap">${ic('calendar-days')}${v.date}<span>·</span>${lvBadge(v.level || r.level)}<span class="badge b-red b-sm">−${pts} điểm</span></div><p style="margin-top:8px;color:var(--text);font-size:14.5px">${esc(v.desc)}</p>${v.result ? `<p class="small" style="margin-top:6px;color:var(--ink)"><b>Kết quả:</b> ${esc(v.result)}</p>` : ''}${v.appeal ? `<div class="reply-box" style="background:var(--blue-50);margin-top:10px"><b style="color:var(--blue-700)">${ic('message-square-warning')}Khiếu nại của bạn</b><p>${esc(v.appeal.text)}</p>${v.appeal.answer ? `<p class="small muted">Trả lời: ${esc(v.appeal.answer)}</p>` : ''}</div>` : ''}${(v.status === 'cho-xu-ly' || v.status === 'da-xu-ly') && !v.appeal ? `<button class="btn btn-sm btn-outline" data-appeal="${v.id}" style="margin-top:10px">${ic('message-square-warning')}Khiếu nại</button>` : ''}</div>`; }).join('') : `<div class="empty" style="padding:30px"><span class="amen-ic green">${ic('badge-check')}</span><p>Bạn chưa có vi phạm nào. Tiếp tục giữ vững nhé!</p></div>`}</div></div>`;
      } else if (st.tab === 'rules') {
        const byCat = CATS.map((c) => [c, K.db.rules.filter((r) => r.cat === c)]).filter(([, rs]) => rs.length);
        body = `<div class="card pad">${acked ? `<div class="reply-box" style="margin:0 0 16px">${ic('badge-check')}<b style="display:inline">Bạn đã xác nhận đọc nội quy lúc ${acked}.</b></div>` : `<div class="reply-box" style="background:var(--orange-50);margin:0 0 16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap"><span style="flex:1;color:var(--ink)">${ic('info')} Vui lòng đọc kỹ nội quy và xác nhận. Đây là căn cứ để xét gia hạn lưu trú.</span><button class="btn btn-red btn-sm" id="ack">Tôi đã đọc và cam kết tuân thủ</button></div>`}
          ${byCat.map(([c, rs]) => `<h3 style="font-size:17px;margin:14px 0 8px">${c}</h3><div class="tbl-wrap"><table class="tbl compact"><tbody>${rs.map((r) => `<tr><td style="white-space:normal">${esc(r.name)}</td><td style="width:130px">${lvBadge(r.level)}</td><td style="width:110px" class="r"><b style="color:var(--red)">−${r.points} điểm</b></td><td style="width:130px" class="r">${r.fine ? money(r.fine) : ''}</td></tr>`).join('')}</tbody></table></div>`).join('')}
          <h3 style="font-size:17px;margin:18px 0 8px">Quy định chung</h3><ol style="padding-left:20px;line-height:1.8;color:var(--ink)">${App.RULES.map((x) => `<li>${x}</li>`).join('')}</ol></div>`;
      } else {
        body = `<div class="grid resp-1" style="grid-template-columns:1fr 1.1fr;gap:16px;align-items:start">
          <form class="card pad" id="ps-f" novalidate><h2 class="card-t" style="font-size:19px">${ic('door-open')}Tạo đăng ký mới</h2>
            <div class="seg" style="margin-top:12px;width:100%">${Object.entries(PTYPE).map(([k, [n, i]]) => `<button type="button" class="pill ${App.st.svrule.ptype === k || (!App.st.svrule.ptype && k === 'khach') ? 'on' : ''}" data-ptype="${k}" style="flex:1;justify-content:center">${ic(i)}${n}</button>`).join('')}</div>
            ${(() => { const k = App.st.svrule.ptype || 'khach'; if (k === 'khach') return `<div class="grid g2" style="gap:12px;margin-top:14px"><div class="field"><label for="ps-gname">Họ tên khách <span class="req">*</span></label><input id="ps-gname" class="input" placeholder="Nguyễn Văn A"></div><div class="field"><label for="ps-grel">Quan hệ <span class="req">*</span></label>${sel('ps-grel', ['Bố', 'Mẹ', 'Anh/Chị/Em', 'Người thân', 'Bạn học', 'Khác'], 'Bố')}</div><div class="field"><label for="ps-gphone">Số điện thoại khách <span class="req">*</span></label><input id="ps-gphone" class="input" inputmode="tel" placeholder="09xx xxx xxx"></div><div class="field"><label for="ps-date">Ngày đến <span class="req">*</span></label><input id="ps-date" type="date" class="input" min="2026-10-25" value="2026-10-26"></div><div class="field"><label for="ps-from">Từ giờ</label><input id="ps-from" type="time" class="input" value="09:00"></div><div class="field"><label for="ps-to">Đến giờ</label><input id="ps-to" type="time" class="input" value="11:00"></div></div>`;
              if (k === 've-muon') return `<div class="grid g2" style="gap:12px;margin-top:14px"><div class="field"><label for="ps-date">Ngày <span class="req">*</span></label><input id="ps-date" type="date" class="input" min="2026-10-25" value="2026-10-25"></div><div class="field"><label for="ps-to">Dự kiến về lúc <span class="req">*</span></label><input id="ps-to" type="time" class="input" value="23:30"></div></div>`;
              return `<div class="grid g2" style="gap:12px;margin-top:14px"><div class="field"><label for="ps-date">Đi từ ngày <span class="req">*</span></label><input id="ps-date" type="date" class="input" min="2026-10-25" value="2026-10-25"></div><div class="field"><label for="ps-to">Về ngày <span class="req">*</span></label><input id="ps-to" type="date" class="input" min="2026-10-25" value="2026-10-26"></div></div>`; })()}
            <div class="field" style="margin-top:12px"><label for="ps-reason">Lý do <span class="req">*</span></label><textarea id="ps-reason" class="textarea" style="min-height:80px" placeholder="Ví dụ: Bố lên thăm và gửi đồ dùng."></textarea></div>
            <p class="err" id="ps-err" hidden style="margin-top:8px"></p><button class="btn btn-red btn-block" style="margin-top:14px">${ic('send')}Gửi đăng ký</button>
            <p class="muted small" style="margin-top:10px">Khách thăm được ở trong khung 7:00 – 22:00. Về sau 23:00 hoặc vắng qua đêm mà không đăng ký sẽ bị ghi nhận vi phạm.</p></form>
          <div class="card pad"><h2 class="card-t" style="font-size:19px">${ic('history')}Đăng ký của tôi</h2>${myPass.length ? myPass.map((x) => `<div class="viol-item"><div class="row" style="justify-content:space-between"><span class="row" style="gap:8px;color:var(--navy);font-weight:600">${ic(PTYPE[x.type][1])}${PTYPE[x.type][0]} · ${x.id}</span>${pBadge(x.status)}</div><div class="small muted" style="margin-top:6px">${passWhen(x)}${x.guest ? ' · ' + esc(x.guest.name) + ' (' + esc(x.guest.relation) + ')' : ''}</div><p style="margin-top:6px;font-size:14.5px">${esc(x.reason)}</p>${x.note ? `<p class="small" style="color:var(--blue-700);margin-top:4px">Ban quản lý: ${esc(x.note)}</p>` : ''}${x.status === 'cho-duyet' ? `<button class="btn btn-sm btn-outline-red" data-pcancel="${x.id}" style="margin-top:8px">Hủy đăng ký</button>` : ''}</div>`).join('') : '<p class="muted" style="padding:20px;text-align:center">Chưa có đăng ký nào.</p>'}</div></div>`;
      }
      return App.shell({ role: 'student', active: 'sv-noi-quy', logo: 'inline', notif: 'dot', search: 'Tìm dịch vụ, thông báo, hướng dẫn...', foot: 'card-only', sbw: 270 }, `<div class="phead" style="min-height:120px">${App.crumb([['Trang chủ', 'sv-tong-quan'], 'Nội quy & ra vào'])}<h1>Nội quy &amp; ra vào</h1><p class="desc">Theo dõi điểm nề nếp, xem nội quy và đăng ký khách thăm, về muộn, vắng qua đêm.</p></div>
        <div class="utabs boxed">${[['score', 'Điểm nề nếp', 'award'], ['rules', 'Nội quy', 'book-open'], ['pass', 'Đăng ký ra vào', 'door-open']].map(([k, n, i]) => `<button class="utab ${st.tab === k ? 'on' : ''}" data-tab="${k}">${ic(i)}${n}${k === 'rules' && !acked ? ' <span class="cnt-dot">!</span>' : ''}</button>`).join('')}</div>${body}`);
    },
    mount: (root) => {
      const st = App.st.svrule; const u = K.me();
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      root.querySelectorAll('[data-ptype]').forEach((b) => b.onclick = () => { st.ptype = b.dataset.ptype; App.refresh(); });
      const ack = root.querySelector('#ack'); if (ack) ack.onclick = () => { K.db.ruleAck[u.id] = K.now(); K.save(); App.toast('Cảm ơn bạn đã xác nhận nội quy'); App.refresh(); };
      root.querySelectorAll('[data-appeal]').forEach((b) => b.onclick = () => { const v = K.db.violations.find((x) => x.id === b.dataset.appeal); App.modal({ title: 'Khiếu nại vi phạm ' + v.id, body: `<p class="muted" style="margin-bottom:10px">${esc(rule(v.rule).name)} · ${v.date}</p><div class="field"><label for="ap-text">Nội dung khiếu nại</label><textarea id="ap-text" class="textarea" style="min-height:120px" placeholder="Trình bày sự việc và căn cứ (nhân chứng, thời gian, camera...)"></textarea></div>`, foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Gửi khiếu nại</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const tx = el.querySelector('#ap-text').value.trim(); if (tx.length < 20) return App.toast('Nội dung khiếu nại cần tối thiểu 20 ký tự', 'err'); v.appeal = { text: tx, at: K.now() }; v.status = 'khieu-nai'; v.history.push({ d: K.now(), t: 'Sinh viên gửi khiếu nại', by: u.name }); K.save(); close(); App.toast('Đã gửi khiếu nại. Ban quản lý sẽ xác minh và trả lời.'); App.refresh(); } }); });
      root.querySelectorAll('[data-pcancel]').forEach((b) => b.onclick = () => { K.db.passes = K.db.passes.filter((x) => x.id !== b.dataset.pcancel); K.save(); App.toast('Đã hủy đăng ký'); App.refresh(); });
      const f = root.querySelector('#ps-f');
      if (f) f.onsubmit = (e) => {
        e.preventDefault();
        const type = st.ptype || 'khach'; const v = (id) => { const x = f.querySelector(id); return x ? x.value.trim() : ''; };
        const err = f.querySelector('#ps-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        if (!u.room) return fail('Bạn cần đang ở ký túc xá để tạo đăng ký ra vào.');
        const p = { id: nextId(K.db.passes, 'DK-'), student: u.id, type, date: v('#ps-date'), to: v('#ps-to'), reason: v('#ps-reason'), status: 'cho-duyet', at: K.now() };
        if (!p.date) return fail('Chọn ngày.');
        if (type === 'khach') {
          p.from = v('#ps-from'); p.guest = { name: v('#ps-gname'), relation: v('#ps-grel'), phone: v('#ps-gphone') };
          if (!p.guest.name) return fail('Nhập họ tên khách.');
          if (!/^0\d{9}$/.test(p.guest.phone.replace(/\s/g, ''))) return fail('Số điện thoại khách gồm 10 chữ số, bắt đầu bằng 0.');
          if (p.from < '07:00' || p.to > '22:00' || p.from >= p.to) return fail('Khung giờ thăm phải nằm trong 7:00 – 22:00 và giờ đến trước giờ về.');
        } else if (type === 'vang-dem') { if (!p.to || p.to < p.date) return fail('Ngày về phải sau hoặc bằng ngày đi.'); }
        else if (!p.to) return fail('Nhập giờ dự kiến về.');
        if (p.reason.length < 5) return fail('Nhập lý do (tối thiểu 5 ký tự).');
        K.db.passes.unshift(p); K.save(); App.toast('Đã gửi đăng ký ' + p.id + '. Ban quản lý sẽ duyệt sớm.'); App.refresh();
      };
    },
  };

  // ---------- tích hợp vào các trang có sẵn ----------
  const adminDash = P['ql-tong-quan'];
  const dashRender = adminDash.render;
  adminDash.render = (p) => {
    const html = dashRender(p);
    const n = K.db.violations.filter((v) => v.status === 'cho-xu-ly' || v.status === 'khieu-nai').length + K.db.passes.filter((x) => x.status === 'cho-duyet').length;
    return n ? html.replace('<h2 style="font-size:24px">Việc cần xử lý</h2>', `<h2 style="font-size:24px">Việc cần xử lý</h2><a href="#" class="badge b-red" data-go="ql-vi-pham" style="margin-left:auto;margin-right:12px">${ic('shield-alert')}${n} việc nội quy &amp; ra vào</a>`) : html;
  };
  // tài khoản sinh viên: hiển thị điểm nề nếp
  const acc = P['sv-tai-khoan']; const accRender = acc.render;
  acc.render = (p) => { const u = K.me(); const pts = points(u.id), t = tier(pts); return accRender(p).replace('<div class="card pad" style="padding:18px 20px;overflow:hidden">', `<a href="#" class="card pad hover-lift" data-go="sv-noi-quy" style="display:flex;align-items:center;gap:16px;color:var(--ink)"><span class="amen-ic ${t[1] === 'orange' ? 'amber' : t[1]}">${ic('award')}</span><span style="flex:1"><small class="muted">Điểm nề nếp</small><b style="display:block;color:var(--navy);font-size:22px">${pts}/100 · ${t[0]}</b></span>${ic('chevron-right')}</a><div class="card pad" style="padding:18px 20px;overflow:hidden">`); };
  // tìm kiếm nhanh
  const search = App.search;
  App.search = (q) => {
    const out = search(q); const role = K.db.session && K.db.session.role; const has = (s) => String(s).toLowerCase().includes(q);
    if (role === 'admin') { K.db.violations.forEach((v) => { if (has(v.id) || has(rule(v.rule).name)) out.push({ icon: 'shield-alert', t: v.id + ' · ' + sname(v.student), s: 'Vi phạm', go: 'ql-vi-pham' }); }); if (has('vi phạm') || has('nội quy') || has('ra vào') || has('khách')) out.unshift({ icon: 'shield-alert', t: 'Nội quy & vi phạm', s: 'Trang', go: 'ql-vi-pham' }); }
    else if (has('nội quy') || has('vi phạm') || has('khách') || has('về muộn') || has('nề nếp') || has('vắng')) out.unshift({ icon: 'shield-check', t: 'Nội quy & ra vào', s: 'Dịch vụ', go: 'sv-noi-quy' });
    return out;
  };
})();
