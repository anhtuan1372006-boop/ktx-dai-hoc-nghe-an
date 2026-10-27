/* Ultra: play the supplied reference as a native UHD video, never a canvas redraw.
   Source: 576x1024 / 30fps. Delivery: 2160x3840 Lanczos upscale; original scenes/timing.
   No media request until Ultra is enabled. Pause/release the decoder outside Ultra.
   Reduced motion and playback errors retain an exact frame from the same video. */
(function () {
  const root = document.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const scriptURL = document.currentScript && document.currentScript.src;
  const assets = new URL(scriptURL ? '../assets/ultra/' : 'assets/ultra/', scriptURL || document.baseURI);
  const box = document.createElement('div');
  box.id = 'v10-ultra';
  box.setAttribute('aria-hidden', 'true');
  let video = null;
  let playPending = false;
  let playVersion = 0;
  let enabled = false;

  const on = () => root.dataset.ultra === 'on';
  const canPlay = () => on() && !document.hidden && !motion.matches;
  const createVideo = () => {
    if (video) return;
    video = document.createElement('video');
    video.className = 'ultra-video';
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.disablePictureInPicture = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('tabindex', '-1');
    video.setAttribute('aria-hidden', 'true');
    video.poster = new URL('poster.jpg', assets).href;
    box.style.backgroundImage = 'url("' + video.poster + '")';
    video.addEventListener('playing', () => {
      // A pending play() may finish after the user has already disabled Ultra.
      if (!canPlay()) video.pause();
      else box.dataset.playback = 'playing';
    });
    video.addEventListener('pause', () => { box.dataset.playback = 'paused'; });
    video.addEventListener('error', () => { box.dataset.playback = 'poster'; });
    box.appendChild(video);
  };
  const play = () => {
    if (!canPlay() || playPending || !video.paused) return;
    playPending = true;
    const version = ++playVersion;
    const attempt = video.play();
    if (attempt && attempt.then) {
      attempt.catch(() => { if (version === playVersion) box.dataset.playback = 'poster'; }).finally(() => {
        if (version !== playVersion) return;
        playPending = false;
        if (!canPlay()) video.pause();
      });
    } else playPending = false;
  };
  const sync = () => {
    const active = on();
    root.classList.toggle('v10', active);
    window.__v10 = active;
    if (!active) {
      playVersion++;
      playPending = false;
      if (video) {
        video.pause();
        if (video.hasAttribute('src')) { video.removeAttribute('src'); video.load(); }
      }
      enabled = false;
      return;
    }
    createVideo();
    if (!canPlay()) {
      video.pause();
      box.dataset.playback = motion.matches ? 'poster' : 'paused';
      return;
    }
    if (!enabled || !video.hasAttribute('src')) {
      video.src = new URL('scene-4k.mp4', assets).href;
      enabled = true;
    }
    play();
  };
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-ultra'] });
  document.addEventListener('visibilitychange', sync);
  // Retry a browser-blocked autoplay on the next intentional interaction.
  document.addEventListener('pointerdown', () => { if (canPlay() && video) play(); }, { passive: true });
  motion.addEventListener('change', sync);
  addEventListener('pageshow', sync);
  addEventListener('pagehide', () => { if (video) video.pause(); });
  const start = () => {
    (document.getElementById('v8-bg') || document.body).appendChild(box);
    sync();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
