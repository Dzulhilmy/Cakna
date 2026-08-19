import { g as getSiteContent } from "../../../../chunks/site-store.js";
const load = async ({ params, locals }) => {
  const content = await getSiteContent(locals.user ?? void 0);
  const docs = content.docs ?? {};
  return { slug: params.slug, doc: docs[params.slug] ?? null, content };
};
export {
  load
};
