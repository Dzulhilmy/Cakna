import { fail } from "@sveltejs/kit";
import { d as deleteProgram, c as createProgram, a as getPrograms } from "../../../../chunks/programs-store.js";
const load = async ({ locals }) => ({
  programs: await getPrograms(locals.user)
});
const actions = {
  create: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const coreId = form.get("coreId");
    const name = form.get("name");
    const description = form.get("description") ?? "";
    if (!coreId || !name) return fail(400, { error: "coreId and name required" });
    await createProgram(actor, { coreId, name, description });
  },
  delete: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const id = form.get("id");
    if (!id) return fail(400, { error: "id required" });
    await deleteProgram(actor, id);
  }
};
export {
  actions,
  load
};
