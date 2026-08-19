export default function ChartLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-zinc-500">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
        Collected
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
        Given
      </span>
    </div>
  );
}
