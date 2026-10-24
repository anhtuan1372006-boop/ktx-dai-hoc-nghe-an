/* v4 \u2013 \u0110i\u1ec7n n\u01b0\u1edbc: ghi ch\u1ec9 s\u1ed1 (\u1ea3nh 2), ph\u00e2n b\u1ed5 ph\u00ed v\u00e0 ph\u00e1t h\u00e0nh h\u00f3a \u0111\u01a1n (\u1ea3nh 5), \u0111i\u1ec7n n\u01b0\u1edbc ph\u00f2ng c\u1ee7a t\u00f4i (\u1ea3nh 3, 12) */
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
  // tr\u1ea1ng th\u00e1i m\u1ed9t d\u00f2ng ch\u1ec9 s\u1ed1
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
  const ST = { 'hop-le': ['H\u1ee3p l\u1ec7', 'green', 'circle-check'], 'chua-nhap': ['Ch\u01b0a nh\u1eadp', 'orange', 'circle-alert'], loi: ['Ch\u1ec9 s\u1ed1 sai', 'red', 'circle-x'], 'bat-thuong': ['B\u1ea5t th\u01b0\u1eddng', 'orange', 'triangle-alert'], 'da-chot': ['\u0110\u00e3 ch\u1ed1t', 'blue', 'lock'], 'kiem-tra': ['C\u1ea7n ki\u1ec3m tra', 'red', 'search'] };
  const stBadge = (s) => `<span class="badge b-${ST[s][1]}">${ic(ST[s][2])}${ST[s][0]}</span>`;
  const cost = (r) => { const u = use(r); return { e: (u.e || 0) * K.db.prices.e, w: (u.w || 0) * K.db.prices.w }; };
  const slip = (m, code) => '\u0110N' + m.slice(0, 2) + m.slice(-2) + '-' + code;
  Object.assign(V4, { meterStatus: status, meterUse: use, meterCost: cost, prevMonth: prev, slip });

  // ---------- d\u1eef li\u1ec7u m\u1eabu ----------
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
    // t\u1ea7ng 3 th\u00e1ng 10: ch\u1ec9 A301, A302 \u0111\u00e3 ch\u1ed1t; c\u00e1c ph\u00f2ng kh\u00e1c h\u1ee3p l\u1ec7 nh\u01b0ng ch\u01b0a ch\u1ed1t
    K.db.rooms.filter((r) => r.khu === '3').forEach((r) => { if (!['A301', 'A302'].includes(r.code)) meters['10/2026'][r.code].locked = false; });
    meters['10/2026'].A303.locked = false;
    K.db.meters = meters;
  });

  // ============ Ban qu\u1ea3n l\u00fd: Ghi ch\u1ec9 s\u1ed1 \u0111i\u1ec7n n\u01b0\u1edbc (\u1ea3nh 2) ============
  P['ql-dien-nuoc'] = {
    role: 'admin', title: 'Ghi ch\u1ec9 s\u1ed1 \u0111i\u1ec7n n\u01b0\u1edbc',
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
      const header = `<div class="phead v4h"><img class="art" src="${K.A('bn_dien')}" alt=""><h1>Ghi ch\u1ec9 s\u1ed1 \u0111i\u1ec7n n\u01b0\u1edbc ${V4.demo}</h1><p class="desc">Ghi nh\u1eadn ch\u1ec9 s\u1ed1 \u0111\u1ecbnh k\u1ef3, ph\u1ee5c v\u1ee5 l\u1eadp h\u00f3a \u0111\u01a1n ti\u1ec1n \u0111i\u1ec7n, n\u01b0\u1edbc.</p></div>`;
      const stepper = `<div class="wz-tabs">${[['1', 'Ghi ch\u1ec9 s\u1ed1'], ['2', 'Ki\u1ec3m tra'], ['3', 'L\u1eadp h\u00f3a \u0111\u01a1n']].map(([n, t], i) => `<button class="wzt ${st.step === i + 1 ? 'on' : ''}" data-step="${i + 1}"><span>${n}</span>${t}</button>${i < 2 ? '<i></i>' : ''}`).join('')}</div>`;
      const filters = `<div class="gcs-filter"><div class="iwrap">${ic('calendar-days')}${sel('g-month', MONTHS.map((m) => [m, 'Th\u00e1ng ' + m]), st.month)}</div><div class="iwrap">${ic('building')}${sel('g-khu', App.khuOpts(), st.khu)}</div><div class="iwrap" style="flex:1;min-width:200px">${ic('search')}<input id="g-q" class="input" placeholder="T\u00ecm ph\u00f2ng (v\u00ed d\u1ee5: A301)..." value="${esc(st.q)}"></div><label class="btn btn-outline" style="position:relative">${ic('upload')}Nh\u1eadp Excel<input type="file" id="g-file" accept=".csv,.txt" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label><button class="btn btn-outline" id="g-tpl">${ic('file-text')}T\u1ea3i m\u1eabu</button></div>`;
      let main;
      if (st.step === 1) {
        main = `${filters}
          <div class="tbl-wrap gcs-wrap"><table class="tbl gcs"><thead><tr><th rowspan="2" class="c" style="width:44px"></th><th rowspan="2">Ph\u00f2ng</th><th colspan="3" class="c grp">\u0110i\u1ec7n (kWh)</th><th colspan="3" class="c grp">N\u01b0\u1edbc (m\u00b3)</th><th rowspan="2" class="c">Tr\u1ea1ng th\u00e1i</th><th rowspan="2" class="c">Minh ch\u1ee9ng</th></tr><tr><th class="c">C\u0169</th><th class="c">M\u1edbi</th><th class="c">D\u00f9ng</th><th class="c">C\u0169</th><th class="c">M\u1edbi</th><th class="c">D\u00f9ng</th></tr></thead><tbody>
            ${rooms.map((r) => { const x = rec(st.month, r.code); const u = use(x); const s = status(st.month, r.code); const lock = x.locked; return `<tr data-room="${r.code}" class="${r.code === st.sel ? 'sel' : ''}"><td class="c"><label class="check blue"><input type="checkbox" data-pick="${r.code}" ${r.code === st.sel ? 'checked' : ''}></label></td><td><b style="color:var(--navy)">${r.code}</b></td><td class="c num">${num(x.eo)}</td><td class="c">${lock ? `<span class="num ro-val">${num(x.en)}</span>` : `<input class="input mt" data-k="en" data-r="${r.code}" inputmode="numeric" value="${x.en == null ? '' : x.en}" placeholder="Nh\u1eadp ch\u1ec9 s\u1ed1">`}</td><td class="c num">${u.e == null ? '-' : u.e}</td><td class="c num">${num(x.wo)}</td><td class="c">${lock ? `<span class="num ro-val">${num(x.wn)}</span>` : `<input class="input mt" data-k="wn" data-r="${r.code}" inputmode="numeric" value="${x.wn == null ? '' : x.wn}" placeholder="Nh\u1eadp ch\u1ec9 s\u1ed1">`}</td><td class="c num">${u.w == null ? '-' : u.w}</td><td class="c">${stBadge(s)}</td><td class="c"><button class="xbtn cam ${x.photoE || x.photoW ? 'has' : ''}" data-ev="${r.code}" aria-label="Minh ch\u1ee9ng ph\u00f2ng ${r.code}">${ic('camera')}</button></td></tr>`; }).join('')}
          </tbody></table></div>
          ${missing.length ? `<div class="warn-bar">${ic('circle-alert')}<span><b>${missing.slice(0, 6).join(', ')}${missing.length > 6 ? '\u2026' : ''} ch\u01b0a c\u00f3 ch\u1ec9 s\u1ed1 m\u1edbi h\u1ee3p l\u1ec7.</b><small>Vui l\u00f2ng nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 ch\u1ec9 s\u1ed1 \u0111i\u1ec7n, n\u01b0\u1edbc cho t\u1ea5t c\u1ea3 c\u00e1c ph\u00f2ng tr\u01b0\u1edbc khi ch\u1ed1t.</small></span></div>` : unlocked.length ? `<div class="warn-bar ok">${ic('circle-check')}<span><b>\u0110\u00e3 nh\u1eadp \u0111\u1ee7 ch\u1ec9 s\u1ed1 t\u1ea7ng ${st.khu}.</b><small>B\u1ea5m \u201cKi\u1ec3m tra d\u1eef li\u1ec7u\u201d \u0111\u1ec3 r\u00e0 so\u00e1t r\u1ed3i ch\u1ed1t ch\u1ec9 s\u1ed1.</small></span></div>` : `<div class="warn-bar ok">${ic('lock')}<span><b>Ch\u1ec9 s\u1ed1 t\u1ea7ng ${st.khu} th\u00e1ng ${st.month} \u0111\u00e3 ch\u1ed1t.</b><small>Chuy\u1ec3n sang b\u01b0\u1edbc L\u1eadp h\u00f3a \u0111\u01a1n \u0111\u1ec3 ph\u00e2n b\u1ed5 ph\u00ed cho sinh vi\u00ean.</small></span></div>`}
          ${cur ? `<div class="ev-panel"><div class="card-h" style="margin-bottom:10px"><h3 class="card-t" style="font-size:18px">${ic('image')}Minh ch\u1ee9ng ph\u00f2ng ${st.sel}</h3><button class="xbtn" id="ev-close" aria-label="\u0110\u00f3ng">${ic('x')}</button></div>
            <div class="ev-row">${[['E', 'Ch\u1ec9 s\u1ed1 \u0111i\u1ec7n', cur.en, 'kWh'], ['W', 'Ch\u1ec9 s\u1ed1 n\u01b0\u1edbc', cur.wn, 'm\u00b3']].map(([k, t, v, u]) => cur['photo' + k] ? `<div class="ev-ph"><img src="${K.A(cur['photo' + k])}" alt=""><div><span>${t}: ${num(v)} ${u}</span><button class="xbtn" data-phdel="${k}" ${cur.locked ? 'disabled' : ''} aria-label="X\u00f3a \u1ea3nh">${ic('trash-2')}</button></div></div>` : `<label class="ev-ph empty">${ic('camera')}<span>\u1ea2nh ${t.toLowerCase()}</span><input type="file" accept="image/*" data-ph="${k}" ${cur.locked ? 'disabled' : ''}></label>`).join('')}
              <div class="ev-meta"><div class="field"><label for="ev-date">${ic('calendar-days')}Ng\u00e0y ch\u1ee5p</label><input id="ev-date" type="date" class="input" value="${V4.iso(cur.date || '31/10/2026')}" ${cur.locked ? 'disabled' : ''}></div><div class="field"><label for="ev-note">${ic('notebook-pen')}Ghi ch\u00fa (t\u00f9y ch\u1ecdn)</label><input id="ev-note" class="input" placeholder="Nh\u1eadp ghi ch\u00fa..." value="${esc(cur.note || '')}" ${cur.locked ? 'disabled' : ''}></div></div>
              <label class="ev-add">${ic('camera')}<b>Th\u00eam \u1ea3nh</b><small>JPG, PNG (t\u1ed1i \u0111a 5MB)</small><input type="file" accept="image/*" id="ev-add" ${cur.locked ? 'disabled' : ''}></label></div>
            ${cur.check && !cur.check.done ? `<div class="warn-bar" style="margin-top:12px">${ic('search')}<span><b>Sinh vi\u00ean \u0111\u1ec1 ngh\u1ecb ki\u1ec3m tra ch\u1ec9 s\u1ed1 (${cur.check.at})</b><small>${esc(cur.check.text)}</small></span><button class="btn btn-sm btn-red" id="ck-done">\u0110\u00e3 ki\u1ec3m tra</button></div>` : ''}</div>` : ''}`;
      } else {
        const rows = all.map((r) => { const x = rec(st.month, r.code); const u = use(x); const p = use(K.db.meters[prev(st.month)] && K.db.meters[prev(st.month)][r.code]); const s = status(st.month, r.code); const c = cost(x); return { r, x, u, p, s, c }; });
        const cnt = (k) => rows.filter((x) => (k === 'ok' ? ['hop-le', 'da-chot'].includes(x.s) : k === 'warn' ? ['bat-thuong', 'kiem-tra'].includes(x.s) : ['chua-nhap', 'loi'].includes(x.s))).length;
        const delta = (a, b) => (a == null || !b ? '-' : (a >= b ? '+' : '') + Math.round((a - b) * 100 / b) + '%');
        main = `<div class="grid g3" style="gap:12px">${[['ok', 'H\u1ee3p l\u1ec7', 'green', 'circle-check'], ['warn', 'C\u1ea7n xem l\u1ea1i', 'amber', 'triangle-alert'], ['err', 'Thi\u1ebfu / sai ch\u1ec9 s\u1ed1', 'red', 'circle-x']].map(([k, t, c, i]) => `<div class="stat"><span class="amen-ic ${c}">${ic(i)}</span><div><div class="lbl2">${t}</div><div class="val">${cnt(k)}</div></div></div>`).join('')}</div>
          <div class="tbl-wrap gcs-wrap"><table class="tbl"><thead><tr><th>Ph\u00f2ng</th><th class="c">\u0110i\u1ec7n d\u00f9ng</th><th class="c">So th\u00e1ng tr\u01b0\u1edbc</th><th class="c">N\u01b0\u1edbc d\u00f9ng</th><th class="c">So th\u00e1ng tr\u01b0\u1edbc</th><th class="r">Ti\u1ec1n \u0111i\u1ec7n n\u01b0\u1edbc</th><th class="c">Tr\u1ea1ng th\u00e1i</th></tr></thead><tbody>${rows.map(({ r, u, p, s, c }) => `<tr data-room="${r.code}" style="cursor:pointer"><td><b style="color:var(--navy)">${r.code}</b> <small class="muted">${K.occCount(r.code)}/${r.beds} SV</small></td><td class="c num">${u.e == null ? '-' : u.e + ' kWh'}</td><td class="c num ${/^\+[6-9]\d|^\+\d{3}/.test(delta(u.e, p.e)) ? 'bad' : ''}">${delta(u.e, p.e)}</td><td class="c num">${u.w == null ? '-' : u.w + ' m\u00b3'}</td><td class="c num">${delta(u.w, p.w)}</td><td class="r num">${u.e == null ? '-' : money(c.e + c.w)}</td><td class="c">${stBadge(s)}</td></tr>`).join('')}</tbody></table></div>`;
      }
      const canLock = !missing.length && unlocked.length;
      return V4.adminShell({ active: 'ql-dien-nuoc', search: 'T\u00ecm ki\u1ebfm sinh vi\u00ean, ph\u00f2ng, t\u1ea7ng...' }, `${header}
        <div class="card pad gcs-card">${stepper}${main}
          <div class="gcs-foot"><span class="muted row" style="gap:8px">${ic('info')}${st.step === 1 ? 'Ho\u00e0n t\u1ea5t c\u00e1c d\u00f2ng tr\u01b0\u1edbc khi ch\u1ed1t.' : 'R\u00e0 so\u00e1t m\u1ee9c t\u0103ng b\u1ea5t th\u01b0\u1eddng tr\u01b0\u1edbc khi ch\u1ed1t ch\u1ec9 s\u1ed1.'}</span><span style="flex:1"></span>
            ${st.step === 1 ? `<button class="btn btn-outline btn-lg" id="g-save">${ic('save')}L\u01b0u nh\u00e1p</button><button class="btn btn-red btn-lg" id="g-check">${ic('search')}Ki\u1ec3m tra d\u1eef li\u1ec7u</button>` : `<button class="btn btn-outline btn-lg" data-step="1">${ic('arrow-left')}Quay l\u1ea1i ghi ch\u1ec9 s\u1ed1</button>`}
            <button class="btn btn-lg ${canLock ? 'btn-red' : 'btn-disabled'}" id="g-lock" ${canLock ? '' : 'disabled'}>${ic('circle-check')}Ch\u1ed1t ch\u1ec9 s\u1ed1</button></div></div>`);
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
        if (v !== '' && !/^\d+$/.test(v)) { App.toast('Ch\u1ec9 s\u1ed1 ch\u1ec9 g\u1ed3m ch\u1eef s\u1ed1', 'err'); inp.value = x[inp.dataset.k] == null ? '' : x[inp.dataset.k]; return; }
        x[inp.dataset.k] = v === '' ? null : +v; K.save();
        const y = window.scrollY; App.refresh(); window.scrollTo(0, y);
      }));
      const tpl = root.querySelector('#g-tpl'); if (tpl) tpl.onclick = () => { const rows = K.db.rooms.filter((r) => r.khu === st.khu).map((r) => { const x = rec(st.month, r.code); return [r.code, x.en == null ? '' : x.en, x.wn == null ? '' : x.wn].join(','); }); const csv = 'phong,dien_moi,nuoc_moi\n' + rows.join('\n'); App.modal({ title: 'M\u1eabu nh\u1eadp ch\u1ec9 s\u1ed1 t\u1ea7ng ' + st.khu, body: `<p class="muted small" style="margin-bottom:8px">Sao ch\u00e9p n\u1ed9i dung d\u01b0\u1edbi \u0111\u00e2y, d\u00e1n v\u00e0o Excel, \u0111i\u1ec1n c\u1ed9t ch\u1ec9 s\u1ed1 m\u1edbi r\u1ed3i l\u01b0u th\u00e0nh t\u1ec7p CSV \u0111\u1ec3 nh\u1eadp l\u1ea1i.</p><textarea class="textarea" id="tpl-t" style="min-height:240px;font-family:monospace" readonly>${esc(csv)}</textarea>`, foot: `<button class="btn btn-red" data-copy>${ic('copy')}Sao ch\u00e9p</button>`, onMount: (el) => el.querySelector('[data-copy]').onclick = () => { const t = el.querySelector('#tpl-t'); t.select(); try { navigator.clipboard.writeText(csv).then(() => App.toast('\u0110\u00e3 sao ch\u00e9p m\u1eabu')).catch(() => App.toast('\u0110\u00e3 ch\u1ecdn n\u1ed9i dung, nh\u1ea5n Ctrl+C \u0111\u1ec3 sao ch\u00e9p')); } catch (e) { App.toast('\u0110\u00e3 ch\u1ecdn n\u1ed9i dung, nh\u1ea5n Ctrl+C \u0111\u1ec3 sao ch\u00e9p'); } } }); };
      const fi = root.querySelector('#g-file'); if (fi) fi.onchange = () => { const f = fi.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { let n = 0, bad = 0; String(rd.result).split(/\r?\n/).slice(1).forEach((l) => { const [code, en, wn] = l.split(/[,;\t]/).map((x) => (x || '').trim()); const r = K.room((code || '').toUpperCase()); if (!r) { if (code) bad++; return; } const x = rec(st.month, r.code); if (x.locked) return; if (/^\d+$/.test(en)) x.en = +en; if (/^\d+$/.test(wn)) x.wn = +wn; n++; }); K.save(); App.toast(n ? '\u0110\u00e3 nh\u1eadp ch\u1ec9 s\u1ed1 cho ' + n + ' ph\u00f2ng' + (bad ? ', b\u1ecf qua ' + bad + ' d\u00f2ng kh\u00f4ng h\u1ee3p l\u1ec7' : '') : 'Kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c d\u00f2ng h\u1ee3p l\u1ec7. \u0110\u1ecbnh d\u1ea1ng: phong,dien_moi,nuoc_moi', n ? 'ok' : 'err'); App.refresh(); }; rd.readAsText(f); };
      const cur = st.sel && rec(st.month, st.sel);
      const ec = root.querySelector('#ev-close'); if (ec) ec.onclick = () => { st.sel = null; App.refresh(); };
      const setPhoto = async (k, file) => { try { cur['photo' + k] = await V4.readImage(file, 700); K.save(); App.refresh(); } catch (e) { App.toast(e.message, 'err'); } };
      root.querySelectorAll('[data-ph]').forEach((i) => i.onchange = () => i.files[0] && setPhoto(i.dataset.ph, i.files[0]));
      const add = root.querySelector('#ev-add'); if (add) add.onchange = () => { if (!add.files[0]) return; setPhoto(!cur.photoE ? 'E' : !cur.photoW ? 'W' : 'E', add.files[0]); };
      root.querySelectorAll('[data-phdel]').forEach((b) => b.onclick = () => { delete cur['photo' + b.dataset.phdel]; K.save(); App.refresh(); });
      const ed = root.querySelector('#ev-date'); if (ed) ed.onchange = () => { cur.date = V4.dmy(ed.value); K.save(); };
      const en = root.querySelector('#ev-note'); if (en) en.onchange = () => { cur.note = en.value; K.save(); };
      const ck = root.querySelector('#ck-done'); if (ck) ck.onclick = () => App.modal({ title: 'K\u1ebft qu\u1ea3 ki\u1ec3m tra ch\u1ec9 s\u1ed1 ' + st.sel, body: `<div class="field"><label for="ck-t">N\u1ed9i dung tr\u1ea3 l\u1eddi sinh vi\u00ean</label><textarea id="ck-t" class="textarea">\u0110\u00e3 ki\u1ec3m tra l\u1ea1i \u0111\u1ed3ng h\u1ed3, ch\u1ec9 s\u1ed1 ghi nh\u1eadn ch\u00ednh x\u00e1c.</textarea></div>`, foot: '<button class="btn btn-red" data-ok>X\u00e1c nh\u1eadn</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const t = el.querySelector('#ck-t').value.trim(); cur.check.done = true; cur.check.answer = t; K.occupants(st.sel).forEach((s) => V4.notify(s.id, 'K\u1ebft qu\u1ea3 ki\u1ec3m tra ch\u1ec9 s\u1ed1 \u0111i\u1ec7n n\u01b0\u1edbc ph\u00f2ng ' + st.sel, t)); K.save(); close(); App.toast('\u0110\u00e3 ph\u1ea3n h\u1ed3i sinh vi\u00ean'); App.refresh(); } });
      const sv = root.querySelector('#g-save'); if (sv) sv.onclick = () => { K.save(); App.toast('\u0110\u00e3 l\u01b0u nh\u00e1p ch\u1ec9 s\u1ed1 th\u00e1ng ' + st.month); };
      const gc = root.querySelector('#g-check'); if (gc) gc.onclick = () => { st.step = 2; App.refresh(); };
      const lk = root.querySelector('#g-lock'); if (lk && !lk.disabled) lk.onclick = () => {
        const rooms = K.db.rooms.filter((r) => r.khu === st.khu && !rec(st.month, r.code).locked);
        const warn = rooms.filter((r) => ['bat-thuong', 'kiem-tra'].includes(status(st.month, r.code))).map((r) => r.code);
        App.confirm('Ch\u1ed1t ch\u1ec9 s\u1ed1 t\u1ea7ng ' + st.khu, `Ch\u1ed1t ch\u1ec9 s\u1ed1 th\u00e1ng ${st.month} cho <b>${rooms.length} ph\u00f2ng</b>. Sau khi ch\u1ed1t, ch\u1ec9 s\u1ed1 kh\u00f4ng s\u1eeda \u0111\u01b0\u1ee3c v\u00e0 c\u00f3 th\u1ec3 ph\u00e2n b\u1ed5 ph\u00ed cho sinh vi\u00ean.${warn.length ? `<br><span style="color:var(--orange)">L\u01b0u \u00fd: ${warn.join(', ')} c\u00f3 m\u1ee9c ti\u00eau th\u1ee5 b\u1ea5t th\u01b0\u1eddng ho\u1eb7c \u0111ang ch\u1edd ki\u1ec3m tra.</span>` : ''}`, 'Ch\u1ed1t ch\u1ec9 s\u1ed1', () => {
          rooms.forEach((r) => { rec(st.month, r.code).locked = true; });
          V4.log('Ch\u1ed1t ch\u1ec9 s\u1ed1', 'Ch\u1ed1t ch\u1ec9 s\u1ed1 \u0111i\u1ec7n n\u01b0\u1edbc th\u00e1ng ' + st.month + ' t\u1ea7ng ' + st.khu + ' (' + rooms.length + ' ph\u00f2ng)'); K.save(); st.step = 1; App.toast('\u0110\u00e3 ch\u1ed1t ch\u1ec9 s\u1ed1 ' + rooms.length + ' ph\u00f2ng. Ti\u1ebfp t\u1ee5c b\u01b0\u1edbc L\u1eadp h\u00f3a \u0111\u01a1n.'); App.refresh();
        });
      };
    },
  };

  // ---------- ph\u00e2n b\u1ed5 ----------
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

  // ============ Ban qu\u1ea3n l\u00fd: Ph\u00e2n b\u1ed5 ph\u00ed \u0111i\u1ec7n n\u01b0\u1edbc (\u1ea3nh 5) ============
  P['ql-phan-bo'] = {
    role: 'admin', title: 'Ph\u00e2n b\u1ed5 ph\u00ed \u0111i\u1ec7n n\u01b0\u1edbc',
    render: () => {
      const st = App.state('pb', { room: 'A302', month: '10/2026', method: 'deu', due: '2026-11-10', msg: '', notify: true });
      if (!K.room(st.room)) st.room = 'A302';
      const r = K.room(st.room); const x = rec(st.month, st.room); const u = use(x);
      const s = status(st.month, st.room);
      st.msg = st.msg || `Ti\u1ec1n \u0111i\u1ec7n n\u01b0\u1edbc ph\u00f2ng ${st.room} th\u00e1ng ${st.month}.\n\u0110\u1ec1 ngh\u1ecb sinh vi\u00ean thanh to\u00e1n \u0111\u00fang h\u1ea1n.`;
      const al = allocate(st.room, st.month, st.method);
      const acc = al.rows.filter((y) => y.s);
      const locked = x.locked; const issued = x.issued;
      const chip = issued ? `<span class="badge b-blue pill-lg">${ic('send')}\u0110\u00e3 ph\u00e1t h\u00e0nh ${issued.at}</span>` : locked ? `<span class="badge b-green pill-lg">${ic('circle-check')}Ch\u1ec9 s\u1ed1 \u0111\u00e3 ch\u1ed1t</span>` : `<span class="badge b-orange pill-lg">${ic('circle-alert')}${ST[s][0]}</span>`;
      const roomsOpt = K.db.rooms.map((y) => [y.code, y.code + ' \u00b7 T\u1ea7ng ' + y.khu]);
      return V4.adminShell({ active: 'ql-dien-nuoc', search: 'T\u00ecm ki\u1ebfm sinh vi\u00ean, ph\u00f2ng, h\u00f3a \u0111\u01a1n...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('bn_phanbo')}" alt=""><h1>Ph\u00e2n b\u1ed5 ph\u00ed \u0111i\u1ec7n n\u01b0\u1edbc ${V4.demo}</h1><p class="desc">T\u00ednh v\u00e0 ph\u00e2n b\u1ed5 chi ph\u00ed \u0111i\u1ec7n n\u01b0\u1edbc theo ph\u00f2ng, ph\u00e1t h\u00e0nh h\u00f3a \u0111\u01a1n cho sinh vi\u00ean.</p></div>
        <div class="grid resp-1" style="grid-template-columns:1fr 0.78fr;gap:16px;align-items:start">
          <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
            <div class="card pad"><h2 class="card-t" style="font-size:20px">${ic('file-text')}Th\u00f4ng tin ph\u00f2ng v\u00e0 k\u1ef3 t\u00ednh ph\u00ed</h2>
              <div class="grid g3" style="gap:14px;margin-top:12px"><div class="field"><label for="pb-room">Ph\u00f2ng</label><div class="iwrap">${ic('house')}${sel('pb-room', roomsOpt, st.room)}</div></div><div class="field"><label for="pb-month">Th\u00e1ng</label><div class="iwrap">${ic('calendar-days')}${sel('pb-month', MONTHS.map((m) => [m, 'Th\u00e1ng ' + m]), st.month)}</div></div><div class="field"><span class="lbl">Tr\u1ea1ng th\u00e1i ch\u1ec9 s\u1ed1</span><div class="status-chip">${chip}</div></div></div></div>
            <div class="card pad"><div class="card-h"><h2 class="card-t" style="font-size:20px">${ic('zap')}Ch\u1ec9 s\u1ed1 v\u00e0 chi ph\u00ed ph\u00f2ng ${st.room}</h2><button class="badge b-gray" id="pb-price" style="border:0;cursor:pointer">${ic('info')}\u0110\u01a1n gi\u00e1 minh h\u1ecda \u00b7 s\u1eeda</button></div>
              <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Lo\u1ea1i</th><th>Ch\u1ec9 s\u1ed1 ti\u00eau th\u1ee5</th><th>\u0110\u01a1n gi\u00e1 (\u0111\u01a1n v\u1ecb)</th><th class="r">Th\u00e0nh ti\u1ec1n</th></tr></thead><tbody>
                <tr><td><span class="row" style="gap:10px"><span style="color:var(--red)">${ic('zap')}</span><b>\u0110i\u1ec7n</b></span></td><td class="num">${u.e == null ? '-' : u.e + ' kWh'}</td><td class="num">${money(K.db.prices.e)} / kWh</td><td class="r num"><b>${money(al.c.e)}</b></td></tr>
                <tr><td><span class="row" style="gap:10px"><span style="color:var(--blue)">${ic('droplet')}</span><b>N\u01b0\u1edbc</b></span></td><td class="num">${u.w == null ? '-' : u.w + ' m\u00b3'}</td><td class="num">${money(K.db.prices.w)} / m\u00b3</td><td class="r num"><b>${money(al.c.w)}</b></td></tr>
                <tr class="sum"><td colspan="3"><b>T\u1ed5ng c\u1ed9ng</b></td><td class="r"><b style="color:var(--red);font-size:20px">${money(al.c.e + al.c.w)}</b></td></tr></tbody></table></div>
              <h2 class="card-t" style="font-size:19px;margin-top:18px">${ic('users')}Ph\u01b0\u01a1ng th\u1ee9c ph\u00e2n b\u1ed5 cho sinh vi\u00ean</h2>
              <div class="opt-cards two" style="margin-top:10px"><label class="opt"><input type="radio" name="pb-m" value="deu" ${st.method === 'deu' ? 'checked' : ''}><span><b>Chia \u0111\u1ec1u</b><small>Chia \u0111\u1ec1u t\u1ed5ng chi ph\u00ed cho t\u1ea5t c\u1ea3 sinh vi\u00ean trong ph\u00f2ng</small></span></label><label class="opt"><input type="radio" name="pb-m" value="ngay" ${st.method === 'ngay' ? 'checked' : ''}><span><b>Theo ng\u00e0y \u1edf</b><small>Ph\u00e2n b\u1ed5 theo s\u1ed1 ng\u00e0y th\u1ef1c t\u1ebf l\u01b0u tr\u00fa c\u1ee7a t\u1eebng sinh vi\u00ean</small></span></label></div>
              <div class="info-strip">${ic('info')}Ph\u00f2ng c\u00f3 ${al.n} sinh vi\u00ean${al.rows.every((y) => y.days === lastDay(st.month)) ? ' \u1edf tr\u1ecdn k\u1ef3' : ', c\u00f3 sinh vi\u00ean chuy\u1ec3n \u0111\u1ebfn trong th\u00e1ng'}, ${st.method === 'deu' ? 'chia \u0111\u1ec1u theo s\u1ed1 ng\u01b0\u1eddi' : 'chia theo s\u1ed1 ng\u00e0y \u1edf'}.</div>
              <h3 class="card-t" style="font-size:17px;margin-top:16px">${ic('calendar-days')}B\u1ea3ng ph\u00e2n b\u1ed5 chi ph\u00ed <small class="muted" style="font-weight:400">(${al.n} sinh vi\u00ean)</small></h3>
              <div class="tbl-wrap" style="margin-top:8px"><table class="tbl compact"><thead><tr><th class="c">STT</th><th>Sinh vi\u00ean</th><th>M\u00e3 sinh vi\u00ean</th>${st.method === 'ngay' ? '<th class="c">Ng\u00e0y \u1edf</th>' : ''}<th class="r">Ti\u1ec1n \u0111i\u1ec7n</th><th class="r">Ti\u1ec1n n\u01b0\u1edbc</th><th class="r">T\u1ed5ng c\u1ed9ng</th></tr></thead><tbody>${al.rows.map((y, i) => `<tr><td class="c">${i + 1}</td><td><b>${y.s ? esc(y.s.name) : 'Sinh vi\u00ean (ch\u01b0a c\u00f3 t\u00e0i kho\u1ea3n)'}</b></td><td>${y.s ? y.s.id : '\u2014'}</td>${st.method === 'ngay' ? `<td class="c num">${y.days}</td>` : ''}<td class="r num">${money(y.e)}</td><td class="r num">${money(y.w)}</td><td class="r num"><b>${money(y.e + y.w)}</b></td></tr>`).join('')}<tr class="sum"><td colspan="${st.method === 'ngay' ? 4 : 3}"><b>T\u1ed5ng c\u1ed9ng</b></td><td class="r num"><b>${money(al.c.e)}</b></td><td class="r num"><b>${money(al.c.w)}</b></td><td class="r"><b style="color:var(--red)">${money(al.c.e + al.c.w)}</b></td></tr></tbody></table></div></div></div>
          <div class="card pad"><h2 class="card-t" style="font-size:21px">${ic('file-text')}Xem tr\u01b0\u1edbc h\u00f3a \u0111\u01a1n</h2>
            <div class="inv-paper"><div class="row" style="justify-content:space-between;gap:8px"><span class="row" style="gap:10px"><img src="${K.A('logo')}" class="blend" style="width:54px" alt=""><span><b style="color:var(--navy);font-size:13px;display:block">\u0110\u1ea0I H\u1eccC NGH\u1ec6 AN</b><small style="color:var(--blue-700);font-size:11px">BAN QU\u1ea2N L\u00dd K\u00dd T\u00daC X\u00c1</small></span></span><span class="badge b-blue b-sm">${ic('info')}\u0110\u01a1n gi\u00e1 minh h\u1ecda</span></div>
              <h3 style="text-align:center;font-size:22px;margin-top:12px">H\u00d3A \u0110\u01a0N TI\u1ec0N \u0110I\u1ec6N N\u01af\u1edaC</h3><p style="text-align:center;color:var(--ink)">Ph\u00f2ng ${st.room} - Th\u00e1ng ${st.month}</p><p style="text-align:center" class="muted small">M\u00e3 h\u00f3a \u0111\u01a1n: ${slip(st.month, st.room)}</p>
              <div class="inv-lines"><div><span class="row" style="gap:10px"><span style="color:var(--red)">${ic('zap')}</span>Ti\u1ec1n \u0111i\u1ec7n (${u.e == null ? 0 : u.e} kWh)</span><b>${money(al.c.e)}</b></div><div><span class="row" style="gap:10px"><span style="color:var(--blue)">${ic('droplet')}</span>Ti\u1ec1n n\u01b0\u1edbc (${u.w == null ? 0 : u.w} m\u00b3)</span><b>${money(al.c.w)}</b></div></div>
              <div class="inv-total"><b>T\u1ed5ng c\u1ed9ng</b><b>${money(al.c.e + al.c.w)}</b></div>
              <div class="inv-sum"><span class="row">${ic('users')}<span><small>S\u1ed1 h\u00f3a \u0111\u01a1n c\u00e1 nh\u00e2n</small><b>${acc.length} h\u00f3a \u0111\u01a1n</b></span></span><span class="row">${ic('user-round')}<span><small>S\u1ed1 ti\u1ec1n m\u1ed7i sinh vi\u00ean</small><b>${st.method === 'deu' ? money(al.rows[0] ? al.rows[0].e + al.rows[0].w : 0) + ' / sinh vi\u00ean' : 'Theo ng\u00e0y \u1edf'}</b></span></span></div>
              <div class="field row-field"><label for="pb-due">${ic('calendar-days')}H\u1ea1n thanh to\u00e1n</label><input id="pb-due" type="date" class="input" value="${st.due}"></div>
              <div class="field" style="margin-top:10px"><label for="pb-msg">${ic('message-square-text')}N\u1ed9i dung th\u00f4ng b\u00e1o (hi\u1ec3n th\u1ecb trong h\u00f3a \u0111\u01a1n)</label><div style="position:relative"><textarea id="pb-msg" class="textarea" data-max="200" style="min-height:76px">${esc(st.msg)}</textarea><span class="counter">0/200</span></div></div>
              <label class="check" style="margin-top:10px;font-size:14px"><input type="checkbox" id="pb-notify" ${st.notify ? 'checked' : ''}>G\u1eedi th\u00f4ng b\u00e1o sau khi ph\u00e1t h\u00e0nh h\u00f3a \u0111\u01a1n cho sinh vi\u00ean</label>
              ${acc.length < al.n ? `<p class="small muted" style="margin-top:8px">${al.n - acc.length} sinh vi\u00ean ch\u01b0a c\u00f3 t\u00e0i kho\u1ea3n tr\u00ean h\u1ec7 th\u1ed1ng s\u1ebd thanh to\u00e1n t\u1ea1i qu\u1ea7y.</p>` : ''}
              <div class="grid g2" style="gap:10px;margin-top:14px"><button class="btn btn-outline btn-lg" id="pb-draft">${ic('save')}L\u01b0u b\u1ea3n nh\u00e1p</button><button class="btn btn-lg ${locked ? 'btn-red' : 'btn-disabled'}" id="pb-issue" ${locked ? '' : 'disabled'}>${ic('send')}${issued ? 'Ph\u00e1t h\u00e0nh l\u1ea1i' : 'Ph\u00e1t h\u00e0nh h\u00f3a \u0111\u01a1n'}</button></div>
              ${!locked ? `<p class="small" style="color:var(--orange);margin-top:8px">Ch\u1ec9 s\u1ed1 ph\u00f2ng ${st.room} ch\u01b0a ch\u1ed1t. <a href="#" data-go="ql-dien-nuoc">\u0110i t\u1edbi ghi ch\u1ec9 s\u1ed1</a></p>` : ''}</div></div></div>`);
    },
    mount: (root) => {
      const st = App.st.pb;
      const keep = () => { st.due = root.querySelector('#pb-due').value; st.msg = root.querySelector('#pb-msg').value; st.notify = root.querySelector('#pb-notify').checked; };
      root.querySelector('#pb-room').onchange = (e) => { keep(); st.room = e.target.value; st.msg = ''; App.refresh(); };
      root.querySelector('#pb-month').onchange = (e) => { keep(); st.month = e.target.value; st.msg = ''; App.refresh(); };
      root.querySelectorAll('[name=pb-m]').forEach((r) => r.onchange = () => { keep(); st.method = r.value; App.refresh(); });
      root.querySelector('#pb-price').onclick = () => App.modal({ title: '\u0110\u01a1n gi\u00e1 \u0111i\u1ec7n n\u01b0\u1edbc', body: `<div class="grid g2" style="gap:14px"><div class="field"><label for="pp-e">Gi\u00e1 \u0111i\u1ec7n (\u0111/kWh)</label><input id="pp-e" type="number" step="100" class="input" value="${K.db.prices.e}"></div><div class="field"><label for="pp-w">Gi\u00e1 n\u01b0\u1edbc (\u0111/m\u00b3)</label><input id="pp-w" type="number" step="500" class="input" value="${K.db.prices.w}"></div></div><p class="muted small" style="margin-top:10px">Ch\u1ec9 \u00e1p d\u1ee5ng cho c\u00e1c h\u00f3a \u0111\u01a1n ph\u00e1t h\u00e0nh sau khi l\u01b0u.</p>`, foot: '<button class="btn btn-outline" data-x>H\u1ee7y</button><button class="btn btn-red" data-ok>L\u01b0u \u0111\u01a1n gi\u00e1</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const e = +el.querySelector('#pp-e').value, w = +el.querySelector('#pp-w').value; if (!(e > 0 && w > 0)) return App.toast('\u0110\u01a1n gi\u00e1 ph\u1ea3i l\u1edbn h\u01a1n 0', 'err'); K.db.prices = { e, w }; V4.log('C\u1eadp nh\u1eadt \u0111\u01a1n gi\u00e1', '\u0110\u01a1n gi\u00e1 \u0111i\u1ec7n ' + money(e) + '/kWh, n\u01b0\u1edbc ' + money(w) + '/m\u00b3'); K.save(); close(); App.toast('\u0110\u00e3 l\u01b0u \u0111\u01a1n gi\u00e1'); App.refresh(); } });
      root.querySelector('#pb-draft').onclick = () => { keep(); K.save(); App.toast('\u0110\u00e3 l\u01b0u b\u1ea3n nh\u00e1p ph\u00e2n b\u1ed5 ph\u00f2ng ' + st.room); };
      const is = root.querySelector('#pb-issue');
      if (is && !is.disabled) is.onclick = () => {
        keep(); if (!st.due) return App.toast('Ch\u1ecdn h\u1ea1n thanh to\u00e1n', 'err');
        const al = allocate(st.room, st.month, st.method); const x = rec(st.month, st.room); const r = K.room(st.room); const u = use(x); const due = V4.dmy(st.due);
        App.confirm('Ph\u00e1t h\u00e0nh h\u00f3a \u0111\u01a1n', `Ph\u00e1t h\u00e0nh ti\u1ec1n \u0111i\u1ec7n n\u01b0\u1edbc ph\u00f2ng <b>${st.room}</b> th\u00e1ng ${st.month}: t\u1ed5ng <b>${money(al.c.e + al.c.w)}</b> cho ${al.rows.filter((y) => y.s).length} sinh vi\u00ean, h\u1ea1n thanh to\u00e1n <b>${due}</b>.`, 'Ph\u00e1t h\u00e0nh', () => {
          let upd = 0, created = 0, same = 0;
          al.rows.filter((y) => y.s).forEach((y, i) => {
            const items = [{ name: 'Ti\u1ec1n \u0111i\u1ec7n (' + u.e + ' kWh' + (st.method === 'ngay' ? ', ' + y.days + ' ng\u00e0y \u1edf' : ' / ' + al.n + ' ng\u01b0\u1eddi') + ')', amount: y.e }, { name: 'Ti\u1ec1n n\u01b0\u1edbc (' + u.w + ' m\u00b3' + (st.method === 'ngay' ? ', ' + y.days + ' ng\u00e0y \u1edf' : ' / ' + al.n + ' ng\u01b0\u1eddi') + ')', amount: y.w }];
            const inv = K.db.invoices.find((v) => v.student === y.s.id && v.period === st.month && !v.kind);
            if (inv && inv.status === 'chua-tt' && !inv.recv) { inv.items = [inv.items[0]].concat(items); inv.total = inv.items.reduce((a, b) => a + b.amount, 0); inv.due = due; inv.slip = slip(st.month, st.room); upd++; }
            else {
              // h\u00f3a \u0111\u01a1n th\u00e1ng \u0111\u00e3 thanh to\u00e1n / \u0111ang \u0111\u1ed1i so\u00e1t: ch\u1ec9 thu ph\u1ea7n ch\u00eanh l\u1ec7ch so v\u1edbi \u0111i\u1ec7n n\u01b0\u1edbc \u0111\u00e3 t\u00ednh
              const billed = inv ? inv.items.filter((x) => /\u0111i\u1ec7n|n\u01b0\u1edbc/i.test(x.name)).reduce((a2, x) => a2 + x.amount, 0) : 0;
              const diff = y.e + y.w - billed; const id = slip(st.month, st.room) + '-' + V4.pad(i + 1);
              K.db.invoices = K.db.invoices.filter((v) => v.id !== id || v.status !== 'chua-tt');
              if (diff > 0 && !K.db.invoices.find((v) => v.id === id)) { K.db.invoices.unshift({ id, kind: 'dien-nuoc', label: inv ? 'Ti\u1ec1n \u0111i\u1ec7n n\u01b0\u1edbc ch\u00eanh l\u1ec7ch th\u00e1ng ' + st.month : 'Ti\u1ec1n \u0111i\u1ec7n n\u01b0\u1edbc th\u00e1ng ' + st.month, student: y.s.id, period: st.month, room: st.room, khu: r.khu, items: inv ? [{ name: 'Ch\u00eanh l\u1ec7ch \u0111i\u1ec7n n\u01b0\u1edbc th\u1ef1c t\u1ebf so v\u1edbi \u0111\u1ecbnh m\u1ee9c \u0111\u00e3 thu', amount: diff }] : items, total: diff, status: 'chua-tt', due, slip: slip(st.month, st.room) }); created++; }
              else same++;
            }
            if (st.notify) V4.notify(y.s.id, 'H\u00f3a \u0111\u01a1n ti\u1ec1n \u0111i\u1ec7n n\u01b0\u1edbc ph\u00f2ng ' + st.room + ' th\u00e1ng ' + st.month, st.msg + '\nPh\u1ea7n c\u1ee7a b\u1ea1n: ' + money(y.e + y.w) + '. H\u1ea1n thanh to\u00e1n: ' + due + '.');
          });
          x.issued = { at: K.today(), due, method: st.method };
          V4.log('Ph\u00e1t h\u00e0nh h\u00f3a \u0111\u01a1n', 'Ph\u00e1t h\u00e0nh ti\u1ec1n \u0111i\u1ec7n n\u01b0\u1edbc ph\u00f2ng ' + st.room + ' th\u00e1ng ' + st.month); K.save();
          App.toast('\u0110\u00e3 ph\u00e1t h\u00e0nh: c\u1eadp nh\u1eadt ' + upd + ', t\u1ea1o m\u1edbi ' + created + ' h\u00f3a \u0111\u01a1n' + (same ? ', ' + same + ' sinh vi\u00ean kh\u00f4ng ph\u00e1t sinh ch\u00eanh l\u1ec7ch' : '') + '. H\u1ea1n thanh to\u00e1n ' + due + '.'); App.refresh();
        });
      };
    },
  };

  // ============ Sinh vi\u00ean: \u0110i\u1ec7n n\u01b0\u1edbc ph\u00f2ng c\u1ee7a t\u00f4i (\u1ea3nh 3, 12) ============
  P['sv-dien-nuoc'] = {
    role: 'student', title: '\u0110i\u1ec7n n\u01b0\u1edbc ph\u00f2ng c\u1ee7a t\u00f4i',
    render: () => {
      const u = K.me(); const st = App.state('svdn', { month: '10/2026' });
      const head = (sub) => `<div class="row dn-head" style="justify-content:space-between;flex-wrap:wrap;gap:14px"><div><h1 class="v4-title">\u0110i\u1ec7n n\u01b0\u1edbc ph\u00f2ng c\u1ee7a t\u00f4i ${V4.demo}</h1><p class="dn-sub">${sub}</p></div><div class="row" style="gap:12px"><div class="iwrap" style="width:230px">${ic('calendar-days')}${sel('dn-m', MONTHS.map((m) => [m, 'Th\u00e1ng ' + m]), st.month, '', 'style="height:52px;font-size:17px"')}</div><button class="btn btn-outline btn-lg" id="dn-hist">${ic('clock')}Xem l\u1ecbch s\u1eed</button></div></div>`;
      if (!u.room) return V4.svShell({ active: 'sv-dien-nuoc', search: 'T\u00ecm ki\u1ebfm th\u00f4ng b\u00e1o, d\u1ecbch v\u1ee5, h\u01b0\u1edbng d\u1eabn...' }, `${head('B\u1ea1n ch\u01b0a c\u00f3 ph\u00f2ng \u1edf k\u00fd t\u00fac x\u00e1')}<div class="card pad empty"><p>Th\u00f4ng tin \u0111i\u1ec7n n\u01b0\u1edbc s\u1ebd hi\u1ec3n th\u1ecb khi b\u1ea1n \u0111\u01b0\u1ee3c x\u1ebfp ph\u00f2ng.</p></div>`);
      const r = K.room(u.room); const x = (K.db.meters[st.month] || {})[u.room] || {}; const us = use(x); const c = cost(x);
      const entered = us.e != null && us.w != null;
      const invDN = K.db.invoices.find((v) => v.student === u.id && v.period === st.month && v.kind === 'dien-nuoc' && v.status !== 'da-tt');
      const inv = invDN || K.db.invoices.find((v) => v.student === u.id && v.period === st.month && !v.kind) || K.db.invoices.find((v) => v.student === u.id && v.period === st.month && v.kind === 'dien-nuoc');
      const monthly = K.db.invoices.find((v) => v.student === u.id && v.period === st.month && !v.kind);
      const billedOf = (v) => (v ? v.items.filter((i) => /\u0111i\u1ec7n|n\u01b0\u1edbc/i.test(i.name)).reduce((a, b) => a + b.amount, 0) : 0);
      const share = monthly || invDN ? billedOf(monthly) + (invDN && monthly ? invDN.total : billedOf(invDN)) : Math.round((c.e + c.w) / (K.occCount(u.room) || 1));
      const payBadge = !inv ? `<span class="badge b-gray">${ic('clock')}Ch\u01b0a ph\u00e1t h\u00e0nh</span>` : inv.status === 'da-tt' ? `<span class="badge b-green">${ic('circle-check')}\u0110\u00e3 thanh to\u00e1n</span>` : App.invStatus(inv) === 'cho-doi-soat' ? `<span class="badge b-orange">${ic('clock')}Ch\u1edd \u0111\u1ed1i so\u00e1t</span>` : `<span class="badge b-orange">${ic('circle-alert')}Ch\u01b0a thanh to\u00e1n</span>`;
      const meterCard = (kind) => { const e = kind === 'e'; const [ico, t, d, o, n, us2, unit, price, money2] = e ? ['zap', '\u0110i\u1ec7n', 'S\u1eed d\u1ee5ng an to\u00e0n, ti\u1ebft ki\u1ec7m \u0111i\u1ec7n', x.eo, x.en, us.e, 'kWh', K.db.prices.e, c.e] : ['droplet', 'N\u01b0\u1edbc', 'S\u1eed d\u1ee5ng n\u01b0\u1edbc h\u1ee3p l\u00fd, b\u1ea3o v\u1ec7 m\u00f4i tr\u01b0\u1eddng', x.wo, x.wn, us.w, 'm\u00b3', K.db.prices.w, c.w];
        return `<div class="card pad mcard"><div class="row" style="gap:16px"><span class="mc-ic ${e ? 'red' : 'blue'}">${ic(ico)}</span><span><b>${t}</b><small>${d}</small></span></div>
          <div class="mc-rows"><div>${ic('gauge')}<span>Ch\u1ec9 s\u1ed1 \u0111\u1ea7u k\u1ef3</span><b>${num(o)}</b><i>${unit}</i></div><div>${ic('gauge')}<span>Ch\u1ec9 s\u1ed1 cu\u1ed1i k\u1ef3</span><b>${num(n)}</b><i>${unit}</i></div><div>${ic('clock')}<span>Ti\u00eau th\u1ee5 trong th\u00e1ng</span><b>${us2 == null ? '-' : us2}</b><i>${unit}</i></div><div>${ic('tag')}<span>\u0110\u01a1n gi\u00e1 m\u1eabu</span><b>${money(price)}/${unit}</b><i></i></div></div>
          <div class="mc-total"><b>Th\u00e0nh ti\u1ec1n</b><strong>${entered ? money(money2) : '-'}</strong></div></div>`; };
      const ph = (k, t, icn, col) => `<div class="mph"><span class="row" style="gap:8px;font-weight:600;color:var(--navy)"><span style="color:${col}">${ic(icn)}</span>${t}</span>${x['photo' + k] ? `<img src="${K.A(x['photo' + k])}" alt="${t}">` : `<div class="mph-empty">${ic('image-off')}<small>Ch\u01b0a c\u00f3 \u1ea3nh</small></div>`}<button class="btn btn-soft btn-sm btn-block" data-ph="${k}" ${x['photo' + k] ? '' : 'disabled'}>${ic('eye')}Xem \u1ea3nh</button><small class="muted">Ng\u00e0y ghi: ${x.date || '\u2014'}</small></div>`;
      return V4.svShell({ active: 'sv-dien-nuoc', search: 'T\u00ecm ki\u1ebfm th\u00f4ng b\u00e1o, d\u1ecbch v\u1ee5, h\u01b0\u1edbng d\u1eabn...' }, `${head(`${u.room} \u00b7 T\u1ea7ng ${r.khu} \u00b7 Th\u00e1ng ${st.month}`)}
        ${entered ? '' : `<div class="warn-bar">${ic('clock')}<span><b>Ch\u01b0a c\u00f3 ch\u1ec9 s\u1ed1 th\u00e1ng ${st.month}</b><small>Ban qu\u1ea3n l\u00fd s\u1ebd ghi ch\u1ec9 s\u1ed1 v\u00e0o cu\u1ed1i th\u00e1ng. S\u1ed1 li\u1ec7u d\u01b0\u1edbi \u0111\u00e2y s\u1ebd \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt sau \u0111\u00f3.</small></span></div>`}
        <div class="grid g2" style="gap:16px">${meterCard('e')}${meterCard('w')}</div>
        <div class="grid resp-1" style="grid-template-columns:1.12fr 1fr;gap:16px;align-items:stretch">
          <div class="card pad"><h2 class="card-t" style="font-size:21px">${ic('users')}Ph\u00e2n b\u1ed5 chi ph\u00ed \u0111i\u1ec7n n\u01b0\u1edbc c\u1ee7a ph\u00f2ng</h2>
            <div class="alloc"><img src="${K.A('group4')}" alt=""><div><div class="al-row"><span>T\u1ed5ng \u0111i\u1ec7n n\u01b0\u1edbc c\u1ea3 ph\u00f2ng</span><b>${entered ? money(c.e + c.w) : '-'}</b></div><div class="al-row"><span>Chia ${x.issued && x.issued.method === 'ngay' ? 'theo ng\u00e0y \u1edf cho' : '\u0111\u1ec1u cho'}</span><b>${K.occCount(u.room)} sinh vi\u00ean</b></div>
              <div class="al-mine"><small>Ph\u1ea7n c\u1ee7a b\u1ea1n${x.issued ? '' : ' (t\u1ea1m t\u00ednh)'}</small><div class="row" style="justify-content:space-between;gap:8px;flex-wrap:wrap"><strong>${entered ? money(share) : '-'}</strong>${payBadge}</div></div></div></div></div>
          <div class="card pad"><h2 class="card-t" style="font-size:21px">${ic('image')}\u1ea2nh \u0111\u1ed3ng h\u1ed3</h2><div class="mph-grid">${ph('E', '\u0110\u1ed3ng h\u1ed3 \u0111i\u1ec7n', 'zap', 'var(--blue)')}${ph('W', '\u0110\u1ed3ng h\u1ed3 n\u01b0\u1edbc', 'droplet', 'var(--red)')}</div><div class="slip">${ic('file-text')}M\u00e3 phi\u1ebfu: ${V4.slip(st.month, u.room)}</div></div></div>
        ${x.check ? `<div class="warn-bar ${x.check.done ? 'ok' : ''}">${ic(x.check.done ? 'circle-check' : 'search')}<span><b>${x.check.done ? 'Ban qu\u1ea3n l\u00fd \u0111\u00e3 ki\u1ec3m tra ch\u1ec9 s\u1ed1' : '\u0110\u00e3 g\u1eedi y\u00eau c\u1ea7u ki\u1ec3m tra ch\u1ec9 s\u1ed1'} (${x.check.at})</b><small>${esc(x.check.done ? x.check.answer : x.check.text)}</small></span></div>` : ''}
        <div class="card dn-foot"><span class="row" style="gap:14px"><span class="mc-ic red sm">${ic('calendar-days')}</span><span><small>H\u1ea1n thanh to\u00e1n</small><b style="color:var(--red)">${!inv ? 'Ch\u01b0a ph\u00e1t h\u00e0nh' : inv.status === 'da-tt' ? '\u0110\u00e3 thanh to\u00e1n' + (inv.paidAt ? ' ' + inv.paidAt.slice(0, 10) : '') : inv.due ? (x.issued ? 'H\u1ea1n thanh to\u00e1n: ' : 'Tr\u01b0\u1edbc ng\u00e0y ') + inv.due : 'Ch\u01b0a c\u00f3 h\u1ea1n'}</b></span></span><i class="sep"></i>
          <button class="btn btn-red btn-lg" ${inv ? `data-go="sv-thanh-toan-${inv.id}"` : 'disabled'} style="flex:1">${ic('credit-card')}Xem h\u00f3a \u0111\u01a1n</button><button class="btn btn-outline-red btn-lg" id="dn-check" ${entered && !(x.check && !x.check.done) ? '' : 'disabled'} style="flex:1">${ic('search')}Y\u00eau c\u1ea7u ki\u1ec3m tra ch\u1ec9 s\u1ed1</button></div>`);
    },
    mount: (root) => {
      const st = App.st.svdn; const u = K.me();
      const m = root.querySelector('#dn-m'); if (m) m.onchange = () => { st.month = m.value; App.refresh(); };
      root.querySelector('#dn-hist').onclick = () => App.modal({ title: 'L\u1ecbch s\u1eed \u0111i\u1ec7n n\u01b0\u1edbc ph\u00f2ng ' + (u.room || ''), wide: true, body: `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Th\u00e1ng</th><th class="c">\u0110i\u1ec7n (kWh)</th><th class="c">N\u01b0\u1edbc (m\u00b3)</th><th class="r">T\u1ed5ng ph\u00f2ng</th><th class="r">Ph\u1ea7n c\u1ee7a b\u1ea1n</th><th>Tr\u1ea1ng th\u00e1i</th></tr></thead><tbody>${MONTHS.map((mo) => { const x = (K.db.meters[mo] || {})[u.room] || {}; const us = use(x); const c = cost(x); const inv = K.db.invoices.find((v) => v.student === u.id && v.period === mo && !v.kind); return `<tr><td><b>${mo}</b></td><td class="c num">${us.e == null ? '-' : us.e}</td><td class="c num">${us.w == null ? '-' : us.w}</td><td class="r num">${us.e == null ? '-' : money(c.e + c.w)}</td><td class="r num">${us.e == null ? '-' : money(Math.round((c.e + c.w) / (K.occCount(u.room) || 1)))}</td><td>${inv ? App.statusBadge(App.invStatus(inv)) : x.issued ? badge('\u0110\u00e3 thanh to\u00e1n', 'green', { sm: true }) : badge('Ch\u01b0a ph\u00e1t h\u00e0nh', 'gray', { sm: true })}</td></tr>`; }).join('')}</tbody></table></div>` });
      root.querySelectorAll('[data-ph]').forEach((b) => b.onclick = () => { const x = K.db.meters[st.month][u.room]; App.modal({ title: b.dataset.ph === 'E' ? '\u0110\u1ed3ng h\u1ed3 \u0111i\u1ec7n' : '\u0110\u1ed3ng h\u1ed3 n\u01b0\u1edbc', body: `<img src="${K.A(x['photo' + b.dataset.ph])}" style="width:100%;border-radius:12px" alt="">` }); });
      const ck = root.querySelector('#dn-check'); if (ck && !ck.disabled) ck.onclick = () => App.modal({ title: 'Y\u00eau c\u1ea7u ki\u1ec3m tra ch\u1ec9 s\u1ed1', body: `<div class="field"><span class="lbl">Ch\u1ec9 s\u1ed1 c\u1ea7n ki\u1ec3m tra</span><div class="row" style="gap:20px">${['\u0110i\u1ec7n', 'N\u01b0\u1edbc', 'C\u1ea3 hai'].map((t, i) => `<label class="radio"><input type="radio" name="ck-k" value="${t}" ${i === 2 ? 'checked' : ''}>${t}</label>`).join('')}</div></div><div class="field" style="margin-top:12px"><label for="ck-t">N\u1ed9i dung</label><textarea id="ck-t" class="textarea" placeholder="V\u00ed d\u1ee5: Ch\u1ec9 s\u1ed1 \u0111i\u1ec7n th\u00e1ng n\u00e0y cao h\u01a1n b\u00ecnh th\u01b0\u1eddng d\u00f9 ph\u00f2ng v\u1eafng 3 ng\u00e0y."></textarea></div>`, foot: '<button class="btn btn-outline" data-x>H\u1ee7y</button><button class="btn btn-red" data-ok>G\u1eedi y\u00eau c\u1ea7u</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => {
        const t = el.querySelector('#ck-t').value.trim(); if (t.length < 10) return App.toast('N\u1ed9i dung c\u1ea7n t\u1ed1i thi\u1ec3u 10 k\u00fd t\u1ef1', 'err'); const k = el.querySelector('[name=ck-k]:checked').value;
        const x = K.db.meters[st.month][u.room]; x.check = { at: K.now(), by: u.id, text: '[' + k + '] ' + t, done: false };
        K.db.feedback.unshift({ id: 'PA-' + (K.db.feedback.length + 13), student: u.id, date: K.today(), title: '\u0110\u1ec1 ngh\u1ecb ki\u1ec3m tra ch\u1ec9 s\u1ed1 ' + k.toLowerCase() + ' ph\u00f2ng ' + u.room + ' th\u00e1ng ' + st.month, type: 'Ki\u1ec3m tra ch\u1ec9 s\u1ed1', status: 'dang-tiep-nhan', body: t });
        K.save(); close(); App.toast('\u0110\u00e3 g\u1eedi y\u00eau c\u1ea7u ki\u1ec3m tra ch\u1ec9 s\u1ed1 t\u1edbi Ban qu\u1ea3n l\u00fd'); App.refresh();
      } });
    },
  };
})();
