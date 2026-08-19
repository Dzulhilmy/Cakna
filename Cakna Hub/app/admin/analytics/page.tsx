import type { Metadata } from "next";
import StatCard from "@/components/admin/StatCard";
import FundingBars from "@/components/admin/FundingBars";
import ChartLegend from "@/components/admin/ChartLegend";
import { getSummary, byCore, byPic } from "@/lib/reports";
import { formatRM } from "@/lib/format";

export const metadata: Metadata = {
  title: "Analytics · Cakna Hub Admin",
};

export default function AnalyticsPage() {
  const summary = getSummary();
  const coreStats = byCore();
  const picStats = byPic();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Analytics
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Statistics collected across all 7 cores, aggregated by PIC.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Reports"
          value={String(summary.reportCount)}
          hint="Across all cores"
        />
        <StatCard
          label="Active Cores"
          value={String(summary.coreCount)}
          hint="of 7 cores"
        />
        <StatCard
          label="PICs Involved"
          value={String(summary.picCount)}
          hint="Unique persons in charge"
        />
        <StatCard
          label="Total Collected"
          value={formatRM(summary.collected)}
          hint={`${formatRM(summary.given)} given`}
          dot="emerald"
        />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">By core</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Funding activity across each of the 7 cores.
            </p>
          </div>
          <ChartLegend />
        </div>

        <FundingBars
          rows={coreStats.map((c) => ({
            label: c.core,
            collected: c.collected,
            given: c.given,
            meta: `${c.reportCount} report${c.reportCount > 1 ? "s" : ""}`,
          }))}
        />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">By PIC</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Aggregated across every core each PIC is responsible for.
            </p>
          </div>
          <ChartLegend />
        </div>

        <FundingBars
          rows={picStats.map((p) => ({
            label: p.pic,
            collected: p.collected,
            given: p.given,
            meta: `${p.cores.length} core${p.cores.length > 1 ? "s" : ""} · ${
              p.reportCount
            } report${p.reportCount > 1 ? "s" : ""}`,
          }))}
        />
      </section>
    </div>
  );
}
