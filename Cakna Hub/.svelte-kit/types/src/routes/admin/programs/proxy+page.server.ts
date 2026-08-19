// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getPrograms, createProgram, deleteProgram } from '$lib/server/programs-store';
export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => ({
	programs: await getPrograms(locals.user!)
});

export const actions = {
	create: async ({ request, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		const form = await request.formData();
		const coreId = form.get('coreId') as string;
		const name = form.get('name') as string;
		const description = (form.get('description') as string) ?? '';
		if (!coreId || !name) return fail(400, { error: 'coreId and name required' });
		await createProgram(actor, { coreId, name, description });
	},
	delete: async ({ request, locals }: import('./$types').RequestEvent) => {
		const actor = locals.user!;
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'id required' });
		await deleteProgram(actor, id);
	}
};
;null as any as Actions;