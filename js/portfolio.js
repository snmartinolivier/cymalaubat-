/* ============================================================
   CYMALAUBAT SUARL — PORTFOLIO JS
   Filter tabs, Before/After slider, Lightbox
   ============================================================ */

'use strict';

/* ── Portfolio Filter ────────────────────────────────────────── */
const filterTabs = document.querySelectorAll('.filter-tab');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active tab
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;

    portfolioItems.forEach((item, index) => {
      const cat = item.dataset.category;
      const show = filter === 'all' || cat === filter;

      if (show) {
        item.classList.remove('hidden');
        item.style.animationDelay = `${index * 0.05}s`;
        item.style.animation = 'fadeInUp 0.4s ease both';
      } else {
        item.classList.add('hidden');
        item.style.animation = '';
      }
    });
  });
});

/* ── Lightbox ────────────────────────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

portfolioItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img || !lightbox) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Before / After Slider ───────────────────────────────────── */
const beforeAfterContainers = document.querySelectorAll('.before-after');

beforeAfterContainers.forEach(container => {
  const afterEl = container.querySelector('.before-after__after');
  const handle = container.querySelector('.before-after__handle');

  if (!afterEl || !handle) return;

  let isDragging = false;

  function setPosition(x) {
    const rect = container.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
    afterEl.style.clipPath = `inset(0 0 0 ${pos}%)`;
    handle.style.left = `${pos}%`;
  }

  // Initial position
  setPosition(container.getBoundingClientRect().left + container.getBoundingClientRect().width * 0.5);

  // Mouse events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setPosition(e.clientX);
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) setPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch events
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging) setPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });
});
