"use client";

import { useEffect, useState } from "react";
import { X, ImageIcon } from "lucide-react";
import type { MediaItem } from "@/lib/media-store";

/** Modal that lists the media library and returns the chosen image URL. */
export default function MediaPicker({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/site/media")
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!active) return;
        if (ok) setItems(d.items ?? []);
        else setError(d.error ?? "Could not load images.");
      })
      .catch(() => {
        if (active) setError("Could not load images.");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Choose an image"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
          <h3 className="text-sm font-semibold text-zinc-900">Media library</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {items === null && !error && (
            <p className="text-sm text-zinc-400">Loading…</p>
          )}
          {items !== null && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <ImageIcon className="text-zinc-300" size={28} />
              <p className="mt-3 text-sm text-zinc-500">
                No images yet. Upload some in the Media library first.
              </p>
            </div>
          )}
          {items && items.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onSelect(item.url)}
                  title={item.name}
                  className="overflow-hidden rounded-lg border border-zinc-200 transition-colors hover:border-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <span className="block aspect-video overflow-hidden bg-zinc-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="block truncate px-2 py-1 text-left text-[11px] text-zinc-500">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
