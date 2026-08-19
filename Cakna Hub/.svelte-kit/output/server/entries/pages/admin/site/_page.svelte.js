import { i as head, d as ensure_array_like, g as attr, k as stringify, e as escape_html } from "../../../../chunks/index.js";
import { A as Arrow_right } from "../../../../chunks/arrow-right.js";
function _page($$renderer, $$props) {
  let { data } = $$props;
  const sections = [
    { key: "brand", label: "Brand & Nav" },
    { key: "hero", label: "Hero Section" },
    { key: "about", label: "About Section" },
    { key: "programs", label: "Programs Section" },
    { key: "impact", label: "Impact Section" },
    { key: "cta", label: "CTA Section" },
    { key: "footer", label: "Footer" },
    { key: "customSections", label: "Custom Sections" }
  ];
  head("1620bww", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Site Content · Cakna Hub Admin</title>`);
    });
  });
  $$renderer.push(`<div class="space-y-8"><header><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Site Content</h1> <p class="mt-1.5 text-zinc-500">Edit the public-facing landing page content by section.</p></header> <div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
  const each_array = ensure_array_like(sections);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let s = each_array[$$index];
    $$renderer.push(`<a${attr("href", `/admin/site/${stringify(s.key)}`)} class="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-rose-200 hover:bg-rose-50"><span class="font-medium text-zinc-900">${escape_html(s.label)}</span> `);
    Arrow_right($$renderer, { size: 16, class: "text-zinc-400" });
    $$renderer.push(`<!----></a>`);
  }
  $$renderer.push(`<!--]--> <a href="/admin/site/docs" class="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-rose-200 hover:bg-rose-50"><span class="font-medium text-zinc-900">Documents (Policy, SOP…)</span> `);
  Arrow_right($$renderer, { size: 16, class: "text-zinc-400" });
  $$renderer.push(`<!----></a></div></div>`);
}
export {
  _page as default
};
