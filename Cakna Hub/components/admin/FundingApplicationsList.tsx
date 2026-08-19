"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, FileText } from "lucide-react";
import StatusBadge from "@/components/society/StatusBadge";
import {
  clusterLabel,
  stageForStatus,
  canActOnStage,
  STAGE_LABELS,
  normalizeStatus,
  type FundingApplication,
} from "@/lib/society";
import { formatRM } from "@/lib/format";

export default function FundingApplicationsList({
  applications,
  role,
}: {
  applications: FundingApplication[];
  role: string;
}) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function submitReview(
    id: string,
    decision: "approved" | "needs_revision",
  ) {
    setBusyId(id);
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
      setOpenId(null);
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setBusyId(null);
    }
  }

  if (applications.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        No funding applications yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {applications.map((a) => {
        const stage = stageForStatus(a.status);
        const canAct = !!stage && canActOnStage(role, stage);
        const open = openId === a.id;
        return (
          <div
            key={a.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium tabular-nums text-zinc-400">
                {a.reference}
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                  {clusterLabel(a.kluster)}
                </span>
                <StatusBadge status={normalizeStatus(a.status)} />
              </div>
            </div>

            <h3 className="mt-1 text-base font-semibold text-zinc-900">
              {a.namaProgram}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-500">
              {[a.cawangan, a.lokasi, a.tarikh].filter(Boolean).join(" · ")}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span className="text-zinc-500">
                Expenditure:{" "}
                <span className="font-medium text-zinc-800">
                  {formatRM(a.jumlahPerbelanjaan)}
                </span>
              </span>
              {a.submittedBy && (
                <span className="text-zinc-500">
                  Submitted by:{" "}
                  <span className="font-medium text-zinc-800">
                    {a.submittedBy.name}
                  </span>
                </span>
              )}
            </div>

            <Link
              href={`/society/funding/${a.id}`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700"
            >
              <FileText size={14} />
              View full document
            </Link>

            {a.reviewedBy && (
              <p className="mt-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
                Reviewed by{" "}
                <span className="font-medium text-zinc-700">
                  {a.reviewedBy.name}
                </span>
                {a.reviewedAt ? ` · ${a.reviewedAt.slice(0, 10)}` : ""}
                {a.reviewNote ? (
                  <span className="mt-1 block italic text-zinc-600">
                    “{a.reviewNote}”
                  </span>
                ) : null}
              </p>
            )}

            {canAct && stage && (
              <div className="mt-4 border-t border-zinc-100 pt-4">
                {open ? (
                  <div className="space-y-3">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      placeholder="Review notes (optional to approve, recommended for revision)…"
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => submitReview(a.id, "approved")}
                        disabled={busyId === a.id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
                      >
                        <CheckCircle2 size={15} />
                        Approve
                      </button>
                      <button
                        onClick={() => submitReview(a.id, "needs_revision")}
                        disabled={busyId === a.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60"
                      >
                        <RotateCcw size={15} />
                        Needs revision
                      </button>
                      <button
                        onClick={() => {
                          setOpenId(null);
                          setNote("");
                        }}
                        className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setOpenId(a.id);
                      setNote(a.reviewNote ?? "");
                      setError("");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-rose-300 hover:text-rose-700"
                  >
                    Review application{stage ? ` — ${STAGE_LABELS[stage]}` : ""}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
