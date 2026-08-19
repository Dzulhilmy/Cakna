"use client";

import PublicLanding from "@/components/public/PublicLanding";
import type { SiteContent, NavLink, Stat } from "@/lib/site";
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

export default function HomeEditor({ initial }: { initial: SiteContent }) {
  return (
    <EditorShell
      initial={initial}
      title="Home Page"
      description="Hero, about, programs, impact & CTA."
      renderForm={(draft, setDraft) => (
        <>
          <Card title="Brand & Navigation">
            <ImageField
              label="Logo image (replaces name text in navbar)"
              value={draft.brand.logoImage ?? ""}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  brand: { ...d.brand, logoImage: v || undefined },
                }))
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <Text
                label="Brand name"
                value={draft.brand.name}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    brand: { ...d.brand, name: v },
                  }))
                }
              />
              <Text
                label="Accent word"
                value={draft.brand.accentWord}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    brand: { ...d.brand, accentWord: v },
                  }))
                }
              />
            </div>
            <ListEditor<NavLink>
              label="Navigation links"
              items={draft.nav}
              onChange={(nav) => setDraft((d) => ({ ...d, nav }))}
              empty={{ label: "", href: "" }}
              render={(item, upd) => (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={item.label}
                    placeholder="Label"
                    onChange={(e) => upd({ ...item, label: e.target.value })}
                    className={inputCls}
                  />
                  <input
                    value={item.href}
                    placeholder="#about or URL"
                    onChange={(e) => upd({ ...item, href: e.target.value })}
                    className={inputCls}
                  />
                </div>
              )}
            />
          </Card>

          <Card title="Hero">
            <Text
              label="Eyebrow"
              value={draft.hero.eyebrow}
              onChange={(v) =>
                setDraft((d) => ({ ...d, hero: { ...d.hero, eyebrow: v } }))
              }
            />
            <Text
              label="Main heading"
              value={draft.hero.heading}
              onChange={(v) =>
                setDraft((d) => ({ ...d, hero: { ...d.hero, heading: v } }))
              }
            />
            <Area
              label="Subtext"
              value={draft.hero.subtext}
              onChange={(v) =>
                setDraft((d) => ({ ...d, hero: { ...d.hero, subtext: v } }))
              }
            />
            <BgImageFields
              label="Background images (slides when multiple)"
              images={draft.hero.bgImages ?? []}
              overlay={draft.hero.overlay}
              onImages={(v) =>
                setDraft((d) => ({ ...d, hero: { ...d.hero, bgImages: v } }))
              }
              onOverlay={(v) =>
                setDraft((d) => ({ ...d, hero: { ...d.hero, overlay: v } }))
              }
            />
            <CtaFields
              label="Primary button"
              value={draft.hero.primaryCta}
              onChange={(c) =>
                setDraft((d) => ({
                  ...d,
                  hero: { ...d.hero, primaryCta: c },
                }))
              }
            />
            <CtaFields
              label="Secondary button"
              value={draft.hero.secondaryCta}
              onChange={(c) =>
                setDraft((d) => ({
                  ...d,
                  hero: { ...d.hero, secondaryCta: c },
                }))
              }
            />
          </Card>

          <Card title="About">
            <Text
              label="Eyebrow"
              value={draft.about.eyebrow}
              onChange={(v) =>
                setDraft((d) => ({ ...d, about: { ...d.about, eyebrow: v } }))
              }
            />
            <Text
              label="Title"
              value={draft.about.title}
              onChange={(v) =>
                setDraft((d) => ({ ...d, about: { ...d.about, title: v } }))
              }
            />
            <Area
              label="Content (separate paragraphs with a blank line)"
              rows={5}
              value={draft.about.body}
              onChange={(v) =>
                setDraft((d) => ({ ...d, about: { ...d.about, body: v } }))
              }
            />
            <Text
              label="Quote"
              value={draft.about.quote}
              onChange={(v) =>
                setDraft((d) => ({ ...d, about: { ...d.about, quote: v } }))
              }
            />
            <Area
              label="Sub-quote"
              value={draft.about.quoteSub}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  about: { ...d.about, quoteSub: v },
                }))
              }
            />
            <BgImageFields
              label="Quote background images (slides when multiple)"
              images={draft.about.quoteBgImages ?? []}
              overlay={draft.about.quoteOverlay}
              onImages={(v) =>
                setDraft((d) => ({
                  ...d,
                  about: { ...d.about, quoteBgImages: v },
                }))
              }
              onOverlay={(v) =>
                setDraft((d) => ({
                  ...d,
                  about: { ...d.about, quoteOverlay: v },
                }))
              }
            />
          </Card>

          <Card title="Programs">
            <Text
              label="Eyebrow"
              value={draft.programs.eyebrow}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  programs: { ...d.programs, eyebrow: v },
                }))
              }
            />
            <Text
              label="Title"
              value={draft.programs.title}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  programs: { ...d.programs, title: v },
                }))
              }
            />
            <Area
              label="Subtitle"
              value={draft.programs.subtitle}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  programs: { ...d.programs, subtitle: v },
                }))
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <Text
                label="Link text"
                value={draft.programs.ctaLabel}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    programs: { ...d.programs, ctaLabel: v },
                  }))
                }
              />
              <Text
                label="Link"
                value={draft.programs.ctaHref}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    programs: { ...d.programs, ctaHref: v },
                  }))
                }
              />
            </div>
          </Card>

          <Card title="Impact">
            <Text
              label="Eyebrow"
              value={draft.impact.eyebrow}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  impact: { ...d.impact, eyebrow: v },
                }))
              }
            />
            <Text
              label="Title"
              value={draft.impact.title}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  impact: { ...d.impact, title: v },
                }))
              }
            />
            <Area
              label="Subtitle"
              value={draft.impact.subtitle}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  impact: { ...d.impact, subtitle: v },
                }))
              }
            />
            <ListEditor<Stat>
              label="Statistics"
              items={draft.impact.stats}
              onChange={(stats) =>
                setDraft((d) => ({
                  ...d,
                  impact: { ...d.impact, stats },
                }))
              }
              empty={{ value: "", label: "" }}
              render={(item, upd) => (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={item.value}
                    placeholder="e.g. 5,000+"
                    onChange={(e) => upd({ ...item, value: e.target.value })}
                    className={inputCls}
                  />
                  <input
                    value={item.label}
                    placeholder="e.g. Students helped"
                    onChange={(e) => upd({ ...item, label: e.target.value })}
                    className={inputCls}
                  />
                </div>
              )}
            />
          </Card>

          <Card title="Call-to-Action">
            <Text
              label="Title"
              value={draft.cta.heading}
              onChange={(v) =>
                setDraft((d) => ({ ...d, cta: { ...d.cta, heading: v } }))
              }
            />
            <Area
              label="Content"
              value={draft.cta.body}
              onChange={(v) =>
                setDraft((d) => ({ ...d, cta: { ...d.cta, body: v } }))
              }
            />
            <BgImageFields
              label="Background images (slides when multiple)"
              images={draft.cta.bgImages ?? []}
              overlay={draft.cta.overlay}
              onImages={(v) =>
                setDraft((d) => ({ ...d, cta: { ...d.cta, bgImages: v } }))
              }
              onOverlay={(v) =>
                setDraft((d) => ({ ...d, cta: { ...d.cta, overlay: v } }))
              }
            />
            <CtaFields
              label="Primary button"
              value={draft.cta.primaryCta}
              onChange={(c) =>
                setDraft((d) => ({
                  ...d,
                  cta: { ...d.cta, primaryCta: c },
                }))
              }
            />
            <CtaFields
              label="Secondary button"
              value={draft.cta.secondaryCta}
              onChange={(c) =>
                setDraft((d) => ({
                  ...d,
                  cta: { ...d.cta, secondaryCta: c },
                }))
              }
            />
          </Card>

          <Card title="Gallery Grid">
            <Text
              label="Eyebrow"
              value={draft.homeGallery?.eyebrow ?? ""}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  homeGallery: { ...d.homeGallery, eyebrow: v },
                }))
              }
            />
            <Text
              label="Title"
              value={draft.homeGallery?.title ?? ""}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  homeGallery: { ...d.homeGallery, title: v },
                }))
              }
            />
            <Area
              label="Subtitle"
              value={draft.homeGallery?.subtitle ?? ""}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  homeGallery: { ...d.homeGallery, subtitle: v },
                }))
              }
            />
            <MultiImageField
              label="Images"
              images={draft.homeGallery?.images ?? []}
              onChange={(images) =>
                setDraft((d) => ({
                  ...d,
                  homeGallery: { ...d.homeGallery, images },
                }))
              }
            />
          </Card>

          <Card title="Program Partners">
            <Text
              label="Eyebrow"
              value={draft.partners?.eyebrow ?? ""}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  partners: { ...d.partners, eyebrow: v },
                }))
              }
            />
            <Text
              label="Title"
              value={draft.partners?.title ?? ""}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  partners: { ...d.partners, title: v },
                }))
              }
            />
            <Area
              label="Subtitle"
              value={draft.partners?.subtitle ?? ""}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  partners: { ...d.partners, subtitle: v },
                }))
              }
            />
            <MultiImageField
              label="Partner logos"
              images={draft.partners?.logos ?? []}
              onChange={(logos) =>
                setDraft((d) => ({
                  ...d,
                  partners: { ...d.partners, logos },
                }))
              }
            />
          </Card>

          <SectionsEditor
            sections={draft.customSections.home}
            onChange={(secs) =>
              setDraft((d) => ({
                ...d,
                customSections: { ...d.customSections, home: secs },
              }))
            }
          />
        </>
      )}
      renderPreview={(draft) => <PublicLanding content={draft} />}
    />
  );
}
