import { f as attr_class, k as stringify, e as escape_html, h as derived } from "./index.js";
import { s as statusLabel } from "./types.js";
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
export {
  StatusBadge as S
};
