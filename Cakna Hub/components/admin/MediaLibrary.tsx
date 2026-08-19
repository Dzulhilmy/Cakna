"use client";

import { useRef, useState } from "react";
import { Upload, Copy, Check, Trash2, ImageIcon } from "lucide-react";
import type { MediaItem } from "@/lib/media-store";

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Admin media library — upload, browse, copy URLs, and delete site images. */
export default function MediaLibrary({
  initialItems,
}: {
  initialItems: MediaItem[];
}) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    try {
      const res = await fetch("/api/site/media");
      const data = await res.json();
      if (res.ok) setItems(data.items ?? []);
    } catch {
      /* keep current list */
    }
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("/api/site/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error ?? `Failed to upload ${file.name}.`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      // Always refresh so any files that DID upload appear, even on a
      // partial failure — avoids a stale grid and duplicate re-uploads.
      await refresh();
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function copy(url: string, name: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(name);
      setTimeout(() => setCopied((c) => (c === name ? null : c)), 1500);
    } catch {
      setError("Couldn't copy to clipboard.");
    }
  }

  async function remove(item: MediaItem) {
    if (!confirm(`Delete "${item.name}"? This can't be undone.`)) return;
    setError("");
    try {
      const res = await fetch("/api/site/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: item.name }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Could not delete image.");
      }
      setItems((prev) => prev.filter((i) => i.name !== item.name));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          {items.length} image{items.length === 1 ? "" : "s"}
        </p>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700">
          <Upload size={15} />
          {busy ? "Uploading…" : "Upload images"}
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={onFiles}
            disabled={busy}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-6 py-20 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <ImageIcon size={24} />
          </span>
          <p className="mt-4 text-sm text-zinc-500">
            No images yet. Upload your first image to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="aspect-video overflow-hidden bg-zinc-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="p-3">
                <p
                  className="truncate text-xs font-medium text-zinc-700"
                  title={item.name}
                >
                  {item.name}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-400">
                  {fmtSize(item.size)}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => copy(item.url, item.name)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-rose-300 hover:text-rose-700"
                  >
                    {copied === item.name ? (
                      <Check size={13} />
                    ) : (
                      <Copy size={13} />
                    )}
                    {copied === item.name ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    aria-label={`Delete ${item.name}`}
                    className="rounded-lg border border-zinc-200 p-1.5 text-zinc-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
