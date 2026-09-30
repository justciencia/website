/* Scrollytelling graph: a pinned chronopotentiometry curve that draws itself as you scroll the steps.
   The curve is an illustrative model, not real data. */
(function () {
  "use strict";
  var sc = document.getElementById('cp-scrolly');
  if (!sc) return;
  var host = sc.querySelector('.scrolly-graph');
  var cap = sc.querySelector('.scrolly-caption');
  if (!host) return;

  var L = 66, R = 616, T = 18, B = 318, XMAX = 10, YMAX = 0.5, YMIN = -0.5, TAU = 3, N = 800;
  var E_REST = 0.40, E1 = 0.15, SLOPE = 0.10, E2 = -0.35;
  function X(t) { return L + (t / XMAX) * (R - L); }
  function Y(e) { return T + ((YMAX - e) / (YMAX - YMIN)) * (B - T); }
  function pot(t) {
    var w = Math.max(0.015 * TAU, 0.012);
    var p1 = E1 - SLOPE * (t / TAU), p2 = E2 - 0.02 * Math.max(0, t - TAU);
    var s = 1 / (1 + Math.exp(-(t - TAU) / w));
    var e = p1 * (1 - s) + p2 * s + (E_REST - E1) * Math.exp(-t / 0.03);
    return Math.max(YMIN + 0.02, Math.min(YMAX - 0.02, e));
  }

  // sample the curve and measure cumulative length so we can draw it part-way
  var pts = [], cum = [0], i, t;
  for (i = 0; i <= N; i++) { t = XMAX * i / N; pts.push([X(t), Y(i === 0 ? E_REST : pot(t))]); }
  for (i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  var total = cum[N];
  function idx(tt) { return Math.max(0, Math.min(N, Math.round(tt / XMAX * N))); }
  function seg(a, b) { var d = 'M' + pts[a][0].toFixed(1) + ' ' + pts[a][1].toFixed(1), k; for (k = a + 1; k <= b; k++) d += 'L' + pts[k][0].toFixed(1) + ' ' + pts[k][1].toFixed(1); return d; }

  var FEATURES = [
    { t0: 0,          t1: 0.35,       n: '1', title: 'The jump',           note: 'the current switches on' },
    { t0: 0.35,       t1: TAU - 0.12, n: '2', title: 'The plateau',        note: 'the first reaction' },
    { t0: TAU - 0.12, t1: TAU + 0.45, n: '3', title: 'The transition',     note: 'the material runs out' },
    { t0: TAU + 0.45, t1: XMAX,       n: '4', title: 'The second plateau', note: 'a new reaction takes over' }
  ];

  var g = '', k;
  for (k = 0; k <= 5; k++) g += '<line class="sc-grid-line" x1="' + X(k * 2).toFixed(1) + '" y1="' + T + '" x2="' + X(k * 2).toFixed(1) + '" y2="' + B + '"/>';
  [0.4, 0.2, 0, -0.2, -0.4].forEach(function (e) { g += '<line class="sc-grid-line" x1="' + L + '" y1="' + Y(e).toFixed(1) + '" x2="' + R + '" y2="' + Y(e).toFixed(1) + '"/>'; });
  var tk = '';
  for (k = 0; k <= 5; k++) tk += '<text class="sc-tick" x="' + X(k * 2).toFixed(1) + '" y="' + (B + 20) + '" text-anchor="middle">' + (k * 2) + '</text>';
  [0.4, 0.2, 0, -0.2, -0.4].forEach(function (e) { tk += '<text class="sc-tick" x="' + (L - 10) + '" y="' + (Y(e) + 4).toFixed(1) + '" text-anchor="end">' + (e < 0 ? '\u2212' + Math.abs(e).toFixed(1) : e.toFixed(1)) + '</text>'; });

  host.innerHTML =
    '<svg viewBox="0 0 640 372" role="img" aria-label="Illustrative chronopotentiometry curve, drawn step by step as you scroll">' +
      g +
      '<line class="sc-axis" x1="' + L + '" y1="' + B + '" x2="' + R + '" y2="' + B + '"/><line class="sc-axis" x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + B + '"/>' +
      tk +
      '<text class="sc-axlabel" x="' + ((L + R) / 2) + '" y="' + (B + 46) + '" text-anchor="middle">Time (h)</text>' +
      '<text class="sc-axlabel" transform="rotate(-90 16 ' + ((T + B) / 2) + ')" x="16" y="' + ((T + B) / 2) + '" text-anchor="middle">Potential (V vs. reference)</text>' +
      '<line class="sc-dash sc-rest" x1="' + L + '" y1="' + Y(E_REST).toFixed(1) + '" x2="' + R + '" y2="' + Y(E_REST).toFixed(1) + '" style="opacity:0"/>' +
      '<text class="sc-dashlabel sc-restlabel" x="' + (R - 4) + '" y="' + (Y(E_REST) - 7).toFixed(1) + '" text-anchor="end" style="opacity:0">resting potential</text>' +
      '<line class="sc-dash sc-tau" x1="' + X(TAU).toFixed(1) + '" y1="' + T + '" x2="' + X(TAU).toFixed(1) + '" y2="' + B + '" style="opacity:0"/>' +
      '<text class="sc-dashlabel sc-taulabel" x="' + X(TAU).toFixed(1) + '" y="' + (B + 20) + '" text-anchor="middle" style="opacity:0">\u03c4</text>' +
      '<path class="sc-ghost" d="' + seg(0, N) + '"/>' +
      '<path class="sc-line" d="' + seg(0, N) + '" style="stroke-dasharray:' + total.toFixed(1) + ';stroke-dashoffset:' + total.toFixed(1) + '"/>' +
      '<path class="sc-hl" d="" style="opacity:0"/>' +
      '<g class="sc-badge" style="opacity:0"><circle r="15"/><text dy="5.5">1</text></g>' +
    '</svg>';

  var line = host.querySelector('.sc-line'), hl = host.querySelector('.sc-hl'), badge = host.querySelector('.sc-badge');
  var rest = host.querySelector('.sc-rest'), restLabel = host.querySelector('.sc-restlabel');
  var tau = host.querySelector('.sc-tau'), tauLabel = host.querySelector('.sc-taulabel');

  function show(step) {
    var f;
    if (step <= 0) {
      line.style.strokeDashoffset = total;
      hl.style.opacity = 0; badge.style.opacity = 0;
      rest.style.opacity = 0; restLabel.style.opacity = 0; tau.style.opacity = 0; tauLabel.style.opacity = 0;
      if (cap) cap.innerHTML = '<b>The axes</b><span>time across, potential up</span>';
      return;
    }
    f = FEATURES[step - 1];
    var a = idx(f.t0), b = idx(f.t1), m = Math.round((a + b) / 2);
    line.style.strokeDashoffset = (total - cum[b]).toFixed(1);
    hl.setAttribute('d', seg(a, b)); hl.style.opacity = 1;
    badge.querySelector('text').textContent = f.n;
    var bx = pts[m][0] + (step === 3 ? 30 : 0), by = pts[m][1] + (step === 4 ? 30 : (step === 3 ? 0 : -30));
    badge.style.transform = 'translate(' + bx.toFixed(1) + 'px,' + by.toFixed(1) + 'px)';
    badge.style.opacity = 1;
    rest.style.opacity = step === 1 ? 1 : 0.35; restLabel.style.opacity = step === 1 ? 1 : 0;
    tau.style.opacity = step >= 3 ? 1 : 0; tauLabel.style.opacity = step >= 3 ? 1 : 0;
    if (cap) cap.innerHTML = '<b>' + f.n + ' \u00b7 ' + f.title + '</b><span>' + f.note + '</span>';
  }

  sc.addEventListener('scrolly:step', function (e) { show(e.detail.index); });
  show(0);
})();
