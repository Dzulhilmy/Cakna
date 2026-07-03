import { browser } from '$app/environment';

// The 15 synced storage keys, mirroring the sample's DATA_KEYS.
export const DATA_KEYS = [
	'settings',
	'bookmarks',
	'notes',
	'hls',
	'read',
	'readlog',
	'khatamToasted',
	'tasbih',
	'city',
	'sgdays',
	'onboarded',
	'mathurat',
	'mgquiz',
	'puasa',
	'manasik'
] as const;
export type SyncKey = (typeof DATA_KEYS)[number];

// Keys whose values merge as sets/maps on first login; the rest are
// scalar (server wins when both exist).
export const MERGE_KEYS: SyncKey[] = [
	'bookmarks',
	'notes',
	'hls',
	'read',
	'readlog',
	'puasa'
];

export const registry = new Map<SyncKey, Persisted<unknown>>();

const LS_PREFIX = 'cakna:';

export class Persisted<T> {
	value = $state<T>() as T;
	/** epoch ms of the last local write; 0 = never dirtied locally */
	dirtyAt = 0;
	#lastSerialized: string;

	constructor(
		public readonly key: SyncKey,
		defaultValue: T
	) {
		let initial = defaultValue;
		if (browser) {
			try {
				const raw = localStorage.getItem(LS_PREFIX + key);
				if (raw !== null) initial = JSON.parse(raw) as T;
			} catch {
				/* corrupted entry — fall back to default */
			}
		}
		this.value = initial;
		this.#lastSerialized = JSON.stringify(initial);
		registry.set(key, this as Persisted<unknown>);
	}

	/** Serialize; returns the JSON string when it changed since last call, else null. */
	serializeIfChanged(): string | null {
		const s = JSON.stringify(this.value);
		if (s === this.#lastSerialized) return null;
		this.#lastSerialized = s;
		return s;
	}

	writeLocal(serialized: string) {
		if (browser) localStorage.setItem(LS_PREFIX + this.key, serialized);
		this.dirtyAt = Date.now();
	}

	/** Replace from server without marking dirty (no push-back). */
	applyRemote(v: T) {
		this.value = v;
		const s = JSON.stringify(v);
		this.#lastSerialized = s;
		if (browser) localStorage.setItem(LS_PREFIX + this.key, s);
		this.dirtyAt = 0;
	}
}
