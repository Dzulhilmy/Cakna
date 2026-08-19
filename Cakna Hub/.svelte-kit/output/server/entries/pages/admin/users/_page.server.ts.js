import { fail } from "@sveltejs/kit";
import { s as syncCaknaUsers, d as deleteUser, a as setUserStatus, b as setUserRole, l as listHubUsers } from "../../../../chunks/auth.js";
const load = async ({ locals }) => {
  const actor = locals.user;
  const users = await listHubUsers(actor);
  return { users, pending: users.filter((u) => u.status === "pending").length };
};
const actions = {
  setRole: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const id = form.get("id");
    const role = form.get("role");
    if (!id || !role) return fail(400, { error: "Invalid input" });
    await setUserRole(actor, id, role);
  },
  setStatus: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const id = form.get("id");
    const status = form.get("status");
    if (!id || !status) return fail(400, { error: "Invalid input" });
    await setUserStatus(actor, id, status);
  },
  delete: async ({ request, locals }) => {
    const actor = locals.user;
    const form = await request.formData();
    const id = form.get("id");
    if (!id) return fail(400, { error: "Invalid input" });
    await deleteUser(actor, id);
  },
  syncUsers: async ({ request, locals }) => {
    locals.user;
    const cookie = request.headers.get("cookie") ?? "";
    try {
      const { synced } = await syncCaknaUsers(cookie);
      return { synced };
    } catch (e) {
      return fail(500, { error: String(e) });
    }
  }
};
export {
  actions,
  load
};
