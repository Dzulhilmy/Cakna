import { i as head, e as escape_html, g as attr, al as store_get, d as ensure_array_like, f as attr_class, am as unsubscribe_stores, h as derived } from "../../../../../chunks/index.js";
import { p as page } from "../../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { P as PIC_DEPARTMENTS, R as ROLE_LABELS } from "../../../../../chunks/types.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const users = derived(() => data.users), pending = derived(() => data.pending);
    let activeTab = "all";
    let syncing = false;
    let search = "";
    const tabs = [
      { id: "all", label: "All" },
      { id: "member", label: "Member" },
      { id: "franchisee", label: "Franchisee" },
      { id: "pic", label: "PIC" },
      { id: "admin", label: "Admin" }
    ];
    const tabCounts = derived(() => ({
      all: users().length,
      member: users().filter((u) => u.role === "member" || u.role === "host").length,
      franchisee: users().filter((u) => u.role === "franchisee").length,
      pic: users().filter((u) => u.role === "pic" || u.role === "reviewer").length,
      admin: users().filter((u) => u.role === "admin").length
    }));
    const tabFiltered = derived(
      () => users()
    );
    const filtered = derived(() => {
      const q = search.trim().toLowerCase();
      if (!q) return tabFiltered();
      return tabFiltered().filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    });
    const roleOptions = ["member", "franchisee", "pic", "admin"];
    function isPic(role) {
      return role === "pic" || role === "reviewer";
    }
    head("1vl0f0r", $$renderer2, ($$renderer3) => {
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
      $$renderer2.push(`<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">${escape_html(store_get($$store_subs ??= {}, "$page", page).form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="relative"><svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"></path></svg> <input type="text" placeholder="Search by name or email…"${attr("value", search)} class="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"/> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex gap-1 border-b border-zinc-200"><!--[-->`);
    const each_array = ensure_array_like(tabs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`relative px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? "text-rose-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-rose-600" : "text-zinc-500 hover:text-zinc-800"}`)}>${escape_html(tab.label)} <span${attr_class(`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${activeTab === tab.id ? "bg-rose-100 text-rose-700" : "bg-zinc-100 text-zinc-500"}`)}>${escape_html(tabCounts()[tab.id])}</span></button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="rounded-2xl border border-zinc-200 bg-white overflow-hidden"><table class="w-full text-sm"><thead class="border-b border-zinc-100 bg-zinc-50"><tr><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Name</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Email</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Role</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Department</th><th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Status</th><th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">Actions</th></tr></thead><tbody class="divide-y divide-zinc-100"><!--[-->`);
    const each_array_1 = ensure_array_like(filtered());
    for (let $$index_3 = 0, $$length = each_array_1.length; $$index_3 < $$length; $$index_3++) {
      let u = each_array_1[$$index_3];
      $$renderer2.push(`<tr><td class="px-5 py-3 font-medium text-zinc-900">${escape_html(u.name || "—")}</td><td class="px-5 py-3 text-zinc-500">${escape_html(u.email)}</td><td class="px-5 py-3"><form method="POST" action="?/setRole" class="inline-flex"><input type="hidden" name="id"${attr("value", u.id)}/> <select name="role" class="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-700"><!--[-->`);
      const each_array_2 = ensure_array_like(roleOptions);
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let r = each_array_2[$$index_1];
        $$renderer2.option(
          {
            value: r,
            selected: r === u.role || r === "pic" && u.role === "reviewer" || r === "member" && u.role === "host"
          },
          ($$renderer3) => {
            $$renderer3.push(`${escape_html(ROLE_LABELS[r])}`);
          }
        );
      }
      $$renderer2.push(`<!--]--></select></form></td><td class="px-5 py-3">`);
      if (isPic(u.role)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<form method="POST" action="?/setDepartment" class="inline-flex"><input type="hidden" name="id"${attr("value", u.id)}/> <select name="department" class="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-700">`);
        $$renderer2.option({ value: "", selected: !u.branch }, ($$renderer3) => {
          $$renderer3.push(`— unset —`);
        });
        $$renderer2.push(`<!--[-->`);
        const each_array_3 = ensure_array_like(PIC_DEPARTMENTS);
        for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
          let dept = each_array_3[$$index_2];
          $$renderer2.option({ value: dept, selected: u.branch === dept }, ($$renderer3) => {
            $$renderer3.push(`${escape_html(dept)}`);
          });
        }
        $$renderer2.push(`<!--]--></select></form>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span class="text-zinc-300">—</span>`);
      }
      $$renderer2.push(`<!--]--></td><td class="px-5 py-3"><form method="POST" action="?/setStatus" class="inline-flex"><input type="hidden" name="id"${attr("value", u.id)}/> <select name="status"${attr_class(`rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs ${u.status === "active" ? "text-emerald-700" : "text-amber-700"}`)}>`);
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
      $$renderer2.push(`<div class="py-12 text-center text-sm text-zinc-400">${escape_html(`No ${""}users yet.`)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
