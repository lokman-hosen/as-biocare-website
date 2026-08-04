/* AS Bio Care & Agro Science Limited — shared site behavior (Tailwind-only build) */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Loader ---------- */
  var loader = document.getElementById('site-loader');
  var loaderFill = document.getElementById('loader-bar-fill');
  if (loaderFill) setTimeout(function () { loaderFill.style.width = '100%'; }, 50);
  function hideLoader() {
    if (!loader) return;
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    loader.style.pointerEvents = 'none';
  }
  if (loader) {
    window.addEventListener('load', function () { setTimeout(hideLoader, 500); });
    setTimeout(hideLoader, 2200); // safety fallback
  }

  /* ---------- Header scroll state (inline styles: always reliable) ---------- */
  var header = document.getElementById('site-header');
  var brandLogo = document.getElementById('brand-logo');
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.style.background = 'rgba(7 42 69 / 85%)';
      header.style.backdropFilter = 'blur(20px)';
      header.style.webkitBackdropFilter = 'blur(20px)';
      header.style.boxShadow = '0 6px 24px rgba(14,42,71,.12)';
      header.style.paddingTop = '10px';
      header.style.paddingBottom = '10px';
      if (brandLogo) { brandLogo.style.height = '38px'; brandLogo.style.width = '38px'; }
    } else {
      header.style.background = '';
      header.style.backdropFilter = '';
      header.style.webkitBackdropFilter = '';
      header.style.boxShadow = '';
      header.style.paddingTop = '';
      header.style.paddingBottom = '';
      if (brandLogo) { brandLogo.style.height = ''; brandLogo.style.width = ''; }
    }
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile nav (inline styles: guaranteed to work) ---------- */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  var scrim = document.getElementById('nav-scrim');

  function toggleNav(open) {
    if (!mobileNav) return;
    mobileNav.style.right = open ? '0' : '-100%';
    if (scrim) {
      scrim.style.opacity = open ? '1' : '0';
      scrim.style.visibility = open ? 'visible' : 'hidden';
      scrim.style.pointerEvents = open ? 'auto' : 'none';
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.preventDefault();
      toggleNav(true);
    });
  }
  var closeBtn = document.querySelector('.mobile-nav-close');
  if (closeBtn) closeBtn.addEventListener('click', function () { toggleNav(false); });
  if (scrim) scrim.addEventListener('click', function () { toggleNav(false); });
  // Close the menu automatically if the viewport is resized past the mobile breakpoint
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) toggleNav(false);
  });

  /* ---------- Set active nav link ---------- */
  var current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-link').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('text-primary');
      a.classList.remove('text-navy');
    }
  });

  /* ---------- Language switch (UI only) ---------- */
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.lang-btn').forEach(function (b) {
        b.style.background = '';
        b.style.color = '';
      });
      btn.style.background = '#2762B5';
      btn.style.color = '#fff';
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver, inline styles) ---------- */
  var revealMap = {
    fade: { hidden: { opacity: '0', transform: 'translateY(28px)' }, visible: { opacity: '1', transform: 'translateY(0)' } },
    left: { hidden: { opacity: '0', transform: 'translateX(-28px)' }, visible: { opacity: '1', transform: 'translateX(0)' } },
    right: { hidden: { opacity: '0', transform: 'translateX(28px)' }, visible: { opacity: '1', transform: 'translateX(0)' } },
    zoom: { hidden: { opacity: '0', transform: 'scale(0.95)' }, visible: { opacity: '1', transform: 'scale(1)' } }
  };
  var revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach(function (el) {
    var type = el.getAttribute('data-reveal') || 'fade';
    var m = revealMap[type] || revealMap.fade;
    el.style.transition = 'opacity .7s ease-out, transform .7s ease-out';
    el.style.opacity = m.hidden.opacity;
    el.style.transform = m.hidden.transform;
  });
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var type = el.getAttribute('data-reveal') || 'fade';
          var m = revealMap[type] || revealMap.fade;
          el.style.opacity = m.visible.opacity;
          el.style.transform = m.visible.transform;
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) {
      var type = el.getAttribute('data-reveal') || 'fade';
      var m = revealMap[type] || revealMap.fade;
      el.style.opacity = m.visible.opacity;
      el.style.transform = m.visible.transform;
    });
  }

  /* ---------- Hero slider ---------- */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dot');
  function activateSlide(i) {
    slides.forEach(function (s, idx) { s.style.opacity = idx === i ? '1' : '0'; });
    dots.forEach(function (d, idx) {
      if (idx === i) {
        d.style.background = '#1F9E4C';
        d.style.width = '24px';
        d.style.borderRadius = '6px';
      } else {
        d.style.background = 'rgba(255,255,255,.35)';
        d.style.width = '10px';
        d.style.borderRadius = '9999px';
      }
    });
  }
  if (slides.length) {
    var idx = 0;
    activateSlide(0);
    setInterval(function () { idx = (idx + 1) % slides.length; activateSlide(idx); }, 5000);
    dots.forEach(function (d, i) { d.addEventListener('click', function () { idx = i; activateSlide(idx); }); });
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
    circle.style.transition = 'stroke-dashoffset 1.4s ease-out';
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
    function showT(i) { track.style.transform = 'translateX(-' + (i * 100) + '%)'; }
    var prevT = tSlider.parentElement.querySelector('.t-prev');
    var nextT = tSlider.parentElement.querySelector('.t-next');
    if (nextT) nextT.addEventListener('click', function () { tIdx = (tIdx + 1) % items.length; showT(tIdx); });
    if (prevT) prevT.addEventListener('click', function () { tIdx = (tIdx - 1 + items.length) % items.length; showT(tIdx); });
    setInterval(function () { tIdx = (tIdx + 1) % items.length; showT(tIdx); }, 6000);
  }

  /* ---------- Scroll to top ---------- */
  var scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    window.addEventListener('scroll', function () {
      var show = window.scrollY > 480;
      scrollTop.style.opacity = show ? '1' : '0';
      scrollTop.style.visibility = show ? 'visible' : 'hidden';
      scrollTop.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
    }, { passive: true });
    scrollTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion-item .accordion-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.parentElement;
      var body = item.querySelector('.accordion-body');
      var icon = head.querySelector('i');
      var wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('is-open');
        i.querySelector('.accordion-body').style.maxHeight = null;
        var ic = i.querySelector('.accordion-head i');
        if (ic) ic.style.transform = '';
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var btns = tabs.querySelectorAll('.tab-btn');
    var panels = tabs.querySelectorAll('.tab-panel');
    btns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) {
          b.classList.remove('text-primary', 'border-primary');
          b.classList.add('text-slate', 'border-transparent');
        });
        panels.forEach(function (p) { p.classList.add('hidden'); });
        btn.classList.add('text-primary', 'border-primary');
        btn.classList.remove('text-slate', 'border-transparent');
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
        chips.forEach(function (c) {
          c.style.background = '';
          c.style.color = '';
          c.style.borderColor = '';
        });
        chip.style.background = '#2762B5';
        chip.style.color = '#fff';
        chip.style.borderColor = '#2762B5';
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
    lightbox.addEventListener('click', function () {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
    });
  }

  /* ---------- Typing effect ---------- */
  document.querySelectorAll('[data-typing]').forEach(function (el) {
    var words = JSON.parse(el.getAttribute('data-typing'));
    var wi = 0, ci = 0, deleting = false;
    el.style.borderRight = '2px solid #1F9E4C';
    el.style.paddingRight = '2px';
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