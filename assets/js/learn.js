/* Vocabulary flashcards: "Practice" hides the Spanish; tap a row to flip it. */
(function () {
  "use strict";
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var prac = e.target.closest('.vocab-practice');
    if (prac) {
      var section = prac.closest('.vocab');
      var on = !section.classList.contains('practicing');
      section.classList.toggle('practicing', on);
      prac.setAttribute('aria-pressed', on ? 'true' : 'false');
      section.querySelectorAll('.vocab-row.revealed').forEach(function (r) { r.classList.remove('revealed'); });
      return;
    }
    var row = e.target.closest('.vocab-row');
    if (row) { row.classList.toggle('revealed'); }
  });
})();
