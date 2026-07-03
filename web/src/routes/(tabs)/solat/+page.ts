import { getHijriEvents } from '$lib/api/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const events = await getHijriEvents(fetch);
	return { events };
};
