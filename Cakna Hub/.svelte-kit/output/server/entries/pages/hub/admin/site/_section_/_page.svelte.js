import { s as sanitize_props, a as spread_props, c as slot, d as ensure_array_like, f as attr_class, e as escape_html, g as attr, ak as bind_props, af as clsx, h as derived, i as head, k as stringify } from "../../../../../../chunks/index.js";
import { P as PAGE_KEYS, a as DEFAULT_ABOUT_ORDER, c as DEFAULT_SETEM_ORDER, b as DEFAULT_CSR_ORDER, A as ABOUT_SECTIONS, S as SETEM_SECTIONS, C as CSR_SECTIONS } from "../../../../../../chunks/site.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { X } from "../../../../../../chunks/x.js";
import { I as Image } from "../../../../../../chunks/image.js";
import { G as Grip_vertical, R as Refresh_cw } from "../../../../../../chunks/refresh-cw.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { C as Chevron_down } from "../../../../../../chunks/chevron-down.js";
import { P as Pencil } from "../../../../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../../../../chunks/trash-2.js";
import { I as Image_plus } from "../../../../../../chunks/image-plus.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
function Align_center($$renderer, $$props) {
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
    ["path", { "d": "M17 12H7" }],
    ["path", { "d": "M19 18H5" }],
    ["path", { "d": "M21 6H3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "align-center" },
    $$sanitized_props,
    {
      /**
       * @component @name AlignCenter
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTcgMTJINyIgLz4KICA8cGF0aCBkPSJNMTkgMThINSIgLz4KICA8cGF0aCBkPSJNMjEgNkgzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/align-center
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
function Align_justify($$renderer, $$props) {
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
    ["path", { "d": "M3 12h18" }],
    ["path", { "d": "M3 18h18" }],
    ["path", { "d": "M3 6h18" }]
  ];
  Icon($$renderer, spread_props([
    { name: "align-justify" },
    $$sanitized_props,
    {
      /**
       * @component @name AlignJustify
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmgxOCIgLz4KICA8cGF0aCBkPSJNMyAxOGgxOCIgLz4KICA8cGF0aCBkPSJNMyA2aDE4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/align-justify
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
function Align_left($$renderer, $$props) {
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
    ["path", { "d": "M15 12H3" }],
    ["path", { "d": "M17 18H3" }],
    ["path", { "d": "M21 6H3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "align-left" },
    $$sanitized_props,
    {
      /**
       * @component @name AlignLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMTJIMyIgLz4KICA8cGF0aCBkPSJNMTcgMThIMyIgLz4KICA8cGF0aCBkPSJNMjEgNkgzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/align-left
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
function Align_right($$renderer, $$props) {
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
    ["path", { "d": "M21 12H9" }],
    ["path", { "d": "M21 18H7" }],
    ["path", { "d": "M21 6H3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "align-right" },
    $$sanitized_props,
    {
      /**
       * @component @name AlignRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJIOSIgLz4KICA8cGF0aCBkPSJNMjEgMThINyIgLz4KICA8cGF0aCBkPSJNMjEgNkgzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/align-right
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
function Chevron_up($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "m18 15-6-6-6 6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-up" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggMTUtNi02LTYgNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-up
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
function List($$renderer, $$props) {
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
    ["path", { "d": "M3 12h.01" }],
    ["path", { "d": "M3 18h.01" }],
    ["path", { "d": "M3 6h.01" }],
    ["path", { "d": "M8 12h13" }],
    ["path", { "d": "M8 18h13" }],
    ["path", { "d": "M8 6h13" }]
  ];
  Icon($$renderer, spread_props([
    { name: "list" },
    $$sanitized_props,
    {
      /**
       * @component @name List
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTMgMThoLjAxIiAvPgogIDxwYXRoIGQ9Ik0zIDZoLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDEyaDEzIiAvPgogIDxwYXRoIGQ9Ik04IDE4aDEzIiAvPgogIDxwYXRoIGQ9Ik04IDZoMTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list
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
function Type($$renderer, $$props) {
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
    ["path", { "d": "M12 4v16" }],
    ["path", { "d": "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" }],
    ["path", { "d": "M9 20h6" }]
  ];
  Icon($$renderer, spread_props([
    { name: "type" },
    $$sanitized_props,
    {
      /**
       * @component @name Type
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNHYxNiIgLz4KICA8cGF0aCBkPSJNNCA3VjVhMSAxIDAgMCAxIDEtMWgxNGExIDEgMCAwIDEgMSAxdjIiIC8+CiAgPHBhdGggZD0iTTkgMjBoNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/type
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
function MediaPicker($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = false, onselect, onclose } = $$props;
    let files = [];
    let tab = "library";
    const isImg = (url) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    if (open) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="presentation"><div class="flex w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" style="max-height: min(85vh, 680px)"><div class="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4"><h2 class="text-base font-semibold text-zinc-900">Media Library</h2> <button type="button" class="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700">`);
      X($$renderer2, { size: 16 });
      $$renderer2.push(`<!----></button></div> <div class="flex shrink-0 gap-1 border-b border-zinc-100 px-5"><!--[-->`);
      const each_array = ensure_array_like([["library", "Library"], ["upload", "Upload new"]]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let [key, label] = each_array[$$index];
        $$renderer2.push(`<button type="button"${attr_class(`relative py-3 text-sm font-medium transition-colors ${tab === key ? "text-rose-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-rose-500" : "text-zinc-500 hover:text-zinc-800"}`)}>${escape_html(label)}</button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="flex-1 overflow-y-auto p-5">`);
      {
        $$renderer2.push("<!--[0-->");
        if (files.filter(isImg).length === 0) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<div class="flex flex-col items-center gap-3 py-16 text-center">`);
          Image($$renderer2, { size: 32, class: "text-zinc-300" });
          $$renderer2.push(`<!----> <p class="text-sm text-zinc-400">No images yet. Switch to the Upload tab to add one.</p></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"><!--[-->`);
          const each_array_1 = ensure_array_like(files.filter(isImg));
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let url = each_array_1[$$index_1];
            $$renderer2.push(`<button type="button"${attr("title", url)} class="group relative aspect-square overflow-hidden rounded-xl border-2 border-transparent transition-all hover:border-rose-400 focus:border-rose-500 focus:outline-none"><img${attr("src", url)} alt="" class="h-full w-full object-cover" loading="lazy"/> <div class="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100"><span class="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-rose-600">Select</span></div></button>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { open });
  });
}
function CustomSectionsEditor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { sections = [], formAction, pageKey, onSaved } = $$props;
    const json = derived(() => JSON.stringify(sections));
    let editId = null;
    function freshSection() {
      return {
        background: "white",
        eyebrow: "",
        title: "",
        blocks: [{ id: uid(), type: "paragraph", content: "" }],
        ctaLabel: "",
        ctaHref: ""
      };
    }
    function uid() {
      return Math.random().toString(36).slice(2, 10);
    }
    freshSection();
    let draggingId = null;
    let dragOverId = null;
    let blockDraggingId = null;
    let blockDragOverId = null;
    const blockTypeIcon = {
      paragraph: Align_left,
      text: Type,
      image: Image,
      bulletList: List
    };
    const blockTypeLabel = {
      paragraph: "Paragraph",
      text: "Text",
      image: "Image",
      bulletList: "Bullet List"
    };
    const isImg = (u) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(u);
    const inp = "rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full bg-white";
    const ta = inp + " resize-y";
    const lbl = "text-sm font-medium text-zinc-700";
    const browseCls = "shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-500 hover:border-rose-300 hover:text-rose-600";
    const thumbCls = "h-9 w-9 shrink-0 rounded-lg border border-zinc-200 object-cover bg-zinc-50";
    const emptyThumbCls = "h-9 w-9 shrink-0 rounded-lg border border-zinc-200 bg-zinc-100";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="space-y-4"><div class="flex items-center justify-between"><div><p class="text-sm font-semibold text-zinc-800">Custom Sections</p> <p class="text-xs text-zinc-400 mt-0.5">Extra blocks appended to this page</p></div> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <form method="POST"${attr("action", formAction)}><input type="hidden" name="json"${attr("value", json())}/> <input type="hidden" name="pageKey"${attr("value", pageKey)}/> <div class="space-y-2 mb-3"><!--[-->`);
      const each_array = ensure_array_like(sections);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let sec = each_array[i];
        $$renderer3.push(`<div role="listitem"${attr_class(`rounded-2xl border bg-white overflow-hidden transition-colors ${draggingId === sec.id ? "opacity-50 border-rose-300" : dragOverId === sec.id ? "border-rose-400 shadow-md" : "border-zinc-200"}`)} draggable="true"><div class="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-2.5"><div class="flex items-center gap-2 min-w-0"><div class="shrink-0 cursor-grab text-zinc-300 hover:text-zinc-500 active:cursor-grabbing" aria-hidden="true">`);
        Grip_vertical($$renderer3, { size: 15 });
        $$renderer3.push(`<!----></div> <span class="text-xs text-zinc-400 shrink-0">${escape_html(sec.blocks.length)} block${escape_html(sec.blocks.length === 1 ? "" : "s")}</span> <span class="text-sm font-medium text-zinc-900 truncate">${escape_html(sec.title || "(no title)")}</span></div> <div class="flex shrink-0 items-center gap-1 ml-2"><button type="button"${attr("disabled", i === 0, true)} class="p-1.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30">`);
        Chevron_up($$renderer3, { size: 13 });
        $$renderer3.push(`<!----></button> <button type="button"${attr("disabled", i === sections.length - 1, true)} class="p-1.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30">`);
        Chevron_down($$renderer3, { size: 13 });
        $$renderer3.push(`<!----></button> <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-50">`);
        Pencil($$renderer3, { size: 11 });
        $$renderer3.push(`<!---->${escape_html(editId === sec.id ? "Close" : "Edit")}</button> <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50">`);
        Trash_2($$renderer3, { size: 11 });
        $$renderer3.push(`<!----></button></div></div> `);
        if (editId === sec.id) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="space-y-4 p-4"><div class="grid gap-3 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Background</span> `);
          $$renderer3.select(
            {
              class: inp,
              value: sec.background,
              onchange: (e) => sec.background = e.currentTarget.value
            },
            ($$renderer4) => {
              $$renderer4.option({ value: "white" }, ($$renderer5) => {
                $$renderer5.push(`White`);
              });
              $$renderer4.option({ value: "tint" }, ($$renderer5) => {
                $$renderer5.push(`Tint (light rose)`);
              });
            }
          );
          $$renderer3.push(`</label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow <span class="font-normal text-zinc-400">(optional)</span></span> <input${attr_class(clsx(inp))}${attr("value", sec.eyebrow ?? "")} placeholder="Optional label above title"/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Section Title</span> <input${attr_class(clsx(inp))}${attr("value", sec.title)}/></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Content Blocks</p> <div class="space-y-2"><!--[-->`);
          const each_array_1 = ensure_array_like(sec.blocks);
          for (let $$index_3 = 0, $$length2 = each_array_1.length; $$index_3 < $$length2; $$index_3++) {
            let block = each_array_1[$$index_3];
            const BlockIcon = blockTypeIcon[block.type];
            $$renderer3.push(`<div role="listitem"${attr_class(`rounded-xl border bg-zinc-50/80 overflow-hidden transition-colors ${blockDraggingId === block.id ? "opacity-50 border-rose-300" : blockDragOverId === block.id ? "border-rose-400 shadow-sm" : "border-zinc-200"}`)} draggable="true"><div class="flex items-center gap-2 px-3 py-2 bg-white border-b border-zinc-100"><div class="shrink-0 cursor-grab text-zinc-300 hover:text-zinc-500 active:cursor-grabbing" aria-hidden="true">`);
            Grip_vertical($$renderer3, { size: 13 });
            $$renderer3.push(`<!----></div> `);
            if (BlockIcon) {
              $$renderer3.push("<!--[-->");
              BlockIcon($$renderer3, { size: 13, class: "shrink-0 text-zinc-400" });
              $$renderer3.push("<!--]-->");
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push("<!--]-->");
            }
            $$renderer3.push(` <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wide">${escape_html(blockTypeLabel[block.type])}</span> <div class="ml-auto"><button type="button" class="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50">`);
            X($$renderer3, { size: 12 });
            $$renderer3.push(`<!----></button></div></div> <div class="p-3">`);
            if (block.type === "paragraph") {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<textarea${attr_class(clsx(ta))} rows="3" placeholder="Write your paragraph content here…">`);
              const $$body = escape_html(block.content ?? "");
              if ($$body) {
                $$renderer3.push(`${$$body}`);
              }
              $$renderer3.push(`</textarea> <div class="mt-2 flex items-center gap-1"><span class="text-xs text-zinc-400 mr-1">Align:</span> <!--[-->`);
              const each_array_2 = ensure_array_like([
                ["left", Align_left],
                ["center", Align_center],
                ["right", Align_right],
                ["justify", Align_justify]
              ]);
              for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
                let [val, Icon2] = each_array_2[$$index];
                $$renderer3.push(`<button type="button"${attr_class(`rounded p-1.5 ${(block.align ?? "left") === val ? "bg-rose-100 text-rose-600" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"}`)}>`);
                if (Icon2) {
                  $$renderer3.push("<!--[-->");
                  Icon2($$renderer3, { size: 13 });
                  $$renderer3.push("<!--]-->");
                } else {
                  $$renderer3.push("<!--[!-->");
                  $$renderer3.push("<!--]-->");
                }
                $$renderer3.push(`</button>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            } else if (block.type === "text") {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<input${attr_class(clsx(inp))}${attr("value", block.content ?? "")} placeholder="Short text line (e.g. subheading, label, annotation)"/>`);
            } else if (block.type === "image") {
              $$renderer3.push("<!--[2-->");
              $$renderer3.push(`<div class="space-y-2.5"><div class="flex gap-3 items-center"><label class="flex flex-col gap-1 flex-1"><span class="text-xs text-zinc-500">Display style</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: block.imageStyle ?? "gallery",
                  onchange: (e) => block.imageStyle = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.option({ value: "gallery" }, ($$renderer5) => {
                    $$renderer5.push(`Gallery (grid)`);
                  });
                  $$renderer4.option({ value: "background" }, ($$renderer5) => {
                    $$renderer5.push(`Background image`);
                  });
                  $$renderer4.option({ value: "both" }, ($$renderer5) => {
                    $$renderer5.push(`Both (bg + gallery)`);
                  });
                }
              );
              $$renderer3.push(`</label></div> <div class="space-y-2"><!--[-->`);
              const each_array_3 = ensure_array_like(block.images ?? []);
              for (let ii = 0, $$length3 = each_array_3.length; ii < $$length3; ii++) {
                let img = each_array_3[ii];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/image.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="flex gap-2"><button type="button" class="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 12 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 12 });
              $$renderer3.push(`<!----> Pick</button></div> <label class="flex flex-col gap-1"><span class="text-xs text-zinc-500">Caption (optional)</span> <input${attr_class(clsx(inp))}${attr("value", block.caption ?? "")} placeholder="Image caption…"/></label></div>`);
            } else if (block.type === "bulletList") {
              $$renderer3.push("<!--[3-->");
              $$renderer3.push(`<div class="space-y-2"><!--[-->`);
              const each_array_4 = ensure_array_like(block.items ?? []);
              for (let bi = 0, $$length3 = each_array_4.length; bi < $$length3; bi++) {
                each_array_4[bi];
                $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", block.items[bi])} placeholder="Bullet item…"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--> <button type="button" class="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 12 });
              $$renderer3.push(`<!----> Add bullet</button></div>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div></div>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-3 flex flex-wrap gap-2"><span class="text-xs text-zinc-400 self-center">Add block:</span> <!--[-->`);
          const each_array_5 = ensure_array_like(["paragraph", "text", "image", "bulletList"]);
          for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
            let btype = each_array_5[$$index_4];
            const BIcon = blockTypeIcon[btype];
            $$renderer3.push(`<button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 hover:border-rose-300 hover:text-rose-600">`);
            if (BIcon) {
              $$renderer3.push("<!--[-->");
              BIcon($$renderer3, { size: 12 });
              $$renderer3.push("<!--]-->");
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push("<!--]-->");
            }
            $$renderer3.push(` ${escape_html(blockTypeLabel[btype])}</button>`);
          }
          $$renderer3.push(`<!--]--></div></div> <div class="grid gap-3 sm:grid-cols-2 pt-1 border-t border-zinc-100"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>CTA Label <span class="font-normal text-zinc-400">(optional)</span></span> <input${attr_class(clsx(inp))}${attr("value", sec.ctaLabel ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>CTA Link</span> <input${attr_class(clsx(inp))}${attr("value", sec.ctaHref ?? "")} placeholder="/about"/></label></div></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--> `);
      if (sections.length === 0 && true) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="rounded-2xl border border-dashed border-zinc-200 py-8 text-center text-sm text-zinc-400">No custom sections yet</div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<button type="button" class="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-600 hover:border-rose-300 hover:text-rose-600">`);
        Plus($$renderer3, { size: 15 });
        $$renderer3.push(`<!----> Add section</button>`);
      }
      $$renderer3.push(`<!--]--> <div class="flex justify-end"><button type="submit"${attr_class(`rounded-xl ${"bg-rose-600 hover:bg-rose-700"} px-5 py-2.5 text-sm font-semibold text-white`)}>${escape_html("Save sections")}</button></div></form></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { sections });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const section = data.section;
    const rawSection = data.content[section];
    let s = structuredClone(rawSection ?? (section === "nav" ? [] : {}));
    if (section === "hero" || section === "cta") {
      const o = s;
      if (!Array.isArray(o.bgImages)) o.bgImages = [];
      if (!o.primaryCta || typeof o.primaryCta !== "object") o.primaryCta = { label: "", href: "" };
      if (!o.secondaryCta || typeof o.secondaryCta !== "object") o.secondaryCta = { label: "", href: "" };
    }
    if (section === "about") {
      const o = s;
      if (!Array.isArray(o.quoteBgImages)) o.quoteBgImages = [];
    }
    if (section === "impact") {
      const o = s;
      if (!Array.isArray(o.stats)) o.stats = [];
    }
    if (section === "homeGallery") {
      const o = s;
      if (!Array.isArray(o.images)) o.images = [];
    }
    if (section === "partners") {
      const o = s;
      if (!Array.isArray(o.logos)) o.logos = [];
    }
    if (section === "aboutPage") {
      const o = s;
      if (!Array.isArray(o.heroBgImages)) o.heroBgImages = [];
      if (!Array.isArray(o.ctaBgImages)) o.ctaBgImages = [];
      if (!Array.isArray(o.purpose)) o.purpose = [];
      if (!Array.isArray(o.stats)) o.stats = [];
    }
    if (section === "setemPage") {
      const o = s;
      if (!Array.isArray(o.heroBgImages)) o.heroBgImages = [];
      if (!Array.isArray(o.ctaBgImages)) o.ctaBgImages = [];
      if (!Array.isArray(o.gapStats)) o.gapStats = [];
      if (!Array.isArray(o.expect)) o.expect = [];
      if (!Array.isArray(o.audience)) o.audience = [];
      if (!Array.isArray(o.steps)) o.steps = [];
    }
    if (section === "csrPage") {
      const o = s;
      if (!Array.isArray(o.heroBgImages)) o.heroBgImages = [];
      if (!Array.isArray(o.ctaBgImages)) o.ctaBgImages = [];
      if (!Array.isArray(o.stories)) o.stories = [];
    }
    if (section === "customSections") {
      const cs = s;
      for (const k of PAGE_KEYS) {
        if (!Array.isArray(cs[k])) cs[k] = [];
      }
    }
    const json = derived(() => JSON.stringify(s));
    const sectionLabel = {
      brand: "Brand",
      nav: "Navigation Links",
      hero: "Hero Section",
      about: "About Section",
      programs: "Programs Section",
      impact: "Impact Section",
      cta: "CTA Section",
      footer: "Contact & Footer",
      homeGallery: "Home Gallery",
      partners: "Partners",
      customSections: "Custom Sections",
      aboutPage: "About Us",
      setemPage: "SETEM",
      csrPage: "CSR Stories"
    };
    const overlayOptions = ["light", "medium", "dark"];
    let csrEditIdx = null;
    const _cs = data.content.customSections ?? {};
    let homeCustom = structuredClone(_cs.home ?? []);
    let aboutCustom = structuredClone(_cs.about ?? []);
    let setemCustom = structuredClone(_cs.setem ?? []);
    let csrCustom = structuredClone(_cs.csr ?? []);
    const _so = data.content.sectionOrder;
    let aboutOrder = structuredClone(_so?.aboutPage ?? DEFAULT_ABOUT_ORDER);
    let setemOrder = structuredClone(_so?.setemPage ?? DEFAULT_SETEM_ORDER);
    let csrOrder = structuredClone(_so?.csrPage ?? DEFAULT_CSR_ORDER);
    const aboutOrderJson = derived(() => JSON.stringify(aboutOrder));
    const setemOrderJson = derived(() => JSON.stringify(setemOrder));
    const csrOrderJson = derived(() => JSON.stringify(csrOrder));
    let orderDragging = null;
    let orderDragOver = null;
    let csPage = "home";
    const csPageLabels = {
      home: "Home",
      about: "About",
      setem: "SETEM",
      csr: "CSR Stories"
    };
    const isMultiSection = section === "aboutPage" || section === "setemPage" || section === "csrPage";
    const pageSectionsMeta = section === "aboutPage" ? ABOUT_SECTIONS : section === "setemPage" ? SETEM_SECTIONS : section === "csrPage" ? CSR_SECTIONS : [];
    const pageOrder = derived(() => section === "aboutPage" ? aboutOrder : section === "setemPage" ? setemOrder : section === "csrPage" ? csrOrder : []);
    const pagePreviewPath = section === "aboutPage" ? "/about" : section === "setemPage" ? "/setem" : "/csr-stories";
    let activeSubSection = pageSectionsMeta[0]?.key ?? "";
    function getCustomArr() {
      return section === "aboutPage" ? aboutCustom : section === "setemPage" ? setemCustom : csrCustom;
    }
    function getCustomKey() {
      return section === "aboutPage" ? "about" : section === "setemPage" ? "setem" : "csr";
    }
    const activeIsCustomSection = derived(() => getCustomArr().some((s2) => s2.id === activeSubSection));
    const unifiedNavItems = derived(() => {
      const result = [];
      for (const key of pageOrder()) {
        if (key === "customSections") {
          for (const sec of getCustomArr()) result.push(sec.id);
        } else {
          result.push(key);
        }
      }
      const existing = new Set(result);
      for (const sec of getCustomArr()) {
        if (!existing.has(sec.id)) result.push(sec.id);
      }
      return result;
    });
    const customOrderJson = derived(() => JSON.stringify(getCustomArr()));
    const customOrderKey = derived(getCustomKey);
    const blockTypeLabel = {
      paragraph: "Paragraph",
      text: "Text",
      image: "Image",
      bulletList: "Bullet List"
    };
    let pickerOpen = false;
    let pickerFn = null;
    function onPickerSelect(url) {
      pickerFn?.(url);
      pickerFn = null;
    }
    const inp = "rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full bg-white";
    const ta = inp + " resize-y";
    const lbl = "text-sm font-medium text-zinc-700";
    const isImg = (url) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    const thumbCls = "h-9 w-9 shrink-0 rounded-lg border border-zinc-200 object-cover bg-zinc-50";
    const emptyThumbCls = "h-9 w-9 shrink-0 rounded-lg border border-zinc-200 bg-zinc-100";
    const browseCls = "shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:border-rose-300 hover:text-rose-600";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1h5ess0", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>${escape_html(sectionLabel[section] ?? section)} · Site · Cakna Hub Admin</title>`);
        });
      });
      $$renderer3.push(`<form method="POST" action="?/sectionOrder" class="hidden"><input type="hidden" name="json"${attr("value", aboutOrderJson())}/> <input type="hidden" name="pageKey" value="aboutPage"/></form> <form method="POST" action="?/sectionOrder" class="hidden"><input type="hidden" name="json"${attr("value", setemOrderJson())}/> <input type="hidden" name="pageKey" value="setemPage"/></form> <form method="POST" action="?/sectionOrder" class="hidden"><input type="hidden" name="json"${attr("value", csrOrderJson())}/> <input type="hidden" name="pageKey" value="csrPage"/></form> <form method="POST" action="?/customSections" class="hidden"><input type="hidden" name="json"${attr("value", customOrderJson())}/> <input type="hidden" name="pageKey"${attr("value", customOrderKey())}/></form> `);
      if (isMultiSection) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="-mx-6 -my-8 md:-my-10 flex divide-x divide-zinc-200 overflow-hidden" style="height: 100vh;"><div class="flex w-[380px] shrink-0 flex-col bg-white"><div class="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3"><div class="flex items-center gap-1.5 text-sm"><a href="/hub/admin/site" class="flex items-center gap-1 text-zinc-500 hover:text-zinc-900">`);
        Arrow_left($$renderer3, { size: 13 });
        $$renderer3.push(`<!----> Website</a> <span class="text-zinc-300">/</span> <span class="font-medium text-zinc-900">${escape_html(sectionLabel[section] ?? section)}</span></div> <div class="flex items-center gap-2">`);
        {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div></div> <div class="shrink-0 border-b border-zinc-100 p-2"><div><!--[-->`);
        const each_array = ensure_array_like(unifiedNavItems());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let itemKey = each_array[$$index];
          const meta = pageSectionsMeta.find((s2) => s2.key === itemKey);
          const customSec = meta ? null : getCustomArr().find((s2) => s2.id === itemKey);
          $$renderer3.push(`<div${attr_class(`flex items-center gap-0.5 transition-opacity ${orderDragging === itemKey ? "opacity-30" : ""} ${orderDragOver === itemKey && orderDragging !== itemKey ? "rounded-lg outline outline-2 outline-rose-400 outline-offset-[-2px]" : ""}`)}><span draggable="true" role="button" tabindex="0" class="shrink-0 cursor-grab p-1 text-zinc-300 hover:text-zinc-500 active:cursor-grabbing"${attr("aria-label", `Drag to reorder ${stringify(meta?.label ?? customSec?.title ?? itemKey)}`)}>`);
          Grip_vertical($$renderer3, { size: 14 });
          $$renderer3.push(`<!----></span> <button type="button"${attr_class(`flex flex-1 items-center rounded-lg px-2 py-2 text-left text-sm transition-colors ${activeSubSection === itemKey ? "bg-rose-50 text-rose-700 font-medium" : "text-zinc-600 hover:bg-zinc-50"}`)}>${escape_html(meta?.label ?? customSec?.title ?? itemKey)}</button> `);
          if (customSec) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<button type="button" class="shrink-0 rounded-lg p-1.5 text-zinc-300 hover:text-red-500"${attr("aria-label", `Delete ${stringify(customSec.title)}`)}>`);
            X($$renderer3, { size: 13 });
            $$renderer3.push(`<!----></button>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]--></div> `);
        {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<button type="button" class="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-400 hover:text-rose-600">`);
          Plus($$renderer3, { size: 13 });
          $$renderer3.push(`<!----> Add section</button>`);
        }
        $$renderer3.push(`<!--]--></div> <div class="flex-1 overflow-y-auto">`);
        if (activeIsCustomSection()) {
          $$renderer3.push("<!--[0-->");
          const arr = getCustomArr();
          const pk = getCustomKey();
          const activeSec = arr.find((s2) => s2.id === activeSubSection);
          if (activeSec) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<form method="POST" action="?/customSections"><input type="hidden" name="pageKey"${attr("value", pk)}/> <input type="hidden" name="json"${attr("value", JSON.stringify(arr))}/> <div class="p-4 space-y-4"><p class="text-xs font-semibold uppercase tracking-wider text-zinc-400">${escape_html(activeSec.title || "Custom Section")}</p> <div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Background</span> `);
            $$renderer3.select(
              {
                class: inp,
                value: activeSec.background,
                onchange: (e) => activeSec.background = e.currentTarget.value
              },
              ($$renderer4) => {
                $$renderer4.option({ value: "white" }, ($$renderer5) => {
                  $$renderer5.push(`White`);
                });
                $$renderer4.option({ value: "tint" }, ($$renderer5) => {
                  $$renderer5.push(`Tint (light rose)`);
                });
              }
            );
            $$renderer3.push(`</label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", activeSec.eyebrow ?? "")} placeholder="Optional"/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", activeSec.title)}/></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Content Blocks</p> <div class="space-y-2"><!--[-->`);
            const each_array_1 = ensure_array_like(activeSec.blocks);
            for (let $$index_4 = 0, $$length = each_array_1.length; $$index_4 < $$length; $$index_4++) {
              let block = each_array_1[$$index_4];
              $$renderer3.push(`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/80"><div class="flex items-center gap-2 border-b border-zinc-100 bg-white px-3 py-2">`);
              if (block.type === "paragraph") {
                $$renderer3.push("<!--[0-->");
                Align_left($$renderer3, { size: 13, class: "shrink-0 text-zinc-400" });
              } else if (block.type === "text") {
                $$renderer3.push("<!--[1-->");
                Type($$renderer3, { size: 13, class: "shrink-0 text-zinc-400" });
              } else if (block.type === "image") {
                $$renderer3.push("<!--[2-->");
                Image($$renderer3, { size: 13, class: "shrink-0 text-zinc-400" });
              } else {
                $$renderer3.push("<!--[-1-->");
                List($$renderer3, { size: 13, class: "shrink-0 text-zinc-400" });
              }
              $$renderer3.push(`<!--]--> <span class="text-xs font-semibold uppercase tracking-wide text-zinc-500">${escape_html(blockTypeLabel[block.type])}</span> <button type="button" class="ml-auto rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600">`);
              X($$renderer3, { size: 12 });
              $$renderer3.push(`<!----></button></div> <div class="p-3">`);
              if (block.type === "paragraph") {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<textarea${attr_class(clsx(ta))} rows="3" placeholder="Paragraph content…">`);
                const $$body = escape_html(block.content ?? "");
                if ($$body) {
                  $$renderer3.push(`${$$body}`);
                }
                $$renderer3.push(`</textarea> <div class="mt-2 flex items-center gap-1"><span class="text-xs text-zinc-400 mr-1">Align:</span> <!--[-->`);
                const each_array_2 = ensure_array_like([
                  ["left", Align_left],
                  ["center", Align_center],
                  ["right", Align_right],
                  ["justify", Align_justify]
                ]);
                for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
                  let [val, Icon2] = each_array_2[$$index_1];
                  $$renderer3.push(`<button type="button"${attr_class(`rounded p-1.5 ${(block.align ?? "left") === val ? "bg-rose-100 text-rose-600" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"}`)}>`);
                  if (Icon2) {
                    $$renderer3.push("<!--[-->");
                    Icon2($$renderer3, { size: 13 });
                    $$renderer3.push("<!--]-->");
                  } else {
                    $$renderer3.push("<!--[!-->");
                    $$renderer3.push("<!--]-->");
                  }
                  $$renderer3.push(`</button>`);
                }
                $$renderer3.push(`<!--]--></div>`);
              } else if (block.type === "text") {
                $$renderer3.push("<!--[1-->");
                $$renderer3.push(`<input${attr_class(clsx(inp))}${attr("value", block.content ?? "")} placeholder="Short text line…"/>`);
              } else if (block.type === "image") {
                $$renderer3.push("<!--[2-->");
                $$renderer3.push(`<div class="space-y-2">`);
                $$renderer3.select(
                  {
                    class: inp,
                    value: block.imageStyle ?? "gallery",
                    onchange: (e) => block.imageStyle = e.currentTarget.value
                  },
                  ($$renderer4) => {
                    $$renderer4.option({ value: "gallery" }, ($$renderer5) => {
                      $$renderer5.push(`Gallery (grid)`);
                    });
                    $$renderer4.option({ value: "background" }, ($$renderer5) => {
                      $$renderer5.push(`Background image`);
                    });
                    $$renderer4.option({ value: "both" }, ($$renderer5) => {
                      $$renderer5.push(`Both (bg + gallery)`);
                    });
                  }
                );
                $$renderer3.push(` <!--[-->`);
                const each_array_3 = ensure_array_like(block.images ?? []);
                for (let ii = 0, $$length2 = each_array_3.length; ii < $$length2; ii++) {
                  let img = each_array_3[ii];
                  $$renderer3.push(`<div class="flex items-center gap-2">`);
                  if (isImg(img)) {
                    $$renderer3.push("<!--[0-->");
                    $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                  } else {
                    $$renderer3.push("<!--[-1-->");
                    $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                  }
                  $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/image.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                  Image_plus($$renderer3, { size: 13 });
                  $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                  Trash_2($$renderer3, { size: 13 });
                  $$renderer3.push(`<!----></button></div>`);
                }
                $$renderer3.push(`<!--]--> <div class="flex gap-2"><button type="button" class="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700">`);
                Plus($$renderer3, { size: 12 });
                $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-rose-600">`);
                Image_plus($$renderer3, { size: 12 });
                $$renderer3.push(`<!----> Pick</button></div></div>`);
              } else if (block.type === "bulletList") {
                $$renderer3.push("<!--[3-->");
                $$renderer3.push(`<div class="space-y-2"><!--[-->`);
                const each_array_4 = ensure_array_like(block.items ?? []);
                for (let bi = 0, $$length2 = each_array_4.length; bi < $$length2; bi++) {
                  each_array_4[bi];
                  $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", block.items[bi])} placeholder="Bullet item…"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                  Trash_2($$renderer3, { size: 13 });
                  $$renderer3.push(`<!----></button></div>`);
                }
                $$renderer3.push(`<!--]--> <button type="button" class="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700">`);
                Plus($$renderer3, { size: 12 });
                $$renderer3.push(`<!----> Add bullet</button></div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div></div>`);
            }
            $$renderer3.push(`<!--]--></div> <div class="mt-3 flex flex-wrap gap-2"><span class="self-center text-xs text-zinc-400">Add block:</span> <!--[-->`);
            const each_array_5 = ensure_array_like(["paragraph", "text", "image", "bulletList"]);
            for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
              let btype = each_array_5[$$index_5];
              $$renderer3.push(`<button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 hover:border-rose-300 hover:text-rose-600">`);
              if (btype === "paragraph") {
                $$renderer3.push("<!--[0-->");
                Align_left($$renderer3, { size: 11 });
              } else if (btype === "text") {
                $$renderer3.push("<!--[1-->");
                Type($$renderer3, { size: 11 });
              } else if (btype === "image") {
                $$renderer3.push("<!--[2-->");
                Image($$renderer3, { size: 11 });
              } else {
                $$renderer3.push("<!--[-1-->");
                List($$renderer3, { size: 11 });
              }
              $$renderer3.push(`<!--]--> ${escape_html(blockTypeLabel[btype])}</button>`);
            }
            $$renderer3.push(`<!--]--></div></div> <div class="grid grid-cols-2 gap-3 border-t border-zinc-100 pt-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>CTA Label</span> <input${attr_class(clsx(inp))}${attr("value", activeSec.ctaLabel ?? "")} placeholder="Optional"/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>CTA Link</span> <input${attr_class(clsx(inp))}${attr("value", activeSec.ctaHref ?? "")} placeholder="/contact"/></label></div> <div class="flex justify-end"><button type="submit"${attr_class(`rounded-xl px-4 py-2 text-sm font-semibold text-white ${"bg-rose-600 hover:bg-rose-700"}`)}>${escape_html("Save section")}</button></div></div></form>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<form id="main-save-form" method="POST" action="?/save"><input type="hidden" name="json"${attr("value", json())}/> `);
          if (form?.error) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <div class="p-4">`);
          if (section === "aboutPage") {
            $$renderer3.push("<!--[0-->");
            const ap = s;
            if (activeSubSection === "hero") {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Hero</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", ap.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: ap.heroOverlay ?? "medium",
                  onchange: (e) => ap.heroOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_6 = ensure_array_like(overlayOptions);
                  for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
                    let o = each_array_6[$$index_6];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", ap.heading ?? "")}/></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_7 = ensure_array_like(ap.heroBgImages);
              for (let i = 0, $$length = each_array_7.length; i < $$length; i++) {
                let img = each_array_7[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/hero.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Pick</button></div></div></div>`);
            } else if (activeSubSection === "whoWeAre") {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Who We Are</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Who Title</span> <input${attr_class(clsx(inp))}${attr("value", ap.whoTitle ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Vision Title</span> <input${attr_class(clsx(inp))}${attr("value", ap.visionTitle ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Who Body</span> <textarea${attr_class(clsx(ta))} rows="4">`);
              const $$body_1 = escape_html(ap.whoBody ?? "");
              if ($$body_1) {
                $$renderer3.push(`${$$body_1}`);
              }
              $$renderer3.push(`</textarea></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Vision Text</span> <textarea${attr_class(clsx(ta))} rows="3">`);
              const $$body_2 = escape_html(ap.visionText ?? "");
              if ($$body_2) {
                $$renderer3.push(`${$$body_2}`);
              }
              $$renderer3.push(`</textarea></label></div>`);
            } else if (activeSubSection === "purpose") {
              $$renderer3.push("<!--[2-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Purpose</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", ap.purposeEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", ap.purposeTitle ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtitle</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_3 = escape_html(ap.purposeSubtitle ?? "");
              if ($$body_3) {
                $$renderer3.push(`${$$body_3}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Purpose Items</p> <div class="space-y-2"><!--[-->`);
              const each_array_8 = ensure_array_like(ap.purpose);
              for (let i = 0, $$length = each_array_8.length; i < $$length; i++) {
                let item = each_array_8[i];
                $$renderer3.push(`<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3"><div class="flex items-start gap-2"><input${attr_class(clsx(inp))}${attr("value", item.title)} placeholder="Purpose title"/> <button type="button" class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div> <textarea${attr_class(clsx(ta))} rows="2" placeholder="Description">`);
                const $$body_4 = escape_html(item.desc);
                if ($$body_4) {
                  $$renderer3.push(`${$$body_4}`);
                }
                $$renderer3.push(`</textarea></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add item</button></div></div>`);
            } else if (activeSubSection === "collabStats") {
              $$renderer3.push("<!--[3-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Collaboration &amp; Stats</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", ap.collabEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", ap.collabTitle ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtitle</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_5 = escape_html(ap.collabSubtitle ?? "");
              if ($$body_5) {
                $$renderer3.push(`${$$body_5}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Stats</p> <div class="space-y-2"><!--[-->`);
              const each_array_9 = ensure_array_like(ap.stats);
              for (let i = 0, $$length = each_array_9.length; i < $$length; i++) {
                let stat = each_array_9[i];
                $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", stat.value)} placeholder="5,000+"/> <input${attr_class(clsx(inp))}${attr("value", stat.label)} placeholder="Students helped"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add stat</button></div></div>`);
            } else if (activeSubSection === "testimonial") {
              $$renderer3.push("<!--[4-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Testimonial</p> <div class="space-y-4"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Quote</span> <textarea${attr_class(clsx(ta))} rows="3">`);
              const $$body_6 = escape_html(ap.testimonial ?? "");
              if ($$body_6) {
                $$renderer3.push(`${$$body_6}`);
              }
              $$renderer3.push(`</textarea></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Author</span> <input${attr_class(clsx(inp))}${attr("value", ap.testimonialAuthor ?? "")} placeholder="Name, Role"/></label></div>`);
            } else if (activeSubSection === "cta") {
              $$renderer3.push("<!--[5-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Call to Action</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", ap.ctaHeading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: ap.ctaOverlay ?? "medium",
                  onchange: (e) => ap.ctaOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_10 = ensure_array_like(overlayOptions);
                  for (let $$index_10 = 0, $$length = each_array_10.length; $$index_10 < $$length; $$index_10++) {
                    let o = each_array_10[$$index_10];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Body Text</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_7 = escape_html(ap.ctaText ?? "");
              if ($$body_7) {
                $$renderer3.push(`${$$body_7}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_11 = ensure_array_like(ap.ctaBgImages);
              for (let i = 0, $$length = each_array_11.length; i < $$length; i++) {
                let img = each_array_11[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/cta.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Pick</button></div></div> <div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Label</span> <input${attr_class(clsx(inp))}${attr("value", ap.ctaLabel ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Link</span> <input${attr_class(clsx(inp))}${attr("value", ap.ctaHref ?? "")} placeholder="/contact"/></label></div></div>`);
            } else if (activeSubSection === "customSections") {
              $$renderer3.push("<!--[6-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Custom Sections</p> `);
              CustomSectionsEditor($$renderer3, {
                formAction: "?/customSections",
                pageKey: "about",
                get sections() {
                  return aboutCustom;
                },
                set sections($$value) {
                  aboutCustom = $$value;
                  $$settled = false;
                }
              });
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else if (section === "setemPage") {
            $$renderer3.push("<!--[1-->");
            const sp = s;
            if (activeSubSection === "hero") {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Hero</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", sp.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: sp.heroOverlay ?? "medium",
                  onchange: (e) => sp.heroOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_12 = ensure_array_like(overlayOptions);
                  for (let $$index_12 = 0, $$length = each_array_12.length; $$index_12 < $$length; $$index_12++) {
                    let o = each_array_12[$$index_12];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", sp.heading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtext</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_8 = escape_html(sp.subtext ?? "");
              if ($$body_8) {
                $$renderer3.push(`${$$body_8}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_13 = ensure_array_like(sp.heroBgImages);
              for (let i = 0, $$length = each_array_13.length; i < $$length; i++) {
                let img = each_array_13[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/hero.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Pick</button></div></div></div>`);
            } else if (activeSubSection === "gap") {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">The Gap</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", sp.gapEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", sp.gapTitle ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtitle</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_9 = escape_html(sp.gapSubtitle ?? "");
              if ($$body_9) {
                $$renderer3.push(`${$$body_9}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Gap Stats</p> <div class="space-y-2"><!--[-->`);
              const each_array_14 = ensure_array_like(sp.gapStats);
              for (let i = 0, $$length = each_array_14.length; i < $$length; i++) {
                let stat = each_array_14[i];
                $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", stat.value)} placeholder="1 in 5"/> <input${attr_class(clsx(inp))}${attr("value", stat.label)} placeholder="children struggle"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add stat</button></div></div>`);
            } else if (activeSubSection === "whatIsSetem") {
              $$renderer3.push("<!--[2-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">What Is SETEM</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", sp.whatEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", sp.whatTitle ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Body</span> <textarea${attr_class(clsx(ta))} rows="4">`);
              const $$body_10 = escape_html(sp.whatBody ?? "");
              if ($$body_10) {
                $$renderer3.push(`${$$body_10}`);
              }
              $$renderer3.push(`</textarea></label></div>`);
            } else if (activeSubSection === "whatToExpect") {
              $$renderer3.push("<!--[3-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">What to Expect</p> <div class="space-y-4"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Section Title</span> <input${attr_class(clsx(inp))}${attr("value", sp.expectTitle ?? "")}/></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Expectations</p> <div class="space-y-2"><!--[-->`);
              const each_array_15 = ensure_array_like(sp.expect);
              for (let i = 0, $$length = each_array_15.length; i < $$length; i++) {
                let item = each_array_15[i];
                $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", item)} placeholder="Expectation…"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add item</button></div></div>`);
            } else if (activeSubSection === "whoIsItFor") {
              $$renderer3.push("<!--[4-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Who Is It For</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", sp.audienceEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", sp.audienceTitle ?? "")}/></label></div> <div><p class="mb-2 text-sm font-medium text-zinc-700">Audience Groups</p> <div class="space-y-2"><!--[-->`);
              const each_array_16 = ensure_array_like(sp.audience);
              for (let i = 0, $$length = each_array_16.length; i < $$length; i++) {
                let item = each_array_16[i];
                $$renderer3.push(`<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3"><div class="flex items-start gap-2"><input${attr_class(clsx(inp))}${attr("value", item.title)} placeholder="Group name"/> <button type="button" class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div> <textarea${attr_class(clsx(ta))} rows="2" placeholder="Description">`);
                const $$body_11 = escape_html(item.desc);
                if ($$body_11) {
                  $$renderer3.push(`${$$body_11}`);
                }
                $$renderer3.push(`</textarea></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add group</button></div></div>`);
            } else if (activeSubSection === "ourProcess") {
              $$renderer3.push("<!--[5-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Our Process</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", sp.processEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", sp.processTitle ?? "")}/></label></div> <div><p class="mb-2 text-sm font-medium text-zinc-700">Steps</p> <div class="space-y-2"><!--[-->`);
              const each_array_17 = ensure_array_like(sp.steps);
              for (let i = 0, $$length = each_array_17.length; i < $$length; i++) {
                let step = each_array_17[i];
                $$renderer3.push(`<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3"><div class="flex items-start gap-2"><input${attr_class(clsx(inp))}${attr("value", step.title)} placeholder="Step name"/> <button type="button" class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div> <textarea${attr_class(clsx(ta))} rows="2" placeholder="Description">`);
                const $$body_12 = escape_html(step.desc);
                if ($$body_12) {
                  $$renderer3.push(`${$$body_12}`);
                }
                $$renderer3.push(`</textarea></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add step</button></div></div>`);
            } else if (activeSubSection === "cta") {
              $$renderer3.push("<!--[6-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Call to Action</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", sp.ctaHeading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: sp.ctaOverlay ?? "medium",
                  onchange: (e) => sp.ctaOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_18 = ensure_array_like(overlayOptions);
                  for (let $$index_18 = 0, $$length = each_array_18.length; $$index_18 < $$length; $$index_18++) {
                    let o = each_array_18[$$index_18];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Body Text</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_13 = escape_html(sp.ctaText ?? "");
              if ($$body_13) {
                $$renderer3.push(`${$$body_13}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_19 = ensure_array_like(sp.ctaBgImages);
              for (let i = 0, $$length = each_array_19.length; i < $$length; i++) {
                let img = each_array_19[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/cta.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Pick</button></div></div> <div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Label</span> <input${attr_class(clsx(inp))}${attr("value", sp.ctaLabel ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Link</span> <input${attr_class(clsx(inp))}${attr("value", sp.ctaHref ?? "")} placeholder="/contact"/></label></div></div>`);
            } else if (activeSubSection === "customSections") {
              $$renderer3.push("<!--[7-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Custom Sections</p> `);
              CustomSectionsEditor($$renderer3, {
                formAction: "?/customSections",
                pageKey: "setem",
                get sections() {
                  return setemCustom;
                },
                set sections($$value) {
                  setemCustom = $$value;
                  $$settled = false;
                }
              });
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else if (section === "csrPage") {
            $$renderer3.push("<!--[2-->");
            const cp = s;
            if (activeSubSection === "hero") {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Hero</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", cp.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: cp.heroOverlay ?? "medium",
                  onchange: (e) => cp.heroOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_20 = ensure_array_like(overlayOptions);
                  for (let $$index_20 = 0, $$length = each_array_20.length; $$index_20 < $$length; $$index_20++) {
                    let o = each_array_20[$$index_20];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", cp.heading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtext</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_14 = escape_html(cp.subtext ?? "");
              if ($$body_14) {
                $$renderer3.push(`${$$body_14}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_21 = ensure_array_like(cp.heroBgImages);
              for (let i = 0, $$length = each_array_21.length; i < $$length; i++) {
                let img = each_array_21[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/hero.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Pick</button></div></div></div>`);
            } else if (activeSubSection === "stories") {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">CSR Stories</p> <div class="space-y-3"><div class="flex items-center justify-between"><span class="text-sm text-zinc-500">${escape_html(cp.stories.length)} ${escape_html(cp.stories.length === 1 ? "story" : "stories")}</span> <button type="button" class="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add story</button></div> <!--[-->`);
              const each_array_22 = ensure_array_like(cp.stories);
              for (let i = 0, $$length = each_array_22.length; i < $$length; i++) {
                let story = each_array_22[i];
                $$renderer3.push(`<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden"><div class="flex items-center justify-between bg-zinc-50 border-b border-zinc-100 px-4 py-2.5"><div class="flex items-center gap-2 min-w-0">`);
                if (isImg(story.cover ?? "")) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", story.cover)} alt="" class="h-7 w-7 rounded-lg border border-zinc-200 object-cover shrink-0"/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]--> <div class="min-w-0"><p class="truncate text-sm font-medium text-zinc-900">${escape_html(story.title || "(untitled)")}</p> <p class="text-xs text-zinc-400">${escape_html(story.date || "No date")}</p></div></div> <div class="flex shrink-0 items-center gap-1.5 ml-2"><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50">`);
                Pencil($$renderer3, { size: 11 });
                $$renderer3.push(`<!----> ${escape_html(csrEditIdx === i ? "Close" : "Edit")}</button> <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 11 });
                $$renderer3.push(`<!----></button></div></div> `);
                if (csrEditIdx === i) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<div class="space-y-4 p-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", story.title)} placeholder="Story title"/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Category</span> <input${attr_class(clsx(inp))}${attr("value", story.category)} placeholder="Education"/></label></div> <div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Date</span> <input${attr_class(clsx(inp))} type="date"${attr("value", story.date)}/></label> <div class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Cover Image</span> <div class="flex items-center gap-2">`);
                  if (isImg(story.cover ?? "")) {
                    $$renderer3.push("<!--[0-->");
                    $$renderer3.push(`<img${attr("src", story.cover)} alt=""${attr_class(clsx(thumbCls))}/>`);
                  } else {
                    $$renderer3.push("<!--[-1-->");
                    $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                  }
                  $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", story.cover ?? "")} placeholder="/uploads/cover.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                  Image_plus($$renderer3, { size: 13 });
                  $$renderer3.push(`<!----></button></div></div></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Excerpt</span> <textarea${attr_class(clsx(ta))} rows="3" placeholder="Short summary…">`);
                  const $$body_15 = escape_html(story.excerpt);
                  if ($$body_15) {
                    $$renderer3.push(`${$$body_15}`);
                  }
                  $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Gallery Images</p> <div class="space-y-2"><!--[-->`);
                  const each_array_23 = ensure_array_like(story.images ?? []);
                  for (let gi = 0, $$length2 = each_array_23.length; gi < $$length2; gi++) {
                    let gImg = each_array_23[gi];
                    $$renderer3.push(`<div class="flex items-center gap-2">`);
                    if (isImg(gImg)) {
                      $$renderer3.push("<!--[0-->");
                      $$renderer3.push(`<img${attr("src", gImg)} alt=""${attr_class(clsx(thumbCls))}/>`);
                    } else {
                      $$renderer3.push("<!--[-1-->");
                      $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                    }
                    $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", gImg)} placeholder="/uploads/gallery.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                    Image_plus($$renderer3, { size: 13 });
                    $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                    Trash_2($$renderer3, { size: 13 });
                    $$renderer3.push(`<!----></button></div>`);
                  }
                  $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
                  Plus($$renderer3, { size: 13 });
                  $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
                  Image_plus($$renderer3, { size: 13 });
                  $$renderer3.push(`<!----> Pick</button></div></div></div>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]--></div>`);
              }
              $$renderer3.push(`<!--]--> `);
              if (cp.stories.length === 0) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<div class="rounded-2xl border border-dashed border-zinc-200 py-8 text-center text-sm text-zinc-400">No stories yet — add the first one above.</div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div>`);
            } else if (activeSubSection === "cta") {
              $$renderer3.push("<!--[2-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Call to Action</p> <div class="space-y-4"><div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", cp.ctaHeading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: cp.ctaOverlay ?? "medium",
                  onchange: (e) => cp.ctaOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_24 = ensure_array_like(overlayOptions);
                  for (let $$index_24 = 0, $$length = each_array_24.length; $$index_24 < $$length; $$index_24++) {
                    let o = each_array_24[$$index_24];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Body Text</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_16 = escape_html(cp.ctaText ?? "");
              if ($$body_16) {
                $$renderer3.push(`${$$body_16}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_25 = ensure_array_like(cp.ctaBgImages);
              for (let i = 0, $$length = each_array_25.length; i < $$length; i++) {
                let img = each_array_25[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/cta.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 13 });
              $$renderer3.push(`<!----> Pick</button></div></div> <div class="grid grid-cols-2 gap-3"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Label</span> <input${attr_class(clsx(inp))}${attr("value", cp.ctaLabel ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Link</span> <input${attr_class(clsx(inp))}${attr("value", cp.ctaHref ?? "")} placeholder="/contact"/></label></div></div>`);
            } else if (activeSubSection === "customSections") {
              $$renderer3.push("<!--[3-->");
              $$renderer3.push(`<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Custom Sections</p> `);
              CustomSectionsEditor($$renderer3, {
                formAction: "?/customSections",
                pageKey: "csr",
                get sections() {
                  return csrCustom;
                },
                set sections($$value) {
                  csrCustom = $$value;
                  $$settled = false;
                }
              });
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <div class="mt-6 flex justify-end"><button type="submit"${attr_class(`rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 ${""}`)}>${escape_html("Save changes")}</button></div></div></form>`);
        }
        $$renderer3.push(`<!--]--></div></div> <div class="relative flex flex-1 flex-col overflow-hidden bg-zinc-100"><div class="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 py-3"><span class="text-xs font-medium text-zinc-500">Live Preview</span> <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 hover:text-zinc-700">`);
        Refresh_cw($$renderer3, { size: 12 });
        $$renderer3.push(`<!----> Refresh</button></div> <div class="relative flex-1 overflow-hidden"><iframe${attr("src", pagePreviewPath)} title="Page preview" class="absolute left-0 top-0 origin-top-left border-0" style="width: 1280px; height: calc(100% / 0.6); transform: scale(0.6);" loading="lazy"></iframe></div></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="space-y-6 pb-16"><div class="flex items-center gap-3"><a href="/hub/admin/site" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
        Arrow_left($$renderer3, { size: 16 });
        $$renderer3.push(`<!----> Site</a> <span class="text-zinc-300">/</span> <h1 class="text-xl font-bold text-zinc-900">${escape_html(sectionLabel[section] ?? section)}</h1></div> `);
        if (form?.error) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> <form method="POST" action="?/save"><input type="hidden" name="json"${attr("value", json())}/> `);
        if (section === "brand") {
          $$renderer3.push("<!--[0-->");
          const b = s;
          $$renderer3.push(`<div class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6"><div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Brand Name</span> <input${attr_class(clsx(inp))}${attr("value", b.name ?? "")} placeholder="HOME CAKNA"/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Accent Word <span class="font-normal text-zinc-400">(highlighted in rose)</span></span> <input${attr_class(clsx(inp))}${attr("value", b.accentWord ?? "")} placeholder="CAKNA"/></label></div> <div class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Logo Image <span class="font-normal text-zinc-400">(optional)</span></span> <div class="flex items-center gap-2">`);
          if (isImg(b.logoImage ?? "")) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<img${attr("src", b.logoImage)} alt="logo"${attr_class(clsx(thumbCls))}/>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
          }
          $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", b.logoImage ?? "")} placeholder="/uploads/logo.png"/> <button type="button"${attr_class(clsx(browseCls))}>`);
          Image_plus($$renderer3, { size: 13 });
          $$renderer3.push(`<!----> Browse</button></div></div></div>`);
        } else if (section === "nav") {
          $$renderer3.push("<!--[1-->");
          const nav = s;
          $$renderer3.push(`<div class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6"><div><p class="text-sm font-semibold text-zinc-800">Navigation Links</p> <p class="mt-0.5 text-xs text-zinc-500">These links appear in the public website navigation bar.</p></div> <div class="space-y-2 pt-1"><!--[-->`);
          const each_array_26 = ensure_array_like(nav);
          for (let i = 0, $$length = each_array_26.length; i < $$length; i++) {
            let link = each_array_26[i];
            $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", link.label)} placeholder="About Us"/> <input${attr_class(clsx(inp))}${attr("value", link.href)} placeholder="/about"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
            Trash_2($$renderer3, { size: 14 });
            $$renderer3.push(`<!----></button></div>`);
          }
          $$renderer3.push(`<!--]--></div> <button type="button" class="mt-1 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
          Plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Add link</button></div>`);
        } else if (section === "hero") {
          $$renderer3.push("<!--[2-->");
          const h = s;
          $$renderer3.push(`<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"><div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", h.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Image Overlay</span> `);
          $$renderer3.select(
            {
              class: inp,
              value: h.overlay ?? "medium",
              onchange: (e) => h.overlay = e.currentTarget.value
            },
            ($$renderer4) => {
              $$renderer4.push(`<!--[-->`);
              const each_array_27 = ensure_array_like(overlayOptions);
              for (let $$index_27 = 0, $$length = each_array_27.length; $$index_27 < $$length; $$index_27++) {
                let o = each_array_27[$$index_27];
                $$renderer4.option({ value: o }, ($$renderer5) => {
                  $$renderer5.push(`${escape_html(o)}`);
                });
              }
              $$renderer4.push(`<!--]-->`);
            }
          );
          $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", h.heading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtext</span> <textarea${attr_class(clsx(ta))} rows="3">`);
          const $$body_17 = escape_html(h.subtext ?? "");
          if ($$body_17) {
            $$renderer3.push(`${$$body_17}`);
          }
          $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images <span class="font-normal text-zinc-400">(slideshow, optional)</span></p> <div class="space-y-2"><!--[-->`);
          const each_array_28 = ensure_array_like(h.bgImages);
          for (let i = 0, $$length = each_array_28.length; i < $$length; i++) {
            let img = each_array_28[i];
            $$renderer3.push(`<div class="flex items-center gap-2">`);
            if (isImg(img)) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
            }
            $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/hero-bg.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
            Image_plus($$renderer3, { size: 13 });
            $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
            Trash_2($$renderer3, { size: 14 });
            $$renderer3.push(`<!----></button></div>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-2 flex items-center gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
          Plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
          Image_plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Pick from media</button></div></div> <div class="grid gap-6 sm:grid-cols-2"><div class="space-y-2"><p class="text-sm font-medium text-zinc-700">Primary CTA</p> <input${attr_class(clsx(inp))}${attr("value", h.primaryCta?.label ?? "")} placeholder="Button label"/> <input${attr_class(clsx(inp))}${attr("value", h.primaryCta?.href ?? "")} placeholder="/register"/></div> <div class="space-y-2"><p class="text-sm font-medium text-zinc-700">Secondary CTA</p> <input${attr_class(clsx(inp))}${attr("value", h.secondaryCta?.label ?? "")} placeholder="Button label"/> <input${attr_class(clsx(inp))}${attr("value", h.secondaryCta?.href ?? "")} placeholder="#programs"/></div></div></div>`);
        } else if (section === "about") {
          $$renderer3.push("<!--[3-->");
          const a = s;
          $$renderer3.push(`<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"><div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", a.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", a.title ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Body <span class="font-normal text-zinc-400">(blank line = new paragraph)</span></span> <textarea${attr_class(clsx(ta))} rows="5">`);
          const $$body_18 = escape_html(a.body ?? "");
          if ($$body_18) {
            $$renderer3.push(`${$$body_18}`);
          }
          $$renderer3.push(`</textarea></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Pull Quote</span> <textarea${attr_class(clsx(ta))} rows="2">`);
          const $$body_19 = escape_html(a.quote ?? "");
          if ($$body_19) {
            $$renderer3.push(`${$$body_19}`);
          }
          $$renderer3.push(`</textarea></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Quote Subtitle</span> <input${attr_class(clsx(inp))}${attr("value", a.quoteSub ?? "")}/></label> <div class="grid gap-4 sm:grid-cols-2"><div><p class="mb-2 text-sm font-medium text-zinc-700">Quote Background Images</p> <div class="space-y-2"><!--[-->`);
          const each_array_29 = ensure_array_like(a.quoteBgImages);
          for (let i = 0, $$length = each_array_29.length; i < $$length; i++) {
            let img = each_array_29[i];
            $$renderer3.push(`<div class="flex items-center gap-2">`);
            if (isImg(img)) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
            }
            $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/quote-bg.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
            Image_plus($$renderer3, { size: 13 });
            $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
            Trash_2($$renderer3, { size: 14 });
            $$renderer3.push(`<!----></button></div>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-2 flex items-center gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
          Plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
          Image_plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Pick from media</button></div></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Quote Overlay</span> `);
          $$renderer3.select(
            {
              class: inp,
              value: a.quoteOverlay ?? "medium",
              onchange: (e) => a.quoteOverlay = e.currentTarget.value
            },
            ($$renderer4) => {
              $$renderer4.push(`<!--[-->`);
              const each_array_30 = ensure_array_like(overlayOptions);
              for (let $$index_30 = 0, $$length = each_array_30.length; $$index_30 < $$length; $$index_30++) {
                let o = each_array_30[$$index_30];
                $$renderer4.option({ value: o }, ($$renderer5) => {
                  $$renderer5.push(`${escape_html(o)}`);
                });
              }
              $$renderer4.push(`<!--]-->`);
            }
          );
          $$renderer3.push(`</label></div></div>`);
        } else if (section === "programs") {
          $$renderer3.push("<!--[4-->");
          const p = s;
          $$renderer3.push(`<div class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6"><div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", p.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", p.title ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtitle</span> <textarea${attr_class(clsx(ta))} rows="2">`);
          const $$body_20 = escape_html(p.subtitle ?? "");
          if ($$body_20) {
            $$renderer3.push(`${$$body_20}`);
          }
          $$renderer3.push(`</textarea></label> <div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>CTA Label</span> <input${attr_class(clsx(inp))}${attr("value", p.ctaLabel ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>CTA Link</span> <input${attr_class(clsx(inp))}${attr("value", p.ctaHref ?? "")} placeholder="/core"/></label></div></div>`);
        } else if (section === "impact") {
          $$renderer3.push("<!--[5-->");
          const im = s;
          $$renderer3.push(`<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"><div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", im.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", im.title ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtitle</span> <textarea${attr_class(clsx(ta))} rows="2">`);
          const $$body_21 = escape_html(im.subtitle ?? "");
          if ($$body_21) {
            $$renderer3.push(`${$$body_21}`);
          }
          $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Impact Stats</p> <div class="space-y-2"><!--[-->`);
          const each_array_31 = ensure_array_like(im.stats);
          for (let i = 0, $$length = each_array_31.length; i < $$length; i++) {
            let stat = each_array_31[i];
            $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", stat.value)} placeholder="5,000+"/> <input${attr_class(clsx(inp))}${attr("value", stat.label)} placeholder="Students helped"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
            Trash_2($$renderer3, { size: 14 });
            $$renderer3.push(`<!----></button></div>`);
          }
          $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
          Plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Add stat</button></div></div>`);
        } else if (section === "cta") {
          $$renderer3.push("<!--[6-->");
          const c = s;
          $$renderer3.push(`<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"><div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", c.heading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Image Overlay</span> `);
          $$renderer3.select(
            {
              class: inp,
              value: c.overlay ?? "medium",
              onchange: (e) => c.overlay = e.currentTarget.value
            },
            ($$renderer4) => {
              $$renderer4.push(`<!--[-->`);
              const each_array_32 = ensure_array_like(overlayOptions);
              for (let $$index_32 = 0, $$length = each_array_32.length; $$index_32 < $$length; $$index_32++) {
                let o = each_array_32[$$index_32];
                $$renderer4.option({ value: o }, ($$renderer5) => {
                  $$renderer5.push(`${escape_html(o)}`);
                });
              }
              $$renderer4.push(`<!--]-->`);
            }
          );
          $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Body</span> <textarea${attr_class(clsx(ta))} rows="3">`);
          const $$body_22 = escape_html(c.body ?? "");
          if ($$body_22) {
            $$renderer3.push(`${$$body_22}`);
          }
          $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
          const each_array_33 = ensure_array_like(c.bgImages);
          for (let i = 0, $$length = each_array_33.length; i < $$length; i++) {
            let img = each_array_33[i];
            $$renderer3.push(`<div class="flex items-center gap-2">`);
            if (isImg(img)) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
            }
            $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/cta-bg.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
            Image_plus($$renderer3, { size: 13 });
            $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
            Trash_2($$renderer3, { size: 14 });
            $$renderer3.push(`<!----></button></div>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-2 flex items-center gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
          Plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
          Image_plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Pick from media</button></div></div> <div class="grid gap-6 sm:grid-cols-2"><div class="space-y-2"><p class="text-sm font-medium text-zinc-700">Primary CTA</p> <input${attr_class(clsx(inp))}${attr("value", c.primaryCta?.label ?? "")} placeholder="Button label"/> <input${attr_class(clsx(inp))}${attr("value", c.primaryCta?.href ?? "")} placeholder="/register"/></div> <div class="space-y-2"><p class="text-sm font-medium text-zinc-700">Secondary CTA</p> <input${attr_class(clsx(inp))}${attr("value", c.secondaryCta?.label ?? "")} placeholder="Button label"/> <input${attr_class(clsx(inp))}${attr("value", c.secondaryCta?.href ?? "")} placeholder="/auth/login"/></div></div></div>`);
        } else if (section === "footer") {
          $$renderer3.push("<!--[7-->");
          const f = s;
          $$renderer3.push(`<div class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Tagline</span> <textarea${attr_class(clsx(ta))} rows="2">`);
          const $$body_23 = escape_html(f.tagline ?? "");
          if ($$body_23) {
            $$renderer3.push(`${$$body_23}`);
          }
          $$renderer3.push(`</textarea></label> <div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Phone</span> <input${attr_class(clsx(inp))}${attr("value", f.phone ?? "")} placeholder="011-2111 0110"/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Email</span> <input${attr_class(clsx(inp))} type="email"${attr("value", f.email ?? "")} placeholder="info@home.edu.my"/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Copyright</span> <input${attr_class(clsx(inp))}${attr("value", f.copyright ?? "")}/></label></div>`);
        } else if (section === "homeGallery") {
          $$renderer3.push("<!--[8-->");
          const g = s;
          $$renderer3.push(`<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"><div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", g.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", g.title ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtitle</span> <textarea${attr_class(clsx(ta))} rows="2">`);
          const $$body_24 = escape_html(g.subtitle ?? "");
          if ($$body_24) {
            $$renderer3.push(`${$$body_24}`);
          }
          $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Gallery Images</p> <div class="space-y-2"><!--[-->`);
          const each_array_34 = ensure_array_like(g.images);
          for (let i = 0, $$length = each_array_34.length; i < $$length; i++) {
            let img = each_array_34[i];
            $$renderer3.push(`<div class="flex items-center gap-2">`);
            if (isImg(img)) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
            }
            $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/gallery-1.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
            Image_plus($$renderer3, { size: 13 });
            $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
            Trash_2($$renderer3, { size: 14 });
            $$renderer3.push(`<!----></button></div>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-2 flex items-center gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
          Plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
          Image_plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Pick from media</button></div></div></div>`);
        } else if (section === "partners") {
          $$renderer3.push("<!--[9-->");
          const pt = s;
          $$renderer3.push(`<div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"><div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", pt.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", pt.title ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtitle</span> <textarea${attr_class(clsx(ta))} rows="2">`);
          const $$body_25 = escape_html(pt.subtitle ?? "");
          if ($$body_25) {
            $$renderer3.push(`${$$body_25}`);
          }
          $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Partner Logos</p> <div class="space-y-2"><!--[-->`);
          const each_array_35 = ensure_array_like(pt.logos);
          for (let i = 0, $$length = each_array_35.length; i < $$length; i++) {
            let logo = each_array_35[i];
            $$renderer3.push(`<div class="flex items-center gap-2">`);
            if (isImg(logo)) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<img${attr("src", logo)} alt="" class="h-9 w-9 shrink-0 rounded-lg border border-zinc-200 object-cover bg-zinc-50 object-contain bg-zinc-50"/>`);
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
            }
            $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", logo)} placeholder="/uploads/partner.png"/> <button type="button"${attr_class(clsx(browseCls))}>`);
            Image_plus($$renderer3, { size: 13 });
            $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
            Trash_2($$renderer3, { size: 14 });
            $$renderer3.push(`<!----></button></div>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-2 flex items-center gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
          Plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
          Image_plus($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Pick from media</button></div></div></div>`);
        } else if (section === "customSections") {
          $$renderer3.push("<!--[10-->");
          $$renderer3.push(`<div class="space-y-5"><div class="flex gap-1 border-b border-zinc-200"><!--[-->`);
          const each_array_36 = ensure_array_like(PAGE_KEYS);
          for (let $$index_36 = 0, $$length = each_array_36.length; $$index_36 < $$length; $$index_36++) {
            let pk = each_array_36[$$index_36];
            $$renderer3.push(`<button type="button"${attr_class(`relative px-4 py-2.5 text-sm font-medium transition-colors ${csPage === pk ? "text-rose-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-rose-600" : "text-zinc-500 hover:text-zinc-800"}`)}>${escape_html(csPageLabels[pk])}</button>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="rounded-2xl border border-zinc-200 bg-white p-6">`);
          {
            $$renderer3.push("<!--[0-->");
            CustomSectionsEditor($$renderer3, {
              formAction: "?/customSections",
              pageKey: "home",
              get sections() {
                return homeCustom;
              },
              set sections($$value) {
                homeCustom = $$value;
                $$settled = false;
              }
            });
          }
          $$renderer3.push(`<!--]--></div></div>`);
        } else if (section === "aboutPage") {
          $$renderer3.push("<!--[11-->");
          const ap = s;
          $$renderer3.push(`<div class="space-y-4">`);
          {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <!--[-->`);
          const each_array_37 = ensure_array_like(aboutOrder);
          for (let $$index_43 = 0, $$length = each_array_37.length; $$index_43 < $$length; $$index_43++) {
            let key = each_array_37[$$index_43];
            const sMeta = ABOUT_SECTIONS.find((s2) => s2.key === key);
            $$renderer3.push(`<div${attr_class(`space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-opacity ${orderDragging === key ? "opacity-40" : ""} ${orderDragOver === key && orderDragging !== key ? "ring-2 ring-rose-400" : ""}`)}><div class="flex items-center gap-2 border-b border-zinc-100 pb-2"><span draggable="true" role="button" tabindex="0" class="shrink-0 cursor-grab text-zinc-300 hover:text-zinc-500 active:cursor-grabbing" title="Drag to reorder">`);
            Grip_vertical($$renderer3, { size: 14 });
            $$renderer3.push(`<!----></span> <p class="text-sm font-semibold text-zinc-800">${escape_html(sMeta?.label ?? key)}</p></div> `);
            if (key === "hero") {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", ap.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: ap.heroOverlay ?? "medium",
                  onchange: (e) => ap.heroOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_38 = ensure_array_like(overlayOptions);
                  for (let $$index_37 = 0, $$length2 = each_array_38.length; $$index_37 < $$length2; $$index_37++) {
                    let o = each_array_38[$$index_37];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", ap.heading ?? "")}/></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_39 = ensure_array_like(ap.heroBgImages);
              for (let i = 0, $$length2 = each_array_39.length; i < $$length2; i++) {
                let img = each_array_39[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/hero.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Pick</button></div></div>`);
            } else if (key === "whoWeAre") {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Who Title</span> <input${attr_class(clsx(inp))}${attr("value", ap.whoTitle ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Vision Title</span> <input${attr_class(clsx(inp))}${attr("value", ap.visionTitle ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Who Body</span> <textarea${attr_class(clsx(ta))} rows="4">`);
              const $$body_26 = escape_html(ap.whoBody ?? "");
              if ($$body_26) {
                $$renderer3.push(`${$$body_26}`);
              }
              $$renderer3.push(`</textarea></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Vision Text</span> <textarea${attr_class(clsx(ta))} rows="3">`);
              const $$body_27 = escape_html(ap.visionText ?? "");
              if ($$body_27) {
                $$renderer3.push(`${$$body_27}`);
              }
              $$renderer3.push(`</textarea></label>`);
            } else if (key === "purpose") {
              $$renderer3.push("<!--[2-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", ap.purposeEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", ap.purposeTitle ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtitle</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_28 = escape_html(ap.purposeSubtitle ?? "");
              if ($$body_28) {
                $$renderer3.push(`${$$body_28}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Purpose Items <span class="font-normal text-zinc-400">(title + description pairs)</span></p> <div class="space-y-2"><!--[-->`);
              const each_array_40 = ensure_array_like(ap.purpose);
              for (let i = 0, $$length2 = each_array_40.length; i < $$length2; i++) {
                let item = each_array_40[i];
                $$renderer3.push(`<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3"><div class="flex items-start gap-2"><input${attr_class(clsx(inp))}${attr("value", item.title)} placeholder="Purpose title"/> <button type="button" class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div> <textarea${attr_class(clsx(ta))} rows="2" placeholder="Description">`);
                const $$body_29 = escape_html(item.desc);
                if ($$body_29) {
                  $$renderer3.push(`${$$body_29}`);
                }
                $$renderer3.push(`</textarea></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add item</button></div>`);
            } else if (key === "collabStats") {
              $$renderer3.push("<!--[3-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", ap.collabEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", ap.collabTitle ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtitle</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_30 = escape_html(ap.collabSubtitle ?? "");
              if ($$body_30) {
                $$renderer3.push(`${$$body_30}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Stats</p> <div class="space-y-2"><!--[-->`);
              const each_array_41 = ensure_array_like(ap.stats);
              for (let i = 0, $$length2 = each_array_41.length; i < $$length2; i++) {
                let stat = each_array_41[i];
                $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", stat.value)} placeholder="5,000+"/> <input${attr_class(clsx(inp))}${attr("value", stat.label)} placeholder="Students helped"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add stat</button></div>`);
            } else if (key === "testimonial") {
              $$renderer3.push("<!--[4-->");
              $$renderer3.push(`<label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Quote</span> <textarea${attr_class(clsx(ta))} rows="3">`);
              const $$body_31 = escape_html(ap.testimonial ?? "");
              if ($$body_31) {
                $$renderer3.push(`${$$body_31}`);
              }
              $$renderer3.push(`</textarea></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Author</span> <input${attr_class(clsx(inp))}${attr("value", ap.testimonialAuthor ?? "")} placeholder="Name, Role"/></label>`);
            } else if (key === "cta") {
              $$renderer3.push("<!--[5-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", ap.ctaHeading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: ap.ctaOverlay ?? "medium",
                  onchange: (e) => ap.ctaOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_42 = ensure_array_like(overlayOptions);
                  for (let $$index_41 = 0, $$length2 = each_array_42.length; $$index_41 < $$length2; $$index_41++) {
                    let o = each_array_42[$$index_41];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Body Text</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_32 = escape_html(ap.ctaText ?? "");
              if ($$body_32) {
                $$renderer3.push(`${$$body_32}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_43 = ensure_array_like(ap.ctaBgImages);
              for (let i = 0, $$length2 = each_array_43.length; i < $$length2; i++) {
                let img = each_array_43[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/cta.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Pick</button></div></div> <div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Label</span> <input${attr_class(clsx(inp))}${attr("value", ap.ctaLabel ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Link</span> <input${attr_class(clsx(inp))}${attr("value", ap.ctaHref ?? "")} placeholder="/contact"/></label></div>`);
            } else if (key === "customSections") {
              $$renderer3.push("<!--[6-->");
              CustomSectionsEditor($$renderer3, {
                formAction: "?/customSections",
                pageKey: "about",
                get sections() {
                  return aboutCustom;
                },
                set sections($$value) {
                  aboutCustom = $$value;
                  $$settled = false;
                }
              });
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        } else if (section === "setemPage") {
          $$renderer3.push("<!--[12-->");
          const sp = s;
          $$renderer3.push(`<div class="space-y-4"><!--[-->`);
          const each_array_44 = ensure_array_like(setemOrder);
          for (let $$index_52 = 0, $$length = each_array_44.length; $$index_52 < $$length; $$index_52++) {
            let key = each_array_44[$$index_52];
            const sMeta = SETEM_SECTIONS.find((s2) => s2.key === key);
            $$renderer3.push(`<div${attr_class(`space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-opacity ${orderDragging === key ? "opacity-40" : ""} ${orderDragOver === key && orderDragging !== key ? "ring-2 ring-rose-400" : ""}`)}><div class="flex items-center gap-2 border-b border-zinc-100 pb-2"><span draggable="true" role="button" tabindex="0" class="shrink-0 cursor-grab text-zinc-300 hover:text-zinc-500 active:cursor-grabbing" title="Drag to reorder">`);
            Grip_vertical($$renderer3, { size: 14 });
            $$renderer3.push(`<!----></span> <p class="text-sm font-semibold text-zinc-800">${escape_html(sMeta?.label ?? key)}</p></div> `);
            if (key === "hero") {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", sp.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: sp.heroOverlay ?? "medium",
                  onchange: (e) => sp.heroOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_45 = ensure_array_like(overlayOptions);
                  for (let $$index_44 = 0, $$length2 = each_array_45.length; $$index_44 < $$length2; $$index_44++) {
                    let o = each_array_45[$$index_44];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", sp.heading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtext</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_33 = escape_html(sp.subtext ?? "");
              if ($$body_33) {
                $$renderer3.push(`${$$body_33}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_46 = ensure_array_like(sp.heroBgImages);
              for (let i = 0, $$length2 = each_array_46.length; i < $$length2; i++) {
                let img = each_array_46[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/hero.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Pick</button></div></div>`);
            } else if (key === "gap") {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", sp.gapEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", sp.gapTitle ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtitle</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_34 = escape_html(sp.gapSubtitle ?? "");
              if ($$body_34) {
                $$renderer3.push(`${$$body_34}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Gap Stats</p> <div class="space-y-2"><!--[-->`);
              const each_array_47 = ensure_array_like(sp.gapStats);
              for (let i = 0, $$length2 = each_array_47.length; i < $$length2; i++) {
                let stat = each_array_47[i];
                $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", stat.value)} placeholder="1 in 5"/> <input${attr_class(clsx(inp))}${attr("value", stat.label)} placeholder="children struggle with maths"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add stat</button></div>`);
            } else if (key === "whatIsSetem") {
              $$renderer3.push("<!--[2-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", sp.whatEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", sp.whatTitle ?? "")}/></label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Body</span> <textarea${attr_class(clsx(ta))} rows="4">`);
              const $$body_35 = escape_html(sp.whatBody ?? "");
              if ($$body_35) {
                $$renderer3.push(`${$$body_35}`);
              }
              $$renderer3.push(`</textarea></label>`);
            } else if (key === "whatToExpect") {
              $$renderer3.push("<!--[3-->");
              $$renderer3.push(`<label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Section Title</span> <input${attr_class(clsx(inp))}${attr("value", sp.expectTitle ?? "")}/></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Expectations <span class="font-normal text-zinc-400">(one per item)</span></p> <div class="space-y-2"><!--[-->`);
              const each_array_48 = ensure_array_like(sp.expect);
              for (let i = 0, $$length2 = each_array_48.length; i < $$length2; i++) {
                let item = each_array_48[i];
                $$renderer3.push(`<div class="flex items-center gap-2"><input${attr_class(clsx(inp))}${attr("value", item)} placeholder="Expectation…"/> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add item</button></div>`);
            } else if (key === "whoIsItFor") {
              $$renderer3.push("<!--[4-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", sp.audienceEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", sp.audienceTitle ?? "")}/></label></div> <div><p class="mb-2 text-sm font-medium text-zinc-700">Audience Groups</p> <div class="space-y-2"><!--[-->`);
              const each_array_49 = ensure_array_like(sp.audience);
              for (let i = 0, $$length2 = each_array_49.length; i < $$length2; i++) {
                let item = each_array_49[i];
                $$renderer3.push(`<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3"><div class="flex items-start gap-2"><input${attr_class(clsx(inp))}${attr("value", item.title)} placeholder="Group name"/> <button type="button" class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div> <textarea${attr_class(clsx(ta))} rows="2" placeholder="Description">`);
                const $$body_36 = escape_html(item.desc);
                if ($$body_36) {
                  $$renderer3.push(`${$$body_36}`);
                }
                $$renderer3.push(`</textarea></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add group</button></div>`);
            } else if (key === "ourProcess") {
              $$renderer3.push("<!--[5-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", sp.processEyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", sp.processTitle ?? "")}/></label></div> <div><p class="mb-2 text-sm font-medium text-zinc-700">Steps</p> <div class="space-y-2"><!--[-->`);
              const each_array_50 = ensure_array_like(sp.steps);
              for (let i = 0, $$length2 = each_array_50.length; i < $$length2; i++) {
                let step = each_array_50[i];
                $$renderer3.push(`<div class="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3"><div class="flex items-start gap-2"><input${attr_class(clsx(inp))}${attr("value", step.title)} placeholder="Step name"/> <button type="button" class="mt-0.5 shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div> <textarea${attr_class(clsx(ta))} rows="2" placeholder="Description">`);
                const $$body_37 = escape_html(step.desc);
                if ($$body_37) {
                  $$renderer3.push(`${$$body_37}`);
                }
                $$renderer3.push(`</textarea></div>`);
              }
              $$renderer3.push(`<!--]--></div> <button type="button" class="mt-2 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add step</button></div>`);
            } else if (key === "cta") {
              $$renderer3.push("<!--[6-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", sp.ctaHeading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: sp.ctaOverlay ?? "medium",
                  onchange: (e) => sp.ctaOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_51 = ensure_array_like(overlayOptions);
                  for (let $$index_50 = 0, $$length2 = each_array_51.length; $$index_50 < $$length2; $$index_50++) {
                    let o = each_array_51[$$index_50];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Body Text</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_38 = escape_html(sp.ctaText ?? "");
              if ($$body_38) {
                $$renderer3.push(`${$$body_38}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_52 = ensure_array_like(sp.ctaBgImages);
              for (let i = 0, $$length2 = each_array_52.length; i < $$length2; i++) {
                let img = each_array_52[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/cta.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Pick</button></div></div> <div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Label</span> <input${attr_class(clsx(inp))}${attr("value", sp.ctaLabel ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Link</span> <input${attr_class(clsx(inp))}${attr("value", sp.ctaHref ?? "")} placeholder="/contact"/></label></div>`);
            } else if (key === "customSections") {
              $$renderer3.push("<!--[7-->");
              CustomSectionsEditor($$renderer3, {
                formAction: "?/customSections",
                pageKey: "setem",
                get sections() {
                  return setemCustom;
                },
                set sections($$value) {
                  setemCustom = $$value;
                  $$settled = false;
                }
              });
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        } else if (section === "csrPage") {
          $$renderer3.push("<!--[13-->");
          const cp = s;
          $$renderer3.push(`<div class="space-y-4"><!--[-->`);
          const each_array_53 = ensure_array_like(csrOrder);
          for (let $$index_59 = 0, $$length = each_array_53.length; $$index_59 < $$length; $$index_59++) {
            let key = each_array_53[$$index_59];
            const sMeta = CSR_SECTIONS.find((s2) => s2.key === key);
            $$renderer3.push(`<div${attr_class(`space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-opacity ${orderDragging === key ? "opacity-40" : ""} ${orderDragOver === key && orderDragging !== key ? "ring-2 ring-rose-400" : ""}`)}><div class="flex items-center gap-2 border-b border-zinc-100 pb-2"><span draggable="true" role="button" tabindex="0" class="shrink-0 cursor-grab text-zinc-300 hover:text-zinc-500 active:cursor-grabbing" title="Drag to reorder">`);
            Grip_vertical($$renderer3, { size: 14 });
            $$renderer3.push(`<!----></span> <p class="text-sm font-semibold text-zinc-800">${escape_html(sMeta?.label ?? key)}</p></div> `);
            if (key === "hero") {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Eyebrow</span> <input${attr_class(clsx(inp))}${attr("value", cp.eyebrow ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: cp.heroOverlay ?? "medium",
                  onchange: (e) => cp.heroOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_54 = ensure_array_like(overlayOptions);
                  for (let $$index_53 = 0, $$length2 = each_array_54.length; $$index_53 < $$length2; $$index_53++) {
                    let o = each_array_54[$$index_53];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", cp.heading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtext</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_39 = escape_html(cp.subtext ?? "");
              if ($$body_39) {
                $$renderer3.push(`${$$body_39}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_55 = ensure_array_like(cp.heroBgImages);
              for (let i = 0, $$length2 = each_array_55.length; i < $$length2; i++) {
                let img = each_array_55[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/hero.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Pick</button></div></div>`);
            } else if (key === "stories") {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<div class="space-y-3"><div class="flex items-center justify-between"><p class="text-sm font-semibold text-zinc-800">CSR Stories <span class="ml-1 text-zinc-400 font-normal">(${escape_html(cp.stories.length)})</span></p> <button type="button" class="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add story</button></div> <!--[-->`);
              const each_array_56 = ensure_array_like(cp.stories);
              for (let i = 0, $$length2 = each_array_56.length; i < $$length2; i++) {
                let story = each_array_56[i];
                $$renderer3.push(`<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden"><div class="flex items-center justify-between bg-zinc-50 border-b border-zinc-100 px-5 py-3"><div class="flex items-center gap-3">`);
                if (isImg(story.cover ?? "")) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", story.cover)} alt="" class="h-8 w-8 rounded-lg border border-zinc-200 object-cover"/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]--> <div><p class="font-medium text-zinc-900">${escape_html(story.title || "(untitled)")}</p> <p class="text-xs text-zinc-400">${escape_html(story.date || "No date")} · ${escape_html(story.category || "No category")}</p></div></div> <div class="flex items-center gap-2"><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50">`);
                Pencil($$renderer3, { size: 12 });
                $$renderer3.push(`<!----> ${escape_html(csrEditIdx === i ? "Close" : "Edit")}</button> <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 12 });
                $$renderer3.push(`<!----> Delete</button></div></div> `);
                if (csrEditIdx === i) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<div class="space-y-4 p-5"><div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Title</span> <input${attr_class(clsx(inp))}${attr("value", story.title)} placeholder="Story title"/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Category</span> <input${attr_class(clsx(inp))}${attr("value", story.category)} placeholder="e.g. Education, Community"/></label></div> <div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Date</span> <input${attr_class(clsx(inp))} type="date"${attr("value", story.date)}/></label> <div class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Cover Image</span> <div class="flex items-center gap-2">`);
                  if (isImg(story.cover ?? "")) {
                    $$renderer3.push("<!--[0-->");
                    $$renderer3.push(`<img${attr("src", story.cover)} alt=""${attr_class(clsx(thumbCls))}/>`);
                  } else {
                    $$renderer3.push("<!--[-1-->");
                    $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                  }
                  $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", story.cover ?? "")} placeholder="/uploads/story-cover.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                  Image_plus($$renderer3, { size: 13 });
                  $$renderer3.push(`<!----></button></div></div></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Excerpt</span> <textarea${attr_class(clsx(ta))} rows="3" placeholder="Short summary shown on the card…">`);
                  const $$body_40 = escape_html(story.excerpt);
                  if ($$body_40) {
                    $$renderer3.push(`${$$body_40}`);
                  }
                  $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Gallery Images <span class="font-normal text-zinc-400">(shown when the story is opened)</span></p> <div class="space-y-2"><!--[-->`);
                  const each_array_57 = ensure_array_like(story.images ?? []);
                  for (let gi = 0, $$length3 = each_array_57.length; gi < $$length3; gi++) {
                    let gImg = each_array_57[gi];
                    $$renderer3.push(`<div class="flex items-center gap-2">`);
                    if (isImg(gImg)) {
                      $$renderer3.push("<!--[0-->");
                      $$renderer3.push(`<img${attr("src", gImg)} alt=""${attr_class(clsx(thumbCls))}/>`);
                    } else {
                      $$renderer3.push("<!--[-1-->");
                      $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                    }
                    $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", gImg)} placeholder="/uploads/gallery.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                    Image_plus($$renderer3, { size: 13 });
                    $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                    Trash_2($$renderer3, { size: 14 });
                    $$renderer3.push(`<!----></button></div>`);
                  }
                  $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
                  Plus($$renderer3, { size: 14 });
                  $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
                  Image_plus($$renderer3, { size: 14 });
                  $$renderer3.push(`<!----> Pick</button></div></div></div>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]--></div>`);
              }
              $$renderer3.push(`<!--]--> `);
              if (cp.stories.length === 0) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<div class="rounded-2xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-400">No stories yet — add the first one above.</div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div>`);
            } else if (key === "cta") {
              $$renderer3.push("<!--[2-->");
              $$renderer3.push(`<div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Heading</span> <input${attr_class(clsx(inp))}${attr("value", cp.ctaHeading ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Overlay</span> `);
              $$renderer3.select(
                {
                  class: inp,
                  value: cp.ctaOverlay ?? "medium",
                  onchange: (e) => cp.ctaOverlay = e.currentTarget.value
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_58 = ensure_array_like(overlayOptions);
                  for (let $$index_57 = 0, $$length2 = each_array_58.length; $$index_57 < $$length2; $$index_57++) {
                    let o = each_array_58[$$index_57];
                    $$renderer4.option({ value: o }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(o)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
              $$renderer3.push(`</label></div> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Body Text</span> <textarea${attr_class(clsx(ta))} rows="2">`);
              const $$body_41 = escape_html(cp.ctaText ?? "");
              if ($$body_41) {
                $$renderer3.push(`${$$body_41}`);
              }
              $$renderer3.push(`</textarea></label> <div><p class="mb-2 text-sm font-medium text-zinc-700">Background Images</p> <div class="space-y-2"><!--[-->`);
              const each_array_59 = ensure_array_like(cp.ctaBgImages);
              for (let i = 0, $$length2 = each_array_59.length; i < $$length2; i++) {
                let img = each_array_59[i];
                $$renderer3.push(`<div class="flex items-center gap-2">`);
                if (isImg(img)) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", img)} alt=""${attr_class(clsx(thumbCls))}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div${attr_class(clsx(emptyThumbCls))}></div>`);
                }
                $$renderer3.push(`<!--]--> <input${attr_class(clsx(inp))}${attr("value", img)} placeholder="/uploads/cta.jpg"/> <button type="button"${attr_class(clsx(browseCls))}>`);
                Image_plus($$renderer3, { size: 13 });
                $$renderer3.push(`<!----></button> <button type="button" class="shrink-0 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50">`);
                Trash_2($$renderer3, { size: 14 });
                $$renderer3.push(`<!----></button></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="mt-2 flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700">`);
              Plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Add URL</button> <button type="button" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600">`);
              Image_plus($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> Pick</button></div></div> <div class="grid gap-4 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Label</span> <input${attr_class(clsx(inp))}${attr("value", cp.ctaLabel ?? "")}/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Button Link</span> <input${attr_class(clsx(inp))}${attr("value", cp.ctaHref ?? "")} placeholder="/contact"/></label></div>`);
            } else if (key === "customSections") {
              $$renderer3.push("<!--[3-->");
              CustomSectionsEditor($$renderer3, {
                formAction: "?/customSections",
                pageKey: "csr",
                get sections() {
                  return csrCustom;
                },
                set sections($$value) {
                  csrCustom = $$value;
                  $$settled = false;
                }
              });
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="rounded-2xl border border-zinc-200 bg-white p-6"><label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">JSON Content</span> <textarea rows="24" class="w-full resize-y rounded-xl border border-zinc-300 px-4 py-3 font-mono text-xs text-zinc-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100">`);
          const $$body_42 = escape_html(JSON.stringify(s, null, 2));
          if ($$body_42) {
            $$renderer3.push(`${$$body_42}`);
          }
          $$renderer3.push(`</textarea></label></div>`);
        }
        $$renderer3.push(`<!--]--> <div class="flex justify-end gap-3 pt-4"><a href="/hub/admin/site" class="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Cancel</a> <button type="submit" class="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Save changes</button></div></form></div>`);
      }
      $$renderer3.push(`<!--]--> `);
      MediaPicker($$renderer3, {
        onselect: onPickerSelect,
        onclose: () => pickerFn = null,
        get open() {
          return pickerOpen;
        },
        set open($$value) {
          pickerOpen = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
