import { fail, redirect } from '@sveltejs/kit';
import { g as getSiteContent, s as saveSiteContent } from '../../../../../../../chunks/site-store.js-DEAD0F4a.js';

const VALID_SLUGS = ["policy", "sop", "guidelines", "manual"];
const load = async ({ params, locals }) => {
  if (locals.user.role !== "admin") redirect(302, "/hub/admin/dashboard");
  const slug = params.slug;
  if (!VALID_SLUGS.includes(slug)) redirect(302, "/hub/admin/site/docs");
  const content = await getSiteContent(locals.user);
  return { doc: content.docs[slug], slug };
};
const actions = {
  default: async ({ request, params, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const slug = params.slug;
    if (!VALID_SLUGS.includes(slug)) return fail(400, { error: "Invalid slug" });
    const form = await request.formData();
    const title = (form.get("title") ?? "").trim();
    const subtitle = (form.get("subtitle") ?? "").trim();
    const content_text = (form.get("content") ?? "").trim();
    const lastUpdated = (form.get("lastUpdated") ?? "").trim();
    const current = await getSiteContent(actor);
    await saveSiteContent(actor, {
      ...current,
      docs: {
        ...current.docs,
        [slug]: { title, subtitle, content: content_text, lastUpdated }
      }
    });
    redirect(302, "/hub/admin/site/docs");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-DgrlPnKJ.js.map
