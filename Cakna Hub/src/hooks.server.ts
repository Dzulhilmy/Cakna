import type { Handle } from '@sveltejs/kit';
import { getCurrentUser } from '$lib/server/auth';

const LOGIN_PAGES = ['/auth/login'];

export const handle: Handle = async ({ event, resolve }) => {
	const cookie = event.request.headers.get('cookie');
	event.locals.user = await getCurrentUser(cookie);

	const path = event.url.pathname;

	if (LOGIN_PAGES.includes(path)) return resolve(event);

	const needsAdminAuth = path.startsWith('/hub/admin');
	const needsAuth =
		needsAdminAuth ||
		path.startsWith('/hub/staff') ||
		path.startsWith('/society') ||
		path.startsWith('/core') ||
		path.startsWith('/notifications');

	if (needsAuth && !event.locals.user) {
		const dest = `/auth/login?next=${encodeURIComponent(path)}`;
		return new Response(null, { status: 302, headers: { location: dest } });
	}

	if (needsAdminAuth) {
		const role = event.locals.user?.role;
		if (role !== 'admin' && role !== 'reviewer' && role !== 'pic') {
			return new Response(null, { status: 302, headers: { location: '/hub' } });
		}
	}

	return resolve(event);
};
