import type { SiteContent } from "@/lib/site";

export default function HomePartners({
  partners,
}: {
  partners: SiteContent["partners"];
}) {
  const logos = partners.logos ?? [];
  if (!logos.length) return null;

  return (
    <section className="bg-zinc-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        {(partners.eyebrow || partners.title || partners.subtitle) && (
          <div className="mb-10 text-center">
            {partners.eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
                {partners.eyebrow}
              </p>
            )}
            {partners.title && (
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
                {partners.title}
              </h2>
            )}
            {partners.subtitle && (
              <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
                {partners.subtitle}
              </p>
            )}
          </div>
        )}
        {logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {logos.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <div
                key={i}
                className="flex h-[120px] w-[120px] items-center justify-center rounded-xl bg-transparent p-0"
              >
                <img
                  src={src}
                  alt=""
                  className="h-[120px] w-[120px] object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
