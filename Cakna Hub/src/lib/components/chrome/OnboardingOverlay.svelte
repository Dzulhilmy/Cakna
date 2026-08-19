<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onboardingSlides, onboardingIcons, t } from '$lib/state/i18n.svelte';
	import { onboarded } from '$lib/state/stores.svelte';

	let idx = $state(0);
	const slides = $derived(onboardingSlides());

	function next() {
		if (idx < slides.length - 1) idx++;
		else onboarded.value = true;
	}
</script>

<div class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background px-8 text-center">
	<div class="grid h-24 w-24 place-items-center rounded-3xl border border-gold-soft bg-card text-primary">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted build-time SVG from our own data -->
		{@html onboardingIcons[Math.min(idx, onboardingIcons.length - 1)]}
	</div>
	<h1 class="font-display text-2xl text-primary">{slides[idx][0]}</h1>
	<p class="max-w-sm text-[15px] leading-relaxed text-muted-foreground">{slides[idx][1]}</p>

	<div class="flex gap-1.5">
		{#each slides as _, i (i)}
			<span class="h-1.5 rounded-full transition-all {i === idx ? 'w-6 bg-primary' : 'w-1.5 bg-border'}"></span>
		{/each}
	</div>

	<div class="flex w-full max-w-sm flex-col gap-2">
		<Button size="lg" onclick={next}>
			{idx < slides.length - 1 ? t('onb_next') : t('onb_start')}
		</Button>
		{#if idx < slides.length - 1}
			<Button variant="ghost" onclick={() => (onboarded.value = true)}>{t('onb_skip')}</Button>
		{/if}
	</div>
</div>
