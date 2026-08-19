import { fail, redirect } from "@sveltejs/kit";
import { a as addNotification } from "../../../../../chunks/notifications-store.js";
const load = async () => ({});
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
    redirect(302, "/admin/dashboard");
  }
};
export {
  actions,
  load
};
