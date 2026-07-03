import { getSurah, getYasin } from '$lib/api/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	// Yasin (36) + Al-Fatihah (1, for "Hadiah Al-Fatihah" step) + closing adhkar doc
	const [yasin, fatihah, doc] = await Promise.all([
		getSurah(36, fetch),
		getSurah(1, fetch),
		getYasin(fetch)
	]);
	return { yasin, fatihah, doc };
};
