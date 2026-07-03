import { getPage } from '$lib/api/content';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, url, fetch }) => {
	const p = Math.floor(Number(params.page));
	if (!Number.isFinite(p) || p < 1 || p > 604) redirect(302, '/read/1');
	const bundle = await getPage(p, fetch);
	const gParam = url.searchParams.get('g');
	return { bundle, flashG: gParam ? +gParam : null };
};
