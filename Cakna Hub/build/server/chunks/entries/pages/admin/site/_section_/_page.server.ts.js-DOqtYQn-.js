import { fail, redirect } from '@sveltejs/kit';
import { g as getSiteContent, s as saveSiteContent } from '../../../../../chunks/site-store.js-DEAD0F4a.js';

const load = async ({ params, locals }) => ({
  content: await getSiteContent(locals.user),
  section: params.section
});
const actions = {
  default: async ({ request, params, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const rawJson = form.get("json");
    let patch;
    try {
      patch = JSON.parse(rawJson);
    } catch {
      return fail(400, { error: "Invalid JSON" });
    }
    const current = await getSiteContent(actor);
    await saveSiteContent(actor, { ...current, [params.section]: patch });
    redirect(302, "/admin/site");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-DOqtYQn-.js.map
