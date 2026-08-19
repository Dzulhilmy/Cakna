// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getFundingApplications } from '$lib/server/society-store';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => ({
	applications: await getFundingApplications(locals.user!)
});
