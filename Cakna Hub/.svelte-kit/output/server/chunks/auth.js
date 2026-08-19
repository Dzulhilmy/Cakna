import { b as private_env } from "./shared-server.js";
import { r as resolveUser, h as hubDelete, a as hubPut, b as hubGet } from "./hub-api.js";
function apiBase() {
  return (private_env.CAKNA_API_URL ?? "https://cakna.org").replace(/\/$/, "");
}
async function checkCaknaSession(cookie) {
  if (!cookie) return null;
  try {
    const res = await fetch(`${apiBase()}/api/auth/me`, {
      headers: { cookie },
      signal: AbortSignal.timeout(4e3)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
async function getCurrentUser(cookieHeader) {
  const devEmail = private_env.DEV_USER_EMAIL;
  if (devEmail) {
    try {
      return await resolveUser(devEmail, "Dev Admin");
    } catch {
      return null;
    }
  }
  const me = await checkCaknaSession(cookieHeader);
  if (!me) return null;
  try {
    return await resolveUser(me.email, me.name);
  } catch {
    return null;
  }
}
async function syncCaknaUsers(cookieHeader) {
  const res = await fetch(`${apiBase()}/admin/users`, {
    headers: { cookie: cookieHeader },
    signal: AbortSignal.timeout(1e4)
  });
  if (!res.ok) throw new Error(`Cakna /admin/users: ${res.status}`);
  const { users } = await res.json();
  let synced = 0;
  for (const u of users) {
    if (!u.email) continue;
    await resolveUser(u.email, u.name ?? "");
    synced++;
  }
  return { synced };
}
async function listHubUsers(actor) {
  return hubGet(actor, "/users");
}
async function setUserRole(actor, id, role) {
  try {
    await hubPut(actor, `/users/${id}/role`, { role });
    return { ok: true };
  } catch (e) {
    console.error("[hub] setUserRole failed:", e);
    return { ok: false, error: String(e) };
  }
}
async function setUserStatus(actor, id, status) {
  try {
    await hubPut(actor, `/users/${id}/status`, { status });
    return { ok: true };
  } catch (e) {
    console.error("[hub] setUserStatus failed:", e);
    return { ok: false, error: String(e) };
  }
}
async function setUserDepartment(actor, id, department) {
  try {
    await hubPut(actor, `/users/${id}/department`, { department });
    return { ok: true };
  } catch (e) {
    console.error("[hub] setUserDepartment failed:", e);
    return { ok: false, error: String(e) };
  }
}
async function deleteUser(actor, id) {
  try {
    await hubDelete(actor, `/users/${id}`);
    return true;
  } catch {
    return false;
  }
}
export {
  setUserStatus as a,
  setUserRole as b,
  setUserDepartment as c,
  deleteUser as d,
  getCurrentUser as g,
  listHubUsers as l,
  syncCaknaUsers as s
};
