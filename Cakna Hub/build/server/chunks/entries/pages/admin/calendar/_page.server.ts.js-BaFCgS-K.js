import { a as getEvents, g as getFundingApplications } from '../../../../chunks/society-store.js-BP7iPMbM.js';

const load = async ({ locals }) => {
  const actor = locals.user;
  const [events, applications] = await Promise.all([getEvents(actor), getFundingApplications(actor)]);
  return { events, applications: applications.filter((a) => a.status === "approved") };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-BaFCgS-K.js.map
