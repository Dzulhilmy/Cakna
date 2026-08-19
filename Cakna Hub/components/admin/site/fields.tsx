"use client";

import { useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import MediaPicker from "@/components/admin/site/MediaPicker";
import type { OverlayStrength } from "@/lib/site";

export const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30";

export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function Text({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-600">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-600">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

export function CtaFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: { label: string; href: string };
  onChange: (v: { label: string; href: string }) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-zinc-600">
        {label}
      </span>
      <div className="grid grid-cols-2 gap-2">
        <input
          value={value.label}
          placeholder="Button text"
          onChange={(e) => onChange({ ...value, label: e.target.value })}
          className={inputCls}
        />
        <input
          value={value.href}
          placeholder="/register, #program, or URL"
          onChange={(e) => onChange({ ...value, href: e.target.value })}
          className={inputCls}
        />
      </div>
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [picking, setPicking] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/site/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      onChange(data.url);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Upload error.");
    } finally {
      setBusy(false);
      // Reset so re-selecting the same file still fires a change event.
      input.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-zinc-600">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <input
          value={value}
          placeholder="Image URL or upload"
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-rose-300 hover:text-rose-700"
        >
          <ImageIcon size={14} />
          Library
        </button>
        <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:border-rose-300 hover:text-rose-700">
          <Upload size={14} />
          {busy ? "…" : "Upload"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={onFile}
            className="hidden"
          />
        </label>
      </div>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-24 w-full rounded-lg border border-zinc-200 object-cover"
        />
      )}
      {picking && (
        <MediaPicker
          onSelect={(url) => {
            onChange(url);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}

export function BgImageFields({
  label,
  images,
  overlay,
  onImages,
  onOverlay,
}: {
  label: string;
  images: string[];
  overlay: OverlayStrength;
  onImages: (v: string[]) => void;
  onOverlay: (v: OverlayStrength) => void;
}) {
  const has = images.some((img) => img.trim().length > 0);
  return (
    <div className="space-y-2">
      <MultiImageField label={label} images={images} onChange={onImages} />
      {has && (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-600">
            Overlay darkness (keeps text readable)
          </span>
          <select
            value={overlay}
            onChange={(e) => onOverlay(e.target.value as OverlayStrength)}
            className={inputCls}
          >
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      )}
    </div>
  );
}

export function MultiImageField({
  label,
  images,
  onChange,
}: {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [picking, setPicking] = useState(false);
  // Track the latest images so an in-flight upload appends to the current
  // array — not a stale closure — if the admin edits images meanwhile.
  const imagesRef = useRef(images);
  imagesRef.current = images;

  async function uploadFiles(files: File[]) {
    if (!files.length) return;
    setBusy(true);
    setErr("");
    const added: string[] = [];
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("/api/site/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed.");
        added.push(data.url);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload error.");
    } finally {
      if (added.length) onChange([...imagesRef.current, ...added]);
      setBusy(false);
    }
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-zinc-600">
        {label}
      </span>
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <input
                value={url}
                onChange={(e) => {
                  const next = [...images];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                placeholder="Image URL"
                className={inputCls}
              />
              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  aria-label="Move down"
                  className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                aria-label="Remove image"
                className="shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-rose-300 hover:text-rose-700"
        >
          <ImageIcon size={14} />
          Library
        </button>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-rose-300 hover:text-rose-700">
          <Upload size={14} />
          {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              e.currentTarget.value = "";
              uploadFiles(files);
            }}
            className="hidden"
          />
        </label>
      </div>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
      {picking && (
        <MediaPicker
          onSelect={(url) => {
            onChange([...imagesRef.current, url]);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}

export function ListEditor<T>({
  label,
  items,
  onChange,
  render,
  empty,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, update: (v: T) => void) => React.ReactNode;
  empty: T;
}) {
  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-zinc-600">
        {label}
      </span>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              {render(it, (v) => {
                const next = [...items];
                next[i] = v;
                onChange(next);
              })}
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="mt-1 rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Remove"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, empty])}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-rose-300 hover:text-rose-700"
      >
        <Plus size={14} />
        Add
      </button>
    </div>
  );
}
