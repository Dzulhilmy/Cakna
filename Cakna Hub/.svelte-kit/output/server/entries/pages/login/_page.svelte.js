import { i as head, g as attr, j as attr_style, e as escape_html, k as stringify, h as derived } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const next = derived(() => data.next ?? "/admin/dashboard");
    let loading = false;
    let ssoLoading = false;
    const error = derived(() => form?.error ?? data.error);
    head("1x05zx6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Log masuk · Cakna Hub</title>`);
      });
    });
    $$renderer2.push(`<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f0ede6;padding:1.5rem;"><div style="width:100%;max-width:400px;background:#fff;border-radius:24px;padding:2.5rem 2rem 2rem;box-shadow:0 4px 32px rgba(0,0,0,0.08);"><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;margin-bottom:1.75rem;"><svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M32 4L38.5 20.5L56 22L43.5 34L47 52L32 43.5L17 52L20.5 34L8 22L25.5 20.5Z" fill="#c8a84b" opacity="0.15"></path><path d="M32 6L38 21.5L55 23.5L42.5 35.5L46 52L32 44L18 52L21.5 35.5L9 23.5L26 21.5Z" stroke="#c8a84b" stroke-width="1.5" fill="none"></path><circle cx="32" cy="30" r="10" fill="#f0ede6"></circle><circle cx="32" cy="28" r="5" fill="none" stroke="#1a4a3a" stroke-width="1.5"></circle><line x1="32" y1="33" x2="32" y2="38" stroke="#1a4a3a" stroke-width="1.5" stroke-linecap="round"></line><line x1="27" y1="38" x2="37" y2="38" stroke="#1a4a3a" stroke-width="1.5" stroke-linecap="round"></line></svg> <div style="text-align:center;"><p style="font-size:1.5rem;font-weight:600;color:#1a4a3a;letter-spacing:-0.01em;margin:0;font-family:Georgia,serif;">Cakna</p> <p style="font-size:0.65rem;letter-spacing:0.18em;color:#c8a84b;margin:2px 0 0;font-weight:600;text-transform:uppercase;">Mushaf Digital</p> <div style="width:40px;height:1px;background:#c8a84b;margin:6px auto 0;opacity:0.6;"></div></div></div> <div style="text-align:center;margin-bottom:1.5rem;"><h1 style="font-size:1.4rem;font-weight:600;color:#1a4a3a;margin:0 0 4px;font-family:Georgia,serif;">Selamat datang</h1> <p style="font-size:0.85rem;color:#6b7280;margin:0;">Log masuk untuk mengakses Cakna Hub.</p></div> <form method="POST" action="?/sso"><button type="submit"${attr("disabled", loading, true)}${attr_style(`width:100%;display:flex;align-items:center;justify-content:center;gap:0.6rem;background:#1a4a3a;color:#fff;border:none;border-radius:999px;padding:0.8rem 1.5rem;font-size:0.9rem;font-weight:600;cursor:pointer;margin-bottom:0.5rem;opacity:${stringify(1)};`)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> ${escape_html("Teruskan dengan QCXIS")}</button> <p style="text-align:center;font-size:0.78rem;color:#9ca3af;margin:0 0 1.25rem;">Log masuk dengan akaun QCXIS anda</p></form> <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;"><div style="flex:1;height:1px;background:#e5e7eb;"></div> <span style="font-size:0.72rem;letter-spacing:0.1em;color:#9ca3af;font-weight:600;">ATAU</span> <div style="flex:1;height:1px;background:#e5e7eb;"></div></div> `);
    if (error()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div style="background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:10px;padding:0.65rem 0.9rem;font-size:0.82rem;margin-bottom:1rem;">${escape_html(error())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST"${attr("action", `?/login&next=${stringify(encodeURIComponent(next()))}`)} style="display:flex;flex-direction:column;gap:1rem;"><label style="display:flex;flex-direction:column;gap:0.35rem;"><span style="font-size:0.82rem;font-weight:600;color:#374151;">Emel</span> <input type="email" name="email" autocomplete="email" placeholder="nama@contoh.com" required="" class="cakna-input svelte-1x05zx6"/></label> <label style="display:flex;flex-direction:column;gap:0.35rem;"><span style="font-size:0.82rem;font-weight:600;color:#374151;">Kata laluan</span> <div style="position:relative;"><input${attr("type", "password")} name="password" autocomplete="current-password" placeholder="Kata laluan anda" required="" class="cakna-input svelte-1x05zx6" style="padding-right:2.8rem;"/> <button type="button" style="position:absolute;right:0.9rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#9ca3af;cursor:pointer;padding:0;display:flex;"${attr("aria-label", "Tunjukkan kata laluan")}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`);
    }
    $$renderer2.push(`<!--]--></button></div></label> <button type="submit"${attr("disabled", ssoLoading, true)}${attr_style(`width:100%;border:1.5px solid #1a4a3a;background:#fff;color:#1a4a3a;border-radius:999px;padding:0.75rem;font-size:0.9rem;font-weight:700;cursor:pointer;margin-top:0.25rem;opacity:${stringify(1)};`)}>${escape_html("Log masuk")}</button></form> <p style="text-align:center;font-size:0.82rem;color:#6b7280;margin:1.25rem 0 0;">Belum ada akaun? <a href="https://cakna.org/auth/register" style="color:#1a4a3a;font-weight:600;text-decoration:none;">Daftar</a></p> <p style="display:flex;align-items:center;justify-content:center;gap:0.35rem;text-align:center;font-size:0.75rem;color:#9ca3af;margin:1rem 0 0;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Sambungan disulitkan &amp; selamat</p></div></div>`);
  });
}
export {
  _page as default
};
