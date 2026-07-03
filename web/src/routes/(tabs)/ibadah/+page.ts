import { getIbadah } from '$lib/api/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	return { doc: await getIbadah(fetch) };
};
