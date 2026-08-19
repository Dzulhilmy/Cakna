import {
  GraduationCap,
  HeartHandshake,
  Users,
  Sprout,
  Quote,
} from "lucide-react";
import type { SiteContent } from "@/lib/site";
import CustomSections from "@/components/public/CustomSections";
import SectionBg from "@/components/public/SectionBg"
import { hasBg } from "@/lib/bg-utils";

const PURPOSE_ICONS = [GraduationCap, HeartHandshake, Users, Sprout];

export default function AboutPageBody({ content }: { content: SiteContent }) {
  const p = content.aboutPage;
  const whoParagraphs = p.whoBody.split(/\n\s*\n/);
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
        </div>
      </section>

      {/* Who Are We */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          {p.whoTitle}
        </p>
        <div className="mt-4 space-y-4 text-lg leading-relaxed text-zinc-600">
          {whoParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-rose-100 bg-rose-50 p-8">
          <Quote className="text-rose-600" size={28} />
          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-rose-600">
            {p.visionTitle}
          </p>
          <blockquote className="mt-2 text-xl font-medium leading-relaxed text-zinc-800">
            {p.visionText}
          </blockquote>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              {p.purposeEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {p.purposeTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
              {p.purposeSubtitle}
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {p.purpose.map((item, i) => {
              const Icon = PURPOSE_ICONS[i % PURPOSE_ICONS.length];
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-200 bg-white p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nationwide Collaboration */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            {p.collabEyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            {p.collabTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
            {p.collabSubtitle}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {p.stats.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 bg-white p-6 text-center"
            >
              <p className="text-3xl font-bold tracking-tight text-rose-600">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>

        <figure className="mt-10 rounded-3xl border border-zinc-200 bg-white p-8">
          <blockquote className="text-lg leading-relaxed text-zinc-700">
            &ldquo;{p.testimonial}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm font-medium text-zinc-500">
            — {p.testimonialAuthor}
          </figcaption>
        </figure>
      </section>

      <CustomSections sections={content.customSections?.about} />

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
