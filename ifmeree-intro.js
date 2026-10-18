/* Progressive enhancement: complete illustrations and links remain usable without JS. */
(() => {
  'use strict';
  const intro = document.querySelector('.ifmeree-intro');
  if (!intro) return;
  const root = document.documentElement;
  const drawing = intro.querySelector('[data-ifm-drawing]');
  const campus = intro.querySelector('[data-ifm-campus]');
  const layers = campus.querySelector('.ifm-campus-layers');
  const color = campus.querySelector('.ifm-campus-color');
  const lens = campus.querySelector('.ifm-campus-lens');
  const pointer = drawing.querySelector('.ifm-pointer');
  const guideX = pointer.querySelector('.ifm-guide-x');
  const guideY = pointer.querySelector('.ifm-guide-y');
  const cross = pointer.querySelector('.ifm-pointer-cross');
  const readout = pointer.querySelector('.ifm-pointer-readout');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine) and (min-width:801px)');
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = root.classList.contains('reduce-motion') || (systemMotion.matches && !root.classList.contains('allow-motion'));
  let campusVisible = false;
  let frame = 0;
  let progress = -1;
  let entranceTimer;
  let drawingPoint = null;
  let campusPoint = null;
  let scrollDirty = true;

  function finishEntrance() {
    drawing.classList.remove('is-drawing');
    drawing.classList.toggle('is-pointer-ready', !reduced && finePointer.matches);
    clearTimeout(entranceTimer);
  }
  // A bounded 2.5s stroke-and-mask sequence; never blocks or pins native scrolling.
  if (!reduced && !location.hash && drawing.getBoundingClientRect().bottom > 0) {
    drawing.classList.add('is-drawing');
    entranceTimer = setTimeout(finishEntrance, 2550);
  } else finishEntrance();

  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }

  function render() {
    frame = 0;
    if (reduced) return;
    // Read layout together, then write only to the elements that changed.
    const campusRect = (campusVisible && scrollDirty) ? layers.getBoundingClientRect() : null;
    const drawingRect = drawingPoint ? drawing.getBoundingClientRect() : null;
    const lensRect = campusPoint ? layers.getBoundingClientRect() : null;
    if (campusRect) {
      const vh = window.innerHeight;
      const next = Math.min(1, Math.max(0, (vh * .86 - campusRect.top) / Math.max(1, vh * .55)));
      if (Math.abs(next - progress) > .001) {
        progress = next;
        // A diagonal reveal retains the underlying ink; identical image geometry prevents jumps.
        const edge = next * 125 - 25;
        color.style.clipPath = next >= .999 ? 'none' : `polygon(0 0,${edge}% 0,${edge + 25}% 100%,0 100%)`;
      }
      scrollDirty = false;
    }
    if (drawingRect && finePointer.matches && !drawing.classList.contains('is-drawing')) {
      const x = Math.max(0, Math.min(drawingRect.width, drawingPoint.x - drawingRect.left));
      const y = Math.max(0, Math.min(drawingRect.height, drawingPoint.y - drawingRect.top));
      guideX.style.transform = `translateY(${y}px)`;
      guideY.style.transform = `translateX(${x}px)`;
      cross.style.transform = `translate(${x - 8}px,${y - 8}px)`;
      readout.style.transform = `translate(${Math.max(8, Math.min(x + 18, drawingRect.width - 180))}px,${Math.max(8, Math.min(y + 17, drawingRect.height - 32))}px)`;
      readout.textContent = `X ${Math.round(x)} PX · Y ${Math.round(y)} PX`;
      pointer.classList.add('is-active');
      drawingPoint = null;
    }
    if (lensRect && finePointer.matches) {
      const x = campusPoint.x - lensRect.left;
      const y = campusPoint.y - lensRect.top;
      lens.style.clipPath = `circle(${Math.max(65, lensRect.width * .19)}px at ${x}px ${y}px)`;
      lens.classList.add('is-active');
      campusPoint = null;
    }
  }

  drawing.addEventListener('pointermove', event => {
    if (reduced || !finePointer.matches || event.pointerType === 'touch') return;
    drawingPoint = {x: event.clientX, y: event.clientY};
    schedule();
  }, {passive:true});
  drawing.addEventListener('pointerleave', () => { drawingPoint = null; pointer.classList.remove('is-active'); });
  campus.addEventListener('pointermove', event => {
    if (reduced || !finePointer.matches || event.pointerType === 'touch') return;
    campusPoint = {x: event.clientX, y: event.clientY};
    schedule();
  }, {passive:true});
  campus.addEventListener('pointerleave', () => { campusPoint = null; lens.classList.remove('is-active'); });

  // No permanent animation loop. Only visible, dirty scenes request a frame.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      campusVisible = entries[0].isIntersecting;
      if (campusVisible) { scrollDirty = true; schedule(); }
      else { campusPoint = null; lens.classList.remove('is-active'); }
    }, {rootMargin:'100px 0px'});
    observer.observe(campus);
  } // Without IntersectionObserver the complete colored fallback stays visible.
  window.addEventListener('scroll', () => {
    pointer.classList.remove('is-active');
    lens.classList.remove('is-active');
    drawingPoint = campusPoint = null;
    if (!reduced && campusVisible) { scrollDirty = true; schedule(); }
  }, {passive:true});
  window.addEventListener('resize', () => {
    progress = -1;
    scrollDirty = true;
    pointer.classList.remove('is-active');
    lens.classList.remove('is-active');
    schedule();
  }, {passive:true});
  finePointer.addEventListener('change', () => {
    pointer.classList.remove('is-active');
    lens.classList.remove('is-active');
    drawing.classList.toggle('is-pointer-ready', finePointer.matches && !reduced);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; finishEntrance(); }
    else { scrollDirty = true; schedule(); }
  });
  window.addEventListener('ipress:motion', event => {
    reduced = Boolean(event.detail.reduced);
    finishEntrance();
    pointer.classList.remove('is-active');
    lens.classList.remove('is-active');
    drawingPoint = campusPoint = null;
    if (reduced) {
      cancelAnimationFrame(frame);
      frame = 0;
      color.style.clipPath = 'none';
    } else { progress = -1; scrollDirty = true; schedule(); }
  });
})();
