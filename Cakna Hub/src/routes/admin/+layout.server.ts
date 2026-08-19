import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) redirect(302, '/admin/login');
	if (user.role !== 'admin' && user.role !== 'reviewer') redirect(302, '/');
	return { user };
};
