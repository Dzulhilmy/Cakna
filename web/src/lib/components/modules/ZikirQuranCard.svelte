<script lang="ts" module>
	import { getSurah } from '$lib/api/content';
	import type { SurahBundle } from '$lib/api/types';

	// Shared across cards so the two Al-Baqarah items fetch surah 2 only once.
	const surahCache = new Map<number, Promise<SurahBundle>>();
	function fetchSurah(n: number): Promise<SurahBundle> {
		let p = surahCache.get(n);
		if (!p) {
			p = getSurah(n);
			p.catch(() => surahCache.delete(n));
			surahCache.set(n, p);
		}
		return p;
	}
</script>

<script lang="ts">
	import type { Ayah, DhikrItem } from '$lib/api/types';
	import ArabicText from '$lib/components/ArabicText.svelte';
	import { Card } from '$lib/components/ui/card';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { t } from '$lib/state/i18n.svelte';
	import { player } from '$lib/state/player.svelte';
	import { settings } from '$lib/state/stores.svelte';
	import { ChevronDown, Play, Square } from '@lucide/svelte';

	let { item }: { item: DhikrItem } = $props();

	const label = $derived(settings.value.uiLang === 'en' ? item.label_en : item.label_ms);

	let open = $state(false);
	let ayahs = $state<Ayah[] | null>(null);
	let failed = $state(false);

	async function ensureLoaded() {
		const ref = item.quran_ref;
		if (!ref || ayahs) return;
		failed = false;
		try {
			const bundle = await fetchSurah(ref.surah);
			ayahs = bundle.ayahs.filter((a) => a.ayah >= ref.ayah_from && a.ayah <= ref.ayah_to);
		} catch {
			failed = true;
		}
	}
</script>

<Card class="gap-0 rounded-2xl px-4">
	<Collapsible.Root bind:open onOpenChange={(o: boolean) => o && ensureLoaded()}>
		<div class="flex items-center justify-between gap-3">
			<p class="min-w-0 flex-1 text-[13.5px] leading-snug font-bold">{label}</p>
			<Collapsible.Trigger
				class="inline-flex h-8 shrink-0 items-center gap-1 rounded-xl bg-secondary px-3 text-[13px] font-medium text-secondary-foreground hover:bg-secondary/80"
			>
				{t('read')}
				<ChevronDown size={15} class="transition-transform {open ? 'rotate-180' : ''}" />
			</Collapsible.Trigger>
		</div>
		<Collapsible.Content>
			<div class="mt-3 grid gap-4 border-t pt-3">
				{#if failed}
					<div class="text-center text-sm text-muted-foreground">
						<p>
							{settings.value.uiLang === 'en'
								? 'Could not load the verses.'
								: 'Ayat tidak dapat dimuatkan.'}
						</p>
						<button class="mt-1 text-primary underline" onclick={ensureLoaded}>
							{t('quiz_retry')}
						</button>
					</div>
				{:else if !ayahs}
					<div class="grid gap-2 py-1">
						<Skeleton class="h-6 w-full" />
						<Skeleton class="h-6 w-3/4 justify-self-end" />
						<Skeleton class="h-4 w-1/2" />
					</div>
				{:else}
					{#each ayahs as a (a.global)}
						<div>
							<ArabicText text={a.ar} taj={a.taj} scale={0.82} />
							<p class="mt-1 text-[13px] leading-relaxed text-muted-foreground">
								{a.tr[settings.value.transLang]}
							</p>
							<div class="mt-1 flex items-center gap-1.5">
								<span class="text-xs tabular-nums text-muted-foreground">({a.surah}:{a.ayah})</span>
								<button
									class="grid h-8 w-8 place-items-center rounded-lg text-primary hover:bg-accent"
									aria-label="play {a.surah}:{a.ayah}"
									onclick={() => player.toggle(a.global)}
								>
									{#if player.playingG === a.global}
										<Square size={14} fill="currentColor" />
									{:else}
										<Play size={15} />
									{/if}
								</button>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</Card>
