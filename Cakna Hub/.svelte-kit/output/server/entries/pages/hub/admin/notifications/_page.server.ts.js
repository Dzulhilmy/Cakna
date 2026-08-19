import { fail, redirect } from "@sveltejs/kit";
import { d as deleteNotification, g as getNotifications } from "../../../../../chunks/notifications-store.js";
const load = async ({ locals }) => {
  const role = locals.user.role;
  if (role !== "admin" && role !== "reviewer") redirect(302, "/hub/admin/dashboard");
  return { notifications: await getNotifications(locals.user) };
};
const actions = {
  delete: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const id = form.get("id");
    if (!id) return fail(400, { error: "id required" });
    await deleteNotification(actor, id);
  }
};
export {
  actions,
  load
};
