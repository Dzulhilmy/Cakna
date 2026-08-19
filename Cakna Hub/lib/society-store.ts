// Server-only persistence for Society & Others.
// Stores records in JSON files under /data. Swap these functions for a real
// database later — the page/API contracts won't need to change.
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import type {
  FundingApplication,
  EventRecord,
  FundingInput,
  EventInput,
  ReviewStage,
  ReviewStatus,
} from "./society";
import { normalizeStatus, stageForStatus, canActOnStage } from "./society";

const DATA_DIR = path.join(process.cwd(), "data");
const FUNDING_FILE = path.join(DATA_DIR, "funding.json");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");

async function readJson<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function writeJson<T>(file: string, data: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function getFundingApplications(): Promise<FundingApplication[]> {
  const all = await readJson<FundingApplication>(FUNDING_FILE);
  return all.slice().reverse(); // newest first
}

export async function getFundingApplicationById(
  id: string,
): Promise<FundingApplication | null> {
  const all = await readJson<FundingApplication>(FUNDING_FILE);
  return all.find((a) => a.id === id) ?? null;
}

export async function addFundingApplication(
  input: FundingInput,
): Promise<FundingApplication> {
  const all = await readJson<FundingApplication>(FUNDING_FILE);
  const now = new Date().toISOString();
  const record: FundingApplication = {
    id: randomUUID(),
    reference: `HCQC/2026/${String(all.length + 1).padStart(4, "0")}`,
    createdAt: now,
    status: "pending_dept",
    reviewLog: input.submittedBy
      ? [
          {
            stage: "submit",
            decision: "submitted",
            by: input.submittedBy.name,
            byRole: input.submittedBy.role,
            at: now,
            note: "",
          },
        ]
      : [],
    ...input,
  };
  all.push(record);
  await writeJson(FUNDING_FILE, all);
  return record;
}

export type ReviewResult = {
  app: FundingApplication;
  stage: ReviewStage;
  decision: "approved" | "needs_revision";
  newStatus: ReviewStatus;
};

/**
 * Advance the two-stage review. The stage is inferred from the current status:
 * pending_dept → Department decision; pending_cakna → CAKNA decision.
 * Approving the dept stage moves it to CAKNA; approving CAKNA marks it approved.
 * A rejection at either stage sends it to needs_revision.
 */
export async function reviewFundingApplication(
  id: string,
  review: {
    decision: "approved" | "needs_revision";
    reviewerId: string;
    reviewerName: string;
    reviewerRole: string;
    note: string;
  },
): Promise<ReviewResult | "not_found" | "not_reviewable" | "not_allowed"> {
  const all = await readJson<FundingApplication>(FUNDING_FILE);
  const app = all.find((a) => a.id === id);
  if (!app) return "not_found";
  const stage = stageForStatus(app.status);
  if (!stage) return "not_reviewable";
  // Authorize against the FRESHLY-read stage inside the read-mutate-write, so
  // the role↔stage rule can't be bypassed by a stale pre-check (e.g. a race
  // where a Department reviewer lands on a just-advanced CAKNA stage).
  if (!canActOnStage(review.reviewerRole, stage)) return "not_allowed";

  const at = new Date().toISOString();
  const newStatus: ReviewStatus =
    review.decision === "needs_revision"
      ? "needs_revision"
      : stage === "dept"
        ? "pending_cakna"
        : "approved";

  app.status = newStatus;
  app.reviewedBy = { id: review.reviewerId, name: review.reviewerName };
  app.reviewedAt = at;
  app.reviewNote = review.note;
  app.reviewLog = [
    ...(app.reviewLog ?? []),
    {
      stage,
      decision: review.decision,
      by: review.reviewerName,
      byRole: review.reviewerRole,
      at,
      note: review.note,
    },
  ];
  await writeJson(FUNDING_FILE, all);
  return { app, stage, decision: review.decision, newStatus };
}

/** Franchisee (or admin) resubmits a rejected application → back to Department. */
export async function resubmitFundingApplication(
  id: string,
  actor: { id: string; name: string; role: string },
): Promise<FundingApplication | "not_found" | "not_allowed"> {
  const all = await readJson<FundingApplication>(FUNDING_FILE);
  const app = all.find((a) => a.id === id);
  if (!app) return "not_found";
  if (normalizeStatus(app.status) !== "needs_revision") return "not_allowed";
  const isOwner = app.submittedBy?.id === actor.id;
  if (!isOwner && actor.role !== "admin") return "not_allowed";

  const at = new Date().toISOString();
  app.status = "pending_dept";
  app.reviewLog = [
    ...(app.reviewLog ?? []),
    {
      stage: "submit",
      decision: "resubmitted",
      by: actor.name,
      byRole: actor.role,
      at,
      note: "",
    },
  ];
  await writeJson(FUNDING_FILE, all);
  return app;
}

/** Approved applications only — the source for the QC Calendar. */
export async function getApprovedFundingApplications(): Promise<
  FundingApplication[]
> {
  const all = await readJson<FundingApplication>(FUNDING_FILE);
  return all.filter((a) => normalizeStatus(a.status) === "approved");
}

export async function getEvents(): Promise<EventRecord[]> {
  const all = await readJson<EventRecord>(EVENTS_FILE);
  return all.slice().reverse(); // newest first
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  const all = await readJson<EventRecord>(EVENTS_FILE);
  return all.find((e) => e.id === id) ?? null;
}

export async function addEvent(input: EventInput): Promise<EventRecord> {
  const all = await readJson<EventRecord>(EVENTS_FILE);
  const record: EventRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  all.push(record);
  await writeJson(EVENTS_FILE, all);
  return record;
}
