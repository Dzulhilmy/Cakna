import type { PageServerLoad } from './$types';
import { getFundingApplications } from '$lib/server/society-store';

export const load: PageServerLoad = async ({ locals }) => ({
	applications: await getFundingApplications(locals.user!)
});
