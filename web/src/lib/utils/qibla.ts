// Qibla bearing + device compass — port of the sample (index.html L3897+).
const RAD = Math.PI / 180;
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export function qiblaBearing(lat: number, lng: number): number {
	const f1 = lat * RAD;
	const f2 = KAABA_LAT * RAD;
	const dl = (KAABA_LNG - lng) * RAD;
	const b = Math.atan2(Math.sin(dl), Math.cos(f1) * Math.tan(f2) - Math.sin(f1) * Math.cos(dl)) / RAD;
	return (b + 360) % 360;
}

interface OrientationEventiOS extends DeviceOrientationEvent {
	webkitCompassHeading?: number;
}

/**
 * Start listening to the device compass. Returns a cleanup fn, or throws
 * 'denied' | 'unsupported'. iOS 13+ permission is requested here (must be
 * called from a user gesture).
 */
export async function startCompass(onHeading: (h: number) => void): Promise<() => void> {
	const doe = window.DeviceOrientationEvent as unknown as
		| { requestPermission?: () => Promise<string> }
		| undefined;
	if (!doe) throw new Error('unsupported');
	if (typeof doe.requestPermission === 'function') {
		let r: string;
		try {
			r = await doe.requestPermission();
		} catch {
			throw new Error('unsupported');
		}
		if (r !== 'granted') throw new Error('denied');
	}
	const handler = (e: DeviceOrientationEvent) => {
		const ev = e as OrientationEventiOS;
		let h: number | null = null;
		if (typeof ev.webkitCompassHeading === 'number') h = ev.webkitCompassHeading;
		else if (typeof e.alpha === 'number') h = 360 - e.alpha;
		if (h !== null) onHeading((h + 360) % 360);
	};
	window.addEventListener('deviceorientationabsolute', handler, true);
	window.addEventListener('deviceorientation', handler, true);
	return () => {
		window.removeEventListener('deviceorientationabsolute', handler, true);
		window.removeEventListener('deviceorientation', handler, true);
	};
}
