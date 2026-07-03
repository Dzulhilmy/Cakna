import { getAsma } from '$lib/api/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	return { asma: await getAsma(fetch) };
};
