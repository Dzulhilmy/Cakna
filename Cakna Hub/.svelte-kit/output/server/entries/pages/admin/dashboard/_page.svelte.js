import { i as head, k as stringify, e as escape_html, d as ensure_array_like, h as derived } from "../../../../chunks/index.js";
import { S as StatCard, F as FundingBars } from "../../../../chunks/FundingBars.js";
import { S as StatusBadge } from "../../../../chunks/StatusBadge.js";
import { f as formatRM } from "../../../../chunks/format.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const summary = derived(() => data.summary), states = derived(() => data.states), disbursedPct = derived(() => data.disbursedPct), pendingCount = derived(() => data.pendingCount), recentApplications = derived(() => data.recentApplications);
    head("169czl3", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard · Cakna Hub Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-8"><header><h1 class="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h1> <p class="mt-1.5 text-zinc-500">Funding collected and given across all reports and funding applications, categorized by state.</p></header> <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">`);
    StatCard($$renderer2, {
      label: "Total Collected",
      value: formatRM(summary().collected),
      hint: `${stringify(summary().reportCount)} programme reports`,
      dot: "emerald"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Total Given",
      value: formatRM(summary().given),
      hint: `${stringify(disbursedPct())}% of collected`,
      dot: "amber"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Net Balance",
      value: formatRM(summary().net),
      hint: "Collected − Given",
      dot: "zinc"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Approved Funding",
      value: String(summary().applicationCount),
      hint: `${stringify(formatRM(summary().applicationTotal))} disbursed${pendingCount() > 0 ? ` · ${pendingCount()} pending` : ""}`
    });
    $$renderer2.push(`<!----></section> <section class="rounded-2xl border border-zinc-200 bg-white p-6"><div class="mb-6 flex flex-wrap items-start justify-between gap-3"><div><h2 class="text-base font-semibold text-zinc-900">Funding by state</h2> <p class="mt-0.5 text-sm text-zinc-500">Collected vs given, ranked by amount collected `);
    if (summary().applicationCount > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`— including ${escape_html(summary().applicationCount)} approved funding application${escape_html(summary().applicationCount !== 1 ? "s" : "")}`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->.</p></div> <div class="flex items-center gap-3 text-xs"><span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-emerald-400/60"></span>Collected</span> <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-amber-400/80"></span>Given</span></div></div> `);
    FundingBars($$renderer2, { rows: states() });
    $$renderer2.push(`<!----></section> `);
    if (recentApplications().length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="rounded-2xl border border-zinc-200 bg-white p-6"><div class="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h2 class="text-base font-semibold text-zinc-900">Recent funding applications</h2> <p class="mt-0.5 text-sm text-zinc-500">Live from Society &amp; Others.</p></div> <a href="/society/funding" class="inline-flex items-center gap-1 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700">View all →</a></div> <ul class="divide-y divide-zinc-100"><!--[-->`);
      const each_array = ensure_array_like(recentApplications());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let a = each_array[$$index];
        $$renderer2.push(`<li class="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"><div class="min-w-0"><p class="truncate text-sm font-medium text-zinc-900">${escape_html(a.namaProgram)}</p> <p class="text-xs text-zinc-400">${escape_html(a.reference)} · ${escape_html(a.cawangan)} (${escape_html(a.state)})</p></div> <div class="flex shrink-0 items-center gap-3">`);
        StatusBadge($$renderer2, { status: a.status });
        $$renderer2.push(`<!----> <span class="text-sm font-medium tabular-nums text-zinc-800">${escape_html(formatRM(a.jumlahPerbelanjaan))}</span></div></li>`);
      }
      $$renderer2.push(`<!--]--></ul></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
