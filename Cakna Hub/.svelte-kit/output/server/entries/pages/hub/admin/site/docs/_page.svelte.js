import { i as head, d as ensure_array_like, g as attr, k as stringify, e as escape_html, h as derived } from "../../../../../../chunks/index.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { B as Book_open } from "../../../../../../chunks/book-open.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const docsData = derived(() => data.content.docs ?? {});
    const slugs = [
      { slug: "policy", label: "Polisi" },
      { slug: "sop", label: "SOP" },
      { slug: "guidelines", label: "Garis Panduan" },
      { slug: "manual", label: "Manual" }
    ];
    head("34dkqc", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Polisi, SOP &amp; Panduan · Website · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center gap-3"><a href="/hub/admin/site" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
    Arrow_left($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Website</a> <span class="text-zinc-300">/</span> <h1 class="text-xl font-bold text-zinc-900">Polisi, SOP &amp; Panduan</h1></div> <div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
    const each_array = ensure_array_like(slugs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let d = each_array[$$index];
      $$renderer2.push(`<a${attr("href", `/hub/admin/site/docs/${stringify(d.slug)}`)} class="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-rose-200 hover:bg-rose-50"><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">`);
      Book_open($$renderer2, { size: 16 });
      $$renderer2.push(`<!----></div> <div class="min-w-0"><p class="font-medium text-zinc-900">${escape_html(d.label)}</p> <p class="mt-0.5 truncate text-sm text-zinc-400">${escape_html(docsData()[d.slug]?.title ?? "No content yet")}</p></div></a>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
