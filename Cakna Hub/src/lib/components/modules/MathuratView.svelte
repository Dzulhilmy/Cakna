<script lang="ts">
	/**
	 * Read-only Al-Ma'thurat item, for embedding in a halaqah room.
	 *
	 * Shows the wirid item the reciter is on. Deliberately NOT the full reader:
	 * no counters, no progress writes, no settings dialog — a participant watching
	 * along must not have their own wirid progress altered by what someone else
	 * is reading. Text comes from the same helpers the reader uses, so the two can
	 * never drift apart.
	 */
	import {
		BASMALAH,
		JENIS_LABEL,
		LISTS,
		VERSI_LABEL,
		pecahAyat,
		pickText,
		safeIdx,
		findUlang,
		arWithHighlight,
		type Versi,
		type Waktu
	} from '$lib/data/mathurat';
	import { settings } from '$lib/state/stores.svelte';
	import { Repeat } from 'lucide-svelte';

	interface Props {
		version: Versi;
		mode: Waktu;
		idx: number;
	}
	let { version, mode, idx }: Props = $props();

	const i = $derived(safeIdx(version, idx));
	const list = $derived(LISTS[version]);
	const item = $derived(list[i]);

	const arText = $derived(pickText(item, version, mode, 'ar'));
	const rumiText = $derived(pickText(item, version, mode, 'rumi'));
	// Follow the viewer's own translation language, not the reciter's.
	const terjText = $derived(
		settings.value.transLang === 'en'
			? pickText(item, version, mode, 'bi') || pickText(item, version, mode, 'bm')
			: pickText(item, version, mode, 'bm')
	);
	const ayat = $derived(pecahAyat(arText));
	const ulang = $derived(findUlang(arText));
	// Long passages get a slightly smaller face so they still fit the panel.
	const arSize = $derived(arText.length > 400 ? 22 : 26);
</script>

<div class="mv">
	<div class="head">
		<div class="ttl">{item.tajuk}</div>
		<div class="meta">
			{VERSI_LABEL[version].nama} · {mode === 'pagi' ? 'Wirid Pagi' : 'Wirid Petang'} ·
			{JENIS_LABEL[item.jenis]} · {item.reps}×
		</div>
	</div>

	{#if item.basmalah}
		<p class="ar" style="font-size:{Math.round(arSize * 0.8)}px">{BASMALAH}</p>
	{/if}

	{#key `${version}-${mode}-${i}`}
		{#if ayat}
			{#each ayat as a, n (n)}
				<p class="ar" style="font-size:{arSize}px">{a}</p>
			{/each}
		{:else}
			<p class="ar" style="font-size:{arSize}px">{@html arWithHighlight(arText)}</p>
		{/if}

		{#if ulang}
			<div class="ulang-card">
				<Repeat size={12} class="ulang-icon" />
				<span class="ulang-label">Ulang {ulang.count} kali</span>
				<span class="ulang-phrase" dir="rtl">{ulang.phrase}</span>
			</div>
		{/if}

		{#if rumiText}
			<p class="rumi">{rumiText}</p>
		{/if}
		{#if terjText}
			<p class="terj">{terjText}</p>
		{/if}
	{/key}

	<div class="pos">Item {i + 1} / {list.length}</div>
</div>

<style>
	.mv { padding: 4px 2px 2px; }
	.head { text-align: center; margin-bottom: 14px; }
	.ttl { font-size: 15px; font-weight: 600; }
	.meta { font-size: 11.5px; color: var(--muted-foreground, #5c6b63); margin-top: 3px; }
	.ar {
		font-family: var(--font-arabic, 'Amiri Quran', 'Scheherazade New', serif);
		direction: rtl;
		text-align: right;
		line-height: 2.1;
		margin: 0 0 12px;
	}
	:global(.ulang-mark) {
		background: rgba(184, 140, 30, 0.18);
		border-radius: 5px;
		padding: 0 3px;
		color: #d4a843;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
	}
	.ulang-card {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		margin: 4px 0 10px;
		border-radius: 9px;
		background: rgba(184, 140, 30, 0.08);
		border: 1px solid rgba(184, 140, 30, 0.25);
	}
	:global(.ulang-icon) { color: #d4a843; flex-shrink: 0; }
	.ulang-label { font-size: 11px; color: rgba(212, 168, 67, 0.75); flex-shrink: 0; }
	html:not([data-theme="dark"]) :global(.ulang-icon) { color: #8a6015; }
	html:not([data-theme="dark"]) .ulang-label { color: rgba(100, 70, 10, 0.8); }
	.ulang-phrase {
		flex: 1;
		font-family: var(--font-arabic, 'Amiri Quran', 'Scheherazade New', serif);
		font-size: 15px;
		line-height: 1.9;
		color: #d4a843;
		text-align: right;
	}
	html:not([data-theme="dark"]) .ulang-phrase { color: #7a5010; }
	.rumi {
		font-style: italic;
		font-size: 13.5px;
		line-height: 1.9;
		color: var(--muted-foreground, #5c6b63);
		margin: 14px 0 0;
	}
	.terj { font-size: 14px; line-height: 1.8; margin: 12px 0 0; }
	.pos {
		margin-top: 16px;
		text-align: center;
		font-size: 11.5px;
		color: var(--muted-foreground, #5c6b63);
	}
</style>
