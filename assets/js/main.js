/* AS BIO CARE LIMITED — shared site behavior (Tailwind-utility-driven) */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Loader ---------- */
  var loader = document.getElementById('site-loader');
  var loaderBar = document.getElementById('loader-bar-fill');
  if (loaderBar) { requestAnimationFrame(function () { loaderBar.classList.remove('w-0'); loaderBar.classList.add('w-full'); }); }
  if (loader) {
    function hideLoader() {
      loader.classList.add('opacity-0', 'invisible', 'pointer-events-none');
    }
    window.addEventListener('load', function () { setTimeout(hideLoader, 500); });
    setTimeout(hideLoader, 2200); // safety fallback
  }

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  var SCROLLED_ON = ['bg-white/80', 'backdrop-blur-lg', 'shadow-[0_6px_24px_rgba(14,42,71,.08)]', 'py-2'];
  var SCROLLED_OFF = ['py-[18px]'];
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      SCROLLED_OFF.forEach(function (c) { header.classList.remove(c); });
      SCROLLED_ON.forEach(function (c) { header.classList.add(c); });
    } else {
      SCROLLED_ON.forEach(function (c) { header.classList.remove(c); });
      SCROLLED_OFF.forEach(function (c) { header.classList.add(c); });
    }
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile nav ---------- */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  var scrim = document.querySelector('.nav-scrim');
  function toggleNav(open) {
    if (!mobileNav) return;
    if (open) { mobileNav.classList.remove('right-[-100%]'); mobileNav.classList.add('right-0'); }
    else { mobileNav.classList.add('right-[-100%]'); mobileNav.classList.remove('right-0'); }
    if (scrim) {
      if (open) { scrim.classList.remove('opacity-0', 'invisible'); scrim.classList.add('opacity-100', 'visible'); }
      else { scrim.classList.add('opacity-0', 'invisible'); scrim.classList.remove('opacity-100', 'visible'); }
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (hamburger) hamburger.addEventListener('click', function () { toggleNav(true); });
  var closeBtn = document.querySelector('.mobile-nav-close');
  if (closeBtn) closeBtn.addEventListener('click', function () { toggleNav(false); });
  if (scrim) scrim.addEventListener('click', function () { toggleNav(false); });

  /* ---------- Active nav link ---------- */
  var current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('text-primary');
      a.classList.remove('text-navy');
      var underline = a.querySelector('.nav-underline');
      if (underline) underline.classList.add('scale-x-100');
    }
  });

  /* ---------- Language switch (UI only) ---------- */
  document.querySelectorAll('.lang-switch button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.lang-switch button').forEach(function (b) {
        b.classList.remove('bg-primary', 'text-white');
        b.classList.add('text-muted');
      });
      btn.classList.add('bg-primary', 'text-white');
      btn.classList.remove('text-muted');
    });
  });

  /* ---------- Scroll reveal ---------- */
  var HIDDEN = {
    up: ['opacity-0', 'translate-y-8'],
    left: ['opacity-0', '-translate-x-8'],
    right: ['opacity-0', 'translate-x-8'],
    zoom: ['opacity-0', 'scale-95']
  };
  var SHOWN = {
    up: ['opacity-100', 'translate-y-0'],
    left: ['opacity-100', 'translate-x-0'],
    right: ['opacity-100', 'translate-x-0'],
    zoom: ['opacity-100', 'scale-100']
  };
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var type = entry.target.getAttribute('data-reveal') || 'up';
          HIDDEN[type].forEach(function (c) { entry.target.classList.remove(c); });
          SHOWN[type].forEach(function (c) { entry.target.classList.add(c); });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero slider ---------- */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dots button');
  if (slides.length) {
    var idx = 0;
    function setActiveSlide(i) {
      slides.forEach(function (s, si) {
        s.classList.toggle('opacity-100', si === i);
        s.classList.toggle('opacity-0', si !== i);
      });
      dots.forEach(function (d, di) {
        d.classList.toggle('bg-secondary', di === i);
        d.classList.toggle('w-6', di === i);
        d.classList.toggle('rounded-md', di === i);
        d.classList.toggle('bg-white/35', di !== i);
        d.classList.toggle('w-[9px]', di !== i);
      });
    }
    setActiveSlide(0);
    setInterval(function () { idx = (idx + 1) % slides.length; setActiveSlide(idx); }, 5000);
    dots.forEach(function (d, i) { d.addEventListener('click', function () { idx = i; setActiveSlide(idx); }); });
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
          circle.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)';
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
    function showT(i) { track.style.transform = 'translateX(-' + (i * 100) + '%)'; }
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
      var show = window.scrollY > 480;
      scrollTop.classList.toggle('opacity-100', show);
      scrollTop.classList.toggle('visible', show);
      scrollTop.classList.toggle('translate-y-0', show);
      scrollTop.classList.toggle('opacity-0', !show);
      scrollTop.classList.toggle('invisible', !show);
      scrollTop.classList.toggle('translate-y-2', !show);
    }, { passive: true });
    scrollTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion-item .accordion-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.parentElement;
      var body = item.querySelector('.accordion-body');
      var icon = head.querySelector('.accordion-icon');
      var wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('is-open');
        i.querySelector('.accordion-body').style.maxHeight = null;
        var ic = i.querySelector('.accordion-icon');
        if (ic) ic.classList.remove('rotate-180');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var btns = tabs.querySelectorAll('.tab-btn');
    var panels = tabs.querySelectorAll('.tab-panel');
    btns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('text-primary', 'border-primary'); b.classList.add('text-muted', 'border-transparent'); });
        panels.forEach(function (p) { p.classList.add('hidden'); });
        btn.classList.add('text-primary', 'border-primary');
        btn.classList.remove('text-muted', 'border-transparent');
        panels[i].classList.remove('hidden');
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
        chips.forEach(function (c) { c.classList.remove('bg-primary', 'border-primary', 'text-white'); });
        chip.classList.add('bg-primary', 'border-primary', 'text-white');
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
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
      });
    });
    lightbox.addEventListener('click', function () { lightbox.classList.add('hidden'); lightbox.classList.remove('flex'); });
  }

  /* ---------- Typing effect ---------- */
  document.querySelectorAll('[data-typing]').forEach(function (el) {
    var words = JSON.parse(el.getAttribute('data-typing'));
    var wi = 0, ci = 0, deleting = false;
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
      if (alertBox) { alertBox.classList.remove('hidden'); alertBox.classList.add('flex'); }
      form.reset();
      if (alertBox) setTimeout(function () { alertBox.classList.add('hidden'); alertBox.classList.remove('flex'); }, 4500);
    });
  });

});