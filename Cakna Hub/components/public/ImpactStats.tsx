"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Stat = { value: string; label: string };

const DURATION = 1500; // ms
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Split a display value like "5,000+" into its animatable parts. */
function parse(value: string) {
  const match = value.match(/[\d,]+/);
  if (!match) return null;
  const raw = match[0];
  const start = match.index ?? 0;
  const target = parseInt(raw.replace(/,/g, ""), 10);
  if (!Number.isFinite(target)) return null;
  return {
    prefix: value.slice(0, start),
    suffix: value.slice(start + raw.length),
    target,
    hasComma: raw.includes(","),
  };
}

const fmt = (n: number, comma: boolean) =>
  comma ? Math.round(n).toLocaleString("en-US") : String(Math.round(n));

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const parsed = useMemo(() => parse(stat.value), [stat.value]);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active || !parsed) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(parsed.target);
      return;
    }
    let raf = 0;
    let startTs = 0;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / DURATION, 1);
      setN(parsed.target * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, parsed]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-sm">
      <p className="text-3xl font-bold tracking-tight text-rose-600 tabular-nums">
        {parsed ? `${parsed.prefix}${fmt(n, parsed.hasComma)}${parsed.suffix}` : stat.value}
      </p>
      <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
    </div>
  );
}

/**
 * The "Our Impact" figures — each number counts up from zero the first time
 * the block scrolls into view (respecting prefers-reduced-motion).
 */
export default function ImpactStats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Fit the columns to however many stats the admin configured.
  const lgCols =
    ({
      1: "lg:grid-cols-1",
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
    } as Record<number, string>)[Math.min(stats.length, 5)] ?? "lg:grid-cols-5";

  return (
    <div ref={ref} className={`mt-10 grid grid-cols-2 gap-4 ${lgCols}`}>
      {stats.map((s, i) => (
        <StatCard key={i} stat={s} active={active} />
      ))}
    </div>
  );
}
