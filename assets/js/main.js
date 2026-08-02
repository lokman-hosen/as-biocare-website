/* AS BIO CARE LIMITED — shared site behavior */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Loader ---------- */
  var loader = document.getElementById('site-loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () { loader.classList.add('hide'); }, 500);
    });
    setTimeout(function () { loader.classList.add('hide'); }, 2200); // safety fallback
  }

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile nav ---------- */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  var scrim = document.querySelector('.nav-scrim');
  function toggleNav(open) {
    if (!mobileNav) return;
    mobileNav.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (hamburger) hamburger.addEventListener('click', function () { toggleNav(true); });
  var closeBtn = document.querySelector('.mobile-nav-close');
  if (closeBtn) closeBtn.addEventListener('click', function () { toggleNav(false); });
  if (scrim) scrim.addEventListener('click', function () { toggleNav(false); });

  /* ---------- Set active nav link ---------- */
  var current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- Language switch (UI only) ---------- */
  document.querySelectorAll('.lang-switch button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.lang-switch button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-zoom');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Hero slider ---------- */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dots button');
  if (slides.length) {
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove('active');
      if (dots[idx]) dots[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
      if (dots[idx]) dots[idx].classList.add('active');
    }, 5000);
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        slides[idx].classList.remove('active'); dots[idx].classList.remove('active');
        idx = i;
        slides[idx].classList.add('active'); dots[idx].classList.add('active');
      });
    });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1500, start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* ---------- Stat rings ---------- */
  document.querySelectorAll('.stat-ring').forEach(function (ring) {
    var pct = parseFloat(ring.getAttribute('data-pct') || '80');
    var circle = ring.querySelector('.fg');
    if (!circle) return;
    var r = circle.r.baseVal.value;
    var c = 2 * Math.PI * r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c;
    var ringIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          circle.style.strokeDashoffset = c - (pct / 100) * c;
          ringIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    ringIO.observe(ring);
  });

  /* ---------- Testimonial slider ---------- */
  var tSlider = document.querySelector('.testimonial-slider');
  if (tSlider) {
    var track = tSlider.querySelector('.t-track');
    var items = tSlider.querySelectorAll('.t-slide');
    var tIdx = 0;
    function showT(i) {
      track.style.transform = 'translateX(-' + (i * 100) + '%)';
    }
    var prevT = tSlider.querySelector('.t-prev');
    var nextT = tSlider.querySelector('.t-next');
    if (nextT) nextT.addEventListener('click', function () { tIdx = (tIdx + 1) % items.length; showT(tIdx); });
    if (prevT) prevT.addEventListener('click', function () { tIdx = (tIdx - 1 + items.length) % items.length; showT(tIdx); });
    setInterval(function () { tIdx = (tIdx + 1) % items.length; showT(tIdx); }, 6000);
  }

  /* ---------- Scroll to top ---------- */
  var scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    window.addEventListener('scroll', function () {
      scrollTop.classList.toggle('show', window.scrollY > 480);
    }, { passive: true });
    scrollTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion-item .accordion-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.parentElement;
      var body = item.querySelector('.accordion-body');
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.accordion-body').style.maxHeight = null;
      });
      if (!wasOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var btns = tabs.querySelectorAll('.tab-btn');
    var panels = tabs.querySelectorAll('.tab-panel');
    btns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        panels[i].classList.add('active');
      });
    });
  });

  /* ---------- Product category filter ---------- */
  var chipRow = document.querySelector('.chip-row[data-filter]');
  if (chipRow) {
    var chips = chipRow.querySelectorAll('.chip');
    var cards = document.querySelectorAll('[data-category]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var cat = chip.getAttribute('data-chip');
        cards.forEach(function (card) {
          card.style.display = (cat === 'all' || card.getAttribute('data-category') === cat) ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Product search ---------- */
  var searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('[data-name]').forEach(function (card) {
        var name = card.getAttribute('data-name').toLowerCase();
        card.style.display = name.indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    document.querySelectorAll('.gallery-item').forEach(function (item) {
      item.addEventListener('click', function () {
        lbImg.src = item.querySelector('img').src;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', function () { lightbox.classList.remove('open'); });
  }

  /* ---------- Button ripple position ---------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('pointermove', function (e) {
      var rect = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', (e.clientX - rect.left) + 'px');
      btn.style.setProperty('--ry', (e.clientY - rect.top) + 'px');
    });
  });

  /* ---------- Typing effect ---------- */
  document.querySelectorAll('[data-typing]').forEach(function (el) {
    var words = JSON.parse(el.getAttribute('data-typing'));
    var wi = 0, ci = 0, deleting = false;
    el.classList.add('typing-cursor');
    function tick() {
      var word = words[wi];
      el.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
      var delay = deleting ? 45 : 90;
      if (!deleting && ci === word.length + 1) { delay = 1600; deleting = true; }
      if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
      setTimeout(tick, delay);
    }
    tick();
  });

  /* ---------- Contact / newsletter forms (UI only) ---------- */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var alertBox = form.querySelector('.alert');
      if (alertBox) alertBox.style.display = 'flex';
      form.reset();
      if (alertBox) setTimeout(function () { alertBox.style.display = 'none'; }, 4500);
    });
  });

});
