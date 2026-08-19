import { i as head, g as attr, f as attr_class, e as escape_html, d as ensure_array_like, h as derived } from "../../../chunks/index.js";
import { S as SideNav } from "../../../chunks/SideNav.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { S as SURAHS } from "../../../chunks/meta.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeTab = "surah";
    let query = "";
    const filteredSurahs = derived(() => query.trim() === "" ? SURAHS : SURAHS.filter((s) => {
      const q = query.toLowerCase();
      return s.name_translit.toLowerCase().includes(q) || s.name_ms.toLowerCase().includes(q) || s.name_ar.includes(query);
    }));
    const REVELATION_LABEL = { Meccan: "Makkiyyah", Medinan: "Madaniyyah" };
    head("ajyfks", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Senarai Surah — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="sr-root svelte-ajyfks"><header class="sr-header svelte-ajyfks"><a href="https://cakna.org/hub" class="hdr-btn svelte-ajyfks">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-ajyfks"><span class="hdr-title svelte-ajyfks">Senarai Surah</span> <span class="hdr-sub svelte-ajyfks">Al-Quran Al-Karim</span></div> <div style="width:36px;"></div></header> <div class="search-wrap svelte-ajyfks"><input class="search-input svelte-ajyfks" type="search" placeholder="Cari surah..."${attr("value", query)}/></div> <div class="tabs-row svelte-ajyfks"><button${attr_class("tab svelte-ajyfks", void 0, { "tab-active": activeTab === "surah" })}>Surah</button> <button${attr_class("tab svelte-ajyfks", void 0, { "tab-active": activeTab === "juz" })}>Juz</button></div> <main class="sr-main svelte-ajyfks">`);
    {
      $$renderer2.push("<!--[0-->");
      if (filteredSurahs().length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="empty-state svelte-ajyfks"><p>Tiada surah dijumpai untuk "${escape_html(query)}"</p></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<ul class="surah-list svelte-ajyfks"><!--[-->`);
        const each_array = ensure_array_like(filteredSurahs());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let surah = each_array[$$index];
          $$renderer2.push(`<li><button class="surah-row svelte-ajyfks"><div class="surah-num svelte-ajyfks"><span class="svelte-ajyfks">${escape_html(surah.number)}</span></div> <div class="surah-info svelte-ajyfks"><span class="surah-translit svelte-ajyfks">${escape_html(surah.name_translit)}</span> <span class="surah-sub svelte-ajyfks">${escape_html(surah.name_ms)} · ${escape_html(surah.ayah_count)} ayat · ${escape_html(REVELATION_LABEL[surah.revelation] ?? surah.revelation)}</span></div> <div class="surah-ar svelte-ajyfks"><span class="surah-ar-text svelte-ajyfks">${escape_html(surah.name_ar)}</span></div></button></li>`);
        }
        $$renderer2.push(`<!--]--></ul>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></main></div> `);
    SideNav($$renderer2, { active: "surah" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
