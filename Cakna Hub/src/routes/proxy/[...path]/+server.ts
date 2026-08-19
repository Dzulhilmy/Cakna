import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const res = await fetch(`https://cakna.org/${params.path}`);
	const body = await res.arrayBuffer();
	return new Response(body, {
		status: res.status,
		headers: {
			'content-type': res.headers.get('content-type') ?? 'application/octet-stream',
			'cache-control': 'public, max-age=3600'
		}
	});
};
