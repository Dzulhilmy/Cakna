import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Role, UserStatus } from '$lib/types';
import { listHubUsers, listCaknaUsers, setUserRole, setUserStatus, setUserDepartment, deleteUser, syncCaknaUsers } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, request }) => {
	const actor = locals.user!;
	if (actor.role !== 'admin') redirect(302, '/hub/admin/dashboard');

	const cookie = request.headers.get('cookie') ?? '';
	const [hubUsers, caknaUsers] = await Promise.all([listHubUsers(actor), listCaknaUsers(cookie)]);

	const hubEmails = new Set(hubUsers.map((u) => u.email.toLowerCase()));

	const caknaOnly = caknaUsers
		.filter((u) => !hubEmails.has(u.email.toLowerCase()))
		.map((u) => ({
			id: `cakna:${u.id}`,
			email: u.email,
			name: u.name ?? '',
			role: 'member' as Role,
			branch: '',
			status: 'pending' as UserStatus,
			createdAt: u.last_login
				? new Date(u.last_login * 1000).toISOString()
				: new Date().toISOString(),
			caknaOnly: true as const
		}));

	const users = [
		...hubUsers.map((u) => ({ ...u, caknaOnly: false as const })),
		...caknaOnly
	];

	return {
		users,
		hubCount: hubUsers.length,
		caknaOnlyCount: caknaOnly.length,
		pending: users.filter((u) => u.status === 'pending' && !u.caknaOnly).length
	};
};

export const actions: Actions = {
	setRole: async ({ request, locals }) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const id = form.get('id') as string;
		const role = form.get('role') as Role;
		if (!id || !role) return fail(400, { error: 'Invalid input' });
		const res = await setUserRole(actor, id, role);
		if (!res.ok) return fail(500, { error: res.error ?? 'Failed to update role.' });
		return { updated: 'role' };
	},
	setStatus: async ({ request, locals }) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const id = form.get('id') as string;
		const status = form.get('status') as 'active' | 'pending';
		if (!id || !status) return fail(400, { error: 'Invalid input' });
		const res = await setUserStatus(actor, id, status);
		if (!res.ok) return fail(500, { error: res.error ?? 'Failed to update status.' });
		return { updated: 'status' };
	},
	setDepartment: async ({ request, locals }) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const id = form.get('id') as string;
		const department = (form.get('department') as string) ?? '';
		if (!id) return fail(400, { error: 'Invalid input' });
		const res = await setUserDepartment(actor, id, department);
		if (!res.ok) return fail(500, { error: res.error ?? 'Failed to update department.' });
		return { updated: 'department' };
	},
	delete: async ({ request, locals }) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'Invalid input' });
		await deleteUser(actor, id);
	},
	syncUsers: async ({ request, locals }) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const cookie = request.headers.get('cookie') ?? '';
		try {
			const { synced } = await syncCaknaUsers(cookie);
			return { synced };
		} catch (e) {
			return fail(500, { error: String(e) });
		}
	}
};
