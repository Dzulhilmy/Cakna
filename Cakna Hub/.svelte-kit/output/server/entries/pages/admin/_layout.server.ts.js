import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  const user = locals.user;
  if (!user) redirect(302, "/admin/login");
  if (user.role !== "admin" && user.role !== "reviewer") redirect(302, "/");
  return { user };
};
export {
  load
};
