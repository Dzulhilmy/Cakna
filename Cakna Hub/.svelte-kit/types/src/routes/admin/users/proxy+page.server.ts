// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import type { Role } from '$lib/types';
import { listHubUsers, setUserRole, setUserStatus, deleteUser, syncCaknaUsers } from '$lib/server/auth';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const actor = locals.user!;
	const users = await listHubUsers(actor);
	return { users, pending: users.filter((u) => u.status === 'pending').length };
};

export const actions = {
	setRole: async ({ request, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		const form = await request.formData();
		const id = form.get('id') as string;
		const role = form.get('role') as Role;
		if (!id || !role) return fail(400, { error: 'Invalid input' });
		await setUserRole(actor, id, role);
	},
	setStatus: async ({ request, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		const form = await request.formData();
		const id = form.get('id') as string;
		const status = form.get('status') as 'active' | 'pending';
		if (!id || !status) return fail(400, { error: 'Invalid input' });
		await setUserStatus(actor, id, status);
	},
	delete: async ({ request, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'Invalid input' });
		await deleteUser(actor, id);
	},
	syncUsers: async ({ request, locals }: import('./$types').RequestEvent) => {
		locals.user!;
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