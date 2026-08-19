"use client";

import type { SiteContent, Story } from "@/lib/site";
import PublicShell from "@/components/public/PublicShell";
import CsrPageBody from "@/components/public/CsrPageBody";
import EditorShell from "@/components/admin/site/EditorShell";
import SectionsEditor from "@/components/admin/site/SectionsEditor";
import {
  Card,
  Text,
  Area,
  CtaFields,
  BgImageFields,
  ImageField,
  MultiImageField,
  ListEditor,
  inputCls,
} from "@/components/admin/site/fields";

export default function CsrEditor({ initial }: { initial: SiteContent }) {
  return (
    <EditorShell
      initial={initial}
      title="CSR Stories"
      description="Edit the CSR Stories page."
      renderForm={(draft, setDraft) => {
        const p = draft.csrPage;
        const set = (patch: Partial<SiteContent["csrPage"]>) =>
          setDraft((d) => ({ ...d, csrPage: { ...d.csrPage, ...patch } }));

        return (
          <>
            <Card title="Hero">
              <Text
                label="Eyebrow"
                value={p.eyebrow}
                onChange={(v) => set({ eyebrow: v })}
              />
              <Text
                label="Heading"
                value={p.heading}
                onChange={(v) => set({ heading: v })}
              />
              <Area
                label="Subtext"
                value={p.subtext}
                onChange={(v) => set({ subtext: v })}
                rows={3}
              />
              <BgImageFields
                label="Hero background images (slides when multiple)"
                images={p.heroBgImages ?? []}
                overlay={p.heroOverlay}
                onImages={(v) => set({ heroBgImages: v })}
                onOverlay={(v) => set({ heroOverlay: v })}
              />
            </Card>

            <Card title="Stories">
              <ListEditor<Story>
                label="Stories"
                items={p.stories}
                onChange={(items) => set({ stories: items })}
                empty={{
                  title: "",
                  date: "",
                  category: "",
                  excerpt: "",
                  cover: "",
                  images: [],
                }}
                render={(item, update) => (
                  <div className="space-y-2">
                    <input
                      className={inputCls}
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) =>
                        update({ ...item, title: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className={inputCls}
                        placeholder="Date"
                        value={item.date}
                        onChange={(e) =>
                          update({ ...item, date: e.target.value })
                        }
                      />
                      <input
                        className={inputCls}
                        placeholder="Category"
                        value={item.category}
                        onChange={(e) =>
                          update({ ...item, category: e.target.value })
                        }
                      />
                    </div>
                    <textarea
                      className={inputCls}
                      rows={3}
                      placeholder="Excerpt"
                      value={item.excerpt}
                      onChange={(e) =>
                        update({ ...item, excerpt: e.target.value })
                      }
                    />
                    <ImageField
                      label="Cover image"
                      value={item.cover ?? ""}
                      onChange={(v) => update({ ...item, cover: v })}
                    />
                    <MultiImageField
                      label="Gallery (shown when the story is opened)"
                      images={item.images ?? []}
                      onChange={(imgs) => update({ ...item, images: imgs })}
                    />
                  </div>
                )}
              />
            </Card>

            <Card title="Call to Action">
              <Text
                label="CTA heading"
                value={p.ctaHeading}
                onChange={(v) => set({ ctaHeading: v })}
              />
              <Area
                label="CTA text"
                value={p.ctaText}
                onChange={(v) => set({ ctaText: v })}
                rows={2}
              />
              <BgImageFields
                label="Background images (slides when multiple)"
                images={p.ctaBgImages ?? []}
                overlay={p.ctaOverlay}
                onImages={(v) => set({ ctaBgImages: v })}
                onOverlay={(v) => set({ ctaOverlay: v })}
              />
              <CtaFields
                label="CTA button"
                value={{ label: p.ctaLabel, href: p.ctaHref }}
                onChange={(v) => set({ ctaLabel: v.label, ctaHref: v.href })}
              />
            </Card>

            <SectionsEditor
              sections={draft.customSections.csr}
              onChange={(secs) =>
                setDraft((d) => ({
                  ...d,
                  customSections: { ...d.customSections, csr: secs },
                }))
              }
            />
          </>
        );
      }}
      renderPreview={(draft) => (
        <PublicShell content={draft}>
          <CsrPageBody content={draft} />
        </PublicShell>
      )}
    />
  );
}
