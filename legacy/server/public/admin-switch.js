/* Injected into the user-facing app shell (served by the SPA fallback — NOT on
   /login or /admin). Shows a floating "Panel Admin" button ONLY when the signed-in
   user is an admin, so an admin previewing the normal app can jump back to the
   dashboard. Pairs with the "Lihat sebagai Pengguna" control inside the admin panel. */
(function () {
  'use strict';
  if (window.top !== window.self) return;              // never inside an iframe
  function mount(u) {
    if (!u || !u.is_admin) return;
    if (document.getElementById('cakna-admin-switch')) return;
    var a = document.createElement('a');
    a.id = 'cakna-admin-switch';
    a.href = '/admin';
    a.setAttribute('aria-label', 'Buka Panel Admin');
    a.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>' +
      '<span>Panel Admin</span>';
    a.style.cssText =
      'position:fixed;z-index:2147483000;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));' +
      'display:inline-flex;align-items:center;gap:7px;height:44px;padding:0 18px;border-radius:999px;' +
      'background:#155B44;color:#fff;font:600 13.5px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
      'text-decoration:none;box-shadow:0 8px 24px rgba(11,61,46,.34);border:1px solid rgba(255,255,255,.14);' +
      'transition:filter .15s,transform .15s;-webkit-tap-highlight-color:transparent';
    a.addEventListener('mouseenter', function () { a.style.filter = 'brightness(1.08)'; a.style.transform = 'translateY(-1px)'; });
    a.addEventListener('mouseleave', function () { a.style.filter = ''; a.style.transform = ''; });
    (document.body || document.documentElement).appendChild(a);
  }
  function check() {
    fetch('/api/auth/me', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(mount)
      .catch(function () { /* not logged in / offline — no button */ });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check);
  else check();
})();
