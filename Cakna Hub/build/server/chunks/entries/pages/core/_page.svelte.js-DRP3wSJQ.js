import { ak as head, ab as ensure_array_like, ah as attr, ai as stringify, a5 as escape_html, Q as derived, a6 as sanitize_props, af as spread_props, ad as slot } from '../../../chunks/index.js-6hyNTq_g.js';
import { A as Arrow_left } from '../../../chunks/arrow-left.js-CvnazgZ6.js';
import { L as Leaf, R as Rocket, S as Smartphone, H as Heart_pulse, B as Briefcase, a as Heart_handshake } from '../../../chunks/smartphone.js-CC88m51e.js';
import { G as Graduation_cap } from '../../../chunks/graduation-cap.js-OFNqqEnP.js';
import { I as Icon } from '../../../chunks/Icon.js-VGojmkFT.js';
import '../../../chunks/utils.js-DClsVo7x.js';
import '../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';

function Chevron_right($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtOSAxOCA2LTYtNi02IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/chevron-right
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
  let { data } = $$props;
  const cores = derived(() => data.cores);
  const iconMap = {
    HeartHandshake: Heart_handshake,
    Briefcase,
    HeartPulse: Heart_pulse,
    Smartphone,
    GraduationCap: Graduation_cap,
    Rocket,
    Leaf
  };
  head("rqsk9o", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>7 Core · Cakna Hub</title>`);
    });
  });
  $$renderer.push(`<div class="min-h-screen bg-zinc-50"><header class="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white"><span class="text-base font-semibold text-zinc-900">Cakna <span class="text-rose-600">Hub</span></span> <a href="/hub" class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-600 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900">`);
  Arrow_left($$renderer, { size: 15, strokeWidth: 2 });
  $$renderer.push(`<!----> Back to hub</a></header> <main class="mx-auto max-w-5xl px-6 py-12"><div class="mb-10"><h1 class="text-2xl font-bold tracking-tight text-zinc-900">7 Core</h1> <p class="mt-1 text-sm text-zinc-500">The seven core initiatives of Cakna.</p></div> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
  const each_array = ensure_array_like(cores());
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let core = each_array[$$index_1];
    const Icon2 = iconMap[core.icon] ?? Briefcase;
    $$renderer.push(`<a${attr("href", `/core/${stringify(core.id)}`)} class="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-rose-200 hover:shadow-md"><div class="flex items-start justify-between gap-3"><div class="flex items-center gap-3"><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">`);
    if (Icon2) {
      $$renderer.push("<!--[-->");
      Icon2($$renderer, { size: 18, strokeWidth: 1.75 });
      $$renderer.push("<!--]-->");
    } else {
      $$renderer.push("<!--[!-->");
      $$renderer.push("<!--]-->");
    }
    $$renderer.push(`</div> <div><p class="font-semibold text-zinc-900">${escape_html(core.name)}</p> <p class="text-xs text-zinc-400 leading-snug">${escape_html(core.tagline)}</p></div></div> `);
    Chevron_right($$renderer, {
      size: 16,
      strokeWidth: 1.75,
      class: "mt-0.5 shrink-0 text-zinc-300 transition-colors group-hover:text-rose-400"
    });
    $$renderer.push(`<!----></div> <div class="my-4 border-t border-zinc-100"></div> <div class="flex items-start gap-2 text-xs"><span class="shrink-0 pt-0.5 text-zinc-400 font-medium w-14">Program</span> <div class="flex flex-wrap gap-1"><!--[-->`);
    const each_array_1 = ensure_array_like(core.programs);
    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
      let prog = each_array_1[$$index];
      $$renderer.push(`<span class="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">${escape_html(prog)}</span>`);
    }
    $$renderer.push(`<!--]--></div></div> <div class="mt-2.5 flex items-start gap-2 text-xs"><span class="shrink-0 pt-0.5 text-zinc-400 font-medium w-14">PIC</span> <span class="text-zinc-600">${escape_html(core.pic.join(", "))}</span></div></a>`);
  }
  $$renderer.push(`<!--]--></div></main></div>`);
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-DRP3wSJQ.js.map
