"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import type { SiteContent } from "@/lib/site";

/**
 * Public site header. Shows the full nav inline on desktop; on narrow windows
 * it collapses to a hamburger that toggles a drawer with the links + CTAs.
 */
export default function PublicNav({
  brand,
  nav,
}: {
  brand: SiteContent["brand"];
  nav: SiteContent["nav"];
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Close the drawer on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2" onClick={close}>
          {brand.logoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logoImage}
              alt={brand.name}
              className="h-16 w-auto"
            />
          ) : (
            <>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
                <Heart size={16} fill="currentColor" strokeWidth={0} />
              </span>
              <span className="text-lg font-bold tracking-tight text-zinc-900">
                {brand.name}{" "}
                <span className="text-rose-600">{brand.accentWord}</span>
              </span>
            </>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <a
              key={n.href + n.label}
              href={n.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-rose-700"
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:text-rose-700"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
          >
            Join us
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="public-mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 transition-colors hover:bg-zinc-100 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          id="public-mobile-menu"
          className="border-t border-zinc-200 bg-white md:hidden"
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
            {nav.map((n) => (
              <a
                key={n.href + n.label}
                href={n.href}
                onClick={close}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-rose-700"
              >
                {n.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-zinc-100 pt-3">
              <Link
                href="/login"
                onClick={close}
                className="rounded-lg border border-zinc-300 px-3.5 py-2.5 text-center text-sm font-medium text-zinc-700 transition-colors hover:border-rose-300 hover:text-rose-700"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="rounded-lg bg-rose-600 px-3.5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-rose-700"
              >
                Join us
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
