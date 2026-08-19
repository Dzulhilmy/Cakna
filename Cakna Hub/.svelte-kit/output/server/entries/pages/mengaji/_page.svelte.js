import { i as head, e as escape_html, d as ensure_array_like, f as attr_class } from "../../../chunks/index.js";
import { S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeTab = "huruf";
    const TABS = [
      { id: "huruf", label: "Huruf" },
      { id: "baris", label: "Baris" },
      { id: "latihan", label: "Latihan" },
      { id: "kuiz", label: "Kuiz" }
    ];
    head("1jyfqja", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Asas Mengaji — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="mg-root svelte-1jyfqja"><header class="mg-header svelte-1jyfqja"><a href="https://cakna.org/hub" class="hdr-btn svelte-1jyfqja">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-1jyfqja"><span class="hdr-title svelte-1jyfqja">Asas Mengaji</span> <span class="hdr-sub svelte-1jyfqja">${escape_html(TABS.find((t) => t.id === activeTab)?.label ?? "")}</span></div> <div style="width:36px;"></div></header> <div class="tabs-row svelte-1jyfqja"><!--[-->`);
    const each_array = ensure_array_like(TABS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button${attr_class("tab svelte-1jyfqja", void 0, { "tab-active": activeTab === tab.id })}>${escape_html(tab.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <main class="mg-main svelte-1jyfqja">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="loading-wrap svelte-1jyfqja"><div class="spinner svelte-1jyfqja" aria-label="Memuatkan…"></div> <p class="loading-text svelte-1jyfqja">Memuatkan modul mengaji…</p></div>`);
    }
    $$renderer2.push(`<!--]--></main></div> `);
    SideNav($$renderer2, { active: "mengaji" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
