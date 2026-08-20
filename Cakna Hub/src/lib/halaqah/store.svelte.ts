/**
 * The one active halaqah session, held at module scope.
 *
 * The room page used to own the session and tore it down on unmount, so any
 * navigation — opening a surah, Al-Ma'thurat, search, or just the back button —
 * ended the call. Living here instead, the connection outlives the route: the
 * room page becomes a *view* of the session rather than its owner, and a
 * persistent bar (HalaqahBar, mounted in the root layout) keeps it reachable.
 *
 * Only the user ends a session: "Keluar" (leave) or, for the host, "Tutup"
 * (close for everyone).
 */
import { HalaqahSession, type JoinInfo } from './room.svelte';

class HalaqahStore {
	/** The live session, or null when not in a room. */
	session = $state<HalaqahSession | null>(null);
	/**
	 * The in-flight join, so concurrent callers share ONE connection.
	 *
	 * This must be the promise itself, not a flag: an effect that runs twice
	 * before the first connect resolves would otherwise open a second LiveKit
	 * connection with the same identity, and the server kicks the duplicate —
	 * leaving the room stuck on "Menyambung…" forever.
	 */
	private pending: { slug: string; promise: Promise<HalaqahSession> } | null = null;

	get active() {
		return this.session?.connected === true;
	}

	/**
	 * Join a room, or return the existing session when it is already this room.
	 * Re-entering the room page must NOT reconnect — that would drop audio and
	 * re-prompt for the microphone.
	 */
	join(slug: string): Promise<HalaqahSession> {
		const current = this.session;
		if (current && current.slug === slug && current.connected) return Promise.resolve(current);
		// Already connecting to this room — hand back the SAME promise.
		if (this.pending?.slug === slug) return this.pending.promise;

		const promise = (async () => {
			// Switching rooms: close the old one first.
			if (this.session && this.session.slug !== slug) await this.leave();

			const r = await fetch(`/api/halaqah/rooms/${slug}/join`, {
				method: 'POST',
				credentials: 'same-origin'
			});
			if (!r.ok) {
				const body = (await r.json().catch(() => null)) as { error?: string } | null;
				const statusMessages: Record<number, string> = {
					404: 'Sesi halaqah tidak dijumpai.',
					403: 'Anda tidak dibenarkan menyertai sesi ini.',
					401: 'Sila log masuk untuk menyertai halaqah.',
					429: 'Terlalu banyak percubaan. Sila cuba sebentar lagi.',
				};
				throw new Error(body?.error ?? statusMessages[r.status] ?? `HTTP ${r.status}`, { cause: r.status });
			}
			const s = new HalaqahSession();
			await s.connect((await r.json()) as JoinInfo);
			this.session = s;
			return s;
		})();

		this.pending = { slug, promise };
		void promise.finally(() => {
			if (this.pending?.promise === promise) this.pending = null;
		});
		return promise;
	}

	/** Leave the room (others carry on). */
	async leave() {
		const s = this.session;
		this.session = null;
		this.pending = null;
		await s?.disconnect();
	}

	/** Host only: end the session for everyone, then leave. */
	async close() {
		const slug = this.session?.slug;
		if (slug) {
			await fetch(`/api/halaqah/rooms/${slug}/close`, {
				method: 'POST',
				credentials: 'same-origin'
			}).catch(() => {});
		}
		await this.leave();
	}
}

export const halaqah = new HalaqahStore();
