import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getSiteContent, saveSiteContent } from '$lib/server/site-store';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (locals.user!.role !== 'admin') redirect(302, '/hub/admin/dashboard');
	return { content: await getSiteContent(locals.user!), section: params.section };
};

export const actions: Actions = {
	save: async ({ request, params, locals }) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
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
		return { saved: params.section };
	},
	customSections: async ({ request, locals }) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const rawJson = form.get('json') as string;
		const pageKey = (form.get('pageKey') as string) ?? '';
		let sections: unknown;
		try {
			sections = JSON.parse(rawJson);
		} catch {
			return fail(400, { error: 'Invalid JSON' });
		}
		const current = await getSiteContent(actor);
		await saveSiteContent(actor, {
			...current,
			customSections: { ...current.customSections, [pageKey]: sections }
		} as Parameters<typeof saveSiteContent>[1]);
		return { saved: 'customSections' };
	},
	sectionOrder: async ({ request, locals }) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const rawJson = form.get('json') as string;
		const pageKey = (form.get('pageKey') as string) ?? '';
		let order: unknown;
		try {
			order = JSON.parse(rawJson);
		} catch {
			return fail(400, { error: 'Invalid JSON' });
		}
		const current = await getSiteContent(actor);
		await saveSiteContent(actor, {
			...current,
			sectionOrder: { ...(current.sectionOrder ?? {}), [pageKey]: order }
		} as Parameters<typeof saveSiteContent>[1]);
		return { saved: 'sectionOrder' };
	}
};
