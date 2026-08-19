// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getSiteContent } from '$lib/server/site-store';
export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (locals.user!.role !== 'admin') redirect(302, '/hub/admin/dashboard');
	return { content: await getSiteContent(locals.user!) };
};
