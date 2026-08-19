"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CLUSTERS } from "@/lib/society";
import { Field, TextArea, FormSection } from "@/components/society/FormControls";

export default function FundingForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/funding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to submit application.");
      }
      const data = await res.json();
      // Go straight to the auto-generated report document for this application.
      router.push(`/society/funding/${data.application.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormSection n={1} title="Branch Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Branch" name="cawangan" required />
          <Field label="Franchisee Name" name="namaFrancaisi" />
        </div>
        <TextArea
          label="Committee / Individuals Involved"
          name="ajk"
          rows={2}
        />
      </FormSection>

      <FormSection n={2} title="Core & Program Information">
        <div>
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Applicable Core<span className="text-rose-600"> *</span>
          </span>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {CLUSTERS.map((c) => (
              <label key={c.id} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="kluster"
                  value={c.id}
                  required
                  className="peer sr-only"
                />
                <div className="h-full rounded-xl border border-zinc-200 bg-white p-3 transition-colors peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-focus-visible:ring-2 peer-focus-visible:ring-rose-500 peer-focus-visible:ring-offset-2">
                  <p className="text-sm font-semibold text-zinc-900">
                    {c.label}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">{c.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <Field label="Program / Activity Name" name="namaProgram" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" name="tarikh" type="date" required />
          <Field label="Location / Venue" name="lokasi" />
        </div>
        <TextArea
          label="Brief Activity Description"
          name="penerangan"
          rows={3}
        />
      </FormSection>

      <FormSection n={3} title="Beneficiaries">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Number of Participants / Attendance"
            name="jumlahPeserta"
            placeholder="e.g. 120 families"
          />
          <Field label="Beneficiary Category" name="kategoriPenerima" />
        </div>
        <Field label="Community / Area / Party Name" name="namaKomuniti" />
      </FormSection>

      <FormSection n={4} title="Expenditure & Funding Source">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Total Overall Expenditure (RM)"
            name="jumlahPerbelanjaan"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 8600"
            required
          />
          <Field
            label="Funding Source"
            name="sumberDana"
            placeholder="e.g. Cakna Welfare Fund"
          />
        </div>
      </FormSection>

      <FormSection n={5} title="Photo Documentation">
        <Field
          label="Photo Folder Link (Google Drive / Telegram / etc.)"
          name="pautanGambar"
          type="url"
          placeholder="https://drive.google.com/drive/folders/..."
        />
        <p className="text-xs text-zinc-400">
          Attach at least 5 activity photos in the folder.
        </p>
      </FormSection>

      <FormSection n={6} title="Review & Certification">
        <TextArea label="Program Impact / Achievements" name="impak" rows={3} />
        <TextArea label="Suggestions / Notes" name="cadangan" rows={2} />
      </FormSection>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <Link
          href="/society/funding"
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-lg bg-rose-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting…" : "Submit application"}
        </button>
      </div>
    </form>
  );
}
