// Hijri calendar via ICU Umm al-Qura — port of the sample (index.html L3017+).
import type { HijriEvent } from '$lib/api/types';

export interface HijriParts {
	d: number;
	m: string;
	y: string;
	str: string;
}

export function hijriParts(dt: Date, uiLang: 'ms' | 'en' = 'ms'): HijriParts | null {
	try {
		const locale = uiLang === 'en' ? 'en-GB-u-ca-islamic-umalqura' : 'ms-MY-u-ca-islamic-umalqura';
		const f = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
		const parts = f.formatToParts(dt);
		const g = (k: string) => parts.find((x) => x.type === k)?.value ?? '';
		const d = parseInt(g('day'), 10);
		if (!d) return null;
		return { d, m: g('month'), y: g('year'), str: `${d} ${g('month')} ${g('year')}H` };
	} catch {
		return null;
	}
}

export interface FastDay {
	mon: boolean;
	thu: boolean;
	bidh: boolean;
	any: boolean;
}

export function isFastDay(dt: Date): FastDay {
	const hp = hijriParts(dt);
	const wd = dt.getDay();
	const bidh = !!hp && hp.d >= 13 && hp.d <= 15;
	return { mon: wd === 1, thu: wd === 4, bidh, any: wd === 1 || wd === 4 || bidh };
}

/**
 * Upcoming Islamic events within 400 days. Month matching uses the ICU
 * *Malay* month-name substring, exactly like the sample (codes: rama, syaw,
 * zulhij, muhar) — so matching always runs against the ms locale.
 */
export function upcomingEvents(events: HijriEvent[], from = new Date()): { key: string; date: Date }[] {
	const found: { key: string; date: Date }[] = [];
	for (let i = 0; i < 400 && found.length < events.length; i++) {
		const d = new Date(from.getTime() + i * 86400000);
		const hpd = hijriParts(d, 'ms');
		if (!hpd) break;
		const mLow = hpd.m.toLowerCase();
		for (const ev of events) {
			if (hpd.d === ev.day && mLow.includes(ev.month_code) && !found.some((x) => x.key === ev.label_key)) {
				found.push({ key: ev.label_key, date: d });
			}
		}
	}
	return found.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Days until the next 1 Ramadan (sample's nextRamadanIn). */
export function nextRamadanIn(from = new Date()): number | null {
	for (let i = 0; i < 400; i++) {
		const d = new Date(from.getTime() + i * 86400000);
		const hpd = hijriParts(d, 'ms');
		if (!hpd) return null;
		if (hpd.d === 1 && hpd.m.toLowerCase().includes('rama')) return i;
	}
	return null;
}

/** Next Ayyamul Bidh start (hijri day 13) within 35 days. */
export function nextBidh(from = new Date()): Date | null {
	for (let i = 0; i <= 35; i++) {
		const d = new Date(from.getTime() + i * 86400000);
		const hpd = hijriParts(d, 'ms');
		if (hpd && hpd.d === 13) return d;
	}
	return null;
}
