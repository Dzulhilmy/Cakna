<script lang="ts">
	import PublicShell from '$lib/components/public/PublicShell.svelte';
	import CustomSections from '$lib/components/public/CustomSections.svelte';
	import SectionBg from '$lib/components/public/SectionBg.svelte';
	import { hasBg } from '$lib/bg-utils';
	import { Check } from 'lucide-svelte';
	import { DEFAULT_SETEM_ORDER } from '$lib/site';
	let { data } = $props();
	const { content } = $derived(data);
	const p = $derived(content.setemPage);
	const hasHero = $derived(hasBg(p.heroBgImages));
	const hasCta = $derived(hasBg(p.ctaBgImages));
	const whatParas = $derived(p.whatBody.split(/\n\s*\n/).filter((s) => s.trim()));
	const setemOrder = $derived(content.sectionOrder?.setemPage ?? DEFAULT_SETEM_ORDER);
</script>
<svelte:head><title>SETEM · {content.brand.name}</title></svelte:head>
<PublicShell {content}>
	{#each setemOrder as key (key)}
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

		{:else if key === 'gap'}
			<section class="bg-white py-20">
				<div class="mx-auto max-w-6xl px-6">
					<div class="mx-auto max-w-2xl text-center">
						{#if p.gapEyebrow}<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{p.gapEyebrow}</p>{/if}
						<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{p.gapTitle}</h2>
						{#if p.gapSubtitle}<p class="mt-4 leading-relaxed text-zinc-500">{p.gapSubtitle}</p>{/if}
					</div>
					{#if p.gapStats.length > 0}
						<div class="mt-12 grid gap-6 sm:grid-cols-3">
							{#each p.gapStats as stat}
								<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
									<p class="text-3xl font-bold text-rose-600">{stat.value}</p>
									<p class="mt-2 text-sm leading-relaxed text-zinc-500">{stat.label}</p>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</section>

		{:else if key === 'whatIsSetem'}
			<section class="bg-zinc-50 py-20">
				<div class="mx-auto max-w-6xl px-6">
					<div>
						{#if p.whatEyebrow}<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{p.whatEyebrow}</p>{/if}
						<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{p.whatTitle}</h2>
						{#each whatParas as para}
							<p class="mt-4 leading-relaxed text-zinc-600">{para}</p>
						{/each}
					</div>
				</div>
			</section>

		{:else if key === 'whatToExpect'}
			{#if p.expect.length > 0}
				<section class="bg-white py-20">
					<div class="mx-auto max-w-6xl px-6">
						<div class="rounded-2xl border border-zinc-200 bg-white p-8">
							<h3 class="text-base font-semibold text-zinc-900">{p.expectTitle}</h3>
							<ul class="mt-4 space-y-3">
								{#each p.expect as item}
									<li class="flex items-center gap-3 text-sm text-zinc-700">
										<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Check size={12} /></span>
										{item}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</section>
			{/if}

		{:else if key === 'whoIsItFor'}
			{#if p.audience.length > 0}
				<section class="bg-zinc-50 py-20">
					<div class="mx-auto max-w-6xl px-6">
						<div class="mx-auto max-w-2xl text-center">
							{#if p.audienceEyebrow}<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{p.audienceEyebrow}</p>{/if}
							<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{p.audienceTitle}</h2>
						</div>
						<div class="mt-10 grid gap-6 sm:grid-cols-3">
							{#each p.audience as item}
								<div class="rounded-2xl border border-zinc-200 bg-white p-6">
									<h3 class="text-base font-semibold text-zinc-900">{item.title}</h3>
									<p class="mt-2 text-sm leading-relaxed text-zinc-500">{item.desc}</p>
								</div>
							{/each}
						</div>
					</div>
				</section>
			{/if}

		{:else if key === 'ourProcess'}
			{#if p.steps.length > 0}
				<section class="bg-white py-20">
					<div class="mx-auto max-w-4xl px-6">
						<div class="text-center">
							{#if p.processEyebrow}<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{p.processEyebrow}</p>{/if}
							<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{p.processTitle}</h2>
						</div>
						<ol class="mt-10 space-y-4">
							{#each p.steps as step, i}
								<li class="flex items-start gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
									<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-sm font-bold text-rose-600">{i + 1}</span>
									<div>
										<p class="font-semibold text-zinc-900">{step.title}</p>
										<p class="mt-1 text-sm leading-relaxed text-zinc-500">{step.desc}</p>
									</div>
								</li>
							{/each}
						</ol>
					</div>
				</section>
			{/if}

		{:else if key === 'customSections'}
			<CustomSections sections={content.customSections?.setem} />

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
