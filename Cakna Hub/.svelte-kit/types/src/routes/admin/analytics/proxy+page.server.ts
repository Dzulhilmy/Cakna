// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getFundingApplications } from '$lib/server/society-store';
import { fundingByCluster, fundingByState } from '$lib/reports';
export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const applications = await getFundingApplications(locals.user!);
	return {
		byCluster: fundingByCluster(applications),
		byState: fundingByState(applications),
		total: applications.length
	};
};
