import { ak as head, a5 as escape_html, ab as ensure_array_like } from '../../../../../chunks/index.js-6hyNTq_g.js';
import { N as NOTIFICATION_TYPE_LABELS } from '../../../../../chunks/types.js-D6PGEaQi.js';
import '../../../../../chunks/utils.js-DClsVo7x.js';
import '../../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    head("htmela", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>New Notification · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="mx-auto max-w-xl space-y-8"><header><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Send Notification</h1> <p class="mt-1.5 text-zinc-500">Push an announcement to Hub users.</p></header> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" class="space-y-5"><div class="grid gap-5 sm:grid-cols-2"><label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Type</span> <select name="type" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"><!--[-->`);
    const each_array = ensure_array_like(Object.entries(NOTIFICATION_TYPE_LABELS));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [k, v] = each_array[$$index];
      $$renderer2.option({ value: k }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(v)}`);
      });
    }
    $$renderer2.push(`<!--]--></select></label> <label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Audience</span> <select name="audience" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100">`);
    $$renderer2.option({ value: "all" }, ($$renderer3) => {
      $$renderer3.push(`All users`);
    });
    $$renderer2.option({ value: "franchisee" }, ($$renderer3) => {
      $$renderer3.push(`Franchisees`);
    });
    $$renderer2.option({ value: "admin" }, ($$renderer3) => {
      $$renderer3.push(`Admins`);
    });
    $$renderer2.push(`</select></label></div> <label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Title <span class="text-rose-500">*</span></span> <input name="title" required="" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"/></label> <label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Content <span class="text-rose-500">*</span></span> <textarea name="content" rows="4" required="" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none"></textarea></label> <label class="flex flex-col gap-1.5"><span class="text-sm font-medium text-zinc-700">Callout (optional highlight)</span> <input name="callout" class="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"/></label> <div class="flex justify-end gap-3 pt-2"><a href="/admin/dashboard" class="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Cancel</a> <button type="submit" class="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Send</button></div></form></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-CTLfmqqC.js.map
