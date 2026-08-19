import { ak as head, Q as derived, a5 as escape_html, ab as ensure_array_like, ag as attr_class, ah as attr, a6 as sanitize_props, af as spread_props, ad as slot } from '../../../chunks/index.js-6hyNTq_g.js';
import { P as PublicShell } from '../../../chunks/PublicShell.js-13lfGUX_.js';
import { S as SectionBg, C as CustomSections, h as hasBg } from '../../../chunks/CustomSections.js-CkEA1hrv.js';
import { D as DEFAULT_CSR_ORDER } from '../../../chunks/site.js-C3FcLbLW.js';
import { I as Icon } from '../../../chunks/Icon.js-VGojmkFT.js';
import '../../../chunks/utils.js-DClsVo7x.js';
import '../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';
import '../../../chunks/book-open.js-BCkYmqdR.js';
import '../../../chunks/phone.js-D1mT-eqs.js';

function Calendar($$renderer, $$props) {
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
    ["path", { "d": "M8 2v4" }],
    ["path", { "d": "M16 2v4" }],
    [
      "rect",
      { "width": "18", "height": "18", "x": "3", "y": "4", "rx": "2" }
    ],
    ["path", { "d": "M3 10h18" }]
  ];
  Icon($$renderer, spread_props([
    { name: "calendar" },
    $$sanitized_props,
    {
      /**
       * @component @name Calendar
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAydjQiIC8+CiAgPHBhdGggZD0iTTE2IDJ2NCIgLz4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0zIDEwaDE4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/calendar
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
function Tag($$renderer, $$props) {
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
        "d": "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
      }
    ],
    [
      "circle",
      { "cx": "7.5", "cy": "7.5", "r": ".5", "fill": "currentColor" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "tag" },
    $$sanitized_props,
    {
      /**
       * @component @name Tag
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuNTg2IDIuNTg2QTIgMiAwIDAgMCAxMS4xNzIgMkg0YTIgMiAwIDAgMC0yIDJ2Ny4xNzJhMiAyIDAgMCAwIC41ODYgMS40MTRsOC43MDQgOC43MDRhMi40MjYgMi40MjYgMCAwIDAgMy40MiAwbDYuNTgtNi41OGEyLjQyNiAyLjQyNiAwIDAgMCAwLTMuNDJ6IiAvPgogIDxjaXJjbGUgY3g9IjcuNSIgY3k9IjcuNSIgcj0iLjUiIGZpbGw9ImN1cnJlbnRDb2xvciIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/tag
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
    let { data } = $$props;
    const content = derived(() => data.content);
    const p = derived(() => content().csrPage);
    const hasHero = derived(() => hasBg(p().heroBgImages));
    const hasCta = derived(() => hasBg(p().ctaBgImages));
    const csrOrder = derived(() => content().sectionOrder?.csrPage ?? DEFAULT_CSR_ORDER);
    head("1qe2tqn", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(p().eyebrow)} · ${escape_html(content().brand.name)}</title>`);
      });
    });
    PublicShell($$renderer2, {
      content: content(),
      children: ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(csrOrder());
        for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
          let key = each_array[$$index_1];
          if (key === "hero") {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<section${attr_class(`relative overflow-hidden ${hasHero() ? "text-white" : "bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200"}`)}>`);
            if (hasHero()) {
              $$renderer3.push("<!--[0-->");
              SectionBg($$renderer3, { images: p().heroBgImages, overlay: p().heroOverlay });
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<div aria-hidden="true" class="pointer-events-none absolute inset-0"><div class="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-rose-300/40 blur-3xl"></div> <div class="absolute -right-16 top-10 h-80 w-80 rounded-full bg-rose-400/30 blur-3xl"></div></div>`);
            }
            $$renderer3.push(`<!--]--> <div class="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32"><p${attr_class(`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ring-1 ${hasHero() ? "bg-white/10 text-rose-100 ring-white/20" : "bg-white/60 text-rose-700 ring-rose-200 backdrop-blur"}`)}><span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span> ${escape_html(p().eyebrow)}</p> <h1${attr_class(`mt-4 text-4xl font-bold tracking-tight sm:text-5xl ${hasHero() ? "text-white" : "text-zinc-900"}`)}>${escape_html(p().heading)}</h1> `);
            if (p().subtext) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p${attr_class(`mx-auto mt-5 max-w-2xl text-lg ${hasHero() ? "text-rose-100" : "text-zinc-600"}`)}>${escape_html(p().subtext)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div></section>`);
          } else if (key === "stories") {
            $$renderer3.push("<!--[1-->");
            $$renderer3.push(`<section class="bg-white py-20"><div class="mx-auto max-w-6xl px-6">`);
            if (p().stories.length === 0) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="text-center text-zinc-400">Tiada cerita lagi. Sila semak semula kemudian.</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
              const each_array_1 = ensure_array_like(p().stories);
              for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                let story = each_array_1[$$index];
                $$renderer3.push(`<article class="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">`);
                if (story.cover) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", story.cover)}${attr("alt", story.title)} class="aspect-[16/9] w-full object-cover"/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div class="aspect-[16/9] w-full bg-rose-50"></div>`);
                }
                $$renderer3.push(`<!--]--> <div class="flex flex-1 flex-col p-6"><div class="flex items-center gap-3 text-xs text-zinc-400"><span class="flex items-center gap-1">`);
                Calendar($$renderer3, { size: 12 });
                $$renderer3.push(`<!----> ${escape_html(story.date)}</span> <span class="flex items-center gap-1">`);
                Tag($$renderer3, { size: 12 });
                $$renderer3.push(`<!----> ${escape_html(story.category)}</span></div> <h2 class="mt-3 text-base font-semibold leading-snug text-zinc-900">${escape_html(story.title)}</h2> `);
                if (story.excerpt) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<p class="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">${escape_html(story.excerpt)}</p>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]--></div></article>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            }
            $$renderer3.push(`<!--]--></div></section>`);
          } else if (key === "customSections") {
            $$renderer3.push("<!--[2-->");
            CustomSections($$renderer3, { sections: content().customSections?.csr });
          } else if (key === "cta") {
            $$renderer3.push("<!--[3-->");
            if (p().ctaHeading) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<section${attr_class(`relative overflow-hidden ${hasCta() ? "text-white" : "bg-rose-600 text-white"}`)}>`);
              if (hasCta()) {
                $$renderer3.push("<!--[0-->");
                SectionBg($$renderer3, { images: p().ctaBgImages, overlay: p().ctaOverlay });
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> <div class="relative mx-auto max-w-3xl px-6 py-20 text-center"><h2 class="text-3xl font-bold tracking-tight">${escape_html(p().ctaHeading)}</h2> `);
              if (p().ctaText) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<p class="mt-4 text-lg text-rose-100">${escape_html(p().ctaText)}</p>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> `);
              if (p().ctaLabel) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<a${attr("href", p().ctaHref || "#")} class="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-rose-700 shadow-lg transition-colors hover:bg-rose-50">${escape_html(p().ctaLabel)}</a>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div></section>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-BfZvN7mf.js.map
