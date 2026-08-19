import { redirect } from "@sveltejs/kit";
import { g as getSiteContent } from "../../chunks/site-store.js";
import { g as getProgramsByCore } from "../../chunks/programs-store.js";
const load = async ({ locals }) => {
  if (locals.user) redirect(302, "/hub");
  const [content, programsByCore] = await Promise.all([getSiteContent(), getProgramsByCore()]);
  return { content, programsByCore };
};
export {
  load
};
