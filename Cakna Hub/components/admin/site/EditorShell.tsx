"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import type { SiteContent } from "@/lib/site";

export default function EditorShell({
  initial,
  title,
  description,
  renderForm,
  renderPreview,
}: {
  initial: SiteContent;
  title: string;
  description: string;
  renderForm: (
    draft: SiteContent,
    setDraft: (updater: (d: SiteContent) => SiteContent) => void,
  ) => React.ReactNode;
  renderPreview: (draft: SiteContent) => React.ReactNode;
}) {
  const [draft, setDraft] = useState<SiteContent>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  function update(updater: (d: SiteContent) => SiteContent) {
    setDraft(updater);
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Failed to save.");
      }
      setStatus("saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error.");
      setStatus("error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mx-6 -mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white/90 px-6 py-3 backdrop-blur md:-mt-10">
        <div>
          <Link
            href="/admin/site"
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900"
          >
            <ArrowLeft size={13} />
            All sections
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            {title}
          </h1>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {status === "saved" && (
            <span className="text-sm font-medium text-emerald-600">Saved ✓</span>
          )}
          {status === "error" && (
            <span className="text-sm text-red-600">{error}</span>
          )}
          <button
            type="button"
            onClick={() => {
              setDraft(initial);
              setStatus("idle");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            <RotateCcw size={15} />
            Reset
          </button>
          <button
            type="button"
            onClick={save}
            disabled={status === "saving"}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
          >
            <Save size={15} />
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">{renderForm(draft, update)}</div>
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-500">Live preview</p>
          <div className="sticky top-24 overflow-hidden rounded-xl border border-zinc-200 shadow-sm">
            <div className="max-h-[76vh] overflow-y-auto">
              <div className="pointer-events-none">{renderPreview(draft)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
