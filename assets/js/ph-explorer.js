/* pH explorer: a slider + beaker, and a guessing game. Runs entirely in the browser. */
(function () {
  "use strict";
  var mount = document.getElementById('ph-explorer');
  if (!mount) return;

  // Colors follow a "universal indicator" style scale (illustrative).
  var STOPS = [[0,'#E8262A'],[2,'#F2552C'],[3,'#F58A2C'],[4,'#F7B32B'],[5,'#F3DC2C'],[6,'#C6DA2E'],[7,'#5DB64C'],
               [8,'#2FB4A0'],[9,'#2E8FD0'],[10,'#3B62C9'],[11,'#5A46B8'],[12,'#6E3AA8'],[14,'#7A2E8E']];

  // Approximate, typical values. Real products vary.
  var SUBSTANCES = [
    { en: 'stomach acid',            ph: 1.5 },
    { en: 'lemon juice',             ph: 2 },
    { en: 'cola',                    ph: 2.5 },
    { en: 'vinegar',                 ph: 2.8 },
    { en: 'orange juice',            ph: 3.5 },
    { en: 'tomato',                  ph: 4.5 },
    { en: 'black coffee',            ph: 5 },
    { en: 'rainwater',               ph: 5.6 },
    { en: 'milk',                    ph: 6.6 },
    { en: 'pure water',              ph: 7 },
    { en: 'blood',                   ph: 7.4 },
    { en: 'seawater',                ph: 8.1 },
    { en: 'baking soda (in water)',  ph: 8.3 },
    { en: 'hand soap',               ph: 9.5 },
    { en: 'milk of magnesia',        ph: 10.5 },
    { en: 'household ammonia',       ph: 11.5 },
    { en: 'bleach',                  ph: 12.5 }
  ].sort(function (a, b) { return a.ph - b.ph; });

  var THUMB = 26; // px, must match CSS

  function hexToRgb(h) {
    return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)];
  }
  function colorAt(ph) {
    ph = Math.max(0, Math.min(14, ph));
    for (var i = 1; i < STOPS.length; i++) {
      if (ph <= STOPS[i][0]) {
        var a = STOPS[i - 1], b = STOPS[i];
        var t = (ph - a[0]) / (b[0] - a[0]);
        var ca = hexToRgb(a[1]), cb = hexToRgb(b[1]);
        return 'rgb(' + [0, 1, 2].map(function (k) { return Math.round(ca[k] + (cb[k] - ca[k]) * t); }).join(',') + ')';
      }
    }
    return STOPS[STOPS.length - 1][1];
  }
  function gradient() {
    return 'linear-gradient(90deg,' + STOPS.map(function (s) { return s[1] + ' ' + (s[0] / 14 * 100).toFixed(2) + '%'; }).join(',') + ')';
  }
  function describe(ph) {
    if (ph < 3)    return 'very acidic';
    if (ph < 6.5)  return 'acidic';
    if (ph <= 7.5) return 'neutral';
    if (ph < 11)   return 'basic';
    return 'very basic';
  }

  mount.innerHTML =
    '<div class="phx-tabs" role="tablist" aria-label="Mode">' +
      '<button type="button" class="phx-tab" role="tab" data-mode="explore" aria-selected="true">Explore</button>' +
      '<button type="button" class="phx-tab" role="tab" data-mode="guess" aria-selected="false">Guess</button>' +
    '</div>' +
    '<div class="phx-stage">' +
      '<svg class="phx-beaker" viewBox="0 0 160 190" role="img" aria-label="Beaker with colored liquid">' +
        '<defs><clipPath id="phx-clip"><path d="M30 20 L30 150 Q30 172 52 172 L108 172 Q130 172 130 150 L130 20 Z"/></clipPath></defs>' +
        '<rect class="phx-liquid" x="20" y="64" width="120" height="120" clip-path="url(#phx-clip)"/>' +
        '<g class="phx-marks"><path d="M30 90h12M30 115h12M30 140h12"/></g>' +
        '<path class="phx-glass" d="M24 14 L30 20 L30 150 Q30 172 52 172 L108 172 Q130 172 130 150 L130 20 L136 14" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      '<div class="phx-read">' +
        '<div class="phx-num" aria-live="polite">pH <b class="phx-val">7.0</b></div>' +
        '<div class="phx-label"><span class="phx-l-en"></span></div>' +
        '<div class="phx-near"></div>' +
      '</div>' +
    '</div>' +
    '<div class="phx-sliderwrap">' +
      '<div class="phx-real" hidden><span class="phx-real-t"></span></div>' +
      '<input class="phx-range" type="range" min="0" max="14" step="0.1" value="7" aria-label="pH">' +
      '<div class="phx-scale"><span>0 &middot; acid</span><span>7 &middot; neutral</span><span>14 &middot; basic</span></div>' +
    '</div>' +
    '<div class="phx-explore">' +
      '<p class="phx-hint">Tap something to see its pH.</p>' +
      '<div class="phx-chips"></div>' +
    '</div>' +
    '<div class="phx-guess" hidden>' +
      '<p class="phx-q"><span class="phx-q-lead">Guess the pH of</span><span class="phx-q-name"><b class="phx-q-en"></b></span></p>' +
      '<p class="phx-hint">Slide to where you think it is.</p>' +
      '<div class="phx-actions">' +
        '<button type="button" class="pill-btn pill-btn-primary phx-check">Check</button>' +
        '<button type="button" class="pill-btn pill-btn-outline phx-next" hidden>Next</button>' +
      '</div>' +
      '<p class="phx-result" aria-live="polite"></p>' +
      '<p class="phx-score"></p>' +
    '</div>' +
    '<p class="phx-foot">Approximate values; real products vary. Never taste or mix cleaning products.</p>';

  function $(sel) { return mount.querySelector(sel); }
  var range = $('.phx-range'), liquid = $('.phx-liquid'), valEl = $('.phx-val');
  var lEn = $('.phx-l-en'), nearEl = $('.phx-near');
  var explorePanel = $('.phx-explore'), guessPanel = $('.phx-guess'), chipsEl = $('.phx-chips');
  var qEn = $('.phx-q-en'), resultEl = $('.phx-result'), scoreEl = $('.phx-score');
  var checkBtn = $('.phx-check'), nextBtn = $('.phx-next');
  var realEl = $('.phx-real'), realT = $('.phx-real-t');
  var tabs = mount.querySelectorAll('.phx-tab');

  mount.style.setProperty('--phx-grad', gradient());
  var mode = 'explore';
  var game = { cur: null, checked: false, hits: 0, rounds: 0, last: -1 };

  function pinLeft(ph) {
    var pct = ph / 14;
    return 'calc(' + (pct * 100).toFixed(2) + '% + ' + ((0.5 - pct) * THUMB).toFixed(1) + 'px)';
  }

  var chipButtons = SUBSTANCES.map(function (s) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'phx-chip';
    b.setAttribute('aria-pressed', 'false');
    var en = document.createElement('span'); en.className = 'phx-chip-en'; en.textContent = s.en;
    var ph = document.createElement('span'); ph.className = 'phx-chip-ph'; ph.textContent = 'pH ' + s.ph;
    b.appendChild(en); b.appendChild(ph);
    b.addEventListener('click', function () {
      if (mode !== 'explore') return;
      range.value = s.ph;
      render(s.ph);
    });
    chipsEl.appendChild(b);
    return b;
  });

  function render(ph) {
    var v = Math.round(ph * 10) / 10;
    liquid.style.fill = colorAt(v);
    valEl.textContent = v.toFixed(1);
    var d = describe(v);
    lEn.textContent = d;
    range.setAttribute('aria-valuetext', 'pH ' + v.toFixed(1) + ', ' + d);
    chipButtons.forEach(function (b, i) {
      b.setAttribute('aria-pressed', Math.abs(SUBSTANCES[i].ph - v) < 0.05 ? 'true' : 'false');
    });
    if (mode === 'explore') {
      var best = null, bd = 99;
      SUBSTANCES.forEach(function (s) {
        var diff = Math.abs(s.ph - v);
        if (diff < bd) { bd = diff; best = s; }
      });
      nearEl.textContent = bd <= 0.8 ? 'Close to: ' + best.en : 'Nothing on the list is right here.';
    } else {
      nearEl.textContent = '';
    }
  }

  range.addEventListener('input', function () { render(parseFloat(range.value)); });

  function newRound() {
    var i;
    do { i = Math.floor(Math.random() * SUBSTANCES.length); } while (i === game.last && SUBSTANCES.length > 1);
    game.last = i;
    game.cur = SUBSTANCES[i];
    game.checked = false;
    qEn.textContent = game.cur.en;
    resultEl.textContent = '';
    realEl.hidden = true;
    range.disabled = false;
    range.value = 7;
    checkBtn.hidden = false;
    nextBtn.hidden = true;
    render(7);
  }

  function updateScore() {
    scoreEl.textContent = game.rounds ? 'Within 1: ' + game.hits + ' of ' + game.rounds : '';
  }

  checkBtn.addEventListener('click', function () {
    if (game.checked || !game.cur) return;
    game.checked = true;
    var guess = parseFloat(range.value);
    var diff = Math.abs(guess - game.cur.ph);
    game.rounds++;
    if (diff <= 1) game.hits++;
    var verdict;
    if (diff <= 0.5)      verdict = 'Nearly perfect!';
    else if (diff <= 1.5) verdict = 'Very close!';
    else if (diff <= 3)   verdict = 'Not bad.';
    else                  verdict = 'Surprise!';
    resultEl.textContent = verdict + ' Actual pH: ' + game.cur.ph + ' \u00b7 you: ' + guess.toFixed(1);
    realT.textContent = 'actual ' + game.cur.ph;
    realEl.style.left = pinLeft(game.cur.ph);
    realEl.hidden = false;
    range.disabled = true;
    checkBtn.hidden = true;
    nextBtn.hidden = false;
    updateScore();
  });
  nextBtn.addEventListener('click', newRound);

  function setMode(m) {
    mode = m;
    tabs.forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-mode') === m ? 'true' : 'false'); });
    explorePanel.hidden = m !== 'explore';
    guessPanel.hidden = m !== 'guess';
    realEl.hidden = true;
    range.disabled = false;
    if (m === 'guess') { newRound(); } else { range.value = 7; render(7); }
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { setMode(t.getAttribute('data-mode')); }); });

  setMode('explore');
})();
