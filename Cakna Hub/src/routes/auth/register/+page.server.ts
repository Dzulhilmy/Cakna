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
	register: async ({ request }) => {
		const form = await request.formData();
		const email = (form.get('email') as string | null)?.trim() ?? '';
		const password = (form.get('password') as string | null) ?? '';
		const confirmPassword = (form.get('confirm_password') as string | null) ?? '';

		if (!email || !password || !confirmPassword) {
			return fail(400, { error: 'Sila isi semua maklumat.' });
		}
		if (password !== confirmPassword) {
			return fail(400, { error: 'Kata laluan tidak sepadan.' });
		}
		if (password.length < 8) {
			return fail(400, { error: 'Kata laluan mesti sekurang-kurangnya 8 aksara.' });
		}

		let res: Response;
		try {
			res = await fetch(`${apiBase()}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.toLowerCase(), password }),
				signal: AbortSignal.timeout(8000)
			});
		} catch {
			return fail(503, { error: 'Tidak dapat menghubungi pelayan. Cuba lagi.' });
		}

		if (res.status === 409) return fail(409, { error: 'Emel ini sudah didaftarkan. Sila log masuk.' });
		if (res.status === 422) return fail(422, { error: 'Emel atau kata laluan tidak sah.' });
		if (!res.ok) return fail(res.status, { error: 'Pendaftaran gagal. Cuba lagi.' });

		// Don't auto-login — redirect to login so the user verifies credentials themselves.
		redirect(302, '/auth/login?registered=1');
	},

	sso: async ({ request, url }) => {
		const form = await request.formData();
		const next = (form.get('next') as string | null) ?? url.searchParams.get('next') ?? '/hub';
		const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/hub';
		redirect(302, `/auth/sso/start?next=${encodeURIComponent(safeNext)}`);
	}
};
