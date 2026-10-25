/* v5 – Giao diện khách: trang chủ mới theo thiết kế, Tiện ích, Sự kiện (album), Hướng dẫn, Tra cứu hồ sơ, chân trang mới */
(function () {
  const K = window.KTX, { esc, ic, im, av, spark, badge, sel } = App;
  const P = App.pages;
  const money = K.money, b2 = K.pad2;
  const CREDIT = '<p class="h-credit">Nguồn ảnh: website Trường Đại học Nghệ An</p>';

  // ---------- dữ liệu sự kiện ----------
  const seedEvents = () => [
    { id: 'EV-01', title: 'Hội chợ chào tân sinh viên 2026', desc: 'Không khí sôi động, rộn ràng tại gian hàng của các câu lạc bộ và khoa.', date: '2026-09-20', cat: 'Văn hóa', place: 'Sân trường Đại học Nghệ An', cover: 'ev_fair', photos: [['ev_fair', 'Gian hàng “Nông Lâm Ngư – Vững chất thép, trọn sắc xanh”'], ['mo_booth', 'Gian hàng sinh viên tại ngày hội'], ['mo_sport', 'Tinh thần thể thao, gắn kết sinh viên']] },
    { id: 'EV-02', title: 'Giải bóng chuyền sinh viên 2026', desc: 'Những trận đấu hấp dẫn, lan tỏa tinh thần thể thao và đoàn kết sinh viên.', date: '2026-10-05', cat: 'Thể thao', place: 'Sân bóng chuyền khu A', cover: 'ev_volley', photos: [['ev_volley', 'Trận chung kết giải bóng chuyền nam'], ['mo_court', 'Giải bóng chuyền – sân chơi năng động'], ['mo_sport', 'Cổ động viên các đội']] },
    { id: 'EV-03', title: 'Lễ khai giảng 2026 – 2027', desc: 'Chào đón tân sinh viên, mở ra hành trình học tập và trưởng thành tại NAU.', date: '2026-09-08', cat: 'Học tập', place: 'Hội trường lớn', cover: 'ev_opening', photos: [['ev_opening', 'Lễ khai giảng năm học 2026 – 2027'], ['community_big', 'Tân sinh viên giao lưu sau lễ khai giảng']] },
  ];
  const seedUpcoming = () => [
    { id: 'UP-01', title: 'Sinh hoạt cộng đồng ký túc xá', date: '2026-10-31', time: '18:00 – 20:30', place: 'Sân sinh hoạt chung tầng 1', cat: 'Văn hóa', desc: 'Giao lưu văn nghệ, trò chơi tập thể, chia sẻ kinh nghiệm học tập và đời sống.', cap: 150 },
    { id: 'UP-02', title: 'Đêm nhạc “Thanh xuân NAU”', date: '2026-11-15', time: '19:00 – 21:30', place: 'Sân trường Đại học Nghệ An', cat: 'Văn hóa', desc: 'Đêm nhạc do các câu lạc bộ sinh viên biểu diễn, chào mừng ngày Nhà giáo Việt Nam.', cap: 400 },
    { id: 'UP-03', title: 'Giải cầu lông ký túc xá mở rộng', date: '2026-11-22', time: '07:30 – 11:30', place: 'Nhà thi đấu đa năng', cat: 'Thể thao', desc: 'Nội dung đơn nam, đơn nữ và đôi nam nữ dành cho sinh viên đang lưu trú.', cap: 64 },
  ];
  const ensure = () => { let ch = false; if (!K.db.events) { K.db.events = seedEvents(); ch = true; } if (!K.db.upcoming) { K.db.upcoming = seedUpcoming(); ch = true; } if (!K.db.eventRegs) { K.db.eventRegs = {}; ch = true; } if (ch) K.save(); };
  ensure();
  const origReset = K.reset; K.reset = () => { origReset(); ensure(); };
  const dmy = (iso) => iso.split('-').reverse().join('/');
  const MOMENTS = [['mo_sport', 'Tinh thần thể thao, gắn kết sinh viên'], ['mo_booth', 'Gian hàng sinh viên tại ngày hội'], ['mo_court', 'Giải bóng chuyền – Sân chơi năng động'], ['h_common', 'Không gian sinh hoạt chung'], ['community_big', 'Sinh hoạt cộng đồng ký túc xá']];

  // ---------- FAQ ----------
  const FAQ = [
    ['Đăng ký ký túc xá như thế nào?', 'Bạn chọn phòng còn chỗ tại mục <b>Phòng ở</b>, tạo tài khoản sinh viên, điền thông tin đăng ký và tải giấy tờ lên. Ban quản lý xét duyệt trong 3 – 5 ngày làm việc và thông báo kết quả trên cổng sinh viên.', 'dang-ky'],
    ['Cần chuẩn bị giấy tờ gì?', 'Giấy xác nhận sinh viên (hoặc giấy báo nhập học), bản sao CCCD, 01 ảnh thẻ 3x4 và đơn đăng ký lưu trú (điền trực tuyến). Sinh viên thuộc diện ưu tiên nộp thêm giấy xác nhận diện chính sách.', 'huong-dan'],
    ['Theo dõi hồ sơ ở đâu?', 'Vào mục <b>Tra cứu hồ sơ</b> và nhập mã sinh viên cùng 4 số cuối điện thoại đã đăng ký. Nếu đã có tài khoản, bạn xem chi tiết tại Cổng sinh viên › Lưu trú › Hồ sơ.', 'tra-cuu'],
    ['Ai được ưu tiên xếp phòng?', 'Tân sinh viên, sinh viên ở xa (trên 50 km), con gia đình chính sách, hộ nghèo – cận nghèo và sinh viên khuyết tật được ưu tiên khi số giường có hạn.'],
    ['Chi phí ở ký túc xá gồm những gì?', 'Tiền phòng theo loại phòng (từ ' + money(Math.min(...K.db.rooms.map((r) => r.price))) + '/tháng), tiền điện nước tính theo chỉ số thực tế chia cho số người trong phòng, và tiền cọc ' + money(500000) + ' hoàn lại khi trả phòng.'],
    ['Thanh toán bằng cách nào?', 'Chuyển khoản qua mã QR, ví điện tử (MoMo, ZaloPay, VNPay) hoặc nộp tiền mặt tại quầy tiếp nhận tầng 1. Hóa đơn được phát hành hằng tháng trên cổng sinh viên.'],
    ['Khách đến thăm có được ở lại không?', 'Khách được thăm trong khung 7:00 – 22:00 và đăng ký tại quầy bảo vệ. Không được ở lại qua đêm khi chưa được Ban quản lý cho phép.'],
    ['Có thể chuyển phòng hoặc gia hạn không?', 'Có. Sinh viên gửi yêu cầu chuyển phòng hoặc gia hạn trên cổng sinh viên. Ban quản lý xét duyệt và hẹn lịch bàn giao nếu được chấp thuận.'],
  ];
  App.guestFAQ = FAQ;
  const faqList = (list, open) => `<div class="hfaq">${list.map(([q, a, go], i) => `<details ${i === open ? 'open' : ''}><summary>${q}<span class="hfaq-ic">${ic('plus')}</span></summary><p>${a}${go ? ` <a href="#" class="link link-red" data-go="${go}">${{ 'dang-ky': 'Tạo tài khoản', 'huong-dan': 'Xem hướng dẫn', 'tra-cuu': 'Tra cứu ngay' }[go]} ${ic('arrow-right')}</a>` : ''}</p></details>`).join('')}</div>`;

  // ---------- đầu trang ----------
  const NAV = [['trang-chu', 'Trang chủ'], ['phong-o', 'Phòng ở'], ['tien-ich', 'Tiện ích'], ['su-kien', 'Sự kiện'], ['huong-dan', 'Hướng dẫn']];
  App.pubHeader = (active) => {
    const s = K.db.session;
    const acts = s ? `<a href="#" class="btn btn-outline" data-go="${s.role === 'admin' ? 'ql-tong-quan' : 'sv-tong-quan'}">${s.role === 'admin' ? 'Trang quản lý' : 'Cổng sinh viên'}</a><button class="btn btn-red" data-logout>Đăng xuất</button>` : `<a href="#" class="btn btn-outline" data-go="dang-nhap">Đăng nhập</a><a href="#" class="btn btn-red" data-go="dang-ky">Đăng ký lưu trú</a>`;
    const act = active === 'phong-detail' ? 'phong-o' : active;
    return `<header class="pub-h">${App.brand(false)}<nav class="pub-nav">${NAV.map(([k, t]) => `<a href="#" class="${k === act ? 'on' : ''}" data-go="${k}">${t}</a>`).join('')}</nav><div class="pub-act">${acts}</div><button class="burger" aria-label="Mở menu">${ic('menu')}</button></header>`;
  };
  App.bindPubNav = (root) => root.querySelectorAll('[data-nav]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const k = a.dataset.nav; const map = { 'gioi-thieu': 'trang-chu', 'lien-he': 'huong-dan', 'tien-ich': 'tien-ich', 'huong-dan': 'huong-dan' }; App.go(map[k] || 'trang-chu'); }));
  const goAnchor = (route, id) => { App.go(route); setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60); };
  App.goAnchor = goAnchor;
  const bindAnchors = (root) => root.querySelectorAll('[data-anchor]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const [r, id] = a.dataset.anchor.split('#'); goAnchor(r, id); }));

  // ---------- chân trang ----------
  App.pubFooter = () => { const g = K.db.general; return `<footer class="nfoot"><div class="nfoot-in">
      <div class="nf-brand"><a href="#" class="brand" data-go="trang-chu"><span class="nf-logo"><img src="${K.A('logo')}" alt=""></span><span><b>ĐẠI HỌC NGHỆ AN</b><small>KÝ TÚC XÁ SINH VIÊN</small></span></a><p>Nơi ở an toàn, tiện nghi cho ${K.db.rooms.reduce((s, r) => s + r.beds, 0)} sinh viên trong tòa nhà ${K.khus().length} tầng. Ban quản lý trực 24/7 và hỗ trợ sinh viên trong suốt năm học.</p>
        <div class="nf-badges"><span>${ic('shield-check')}An ninh 24/7</span><span>${ic('wifi')}Wi-Fi miễn phí</span><span>${ic('leaf')}Môi trường xanh</span></div></div>
      <div><h4>Ký túc xá</h4><a href="#" data-go="trang-chu">Giới thiệu</a><a href="#" data-go="phong-o">Phòng ở &amp; giá</a><a href="#" data-go="tien-ich">Tiện ích</a><a href="#" data-go="su-kien">Sự kiện</a><a href="#" data-anchor="trang-chu#sec-huong-dan">Hướng dẫn đăng ký</a><a href="#" data-anchor="huong-dan#hd-faq">Câu hỏi thường gặp</a></div>
      <div><h4>Sinh viên</h4><a href="#" data-go="dang-ky">Tạo tài khoản</a><a href="#" data-go="dang-nhap">Đăng nhập cổng sinh viên</a><a href="#" data-go="quen-mat-khau">Quên mật khẩu</a><a href="#" data-go="tra-cuu">Tra cứu hồ sơ</a><a href="#" data-go="sv-hoa-don">Thanh toán</a><a href="#" data-go="sv-sua-chua">Yêu cầu sửa chữa</a><a href="#" data-go="so-do">Danh sách 35 màn hình</a></div>
      <div class="nf-contact"><h4>Liên hệ</h4><p>${ic('phone')}<a href="tel:${esc(g.hotline).replace(/\s/g, '')}">${esc(g.hotline)}</a></p><p>${ic('mail')}<a href="mailto:${esc(g.email)}">${esc(g.email)}</a></p><p>${ic('map-pin')}${esc(g.address)}</p><p>${ic('clock')}7:30 – 17:00, Thứ Hai – Thứ Bảy</p>
        <div class="nf-social"><button type="button" data-soc="Facebook" aria-label="Facebook">${ic('facebook')}</button><button type="button" data-soc="YouTube" aria-label="YouTube">${ic('youtube')}</button><button type="button" data-soc="TikTok" aria-label="TikTok"><svg viewBox="0 0 24 24" class="lc" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.6 2.2 4.2 5 4.5"/></svg></button><a href="https://nau.edu.vn" target="_blank" rel="noopener" class="nf-site">nau.edu.vn</a></div></div>
      <img class="nf-art" src="${K.A('h_foot')}" alt=""></div>
    <div class="nfoot-bot"><span>© 2026 Ký túc xá Đại học Nghệ An</span><span class="sep">|</span><a href="#" data-policy="privacy">Chính sách quyền riêng tư</a><span class="sep">|</span><a href="#" data-policy="terms">Điều khoản sử dụng</a><span class="sep">|</span><span class="nf-motto">Học tập · Sống đẹp · Cùng nhau</span></div></footer>`; };
  const POLICY = {
    privacy: ['Chính sách quyền riêng tư', ['Hệ thống chỉ thu thập thông tin cần thiết cho việc quản lý lưu trú: họ tên, mã sinh viên, số điện thoại, email, người liên hệ khẩn cấp và giấy tờ đăng ký.', 'Số điện thoại và thông tin liên hệ được che một phần khi hiển thị; chỉ cán bộ quản lý được phân quyền mới xem đầy đủ.', 'Dữ liệu không được chia sẻ cho bên thứ ba ngoài Nhà trường, trừ khi pháp luật yêu cầu.', 'Sinh viên có thể đề nghị chỉnh sửa thông tin cá nhân tại mục Tài khoản trên cổng sinh viên.']],
    terms: ['Điều khoản sử dụng', ['Tài khoản sinh viên chỉ dùng cho chính chủ; sinh viên chịu trách nhiệm bảo mật mật khẩu.', 'Thông tin khai báo khi đăng ký lưu trú phải chính xác; hồ sơ khai sai có thể bị từ chối hoặc chấm dứt lưu trú.', 'Các khoản phí phát hành trên hệ thống có giá trị như thông báo chính thức của Ban quản lý ký túc xá.', 'Sinh viên tuân thủ nội quy ký túc xá được công bố tại mục Hướng dẫn và Cổng sinh viên.']],
  };
  const bindFooter = (root) => {
    root.querySelectorAll('[data-soc]').forEach((b) => b.onclick = () => App.toast('Kênh ' + b.dataset.soc + ' chính thức của ký túc xá sẽ được cập nhật. Hiện bạn có thể xem tin tại nau.edu.vn'));
    root.querySelectorAll('[data-policy]').forEach((a) => a.onclick = (e) => { e.preventDefault(); const [t, l] = POLICY[a.dataset.policy]; App.modal({ title: t, body: `<ol style="padding-left:20px;line-height:1.8;color:var(--ink);margin:0">${l.map((x) => `<li>${x}</li>`).join('')}</ol>`, foot: '<button class="btn btn-red" data-x>Đã hiểu</button>' }); });
    bindAnchors(root);
  };

  // ---------- album ảnh ----------
  App.lightbox = (photos, start) => {
    let i = start || 0;
    App.modal({ title: '', wide: true, body: `<div class="lb"><img id="lb-img" alt=""><button class="lb-nav prev" aria-label="Ảnh trước">${ic('chevron-left')}</button><button class="lb-nav next" aria-label="Ảnh sau">${ic('chevron-right')}</button></div><div class="lb-cap"><b id="lb-cap"></b><small id="lb-n"></small></div><div class="lb-thumbs">${photos.map(([p], k) => `<img src="${K.A(p)}" data-k="${k}" alt="">`).join('')}</div><p class="h-credit" style="text-align:left">Nguồn ảnh: website Trường Đại học Nghệ An</p>`,
      onMount: (el) => {
        el.querySelector('.modal').classList.add('lb-modal');
        const show = () => { el.querySelector('#lb-img').src = K.A(photos[i][0]); el.querySelector('#lb-cap').textContent = photos[i][1]; el.querySelector('#lb-n').textContent = (i + 1) + ' / ' + photos.length; el.querySelectorAll('.lb-thumbs img').forEach((t, k) => t.classList.toggle('on', k === i)); };
        const mv = (d) => { i = (i + d + photos.length) % photos.length; show(); };
        el.querySelector('.prev').onclick = () => mv(-1); el.querySelector('.next').onclick = () => mv(1);
        el.querySelectorAll('.lb-thumbs img').forEach((t) => t.onclick = () => { i = +t.dataset.k; show(); });
        const key = (e) => { if (!document.body.contains(el)) return document.removeEventListener('keydown', key); if (e.key === 'ArrowLeft') mv(-1); if (e.key === 'ArrowRight') mv(1); };
        document.addEventListener('keydown', key); show();
      } });
  };

  // ---------- tiêu đề mục ----------
  const head = (num, title, sub, link, extra) => `<div class="hs-head">${num ? `<span class="hs-num ${num === 'cam' || num === 'q' ? 'ic' : ''}">${num === 'cam' ? ic('camera') : num === 'q' ? '?' : num}</span>` : ''}<div><h2>${title}</h2><p>${sub}</p></div>${link ? `<a href="#" class="hs-link" ${link[1].includes('#') ? `data-anchor="${link[1]}"` : `data-go="${link[1]}"`}>${link[0]} ${ic('arrow-right')}</a>` : ''}${extra || ''}</div>`;
  const typeInfo = (b) => { const rs = K.db.rooms.filter((r) => r.beds === b && !r.maint); return { free: rs.reduce((s, r) => s + K.freeBeds(r.code), 0), price: rs.length ? Math.min(...rs.map((r) => r.price)) : 0 }; };

  // ============ Trang chủ ============
  P['trang-chu'] = {
    title: 'Trang chủ',
    render: () => {
      const t4 = typeInfo(4), t6 = typeInfo(6);
      const evs = K.db.events.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
      const order = ['EV-01', 'EV-02', 'EV-03']; evs.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
      return `${App.pubHeader('trang-chu')}
      <section class="hero motion-hero"><canvas class="hero-particles" aria-hidden="true"></canvas><div class="hero-art"><img src="${K.A('hero')}" alt="Minh họa động tòa nhà ký túc xá giữa các quỹ đạo ánh sáng" fetchpriority="high" width="1200" height="760"><span class="hero-art-caption"><i></i> KHÔNG GIAN SỐNG · NGUỒN CẢM HỨNG</span></div><div class="hero-in">
        <div class="hero-eyebrow"><span></span> ĐẠI HỌC NGHỆ AN <i>✦</i> KÝ TÚC XÁ SINH VIÊN</div>
        <h1>Khởi đầu hành trình,<br>từ một <em>nơi ở tốt.</em></h1><h2>Ký túc xá Đại học Nghệ An</h2>
        <p>Không chỉ là nơi ở, mà là không gian học tập, kết nối và trưởng thành cùng những người bạn đồng hành.</p>
        <div class="hero-cta"><a href="#" class="btn btn-red" data-go="phong-o">Khám phá phòng ở ${ic('arrow-right')}</a><a href="#" class="btn btn-outline" data-go="dang-nhap">${ic('user-round')}Cổng sinh viên</a></div><div class="hero-trust"><span>${ic('shield-check')}An ninh 24/7</span><span>${ic('wifi')}Wi-Fi miễn phí</span><span>${ic('leaf')}Môi trường xanh</span></div></div><a class="hero-scroll" href="#" data-anchor="trang-chu#sec-phong-o">CUỘN ĐỂ KHÁM PHÁ <span>↓</span></a></section>
      <section class="steps-band">
        <div class="stepc"><img src="${K.A('step1')}" alt=""><div><h3><span class="num-c">1</span>Chọn phòng</h3><p>Xem thông tin các tầng ký túc xá, phòng ở và tiện ích đi kèm.</p></div></div>${ic('chevron-right')}
        <div class="stepc"><img src="${K.A('step2')}" alt=""><div><h3><span class="num-c">2</span>Đăng ký lưu trú</h3><p>Điền thông tin và gửi hồ sơ trực tuyến nhanh chóng.</p></div></div>${ic('chevron-right')}
        <div class="stepc"><img src="${K.A('step3')}" alt="" style="width:194px"><div><h3><span class="num-c">3</span>Nhận phòng</h3><p>Hoàn tất thủ tục và bắt đầu hành trình học tập tại KTX.</p></div></div></section>
      <div class="home-flow">
        <section class="hs" id="sec-phong-o">${head('01', 'Chọn một nơi ở phù hợp', 'Không gian tiện nghi, an toàn, thân thiện cho hành trình đại học của bạn.', ['Xem tất cả phòng ở', 'phong-o'])}
          <div class="hcards">${[['h_room4', 'Phòng 4 người', 'Không gian rộng rãi, thoáng mát dành cho nhóm bạn thân.', 'users', 'cap4', t4], ['h_room6', 'Phòng 6 người', 'Phù hợp với sinh viên yêu thích sự sẻ chia và kết nối.', 'house', 'cap6', t6], ['h_common', 'Không gian sinh hoạt', 'Phòng sinh hoạt chung, khu tự học, thư viện mini và nhiều tiện ích khác.', 'sofa', 'tien-ich', null]].map(([img, t, d, i, go, info]) => `<article class="hcard"><img src="${K.A(img)}" alt="${t}"><div class="hcard-b"><h3>${t}</h3><p>${ic(i)}<span>${d}</span></p>${info ? `<div class="hcard-meta"><span>${info.free ? 'Còn ' + info.free + ' giường' : 'Tạm hết giường'}</span><span>Từ ${money(info.price)}/tháng</span></div>` : '<div class="hcard-meta"><span>Mở cửa 6:00 – 23:00</span><span>Miễn phí</span></div>'}<a href="#" class="hs-link" data-room="${go}">Xem chi tiết ${ic('arrow-right')}</a></div></article>`).join('')}</div></section>
        <section class="hs hs-ready">${head('02', 'Sẵn sàng ngày nhập học', 'Đăng ký lưu trú trực tuyến và chuẩn bị hành trang thật dễ dàng.')}
          <div class="ready"><div class="rtiles">${[['file-search', 'Tra cứu hồ sơ', 'Xem trạng thái đăng ký của bạn.', 'tra-cuu'], ['credit-card', 'Thanh toán', 'Thanh toán phí lưu trú trực tuyến.', 'sv-hoa-don'], ['wrench', 'Yêu cầu sửa chữa', 'Gửi yêu cầu hỗ trợ khi cần thiết.', 'sv-sua-chua'], ['book-open-check', 'Hướng dẫn', 'Xem hướng dẫn từng bước chi tiết.', 'huong-dan']].map(([i, t, d, g]) => `<a href="#" class="rtile" data-go="${g}"><span class="rt-ic">${ic(i)}</span><b>${t}</b><small>${d}</small></a>`).join('')}</div>
            <div class="ready-art"><img src="${K.A('h_ready')}" alt=""><div class="rcheck">${['Hoàn thiện hồ sơ', 'Chuẩn bị giấy tờ', 'Thanh toán phí', 'Sẵn sàng nhập học'].map((t) => `<span>${ic('check')}${t}</span>`).join('')}</div></div></div></section>
        <section class="hs">${head('03', 'Viết tiếp thanh xuân tại NAU', 'Cùng nhau tạo nên những kỷ niệm đáng nhớ trong quãng đời sinh viên.', ['Xem tất cả sự kiện', 'su-kien'])}
          <div class="hcards ev">${evs.map((e) => `<article class="hcard"><button class="hcard-ph" data-album="${e.id}" aria-label="Xem album ${esc(e.title)}"><img src="${K.A(e.cover)}" alt=""></button><div class="hcard-b"><h3>${esc(e.title)}</h3><p class="plain">${esc(e.desc)}</p><a href="#" class="hs-link" data-album="${e.id}">Xem album ${ic('arrow-right')}</a></div></article>`).join('')}</div>${CREDIT}</section>
        <section class="hs hs-life"><div class="life-txt">${head('', 'Học tập, nghỉ ngơi và kết nối', 'Nhiều tiện ích đồng hành cùng cuộc sống sinh viên năng động.')}
          <div class="life-ic">${[['book-open', 'Không gian học tập', 'Phòng học chung, thư viện mini, không gian yên tĩnh.'], ['users', 'Kết nối bạn bè', 'Giao lưu, sinh hoạt câu lạc bộ, tham gia hoạt động văn hóa.'], ['trophy', 'Thể thao', 'Sân bóng, sân thể thao, nâng cao sức khỏe.'], ['heart', 'Hỗ trợ sinh viên', 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp và đồng hành.']].map(([i, t, d]) => `<a href="#" data-go="tien-ich"><span>${ic(i)}</span><b>${t}</b><small>${d}</small></a>`).join('')}</div></div><img class="life-art" src="${K.A('h_guitar')}" alt="Sinh viên ca hát cùng nhau"></section>
        <section class="hs">${head('cam', 'Khoảnh khắc sinh viên', 'Những nụ cười, hoạt động và kỷ niệm đẹp tại Ký túc xá Đại học Nghệ An.', ['Xem thêm hoạt động', 'su-kien#sk-moments'])}
          <div class="hcards mo">${MOMENTS.slice(0, 3).map(([p, t], k) => `<button class="momcard" data-moment="${k}"><img src="${K.A(p)}" alt=""><span>${t}</span><i>${ic('chevron-right')}</i></button>`).join('')}</div>${CREDIT}</section>
      </div>
      ${App.homeGuide()}
      ${App.homeContact()}
      <section class="hcta"><img src="${K.A('h_cta')}" alt=""><div class="hcta-in"><h2>Sẵn sàng cho hành trình mới?</h2><p>Một nơi ở tốt là khởi đầu cho những trải nghiệm tuyệt vời tại Đại học Nghệ An.<br>Hãy đăng ký lưu trú ngay hôm nay!</p><a href="#" class="btn btn-red" data-go="${K.db.session && K.db.session.role === 'student' ? 'sv-dang-ky-luu-tru' : 'dang-ky'}">Đăng ký lưu trú ${ic('arrow-right')}</a></div></section>
      ${App.pubFooter()}`;
    },
    mount: (root) => {
      root.querySelectorAll('[data-room]').forEach((a) => a.onclick = (e) => { e.preventDefault(); const g = a.dataset.room; if (g === 'tien-ich') return App.go('tien-ich'); App.st.rooms = { khu: '', cap: g === 'cap4' ? 4 : 6, avail: true, desk: false, balcony: false, q: '', sort: 'free', page: 1 }; App.go('phong-o'); });
      root.querySelectorAll('[data-album]').forEach((a) => a.onclick = (e) => { e.preventDefault(); const ev = K.db.events.find((x) => x.id === a.dataset.album); App.lightbox(ev.photos, 0); });
      root.querySelectorAll('[data-moment]').forEach((b) => b.onclick = () => App.lightbox(MOMENTS, +b.dataset.moment));
      App.bindHomeContact(root);
      bindFooter(root);
    },
  };

  // khung trang khách có tiêu đề
  const page = (active, art, crumb, title, desc, body) => `${App.pubHeader(active)}<section class="pbanner"><img class="art" src="${K.A(art)}" alt=""><div class="pbanner-in">${App.crumb([['Trang chủ', 'trang-chu'], crumb])}<h1>${title}${spark}</h1><p>${desc}</p></div></section><div class="gpage">${body}</div>${App.pubFooter()}`;

  // ============ Tiện ích ============
  const AMEN = [['wifi', 'Wi-Fi tốc độ cao', 'Phủ sóng toàn bộ phòng ở và khu sinh hoạt chung.', 'blue'], ['book-open', 'Phòng tự học', 'Mở cửa 6:00 – 23:00, yên tĩnh, đủ ánh sáng.', 'red'], ['shirt', 'Giặt sấy', 'Máy giặt, máy sấy tự phục vụ tại mỗi tầng.', 'green'], ['utensils', 'Nhà ăn – căng tin', 'Suất ăn sinh viên giá hợp lý, mở cả ngày.', 'amber'], ['shield-check', 'An ninh 24/7', 'Bảo vệ trực, camera và thẻ ra vào.', 'blue'], ['dumbbell', 'Sân thể thao', 'Sân bóng chuyền, cầu lông và phòng gym mini.', 'red'], ['zap', 'Điện nước ổn định', 'Ghi chỉ số minh bạch, tính đúng theo sử dụng.', 'green'], ['heart-pulse', 'Y tế', 'Phòng y tế cơ bản, liên kết trạm y tế phường.', 'amber']];
  P['tien-ich'] = {
    title: 'Tiện ích',
    render: () => page('tien-ich', 'bn_dien', 'Tiện ích', 'Học tập, nghỉ ngơi và kết nối', 'Mọi thứ bạn cần cho một năm học trọn vẹn đều có trong khuôn viên ký túc xá.', `
      <section class="hs">${head('', 'Không gian chung', 'Những nơi bạn sẽ học tập, gặp gỡ và thư giãn mỗi ngày.')}
        <div class="spaces">${[['h_common', 'Phòng sinh hoạt chung', 'Sofa, bàn nhóm, TV và góc đọc sách. Đặt chỗ cho hoạt động câu lạc bộ tại quầy tầng 1.', 'Tầng 1 · 6:00 – 23:00'], ['study', 'Thư viện mini & phòng tự học', 'Hơn 2.000 đầu sách, bàn học riêng có đèn và ổ cắm, giữ yên lặng tuyệt đối.', 'Tầng 2 · 6:00 – 23:00'], ['h_room6', 'Phòng ở tiêu chuẩn', 'Mỗi giường có bàn học, tủ cá nhân có khóa; phòng có khu vệ sinh riêng.', 'Tầng 1 – 4'], ['community_big', 'Sân sinh hoạt ngoài trời', 'Nơi tổ chức sinh hoạt cộng đồng, văn nghệ và các giải thể thao.', 'Trước tòa nhà']].map(([img, t, d, m]) => `<article class="space"><img src="${K.A(img)}" alt="${t}"><div><span class="badge b-blue b-sm">${m}</span><h3>${t}</h3><p>${d}</p></div></article>`).join('')}</div></section>
      <section class="hs">${head('', 'Tiện ích đi kèm', 'Đã bao gồm trong tiền phòng, trừ điện nước và giặt sấy tính theo sử dụng.')}<div class="amen-grid">${AMEN.map(([i, t, d, c]) => `<div class="amen-card"><span class="amen-ic ${c}">${ic(i)}</span><b>${t}</b><p>${d}</p></div>`).join('')}</div></section>
      <section class="hs two-col"><div class="card pad"><h3 class="card-t" style="font-size:20px">${ic('clock')}Giờ hoạt động</h3><div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><tbody>${[['Cổng ký túc xá', '5:00 – 23:00'], ['Quầy tiếp nhận', '7:30 – 17:00 (Thứ Hai – Thứ Bảy)'], ['Phòng tự học, thư viện', '6:00 – 23:00'], ['Khu giặt sấy', '6:00 – 22:00'], ['Khách đến thăm', '7:00 – 22:00'], ['Bảo vệ, y tế khẩn cấp', '24/7']].map(([a, b]) => `<tr><td>${a}</td><td class="r"><b>${b}</b></td></tr>`).join('')}</tbody></table></div></div>
        <div class="card pad"><h3 class="card-t" style="font-size:20px">${ic('book-open-check')}Nội quy chính</h3><ol class="rules-ol">${App.RULES.map((r) => `<li>${r}</li>`).join('')}</ol><a href="#" class="btn btn-outline" data-go="huong-dan">${ic('book-open')}Xem hướng dẫn đầy đủ</a></div></section>`),
    mount: (root) => bindFooter(root),
  };

  // ============ Sự kiện ============
  P['su-kien'] = {
    title: 'Sự kiện',
    render: () => {
      const st = App.state('sk', { cat: '' });
      const me = K.me();
      const cats = ['', 'Văn hóa', 'Thể thao', 'Học tập'];
      const evs = K.db.events.filter((e) => !st.cat || e.cat === st.cat).sort((a, b) => b.date.localeCompare(a.date));
      const ups = K.db.upcoming.filter((e) => !st.cat || e.cat === st.cat).sort((a, b) => a.date.localeCompare(b.date));
      return page('su-kien', 'bn_tamvang', 'Sự kiện', 'Viết tiếp thanh xuân tại NAU', 'Sự kiện, hoạt động và những khoảnh khắc đáng nhớ của sinh viên ký túc xá.', `
        <div class="seg sk-cats">${cats.map((c) => `<button class="pill ${st.cat === c ? 'on' : ''}" data-cat="${c}">${c || 'Tất cả'}</button>`).join('')}</div>
        <section class="hs">${head('', 'Sắp diễn ra', 'Đăng ký tham gia để nhận nhắc lịch trên cổng sinh viên.')}
          <div class="ups">${ups.map((e) => { const regs = K.db.eventRegs[e.id] || []; const joined = me && regs.includes(me.id); const [y, m, d] = e.date.split('-'); return `<article class="up"><div class="up-date"><b>${d}</b><small>Tháng ${+m}</small><small>${y}</small></div><div class="up-b"><span class="badge b-blue b-sm">${e.cat}</span><h3>${esc(e.title)}</h3><p>${esc(e.desc)}</p><div class="up-meta"><span>${ic('clock')}${e.time}</span><span>${ic('map-pin')}${esc(e.place)}</span><span>${ic('users')}${regs.length}/${e.cap} đăng ký</span></div></div><button class="btn ${joined ? 'btn-outline' : 'btn-red'}" data-join="${e.id}">${joined ? ic('check') + 'Đã đăng ký' : 'Đăng ký tham gia'}</button></article>`; }).join('') || '<p class="muted">Không có sự kiện sắp diễn ra.</p>'}</div></section>
        <section class="hs">${head('', 'Album sự kiện', 'Bấm vào ảnh để xem toàn bộ album.')}<div class="hcards ev">${evs.map((e) => `<article class="hcard"><button class="hcard-ph" data-album="${e.id}" aria-label="Xem album"><img src="${K.A(e.cover)}" alt=""><span class="ph-count">${ic('images')}${e.photos.length} ảnh</span></button><div class="hcard-b"><div class="row small muted" style="gap:8px">${ic('calendar-days')}${dmy(e.date)} · ${esc(e.place)}</div><h3>${esc(e.title)}</h3><p class="plain">${esc(e.desc)}</p><a href="#" class="hs-link" data-album="${e.id}">Xem album ${ic('arrow-right')}</a></div></article>`).join('') || '<p class="muted">Chưa có album trong mục này.</p>'}</div>${CREDIT}</section>
        <section class="hs" id="sk-moments">${head('cam', 'Khoảnh khắc sinh viên', 'Những nụ cười, hoạt động và kỷ niệm đẹp tại Ký túc xá Đại học Nghệ An.')}<div class="moments">${MOMENTS.map(([p, t], k) => `<button class="momcard" data-moment="${k}"><img src="${K.A(p)}" alt=""><span>${t}</span><i>${ic('chevron-right')}</i></button>`).join('')}</div>${CREDIT}</section>`);
    },
    mount: (root) => {
      const st = App.st.sk;
      root.querySelectorAll('[data-cat]').forEach((b) => b.onclick = () => { st.cat = b.dataset.cat; App.refresh(); });
      root.querySelectorAll('[data-album]').forEach((a) => a.onclick = (e) => { e.preventDefault(); App.lightbox(K.db.events.find((x) => x.id === a.dataset.album).photos, 0); });
      root.querySelectorAll('[data-moment]').forEach((b) => b.onclick = () => App.lightbox(MOMENTS, +b.dataset.moment));
      root.querySelectorAll('[data-join]').forEach((b) => b.onclick = () => {
        const s = K.db.session; const ev = K.db.upcoming.find((x) => x.id === b.dataset.join);
        if (!s || s.role !== 'student') { App.pendingRoute = null; App.st.login = { role: 'student', msg: 'Đăng nhập tài khoản sinh viên để đăng ký tham gia “' + ev.title + '”.' }; return App.go('dang-nhap'); }
        const regs = (K.db.eventRegs[ev.id] = K.db.eventRegs[ev.id] || []);
        if (regs.includes(s.id)) { K.db.eventRegs[ev.id] = regs.filter((x) => x !== s.id); App.toast('Đã hủy đăng ký “' + ev.title + '”'); }
        else { if (regs.length >= ev.cap) return App.toast('Sự kiện đã đủ số lượng đăng ký', 'err'); regs.push(s.id); K.db.notifications.unshift({ id: 'N' + Date.now(), to: s.id, title: 'Đã đăng ký: ' + ev.title, summary: dmy(ev.date) + ' · ' + ev.time + ' · ' + ev.place, cat: 'Hoạt động', icon: 'ni_megaphone', time: 'Vừa xong', author: 'Ban quản lý ký túc xá', month: 'Tháng 10/2026', read: false, body: ['Bạn đã đăng ký tham gia “' + ev.title + '”.', 'Thời gian: ' + dmy(ev.date) + ', ' + ev.time + '. Địa điểm: ' + ev.place + '.'] }); App.toast('Đã đăng ký tham gia. Lịch được gửi vào mục Thông báo của bạn.'); }
        K.save(); App.refresh();
      });
      bindFooter(root);
    },
  };

  // ============ Hướng dẫn ============
  P['huong-dan'] = {
    title: 'Hướng dẫn',
    render: () => {
      const types = [2, 4, 6, 8].map((b) => { const rs = K.db.rooms.filter((r) => r.beds === b && !r.maint); return rs.length ? { b, n: rs.length, price: Math.min(...rs.map((r) => r.price)), free: rs.reduce((s, r) => s + K.freeBeds(r.code), 0) } : null; }).filter(Boolean);
      return page('huong-dan', 'bn_vipham', 'Hướng dẫn', 'Hướng dẫn đăng ký lưu trú', 'Các bước, giấy tờ, chi phí và câu trả lời cho những thắc mắc thường gặp.', `
        <section class="hs">${head('01', 'Quy trình đăng ký', 'Từ lúc chọn phòng đến ngày nhận chìa khóa.')}
          <div class="hd-steps">${[['search', 'Chọn phòng', 'Xem phòng còn chỗ, chọn giường trống phù hợp.', 'phong-o', 'Tìm phòng'], ['user-plus', 'Tạo tài khoản', 'Đăng ký tài khoản sinh viên bằng mã sinh viên và email.', 'dang-ky', 'Tạo tài khoản'], ['file-pen-line', 'Gửi hồ sơ', 'Điền thông tin, tải giấy tờ và gửi hồ sơ trực tuyến.', 'sv-dang-ky-luu-tru', 'Đăng ký lưu trú'], ['badge-check', 'Nhận kết quả', 'Ban quản lý duyệt trong 3 – 5 ngày làm việc.', 'tra-cuu', 'Tra cứu hồ sơ'], ['key-round', 'Nhận phòng', 'Xác nhận thỏa thuận, đóng phí và nhận chìa khóa.', '', '']].map(([i, t, d, g, l], k) => `<div class="hd-step"><span class="hd-n">${k + 1}</span><span class="amen-ic blue">${ic(i)}</span><b>${t}</b><p>${d}</p>${g ? `<a href="#" class="hs-link" data-go="${g}">${l} ${ic('arrow-right')}</a>` : ''}</div>`).join('')}</div></section>
        <section class="hs two-col"><div class="card pad"><h3 class="card-t" style="font-size:20px">${ic('folder-check')}Giấy tờ cần chuẩn bị</h3><ul class="doc-list">${[['Giấy xác nhận sinh viên', 'Hoặc giấy báo nhập học với tân sinh viên.'], ['Bản sao CCCD', 'Chụp rõ hai mặt.'], ['Ảnh thẻ 3x4', 'Ảnh chụp trong 6 tháng gần nhất.'], ['Đơn đăng ký lưu trú', 'Điền trực tuyến khi gửi hồ sơ.'], ['Giấy xác nhận diện ưu tiên', 'Nếu thuộc diện chính sách, hộ nghèo, cận nghèo.']].map(([t, d]) => `<li>${ic('circle-check')}<span><b>${t}</b><small>${d}</small></span></li>`).join('')}</ul></div>
          <div class="card pad"><h3 class="card-t" style="font-size:20px">${ic('receipt-text')}Bảng giá năm học 2026 – 2027</h3><div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><thead><tr><th>Loại phòng</th><th class="c">Giường trống</th><th class="r">Giá / tháng</th></tr></thead><tbody>${types.map((t) => `<tr><td>Phòng ${t.b} người</td><td class="c num">${t.free || '<span class="muted">Hết</span>'}</td><td class="r num"><b style="color:var(--red)">${money(t.price)}</b></td></tr>`).join('')}<tr><td>Tiền cọc (hoàn lại khi trả phòng)</td><td></td><td class="r num"><b>${money(500000)}</b></td></tr></tbody></table></div><p class="muted small" style="margin-top:10px">Điện ${money(K.db.prices.e)}/kWh, nước ${money(K.db.prices.w)}/m³, chia theo số người trong phòng (bình quân 50.000đ/người/tháng).</p></div></section>
        <section class="hs" id="hd-faq">${head('q', 'Câu hỏi thường gặp', 'Không tìm thấy câu trả lời? Gửi câu hỏi cho Ban quản lý ở cuối trang.')}${faqList(FAQ, 0)}</section>
        <section class="hs two-col" id="hd-contact"><div><h3 class="card-t" style="font-size:22px">${ic('headphones')}Cần tư vấn thêm?</h3><p class="muted" style="margin:8px 0 16px;line-height:1.6">Ban quản lý phản hồi trong giờ hành chính. Trường hợp khẩn cấp ngoài giờ, gọi hotline trực 24/7.</p><div class="contact-list">${[['phone', 'Hotline', K.db.general.hotline], ['mail', 'Email', K.db.general.email], ['map-pin', 'Địa chỉ', K.db.general.address], ['clock', 'Giờ làm việc', '7:30 – 17:00, Thứ Hai – Thứ Bảy']].map(([i, t, v]) => `<div><span class="amen-ic blue">${ic(i)}</span><span><small>${t}</small><b>${esc(v)}</b></span></div>`).join('')}</div></div>
          <form class="card pad" id="hc-form" novalidate><h3 style="font-size:20px">Gửi câu hỏi</h3><div class="grid g2" style="gap:14px;margin-top:14px"><div class="field"><label for="hc-name">Họ và tên <span class="req">*</span></label><input id="hc-name" class="input" autocomplete="name"></div><div class="field"><label for="hc-contact">Email hoặc số điện thoại <span class="req">*</span></label><input id="hc-contact" class="input"></div></div><div class="field" style="margin-top:14px"><label for="hc-topic">Chủ đề</label>${sel('hc-topic', ['Tư vấn chọn phòng', 'Thủ tục đăng ký', 'Chi phí, thanh toán', 'Khác'], 'Tư vấn chọn phòng')}</div><div class="field" style="margin-top:14px"><label for="hc-msg">Nội dung <span class="req">*</span></label><textarea id="hc-msg" class="textarea"></textarea></div><p class="err" id="hc-err" hidden style="margin-top:8px"></p><button class="btn btn-red btn-block" style="margin-top:16px">${ic('send')}Gửi câu hỏi</button></form></section>`);
    },
    mount: (root) => {
      const f = root.querySelector('#hc-form');
      f.onsubmit = (e) => {
        e.preventDefault(); const v = (id) => f.querySelector(id).value.trim(); const err = f.querySelector('#hc-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        if (!v('#hc-name')) return fail('Vui lòng nhập họ và tên.');
        if (!/^\S+@\S+\.\S+$/.test(v('#hc-contact')) && !/^0\d{9}$/.test(v('#hc-contact').replace(/\s/g, ''))) return fail('Nhập email hợp lệ hoặc số điện thoại 10 chữ số.');
        if (v('#hc-msg').length < 10) return fail('Nội dung cần tối thiểu 10 ký tự.');
        K.db.contacts.unshift({ id: 'LH-' + Date.now(), name: v('#hc-name'), contact: v('#hc-contact'), topic: v('#hc-topic'), msg: v('#hc-msg'), at: K.now(), done: false });
        K.save(); f.reset(); err.hidden = true; App.toast('Đã gửi câu hỏi. Ban quản lý sẽ liên hệ lại với bạn sớm.');
      };
      bindFooter(root);
    },
  };

  // ============ Tra cứu hồ sơ ============
  const APP_ST = { 'cho-duyet': ['Chờ duyệt', 'orange'], 'can-bo-sung': ['Cần bổ sung', 'blue'], 'da-duyet': ['Đã duyệt', 'green'], 'tu-choi': ['Từ chối', 'red'] };
  P['tra-cuu'] = {
    title: 'Tra cứu hồ sơ',
    render: () => {
      const st = App.state('tc', { id: '', phone: '', found: null });
      let result = '';
      if (st.found) {
        const s = K.student(st.found); const apps = K.db.applications.filter((a) => a.student === s.id).slice().reverse();
        const tr = (K.db.transfers || []).filter((t) => t.student === s.id).slice(-1)[0];
        result = `<div class="card pad tc-res"><div class="row" style="gap:14px;flex-wrap:wrap">${av(s.avatar, 56)}<span style="flex:1"><b style="font-size:20px;color:var(--navy);display:block">${esc(s.name)}</b><small class="muted">${s.id}${s.faculty ? ' · Khoa ' + esc(s.faculty) : ''}</small></span>${s.room ? `<span class="badge b-green pill-lg">${ic('bed-double')}Đang ở ${s.room} · Giường ${b2(s.bed)} · Tầng ${K.fl(s.room)}</span>` : s.status === 'da-tra' ? badge('Đã trả phòng', 'gray') : badge('Chưa có phòng', 'orange')}</div>
          ${apps.length ? apps.map((a) => `<div class="tc-app"><div class="row" style="justify-content:space-between;gap:8px;flex-wrap:wrap"><b style="color:var(--navy)">${a.id} · ${esc(a.type)}</b><span class="badge b-${APP_ST[a.status][1]}">${APP_ST[a.status][0]}</span></div><div class="small muted" style="margin-top:4px">Nộp ${a.date.slice(0, 10)} · Phòng ${a.room} · Giường ${b2(a.bed)} · ${esc(a.term)}</div>${App.v4.vline(a.history.map((h, i) => ({ t: h.t, d: h.d, s: h.s, st: i === a.history.length - 1 && a.status === 'cho-duyet' ? 'cur' : 'done' })))}${a.status === 'can-bo-sung' ? `<div class="warn-bar">${ic('file-pen-line')}<span><b>Hồ sơ cần bổ sung giấy tờ</b><small>${a.docs.filter((d) => !d.ok).map((d) => d.name).join(', ')}. Đăng nhập cổng sinh viên để bổ sung.</small></span></div>` : ''}</div>`).join('') : '<p class="muted" style="margin-top:14px">Chưa có hồ sơ đăng ký lưu trú.</p>'}
          ${tr ? `<div class="tc-app"><b style="color:var(--navy)">${tr.id} · Chuyển phòng ${tr.from.room} → ${tr.to.room}</b><div class="small muted" style="margin-top:4px">Gửi ${tr.at.slice(0, 10)} · Trạng thái: ${{ 'cho-duyet': 'Chờ duyệt', 'bo-sung': 'Cần bổ sung', 'cho-ban-giao': 'Đã duyệt · Chờ bàn giao', 'hoan-tat': 'Hoàn tất', 'tu-choi': 'Từ chối', 'da-huy': 'Đã hủy' }[tr.status]}</div></div>` : ''}
          <div class="row" style="margin-top:16px;flex-wrap:wrap"><a href="#" class="btn btn-red" data-go="dang-nhap">${ic('log-in')}Đăng nhập để xem chi tiết</a><button class="btn btn-outline" id="tc-clear">${ic('rotate-ccw')}Tra cứu hồ sơ khác</button></div></div>`;
      }
      return page('tra-cuu', 'bn_giaitrinh', 'Tra cứu hồ sơ', 'Tra cứu hồ sơ lưu trú', 'Xem nhanh trạng thái hồ sơ đăng ký, chuyển phòng mà không cần đăng nhập.', `
        <div class="grid resp-1" style="grid-template-columns:420px 1fr;gap:18px;align-items:start">
          <form class="card pad" id="tc-f" novalidate><h3 class="card-t" style="font-size:20px">${ic('file-search')}Thông tin tra cứu</h3>
            <div class="field" style="margin-top:14px"><label for="tc-id">Mã sinh viên hoặc mã hồ sơ <span class="req">*</span></label><div class="iwrap">${ic('id-card')}<input id="tc-id" class="input" placeholder="Ví dụ: SV260001 hoặc HS2026-0008" value="${esc(st.id)}"></div></div>
            <div class="field" style="margin-top:12px"><label for="tc-ph">4 số cuối điện thoại đã đăng ký <span class="req">*</span></label><div class="iwrap">${ic('phone')}<input id="tc-ph" class="input" inputmode="numeric" maxlength="4" placeholder="Ví dụ: 1234" value="${esc(st.phone)}"></div></div>
            <p class="err" id="tc-err" hidden style="margin-top:8px"></p><button class="btn btn-red btn-block btn-lg" style="margin-top:16px">${ic('search')}Tra cứu</button>
            <p class="muted small row" style="margin-top:12px;gap:8px;align-items:flex-start">${ic('shield-check')}<span>Số điện thoại dùng để xác minh, giúp bảo vệ thông tin cá nhân của bạn.</span></p></form>
          ${result || `<div class="card pad empty"><span class="amen-ic blue">${ic('file-search')}</span><p>Nhập mã sinh viên và 4 số cuối điện thoại để xem trạng thái hồ sơ.</p><p class="small">Dùng thử: <b>SV260012</b> / <b>0034</b> (hồ sơ chờ duyệt) hoặc <b>SV260001</b> / <b>1234</b>.</p></div>`}</div>`);
    },
    mount: (root) => {
      const st = App.st.tc;
      root.querySelector('#tc-f').onsubmit = (e) => {
        e.preventDefault(); const id = root.querySelector('#tc-id').value.trim().toUpperCase(), ph = root.querySelector('#tc-ph').value.trim();
        const err = root.querySelector('#tc-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        if (!id) return fail('Nhập mã sinh viên hoặc mã hồ sơ.'); if (!/^\d{4}$/.test(ph)) return fail('Nhập đúng 4 chữ số cuối điện thoại.');
        const app = K.db.applications.find((a) => a.id.toUpperCase() === id); const s = K.student(app ? app.student : id);
        if (!s || String(s.phone || '').replace(/\D/g, '').slice(-4) !== ph) { st.found = null; st.id = id; st.phone = ''; return fail('Không tìm thấy hồ sơ khớp với thông tin đã nhập. Kiểm tra lại mã và số điện thoại.'); }
        Object.assign(st, { id, phone: ph, found: s.id }); App.refresh();
      };
      const c = root.querySelector('#tc-clear'); if (c) c.onclick = () => { App.st.tc = null; App.refresh(); };
      bindFooter(root);
    },
  };

  // footer cho các trang khách cũ
  ['phong-o', 'phong-detail', 'so-do'].forEach((k) => { const p = P[k]; const m = p.mount; p.mount = (root, x) => { if (m) m(root, x); bindFooter(root); }; });
  // danh sách màn hình: thêm nhóm giao diện khách
  const sd = P['so-do']; const sdR = sd.render, sdM = sd.mount;
  const G = [[48, 'Trang chủ (thiết kế mới)', 'trang-chu'], [49, 'Tiện ích', 'tien-ich'], [50, 'Sự kiện & album', 'su-kien'], [51, 'Hướng dẫn & câu hỏi thường gặp', 'huong-dan'], [52, 'Tra cứu hồ sơ', 'tra-cuu']];
  sd.render = () => sdR().replace('</div>' + App.pubFooter(), `<h2 style="font-size:24px;margin:26px 0 14px">Giao diện khách (cập nhật)</h2><div class="grid g3">${G.map((s) => `<button class="card" data-go="${s[2]}" style="text-align:left;padding:16px 18px;display:flex;gap:14px;align-items:center;cursor:pointer;border:1px solid #e6eef8"><span class="stepnum">${s[0]}</span><span style="min-width:0"><b style="color:var(--navy);display:block">${s[1]}</b><small class="muted">#${s[2]}</small></span>${ic('arrow-right')}</button>`).join('')}</div></div>${App.pubFooter()}`);
  sd.mount = (root) => sdM(root);
})();
