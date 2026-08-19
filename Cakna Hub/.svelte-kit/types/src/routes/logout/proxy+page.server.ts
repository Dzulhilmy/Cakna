// @ts-nocheck
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const actions = {
	default: async ({ fetch, cookies }: import('./$types').RequestEvent) => {
		const apiBase = (env.CAKNA_API_URL ?? 'https://cakna.org').replace(/\/$/, '');
		try {
			await fetch(`${apiBase}/api/auth/logout`, {
				method: 'POST',
				signal: AbortSignal.timeout(5000)
			});
		} catch { /* best-effort: session cleanup on the API */ }
		cookies.delete('cakna_session', { path: '/' });
		redirect(303, '/');
	}
};
;null as any as Actions;