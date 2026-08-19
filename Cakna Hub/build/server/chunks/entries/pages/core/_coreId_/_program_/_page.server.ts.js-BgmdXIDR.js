import { error } from '@sveltejs/kit';
import { r as resolveProgram } from '../../../../../chunks/programs-store.js-DL9GfvXe.js';

const load = async ({ params, locals }) => {
  const resolved = await resolveProgram(locals.user ?? void 0, params.coreId, params.program);
  if (!resolved) error(404, "Program not found");
  return { core: resolved.core, program: resolved.program };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-BgmdXIDR.js.map
