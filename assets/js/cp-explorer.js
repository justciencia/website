/* Chronopotentiometry explorer: an illustrative constant-current curve you can play with.
   Runs entirely in the browser. The curve is a simple model, not real data. */
(function () {
  "use strict";
  var mount = document.getElementById('cp-explorer');
  if (!mount) return;

  var XMAX = 10, YMAX = 0.5, YMIN = -0.5;          // axis ranges: hours, volts
  var L = 64, R = 620, T = 16, B = 276;            // plot box inside a 640 x 340 viewBox
  var E_REST = 0.40, E1 = 0.15, SLOPE = 0.10, E2 = -0.35;

  function X(t) { return L + (t / XMAX) * (R - L); }
  function Y(e) { return T + ((YMAX - e) / (YMAX - YMIN)) * (B - T); }

  // Illustrative potential (V) at time t (h) when the first material lasts tau hours
  function pot(t, tau) {
    var w = Math.max(0.015 * tau, 0.012);
    var p1 = E1 - SLOPE * (t / tau);
    var p2 = E2 - 0.02 * Math.max(0, t - tau);
    var s = 1 / (1 + Math.exp(-(t - tau) / w));
    var e = p1 * (1 - s) + p2 * s;
    e += (E_REST - E1) * Math.exp(-t / 0.03);      // quick drop from the resting potential
    return Math.max(YMIN + 0.02, Math.min(YMAX - 0.02, e));
  }

  var FEATURES = [
    { n: 1, en: 'Start jump',
      textEn: 'The moment the current switches on, the potential drops quickly from its resting value. Part of the jump is the cell\u2019s resistance (voltage = current \u00d7 resistance), and part is the reaction getting started.' },
    { n: 2, en: 'Plateau',
      textEn: 'The flat stretch shows the potential where the first reaction happens, a bit like a fingerprint: each reaction has its own. A lower or higher plateau at the same current tells you how hard the reaction has to work.' },
    { n: 3, en: 'Transition',
      textEn: 'The first material has run out, so the potential jumps to a new level where another reaction takes over. The time this takes (\u03c4) tells you how much material there was: charge = current \u00d7 time.' },
    { n: 4, en: 'Second plateau',
      textEn: 'A different reaction is now carrying the current. In a real experiment this could be another material, or a side reaction such as making gas.' }
  ];

  var NS = 'http://www.w3.org/2000/svg';
  function grid() {
    var g = '', i, v;
    for (i = 0; i <= 5; i++) { v = i * 2; g += '<line x1="' + X(v).toFixed(1) + '" y1="' + T + '" x2="' + X(v).toFixed(1) + '" y2="' + B + '"/>'; }
    [0.4, 0.2, 0, -0.2, -0.4].forEach(function (e) { g += '<line x1="' + L + '" y1="' + Y(e).toFixed(1) + '" x2="' + R + '" y2="' + Y(e).toFixed(1) + '"/>'; });
    return g;
  }
  function ticks() {
    var t = '', i;
    for (i = 0; i <= 5; i++) t += '<text class="cpx-tick" x="' + X(i * 2).toFixed(1) + '" y="' + (B + 18) + '" text-anchor="middle">' + (i * 2) + '</text>';
    [0.4, 0.2, 0, -0.2, -0.4].forEach(function (e) {
      t += '<text class="cpx-tick" x="' + (L - 8) + '" y="' + (Y(e) + 4).toFixed(1) + '" text-anchor="end">' + (e < 0 ? '\u2212' + Math.abs(e).toFixed(1) : e.toFixed(1)) + '</text>';
    });
    return t;
  }

  var marks = '';
  FEATURES.forEach(function (f) {
    marks += '<g class="cpx-mark" data-n="' + f.n + '"><circle r="13"/><text dy="4.5">' + f.n + '</text></g>';
  });

  var chips = '';
  FEATURES.forEach(function (f) {
    chips += '<button type="button" class="cpx-chip" data-n="' + f.n + '" aria-pressed="false"><b>' + f.n + '</b>' + f.en + '</button>';
  });

  mount.innerHTML =
    '<svg class="cpx-svg" viewBox="0 0 640 340" role="img" aria-label="Illustrative chronopotentiometry curve: potential versus time at constant current.">' +
      '<g class="cpx-grid">' + grid() + '</g>' +
      '<line class="cpx-axis" x1="' + L + '" y1="' + B + '" x2="' + R + '" y2="' + B + '"/>' +
      '<line class="cpx-axis" x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + B + '"/>' +
      ticks() +
      '<text class="cpx-axlabel" x="' + ((L + R) / 2) + '" y="' + (B + 56) + '" text-anchor="middle">Time (h)</text>' +
      '<text class="cpx-axlabel" transform="rotate(-90 16 ' + ((T + B) / 2) + ')" x="16" y="' + ((T + B) / 2) + '" text-anchor="middle">Potential (V vs. reference)</text>' +
      '<line class="cpx-rest" x1="' + L + '" y1="' + Y(E_REST).toFixed(1) + '" x2="' + R + '" y2="' + Y(E_REST).toFixed(1) + '"/>' +
      '<text class="cpx-restlabel" x="' + (R - 4) + '" y="' + (Y(E_REST) - 6).toFixed(1) + '" text-anchor="end">resting potential</text>' +
      '<line class="cpx-tau" y1="' + T + '" y2="' + B + '"/>' +
      '<text class="cpx-taulabel" y="' + (B + 32) + '" text-anchor="middle">\u03c4</text>' +
      '<path class="cpx-curve" d=""/>' +
      '<g class="cpx-marks">' + marks + '</g>' +
    '</svg>' +
    '<div class="cpx-controls">' +
      '<div class="cpx-ctl"><label for="cpx-i">Current <output class="cpx-i-out"></output></label>' +
        '<input id="cpx-i" class="cpx-i" type="range" min="0.5" max="4" step="0.1" value="1"></div>' +
      '<div class="cpx-ctl"><label for="cpx-q">Material available <output class="cpx-q-out"></output></label>' +
        '<input id="cpx-q" class="cpx-q" type="range" min="1" max="4" step="0.1" value="3"></div>' +
    '</div>' +
    '<p class="cpx-readout"><span class="cpx-formula"></span><small>Try it: double the current and watch the plateau get half as long.</small></p>' +
    '<div class="cpx-chips" role="group" aria-label="Parts of the curve">' + chips + '</div>' +
    '<div class="cpx-panel" aria-live="polite"><h4 class="cpx-ptitle"></h4><p class="cpx-ptext"></p></div>' +
    '<p class="cpx-foot">Illustrative curve, not real data. Real curves depend on the system being measured.</p>';

  function $(s) { return mount.querySelector(s); }
  var iIn = $('.cpx-i'), qIn = $('.cpx-q'), iOut = $('.cpx-i-out'), qOut = $('.cpx-q-out');
  var curve = $('.cpx-curve'), tauLine = $('.cpx-tau'), tauLabel = $('.cpx-taulabel'), formula = $('.cpx-formula');
  var pTitle = $('.cpx-ptitle'), pText = $('.cpx-ptext');
  var markEls = mount.querySelectorAll('.cpx-mark'), chipEls = mount.querySelectorAll('.cpx-chip');
  var active = 2;

  function fmt(v) { return v.toFixed(1); }

  function render() {
    var I = parseFloat(iIn.value), Q = parseFloat(qIn.value), tau = Q / I;
    iOut.textContent = fmt(I) + ' mA/cm\u00b2';
    qOut.textContent = fmt(Q) + ' mAh/cm\u00b2';
    formula.textContent = 'Plateau lasts \u03c4 = material \u00f7 current = ' + fmt(Q) + ' \u00f7 ' + fmt(I) + ' = ' + tau.toFixed(tau < 1 ? 2 : 1) + ' h';

    var d = 'M' + X(0).toFixed(1) + ' ' + Y(E_REST).toFixed(1), N = 1200, k, t;
    for (k = 1; k <= N; k++) {
      t = XMAX * k / N;
      d += 'L' + X(t).toFixed(1) + ' ' + Y(pot(t, tau)).toFixed(1);
    }
    curve.setAttribute('d', d);

    var tx = X(tau).toFixed(1);
    tauLine.setAttribute('x1', tx); tauLine.setAttribute('x2', tx);
    tauLabel.setAttribute('x', tx);

    var pos = {
      1: [X(0) + 24, Y((E_REST + E1) / 2)],
      2: [X(tau / 2), Y(pot(tau / 2, tau)) - 24],
      3: [X(tau) + 22, Y((E1 - SLOPE + E2) / 2)],
      4: [X(tau + Math.min(1.5, (XMAX - tau) / 2)), Y(pot(tau + Math.min(1.5, (XMAX - tau) / 2), tau)) - 26]
    };
    markEls.forEach(function (m) {
      var n = m.getAttribute('data-n'), p = pos[n];
      m.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')');
    });
  }

  function select(n) {
    active = n;
    var f = FEATURES[n - 1];
    pTitle.textContent = n + '. ' + f.en;
    pText.textContent = f.textEn;
    markEls.forEach(function (m) { m.classList.toggle('active', parseInt(m.getAttribute('data-n'), 10) === n); });
    chipEls.forEach(function (c) { c.setAttribute('aria-pressed', parseInt(c.getAttribute('data-n'), 10) === n ? 'true' : 'false'); });
  }

  iIn.addEventListener('input', render);
  qIn.addEventListener('input', render);
  markEls.forEach(function (m) { m.addEventListener('click', function () { select(parseInt(m.getAttribute('data-n'), 10)); }); });
  chipEls.forEach(function (c) { c.addEventListener('click', function () { select(parseInt(c.getAttribute('data-n'), 10)); }); });

  render();
  select(2);
})();
