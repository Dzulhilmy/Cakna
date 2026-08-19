// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getNotifications, deleteNotification } from '$lib/server/notifications-store';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const role = locals.user!.role;
	if (role !== 'admin' && role !== 'reviewer') redirect(302, '/hub/admin/dashboard');
	return { notifications: await getNotifications(locals.user!) };
};

export const actions = {
	delete: async ({ request, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'id required' });
		await deleteNotification(actor, id);
	}
};
;null as any as Actions;