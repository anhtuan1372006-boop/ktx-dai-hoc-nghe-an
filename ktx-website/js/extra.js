/* Phần bổ sung: trang chủ đầy đủ, chân trang, hộp thư Ban quản lý, quản lý thông báo, biểu đồ báo cáo, chọn phòng, đánh giá sửa chữa */
(function () {
  const K = window.KTX, { esc, ic, im, av, spark, badge, sel } = App;
  const P = App.pages;
  const b2 = K.pad2, money = K.money;

  // ============ Chân trang công khai ============
  App.pubFooter = () => {
    const g = K.db.general;
    return `<footer class="pub-foot2"><div class="pf-in">
      <div class="pf-brand">${App.brand(false)}<p>Nơi ở an toàn, tiện nghi cho ${K.db.rooms.reduce((s, r) => s + r.beds, 0)} sinh viên trong tòa nhà ${K.khus().length} tầng. Ban quản lý trực 24/7 và hỗ trợ sinh viên trong suốt năm học.</p>
        <div class="pf-badges"><span>${ic('shield-check')}An ninh 24/7</span><span>${ic('wifi')}Wi-Fi miễn phí</span><span>${ic('leaf')}Môi trường xanh</span></div></div>
      <div><h4>Ký túc xá</h4><a href="#" data-nav="gioi-thieu">Giới thiệu</a><a href="#" data-go="phong-o">Phòng ở &amp; giá</a><a href="#" data-nav="tien-ich">Tiện ích</a><a href="#" data-nav="huong-dan">Hướng dẫn đăng ký</a></div>
      <div><h4>Sinh viên</h4><a href="#" data-go="dang-ky">Tạo tài khoản</a><a href="#" data-go="dang-nhap">Đăng nhập cổng sinh viên</a><a href="#" data-go="quen-mat-khau">Quên mật khẩu</a><a href="#" data-go="so-do">Danh sách 35 màn hình</a></div>
      <div><h4>Liên hệ</h4><p>${ic('phone')}${esc(g.hotline)}</p><p>${ic('mail')}${esc(g.email)}</p><p>${ic('map-pin')}${esc(g.address)}</p><p>${ic('clock')}7:30 – 17:00, Thứ Hai – Thứ Bảy</p></div>
    </div><div class="pf-bottom"><span>© 2026 Ký túc xá Đại học Nghệ An</span><span>Học tập · Sống đẹp · Cùng nhau</span></div></footer>`;
  };

  // ============ Các mục trang chủ ============
  const FAQ_HOME = [
    ['Ai được đăng ký ở ký túc xá?', 'Sinh viên chính quy đang học tại Đại học Nghệ An. Ưu tiên tân sinh viên, sinh viên ở xa, thuộc diện chính sách và có hoàn cảnh khó khăn.'],
    ['Hồ sơ đăng ký gồm những gì?', 'Giấy xác nhận sinh viên, bản sao CCCD, ảnh thẻ 3x4 và đơn đăng ký lưu trú. Bạn có thể tải ảnh chụp giấy tờ lên ngay khi đăng ký trực tuyến.'],
    ['Bao lâu thì hồ sơ được duyệt?', 'Ban quản lý xét duyệt trong 3 – 5 ngày làm việc. Kết quả được gửi qua mục Thông báo trên cổng sinh viên.'],
    ['Tiền điện, nước tính thế nào?', 'Ghi chỉ số theo phòng mỗi tháng, chi phí được chia đều cho số sinh viên đang ở. Đơn giá hiện hành: điện ' + money(K.db.prices.e) + '/kWh, nước ' + money(K.db.prices.w) + '/m³.'],
    ['Có thể chuyển phòng giữa năm không?', 'Có. Gửi yêu cầu tại mục Lưu trú › Chuyển phòng khi phòng muốn chuyển còn giường trống. Ban quản lý duyệt trong 3 – 5 ngày làm việc.'],
    ['Thanh toán bằng cách nào?', 'Chuyển khoản qua mã QR, ví điện tử (MoMo, ZaloPay, VNPay) hoặc nộp tiền mặt tại quầy tiếp nhận tầng 1.'],
  ];
  App.homeSections = () => {
    const ks = K.khuStats();
    const beds = ks.reduce((s, k) => s + k.beds, 0), free = ks.reduce((s, k) => s + k.free, 0);
    const types = [2, 4, 6, 8].map((b) => { const rs = K.db.rooms.filter((r) => r.beds === b && !r.maint); return rs.length ? { b, n: rs.length, price: Math.min(...rs.map((r) => r.price)), free: rs.reduce((s, r) => s + K.freeBeds(r.code), 0) } : null; }).filter(Boolean);
    const amen = [['wifi', 'Wi-Fi tốc độ cao', 'Phủ sóng toàn bộ phòng ở và khu sinh hoạt chung.', 'blue'], ['book-open', 'Phòng tự học', 'Mở cửa 6:00 – 23:00, yên tĩnh, đủ ánh sáng.', 'red'], ['shirt', 'Giặt sấy', 'Máy giặt, máy sấy tự phục vụ tại mỗi khu.', 'green'], ['utensils', 'Nhà ăn – căng tin', 'Suất ăn sinh viên giá hợp lý, mở cả ngày.', 'amber'], ['shield-check', 'An ninh 24/7', 'Bảo vệ trực, camera và thẻ ra vào.', 'blue'], ['dumbbell', 'Sân thể thao', 'Sân bóng chuyền, cầu lông và phòng gym mini.', 'red'], ['zap', 'Điện nước ổn định', 'Ghi chỉ số minh bạch, tính đúng theo sử dụng.', 'green'], ['heart-pulse', 'Y tế', 'Phòng y tế cơ bản, liên kết trạm y tế phường.', 'amber']];
    return `
    <section class="psec" id="sec-gioi-thieu"><div class="psec-in about">
      <div class="about-img"><img src="${K.A('community_big')}" alt="Sinh viên sinh hoạt tại sân ký túc xá"><span class="about-tag">${ic('sparkles')}Hơn 10 năm đồng hành cùng sinh viên</span></div>
      <div><span class="eyebrow">Giới thiệu</span><h2 class="psec-t">Một mái nhà thứ hai giữa giảng đường</h2>
        <p class="psec-d">Ký túc xá Đại học Nghệ An nằm ngay trong khuôn viên trường, đi bộ 5 phút tới giảng đường. Tòa nhà ${K.khus().length} tầng với phòng 2 – 8 người, mỗi giường có bàn học, tủ cá nhân có khóa và Wi-Fi miễn phí.</p>
        <div class="kpis">${[[beds, 'giường lưu trú'], [K.db.rooms.length, 'phòng ở'], [K.khus().length, 'tầng'], [free, 'giường còn trống']].map(([v, t]) => `<div><b class="num">${v}</b><span>${t}</span></div>`).join('')}</div>
        <div class="row" style="margin-top:22px;flex-wrap:wrap"><a href="#" class="btn btn-red" data-go="phong-o">Xem phòng còn trống ${ic('arrow-right')}</a><a href="#" class="btn btn-outline" data-nav="huong-dan">Cách đăng ký</a></div></div>
    </div></section>
    <section class="psec tint" id="sec-tien-ich"><div class="psec-in">
      <div class="psec-head"><span class="eyebrow">Tiện ích</span><h2 class="psec-t">Đầy đủ cho học tập và sinh hoạt</h2><p class="psec-d">Mọi thứ bạn cần cho một năm học trọn vẹn đều có trong khuôn viên ký túc xá.</p></div>
      <div class="amen-grid">${amen.map(([i, t, d, c]) => `<div class="amen-card"><span class="amen-ic ${c}">${ic(i)}</span><b>${t}</b><p>${d}</p></div>`).join('')}</div>
    </div></section>
    <section class="psec" id="sec-huong-dan"><div class="psec-in guide">
      <div><span class="eyebrow">Hướng dẫn</span><h2 class="psec-t">Bảng giá phòng năm học 2026 – 2027</h2>
        <div class="tbl-wrap" style="margin-top:18px"><table class="tbl"><thead><tr><th>Loại phòng</th><th class="c">Số phòng</th><th class="c">Giường trống</th><th class="r">Giá / tháng</th></tr></thead><tbody>${types.map((t) => `<tr><td><span class="row" style="gap:10px"><span class="amen-ic blue sm">${ic('bed-double')}</span>Phòng ${t.b} người</span></td><td class="c num">${t.n}</td><td class="c num">${t.free ? t.free : '<span class="muted">Hết</span>'}</td><td class="r num"><b style="color:var(--red)">${money(t.price)}</b></td></tr>`).join('')}</tbody></table></div>
        <p class="muted small" style="margin-top:10px">Giá chưa gồm điện, nước tính theo thực tế sử dụng (bình quân 50.000đ/người/tháng).</p>
        <div class="steps-mini">${[['search', 'Chọn phòng còn chỗ'], ['file-pen-line', 'Gửi hồ sơ trực tuyến'], ['badge-check', 'Nhận kết quả sau 3 – 5 ngày'], ['key-round', 'Xác nhận thỏa thuận, nhận phòng']].map(([i, t], k) => `<div><span>${k + 1}</span>${ic(i)}<b>${t}</b></div>`).join('')}</div></div>
      <div><span class="eyebrow">Câu hỏi thường gặp</span><h2 class="psec-t">Bạn hỏi, chúng tôi trả lời</h2>
        <div class="faq">${FAQ_HOME.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}${ic('chevron-down')}</summary><p>${a}</p></details>`).join('')}</div></div>
    </div></section>
    <section class="psec tint" id="sec-lien-he"><div class="psec-in contact">
      <div><span class="eyebrow">Liên hệ</span><h2 class="psec-t">Cần tư vấn? Nhắn cho chúng tôi</h2><p class="psec-d">Ban quản lý phản hồi trong giờ hành chính. Trường hợp khẩn cấp ngoài giờ, gọi hotline trực 24/7.</p>
        <div class="contact-list">${[['phone', 'Hotline', K.db.general.hotline], ['mail', 'Email', K.db.general.email], ['map-pin', 'Địa chỉ', K.db.general.address], ['clock', 'Giờ làm việc', '7:30 – 17:00, Thứ Hai – Thứ Bảy']].map(([i, t, v]) => `<div><span class="amen-ic blue">${ic(i)}</span><span><small>${t}</small><b>${esc(v)}</b></span></div>`).join('')}</div></div>
      <form class="card pad contact-form" id="hc-form" novalidate><h3 style="font-size:21px">Gửi lời nhắn</h3>
        <div class="grid g2" style="gap:14px;margin-top:14px"><div class="field"><label for="hc-name">Họ và tên <span class="req">*</span></label><input id="hc-name" class="input" placeholder="Nguyễn Văn A" autocomplete="name"></div><div class="field"><label for="hc-contact">Email hoặc số điện thoại <span class="req">*</span></label><input id="hc-contact" class="input" placeholder="Để chúng tôi liên hệ lại"></div></div>
        <div class="field" style="margin-top:14px"><label for="hc-topic">Chủ đề</label>${sel('hc-topic', ['Tư vấn chọn phòng', 'Thủ tục đăng ký', 'Học phí, chi phí', 'Khác'], 'Tư vấn chọn phòng')}</div>
        <div class="field" style="margin-top:14px"><label for="hc-msg">Nội dung <span class="req">*</span></label><textarea id="hc-msg" class="textarea" placeholder="Bạn cần hỗ trợ điều gì?"></textarea></div>
        <p class="err" id="hc-err" hidden style="margin-top:8px"></p><button class="btn btn-red btn-block" style="margin-top:16px">${ic('send')}Gửi lời nhắn</button></form>
    </div></section>`;
  };
  const homeMount = P['trang-chu'].mount;
  P['trang-chu'].mount = (root) => {
    homeMount(root);
    const f = root.querySelector('#hc-form');
    if (f) f.onsubmit = (e) => {
      e.preventDefault();
      const name = f.querySelector('#hc-name').value.trim(), contact = f.querySelector('#hc-contact').value.trim(), msg = f.querySelector('#hc-msg').value.trim();
      const err = f.querySelector('#hc-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
      if (!name) return fail('Vui lòng nhập họ và tên.');
      if (!/^\S+@\S+\.\S+$/.test(contact) && !/^0\d{9}$/.test(contact.replace(/\s/g, ''))) return fail('Nhập email hợp lệ hoặc số điện thoại 10 chữ số.');
      if (msg.length < 10) return fail('Nội dung cần tối thiểu 10 ký tự.');
      K.db.contacts.unshift({ id: 'LH-' + Date.now(), name, contact, topic: f.querySelector('#hc-topic').value, msg, at: K.now(), done: false });
      K.save(); f.reset(); err.hidden = true; App.toast('Đã gửi lời nhắn. Ban quản lý sẽ liên hệ lại với bạn sớm.');
    };
  };

  // ============ Phòng tương tự (chi tiết phòng) ============
  App.similarRooms = (r) => {
    const list = K.db.rooms.filter((x) => x.code !== r.code && !x.maint && K.freeBeds(x.code) > 0).sort((a, b) => (a.beds === r.beds ? 0 : 1) - (b.beds === r.beds ? 0 : 1) || (a.khu === r.khu ? 0 : 1) - (b.khu === r.khu ? 0 : 1)).slice(0, 4);
    if (!list.length) return '';
    return `<div style="margin-top:22px"><div class="card-h"><h2 style="font-size:24px">Phòng tương tự còn chỗ</h2><a href="#" class="link" data-go="phong-o">Xem tất cả ${ic('arrow-right')}</a></div>
      <div class="sim-grid">${list.map((x) => `<a href="#" class="card sim" data-go="phong-${x.code}"><div class="ph"><img src="${K.A(x.img)}" alt="Ảnh phòng ${x.code}" loading="lazy"><span class="khu-tag">TẦNG ${x.khu}</span></div><div style="padding:12px 14px"><b style="color:var(--navy);font-size:18px">Phòng ${x.code}</b><div class="muted small">Phòng ${x.beds} người · Tầng ${x.floor}</div><div class="row" style="justify-content:space-between;margin-top:8px">${App.freeBadge(x.code)}<b style="color:var(--red)">${money(x.price)}</b></div></div></a>`).join('')}</div></div>`;
  };

  // ============ Đăng ký lưu trú khi đã có phòng ============
  const regPage = P['sv-dang-ky-luu-tru'];
  P['sv-dang-ky-luu-tru'] = {
    role: 'student', title: regPage.title,
    render: (p) => {
      const u = K.me();
      if (!u.room) return regPage.render(p);
      const r = K.room(u.room);
      return App.shell({ role: 'student', active: 'sv-ho-so', logo: 'inline', notif: 'dot', search: 'Tìm dịch vụ, thông báo, hướng dẫn...', foot: 'illus', sbw: 262, icons: { 'sv-hoa-don': 'receipt-text' } }, `${App.phead({ cls: 'compact', crumb: [['Trang chủ', 'sv-tong-quan'], ['Lưu trú', 'sv-ho-so'], 'Đăng ký lưu trú'], title: 'Đăng ký lưu trú', desc: 'Bạn đang có chỗ ở tại ký túc xá, không cần đăng ký mới.' })}
        <div class="card pad resp-1" style="display:grid;grid-template-columns:300px 1fr;gap:24px;align-items:center"><img src="${K.A(r.code === 'A302' ? 'room_a302_wide' : r.img)}" style="width:100%;height:190px;object-fit:cover;border-radius:12px" alt="">
          <div><span class="badge b-green">${ic('circle-check')}Đang lưu trú</span><h2 style="font-size:30px;margin-top:10px">Phòng ${r.code} · Tầng ${r.khu} · Giường ${b2(u.bed)}</h2><p class="muted" style="margin-top:6px">Năm học 2026 – 2027 · ${K.occCount(r.code)}/${r.beds} sinh viên · ${money(r.price)}/tháng</p>
            <div class="row" style="margin-top:16px;flex-wrap:wrap"><button class="btn btn-red" data-go="sv-phong">${ic('door-open')}Xem phòng của tôi</button><button class="btn btn-outline" data-go="sv-ho-so">${ic('file-text')}Hồ sơ &amp; thỏa thuận</button></div></div></div>
        <h2 style="font-size:22px;margin-top:6px">Bạn muốn thay đổi chỗ ở?</h2>
        <div class="grid g3">${[['sv-gia-han', 'calendar-clock', 'Gia hạn lưu trú', 'Tiếp tục ở phòng hiện tại cho học kỳ sau.'], ['sv-chuyen-phong', 'arrow-left-right', 'Chuyển phòng', 'Đổi sang phòng khác còn giường trống.'], ['sv-tra-phong', 'log-out', 'Trả phòng', 'Kết thúc lưu trú và bàn giao tài sản.']].map(([g, i, t, d]) => `<a href="#" class="card pad hover-lift" data-go="${g}" style="display:flex;gap:16px;align-items:center;color:var(--ink)"><span class="amen-ic blue">${ic(i)}</span><span style="flex:1"><b style="color:var(--navy);font-size:17px;display:block">${t}</b><small class="muted">${d}</small></span>${ic('chevron-right')}</a>`).join('')}</div>`);
    },
    mount: (root, p) => { if (!K.me().room && regPage.mount) regPage.mount(root, p); },
  };

  // ============ Đánh giá kết quả sửa chữa ============
  App.repairRating = (rq) => {
    if (rq.status === 'moi') return `<div class="card pad" style="padding:16px 22px"><h2 class="card-t" style="font-size:18px">${ic('circle-x')}Không cần sửa nữa?</h2><p class="muted small" style="margin:6px 0 12px">Bạn có thể hủy yêu cầu khi chưa được phân công.</p><button class="btn btn-outline-red btn-sm" id="rq-cancel">Hủy yêu cầu</button></div>`;
    if (rq.status !== 'hoan-tat') return '';
    if (rq.rating) return `<div class="card pad" style="padding:16px 22px"><h2 class="card-t" style="font-size:18px">${ic('star')}Đánh giá của bạn</h2><div class="stars ro" style="margin-top:8px">${[1, 2, 3, 4, 5].map((n) => `<span class="${n <= rq.rating ? 'on' : ''}">${ic('star')}</span>`).join('')}</div>${rq.ratingNote ? `<p style="margin-top:8px;color:var(--text)">“${esc(rq.ratingNote)}”</p>` : ''}</div>`;
    return `<div class="card pad" style="padding:16px 22px"><h2 class="card-t" style="font-size:18px">${ic('star')}Đánh giá kết quả sửa chữa</h2><p class="muted small" style="margin-top:4px">Sự cố đã được xử lý xong chưa? Đánh giá giúp Ban quản lý nâng cao chất lượng.</p>
      <div class="stars" id="rt-stars" style="margin-top:10px">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}" aria-label="${n} sao">${ic('star')}</button>`).join('')}</div>
      <textarea id="rt-note" class="textarea" placeholder="Nhận xét thêm (không bắt buộc)" style="min-height:70px;margin-top:10px"></textarea>
      <div class="row" style="margin-top:10px"><button class="btn btn-red btn-sm" id="rt-send">Gửi đánh giá</button><button class="btn btn-outline btn-sm" id="rt-reopen">Chưa sửa xong</button></div></div>`;
  };
  App.bindRepairRating = (root, rq) => {
    let val = 0;
    const paint = () => root.querySelectorAll('[data-star]').forEach((b) => b.classList.toggle('on', +b.dataset.star <= val));
    root.querySelectorAll('[data-star]').forEach((b) => b.onclick = () => { val = +b.dataset.star; paint(); });
    const s = root.querySelector('#rt-send'); if (s) s.onclick = () => { if (!val) return App.toast('Chọn số sao đánh giá', 'err'); rq.rating = val; rq.ratingNote = root.querySelector('#rt-note').value.trim(); K.save(); App.toast('Cảm ơn bạn đã đánh giá!'); App.refresh(); };
    const ro = root.querySelector('#rt-reopen'); if (ro) ro.onclick = () => App.confirm('Báo chưa sửa xong', 'Yêu cầu sẽ được mở lại và chuyển về trạng thái “Đang xử lý”.', 'Mở lại yêu cầu', () => { rq.status = 'dang-xu-ly'; rq.msgs = rq.msgs || []; const u = K.me(); rq.msgs.push({ who: u.name, av: u.avatar, d: K.now(), m: 'Sự cố vẫn chưa được khắc phục, nhờ bộ phận kỹ thuật kiểm tra lại.' }); K.save(); App.toast('Đã mở lại yêu cầu ' + rq.id); App.refresh(); });
    const c = root.querySelector('#rq-cancel'); if (c) c.onclick = () => App.confirm('Hủy yêu cầu', 'Hủy yêu cầu <b>' + esc(rq.title) + '</b>?', 'Hủy yêu cầu', () => { K.db.repairs = K.db.repairs.filter((x) => x.id !== rq.id); K.save(); App.toast('Đã hủy yêu cầu ' + rq.id); App.go('sv-sua-chua'); }, true);
  };

  // ============ Chọn phòng còn trống ============
  App.pickRoom = (o, cb) => {
    const rooms = () => K.db.rooms.filter((r) => r.code !== o.exclude && !r.maint && K.freeBeds(r.code) > 0);
    App.modal({ title: o.title || 'Chọn phòng', wide: true, body: `<div class="row" style="margin-bottom:12px;flex-wrap:wrap"><div style="width:180px">${sel('pk-khu', [['', 'Tất cả tầng'], ...App.khuOpts()], o.khu || '')}</div><div style="width:180px">${sel('pk-type', [['', 'Mọi loại phòng'], ['2', '2 người'], ['4', '4 người'], ['6', '6 người'], ['8', '8 người']], '')}</div></div><div class="tbl-wrap" style="max-height:52vh;overflow:auto"><table class="tbl hover"><thead><tr><th>Phòng</th><th>Loại</th><th>Còn trống</th><th>Giường</th><th></th></tr></thead><tbody id="pk-body"></tbody></table></div>`,
      onMount: (el, close) => {
        const draw = () => {
          const k = el.querySelector('#pk-khu').value, t = el.querySelector('#pk-type').value;
          const list = rooms().filter((r) => (!k || r.khu === k) && (!t || String(r.beds) === t));
          el.querySelector('#pk-body').innerHTML = list.map((r) => { const freeB = K.bedMap(r.code).filter((b) => b.free).map((b) => b.bed); return `<tr><td><b>${r.code}</b> <small class="muted">Tầng ${r.floor}</small></td><td>${r.beds} người</td><td>${freeB.length} giường</td><td><select class="select" data-bedsel="${r.code}" style="height:38px;width:120px">${freeB.map((b) => `<option value="${b}">Giường ${b2(b)}</option>`).join('')}</select></td><td><button class="btn btn-sm btn-red" data-pk="${r.code}">Chọn</button></td></tr>`; }).join('') || '<tr><td colspan="5" class="muted" style="text-align:center;padding:20px">Không còn phòng trống phù hợp.</td></tr>';
          el.querySelectorAll('[data-pk]').forEach((b) => b.onclick = () => { const code = b.dataset.pk; const bed = +el.querySelector(`[data-bedsel="${code}"]`).value; close(); cb(code, bed); });
        };
        el.querySelector('#pk-khu').onchange = draw; el.querySelector('#pk-type').onchange = draw; draw();
      } });
  };

  // ============ Thông báo: thanh điều hướng ============
  const inboxCount = () => K.db.feedback.filter((f) => f.status !== 'da-phan-hoi').length + Object.values(K.db.chats || {}).filter((m) => m.some((x) => x.me && x.unread)).length + (K.db.contacts || []).filter((c) => !c.done).length;
  App.inboxCount = inboxCount;
  App.noteTabs = (active) => `<div class="seg note-tabs">${[['ql-thong-bao', 'Soạn thông báo', 'pen-line'], ['ql-thong-bao-ds', 'Đã đăng (' + K.db.notifications.filter((n) => !n.to).length + ')', 'list'], ['ql-phan-anh', 'Phản ánh &amp; liên hệ' + (inboxCount() ? ' (' + inboxCount() + ')' : ''), 'inbox']].map(([g, t, i]) => `<button class="pill ${g === active ? 'on' : ''}" ${g === active ? '' : `data-go="${g}"`} data-newnote="${g === 'ql-thong-bao' ? 1 : ''}">${ic(i)}${t}</button>`).join('')}</div>`;
  const adminShell = (body, extra) => App.shell(Object.assign({ role: 'admin', logo: 'inline', active: 'ql-thong-bao', search: 'Tìm sinh viên, phòng, thông báo...', sbw: 282, icons: { 'ql-thong-bao': 'megaphone', 'ql-hop-dong': 'file-pen-line' } }, extra || {}), body);
  const CAT_BACK = { 'Hoạt động': 'Hoạt động sinh viên', 'Lưu trú': 'Lưu trú' };

  P['ql-thong-bao-ds'] = {
    role: 'admin', title: 'Thông báo đã đăng',
    render: () => {
      const st = App.state('notes', { q: '', cat: '' });
      let list = K.db.notifications.filter((n) => !n.to);
      if (st.q) list = list.filter((n) => (n.title + n.summary).toLowerCase().includes(st.q.toLowerCase()));
      if (st.cat) list = list.filter((n) => n.cat === st.cat);
      const sched = K.db.notifications.filter((n) => String(n.time).startsWith('Hẹn')).length;
      return adminShell(`<div><h1 style="font-size:38px;font-weight:800">Thông báo</h1>${App.crumb([['Thông báo', 'ql-thong-bao'], 'Đã đăng'])}</div>${App.noteTabs('ql-thong-bao-ds')}
        <div class="grid g3" style="gap:12px">${[['megaphone', 'Tổng thông báo', K.db.notifications.filter((n) => !n.to).length, 'blue'], ['star', 'Đánh dấu quan trọng', K.db.notifications.filter((n) => !n.to && n.important).length, 'red'], ['calendar-clock', 'Đang hẹn giờ đăng', sched, 'amber']].map(([i, t, v, c]) => `<div class="stat"><span class="amen-ic ${c}">${ic(i)}</span><div><div class="lbl2">${t}</div><div class="val">${v}</div></div></div>`).join('')}</div>
        <div class="card pad"><div class="row" style="flex-wrap:wrap;margin-bottom:14px"><div class="iwrap" style="flex:1;min-width:220px">${ic('search')}<input id="nl-q" class="input" placeholder="Tìm theo tiêu đề, nội dung..." value="${esc(st.q)}"></div><div style="width:200px">${sel('nl-cat', [['', 'Tất cả danh mục'], 'Lưu trú', 'Hoạt động'], st.cat)}</div><button class="btn btn-red" data-go="ql-thong-bao" data-newnote="1">${ic('plus')}Soạn thông báo mới</button></div>
          <div class="tbl-wrap"><table class="tbl hover"><thead><tr><th>Thông báo</th><th>Danh mục</th><th>Thời gian</th><th>Trạng thái</th><th class="r">Thao tác</th></tr></thead><tbody>${list.map((n) => `<tr><td><span class="who">${im(n.icon, 'blend', '').replace('<img', '<img style="width:44px;height:44px;border-radius:10px"')}<span><b style="white-space:normal">${esc(n.title)}</b><small style="display:block;max-width:420px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(n.summary)}</small></span></span></td><td>${badge(n.cat, n.cat === 'Lưu trú' ? 'blue' : 'red', { sm: true })}</td><td class="num">${esc(n.time)}</td><td>${String(n.time).startsWith('Hẹn') ? badge('Hẹn giờ', 'orange', { icon: 'clock', sm: true }) : badge('Đã đăng', 'green', { dot: true, sm: true })}${n.important ? ' ' + badge('Quan trọng', 'red', { sm: true }) : ''}</td><td class="r" style="white-space:nowrap"><span style="display:inline-flex;gap:2px"><button class="xbtn" data-view="${n.id}" title="Xem">${ic('eye')}</button><button class="xbtn" data-edit="${n.id}" title="Sửa">${ic('pencil')}</button><button class="xbtn" data-pin="${n.id}" title="${n.important ? 'Bỏ quan trọng' : 'Đánh dấu quan trọng'}">${ic(n.important ? 'star-off' : 'star')}</button><button class="xbtn" data-del="${n.id}" title="Xóa" style="color:var(--red)">${ic('trash-2')}</button></span></td></tr>`).join('') || '<tr><td colspan="5" class="muted" style="text-align:center;padding:26px">Không có thông báo phù hợp.</td></tr>'}</tbody></table></div></div>`);
    },
    mount: (root) => {
      const st = App.st.notes;
      const q = root.querySelector('#nl-q'); q.onchange = () => { st.q = q.value.trim(); App.refresh(); };
      root.querySelector('#nl-cat').onchange = (e) => { st.cat = e.target.value; App.refresh(); };
      const N = (id) => K.db.notifications.find((n) => n.id === id);
      root.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => { const n = N(b.dataset.view); App.modal({ title: n.title, wide: true, body: `<div class="row muted">${ic('users')}${esc(n.author)} · ${esc(n.time)}</div>${n.img ? `<img src="${K.A(n.img)}" style="width:100%;height:220px;object-fit:cover;border-radius:10px;margin-top:12px" alt="">` : ''}<div style="margin-top:12px;line-height:1.7">${n.body.map((p) => `<p style="margin-bottom:8px">${esc(p)}</p>`).join('')}</div>` }); });
      root.querySelectorAll('[data-edit]').forEach((b) => b.onclick = () => { const n = N(b.dataset.edit); App.st.compose = { title: n.title, cat: CAT_BACK[n.cat] || 'Lưu trú', cover: n.img || 'cover_comm', target: 'Toàn bộ sinh viên', khu: [], when: 'now', at: '2026-10-18T18:00', portal: true, html: n.body.map((p) => `<div>${esc(p)}</div>`).join(''), editId: n.id }; App.go('ql-thong-bao'); });
      root.querySelectorAll('[data-pin]').forEach((b) => b.onclick = () => { const n = N(b.dataset.pin); n.important = !n.important; K.save(); App.toast(n.important ? 'Đã đánh dấu quan trọng (hiện trên tổng quan sinh viên)' : 'Đã bỏ đánh dấu quan trọng'); App.refresh(); });
      root.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => { const n = N(b.dataset.del); App.confirm('Xóa thông báo', 'Xóa thông báo “<b>' + esc(n.title) + '</b>”? Sinh viên sẽ không còn thấy thông báo này.', 'Xóa thông báo', () => { K.db.notifications = K.db.notifications.filter((x) => x.id !== n.id); K.db.activity.unshift({ at: K.now(), by: 'Quản trị viên', av: 'av_admin', act: 'Xóa thông báo', icon: 'doc', text: 'Xóa thông báo “' + n.title + '”' }); K.save(); App.toast('Đã xóa thông báo'); App.refresh(); }, true); });
    },
  };

  // ============ Hộp thư: phản ánh, tin nhắn, liên hệ ============
  const notifyStudent = (sid, title, body) => K.db.notifications.unshift({ id: 'N' + Date.now() + Math.random().toString(36).slice(2, 5), title, summary: body.slice(0, 90), cat: 'Lưu trú', icon: 'ni_doc', time: 'Vừa xong', author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', read: false, to: sid, body: [body] });
  P['ql-phan-anh'] = {
    role: 'admin', title: 'Phản ánh & liên hệ',
    render: () => {
      const st = App.state('inbox', { kind: 'fb', sel: null });
      const chats = Object.entries(K.db.chats || {}).filter(([, m]) => m.some((x) => x.me));
      const tabs = [['fb', 'Phản ánh', K.db.feedback.filter((f) => f.status !== 'da-phan-hoi').length], ['chat', 'Tin nhắn', chats.filter(([, m]) => m.some((x) => x.me && x.unread)).length], ['ct', 'Liên hệ từ trang chủ', (K.db.contacts || []).filter((c) => !c.done).length]];
      let items = [];
      if (st.kind === 'fb') items = K.db.feedback.map((f) => ({ id: f.id, av: (K.student(f.student) || {}).avatar, t: f.title, s: (K.student(f.student) || { name: f.student }).name + ' · ' + f.type, d: f.date, open: f.status !== 'da-phan-hoi' }));
      else if (st.kind === 'chat') items = chats.map(([sid, m]) => ({ id: sid, av: (K.student(sid) || {}).avatar, t: (K.student(sid) || { name: sid }).name, s: m[m.length - 1].t, d: m[m.length - 1].d, open: m.some((x) => x.me && x.unread) }));
      else items = (K.db.contacts || []).map((c) => ({ id: c.id, av: null, t: c.name, s: c.msg, d: c.at, open: !c.done }));
      const cur = items.find((x) => x.id === st.sel) || items[0]; if (cur) st.sel = cur.id;
      let detail = '<div class="card pad empty"><span class="amen-ic blue">' + ic('inbox') + '</span><p>Chưa có mục nào.</p></div>';
      if (cur && st.kind === 'fb') {
        const f = K.db.feedback.find((x) => x.id === cur.id); const s = K.student(f.student);
        detail = `<div class="card pad"><div class="row" style="justify-content:space-between;flex-wrap:wrap"><span class="row">${s ? av(s.avatar, 52) : ''}<span><b style="color:var(--navy);font-size:17px;display:block">${esc(s ? s.name : f.student)}</b><small class="muted">${f.student}${s && s.room ? ' · Phòng ' + s.room : ''} · Gửi ${f.date}</small></span></span>${f.status === 'da-phan-hoi' ? badge('Đã phản hồi', 'green', { icon: 'circle-check' }) : badge('Đang tiếp nhận', 'orange', { icon: 'clock' })}</div>
          <span class="badge b-blue b-sm" style="margin-top:16px">${f.type}</span><h2 style="font-size:24px;margin-top:8px">${esc(f.title)}</h2><p style="white-space:pre-line;line-height:1.7;margin-top:10px;color:var(--ink)">${esc(f.body)}</p>
          ${f.reply ? `<div class="reply-box"><b>${ic('reply')}Phản hồi của Ban quản lý</b><p>${esc(f.reply)}</p></div>` : ''}
          <div class="field" style="margin-top:16px"><label for="ib-reply">${f.reply ? 'Cập nhật phản hồi' : 'Phản hồi sinh viên'}</label><textarea id="ib-reply" class="textarea" placeholder="Nội dung phản hồi sẽ gửi tới sinh viên qua mục Thông báo...">${esc(f.reply || '')}</textarea></div>
          <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn btn-outline" id="ib-task">${ic('wrench')}Tạo phiếu bảo trì</button><button class="btn btn-red" id="ib-send">${ic('send')}Gửi phản hồi</button></div></div>`;
      } else if (cur && st.kind === 'chat') {
        const m = K.db.chats[cur.id]; const s = K.student(cur.id);
        detail = `<div class="card pad"><div class="row">${s ? av(s.avatar, 48) : ''}<span><b style="color:var(--navy);font-size:17px;display:block">${esc(s ? s.name : cur.id)}</b><small class="muted">${cur.id}${s && s.room ? ' · Phòng ' + s.room : ''}</small></span></div>
          <div class="chat-box" id="ib-chat">${m.map((x) => `<div class="msg ${x.me ? 'them' : 'mine'}"><div>${esc(x.t)}</div><small>${x.me ? esc(s ? s.name : '') : 'Ban quản lý'} · ${esc(x.d || '')}</small></div>`).join('')}</div>
          <form class="row" id="ib-chat-f" style="margin-top:12px"><input id="ib-chat-in" class="input" placeholder="Nhập câu trả lời..." style="flex:1"><button class="btn btn-red">${ic('send')}Gửi</button></form></div>`;
      } else if (cur) {
        const c = K.db.contacts.find((x) => x.id === cur.id);
        detail = `<div class="card pad"><div class="row" style="justify-content:space-between"><span><b style="color:var(--navy);font-size:20px;display:block">${esc(c.name)}</b><small class="muted">${esc(c.contact)} · ${c.at}${c.topic ? ' · ' + esc(c.topic) : ''}</small></span>${c.done ? badge('Đã liên hệ', 'green', { icon: 'circle-check' }) : badge('Chưa xử lý', 'orange', { icon: 'clock' })}</div><p style="line-height:1.7;margin-top:16px;color:var(--ink);white-space:pre-line">${esc(c.msg)}</p>
          <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-outline" id="ib-copy">${ic('copy')}Sao chép liên hệ</button><button class="btn ${c.done ? 'btn-outline' : 'btn-red'}" id="ib-done">${ic(c.done ? 'rotate-ccw' : 'check')}${c.done ? 'Đánh dấu chưa xử lý' : 'Đánh dấu đã liên hệ'}</button></div></div>`;
      }
      return adminShell(`<div><h1 style="font-size:38px;font-weight:800">Phản ánh &amp; liên hệ</h1>${App.crumb([['Thông báo', 'ql-thong-bao'], 'Phản ánh & liên hệ'])}</div>${App.noteTabs('ql-phan-anh')}
        <div class="grid resp-1" style="grid-template-columns:400px 1fr;gap:14px;align-items:start">
          <div class="card" style="padding:10px"><div class="seg" style="width:100%;border:0;background:#f1f6fd;margin-bottom:8px">${tabs.map(([k, t, n]) => `<button class="pill ${st.kind === k ? 'on' : ''}" data-kind="${k}" style="flex:1;justify-content:center;padding:0 8px;font-size:14px;${st.kind === k ? '' : 'background:transparent'}">${t}${n ? ` <span class="cnt-dot">${n}</span>` : ''}</button>`).join('')}</div>
            <div style="max-height:620px;overflow:auto">${items.map((x) => `<button class="inbox-item ${x.id === st.sel ? 'on' : ''}" data-item="${x.id}">${x.av ? av(x.av, 42) : `<span class="amen-ic blue sm">${ic('user-round')}</span>`}<span style="flex:1;min-width:0"><b>${esc(x.t)}</b><small>${esc(x.s)}</small></span><span style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><small class="muted">${esc(String(x.d).slice(0, 10))}</small>${x.open ? '<i class="unread-dot"></i>' : ''}</span></button>`).join('') || '<p class="muted" style="text-align:center;padding:30px">Không có mục nào.</p>'}</div></div>
          ${detail}</div>`);
    },
    mount: (root) => {
      const st = App.st.inbox;
      root.querySelectorAll('[data-kind]').forEach((b) => b.onclick = () => { st.kind = b.dataset.kind; st.sel = null; App.refresh(); });
      root.querySelectorAll('[data-item]').forEach((b) => b.onclick = () => { st.sel = b.dataset.item; App.refresh(); });
      const chat = root.querySelector('#ib-chat'); if (chat) { chat.scrollTop = 1e6; const m = K.db.chats[st.sel]; if (m.some((x) => x.unread)) { m.forEach((x) => delete x.unread); K.save(); } }
      const send = root.querySelector('#ib-send'); if (send) send.onclick = () => {
        const f = K.db.feedback.find((x) => x.id === st.sel); const v = root.querySelector('#ib-reply').value.trim();
        if (v.length < 5) return App.toast('Nội dung phản hồi cần tối thiểu 5 ký tự', 'err');
        f.reply = v; f.status = 'da-phan-hoi'; f.repliedAt = K.now();
        notifyStudent(f.student, 'Phản hồi: ' + f.title, v);
        K.db.activity.unshift({ at: K.now(), by: 'Quản trị viên', av: 'av_admin', act: 'Phản hồi phản ánh', icon: 'ok', text: 'Phản hồi “' + f.title + '” của ' + ((K.student(f.student) || {}).name || f.student) });
        K.save(); App.toast('Đã gửi phản hồi tới sinh viên'); App.refresh();
      };
      const task = root.querySelector('#ib-task'); if (task) task.onclick = () => { const f = K.db.feedback.find((x) => x.id === st.sel); const s = K.student(f.student); App.newWorkOrder({ room: s && s.room ? s.room : 'A302' }); setTimeout(() => { const t = document.querySelector('#w-title'); if (t) t.value = f.title; const d = document.querySelector('#w-desc'); if (d) d.value = f.body; }, 50); };
      const cf = root.querySelector('#ib-chat-f'); if (cf) cf.onsubmit = (e) => { e.preventDefault(); const v = root.querySelector('#ib-chat-in').value.trim(); if (!v) return; K.db.chats[st.sel].push({ me: false, t: v, d: K.now() }); notifyStudent(st.sel, 'Ban quản lý đã trả lời tin nhắn của bạn', v); K.save(); App.refresh(); };
      const done = root.querySelector('#ib-done'); if (done) done.onclick = () => { const c = K.db.contacts.find((x) => x.id === st.sel); c.done = !c.done; K.save(); App.toast(c.done ? 'Đã đánh dấu đã liên hệ' : 'Đã chuyển về chưa xử lý'); App.refresh(); };
      const cp = root.querySelector('#ib-copy'); if (cp) cp.onclick = () => { const c = K.db.contacts.find((x) => x.id === st.sel); const t = c.name + ' – ' + c.contact; try { navigator.clipboard.writeText(t).then(() => App.toast('Đã sao chép: ' + t)).catch(() => App.toast(t)); } catch (e2) { App.toast(t); } };
    },
  };
  // "Soạn thông báo mới" từ các trang khác: xóa trạng thái sửa
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-newnote="1"]'); if (b && App.st.compose && App.st.compose.editId) App.st.compose = null; }, true);

  // ============ Biểu đồ cột (SVG) ============
  App.colChart = ({ labels, series, stacked, fmt, h }) => {
    const W = 760, H = h || 240, L = 52, R = 12, T = 16, B = 34;
    fmt = fmt || ((v) => v.toLocaleString('vi-VN'));
    const totals = labels.map((_, i) => (stacked ? series.reduce((s, x) => s + x.values[i], 0) : Math.max(...series.map((x) => x.values[i]))));
    const rawMax = Math.max(1, ...totals);
    const mag = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => rawMax / s <= 4) || mag * 10;
    const max = step * Math.ceil(rawMax / step);
    const y = (v) => T + (H - T - B) * (1 - v / max);
    const band = (W - L - R) / labels.length;
    const groupW = Math.min(band * 0.62, stacked ? 56 : 30 * series.length + 4);
    const ticks = []; for (let v = 0; v <= max + 1e-9; v += step) ticks.push(v);
    let marks = '';
    labels.forEach((lab, i) => {
      const cx = L + band * i + band / 2;
      const tip = esc(lab) + '|' + series.map((s) => esc(s.name) + ': ' + esc(fmt(s.values[i]))).join('|');
      if (stacked) {
        let acc = 0;
        const segs = series.map((s, k) => { const v = s.values[i]; const y0 = y(acc), y1 = y(acc + v); acc += v; const hh = Math.max(0, y0 - y1 - (k < series.length - 1 && v ? 2 : 0)); return v ? `<rect x="${cx - groupW / 2}" y="${y1}" width="${groupW}" height="${hh}" rx="${k === series.length - 1 || series.slice(k + 1).every((z) => !z.values[i]) ? 4 : 0}" fill="${s.color}"/>` : ''; }).join('');
        marks += `<g class="cbar" data-tip="${tip}">${segs}<rect x="${cx - band / 2}" y="${T}" width="${band}" height="${H - T - B}" fill="transparent"/></g>`;
      } else {
        const bw = (groupW - 2 * (series.length - 1)) / series.length;
        marks += `<g class="cbar" data-tip="${tip}">${series.map((s, k) => { const v = s.values[i]; const x0 = cx - groupW / 2 + k * (bw + 2); return `<rect x="${x0}" y="${y(v)}" width="${bw}" height="${Math.max(0, y(0) - y(v))}" rx="${Math.min(4, bw / 2)}" fill="${s.color}"/>`; }).join('')}<rect x="${cx - band / 2}" y="${T}" width="${band}" height="${H - T - B}" fill="transparent"/></g>`;
      }
      marks += `<text x="${cx}" y="${H - 12}" text-anchor="middle" class="ctick">${esc(lab)}</text>`;
      if (labels.length <= 8) marks += `<text x="${cx}" y="${y(totals[i]) - 6}" text-anchor="middle" class="cval">${esc(fmt(totals[i]))}</text>`;
    });
    const grid = ticks.map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="cgrid"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" class="ctick">${esc(fmt(v))}</text>`).join('');
    const legend = series.length > 1 ? `<div class="clegend">${series.map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>` : '';
    return `<div class="chart">${legend}<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Biểu đồ cột">${grid}${marks}</svg><div class="ctip" hidden></div></div>`;
  };
  App.bindCharts = (root) => root.querySelectorAll('.chart').forEach((c) => {
    const tip = c.querySelector('.ctip');
    c.querySelectorAll('.cbar').forEach((g) => {
      g.addEventListener('mousemove', (e) => { const [h, ...rows] = g.dataset.tip.split('|'); tip.innerHTML = `<b>${h}</b>${rows.map((r) => `<div>${r}</div>`).join('')}`; tip.hidden = false; const rc = c.getBoundingClientRect(); let x = e.clientX - rc.left + 14; if (x + 190 > rc.width) x -= 210; tip.style.left = x + 'px'; tip.style.top = (e.clientY - rc.top - 10) + 'px'; g.classList.add('hot'); });
      g.addEventListener('mouseleave', () => { tip.hidden = true; g.classList.remove('hot'); });
    });
  });
  const BLUE = '#2563eb', AMBER = '#e8a33a', NEUTRAL = '#cdd7e6';
  App.reportChart = (tab, khu) => {
    let title, chart, note;
    if (tab === 'stay') {
      const ks = K.khuStats().filter((k) => !khu || k.khu === khu);
      title = 'Giường đang ở và còn trống theo tầng'; note = 'Cột chồng: phần xanh là giường đang có sinh viên, phần xám là giường trống.';
      chart = App.colChart({ labels: ks.map((k) => 'Tầng ' + k.khu), series: [{ name: 'Đang ở', color: BLUE, values: ks.map((k) => k.used) }, { name: 'Còn trống', color: NEUTRAL, values: ks.map((k) => k.free) }], stacked: true });
    } else if (tab === 'fee') {
      const I = K.db.invoices.filter((i) => !khu || i.khu === khu);
      const per = [...new Set(I.map((i) => i.period))].sort((a, b) => a.split('/').reverse().join('').localeCompare(b.split('/').reverse().join('')));
      const sum = (p, paid) => I.filter((i) => i.period === p && (paid ? i.status === 'da-tt' : i.status !== 'da-tt')).reduce((s, i) => s + i.total, 0);
      title = 'Số tiền đã thu và còn phải thu theo kỳ'; note = 'Tổng chiều cao cột là số tiền phải thu của kỳ.';
      chart = App.colChart({ labels: per, series: [{ name: 'Đã thu', color: BLUE, values: per.map((p) => sum(p, true)) }, { name: 'Còn phải thu', color: AMBER, values: per.map((p) => sum(p, false)) }], stacked: true, fmt: (v) => (v >= 1e6 ? (v / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + 'tr' : Math.round(v / 1000) + 'k') });
    } else if (tab === 'util') {
      const months = Object.keys(K.db.meters).sort((a, b) => a.split('/').reverse().join('').localeCompare(b.split('/').reverse().join('')));
      const sumE = (mo, k) => Object.entries(K.db.meters[mo]).filter(([r, x]) => K.fl(r) === k && x.en != null && x.eo != null).reduce((a, [, x]) => a + x.en - x.eo, 0);
      const ks = K.khus().filter((k) => !khu || k === khu);
      title = 'Điện tiêu thụ theo tầng (kWh)'; note = 'Mỗi cột là một kỳ; cột chồng theo tầng.';
      const cols = ['#2563eb', '#e8a33a', '#16a34a', '#9333ea', '#64748b'];
      chart = months.length ? App.colChart({ labels: months, series: ks.map((k, i) => ({ name: 'Tầng ' + k, color: cols[i % cols.length], values: months.map((mo) => sumE(mo, k)) })), stacked: true, fmt: (v) => v.toLocaleString('vi-VN').replace(/,/g, '.') }) : '<p class="muted" style="padding:20px;text-align:center">Chưa có chỉ số.</p>';
    } else if (tab === 'rule') {
      const RA = App.rulesApi; const VS = K.db.violations.filter((v) => v.status !== 'da-huy' && (!khu || K.fl((K.student(v.student) || {}).room) === khu));
      const cats = RA.CATS.filter((c) => VS.some((v) => RA.rule(v.rule).cat === c));
      title = 'Số vi phạm theo nhóm nội quy'; note = 'Cột chồng: phần xanh đã xử lý, phần cam đang chờ xử lý hoặc khiếu nại.';
      chart = cats.length ? App.colChart({ labels: cats, series: [{ name: 'Đã xử lý', color: BLUE, values: cats.map((c) => VS.filter((v) => RA.rule(v.rule).cat === c && v.status === 'da-xu-ly').length) }, { name: 'Đang mở', color: AMBER, values: cats.map((c) => VS.filter((v) => RA.rule(v.rule).cat === c && v.status !== 'da-xu-ly').length) }], stacked: true, fmt: (v) => v + '' }) : '<p class="muted" style="padding:20px;text-align:center">Chưa có vi phạm.</p>';
    } else {
      const R = K.db.repairs.filter((r) => !khu || (r.room && K.fl(r.room) === khu));
      const kinds = [...new Set(R.map((r) => r.kind || r.category))];
      title = 'Số phiếu bảo trì theo loại sự cố'; note = 'Gồm cả phiếu đang mở và đã hoàn tất.';
      chart = App.colChart({ labels: kinds, series: [{ name: 'Số phiếu', color: BLUE, values: kinds.map((k) => R.filter((r) => (r.kind || r.category) === k).length) }], fmt: (v) => v + '' });
    }
    return `<div class="card pad" style="padding:18px 18px"><h2 class="card-t" style="font-size:20px;margin-bottom:4px">${ic('chart-column')}${title}</h2>${note ? `<p class="muted small" style="margin-bottom:10px">${note}</p>` : ''}${chart}</div>`;
  };
  App.copyTable = (tbl) => {
    if (!tbl) return;
    const csv = [...tbl.querySelectorAll('tr')].map((tr) => [...tr.children].map((td) => '"' + td.textContent.trim().replace(/\s+/g, ' ').replace(/"/g, '""') + '"').join(',')).join('\n');
    const fallback = () => App.modal({ title: 'Sao chép dữ liệu', body: `<textarea class="textarea" style="min-height:220px" readonly>${esc(csv)}</textarea><p class="muted small" style="margin-top:8px">Chọn toàn bộ (Ctrl+A) rồi sao chép (Ctrl+C), sau đó dán vào Excel.</p>` });
    try { navigator.clipboard.writeText(csv).then(() => App.toast('Đã sao chép bảng số liệu. Dán (Ctrl+V) vào Excel hoặc Google Sheets.')).catch(fallback); } catch (e) { fallback(); }
  };

  // ============ Nút lên đầu trang ============
  const top = document.createElement('button');
  top.className = 'totop'; top.setAttribute('aria-label', 'Lên đầu trang'); top.hidden = true;
  top.innerHTML = ic('arrow-up');
  top.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(top);
  window.addEventListener('scroll', () => { top.hidden = window.scrollY < 600; }, { passive: true });
  App.icons(top);
})();
