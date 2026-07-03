import { getMathurat } from '$lib/api/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const items = await getMathurat(fetch);
	items.sort((a, b) => a.position - b.position);
	return { items };
};
