"use client";

import type { SiteContent, LabeledText, Stat } from "@/lib/site";
import PublicShell from "@/components/public/PublicShell";
import SetemPageBody from "@/components/public/SetemPageBody";
import EditorShell from "@/components/admin/site/EditorShell";
import SectionsEditor from "@/components/admin/site/SectionsEditor";
import {
  Card,
  Text,
  Area,
  CtaFields,
  BgImageFields,
  ListEditor,
  inputCls,
} from "@/components/admin/site/fields";

export default function SetemEditor({ initial }: { initial: SiteContent }) {
  return (
    <EditorShell
      initial={initial}
      title="SETEM"
      description="Edit the SETEM page."
      renderForm={(draft, setDraft) => {
        const p = draft.setemPage;
        const set = (patch: Partial<SiteContent["setemPage"]>) =>
          setDraft((d) => ({
            ...d,
            setemPage: { ...d.setemPage, ...patch },
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
              <Area
                label="Subtext"
                value={p.subtext}
                onChange={(v) => set({ subtext: v })}
              />
              <BgImageFields
                label="Hero background images (slides when multiple)"
                images={p.heroBgImages ?? []}
                overlay={p.heroOverlay}
                onImages={(v) => set({ heroBgImages: v })}
                onOverlay={(v) => set({ heroOverlay: v })}
              />
            </Card>

            <Card title="The Education Gap">
              <Text
                label="Eyebrow"
                value={p.gapEyebrow}
                onChange={(v) => set({ gapEyebrow: v })}
              />
              <Text
                label="Title"
                value={p.gapTitle}
                onChange={(v) => set({ gapTitle: v })}
              />
              <Area
                label="Subtitle"
                value={p.gapSubtitle}
                onChange={(v) => set({ gapSubtitle: v })}
              />
              <ListEditor<Stat>
                label="Gap stats"
                items={p.gapStats}
                onChange={(items) => set({ gapStats: items })}
                empty={{ value: "", label: "" }}
                render={(item, update) => (
                  <div className="space-y-2">
                    <input
                      className={inputCls}
                      placeholder="Value"
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
            </Card>

            <Card title="What is SETEM">
              <Text
                label="Eyebrow"
                value={p.whatEyebrow}
                onChange={(v) => set({ whatEyebrow: v })}
              />
              <Text
                label="Title"
                value={p.whatTitle}
                onChange={(v) => set({ whatTitle: v })}
              />
              <Area
                label="Body"
                value={p.whatBody}
                onChange={(v) => set({ whatBody: v })}
                rows={4}
              />
              <Text
                label="Expect title"
                value={p.expectTitle}
                onChange={(v) => set({ expectTitle: v })}
              />
              <ListEditor<string>
                label="What to expect"
                items={p.expect}
                onChange={(items) => set({ expect: items })}
                empty=""
                render={(item, update) => (
                  <input
                    className={inputCls}
                    placeholder="Item"
                    value={item}
                    onChange={(e) => update(e.target.value)}
                  />
                )}
              />
            </Card>

            <Card title="Who Should Join">
              <Text
                label="Eyebrow"
                value={p.audienceEyebrow}
                onChange={(v) => set({ audienceEyebrow: v })}
              />
              <Text
                label="Title"
                value={p.audienceTitle}
                onChange={(v) => set({ audienceTitle: v })}
              />
              <ListEditor<LabeledText>
                label="Audience"
                items={p.audience}
                onChange={(items) => set({ audience: items })}
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
                      onChange={(e) => update({ ...item, desc: e.target.value })}
                    />
                  </div>
                )}
              />
            </Card>

            <Card title="Process">
              <Text
                label="Eyebrow"
                value={p.processEyebrow}
                onChange={(v) => set({ processEyebrow: v })}
              />
              <Text
                label="Title"
                value={p.processTitle}
                onChange={(v) => set({ processTitle: v })}
              />
              <ListEditor<LabeledText>
                label="Steps"
                items={p.steps}
                onChange={(items) => set({ steps: items })}
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
                      onChange={(e) => update({ ...item, desc: e.target.value })}
                    />
                  </div>
                )}
              />
            </Card>

            <Card title="Call to action">
              <Text
                label="Heading"
                value={p.ctaHeading}
                onChange={(v) => set({ ctaHeading: v })}
              />
              <Area
                label="Text"
                value={p.ctaText}
                onChange={(v) => set({ ctaText: v })}
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
              sections={draft.customSections.setem}
              onChange={(secs) =>
                setDraft((d) => ({
                  ...d,
                  customSections: { ...d.customSections, setem: secs },
                }))
              }
            />
          </>
        );
      }}
      renderPreview={(draft) => (
        <PublicShell content={draft}>
          <SetemPageBody content={draft} />
        </PublicShell>
      )}
    />
  );
}
