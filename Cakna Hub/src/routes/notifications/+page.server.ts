import type { PageServerLoad } from './$types';
import { getNoticesForUser } from '$lib/server/notices-store';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) return { notices: [] };
	const notices = await getNoticesForUser(user);
	return { notices, user };
};
