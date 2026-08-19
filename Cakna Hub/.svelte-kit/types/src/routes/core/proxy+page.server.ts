// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { cores } from '$lib/cores';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.user) redirect(302, '/auth/login');
	return { cores };
};
