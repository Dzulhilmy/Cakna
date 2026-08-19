import { redirect } from "@sveltejs/kit";
const load = async () => redirect(302, "/hub/admin/dashboard");
export {
  load
};
