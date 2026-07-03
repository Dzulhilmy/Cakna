<script lang="ts">
	import type { Ayah, PageBundle, SurahMeta } from '$lib/api/types';
	import { toArabicNum } from '$lib/quran/meta';
	import { RULE_NAMES, segmentTaj } from '$lib/quran/tajweed';
	import { t } from '$lib/state/i18n.svelte';
	import { player } from '$lib/state/player.svelte';
	import { hls, notes, settings } from '$lib/state/stores.svelte';
	import { longpress } from '$lib/utils/longpress';
	import { toast } from 'svelte-sonner';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		bundle: PageBundle;
		flashG?: number | null;
		onactions: (g: number) => void;
	}
	let { bundle, flashG = null, onactions }: Props = $props();

	// Basmalah line uses the wasla form — NOT the same string as ayah 1:1.
	const BASMALAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';

	// hafazan reveals reset on every page change
	const revealed = new SvelteSet<number>();
	$effect(() => {
		void bundle.page;
		revealed.clear();
	});

	type Item =
		| { kind: 'band'; surah: SurahMeta }
		| { kind: 'basmalah' }
		| { kind: 'run'; ayahs: Ayah[] };

	const items = $derived.by(() => {
		const out: Item[] = [];
		let run: Ayah[] = [];
		for (const a of bundle.ayahs) {
			if (a.ayah === 1) {
				if (run.length) {
					out.push({ kind: 'run', ayahs: run });
					run = [];
				}
				const sm = bundle.surahs.find((s) => s.number === a.surah)!;
				out.push({ kind: 'band', surah: sm });
				if (a.surah !== 1 && a.surah !== 9) out.push({ kind: 'basmalah' });
			}
			run.push(a);
		}
		if (run.length) out.push({ kind: 'run', ayahs: run });
		return out;
	});

	function surahMeaning(sm: SurahMeta): string {
		return settings.value.uiLang === 'en' ? sm.name_en : sm.name_ms;
	}

	function handleTap(e: MouseEvent, a: Ayah) {
		const target = e.target as HTMLElement;
		// tap on a coloured rule -> name toast only (no play), like the sample
		if (settings.value.tajweed && target.tagName === 'I' && target.classList.contains('tj')) {
			const rc = [...target.classList].find((c) => /^t\d+$/.test(c));
			if (rc) {
				toast(t('rule') + RULE_NAMES[+rc.slice(1)]);
				return;
			}
		}
		if (settings.value.hideMode && !revealed.has(a.global)) {
			revealed.add(a.global);
			return;
		}
		player.toggle(a.global);
	}

	// keep the playing ayah centred
	$effect(() => {
		const g = player.playingG;
		if (g >= 1) {
			document.getElementById(`g${g}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
		}
	});

	// search-jump flash
	$effect(() => {
		if (flashG != null) {
			setTimeout(() => {
				const el = document.getElementById(`g${flashG}`);
				if (el) {
					el.scrollIntoView({ block: 'center' });
					el.classList.add('flash');
					setTimeout(() => el.classList.remove('flash'), 2500);
				}
			}, 120);
		}
	});
</script>

{#snippet ayahInner(a: Ayah)}
	<span class="at">
		{#each segmentTaj(a.ar, a.taj, settings.value.tajweed) as seg, i (i)}
			{#if seg.rule !== null}<i class="tj t{seg.rule}">{seg.text}</i>{:else}{seg.text}{/if}
		{/each}
	</span>
	{#if a.sajdah}<span class="sjd" title={t('sajdah')}>&#x06E9;</span>{/if}
	{#if notes.value[String(a.global)]}<span class="note-flag">&#x270E;</span>{/if}
	<span class="mrk">{toArabicNum(a.ayah)}</span>
{/snippet}

<article
	class="mushaf mx-auto max-w-[680px] rounded-[18px] border border-gold-soft bg-card px-[18px] pt-[22px] pb-[26px]"
	class:hide-mode={settings.value.hideMode}
>
	{#each items as item, idx (idx)}
		{#if item.kind === 'band'}
			<div class="surah-band" dir="rtl">
				سُورَةُ {item.surah.name_ar}
				<small>{item.surah.number}. {item.surah.name_translit} — {surahMeaning(item.surah)}</small>
			</div>
		{:else if item.kind === 'basmalah'}
			<div class="basmalah font-arabic" dir="rtl">{BASMALAH}</div>
		{:else if settings.value.inlineTrans}
			{#each item.ayahs as a (a.global)}
				<div class="ay-block" class:playing={player.playingG === a.global}>
					<span
						id="g{a.global}"
						role="button"
						tabindex="0"
						class="ay block cursor-pointer font-arabic"
						class:revealed={revealed.has(a.global)}
						class:hl1={hls.value[String(a.global)] === 1}
						class:hl2={hls.value[String(a.global)] === 2}
						class:hl3={hls.value[String(a.global)] === 3}
						class:playing={player.playingG === a.global}
						dir="rtl"
						use:longpress={() => onactions(a.global)}
						onclick={(e) => handleTap(e, a)}
						onkeydown={(e) => e.key === 'Enter' && player.toggle(a.global)}
					>
						{@render ayahInner(a)}
					</span>
					{#if settings.value.translit}
						<div class="ay-tl">{a.translit}</div>
					{/if}
					<div class="ay-tr">{a.tr[settings.value.transLang]}</div>
				</div>
			{/each}
		{:else}
			<p class="mushaf-text font-arabic" dir="rtl" style="text-align: {settings.value.align};">
				{#each item.ayahs as a (a.global)}<span
						id="g{a.global}"
						role="button"
						tabindex="0"
						class="ay cursor-pointer"
						class:revealed={revealed.has(a.global)}
						class:hl1={hls.value[String(a.global)] === 1}
						class:hl2={hls.value[String(a.global)] === 2}
						class:hl3={hls.value[String(a.global)] === 3}
						class:playing={player.playingG === a.global}
						use:longpress={() => onactions(a.global)}
						onclick={(e) => handleTap(e, a)}
						onkeydown={(e) => e.key === 'Enter' && player.toggle(a.global)}
					>{@render ayahInner(a)}</span>{' '}{/each}
			</p>
		{/if}
	{/each}
	<div class="page-deco">&#x25C6; {toArabicNum(bundle.page)} &#x25C6;</div>
</article>

<style>
	.mushaf-text {
		font-size: var(--arabic-size);
		line-height: 2.2;
	}
	.surah-band {
		text-align: center;
		border: 1px solid var(--gold-soft);
		border-radius: 14px;
		background: linear-gradient(180deg, rgba(199, 162, 75, 0.1), transparent);
		font-family: var(--font-arabic);
		font-size: calc(var(--arabic-size) * 1.15);
		padding: 10px 8px 12px;
		margin: 14px 0 10px;
	}
	.surah-band small {
		display: block;
		font-family: 'Figtree', sans-serif;
		font-size: 11px;
		color: var(--muted-foreground);
		letter-spacing: 0.04em;
		margin-top: 2px;
	}
	.basmalah {
		text-align: center;
		font-size: calc(var(--arabic-size) * 1.1);
		margin: 6px 0 10px;
	}
	.ay {
		border-radius: 8px;
		transition: background 0.2s;
	}
	.ay.hl1 .at { background: var(--hl-1); }
	.ay.hl2 .at { background: var(--hl-2); }
	.ay.hl3 .at { background: var(--hl-3); }
	.ay.playing {
		background: var(--playing);
		box-shadow: 0 0 0 4px var(--playing);
	}
	.mushaf.hide-mode :global(.ay:not(.revealed) .at) {
		filter: blur(7px);
	}
	.mrk {
		display: inline-grid;
		place-items: center;
		border: 1.5px solid var(--gold);
		border-radius: 50%;
		font-size: 0.45em;
		font-family: 'Figtree', sans-serif;
		font-weight: 700;
		color: var(--gold);
		min-width: 1.4em;
		height: 1.4em;
		margin: 0 0.25em;
		vertical-align: middle;
		line-height: 1;
	}
	.sjd {
		color: var(--gold);
		font-size: 0.75em;
		vertical-align: 0.35em;
	}
	.note-flag {
		color: var(--gold);
		font-size: 0.5em;
		vertical-align: 0.8em;
		margin-right: 0.15em;
	}
	.ay-block {
		border-bottom: 1px solid var(--border);
		padding: 12px 0;
	}
	.ay-block .ay {
		text-align: right;
		font-size: var(--arabic-size);
		line-height: 2.1;
	}
	.ay-tl {
		font-size: 13px;
		color: var(--muted-foreground);
		font-style: italic;
		margin-top: 4px;
	}
	.ay-tr {
		font-size: 14.5px;
		color: var(--foreground);
		margin-top: 4px;
		line-height: 1.6;
	}
	.page-deco {
		text-align: center;
		color: var(--gold);
		font-size: 11px;
		letter-spacing: 0.25em;
		margin-top: 18px;
	}
	:global(.ay.flash) {
		background: var(--hl-1);
		box-shadow: 0 0 0 4px var(--hl-1);
	}
</style>
