"use client";

import { useEffect, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import type { Story } from "@/lib/site";

export default function CsrStories({ stories }: { stories: Story[] }) {
  const [open, setOpen] = useState<Story | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(s)}
            className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left transition-all hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200">
              {s.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.cover}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-rose-500">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {s.category}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <CalendarDays size={13} />
                {s.date}
              </div>
              <h2 className="mt-2 text-base font-semibold leading-snug text-zinc-900">
                {s.title}
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600">
                {s.excerpt}
              </p>
              <span className="mt-4 text-sm font-semibold text-rose-700">
                Read more →
              </span>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(null)}
          />
          <div className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 rounded-lg bg-white/80 p-1.5 text-zinc-600 backdrop-blur transition-colors hover:text-zinc-900"
            >
              <X size={18} />
            </button>
            <div className="overflow-y-auto">
              {open.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={open.cover}
                  alt=""
                  className="aspect-[16/9] w-full object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="rounded bg-rose-50 px-1.5 py-0.5 font-semibold uppercase tracking-wide text-rose-600">
                    {open.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={12} />
                    {open.date}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900">
                  {open.title}
                </h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-zinc-600">
                  {open.excerpt}
                </p>
                {open.images && open.images.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Gallery
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {open.images.map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="aspect-square w-full rounded-lg border border-zinc-200 object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
