import { a5 as escape_html, ag as attr_class, ai as stringify, ab as ensure_array_like, aj as attr_style, Q as derived } from './index.js-6hyNTq_g.js';
import { a as formatCompactRM } from './format.js-Z_BjvbO5.js';

function StatCard($$renderer, $$props) {
  let { label, value, hint, dot } = $$props;
  const dotColors = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-400",
    zinc: "bg-zinc-400",
    rose: "bg-rose-500"
  };
  $$renderer.push(`<div class="rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-sm"><div class="flex items-start justify-between gap-2"><p class="text-xs font-semibold uppercase tracking-wide text-zinc-400">${escape_html(label)}</p> `);
  if (dot) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<span${attr_class(`mt-0.5 h-2 w-2 shrink-0 rounded-full ${stringify(dotColors[dot] ?? "bg-zinc-400")}`)}></span>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div> <p class="mt-2.5 text-3xl font-bold tracking-tight text-zinc-900">${escape_html(value)}</p> `);
  if (hint) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<p class="mt-1.5 text-xs text-zinc-400">${escape_html(hint)}</p>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
function FundingBars($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { rows } = $$props;
    const maxVal = derived(() => Math.max(...rows.map((r) => r.collected), 1));
    if (rows.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="py-6 text-center text-sm text-zinc-400">No funding data yet.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(rows);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let row = each_array[$$index];
        $$renderer2.push(`<div><div class="mb-1 flex items-baseline justify-between gap-2"><span class="text-sm font-medium text-zinc-700">${escape_html(row.label)}</span> <span class="text-xs text-zinc-400">${escape_html(row.meta ?? "")}</span></div> <div class="relative h-7 overflow-hidden rounded-lg bg-zinc-100"><div class="absolute inset-y-0 left-0 rounded-lg bg-emerald-400/60"${attr_style(`width: ${stringify(row.collected / maxVal() * 100)}%`)}></div> <div class="absolute inset-y-0 left-0 rounded-lg bg-amber-400/80"${attr_style(`width: ${stringify(row.given / maxVal() * 100)}%`)}></div> <div class="absolute inset-0 flex items-center justify-end pr-2"><span class="text-xs font-semibold text-zinc-700">${escape_html(formatCompactRM(row.collected))}</span></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { FundingBars as F, StatCard as S };
//# sourceMappingURL=FundingBars.js-DCXBFUb3.js.map
