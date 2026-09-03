/**
 * Al-Ma'thurat wirid helpers, shared by the full reader page and the read-only
 * view embedded in a halaqah room.
 *
 * Extracted from the reader so both render from one implementation — the room
 * showing a different text from the page it claims to mirror would be worse than
 * not showing it at all.
 */
import { MASTER, type MathuratMasterItem, type TeksWaktu, type Waktu } from './mathurat-master';

export type Versi = 'sughra' | 'kubra';
export type { Waktu };

/** A master item resolved for one version, so `reps` is a plain count. */
export interface Item extends Omit<MathuratMasterItem, 'reps'> {
	reps: number;
}

export const VKEY = { sughra: 's', kubra: 'k' } as const;

const itemsFor = (v: Versi): Item[] =>
	MASTER.filter((it) => it.reps[VKEY[v]] != null).map((it) => ({
		...it,
		reps: it.reps[VKEY[v]]!
	}));

export const LISTS: Record<Versi, Item[]> = {
	sughra: itemsFor('sughra'),
	kubra: itemsFor('kubra')
};

export const TOTALS: Record<Versi, number> = {
	sughra: LISTS.sughra.reduce((s, it) => s + it.reps, 0),
	kubra: LISTS.kubra.reduce((s, it) => s + it.reps, 0)
};

export const VERSI_LABEL: Record<Versi, { nama: string; penuh: string; n: number }> = {
	sughra: { nama: 'Sughra', penuh: 'Wazifah Sughra', n: LISTS.sughra.length },
	kubra: { nama: 'Kubra', penuh: 'Wazifah Kubra', n: LISTS.kubra.length }
};

export const JENIS_LABEL = { quran: 'Al-Quran', zikir: "Zikir Ma'thur", doa: 'Doa' } as const;

export const BASMALAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

const AR_KE_LATIN: Record<string, string> = {
	'٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
	'٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
};

/** Ayah number from a trailing ﴿n﴾ marker, or null. */
export const noAyat = (seg: string): string | null => {
	const m = seg.match(/﴿([٠-٩]+)﴾\s*$/);
	return m ? m[1].split('').map((d) => AR_KE_LATIN[d]).join('') : null;
};

/** Split Arabic text into ayahs on ﴿n﴾ markers; null when there is only one. */
export const pecahAyat = (teks: string): string[] | null => {
	const parts = teks.match(/[^﴿﴾]*﴿[٠-٩]+﴾/g);
	if (!parts || parts.length < 2) return null;
	return parts.map((s) => s.trim());
};

/** Some fields differ between the morning and evening wirid. */
export const pickTime = (f: TeksWaktu, mode: Waktu): string =>
	typeof f === 'string' ? f : f[mode];

/** Resolve a field for a version + time of day, preferring the Kubra variant. */
export const pickText = (
	item: Item,
	version: Versi,
	mode: Waktu,
	key: 'ar' | 'bm' | 'bi' | 'rumi'
): string => {
	const kField = item[(key + 'K') as 'arK' | 'bmK' | 'biK' | 'rumiK'];
	const base = version === 'kubra' && kField ? kField : item[key];
	return pickTime(base, mode);
};

/** Clamp an index into a version's list — share payloads arrive from the network. */
export const safeIdx = (version: Versi, idx: number): number =>
	Math.min(Math.max(0, Math.floor(idx) || 0), LISTS[version].length - 1);

const AR_DIGITS: Record<string, number> = {
	'٠': 0, '١': 1, '٢': 2, '٣': 3, '٤': 4,
	'٥': 5, '٦': 6, '٧': 7, '٨': 8, '٩': 9
};

/** Find an inline ﴿n×﴾ repeat marker and return the phrase before it + count. */
export const findUlang = (text: string): { count: number; phrase: string } | null => {
	const m = text.match(/([^،,\n]+)﴿([٠-٩]+)×﴾/u);
	if (!m) return null;
	const count = [...m[2]].reduce((n, d) => n * 10 + (AR_DIGITS[d] ?? 0), 0);
	if (!count) return null;
	return { count, phrase: m[1].trim() };
};

/** Arabic text with the repeated phrase wrapped in <mark class="ulang-mark">. */
export const arWithHighlight = (text: string): string => {
	return text.replace(
		/([^،,\n]+)(﴿[٠-٩]+×﴾)/gu,
		(_, phrase, marker) => `<mark class="ulang-mark">${phrase}</mark>${marker}`
	);
};
