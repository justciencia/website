/* Scientists page: filters by field and language, and "View profile" opens a pop-up with the bio and links.
   Without JavaScript (or in an old browser), the links go to the full interview instead. */
(function () {
  "use strict";
  // Filter the grid by field and language (shared filter from site.js)
  var grid = document.getElementById('sc-grid');
  if (grid && window.JCFilter) {
    window.JCFilter({ list: grid, cardSel: '.sc-tile', topicAttr: 'data-field', topicChipSel: '#sc-field-filters .chip[data-filter]', empty: document.getElementById('sc-empty'), hash: false });
  }

  var dialogs = document.querySelectorAll('dialog.sc-dialog');
  if (!dialogs.length || typeof dialogs[0].showModal !== 'function') return;

  var opener = null;

  function openDialog(dlg, trigger) {
    opener = trigger || null;
    dlg.showModal();
    document.body.style.overflow = 'hidden';
    try { history.replaceState(null, '', '#' + dlg.id.replace(/^sci-/, '')); } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var trigger = e.target.closest('[data-dialog]');
    if (trigger) {
      var dlg = document.getElementById(trigger.getAttribute('data-dialog'));
      if (dlg) { e.preventDefault(); openDialog(dlg, trigger); }
      return;
    }
    var closer = e.target.closest('.sc-close');
    if (closer) { closer.closest('dialog').close(); return; }
    // a click on the dimmed backdrop lands on the <dialog> element itself
    if (e.target.tagName === 'DIALOG' && e.target.classList.contains('sc-dialog')) e.target.close();
  });

  dialogs.forEach(function (d) {
    d.addEventListener('close', function () {
      document.body.style.overflow = '';
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
      if (opener && opener.focus) opener.focus();
    });
  });

  // A shared link like /scientists/#maria-lopez opens that profile
  var hash = (location.hash || '').replace('#', '');
  if (hash) { var d = document.getElementById('sci-' + hash); if (d) openDialog(d, null); }
})();
