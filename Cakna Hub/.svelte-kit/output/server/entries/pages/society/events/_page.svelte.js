import { i as head, d as ensure_array_like, g as attr, k as stringify, e as escape_html, h as derived } from "../../../../chunks/index.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { P as Plus } from "../../../../chunks/plus.js";
function _page($$renderer, $$props) {
  let { data } = $$props;
  const events = derived(() => data.events);
  head("k8kxlz", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Events · Cakna Hub</title>`);
    });
  });
  $$renderer.push(`<main class="mx-auto max-w-4xl px-6 py-12"><a href="/" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
  Arrow_left($$renderer, { size: 16 });
  $$renderer.push(`<!----> Home</a> <div class="mt-6 flex flex-wrap items-start justify-between gap-4"><div><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Events</h1> <p class="mt-1.5 text-zinc-500">Programme events submitted by franchisees.</p></div> <a href="/society/events/new" class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">`);
  Plus($$renderer, { size: 16 });
  $$renderer.push(`<!----> New Event</a></div> `);
  if (events().length === 0) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="mt-16 text-center text-zinc-400"><p class="text-lg font-medium">No events yet.</p></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
    $$renderer.push(`<ul class="mt-8 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white"><!--[-->`);
    const each_array = ensure_array_like(events());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let e = each_array[$$index];
      $$renderer.push(`<li><a${attr("href", `/society/events/${stringify(e.id)}`)} class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-zinc-50"><div class="min-w-0"><p class="truncate text-sm font-semibold text-zinc-900">${escape_html(e.title)}</p> <p class="mt-0.5 text-xs text-zinc-400">${escape_html(e.tarikh)} · ${escape_html(e.lokasi)}</p></div> <span class="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">${escape_html(e.kluster)}</span></a></li>`);
    }
    $$renderer.push(`<!--]--></ul>`);
  }
  $$renderer.push(`<!--]--></main>`);
}
export {
  _page as default
};
