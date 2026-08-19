import { browser } from '$app/environment';
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

export const CAKNA_ORIGIN = 'https://cakna.org';
// In the browser, route through the Hub's proxy to avoid CORS. Server-side, call cakna.org directly.
const A = browser ? '/proxy' : 'https://cakna.org';

type Fetch = typeof fetch;

const pageCache = new Map<number, PageBundle>();
const wordsCache = new Map<number, WordsBundle>();

export async function getWords(global: number, fetchFn: Fetch = fetch): Promise<WordsBundle> {
	const cached = wordsCache.get(global);
	if (cached) return cached;
	const bundle = await api.get<WordsBundle>(`${A}/api/ayahs/${global}/words`, fetchFn);
	wordsCache.set(global, bundle);
	return bundle;
}

export async function getPage(page: number, fetchFn: Fetch = fetch): Promise<PageBundle> {
	const cached = pageCache.get(page);
	if (cached) return cached;
	const bundle = await api.get<PageBundle>(`${A}/api/pages/${page}`, fetchFn);
	pageCache.set(page, bundle);
	return bundle;
}

export function prefetchPage(page: number) {
	if (page < 1 || page > 604 || pageCache.has(page)) return;
	getPage(page).catch(() => {});
}

export const getMeta = (fetchFn: Fetch = fetch) => api.get<Meta>(`${A}/api/meta`, fetchFn);
export const getSurah = (n: number, fetchFn: Fetch = fetch) =>
	api.get<SurahBundle>(`${A}/api/surahs/${n}`, fetchFn);
export const search = (q: string, lang: string, fetchFn: Fetch = fetch) =>
	api.get<SearchResult>(`${A}/api/search?q=${encodeURIComponent(q)}&lang=${lang}&limit=60`, fetchFn);

export const getAsma = (fetchFn: Fetch = fetch) =>
	api.get<AsmaItem[]>(`${A}/api/modules/asma`, fetchFn);
export const getCities = (fetchFn: Fetch = fetch) =>
	api.get<City[]>(`${A}/api/modules/cities`, fetchFn);
export const getDhikr = (fetchFn: Fetch = fetch) =>
	api.get<DhikrItem[]>(`${A}/api/modules/dhikr`, fetchFn);
export const getDuas = (fetchFn: Fetch = fetch) =>
	api.get<DuaItem[]>(`${A}/api/modules/duas`, fetchFn);
export const getMathurat = (fetchFn: Fetch = fetch) =>
	api.get<MathuratItem[]>(`${A}/api/modules/mathurat`, fetchFn);
export const getHijriEvents = (fetchFn: Fetch = fetch) =>
	api.get<HijriEvent[]>(`${A}/api/modules/hijri-events`, fetchFn);
export const getIbadah = (fetchFn: Fetch = fetch) =>
	api.get<IbadahDoc>(`${A}/api/modules/ibadah`, fetchFn);
export const getMengaji = (fetchFn: Fetch = fetch) =>
	api.get<MengajiDoc>(`${A}/api/modules/mengaji`, fetchFn);
export const getYasin = (fetchFn: Fetch = fetch) =>
	api.get<YasinDoc>(`${A}/api/modules/yasin`, fetchFn);
