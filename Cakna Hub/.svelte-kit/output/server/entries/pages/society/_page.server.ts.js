import { redirect } from "@sveltejs/kit";
const load = async () => redirect(302, "/society/funding");
export {
  load
};
