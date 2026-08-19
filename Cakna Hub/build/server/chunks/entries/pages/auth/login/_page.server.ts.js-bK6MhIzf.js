import { redirect, fail } from '@sveltejs/kit';
import { b as private_env } from '../../../../chunks/shared-server.js-DaWdgxVh.js';

function apiBase() {
  return (private_env.CAKNA_API_URL ?? "https://cakna.org").replace(/\/$/, "");
}
const load = async ({ locals, url }) => {
  const next = url.searchParams.get("next");
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/hub";
  if (locals.user) redirect(302, safeNext);
  return { error: url.searchParams.get("error"), next: safeNext };
};
const actions = {
  login: async ({ request, cookies, url }) => {
    const next = url.searchParams.get("next");
    const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/hub";
    const form = await request.formData();
    const email = form.get("email")?.trim() ?? "";
    const password = form.get("password") ?? "";
    if (!email || !password) {
      return fail(400, { error: "Sila isi semua maklumat." });
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
      return fail(503, { error: "Tidak dapat menghubungi pelayan. Cuba lagi." });
    }
    if (res.status === 401) return fail(401, { error: "Emel atau kata laluan tidak sah." });
    if (!res.ok) return fail(res.status, { error: "Log masuk gagal. Cuba lagi." });
    const setCookie = res.headers.get("set-cookie") ?? "";
    const match = setCookie.match(/cakna_session=([^;]+)/);
    if (!match) return fail(500, { error: "Sesi tidak diterima. Cuba lagi." });
    cookies.set("cakna_session", match[1], {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60
    });
    redirect(302, safeNext);
  },
  sso: async ({ request, url }) => {
    const form = await request.formData();
    const next = form.get("next") ?? url.searchParams.get("next") ?? "/hub";
    const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/hub";
    redirect(302, `/auth/sso/start?next=${encodeURIComponent(safeNext)}`);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-bK6MhIzf.js.map
