import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

function caknaBase() {
	return (env.CAKNA_API_URL ?? 'https://cakna.org').replace(/\/$/, '');
}

async function caknaReq(cookie: string, path: string, opts?: RequestInit) {
	return fetch(`${caknaBase()}${path}`, {
		...opts,
		headers: { ...(opts?.headers as Record<string, string> | undefined), cookie },
		signal: AbortSignal.timeout(8000)
	});
}

export const load: PageServerLoad = async ({ locals, request }) => {
	if (locals.user?.role !== 'admin') redirect(302, '/hub/admin/dashboard');
	const cookie = request.headers.get('cookie') ?? '';
	try {
		const res = await caknaReq(cookie, '/api/halaqah/rooms');
		const rooms: HalaqahRoom[] = res.ok ? await res.json() : [];
		return { rooms };
	} catch {
		return { rooms: [] as HalaqahRoom[] };
	}
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const cookie = request.headers.get('cookie') ?? '';
		const form = await request.formData();
		const title = (form.get('title') as string ?? '').trim();
		if (!title) return fail(400, { error: 'Tajuk sesi diperlukan.' });
		const res = await caknaReq(cookie, '/api/halaqah/rooms', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ title })
		});
		if (!res.ok) {
			const body = await res.text().catch(() => '');
			return fail(res.status, { error: `Gagal: ${res.status} ${body}` });
		}
		const room: HalaqahRoom = await res.json();
		return { created: true, slug: room.slug };
	},
	close: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const cookie = request.headers.get('cookie') ?? '';
		const form = await request.formData();
		const slug = (form.get('slug') as string ?? '').trim();
		if (!slug) return fail(400, { error: 'Slug diperlukan.' });
		const res = await caknaReq(cookie, `/api/halaqah/rooms/${slug}/close`, { method: 'POST' });
		if (!res.ok) return fail(res.status, { error: `Gagal menutup: ${res.status}` });
		return { closed: true };
	}
};

export interface HalaqahRoom {
	id: string;
	slug: string;
	title: string;
	host_name?: string;
	created_at: string;
	member_count?: number;
}
