/* ═══════════════════════════════════════════════════════════
   CREATIKAR — about.js
   Count-up numbers on scroll, stagger reveals
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Count-up animation ──────────────────────────────── */
  function animateCount(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix  ?? '';
    const prefix  = el.dataset.prefix  ?? '';
    const dur     = 1000;
    const start   = performance.now();

    function frame(now) {
      const t      = Math.min((now - start) / dur, 1);
      const eased  = 1 - Math.pow(1 - t, 3);
      const value  = Math.round(eased * target);
      el.textContent = prefix + value + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  const countEls = document.querySelectorAll('.nstat__num[data-target]');

  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  countEls.forEach((el) => countObs.observe(el));

  /* ── Story text: stagger two paragraphs ──────────────── */
  const paras = document.querySelectorAll('.story__para');
  paras.forEach((p, i) => {
    p.style.opacity = '0';
    p.style.transform = 'translateY(20px)';
    p.style.transition = `opacity .6s ease ${i * 0.14 + 0.1}s, transform .6s ease ${i * 0.14 + 0.1}s`;
  });

  const paraObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          paraObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  paras.forEach((p) => paraObs.observe(p));

  /* ── Value blocks: stagger on scroll ─────────────────── */
  const valueBlocks = document.querySelectorAll('.value-block');
  valueBlocks.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .55s ease ${i * 0.12}s, transform .55s ease ${i * 0.12}s`;
  });

  const valObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          valObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  valueBlocks.forEach((el) => valObs.observe(el));

  /* ── Team cards: stagger ──────────────────────────────── */
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .6s ease ${i * 0.14}s, transform .6s ease ${i * 0.14}s`;
  });

  const teamObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          teamObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  teamCards.forEach((el) => teamObs.observe(el));

  /* ── Numbers strip: stagger ──────────────────────────── */
  const nstats = document.querySelectorAll('.nstat');
  nstats.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity .5s ease ${i * 0.14}s, transform .5s ease ${i * 0.14}s`;
  });

  const nstatObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          nstatObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  nstats.forEach((el) => nstatObs.observe(el));

})();
