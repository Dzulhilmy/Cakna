import type { PageServerLoad } from './$types';
import { getSiteContent } from '$lib/server/site-store';
export const load: PageServerLoad = async ({ locals }) => ({
	content: await getSiteContent(locals.user ?? undefined)
});
