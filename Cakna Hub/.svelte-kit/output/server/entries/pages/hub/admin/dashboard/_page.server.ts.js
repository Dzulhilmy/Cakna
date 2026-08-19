import { g as getFundingApplications } from "../../../../../chunks/society-store.js";
import { c as combinedSummary, b as combinedByState, s as stateForBranch } from "../../../../../chunks/reports.js";
const load = async ({ locals }) => {
  const applications = await getFundingApplications(locals.user);
  const approved = applications.filter((a) => a.status === "approved");
  const pendingCount = applications.filter((a) => (a.status ?? "pending") !== "approved").length;
  const summary = combinedSummary(approved);
  const states = combinedByState(approved);
  const disbursedPct = summary.collected ? Math.round(summary.given / summary.collected * 100) : 0;
  return {
    summary,
    states: states.map((s) => ({ label: s.state, collected: s.collected, given: s.given, meta: `${s.reportCount} report${s.reportCount !== 1 ? "s" : ""}` })),
    disbursedPct,
    pendingCount,
    recentApplications: applications.slice(0, 5).map((a) => ({
      id: a.id,
      namaProgram: a.namaProgram,
      reference: a.reference,
      cawangan: a.cawangan,
      state: stateForBranch(a.cawangan),
      status: a.status,
      jumlahPerbelanjaan: a.jumlahPerbelanjaan
    }))
  };
};
export {
  load
};
