// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getEvents } from '$lib/server/society-store';
export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => ({
	events: await getEvents(locals.user!)
});
