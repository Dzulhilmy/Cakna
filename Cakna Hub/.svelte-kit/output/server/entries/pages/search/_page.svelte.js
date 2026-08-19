import { s as sanitize_props, a as spread_props, c as slot, i as head, g as attr, f as attr_class, e as escape_html, d as ensure_array_like, k as stringify, h as derived } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { S as SideNav } from "../../../chunks/SideNav.js";
import { S as SURAHS } from "../../../chunks/meta.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { X } from "../../../chunks/x.js";
function Search($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.511.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "m21 21-4.34-4.34" }],
    ["circle", { "cx": "11", "cy": "11", "r": "8" }]
  ];
  Icon($$renderer, spread_props([
    { name: "search" },
    $$sanitized_props,
    {
      /**
       * @component @name Search
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEgMjEtNC4zNC00LjM0IiAvPgogIDxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/search
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let query = "";
    let hits = [];
    let total = 0;
    let lastQuery = "";
    const isArabic = derived(() => /[؀-ۿ]/.test(query));
    const hasResults = derived(() => hits.length > 0);
    const searched = derived(() => lastQuery.length >= 3);
    function surahName(surahNum) {
      return SURAHS[surahNum - 1]?.name_translit ?? `Surah ${surahNum}`;
    }
    head("e12qt1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Cari Ayat — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="search-root svelte-e12qt1"><header class="search-header svelte-e12qt1"><a href="https://cakna.org/hub" class="hdr-btn svelte-e12qt1" aria-label="Kembali">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-e12qt1"><span class="hdr-title svelte-e12qt1">Cari Ayat</span></div> <span class="hdr-spacer svelte-e12qt1"></span></header> <div class="search-bar-wrap svelte-e12qt1"><div class="search-input-wrap svelte-e12qt1"><span class="search-icon-wrap svelte-e12qt1">`);
    Search($$renderer2, { size: 16 });
    $$renderer2.push(`<!----></span> <input${attr("value", query)}${attr_class("search-input svelte-e12qt1", void 0, { "input-rtl": isArabic() })} type="search"${attr("placeholder", isArabic() ? "…ابحث عن آية" : "Taip kata kunci (min. 3 huruf)")}${attr("dir", isArabic() ? "rtl" : "ltr")} autocomplete="off" spellcheck="false" aria-label="Cari ayat"/> `);
    if (query.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="clear-btn svelte-e12qt1" aria-label="Padam carian">`);
      X($$renderer2, { size: 15 });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <main class="search-main svelte-e12qt1">`);
    if (searched() && hasResults()) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<p class="result-count svelte-e12qt1" aria-live="polite"><strong class="svelte-e12qt1">${escape_html(total)}</strong> keputusan untuk '<span class="result-query svelte-e12qt1">${escape_html(lastQuery)}</span>'</p> <div class="hits-list svelte-e12qt1"><!--[-->`);
      const each_array = ensure_array_like(hits);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let hit = each_array[$$index];
        $$renderer2.push(`<div class="hit-card svelte-e12qt1" role="button" tabindex="0"${attr("aria-label", `${stringify(surahName(hit.surah))} ayat ${stringify(hit.ayah)}`)}><div class="hit-meta svelte-e12qt1"><span class="hit-surah svelte-e12qt1">${escape_html(surahName(hit.surah))}</span> <span class="hit-ref svelte-e12qt1">${escape_html(hit.surah)}:${escape_html(hit.ayah)}</span></div> <p${attr_class("hit-text svelte-e12qt1", void 0, { "hit-rtl": isArabic() })}${attr("dir", isArabic() ? "rtl" : "ltr")}>${escape_html(hit.text)}</p></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else if (searched() && !hasResults()) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div class="empty-state svelte-e12qt1" aria-live="polite"><span class="empty-icon svelte-e12qt1">🔍</span> <p class="empty-title svelte-e12qt1">Tiada keputusan</p> <p class="empty-sub svelte-e12qt1">Cuba kata kunci lain atau semak ejaan.</p></div>`);
    } else if (query.length > 0 && query.length < 3) {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<p class="hint-text svelte-e12qt1" aria-live="polite">Taip sekurang-kurangnya 3 huruf untuk mencari.</p>`);
    } else if (query.length === 0) {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<div class="idle-state svelte-e12qt1"><span class="idle-icon svelte-e12qt1">📖</span> <p class="idle-text svelte-e12qt1">Cari mana-mana ayat dalam Al-Quran</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></main></div> `);
    SideNav($$renderer2, { active: "search" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
