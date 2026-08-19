"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw } from "lucide-react";

export default function FundingReviewControls({
  id,
  currentNote,
  stageLabel,
}: {
  id: string;
  currentNote?: string;
  stageLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(currentNote ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(decision: "approved" | "needs_revision") {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/funding/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, decision, note }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save review.");
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
      >
        Review &amp; approve{stageLabel ? ` — ${stageLabel}` : ""}
      </button>
    );
  }

  return (
    <div className="w-full max-w-lg space-y-3">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Review notes (recommended for revisions)…"
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => submit("approved")}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
        >
          <CheckCircle2 size={15} />
          Approve
        </button>
        <button
          onClick={() => submit("needs_revision")}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60"
        >
          <RotateCcw size={15} />
          Needs revision
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setError("");
          }}
          className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
