import { i as head, e as escape_html, d as ensure_array_like, g as attr, k as stringify, h as derived } from "../../../../chunks/index.js";
import { S as StatusBadge } from "../../../../chunks/StatusBadge.js";
import { f as formatRM } from "../../../../chunks/format.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const applications = derived(() => data.applications);
    head("1omh5re", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Funding · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8"><header><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Funding Applications</h1> <p class="mt-1.5 text-zinc-500">${escape_html(applications().length)} total applications.</p></header> <div class="rounded-2xl border border-zinc-200 bg-white overflow-x-auto"><table class="w-full text-sm"><thead class="border-b border-zinc-100 bg-zinc-50"><tr><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Program</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Cawangan</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Status</th><th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Amount</th></tr></thead><tbody class="divide-y divide-zinc-100"><!--[-->`);
    const each_array = ensure_array_like(applications());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let a = each_array[$$index];
      $$renderer2.push(`<tr><td class="px-5 py-3"><a${attr("href", `/society/funding/${stringify(a.id)}`)} class="font-medium text-zinc-900 hover:text-rose-600">${escape_html(a.namaProgram)}</a> <p class="text-xs text-zinc-400">${escape_html(a.reference)}</p></td><td class="px-5 py-3 text-zinc-500">${escape_html(a.cawangan)}</td><td class="px-5 py-3">`);
      StatusBadge($$renderer2, { status: a.status });
      $$renderer2.push(`<!----></td><td class="px-5 py-3 text-right tabular-nums text-zinc-700">${escape_html(formatRM(a.jumlahPerbelanjaan))}</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table> `);
    if (applications().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="py-12 text-center text-sm text-zinc-400">No applications yet.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
