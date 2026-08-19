// @ts-nocheck
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	const user = locals.user;
	if (!user) redirect(302, '/auth/login?next=/hub/admin/dashboard');
	if (user.role !== 'admin' && user.role !== 'reviewer' && user.role !== 'pic') redirect(302, '/hub');
	return { user };
};
