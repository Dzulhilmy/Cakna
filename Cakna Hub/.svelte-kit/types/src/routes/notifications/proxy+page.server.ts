// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getNoticesForUser } from '$lib/server/notices-store';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const user = locals.user;
	if (!user) return { notices: [] };
	const notices = await getNoticesForUser(user);
	return { notices, user };
};
