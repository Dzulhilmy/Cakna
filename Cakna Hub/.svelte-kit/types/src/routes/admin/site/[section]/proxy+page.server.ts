// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getSiteContent, saveSiteContent } from '$lib/server/site-store';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => ({
	content: await getSiteContent(locals.user!),
	section: params.section
});

export const actions = {
	default: async ({ request, params, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		const form = await request.formData();
		const rawJson = form.get('json') as string;
		let patch: unknown;
		try {
			patch = JSON.parse(rawJson);
		} catch {
			return fail(400, { error: 'Invalid JSON' });
		}
		const current = await getSiteContent(actor);
		await saveSiteContent(actor, { ...current, [params.section]: patch } as Parameters<typeof saveSiteContent>[1]);
		redirect(302, '/admin/site');
	}
};
;null as any as Actions;