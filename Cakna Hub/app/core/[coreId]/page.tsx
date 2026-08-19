import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { CoreIcon } from "@/components/CoreIcon";
import { getCore } from "@/lib/cores";
import { getProgramsForCore } from "@/lib/programs-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ coreId: string }>;
}): Promise<Metadata> {
  const { coreId } = await params;
  const core = getCore(coreId);
  return { title: core ? `${core.name} · Cakna Hub` : "Cakna Hub" };
}

export default async function CoreDetailPage({
  params,
}: {
  params: Promise<{ coreId: string }>;
}) {
  const { coreId } = await params;
  const core = getCore(coreId);
  if (!core) notFound();

  const programs = await getProgramsForCore(coreId);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <SiteHeader showBack />

      <Link
        href="/core"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft size={16} />
        7 Core
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <CoreIcon name={core.icon} size={28} />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {core.name}
          </h1>
          <p className="mt-1 text-zinc-500">{core.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-400">PIC</span>
            {core.pic.map((pic) => (
              <span
                key={pic}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-600"
              >
                {pic}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Programs
        </h2>

        {programs.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">No programs yet.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {programs.map((program) => (
              <Link
                key={program.slug}
                href={`/core/${core.id}/${program.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition-all hover:border-rose-200 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  {program.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={program.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-rose-300">
                      <CoreIcon name={core.icon} size={18} />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-800">
                    {program.name}
                  </p>
                  {program.description && (
                    <p className="line-clamp-1 text-xs text-zinc-500">
                      {program.description}
                    </p>
                  )}
                </div>
                <ChevronRight
                  size={18}
                  className="shrink-0 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-rose-600"
                />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
