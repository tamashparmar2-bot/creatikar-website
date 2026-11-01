/* ═══════════════════════════════════════════════════════════
   CREATIKAR — contact.js
   Handles: form validation, FAQ accordion, copy buttons,
            fade-up observer (inherits from script.js)
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     1. COPY BUTTONS (phone + email)
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 2200);
    });
  });

  /* ══════════════════════════════════════════════════════
     2. FAQ ACCORDION
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.faq-item__q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer   = document.getElementById(answerId);

      // Close all open items first
      document.querySelectorAll('.faq-item__q[aria-expanded="true"]').forEach((openBtn) => {
        openBtn.setAttribute('aria-expanded', 'false');
        const openAnswer = document.getElementById(openBtn.getAttribute('aria-controls'));
        if (openAnswer) openAnswer.hidden = true;
      });

      // Toggle clicked item
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.hidden = false;
      }
    });
  });

  /* ══════════════════════════════════════════════════════
     3. CONTACT FORM — Validation + Submission
  ══════════════════════════════════════════════════════ */
  const form       = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');

  if (!form) return;

  /* ── Validation helpers ── */
  function showError(inputId, errId, msg) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errId);
    if (input) input.classList.add('error');
    if (err)   err.textContent = msg;
    return false;
  }

  function clearError(inputId, errId) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errId);
    if (input) input.classList.remove('error');
    if (err)   err.textContent = '';
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validatePhone(v) {
    return /^[+\d\s\-]{7,15}$/.test(v.trim());
  }

  /* ── Live clear on input ── */
  [
    ['name',    'nameErr'],
    ['email',   'emailErr'],
    ['phone',   'phoneErr'],
    ['service', 'serviceErr'],
    ['message', 'msgErr'],
  ].forEach(([inputId, errId]) => {
    const el = document.getElementById(inputId);
    if (el) el.addEventListener('input', () => clearError(inputId, errId));
  });

  /* ── Form submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    ['nameErr','emailErr','phoneErr','serviceErr','msgErr'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    ['name','email','phone','service','message'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('error');
    });

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    let valid = true;

    if (!name)
      valid = showError('name', 'nameErr', 'Please enter your name.');

    if (!email || !validateEmail(email))
      valid = showError('email', 'emailErr', 'Please enter a valid email address.');

    if (!phone || !validatePhone(phone))
      valid = showError('phone', 'phoneErr', 'Please enter a valid phone number.');

    if (!service)
      valid = showError('service', 'serviceErr', 'Please select a service.');

    if (!message)
      valid = showError('message', 'msgErr', 'Please tell us about your project.');

    if (!valid) {
      // Scroll to first error
      const firstErr = form.querySelector('.field-input.error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    /* ── Submit to Formspree (or swap for EmailJS / your backend) ── */
    submitBtn.setAttribute('data-loading', 'true');
    submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (res.ok) {
        // Show success state
        form.hidden = true;
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        throw new Error('Server error');
      }
    } catch {
      // Fallback: still show success for demo / before Formspree is wired
      form.hidden = true;
      successBox.hidden = false;
      successBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
      submitBtn.removeAttribute('data-loading');
      submitBtn.disabled = false;
    }
  });

  /* ══════════════════════════════════════════════════════
     4. DETAIL BLOCK — Stagger fade-up
  ══════════════════════════════════════════════════════ */
  const detailBlocks = document.querySelectorAll('.detail-block');
  detailBlocks.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`;
  });

  const blockObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          blockObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  detailBlocks.forEach((el) => blockObs.observe(el));

  /* ══════════════════════════════════════════════════════
     5. QUICK BUTTONS — Stagger
  ══════════════════════════════════════════════════════ */
  const quickBtns = document.querySelectorAll('.quick-btn');
  quickBtns.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = `opacity .45s ease ${i * 0.1}s, transform .45s ease ${i * 0.1}s`;
  });

  const quickObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          quickObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  quickBtns.forEach((el) => quickObs.observe(el));

})();
