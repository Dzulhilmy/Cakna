import { redirect } from '@sveltejs/kit';
import { c as cores } from '../../../chunks/cores.js-m0JlC_eV.js';

const load = async ({ locals }) => {
  if (!locals.user) redirect(302, "/auth/login");
  return { cores };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-DDRTl_jl.js.map
