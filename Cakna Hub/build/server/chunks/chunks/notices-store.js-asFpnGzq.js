import { c as cores } from './cores.js-m0JlC_eV.js';
import { b as hubGet, d as hubPost } from './hub-api.js-BLc0YvhW.js';

async function addNotice(actor, input) {
  await hubPost(actor, "/notices", input);
}
async function getNoticesForUser(actor) {
  return hubGet(actor, "/notices");
}
function appLabel(app) {
  const core = cores.find((c) => c.id === app.kluster);
  return `${app.namaProgram} (${core?.name ?? app.kluster}) · ${app.cawangan}`;
}
const href = (app) => `/society/funding/${app.id}`;
async function notifySubmitted(actor, app) {
  await addNotice(actor, { audience: "dept", kind: "approval_needed", title: "New program needs your approval", body: `${appLabel(app)} — awaiting Department (PIC) approval.`, href: href(app) });
  await addNotice(actor, { audience: "cakna", kind: "approval_needed", title: "New program submitted", body: `${appLabel(app)} — will reach you after Department approval.`, href: href(app) });
}
async function notifyDeptApproved(actor, app) {
  await addNotice(actor, { audience: "cakna", kind: "approval_needed", title: "Program ready for CAKNA approval", body: `${appLabel(app)} — approved by Department, awaiting your approval.`, href: href(app) });
}
async function notifyRejected(actor, app, note) {
  if (!app.submittedBy) return;
  await addNotice(actor, { audience: "franchisee", userId: app.submittedBy.id, kind: "rejected", title: "Your program needs revision", body: `${app.namaProgram} — ${note || "please review and resubmit."}`, href: href(app) });
}
async function notifyApproved(actor, app) {
  if (!app.submittedBy) return;
  await addNotice(actor, { audience: "franchisee", userId: app.submittedBy.id, kind: "approved", title: "Your program has been approved", body: `${app.namaProgram} is approved and added to the QC Calendar.`, href: href(app) });
}
async function notifyResubmitted(actor, app) {
  await addNotice(actor, { audience: "dept", kind: "approval_needed", title: "Program resubmitted for approval", body: `${appLabel(app)} — resubmitted, awaiting Department (PIC) approval.`, href: href(app) });
}

export { notifyDeptApproved as a, notifyApproved as b, notifyRejected as c, notifySubmitted as d, getNoticesForUser as g, notifyResubmitted as n };
//# sourceMappingURL=notices-store.js-asFpnGzq.js.map
