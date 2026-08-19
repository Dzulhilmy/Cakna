// Server-only persistence for workflow notices (data/notices.json).
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import type { Notice, NoticeInput } from "./notices";
import { audienceForRole } from "./notices";
import type { PublicUser } from "./roles";
import type { FundingApplication } from "./society";
import { clusterLabel } from "./society";

const FILE = path.join(process.cwd(), "data", "notices.json");

async function readAll(): Promise<Notice[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Notice[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(list: Notice[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

export async function addNotice(input: NoticeInput): Promise<Notice> {
  const all = await readAll();
  const notice: Notice = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    readBy: [],
    ...input,
  };
  all.push(notice);
  await writeAll(all);
  return notice;
}

/** Notices visible to a user: their role bucket (+ their own franchisee notices). */
export async function getNoticesForUser(user: PublicUser): Promise<Notice[]> {
  const audience = audienceForRole(user.role);
  const all = await readAll();
  return all
    .filter((n) => {
      if (n.audience !== audience) return false;
      // Franchisee notices are addressed to a specific user.
      if (n.audience === "franchisee") return !n.userId || n.userId === user.id;
      return true;
    })
    .reverse(); // newest first
}

export async function markNoticeRead(
  id: string,
  userId: string,
): Promise<void> {
  const all = await readAll();
  const n = all.find((x) => x.id === id);
  if (!n) return;
  if (!n.readBy.includes(userId)) {
    n.readBy.push(userId);
    await writeAll(all);
  }
}

export async function markAllNoticesRead(user: PublicUser): Promise<void> {
  const audience = audienceForRole(user.role);
  const all = await readAll();
  let changed = false;
  for (const n of all) {
    if (n.audience !== audience) continue;
    if (n.audience === "franchisee" && n.userId && n.userId !== user.id) continue;
    if (!n.readBy.includes(user.id)) {
      n.readBy.push(user.id);
      changed = true;
    }
  }
  if (changed) await writeAll(all);
}

// --- workflow event helpers -------------------------------------------------

function appLabel(app: FundingApplication): string {
  return `${app.namaProgram} (${clusterLabel(app.kluster)}) · ${app.cawangan}`;
}
const href = (app: FundingApplication) => `/society/funding/${app.id}`;

/** New submission → notify Department and CAKNA that approval is needed. */
export async function notifySubmitted(app: FundingApplication): Promise<void> {
  const body = `${appLabel(app)} — awaiting Department (PIC) approval.`;
  await addNotice({
    audience: "dept",
    kind: "approval_needed",
    title: "New program needs your approval",
    body,
    href: href(app),
  });
  await addNotice({
    audience: "cakna",
    kind: "approval_needed",
    title: "New program submitted",
    body: `${appLabel(app)} — will reach you after Department approval.`,
    href: href(app),
  });
}

/** Department approved → notify CAKNA to give final approval. */
export async function notifyDeptApproved(
  app: FundingApplication,
): Promise<void> {
  await addNotice({
    audience: "cakna",
    kind: "approval_needed",
    title: "Program ready for CAKNA approval",
    body: `${appLabel(app)} — approved by Department, awaiting your approval.`,
    href: href(app),
  });
}

/** Rejected at any stage → notify the submitting franchisee to resubmit. */
export async function notifyRejected(
  app: FundingApplication,
  note: string,
): Promise<void> {
  if (!app.submittedBy) return;
  await addNotice({
    audience: "franchisee",
    userId: app.submittedBy.id,
    kind: "rejected",
    title: "Your program needs revision",
    body: `${app.namaProgram} — ${note ? note : "please review and resubmit."}`,
    href: href(app),
  });
}

/** CAKNA approved → notify the franchisee; it now enters the QC Calendar. */
export async function notifyApproved(app: FundingApplication): Promise<void> {
  if (!app.submittedBy) return;
  await addNotice({
    audience: "franchisee",
    userId: app.submittedBy.id,
    kind: "approved",
    title: "Your program has been approved 🎉",
    body: `${app.namaProgram} is approved and added to the QC Calendar.`,
    href: href(app),
  });
}

/** Resubmission → notify Department again. */
export async function notifyResubmitted(
  app: FundingApplication,
): Promise<void> {
  await addNotice({
    audience: "dept",
    kind: "approval_needed",
    title: "Program resubmitted for approval",
    body: `${appLabel(app)} — resubmitted, awaiting Department (PIC) approval.`,
    href: href(app),
  });
}
