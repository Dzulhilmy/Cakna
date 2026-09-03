import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

function caknaBase() {
	return (env.CAKNA_API_URL ?? 'https://cakna.org').replace(/\/$/, '');
}

export const load: PageServerLoad = async ({ request }) => {
	const cookie = request.headers.get('cookie') ?? '';
	try {
		const res = await fetch(`${caknaBase()}/api/halaqah/rooms`, {
			headers: { cookie },
			signal: AbortSignal.timeout(5000)
		});
		if (!res.ok) return { rooms: [] };
		return { rooms: (await res.json()) as ActiveRoom[] };
	} catch {
		return { rooms: [] };
	}
};

export interface ActiveRoom {
	id: string;
	slug: string;
	title: string;
	host_name?: string;
	created_at: string;
	member_count?: number;
}
