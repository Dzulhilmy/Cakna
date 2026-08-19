import { ak as head, a5 as escape_html, ab as ensure_array_like, ah as attr, Q as derived } from '../../../../chunks/index.js-6hyNTq_g.js';
import { T as Trash_2 } from '../../../../chunks/trash-2.js-7NoUOT_P.js';
import '../../../../chunks/utils.js-DClsVo7x.js';
import '../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';
import '../../../../chunks/Icon.js-VGojmkFT.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const files = derived(() => data.files);
    const displayName = (path) => path.replace(/^\/uploads\//, "");
    const isImage = (path) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(path);
    head("1qcx2zr", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Media · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8"><header><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Media Library</h1> <p class="mt-1.5 text-zinc-500">${escape_html(files().length)} file${escape_html(files().length !== 1 ? "s" : "")} in /public/uploads/.</p></header> `);
    if (files().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-2xl border border-zinc-200 bg-white py-16 text-center text-sm text-zinc-400">No files uploaded yet.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"><!--[-->`);
      const each_array = ensure_array_like(files());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let path = each_array[$$index];
        $$renderer2.push(`<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden">`);
        if (isImage(path)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", path)}${attr("alt", displayName(path))} class="aspect-square w-full object-cover"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="aspect-square flex items-center justify-center bg-zinc-50 text-4xl">📄</div>`);
        }
        $$renderer2.push(`<!--]--> <div class="p-3 flex items-center justify-between gap-2"><p class="truncate text-xs text-zinc-600"${attr("title", path)}>${escape_html(displayName(path))}</p> <form method="POST" action="?/delete"><input type="hidden" name="name"${attr("value", displayName(path))}/> <button type="submit" class="text-red-500 hover:text-red-700">`);
        Trash_2($$renderer2, { size: 14 });
        $$renderer2.push(`<!----></button></form></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-DITWKDFz.js.map
