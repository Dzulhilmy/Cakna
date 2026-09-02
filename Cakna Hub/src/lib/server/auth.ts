// Hub authentication via the Cakna main app session cookie.
// SvelteKit verifies identity with Cakna API, then resolves the Hub user
// from the Rust hub-server (PostgreSQL-backed).
import { env } from '$env/dynamic/private';
import type { HubUser, Role } from '$lib/types';
import { resolveUser, hubGet, hubPut, hubDelete } from './hub-api';

function apiBase(): string {
	return (env.CAKNA_API_URL ?? 'https://cakna.org').replace(/\/$/, '');
}

// ─── Cakna session check ────────────────────────────────────────────────────

type CaknaMe = { id: string; email: string; name: string; is_admin: boolean };

type CaknaUserRecord = {
	id: string;
	email: string;
	name: string | null;
	login_method: string;
	is_admin: boolean;
	last_login: number | null;
};

async function checkCaknaSession(cookie: string | null): Promise<CaknaMe | null> {
	if (!cookie) return null;
	try {
		const res = await fetch(`${apiBase()}/api/auth/me`, {
			headers: { cookie },
			signal: AbortSignal.timeout(4000)
		});
		if (!res.ok) return null;
		return (await res.json()) as CaknaMe;
	} catch {
		return null;
	}
}

export async function getCurrentUser(cookieHeader: string | null): Promise<HubUser | null> {
	const devEmail = env.DEV_USER_EMAIL;
	if (devEmail) {
		try {
			return await resolveUser(devEmail, 'Dev Admin');
		} catch {
			return null;
		}
	}
	const me = await checkCaknaSession(cookieHeader);
	if (!me) return null;
	try {
		return await resolveUser(me.email, me.name ?? '');
	} catch {
		return null;
	}
}

// ─── Cakna → Hub user sync ──────────────────────────────────────────────────

async function fetchCaknaUserList(cookieHeader: string): Promise<CaknaUserRecord[]> {
	try {
		const res = await fetch(`${apiBase()}/api/admin/users`, {
			headers: { cookie: cookieHeader },
			signal: AbortSignal.timeout(10000)
		});
		if (!res.ok) return [];
		const { users } = (await res.json()) as { me: string; users: CaknaUserRecord[] };
		return users.filter((u) => !!u.email);
	} catch {
		return [];
	}
}

export async function listCaknaUsers(cookieHeader: string): Promise<CaknaUserRecord[]> {
	return fetchCaknaUserList(cookieHeader);
}

export async function syncCaknaUsers(cookieHeader: string): Promise<{ synced: number }> {
	const users = await fetchCaknaUserList(cookieHeader);
	if (!users.length) throw new Error('Could not reach Cakna user list');
	let synced = 0;
	for (const u of users) {
		await resolveUser(u.email, u.name ?? '');
		synced++;
	}
	return { synced };
}

// ─── User queries ────────────────────────────────────────────────────────────

export async function listHubUsers(actor: HubUser): Promise<HubUser[]> {
	return hubGet<HubUser[]>(actor, '/users');
}

export async function getHubUserById(actor: HubUser, id: string): Promise<HubUser | undefined> {
	const users = await listHubUsers(actor);
	return users.find((u) => u.id === id);
}

export async function getHubUserByEmail(actor: HubUser, email: string): Promise<HubUser | undefined> {
	const key = email.trim().toLowerCase();
	const users = await listHubUsers(actor);
	return users.find((u) => u.email.toLowerCase() === key);
}

// ─── Admin management ───────────────────────────────────────────────────────

export async function setUserRole(actor: HubUser, id: string, role: Role): Promise<{ ok: boolean; error?: string }> {
	try {
		await hubPut<HubUser>(actor, `/users/${id}/role`, { role });
		return { ok: true };
	} catch (e) {
		console.error('[hub] setUserRole failed:', e);
		return { ok: false, error: String(e) };
	}
}

export async function setUserStatus(actor: HubUser, id: string, status: 'active' | 'pending'): Promise<{ ok: boolean; error?: string }> {
	try {
		await hubPut<HubUser>(actor, `/users/${id}/status`, { status });
		return { ok: true };
	} catch (e) {
		console.error('[hub] setUserStatus failed:', e);
		return { ok: false, error: String(e) };
	}
}

export async function setUserDepartment(actor: HubUser, id: string, department: string): Promise<{ ok: boolean; error?: string }> {
	try {
		await hubPut<HubUser>(actor, `/users/${id}/department`, { department });
		return { ok: true };
	} catch (e) {
		console.error('[hub] setUserDepartment failed:', e);
		return { ok: false, error: String(e) };
	}
}

export async function deleteUser(actor: HubUser, id: string): Promise<boolean> {
	try {
		await hubDelete<unknown>(actor, `/users/${id}`);
		return true;
	} catch {
		return false;
	}
}
