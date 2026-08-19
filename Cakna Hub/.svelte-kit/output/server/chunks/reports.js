import { c as cores } from "./cores.js";
const STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Kuala Lumpur"
];
const reports = [];
function sum(arr, f) {
  return arr.reduce((acc, x) => acc + f(x), 0);
}
function getSummary(rows = reports) {
  const collected = sum(rows, (r) => r.collected);
  const given = sum(rows, (r) => r.given);
  return {
    collected,
    given,
    net: collected - given,
    reportCount: rows.length,
    stateCount: new Set(rows.map((r) => r.state)).size,
    coreCount: new Set(rows.map((r) => r.coreId)).size,
    picCount: new Set(rows.map((r) => r.pic)).size
  };
}
function byState(rows = reports) {
  const map = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const cur = map.get(r.state) ?? { state: r.state, collected: 0, given: 0, net: 0, reportCount: 0 };
    cur.collected += r.collected;
    cur.given += r.given;
    cur.net = cur.collected - cur.given;
    cur.reportCount += 1;
    map.set(r.state, cur);
  }
  return [...map.values()].sort((a, b) => b.collected - a.collected);
}
const BRANCH_TO_STATE = {
  "kuala terengganu": "Terengganu",
  "kuala nerus": "Terengganu",
  kemaman: "Terengganu",
  "shah alam": "Selangor",
  "petaling jaya": "Selangor",
  klang: "Selangor",
  "subang jaya": "Selangor",
  kajang: "Selangor",
  cyberjaya: "Selangor",
  kuantan: "Pahang",
  temerloh: "Pahang",
  bentong: "Pahang",
  "johor bahru": "Johor",
  "batu pahat": "Johor",
  muar: "Johor",
  "george town": "Pulau Pinang",
  "bukit mertajam": "Pulau Pinang",
  ipoh: "Perak",
  taiping: "Perak",
  "alor setar": "Kedah",
  "sungai petani": "Kedah",
  kangar: "Perlis",
  "kota bharu": "Kelantan",
  melaka: "Melaka",
  seremban: "Negeri Sembilan",
  "kota kinabalu": "Sabah",
  sandakan: "Sabah",
  kuching: "Sarawak",
  miri: "Sarawak",
  "kuala lumpur": "Kuala Lumpur",
  putrajaya: "Putrajaya"
};
function stateForBranch(branch) {
  const key = branch.trim().toLowerCase();
  if (!key) return "Other";
  if (BRANCH_TO_STATE[key]) return BRANCH_TO_STATE[key];
  const asState = STATES.find((s) => s.toLowerCase() === key);
  if (asState) return asState;
  for (const [city, st] of Object.entries(BRANCH_TO_STATE)) {
    if (key.includes(city)) return st;
  }
  for (const st of STATES) {
    if (key.includes(st.toLowerCase())) return st;
  }
  return branch;
}
function combinedSummary(applications) {
  const base = getSummary();
  const applicationTotal = sum(applications, (a) => a.jumlahPerbelanjaan);
  const given = base.given + applicationTotal;
  return { ...base, given, net: base.collected - given, applicationCount: applications.length, applicationTotal };
}
function combinedByState(applications) {
  const map = /* @__PURE__ */ new Map();
  for (const s of byState()) map.set(s.state, { ...s });
  for (const a of applications) {
    const state = stateForBranch(a.cawangan);
    const cur = map.get(state) ?? { state, collected: 0, given: 0, net: 0, reportCount: 0 };
    cur.given += a.jumlahPerbelanjaan;
    cur.net = cur.collected - cur.given;
    cur.reportCount += 1;
    map.set(state, cur);
  }
  return [...map.values()].sort((a, b) => b.collected - a.collected);
}
function fundingByCluster(applications) {
  const CLUSTERS = cores.map((c) => ({ id: c.id, label: c.name }));
  const map = /* @__PURE__ */ new Map();
  for (const c of CLUSTERS) map.set(c.id, { cluster: c.id, label: c.label, total: 0, count: 0 });
  for (const a of applications) {
    const label = CLUSTERS.find((c) => c.id === a.kluster)?.label ?? a.kluster;
    const cur = map.get(a.kluster) ?? { cluster: a.kluster, label, total: 0, count: 0 };
    cur.total += a.jumlahPerbelanjaan;
    cur.count += 1;
    map.set(a.kluster, cur);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}
function fundingByState(applications) {
  const map = /* @__PURE__ */ new Map();
  for (const a of applications) {
    const st = stateForBranch(a.cawangan);
    const cur = map.get(st) ?? { state: st, total: 0, count: 0 };
    cur.total += a.jumlahPerbelanjaan;
    cur.count += 1;
    map.set(st, cur);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}
export {
  fundingByCluster as a,
  combinedByState as b,
  combinedSummary as c,
  fundingByState as f,
  stateForBranch as s
};
