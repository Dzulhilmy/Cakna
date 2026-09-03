<script lang="ts">
	import { player } from '$lib/state/player.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import { gToSA, SURAHS, TOTAL_AYAHS } from '$lib/quran/meta';
	import { QARIS } from '$lib/quran/tajweed';
	import { Square, Play, SkipBack, SkipForward, Repeat } from 'lucide-svelte';

	let { currentPage }: { currentPage: number } = $props();

	const playing = $derived(player.playingG >= 1);

	const ayahInfo = $derived.by(() => {
		if (player.playingG < 1) return null;
		if (player.basmalahSurah !== null) {
			return {
				surah: 'Basmalah',
				ref: SURAHS[player.basmalahSurah - 1].name_translit
			};
		}
		const { s, a } = gToSA(player.playingG);
		return {
			surah: SURAHS[s - 1].name_translit,
			ref: `${s}:${a}`
		};
	});

	const qariName = $derived(QARIS.find((q) => q.id === settings.value.qari)?.name ?? '');

	const SPEEDS = [0.75, 1, 1.25, 1.5];
	const REPEATS = [1, 2, 3, 5];

	function nextSpeed() {
		const idx = SPEEDS.indexOf(settings.value.speed);
		settings.value.speed = SPEEDS[(idx < 0 ? 1 : (idx + 1) % SPEEDS.length)];
		player.speedChanged();
	}

	function nextRepeat() {
		const idx = REPEATS.indexOf(settings.value.repeat);
		settings.value.repeat = REPEATS[(idx < 0 ? 0 : (idx + 1) % REPEATS.length)];
		player.repeatChanged();
	}

	function prevAyah() {
		if (player.playingG > 1) player.playFrom(player.playingG - 1);
	}

	function nextAyah() {
		if (player.playingG > 0 && player.playingG < TOTAL_AYAHS) player.playFrom(player.playingG + 1);
	}
</script>

<div class="audio-player">
	<div class="ap-inner">
		{#if playing}
			<button class="ap-btn stop" onclick={() => player.stop()} aria-label="Berhenti">
				<Square size={15} fill="currentColor" />
			</button>

			<button
				class="ap-btn skip"
				onclick={prevAyah}
				disabled={player.playingG <= 1}
				aria-label="Ayah sebelum"
			>
				<SkipBack size={15} />
			</button>

			<div class="ap-info">
				<span class="ap-dot"></span>
				<div class="ap-text">
					<span class="ap-surah">{ayahInfo?.surah}</span>
					<span class="ap-ref">{ayahInfo?.ref}</span>
				</div>
			</div>

			<button
				class="ap-btn skip"
				onclick={nextAyah}
				disabled={player.playingG >= TOTAL_AYAHS}
				aria-label="Ayah seterusnya"
			>
				<SkipForward size={15} />
			</button>
		{:else}
			<span class="ap-qari">{qariName}</span>
			<button class="play-page-btn" onclick={() => player.playPage(currentPage)}>
				<Play size={13} fill="currentColor" />
				Main Halaman
			</button>
		{/if}

		<div class="ap-meta">
			<button class="meta-btn" onclick={nextSpeed} title="Kelajuan main"
				>{settings.value.speed}x</button
			>
			<button class="meta-btn repeat-btn" onclick={nextRepeat} title="Ulangan">
				<Repeat size={11} />{settings.value.repeat}x
			</button>
		</div>
	</div>
</div>

<style>
	.audio-player {
		position: fixed;
		bottom: 76px;
		left: 76px;
		right: 0;
		z-index: 19;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 16px;
		background: var(--pg-hdr);
		border-top: 1px solid rgba(199, 162, 75, 0.2);
		backdrop-filter: blur(8px);
	}

	.ap-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		max-width: 520px;
	}

	.ap-btn {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-btn-color);
		cursor: pointer;
		flex-shrink: 0;
		transition: background 0.15s;
	}
	.ap-btn:hover:not(:disabled) {
		background: var(--pg-btn-hover);
	}
	.ap-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.stop {
		color: rgba(239, 68, 68, 0.85);
		border-color: rgba(239, 68, 68, 0.2);
	}

	.ap-info {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-width: 0;
	}

	.ap-dot {
		width: 8px;
		height: 8px;
		flex-shrink: 0;
		border-radius: 50%;
		background: #22c55e;
		box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
		animation: ap-pulse 1.6s ease-in-out infinite;
	}
	@keyframes ap-pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.55;
			transform: scale(0.8);
		}
	}

	.ap-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 0;
	}
	.ap-surah {
		font-size: 12px;
		font-weight: 600;
		color: var(--pg-text-85);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 160px;
	}
	.ap-ref {
		font-size: 10px;
		color: rgba(199, 162, 75, 0.85);
		letter-spacing: 0.06em;
	}

	.ap-qari {
		font-size: 11px;
		color: var(--pg-muted);
		font-style: italic;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 140px;
	}

	.play-page-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		border-radius: 10px;
		background: rgba(199, 162, 75, 0.1);
		border: 1px solid rgba(199, 162, 75, 0.25);
		color: #c7a24b;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		flex-shrink: 0;
		transition: background 0.15s;
	}
	.play-page-btn:hover {
		background: rgba(199, 162, 75, 0.18);
	}

	.ap-meta {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}
	.meta-btn {
		padding: 5px 9px;
		border-radius: 8px;
		background: var(--pg-btn);
		border: 1px solid var(--pg-surface-b);
		color: var(--pg-text-75);
		font-size: 11px;
		cursor: pointer;
		transition: background 0.15s;
		white-space: nowrap;
	}
	.meta-btn:hover {
		background: var(--pg-btn-hover);
	}
	.repeat-btn {
		display: flex;
		align-items: center;
		gap: 4px;
	}
</style>
