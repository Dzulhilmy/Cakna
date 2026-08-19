import { redirect } from '@sveltejs/kit';
import { g as getSiteContent } from '../../../../../../chunks/site-store.js-DEAD0F4a.js';

const load = async ({ locals }) => {
  if (locals.user.role !== "admin") redirect(302, "/hub/admin/dashboard");
  return { content: await getSiteContent(locals.user) };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-DsfCwMrN.js.map
