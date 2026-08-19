import { fail, redirect } from "@sveltejs/kit";
import { g as getSiteContent, s as saveSiteContent } from "../../../../../../chunks/site-store.js";
const load = async ({ params, locals }) => {
  if (locals.user.role !== "admin") redirect(302, "/hub/admin/dashboard");
  return { content: await getSiteContent(locals.user), section: params.section };
};
const actions = {
  save: async ({ request, params, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
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
    return { saved: params.section };
  },
  customSections: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const form = await request.formData();
    const rawJson = form.get("json");
    const pageKey = form.get("pageKey") ?? "";
    let sections;
    try {
      sections = JSON.parse(rawJson);
    } catch {
      return fail(400, { error: "Invalid JSON" });
    }
    const current = await getSiteContent(actor);
    await saveSiteContent(actor, {
      ...current,
      customSections: { ...current.customSections, [pageKey]: sections }
    });
    return { saved: "customSections" };
  },
  sectionOrder: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const form = await request.formData();
    const rawJson = form.get("json");
    const pageKey = form.get("pageKey") ?? "";
    let order;
    try {
      order = JSON.parse(rawJson);
    } catch {
      return fail(400, { error: "Invalid JSON" });
    }
    const current = await getSiteContent(actor);
    await saveSiteContent(actor, {
      ...current,
      sectionOrder: { ...current.sectionOrder ?? {}, [pageKey]: order }
    });
    return { saved: "sectionOrder" };
  }
};
export {
  actions,
  load
};
