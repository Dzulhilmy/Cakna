import { redirect } from '@sveltejs/kit';
import { g as getSiteContent } from '../../chunks/site-store.js-DEAD0F4a.js';
import { g as getProgramsByCore } from '../../chunks/programs-store.js-DL9GfvXe.js';

const load = async ({ locals }) => {
  if (locals.user) redirect(302, "/hub");
  const [content, programsByCore] = await Promise.all([getSiteContent(), getProgramsByCore()]);
  return { content, programsByCore };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-DcAWVFek.js.map
