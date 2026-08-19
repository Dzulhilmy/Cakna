import { cores } from '$lib/cores';
import type { FundingApplication } from '$lib/types';

export type Report = {
	id: string;
	coreId: string;
	core: string;
	pic: string;
	state: string;
	collected: number;
	given: number;
	period: string;
};

export const STATES = [
	'Johor',
	'Kedah',
	'Kelantan',
	'Melaka',
	'Negeri Sembilan',
	'Pahang',
	'Perak',
	'Perlis',
	'Pulau Pinang',
	'Sabah',
	'Sarawak',
	'Selangor',
	'Terengganu',
	'Kuala Lumpur',
];

export const reports: Report[] = [];

function sum<T>(arr: T[], f: (x: T) => number): number {
	return arr.reduce((acc, x) => acc + f(x), 0);
}

export type Summary = {
	collected: number;
	given: number;
	net: number;
	reportCount: number;
	stateCount: number;
	coreCount: number;
	picCount: number;
};

export function getSummary(rows: Report[] = reports): Summary {
	const collected = sum(rows, (r) => r.collected);
	const given = sum(rows, (r) => r.given);
	return {
		collected,
		given,
		net: collected - given,
		reportCount: rows.length,
		stateCount: new Set(rows.map((r) => r.state)).size,
		coreCount: new Set(rows.map((r) => r.coreId)).size,
		picCount: new Set(rows.map((r) => r.pic)).size,
	};
}

export type StateAgg = {
	state: string;
	collected: number;
	given: number;
	net: number;
	reportCount: number;
};

export function byState(rows: Report[] = reports): StateAgg[] {
	const map = new Map<string, StateAgg>();
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

export type CoreAgg = {
	coreId: string;
	core: string;
	collected: number;
	given: number;
	net: number;
	reportCount: number;
};

export function byCore(rows: Report[] = reports): CoreAgg[] {
	return cores.map((core) => {
		const mine = rows.filter((r) => r.coreId === core.id);
		const collected = sum(mine, (r) => r.collected);
		const given = sum(mine, (r) => r.given);
		return { coreId: core.id, core: core.name, collected, given, net: collected - given, reportCount: mine.length };
	});
}

export type PicAgg = {
	pic: string;
	collected: number;
	given: number;
	net: number;
	reportCount: number;
	cores: string[];
};

export function byPic(rows: Report[] = reports): PicAgg[] {
	const map = new Map<string, PicAgg & { coreSet: Set<string> }>();
	for (const r of rows) {
		const cur = map.get(r.pic) ?? { pic: r.pic, collected: 0, given: 0, net: 0, reportCount: 0, cores: [], coreSet: new Set<string>() };
		cur.collected += r.collected;
		cur.given += r.given;
		cur.net = cur.collected - cur.given;
		cur.reportCount += 1;
		cur.coreSet.add(r.core);
		map.set(r.pic, cur);
	}
	return [...map.values()]
		.map(({ coreSet, ...rest }) => ({ ...rest, cores: [...coreSet] }))
		.sort((a, b) => b.collected - a.collected);
}

const BRANCH_TO_STATE: Record<string, string> = {
	'kuala terengganu': 'Terengganu',
	'kuala nerus': 'Terengganu',
	kemaman: 'Terengganu',
	'shah alam': 'Selangor',
	'petaling jaya': 'Selangor',
	klang: 'Selangor',
	'subang jaya': 'Selangor',
	kajang: 'Selangor',
	cyberjaya: 'Selangor',
	kuantan: 'Pahang',
	temerloh: 'Pahang',
	bentong: 'Pahang',
	'johor bahru': 'Johor',
	'batu pahat': 'Johor',
	muar: 'Johor',
	'george town': 'Pulau Pinang',
	'bukit mertajam': 'Pulau Pinang',
	ipoh: 'Perak',
	taiping: 'Perak',
	'alor setar': 'Kedah',
	'sungai petani': 'Kedah',
	kangar: 'Perlis',
	'kota bharu': 'Kelantan',
	melaka: 'Melaka',
	seremban: 'Negeri Sembilan',
	'kota kinabalu': 'Sabah',
	sandakan: 'Sabah',
	kuching: 'Sarawak',
	miri: 'Sarawak',
	'kuala lumpur': 'Kuala Lumpur',
	putrajaya: 'Putrajaya',
};

export function stateForBranch(branch: string): string {
	const key = branch.trim().toLowerCase();
	if (!key) return 'Other';
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

export type DashboardSummary = Summary & {
	applicationCount: number;
	applicationTotal: number;
};

export function combinedSummary(applications: FundingApplication[]): DashboardSummary {
	const base = getSummary();
	const applicationTotal = sum(applications, (a) => a.jumlahPerbelanjaan);
	const given = base.given + applicationTotal;
	return { ...base, given, net: base.collected - given, applicationCount: applications.length, applicationTotal };
}

export function combinedByState(applications: FundingApplication[]): StateAgg[] {
	const map = new Map<string, StateAgg>();
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

export type ClusterAgg = { cluster: string; label: string; total: number; count: number };

export function fundingByCluster(applications: FundingApplication[]): ClusterAgg[] {
	const CLUSTERS = cores.map((c) => ({ id: c.id, label: c.name }));
	const map = new Map<string, ClusterAgg>();
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

export type FundingStateAgg = { state: string; total: number; count: number };

export function fundingByState(applications: FundingApplication[]): FundingStateAgg[] {
	const map = new Map<string, FundingStateAgg>();
	for (const a of applications) {
		const st = stateForBranch(a.cawangan);
		const cur = map.get(st) ?? { state: st, total: 0, count: 0 };
		cur.total += a.jumlahPerbelanjaan;
		cur.count += 1;
		map.set(st, cur);
	}
	return [...map.values()].sort((a, b) => b.total - a.total);
}
