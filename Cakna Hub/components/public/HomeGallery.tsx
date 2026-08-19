import type { SiteContent } from "@/lib/site";

export default function HomeGallery({
  gallery,
}: {
  gallery: SiteContent["homeGallery"];
}) {
  const images = gallery.images ?? [];
  if (!images.length) return null;

  const cols =
    images.length <= 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : images.length <= 4
          ? "grid-cols-2 lg:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      {(gallery.eyebrow || gallery.title || gallery.subtitle) && (
        <div className="mb-10 text-center">
          {gallery.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              {gallery.eyebrow}
            </p>
          )}
          {gallery.title && (
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {gallery.title}
            </h2>
          )}
          {gallery.subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
              {gallery.subtitle}
            </p>
          )}
        </div>
      )}
      {images.length > 0 && (
        <div className={`grid gap-4 ${cols}`}>
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="aspect-[4/3] w-full rounded-2xl border border-zinc-100 object-cover shadow-sm"
            />
          ))}
        </div>
      )}
    </section>
  );
}
