<script lang="ts">
	import type { CustomSection } from '$lib/site';
	import SectionBg from './SectionBg.svelte';
	import { hasBg } from '$lib/bg-utils';
	let { sections }: { sections?: CustomSection[] } = $props();
</script>

{#if sections && sections.length > 0}
	{#each sections as s (s.id)}
		{@const bg = s.background === 'tint' ? 'bg-rose-50/60' : 'bg-white'}
		<section class={bg}>
			<div class="mx-auto max-w-6xl px-6 py-16 sm:py-20">
				<!-- Section header -->
				{#if s.eyebrow || s.title}
					<div class="mx-auto max-w-3xl text-center mb-10">
						{#if s.eyebrow}<p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{s.eyebrow}</p>{/if}
						{#if s.title}<h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{s.title}</h2>{/if}
					</div>
				{/if}

				<!-- Blocks -->
				<div class="mx-auto max-w-3xl space-y-6">
					{#each s.blocks as block (block.id)}
						{#if block.type === 'paragraph'}
							{#if block.content?.trim()}
								{@const alignClass = block.align === 'center' ? 'text-center' : block.align === 'right' ? 'text-right' : block.align === 'justify' ? 'text-justify' : 'text-left'}
								<p class="leading-relaxed text-zinc-600 {alignClass}">{block.content}</p>
							{/if}

						{:else if block.type === 'text'}
							{#if block.content?.trim()}
								<p class="text-base font-semibold text-zinc-800">{block.content}</p>
							{/if}

						{:else if block.type === 'image'}
							{@const imgs = block.images ?? []}
							{@const style = block.imageStyle ?? 'gallery'}
							{#if imgs.length > 0}
								<div class="w-full">
									{#if style === 'background' || style === 'both'}
										<div class="relative overflow-hidden rounded-2xl aspect-video">
											<SectionBg images={[imgs[0]]} overlay="medium" />
											{#if block.caption}
												<p class="absolute bottom-0 inset-x-0 bg-black/40 px-4 py-2 text-xs text-white text-center">{block.caption}</p>
											{/if}
										</div>
										{#if style === 'both' && imgs.length > 1}
											<div class="mt-4 grid gap-4 {imgs.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}">
												{#each imgs.slice(1) as src}<img src={src} alt="" class="aspect-[4/3] w-full rounded-xl border border-zinc-200 object-cover" />{/each}
											</div>
										{/if}
									{:else}
										<div class="grid gap-4 {imgs.length === 1 ? 'grid-cols-1' : imgs.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}">
											{#each imgs as src}<img src={src} alt="" class="aspect-[4/3] w-full rounded-xl border border-zinc-200 object-cover" />{/each}
										</div>
										{#if block.caption}<p class="mt-2 text-xs text-center text-zinc-400">{block.caption}</p>{/if}
									{/if}
								</div>
							{/if}

						{:else if block.type === 'bulletList'}
							{@const items = (block.items ?? []).filter((i) => i.trim())}
							{#if items.length > 0}
								<ul class="space-y-2">
									{#each items as item}
										<li class="flex items-start gap-2.5">
											<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500"></span>
											<span class="leading-relaxed text-zinc-600">{item}</span>
										</li>
									{/each}
								</ul>
							{/if}
						{/if}
					{/each}
				</div>

				<!-- Optional CTA -->
				{#if s.ctaLabel?.trim()}
					<div class="mt-10 text-center">
						<a href={s.ctaHref?.trim() || '#'}
							class="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition-colors hover:bg-rose-700">
							{s.ctaLabel}
						</a>
					</div>
				{/if}
			</div>
		</section>
	{/each}
{/if}
