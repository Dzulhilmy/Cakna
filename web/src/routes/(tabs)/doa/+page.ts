import { getDuas } from '$lib/api/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	return { duas: await getDuas(fetch) };
};
