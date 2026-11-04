/* ============================================================
   Intelligence Designed To Evolve — landing page logic
   ============================================================ */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     Stats count-up
     ========================================================== */
  const statEls = Array.from(document.querySelectorAll('.s-value[data-target]'));

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const formatValue = (value, decimals) => value.toFixed(decimals);

  const runCountUp = (el, index) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1500 + index * 80;
    const delay = 480 + index * 90;

    if (prefersReduced) {
      el.textContent = formatValue(target, decimals);
      return;
    }

    const start = performance.now() + delay;
    let rafId = null;

    const tick = (now) => {
      if (now < start) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(progress);
      el.textContent = formatValue(target * eased, decimals);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
  };

  if (statEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const index = statEls.indexOf(el);
            runCountUp(el, index);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );
    statEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: run immediately if IO unsupported
    statEls.forEach((el, i) => runCountUp(el, i));
  }

  /* ==========================================================
     Mobile menu
     ========================================================== */
  const burger = document.querySelector('.burger');
  const overlay = document.querySelector('.overlay');
  const menu = document.querySelector('.menu');

  if (burger && overlay && menu) {
    const openMenu = () => {
      burger.setAttribute('aria-expanded', 'true');
      overlay.hidden = false;
      menu.hidden = false;
      document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
      burger.setAttribute('aria-expanded', 'false');
      overlay.hidden = true;
      menu.hidden = true;
      document.body.classList.remove('menu-open');
    };

    burger.addEventListener('click', () => {
      if (burger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 720) closeMenu();
    });
  }
})();
