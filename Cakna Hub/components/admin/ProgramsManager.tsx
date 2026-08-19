"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, ImageIcon } from "lucide-react";
import { cores } from "@/lib/cores";
import { CoreIcon } from "@/components/CoreIcon";
import { ImageField, inputCls } from "@/components/admin/site/fields";
import type { Program } from "@/lib/programs-store";

type Draft = {
  id: string | null;
  coreId: string;
  name: string;
  description: string;
  image: string;
};

const emptyDraft = (coreId: string): Draft => ({
  id: null,
  coreId,
  name: "",
  description: "",
  image: "",
});

export default function ProgramsManager({
  initialPrograms,
}: {
  initialPrograms: Program[];
}) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function openNew(coreId?: string) {
    setError("");
    setDraft(emptyDraft(coreId ?? cores[0].id));
  }
  function openEdit(p: Program) {
    setError("");
    setDraft({
      id: p.id,
      coreId: p.coreId,
      name: p.name,
      description: p.description,
      image: p.image,
    });
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setError("");
    const isEdit = !!draft.id;
    try {
      const res = await fetch("/api/programs", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draft.id,
          coreId: draft.coreId,
          name: draft.name,
          description: draft.description,
          image: draft.image,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save program.");
      const saved: Program = data.program;
      setPrograms((prev) =>
        isEdit ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved],
      );
      setDraft(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(p: Program) {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    setError("");
    try {
      const res = await fetch("/api/programs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Delete failed.");
      }
      setPrograms((prev) => prev.filter((x) => x.id !== p.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          {programs.length} program{programs.length === 1 ? "" : "s"} across{" "}
          {cores.length} cores
        </p>
        <button
          type="button"
          onClick={() => openNew()}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
        >
          <Plus size={15} />
          Add program
        </button>
      </div>

      {error && !draft && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-7">
        {cores.map((core) => {
          const list = programs.filter((p) => p.coreId === core.id);
          return (
            <section key={core.id}>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <CoreIcon name={core.icon} size={16} />
                </span>
                <h2 className="font-semibold text-zinc-900">{core.name}</h2>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                  {list.length}
                </span>
                <button
                  type="button"
                  onClick={() => openNew(core.id)}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
                >
                  <Plus size={13} />
                  Add
                </button>
              </div>

              {list.length === 0 ? (
                <p className="mt-2 pl-10 text-sm text-zinc-400">
                  No programs yet.
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {list.map((p) => (
                    <div
                      key={p.id}
                      className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-zinc-300">
                            <ImageIcon size={18} />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {p.name}
                        </p>
                        <p className="line-clamp-2 text-xs text-zinc-500">
                          {p.description || "No description yet."}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          aria-label={`Edit ${p.name}`}
                          className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 transition-colors hover:border-rose-300 hover:text-rose-700"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(p)}
                          aria-label={`Delete ${p.name}`}
                          className="rounded-lg border border-zinc-200 p-1.5 text-zinc-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {draft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={draft.id ? "Edit program" : "New program"}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !busy && setDraft(null)}
          />
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-900">
                {draft.id ? "Edit program" : "New program"}
              </h3>
              <button
                type="button"
                onClick={() => setDraft(null)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-600">
                  Core
                </span>
                <select
                  value={draft.coreId}
                  onChange={(e) => setDraft({ ...draft, coreId: e.target.value })}
                  className={inputCls}
                >
                  {cores.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.tagline}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-600">
                  Program name
                </span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. A Million Smiles"
                  className={inputCls}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-600">
                  Description
                </span>
                <textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                  rows={4}
                  placeholder="What is this program about?"
                  className={inputCls}
                />
              </label>

              <ImageField
                label="Cover image"
                value={draft.image}
                onChange={(v) => setDraft({ ...draft, image: v })}
              />

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save program"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
