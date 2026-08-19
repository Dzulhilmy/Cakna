import { ak as head, a5 as escape_html, ab as ensure_array_like, ah as attr, ai as stringify, Q as derived } from '../../../../../chunks/index.js-6hyNTq_g.js';
import '@sveltejs/kit/internal';
import '../../../../../chunks/exports.js-8HOoaa4e.js';
import '../../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit/internal/server';
import '../../../../../chunks/root.js-D9zcjZWK.js';
import '../../../../../chunks/state.svelte.js-KfFw5RnB.js';
import { S as StatusBadge } from '../../../../../chunks/StatusBadge.js-BG7jl_hL.js';
import { f as formatRM } from '../../../../../chunks/format.js-Z_BjvbO5.js';
import { P as Plus } from '../../../../../chunks/plus.js-C9jfm_AR.js';
import { E as External_link } from '../../../../../chunks/external-link.js-BwqAnHMH.js';
import { P as Pencil } from '../../../../../chunks/pencil.js-D3lfPRO0.js';
import { T as Trash_2 } from '../../../../../chunks/trash-2.js-7NoUOT_P.js';
import '../../../../../chunks/utils.js-DClsVo7x.js';
import '@sveltejs/kit';
import '../../../../../chunks/types.js-D6PGEaQi.js';
import '../../../../../chunks/Icon.js-VGojmkFT.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const applications = derived(() => data.applications);
    head("3sr0fu", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Funding · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8"><header class="flex items-start justify-between gap-4"><div><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Funding Applications</h1> <p class="mt-1.5 text-sm text-zinc-500">${escape_html(applications().length)} total applications.</p></div> <button class="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700">`);
    Plus($$renderer2, { size: 15 });
    $$renderer2.push(`<!----> New Application</button></header> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="overflow-x-auto rounded-2xl border border-zinc-200 bg-white"><table class="w-full text-sm"><thead class="border-b border-zinc-100 bg-zinc-50"><tr><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Program</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Cawangan</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Status</th><th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Amount</th><th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Action</th></tr></thead><tbody class="divide-y divide-zinc-100"><!--[-->`);
    const each_array = ensure_array_like(applications());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let a = each_array[$$index];
      $$renderer2.push(`<tr class="hover:bg-zinc-50/50"><td class="px-5 py-3"><p class="font-medium text-zinc-900">${escape_html(a.namaProgram)}</p> <p class="text-xs text-zinc-400">${escape_html(a.reference)}</p></td><td class="px-5 py-3 text-zinc-500">${escape_html(a.cawangan)}</td><td class="px-5 py-3">`);
      StatusBadge($$renderer2, { status: a.status });
      $$renderer2.push(`<!----></td><td class="px-5 py-3 text-right tabular-nums text-zinc-700">${escape_html(formatRM(a.jumlahPerbelanjaan))}</td><td class="px-5 py-3"><div class="flex items-center justify-end gap-0.5"><a${attr("href", `/society/funding/${stringify(a.id)}`)} class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700" title="View">`);
      External_link($$renderer2, { size: 14 });
      $$renderer2.push(`<!----></a> <button class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-blue-50 hover:text-blue-600" title="Edit">`);
      Pencil($$renderer2, { size: 14 });
      $$renderer2.push(`<!----></button> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", a.id)}/> <button type="submit" class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Delete">`);
      Trash_2($$renderer2, { size: 14 });
      $$renderer2.push(`<!----></button></form></div></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table> `);
    if (applications().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="py-12 text-center text-sm text-zinc-400">No applications yet.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-BnQF7hDQ.js.map
