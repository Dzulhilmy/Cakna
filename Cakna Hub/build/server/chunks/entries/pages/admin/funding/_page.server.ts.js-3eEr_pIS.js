import { g as getFundingApplications } from '../../../../chunks/society-store.js-BP7iPMbM.js';

const load = async ({ locals }) => ({
  applications: await getFundingApplications(locals.user)
});

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-3eEr_pIS.js.map
