import { ak as head, a5 as escape_html, ah as attr, al as store_get, ab as ensure_array_like, ag as attr_class, am as unsubscribe_stores, Q as derived } from '../../../../chunks/index.js-6hyNTq_g.js';
import { p as page } from '../../../../chunks/stores.js-DIsITJZw.js';
import '@sveltejs/kit/internal';
import '../../../../chunks/exports.js-8HOoaa4e.js';
import '../../../../chunks/utils2.js-BQzn9ikS.js';
import '@sveltejs/kit/internal/server';
import '../../../../chunks/root.js-D9zcjZWK.js';
import '../../../../chunks/state.svelte.js-KfFw5RnB.js';
import { R as ROLE_LABELS } from '../../../../chunks/types.js-D6PGEaQi.js';
import '../../../../chunks/utils.js-DClsVo7x.js';
import '@sveltejs/kit';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const users = derived(() => data.users), pending = derived(() => data.pending);
    let activeTab = "all";
    let syncing = false;
    const tabs = [
      { id: "all", label: "All" },
      { id: "host", label: "Host" },
      { id: "franchisee", label: "Franchisee" },
      { id: "pic", label: "PIC" },
      { id: "admin", label: "Admin" }
    ];
    const tabCounts = derived(() => ({
      all: users().length,
      host: users().filter((u) => u.role === "host").length,
      franchisee: users().filter((u) => u.role === "franchisee").length,
      pic: users().filter((u) => u.role === "pic" || u.role === "reviewer").length,
      admin: users().filter((u) => u.role === "admin").length
    }));
    const filtered = derived(
      () => users()
    );
    const roleOptions = ["admin", "host", "franchisee", "pic"];
    head("1p497kv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Users · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6"><header class="flex items-start justify-between gap-4"><div><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Users</h1> <p class="mt-1 text-sm text-zinc-500">${escape_html(users().length)} account${escape_html(users().length !== 1 ? "s" : "")} total. `);
    if (pending() > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-amber-600 font-medium">${escape_html(pending())} pending approval.</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`No accounts pending approval.`);
    }
    $$renderer2.push(`<!--]--></p></div> <form method="POST" action="?/syncUsers"><button type="submit"${attr("disabled", syncing, true)} class="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-60">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`Sync from Cakna`);
    }
    $$renderer2.push(`<!--]--></button></form></header> `);
    if (store_get($$store_subs ??= {}, "$page", page).form?.synced !== void 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">Synced ${escape_html(store_get($$store_subs ??= {}, "$page", page).form.synced)} user${escape_html(store_get($$store_subs ??= {}, "$page", page).form.synced !== 1 ? "s" : "")} from Cakna.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$page", page).form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">Sync failed: ${escape_html(store_get($$store_subs ??= {}, "$page", page).form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex gap-1 border-b border-zinc-200"><!--[-->`);
    const each_array = ensure_array_like(tabs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`relative px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? "text-rose-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-rose-600" : "text-zinc-500 hover:text-zinc-800"}`)}>${escape_html(tab.label)} <span${attr_class(`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${activeTab === tab.id ? "bg-rose-100 text-rose-700" : "bg-zinc-100 text-zinc-500"}`)}>${escape_html(tabCounts()[tab.id])}</span></button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden"><table class="w-full text-sm"><thead class="border-b border-zinc-100 bg-zinc-50"><tr><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Name</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Email</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Role</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Status</th><th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Actions</th></tr></thead><tbody class="divide-y divide-zinc-100"><!--[-->`);
    const each_array_1 = ensure_array_like(filtered());
    for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
      let u = each_array_1[$$index_2];
      $$renderer2.push(`<tr><td class="px-5 py-3 font-medium text-zinc-900">${escape_html(u.name || "—")}</td><td class="px-5 py-3 text-zinc-500">${escape_html(u.email)}</td><td class="px-5 py-3"><form method="POST" action="?/setRole" class="inline-flex"><input type="hidden" name="id"${attr("value", u.id)}/> <select name="role" class="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-700"><!--[-->`);
      const each_array_2 = ensure_array_like(roleOptions);
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let r = each_array_2[$$index_1];
        $$renderer2.option(
          {
            value: r,
            selected: r === u.role || r === "pic" && u.role === "reviewer"
          },
          ($$renderer3) => {
            $$renderer3.push(`${escape_html(ROLE_LABELS[r])}`);
          }
        );
      }
      $$renderer2.push(`<!--]--></select></form></td><td class="px-5 py-3"><form method="POST" action="?/setStatus" class="inline-flex"><input type="hidden" name="id"${attr("value", u.id)}/> <select name="status"${attr_class(`rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs ${u.status === "active" ? "text-emerald-700" : "text-amber-700"}`)}>`);
      $$renderer2.option({ value: "active", selected: u.status === "active" }, ($$renderer3) => {
        $$renderer3.push(`Active`);
      });
      $$renderer2.option({ value: "pending", selected: u.status === "pending" }, ($$renderer3) => {
        $$renderer3.push(`Pending`);
      });
      $$renderer2.push(`</select></form></td><td class="px-5 py-3 text-right"><form method="POST" action="?/delete" class="inline-flex"><input type="hidden" name="id"${attr("value", u.id)}/> <button type="submit" class="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button></form></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table> `);
    if (filtered().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="py-12 text-center text-sm text-zinc-400">No ${escape_html("")}users yet.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-JcBry4pl.js.map
