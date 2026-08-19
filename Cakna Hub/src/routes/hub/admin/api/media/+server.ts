import type { RequestHandler } from './$types';
import { listMedia, saveMedia } from '$lib/server/media-store';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401);
	const files = await listMedia(locals.user);
	return json(files);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401);
	const form = await request.formData();
	const file = form.get('file') as File | null;
	if (!file || !file.size) return json({ error: 'No file selected' }, { status: 400 });
	const buffer = Buffer.from(await file.arrayBuffer());
	try {
		const url = await saveMedia(locals.user, file.name, buffer);
		return json({ url });
	} catch (e) {
		return json({ error: String(e) }, { status: 500 });
	}
};
