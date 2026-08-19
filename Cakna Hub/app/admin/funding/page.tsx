import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText, Download } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import AmountBars from "@/components/admin/AmountBars";
import FundingApplicationsList from "@/components/admin/FundingApplicationsList";
import { getFundingApplications } from "@/lib/society-store";
import { getCurrentUser } from "@/lib/auth";
import { normalizeStatus } from "@/lib/society";
import { fundingByCluster } from "@/lib/reports";
import { formatRM } from "@/lib/format";

export const metadata: Metadata = {
  title: "Funding · Cakna Hub Admin",
};

export const dynamic = "force-dynamic";

export default async function FundingAdminPage() {
  const [applications, user] = await Promise.all([
    getFundingApplications(),
    getCurrentUser(),
  ]);
  const approved = applications.filter(
    (a) => normalizeStatus(a.status) === "approved",
  );
  const pending = applications.filter((a) => {
    const s = normalizeStatus(a.status);
    return s === "pending_dept" || s === "pending_cakna";
  }).length;

  const disbursed = approved.reduce((s, a) => s + a.jumlahPerbelanjaan, 0);
  const clusters = fundingByCluster(approved);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Funding
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Review funding applications from Society &amp; Others. Only approved
          applications count as disbursed.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/admin/funding/report"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-rose-300 hover:text-rose-700"
          >
            <FileText size={15} />
            Consolidated Report (PDF)
          </Link>
          <a
            href="/api/funding/export"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-rose-300 hover:text-rose-700"
          >
            <Download size={15} />
            Download Excel (CSV)
          </a>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Applications"
          value={String(applications.length)}
          hint="Total submitted"
        />
        <StatCard
          label="Approved"
          value={String(approved.length)}
          hint="Reviewed & approved"
          dot="emerald"
        />
        <StatCard
          label="Pending Review"
          value={String(pending)}
          hint="Awaiting Dept / CAKNA"
          dot="amber"
        />
        <StatCard
          label="Total Disbursed"
          value={formatRM(disbursed)}
          hint="Approved only"
          dot="emerald"
        />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-zinc-900">
            Disbursement by core
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Approved funding disbursed per core.
          </p>
        </div>
        <AmountBars
          rows={clusters.map((c) => ({
            label: c.label,
            value: c.total,
            meta: `${c.count} approved`,
          }))}
        />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Applications &amp; review
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Approve or request improvements. Most recent first.
            </p>
          </div>
          <Link
            href="/society/funding"
            className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700"
          >
            View in Society &amp; Others
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <FundingApplicationsList
          applications={applications}
          role={user?.role ?? "reviewer"}
        />
      </section>
    </div>
  );
}
