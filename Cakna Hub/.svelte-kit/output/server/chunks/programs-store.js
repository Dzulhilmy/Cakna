import { c as cores, g as getCore } from "./cores.js";
import { h as hubDelete, d as hubPost, b as hubGet, c as hubGetPublic, a as hubPut } from "./hub-api.js";
function toProgram(r) {
  return { id: r.id, coreId: r.core_id, name: r.name, slug: r.slug, description: r.description, image: r.image, createdAt: r.created_at, updatedAt: r.updated_at };
}
async function ensureSeeded(actor) {
  await hubPost(actor, "/programs/seed");
}
async function getPrograms(actor) {
  const rows = actor ? await hubGet(actor, "/programs") : await hubGetPublic("/programs");
  if (rows.length === 0 && actor) {
    await ensureSeeded(actor);
    return (await hubGet(actor, "/programs")).map(toProgram);
  }
  return rows.map(toProgram);
}
async function getProgramsByCore(actor) {
  const all = await getPrograms(actor);
  const map = {};
  for (const core of cores) map[core.id] = [];
  for (const p of all) (map[p.coreId] ??= []).push(p);
  return map;
}
async function getProgramsForCore(actor, coreId) {
  return (await getPrograms(actor)).filter((p) => p.coreId === coreId);
}
async function resolveProgram(actor, coreId, slug) {
  const core = getCore(coreId);
  if (!core) return null;
  const program = (await getProgramsForCore(actor, coreId)).find((p) => p.slug === slug);
  return program ? { core, program } : null;
}
async function createProgram(actor, input) {
  return toProgram(await hubPost(actor, "/programs", {
    core_id: input.coreId,
    name: input.name,
    description: input.description ?? "",
    image: input.image ?? ""
  }));
}
async function updateProgram(actor, id, input) {
  return toProgram(await hubPut(actor, `/programs/${encodeURIComponent(id)}`, {
    core_id: input.coreId,
    name: input.name,
    description: input.description ?? "",
    image: input.image ?? ""
  }));
}
async function deleteProgram(actor, id) {
  try {
    await hubDelete(actor, `/programs/${encodeURIComponent(id)}`);
    return true;
  } catch {
    return false;
  }
}
export {
  getPrograms as a,
  getProgramsForCore as b,
  createProgram as c,
  deleteProgram as d,
  getProgramsByCore as g,
  resolveProgram as r,
  updateProgram as u
};
