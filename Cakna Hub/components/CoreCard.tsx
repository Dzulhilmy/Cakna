import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CoreIcon } from "@/components/CoreIcon";
import type { Core } from "@/lib/cores";

export default function CoreCard({ core }: { core: Core }) {
  return (
    <Link
      href={`/core/${core.id}`}
      className="group block rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600">
          <CoreIcon name={core.icon} size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-zinc-900">{core.name}</h3>
            <ChevronRight
              size={18}
              className="shrink-0 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-rose-600"
            />
          </div>
          <p className="mt-0.5 text-sm text-zinc-500">{core.tagline}</p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-sm">
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 text-zinc-400">Program</dt>
          <dd className="flex flex-wrap gap-1.5">
            {core.programs.map((p) => (
              <span
                key={p}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
              >
                {p}
              </span>
            ))}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 text-zinc-400">PIC</dt>
          <dd className="text-zinc-600">{core.pic.join(", ")}</dd>
        </div>
      </dl>
    </Link>
  );
}
