/* IPRESS motion: progressive enhancement. Content stays readable without JS,
   IntersectionObserver, or Web Animations; no scrolling is intercepted. */
(() => {
  'use strict';
  const root = document.documentElement;
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => root.classList.contains('reduce-motion') || (query.matches && !root.classList.contains('allow-motion'));
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const running = new Set();
  const perElement = new WeakMap();
  const ease = 'cubic-bezier(.16,1,.3,1)';
  function enter(el, delay = 0, distance = 20) {
    if (reduced() || el.closest('[hidden]')) return;
    const previous = perElement.get(el);
    if (previous) previous.cancel();
    const base = getComputedStyle(el).transform;
    const finalTransform = base === 'none' ? 'translateY(0)' : base;
    const startTransform = `translateY(${distance}px) ${base === 'none' ? '' : base}`;
    const animation = el.animate([
      {opacity: 0, transform: startTransform},
      {opacity: 1, transform: finalTransform}
    ], {duration: 680, delay, easing: ease, fill: 'backwards'});
    running.add(animation); perElement.set(el, animation);
    animation.finished.then(() => running.delete(animation), () => running.delete(animation));
  }
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    visible.forEach((entry, index) => {
      observer.unobserve(entry.target);
      enter(entry.target, Math.min(index, 3) * 65, entry.target.matches('h2') ? 28 : 18);
    });
  }, {threshold: .08, rootMargin: '0px 0px -16px 0px'});
  // Animate the editorial contents individually instead of stacking parent fades.
  const selectors = [
    '.section-label', '.manifesto h2', '.manifesto-aside > p',
    '.discipline-visual', '.disciplines > .small-label', '.discipline > button',
    '.team-heading > h2', '.team-heading > p', '.team-stamp', '.team-experience',
    '.crew-tab', '.team-note', '.moments-heading h2', '.moments-heading .small-label',
    '.gallery-navigation', '.ipress-film', '.memory img', '.gallery-foot',
    '.join-inner h2', '.join-content > p', '.join-content > a',
    '.recruitment-hero h2', '.recruitment-invitation', '.recruitment-kicker',
    '.recruitment-paths > a', '.community-clarification', '.form-heading > h3', '.form-heading > p', '.creative-choice',
    '.pages-application-handoff > h4', '.pages-application-handoff > p',
    '.pages-application-handoff > button', '.creative-pass', '.application-next',
    '.community-heading > h2', '.community-heading > p', '.social-portal', '.social-note', '.footer-top'
  ];
  const targets = new Set(document.querySelectorAll(selectors.join(',')));
  // Include remaining original reveal groups, except parents of chosen targets.
  document.querySelectorAll('.reveal').forEach(el => {
    if (![...targets].some(target => el.contains(target) || target.contains(el))) targets.add(el);
  });
  targets.forEach(el => observer.observe(el));
  root.classList.add('motion-layer');
  function finishMotion() {
    if (!reduced()) return;
    running.forEach(animation => { try { animation.finish(); } catch { animation.cancel(); } });
    running.clear();
  }
  window.addEventListener('ipress:motion', finishMotion);
  query.addEventListener('change', finishMotion);
  document.addEventListener('focusin', event => {
    for (let el = event.target; el && el !== root; el = el.parentElement) {
      const animation = perElement.get(el);
      if (animation && animation.playState !== 'finished') animation.finish();
    }
  });
  document.querySelectorAll('.discipline > button').forEach(button => {
    button.addEventListener('click', () => {
      const description = document.getElementById(button.getAttribute('aria-controls'));
      if (description && !description.hidden) enter(description, 0, 10);
    });
  });
  document.querySelector('#interest-explorer')?.addEventListener('change', () => {
    const title = document.querySelector('#pass-title');
    const description = document.querySelector('#pass-description');
    if (title) enter(title, 0, 8);
    if (description) enter(description, 55, 8);
  });
  // Native dialogs retain their Escape, focus and lightbox controls.
  document.querySelectorAll('dialog').forEach(dialog => {
    new MutationObserver(() => { if (dialog.open) enter(dialog, 0, 12); })
      .observe(dialog, {attributes: true, attributeFilter: ['open']});
  });
})();
