/* Deterministic masks: the outline and shaded pixels share exactly one composition. */
(() => {
  'use strict';
  const clamp = value => Math.max(0, Math.min(1, value));
  const drawings = new WeakMap(), fronts = new WeakMap();
  const ease = t => 1 - Math.pow(1 - t, 1.5);
  function facade(svg, value) {
    const p = clamp(value);
    let paths = drawings.get(svg);
    if (!paths) {
      paths = Array.from(svg.querySelectorAll('.ifm-brush'), el => ({el,
        start: +el.dataset.from, end: +el.dataset.to, previous: -1
      }));
      drawings.set(svg, paths);
    }
    for (const item of paths) {
      const t = clamp((p - item.start) / (item.end - item.start));
      if (t === item.previous) continue;
      item.previous = t;
      item.el.setAttribute('stroke-dasharray', '1 1');
      item.el.setAttribute('stroke-dashoffset', (1 - ease(t)).toFixed(6));
      // Round caps otherwise leave a spot even at zero length.
      item.el.setAttribute('visibility', t === 0 ? 'hidden' : 'visible');
    }
    svg.dataset.progress = p.toFixed(3);
  }
  function campus(svg, value) {
    const p = clamp(value);
    let front = fronts.get(svg);
    if (!front) {
      front = {path: svg.querySelector('.ifm-develop-front'), previous: -1};
      fronts.set(svg, front);
    }
    if (p !== front.previous) {
      front.path.setAttribute('transform', `translate(0 ${(-220 + p * 1413).toFixed(2)})`);
      front.previous = p; svg.dataset.progress = p.toFixed(3);
    }
  }
  function scrollProgress(top, viewportHeight) {
    return clamp((viewportHeight * .64 - top) / Math.max(1, viewportHeight * .59));
  }
  window.IFMEREEArt = Object.freeze({facade, campus, scrollProgress});
})();
