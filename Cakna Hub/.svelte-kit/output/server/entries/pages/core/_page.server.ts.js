import { redirect } from "@sveltejs/kit";
import { c as cores } from "../../../chunks/cores.js";
const load = async ({ locals }) => {
  if (!locals.user) redirect(302, "/auth/login");
  return { cores };
};
export {
  load
};
