import { i as head, e as escape_html, d as ensure_array_like, g as attr, h as derived } from "../../../../../chunks/index.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
function _page($$renderer, $$props) {
  let { data } = $$props;
  const event = derived(() => data.event);
  head("1x401jj", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>${escape_html(event().title)} · Cakna Hub</title>`);
    });
  });
  $$renderer.push(`<main class="mx-auto max-w-3xl px-6 py-12"><a href="/society/events" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
  Arrow_left($$renderer, { size: 16 });
  $$renderer.push(`<!----> Events</a> <h1 class="mt-6 text-2xl font-bold tracking-tight text-zinc-900">${escape_html(event().title)}</h1> <dl class="mt-8 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:grid-cols-2"><!--[-->`);
  const each_array = ensure_array_like([
    ["Tarikh", event().tarikh],
    ["Lokasi", event().lokasi],
    ["Kluster", event().kluster],
    ["Anjuran", event().anjuran],
    ["Jumlah Peserta", event().jumlahPeserta]
  ]);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let [label, value] = each_array[$$index];
    if (value) {
      $$renderer.push("<!--[0-->");
      $$renderer.push(`<div><dt class="text-xs font-medium uppercase tracking-wide text-zinc-400">${escape_html(label)}</dt> <dd class="mt-1 text-sm text-zinc-800">${escape_html(value)}</dd></div>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]-->`);
  }
  $$renderer.push(`<!--]--></dl> `);
  if (event().penerangan) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="mt-6 rounded-2xl border border-zinc-200 bg-white p-6"><h2 class="text-sm font-semibold text-zinc-700">Penerangan</h2> <p class="mt-2 text-sm leading-relaxed text-zinc-600">${escape_html(event().penerangan)}</p></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--> `);
  if (event().images && event().images.length > 0) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3"><!--[-->`);
    const each_array_1 = ensure_array_like(event().images);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let src = each_array_1[i];
      $$renderer.push(`<img${attr("src", src)} alt="" class="aspect-[4/3] w-full rounded-2xl border border-zinc-200 object-cover"/>`);
    }
    $$renderer.push(`<!--]--></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></main>`);
}
export {
  _page as default
};
