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
		type Versi,
		type Waktu
	} from '$lib/data/mathurat';
	import { settings } from '$lib/state/stores.svelte';

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
			<p class="ar" style="font-size:{arSize}px">{arText}</p>
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
