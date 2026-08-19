import { ak as head, a5 as escape_html, ah as attr, ab as ensure_array_like, Q as derived, a6 as sanitize_props, af as spread_props, ad as slot } from '../../../../../chunks/index.js-6hyNTq_g.js';
import '@sveltejs/kit/internal';
import '../../../../../chunks/exports.js-8HOoaa4e.js';
import '../../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit/internal/server';
import '../../../../../chunks/root.js-D9zcjZWK.js';
import '../../../../../chunks/state.svelte.js-KfFw5RnB.js';
import { I as Icon } from '../../../../../chunks/Icon.js-VGojmkFT.js';
import { C as Check } from '../../../../../chunks/check.js-CCXqwNNi.js';
import { T as Trash_2 } from '../../../../../chunks/trash-2.js-7NoUOT_P.js';
import '../../../../../chunks/utils.js-DClsVo7x.js';
import '@sveltejs/kit';

function Copy($$renderer, $$props) {
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
      {
        "width": "14",
        "height": "14",
        "x": "8",
        "y": "8",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "path",
      {
        "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "copy" },
    $$sanitized_props,
    {
      /**
       * @component @name Copy
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHg9IjgiIHk9IjgiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/copy
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
function Upload($$renderer, $$props) {
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
    ["path", { "d": "M12 3v12" }],
    ["path", { "d": "m17 8-5-5-5 5" }],
    ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "upload" },
    $$sanitized_props,
    {
      /**
       * @component @name Upload
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM3YxMiIgLz4KICA8cGF0aCBkPSJtMTcgOC01LTUtNSA1IiAvPgogIDxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/upload
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
    let { data, form } = $$props;
    const files = derived(() => data.files);
    let uploading = false;
    let copied = "";
    function displayName(path) {
      return path.replace(/^\/uploads\//, "");
    }
    function isImage(path) {
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(path);
    }
    head("uofykz", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Media · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8"><header><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Media Library</h1> <p class="mt-1.5 text-zinc-500">${escape_html(files().length)} file${escape_html(files().length !== 1 ? "s" : "")} in /public/uploads/.</p></header> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" action="?/upload" enctype="multipart/form-data" class="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-6 transition-colors hover:border-rose-200"><div class="flex flex-wrap items-center gap-4"><label class="flex cursor-pointer items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700">`);
    Upload($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> ${escape_html("Upload file")} <input type="file" name="file" class="sr-only" accept="image/*,.pdf,.doc,.docx"${attr("disabled", uploading, true)}/></label> <p class="text-sm text-zinc-400">Images, PDFs, documents — max 10 MB</p></div></form> `);
    if (files().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-2xl border border-zinc-200 bg-white py-16 text-center text-sm text-zinc-400">No files uploaded yet.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"><!--[-->`);
      const each_array = ensure_array_like(files());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let path = each_array[$$index];
        $$renderer2.push(`<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">`);
        if (isImage(path)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", path)}${attr("alt", displayName(path))} class="aspect-square w-full object-cover"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="aspect-square flex items-center justify-center bg-zinc-50 text-4xl">📄</div>`);
        }
        $$renderer2.push(`<!--]--> <div class="p-3 flex items-center justify-between gap-2 border-t border-zinc-100"><p class="truncate text-xs text-zinc-600"${attr("title", path)}>${escape_html(displayName(path))}</p> <div class="flex shrink-0 items-center gap-1"><button type="button" title="Copy URL" class="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700">`);
        if (copied === path) {
          $$renderer2.push("<!--[0-->");
          Check($$renderer2, { size: 13, class: "text-emerald-500" });
        } else {
          $$renderer2.push("<!--[-1-->");
          Copy($$renderer2, { size: 13 });
        }
        $$renderer2.push(`<!--]--></button> <form method="POST" action="?/delete" class="inline-flex"><input type="hidden" name="name"${attr("value", displayName(path))}/> <button type="submit" class="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-600">`);
        Trash_2($$renderer2, { size: 13 });
        $$renderer2.push(`<!----></button></form></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js--9ILBJlM.js.map
