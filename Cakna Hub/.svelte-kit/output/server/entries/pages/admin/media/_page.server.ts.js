import { fail } from "@sveltejs/kit";
import { d as deleteMedia, l as listMedia } from "../../../../chunks/media-store.js";
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
export {
  actions,
  load
};
