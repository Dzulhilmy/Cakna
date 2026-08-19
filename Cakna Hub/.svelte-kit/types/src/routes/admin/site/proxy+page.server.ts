// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getSiteContent } from '$lib/server/site-store';
export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => ({
	content: await getSiteContent(locals.user!)
});
