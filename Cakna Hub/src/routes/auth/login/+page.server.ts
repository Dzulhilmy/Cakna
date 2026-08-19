import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

function apiBase(): string {
	return (env.CAKNA_API_URL ?? 'https://cakna.org').replace(/\/$/, '');
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const next = url.searchParams.get('next');
	const safeNext = next?.startsWith('/') && !next.startsWith('//') ? next : '/hub';
	if (locals.user) redirect(302, safeNext);
	return { error: url.searchParams.get('error'), next: safeNext };
};

export const actions: Actions = {
	login: async ({ request, cookies, url }) => {
		const next = url.searchParams.get('next');
		const safeNext = next?.startsWith('/') && !next.startsWith('//') ? next : '/hub';
		const form = await request.formData();
		const email = (form.get('email') as string | null)?.trim() ?? '';
		const password = (form.get('password') as string | null) ?? '';

		if (!email || !password) {
			return fail(400, { error: 'Sila isi semua maklumat.' });
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
			return fail(503, { error: 'Tidak dapat menghubungi pelayan. Cuba lagi.' });
		}

		if (res.status === 401) return fail(401, { error: 'Emel atau kata laluan tidak sah.' });
		if (!res.ok) return fail(res.status, { error: 'Log masuk gagal. Cuba lagi.' });

		const setCookie = res.headers.get('set-cookie') ?? '';
		const match = setCookie.match(/cakna_session=([^;]+)/);
		if (!match) return fail(500, { error: 'Sesi tidak diterima. Cuba lagi.' });

		cookies.set('cakna_session', match[1], {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});

		redirect(302, safeNext);
	},

	sso: async ({ request, url }) => {
		const form = await request.formData();
		const next = (form.get('next') as string | null) ?? url.searchParams.get('next') ?? '/hub';
		const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/hub';
		redirect(302, `/auth/sso/start?next=${encodeURIComponent(safeNext)}`);
	}
};
