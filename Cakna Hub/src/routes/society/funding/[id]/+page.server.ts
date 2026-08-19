import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getFundingApplicationById, reviewFundingApplication, resubmitFundingApplication } from '$lib/server/society-store';
import { notifyDeptApproved, notifyApproved, notifyRejected, notifyResubmitted } from '$lib/server/notices-store';

export const load: PageServerLoad = async ({ params, locals }) => {
	const app = await getFundingApplicationById(locals.user!, params.id);
	if (!app) error(404, 'Application not found');
	return { app };
};

export const actions: Actions = {
	review: async ({ params, request, locals }) => {
		const actor = locals.user!;
		const form = await request.formData();
		const decision = form.get('decision') as 'approved' | 'needs_revision';
		const note = (form.get('note') as string) ?? '';
		try {
			const result = await reviewFundingApplication(actor, params.id, { decision, note });
			if (typeof result === 'string') return fail(400, { error: result });
			const app = await getFundingApplicationById(actor, params.id);
			if (app) {
				if (decision === 'approved') {
					if (result.status === 'pending_cakna') await notifyDeptApproved(actor, app).catch(() => {});
					else await notifyApproved(actor, app).catch(() => {});
				} else {
					await notifyRejected(actor, app, note).catch(() => {});
				}
			}
		} catch (e: unknown) {
			return fail(400, { error: e instanceof Error ? e.message : 'Review failed' });
		}
		redirect(302, `/society/funding/${params.id}`);
	},
	resubmit: async ({ params, locals }) => {
		const actor = locals.user!;
		try {
			const result = await resubmitFundingApplication(actor, params.id);
			if (typeof result === 'string') return fail(400, { error: result });
			const app = await getFundingApplicationById(actor, params.id);
			if (app) await notifyResubmitted(actor, app).catch(() => {});
		} catch (e: unknown) {
			return fail(400, { error: e instanceof Error ? e.message : 'Resubmit failed' });
		}
		redirect(302, `/society/funding/${params.id}`);
	}
};
