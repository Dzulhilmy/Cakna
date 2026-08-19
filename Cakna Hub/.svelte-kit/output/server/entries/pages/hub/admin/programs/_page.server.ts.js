import { fail, redirect } from "@sveltejs/kit";
import { u as updateProgram, d as deleteProgram, c as createProgram, a as getPrograms } from "../../../../../chunks/programs-store.js";
const load = async ({ locals }) => {
  if (locals.user.role !== "admin") redirect(302, "/hub/admin/dashboard");
  return { programs: await getPrograms(locals.user) };
};
const actions = {
  create: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const coreId = form.get("coreId");
    const name = form.get("name");
    const description = (form.get("description") ?? "").trim();
    const image = (form.get("image") ?? "").trim();
    if (!coreId || !name) return fail(400, { error: "coreId and name required" });
    await createProgram(actor, { coreId, name, description, image });
  },
  delete: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const id = form.get("id");
    if (!id) return fail(400, { error: "id required" });
    await deleteProgram(actor, id);
  },
  update: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const id = form.get("id");
    const coreId = form.get("coreId");
    const name = form.get("name")?.trim();
    const description = (form.get("description") ?? "").trim();
    const image = (form.get("image") ?? "").trim();
    if (!id || !coreId || !name) return fail(400, { error: "All fields required" });
    await updateProgram(actor, id, { coreId, name, description, image });
  }
};
export {
  actions,
  load
};
