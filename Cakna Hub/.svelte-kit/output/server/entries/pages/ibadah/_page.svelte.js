import { i as head, e as escape_html, d as ensure_array_like, f as attr_class } from "../../../chunks/index.js";
import { S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeSection = "wuduk";
    const TABS = [
      { id: "wuduk", label: "Wuduk" },
      { id: "solat", label: "Solat" },
      { id: "tay", label: "Tayammum" },
      { id: "umrah", label: "Umrah" },
      { id: "haji", label: "Haji" }
    ];
    head("mrib2s", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Panduan Ibadah — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="ib-root svelte-mrib2s"><header class="ib-header svelte-mrib2s"><a href="https://cakna.org/hub" class="hdr-btn svelte-mrib2s">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-mrib2s"><span class="hdr-title svelte-mrib2s">Panduan Ibadah</span> <span class="hdr-sub svelte-mrib2s">${escape_html(TABS.find((t) => t.id === activeSection)?.label ?? "")}</span></div> <div style="width:36px;"></div></header> <div class="tabs-row svelte-mrib2s"><!--[-->`);
    const each_array = ensure_array_like(TABS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button${attr_class("tab svelte-mrib2s", void 0, { "tab-active": activeSection === tab.id })}>${escape_html(tab.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <main class="ib-main svelte-mrib2s">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="loading-wrap svelte-mrib2s"><div class="spinner svelte-mrib2s" aria-label="Memuatkan…"></div> <p class="loading-text svelte-mrib2s">Memuatkan panduan ibadah…</p></div>`);
    }
    $$renderer2.push(`<!--]--></main></div> `);
    SideNav($$renderer2, { active: "ibadah" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
