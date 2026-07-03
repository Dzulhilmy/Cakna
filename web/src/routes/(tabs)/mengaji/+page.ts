import { getMengaji } from '$lib/api/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const mengaji = await getMengaji(fetch);
	return { mengaji };
};
