import { g as getFundingApplications } from "../../../../chunks/society-store.js";
const load = async ({ locals }) => ({
  applications: await getFundingApplications(locals.user)
});
export {
  load
};
