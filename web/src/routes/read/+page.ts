import { settings } from '$lib/state/stores.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const p = settings.value.page;
	redirect(302, `/read/${p >= 1 && p <= 604 ? p : 1}`);
};
