import { ag as attr_class, ai as stringify, a5 as escape_html, Q as derived } from './index.js-6hyNTq_g.js';
import { s as statusLabel } from './types.js-D6PGEaQi.js';

function StatusBadge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { status } = $$props;
    const colors = {
      pending_dept: "bg-amber-50 text-amber-700 ring-amber-200",
      pending_cakna: "bg-blue-50 text-blue-700 ring-blue-200",
      approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      needs_revision: "bg-red-50 text-red-700 ring-red-200",
      pending: "bg-amber-50 text-amber-700 ring-amber-200"
    };
    const cls = derived(() => colors[status] ?? "bg-zinc-50 text-zinc-700 ring-zinc-200");
    $$renderer2.push(`<span${attr_class(`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${stringify(cls())}`)}>${escape_html(statusLabel(status))}</span>`);
  });
}

export { StatusBadge as S };
//# sourceMappingURL=StatusBadge.js-BG7jl_hL.js.map
