export interface SurahMeta {
	number: number;
	name_ar: string;
	name_translit: string;
	name_ms: string;
	name_en: string;
	ayah_count: number;
	revelation: 'M' | 'D';
	first_global: number;
	first_page: number;
}

export interface Ayah {
	global: number; // 1-based, 1..6236
	surah: number;
	ayah: number;
	page: number;
	juz: number;
	sajdah: boolean;
	ar: string;
	taj: number[]; // flat [pos,len,rule,...] UTF-16 indices
	translit: string;
	tr: { ms: string; en: string; id: string };
}

export interface PageBundle {
	page: number;
	juz: number;
	surahs: SurahMeta[];
	ayahs: Ayah[];
}

export interface Word {
	ar: string; // Uthmani word text
	ms: string;
	en: string;
	id: string;
}

export interface WordsBundle {
	global: number;
	words: Word[];
}

export interface SurahBundle {
	surah: SurahMeta;
	ayahs: Ayah[];
}

export interface Meta {
	surahs: SurahMeta[];
	juz_starts: number[];
	page_count: number;
	sajdah: string[];
	content_version: string;
}

export interface SearchHit {
	global: number;
	surah: number;
	ayah: number;
	page: number;
	text: string;
}

export interface SearchResult {
	total: number;
	hits: SearchHit[];
}

export interface User {
	id: string;
	email: string;
	created_at?: string;
}

export interface QuranRef {
	surah: number;
	ayah_from: number;
	ayah_to: number;
}

export interface AsmaItem {
	position: number;
	arabic: string;
	translit: string;
	meaning_ms: string;
	meaning_en: string;
}

export interface City {
	id: number;
	name: string;
	lat: number;
	lng: number;
	tz: string;
	is_malaysia: boolean;
}

export interface DhikrItem {
	kind: 'phrase' | 'quran';
	position: number;
	arabic: string | null;
	label_ms: string;
	label_en: string;
	target_count: number | null;
	quran_ref: QuranRef | null;
	tajweed: number[];
}

export interface DuaItem {
	kind: 'quran' | 'hadith';
	position: number;
	title_ms: string;
	title_en: string;
	quran_ref: QuranRef | null;
	arabic: string | null;
	meaning_ms: string | null;
	meaning_en: string | null;
	tajweed: number[];
}

export interface MathuratItem {
	position: number;
	quran_ref: QuranRef | null;
	arabic: string | null;
	arabic_pagi: string | null;
	arabic_petang: string | null;
	repeat_n: number;
	repeat_full: number | null;
	core: boolean; // true = Kubra-only
	title_ms: string;
	title_en: string;
	meaning_ms: string | null;
	meaning_en: string | null;
	tajweed: number[];
	tajweed_pagi: number[];
	tajweed_petang: number[];
}

export interface HijriEvent {
	month_code: string;
	day: number;
	label_key: string;
}

export interface IbadahStep {
	flag: number | null;
	title_ms: string;
	title_en: string;
	arabic: string | null;
	tajweed: number[];
	desc_ms: string;
	desc_en: string;
}

export interface IbadahDoc {
	sections: Record<string, IbadahStep[]>; // wuduk solat tay umrah haji
	batal: { ms: string[]; en: string[] };
	rakaat: [string, number][];
	ihram_ban: { ms: string[]; en: string[] };
	tawaf_ar: { arabic: string; tajweed: number[] }[];
	tawaf_doa: { quran_ref: QuranRef; title_ms: string; title_en: string }[];
	rukun_haji: { ms: string[]; en: string[] };
}

export interface MengajiDoc {
	hija: [string, string][];
	harakat: [string, string, string, string][];
	hrk3: [string, string][];
	mg_sound: string[];
}

export interface YasinDoc {
	closing: { arabic: string; tajweed: number[] }[];
}
