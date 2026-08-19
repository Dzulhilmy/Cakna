import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getSiteContent } from '$lib/server/site-store';
import { getProgramsByCore } from '$lib/server/programs-store';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) redirect(302, '/hub');
	const [content, programsByCore] = await Promise.all([getSiteContent(), getProgramsByCore()]);
	return { content, programsByCore };
};
