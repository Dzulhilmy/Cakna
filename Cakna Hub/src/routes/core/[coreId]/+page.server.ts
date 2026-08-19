import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getProgramsForCore } from '$lib/server/programs-store';
import { getCore } from '$lib/cores';

export const load: PageServerLoad = async ({ params, locals }) => {
	const core = getCore(params.coreId);
	if (!core) error(404, 'Core not found');
	const programs = await getProgramsForCore(locals.user ?? undefined, params.coreId);
	return { core, programs };
};
