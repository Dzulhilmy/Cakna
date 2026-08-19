import { a as getEvents } from '../../../../chunks/society-store.js-BP7iPMbM.js';

const load = async ({ locals }) => ({
  events: await getEvents(locals.user)
});

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-Dx8MdJLz.js.map
