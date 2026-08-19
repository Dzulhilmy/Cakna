import { redirect } from '@sveltejs/kit';
import { b as private_env } from '../../../chunks/shared-server.js-DaWdgxVh.js';

const actions = {
  default: async ({ fetch, cookies }) => {
    const apiBase = (private_env.CAKNA_API_URL ?? "https://cakna.org").replace(/\/$/, "");
    try {
      await fetch(`${apiBase}/api/auth/logout`, {
        method: "POST",
        signal: AbortSignal.timeout(5e3)
      });
    } catch {
    }
    cookies.delete("cakna_session", { path: "/" });
    redirect(303, "/");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-C_B0xZjw.js.map
