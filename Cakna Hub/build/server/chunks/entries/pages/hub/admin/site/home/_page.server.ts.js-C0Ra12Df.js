import { fail, redirect } from '@sveltejs/kit';
import { g as getSiteContent, s as saveSiteContent } from '../../../../../../chunks/site-store.js-DEAD0F4a.js';

const load = async ({ locals }) => {
  if (locals.user.role !== "admin") redirect(302, "/hub/admin/dashboard");
  return { content: await getSiteContent(locals.user) };
};
async function saveSection(request, locals, section) {
  const actor = locals.user;
  if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
  const form = await request.formData();
  const json = form.get("json");
  let patch;
  try {
    patch = JSON.parse(json);
  } catch {
    return fail(400, { error: "Invalid JSON" });
  }
  const current = await getSiteContent(actor);
  await saveSiteContent(actor, { ...current, [section]: patch });
  return { saved: section };
}
const actions = {
  brand: ({ request, locals }) => saveSection(request, locals, "brand"),
  nav: ({ request, locals }) => saveSection(request, locals, "nav"),
  hero: ({ request, locals }) => saveSection(request, locals, "hero"),
  about: ({ request, locals }) => saveSection(request, locals, "about"),
  programs: ({ request, locals }) => saveSection(request, locals, "programs"),
  impact: ({ request, locals }) => saveSection(request, locals, "impact"),
  cta: ({ request, locals }) => saveSection(request, locals, "cta"),
  homeGallery: ({ request, locals }) => saveSection(request, locals, "homeGallery"),
  partners: ({ request, locals }) => saveSection(request, locals, "partners"),
  customSections: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const form = await request.formData();
    const json = form.get("json");
    let sections;
    try {
      sections = JSON.parse(json);
    } catch {
      return fail(400, { error: "Invalid JSON" });
    }
    const current = await getSiteContent(actor);
    await saveSiteContent(actor, {
      ...current,
      customSections: { ...current.customSections, home: sections }
    });
    return { saved: "customSections" };
  },
  sectionOrder: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const form = await request.formData();
    const json = form.get("json");
    let order;
    try {
      order = JSON.parse(json);
    } catch {
      return fail(400, { error: "Invalid JSON" });
    }
    const current = await getSiteContent(actor);
    await saveSiteContent(actor, {
      ...current,
      sectionOrder: { ...current.sectionOrder ?? {}, home: order }
    });
    return { saved: "sectionOrder" };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-C0Ra12Df.js.map
