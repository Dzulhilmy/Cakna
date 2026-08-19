import { Sparkles, ArrowRight } from "lucide-react";
import type { SiteContent } from "@/lib/site";
import CustomSections from "@/components/public/CustomSections";
import SectionBg from "@/components/public/SectionBg"
import { hasBg } from "@/lib/bg-utils";

export default function SetemPageBody({ content }: { content: SiteContent }) {
  const p = content.setemPage;
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

      {/* The Education Gap */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            {p.gapEyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            {p.gapTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
            {p.gapSubtitle}
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {p.gapStats.map((s) => (
            <div
              key={s.value}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <p className="text-2xl font-bold tracking-tight text-rose-600">
                {s.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What is SETEM */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            {p.whatEyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            {p.whatTitle}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-600">
            {p.whatBody}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-6xl px-6">
          <h3 className="text-center text-xl font-bold tracking-tight text-zinc-900">
            {p.expectTitle}
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.expect.map((label) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <Sparkles size={20} strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-zinc-800">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Join */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            {p.audienceEyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            {p.audienceTitle}
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {p.audience.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-zinc-900">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              {p.processEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {p.processTitle}
            </h2>
          </div>
          <ol className="mt-10 space-y-4">
            {p.steps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-zinc-900">{step.title}</h3>
                  <p className="mt-0.5 text-sm text-zinc-600">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CustomSections sections={content.customSections?.setem} />

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-600 to-rose-700 py-16 text-white">
        <SectionBg images={p.ctaBgImages} overlay={p.ctaOverlay} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{p.ctaHeading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-rose-50">{p.ctaText}</p>
          <a
            href={p.ctaHref}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition-transform hover:-translate-y-0.5"
          >
            {p.ctaLabel}
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
