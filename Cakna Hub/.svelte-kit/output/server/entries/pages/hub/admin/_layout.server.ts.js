import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  const user = locals.user;
  if (!user) redirect(302, "/auth/login?next=/hub/admin/dashboard");
  if (user.role !== "admin" && user.role !== "reviewer" && user.role !== "pic") redirect(302, "/hub");
  return { user };
};
export {
  load
};
