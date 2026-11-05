/* Eringen Mini-Symposium — interactions */
(function () {
  'use strict';

  /* ---- Nav border on scroll ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav (hamburger) ---- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    function closeMenu() {
      nav.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
    function openMenu() {
      nav.classList.add('menu-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close menu');
    }
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('menu-open')) closeMenu(); else openMenu();
    });
    // tapping a link navigates to the section, then closes the menu
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    // close on Escape, on outside click, or when widened back to desktop
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('menu-open')) { closeMenu(); navToggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('menu-open') && !nav.contains(e.target)) closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720 && nav.classList.contains('menu-open')) closeMenu();
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Carousel ---- */
  var track = document.getElementById('track');
  if (track) {
    var slides = track.children;
    var total = slides.length;
    var idx = 0;
    var dots = Array.prototype.slice.call(document.querySelectorAll('#dots button'));
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');
    var timer;

    function go(n) {
      idx = (n + total) % total;
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    }
    function start() { stop(); timer = setInterval(function () { go(idx + 1); }, 6000); }
    function stop() { if (timer) clearInterval(timer); }

    next.addEventListener('click', function () { go(idx + 1); start(); });
    prev.addEventListener('click', function () { go(idx - 1); start(); });
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { go(i); start(); });
    });

    var carousel = track.closest('.carousel');
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    /* touch swipe */
    var x0 = null;
    track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      x0 = null; start();
    });

    /* keyboard */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(idx + 1); start(); }
      else if (e.key === 'ArrowLeft') { go(idx - 1); start(); }
    });

    go(0);
    start();
  }

  /* ---- Lightbox (medal enlarge) ---- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = document.getElementById('lb-img');
    var lbCap = document.getElementById('lb-cap');
    var lbClose = document.getElementById('lb-close');
    var lastFocus = null;

    function openLb(full, cap, alt) {
      lastFocus = document.activeElement;
      lbImg.src = full;
      lbImg.alt = alt || '';
      lbCap.innerHTML = cap || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }
    function closeLb() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('[data-full]').forEach(function (el) {
      el.addEventListener('click', function () {
        var img = el.querySelector('img');
        openLb(el.getAttribute('data-full'), el.getAttribute('data-cap'), img ? img.alt : '');
      });
      // keyboard support for non-native-button triggers (e.g. the hero figure)
      if (el.tagName !== 'BUTTON') {
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
        });
      }
    });
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-fig')) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) closeLb();
    });
  }

  /* ---- Smooth anchor focus offset handled by CSS scroll-padding ---- */
})();
