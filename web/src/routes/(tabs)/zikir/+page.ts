import { getDhikr } from '$lib/api/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const dhikr = await getDhikr(fetch);
	return { dhikr };
};
