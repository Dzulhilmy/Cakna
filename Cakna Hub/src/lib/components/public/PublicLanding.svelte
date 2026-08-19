<script lang="ts">
	import { ArrowRight, Users, Sprout, HandHeart } from 'lucide-svelte';
	import PublicShell from './PublicShell.svelte';
	import ProgramsExplorer from './ProgramsExplorer.svelte';
	import ImpactStats from './ImpactStats.svelte';
	import CustomSections from './CustomSections.svelte';
	import HomeGallery from './HomeGallery.svelte';
	import HomePartners from './HomePartners.svelte';
	import SectionBg from './SectionBg.svelte';
	import { hasBg } from '$lib/bg-utils';
	import type { SiteContent } from '$lib/site';
	import { DEFAULT_HOME_ORDER } from '$lib/site';

	let {
		content,
		programsByCore,
	}: {
		content: SiteContent;
		programsByCore?: Record<string, { slug: string; name: string; description: string }[]>;
	} = $props();

	const { hero, about, programs, impact, cta, homeGallery, partners } = $derived(content);
	const hasHeroImage = $derived(hasBg(hero.bgImages));
	const hasQuoteImage = $derived(hasBg(about.quoteBgImages));
	const aboutParas = $derived(about.body.split(/\n\s*\n/).filter((p) => p.trim()));
	const homeOrder = $derived(content.sectionOrder?.home ?? DEFAULT_HOME_ORDER);
</script>

<PublicShell {content}>
	{#each homeOrder as key (key)}
		{#if key === 'hero'}
			<section
				class="relative overflow-hidden {hasHeroImage
					? 'text-white'
					: 'bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200 text-zinc-800'}"
			>
				{#if hasHeroImage}
					<SectionBg images={hero.bgImages} overlay={hero.overlay} />
				{:else}
					<div aria-hidden="true" class="pointer-events-none absolute inset-0">
						<div class="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-rose-300/40 blur-3xl"></div>
						<div class="absolute -right-16 top-10 h-80 w-80 rounded-full bg-rose-400/30 blur-3xl"></div>
						<div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white"></div>
					</div>
				{/if}
				<div class="relative mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
					<p
						class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ring-1 {hasHeroImage
							? 'bg-white/10 text-rose-100 ring-white/20'
							: 'bg-white/60 text-rose-700 ring-rose-200 backdrop-blur'}"
					>
						<span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
						{hero.eyebrow}
					</p>
					<h1
						class="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl {hasHeroImage
							? 'text-white'
							: 'text-zinc-900'}"
					>
						{hero.heading}
					</h1>
					<p class="mx-auto mt-5 max-w-2xl text-lg {hasHeroImage ? 'text-rose-50' : 'text-zinc-700'}">
						{hero.subtext}
					</p>
					<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
						<a
							href={hero.primaryCta.href}
							class="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 {hasHeroImage
								? 'bg-white text-rose-700 shadow-lg shadow-black/10'
								: 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700'}"
						>
							{hero.primaryCta.label}
							<ArrowRight size={16} />
						</a>
						<a
							href={hero.secondaryCta.href}
							class="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors {hasHeroImage
								? 'border-white/40 text-white hover:bg-white/10'
								: 'border-rose-300 bg-white/70 text-rose-700 hover:bg-white'}"
						>
							{hero.secondaryCta.label}
						</a>
					</div>
				</div>
			</section>

		{:else if key === 'about'}
			<section id="tentang" class="mx-auto max-w-6xl px-6 py-20">
				<div class="grid items-center gap-10 lg:grid-cols-2">
					<div>
						<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{about.eyebrow}</p>
						<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{about.title}</h2>
						{#each aboutParas as p}
							<p class="mt-4 leading-relaxed text-zinc-600">{p}</p>
						{/each}
					</div>
					<div
						class="relative overflow-hidden rounded-3xl p-8 {hasQuoteImage
							? 'text-white'
							: 'border border-rose-100 bg-rose-50'}"
					>
						<SectionBg images={about.quoteBgImages} overlay={about.quoteOverlay} />
						<div class="relative">
							<HandHeart class={hasQuoteImage ? 'text-white' : 'text-rose-600'} size={28} />
							<blockquote
								class="mt-4 text-xl font-medium leading-relaxed {hasQuoteImage ? 'text-white' : 'text-zinc-800'}"
							>
								"{about.quote}"
							</blockquote>
							<p class="mt-4 text-sm {hasQuoteImage ? 'text-rose-50/90' : 'text-zinc-500'}">
								{about.quoteSub}
							</p>
						</div>
					</div>
				</div>
			</section>

		{:else if key === 'programs'}
			<section id="program" class="bg-zinc-50 py-20">
				<div class="mx-auto max-w-6xl px-6">
					<div class="text-center">
						<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{programs.eyebrow}</p>
						<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{programs.title}</h2>
						<p class="mx-auto mt-3 max-w-2xl text-zinc-600">{programs.subtitle}</p>
					</div>
					<ProgramsExplorer {programsByCore} />
					<div class="mt-8 text-center">
						<a href={programs.ctaHref} class="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:text-rose-800">
							{programs.ctaLabel}
							<ArrowRight size={16} />
						</a>
					</div>
				</div>
			</section>

		{:else if key === 'impact'}
			<section id="impak" class="mx-auto max-w-6xl px-6 py-20">
				<div class="text-center">
					<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{impact.eyebrow}</p>
					<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{impact.title}</h2>
					{#if impact.subtitle}
						<p class="mx-auto mt-3 max-w-2xl text-zinc-600">{impact.subtitle}</p>
					{/if}
				</div>
				<ImpactStats stats={impact.stats} />
			</section>

		{:else if key === 'customSections'}
			<CustomSections sections={content.customSections?.home} />

		{:else if key === 'gallery'}
			{#if homeGallery}<HomeGallery gallery={homeGallery} />{/if}

		{:else if key === 'partners'}
			{#if partners}<HomePartners {partners} />{/if}

		{:else if key === 'cta'}
			<section class="relative overflow-hidden bg-gradient-to-r from-rose-600 to-rose-700 py-16 text-white">
				<SectionBg images={cta.bgImages} overlay={cta.overlay} />
				<div class="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
					<div class="flex items-center gap-3">
						<Users size={26} />
						<Sprout size={26} />
					</div>
					<h2 class="max-w-2xl text-3xl font-bold tracking-tight">{cta.heading}</h2>
					<p class="max-w-xl text-rose-50">{cta.body}</p>
					<div class="flex flex-wrap justify-center gap-3">
						<a href={cta.primaryCta.href} class="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition-transform hover:-translate-y-0.5">
							{cta.primaryCta.label}
						</a>
						<a href={cta.secondaryCta.href} class="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
							{cta.secondaryCta.label}
						</a>
					</div>
				</div>
			</section>
		{/if}
	{/each}
</PublicShell>
