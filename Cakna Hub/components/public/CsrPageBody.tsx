import type { SiteContent } from "@/lib/site";
import CustomSections from "@/components/public/CustomSections";
import CsrStories from "@/components/public/CsrStories";
import SectionBg from "@/components/public/SectionBg"
import { hasBg } from "@/lib/bg-utils";

export default function CsrPageBody({ content }: { content: SiteContent }) {
  const p = content.csrPage;
  const heroImg = hasBg(p.heroBgImages);

  return (
    <>
      {/* Hero */}
      <section
        className={`relative overflow-hidden ${
          heroImg ? "text-white" : "bg-gradient-to-b from-rose-100 to-rose-200"
        }`}
      >
        <SectionBg images={p.heroBgImages} overlay={p.heroOverlay} />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <p
            className={`text-sm font-medium uppercase tracking-[0.2em] ${
              heroImg ? "text-rose-100" : "text-rose-700"
            }`}
          >
            {p.eyebrow}
          </p>
          <h1
            className={`mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl ${
              heroImg ? "text-white" : "text-zinc-900"
            }`}
          >
            {p.heading}
          </h1>
          <p
            className={`mx-auto mt-5 max-w-2xl text-lg ${
              heroImg ? "text-rose-50" : "text-zinc-700"
            }`}
          >
            {p.subtext}
          </p>
        </div>
      </section>

      {/* Stories grid */}
      <CsrStories stories={p.stories} />

      <CustomSections sections={content.customSections?.csr} />

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-600 to-rose-700 py-16 text-white">
        <SectionBg images={p.ctaBgImages} overlay={p.ctaOverlay} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{p.ctaHeading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-rose-50">{p.ctaText}</p>
          <a
            href={p.ctaHref}
            className="mt-6 inline-block rounded-lg bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition-transform hover:-translate-y-0.5"
          >
            {p.ctaLabel}
          </a>
        </div>
      </section>
    </>
  );
}
