// Dhara — small site behaviours (no dependencies)
(function () {
  // ---- Header: soft edge only once content scrolls under it ----
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 4); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Mobile nav: open/close, ✕ icon, close on link / Escape / outside tap ----
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('pointerdown', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
  }

  // ---- Footer year ----
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---- Forms: inline validation, "Sending…" state, Zoho Description folding ----
  var messages = {
    valueMissing: 'Please fill this in.',
    typeMismatch: 'Please enter a valid email address.',
    tooShort: 'This looks too short.',
    consent: 'Please tick this box so we can contact you.',
    phone: 'Please enter a phone number we can reach you on.'
  };

  function errorFor(el) {
    if (el.type === 'checkbox') return el.required && !el.checked ? messages.consent : '';
    if (el.validity.valueMissing) return messages.valueMissing;
    if (el.validity.typeMismatch) return messages.typeMismatch;
    if (el.type === 'tel' && el.value.trim() && el.value.replace(/\D/g, '').length < 8) return messages.phone;
    return '';
  }

  function fieldBox(el) { return el.closest('.field') || el.closest('.consent') || el.parentNode; }

  function showError(el, msg) {
    var box = fieldBox(el);
    var err = box.querySelector('.field-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'field-error';
      err.id = (el.id || el.name || 'f') + '-error';
      box.appendChild(err);
    }
    err.textContent = msg;
    box.classList.toggle('invalid', !!msg);
    box.classList.toggle('valid', !msg && !!el.value);
    if (msg) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', err.id); }
    else { el.removeAttribute('aria-invalid'); }
    return !msg;
  }

  document.querySelectorAll('form[data-zoho]').forEach(function (form) {
    form.noValidate = true; // we show friendly inline messages instead of browser pop-ups
    var inputs = form.querySelectorAll('input[required], select[required], textarea[required], input[type=email], input[type=tel]');
    var btn = form.querySelector('button[type=submit]');
    var btnLabel = btn ? btn.textContent : '';

    inputs.forEach(function (el) {
      if (el.closest('.hp')) return;
      el.addEventListener('blur', function () { if (el.value || el.dataset.touched) showError(el, errorFor(el)); el.dataset.touched = '1'; });
      el.addEventListener('input', function () { if (fieldBox(el).classList.contains('invalid')) showError(el, errorFor(el)); });
      el.addEventListener('change', function () { if (el.type === 'checkbox') showError(el, errorFor(el)); });
    });

    form.addEventListener('submit', function (e) {
      var hp = form.querySelector('.hp input');
      if (hp && hp.value) { e.preventDefault(); return; } // honeypot tripped

      var firstBad = null;
      inputs.forEach(function (el) {
        if (el.closest('.hp')) return;
        if (!showError(el, errorFor(el)) && !firstBad) firstBad = el;
      });
      if (firstBad) { e.preventDefault(); firstBad.focus(); return; }

      // Fold the qualification answers into Zoho's Description field
      var lines = [];
      form.querySelectorAll('[data-label]').forEach(function (el) {
        if (el.value && el.value.trim()) lines.push(el.dataset.label + ': ' + el.value.trim());
      });
      lines.push('Submitted from: ' + form.dataset.zoho + ' (' + location.pathname + ')');
      var desc = form.querySelector('[name="Description"]');
      if (desc) desc.value = lines.join('\n');

      // Immediate, unambiguous feedback + no double submits
      if (btn) {
        btn.disabled = true;
        btn.classList.add('is-sending');
        btn.textContent = 'Sending…';
        btn.setAttribute('aria-live', 'polite');
      }
    });

    // If the visitor comes back with the browser's Back button, re-enable the form
    window.addEventListener('pageshow', function () {
      if (btn) { btn.disabled = false; btn.classList.remove('is-sending'); btn.textContent = btnLabel; }
    });
  });
})();
