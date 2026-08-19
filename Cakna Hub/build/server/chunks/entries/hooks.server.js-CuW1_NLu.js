import { g as getCurrentUser } from '../chunks/auth.js-BboiSe4Y.js';
import '../chunks/shared-server.js-DaWdgxVh.js';
import '../chunks/hub-api.js-BLc0YvhW.js';

const LOGIN_PAGES = ["/auth/login"];
const handle = async ({ event, resolve }) => {
  const cookie = event.request.headers.get("cookie");
  event.locals.user = await getCurrentUser(cookie);
  const path = event.url.pathname;
  if (LOGIN_PAGES.includes(path)) return resolve(event);
  const needsAdminAuth = path.startsWith("/hub/admin");
  const needsAuth = needsAdminAuth || path.startsWith("/hub") || path.startsWith("/society") || path.startsWith("/core") || path.startsWith("/notifications");
  if (needsAuth && !event.locals.user) {
    const dest = `/auth/login?next=${encodeURIComponent(path)}`;
    return new Response(null, { status: 302, headers: { location: dest } });
  }
  if (needsAdminAuth) {
    const role = event.locals.user?.role;
    if (role !== "admin" && role !== "reviewer" && role !== "pic") {
      return new Response(null, { status: 302, headers: { location: "/hub" } });
    }
  }
  return resolve(event);
};

export { handle };
//# sourceMappingURL=hooks.server.js-CuW1_NLu.js.map
