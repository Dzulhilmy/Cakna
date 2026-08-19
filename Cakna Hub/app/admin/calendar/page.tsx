import type { Metadata } from "next";
import { getApprovedFundingApplications } from "@/lib/society-store";
import { clusterLabel } from "@/lib/society";
import QcCalendar, { type CalEvent } from "@/components/admin/QcCalendar";

export const metadata: Metadata = {
  title: "QC Calendar · Cakna Hub Admin",
};

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const approved = await getApprovedFundingApplications();
  const events: CalEvent[] = approved
    .filter((a) => /^\d{4}-\d{2}-\d{2}/.test(a.tarikh ?? ""))
    .map((a) => ({
      id: a.id,
      date: a.tarikh.slice(0, 10),
      title: a.namaProgram,
      core: clusterLabel(a.kluster),
      branch: a.cawangan,
    }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          QC Calendar
        </h1>
        <p className="mt-1.5 text-zinc-500">
          Approved programs scheduled across QC Group. Only fully-approved
          applications (Department &amp; CAKNA) appear here.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <QcCalendar events={events} />
      </div>
    </div>
  );
}
