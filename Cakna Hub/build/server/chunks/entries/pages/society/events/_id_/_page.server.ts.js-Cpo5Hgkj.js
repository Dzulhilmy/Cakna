import { error } from '@sveltejs/kit';
import { c as getEventById } from '../../../../../chunks/society-store.js-BP7iPMbM.js';

const load = async ({ params, locals }) => {
  const event = await getEventById(locals.user, params.id);
  if (!event) error(404, "Event not found");
  return { event };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-Cpo5Hgkj.js.map
