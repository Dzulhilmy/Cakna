import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getPrograms, createProgram, deleteProgram, updateProgram } from '$lib/server/programs-store';
export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user!.role !== 'admin') redirect(302, '/hub/admin/dashboard');
	return { programs: await getPrograms(locals.user!) };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const actor = locals.user!;
		const form = await request.formData();
		const coreId = form.get('coreId') as string;
		const name = form.get('name') as string;
		const description = ((form.get('description') as string) ?? '').trim();
		const image = ((form.get('image') as string) ?? '').trim();
		if (!coreId || !name) return fail(400, { error: 'coreId and name required' });
		await createProgram(actor, { coreId, name, description, image });
	},
	delete: async ({ request, locals }) => {
		const actor = locals.user!;
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'id required' });
		await deleteProgram(actor, id);
	},
	update: async ({ request, locals }) => {
		const actor = locals.user!;
		const form = await request.formData();
		const id = form.get('id') as string;
		const coreId = form.get('coreId') as string;
		const name = (form.get('name') as string)?.trim();
		const description = ((form.get('description') as string) ?? '').trim();
		const image = ((form.get('image') as string) ?? '').trim();
		if (!id || !coreId || !name) return fail(400, { error: 'All fields required' });
		await updateProgram(actor, id, { coreId, name, description, image });
	}
};
