import { redirect, fail } from '@sveltejs/kit';
import { b as private_env } from '../../../../chunks/shared-server.js-DaWdgxVh.js';

function apiBase() {
  return (private_env.CAKNA_API_URL ?? "https://cakna.org").replace(/\/$/, "");
}
const load = async ({ locals, url }) => {
  if (locals.user) redirect(302, "/admin/dashboard");
  return { error: url.searchParams.get("error") };
};
const actions = {
  login: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("email")?.trim() ?? "";
    const password = form.get("password") ?? "";
    if (!email || !password) {
      return fail(400, { error: "Please fill in all fields." });
    }
    let res;
    try {
      res = await fetch(`${apiBase()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
        signal: AbortSignal.timeout(8e3)
      });
    } catch {
      return fail(503, { error: "Could not reach server. Please try again." });
    }
    if (res.status === 401) return fail(401, { error: "Invalid email or password." });
    if (!res.ok) return fail(res.status, { error: "Login failed. Please try again." });
    const setCookie = res.headers.get("set-cookie") ?? "";
    const match = setCookie.match(/cakna_session=([^;]+)/);
    if (!match) return fail(500, { error: "Session not received. Please try again." });
    cookies.set("cakna_session", match[1], {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60
    });
    redirect(302, "/admin/dashboard");
  },
  sso: async () => {
    redirect(302, `${apiBase()}/api/auth/sso/start`);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-DWigFndL.js.map
