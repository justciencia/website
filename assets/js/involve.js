/* "Get involved" form (About page).
   - Asks the Google Sheet whether it is open (checkbox in the Settings tab).
   - Stays collapsed until the button is pressed.
   - Sends the answers to the Applications tab through its own Google Apps Script web app. */
(function () {
  "use strict";
  var band = document.getElementById('get-involved');
  if (!band) return;
  var endpoint = band.getAttribute('data-endpoint');
  var btn = document.getElementById('gi-toggle');
  var panel = document.getElementById('gi-panel');
  var form = document.getElementById('gi-form');
  var status = document.getElementById('gi-status');
  var formStatus = document.getElementById('gi-form-status');
  var done = document.getElementById('gi-done');
  var submit = document.getElementById('gi-submit');
  var msg = document.getElementById('gi-message');
  var count = document.getElementById('gi-count');
  var sending = false, isOpen = false;
  var submissionId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ('s' + Date.now() + Math.random().toString(36).slice(2));

  function say(el, m, kind) { el.textContent = m || ''; el.className = 'apply-status' + (kind ? ' ' + kind : ''); }
  function url(extra) { return endpoint + (endpoint.indexOf('?') > -1 ? '&' : '?') + extra; }

  function setOpen(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (btn.firstChild && btn.firstChild.nodeType === 3) btn.firstChild.nodeValue = open ? 'Close ' : 'Get involved ';
    panel.classList.toggle('open', open);
    if (open) {
      panel.removeAttribute('inert');
      var first = form.hidden ? done : form.elements.name;
      setTimeout(function () { if (first && first.focus) first.focus({ preventScroll: true }); }, 380);
    } else { panel.setAttribute('inert', ''); }
  }
  btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
  window.addEventListener('hashchange', function () { if (isOpen && location.hash === '#get-involved') setOpen(true); });

  function showClosed(m) {
    setOpen(false); btn.hidden = true;
    say(status, m || 'I\u2019m not taking messages through this form right now. Please check back soon.', 'closed');
  }
  function showOpen() {
    isOpen = true; btn.hidden = false; btn.disabled = false; say(status, '');
    if (location.hash === '#get-involved') setOpen(true);
  }
  function decide(open) {
    if (open === true) showOpen();
    else if (open === false) showClosed();
    else showClosed('The form isn\u2019t available right now. Please try again later.');
  }

  function readStatusByScript(cb) {
    var name = '__jcInvolveStatus', tag = document.createElement('script'), finished = false, timer;
    function finish(v) { if (finished) return; finished = true; clearTimeout(timer); try { delete window[name]; } catch (e) { window[name] = undefined; } if (tag.parentNode) tag.parentNode.removeChild(tag); cb(v); }
    timer = setTimeout(function () { finish(null); }, 8000);
    window[name] = function (d) { finish(d && d.open === true ? true : false); };
    tag.onerror = function () { finish(null); };
    tag.async = true;
    tag.src = url('status=1&callback=' + name + '&_=' + Date.now());
    document.head.appendChild(tag);
  }
  (function checkStatus() {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 7000);
    fetch(url('status=1&_=' + Date.now()), { credentials: 'omit', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (d) { clearTimeout(timer); decide(d && d.open === true); })
      .catch(function () { clearTimeout(timer); readStatusByScript(decide); });
  })();

  function updateCount() { count.textContent = msg.value.length + ' / 1500'; }
  msg.addEventListener('input', updateCount); updateCount();

  function fieldErr(id, m) {
    var input = document.getElementById(id), err = document.getElementById(id + '-err');
    if (err) err.textContent = m || '';
    if (input) { if (m) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
  }
  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  function validate() {
    var firstBad = null;
    function bad(id, m) { fieldErr(id, m); if (!firstBad) firstBad = document.getElementById(id); }
    ['gi-name', 'gi-email', 'gi-help', 'gi-message', 'gi-consent'].forEach(function (id) { fieldErr(id, ''); });
    var v = function (n) { return (form.elements[n].value || '').trim(); };
    if (!v('name')) bad('gi-name', 'Please enter your name.');
    if (!EMAIL.test(v('email'))) bad('gi-email', 'Please enter a valid email address.');
    if (!v('help')) bad('gi-help', 'Please choose one.');
    if (v('message').length < 10) bad('gi-message', 'Please write a short message (at least 10 characters).');
    if (!form.elements.consent.checked) bad('gi-consent', 'Please check the box to continue.');
    if (firstBad && firstBad.focus) firstBad.focus();
    return !firstBad;
  }

  function showDone() {
    form.hidden = true; done.hidden = false; say(formStatus, '');
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'event/get-involved-sent', title: 'Get involved form sent', event: true }); } catch (e) {}
    if (done.focus) done.focus({ preventScroll: true });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    say(formStatus, '');
    if (!validate()) { say(formStatus, 'Please fix the highlighted fields.', 'error'); return; }
    if (form.elements.website.value) { showDone(); return; }   // spam trap: pretend it worked
    var body = new URLSearchParams(new FormData(form));
    body.set('page', location.href);
    body.set('id', submissionId);
    sending = true; submit.disabled = true; submit.textContent = 'Sending\u2026';

    function handle(d) {
      if (d && d.ok) showDone();
      else if (d && d.error === 'closed') showClosed('This form just closed. Thank you for your interest.');
      else if (d && d.error === 'invalid') say(formStatus, 'Something looks incomplete. Please check your answers and try again.', 'error');
      else say(formStatus, 'Something went wrong on my end. Your answers are still here, so please try again in a moment.', 'error');
    }
    function netFail() { say(formStatus, 'Couldn\u2019t reach the server. Your answers are still here, so please try again in a moment.', 'error'); }

    fetch(endpoint, { method: 'POST', body: body, credentials: 'omit' })
      .then(function (r) { return r.json(); })
      .then(handle)
      .catch(function () {
        return fetch(endpoint, { method: 'POST', body: body, mode: 'no-cors', credentials: 'omit' })
          .then(function () { showDone(); }, netFail);
      })
      .then(function () { sending = false; submit.disabled = false; submit.textContent = 'Send'; });
  });
})();
