import type { HubUser, Notice, NoticeInput, FundingApplication } from '$lib/types';
import { cores } from '$lib/cores';
import { hubGet, hubPost, hubDelete } from './hub-api';

export async function addNotice(actor: HubUser, input: NoticeInput): Promise<void> {
	await hubPost<unknown>(actor, '/notices', input);
}

export async function getNoticesForUser(actor: HubUser): Promise<Notice[]> {
	return hubGet<Notice[]>(actor, '/notices');
}

export async function markNoticeRead(actor: HubUser, id: string): Promise<void> {
	await hubPost<unknown>(actor, `/notices/${id}/read`);
}

export async function markAllNoticesRead(actor: HubUser): Promise<void> {
	await hubPost<unknown>(actor, '/notices/read-all');
}

export async function deleteNotice(actor: HubUser, id: string): Promise<boolean> {
	try {
		await hubDelete<unknown>(actor, `/notices/${id}`);
		return true;
	} catch {
		return false;
	}
}

// ─── Workflow helpers ─────────────────────────────────────────────────────────

function appLabel(app: FundingApplication): string {
	const core = cores.find((c) => c.id === app.kluster);
	return `${app.namaProgram} (${core?.name ?? app.kluster}) · ${app.cawangan}`;
}
const href = (app: FundingApplication) => `/society/funding/${app.id}`;

export async function notifySubmitted(actor: HubUser, app: FundingApplication): Promise<void> {
	await addNotice(actor, { audience: 'dept', kind: 'approval_needed', title: 'New program needs your approval', body: `${appLabel(app)} — awaiting Department (PIC) approval.`, href: href(app) });
	await addNotice(actor, { audience: 'cakna', kind: 'approval_needed', title: 'New program submitted', body: `${appLabel(app)} — will reach you after Department approval.`, href: href(app) });
}

export async function notifyDeptApproved(actor: HubUser, app: FundingApplication): Promise<void> {
	await addNotice(actor, { audience: 'cakna', kind: 'approval_needed', title: 'Program ready for CAKNA approval', body: `${appLabel(app)} — approved by Department, awaiting your approval.`, href: href(app) });
}

export async function notifyRejected(actor: HubUser, app: FundingApplication, note: string): Promise<void> {
	if (!app.submittedBy) return;
	await addNotice(actor, { audience: 'franchisee', userId: app.submittedBy.id, kind: 'rejected', title: 'Your program needs revision', body: `${app.namaProgram} — ${note || 'please review and resubmit.'}`, href: href(app) });
}

export async function notifyApproved(actor: HubUser, app: FundingApplication): Promise<void> {
	if (!app.submittedBy) return;
	await addNotice(actor, { audience: 'franchisee', userId: app.submittedBy.id, kind: 'approved', title: 'Your program has been approved', body: `${app.namaProgram} is approved and added to the QC Calendar.`, href: href(app) });
}

export async function notifyResubmitted(actor: HubUser, app: FundingApplication): Promise<void> {
	await addNotice(actor, { audience: 'dept', kind: 'approval_needed', title: 'Program resubmitted for approval', body: `${appLabel(app)} — resubmitted, awaiting Department (PIC) approval.`, href: href(app) });
}
