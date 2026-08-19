"use client";

import { Printer } from "lucide-react";

export default function PrintButton({
  className,
  label = "Print / Save PDF",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      onClick={() => window.print()}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
      }
    >
      <Printer size={15} />
      {label}
    </button>
  );
}
