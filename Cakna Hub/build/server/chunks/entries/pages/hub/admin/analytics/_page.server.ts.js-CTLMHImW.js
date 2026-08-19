import { redirect } from '@sveltejs/kit';
import { g as getFundingApplications } from '../../../../../chunks/society-store.js-BP7iPMbM.js';
import { f as fundingByState, a as fundingByCluster } from '../../../../../chunks/reports.js-CsmNuGrO.js';

const load = async ({ locals }) => {
  const role = locals.user.role;
  if (role !== "admin" && role !== "reviewer") redirect(302, "/hub/admin/dashboard");
  const applications = await getFundingApplications(locals.user);
  return {
    byCluster: fundingByCluster(applications),
    byState: fundingByState(applications),
    total: applications.length
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-CTLMHImW.js.map
