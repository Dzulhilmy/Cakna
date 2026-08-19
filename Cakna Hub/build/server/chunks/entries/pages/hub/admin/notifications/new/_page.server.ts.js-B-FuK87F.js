import { fail, redirect } from '@sveltejs/kit';
import { a as addNotification } from '../../../../../../chunks/notifications-store.js-Bundc_u1.js';

const load = async ({ locals }) => {
  const role = locals.user.role;
  if (role !== "admin" && role !== "reviewer") redirect(302, "/hub/admin/dashboard");
  return {};
};
const actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const title = form.get("title")?.trim();
    const content = form.get("content")?.trim();
    const callout = form.get("callout")?.trim() ?? "";
    const type = form.get("type") ?? "umum";
    const audience = form.get("audience") ?? "all";
    if (!title || !content) return fail(400, { error: "Title and content required." });
    await addNotification(locals.user, { type, title, content, callout, audience });
    redirect(302, "/hub/admin/dashboard");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-B-FuK87F.js.map
