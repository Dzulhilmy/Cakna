import { s as sanitize_props, a as spread_props, c as slot, i as head, g as attr, e as escape_html, d as ensure_array_like, j as attr_style, k as stringify, f as attr_class, h as derived } from "../../../chunks/index.js";
import { s as sgdays, S as SideNav, r as read, a as readlog } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Flame($$renderer, $$props) {
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
    [
      "path",
      {
        "d": "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "flame" },
    $$sanitized_props,
    {
      /**
       * @component @name Flame
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOC41IDE0LjVBMi41IDIuNSAwIDAgMCAxMSAxMmMwLTEuMzgtLjUtMi0xLTMtMS4wNzItMi4xNDMtLjIyNC00LjA1NCAyLTYgLjUgMi41IDIgNC45IDQgNi41IDIgMS42IDMgMy41IDMgNS41YTcgNyAwIDEgMS0xNCAwYzAtMS4xNTMuNDMzLTIuMjk0IDEtM2EyLjUgMi41IDAgMCAwIDIuNSAyLjV6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/flame
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
function Target($$renderer, $$props) {
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
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["circle", { "cx": "12", "cy": "12", "r": "6" }],
    ["circle", { "cx": "12", "cy": "12", "r": "2" }]
  ];
  Icon($$renderer, spread_props([
    { name: "target" },
    $$sanitized_props,
    {
      /**
       * @component @name Target
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI2IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/target
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
    const TOTAL_PAGES = 604;
    const TARGET_OPTIONS = [7, 15, 30, 60, 90];
    const pagesRead = derived(() => read.value.length);
    const pct = derived(() => Math.round(pagesRead() / TOTAL_PAGES * 100));
    const totalPagesEver = derived(() => Object.values(readlog.value).reduce((a, b) => a + b, 0));
    const khatamCount = derived(() => Math.max(1, Math.floor(totalPagesEver() / TOTAL_PAGES) + (pagesRead() > 0 ? 1 : 0)));
    const streak = derived(() => {
      let s = 0;
      const d = /* @__PURE__ */ new Date();
      while (true) {
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (!readlog.value[k]) break;
        s++;
        d.setDate(d.getDate() - 1);
      }
      return s;
    });
    const avgPagesPerDay = derived(() => {
      const vals = Object.values(readlog.value).filter((v) => v > 0);
      if (!vals.length) return 0;
      const total = vals.reduce((a, b) => a + b, 0);
      return Math.round(total / vals.length * 10) / 10;
    });
    const daysToFinish = derived(() => avgPagesPerDay() > 0 ? Math.ceil((TOTAL_PAGES - pagesRead()) / avgPagesPerDay()) : null);
    const heatmapDays = derived(() => {
      const days = [];
      const now = /* @__PURE__ */ new Date();
      for (let i = 83; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        days.push({ k, count: readlog.value[k] ?? 0 });
      }
      return days;
    });
    const heatmapWeeks = derived(() => {
      const weeks = [];
      for (let i = 0; i < 12; i++) {
        weeks.push(heatmapDays().slice(i * 7, (i + 1) * 7));
      }
      return weeks;
    });
    function cellColor(count) {
      if (count === 0) return "rgba(255,255,255,0.04)";
      if (count <= 3) return "rgba(34,197,94,0.3)";
      return "rgba(34,197,94,0.85)";
    }
    const RADIUS = 64;
    const CIRC = 2 * Math.PI * RADIUS;
    const dashOffset = derived(() => CIRC * (1 - pagesRead() / TOTAL_PAGES));
    head("11rake5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Rekod Khatam — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="khatam-root svelte-11rake5"><header class="khatam-header svelte-11rake5"><a href="https://cakna.org/hub" class="hdr-btn svelte-11rake5">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-11rake5"><span class="hdr-title svelte-11rake5">Rekod Khatam</span></div> <button class="hdr-btn svelte-11rake5" aria-label="Reset semua">`);
    Trash_2($$renderer2, { size: 16 });
    $$renderer2.push(`<!----></button></header> <main class="khatam-main svelte-11rake5"><section class="progress-section svelte-11rake5"><div class="progress-ring-wrap svelte-11rake5"><svg class="progress-ring svelte-11rake5" viewBox="0 0 160 160" width="160" height="160"><circle cx="80" cy="80"${attr("r", RADIUS)} stroke="rgba(255,255,255,0.06)" stroke-width="10" fill="none"></circle><circle cx="80" cy="80"${attr("r", RADIUS)} stroke="rgba(34,197,94,0.85)" stroke-width="10" fill="none" stroke-linecap="round"${attr("stroke-dasharray", CIRC)}${attr("stroke-dashoffset", dashOffset())} transform="rotate(-90 80 80)" style="transition: stroke-dashoffset 0.4s ease"></circle></svg> <div class="ring-center svelte-11rake5"><span class="ring-pct svelte-11rake5">${escape_html(pct())}%</span> <span class="ring-sub svelte-11rake5">selesai</span></div></div> <div class="progress-info svelte-11rake5"><div class="info-row svelte-11rake5"><span class="info-label svelte-11rake5">Halaman dibaca</span> <span class="info-val svelte-11rake5">${escape_html(pagesRead())} / 604</span></div> <div class="info-row svelte-11rake5"><span class="info-label svelte-11rake5">Khatam ke</span> <span class="info-val khatam-num svelte-11rake5">#${escape_html(khatamCount())}</span></div> <div class="info-row svelte-11rake5">`);
    Flame($$renderer2, { size: 14, class: "streak-icon" });
    $$renderer2.push(`<!----> <span class="info-label svelte-11rake5">Streak berturut</span> <span class="info-val svelte-11rake5">${escape_html(streak())} hari</span></div></div></section> <section class="heatmap-section"><h2 class="section-label svelte-11rake5">Aktiviti 12 Minggu Lepas</h2> <div class="heatmap-scroll svelte-11rake5"><div class="heatmap-grid svelte-11rake5"><!--[-->`);
    const each_array = ensure_array_like(heatmapWeeks());
    for (let wi = 0, $$length = each_array.length; wi < $$length; wi++) {
      let week = each_array[wi];
      $$renderer2.push(`<div class="heatmap-col svelte-11rake5"><!--[-->`);
      const each_array_1 = ensure_array_like(week);
      for (let di = 0, $$length2 = each_array_1.length; di < $$length2; di++) {
        let day = each_array_1[di];
        $$renderer2.push(`<div class="heatmap-cell svelte-11rake5"${attr_style(`background: ${stringify(cellColor(day.count))}`)}${attr("title", `${stringify(day.k)}: ${stringify(day.count)} halaman`)}></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="heatmap-legend svelte-11rake5"><span class="legend-lbl svelte-11rake5">Kurang</span> <div class="legend-cells svelte-11rake5"><div class="heatmap-cell svelte-11rake5" style="background: rgba(255,255,255,0.04)"></div> <div class="heatmap-cell svelte-11rake5" style="background: rgba(34,197,94,0.3)"></div> <div class="heatmap-cell svelte-11rake5" style="background: rgba(34,197,94,0.6)"></div> <div class="heatmap-cell svelte-11rake5" style="background: rgba(34,197,94,0.85)"></div></div> <span class="legend-lbl svelte-11rake5">Banyak</span></div></section> <section class="target-section"><h2 class="section-label svelte-11rake5">`);
    Target($$renderer2, {
      size: 12,
      style: "display:inline;vertical-align:middle;margin-right:4px;"
    });
    $$renderer2.push(`<!----> Sasaran Khatam</h2> <div class="target-btns svelte-11rake5"><!--[-->`);
    const each_array_2 = ensure_array_like(TARGET_OPTIONS);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let t = each_array_2[$$index_2];
      $$renderer2.push(`<button${attr_class("target-btn svelte-11rake5", void 0, { "target-active": sgdays.value === t })}>${escape_html(t)} hari</button>`);
    }
    $$renderer2.push(`<!--]--></div></section> `);
    if (daysToFinish() !== null) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="tip-card svelte-11rake5"><span class="tip-icon svelte-11rake5">💡</span> <p class="tip-text svelte-11rake5">Pada kadar <strong class="svelte-11rake5">${escape_html(avgPagesPerDay())}</strong> halaman/hari, anda dijangka khatam dalam <strong class="svelte-11rake5">${escape_html(daysToFinish())}</strong> hari lagi.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="tip-card tip-empty svelte-11rake5"><span class="tip-icon svelte-11rake5">📖</span> <p class="tip-text svelte-11rake5">Mula membaca untuk lihat anggaran khatam anda.</p></div>`);
    }
    $$renderer2.push(`<!--]--></main></div> `);
    SideNav($$renderer2, { active: "khatam" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
