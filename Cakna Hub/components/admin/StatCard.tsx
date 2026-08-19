type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  dot?: "emerald" | "amber" | "zinc";
};

const dotClasses: Record<NonNullable<StatCardProps["dot"]>, string> = {
  emerald: "bg-rose-500",
  amber: "bg-amber-500",
  zinc: "bg-zinc-400",
};

export default function StatCard({ label, value, hint, dot }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-2">
        {dot && (
          <span className={`h-2 w-2 shrink-0 rounded-full ${dotClasses[dot]}`} />
        )}
        <p className="text-sm text-zinc-500">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}
