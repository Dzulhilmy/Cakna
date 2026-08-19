import { g as getSiteContent } from '../../../../../chunks/site-store.js-DEAD0F4a.js';

const load = async ({ locals }) => ({
  content: await getSiteContent(locals.user)
});

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-1AiL-WyG.js.map
