import { i as head, e as escape_html, d as ensure_array_like, j as attr_style, k as stringify, h as derived } from "../../../../../chunks/index.js";
import { f as formatRM } from "../../../../../chunks/format.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const byCluster = derived(() => data.byCluster), byState = derived(() => data.byState), total = derived(() => data.total);
    const maxCluster = derived(() => byCluster().reduce((m, c) => Math.max(m, c.total), 0));
    const maxState = derived(() => byState().reduce((m, s) => Math.max(m, s.total), 0));
    head("xuvprn", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Analytics · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8"><header><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Analytics</h1> <p class="mt-1.5 text-zinc-500">${escape_html(total())} funding applications in total.</p></header> <section class="rounded-2xl border border-zinc-200 bg-white p-6"><h2 class="text-base font-semibold text-zinc-800 mb-5">By Core Cluster</h2> <div class="space-y-3">`);
    const each_array = ensure_array_like(byCluster());
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let row = each_array[$$index];
        $$renderer2.push(`<div class="flex items-center gap-3"><span class="w-28 truncate text-sm text-zinc-600">${escape_html(row.label)}</span> <div class="flex-1 rounded-full bg-zinc-100 h-3 overflow-hidden"><div class="h-full rounded-full bg-rose-400"${attr_style(`width:${stringify(maxCluster() ? Math.round(row.total / maxCluster() * 100) : 0)}%`)}></div></div> <span class="w-24 text-right text-sm tabular-nums text-zinc-700">${escape_html(formatRM(row.total))}</span> <span class="w-12 text-right text-xs text-zinc-400">${escape_html(row.count)}</span></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<p class="text-sm text-zinc-400">No data.</p>`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="rounded-2xl border border-zinc-200 bg-white p-6"><h2 class="text-base font-semibold text-zinc-800 mb-5">By State</h2> <div class="space-y-3">`);
    const each_array_1 = ensure_array_like(byState());
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let row = each_array_1[$$index_1];
        $$renderer2.push(`<div class="flex items-center gap-3"><span class="w-36 truncate text-sm text-zinc-600">${escape_html(row.state)}</span> <div class="flex-1 rounded-full bg-zinc-100 h-3 overflow-hidden"><div class="h-full rounded-full bg-amber-400"${attr_style(`width:${stringify(maxState() ? Math.round(row.total / maxState() * 100) : 0)}%`)}></div></div> <span class="w-24 text-right text-sm tabular-nums text-zinc-700">${escape_html(formatRM(row.total))}</span> <span class="w-12 text-right text-xs text-zinc-400">${escape_html(row.count)}</span></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<p class="text-sm text-zinc-400">No data.</p>`);
    }
    $$renderer2.push(`<!--]--></div></section></div>`);
  });
}
export {
  _page as default
};
