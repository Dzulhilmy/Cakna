"use client";

import type { SiteContent, LabeledText, Stat } from "@/lib/site";
import PublicShell from "@/components/public/PublicShell";
import AboutPageBody from "@/components/public/AboutPageBody";
import EditorShell from "./EditorShell";
import SectionsEditor from "@/components/admin/site/SectionsEditor";
import {
  Card,
  Text,
  Area,
  CtaFields,
  BgImageFields,
  ListEditor,
  inputCls,
} from "./fields";

export default function AboutEditor({ initial }: { initial: SiteContent }) {
  return (
    <EditorShell
      initial={initial}
      title="About Us"
      description="Edit the About Us page."
      renderForm={(draft, setDraft) => {
        const p = draft.aboutPage;
        const set = (patch: Partial<SiteContent["aboutPage"]>) =>
          setDraft((d) => ({
            ...d,
            aboutPage: { ...d.aboutPage, ...patch },
          }));

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
              <BgImageFields
                label="Hero background images (slides when multiple)"
                images={p.heroBgImages ?? []}
                overlay={p.heroOverlay}
                onImages={(v) => set({ heroBgImages: v })}
                onOverlay={(v) => set({ heroOverlay: v })}
              />
            </Card>

            <Card title="Who Are We">
              <Text
                label="Section title"
                value={p.whoTitle}
                onChange={(v) => set({ whoTitle: v })}
              />
              <Area
                label="Body (separate paragraphs with a blank line)"
                value={p.whoBody}
                onChange={(v) => set({ whoBody: v })}
                rows={7}
              />
              <Text
                label="Vision title"
                value={p.visionTitle}
                onChange={(v) => set({ visionTitle: v })}
              />
              <Area
                label="Vision text"
                value={p.visionText}
                onChange={(v) => set({ visionText: v })}
                rows={4}
              />
            </Card>

            <Card title="Our Purpose">
              <Text
                label="Eyebrow"
                value={p.purposeEyebrow}
                onChange={(v) => set({ purposeEyebrow: v })}
              />
              <Text
                label="Title"
                value={p.purposeTitle}
                onChange={(v) => set({ purposeTitle: v })}
              />
              <Area
                label="Subtitle"
                value={p.purposeSubtitle}
                onChange={(v) => set({ purposeSubtitle: v })}
                rows={2}
              />
              <ListEditor<LabeledText>
                label="Purpose items"
                items={p.purpose}
                onChange={(items) => set({ purpose: items })}
                empty={{ title: "", desc: "" }}
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
                    <input
                      className={inputCls}
                      placeholder="Description"
                      value={item.desc}
                      onChange={(e) =>
                        update({ ...item, desc: e.target.value })
                      }
                    />
                  </div>
                )}
              />
            </Card>

            <Card title="Nationwide Collaboration">
              <Text
                label="Eyebrow"
                value={p.collabEyebrow}
                onChange={(v) => set({ collabEyebrow: v })}
              />
              <Text
                label="Title"
                value={p.collabTitle}
                onChange={(v) => set({ collabTitle: v })}
              />
              <Area
                label="Subtitle"
                value={p.collabSubtitle}
                onChange={(v) => set({ collabSubtitle: v })}
                rows={3}
              />
              <ListEditor<Stat>
                label="Stats"
                items={p.stats}
                onChange={(items) => set({ stats: items })}
                empty={{ value: "", label: "" }}
                render={(item, update) => (
                  <div className="space-y-2">
                    <input
                      className={inputCls}
                      placeholder="Value (e.g. 200+)"
                      value={item.value}
                      onChange={(e) =>
                        update({ ...item, value: e.target.value })
                      }
                    />
                    <input
                      className={inputCls}
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) =>
                        update({ ...item, label: e.target.value })
                      }
                    />
                  </div>
                )}
              />
              <Area
                label="Testimonial"
                value={p.testimonial}
                onChange={(v) => set({ testimonial: v })}
                rows={4}
              />
              <Text
                label="Testimonial author"
                value={p.testimonialAuthor}
                onChange={(v) => set({ testimonialAuthor: v })}
              />
            </Card>

            <Card title="Call to Action">
              <Text
                label="Heading"
                value={p.ctaHeading}
                onChange={(v) => set({ ctaHeading: v })}
              />
              <Area
                label="Text"
                value={p.ctaText}
                onChange={(v) => set({ ctaText: v })}
                rows={3}
              />
              <BgImageFields
                label="Background images (slides when multiple)"
                images={p.ctaBgImages ?? []}
                overlay={p.ctaOverlay}
                onImages={(v) => set({ ctaBgImages: v })}
                onOverlay={(v) => set({ ctaOverlay: v })}
              />
              <CtaFields
                label="Button"
                value={{ label: p.ctaLabel, href: p.ctaHref }}
                onChange={(v) => set({ ctaLabel: v.label, ctaHref: v.href })}
              />
            </Card>

            <SectionsEditor
              sections={draft.customSections.about}
              onChange={(secs) =>
                setDraft((d) => ({
                  ...d,
                  customSections: { ...d.customSections, about: secs },
                }))
              }
            />
          </>
        );
      }}
      renderPreview={(draft) => (
        <PublicShell content={draft}>
          <AboutPageBody content={draft} />
        </PublicShell>
      )}
    />
  );
}
