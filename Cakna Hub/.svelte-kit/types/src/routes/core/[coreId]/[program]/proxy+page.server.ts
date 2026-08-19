// @ts-nocheck
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { resolveProgram } from '$lib/server/programs-store';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	const resolved = await resolveProgram(locals.user ?? undefined, params.coreId, params.program);
	if (!resolved) error(404, 'Program not found');
	return { core: resolved.core, program: resolved.program };
};
