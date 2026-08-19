const PIC_DEPARTMENTS = [
  "Finance",
  "MKTG",
  "MI",
  "BOD",
  "FO",
  "IT",
  "QCXIS",
  "RBE",
  "Training",
  "Logistic",
  "Cakna"
];
const ROLE_LABELS = {
  admin: "Admin",
  reviewer: "Reviewer",
  pic: "PIC",
  member: "Member",
  franchisee: "Franchisee"
};
function roleLabel(role) {
  return ROLE_LABELS[role] ?? role;
}
const STATUS_LABELS = {
  pending_dept: "Pending Department",
  pending_cakna: "Pending CAKNA",
  approved: "Approved",
  needs_revision: "Needs Revision",
  pending: "Pending Department"
};
function statusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}
function normalizeStatus(status) {
  switch (status) {
    case "pending_dept":
    case "pending_cakna":
    case "approved":
    case "needs_revision":
      return status;
    default:
      return "pending_dept";
  }
}
function stageForStatus(status) {
  const s = normalizeStatus(status);
  if (s === "pending_dept") return "dept";
  if (s === "pending_cakna") return "cakna";
  return null;
}
function canActOnStage(role, stage) {
  if (stage === "cakna") return role === "admin";
  return role === "reviewer" || role === "pic" || role === "admin";
}
const NOTIFICATION_TYPE_LABELS = {
  kemalangan: "Accident",
  takziah: "Condolences",
  kesihatan: "Health Announcement",
  umum: "General Announcement"
};
export {
  NOTIFICATION_TYPE_LABELS as N,
  PIC_DEPARTMENTS as P,
  ROLE_LABELS as R,
  stageForStatus as a,
  canActOnStage as c,
  roleLabel as r,
  statusLabel as s
};
