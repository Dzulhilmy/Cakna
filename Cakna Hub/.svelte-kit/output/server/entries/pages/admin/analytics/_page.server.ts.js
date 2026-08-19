import { g as getFundingApplications } from "../../../../chunks/society-store.js";
import { f as fundingByState, a as fundingByCluster } from "../../../../chunks/reports.js";
const load = async ({ locals }) => {
  const applications = await getFundingApplications(locals.user);
  return {
    byCluster: fundingByCluster(applications),
    byState: fundingByState(applications),
    total: applications.length
  };
};
export {
  load
};
