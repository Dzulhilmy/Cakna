import { formatRM } from "@/lib/format";

export type AmountRow = { label: string; value: number; meta?: string };

/** Single-series horizontal bars (emerald), one shared scale, values labelled. */
export default function AmountBars({ rows }: { rows: AmountRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.label} className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-sm font-medium text-zinc-800">
              {r.label}
            </span>
            {r.meta && (
              <span className="shrink-0 text-xs text-zinc-400">{r.meta}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-rose-500"
                style={{ width: `${(r.value / max) * 100}%` }}
              />
            </div>
            <span className="w-24 shrink-0 text-right text-xs tabular-nums text-zinc-600">
              {formatRM(r.value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
