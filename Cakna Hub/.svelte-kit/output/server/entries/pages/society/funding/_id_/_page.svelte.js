import { i as head, e as escape_html, d as ensure_array_like, g as attr, h as derived } from "../../../../../chunks/index.js";
import { S as StatusBadge } from "../../../../../chunks/StatusBadge.js";
import { f as formatRM } from "../../../../../chunks/format.js";
import { a as stageForStatus, c as canActOnStage } from "../../../../../chunks/types.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const app = derived(() => data.app);
    const user = derived(() => data.user ?? null);
    const stage = derived(() => stageForStatus(app().status));
    const canAct = derived(() => user() && stage() ? canActOnStage(user().role, stage()) : false);
    head("1a14aj", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(app().namaProgram)} · Cakna Hub</title>`);
      });
    });
    $$renderer2.push(`<main class="mx-auto max-w-3xl px-6 py-12"><a href="/society/funding" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
    Arrow_left($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Funding Applications</a> <div class="mt-6 flex flex-wrap items-start justify-between gap-4"><div><h1 class="text-2xl font-bold tracking-tight text-zinc-900">${escape_html(app().namaProgram)}</h1> <p class="mt-0.5 text-sm text-zinc-400">${escape_html(app().reference)} · ${escape_html(app().cawangan)}</p></div> `);
    StatusBadge($$renderer2, { status: app().status });
    $$renderer2.push(`<!----></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <dl class="mt-8 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:grid-cols-2"><!--[-->`);
    const each_array = ensure_array_like([
      ["Tarikh", app().tarikh],
      ["Lokasi", app().lokasi],
      ["Kluster", app().kluster],
      ["Nama Francaisi", app().namaFrancaisi],
      ["Jumlah Perbelanjaan", formatRM(app().jumlahPerbelanjaan)],
      ["Jumlah Peserta", app().jumlahPeserta],
      ["Kategori Penerima", app().kategoriPenerima],
      ["Sumber Dana", app().sumberDana]
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [label, value] = each_array[$$index];
      if (value) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div><dt class="text-xs font-medium uppercase tracking-wide text-zinc-400">${escape_html(label)}</dt> <dd class="mt-1 text-sm text-zinc-800">${escape_html(value)}</dd></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></dl> `);
    if (app().penerangan) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-6 rounded-2xl border border-zinc-200 bg-white p-6"><h2 class="text-sm font-semibold text-zinc-700">Penerangan Program</h2> <p class="mt-2 text-sm leading-relaxed text-zinc-600">${escape_html(app().penerangan)}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (app().impak) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-4 rounded-2xl border border-zinc-200 bg-white p-6"><h2 class="text-sm font-semibold text-zinc-700">Impak</h2> <p class="mt-2 text-sm leading-relaxed text-zinc-600">${escape_html(app().impak)}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (canAct() && stage()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6"><h2 class="text-base font-semibold text-amber-900">Review</h2> <p class="mt-1 text-sm text-amber-700">Semak permohonan ini dan buat keputusan.</p> <form method="POST" action="?/review" class="mt-4 space-y-3"><input type="hidden" name="stage"${attr("value", stage())}/> <textarea name="note" rows="2" placeholder="Nota (pilihan)…" class="w-full rounded-lg border border-amber-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"></textarea> <div class="flex gap-2"><button type="submit" name="decision" value="approved" class="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Lulus</button> <button type="submit" name="decision" value="needs_revision" class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Perlu Semakan</button></div></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (app().status === "needs_revision" && user()?.role === "franchisee") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6"><h2 class="text-base font-semibold text-rose-900">Hantar Semula</h2> <form method="POST" action="?/resubmit" class="mt-4 space-y-3"><textarea name="note" rows="2" placeholder="Nota tambahan…" class="w-full rounded-lg border border-rose-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"></textarea> <button type="submit" class="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Hantar Semula</button></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (app().reviewLog && app().reviewLog.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-8"><h2 class="text-sm font-semibold text-zinc-700">History</h2> <ul class="mt-3 space-y-2"><!--[-->`);
      const each_array_1 = ensure_array_like(app().reviewLog);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let entry = each_array_1[$$index_1];
        $$renderer2.push(`<li class="flex gap-3 text-sm"><span class="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-rose-300"></span> <div><span class="font-medium capitalize text-zinc-800">${escape_html(entry.decision)}</span> <span class="text-zinc-400">by ${escape_html(entry.by)} (${escape_html(entry.byRole)})</span> `);
        if (entry.note) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="mt-0.5 text-xs text-zinc-500">${escape_html(entry.note)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></li>`);
      }
      $$renderer2.push(`<!--]--></ul></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _page as default
};
