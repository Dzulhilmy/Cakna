import { s as sanitize_props, a as spread_props, c as slot, i as head, e as escape_html, g as attr, d as ensure_array_like, f as attr_class, h as derived } from "../../../chunks/index.js";
import { d as city, S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
import { M as Map_pin } from "../../../chunks/map-pin.js";
import { N as Navigation } from "../../../chunks/navigation.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { M as Moon } from "../../../chunks/moon.js";
function Cloud_sun($$renderer, $$props) {
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
    ["path", { "d": "M12 2v2" }],
    ["path", { "d": "m4.93 4.93 1.41 1.41" }],
    ["path", { "d": "M20 12h2" }],
    ["path", { "d": "m19.07 4.93-1.41 1.41" }],
    ["path", { "d": "M15.947 12.65a4 4 0 0 0-5.925-4.128" }],
    [
      "path",
      { "d": "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "cloud-sun" },
    $$sanitized_props,
    {
      /**
       * @component @name CloudSun
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMnYyIiAvPgogIDxwYXRoIGQ9Im00LjkzIDQuOTMgMS40MSAxLjQxIiAvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIiAvPgogIDxwYXRoIGQ9Im0xOS4wNyA0LjkzLTEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJNMTUuOTQ3IDEyLjY1YTQgNCAwIDAgMC01LjkyNS00LjEyOCIgLz4KICA8cGF0aCBkPSJNMTMgMjJIN2E1IDUgMCAxIDEgNC45LTZIMTNhMyAzIDAgMCAxIDAgNloiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/cloud-sun
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
function Landmark($$renderer, $$props) {
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
    ["path", { "d": "M10 18v-7" }],
    [
      "path",
      {
        "d": "M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"
      }
    ],
    ["path", { "d": "M14 18v-7" }],
    ["path", { "d": "M18 18v-7" }],
    ["path", { "d": "M3 22h18" }],
    ["path", { "d": "M6 18v-7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "landmark" },
    $$sanitized_props,
    {
      /**
       * @component @name Landmark
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTh2LTciIC8+CiAgPHBhdGggZD0iTTExLjEyIDIuMTk4YTIgMiAwIDAgMSAxLjc2LjAwNmw3Ljg2NiAzLjg0N2MuNDc2LjIzMy4zMS45NDktLjIyLjk0OUgzLjQ3NGMtLjUzIDAtLjY5NS0uNzE2LS4yMi0uOTQ5eiIgLz4KICA8cGF0aCBkPSJNMTQgMTh2LTciIC8+CiAgPHBhdGggZD0iTTE4IDE4di03IiAvPgogIDxwYXRoIGQ9Ik0zIDIyaDE4IiAvPgogIDxwYXRoIGQ9Ik02IDE4di03IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/landmark
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
function Moon_star($$renderer, $$props) {
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
    ["path", { "d": "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" }],
    ["path", { "d": "M20 3v4" }],
    ["path", { "d": "M22 5h-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "moon-star" },
    $$sanitized_props,
    {
      /**
       * @component @name MoonStar
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM2E2IDYgMCAwIDAgOSA5IDkgOSAwIDEgMS05LTkiIC8+CiAgPHBhdGggZD0iTTIwIDN2NCIgLz4KICA8cGF0aCBkPSJNMjIgNWgtNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/moon-star
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
function Star($$renderer, $$props) {
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
        "d": "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "star" },
    $$sanitized_props,
    {
      /**
       * @component @name Star
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEuNTI1IDIuMjk1YS41My41MyAwIDAgMSAuOTUgMGwyLjMxIDQuNjc5YTIuMTIzIDIuMTIzIDAgMCAwIDEuNTk1IDEuMTZsNS4xNjYuNzU2YS41My41MyAwIDAgMSAuMjk0LjkwNGwtMy43MzYgMy42MzhhMi4xMjMgMi4xMjMgMCAwIDAtLjYxMSAxLjg3OGwuODgyIDUuMTRhLjUzLjUzIDAgMCAxLS43NzEuNTZsLTQuNjE4LTIuNDI4YTIuMTIyIDIuMTIyIDAgMCAwLTEuOTczIDBMNi4zOTYgMjEuMDFhLjUzLjUzIDAgMCAxLS43Ny0uNTZsLjg4MS01LjEzOWEyLjEyMiAyLjEyMiAwIDAgMC0uNjExLTEuODc5TDIuMTYgOS43OTVhLjUzLjUzIDAgMCAxIC4yOTQtLjkwNmw1LjE2NS0uNzU1YTIuMTIyIDIuMTIyIDAgMCAwIDEuNTk3LTEuMTZ6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/star
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
function Sun_dim($$renderer, $$props) {
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
    ["circle", { "cx": "12", "cy": "12", "r": "4" }],
    ["path", { "d": "M12 4h.01" }],
    ["path", { "d": "M20 12h.01" }],
    ["path", { "d": "M12 20h.01" }],
    ["path", { "d": "M4 12h.01" }],
    ["path", { "d": "M17.657 6.343h.01" }],
    ["path", { "d": "M17.657 17.657h.01" }],
    ["path", { "d": "M6.343 17.657h.01" }],
    ["path", { "d": "M6.343 6.343h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "sun-dim" },
    $$sanitized_props,
    {
      /**
       * @component @name SunDim
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMiA0aC4wMSIgLz4KICA8cGF0aCBkPSJNMjAgMTJoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xMiAyMGguMDEiIC8+CiAgPHBhdGggZD0iTTQgMTJoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xNy42NTcgNi4zNDNoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xNy42NTcgMTcuNjU3aC4wMSIgLz4KICA8cGF0aCBkPSJNNi4zNDMgMTcuNjU3aC4wMSIgLz4KICA8cGF0aCBkPSJNNi4zNDMgNi4zNDNoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/sun-dim
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
function Sun_moon($$renderer, $$props) {
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
    ["path", { "d": "M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" }],
    ["path", { "d": "M12 2v2" }],
    ["path", { "d": "M12 20v2" }],
    ["path", { "d": "m4.9 4.9 1.4 1.4" }],
    ["path", { "d": "m17.7 17.7 1.4 1.4" }],
    ["path", { "d": "M2 12h2" }],
    ["path", { "d": "M20 12h2" }],
    ["path", { "d": "m6.3 17.7-1.4 1.4" }],
    ["path", { "d": "m19.1 4.9-1.4 1.4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "sun-moon" },
    $$sanitized_props,
    {
      /**
       * @component @name SunMoon
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgOGEyLjgzIDIuODMgMCAwIDAgNCA0IDQgNCAwIDEgMS00LTQiIC8+CiAgPHBhdGggZD0iTTEyIDJ2MiIgLz4KICA8cGF0aCBkPSJNMTIgMjB2MiIgLz4KICA8cGF0aCBkPSJtNC45IDQuOSAxLjQgMS40IiAvPgogIDxwYXRoIGQ9Im0xNy43IDE3LjcgMS40IDEuNCIgLz4KICA8cGF0aCBkPSJNMiAxMmgyIiAvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIiAvPgogIDxwYXRoIGQ9Im02LjMgMTcuNy0xLjQgMS40IiAvPgogIDxwYXRoIGQ9Im0xOS4xIDQuOS0xLjQgMS40IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/sun-moon
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
function Sun($$renderer, $$props) {
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
    ["circle", { "cx": "12", "cy": "12", "r": "4" }],
    ["path", { "d": "M12 2v2" }],
    ["path", { "d": "M12 20v2" }],
    ["path", { "d": "m4.93 4.93 1.41 1.41" }],
    ["path", { "d": "m17.66 17.66 1.41 1.41" }],
    ["path", { "d": "M2 12h2" }],
    ["path", { "d": "M20 12h2" }],
    ["path", { "d": "m6.34 17.66-1.41 1.41" }],
    ["path", { "d": "m19.07 4.93-1.41 1.41" }]
  ];
  Icon($$renderer, spread_props([
    { name: "sun" },
    $$sanitized_props,
    {
      /**
       * @component @name Sun
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMiAydjIiIC8+CiAgPHBhdGggZD0iTTEyIDIwdjIiIC8+CiAgPHBhdGggZD0ibTQuOTMgNC45MyAxLjQxIDEuNDEiIC8+CiAgPHBhdGggZD0ibTE3LjY2IDE3LjY2IDEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJNMiAxMmgyIiAvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIiAvPgogIDxwYXRoIGQ9Im02LjM0IDE3LjY2LTEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJtMTkuMDcgNC45My0xLjQxIDEuNDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/sun
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
const RAD = Math.PI / 180;
const MAIN_PRAYERS = ["Subuh", "Zohor", "Asar", "Maghrib", "Isyak"];
const ALL_PRAYERS = ["Imsak", "Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"];
function solarParams(date) {
  const J = Math.floor(date.getTime() / 864e5) + 2440588 - 0.5;
  const D = J - 2451545;
  const g = ((357.529 + 0.98560028 * D) % 360 + 360) % 360;
  const q = ((280.459 + 0.98564736 * D) % 360 + 360) % 360;
  const L = ((q + 1.915 * Math.sin(g * RAD) + 0.02 * Math.sin(2 * g * RAD)) % 360 + 360) % 360;
  const e = 23.439 - 36e-8 * D;
  let RA = Math.atan2(Math.cos(e * RAD) * Math.sin(L * RAD), Math.cos(L * RAD)) / RAD / 15;
  RA = (RA + 24) % 24;
  const decl = Math.asin(Math.sin(e * RAD) * Math.sin(L * RAD)) / RAD;
  let eqt = q / 15 - RA;
  if (eqt > 12) eqt -= 24;
  if (eqt < -12) eqt += 24;
  return { decl, eqt };
}
function hourAngle(angle, decl, lat) {
  const c = (-Math.sin(angle * RAD) - Math.sin(decl * RAD) * Math.sin(lat * RAD)) / (Math.cos(decl * RAD) * Math.cos(lat * RAD));
  if (c > 1 || c < -1) return NaN;
  return Math.acos(c) / RAD / 15;
}
function tzOffset(tz, date) {
  try {
    const a = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    const b = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    return (a.getTime() - b.getTime()) / 36e5;
  } catch {
    return -date.getTimezoneOffset() / 60;
  }
}
function nowInTz(tz) {
  try {
    const p = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false
    }).formatToParts(/* @__PURE__ */ new Date());
    const g = (k) => +(p.find((x) => x.type === k)?.value ?? 0);
    return g("hour") % 24 + g("minute") / 60 + g("second") / 3600;
  } catch {
    const n = /* @__PURE__ */ new Date();
    return n.getHours() + n.getMinutes() / 60 + n.getSeconds() / 3600;
  }
}
function prayerTimes(lat, lng, date, tz) {
  const { decl, eqt } = solarParams(date);
  if (tz === void 0) tz = 8;
  const noon = 12 - lng / 15 - eqt + tz;
  const asrAlt = Math.atan(1 / (1 + Math.tan(Math.abs(lat - decl) * RAD))) / RAD;
  const subuh = noon - hourAngle(20, decl, lat);
  return {
    Imsak: subuh - 10 / 60,
    Subuh: subuh,
    Syuruk: noon - hourAngle(0.833, decl, lat),
    Zohor: noon + 2 / 60,
    Asar: noon + hourAngle(-asrAlt, decl, lat),
    Maghrib: noon + hourAngle(0.833, decl, lat),
    Isyak: noon + hourAngle(18, decl, lat)
  };
}
function fmtT(h) {
  if (!isFinite(h)) return "—";
  h = (h % 24 + 24) % 24;
  let H = Math.floor(h);
  let M = Math.round((h - H) * 60);
  if (M === 60) {
    H++;
    M = 0;
  }
  return `${String(H % 24).padStart(2, "0")}:${String(M).padStart(2, "0")}`;
}
function nextPrayer(lat, lng, tz) {
  const now = /* @__PURE__ */ new Date();
  const off = tzOffset(tz, now);
  const times = prayerTimes(lat, lng, now, off);
  const nowH = nowInTz(tz);
  for (const k of MAIN_PRAYERS) {
    if (isFinite(times[k]) && times[k] > nowH) {
      return { name: k, diff: times[k] - nowH, times };
    }
  }
  const tomorrow = new Date(now.getTime() + 864e5);
  const esok = prayerTimes(lat, lng, tomorrow, tzOffset(tz, tomorrow));
  const diff = isFinite(esok.Subuh) ? 24 - nowH + esok.Subuh : NaN;
  return { name: "Subuh", diff, times };
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const CITIES = [
      {
        name: "Kuala Lumpur",
        lat: 3.139,
        lng: 101.6869,
        tz: "Asia/Kuala_Lumpur",
        zone: "WLY01"
      },
      {
        name: "Putrajaya",
        lat: 2.9264,
        lng: 101.6964,
        tz: "Asia/Kuala_Lumpur",
        zone: "WLY02"
      },
      {
        name: "Shah Alam",
        lat: 3.0738,
        lng: 101.5183,
        tz: "Asia/Kuala_Lumpur",
        zone: "SGR01"
      },
      {
        name: "Ipoh",
        lat: 4.5975,
        lng: 101.0901,
        tz: "Asia/Kuala_Lumpur",
        zone: "PRK01"
      },
      {
        name: "Kuala Kangsar",
        lat: 4.7681,
        lng: 100.9389,
        tz: "Asia/Kuala_Lumpur",
        zone: "PRK02"
      },
      {
        name: "George Town",
        lat: 5.4141,
        lng: 100.3288,
        tz: "Asia/Kuala_Lumpur",
        zone: "PNG01"
      },
      {
        name: "Alor Setar",
        lat: 6.1248,
        lng: 100.3673,
        tz: "Asia/Kuala_Lumpur",
        zone: "KDH01"
      },
      {
        name: "Kangar",
        lat: 6.4414,
        lng: 100.1986,
        tz: "Asia/Kuala_Lumpur",
        zone: "PLS01"
      },
      {
        name: "Kota Bharu",
        lat: 6.1254,
        lng: 102.2386,
        tz: "Asia/Kuala_Lumpur",
        zone: "KTN01"
      },
      {
        name: "Kuala Terengganu",
        lat: 5.3302,
        lng: 103.1408,
        tz: "Asia/Kuala_Lumpur",
        zone: "TRG01"
      },
      {
        name: "Kuantan",
        lat: 3.8077,
        lng: 103.326,
        tz: "Asia/Kuala_Lumpur",
        zone: "PHG01"
      },
      {
        name: "Seremban",
        lat: 2.7297,
        lng: 101.9381,
        tz: "Asia/Kuala_Lumpur",
        zone: "NGS01"
      },
      {
        name: "Melaka",
        lat: 2.1896,
        lng: 102.2501,
        tz: "Asia/Kuala_Lumpur",
        zone: "MLK01"
      },
      {
        name: "Johor Bahru",
        lat: 1.4927,
        lng: 103.7414,
        tz: "Asia/Kuala_Lumpur",
        zone: "JHR01"
      },
      {
        name: "Kuching",
        lat: 1.5533,
        lng: 110.3592,
        tz: "Asia/Kuching",
        zone: "SWK01"
      },
      {
        name: "Sibu",
        lat: 2.3063,
        lng: 111.8179,
        tz: "Asia/Kuching",
        zone: "SWK02"
      },
      {
        name: "Miri",
        lat: 4.3995,
        lng: 113.9914,
        tz: "Asia/Kuching",
        zone: "SWK04"
      },
      {
        name: "Kota Kinabalu",
        lat: 5.9804,
        lng: 116.0735,
        tz: "Asia/Kuching",
        zone: "SBH01"
      },
      {
        name: "Sandakan",
        lat: 5.8402,
        lng: 118.1179,
        tz: "Asia/Kuching",
        zone: "SBH02"
      },
      {
        name: "Tawau",
        lat: 4.2456,
        lng: 117.8912,
        tz: "Asia/Kuching",
        zone: "SBH03"
      },
      {
        name: "Labuan",
        lat: 5.2831,
        lng: 115.2308,
        tz: "Asia/Kuching",
        zone: "LBN01"
      }
    ];
    const PRAYER_ICONS = {
      Imsak: Moon_star,
      Subuh: Moon,
      Syuruk: Sun_dim,
      Zohor: Sun,
      Asar: Cloud_sun,
      Maghrib: Sun_moon,
      Isyak: Star
    };
    const cityIdx = derived(() => typeof city.value === "number" ? city.value : 0);
    const loc = derived(() => typeof city.value === "object" && "g" in city.value ? {
      name: "GPS",
      lat: city.value.g[0],
      lng: city.value.g[1],
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone
    } : CITIES[cityIdx()] ?? CITIES[0]);
    const todayTimes = derived(() => {
      return prayerTimes(loc().lat, loc().lng, /* @__PURE__ */ new Date(), tzOffset(loc().tz, /* @__PURE__ */ new Date()));
    });
    const nextPr = derived(() => {
      return nextPrayer(loc().lat, loc().lng, loc().tz);
    });
    let gpsLoading = false;
    function fmtDiff(diff) {
      const total = Math.round(diff * 60);
      if (total <= 0) return "Sekarang";
      const h = Math.floor(total / 60);
      const m = total % 60;
      if (h > 0) return `${h}j ${m}m lagi`;
      return `${m} minit lagi`;
    }
    head("po3yso", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Waktu Solat — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="solat-root svelte-po3yso"><header class="solat-header svelte-po3yso"><a href="https://cakna.org/hub" class="hdr-btn svelte-po3yso">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-po3yso"><span class="hdr-title svelte-po3yso">Waktu Solat</span> <span class="hdr-loc svelte-po3yso">`);
    Map_pin($$renderer2, { size: 10 });
    $$renderer2.push(`<!----> ${escape_html(loc().name)}</span></div> <button class="hdr-btn svelte-po3yso" aria-label="GPS"${attr("disabled", gpsLoading, true)}>`);
    Navigation($$renderer2, { size: 18 });
    $$renderer2.push(`<!----></button></header> <main class="solat-main svelte-po3yso">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (nextPr()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="next-card svelte-po3yso"><div class="next-icon svelte-po3yso">`);
      if (PRAYER_ICONS[nextPr().name] ?? Landmark) {
        $$renderer2.push("<!--[-->");
        (PRAYER_ICONS[nextPr().name] ?? Landmark)($$renderer2, { size: 40 });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
      $$renderer2.push(`</div> <div class="next-info svelte-po3yso"><span class="next-label svelte-po3yso">Solat Seterusnya</span> <span class="next-name svelte-po3yso">${escape_html(nextPr().name)}</span> <span class="next-time svelte-po3yso">${escape_html(fmtT(todayTimes()[nextPr().name]))}</span> <span class="next-diff svelte-po3yso">${escape_html(fmtDiff(nextPr().diff))}</span></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <section class="prayers-section svelte-po3yso"><h2 class="section-label svelte-po3yso">Jadual Hari Ini</h2> <div class="prayers-list svelte-po3yso"><!--[-->`);
    const each_array = ensure_array_like(ALL_PRAYERS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let p = each_array[$$index];
      const t = todayTimes()[p];
      const isNext = nextPr()?.name === p;
      if (isFinite(t)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div${attr_class("prayer-row svelte-po3yso", void 0, { "prayer-next": isNext })}><span class="p-icon svelte-po3yso">`);
        if (PRAYER_ICONS[p] ?? Landmark) {
          $$renderer2.push("<!--[-->");
          (PRAYER_ICONS[p] ?? Landmark)($$renderer2, { size: 18 });
          $$renderer2.push("<!--]-->");
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push("<!--]-->");
        }
        $$renderer2.push(`</span> <span class="p-name svelte-po3yso">${escape_html(p)}</span> <span class="p-time svelte-po3yso">${escape_html(fmtT(t))}</span> `);
        if (isNext) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="p-badge svelte-po3yso">Seterusnya</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="city-section svelte-po3yso"><h2 class="section-label svelte-po3yso">Pilih Bandar</h2> <div class="city-grid svelte-po3yso"><!--[-->`);
    const each_array_1 = ensure_array_like(CITIES);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let c = each_array_1[i];
      $$renderer2.push(`<button${attr_class("city-btn svelte-po3yso", void 0, {
        "city-active": typeof city.value === "number" && city.value === i
      })}>${escape_html(c.name)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></section> <p class="source-note svelte-po3yso">Pengiraan astronomi — parameter JAKIM (Subuh 20°, Isyak 18°)</p></main></div> `);
    SideNav($$renderer2, { active: "solat" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
