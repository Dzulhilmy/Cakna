import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { listMedia, saveMedia, deleteMedia } from '$lib/server/media-store';
export const load: PageServerLoad = async ({ locals }) => ({
	files: await listMedia(locals.user!)
});

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const actor = locals.user!;
		const form = await request.formData();
		const name = form.get('name') as string;
		if (!name) return fail(400, { error: 'name required' });
		await deleteMedia(actor, name);
	}
};
