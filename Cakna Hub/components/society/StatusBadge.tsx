import { statusLabel } from "@/lib/society";

// Semantic status colors — kept distinct from the pink brand accent.
const styles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700", // legacy alias
  pending_dept: "bg-amber-50 text-amber-700",
  pending_cakna: "bg-indigo-50 text-indigo-700",
  approved: "bg-emerald-50 text-emerald-700",
  needs_revision: "bg-rose-50 text-rose-700",
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = styles[status] ?? "bg-zinc-100 text-zinc-600";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      {statusLabel(status)}
    </span>
  );
}
