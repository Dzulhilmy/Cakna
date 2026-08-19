// Location + prayer-times state shared by /solat, home card and /qibla.
// Malaysian cities use OFFICIAL JAKIM e-Solat times (via /api/solat/{zone});
// GPS and international cities fall back to the astronomical calculation.
import { api } from '$lib/api/client';
import { getCities } from '$lib/api/content';
import type { City } from '$lib/api/types';
import { JAKIM_ZONES } from '$lib/utils/jakim-zones';
import {
	MAIN_PRAYERS,
	nextPrayer,
	nowInTz,
	prayerTimes,
	tzOffset,
	type NextPrayer,
	type PrayerTimes
} from '$lib/utils/solar';
import { city } from './stores.svelte';

export interface OfficialTimes {
	zone: string;
	date: string;
	hijri: string;
	times: PrayerTimes; // decimal hours, same keys as the astronomical calc
}

interface OfficialResponse {
	zone: string;
	date: string;
	hijri: string;
	times: Record<string, string>; // "HH:MM:SS"
}

function toDecimal(hms: string): number {
	const [h, m, s] = hms.split(':').map(Number);
	return (h ?? 0) + (m ?? 0) / 60 + (s ?? 0) / 3600;
}

export interface Loc {
	name: string;
	lat: number;
	lng: number;
	tz: string;
	gps: boolean;
}

const DEVICE_TZ = (() => {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kuala_Lumpur';
	} catch {
		return 'Asia/Kuala_Lumpur';
	}
})();

class SolatState {
	cities = $state<City[]>([]);
	gpsName = $state<string | null>(null);
	tick = $state(0); // bump to recompute countdowns
	/** official JAKIM times for the current location's zone (null = astronomical) */
	official = $state<OfficialTimes | null>(null);
	#officialCache = new Map<string, OfficialTimes>();

	async loadCities() {
		if (this.cities.length === 0) this.cities = await getCities();
		await this.loadOfficial();
	}

	/** JAKIM zone for the current location; null for GPS/international. */
	get zone(): string | null {
		const l = this.loc;
		return l && !l.gps ? (JAKIM_ZONES[l.name] ?? null) : null;
	}

	async loadOfficial() {
		const zone = this.zone;
		if (!zone) {
			this.official = null;
			return;
		}
		const key = `${zone}|${new Date().toDateString()}`;
		const cached = this.#officialCache.get(key);
		if (cached) {
			this.official = cached;
			return;
		}
		try {
			const r = await api.get<OfficialResponse>(`/api/solat/${zone}`);
			const times = Object.fromEntries(
				Object.entries(r.times).map(([k, v]) => [k, toDecimal(v)])
			) as unknown as PrayerTimes;
			const value: OfficialTimes = { zone: r.zone, date: r.date, hijri: r.hijri, times };
			this.#officialCache.set(key, value);
			this.official = value;
		} catch {
			this.official = null; // astronomical fallback
		}
	}

	get loc(): Loc | null {
		const c = city.value;
		if (typeof c === 'object' && c !== null && 'g' in c) {
			return {
				name: this.gpsName ?? 'GPS',
				lat: c.g[0],
				lng: c.g[1],
				tz: DEVICE_TZ,
				gps: true
			};
		}
		const idx = typeof c === 'number' ? c : 0;
		const row = this.cities[idx];
		if (!row) return null;
		return { name: row.name, lat: row.lat, lng: row.lng, tz: row.tz, gps: false };
	}

	get next(): NextPrayer | null {
		void this.tick;
		const l = this.loc;
		if (!l) return null;
		const o = this.official;
		if (o && o.zone === this.zone) {
			const nowH = nowInTz(l.tz);
			for (const k of MAIN_PRAYERS) {
				const at = o.times[k];
				if (isFinite(at) && at > nowH) return { name: k, diff: at - nowH, times: o.times };
			}
			// after Isyak: tomorrow's official times aren't published yet — approximate
			// the countdown astronomically, but keep showing today's official list
			const tomorrow = new Date(Date.now() + 86400000);
			const esok = prayerTimes(l.lat, l.lng, tomorrow, tzOffset(l.tz, tomorrow));
			const diff = isFinite(esok.Subuh) ? 24 - nowH + esok.Subuh : NaN;
			return { name: 'Subuh', diff, times: o.times };
		}
		return nextPrayer(l.lat, l.lng, l.tz);
	}

	useGps(): Promise<Loc> {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) return reject(new Error('unsupported'));
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					city.value = { g: [pos.coords.latitude, pos.coords.longitude] };
					resolve(this.loc!);
				},
				() => reject(new Error('denied')),
				{ timeout: 12000, maximumAge: 600000 }
			);
		});
	}
}

export const solat = new SolatState();
