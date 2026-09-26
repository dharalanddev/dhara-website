// Dhara — small site behaviours (no dependencies)
(function () {
  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Zoho WebToLead forms: fold the extra qualification answers (fields marked
  // data-label) into the standard Description field, so they reach the CRM
  // without needing custom fields on the free CRM edition.
  document.querySelectorAll('form[data-zoho]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (form.querySelector('.hp input') && form.querySelector('.hp input').value) {
        e.preventDefault(); // honeypot tripped
        return;
      }
      var lines = [];
      form.querySelectorAll('[data-label]').forEach(function (el) {
        if (el.value && el.value.trim()) lines.push(el.dataset.label + ': ' + el.value.trim());
      });
      var page = form.dataset.zoho;
      lines.push('Submitted from: ' + page + ' (' + location.pathname + ')');
      var desc = form.querySelector('[name="Description"]');
      if (desc) desc.value = lines.join('\n');
    });
  });
})();
