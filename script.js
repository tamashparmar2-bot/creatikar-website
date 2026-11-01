/* ═══════════════════════════════════════════════════════════
   CREATIKAR — script.js
   Handles: fade-up observer, navbar scroll, mobile menu,
            custom cursor
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Intersection Observer — fade-up animation ─────── */
  const animEls = document.querySelectorAll('.animate');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animEls.forEach((el) => observer.observe(el));

  /* ── 2. Navbar — add shadow on scroll ─────────────────── */
  const navbar = document.querySelector('.navbar');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── 3. Mobile hamburger menu ─────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── 4. Custom cursor (pointer devices only) ──────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const dot  = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId  = null;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dot) {
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
      }

      if (!rafId) rafId = requestAnimationFrame(animateRing);
    });

    function animateRing() {
      rafId = null;
      if (!ring) return;

      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;

      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';

      if (Math.abs(mouseX - ringX) > 0.5 || Math.abs(mouseY - ringY) > 0.5) {
        rafId = requestAnimationFrame(animateRing);
      }
    }

    // Grow ring on interactive elements
    const interactives = document.querySelectorAll('a, button');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (dot)  dot.style.transform  = 'translate(-50%,-50%) scale(2)';
        if (ring) { ring.style.width = '56px'; ring.style.height = '56px'; ring.style.opacity = '.18'; }
      });
      el.addEventListener('mouseleave', () => {
        if (dot)  dot.style.transform  = 'translate(-50%,-50%) scale(1)';
        if (ring) { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.opacity = '.35'; }
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      if (dot)  dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (dot)  dot.style.opacity = '1';
      if (ring) ring.style.opacity = '.35';
    });
  }

  /* ── 5. Animate stats numbers on scroll ───────────────── */
  const statNums = document.querySelectorAll('.stat__num');

  function animateCount(el) {
    const raw    = el.textContent.trim();           // e.g. "100+"
    const num    = parseInt(raw.replace(/\D/g, ''), 10);
    const suffix = raw.replace(/[\d]/g, '');        // e.g. "+"
    const dur    = 900;
    const start  = performance.now();

    function step(now) {
      const t       = Math.min((now - start) / dur, 1);
      const eased   = 1 - Math.pow(1 - t, 3);      // ease-out cubic
      const current = Math.round(eased * num);
      el.textContent = current + suffix;
      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  statNums.forEach((el) => countObserver.observe(el));

})();
