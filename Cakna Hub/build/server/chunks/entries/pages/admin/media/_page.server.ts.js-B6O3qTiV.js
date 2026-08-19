import { fail } from '@sveltejs/kit';
import { d as deleteMedia, l as listMedia } from '../../../../chunks/media-store.js-DOIgAFFZ.js';

const load = async ({ locals }) => ({
  files: await listMedia(locals.user)
});
const actions = {
  delete: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const name = form.get("name");
    if (!name) return fail(400, { error: "name required" });
    await deleteMedia(actor, name);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-B6O3qTiV.js.map
