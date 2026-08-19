import { s as sanitize_props, a as spread_props, c as slot, g as attr, e as escape_html, k as stringify, h as derived, i as head } from "../../../chunks/index.js";
import { S as SideNav } from "../../../chunks/SideNav.js";
import { r as roleLabel } from "../../../chunks/types.js";
import { B as Bell } from "../../../chunks/bell.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { L as Log_out } from "../../../chunks/log-out.js";
import { U as Users } from "../../../chunks/users.js";
import { B as Book_open } from "../../../chunks/book-open.js";
function Circle_user($$renderer, $$props) {
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
    ["circle", { "cx": "12", "cy": "10", "r": "3" }],
    [
      "path",
      { "d": "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-user" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleUser
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIiAvPgogIDxwYXRoIGQ9Ik03IDIwLjY2MlYxOWEyIDIgMCAwIDEgMi0yaDZhMiAyIDAgMCAxIDIgMnYxLjY2MiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/circle-user
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
function Layout_grid($$renderer, $$props) {
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
      "rect",
      { "width": "7", "height": "7", "x": "3", "y": "3", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "7", "x": "14", "y": "3", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "7", "x": "14", "y": "14", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "7", "x": "3", "y": "14", "rx": "1" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "layout-grid" },
    $$sanitized_props,
    {
      /**
       * @component @name LayoutGrid
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iNyIgeD0iMTQiIHk9IjE0IiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIxNCIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-grid
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
function Shield_check($$renderer, $$props) {
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
        "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
      }
    ],
    ["path", { "d": "m9 12 2 2 4-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "shield-check" },
    $$sanitized_props,
    {
      /**
       * @component @name ShieldCheck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTNjMCA1LTMuNSA3LjUtNy42NiA4Ljk1YTEgMSAwIDAgMS0uNjctLjAxQzcuNSAyMC41IDQgMTggNCAxM1Y2YTEgMSAwIDAgMSAxLTFjMiAwIDQuNS0xLjIgNi4yNC0yLjcyYTEuMTcgMS4xNyAwIDAgMSAxLjUyIDBDMTQuNTEgMy44MSAxNyA1IDE5IDVhMSAxIDAgMCAxIDEgMXoiIC8+CiAgPHBhdGggZD0ibTkgMTIgMiAyIDQtNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/shield-check
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
function PartitionTile($$renderer, $$props) {
  let { href, label, description, icon: Icon2, external = false } = $$props;
  $$renderer.push(`<a${attr("href", href)}${attr("target", external ? "_blank" : void 0)}${attr("rel", external ? "noopener noreferrer" : void 0)}${attr("data-sveltekit-reload", external ? true : void 0)} class="group flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md">`);
  if (Icon2) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600">`);
    if (Icon2) {
      $$renderer.push("<!--[-->");
      Icon2($$renderer, { size: 22 });
      $$renderer.push("<!--]-->");
    } else {
      $$renderer.push("<!--[!-->");
      $$renderer.push("<!--]-->");
    }
    $$renderer.push(`</div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--> <div class="flex-1"><p class="text-xl font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-rose-700">${escape_html(label)}</p> <p class="mt-1.5 text-sm leading-relaxed text-zinc-500">${escape_html(description)}</p></div> <span class="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 transition-colors group-hover:text-rose-700">Continue →</span></a>`);
}
function Hub($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { user } = $$props;
    const isStaff = derived(() => user?.role === "admin" || user?.role === "reviewer" || user?.role === "pic");
    SideNav($$renderer2, { active: "home" });
    $$renderer2.push(`<!----> <div class="ml-20 lg:ml-24"><main class="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16"><div class="absolute inset-x-0 top-0 flex items-center justify-end gap-4 p-6"><a href="/notifications" title="Announcements" class="text-zinc-400 transition-colors hover:text-rose-500">`);
    Bell($$renderer2, { size: 18, strokeWidth: 1.75 });
    $$renderer2.push(`<!----></a> `);
    if (user) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span${attr("title", `${stringify(roleLabel(user.role))} · ${stringify(user.name)}`)} class="cursor-default text-zinc-400 transition-colors hover:text-zinc-600">`);
      Circle_user($$renderer2, { size: 18, strokeWidth: 1.75 });
      $$renderer2.push(`<!----></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" action="/logout"><button type="submit" title="Log out" class="text-zinc-400 transition-colors hover:text-rose-600">`);
    Log_out($$renderer2, { size: 18, strokeWidth: 1.75 });
    $$renderer2.push(`<!----></button></form></div> <div class="text-center"><h1 class="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">Cakna <span class="text-rose-600">Hub</span></h1> <p class="mx-auto mt-4 max-w-xl text-zinc-500">`);
    if (user) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`Welcome back, ${escape_html(user.name.split(" ")[0])}. Choose a partition to continue.`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`Choose a partition to continue.`);
    }
    $$renderer2.push(`<!--]--></p></div> <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">`);
    PartitionTile($$renderer2, {
      href: "/core",
      label: "7 Core",
      description: "Assist, Biz, Circle, Digital, Edu, Future & Green.",
      icon: Layout_grid
    });
    $$renderer2.push(`<!----> `);
    PartitionTile($$renderer2, {
      href: "/society",
      label: "Society & Others",
      description: "Community programs and everything else.",
      icon: Users
    });
    $$renderer2.push(`<!----> `);
    PartitionTile($$renderer2, {
      href: "https://cakna.org/menu",
      label: "Mushaf Digital",
      description: "Quran, solat times, mathurat, zikir & more.",
      icon: Book_open,
      external: true
    });
    $$renderer2.push(`<!----></div> `);
    if (isStaff()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-10 text-center"><a href="/hub/admin/dashboard" class="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-rose-600">`);
      Shield_check($$renderer2, { size: 15, strokeWidth: 1.75 });
      $$renderer2.push(`<!----> Admin</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></main></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    head("vafmnc", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Cakna Hub</title>`);
      });
    });
    Hub($$renderer2, { user: data.user });
  });
}
export {
  _page as default
};
