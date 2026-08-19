import { g as getSiteContent } from '../../../../chunks/site-store.js-DEAD0F4a.js';

const load = async ({ params, locals }) => {
  const content = await getSiteContent(locals.user ?? void 0);
  const docs = content.docs ?? {};
  return { slug: params.slug, doc: docs[params.slug] ?? null, content };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-BlK3I8qD.js.map
