import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getFundingApplications } from '$lib/server/society-store';
import { fundingByCluster, fundingByState } from '$lib/reports';
export const load: PageServerLoad = async ({ locals }) => {
	const role = locals.user!.role;
	if (role !== 'admin' && role !== 'reviewer') redirect(302, '/hub/admin/dashboard');
	const applications = await getFundingApplications(locals.user!);
	return {
		byCluster: fundingByCluster(applications),
		byState: fundingByState(applications),
		total: applications.length
	};
};
