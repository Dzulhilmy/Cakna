// Guest-first persistence + optional server sync.
// - Always: every store change -> localStorage (via setupPersistence effects).
// - Authed: debounced PUT per dirty key; pull-and-merge on login/app start.
import { api } from '$lib/api/client';
import { auth } from './auth.svelte';
import { MERGE_KEYS, registry, type SyncKey } from './persisted.svelte';

interface SyncEnvelope {
	keys: Record<string, { value: unknown; updated_at: string }>;
}

const PUSH_DEBOUNCE_MS = 1500;
let pending = new Set<SyncKey>();
let timer: ReturnType<typeof setTimeout> | null = null;

function schedulePush(key: SyncKey) {
	if (!auth.user) return;
	pending.add(key);
	if (timer) clearTimeout(timer);
	timer = setTimeout(flush, PUSH_DEBOUNCE_MS);
}

export async function flush() {
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}
	if (!auth.user || pending.size === 0) return;
	const items = [...pending].map((key) => ({
		key,
		value: registry.get(key)!.value
	}));
	pending = new Set();
	try {
		await api.put('/api/sync', items);
	} catch {
		// re-queue on failure; next change or focus retries
		for (const it of items) pending.add(it.key as SyncKey);
	}
}

/** Union-style merges for collection keys on first login. */
function mergeValues(key: SyncKey, local: unknown, remote: unknown): unknown {
	if (key === 'bookmarks' || key === 'read') {
		const set = new Set([...(remote as number[]), ...(local as number[])]);
		return [...set].sort((a, b) => a - b);
	}
	if (key === 'notes' || key === 'hls') {
		return { ...(remote as object), ...(local as object) };
	}
	if (key === 'readlog') {
		const out: Record<string, number> = { ...(remote as Record<string, number>) };
		for (const [d, n] of Object.entries(local as Record<string, number>)) {
			out[d] = Math.max(out[d] ?? 0, n);
		}
		return out;
	}
	if (key === 'puasa') {
		const r = remote as { adj: number; recs: { d: string; t: string; r?: string }[] };
		const l = local as { adj: number; recs: { d: string; t: string; r?: string }[] };
		const seen = new Set(r.recs.map((x) => x.d + x.t));
		return {
			adj: Math.max(r.adj, l.adj),
			recs: [...r.recs, ...l.recs.filter((x) => !seen.has(x.d + x.t))]
		};
	}
	if (key === 'mathurat') {
		// Merge rekod: union of all days; for each day union pagi/petang flags
		// so a locally-completed session is never discarded by a stale server value.
		const r = remote as { rekod?: Record<string, Record<string, boolean>> };
		const l = local as { rekod?: Record<string, Record<string, boolean>> };
		const mergedRekod = { ...(r.rekod ?? {}) };
		for (const [date, sessions] of Object.entries(l.rekod ?? {})) {
			mergedRekod[date] = { ...(mergedRekod[date] ?? {}), ...sessions };
		}
		return { ...r, rekod: mergedRekod };
	}
	return remote;
}

/** On login / authed boot: pull server state, merge guest data, push winners. */
export async function pullAndMerge() {
	if (!auth.user) return;
	const remote = await api.get<SyncEnvelope>('/api/sync');
	const pushes: { key: string; value: unknown }[] = [];

	for (const [key, store] of registry) {
		const r = remote.keys[key];
		if (!r) {
			// server has nothing -> push local (guest) value
			pushes.push({ key, value: store.value });
			continue;
		}
		if (MERGE_KEYS.includes(key) && store.dirtyAt > 0) {
			const merged = mergeValues(key, store.value, r.value);
			store.applyRemote(merged);
			pushes.push({ key, value: merged });
		} else {
			// scalar keys: server wins
			store.applyRemote(r.value);
		}
	}
	if (pushes.length) await api.put('/api/sync', pushes).catch(() => {});
}

/**
 * Root-effect wiring: call once from the root layout inside $effect.root/component
 * context. Watches every store deeply; persists locally and schedules pushes.
 */
export function setupPersistence() {
	for (const [key, store] of registry) {
		$effect(() => {
			// touch the value deeply so any nested mutation reruns this effect
			const serialized = JSON.stringify(store.value);
			if (serialized === undefined) return;
			const changed = store.serializeIfChanged() !== null;
			if (changed || localStorage.getItem('cakna:' + key) === null) {
				store.writeLocal(serialized);
				schedulePush(key);
			}
		});
	}
	const onVisibility = () => {
		if (document.visibilityState === 'hidden') flush();
	};
	document.addEventListener('visibilitychange', onVisibility);
	window.addEventListener('beforeunload', () => {
		// Must use keepalive fetch here — async flush() is abandoned on page unload.
		// keepalive requests are guaranteed to complete even through navigation/refresh.
		if (!auth.user || pending.size === 0) return;
		if (timer) { clearTimeout(timer); timer = null; }
		const items = [...pending].map((key) => ({ key, value: registry.get(key)!.value }));
		pending = new Set();
		fetch('/api/sync', {
			method: 'PUT',
			credentials: 'same-origin',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(items),
			keepalive: true
		}).catch(() => {});
	});
	return () => document.removeEventListener('visibilitychange', onVisibility);
}
