import { redirect } from '@sveltejs/kit';

const load = async ({ locals }) => {
  const user = locals.user;
  if (!user) redirect(302, "/auth/login?next=/hub/admin/dashboard");
  if (user.role !== "admin" && user.role !== "reviewer" && user.role !== "pic") redirect(302, "/hub");
  return { user };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

export { _layout_server_ts as _ };
//# sourceMappingURL=_layout.server.ts.js-DqKId5Z0.js.map
