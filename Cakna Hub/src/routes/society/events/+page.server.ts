import type { PageServerLoad } from './$types';
import { getEvents } from '$lib/server/society-store';
export const load: PageServerLoad = async ({ locals }) => ({
	events: await getEvents(locals.user!)
});
