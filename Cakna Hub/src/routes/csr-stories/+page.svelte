<script lang="ts">
	import PublicShell from '$lib/components/public/PublicShell.svelte';
	import CustomSections from '$lib/components/public/CustomSections.svelte';
	import SectionBg from '$lib/components/public/SectionBg.svelte';
	import { hasBg } from '$lib/bg-utils';
	import { Calendar, Tag } from 'lucide-svelte';
	import { DEFAULT_CSR_ORDER } from '$lib/site';
	let { data } = $props();
	const { content } = $derived(data);
	const p = $derived(content.csrPage);
	const hasHero = $derived(hasBg(p.heroBgImages));
	const hasCta = $derived(hasBg(p.ctaBgImages));
	const csrOrder = $derived(content.sectionOrder?.csrPage ?? DEFAULT_CSR_ORDER);
</script>
<svelte:head><title>{p.eyebrow} · {content.brand.name}</title></svelte:head>
<PublicShell {content}>
	{#each csrOrder as key (key)}
		{#if key === 'hero'}
			<section class="relative overflow-hidden {hasHero ? 'bg-zinc-900 text-white' : 'bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200'}">
				{#if hasHero}
					<SectionBg images={p.heroBgImages} overlay={p.heroOverlay} />
				{:else}
					<div aria-hidden="true" class="pointer-events-none absolute inset-0">
						<div class="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-rose-300/40 blur-3xl"></div>
						<div class="absolute -right-16 top-10 h-80 w-80 rounded-full bg-rose-400/30 blur-3xl"></div>
					</div>
				{/if}
				<div class="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
					<p class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ring-1 {hasHero ? 'bg-white/10 text-rose-100 ring-white/20' : 'bg-white/60 text-rose-700 ring-rose-200 backdrop-blur'}">
						<span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
						{p.eyebrow}
					</p>
					<h1 class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl {hasHero ? 'text-white' : 'text-zinc-900'}">{p.heading}</h1>
					{#if p.subtext}<p class="mx-auto mt-5 max-w-2xl text-lg {hasHero ? 'text-rose-100' : 'text-zinc-600'}">{p.subtext}</p>{/if}
				</div>
			</section>

		{:else if key === 'stories'}
			<section class="bg-white py-20">
				<div class="mx-auto max-w-6xl px-6">
					{#if p.stories.length === 0}
						<p class="text-center text-zinc-400">Tiada cerita lagi. Sila semak semula kemudian.</p>
					{:else}
						<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{#each p.stories as story (story.title)}
								<article class="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
									{#if story.cover}
										<img src={story.cover} alt={story.title} class="aspect-[16/9] w-full object-cover" />
									{:else}
										<div class="aspect-[16/9] w-full bg-rose-50"></div>
									{/if}
									<div class="flex flex-1 flex-col p-6">
										<div class="flex items-center gap-3 text-xs text-zinc-400">
											<span class="flex items-center gap-1"><Calendar size={12} /> {story.date}</span>
											<span class="flex items-center gap-1"><Tag size={12} /> {story.category}</span>
										</div>
										<h2 class="mt-3 text-base font-semibold leading-snug text-zinc-900">{story.title}</h2>
										{#if story.excerpt}<p class="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">{story.excerpt}</p>{/if}
									</div>
								</article>
							{/each}
						</div>
					{/if}
				</div>
			</section>

		{:else if key === 'customSections'}
			<CustomSections sections={content.customSections?.csr} />

		{:else if key === 'cta'}
			{#if p.ctaHeading}
				<section class="relative overflow-hidden {hasCta ? 'text-white' : 'bg-rose-600 text-white'}">
					{#if hasCta}
						<SectionBg images={p.ctaBgImages} overlay={p.ctaOverlay} />
					{/if}
					<div class="relative mx-auto max-w-3xl px-6 py-20 text-center">
						<h2 class="text-3xl font-bold tracking-tight">{p.ctaHeading}</h2>
						{#if p.ctaText}<p class="mt-4 text-lg text-rose-100">{p.ctaText}</p>{/if}
						{#if p.ctaLabel}
							<a href={p.ctaHref || '#'} class="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-rose-700 shadow-lg transition-colors hover:bg-rose-50">
								{p.ctaLabel}
							</a>
						{/if}
					</div>
				</section>
			{/if}
		{/if}
	{/each}
</PublicShell>
