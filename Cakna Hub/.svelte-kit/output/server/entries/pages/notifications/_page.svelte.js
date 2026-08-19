import { i as head, d as ensure_array_like, f as attr_class, g as attr, e as escape_html, h as derived } from "../../../chunks/index.js";
import { A as Arrow_left } from "../../../chunks/arrow-left.js";
import { B as Bell } from "../../../chunks/bell.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const notices = derived(() => data.notices);
    head("1ce0uvz", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Notifications · Cakna Hub</title>`);
      });
    });
    $$renderer2.push(`<main class="mx-auto max-w-2xl px-6 py-12"><a href="/" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
    Arrow_left($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Home</a> <div class="mt-6 flex items-center gap-3">`);
    Bell($$renderer2, { size: 22, class: "text-rose-600" });
    $$renderer2.push(`<!----> <h1 class="text-2xl font-bold tracking-tight text-zinc-900">Notifications</h1></div> `);
    if (notices().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-16 text-center text-zinc-400"><p class="text-lg font-medium">No notifications.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<ul class="mt-6 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white"><!--[-->`);
      const each_array = ensure_array_like(notices());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let n = each_array[$$index];
        $$renderer2.push(`<li${attr_class(`px-5 py-4 ${n.readBy?.includes(data.user?.id ?? "") ? "opacity-60" : ""}`)}>`);
        if (n.href) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", n.href)} class="block hover:text-rose-600"><p class="text-sm font-semibold text-zinc-900">${escape_html(n.title)}</p> <p class="mt-0.5 text-xs text-zinc-500">${escape_html(n.body)}</p></a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="text-sm font-semibold text-zinc-900">${escape_html(n.title)}</p> <p class="mt-0.5 text-xs text-zinc-500">${escape_html(n.body)}</p>`);
        }
        $$renderer2.push(`<!--]--></li>`);
      }
      $$renderer2.push(`<!--]--></ul>`);
    }
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _page as default
};
