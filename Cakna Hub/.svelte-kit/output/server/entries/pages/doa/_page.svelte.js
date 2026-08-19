import { i as head, f as attr_class, d as ensure_array_like } from "../../../chunks/index.js";
import { S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeTab = "quran";
    head("8j81b3", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Doa Al-Quran — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="doa-root svelte-8j81b3"><header class="doa-header svelte-8j81b3"><a href="https://cakna.org/hub" class="hdr-btn svelte-8j81b3" aria-label="Kembali">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-8j81b3"><span class="hdr-title svelte-8j81b3">Doa Al-Quran</span></div> <span class="hdr-spacer svelte-8j81b3"></span></header> <div class="tabs-wrap svelte-8j81b3"><button${attr_class("tab-btn svelte-8j81b3", void 0, { "tab-active": activeTab === "quran" })}>Dari Al-Quran</button> <button${attr_class("tab-btn svelte-8j81b3", void 0, { "tab-active": activeTab === "hadith" })}>Dari Hadith</button></div> <main class="doa-main svelte-8j81b3">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(Array.from({ length: 4 }));
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        each_array[i];
        $$renderer2.push(`<div class="skeleton-card svelte-8j81b3"><div class="skel-title svelte-8j81b3"></div> <div class="skel-arabic svelte-8j81b3"></div> <div class="skel-meaning svelte-8j81b3"></div></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></main></div> `);
    SideNav($$renderer2, { active: "doa" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
