import { ShieldCheck } from "lucide-react";

/** Starts the QCXIS OAuth flow by hitting our begin endpoint. */
export default function QcxisButton({ next }: { next?: string }) {
  const href =
    "/api/auth/qcxis/begin" +
    (next ? `?next=${encodeURIComponent(next)}` : "");
  return (
    <div>
      <a
        href={href}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
      >
        <ShieldCheck size={16} />
        Continue with QCXIS
      </a>
      <p className="mt-1.5 text-center text-xs text-zinc-500">
        Log in with your QCXIS account
      </p>
    </div>
  );
}
