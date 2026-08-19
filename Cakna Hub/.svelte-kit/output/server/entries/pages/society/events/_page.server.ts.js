import { a as getEvents } from "../../../../chunks/society-store.js";
const load = async ({ locals }) => ({
  events: await getEvents(locals.user)
});
export {
  load
};
