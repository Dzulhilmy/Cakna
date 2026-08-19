import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-store";
import PublicShell from "@/components/public/PublicShell";

export const dynamic = "force-dynamic";

const VALID_SLUGS = ["policy", "sop", "guidelines", "manual"] as const;
type DocSlug = (typeof VALID_SLUGS)[number];

const LABELS: Record<DocSlug, string> = {
  policy: "Polisi",
  sop: "SOP",
  guidelines: "Garis Panduan",
  manual: "Manual",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!VALID_SLUGS.includes(slug as DocSlug)) return {};
  const content = await getSiteContent();
  const doc = content.docs[slug as DocSlug];
  return { title: `${doc.title} · Cakna Hub` };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!VALID_SLUGS.includes(slug as DocSlug)) notFound();

  const content = await getSiteContent();
  const doc = content.docs[slug as DocSlug];
  const paras = doc.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <PublicShell content={content}>
      {/* Hero */}
      <section className="bg-gradient-to-b from-rose-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-rose-700"
          >
            <ArrowLeft size={15} />
            Kembali
          </Link>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
            {LABELS[slug as DocSlug]}
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            {doc.title}
          </h1>
          {doc.subtitle && (
            <p className="mt-4 text-lg text-zinc-600">{doc.subtitle}</p>
          )}
          {doc.lastUpdated && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-zinc-400">
              <CalendarDays size={14} />
              Dikemaskini: {doc.lastUpdated}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-12">
        <div className="prose prose-zinc max-w-none">
          {paras.map((p, i) => (
            <p key={i} className="mt-4 leading-relaxed text-zinc-700 first:mt-0">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-16 border-t border-zinc-100 pt-8">
          <p className="text-sm text-zinc-400">
            Untuk pertanyaan lanjut, sila hubungi pasukan HOME CAKNA.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {VALID_SLUGS.filter((s) => s !== slug).map((s) => (
              <Link
                key={s}
                href={`/docs/${s}`}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-rose-200 hover:text-rose-700"
              >
                {LABELS[s]}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </PublicShell>
  );
}
