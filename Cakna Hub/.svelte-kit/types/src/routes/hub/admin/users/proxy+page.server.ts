// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Role } from '$lib/types';
import { listHubUsers, setUserRole, setUserStatus, setUserDepartment, deleteUser, syncCaknaUsers } from '$lib/server/auth';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const actor = locals.user!;
	if (actor.role !== 'admin') redirect(302, '/hub/admin/dashboard');
	const users = await listHubUsers(actor);
	return { users, pending: users.filter((u) => u.status === 'pending').length };
};

export const actions = {
	setRole: async ({ request, locals }: import('./$types').RequestEvent) => {
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
	setStatus: async ({ request, locals }: import('./$types').RequestEvent) => {
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
	setDepartment: async ({ request, locals }: import('./$types').RequestEvent) => {
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
	delete: async ({ request, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'Invalid input' });
		await deleteUser(actor, id);
	},
	syncUsers: async ({ request, locals }: import('./$types').RequestEvent) => {
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
;null as any as Actions;