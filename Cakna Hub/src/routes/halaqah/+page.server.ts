import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

function caknaBase() {
	return (env.CAKNA_API_URL ?? 'https://cakna.org').replace(/\/$/, '');
}

export const load: PageServerLoad = async ({ request }) => {
	const cookie = request.headers.get('cookie') ?? '';
	const base = caknaBase();
	const [roomsRes, meRes] = await Promise.allSettled([
		fetch(`${base}/api/halaqah/rooms`, { headers: { cookie }, signal: AbortSignal.timeout(5000) }),
		fetch(`${base}/api/auth/me`, { headers: { cookie }, signal: AbortSignal.timeout(4000) })
	]);

	let rooms: ActiveRoom[] = [];
	if (roomsRes.status === 'fulfilled' && roomsRes.value.ok) {
		const body = await roomsRes.value.json();
		rooms = Array.isArray(body) ? body : (body.rooms ?? []);
	}

	let isAdmin = false;
	if (meRes.status === 'fulfilled' && meRes.value.ok) {
		const me = await meRes.value.json() as { is_admin?: boolean };
		isAdmin = me.is_admin === true;
	}

	return { rooms, isAdmin };
};

export interface ActiveRoom {
	id: string;
	slug: string;
	title: string;
	host_name?: string;
	created_at: string;
	member_count?: number;
}
