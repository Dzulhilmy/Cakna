import { fail, redirect } from "@sveltejs/kit";
import { s as syncCaknaUsers, d as deleteUser, c as setUserDepartment, a as setUserStatus, b as setUserRole, l as listHubUsers } from "../../../../../chunks/auth.js";
const load = async ({ locals }) => {
  const actor = locals.user;
  if (actor.role !== "admin") redirect(302, "/hub/admin/dashboard");
  const users = await listHubUsers(actor);
  return { users, pending: users.filter((u) => u.status === "pending").length };
};
const actions = {
  setRole: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const form = await request.formData();
    const id = form.get("id");
    const role = form.get("role");
    if (!id || !role) return fail(400, { error: "Invalid input" });
    const res = await setUserRole(actor, id, role);
    if (!res.ok) return fail(500, { error: res.error ?? "Failed to update role." });
    return { updated: "role" };
  },
  setStatus: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const form = await request.formData();
    const id = form.get("id");
    const status = form.get("status");
    if (!id || !status) return fail(400, { error: "Invalid input" });
    const res = await setUserStatus(actor, id, status);
    if (!res.ok) return fail(500, { error: res.error ?? "Failed to update status." });
    return { updated: "status" };
  },
  setDepartment: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const form = await request.formData();
    const id = form.get("id");
    const department = form.get("department") ?? "";
    if (!id) return fail(400, { error: "Invalid input" });
    const res = await setUserDepartment(actor, id, department);
    if (!res.ok) return fail(500, { error: res.error ?? "Failed to update department." });
    return { updated: "department" };
  },
  delete: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
    const form = await request.formData();
    const id = form.get("id");
    if (!id) return fail(400, { error: "Invalid input" });
    await deleteUser(actor, id);
  },
  syncUsers: async ({ request, locals }) => {
    const actor = locals.user;
    if (actor.role !== "admin") return fail(403, { error: "Forbidden" });
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
