<!-- Quran ayah-range block for the Panduan Ibadah screen (port of the sample's
     qTextRange/qTransRange, index.html L2565-2575): Arabic with tajweed spans and
     ﴿n﴾ markers, plus the joined translation underneath when "Papar maksud" is on. -->
<script lang="ts" module>
	import { getSurah } from '$lib/api/content';
	import type { SurahBundle } from '$lib/api/types';

	// Module-level cache: the same surahs recur across tabs/re-renders.
	const surahCache = new Map<number, Promise<SurahBundle>>();
	function loadSurah(n: number): Promise<SurahBundle> {
		let p = surahCache.get(n);
		if (!p) {
			p = getSurah(n).catch((e) => {
				surahCache.delete(n);
				throw e;
			});
			surahCache.set(n, p);
		}
		return p;
	}
</script>

<script lang="ts">
	import { toArabicNum } from '$lib/quran/meta';
	import { segmentTaj } from '$lib/quran/tajweed';
	import { settings } from '$lib/state/stores.svelte';

	interface Props {
		surah: number;
		from: number;
		to: number;
		/** rem multiplier of --arabic-size (sample .ys-ay uses 0.95) */
		scale?: number;
		/** appended after the joined translation (surah ref / step description) */
		suffix?: string;
	}
	let { surah, from, to, scale = 0.85, suffix = '' }: Props = $props();

	const bundle = $derived(loadSurah(surah));
</script>

{#await bundle}
	<div class="h-10 animate-pulse rounded-lg bg-accent"></div>
{:then b}
	{@const ayahs = b.ayahs.filter((a) => a.ayah >= from && a.ayah <= to)}
	<p
		dir="rtl"
		class="font-arabic leading-[2.05]"
		style="font-size: calc(var(--arabic-size) * {scale});"
	>
		{#each ayahs as a (a.global)}
			{#each segmentTaj(a.ar, a.taj, settings.value.tajweed) as seg, i (i)}
				{#if seg.rule !== null}<i class="tj t{seg.rule}">{seg.text}</i>{:else}{seg.text}{/if}
			{/each}
			{' ﴿' + toArabicNum(a.ayah) + '﴾ '}
		{/each}
	</p>
	{#if settings.value.mtMaksud}
		<div class="mt-1.5 text-[13px] leading-[1.55] text-muted-foreground">
			{ayahs.map((a) => a.tr[settings.value.transLang]).join(' ')}{suffix}
		</div>
	{/if}
{:catch}
	<!-- offline / fetch failure: show nothing, same as the sample's missing-data path -->
{/await}
