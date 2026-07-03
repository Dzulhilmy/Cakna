<script lang="ts" module>
	import { getSurah } from '$lib/api/content';
	import type { SurahBundle } from '$lib/api/types';

	// Lazy per-surah cache shared by every dua that references the same surah.
	const surahCache = new Map<number, Promise<SurahBundle>>();
	function loadSurah(n: number): Promise<SurahBundle> {
		let p = surahCache.get(n);
		if (!p) {
			p = getSurah(n);
			p.catch(() => surahCache.delete(n)); // allow retry after a failure
			surahCache.set(n, p);
		}
		return p;
	}
</script>

<script lang="ts">
	import type { QuranRef } from '$lib/api/types';
	import ArabicText from '$lib/components/ArabicText.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { SURAHS } from '$lib/quran/meta';
	import { t } from '$lib/state/i18n.svelte';
	import { player } from '$lib/state/player.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import { Play, Square } from '@lucide/svelte';

	let { qref }: { qref: QuranRef } = $props();

	const bundlePromise = loadSurah(qref.surah);

	function togglePlay(g: number) {
		if (navigator.vibrate) navigator.vibrate(15);
		player.toggle(g);
	}
</script>

{#await bundlePromise}
	<div class="grid gap-2 py-1">
		<Skeleton class="h-10 w-full" />
		<Skeleton class="h-4 w-2/3" />
	</div>
{:then bundle}
	<div class="grid gap-3">
		{#each bundle.ayahs.slice(qref.ayah_from - 1, qref.ayah_to) as ayah (ayah.global)}
			<div>
				<ArabicText text={ayah.ar} taj={ayah.taj} scale={0.85} />
				<p class="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
					{ayah.tr[settings.value.transLang]}
				</p>
				<div class="mt-1.5 flex items-center justify-between gap-2">
					<span class="text-[11.5px] font-bold whitespace-nowrap text-gold">
						{SURAHS[ayah.surah - 1].name_translit}
						{ayah.surah}:{ayah.ayah}
					</span>
					<button
						class="grid h-8 w-8 flex-none place-items-center rounded-full border transition-colors
							{player.playingG === ayah.global ? 'border-primary text-primary' : 'text-muted-foreground hover:bg-accent'}"
						aria-label={t('act_play')}
						onclick={() => togglePlay(ayah.global)}
					>
						{#if player.playingG === ayah.global}
							<Square size={13} fill="currentColor" />
						{:else}
							<Play size={14} />
						{/if}
					</button>
				</div>
			</div>
		{/each}
	</div>
{:catch}
	<p class="py-2 text-sm text-muted-foreground">
		{settings.value.uiLang === 'en' ? 'Failed to load the verses.' : 'Gagal memuatkan ayat.'}
	</p>
{/await}
