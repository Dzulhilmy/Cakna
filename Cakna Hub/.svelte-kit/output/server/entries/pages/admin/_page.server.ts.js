import { redirect } from "@sveltejs/kit";
const load = async () => redirect(302, "/admin/dashboard");
export {
  load
};
