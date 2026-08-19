// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getEvents, getFundingApplications } from '$lib/server/society-store';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const actor = locals.user!;
	const [events, applications] = await Promise.all([getEvents(actor), getFundingApplications(actor)]);
	return { events, applications: applications.filter((a) => a.status === 'approved') };
};
