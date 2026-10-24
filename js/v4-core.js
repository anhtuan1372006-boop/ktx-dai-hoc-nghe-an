/* v4 \u2013 L\u00f5i: d\u1eef li\u1ec7u b\u1ed5 sung, menu m\u1edbi, ti\u1ec7n \u00edch chung, n\u1ed9i quy \u2013 vi ph\u1ea1m \u2013 gi\u1ea3i tr\u00ecnh (\u1ea3nh b\u1ed5 sung 1, 4, 6, 14) */
(function () {
  const K = window.KTX, { esc, ic, im, av, badge, sel } = App;
  const P = App.pages;
  const b2 = K.pad2, money = K.money;
  const V4 = (App.v4 = {});

  // ---------- ti\u1ec7n \u00edch ----------
  const pad = (n) => String(n).padStart(2, '0');
  const dmy = (iso) => (iso ? iso.split('-').reverse().join('/') : '');
  const iso = (d) => (d ? d.slice(0, 10).split('/').reverse().join('-') : '');
  const todayIso = () => { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const demo = `<span class="badge b-blue demo-tag">${ic('info')}D\u1eef li\u1ec7u minh h\u1ecda</span>`;
  const sname = (sid) => (K.student(sid) || { name: sid }).name;
  const notify = (sid, title, body) => K.db.notifications.unshift({ id: 'N' + Date.now() + Math.random().toString(36).slice(2, 5), to: sid, title, summary: body.slice(0, 90), cat: 'L\u01b0u tr\u00fa', icon: 'ni_doc', time: 'V\u1eeba xong', author: 'Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', month: 'Th\u00e1ng 10/2026', read: false, body: body.split('\n') });
  const log = (act, text, icon) => { K.db.activity.unshift({ at: K.now(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', av: 'av_admin', act, icon: icon || 'doc', text }); K.db.sysLog.unshift({ at: K.now(), by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', t: text }); };
  const nextId = (arr, pre, w) => pre + String(Math.max(0, ...arr.map((x) => +String(x.id).replace(/\D/g, '').slice(-(w || 3)) || 0)) + 1).padStart(w || 3, '0');
  const mask = (p) => '*** *** **' + String(p || '').replace(/\D/g, '').slice(-2);
  const readImage = (file, max) => new Promise((res, rej) => {
    if (!file || !/^image\//.test(file.type)) return rej(new Error('T\u1ec7p kh\u00f4ng ph\u1ea3i \u1ea3nh'));
    if (file.size > 5 * 1024 * 1024) return rej(new Error('\u1ea2nh c\u1ea7n nh\u1ecf h\u01a1n 5MB'));
    const rd = new FileReader();
    rd.onload = () => { const img = new Image(); img.onload = () => { const s = Math.min(1, (max || 900) / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.8)); }; img.onerror = () => rej(new Error('Kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c \u1ea3nh')); img.src = rd.result; };
    rd.readAsDataURL(file);
  });
  const fileSize = (n) => (n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');
  // thanh b\u01b0\u1edbc ngang: steps [[ti\u00eau \u0111\u1ec1, ph\u1ee5 \u0111\u1ec1]], cur (1-based), done < cur
  const steps = (list, cur, cls) => `<div class="wz ${cls || ''}">${list.map(([t, s], i) => { const n = i + 1; const stt = n < cur ? 'done' : n === cur ? 'cur' : ''; return `<div class="wz-i ${stt}"><span class="wz-n">${n < cur ? ic('check') : n}</span><span class="wz-t"><b>${t}</b>${s ? `<small>${s}</small>` : ''}</span></div>${i < list.length - 1 ? '<i class="wz-ln"></i>' : ''}`; }).join('')}</div>`;
  // d\u00f2ng th\u1eddi gian d\u1ecdc: [{t, d, s, st:'done'|'cur'|'todo'}]
  const vline = (items, wide) => `<div class="vt ${wide ? 'wide' : ''}">${items.map((x) => `<div class="vt-i ${x.st}"><span class="vt-dot">${x.st === 'done' ? ic('check') : ''}</span><div class="vt-b"><div class="vt-h"><b>${x.t}</b>${x.d ? `<small>${x.d}</small>` : ''}</div>${x.s ? `<p>${x.s}</p>` : ''}</div></div>`).join('')}</div>`;
  const stayNav = (active) => `<div class="seg stay-nav">${[['sv-ho-so', 'H\u1ed3 s\u01a1', 'file-text'], ['sv-gia-han', 'Gia h\u1ea1n', 'calendar-plus'], ['sv-tra-phong', 'Tr\u1ea3 ph\u00f2ng', 'luggage'], ['sv-tam-vang', 'T\u1ea1m v\u1eafng', 'plane-takeoff']].map(([g, t, i]) => `<button class="pill ${g === active ? 'on' : ''}" ${g === active ? '' : `data-go="${g}"`}>${ic(i)}${t}</button>`).join('')}</div>`;
  Object.assign(V4, { pad, dmy, iso, todayIso, demo, sname, notify, log, nextId, mask, readImage, fileSize, steps, vline, stayNav });

  // ---------- menu m\u1edbi ----------
  App.SV_NAV = [['sv-tong-quan', 'T\u1ed5ng quan', 'house'], ['sv-phong', 'Ph\u00f2ng c\u1ee7a t\u00f4i', 'bed-double'], ['sv-dien-nuoc', '\u0110i\u1ec7n n\u01b0\u1edbc', 'zap'], ['sv-hoa-don', 'H\u00f3a \u0111\u01a1n', 'receipt-text'], ['sv-chuyen-phong', 'Chuy\u1ec3n ph\u00f2ng', 'arrow-left-right'], ['sv-ho-so', 'L\u01b0u tr\u00fa', 'calendar-days'], ['sv-noi-quy', 'N\u1ed9i quy & ph\u1ea3n h\u1ed3i', 'message-square-text'], ['sv-ho-tro', 'H\u1ed7 tr\u1ee3', 'headphones'], ['sv-thong-bao', 'Th\u00f4ng b\u00e1o', 'bell'], ['sv-tai-khoan', 'T\u00e0i kho\u1ea3n', 'user-round']];
  App.QL_NAV = [['ql-tong-quan', 'T\u1ed5ng quan', 'house'], ['ql-khu-nha', 'T\u1ea7ng & ph\u00f2ng', 'building-2'], ['ql-sinh-vien', 'Sinh vi\u00ean', 'users'], ['ql-ho-so', 'H\u1ed3 s\u01a1 l\u01b0u tr\u00fa', 'file-text'], ['ql-hop-dong', 'H\u1ee3p \u0111\u1ed3ng', 'clipboard-list'], ['ql-dien-nuoc', '\u0110i\u1ec7n n\u01b0\u1edbc', 'zap'], ['ql-doi-soat', 'T\u00e0i ch\u00ednh', 'circle-dollar-sign'], ['ql-chuyen-phong', 'Chuy\u1ec3n ph\u00f2ng', 'arrow-left-right'], ['ql-cu-tru', 'C\u01b0 tr\u00fa', 'calendar-check'], ['ql-vi-pham', 'N\u1ed9i quy & vi ph\u1ea1m', 'file-warning'], ['ql-bao-tri', 'B\u1ea3o tr\u00ec', 'wrench'], ['ql-thong-bao', 'Th\u00f4ng b\u00e1o', 'bell'], ['ql-bao-cao', 'B\u00e1o c\u00e1o', 'chart-column'], ['ql-cai-dat', 'C\u00e0i \u0111\u1eb7t', 'settings']];
  App.prefixes.push(['sv-giai-trinh-', 'sv-giai-trinh'], ['ql-bien-ban-', 'ql-bien-ban'], ['ql-ban-giao-', 'ql-ban-giao']);
  V4.adminShell = (o, body) => App.shell(Object.assign({ role: 'admin', logo: 'stack', foot: 'art', sbw: 236 }, o), body);
  V4.svShell = (o, body) => App.shell(Object.assign({ role: 'student', logo: 'stack', notif: 'dot', foot: 'card', sbw: 236 }, o), body);

  // ---------- n\u1ed9i quy ----------
  const LEVELS = { 'nhac-nho': ['Nh\u1eafc nh\u1edf', 'blue'], 'canh-cao': ['C\u1ea3nh c\u00e1o', 'orange'], 'nghiem-trong': ['Nghi\u00eam tr\u1ecdng', 'red'] };
  const CATS = ['Gi\u1edd gi\u1ea5c', 'An to\u00e0n \u2013 PCCC', 'Tr\u1eadt t\u1ef1', 'Kh\u00e1ch th\u0103m', 'V\u1ec7 sinh', 'T\u00e0i s\u1ea3n', 'T\u1ec7 n\u1ea1n'];
  const seedRules = () => [
    { id: 'R01', cat: 'Gi\u1edd gi\u1ea5c', name: 'V\u1ec1 k\u00fd t\u00fac x\u00e1 sau 23:00 kh\u00f4ng \u0111\u0103ng k\u00fd', level: 'nhac-nho', points: 5, fine: 0 },
    { id: 'R02', cat: 'Gi\u1edd gi\u1ea5c', name: 'V\u1eafng m\u1eb7t qua \u0111\u00eam kh\u00f4ng \u0111\u0103ng k\u00fd t\u1ea1m v\u1eafng', level: 'canh-cao', points: 10, fine: 0 },
    { id: 'R03', cat: 'An to\u00e0n \u2013 PCCC', name: 'S\u1eed d\u1ee5ng b\u1ebfp \u0111i\u1ec7n, thi\u1ebft b\u1ecb c\u00f4ng su\u1ea5t l\u1edbn trong ph\u00f2ng', level: 'canh-cao', points: 15, fine: 200000 },
    { id: 'R04', cat: 'An to\u00e0n \u2013 PCCC', name: 'H\u00fat thu\u1ed1c trong khu k\u00fd t\u00fac x\u00e1', level: 'nghiem-trong', points: 20, fine: 300000 },
    { id: 'R05', cat: 'Tr\u1eadt t\u1ef1', name: 'G\u00e2y \u1ed3n \u00e0o, m\u1ea5t tr\u1eadt t\u1ef1 trong gi\u1edd ngh\u1ec9', level: 'nhac-nho', points: 5, fine: 0 },
    { id: 'R06', cat: 'Kh\u00e1ch th\u0103m', name: '\u0110\u01b0a kh\u00e1ch \u1edf l\u1ea1i qua \u0111\u00eam khi ch\u01b0a \u0111\u01b0\u1ee3c ph\u00e9p', level: 'nghiem-trong', points: 20, fine: 0 },
    { id: 'R07', cat: 'V\u1ec7 sinh', name: 'Kh\u00f4ng th\u1ef1c hi\u1ec7n l\u1ecbch tr\u1ef1c v\u1ec7 sinh ph\u00f2ng', level: 'nhac-nho', points: 3, fine: 0 },
    { id: 'R08', cat: 'V\u1ec7 sinh', name: 'Kh\u00f4ng gi\u1eef v\u1ec7 sinh khu v\u1ef1c chung', level: 'nhac-nho', points: 3, fine: 0 },
    { id: 'R09', cat: 'T\u00e0i s\u1ea3n', name: 'L\u00e0m h\u01b0 h\u1ecfng t\u00e0i s\u1ea3n chung', level: 'canh-cao', points: 10, fine: 0, note: 'B\u1ed3i th\u01b0\u1eddng theo gi\u00e1 tr\u1ecb th\u1ef1c t\u1ebf' },
    { id: 'R10', cat: 'T\u1ec7 n\u1ea1n', name: 'U\u1ed1ng r\u01b0\u1ee3u bia, \u0111\u00e1nh b\u1ea1c trong k\u00fd t\u00fac x\u00e1', level: 'nghiem-trong', points: 25, fine: 0 },
    { id: 'R11', cat: 'Tr\u1eadt t\u1ef1', name: '\u0110\u1ec3 xe sai khu v\u1ef1c quy \u0111\u1ecbnh', level: 'nhac-nho', points: 3, fine: 0 },
  ];
  const seedViolations = () => [
    { id: 'VP-001', student: 'SV260001', room: 'A302', rule: 'R11', title: '\u0110\u1ec3 xe sai khu v\u1ef1c', date: '20/10/2026', time: '21:15', place: 'Khu \u0111\u1ec3 xe t\u1ea7ng 1', desc: 'Ghi nh\u1eadn xe \u0111\u01b0\u1ee3c \u0111\u1ec3 ngo\u00e0i khu v\u1ef1c quy \u0111\u1ecbnh (l\u1ed1i tho\u00e1t hi\u1ec3m c\u1ea1nh khu \u0111\u1ec3 xe). N\u1ed9i dung \u0111ang ch\u1edd x\u00e1c minh.', evidence: [{ name: 'anh_hien_trang.jpg', size: '1,2 MB', img: 'ev_bike' }], note: '\u0110ang \u0111\u1ed1i chi\u1ebfu th\u00f4ng tin ph\u1ea3n \u00e1nh.', by: 'C\u00e1n b\u1ed9 qu\u1ea3n l\u00fd', dept: 'B\u1ed9 ph\u1eadn qu\u1ea3n l\u00fd t\u1ea7ng 1', deadline: '25/10/2026', status: 'can-giai-trinh', created: '20/10/2026 21:15', verifiedAt: '21/10/2026 09:00',
      request: { text: 'Ban qu\u1ea3n l\u00fd \u0111\u00e3 xem h\u00ecnh \u1ea3nh v\u00e0 \u0111\u1ec1 ngh\u1ecb b\u1ea1n cung c\u1ea5p th\u00eam th\u00f4ng tin v\u1ec1 th\u1eddi gian, \u0111\u1ecba \u0111i\u1ec3m c\u1ee5 th\u1ec3 v\u00e0 l\u00fd do \u0111\u1ec3 xe t\u1ea1i khu v\u1ef1c n\u00eau tr\u00ean.\nVui l\u00f2ng g\u1eedi gi\u1ea3i tr\u00ecnh trong th\u1eddi gian s\u1edbm nh\u1ea5t \u0111\u1ec3 h\u1ed3 s\u01a1 \u0111\u01b0\u1ee3c xem x\u00e9t.', at: '21/10/2026 09:15', due: '27/10/2026' } },
    { id: 'VP-002', student: 'SV260010', room: 'B204', rule: 'R05', title: 'G\u00e2y \u1ed3n gi\u1edd ngh\u1ec9', date: '22/10/2026', time: '23:10', place: 'H\u00e0nh lang t\u1ea7ng 2', desc: 'C\u00e1c ph\u00f2ng l\u00e2n c\u1eadn ph\u1ea3n \u00e1nh ti\u1ebfng \u1ed3n l\u1edbn t\u1eeb ph\u00f2ng B204 sau 23:00.', evidence: [{ name: 'phan_anh_tieng_on.pdf', size: '0,3 MB', doc: true }], note: 'Ch\u1edd \u0111\u1ed1i chi\u1ebfu camera h\u00e0nh lang.', by: 'B\u1ea3o v\u1ec7 ca t\u1ed1i', dept: 'B\u1ed9 ph\u1eadn qu\u1ea3n l\u00fd t\u1ea7ng 2', deadline: '26/10/2026', status: 'cho-xac-minh', created: '22/10/2026 23:20' },
    { id: 'VP-003', student: 'SV260018', room: 'C101', rule: 'R08', title: 'V\u1ec7 sinh khu v\u1ef1c chung', date: '15/10/2026', time: '08:30', place: 'Khu v\u1ef1c chung t\u1ea7ng 1', desc: '\u0110\u1ec3 r\u00e1c sinh ho\u1ea1t t\u1ea1i h\u00e0nh lang chung, kh\u00f4ng \u0111\u00fang n\u01a1i quy \u0111\u1ecbnh.', evidence: [], note: '', by: 'C\u00e1n b\u1ed9 qu\u1ea3n l\u00fd', dept: 'B\u1ed9 ph\u1eadn qu\u1ea3n l\u00fd t\u1ea7ng 1', deadline: '18/10/2026', status: 'da-xu-ly', created: '15/10/2026 08:40', verifiedAt: '15/10/2026 14:00',
      conclusion: { result: 'khac-phuc', text: 'Sinh vi\u00ean \u0111\u00e3 d\u1ecdn d\u1eb9p khu v\u1ef1c v\u00e0 cam k\u1ebft kh\u00f4ng t\u00e1i ph\u1ea1m.', points: 0, at: '16/10/2026 10:00' } },
  ];
  const rule = (id) => K.db.rules.find((r) => r.id === id) || { name: 'N\u1ed9i quy kh\u00e1c', points: 0, level: 'nhac-nho', cat: 'Tr\u1eadt t\u1ef1', fine: 0 };
  const vTitle = (v) => v.title || rule(v.rule).name;
  const counted = (v) => v.status === 'da-xu-ly' && v.conclusion && v.conclusion.result === 'vi-pham';
  const points = (sid) => Math.max(0, 100 - K.db.violations.filter((v) => v.student === sid && counted(v)).reduce((s, v) => s + (v.points || 0), 0));
  const tier = (p) => (p >= 90 ? ['T\u1ed1t', 'green', 'Kh\u00f4ng c\u00f3 vi ph\u1ea1m \u0111\u00e1ng k\u1ec3.'] : p >= 80 ? ['Kh\u00e1', 'blue', 'C\u00f3 vi ph\u1ea1m nh\u1eb9, c\u1ea7n l\u01b0u \u00fd.'] : p >= 60 ? ['C\u1ea3nh c\u00e1o', 'orange', 'C\u1ea7n k\u00fd cam k\u1ebft, \u01b0u ti\u00ean th\u1ea5p khi x\u00e9t gia h\u1ea1n.'] : ['Xem x\u00e9t ch\u1ea5m d\u1ee9t', 'red', 'H\u1ed9i \u0111\u1ed3ng KTX xem x\u00e9t ch\u1ea5m d\u1ee9t l\u01b0u tr\u00fa.']);
  const VST = { nhap: ['B\u1ea3n nh\u00e1p', 'gray', 'file-pen-line'], 'cho-xac-minh': ['Ch\u1edd x\u00e1c minh', 'orange', 'clock'], 'can-giai-trinh': ['C\u1ea7n gi\u1ea3i tr\u00ecnh', 'blue', 'file-text'], 'da-giai-trinh': ['\u0110\u00e3 gi\u1ea3i tr\u00ecnh', 'blue', 'message-square-text'], 'da-xu-ly': ['\u0110\u00e3 x\u1eed l\u00fd', 'green', 'circle-check'], 'da-huy': ['Kh\u00f4ng vi ph\u1ea1m', 'gray', 'circle-x'] };
  const vLabel = (v) => (v.status === 'da-xu-ly' && v.conclusion && v.conclusion.result === 'khac-phuc' ? ['\u0110\u00e3 kh\u1eafc ph\u1ee5c', 'green', 'circle-check'] : v.status === 'da-xu-ly' && v.review && !v.review.answer ? ['\u0110\u1ec1 ngh\u1ecb xem l\u1ea1i', 'orange', 'rotate-ccw'] : VST[v.status]);
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

  const scoreRing = (p) => { const t = tier(p); const col = { green: '#1f9a4b', blue: '#1d5bd8', orange: '#df8600', red: '#dc1f2e' }[t[1]]; const c = 2 * Math.PI * 52; return `<div class="ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" stroke="${col}" stroke-dasharray="${(c * p / 100).toFixed(1)} ${c.toFixed(1)}" class="ring-fg"/></svg><div><b>${p}</b><small>/100 \u0111i\u1ec3m</small></div></div>`; };
  V4.scoreRing = scoreRing;

  // ti\u1ebfn tr\u00ecnh 4 b\u01b0\u1edbc c\u1ee7a m\u1ed9t h\u1ed3 s\u01a1 vi ph\u1ea1m
  const vSteps = (v, forStudent) => {
    const st = v.status;
    const verified = !!v.verifiedAt, explained = !!(v.explanation && v.explanation.at), done = st === 'da-xu-ly' || st === 'da-huy';
    const items = [
      { t: forStudent ? '\u0110\u00e3 ghi nh\u1eadn' : 'Ghi nh\u1eadn', d: v.created, s: forStudent ? 'Ph\u1ea3n \u00e1nh c\u1ee7a b\u1ea1n \u0111\u00e3 \u0111\u01b0\u1ee3c ti\u1ebfp nh\u1eadn.' : 'Ti\u1ebfp nh\u1eadn th\u00f4ng tin ph\u1ea3n \u00e1nh.', st: 'done' },
      { t: forStudent ? '\u0110\u00e3 x\u00e1c minh ban \u0111\u1ea7u' : 'X\u00e1c minh', d: v.verifiedAt || '', s: forStudent ? 'Ban qu\u1ea3n l\u00fd \u0111\u00e3 ki\u1ec3m tra th\u00f4ng tin v\u00e0 h\u00ecnh \u1ea3nh.' : 'X\u00e1c minh th\u00f4ng tin, thu th\u1eadp b\u1eb1ng ch\u1ee9ng.', st: verified ? 'done' : st === 'cho-xac-minh' ? 'cur' : 'todo' },
      { t: forStudent ? (explained ? '\u0110\u00e3 g\u1eedi gi\u1ea3i tr\u00ecnh' : 'Ch\u1edd b\u1ea1n gi\u1ea3i tr\u00ecnh') : 'Gi\u1ea3i tr\u00ecnh', d: explained ? v.explanation.at : (v.request ? v.request.at : ''), s: forStudent ? (explained ? 'Ban qu\u1ea3n l\u00fd \u0111\u00e3 nh\u1eadn gi\u1ea3i tr\u00ecnh c\u1ee7a b\u1ea1n.' : v.request ? 'Vui l\u00f2ng g\u1eedi gi\u1ea3i tr\u00ecnh v\u00e0 minh ch\u1ee9ng (n\u1ebfu c\u00f3).' : 'Kh\u00f4ng y\u00eau c\u1ea7u gi\u1ea3i tr\u00ecnh.') : (v.request ? (explained ? 'Sinh vi\u00ean \u0111\u00e3 g\u1eedi gi\u1ea3i tr\u00ecnh.' : 'L\u00e0m vi\u1ec7c v\u1edbi sinh vi\u00ean \u0111\u1ec3 nghe gi\u1ea3i tr\u00ecnh.') : 'L\u00e0m vi\u1ec7c v\u1edbi sinh vi\u00ean \u0111\u1ec3 nghe gi\u1ea3i tr\u00ecnh.'), st: explained || (done && !v.request) ? 'done' : st === 'can-giai-trinh' ? 'cur' : 'todo' },
      { t: forStudent ? (done ? '\u0110\u00e3 c\u00f3 k\u1ebft lu\u1eadn' : 'Ch\u1edd k\u1ebft lu\u1eadn') : 'K\u1ebft lu\u1eadn', d: v.conclusion ? v.conclusion.at : '', s: done ? (v.conclusion ? v.conclusion.text : '') : forStudent ? 'Sau khi nh\u1eadn gi\u1ea3i tr\u00ecnh, Ban qu\u1ea3n l\u00fd s\u1ebd xem x\u00e9t v\u00e0 th\u00f4ng b\u00e1o k\u1ebft qu\u1ea3.' : 'C\u1eadp nh\u1eadt k\u1ebft lu\u1eadn sau khi x\u00e1c minh.', st: done ? 'done' : st === 'da-giai-trinh' ? 'cur' : 'todo' },
    ];
    return items;
  };

  // ============ Ban qu\u1ea3n l\u00fd: Theo d\u00f5i n\u1ed9i quy & vi ph\u1ea1m (\u1ea3nh 1) ============
  P['ql-vi-pham'] = {
    role: 'admin', title: 'Theo d\u00f5i n\u1ed9i quy & vi ph\u1ea1m',
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
      let panel = `<div class="card pad empty"><span class="amen-ic blue">${ic('shield-check')}</span><p>Kh\u00f4ng c\u00f3 h\u1ed3 s\u01a1 ph\u00f9 h\u1ee3p b\u1ed9 l\u1ecdc.</p></div>`;
      if (cur) {
        const s = K.student(cur.student) || {};
        const ev = cur.evidence && cur.evidence[0];
        const act = cur.status === 'nhap' ? `<button class="btn btn-red" data-go="ql-bien-ban-${cur.id}">${ic('pencil')}Ti\u1ebfp t\u1ee5c so\u1ea1n</button>`
          : cur.status === 'cho-xac-minh' ? `<button class="btn btn-red" id="vp-verify">${ic('search')}Ti\u1ebfp nh\u1eadn x\u00e1c minh</button>`
          : cur.status === 'can-giai-trinh' || cur.status === 'da-giai-trinh' ? `<button class="btn btn-red" id="vp-conclude">${ic('gavel')}K\u1ebft lu\u1eadn</button>`
          : cur.review && !cur.review.answer ? `<button class="btn btn-red" id="vp-review">${ic('rotate-ccw')}Xem x\u00e9t l\u1ea1i</button>` : '';
        panel = `<div class="card pad vp-panel">
          <div class="row" style="justify-content:space-between;gap:8px"><h2 style="font-size:23px">H\u1ed3 s\u01a1 ${cur.id}</h2>${cur.status === 'cho-xac-minh' ? `<span class="badge b-orange pill-lg">${ic('clock')}Th\u00f4ng tin \u0111ang x\u00e1c minh</span>` : vBadge(cur, true)}</div>
          <div class="row" style="margin:12px 0 6px">${av(s.avatar, 60)}<div><b style="color:var(--navy);font-size:18px;display:block">${esc(s.name || cur.student)}</b><small class="muted">${cur.student}</small></div></div>
          <div class="kv-ic">
            <div>${ic('calendar-days')}<span>Ng\u00e0y ghi nh\u1eadn</span><b>${cur.date} ${cur.time || ''}</b></div>
            <div>${ic('layers')}<span>T\u1ea7ng</span><b>T\u1ea7ng ${K.fl(cur.room)}</b></div>
            <div>${ic('door-closed')}<span>Ph\u00f2ng</span><b>${cur.room}</b></div>
            <div>${ic('map-pin')}<span>\u0110\u1ecba \u0111i\u1ec3m</span><b>${esc(cur.place || '\u2014')}</b></div>
            <div>${ic('file-text')}<span>N\u1ed9i dung vi ph\u1ea1m</span><b>${esc(vTitle(cur))}</b></div></div>
          <div class="kv-ic" style="border-top:1px solid var(--line-2);padding-top:10px;margin-top:8px">
            <div>${ic('paperclip')}<span>B\u1eb1ng ch\u1ee9ng \u0111\u00ednh k\u00e8m</span>${ev ? `<span class="ev-chip">${ev.img ? `<img src="${K.A(ev.img)}" alt="">` : `<span class="amen-ic red sm">${ic('file-text')}</span>`}<span><b>${esc(ev.name)}</b><small>${ev.size || ''}</small></span><button class="xbtn" id="vp-ev" aria-label="Xem b\u1eb1ng ch\u1ee9ng">${ic('download')}</button></span>` : '<b class="muted" style="font-weight:400">Ch\u01b0a c\u00f3</b>'}</div>
            <div>${ic('notebook-pen')}<span>Ghi ch\u00fa</span><span class="note-box">${esc(cur.note || 'Kh\u00f4ng c\u00f3 ghi ch\u00fa.')}</span></div></div>
          ${cur.explanation ? `<div class="reply-box" style="background:var(--blue-50)"><b style="color:var(--blue-700)">${ic('message-square-text')}Gi\u1ea3i tr\u00ecnh c\u1ee7a sinh vi\u00ean \u00b7 ${cur.explanation.at}</b><p style="white-space:pre-line">${esc(cur.explanation.text)}</p>${(cur.explanation.files || []).length ? `<p class="small muted">\u0110\u00ednh k\u00e8m: ${cur.explanation.files.map((f) => esc(f.name)).join(', ')}</p>` : ''}</div>` : ''}
          ${cur.review ? `<div class="reply-box" style="background:var(--orange-50)"><b style="color:var(--orange)">${ic('rotate-ccw')}\u0110\u1ec1 ngh\u1ecb xem l\u1ea1i \u00b7 ${cur.review.at}</b><p>${esc(cur.review.text)}</p>${cur.review.answer ? `<p class="small muted">Tr\u1ea3 l\u1eddi: ${esc(cur.review.answer)}</p>` : ''}</div>` : ''}
          <h3 style="font-size:17px;margin:14px 0 8px">Ti\u1ebfn tr\u00ecnh x\u1eed l\u00fd</h3>${vline(vSteps(cur, false))}
          <div class="grid g2" style="gap:10px;margin-top:12px"><button class="btn btn-outline" id="vp-detail">${ic('file-text')}Xem chi ti\u1ebft</button>${act || `<button class="btn btn-disabled" disabled>${ic('check')}\u0110\u00e3 ho\u00e0n t\u1ea5t</button>`}</div>
          <div class="info-strip">${ic('info')}${cur.status === 'da-xu-ly' || cur.status === 'da-huy' ? 'K\u1ebft lu\u1eadn: ' + esc(cur.conclusion ? cur.conclusion.text : '') : 'K\u1ebft lu\u1eadn \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt sau khi x\u00e1c minh.'}</div></div>`;
      }
      const stat = (k, t, c, icon) => `<button class="vstat ${c} ${st.grp === k ? 'on' : ''}" data-grp="${k}"><span class="vstat-ic">${ic(icon)}</span><span><b>${t}</b><strong>${n(k)}</strong></span>${ic('chevron-right')}</button>`;
      return V4.adminShell({ active: 'ql-vi-pham', search: 'T\u00ecm ki\u1ebfm sinh vi\u00ean, ph\u00f2ng, n\u1ed9i dung vi ph\u1ea1m...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('bn_vipham')}" alt=""><h1>Theo d\u00f5i n\u1ed9i quy &amp; vi ph\u1ea1m ${demo}</h1><p class="desc">Qu\u1ea3n l\u00fd, theo d\u00f5i v\u00e0 x\u1eed l\u00fd c\u00e1c tr\u01b0\u1eddng h\u1ee3p vi ph\u1ea1m n\u1ed9i quy k\u00fd t\u00fac x\u00e1.</p></div>
        <div class="vstats">${stat('xm', 'Ch\u1edd x\u00e1c minh', 'orange', 'clock')}${stat('gt', 'C\u1ea7n gi\u1ea3i tr\u00ecnh', 'blue', 'file-text')}${stat('xl', '\u0110\u00e3 x\u1eed l\u00fd', 'green', 'circle-check')}
          <div class="vstat-act"><button class="btn btn-red btn-lg" data-go="ql-bien-ban">${ic('circle-plus')}T\u1ea1o bi\u00ean b\u1ea3n</button><button class="btn btn-outline btn-sm" data-go="ql-noi-quy">${ic('book-open')}Danh m\u1ee5c n\u1ed9i quy &amp; \u0111i\u1ec3m n\u1ec1 n\u1ebfp</button></div></div>
        <div class="grid resp-1" style="grid-template-columns:1fr 420px;gap:14px;align-items:start">
          <div class="card pad" style="padding:14px;min-width:0">
            <div class="vfilter">
              <div class="iwrap">${ic('building')}${sel('vf-khu', [['', 'T\u1ea5t c\u1ea3 t\u1ea7ng'], ...App.khuOpts()], st.khu)}</div>
              <div class="daterange">${ic('calendar-days')}<input type="date" id="vf-from" value="${st.from}" aria-label="T\u1eeb ng\u00e0y">${ic('arrow-right')}<input type="date" id="vf-to" value="${st.to}" aria-label="\u0110\u1ebfn ng\u00e0y"></div>
              ${sel('vf-st', [['', 'T\u1ea5t c\u1ea3 tr\u1ea1ng th\u00e1i'], ...Object.entries(VST).map(([k, v]) => [k, v[0]])], st.status)}
              <div class="iwrap">${ic('search')}<input id="vf-q" class="input" placeholder="T\u00ecm ki\u1ebfm theo m\u00e3, sinh vi\u00ean, n\u1ed9i dung..." value="${esc(st.q)}"></div></div>
            <div class="tbl-wrap" style="margin-top:14px;border:0"><table class="tbl hover vtbl"><thead><tr><th>M\u00e3 v\u1ee5 vi\u1ec7c</th><th>Sinh vi\u00ean</th><th>Ph\u00f2ng</th><th>N\u1ed9i dung vi ph\u1ea1m</th><th>Tr\u1ea1ng th\u00e1i</th><th class="c">Thao t\u00e1c</th></tr></thead><tbody>
              ${list.map((v) => `<tr data-v="${v.id}" class="${v.id === st.sel ? 'sel' : ''}"><td><b style="color:var(--navy)">${v.id}</b></td><td><b style="color:var(--navy);font-weight:600;display:block">${esc(sname(v.student))}</b><small class="muted">${v.student}</small></td><td>${v.room}</td><td>${esc(vTitle(v))}</td><td>${vBadge(v)}</td><td class="c"><button class="btn btn-sm btn-outline" data-view="${v.id}">${ic('eye')}Xem</button></td></tr>`).join('') || '<tr><td colspan="6" class="muted" style="text-align:center;padding:28px">Kh\u00f4ng c\u00f3 h\u1ed3 s\u01a1 vi ph\u1ea1m ph\u00f9 h\u1ee3p.</td></tr>'}
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

  V4.showEvidence = (e) => { if (!e) return; App.modal({ title: e.name, wide: true, body: e.img ? `<img src="${K.A(e.img)}" style="width:100%;border-radius:12px" alt="">` : `<div class="empty"><span class="amen-ic red">${ic('file-text')}</span><p>${esc(e.name)} \u00b7 ${e.size || ''}</p><p class="small">T\u00e0i li\u1ec7u \u0111\u00ednh k\u00e8m c\u1ee7a h\u1ed3 s\u01a1.</p></div>` }); };
  V4.showRecord = (v) => {
    const s = K.student(v.student) || {}; const r = rule(v.rule);
    App.modal({ title: 'Bi\u00ean b\u1ea3n ghi nh\u1eadn ' + v.id, wide: true, body: `<div class="print-area"><div style="text-align:center"><b style="color:var(--navy)">\u0110\u1ea0I H\u1eccC NGH\u1ec6 AN \u00b7 BAN QU\u1ea2N L\u00dd K\u00dd T\u00daC X\u00c1</b><h3 style="font-size:22px;margin-top:8px">BI\u00caN B\u1ea2N GHI NH\u1eacN</h3><p class="muted small">S\u1ed1: ${v.id} \u00b7 L\u1eadp ng\u00e0y ${v.created.slice(0, 10)}</p></div>
      <dl class="kv" style="grid-template-columns:170px 1fr;margin-top:16px"><dt>Sinh vi\u00ean</dt><dd>${esc(s.name || v.student)} (${v.student})</dd><dt>Ph\u00f2ng</dt><dd>${v.room} \u00b7 T\u1ea7ng ${K.fl(v.room)}</dd><dt>Th\u1eddi \u0111i\u1ec3m</dt><dd>${v.date} ${v.time || ''}</dd><dt>\u0110\u1ecba \u0111i\u1ec3m</dt><dd>${esc(v.place || '\u2014')}</dd><dt>H\u00e0nh vi (d\u1ef1 ki\u1ebfn)</dt><dd>${esc(vTitle(v))} <span class="muted small">(${r.id} \u00b7 ${LEVELS[r.level][0]} \u00b7 tr\u1eeb ${r.points} \u0111i\u1ec3m${r.fine ? ' \u00b7 ph\u1ea1t ' + money(r.fine) : ''})</span></dd><dt>M\u00f4 t\u1ea3</dt><dd style="font-weight:400">${esc(v.desc)}</dd><dt>Ng\u01b0\u1eddi l\u1eadp</dt><dd>${esc(v.by)}</dd><dt>B\u1ed9 ph\u1eadn x\u1eed l\u00fd</dt><dd>${esc(v.dept || '\u2014')}</dd><dt>H\u1ea1n x\u00e1c minh</dt><dd>${v.deadline || '\u2014'}</dd>
      ${v.request ? `<dt>\u0110\u1ec1 ngh\u1ecb gi\u1ea3i tr\u00ecnh</dt><dd style="font-weight:400;white-space:pre-line">${esc(v.request.text)} <span class="muted small">(${v.request.at})</span></dd>` : ''}${v.explanation ? `<dt>Gi\u1ea3i tr\u00ecnh</dt><dd style="font-weight:400;white-space:pre-line">${esc(v.explanation.text)}</dd>` : ''}${v.conclusion ? `<dt>K\u1ebft lu\u1eadn</dt><dd>${esc(v.conclusion.text)} ${v.conclusion.points ? `<span class="badge b-red b-sm">\u2212${v.conclusion.points} \u0111i\u1ec3m</span>` : ''}</dd>` : ''}</dl>
      ${(v.evidence || []).filter((e) => e.img).length ? `<div class="ev-grid">${v.evidence.filter((e) => e.img).map((e) => `<img src="${K.A(e.img)}" alt="">`).join('')}</div>` : ''}</div>`,
      foot: `<button class="btn btn-outline" data-print>${ic('printer')}In bi\u00ean b\u1ea3n</button><button class="btn btn-red" data-x>\u0110\u00f3ng</button>`, onMount: (el) => el.querySelector('[data-print]').onclick = () => V4.print(el) });
  };
  V4.print = (el) => { document.body.classList.add('printing'); el.classList.add('print-me'); try { window.print(); } catch (e) { /* b\u1ecb ch\u1eb7n */ } setTimeout(() => { document.body.classList.remove('printing'); el.classList.remove('print-me'); }, 500); };

  const ruleOpts = () => K.db.rules.map((r) => [r.id, r.name + ' (\u2212' + r.points + ' \u0111i\u1ec3m)']);
  const conclusionForm = (v) => `<div class="field"><span class="lbl">K\u1ebft qu\u1ea3</span><div class="opt-cards">${[['vi-pham', 'Vi ph\u1ea1m', 'Tr\u1eeb \u0111i\u1ec3m n\u1ec1 n\u1ebfp theo n\u1ed9i quy'], ['khac-phuc', 'Nh\u1eafc nh\u1edf \u2013 \u0111\u00e3 kh\u1eafc ph\u1ee5c', 'Kh\u00f4ng tr\u1eeb \u0111i\u1ec3m'], ['khong-vi-pham', 'Kh\u00f4ng vi ph\u1ea1m', 'H\u1ee7y h\u1ed3 s\u01a1']].map(([k, t, d], i) => `<label class="opt"><input type="radio" name="cl-res" value="${k}" ${i === 0 ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span></label>`).join('')}</div></div>
    <div class="grid g2" style="gap:12px;margin-top:12px"><div class="field"><label for="cl-rule">N\u1ed9i quy \u00e1p d\u1ee5ng</label>${sel('cl-rule', ruleOpts(), v.rule)}</div><div class="field"><label for="cl-pts">\u0110i\u1ec3m tr\u1eeb</label><input id="cl-pts" type="number" class="input" min="0" max="50" value="${rule(v.rule).points}"></div></div>
    <div class="field" style="margin-top:12px"><label for="cl-text">N\u1ed9i dung k\u1ebft lu\u1eadn <span class="req">*</span></label><textarea id="cl-text" class="textarea" placeholder="C\u0103n c\u1ee9 x\u00e1c minh, h\u00ecnh th\u1ee9c x\u1eed l\u00fd..."></textarea></div>`;
  const applyConclusion = (v, el) => {
    const res = el.querySelector('[name=cl-res]:checked').value; const text = el.querySelector('#cl-text').value.trim(); const rid = el.querySelector('#cl-rule').value; const pts = +el.querySelector('#cl-pts').value;
    if (text.length < 10) { App.toast('N\u1ed9i dung k\u1ebft lu\u1eadn c\u1ea7n t\u1ed1i thi\u1ec3u 10 k\u00fd t\u1ef1', 'err'); return false; }
    const r = rule(rid); v.rule = rid;
    v.conclusion = { result: res, text, points: res === 'vi-pham' ? pts : 0, at: K.now() };
    v.points = v.conclusion.points; v.verifiedAt = v.verifiedAt || K.now();
    v.status = res === 'khong-vi-pham' ? 'da-huy' : 'da-xu-ly';
    if (res === 'vi-pham' && r.fine && !K.db.invoices.find((i) => i.id === 'PV' + v.id.slice(3))) { const s = K.student(v.student) || {}; const room = K.room(s.room) || {}; K.db.invoices.push({ id: 'PV' + v.id.slice(3), kind: 'fine', label: 'Ti\u1ec1n ph\u1ea1t vi ph\u1ea1m n\u1ed9i quy (' + v.id + ')', student: v.student, period: '10/2026', room: s.room || v.room, khu: room.khu || '', items: [{ name: 'Ph\u1ea1t vi ph\u1ea1m: ' + r.name, amount: r.fine }], total: r.fine, status: 'chua-tt', due: '10/11/2026' }); }
    notify(v.student, 'K\u1ebft lu\u1eadn h\u1ed3 s\u01a1 ' + v.id + ': ' + (res === 'vi-pham' ? 'Vi ph\u1ea1m' : res === 'khac-phuc' ? '\u0110\u00e3 kh\u1eafc ph\u1ee5c' : 'Kh\u00f4ng vi ph\u1ea1m'), text + (res === 'vi-pham' ? '\nTr\u1eeb ' + pts + ' \u0111i\u1ec3m n\u1ec1 n\u1ebfp' + (r.fine ? ', ph\u1ea1t ' + money(r.fine) + ' (xem m\u1ee5c H\u00f3a \u0111\u01a1n).' : '.') + ' N\u1ebfu ch\u01b0a \u0111\u1ed3ng \u00fd, b\u1ea1n c\u00f3 th\u1ec3 g\u1eedi \u0111\u1ec1 ngh\u1ecb xem l\u1ea1i.' : ''));
    log('K\u1ebft lu\u1eadn vi ph\u1ea1m', 'K\u1ebft lu\u1eadn h\u1ed3 s\u01a1 ' + v.id + ' c\u1ee7a ' + sname(v.student)); K.save(); return true;
  };
  V4.verifyModal = (v) => App.modal({ title: 'Ti\u1ebfp nh\u1eadn x\u00e1c minh ' + v.id, wide: true, body: `<p class="muted" style="margin-bottom:12px">${esc(sname(v.student))} \u00b7 ${v.room} \u00b7 ${esc(vTitle(v))}</p>
      <div class="opt-cards two"><label class="opt"><input type="radio" name="vf-mode" value="req" checked><span><b>Y\u00eau c\u1ea7u sinh vi\u00ean gi\u1ea3i tr\u00ecnh</b><small>G\u1eedi \u0111\u1ec1 ngh\u1ecb b\u1ed5 sung th\u00f4ng tin, sinh vi\u00ean tr\u1ea3 l\u1eddi tr\u00ean c\u1ed5ng sinh vi\u00ean.</small></span></label><label class="opt"><input type="radio" name="vf-mode" value="now"><span><b>K\u1ebft lu\u1eadn ngay</b><small>\u0110\u00e3 \u0111\u1ee7 c\u0103n c\u1ee9, kh\u00f4ng c\u1ea7n gi\u1ea3i tr\u00ecnh.</small></span></label></div>
      <div id="vf-req" style="margin-top:14px"><div class="field"><label for="rq-text">N\u1ed9i dung \u0111\u1ec1 ngh\u1ecb <span class="req">*</span></label><textarea id="rq-text" class="textarea" style="min-height:100px">Ban qu\u1ea3n l\u00fd \u0111\u00e3 xem h\u00ecnh \u1ea3nh v\u00e0 \u0111\u1ec1 ngh\u1ecb b\u1ea1n cung c\u1ea5p th\u00eam th\u00f4ng tin v\u1ec1 th\u1eddi gian, \u0111\u1ecba \u0111i\u1ec3m c\u1ee5 th\u1ec3 v\u00e0 l\u00fd do li\u00ean quan \u0111\u1ebfn s\u1ef1 vi\u1ec7c n\u00eau tr\u00ean.\nVui l\u00f2ng g\u1eedi gi\u1ea3i tr\u00ecnh trong th\u1eddi gian s\u1edbm nh\u1ea5t \u0111\u1ec3 h\u1ed3 s\u01a1 \u0111\u01b0\u1ee3c xem x\u00e9t.</textarea></div><div class="field" style="margin-top:12px;max-width:260px"><label for="rq-due">H\u1ea1n g\u1eedi gi\u1ea3i tr\u00ecnh</label><input id="rq-due" type="date" class="input" value="2026-10-28"></div></div>
      <div id="vf-now" hidden style="margin-top:14px">${conclusionForm(v)}</div>`,
    foot: '<button class="btn btn-outline" data-x>H\u1ee7y</button><button class="btn btn-red" data-ok>X\u00e1c nh\u1eadn</button>',
    onMount: (el, close) => {
      el.querySelectorAll('[name=vf-mode]').forEach((r) => r.onchange = () => { const now = el.querySelector('[name=vf-mode]:checked').value === 'now'; el.querySelector('#vf-req').hidden = now; el.querySelector('#vf-now').hidden = !now; });
      const ruleSel = el.querySelector('#cl-rule'); ruleSel.onchange = () => { el.querySelector('#cl-pts').value = rule(ruleSel.value).points; };
      el.querySelector('[data-ok]').onclick = () => {
        if (el.querySelector('[name=vf-mode]:checked').value === 'now') { if (applyConclusion(v, el)) { close(); App.toast('\u0110\u00e3 k\u1ebft lu\u1eadn h\u1ed3 s\u01a1 ' + v.id); App.refresh(); } return; }
        const text = el.querySelector('#rq-text').value.trim(); if (text.length < 20) return App.toast('N\u1ed9i dung \u0111\u1ec1 ngh\u1ecb c\u1ea7n t\u1ed1i thi\u1ec3u 20 k\u00fd t\u1ef1', 'err');
        v.verifiedAt = K.now(); v.request = { text, at: K.now(), due: dmy(el.querySelector('#rq-due').value) }; v.status = 'can-giai-trinh';
        notify(v.student, '\u0110\u1ec1 ngh\u1ecb gi\u1ea3i tr\u00ecnh h\u1ed3 s\u01a1 ' + v.id, text + '\nH\u1ea1n g\u1eedi gi\u1ea3i tr\u00ecnh: ' + v.request.due + '. V\u00e0o m\u1ee5c N\u1ed9i quy & ph\u1ea3n h\u1ed3i \u0111\u1ec3 g\u1eedi gi\u1ea3i tr\u00ecnh.');
        log('Y\u00eau c\u1ea7u gi\u1ea3i tr\u00ecnh', 'Y\u00eau c\u1ea7u ' + sname(v.student) + ' gi\u1ea3i tr\u00ecnh h\u1ed3 s\u01a1 ' + v.id); K.save(); close(); App.toast('\u0110\u00e3 g\u1eedi \u0111\u1ec1 ngh\u1ecb gi\u1ea3i tr\u00ecnh t\u1edbi sinh vi\u00ean'); App.refresh();
      };
    } });
  V4.concludeModal = (v) => App.modal({ title: 'K\u1ebft lu\u1eadn h\u1ed3 s\u01a1 ' + v.id, wide: true, body: `${v.explanation ? `<div class="reply-box" style="background:var(--blue-50);margin:0 0 14px"><b style="color:var(--blue-700)">Gi\u1ea3i tr\u00ecnh c\u1ee7a sinh vi\u00ean</b><p style="white-space:pre-line">${esc(v.explanation.text)}</p></div>` : `<div class="reply-box" style="background:var(--orange-50);margin:0 0 14px"><b style="color:var(--orange)">${ic('clock')}Sinh vi\u00ean ch\u01b0a g\u1eedi gi\u1ea3i tr\u00ecnh</b><p>H\u1ea1n gi\u1ea3i tr\u00ecnh: ${v.request ? v.request.due : '\u2014'}. B\u1ea1n v\u1eabn c\u00f3 th\u1ec3 k\u1ebft lu\u1eadn n\u1ebfu \u0111\u00e3 \u0111\u1ee7 c\u0103n c\u1ee9.</p></div>`}${conclusionForm(v)}`,
    foot: '<button class="btn btn-outline" data-x>H\u1ee7y</button><button class="btn btn-red" data-ok>L\u01b0u k\u1ebft lu\u1eadn</button>',
    onMount: (el, close) => { const ruleSel = el.querySelector('#cl-rule'); ruleSel.onchange = () => { el.querySelector('#cl-pts').value = rule(ruleSel.value).points; }; el.querySelector('[data-ok]').onclick = () => { if (applyConclusion(v, el)) { close(); App.toast('\u0110\u00e3 k\u1ebft lu\u1eadn h\u1ed3 s\u01a1 ' + v.id); App.refresh(); } }; } });
  V4.reviewModal = (v) => App.modal({ title: 'Xem x\u00e9t l\u1ea1i h\u1ed3 s\u01a1 ' + v.id, body: `<div class="reply-box" style="background:var(--orange-50);margin:0 0 14px"><b style="color:var(--orange)">\u0110\u1ec1 ngh\u1ecb c\u1ee7a sinh vi\u00ean</b><p>${esc(v.review.text)}</p></div><div class="field"><label for="rv-ans">Tr\u1ea3 l\u1eddi <span class="req">*</span></label><textarea id="rv-ans" class="textarea" placeholder="K\u1ebft qu\u1ea3 xem x\u00e9t l\u1ea1i..."></textarea></div>`,
    foot: '<button class="btn btn-outline" data-keep>Gi\u1eef nguy\u00ean k\u1ebft lu\u1eadn</button><button class="btn btn-red" data-cancel>H\u1ee7y k\u1ebft lu\u1eadn vi ph\u1ea1m</button>',
    onMount: (el, close) => {
      const go = (keep) => { const a = el.querySelector('#rv-ans').value.trim(); if (a.length < 10) return App.toast('N\u1ed9i dung tr\u1ea3 l\u1eddi c\u1ea7n t\u1ed1i thi\u1ec3u 10 k\u00fd t\u1ef1', 'err'); v.review.answer = a; v.review.answerAt = K.now(); if (!keep) { v.conclusion = Object.assign({}, v.conclusion, { result: 'khong-vi-pham', points: 0, text: 'Sau xem x\u00e9t l\u1ea1i: ' + a }); v.points = 0; v.status = 'da-huy'; } notify(v.student, 'K\u1ebft qu\u1ea3 xem x\u00e9t l\u1ea1i h\u1ed3 s\u01a1 ' + v.id, a + (keep ? '\nK\u1ebft lu\u1eadn \u0111\u01b0\u1ee3c gi\u1eef nguy\u00ean.' : '\nK\u1ebft lu\u1eadn vi ph\u1ea1m \u0111\u00e3 \u0111\u01b0\u1ee3c h\u1ee7y, \u0111i\u1ec3m n\u1ec1 n\u1ebfp \u0111\u01b0\u1ee3c ho\u00e0n l\u1ea1i.')); K.save(); close(); App.toast('\u0110\u00e3 tr\u1ea3 l\u1eddi \u0111\u1ec1 ngh\u1ecb xem l\u1ea1i'); App.refresh(); };
      el.querySelector('[data-keep]').onclick = () => go(true); el.querySelector('[data-cancel]').onclick = () => go(false);
    } });

  // ============ Ban qu\u1ea3n l\u00fd: L\u1eadp bi\u00ean b\u1ea3n ghi nh\u1eadn (\u1ea3nh 4) ============
  const PLACES = ['Khu \u0111\u1ec3 xe t\u1ea7ng 1', 'Ph\u00f2ng \u1edf', 'H\u00e0nh lang t\u1ea7ng 1', 'H\u00e0nh lang t\u1ea7ng 2', 'H\u00e0nh lang t\u1ea7ng 3', 'H\u00e0nh lang t\u1ea7ng 4', 'C\u1ea7u thang tho\u00e1t hi\u1ec3m', 'S\u00e2n sinh ho\u1ea1t chung', 'Khu gi\u1eb7t s\u1ea5y', 'Kh\u00e1c'];
  const DEPTS = ['B\u1ed9 ph\u1eadn qu\u1ea3n l\u00fd t\u1ea7ng 1', 'B\u1ed9 ph\u1eadn qu\u1ea3n l\u00fd t\u1ea7ng 2', 'B\u1ed9 ph\u1eadn qu\u1ea3n l\u00fd t\u1ea7ng 3', 'B\u1ed9 ph\u1eadn qu\u1ea3n l\u00fd t\u1ea7ng 4', 'T\u1ed5 b\u1ea3o v\u1ec7', 'B\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt'];
  P['ql-bien-ban'] = {
    role: 'admin', title: 'L\u1eadp bi\u00ean b\u1ea3n ghi nh\u1eadn',
    render: (id) => {
      const living = K.db.students.filter((s) => s.room);
      const existing = id && K.db.violations.find((v) => v.id === id);
      const key = 'bb-' + (id || 'new');
      const st = App.state(key, () => existing ? JSON.parse(JSON.stringify(existing)) : { student: '', room: '', date: todayIso(), time: '21:15', place: '', rule: 'R11', desc: '', evidence: [], by: 'C\u00e1n b\u1ed9 qu\u1ea3n l\u00fd', dept: 'B\u1ed9 ph\u1eadn qu\u1ea3n l\u00fd t\u1ea7ng 1', deadline: '', status: 'nhap' });
      if (existing && !st.date.includes('-')) { st.date = iso(st.date); st.deadline = iso(st.deadline); }
      const s = K.student(st.student);
      const chk = [st.student && st.room, st.date && st.time && st.place, st.evidence.length > 0];
      return V4.adminShell({ active: 'ql-vi-pham', search: 'T\u00ecm ki\u1ebfm sinh vi\u00ean, ph\u00f2ng, h\u00f3a \u0111\u01a1n, n\u1ed9i quy...' }, `
        <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:10px"><h1 class="v4-title">L\u1eadp bi\u00ean b\u1ea3n ghi nh\u1eadn <span class="badge b-gray pill-lg">${ic('clock')}${existing ? 'B\u1ea3n nh\u00e1p ' + existing.id : 'B\u1ea3n nh\u00e1p'}</span></h1>${demo}</div>
        <div class="grid resp-1" style="grid-template-columns:1fr 470px;gap:16px;align-items:start">
          <div class="card pad" style="padding:20px 22px">
            <h2 class="numh"><span>1</span>Th\u00f4ng tin li\u00ean quan</h2>
            <div class="grid g2" style="gap:14px 18px;margin-top:12px">
              <div class="field"><label for="bb-s">Sinh vi\u00ean</label><div class="iwrap">${ic('user-round')}${sel('bb-s', [['', 'Ch\u1ecdn sinh vi\u00ean'], ...living.map((x) => [x.id, x.name + ' \u00b7 ' + x.id])], st.student)}</div></div>
              <div class="field"><label for="bb-room">Ph\u00f2ng</label><div class="iwrap">${ic('bed-double')}${sel('bb-room', [['', 'Ch\u1ecdn ph\u00f2ng'], ...K.db.rooms.map((r) => [r.code, r.code + ' \u00b7 T\u1ea7ng ' + r.khu])], st.room)}</div></div>
              <div class="field"><label>Th\u1eddi \u0111i\u1ec3m</label><div class="bb-when"><div class="iwrap">${ic('calendar-days')}<input id="bb-date" type="date" class="input" value="${st.date}"></div><div class="iwrap">${ic('clock')}<input id="bb-time" type="time" class="input" value="${st.time}"></div></div></div>
              <div class="field"><label for="bb-place">\u0110\u1ecba \u0111i\u1ec3m</label><div class="iwrap">${ic('map-pin')}${sel('bb-place', [['', 'Ch\u1ecdn \u0111\u1ecba \u0111i\u1ec3m'], ...PLACES], st.place)}</div></div></div>
            <hr class="hr">
            <h2 class="numh"><span>2</span>N\u1ed9i dung ghi nh\u1eadn</h2>
            <div class="field" style="margin-top:12px"><label for="bb-rule">H\u00e0nh vi vi ph\u1ea1m (d\u1ef1 ki\u1ebfn)</label><div class="iwrap">${ic('file-text')}${sel('bb-rule', ruleOpts(), st.rule)}</div></div>
            <div class="field" style="margin-top:12px"><label for="bb-desc">M\u00f4 t\u1ea3 chi ti\u1ebft</label><div style="position:relative"><textarea id="bb-desc" class="textarea" data-max="500" style="min-height:110px" placeholder="M\u00f4 t\u1ea3 s\u1ef1 vi\u1ec7c, ng\u01b0\u1eddi ph\u00e1t hi\u1ec7n, t\u00ecnh tr\u1ea1ng c\u1ee5 th\u1ec3...">${esc(st.desc)}</textarea><span class="counter">0/500</span></div></div>
            <hr class="hr">
            <h2 class="numh"><span>3</span>Minh ch\u1ee9ng</h2><p class="lbl" style="margin:10px 0 8px;font-weight:500">H\u00ecnh \u1ea3nh, t\u00e0i li\u1ec7u li\u00ean quan</p>
            <div class="ev-tiles">${st.evidence.map((e, i) => `<div class="ev-tile has">${e.img ? `<img src="${K.A(e.img)}" alt="">` : `<span class="amen-ic red">${ic('file-text')}</span><small>${esc(e.name)}</small>`}<button class="ev-x" data-evdel="${i}" aria-label="X\u00f3a">${ic('x')}</button></div>`).join('')}
              <label class="ev-tile">${ic('image')}<b>\u1ea2nh hi\u1ec7n tr\u1ea1ng</b><small>JPG, PNG (t\u1ed1i \u0111a 5MB)</small><input type="file" accept="image/*" data-up="img"></label>
              <label class="ev-tile">${ic('file-text')}<b>T\u00e0i li\u1ec7u li\u00ean quan</b><small>PDF, DOC, DOCX (t\u1ed1i \u0111a 10MB)</small><input type="file" accept=".pdf,.doc,.docx" data-up="doc"></label>
              <label class="ev-tile add">${ic('circle-plus')}<b>Th\u00eam t\u1ec7p</b><small>Ch\u1ecdn ho\u1eb7c k\u00e9o th\u1ea3 t\u1ec7p</small><input type="file" multiple data-up="any"></label></div>
          </div>
          <div class="card pad" style="padding:20px 22px">
            <h2 class="card-t" style="font-size:21px">${ic('settings')}Th\u00f4ng tin x\u1eed l\u00fd</h2>
            <div class="field" style="margin-top:12px"><label for="bb-by">Ng\u01b0\u1eddi l\u1eadp bi\u00ean b\u1ea3n</label><div class="iwrap">${ic('user-round')}${sel('bb-by', ['C\u00e1n b\u1ed9 qu\u1ea3n l\u00fd', 'Ph\u1ea1m V\u0103n H\u00f9ng', 'L\u00ea Th\u1ecb Thu', 'B\u1ea3o v\u1ec7 ca t\u1ed1i', 'B\u1ea3o v\u1ec7 ca ng\u00e0y'], st.by)}</div></div>
            <div class="field" style="margin-top:12px"><span class="lbl">Tr\u1ea1ng th\u00e1i</span><div class="status-box"><i></i>${existing && existing.status !== 'nhap' ? VST[existing.status][0] : 'Ch\u01b0a x\u00e1c minh'}</div></div>
            <div class="field" style="margin-top:12px"><label for="bb-dept">Giao cho b\u1ed9 ph\u1eadn</label><div class="iwrap">${ic('users')}${sel('bb-dept', DEPTS, st.dept)}</div></div>
            <div class="field" style="margin-top:12px"><label for="bb-dl">H\u1ea1n x\u1eed l\u00fd x\u00e1c minh</label><div class="iwrap">${ic('calendar-days')}<input id="bb-dl" type="date" class="input" value="${st.deadline}"></div></div>
            <hr class="hr">
            <h3 class="card-t" style="font-size:18px">${ic('clipboard-check')}Danh s\u00e1ch ki\u1ec3m tra th\u00f4ng tin</h3>
            <div class="chk-list">${[['Th\u00f4ng tin sinh vi\u00ean', '\u0110\u00e3 c\u00f3 th\u00f4ng tin sinh vi\u00ean v\u00e0 ph\u00f2ng \u1edf'], ['Th\u1eddi gian, \u0111\u1ecba \u0111i\u1ec3m', '\u0110\u00e3 ghi nh\u1eadn th\u1eddi \u0111i\u1ec3m v\u00e0 \u0111\u1ecba \u0111i\u1ec3m x\u1ea3y ra'], ['Minh ch\u1ee9ng', '\u0110\u00e3 \u0111\u00ednh k\u00e8m h\u00ecnh \u1ea3nh, t\u00e0i li\u1ec7u li\u00ean quan']].map(([t, d], i) => `<div class="${chk[i] ? 'ok' : ''}"><span class="cbx">${chk[i] ? ic('check') : ''}</span><span><b>${t}</b><small>${d}</small></span></div>`).join('')}</div>
            <div class="note-card">${ic('info')}<span><b>Ch\u01b0a c\u00f3 k\u1ebft lu\u1eadn x\u1eed l\u00fd</b><small>Bi\u00ean b\u1ea3n \u0111ang \u1edf tr\u1ea1ng th\u00e1i b\u1ea3n nh\u00e1p. Vui l\u00f2ng chuy\u1ec3n x\u00e1c minh \u0111\u1ec3 b\u1ed9 ph\u1eadn li\u00ean quan xem x\u00e9t v\u00e0 x\u1eed l\u00fd theo quy \u0111\u1ecbnh.</small></span></div>
          </div></div>
        <div class="card actbar"><button class="btn btn-outline" data-go="ql-vi-pham">${ic('x')}H\u1ee7y</button><span style="flex:1"></span><button class="btn btn-outline" id="bb-draft">${ic('file-text')}L\u01b0u nh\u00e1p</button><button class="btn btn-red" id="bb-send">${ic('send')}Chuy\u1ec3n x\u00e1c minh</button></div>`);
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
          else if (f.size > 10 * 1024 * 1024) App.toast(f.name + ' v\u01b0\u1ee3t qu\u00e1 10MB', 'err');
          else st.evidence.push({ name: f.name, size: fileSize(f.size), doc: true });
        }
        App.refresh();
      });
      const save = (status) => {
        keep();
        if (!st.student) return App.toast('Ch\u1ecdn sinh vi\u00ean', 'err');
        if (!st.room) return App.toast('Ch\u1ecdn ph\u00f2ng', 'err');
        if (status !== 'nhap' && (!st.date || !st.time || !st.place)) return App.toast('Nh\u1eadp \u0111\u1ee7 th\u1eddi \u0111i\u1ec3m v\u00e0 \u0111\u1ecba \u0111i\u1ec3m tr\u01b0\u1edbc khi chuy\u1ec3n x\u00e1c minh', 'err');
        if (status !== 'nhap' && st.desc.trim().length < 10) return App.toast('M\u00f4 t\u1ea3 chi ti\u1ebft c\u1ea7n t\u1ed1i thi\u1ec3u 10 k\u00fd t\u1ef1', 'err');
        const existing = id && K.db.violations.find((v) => v.id === id);
        const rec = existing || { id: nextId(K.db.violations, 'VP-'), created: K.now() };
        Object.assign(rec, { student: st.student, room: st.room, rule: st.rule, title: rule(st.rule).name.replace(/ quy \u0111\u1ecbnh$/, ''), date: dmy(st.date), time: st.time, place: st.place, desc: st.desc.trim(), evidence: st.evidence, by: st.by, dept: st.dept, deadline: dmy(st.deadline), note: rec.note || '', status });
        if (!existing) K.db.violations.unshift(rec);
        if (status === 'cho-xac-minh') { notify(rec.student, 'B\u1ea1n c\u00f3 m\u1ed9t bi\u00ean b\u1ea3n ghi nh\u1eadn ' + rec.id, 'Bi\u00ean b\u1ea3n \u201c' + vTitle(rec) + '\u201d l\u00fac ' + rec.date + ' ' + rec.time + ' \u0111\u00e3 \u0111\u01b0\u1ee3c l\u1eadp v\u00e0 \u0111ang ch\u1edd x\u00e1c minh. Ban qu\u1ea3n l\u00fd c\u00f3 th\u1ec3 \u0111\u1ec1 ngh\u1ecb b\u1ea1n gi\u1ea3i tr\u00ecnh.'); log('L\u1eadp bi\u00ean b\u1ea3n', 'L\u1eadp bi\u00ean b\u1ea3n ' + rec.id + ' cho ' + sname(rec.student)); }
        K.save(); App.st['bb-' + (id || 'new')] = null; App.st.vp4 = Object.assign(App.st.vp4 || {}, { sel: rec.id, grp: '', status: '' });
        App.toast(status === 'nhap' ? '\u0110\u00e3 l\u01b0u nh\u00e1p bi\u00ean b\u1ea3n ' + rec.id : '\u0110\u00e3 chuy\u1ec3n x\u00e1c minh bi\u00ean b\u1ea3n ' + rec.id); App.go('ql-vi-pham');
      };
      root.querySelector('#bb-draft').onclick = () => save('nhap');
      root.querySelector('#bb-send').onclick = () => { keep(); if (!st.evidence.length) return App.confirm('Ch\u01b0a c\u00f3 minh ch\u1ee9ng', 'Bi\u00ean b\u1ea3n ch\u01b0a \u0111\u00ednh k\u00e8m h\u00ecnh \u1ea3nh ho\u1eb7c t\u00e0i li\u1ec7u. V\u1eabn chuy\u1ec3n x\u00e1c minh?', 'V\u1eabn chuy\u1ec3n', () => save('cho-xac-minh')); save('cho-xac-minh'); };
    },
  };

  // ============ Ban qu\u1ea3n l\u00fd: Danh m\u1ee5c n\u1ed9i quy & \u0111i\u1ec3m n\u1ec1 n\u1ebfp ============
  P['ql-noi-quy'] = {
    role: 'admin', title: 'Danh m\u1ee5c n\u1ed9i quy',
    render: () => {
      const st = App.state('nq4', { tab: 'rules' });
      const living = K.db.students.filter((s) => s.room);
      let body;
      if (st.tab === 'rules') body = `<div class="card pad"><div class="card-h"><div><h2 style="font-size:21px">Danh m\u1ee5c n\u1ed9i quy</h2><p class="muted small" style="margin-top:4px">M\u1ed7i sinh vi\u00ean c\u00f3 100 \u0111i\u1ec3m n\u1ec1 n\u1ebfp/n\u0103m h\u1ecdc. H\u1ed3 s\u01a1 k\u1ebft lu\u1eadn \u201cVi ph\u1ea1m\u201d tr\u1eeb \u0111i\u1ec3m theo b\u1ea3ng d\u01b0\u1edbi.</p></div><button class="btn btn-red" id="rl-new">${ic('plus')}Th\u00eam n\u1ed9i quy</button></div>
        <div class="tbl-wrap"><table class="tbl" style="font-size:14.5px"><thead><tr><th>M\u00e3</th><th>Nh\u00f3m</th><th>N\u1ed9i dung</th><th>M\u1ee9c \u0111\u1ed9</th><th class="c">Tr\u1eeb \u0111i\u1ec3m</th><th class="r">Ph\u1ea1t ti\u1ec1n</th><th class="c">H\u1ed3 s\u01a1</th><th></th></tr></thead><tbody>${K.db.rules.map((r) => `<tr><td>${r.id}</td><td><span class="badge b-gray b-sm">${r.cat}</span></td><td style="white-space:normal">${esc(r.name)}${r.note ? `<div class="small muted">${esc(r.note)}</div>` : ''}</td><td>${badge(LEVELS[r.level][0], LEVELS[r.level][1], { sm: true })}</td><td class="c"><b style="color:var(--red)">\u2212${r.points}</b></td><td class="r num">${r.fine ? money(r.fine) : '\u2014'}</td><td class="c num">${K.db.violations.filter((v) => v.rule === r.id && v.status !== 'nhap').length}</td><td class="r" style="white-space:nowrap"><button class="xbtn" data-rl="${r.id}" title="S\u1eeda">${ic('pencil')}</button><button class="xbtn" data-rldel="${r.id}" title="X\u00f3a" style="color:var(--red)">${ic('trash-2')}</button></td></tr>`).join('')}</tbody></table></div></div>`;
      else { const rows = living.map((s) => ({ s, p: points(s.id), n: K.db.violations.filter((v) => v.student === s.id && v.status !== 'nhap' && v.status !== 'da-huy').length })).sort((a, b) => a.p - b.p || b.n - a.n);
        body = `<div class="card pad"><div class="card-h"><h2 style="font-size:21px">\u0110i\u1ec3m n\u1ec1 n\u1ebfp sinh vi\u00ean \u0111ang \u1edf</h2><span class="muted small">S\u1eafp x\u1ebfp t\u1eeb \u0111i\u1ec3m th\u1ea5p nh\u1ea5t</span></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Sinh vi\u00ean</th><th>Ph\u00f2ng</th><th class="c">H\u1ed3 s\u01a1</th><th>\u0110i\u1ec3m</th><th>X\u1ebfp lo\u1ea1i</th></tr></thead><tbody>${rows.map(({ s, p, n }) => { const t = tier(p); return `<tr><td><span class="who">${av(s.avatar, 36)}<span><b>${esc(s.name)}</b><small>${s.id}</small></span></span></td><td>${s.room} \u00b7 T\u1ea7ng ${K.fl(s.room)}</td><td class="c num">${n}</td><td style="min-width:200px"><span class="row" style="gap:12px"><b class="num" style="width:34px;color:var(--navy)">${p}</b><span class="bar" style="flex:1"><i style="width:${p}%;background:${{ green: '#1f9a4b', blue: '#1d5bd8', orange: '#df8600', red: '#dc1f2e' }[t[1]]}"></i></span></span></td><td>${badge(t[0], t[1], { sm: true })}</td></tr>`; }).join('')}</tbody></table></div></div>`; }
      return V4.adminShell({ active: 'ql-vi-pham', search: 'T\u00ecm ki\u1ebfm sinh vi\u00ean, ph\u00f2ng, n\u1ed9i quy...' }, `${App.crumb([['N\u1ed9i quy & vi ph\u1ea1m', 'ql-vi-pham'], 'Danh m\u1ee5c n\u1ed9i quy'])}<h1 class="v4-title">Danh m\u1ee5c n\u1ed9i quy &amp; \u0111i\u1ec3m n\u1ec1 n\u1ebfp</h1>
        <div class="utabs boxed">${[['rules', 'N\u1ed9i quy', 'book-open'], ['score', '\u0110i\u1ec3m n\u1ec1 n\u1ebfp', 'award']].map(([k, t, i]) => `<button class="utab ${st.tab === k ? 'on' : ''}" data-tab="${k}">${ic(i)}${t}</button>`).join('')}</div>${body}`);
    },
    mount: (root) => {
      const st = App.st.nq4;
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      const form = (r) => `<div class="field"><label for="rf-name">N\u1ed9i dung n\u1ed9i quy</label><input id="rf-name" class="input" value="${r ? esc(r.name) : ''}"></div><div class="grid g2" style="gap:14px;margin-top:12px"><div class="field"><label for="rf-cat">Nh\u00f3m</label>${sel('rf-cat', CATS, r ? r.cat : CATS[0])}</div><div class="field"><label for="rf-level">M\u1ee9c \u0111\u1ed9</label>${sel('rf-level', Object.entries(LEVELS).map(([k, v]) => [k, v[0]]), r ? r.level : 'nhac-nho')}</div><div class="field"><label for="rf-points">Tr\u1eeb \u0111i\u1ec3m</label><input id="rf-points" type="number" min="0" max="50" class="input" value="${r ? r.points : 5}"></div><div class="field"><label for="rf-fine">Ph\u1ea1t ti\u1ec1n (\u0111)</label><input id="rf-fine" type="number" min="0" step="50000" class="input" value="${r ? r.fine : 0}"></div></div>`;
      const read = (el) => ({ name: el.querySelector('#rf-name').value.trim(), cat: el.querySelector('#rf-cat').value, level: el.querySelector('#rf-level').value, points: +el.querySelector('#rf-points').value, fine: +el.querySelector('#rf-fine').value });
      const nb = root.querySelector('#rl-new'); if (nb) nb.onclick = () => App.modal({ title: 'Th\u00eam n\u1ed9i quy', body: form(null), foot: '<button class="btn btn-outline" data-x>H\u1ee7y</button><button class="btn btn-red" data-ok>Th\u00eam</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const f = read(el); if (f.name.length < 8) return App.toast('N\u1ed9i dung c\u1ea7n t\u1ed1i thi\u1ec3u 8 k\u00fd t\u1ef1', 'err'); const id = 'R' + String(Math.max(...K.db.rules.map((r) => +r.id.slice(1))) + 1).padStart(2, '0'); K.db.rules.push(Object.assign({ id }, f)); K.save(); close(); App.toast('\u0110\u00e3 th\u00eam n\u1ed9i quy ' + id); App.refresh(); } });
      root.querySelectorAll('[data-rl]').forEach((b) => b.onclick = () => { const r = K.db.rules.find((x) => x.id === b.dataset.rl); App.modal({ title: 'S\u1eeda n\u1ed9i quy ' + r.id, body: form(r), foot: '<button class="btn btn-outline" data-x>H\u1ee7y</button><button class="btn btn-red" data-ok>L\u01b0u</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const f = read(el); if (f.name.length < 8) return App.toast('N\u1ed9i dung c\u1ea7n t\u1ed1i thi\u1ec3u 8 k\u00fd t\u1ef1', 'err'); Object.assign(r, f); K.save(); close(); App.toast('\u0110\u00e3 l\u01b0u n\u1ed9i quy'); App.refresh(); } }); });
      root.querySelectorAll('[data-rldel]').forEach((b) => b.onclick = () => { const r = K.db.rules.find((x) => x.id === b.dataset.rldel); if (K.db.violations.some((v) => v.rule === r.id)) return App.toast('N\u1ed9i quy \u0111\u00e3 c\u00f3 h\u1ed3 s\u01a1 li\u00ean quan, kh\u00f4ng th\u1ec3 x\u00f3a', 'err'); App.confirm('X\u00f3a n\u1ed9i quy', 'X\u00f3a <b>' + esc(r.name) + '</b>?', 'X\u00f3a', () => { K.db.rules = K.db.rules.filter((x) => x.id !== r.id); K.save(); App.refresh(); }, true); });
    },
  };

  // ============ Sinh vi\u00ean: N\u1ed9i quy & ph\u1ea3n h\u1ed3i ============
  P['sv-noi-quy'] = {
    role: 'student', title: 'N\u1ed9i quy & ph\u1ea3n h\u1ed3i',
    render: () => {
      const u = K.me(); const p = points(u.id), t = tier(p);
      const mine = K.db.violations.filter((v) => v.student === u.id && v.status !== 'nhap');
      const need = mine.find((v) => v.status === 'can-giai-trinh');
      const acked = K.db.ruleAck[u.id];
      const byCat = CATS.map((c) => [c, K.db.rules.filter((r) => r.cat === c)]).filter(([, rs]) => rs.length);
      return V4.svShell({ active: 'sv-noi-quy', search: 'T\u00ecm ki\u1ebfm th\u00f4ng b\u00e1o, d\u1ecbch v\u1ee5, h\u01b0\u1edbng d\u1eabn...' }, `
        <div class="phead v4h"><img class="art" src="${K.A('bn_giaitrinh')}" alt=""><h1>N\u1ed9i quy &amp; ph\u1ea3n h\u1ed3i ${demo}</h1><p class="desc">Theo d\u00f5i \u0111i\u1ec3m n\u1ec1 n\u1ebfp, h\u1ed3 s\u01a1 ghi nh\u1eadn v\u00e0 g\u1eedi gi\u1ea3i tr\u00ecnh cho Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1.</p></div>
        ${need ? `<a href="#" class="card alert-card" data-go="sv-giai-trinh-${need.id}">${ic('file-warning')}<span><b>H\u1ed3 s\u01a1 ${need.id} c\u1ea7n b\u1ea1n gi\u1ea3i tr\u00ecnh</b><small>${esc(vTitle(need))} \u00b7 H\u1ea1n g\u1eedi ${need.request ? need.request.due : ''}</small></span><span class="btn btn-red btn-sm">G\u1eedi gi\u1ea3i tr\u00ecnh ${ic('arrow-right')}</span></a>` : ''}
        <div class="grid resp-1" style="grid-template-columns:330px 1fr;gap:16px;align-items:start">
          <div class="card pad" style="text-align:center"><h2 class="card-t" style="justify-content:center;font-size:19px">${ic('award')}\u0110i\u1ec3m n\u1ec1 n\u1ebfp n\u0103m h\u1ecdc</h2>${scoreRing(p)}<div>${badge(t[0], t[1])}</div><p class="muted small" style="margin-top:10px;line-height:1.55">${t[2]}</p></div>
          <div class="card pad"><div class="card-h"><h2 class="card-t" style="font-size:19px">${ic('file-text')}H\u1ed3 s\u01a1 c\u1ee7a t\u00f4i</h2><span class="muted small">${mine.length} h\u1ed3 s\u01a1</span></div>
            ${mine.length ? mine.map((v) => `<a href="#" class="case-row" data-go="sv-giai-trinh-${v.id}"><span class="amen-ic ${v.status === 'can-giai-trinh' ? 'blue' : v.status === 'da-xu-ly' ? 'green' : 'amber'}">${ic('file-text')}</span><span style="flex:1;min-width:0"><b>${v.id} \u00b7 ${esc(vTitle(v))}</b><small>${v.date} \u00b7 Ph\u00f2ng ${v.room}${v.points ? ' \u00b7 \u2212' + v.points + ' \u0111i\u1ec3m' : ''}</small></span>${vBadge(v)}${ic('chevron-right')}</a>`).join('') : `<div class="empty" style="padding:30px"><span class="amen-ic green">${ic('badge-check')}</span><p>B\u1ea1n ch\u01b0a c\u00f3 h\u1ed3 s\u01a1 ghi nh\u1eadn n\u00e0o. Ti\u1ebfp t\u1ee5c gi\u1eef v\u1eefng nh\u00e9!</p></div>`}</div></div>
        <div class="card pad">${acked ? `<div class="reply-box" style="margin:0 0 14px">${ic('badge-check')}<b style="display:inline;margin-left:6px">B\u1ea1n \u0111\u00e3 x\u00e1c nh\u1eadn \u0111\u1ecdc n\u1ed9i quy l\u00fac ${acked}.</b></div>` : `<div class="reply-box" style="background:var(--orange-50);margin:0 0 14px;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span style="flex:1;color:var(--ink)">${ic('info')} Vui l\u00f2ng \u0111\u1ecdc k\u1ef9 n\u1ed9i quy v\u00e0 x\u00e1c nh\u1eadn. \u0110\u00e2y l\u00e0 c\u0103n c\u1ee9 \u0111\u1ec3 x\u00e9t gia h\u1ea1n l\u01b0u tr\u00fa.</span><button class="btn btn-red btn-sm" id="ack">T\u00f4i \u0111\u00e3 \u0111\u1ecdc v\u00e0 cam k\u1ebft tu\u00e2n th\u1ee7</button></div>`}
          <h2 class="card-t" style="font-size:19px">${ic('book-open')}N\u1ed9i quy k\u00fd t\u00fac x\u00e1</h2>${byCat.map(([c, rs]) => `<h3 style="font-size:16px;margin:14px 0 8px">${c}</h3><div class="tbl-wrap"><table class="tbl compact"><tbody>${rs.map((r) => `<tr><td style="white-space:normal">${esc(r.name)}</td><td style="width:130px">${badge(LEVELS[r.level][0], LEVELS[r.level][1], { sm: true })}</td><td style="width:110px" class="r"><b style="color:var(--red)">\u2212${r.points} \u0111i\u1ec3m</b></td><td style="width:120px" class="r">${r.fine ? money(r.fine) : ''}</td></tr>`).join('')}</tbody></table></div>`).join('')}</div>`);
    },
    mount: (root) => { const a = root.querySelector('#ack'); if (a) a.onclick = () => { K.db.ruleAck[K.me().id] = K.now(); K.save(); App.toast('C\u1ea3m \u01a1n b\u1ea1n \u0111\u00e3 x\u00e1c nh\u1eadn n\u1ed9i quy'); App.refresh(); }; },
  };

  // ============ Sinh vi\u00ean: Gi\u1ea3i tr\u00ecnh c\u1ee7a t\u00f4i (\u1ea3nh 6, 14) ============
  P['sv-giai-trinh'] = {
    role: 'student', title: 'Gi\u1ea3i tr\u00ecnh c\u1ee7a t\u00f4i',
    render: (id) => {
      const u = K.me();
      const mine = K.db.violations.filter((v) => v.student === u.id && v.status !== 'nhap');
      const v = mine.find((x) => x.id === id) || mine.find((x) => x.status === 'can-giai-trinh') || mine[0];
      const sh = (b) => V4.svShell({ active: 'sv-noi-quy', search: 'T\u00ecm ki\u1ebfm th\u00f4ng b\u00e1o, d\u1ecbch v\u1ee5, h\u01b0\u1edbng d\u1eabn...' }, `<div class="phead v4h"><img class="art" src="${K.A('bn_giaitrinh')}" alt=""><h1>Gi\u1ea3i tr\u00ecnh c\u1ee7a t\u00f4i ${demo}</h1><p class="desc">Xem chi ti\u1ebft ph\u1ea3n \u00e1nh v\u00e0 g\u1eedi gi\u1ea3i tr\u00ecnh cho Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1.</p></div>${b}`);
      if (!v) return sh(`<div class="card pad empty"><span class="amen-ic green">${ic('badge-check')}</span><p>B\u1ea1n kh\u00f4ng c\u00f3 h\u1ed3 s\u01a1 n\u00e0o c\u1ea7n gi\u1ea3i tr\u00ecnh.</p><button class="btn btn-outline" data-go="sv-noi-quy">V\u1ec1 N\u1ed9i quy &amp; ph\u1ea3n h\u1ed3i</button></div>`);
      const st = App.state('gt-' + v.id, () => Object.assign({ text: '', files: [] }, (K.db.drafts.gt || {})[v.id] || {}));
      const sent = !!v.explanation; const done = v.status === 'da-xu-ly' || v.status === 'da-huy';
      const c = v.conclusion;
      const result = done && c ? `<div class="result-card ${c.result === 'vi-pham' ? 'bad' : 'good'}"><span class="amen-ic ${c.result === 'vi-pham' ? 'red' : 'green'}">${ic(c.result === 'vi-pham' ? 'shield-alert' : 'badge-check')}</span><b>${c.result === 'vi-pham' ? 'K\u1ebft lu\u1eadn: Vi ph\u1ea1m' : c.result === 'khac-phuc' ? 'K\u1ebft lu\u1eadn: \u0110\u00e3 kh\u1eafc ph\u1ee5c' : 'K\u1ebft lu\u1eadn: Kh\u00f4ng vi ph\u1ea1m'}</b><p>${esc(c.text)}</p>${c.points ? `<span class="badge b-red">\u2212${c.points} \u0111i\u1ec3m n\u1ec1 n\u1ebfp</span>` : ''}<small class="muted">${c.at}</small></div>`
        : `<div class="result-empty">${ic('file-text')}<b>Ch\u01b0a c\u00f3 k\u1ebft lu\u1eadn</b><small>${sent ? 'Ban qu\u1ea3n l\u00fd \u0111ang xem x\u00e9t gi\u1ea3i tr\u00ecnh c\u1ee7a b\u1ea1n.' : 'H\u1ed3 s\u01a1 \u0111ang ch\u1edd b\u1ea1n g\u1eedi gi\u1ea3i tr\u00ecnh.'}<br>Sau khi c\u00f3 k\u1ebft lu\u1eadn, k\u1ebft qu\u1ea3 s\u1ebd hi\u1ec3n th\u1ecb t\u1ea1i \u0111\u00e2y.</small></div>`;
      const canReview = done && c && c.result === 'vi-pham' && !v.review;
      return sh(`
        <div class="card case-head">${ic('file-text')}<b>${v.id} \u00b7 ${v.request ? 'Ph\u1ea3n \u00e1nh ' : ''}${esc(vTitle(v).toLowerCase().replace(/^./, (m) => m))}</b>${vBadge(v, true)}<i class="sep"></i><span class="row" style="gap:10px">${ic('bed-double')}Ph\u00f2ng ${v.room}</span><span class="muted" style="margin-left:auto">Ng\u00e0y ghi nh\u1eadn: ${v.date}</span></div>
        <div class="grid resp-1" style="grid-template-columns:1fr 0.88fr;gap:16px;align-items:start">
          <div style="display:flex;flex-direction:column;gap:16px;min-width:0">
            <div class="card pad"><div class="card-h" style="margin-bottom:10px"><h2 class="card-t" style="font-size:19px">${ic('mail')}${v.request ? 'Ban qu\u1ea3n l\u00fd \u0111\u1ec1 ngh\u1ecb b\u1ed5 sung th\u00f4ng tin' : 'N\u1ed9i dung ghi nh\u1eadn'}</h2><small class="muted">${v.request ? v.request.at : v.created}</small></div>
              <div class="msg-card"><p style="white-space:pre-line">${esc(v.request ? v.request.text : v.desc)}</p>${v.request && v.request.due ? `<small class="muted">H\u1ea1n g\u1eedi gi\u1ea3i tr\u00ecnh: <b>${v.request.due}</b></small>` : ''}<button class="btn btn-soft btn-sm" id="gt-record">${ic('file-text')}Xem bi\u00ean b\u1ea3n</button></div></div>
            <div class="card pad"><h2 class="card-t" style="font-size:19px">${ic('file-text')}N\u1ed9i dung gi\u1ea3i tr\u00ecnh</h2>
              ${sent ? `<div class="msg-card" style="margin-top:12px;background:var(--green-50)"><p style="white-space:pre-line">${esc(v.explanation.text)}</p>${(v.explanation.files || []).length ? `<div class="files">${v.explanation.files.map((f) => `<span>${ic('paperclip')}${esc(f.name)}</span>`).join('')}</div>` : ''}<small class="muted">\u0110\u00e3 g\u1eedi l\u00fac ${v.explanation.at}</small></div>`
                : v.status === 'can-giai-trinh' ? `<div style="position:relative;margin-top:12px"><textarea id="gt-text" class="textarea" data-max="1000" style="min-height:130px" placeholder="Tr\u00ecnh b\u00e0y th\u00f4ng tin v\u00e0 t\u00ecnh hu\u1ed1ng li\u00ean quan...">${esc(st.text)}</textarea><span class="counter">0/1000</span></div>
                <h3 class="card-t" style="font-size:16px;margin-top:16px">${ic('paperclip')}\u0110\u00ednh k\u00e8m minh ch\u1ee9ng</h3><label class="drop" style="margin-top:10px">${ic('cloud-upload')}<span>K\u00e9o th\u1ea3 t\u1ec7p v\u00e0o \u0111\u00e2y ho\u1eb7c <b>ch\u1ecdn t\u1ec7p</b><br><small>H\u1ed7 tr\u1ee3 \u1ea3nh, PDF, t\u1ed1i \u0111a 10MB m\u1ed7i t\u1ec7p.</small></span><input type="file" id="gt-files" multiple accept="image/*,.pdf"></label>${st.files.length ? `<div class="files">${st.files.map((f, i) => `<span>${ic('paperclip')}${esc(f.name)} <button class="xbtn" data-fdel="${i}" style="padding:0">${ic('x')}</button></span>`).join('')}</div>` : ''}
                <p class="muted small row" style="margin-top:10px;gap:8px">${ic('info')}Ch\u1ec9 b\u1ea1n v\u00e0 ng\u01b0\u1eddi x\u1eed l\u00fd h\u1ed3 s\u01a1 xem n\u1ed9i dung n\u00e0y.</p>
                <div class="grid g2" style="gap:12px;margin-top:14px"><button class="btn btn-outline btn-lg" id="gt-draft">${ic('file-text')}L\u01b0u nh\u00e1p</button><button class="btn btn-red btn-lg" id="gt-send">${ic('send')}G\u1eedi gi\u1ea3i tr\u00ecnh</button></div>`
                : `<p class="muted" style="margin-top:12px">${v.status === 'cho-xac-minh' ? 'H\u1ed3 s\u01a1 \u0111ang \u0111\u01b0\u1ee3c x\u00e1c minh. N\u1ebfu c\u1ea7n, Ban qu\u1ea3n l\u00fd s\u1ebd \u0111\u1ec1 ngh\u1ecb b\u1ea1n gi\u1ea3i tr\u00ecnh.' : 'H\u1ed3 s\u01a1 kh\u00f4ng y\u00eau c\u1ea7u gi\u1ea3i tr\u00ecnh.'}</p>`}</div></div>
          <div style="display:flex;flex-direction:column;gap:16px">
            <div class="card pad"><h2 class="card-t" style="font-size:19px">${ic('clock')}Ti\u1ebfn tr\u00ecnh x\u1eed l\u00fd</h2><div style="margin-top:12px">${vline(vSteps(v, true), true)}</div></div>
            <div class="card pad result-wrap"><div><h2 class="card-t" style="font-size:19px">${ic('file-check')}K\u1ebft qu\u1ea3 x\u1eed l\u00fd</h2>${result}
              ${v.review ? `<div class="reply-box" style="background:var(--orange-50)"><b style="color:var(--orange)">\u0110\u1ec1 ngh\u1ecb xem l\u1ea1i c\u1ee7a b\u1ea1n</b><p>${esc(v.review.text)}</p>${v.review.answer ? `<p class="small">Tr\u1ea3 l\u1eddi: ${esc(v.review.answer)}</p>` : '<p class="small muted">\u0110ang ch\u1edd Ban qu\u1ea3n l\u00fd tr\u1ea3 l\u1eddi.</p>'}</div>` : ''}
              <button class="btn btn-block ${canReview ? 'btn-outline-red' : 'btn-disabled'}" id="gt-review" ${canReview ? '' : 'disabled'} style="margin-top:12px">${ic('clock')}G\u1eedi \u0111\u1ec1 ngh\u1ecb xem l\u1ea1i</button></div><img src="${K.A('art_writing')}" alt="" class="result-art"></div>
          </div></div>`);
    },
    mount: (root, id) => {
      const u = K.me(); const mine = K.db.violations.filter((v) => v.student === u.id && v.status !== 'nhap');
      const v = mine.find((x) => x.id === id) || mine.find((x) => x.status === 'can-giai-trinh') || mine[0]; if (!v) return;
      const st = App.st['gt-' + v.id];
      root.querySelector('#gt-record').onclick = () => V4.showRecord(v);
      const ta = root.querySelector('#gt-text'); if (ta) ta.addEventListener('input', () => { st.text = ta.value; });
      const fi = root.querySelector('#gt-files'); if (fi) fi.onchange = () => { [...fi.files].forEach((f) => { if (f.size > 10 * 1024 * 1024) App.toast(f.name + ' v\u01b0\u1ee3t qu\u00e1 10MB', 'err'); else st.files.push({ name: f.name, size: fileSize(f.size) }); }); App.refresh(); };
      root.querySelectorAll('[data-fdel]').forEach((b) => b.onclick = () => { st.files.splice(+b.dataset.fdel, 1); App.refresh(); });
      const dr = root.querySelector('#gt-draft'); if (dr) dr.onclick = () => { K.db.drafts.gt = K.db.drafts.gt || {}; K.db.drafts.gt[v.id] = { text: st.text, files: st.files }; K.save(); App.toast('\u0110\u00e3 l\u01b0u nh\u00e1p gi\u1ea3i tr\u00ecnh'); };
      const sd = root.querySelector('#gt-send'); if (sd) sd.onclick = () => {
        if (st.text.trim().length < 20) return App.toast('N\u1ed9i dung gi\u1ea3i tr\u00ecnh c\u1ea7n t\u1ed1i thi\u1ec3u 20 k\u00fd t\u1ef1', 'err');
        App.confirm('G\u1eedi gi\u1ea3i tr\u00ecnh', 'Sau khi g\u1eedi, b\u1ea1n kh\u00f4ng th\u1ec3 s\u1eeda n\u1ed9i dung gi\u1ea3i tr\u00ecnh. G\u1eedi cho Ban qu\u1ea3n l\u00fd?', 'G\u1eedi gi\u1ea3i tr\u00ecnh', () => {
          v.explanation = { text: st.text.trim(), files: st.files, at: K.now() }; v.status = 'da-giai-trinh';
          if (K.db.drafts.gt) delete K.db.drafts.gt[v.id];
          K.db.activity.unshift({ at: K.now(), by: u.name, av: u.avatar, act: 'G\u1eedi gi\u1ea3i tr\u00ecnh', icon: 'doc', text: u.name + ' g\u1eedi gi\u1ea3i tr\u00ecnh h\u1ed3 s\u01a1 ' + v.id });
          K.save(); App.toast('\u0110\u00e3 g\u1eedi gi\u1ea3i tr\u00ecnh. Ban qu\u1ea3n l\u00fd s\u1ebd xem x\u00e9t v\u00e0 th\u00f4ng b\u00e1o k\u1ebft qu\u1ea3.'); App.refresh();
        });
      };
      const rv = root.querySelector('#gt-review'); if (rv && !rv.disabled) rv.onclick = () => App.modal({ title: 'G\u1eedi \u0111\u1ec1 ngh\u1ecb xem l\u1ea1i ' + v.id, body: `<div class="field"><label for="rv-text">L\u00fd do \u0111\u1ec1 ngh\u1ecb xem l\u1ea1i</label><textarea id="rv-text" class="textarea" style="min-height:120px" placeholder="Tr\u00ecnh b\u00e0y c\u0103n c\u1ee9 (nh\u00e2n ch\u1ee9ng, th\u1eddi gian, h\u00ecnh \u1ea3nh...)"></textarea></div>`, foot: '<button class="btn btn-outline" data-x>H\u1ee7y</button><button class="btn btn-red" data-ok>G\u1eedi \u0111\u1ec1 ngh\u1ecb</button>', onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const t = el.querySelector('#rv-text').value.trim(); if (t.length < 20) return App.toast('N\u1ed9i dung c\u1ea7n t\u1ed1i thi\u1ec3u 20 k\u00fd t\u1ef1', 'err'); v.review = { text: t, at: K.now() }; K.save(); close(); App.toast('\u0110\u00e3 g\u1eedi \u0111\u1ec1 ngh\u1ecb xem l\u1ea1i'); App.refresh(); } });
    },
  };

  // ---------- t\u00e0i kho\u1ea3n sinh vi\u00ean: \u0111i\u1ec3m n\u1ec1 n\u1ebfp ----------
  const acc = P['sv-tai-khoan']; const accRender = acc.render;
  acc.render = (p) => { const u = K.me(); const pts = points(u.id), t = tier(pts); return accRender(p).replace('<div class="card pad" style="padding:18px 20px;overflow:hidden">', `<a href="#" class="card pad hover-lift" data-go="sv-noi-quy" style="display:flex;align-items:center;gap:16px;color:var(--ink)"><span class="amen-ic ${t[1] === 'orange' ? 'amber' : t[1]}">${ic('award')}</span><span style="flex:1"><small class="muted">\u0110i\u1ec3m n\u1ec1 n\u1ebfp</small><b style="display:block;color:var(--navy);font-size:22px">${pts}/100 \u00b7 ${t[0]}</b></span>${ic('chevron-right')}</a><div class="card pad" style="padding:18px 20px;overflow:hidden">`); };
})();
