import { ak as head, a5 as escape_html, ab as ensure_array_like, ag as attr_class, ai as stringify, ah as attr, Q as derived } from '../../../../../chunks/index.js-6hyNTq_g.js';
import '@sveltejs/kit/internal';
import '../../../../../chunks/exports.js-8HOoaa4e.js';
import '../../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit/internal/server';
import '../../../../../chunks/root.js-D9zcjZWK.js';
import '../../../../../chunks/state.svelte.js-KfFw5RnB.js';
import { N as NOTIFICATION_TYPE_LABELS } from '../../../../../chunks/types.js-D6PGEaQi.js';
import { P as Plus } from '../../../../../chunks/plus.js-C9jfm_AR.js';
import { T as Trash_2 } from '../../../../../chunks/trash-2.js-7NoUOT_P.js';
import '../../../../../chunks/utils.js-DClsVo7x.js';
import '@sveltejs/kit';
import '../../../../../chunks/Icon.js-VGojmkFT.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const notifications = derived(() => data.notifications);
    function fmtDate(iso) {
      return new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
    }
    const typeBadge = {
      kemalangan: "bg-red-100 text-red-700",
      takziah: "bg-zinc-100 text-zinc-700",
      kesihatan: "bg-blue-100 text-blue-700",
      umum: "bg-emerald-100 text-emerald-700"
    };
    head("16h07qn", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Announcements · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8"><header class="flex flex-wrap items-start justify-between gap-4"><div><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Announcements</h1> <p class="mt-1.5 text-zinc-500">${escape_html(notifications().length)} announcement${escape_html(notifications().length !== 1 ? "s" : "")} sent.</p></div> <a href="/hub/admin/notifications/new" class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">`);
    Plus($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> New Announcement</a></header> `);
    if (notifications().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-2xl border border-zinc-200 bg-white py-16 text-center text-sm text-zinc-400">No announcements sent yet.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden"><table class="w-full text-sm"><thead class="border-b border-zinc-100 bg-zinc-50"><tr><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Title</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden sm:table-cell">Type</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden md:table-cell">Audience</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 hidden lg:table-cell">Date</th><th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Actions</th></tr></thead><tbody class="divide-y divide-zinc-100"><!--[-->`);
      const each_array = ensure_array_like(notifications());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let n = each_array[$$index];
        $$renderer2.push(`<tr><td class="px-5 py-3"><p class="font-medium text-zinc-900">${escape_html(n.title)}</p> `);
        if (n.content) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="mt-0.5 text-xs text-zinc-400 line-clamp-1">${escape_html(n.content)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></td><td class="px-5 py-3 hidden sm:table-cell"><span${attr_class(`rounded-full px-2 py-0.5 text-xs font-medium ${stringify(typeBadge[n.type] ?? "bg-zinc-100 text-zinc-700")}`)}>${escape_html(NOTIFICATION_TYPE_LABELS[n.type] ?? n.type)}</span></td><td class="px-5 py-3 text-zinc-500 hidden md:table-cell capitalize">${escape_html(n.audience)}</td><td class="px-5 py-3 text-zinc-400 text-xs hidden lg:table-cell">${escape_html(fmtDate(n.createdAt))}</td><td class="px-5 py-3 text-right"><form method="POST" action="?/delete" class="inline-flex"><input type="hidden" name="id"${attr("value", n.id)}/> <button type="submit" class="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50">`);
        Trash_2($$renderer2, { size: 12 });
        $$renderer2.push(`<!----> Delete</button></form></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-Bw_Yd496.js.map
