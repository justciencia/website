(function(){
  "use strict";

  // ---- Theme toggle (remembered per visitor) ----
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function(){
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('justciencia-theme', next); } catch(e) {}
    });
  }

  // ---- Scroll progress "battery" ----
  var fill = document.getElementById('battery-fill-rect');
  var pctEl = document.getElementById('battery-pct');
  function updateProgress(){
    var top = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = h > 0 ? Math.min(100, (top / h) * 100) : 0;
    if (fill) {
      fill.setAttribute('width', (pct / 100 * 21).toFixed(1));
      fill.style.fill = pct < 25 ? '#e35444' : (pct <= 75 ? '#f6bb15' : '#508630');
    }
    if (pctEl) pctEl.textContent = Math.round(pct) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // ---- Back to top ----
  var btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', function(){
      btt.classList.toggle('show', window.scrollY > 700);
    }, { passive: true });
    btt.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // ---- Card filters: topic (or field) + language, shared by Stories and Scientists ----
  // Cards carry data-langs ("en", "es", or "en es"). A card that has both versions also carries
  // data-en-* and data-es-* attributes, so choosing a language swaps its text and link to that version.
  window.JCFilter = function (opts) {
    var root = opts.list;
    if (!root) return;
    var cards = Array.prototype.slice.call(root.querySelectorAll(opts.cardSel));
    var topicChips = Array.prototype.slice.call(document.querySelectorAll(opts.topicChipSel));
    var langChips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-lang]'));
    var empty = opts.empty;
    var pageLang = root.getAttribute('data-default-lang') || 'en';
    var state = { topic: 'all', lang: pageLang === 'es' ? 'es' : 'all' };
    var known = {};
    topicChips.forEach(function (c) { known[c.getAttribute('data-filter')] = true; });

    function swap(card, use) {
      Array.prototype.forEach.call(card.querySelectorAll('[data-f]'), function (el) {
        var kind = el.getAttribute('data-f');
        if (kind === 'link') {
          var u = card.getAttribute('data-' + use + '-url'); if (u) el.setAttribute('href', u);
          var d = card.getAttribute('data-' + use + '-dialog'); if (d && el.hasAttribute('data-dialog')) el.setAttribute('data-dialog', d);
        } else {
          var t = card.getAttribute('data-' + use + '-' + kind); if (t !== null) el.textContent = t;
        }
      });
    }
    function apply() {
      var shown = 0;
      cards.forEach(function (card) {
        var topicOk = state.topic === 'all' || card.getAttribute(opts.topicAttr) === state.topic;
        var langs = (card.getAttribute('data-langs') || '').split(' ');
        var langOk = state.lang === 'all' || langs.indexOf(state.lang) > -1;
        var ok = topicOk && langOk;
        card.hidden = !ok;
        if (ok) shown++;
        var use = state.lang === 'all' ? pageLang : state.lang;
        if (!card.hasAttribute('data-' + use + '-url')) use = card.hasAttribute('data-en-url') ? 'en' : 'es';
        swap(card, use);
      });
      topicChips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-filter') === state.topic ? 'true' : 'false'); });
      langChips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-lang') === state.lang ? 'true' : 'false'); });
      if (empty) empty.hidden = shown > 0 || cards.length === 0;   // only say "no matches" when there is something to filter
      root.classList.toggle('filtering', state.topic !== 'all' || state.lang !== 'all');
    }
    topicChips.forEach(function (c) {
      c.addEventListener('click', function () {
        state.topic = c.getAttribute('data-filter');
        apply();
        if (opts.hash) { try { history.replaceState(null, '', state.topic === 'all' ? location.pathname : '#' + state.topic); } catch (e) {} }
      });
    });
    langChips.forEach(function (c) {
      c.addEventListener('click', function () { state.lang = c.getAttribute('data-lang'); apply(); });
    });
    if (opts.hash) {
      var initial = (location.hash || '').replace('#', '');
      if (initial && known[initial]) state.topic = initial;
    }
    apply();
    if (opts.hash && state.topic !== 'all' && root.scrollIntoView) root.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  var storyList = document.getElementById('post-list');
  if (storyList) {
    window.JCFilter({ list: storyList, cardSel: '.post-row', topicAttr: 'data-cat', topicChipSel: '.filters .chip[data-filter]', empty: document.getElementById('empty-note'), hash: true });
  }
})();
