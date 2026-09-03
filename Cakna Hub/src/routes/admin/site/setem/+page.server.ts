import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getSiteContent, saveSiteContent } from '$lib/server/site-store';

export const load: PageServerLoad = async ({ locals }) => ({
	content: await getSiteContent(locals.user!)
});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const actor = locals.user!;
		const form = await request.formData();
		const rawJson = form.get('json') as string;
		let patch: unknown;
		try {
			patch = JSON.parse(rawJson);
		} catch {
			return fail(400, { error: 'Invalid JSON — please check your input.' });
		}
		const current = await getSiteContent(actor);
		await saveSiteContent(actor, { ...current, setemPage: patch } as Parameters<typeof saveSiteContent>[1]);
		redirect(302, '/admin/site');
	}
};
