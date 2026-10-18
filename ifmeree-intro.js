/* IFMEREE enhancement. Native scroll remains untouched. */
(() => {
  'use strict';
  const intro = document.querySelector('.ifmeree-intro');
  const art = window.IFMEREEArt, root = document.documentElement;
  if (!intro || !art) { root.classList.remove('ifm-motion-pending'); return; }
  const drawing = intro.querySelector('[data-ifm-drawing]');
  const campus = intro.querySelector('[data-ifm-campus]');
  const facadeSVG = drawing.querySelector('[data-artwork="facade"]');
  const campusSVG = campus.querySelector('[data-artwork="campus"]');
  const pointer = drawing.querySelector('.ifm-pointer');
  const guideX = pointer.querySelector('.ifm-guide-x');
  const guideY = pointer.querySelector('.ifm-guide-y');
  const cross = pointer.querySelector('.ifm-pointer-cross');
  const readout = pointer.querySelector('.ifm-pointer-readout');
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine) and (min-width:801px)');
  const isReduced = () => root.classList.contains('reduce-motion') || (systemMotion.matches && !root.classList.contains('allow-motion'));
  let reduced = isReduced();
  let frame = 0, lastTime = 0, elapsed = 0;
  let ready = false, disposed = false, entrance = false;
  let drawingVisible = true, campusVisible = true;
  let layoutDirty = true, scrollDirty = true, forceMeasure = true;
  let drawingRect, point = null;
  const duration = 6400;
  const initialRect = drawing.getBoundingClientRect();
  const wantsEntrance = !reduced && !window.__ifmBootExpired && !location.hash && initialRect.bottom > 0 && window.scrollY < 120;
  art.facade(facadeSVG, wantsEntrance ? 0 : 1);
  art.campus(campusSVG, reduced ? 1 : art.scrollProgress(campus.getBoundingClientRect().top, innerHeight));

  function schedule() {
    if (!frame && !document.hidden && !disposed) frame = requestAnimationFrame(render);
  }
  function hidePointer() { point = null; pointer.classList.remove('is-active'); }
  function finishEntrance() {
    entrance = false; elapsed = duration; lastTime = 0;
    art.facade(facadeSVG, 1); drawing.classList.remove('is-drawing');
  }
  function refresh() { layoutDirty = true; scrollDirty = true; forceMeasure = true; schedule(); }
  function render(time) {
    frame = 0;
    // Batch reads before writes. Pointer events use the last measured scene bounds.
    if (layoutDirty || !drawingRect) drawingRect = drawing.getBoundingClientRect();
    const campusTop = !reduced && scrollDirty && (campusVisible || forceMeasure || !('IntersectionObserver' in window))
      ? campus.getBoundingClientRect().top : null;
    if (layoutDirty && !('IntersectionObserver' in window)) {
      drawingVisible = drawingRect.bottom > 0 && drawingRect.top < innerHeight;
      if (campusTop !== null) campusVisible = campusTop < innerHeight && campusTop + campus.offsetHeight > 0;
    }
    layoutDirty = false; forceMeasure = false;
    if (campusTop !== null) {
      art.campus(campusSVG, art.scrollProgress(campusTop, innerHeight)); scrollDirty = false;
    }
    if (entrance && ready && !reduced && drawingVisible) {
      if (lastTime) elapsed += Math.max(0, time - lastTime);
      lastTime = time;
      art.facade(facadeSVG, elapsed / duration);
      if (elapsed >= duration) finishEntrance(); else schedule();
    } else lastTime = 0;
    if (point && finePointer.matches && !reduced) {
      const x = Math.max(0, Math.min(drawingRect.width, point.x - drawingRect.left));
      const y = Math.max(0, Math.min(drawingRect.height, point.y - drawingRect.top));
      guideX.style.transform = `translateY(${y}px)`;
      guideY.style.transform = `translateX(${x}px)`;
      cross.style.transform = `translate(${x - 8}px,${y - 8}px)`;
      readout.style.transform = `translate(${Math.max(8, Math.min(x + 18, drawingRect.width - 180))}px,${Math.max(8, Math.min(y + 17, drawingRect.height - 32))}px)`;
      readout.textContent = `X ${Math.round(x)} PX · Y ${Math.round(y)} PX`;
      pointer.classList.add('is-active'); point = null;
    }
  }
  function start() {
    if (ready || disposed) return;
    ready = true; entrance = wantsEntrance && !reduced && !window.__ifmBootExpired;
    if (window.__ifmBootExpired) finishEntrance();
    if (!window.__ifmBootExpired) facadeSVG.parentElement.classList.add('is-art-ready');
    campusSVG.parentElement.classList.add('is-art-ready');
    if (!window.__ifmBootExpired) facadeSVG.parentElement.querySelector('.ifm-static-art').setAttribute('alt', '');
    campusSVG.parentElement.querySelector('.ifm-static-art').setAttribute('alt', '');
    if (entrance) drawing.classList.add('is-drawing'); else finishEntrance();
    clearTimeout(window.__ifmBootTimer);
    root.classList.remove('ifm-motion-pending');
    drawing.classList.toggle('is-pointer-ready', finePointer.matches && !reduced);
    refresh();
  }
  function motionChanged() {
    reduced = isReduced(); hidePointer();
    if (reduced) { finishEntrance(); art.campus(campusSVG, 1); }
    drawing.classList.toggle('is-pointer-ready', finePointer.matches && !reduced); refresh();
  }
  function scrolled() {
    scrollDirty = true; layoutDirty = true; hidePointer();
    if (campusVisible || entrance || !('IntersectionObserver' in window)) schedule();
  }
  function moved(event) {
    if (!finePointer.matches || reduced || event.pointerType === 'touch') return;
    point = {x: event.clientX, y: event.clientY}; schedule();
  }
  function visibilityChanged() {
    lastTime = 0;
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; hidePointer(); } else refresh();
  }
  let observer, resizeObserver;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === drawing) drawingVisible = entry.isIntersecting;
        if (entry.target === campus) campusVisible = entry.isIntersecting;
      }
      lastTime = 0;
      if (campusVisible || drawingVisible) refresh();
    }, {rootMargin: '60px 0px'});
    observer.observe(drawing); observer.observe(campus);
  }
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(refresh); resizeObserver.observe(intro);
  }
  drawing.addEventListener('pointermove', moved, {passive: true});
  drawing.addEventListener('pointerleave', hidePointer);
  window.addEventListener('scroll', scrolled, {passive: true});
  window.addEventListener('resize', refresh, {passive: true});
  window.addEventListener('orientationchange', refresh, {passive: true});
  window.addEventListener('load', refresh);
  window.addEventListener('hashchange', refresh);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('ipress:motion', motionChanged);
  document.addEventListener('visibilitychange', visibilityChanged);
  systemMotion.addEventListener('change', motionChanged);
  finePointer.addEventListener('change', motionChanged);
  document.fonts?.addEventListener?.('loadingdone', refresh);
  window.addEventListener('pagehide', event => {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    if (event.persisted) return;
    disposed = true; observer?.disconnect(); resizeObserver?.disconnect();
  });
  /* Decoding happens before either animated layer becomes visible. */
  function decodeArtwork(src) {
    const image = new Image(); image.src = src;
    if (image.decode) return image.decode();
    return new Promise((resolve, reject) => {
      if (image.complete) return image.naturalWidth ? resolve() : reject(new Error(src));
      image.onload = resolve; image.onerror = reject;
    });
  }
  const assets = Array.from(new Set(Array.from(intro.querySelectorAll('svg image'), el => el.getAttribute('href'))));
  const fontsReady = document.fonts?.ready ? Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1200))]): Promise.resolve();
  Promise.all([fontsReady, ...assets.map(decodeArtwork)]).then(start).catch(() => {
    clearTimeout(window.__ifmBootTimer);
    root.classList.remove('ifm-motion-pending');
    root.classList.add('ifm-art-fallback');
    finishEntrance();
  });
  document.fonts?.ready.then(refresh, () => {});
})();
