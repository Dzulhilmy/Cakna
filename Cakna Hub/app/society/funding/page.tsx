import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import StatusBadge from "@/components/society/StatusBadge";
import { getFundingApplications } from "@/lib/society-store";
import { clusterLabel } from "@/lib/society";
import { formatRM } from "@/lib/format";

export const metadata: Metadata = {
  title: "Funding Applications · Cakna Hub",
};

export const dynamic = "force-dynamic";

export default async function FundingListPage() {
  const applications = await getFundingApplications();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <SiteHeader showBack />

      <Link
        href="/society"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft size={16} />
        Society &amp; Others
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Funding Applications
          </h1>
          <p className="mt-1.5 text-zinc-500">
            Events that need funding, submitted via the Cakna Hub Programme
            Report form.
          </p>
        </div>
        <Link
          href="/society/funding/new"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          <Plus size={16} />
          New application
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-6 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <FileText size={26} strokeWidth={1.75} />
          </span>
          <h2 className="mt-5 text-lg font-medium text-zinc-700">
            No applications yet
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
            Submit a funding application to get started.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {applications.map((a) => (
            <li key={a.id}>
              <Link
                href={`/society/funding/${a.id}`}
                className="block rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium tabular-nums text-zinc-400">
                    {a.reference}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                      {clusterLabel(a.kluster)}
                    </span>
                    <StatusBadge status={a.status ?? "pending"} />
                  </div>
                </div>
                <h3 className="mt-1 text-base font-semibold text-zinc-900">
                  {a.namaProgram}
                </h3>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {[a.cawangan, a.lokasi, a.tarikh].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <span className="text-zinc-500">
                    Expenditure:{" "}
                    <span className="font-medium text-zinc-800">
                      {formatRM(a.jumlahPerbelanjaan)}
                    </span>
                  </span>
                  {a.sumberDana && (
                    <span className="text-zinc-500">
                      Source:{" "}
                      <span className="font-medium text-zinc-800">
                        {a.sumberDana}
                      </span>
                    </span>
                  )}
                  {a.jumlahPeserta && (
                    <span className="text-zinc-500">
                      Participants:{" "}
                      <span className="font-medium text-zinc-800">
                        {a.jumlahPeserta}
                      </span>
                    </span>
                  )}
                </div>
                {a.status === "needs_revision" && a.reviewNote && (
                  <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    <span className="font-medium">Revision required:</span>{" "}
                    {a.reviewNote}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
