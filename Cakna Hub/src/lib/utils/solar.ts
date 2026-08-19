// Astronomical prayer times — exact port of the sample (index.html L3765+).
// JAKIM-style parameters: Subuh 20°, Isyak 18°, sunrise/set 0.833°,
// Zohor = transit + 2 min, Imsak = Subuh − 10 min, Asr Shafi'i (factor 1).
const RAD = Math.PI / 180;

export interface PrayerTimes {
	Imsak: number;
	Subuh: number;
	Syuruk: number;
	Zohor: number;
	Asar: number;
	Maghrib: number;
	Isyak: number;
}

export const MAIN_PRAYERS = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isyak'] as const;
export const ALL_PRAYERS = ['Imsak', 'Subuh', 'Syuruk', 'Zohor', 'Asar', 'Maghrib', 'Isyak'] as const;

function solarParams(date: Date): { decl: number; eqt: number } {
	const J = Math.floor(date.getTime() / 86400000) + 2440588 - 0.5; // JD at 00:00 UTC
	const D = J - 2451545.0;
	const g = (((357.529 + 0.98560028 * D) % 360) + 360) % 360;
	const q = (((280.459 + 0.98564736 * D) % 360) + 360) % 360;
	const L = (((q + 1.915 * Math.sin(g * RAD) + 0.02 * Math.sin(2 * g * RAD)) % 360) + 360) % 360;
	const e = 23.439 - 0.00000036 * D;
	let RA = Math.atan2(Math.cos(e * RAD) * Math.sin(L * RAD), Math.cos(L * RAD)) / RAD / 15;
	RA = (RA + 24) % 24;
	const decl = Math.asin(Math.sin(e * RAD) * Math.sin(L * RAD)) / RAD;
	let eqt = q / 15 - RA;
	if (eqt > 12) eqt -= 24;
	if (eqt < -12) eqt += 24;
	return { decl, eqt };
}

function hourAngle(angle: number, decl: number, lat: number): number {
	const c =
		(-Math.sin(angle * RAD) - Math.sin(decl * RAD) * Math.sin(lat * RAD)) /
		(Math.cos(decl * RAD) * Math.cos(lat * RAD));
	if (c > 1 || c < -1) return NaN; // high latitudes: sun never reaches the angle
	return Math.acos(c) / RAD / 15;
}

/** DST-aware timezone offset in hours via Intl; falls back to the device offset. */
export function tzOffset(tz: string, date: Date): number {
	try {
		const a = new Date(date.toLocaleString('en-US', { timeZone: tz }));
		const b = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
		return (a.getTime() - b.getTime()) / 3600000;
	} catch {
		return -date.getTimezoneOffset() / 60;
	}
}

/** Current decimal hour in the given timezone. */
export function nowInTz(tz: string): number {
	try {
		const p = new Intl.DateTimeFormat('en-GB', {
			timeZone: tz,
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hour12: false
		}).formatToParts(new Date());
		const g = (k: string) => +(p.find((x) => x.type === k)?.value ?? 0);
		return (g('hour') % 24) + g('minute') / 60 + g('second') / 3600;
	} catch {
		const n = new Date();
		return n.getHours() + n.getMinutes() / 60 + n.getSeconds() / 3600;
	}
}

export function prayerTimes(lat: number, lng: number, date: Date, tz?: number): PrayerTimes {
	const { decl, eqt } = solarParams(date);
	if (tz === undefined) tz = 8;
	const noon = 12 - lng / 15 - eqt + tz;
	const asrAlt = Math.atan(1 / (1 + Math.tan(Math.abs(lat - decl) * RAD))) / RAD;
	const subuh = noon - hourAngle(20, decl, lat);
	return {
		Imsak: subuh - 10 / 60,
		Subuh: subuh,
		Syuruk: noon - hourAngle(0.833, decl, lat),
		Zohor: noon + 2 / 60,
		Asar: noon + hourAngle(-asrAlt, decl, lat),
		Maghrib: noon + hourAngle(0.833, decl, lat),
		Isyak: noon + hourAngle(18, decl, lat)
	};
}

/** "HH:MM"; non-finite (high latitude) -> "—". Minute rounding carries. */
export function fmtT(h: number): string {
	if (!isFinite(h)) return '—';
	h = ((h % 24) + 24) % 24;
	let H = Math.floor(h);
	let M = Math.round((h - H) * 60);
	if (M === 60) {
		H++;
		M = 0;
	}
	return `${String(H % 24).padStart(2, '0')}:${String(M).padStart(2, '0')}`;
}

export interface NextPrayer {
	name: string;
	/** decimal hours until it */
	diff: number;
	times: PrayerTimes;
}

/**
 * Next prayer for a location. Fixes the sample's after-Isyak bug
 * (it referenced undefined lat/lng and dropped the tz argument).
 */
export function nextPrayer(lat: number, lng: number, tz: string): NextPrayer {
	const now = new Date();
	const off = tzOffset(tz, now);
	const times = prayerTimes(lat, lng, now, off);
	const nowH = nowInTz(tz);
	for (const k of MAIN_PRAYERS) {
		if (isFinite(times[k]) && times[k] > nowH) {
			return { name: k, diff: times[k] - nowH, times };
		}
	}
	const tomorrow = new Date(now.getTime() + 86400000);
	const esok = prayerTimes(lat, lng, tomorrow, tzOffset(tz, tomorrow));
	const diff = isFinite(esok.Subuh) ? 24 - nowH + esok.Subuh : NaN;
	return { name: 'Subuh', diff, times };
}
