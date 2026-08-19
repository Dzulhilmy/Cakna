import { i as head, e as escape_html, g as attr, k as stringify, h as derived } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const next = derived(() => data.next ?? "/hub");
    let loading = false;
    let ssoLoading = false;
    const error = derived(() => form?.error ?? data.error);
    head("1i2smtp", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Log masuk · Cakna Hub</title>`);
      });
    });
    $$renderer2.push(`<div class="page svelte-1i2smtp"><a href="https://cakna.org/" class="back svelte-1i2smtp"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"></path></svg> Laman utama</a> <div class="heading svelte-1i2smtp"><div class="logo svelte-1i2smtp"><img src="/logo.jpg" alt="Cakna" class="svelte-1i2smtp"/></div> <h1 class="svelte-1i2smtp">Cakna <span class="svelte-1i2smtp">Hub</span></h1> <p class="svelte-1i2smtp">Log masuk untuk mengakses Cakna Hub.</p></div> <div class="card svelte-1i2smtp">`);
    if (error()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="error svelte-1i2smtp">${escape_html(error())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" action="?/sso"><input type="hidden" name="next"${attr("value", next())}/> <button type="submit"${attr("disabled", loading, true)} class="btn-primary svelte-1i2smtp"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> ${escape_html("Teruskan dengan QCXIS")}</button> <p class="sso-hint svelte-1i2smtp">Log masuk dengan akaun QCXIS anda</p></form> <div class="divider svelte-1i2smtp"><span class="svelte-1i2smtp">ATAU</span></div> <form method="POST"${attr("action", `?/login&next=${stringify(encodeURIComponent(next()))}`)} class="fields svelte-1i2smtp"><label class="svelte-1i2smtp"><span class="svelte-1i2smtp">Emel</span> <input type="email" name="email" autocomplete="email" placeholder="nama@contoh.com" required="" class="svelte-1i2smtp"/></label> <label class="svelte-1i2smtp"><span class="svelte-1i2smtp">Kata laluan</span> <div class="pw-wrap svelte-1i2smtp"><input${attr("type", "password")} name="password" autocomplete="current-password" placeholder="Kata laluan anda" required="" class="svelte-1i2smtp"/> <button type="button" class="eye svelte-1i2smtp"${attr("aria-label", "Tunjukkan kata laluan")}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`);
    }
    $$renderer2.push(`<!--]--></button></div></label> <button type="submit"${attr("disabled", ssoLoading, true)} class="btn-outline svelte-1i2smtp" style="margin-top:0.25rem;">${escape_html("Log masuk")}</button></form> <p class="register svelte-1i2smtp">Belum ada akaun? <a href="/auth/register" class="svelte-1i2smtp">Daftar</a></p> <p class="secure svelte-1i2smtp"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Sambungan disulitkan &amp; selamat</p></div></div>`);
  });
}
export {
  _page as default
};
