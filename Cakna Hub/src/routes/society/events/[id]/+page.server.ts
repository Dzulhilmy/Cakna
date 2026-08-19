import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getEventById } from '$lib/server/society-store';
export const load: PageServerLoad = async ({ params, locals }) => {
	const event = await getEventById(locals.user!, params.id);
	if (!event) error(404, 'Event not found');
	return { event };
};
