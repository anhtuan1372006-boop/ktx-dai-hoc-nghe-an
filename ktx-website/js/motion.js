/* Progressive enhancement; account data and photo originals are never changed. */
(function () {
  'use strict';
  const html = document.documentElement;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stored;
  try { stored = localStorage.getItem('ktx-motion'); } catch (_) { /* optional preference */ }
  let paused = media.matches || stored === 'paused';
  let stopHero = () => {};
  let revealObserver;
  const backgroundNodes = '.auth-art,.auth-reg .right,.auth-forgot .art,.welcome';
  const motionURL = (url) => url.replace(/\.svg(?:#still)?/g, '.svg' + (paused ? '#still' : ''));

  function sync(root) {
    root.querySelectorAll('img').forEach((img) => {
      if (!img.getAttribute('src') || !img.getAttribute('src').includes('assets/motion/')) return;
      img.classList.add('motion-image');
      const src = motionURL(img.getAttribute('src'));
      if (src !== img.getAttribute('src')) img.setAttribute('src', src);
      img.decoding = 'async';
      if (!img.closest('.motion-hero,.pub-h') && !img.id.startsWith('rd-')) img.loading = 'lazy';
    });
    root.querySelectorAll(backgroundNodes).forEach((node) => {
      const bg = getComputedStyle(node).backgroundImage;
      if (bg.includes('assets/motion/')) node.style.backgroundImage = motionURL(bg);
    });
  }

  function button() {
    let b = document.querySelector('.motion-toggle');
    if (!b) {
      b = document.createElement('button'); b.className = 'motion-toggle'; b.type = 'button';
      b.innerHTML = '<span class="motion-indicator" aria-hidden="true"></span><span class="motion-label"></span>';
      b.onclick = () => {
        paused = !paused;
        stored = paused ? 'paused' : 'on';
        try { localStorage.setItem('ktx-motion', paused ? 'paused' : 'on'); } catch (_) { /* optional */ }
        apply();
      };
      document.body.appendChild(b);
    }
    b.setAttribute('aria-pressed', String(!paused));
    b.setAttribute('aria-label', paused ? 'Bật hiệu ứng động' : 'Tạm dừng hiệu ứng động');
    b.querySelector('.motion-label').textContent = paused ? 'Hiệu ứng · Đã tạm dừng' : 'Hiệu ứng · Đang bật';
  }

  function apply() {
    html.dataset.motion = paused ? 'paused' : 'on';
    sync(document); button(); stopHero();
    if (!paused) startHero();
  }

  function startHero() {
    const hero = document.querySelector('.motion-hero');
    if (!hero) return;
    const canvas = hero.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0, height = 0, frame = 0, visible = true, last = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles = Array.from({ length: innerWidth < 600 ? 22 : 55 }, (_, i) => ({
      x: ((i * 173 + 29) % 997) / 997, y: ((i * 131 + 59) % 991) / 991,
      r: .6 + i % 3 * .45, speed: .000007 + i % 5 * .000003, phase: i * 1.7,
    }));
    const resize = () => {
      width = hero.clientWidth; height = hero.clientHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (time) => {
      frame = 0;
      if (!visible || document.hidden || paused || !hero.isConnected) return;
      const delta = Math.min(time - (last || time), 50); last = time;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.y -= p.speed * delta;
        if (p.y < 0) p.y = 1;
        const x = p.x * width + Math.sin(time * .00025 + p.phase) * 14;
        const y = p.y * height;
        const alpha = .15 + (Math.sin(time * .001 + p.phase) + 1) * .2;
        ctx.fillStyle = i % 3 ? `rgba(129,227,235,${alpha})` : `rgba(240,208,146,${alpha})`;
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2); ctx.fill();
        if (i % 9 === 0) {
          ctx.strokeStyle = `rgba(240,208,146,${alpha * .5})`;
          ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y);
          ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke();
        }
      });
      frame = requestAnimationFrame(draw);
    };
    const resume = () => { if (visible && !document.hidden && !frame && !paused) { last = 0; frame = requestAnimationFrame(draw); } };
    const observe = new IntersectionObserver(([e]) => { visible = e.isIntersecting; resume(); });
    observe.observe(hero);
    const ro = new ResizeObserver(resize); ro.observe(hero);
    const pointer = (e) => {
      if (e.pointerType !== 'mouse' || paused) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--parallax-x', ((e.clientX - r.left) / r.width - .5) * 12 + 'px');
      hero.style.setProperty('--parallax-y', ((e.clientY - r.top) / r.height - .5) * 8 + 'px');
    };
    const leave = () => { hero.style.removeProperty('--parallax-x'); hero.style.removeProperty('--parallax-y'); };
    hero.addEventListener('pointermove', pointer, { passive: true }); hero.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', resume);
    resize(); resume();
    stopHero = () => {
      cancelAnimationFrame(frame); observe.disconnect(); ro.disconnect();
      hero.removeEventListener('pointermove', pointer); hero.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', resume); leave();
      ctx.clearRect(0, 0, width, height); stopHero = () => {};
    };
  }

  html.dataset.motion = paused ? 'paused' : 'on';
  App.mountMotion = (root) => {
    const isPage = root.id === 'app';
    if (isPage) {
      document.body.dataset.view = App.key === 'trang-chu' ? 'home' : root.querySelector('.app') ? 'portal' : 'guest';
      stopHero();
      if (revealObserver) revealObserver.disconnect();
    }
    sync(root); button();
    if (!isPage) return;
    if (!paused) {
      startHero();
      revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('motion-revealed'); revealObserver.unobserve(entry.target); }
      }), { threshold: .08 });
      root.querySelectorAll('.hs-head,.hcard,.rtile,.space,.amen-card').forEach((el) => revealObserver.observe(el));
    }
  };
  media.addEventListener('change', () => { paused = media.matches || stored === 'paused'; apply(); });
})();
