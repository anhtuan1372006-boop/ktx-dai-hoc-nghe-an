/* v4 – Điện nước: ghi chỉ số (ảnh 2), phân bổ phí và phát hành hóa đơn (ảnh 5), điện nước phòng của tôi (ảnh 3, 12) */
(function () {
  const K = window.KTX, { esc, ic, im, av, badge, sel } = App;
  const P = App.pages, V4 = App.v4;
  const money = K.money, num = (n) => (n == null || n === '' ? '-' : Number(n).toLocaleString('vi-VN').replace(/,/g, '.'));
  const MONTHS = ['10/2026', '09/2026', '08/2026'];
  const prev = (m) => { const [mm, yy] = m.split('/').map(Number); const d = new Date(yy, mm - 2, 1); return V4.pad(d.getMonth() + 1) + '/' + d.getFullYear(); };
  const lastDay = (m) => { const [mm, yy] = m.split('/').map(Number); return new Date(yy, mm, 0).getDate(); };
  const M = (m) => (K.db.meters[m] = K.db.meters[m] || {});
  const rec = (m, code) => (M(m)[code] = M(m)[code] || {});
  const use = (r) => ({ e: r && r.en != null && r.eo != null ? r.en - r.eo : null, w: r && r.wn != null && r.wo != null ? r.wn - r.wo : null });
  // trạng thái một dòng chỉ số
  const status = (m, code) => {
    const r = M(m)[code] || {}; const u = use(r);
    if (r.en == null || r.wn == null || r.en === '' || r.wn === '') return 'chua-nhap';
    if (u.e < 0 || u.w < 0) return 'loi';
    if (r.check && !r.check.done) return 'kiem-tra';
    if (r.locked) return 'da-chot';
    const p = use(K.db.meters[prev(m)] && K.db.meters[prev(m)][code]);
    if (p.e && u.e > p.e * 1.6 && u.e - p.e > 20) return 'bat-thuong';
    if (p.w && u.w > p.w * 1.8 && u.w - p.w > 4) return 'bat-thuong';
    return 'hop-le';
  };
  const ST = { 'hop-le': ['Hợp lệ', 'green', 'circle-check'], 'chua-nhap': ['Chưa nhập', 'orange', 'circle-alert'], loi: ['Chỉ số sai', 'red', 'circle-x'], 'bat-thuong': ['Bất thường', 'orange', 'triangle-alert'], 'da-chot': ['Đã chốt', 'blue', 'lock'], 'kiem-tra': ['Cần kiểm tra', 'red', 'search'] };
  const stBadge = (s) => `<span class="badge b-${ST[s][1]}">${ic(ST[s][2])}${ST[s][0]}</span>`;
  const cost = (r) => { const u = use(r); return { e: (u.e || 0) * K.db.prices.e, w: (u.w || 0) * K.db.prices.w }; };
  const slip = (m, code) => 'ĐN' + m.slice(0, 2) + m.slice(-2) + '-' + code;
  Object.assign(V4, { meterStatus: status, meterUse: use, meterCost: cost, prevMonth: prev, slip });

  // ---------- dữ liệu mẫu ----------
  (V4.seeders = V4.seeders || []).push(() => {
    const meters = {};
    MONTHS.forEach((m) => { meters[m] = {}; });
    K.db.rooms.forEach((r, i) => {
      let e = 600 + (i * 37) % 700, w = 40 + (i * 11) % 160;
      ['08/2026', '09/2026', '10/2026'].forEach((m, k) => {
        const ce = Math.round(r.beds * 11 + ((i * 7 + k * 5) % 15)), cw = r.beds * 2 + ((i + k) % 3);
        meters[m][r.code] = { eo: e, en: e + ce, wo: w, wn: w + cw, date: '3' + (m === '09/2026' ? '0' : '1') + '/' + m, locked: true, issued: m !== '10/2026' ? { at: '0' + (k + 1) + '/' + (m === '08/2026' ? '09' : '10') + '/2026', due: '10/' + (m === '08/2026' ? '09' : '10') + '/2026', method: 'deu' } : null };
        e += ce; w += cw;
      });
    });
    const set = (code, vals) => vals.forEach(([m, eo, en, wo, wn]) => Object.assign(meters[m][code], { eo, en, wo, wn }));
    set('A302', [['08/2026', 1130, 1185, 196, 203], ['09/2026', 1185, 1240, 203, 210], ['10/2026', 1240, 1300, 210, 218]]);
    set('A301', [['08/2026', 905, 955, 90, 95], ['09/2026', 955, 1000, 95, 100], ['10/2026', 1000, 1050, 100, 106]]);
    set('A303', [['08/2026', 700, 752, 45, 50], ['09/2026', 752, 800, 50, 55], ['10/2026', 800, null, 55, null]]);
    Object.assign(meters['10/2026'].A302, { photoE: 'meter_e', photoW: 'meter_w', date: '31/10/2026' });
    Object.assign(meters['10/2026'].A301, { photoE: 'meter_e', photoW: 'meter_w' });
    // tầng 3 tháng 10: chỉ A301, A302 đã chốt; các phòng khác hợp lệ nhưng chưa chốt
    K.db.rooms.filter((r) => r.khu === '3').forEach((r) => { if (!['A301', 'A302'].includes(r.code)) meters['10/2026'][r.code].locked = false; });
    meters['10/2026'].A303.locked = false;
    K.db.meters = meters;
  });

  // ============ Ban quản lý: Ghi chỉ số điện nước (ảnh 2) ============
  P['ql-dien-nuoc'] = {
    role: 'admin', title: 'Ghi chỉ số điện nước',
    render: () => {
      const st = App.state('gcs', { month: '10/2026', khu: '3', q: '', sel: 'A302', step: 1 });
      let rooms = K.db.rooms.filter((r) => r.khu === st.khu);
      if (st.q) rooms = rooms.filter((r) => r.code.toLowerCase().includes(st.q.toLowerCase()));
      const all = K.db.rooms.filter((r) => r.khu === st.khu);
      const stats = all.map((r) => status(st.month, r.code));
      const missing = all.filter((r, i) => stats[i] === 'chua-nhap' || stats[i] === 'loi').map((r) => r.code);
      const unlocked = all.filter((r, i) => stats[i] !== 'da-chot');
      if (!K.room(st.sel) || K.room(st.sel).khu !== st.khu) st.sel = (rooms[0] || {}).code;
      const cur = st.sel && rec(st.month, st.sel);
      const header = `<div class="phead v4h"><img class="art" src="${K.A('bn_dien')}" alt=""><h1>Ghi chỉ số điện nước ${V4.demo}</h1><p class="desc">Ghi nhận chỉ số định kỳ, phục vụ lập hóa đơn tiền điện, nước.</p></div>`;
      const stepper = `<div class="wz-tabs">${[['1', 'Ghi chỉ số'], ['2', 'Kiểm tra'], ['3', 'Lập hóa đơn']].map(([n, t], i) => `<button class="wzt ${st.step === i + 1 ? 'on' : ''}" data-step="${i + 1}"><span>${n}</span>${t}</button>${i < 2 ? '<i></i>' : ''}`).join('')}</div>`;
      const filters = `<div class="gcs-filter"><div class="iwrap">${ic('calendar-days')}${sel('g-month', MONTHS.map((m) => [m, 'Tháng ' + m]), st.month)}</div><div class="iwrap">${ic('building')}${sel('g-khu', App.khuOpts(), st.khu)}</div><div class="iwrap" style="flex:1;min-width:200px">${ic('search')}<input id="g-q" class="input" placeholder="Tìm phòng (ví dụ: A301)..." value="${esc(st.q)}"></div><label class="btn btn-outline" style="position:relative">${ic('upload')}Nhập Excel<input type="file" id="g-file" accept=".csv,.txt" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label><button class="btn btn-outline" id="g-tpl">${ic('file-text')}Tải mẫu</button></div>`;
      let main;
      if (st.step === 1) {
        main = `${filters}
          <div class="tbl-wrap gcs-wrap"><table class="tbl gcs"><thead><tr><th rowspan="2" class="c" style="width:44px"></th><th rowspan="2">Phòng</th><th colspan="3" class="c grp">Điện (kWh)</th><th colspan="3" class="c grp">Nước (m³)</th><th rowspan="2" class="c">Trạng thái</th><th rowspan="2" class="c">Minh chứng</th></tr><tr><th class="c">Cũ</th><th class="c">Mới</th><th class="c">Dùng</th><th class="c">Cũ</th><th class="c">Mới</th><th class="c">Dùng</th></tr></thead><tbody>
            ${rooms.map((r) => { const x = rec(st.month, r.code); const u = use(x); const s = status(st.month, r.code); const lock = x.locked; return `<tr data-room="${r.code}" class="${r.code === st.sel ? 'sel' : ''}"><td class="c"><label class="check blue"><input type="checkbox" data-pick="${r.code}" ${r.code === st.sel ? 'checked' : ''}></label></td><td><b style="color:var(--navy)">${r.code}</b></td><td class="c num">${num(x.eo)}</td><td class="c">${lock ? `<span class="num ro-val">${num(x.en)}</span>` : `<input class="input mt" data-k="en" data-r="${r.code}" inputmode="numeric" value="${x.en == null ? '' : x.en}" placeholder="Nhập chỉ số">`}</td><td class="c num">${u.e == null ? '-' : u.e}</td><td class="c num">${num(x.wo)}</td><td class="c">${lock ? `<span class="num ro-val">${num(x.wn)}</span>` : `<input class="input mt" data-k="wn" data-r="${r.code}" inputmode="numeric" value="${x.wn == null ? '' : x.wn}" placeholder="Nhập chỉ số">`}</td><td class="c num">${u.w == null ? '-' : u.w}</td><td class="c">${stBadge(s)}</td><td class="c"><button class="xbtn cam ${x.photoE || x.photoW ? 'has' : ''}" data-ev="${r.code}" aria-label="Minh chứng phòng ${r.code}">${ic('camera')}</button></td></tr>`; }).join('')}
          </tbody></table></div>
          ${missing.length ? `<div class="warn-bar">${ic('circle-alert')}<span><b>${missing.slice(0, 6).join(', ')}${missing.length > 6 ? '…' : ''} chưa có chỉ số mới hợp lệ.</b><small>Vui lòng nhập đầy đủ chỉ số điện, nước cho tất cả các phòng trước khi chốt.</small></span></div>` : unlocked.length ? `<div class="warn-bar ok">${ic('circle-check')}<span><b>Đã nhập đủ chỉ số tầng ${st.khu}.</b><small>Bấm “Kiểm tra dữ liệu” để rà soát rồi chốt chỉ số.</small></span></div>` : `<div class="warn-bar ok">${ic('lock')}<span><b>Chỉ số tầng ${st.khu} tháng ${st.month} đã chốt.</b><small>Chuyển sang bước Lập hóa đơn để phân bổ phí cho sinh viên.</small></span></div>`}
          ${cur ? `<div class="ev-panel"><div class="card-h" style="margin-bottom:10px"><h3 class="card-t" style="font-size:18px">${ic('image')}Minh chứng phòng ${st.sel}</h3><button class="xbtn" id="ev-close" aria-label="Đóng">${ic('x')}</button></div>
            <div class="ev-row">${[['E', 'Chỉ số điện', cur.en, 'kWh'], ['W', 'Chỉ số nước', cur.wn, 'm³']].map(([k, t, v, u]) => cur['photo' + k] ? `<div class="ev-ph"><img src="${K.A(cur['photo' + k])}" alt=""><div><span>${t}: ${num(v)} ${u}</span><button class="xbtn" data-phdel="${k}" ${cur.locked ? 'disabled' : ''} aria-label="Xóa ảnh">${ic('trash-2')}</button></div></div>` : `<label class="ev-ph empty">${ic('camera')}<span>Ảnh ${t.toLowerCase()}</span><input type="file" accept="image/*" data-ph="${k}" ${cur.locked ? 'disabled' : ''}></label>`).join('')}
              <div class="ev-meta"><div class="field"><label for="ev-date">${ic('calendar-days')}Ngày chụp</label><input id="ev-date" type="date" class="input" value="${V4.iso(cur.date || '31/10/2026')}" ${cur.locked ? 'disabled' : ''}></div><div class="field"><label for="ev-note">${ic('notebook-pen')}Ghi chú (tùy chọn)</label><input id="ev-note" class="input" placeholder="Nhập ghi chú..." value="${esc(cur.note || '')}" ${cur.locked ? 'disabled' : ''}></div></div>
              <label class="ev-add">${ic('camera')}<b>Thêm ảnh</b><small>JPG, PNG (tối đa 5MB)</small><input type="file" accept="image/*" id="ev-add" ${cur.locked ? 'disabled' : ''}></label></div>
            ${cur.check && !cur.check.done ? `<div class="warn-bar" style="margin-top:12px">${ic('search')}<span><b>Sinh viên đề nghị kiểm tra chỉ số (${cur.check.at})</b><small>${esc(cur.check.text)}</small></span><button class="btn btn-sm btn-red" id="ck-done">Đã kiểm tra</button></div>` : ''}</div>` : ''}`;
      } else {
        const rows = all.map((r) => { const x = rec(st.month, r.code); const u = use(x); const p = use(K.db.meters[prev(st.month)] && K.db.meters[prev(st.month)][r.code]); const s = status(st.month, r.code); const c = cost(x); return { r, x, u, p, s, c }; });
        const cnt = (k) => rows.filter((x) => (k === 'ok' ? ['hop-le', 'da-chot'].includes(x.s) : k === 'warn' ? ['bat-thuong', 'kiem-tra'].includes(x.s) : ['chua-nhap', 'loi'].includes(x.s))).length;
        const delta = (a, b) => (a == null || !b ? '-' : (a >= b ? '+' : '') + Math.round((a - b) * 100 / b) + '%');
        main = `<div class="grid g3" style="gap:12px">${[['ok', 'Hợp lệ', 'green', 'circle-check'], ['warn', 'Cần xem lại', 'amber', 'triangle-alert'], ['err', 'Thiếu / sai chỉ số', 'red', 'circle-x']].map(([k, t, c, i]) => `<div class="stat"><span class="amen-ic ${c}">${ic(i)}</span><div><div class="lbl2">${t}</div><div class="val">${cnt(k)}</div></div></div>`).join('')}</div>
          <div class="tbl-wrap gcs-wrap"><table class="tbl"><thead><tr><th>Phòng</th><th class="c">Điện dùng</th><th class="c">So tháng trước</th><th class="c">Nước dùng</th><th class="c">So tháng trước</th><th class="r">Tiền điện nước</th><th class="c">Trạng thái</th></tr></thead><tbody>${rows.map(({ r, u, p, s, c }) => `<tr data-room="${r.code}" style="cursor:pointer"><td><b style="color:var(--navy)">${r.code}</b> <small class="muted">${K.occCount(r.code)}/${r.beds} SV</small></td><td class="c num">${u.e == null ? '-' : u.e + ' kWh'}</td><td class="c num ${/^\+[6-9]\d|^\+\d{3}/.test(delta(u.e, p.e)) ? 'bad' : ''}">${delta(u.e, p.e)}</td><td class="c num">${u.w == null ? '-' : u.w + ' m³'}</td><td class="c num">${delta(u.w, p.w)}</td><td class="r num">${u.e == null ? '-' : money(c.e + c.w)}</td><td class="c">${stBadge(s)}</td></tr>`).join('')}</tbody></table></div>`;
      }
      const canLock = !missing.length && unlocked.length;
      return V4.adminShell({ active: 'ql-dien-nuoc', search: 'Tìm kiếm sinh viên, phòng, tầng...' }, `${header}
        <div class="card pad gcs-card">${stepper}${main}
          <div class="gcs-foot"><span class="muted row" style="gap:8px">${ic('info')}${st.step === 1 ? 'Hoàn tất các dòng trước khi chốt.' : 'Rà soát mức tăng bất thường trước khi chốt chỉ số.'}</span><span style="flex:1"></span>
            ${st.step === 1 ? `<button class="btn btn-outline btn-lg" id="g-save">${ic('save')}Lưu nháp</button><button class="btn btn-red btn-lg" id="g-check">${ic('search')}Kiểm tra dữ liệu</button>` : `<button class="btn btn-outline btn-lg" data-step="1">${ic('arrow-left')}Quay lại ghi chỉ số</button>`}
            <button class="btn btn-lg ${canLock ? 'btn-red' : 'btn-disabled'}" id="g-lock" ${canLock ? '' : 'disabled'}>${ic('circle-check')}Chốt chỉ số</button></div></div>`);
    },
    mount: (root) => {
      const st = App.st.gcs;
      root.querySelectorAll('[data-step]').forEach((b) => b.onclick = () => { const n = +b.dataset.step; if (n === 3) { App.st.pb = Object.assign(App.st.pb || {}, { room: st.sel, month: st.month }); return App.go('ql-phan-bo'); } st.step = n; App.refresh(); });
      root.querySelector('#g-month') && (root.querySelector('#g-month').onchange = (e) => { st.month = e.target.value; App.refresh(); });
      root.querySelector('#g-khu') && (root.querySelector('#g-khu').onchange = (e) => { st.khu = e.target.value; st.sel = null; App.refresh(); });
      const q = root.querySelector('#g-q'); if (q) q.onchange = () => { st.q = q.value.trim(); App.refresh(); };
      root.querySelectorAll('tr[data-room]').forEach((tr) => tr.addEventListener('click', (e) => { if (e.target.closest('input.mt')) return; if (st.sel === tr.dataset.room && !e.target.closest('[data-ev]')) return; st.sel = tr.dataset.room; if (st.step === 2) st.step = 1; App.refresh(); }));
      root.querySelectorAll('input.mt').forEach((inp) => inp.addEventListener('change', () => {
        const x = rec(st.month, inp.dataset.r); const v = inp.value.trim().replace(/\./g, '');
        if (v !== '' && !/^\d+$/.test(v)) { App.toast('Chỉ số chỉ gồm chữ số', 'err'); inp.value = x[inp.dataset.k] == null ? '' : x[inp.dataset.k]; return; }
        x[inp.dataset.k] = v === '' ? null : +v; K.save();
        const y = window.scrollY; App.refresh(); window.scrollTo(0, y);
      }));
      const tpl = root.querySelector('#g-tpl'); if (tpl) tpl.onclick = () => { const rows = K.db.rooms.filter((r) => r.khu === st.khu).map((r) => { const x = rec(st.month, r.code); return [r.code, x.en == null ? '' : x.en, x.wn == null ? '' : x.wn].join(','); }); const csv = 'phong,dien_moi,nuoc_moi\n' + rows.join('\n'); App.modal({ title: 'Mẫu nhập chỉ số tầng ' + st.khu, body: `<p class="muted small" style="margin-bottom:8px">Sao chép nội dung dưới đây, dán vào Excel, điền cột chỉ số mới rồi lưu thành tệp CSV để nhập lại.</p><textarea class="textarea" id="tpl-t" style="min-height:240px;font-family:monospace" readonly>${esc(csv)}</textarea>`, foot: `<button class="btn btn-red" data-copy>${ic('copy')}Sao chép</button>`, onMount: (el) => el.querySelector('[data-copy]').onclick = () => { const t = el.querySelector('#tpl-t'); t.select(); try { navigator.clipboard.writeText(csv).then(() => App.toast('Đã sao chép mẫu')).catch(() => App.toast('Đã chọn nội dung, nhấn Ctrl+C để sao chép')); } catch (e) { App.toast('Đã chọn nội dung, nhấn Ctrl+C để sao chép'); } } }); };
      const fi = root.querySelector('#g-file'); if (fi) fi.onchange = () => { const f = fi.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { let n = 0, bad = 0; String(rd.result).split(/\r?\n/).slice(1).forEach((l) => { const [code, en, wn] = l.split(/[,;\t]/).map((x) => (x || '').trim()); const r = K.room((code || '').toUpperCase()); if (!r) { if (code) bad++; return; } const x = rec(st.month, r.code); if (x.locked) return; if (/^\d+$/.test(en)) x.en = +en; if (/^\d+$/.test(wn)) x.wn = +wn; n++; }); K.save(); App.toast(n ? 'Đã nhập chỉ số cho ' + n + ' phòng' + (bad ? ', bỏ qua ' + bad + ' dòng không hợp lệ' : '') : 'Không đọc được dòng hợp lệ. Định dạng: phong,dien_moi,nuoc_moi', n ? 'ok' : 'err'); App.refresh(); }; rd.readAsText(f); };
      const cur = st.sel && rec(st.month, st.sel);
      const ec = root.querySelector('#ev-close'); if (ec) ec.onclick = () => { st.sel = null; App.refresh(); };
      const setPhoto = async (k, file) => { try { cur['photo' + k] = await V4.readImage(file, 700); K.save(); App.refresh(); } catch (e) { App.toast(e.message, 'err'); } };
      root.querySelectorAll('[data-ph]').forEach((i) => i.onchange = () => i.files[0] && setPhoto(i.dataset.ph, i.files[0]));
      const add = root.querySelector('#ev-add'); if (add) add.onchange = () => { if (!add.files[0]) return; setPhoto(!cur.photoE ? 'E' : !cur.photoW ? 'W' : 'E', add.files[0]); };
      root.querySelectorAll('[data-phdel]').forEach((b) => b.onclick = () => { delete cur['photo' + b.dataset.phdel]; K.save(); App.refresh(); });
      const ed = root.querySelector('#ev-date'); if (ed) ed.onchange = () => { cur.date = V4.dmy(ed.value); K.save(); };
      const en = root.querySelector('#ev-note'); if (en) en.onchange = () => { cur.note = en.value; K.save(); };
      const ck = root.querySelector('#ck-done'); if (ck) ck.onclick = () => App.modal({ title: 'Kết quả kiểm tra chỉ số ' + st.sel, body: `<div class="field"><label for="ck-t">Nội dung trả lời sinh viên</label><textarea id="ck-t" class="textarea">Đã kiểm tra lại đồng hồ, chỉ số ghi nhận chính xác.</textarea></div>`, foot: '<button class="btn btn-red" data-ok>Xác nhận</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const t = el.querySelector('#ck-t').value.trim(); cur.check.done = true; cur.check.answer = t; K.occupants(st.sel).forEach((s) => V4.notify(s.id, 'Kết quả kiểm tra chỉ số điện nước phòng ' + st.sel, t)); K.save(); close(); App.toast('Đã phản hồi sinh viên'); App.refresh(); } });
      const sv = root.querySelector('#g-save'); if (sv) sv.onclick = () => { K.save(); App.toast('Đã lưu nháp chỉ số tháng ' + st.month); };
      const gc = root.querySelector('#g-check'); if (gc) gc.onclick = () => { st.step = 2; App.refresh(); };
      const lk = root.querySelector('#g-lock'); if (lk && !lk.disabled) lk.onclick = () => {
        const rooms = K.db.rooms.filter((r) => r.khu === st.khu && !rec(st.month, r.code).locked);
        const warn = rooms.filter((r) => ['bat-thuong', 'kiem-tra'].includes(status(st.month, r.code))).map((r) => r.code);
        App.confirm('Chốt chỉ số tầng ' + st.khu, `Chốt chỉ số tháng ${st.month} cho <b>${rooms.length} phòng</b>. Sau khi chốt, chỉ số không sửa được và có thể phân bổ phí cho sinh viên.${warn.length ? `<br><span style="color:var(--orange)">Lưu ý: ${warn.join(', ')} có mức tiêu thụ bất thường hoặc đang chờ kiểm tra.</span>` : ''}`, 'Chốt chỉ số', () => {
          rooms.forEach((r) => { rec(st.month, r.code).locked = true; });
          V4.log('Chốt chỉ số', 'Chốt chỉ số điện nước tháng ' + st.month + ' tầng ' + st.khu + ' (' + rooms.length + ' phòng)'); K.save(); st.step = 1; App.toast('Đã chốt chỉ số ' + rooms.length + ' phòng. Tiếp tục bước Lập hóa đơn.'); App.refresh();
        });
      };
    },
  };

  // ---------- phân bổ ----------
  const daysIn = (s, m) => { const L = lastDay(m); if (!s.since) return L; const [d, mm, yy] = s.since.split('/').map(Number); const key = V4.pad(mm) + '/' + yy; if (key === m) return L - d + 1; return L; };
  const allocate = (code, m, method) => {
    const x = rec(m, code); const c = cost(x); const occ = K.occupants(code); const n = K.occCount(code) || 1; const L = lastDay(m);
    const rows = occ.map((s) => ({ s, days: daysIn(s, m) }));
    for (let i = rows.length; i < n; i++) rows.push({ s: null, days: L });
    const tot = rows.reduce((a, r) => a + (method === 'ngay' ? r.days : 1), 0) || 1;
    const share = (amount) => { const out = rows.map((r) => Math.round(amount * (method === 'ngay' ? r.days : 1) / tot / 100) * 100); const diff = amount - out.reduce((a, b) => a + b, 0); if (out.length) out[0] += diff; return out; };
    const e = share(c.e), w = share(c.w);
    return { rows: rows.map((r, i) => Object.assign(r, { e: e[i], w: w[i] })), c, n };
  };
  V4.allocate = allocate;

  // ============ Ban quản lý: Phân bổ phí điện nước (ảnh 5) ============
  P['ql-phan-bo'] = {
    role: 'admin', title: 'Phân bổ phí điện nước',
    render: () => {
      const st = App.state('pb', { room: 'A302', month: '10/2026', method: 'deu', due: '2026-11-10', msg: '', notify: true });
      if (!K.room(st.room)) st.room = 'A302';
      const r = K.room(st.room); const x = rec(st.month, st.room); const u = use(x);
      const s = status(st.month, st.room);
      st.msg = st.msg || `Tiền điện nước phòng ${st.room} tháng ${st.month}.\nĐề nghị sinh viên thanh toán đúng hạn.`;
      const al = allocate(st.room, st.month, st.method);
      const acc = al.rows.filter((y) => y.s);
      const locked = x.locked; const issued = x.issued;
      const chip = issued ? `<span class="badge b-blue pill-lg">${ic('send')}Đã phát hành ${issued.at}</span>` : locked ? `<span class="badge b-green pill-lg">${ic('circle-check')}Chỉ số đã chốt</span>` : `<span class="badge b-orange pill-lg">${ic('circle-alert')}${ST[s][0]}</span>`;
      const roomsOpt = K.db.rooms.map((y) => [y.code, y.code + ' · Tầng ' + y.khu]);
      return V4.adminShell({ active: 'ql-dien-nuoc', search: 'Tìm kiếm sinh viên, phòng, hóa đơn...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('bn_phanbo')}" alt=""><h1>Phân bổ phí điện nước ${V4.demo}</h1><p class="desc">Tính và phân bổ chi phí điện nước theo phòng, phát hành hóa đơn cho sinh viên.</p></div>
        <div class="grid resp-1" style="grid-template-columns:1fr 0.78fr;gap:16px;align-items:start">
          <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
            <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('file-text')}Thông tin phòng và kỳ tính phí</h2>
              <div class="grid g3" style="gap:14px;margin-top:12px"><div class="field"><label for="pb-room">Phòng</label><div class="iwrap">${ic('house')}${sel('pb-room', roomsOpt, st.room)}</div></div><div class="field"><label for="pb-month">Tháng</label><div class="iwrap">${ic('calendar-days')}${sel('pb-month', MONTHS.map((m) => [m, 'Tháng ' + m]), st.month)}</div></div><div class="field"><span class="lbl">Trạng thái chỉ số</span><div class="status-chip">${chip}</div></div></div></div>
            <div class="card pad"><div class="card-h"><h2 class="card-t" style="font-size:20px">${ic('zap')}Chỉ số và chi phí phòng ${st.room}</h2><button class="badge b-gray" id="pb-price" style="border:0;cursor:pointer">${ic('info')}Đơn giá minh họa · sửa</button></div>
              <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Loại</th><th>Chỉ số tiêu thụ</th><th>Đơn giá (đơn vị)</th><th class="r">Thành tiền</th></tr></thead><tbody>
                <tr><td><span class="row" style="gap:10px"><span style="color:var(--red)">${ic('zap')}</span><b>Điện</b></span></td><td class="num">${u.e == null ? '-' : u.e + ' kWh'}</td><td class="num">${money(K.db.prices.e)} / kWh</td><td class="r num"><b>${money(al.c.e)}</b></td></tr>
                <tr><td><span class="row" style="gap:10px"><span style="color:var(--blue)">${ic('droplet')}</span><b>Nước</b></span></td><td class="num">${u.w == null ? '-' : u.w + ' m³'}</td><td class="num">${money(K.db.prices.w)} / m³</td><td class="r num"><b>${money(al.c.w)}</b></td></tr>
                <tr class="sum"><td colspan="3"><b>Tổng cộng</b></td><td class="r"><b style="color:var(--red);font-size:20px">${money(al.c.e + al.c.w)}</b></td></tr></tbody></table></div>
              <h2 class="card-t" style="font-size:19px;margin-top:18px">${ic('users')}Phương thức phân bổ cho sinh viên</h2>
              <div class="opt-cards two" style="margin-top:10px"><label class="opt"><input type="radio" name="pb-m" value="deu" ${st.method === 'deu' ? 'checked' : ''}><span><b>Chia đều</b><small>Chia đều tổng chi phí cho tất cả sinh viên trong phòng</small></span></label><label class="opt"><input type="radio" name="pb-m" value="ngay" ${st.method === 'ngay' ? 'checked' : ''}><span><b>Theo ngày ở</b><small>Phân bổ theo số ngày thực tế lưu trú của từng sinh viên</small></span></label></div>
              <div class="info-strip">${ic('info')}Phòng có ${al.n} sinh viên${al.rows.every((y) => y.days === lastDay(st.month)) ? ' ở trọn kỳ' : ', có sinh viên chuyển đến trong tháng'}, ${st.method === 'deu' ? 'chia đều theo số người' : 'chia theo số ngày ở'}.</div>
              <h3 class="card-t" style="font-size:17px;margin-top:16px">${ic('calendar-days')}Bảng phân bổ chi phí <small class="muted" style="font-weight:400">(${al.n} sinh viên)</small></h3>
              <div class="tbl-wrap" style="margin-top:8px"><table class="tbl compact"><thead><tr><th class="c">STT</th><th>Sinh viên</th><th>Mã sinh viên</th>${st.method === 'ngay' ? '<th class="c">Ngày ở</th>' : ''}<th class="r">Tiền điện</th><th class="r">Tiền nước</th><th class="r">Tổng cộng</th></tr></thead><tbody>${al.rows.map((y, i) => `<tr><td class="c">${i + 1}</td><td><b>${y.s ? esc(y.s.name) : 'Sinh viên (chưa có tài khoản)'}</b></td><td>${y.s ? y.s.id : '—'}</td>${st.method === 'ngay' ? `<td class="c num">${y.days}</td>` : ''}<td class="r num">${money(y.e)}</td><td class="r num">${money(y.w)}</td><td class="r num"><b>${money(y.e + y.w)}</b></td></tr>`).join('')}<tr class="sum"><td colspan="${st.method === 'ngay' ? 4 : 3}"><b>Tổng cộng</b></td><td class="r num"><b>${money(al.c.e)}</b></td><td class="r num"><b>${money(al.c.w)}</b></td><td class="r"><b style="color:var(--red)">${money(al.c.e + al.c.w)}</b></td></tr></tbody></table></div></div></div>
          <div class="card pad"><h2 class="card-t" style="font-size:21px">${ic('file-text')}Xem trước hóa đơn</h2>
            <div class="inv-paper"><div class="row" style="justify-content:space-between;gap:8px"><span class="row" style="gap:10px"><img src="${K.A('logo')}" class="blend" style="width:54px" alt=""><span><b style="color:var(--navy);font-size:13px;display:block">ĐẠI HỌC NGHỆ AN</b><small style="color:var(--blue-700);font-size:11px">BAN QUẢN LÝ KÝ TÚC XÁ</small></span></span><span class="badge b-blue b-sm">${ic('info')}Đơn giá minh họa</span></div>
              <h3 style="text-align:center;font-size:22px;margin-top:12px">HÓA ĐƠN TIỀN ĐIỆN NƯỚC</h3><p style="text-align:center;color:var(--ink)">Phòng ${st.room} - Tháng ${st.month}</p><p style="text-align:center" class="muted small">Mã hóa đơn: ${slip(st.month, st.room)}</p>
              <div class="inv-lines"><div><span class="row" style="gap:10px"><span style="color:var(--red)">${ic('zap')}</span>Tiền điện (${u.e == null ? 0 : u.e} kWh)</span><b>${money(al.c.e)}</b></div><div><span class="row" style="gap:10px"><span style="color:var(--blue)">${ic('droplet')}</span>Tiền nước (${u.w == null ? 0 : u.w} m³)</span><b>${money(al.c.w)}</b></div></div>
              <div class="inv-total"><b>Tổng cộng</b><b>${money(al.c.e + al.c.w)}</b></div>
              <div class="inv-sum"><span class="row">${ic('users')}<span><small>Số hóa đơn cá nhân</small><b>${acc.length} hóa đơn</b></span></span><span class="row">${ic('user-round')}<span><small>Số tiền mỗi sinh viên</small><b>${st.method === 'deu' ? money(al.rows[0] ? al.rows[0].e + al.rows[0].w : 0) + ' / sinh viên' : 'Theo ngày ở'}</b></span></span></div>
              <div class="field row-field"><label for="pb-due">${ic('calendar-days')}Hạn thanh toán</label><input id="pb-due" type="date" class="input" value="${st.due}"></div>
              <div class="field" style="margin-top:10px"><label for="pb-msg">${ic('message-square-text')}Nội dung thông báo (hiển thị trong hóa đơn)</label><div style="position:relative"><textarea id="pb-msg" class="textarea" data-max="200" style="min-height:76px">${esc(st.msg)}</textarea><span class="counter">0/200</span></div></div>
              <label class="check" style="margin-top:10px;font-size:14px"><input type="checkbox" id="pb-notify" ${st.notify ? 'checked' : ''}>Gửi thông báo sau khi phát hành hóa đơn cho sinh viên</label>
              ${acc.length < al.n ? `<p class="small muted" style="margin-top:8px">${al.n - acc.length} sinh viên chưa có tài khoản trên hệ thống sẽ thanh toán tại quầy.</p>` : ''}
              <div class="grid g2" style="gap:10px;margin-top:14px"><button class="btn btn-outline btn-lg" id="pb-draft">${ic('save')}Lưu bản nháp</button><button class="btn btn-lg ${locked ? 'btn-red' : 'btn-disabled'}" id="pb-issue" ${locked ? '' : 'disabled'}>${ic('send')}${issued ? 'Phát hành lại' : 'Phát hành hóa đơn'}</button></div>
              ${!locked ? `<p class="small" style="color:var(--orange);margin-top:8px">Chỉ số phòng ${st.room} chưa chốt. <a href="#" data-go="ql-dien-nuoc">Đi tới ghi chỉ số</a></p>` : ''}</div></div></div>`);
    },
    mount: (root) => {
      const st = App.st.pb;
      const keep = () => { st.due = root.querySelector('#pb-due').value; st.msg = root.querySelector('#pb-msg').value; st.notify = root.querySelector('#pb-notify').checked; };
      root.querySelector('#pb-room').onchange = (e) => { keep(); st.room = e.target.value; st.msg = ''; App.refresh(); };
      root.querySelector('#pb-month').onchange = (e) => { keep(); st.month = e.target.value; st.msg = ''; App.refresh(); };
      root.querySelectorAll('[name=pb-m]').forEach((r) => r.onchange = () => { keep(); st.method = r.value; App.refresh(); });
      root.querySelector('#pb-price').onclick = () => App.modal({ title: 'Đơn giá điện nước', body: `<div class="grid g2" style="gap:14px"><div class="field"><label for="pp-e">Giá điện (đ/kWh)</label><input id="pp-e" type="number" step="100" class="input" value="${K.db.prices.e}"></div><div class="field"><label for="pp-w">Giá nước (đ/m³)</label><input id="pp-w" type="number" step="500" class="input" value="${K.db.prices.w}"></div></div><p class="muted small" style="margin-top:10px">Chỉ áp dụng cho các hóa đơn phát hành sau khi lưu.</p>`, foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Lưu đơn giá</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const e = +el.querySelector('#pp-e').value, w = +el.querySelector('#pp-w').value; if (!(e > 0 && w > 0)) return App.toast('Đơn giá phải lớn hơn 0', 'err'); K.db.prices = { e, w }; V4.log('Cập nhật đơn giá', 'Đơn giá điện ' + money(e) + '/kWh, nước ' + money(w) + '/m³'); K.save(); close(); App.toast('Đã lưu đơn giá'); App.refresh(); } });
      root.querySelector('#pb-draft').onclick = () => { keep(); K.save(); App.toast('Đã lưu bản nháp phân bổ phòng ' + st.room); };
      const is = root.querySelector('#pb-issue');
      if (is && !is.disabled) is.onclick = () => {
        keep(); if (!st.due) return App.toast('Chọn hạn thanh toán', 'err');
        const al = allocate(st.room, st.month, st.method); const x = rec(st.month, st.room); const r = K.room(st.room); const u = use(x); const due = V4.dmy(st.due);
        App.confirm('Phát hành hóa đơn', `Phát hành tiền điện nước phòng <b>${st.room}</b> tháng ${st.month}: tổng <b>${money(al.c.e + al.c.w)}</b> cho ${al.rows.filter((y) => y.s).length} sinh viên, hạn thanh toán <b>${due}</b>.`, 'Phát hành', () => {
          let upd = 0, created = 0, same = 0;
          al.rows.filter((y) => y.s).forEach((y, i) => {
            const items = [{ name: 'Tiền điện (' + u.e + ' kWh' + (st.method === 'ngay' ? ', ' + y.days + ' ngày ở' : ' / ' + al.n + ' người') + ')', amount: y.e }, { name: 'Tiền nước (' + u.w + ' m³' + (st.method === 'ngay' ? ', ' + y.days + ' ngày ở' : ' / ' + al.n + ' người') + ')', amount: y.w }];
            const inv = K.db.invoices.find((v) => v.student === y.s.id && v.period === st.month && !v.kind);
            if (inv && inv.status === 'chua-tt' && !inv.recv) { inv.items = [inv.items[0]].concat(items); inv.total = inv.items.reduce((a, b) => a + b.amount, 0); inv.due = due; inv.slip = slip(st.month, st.room); upd++; }
            else {
              // hóa đơn tháng đã thanh toán / đang đối soát: chỉ thu phần chênh lệch so với điện nước đã tính
              const billed = inv ? inv.items.filter((x) => /điện|nước/i.test(x.name)).reduce((a2, x) => a2 + x.amount, 0) : 0;
              const diff = y.e + y.w - billed; const id = slip(st.month, st.room) + '-' + V4.pad(i + 1);
              K.db.invoices = K.db.invoices.filter((v) => v.id !== id || v.status !== 'chua-tt');
              if (diff > 0 && !K.db.invoices.find((v) => v.id === id)) { K.db.invoices.unshift({ id, kind: 'dien-nuoc', label: inv ? 'Tiền điện nước chênh lệch tháng ' + st.month : 'Tiền điện nước tháng ' + st.month, student: y.s.id, period: st.month, room: st.room, khu: r.khu, items: inv ? [{ name: 'Chênh lệch điện nước thực tế so với định mức đã thu', amount: diff }] : items, total: diff, status: 'chua-tt', due, slip: slip(st.month, st.room) }); created++; }
              else same++;
            }
            if (st.notify) V4.notify(y.s.id, 'Hóa đơn tiền điện nước phòng ' + st.room + ' tháng ' + st.month, st.msg + '\nPhần của bạn: ' + money(y.e + y.w) + '. Hạn thanh toán: ' + due + '.');
          });
          x.issued = { at: K.today(), due, method: st.method };
          V4.log('Phát hành hóa đơn', 'Phát hành tiền điện nước phòng ' + st.room + ' tháng ' + st.month); K.save();
          App.toast('Đã phát hành: cập nhật ' + upd + ', tạo mới ' + created + ' hóa đơn' + (same ? ', ' + same + ' sinh viên không phát sinh chênh lệch' : '') + '. Hạn thanh toán ' + due + '.'); App.refresh();
        });
      };
    },
  };

  // ============ Sinh viên: Điện nước phòng của tôi (ảnh 3, 12) ============
  P['sv-dien-nuoc'] = {
    role: 'student', title: 'Điện nước phòng của tôi',
    render: () => {
      const u = K.me(); const st = App.state('svdn', { month: '10/2026' });
      const head = (sub) => `<div class="row dn-head" style="justify-content:space-between;flex-wrap:wrap;gap:14px"><div><h1 class="v4-title">Điện nước phòng của tôi ${V4.demo}</h1><p class="dn-sub">${sub}</p></div><div class="row" style="gap:12px"><div class="iwrap" style="width:230px">${ic('calendar-days')}${sel('dn-m', MONTHS.map((m) => [m, 'Tháng ' + m]), st.month, '', 'style="height:52px;font-size:17px"')}</div><button class="btn btn-outline btn-lg" id="dn-hist">${ic('clock')}Xem lịch sử</button></div></div>`;
      if (!u.room) return V4.svShell({ active: 'sv-dien-nuoc', search: 'Tìm kiếm thông báo, dịch vụ, hướng dẫn...' }, `${head('Bạn chưa có phòng ở ký túc xá')}<div class="card pad empty"><p>Thông tin điện nước sẽ hiển thị khi bạn được xếp phòng.</p></div>`);
      const r = K.room(u.room); const x = (K.db.meters[st.month] || {})[u.room] || {}; const us = use(x); const c = cost(x);
      const entered = us.e != null && us.w != null;
      const invDN = K.db.invoices.find((v) => v.student === u.id && v.period === st.month && v.kind === 'dien-nuoc' && v.status !== 'da-tt');
      const inv = invDN || K.db.invoices.find((v) => v.student === u.id && v.period === st.month && !v.kind) || K.db.invoices.find((v) => v.student === u.id && v.period === st.month && v.kind === 'dien-nuoc');
      const monthly = K.db.invoices.find((v) => v.student === u.id && v.period === st.month && !v.kind);
      const billedOf = (v) => (v ? v.items.filter((i) => /điện|nước/i.test(i.name)).reduce((a, b) => a + b.amount, 0) : 0);
      const share = monthly || invDN ? billedOf(monthly) + (invDN && monthly ? invDN.total : billedOf(invDN)) : Math.round((c.e + c.w) / (K.occCount(u.room) || 1));
      const payBadge = !inv ? `<span class="badge b-gray">${ic('clock')}Chưa phát hành</span>` : inv.status === 'da-tt' ? `<span class="badge b-green">${ic('circle-check')}Đã thanh toán</span>` : App.invStatus(inv) === 'cho-doi-soat' ? `<span class="badge b-orange">${ic('clock')}Chờ đối soát</span>` : `<span class="badge b-orange">${ic('circle-alert')}Chưa thanh toán</span>`;
      const meterCard = (kind) => { const e = kind === 'e'; const [ico, t, d, o, n, us2, unit, price, money2] = e ? ['zap', 'Điện', 'Sử dụng an toàn, tiết kiệm điện', x.eo, x.en, us.e, 'kWh', K.db.prices.e, c.e] : ['droplet', 'Nước', 'Sử dụng nước hợp lý, bảo vệ môi trường', x.wo, x.wn, us.w, 'm³', K.db.prices.w, c.w];
        return `<div class="card pad mcard"><div class="row" style="gap:16px"><span class="mc-ic ${e ? 'red' : 'blue'}">${ic(ico)}</span><span><b>${t}</b><small>${d}</small></span></div>
          <div class="mc-rows"><div>${ic('gauge')}<span>Chỉ số đầu kỳ</span><b>${num(o)}</b><i>${unit}</i></div><div>${ic('gauge')}<span>Chỉ số cuối kỳ</span><b>${num(n)}</b><i>${unit}</i></div><div>${ic('clock')}<span>Tiêu thụ trong tháng</span><b>${us2 == null ? '-' : us2}</b><i>${unit}</i></div><div>${ic('tag')}<span>Đơn giá mẫu</span><b>${money(price)}/${unit}</b><i></i></div></div>
          <div class="mc-total"><b>Thành tiền</b><strong>${entered ? money(money2) : '-'}</strong></div></div>`; };
      const ph = (k, t, icn, col) => `<div class="mph"><span class="row" style="gap:8px;font-weight:600;color:var(--navy)"><span style="color:${col}">${ic(icn)}</span>${t}</span>${x['photo' + k] ? `<img src="${K.A(x['photo' + k])}" alt="${t}">` : `<div class="mph-empty">${ic('image-off')}<small>Chưa có ảnh</small></div>`}<button class="btn btn-soft btn-sm btn-block" data-ph="${k}" ${x['photo' + k] ? '' : 'disabled'}>${ic('eye')}Xem ảnh</button><small class="muted">Ngày ghi: ${x.date || '—'}</small></div>`;
      return V4.svShell({ active: 'sv-dien-nuoc', search: 'Tìm kiếm thông báo, dịch vụ, hướng dẫn...' }, `${head(`${u.room} · Tầng ${r.khu} · Tháng ${st.month}`)}
        ${entered ? '' : `<div class="warn-bar">${ic('clock')}<span><b>Chưa có chỉ số tháng ${st.month}</b><small>Ban quản lý sẽ ghi chỉ số vào cuối tháng. Số liệu dưới đây sẽ được cập nhật sau đó.</small></span></div>`}
        <div class="grid g2" style="gap:16px">${meterCard('e')}${meterCard('w')}</div>
        <div class="grid resp-1" style="grid-template-columns:1.12fr 1fr;gap:16px;align-items:stretch">
          <div class="card pad"><h2 class="card-t" style="font-size:21px">${ic('users')}Phân bổ chi phí điện nước của phòng</h2>
            <div class="alloc"><img src="${K.A('group4')}" alt=""><div><div class="al-row"><span>Tổng điện nước cả phòng</span><b>${entered ? money(c.e + c.w) : '-'}</b></div><div class="al-row"><span>Chia ${x.issued && x.issued.method === 'ngay' ? 'theo ngày ở cho' : 'đều cho'}</span><b>${K.occCount(u.room)} sinh viên</b></div>
              <div class="al-mine"><small>Phần của bạn${x.issued ? '' : ' (tạm tính)'}</small><div class="row" style="justify-content:space-between;gap:8px;flex-wrap:wrap"><strong>${entered ? money(share) : '-'}</strong>${payBadge}</div></div></div></div></div>
          <div class="card pad"><h2 class="card-t" style="font-size:21px">${ic('image')}Ảnh đồng hồ</h2><div class="mph-grid">${ph('E', 'Đồng hồ điện', 'zap', 'var(--blue)')}${ph('W', 'Đồng hồ nước', 'droplet', 'var(--red)')}</div><div class="slip">${ic('file-text')}Mã phiếu: ${V4.slip(st.month, u.room)}</div></div></div>
        ${x.check ? `<div class="warn-bar ${x.check.done ? 'ok' : ''}">${ic(x.check.done ? 'circle-check' : 'search')}<span><b>${x.check.done ? 'Ban quản lý đã kiểm tra chỉ số' : 'Đã gửi yêu cầu kiểm tra chỉ số'} (${x.check.at})</b><small>${esc(x.check.done ? x.check.answer : x.check.text)}</small></span></div>` : ''}
        <div class="card dn-foot"><span class="row" style="gap:14px"><span class="mc-ic red sm">${ic('calendar-days')}</span><span><small>Hạn thanh toán</small><b style="color:var(--red)">${!inv ? 'Chưa phát hành' : inv.status === 'da-tt' ? 'Đã thanh toán' + (inv.paidAt ? ' ' + inv.paidAt.slice(0, 10) : '') : inv.due ? (x.issued ? 'Hạn thanh toán: ' : 'Trước ngày ') + inv.due : 'Chưa có hạn'}</b></span></span><i class="sep"></i>
          <button class="btn btn-red btn-lg" ${inv ? `data-go="sv-thanh-toan-${inv.id}"` : 'disabled'} style="flex:1">${ic('credit-card')}Xem hóa đơn</button><button class="btn btn-outline-red btn-lg" id="dn-check" ${entered && !(x.check && !x.check.done) ? '' : 'disabled'} style="flex:1">${ic('search')}Yêu cầu kiểm tra chỉ số</button></div>`);
    },
    mount: (root) => {
      const st = App.st.svdn; const u = K.me();
      const m = root.querySelector('#dn-m'); if (m) m.onchange = () => { st.month = m.value; App.refresh(); };
      root.querySelector('#dn-hist').onclick = () => App.modal({ title: 'Lịch sử điện nước phòng ' + (u.room || ''), wide: true, body: `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tháng</th><th class="c">Điện (kWh)</th><th class="c">Nước (m³)</th><th class="r">Tổng phòng</th><th class="r">Phần của bạn</th><th>Trạng thái</th></tr></thead><tbody>${MONTHS.map((mo) => { const x = (K.db.meters[mo] || {})[u.room] || {}; const us = use(x); const c = cost(x); const inv = K.db.invoices.find((v) => v.student === u.id && v.period === mo && !v.kind); return `<tr><td><b>${mo}</b></td><td class="c num">${us.e == null ? '-' : us.e}</td><td class="c num">${us.w == null ? '-' : us.w}</td><td class="r num">${us.e == null ? '-' : money(c.e + c.w)}</td><td class="r num">${us.e == null ? '-' : money(Math.round((c.e + c.w) / (K.occCount(u.room) || 1)))}</td><td>${inv ? App.statusBadge(App.invStatus(inv)) : x.issued ? badge('Đã thanh toán', 'green', { sm: true }) : badge('Chưa phát hành', 'gray', { sm: true })}</td></tr>`; }).join('')}</tbody></table></div>` });
      root.querySelectorAll('[data-ph]').forEach((b) => b.onclick = () => { const x = K.db.meters[st.month][u.room]; App.modal({ title: b.dataset.ph === 'E' ? 'Đồng hồ điện' : 'Đồng hồ nước', body: `<img src="${K.A(x['photo' + b.dataset.ph])}" style="width:100%;border-radius:12px" alt="">` }); });
      const ck = root.querySelector('#dn-check'); if (ck && !ck.disabled) ck.onclick = () => App.modal({ title: 'Yêu cầu kiểm tra chỉ số', body: `<div class="field"><span class="lbl">Chỉ số cần kiểm tra</span><div class="row" style="gap:20px">${['Điện', 'Nước', 'Cả hai'].map((t, i) => `<label class="radio"><input type="radio" name="ck-k" value="${t}" ${i === 2 ? 'checked' : ''}>${t}</label>`).join('')}</div></div><div class="field" style="margin-top:12px"><label for="ck-t">Nội dung</label><textarea id="ck-t" class="textarea" placeholder="Ví dụ: Chỉ số điện tháng này cao hơn bình thường dù phòng vắng 3 ngày."></textarea></div>`, foot: '<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Gửi yêu cầu</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => {
        const t = el.querySelector('#ck-t').value.trim(); if (t.length < 10) return App.toast('Nội dung cần tối thiểu 10 ký tự', 'err'); const k = el.querySelector('[name=ck-k]:checked').value;
        const x = K.db.meters[st.month][u.room]; x.check = { at: K.now(), by: u.id, text: '[' + k + '] ' + t, done: false };
        K.db.feedback.unshift({ id: 'PA-' + (K.db.feedback.length + 13), student: u.id, date: K.today(), title: 'Đề nghị kiểm tra chỉ số ' + k.toLowerCase() + ' phòng ' + u.room + ' tháng ' + st.month, type: 'Kiểm tra chỉ số', status: 'dang-tiep-nhan', body: t });
        K.save(); close(); App.toast('Đã gửi yêu cầu kiểm tra chỉ số tới Ban quản lý'); App.refresh();
      } });
    },
  };
})();
