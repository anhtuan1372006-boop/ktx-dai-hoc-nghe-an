/* Dữ liệu mẫu + kho lưu trữ (localStorage) cho hệ thống KTX */
(function () {
  const KEY = 'ktx-dhna-v3';
  // High-resolution restorations shared by cards, amenities and photo albums.
  const HD = { h_cta: 'h_cta-hd.png', h_room4: 'h_room4-hd.png', h_room6: 'h_room6-hd.png', h_common: 'h_common-hd.png' };
  const A = (n) => (String(n).startsWith('data:') ? n : 'assets/' + (HD[n] || n + '.jpg'));

  function genRooms() {
    const rooms = [];
    const add = (r) => rooms.push(Object.assign({ amen: ['wifi', 'desk', 'balcony', 'wardrobe', 'fan'], extra: 0, maint: false }, r));
    // Khu A: 32 phòng, tầng 1–4, 8 phòng/tầng
    const aType = (f, i) => (f === 3 ? 4 : (f === 4 ? (i <= 6 ? 6 : 4) : (i <= 5 ? 6 : 4)));
    for (let f = 1; f <= 4; f++) for (let i = 1; i <= 8; i++) {
      const code = 'A' + f + '0' + i;
      add({ code, khu: 'A', floor: f, beds: aType(f, i), price: aType(f, i) === 4 ? 500000 : 420000, img: 'room_a302' });
    }
    // Khu B: 28 phòng, tầng 1–4, 7 phòng/tầng
    for (let f = 1; f <= 4; f++) for (let i = 1; i <= 7; i++) {
      const code = 'B' + f + '0' + i;
      const beds = i === 1 ? (f >= 3 ? 6 : 2) : (i <= 4 ? 4 : 8);
      add({ code, khu: 'B', floor: f, beds, price: beds === 2 ? 750000 : beds === 4 ? 500000 : beds === 6 ? 420000 : 380000, img: beds === 2 ? 'room_b201' : beds === 4 ? 'room_b204' : 'room_c101' });
    }
    // Khu C: 24 phòng, tầng 1–4, 6 phòng/tầng
    for (let f = 1; f <= 4; f++) for (let i = 1; i <= 6; i++) {
      const code = 'C' + f + '0' + i;
      const beds = i <= 4 ? 6 : 8;
      add({ code, khu: 'C', floor: f, beds, price: beds === 6 ? 420000 : 380000, img: 'room_c101' });
    }
    return rooms;
  }

  function seed() {
    const rooms = genRooms();
    const R = (c) => rooms.find((r) => r.code === c);
    // phòng tầng 3 khu A theo đúng sơ đồ quản lý
    const a3 = { A301: [4, 4], A302: [4, 4], A303: [4, 2], A304: [4, 0], A305: [4, 0], A306: [4, 3], A307: [4, 4], A308: [4, 1] };
    Object.entries(a3).forEach(([c, [b, o]]) => { const r = R(c); r.beds = b; r.price = 500000; r.extra = o; });
    R('A305').maint = true; R('A305').extra = 0;
    R('A302').extra = 0; R('A302').amen = ['wifi', 'desk', 'balcony', 'wardrobe', 'ac', 'fan'];
    R('B204').beds = 4; R('B204').extra = 0; R('B204').img = 'room_b204'; R('B204').area = 20; R('B204').amen = ['wifi', 'desk', 'balcony', 'wardrobe', 'wc'];
    R('B201').beds = 2; R('B201').extra = 1; R('B201').img = 'room_b201';
    R('C101').beds = 6; R('C101').extra = 2; R('C101').img = 'room_c101';
    R('C203').extra = 5;
    // phân bổ người ở để đạt đúng số liệu tổng (A 128/160, B 144/160, C 112/160)
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

    const S = (o) => Object.assign({ faculty: 'Công nghệ thông tin', cls: 'CNTT K26', course: '2026 – 2030', password: '12345678', status: 'dang-o', emergency: { name: '', relation: '', phone: '' } }, o);
    const students = [
      S({ id: 'SV260001', name: 'Tuấn Anh', email: 'tuananh@example.com', phone: '0912341234', room: 'A302', bed: 3, avatar: 'av_tuananh', photo: 'photo_tuananh', big: 'av_tuananh_big' }),
      S({ id: 'SV260002', name: 'Minh Đức', email: 'minhduc@example.com', phone: '0912000002', room: 'A302', bed: 1, avatar: 'av_minhduc' }),
      S({ id: 'SV260003', name: 'Hoàng Anh', email: 'hoanganh@example.com', phone: '0912000003', room: 'A302', bed: 2, avatar: 'av_hoanganh' }),
      S({ id: 'SV260004', name: 'Minh Châu', email: 'minhchau@example.com', phone: '0912000004', room: 'A302', bed: 4, avatar: 'av_minhchau', faculty: 'Kinh tế', cls: 'KT K26' }),
      S({ id: 'SV260010', name: 'Quang Huy', email: 'quanghuy@example.com', phone: '0912000010', room: 'B204', bed: 1, avatar: 'av_quanghuy' }),
      S({ id: 'SV260011', name: 'Gia Bảo', email: 'giabao@example.com', phone: '0912000011', room: 'B204', bed: 2, avatar: 'av_giabao' }),
      S({ id: 'SV260014', name: 'Trung Kiên', email: 'trungkien@example.com', phone: '0912000014', room: 'B204', bed: 3, avatar: 'av_trungkien' }),
      S({ id: 'SV260012', name: 'Nguyễn Hải', email: 'nguyenhai@example.com', phone: '0912000034', room: null, bed: null, status: 'cho-phan-phong', avatar: 'av_nguyenhai', photo: 'student_art' }),
      S({ id: 'SV260018', name: 'Mai Linh', email: 'mailinh@example.com', phone: '0912000018', room: 'C101', bed: 2, avatar: 'av_mailinh', faculty: 'Ngoại ngữ', cls: 'NN K26' }),
      S({ id: 'SV260021', name: 'Bảo Ngọc', email: 'baongoc@example.com', phone: '0912000021', room: null, bed: null, status: 'da-tra', avatar: 'av_baongoc', faculty: 'Sư phạm', cls: 'SP K25' }),
      S({ id: 'SV260033', name: 'Lan Anh', email: 'lananh@example.com', phone: '0912000033', room: 'C203', bed: 1, avatar: 'av_lananh', faculty: 'Ngoại ngữ', cls: 'NN K26', hidden: true }),
      S({ id: 'SV260023', name: 'Lê Phương', email: 'lephuong@example.com', phone: '0912000023', room: null, bed: null, status: 'cho-phan-phong', avatar: 'av_lephuong', hidden: true }),
      S({ id: 'SV260031', name: 'Trần Minh', email: 'tranminh@example.com', phone: '0912000031', room: null, bed: null, status: 'cho-phan-phong', avatar: 'av_tranminh', hidden: true }),
      S({ id: 'SV260045', name: 'Vũ Ngọc', email: 'vungoc@example.com', phone: '0912000045', room: null, bed: null, status: 'cho-phan-phong', avatar: 'av_vungoc', hidden: true }),
    ];
    students[0].emergency = { name: '', relation: '', phone: '' };

    const docs4 = () => [
      { name: 'Giấy xác nhận sinh viên', ok: true }, { name: 'CCCD (bản sao)', ok: true },
      { name: 'Ảnh thẻ 3x4', ok: true }, { name: 'Đơn đăng ký lưu trú', ok: true }];
    const applications = [
      { id: 'HS2026-0008', student: 'SV260001', type: 'Đăng ký lưu trú mới', room: 'A302', bed: 3, term: '2026 – 2027', period: 'Từ 09/2026 đến 06/2027', date: '12/09/2026 14:20', status: 'da-duyet', docs: docs4(), confirmed: false,
        history: [{ t: 'Sinh viên nộp hồ sơ', d: '12/09/2026 14:20', s: 'Bạn đã gửi hồ sơ đăng ký lưu trú.' }, { t: 'Đã duyệt', d: '15/09/2026 09:15', s: 'Hồ sơ được phê duyệt. Vui lòng đọc và xác nhận thỏa thuận lưu trú.' }] },
      { id: 'HS2026-0031', student: 'SV260023', type: 'Đăng ký lưu trú mới', room: 'A101', bed: 2, term: '2026 – 2027', period: 'Từ 09/2026 đến 06/2027', date: '14/10/2026 10:05', status: 'cho-duyet', docs: docs4(), history: [{ t: 'Sinh viên nộp hồ sơ', d: '14/10/2026 10:05', s: 'Hồ sơ được gửi lên hệ thống.' }, { t: 'Chờ xét duyệt', d: '14/10/2026 10:05', s: 'Hồ sơ đang chờ cán bộ quản lý xem xét.' }] },
      { id: 'HS2026-0030', student: 'SV260031', type: 'Gia hạn lưu trú năm học 2026 – 2027', room: 'C105', bed: 1, term: '2026 – 2027', period: 'Từ 09/2026 đến 06/2027', date: '13/10/2026 16:40', status: 'cho-duyet', docs: docs4(), history: [{ t: 'Sinh viên nộp hồ sơ', d: '13/10/2026 16:40', s: 'Hồ sơ được gửi lên hệ thống.' }, { t: 'Chờ xét duyệt', d: '13/10/2026 16:40', s: 'Hồ sơ đang chờ cán bộ quản lý xem xét.' }] },
      { id: 'HS2026-0029', student: 'SV260045', type: 'Chuyển phòng (sang phòng B302)', room: 'B302', bed: 3, term: '2026 – 2027', period: 'Từ 09/2026 đến 06/2027', date: '12/10/2026 15:10', status: 'cho-duyet', docs: docs4(), history: [{ t: 'Sinh viên nộp hồ sơ', d: '12/10/2026 15:10', s: 'Hồ sơ được gửi lên hệ thống.' }, { t: 'Chờ xét duyệt', d: '12/10/2026 15:10', s: 'Hồ sơ đang chờ cán bộ quản lý xem xét.' }] },
      { id: 'HS2026-0028', student: 'SV260012', type: 'Đăng ký lưu trú mới', room: 'B204', bed: 4, term: '2026 – 2027', period: 'Từ 09/2026 đến 06/2027', date: '12/10/2026 08:30', status: 'cho-duyet', docs: docs4(), history: [{ t: 'Sinh viên nộp hồ sơ', d: '12/10/2026 08:30', s: 'Hồ sơ được gửi lên hệ thống.' }, { t: 'Chờ xét duyệt', d: '12/10/2026 08:30', s: 'Hồ sơ đang chờ cán bộ quản lý xem xét.' }] },
      { id: 'HS2026-0019', student: 'SV260018', type: 'Đăng ký lưu trú mới', room: 'C101', bed: 2, term: '2026 – 2027', period: 'Từ 09/2026 đến 06/2027', date: '20/08/2026 09:00', status: 'can-bo-sung', docs: [{ name: 'Giấy xác nhận sinh viên', ok: true }, { name: 'CCCD (bản sao)', ok: false }, { name: 'Ảnh thẻ 3x4', ok: true }, { name: 'Đơn đăng ký lưu trú', ok: true }], history: [{ t: 'Sinh viên nộp hồ sơ', d: '20/08/2026 09:00', s: 'Hồ sơ được gửi lên hệ thống.' }, { t: 'Yêu cầu bổ sung', d: '22/08/2026 10:00', s: 'Thiếu bản sao CCCD.' }] },
    ];

    const inv = (id, sid, period, status, extra) => Object.assign({ id, student: sid, period, room: 'A302', khu: '3', items: [{ name: 'Tiền phòng (tháng ' + period + ')', amount: 500000 }, { name: 'Tiền điện (theo định mức)', amount: 30000 }, { name: 'Tiền nước (theo định mức)', amount: 20000 }], total: 550000, status }, extra || {});
    const invoices = [
      inv('HĐ1026-001', 'SV260001', '10/2026', 'chua-tt', { due: '25/10/2026', recv: { txn: 'GD-026', at: '15/10/2026 14:32', amount: 550000, note: 'Thanh toán phí KTX tháng 10/2026', file: 'Chung_tu_GD-026.pdf', size: '0,8 MB' } }),
      inv('HĐ0926-001', 'SV260001', '09/2026', 'da-tt', { paidAt: '20/09/2026 10:12', txn: 'GD-019' }),
      inv('HĐ0826-001', 'SV260001', '08/2026', 'da-tt', { paidAt: '18/08/2026 08:40', txn: 'GD-011' }),
      inv('HĐ0726-001', 'SV260001', '07/2026', 'da-tt', { paidAt: '21/07/2026 19:02', txn: 'GD-004' }),
      inv('HĐ1026-002', 'SV260002', '10/2026', 'da-tt', { paidAt: '14/10/2026 09:15', txn: 'GD-024', confirmed: true }),
      inv('HĐ1026-003', 'SV260003', '10/2026', 'chua-tt'),
      inv('HĐ1026-004', 'SV260004', '10/2026', 'cho-doi-soat', { paidAt: '15/10/2026 08:02', txn: 'GD-027', note: 'Thanh toán phí KTX tháng 10/2026', recv: { txn: 'GD-027', at: '15/10/2026 08:02', amount: 550000, note: 'Thanh toan phi KTX T10 SV260004', file: 'Chung_tu_GD-027.pdf', size: '0,6 MB' } }),
    ];

    const repairs = [
      { id: 'SC-026', code: '#PX20261012-001', title: 'Bóng đèn bàn học không sáng', short: 'Bóng đèn bàn học', summary: 'Bóng đèn ở bàn học trong phòng không sáng, đã thử thay nhưng vẫn không được.', desc: 'Bóng đèn bàn học tại giường số 03 không sáng, đã thử thay bóng nhưng vẫn không hoạt động. Mong bộ phận kỹ thuật kiểm tra và hỗ trợ sửa chữa.', student: 'SV260001', room: 'A302', loc: 'A302 · Giường 03', place: 'Tầng 3', category: 'Thiết bị điện', kind: 'Điện', icon: 'bulb', prio: 'Trung bình', status: 'dang-xu-ly', date: '12/10/2026 14:20', kdate: '08/10/2026', staff: 'Lê Minh Tâm', dept: 'Bộ phận kỹ thuật', schedule: '13/10/2026 14:00 - 16:00', planDate: '2026-10-08', photo: 'lamp',
        steps: [{ t: 'Đã tiếp nhận', d: '12/10/2026 14:20', s: 'Yêu cầu của bạn đã được ghi nhận.' }, { t: 'Đã phân công', d: '12/10/2026 15:05', s: 'Đã chuyển đến bộ phận kỹ thuật.' }, { t: 'Đang sửa chữa', d: '', s: 'Dự kiến xử lý trong chiều 13/10/2026.' }, { t: 'Hoàn tất', d: '', s: 'Sẽ thông báo khi hoàn thành.' }],
        msgs: [
          { who: 'Tuấn Anh', av: 'av_tuananh', d: '12/10/2026 14:20', m: 'Bóng đèn bàn học tại giường số 03 không sáng, đã thử thay bóng nhưng vẫn không hoạt động. Mong bộ phận kỹ thuật kiểm tra và hỗ trợ sửa chữa.' },
          { who: 'Bộ phận quản lý KTX', av: 'av_manager_f', d: '12/10/2026 15:05', m: 'Chúng tôi đã tiếp nhận yêu cầu của bạn và đã phân công bộ phận kỹ thuật kiểm tra. Bạn sẽ được thông báo khi có lịch xử lý cụ thể.' },
          { who: 'Nhân viên kỹ thuật', av: 'av_tech', d: '13/10/2026 09:30', m: 'Chúng tôi sẽ kiểm tra và sửa chữa trong chiều nay (13/10/2026).\nBạn vui lòng giữ nguyên hiện trạng, kỹ thuật viên sẽ liên hệ trước khi đến.' }] },
      { id: 'SC-023', code: '#PX20261008-001', title: 'Vòi nước bị rò', short: 'Vòi nước bị rò', desc: 'Vòi nước trong phòng tắm bị rò, nước chảy liên tục dù đã khóa.', student: 'SV260001', room: 'A302', loc: 'A302 · Phòng tắm', place: 'Tầng 3', category: 'Hệ thống nước', kind: 'Hệ thống nước', icon: 'faucet', prio: 'Trung bình', status: 'moi', date: '08/10/2026 10:00', kdate: '08/10/2026', staff: '', dept: 'Bộ phận kỹ thuật', schedule: '', msgs: [], steps: null },
      { id: 'SC-019', code: '#PX20260928-001', title: 'Kiểm tra ổ cắm', short: 'Kiểm tra ổ cắm', desc: 'Đề nghị kiểm tra ổ cắm gần giường số 3, hiện đã hoạt động bình thường. Cảm ơn!', student: 'SV260001', room: 'A302', loc: 'A302 · Phòng ở', place: 'Tầng 3', category: 'Thiết bị điện', kind: 'Điện', icon: 'socket', prio: 'Thấp', status: 'hoan-tat', date: '28/09/2026 09:00', kdate: '28/09/2026', staff: 'Hoàng Văn Khoa', dept: 'Bộ phận kỹ thuật', schedule: '', msgs: [], steps: null },
      { id: 'SC-028', title: 'Vòi nước rò rỉ', loc: 'B204 · Phòng tắm', place: 'Tầng 2', room: 'B204', kind: 'Hệ thống nước', category: 'Hệ thống nước', prio: 'Trung bình', status: 'moi', kdate: '10/10/2026', staff: '', desc: 'Vòi nước phòng tắm rò rỉ liên tục.' },
      { id: 'SC-029', title: 'Cửa tủ bị kẹt', loc: 'C101 · Phòng ở', place: 'Tầng 1', room: 'C101', kind: 'Đồ dùng phòng', category: 'Đồ dùng phòng', prio: 'Thấp', status: 'moi', kdate: '09/10/2026', staff: '', desc: 'Cửa tủ cá nhân bị kẹt, khó mở.' },
      { id: 'SC-027', title: 'Điều hòa không mát', loc: 'B301 · Phòng ở', place: 'Tầng 3', room: 'B301', kind: 'Điều hòa', category: 'Điều hòa', prio: 'Cao', status: 'phan-cong', kdate: '09/10/2026', staff: 'Nguyễn Văn Hùng', desc: 'Điều hòa chạy nhưng không mát.' },
      { id: 'SC-030', title: 'Ổ cắm điện lỏng', loc: 'A102 · Phòng ở', place: 'Tầng 1', room: 'A102', kind: 'Điện', category: 'Thiết bị điện', prio: 'Trung bình', status: 'phan-cong', kdate: '08/10/2026', staff: 'Trần Quốc Nam', desc: 'Ổ cắm gần bàn học bị lỏng.' },
      { id: 'SC-031', title: 'Quạt trần có tiếng kêu', loc: 'A201 · Phòng ở', place: 'Tầng 2', room: 'A201', kind: 'Quạt', category: 'Quạt', prio: 'Thấp', status: 'dang-xu-ly', kdate: '07/10/2026', staff: 'Phạm Đức Duy', desc: 'Quạt trần kêu to khi bật số lớn.' },
      { id: 'SC-024', title: 'Thông bồn rửa mặt', loc: 'A301 · Phòng tắm', place: 'Tầng 3', room: 'A301', kind: 'Hệ thống nước', category: 'Hệ thống nước', prio: 'Thấp', status: 'hoan-tat', kdate: '06/10/2026', staff: 'Hoàng Văn Khoa', desc: 'Bồn rửa mặt thoát nước chậm.' },
      { id: 'SC-025', title: 'Thay khóa cửa phòng', loc: 'B105 · Phòng ở', place: 'Tầng 1', room: 'B105', kind: 'Khóa cửa', category: 'Khóa cửa', prio: 'Trung bình', status: 'hoan-tat', kdate: '05/10/2026', staff: 'Ngô Anh Tuấn', desc: 'Khóa cửa phòng bị hỏng.' },
    ];

    const notifications = [
      { id: 'N7', title: 'Sinh hoạt cộng đồng ký túc xá', summary: 'Cùng tham gia các hoạt động gắn kết, lan tỏa tinh thần sinh viên KTX...', cat: 'Hoạt động', icon: 'ni_megaphone', time: '2 giờ trước', author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', img: 'community_big', read: false,
        body: ['Ban quản lý ký túc xá tổ chức đợt sinh hoạt cộng đồng với nhiều hoạt động ý nghĩa như giao lưu văn nghệ, trò chơi nhóm, chia sẻ kinh nghiệm học tập và kỹ năng sống.', 'Đây là dịp để các bạn sinh viên gặp gỡ, kết nối, xây dựng môi trường sống thân thiện, văn minh tại ký túc xá. Rất mong các bạn tích cực tham gia và theo dõi các thông tin tiếp theo trên website và bảng tin KTX.'] },
      { id: 'N6', title: 'Thông báo thu tiền phòng tháng 10/2026', summary: 'Vui lòng thanh toán trước ngày 25/10/2026 để tránh phát sinh phí.', cat: 'Lưu trú', icon: 'ni_invoice', time: 'Hôm nay', dash: 'Hôm nay', important: true, author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', read: false,
        body: ['Hóa đơn tiền phòng tháng 10/2026 đã được phát hành trên cổng sinh viên.', 'Vui lòng thanh toán trước ngày 25/10/2026 để tránh phát sinh phí. Sinh viên có thể thanh toán bằng chuyển khoản, ví điện tử hoặc tại quầy.'] },
      { id: 'N5', title: 'Hướng dẫn đăng ký lưu trú', summary: 'Hướng dẫn chi tiết quy trình đăng ký lưu trú năm học 2026 – 2027.', cat: 'Lưu trú', icon: 'ni_doc', time: '1 ngày trước', author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', read: false,
        body: ['Sinh viên đăng ký lưu trú năm học 2026 – 2027 thực hiện theo 3 bước: chọn phòng, điền thông tin đăng ký và gửi hồ sơ trực tuyến.', 'Hồ sơ cần có: giấy xác nhận sinh viên, bản sao CCCD, ảnh thẻ 3x4 và đơn đăng ký lưu trú.'] },
      { id: 'N4', title: 'Lịch kiểm tra thiết bị phòng ở', summary: 'Ban quản lý sẽ kiểm tra định kỳ từ 15/10 đến 17/10/2026.', cat: 'Hoạt động', icon: 'ni_wrench', time: 'Hôm qua', dash: 'Hôm qua', important: true, author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', read: true,
        body: ['Ban quản lý sẽ kiểm tra định kỳ thiết bị điện, nước tại các phòng ở từ 15/10 đến 17/10/2026.', 'Sinh viên vui lòng sắp xếp đồ đạc gọn gàng để thuận tiện cho việc kiểm tra.'] },
      { id: 'N3', title: 'Lịch kiểm tra thiết bị', summary: 'Thông báo lịch kiểm tra điện, nước tại các tầng ký túc xá.', cat: 'Hoạt động', icon: 'ni_wrench', time: '3 ngày trước', author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', read: true,
        body: ['Thông báo lịch kiểm tra điện, nước tại 4 tầng ký túc xá trong tháng 10/2026.'] },
      { id: 'N2', title: 'Thông báo đăng ký gia hạn lưu trú năm 2026 – 2027', summary: 'Sinh viên vui lòng đăng ký trước ngày 30/11/2026.', cat: 'Lưu trú', icon: 'ni_doc', time: '12/10/2026', dash: '12/10/2026', important: true, author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', read: true,
        body: ['Sinh viên có nhu cầu tiếp tục lưu trú học kỳ II năm học 2026 – 2027 vui lòng đăng ký gia hạn trước ngày 30/11/2026 tại mục Lưu trú > Gia hạn.'] },
      { id: 'N1', title: 'Thông tin thanh toán', summary: 'Hóa đơn tiền phòng tháng 10/2026 đã được phát hành.', cat: 'Lưu trú', icon: 'ni_invoice', time: '5 ngày trước', author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', read: true,
        body: ['Hóa đơn tiền phòng tháng 10/2026 đã được phát hành. Sinh viên kiểm tra tại mục Hóa đơn.'] },
    ];

    const contracts = [
      { id: 'HD1026-001', student: 'SV260001', room: 'A302', khu: '3', bed: '03 / 04', term: '2026 – 2027', status: 'hieu-luc', fee: 500000, handover: { done: true, date: '01/09/2026' }, file: 'Thoa_thuan_luu_tru_HD1026-001.pdf', updated: '01/09/2026', history: [{ d: '01/09/2026', t: 'Tạo hợp đồng lưu trú' }, { d: '15/08/2026', t: 'Cập nhật thông tin phòng' }] },
      { id: 'HD1026-002', student: 'SV260010', room: 'B204', khu: '2', bed: '01 / 04', term: '2026 – 2027', status: 'hieu-luc', fee: 500000, handover: { done: true, date: '01/09/2026' }, file: 'Thoa_thuan_luu_tru_HD1026-002.pdf', updated: '01/09/2026', history: [{ d: '01/09/2026', t: 'Tạo hợp đồng lưu trú' }] },
      { id: 'HD1026-003', student: 'SV260018', room: 'C101', khu: '1', bed: '02 / 06', term: '2026 – 2027', status: 'cho-ban-giao', fee: 420000, handover: { done: false, date: '' }, file: 'Thoa_thuan_luu_tru_HD1026-003.pdf', updated: '05/09/2026', history: [{ d: '05/09/2026', t: 'Tạo hợp đồng lưu trú' }] },
      { id: 'HD1026-004', student: 'SV260033', room: 'C203', khu: '2', bed: '01 / 06', term: '2026 – 2027', status: 'hieu-luc', fee: 420000, handover: { done: true, date: '02/09/2026' }, file: 'Thoa_thuan_luu_tru_HD1026-004.pdf', updated: '02/09/2026', history: [{ d: '02/09/2026', t: 'Tạo hợp đồng lưu trú' }] },
    ];
    const C = (id, sid, room, bed, status, extra) => contracts.push(Object.assign({ id, student: sid, room, khu: room[1], bed, term: '2026 – 2027', status, fee: K_PRICE[room[0]], handover: { done: status !== 'cho-ban-giao', date: status !== 'cho-ban-giao' ? '01/09/2026' : '' }, file: 'Thoa_thuan_luu_tru_' + id + '.pdf', updated: '01/09/2026', history: [{ d: '01/09/2026', t: 'Tạo hợp đồng lưu trú' }] }, extra || {}));
    const K_PRICE = { A: 500000, B: 500000, C: 420000 };
    C('HD1026-005', 'SV260002', 'A302', '01 / 04', 'hieu-luc'); C('HD1026-006', 'SV260003', 'A302', '02 / 04', 'hieu-luc'); C('HD1026-007', 'SV260004', 'A302', '04 / 04', 'hieu-luc');
    C('HD1026-008', 'SV260014', 'B204', '03 / 04', 'cho-ban-giao');
    C('HD1026-009', 'SV260011', 'B204', '02 / 04', 'gia-han', { term: '2026 – 2027 (gia hạn HK II)' });
    [['SV250077', 'Đỗ Thu Hà', 'C304', 'av_vungoc'], ['SV250081', 'Lương Văn Đạt', 'B305', 'av_tranminh']].forEach(([sid, name, room, avt], i) => C('HD0926-0' + (10 + i), sid, room, '0' + (i + 2) + ' / 06', 'gia-han', { name, avatar: avt, term: '2026 – 2027 (gia hạn HK II)' }));
    const ended = [['SV260021', 'Bảo Ngọc', 'C102', 'av_baongoc'], ['SV250118', 'Phạm Tuấn', 'B204', 'av_trungkien'], ['SV250102', 'Ngô Minh Khang', 'A105', 'av_hoanganh'], ['SV250095', 'Trịnh Thu Trang', 'C201', 'av_mailinh'], ['SV250090', 'Hồ Đức Long', 'B102', 'av_minhduc'], ['SV250088', 'Phan Thảo Vy', 'C303', 'av_lephuong'], ['SV250085', 'Đặng Quốc Việt', 'A208', 'av_quanghuy'], ['SV250083', 'Mai Anh Thư', 'C106', 'av_vungoc'], ['SV250079', 'Lý Gia Huy', 'B403', 'av_giabao'], ['SV250074', 'Võ Thị Hạnh', 'C402', 'av_lananh'], ['SV250070', 'Bùi Văn Sơn', 'A407', 'av_tranminh'], ['SV250066', 'Cao Ngọc Ánh', 'C204', 'av_minhchau'], ['SV250061', 'Tạ Minh Nhật', 'B306', 'av_nguyenhai'], ['SV250057', 'Đinh Khánh Ly', 'C305', 'av_baongoc'], ['SV250052', 'Kiều Thanh Tùng', 'A403', 'av_trungkien']];
    ended.forEach(([sid, name, room, avt], i) => C('HD0825-' + String(100 + i), sid, room, '0' + (1 + (i % 4)) + ' / 0' + (room[0] === 'C' ? 6 : 4), 'ket-thuc', { name, avatar: avt, term: '2025 – 2026', handover: { done: true, date: '30/06/2026' }, updated: '30/06/2026', history: [{ d: '30/06/2026', t: 'Kết thúc hợp đồng, trả phòng' }, { d: '01/09/2025', t: 'Tạo hợp đồng lưu trú' }] }));

    const feedback = [
      { id: 'PA-12', student: 'SV260001', date: '12/10/2026', title: 'Đèn hành lang tầng 3 thường xuyên bị hỏng', type: 'Phản ánh', status: 'da-phan-hoi', body: 'Đèn hành lang tầng 3 thường xuyên bị hỏng.', reply: 'Ban quản lý đã thay mới toàn bộ đèn hành lang tầng 3 ngày 14/10/2026.' },
      { id: 'PA-09', student: 'SV260001', date: '28/09/2026', title: 'Đề nghị bổ sung thùng rác khu vực sân sau', type: 'Góp ý', status: 'dang-tiep-nhan', body: 'Đề nghị bổ sung thùng rác tại khu vực sân sau tòa nhà.' },
    ];

    const activity = [
      { at: '15/10/2026 09:24', by: 'Phạm Văn Hùng', av: 'av_hung', act: 'Duyệt hồ sơ', icon: 'ok', text: 'Duyệt hồ sơ lưu trú cho sinh viên Trần Minh Quân (SV260097)' },
      { at: '15/10/2026 08:41', by: 'Lê Thị Thu', av: 'av_thu', act: 'Tạo yêu cầu bảo trì', icon: 'wrench', text: 'Tạo yêu cầu sửa chữa thiết bị điện tại phòng B201' },
      { at: '14/10/2026 16:15', by: 'Nguyễn Văn Nam', av: 'av_hung', act: 'Thanh toán hóa đơn', icon: 'doc', text: 'Cập nhật thanh toán hóa đơn HĐ1025-118 (09/2026) cho sinh viên Đặng Hoàng Nam' },
    ];

    const bedHistory = [
      { d: '05/09/2026', s: 'Trung Kiên (SV260014)', bed: '03', act: 'Phân giường', by: 'Quản trị viên', room: 'B204' },
      { d: '05/09/2026', s: 'Gia Bảo (SV260011)', bed: '02', act: 'Phân giường', by: 'Quản trị viên', room: 'B204' },
      { d: '04/09/2026', s: 'Quang Huy (SV260010)', bed: '01', act: 'Phân giường', by: 'Quản trị viên', room: 'B204' },
      { d: '28/08/2026', s: 'Phạm Tuấn (SV250118)', bed: '04', act: 'Trả phòng', by: 'Quản trị viên', room: 'B204' },
    ];

    const stayHistory = {
      SV260001: [{ d: '15/08/2026', t: 'Nhận phòng A302 – giường 03', s: 'Hoàn thành' }, { d: '01/10/2026', t: 'Thanh toán tiền phòng 10/2026', s: 'Hoàn thành' }, { d: '12/09/2026', t: 'Tạo hợp đồng lưu trú', s: 'Hoàn thành' }],
    };

    const roles = [
      { id: 'admin', name: 'Quản trị viên', desc: 'Toàn quyền hệ thống', icon: 'crown', perms: { phong: [1, 1, 1], hoso: [1, 1, 1], hopdong: [1, 1, 1], taichinh: [1, 1, 1], thongbao: [1, 1, 1], taikhoan: [1, 1, 1] }, summary: 'Vai trò Quản trị viên có toàn quyền cấu hình hệ thống, phân quyền và quản lý mọi dữ liệu ký túc xá.' },
      { id: 'manager', name: 'Ban quản lý', desc: 'Quản lý vận hành KTX', icon: 'users', perms: { phong: [1, 1, 0], hoso: [1, 1, 1], hopdong: [1, 1, 1], taichinh: [1, 0, 0], thongbao: [1, 1, 0], taikhoan: [1, 1, 0] }, summary: 'Vai trò Ban quản lý có quyền quản lý danh sách phòng, xử lý và duyệt hồ sơ lưu trú, quản lý hợp đồng, xem thông tin tài chính, đăng thông báo và quản lý tài khoản trong phạm vi được phân quyền.' },
      { id: 'tech', name: 'Kỹ thuật', desc: 'Quản lý bảo trì, cơ sở vật chất', icon: 'wrench', perms: { phong: [1, 0, 0], hoso: [0, 0, 0], hopdong: [0, 0, 0], taichinh: [0, 0, 0], thongbao: [1, 0, 0], taikhoan: [0, 0, 0] }, summary: 'Vai trò Kỹ thuật tiếp nhận và cập nhật phiếu bảo trì, xem thông tin phòng để xử lý sự cố.' },
      { id: 'student', name: 'Sinh viên', desc: 'Truy cập thông tin cá nhân', icon: 'user', perms: { phong: [1, 0, 0], hoso: [1, 1, 0], hopdong: [1, 0, 0], taichinh: [1, 0, 0], thongbao: [1, 0, 0], taikhoan: [1, 1, 0] }, summary: 'Vai trò Sinh viên xem thông tin phòng, hóa đơn, gửi hồ sơ và yêu cầu hỗ trợ của chính mình.' },
    ];

    const exportsLog = [
      { name: 'Báo cáo lưu trú 10/2026', at: '20/10/2026 14:32', kind: 'XLS' },
      { name: 'Báo cáo thu phí 10/2026', at: '20/10/2026 14:15', kind: 'PDF' },
      { name: 'Báo cáo điện nước 09/2026', at: '05/10/2026 16:20', kind: 'XLS' },
    ];

    const meters = { '10/2026': { A302: { eo: 1200, en: 1260, wo: 280, wn: 288 } } };

    rooms.forEach((r) => { r.khu = String(r.floor); });
    return {
      v: 5, session: null, rooms, students, applications, invoices, repairs, notifications, contracts, feedback, activity, bedHistory, stayHistory, roles, exportsLog, meters,
      prices: { e: 2000, w: 10000 },
      base: { pendingApps: 14, approved: 11, recon: { wait: 22, ok: 17, check: 5 }, unpaid: 22 },
      requests: { extend: null, transfer: null, checkout: null },
      drafts: {},
      chats: { SV260001: [{ me: false, t: 'Xin chào! Ban quản lý KTX có thể hỗ trợ gì cho bạn?', d: '12/10/2026 08:00' }] },
      contacts: [{ id: 'LH-1', name: 'Nguyễn Thị Hoa', contact: '0915 222 333', msg: 'Con tôi là tân sinh viên khóa 2026, cho hỏi còn phòng 4 người ở tầng 2 không ạ?', at: '20/10/2026 19:12', done: false }],
      general: { name: 'Ký túc xá Đại học Nghệ An', hotline: '0238 3555 888', email: 'ktx@dhna.edu.vn', address: 'Số 1 Đường Lê Duẩn, TP. Vinh, Nghệ An' },
      security: { minLen: 8, twofa: false, lockAfter: 5 },
      sysLog: [{ at: '15/10/2026 09:24', by: 'Phạm Văn Hùng', t: 'Duyệt hồ sơ HS2026-0027' }, { at: '15/10/2026 08:10', by: 'Quản trị viên', t: 'Đăng nhập hệ thống' }, { at: '14/10/2026 17:02', by: 'Lê Thị Thu', t: 'Cập nhật chỉ số điện nước tầng 3' }],
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const d = JSON.parse(raw); if (d && d.v === 5) { let alive = true; try { alive = !!sessionStorage.getItem('ktx-alive'); } catch (e) { /* no session storage */ } if (d.session && d.session.temp && !alive) d.session = null; return d; } }
    } catch (e) { /* storage unavailable */ }
    return seed();
  }

  const db = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* ignore */ } }
  function reset() { const s = seed(); Object.keys(db).forEach((k) => delete db[k]); Object.assign(db, s); save(); }

  // ---- helpers ----
  const money = (n) => (Math.round(n) || 0).toLocaleString('vi-VN').replace(/,/g, '.') + 'đ';
  const student = (id) => db.students.find((s) => s.id === id);
  const room = (c) => db.rooms.find((r) => r.code === c);
  const occupants = (c) => db.students.filter((s) => s.room === c && s.status === 'dang-o').sort((a, b) => a.bed - b.bed);
  const occCount = (c) => { const r = room(c); return r ? Math.min(r.beds, r.extra + occupants(c).length) : 0; };
  const freeBeds = (c) => { const r = room(c); return r ? r.beds - occCount(c) : 0; };
  const roomStatus = (c) => { const r = room(c); if (r.maint) return 'bao-tri'; const o = occCount(c); return o >= r.beds ? 'day' : o === 0 ? 'trong' : 'con'; };
  const bedMap = (c) => {
    const r = room(c); const occ = occupants(c); const used = new Set(occ.map((s) => s.bed));
    const map = []; let extra = r.extra;
    for (let b = 1; b <= r.beds; b++) {
      const s = occ.find((x) => x.bed === b);
      if (s) map.push({ bed: b, student: s });
      else if (extra > 0 && !used.has(b)) { map.push({ bed: b, anon: true }); extra--; }
      else map.push({ bed: b, free: true });
    }
    return map;
  };
  const khus = () => [...new Set(db.rooms.map((r) => r.khu))].sort((a, b) => a - b);
  const fl = (code) => { const r = room(code); return r ? r.khu : String(code || '').charAt(1); };
  const khuStats = () => khus().map((k) => {
    const rs = db.rooms.filter((r) => r.khu === k);
    const beds = rs.reduce((s, r) => s + r.beds, 0);
    const used = rs.reduce((s, r) => s + occCount(r.code), 0);
    return { khu: k, rooms: rs.length, beds, used, free: beds - used, rate: beds ? Math.round(used * 100 / beds) : 0 };
  });
  const me = () => (db.session && db.session.role === 'student') ? student(db.session.id) : null;
  const pad2 = (n) => String(n).padStart(2, '0');
  const now = () => { const d = new Date(); return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };
  const today = () => now().slice(0, 10);

  window.KTX = { db, save, reset, A, khus, fl, money, student, room, occupants, occCount, freeBeds, roomStatus, bedMap, khuStats, me, now, today, pad2 };
})();
