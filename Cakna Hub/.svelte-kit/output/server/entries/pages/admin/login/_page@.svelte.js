import { i as head, e as escape_html, g as attr, h as derived } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
function _page_($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { form } = $$props;
    let loading = false;
    let ssoLoading = false;
    const error = derived(() => form?.error);
    head("7u2p9m", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Log in · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="page svelte-7u2p9m"><a href="https://cakna.org/menu" class="back-link svelte-7u2p9m"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"></path></svg> Back to website</a> <div class="heading svelte-7u2p9m"><h1 class="svelte-7u2p9m">Cakna <span class="svelte-7u2p9m">Hub</span></h1> <p class="svelte-7u2p9m">Log in to continue.</p></div> <div class="card svelte-7u2p9m">`);
    if (error()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="error svelte-7u2p9m">${escape_html(error())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" action="?/sso"><button type="submit"${attr("disabled", loading, true)} class="btn-primary svelte-7u2p9m"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> ${escape_html("Continue with QCXIS")}</button> <p class="sso-hint svelte-7u2p9m">Log in with your QCXIS account</p></form> <div class="divider svelte-7u2p9m"><span class="svelte-7u2p9m">OR</span></div> <form method="POST" action="?/login" class="fields svelte-7u2p9m"><label class="svelte-7u2p9m"><span class="svelte-7u2p9m">Email</span> <input type="email" name="email" autocomplete="email" placeholder="nama@cakna.com" required="" class="svelte-7u2p9m"/></label> <label class="svelte-7u2p9m"><span class="svelte-7u2p9m">Password</span> <div class="pw-wrap svelte-7u2p9m"><input${attr("type", "password")} name="password" autocomplete="current-password" placeholder="Your password" required="" class="svelte-7u2p9m"/> <button type="button" class="eye svelte-7u2p9m"${attr("aria-label", "Show password")}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`);
    }
    $$renderer2.push(`<!--]--></button></div></label> <button type="submit"${attr("disabled", ssoLoading, true)} class="btn-primary svelte-7u2p9m" style="margin-top:0.25rem;">${escape_html("Log in")}</button></form> <p class="register svelte-7u2p9m">Don't have an account yet? <a href="https://cakna.org/auth/register" class="svelte-7u2p9m">Register here</a></p></div></div>`);
  });
}
export {
  _page_ as default
};
