import { i as head, d as ensure_array_like, g as attr, k as stringify, e as escape_html, h as derived } from "../../../../chunks/index.js";
import { S as StatusBadge } from "../../../../chunks/StatusBadge.js";
import { f as formatRM } from "../../../../chunks/format.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { P as Plus } from "../../../../chunks/plus.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const applications = derived(() => data.applications);
    head("10h4uub", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Funding Applications · Cakna Hub</title>`);
      });
    });
    $$renderer2.push(`<main class="mx-auto max-w-4xl px-6 py-12"><a href="/" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900">`);
    Arrow_left($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Home</a> <div class="mt-6 flex flex-wrap items-start justify-between gap-4"><div><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Funding Applications</h1> <p class="mt-1.5 text-zinc-500">Events and programmes submitted for funding.</p></div> <a href="/society/funding/new" class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">`);
    Plus($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> New Application</a></div> `);
    if (applications().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-16 text-center text-zinc-400"><p class="text-lg font-medium">No applications yet.</p> <p class="mt-1 text-sm">Submit the first one using the button above.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<ul class="mt-8 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white"><!--[-->`);
      const each_array = ensure_array_like(applications());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let a = each_array[$$index];
        $$renderer2.push(`<li><a${attr("href", `/society/funding/${stringify(a.id)}`)} class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-zinc-50"><div class="min-w-0"><p class="truncate text-sm font-semibold text-zinc-900">${escape_html(a.namaProgram)}</p> <p class="mt-0.5 text-xs text-zinc-400">${escape_html(a.reference)} · ${escape_html(a.cawangan)}</p></div> <div class="flex shrink-0 items-center gap-3">`);
        StatusBadge($$renderer2, { status: a.status });
        $$renderer2.push(`<!----> <span class="text-sm font-medium tabular-nums text-zinc-700">${escape_html(formatRM(a.jumlahPerbelanjaan))}</span></div></a></li>`);
      }
      $$renderer2.push(`<!--]--></ul>`);
    }
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _page as default
};
