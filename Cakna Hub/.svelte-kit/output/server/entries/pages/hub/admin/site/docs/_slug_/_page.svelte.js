import { i as head, e as escape_html, f as attr_class, af as clsx, g as attr } from "../../../../../../../chunks/index.js";
import { A as Arrow_left } from "../../../../../../../chunks/arrow-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const slugLabels = {
      policy: "Polisi",
      sop: "SOP",
      guidelines: "Garis Panduan",
      manual: "Manual"
    };
    let title = data.doc?.title ?? "";
    let subtitle = data.doc?.subtitle ?? "";
    let content = data.doc?.content ?? "";
    let lastUpdated = data.doc?.lastUpdated ?? "";
    const label = slugLabels[data.slug] ?? data.slug;
    const inp = "rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 w-full bg-white";
    const ta = inp + " resize-y";
    const lbl = "text-sm font-medium text-zinc-700";
    head("f3gl1y", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(label)} · Dokumen · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 pb-16"><div class="flex items-center gap-3"><a href="/hub/admin/site/docs" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
    Arrow_left($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Dokumen</a> <span class="text-zinc-300">/</span> <h1 class="text-xl font-bold text-zinc-900">${escape_html(label)}</h1></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" class="space-y-5"><div class="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"><label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Tajuk</span> <input name="title"${attr("value", title)}${attr_class(clsx(inp))} placeholder="Polisi" required=""/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Subtajuk <span class="font-normal text-zinc-400">(optional)</span></span> <input name="subtitle"${attr("value", subtitle)}${attr_class(clsx(inp))} placeholder="Dasar dan polisi rasmi…"/></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Kandungan <span class="font-normal text-zinc-400">(perenggan dipisah dengan baris kosong)</span></span> <textarea name="content"${attr("rows", 12)}${attr_class(clsx(ta))} placeholder="Tulis kandungan dokumen di sini…">`);
    const $$body = escape_html(content);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></label> <label class="flex flex-col gap-1.5"><span${attr_class(clsx(lbl))}>Dikemaskini</span> <input name="lastUpdated"${attr("value", lastUpdated)}${attr_class(clsx(inp))} placeholder="2026"/></label></div> <div class="flex items-center justify-between"><a href="/hub/admin/site/docs" class="text-sm text-zinc-500 hover:text-zinc-900">← Batal</a> <button type="submit" class="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Simpan perubahan</button></div></form></div>`);
  });
}
export {
  _page as default
};
