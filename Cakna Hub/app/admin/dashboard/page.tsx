import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import FundingBars from "@/components/admin/FundingBars";
import ChartLegend from "@/components/admin/ChartLegend";
import StatusBadge from "@/components/society/StatusBadge";
import { combinedSummary, combinedByState, stateForBranch } from "@/lib/reports";
import { getFundingApplications } from "@/lib/society-store";
import { formatRM } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard · Cakna Hub Admin",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const applications = await getFundingApplications();
  const approved = applications.filter((a) => a.status === "approved");
  const pendingCount = applications.filter(
    (a) => (a.status ?? "pending") !== "approved",
  ).length;
  // Only approved funding applications count as disbursed ("given").
  const summary = combinedSummary(approved);
  const states = combinedByState(approved);
  const disbursedPct = summary.collected
    ? Math.round((summary.given / summary.collected) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Funding collected and given across all reports and funding
          applications, categorized by state.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Collected"
          value={formatRM(summary.collected)}
          hint={`${summary.reportCount} programme reports`}
          dot="emerald"
        />
        <StatCard
          label="Total Given"
          value={formatRM(summary.given)}
          hint={`${disbursedPct}% of collected`}
          dot="amber"
        />
        <StatCard
          label="Net Balance"
          value={formatRM(summary.net)}
          hint="Collected − Given"
          dot="zinc"
        />
        <StatCard
          label="Approved Funding"
          value={String(summary.applicationCount)}
          hint={`${formatRM(summary.applicationTotal)} disbursed${
            pendingCount > 0 ? ` · ${pendingCount} pending` : ""
          }`}
        />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Funding by state
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Collected vs given, ranked by amount collected
              {summary.applicationCount > 0
                ? ` — including ${summary.applicationCount} approved funding application${
                    summary.applicationCount > 1 ? "s" : ""
                  }`
                : ""}
              .
            </p>
          </div>
          <ChartLegend />
        </div>

        <FundingBars
          rows={states.map((s) => ({
            label: s.state,
            collected: s.collected,
            given: s.given,
            meta: `${s.reportCount} report${s.reportCount > 1 ? "s" : ""}`,
          }))}
        />
      </section>

      {applications.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Recent funding applications
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Live from Society &amp; Others.
              </p>
            </div>
            <Link
              href="/society/funding"
              className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700"
            >
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <ul className="divide-y divide-zinc-100">
            {applications.slice(0, 5).map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {a.namaProgram}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {a.reference} · {a.cawangan} ({stateForBranch(a.cawangan)})
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={a.status ?? "pending"} />
                  <span className="text-sm font-medium tabular-nums text-zinc-800">
                    {formatRM(a.jumlahPerbelanjaan)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
