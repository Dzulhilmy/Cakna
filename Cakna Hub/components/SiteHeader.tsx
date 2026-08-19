import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SiteHeader({ showBack = false }: { showBack?: boolean }) {
  return (
    <header className="mb-10 flex items-center justify-between">
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight text-zinc-900"
      >
        Cakna <span className="text-rose-600">Hub</span>
      </Link>
      {showBack && (
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft size={16} />
          Back to hub
        </Link>
      )}
    </header>
  );
}
