import { ak as head, ab as ensure_array_like, a5 as escape_html, ag as attr_class, Q as derived } from '../../../../../chunks/index.js-6hyNTq_g.js';
import '../../../../../chunks/utils.js-DClsVo7x.js';
import '../../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const events = derived(() => data.events), applications = derived(() => data.applications);
    const items = derived(() => [
      ...events().map((e) => ({ date: e.tarikh, title: e.title, type: "event", id: e.id })),
      ...applications().map((a) => ({
        date: a.tarikh,
        title: a.namaProgram,
        type: "funding",
        id: a.id
      }))
    ].sort((a, b) => a.date.localeCompare(b.date)));
    head("u8k3v", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Calendar · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8"><header><h1 class="text-2xl font-bold tracking-tight text-zinc-900">QC Calendar</h1> <p class="mt-1.5 text-zinc-500">Approved programmes and events sorted by date.</p></header> <div class="rounded-2xl border border-zinc-200 bg-white divide-y divide-zinc-100">`);
    const each_array = ensure_array_like(items());
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<div class="flex items-center gap-4 px-5 py-4"><div class="shrink-0 text-center w-14"><p class="text-xs text-zinc-400 uppercase">${escape_html(item.date.slice(5, 7))}/${escape_html(item.date.slice(8, 10))}</p> <p class="font-bold text-lg text-zinc-800">${escape_html(item.date.slice(0, 4))}</p></div> <div class="min-w-0 flex-1"><p class="truncate font-medium text-zinc-900">${escape_html(item.title)}</p> <span${attr_class(`inline-block rounded-full px-2 py-0.5 text-xs ${item.type === "event" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`)}>${escape_html(item.type)}</span></div></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="py-12 text-center text-sm text-zinc-400">No scheduled items.</div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-ymBVGa3c.js.map
