/* Shared renderer: all states use the same authored SVG geometry. */
(() => {
  'use strict';
  const clamp = value => Math.max(0, Math.min(1, value));
  const drawings = new WeakMap(), fronts = new WeakMap();
  const ease = t => 1 - Math.pow(1 - t, 1.7);
  function facade(svg, value) {
    const p = clamp(value);
    let paths = drawings.get(svg);
    if (!paths) {
      paths = Array.from(svg.querySelectorAll('.ifm-vector-stroke'), el => ({
        el, start: +el.dataset.from, end: +el.dataset.to,
        span: +el.dataset.span || 1, previous: -1
      }));
      drawings.set(svg, paths);
    }
    for (const item of paths) {
      const t = clamp((p - item.start) / (item.end - item.start));
      if (t === item.previous) continue;
      item.previous = t;
      if (t === 1) {
        item.el.style.removeProperty('stroke-dasharray');
        item.el.style.removeProperty('stroke-dashoffset');
        item.el.style.removeProperty('opacity');
      } else {
        item.el.style.strokeDasharray = `${item.span} ${item.span}`;
        item.el.style.strokeDashoffset = (item.span * (1 - ease(t))).toFixed(6);
        item.el.style.opacity = t === 0 ? '0' : '1';
      }
    }
    // Depth develops after structural/window passes, while fine strokes continue.
    svg.style.setProperty('--ifm-paint', ease(clamp((p - .59) / .41)).toFixed(4));
    svg.dataset.progress = p.toFixed(3);
  }
  function campus(svg, value) {
    const p = clamp(value);
    let front = fronts.get(svg);
    if (!front) {
      const path = svg.querySelector('.ifm-develop-front');
      const bounds = svg.getAttribute('viewBox').split(/\s+/).map(Number);
      // A fixed irregular ink edge, translated in the shared artwork coordinates.
      const points = [];
      for (let i = 0; i <= 202; i++) {
        points.push([-110 + i * 9.5, Math.sin(i * 1.91) * 8 + Math.cos(i * .43) * 12 + Math.sin(i * .11) * 18]);
      }
      let d = 'M-150 -1400H1800V0';
      for (let i = points.length - 1; i >= 0; i--) {
        const a = points[i];
        d += `L${a[0]} ${a[1].toFixed(2)}`;
      }
      path.setAttribute('d', d + 'L-150 0Z');
      front = {path, top: bounds[1], height: bounds[3], previous: -1};
      fronts.set(svg, front);
    }
    if (p !== front.previous) {
      front.path.setAttribute('transform', `translate(0 ${(front.top - 80 + p * (front.height + 160)).toFixed(2)})`);
      front.previous = p;
      svg.dataset.progress = p.toFixed(3);
    }
  }
  function scrollProgress(top, viewportHeight) {
    return clamp((viewportHeight * .64 - top) / Math.max(1, viewportHeight * .59));
  }
  window.IFMEREEArt = Object.freeze({facade, campus, scrollProgress});
})();
