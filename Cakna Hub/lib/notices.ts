// Client-safe types & helpers for workflow notices (transactional in-app
// notifications for the approval flow). Persistence lives in notices-store.ts.
import type { Role } from "./roles";

export type NoticeAudience = "dept" | "cakna" | "franchisee";

export type NoticeKind = "approval_needed" | "approved" | "rejected";

export type Notice = {
  id: string;
  createdAt: string;
  audience: NoticeAudience;
  /** For franchisee notices — the specific recipient. Role notices leave this unset. */
  userId?: string;
  kind: NoticeKind;
  title: string;
  body: string;
  href?: string;
  /** User ids that have read this notice. */
  readBy: string[];
};

export type NoticeInput = Omit<Notice, "id" | "createdAt" | "readBy">;

/** What the API returns to the client — read state as a boolean, no id list. */
export type NoticeView = Omit<Notice, "readBy"> & { read: boolean };

/** Which audience bucket a role reads. */
export function audienceForRole(role: Role): NoticeAudience {
  if (role === "admin") return "cakna";
  if (role === "reviewer") return "dept";
  return "franchisee";
}
