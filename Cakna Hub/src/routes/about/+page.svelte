<script lang="ts">
	import PublicShell from '$lib/components/public/PublicShell.svelte';
	import CustomSections from '$lib/components/public/CustomSections.svelte';
	import SectionBg from '$lib/components/public/SectionBg.svelte';
	import { hasBg } from '$lib/bg-utils';
	import { DEFAULT_ABOUT_ORDER } from '$lib/site';
	let { data } = $props();
	const { content } = $derived(data);
	const p = $derived(content.aboutPage);
	const hasHero = $derived(hasBg(p.heroBgImages));
	const hasCta = $derived(hasBg(p.ctaBgImages));
	const whoParas = $derived(p.whoBody.split(/\n\s*\n/).filter((s) => s.trim()));
	const aboutOrder = $derived(content.sectionOrder?.aboutPage ?? DEFAULT_ABOUT_ORDER);
</script>
<svelte:head><title>About Us · {content.brand.name}</title></svelte:head>
<PublicShell {content}>
	{#each aboutOrder as key (key)}
		{#if key === 'hero'}
			<section class="relative overflow-hidden {hasHero ? 'text-white' : 'bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200'}">
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
				</div>
			</section>

		{:else if key === 'whoWeAre'}
			<section class="bg-white py-20">
				<div class="mx-auto max-w-4xl px-6">
					<div class="grid gap-12 lg:grid-cols-2">
						<div>
							<h2 class="text-2xl font-bold tracking-tight text-zinc-900">{p.whoTitle}</h2>
							{#each whoParas as para}
								<p class="mt-4 leading-relaxed text-zinc-600">{para}</p>
							{/each}
						</div>
						<div class="rounded-2xl border border-rose-100 bg-rose-50 p-8">
							<h3 class="text-base font-semibold uppercase tracking-wide text-rose-600">{p.visionTitle}</h3>
							<p class="mt-3 leading-relaxed text-zinc-700">{p.visionText}</p>
						</div>
					</div>
				</div>
			</section>

		{:else if key === 'purpose'}
			<section class="bg-zinc-50 py-20">
				<div class="mx-auto max-w-6xl px-6">
					<div class="mx-auto max-w-2xl text-center">
						{#if p.purposeEyebrow}<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{p.purposeEyebrow}</p>{/if}
						<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{p.purposeTitle}</h2>
						{#if p.purposeSubtitle}<p class="mt-4 text-zinc-500">{p.purposeSubtitle}</p>{/if}
					</div>
					{#if p.purpose.length > 0}
						<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{#each p.purpose as item, i}
								<div class="rounded-2xl border border-zinc-200 bg-white p-6">
									<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 text-sm font-bold">{i + 1}</div>
									<h3 class="mt-4 text-base font-semibold text-zinc-900">{item.title}</h3>
									<p class="mt-2 text-sm leading-relaxed text-zinc-500">{item.desc}</p>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</section>

		{:else if key === 'collabStats'}
			<section class="bg-white py-20">
				<div class="mx-auto max-w-6xl px-6">
					<div class="mx-auto max-w-2xl text-center">
						{#if p.collabEyebrow}<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{p.collabEyebrow}</p>{/if}
						<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{p.collabTitle}</h2>
						{#if p.collabSubtitle}<p class="mt-4 leading-relaxed text-zinc-500">{p.collabSubtitle}</p>{/if}
					</div>
					{#if p.stats.length > 0}
						<div class="mt-12 grid gap-6 sm:grid-cols-3">
							{#each p.stats as stat}
								<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
									<p class="text-4xl font-bold text-rose-600">{stat.value}</p>
									<p class="mt-2 text-sm text-zinc-500">{stat.label}</p>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</section>

		{:else if key === 'testimonial'}
			{#if p.testimonial}
				<section class="bg-zinc-50 py-16">
					<div class="mx-auto max-w-3xl px-6 text-center">
						<blockquote class="text-xl font-medium leading-relaxed text-zinc-800">"{p.testimonial}"</blockquote>
						{#if p.testimonialAuthor}
							<p class="mt-4 text-sm text-zinc-500">— {p.testimonialAuthor}</p>
						{/if}
					</div>
				</section>
			{/if}

		{:else if key === 'customSections'}
			<CustomSections sections={content.customSections?.about} />

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
