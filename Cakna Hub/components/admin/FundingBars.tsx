import { formatRM } from "@/lib/format";

export type FundingRow = {
  label: string;
  collected: number;
  given: number;
  meta?: string;
};

/**
 * Two-series horizontal bars (Collected = emerald, Given = amber) sharing one
 * scale so every bar is comparable. Every bar is directly labelled with its
 * value, so identity/magnitude never rely on color alone.
 */
export default function FundingBars({ rows }: { rows: FundingRow[] }) {
  const max = Math.max(1, ...rows.flatMap((r) => [r.collected, r.given]));
  const pct = (v: number) => `${(v / max) * 100}%`;

  return (
    <div className="space-y-5">
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
          <Bar value={r.collected} width={pct(r.collected)} color="bg-rose-500" />
          <Bar value={r.given} width={pct(r.given)} color="bg-amber-500" />
        </div>
      ))}
    </div>
  );
}

function Bar({
  value,
  width,
  color,
}: {
  value: number;
  width: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
      <span className="w-24 shrink-0 text-right text-xs tabular-nums text-zinc-600">
        {formatRM(value)}
      </span>
    </div>
  );
}
