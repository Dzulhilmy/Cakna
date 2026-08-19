import { fail, redirect } from "@sveltejs/kit";
import { g as getSiteContent, s as saveSiteContent } from "../../../../../chunks/site-store.js";
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
export {
  actions,
  load
};
