import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

function caknaBase() {
	return (env.CAKNA_API_URL ?? 'https://cakna.org').replace(/\/$/, '');
}

async function caknaGet<T>(cookie: string, path: string): Promise<T> {
	const res = await fetch(`${caknaBase()}${path}`, {
		headers: { cookie },
		signal: AbortSignal.timeout(8000)
	});
	if (!res.ok) throw new Error(`${path}: ${res.status}`);
	return res.json();
}

export const load: PageServerLoad = async ({ request }) => {
	const cookie = request.headers.get('cookie') ?? '';
	try {
		const [overview, userAdmin] = await Promise.all([
			caknaGet<OverviewResponse>(cookie, '/api/admin/overview'),
			caknaGet<UsersResponse>(cookie, '/api/admin/users')
		]);
		return { overview, userAdmin, error: null };
	} catch (e) {
		return { overview: null, userAdmin: null, error: String(e) };
	}
};

export const actions: Actions = {
	setRole: async ({ request }) => {
		const cookie = request.headers.get('cookie') ?? '';
		const form = await request.formData();
		const user_id = form.get('user_id') as string;
		const make_admin = form.get('make_admin') === 'true';
		if (!user_id) return fail(400, { error: 'Invalid input' });
		try {
			const res = await fetch(`${caknaBase()}/api/admin/set-role`, {
				method: 'POST',
				headers: { 'content-type': 'application/json', cookie },
				body: JSON.stringify({ user_id, make_admin }),
				signal: AbortSignal.timeout(8000)
			});
			if (!res.ok) {
				const body = await res.text().catch(() => '');
				return fail(res.status, { error: `Gagal: ${res.status} ${body}` });
			}
			return { ok: true };
		} catch (e) {
			return fail(500, { error: String(e) });
		}
	}
};

// ─── Types ──────────────────────────────────────────────────────────────────

interface WeeklyDay {
	date: string;
	dow: number;
	pagi: number;
	petang: number;
}

interface StreakLeader {
	name: string | null;
	email: string;
	initials: string;
	streak: number;
	login_method: string;
}

interface UserRow {
	id: string;
	name: string | null;
	email: string;
	initials: string;
	login_method: string;
	last_active_iso: number | null;
	streak: number;
	sessions_month: number;
	headline_pct: number;
	version: string;
}

interface OverviewResponse {
	kpis: { total_users: number; active_today: number; avg_completion: number; sessions_week: number };
	login_split: { qcxis: number; email: number };
	weekly: WeeklyDay[];
	streak_leaders: StreakLeader[];
	generated_at: number;
	users: UserRow[];
}

interface AdminUserRow {
	id: string;
	email: string;
	name: string | null;
	login_method: string;
	last_login: number | null;
	is_admin: boolean;
	allowlisted: boolean;
	effective_admin: boolean;
}

interface UsersResponse {
	me: string;
	users: AdminUserRow[];
}
