import type { PageServerLoad } from './$types';
import { getFundingApplications } from '$lib/server/society-store';
import { fundingByCluster, fundingByState } from '$lib/reports';
export const load: PageServerLoad = async ({ locals }) => {
	const applications = await getFundingApplications(locals.user!);
	return {
		byCluster: fundingByCluster(applications),
		byState: fundingByState(applications),
		total: applications.length
	};
};
