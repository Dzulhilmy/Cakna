"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  inputCls,
  Text,
  Area,
  CtaFields,
  MultiImageField,
} from "@/components/admin/site/fields";
import type { CustomSection, SectionLayout } from "@/lib/site";

const LAYOUTS: { value: SectionLayout; label: string }[] = [
  { value: "text", label: "Text (centered)" },
  { value: "imageText", label: "Image + Text" },
  { value: "gallery", label: "Image gallery" },
];

function newSection(): CustomSection {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `sec-${Date.now()}`,
    layout: "text",
    background: "white",
    eyebrow: "",
    title: "New section",
    body: "",
    images: [],
    ctaLabel: "",
    ctaHref: "",
  };
}

export default function SectionsEditor({
  sections,
  onChange,
}: {
  sections: CustomSection[];
  onChange: (sections: CustomSection[]) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<CustomSection>) =>
    onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  function add() {
    const s = newSection();
    onChange([...sections, s]);
    setOpenId(s.id);
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Custom sections
          </h2>
          <p className="mt-0.5 text-xs text-zinc-400">
            Add your own sections to this page. They render in order, after the
            main content.
          </p>
        </div>
        <button
          type="button"
          onClick={add}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700"
        >
          <Plus size={14} />
          Add section
        </button>
      </div>

      {sections.length === 0 ? (
        <p className="text-sm text-zinc-400">
          No custom sections yet — add one to extend this page.
        </p>
      ) : (
        <div className="space-y-2">
          {sections.map((s, i) => {
            const open = openId === s.id;
            return (
              <div key={s.id} className="rounded-xl border border-zinc-200">
                <div className="flex items-center gap-1 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : s.id)}
                    aria-expanded={open}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <ChevronRight
                      size={15}
                      className={`shrink-0 text-zinc-400 transition-transform ${
                        open ? "rotate-90" : ""
                      }`}
                    />
                    <span className="truncate text-sm font-medium text-zinc-800">
                      {s.title || "Untitled section"}
                    </span>
                    <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-500">
                      {s.layout}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === sections.length - 1}
                    aria-label="Move down"
                    className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                  >
                    <ChevronDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(sections.filter((x) => x.id !== s.id))}
                    aria-label="Delete section"
                    className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {open && (
                  <div className="space-y-3 border-t border-zinc-100 p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block">
                        <span className="mb-1 block text-xs font-medium text-zinc-600">
                          Layout
                        </span>
                        <select
                          value={s.layout}
                          onChange={(e) =>
                            update(s.id, {
                              layout: e.target.value as SectionLayout,
                            })
                          }
                          className={inputCls}
                        >
                          {LAYOUTS.map((l) => (
                            <option key={l.value} value={l.value}>
                              {l.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-xs font-medium text-zinc-600">
                          Background
                        </span>
                        <select
                          value={s.background}
                          onChange={(e) =>
                            update(s.id, {
                              background: e.target.value as "white" | "tint",
                            })
                          }
                          className={inputCls}
                        >
                          <option value="white">White</option>
                          <option value="tint">Soft tint</option>
                        </select>
                      </label>
                    </div>
                    <Text
                      label="Eyebrow (small label)"
                      value={s.eyebrow}
                      onChange={(v) => update(s.id, { eyebrow: v })}
                    />
                    <Text
                      label="Title"
                      value={s.title}
                      onChange={(v) => update(s.id, { title: v })}
                    />
                    <Area
                      label="Body (separate paragraphs with a blank line)"
                      rows={4}
                      value={s.body}
                      onChange={(v) => update(s.id, { body: v })}
                    />
                    <MultiImageField
                      label="Images (one or more)"
                      images={s.images}
                      onChange={(images) => update(s.id, { images })}
                    />
                    <CtaFields
                      label="Button (optional)"
                      value={{ label: s.ctaLabel, href: s.ctaHref }}
                      onChange={(c) =>
                        update(s.id, { ctaLabel: c.label, ctaHref: c.href })
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
