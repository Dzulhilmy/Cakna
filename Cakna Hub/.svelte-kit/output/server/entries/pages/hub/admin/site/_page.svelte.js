import { s as sanitize_props, a as spread_props, c as slot, i as head, d as ensure_array_like, g as attr, e as escape_html } from "../../../../../chunks/index.js";
import { H as House } from "../../../../../chunks/house.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { G as Graduation_cap } from "../../../../../chunks/graduation-cap.js";
import { P as Phone } from "../../../../../chunks/phone.js";
import { B as Book_open } from "../../../../../chunks/book-open.js";
function Info($$renderer, $$props) {
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
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "info" },
    $$sanitized_props,
    {
      /**
       * @component @name Info
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMTZ2LTQiIC8+CiAgPHBhdGggZD0iTTEyIDhoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/info
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
function Newspaper($$renderer, $$props) {
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
    ["path", { "d": "M15 18h-5" }],
    ["path", { "d": "M18 14h-8" }],
    [
      "path",
      {
        "d": "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"
      }
    ],
    [
      "rect",
      { "width": "8", "height": "4", "x": "10", "y": "6", "rx": "1" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "newspaper" },
    $$sanitized_props,
    {
      /**
       * @component @name Newspaper
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMThoLTUiIC8+CiAgPHBhdGggZD0iTTE4IDE0aC04IiAvPgogIDxwYXRoIGQ9Ik00IDIyaDE2YTIgMiAwIDAgMCAyLTJWNGEyIDIgMCAwIDAtMi0ySDhhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDEtNCAwdi05YTIgMiAwIDAgMSAyLTJoMiIgLz4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB4PSIxMCIgeT0iNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/newspaper
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
function _page($$renderer) {
  const pages = [
    {
      href: "/hub/admin/site/home",
      label: "Home Page",
      desc: "Hero, about, programs, impact & CTA.",
      icon: House
    },
    {
      href: "/hub/admin/site/aboutPage",
      label: "About Us",
      desc: "Who we are, purpose, collaboration & stats.",
      icon: Info
    },
    {
      href: "/hub/admin/site/setemPage",
      label: "SETEM",
      desc: "Math therapy seminar page.",
      icon: Graduation_cap
    },
    {
      href: "/hub/admin/site/csrPage",
      label: "CSR Stories",
      desc: "Franchisee CSR stories & gallery.",
      icon: Newspaper
    },
    {
      href: "/hub/admin/site/footer",
      label: "Contact & Footer",
      desc: "Footer contact details.",
      icon: Phone
    },
    {
      href: "/hub/admin/site/docs",
      label: "Polisi, SOP & Panduan",
      desc: "Policy, SOP, guidelines & manual pages.",
      icon: Book_open
    }
  ];
  head("6shobk", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Website · Cakna Hub Admin</title>`);
    });
  });
  $$renderer.push(`<div class="space-y-8"><header><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Website</h1> <p class="mt-1.5 text-zinc-500">Edit the public-facing pages by section.</p></header> <div class="grid gap-4 sm:grid-cols-2"><!--[-->`);
  const each_array = ensure_array_like(pages);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let p = each_array[$$index];
    $$renderer.push(`<a${attr("href", p.href)} class="group flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-rose-200 hover:bg-rose-50"><div class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-100">`);
    if (p.icon) {
      $$renderer.push("<!--[-->");
      p.icon($$renderer, { size: 20 });
      $$renderer.push("<!--]-->");
    } else {
      $$renderer.push("<!--[!-->");
      $$renderer.push("<!--]-->");
    }
    $$renderer.push(`</div> <div><p class="font-semibold text-zinc-900">${escape_html(p.label)}</p> <p class="mt-0.5 text-sm text-zinc-500">${escape_html(p.desc)}</p></div></a>`);
  }
  $$renderer.push(`<!--]--></div></div>`);
}
export {
  _page as default
};
