// @ts-nocheck
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getSiteContent, saveSiteContent } from '$lib/server/site-store';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (locals.user!.role !== 'admin') redirect(302, '/hub/admin/dashboard');
	return { content: await getSiteContent(locals.user!) };
};

async function saveSection(request: Request, locals: App.Locals, section: string) {
	const actor = locals.user!;
	if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
	const form = await request.formData();
	const json = form.get('json') as string;
	let patch: unknown;
	try {
		patch = JSON.parse(json);
	} catch {
		return fail(400, { error: 'Invalid JSON' });
	}
	const current = await getSiteContent(actor);
	await saveSiteContent(actor, { ...current, [section]: patch });
	return { saved: section };
}

export const actions = {
	brand: ({ request, locals }: import('./$types').RequestEvent) => saveSection(request, locals, 'brand'),
	nav: ({ request, locals }: import('./$types').RequestEvent) => saveSection(request, locals, 'nav'),
	hero: ({ request, locals }: import('./$types').RequestEvent) => saveSection(request, locals, 'hero'),
	about: ({ request, locals }: import('./$types').RequestEvent) => saveSection(request, locals, 'about'),
	programs: ({ request, locals }: import('./$types').RequestEvent) => saveSection(request, locals, 'programs'),
	impact: ({ request, locals }: import('./$types').RequestEvent) => saveSection(request, locals, 'impact'),
	cta: ({ request, locals }: import('./$types').RequestEvent) => saveSection(request, locals, 'cta'),
	homeGallery: ({ request, locals }: import('./$types').RequestEvent) => saveSection(request, locals, 'homeGallery'),
	partners: ({ request, locals }: import('./$types').RequestEvent) => saveSection(request, locals, 'partners'),
	customSections: async ({ request, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const json = form.get('json') as string;
		let sections: unknown;
		try { sections = JSON.parse(json); } catch { return fail(400, { error: 'Invalid JSON' }); }
		const current = await getSiteContent(actor);
		await saveSiteContent(actor, {
			...current,
			customSections: { ...current.customSections, home: sections }
		} as Parameters<typeof saveSiteContent>[1]);
		return { saved: 'customSections' };
	},
	sectionOrder: async ({ request, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const json = form.get('json') as string;
		let order: unknown;
		try { order = JSON.parse(json); } catch { return fail(400, { error: 'Invalid JSON' }); }
		const current = await getSiteContent(actor);
		await saveSiteContent(actor, {
			...current,
			sectionOrder: { ...(current.sectionOrder ?? {}), home: order }
		} as Parameters<typeof saveSiteContent>[1]);
		return { saved: 'sectionOrder' };
	}
};
;null as any as Actions;