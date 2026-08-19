import { ak as head, a5 as escape_html, Q as derived } from '../../../../../chunks/index.js-6hyNTq_g.js';
import { A as Arrow_left } from '../../../../../chunks/arrow-left.js-CvnazgZ6.js';
import '../../../../../chunks/utils.js-DClsVo7x.js';
import '../../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';
import '../../../../../chunks/Icon.js-VGojmkFT.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    const section = derived(() => data.section);
    let json = "";
    head("2edhds", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(section())} · Site Content · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center gap-3"><a href="/admin/site" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900">`);
    Arrow_left($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Site</a> <span class="text-zinc-300">/</span> <h1 class="text-xl font-bold text-zinc-900 capitalize">${escape_html(section())}</h1></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" class="space-y-4"><label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">JSON Content</span> <textarea name="json" rows="24" class="rounded-xl border border-zinc-300 px-4 py-3 font-mono text-xs text-zinc-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 resize-y">`);
    const $$body = escape_html(json);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></label> <div class="flex justify-end gap-3"><a href="/admin/site" class="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Cancel</a> <button type="submit" class="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Save</button></div></form></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-BWnwgdm8.js.map
