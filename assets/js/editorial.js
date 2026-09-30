/* Editorial theme: header state, reading progress, scroll reveals, and the scrollytelling engine. */
(function () {
  "use strict";
  var nav = document.getElementById('site-nav');
  var bar = document.getElementById('read-progress');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (bar) {
      var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // ---- scroll reveals ----
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.story,.sc-tile,.featured,.sci-wrap,.prose > h2,.prose > blockquote,.glance,.vocab,.author-box,.callout').forEach(function (el) {
      el.classList.add('rv'); io.observe(el);
    });
  }

  // ---- scrollytelling: any .scrolly with .step children ----
  document.querySelectorAll('.scrolly').forEach(function (sc) {
    var steps = [].slice.call(sc.querySelectorAll('.step'));
    if (!steps.length || !('IntersectionObserver' in window)) return;
    var current = -1;
    sc.classList.add('js-ready');

    function setStep(i) {
      if (i === current || i < 0) return;
      current = i;
      steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      sc.dispatchEvent(new CustomEvent('scrolly:step', { detail: { index: i } }));
    }

    var mobile = window.matchMedia('(max-width:860px)');
    function watch() {
      if (sc._io) sc._io.disconnect();
      var margin = mobile.matches ? '-56% 0px -18% 0px' : '-42% 0px -42% 0px';
      sc._io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setStep(steps.indexOf(e.target)); });
      }, { rootMargin: margin, threshold: 0 });
      steps.forEach(function (s) { sc._io.observe(s); });
    }
    watch();
    if (mobile.addEventListener) mobile.addEventListener('change', watch);
    setStep(0);
  });
})();
