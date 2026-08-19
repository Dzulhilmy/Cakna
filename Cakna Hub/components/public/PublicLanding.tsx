import { ArrowRight, Users, HandHeart, Sprout } from "lucide-react";
import PublicShell from "@/components/public/PublicShell";
import ProgramsExplorer from "@/components/public/ProgramsExplorer";
import ImpactStats from "@/components/public/ImpactStats";
import CustomSections from "@/components/public/CustomSections";
import HomeGallery from "@/components/public/HomeGallery";
import HomePartners from "@/components/public/HomePartners";
import SectionBg from "@/components/public/SectionBg"
import { hasBg } from "@/lib/bg-utils";
import type { SiteContent } from "@/lib/site";
import type { Program } from "@/lib/programs-store";

export default function PublicLanding({
  content,
  programsByCore,
}: {
  content: SiteContent;
  programsByCore?: Record<string, Program[]>;
}) {
  const { hero, about, programs, impact, cta, homeGallery, partners } = content;
  const hasHeroImage = hasBg(hero.bgImages);
  const hasQuoteImage = hasBg(about.quoteBgImages);
  const aboutParas = about.body.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <PublicShell content={content}>
      {/* Hero */}
      <section
        className={`relative overflow-hidden ${
          hasHeroImage
            ? "text-white"
            : "bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200 text-zinc-800"
        }`}
      >
        {hasHeroImage ? (
          <SectionBg images={hero.bgImages} overlay={hero.overlay} />
        ) : (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {/* Soft decorative glows */}
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-rose-300/40 blur-3xl" />
            <div className="absolute -right-16 top-10 h-80 w-80 rounded-full bg-rose-400/30 blur-3xl" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 0, white 0, transparent 35%)",
              }}
            />
            {/* Blend into the section below */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
          </div>
        )}
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <p
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ring-1 ${
              hasHeroImage
                ? "bg-white/10 text-rose-100 ring-white/20"
                : "bg-white/60 text-rose-700 ring-rose-200 backdrop-blur"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            {hero.eyebrow}
          </p>
          <h1
            className={`mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl ${
              hasHeroImage ? "text-white" : "text-zinc-900"
            }`}
          >
            {hero.heading}
          </h1>
          <p
            className={`mx-auto mt-5 max-w-2xl text-lg ${
              hasHeroImage ? "text-rose-50" : "text-zinc-700"
            }`}
          >
            {hero.subtext}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={hero.primaryCta.href}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                hasHeroImage
                  ? "bg-white text-rose-700 shadow-lg shadow-black/10"
                  : "bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700"
              }`}
            >
              {hero.primaryCta.label}
              <ArrowRight size={16} />
            </a>
            <a
              href={hero.secondaryCta.href}
              className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors ${
                hasHeroImage
                  ? "border-white/40 text-white hover:bg-white/10"
                  : "border-rose-300 bg-white/70 text-rose-700 hover:bg-white"
              }`}
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="tentang" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              {about.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {about.title}
            </h2>
            {aboutParas.map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed text-zinc-600">
                {p}
              </p>
            ))}
          </div>
          <div
            className={`relative overflow-hidden rounded-3xl p-8 ${
              hasQuoteImage
                ? "text-white"
                : "border border-rose-100 bg-rose-50"
            }`}
          >
            <SectionBg images={about.quoteBgImages} overlay={about.quoteOverlay} />
            <div className="relative">
              <HandHeart
                className={hasQuoteImage ? "text-white" : "text-rose-600"}
                size={28}
              />
              <blockquote
                className={`mt-4 text-xl font-medium leading-relaxed ${
                  hasQuoteImage ? "text-white" : "text-zinc-800"
                }`}
              >
                “{about.quote}”
              </blockquote>
              <p
                className={`mt-4 text-sm ${
                  hasQuoteImage ? "text-rose-50/90" : "text-zinc-500"
                }`}
              >
                {about.quoteSub}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs — the 7 Core */}
      <section id="program" className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              {programs.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {programs.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
              {programs.subtitle}
            </p>
          </div>

          <ProgramsExplorer programsByCore={programsByCore} />

          <div className="mt-8 text-center">
            <a
              href={programs.ctaHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-800"
            >
              {programs.ctaLabel}
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impak" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            {impact.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            {impact.title}
          </h2>
          {impact.subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
              {impact.subtitle}
            </p>
          )}
        </div>
        <ImpactStats stats={impact.stats} />
      </section>

      {/* Admin-added custom sections */}
      <CustomSections sections={content.customSections?.home} />

      {/* Gallery grid */}
      {homeGallery && <HomeGallery gallery={homeGallery} />}

      {/* Program Partners */}
      {partners && <HomePartners partners={partners} />}

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-600 to-rose-700 py-16 text-white">
        <SectionBg images={cta.bgImages} overlay={cta.overlay} />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
          <div className="flex items-center gap-3">
            <Users size={26} />
            <Sprout size={26} />
          </div>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight">
            {cta.heading}
          </h2>
          <p className="max-w-xl text-rose-50">{cta.body}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={cta.primaryCta.href}
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition-transform hover:-translate-y-0.5"
            >
              {cta.primaryCta.label}
            </a>
            <a
              href={cta.secondaryCta.href}
              className="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {cta.secondaryCta.label}
            </a>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
