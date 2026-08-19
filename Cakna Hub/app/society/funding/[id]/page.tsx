import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PrintButton from "@/components/admin/PrintButton";
import StatusBadge from "@/components/society/StatusBadge";
import FundingReviewControls from "@/components/society/FundingReviewControls";
import ResubmitButton from "@/components/society/ResubmitButton";
import ReviewTimeline from "@/components/society/ReviewTimeline";
import { getCurrentUser } from "@/lib/auth";
import { getFundingApplicationById } from "@/lib/society-store";
import {
  clusterLabel,
  statusLabel,
  normalizeStatus,
  stageForStatus,
  canActOnStage,
  STAGE_LABELS,
} from "@/lib/society";
import { formatRM } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const app = await getFundingApplicationById(id);
  return { title: app ? `${app.reference} · Cakna Hub` : "Report · Cakna Hub" };
}

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="mb-1 flex items-center gap-2 border-b border-zinc-200 pb-1.5 text-sm font-bold text-zinc-900">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-white">
          {n}
        </span>
        {title}
      </h3>
      <dl>{children}</dl>
    </section>
  );
}

function Row({
  label,
  value,
  link,
}: {
  label: string;
  value?: string;
  link?: boolean;
}) {
  const v = (value ?? "").trim();
  return (
    <div className="py-1.5">
      <dt className="text-xs text-zinc-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-zinc-800">
        {v ? (
          link ? (
            <a
              href={v}
              target="_blank"
              rel="noreferrer"
              className="break-all text-rose-700 underline"
            >
              {v}
            </a>
          ) : (
            <span className="whitespace-pre-wrap">{v}</span>
          )
        ) : (
          <span className="text-zinc-300">—</span>
        )}
      </dd>
    </div>
  );
}

export default async function FundingDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await getFundingApplicationById(id);
  if (!app) notFound();

  const user = await getCurrentUser();
  const status = normalizeStatus(app.status);
  const stage = stageForStatus(status);
  // Department stage: reviewer or admin. CAKNA stage: admin only.
  const canActThisStage = !!user && !!stage && canActOnStage(user.role, stage);
  const isOwner = !!user && app.submittedBy?.id === user.id;
  const canResubmit =
    status === "needs_revision" && (isOwner || user?.role === "admin");

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="no-print">
        <SiteHeader showBack />
        <Link
          href="/society/funding"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft size={16} />
          Funding Applications
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Report Document
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Cakna Hub Programme Report automatically generated from the
              application.
            </p>
          </div>
          <PrintButton />
        </div>
      </div>

      <article className="mt-6 rounded-2xl border border-zinc-200 bg-white p-8 print:mt-0 print:rounded-none print:border-0 print:p-0">
        <div className="flex items-start justify-between gap-4 border-b-2 border-zinc-800 pb-4">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-tight text-zinc-900">
              Cakna Hub Programme Report
            </h2>
            <p className="text-xs text-zinc-500">QC Group Sdn Bhd</p>
          </div>
          <div className="text-right text-xs text-zinc-500">
            <p className="font-semibold text-zinc-700">Reference No.</p>
            <p className="tabular-nums">{app.reference}</p>
            <p className="mt-1 font-medium uppercase tracking-wide">
              Confidential · 2026
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-zinc-400">
            Submitted: {app.createdAt.slice(0, 10)}
            {app.submittedBy ? ` · ${app.submittedBy.name}` : ""}
          </span>
          <StatusBadge status={status} />
        </div>

        <Section n={1} title="Branch Information">
          <Row label="Branch" value={app.cawangan} />
          <Row label="Franchisee Name" value={app.namaFrancaisi} />
          <Row label="Committee / Individuals Involved" value={app.ajk} />
        </Section>

        <Section n={2} title="Core & Programme Information">
          <Row label="Core" value={clusterLabel(app.kluster)} />
          <Row label="Program / Activity Name" value={app.namaProgram} />
          <Row label="Date" value={app.tarikh} />
          <Row label="Location / Venue" value={app.lokasi} />
          <Row label="Brief Activity Description" value={app.penerangan} />
        </Section>

        <Section n={3} title="Beneficiaries">
          <Row label="Total Participants / Participation" value={app.jumlahPeserta} />
          <Row label="Beneficiary Category" value={app.kategoriPenerima} />
          <Row
            label="Community / Area / Party Name"
            value={app.namaKomuniti}
          />
        </Section>

        <Section n={4} title="Expenditure & Funding Source">
          <Row
            label="Total Overall Expenditure"
            value={formatRM(app.jumlahPerbelanjaan)}
          />
          <Row label="Funding Source" value={app.sumberDana} />
        </Section>

        <Section n={5} title="Photo Documentation">
          <Row label="Photo Folder Link" value={app.pautanGambar} link />
        </Section>

        <Section n={6} title="Comments & Certification">
          <Row label="Program Impact / Achievements" value={app.impak} />
          <Row label="Suggestions / Notes" value={app.cadangan} />
        </Section>

        <div className="mt-8 rounded-lg border border-zinc-300 bg-zinc-50 p-5 print:bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            For Cakna Hub Use Only
          </h3>
          <div className="mt-2 grid gap-x-8 sm:grid-cols-2">
            <Row label="Status" value={statusLabel(status)} />
            <Row
              label="Reviewed / Approved By"
              value={app.reviewedBy?.name ?? ""}
            />
            <Row
              label="Review Date"
              value={app.reviewedAt ? app.reviewedAt.slice(0, 10) : ""}
            />
            <Row label="Review Notes" value={app.reviewNote} />
          </div>
        </div>

        <p className="mt-6 text-xs text-zinc-400">
          This document is automatically generated by Cakna Hub from the
          submitted application.
        </p>
      </article>

      {app.reviewLog && app.reviewLog.length > 0 && (
        <div className="no-print mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="mb-3 text-sm font-medium text-zinc-700">
            Approval progress
          </p>
          <ReviewTimeline log={app.reviewLog} status={status} />
        </div>
      )}

      {canActThisStage && stage && (
        <div className="no-print mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="mb-3 text-sm font-medium text-zinc-700">
            Review action — {STAGE_LABELS[stage]}
          </p>
          <FundingReviewControls
            id={app.id}
            currentNote={app.reviewNote}
            stageLabel={STAGE_LABELS[stage]}
          />
        </div>
      )}

      {canResubmit && (
        <div className="no-print mt-6 rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
          <p className="mb-1 text-sm font-medium text-zinc-800">
            This application needs revision.
          </p>
          <p className="mb-3 text-sm text-zinc-600">
            {app.reviewNote
              ? `Reviewer note: “${app.reviewNote}”`
              : "Update the details, then resubmit for approval."}
          </p>
          <ResubmitButton id={app.id} />
        </div>
      )}
    </main>
  );
}
