import { i as head, e as escape_html, d as ensure_array_like } from "../../../../../chunks/index.js";
import { c as cores } from "../../../../../chunks/cores.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    head("ydhyjw", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>New Event · Cakna Hub</title>`);
      });
    });
    $$renderer2.push(`<main class="mx-auto max-w-2xl px-6 py-12"><a href="/society/events" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
    Arrow_left($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Back</a> <h1 class="mt-6 text-2xl font-bold tracking-tight text-zinc-900">New Event</h1> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" class="mt-8 space-y-5"><div class="grid gap-5 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Tajuk Event <span class="text-rose-500">*</span></span> <input name="title" required="" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"/></label> <label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Tarikh <span class="text-rose-500">*</span></span> <input name="tarikh" type="date" required="" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"/></label></div> <div class="grid gap-5 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Kluster <span class="text-rose-500">*</span></span> <select name="kluster" required="" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100">`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`Pilih kluster…`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(cores);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let c = each_array[$$index];
      $$renderer2.option({ value: c.id }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(c.name)}`);
      });
    }
    $$renderer2.push(`<!--]--></select></label> <label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Lokasi</span> <input name="lokasi" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"/></label></div> <label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Anjuran</span> <input name="anjuran" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"/></label> <label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Penerangan</span> <textarea name="penerangan" rows="3" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none"></textarea></label> <div class="flex justify-end gap-3 pt-2"><a href="/society/events" class="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Batal</a> <button type="submit" class="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Simpan Event</button></div></form></main>`);
  });
}
export {
  _page as default
};
