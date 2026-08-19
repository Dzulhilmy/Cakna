<script lang="ts">
	import type { SiteContent } from '$lib/site';
	let { gallery }: { gallery: NonNullable<SiteContent['homeGallery']> } = $props();
</script>

{#if gallery.images && gallery.images.length > 0}
	<section class="mx-auto max-w-6xl px-6 py-16">
		{#if gallery.title}
			<h2 class="mb-8 text-center text-2xl font-bold tracking-tight text-zinc-900">{gallery.title}</h2>
		{/if}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{#each gallery.images as src, i}
				<div class="aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200">
					<img src={src} alt="" class="h-full w-full object-cover" loading="lazy" />
				</div>
			{/each}
		</div>
	</section>
{/if}
