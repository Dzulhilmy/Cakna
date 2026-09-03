import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const base = (env.CAKNA_API_INTERNAL_URL ?? env.CAKNA_API_URL ?? 'https://cakna.org').replace(/\/$/, '');
	const res = await fetch(`${base}/${params.path}`);
	const body = await res.arrayBuffer();
	return new Response(body, {
		status: res.status,
		headers: {
			'content-type': res.headers.get('content-type') ?? 'application/octet-stream',
			'cache-control': 'public, max-age=3600'
		}
	});
};
