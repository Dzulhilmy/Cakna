"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CoreIcon } from "@/components/CoreIcon";
import { cores, slugify } from "@/lib/cores";
import type { Program } from "@/lib/programs-store";

/**
 * Public programs explorer. Anyone can expand a core to browse the programs
 * under it (name + description). Read-only — programs are managed by admins.
 */
export default function ProgramsExplorer({
  programsByCore,
}: {
  programsByCore?: Record<string, Program[]>;
}) {
  const [open, setOpen] = useState<string | null>(null);

  // Fall back to the seeded program names when no live catalog is supplied
  // (e.g. the admin editor's live preview).
  const byCore =
    programsByCore ??
    Object.fromEntries(
      cores.map((c) => [
        c.id,
        c.programs.map((name) => ({
          id: `${c.id}--${slugify(name)}`,
          coreId: c.id,
          name,
          slug: slugify(name),
          description: "",
          image: "",
          createdAt: "",
          updatedAt: "",
        })),
      ]),
    );

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cores.map((core) => {
        const expanded = open === core.id;
        const programs = byCore[core.id] ?? [];

        return (
          <div
            key={core.id}
            className={`rounded-2xl border bg-white transition-colors ${
              expanded ? "border-rose-300 shadow-sm" : "border-zinc-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : core.id)}
              aria-expanded={expanded}
              aria-controls={`core-panel-${core.id}`}
              className="flex w-full items-start gap-4 rounded-2xl p-5 text-left transition-colors hover:bg-zinc-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <CoreIcon name={core.icon} size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-zinc-900">
                  {core.name}
                </span>
                <span className="mt-0.5 block text-sm text-zinc-500">
                  {core.tagline}
                </span>
              </span>
              <ChevronDown
                size={18}
                className={`mt-1 shrink-0 transition-transform ${
                  expanded ? "rotate-180 text-rose-500" : "text-zinc-400"
                }`}
              />
            </button>

            {expanded && (
              <div
                id={`core-panel-${core.id}`}
                className="border-t border-zinc-100 px-5 pb-5 pt-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Programs
                </p>
                {programs.length === 0 ? (
                  <p className="mt-2 text-sm text-zinc-400">
                    No programs listed yet.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2.5">
                    {programs.map((program) => (
                      <li key={program.slug} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-800">
                            {program.name}
                          </p>
                          {program.description && (
                            <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                              {program.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
