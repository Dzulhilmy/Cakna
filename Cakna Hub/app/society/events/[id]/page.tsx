import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users, Building2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { getEventById } from "@/lib/society-store";
import { clusterLabel } from "@/lib/society";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ev = await getEventById(id);
  return { title: ev ? `${ev.title} · Cakna Hub` : "Event · Cakna Hub" };
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const v = (value ?? "").trim();
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-medium text-zinc-800">
          {v || <span className="text-zinc-300">—</span>}
        </p>
      </div>
    </div>
  );
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ev = await getEventById(id);
  if (!ev) notFound();

  const [cover, ...rest] = ev.images;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <SiteHeader showBack />

      <Link
        href="/society/events"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft size={16} />
        Event Records
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {ev.kluster && (
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
              {clusterLabel(ev.kluster)}
            </span>
          )}
          {ev.images.length > 0 && (
            <span className="text-xs text-zinc-400">
              {ev.images.length} photos
            </span>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
          {ev.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {[ev.tarikh, ev.lokasi].filter(Boolean).join(" · ")}
        </p>
      </header>

      {/* Key facts */}
      <section className="mt-6 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:grid-cols-2">
        <Fact icon={<CalendarDays size={16} />} label="Date" value={ev.tarikh} />
        <Fact icon={<MapPin size={16} />} label="Location / Venue" value={ev.lokasi} />
        <Fact icon={<Building2 size={16} />} label="Organiser" value={ev.anjuran} />
        <Fact
          icon={<Users size={16} />}
          label="Total Participants"
          value={ev.jumlahPeserta}
        />
      </section>

      {/* Description */}
      {ev.penerangan?.trim() && (
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Programme Details
          </h2>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-700">
            {ev.penerangan}
          </p>
        </section>
      )}

      {/* Gallery */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Photo Gallery
        </h2>
        {ev.images.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-6 py-12 text-center text-sm text-zinc-500">
            No photos attached.
          </p>
        ) : (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={ev.title}
              className="aspect-[16/9] w-full rounded-2xl border border-zinc-200 object-cover"
            />
            {rest.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {rest.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${ev.title} — photo ${i + 2}`}
                    className="aspect-[4/3] w-full rounded-xl border border-zinc-200 object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <p className="mt-8 border-t border-zinc-100 pt-4 text-xs text-zinc-400">
        Recorded: {ev.createdAt.slice(0, 10)}
        {ev.submittedBy ? ` · by ${ev.submittedBy.name}` : ""}
      </p>
    </main>
  );
}
