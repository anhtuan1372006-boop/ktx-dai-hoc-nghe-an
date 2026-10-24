/* Cổng sinh viên: ảnh 7–20 (và bản cập nhật 34, 35) */
(function () {
  const K = window.KTX, { esc, ic, im, av, spark, badge, sel } = App;
  const P = App.pages;
  const b2 = K.pad2;
  const money = K.money;
  const shell = (o, body) => App.shell(Object.assign({ role: 'student' }, o), body);
  const myInvoices = () => K.db.invoices.filter((i) => i.student === K.db.session.id);
  const myApp = () => K.db.applications.filter((a) => a.student === K.db.session.id).slice(-1)[0];
  const myRepairs = () => K.db.repairs.filter((r) => r.student === K.db.session.id);
  const noRoom = (o) => shell(o, `<div class="card pad" style="text-align:center;padding:60px 30px;margin-top:20px">${im('side_boy', '', '')}<h2 style="font-size:28px;margin-top:10px">Bạn chưa có phòng ở ký túc xá</h2><p class="muted" style="margin:10px auto 22px;max-width:520px;line-height:1.6">Chọn phòng còn chỗ và gửi hồ sơ đăng ký lưu trú. Sau khi Ban quản lý duyệt, thông tin phòng sẽ hiển thị tại đây.</p><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><button class="btn btn-red" data-go="phong-o">${ic('search')}Tìm phòng</button><button class="btn btn-outline" data-go="sv-dang-ky-luu-tru">Đăng ký lưu trú</button></div></div>`);
  const semMonths = { 'Học kỳ I · 2026 – 2027': ['01/09/2026', '31/01/2027'], 'Học kỳ II · 2026 – 2027': ['01/02/2027', '31/07/2027'], 'Học kỳ I · 2027 – 2028': ['01/09/2027', '31/01/2028'] };
  const stayTabs = (active, kind) => {
    const t = kind === 'v2'
      ? [['sv-ho-so', 'Thông tin lưu trú'], ['sv-dang-ky-luu-tru', 'Đăng ký lưu trú'], ['sv-chuyen-phong', 'Đổi phòng'], ['sv-tra-phong', 'Trả phòng']]
      : [['sv-ho-so', 'Hồ sơ', 'file-text'], ['sv-gia-han', 'Gia hạn', 'calendar-days'], ['sv-chuyen-phong', 'Chuyển phòng', 'arrow-left-right'], ['sv-tra-phong', 'Trả phòng', 'log-out']];
    return `<div class="utabs boxed" style="${kind === 'icons' ? '' : ''}">${t.map(([g, l, i]) => `<button class="utab ${g === active ? 'on' : ''}" data-go="${g}" style="${kind === 'icons' ? '' : 'flex:1;justify-content:center'}">${kind === 'icons' ? ic(i) : ''}${l}</button>`).join('')}</div>`;
  };

  // ============ 7 / 35. Tổng quan ============
  P['sv-tong-quan'] = {
    role: 'student', title: 'Tổng quan',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-tong-quan', logo: 'stack', notif: 'count', search: 'Tìm kiếm thông báo, dịch vụ, hướng dẫn...', sbw: 228, icons: { 'sv-ho-so': 'building-2', 'sv-hoa-don': 'file-text' } };
      const r = u.room ? K.room(u.room) : null;
      const inv = myInvoices()[0];
      const app = myApp();
      const notes = App.myNotes().filter((n) => n.important || n.to).slice(0, 3);
      const roomCard = r ? `<div class="card pad" style="padding:14px 20px 16px">
          <div class="row" style="margin-bottom:10px"><img src="${K.A('ic_room_red')}" class="blend" style="width:38px" alt=""><h2 style="font-size:24px">Phòng ${r.code} · Tầng ${r.khu}</h2>${badge('Đang lưu trú', 'green', { icon: 'circle-plus' })}</div>
          <div style="display:grid;grid-template-columns:360px 1fr;gap:24px" class="resp-1"><img src="${K.A(r.code === 'A302' ? 'room_a302_wide' : r.img)}" style="width:100%;height:234px;object-fit:cover;border-radius:12px" alt="Ảnh phòng ${r.code}">
          <div><div class="info-list">
            <div>${ic('layers')}<span>Tầng</span><b>Tầng ${r.khu}</b></div><div>${ic('door-closed')}<span>Phòng</span><b>${r.code}</b></div><div>${ic('bed-double')}<span>Giường của bạn</span><b>Giường ${b2(u.bed)}</b></div><div>${ic('users')}<span>Số người trong phòng</span><b>${K.occCount(r.code)} sinh viên</b></div><div>${ic('bed-single')}<span>Tổng số giường</span><b>${r.beds} giường</b></div></div>
            <button class="btn btn-soft btn-block" data-go="sv-phong" style="margin-top:20px;font-size:16px">${ic('eye')}Xem phòng</button></div></div></div>`
        : `<div class="card pad" style="text-align:center;padding:40px 20px"><h2 style="font-size:22px">Bạn chưa có phòng</h2><p class="muted" style="margin:10px 0 18px">Chọn phòng và gửi hồ sơ đăng ký lưu trú để bắt đầu.</p><button class="btn btn-red" data-go="phong-o">${ic('search')}Tìm phòng</button></div>`;
      const invCard = inv ? `<div class="card pad" style="padding:14px 22px 16px">
          <div class="row" style="margin-bottom:8px"><img src="${K.A('ic_invoice')}" class="blend" style="width:38px" alt=""><h2 style="font-size:24px">Hóa đơn tháng ${inv.period.slice(0, 2)}</h2>${inv.status === 'da-tt' ? badge('Đã thanh toán', 'green', { icon: 'circle-check' }) : inv.status === 'cho-doi-soat' ? badge('Chờ đối soát', 'orange', { icon: 'clock' }) : badge('Chưa thanh toán', 'orange', { icon: 'circle-plus' })}</div>
          <div style="display:flex;justify-content:space-between;color:var(--text);font-size:15px;margin-bottom:6px"><span>Mã hóa đơn: <b style="color:var(--navy)">${inv.id}</b></span><span>Kỳ thanh toán: <b style="color:var(--navy)">${inv.period}</b></span></div>
          <div class="amt-row"><span>${ic('house')}Tiền phòng</span><b>${money(inv.items[0].amount)}</b></div><div class="amt-row"><span>${ic('zap')}Tiền điện (định mức)</span><b>${money(inv.items[1].amount)}</b></div><div class="amt-row"><span>${ic('droplet')}Tiền nước (định mức)</span><b>${money(inv.items[2].amount)}</b></div>
          <div class="total-row" style="border:0;padding:6px 0 8px"><span>Tổng cộng</span><b>${money(inv.total)}</b></div>
          <div class="grid g2" style="gap:16px"><button class="btn btn-red" data-go="sv-hoa-don">${ic('credit-card')}Xem hóa đơn</button><button class="btn btn-outline-red" data-go="sv-thanh-toan-${inv.id}">${ic('credit-card')}${inv.status === 'chua-tt' ? 'Thanh toán ngay' : 'Xem chi tiết'}</button></div></div>`
        : `<div class="card pad"><h2 style="font-size:22px">Hóa đơn</h2><p class="muted" style="margin-top:10px">Chưa có hóa đơn nào.</p></div>`;
      return shell(o, `
        <div class="welcome"><h1>Chào ${esc(u.name)}!${spark}</h1><p>Mọi việc ở ký túc xá, gọn trong một nơi.</p></div>
        <div class="grid resp-1" style="grid-template-columns:1.25fr 1fr;gap:18px;margin-top:2px">${roomCard}${invCard}</div>
        <div class="card qa">
          <a href="#" data-go="sv-sua-chua">${im('qa_repair', 'blend')}<span><b>Báo sửa chữa</b><small>Gửi yêu cầu sửa chữa thiết bị, cơ sở vật chất.</small></span><i class="go">${ic('chevron-right')}</i></a>
          <a href="#" data-go="sv-gia-han">${im('qa_extend', 'blend')}<span><b>Gia hạn</b><small>Đăng ký gia hạn lưu trú ký túc xá.</small></span><i class="go">${ic('chevron-right')}</i></a>
          <a href="#" data-go="sv-chuyen-phong">${im('qa_transfer', 'blend')}<span><b>Chuyển phòng</b><small>Đăng ký nhu cầu chuyển phòng.</small></span><i class="go">${ic('chevron-right')}</i></a>
          <a href="#" data-go="sv-ho-tro">${im('qa_feedback', 'blend')}<span><b>Gửi phản ánh</b><small>Góp ý, phản ánh vấn đề tại ký túc xá.</small></span><i class="go">${ic('chevron-right')}</i></a>
        </div>
        <div class="grid resp-1" style="grid-template-columns:1.03fr 1fr;gap:18px">
          <div class="card pad" style="padding:16px 22px 8px"><div class="card-h" style="margin-bottom:8px"><h2 class="card-t">${im('ic_megaphone', 'blend', '')}Thông báo mới</h2><a href="#" class="link link-red" data-go="sv-thong-bao" style="font-size:15px">Xem tất cả ${ic('arrow-right')}</a></div>
            ${notes.map((n) => `<a href="#" class="list-row" data-note="${n.id}"><i class="dot" style="background:${n.read ? 'var(--blue)' : 'var(--red)'}"></i><span><b>${esc(n.title)}</b><small>${esc(n.summary)}</small></span><time>${esc(n.dash || n.time)}</time></a>`).join('')}</div>
          <div class="card pad" style="padding:16px 22px"><div class="card-h" style="margin-bottom:6px"><h2 class="card-t">${ic('file-text')}Hồ sơ lưu trú</h2>${app ? App.statusBadge(app.status) : ''}</div>
            ${app ? `<div style="display:grid;grid-template-columns:1fr 210px;gap:10px;align-items:center" class="resp-1"><div class="info-list" style="font-size:15px">
              <div style="grid-template-columns:28px 130px 1fr">${ic('user-round')}<span>Họ tên</span><b>${esc(u.name)}</b></div>
              <div style="grid-template-columns:28px 130px 1fr">${ic('graduation-cap')}<span>Mã sinh viên</span><b>${u.id}</b></div>
              <div style="grid-template-columns:28px 130px 1fr">${ic('building')}<span>Phòng</span><b>${app.room} · Tầng ${K.fl(app.room)} · Giường ${b2(app.bed)}</b></div>
              <div style="grid-template-columns:28px 130px 1fr">${ic('calendar-days')}<span>Thời gian lưu trú</span><b>Năm học ${app.term}</b></div>
              <div style="grid-template-columns:28px 130px 1fr">${ic('file-check')}<span>Trạng thái hồ sơ</span><span>${App.statusBadge(app.status)}</span></div></div>
              <div style="text-align:center">${im('ic_clipboard', 'blend', '')}<button class="btn btn-soft btn-block" data-contract style="margin-top:6px">${ic('file-text')}Xem hợp đồng</button></div></div>`
            : `<p class="muted">Bạn chưa gửi hồ sơ lưu trú.</p><button class="btn btn-red" style="margin-top:14px" data-go="sv-dang-ky-luu-tru">Đăng ký lưu trú</button>`}</div>
        </div>`);
    },
    mount: (root) => {
      root.querySelectorAll('[data-note]').forEach((a) => a.onclick = (e) => { e.preventDefault(); const n = K.db.notifications.find((x) => x.id === a.dataset.note); n.read = true; K.save(); App.st['sv-thong-bao'] = { tab: 'all', sel: n.id }; App.go('sv-thong-bao'); });
      const c = root.querySelector('[data-contract]'); if (c) c.onclick = () => App.showContract();
    },
  };

  App.showContract = (sid) => {
    const u = sid ? K.student(sid) : K.me();
    const c = K.db.contracts.find((x) => x.student === u.id);
    const app = K.db.applications.find((a) => a.student === u.id && a.status === 'da-duyet');
    App.modal({ title: 'Thỏa thuận lưu trú', wide: true, body: `<div style="border:1px solid var(--line);border-radius:12px;padding:20px 24px">
      <h3 style="font-size:20px">THỎA THUẬN LƯU TRÚ TẠI KÝ TÚC XÁ ĐẠI HỌC NGHỆ AN</h3><p class="muted small" style="margin-top:4px">Số: ${c ? c.id : (app ? app.id : '—')}</p>
      <dl class="kv" style="margin-top:16px"><dt>Sinh viên</dt><dd>${esc(u.name)} (${u.id})</dd><dt>Phòng</dt><dd>${u.room || (app && app.room) || '—'} · Giường ${b2(u.bed || (app && app.bed) || 0)}</dd><dt>Năm học</dt><dd>2026 – 2027</dd><dt>Thời hạn</dt><dd>01/10/2026 – 31/08/2027</dd><dt>Phí phòng</dt><dd>${money(K.room(u.room || 'A302').price)} / tháng</dd></dl>
      <ol style="margin:16px 0 0;padding-left:20px;line-height:1.8">${App.RULES.slice(0, 5).map((r) => `<li>${r}</li>`).join('')}</ol></div>`,
      foot: `<button class="btn btn-outline" data-dl>${ic('download')}Tải xuống</button><button class="btn btn-red" data-x>Đóng</button>`,
      onMount: (el) => el.querySelector('[data-dl]').onclick = () => App.toast('Bản PDF thỏa thuận đã được gửi tới email ' + u.email) });
  };

  // ============ 8 / 34. Đăng ký lưu trú ============
  P['sv-dang-ky-luu-tru'] = {
    role: 'student', title: 'Đăng ký lưu trú',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-so', logo: 'inline', notif: 'dot', search: 'Tìm dịch vụ, thông báo, hướng dẫn...', foot: 'illus', sbw: 262, icons: { 'sv-hoa-don': 'receipt-text' } };
      const bk = App.st.booking || { room: 'B204', bed: (K.bedMap('B204').find((b) => b.free) || {}).bed || 4 };
      App.st.booking = bk;
      const r = K.room(bk.room);
      const st = App.state('reg', () => ({ step: 2, faculty: '', phone: '', emer: u.emergency.name || '', term: 'Học kỳ I · 2026 – 2027', date: '', agree: false, files: [] }));
      const pending = K.db.applications.find((a) => a.student === u.id && a.status === 'cho-duyet');
      const s1 = `<span class="stepnum done">${ic('check')}</span>`;
      const stepper = `<div class="card" style="display:grid;grid-template-columns:auto 1fr auto 1fr auto;align-items:center;gap:22px;padding:14px 32px">
        <div class="row">${s1}<div><b style="color:var(--navy);font-weight:500">1. Chọn phòng</b><div class="small muted">Đã chọn phòng phù hợp</div></div></div><i style="height:1.5px;background:#c9d6ea"></i>
        <div class="row"><span class="stepnum ${st.step === 2 ? 'on' : 'done'}">${st.step === 2 ? '2' : ic('check')}</span><div><b style="color:${st.step === 2 ? 'var(--red)' : 'var(--navy)'};font-weight:600">2. Thông tin đăng ký</b><div class="small" style="color:${st.step === 2 ? 'var(--red)' : 'var(--muted)'}">Nhập thông tin cá nhân và giấy tờ</div></div></div><i style="height:1.5px;background:#c9d6ea"></i>
        <div class="row"><span class="stepnum ${st.step === 3 ? 'on' : ''}" style="${st.step === 3 ? '' : 'background:#eef2f7;color:#5d6b88;border-color:#e2e8f0'}">3</span><div><b style="color:${st.step === 3 ? 'var(--red)' : 'var(--text)'};font-weight:500">3. Kiểm tra & gửi</b><div class="small muted">Xác nhận và hoàn tất</div></div></div></div>`;
      const facs = [['', 'Chọn khoa'], 'Công nghệ thông tin', 'Kinh tế', 'Ngoại ngữ', 'Sư phạm', 'Điện – Điện tử', 'Xây dựng'];
      const left = st.step === 2 ? `<form class="card pad" id="rg2" novalidate style="padding:20px 18px 18px">
          <h3 class="sec-t">${ic('user-round')}Thông tin sinh viên</h3>
          <div class="grid g2" style="gap:14px 18px;margin-top:14px">
            <div class="field"><label>Họ và tên <span class="req">*</span></label><input class="input ro" readonly value="${esc(u.name)}" style="background:#eef1f5;border-color:#eef1f5"></div>
            <div class="field"><label>Mã sinh viên <span class="req">*</span></label><input class="input ro" readonly value="${u.id}" style="background:#eef1f5;border-color:#eef1f5"></div>
            <div class="field"><label for="r-fac">Khoa / Lớp <span class="req">*</span></label>${sel('r-fac', facs, st.faculty)}</div>
            <div class="field"><label>Email liên hệ <span class="req">*</span></label><input class="input ro" readonly value="${esc(u.email)}" style="background:#eef1f5;border-color:#eef1f5"></div>
            <div class="field"><label for="r-phone">Số điện thoại liên hệ <span class="req">*</span></label><div class="iwrap">${ic('phone')}<input id="r-phone" class="input" placeholder="090 *** ****" value="${esc(st.phone)}" inputmode="tel"></div></div>
            <div class="field"><label for="r-emer">Người liên hệ khẩn cấp <span class="req">*</span></label><div class="iwrap">${ic('user-round')}<input id="r-emer" class="input" placeholder="Họ tên người liên hệ" value="${esc(st.emer)}"></div></div>
          </div><hr class="hr">
          <h3 class="sec-t">${ic('calendar-days')}Thời gian lưu trú</h3>
          <div class="grid g2" style="gap:14px 18px;margin-top:14px">
            <div class="field"><label for="r-term">Học kỳ / Năm học <span class="req">*</span></label>${sel('r-term', Object.keys(semMonths), st.term)}</div>
            <div class="field"><label for="r-date">Ngày dự kiến nhận phòng <span class="req">*</span></label><div class="iwrap">${ic('calendar-days')}<input id="r-date" type="date" class="input" value="${st.date}" min="2026-09-01" max="2027-08-31"></div></div>
          </div>
          <h3 class="sec-t" style="margin:18px 0 12px">${ic('paperclip')}Thêm giấy tờ cần thiết</h3>
          <div><label class="drop">${ic('file-text')}<span><b>Chọn tệp</b> hoặc kéo thả vào đây<br><small style="font-size:11px">Hỗ trợ định dạng PDF, JPG, PNG (tối đa 5MB)</small></span><input type="file" id="r-files" multiple accept=".pdf,.jpg,.jpeg,.png"></label></div>
          <p class="err" id="r-err" style="margin-top:10px" hidden></p>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:18px;flex-wrap:wrap"><label class="check" style="font-size:14px"><input type="checkbox" id="r-agree" ${st.agree ? 'checked' : ''}>Tôi đã đọc và đồng ý với <a href="#" id="r-rules" style="text-decoration:underline">nội quy ký túc xá</a> <span class="req">*</span></label>
          <div class="row"><button type="button" class="btn btn-outline" style="border-color:var(--line);font-size:16px" data-go="phong-${r.code}">Quay lại</button><button class="btn btn-red" style="font-size:16px">Kiểm tra hồ sơ ${ic('arrow-right')}</button></div></div>
        </form>`
        : `<div class="card pad" style="padding:22px 24px"><h3 class="sec-t">${ic('clipboard-check')}Kiểm tra thông tin trước khi gửi</h3>
          <dl class="kv" style="margin-top:18px"><dt>Họ và tên</dt><dd>${esc(u.name)}</dd><dt>Mã sinh viên</dt><dd>${u.id}</dd><dt>Khoa</dt><dd>${esc(st.faculty)}</dd><dt>Email</dt><dd>${esc(u.email)}</dd><dt>Số điện thoại</dt><dd>${esc(st.phone)}</dd><dt>Liên hệ khẩn cấp</dt><dd>${esc(st.emer)}</dd><dt>Học kỳ</dt><dd>${esc(st.term)}</dd><dt>Ngày nhận phòng</dt><dd>${st.date.split('-').reverse().join('/')}</dd><dt>Giấy tờ</dt><dd>${st.files.length ? st.files.map(esc).join(', ') : 'Nộp bản giấy khi nhận phòng'}</dd><dt>Phòng / giường</dt><dd>${r.code} · Tầng ${r.khu} · Giường ${b2(bk.bed)}</dd></dl>
          <div class="card" style="box-shadow:none;background:var(--blue-50);padding:14px 16px;margin-top:20px;display:flex;gap:12px">${ic('info')}<span class="small" style="color:var(--ink)">Sau khi gửi, hồ sơ chuyển sang trạng thái <b>Chờ duyệt</b>. Ban quản lý xét duyệt trong 3 – 5 ngày làm việc và thông báo kết quả qua hệ thống.</span></div>
          <div class="row" style="justify-content:flex-end;margin-top:22px"><button class="btn btn-outline" id="r-back">Sửa thông tin</button><button class="btn btn-red" id="r-send">${ic('send')}Gửi hồ sơ</button></div></div>`;
      const right = `<div class="card pad" style="padding:18px 18px">
          <h3 class="sec-t">${ic('bed-double')}Thông tin phòng đã chọn</h3>
          <img src="${K.A(r.code === 'B204' ? 'room_b204_wide' : r.img)}" style="width:100%;height:199px;object-fit:cover;border-radius:10px;margin-top:14px" alt="Ảnh phòng ${r.code}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0 4px"><h3 style="font-size:20px">Phòng ${r.code} • Tầng ${r.khu}</h3>${badge('Đã chọn', 'green', { icon: 'circle-check', sm: true })}</div>
          <div class="info-list lined" style="font-size:14px">
            <div>${ic('layers')}<span>Tầng</span><span>Tầng ${r.khu}</span></div><div>${ic('users')}<span>Loại phòng</span><span>Phòng ${r.beds} người</span></div><div>${ic('bed-double')}<span>Giường của bạn</span><span>Giường ${b2(bk.bed)}</span></div><div>${ic('users-round')}<span>Tổng số giường</span><span>${r.beds} giường</span></div><div>${ic('user-round')}<span>Số sinh viên hiện tại</span><span>${K.occCount(r.code)} sinh viên</span></div></div>
          <hr class="hr" style="margin:10px 0">
          <h4 class="row" style="font-size:16px;gap:10px"><span style="width:22px;height:22px;border-radius:50%;background:var(--red);color:#fff;display:grid;place-items:center;font-size:13px">$</span>Chi phí dự kiến</h4>
          <div class="info-list lined" style="font-size:14px;margin-top:6px">
            <div>${ic('bed-double')}<span>Tiền phòng</span><b style="font-weight:600">${money(r.price)} / tháng</b></div><div>${ic('zap')}<span>Điện <small class="muted">(tính theo sử dụng)</small></span><b style="font-weight:600">30.000đ / tháng</b></div><div>${ic('droplet')}<span>Nước <small class="muted">(tính theo sử dụng)</small></span><b style="font-weight:600">20.000đ / tháng</b></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;background:#fdeef0;border-radius:8px;padding:12px 14px;margin-top:6px"><span class="row" style="gap:12px;color:var(--navy);font-weight:700">${ic('receipt-text')}Tổng cộng dự kiến</span><b style="color:var(--red);font-size:20px">${money(r.price + 50000)} / tháng</b></div>
        </div>`;
      return shell(o, `${App.phead({ cls: 'compact', crumb: [['Trang chủ', 'sv-tong-quan'], ['Lưu trú', 'sv-ho-so'], 'Đăng ký lưu trú'], title: 'Đăng ký lưu trú', desc: 'Đăng ký phòng ký túc xá để bắt đầu hành trình học tập thuận tiện và an toàn tại Đại học Nghệ An.' })}
        ${pending ? `<div class="card" style="padding:14px 20px;display:flex;gap:12px;align-items:center;background:#fff8ea;border-color:#fbeccd">${ic('clock')}<span>Bạn đang có hồ sơ <b>${pending.id}</b> (${pending.room} · Giường ${b2(pending.bed)}) chờ duyệt. Gửi hồ sơ mới sẽ thay thế hồ sơ này.</span></div>` : ''}
        ${stepper}<div class="grid resp-1" style="grid-template-columns:1.52fr 1fr;gap:16px;align-items:start">${left}${right}</div>`);
    },
    mount: (root) => {
      const st = App.st.reg; const u = K.me(); const bk = App.st.booking;
      const f = root.querySelector('#rg2');
      if (f) {
        root.querySelector('#r-rules').onclick = (e) => { e.preventDefault(); App.showRules(); };
        const keep = () => { st.faculty = f.querySelector('#r-fac').value; st.phone = f.querySelector('#r-phone').value.trim(); st.emer = f.querySelector('#r-emer').value.trim(); st.term = f.querySelector('#r-term').value; st.date = f.querySelector('#r-date').value; st.agree = f.querySelector('#r-agree').checked; const fl = f.querySelector('#r-files').files; if (fl.length) st.files = [...fl].map((x) => x.name); };
        f.onsubmit = (e) => {
          e.preventDefault(); keep();
          const err = f.querySelector('#r-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
          if (!st.faculty) return fail('Vui lòng chọn khoa.');
          if (!/^0\d{9}$/.test(st.phone.replace(/\s/g, ''))) return fail('Số điện thoại liên hệ gồm 10 chữ số, bắt đầu bằng 0.');
          if (!st.emer) return fail('Vui lòng nhập họ tên người liên hệ khẩn cấp.');
          if (!st.date) return fail('Vui lòng chọn ngày dự kiến nhận phòng.');
          if (!st.agree) return fail('Bạn cần đồng ý với nội quy ký túc xá.');
          if (K.freeBeds(bk.room) <= 0) return fail('Phòng đã hết giường trống. Vui lòng chọn phòng khác.');
          st.step = 3; App.refresh();
        };
      } else {
        root.querySelector('#r-back').onclick = () => { st.step = 2; App.refresh(); };
        root.querySelector('#r-send').onclick = () => {
          K.db.applications = K.db.applications.filter((a) => !(a.student === u.id && a.status === 'cho-duyet'));
          const id = 'HS2026-' + String(40 + K.db.applications.length).padStart(4, '0');
          K.db.applications.push({ id, student: u.id, type: 'Đăng ký lưu trú mới', room: bk.room, bed: bk.bed, term: '2026 – 2027', period: 'Từ ' + st.date.split('-').reverse().slice(1).join('/') + ' đến 06/2027', date: K.now(), status: 'cho-duyet', docs: [{ name: 'Giấy xác nhận sinh viên', ok: st.files.length > 0 }, { name: 'CCCD (bản sao)', ok: st.files.length > 1 }, { name: 'Ảnh thẻ 3x4', ok: st.files.length > 2 }, { name: 'Đơn đăng ký lưu trú', ok: true }], history: [{ t: 'Sinh viên nộp hồ sơ', d: K.now(), s: 'Hồ sơ được gửi lên hệ thống.' }, { t: 'Chờ xét duyệt', d: K.now(), s: 'Hồ sơ đang chờ cán bộ quản lý xem xét.' }] });
          u.faculty = st.faculty; u.phone = st.phone; u.emergency.name = st.emer; if (u.status === 'moi') u.status = 'cho-phan-phong';
          K.save(); App.st.reg = null;
          App.toast('Đã gửi hồ sơ ' + id + '. Hồ sơ đang chờ Ban quản lý duyệt.');
          App.go('sv-ho-so');
        };
      }
    },
  };

  // ============ 9. Phòng của tôi ============
  P['sv-phong'] = {
    role: 'student', title: 'Phòng của tôi',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-phong', logo: 'stack', notif: 'dot', search: 'Tìm dịch vụ, thông báo, hướng dẫn...', foot: 'plain', sbw: 226 };
      if (!u.room) return noRoom(o);
      const r = K.room(u.room);
      const mates = K.occupants(r.code);
      const duty = [['Thứ Hai', '13/10/2026', 'Vệ sinh chung'], ['Thứ Ba', '14/10/2026', 'Đổ rác, lau sàn'], ['Thứ Tư', '15/10/2026', 'Sắp xếp bàn học'], ['Thứ Năm', '16/10/2026', 'Vệ sinh nhà tắm']];
      const dutyPeople = [mates[0], mates[1], mates.find((m) => m.id === u.id) || mates[2], mates[3] || mates[0]].map((m) => m || u);
      return shell(o, `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
          <div>${App.crumb(['home', ['Phòng của tôi', 'sv-phong'], 'Thông tin phòng ở'])}<h1 style="font-size:46px;font-weight:800;letter-spacing:-.02em;margin-top:8px;display:flex;align-items:center;gap:18px;flex-wrap:wrap">Phòng ${r.code} · Tầng ${r.khu} <span class="badge b-green" style="font-size:15px;padding:7px 14px;border:1px solid #bfe6cb"><i class="dot" style="width:12px;height:12px;background:#22b24c"></i>Đang lưu trú</span></h1>
          <p style="font-size:17px;color:var(--text);margin-top:4px">Giường của bạn: <b style="color:var(--navy)">${b2(u.bed)}</b> <span style="color:#c5cfdf;margin:0 12px">|</span> Phòng có ${r.beds} giường <span style="color:#c5cfdf;margin:0 12px">|</span> ${K.occCount(r.code)} sinh viên</p></div>
          <button class="btn btn-outline-red" data-go="sv-chuyen-phong" style="height:48px;font-size:16px;margin-top:30px">${ic('arrow-left-right')}Yêu cầu chuyển phòng</button></div>
        <div class="grid resp-1" style="grid-template-columns:1.3fr 1fr;gap:16px">
          <div class="card pad" style="padding:16px 14px"><h2 class="card-t" style="margin:0 0 12px 6px">${ic('megaphone')}Không gian phòng</h2>
            <img src="${K.A(r.code === 'A302' ? 'room_a302_big' : r.img)}" style="width:100%;height:270px;object-fit:cover;border-radius:12px" alt="Ảnh phòng ${r.code}">
            <div class="chips4" style="margin-top:12px">
              <div class="chip4"><span class="ic-box">${ic('bed-double')}</span><span><b>${r.beds} giường</b><small>Phòng ở tiêu chuẩn</small></span></div>
              <div class="chip4"><span class="ic-box">${ic('lamp-desk')}</span><span><b>Bàn học</b><small>Mỗi giường 1 bàn</small></span></div>
              <div class="chip4"><span class="ic-box">${ic('columns-2')}</span><span><b>Tủ cá nhân</b><small>Có khóa riêng</small></span></div>
              <div class="chip4"><span class="ic-box">${ic('wifi')}</span><span><b>Wi-Fi</b><small>Miễn phí</small></span></div></div>
            <div class="grid g2" style="gap:12px;margin-top:12px">
              <a href="#" data-go="sv-sua-chua" style="display:flex;align-items:center;gap:16px;background:#fdecee;border-radius:12px;padding:12px 18px;color:var(--ink)"><span style="color:var(--red)">${ic('triangle-alert', 'ic-lg')}</span><span style="flex:1"><b style="color:var(--red);display:block">Báo sự cố</b><small class="muted">Hỏng hóc, mất điện, mất nước...</small></span>${ic('chevron-right')}</a>
              <a href="#" id="rules" style="display:flex;align-items:center;gap:16px;background:#eaf2fd;border-radius:12px;padding:12px 18px;color:var(--ink)">${ic('file-text')}<span style="flex:1"><b style="color:var(--navy);display:block">Xem nội quy</b><small class="muted">Nội quy ký túc xá</small></span>${ic('chevron-right')}</a></div></div>
          <div class="card pad" style="padding:16px 14px"><div class="card-h" style="padding:0 6px"><h2 class="card-t">${ic('notebook-text')}Bạn cùng phòng</h2><span class="badge b-gray" style="background:#eef3fa;color:var(--ink);font-weight:500">${K.occCount(r.code)} / ${r.beds} sinh viên</span></div>
            <div style="display:flex;flex-direction:column;gap:10px">${mates.map((m) => `<div class="mate ${m.id === u.id ? 'me' : ''}">${av(m.avatar, 76)}<span><b>${esc(m.name)}</b><small>Giường ${b2(m.bed)}</small></span>${m.id === u.id ? `<span class="badge b-navy" style="margin-left:auto;border-radius:8px;padding:8px 16px;font-size:15px">Bạn</span>` : `<button class="badge b-blue" data-mate="${m.id}" style="border:0;cursor:pointer;margin-left:auto">${ic('graduation-cap')}Cùng khóa</button>`}</div>`).join('')}</div></div>
        </div>
        <div class="grid resp-1" style="grid-template-columns:1.3fr 1fr;gap:16px">
          <div class="card pad" style="padding:16px 14px"><div class="card-h" style="padding:0 6px"><h2 class="card-t">${ic('calendar-days')}Lịch trực vệ sinh phòng</h2><span class="badge b-blue" style="font-weight:500;color:var(--ink)">Tuần 13 - 19/10/2026</span></div>
            <div class="tbl-wrap"><table class="tbl compact"><thead><tr><th>Thứ</th><th>Ngày</th><th>Sinh viên trực</th><th>Ghi chú</th></tr></thead><tbody>${duty.map((d, i) => `<tr><td class="muted">${d[0]}</td><td>${d[1]}</td><td><span class="who">${av(dutyPeople[i].avatar, 30)}${esc(dutyPeople[i].name)}</span></td><td>${d[2]}</td></tr>`).join('')}</tbody></table></div></div>
          <div class="card pad" style="padding:16px 20px"><h2 class="card-t" style="margin-bottom:10px">${ic('file-text')}Thông tin lưu trú</h2>
            <div class="info-list lined" style="font-size:14px">${[['Năm học', '2026 – 2027'], ['Tầng', 'Tầng ' + r.khu], ['Phòng', r.code], ['Giường của bạn', b2(u.bed)], ['Số lượng giường', r.beds + ' giường'], ['Số sinh viên hiện tại', K.occCount(r.code) + ' sinh viên'], ['Thời gian lưu trú', '01/09/2026 – 31/05/2027']].map(([a, b]) => `<div style="grid-template-columns:200px 1fr;padding:3px 0"><span>${a}</span><span style="color:var(--ink)">${b}</span></div>`).join('')}
            <div style="grid-template-columns:200px 1fr;padding:6px 0"><span>Hợp đồng lưu trú</span><button class="btn btn-soft btn-sm" data-contract style="justify-content:space-between;font-weight:500">${ic('file-text')}Xem hợp đồng lưu trú ${ic('chevron-right')}</button></div></div></div>
        </div>`);
    },
    mount: (root) => {
      const r = root.querySelector('#rules'); if (r) r.onclick = (e) => { e.preventDefault(); App.showRules(); };
      const c = root.querySelector('[data-contract]'); if (c) c.onclick = () => App.showContract();
      root.querySelectorAll('[data-mate]').forEach((b) => b.onclick = () => { const m = K.student(b.dataset.mate); App.modal({ title: m.name, body: `<div class="row" style="gap:18px">${av(m.avatar, 90)}<dl class="kv" style="grid-template-columns:120px 1fr"><dt>Mã sinh viên</dt><dd>${m.id}</dd><dt>Khoa</dt><dd>${esc(m.faculty)}</dd><dt>Lớp</dt><dd>${esc(m.cls)}</dd><dt>Giường</dt><dd>${b2(m.bed)}</dd></dl></div>`, foot: '<button class="btn btn-red" data-x>Đóng</button>' }); });
    },
  };

  // ============ 10. Hồ sơ lưu trú ============
  P['sv-ho-so'] = {
    role: 'student', title: 'Hồ sơ lưu trú',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-so', logo: 'stack', notif: 'dot', search: 'Tìm dịch vụ, thông báo, hướng dẫn...', foot: 'card-down', sbw: 238, icons: { 'sv-phong': 'house', 'sv-hoa-don': 'badge-dollar-sign' } };
      const app = myApp();
      if (!app) return noRoom(o);
      const r = K.room(app.room);
      const conf = !!app.confirmed;
      const steps = [
        { t: 'Đã gửi hồ sơ', d: app.date.slice(0, 10), st: 'done' },
        { t: app.status === 'da-duyet' ? 'Đã duyệt' : app.status === 'tu-choi' ? 'Từ chối' : app.status === 'can-bo-sung' ? 'Cần bổ sung' : 'Chờ duyệt', d: app.status === 'da-duyet' ? (app.history[1] ? app.history[1].d.slice(0, 10) : '') : 'Đang xét duyệt', st: app.status === 'da-duyet' ? 'done' : 'cur' },
        { t: 'Xác nhận thỏa thuận', d: conf ? 'Đã xác nhận' : 'Chờ xác nhận của bạn', st: app.status !== 'da-duyet' ? 'todo' : conf ? 'done' : 'cur' },
        { t: 'Nhận phòng', d: 'Dự kiến 01/10/2026', st: conf ? 'cur' : 'todo' },
      ];
      const mates = K.occupants(r.code);
      const roster = (u.room === r.code ? mates : mates.concat([u])).slice(0, r.beds);
      const ordered = roster.sort((a, b) => (a.id === u.id ? -1 : b.id === u.id ? 1 : a.bed - b.bed));
      const curIdx = steps.findIndex((s) => s.st === 'cur');
      return shell(o, `${App.phead({ art: 'banner_profile', h: 150, crumb: [['Trang chủ', 'sv-tong-quan'], ['Lưu trú', 'sv-ho-so'], 'Hồ sơ lưu trú của tôi'], title: 'Hồ sơ lưu trú của tôi', extra: `<div class="row" style="margin-top:8px;font-size:17px;color:var(--text)">Mã hồ sơ: <b style="color:var(--navy);font-weight:600">${app.id}</b><span style="margin-left:14px">${App.statusBadge(app.status).replace('class="badge', 'style="font-size:15px;padding:6px 16px" class="badge')}</span></div>` })}
        <div class="card" style="padding:12px 30px 14px;margin-top:-6px"><div style="display:grid;grid-template-columns:repeat(4,1fr);position:relative">
          <div style="position:absolute;left:12.5%;right:12.5%;top:19px;height:4px;background:#d6deea;border-radius:4px"></div>
          <div style="position:absolute;left:12.5%;width:${curIdx < 0 ? 75 : Math.max(0, (curIdx - 1) * 25 + 15)}%;top:19px;height:4px;background:var(--blue);border-radius:4px"></div>
          ${curIdx > 0 ? `<div style="position:absolute;left:${12.5 + (curIdx - 1) * 25 + 15}%;width:10%;top:19px;height:4px;background:var(--red);border-radius:4px"></div>` : ''}
          ${steps.map((s, i) => `<div style="text-align:center;position:relative"><span class="stepnum ${s.st === 'done' ? 'done' : s.st === 'cur' ? '' : ''}" style="margin:0 auto;${s.st === 'cur' ? 'background:var(--red);color:#fff;border:3px solid #fff;box-shadow:0 0 0 2px var(--red)' : s.st === 'todo' ? 'background:#fff;color:var(--blue-700)' : ''}">${s.st === 'done' ? ic('check') : i + 1}</span><b style="display:block;margin-top:6px;color:${s.st === 'cur' ? 'var(--red)' : 'var(--navy)'};font-weight:600">${s.t}</b><small class="muted">${s.d}</small></div>`).join('')}</div></div>
        <div class="grid resp-1" style="grid-template-columns:1fr 0.79fr;gap:12px;align-items:start">
          <div class="card pad" style="padding:22px 18px">
            <div style="display:flex;justify-content:space-between;gap:12px;padding:0 8px"><div><h2 style="font-size:30px;font-weight:800">THỎA THUẬN LƯU TRÚ</h2><p style="font-size:19px;font-weight:600;color:var(--navy);margin-top:6px">TẠI KÝ TÚC XÁ ĐẠI HỌC NGHỆ AN</p></div><div class="row" style="align-items:flex-start"><button class="btn btn-soft" data-toast="Đã gửi bản PDF thỏa thuận tới email ${esc(u.email)}" style="color:var(--navy);font-weight:500">${ic('download')}Tải xuống</button><button class="btn btn-soft" data-toast="Đã gửi lệnh in tới máy in quầy tiếp nhận KTX" style="color:var(--navy);font-weight:500">${ic('printer')}In</button></div></div>
            ${[['1. Thông tin sinh viên', `<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;font-size:14px" class="resp-1"><dl class="kv" style="grid-template-columns:114px 1fr;font-size:14px;gap:8px 10px"><dt>Họ và tên:</dt><dd>${esc(u.name)}</dd><dt>Mã sinh viên:</dt><dd>${u.id}</dd><dt>Email:</dt><dd>${esc(u.email)}</dd></dl><dl class="kv" style="grid-template-columns:120px 1fr;font-size:14px;gap:8px 10px;border-left:1px solid var(--line);padding-left:22px"><dt>Phòng lưu trú:</dt><dd>${app.room}</dd><dt>Giường số:</dt><dd>${b2(app.bed)}</dd><dt>Tầng:</dt><dd>Tầng ${r.khu}</dd><dt>Năm học:</dt><dd>${app.term}</dd></dl></div>`],
              ['2. Thời hạn lưu trú', `<dl class="kv" style="grid-template-columns:140px 1fr;font-size:14px;gap:8px 10px"><dt>Thời gian bắt đầu:</dt><dd>01/10/2026</dd><dt>Thời gian kết thúc:</dt><dd>31/08/2027 (theo năm học 2026 – 2027)</dd></dl>`],
              ['3. Nội quy và trách nhiệm', `<ol style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:9px">${App.RULES.slice(0, 5).map((x, i) => `<li class="row" style="font-size:14px;color:var(--ink)"><span style="width:26px;height:26px;border-radius:50%;background:#fdecee;color:var(--red);display:grid;place-items:center;font-size:13px;flex:none">${i + 1}</span>${x}</li>`).join('')}</ol>`]].map(([t, b]) => `<div style="border:1px solid var(--line-2);border-radius:10px;margin-top:16px;overflow:hidden"><div style="background:#eaf2fd;padding:8px 16px;font-weight:700;color:var(--navy);font-size:16px">${t}</div><div style="padding:14px 22px">${b}</div></div>`).join('')}
          </div>
          <div class="card" style="padding:16px 16px 0;overflow:hidden">
            <h3 style="font-size:17px">Thông tin phòng lưu trú</h3>
            <div class="row" style="margin-top:10px"><img src="${K.A('ic_building_sm')}" style="width:76px;border-radius:6px" alt=""><div style="flex:1"><b style="font-size:18px;color:var(--navy)">Phòng ${r.code}</b><div class="muted">Tầng ${r.khu} - Ký túc xá sinh viên</div></div>${u.room === r.code ? badge('Đang ở', 'green', { sm: true }) : badge('Chờ nhận phòng', 'orange', { sm: true })}</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);margin:12px 0;font-size:13px" class="muted">
              <div class="row" style="gap:10px">${ic('graduation-cap')}<span>Sức chứa<b style="display:block;color:var(--navy);font-size:15px">${r.beds} sinh viên</b></span></div>
              <div class="row" style="gap:10px;border-left:1px solid var(--line);padding-left:14px">${ic('bed-double')}<span>Số giường<b style="display:block;color:var(--navy);font-size:15px">${r.beds} giường</b></span></div>
              <div class="row" style="gap:10px;border-left:1px solid var(--line);padding-left:14px">${ic('users')}<span>Số sinh viên hiện tại<b style="display:block;color:var(--navy);font-size:15px">${K.occCount(r.code)}/${r.beds}</b></span></div></div>
            <div style="display:flex;justify-content:space-between;align-items:center"><b style="color:var(--navy)">Danh sách sinh viên trong phòng</b><a href="#" class="link link-red small" data-go="sv-phong">Xem chi tiết ${ic('arrow-right')}</a></div>
            <div class="tbl-wrap" style="margin-top:8px"><table class="tbl compact" style="font-size:13.5px"><thead><tr><th class="c">STT</th><th>Họ và tên</th><th>Mã sinh viên</th><th class="c">Giường</th><th class="c">Trạng thái</th></tr></thead><tbody>${ordered.map((m, i) => `<tr class="${m.id === u.id ? 'sel' : ''}"><td class="c">${i + 1}</td><td>${esc(m.name)}</td><td>${m.id}</td><td class="c">${b2(m.id === u.id ? app.bed : m.bed)}</td><td class="c">${m.id === u.id && u.room !== r.code ? badge('Chờ nhận', 'orange', { sm: true }) : badge('Đang ở', 'green', { sm: true })}</td></tr>`).join('')}</tbody></table></div>
            <h3 style="font-size:17px;margin-top:16px">Lịch sử xử lý hồ sơ</h3>
            <div class="tl" style="margin-top:10px;font-size:13px">${app.history.map((h) => `<div class="tl-i" style="grid-template-columns:28px 150px 104px 1fr;gap:10px;padding-bottom:12px"><span class="tl-dot">${ic('check')}</span><b style="color:var(--navy)">${h.t}</b><small class="muted">${h.d}</small><small class="muted">${h.s}</small></div>`).join('')}
              ${app.status === 'da-duyet' ? `<div class="tl-i" style="grid-template-columns:28px 150px 104px 1fr;gap:10px;padding-bottom:12px"><span class="tl-dot ${conf ? '' : 'red'}">${conf ? ic('check') : '3'}</span><b style="color:${conf ? 'var(--navy)' : 'var(--red)'}">${conf ? 'Đã xác nhận thỏa thuận' : 'Chờ xác nhận thỏa thuận'}</b><small class="muted">${conf ? app.confirmedAt : 'Hôm nay'}</small><small class="muted">${conf ? 'Bạn đã xác nhận nội dung thỏa thuận lưu trú.' : 'Vui lòng đọc nội dung thỏa thuận và xác nhận để hoàn tất thủ tục.'}</small></div>
              <div class="tl-i" style="grid-template-columns:28px 150px 104px 1fr;gap:10px;padding-bottom:12px"><span class="tl-dot todo" style="box-shadow:none;background:#fff;color:var(--muted);font-weight:600;display:grid;place-items:center">4</span><b style="color:var(--navy)">Nhận phòng</b><small class="muted">Dự kiến từ 01/10/2026</small><small class="muted">Sau khi xác nhận, bạn sẽ nhận phòng theo lịch.</small></div>` : ''}</div>
            ${app.status === 'da-duyet' ? `<div style="display:flex;align-items:center;gap:10px;border-top:1px solid var(--line);margin:4px -16px 0;padding:12px 16px;flex-wrap:wrap">
              <label class="check" style="font-size:11.5px;flex:1;min-width:150px;line-height:1.35"><input type="checkbox" id="cf-ok" ${conf ? 'checked disabled' : 'checked'}>Tôi đã đọc nội dung thỏa thuận và đồng ý tuân thủ các quy định trên.</label>
              <button class="btn btn-red" id="cf-go" ${conf ? 'disabled' : ''}>${conf ? 'Đã xác nhận' : 'Xác nhận lưu trú'} ${conf ? '' : ic('arrow-right')}</button><button class="btn btn-outline" id="cf-help">${ic('headphones')}Liên hệ hỗ trợ</button></div>` : '<div style="height:14px"></div>'}
          </div></div>`);
    },
    mount: (root) => {
      const go = root.querySelector('#cf-go');
      if (go) go.onclick = () => {
        if (!root.querySelector('#cf-ok').checked) return App.toast('Vui lòng tích xác nhận đã đọc thỏa thuận', 'err');
        const app = myApp(); app.confirmed = true; app.confirmedAt = K.now(); K.save(); App.toast('Đã xác nhận thỏa thuận lưu trú'); App.refresh();
      };
      const h = root.querySelector('#cf-help'); if (h) h.onclick = App.contact;
    },
  };

  // ============ 11. Hóa đơn ============
  P['sv-hoa-don'] = {
    role: 'student', title: 'Hóa đơn của tôi',
    render: () => {
      const o = { active: 'sv-hoa-don', logo: 'inline', notif: 'count', search: 'Tìm kiếm hóa đơn, kỳ thanh toán...', sbw: 285, icons: { 'sv-phong': 'users', 'sv-ho-tro': 'headphones', 'sv-tai-khoan': 'settings' } };
      const st = App.state('inv', { tab: 'all', period: '', q: '', sort: 'period', dir: -1 });
      const all = myInvoices();
      const unpaid = all.filter((i) => i.status === 'chua-tt');
      const paid = all.filter((i) => i.status === 'da-tt');
      const waiting = all.filter((i) => i.status !== 'da-tt');
      let list = st.tab === 'unpaid' ? all.filter((i) => i.status !== 'da-tt') : st.tab === 'paid' ? paid : all.slice();
      if (st.period) list = list.filter((i) => i.period === st.period);
      if (st.q) { const q = st.q.toLowerCase(); list = list.filter((i) => (i.id + ' tiền phòng ký túc xá ' + i.period + ' ' + i.room).toLowerCase().includes(q)); }
      const key = { period: (i) => i.period.split('/').reverse().join(''), id: (i) => i.id, total: (i) => i.total, status: (i) => i.status };
      list.sort((a, b) => (key[st.sort](a) > key[st.sort](b) ? 1 : -1) * st.dir);
      const th = (k, t) => `<th data-sort="${k}" style="cursor:pointer">${t} <span style="color:#8fa0bd">${ic('chevrons-up-down')}</span></th>`;
      return shell(o, `${App.phead({ art: 'banner_invoice', h: 168, crumb: [['Trang chủ', 'sv-tong-quan'], ['Hóa đơn', 'sv-hoa-don'], 'Hóa đơn của tôi'], title: 'Hóa đơn của tôi', desc: 'Xem danh sách hóa đơn, tình trạng thanh toán và công nợ ký túc xá.' })}
        <div class="card grid g3" style="padding:14px 16px;gap:16px;margin-top:-6px">
          <div class="stat pink">${im('st_due', 'blend')}<div><div class="lbl2">Cần thanh toán</div><div class="val" style="color:var(--red)">${money(unpaid.reduce((s, i) => s + i.total, 0))}</div></div></div>
          <div class="stat blue">${im('st_paid', 'blend')}<div><div class="lbl2">Đã thanh toán</div><div class="val">${money(paid.reduce((s, i) => s + i.total, 0))}</div></div></div>
          <div class="stat cream">${im('st_wait', 'blend')}<div><div class="lbl2">Hóa đơn chờ</div><div class="val">${waiting.length}</div></div></div></div>
        <div class="card" style="padding:14px 0 0;overflow:hidden">
          <div style="display:flex;gap:14px;align-items:center;padding:0 14px 12px;flex-wrap:wrap">
            <div class="seg" style="padding:3px">${[['all', 'Tất cả (' + all.length + ')'], ['unpaid', 'Chưa thanh toán (' + waiting.length + ')'], ['paid', 'Đã thanh toán (' + paid.length + ')']].map(([k, t]) => `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}" style="height:44px">${t}</button>`).join('')}</div>
            <div class="iwrap" style="width:164px">${ic('calendar-days')}${sel('i-period', [['', 'Tất cả kỳ'], ...[...new Set(all.map((i) => i.period))]], st.period)}</div>
            <div class="iwrap" style="flex:1;min-width:200px">${ic('search')}<input id="i-q" class="input" placeholder="Tìm theo mã hóa đơn, nội dung..." value="${esc(st.q)}"></div>
            <button class="btn btn-outline" id="i-dl" style="color:var(--blue-700)">${ic('download')}Tải danh sách</button></div>
          <div style="overflow-x:auto;padding:0 14px"><table class="tbl" style="border:1px solid var(--line-2);border-radius:10px;overflow:hidden"><thead><tr>${th('period', 'Kỳ')}${th('id', 'Mã hóa đơn')}<th>Nội dung</th>${th('total', 'Số tiền')}${th('status', 'Trạng thái')}<th>Thao tác</th></tr></thead><tbody>
            ${list.map((i) => `<tr><td><b style="color:var(--navy);font-size:16px">${i.period}</b></td><td>${i.id}</td><td>Tiền phòng ký túc xá (${i.period})<div class="muted small">Phòng ${i.room} - Tầng ${i.khu}</div></td><td><b style="color:var(--navy);font-size:16px">${money(i.total)}</b></td><td>${App.statusBadge(i.status)}</td><td>${i.status === 'chua-tt' ? `<button class="btn btn-red btn-sm btn-block" data-go="sv-thanh-toan-${i.id}">Thanh toán</button>` : i.status === 'cho-doi-soat' ? `<button class="btn btn-soft btn-sm btn-block" data-go="sv-thanh-toan-${i.id}">Xem giao dịch</button>` : `<button class="btn btn-outline btn-sm btn-block" data-receipt="${i.id}" style="color:var(--blue-700)">Xem biên nhận</button>`}</td></tr>`).join('') || `<tr><td colspan="6" class="muted" style="text-align:center;padding:26px">Không có hóa đơn phù hợp.</td></tr>`}</tbody></table></div>
          <div style="height:14px"></div></div>
        <div class="card resp-1" style="display:grid;grid-template-columns:400px 1fr;align-items:center;background:#eaf3fd;padding:4px 26px;border-color:#dbe8f9">${im('invoice_promo', 'blend')}<div style="border-left:2px solid #c9dbf3;padding-left:26px"><h3 style="font-size:23px">Xem chi tiết để kiểm tra từng khoản thu.</h3><p style="margin-top:10px;font-size:15.5px;line-height:1.6;color:var(--text)">Mỗi hóa đơn bao gồm tiền phòng và các khoản dịch vụ đi kèm (điện, nước...).<br>Bạn có thể xem chi tiết nội dung, tải biên nhận và thanh toán trực tuyến.</p></div></div>`);
    },
    mount: (root) => {
      const st = App.st.inv;
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      root.querySelectorAll('[data-sort]').forEach((b) => b.onclick = () => { if (st.sort === b.dataset.sort) st.dir *= -1; else { st.sort = b.dataset.sort; st.dir = -1; } App.refresh(); });
      root.querySelector('#i-period').onchange = (e) => { st.period = e.target.value; App.refresh(); };
      const q = root.querySelector('#i-q'); q.onchange = () => { st.q = q.value.trim(); App.refresh(); };
      root.querySelector('#i-dl').onclick = () => App.toast('Danh sách hóa đơn đã được gửi tới email ' + K.me().email);
      root.querySelectorAll('[data-receipt]').forEach((b) => b.onclick = () => App.receipt(b.dataset.receipt));
    },
  };
  App.receipt = (id) => {
    const i = K.db.invoices.find((x) => x.id === id); const s = K.student(i.student);
    App.modal({ title: 'Biên nhận thanh toán', body: `<div style="border:1px dashed #b6cbe8;border-radius:12px;padding:18px 20px"><div style="display:flex;justify-content:space-between"><b style="color:var(--navy)">Ký túc xá ĐH Nghệ An</b>${badge('Đã thanh toán', 'green', { dot: true, sm: true })}</div>
      <dl class="kv" style="margin-top:14px;grid-template-columns:150px 1fr"><dt>Mã hóa đơn</dt><dd>${i.id}</dd><dt>Sinh viên</dt><dd>${esc(s.name)} (${s.id})</dd><dt>Phòng</dt><dd>${i.room} · Tầng ${i.khu}</dd><dt>Kỳ</dt><dd>${i.period}</dd><dt>Mã giao dịch</dt><dd>${i.txn || '—'}</dd><dt>Thời gian</dt><dd>${i.paidAt || '—'}</dd></dl>
      <table class="tbl compact" style="margin-top:12px">${i.items.map((x) => `<tr><td>${x.name}</td><td class="r">${money(x.amount)}</td></tr>`).join('')}<tr><td><b>Tổng cộng</b></td><td class="r"><b style="color:var(--red)">${money(i.total)}</b></td></tr></table></div>`,
      foot: `<button class="btn btn-outline" data-toast2>${ic('download')}Tải biên nhận</button><button class="btn btn-red" data-x>Đóng</button>`, onMount: (el) => el.querySelector('[data-toast2]').onclick = () => App.toast('Biên nhận đã được gửi tới email ' + s.email) });
  };

  // ============ 12. Thanh toán ============
  P['sv-thanh-toan'] = {
    role: 'student', title: 'Thanh toán hóa đơn',
    render: (id) => {
      const u = K.me();
      const o = { active: 'sv-hoa-don', logo: 'stack', notif: 'after', search: 'Tìm kiếm phòng, hóa đơn, thông báo...', sbw: 252, icons: { 'sv-phong': 'house', 'sv-hoa-don': 'receipt-text' } };
      const inv = K.db.invoices.find((x) => x.id === id && x.student === u.id) || myInvoices()[0];
      if (!inv) return shell(o, '<div class="card pad">Không tìm thấy hóa đơn.</div>');
      const st = App.state('pay-' + inv.id, { method: 'bank', wallet: 'MoMo' });
      const r = K.room(inv.room);
      const head = inv.status === 'chua-tt' ? `<span class="badge" style="background:#ffeec9;color:#d97a00;font-size:20px;padding:9px 20px;gap:12px;font-weight:600"><span style="width:28px;height:28px;border-radius:50%;background:#f39a0b;color:#fff;display:grid;place-items:center;font-weight:800">!</span>Chưa thanh toán</span>` : inv.status === 'cho-doi-soat' ? badge('Chờ đối soát', 'orange', { icon: 'clock' }) : badge('Đã thanh toán', 'green', { icon: 'circle-check' });
      const methods = [['bank', 'Chuyển khoản', 'pm_bank'], ['wallet', 'Ví điện tử', 'pm_wallet'], ['counter', 'Tại quầy', 'pm_counter']];
      let panel;
      if (inv.status !== 'chua-tt') panel = `<div class="card" style="box-shadow:none;padding:22px;text-align:center">${inv.status === 'da-tt' ? `<span style="color:var(--green)">${ic('circle-check')}</span><h3 style="margin-top:6px">Hóa đơn đã được thanh toán</h3><p class="muted" style="margin-top:6px">Mã giao dịch ${inv.txn || '—'} · ${inv.paidAt || ''}</p><button class="btn btn-outline" style="margin-top:16px" data-rcpt>Xem biên nhận</button>` : `<span style="color:var(--orange)">${ic('clock')}</span><h3 style="margin-top:6px">Đã ghi nhận giao dịch, đang chờ đối soát</h3><p class="muted" style="margin-top:6px;line-height:1.6">Mã giao dịch <b>${inv.txn}</b> lúc ${inv.paidAt}. Trạng thái sẽ chuyển sang “Đã thanh toán” sau khi nhà trường đối soát.</p>`}</div>`;
      else if (st.method === 'bank') panel = `<div class="card" style="box-shadow:none;padding:14px 18px 18px"><h3 style="font-size:18px">Thanh toán bằng chuyển khoản</h3>
          <div style="display:grid;grid-template-columns:186px 1fr;gap:14px;margin-top:14px" class="resp-1"><div style="border:1px solid var(--line);border-radius:12px;padding:0;overflow:hidden">${im('qr', '', 'Mã QR mẫu')}</div>
          <div style="display:flex;flex-direction:column;gap:10px"><div style="background:#eaf2fd;border-radius:10px;padding:12px 16px;display:flex;gap:12px;font-size:13.5px;color:var(--ink)"><span style="color:var(--blue)">${ic('info')}</span>Trạng thái sẽ được cập nhật sau khi đối soát thanh toán của nhà trường.</div>
          <div style="border:1px solid var(--line);border-radius:10px">
            <div class="row" style="justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--line-2)"><span class="small muted">Số tiền thanh toán</span><b style="color:var(--red);font-size:21px">${money(inv.total)}</b><button class="xbtn" data-copy="${inv.total}" aria-label="Sao chép số tiền" style="color:var(--blue)">${ic('copy')}</button></div>
            <div class="row" style="justify-content:space-between;padding:12px 14px"><span class="small muted">Nội dung chuyển khoản</span><b style="color:var(--navy)">${inv.id}</b><button class="xbtn" data-copy="${inv.id}" aria-label="Sao chép nội dung" style="color:var(--blue)">${ic('copy')}</button></div></div>
          <small class="muted">Ngân hàng: Vietcombank · STK 0101 0000 2026 · Chủ TK: Ký túc xá ĐH Nghệ An</small></div></div></div>`;
      else if (st.method === 'wallet') panel = `<div class="card" style="box-shadow:none;padding:16px 18px"><h3 style="font-size:18px">Thanh toán bằng ví điện tử</h3><p class="muted small" style="margin-top:6px">Chọn ví để thanh toán ${money(inv.total)} cho hóa đơn ${inv.id}.</p><div class="pills" style="margin-top:14px">${['MoMo', 'ZaloPay', 'VNPay', 'ShopeePay'].map((w) => `<button class="pill ${st.wallet === w ? 'on' : ''}" data-wallet="${w}">${ic('wallet')}${w}</button>`).join('')}</div><div style="background:#eaf2fd;border-radius:10px;padding:12px 16px;margin-top:16px;font-size:13.5px;color:var(--ink)">Sau khi bấm “Kiểm tra thanh toán”, hệ thống ghi nhận giao dịch qua ${st.wallet} và chuyển sang chờ đối soát.</div></div>`;
      else panel = `<div class="card" style="box-shadow:none;padding:16px 18px"><h3 style="font-size:18px">Thanh toán tại quầy</h3><div class="info-list lined" style="margin-top:10px"><div>${ic('map-pin')}<span>Địa điểm</span><b>Quầy tiếp nhận, tầng 1</b></div><div>${ic('clock')}<span>Thời gian</span><b>7:30 – 17:00, Thứ Hai – Thứ Bảy</b></div><div>${ic('file-text')}<span>Mang theo</span><b>Thẻ sinh viên, mã ${inv.id}</b></div></div><p class="muted small" style="margin-top:10px">Bấm “Kiểm tra thanh toán” để đặt lịch nộp tiền tại quầy.</p></div>`;
      return shell(o, `${App.phead({ art: 'banner_pay', h: 186, crumb: ['home', ['Hóa đơn', 'sv-hoa-don'], inv.id], title: 'Thanh toán hóa đơn' + ' ' + head, desc: inv.status === 'chua-tt' ? 'Vui lòng thanh toán <b style="color:var(--navy)">đúng hạn</b> để đảm bảo quyền lợi lưu trú của bạn.' : 'Thông tin thanh toán của hóa đơn ' + inv.id + '.' })}
        <div class="grid resp-1" style="grid-template-columns:1fr 1.15fr;gap:12px;align-items:start;margin-top:-10px">
          <div class="card pad" style="padding:20px 22px">
            <div class="card-h"><h2 class="card-t" style="font-size:20px"><span class="ic-box" style="width:52px;height:52px;background:#eef3fa">${ic('file-text')}</span>Thông tin hóa đơn</h2><button class="btn btn-soft" data-toast="Hóa đơn ${inv.id} đã được gửi tới email ${esc(u.email)}" style="color:var(--navy)">${ic('download')}Tải hóa đơn</button></div>
            <div style="background:#f2f6fc;border-radius:12px;padding:16px 22px;display:grid;grid-template-columns:repeat(4,auto);gap:14px 22px;font-size:14px" class="muted">
              <div style="grid-column:span 2">Mã hóa đơn<b style="display:block;color:var(--navy);font-size:17px;margin-top:4px">${inv.id}</b></div><div style="grid-column:span 2">Tháng thanh toán<b style="display:block;color:var(--navy);font-size:17px;margin-top:4px">${inv.period}</b></div>
              <div>Sinh viên<b style="display:block;color:var(--navy);font-size:16px;margin-top:4px">${esc(u.name)} (${u.id})</b></div><div>Phòng<b style="display:block;color:var(--navy);font-size:16px;margin-top:4px">${inv.room}</b></div><div>Tòa<b style="display:block;color:var(--navy);font-size:16px;margin-top:4px">Tầng ${inv.khu}</b></div><div>Số người trong phòng<b style="display:block;color:var(--navy);font-size:16px;margin-top:4px">${K.occCount(inv.room)} người (${r.beds} giường)</b></div></div>
            <hr class="hr" style="margin:20px 0"><h3 style="font-size:18px;margin-bottom:12px">Chi tiết khoản thu</h3>
            <div class="tbl-wrap"><table class="tbl" style="font-size:14px"><thead><tr><th>STT</th><th>Nội dung</th><th class="r">Số tiền</th></tr></thead><tbody>${inv.items.map((x, i) => `<tr><td class="c" style="width:60px">${i + 1}</td><td>${x.name}</td><td class="r"><b>${money(x.amount)}</b></td></tr>`).join('')}</tbody></table></div>
            <div style="display:flex;justify-content:space-between;align-items:center;background:#eaf2fd;border-radius:10px;padding:18px 18px;margin-top:14px"><b style="color:var(--navy);font-size:18px">Tổng thanh toán</b><b style="color:var(--red);font-size:28px">${money(inv.total)}</b></div></div>
          <div class="card pad" style="padding:20px 22px">
            <h2 class="card-t" style="font-size:20px;margin-bottom:16px"><span class="ic-box" style="width:52px;height:52px;background:#eef3fa">${ic('credit-card')}</span>Chọn phương thức thanh toán</h2>
            <div class="grid g3" style="gap:10px">${methods.map(([k, t, img]) => `<button class="card" data-method="${k}" ${inv.status !== 'chua-tt' ? 'disabled' : ''} style="position:relative;box-shadow:none;padding:14px 8px 12px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;border:${st.method === k ? '2px solid var(--red);background:#fdf3f4' : '1.5px solid var(--line)'}">${im(img, 'blend', '')}<b style="color:${st.method === k ? 'var(--red)' : 'var(--navy)'};font-size:17px">${t}</b><span style="position:absolute;right:10px;top:10px;width:24px;height:24px;border-radius:50%;${st.method === k ? 'background:var(--red);color:#fff;display:grid;place-items:center' : 'border:1.5px solid #c0cbdc'}">${st.method === k ? ic('check') : ''}</span></button>`).join('')}</div>
            <div style="margin-top:16px">${panel}</div>
            ${inv.status === 'chua-tt' ? `<button class="btn btn-red btn-block btn-lg" id="pay-check" style="margin-top:20px">${ic('credit-card')}Kiểm tra thanh toán ${ic('arrow-right')}</button>` : ''}
            <button class="btn btn-outline btn-block btn-lg" data-go="sv-hoa-don" style="margin-top:12px;font-size:17px">${ic('arrow-left')}Quay lại hóa đơn</button></div></div>`);
    },
    mount: (root, id) => {
      const inv = K.db.invoices.find((x) => x.id === id) || myInvoices()[0];
      if (!inv) return;
      const st = App.st['pay-' + inv.id];
      root.querySelectorAll('[data-method]').forEach((b) => b.onclick = () => { st.method = b.dataset.method; App.refresh(); });
      root.querySelectorAll('[data-wallet]').forEach((b) => b.onclick = () => { st.wallet = b.dataset.wallet; App.refresh(); });
      root.querySelectorAll('[data-copy]').forEach((b) => b.onclick = () => { const t = b.dataset.copy; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => App.toast('Đã sao chép: ' + t)).catch(() => App.toast('Nội dung: ' + t)); });
      const rc = root.querySelector('[data-rcpt]'); if (rc) rc.onclick = () => App.receipt(inv.id);
      const pc = root.querySelector('#pay-check');
      if (pc) pc.onclick = () => {
        const label = st.method === 'bank' ? 'Tôi đã chuyển khoản ' + money(inv.total) + ' với nội dung ' + inv.id + '.' : st.method === 'wallet' ? 'Xác nhận thanh toán ' + money(inv.total) + ' qua ' + st.wallet + '.' : 'Đặt lịch nộp ' + money(inv.total) + ' tại quầy tiếp nhận.';
        App.confirm('Xác nhận thanh toán', label + '<br><span class="muted small">Giao dịch sẽ chuyển sang trạng thái chờ đối soát.</span>', 'Xác nhận', () => {
          inv.status = 'cho-doi-soat'; inv.txn = 'GD-0' + (30 + K.db.invoices.filter((i) => i.txn).length); inv.paidAt = K.now(); inv.method = st.method; inv.note = 'Thanh toán phí KTX tháng ' + inv.period;
          K.save(); App.toast('Đã ghi nhận giao dịch ' + inv.txn + '. Đang chờ đối soát.'); App.refresh();
        });
      };
    },
  };

  // ============ 13. Chi tiết yêu cầu sửa chữa ============
  P['sv-yeu-cau'] = {
    role: 'student', title: 'Chi tiết yêu cầu',
    render: (id) => {
      const u = K.me();
      const o = { active: 'sv-ho-tro', logo: 'stack', notif: 'none', search: 'Tìm dịch vụ, hóa đơn, thông báo...', foot: 'card-email', sbw: 232, icons: { 'sv-ho-tro': 'headphones', 'sv-phong': 'door-closed' } };
      const rq = K.db.repairs.find((x) => x.id === id && x.student === u.id) || myRepairs()[0];
      if (!rq) return shell(o, '<div class="card pad">Không tìm thấy yêu cầu.</div>');
      const order = ['moi', 'phan-cong', 'dang-xu-ly', 'hoan-tat'];
      const idx = order.indexOf(rq.status);
      const steps = rq.steps || [{ t: 'Đã tiếp nhận', d: rq.date, s: 'Yêu cầu của bạn đã được ghi nhận.' }, { t: 'Đã phân công', d: '', s: 'Chuyển đến bộ phận kỹ thuật.' }, { t: 'Đang sửa chữa', d: '', s: 'Kỹ thuật viên đang xử lý.' }, { t: 'Hoàn tất', d: '', s: 'Sẽ thông báo khi hoàn thành.' }];
      const msgs = rq.msgs && rq.msgs.length ? rq.msgs : [{ who: u.name, av: u.avatar, d: rq.date, m: rq.desc }];
      return shell(o, `${App.crumb([['Trang chủ', 'sv-tong-quan'], ['Hỗ trợ', 'sv-sua-chua'], 'Chi tiết yêu cầu'])}
        <div class="grid resp-1" style="grid-template-columns:1fr 480px;gap:14px;align-items:start;margin-top:-4px">
          <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
            <div class="card pad" style="padding:18px 20px"><h1 style="font-size:38px;font-weight:800;display:flex;align-items:center;gap:14px">${ic('file-text', 'ic-lg')}${esc(rq.title)}</h1>
              <div class="row" style="margin-top:14px;flex-wrap:wrap"><span class="badge b-red" style="font-size:17px;padding:8px 20px;border-radius:10px">${rq.id}</span><span class="badge" style="font-size:17px;padding:8px 18px;border-radius:10px;background:#e2eefd;color:var(--blue-700)">${ic(rq.status === 'hoan-tat' ? 'circle-check' : 'clock')}${{ moi: 'Đã tiếp nhận', 'phan-cong': 'Đã phân công', 'dang-xu-ly': 'Đang xử lý', 'hoan-tat': 'Hoàn tất' }[rq.status]}</span><span class="badge" style="font-size:17px;padding:8px 18px;border-radius:10px;background:#eef3fa;color:var(--navy)">${ic('map-pin')}${esc(rq.loc)}</span></div></div>
            <div class="card pad" style="padding:18px 20px"><h2 class="card-t" style="font-size:20px">${ic('file-text')}Thông tin yêu cầu</h2>
              <div style="display:grid;grid-template-columns:1fr 222px;gap:16px;margin-top:12px" class="resp-1"><dl class="kv" style="grid-template-columns:134px 1fr;font-size:15px;gap:10px"><dt style="color:var(--ink)">Mã yêu cầu</dt><dd style="font-weight:400">${rq.id}</dd><dt style="color:var(--ink)">Danh mục</dt><dd style="font-weight:400">${esc(rq.category)}</dd><dt style="color:var(--ink)">Vị trí</dt><dd style="font-weight:400">${esc(rq.loc)} · Tầng ${K.fl(rq.room)}</dd><dt style="color:var(--ink)">Thời gian gửi</dt><dd style="font-weight:400">${rq.date}</dd><dt style="color:var(--ink)">Mô tả sự cố</dt><dd style="font-weight:400;line-height:1.5">${esc(rq.desc)}</dd></dl>
              ${rq.photo ? `<img src="${K.A(rq.photo)}" style="width:100%;height:210px;object-fit:cover;border-radius:10px" alt="Ảnh sự cố">` : `<div class="drop" style="height:210px;flex-direction:column">${ic('image')}<span>Chưa có ảnh minh họa</span></div>`}</div></div>
            <div class="card pad" style="padding:18px 20px"><h2 class="card-t" style="font-size:20px">${ic('message-square-more')}Trao đổi xử lý</h2>
              <div style="display:flex;flex-direction:column;gap:14px;margin-top:16px" id="chat">${msgs.map((m) => `<div style="display:grid;grid-template-columns:68px 172px 1fr;gap:10px;align-items:start" class="resp-1">${av(m.av, 64)}<div style="padding-top:6px"><b style="color:var(--navy);font-size:15.5px">${esc(m.who)}</b><div class="muted small">${m.d}</div></div><div style="background:#eef3f9;border-radius:10px;padding:12px 16px;font-size:14.5px;line-height:1.55;color:var(--ink);white-space:pre-line">${esc(m.m)}</div></div>`).join('')}</div>
              <form class="row" id="chat-f" style="margin-top:18px"><label class="xbtn" style="border:1px solid var(--line);width:50px;height:50px;border-radius:12px;justify-content:center;align-items:center;cursor:pointer;position:relative">${ic('paperclip')}<input type="file" id="chat-file" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label><input id="chat-in" class="input" placeholder="Nhập nội dung trao đổi..." style="height:52px;flex:1"><button class="btn btn-red" style="width:64px;height:52px;padding:0" aria-label="Gửi">${ic('send')}</button></form></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="card pad" style="padding:20px 24px"><h2 class="card-t" style="font-size:20px;margin-bottom:16px">${ic('clock')}Tiến độ xử lý</h2>
              <div class="tl">${steps.map((s, i) => `<div class="tl-i" style="grid-template-columns:30px 1fr;gap:16px"><span class="tl-dot ${i < idx || (i === idx && rq.status === 'hoan-tat') ? '' : i === idx ? 'cur' : 'todo'}">${i < idx || (i === idx && rq.status === 'hoan-tat') ? ic('check') : ''}</span><div><div class="tl-t" style="font-size:17px;color:${i > idx ? 'var(--muted)' : 'var(--navy)'}">${s.t}</div>${s.d && i <= idx ? `<div class="tl-s">${s.d}</div>` : ''}<div class="tl-s">${i === 3 && rq.status === 'hoan-tat' ? 'Đã hoàn thành sửa chữa.' : s.s}</div></div></div>`).join('')}</div></div>
            ${App.repairRating(rq)}<div class="card" style="padding:18px 24px 0;overflow:hidden"><h2 class="card-t" style="font-size:20px">${ic('wrench')}Bộ phận kỹ thuật</h2>
              <div class="row" style="gap:20px;margin-top:12px">${av('av_tech_team', 96)}<div><b style="color:var(--navy)">${rq.staff ? 'Đội kỹ thuật KTX · ' + esc(rq.staff) : 'Đội kỹ thuật KTX'}</b><p class="muted" style="margin-top:6px;font-size:14.5px;line-height:1.5">Phụ trách sửa chữa thiết bị điện, nước tại khu lưu trú sinh viên.</p></div></div>
              <div style="background:#eef4fc;border-radius:12px;padding:14px 18px;margin-top:12px;display:flex;gap:18px;align-items:center">${ic('calendar-days', 'ic-lg')}<div><b style="color:var(--navy)">Lịch xử lý dự kiến</b><div class="row" style="gap:8px;margin-top:6px;color:var(--ink)">${ic('calendar')}${rq.schedule || 'Đang sắp xếp lịch'}</div></div></div>
              <button class="btn btn-outline btn-block" id="add-info" style="margin-top:12px;border-radius:999px;color:var(--blue-700)">${ic('file-pen-line')}Bổ sung thông tin</button>
              <img src="${K.A('tech_art')}" style="margin:14px -24px 0;width:calc(100% + 48px);max-width:none;height:166px;object-fit:cover" alt=""></div>
          </div></div>`);
    },
    mount: (root, id) => {
      const u = K.me();
      const rq = K.db.repairs.find((x) => x.id === id && x.student === u.id) || myRepairs()[0];
      if (!rq) return;
      const send = (text) => { rq.msgs = rq.msgs && rq.msgs.length ? rq.msgs : [{ who: u.name, av: u.avatar, d: rq.date, m: rq.desc }]; rq.msgs.push({ who: u.name, av: u.avatar, d: K.now(), m: text }); K.save(); App.refresh(); };
      root.querySelector('#chat-f').onsubmit = (e) => { e.preventDefault(); const v = root.querySelector('#chat-in').value.trim(); const f = root.querySelector('#chat-file').files[0]; if (!v && !f) return; send((v || '') + (f ? (v ? '\n' : '') + '📎 ' + f.name : '')); };
      App.bindRepairRating(root, rq);
      root.querySelector('#add-info').onclick = () => App.modal({ title: 'Bổ sung thông tin', body: `<div class="field"><label for="ai-t">Nội dung bổ sung</label><textarea id="ai-t" class="textarea" placeholder="Ví dụ: thời gian bạn có mặt tại phòng, tình trạng mới của sự cố..."></textarea></div>`, foot: `<button class="btn btn-outline" data-x>Hủy</button><button class="btn btn-red" data-ok>Gửi bổ sung</button>`, onMount: (el, close) => el.querySelector('[data-ok]').onclick = () => { const v = el.querySelector('#ai-t').value.trim(); if (!v) return App.toast('Vui lòng nhập nội dung', 'err'); close(); send('[Bổ sung] ' + v); App.toast('Đã gửi thông tin bổ sung'); } });
    },
  };

  // ============ 14. Trung tâm yêu cầu sửa chữa ============
  P['sv-sua-chua'] = {
    role: 'student', title: 'Yêu cầu sửa chữa',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-tro', logo: 'inline', notif: 'after', search: 'Tìm dịch vụ, thông báo, hướng dẫn...', foot: 'card-email', sbw: 270 };
      const st = App.state('repairs', { tab: 'all', prio: 'normal', title: '', desc: '', loc: u.room ? 'Phòng ' + u.room : '', kind: '' });
      const all = myRepairs();
      const doing = all.filter((r) => r.status === 'dang-xu-ly' || r.status === 'phan-cong');
      const done = all.filter((r) => r.status === 'hoan-tat');
      const list = st.tab === 'doing' ? doing : st.tab === 'done' ? done : all;
      const icon = { bulb: 'ri_bulb', faucet: 'ri_faucet', socket: 'ri_socket' };
      const kinds = [['', 'Chọn loại sự cố'], ['Thiết bị điện|bulb', 'Thiết bị điện'], ['Hệ thống nước|faucet', 'Hệ thống nước'], ['Ổ cắm, công tắc|socket', 'Ổ cắm, công tắc'], ['Điều hòa, quạt|bulb', 'Điều hòa, quạt'], ['Đồ dùng phòng|socket', 'Đồ dùng phòng'], ['Khóa cửa|socket', 'Khóa cửa']];
      const locs = u.room ? ['Phòng ' + u.room, 'Phòng tắm ' + u.room, 'Hành lang tầng ' + K.room(u.room).floor, 'Khu vực chung tầng ' + K.room(u.room).floor] : ['Khu vực chung'];
      return shell(o, `<div class="phead" style="min-height:182px;margin-top:-10px"><img class="art" src="${K.A('banner_repair')}" alt="" style="max-width:48%;right:-30px;top:0;height:100%;border-radius:0 0 0 12px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%);mask-image:linear-gradient(90deg,transparent,#000 8%)">${App.crumb([['Trang chủ', 'sv-tong-quan'], ['Hỗ trợ', 'sv-ho-tro'], 'Yêu cầu sửa chữa'])}
          <div class="row" style="gap:22px;margin-top:10px">${im('ic_wrench_big', 'blend', '')}<div><h1 style="font-size:46px">Yêu cầu sửa chữa</h1><p class="desc" style="margin-top:2px">Tạo và theo dõi các yêu cầu sửa chữa, bảo trì trong khu ký túc xá.</p></div></div></div>
        <div class="grid resp-1" style="grid-template-columns:1.07fr 1fr;gap:18px;align-items:start">
          <div class="card pad" style="padding:22px 14px 14px"><h2 style="font-size:25px;padding:0 10px">Danh sách yêu cầu của tôi</h2>
            <div class="pills" style="margin:14px 0 16px;padding:0 4px">${[['all', 'Tất cả (' + all.length + ')'], ['doing', 'Đang xử lý (' + doing.length + ')'], ['done', 'Hoàn tất (' + done.length + ')']].map(([k, t]) => `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}" style="min-width:150px;justify-content:center;border-radius:12px;${st.tab === k ? '' : 'background:#eaf2fd;border-color:#eaf2fd'}">${t}</button>`).join('')}</div>
            <div style="display:flex;flex-direction:column;gap:14px">${list.map((r) => `<div class="card" style="box-shadow:none;padding:14px 18px 12px;border:1px solid var(--line)"><div style="display:grid;grid-template-columns:92px 1fr auto;gap:16px">${im(icon[r.icon] || 'ri_socket', 'blend', '')}<div><b style="color:var(--navy);font-size:18px">${esc(r.title)}</b><p class="muted" style="font-size:14.5px;margin-top:6px;line-height:1.5">${esc(r.summary || (r.desc.length > 90 ? r.desc.slice(0, 90) + '…' : r.desc))}</p></div><div>${r.status === 'dang-xu-ly' || r.status === 'phan-cong' ? `<span class="badge b-orange" style="border:1px solid #f7d899;border-radius:8px">${ic('clock')}Đang xử lý</span>` : r.status === 'hoan-tat' ? `<span class="badge b-green" style="border-radius:8px">${ic('circle-check')}Hoàn tất</span>` : `<span class="badge b-blue" style="border-radius:8px">${ic('hourglass')}Đã tiếp nhận</span>`}</div></div>
              <div class="row" style="margin-top:12px;font-size:14px;color:var(--text);gap:10px;flex-wrap:wrap">${ic('map-pin')}Phòng ${r.room}<span style="color:#c5cfdf">|</span>${ic('calendar-days')}${r.date.slice(0, 10)}<span style="color:#c5cfdf">|</span><span>${r.code}</span><a href="#" class="link" style="margin-left:auto;font-size:15px" data-go="sv-yeu-cau-${r.id}">Xem chi tiết ${ic('arrow-right')}</a></div></div>`).join('') || '<p class="muted" style="padding:20px;text-align:center">Chưa có yêu cầu nào.</p>'}</div></div>
          <form class="card pad" id="rq-f" novalidate style="padding:22px 22px">
            <div class="row" style="gap:18px;align-items:flex-start">${im('ic_doc_red', 'blend', '')}<div><h2 style="font-size:25px">Tạo yêu cầu mới</h2><p class="muted" style="font-size:15px;margin-top:4px;color:var(--text)">Điền thông tin chi tiết để bộ phận kỹ thuật hỗ trợ bạn nhanh chóng.</p></div></div>
            <div style="display:grid;grid-template-columns:160px 1fr;gap:14px 10px;align-items:center;margin-top:16px">
              <label class="lbl" for="rq-loc">Vị trí <span class="req">*</span></label><div class="iwrap">${ic('map-pin')}${sel('rq-loc', locs, st.loc)}</div>
              <label class="lbl" for="rq-kind">Loại sự cố <span class="req">*</span></label><div class="iwrap">${ic('wrench')}${sel('rq-kind', kinds, st.kind)}</div></div>
            <div class="field" style="margin-top:14px"><label for="rq-title">Tiêu đề <span class="req">*</span></label><input id="rq-title" class="input" placeholder="Nhập tiêu đề ngắn gọn cho yêu cầu..." value="${esc(st.title)}" maxlength="80"></div>
            <div class="field" style="margin-top:14px"><label for="rq-desc">Mô tả sự cố <span class="req">*</span></label><div style="position:relative"><textarea id="rq-desc" class="textarea" data-max="500" placeholder="Mô tả chi tiết tình trạng, thời điểm xảy ra và các thông tin liên quan..." style="min-height:104px">${esc(st.desc)}</textarea><span class="counter">0/500</span></div></div>
            <div class="grid g2" style="gap:24px;margin-top:16px"><div class="field"><span class="lbl">Thêm ảnh minh họa <span class="muted" style="font-weight:400">(tùy chọn)</span></span><div><label class="drop" style="flex-direction:column;padding:14px;gap:6px"><span class="row" style="gap:14px"><span class="dz-ic">${ic('image')}</span><span style="color:var(--ink)">Nhấp để tải ảnh lên<br>hoặc kéo thả vào đây</span></span><small style="font-size:12.5px">JPG, PNG (tối đa 5 ảnh, mỗi ảnh 5MB)</small><input type="file" id="rq-img" accept="image/*" multiple></label></div></div>
              <div class="field"><span class="lbl">Mức độ ưu tiên <span class="req">*</span></span><label class="radio"><input type="radio" name="prio" value="normal" ${st.prio === 'normal' ? 'checked' : ''}><span><b style="font-weight:500">Bình thường</b><small class="muted" style="display:block">xử lý theo kế hoạch</small></span></label><label class="radio"><input type="radio" name="prio" value="urgent" ${st.prio === 'urgent' ? 'checked' : ''}><span><b style="font-weight:500">Cần xử lý sớm</b><small class="muted" style="display:block">ảnh hưởng đến sinh hoạt</small></span></label></div></div>
            <p class="err" id="rq-err" style="margin-top:10px" hidden></p>
            <button class="btn btn-red btn-block btn-lg" style="margin-top:18px;font-size:19px">${ic('send')}Gửi yêu cầu</button></form></div>`);
    },
    mount: (root) => {
      const st = App.st.repairs; const u = K.me();
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      root.querySelector('#rq-f').onsubmit = (e) => {
        e.preventDefault();
        const f = e.target; const err = f.querySelector('#rq-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        const loc = f.querySelector('#rq-loc').value, kind = f.querySelector('#rq-kind').value, title = f.querySelector('#rq-title').value.trim(), desc = f.querySelector('#rq-desc').value.trim(), prio = f.querySelector('[name=prio]:checked').value;
        if (!kind) return fail('Vui lòng chọn loại sự cố.');
        if (!title) return fail('Vui lòng nhập tiêu đề.');
        if (desc.length < 10) return fail('Mô tả sự cố cần tối thiểu 10 ký tự.');
        const [cat, icon] = kind.split('|');
        const n = Math.max(...K.db.repairs.map((r) => +r.id.slice(3))) + 1;
        const d = new Date(); const code = '#PX' + d.getFullYear() + b2(d.getMonth() + 1) + b2(d.getDate()) + '-' + String(n).padStart(3, '0');
        const room = u.room || 'A302';
        K.db.repairs.unshift({ id: 'SC-0' + n, code, title, short: title, desc, student: u.id, room, loc: loc.replace('Phòng tắm ', '').replace('Phòng ', '') + (loc.startsWith('Phòng tắm') ? ' · Phòng tắm' : u.bed ? ' · Giường ' + b2(u.bed) : ''), place: 'Tầng ' + K.room(room).floor, category: cat, kind: cat.split(',')[0], icon, prio: prio === 'urgent' ? 'Cao' : 'Trung bình', status: 'moi', date: K.now(), kdate: K.today(), staff: '', dept: 'Bộ phận kỹ thuật', schedule: '', msgs: [], steps: null });
        K.save(); App.st.repairs = null;
        App.toast('Đã gửi yêu cầu SC-0' + n + '. Bộ phận kỹ thuật sẽ tiếp nhận sớm.');
        App.refresh();
      };
    },
  };

  // ============ 15. Gia hạn ============
  P['sv-gia-han'] = {
    role: 'student', title: 'Gia hạn lưu trú',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-so', logo: 'inline', notif: 'dot', search: 'Tìm phòng, hóa đơn, thông báo...', sbw: 286, icons: { 'sv-hoa-don': 'receipt-text' } };
      if (!u.room) return noRoom(o);
      const r = K.room(u.room);
      const req = K.db.requests.extend;
      const st = App.state('extend', () => (K.db.drafts.extend ? Object.assign({}, K.db.drafts.extend) : { term: 'Học kỳ II · 2026 – 2027', note: '', agree: true }));
      const [from, to] = semMonths[st.term];
      const months = (() => { const [d1, m1, y1] = from.split('/').map(Number); const [d2, m2, y2] = to.split('/').map(Number); return (y2 - y1) * 12 + (m2 - m1) + 1; })();
      const sent = req && req.student === u.id;
      const step = sent ? (req.status === 'da-duyet' ? 3 : 2) : 1;
      return shell(o, `<div style="display:grid;grid-template-columns:1fr 540px;gap:16px;align-items:end" class="resp-1"><div>${App.crumb([['Trang chủ', 'sv-tong-quan'], ['Lưu trú', 'sv-ho-so'], 'Gia hạn lưu trú'])}<h1 style="font-size:46px;font-weight:800;margin-top:10px">Gia hạn lưu trú</h1><p class="desc" style="font-size:18px;color:#4a5a7e;margin:4px 0 14px">Đăng ký gia hạn thời gian lưu trú tại ký túc xá để tiếp tục ở phòng hiện tại.</p>${stayTabs('sv-gia-han')}</div><img src="${K.A('banner_extend')}" alt="" style="margin:-10px -30px -60px 0;width:calc(100% + 30px);max-width:none;height:250px;object-fit:cover;object-position:left;-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%);mask-image:linear-gradient(90deg,transparent,#000 10%)" class="hide-sm"></div>
        ${sent ? `<div class="card" style="padding:14px 20px;display:flex;gap:12px;align-items:center;background:${req.status === 'da-duyet' ? '#e9f8ee' : '#fff8ea'};border-color:${req.status === 'da-duyet' ? '#c7ecd3' : '#fbeccd'}">${ic(req.status === 'da-duyet' ? 'circle-check' : 'clock')}<span>Yêu cầu gia hạn <b>${esc(req.term)}</b> gửi lúc ${req.date} – <b>${req.status === 'da-duyet' ? 'đã được duyệt' : 'đang chờ Ban quản lý xét duyệt'}</b>.</span></div>` : ''}
        <div class="grid resp-1" style="grid-template-columns:1fr 1fr;gap:14px;align-items:start;position:relative;z-index:1">
          <form class="card pad" id="ex-f" novalidate style="padding:16px 20px 18px">
            <h2 class="card-t" style="font-size:22px"><span class="ic-box" style="width:40px;height:40px">${ic('calendar-days')}</span>Thông tin gia hạn</h2>
            <div style="background:#f0f5fc;border-radius:12px;padding:16px 18px;margin-top:14px;display:grid;grid-template-columns:auto 1fr 1.2fr;gap:20px;align-items:center" class="resp-1"><span class="ic-box" style="width:70px;height:70px;background:#dfeafb">${ic('bed-double', 'ic-lg')}</span><div style="border-right:1px solid var(--line);padding-right:14px"><small class="muted" style="font-size:14.5px">Phòng hiện tại</small><b style="display:block;color:var(--navy);font-size:19px;white-space:nowrap">${r.code} &nbsp;·&nbsp; Giường ${b2(u.bed)}</b></div><div><small class="muted" style="font-size:14.5px">Hợp đồng hiện tại</small> ${badge('Đang hiệu lực', 'green', { sm: true })}<b style="display:block;color:var(--navy);font-size:16px;margin-top:4px">Học kỳ I · 2026 – 2027</b><small class="muted">01/09/2026 – 31/01/2027</small></div></div>
            <div class="field" style="margin-top:16px"><label for="ex-term" style="font-weight:500">Học kỳ đăng ký gia hạn <span class="req">*</span></label><div class="iwrap">${ic('calendar-days')}${sel('ex-term', ['Học kỳ II · 2026 – 2027', 'Học kỳ I · 2027 – 2028'], st.term, '', sent ? 'disabled' : '')}</div></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:14px"><div class="field"><label style="font-weight:500">Thời gian lưu trú dự kiến <span class="req">*</span></label><div class="iwrap">${ic('calendar-days')}<input class="input" readonly value="${from} – ${to}"></div></div><div class="field"><label style="font-weight:500">Số tháng</label><input class="input ro" readonly value="${months} tháng" style="background:#eef1f5;color:var(--muted)"></div></div>
            <div class="field" style="margin-top:14px"><label for="ex-note" style="font-weight:500">Ghi chú <span class="muted" style="font-weight:400">(không bắt buộc)</span></label><div style="position:relative"><textarea id="ex-note" class="textarea" data-max="300" placeholder="Nhập ghi chú nếu có (ví dụ: nguyện vọng, thời gian dự kiến...)" ${sent ? 'disabled' : ''}>${esc(st.note)}</textarea><span class="counter">0/300</span></div></div>
            <div class="row" style="margin-top:16px;align-items:flex-start"><span class="ic-box" style="width:38px;height:38px;background:#eef3fa">${ic('paperclip')}</span><div><b style="color:var(--navy)">Giấy tờ bổ sung</b><div class="small muted">Tải lên các giấy tờ theo yêu cầu (nếu có). Hỗ trợ định dạng PDF, JPG, PNG (tối đa 5MB/tệp).</div></div></div>
            <div style="margin-top:10px"><label class="drop">${ic('upload')}<span><b>Chọn tệp</b> hoặc kéo thả tệp vào đây<br><small style="font-size:12px">Có thể chọn nhiều tệp cùng lúc</small></span><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png"></label></div>
            <label class="check" style="margin-top:14px;font-size:14px"><input type="checkbox" id="ex-agree" ${st.agree ? 'checked' : ''}>Tôi tiếp tục tuân thủ nội quy ký túc xá và cam kết cung cấp thông tin chính xác.</label>
          </form>
          <div class="card pad" style="padding:18px 20px">
            <div class="row" style="align-items:flex-start;gap:16px"><span class="ic-box" style="width:42px;height:42px;background:#eef3fa">${ic('clipboard-list')}</span><div><h2 style="font-size:23px">Giữ nguyên phòng hiện tại</h2><p class="muted" style="margin-top:4px;color:var(--text)">Bạn sẽ tiếp tục lưu trú tại phòng hiện tại nếu được phê duyệt.</p></div></div>
            <div style="background:#eef4fc;border-radius:12px;padding:14px 16px;margin-top:16px;display:grid;grid-template-columns:auto repeat(4,1fr);gap:0;align-items:center;text-align:center">${'<span class="ic-box" style="width:52px;height:52px;background:#fff">' + ic('bed-double') + '</span>'}${[['Phòng', r.code], ['Tầng', 'Tầng ' + r.khu], ['Giường', b2(u.bed)], ['Số người ở', K.occCount(r.code) + '/' + r.beds]].map(([a, b], i) => `<div style="${i ? 'border-left:1px solid var(--line)' : ''}"><small class="muted" style="font-size:14px">${a}</small><b style="display:block;color:var(--navy);font-size:18px">${b}</b></div>`).join('')}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px"><span class="row" style="gap:14px;font-size:18px;font-weight:700;color:var(--navy)"><span style="color:var(--red)">${ic('coins', 'ic-lg')}</span>Tiền phòng tham khảo</span><b style="color:var(--red);font-size:22px">${money(r.price)} <small style="font-size:17px">/ tháng</small></b></div>
            <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px"><div style="background:#f6f9fd;border-radius:8px;padding:10px 14px;display:flex;justify-content:space-between;font-size:14.5px"><span class="row" style="gap:12px"><span style="color:var(--red)">${ic('zap')}</span>Tiền điện (thu theo thực tế)</span><span>30.000đ / tháng</span></div><div style="background:#f6f9fd;border-radius:8px;padding:10px 14px;display:flex;justify-content:space-between;font-size:14.5px"><span class="row" style="gap:12px"><span style="color:var(--blue)">${ic('droplet')}</span>Tiền nước (thu theo thực tế)</span><span>20.000đ / tháng</span></div></div>
            <div style="background:#e3eefc;border-radius:10px;padding:14px 18px;display:flex;justify-content:space-between;margin-top:8px"><b style="color:var(--navy);font-size:17px;font-weight:600">Tổng tham khảo</b><b style="color:var(--navy);font-size:20px">${money(r.price + 50000)} / tháng</b></div>
            <h3 class="row" style="font-size:18px;margin-top:18px;gap:12px"><span style="color:var(--red)">${ic('settings')}</span>Quy trình xử lý yêu cầu</h3>
            <div style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:6px;align-items:start;margin-top:12px;text-align:center">${[['Gửi yêu cầu', 'Bạn gửi thông tin gia hạn lưu trú'], ['Ban quản lý xét duyệt', 'Kiểm tra thông tin và phê duyệt'], ['Cập nhật lưu trú', 'Kết quả được thông báo qua hệ thống']].map(([a, b], i) => `<div><span class="stepnum ${i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}" style="margin:0 auto;${i + 1 === step ? 'background:#fff;color:var(--red);border:2px solid var(--red);box-shadow:none' : ''}">${i + 1 < step ? ic('check') : i + 1}</span><b style="display:block;font-size:13.5px;color:${i + 1 === step ? 'var(--red)' : 'var(--navy)'};margin-top:6px">${a}</b><small class="muted" style="font-size:12.5px">${b}</small></div>${i < 2 ? `<span style="color:#9fb0c9;margin-top:10px">${ic('chevron-right')}</span>` : ''}`).join('')}</div>
            <div class="grid g2" style="gap:12px;margin-top:18px"><button class="btn btn-outline btn-lg" id="ex-draft" ${sent ? 'disabled' : ''} style="font-size:16px">${ic('file-text')}Lưu nháp</button><button class="btn btn-red btn-lg" id="ex-send" ${sent ? 'disabled' : ''} style="font-size:16px">${ic('send')}${sent ? 'Đã gửi yêu cầu' : 'Gửi yêu cầu gia hạn'}</button></div>
          </div></div>`);
    },
    mount: (root) => {
      const st = App.st.extend; const u = K.me();
      if (!u.room) return;
      const keep = () => { st.term = root.querySelector('#ex-term').value; st.note = root.querySelector('#ex-note').value; st.agree = root.querySelector('#ex-agree').checked; };
      const t = root.querySelector('#ex-term'); if (t) t.onchange = () => { keep(); App.refresh(); };
      const d = root.querySelector('#ex-draft'); if (d) d.onclick = () => { keep(); K.db.drafts.extend = Object.assign({}, st); K.save(); App.toast('Đã lưu nháp yêu cầu gia hạn'); };
      const s = root.querySelector('#ex-send'); if (s) s.onclick = () => {
        keep(); if (!st.agree) return App.toast('Vui lòng tích cam kết tuân thủ nội quy', 'err');
        K.db.requests.extend = { student: u.id, term: st.term, note: st.note, date: K.now(), status: 'cho-duyet' };
        K.db.applications.push({ id: 'HS2026-' + String(40 + K.db.applications.length).padStart(4, '0'), student: u.id, type: 'Gia hạn lưu trú ' + st.term.replace('·', '–'), room: u.room, bed: u.bed, term: st.term.split('· ')[1], period: semMonths[st.term].join(' – '), date: K.now(), status: 'cho-duyet', kind: 'extend', docs: [{ name: 'Đơn gia hạn lưu trú', ok: true }], history: [{ t: 'Sinh viên nộp hồ sơ', d: K.now(), s: 'Yêu cầu gia hạn được gửi lên hệ thống.' }, { t: 'Chờ xét duyệt', d: K.now(), s: 'Hồ sơ đang chờ cán bộ quản lý xem xét.' }] });
        delete K.db.drafts.extend; K.save(); App.toast('Đã gửi yêu cầu gia hạn. Ban quản lý sẽ xét duyệt trong 3 – 5 ngày.'); App.refresh();
      };
    },
  };

  // ============ 16. Chuyển phòng ============
  P['sv-chuyen-phong'] = {
    role: 'student', title: 'Yêu cầu chuyển phòng',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-so', logo: 'inline', notif: 'dot', search: 'Tìm phòng, hóa đơn, thông báo...', foot: 'card-only', sbw: 284, icons: { 'sv-phong': 'house', 'sv-hoa-don': 'badge-dollar-sign' } };
      if (!u.room) return noRoom(o);
      const cur = K.room(u.room);
      const st = App.state('transfer', () => { const tgt = App.st.transferPick && App.st.transferPick !== u.room && K.freeBeds(App.st.transferPick) > 0 ? App.st.transferPick : K.freeBeds('B204') > 0 && u.room !== 'B204' ? 'B204' : (K.db.rooms.find((r) => r.code !== u.room && K.freeBeds(r.code) > 0 && !r.maint) || {}).code; return { room: tgt, reason: 'Phù hợp với bạn học', text: 'Em mong muốn chuyển sang phòng ' + tgt + ' để thuận tiện sinh hoạt vì có bạn học cùng ngành. Kính mong nhà trường xem xét hỗ trợ. Em xin cảm ơn!', date: '2026-10-20' }; });
      const tg = K.room(st.room);
      const freeBed = (K.bedMap(tg.code).find((b) => b.free) || {}).bed;
      const req = K.db.requests.transfer;
      const sent = req && req.student === u.id && req.status === 'cho-duyet';
      const roomCard = (r, label, bed, extra) => `<div class="card resp-1" style="padding:14px;display:grid;grid-template-columns:232px 1fr;gap:16px;align-items:center"><img src="${K.A(r.code === u.room ? 'room_cur' : r.code === 'B204' ? 'room_new' : r.img)}" style="width:100%;height:166px;object-fit:cover;border-radius:10px" alt=""><div><div style="display:flex;justify-content:space-between;align-items:center"><span class="badge b-blue" style="border-radius:8px;color:var(--navy)">${label}</span>${extra || ''}</div><h3 style="font-size:22px;margin:10px 0 8px">${r.code} · Tầng ${r.khu} · Giường ${b2(bed)}</h3><div class="info-list" style="font-size:15px"><div style="grid-template-columns:24px 1fr">${ic('building')}<span>Tầng ${r.khu} - Tòa nhà ${r.khu}</span></div><div style="grid-template-columns:24px 1fr">${ic('users')}<span>${K.occCount(r.code)} sinh viên / ${r.beds} giường (${K.freeBeds(r.code) > 0 ? 'Còn ' + K.freeBeds(r.code) + ' chỗ' : 'Đã đủ'})</span></div><div style="grid-template-columns:24px 1fr">${ic('bed-double')}<span>${r.code === u.room ? 'Giường của bạn' : 'Giường đề nghị'}: <b>${b2(bed)}</b></span></div></div></div></div>`;
      return shell(o, `<div style="position:relative">${App.phead({ art: 'banner_transfer', h: 150, crumb: [['Trang chủ', 'sv-tong-quan'], ['Lưu trú', 'sv-ho-so'], 'Yêu cầu chuyển phòng'], title: 'Yêu cầu chuyển phòng', desc: 'Gửi yêu cầu chuyển sang phòng phù hợp hơn với nhu cầu của bạn.' })}<div style="max-width:660px;margin-top:6px">${stayTabs('sv-chuyen-phong', 'icons')}</div></div>
        ${sent ? `<div class="card" style="padding:14px 20px;display:flex;gap:12px;align-items:center;background:#fff8ea;border-color:#fbeccd">${ic('clock')}<span>Bạn đã gửi yêu cầu chuyển sang <b>${req.room} · Giường ${b2(req.bed)}</b> lúc ${req.date}. Trạng thái: <b>Chờ xét duyệt</b>.</span><button class="btn btn-sm btn-outline-red" id="tf-cancel" style="margin-left:auto">Hủy yêu cầu</button></div>` : ''}
        <div style="display:grid;grid-template-columns:1fr 40px 1fr;align-items:center;gap:6px" class="resp-1">${roomCard(cur, 'Phòng hiện tại', u.bed)}<span style="color:var(--red);text-align:center">${ic('arrow-right', 'ic-lg')}</span>${roomCard(tg, 'Phòng đề nghị', freeBed, K.freeBeds(tg.code) > 0 ? badge('Còn chỗ', 'green', { dot: true }) : badge('Hết chỗ', 'red', { dot: true }))}</div>
        <div class="grid resp-1" style="grid-template-columns:1.43fr 1fr;gap:16px;align-items:start">
          <form class="card pad" id="tf-f" novalidate style="padding:20px 24px"><h2 style="font-size:20px">Thông tin yêu cầu chuyển phòng</h2>
            <div style="display:grid;grid-template-columns:180px 1fr;gap:16px 10px;margin-top:16px;align-items:start" class="resp-1">
              <label class="lbl" for="tf-reason" style="padding-top:10px;font-weight:500">Lý do chuyển phòng <span class="req">*</span></label>${sel('tf-reason', ['Phù hợp với bạn học', 'Gần lớp học / khoa', 'Lý do sức khỏe', 'Muốn ở phòng ít người hơn', 'Lý do khác'], st.reason, '', sent ? 'disabled' : '')}
              <label class="lbl" for="tf-text" style="padding-top:10px;font-weight:500">Nội dung đề nghị <span class="req">*</span></label><div style="position:relative"><textarea id="tf-text" class="textarea" data-max="500" style="min-height:124px" ${sent ? 'disabled' : ''}>${esc(st.text)}</textarea><span class="counter">0/500</span></div>
              <label class="lbl" for="tf-date" style="padding-top:10px;font-weight:500">Ngày chuyển dự kiến <span class="req">*</span></label><div class="iwrap" style="max-width:238px">${ic('calendar-days')}<input id="tf-date" type="date" class="input" value="${st.date}" min="2026-10-16" ${sent ? 'disabled' : ''}></div>
              <label class="lbl" style="padding-top:10px;font-weight:500">Giấy tờ bổ sung</label><div class="row" style="flex-wrap:wrap"><label class="btn btn-outline" style="position:relative;color:var(--blue-700);font-weight:500">${ic('paperclip')}Chọn tệp đính kèm<input type="file" id="tf-file" accept=".pdf,.jpg,.jpeg,.png" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label><small class="muted" id="tf-fname">PDF, JPG, PNG (tối đa 5MB)</small></div></div>
            <p class="err" id="tf-err" style="margin-top:10px" hidden></p>
            <div class="row" style="margin-top:20px"><button class="btn btn-red btn-lg" style="min-width:350px;font-size:16px" ${sent ? 'disabled' : ''}>${ic('send')}Gửi yêu cầu chuyển phòng</button><button type="button" class="btn btn-outline-red btn-lg" data-go="sv-phong" style="min-width:138px">Hủy</button></div></form>
          <div class="card pad" style="padding:20px 18px"><h2 class="card-t" style="font-size:20px"><span style="color:var(--blue)">${ic('info', 'ic-lg')}</span>Thông tin cần biết</h2>
            <div style="background:#f2f6fc;border-radius:12px;padding:14px 16px;margin-top:12px"><div class="info-list" style="font-size:14.5px">${[['Phòng đề nghị', tg.code], ['Tầng', 'Tầng ' + tg.khu], ['Sức chứa', tg.beds + ' giường'], ['Số sinh viên hiện tại', K.occCount(tg.code) + ' sinh viên'], ['Giường còn trống', b2(K.freeBeds(tg.code)) + ' giường' + (freeBed ? ' (Giường ' + b2(freeBed) + ')' : '')]].map(([a, b]) => `<div style="grid-template-columns:190px 1fr"><span>${a}</span><span style="color:var(--ink)">${b}</span></div>`).join('')}<div style="grid-template-columns:190px 1fr"><span>Trạng thái sau khi gửi</span><span style="color:var(--orange);display:flex;gap:8px;align-items:center">${ic('clock')}Chờ xét duyệt</span></div></div>
              <div class="row small muted" style="margin-top:10px;align-items:flex-start">${ic('info')}<span>Nhà trường sẽ xem xét yêu cầu trong 3 - 5 ngày làm việc và thông báo kết quả qua hệ thống.</span></div></div>
            <div style="background:#eaf2fd;border-radius:12px;padding:14px 16px;margin-top:12px;display:grid;grid-template-columns:1fr 150px;align-items:center;gap:10px"><div><b class="row" style="color:var(--navy);gap:10px">${ic('search')}Tìm phòng khác</b><p class="small muted" style="margin:6px 0 10px 28px">Xem danh sách các phòng còn trống để lựa chọn phù hợp với nhu cầu của bạn.</p><button class="link" id="tf-other" style="margin-left:0;color:var(--blue-700)">${ic('arrow-right')}Xem phòng khác</button></div>${im('find_other', 'blend', '')}</div></div></div>`);
    },
    mount: (root) => {
      const st = App.st.transfer; const u = K.me();
      if (!u.room) return;
      const keep = () => { st.reason = root.querySelector('#tf-reason').value; st.text = root.querySelector('#tf-text').value; st.date = root.querySelector('#tf-date').value; };
      const fi = root.querySelector('#tf-file'); if (fi) fi.onchange = () => { root.querySelector('#tf-fname').textContent = fi.files[0] ? fi.files[0].name : 'PDF, JPG, PNG (tối đa 5MB)'; };
      const c = root.querySelector('#tf-cancel'); if (c) c.onclick = () => App.confirm('Hủy yêu cầu chuyển phòng', 'Bạn chắc chắn muốn hủy yêu cầu chuyển phòng đã gửi?', 'Hủy yêu cầu', () => { K.db.requests.transfer = null; K.db.applications = K.db.applications.filter((a) => !(a.student === u.id && a.kind === 'transfer' && a.status === 'cho-duyet')); K.save(); App.toast('Đã hủy yêu cầu chuyển phòng'); App.refresh(); }, true);
      root.querySelector('#tf-other').onclick = () => {
        keep();
        const rooms = K.db.rooms.filter((r) => r.code !== u.room && K.freeBeds(r.code) > 0 && !r.maint);
        App.modal({ title: 'Chọn phòng đề nghị', wide: true, body: `<div class="row" style="margin-bottom:12px">${sel('pick-khu', [['', 'Tất cả tầng'], ...App.khuOpts()], '')}</div><div class="tbl-wrap" style="max-height:52vh;overflow:auto"><table class="tbl hover"><thead><tr><th>Phòng</th><th>Tầng</th><th>Loại</th><th>Còn trống</th><th>Giá</th><th></th></tr></thead><tbody id="pick-body">${rooms.map((r) => `<tr data-khu="${r.khu}"><td><b>${r.code}</b></td><td>Tầng ${r.khu}</td><td>${r.beds} người</td><td>${K.freeBeds(r.code)} giường</td><td>${money(r.price)}</td><td><button class="btn btn-sm btn-red" data-pick="${r.code}">Chọn</button></td></tr>`).join('')}</tbody></table></div>`,
          onMount: (el, close) => { el.querySelector('#pick-khu').onchange = (e) => el.querySelectorAll('#pick-body tr').forEach((tr) => tr.hidden = e.target.value && tr.dataset.khu !== e.target.value); el.querySelectorAll('[data-pick]').forEach((b) => b.onclick = () => { st.room = b.dataset.pick; st.text = st.text.replace(/phòng [A-C]\d{3}/, 'phòng ' + st.room); close(); App.refresh(); }); } });
      };
      root.querySelector('#tf-f').onsubmit = (e) => {
        e.preventDefault(); keep();
        const err = root.querySelector('#tf-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        if (st.text.trim().length < 20) return fail('Nội dung đề nghị cần tối thiểu 20 ký tự.');
        if (!st.date) return fail('Vui lòng chọn ngày chuyển dự kiến.');
        const bed = (K.bedMap(st.room).find((b) => b.free) || {}).bed;
        if (!bed) return fail('Phòng đề nghị đã hết giường trống. Hãy chọn phòng khác.');
        K.db.requests.transfer = { student: u.id, room: st.room, bed, reason: st.reason, text: st.text, date: K.now(), status: 'cho-duyet' };
        K.db.applications.push({ id: 'HS2026-' + String(40 + K.db.applications.length).padStart(4, '0'), student: u.id, type: 'Chuyển phòng (sang ' + st.room + ')', room: st.room, bed, term: '2026 – 2027', period: 'Từ ' + st.date.split('-').reverse().join('/'), date: K.now(), status: 'cho-duyet', kind: 'transfer', docs: [{ name: 'Đơn đề nghị chuyển phòng', ok: true }], history: [{ t: 'Sinh viên nộp hồ sơ', d: K.now(), s: st.reason + '. ' + st.text }, { t: 'Chờ xét duyệt', d: K.now(), s: 'Hồ sơ đang chờ cán bộ quản lý xem xét.' }] });
        K.save(); App.toast('Đã gửi yêu cầu chuyển phòng sang ' + st.room + '.'); App.refresh();
      };
    },
  };

  // ============ 17. Trả phòng ============
  P['sv-tra-phong'] = {
    role: 'student', title: 'Yêu cầu trả phòng',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-so', logo: 'inline', notif: 'dot', search: 'Tìm dịch vụ, thông báo, hướng dẫn...', foot: 'card-email', sbw: 276, icons: { 'sv-phong': 'building', 'sv-hoa-don': 'badge-dollar-sign' } };
      if (!u.room) return noRoom(o);
      const r = K.room(u.room);
      const req = K.db.requests.checkout;
      const sent = req && req.student === u.id;
      const st = App.state('checkout', () => (K.db.drafts.checkout ? Object.assign({}, K.db.drafts.checkout) : { date: '2026-10-25', reason: 'Kết thúc năm học', note: '', agree: true }));
      const mates = K.occupants(r.code).sort((a, b) => (a.id === u.id ? -1 : b.id === u.id ? 1 : a.bed - b.bed));
      const assets = [['bed-double', 'Giường'], ['columns-2', 'Tủ đồ'], ['lamp-desk', 'Bàn học'], ['key-round', 'Chìa khóa phòng']];
      const step = sent ? 2 : 1;
      const debt = myInvoices().filter((i) => i.status !== 'da-tt');
      return shell(o, `<div style="position:relative">${App.phead({ art: 'banner_checkout', h: 146, crumb: ['home', ['Lưu trú', 'sv-ho-so'], 'Trả phòng'], title: 'Yêu cầu trả phòng', desc: 'Gửi yêu cầu trả phòng để được kiểm tra phòng, đối chiếu công nợ và hoàn tất thủ tục bàn giao.' })}<div style="max-width:690px;margin-top:6px">${stayTabs('sv-tra-phong', 'v2')}</div></div>
        <div class="card" style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;gap:12px;align-items:center;padding:12px 24px">${[['Gửi yêu cầu', 'Sinh viên gửi yêu cầu trả phòng'], ['Kiểm tra phòng', 'Cán bộ kiểm tra hiện trạng'], ['Đối chiếu công nợ', 'Xác nhận các khoản phí'], ['Bàn giao', 'Hoàn tất và xác nhận trả phòng']].map(([a, b], i) => `<div class="row"><span class="stepnum ${i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}" style="${i + 1 > step ? 'background:#fff' : ''}">${i + 1 < step ? ic('check') : i + 1}</span><div><b style="color:${i + 1 === step ? 'var(--red)' : 'var(--navy)'};font-size:15px;font-weight:600">${a}</b><div class="small muted">${b}</div></div></div>${i < 3 ? `<span style="color:#9fb0c9">${ic('arrow-right')}</span>` : ''}`).join('')}</div>
        <div class="grid resp-1" style="grid-template-columns:1.43fr 1fr;gap:16px;align-items:start">
          <div class="card pad" style="padding:16px 18px"><h2 style="font-size:20px">Thông tin yêu cầu trả phòng</h2>
            <div style="background:#eef4fc;border-radius:12px;padding:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px" class="resp-1">${[['user-round', 'Sinh viên', u.name, u.id], ['building', 'Phòng hiện tại', r.code, 'Tầng ' + r.khu], ['bed-double', 'Giường', b2(u.bed), '(phòng ' + r.beds + ' người)']].map(([i, a, b, c]) => `<div class="row" style="gap:14px"><span class="ic-box" style="background:#fff;width:58px;height:58px">${ic(i)}</span><div><small class="muted">${a}</small><b style="display:block;color:var(--navy);font-size:19px">${esc(b)}</b><small class="muted">${c}</small></div></div>`).join('')}</div>
            <div class="grid g2" style="gap:16px;margin-top:14px"><div class="field"><label for="co-date" style="font-size:14px">Ngày trả phòng dự kiến <span class="req">*</span></label><div class="iwrap">${ic('calendar-days')}<input id="co-date" type="date" class="input" value="${st.date}" min="2026-10-16" ${sent ? 'disabled' : ''}></div></div><div class="field"><label for="co-reason" style="font-size:14px">Lý do trả phòng <span class="req">*</span></label>${sel('co-reason', ['Kết thúc năm học', 'Tốt nghiệp', 'Chuyển ra ngoài ở', 'Bảo lưu / tạm nghỉ học', 'Lý do khác'], st.reason, '', sent ? 'disabled' : '')}</div></div>
            <div class="field" style="margin-top:12px"><label for="co-note" style="font-size:14px">Ghi chú <span class="muted" style="font-weight:400">(không bắt buộc)</span></label><div style="position:relative"><textarea id="co-note" class="textarea" data-max="300" placeholder="Nhập thêm thông tin nếu có..." style="min-height:86px" ${sent ? 'disabled' : ''}>${esc(st.note)}</textarea><span class="counter">0/300</span></div></div>
            <h3 style="font-size:18px;margin:14px 0 8px">Danh sách tài sản bàn giao</h3>
            <div class="tbl-wrap"><table class="tbl compact" style="font-size:13.5px"><thead><tr><th>Tài sản</th><th class="c">Số lượng</th><th class="c">Tình trạng kiểm tra</th><th class="c">Ghi chú</th></tr></thead><tbody>${assets.map(([i, t]) => `<tr><td><span class="row" style="gap:14px"><span style="color:var(--blue-700)">${ic(i)}</span>${t}</span></td><td class="c">1</td><td class="c"><span class="badge b-orange b-sm">${ic('clock')}Chờ kiểm tra</span></td><td class="c">-</td></tr>`).join('')}</tbody></table></div></div>
          <div class="card pad" style="padding:16px 18px"><h2 style="font-size:20px">Tóm tắt bàn giao</h2>
            <div class="row" style="background:#eef4fc;border-radius:10px;padding:8px 10px;margin-top:10px">${im('ic_building_sm', '', '')}<div style="flex:1"><b style="color:var(--navy);font-size:17px">Phòng ${r.code}</b><div class="small muted">Tầng ${r.khu}</div></div>${badge('Đang ở', 'green', { sm: true })}</div>
            <div class="grid g2" style="gap:8px;margin-top:8px"><div style="background:#eef4fc;border-radius:10px;padding:10px 14px"><small class="muted">Số người ở</small><b style="display:block;font-size:20px;color:var(--navy)">${K.occCount(r.code)}</b><small class="muted">/ ${r.beds} người</small></div><div style="background:#eef4fc;border-radius:10px;padding:10px 14px"><small class="muted">Số giường</small><b style="display:block;font-size:20px;color:var(--navy)">${r.beds}</b><small class="muted">/ ${r.beds} giường</small></div></div>
            <b style="display:block;color:var(--navy);margin:12px 0 6px;font-size:15px">Danh sách người ở phòng</b>
            <div>${mates.map((m) => `<div class="row" style="padding:6px 8px;border-radius:8px;${m.id === u.id ? 'background:#eaf2fd' : 'border-bottom:1px solid var(--line-2)'}">${av(m.avatar, 40)}<div style="flex:1"><b style="color:var(--navy);font-size:14px">${esc(m.name)}</b><div class="small muted">${m.id}</div></div><span class="badge b-blue b-sm">Giường ${b2(m.bed)}</span><small style="width:70px;text-align:right;color:var(--ink)">${m.id === u.id ? 'Của bạn' : ''}</small></div>`).join('')}</div>
            <b style="display:block;color:var(--navy);margin:12px 0 6px;font-size:15px">Công nợ và chi phí</b>
            <div class="row" style="align-items:flex-start;padding:4px 0"><span class="ic-box" style="width:38px;height:38px">${ic('file-text')}</span><div style="flex:1"><div class="row"><span style="width:90px">Công nợ</span>${badge('Chờ đối chiếu', 'orange', { icon: 'clock', sm: true })}</div><small class="muted">Sẽ được kiểm tra sau khi kiểm tra phòng.${debt.length ? ' Hiện còn ' + debt.length + ' hóa đơn chưa thanh toán (' + money(debt.reduce((s, i) => s + i.total, 0)) + ').' : ''}</small></div></div>
            <div class="row" style="align-items:flex-start;padding:4px 0"><span class="ic-box" style="width:38px;height:38px">${ic('circle-dollar-sign')}</span><div style="flex:1"><div class="row"><span style="width:90px">Tiền cọc ${ic('info')}</span><span class="badge b-gray b-sm">Theo thỏa thuận</span></div><small class="muted">Số tiền hoàn cọc (nếu có) sẽ được thông báo sau khi hoàn tất bàn giao.</small></div></div></div></div>
        <div class="card" style="display:flex;align-items:center;gap:16px;padding:10px 12px 10px 22px;flex-wrap:wrap">${sent ? `<span class="row" style="flex:1;color:var(--ink)">${ic('clock')}Đã gửi yêu cầu trả phòng lúc ${req.date}. Cán bộ sẽ liên hệ lịch kiểm tra phòng.</span><button class="btn btn-outline-red" id="co-cancel">Hủy yêu cầu</button>` : `<label class="check" style="flex:1;font-size:14px"><input type="checkbox" id="co-agree" ${st.agree ? 'checked' : ''}>Tôi sẽ hoàn tất vệ sinh và bàn giao tài sản trước khi rời khỏi phòng.</label><button class="btn btn-outline" id="co-draft" style="min-width:180px;border-color:var(--line)">${ic('save')}Lưu nháp</button><button class="btn btn-red" id="co-send" style="min-width:280px">${ic('send')}Gửi yêu cầu trả phòng</button>`}</div>`);
    },
    mount: (root) => {
      const st = App.st.checkout; const u = K.me();
      if (!u.room) return;
      const keep = () => { st.date = root.querySelector('#co-date').value; st.reason = root.querySelector('#co-reason').value; st.note = root.querySelector('#co-note').value; const a = root.querySelector('#co-agree'); if (a) st.agree = a.checked; };
      const d = root.querySelector('#co-draft'); if (d) d.onclick = () => { keep(); K.db.drafts.checkout = Object.assign({}, st); K.save(); App.toast('Đã lưu nháp yêu cầu trả phòng'); };
      const s = root.querySelector('#co-send'); if (s) s.onclick = () => {
        keep(); if (!st.date) return App.toast('Vui lòng chọn ngày trả phòng', 'err'); if (!st.agree) return App.toast('Vui lòng tích cam kết bàn giao', 'err');
        App.confirm('Gửi yêu cầu trả phòng', 'Bạn sẽ trả phòng <b>' + u.room + '</b> vào ngày <b>' + st.date.split('-').reverse().join('/') + '</b> với lý do “' + esc(st.reason) + '”.', 'Gửi yêu cầu', () => {
          K.db.requests.checkout = { student: u.id, room: u.room, date: K.now(), on: st.date, reason: st.reason, note: st.note, status: 'cho-duyet' };
          K.db.applications.push({ id: 'HS2026-' + String(40 + K.db.applications.length).padStart(4, '0'), student: u.id, type: 'Trả phòng (' + st.reason + ')', room: u.room, bed: u.bed, term: '2026 – 2027', period: 'Ngày ' + st.date.split('-').reverse().join('/'), date: K.now(), status: 'cho-duyet', kind: 'checkout', docs: [{ name: 'Đơn trả phòng', ok: true }], history: [{ t: 'Sinh viên nộp hồ sơ', d: K.now(), s: 'Yêu cầu trả phòng được gửi lên hệ thống.' }, { t: 'Chờ xét duyệt', d: K.now(), s: 'Chờ kiểm tra phòng.' }] });
          delete K.db.drafts.checkout; K.save(); App.toast('Đã gửi yêu cầu trả phòng'); App.refresh();
        });
      };
      const c = root.querySelector('#co-cancel'); if (c) c.onclick = () => App.confirm('Hủy yêu cầu trả phòng', 'Bạn muốn hủy yêu cầu trả phòng đã gửi?', 'Hủy yêu cầu', () => { K.db.requests.checkout = null; K.db.applications = K.db.applications.filter((a) => !(a.student === u.id && a.kind === 'checkout' && a.status === 'cho-duyet')); K.save(); App.toast('Đã hủy yêu cầu trả phòng'); App.refresh(); }, true);
    },
  };

  // ============ 18. Hỗ trợ & phản ánh ============
  const FAQ = [
    ['file-text', 'Thủ tục đăng ký lưu trú', 'Hướng dẫn hồ sơ, quy trình đăng ký lưu trú tại ký túc xá.', 'Bước 1: Chọn phòng còn chỗ tại mục Phòng ở.<br>Bước 2: Điền thông tin đăng ký, tải giấy tờ (giấy xác nhận sinh viên, CCCD, ảnh 3x4).<br>Bước 3: Kiểm tra và gửi hồ sơ. Ban quản lý duyệt trong 3 – 5 ngày làm việc.<br>Bước 4: Xác nhận thỏa thuận lưu trú và nhận phòng theo lịch.', 'sv-dang-ky-luu-tru'],
    ['receipt-text', 'Cách xem hóa đơn', 'Hướng dẫn tra cứu và xem chi tiết hóa đơn tiền phòng.', 'Vào mục <b>Hóa đơn</b> ở thanh bên trái để xem toàn bộ hóa đơn theo kỳ. Bấm <b>Thanh toán</b> để trả bằng chuyển khoản, ví điện tử hoặc tại quầy; bấm <b>Xem biên nhận</b> với hóa đơn đã thanh toán.', 'sv-hoa-don'],
    ['arrow-left-right', 'Quy trình chuyển phòng', 'Các bước đăng ký và xét duyệt chuyển phòng.', 'Vào <b>Lưu trú › Chuyển phòng</b>, chọn phòng đề nghị còn chỗ, nêu lý do và ngày chuyển dự kiến. Ban quản lý xét duyệt trong 3 – 5 ngày làm việc; khi được duyệt, giường mới sẽ được cập nhật tự động.', 'sv-chuyen-phong'],
  ];
  P['sv-ho-tro'] = {
    role: 'student', title: 'Hỗ trợ & phản ánh',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-ho-tro', logo: 'stack', notif: 'after', search: 'Tìm dịch vụ, thông báo, hướng dẫn...', foot: 'card-only', sbw: 234, icons: { 'sv-ho-tro': 'message-square-warning', 'sv-phong': 'building', 'sv-hoa-don': 'file-text' } };
      const st = App.state('support', () => K.db.drafts.support ? Object.assign({}, K.db.drafts.support) : { type: 'Phản ánh', title: 'Phản ánh tình trạng vệ sinh khu vực tầng 3', body: 'Kính gửi Ban quản lý ký túc xá,\n\nEm xin phản ánh về tình trạng vệ sinh khu vực hành lang tầng 3 hiện chưa đảm bảo, có rác tồn đọng ở góc cầu thang. Mong Ban quản lý sớm kiểm tra và có biện pháp xử lý để đảm bảo môi trường sinh hoạt sạch sẽ cho sinh viên.\n\nEm xin cảm ơn!', notify: true });
      const types = [['Đề nghị hỗ trợ', 'life-buoy'], ['Phản ánh', 'message-square-more'], ['Góp ý', 'lightbulb']];
      const fb = K.db.feedback.filter((f) => f.student === K.db.session.id).slice(0, 4);
      return shell(o, `${App.phead({ art: 'banner_support', h: 192, crumb: ['home', ['Trang chủ', 'sv-tong-quan'], 'Hỗ trợ'], title: 'Hỗ trợ &amp; phản ánh', desc: 'Gửi phản ánh, đề nghị hỗ trợ hoặc góp ý đến Ban quản lý ký túc xá.<br>Chúng tôi luôn lắng nghe và đồng hành cùng sinh viên.' })}
        <div class="grid resp-1" style="grid-template-columns:1fr 0.93fr;gap:14px;align-items:start;margin-top:-12px">
          <form class="card pad" id="sp-f" novalidate style="padding:16px 20px 18px">
            <div class="row" style="gap:14px;align-items:flex-start"><span style="width:54px;height:54px;border-radius:50%;background:#fdecee;color:var(--red);display:grid;place-items:center;flex:none">${ic('pencil')}</span><div><h2 style="font-size:23px">Gửi nội dung đến ban quản lý</h2><p style="margin-top:4px;color:var(--text);font-size:15px">Chọn loại nội dung và cung cấp thông tin chi tiết để chúng tôi hỗ trợ bạn tốt nhất.</p></div></div>
            <div class="grid g3" style="gap:10px;margin-top:16px">${types.map(([t, i]) => `<button type="button" data-type="${t}" class="btn" style="height:58px;font-weight:500;font-size:16px;border:1.5px solid ${st.type === t ? 'var(--red)' : 'var(--line)'};background:${st.type === t ? '#fdecee' : '#fff'};color:${st.type === t ? 'var(--red)' : 'var(--ink)'}"><span style="color:${st.type === t ? 'var(--red)' : 'var(--blue)'}">${ic(i)}</span>${t}</button>`).join('')}</div>
            <div class="field" style="margin-top:14px"><label for="sp-title">Chủ đề <span class="req">*</span></label><input id="sp-title" class="input" value="${esc(st.title)}" placeholder="Nhập chủ đề ngắn gọn" maxlength="120"></div>
            <div class="field" style="margin-top:12px"><label for="sp-body">Nội dung <span class="req">*</span></label><div style="position:relative"><textarea id="sp-body" class="textarea" data-max="1000" style="min-height:172px;font-size:14.5px" placeholder="Mô tả chi tiết nội dung cần hỗ trợ, phản ánh hoặc góp ý...">${esc(st.body)}</textarea><span class="counter">0/1000</span></div></div>
            <div class="field" style="margin-top:12px"><span class="lbl">Đính kèm ảnh hoặc tài liệu <small class="muted" style="font-weight:400">(không bắt buộc)</small></span><div><label class="drop" style="padding:18px"><span class="dz-ic" style="width:54px;height:54px">${ic('cloud-upload')}</span><span style="color:var(--ink)">Nhấn để chọn ảnh hoặc kéo thả vào đây<br><small class="muted" style="font-size:11.5px">Hỗ trợ định dạng: JPG, PNG, PDF. Dung lượng tối đa 5MB.</small></span><input type="file" multiple accept=".jpg,.jpeg,.png,.pdf"></label></div></div>
            <label class="check" style="margin-top:14px;font-size:14.5px"><input type="checkbox" id="sp-notify" ${st.notify ? 'checked' : ''}>Nhận phản hồi trên cổng sinh viên</label><small class="muted" style="display:block;margin:2px 0 0 30px">Khi có phản hồi mới, bạn sẽ nhận thông báo trong hệ thống.</small>
            <p class="err" id="sp-err" hidden style="margin-top:8px"></p>
            <button class="btn btn-red" style="margin-top:12px;min-width:234px">${ic('send')}Gửi ${st.type.toLowerCase()}</button></form>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="card pad" style="padding:16px 18px"><div class="row" style="gap:14px;align-items:flex-start"><span style="width:62px;height:62px;border-radius:50%;background:#eaf2fd;color:var(--blue-700);display:grid;place-items:center;flex:none">${ic('headphones', 'ic-lg')}</span><div><h2 style="font-size:23px">Chúng tôi có thể giúp gì?</h2><p class="muted" style="margin-top:4px;color:var(--text);line-height:1.5">Dưới đây là một số câu hỏi thường gặp. Bạn cũng có thể trao đổi trực tiếp với ban quản lý khi cần hỗ trợ thêm.</p></div></div>
              <div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">${FAQ.map(([i, t, s], k) => `<button class="card" data-faq="${k}" style="box-shadow:none;border:1px solid var(--line);padding:12px 16px;display:flex;gap:16px;align-items:center;text-align:left;cursor:pointer"><span style="width:48px;height:48px;border-radius:50%;background:${k === 1 ? '#fdecee' : '#eaf2fd'};color:${k === 1 ? 'var(--red)' : 'var(--blue-700)'};display:grid;place-items:center;flex:none">${ic(i)}</span><span style="flex:1"><b style="color:var(--navy);display:block">${t}</b><small class="muted">${s}</small></span>${ic('chevron-right')}</button>`).join('')}</div>
              <button class="btn btn-outline btn-block btn-lg" id="sp-chat" style="margin-top:12px;color:var(--blue-700);border-width:2px">${ic('message-circle-more')}Trao đổi với ban quản lý</button></div>
            <div class="card pad" style="padding:16px 18px"><div class="card-h" style="margin-bottom:10px"><h2 class="card-t" style="font-size:22px"><span style="color:var(--red)">${ic('history', 'ic-lg')}</span>Lịch sử phản ánh</h2><button class="link" id="sp-all" style="font-size:15px">Xem tất cả ${ic('arrow-right')}</button></div>
              <div class="tbl-wrap" style="border:0"><table class="tbl compact" style="font-size:13.5px"><thead><tr><th>Ngày gửi</th><th>Chủ đề</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${fb.slice(0, 2).map((f) => `<tr><td>${f.date}</td><td style="max-width:180px">${esc(f.title)}</td><td>${f.status === 'da-phan-hoi' ? badge('Đã phản hồi', 'green', { icon: 'circle-check', sm: true }) : badge('Đang tiếp nhận', 'orange', { icon: 'clock', sm: true })}</td><td><button class="link" data-fb="${f.id}" style="font-size:13.5px">Xem chi tiết ${ic('arrow-right')}</button></td></tr>`).join('')}</tbody></table></div></div>
          </div></div>`);
    },
    mount: (root) => {
      const st = App.st.support;
      const keep = () => { st.title = root.querySelector('#sp-title').value; st.body = root.querySelector('#sp-body').value; st.notify = root.querySelector('#sp-notify').checked; };
      root.querySelectorAll('[data-type]').forEach((b) => b.onclick = () => { keep(); st.type = b.dataset.type; App.refresh(); });
      root.querySelectorAll('[data-faq]').forEach((b) => b.onclick = () => { const f = FAQ[+b.dataset.faq]; App.modal({ title: f[1], body: `<p style="line-height:1.8">${f[3]}</p>`, foot: `<button class="btn btn-outline" data-x>Đóng</button><button class="btn btn-red" data-goto>Đi tới trang</button>`, onMount: (el, close) => el.querySelector('[data-goto]').onclick = () => { close(); App.go(f[4]); } }); });
      const showFb = (f) => App.modal({ title: f.title, body: `<div class="row" style="margin-bottom:12px"><span class="badge b-blue b-sm">${f.type}</span><small class="muted">Gửi ngày ${f.date}</small></div><p style="line-height:1.7;white-space:pre-line">${esc(f.body)}</p>${f.reply ? `<div style="background:var(--green-50);border-radius:10px;padding:12px 14px;margin-top:14px"><b style="color:var(--green)">Phản hồi của Ban quản lý</b><p style="margin-top:6px">${esc(f.reply)}</p></div>` : `<p class="muted" style="margin-top:14px">Ban quản lý đang tiếp nhận và sẽ phản hồi sớm.</p>`}`, foot: '<button class="btn btn-red" data-x>Đóng</button>' });
      root.querySelectorAll('[data-fb]').forEach((b) => b.onclick = () => showFb(K.db.feedback.find((f) => f.id === b.dataset.fb)));
      root.querySelector('#sp-all').onclick = () => App.modal({ title: 'Lịch sử phản ánh', wide: true, body: `<div class="tbl-wrap"><table class="tbl hover"><thead><tr><th>Ngày gửi</th><th>Loại</th><th>Chủ đề</th><th>Trạng thái</th></tr></thead><tbody>${K.db.feedback.filter((f) => f.student === K.db.session.id).map((f) => `<tr data-fb2="${f.id}"><td>${f.date}</td><td>${f.type}</td><td>${esc(f.title)}</td><td>${f.status === 'da-phan-hoi' ? badge('Đã phản hồi', 'green', { sm: true }) : badge('Đang tiếp nhận', 'orange', { sm: true })}</td></tr>`).join('')}</tbody></table></div>`, onMount: (el, close) => el.querySelectorAll('[data-fb2]').forEach((tr) => tr.onclick = () => { close(); showFb(K.db.feedback.find((f) => f.id === tr.dataset.fb2)); }) });
      root.querySelector('#sp-chat').onclick = () => {
        const sid = K.db.session.id; K.db.chats = K.db.chats || {}; const msgs = K.db.chats[sid] = K.db.chats[sid] || [{ me: false, t: 'Xin chào! Ban quản lý KTX có thể hỗ trợ gì cho bạn?', d: K.now() }];
        const render = (el) => { const box = el.querySelector('#cbox'); box.innerHTML = msgs.map((m) => `<div style="display:flex;justify-content:${m.me ? 'flex-end' : 'flex-start'}"><div style="max-width:78%;background:${m.me ? 'var(--red)' : '#eef3f9'};color:${m.me ? '#fff' : 'var(--ink)'};padding:10px 14px;border-radius:14px;font-size:14.5px">${esc(m.t)}</div></div>`).join(''); box.scrollTop = 1e6; };
        App.modal({ title: 'Trao đổi với ban quản lý', body: `<div id="cbox" style="height:300px;overflow:auto;display:flex;flex-direction:column;gap:8px;padding:4px"></div><p class="muted small" style="margin-top:8px">Cán bộ trực phản hồi trong giờ hành chính (7:30 – 17:00). Câu trả lời sẽ hiện tại đây.</p><form id="cf" class="row" style="margin-top:8px"><input id="ci" class="input" placeholder="Nhập tin nhắn..." style="flex:1"><button class="btn btn-red">${ic('send')}</button></form>`,
          onMount: (el) => { render(el); el.querySelector('#cf').onsubmit = (e) => { e.preventDefault(); const v = el.querySelector('#ci').value.trim(); if (!v) return; msgs.push({ me: true, t: v, d: K.now(), unread: true }); el.querySelector('#ci').value = ''; render(el); K.save(); }; } });
      };
      root.querySelector('#sp-f').onsubmit = (e) => {
        e.preventDefault(); keep();
        const err = root.querySelector('#sp-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        if (!st.title.trim()) return fail('Vui lòng nhập chủ đề.');
        if (st.body.trim().length < 20) return fail('Nội dung cần tối thiểu 20 ký tự.');
        const n = K.db.feedback.length + 13;
        K.db.feedback.unshift({ id: 'PA-' + n, date: K.today(), title: st.title.trim(), type: st.type, status: 'dang-tiep-nhan', body: st.body.trim(), student: K.db.session.id });
        delete K.db.drafts.support; App.st.support = { type: 'Phản ánh', title: '', body: '', notify: true }; K.save();
        App.toast('Đã gửi ' + st.type.toLowerCase() + ' đến Ban quản lý.'); App.refresh();
      };
    },
  };

  // ============ 19. Thông báo ============
  P['sv-thong-bao'] = {
    role: 'student', title: 'Thông báo',
    render: () => {
      const o = { active: 'sv-thong-bao', logo: 'inline', notif: 'none', search: 'Tìm thông báo, sự kiện...', foot: 'card-down', sbw: 286, icons: { 'sv-phong': 'building', 'sv-hoa-don': 'receipt-text' } };
      const st = App.state('sv-thong-bao', { tab: 'all', q: '', sel: null });
      const all = App.myNotes();
      let list = st.tab === 'unread' ? all.filter((n) => !n.read) : st.tab === 'stay' ? all.filter((n) => n.cat === 'Lưu trú') : st.tab === 'act' ? all.filter((n) => n.cat === 'Hoạt động') : all;
      if (st.q) list = list.filter((n) => (n.title + ' ' + n.summary).toLowerCase().includes(st.q.toLowerCase()));
      const cur = all.find((n) => n.id === st.sel) || list[0] || all[0];
      st.cur = cur && cur.id;
      const saved = cur && cur.saved;
      return shell(o, `<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap"><div>${App.crumb([['Trang chủ', 'sv-tong-quan'], 'Thông báo'])}<h1 style="font-size:44px;font-weight:800;margin-top:10px">Thông báo</h1><p class="desc" style="font-size:18px;color:#4a5a7e;margin-top:4px">Cập nhật nhanh các thông tin, sự kiện từ Ban quản lý ký túc xá.</p></div><button class="btn btn-outline" id="nt-all" style="height:50px;border-color:var(--line);font-size:16px">${ic('mail')}Đánh dấu tất cả đã đọc</button></div>
        <div class="pills">${[['all', 'Tất cả (' + all.length + ')'], ['unread', 'Chưa đọc (' + all.filter((n) => !n.read).length + ')'], ['stay', 'Lưu trú (' + all.filter((n) => n.cat === 'Lưu trú').length + ')'], ['act', 'Hoạt động (' + all.filter((n) => n.cat === 'Hoạt động').length + ')']].map(([k, t]) => `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}" style="border-radius:999px;height:46px;padding:0 26px;font-size:16px">${t}</button>`).join('')}</div>
        <div class="grid resp-1" style="grid-template-columns:494px 1fr;gap:6px;align-items:start">
          <div class="card" style="padding:18px 10px;border-radius:16px 0 0 16px"><div class="iwrap" style="margin:0 8px 18px">${ic('search')}<input id="nt-q" class="input" placeholder="Tìm trong danh sách thông báo..." value="${esc(st.q)}" style="height:50px"></div>
            <div style="display:flex;flex-direction:column;max-height:560px;overflow:auto">${list.map((n) => `<button data-n="${n.id}" style="display:grid;grid-template-columns:64px 1fr auto;gap:14px;text-align:left;padding:14px 12px;border-radius:12px;border:${cur && cur.id === n.id ? '1.5px solid #bcd3f5;background:#eaf2fd' : '1.5px solid transparent;border-bottom-color:var(--line-2);background:#fff'};cursor:pointer;margin-bottom:6px">${im(n.icon, 'blend', '')}<span><b style="color:var(--navy);font-size:17px;display:flex;align-items:center;gap:10px">${esc(n.title)}${n.read ? '' : '<i style="width:10px;height:10px;border-radius:50%;background:var(--red);display:inline-block"></i>'}</b><small style="display:block;color:var(--text);font-size:14.5px;margin-top:6px;line-height:1.55">${esc(n.summary)}</small></span><span style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between"><small class="muted" style="white-space:nowrap">${esc(n.time)}</small>${ic('chevron-right')}</span></button>`).join('') || '<p class="muted" style="padding:20px;text-align:center">Không có thông báo phù hợp.</p>'}</div></div>
          ${cur ? `<article class="card" style="padding:20px 26px;border-radius:0 16px 16px 0"><span class="badge b-red" style="border-radius:6px;font-weight:500">${cur.cat}</span><h2 style="font-size:31px;margin-top:12px">${esc(cur.title)}</h2><div class="row" style="margin-top:10px;color:var(--text)">${ic('users')}${esc(cur.author)} <span style="margin:0 6px">·</span> ${esc(cur.month)}</div>
            ${cur.img ? `<img src="${K.A(cur.img)}" style="width:100%;height:284px;object-fit:cover;border-radius:8px;margin-top:14px" alt="">` : ''}
            <div style="margin-top:16px;display:flex;flex-direction:column;gap:10px;color:var(--text);font-size:16px;line-height:1.6">${cur.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
            <hr class="hr"><div class="row"><button class="btn btn-red btn-lg" id="nt-read" style="min-width:226px;font-size:16px" ${cur.read && st.justRead !== cur.id ? '' : ''}>${ic('circle-check')}${cur.read ? 'Đã đọc' : 'Đánh dấu đã đọc'}</button><button class="btn btn-outline btn-lg" id="nt-save" style="border-color:var(--line);font-size:16px">${ic(saved ? 'bookmark-check' : 'bookmark')}${saved ? 'Đã lưu' : 'Lưu thông báo'}</button></div></article>` : ''}</div>`);
    },
    mount: (root) => {
      const st = App.st['sv-thong-bao'];
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; st.sel = null; App.refresh(); });
      root.querySelectorAll('[data-n]').forEach((b) => b.onclick = () => { st.sel = b.dataset.n; const n = K.db.notifications.find((x) => x.id === st.sel); if (n && !n.read) { n.read = true; K.save(); } App.refresh(); });
      const q = root.querySelector('#nt-q'); q.oninput = () => { clearTimeout(st.t); st.t = setTimeout(() => { st.q = q.value; App.refresh(); const n = document.getElementById('nt-q'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); };
      root.querySelector('#nt-all').onclick = () => { App.myNotes().forEach((n) => n.read = true); K.save(); App.toast('Đã đánh dấu tất cả là đã đọc'); App.refresh(); };
      const cur = K.db.notifications.find((n) => n.id === st.cur);
      const rd = root.querySelector('#nt-read'); if (rd) rd.onclick = () => { cur.read = !cur.read ? true : cur.read; K.save(); App.toast('Đã đánh dấu đã đọc'); st.sel = cur.id; App.refresh(); };
      const sv = root.querySelector('#nt-save'); if (sv) sv.onclick = () => { cur.saved = !cur.saved; K.save(); App.toast(cur.saved ? 'Đã lưu thông báo' : 'Đã bỏ lưu thông báo'); st.sel = cur.id; App.refresh(); };
    },
  };

  // ============ 20. Tài khoản ============
  P['sv-tai-khoan'] = {
    role: 'student', title: 'Tài khoản của tôi',
    render: () => {
      const u = K.me();
      const o = { active: 'sv-tai-khoan', logo: 'inline', notif: 'dot', search: 'Tìm kiếm dịch vụ, thông báo...', foot: 'card-only', sbw: 270 };
      const st = App.state('account', { tab: 'profile' });
      const r = u.room ? K.room(u.room) : null;
      const mask = (p) => p ? p.slice(0, 2) + '•• ••• ' + p.slice(-3) : '';
      let main;
      if (st.tab === 'profile') main = `<form class="card pad" id="ac-f" novalidate style="padding:22px 20px">
          <div class="card-h"><h2 style="font-size:22px;display:flex;align-items:center;gap:14px"><i style="width:5px;height:28px;border-radius:3px;background:var(--red);display:inline-block"></i>Thông tin cá nhân</h2><small class="muted">Cập nhật thông tin để hồ sơ luôn chính xác.</small></div>
          <div style="display:grid;grid-template-columns:190px 1fr;gap:20px" class="resp-1"><div style="text-align:center"><div style="position:relative;width:165px;margin:0 auto">${im(u.big || 'av_tuananh_big', 'av', '')}<label style="position:absolute;right:4px;bottom:4px;width:44px;height:44px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;border:3px solid #fff;cursor:pointer">${ic('camera')}<input type="file" accept="image/*" id="ac-photo" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label></div><label class="btn btn-soft" style="margin-top:14px;width:162px;position:relative;color:var(--navy)">${ic('camera')}Đổi ảnh<input type="file" accept="image/*" id="ac-photo2" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label></div>
            <div class="grid" style="grid-template-columns:1fr 1fr;gap:16px 22px">
              <div class="field"><label>Mã sinh viên</label><input class="input ro" readonly value="${u.id}" style="background:#eef1f5;color:var(--muted)"></div>
              <div class="field"><label for="ac-name">Họ và tên <span class="req">*</span></label><input id="ac-name" class="input" value="${esc(u.name)}"></div>
              <div class="field"><label for="ac-fac">Khoa <span class="req">*</span></label>${sel('ac-fac', ['Công nghệ thông tin', 'Kinh tế', 'Ngoại ngữ', 'Sư phạm', 'Điện – Điện tử', 'Xây dựng'], u.faculty)}</div>
              <div class="field"><label for="ac-cls">Lớp <span class="req">*</span></label>${sel('ac-cls', ['CNTT K26', 'CNTT K25', 'KT K26', 'NN K26', 'SP K25', 'ĐĐT K26', 'XD K26'], u.cls)}</div>
              <div class="field"><label>Email <span class="req">*</span></label><input class="input ro" readonly value="${esc(u.email)}" style="background:#eef1f5"></div>
              <div class="field"><label>Số điện thoại <span class="req">*</span></label><input class="input ro" readonly value="${mask(u.phone)}" style="background:#eef1f5"></div></div></div>
          <hr class="hr" style="margin:22px 0 16px">
          <h2 style="font-size:21px;display:flex;align-items:center;gap:14px"><i style="width:5px;height:28px;border-radius:3px;background:var(--blue);display:inline-block"></i>Liên hệ khẩn cấp</h2><p class="muted small" style="margin:4px 0 14px 20px">Thông tin này sẽ được sử dụng khi cần liên hệ trong các trường hợp khẩn cấp.</p>
          <div class="grid g3" style="gap:20px"><div class="field"><label for="ac-en">Họ và tên <span class="req">*</span></label><input id="ac-en" class="input" placeholder="Nhập họ và tên người liên hệ" value="${esc(u.emergency.name)}"></div><div class="field"><label for="ac-er">Mối quan hệ <span class="req">*</span></label>${sel('ac-er', [['', 'Chọn mối quan hệ'], 'Bố', 'Mẹ', 'Anh/Chị/Em', 'Người giám hộ', 'Khác'], u.emergency.relation)}</div><div class="field"><label for="ac-ep">Số điện thoại <span class="req">*</span></label><input id="ac-ep" class="input" placeholder="Nhập số điện thoại" value="${esc(u.emergency.phone)}" inputmode="tel"></div></div>
          <p class="err" id="ac-err" hidden style="margin-top:10px"></p>
          <div class="row" style="justify-content:flex-end;margin-top:20px"><button type="button" class="btn btn-soft btn-lg" id="ac-cancel" style="min-width:170px;color:var(--navy)">Hủy</button><button class="btn btn-red btn-lg" style="min-width:170px">Lưu thay đổi</button></div></form>`;
      else if (st.tab === 'security') main = `<div class="card pad" style="padding:22px 24px"><h2 style="font-size:22px">Đổi mật khẩu</h2><form id="pw-f" novalidate class="grid" style="grid-template-columns:1fr;gap:14px;max-width:480px;margin-top:16px">
          <div class="field"><label for="pw-o">Mật khẩu hiện tại</label><div class="iwrap">${ic('lock-keyhole')}<input id="pw-o" type="password" class="input"></div></div>
          <div class="field"><label for="pw-n">Mật khẩu mới</label><div class="iwrap">${ic('lock-keyhole')}<input id="pw-n" type="password" class="input" placeholder="Tối thiểu 8 ký tự"></div></div>
          <div class="field"><label for="pw-n2">Nhập lại mật khẩu mới</label><div class="iwrap">${ic('lock-keyhole')}<input id="pw-n2" type="password" class="input"></div></div><p class="err" id="pw-err" hidden></p><button class="btn btn-red" style="justify-self:start">Cập nhật mật khẩu</button></form>
          <hr class="hr" style="margin:24px 0"><h2 style="font-size:22px">Phiên đăng nhập</h2><div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><thead><tr><th>Thiết bị</th><th>Vị trí</th><th>Lần cuối</th><th></th></tr></thead><tbody>${(K.db.sessions || [{ id: 1, d: 'Trình duyệt hiện tại', loc: 'Vinh, Nghệ An', t: 'Đang hoạt động', cur: true }, { id: 2, d: 'iPhone 13 · Safari', loc: 'Vinh, Nghệ An', t: '14/10/2026 21:10' }, { id: 3, d: 'Laptop · Chrome', loc: 'Hà Nội', t: '02/10/2026 08:45' }]).map((s) => `<tr><td><span class="row">${ic(s.d.includes('iPhone') ? 'smartphone' : 'monitor')}${s.d}</span></td><td>${s.loc}</td><td>${s.cur ? badge('Đang hoạt động', 'green', { dot: true, sm: true }) : s.t}</td><td>${s.cur ? '' : `<button class="btn btn-sm btn-outline-red" data-sess="${s.id}">Đăng xuất</button>`}</td></tr>`).join('')}</tbody></table></div></div>`;
      else main = `<div class="card pad" style="padding:22px 24px"><div class="card-h"><h2 style="font-size:22px">Giấy tờ của tôi</h2><label class="btn btn-red" style="position:relative">${ic('upload')}Tải lên giấy tờ<input type="file" id="doc-up" accept=".pdf,.jpg,.jpeg,.png" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label></div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Loại giấy tờ</th><th>Tệp</th><th>Ngày cập nhật</th><th>Trạng thái</th></tr></thead><tbody>${(u.docs || [{ n: 'Giấy xác nhận sinh viên', f: 'xac_nhan_sv.pdf', d: '12/09/2026', ok: true }, { n: 'CCCD (bản sao)', f: 'cccd.jpg', d: '12/09/2026', ok: true }, { n: 'Ảnh thẻ 3x4', f: 'anh_the.png', d: '12/09/2026', ok: true }, { n: 'Đơn đăng ký lưu trú', f: 'don_dang_ky.pdf', d: '12/09/2026', ok: true }]).map((d) => `<tr><td>${esc(d.n)}</td><td><span class="row" style="color:var(--red)">${ic('file-text')}<span style="color:var(--blue)">${esc(d.f)}</span></span></td><td>${d.d}</td><td>${d.ok ? badge('Đã duyệt', 'green', { icon: 'circle-check', sm: true }) : badge('Chờ duyệt', 'orange', { sm: true })}</td></tr>`).join('')}</tbody></table></div></div>`;
      return shell(o, `${App.phead({ art: 'banner_account', h: 170, crumb: [['Trang chủ', 'sv-tong-quan'], 'Tài khoản'], title: 'Tài khoản của tôi', desc: 'Quản lý thông tin cá nhân, bảo mật và giấy tờ của bạn.' })}
        <div class="card" style="display:inline-flex;gap:4px;padding:10px 12px;align-self:flex-start;margin-top:-10px">${[['profile', 'Hồ sơ cá nhân', 'user-round'], ['security', 'Bảo mật', 'shield'], ['docs', 'Giấy tờ', 'file-text']].map(([k, t, i]) => `<button class="pill ${st.tab === k ? 'on' : ''}" data-tab="${k}" style="border:0;height:42px;font-size:16px;${st.tab === k ? '' : 'background:transparent'}">${ic(i)}${t}</button>`).join('')}</div>
        <div class="grid resp-1" style="grid-template-columns:1fr 470px;gap:18px;align-items:start">${main}
          <div style="display:flex;flex-direction:column;gap:18px">
            <div class="card pad" style="padding:20px 20px"><div class="card-h"><h2 class="card-t" style="font-size:21px"><span style="color:var(--red)">${ic('bed-double', 'ic-lg')}</span>Thông tin lưu trú</h2><a href="#" class="link" data-go="sv-ho-so" style="font-size:14.5px">Xem thỏa thuận ${ic('arrow-right')}</a></div>
              ${r ? `<div style="background:#eef4fc;border-radius:12px;padding:12px;"><div style="display:grid;grid-template-columns:154px 1fr;gap:20px;align-items:center">${im('stay_thumb', '', '')}<div>${badge('Đang lưu trú', 'green', { dot: true })}<b style="display:block;color:var(--navy);font-size:30px;margin-top:10px">${r.code}</b></div></div>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);margin-top:12px;font-size:14px" class="muted">${[['layers', 'Tầng', 'Tầng ' + r.khu], ['bed-double', 'Giường', b2(u.bed)], ['users', 'Số người', K.occCount(r.code) + '/' + r.beds]].map(([i, a, b], k) => `<div class="row" style="${k ? 'border-left:1px solid var(--line);padding-left:12px' : ''}">${ic(i)}<span>${a}<b style="display:block;color:var(--navy);font-size:17px">${b}</b></span></div>`).join('')}</div></div>
              <div class="row" style="margin-top:12px;padding:0 12px">${ic('calendar-days')}<span class="muted">Năm học<b style="display:block;color:var(--navy);font-size:17px">2026 – 2027</b></span></div>` : `<p class="muted">Bạn chưa có phòng.</p>`}</div>
            <div class="card pad" style="padding:18px 20px;overflow:hidden"><div style="display:grid;grid-template-columns:1fr 180px;gap:6px"><div><h2 class="card-t" style="font-size:20px"><span style="color:var(--red)">${ic('shield-half', 'ic-lg')}</span>Bảo mật tài khoản</h2><p class="muted" style="font-size:14px;margin-top:8px;color:var(--text)">Bảo vệ tài khoản để đảm bảo an toàn thông tin cá nhân.</p></div>${im('sec_art', 'blend', '')}</div>
              <button class="card" data-tab="security" style="box-shadow:none;border:1px solid var(--line);padding:12px 16px;display:flex;gap:16px;align-items:center;text-align:left;width:100%;cursor:pointer;margin-top:4px">${ic('lock-keyhole')}<span style="flex:1"><b style="color:var(--navy);display:block">Đổi mật khẩu</b><small class="muted">Cập nhật mật khẩu định kỳ để tăng bảo mật.</small></span>${ic('chevron-right')}</button>
              <button class="card" data-tab="security" style="box-shadow:none;border:1px solid var(--line);padding:12px 16px;display:flex;gap:16px;align-items:center;text-align:left;width:100%;cursor:pointer;margin-top:10px">${ic('monitor-smartphone')}<span style="flex:1"><b style="color:var(--navy);display:block">Quản lý phiên đăng nhập</b><small class="muted">Xem và đăng xuất các thiết bị khác.</small></span>${ic('chevron-right')}</button></div>
          </div></div>`);
    },
    mount: (root) => {
      const st = App.st.account; const u = K.me();
      root.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; App.refresh(); });
      root.querySelectorAll('#ac-photo, #ac-photo2').forEach((inp) => inp.onchange = () => {
        const f = inp.files[0]; if (!f) return; if (!/^image\//.test(f.type)) return App.toast('Vui lòng chọn tệp ảnh', 'err'); if (f.size > 5 * 1024 * 1024) return App.toast('Ảnh cần nhỏ hơn 5MB', 'err');
        const rd = new FileReader(); rd.onload = () => { const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); const z = 240; c.width = z; c.height = z; const sq = Math.min(img.width, img.height); c.getContext('2d').drawImage(img, (img.width - sq) / 2, (img.height - sq) / 2, sq, sq, 0, 0, z, z); const data = c.toDataURL('image/jpeg', 0.82); u.avatar = data; u.big = data; K.save(); App.toast('Đã cập nhật ảnh đại diện'); App.refresh(); }; img.onerror = () => App.toast('Không đọc được ảnh này', 'err'); img.src = rd.result; }; rd.readAsDataURL(f);
      });
      const f = root.querySelector('#ac-f');
      if (f) {
        root.querySelector('#ac-cancel').onclick = () => { App.refresh(); App.toast('Đã hủy các thay đổi chưa lưu'); };
        f.onsubmit = (e) => {
          e.preventDefault();
          const err = f.querySelector('#ac-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
          const name = f.querySelector('#ac-name').value.trim(); const en = f.querySelector('#ac-en').value.trim(); const er = f.querySelector('#ac-er').value; const ep = f.querySelector('#ac-ep').value.trim();
          if (!name) return fail('Họ và tên không được để trống.');
          if (!en || !er || !ep) return fail('Vui lòng điền đủ thông tin liên hệ khẩn cấp.');
          if (!/^0\d{9}$/.test(ep.replace(/\s/g, ''))) return fail('Số điện thoại liên hệ khẩn cấp gồm 10 chữ số.');
          u.name = name; u.faculty = f.querySelector('#ac-fac').value; u.cls = f.querySelector('#ac-cls').value; u.emergency = { name: en, relation: er, phone: ep };
          K.save(); App.toast('Đã lưu thay đổi'); App.refresh();
        };
      }
      const pf = root.querySelector('#pw-f');
      if (pf) pf.onsubmit = (e) => {
        e.preventDefault(); const err = pf.querySelector('#pw-err'); const fail = (m) => { err.textContent = m; err.hidden = false; };
        const o = pf.querySelector('#pw-o').value, n = pf.querySelector('#pw-n').value, n2 = pf.querySelector('#pw-n2').value;
        if (o !== u.password) return fail('Mật khẩu hiện tại không đúng.');
        if (n.length < 8) return fail('Mật khẩu mới cần tối thiểu 8 ký tự.');
        if (n !== n2) return fail('Mật khẩu nhập lại không khớp.');
        u.password = n; K.save(); App.toast('Đã cập nhật mật khẩu'); App.refresh();
      };
      root.querySelectorAll('[data-sess]').forEach((b) => b.onclick = () => { K.db.sessions = (K.db.sessions || [{ id: 1, d: 'Trình duyệt hiện tại', loc: 'Vinh, Nghệ An', t: 'Đang hoạt động', cur: true }, { id: 2, d: 'iPhone 13 · Safari', loc: 'Vinh, Nghệ An', t: '14/10/2026 21:10' }, { id: 3, d: 'Laptop · Chrome', loc: 'Hà Nội', t: '02/10/2026 08:45' }]).filter((s) => String(s.id) !== b.dataset.sess); K.save(); App.toast('Đã đăng xuất thiết bị'); App.refresh(); });
      const up = root.querySelector('#doc-up');
      if (up) up.onchange = () => { const fl = up.files[0]; if (!fl) return; u.docs = u.docs || [{ n: 'Giấy xác nhận sinh viên', f: 'xac_nhan_sv.pdf', d: '12/09/2026', ok: true }, { n: 'CCCD (bản sao)', f: 'cccd.jpg', d: '12/09/2026', ok: true }, { n: 'Ảnh thẻ 3x4', f: 'anh_the.png', d: '12/09/2026', ok: true }, { n: 'Đơn đăng ký lưu trú', f: 'don_dang_ky.pdf', d: '12/09/2026', ok: true }]; u.docs.push({ n: 'Giấy tờ bổ sung', f: fl.name, d: K.today(), ok: false }); K.save(); App.toast('Đã tải lên ' + fl.name); App.refresh(); };
    },
  };
})();
