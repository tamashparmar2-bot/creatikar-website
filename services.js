/* ═══════════════════════════════════════════════════════════
   CREATIKAR — services.js
   Handles: row hover cursor, process step stagger, number
            counter on the sidebar count-up
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Re-run base animate observer ──────────────────── */
  // (script.js handles .animate — just ensure it sees the
  //  new page's elements too; since both scripts load, the
  //  IntersectionObserver in script.js catches everything)

  /* ── 2. Process steps — stagger on scroll ─────────────── */
  const steps = document.querySelectorAll('.process__step');
  const connectors = document.querySelectorAll('.process__connector');

  const stepObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const allSteps = [...steps, ...connectors];
          allSteps.forEach((el, i) => {
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, i * 80);
          });
          stepObs.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  // Initially hide steps for stagger
  const allStepEls = [...steps, ...connectors];
  allStepEls.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  if (steps.length) stepObs.observe(steps[0].closest('.process__track'));

  /* ── 3. Service rows — keyboard accessibility ─────────── */
  document.querySelectorAll('.svc-row').forEach((row) => {
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = row.querySelector('a');
        if (link) link.click();
      }
    });
  });

  /* ── 4. Sidebar "06" count-up on load ─────────────────── */
  function countUp(el, target, duration) {
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(eased * target)).padStart(2, '0');
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const countEl = document.querySelector('.count-num');
  if (countEl) {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          countUp(countEl, 6, 800);
          obs.disconnect();
        }
      },
      { threshold: 0.8 }
    );
    obs.observe(countEl);
  }

})();
