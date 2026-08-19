"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePlus } from "lucide-react";
import { CLUSTERS } from "@/lib/society";
import {
  Field,
  TextArea,
  Select,
  FormSection,
} from "@/components/society/FormControls";

export default function EventForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save event.");
      }
      const data = await res.json();
      router.push(`/society/events/${data.event.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormSection title="Event Information">
        <Field label="Event Name" name="title" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" name="tarikh" type="date" required />
          <Field label="Location / Venue" name="lokasi" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Core (optional)" name="kluster" defaultValue="">
            <option value="">— None —</option>
            {CLUSTERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
          <Field
            label="Total Participants"
            name="jumlahPeserta"
            placeholder="e.g. 85"
          />
        </div>
        <Field
          label="Organiser"
          name="anjuran"
          placeholder="e.g. Cakna Hub x Local residents"
        />
        <TextArea
          label="Event Details / Description"
          name="penerangan"
          rows={4}
        />
      </FormSection>

      <FormSection title="Event Photos">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">
            Upload photos
          </span>
          <div className="flex items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center transition-colors hover:border-rose-300">
            <div>
              <ImagePlus size={24} className="mx-auto text-zinc-400" />
              <p className="mt-2 text-sm font-medium text-zinc-600">
                Choose photos to upload
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">
                JPG, PNG, WebP or GIF · max 5MB each
              </p>
              <input
                type="file"
                name="images"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                onChange={onFilesChange}
                className="mt-3 block w-full text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-rose-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-rose-700"
              />
            </div>
          </div>
        </label>

        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Preview ${i + 1}`}
                className="aspect-square w-full rounded-lg border border-zinc-200 object-cover"
              />
            ))}
          </div>
        )}
      </FormSection>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <Link
          href="/society/events"
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-lg bg-rose-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Saving…" : "Save event"}
        </button>
      </div>
    </form>
  );
}
