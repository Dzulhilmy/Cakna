// Export/import of all user data. Envelope: {app:"cakna", v:1, exported, ...keys}.
// Import also accepts the legacy sample envelope (app:"nur-al-quran") and maps
// its abbreviated settings keys to ours.
import { DATA_KEYS, registry, type SyncKey } from '$lib/state/persisted.svelte';
import { DEFAULT_SETTINGS, type Settings } from '$lib/state/stores.svelte';

export function exportData(): string {
	const out: Record<string, unknown> = {
		app: 'cakna',
		v: 1,
		exported: new Date().toISOString()
	};
	for (const key of DATA_KEYS) out[key] = registry.get(key)?.value ?? null;
	return JSON.stringify(out, null, 1);
}

export function downloadBackup() {
	const blob = new Blob([exportData()], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'cakna-data.json';
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Legacy sample settings used abbreviated keys and 0-based note/hl globals. */
function mapLegacySettings(s: Record<string, unknown>): Settings {
	return {
		...DEFAULT_SETTINGS,
		theme: (s.theme as Settings['theme']) ?? 'light',
		fontSize: (s.fontSize as number) ?? 26,
		qari: (s.qari as string) ?? 'ar.alafasy',
		showTrans: s.trans !== false,
		page: (s.page as number) ?? 1,
		autoFlip: s.flip === true,
		repeat: ([1, 2, 3, 5].includes(s.rep as number) ? s.rep : 1) as Settings['repeat'],
		tajweed: s.tj !== false,
		speed: ([0.75, 1, 1.25, 1.5].includes(s.spd as number) ? s.spd : 1) as Settings['speed'],
		inlineTrans: s.inl === true,
		uiLang: s.ul === 'en' ? 'en' : 'ms',
		transLang: (['ms', 'en', 'id'].includes(s.tl as string) ? s.tl : 'ms') as Settings['transLang'],
		translit: s.tlr === true,
		hideMode: s.hid === true,
		align: (['justify', 'center', 'right'].includes(s.al as string)
			? s.al
			: 'justify') as Settings['align'],
		mtMaksud: s.mm !== false,
		azan: s.az === true,
		showSunat: s.ss !== false
	};
}

function shiftKeys(obj: Record<string, unknown>, by: number): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(obj)) out[String(+k + by)] = v;
	return out;
}

/** Returns the number of keys imported; throws on an unrecognized file. */
export function importData(json: string): number {
	const d = JSON.parse(json) as Record<string, unknown>;
	const legacy = d.app === 'nur-al-quran';
	if (d.app !== 'cakna' && !legacy) throw new Error('bad-file');
	let n = 0;
	for (const key of DATA_KEYS) {
		let v = d[key];
		if (v === null || v === undefined) continue;
		if (legacy) {
			if (key === 'settings') v = mapLegacySettings(v as Record<string, unknown>);
			// legacy globals are 0-based; ours are 1-based
			if (key === 'notes' || key === 'hls') v = shiftKeys(v as Record<string, unknown>, 1);
		}
		registry.get(key as SyncKey)?.applyRemote(v);
		// mark dirty so it pushes to the server if signed in
		registry.get(key as SyncKey)!.dirtyAt = Date.now();
		n++;
	}
	return n;
}
