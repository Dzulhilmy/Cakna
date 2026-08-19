"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  core: string;
  branch: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function QcCalendar({ events }: { events: CalEvent[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const byDate = useMemo(() => {
    const m: Record<string, CalEvent[]> = {};
    for (const e of events) (m[e.date] ??= []).push(e);
    return m;
  }, [events]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dateStr = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`;
  const isToday = (d: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === d;

  function prev() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  }
  function next() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  }

  const monthPrefix = `${year}-${pad(month + 1)}`;
  const monthCount = events.filter((e) => e.date.startsWith(monthPrefix)).length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous month"
            className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:border-rose-300 hover:text-rose-700"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setYear(today.getFullYear());
              setMonth(today.getMonth());
            }}
            className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:border-rose-300 hover:text-rose-700"
          >
            Today
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next month"
            className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:border-rose-300 hover:text-rose-700"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="bg-zinc-50 px-2 py-2 text-center text-xs font-medium text-zinc-500"
          >
            {w}
          </div>
        ))}
        {cells.map((d, i) => (
          <div key={i} className="min-h-24 bg-white p-1.5">
            {d && (
              <>
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isToday(d)
                      ? "bg-rose-600 font-semibold text-white"
                      : "text-zinc-400"
                  }`}
                >
                  {d}
                </span>
                <div className="mt-1 space-y-1">
                  {(byDate[dateStr(d)] ?? []).map((e) => (
                    <Link
                      key={e.id}
                      href={`/society/funding/${e.id}`}
                      title={`${e.title} · ${e.core} · ${e.branch}`}
                      className="block truncate rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-medium text-rose-700 transition-colors hover:bg-rose-100"
                    >
                      {e.title}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-sm text-zinc-500">
        {monthCount} approved program{monthCount === 1 ? "" : "s"} in{" "}
        {MONTHS[month]}.
      </p>
    </div>
  );
}
