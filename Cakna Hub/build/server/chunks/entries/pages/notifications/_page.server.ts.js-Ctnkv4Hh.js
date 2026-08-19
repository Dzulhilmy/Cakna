import { g as getNoticesForUser } from '../../../chunks/notices-store.js-asFpnGzq.js';

const load = async ({ locals }) => {
  const user = locals.user;
  if (!user) return { notices: [] };
  const notices = await getNoticesForUser(user);
  return { notices, user };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-Ctnkv4Hh.js.map
