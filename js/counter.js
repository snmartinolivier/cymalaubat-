/* ============================================================
   CYMALAUBAT SUARL — COUNTER JS
   Animated number counters (Intersection Observer)
   ============================================================ */

'use strict';

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = parseInt(el.dataset.duration, 10) || 2000;
  const start = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = Math.round(eased * target);

    el.textContent = prefix + current.toLocaleString('fr-FR') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target.toLocaleString('fr-FR') + suffix;
    }
  }

  requestAnimationFrame(update);
}

// Initialize
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-counter]').forEach(el => {
  counterObserver.observe(el);
});
