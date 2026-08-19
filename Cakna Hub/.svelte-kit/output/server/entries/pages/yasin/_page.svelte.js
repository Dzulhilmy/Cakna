import { i as head, e as escape_html } from "../../../chunks/index.js";
import { S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let ayahs = [];
    head("166c5a3", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Surah Yasin — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="ys-root svelte-166c5a3"><header class="ys-header svelte-166c5a3"><a href="https://cakna.org/hub" class="hdr-btn svelte-166c5a3">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-166c5a3"><span class="hdr-title svelte-166c5a3">Surah Yasin</span> `);
    if (ayahs.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="hdr-sub svelte-166c5a3">${escape_html(ayahs.length)} Ayat</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <button class="play-all-btn svelte-166c5a3" aria-label="Main Semua">Main Semua</button></header> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <main class="ys-main svelte-166c5a3">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="loading-wrap svelte-166c5a3"><div class="spinner svelte-166c5a3" aria-label="Memuatkan…"></div> <p class="loading-text svelte-166c5a3">Memuatkan Surah Yasin…</p></div>`);
    }
    $$renderer2.push(`<!--]--></main></div> `);
    SideNav($$renderer2, { active: "yasin" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
