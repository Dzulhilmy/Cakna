import { i as head, e as escape_html, d as ensure_array_like, g as attr, h as derived } from "../../../../chunks/index.js";
import { c as cores } from "../../../../chunks/cores.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const programs = derived(() => data.programs);
    head("pkjjbm", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Programs · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8"><header class="flex flex-wrap items-start justify-between gap-4"><div><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Programs</h1> <p class="mt-1.5 text-zinc-500">Manage the programme catalog for the 7 Core.</p></div></header> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="rounded-2xl border border-zinc-200 bg-white p-6"><h2 class="text-sm font-semibold text-zinc-800 mb-4">Add Program</h2> <form method="POST" action="?/create" class="flex flex-wrap gap-3 items-end"><label class="flex flex-col gap-1 flex-1 min-w-0"><span class="text-xs text-zinc-500">Core</span> <select name="coreId" required="" class="rounded-lg border border-zinc-300 px-3 py-2 text-sm"><!--[-->`);
    const each_array = ensure_array_like(cores);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let c = each_array[$$index];
      $$renderer2.option({ value: c.id }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(c.name)}`);
      });
    }
    $$renderer2.push(`<!--]--></select></label> <label class="flex flex-col gap-1 flex-[2] min-w-0"><span class="text-xs text-zinc-500">Program Name</span> <input name="name" required="" class="rounded-lg border border-zinc-300 px-3 py-2 text-sm" placeholder="e.g. Edu Maths"/></label> <button type="submit" class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 whitespace-nowrap">`);
    Plus($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Add</button></form></div> <div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden"><table class="w-full text-sm"><thead class="border-b border-zinc-100 bg-zinc-50"><tr><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Program</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Core</th><th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Actions</th></tr></thead><tbody class="divide-y divide-zinc-100"><!--[-->`);
    const each_array_1 = ensure_array_like(programs());
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let p = each_array_1[$$index_1];
      $$renderer2.push(`<tr><td class="px-5 py-3 font-medium text-zinc-900">${escape_html(p.name)}</td><td class="px-5 py-3 text-zinc-500">${escape_html(p.coreId)}</td><td class="px-5 py-3 text-right"><form method="POST" action="?/delete" class="inline-flex"><input type="hidden" name="id"${attr("value", p.id)}/> <button type="submit" class="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50">`);
      Trash_2($$renderer2, { size: 12 });
      $$renderer2.push(`<!----> Delete</button></form></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table> `);
    if (programs().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="py-12 text-center text-sm text-zinc-400">No programs yet.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
