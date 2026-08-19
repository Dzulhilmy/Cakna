// Audio engine — exact port of the sample's onended chain (index.html L2154+),
// adapted to 1-BASED globals (CDN url needs no +1 here).
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { audioUrl, gToSA, pageOf, pageRange, SURAHS, TOTAL_AYAHS } from '$lib/quran/meta';
import { loadChapterTimings, segmentsFor, wordAt, type WordSeg } from '$lib/quran/wordtiming';
import { settings } from './stores.svelte';

class Player {
	playingG = $state(-1); // 1-based global; -1 = idle
	/** 1-based index of the word the reciter is on within the current ayah
	 *  (Alafasy only, from word timings); -1 when unknown/none. */
	currentWord = $state(-1);
	abStart = $state(-1);
	abEnd = $state(-1);
	abActive = $state(false);
	/** Surah whose Basmalah the reciter is currently on — drives a distinct
	 *  (gold) highlight on that line. null when not reciting a Basmalah. */
	basmalahSurah = $state<number | null>(null);
	/** set true while the player itself navigates the reader (keepAudio) */
	navigating = false;
	onError: ((msg: string) => void) | null = null;

	#audio: HTMLAudioElement | null = null;
	#playedCount = 0;
	/** The ayah to recite once the current Basmalah pre-roll finishes. */
	#pendingAfterBasmalah = -1;
	/** Consecutive failed load/play attempts for the current audio, plus the pending
	 *  retry timer — so a transient CDN/network blip retries instead of giving up. */
	#retries = 0;
	#retryTimer: ReturnType<typeof setTimeout> | null = null;
	/** Word segments for the currently-playing ayah (Alafasy), or null. */
	#segs: WordSeg[] | null = null;

	get audio(): HTMLAudioElement {
		if (!this.#audio) {
			this.#audio = new Audio();
			this.#audio.addEventListener('ended', () => this.#onEnded());
			this.#audio.addEventListener('loadeddata', () => {
				// some browsers reset playbackRate on new src
				if (this.#audio) this.#audio.playbackRate = settings.value.speed;
			});
			// A clean playback start means whatever was failing has recovered.
			this.#audio.addEventListener('playing', () => {
				this.#retries = 0;
			});
			// Word-by-word: follow the reciter through the current ayah's segments.
			this.#audio.addEventListener('timeupdate', () => {
				if (!this.#segs || this.playingG < 0 || this.basmalahSurah !== null) return;
				const ms = (this.#audio?.currentTime ?? 0) * 1000;
				const w = wordAt(this.#segs, ms);
				if (w !== this.currentWord) this.currentWord = w;
			});
			this.#audio.addEventListener('error', () => this.#onAudioFail());
		}
		return this.#audio;
	}

	/** Public entry: begin recitation at global g — reciting the Basmalah first
	 *  when g opens a surah (see #startAyah). */
	playFrom(g: number) {
		this.#startAyah(g);
	}

	/**
	 * Recite the Basmalah before a surah's opening ayah, then the ayah itself.
	 * Skipped for Al-Fatihah (its Basmalah IS ayah 1, already played) and
	 * At-Tawbah (no Basmalah). The Basmalah audio reuses global 1 — Al-Fatihah 1:1.
	 */
	#startAyah(g: number) {
		if (!browser || g < 1 || g > TOTAL_AYAHS) return;
		const { s, a } = gToSA(g);
		if (a === 1 && s !== 1 && s !== 9) {
			if (this.playingG !== g) this.#playedCount = 0;
			this.basmalahSurah = s;
			this.#pendingAfterBasmalah = g;
			// Keep playingG on the ayah so the page still reads as "playing"; the ayah
			// stays un-green (see MushafPage) until the Basmalah finishes.
			this.playingG = g;
			this.currentWord = -1;
			this.#segs = null;
			const au = this.audio;
			au.src = audioUrl(settings.value.qari, 1);
			au.playbackRate = settings.value.speed;
			au.play().catch(() => this.#onAudioFail());
			this.#updateMediaSession(g);
			return;
		}
		this.#playAyahRaw(g);
	}

	/** Play a single ayah's audio directly (no Basmalah pre-roll). */
	#playAyahRaw(g: number) {
		if (!browser || g < 1 || g > TOTAL_AYAHS) return;
		this.basmalahSurah = null;
		if (this.playingG !== g) this.#playedCount = 0;
		this.playingG = g;
		this.#loadWordTimings(g);
		const a = this.audio;
		a.src = audioUrl(settings.value.qari, g);
		a.playbackRate = settings.value.speed;
		a.play().catch(() => this.#onAudioFail());
		this.#updateMediaSession(g);
	}

	/** Prepare word-by-word timings for ayah g (Alafasy only; a no-op otherwise). */
	#loadWordTimings(g: number) {
		this.currentWord = -1;
		this.#segs = null;
		if (settings.value.qari !== 'ar.alafasy') return;
		const { s, a } = gToSA(g);
		const cached = segmentsFor(s, a);
		if (cached) {
			this.#segs = cached;
			return;
		}
		void loadChapterTimings(s).then(() => {
			if (this.playingG === g && this.basmalahSurah === null) this.#segs = segmentsFor(s, a);
		});
	}

	/**
	 * A load/play failure. Transient CDN or network blips are common on mobile, so
	 * retry the current audio a few times (with backoff) before giving up — rather
	 * than killing playback and flashing "check your internet" on the first hiccup.
	 * Duplicate 'error' events while a retry is already queued are ignored.
	 */
	#onAudioFail() {
		if (this.playingG < 0 || this.#retryTimer) return;
		if (this.#retries >= 3) {
			this.#retries = 0;
			this.onError?.('audio');
			this.stop();
			return;
		}
		this.#retries++;
		const g = this.playingG;
		const basmalah = this.basmalahSurah !== null;
		this.#retryTimer = setTimeout(() => {
			this.#retryTimer = null;
			if (this.playingG !== g) return; // user moved on — abandon the retry
			const a = this.audio;
			a.src = audioUrl(settings.value.qari, basmalah ? 1 : g);
			a.playbackRate = settings.value.speed;
			void a.play().catch(() => this.#onAudioFail());
		}, 500 * this.#retries);
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
		this.currentWord = -1;
		this.#segs = null;
		this.#playedCount = 0;
		this.basmalahSurah = null;
		this.#pendingAfterBasmalah = -1;
		if (this.#retryTimer) {
			clearTimeout(this.#retryTimer);
			this.#retryTimer = null;
		}
		this.#retries = 0;
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
			goto(`/mushaf?page=${p}`).finally(() => (this.navigating = false));
		}
	}

	#onEnded() {
		// A Basmalah pre-roll just finished → now recite the surah's opening ayah.
		if (this.basmalahSurah !== null) {
			this.basmalahSurah = null;
			this.#playAyahRaw(this.#pendingAfterBasmalah);
			return;
		}

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

		// 4. continue onto the next page — recitation plays on, page after page,
		//    until the end of the Quran or the user stops it themselves. (Previously
		//    gated on the auto-flip setting; continuous playback is now the default.)
		if (page < 604) {
			this.navigating = true;
			goto(`/mushaf?page=${page + 1}`).finally(() => (this.navigating = false));
			this.playFrom(g + 1);
			return;
		}

		// 5. end of the Quran (global 6236)
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
