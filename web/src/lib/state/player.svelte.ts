// Audio engine — exact port of the sample's onended chain (index.html L2154+),
// adapted to 1-BASED globals (CDN url needs no +1 here).
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { audioUrl, gToSA, pageOf, pageRange, SURAHS, TOTAL_AYAHS } from '$lib/quran/meta';
import { settings } from './stores.svelte';

class Player {
	playingG = $state(-1); // 1-based global; -1 = idle
	abStart = $state(-1);
	abEnd = $state(-1);
	abActive = $state(false);
	/** set true while the player itself navigates the reader (keepAudio) */
	navigating = false;
	onError: ((msg: string) => void) | null = null;

	#audio: HTMLAudioElement | null = null;
	#playedCount = 0;

	get audio(): HTMLAudioElement {
		if (!this.#audio) {
			this.#audio = new Audio();
			this.#audio.addEventListener('ended', () => this.#onEnded());
			this.#audio.addEventListener('loadeddata', () => {
				// some browsers reset playbackRate on new src
				if (this.#audio) this.#audio.playbackRate = settings.value.speed;
			});
			this.#audio.addEventListener('error', () => {
				if (this.playingG >= 0) {
					this.onError?.('audio');
					this.stop();
				}
			});
		}
		return this.#audio;
	}

	playFrom(g: number) {
		if (!browser || g < 1 || g > TOTAL_AYAHS) return;
		if (this.playingG !== g) this.#playedCount = 0;
		this.playingG = g;
		const a = this.audio;
		a.src = audioUrl(settings.value.qari, g);
		a.playbackRate = settings.value.speed;
		a.play().catch(() => {
			this.onError?.('audio');
			this.stop();
		});
		this.#updateMediaSession(g);
	}

	playPage(p: number) {
		this.playFrom(pageRange(p)[0]);
	}

	toggle(g: number) {
		if (this.playingG === g) this.stop();
		else this.playFrom(g);
	}

	stop() {
		if (this.#audio) {
			this.#audio.pause();
			this.#audio.removeAttribute('src');
		}
		this.playingG = -1;
		this.#playedCount = 0;
		// any stop clears the A–B loop, like the sample
		this.abActive = false;
		this.abStart = -1;
		this.abEnd = -1;
	}

	/** A–B loop setup: first call sets A, second sets B (swapped if reversed) and starts. */
	setAB(g: number): 'a-set' | 'started' | 'stopped' {
		if (this.abActive) {
			this.stop();
			return 'stopped';
		}
		if (this.abStart < 0) {
			this.abStart = g;
			return 'a-set';
		}
		this.abEnd = g;
		if (this.abEnd < this.abStart) [this.abStart, this.abEnd] = [this.abEnd, this.abStart];
		this.abActive = true;
		this.#gotoPageOf(this.abStart);
		this.playFrom(this.abStart);
		return 'started';
	}

	/** re-play current ayah with the new qari (sample behaviour on qari change) */
	qariChanged() {
		if (this.playingG >= 0) this.playFrom(this.playingG);
	}
	speedChanged() {
		if (this.#audio) this.#audio.playbackRate = settings.value.speed;
	}
	repeatChanged() {
		this.#playedCount = 0;
	}

	#gotoPageOf(g: number) {
		const p = pageOf(g);
		if (p !== pageOf(this.playingG >= 1 ? this.playingG : g) || p !== settings.value.page) {
			this.navigating = true;
			goto(`/read/${p}`).finally(() => (this.navigating = false));
		}
	}

	#onEnded() {
		const g = this.playingG;
		if (g < 0) return;

		// 1. repeat the same ayah
		this.#playedCount++;
		if (this.#playedCount < settings.value.repeat) {
			const a = this.audio;
			a.currentTime = 0;
			a.play().catch(() => this.stop());
			return;
		}
		this.#playedCount = 0;

		// 2. A–B loop (inclusive ends, wraps forever, crosses pages)
		if (this.abActive) {
			let nx = g + 1;
			if (nx > this.abEnd) nx = this.abStart;
			this.#gotoPageOf(nx);
			this.playFrom(nx);
			return;
		}

		// 3. next ayah on the current page
		const page = pageOf(g);
		const [, last] = pageRange(page);
		if (g < last) {
			this.playFrom(g + 1);
			return;
		}

		// 4. auto-flip to the next page
		if (settings.value.autoFlip && page < 604) {
			this.navigating = true;
			goto(`/read/${page + 1}`).finally(() => (this.navigating = false));
			this.playFrom(g + 1);
			return;
		}

		// 5. end (incl. global 6236)
		this.stop();
	}

	#updateMediaSession(g: number) {
		if (!('mediaSession' in navigator)) return;
		const { s, a } = gToSA(g);
		navigator.mediaSession.metadata = new MediaMetadata({
			title: `${SURAHS[s - 1].name_translit} · ${s}:${a}`,
			artist: 'Cakna',
			album: 'Al-Quran'
		});
		navigator.mediaSession.setActionHandler('play', () => this.audio.play());
		navigator.mediaSession.setActionHandler('pause', () => this.audio.pause());
		navigator.mediaSession.setActionHandler('stop', () => this.stop());
	}
}

export const player = new Player();
