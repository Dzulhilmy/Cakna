// Tajweed span segmentation — port of the sample's applyTaj (index.html L1979).
// taj is a flat [pos,len,rule,...] array of UTF-16 indices (safe for .slice:
// the corpus has no surrogate pairs). Rendered as <i class="tj t{rule}"> runs.
import enums from '$data/enums.json';

export interface TajSegment {
	text: string;
	rule: number | null;
}

export function segmentTaj(
	text: string,
	taj: number[] | null | undefined,
	enabled = true
): TajSegment[] {
	if (!enabled || !taj || taj.length === 0 || !text) return [{ text, rule: null }];
	const out: TajSegment[] = [];
	let pos = 0;
	for (let i = 0; i + 2 < taj.length + 1; i += 3) {
		const st = taj[i];
		const ln = taj[i + 1];
		const rule = taj[i + 2];
		if (st < pos) continue; // defensive skip, like the sample
		if (st > pos) out.push({ text: text.slice(pos, st), rule: null });
		out.push({ text: text.slice(st, st + ln), rule });
		pos = st + ln;
	}
	if (pos < text.length) out.push({ text: text.slice(pos), rule: null });
	return out;
}

interface Enums {
	qaris: { id: string; name: string }[];
	rule_names: string[];
	tj_chips: string[];
	tj_desc: { ms: string[]; en: string[] };
	pz_types: Record<string, [string, string]>;
	pz_reasons: Record<string, [string, string]>;
}
const e = enums as unknown as Enums;

export const QARIS = e.qaris;
export const RULE_NAMES = e.rule_names;
export const TJ_CHIPS = e.tj_chips;
export const TJ_DESC = e.tj_desc;
export const PZ_TYPES = e.pz_types;
export const PZ_REASONS = e.pz_reasons;

/** Distinct rules present in a taj array, in order of appearance. */
export function rulesIn(taj: number[] | null | undefined): number[] {
	if (!taj) return [];
	const seen: number[] = [];
	for (let i = 2; i < taj.length; i += 3) {
		if (!seen.includes(taj[i])) seen.push(taj[i]);
	}
	return seen;
}
