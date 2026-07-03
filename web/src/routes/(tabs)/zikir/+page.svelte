<script lang="ts">
	import type { DhikrItem } from '$lib/api/types';
	import ArabicText from '$lib/components/ArabicText.svelte';
	import PageHeader from '$lib/components/chrome/PageHeader.svelte';
	import ZikirQuranCard from '$lib/components/modules/ZikirQuranCard.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { t } from '$lib/state/i18n.svelte';
	import { settings, tasbih } from '$lib/state/stores.svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const phrases = $derived(data.dhikr.filter((d) => d.kind === 'phrase'));
	const quranic = $derived(data.dhikr.filter((d) => d.kind === 'quran'));

	let padSection: HTMLElement | null = null;

	// Port of the sample's drawTasbih() label line.
	const labelLine = $derived(
		(tasbih.value.label === 'Tasbih bebas' ? t('tasbih_free') : tasbih.value.label) +
			' · ' +
			(tasbih.value.t ? t('target') + ' ' + tasbih.value.t : t('no_limit'))
	);

	function tap() {
		tasbih.value.c++;
		if (navigator.vibrate) navigator.vibrate(15);
		if (tasbih.value.t && tasbih.value.c === tasbih.value.t) {
			toast(t('t_target', { n: tasbih.value.t }));
			if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
		}
	}

	function setTarget(n: number) {
		tasbih.value.t = n;
		tasbih.value.c = 0;
	}

	function useZikir(z: DhikrItem) {
		const ar = z.arabic ?? '';
		tasbih.value = {
			c: 0,
			t: z.target_count || 0,
			label: ar.length > 34 ? ar.slice(0, 34) + '…' : ar
		};
		padSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		toast(t('t_tasbih_set'));
	}
</script>

<PageHeader title={t('p_zikir')} back="/" />

<div class="mx-auto max-w-[680px] px-4 py-4">
	<!-- TASBIH -->
	<section class="scroll-mt-16" bind:this={padSection}>
		<Card class="gap-0 rounded-2xl px-4">
			<p class="text-center text-[13px] text-muted-foreground">{labelLine}</p>
			<button
				type="button"
				class="mx-auto mt-3 grid h-44 w-44 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_26px_rgba(11,61,46,0.3)] transition-transform select-none active:scale-95"
				onclick={tap}
			>
				<span class="text-center">
					<span class="block font-display text-[56px] leading-none tabular-nums">
						{tasbih.value.c}
					</span>
					<span class="mt-2 block text-[12px] font-bold tracking-[0.15em] opacity-80">
						{t('tap')}
					</span>
				</span>
			</button>
			<div class="mt-4 flex flex-wrap items-center justify-center gap-2">
				{#each [33, 99, 100, 0] as n (n)}
					<Button
						variant={tasbih.value.t === n ? 'secondary' : 'outline'}
						size="sm"
						class="h-9 min-w-12 rounded-xl"
						onclick={() => setTarget(n)}
					>
						{n === 0 ? '∞' : n}
					</Button>
				{/each}
				<Button
					variant="ghost"
					size="sm"
					class="h-9 rounded-xl text-muted-foreground"
					onclick={() => (tasbih.value.c = 0)}
				>
					{t('reset')}
				</Button>
			</div>
		</Card>
	</section>

	<!-- ZIKIR HARIAN -->
	<h2 class="mt-6 mb-3 font-display text-[15px]">{t('daily_zikir')}</h2>
	<div class="grid gap-3">
		{#each phrases as z (z.position)}
			<Card class="gap-0 rounded-2xl px-4">
				<ArabicText text={z.arabic ?? ''} taj={z.tajweed} scale={0.82} />
				<p class="mt-1 text-[13px] leading-snug text-muted-foreground">
					{settings.value.uiLang === 'en' ? z.label_en : z.label_ms}
				</p>
				<div class="mt-2.5 flex items-center justify-between gap-2">
					{#if z.target_count}
						<Badge variant="outline" class="border-gold-soft text-gold">×{z.target_count}</Badge>
					{:else}
						<span></span>
					{/if}
					<Button
						variant="secondary"
						size="sm"
						class="h-8 rounded-xl px-4"
						onclick={() => useZikir(z)}
					>
						{t('count')}
					</Button>
				</div>
			</Card>
		{/each}
	</div>

	<!-- PERLINDUNGAN AYAT -->
	<h2 class="mt-6 mb-3 font-display text-[15px]">
		{settings.value.uiLang === 'en' ? 'Quranic protection' : 'Perlindungan ayat'}
	</h2>
	<div class="grid gap-3">
		{#each quranic as z (z.position)}
			<ZikirQuranCard item={z} />
		{/each}
	</div>
</div>
