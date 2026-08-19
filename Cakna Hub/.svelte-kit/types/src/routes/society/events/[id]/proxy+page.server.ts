// @ts-nocheck
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getEventById } from '$lib/server/society-store';
export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	const event = await getEventById(locals.user!, params.id);
	if (!event) error(404, 'Event not found');
	return { event };
};
