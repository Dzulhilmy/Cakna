import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { cores } from '$lib/cores';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/auth/login');
	return { cores };
};
