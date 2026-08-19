"use client";

import PublicShell from "@/components/public/PublicShell";
import type { SiteContent } from "@/lib/site";
import EditorShell from "@/components/admin/site/EditorShell";
import { Card, Text, Area } from "@/components/admin/site/fields";

export default function ContactEditor({ initial }: { initial: SiteContent }) {
  return (
    <EditorShell
      initial={initial}
      title="Contact & Footer"
      description="Footer contact details."
      renderForm={(draft, setDraft) => {
        const f = draft.footer;
        const set = (patch: Partial<SiteContent["footer"]>) =>
          setDraft((d) => ({ ...d, footer: { ...d.footer, ...patch } }));
        return (
          <Card title="Footer">
            <Area
              label="Tagline"
              value={f.tagline}
              onChange={(v) => set({ tagline: v })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Text
                label="Phone"
                value={f.phone}
                onChange={(v) => set({ phone: v })}
              />
              <Text
                label="Email"
                value={f.email}
                onChange={(v) => set({ email: v })}
              />
            </div>
            <Text
              label="Copyright"
              value={f.copyright}
              onChange={(v) => set({ copyright: v })}
            />
          </Card>
        );
      }}
      renderPreview={(draft) => (
        <PublicShell content={draft}>
          <div className="p-16 text-center text-sm text-zinc-400">
            Scroll down to preview the footer ↓
          </div>
        </PublicShell>
      )}
    />
  );
}
