/* D\u1eef li\u1ec7u m\u1eabu + kho l\u01b0u tr\u1eef (localStorage) cho h\u1ec7 th\u1ed1ng KTX */
(function () {
  const KEY = 'ktx-dhna-v3';
  const sceneGroups = {
    campus: 'banner_admin banner_beds banner_rooms banner_rooms_admin banner_students banner_welcome h_foot find_other side_admin_art side_admin_art2',
    login: 'login_art h_girl side_boy student_art',
    register: 'register_art h_ready art_writing',
    forgot: 'forgot_art',
    room2: 'room2 room_b201',
    room4: 'room4 h_room4 room_a302 room_a302_big room_a302_wide room_a302_admin room_b204 room_b204_big room_b204_wide detail_main bg_old bg_new bg_thumb cp_cur cp_new gh_room room_cur room_new stay_thumb',
    room6: 'room6 h_room6 room_c101',
    room8: 'room8',
    commons: 'h_common study banner_utility',
    community: 'h_guitar community cover_comm',
    documents: 'banner_profile banner_contract banner_extend bn_giahan bn_giaitrinh bn_vipham',
    finance: 'banner_invoice banner_pay banner_finance banner_report bn_phanbo fin_art invoice_promo',
    maintenance: 'banner_maint banner_repair bn_dien tech_art',
    transfer: 'banner_checkout banner_transfer bn_bangiao bn_chuyen bn_tamvang bn_traphong art_suitcase',
    security: 'banner_account banner_settings banner_support sec_art shield_key side_art5',
    'room-details': 'thumb_desk lamp',
    wardrobe: 'thumb_wardrobe',
    bath: 'thumb_bath',
    advisor: 'advisor',
    journey: 'h_cta',
    step1: 'step1',
    step2: 'step2',
    step3: 'step3',
  };
  const scenes = new Map(Object.entries(sceneGroups).flatMap(([file, keys]) => keys.split(' ').map((key) => [key, file])));
  const icons = /^(?:bldg|am_(?:desk|wardrobe|wc|wifi)|as_(?:bed|doc|invoice|wrench)|bed_(?:blue|gray|green|red|yellow)|fs_(?:ok|wait|warn)|ic_(?:bed_blue|bldg_blue|building_sm|cap|clipboard|contract|doc_red|invoice|megaphone|people|room_red|shieldmail|wrench_big)|ni_(?:doc|invoice|megaphone|wrench)|pm_(?:bank|counter|wallet)|qa_(?:extend|feedback|repair|transfer)|ri_(?:bulb|faucet|socket)|rs_(?:bed|door|people)|st_(?:due|paid|wait))$/;
  const A = (key) => {
    const name = String(key || '');
    if (/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(name)) return name;
    if (name === 'logo') return 'assets/brand/nau-mark.png';
    if (icons.test(name)) return 'assets/cinema/icons/' + name + '.svg';
    if (scenes.has(name)) return 'assets/cinema/' + scenes.get(name) + '.webp';
    return 'assets/' + encodeURIComponent(name) + '.jpg';
  };
  const roomArt = (r) => ({ 2: 'room2', 4: 'room4', 6: 'room6', 8: 'room8' }[r?.beds] || r?.img || 'room4');

  function genRooms() {
    const rooms = [];
    const add = (r) => rooms.push(Object.assign({ amen: ['wifi', 'desk', 'balcony', 'wardrobe', 'fan'], extra: 0, maint: false }, r));
    // Khu A: 32 ph\u00f2ng, t\u1ea7ng 1\u20134, 8 ph\u00f2ng/t\u1ea7ng
    const aType = (f, i) => (f === 3 ? 4 : (f === 4 ? (i <= 6 ? 6 : 4) : (i <= 5 ? 6 : 4)));
    for (let f = 1; f <= 4; f++) for (let i = 1; i <= 8; i++) {
      const code = 'A' + f + '0' + i;
      add({ code, khu: 'A', floor: f, beds: aType(f, i), price: aType(f, i) === 4 ? 500000 : 420000, img: 'room_a302' });
    }
    // Khu B: 28 ph\u00f2ng, t\u1ea7ng 1\u20134, 7 ph\u00f2ng/t\u1ea7ng
    for (let f = 1; f <= 4; f++) for (let i = 1; i <= 7; i++) {
      const code = 'B' + f + '0' + i;
      const beds = i === 1 ? (f >= 3 ? 6 : 2) : (i <= 4 ? 4 : 8);
      add({ code, khu: 'B', floor: f, beds, price: beds === 2 ? 750000 : beds === 4 ? 500000 : beds === 6 ? 420000 : 380000, img: beds === 2 ? 'room_b201' : beds === 4 ? 'room_b204' : 'room_c101' });
    }
    // Khu C: 24 ph\u00f2ng, t\u1ea7ng 1\u20134, 6 ph\u00f2ng/t\u1ea7ng
    for (let f = 1; f <= 4; f++) for (let i = 1; i <= 6; i++) {
      const code = 'C' + f + '0' + i;
      const beds = i <= 4 ? 6 : 8;
      add({ code, khu: 'C', floor: f, beds, price: beds === 6 ? 420000 : 380000, img: 'room_c101' });
    }
    return rooms;
  }

  /* M\u1ed7i gi\u01b0\u1eddng \u0111ang c\u00f3 ng\u01b0\u1eddi \u1edf \u0111\u1ec1u l\u00e0 m\u1ed9t h\u1ed3 s\u01a1 sinh vi\u00ean th\u1eadt (h\u1ecd t\u00ean, m\u00e3 SV, khoa, l\u1edbp, h\u1ee3p \u0111\u1ed3ng, h\u00f3a \u0111\u01a1n),
     \u0111\u1ec3 danh s\u00e1ch, th\u1ed1ng k\u00ea, c\u00f4ng n\u1ee3 v\u00e0 \u0111\u1ed1i so\u00e1t kh\u1edbp v\u1edbi s\u1ed1 gi\u01b0\u1eddng \u0111ang s\u1eed d\u1ee5ng. Sinh ng\u1eabu nhi\u00ean c\u00f3 h\u1ea1t gi\u1ed1ng c\u1ed1 \u0111\u1ecbnh. */
  function populate(rooms, students, contracts, invoices, bedHistory) {
    let seedN = 20261112;
    const rnd = () => { seedN |= 0; seedN = (seedN + 0x6D2B79F5) | 0; let t = Math.imul(seedN ^ (seedN >>> 15), 1 | seedN); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const HO = ['Nguy\u1ec5n', 'Tr\u1ea7n', 'L\u00ea', 'Ph\u1ea1m', 'Ho\u00e0ng', 'Phan', 'V\u0169', 'V\u00f5', '\u0110\u1eb7ng', 'B\u00f9i', '\u0110\u1ed7', 'H\u1ed3', 'Ng\u00f4', 'D\u01b0\u01a1ng', 'L\u00fd', '\u0110inh', 'Cao', 'L\u01b0\u01a1ng', 'Th\u00e1i', 'H\u00e0', 'Chu', 'T\u1ea1', 'Mai', 'Tr\u1ecbnh', 'Nguy\u1ec5n', 'Tr\u1ea7n', 'L\u00ea', 'Nguy\u1ec5n'];
    const M = { dem: ['V\u0103n', '\u0110\u1ee9c', 'Minh', 'Quang', 'H\u1eefu', 'C\u00f4ng', 'Xu\u00e2n', 'Th\u00e0nh', 'Duy', 'Anh', 'Tr\u1ecdng', 'Gia', '\u0110\u00ecnh', 'Ti\u1ebfn'], ten: ['H\u00f9ng', 'D\u0169ng', 'Nam', 'Long', 'Ph\u00fac', 'Hi\u1ebfu', 'Tu\u1ea5n', 'Kh\u00e1nh', 'S\u01a1n', 'Th\u1eafng', '\u0110\u1ea1t', 'Huy', 'B\u1ea3o', 'Ki\u00ean', 'L\u00e2m', 'H\u01b0ng', 'Qu\u00e2n', 'T\u00e0i', 'Vinh', 'Phong', 'Th\u1ecbnh', 'Trung', 'Ho\u00e0ng', 'Ngh\u0129a', 'To\u00e0n', 'T\u00fa', 'C\u01b0\u1eddng', 'L\u1ef1c', 'H\u1ea3i', 'Th\u00e1i'], av: ['av_giabao', 'av_hoanganh', 'av_minhduc', 'av_nguyenhai', 'av_quanghuy', 'av_tranminh', 'av_trungkien'] };
    const F = { dem: ['Th\u1ecb', 'Ng\u1ecdc', 'Thu', 'Thanh', 'Ph\u01b0\u01a1ng', 'Kh\u00e1nh', 'B\u1ea3o', 'Mai', 'Di\u1ec7u', 'H\u1ed3ng', 'Minh', 'Ho\u00e0i', 'Th\u00f9y', 'Kim'], ten: ['H\u01b0\u01a1ng', 'Lan', 'Linh', 'Trang', 'Huy\u1ec1n', 'Ng\u00e2n', 'Th\u1ea3o', 'H\u00e0', 'Nhung', 'Y\u1ebfn', 'Vy', 'Qu\u1ef3nh', 'My', 'Anh', 'H\u1eb1ng', 'Uy\u00ean', 'Nhi', 'Hi\u1ec1n', 'Loan', 'Trinh', 'Th\u01b0', 'Giang', 'Ch\u00e2u', 'Ly', 'Dung', 'Oanh', 'T\u00e2m', 'Ph\u01b0\u01a1ng'], av: ['av_baongoc', 'av_lananh', 'av_lephuong', 'av_mailinh', 'av_minhchau', 'av_vungoc'] };
    const FAC = [['C\u00f4ng ngh\u1ec7 th\u00f4ng tin', 'CNTT'], ['Kinh t\u1ebf', 'KT'], ['K\u1ebf to\u00e1n \u2013 T\u00e0i ch\u00ednh', 'KTTC'], ['Ngo\u1ea1i ng\u1eef', 'NN'], ['S\u01b0 ph\u1ea1m', 'SP'], ['N\u00f4ng L\u00e2m Ng\u01b0', 'NLN'], ['Khoa h\u1ecdc x\u00e3 h\u1ed9i', 'KHXH'], ['Du l\u1ecbch \u2013 Kh\u00e1ch s\u1ea1n', 'DL']];
    const COURSE = [['26', '2026 \u2013 2030', 0.42], ['25', '2025 \u2013 2029', 0.3], ['24', '2024 \u2013 2028', 0.2], ['23', '2023 \u2013 2027', 0.08]];
    const seq = { 26: 1000, 25: 2000, 24: 3000, 23: 4000 };
    const P2 = (n) => String(n).padStart(2, '0');
    let ci = 0, ii = 0;
    rooms.forEach((r) => {
      if (!r.extra) return;
      const named = students.filter((s) => s.room === r.code && s.status === 'dang-o');
      const used = new Set(named.map((s) => s.bed));
      // ph\u00f2ng \u1edf theo gi\u1edbi t\u00ednh: theo ng\u01b0\u1eddi \u0111ang \u1edf (n\u1ebfu c\u00f3), c\u00f2n l\u1ea1i chia theo d\u00e3y v\u00e0 t\u1ea7ng
      const fem = named.length ? named.filter((s) => F.av.includes(s.avatar)).length * 2 > named.length : (r.code[0] === 'C' || (r.code[0] === 'B' && r.floor >= 3));
      const G = fem ? F : M;
      let left = r.extra;
      for (let b = 1; b <= r.beds && left > 0; b++) {
        if (used.has(b)) continue;
        left--;
        let u = rnd(), k = 0; while (k < COURSE.length - 1 && u > COURSE[k][2]) { u -= COURSE[k][2]; k++; }
        const [yy, course] = COURSE[k];
        const id = 'SV' + yy + String(++seq[yy]).padStart(4, '0');
        const [fac, ab] = pick(FAC);
        const name = pick(HO) + ' ' + pick(G.dem) + ' ' + pick(G.ten);
        const since = yy === '26' ? P2(1 + Math.floor(rnd() * 5)) + '/09/2026' : P2(15 + Math.floor(rnd() * 14)) + '/08/2026';
        students.push({ id, name, email: id.toLowerCase() + '@st.dhna.edu.vn', phone: '09' + String(10000000 + Math.floor(rnd() * 89999999)), room: r.code, bed: b, avatar: pick(G.av), faculty: fac, cls: ab + ' K' + yy + (rnd() < 0.5 ? 'A' : 'B'), course, password: '12345678', status: 'dang-o', since, gender: fem ? 'nu' : 'nam', emergency: { name: '', relation: '', phone: '' }, gen: true });
        bedHistory.push({ d: since, s: name + ' (' + id + ')', bed: P2(b), act: 'Ph\u00e2n gi\u01b0\u1eddng', by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', room: r.code });
        contracts.push({ id: 'HD26-' + String(++ci).padStart(4, '0'), student: id, room: r.code, khu: String(r.floor), bed: P2(b) + ' / ' + P2(r.beds), term: '2026 \u2013 2027', status: 'hieu-luc', fee: r.price, handover: { done: true, date: since }, file: 'Thoa_thuan_luu_tru_HD26-' + String(ci).padStart(4, '0') + '.pdf', updated: since, history: [{ d: since, t: 'T\u1ea1o h\u1ee3p \u0111\u1ed3ng l\u01b0u tr\u00fa' }] });
        const bill = (period, dueDay) => {
          const mm = period.slice(0, 2);
          return { id: 'H\u0110' + mm + '26-' + String(1000 + (++ii)).slice(-4), student: id, period, room: r.code, khu: String(r.floor), items: [{ name: 'Ti\u1ec1n ph\u00f2ng (th\u00e1ng ' + period + ')', amount: r.price }, { name: 'Ti\u1ec1n \u0111i\u1ec7n (theo \u0111\u1ecbnh m\u1ee9c)', amount: 30000 }, { name: 'Ti\u1ec1n n\u01b0\u1edbc (theo \u0111\u1ecbnh m\u1ee9c)', amount: 20000 }], total: r.price + 50000, due: dueDay + '/' + period };
        };
        const sep = bill('09/2026', '25'); const d9 = P2(5 + Math.floor(rnd() * 19));
        Object.assign(sep, { status: 'da-tt', paidAt: d9 + '/09/2026 ' + P2(7 + Math.floor(rnd() * 14)) + ':' + P2(Math.floor(rnd() * 60)), txn: 'GD-9' + String(ii).padStart(4, '0'), confirmed: true });
        if (yy !== '26' || rnd() < 0.5) invoices.push(sep);
        const oct = bill('10/2026', '25'); const x = rnd(); const d10 = P2(3 + Math.floor(rnd() * 22));
        if (x < 0.8) Object.assign(oct, { status: 'da-tt', paidAt: d10 + '/10/2026 ' + P2(7 + Math.floor(rnd() * 14)) + ':' + P2(Math.floor(rnd() * 60)), txn: 'GD-1' + String(ii).padStart(4, '0'), confirmed: true });
        else if (x < 0.88) Object.assign(oct, { status: 'chua-tt', recv: { txn: 'GD-1' + String(ii).padStart(4, '0'), at: d10 + '/10/2026 20:15', amount: oct.total, note: 'Thanh toan phi KTX T10 ' + id, file: 'Chung_tu_' + id + '.pdf', size: '0,5 MB' } });
        else oct.status = 'chua-tt';
        invoices.push(oct);
      }
      r.extra = 0;
    });
  }

  function seed() {
    const rooms = genRooms();
    const R = (c) => rooms.find((r) => r.code === c);
    // ph\u00f2ng t\u1ea7ng 3 khu A theo \u0111\u00fang s\u01a1 \u0111\u1ed3 qu\u1ea3n l\u00fd
    const a3 = { A301: [4, 4], A302: [4, 4], A303: [4, 2], A304: [4, 0], A305: [4, 0], A306: [4, 3], A307: [4, 4], A308: [4, 1] };
    Object.entries(a3).forEach(([c, [b, o]]) => { const r = R(c); r.beds = b; r.price = 500000; r.extra = o; });
    R('A305').maint = true; R('A305').extra = 0;
    R('A302').extra = 0; R('A302').amen = ['wifi', 'desk', 'balcony', 'wardrobe', 'ac', 'fan'];
    R('B204').beds = 4; R('B204').extra = 0; R('B204').img = 'room_b204'; R('B204').area = 20; R('B204').amen = ['wifi', 'desk', 'balcony', 'wardrobe', 'wc'];
    R('B201').beds = 2; R('B201').extra = 1; R('B201').img = 'room_b201';
    R('C101').beds = 6; R('C101').extra = 2; R('C101').img = 'room_c101';
    R('C203').extra = 5;
    // ph\u00e2n b\u1ed5 ng\u01b0\u1eddi \u1edf \u0111\u1ec3 \u0111\u1ea1t \u0111\u00fang s\u1ed1 li\u1ec7u t\u1ed5ng (A 128/160, B 144/160, C 112/160)
    const target = { A: 128, B: 144, C: 112 };
    const named = { A302: 4, B204: 3, C101: 1, C203: 1 };
    ['A', 'B', 'C'].forEach((k) => {
      const list = rooms.filter((r) => r.khu === k);
      const fixed = new Set(k === 'A' ? Object.keys(a3) : ['B204', 'B201', 'C101', 'C203']);
      let total = list.reduce((s, r) => s + (fixed.has(r.code) ? r.extra + (named[r.code] || 0) : 0), 0);
      const free = list.filter((r) => !fixed.has(r.code));
      free.forEach((r) => { r.extra = 0; });
      let need = target[k] - total, i = 0, guard = 0;
      while (need > 0 && guard < 5000) { const r = free[i % free.length]; if (r.extra < r.beds) { r.extra++; need--; } i++; guard++; }
    });

    const S = (o) => Object.assign({ faculty: 'C\u00f4ng ngh\u1ec7 th\u00f4ng tin', cls: 'CNTT K26', course: '2026 \u2013 2030', password: '12345678', status: 'dang-o', emergency: { name: '', relation: '', phone: '' } }, o);
    const students = [
      S({ id: 'SV260001', name: 'Tu\u1ea5n Anh', email: 'tuananh@example.com', phone: '0912341234', room: 'A302', bed: 3, avatar: 'av_tuananh', photo: 'photo_tuananh', big: 'av_tuananh_big' }),
      S({ id: 'SV260002', name: 'Minh \u0110\u1ee9c', email: 'minhduc@example.com', phone: '0912000002', room: 'A302', bed: 1, avatar: 'av_minhduc' }),
      S({ id: 'SV260003', name: 'Ho\u00e0ng Anh', email: 'hoanganh@example.com', phone: '0912000003', room: 'A302', bed: 2, avatar: 'av_hoanganh' }),
      S({ id: 'SV260004', name: 'Minh Ch\u00e2u', email: 'minhchau@example.com', phone: '0912000004', room: 'A302', bed: 4, avatar: 'av_minhchau', faculty: 'Kinh t\u1ebf', cls: 'KT K26' }),
      S({ id: 'SV260010', name: 'Quang Huy', email: 'quanghuy@example.com', phone: '0912000010', room: 'B204', bed: 1, avatar: 'av_quanghuy' }),
      S({ id: 'SV260011', name: 'Gia B\u1ea3o', email: 'giabao@example.com', phone: '0912000011', room: 'B204', bed: 2, avatar: 'av_giabao' }),
      S({ id: 'SV260014', name: 'Trung Ki\u00ean', email: 'trungkien@example.com', phone: '0912000014', room: 'B204', bed: 3, avatar: 'av_trungkien' }),
      S({ id: 'SV260012', name: 'Nguy\u1ec5n H\u1ea3i', email: 'nguyenhai@example.com', phone: '0912000034', room: null, bed: null, status: 'cho-phan-phong', avatar: 'av_nguyenhai', photo: 'student_art' }),
      S({ id: 'SV260018', name: 'Mai Linh', email: 'mailinh@example.com', phone: '0912000018', room: 'C101', bed: 2, avatar: 'av_mailinh', faculty: 'Ngo\u1ea1i ng\u1eef', cls: 'NN K26' }),
      S({ id: 'SV260021', name: 'B\u1ea3o Ng\u1ecdc', email: 'baongoc@example.com', phone: '0912000021', room: null, bed: null, status: 'da-tra', avatar: 'av_baongoc', faculty: 'S\u01b0 ph\u1ea1m', cls: 'SP K25' }),
      S({ id: 'SV260033', name: 'Lan Anh', email: 'lananh@example.com', phone: '0912000033', room: 'C203', bed: 1, avatar: 'av_lananh', faculty: 'Ngo\u1ea1i ng\u1eef', cls: 'NN K26', hidden: true }),
      S({ id: 'SV260023', name: 'L\u00ea Ph\u01b0\u01a1ng', email: 'lephuong@example.com', phone: '0912000023', room: null, bed: null, status: 'cho-phan-phong', avatar: 'av_lephuong', hidden: true }),
      S({ id: 'SV260031', name: 'Tr\u1ea7n Minh', email: 'tranminh@example.com', phone: '0912000031', room: null, bed: null, status: 'cho-phan-phong', avatar: 'av_tranminh', hidden: true }),
      S({ id: 'SV260045', name: 'V\u0169 Ng\u1ecdc', email: 'vungoc@example.com', phone: '0912000045', room: null, bed: null, status: 'cho-phan-phong', avatar: 'av_vungoc', hidden: true }),
    ];
    students[0].emergency = { name: '', relation: '', phone: '' };

    const docs4 = () => [
      { name: 'Gi\u1ea5y x\u00e1c nh\u1eadn sinh vi\u00ean', ok: true }, { name: 'CCCD (b\u1ea3n sao)', ok: true },
      { name: '\u1ea2nh th\u1ebb 3x4', ok: true }, { name: '\u0110\u01a1n \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa', ok: true }];
    const applications = [
      { id: 'HS2026-0008', student: 'SV260001', type: '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa m\u1edbi', room: 'A302', bed: 3, term: '2026 \u2013 2027', period: 'T\u1eeb 09/2026 \u0111\u1ebfn 06/2027', date: '12/09/2026 14:20', status: 'da-duyet', docs: docs4(), confirmed: false,
        history: [{ t: 'Sinh vi\u00ean n\u1ed9p h\u1ed3 s\u01a1', d: '12/09/2026 14:20', s: 'B\u1ea1n \u0111\u00e3 g\u1eedi h\u1ed3 s\u01a1 \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa.' }, { t: '\u0110\u00e3 duy\u1ec7t', d: '15/09/2026 09:15', s: 'H\u1ed3 s\u01a1 \u0111\u01b0\u1ee3c ph\u00ea duy\u1ec7t. Vui l\u00f2ng \u0111\u1ecdc v\u00e0 x\u00e1c nh\u1eadn th\u1ecfa thu\u1eadn l\u01b0u tr\u00fa.' }] },
      { id: 'HS2026-0031', student: 'SV260023', type: '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa m\u1edbi', room: 'A101', bed: 2, term: '2026 \u2013 2027', period: 'T\u1eeb 09/2026 \u0111\u1ebfn 06/2027', date: '14/10/2026 10:05', status: 'cho-duyet', docs: docs4(), history: [{ t: 'Sinh vi\u00ean n\u1ed9p h\u1ed3 s\u01a1', d: '14/10/2026 10:05', s: 'H\u1ed3 s\u01a1 \u0111\u01b0\u1ee3c g\u1eedi l\u00ean h\u1ec7 th\u1ed1ng.' }, { t: 'Ch\u1edd x\u00e9t duy\u1ec7t', d: '14/10/2026 10:05', s: 'H\u1ed3 s\u01a1 \u0111ang ch\u1edd c\u00e1n b\u1ed9 qu\u1ea3n l\u00fd xem x\u00e9t.' }] },
      { id: 'HS2026-0030', student: 'SV260031', type: 'Gia h\u1ea1n l\u01b0u tr\u00fa n\u0103m h\u1ecdc 2026 \u2013 2027', room: 'C105', bed: 1, term: '2026 \u2013 2027', period: 'T\u1eeb 09/2026 \u0111\u1ebfn 06/2027', date: '13/10/2026 16:40', status: 'cho-duyet', docs: docs4(), history: [{ t: 'Sinh vi\u00ean n\u1ed9p h\u1ed3 s\u01a1', d: '13/10/2026 16:40', s: 'H\u1ed3 s\u01a1 \u0111\u01b0\u1ee3c g\u1eedi l\u00ean h\u1ec7 th\u1ed1ng.' }, { t: 'Ch\u1edd x\u00e9t duy\u1ec7t', d: '13/10/2026 16:40', s: 'H\u1ed3 s\u01a1 \u0111ang ch\u1edd c\u00e1n b\u1ed9 qu\u1ea3n l\u00fd xem x\u00e9t.' }] },
      { id: 'HS2026-0029', student: 'SV260045', type: 'Chuy\u1ec3n ph\u00f2ng (sang ph\u00f2ng B302)', room: 'B302', bed: 3, term: '2026 \u2013 2027', period: 'T\u1eeb 09/2026 \u0111\u1ebfn 06/2027', date: '12/10/2026 15:10', status: 'cho-duyet', docs: docs4(), history: [{ t: 'Sinh vi\u00ean n\u1ed9p h\u1ed3 s\u01a1', d: '12/10/2026 15:10', s: 'H\u1ed3 s\u01a1 \u0111\u01b0\u1ee3c g\u1eedi l\u00ean h\u1ec7 th\u1ed1ng.' }, { t: 'Ch\u1edd x\u00e9t duy\u1ec7t', d: '12/10/2026 15:10', s: 'H\u1ed3 s\u01a1 \u0111ang ch\u1edd c\u00e1n b\u1ed9 qu\u1ea3n l\u00fd xem x\u00e9t.' }] },
      { id: 'HS2026-0028', student: 'SV260012', type: '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa m\u1edbi', room: 'B204', bed: 4, term: '2026 \u2013 2027', period: 'T\u1eeb 09/2026 \u0111\u1ebfn 06/2027', date: '12/10/2026 08:30', status: 'cho-duyet', docs: docs4(), history: [{ t: 'Sinh vi\u00ean n\u1ed9p h\u1ed3 s\u01a1', d: '12/10/2026 08:30', s: 'H\u1ed3 s\u01a1 \u0111\u01b0\u1ee3c g\u1eedi l\u00ean h\u1ec7 th\u1ed1ng.' }, { t: 'Ch\u1edd x\u00e9t duy\u1ec7t', d: '12/10/2026 08:30', s: 'H\u1ed3 s\u01a1 \u0111ang ch\u1edd c\u00e1n b\u1ed9 qu\u1ea3n l\u00fd xem x\u00e9t.' }] },
      { id: 'HS2026-0019', student: 'SV260018', type: '\u0110\u0103ng k\u00fd l\u01b0u tr\u00fa m\u1edbi', room: 'C101', bed: 2, term: '2026 \u2013 2027', period: 'T\u1eeb 09/2026 \u0111\u1ebfn 06/2027', date: '20/08/2026 09:00', status: 'can-bo-sung', docs: [{ name: 'Gi\u1ea5y x\u00e1c nh\u1eadn sinh vi\u00ean', ok: true }, { name: 'CCCD (b\u1ea3n sao)', ok: false }, { name: '\u1ea2nh th\u1ebb 3x4', ok: true }, { name: '\u0110\u01a1n \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa', ok: true }], history: [{ t: 'Sinh vi\u00ean n\u1ed9p h\u1ed3 s\u01a1', d: '20/08/2026 09:00', s: 'H\u1ed3 s\u01a1 \u0111\u01b0\u1ee3c g\u1eedi l\u00ean h\u1ec7 th\u1ed1ng.' }, { t: 'Y\u00eau c\u1ea7u b\u1ed5 sung', d: '22/08/2026 10:00', s: 'Thi\u1ebfu b\u1ea3n sao CCCD.' }] },
    ];

    const inv = (id, sid, period, status, extra) => Object.assign({ id, student: sid, period, room: 'A302', khu: '3', items: [{ name: 'Ti\u1ec1n ph\u00f2ng (th\u00e1ng ' + period + ')', amount: 500000 }, { name: 'Ti\u1ec1n \u0111i\u1ec7n (theo \u0111\u1ecbnh m\u1ee9c)', amount: 30000 }, { name: 'Ti\u1ec1n n\u01b0\u1edbc (theo \u0111\u1ecbnh m\u1ee9c)', amount: 20000 }], total: 550000, status }, extra || {});
    const invoices = [
      inv('H\u01101026-001', 'SV260001', '10/2026', 'chua-tt', { due: '25/10/2026', recv: { txn: 'GD-026', at: '15/10/2026 14:32', amount: 550000, note: 'Thanh to\u00e1n ph\u00ed KTX th\u00e1ng 10/2026', file: 'Chung_tu_GD-026.pdf', size: '0,8 MB' } }),
      inv('H\u01100926-001', 'SV260001', '09/2026', 'da-tt', { paidAt: '20/09/2026 10:12', txn: 'GD-019' }),
      inv('H\u01100826-001', 'SV260001', '08/2026', 'da-tt', { paidAt: '18/08/2026 08:40', txn: 'GD-011' }),
      inv('H\u01100726-001', 'SV260001', '07/2026', 'da-tt', { paidAt: '21/07/2026 19:02', txn: 'GD-004' }),
      inv('H\u01101026-002', 'SV260002', '10/2026', 'da-tt', { paidAt: '14/10/2026 09:15', txn: 'GD-024', confirmed: true }),
      inv('H\u01101026-003', 'SV260003', '10/2026', 'chua-tt'),
      inv('H\u01101026-004', 'SV260004', '10/2026', 'cho-doi-soat', { paidAt: '15/10/2026 08:02', txn: 'GD-027', note: 'Thanh to\u00e1n ph\u00ed KTX th\u00e1ng 10/2026', recv: { txn: 'GD-027', at: '15/10/2026 08:02', amount: 550000, note: 'Thanh toan phi KTX T10 SV260004', file: 'Chung_tu_GD-027.pdf', size: '0,6 MB' } }),
    ];

    const repairs = [
      { id: 'SC-026', code: '#PX20261012-001', title: 'B\u00f3ng \u0111\u00e8n b\u00e0n h\u1ecdc kh\u00f4ng s\u00e1ng', short: 'B\u00f3ng \u0111\u00e8n b\u00e0n h\u1ecdc', summary: 'B\u00f3ng \u0111\u00e8n \u1edf b\u00e0n h\u1ecdc trong ph\u00f2ng kh\u00f4ng s\u00e1ng, \u0111\u00e3 th\u1eed thay nh\u01b0ng v\u1eabn kh\u00f4ng \u0111\u01b0\u1ee3c.', desc: 'B\u00f3ng \u0111\u00e8n b\u00e0n h\u1ecdc t\u1ea1i gi\u01b0\u1eddng s\u1ed1 03 kh\u00f4ng s\u00e1ng, \u0111\u00e3 th\u1eed thay b\u00f3ng nh\u01b0ng v\u1eabn kh\u00f4ng ho\u1ea1t \u0111\u1ed9ng. Mong b\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt ki\u1ec3m tra v\u00e0 h\u1ed7 tr\u1ee3 s\u1eeda ch\u1eefa.', student: 'SV260001', room: 'A302', loc: 'A302 \u00b7 Gi\u01b0\u1eddng 03', place: 'T\u1ea7ng 3', category: 'Thi\u1ebft b\u1ecb \u0111i\u1ec7n', kind: '\u0110i\u1ec7n', icon: 'bulb', prio: 'Trung b\u00ecnh', status: 'dang-xu-ly', date: '12/10/2026 14:20', kdate: '08/10/2026', staff: 'L\u00ea Minh T\u00e2m', dept: 'B\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt', schedule: '13/10/2026 14:00 - 16:00', planDate: '2026-10-08', photo: 'lamp',
        steps: [{ t: '\u0110\u00e3 ti\u1ebfp nh\u1eadn', d: '12/10/2026 14:20', s: 'Y\u00eau c\u1ea7u c\u1ee7a b\u1ea1n \u0111\u00e3 \u0111\u01b0\u1ee3c ghi nh\u1eadn.' }, { t: '\u0110\u00e3 ph\u00e2n c\u00f4ng', d: '12/10/2026 15:05', s: '\u0110\u00e3 chuy\u1ec3n \u0111\u1ebfn b\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt.' }, { t: '\u0110ang s\u1eeda ch\u1eefa', d: '', s: 'D\u1ef1 ki\u1ebfn x\u1eed l\u00fd trong chi\u1ec1u 13/10/2026.' }, { t: 'Ho\u00e0n t\u1ea5t', d: '', s: 'S\u1ebd th\u00f4ng b\u00e1o khi ho\u00e0n th\u00e0nh.' }],
        msgs: [
          { who: 'Tu\u1ea5n Anh', av: 'av_tuananh', d: '12/10/2026 14:20', m: 'B\u00f3ng \u0111\u00e8n b\u00e0n h\u1ecdc t\u1ea1i gi\u01b0\u1eddng s\u1ed1 03 kh\u00f4ng s\u00e1ng, \u0111\u00e3 th\u1eed thay b\u00f3ng nh\u01b0ng v\u1eabn kh\u00f4ng ho\u1ea1t \u0111\u1ed9ng. Mong b\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt ki\u1ec3m tra v\u00e0 h\u1ed7 tr\u1ee3 s\u1eeda ch\u1eefa.' },
          { who: 'B\u1ed9 ph\u1eadn qu\u1ea3n l\u00fd KTX', av: 'av_manager_f', d: '12/10/2026 15:05', m: 'Ch\u00fang t\u00f4i \u0111\u00e3 ti\u1ebfp nh\u1eadn y\u00eau c\u1ea7u c\u1ee7a b\u1ea1n v\u00e0 \u0111\u00e3 ph\u00e2n c\u00f4ng b\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt ki\u1ec3m tra. B\u1ea1n s\u1ebd \u0111\u01b0\u1ee3c th\u00f4ng b\u00e1o khi c\u00f3 l\u1ecbch x\u1eed l\u00fd c\u1ee5 th\u1ec3.' },
          { who: 'Nh\u00e2n vi\u00ean k\u1ef9 thu\u1eadt', av: 'av_tech', d: '13/10/2026 09:30', m: 'Ch\u00fang t\u00f4i s\u1ebd ki\u1ec3m tra v\u00e0 s\u1eeda ch\u1eefa trong chi\u1ec1u nay (13/10/2026).\nB\u1ea1n vui l\u00f2ng gi\u1eef nguy\u00ean hi\u1ec7n tr\u1ea1ng, k\u1ef9 thu\u1eadt vi\u00ean s\u1ebd li\u00ean h\u1ec7 tr\u01b0\u1edbc khi \u0111\u1ebfn.' }] },
      { id: 'SC-023', code: '#PX20261008-001', title: 'V\u00f2i n\u01b0\u1edbc b\u1ecb r\u00f2', short: 'V\u00f2i n\u01b0\u1edbc b\u1ecb r\u00f2', desc: 'V\u00f2i n\u01b0\u1edbc trong ph\u00f2ng t\u1eafm b\u1ecb r\u00f2, n\u01b0\u1edbc ch\u1ea3y li\u00ean t\u1ee5c d\u00f9 \u0111\u00e3 kh\u00f3a.', student: 'SV260001', room: 'A302', loc: 'A302 \u00b7 Ph\u00f2ng t\u1eafm', place: 'T\u1ea7ng 3', category: 'H\u1ec7 th\u1ed1ng n\u01b0\u1edbc', kind: 'H\u1ec7 th\u1ed1ng n\u01b0\u1edbc', icon: 'faucet', prio: 'Trung b\u00ecnh', status: 'moi', date: '08/10/2026 10:00', kdate: '08/10/2026', staff: '', dept: 'B\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt', schedule: '', msgs: [], steps: null },
      { id: 'SC-019', code: '#PX20260928-001', title: 'Ki\u1ec3m tra \u1ed5 c\u1eafm', short: 'Ki\u1ec3m tra \u1ed5 c\u1eafm', desc: '\u0110\u1ec1 ngh\u1ecb ki\u1ec3m tra \u1ed5 c\u1eafm g\u1ea7n gi\u01b0\u1eddng s\u1ed1 3, hi\u1ec7n \u0111\u00e3 ho\u1ea1t \u0111\u1ed9ng b\u00ecnh th\u01b0\u1eddng. C\u1ea3m \u01a1n!', student: 'SV260001', room: 'A302', loc: 'A302 \u00b7 Ph\u00f2ng \u1edf', place: 'T\u1ea7ng 3', category: 'Thi\u1ebft b\u1ecb \u0111i\u1ec7n', kind: '\u0110i\u1ec7n', icon: 'socket', prio: 'Th\u1ea5p', status: 'hoan-tat', date: '28/09/2026 09:00', kdate: '28/09/2026', staff: 'Ho\u00e0ng V\u0103n Khoa', dept: 'B\u1ed9 ph\u1eadn k\u1ef9 thu\u1eadt', schedule: '', msgs: [], steps: null },
      { id: 'SC-028', title: 'V\u00f2i n\u01b0\u1edbc r\u00f2 r\u1ec9', loc: 'B204 \u00b7 Ph\u00f2ng t\u1eafm', place: 'T\u1ea7ng 2', room: 'B204', kind: 'H\u1ec7 th\u1ed1ng n\u01b0\u1edbc', category: 'H\u1ec7 th\u1ed1ng n\u01b0\u1edbc', prio: 'Trung b\u00ecnh', status: 'moi', kdate: '10/10/2026', staff: '', desc: 'V\u00f2i n\u01b0\u1edbc ph\u00f2ng t\u1eafm r\u00f2 r\u1ec9 li\u00ean t\u1ee5c.' },
      { id: 'SC-029', title: 'C\u1eeda t\u1ee7 b\u1ecb k\u1eb9t', loc: 'C101 \u00b7 Ph\u00f2ng \u1edf', place: 'T\u1ea7ng 1', room: 'C101', kind: '\u0110\u1ed3 d\u00f9ng ph\u00f2ng', category: '\u0110\u1ed3 d\u00f9ng ph\u00f2ng', prio: 'Th\u1ea5p', status: 'moi', kdate: '09/10/2026', staff: '', desc: 'C\u1eeda t\u1ee7 c\u00e1 nh\u00e2n b\u1ecb k\u1eb9t, kh\u00f3 m\u1edf.' },
      { id: 'SC-027', title: '\u0110i\u1ec1u h\u00f2a kh\u00f4ng m\u00e1t', loc: 'B301 \u00b7 Ph\u00f2ng \u1edf', place: 'T\u1ea7ng 3', room: 'B301', kind: '\u0110i\u1ec1u h\u00f2a', category: '\u0110i\u1ec1u h\u00f2a', prio: 'Cao', status: 'phan-cong', kdate: '09/10/2026', staff: 'Nguy\u1ec5n V\u0103n H\u00f9ng', desc: '\u0110i\u1ec1u h\u00f2a ch\u1ea1y nh\u01b0ng kh\u00f4ng m\u00e1t.' },
      { id: 'SC-030', title: '\u1ed4 c\u1eafm \u0111i\u1ec7n l\u1ecfng', loc: 'A102 \u00b7 Ph\u00f2ng \u1edf', place: 'T\u1ea7ng 1', room: 'A102', kind: '\u0110i\u1ec7n', category: 'Thi\u1ebft b\u1ecb \u0111i\u1ec7n', prio: 'Trung b\u00ecnh', status: 'phan-cong', kdate: '08/10/2026', staff: 'Tr\u1ea7n Qu\u1ed1c Nam', desc: '\u1ed4 c\u1eafm g\u1ea7n b\u00e0n h\u1ecdc b\u1ecb l\u1ecfng.' },
      { id: 'SC-031', title: 'Qu\u1ea1t tr\u1ea7n c\u00f3 ti\u1ebfng k\u00eau', loc: 'A201 \u00b7 Ph\u00f2ng \u1edf', place: 'T\u1ea7ng 2', room: 'A201', kind: 'Qu\u1ea1t', category: 'Qu\u1ea1t', prio: 'Th\u1ea5p', status: 'dang-xu-ly', kdate: '07/10/2026', staff: 'Ph\u1ea1m \u0110\u1ee9c Duy', desc: 'Qu\u1ea1t tr\u1ea7n k\u00eau to khi b\u1eadt s\u1ed1 l\u1edbn.' },
      { id: 'SC-024', title: 'Th\u00f4ng b\u1ed3n r\u1eeda m\u1eb7t', loc: 'A301 \u00b7 Ph\u00f2ng t\u1eafm', place: 'T\u1ea7ng 3', room: 'A301', kind: 'H\u1ec7 th\u1ed1ng n\u01b0\u1edbc', category: 'H\u1ec7 th\u1ed1ng n\u01b0\u1edbc', prio: 'Th\u1ea5p', status: 'hoan-tat', kdate: '06/10/2026', staff: 'Ho\u00e0ng V\u0103n Khoa', desc: 'B\u1ed3n r\u1eeda m\u1eb7t tho\u00e1t n\u01b0\u1edbc ch\u1eadm.' },
      { id: 'SC-025', title: 'Thay kh\u00f3a c\u1eeda ph\u00f2ng', loc: 'B105 \u00b7 Ph\u00f2ng \u1edf', place: 'T\u1ea7ng 1', room: 'B105', kind: 'Kh\u00f3a c\u1eeda', category: 'Kh\u00f3a c\u1eeda', prio: 'Trung b\u00ecnh', status: 'hoan-tat', kdate: '05/10/2026', staff: 'Ng\u00f4 Anh Tu\u1ea5n', desc: 'Kh\u00f3a c\u1eeda ph\u00f2ng b\u1ecb h\u1ecfng.' },
    ];

    const notifications = [
      { id: 'N7', title: 'Sinh ho\u1ea1t c\u1ed9ng \u0111\u1ed3ng k\u00fd t\u00fac x\u00e1', summary: 'C\u00f9ng tham gia c\u00e1c ho\u1ea1t \u0111\u1ed9ng g\u1eafn k\u1ebft, lan t\u1ecfa tinh th\u1ea7n sinh vi\u00ean KTX...', cat: 'Ho\u1ea1t \u0111\u1ed9ng', icon: 'ni_megaphone', time: '2 gi\u1edd tr\u01b0\u1edbc', author: 'Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', month: 'Th\u00e1ng 10/2026', img: 'community_big', read: false,
        body: ['Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1 t\u1ed5 ch\u1ee9c \u0111\u1ee3t sinh ho\u1ea1t c\u1ed9ng \u0111\u1ed3ng v\u1edbi nhi\u1ec1u ho\u1ea1t \u0111\u1ed9ng \u00fd ngh\u0129a nh\u01b0 giao l\u01b0u v\u0103n ngh\u1ec7, tr\u00f2 ch\u01a1i nh\u00f3m, chia s\u1ebb kinh nghi\u1ec7m h\u1ecdc t\u1eadp v\u00e0 k\u1ef9 n\u0103ng s\u1ed1ng.', '\u0110\u00e2y l\u00e0 d\u1ecbp \u0111\u1ec3 c\u00e1c b\u1ea1n sinh vi\u00ean g\u1eb7p g\u1ee1, k\u1ebft n\u1ed1i, x\u00e2y d\u1ef1ng m\u00f4i tr\u01b0\u1eddng s\u1ed1ng th\u00e2n thi\u1ec7n, v\u0103n minh t\u1ea1i k\u00fd t\u00fac x\u00e1. R\u1ea5t mong c\u00e1c b\u1ea1n t\u00edch c\u1ef1c tham gia v\u00e0 theo d\u00f5i c\u00e1c th\u00f4ng tin ti\u1ebfp theo tr\u00ean website v\u00e0 b\u1ea3ng tin KTX.'] },
      { id: 'N6', title: 'Th\u00f4ng b\u00e1o thu ti\u1ec1n ph\u00f2ng th\u00e1ng 10/2026', summary: 'Vui l\u00f2ng thanh to\u00e1n tr\u01b0\u1edbc ng\u00e0y 25/10/2026 \u0111\u1ec3 tr\u00e1nh ph\u00e1t sinh ph\u00ed.', cat: 'L\u01b0u tr\u00fa', icon: 'ni_invoice', time: 'H\u00f4m nay', dash: 'H\u00f4m nay', important: true, author: 'Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', month: 'Th\u00e1ng 10/2026', read: false,
        body: ['H\u00f3a \u0111\u01a1n ti\u1ec1n ph\u00f2ng th\u00e1ng 10/2026 \u0111\u00e3 \u0111\u01b0\u1ee3c ph\u00e1t h\u00e0nh tr\u00ean c\u1ed5ng sinh vi\u00ean.', 'Vui l\u00f2ng thanh to\u00e1n tr\u01b0\u1edbc ng\u00e0y 25/10/2026 \u0111\u1ec3 tr\u00e1nh ph\u00e1t sinh ph\u00ed. Sinh vi\u00ean c\u00f3 th\u1ec3 thanh to\u00e1n b\u1eb1ng chuy\u1ec3n kho\u1ea3n, v\u00ed \u0111i\u1ec7n t\u1eed ho\u1eb7c t\u1ea1i qu\u1ea7y.'] },
      { id: 'N5', title: 'H\u01b0\u1edbng d\u1eabn \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa', summary: 'H\u01b0\u1edbng d\u1eabn chi ti\u1ebft quy tr\u00ecnh \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa n\u0103m h\u1ecdc 2026 \u2013 2027.', cat: 'L\u01b0u tr\u00fa', icon: 'ni_doc', time: '1 ng\u00e0y tr\u01b0\u1edbc', author: 'Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', month: 'Th\u00e1ng 10/2026', read: false,
        body: ['Sinh vi\u00ean \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa n\u0103m h\u1ecdc 2026 \u2013 2027 th\u1ef1c hi\u1ec7n theo 3 b\u01b0\u1edbc: ch\u1ecdn ph\u00f2ng, \u0111i\u1ec1n th\u00f4ng tin \u0111\u0103ng k\u00fd v\u00e0 g\u1eedi h\u1ed3 s\u01a1 tr\u1ef1c tuy\u1ebfn.', 'H\u1ed3 s\u01a1 c\u1ea7n c\u00f3: gi\u1ea5y x\u00e1c nh\u1eadn sinh vi\u00ean, b\u1ea3n sao CCCD, \u1ea3nh th\u1ebb 3x4 v\u00e0 \u0111\u01a1n \u0111\u0103ng k\u00fd l\u01b0u tr\u00fa.'] },
      { id: 'N4', title: 'L\u1ecbch ki\u1ec3m tra thi\u1ebft b\u1ecb ph\u00f2ng \u1edf', summary: 'Ban qu\u1ea3n l\u00fd s\u1ebd ki\u1ec3m tra \u0111\u1ecbnh k\u1ef3 t\u1eeb 15/10 \u0111\u1ebfn 17/10/2026.', cat: 'Ho\u1ea1t \u0111\u1ed9ng', icon: 'ni_wrench', time: 'H\u00f4m qua', dash: 'H\u00f4m qua', important: true, author: 'Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', month: 'Th\u00e1ng 10/2026', read: true,
        body: ['Ban qu\u1ea3n l\u00fd s\u1ebd ki\u1ec3m tra \u0111\u1ecbnh k\u1ef3 thi\u1ebft b\u1ecb \u0111i\u1ec7n, n\u01b0\u1edbc t\u1ea1i c\u00e1c ph\u00f2ng \u1edf t\u1eeb 15/10 \u0111\u1ebfn 17/10/2026.', 'Sinh vi\u00ean vui l\u00f2ng s\u1eafp x\u1ebfp \u0111\u1ed3 \u0111\u1ea1c g\u1ecdn g\u00e0ng \u0111\u1ec3 thu\u1eadn ti\u1ec7n cho vi\u1ec7c ki\u1ec3m tra.'] },
      { id: 'N3', title: 'L\u1ecbch ki\u1ec3m tra thi\u1ebft b\u1ecb', summary: 'Th\u00f4ng b\u00e1o l\u1ecbch ki\u1ec3m tra \u0111i\u1ec7n, n\u01b0\u1edbc t\u1ea1i c\u00e1c t\u1ea7ng k\u00fd t\u00fac x\u00e1.', cat: 'Ho\u1ea1t \u0111\u1ed9ng', icon: 'ni_wrench', time: '3 ng\u00e0y tr\u01b0\u1edbc', author: 'Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', month: 'Th\u00e1ng 10/2026', read: true,
        body: ['Th\u00f4ng b\u00e1o l\u1ecbch ki\u1ec3m tra \u0111i\u1ec7n, n\u01b0\u1edbc t\u1ea1i 4 t\u1ea7ng k\u00fd t\u00fac x\u00e1 trong th\u00e1ng 10/2026.'] },
      { id: 'N2', title: 'Th\u00f4ng b\u00e1o \u0111\u0103ng k\u00fd gia h\u1ea1n l\u01b0u tr\u00fa n\u0103m 2026 \u2013 2027', summary: 'Sinh vi\u00ean vui l\u00f2ng \u0111\u0103ng k\u00fd tr\u01b0\u1edbc ng\u00e0y 30/11/2026.', cat: 'L\u01b0u tr\u00fa', icon: 'ni_doc', time: '12/10/2026', dash: '12/10/2026', important: true, author: 'Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', month: 'Th\u00e1ng 10/2026', read: true,
        body: ['Sinh vi\u00ean c\u00f3 nhu c\u1ea7u ti\u1ebfp t\u1ee5c l\u01b0u tr\u00fa h\u1ecdc k\u1ef3 II n\u0103m h\u1ecdc 2026 \u2013 2027 vui l\u00f2ng \u0111\u0103ng k\u00fd gia h\u1ea1n tr\u01b0\u1edbc ng\u00e0y 30/11/2026 t\u1ea1i m\u1ee5c L\u01b0u tr\u00fa > Gia h\u1ea1n.'] },
      { id: 'N1', title: 'Th\u00f4ng tin thanh to\u00e1n', summary: 'H\u00f3a \u0111\u01a1n ti\u1ec1n ph\u00f2ng th\u00e1ng 10/2026 \u0111\u00e3 \u0111\u01b0\u1ee3c ph\u00e1t h\u00e0nh.', cat: 'L\u01b0u tr\u00fa', icon: 'ni_invoice', time: '5 ng\u00e0y tr\u01b0\u1edbc', author: 'Ban qu\u1ea3n l\u00fd k\u00fd t\u00fac x\u00e1', month: 'Th\u00e1ng 10/2026', read: true,
        body: ['H\u00f3a \u0111\u01a1n ti\u1ec1n ph\u00f2ng th\u00e1ng 10/2026 \u0111\u00e3 \u0111\u01b0\u1ee3c ph\u00e1t h\u00e0nh. Sinh vi\u00ean ki\u1ec3m tra t\u1ea1i m\u1ee5c H\u00f3a \u0111\u01a1n.'] },
    ];

    const contracts = [
      { id: 'HD1026-001', student: 'SV260001', room: 'A302', khu: '3', bed: '03 / 04', term: '2026 \u2013 2027', status: 'hieu-luc', fee: 500000, handover: { done: true, date: '01/09/2026' }, file: 'Thoa_thuan_luu_tru_HD1026-001.pdf', updated: '01/09/2026', history: [{ d: '01/09/2026', t: 'T\u1ea1o h\u1ee3p \u0111\u1ed3ng l\u01b0u tr\u00fa' }, { d: '15/08/2026', t: 'C\u1eadp nh\u1eadt th\u00f4ng tin ph\u00f2ng' }] },
      { id: 'HD1026-002', student: 'SV260010', room: 'B204', khu: '2', bed: '01 / 04', term: '2026 \u2013 2027', status: 'hieu-luc', fee: 500000, handover: { done: true, date: '01/09/2026' }, file: 'Thoa_thuan_luu_tru_HD1026-002.pdf', updated: '01/09/2026', history: [{ d: '01/09/2026', t: 'T\u1ea1o h\u1ee3p \u0111\u1ed3ng l\u01b0u tr\u00fa' }] },
      { id: 'HD1026-003', student: 'SV260018', room: 'C101', khu: '1', bed: '02 / 06', term: '2026 \u2013 2027', status: 'cho-ban-giao', fee: 420000, handover: { done: false, date: '' }, file: 'Thoa_thuan_luu_tru_HD1026-003.pdf', updated: '05/09/2026', history: [{ d: '05/09/2026', t: 'T\u1ea1o h\u1ee3p \u0111\u1ed3ng l\u01b0u tr\u00fa' }] },
      { id: 'HD1026-004', student: 'SV260033', room: 'C203', khu: '2', bed: '01 / 06', term: '2026 \u2013 2027', status: 'hieu-luc', fee: 420000, handover: { done: true, date: '02/09/2026' }, file: 'Thoa_thuan_luu_tru_HD1026-004.pdf', updated: '02/09/2026', history: [{ d: '02/09/2026', t: 'T\u1ea1o h\u1ee3p \u0111\u1ed3ng l\u01b0u tr\u00fa' }] },
    ];
    const C = (id, sid, room, bed, status, extra) => contracts.push(Object.assign({ id, student: sid, room, khu: room[1], bed, term: '2026 \u2013 2027', status, fee: K_PRICE[room[0]], handover: { done: status !== 'cho-ban-giao', date: status !== 'cho-ban-giao' ? '01/09/2026' : '' }, file: 'Thoa_thuan_luu_tru_' + id + '.pdf', updated: '01/09/2026', history: [{ d: '01/09/2026', t: 'T\u1ea1o h\u1ee3p \u0111\u1ed3ng l\u01b0u tr\u00fa' }] }, extra || {}));
    const K_PRICE = { A: 500000, B: 500000, C: 420000 };
    C('HD1026-005', 'SV260002', 'A302', '01 / 04', 'hieu-luc'); C('HD1026-006', 'SV260003', 'A302', '02 / 04', 'hieu-luc'); C('HD1026-007', 'SV260004', 'A302', '04 / 04', 'hieu-luc');
    C('HD1026-008', 'SV260014', 'B204', '03 / 04', 'cho-ban-giao');
    C('HD1026-009', 'SV260011', 'B204', '02 / 04', 'gia-han', { term: '2026 \u2013 2027 (gia h\u1ea1n HK II)' });
    [['SV250077', '\u0110\u1ed7 Thu H\u00e0', 'C304', 'av_vungoc'], ['SV250081', 'L\u01b0\u01a1ng V\u0103n \u0110\u1ea1t', 'B305', 'av_tranminh']].forEach(([sid, name, room, avt], i) => C('HD0926-0' + (10 + i), sid, room, '0' + (i + 2) + ' / 06', 'gia-han', { name, avatar: avt, term: '2026 \u2013 2027 (gia h\u1ea1n HK II)' }));
    const ended = [['SV260021', 'B\u1ea3o Ng\u1ecdc', 'C102', 'av_baongoc'], ['SV250118', 'Ph\u1ea1m Tu\u1ea5n', 'B204', 'av_trungkien'], ['SV250102', 'Ng\u00f4 Minh Khang', 'A105', 'av_hoanganh'], ['SV250095', 'Tr\u1ecbnh Thu Trang', 'C201', 'av_mailinh'], ['SV250090', 'H\u1ed3 \u0110\u1ee9c Long', 'B102', 'av_minhduc'], ['SV250088', 'Phan Th\u1ea3o Vy', 'C303', 'av_lephuong'], ['SV250085', '\u0110\u1eb7ng Qu\u1ed1c Vi\u1ec7t', 'A208', 'av_quanghuy'], ['SV250083', 'Mai Anh Th\u01b0', 'C106', 'av_vungoc'], ['SV250079', 'L\u00fd Gia Huy', 'B403', 'av_giabao'], ['SV250074', 'V\u00f5 Th\u1ecb H\u1ea1nh', 'C402', 'av_lananh'], ['SV250070', 'B\u00f9i V\u0103n S\u01a1n', 'A407', 'av_tranminh'], ['SV250066', 'Cao Ng\u1ecdc \u00c1nh', 'C204', 'av_minhchau'], ['SV250061', 'T\u1ea1 Minh Nh\u1eadt', 'B306', 'av_nguyenhai'], ['SV250057', '\u0110inh Kh\u00e1nh Ly', 'C305', 'av_baongoc'], ['SV250052', 'Ki\u1ec1u Thanh T\u00f9ng', 'A403', 'av_trungkien']];
    ended.forEach(([sid, name, room, avt], i) => C('HD0825-' + String(100 + i), sid, room, '0' + (1 + (i % 4)) + ' / 0' + (room[0] === 'C' ? 6 : 4), 'ket-thuc', { name, avatar: avt, term: '2025 \u2013 2026', handover: { done: true, date: '30/06/2026' }, updated: '30/06/2026', history: [{ d: '30/06/2026', t: 'K\u1ebft th\u00fac h\u1ee3p \u0111\u1ed3ng, tr\u1ea3 ph\u00f2ng' }, { d: '01/09/2025', t: 'T\u1ea1o h\u1ee3p \u0111\u1ed3ng l\u01b0u tr\u00fa' }] }));

    const feedback = [
      { id: 'PA-12', student: 'SV260001', date: '12/10/2026', title: '\u0110\u00e8n h\u00e0nh lang t\u1ea7ng 3 th\u01b0\u1eddng xuy\u00ean b\u1ecb h\u1ecfng', type: 'Ph\u1ea3n \u00e1nh', status: 'da-phan-hoi', body: '\u0110\u00e8n h\u00e0nh lang t\u1ea7ng 3 th\u01b0\u1eddng xuy\u00ean b\u1ecb h\u1ecfng.', reply: 'Ban qu\u1ea3n l\u00fd \u0111\u00e3 thay m\u1edbi to\u00e0n b\u1ed9 \u0111\u00e8n h\u00e0nh lang t\u1ea7ng 3 ng\u00e0y 14/10/2026.' },
      { id: 'PA-09', student: 'SV260001', date: '28/09/2026', title: '\u0110\u1ec1 ngh\u1ecb b\u1ed5 sung th\u00f9ng r\u00e1c khu v\u1ef1c s\u00e2n sau', type: 'G\u00f3p \u00fd', status: 'dang-tiep-nhan', body: '\u0110\u1ec1 ngh\u1ecb b\u1ed5 sung th\u00f9ng r\u00e1c t\u1ea1i khu v\u1ef1c s\u00e2n sau t\u00f2a nh\u00e0.' },
    ];

    const activity = [
      { at: '15/10/2026 09:24', by: 'Ph\u1ea1m V\u0103n H\u00f9ng', av: 'av_hung', act: 'Duy\u1ec7t h\u1ed3 s\u01a1', icon: 'ok', text: 'Duy\u1ec7t h\u1ed3 s\u01a1 l\u01b0u tr\u00fa cho sinh vi\u00ean Tr\u1ea7n Minh Qu\u00e2n (SV260097)' },
      { at: '15/10/2026 08:41', by: 'L\u00ea Th\u1ecb Thu', av: 'av_thu', act: 'T\u1ea1o y\u00eau c\u1ea7u b\u1ea3o tr\u00ec', icon: 'wrench', text: 'T\u1ea1o y\u00eau c\u1ea7u s\u1eeda ch\u1eefa thi\u1ebft b\u1ecb \u0111i\u1ec7n t\u1ea1i ph\u00f2ng B201' },
      { at: '14/10/2026 16:15', by: 'Nguy\u1ec5n V\u0103n Nam', av: 'av_hung', act: 'Thanh to\u00e1n h\u00f3a \u0111\u01a1n', icon: 'doc', text: 'C\u1eadp nh\u1eadt thanh to\u00e1n h\u00f3a \u0111\u01a1n H\u01101025-118 (09/2026) cho sinh vi\u00ean \u0110\u1eb7ng Ho\u00e0ng Nam' },
    ];

    const bedHistory = [
      { d: '05/09/2026', s: 'Trung Ki\u00ean (SV260014)', bed: '03', act: 'Ph\u00e2n gi\u01b0\u1eddng', by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', room: 'B204' },
      { d: '05/09/2026', s: 'Gia B\u1ea3o (SV260011)', bed: '02', act: 'Ph\u00e2n gi\u01b0\u1eddng', by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', room: 'B204' },
      { d: '04/09/2026', s: 'Quang Huy (SV260010)', bed: '01', act: 'Ph\u00e2n gi\u01b0\u1eddng', by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', room: 'B204' },
      { d: '28/08/2026', s: 'Ph\u1ea1m Tu\u1ea5n (SV250118)', bed: '04', act: 'Tr\u1ea3 ph\u00f2ng', by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', room: 'B204' },
    ];

    const stayHistory = {
      SV260001: [{ d: '15/08/2026', t: 'Nh\u1eadn ph\u00f2ng A302 \u2013 gi\u01b0\u1eddng 03', s: 'Ho\u00e0n th\u00e0nh' }, { d: '01/10/2026', t: 'Thanh to\u00e1n ti\u1ec1n ph\u00f2ng 10/2026', s: 'Ho\u00e0n th\u00e0nh' }, { d: '12/09/2026', t: 'T\u1ea1o h\u1ee3p \u0111\u1ed3ng l\u01b0u tr\u00fa', s: 'Ho\u00e0n th\u00e0nh' }],
    };

    const roles = [
      { id: 'admin', name: 'Qu\u1ea3n tr\u1ecb vi\u00ean', desc: 'To\u00e0n quy\u1ec1n h\u1ec7 th\u1ed1ng', icon: 'crown', perms: { phong: [1, 1, 1], hoso: [1, 1, 1], hopdong: [1, 1, 1], taichinh: [1, 1, 1], thongbao: [1, 1, 1], taikhoan: [1, 1, 1] }, summary: 'Vai tr\u00f2 Qu\u1ea3n tr\u1ecb vi\u00ean c\u00f3 to\u00e0n quy\u1ec1n c\u1ea5u h\u00ecnh h\u1ec7 th\u1ed1ng, ph\u00e2n quy\u1ec1n v\u00e0 qu\u1ea3n l\u00fd m\u1ecdi d\u1eef li\u1ec7u k\u00fd t\u00fac x\u00e1.' },
      { id: 'manager', name: 'Ban qu\u1ea3n l\u00fd', desc: 'Qu\u1ea3n l\u00fd v\u1eadn h\u00e0nh KTX', icon: 'users', perms: { phong: [1, 1, 0], hoso: [1, 1, 1], hopdong: [1, 1, 1], taichinh: [1, 0, 0], thongbao: [1, 1, 0], taikhoan: [1, 1, 0] }, summary: 'Vai tr\u00f2 Ban qu\u1ea3n l\u00fd c\u00f3 quy\u1ec1n qu\u1ea3n l\u00fd danh s\u00e1ch ph\u00f2ng, x\u1eed l\u00fd v\u00e0 duy\u1ec7t h\u1ed3 s\u01a1 l\u01b0u tr\u00fa, qu\u1ea3n l\u00fd h\u1ee3p \u0111\u1ed3ng, xem th\u00f4ng tin t\u00e0i ch\u00ednh, \u0111\u0103ng th\u00f4ng b\u00e1o v\u00e0 qu\u1ea3n l\u00fd t\u00e0i kho\u1ea3n trong ph\u1ea1m vi \u0111\u01b0\u1ee3c ph\u00e2n quy\u1ec1n.' },
      { id: 'tech', name: 'K\u1ef9 thu\u1eadt', desc: 'Qu\u1ea3n l\u00fd b\u1ea3o tr\u00ec, c\u01a1 s\u1edf v\u1eadt ch\u1ea5t', icon: 'wrench', perms: { phong: [1, 0, 0], hoso: [0, 0, 0], hopdong: [0, 0, 0], taichinh: [0, 0, 0], thongbao: [1, 0, 0], taikhoan: [0, 0, 0] }, summary: 'Vai tr\u00f2 K\u1ef9 thu\u1eadt ti\u1ebfp nh\u1eadn v\u00e0 c\u1eadp nh\u1eadt phi\u1ebfu b\u1ea3o tr\u00ec, xem th\u00f4ng tin ph\u00f2ng \u0111\u1ec3 x\u1eed l\u00fd s\u1ef1 c\u1ed1.' },
      { id: 'student', name: 'Sinh vi\u00ean', desc: 'Truy c\u1eadp th\u00f4ng tin c\u00e1 nh\u00e2n', icon: 'user', perms: { phong: [1, 0, 0], hoso: [1, 1, 0], hopdong: [1, 0, 0], taichinh: [1, 0, 0], thongbao: [1, 0, 0], taikhoan: [1, 1, 0] }, summary: 'Vai tr\u00f2 Sinh vi\u00ean xem th\u00f4ng tin ph\u00f2ng, h\u00f3a \u0111\u01a1n, g\u1eedi h\u1ed3 s\u01a1 v\u00e0 y\u00eau c\u1ea7u h\u1ed7 tr\u1ee3 c\u1ee7a ch\u00ednh m\u00ecnh.' },
    ];

    const exportsLog = [
      { name: 'B\u00e1o c\u00e1o l\u01b0u tr\u00fa 10/2026', at: '20/10/2026 14:32', kind: 'XLS' },
      { name: 'B\u00e1o c\u00e1o thu ph\u00ed 10/2026', at: '20/10/2026 14:15', kind: 'PDF' },
      { name: 'B\u00e1o c\u00e1o \u0111i\u1ec7n n\u01b0\u1edbc 09/2026', at: '05/10/2026 16:20', kind: 'XLS' },
    ];

    const meters = { '10/2026': { A302: { eo: 1200, en: 1260, wo: 280, wn: 288 } } };

    rooms.forEach((r) => { r.khu = String(r.floor); });
    populate(rooms, students, contracts, invoices, bedHistory);
    return {
      v: 6, session: null, rooms, students, applications, invoices, repairs, notifications, contracts, feedback, activity, bedHistory, stayHistory, roles, exportsLog, meters,
      prices: { e: 2000, w: 10000 },
      base: { pendingApps: 14, approved: 11, recon: { wait: 22, ok: 17, check: 5 }, unpaid: 22 },
      requests: { extend: null, transfer: null, checkout: null },
      drafts: {},
      chats: { SV260001: [{ me: false, t: 'Xin ch\u00e0o! Ban qu\u1ea3n l\u00fd KTX c\u00f3 th\u1ec3 h\u1ed7 tr\u1ee3 g\u00ec cho b\u1ea1n?', d: '12/10/2026 08:00' }] },
      contacts: [{ id: 'LH-1', name: 'Nguy\u1ec5n Th\u1ecb Hoa', contact: '0915 222 333', msg: 'Con t\u00f4i l\u00e0 t\u00e2n sinh vi\u00ean kh\u00f3a 2026, cho h\u1ecfi c\u00f2n ph\u00f2ng 4 ng\u01b0\u1eddi \u1edf t\u1ea7ng 2 kh\u00f4ng \u1ea1?', at: '20/10/2026 19:12', done: false }],
      general: { name: 'K\u00fd t\u00fac x\u00e1 \u0110\u1ea1i h\u1ecdc Ngh\u1ec7 An', hotline: '0238 3555 888', email: 'ktx@dhna.edu.vn', address: 'S\u1ed1 1 \u0110\u01b0\u1eddng L\u00ea Du\u1ea9n, TP. Vinh, Ngh\u1ec7 An' },
      security: { minLen: 8, twofa: false, lockAfter: 5 },
      sysLog: [{ at: '15/10/2026 09:24', by: 'Ph\u1ea1m V\u0103n H\u00f9ng', t: 'Duy\u1ec7t h\u1ed3 s\u01a1 HS2026-0027' }, { at: '15/10/2026 08:10', by: 'Qu\u1ea3n tr\u1ecb vi\u00ean', t: '\u0110\u0103ng nh\u1eadp h\u1ec7 th\u1ed1ng' }, { at: '14/10/2026 17:02', by: 'L\u00ea Th\u1ecb Thu', t: 'C\u1eadp nh\u1eadt ch\u1ec9 s\u1ed1 \u0111i\u1ec7n n\u01b0\u1edbc t\u1ea7ng 3' }],
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const d = JSON.parse(raw); if (d && d.v === 6) { let alive = true; try { alive = !!sessionStorage.getItem('ktx-alive'); } catch (e) { /* no session storage */ } if (d.session && d.session.temp && !alive) d.session = null; return d; } }
    } catch (e) { /* storage unavailable */ }
    return seed();
  }

  const db = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* ignore */ } }
  function reset() { const s = seed(); Object.keys(db).forEach((k) => delete db[k]); Object.assign(db, s); save(); }

  // ---- helpers ----
  const money = (n) => (Math.round(n) || 0).toLocaleString('vi-VN').replace(/,/g, '.') + '\u0111';
  const student = (id) => db.students.find((s) => s.id === id);
  const room = (c) => db.rooms.find((r) => r.code === c);
  const occupants = (c) => db.students.filter((s) => s.room === c && s.status === 'dang-o').sort((a, b) => a.bed - b.bed);
  const occCount = (c) => { const r = room(c); return r ? Math.min(r.beds, r.extra + occupants(c).length) : 0; };
  const bedHeld = (code, bed, exceptId) => (db.transfers || []).some((t) =>
    t.status === 'cho-ban-giao' && t.id !== exceptId && t.to?.room === code && Number(t.to.bed) === Number(bed));
  const bedMap = (c, exceptId) => {
    const r = room(c);
    if (!r) return [];
    const occ = occupants(c); const used = new Set(occ.map((s) => s.bed));
    const map = []; let extra = r.extra;
    for (let b = 1; b <= r.beds; b++) {
      const s = occ.find((x) => x.bed === b);
      if (s) map.push({ bed: b, student: s });
      else if (extra > 0 && !used.has(b)) { map.push({ bed: b, anon: true }); extra--; }
      else if (bedHeld(c, b, exceptId)) map.push({ bed: b, held: true });
      else if (r.maint) map.push({ bed: b, maintenance: true });
      else map.push({ bed: b, free: true });
    }
    return map;
  };
  const freeBeds = (code) => bedMap(code).filter((b) => b.free).length;
  const roomStatus = (code) => {
    const r = room(code);
    if (!r || r.maint) return 'bao-tri';
    const available = freeBeds(code);
    return available === 0 ? 'day' : available === r.beds ? 'trong' : 'con';
  };
  const khus = () => [...new Set(db.rooms.map((r) => r.khu))].sort((a, b) => a - b);
  const fl = (code) => { const r = room(code); return r ? r.khu : String(code || '').charAt(1); };
  const khuStats = () => khus().map((k) => {
    const rs = db.rooms.filter((r) => r.khu === k);
    const beds = rs.reduce((s, r) => s + r.beds, 0);
    const used = rs.reduce((s, r) => s + occCount(r.code), 0);
    return { khu: k, rooms: rs.length, beds, used, free: rs.reduce((s, r) => s + freeBeds(r.code), 0), rate: beds ? Math.round(used * 100 / beds) : 0 };
  });
  const me = () => (db.session && db.session.role === 'student') ? student(db.session.id) : null;
  const pad2 = (n) => String(n).padStart(2, '0');
  const now = () => { const d = new Date(); return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };
  const today = () => now().slice(0, 10);

  window.KTX = { db, save, reset, A, roomArt, khus, fl, money, student, room, occupants, occCount, freeBeds, roomStatus, bedMap, bedHeld, khuStats, me, now, today, pad2 };
})();
