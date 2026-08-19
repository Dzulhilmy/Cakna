import type { Metadata } from "next";
import { Download } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getFundingApplications } from "@/lib/society-store";
import { fundingByCluster, fundingByState, stateForBranch } from "@/lib/reports";
import { clusterLabel, statusLabel, normalizeStatus } from "@/lib/society";
import { formatRM } from "@/lib/format";
import PrintButton from "@/components/admin/PrintButton";

export const metadata: Metadata = {
  title: "Consolidated Report · Cakna Hub",
};

export const dynamic = "force-dynamic";

export default async function FundingReportPage() {
  await requireRole(["admin", "reviewer"], "/admin/funding/report");

  const apps = await getFundingApplications();
  const approved = apps.filter((a) => normalizeStatus(a.status) === "approved");
  const pending = apps.filter((a) => {
    const s = normalizeStatus(a.status);
    return s === "pending_dept" || s === "pending_cakna";
  }).length;
  const needsRevision = apps.filter(
    (a) => normalizeStatus(a.status) === "needs_revision",
  ).length;
  const disbursed = approved.reduce((s, a) => s + a.jumlahPerbelanjaan, 0);
  const byCluster = fundingByCluster(approved).filter((c) => c.count > 0);
  const byState = fundingByState(approved);

  const generated = new Date();
  const generatedDate = generated.toISOString().slice(0, 10);

  const th = "border-b border-zinc-300 px-3 py-2 text-left font-medium text-zinc-500";
  const td = "border-b border-zinc-100 px-3 py-2 align-top text-zinc-800";

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Consolidated Report
          </h1>
          <p className="mt-1.5 text-zinc-500">
            Generate a funding report for HQ / Yayasan Cakna management — share
            as PDF or Excel.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/funding/export"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-rose-300 hover:text-rose-700"
          >
            <Download size={15} />
            Download Excel (CSV)
          </a>
          <PrintButton />
        </div>
      </div>

      {/* Printable document */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 print:rounded-none print:border-0 print:p-0">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-300 pb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Consolidated Funding Report
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Cakna Hub · QC Group Sdn Bhd
            </p>
          </div>
          <div className="text-right text-xs text-zinc-500">
            <p>Generated: {generatedDate}</p>
            <p className="mt-0.5 font-medium uppercase tracking-wide">
              Confidential · Internal Use
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-zinc-200 sm:grid-cols-4">
          {[
            { label: "Total Applications", value: String(apps.length) },
            { label: "Approved", value: String(approved.length) },
            {
              label: "Pending / Needs Revision",
              value: String(pending + needsRevision),
            },
            { label: "Total Approved", value: formatRM(disbursed) },
          ].map((s) => (
            <div key={s.label} className="bg-white p-4">
              <p className="text-xs text-zinc-500">{s.label}</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Summary by core (approved)
        </h3>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr>
              <th className={th}>Core</th>
              <th className={`${th} text-right`}>No.</th>
              <th className={`${th} text-right`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {byCluster.length === 0 ? (
              <tr>
                <td className={`${td} text-zinc-400`} colSpan={3}>
                  No approved applications yet.
                </td>
              </tr>
            ) : (
              byCluster.map((c) => (
                <tr key={c.cluster}>
                  <td className={td}>{c.label}</td>
                  <td className={`${td} text-right tabular-nums`}>{c.count}</td>
                  <td className={`${td} text-right tabular-nums`}>
                    {formatRM(c.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Summary by state (approved)
        </h3>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr>
              <th className={th}>State</th>
              <th className={`${th} text-right`}>No.</th>
              <th className={`${th} text-right`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {byState.length === 0 ? (
              <tr>
                <td className={`${td} text-zinc-400`} colSpan={3}>
                  No approved applications yet.
                </td>
              </tr>
            ) : (
              byState.map((s) => (
                <tr key={s.state}>
                  <td className={td}>{s.state}</td>
                  <td className={`${td} text-right tabular-nums`}>{s.count}</td>
                  <td className={`${td} text-right tabular-nums`}>
                    {formatRM(s.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          List of applications
        </h3>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr>
              <th className={th}>Reference</th>
              <th className={th}>Program</th>
              <th className={th}>Core</th>
              <th className={th}>Branch (State)</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Expenditure</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id}>
                <td className={`${td} whitespace-nowrap tabular-nums text-zinc-500`}>
                  {a.reference}
                </td>
                <td className={`${td} font-medium`}>{a.namaProgram}</td>
                <td className={td}>{clusterLabel(a.kluster)}</td>
                <td className={td}>
                  {a.cawangan}{" "}
                  <span className="text-zinc-400">
                    ({stateForBranch(a.cawangan)})
                  </span>
                </td>
                <td className={td}>{statusLabel(a.status ?? "pending")}</td>
                <td className={`${td} whitespace-nowrap text-right tabular-nums`}>
                  {formatRM(a.jumlahPerbelanjaan)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-8 border-t border-zinc-200 pt-4 text-xs text-zinc-400">
          Automatically generated by Cakna Hub on{" "}
          {generated.toISOString().replace("T", " ").slice(0, 19)} UTC.
        </p>
      </div>
    </div>
  );
}
