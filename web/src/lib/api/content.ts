import { api } from './client';
import type {
	AsmaItem,
	City,
	DhikrItem,
	DuaItem,
	HijriEvent,
	IbadahDoc,
	MathuratItem,
	MengajiDoc,
	Meta,
	PageBundle,
	SearchResult,
	SurahBundle,
	WordsBundle,
	YasinDoc
} from './types';

type Fetch = typeof fetch;

// In-memory page cache so revisits and prefetched neighbours are instant.
const pageCache = new Map<number, PageBundle>();

// Word-by-word data is fetched on demand (tap an ayah's word view) and cached.
const wordsCache = new Map<number, WordsBundle>();
export async function getWords(global: number, fetchFn: Fetch = fetch): Promise<WordsBundle> {
	const cached = wordsCache.get(global);
	if (cached) return cached;
	const bundle = await api.get<WordsBundle>(`/api/ayahs/${global}/words`, fetchFn);
	wordsCache.set(global, bundle);
	return bundle;
}

export async function getPage(page: number, fetchFn: Fetch = fetch): Promise<PageBundle> {
	const cached = pageCache.get(page);
	if (cached) return cached;
	const bundle = await api.get<PageBundle>(`/api/pages/${page}`, fetchFn);
	pageCache.set(page, bundle);
	return bundle;
}

export function prefetchPage(page: number) {
	if (page < 1 || page > 604 || pageCache.has(page)) return;
	getPage(page).catch(() => {});
}

export const getMeta = (fetchFn: Fetch = fetch) => api.get<Meta>('/api/meta', fetchFn);
export const getSurah = (n: number, fetchFn: Fetch = fetch) =>
	api.get<SurahBundle>(`/api/surahs/${n}`, fetchFn);
export const search = (q: string, lang: string, fetchFn: Fetch = fetch) =>
	api.get<SearchResult>(
		`/api/search?q=${encodeURIComponent(q)}&lang=${lang}&limit=60`,
		fetchFn
	);

export const getAsma = (fetchFn: Fetch = fetch) => api.get<AsmaItem[]>('/api/modules/asma', fetchFn);
export const getCities = (fetchFn: Fetch = fetch) => api.get<City[]>('/api/modules/cities', fetchFn);
export const getDhikr = (fetchFn: Fetch = fetch) => api.get<DhikrItem[]>('/api/modules/dhikr', fetchFn);
export const getDuas = (fetchFn: Fetch = fetch) => api.get<DuaItem[]>('/api/modules/duas', fetchFn);
export const getMathurat = (fetchFn: Fetch = fetch) =>
	api.get<MathuratItem[]>('/api/modules/mathurat', fetchFn);
export const getHijriEvents = (fetchFn: Fetch = fetch) =>
	api.get<HijriEvent[]>('/api/modules/hijri-events', fetchFn);
export const getIbadah = (fetchFn: Fetch = fetch) => api.get<IbadahDoc>('/api/modules/ibadah', fetchFn);
export const getMengaji = (fetchFn: Fetch = fetch) =>
	api.get<MengajiDoc>('/api/modules/mengaji', fetchFn);
export const getYasin = (fetchFn: Fetch = fetch) => api.get<YasinDoc>('/api/modules/yasin', fetchFn);
