import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getNotifications, deleteNotification } from '$lib/server/notifications-store';

export const load: PageServerLoad = async ({ locals }) => {
	const role = locals.user!.role;
	if (role !== 'admin' && role !== 'reviewer') redirect(302, '/hub/admin/dashboard');
	return { notifications: await getNotifications(locals.user!) };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const actor = locals.user!;
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'id required' });
		await deleteNotification(actor, id);
	}
};
