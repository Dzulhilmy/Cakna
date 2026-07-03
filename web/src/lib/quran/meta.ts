// Client-side Quran index math over static tables (1-BASED global ayah, 1..6236).
// Needed by the audio queue, A–B loops, auto-flip and khatam math without API calls.
import quranMeta from '$data/quran-meta.json';

export interface SurahInfo {
	number: number;
	name_ar: string;
	name_translit: string;
	name_ms: string;
	name_en: string;
	ayah_count: number;
	revelation: string;
	first_global: number;
}

export const SURAHS: SurahInfo[] = quranMeta.surahs;
export const PAGE_FIRST_GLOBAL: number[] = quranMeta.page_first_global; // 604 entries
export const JUZ_FIRST_GLOBAL: number[] = quranMeta.juz_first_global; // 30 entries
export const SAJDAH = new Set<string>(quranMeta.sajdah);
export const TOTAL_AYAHS = 6236;
export const TOTAL_PAGES = 604;

/** Greatest index i with arr[i] <= g (arrays are ascending, arr[0] === 1). */
function bsearch(arr: number[], g: number): number {
	let lo = 0,
		hi = arr.length - 1;
	while (lo < hi) {
		const m = (lo + hi + 1) >> 1;
		if (arr[m] <= g) lo = m;
		else hi = m - 1;
	}
	return lo;
}

/** global (1-based) -> { surah, ayah } (1-based) */
export function gToSA(g: number): { s: number; a: number } {
	const firsts = SURAHS.map((s) => s.first_global);
	const i = bsearch(firsts, g);
	return { s: i + 1, a: g - firsts[i] + 1 };
}

export function saToG(s: number, a: number): number {
	return SURAHS[s - 1].first_global + a - 1;
}

export function pageOf(g: number): number {
	return bsearch(PAGE_FIRST_GLOBAL, g) + 1;
}

export function juzOf(g: number): number {
	return bsearch(JUZ_FIRST_GLOBAL, g) + 1;
}

export function surahPage(s: number): number {
	return pageOf(SURAHS[s - 1].first_global);
}

/** Globals covered by a page: [first, last] inclusive. */
export function pageRange(p: number): [number, number] {
	const first = PAGE_FIRST_GLOBAL[p - 1];
	const last = p < TOTAL_PAGES ? PAGE_FIRST_GLOBAL[p] - 1 : TOTAL_AYAHS;
	return [first, last];
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export function toArabicNum(n: number): string {
	return String(n)
		.split('')
		.map((d) => ARABIC_DIGITS[+d] ?? d)
		.join('');
}

export function audioUrl(qari: string, g: number): string {
	// CDN is 1-based, same as our global index — no offset.
	return `https://cdn.islamic.network/quran/audio/128/${qari}/${g}.mp3`;
}
