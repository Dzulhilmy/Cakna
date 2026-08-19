import { i as head, d as ensure_array_like, g as attr, e as escape_html, h as derived, k as stringify } from "../../../../../chunks/index.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const docs = derived(() => data.content.docs ?? {});
    const slugs = ["policy", "sop", "guidelines", "manual"];
    head("48ee90", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Docs · Site Content · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center gap-3"><a href="/admin/site" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
    Arrow_left($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Site</a> <span class="text-zinc-300">/</span> <h1 class="text-xl font-bold text-zinc-900">Documents</h1></div> <div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
    const each_array = ensure_array_like(slugs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let slug = each_array[$$index];
      $$renderer2.push(`<a${attr("href", `/admin/site/docs-${stringify(slug)}`)} class="rounded-2xl border border-zinc-200 bg-white px-5 py-4 hover:border-rose-200"><p class="font-medium capitalize text-zinc-900">${escape_html(slug)}</p> <p class="mt-0.5 text-sm text-zinc-400 line-clamp-2">${escape_html(docs()[slug]?.title ?? "No content yet")}</p></a>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
