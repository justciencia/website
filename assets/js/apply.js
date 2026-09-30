/* "Nominate a scientist" form.
   - Asks the Google Sheet whether nominations are open (the checkbox in your Settings tab).
   - Stays collapsed until the button is pressed.
   - First question: Myself or Someone else. The wording and required fields change to match.
   - Sends the answers to the sheet through your Google Apps Script web app. */
(function () {
  "use strict";
  var band = document.getElementById('apply');
  if (!band) return;
  var endpoint = band.getAttribute('data-endpoint');
  var btn = document.getElementById('apply-toggle');
  var panel = document.getElementById('apply-panel');
  var form = document.getElementById('apply-form');
  var rest = document.getElementById('apply-rest');
  var status = document.getElementById('apply-status');
  var formStatus = document.getElementById('apply-form-status');
  var done = document.getElementById('apply-done');
  var submit = document.getElementById('apply-submit');
  var summary = document.getElementById('ap-summary');
  var count = document.getElementById('ap-count');
  var sending = false, mode = null;
  var submissionId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ('s' + Date.now() + Math.random().toString(36).slice(2));

  function qa(sel, root) { return Array.prototype.slice.call((root || band).querySelectorAll(sel)); }
  function say(el, msg, kind) { el.textContent = msg || ''; el.className = 'apply-status' + (kind ? ' ' + kind : ''); }
  function url(extra) { return endpoint + (endpoint.indexOf('?') > -1 ? '&' : '?') + extra; }

  /* ---------- collapse / expand ---------- */
  function setOpen(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (btn.firstChild && btn.firstChild.nodeType === 3) btn.firstChild.nodeValue = open ? 'Close ' : 'Nominate a scientist ';
    panel.classList.toggle('open', open);
    if (open) {
      panel.removeAttribute('inert');
      var first = form.hidden ? done : form.querySelector('input[type=radio]');
      setTimeout(function () { if (first && first.focus) first.focus({ preventScroll: true }); }, 380);
    } else {
      panel.setAttribute('inert', '');
    }
  }
  btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });

  /* ---------- Myself / Someone else ---------- */
  function setMode(m) {
    mode = m;
    rest.hidden = false;
    var hideFor = m === 'self' ? 'other' : 'self';
    qa('[data-m]').forEach(function (el) {
      var hide = el.getAttribute('data-m') === hideFor;
      el.hidden = hide;
      if (el.tagName === 'OPTION') el.disabled = hide;
      // fields that only exist in one mode are switched off in the other, so they are never sent
      qa('input,select,textarea', el).forEach(function (f) { f.disabled = hide; });
    });
    if (m === 'self' && form.elements.stage.value === 'Not sure') form.elements.stage.value = '';
    say(formStatus, '');
  }
  qa('input[name=who]').forEach(function (r) {
    r.addEventListener('change', function () { fieldErr('ap-who', ''); setMode(r.value === 'myself' ? 'self' : 'other'); });
  });

  /* ---------- are nominations open? ---------- */
  function showClosed(msg) {
    setOpen(false);
    btn.hidden = true;
    say(status, msg || 'I\u2019m not taking new nominations right now. Please check back soon.', 'closed');
  }
  function showOpen() {
    btn.hidden = false; btn.disabled = false;
    say(status, '');
    if (location.hash === '#apply') { setOpen(true); }
  }
  function unavailable() { showClosed('The form isn\u2019t available right now. Please try again later.'); }
  function decide(open) { if (open === true) showOpen(); else if (open === false) showClosed(); else unavailable(); }

  // Method 2: load the answer as a script (works even when a plain request is blocked)
  function readStatusByScript(doneCb) {
    var name = '__jcApplyStatus', tag = document.createElement('script'), finished = false, timer;
    function finish(v) { if (finished) return; finished = true; clearTimeout(timer); try { delete window[name]; } catch (e) { window[name] = undefined; } if (tag.parentNode) tag.parentNode.removeChild(tag); doneCb(v); }
    timer = setTimeout(function () { finish(null); }, 8000);
    window[name] = function (d) { finish(d && d.open === true ? true : false); };
    tag.onerror = function () { finish(null); };
    tag.async = true;
    tag.src = url('status=1&callback=' + name + '&_=' + Date.now());
    document.head.appendChild(tag);
  }
  // Method 1: a plain request that sends no cookies, so being signed into several Google accounts can't interfere
  (function checkStatus() {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 7000);
    fetch(url('status=1&_=' + Date.now()), { credentials: 'omit', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (d) { clearTimeout(timer); decide(d && d.open === true); })
      .catch(function () { clearTimeout(timer); readStatusByScript(decide); });
  })();

  /* ---------- live character count ---------- */
  function updateCount() { count.textContent = summary.value.length + ' / 1500'; }
  summary.addEventListener('input', updateCount); updateCount();

  /* ---------- validation ---------- */
  function fieldErr(id, msg) {
    var input = band.querySelector('#' + id);
    var err = document.getElementById(id + '-err');
    if (err) err.textContent = msg || '';
    if (input) { if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
  }
  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  function validate() {
    var firstBad = null;
    function bad(id, msg, focusEl) { fieldErr(id, msg); if (!firstBad) firstBad = focusEl || band.querySelector('#' + id); }
    ['ap-who', 'ap-nom-name', 'ap-nom-email', 'ap-name', 'ap-email', 'ap-stage', 'ap-institution', 'ap-field', 'ap-summary', 'ap-link', 'ap-tell', 'ap-consent'].forEach(function (id) { fieldErr(id, ''); });
    var v = function (n) { return (form.elements[n] && form.elements[n].value || '').trim(); };
    if (!mode) { bad('ap-who', 'Please choose one.', document.getElementById('ap-who-myself')); return false; }
    if (mode === 'other') {
      if (!v('nominator_name')) bad('ap-nom-name', 'Please enter your name.');
      if (!EMAIL.test(v('nominator_email'))) bad('ap-nom-email', 'Please enter your email address.');
    }
    var who = mode === 'self' ? '' : 'the scientist\u2019s ';
    if (!v('name')) bad('ap-name', mode === 'self' ? 'Please enter your name.' : 'Please enter the scientist\u2019s name.');
    if (mode === 'self') { if (!EMAIL.test(v('email'))) bad('ap-email', 'Please enter a valid email address.'); }
    else if (v('email') && !EMAIL.test(v('email'))) bad('ap-email', 'That email doesn\u2019t look right. You can leave it blank.');
    if (!v('stage')) bad('ap-stage', 'Please choose a career stage.');
    if (!v('institution')) bad('ap-institution', 'Please enter ' + who + 'university or institution.');
    if (!v('field')) bad('ap-field', 'Please enter ' + who + 'scientific topic.');
    if (v('summary').length < 40) bad('ap-summary', 'Please write a few sentences (at least 40 characters).');
    if (v('link') && !/^https?:\/\/\S+\.\S+/.test(v('link'))) bad('ap-link', 'Please enter a full link starting with https://');
    if (mode === 'other' && !form.elements.tell.checked) bad('ap-tell', 'Please check the box to continue.');
    if (!form.elements.consent.checked) bad('ap-consent', 'Please check the box to continue.');
    if (firstBad && firstBad.focus) firstBad.focus();
    return !firstBad;
  }

  /* ---------- send ---------- */
  function showDone() {
    form.hidden = true; done.hidden = false;
    say(formStatus, '');
    if (done.focus) done.focus({ preventScroll: true });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    say(formStatus, '');
    if (!validate()) { say(formStatus, 'Please fix the highlighted fields.', 'error'); return; }
    if (form.elements.website.value) { showDone(); return; }          // spam trap: pretend it worked
    var body = new URLSearchParams(new FormData(form));
    body.set('page', location.href);
    body.set('id', submissionId);          // the sheet ignores a repeat of the same id
    sending = true; submit.disabled = true; submit.textContent = 'Sending\u2026';

    function handle(d) {
      if (d && d.ok) { showDone(); }
      else if (d && d.error === 'closed') { showClosed('I just closed nominations. Thank you for your interest.'); }
      else if (d && d.error === 'invalid') { say(formStatus, 'Something looks incomplete. Please check your answers and try again.', 'error'); }
      else { say(formStatus, 'Something went wrong on my end. Your answers are still here, so please try again in a moment.', 'error'); }
    }
    function netFail() { say(formStatus, 'Couldn\u2019t reach the server. Your answers are still here, so please try again in a moment.', 'error'); }

    fetch(endpoint, { method: 'POST', body: body, credentials: 'omit' })
      .then(function (r) { return r.json(); })
      .then(handle)
      .catch(function () {
        // The browser may have blocked the reply even though the sheet received the submission.
        // Send once more without needing a reply. The unique id stops it being saved twice.
        return fetch(endpoint, { method: 'POST', body: body, mode: 'no-cors', credentials: 'omit' })
          .then(function () { showDone(); }, netFail);
      })
      .then(function () { sending = false; submit.disabled = false; submit.textContent = 'Send'; });
  });
})();
