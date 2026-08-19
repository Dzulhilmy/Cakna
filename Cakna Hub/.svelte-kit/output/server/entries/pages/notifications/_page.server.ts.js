import { g as getNoticesForUser } from "../../../chunks/notices-store.js";
const load = async ({ locals }) => {
  const user = locals.user;
  if (!user) return { notices: [] };
  const notices = await getNoticesForUser(user);
  return { notices, user };
};
export {
  load
};
