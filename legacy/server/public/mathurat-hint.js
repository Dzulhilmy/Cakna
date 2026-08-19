/* Al-Ma'thurat reading hint — injected app-wide into the SPA shell.
   For the Doa Rabitah phrase فَوَثِّقِ اللَّهُمَّ رَابِطَتَهَا (read 3×) we do two things,
   NEITHER of which mutates the app's own text node (so it never fights Svelte):
     1. Highlight the phrase INLINE in the ayah via the CSS Custom Highlight API — a
        decoration layer, no DOM change. Falls back silently on browsers without it.
     2. Append a self-contained "Ulang 3 kali" card just after the du'a, removed again
        when navigating away.
   A MutationObserver keeps both in sync across SPA navigation. Detection is
   diacritic-insensitive; the highlight range uses the exact phrase. */
(function () {
  'use strict';
  var TARGET = 'فوثق اللهم رابطتها';                 // diacritic-stripped — for detection
  var PHRASE = 'فَوَثِّقِ اللَّهُمَّ رَابِطَتَهَا';        // exact — for the highlight range
  var DIAC = /[ً-ْٰـ]/g;
  function strip(s) { return (s || '').replace(DIAC, ''); }

  function makeCard() {
    var box = document.createElement('div');
    box.setAttribute('data-cakna-3x', '1');
    box.setAttribute('aria-label', 'Bahagian ini dibaca tiga kali');
    box.style.cssText = 'margin:12px auto 6px;max-width:600px;background:#FBF1D6;border:1px solid #E9D9A8;border-radius:12px;padding:11px 16px 13px;text-align:center';
    var head = document.createElement('div');
    head.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:6px;color:#8A6522;font:600 12.5px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:.02em';
    head.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 2.1 21 6l-4 3.9"/><path d="M3 12.9V11a4 4 0 0 1 4-4h14"/><path d="M7 21.9 3 18l4-3.9"/><path d="M21 11.1V13a4 4 0 0 1-4 4H3"/></svg><span>Ulang 3 kali</span>';
    var ar = document.createElement('div');
    ar.dir = 'rtl';
    ar.textContent = PHRASE;
    ar.style.cssText = 'margin-top:7px;font-size:21px;color:#0B3D2E;line-height:1.9';
    box.appendChild(head);
    box.appendChild(ar);
    return box;
  }

  var hlInit = false, HL = null;
  function highlight() {
    if (!hlInit) {
      hlInit = true;
      if (window.CSS && CSS.highlights && window.Highlight) {
        var st = document.createElement('style');
        st.textContent = '::highlight(cakna-3x){background-color:#FBE7B0}';
        document.head.appendChild(st);
        HL = new Highlight();
        CSS.highlights.set('cakna-3x', HL);
      }
    }
    if (!HL) return;                                  // API unsupported → the card still conveys it
    HL.clear();
    var ps = document.querySelectorAll('.mt-arab');
    for (var i = 0; i < ps.length; i++) {
      var fc = ps[i].firstChild;
      if (!fc || fc.nodeType !== 3) continue;
      var idx = (fc.nodeValue || '').indexOf(PHRASE);
      if (idx > -1) {
        try { var r = document.createRange(); r.setStart(fc, idx); r.setEnd(fc, idx + PHRASE.length); HL.add(r); } catch (e) {}
      }
    }
  }

  function apply() {
    highlight();
    var ps = document.querySelectorAll('.mt-arab');
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      var has = strip(p.textContent).indexOf(TARGET) > -1;
      var nxt = p.nextElementSibling;
      var mine = nxt && nxt.getAttribute && nxt.getAttribute('data-cakna-3x') === '1';
      if (has && !mine) p.parentNode.insertBefore(makeCard(), p.nextSibling);
      else if (!has && mine) nxt.parentNode.removeChild(nxt);
    }
    var outs = document.querySelectorAll('[data-cakna-3x]');
    for (var j = 0; j < outs.length; j++) {
      var o = outs[j], pv = o.previousElementSibling;
      var ok = pv && pv.classList && pv.classList.contains('mt-arab') && strip(pv.textContent).indexOf(TARGET) > -1;
      if (!ok && o.parentNode) o.parentNode.removeChild(o);
    }
  }

  var scheduled = false;
  // setTimeout (not requestAnimationFrame) so it still fires in a backgrounded tab
  function schedule() { if (scheduled) return; scheduled = true; setTimeout(function () { scheduled = false; apply(); }, 60); }
  function start() {
    apply();
    try { new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (e) {}
    document.addEventListener('visibilitychange', function () { if (!document.hidden) schedule(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
