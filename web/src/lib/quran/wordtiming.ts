/**
 * Word-by-word recitation timings, from Quran.com's qdc API (Alafasy, id 7).
 *
 * The qdc audio is per-CHAPTER, and its word `segments` are absolute-ms within
 * that chapter file. We convert them to per-AYAH-relative [startMs, endMs] so
 * they line up with the per-ayah files the player streams
 * (verses.quran.com/Alafasy/mp3/{sss}{aaa}.mp3, split from the same recitation).
 *
 * Fetched once per chapter and cached. A failed/absent load simply means no
 * word highlight for that surah — the ayah-level highlight still works.
 */
const RECITATION_ALAFASY = 7;

/** [startMs, endMs] relative to the ayah's own audio; array index = word 0-based. */
export type WordSeg = [number, number];

const cache = new Map<number, Map<number, WordSeg[]>>(); // surah -> ayah -> segs
const inflight = new Map<number, Promise<void>>();

export async function loadChapterTimings(surah: number): Promise<void> {
	if (cache.has(surah)) return;
	const pending = inflight.get(surah);
	if (pending) return pending;

	const p = (async () => {
		try {
			const res = await fetch(
				`https://api.quran.com/api/qdc/audio/reciters/${RECITATION_ALAFASY}/audio_files?chapter=${surah}&segments=true`
			);
			const data = await res.json();
			const timings = data?.audio_files?.[0]?.verse_timings ?? [];
			const m = new Map<number, WordSeg[]>();
			for (const vt of timings) {
				const ayah = Number(String(vt.verse_key).split(':')[1]);
				const from = vt.timestamp_from ?? 0;
				const segs: WordSeg[] = [];
				for (const s of vt.segments ?? []) {
					// qdc mixes in stray 1- or 2-element entries; keep only [word, start, end].
					if (!Array.isArray(s) || s.length < 3) continue;
					const start = Math.max(0, s[1] - from);
					const end = Math.max(start, s[2] - from);
					segs.push([start, end]);
				}
				if (segs.length) m.set(ayah, segs);
			}
			cache.set(surah, m);
		} catch {
			cache.set(surah, new Map()); // remember as "no data" so we don't refetch every ayah
		}
	})();
	inflight.set(surah, p);
	try {
		await p;
	} finally {
		inflight.delete(surah);
	}
}

/** Per-ayah word segments if already loaded, else null. */
export function segmentsFor(surah: number, ayah: number): WordSeg[] | null {
	return cache.get(surah)?.get(ayah) ?? null;
}

/**
 * The 1-based word index for a playback position (ms) — the last word that has
 * started, so the highlight is sticky through the gaps between words. -1 before
 * the first word begins.
 */
export function wordAt(segs: WordSeg[], ms: number): number {
	let idx = -1;
	for (let i = 0; i < segs.length; i++) {
		if (ms >= segs[i][0]) idx = i;
		else break;
	}
	return idx < 0 ? -1 : idx + 1;
}
