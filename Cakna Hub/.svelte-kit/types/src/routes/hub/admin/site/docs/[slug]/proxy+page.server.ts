// @ts-nocheck
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getSiteContent, saveSiteContent } from '$lib/server/site-store';

const VALID_SLUGS = ['policy', 'sop', 'guidelines', 'manual'] as const;
type DocSlug = (typeof VALID_SLUGS)[number];

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	if (locals.user!.role !== 'admin') redirect(302, '/hub/admin/dashboard');
	const slug = params.slug as DocSlug;
	if (!VALID_SLUGS.includes(slug)) redirect(302, '/hub/admin/site/docs');
	const content = await getSiteContent(locals.user!);
	return { doc: content.docs[slug], slug };
};

export const actions = {
	default: async ({ request, params, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const slug = params.slug as DocSlug;
		if (!VALID_SLUGS.includes(slug)) return fail(400, { error: 'Invalid slug' });

		const form = await request.formData();
		const title = ((form.get('title') as string) ?? '').trim();
		const subtitle = ((form.get('subtitle') as string) ?? '').trim();
		const content_text = ((form.get('content') as string) ?? '').trim();
		const lastUpdated = ((form.get('lastUpdated') as string) ?? '').trim();

		const current = await getSiteContent(actor);
		await saveSiteContent(actor, {
			...current,
			docs: {
				...current.docs,
				[slug]: { title, subtitle, content: content_text, lastUpdated }
			}
		});

		redirect(302, '/hub/admin/site/docs');
	}
};
;null as any as Actions;