// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getSiteContent } from '$lib/server/site-store';
export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	const content = await getSiteContent(locals.user ?? undefined);
	const docs = (content as Record<string, unknown>).docs as Record<string, { title: string; body: string }> ?? {};
	return { slug: params.slug, doc: docs[params.slug] ?? null, content };
};
