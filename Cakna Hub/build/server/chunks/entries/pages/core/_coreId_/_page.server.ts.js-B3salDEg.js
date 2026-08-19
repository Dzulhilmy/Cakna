import { error } from '@sveltejs/kit';
import { b as getProgramsForCore } from '../../../../chunks/programs-store.js-DL9GfvXe.js';
import { g as getCore } from '../../../../chunks/cores.js-m0JlC_eV.js';

const load = async ({ params, locals }) => {
  const core = getCore(params.coreId);
  if (!core) error(404, "Core not found");
  const programs = await getProgramsForCore(locals.user ?? void 0, params.coreId);
  return { core, programs };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-B3salDEg.js.map
