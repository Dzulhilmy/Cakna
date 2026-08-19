import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getSiteContent } from '$lib/server/site-store';
export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user!.role !== 'admin') redirect(302, '/hub/admin/dashboard');
	return { content: await getSiteContent(locals.user!) };
};
