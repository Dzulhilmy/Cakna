import { error } from "@sveltejs/kit";
import { r as resolveProgram } from "../../../../../chunks/programs-store.js";
const load = async ({ params, locals }) => {
  const resolved = await resolveProgram(locals.user ?? void 0, params.coreId, params.program);
  if (!resolved) error(404, "Program not found");
  return { core: resolved.core, program: resolved.program };
};
export {
  load
};
