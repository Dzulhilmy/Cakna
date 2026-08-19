<script lang="ts">
	import type { SiteContent } from '$lib/site';
	let { partners }: { partners: NonNullable<SiteContent['partners']> } = $props();
	const logos = $derived(partners.logos ?? []);
</script>

{#if logos.length > 0}
	<section class="bg-zinc-50 py-16">
		<div class="mx-auto max-w-6xl px-6">
			{#if partners.eyebrow || partners.title || partners.subtitle}
				<div class="mb-10 text-center">
					{#if partners.eyebrow}<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{partners.eyebrow}</p>{/if}
					{#if partners.title}<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{partners.title}</h2>{/if}
					{#if partners.subtitle}<p class="mx-auto mt-3 max-w-2xl text-zinc-600">{partners.subtitle}</p>{/if}
				</div>
			{/if}
			<div class="flex flex-wrap items-center justify-center gap-8">
				{#each logos as src, i}
					<div class="flex h-[120px] w-[120px] items-center justify-center rounded-xl bg-transparent p-0">
						<img src={src} alt="" class="h-[120px] w-[120px] object-contain" loading="lazy" />
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}
