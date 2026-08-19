import { a as getEvents, g as getFundingApplications } from "../../../../../chunks/society-store.js";
const load = async ({ locals }) => {
  const actor = locals.user;
  const [events, applications] = await Promise.all([getEvents(actor), getFundingApplications(actor)]);
  return { events, applications: applications.filter((a) => a.status === "approved") };
};
export {
  load
};
