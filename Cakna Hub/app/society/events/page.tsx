import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  CalendarDays,
  ImageOff,
  Building2,
  Users,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { getEvents } from "@/lib/society-store";
import { clusterLabel } from "@/lib/society";

export const metadata: Metadata = {
  title: "Event Records · Cakna Hub",
};

export const dynamic = "force-dynamic";

export default async function EventsListPage() {
  const events = await getEvents();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <SiteHeader showBack />

      <Link
        href="/society"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft size={16} />
        Society &amp; Others
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Event Records
          </h1>
          <p className="mt-1.5 text-zinc-500">
            Events documented for the record — details and photos, no funding.
          </p>
        </div>
        <Link
          href="/society/events/new"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          <Plus size={16} />
          Add event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-6 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <CalendarDays size={26} strokeWidth={1.75} />
          </span>
          <h2 className="mt-5 text-lg font-medium text-zinc-700">
            No events yet
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
            Add an event with its details and photos to get started.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <Link
              key={ev.id}
              href={`/society/events/${ev.id}`}
              className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-100">
                {ev.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ev.images[0]}
                    alt=""
                    className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-300">
                    <ImageOff size={28} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  {ev.kluster ? (
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      {clusterLabel(ev.kluster)}
                    </span>
                  ) : (
                    <span />
                  )}
                  {ev.images.length > 1 && (
                    <span className="text-xs text-zinc-400">
                      {ev.images.length} photos
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 font-semibold text-zinc-900">
                  {ev.title}
                </h3>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {[ev.tarikh, ev.lokasi].filter(Boolean).join(" · ")}
                </p>
                {(ev.anjuran || ev.jumlahPeserta) && (
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-zinc-500">
                    {ev.anjuran && (
                      <span className="inline-flex items-center gap-1">
                        <Building2 size={12} className="text-zinc-400" />
                        {ev.anjuran}
                      </span>
                    )}
                    {ev.jumlahPeserta && (
                      <span className="inline-flex items-center gap-1">
                        <Users size={12} className="text-zinc-400" />
                        {ev.jumlahPeserta}
                      </span>
                    )}
                  </div>
                )}
                {ev.penerangan && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                    {ev.penerangan}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
