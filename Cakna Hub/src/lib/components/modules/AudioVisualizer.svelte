<script lang="ts">
	/**
	 * Frequency-bar visualiser for a live audio track.
	 *
	 * Draws from a Web Audio AnalyserNode rather than LiveKit's `audioLevel`,
	 * because audioLevel is a single scalar sampled a few times a second — enough
	 * for a "who is talking" dot, not enough to look like sound. An FFT gives a
	 * real spectrum at frame rate.
	 *
	 * Pass a MediaStreamTrack (from LiveKit's track.mediaStreamTrack). When it is
	 * null the bars settle to a flat idle line rather than disappearing, so the
	 * component does not pop in and out as the floor changes hands.
	 */
	interface Props {
		track?: MediaStreamTrack | null;
		/** Drawn in the accent colour when true — used to mark the active speaker. */
		live?: boolean;
		height?: number;
		bars?: number;
	}
	let { track = null, live = false, height = 96, bars = 40 }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let ctx: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let source: MediaStreamAudioSourceNode | null = null;
	let raf = 0;
	/** Smoothed bar heights, so the animation eases instead of strobing.
	 *  Derived from `bars` so changing the count resizes the buffer. */
	let level = $derived(new Float32Array(bars));

	function teardownAudio() {
		source?.disconnect();
		source = null;
		analyser = null;
		// Keep the AudioContext: creating one per track leaks, and browsers cap
		// how many a page may hold.
	}

	function attach(t: MediaStreamTrack) {
		teardownAudio();
		ctx ??= new AudioContext();
		// Autoplay policy can leave the context suspended until a user gesture.
		if (ctx.state === 'suspended') void ctx.resume();
		analyser = ctx.createAnalyser();
		analyser.fftSize = 256;
		analyser.smoothingTimeConstant = 0.75;
		source = ctx.createMediaStreamSource(new MediaStream([t]));
		source.connect(analyser);
		// Deliberately NOT connected to ctx.destination: the session attaches each
		// remote track to its own <audio> element, so routing it here as well would
		// double the volume. NOTE the track must be attached somewhere for this to
		// read anything at all — Chrome yields silence for an unattached remote
		// WebRTC track (measured: 0 unattached vs ~1300 attached). See
		// HalaqahSession.playRemote.
	}

	$effect(() => {
		if (track) attach(track);
		else teardownAudio();
	});

	$effect(() => {
		const el = canvas;
		if (!el) return;
		// Cache the 2D context and the spectrum buffer once — not per frame.
		const g = el.getContext('2d');
		if (!g) return;
		const spectrum = new Uint8Array(128);

		// The accent colour is a CSS custom property, so reading it needs
		// getComputedStyle — which forces a style recalc. Doing that every frame
		// (~60×/s) was the visualiser's biggest cost, felt most on mobile. Cache
		// it and refresh only ~twice a second, which is plenty to pick up a
		// light/dark theme toggle. Switching accent↔idle on `live` stays instant.
		const IDLE = '#B8C2BC';
		let accent = '#155B44';
		let sinceAccentRead = 1e9;

		const draw = () => {
			raf = requestAnimationFrame(draw);
			const dpr = window.devicePixelRatio || 1;
			const w = el.clientWidth;
			if (el.width !== w * dpr || el.height !== height * dpr) {
				el.width = w * dpr;
				el.height = height * dpr;
			}
			g.setTransform(dpr, 0, 0, dpr, 0, 0);
			g.clearRect(0, 0, w, height);

			if (++sinceAccentRead >= 30) {
				accent = getComputedStyle(el).getPropertyValue('--lk-accent').trim() || '#155B44';
				sinceAccentRead = 0;
			}
			const colour = live ? accent : IDLE;

			if (analyser) analyser.getByteFrequencyData(spectrum);

			const gap = 3;
			const bw = Math.max(2, (w - gap * (bars - 1)) / bars);

			for (let i = 0; i < bars; i++) {
				// Sample the lower ~2/3 of the spectrum; the top octaves are mostly
				// empty for speech and would leave the right-hand bars dead.
				const idx = Math.floor((i / bars) * 84);
				const raw = analyser ? spectrum[idx] / 255 : 0;
				// Ease toward the target so bars glide rather than jump.
				level[i] += (raw - level[i]) * 0.35;
				const minH = 3;
				const h = Math.max(minH, level[i] * height * 0.95);
				const x = i * (bw + gap);
				const y = (height - h) / 2;
				g.fillStyle = colour;
				g.globalAlpha = analyser ? 0.55 + level[i] * 0.45 : 0.3;
				// rounded caps read better than hard rectangles at this size
				const r = Math.min(bw / 2, 3);
				g.beginPath();
				g.roundRect(x, y, bw, h, r);
				g.fill();
			}
			g.globalAlpha = 1;
		};

		raf = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(raf);
	});

	$effect(() => {
		return () => {
			teardownAudio();
			void ctx?.close();
			ctx = null;
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="viz"
	style="height:{height}px"
	aria-hidden="true"
></canvas>

<style>
	.viz {
		display: block;
		width: 100%;
		--lk-accent: #155b44;
	}
	:global(.dark) .viz {
		--lk-accent: #3f9e7c;
	}
</style>
