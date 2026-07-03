// Location + prayer-times state shared by /solat, home card and /qibla.
import { getCities } from '$lib/api/content';
import type { City } from '$lib/api/types';
import { nextPrayer, type NextPrayer } from '$lib/utils/solar';
import { city } from './stores.svelte';

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

	async loadCities() {
		if (this.cities.length === 0) this.cities = await getCities();
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
