import { g as getSiteContent } from "../../../chunks/site-store.js";
const load = async ({ locals }) => ({
  content: await getSiteContent(locals.user ?? void 0)
});
export {
  load
};
