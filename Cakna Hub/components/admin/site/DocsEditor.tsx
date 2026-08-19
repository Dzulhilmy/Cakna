"use client";

import type { SiteContent, DocPage } from "@/lib/site";
import EditorShell from "@/components/admin/site/EditorShell";
import { Card, Text, Area } from "@/components/admin/site/fields";
import PublicShell from "@/components/public/PublicShell";

const DOC_KEYS: { key: keyof SiteContent["docs"]; label: string }[] = [
  { key: "policy", label: "Polisi" },
  { key: "sop", label: "SOP" },
  { key: "guidelines", label: "Garis Panduan" },
  { key: "manual", label: "Manual" },
];

export default function DocsEditor({ initial }: { initial: SiteContent }) {
  return (
    <EditorShell
      initial={initial}
      title="Polisi, SOP & Panduan"
      description="Kandungan halaman dokumen rasmi HOME CAKNA."
      renderForm={(draft, setDraft) => {
        const set = (key: keyof SiteContent["docs"], patch: Partial<DocPage>) =>
          setDraft((d) => ({
            ...d,
            docs: { ...d.docs, [key]: { ...d.docs[key], ...patch } },
          }));

        return (
          <>
            {DOC_KEYS.map(({ key, label }) => (
              <Card key={key} title={label}>
                <Text
                  label="Tajuk"
                  value={draft.docs[key].title}
                  onChange={(v) => set(key, { title: v })}
                />
                <Text
                  label="Subtitle"
                  value={draft.docs[key].subtitle}
                  onChange={(v) => set(key, { subtitle: v })}
                />
                <Area
                  label="Kandungan (paragraf dipisahkan oleh baris kosong)"
                  rows={8}
                  value={draft.docs[key].content}
                  onChange={(v) => set(key, { content: v })}
                />
                <Text
                  label="Tarikh dikemaskini"
                  value={draft.docs[key].lastUpdated}
                  onChange={(v) => set(key, { lastUpdated: v })}
                  placeholder="contoh: Jan 2026"
                />
              </Card>
            ))}
          </>
        );
      }}
      renderPreview={(draft) => <PublicShell content={draft}><div className="py-20 text-center text-zinc-400">Lihat pratonton di /docs/policy</div></PublicShell>}
    />
  );
}
