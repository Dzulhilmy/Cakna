// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

function apiBase(): string {
	return (env.CAKNA_API_URL ?? 'https://cakna.org').replace(/\/$/, '');
}

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	if (locals.user) redirect(302, '/admin/dashboard');
	return { error: url.searchParams.get('error') };
};

export const actions = {
	login: async ({ request, cookies }: import('./$types').RequestEvent) => {
		const form = await request.formData();
		const email = (form.get('email') as string | null)?.trim() ?? '';
		const password = (form.get('password') as string | null) ?? '';

		if (!email || !password) {
			return fail(400, { error: 'Please fill in all fields.' });
		}

		let res: Response;
		try {
			res = await fetch(`${apiBase()}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.toLowerCase(), password }),
				signal: AbortSignal.timeout(8000)
			});
		} catch {
			return fail(503, { error: 'Could not reach server. Please try again.' });
		}

		if (res.status === 401) return fail(401, { error: 'Invalid email or password.' });
		if (!res.ok) return fail(res.status, { error: 'Login failed. Please try again.' });

		const setCookie = res.headers.get('set-cookie') ?? '';
		const match = setCookie.match(/cakna_session=([^;]+)/);
		if (!match) return fail(500, { error: 'Session not received. Please try again.' });

		cookies.set('cakna_session', match[1], {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});

		redirect(302, '/admin/dashboard');
	},

	sso: async () => {
		redirect(302, `${apiBase()}/api/auth/sso/start`);
	}
};
;null as any as Actions;