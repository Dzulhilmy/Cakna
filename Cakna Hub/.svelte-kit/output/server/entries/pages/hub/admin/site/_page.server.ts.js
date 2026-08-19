import { redirect } from "@sveltejs/kit";
import { g as getSiteContent } from "../../../../../chunks/site-store.js";
const load = async ({ locals }) => {
  if (locals.user.role !== "admin") redirect(302, "/hub/admin/dashboard");
  return { content: await getSiteContent(locals.user) };
};
export {
  load
};
