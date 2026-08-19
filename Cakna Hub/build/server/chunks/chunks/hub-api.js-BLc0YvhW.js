import { b as private_env } from './shared-server.js-DaWdgxVh.js';

function hubBase() {
  return (private_env.HUB_API_URL ?? "http://localhost:3002").replace(/\/$/, "");
}
function secret() {
  return private_env.HUB_INTERNAL_SECRET ?? "";
}
function userHeaders(user) {
  return {
    "x-hub-secret": secret(),
    "x-hub-user-id": user.id,
    "x-hub-user-email": user.email,
    "x-hub-user-name": user.name,
    "x-hub-user-role": user.role,
    "x-hub-user-branch": user.branch,
    "x-hub-user-status": user.status
  };
}
async function ok(res, context) {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`hub-api ${context}: ${res.status} ${body}`);
  }
  return res;
}
async function resolveUser(email, name) {
  const res = await fetch(`${hubBase()}/api/users/resolve`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-hub-secret": secret() },
    body: JSON.stringify({ email, name }),
    signal: AbortSignal.timeout(5e3)
  });
  await ok(res, "users/resolve");
  return res.json();
}
async function hubGetPublic(path) {
  const res = await fetch(`${hubBase()}/api${path}`, {
    headers: { "x-hub-secret": secret() },
    signal: AbortSignal.timeout(5e3)
  });
  await ok(res, path);
  return res.json();
}
async function hubGet(user, path) {
  const res = await fetch(`${hubBase()}/api${path}`, {
    headers: userHeaders(user),
    signal: AbortSignal.timeout(5e3)
  });
  await ok(res, path);
  return res.json();
}
async function hubPost(user, path, body) {
  const res = await fetch(`${hubBase()}/api${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...userHeaders(user) },
    body: body !== void 0 ? JSON.stringify(body) : void 0,
    signal: AbortSignal.timeout(5e3)
  });
  await ok(res, path);
  return res.json();
}
async function hubPut(user, path, body) {
  const res = await fetch(`${hubBase()}/api${path}`, {
    method: "PUT",
    headers: { "content-type": "application/json", ...userHeaders(user) },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5e3)
  });
  await ok(res, path);
  return res.json();
}
async function hubDelete(user, path) {
  const res = await fetch(`${hubBase()}/api${path}`, {
    method: "DELETE",
    headers: userHeaders(user),
    signal: AbortSignal.timeout(5e3)
  });
  await ok(res, path);
  return res.json();
}
async function hubUpload(user, formData) {
  const res = await fetch(`${hubBase()}/api/media`, {
    method: "POST",
    headers: userHeaders(user),
    // no content-type — browser sets multipart boundary
    body: formData,
    signal: AbortSignal.timeout(3e4)
  });
  await ok(res, "media upload");
  return res.json();
}

export { hubPut as a, hubGet as b, hubGetPublic as c, hubPost as d, hubUpload as e, hubDelete as h, resolveUser as r };
//# sourceMappingURL=hub-api.js-BLc0YvhW.js.map
