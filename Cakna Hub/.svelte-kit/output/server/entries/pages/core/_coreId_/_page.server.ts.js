import { error } from "@sveltejs/kit";
import { b as getProgramsForCore } from "../../../../chunks/programs-store.js";
import { g as getCore } from "../../../../chunks/cores.js";
const load = async ({ params, locals }) => {
  const core = getCore(params.coreId);
  if (!core) error(404, "Core not found");
  const programs = await getProgramsForCore(locals.user ?? void 0, params.coreId);
  return { core, programs };
};
export {
  load
};
