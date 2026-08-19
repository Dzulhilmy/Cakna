import type { CustomSection } from "@/lib/site";

function Paragraphs({ body }: { body: string }) {
  const paras = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className="mt-4 leading-relaxed text-zinc-600 first:mt-0">
          {p}
        </p>
      ))}
    </>
  );
}

function ImageGrid({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  const cols =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-4 ${cols}`}>
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt=""
          className="aspect-[4/3] w-full rounded-2xl border border-zinc-200 object-cover"
        />
      ))}
    </div>
  );
}

function Cta({ label, href }: { label: string; href: string }) {
  if (!label.trim()) return null;
  return (
    <a
      href={href.trim() || "#"}
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition-colors hover:bg-rose-700"
    >
      {label}
    </a>
  );
}

function Header({
  section,
  align,
}: {
  section: CustomSection;
  align: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {section.eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          {section.eyebrow}
        </p>
      )}
      {section.title && (
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
          {section.title}
        </h2>
      )}
    </div>
  );
}

function Section({ s }: { s: CustomSection }) {
  const bg = s.background === "tint" ? "bg-rose-50/60" : "bg-white";
  const inner = "mx-auto max-w-6xl px-6 py-16 sm:py-20";

  if (s.layout === "imageText") {
    return (
      <section className={bg}>
        <div className={inner}>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Header section={s} align="left" />
              <div className="mt-4">
                <Paragraphs body={s.body} />
              </div>
              <Cta label={s.ctaLabel} href={s.ctaHref} />
            </div>
            <ImageGrid images={s.images} />
          </div>
        </div>
      </section>
    );
  }

  if (s.layout === "gallery") {
    return (
      <section className={bg}>
        <div className={inner}>
          <div className="mx-auto max-w-3xl text-center">
            <Header section={s} align="center" />
            {s.body && (
              <div className="mt-3">
                <Paragraphs body={s.body} />
              </div>
            )}
          </div>
          <div className="mt-10">
            <ImageGrid images={s.images} />
          </div>
          <div className="text-center">
            <Cta label={s.ctaLabel} href={s.ctaHref} />
          </div>
        </div>
      </section>
    );
  }

  // "text" — centered
  return (
    <section className={bg}>
      <div className={inner}>
        <div className="mx-auto max-w-3xl text-center">
          <Header section={s} align="center" />
          <div className="mt-4">
            <Paragraphs body={s.body} />
          </div>
          {s.images.length > 0 && (
            <div className="mt-8">
              <ImageGrid images={s.images} />
            </div>
          )}
          <Cta label={s.ctaLabel} href={s.ctaHref} />
        </div>
      </div>
    </section>
  );
}

export default function CustomSections({
  sections,
}: {
  sections?: CustomSection[];
}) {
  if (!sections || sections.length === 0) return null;
  return (
    <>
      {sections.map((s) => (
        <Section key={s.id} s={s} />
      ))}
    </>
  );
}
