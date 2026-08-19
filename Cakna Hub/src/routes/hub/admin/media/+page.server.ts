import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { listMedia, saveMedia, deleteMedia } from '$lib/server/media-store';
export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user!.role !== 'admin') redirect(302, '/hub/admin/dashboard');
	return { files: await listMedia(locals.user!) };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const name = form.get('name') as string;
		if (!name) return fail(400, { error: 'name required' });
		await deleteMedia(actor, name);
	},
	upload: async ({ request, locals }) => {
		const actor = locals.user!;
		if (actor.role !== 'admin') return fail(403, { error: 'Forbidden' });
		const form = await request.formData();
		const file = form.get('file') as File | null;
		if (!file || !file.size) return fail(400, { error: 'No file selected.' });
		const buffer = Buffer.from(await file.arrayBuffer());
		try {
			await saveMedia(actor, file.name, buffer);
		} catch (e) {
			return fail(500, { error: `Upload failed: ${String(e)}` });
		}
	}
};
