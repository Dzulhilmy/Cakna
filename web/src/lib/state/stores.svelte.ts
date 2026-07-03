// All persisted user-state stores (the 15 synced keys), typed.
import { Persisted } from './persisted.svelte';

export interface Settings {
	theme: 'light' | 'sepia' | 'dark';
	fontSize: number; // 20..40 step 2
	qari: string;
	showTrans: boolean;
	page: number; // last-read page 1..604
	autoFlip: boolean;
	repeat: 1 | 2 | 3 | 5;
	tajweed: boolean;
	speed: 0.75 | 1 | 1.25 | 1.5;
	inlineTrans: boolean;
	uiLang: 'ms' | 'en';
	transLang: 'ms' | 'en' | 'id';
	translit: boolean;
	hideMode: boolean;
	align: 'justify' | 'center' | 'right';
	mtMaksud: boolean;
	azan: boolean;
	showSunat: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	theme: 'light',
	fontSize: 26,
	qari: 'ar.alafasy',
	showTrans: true,
	page: 1,
	autoFlip: false,
	repeat: 1,
	tajweed: true,
	speed: 1,
	inlineTrans: false,
	uiLang: 'ms',
	transLang: 'ms',
	translit: false,
	hideMode: false,
	align: 'justify',
	mtMaksud: true,
	azan: false,
	showSunat: true
};

export interface Tasbih {
	c: number;
	t: number; // 0 = no limit
	label: string;
}

export interface PuasaRecord {
	d: string; // YYYY-MM-DD
	t: 'u' | 'q' | 's' | 'r'; // missed / qada / sunat / ramadan
	r?: string; // reason (only t === 'u')
}
export interface Puasa {
	adj: number;
	recs: PuasaRecord[];
}

export interface MathuratState {
	d: string; // device-local YYYY-MM-DD; wiped on date change
	v: 's' | 'k'; // sughra | kubra
	s_pagi: number[]; // 28 counters each
	s_petang: number[];
	k_pagi: number[];
	k_petang: number[];
}

export type CityChoice = number | { g: [number, number] }; // city index | GPS

export const settings = new Persisted<Settings>('settings', { ...DEFAULT_SETTINGS });
export const bookmarks = new Persisted<number[]>('bookmarks', []);
export const notes = new Persisted<Record<string, string>>('notes', {});
export const hls = new Persisted<Record<string, 1 | 2 | 3>>('hls', {});
export const read = new Persisted<number[]>('read', []);
export const readlog = new Persisted<Record<string, number>>('readlog', {});
export const khatamToasted = new Persisted<boolean>('khatamToasted', false);
export const tasbih = new Persisted<Tasbih>('tasbih', { c: 0, t: 33, label: 'Tasbih bebas' });
export const city = new Persisted<CityChoice>('city', 0);
export const sgdays = new Persisted<number>('sgdays', 30);
export const onboarded = new Persisted<boolean>('onboarded', false);
export const mathuratState = new Persisted<MathuratState | null>('mathurat', null);
export const mgquiz = new Persisted<{ best: number }>('mgquiz', { best: 0 });
export const puasa = new Persisted<Puasa>('puasa', { adj: 0, recs: [] });
export const manasik = new Persisted<{ t: number; s: number }>('manasik', { t: 0, s: 0 });

export function todayKey(d = new Date()): string {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
		d.getDate()
	).padStart(2, '0')}`;
}

/** Mark a page as read (auto-called on every reader render, like the sample). */
export function trackRead(p: number) {
	if (!read.value.includes(p)) {
		read.value.push(p);
		const k = todayKey();
		readlog.value[k] = (readlog.value[k] ?? 0) + 1;
	}
}
