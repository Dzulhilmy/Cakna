import { error } from "@sveltejs/kit";
import { c as getEventById } from "../../../../../chunks/society-store.js";
const load = async ({ params, locals }) => {
  const event = await getEventById(locals.user, params.id);
  if (!event) error(404, "Event not found");
  return { event };
};
export {
  load
};
