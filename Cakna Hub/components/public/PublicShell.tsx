import Link from "next/link";
import { Heart, Phone, Mail } from "lucide-react";
import type { SiteContent } from "@/lib/site";
import PublicNav from "@/components/public/PublicNav";
import DocsSection from "@/components/public/DocsSection";

/** Shared public header + footer for the landing and all marketing pages. */
export default function PublicShell({
  content,
  children,
}: {
  content: SiteContent;
  children: React.ReactNode;
}) {
  const { brand, nav, footer } = content;

  return (
    <div className="min-h-screen bg-white text-zinc-800">
      <PublicNav brand={brand} nav={nav} />

      {children}

      <DocsSection />

      <footer id="hubungi" className="bg-zinc-900 text-zinc-300">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              {brand.logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logoImage}
                  alt={brand.name}
                  className="h-10 w-auto brightness-0 invert"
                />
              ) : (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
                    <Heart size={16} fill="currentColor" strokeWidth={0} />
                  </span>
                  <span className="text-lg font-bold text-white">
                    {brand.name}{" "}
                    <span className="text-rose-400">{brand.accentWord}</span>
                  </span>
                </>
              )}
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              {footer.tagline}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Links</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {nav.map((n) => (
                <li key={n.href + n.label}>
                  <a href={n.href} className="hover:text-rose-400">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/login" className="hover:text-rose-400">
                  Log in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {footer.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} /> {footer.phone}
                </li>
              )}
              {footer.email && (
                <li className="flex items-center gap-2">
                  <Mail size={14} /> {footer.email}
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 py-5 text-center text-xs text-zinc-500">
          {footer.copyright}
        </div>
      </footer>
    </div>
  );
}
