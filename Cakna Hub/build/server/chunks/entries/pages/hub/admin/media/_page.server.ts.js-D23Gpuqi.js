import { fail, redirect } from '@sveltejs/kit';
import { s as saveMedia, d as deleteMedia, l as listMedia } from '../../../../../chunks/media-store.js-DOIgAFFZ.js';

const load = async ({ locals }) => {
  if (locals.user.role !== "admin") redirect(302, "/hub/admin/dashboard");
  return { files: await listMedia(locals.user) };
};
const actions = {
  delete: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const form = await request.formData();
    const name = form.get("name");
    if (!name) return fail(400, { error: "name required" });
    await deleteMedia(actor, name);
  },
  upload: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !file.size) return fail(400, { error: "No file selected." });
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      await saveMedia(actor, file.name, buffer);
    } catch (e) {
      return fail(500, { error: `Upload failed: ${String(e)}` });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-D23Gpuqi.js.map
