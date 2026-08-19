import { s as sanitize_props, a as spread_props, c as slot, i as head, e as escape_html, g as attr, d as ensure_array_like, f as attr_class, af as clsx, h as derived } from "../../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
function Send($$renderer, $$props) {
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
        "d": "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
      }
    ],
    ["path", { "d": "m21.854 2.147-10.94 10.939" }]
  ];
  Icon($$renderer, spread_props([
    { name: "send" },
    $$sanitized_props,
    {
      /**
       * @component @name Send
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQuNTM2IDIxLjY4NmEuNS41IDAgMCAwIC45MzctLjAyNGw2LjUtMTlhLjQ5Ni40OTYgMCAwIDAtLjYzNS0uNjM1bC0xOSA2LjVhLjUuNSAwIDAgMC0uMDI0LjkzN2w3LjkzIDMuMThhMiAyIDAgMCAxIDEuMTEyIDEuMTF6IiAvPgogIDxwYXRoIGQ9Im0yMS44NTQgMi4xNDctMTAuOTQgMTAuOTM5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/send
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
function Wand_sparkles($$renderer, $$props) {
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
        "d": "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"
      }
    ],
    ["path", { "d": "m14 7 3 3" }],
    ["path", { "d": "M5 6v4" }],
    ["path", { "d": "M19 14v4" }],
    ["path", { "d": "M10 2v2" }],
    ["path", { "d": "M7 8H3" }],
    ["path", { "d": "M21 16h-4" }],
    ["path", { "d": "M11 3H9" }]
  ];
  Icon($$renderer, spread_props([
    { name: "wand-sparkles" },
    $$sanitized_props,
    {
      /**
       * @component @name WandSparkles
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEuNjQgMy42NC0xLjI4LTEuMjhhMS4yMSAxLjIxIDAgMCAwLTEuNzIgMEwyLjM2IDE4LjY0YTEuMjEgMS4yMSAwIDAgMCAwIDEuNzJsMS4yOCAxLjI4YTEuMiAxLjIgMCAwIDAgMS43MiAwTDIxLjY0IDUuMzZhMS4yIDEuMiAwIDAgMCAwLTEuNzIiIC8+CiAgPHBhdGggZD0ibTE0IDcgMyAzIiAvPgogIDxwYXRoIGQ9Ik01IDZ2NCIgLz4KICA8cGF0aCBkPSJNMTkgMTR2NCIgLz4KICA8cGF0aCBkPSJNMTAgMnYyIiAvPgogIDxwYXRoIGQ9Ik03IDhIMyIgLz4KICA8cGF0aCBkPSJNMjEgMTZoLTQiIC8+CiAgPHBhdGggZD0iTTExIDNIOSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/wand-sparkles
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
    let { form } = $$props;
    const TYPES = [
      {
        key: "kemalangan",
        label: "Accident",
        desc: "Announcement of an MT accident or injury."
      },
      {
        key: "takziah",
        label: "Condolences",
        desc: "Condolence message for the passing of an MT family member."
      },
      {
        key: "kesihatan",
        label: "Health Announcement",
        desc: "Health warning / precautionary measures."
      },
      {
        key: "umum",
        label: "General Announcement",
        desc: "General announcement — free-form title & content."
      }
    ];
    const FIELDS = {
      kemalangan: [
        {
          name: "mtName",
          label: "MT Name",
          placeholder: "e.g. MT Syakirah Adilah",
          type: "text"
        },
        {
          name: "date",
          label: "Date of incident",
          placeholder: "dd/mm/yyyy",
          type: "date"
        },
        {
          name: "onWayTo",
          label: "On the way to",
          placeholder: "e.g. attend FAST in Jenjarom",
          type: "text"
        },
        {
          name: "injuryDetails",
          label: "Injury details",
          placeholder: "e.g. MT suffered a broken arm (requiring surgery) and lacerations that were stitched.",
          type: "textarea"
        },
        {
          name: "referredTo",
          label: "Referred to",
          placeholder: "e.g. Hospital Temerloh",
          type: "text"
        }
      ],
      takziah: [
        {
          name: "allahyarhamName",
          label: "Name of deceased",
          placeholder: "e.g. Allahyarham Hj. Ahmad",
          type: "text"
        },
        {
          name: "relation",
          label: "Relation to MT",
          placeholder: "e.g. father of MT Syakirah",
          type: "text"
        },
        {
          name: "mtName",
          label: "MT Name",
          placeholder: "e.g. MT Syakirah Adilah",
          type: "text"
        },
        {
          name: "date",
          label: "Date of passing",
          placeholder: "dd/mm/yyyy",
          type: "date"
        }
      ],
      kesihatan: [
        {
          name: "topic",
          label: "Health topic",
          placeholder: "e.g. Dengue outbreak in Rawang",
          type: "text"
        },
        {
          name: "keyMessage",
          label: "Key message",
          placeholder: "e.g. Take precautions, avoid stagnant water.",
          type: "textarea"
        },
        {
          name: "action",
          label: "Action required",
          placeholder: "e.g. Seek medical attention if symptoms appear.",
          type: "text"
        }
      ],
      umum: []
    };
    const AUDIENCE = [
      { value: "all", label: "All Franchisees, MTs & clients" },
      { value: "franchisee", label: "Franchisees only" },
      { value: "admin", label: "Admins & PICs only" }
    ];
    let selectedType = "kemalangan";
    let fieldValues = {};
    let title = "";
    let content = "";
    let callout = "";
    let audience = "all";
    const currentFields = derived(() => FIELDS[selectedType]);
    const hasFields = derived(() => currentFields().length > 0);
    const previewAudienceLabel = derived(() => AUDIENCE.find((a) => a.value === audience)?.label ?? audience);
    const previewParagraphs = derived(() => content.split("\n\n").filter(Boolean));
    const inputCls = "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400";
    head("1jwew66", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Send Announcement · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div><a href="/hub/admin/notifications" class="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
    Arrow_left($$renderer2, { size: 14 });
    $$renderer2.push(`<!----> Announcements</a> <h1 class="text-2xl font-bold tracking-tight text-zinc-900">Send Announcement</h1> <p class="mt-1.5 text-sm text-zinc-500">Choose a template, fill in the details, review the preview, and send to the HOME CAKNA family.</p></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="grid gap-8 lg:grid-cols-[1fr_380px]"><div><form method="POST" class="space-y-6"><input type="hidden" name="type"${attr("value", selectedType)}/> <section class="space-y-3"><h2 class="text-sm font-semibold text-zinc-700">Announcement type</h2> <div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
    const each_array = ensure_array_like(TYPES);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let t = each_array[$$index];
      $$renderer2.push(`<button type="button"${attr_class(`rounded-xl border p-4 text-left transition-all ${selectedType === t.key ? "border-rose-400 bg-rose-50 shadow-sm" : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"}`)}><p${attr_class(`text-sm font-semibold ${selectedType === t.key ? "text-rose-700" : "text-zinc-900"}`)}>${escape_html(t.label)}</p> <p class="mt-0.5 text-xs leading-relaxed text-zinc-500">${escape_html(t.desc)}</p></button>`);
    }
    $$renderer2.push(`<!--]--></div></section> `);
    if (hasFields()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!---->`);
      {
        $$renderer2.push(`<section class="space-y-3"><h2 class="text-sm font-semibold text-zinc-700">Details</h2> <div class="space-y-3 rounded-xl border border-zinc-200 bg-white p-4"><!--[-->`);
        const each_array_1 = ensure_array_like(currentFields());
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let field = each_array_1[$$index_1];
          $$renderer2.push(`<label class="block space-y-1"><span class="text-xs font-medium text-zinc-600">${escape_html(field.label)} <span class="text-rose-400">*</span></span> `);
          if (field.type === "textarea") {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<textarea rows="3"${attr("placeholder", field.placeholder)} class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 resize-none">`);
            const $$body = escape_html(fieldValues[field.name] ?? "");
            if ($$body) {
              $$renderer2.push(`${$$body}`);
            }
            $$renderer2.push(`</textarea>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<input${attr("type", field.type)}${attr("placeholder", field.placeholder)}${attr("value", fieldValues[field.name] ?? "")}${attr_class(clsx(inputCls))}/>`);
          }
          $$renderer2.push(`<!--]--></label>`);
        }
        $$renderer2.push(`<!--]--> <button type="button" class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200">`);
        Wand_sparkles($$renderer2, { size: 13 });
        $$renderer2.push(`<!----> Generate content</button></div></section>`);
      }
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <label class="block space-y-1.5"><span class="text-sm font-medium text-zinc-700">Title (internal reference)</span> <input name="title"${attr("value", title)} required="" placeholder="e.g. Accident — MT Syakirah"${attr_class(clsx(inputCls))}/></label> <div class="space-y-1.5"><label for="content-field" class="text-sm font-medium text-zinc-700">Content</label> <textarea id="content-field" name="content" rows="7" required="" class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 resize-none">`);
    const $$body_1 = escape_html(content);
    if ($$body_1) {
      $$renderer2.push(`${$$body_1}`);
    }
    $$renderer2.push(`</textarea> <p class="text-xs text-zinc-400">Separate paragraphs with a blank line. Start a line with > for a quote.</p></div> <div class="space-y-1.5"><label for="callout-field" class="text-sm font-medium text-zinc-700">Note "Together With CAKNA"</label> <textarea id="callout-field" name="callout" rows="4" class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 resize-none">`);
    const $$body_2 = escape_html(callout);
    if ($$body_2) {
      $$renderer2.push(`${$$body_2}`);
    }
    $$renderer2.push(`</textarea></div> <label class="block space-y-1.5"><span class="text-sm font-medium text-zinc-700">Audience</span> `);
    $$renderer2.select(
      {
        name: "audience",
        value: audience,
        class: "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-white"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(AUDIENCE);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let a = each_array_2[$$index_2];
          $$renderer3.option({ value: a.value }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(a.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</label> <div class="flex items-center gap-3 pt-1"><button type="submit" class="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-800">`);
    Send($$renderer2, { size: 15 });
    $$renderer2.push(`<!----> Send announcement</button> <a href="/hub/admin/notifications" class="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">Cancel</a></div></form></div> <div class="lg:sticky lg:top-6 h-fit"><p class="mb-3 text-xs font-medium text-zinc-500">Preview · sent to <span class="font-semibold text-zinc-700">${escape_html(previewAudienceLabel())}</span></p> <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"><div class="flex flex-col items-center px-6 py-7 text-center" style="background: linear-gradient(135deg, #881337 0%, #9f1239 60%, #be123c 100%);"><div class="mb-3 flex h-11 w-11 items-center justify-center rounded-full" style="background: rgba(255,255,255,0.2);"><svg viewBox="0 0 24 24" fill="white" class="h-5 w-5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg></div> <p class="text-[10px] font-bold uppercase tracking-widest text-white">CAKNA UNTUK KELUARGA HOME</p> <p class="mt-0.5 text-[10px] italic text-white/75">Satu Sentuhan, Sejuta Makna</p></div> <div class="space-y-3 px-5 py-5">`);
    if (previewParagraphs().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm italic text-zinc-300">Content will appear here…</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array_3 = ensure_array_like(previewParagraphs());
      for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
        let para = each_array_3[i];
        $$renderer2.push(`<p class="text-sm leading-relaxed text-zinc-700">${escape_html(para)}</p>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <p class="pt-1 text-center text-xs text-zinc-400">Daripada, HQ CAKNA</p></div></div></div></div></div>`);
  });
}
export {
  _page as default
};
