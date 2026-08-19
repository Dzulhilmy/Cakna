import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { CoreIcon } from "@/components/CoreIcon";
import { resolveProgram } from "@/lib/programs-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ coreId: string; program: string }>;
}): Promise<Metadata> {
  const { coreId, program } = await params;
  const found = await resolveProgram(coreId, program);
  return { title: found ? `${found.program.name} · Cakna Hub` : "Cakna Hub" };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ coreId: string; program: string }>;
}) {
  const { coreId, program } = await params;
  const found = await resolveProgram(coreId, program);
  if (!found) notFound();
  const { core, program: prog } = found;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <SiteHeader showBack />

      <Link
        href={`/core/${core.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft size={16} />
        {core.name}
      </Link>

      <div className="mt-6 flex items-center gap-2 text-xs text-zinc-400">
        <CoreIcon name={core.icon} size={14} />
        <span>
          {core.name} · {core.tagline}
        </span>
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
        {prog.name}
      </h1>

      {prog.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={prog.image}
          alt={prog.name}
          className="mt-6 aspect-[16/9] w-full rounded-2xl border border-zinc-200 object-cover"
        />
      )}

      {prog.description ? (
        <div className="mt-6 whitespace-pre-line leading-relaxed text-zinc-700">
          {prog.description}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <CoreIcon name={core.icon} size={28} />
          </span>
          <p className="mt-4 max-w-sm text-sm text-zinc-500">
            No details have been added for this program yet.
          </p>
        </div>
      )}
    </main>
  );
}
