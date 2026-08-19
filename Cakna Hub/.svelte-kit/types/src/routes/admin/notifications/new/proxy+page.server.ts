// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { addNotification } from '$lib/server/notifications-store';
import type { NotificationType } from '$lib/types';
export const load = async () => ({});
export const actions = {
	default: async ({ request, locals }: import('./$types').RequestEvent) => {
		const form = await request.formData();
		const title = (form.get('title') as string)?.trim();
		const content = (form.get('content') as string)?.trim();
		const callout = (form.get('callout') as string)?.trim() ?? '';
		const type = (form.get('type') as NotificationType) ?? 'umum';
		const audience = (form.get('audience') as string) ?? 'all';
		if (!title || !content) return fail(400, { error: 'Title and content required.' });
		await addNotification(locals.user!, { type, title, content, callout, audience });
		redirect(302, '/admin/dashboard');
	}
};
;null as any as PageServerLoad;;null as any as Actions;