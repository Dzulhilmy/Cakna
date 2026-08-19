// Pure, client-safe types & constants for the Society & Others partition.
// (No filesystem access here — see lib/society-store.ts for persistence.)
import { cores } from "./cores";

export type Cluster = { id: string; label: string; desc: string };

/**
 * Programme core options — the 7 Core credentials (Assist, Biz, Circle,
 * Digital, Edu, Future, Green). Sourced from lib/cores.ts so they stay in sync.
 * (The stored field is still named `kluster` for backward compatibility.)
 */
export const CLUSTERS: Cluster[] = cores.map((c) => ({
  id: c.id,
  label: c.name,
  desc: c.tagline,
}));

export function clusterLabel(id: string): string {
  return CLUSTERS.find((c) => c.id === id)?.label ?? id;
}

/**
 * Two-stage review lifecycle. A program is approved by the Department (PIC)
 * first, then by CAKNA (HQ) — only then does it enter the QC Calendar.
 * A rejection at either stage sends it back to the franchisee to resubmit.
 */
export type ReviewStatus =
  | "pending_dept"
  | "pending_cakna"
  | "approved"
  | "needs_revision";

export const STATUS_LABELS: Record<string, string> = {
  pending_dept: "Pending Department",
  pending_cakna: "Pending CAKNA",
  approved: "Approved",
  needs_revision: "Needs Revision",
  pending: "Pending Department", // legacy alias
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

/** Normalise legacy/unknown statuses to the current lifecycle. */
export function normalizeStatus(status: string): ReviewStatus {
  switch (status) {
    case "pending_dept":
    case "pending_cakna":
    case "approved":
    case "needs_revision":
      return status;
    default:
      return "pending_dept"; // legacy "pending" and anything else
  }
}

export type ReviewStage = "dept" | "cakna";

export const STAGE_LABELS: Record<ReviewStage, string> = {
  dept: "Department (PIC)",
  cakna: "CAKNA (HQ)",
};

/** Which approval stage acts on a status, or null if it's terminal. */
export function stageForStatus(status: string): ReviewStage | null {
  const s = normalizeStatus(status);
  if (s === "pending_dept") return "dept";
  if (s === "pending_cakna") return "cakna";
  return null;
}

/**
 * Separation of duties: the Department stage is handled by a reviewer (or admin
 * acting for them); the final CAKNA stage is admin-only. Single source of truth
 * for the store, the API, and the UI so the rule can't drift between them.
 */
export function canActOnStage(role: string, stage: ReviewStage): boolean {
  if (stage === "cakna") return role === "admin";
  return role === "reviewer" || role === "admin";
}

/** One entry in an application's review history. */
export type ReviewEntry = {
  stage: ReviewStage | "submit";
  decision: "submitted" | "approved" | "needs_revision" | "resubmitted";
  by: string;
  byRole: string;
  at: string;
  note: string;
};

/** Who submitted a record (captured from the logged-in user). */
export type Submitter = {
  id: string;
  name: string;
  role: string;
  branch: string;
};

/** A funding application — an event that needs funding (the paper form). */
export type FundingApplication = {
  id: string;
  reference: string; // e.g. HCQC/2026/0001
  createdAt: string;
  submittedBy?: Submitter;
  // Review lifecycle
  status: ReviewStatus;
  reviewedBy?: { id: string; name: string };
  reviewedAt?: string;
  reviewNote?: string;
  reviewLog?: ReviewEntry[];
  // 1. Maklumat Cawangan
  cawangan: string;
  namaFrancaisi: string;
  ajk: string;
  // 2. Kluster & Maklumat Program
  kluster: string;
  namaProgram: string;
  tarikh: string;
  lokasi: string;
  penerangan: string;
  // 3. Penerima Manfaat
  jumlahPeserta: string;
  kategoriPenerima: string;
  namaKomuniti: string;
  // 4. Perbelanjaan & Sumber Dana
  jumlahPerbelanjaan: number; // RM
  sumberDana: string;
  // 5. Dokumentasi Gambar
  pautanGambar: string;
  // 6. Ulasan
  impak: string;
  cadangan: string;
};

/** An event record — details & photos only, no funding requested. */
export type EventRecord = {
  id: string;
  createdAt: string;
  submittedBy?: Submitter;
  title: string;
  kluster: string;
  tarikh: string;
  lokasi: string;
  anjuran: string;
  jumlahPeserta: string;
  penerangan: string;
  images: string[]; // public paths, e.g. /uploads/xxx.jpg
};

export type FundingInput = Omit<
  FundingApplication,
  | "id"
  | "reference"
  | "createdAt"
  | "status"
  | "reviewedBy"
  | "reviewedAt"
  | "reviewNote"
  | "reviewLog"
>;
export type EventInput = Omit<EventRecord, "id" | "createdAt">;
