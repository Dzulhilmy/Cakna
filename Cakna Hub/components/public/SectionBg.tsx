"use client";

import { useEffect, useState } from "react";
import type { OverlayStrength } from "@/lib/site";
export { hasBg } from "@/lib/bg-utils";

const OVERLAY: Record<OverlayStrength, string> = {
  light: "from-rose-950/45 via-rose-900/30 to-rose-900/45",
  medium: "from-rose-950/70 via-rose-900/55 to-rose-900/65",
  dark: "from-rose-950/88 via-rose-950/78 to-rose-900/85",
};

/**
 * Absolute background image slider + darkening overlay so overlaid text stays
 * legible. Multiple images auto-cycle every 5 s with a crossfade.
 * Place inside a `relative overflow-hidden` parent.
 */
export default function SectionBg({
  images = [],
  overlay = "medium",
}: {
  images?: string[];
  overlay?: OverlayStrength;
}) {
  const valid = images.filter((img) => !!img?.trim());
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (valid.length <= 1) return;
    const t = setInterval(
      () => setActive((a) => (a + 1) % valid.length),
      5000,
    );
    return () => clearInterval(t);
  }, [valid.length]);

  if (!valid.length) return null;

  const idx = valid.length > 0 ? active % valid.length : 0;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {valid.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className={`absolute inset-0 bg-gradient-to-b ${OVERLAY[overlay]}`} />
    </div>
  );
}
