(function () {
  var hamburger = document.querySelector('.hamburger');
  var navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  document.querySelectorAll('.nav-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        var li = this.parentElement;
        document.querySelectorAll('.nav-dropdown').forEach(function (el) {
          if (el !== li) el.classList.remove('open');
        });
        li.classList.toggle('open');
      }
    });
  });

  // Rate tabs
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.dataset.tab;
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  // Forms — submit via Formsubmit AJAX → info@furtherfinance.com.au
  document.querySelectorAll('.enquiry-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type=submit]');
      var orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      var data = {};
      new FormData(form).forEach(function (val, key) { data[key] = val; });

      fetch('https://formsubmit.co/ajax/info@furtherfinance.com.au', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function (res) { return res.json(); })
      .then(function () {
        btn.textContent = btn.getAttribute('data-success') || 'Sent!';
        setTimeout(function () {
          btn.textContent = orig;
          btn.disabled = false;
          form.reset();
        }, 4000);
      })
      .catch(function () {
        btn.textContent = 'Error — please try again';
        setTimeout(function () {
          btn.textContent = orig;
          btn.disabled = false;
        }, 3000);
      });
    });
  });
}());
